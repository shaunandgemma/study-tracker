#!/usr/bin/env bash
set -euo pipefail
echo "=================================================="
echo "   SAFE FORWARD ARCHIVE EXECUTION"
echo "=================================================="

tree_hash() {
    local directory="$1"
    if [ ! -d "$directory" ]; then echo "ERROR: Directory does not exist: $directory" >&2; return 1; fi
    ( cd "$directory" && find . -type f -print0 | sort -z | while IFS= read -r -d '' file; do hash=$(sha256sum "$file" | awk '{print $1}'); clean_path="${file#./}"; printf '%s:%s\n' "$clean_path" "$hash"; done ) | sha256sum | awk '{print $1}'
}

move_file_safe() {
    local src="$1"; local dest="$2"; local expected_hash="$3"
    if [ ! -f "$src" ]; then echo "ERROR: Source file does not exist: $src" >&2; exit 1; fi
    if [ -e "$dest" ]; then echo "ERROR: Destination path already exists: $dest" >&2; exit 1; fi
    local pre_hash; pre_hash=$(sha256sum "$src" | awk '{print $1}')
    if [ "$pre_hash" != "$expected_hash" ]; then echo "ERROR: Source hash mismatch for $src" >&2; exit 1; fi
    mv "$src" "$dest"
    if [ -e "$src" ]; then echo "ERROR: Source file still exists: $src" >&2; exit 1; fi
    if [ ! -f "$dest" ]; then echo "ERROR: Destination file missing: $dest" >&2; exit 1; fi
    local post_hash; post_hash=$(sha256sum "$dest" | awk '{print $1}')
    if [ "$post_hash" != "$expected_hash" ]; then echo "ERROR: Post-move hash mismatch for $dest" >&2; exit 1; fi
    echo "OK Moved file: $src -> $dest"
}

move_directory_safe() {
    local src="$1"; local dest="$2"; local expected_tree_hash="$3"
    if [ ! -d "$src" ]; then echo "ERROR: Source directory missing: $src" >&2; exit 1; fi
    if [ -e "$dest" ]; then echo "ERROR: Destination already exists: $dest" >&2; exit 1; fi
    local before_hash; before_hash=$(tree_hash "$src")
    if [ "$before_hash" != "$expected_tree_hash" ]; then echo "ERROR: Tree hash mismatch for $src" >&2; exit 1; fi
    mv "$src" "$dest"
    if [ -e "$src" ]; then echo "ERROR: Source directory still exists: $src" >&2; exit 1; fi
    if [ ! -d "$dest" ]; then echo "ERROR: Destination directory missing: $dest" >&2; exit 1; fi
    local after_hash; after_hash=$(tree_hash "$dest")
    if [ "$after_hash" != "$expected_tree_hash" ]; then echo "ERROR: Tree hash mismatch for $dest" >&2; exit 1; fi
    echo "OK Moved directory: $src -> $dest"
}

mkdir -p scripts/archive
mkdir -p data/archive/quality-upgrade-2026-07-30
mkdir -p data/archive/historical-notes

move_file_safe "scripts/replaceSaaQuestions.before-250-upgrade.js" "scripts/archive/replaceSaaQuestions.before-250-upgrade.js" "f88cde00938853355b18f182d5dbef7794ac2961e79a582f541db788e251a55c"
move_file_safe "scripts/build_before_audit.py" "scripts/archive/build_before_audit.py" "c49a113a0d5a798abe2350b44e55f68c586462d9e78416fc2e15d3323174aaf9"
move_file_safe "scripts/build_upgrade_candidates.py" "scripts/archive/build_upgrade_candidates.py" "53e310d12a705b558abb088323f94c9416208f921375f0a62cea5c8af8cca8d4"
move_file_safe "scripts/auditSaaExplanationQuality.py" "scripts/archive/auditSaaExplanationQuality.py" "247afd7ca31006d2ff74047e017896a9b8c4867c709627545309a3f50d6684c7"
move_file_safe "scripts/applyTaskChecklistRepair.js" "scripts/archive/applyTaskChecklistRepair.js" "c36a14dbcc1532b48b66864cca12eb7f54208d1aa9d7a12ddce7ac7ac0e80d32"
move_file_safe "scripts/repairTaskChecklists.js" "scripts/archive/repairTaskChecklists.js" "8980dfb46beb0c13b7950c6d5849f6a2539642580a943a46a8a26a77a96be57e"
move_file_safe "scripts/convertAnalyticsStreamingTasks.js" "scripts/archive/convertAnalyticsStreamingTasks.js" "45db18c0b9068546e20d1ad152410717ee249c4a91a66574295172eb92765fcc"
move_file_safe "scripts/convertCloudFrontEdgeTasks.js" "scripts/archive/convertCloudFrontEdgeTasks.js" "4c0e84ddb0b3bb9145304c736e833f8cfea6b36794beeaa87c18eccfb26a8c90"
move_file_safe "scripts/convertContainerServiceTasks.js" "scripts/archive/convertContainerServiceTasks.js" "13a349279c4f7a3160f427692994144966421be6b1bdeefd4a424b68a264d91b"
move_file_safe "scripts/convertDatabaseTasks.js" "scripts/archive/convertDatabaseTasks.js" "983145ed009c21384151e4a782a0f030bd2ac185e966e179d487d0f4cf2196aa"
move_file_safe "scripts/convertEc2Tasks.js" "scripts/archive/convertEc2Tasks.js" "60903ddb23348ff6ac34fe219617089a08fcc964d3bf656bf1e5af7dba3a9d54"
move_file_safe "scripts/convertHighAvailabilityTasks.js" "scripts/archive/convertHighAvailabilityTasks.js" "e71ee214ad4137512c1de8617fd8e2d32acca12a6e8a35dff6d7771879d09490"
move_file_safe "scripts/convertIamTasks.js" "scripts/archive/convertIamTasks.js" "d18c945087605191bf4f245908009f53b9a1676b290ef9929dfba568bd2573cf"
move_file_safe "scripts/convertLoadBalancingAutoScalingTasks.js" "scripts/archive/convertLoadBalancingAutoScalingTasks.js" "7ddbf3303c68e0154216980d603bbca92a51415c094a823b83c8f52b6124450c"
move_file_safe "scripts/convertMigrationHybridTasks.js" "scripts/archive/convertMigrationHybridTasks.js" "f021c6486df630c1dba87c51f91ab23dc36225ea8e443fa8aa21be6a79d986c5"
move_file_safe "scripts/convertMonitoringManagementGovernanceTasks.js" "scripts/archive/convertMonitoringManagementGovernanceTasks.js" "bbd01a2a652cf2fef0651e7a7a12bfdfd997f75d479b6e341bfb74db91299425"
move_file_safe "scripts/convertS3Tasks.js" "scripts/archive/convertS3Tasks.js" "a1e0e7dc9e419df024f171a854e1df53dd4b96f80c7c2dabfe9c04e85e81187d"
move_file_safe "scripts/convertSecurityServiceTasks.js" "scripts/archive/convertSecurityServiceTasks.js" "526437fd718f29d4d2b8d9ae9da1893c67399f809f68eabae7f243900969fc82"
move_file_safe "scripts/convertServerlessTasks.js" "scripts/archive/convertServerlessTasks.js" "8e0131ab1e8619ee3b8c270afdbbdb5b32d6683e363db6fd35016ddec466682e"
move_file_safe "scripts/convertVpcTasks.js" "scripts/archive/convertVpcTasks.js" "7a44347cc92b3a4eac049cde409a1746e49ff4bd29861ae1961e71f911205b2e"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-before-explanation-repairs-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-explanation-repairs-2026-07-30.json" "2b81f4696d5eae53911649588891e3d8d9123e258f9f6c8ebe51e2366fe31fee"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-before-final-generic-repairs-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-final-generic-repairs-2026-07-30.json" "b870e461d97510a78c0cbeb38a6c500d300dfd0a18a29b5a621b9dab47171ea3"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-1-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-1-2026-07-30.json" "e10c93759c276bf1f85c6b8fdabd92f045ad2b2809f8fb8e3b856c3e6205c608"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-2-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-2-2026-07-30.json" "f728a0d263bf778970d0539be0f59c75a7efb011e6e90c3417174ddd54b38205"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-3-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-3-2026-07-30.json" "72941ee5cbc199a02ce69efda6ce89ddfa9f20841e40607b25e0006cb95fe69e"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-before-nine-short-explanation-repairs-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-nine-short-explanation-repairs-2026-07-30.json" "f90771f2ce7ced196822ea3c0fbbae0052ed474c156a54010a813abc6a9ad969"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-before-realism-batch-1-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-realism-batch-1-2026-07-30.json" "07a80b067f9ecb1e005c33e1c0e824e8ad06b8b70d4baba4ff6af9a665c365b0"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-before-realism-batch-2-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-realism-batch-2-2026-07-30.json" "3030e80231188027bdbaa24ea4c13cdaf6531c30fc30aa7d5f5d4de50b56b402"
move_file_safe "data/SAA-C03-question-bank-upgraded-250-approved-repaired-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-approved-repaired-2026-07-30.json" "f90771f2ce7ced196822ea3c0fbbae0052ed474c156a54010a813abc6a9ad969"
move_file_safe "data/saa-c03-question-export-live-confirmed-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/saa-c03-question-export-live-confirmed-2026-07-30.json" "9167bce4ebf64244d8e78abb21ce0adbe902e5664cd18b4bebd6b6dbcd203f32"
move_file_safe "data/SAA-C03-explanation-quality-audit-2026-07-30.json" "data/archive/quality-upgrade-2026-07-30/SAA-C03-explanation-quality-audit-2026-07-30.json" "da657afeb8f9bb28622c154a8f3d72750fad6a64cd499685ee67d4f77877ff5b"
move_file_safe "data/SAA-C03-explanation-quality-audit-2026-07-30.txt" "data/archive/quality-upgrade-2026-07-30/SAA-C03-explanation-quality-audit-2026-07-30.txt" "833c2d59c3cf4167079e8621811a6dfddc58f842074e548f402bac822090ec65"
move_file_safe "data/SAA-C03-original-36-manual-review.txt" "data/archive/historical-notes/SAA-C03-original-36-manual-review.txt" "aad75dbaffdaf1d35c24ccc8623bf2c40aa6cfbb6a6edb5b73c2e1e9f05163f6"
move_file_safe "data/q151-250-domain-review.json" "data/archive/historical-notes/q151-250-domain-review.json" "a7708e000f64bd5186427fd30318cff5e0972987243c1bc4fdf026cdb8adea48"
move_directory_safe "data/audits-original-150" "data/archive/audits-original-150" "8ababe97b7484c2d5284c37230b8631c9375fa51b39c9253e8eae1db3f859db0"
