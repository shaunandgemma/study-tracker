import unittest
import tempfile
import sys
import json
from pathlib import Path

from scripts.generator_v2.state import (
  GeneratorState,
  get_state_path,
  create_initial_state,
  load_state,
  save_state,
  compute_file_sha256,
  evaluate_stale_cascade,
  STATE_SCHEMA_VERSION
)
from scripts.generator_v2.runner import (
  run_command_safe,
  ProcessResult
)

class TestGeneratorV2State(unittest.TestCase):

  def setUp(self):
    self.temp_dir = tempfile.TemporaryDirectory()
    self.base_dir = Path(self.temp_dir.name)

  def tearDown(self):
    self.temp_dir.cleanup()

  def test_initial_state_creation(self):
    state = create_initial_state("dynamodb")
    self.assertEqual(state.topic, "dynamodb")
    self.assertEqual(state.programme_id, "dynamodb-learning-path")
    self.assertEqual(state.path_id, "dynamodb-learning-path")
    self.assertEqual(state.version, STATE_SCHEMA_VERSION)
    self.assertEqual(state.completed_steps, [])
    self.assertEqual(state.failed_steps, [])
    self.assertEqual(state.invalidated_steps, [])
    self.assertEqual(state.implementation_status, "not_started")
    self.assertEqual(state.integration_status, "deferred")

  def test_save_and_load_round_trip(self):
    state = create_initial_state("s3")
    state.canonical_fingerprint = "abc123hash"
    state.mark_step_completed(1)
    state.mark_step_completed(2)
    
    saved = save_state(state, base_dir=self.base_dir)
    self.assertTrue(saved)

    state_file = get_state_path("s3", base_dir=self.base_dir)
    self.assertTrue(state_file.exists())
    # Verify file is inside temporary directory, not real repo
    self.assertTrue(str(self.base_dir) in str(state_file))

    loaded = load_state("s3", base_dir=self.base_dir)
    self.assertIsNotNone(loaded)
    self.assertEqual(loaded.topic, "s3")
    self.assertEqual(loaded.canonical_fingerprint, "abc123hash")
    self.assertEqual(loaded.completed_steps, [1, 2])
    self.assertIn("step_01", loaded.timestamps)
    self.assertIn("step_02", loaded.timestamps)

  def test_topic_isolation(self):
    state1 = create_initial_state("topic1")
    state2 = create_initial_state("topic2")
    state1.mark_step_completed(1)
    state2.mark_step_completed(3)

    save_state(state1, base_dir=self.base_dir)
    save_state(state2, base_dir=self.base_dir)

    loaded1 = load_state("topic1", base_dir=self.base_dir)
    loaded2 = load_state("topic2", base_dir=self.base_dir)

    self.assertEqual(loaded1.completed_steps, [1])
    self.assertEqual(loaded2.completed_steps, [3])

  def test_schema_and_version_marker(self):
    state = create_initial_state("test")
    d = state.to_dict()
    self.assertEqual(d["version"], STATE_SCHEMA_VERSION)
    self.assertEqual(d["topic"], "test")

  def test_completed_step_persistence(self):
    state = create_initial_state("iam")
    state.mark_step_completed(1)
    state.mark_step_completed(5)
    save_state(state, base_dir=self.base_dir)

    loaded = load_state("iam", base_dir=self.base_dir)
    self.assertEqual(loaded.completed_steps, [1, 5])

  def test_failed_step_persistence(self):
    state = create_initial_state("iam")
    state.mark_step_failed(4)
    self.assertEqual(state.failed_steps, [4])
    self.assertIn("step_04_failed", state.timestamps)

  def test_invalidated_step_persistence(self):
    state = create_initial_state("vpc")
    state.mark_step_completed(1)
    state.mark_step_completed(2)
    state.mark_step_completed(3)
    
    invalidated = state.invalidate_downstream_steps(from_step_number=2)
    self.assertEqual(invalidated, [2, 3])
    self.assertEqual(state.completed_steps, [1])
    self.assertEqual(state.invalidated_steps, [2, 3])

  def test_fingerprint_persistence_and_mismatch(self):
    dummy_file = self.base_dir / "test_file.txt"
    dummy_file.write_text("hello world", encoding="utf-8")
    fp = compute_file_sha256(dummy_file)
    self.assertIsNotNone(fp)

    dummy_file.write_text("hello world modified", encoding="utf-8")
    fp_new = compute_file_sha256(dummy_file)
    self.assertNotEqual(fp, fp_new)

  def test_stale_cascade_foundation(self):
    state = create_initial_state("dynamodb")
    state.canonical_fingerprint = "old_fingerprint"
    state.mark_step_completed(1)
    state.mark_step_completed(2)
    state.mark_step_completed(3)

    invalidated = evaluate_stale_cascade(state, "new_fingerprint")
    self.assertEqual(invalidated, [2, 3])
    self.assertEqual(state.canonical_fingerprint, "new_fingerprint")
    self.assertEqual(state.completed_steps, [1])
    self.assertEqual(state.invalidated_steps, [2, 3])

  def test_transaction_and_status_persistence(self):
    state = create_initial_state("test")
    state.transaction_id = "tx-test-12345"
    state.implementation_status = "scaffold_applied"
    state.integration_status = "available"
    save_state(state, base_dir=self.base_dir)

    loaded = load_state("test", base_dir=self.base_dir)
    self.assertEqual(loaded.transaction_id, "tx-test-12345")
    self.assertEqual(loaded.implementation_status, "scaffold_applied")
    self.assertEqual(loaded.integration_status, "available")

  def test_malformed_and_missing_state_handling(self):
    self.assertIsNone(load_state("non_existent_topic", base_dir=self.base_dir))

    bad_file = get_state_path("bad_topic", base_dir=self.base_dir)
    bad_file.parent.mkdir(parents=True, exist_ok=True)
    bad_file.write_text("{ invalid json }", encoding="utf-8")
    self.assertIsNone(load_state("bad_topic", base_dir=self.base_dir))

    with self.assertRaises(ValueError):
      GeneratorState.from_dict({})

  def test_atomic_write_behaviour(self):
    state = create_initial_state("atomic")
    success = save_state(state, base_dir=self.base_dir)
    self.assertTrue(success)
    state_file = get_state_path("atomic", base_dir=self.base_dir)
    self.assertTrue(state_file.exists())

  def test_subprocess_success_capture(self):
    res = run_command_safe([sys.executable, "-c", "print('hello generator v2')"], cwd=self.base_dir)
    self.assertTrue(res.success)
    self.assertEqual(res.exit_code, 0)
    self.assertIn("hello generator v2", res.stdout)

  def test_subprocess_failure_capture(self):
    res = run_command_safe([sys.executable, "-c", "import sys; sys.stderr.write('error msg'); sys.exit(42)"], cwd=self.base_dir)
    self.assertFalse(res.success)
    self.assertEqual(res.exit_code, 42)
    self.assertIn("error msg", res.stderr)

  def test_subprocess_working_directory(self):
    sub_dir = self.base_dir / "subdir"
    sub_dir.mkdir()
    res = run_command_safe([sys.executable, "-c", "import os; print(os.getcwd())"], cwd=sub_dir)
    self.assertTrue(res.success)
    self.assertEqual(Path(res.stdout.strip()).resolve(), sub_dir.resolve())


if __name__ == "__main__":
  unittest.main()
