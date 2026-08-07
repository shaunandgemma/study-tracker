import unittest
import tempfile
import json
from pathlib import Path

from scripts.generator_v2.architecture import ArchitectureModel, load_architecture

class TestGeneratorV2Architecture(unittest.TestCase):

  def setUp(self):
    self.temp_dir = tempfile.TemporaryDirectory()
    self.repo_root = Path(self.temp_dir.name)

  def tearDown(self):
    self.temp_dir.cleanup()

  def _make_synthetic_inputs(self, task_count: int, phase_count: int, has_safety_blocker: bool = False):
    draft_tasks = []
    task_audits = []

    for i in range(1, task_count + 1):
      t_id = f"task-synth-{i:03d}"
      p_id = f"phase-{(i - 1) % phase_count + 1}"
      draft_tasks.append({
        "id": t_id,
        "title": f"Synthetic Task {i}",
        "phaseId": p_id,
        "goal": f"Goal for task {i}",
        "consoleSteps": [{"id": "s1"}],
        "cliSteps": [{"commands": ["aws test"]}]
      })
      task_audits.append({
        "task_id": t_id,
        "is_optional": (i % 5 == 0),
        "is_review_only": (i % 7 == 0),
        "heuristic_proposals": ["Candidate for OPTIONAL branch task"] if (i % 5 == 0) else []
      })

    draft_phases = []
    for p in range(1, phase_count + 1):
      draft_phases.append({
        "id": f"phase-{p}",
        "title": f"Phase {p}",
        "description": f"Synthetic Phase {p} Description"
      })

    draft_plan = {"tasks": draft_tasks, "phases": draft_phases, "dependencies": {}}
    
    unresolved_items = []
    if has_safety_blocker:
      unresolved_items.append({
        "id": "unresolved-001",
        "text": "Critical safety issue: Password policy modification",
        "task_id": "task-synth-001",
        "is_safety_critical": True
      })

    canonical_audit = {
      "task_audits": task_audits,
      "unresolved_items": unresolved_items,
      "summary": {
        "potential_account": ["AccountPasswordPolicy"],
        "potential_destructive": [t["id"] for t in draft_tasks if "task-synth-00" in t["id"]]
      }
    }

    return draft_plan, canonical_audit

  def test_1_task_1_phase_0_cleanup(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=1, phase_count=1)
    model = ArchitectureModel.create_initial("synth1", draft_plan, canonical_audit, "fp123")

    self.assertEqual(len(model.data["tasks"]), 1)
    self.assertEqual(len(model.data["phases"]), 1)
    self.assertFalse(model.is_approved)
    self.assertEqual(model.status, "draft")

  def test_9_tasks_3_phases(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=9, phase_count=3)
    model = ArchitectureModel.create_initial("synth9", draft_plan, canonical_audit, "fp123")

    self.assertEqual(len(model.data["tasks"]), 9)
    self.assertEqual(len(model.data["phases"]), 3)

  def test_22_tasks_6_phases(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=22, phase_count=6)
    model = ArchitectureModel.create_initial("synth22", draft_plan, canonical_audit, "fp123")

    self.assertEqual(len(model.data["tasks"]), 22)
    self.assertEqual(len(model.data["phases"]), 6)

  def test_33_tasks_7_phases(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=33, phase_count=7)
    model = ArchitectureModel.create_initial("synth33", draft_plan, canonical_audit, "fp123")

    self.assertEqual(len(model.data["tasks"]), 33)
    self.assertEqual(len(model.data["phases"]), 7)

  def test_classification_edits(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=5, phase_count=2)
    model = ArchitectureModel.create_initial("synth_edit", draft_plan, canonical_audit, "fp123")

    res = model.update_task_classification("task-synth-001", "Optional")
    self.assertTrue(res)
    task1 = [t for t in model.data["tasks"] if t["id"] == "task-synth-001"][0]
    self.assertEqual(task1["classification"], "Optional")
    self.assertEqual(task1["provenance"], "HUMAN DECISION")

  def test_phase_edits(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=5, phase_count=2)
    model = ArchitectureModel.create_initial("synth_phase", draft_plan, canonical_audit, "fp123")

    res = model.update_task_phase("task-synth-001", "phase-2")
    self.assertTrue(res)
    task1 = [t for t in model.data["tasks"] if t["id"] == "task-synth-001"][0]
    self.assertEqual(task1["phase_id"], "phase-2")

  def test_safety_blocker_prevents_approval(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=5, phase_count=2, has_safety_blocker=True)
    model = ArchitectureModel.create_initial("synth_block", draft_plan, canonical_audit, "fp123")

    success, fp, err = model.approve_architecture()
    self.assertFalse(success)
    self.assertIsNone(fp)
    self.assertIn("unresolved safety blockers", err)

  def test_acknowledgement_unblocks_approval(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=5, phase_count=2, has_safety_blocker=True)
    model = ArchitectureModel.create_initial("synth_ack", draft_plan, canonical_audit, "fp123")

    model.acknowledge_unresolved_item("unresolved-001")
    success, fp, err = model.approve_architecture()
    self.assertTrue(success)
    self.assertIsNotNone(fp)
    self.assertTrue(model.is_approved)

  def test_fingerprint_generation_and_load(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=5, phase_count=2)
    model = ArchitectureModel.create_initial("synth_save", draft_plan, canonical_audit, "fp123")

    model.approve_architecture()
    json_path, md_path = model.save(base_dir=self.repo_root)

    self.assertTrue(json_path.exists())
    self.assertTrue(md_path.exists())

    loaded = load_architecture("synth_save", base_dir=self.repo_root)
    self.assertIsNotNone(loaded)
    self.assertTrue(loaded.is_approved)
    self.assertEqual(loaded.data["architecture_fingerprint"], model.data["architecture_fingerprint"])

  def test_edit_invalidates_approval(self):
    draft_plan, canonical_audit = self._make_synthetic_inputs(task_count=5, phase_count=2)
    model = ArchitectureModel.create_initial("synth_inval", draft_plan, canonical_audit, "fp123")

    model.approve_architecture()
    self.assertTrue(model.is_approved)

    # Edit classification after approval
    model.update_task_classification("task-synth-001", "Optional")
    self.assertFalse(model.is_approved)
    self.assertEqual(model.status, "draft")
    self.assertIsNone(model.data["architecture_fingerprint"])


if __name__ == "__main__":
  unittest.main()
