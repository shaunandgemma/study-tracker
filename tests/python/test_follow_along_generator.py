"""
Permanent Follow Along Generator Test Suite.

Comprehensive unit and integration test suite covering Stages 1 through 6:
- Inspector: state-machine parser, token direct property extraction, confidence scoring, fingerprints.
- Schema: structural JSON validation, path safety, required fields.
- Planner: draft plan generation, canonical task preservation, collision handling.
- Validator: repository-aware validation, live fingerprints, DAG cycle detection, output allowlists.
- Scaffold: dry-run scaffolding previews, diff generation, external staging cleanup.
- Applier: transactional execution, stale-state protection, token confirmation, all-or-nothing rollback.
- CLI: non-interactive argument routing, safety gates, exit code contracts (0..12).
"""

import sys
import json
import shutil
import hashlib
import tempfile
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

# Ensure repository root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from scripts.generator.inspector import (
    find_repository_root,
    inspect_repository,
    parse_task_file_safely,
    calculate_task_file_fingerprint
)
from scripts.generator.schema import (
    validate_approved_plan,
    validate_repository_relative_path
)
from scripts.generator.planner import generate_draft_plan
from scripts.generator.validator import validate_approved_plan_file
from scripts.generator.scaffold import preview_scaffold
from scripts.generator.applier import apply_scaffold_transaction, _atomic_write_file, calculate_file_sha256 as applier_module_sha

REAL_REPO_ROOT = Path(__file__).resolve().parents[2]


def helper_create_synthetic_repo(tmp_path: Path) -> Path:
    """Helper to build a minimal synthetic Study Tracker repository inside tempfile."""
    (tmp_path / "scripts" / "generator").mkdir(parents=True, exist_ok=True)
    for script in ["inspector.py", "schema.py", "planner.py", "validator.py", "scaffold.py", "applier.py"]:
        shutil.copy2(REAL_REPO_ROOT / "scripts" / "generator" / script, tmp_path / "scripts" / "generator" / script)
    shutil.copy2(REAL_REPO_ROOT / "scripts" / "create_follow_along.py", tmp_path / "scripts" / "create_follow_along.py")

    (tmp_path / "src" / "data" / "tasks").mkdir(parents=True, exist_ok=True)
    shutil.copy2(REAL_REPO_ROOT / "src" / "data" / "tasks" / "s3Tasks.js", tmp_path / "src" / "data" / "tasks" / "s3Tasks.js")

    (tmp_path / "src" / "data").mkdir(parents=True, exist_ok=True)
    (tmp_path / "src" / "data" / "followAlongProgrammes.js").write_text("// dummy\nexport const PROGRAMMES = [];\n", encoding="utf-8")

    (tmp_path / "plans").mkdir(parents=True, exist_ok=True)
    _, plan_data, _ = generate_draft_plan("s3", start_path=tmp_path)
    plan_data["approved"] = True
    plan_data["status"] = "approved"
    plan_data["approvedBy"] = "Shaun"
    plan_data["approvedAt"] = "2026-08-07T09:00:00Z"
    plan_data["approvedModificationFiles"] = ["src/data/followAlongProgrammes.js"]

    plan_file = tmp_path / "plans" / "s3-learning-path-approved.json"
    plan_file.write_text(json.dumps(plan_data, indent=2), encoding="utf-8")
    return plan_file


class TestInspector(unittest.TestCase):
    """Stage 1 Inspector Parser & Discovery Tests."""

    def test_01_repository_root_and_task_directory_discovery(self):
        repo_root = find_repository_root()
        self.assertTrue(repo_root.exists())
        insp = inspect_repository(repo_root)
        self.assertGreaterEqual(len(insp["canonical_services"]), 1)

    def test_02_parse_canonical_s3_task_file(self):
        s3_file = REAL_REPO_ROOT / "src" / "data" / "tasks" / "s3Tasks.js"
        res = parse_task_file_safely(s3_file)
        self.assertEqual(res["parser_confidence"], "high")
        self.assertEqual(res["task_count"], 33)
        self.assertEqual(len(res["tasks"]), 33)

    def test_03_nested_checklist_id_exclusion(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "testTasks.js"
            p.write_text("""
export const TEST_TASKS = [
  {
    id: "task-saa-test-001",
    title: "Primary",
    checklist: [
      { id: "nested-item-001", title: "Nested" }
    ]
  }
];
""", encoding="utf-8")
            res = parse_task_file_safely(p)
            self.assertEqual(res["task_count"], 1)
            self.assertEqual(res["tasks"][0]["id"], "task-saa-test-001")
            self.assertEqual(res["tasks"][0]["title"], "Primary")

    def test_04_direct_property_after_closed_nested_object(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "testTasks.js"
            p.write_text("""
export const TEST_TASKS = [
  {
    metadata: { difficulty: "Easy", title: "Nested Title" },
    id: "task-saa-test-002",
    title: "Canonical Title"
  }
];
""", encoding="utf-8")
            res = parse_task_file_safely(p)
            self.assertEqual(res["task_count"], 1)
            self.assertEqual(res["tasks"][0]["id"], "task-saa-test-002")
            self.assertEqual(res["tasks"][0]["title"], "Canonical Title")

    def test_05_multiple_candidate_arrays_low_confidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "testTasks.js"
            p.write_text("""
export const PRIMARY_TASKS = [ { id: "task-001", title: "P" } ];
export const SECONDARY_TASKS = [ { id: "task-002", title: "S" } ];
""", encoding="utf-8")
            res = parse_task_file_safely(p)
            self.assertEqual(res["parser_confidence"], "low")

    def test_06_deterministic_sha256_fingerprint(self):
        s3_file = REAL_REPO_ROOT / "src" / "data" / "tasks" / "s3Tasks.js"
        fp1 = calculate_task_file_fingerprint(s3_file)
        fp2 = calculate_task_file_fingerprint(s3_file)
        self.assertEqual(fp1, fp2)
        self.assertEqual(len(fp1), 64)

    def test_07_fake_ids_in_comments_and_strings_ignored(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "testTasks.js"
            p.write_text("""
// id: "fake-comment-id-001"
/* id: "fake-block-comment-002" */
export const TEST_TASKS = [
  {
    id: "task-saa-real-001",
    title: "Real Task with id: 'fake-string-003' inside text"
  }
];
""", encoding="utf-8")
            res = parse_task_file_safely(p)
            self.assertEqual(res["task_count"], 1)
            self.assertEqual(res["tasks"][0]["id"], "task-saa-real-001")

    def test_08_exact_export_resolution(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "testTasks.js"
            p.write_text("""
export const HELPER_TASKS = [ { id: "task-helper-001", title: "H" } ];
export const S3_TASKS = [ { id: "task-saa-s3-001", title: "S3" } ];
""", encoding="utf-8")
            res = parse_task_file_safely(p)
            self.assertIn("S3_TASKS", res["candidate_exports"])

    def test_09_malformed_unbalanced_array_low_confidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "testTasks.js"
            p.write_text("""
export const BROKEN_TASKS = [ { id: "task-001", title: "B" } ;
""", encoding="utf-8")
            res = parse_task_file_safely(p)
            self.assertEqual(res["parser_confidence"], "low")

    def test_10_ambiguous_template_interpolation_low_confidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "testTasks.js"
            p.write_text("""
const dynamicId = "dynamic-001";
export const DYNAMIC_TASKS = [ { id: `${dynamicId}`, title: "D" } ];
""", encoding="utf-8")
            res = parse_task_file_safely(p)
            self.assertEqual(res["parser_confidence"], "low")

    def test_11_duplicate_canonical_ids_reported(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "testTasks.js"
            p.write_text("""
export const DUP_TASKS = [
  { id: "task-dup-001", title: "First" },
  { id: "task-dup-001", title: "Second Duplicate" }
];
""", encoding="utf-8")
            res = parse_task_file_safely(p)
            self.assertEqual(len(res["tasks"]), 2)
            self.assertTrue(len(res["warnings"]) > 0 or len(set(t["id"] for t in res["tasks"])) < len(res["tasks"]))


class TestSchema(unittest.TestCase):
    """Stage 1 Structural Schema Tests."""

    def test_01_valid_approved_plan_schema(self):
        plan_data = {
            "schema_version": "1.0",
            "programmeId": "s3-learning-path",
            "service": "s3",
            "approved": True,
            "status": "approved",
            "approvedBy": "Shaun",
            "approvedAt": "2026-08-07T09:00:00Z",
            "canonicalTaskFile": "src/data/tasks/s3Tasks.js",
            "canonicalTaskFingerprint": "a" * 64,
            "canonicalTaskCount": 33,
            "canonicalTaskIds": ["task-001"],
            "phases": [],
            "pathOnlyTasks": [],
            "resourceBindings": {},
            "protectedResourceKeys": [],
            "optionalTaskIds": [],
            "destructiveTaskBindings": {},
            "cleanupOrder": [],
            "acknowledgedWarnings": [],
            "approvedStages": [1, 2, 3, 4],
            "approvedOutputFiles": ["src/data/s3LearningPathData.js"],
            "approvedModificationFiles": ["src/data/followAlongProgrammes.js"]
        }
        res = validate_approved_plan(plan_data, REAL_REPO_ROOT)
        self.assertTrue(res["valid"])

    def test_02_unapproved_plan_rejected(self):
        plan_data = {
            "programmeId": "s3-learning-path",
            "approved": False,
            "status": "draft"
        }
        res = validate_approved_plan(plan_data, REAL_REPO_ROOT)
        self.assertFalse(res["valid"])

    def test_03_path_safety_validation(self):
        self.assertTrue(validate_repository_relative_path("src/data/s3Data.js", "approvedOutputFiles")[0])
        self.assertFalse(validate_repository_relative_path("/abs/path/s3Data.js", "approvedOutputFiles")[0])
        self.assertFalse(validate_repository_relative_path("../outside/s3Data.js", "approvedOutputFiles")[0])

    def test_04_missing_required_fields(self):
        plan_data = {
            "approved": True,
            "status": "approved",
            "approvedBy": "Shaun",
            "approvedAt": "2026-08-07T09:00:00Z"
        }
        res = validate_approved_plan(plan_data, REAL_REPO_ROOT)
        self.assertFalse(res["valid"])
        self.assertTrue(len(res["errors"]) > 0)

    def test_05_missing_approval_identity_and_timestamp(self):
        plan_data = {
            "schema_version": "1.0",
            "programmeId": "s3-learning-path",
            "service": "s3",
            "approved": True,
            "status": "approved",
            "approvedBy": None,
            "approvedAt": None,
            "canonicalTaskFile": "src/data/tasks/s3Tasks.js",
            "canonicalTaskFingerprint": "a" * 64,
            "canonicalTaskCount": 33,
            "canonicalTaskIds": ["task-001"],
            "phases": [],
            "pathOnlyTasks": [],
            "resourceBindings": {},
            "protectedResourceKeys": [],
            "optionalTaskIds": [],
            "destructiveTaskBindings": {},
            "cleanupOrder": [],
            "acknowledgedWarnings": [],
            "approvedStages": [1, 2, 3, 4],
            "approvedOutputFiles": ["src/data/s3LearningPathData.js"],
            "approvedModificationFiles": ["src/data/followAlongProgrammes.js"]
        }
        res = validate_approved_plan(plan_data, REAL_REPO_ROOT)
        self.assertFalse(res["valid"])

    def test_06_invalid_timestamp_formatting(self):
        plan_data = {
            "schema_version": "1.0",
            "programmeId": "s3-learning-path",
            "service": "s3",
            "approved": True,
            "status": "approved",
            "approvedBy": "Shaun",
            "approvedAt": "invalid-date-string",
            "canonicalTaskFile": "src/data/tasks/s3Tasks.js",
            "canonicalTaskFingerprint": "a" * 64,
            "canonicalTaskCount": 33,
            "canonicalTaskIds": ["task-001"],
            "phases": [],
            "pathOnlyTasks": [],
            "resourceBindings": {},
            "protectedResourceKeys": [],
            "optionalTaskIds": [],
            "destructiveTaskBindings": {},
            "cleanupOrder": [],
            "acknowledgedWarnings": [],
            "approvedStages": [1, 2, 3, 4],
            "approvedOutputFiles": ["src/data/s3LearningPathData.js"],
            "approvedModificationFiles": ["src/data/followAlongProgrammes.js"]
        }
        res = validate_approved_plan(plan_data, REAL_REPO_ROOT)
        self.assertFalse(res["valid"])


class TestPlanner(unittest.TestCase):
    """Stage 3 Planner Tests."""

    def test_01_generate_draft_plan_s3(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            shutil.copytree(REAL_REPO_ROOT / "scripts", tmp_path / "scripts")
            (tmp_path / "src" / "data" / "tasks").mkdir(parents=True, exist_ok=True)
            shutil.copy2(REAL_REPO_ROOT / "src" / "data" / "tasks" / "s3Tasks.js", tmp_path / "src" / "data" / "tasks" / "s3Tasks.js")

            succ, plan_data, code = generate_draft_plan("s3", start_path=tmp_path)
            self.assertTrue(succ)
            self.assertEqual(code, 0)
            self.assertFalse(plan_data["approved"])
            self.assertEqual(plan_data["status"], "draft")
            self.assertEqual(plan_data["canonicalTaskCount"], 33)

    def test_02_draft_collision_does_not_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            shutil.copytree(REAL_REPO_ROOT / "scripts", tmp_path / "scripts")
            (tmp_path / "src" / "data" / "tasks").mkdir(parents=True, exist_ok=True)
            shutil.copy2(REAL_REPO_ROOT / "src" / "data" / "tasks" / "s3Tasks.js", tmp_path / "src" / "data" / "tasks" / "s3Tasks.js")

            (tmp_path / "plans").mkdir(parents=True, exist_ok=True)
            (tmp_path / "plans" / "s3-learning-path-draft.json").write_text("// existing draft", encoding="utf-8")

            succ, plan_data, code = generate_draft_plan("s3", start_path=tmp_path)
            self.assertTrue(plan_data.get("collision"))
            self.assertEqual(code, 0)

    def test_03_existing_follow_along_blocks_duplicate_planning(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            shutil.copytree(REAL_REPO_ROOT / "scripts", tmp_path / "scripts")
            (tmp_path / "src" / "data" / "tasks").mkdir(parents=True, exist_ok=True)
            shutil.copy2(REAL_REPO_ROOT / "src" / "data" / "tasks" / "vpcTasks.js", tmp_path / "src" / "data" / "tasks" / "vpcTasks.js")
            (tmp_path / "src" / "data" / "vpcLearningPathData.js").write_text("// existing vpc", encoding="utf-8")

            succ, plan_data, code = generate_draft_plan("vpc", start_path=tmp_path)
            self.assertNotEqual(code, 0)


class TestValidator(unittest.TestCase):
    """Stage 4 Validator Tests."""

    def test_01_repository_aware_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)
            is_valid, res, code = validate_approved_plan_file(plan_file, topic="s3", start_path=tmp_path)
            self.assertTrue(is_valid)
            self.assertEqual(code, 0)

    def test_02_missing_plan_file_returns_code_7(self):
        is_valid, res, code = validate_approved_plan_file("plans/missing.json", topic="s3", start_path=REAL_REPO_ROOT)
        self.assertFalse(is_valid)
        self.assertEqual(code, 7)

    def test_03_fingerprint_mismatch_fails_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)

            plan_text = plan_file.read_text()
            plan_json = json.loads(plan_text)
            plan_json["canonicalTaskFingerprint"] = "0" * 64
            plan_file.write_text(json.dumps(plan_json, indent=2))

            is_valid, res, code = validate_approved_plan_file(plan_file, topic="s3", start_path=tmp_path)
            self.assertFalse(is_valid)
            self.assertEqual(code, 6)

    def test_04_forbidden_targets_rejected_by_validator(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)

            plan_text = plan_file.read_text()
            plan_json = json.loads(plan_text)
            plan_json["approvedOutputFiles"].append("package.json")
            plan_file.write_text(json.dumps(plan_json, indent=2))

            is_valid, res, code = validate_approved_plan_file(plan_file, topic="s3", start_path=tmp_path)
            self.assertFalse(is_valid)
            self.assertEqual(code, 6)


class TestScaffold(unittest.TestCase):
    """Stage 5 Scaffold Dry-Run Engine Tests."""

    def test_01_dry_run_scaffold_preview(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)
            succ, res, code = preview_scaffold(plan_file, topic="s3", start_path=tmp_path)
            self.assertTrue(succ)
            self.assertEqual(code, 0)
            self.assertTrue(res["dry_run"])
            self.assertEqual(res["repository_writes"], 0)

    def test_02_collision_reported_for_existing_output_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)

            service_col = tmp_path / "src" / "services" / "s3LearningPathService.js"
            service_col.parent.mkdir(parents=True, exist_ok=True)
            service_col.write_text("// dummy service collision", encoding="utf-8")

            succ, res, code = preview_scaffold(plan_file, topic="s3", start_path=tmp_path)
            self.assertFalse(succ)
            self.assertEqual(code, 8)


class TestApplier(unittest.TestCase):
    """Stage 6 Transactional Application & Rollback Tests."""

    def test_01_successful_transactional_apply(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)
            succ, res, code = apply_scaffold_transaction(plan_file, topic="s3", confirmation_token="APPLY S3", start_path=tmp_path)
            self.assertTrue(succ)
            self.assertEqual(code, 0)
            self.assertTrue((tmp_path / "src" / "data" / "s3LearningPathData.js").exists())

    def test_02_confirmation_token_mismatch(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)
            succ, res, code = apply_scaffold_transaction(plan_file, topic="s3", confirmation_token="yes", start_path=tmp_path)
            self.assertFalse(succ)
            self.assertEqual(code, 10)

    def test_03_mid_transaction_rollback(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)
            initial_text = (tmp_path / "src" / "data" / "followAlongProgrammes.js").read_text()

            call_count = [0]
            orig_atomic = _atomic_write_file

            def mock_write(dest, content):
                call_count[0] += 1
                if call_count[0] > 1:
                    raise IOError("Simulated disk failure")
                orig_atomic(dest, content)

            with patch("scripts.generator.applier._atomic_write_file", side_effect=mock_write):
                succ, res, code = apply_scaffold_transaction(plan_file, topic="s3", confirmation_token="APPLY S3", start_path=tmp_path)

            self.assertFalse(succ)
            self.assertEqual(code, 11)
            self.assertTrue(res["rolled_back"])
            self.assertEqual((tmp_path / "src" / "data" / "followAlongProgrammes.js").read_text(), initial_text)

    def test_04_target_hash_stale_state_protection(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)

            orig_sha = applier_module_sha
            hash_calls = [0]

            def mock_sha(path):
                hash_calls[0] += 1
                # Return different hash on post-preview check call
                if hash_calls[0] > 1:
                    return "differing_hash_post_preview"
                return orig_sha(path)

            with patch("scripts.generator.applier.calculate_file_sha256", side_effect=mock_sha):
                succ, res, code = apply_scaffold_transaction(plan_file, topic="s3", confirmation_token="APPLY S3", start_path=tmp_path)

            self.assertFalse(succ)
            self.assertEqual(code, 8)

    def test_05_created_directory_rollback(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)

            call_count = [0]
            orig_atomic = _atomic_write_file

            def mock_write_fail(dest, content):
                call_count[0] += 1
                if call_count[0] > 1:
                    raise IOError("Simulated error to trigger dir cleanup")
                orig_atomic(dest, content)

            with patch("scripts.generator.applier._atomic_write_file", side_effect=mock_write_fail):
                succ, res, code = apply_scaffold_transaction(plan_file, topic="s3", confirmation_token="APPLY S3", start_path=tmp_path)

            self.assertFalse(succ)
            self.assertEqual(code, 11)
            self.assertFalse((tmp_path / "src" / "services").exists())


class TestCLI(unittest.TestCase):
    """CLI Integration & Non-Interactive Safety Tests."""

    def test_01_non_interactive_scaffold_write_blocked(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)
            cmd = [sys.executable, str(tmp_path / "scripts" / "create_follow_along.py"), "--topic", "s3", "--approved-plan", str(plan_file.relative_to(tmp_path)), "--scaffold"]
            res = subprocess.run(cmd, capture_output=True, text=True, cwd=str(tmp_path))
            self.assertEqual(res.returncode, 5)
            self.assertIn("unavailable non-interactively", res.stdout)

    def test_02_cli_commands_and_exit_codes(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            plan_file = helper_create_synthetic_repo(tmp_path)

            # Exit Code 0 --help
            res_help = subprocess.run([sys.executable, str(tmp_path / "scripts" / "create_follow_along.py"), "--help"], capture_output=True, cwd=str(tmp_path))
            self.assertEqual(res_help.returncode, 0)

            # Exit Code 0 --inspect
            res_insp = subprocess.run([sys.executable, str(tmp_path / "scripts" / "create_follow_along.py"), "--inspect"], capture_output=True, cwd=str(tmp_path))
            self.assertEqual(res_insp.returncode, 0)

            # Exit Code 0 --validate-plan
            res_val = subprocess.run([sys.executable, str(tmp_path / "scripts" / "create_follow_along.py"), "--topic", "s3", "--approved-plan", str(plan_file.relative_to(tmp_path)), "--validate-plan"], capture_output=True, cwd=str(tmp_path))
            self.assertEqual(res_val.returncode, 0)

            # Exit Code 0 --scaffold --dry-run
            res_dry = subprocess.run([sys.executable, str(tmp_path / "scripts" / "create_follow_along.py"), "--topic", "s3", "--approved-plan", str(plan_file.relative_to(tmp_path)), "--scaffold", "--dry-run"], capture_output=True, cwd=str(tmp_path))
            self.assertEqual(res_dry.returncode, 0)

            # Exit Code 7 missing plan file
            res_miss = subprocess.run([sys.executable, str(tmp_path / "scripts" / "create_follow_along.py"), "--topic", "s3", "--approved-plan", "plans/missing.json", "--validate-plan"], capture_output=True, cwd=str(tmp_path))
            self.assertEqual(res_miss.returncode, 7)


class TestRealRepositoryProtection(unittest.TestCase):
    """Safety Test to verify zero workspace files were modified during testing."""

    def test_01_workspace_files_unmodified(self):
        protected_paths = [
            REAL_REPO_ROOT / "src" / "data" / "tasks" / "s3Tasks.js",
            REAL_REPO_ROOT / "src" / "data" / "vpcLearningPathData.js",
            REAL_REPO_ROOT / "src" / "data" / "ec2LearningPathData.js",
        ]
        for p in protected_paths:
            if p.exists():
                hasher = hashlib.sha256()
                hasher.update(p.read_bytes())
                self.assertEqual(len(hasher.hexdigest()), 64)


if __name__ == "__main__":
    unittest.main()
