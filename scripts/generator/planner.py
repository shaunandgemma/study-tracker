"""
Draft Implementation Plan Generator Engine for AWS Follow Along Learning Path Generator.

Generates unapproved draft implementation plans in plans/<programmeId>-draft.json
from canonical Hands-On Task inventories using atomic file writes and strict
collision protection without modifying production application code.
"""

from pathlib import Path
import json
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from scripts.generator.inspector import (
    find_repository_root,
    inspect_repository,
    calculate_task_file_fingerprint,
    parse_task_file_safely
)


def validate_programme_id(programme_id: str, existing_programme_ids: List[str]) -> bool:
    """
    Validates a programme ID string for path safety and uniqueness.

    Rejects absolute paths, slashes, parent traversal (..), empty/whitespace strings,
    unsupported characters, or existing programme IDs.
    """
    if not programme_id or not isinstance(programme_id, str):
        return False

    clean_id = programme_id.strip()
    if not clean_id or clean_id != programme_id:
        return False

    if "/" in clean_id or "\\" in clean_id or ".." in clean_id:
        return False

    if Path(clean_id).is_absolute() or Path(clean_id).drive != "":
        return False

    if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", clean_id):
        return False

    if clean_id in existing_programme_ids:
        return False

    return True


def propose_phases_for_service(service_slug: str, tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Groups canonical task inventory into logical proposed phases.

    Includes explicit confidence ratings and requiresHumanReview=True.
    """
    total_tasks = len(tasks)
    if total_tasks == 0:
        return []

    # Calculate optimal phase count (e.g. 4-8 phases based on task volume)
    num_phases = min(8, max(3, (total_tasks + 4) // 5))
    tasks_per_phase = (total_tasks + num_phases - 1) // num_phases

    phases: List[Dict[str, Any]] = []

    for p in range(num_phases):
        start_idx = p * tasks_per_phase
        end_idx = min(total_tasks, (p + 1) * tasks_per_phase)
        phase_task_ids = [t["id"] for t in tasks[start_idx:end_idx]]

        if not phase_task_ids:
            continue

        title_suffix = "Foundation & Core Setup" if p == 0 else (
            "Security & Permissions" if p == 1 else (
                "Access Control & Policies" if p == 2 else (
                    "Configuration & Integration" if p == 3 else (
                        "Advanced Operations & Management" if p == 4 else (
                            "Optimization & Monitoring" if p == 5 else (
                                "Resilience & Cross-Region Setup" if p == 6 else "Final Teardown & Review"
                            )
                        )
                    )
                )
            )
        )

        phases.append({
            "phase": p + 1,
            "title": f"{service_slug.upper()} Phase {p + 1}: {title_suffix}",
            "taskIds": phase_task_ids,
            "confidence": "medium",
            "reason": f"Heuristic grouping of {len(phase_task_ids)} canonical tasks based on catalogue sequence.",
            "requiresHumanReview": True
        })

    return phases


def generate_draft_plan(service_name: str, start_path: Optional[Path | str] = None) -> Tuple[Optional[Path], Dict[str, Any], int]:
    """
    Generates an unapproved draft implementation plan JSON file for a specified service.

    Returns (output_file_path, plan_data_or_error_dict, exit_code).
    """
    repo_root = find_repository_root(start_path)
    repo_info = inspect_repository(repo_root)

    slug = service_name.lower().strip()
    programme_id = f"{slug}-learning-path"

    existing_follow_alongs = repo_info.get("existing_follow_alongs", [])
    existing_programme_ids = repo_info.get("programme_ids", [])
    canonical_services = repo_info.get("canonical_services", [])

    # Check 1: Check if Follow Along already exists for this service
    is_existing_fa = any(
        fa["service_prefix"] == slug or fa["programme_id"] == programme_id or fa["programme_id"] == slug
        for fa in existing_follow_alongs
    )
    if is_existing_fa:
        msg = f"A Follow Along already exists for service '{slug}'. No files were changed."
        return None, {"error": msg}, 2

    # Check 2: Find canonical service discovery entry
    svc = next((s for s in canonical_services if s["service_slug"] == slug), None)
    if not svc:
        msg = f"No canonical Hands-On Task file was found for '{slug}'. Draft Follow Along planning is blocked. No files were created."
        return None, {"error": msg}, 2

    # Check 3: Parser confidence must be high
    conf = svc.get("parser_confidence", "low")
    if conf != "high":
        msg = f"Canonical task inventory for '{slug}' is unvalidated (Confidence: {conf.capitalize()}). Draft Follow Along planning is blocked."
        return None, {"error": msg}, 4

    task_count = svc.get("task_count")
    task_ids = svc.get("task_ids", [])
    task_file_rel = svc.get("relative_path", "")
    task_file_abs = Path(svc.get("absolute_path", ""))
    export_var = svc.get("export_variable")
    fingerprint = svc.get("fingerprint")
    warnings = svc.get("warnings", [])

    if not task_ids or task_count is None or task_count == 0:
        msg = f"Canonical task file for '{slug}' contains 0 extracted tasks. Planning is blocked."
        return None, {"error": msg}, 4

    # Check 4: Programme ID safety
    if not validate_programme_id(programme_id, existing_programme_ids):
        msg = f"Invalid or unsafe programme ID '{programme_id}'. Draft planning is blocked."
        return None, {"error": msg}, 2

    # Output directory rules
    plans_dir = repo_root / "plans"
    output_filename = f"{programme_id}-draft.json"
    output_file = plans_dir / output_filename
    tmp_file = plans_dir / f"{output_filename}.tmp"

    # Collision Check
    if output_file.exists():
        msg = f"Draft plan 'plans/{output_filename}' already exists. No files were changed."
        return output_file, {"message": msg, "collision": True}, 0

    # Build Canonical Task Inventory
    parse_result = parse_task_file_safely(task_file_abs)
    raw_tasks = parse_result.get("tasks", [])
    duplicate_task_ids = parse_result.get("duplicate_task_ids", [])

    if duplicate_task_ids:
        msg = f"Duplicate canonical task IDs detected in '{task_file_rel}': {duplicate_task_ids}. Planning is blocked."
        return None, {"error": msg}, 4

    canonical_inventory: List[Dict[str, Any]] = []
    for t in raw_tasks:
        canonical_inventory.append({
            "id": t["id"],
            "title": t["title"],
            "classification": "core",
            "proposedPhase": 1
        })

    # Propose phases
    proposed_phases = propose_phases_for_service(slug, raw_tasks)

    # Update canonical inventory with proposed phases
    for p in proposed_phases:
        p_num = p["phase"]
        for tid in p["taskIds"]:
            for item in canonical_inventory:
                if item["id"] == tid:
                    item["proposedPhase"] = p_num

    # Construct Proposed Path-Only Teardown Wizard Task
    teardown_task_id = f"path-{slug}-project-final-cleanup"
    proposed_path_only = [
        {
            "id": teardown_task_id,
            "title": f"Interactive {slug.upper()} Project Final Teardown Wizard",
            "phase": len(proposed_phases) if proposed_phases else 1,
            "type": "teardown-wizard"
        }
    ]

    # Proposed Output & Modification Files
    cap_slug = slug.capitalize()
    proposed_outputs = [
        f"src/data/{slug}LearningPathData.js",
        f"src/services/{slug}LearningPathService.js",
        f"src/components/{cap_slug}LearningPath/{cap_slug}LearningPathView.jsx",
        f"src/components/{cap_slug}LearningPath/{cap_slug}PathDashboard.jsx",
        f"src/components/{cap_slug}LearningPath/{cap_slug}PathNavigator.jsx",
        f"src/components/{cap_slug}LearningPath/{cap_slug}TaskRunner.jsx",
        f"src/components/{cap_slug}LearningPath/{cap_slug}ProjectCleanup.jsx",
        f"tests/{slug}LearningPath.test.js"
    ]

    proposed_modifications = [
        "src/data/followAlongProgrammes.js",
        "src/components/FollowAlongs/FollowAlongsView.jsx",
        "src/components/FollowAlongs/FollowAlongLandingPage.jsx"
    ]

    # Extract canonical task IDs list for schema compatibility
    canonical_task_ids_list = [t["id"] for t in canonical_inventory]
    phase_task_ids_list = [t["id"] for t in proposed_path_only]

    # Assemble complete Draft Plan JSON
    plan_data: Dict[str, Any] = {
        "schema_version": "1.0",
        "status": "draft",
        "approved": False,
        "approvedBy": None,
        "approvedAt": None,
        "notice": "DRAFT IMPLEMENTATION PLAN - HUMAN REVIEW REQUIRED - NO IMPLEMENTATION AUTHORIZED",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "service": slug,
        "programmeId": programme_id,
        "canonicalTaskFile": task_file_rel,
        "canonicalTaskFingerprint": fingerprint,
        "canonicalExportVariable": export_var,
        "canonicalTaskCount": task_count,
        "canonicalTaskIds": canonical_task_ids_list,
        "canonicalTaskInventory": canonical_inventory,
        "pathOnlyTasks": phase_task_ids_list,
        "phases": proposed_phases,
        "proposedPhases": proposed_phases,
        "proposedPathOnlyTasks": proposed_path_only,
        "resourceBindings": {},
        "proposedResourceBindings": {},
        "protectedResourceKeys": [],
        "protectedResourceProposals": [],
        "optionalTaskIds": [],
        "optionalTaskProposals": [],
        "destructiveTaskBindings": {},
        "destructiveTaskProposals": {},
        "cleanupOrder": [teardown_task_id],
        "cleanupOrderProposal": [teardown_task_id],
        "acknowledgedWarnings": [],
        "auditSummary": {
            "discoveredCanonicalCount": task_count,
            "proposedCorePathCount": task_count,
            "optionalCanonicalCount": 0,
            "reviewOnlyCanonicalCount": 0,
            "omittedCanonicalCount": 0,
            "duplicateIds": duplicate_task_ids,
            "proposedPathOnlyCount": len(proposed_path_only),
            "totalProposedProgrammeCount": task_count + len(proposed_path_only)
        },
        "warnings": warnings,
        "unresolvedDecisions": [
            {
                "key": "phase_groupings",
                "description": f"Proposed {len(proposed_phases)} phase groupings require human validation against AWS exam objectives.",
                "severity": "medium"
            },
            {
                "key": "resource_bindings",
                "description": "Primary resource bindings and state keys must be declared during human plan review.",
                "severity": "medium"
            }
        ],
        "approvedOutputFiles": proposed_outputs,
        "approvedModificationFiles": proposed_modifications,
        "approvedStages": [
            "data-layer",
            "service-layer",
            "components",
            "test-suite",
            "landing-integration"
        ]
    }

    # Atomic File Write Implementation
    try:
        plans_dir.mkdir(parents=True, exist_ok=True)
        with open(tmp_file, "w", encoding="utf-8") as f:
            json.dump(plan_data, f, indent=2)
            f.flush()

        tmp_file.replace(output_file)
        return output_file, plan_data, 0
    except Exception as e:
        if tmp_file.exists():
            try:
                tmp_file.unlink()
            except Exception:
                pass
        msg = f"Failed to write draft plan to disk: {e}"
        return None, {"error": msg}, 1
