import argparse
import sys
from pathlib import Path

# Ensure repository root is on sys.path for direct CLI invocation
repo_root_path = str(Path(__file__).resolve().parent.parent.parent)
if repo_root_path not in sys.path:
  sys.path.insert(0, repo_root_path)

from scripts.generator_v2.audit_engine import audit_canonical_tasks, generate_audit_reports
from scripts.generator.inspector import (
  calculate_task_file_fingerprint,
  find_task_directory
)
from scripts.generator_v2.state import load_state, save_state

def run_step_03(topic: str, base_dir: str = ".") -> int:
  root = Path(base_dir).resolve()
  topic_clean = topic.lower().strip()
  programme_id = f"{topic_clean}-learning-path"
  task_dir = find_task_directory(root)
  task_file = task_dir / f"{topic_clean}Tasks.js"

  print("============================================================")
  print(" STEP 03 — CANONICAL SAFETY AUDIT")
  print("============================================================")
  print(f"Service:             {topic_clean.upper()}")
  print(f"Programme ID:        {programme_id}")

  # Verify Step 01 & 02 prerequisites
  state = load_state(topic_clean, base_dir=root)
  if not state or 1 not in state.completed_steps or 2 not in state.completed_steps:
    print("Prerequisite Error:  Steps 01 and 02 must pass before running canonical audit.")
    print("STEP 03: BLOCKED")
    return 1

  # Check canonical fingerprint staleness
  if not task_file.exists():
    print(f"Inspection Error:    Canonical task file not found: {task_file}")
    print("STEP 03: BLOCKED")
    return 1

  live_fingerprint = calculate_task_file_fingerprint(task_file)
  if state.canonical_fingerprint != live_fingerprint:
    print("Stale State Error:   Canonical task file modified since Step 01/02.")
    print("Action Required:     Re-run Step 01 (Inspect Service).")
    print("STEP 03: BLOCKED")
    state.invalidate_downstream_steps(1)
    save_state(state, base_dir=root)
    return 1

  # Run audit engine
  audit_res = audit_canonical_tasks(topic_clean, repo_root=root)
  if not audit_res.get("success"):
    print(f"Audit Error:         {audit_res.get('error', 'Audit failed')}")
    print("STEP 03: BLOCKED")
    state.mark_step_failed(3)
    save_state(state, base_dir=root)
    return 1

  plans_dir = root / "plans"
  json_path, md_path = generate_audit_reports(topic_clean, audit_res, output_dir=plans_dir)

  summary = audit_res.get("summary", {})

  print("============================================================")
  print(" CANONICAL AUDIT SUMMARY")
  print("============================================================")
  print(f"Canonical Tasks:       {summary.get('total_tasks')}")
  print(f"Deterministic Findings: {summary.get('deterministic_findings_count')}")
  print(f"Heuristic Proposals:   {summary.get('heuristic_proposals_count')}")
  print(f"Unresolved Items:      {summary.get('unresolved_items_count')}")
  print(f"Human Decisions:       {summary.get('human_decisions_count')}")
  print("")
  print(f"Potential Optional:    {len(summary.get('potential_optional', []))}")
  print(f"Potential Destructive: {len(summary.get('potential_destructive', []))}")
  print(f"Potential Account-Level:{len(summary.get('potential_account', []))}")
  print(f"Potential Cross-Account:{len(summary.get('potential_cross_account', []))}")
  print("")
  print(f"Report:                {md_path.relative_to(root) if md_path.is_relative_to(root) else md_path}")
  print(f"Machine Data:          {json_path.relative_to(root) if json_path.is_relative_to(root) else json_path}")
  print("------------------------------------------------------------")

  state.mark_step_completed(3)
  save_state(state, base_dir=root)

  print("STEP 03: PASSED")
  print("NEXT: STEP 04 — ARCHITECTURE REVIEW")
  return 0


def main():
  parser = argparse.ArgumentParser(description="Step 03 — Canonical Safety Audit")
  parser.add_argument("--topic", required=True, help="AWS service topic (e.g. iam, s3, vpc, ec2)")
  parser.add_argument("--base-dir", default=".", help="Repository root directory")
  args = parser.parse_args()

  sys.exit(run_step_03(args.topic, args.base_dir))


if __name__ == "__main__":
  main()
