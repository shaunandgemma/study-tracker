"""
AWS Follow Along Learning Path Generator CLI.

Provides interactive terminal navigation and non-interactive argument routing
for discovering canonical AWS Hands-On Tasks and inspecting existing Follow Alongs.
"""

import sys
import argparse
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Import Stage 1 read-only inspection module
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from scripts.generator.inspector import (
    find_repository_root,
    inspect_repository,
    parse_task_file_safely
)
from scripts.generator.planner import generate_draft_plan
from scripts.generator.validator import validate_approved_plan_file
from scripts.generator.scaffold import preview_scaffold
from scripts.generator.applier import apply_scaffold_transaction


def build_parser() -> argparse.ArgumentParser:
    """Builds and returns the CLI argument parser."""
    parser = argparse.ArgumentParser(
        description="AWS Follow Along Learning Path Generator (CLI)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exit Codes:
  0 — Successful inspection or clean user cancellation
  2 — Invalid CLI argument combination or invalid input
  3 — Repository discovery failure
  4 — Parser confidence too low for requested operation
  5 — Feature belongs to a later unbuilt stage
"""
    )

    parser.add_argument(
        "--topic",
        type=str,
        help="AWS service slug or topic name (e.g. s3, iam, rds, vpc)"
    )
    parser.add_argument(
        "--inspect",
        action="store_true",
        help="Run read-only inspection and output canonical task inventory summary"
    )
    parser.add_argument(
        "--plan-only",
        action="store_true",
        help="Generate a draft Implementation Plan (Stage 3 feature)"
    )
    parser.add_argument(
        "--validate-plan",
        action="store_true",
        help="Validate an approved Implementation Plan (Stage 4 feature)"
    )
    parser.add_argument(
        "--approved-plan",
        type=str,
        help="Path to an approved plan JSON file (e.g. plans/s3-approved.json)"
    )
    parser.add_argument(
        "--scaffold",
        action="store_true",
        help="Apply scaffolding from an approved plan (Stage 5 feature)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Perform a dry-run check of scaffolding without writing files (Stage 5 feature)"
    )

    return parser


def validate_arguments(args: argparse.Namespace) -> Optional[Tuple[str, int]]:
    """
    Validates non-interactive argument combinations.

    Returns None if valid, or (error_message, exit_code) if invalid.
    """
    # Mutually exclusive or conflicting flags check
    if args.inspect and (args.plan_only or args.scaffold or args.validate_plan or args.dry_run):
        return ("--inspect cannot be combined with planning or scaffolding flags (--plan-only, --scaffold, --validate-plan, --dry-run).", 2)

    if args.plan_only and (args.validate_plan or args.scaffold):
        return ("--plan-only cannot be combined with --validate-plan or --scaffold.", 2)

    if args.scaffold and not args.approved_plan:
        return ("--scaffold requires --approved-plan <path>.", 2)

    if args.dry_run and not (args.scaffold or args.plan_only):
        return ("--dry-run must be used with a compatible operation flag such as --scaffold.", 2)

    return None


def display_service_summary(svc: Dict[str, Any]) -> None:
    """Displays formatted read-only inspection summary for a canonical service."""
    slug = svc.get("service_slug", "unknown").upper()
    filename = svc.get("filename", "")
    rel_path = svc.get("relative_path", "")
    count = svc.get("task_count")
    conf = svc.get("parser_confidence", "low").capitalize()
    export_var = svc.get("export_variable")
    warnings = svc.get("warnings", [])

    print(f"\n============================================================")
    print(f" Service: {slug}")
    print(f"============================================================")
    print(f"  Task File:         {rel_path}")
    print(f"  Export Variable:   {export_var if export_var else 'None'}")
    print(f"  Canonical Tasks:   {count if count is not None else 'Unvalidated (None)'}")
    print(f"  Parser Confidence: {conf}")
    print(f"  Follow Along:      Not Created (No Follow Along path data file)")

    if warnings:
        print(f"  Warnings:")
        for w in warnings:
            print(f"    - {w}")
    print()


def display_existing_follow_along_summary(fa: Dict[str, Any]) -> None:
    """Displays formatted read-only metadata for an existing Follow Along."""
    pid = fa.get("programme_id", "")
    prefix = fa.get("service_prefix", "").upper()
    data_file = fa.get("data_file", "")
    svc_file = fa.get("service_file", "None")
    comp_dir = fa.get("component_dir", "None")
    test_file = fa.get("test_file", "None")
    keys = fa.get("local_storage_keys", [])

    print(f"\n============================================================")
    print(f" Existing Follow Along: {prefix} ({pid})")
    print(f"============================================================")
    print(f"  Status:            Available / Fully Implemented")
    print(f"  Data File:         {data_file}")
    print(f"  Service File:      {svc_file}")
    print(f"  Component Dir:     {comp_dir}")
    print(f"  Test Suite:        {test_file}")
    if keys:
        print(f"  Storage Keys:      {', '.join(keys)}")
    print("  Preservation Note: Existing Follow Alongs are read-only and preserved.")
    print()


def run_non_interactive(args: argparse.Namespace, repo_info: Dict[str, Any]) -> int:
    """Orchestrates non-interactive argument execution."""
    val_err = validate_arguments(args)
    if val_err:
        print(f"Error: {val_err[0]}")
        return val_err[1]

    # Handle Stage 3 draft plan generation
    if args.plan_only:
        if not args.topic:
            print("Error: --plan-only requires --topic <slug>.")
            return 2
        out_file, result_dict, exit_code = generate_draft_plan(args.topic)
        if exit_code != 0:
            print(f"Error: {result_dict.get('error', 'Draft plan generation failed.')}")
            return exit_code

        if result_dict.get("collision"):
            print(f"Notice: {result_dict.get('message')}")
            return 0

        print(f"\n============================================================")
        print(f" Draft Implementation Plan Generated Successfully")
        print(f"============================================================")
        print(f"  Service:      {result_dict.get('service', '').upper()}")
        print(f"  Programme ID: {result_dict.get('programmeId')}")
        print(f"  Output Path:  plans/{out_file.name if out_file else ''}")
        print(f"  Status:       Draft (Approved: false)")
        print(f"  Notice:       {result_dict.get('notice')}\n")
        return 0

    # Handle Stage 4 approved plan validation
    if args.validate_plan:
        if not args.approved_plan:
            print("Error: --validate-plan requires --approved-plan <path>.")
            return 2
        is_valid, result_dict, exit_code = validate_approved_plan_file(args.approved_plan, args.topic)

        if exit_code == 7:
            print(f"Error: {result_dict.get('error')}")
            return 7

        if not is_valid or exit_code == 6:
            print(f"\n============================================================")
            print(f" Approved Plan Validation Failed (Exit Code 6)")
            print(f"============================================================")
            print(f"  Plan Path:    {result_dict.get('plan_path')}")
            print(f"  Programme ID: {result_dict.get('programme_id')}\n")
            print(" Validation Errors:")
            for err in result_dict.get("errors", []):
                print(f"  - {err}")
            print()
            return 6

        print(f"\n============================================================")
        print(f" Approved Plan Validation Successful (Exit Code 0)")
        print(f"============================================================")
        print(f"  Plan Path:    {result_dict.get('plan_path')}")
        print(f"  Programme ID: {result_dict.get('programme_id')}")
        print(f"  Fingerprint:  {result_dict.get('canonical_fingerprint')}")
        print("  Status:       100% Validated & Approved for Scaffolding\n")
        return 0

    # Handle Stage 5 dry-run and Stage 6 write scaffolding
    if args.scaffold:
        if not args.dry_run:
            print("Applying scaffolds is unavailable non-interactively until Stage 7 verification is complete.")
            return 5

        if not args.approved_plan:
            print("Error: --scaffold --dry-run requires --approved-plan <path>.")
            return 2

        success, result_dict, exit_code = preview_scaffold(args.approved_plan, args.topic)

        if not success or exit_code != 0:
            print(f"\n============================================================")
            print(f" Dry-Run Scaffolding Preview Failed (Exit Code {exit_code})")
            print(f"============================================================")
            if result_dict.get("error"):
                print(f"  Error: {result_dict.get('error')}\n")

            file_list = result_dict.get("files", [])
            if file_list:
                print(" File Statuses:")
                for item in file_list:
                    p = item.get("path")
                    st = item.get("status")
                    err = item.get("error", "")
                    print(f"  - [{st:<9}] {p} {f'({err})' if err else ''}")
                print()
            return exit_code

        print(f"\n============================================================")
        print(f" Dry-Run Scaffolding Preview Successful (Exit Code 0)")
        print(f"============================================================")
        print(f"  Programme ID: {result_dict.get('programmeId')}")
        print(f"  Service:      {result_dict.get('service', '').upper()}")
        print(f"  Writes:       0 (100% Dry-Run Preview Mode)\n")

        print(" Proposed Actions:")
        for item in result_dict.get("files", []):
            p = item.get("path")
            st = item.get("status")
            lines_cnt = item.get("preview_lines", 0)
            print(f"  - [{st:<9}] {p} {f'({lines_cnt} lines)' if st == 'CREATE' else ''}")

        diffs = [item for item in result_dict.get("files", []) if item.get("diff")]
        if diffs:
            print("\n Proposed Unified Diffs:")
            for item in diffs:
                print(f"\n--- Diff for {item['path']} ---")
                print(item["diff"])

        print("\nNotice: Zero files were created or modified in the repository.")
        return 0

    # Handle --inspect or topic lookups
    topic = args.topic.lower() if args.topic else None
    canonical_services = repo_info.get("canonical_services", [])
    existing_follow_alongs = repo_info.get("existing_follow_alongs", [])

    if topic:
        # Match existing follow along first (e.g. vpc, vpc-learning-path, ec2, ec2-learning-path)
        fa_match = next((fa for fa in existing_follow_alongs if fa["service_prefix"] == topic or fa["programme_id"] == topic), None)
        svc_match = next((s for s in canonical_services if s["service_slug"] == topic), None)

        if fa_match:
            display_existing_follow_along_summary(fa_match)
            if svc_match:
                display_service_summary(svc_match)
            return 0
        elif svc_match:
            display_service_summary(svc_match)
            return 0
        else:
            print(f"No canonical Hands-On Task file or Follow Along path found for topic '{args.topic}'.")
            print("Task scaffolding is unavailable until a later stage. No files were created.")
            return 0
    else:
        # Inspect all discovered services
        print(f"\nRepository Root: {repo_info.get('repository_root')}")
        print("\nDiscovered Canonical Services:")
        for svc in canonical_services:
            display_service_summary(svc)

        print("\nExisting Follow Alongs:")
        for fa in existing_follow_alongs:
            display_existing_follow_along_summary(fa)

        return 0


def run_interactive(repo_info: Dict[str, Any]) -> int:
    """Orchestrates the interactive terminal menu loop."""
    canonical_services = repo_info.get("canonical_services", [])
    existing_follow_alongs = repo_info.get("existing_follow_alongs", [])

    while True:
        print("\n============================================================")
        print("       AWS Follow Along Learning Path Generator (CLI)")
        print("============================================================")
        print("\nCanonical Hands-On Tasks Available:")
        for idx, svc in enumerate(canonical_services, 1):
            slug = svc["service_slug"].upper()
            cnt = svc["task_count"]
            conf = svc["parser_confidence"].capitalize()
            print(f"  [{idx}] {slug:<12} ({cnt if cnt is not None else 'Unvalidated'} tasks | Confidence: {conf})")

        print("\nExisting Follow Alongs (Preserved):")
        for fa in existing_follow_alongs:
            pid = fa["programme_id"]
            prefix = fa["service_prefix"].upper()
            print(f"  - {prefix:<12} ({pid}) — Preserved Read-Only")

        print("\nOther Options:")
        c_option_num = len(canonical_services) + 1
        x_option_num = len(canonical_services) + 2
        print(f"  [{c_option_num}] Custom or missing service")
        print(f"  [{x_option_num}] Exit")

        try:
            user_input = input("\nSelect an option (or 'q' to exit): ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nOperation cancelled. Exiting cleanly.")
            return 0

        if not user_input:
            print("No selection made. Operation cancelled.")
            continue

        lower_input = user_input.lower()
        if lower_input in ["q", "quit", "exit", "cancel"]:
            print("Exiting cleanly.")
            return 0

        # Parse numeric selection
        if user_input.isdigit():
            choice = int(user_input)
            if 1 <= choice <= len(canonical_services):
                svc = canonical_services[choice - 1]
                _handle_interactive_service(svc)
                continue
            elif choice == c_option_num:
                _handle_interactive_custom_service(canonical_services, existing_follow_alongs)
                continue
            elif choice == x_option_num:
                print("Exiting cleanly.")
                return 0

        # Check slug text entry
        svc_match = next((s for s in canonical_services if s["service_slug"] == lower_input), None)
        fa_match = next((fa for fa in existing_follow_alongs if fa["service_prefix"] == lower_input or fa["programme_id"] == lower_input), None)

        if svc_match:
            _handle_interactive_service(svc_match)
        elif fa_match:
            display_existing_follow_along_summary(fa_match)
        else:
            print(f"Invalid selection '{user_input}'. Please enter a valid number or option.")


def _handle_interactive_service(svc: Dict[str, Any]) -> None:
    """Handles interactive action menu for a selected canonical service."""
    slug = svc["service_slug"].upper()
    conf = svc.get("parser_confidence", "low")

    while True:
        print(f"\n--- Service: {slug} ---")
        display_service_summary(svc)

        if conf != "high":
            print("WARNING: Canonical task inventory is unvalidated.")
            print("Planning and scaffolding are blocked for this service.\n")

        print("Select Action:")
        print("  [1] Inspect canonical tasks")
        print("  [2] Create draft Implementation Plan (Stage 3 feature)")
        print("  [3] Validate approved plan (Stage 4 feature)")
        print("  [4] Dry-run scaffold (Stage 5 feature)")
        print("  [5] Apply scaffold (Stage 6 feature)")
        print("  [6] Return to main menu")

        try:
            choice = input("\nSelect action [1-6]: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nOperation cancelled. Returning to main menu.")
            return

        if choice in ["6", "b", "back", "q", "quit", "cancel"]:
            return

        if choice == "1":
            print(f"\nTask Inventory for {slug}:")
            task_ids = svc.get("task_ids", [])
            if task_ids:
                for idx, tid in enumerate(task_ids, 1):
                    print(f"  {idx:2d}. {tid}")
            else:
                print("  No canonical task IDs extracted.")
            continue
        elif choice == "2":
            if conf != "high":
                print("\nError: Canonical task inventory is unvalidated. Planning is blocked.")
            else:
                out_file, result_dict, exit_code = generate_draft_plan(svc["service_slug"])
                if exit_code != 0:
                    print(f"\nError: {result_dict.get('error')}")
                elif result_dict.get("collision"):
                    print(f"\nNotice: {result_dict.get('message')}")
                else:
                    print(f"\nDraft plan generated successfully: plans/{out_file.name}")
            continue
        elif choice == "3":
            if conf != "high":
                print("\nError: Canonical task inventory is unvalidated. Plan validation is blocked.")
            else:
                default_plan = f"plans/{svc['service_slug']}-learning-path-approved.json"
                try:
                    plan_input = input(f"\nEnter approved plan path [{default_plan}]: ").strip()
                except (KeyboardInterrupt, EOFError):
                    print("\nOperation cancelled.")
                    continue
                plan_path = plan_input if plan_input else default_plan
                is_valid, result_dict, exit_code = validate_approved_plan_file(plan_path, svc["service_slug"])
                if exit_code == 7:
                    print(f"\nError: {result_dict.get('error')}")
                elif not is_valid or exit_code == 6:
                    print(f"\nApproved Plan Validation Failed:")
                    for err in result_dict.get("errors", []):
                        print(f"  - {err}")
                else:
                    print(f"\nApproved Plan Validation Successful: {result_dict.get('plan_path')}")
            continue
        elif choice == "4":
            if conf != "high":
                print("\nError: Canonical task inventory is unvalidated. Scaffolding is blocked.")
            else:
                default_plan = f"plans/{svc['service_slug']}-learning-path-approved.json"
                try:
                    plan_input = input(f"\nEnter approved plan path [{default_plan}]: ").strip()
                except (KeyboardInterrupt, EOFError):
                    print("\nOperation cancelled.")
                    continue
                plan_path = plan_input if plan_input else default_plan
                success, result_dict, exit_code = preview_scaffold(plan_path, svc["service_slug"])
                if exit_code != 0:
                    print(f"\nError: {result_dict.get('error')}")
                else:
                    print(f"\nDry-Run Scaffolding Preview Completed Successfully.")
                    for item in result_dict.get("files", []):
                        print(f"  - [{item['status']:<9}] {item['path']}")
            continue
        elif choice == "5":
            if conf != "high":
                print("\nError: Canonical task inventory is unvalidated. Scaffolding is blocked.")
            else:
                default_plan = f"plans/{svc['service_slug']}-learning-path-approved.json"
                try:
                    plan_input = input(f"\nEnter approved plan path [{default_plan}]: ").strip()
                except (KeyboardInterrupt, EOFError):
                    print("\nOperation cancelled.")
                    continue
                plan_path = plan_input if plan_input else default_plan

                # Run dry-run preview first to show summary
                preview_succ, preview_res, preview_code = preview_scaffold(plan_path, svc["service_slug"])
                if preview_code != 0:
                    print(f"\nError: Pre-application dry-run preview failed (Exit Code {preview_code}): {preview_res.get('error')}")
                    continue

                create_count = sum(1 for f in preview_res.get("files", []) if f.get("status") == "CREATE")
                modify_count = sum(1 for f in preview_res.get("files", []) if f.get("status") == "MODIFY")

                print(f"\n============================================================")
                print(f" WARNING: PERMANENT REPOSITORY WRITE OPERATION")
                print(f"============================================================")
                print(f"  Programme ID:    {svc['service_slug']}-learning-path")
                print(f"  Plan Path:       {plan_path}")
                print(f"  Files to Create: {create_count}")
                print(f"  Files to Modify: {modify_count}\n")

                expected_token = f"APPLY {svc['service_slug'].upper()}"
                try:
                    token_input = input(f"Type {expected_token} to continue: ").strip()
                except (KeyboardInterrupt, EOFError):
                    print("\nApplication cancelled. Zero files were changed.")
                    continue

                if token_input != expected_token:
                    print(f"\nConfirmation token mismatch. Expected '{expected_token}'. Application cancelled. Zero files were changed.")
                    continue

                app_succ, app_res, app_code = apply_scaffold_transaction(plan_path, svc["service_slug"], token_input)
                if app_code == 0:
                    print(f"\n============================================================")
                    print(f" Transactional Scaffolding Application Successful (Exit Code 0)")
                    print(f"============================================================")
                    print(f"  Programme ID:    {app_res.get('programmeId')}")
                    print(f"  Transaction ID:  {app_res.get('transaction_id')}")
                    print(f"  Files Created:   {len(app_res.get('created', []))}")
                    print(f"  Files Modified:  {len(app_res.get('modified', []))}\n")
                elif app_code == 11:
                    print(f"\nTransaction failed ({app_res.get('error')}). Rollback executed successfully. Zero persistent files were changed.")
                elif app_code == 12:
                    print(f"\nCRITICAL: Transaction failed AND rollback encountered errors: {app_res.get('rollback_errors')}")
                else:
                    print(f"\nApplication failed (Exit Code {app_code}): {app_res.get('error')}")
            continue
        else:
            print("Invalid action selection. Please try again.")


def _handle_interactive_custom_service(canonical_services: List[Dict[str, Any]], existing_follow_alongs: List[Dict[str, Any]]) -> None:
    """Handles custom or missing service interactive entry."""
    try:
        service_name = input("\nEnter custom service name (e.g. sqs, cloudformation): ").strip().lower()
    except (KeyboardInterrupt, EOFError):
        print("\nOperation cancelled.")
        return

    if not service_name:
        print("No service name entered.")
        return

    svc_match = next((s for s in canonical_services if s["service_slug"] == service_name), None)
    fa_match = next((fa for fa in existing_follow_alongs if fa["service_prefix"] == service_name or fa["programme_id"] == service_name), None)

    if svc_match:
        _handle_interactive_service(svc_match)
    elif fa_match:
        display_existing_follow_along_summary(fa_match)
    else:
        print(f"\nNo canonical Hands-On Task file was found for '{service_name}'.")
        print("Task scaffolding is unavailable until a later stage.")
        print("No files were created.\n")


def main() -> int:
    """Main Orchestrator Entry Point."""
    parser = build_parser()
    args = parser.parse_args()

    try:
        repo_info = inspect_repository()
    except Exception as e:
        print(f"Error: Failed to perform repository discovery: {e}")
        return 3

    # Check if any non-interactive flags were passed
    non_interactive = any([
        args.topic,
        args.inspect,
        args.plan_only,
        args.validate_plan,
        args.approved_plan,
        args.scaffold,
        args.dry_run
    ])

    if non_interactive:
        return run_non_interactive(args, repo_info)
    else:
        return run_interactive(repo_info)


if __name__ == "__main__":
    sys.exit(main())
