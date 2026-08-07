import unittest
import tempfile
import json
import shutil
from pathlib import Path

import importlib
from scripts.generator_v2.audit_engine import audit_canonical_tasks, generate_audit_reports, analyze_task_content
from scripts.generator_v2.state import load_state, save_state, create_initial_state

step_01_mod = importlib.import_module("scripts.follow_along_v2.01_inspect_service")
step_02_mod = importlib.import_module("scripts.follow_along_v2.02_generate_draft")
step_03_mod = importlib.import_module("scripts.follow_along_v2.03_canonical_audit")

run_step_01 = step_01_mod.run_step_01
run_step_02 = step_02_mod.run_step_02
run_step_03 = step_03_mod.run_step_03

class TestGeneratorV2Audit(unittest.TestCase):

  def setUp(self):
    self.temp_dir = tempfile.TemporaryDirectory()
    self.repo_root = Path(self.temp_dir.name)

    # Setup synthetic task file for topic "testsvc"
    tasks_dir = self.repo_root / "src" / "data" / "tasks"
    tasks_dir.mkdir(parents=True, exist_ok=True)
    
    self.task_file = tasks_dir / "testsvcTasks.js"
    self.task_content = """
export const TESTSVC_TASKS = [
  {
    id: 'task-testsvc-001',
    title: 'Create Test Resource',
    goal: 'Goal: Create a test resource with console and CLI',
    consoleSteps: [
      {
        number: 1,
        title: 'Console step 1',
        instructions: [{ id: 'i1', text: 'Do console action' }]
      }
    ],
    cliSteps: [
      {
        number: 1,
        title: 'CLI step 1',
        commands: [{ text: 'aws testsvc create-resource --name test' }]
      }
    ],
    verification: [{ text: 'Verify resource exists' }],
    cleanup: [{ text: 'Delete test resource' }]
  },
  {
    id: 'task-testsvc-cross-account-002',
    title: 'Cross Account Access with PrincipalOrgID',
    goal: 'Goal: Configure cross-account access and Organization policy',
    consoleSteps: [],
    cliSteps: [],
    verification: [],
    cleanup: []
  }
];
"""
    self.task_file.write_text(self.task_content, encoding="utf-8")

  def tearDown(self):
    self.temp_dir.cleanup()

  def test_step_01_valid_canonical_service(self):
    exit_code = run_step_01("testsvc", base_dir=self.repo_root)
    self.assertEqual(exit_code, 0)
    
    state = load_state("testsvc", base_dir=self.repo_root)
    self.assertIsNotNone(state)
    self.assertIn(1, state.completed_steps)
    self.assertIsNotNone(state.canonical_fingerprint)

  def test_step_01_missing_service(self):
    exit_code = run_step_01("nonexistentservice", base_dir=self.repo_root)
    self.assertEqual(exit_code, 1)

  def test_step_01_existing_follow_along_detection(self):
    data_dir = self.repo_root / "src" / "data"
    data_file = data_dir / "testsvcLearningPathData.js"
    data_file.write_text("// dummy data", encoding="utf-8")

    exit_code = run_step_01("testsvc", base_dir=self.repo_root)
    self.assertEqual(exit_code, 0)

  def test_step_02_prerequisite_enforcement(self):
    # Running Step 02 without Step 01 completed should fail
    exit_code = run_step_02("testsvc", base_dir=self.repo_root)
    self.assertEqual(exit_code, 1)

  def test_step_02_valid_draft_creation(self):
    run_step_01("testsvc", base_dir=self.repo_root)
    exit_code = run_step_02("testsvc", base_dir=self.repo_root)
    self.assertEqual(exit_code, 0)

    draft_file = self.repo_root / "plans" / "testsvc-learning-path-draft.json"
    self.assertTrue(draft_file.exists())
    
    state = load_state("testsvc", base_dir=self.repo_root)
    self.assertIn(2, state.completed_steps)

  def test_step_02_stale_fingerprint_rejection(self):
    run_step_01("testsvc", base_dir=self.repo_root)
    
    # Mutate canonical task file
    self.task_file.write_text(self.task_content + "\n// modified", encoding="utf-8")

    exit_code = run_step_02("testsvc", base_dir=self.repo_root)
    self.assertEqual(exit_code, 1)

  def test_step_03_prerequisite_enforcement(self):
    exit_code = run_step_03("testsvc", base_dir=self.repo_root)
    self.assertEqual(exit_code, 1)

  def test_step_03_audit_engine_categorization(self):
    run_step_01("testsvc", base_dir=self.repo_root)
    run_step_02("testsvc", base_dir=self.repo_root)
    
    exit_code = run_step_03("testsvc", base_dir=self.repo_root)
    self.assertEqual(exit_code, 0)

    json_report = self.repo_root / "plans" / "testsvc-learning-path-canonical-audit.json"
    md_report = self.repo_root / "plans" / "testsvc-learning-path-canonical-audit.md"
    self.assertTrue(json_report.exists())
    self.assertTrue(md_report.exists())

    with open(json_report, "r", encoding="utf-8") as f:
      audit_data = json.load(f)

    self.assertTrue(audit_data.get("success"))
    self.assertEqual(audit_data.get("canonical_task_count"), 2)

    audits = audit_data.get("task_audits", [])
    task2 = [a for a in audits if a["task_id"] == "task-testsvc-cross-account-002"][0]
    self.assertTrue(task2["is_cross_account"])
    self.assertIn("Candidate for OPTIONAL branch task", task2["heuristic_proposals"])


if __name__ == "__main__":
  unittest.main()
