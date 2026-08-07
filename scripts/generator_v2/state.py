import json
import hashlib
import os
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional, Union
from datetime import datetime, timezone

STATE_SCHEMA_VERSION = "2.0.0"

class GeneratorState:
  def __init__(
    self,
    topic: str,
    programme_id: Optional[str] = None,
    path_id: Optional[str] = None,
    version: str = STATE_SCHEMA_VERSION,
    canonical_fingerprint: Optional[str] = None,
    architecture_fingerprint: Optional[str] = None,
    approved_plan_fingerprint: Optional[str] = None,
    preview_fingerprint: Optional[str] = None,
    completed_steps: Optional[List[int]] = None,
    failed_steps: Optional[List[int]] = None,
    invalidated_steps: Optional[List[int]] = None,
    transaction_id: Optional[str] = None,
    implementation_status: str = "not_started",
    integration_status: str = "deferred",
    timestamps: Optional[Dict[str, str]] = None,
    metadata: Optional[Dict[str, Any]] = None
  ):
    self.topic = topic.lower().strip()
    self.programme_id = programme_id or f"{self.topic}-learning-path"
    self.path_id = path_id or f"{self.topic}-learning-path"
    self.version = version
    self.canonical_fingerprint = canonical_fingerprint
    self.architecture_fingerprint = architecture_fingerprint
    self.approved_plan_fingerprint = approved_plan_fingerprint
    self.preview_fingerprint = preview_fingerprint
    self.completed_steps = sorted(list(set(completed_steps or [])))
    self.failed_steps = sorted(list(set(failed_steps or [])))
    self.invalidated_steps = sorted(list(set(invalidated_steps or [])))
    self.transaction_id = transaction_id
    self.implementation_status = implementation_status
    self.integration_status = integration_status
    self.timestamps = timestamps or {}
    self.metadata = metadata or {}

  def to_dict(self) -> Dict[str, Any]:
    return {
      "version": self.version,
      "topic": self.topic,
      "programme_id": self.programme_id,
      "path_id": self.path_id,
      "canonical_fingerprint": self.canonical_fingerprint,
      "architecture_fingerprint": self.architecture_fingerprint,
      "approved_plan_fingerprint": self.approved_plan_fingerprint,
      "preview_fingerprint": self.preview_fingerprint,
      "completed_steps": self.completed_steps,
      "failed_steps": self.failed_steps,
      "invalidated_steps": self.invalidated_steps,
      "transaction_id": self.transaction_id,
      "implementation_status": self.implementation_status,
      "integration_status": self.integration_status,
      "timestamps": self.timestamps,
      "metadata": self.metadata
    }

  @classmethod
  def from_dict(cls, data: Dict[str, Any]) -> "GeneratorState":
    if not isinstance(data, dict):
      raise ValueError("State data must be a dictionary")
    
    topic = data.get("topic")
    if not topic or not isinstance(topic, str):
      raise ValueError("State data missing required string field 'topic'")

    return cls(
      topic=topic,
      programme_id=data.get("programme_id"),
      path_id=data.get("path_id"),
      version=data.get("version", STATE_SCHEMA_VERSION),
      canonical_fingerprint=data.get("canonical_fingerprint"),
      architecture_fingerprint=data.get("architecture_fingerprint"),
      approved_plan_fingerprint=data.get("approved_plan_fingerprint"),
      preview_fingerprint=data.get("preview_fingerprint"),
      completed_steps=data.get("completed_steps"),
      failed_steps=data.get("failed_steps"),
      invalidated_steps=data.get("invalidated_steps"),
      transaction_id=data.get("transaction_id"),
      implementation_status=data.get("implementation_status", "not_started"),
      integration_status=data.get("integration_status", "deferred"),
      timestamps=data.get("timestamps"),
      metadata=data.get("metadata")
    )

  def mark_step_completed(self, step_number: int) -> None:
    if step_number in self.failed_steps:
      self.failed_steps.remove(step_number)
    if step_number in self.invalidated_steps:
      self.invalidated_steps.remove(step_number)
    if step_number not in self.completed_steps:
      self.completed_steps.append(step_number)
      self.completed_steps.sort()
    self.timestamps[f"step_{step_number:02d}"] = datetime.now(timezone.utc).isoformat()

  def mark_step_failed(self, step_number: int) -> None:
    if step_number not in self.failed_steps:
      self.failed_steps.append(step_number)
      self.failed_steps.sort()
    self.timestamps[f"step_{step_number:02d}_failed"] = datetime.now(timezone.utc).isoformat()

  def invalidate_downstream_steps(self, from_step_number: int) -> List[int]:
    invalidated = []
    for step in list(self.completed_steps):
      if step >= from_step_number:
        self.completed_steps.remove(step)
        if step not in self.invalidated_steps:
          self.invalidated_steps.append(step)
          invalidated.append(step)
    self.invalidated_steps.sort()
    return invalidated


def get_state_path(topic: str, base_dir: Optional[Union[Path, str]] = None) -> Path:
  root = Path(base_dir).resolve() if base_dir else Path(".").resolve()
  state_dir = root / ".generator_v2"
  return state_dir / f"state_{topic.lower().strip()}.json"


def create_initial_state(
  topic: str,
  programme_id: Optional[str] = None,
  path_id: Optional[str] = None
) -> GeneratorState:
  return GeneratorState(
    topic=topic,
    programme_id=programme_id,
    path_id=path_id
  )


def load_state(topic: str, base_dir: Optional[Union[Path, str]] = None) -> Optional[GeneratorState]:
  path = get_state_path(topic, base_dir=base_dir)
  if not path.exists():
    return None

  try:
    with open(path, "r", encoding="utf-8") as f:
      data = json.load(f)
    return GeneratorState.from_dict(data)
  except Exception as err:
    print(f"[generator_v2.state] Warning: Failed to load state file {path}: {err}", file=sys.stderr)
    return None


def save_state(state: GeneratorState, base_dir: Optional[Union[Path, str]] = None) -> bool:
  path = get_state_path(state.topic, base_dir=base_dir)
  try:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_suffix(f".tmp_{os.getpid()}")
    
    with open(tmp_path, "w", encoding="utf-8") as f:
      json.dump(state.to_dict(), f, indent=2)

    tmp_path.replace(path)
    return True
  except Exception as err:
    print(f"[generator_v2.state] Error: Failed to save state file {path}: {err}", file=sys.stderr)
    if tmp_path.exists():
      try:
        tmp_path.unlink()
      except Exception:
        pass
    return False


def compute_file_sha256(filepath: Union[Path, str]) -> Optional[str]:
  p = Path(filepath)
  if not p.exists() or not p.is_file():
    return None

  try:
    hasher = hashlib.sha256()
    with open(p, "rb") as f:
      while chunk := f.read(65536):
        hasher.update(chunk)
    return hasher.hexdigest()
  except Exception as err:
    print(f"[generator_v2.state] Error computing sha256 for {filepath}: {err}", file=sys.stderr)
    return None


def evaluate_stale_cascade(state: GeneratorState, current_canonical_fingerprint: str) -> List[int]:
  if not state.canonical_fingerprint:
    return []

  if state.canonical_fingerprint != current_canonical_fingerprint:
    state.canonical_fingerprint = current_canonical_fingerprint
    return state.invalidate_downstream_steps(from_step_number=2)

  return []
