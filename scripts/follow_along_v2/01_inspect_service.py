import argparse
import sys
from pathlib import Path

# Ensure repository root is on sys.path for direct CLI invocation
repo_root_path = str(Path(__file__).resolve().parent.parent.parent)
if repo_root_path not in sys.path:
  sys.path.insert(0, repo_root_path)

from scripts.generator.inspector import (
  parse_task_file_safely,
  calculate_task_file_fingerprint,
  find_task_directory
)
from scripts.generator_v2.state import (
  load_state,
  save_state,
  create_initial_state,
  evaluate_stale_cascade
)

def run_step_01(topic: str, base_dir: str = ".") -> int:
  root = Path(base_dir).resolve()
  topic_clean = topic.lower().strip()
  programme_id = f"{topic_clean}-learning-path"
  task_dir = find_task_directory(root)
  task_file = task_dir / f"{topic_clean}Tasks.js"

  print("============================================================")
  print(" STEP 01 — INSPECT SERVICE")
  print("============================================================")
  print(f"Service:             {topic_clean.upper()}")
  print(f"Programme ID:        {programme_id}")
  print(f"Canonical Task File: {task_file.relative_to(root) if task_file.is_relative_to(root) else task_file}")

  if not task_file.exists():
    print(f"Export:              UNKNOWN")
    print(f"Canonical Tasks:     0")
    print(f"Parser Confidence:   FAILED")
    print(f"Reason:              Canonical task file not found: {task_file}")
    print("------------------------------------------------------------")
    print("STEP 01: BLOCKED")
    
    state = load_state(topic_clean, base_dir=root) or create_initial_state(topic_clean)
    state.mark_step_failed(1)
    save_state(state, base_dir=root)
    return 1

  parse_res = parse_task_file_safely(task_file)
  if parse_res.get("errors") or not parse_res.get("tasks"):
    print(f"Export:              UNKNOWN")
    print(f"Canonical Tasks:     0")
    print(f"Parser Confidence:   FAILED")
    print(f"Reason:              {', '.join(parse_res.get('errors')) if parse_res.get('errors') else 'Zero canonical tasks parsed'}")
    print("------------------------------------------------------------")
    print("STEP 01: BLOCKED")
    
    state = load_state(topic_clean, base_dir=root) or create_initial_state(topic_clean)
    state.mark_step_failed(1)
    save_state(state, base_dir=root)
    return 1

  export_name = parse_res.get("export_variable")
  task_count = parse_res.get("task_count", len(parse_res.get("tasks", [])))
  canonical_fingerprint = calculate_task_file_fingerprint(task_file)
  
  existing_data_file = root / "src" / "data" / f"{topic_clean}LearningPathData.js"
  has_existing = existing_data_file.exists()

  print(f"Export:              {export_name}")
  print(f"Canonical Tasks:     {task_count}")
  print(f"Parser Confidence:   HIGH")
  print(f"Existing Follow Along: {'YES' if has_existing else 'NO'}")
  print(f"Fingerprint:         {canonical_fingerprint}")
  print("------------------------------------------------------------")

  if task_count == 0:
    print("Reason:              Zero canonical tasks found")
    print("STEP 01: BLOCKED")
    state = load_state(topic_clean, base_dir=root) or create_initial_state(topic_clean)
    state.mark_step_failed(1)
    save_state(state, base_dir=root)
    return 1

  # Load or create state and evaluate stale cascade
  state = load_state(topic_clean, base_dir=root) or create_initial_state(topic_clean)
  
  invalidated = evaluate_stale_cascade(state, canonical_fingerprint)
  if invalidated:
    print(f"Notice:              Canonical source changed! Downstream steps invalidated: {invalidated}")

  state.canonical_fingerprint = canonical_fingerprint
  state.mark_step_completed(1)
  save_state(state, base_dir=root)

  print("STEP 01: PASSED")
  return 0


def main():
  parser = argparse.ArgumentParser(description="Step 01 — Inspect Service Canonical Tasks")
  parser.add_argument("--topic", required=True, help="AWS service topic (e.g. iam, s3, vpc, ec2)")
  parser.add_argument("--base-dir", default=".", help="Repository root directory")
  args = parser.parse_args()

  sys.exit(run_step_01(args.topic, args.base_dir))


if __name__ == "__main__":
  main()
