"""
Approved Plan Repository-Aware Validation Engine for AWS Follow Along Learning Path Generator.

Performs empirical, repository-aware validation of human-reviewed approved plans
(plans/<programmeId>-approved.json) against live codebase state.
"""

from pathlib import Path
import json
import re
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple, Set

from scripts.generator.inspector import (
    find_repository_root,
    inspect_repository,
    calculate_task_file_fingerprint,
    parse_task_file_safely
)
from scripts.generator.schema import validate_approved_plan, validate_repository_relative_path


def validate_approved_plan_file(
    approved_plan_path: Path | str,
    topic: Optional[str] = None,
    start_path: Optional[Path | str] = None
) -> Tuple[bool, Dict[str, Any], int]:
    """
    Validates an approved plan JSON file against live repository state.

    Returns (is_valid, result_dict, exit_code).
      Exit Code 0: Plan is fully valid.
      Exit Code 6: Plan validation failed (one or more errors).
      Exit Code 7: Approved plan file not found.
    """
    repo_root = find_repository_root(start_path)
    plan_path = Path(approved_plan_path)

    # Convert to absolute path if relative to repo_root
    if not plan_path.is_absolute():
        plan_path = repo_root / plan_path

    # Check File Existence
    if not plan_path.exists() or not plan_path.is_file():
        msg = f"Approved plan file not found at '{approved_plan_path}'."
        return False, {"error": msg, "errors": [msg]}, 7

    # Path Safety Check
    rel_plan_path = str(plan_path.relative_to(repo_root)).replace("\\", "/") if plan_path.is_relative_to(repo_root) else str(plan_path)
    is_safe_path, path_err = validate_repository_relative_path(rel_plan_path, "plan_path")
    if not is_safe_path or not rel_plan_path.startswith("plans/") or not rel_plan_path.endswith("-approved.json"):
        msg = f"Approved plan file path '{rel_plan_path}' is unsafe or invalid. Must be inside plans/ and end with -approved.json."
        return False, {"error": msg, "errors": [msg]}, 6

    # Load JSON Payload
    try:
        with open(plan_path, "r", encoding="utf-8") as f:
            plan_data = json.load(f)
    except Exception as e:
        msg = f"Failed to parse approved plan JSON file: {e}"
        return False, {"error": msg, "errors": [msg]}, 6

    errors: List[str] = []
    warnings: List[str] = []
    info: List[str] = []
    checks: Dict[str, bool] = {}

    # Step 1: Structural Validation via schema.py
    struct_res = validate_approved_plan(plan_data, repo_root)
    if not struct_res.get("valid", False):
        checks["structural_schema"] = False
        for err_obj in struct_res.get("errors", []):
            if isinstance(err_obj, dict):
                errors.append(f"[{err_obj.get('field', 'schema')}] {err_obj.get('message', '')}")
            else:
                errors.append(str(err_obj))
        return False, {
            "valid": False,
            "errors": errors,
            "warnings": warnings,
            "information": info,
            "checks": checks,
            "plan_path": rel_plan_path,
            "programme_id": plan_data.get("programmeId", "unknown")
        }, 6
    checks["structural_schema"] = True

    # Step 2: Approval Status & Identity Gate
    if plan_data.get("approved") is not True or plan_data.get("status") != "approved":
        errors.append("Plan must have 'approved': true and 'status': 'approved'. Draft plans cannot be validated as approved.")
        checks["approval_status"] = False
    else:
        checks["approval_status"] = True

    approved_by = plan_data.get("approvedBy")
    approved_at = plan_data.get("approvedAt")
    if not approved_by or not isinstance(approved_by, str) or not approved_by.strip():
        errors.append("Plan is missing a valid 'approvedBy' human reviewer identity.")
        checks["approved_by"] = False
    else:
        checks["approved_by"] = True

    if not approved_at or not isinstance(approved_at, str):
        errors.append("Plan is missing a valid 'approvedAt' timestamp.")
        checks["approved_at"] = False
    else:
        try:
            # Validate ISO-8601 timestamp
            datetime.fromisoformat(approved_at.replace("Z", "+00:00"))
            checks["approved_at"] = True
        except Exception:
            errors.append(f"Invalid 'approvedAt' ISO-8601 timestamp '{approved_at}'.")
            checks["approved_at"] = False

    # Step 3: Programme Identity & Topic Alignment
    svc_slug = plan_data.get("service", "").lower().strip()
    programme_id = plan_data.get("programmeId", "").strip()

    if topic and topic.lower().strip() != svc_slug:
        errors.append(f"Topic mismatch: CLI topic '{topic}' does not match plan service '{svc_slug}'.")
        checks["topic_alignment"] = False
    else:
        checks["topic_alignment"] = True

    expected_programme_id = f"{svc_slug}-learning-path"
    if programme_id != expected_programme_id:
        errors.append(f"Programme ID mismatch: Plan programmeId '{programme_id}' does not match expected '{expected_programme_id}'.")
        checks["programme_id_alignment"] = False
    else:
        checks["programme_id_alignment"] = True

    # Protect existing Follow Alongs (VPC & EC2)
    repo_info = inspect_repository(repo_root)
    existing_follow_alongs = repo_info.get("existing_follow_alongs", [])
    if any(fa["programme_id"] == programme_id for fa in existing_follow_alongs):
        errors.append(f"A Follow Along already exists for programme '{programme_id}'. Overwriting or duplicate planning is blocked.")
        checks["existing_follow_along_protection"] = False
    else:
        checks["existing_follow_along_protection"] = True

    # Step 4: Canonical Source File & SHA-256 Fingerprint Verification
    task_file_rel = plan_data.get("canonicalTaskFile", "")
    task_file_abs = repo_root / task_file_rel

    if not task_file_abs.exists() or not task_file_abs.is_file():
        errors.append(f"Canonical task file '{task_file_rel}' does not exist in repository.")
        checks["canonical_task_file_exists"] = False
    else:
        checks["canonical_task_file_exists"] = True
        live_fingerprint = calculate_task_file_fingerprint(task_file_abs)
        plan_fingerprint = plan_data.get("canonicalTaskFingerprint")

        if live_fingerprint != plan_fingerprint:
            errors.append("Canonical task source changed after plan approval. The plan must be reviewed and approved again.")
            checks["fingerprint_match"] = False
        else:
            checks["fingerprint_match"] = True

    # Step 5: 100% Canonical Task Inventory & Classification Audit
    if task_file_abs.exists() and task_file_abs.is_file():
        parse_result = parse_task_file_safely(task_file_abs)
        live_task_ids = parse_result.get("task_ids", [])
        live_export_var = parse_result.get("export_variable")
        live_task_count = parse_result.get("task_count")

        if plan_data.get("canonicalExportVariable") != live_export_var:
            errors.append(f"Export variable mismatch: Plan specifies '{plan_data.get('canonicalExportVariable')}' but live file has '{live_export_var}'.")
            checks["export_variable_match"] = False
        else:
            checks["export_variable_match"] = True

        if plan_data.get("canonicalTaskCount") != live_task_count:
            errors.append(f"Canonical task count mismatch: Plan specifies {plan_data.get('canonicalTaskCount')} but live file has {live_task_count}.")
            checks["task_count_match"] = False
        else:
            checks["task_count_match"] = True

        plan_inventory = plan_data.get("canonicalTaskInventory", [])
        plan_canonical_ids = [item.get("id") for item in plan_inventory if isinstance(item, dict) and "id" in item]

        # Check for missing, duplicate, or unknown canonical IDs
        if len(plan_canonical_ids) != len(set(plan_canonical_ids)):
            errors.append("Duplicate canonical task IDs detected in plan's canonicalTaskInventory.")
            checks["canonical_inventory_unique"] = False
        else:
            checks["canonical_inventory_unique"] = True

        missing_ids = set(live_task_ids) - set(plan_canonical_ids)
        if missing_ids:
            errors.append(f"Omitted canonical task IDs from plan: {sorted(list(missing_ids))}.")
            checks["canonical_inventory_complete"] = False
        else:
            checks["canonical_inventory_complete"] = True

        unknown_ids = set(plan_canonical_ids) - set(live_task_ids)
        if unknown_ids:
            errors.append(f"Unknown canonical task IDs in plan that do not exist in canonical file: {sorted(list(unknown_ids))}.")
            checks["canonical_inventory_valid"] = False
        else:
            checks["canonical_inventory_valid"] = True

        # Check for unresolved tasks
        unresolved_tasks = [
            item.get("id") for item in plan_inventory
            if isinstance(item, dict) and (item.get("classification") == "unresolved" or item.get("proposedPhase") == "unresolved")
        ]
        if unresolved_tasks:
            errors.append(f"Plan contains unresolved canonical tasks: {unresolved_tasks}. Scaffolding is blocked.")
            checks["no_unresolved_tasks"] = False
        else:
            checks["no_unresolved_tasks"] = True

        # Path-only ID collision check
        path_only_tasks = plan_data.get("proposedPathOnlyTasks", [])
        path_only_ids = [t.get("id") for t in path_only_tasks if isinstance(t, dict) and "id" in t]

        if len(path_only_ids) != len(set(path_only_ids)):
            errors.append("Duplicate path-only task IDs detected in plan.")
            checks["path_only_unique"] = False
        else:
            checks["path_only_unique"] = True

        colliding_ids = set(path_only_ids).intersection(set(live_task_ids))
        if colliding_ids:
            errors.append(f"Path-only task IDs collide with canonical task IDs: {sorted(list(colliding_ids))}.")
            checks["path_only_no_collision"] = False
        else:
            checks["path_only_no_collision"] = True

    # Step 6: Task Prerequisites DAG Cycle & Dependency Validation
    all_plan_task_ids = set()
    for item in plan_data.get("canonicalTaskInventory", []):
        if isinstance(item, dict) and "id" in item:
            all_plan_task_ids.add(item["id"])
    for t in plan_data.get("proposedPathOnlyTasks", []):
        if isinstance(t, dict) and "id" in t:
            all_plan_task_ids.add(t["id"])

    optional_task_ids = set(plan_data.get("optionalTaskProposals", []))
    dag: Dict[str, List[str]] = {}
    prereq_errors = False

    for item in plan_data.get("canonicalTaskInventory", []) + plan_data.get("proposedPathOnlyTasks", []):
        if not isinstance(item, dict) or "id" not in item:
            continue
        tid = item["id"]
        prereqs = item.get("prerequisites", [])

        if tid in prereqs:
            errors.append(f"Task '{tid}' has a self-dependency.")
            prereq_errors = True

        for pre in prereqs:
            if pre not in all_plan_task_ids:
                errors.append(f"Task '{tid}' depends on non-existent task '{pre}'.")
                prereq_errors = True

            if tid not in optional_task_ids and pre in optional_task_ids:
                errors.append(f"Required task '{tid}' depends on optional task '{pre}'.")
                prereq_errors = True

        dag[tid] = prereqs

    checks["dependencies_valid"] = not prereq_errors

    # Cycle Detection using DFS
    visited: Dict[str, int] = {}  # 0: unvisited, 1: visiting, 2: visited
    has_cycle = False

    def dfs(node: str) -> bool:
        visited[node] = 1
        for neighbor in dag.get(node, []):
            if neighbor not in visited or visited[neighbor] == 0:
                if dfs(neighbor):
                    return True
            elif visited[neighbor] == 1:
                return True
        visited[node] = 2
        return False

    for node in dag:
        if visited.get(node, 0) == 0:
            if dfs(node):
                has_cycle = True
                break

    if has_cycle:
        errors.append("Dependency cycle detected in task prerequisites DAG.")
        checks["no_dependency_cycles"] = False
    else:
        checks["no_dependency_cycles"] = True

    # Step 7: Resource Creation & Lifecycle Validation
    resource_bindings = plan_data.get("proposedResourceBindings", {})
    protected_resources = set(plan_data.get("protectedResourceProposals", []))

    # Reserved resource key collisions (VPC & EC2)
    forbidden_resource_keys = {"vpcId", "publicSubnetAz1", "privateSubnetAz1", "internetGatewayId", "primaryInstanceId"}
    colliding_keys = set(resource_bindings.keys()).intersection(forbidden_resource_keys)
    if colliding_keys:
        errors.append(f"Resource bindings collide with forbidden VPC/EC2 system keys: {sorted(list(colliding_keys))}.")
        checks["resource_keys_scoped"] = False
    else:
        checks["resource_keys_scoped"] = True

    # Destructive task bindings vs protected resources
    destructive_bindings = plan_data.get("destructiveTaskProposals", {})
    for tid, res_key in destructive_bindings.items():
        if res_key in protected_resources:
            errors.append(f"Destructive task '{tid}' targets protected resource '{res_key}'.")
            checks["protected_resources_safe"] = False
            break
    else:
        checks["protected_resources_safe"] = True

    # Step 8: Approved Output & Modification Files Allowlist Enforcement
    output_files = plan_data.get("approvedOutputFiles", [])
    mod_files = plan_data.get("approvedModificationFiles", [])

    all_approved_paths = set(output_files).union(set(mod_files))
    path_errors = False

    for p in all_approved_paths:
        is_p_safe, _ = validate_repository_relative_path(p, "approved_file")
        if not is_p_safe:
            errors.append(f"Approved file path '{p}' is unsafe or invalid.")
            path_errors = True

        # Forbidden targets
        if p.startswith("src/data/tasks/") or p.startswith("src/data/vpc") or p.startswith("src/data/ec2") or p in ["package.json", "package-lock.json"]:
            errors.append(f"Approved file path '{p}' attempts to modify forbidden canonical/VPC/EC2/package files.")
            path_errors = True

    checks["approved_files_safe"] = not path_errors

    is_valid = len(errors) == 0

    return is_valid, {
        "valid": is_valid,
        "errors": errors,
        "warnings": warnings,
        "information": info,
        "checks": checks,
        "plan_path": rel_plan_path,
        "programme_id": programme_id,
        "canonical_fingerprint": plan_data.get("canonicalTaskFingerprint")
    }, (0 if is_valid else 6)
