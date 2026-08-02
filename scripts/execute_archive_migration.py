import os
import sys
import json
import hashlib
import subprocess
import shutil

PROJECT_ROOT = r'e:\code\study-tracker'
TIMESTAMP = '2026-08-02-213000'
MANIFEST_DIR = os.path.join(PROJECT_ROOT, 'migration_work', 'archive-manifests')
MANIFEST_PATH = os.path.join(MANIFEST_DIR, f'archive-manifest-{TIMESTAMP}.json')
EXECUTE_SCRIPT_PATH = os.path.join(MANIFEST_DIR, f'execute-archive-{TIMESTAMP}.sh')
ROLLBACK_SCRIPT_PATH = os.path.join(MANIFEST_DIR, f'rollback-archive-{TIMESTAMP}.sh')

ITEMS = [
    # 20 legacy scripts
    {"src": "scripts/replaceSaaQuestions.before-250-upgrade.js", "dest": "scripts/archive/replaceSaaQuestions.before-250-upgrade.js", "type": "file", "sha256": "f88cde00938853355b18f182d5dbef7794ac2961e79a582f541db788e251a55c"},
    {"src": "scripts/build_before_audit.py", "dest": "scripts/archive/build_before_audit.py", "type": "file", "sha256": "c49a113a0d5a798abe2350b44e55f68c586462d9e78416fc2e15d3323174aaf9"},
    {"src": "scripts/build_upgrade_candidates.py", "dest": "scripts/archive/build_upgrade_candidates.py", "type": "file", "sha256": "53e310d12a705b558abb088323f94c9416208f921375f0a62cea5c8af8cca8d4"},
    {"src": "scripts/auditSaaExplanationQuality.py", "dest": "scripts/archive/auditSaaExplanationQuality.py", "type": "file", "sha256": "247afd7ca31006d2ff74047e017896a9b8c4867c709627545309a3f50d6684c7"},
    {"src": "scripts/applyTaskChecklistRepair.js", "dest": "scripts/archive/applyTaskChecklistRepair.js", "type": "file", "sha256": "c36a14dbcc1532b48b66864cca12eb7f54208d1aa9d7a12ddce7ac7ac0e80d32"},
    {"src": "scripts/repairTaskChecklists.js", "dest": "scripts/archive/repairTaskChecklists.js", "type": "file", "sha256": "8980dfb46beb0c13b7950c6d5849f6a2539642580a943a46a8a26a77a96be57e"},
    {"src": "scripts/convertAnalyticsStreamingTasks.js", "dest": "scripts/archive/convertAnalyticsStreamingTasks.js", "type": "file", "sha256": "45db18c0b9068546e20d1ad152410717ee249c4a91a66574295172eb92765fcc"},
    {"src": "scripts/convertCloudFrontEdgeTasks.js", "dest": "scripts/archive/convertCloudFrontEdgeTasks.js", "type": "file", "sha256": "4c0e84ddb0b3bb9145304c736e833f8cfea6b36794beeaa87c18eccfb26a8c90"},
    {"src": "scripts/convertContainerServiceTasks.js", "dest": "scripts/archive/convertContainerServiceTasks.js", "type": "file", "sha256": "13a349279c4f7a3160f427692994144966421be6b1bdeefd4a424b68a264d91b"},
    {"src": "scripts/convertDatabaseTasks.js", "dest": "scripts/archive/convertDatabaseTasks.js", "type": "file", "sha256": "983145ed009c21384151e4a782a0f030bd2ac185e966e179d487d0f4cf2196aa"},
    {"src": "scripts/convertEc2Tasks.js", "dest": "scripts/archive/convertEc2Tasks.js", "type": "file", "sha256": "60903ddb23348ff6ac34fe219617089a08fcc964d3bf656bf1e5af7dba3a9d54"},
    {"src": "scripts/convertHighAvailabilityTasks.js", "dest": "scripts/archive/convertHighAvailabilityTasks.js", "type": "file", "sha256": "e71ee214ad4137512c1de8617fd8e2d32acca12a6e8a35dff6d7771879d09490"},
    {"src": "scripts/convertIamTasks.js", "dest": "scripts/archive/convertIamTasks.js", "type": "file", "sha256": "d18c945087605191bf4f245908009f53b9a1676b290ef9929dfba568bd2573cf"},
    {"src": "scripts/convertLoadBalancingAutoScalingTasks.js", "dest": "scripts/archive/convertLoadBalancingAutoScalingTasks.js", "type": "file", "sha256": "7ddbf3303c68e0154216980d603bbca92a51415c094a823b83c8f52b6124450c"},
    {"src": "scripts/convertMigrationHybridTasks.js", "dest": "scripts/archive/convertMigrationHybridTasks.js", "type": "file", "sha256": "f021c6486df630c1dba87c51f91ab23dc36225ea8e443fa8aa21be6a79d986c5"},
    {"src": "scripts/convertMonitoringManagementGovernanceTasks.js", "dest": "scripts/archive/convertMonitoringManagementGovernanceTasks.js", "type": "file", "sha256": "bbd01a2a652cf2fef0651e7a7a12bfdfd997f75d479b6e341bfb74db91299425"},
    {"src": "scripts/convertS3Tasks.js", "dest": "scripts/archive/convertS3Tasks.js", "type": "file", "sha256": "a1e0e7dc9e419df024f171a854e1df53dd4b96f80c7c2dabfe9c04e85e81187d"},
    {"src": "scripts/convertSecurityServiceTasks.js", "dest": "scripts/archive/convertSecurityServiceTasks.js", "type": "file", "sha256": "526437fd718f29d4d2b8d9ae9da1893c67399f809f68eabae7f243900969fc82"},
    {"src": "scripts/convertServerlessTasks.js", "dest": "scripts/archive/convertServerlessTasks.js", "type": "file", "sha256": "8e0131ab1e8619ee3b8c270afdbbdb5b32d6683e363db6fd35016ddec466682e"},
    {"src": "scripts/convertVpcTasks.js", "dest": "scripts/archive/convertVpcTasks.js", "type": "file", "sha256": "7a44347cc92b3a4eac049cde409a1746e49ff4bd29861ae1961e71f911205b2e"},
    
    # 12 quality upgrade data snapshots
    {"src": "data/SAA-C03-question-bank-upgraded-250-before-explanation-repairs-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-explanation-repairs-2026-07-30.json", "type": "file", "sha256": "2b81f4696d5eae53911649588891e3d8d9123e258f9f6c8ebe51e2366fe31fee"},
    {"src": "data/SAA-C03-question-bank-upgraded-250-before-final-generic-repairs-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-final-generic-repairs-2026-07-30.json", "type": "file", "sha256": "b870e461d97510a78c0cbeb38a6c500d300dfd0a18a29b5a621b9dab47171ea3"},
    {"src": "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-1-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-1-2026-07-30.json", "type": "file", "sha256": "e10c93759c276bf1f85c6b8fdabd92f045ad2b2809f8fb8e3b856c3e6205c608"},
    {"src": "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-2-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-2-2026-07-30.json", "type": "file", "sha256": "f728a0d263bf778970d0539be0f59c75a7efb011e6e90c3417174ddd54b38205"},
    {"src": "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-3-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-3-2026-07-30.json", "type": "file", "sha256": "72941ee5cbc199a02ce69efda6ce89ddfa9f20841e40607b25e0006cb95fe69e"},
    {"src": "data/SAA-C03-question-bank-upgraded-250-before-nine-short-explanation-repairs-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-nine-short-explanation-repairs-2026-07-30.json", "type": "file", "sha256": "f90771f2ce7ced196822ea3c0fbbae0052ed474c156a54010a813abc6a9ad969"},
    {"src": "data/SAA-C03-question-bank-upgraded-250-before-realism-batch-1-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-realism-batch-1-2026-07-30.json", "type": "file", "sha256": "07a80b067f9ecb1e005c33e1c0e824e8ad06b8b70d4baba4ff6af9a665c365b0"},
    {"src": "data/SAA-C03-question-bank-upgraded-250-before-realism-batch-2-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-realism-batch-2-2026-07-30.json", "type": "file", "sha256": "3030e80231188027bdbaa24ea4c13cdaf6531c30fc30aa7d5f5d4de50b56b402"},
    {"src": "data/SAA-C03-question-bank-upgraded-250-approved-repaired-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-approved-repaired-2026-07-30.json", "type": "file", "sha256": "f90771f2ce7ced196822ea3c0fbbae0052ed474c156a54010a813abc6a9ad969"},
    {"src": "data/saa-c03-question-export-live-confirmed-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/saa-c03-question-export-live-confirmed-2026-07-30.json", "type": "file", "sha256": "9167bce4ebf64244d8e78abb21ce0adbe902e5664cd18b4bebd6b6dbcd203f32"},
    {"src": "data/SAA-C03-explanation-quality-audit-2026-07-30.json", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-explanation-quality-audit-2026-07-30.json", "type": "file", "sha256": "da657afeb8f9bb28622c154a8f3d72750fad6a64cd499685ee67d4f77877ff5b"},
    {"src": "data/SAA-C03-explanation-quality-audit-2026-07-30.txt", "dest": "data/archive/quality-upgrade-2026-07-30/SAA-C03-explanation-quality-audit-2026-07-30.txt", "type": "file", "sha256": "833c2d59c3cf4167079e8621811a6dfddc58f842074e548f402bac822090ec65"},
    
    # 2 historical review notes
    {"src": "data/SAA-C03-original-36-manual-review.txt", "dest": "data/archive/historical-notes/SAA-C03-original-36-manual-review.txt", "type": "file", "sha256": "aad75dbaffdaf1d35c24ccc8623bf2c40aa6cfbb6a6edb5b73c2e1e9f05163f6"},
    {"src": "data/q151-250-domain-review.json", "dest": "data/archive/historical-notes/q151-250-domain-review.json", "type": "file", "sha256": "a7708e000f64bd5186427fd30318cff5e0972987243c1bc4fdf026cdb8adea48"},
    
    # 1 complete directory
    {"src": "data/audits-original-150", "dest": "data/archive/audits-original-150", "type": "directory", "sha256": "8ababe97b7484c2d5284c37230b8631c9375fa51b39c9253e8eae1db3f859db0"}
]

def calculate_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def calculate_tree_hash(dirpath):
    entry_hashes = []
    for root, _, files in os.walk(dirpath):
        for f in sorted(files):
            full_p = os.path.join(root, f)
            rel_p = os.path.relpath(full_p, dirpath).replace('\\', '/')
            file_h = calculate_sha256(full_p)
            entry_hashes.append(f"{rel_p}:{file_h}")
    entry_hashes.sort()
    composite_str = '\n'.join(entry_hashes) + '\n'
    return hashlib.sha256(composite_str.encode('utf-8')).hexdigest()

def main():
    print("==================================================")
    print("   EXECUTING ARCHIVE MIGRATION PIPELINE")
    print("==================================================")

    os.makedirs(MANIFEST_DIR, exist_ok=True)

    # 1. Build & Save Manifest
    manifest_data = {
        "timestamp": TIMESTAMP,
        "project": "Study Tracker App",
        "totalItems": len(ITEMS),
        "fileCount": sum(1 for item in ITEMS if item["type"] == "file"),
        "directoryCount": sum(1 for item in ITEMS if item["type"] == "directory"),
        "items": ITEMS
    }
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest_data, f, indent=2)
    print(f"OK Manifest saved: {MANIFEST_PATH}")

    # 2. Build Forward Script
    forward_lines = [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        'echo "=================================================="',
        'echo "   SAFE FORWARD ARCHIVE EXECUTION"',
        'echo "=================================================="',
        "",
        'tree_hash() {',
        '    local directory="$1"',
        '    if [ ! -d "$directory" ]; then echo "ERROR: Directory does not exist: $directory" >&2; return 1; fi',
        '    ( cd "$directory" && find . -type f -print0 | sort -z | while IFS= read -r -d \'\' file; do hash=$(sha256sum "$file" | awk \'{print $1}\'); clean_path="${file#./}"; printf \'%s:%s\\n\' "$clean_path" "$hash"; done ) | sha256sum | awk \'{print $1}\'',
        '}',
        "",
        'move_file_safe() {',
        '    local src="$1"; local dest="$2"; local expected_hash="$3"',
        '    if [ ! -f "$src" ]; then echo "ERROR: Source file does not exist: $src" >&2; exit 1; fi',
        '    if [ -e "$dest" ]; then echo "ERROR: Destination path already exists: $dest" >&2; exit 1; fi',
        '    local pre_hash; pre_hash=$(sha256sum "$src" | awk \'{print $1}\')',
        '    if [ "$pre_hash" != "$expected_hash" ]; then echo "ERROR: Source hash mismatch for $src" >&2; exit 1; fi',
        '    mv "$src" "$dest"',
        '    if [ -e "$src" ]; then echo "ERROR: Source file still exists: $src" >&2; exit 1; fi',
        '    if [ ! -f "$dest" ]; then echo "ERROR: Destination file missing: $dest" >&2; exit 1; fi',
        '    local post_hash; post_hash=$(sha256sum "$dest" | awk \'{print $1}\')',
        '    if [ "$post_hash" != "$expected_hash" ]; then echo "ERROR: Post-move hash mismatch for $dest" >&2; exit 1; fi',
        '    echo "OK Moved file: $src -> $dest"',
        '}',
        "",
        'move_directory_safe() {',
        '    local src="$1"; local dest="$2"; local expected_tree_hash="$3"',
        '    if [ ! -d "$src" ]; then echo "ERROR: Source directory missing: $src" >&2; exit 1; fi',
        '    if [ -e "$dest" ]; then echo "ERROR: Destination already exists: $dest" >&2; exit 1; fi',
        '    local before_hash; before_hash=$(tree_hash "$src")',
        '    if [ "$before_hash" != "$expected_tree_hash" ]; then echo "ERROR: Tree hash mismatch for $src" >&2; exit 1; fi',
        '    mv "$src" "$dest"',
        '    if [ -e "$src" ]; then echo "ERROR: Source directory still exists: $src" >&2; exit 1; fi',
        '    if [ ! -d "$dest" ]; then echo "ERROR: Destination directory missing: $dest" >&2; exit 1; fi',
        '    local after_hash; after_hash=$(tree_hash "$dest")',
        '    if [ "$after_hash" != "$expected_tree_hash" ]; then echo "ERROR: Tree hash mismatch for $dest" >&2; exit 1; fi',
        '    echo "OK Moved directory: $src -> $dest"',
        '}',
        "",
        'mkdir -p scripts/archive',
        'mkdir -p data/archive/quality-upgrade-2026-07-30',
        'mkdir -p data/archive/historical-notes',
        ""
    ]
    for item in ITEMS:
        if item["type"] == "file":
            forward_lines.append(f'move_file_safe "{item["src"]}" "{item["dest"]}" "{item["sha256"]}"')
        else:
            forward_lines.append(f'move_directory_safe "{item["src"]}" "{item["dest"]}" "{item["sha256"]}"')

    with open(EXECUTE_SCRIPT_PATH, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(forward_lines) + '\n')
    print(f"OK Forward script saved: {EXECUTE_SCRIPT_PATH}")

    # 3. Build Rollback Script
    rollback_lines = [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        'echo "=================================================="',
        'echo "   REVERSIBLE ARCHIVE ROLLBACK EXECUTION"',
        'echo "=================================================="',
        "",
        'tree_hash() {',
        '    local directory="$1"',
        '    if [ ! -d "$directory" ]; then echo "ERROR: Directory does not exist: $directory" >&2; return 1; fi',
        '    ( cd "$directory" && find . -type f -print0 | sort -z | while IFS= read -r -d \'\' file; do hash=$(sha256sum "$file" | awk \'{print $1}\'); clean_path="${file#./}"; printf \'%s:%s\\n\' "$clean_path" "$hash"; done ) | sha256sum | awk \'{print $1}\'',
        '}',
        "",
        'restore_file_safe() {',
        '    local archived_src="$1"; local original_dest="$2"; local expected_hash="$3"',
        '    if [ ! -f "$archived_src" ]; then echo "CRITICAL ROLLBACK ERROR: Source file missing: $archived_src" >&2; exit 1; fi',
        '    if [ -e "$original_dest" ]; then echo "CRITICAL ROLLBACK ERROR: Destination occupied: $original_dest" >&2; exit 1; fi',
        '    local pre_hash; pre_hash=$(sha256sum "$archived_src" | awk \'{print $1}\')',
        '    if [ "$pre_hash" != "$expected_hash" ]; then echo "CRITICAL ROLLBACK ERROR: Source hash mismatch for $archived_src" >&2; exit 1; fi',
        '    mv "$archived_src" "$original_dest"',
        '    if [ -e "$archived_src" ]; then echo "CRITICAL ROLLBACK ERROR: Source still exists: $archived_src" >&2; exit 1; fi',
        '    if [ ! -f "$original_dest" ]; then echo "CRITICAL ROLLBACK ERROR: Restored file missing: $original_dest" >&2; exit 1; fi',
        '    local post_hash; post_hash=$(sha256sum "$original_dest" | awk \'{print $1}\')',
        '    if [ "$post_hash" != "$expected_hash" ]; then echo "CRITICAL ROLLBACK ERROR: Restored hash mismatch for $original_dest" >&2; exit 1; fi',
        '    echo "OK Restored file: $original_dest"',
        '}',
        "",
        'restore_directory_safe() {',
        '    local archived_src="$1"; local original_dest="$2"; local expected_tree_hash="$3"',
        '    if [ ! -d "$archived_src" ]; then echo "CRITICAL ROLLBACK ERROR: Source directory missing: $archived_src" >&2; exit 1; fi',
        '    if [ -e "$original_dest" ]; then echo "CRITICAL ROLLBACK ERROR: Destination occupied: $original_dest" >&2; exit 1; fi',
        '    local before_hash; before_hash=$(tree_hash "$archived_src")',
        '    if [ "$before_hash" != "$expected_tree_hash" ]; then echo "CRITICAL ROLLBACK ERROR: Tree hash mismatch for $archived_src" >&2; exit 1; fi',
        '    mv "$archived_src" "$original_dest"',
        '    if [ -e "$archived_src" ]; then echo "CRITICAL ROLLBACK ERROR: Source directory still exists: $archived_src" >&2; exit 1; fi',
        '    if [ ! -d "$original_dest" ]; then echo "CRITICAL ROLLBACK ERROR: Restored directory missing: $original_dest" >&2; exit 1; fi',
        '    local after_hash; after_hash=$(tree_hash "$original_dest")',
        '    if [ "$after_hash" != "$expected_tree_hash" ]; then echo "CRITICAL ROLLBACK ERROR: Restored tree hash mismatch for $original_dest" >&2; exit 1; fi',
        '    echo "OK Restored directory: $original_dest"',
        '}',
        ""
    ]
    for item in ITEMS:
        if item["type"] == "file":
            rollback_lines.append(f'restore_file_safe "{item["dest"]}" "{item["src"]}" "{item["sha256"]}"')
        else:
            rollback_lines.append(f'restore_directory_safe "{item["dest"]}" "{item["src"]}" "{item["sha256"]}"')

    with open(ROLLBACK_SCRIPT_PATH, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(rollback_lines) + '\n')
    print(f"OK Rollback script saved: {ROLLBACK_SCRIPT_PATH}")

    # 4. Confirm all 3 files exist and are readable
    for fpath in [MANIFEST_PATH, EXECUTE_SCRIPT_PATH, ROLLBACK_SCRIPT_PATH]:
        if not (os.path.exists(fpath) and os.access(fpath, os.R_OK)):
            print(f"CRITICAL ERROR: Failed to write/read pre-move script {fpath}", file=sys.stderr)
            sys.exit(1)

    # 5. Complete Pre-Move Validation across all 35 items
    print("\n--- Running Pre-Move Validation ---")
    for item in ITEMS:
        src = os.path.join(PROJECT_ROOT, item["src"])
        dest = os.path.join(PROJECT_ROOT, item["dest"])

        if not os.path.exists(src):
            print(f"CRITICAL PRE-MOVE ERROR: Source missing: {item['src']}", file=sys.stderr)
            sys.exit(1)

        if os.path.exists(dest):
            print(f"CRITICAL PRE-MOVE ERROR: Destination already exists: {item['dest']}", file=sys.stderr)
            sys.exit(1)

        if item["type"] == "file":
            actual_h = calculate_sha256(src)
        else:
            actual_h = calculate_tree_hash(src)

        if actual_h != item["sha256"]:
            print(f"CRITICAL PRE-MOVE ERROR: Hash mismatch for {item['src']}: expected {item['sha256']}, got {actual_h}", file=sys.stderr)
            sys.exit(1)

    print("OK Pre-move validation PASSED for all 35 items!\n")

    # 6. Perform Moves
    print("--- Executing Archive Moves ---")
    moved_count = 0
    for item in ITEMS:
        src = os.path.join(PROJECT_ROOT, item["src"])
        dest = os.path.join(PROJECT_ROOT, item["dest"])
        os.makedirs(os.path.dirname(dest), exist_ok=True)

        shutil.move(src, dest)

        # Immediate post-move validation
        if os.path.exists(src):
            print(f"CRITICAL POST-MOVE ERROR: Source still exists: {item['src']}", file=sys.stderr)
            sys.exit(1)

        if not os.path.exists(dest):
            print(f"CRITICAL POST-MOVE ERROR: Destination missing: {item['dest']}", file=sys.stderr)
            sys.exit(1)

        if item["type"] == "file":
            post_h = calculate_sha256(dest)
        else:
            post_h = calculate_tree_hash(dest)

        if post_h != item["sha256"]:
            print(f"CRITICAL POST-MOVE ERROR: Post-move hash mismatch for {item['dest']}", file=sys.stderr)
            sys.exit(1)

        moved_count += 1
        print(f"[{moved_count}/{len(ITEMS)}] Moved: {item['src']} -> {item['dest']}")

    print("\nOK All 35 items moved and hash-verified successfully!")

if __name__ == '__main__':
    main()
