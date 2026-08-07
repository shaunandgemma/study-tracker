import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

# Ensure repository root is on sys.path for direct CLI invocation
repo_root_path = str(Path(__file__).resolve().parent.parent.parent)
if repo_root_path not in sys.path:
  sys.path.insert(0, repo_root_path)

from scripts.generator.inspector import (
  parse_task_file_safely,
  calculate_task_file_fingerprint,
  find_task_directory,
  find_repository_root
)

DESTRUCTIVE_KEYWORDS = ['delete', 'terminate', 'remove', 'detach', 'purge', 'drop', 'destroy']
SECURITY_KEYWORDS = ['mfa', 'saml', 'access-key', 'policy', 'iam-user', 'role', 'credential', 'assumerole', 'external-id', 'password-policy']
ACCOUNT_KEYWORDS = ['password-policy', 'account-settings', 'account-level', 'accountsettings']
CROSS_ACCOUNT_KEYWORDS = ['principalorgid', 'cross-account', 'crossaccount', 'external-id', 'organization', 'org-id']
COST_KEYWORDS = ['ec2', 'nat-gateway', 'elastic-ip', 'instance', 'rds', 'load-balancer']

def analyze_task_content(task: Dict[str, Any]) -> Dict[str, Any]:
  task_id = task.get("id", "")
  title = task.get("title", "")
  goal = task.get("goal", "")
  
  text_content = f"{task_id} {title} {goal}".lower()
  
  console_steps = task.get("consoleSteps") or []
  cli_steps = task.get("cliSteps") or []
  verification = task.get("verification") or []
  cleanup = task.get("cleanup") or []

  for step in console_steps:
    title_ins = step.get("title", "")
    text_content += f" {title_ins}"
    for ins in step.get("instructions") or []:
      text_content += f" {ins.get('text', '')} {ins.get('label', '')}"

  for step in cli_steps:
    title_ins = step.get("title", "")
    text_content += f" {title_ins}"
    for cmd in step.get("commands") or []:
      text_content += f" {cmd.get('text', '')} {cmd.get('explanation', '')}"

  has_console = len(console_steps) > 0
  has_cli = len(cli_steps) > 0
  has_verification = len(verification) > 0
  has_cleanup = len(cleanup) > 0

  is_destructive = any(kw in text_content for kw in DESTRUCTIVE_KEYWORDS)
  is_security = any(kw in text_content for kw in SECURITY_KEYWORDS)
  is_account = any(kw in text_content for kw in ACCOUNT_KEYWORDS)
  is_cross_account = any(kw in text_content for kw in CROSS_ACCOUNT_KEYWORDS)
  is_cost_bearing = any(kw in text_content for kw in COST_KEYWORDS)

  deterministic_facts = [
    f"Task ID is '{task_id}'",
    f"Contains Console steps: {has_console}",
    f"Contains CLI steps: {has_cli}",
    f"Contains verification items: {has_verification} (Count: {len(verification)})",
    f"Contains cleanup items: {has_cleanup} (Count: {len(cleanup)})"
  ]

  heuristic_proposals = []
  if is_cross_account or 'optional' in text_content or 'mfa' in text_content or 'saml' in text_content:
    heuristic_proposals.append("Candidate for OPTIONAL branch task")
  if is_account:
    heuristic_proposals.append("Candidate for REVIEW-ONLY mandatory task (Account-level configuration)")
  if is_destructive:
    heuristic_proposals.append("Candidate for DESTRUCTIVE resource binding & teardown step")

  unresolved_items = []
  if is_cross_account:
    unresolved_items.append("Follow Along ownership of referenced external AWS Organization/Account")
  if is_account:
    unresolved_items.append("Pre-existing baseline state restoration requirements")

  human_decisions = [
    "Final classification: Required vs Optional vs Review-Only",
    "Prerequisite dependency ordering confirmation"
  ]

  return {
    "task_id": task_id,
    "title": title,
    "has_console": has_console,
    "has_cli": has_cli,
    "has_verification": has_verification,
    "has_cleanup": has_cleanup,
    "is_destructive": is_destructive,
    "is_security": is_security,
    "is_account": is_account,
    "is_cross_account": is_cross_account,
    "is_cost_bearing": is_cost_bearing,
    "deterministic_facts": deterministic_facts,
    "heuristic_proposals": heuristic_proposals,
    "unresolved_items": unresolved_items,
    "human_decisions": human_decisions
  }


def audit_canonical_tasks(topic: str, repo_root: Optional[Path] = None) -> Dict[str, Any]:
  root = Path(repo_root).resolve() if repo_root else Path(".").resolve()
  topic_clean = topic.lower().strip()
  
  task_dir = find_task_directory(root)
  task_file = task_dir / f"{topic_clean}Tasks.js"
  
  if not task_file.exists():
    return {
      "success": False,
      "error": f"Canonical task file not found for topic '{topic_clean}': {task_file}"
    }

  parse_res = parse_task_file_safely(task_file)
  if parse_res.get("errors"):
    return {
      "success": False,
      "error": f"Failed to parse task file: {', '.join(parse_res.get('errors'))}"
    }

  tasks = parse_res.get("tasks", [])
  canonical_fingerprint = calculate_task_file_fingerprint(task_file)
  task_audits = [analyze_task_content(t) for t in tasks]

  total_tasks = len(tasks)
  potential_optional = [a["task_id"] for a in task_audits if "Candidate for OPTIONAL branch task" in a["heuristic_proposals"]]
  potential_review_only = [a["task_id"] for a in task_audits if "Candidate for REVIEW-ONLY mandatory task (Account-level configuration)" in a["heuristic_proposals"]]
  potential_destructive = [a["task_id"] for a in task_audits if a["is_destructive"]]
  potential_account = [a["task_id"] for a in task_audits if a["is_account"]]
  potential_cross_account = [a["task_id"] for a in task_audits if a["is_cross_account"]]

  return {
    "success": True,
    "topic": topic.lower().strip(),
    "programme_id": f"{topic.lower().strip()}-learning-path",
    "canonical_fingerprint": canonical_fingerprint,
    "canonical_task_count": total_tasks,
    "task_audits": task_audits,
    "summary": {
      "total_tasks": total_tasks,
      "deterministic_findings_count": total_tasks * 5,
      "heuristic_proposals_count": sum(len(a["heuristic_proposals"]) for a in task_audits),
      "unresolved_items_count": sum(len(a["unresolved_items"]) for a in task_audits),
      "human_decisions_count": total_tasks * 2,
      "potential_optional": potential_optional,
      "potential_review_only": potential_review_only,
      "potential_destructive": potential_destructive,
      "potential_account": potential_account,
      "potential_cross_account": potential_cross_account
    }
  }


def generate_audit_reports(topic: str, audit_data: Dict[str, Any], output_dir: Optional[Path] = None) -> Tuple[Path, Path]:
  programme_id = audit_data.get("programme_id", f"{topic}-learning-path")
  out_path = Path(output_dir).resolve() if output_dir else Path("plans").resolve()
  out_path.mkdir(parents=True, exist_ok=True)

  json_path = out_path / f"{programme_id}-canonical-audit.json"
  md_path = out_path / f"{programme_id}-canonical-audit.md"

  with open(json_path, "w", encoding="utf-8") as f:
    json.dump(audit_data, f, indent=2)

  summary = audit_data.get("summary", {})
  audits = audit_data.get("task_audits", [])

  md_lines = [
    f"# Canonical Audit Report — {topic.upper()} Follow Along",
    "",
    f"- **Programme ID**: `{programme_id}`",
    f"- **Canonical Fingerprint**: `{audit_data.get('canonical_fingerprint')}`",
    f"- **Canonical Tasks**: `{audit_data.get('canonical_task_count')}`",
    "",
    "## Summary Statistics",
    f"- **Deterministic Findings**: {summary.get('deterministic_findings_count')}",
    f"- **Heuristic Proposals**: {summary.get('heuristic_proposals_count')}",
    f"- **Unresolved Items**: {summary.get('unresolved_items_count')}",
    f"- **Human Decisions Required**: {summary.get('human_decisions_count')}",
    f"- **Potential Optional Candidates**: {len(summary.get('potential_optional', []))}",
    f"- **Potential Account-Level Candidates**: {len(summary.get('potential_account', []))}",
    "",
    "---",
    "",
    "## Task Analysis Details",
    ""
  ]

  for a in audits:
    md_lines.append(f"### {a['task_id']} — {a['title']}")
    md_lines.append("**DETERMINISTIC FACTS:**")
    for f_item in a["deterministic_facts"]:
      md_lines.append(f"- {f_item}")
    
    if a["heuristic_proposals"]:
      md_lines.append("**HEURISTIC PROPOSALS:**")
      for h_item in a["heuristic_proposals"]:
        md_lines.append(f"- {h_item}")

    if a["unresolved_items"]:
      md_lines.append("**UNRESOLVED ITEMS:**")
      for u_item in a["unresolved_items"]:
        md_lines.append(f"- {u_item}")

    md_lines.append("**HUMAN DECISIONS REQUIRED:**")
    for d_item in a["human_decisions"]:
      md_lines.append(f"- {d_item}")
    
    md_lines.append("")

  with open(md_path, "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

  return json_path, md_path
