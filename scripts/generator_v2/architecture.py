import json
import hashlib
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set

# Ensure repository root is on sys.path for direct CLI invocation
repo_root_path = str(Path(__file__).resolve().parent.parent.parent)
if repo_root_path not in sys.path:
  sys.path.insert(0, repo_root_path)

from scripts.generator_v2.state import compute_file_sha256

def compute_dict_sha256(data: Dict[str, Any]) -> str:
  """Computes a stable SHA-256 fingerprint for a JSON-serializable dictionary."""
  serialized = json.dumps(data, sort_keys=True, separators=(',', ':'))
  return hashlib.sha256(serialized.encode('utf-8')).hexdigest()


class ArchitectureModel:
  """
  Generic, service-agnostic architecture model for Follow Along Generator V2.
  Supports zero-to-many items across all collections with complete provenance tracking.
  """

  def __init__(self, data: Dict[str, Any]):
    self.data = data

  @classmethod
  def create_initial(
    cls,
    topic: str,
    draft_plan: Dict[str, Any],
    canonical_audit: Dict[str, Any],
    canonical_fingerprint: str
  ) -> "ArchitectureModel":
    topic_clean = topic.lower().strip()
    programme_id = f"{topic_clean}-learning-path"

    task_audits = canonical_audit.get("task_audits", [])
    raw_tasks = draft_plan.get("tasks", [])
    raw_phases = draft_plan.get("phases", [])

    # Map audit insights by task_id
    audit_map = {a.get("task_id"): a for a in task_audits}

    tasks = []
    task_classifications = {}
    phase_assignments = {}
    protected_resources_map = {}

    for idx, t in enumerate(raw_tasks):
      t_id = t.get("id")
      t_title = t.get("title", "")
      audit = audit_map.get(t_id, {})

      # Determine initial classification
      if audit.get("is_optional") or audit.get("heuristic_proposals") and "Candidate for OPTIONAL branch task" in audit.get("heuristic_proposals", []):
        classification = "Optional"
        prov = "HEURISTIC PROPOSAL"
      elif audit.get("is_review_only"):
        classification = "Review-Only"
        prov = "HEURISTIC PROPOSAL"
      else:
        classification = "Required"
        prov = "DETERMINISTIC FACT"

      p_id = t.get("phaseId") or t.get("phase_id") or "phase-1"

      task_entry = {
        "id": t_id,
        "title": t_title,
        "classification": classification,
        "phase_id": p_id,
        "goal": t.get("goal", ""),
        "has_console": bool(t.get("consoleSteps")),
        "has_cli": bool(t.get("cliSteps")),
        "has_verification": bool(t.get("verification")),
        "has_cleanup": bool(t.get("cleanup")),
        "provenance": prov
      }
      tasks.append(task_entry)
      task_classifications[t_id] = prov
      phase_assignments[t_id] = "DETERMINISTIC FACT"

    # Build phases array
    phases = []
    for p in raw_phases:
      p_id = p.get("id")
      p_title = p.get("title", "")
      p_desc = p.get("description", "")
      p_tasks = [t["id"] for t in tasks if t["phase_id"] == p_id]
      phases.append({
        "id": p_id,
        "title": p_title,
        "description": p_desc,
        "task_ids": p_tasks
      })

    # If no phases in draft, group into a single default phase
    if not phases and tasks:
      phases.append({
        "id": "phase-1",
        "title": "Phase 1: Foundation",
        "description": "Core setup and initial configuration",
        "task_ids": [t["id"] for t in tasks]
      })

    # Collect protected and external resources
    protected_resources = []
    external_resources = []
    destructive_bindings = []
    cleanup_order = []
    path_only_tasks = []
    unresolved_items = []
    warnings = []

    summary = canonical_audit.get("summary", {})

    # Populate heuristic candidates
    for res_key in summary.get("potential_account", []) + summary.get("potential_cross_account", []):
      protected_resources.append({
        "key": res_key,
        "type": "account_or_org_policy",
        "provenance": "HEURISTIC PROPOSAL"
      })
      protected_resources_map[res_key] = "HEURISTIC PROPOSAL"

    for dest_task in summary.get("potential_destructive", []):
      destructive_bindings.append({
        "task_id": dest_task,
        "impact": "Resource deletion/teardown",
        "provenance": "HEURISTIC PROPOSAL"
      })

    # Extract unresolved items and safety blockers
    for item in canonical_audit.get("unresolved_items", []):
      unresolved_items.append({
        "id": item.get("id", f"unresolved-{len(unresolved_items)+1}"),
        "text": item.get("text", "Unresolved architecture detail"),
        "task_id": item.get("task_id"),
        "is_safety_critical": item.get("is_safety_critical", False),
        "acknowledged": False
      })

    model_dict = {
      "topic": topic_clean,
      "programme_id": programme_id,
      "path_id": programme_id,
      "status": "draft",
      "approved": False,
      "approved_at": None,
      "architecture_fingerprint": None,
      "canonical_fingerprint": canonical_fingerprint,
      "tasks": tasks,
      "phases": phases,
      "dependencies": draft_plan.get("dependencies", {}),
      "resources": [],
      "protected_resources": protected_resources,
      "external_resources": external_resources,
      "destructive_bindings": destructive_bindings,
      "cleanup_order": cleanup_order,
      "path_only_tasks": path_only_tasks,
      "warnings": warnings,
      "unresolved_items": unresolved_items,
      "acknowledgements": [],
      "provenance": {
        "task_classifications": task_classifications,
        "phase_assignments": phase_assignments,
        "protected_resources": protected_resources_map
      }
    }

    return cls(model_dict)

  @property
  def is_approved(self) -> bool:
    return self.data.get("approved", False)

  @property
  def status(self) -> str:
    return self.data.get("status", "draft")

  def check_safety_blockers(self) -> Tuple[bool, List[str]]:
    """Checks whether unresolved safety-critical items exist and remain unacknowledged."""
    blockers = []
    for item in self.data.get("unresolved_items", []):
      if item.get("is_safety_critical") and not item.get("acknowledged"):
        blockers.append(f"[{item.get('id')}] {item.get('text')} (Task: {item.get('task_id', 'Global')})")
    return len(blockers) > 0, blockers

  def update_task_classification(self, task_id: str, new_classification: str) -> bool:
    valid_classifications = {"Required", "Optional", "Review-Only", "Standalone"}
    if new_classification not in valid_classifications:
      return False

    for t in self.data.get("tasks", []):
      if t["id"] == task_id:
        t["classification"] = new_classification
        t["provenance"] = "HUMAN DECISION"
        self.data["provenance"]["task_classifications"][task_id] = "HUMAN DECISION"
        self._invalidate_approval_on_edit()
        return True
    return False

  def update_task_phase(self, task_id: str, new_phase_id: str) -> bool:
    phase_ids = {p["id"] for p in self.data.get("phases", [])}
    if new_phase_id not in phase_ids:
      return False

    for t in self.data.get("tasks", []):
      if t["id"] == task_id:
        t["phase_id"] = new_phase_id
        self.data["provenance"]["phase_assignments"][task_id] = "HUMAN DECISION"
        self._rebuild_phase_task_ids()
        self._invalidate_approval_on_edit()
        return True
    return False

  def toggle_protected_resource(self, resource_key: str) -> bool:
    protected = self.data.get("protected_resources", [])
    existing = [p for p in protected if p["key"] == resource_key]
    if existing:
      self.data["protected_resources"] = [p for p in protected if p["key"] != resource_key]
      self.data["provenance"]["protected_resources"].pop(resource_key, None)
    else:
      self.data["protected_resources"].append({
        "key": resource_key,
        "type": "user_protected",
        "provenance": "HUMAN DECISION"
      })
      self.data["provenance"]["protected_resources"][resource_key] = "HUMAN DECISION"
    
    self._invalidate_approval_on_edit()
    return True

  def acknowledge_unresolved_item(self, item_id: str) -> bool:
    for item in self.data.get("unresolved_items", []):
      if item.get("id") == item_id:
        item["acknowledged"] = True
        if item_id not in self.data.get("acknowledgements", []):
          self.data["acknowledgements"].append(item_id)
        return True
    return False

  def approve_architecture(self) -> Tuple[bool, Optional[str], Optional[str]]:
    has_blockers, blockers = self.check_safety_blockers()
    if has_blockers:
      return False, None, f"Cannot approve architecture due to {len(blockers)} unresolved safety blockers."

    # Compute architecture fingerprint over stable content payload
    content_payload = {
      "topic": self.data["topic"],
      "programme_id": self.data["programme_id"],
      "canonical_fingerprint": self.data["canonical_fingerprint"],
      "tasks": self.data["tasks"],
      "phases": self.data["phases"],
      "dependencies": self.data["dependencies"],
      "resources": self.data["resources"],
      "protected_resources": self.data["protected_resources"],
      "external_resources": self.data["external_resources"],
      "destructive_bindings": self.data["destructive_bindings"],
      "cleanup_order": self.data["cleanup_order"],
      "path_only_tasks": self.data["path_only_tasks"],
      "unresolved_items": self.data["unresolved_items"],
      "acknowledgements": self.data["acknowledgements"]
    }
    
    fp = compute_dict_sha256(content_payload)
    self.data["status"] = "approved"
    self.data["approved"] = True
    self.data["approved_at"] = datetime.now(timezone.utc).isoformat()
    self.data["architecture_fingerprint"] = fp

    return True, fp, None

  def _invalidate_approval_on_edit(self):
    if self.data.get("approved"):
      self.data["status"] = "draft"
      self.data["approved"] = False
      self.data["approved_at"] = None
      self.data["architecture_fingerprint"] = None

  def _rebuild_phase_task_ids(self):
    for p in self.data.get("phases", []):
      p_id = p["id"]
      p["task_ids"] = [t["id"] for t in self.data.get("tasks", []) if t.get("phase_id") == p_id]

  def save(self, output_dir: Optional[Path] = None, base_dir: str = ".") -> Tuple[Path, Path]:
    root = Path(base_dir).resolve()
    plans_dir = output_dir.resolve() if output_dir else root / "plans"
    plans_dir.mkdir(parents=True, exist_ok=True)

    programme_id = self.data["programme_id"]
    json_path = plans_dir / f"{programme_id}-architecture.json"
    md_path = plans_dir / f"{programme_id}-architecture.md"

    with open(json_path, "w", encoding="utf-8") as f:
      json.dump(self.data, f, indent=2)

    # Generate human-readable Markdown specification report
    md_content = self.generate_markdown_report()
    with open(md_path, "w", encoding="utf-8") as f:
      f.write(md_content)

    return json_path, md_path

  def generate_markdown_report(self) -> str:
    d = self.data
    tasks = d.get("tasks", [])
    phases = d.get("phases", [])

    lines = [
      f"# Architecture Specification Report — {d.get('topic', '').upper()}",
      "",
      f"**Programme ID**: `{d.get('programme_id')}`",
      f"**Approval Status**: `{d.get('status').upper()}` (Approved: `{d.get('approved')}`)",
      f"**Approved At**: `{d.get('approved_at') or 'N/A'}`",
      f"**Architecture Fingerprint**: `{d.get('architecture_fingerprint') or 'UNAPPROVED'}`",
      f"**Canonical Fingerprint**: `{d.get('canonical_fingerprint')}`",
      "",
      "---",
      "",
      "## 1. Executive Summary",
      "",
      f"- **Total Canonical Tasks**: {len(tasks)}",
      f"- **Required Tasks**: {len([t for t in tasks if t['classification'] == 'Required'])}",
      f"- **Optional Tasks**: {len([t for t in tasks if t['classification'] == 'Optional'])}",
      f"- **Review-Only Tasks**: {len([t for t in tasks if t['classification'] == 'Review-Only'])}",
      f"- **Standalone Tasks**: {len([t for t in tasks if t['classification'] == 'Standalone'])}",
      f"- **Phases Count**: {len(phases)}",
      f"- **Protected Resources**: {len(d.get('protected_resources', []))}",
      f"- **Destructive Bindings**: {len(d.get('destructive_bindings', []))}",
      f"- **Unresolved Items**: {len(d.get('unresolved_items', []))}",
      "",
      "---",
      "",
      "## 2. Conceptual Phases & Task Assignments",
      ""
    ]

    for p in phases:
      lines.append(f"### {p.get('title')} (`{p.get('id')}`)")
      lines.append(f"*{p.get('description')}*")
      lines.append("")
      p_tasks = [t for t in tasks if t.get("phase_id") == p.get("id")]
      if not p_tasks:
        lines.append("- *(No tasks assigned to this phase)*")
      else:
        for t in p_tasks:
          lines.append(f"- **{t['id']}**: {t['title']} — `{t['classification']}` *(Provenance: {t.get('provenance')})*")
      lines.append("")

    lines.extend([
      "---",
      "",
      "## 3. Safety & Resource Protections",
      ""
    ])

    prot = d.get("protected_resources", [])
    if not prot:
      lines.append("- No protected or account-level resources flagged.")
    else:
      for p_res in prot:
        lines.append(f"- **{p_res.get('key')}** ({p_res.get('type')}) — Provenance: `{p_res.get('provenance')}`")

    lines.extend([
      "",
      "---",
      "",
      "## 4. Unresolved Items & Safety Blockers",
      ""
    ])

    unres = d.get("unresolved_items", [])
    if not unres:
      lines.append("- Zero unresolved safety items.")
    else:
      for u in unres:
        crit = " [SAFETY CRITICAL]" if u.get("is_safety_critical") else ""
        ack = " (ACKNOWLEDGED)" if u.get("acknowledged") else " (UNACKNOWLEDGED)"
        lines.append(f"- **{u.get('id')}**{crit}{ack}: {u.get('text')} *(Task: {u.get('task_id', 'Global')})*")

    return "\n".join(lines)


def load_architecture(topic: str, base_dir: str = ".") -> Optional[ArchitectureModel]:
  root = Path(base_dir).resolve()
  topic_clean = topic.lower().strip()
  json_path = root / "plans" / f"{topic_clean}-learning-path-architecture.json"

  if not json_path.exists():
    return None

  try:
    with open(json_path, "r", encoding="utf-8") as f:
      data = json.load(f)
    return ArchitectureModel(data)
  except Exception as e:
    print(f"[generator_v2.architecture] Error loading architecture file {json_path}: {e}")
    return None
