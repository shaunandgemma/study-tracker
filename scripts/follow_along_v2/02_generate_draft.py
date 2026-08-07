import argparse
import sys
import json
from pathlib import Path
import shutil

# Ensure repository root is on sys.path for direct CLI invocation
repo_root_path = str(Path(__file__).resolve().parent.parent.parent)
if repo_root_path not in sys.path:
  sys.path.insert(0, repo_root_path)

from scripts.generator.planner import generate_draft_plan
from scripts.generator.inspector import (
  calculate_task_file_fingerprint,
  parse_task_file_safely,
  find_task_directory
)
from scripts.generator_v2.state import (
  load_state,
  save_state,
  create_initial_state,
  compute_file_sha256
)

def run_step_02(topic: str, base_dir: str = ".") -> int:
  root = Path(base_dir).resolve()
  topic_clean = topic.lower().strip()
  programme_id = f"{topic_clean}-learning-path"
  task_dir = find_task_directory(root)
  task_file = task_dir / f"{topic_clean}Tasks.js"

  print("============================================================")
  print(" STEP 02 — GENERATE DRAFT PLAN")
  print("============================================================")
  print(f"Service:             {topic_clean.upper()}")
  print(f"Programme ID:        {programme_id}")

  # Verify Step 01 prerequisite
  state = load_state(topic_clean, base_dir=root)
  if not state or 1 not in state.completed_steps:
    print("Prerequisite Error:  Step 01 (Inspect Service) must pass before generating draft.")
    print("STEP 02: BLOCKED")
    return 1

  # Check canonical fingerprint staleness
  if not task_file.exists():
    print(f"Inspection Error:    Canonical task file not found: {task_file}")
    print("STEP 02: BLOCKED")
    return 1

  live_fingerprint = calculate_task_file_fingerprint(task_file)
  if state.canonical_fingerprint != live_fingerprint:
    print("Stale State Error:   Canonical task file modified since Step 01 was run.")
    print("Action Required:     Re-run Step 01 (Inspect Service).")
    print("STEP 02: BLOCKED")
    state.invalidate_downstream_steps(1)
    save_state(state, base_dir=root)
    return 1

  plans_dir = root / "plans"
  plans_dir.mkdir(parents=True, exist_ok=True)
  target_draft_path = plans_dir / f"{programme_id}-draft.json"

  # Generate draft plan using existing planner
  draft_path, draft_payload, exit_code = generate_draft_plan(topic_clean, start_path=root)
  
  if exit_code != 0 or not draft_payload:
    if target_draft_path.exists():
      with open(target_draft_path, "r", encoding="utf-8") as f:
        draft_payload = json.load(f)
      print(f"Notice:              Existing draft plan retained at {target_draft_path.relative_to(root)}")
    else:
      print(f"Draft Error:         Planner failed with exit code {exit_code}: {draft_payload.get('error') if isinstance(draft_payload, dict) else ''}")
      print("STEP 02: BLOCKED")
      state.mark_step_failed(2)
      save_state(state, base_dir=root)
      return 1
  else:
    if draft_path and draft_path.exists() and draft_path != target_draft_path:
      shutil.copy2(draft_path, target_draft_path)
    else:
      with open(target_draft_path, "w", encoding="utf-8") as f:
        json.dump(draft_payload, f, indent=2)

  draft_fp = compute_file_sha256(target_draft_path)

  print(f"Draft status:        GENERATED")
  print(f"Canonical tasks:     {len(draft_payload.get('tasks', []))}")
  print(f"Draft path:          {target_draft_path.relative_to(root) if target_draft_path.is_relative_to(root) else target_draft_path}")
  print(f"Fingerprint:         {draft_fp}")
  print(f"Approval status:     DRAFT (UNAPPROVED)")
  print("------------------------------------------------------------")

  state.mark_step_completed(2)
  save_state(state, base_dir=root)

  print("STEP 02: PASSED")
  return 0


def main():
  parser = argparse.ArgumentParser(description="Step 02 — Generate Draft Follow Along Plan")
  parser.add_argument("--topic", required=True, help="AWS service topic (e.g. iam, s3, vpc, ec2)")
  parser.add_argument("--base-dir", default=".", help="Repository root directory")
  args = parser.parse_args()

  sys.exit(run_step_02(args.topic, args.base_dir))


if __name__ == "__main__":
  main()
