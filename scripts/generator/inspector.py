"""
Repository Inspector Module for Study Tracker Follow Along Generator.

Provides read-only discovery of canonical AWS task files, existing Follow Along
programmes, persistence keys, and SHA-256 fingerprints using a token-level state-machine
depth tokenizer without executing JavaScript code or post-parse regex fallbacks.
"""

from pathlib import Path
import re
import hashlib
from typing import Any, Dict, List, Optional, Set, Tuple


def find_repository_root(start_path: Optional[Path | str] = None) -> Path:
    """Locates the repository root directory by walking up parent directories."""
    current = Path(start_path).resolve() if start_path else Path.cwd().resolve()
    for parent in [current] + list(current.parents):
        if (parent / "package.json").exists() and (parent / "src").is_dir():
            return parent
    return current


def find_task_directory(repo_root: Path) -> Path:
    """Returns the absolute path to the canonical tasks directory."""
    return repo_root / "src" / "data" / "tasks"


def calculate_task_file_fingerprint(file_path: Path) -> str:
    """Calculates a deterministic SHA-256 fingerprint for a task file."""
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def _select_target_export_array(content: str, filename: str) -> Tuple[Optional[str], Optional[int], List[str], List[str], bool]:
    """
    Locates all candidate exported arrays in the JS file content and selects the canonical array.

    Returns (selected_var_name, array_start_char_idx, candidate_vars, warnings, is_ambiguous).
    """
    warnings: List[str] = []
    candidate_vars: List[str] = []

    matches = list(re.finditer(r"(?:export\s+const\s+(\w+)|module\.exports\.\w+\s*=\s*|export\s+default)\s*=\s*\[", content))
    if not matches:
        matches = list(re.finditer(r"export\s+const\s+(\w+)\s*=\s*\[", content))

    if not matches:
        warnings.append(f"No exported array found in {filename}")
        return None, None, [], warnings, True

    for m in matches:
        var_name = m.group(1) if m.group(1) else "default"
        if var_name not in candidate_vars:
            candidate_vars.append(var_name)

    service_slug = filename.replace("Tasks.js", "").replace("tasks.js", "").upper()
    expected_var = f"{service_slug}_TASKS"

    if len(matches) == 1:
        selected_match = matches[0]
        var_name = selected_match.group(1) if selected_match.group(1) else "default"
        return var_name, selected_match.end() - 1, candidate_vars, warnings, False

    # Multiple candidate arrays exist
    exact_matches = [m for m in matches if m.group(1) == expected_var]
    if len(exact_matches) == 1:
        selected_match = exact_matches[0]
        return expected_var, selected_match.end() - 1, candidate_vars, warnings, False

    # Ambiguous: Multiple plausible arrays exist and none matched expected_var exactly
    warnings.append("Multiple plausible canonical task arrays found.")
    return None, None, candidate_vars, warnings, True


def parse_task_file_safely(file_path: Path) -> Dict[str, Any]:
    """
    Statically parses a JavaScript task file using a token-level state-machine character tokenizer.

    Extracts canonical task objects by collecting direct properties exclusively when
    array_depth == 1 and object_depth == 1, ignoring nested IDs/titles, comments,
    string literals, and template literals without using post-parse regex fallbacks.
    """
    if not file_path.exists():
        return {
            "task_count": None,
            "task_ids": [],
            "tasks": [],
            "export_variable": None,
            "candidate_exports": [],
            "parser_confidence": "low",
            "warnings": [f"File not found: {file_path}"],
            "errors": [f"File not found: {file_path}"],
            "duplicate_task_ids": [],
            "rejected_direct_children": []
        }

    content = file_path.read_text(encoding="utf-8")
    warnings: List[str] = []
    errors: List[str] = []

    export_var, start_idx, candidate_exports, sel_warnings, is_ambiguous = _select_target_export_array(content, file_path.name)
    warnings.extend(sel_warnings)

    if start_idx is None or is_ambiguous:
        return {
            "task_count": None,
            "task_ids": [],
            "tasks": [],
            "export_variable": export_var if not is_ambiguous else None,
            "candidate_exports": candidate_exports,
            "parser_confidence": "low",
            "warnings": warnings,
            "errors": errors,
            "duplicate_task_ids": [],
            "rejected_direct_children": []
        }

    # Token-Level State Machine Character Tokenizer
    array_depth = 0
    object_depth = 0
    in_string = False
    string_char: Optional[str] = None
    in_comment = False
    comment_type: Optional[str] = None
    template_depth = 0
    ambiguous_template = False

    direct_child_objects: List[Dict[str, str]] = []
    current_props: Dict[str, str] = {}

    key_buffer: List[str] = []
    val_buffer: List[str] = []
    current_key: Optional[str] = None
    in_val = False

    i = start_idx
    length = len(content)
    parsed_cleanly = False

    while i < length:
        ch = content[i]

        # 1. String literal handling
        if in_string:
            if in_val and array_depth == 1 and object_depth == 1:
                val_buffer.append(ch)
            elif not in_val and array_depth == 1 and object_depth == 1:
                key_buffer.append(ch)

            if string_char == "`" and ch == "$" and i + 1 < length and content[i + 1] == "{":
                template_depth += 1
                ambiguous_template = True

            if ch == "\\":
                i += 1
                if i < length and array_depth == 1 and object_depth == 1:
                    if in_val:
                        val_buffer.append(content[i])
                    else:
                        key_buffer.append(content[i])
            elif ch == string_char:
                if string_char == "`" and template_depth > 0:
                    pass
                else:
                    in_string = False
                    string_char = None
                    if in_val and array_depth == 1 and object_depth == 1:
                        prop_val = "".join(val_buffer[:-1]).strip().strip('"').strip("'").strip("`")
                        if current_key:
                            current_props[current_key] = prop_val
                        in_val = False
                        current_key = None
                        val_buffer = []
            i += 1
            continue

        # 2. Comment handling
        if in_comment:
            if comment_type == "//" and ch in ["\n", "\r"]:
                in_comment = False
            elif comment_type == "/*" and ch == "*" and i + 1 < length and content[i + 1] == "/":
                in_comment = False
                i += 1
            i += 1
            continue

        # 3. Detect Strings
        if ch in ['"', "'", "`"]:
            in_string = True
            string_char = ch
            if in_val and array_depth == 1 and object_depth == 1:
                val_buffer = []
            i += 1
            continue

        # 4. Detect Comments
        if ch == "/" and i + 1 < length:
            if content[i + 1] == "/":
                in_comment = True
                comment_type = "//"
                i += 2
                continue
            elif content[i + 1] == "*":
                in_comment = True
                comment_type = "/*"
                i += 2
                continue

        # 5. Bracket depth tracking [ ]
        if ch == "[":
            array_depth += 1
            i += 1
            continue

        if ch == "]":
            array_depth -= 1
            if array_depth == 0:
                parsed_cleanly = True
                break
            i += 1
            continue

        # 6. Brace depth tracking { }
        if ch == "{":
            if array_depth == 1 and object_depth == 0:
                current_props = {}
                current_key = None
                key_buffer = []
                val_buffer = []
                in_val = False
            object_depth += 1
            i += 1
            continue

        if ch == "}":
            if array_depth == 1 and object_depth == 1:
                direct_child_objects.append(current_props)
                current_props = {}
                current_key = None
                key_buffer = []
                val_buffer = []
                in_val = False
            object_depth -= 1
            i += 1
            continue

        # 7. Extract Direct Property Keys at array_depth == 1 and object_depth == 1
        if array_depth == 1 and object_depth == 1:
            if ch == ":" and not in_val:
                raw_key = "".join(key_buffer).strip().strip('"').strip("'")
                if raw_key in ["id", "title"]:
                    current_key = raw_key
                else:
                    current_key = None
                key_buffer = []
                in_val = True
                val_buffer = []
            elif ch in [",", "\n", "\r", ";"]:
                key_buffer = []
                in_val = False
                current_key = None
            elif not in_val and (ch.isalnum() or ch in ["_", '"', "'"]):
                key_buffer.append(ch)

        i += 1

    if not parsed_cleanly:
        warnings.append(f"Task array in {file_path.name} did not terminate cleanly (unbalanced brackets).")

    # Evaluate extracted direct child objects
    canonical_tasks: List[Dict[str, Any]] = []
    canonical_task_ids: List[str] = []
    rejected_direct_children: List[Dict[str, Any]] = []
    seen_ids: Set[str] = set()
    duplicate_task_ids: List[str] = []

    for idx, obj in enumerate(direct_child_objects):
        tid = obj.get("id")
        title = obj.get("title")

        if isinstance(tid, str) and tid.strip() and isinstance(title, str) and title.strip():
            if tid.startswith("task-") or tid.startswith("path-"):
                if tid in seen_ids:
                    duplicate_task_ids.append(tid)
                    warnings.append(f"Duplicate canonical task ID detected: '{tid}'")
                seen_ids.add(tid)
                canonical_task_ids.append(tid)
                canonical_tasks.append({"id": tid, "title": title, "index": idx})
            else:
                rejected_direct_children.append({"index": idx, "reason": f"Non-canonical ID prefix '{tid}'", "object": obj})
        else:
            rejected_direct_children.append({"index": idx, "reason": "Missing or non-string direct id or title", "object": obj})

    parser_confidence = "high"
    if ambiguous_template:
        parser_confidence = "low"
        warnings.append("Template interpolation '${...}' detected; confidence reduced.")

    if is_ambiguous:
        parser_confidence = "low"

    if len(warnings) > 2 or not parsed_cleanly:
        parser_confidence = "low"

    if not canonical_task_ids or parser_confidence == "low":
        return {
            "task_count": len(canonical_task_ids) if canonical_task_ids and parser_confidence == "high" else None,
            "task_ids": canonical_task_ids if parser_confidence == "high" else [],
            "tasks": canonical_tasks if parser_confidence == "high" else [],
            "export_variable": export_var if parser_confidence == "high" else None,
            "candidate_exports": candidate_exports,
            "parser_confidence": parser_confidence,
            "warnings": warnings + (["Canonical task count could not be determined safely."] if parser_confidence == "low" and "Canonical task count could not be determined safely." not in warnings else []),
            "errors": errors,
            "duplicate_task_ids": duplicate_task_ids,
            "rejected_direct_children": rejected_direct_children
        }

    return {
        "task_count": len(canonical_task_ids),
        "task_ids": canonical_task_ids,
        "tasks": canonical_tasks,
        "export_variable": export_var,
        "candidate_exports": candidate_exports,
        "parser_confidence": parser_confidence,
        "warnings": warnings,
        "errors": errors,
        "duplicate_task_ids": duplicate_task_ids,
        "rejected_direct_children": rejected_direct_children
    }


def discover_canonical_services(repo_root: Path) -> List[Dict[str, Any]]:
    """
    Discovers all canonical task files in src/data/tasks/ and extracts metadata.
    """
    task_dir = find_task_directory(repo_root)
    services: List[Dict[str, Any]] = []

    if not task_dir.exists():
        return services

    for task_file in sorted(task_dir.glob("*Tasks.js")):
        filename = task_file.name
        service_slug = filename.replace("Tasks.js", "").replace("tasks.js", "").lower()
        parse_res = parse_task_file_safely(task_file)
        fingerprint = calculate_task_file_fingerprint(task_file)

        services.append({
            "service_slug": service_slug,
            "filename": filename,
            "relative_path": f"src/data/tasks/{filename}",
            "absolute_path": str(task_file),
            "fingerprint": fingerprint,
            "task_count": parse_res["task_count"],
            "task_ids": parse_res["task_ids"],
            "export_variable": parse_res["export_variable"],
            "candidate_exports": parse_res.get("candidate_exports", []),
            "parser_confidence": parse_res["parser_confidence"],
            "warnings": parse_res["warnings"]
        })

    return services


def discover_existing_follow_alongs(repo_root: Path) -> List[Dict[str, Any]]:
    """
    Scans the repository for existing Follow Along learning path implementations.
    """
    follow_alongs: List[Dict[str, Any]] = []
    data_dir = repo_root / "src" / "data"

    if not data_dir.exists():
        return follow_alongs

    for data_file in sorted(data_dir.glob("*LearningPathData.js")):
        filename = data_file.name
        prefix = filename.replace("LearningPathData.js", "").lower()
        content = data_file.read_text(encoding="utf-8")

        path_id_match = re.search(r"export const \w+_PATH_ID = ['\"]([^'\"]+)['\"]", content)
        path_id = path_id_match.group(1) if path_id_match else f"{prefix}-learning-path"

        service_file = repo_root / "src" / "services" / f"{prefix}LearningPathService.js"
        component_dir = repo_root / "src" / "components" / f"{prefix.capitalize()}LearningPath"
        test_file = repo_root / "tests" / f"{prefix}LearningPath.test.js"

        local_storage_keys: List[str] = []
        if service_file.exists():
            svc_content = service_file.read_text(encoding="utf-8")
            keys = re.findall(r"const (GUEST_\w+_KEY) = ['\"]([^'\"]+)['\"]", svc_content)
            local_storage_keys = [k[1] for k in keys]

        follow_alongs.append({
            "service_prefix": prefix,
            "programme_id": path_id,
            "path_id": path_id,
            "data_file": str(data_file.relative_to(repo_root)),
            "service_file": str(service_file.relative_to(repo_root)) if service_file.exists() else None,
            "component_dir": str(component_dir.relative_to(repo_root)) if component_dir.exists() else None,
            "test_file": str(test_file.relative_to(repo_root)) if test_file.exists() else None,
            "local_storage_keys": local_storage_keys
        })

    return follow_alongs


def inspect_repository(start_path: Optional[Path | str] = None) -> Dict[str, Any]:
    """
    Performs a comprehensive read-only inspection of the repository.

    Returns structured Python data suitable for JSON serialization.
    """
    repo_root = find_repository_root(start_path)
    task_dir = find_task_directory(repo_root)

    warnings: List[str] = []
    errors: List[str] = []

    if not task_dir.exists():
        errors.append(f"Canonical task directory does not exist: {task_dir}")

    canonical_services = discover_canonical_services(repo_root)
    existing_follow_alongs = discover_existing_follow_alongs(repo_root)

    programme_ids = [fa["programme_id"] for fa in existing_follow_alongs]
    path_ids = [fa["path_id"] for fa in existing_follow_alongs]
    local_storage_keys: List[str] = []
    for fa in existing_follow_alongs:
        local_storage_keys.extend(fa["local_storage_keys"])

    for svc in canonical_services:
        warnings.extend(svc.get("warnings", []))

    return {
        "repository_root": str(repo_root),
        "task_directory": str(task_dir),
        "canonical_services": canonical_services,
        "existing_follow_alongs": existing_follow_alongs,
        "programme_ids": programme_ids,
        "local_storage_keys": local_storage_keys,
        "path_ids": path_ids,
        "warnings": warnings,
        "errors": errors
    }
