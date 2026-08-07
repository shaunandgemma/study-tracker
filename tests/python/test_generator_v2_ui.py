import unittest
import tempfile
from pathlib import Path

from scripts.generator_v2.architecture import ArchitectureModel
from scripts.generator_v2.ui import (
  render_architecture_dashboard,
  render_task_list,
  run_interactive_architecture_ui
)

class TestGeneratorV2UI(unittest.TestCase):

  def setUp(self):
    self.temp_dir = tempfile.TemporaryDirectory()
    self.repo_root = Path(self.temp_dir.name)

    draft_plan = {
      "tasks": [
        {"id": "task-001", "title": "Task 1", "phaseId": "phase-1", "consoleSteps": []},
        {"id": "task-002", "title": "Task 2", "phaseId": "phase-1", "consoleSteps": []}
      ],
      "phases": [{"id": "phase-1", "title": "Phase 1", "description": "Desc 1"}],
      "dependencies": {}
    }

    canonical_audit = {
      "task_audits": [],
      "unresolved_items": [],
      "summary": {}
    }

    self.model = ArchitectureModel.create_initial("uitest", draft_plan, canonical_audit, "fp123")

  def tearDown(self):
    self.temp_dir.cleanup()

  def test_dashboard_rendering(self):
    dashboard = render_architecture_dashboard(self.model)
    self.assertIn("ARCHITECTURE REVIEW DASHBOARD", dashboard)
    self.assertIn("uitest-learning-path", dashboard)
    self.assertIn("Canonical Tasks:       2", dashboard)

  def test_task_list_rendering(self):
    task_list = render_task_list(self.model)
    self.assertIn("task-001", task_list)
    self.assertIn("task-002", task_list)

  def test_menu_quit(self):
    inputs = ["Q"]
    def mock_input(prompt: str) -> str:
      return inputs.pop(0)

    action, err = run_interactive_architecture_ui(self.model, input_func=mock_input)
    self.assertEqual(action, "quit")
    self.assertIsNone(err)

  def test_menu_save_draft(self):
    inputs = ["S"]
    def mock_input(prompt: str) -> str:
      return inputs.pop(0)

    action, err = run_interactive_architecture_ui(self.model, input_func=mock_input)
    self.assertEqual(action, "saved_draft")

  def test_menu_reclassify_task(self):
    # Options: 1 (reclassify), Task #1, O (Optional), Q (quit)
    inputs = ["1", "1", "O", "Q"]
    def mock_input(prompt: str) -> str:
      return inputs.pop(0)

    action, err = run_interactive_architecture_ui(self.model, input_func=mock_input)
    self.assertEqual(action, "quit")
    task1 = [t for t in self.model.data["tasks"] if t["id"] == "task-001"][0]
    self.assertEqual(task1["classification"], "Optional")

  def test_menu_approval_flow(self):
    # Options: A (approve), APPROVE (confirm text)
    inputs = ["A", "APPROVE"]
    def mock_input(prompt: str) -> str:
      return inputs.pop(0)

    action, err = run_interactive_architecture_ui(self.model, input_func=mock_input)
    self.assertEqual(action, "approved")
    self.assertTrue(self.model.is_approved)

  def test_menu_blocked_approval_flow(self):
    self.model.data["unresolved_items"].append({
      "id": "unres-block",
      "text": "Blocked safety item",
      "is_safety_critical": True,
      "acknowledged": False
    })

    # Options: A (attempt approval -> blocked prompt), Enter, Q (quit)
    inputs = ["A", "", "Q"]
    def mock_input(prompt: str) -> str:
      return inputs.pop(0)

    action, err = run_interactive_architecture_ui(self.model, input_func=mock_input)
    self.assertEqual(action, "quit")
    self.assertFalse(self.model.is_approved)

  def test_invalid_input_handling(self):
    inputs = ["INVALID_CHOICE", "Q"]
    def mock_input(prompt: str) -> str:
      return inputs.pop(0)

    action, err = run_interactive_architecture_ui(self.model, input_func=mock_input)
    self.assertEqual(action, "quit")


if __name__ == "__main__":
  unittest.main()
