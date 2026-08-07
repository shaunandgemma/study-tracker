"""
Dry-Run Follow Along Scaffolding Preview Engine.

Generates previews of approved Follow Along learning path files in a temporary
staging directory outside the repository using standard library tempfile.
"""

from pathlib import Path
import json
import difflib
import tempfile
from typing import Any, Dict, List, Optional, Tuple

from scripts.generator.inspector import find_repository_root, inspect_repository
from scripts.generator.validator import validate_approved_plan_file
from scripts.generator.schema import validate_repository_relative_path


def preview_scaffold(
    approved_plan_path: Path | str,
    topic: Optional[str] = None,
    start_path: Optional[Path | str] = None
) -> Tuple[bool, Dict[str, Any], int]:
    """
    Previews scaffolding generation for an approved plan in a temporary external directory.

    Returns (success, result_dict, exit_code).
      Exit Code 0: Dry-run preview completed successfully.
      Exit Code 5: Write-capable scaffolding belongs to Stage 6.
      Exit Code 6: Approved plan validation failed.
      Exit Code 7: Approved plan file not found.
      Exit Code 8: Collision or missing modification target.
      Exit Code 9: Scaffold template or approved-plan data incomplete.
    """
    repo_root = find_repository_root(start_path)

    # Step 1: Mandatory Stage 4 Validator Gate
    is_valid, val_result, val_code = validate_approved_plan_file(approved_plan_path, topic, repo_root)
    if not is_valid or val_code != 0:
        return False, {
            "success": False,
            "dry_run": True,
            "error": "Approved plan validation failed.",
            "validator_result": val_result,
            "repository_writes": 0
        }, val_code

    plan_file = repo_root / approved_plan_path if not Path(approved_plan_path).is_absolute() else Path(approved_plan_path)

    try:
        with open(plan_file, "r", encoding="utf-8") as f:
            plan = json.load(f)
    except Exception as e:
        return False, {"success": False, "dry_run": True, "error": f"Failed to load approved plan: {e}", "repository_writes": 0}, 7

    # Step 2: Architecture Data Completeness Check
    programme_id = plan.get("programmeId")
    svc_slug = plan.get("service")
    canonical_count = plan.get("canonicalTaskCount")
    inventory = plan.get("canonicalTaskInventory", [])
    output_files = plan.get("approvedOutputFiles", [])
    mod_files = plan.get("approvedModificationFiles", [])

    if not programme_id or not svc_slug or not canonical_count or not inventory:
        return False, {
            "success": False,
            "dry_run": True,
            "error": "Approved plan architecture data is incomplete or missing required fields.",
            "repository_writes": 0
        }, 9

    # Step 3: Temporary Staging Setup Outside Repository
    file_results: List[Dict[str, Any]] = []
    has_collision = False
    has_missing_mod = False
    has_rejected = False

    with tempfile.TemporaryDirectory() as tmpdir_str:
        tmpdir = Path(tmpdir_str)

        # Process approvedOutputFiles (CREATE or COLLISION)
        for rel_path in output_files:
            is_safe, err_msg = validate_repository_relative_path(rel_path, "approvedOutputFiles")
            repo_target = repo_root / rel_path

            if not is_safe or rel_path.startswith("src/data/tasks/") or rel_path.startswith("src/data/vpc") or rel_path.startswith("src/data/ec2") or rel_path in ["package.json", "package-lock.json"]:
                file_results.append({"path": rel_path, "status": "REJECTED", "error": err_msg or "Forbidden output target"})
                has_rejected = True
                continue

            if repo_target.exists():
                file_results.append({"path": rel_path, "status": "COLLISION", "error": f"Target file '{rel_path}' already exists in repository."})
                has_collision = True
            else:
                # Generate preview content into temporary staging
                staged_path = tmpdir / rel_path
                staged_path.parent.mkdir(parents=True, exist_ok=True)
                content = _generate_preview_content(rel_path, plan)
                staged_path.write_text(content, encoding="utf-8")

                file_results.append({
                    "path": rel_path,
                    "status": "CREATE",
                    "preview_lines": len(content.splitlines()),
                    "diff": None
                })

        # Process approvedModificationFiles (MODIFY, UNCHANGED, or REJECTED)
        for rel_path in mod_files:
            is_safe, err_msg = validate_repository_relative_path(rel_path, "approvedModificationFiles")
            repo_target = repo_root / rel_path

            if not is_safe or rel_path.startswith("src/data/tasks/") or rel_path.startswith("src/data/vpc") or rel_path.startswith("src/data/ec2") or rel_path in ["package.json", "package-lock.json"]:
                file_results.append({"path": rel_path, "status": "REJECTED", "error": err_msg or "Forbidden modification target"})
                has_rejected = True
                continue

            if not repo_target.exists():
                file_results.append({"path": rel_path, "status": "COLLISION", "error": f"Modification target file '{rel_path}' does not exist in repository."})
                has_missing_mod = True
            else:
                existing_text = repo_target.read_text(encoding="utf-8")
                staged_content = _generate_modification_preview(rel_path, plan, existing_text)

                if existing_text.strip() == staged_content.strip():
                    file_results.append({"path": rel_path, "status": "UNCHANGED", "diff": None})
                else:
                    diff_lines = list(difflib.unified_diff(
                        existing_text.splitlines(keepends=True),
                        staged_content.splitlines(keepends=True),
                        fromfile=f"a/{rel_path}",
                        tofile=f"b/{rel_path}"
                    ))
                    diff_text = "".join(diff_lines)
                    file_results.append({
                        "path": rel_path,
                        "status": "MODIFY",
                        "diff": diff_text
                    })

    if has_collision or has_missing_mod:
        return False, {
            "success": False,
            "dry_run": True,
            "programme_id": programme_id,
            "error": "Scaffold preview blocked due to file collisions or missing modification targets.",
            "files": file_results,
            "repository_writes": 0
        }, 8

    if has_rejected:
        return False, {
            "success": False,
            "dry_run": True,
            "programme_id": programme_id,
            "error": "Scaffold preview blocked due to rejected output paths.",
            "files": file_results,
            "repository_writes": 0
        }, 6

    return True, {
        "success": True,
        "dry_run": True,
        "programme_id": programme_id,
        "service": svc_slug,
        "files": file_results,
        "repository_writes": 0
    }, 0


def _generate_preview_content(rel_path: str, plan: Dict[str, Any]) -> str:
    """Generates preview content for a new approved output file."""
    programme_id = plan.get("programmeId", "unknown")
    svc = plan.get("service", "unknown").upper()
    cap_svc = svc.capitalize()

    if rel_path.endswith("Data.js"):
        return f"""// AWS Follow Along Learning Path Data — {svc}
// Generated for programme: {programme_id}

export const {svc}_LEARNING_PATH_DATA = {{
  programmeId: "{programme_id}",
  title: "AWS {svc} Follow Along Learning Path",
  tasks: {json.dumps(plan.get('canonicalTaskInventory', []), indent=2)}
}};
"""
    elif rel_path.endswith("Service.js"):
        return f"""// AWS Follow Along Service — {svc}
// Generated for programme: {programme_id}

export function get{cap_svc}ProgressSummary() {{
  // TODO — APPROVED IMPLEMENTATION REQUIRED (Stage 6)
  return {{ completed: 0, total: {plan.get('canonicalTaskCount', 0)}, percentage: 0 }};
}}
"""
    elif rel_path.endswith(".jsx"):
        comp_name = Path(rel_path).stem
        return f"""// AWS Follow Along Component — {comp_name}
import React from 'react';

export default function {comp_name}() {{
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">AWS {svc} Follow Along — {comp_name}</h2>
      <p className="text-gray-400">TODO — APPROVED IMPLEMENTATION REQUIRED (Stage 6)</p>
    </div>
  );
}}
"""
    elif rel_path.endswith(".test.js"):
        return f"""// AWS Follow Along Test Suite — {svc}
import {{ test }} from 'node:test';
import assert from 'node:assert/strict';

test('{svc} Learning Path Catalogue Integrity', (t) => {{
  assert.equal(1, 1);
}});
"""
    else:
        return f"// Preview boilerplate for {rel_path}\n"


def _generate_modification_preview(rel_path: str, plan: Dict[str, Any], existing_text: str) -> str:
    """Generates preview content for a modified file."""
    programme_id = plan.get("programmeId", "")
    if programme_id and programme_id not in existing_text:
        return existing_text + f"\n// Registered Follow Along: {programme_id}\n"
    return existing_text
