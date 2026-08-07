"""
Approved-Plan Schema Parser & Structural Validation Module.

Defines structural validation rules for Follow Along approved plans using only
the Python standard library.
"""

from pathlib import Path
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple, Set


ALLOWED_STAGES: Set[str] = {
    "data-layer",
    "service-layer",
    "components",
    "test-suite",
    "landing-integration"
}

REQUIRED_PLAN_FIELDS: Set[str] = {
    "schema_version",
    "approved",
    "approvedBy",
    "approvedAt",
    "service",
    "programmeId",
    "canonicalTaskFile",
    "canonicalTaskFingerprint",
    "canonicalTaskIds",
    "pathOnlyTasks",
    "phases",
    "resourceBindings",
    "protectedResourceKeys",
    "optionalTaskIds",
    "destructiveTaskBindings",
    "cleanupOrder",
    "approvedOutputFiles",
    "approvedModificationFiles",
    "approvedStages",
    "acknowledgedWarnings"
}


def validate_repository_relative_path(path_str: str, field_name: str) -> Tuple[bool, Optional[str]]:
    """
    Validates that a path string is a clean, repository-relative path.

    Rejects absolute paths, root-relative paths, empty paths, and parent traversal ('..').
    """
    if not isinstance(path_str, str) or not path_str.strip():
        return False, f"Field '{field_name}' must be a non-empty string path."

    clean_path = path_str.strip().replace("\\", "/")

    # Reject absolute or root-leading paths (/etc/passwd, C:/foo, etc.)
    p = Path(clean_path)
    if clean_path.startswith("/") or clean_path.startswith("\\") or p.is_absolute() or p.drive != "":
        return False, f"Field '{field_name}' path '{path_str}' must not be an absolute or root-relative path."

    # Reject parent directory traversal
    parts = p.parts
    if ".." in parts:
        return False, f"Field '{field_name}' path '{path_str}' contains forbidden parent traversal ('..')."

    return True, None


def validate_iso8601_timestamp(timestamp_str: str) -> bool:
    """Checks if a string is a valid ISO-8601 timestamp."""
    if not isinstance(timestamp_str, str):
        return False
    try:

        datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def validate_approved_plan(plan_data: Dict[str, Any], repo_root: Optional[Path] = None) -> Dict[str, Any]:
    """
    Performs comprehensive structural validation of a Follow Along plan dictionary.

    Returns a structured dictionary:
    {
        "valid": bool,
        "errors": [{"field": str, "message": str}],
        "warnings": [str]
    }
    """
    errors: List[Dict[str, str]] = []
    warnings: List[str] = []

    if not isinstance(plan_data, dict):
        return {
            "valid": False,
            "errors": [{"field": "root", "message": "Plan data must be a JSON object (dict)."}],
            "warnings": []
        }

    # 1. Approved flag check
    approved = plan_data.get("approved")
    if approved is not True:
        errors.append({
            "field": "approved",
            "message": "Field 'approved' must be boolean True for an approved plan."
        })

    # 2. Required fields check
    for field in REQUIRED_PLAN_FIELDS:
        if field not in plan_data:
            errors.append({
                "field": field,
                "message": f"Missing required plan field '{field}'."
            })

    # 3. String fields validation
    string_fields = [
        "schema_version", "approvedBy", "approvedAt", "service",
        "programmeId", "canonicalTaskFile", "canonicalTaskFingerprint"
    ]
    for field in string_fields:
        val = plan_data.get(field)
        if field in plan_data and (not isinstance(val, str) or not val.strip()):
            errors.append({
                "field": field,
                "message": f"Field '{field}' must be a non-empty string."
            })

    # 4. Timestamp format validation
    approved_at = plan_data.get("approvedAt")
    if isinstance(approved_at, str) and approved_at.strip():
        if not validate_iso8601_timestamp(approved_at):
            errors.append({
                "field": "approvedAt",
                "message": f"Field 'approvedAt' value '{approved_at}' is not a valid ISO-8601 timestamp."
            })

    # 5. Path safety checks
    canonical_task_file = plan_data.get("canonicalTaskFile")
    if isinstance(canonical_task_file, str):
        valid_path, err_msg = validate_repository_relative_path(canonical_task_file, "canonicalTaskFile")
        if not valid_path and err_msg:
            errors.append({"field": "canonicalTaskFile", "message": err_msg})

    approved_output_files = plan_data.get("approvedOutputFiles", [])
    if isinstance(approved_output_files, list):
        seen_outputs: Set[str] = set()
        for idx, out_path in enumerate(approved_output_files):
            if isinstance(out_path, str):
                valid_p, err_m = validate_repository_relative_path(out_path, f"approvedOutputFiles[{idx}]")
                if not valid_p and err_m:
                    errors.append({"field": f"approvedOutputFiles[{idx}]", "message": err_m})

                if out_path in seen_outputs:
                    errors.append({
                        "field": "approvedOutputFiles",
                        "message": f"Duplicate path '{out_path}' in approvedOutputFiles."
                    })
                seen_outputs.add(out_path)
            else:
                errors.append({
                    "field": f"approvedOutputFiles[{idx}]",
                    "message": "Output file path must be a string."
                })

    approved_modification_files = plan_data.get("approvedModificationFiles", [])
    if isinstance(approved_modification_files, list):
        seen_mods: Set[str] = set()
        for idx, mod_path in enumerate(approved_modification_files):
            if isinstance(mod_path, str):
                valid_p, err_m = validate_repository_relative_path(mod_path, f"approvedModificationFiles[{idx}]")
                if not valid_p and err_m:
                    errors.append({"field": f"approvedModificationFiles[{idx}]", "message": err_m})

                if mod_path in seen_mods:
                    errors.append({
                        "field": "approvedModificationFiles",
                        "message": f"Duplicate path '{mod_path}' in approvedModificationFiles."
                    })
                seen_mods.add(mod_path)
            else:
                errors.append({
                    "field": f"approvedModificationFiles[{idx}]",
                    "message": "Modification file path must be a string."
                })

    # Cross check: path appearing in BOTH output and modification lists
    if isinstance(approved_output_files, list) and isinstance(approved_modification_files, list):
        overlap_paths = set(approved_output_files).intersection(set(approved_modification_files))
        for p in overlap_paths:
            errors.append({
                "field": "approvedOutputFiles/approvedModificationFiles",
                "message": f"Path '{p}' cannot appear in both approvedOutputFiles and approvedModificationFiles."
            })

    # 6. ID Uniqueness & Overlap checks
    canonical_ids = plan_data.get("canonicalTaskIds", [])
    path_only_tasks = plan_data.get("pathOnlyTasks", [])

    canonical_set: Set[str] = set()
    if isinstance(canonical_ids, list):
        for cid in canonical_ids:
            if isinstance(cid, str):
                if cid in canonical_set:
                    errors.append({
                        "field": "canonicalTaskIds",
                        "message": f"Duplicate canonical task ID '{cid}'."
                    })
                canonical_set.add(cid)

    path_only_set: Set[str] = set()
    if isinstance(path_only_tasks, list):
        for po_task in path_only_tasks:
            po_id = po_task.get("id") if isinstance(po_task, dict) else po_task
            if isinstance(po_id, str):
                if po_id in path_only_set:
                    errors.append({
                        "field": "pathOnlyTasks",
                        "message": f"Duplicate path-only task ID '{po_id}'."
                    })
                path_only_set.add(po_id)

    overlap_ids = canonical_set.intersection(path_only_set)
    for oid in overlap_ids:
        errors.append({
            "field": "taskIds",
            "message": f"Task ID '{oid}' appears in both canonicalTaskIds and pathOnlyTasks."
        })

    # 7. Approved stages validation
    approved_stages = plan_data.get("approvedStages", [])
    if isinstance(approved_stages, list):
        for stg in approved_stages:
            if isinstance(stg, str) and stg not in ALLOWED_STAGES:
                errors.append({
                    "field": "approvedStages",
                    "message": f"Unsupported stage '{stg}'. Allowed stages: {sorted(ALLOWED_STAGES)}."
                })

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings
    }
