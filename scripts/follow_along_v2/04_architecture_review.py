import argparse
import json
import sys
from pathlib import Path

# Ensure repository root is on sys.path for direct CLI invocation
repo_root_path = str(Path(__file__).resolve().parent.parent.parent)
if repo_root_path not in sys.path:
  sys.path.insert(0, repo_root_path)

from scripts.generator_v2.architecture import ArchitectureModel, load_architecture
from scripts.generator_v2.ui import run_interactive_architecture_ui
from scripts.generator.inspector import calculate_task_file_fingerprint, find_task_directory
from scripts.generator_v2.state import load_state, save_state

def run_step_04(
  topic: str,
  base_dir: str = ".",
  non_interactive: bool = False,
  approve_default: bool = False
) -> int:
  root = Path(base_dir).resolve()
  topic_clean = topic.lower().strip()
  programme_id = f"{topic_clean}-learning-path"

  print("============================================================")
  print(" STEP 04 — ARCHITECTURE REVIEW")
  print("============================================================")
  print(f"Service:             {topic_clean.upper()}")
  print(f"Programme ID:        {programme_id}")

  # Verify Step 01, 02, 03 prerequisites
  state = load_state(topic_clean, base_dir=root)
  if not state or any(s not in state.completed_steps for s in (1, 2, 3)):
    print("Prerequisite Error:  Steps 01, 02, and 03 must pass before running Architecture Review.")
    print("STEP 04: BLOCKED")
    return 1

  # Check canonical fingerprint staleness
  task_dir = find_task_directory(root)
  task_file = task_dir / f"{topic_clean}Tasks.js"
  if not task_file.exists():
    print(f"Inspection Error:    Canonical task file not found: {task_file}")
    print("STEP 04: BLOCKED")
    return 1

  live_fingerprint = calculate_task_file_fingerprint(task_file)
  if state.canonical_fingerprint != live_fingerprint:
    print("Stale State Error:   Canonical task file modified since Step 01/02/03.")
    print("Action Required:     Re-run Step 01 (Inspect Service).")
    print("STEP 04: BLOCKED")
    state.invalidate_downstream_steps(1)
    save_state(state, base_dir=root)
    return 1

  # Load or initialize architecture model
  model = load_architecture(topic_clean, base_dir=root)
  if not model:
    draft_file = root / "plans" / f"{programme_id}-draft.json"
    audit_file = root / "plans" / f"{programme_id}-canonical-audit.json"

    if not draft_file.exists() or not audit_file.exists():
      print("Error:               Missing Step 02 draft or Step 03 canonical audit report.")
      print("STEP 04: BLOCKED")
      return 1

    with open(draft_file, "r", encoding="utf-8") as f:
      draft_plan = json.load(f)
    with open(audit_file, "r", encoding="utf-8") as f:
      canonical_audit = json.load(f)

    model = ArchitectureModel.create_initial(
      topic=topic_clean,
      draft_plan=draft_plan,
      canonical_audit=canonical_audit,
      canonical_fingerprint=live_fingerprint
    )

  if non_interactive or approve_default:
    has_blockers, blockers = model.check_safety_blockers()
    if has_blockers:
      print(f"Non-Interactive Error: Cannot approve due to {len(blockers)} unresolved safety blockers.")
      for b in blockers:
        print(f"  * {b}")
      json_path, md_path = model.save(base_dir=root)
      print(f"Draft saved to:      {json_path.relative_to(root)}")
      print("STEP 04: BLOCKED")
      state.mark_step_failed(4)
      save_state(state, base_dir=root)
      return 1
    else:
      success, fp, err = model.approve_architecture()
      if not success:
        print(f"Approval Error:      {err}")
        print("STEP 04: BLOCKED")
        state.mark_step_failed(4)
        save_state(state, base_dir=root)
        return 1
      action = "approved"
  else:
    action, err = run_interactive_architecture_ui(model)
    if action == "quit":
      print("Notice:              Architecture review exited without saving.")
      print("STEP 04: CANCELLED")
      return 0

  json_path, md_path = model.save(base_dir=root)

  if model.is_approved:
    fp = model.data.get("architecture_fingerprint")
    state.architecture_fingerprint = fp
    state.mark_step_completed(4)
    save_state(state, base_dir=root)

    print(f"Status:              APPROVED")
    print(f"Architecture Path:   {json_path.relative_to(root) if json_path.is_relative_to(root) else json_path}")
    print(f"Report Path:         {md_path.relative_to(root) if md_path.is_relative_to(root) else md_path}")
    print(f"Fingerprint:         {fp}")
    print(f"Approved At:         {model.data.get('approved_at')}")
    print("------------------------------------------------------------")
    print("STEP 04: PASSED")
    print("NEXT: STEP 05 — CREATE APPROVED PLAN")
    return 0
  else:
    print(f"Status:              DRAFT (UNAPPROVED)")
    print(f"Architecture Path:   {json_path.relative_to(root) if json_path.is_relative_to(root) else json_path}")
    print(f"Report Path:         {md_path.relative_to(root) if md_path.is_relative_to(root) else md_path}")
    print("------------------------------------------------------------")
    print("STEP 04: IN PROGRESS (UNAPPROVED)")
    return 0


def main():
  parser = argparse.ArgumentParser(description="Step 04 — Interactive Architecture Review")
  parser.add_argument("--topic", required=True, help="AWS service topic (e.g. iam, s3, vpc, ec2, dynamodb)")
  parser.add_argument("--base-dir", default=".", help="Repository root directory")
  parser.add_argument("--non-interactive", action="store_true", help="Run without terminal UI prompts")
  parser.add_argument("--approve-default", action="store_true", help="Auto-approve default proposal if no blockers")
  args = parser.parse_args()

  sys.exit(run_step_04(
    topic=args.topic,
    base_dir=args.base_dir,
    non_interactive=args.non_interactive,
    approve_default=args.approve_default
  ))


if __name__ == "__main__":
  main()
