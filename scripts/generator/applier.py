"""
Transactional Scaffolding Application & Rollback Engine.

Applies approved Follow Along scaffold files to the repository transactionally
with pre-application revalidation, target-file hash checking, explicit token confirmation,
atomic file writes, and all-or-nothing rollback capabilities.
"""

from pathlib import Path
import json
import hashlib
import shutil
import tempfile
from typing import Any, Dict, List, Optional, Tuple, Set

from scripts.generator.inspector import find_repository_root, calculate_task_file_fingerprint
from scripts.generator.validator import validate_approved_plan_file
from scripts.generator.scaffold import preview_scaffold, _generate_preview_content, _generate_modification_preview
from scripts.generator.schema import validate_repository_relative_path


def calculate_file_sha256(path: Path) -> Optional[str]:
    """Calculates SHA-256 hash of a file if it exists."""
    if not path.exists() or not path.is_file():
        return None
    try:
        hasher = hashlib.sha256()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception:
        return None


def apply_scaffold_transaction(
    approved_plan_path: Path | str,
    topic: Optional[str] = None,
    confirmation_token: Optional[str] = None,
    start_path: Optional[Path | str] = None
) -> Tuple[bool, Dict[str, Any], int]:
    """
    Applies an approved scaffold plan transactionally to the repository.

    Returns (success, result_dict, exit_code).
      Exit Code 0: Transaction completed successfully or safe user cancellation.
      Exit Code 5: Write-capable scaffolding unavailable non-interactively.
      Exit Code 6: Approved plan validation failed.
      Exit Code 7: Approved plan missing.
      Exit Code 8: Collision, stale target file, or repository state changed.
      Exit Code 9: Scaffold data incomplete.
      Exit Code 10: Confirmation token mismatch or cancelled.
      Exit Code 11: Transaction failed and rollback executed successfully.
      Exit Code 12: Transaction failed and rollback encountered errors.
    """
    repo_root = find_repository_root(start_path)

    # Step 1: Pass 1 & Pass 2 Gates — Validator & Dry-Run Preview Engine
    preview_succ, preview_res, preview_code = preview_scaffold(approved_plan_path, topic, repo_root)
    if not preview_succ or preview_code != 0:
        return False, {
            "success": False,
            "error": "Pre-application preview gate failed.",
            "preview_result": preview_res,
            "transaction_id": None,
            "created": [],
            "modified": [],
            "rolled_back": False
        }, preview_code

    plan_file = repo_root / approved_plan_path if not Path(approved_plan_path).is_absolute() else Path(approved_plan_path)
    try:
        with open(plan_file, "r", encoding="utf-8") as f:
            plan = json.load(f)
    except Exception as e:
        return False, {"success": False, "error": f"Failed to load plan file: {e}", "transaction_id": None}, 7

    programme_id = plan.get("programmeId", "unknown")
    svc_slug = plan.get("service", "unknown").lower()
    output_files = plan.get("approvedOutputFiles", [])
    mod_files = plan.get("approvedModificationFiles", [])

    # Step 2: Pass 5 Gate — Explicit Confirmation Token Check
    expected_token = f"APPLY {svc_slug.upper()}"
    if not confirmation_token or confirmation_token != expected_token:
        msg = f"Confirmation token mismatch. Expected exact token '{expected_token}'. No files were changed."
        return False, {
            "success": False,
            "error": msg,
            "transaction_id": None,
            "created": [],
            "modified": [],
            "rolled_back": False
        }, 10

    # Step 3: Pass 3 & Pass 4 Gates — Stale-State Protection & Target Hashes
    # Recheck canonical task file fingerprint
    task_file_rel = plan.get("canonicalTaskFile", "")
    task_file_abs = repo_root / task_file_rel
    if not task_file_abs.exists() or calculate_task_file_fingerprint(task_file_abs) != plan.get("canonicalTaskFingerprint"):
        msg = "Canonical task source changed after preview. Run dry-run again. No files were changed."
        return False, {"success": False, "error": msg, "transaction_id": None}, 8

    # Fingerprint all existing modification targets
    initial_mod_hashes: Dict[Path, str] = {}
    for rel_path in mod_files:
        target = repo_root / rel_path
        if not target.exists() or not target.is_file():
            msg = f"Modification target file '{rel_path}' is missing. Application aborted. No files were changed."
            return False, {"success": False, "error": msg, "transaction_id": None}, 8
        initial_mod_hashes[target] = calculate_file_sha256(target) or ""

    # Check for new output collisions
    for rel_path in output_files:
        target = repo_root / rel_path
        if target.exists():
            msg = f"New output collision detected for '{rel_path}'. Application aborted. No files were changed."
            return False, {"success": False, "error": msg, "transaction_id": None}, 8

    # Recheck target modification hashes immediately before writing
    for target, expected_hash in initial_mod_hashes.items():
        if calculate_file_sha256(target) != expected_hash:
            msg = "Target file changed after preview. Application aborted. No files were changed."
            return False, {"success": False, "error": msg, "transaction_id": None}, 8

    # Step 4: External Backup & Staging Setup
    transaction_id = f"tx-{programme_id}-{int(plan_file.stat().st_mtime)}"
    created_files: List[Path] = []
    modified_files: List[Path] = []
    created_dirs: List[Path] = []

    with tempfile.TemporaryDirectory() as backup_dir_str, tempfile.TemporaryDirectory() as staging_dir_str:
        backup_dir = Path(backup_dir_str)
        staging_dir = Path(staging_dir_str)

        # Snapshot modification targets byte-for-byte into backup_dir
        for rel_path in mod_files:
            src_file = repo_root / rel_path
            backup_file = backup_dir / rel_path
            backup_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_file, backup_file)

        # Generate staged final output files inside staging_dir
        staged_contents: Dict[Path, str] = {}

        for rel_path in output_files:
            is_safe, err_msg = validate_repository_relative_path(rel_path, "approvedOutputFiles")
            if not is_safe or rel_path.startswith("src/data/tasks/") or rel_path.startswith("src/data/vpc") or rel_path.startswith("src/data/ec2") or rel_path in ["package.json", "package-lock.json"]:
                msg = f"Forbidden output target '{rel_path}'. Transaction aborted."
                return False, {"success": False, "error": msg, "transaction_id": None}, 6

            content = _generate_preview_content(rel_path, plan)
            staged_file = staging_dir / rel_path
            staged_file.parent.mkdir(parents=True, exist_ok=True)
            staged_file.write_text(content, encoding="utf-8")
            staged_contents[repo_root / rel_path] = content

        for rel_path in mod_files:
            is_safe, err_msg = validate_repository_relative_path(rel_path, "approvedModificationFiles")
            if not is_safe or rel_path.startswith("src/data/tasks/") or rel_path.startswith("src/data/vpc") or rel_path.startswith("src/data/ec2") or rel_path in ["package.json", "package-lock.json"]:
                msg = f"Forbidden modification target '{rel_path}'. Transaction aborted."
                return False, {"success": False, "error": msg, "transaction_id": None}, 6

            existing_text = (repo_root / rel_path).read_text(encoding="utf-8")
            content = _generate_modification_preview(rel_path, plan, existing_text)
            staged_file = staging_dir / rel_path
            staged_file.parent.mkdir(parents=True, exist_ok=True)
            staged_file.write_text(content, encoding="utf-8")
            staged_contents[repo_root / rel_path] = content

        # Step 5: Transactional File Execution Engine
        try:
            # Apply all creations
            for rel_path in output_files:
                dest = repo_root / rel_path
                parent_dir = dest.parent

                # Track created directories
                curr_dir = parent_dir
                dirs_to_track: List[Path] = []
                while not curr_dir.exists() and curr_dir != repo_root:
                    dirs_to_track.append(curr_dir)
                    curr_dir = curr_dir.parent

                for d in reversed(dirs_to_track):
                    d.mkdir(parents=True, exist_ok=True)
                    created_dirs.append(d)

                content = staged_contents[dest]
                _atomic_write_file(dest, content)
                created_files.append(dest)

            # Apply all modifications
            for rel_path in mod_files:
                dest = repo_root / rel_path
                content = staged_contents[dest]
                _atomic_write_file(dest, content)
                modified_files.append(dest)

            # Post-write verification
            for dest in created_files + modified_files:
                if not dest.exists() or not dest.is_file():
                    raise IOError(f"Post-write verification failed for '{dest}'. File is missing.")

            # Transaction Succeeded
            created_rel = [str(p.relative_to(repo_root)).replace("\\", "/") for p in created_files]
            modified_rel = [str(p.relative_to(repo_root)).replace("\\", "/") for p in modified_files]

            return True, {
                "success": True,
                "programme_id": programme_id,
                "transaction_id": transaction_id,
                "created": created_rel,
                "modified": modified_rel,
                "rolled_back": False,
                "rollback_errors": [],
                "warnings": plan.get("warnings", []),
                "errors": []
            }, 0

        except Exception as tx_error:
            # Step 6: Transaction Failure -> Rollback Engine
            rollback_errors: List[str] = []

            # 1. Restore modified files byte-for-byte from backup_dir
            for rel_path in mod_files:
                target = repo_root / rel_path
                backup_file = backup_dir / rel_path
                if backup_file.exists():
                    try:
                        shutil.copy2(backup_file, target)
                        # Verify restored hash
                        if calculate_file_sha256(target) != initial_mod_hashes.get(target):
                            rollback_errors.append(f"Failed to verify restored byte content for '{rel_path}'.")
                    except Exception as rb_err:
                        rollback_errors.append(f"Failed to restore '{rel_path}': {rb_err}")

            # 2. Unlink newly created files
            for p in created_files:
                if p.exists():
                    try:
                        p.unlink()
                    except Exception as rb_err:
                        rollback_errors.append(f"Failed to remove created file '{p}': {rb_err}")

            # 3. Remove newly created empty directories
            for d in reversed(created_dirs):
                if d.exists() and not list(d.glob("*")):
                    try:
                        d.rmdir()
                    except Exception as rb_err:
                        rollback_errors.append(f"Failed to remove empty directory '{d}': {rb_err}")

            if rollback_errors:
                msg = f"Transactional application failed ({tx_error}) AND rollback encountered errors: {rollback_errors}"
                return False, {
                    "success": False,
                    "error": msg,
                    "transaction_id": transaction_id,
                    "rolled_back": True,
                    "rollback_errors": rollback_errors
                }, 12
            else:
                msg = f"Transactional application failed ({tx_error}). Rollback executed successfully. Zero files were changed."
                return False, {
                    "success": False,
                    "error": msg,
                    "transaction_id": transaction_id,
                    "created": [],
                    "modified": [],
                    "rolled_back": True,
                    "rollback_errors": []
                }, 11


def _atomic_write_file(dest_path: Path, content: str) -> None:
    """Writes content to a temporary file adjacent to dest_path and atomically replaces it."""
    tmp_path = dest_path.with_suffix(dest_path.suffix + ".tmp")
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            f.write(content)
            f.flush()

        tmp_path.replace(dest_path)
    except Exception as e:
        if tmp_path.exists():
            try:
                tmp_path.unlink()
            except Exception:
                pass
        raise e
