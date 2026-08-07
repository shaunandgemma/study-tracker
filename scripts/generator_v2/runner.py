import subprocess
import time
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional, Union

class ProcessResult:
  def __init__(
    self,
    command: List[str],
    exit_code: int,
    stdout: str,
    stderr: str,
    duration_ms: float
  ):
    self.command = command
    self.exit_code = exit_code
    self.success = (exit_code == 0)
    self.stdout = stdout
    self.stderr = stderr
    self.duration_ms = duration_ms

  def to_dict(self) -> Dict[str, Any]:
    return {
      "command": self.command,
      "command_str": " ".join(self.command),
      "exit_code": self.exit_code,
      "success": self.success,
      "stdout": self.stdout,
      "stderr": self.stderr,
      "duration_ms": self.duration_ms
    }

  def __repr__(self) -> str:
    return f"<ProcessResult success={self.success} exit_code={self.exit_code} duration={self.duration_ms:.1f}ms>"


def run_command_safe(
  cmd: List[str],
  cwd: Optional[Union[Path, str]] = None,
  timeout: Optional[float] = None,
  env: Optional[Dict[str, str]] = None
) -> ProcessResult:
  if not isinstance(cmd, list) or not all(isinstance(arg, str) for arg in cmd):
    raise ValueError("Command must be a list of non-empty strings")

  working_dir = Path(cwd).resolve() if cwd else Path(".").resolve()
  start_time = time.time()

  try:
    proc = subprocess.run(
      cmd,
      cwd=working_dir,
      capture_output=True,
      text=True,
      encoding="utf-8",
      errors="replace",
      timeout=timeout,
      env=env
    )
    duration_ms = (time.time() - start_time) * 1000.0
    return ProcessResult(
      command=cmd,
      exit_code=proc.returncode,
      stdout=proc.stdout or "",
      stderr=proc.stderr or "",
      duration_ms=duration_ms
    )
  except subprocess.TimeoutExpired as err:
    duration_ms = (time.time() - start_time) * 1000.0
    return ProcessResult(
      command=cmd,
      exit_code=-1,
      stdout=err.stdout or "" if isinstance(err.stdout, str) else "",
      stderr=f"Command timed out after {timeout} seconds. {err.stderr or ''}",
      duration_ms=duration_ms
    )
  except Exception as err:
    duration_ms = (time.time() - start_time) * 1000.0
    return ProcessResult(
      command=cmd,
      exit_code=-1,
      stdout="",
      stderr=f"Subprocess execution failed: {err}",
      duration_ms=duration_ms
    )


def run_node_tests(test_files: List[str], cwd: Optional[Union[Path, str]] = None) -> ProcessResult:
  cmd = ["node", "--test"] + test_files
  return run_command_safe(cmd, cwd=cwd)


def run_python_tests(pattern: str = "test_*.py", cwd: Optional[Union[Path, str]] = None) -> ProcessResult:
  cmd = [sys.executable, "-m", "unittest", "discover", "-s", "tests/python", "-p", pattern]
  return run_command_safe(cmd, cwd=cwd)


def run_vite_build(cwd: Optional[Union[Path, str]] = None) -> ProcessResult:
  cmd = ["npm", "run", "build"]
  return run_command_safe(cmd, cwd=cwd)


def get_git_status_porcelain(cwd: Optional[Union[Path, str]] = None) -> ProcessResult:
  cmd = ["git", "status", "--porcelain"]
  return run_command_safe(cmd, cwd=cwd)
