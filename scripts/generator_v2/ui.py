import sys
from typing import Callable, List, Optional, Tuple

def render_architecture_dashboard(model) -> str:
  """Renders a clean terminal display summarizing the current architecture model."""
  d = model.data
  tasks = d.get("tasks", [])
  phases = d.get("phases", [])
  status = d.get("status", "draft").upper()
  approved = "YES" if d.get("approved") else "NO"
  fp = d.get("architecture_fingerprint") or "UNAPPROVED"

  req_count = len([t for t in tasks if t["classification"] == "Required"])
  opt_count = len([t for t in tasks if t["classification"] == "Optional"])
  rev_count = len([t for t in tasks if t["classification"] == "Review-Only"])
  sta_count = len([t for t in tasks if t["classification"] == "Standalone"])

  lines = [
    "============================================================",
    " ARCHITECTURE REVIEW DASHBOARD",
    "============================================================",
    f"Topic / Programme ID:  {d.get('programme_id')}",
    f"Status:                {status} (Approved: {approved})",
    f"Fingerprint:           {fp[:16]}..." if fp != "UNAPPROVED" else f"Fingerprint:           {fp}",
    "------------------------------------------------------------",
    f"Canonical Tasks:       {len(tasks)}",
    f"  - Required:          {req_count}",
    f"  - Optional:          {opt_count}",
    f"  - Review-Only:       {rev_count}",
    f"  - Standalone:        {sta_count}",
    f"Phases:                {len(phases)}",
    f"Protected Resources:   {len(d.get('protected_resources', []))}",
    f"Destructive Bindings: {len(d.get('destructive_bindings', []))}",
    f"Unresolved Items:      {len(d.get('unresolved_items', []))}",
    "------------------------------------------------------------"
  ]

  has_blockers, blockers = model.check_safety_blockers()
  if has_blockers:
    lines.append(f"UNRESOLVED SAFETY BLOCKERS: {len(blockers)} (APPROVAL BLOCKED)")
    for b in blockers[:3]:
      lines.append(f"  * {b}")
    if len(blockers) > 3:
      lines.append(f"  * ... and {len(blockers)-3} more")
    lines.append("------------------------------------------------------------")

  return "\n".join(lines)


def render_task_list(model) -> str:
  tasks = model.data.get("tasks", [])
  lines = ["--- TASK CLASSIFICATIONS ---"]
  for idx, t in enumerate(tasks, start=1):
    prov = t.get("provenance", "")
    lines.append(f"[{idx:02d}] {t['id']} — {t['title']}")
    lines.append(f"     Class: {t['classification']:<12} Phase: {t['phase_id']:<10} Provenance: {prov}")
  return "\n".join(lines)


def run_interactive_architecture_ui(
  model,
  input_func: Optional[Callable[[str], str]] = None
) -> Tuple[str, Optional[str]]:
  """
  Interactive CLI loop for architecture review.
  Takes model and an optional input_func (for mockable testing).
  Returns (action_outcome: 'approved' | 'saved_draft' | 'quit', error_message: str | None).
  """
  read_input = input_func or input

  while True:
    print(render_architecture_dashboard(model))
    print("")
    print("OPTIONS:")
    print("  [1] Toggle Task Classification")
    print("  [2] Reassign Task Phase")
    print("  [3] Toggle Protected Resource")
    print("  [4] Acknowledge Unresolved Item")
    print("  [S] Save Draft Architecture")
    print("  [A] Approve & Confirm Architecture")
    print("  [Q] Quit without saving")
    print("")

    try:
      choice = read_input("Select an option: ").strip().upper()
    except EOFError:
      return "quit", "EOF encountered"

    if choice == "1":
      print(render_task_list(model))
      try:
        t_idx_str = read_input("Enter task number to reclassify (or Enter to cancel): ").strip()
        if t_idx_str:
          t_idx = int(t_idx_str) - 1
          tasks = model.data.get("tasks", [])
          if 0 <= t_idx < len(tasks):
            t = tasks[t_idx]
            print(f"Task: {t['id']} — Current: {t['classification']}")
            print("Select new classification:")
            print("  [R] Required  [O] Optional  [V] Review-Only  [S] Standalone")
            cls_choice = read_input("Choice: ").strip().upper()
            mapping = {"R": "Required", "O": "Optional", "V": "Review-Only", "S": "Standalone"}
            if cls_choice in mapping:
              model.update_task_classification(t['id'], mapping[cls_choice])
              print(f"Updated {t['id']} to {mapping[cls_choice]}")
      except ValueError:
        print("Invalid task number.")

    elif choice == "2":
      print(render_task_list(model))
      try:
        t_idx_str = read_input("Enter task number to reassign phase (or Enter to cancel): ").strip()
        if t_idx_str:
          t_idx = int(t_idx_str) - 1
          tasks = model.data.get("tasks", [])
          phases = model.data.get("phases", [])
          if 0 <= t_idx < len(tasks):
            t = tasks[t_idx]
            print(f"Task: {t['id']} — Current Phase: {t['phase_id']}")
            print("Available Phases:")
            for p in phases:
              print(f"  [{p['id']}] {p['title']}")
            new_p = read_input("Enter Phase ID: ").strip()
            if model.update_task_phase(t['id'], new_p):
              print(f"Reassigned {t['id']} to {new_p}")
            else:
              print("Invalid Phase ID.")
      except ValueError:
        print("Invalid task number.")

    elif choice == "3":
      res_key = read_input("Enter protected resource key to toggle (or Enter to cancel): ").strip()
      if res_key:
        model.toggle_protected_resource(res_key)
        print(f"Toggled protected status for '{res_key}'")

    elif choice == "4":
      unres = model.data.get("unresolved_items", [])
      if not unres:
        print("No unresolved items present.")
      else:
        for u in unres:
          print(f"  [{u['id']}] {u['text']} (Safety Critical: {u['is_safety_critical']}, Ack: {u['acknowledged']})")
        u_id = read_input("Enter item ID to acknowledge: ").strip()
        if u_id:
          if model.acknowledge_unresolved_item(u_id):
            print(f"Acknowledged {u_id}")
          else:
            print("Item ID not found.")

    elif choice == "S":
      return "saved_draft", None

    elif choice == "A":
      has_blockers, blockers = model.check_safety_blockers()
      if has_blockers:
        print("------------------------------------------------------------")
        print("APPROVAL BLOCKED — Unresolved safety items remain:")
        for b in blockers:
          print(f"  * {b}")
        print("------------------------------------------------------------")
        input_func_prompt = read_input("Press Enter to return to menu... ")
      else:
        confirm = read_input("Type 'APPROVE' to confirm final architecture: ").strip()
        if confirm == "APPROVE":
          success, fp, err = model.approve_architecture()
          if success:
            return "approved", None
          else:
            print(f"Approval error: {err}")

    elif choice == "Q":
      return "quit", None

    else:
      print("Invalid option. Please select 1, 2, 3, 4, S, A, or Q.")
