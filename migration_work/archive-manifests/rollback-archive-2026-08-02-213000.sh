#!/usr/bin/env bash
set -euo pipefail
echo "=================================================="
echo "   REVERSIBLE ARCHIVE ROLLBACK EXECUTION"
echo "=================================================="

tree_hash() {
    local directory="$1"
    if [ ! -d "$directory" ]; then echo "ERROR: Directory does not exist: $directory" >&2; return 1; fi
    ( cd "$directory" && find . -type f -print0 | sort -z | while IFS= read -r -d '' file; do hash=$(sha256sum "$file" | awk '{print $1}'); clean_path="${file#./}"; printf '%s:%s\n' "$clean_path" "$hash"; done ) | sha256sum | awk '{print $1}'
}

restore_file_safe() {
    local archived_src="$1"; local original_dest="$2"; local expected_hash="$3"
    if [ ! -f "$archived_src" ]; then echo "CRITICAL ROLLBACK ERROR: Source file missing: $archived_src" >&2; exit 1; fi
    if [ -e "$original_dest" ]; then echo "CRITICAL ROLLBACK ERROR: Destination occupied: $original_dest" >&2; exit 1; fi
    local pre_hash; pre_hash=$(sha256sum "$archived_src" | awk '{print $1}')
    if [ "$pre_hash" != "$expected_hash" ]; then echo "CRITICAL ROLLBACK ERROR: Source hash mismatch for $archived_src" >&2; exit 1; fi
    mv "$archived_src" "$original_dest"
    if [ -e "$archived_src" ]; then echo "CRITICAL ROLLBACK ERROR: Source still exists: $archived_src" >&2; exit 1; fi
    if [ ! -f "$original_dest" ]; then echo "CRITICAL ROLLBACK ERROR: Restored file missing: $original_dest" >&2; exit 1; fi
    local post_hash; post_hash=$(sha256sum "$original_dest" | awk '{print $1}')
    if [ "$post_hash" != "$expected_hash" ]; then echo "CRITICAL ROLLBACK ERROR: Restored hash mismatch for $original_dest" >&2; exit 1; fi
    echo "OK Restored file: $original_dest"
}

restore_directory_safe() {
    local archived_src="$1"; local original_dest="$2"; local expected_tree_hash="$3"
    if [ ! -d "$archived_src" ]; then echo "CRITICAL ROLLBACK ERROR: Source directory missing: $archived_src" >&2; exit 1; fi
    if [ -e "$original_dest" ]; then echo "CRITICAL ROLLBACK ERROR: Destination occupied: $original_dest" >&2; exit 1; fi
    local before_hash; before_hash=$(tree_hash "$archived_src")
    if [ "$before_hash" != "$expected_tree_hash" ]; then echo "CRITICAL ROLLBACK ERROR: Tree hash mismatch for $archived_src" >&2; exit 1; fi
    mv "$archived_src" "$original_dest"
    if [ -e "$archived_src" ]; then echo "CRITICAL ROLLBACK ERROR: Source directory still exists: $archived_src" >&2; exit 1; fi
    if [ ! -d "$original_dest" ]; then echo "CRITICAL ROLLBACK ERROR: Restored directory missing: $original_dest" >&2; exit 1; fi
    local after_hash; after_hash=$(tree_hash "$original_dest")
    if [ "$after_hash" != "$expected_tree_hash" ]; then echo "CRITICAL ROLLBACK ERROR: Restored tree hash mismatch for $original_dest" >&2; exit 1; fi
    echo "OK Restored directory: $original_dest"
}

restore_file_safe "scripts/archive/replaceSaaQuestions.before-250-upgrade.js" "scripts/replaceSaaQuestions.before-250-upgrade.js" "f88cde00938853355b18f182d5dbef7794ac2961e79a582f541db788e251a55c"
restore_file_safe "scripts/archive/build_before_audit.py" "scripts/build_before_audit.py" "c49a113a0d5a798abe2350b44e55f68c586462d9e78416fc2e15d3323174aaf9"
restore_file_safe "scripts/archive/build_upgrade_candidates.py" "scripts/build_upgrade_candidates.py" "53e310d12a705b558abb088323f94c9416208f921375f0a62cea5c8af8cca8d4"
restore_file_safe "scripts/archive/auditSaaExplanationQuality.py" "scripts/auditSaaExplanationQuality.py" "247afd7ca31006d2ff74047e017896a9b8c4867c709627545309a3f50d6684c7"
restore_file_safe "scripts/archive/applyTaskChecklistRepair.js" "scripts/applyTaskChecklistRepair.js" "c36a14dbcc1532b48b66864cca12eb7f54208d1aa9d7a12ddce7ac7ac0e80d32"
restore_file_safe "scripts/archive/repairTaskChecklists.js" "scripts/repairTaskChecklists.js" "8980dfb46beb0c13b7950c6d5849f6a2539642580a943a46a8a26a77a96be57e"
restore_file_safe "scripts/archive/convertAnalyticsStreamingTasks.js" "scripts/convertAnalyticsStreamingTasks.js" "45db18c0b9068546e20d1ad152410717ee249c4a91a66574295172eb92765fcc"
restore_file_safe "scripts/archive/convertCloudFrontEdgeTasks.js" "scripts/convertCloudFrontEdgeTasks.js" "4c0e84ddb0b3bb9145304c736e833f8cfea6b36794beeaa87c18eccfb26a8c90"
restore_file_safe "scripts/archive/convertContainerServiceTasks.js" "scripts/convertContainerServiceTasks.js" "13a349279c4f7a3160f427692994144966421be6b1bdeefd4a424b68a264d91b"
restore_file_safe "scripts/archive/convertDatabaseTasks.js" "scripts/convertDatabaseTasks.js" "983145ed009c21384151e4a782a0f030bd2ac185e966e179d487d0f4cf2196aa"
restore_file_safe "scripts/archive/convertEc2Tasks.js" "scripts/convertEc2Tasks.js" "60903ddb23348ff6ac34fe219617089a08fcc964d3bf656bf1e5af7dba3a9d54"
restore_file_safe "scripts/archive/convertHighAvailabilityTasks.js" "scripts/convertHighAvailabilityTasks.js" "e71ee214ad4137512c1de8617fd8e2d32acca12a6e8a35dff6d7771879d09490"
restore_file_safe "scripts/archive/convertIamTasks.js" "scripts/convertIamTasks.js" "d18c945087605191bf4f245908009f53b9a1676b290ef9929dfba568bd2573cf"
restore_file_safe "scripts/archive/convertLoadBalancingAutoScalingTasks.js" "scripts/convertLoadBalancingAutoScalingTasks.js" "7ddbf3303c68e0154216980d603bbca92a51415c094a823b83c8f52b6124450c"
restore_file_safe "scripts/archive/convertMigrationHybridTasks.js" "scripts/convertMigrationHybridTasks.js" "f021c6486df630c1dba87c51f91ab23dc36225ea8e443fa8aa21be6a79d986c5"
restore_file_safe "scripts/archive/convertMonitoringManagementGovernanceTasks.js" "scripts/convertMonitoringManagementGovernanceTasks.js" "bbd01a2a652cf2fef0651e7a7a12bfdfd997f75d479b6e341bfb74db91299425"
restore_file_safe "scripts/archive/convertS3Tasks.js" "scripts/convertS3Tasks.js" "a1e0e7dc9e419df024f171a854e1df53dd4b96f80c7c2dabfe9c04e85e81187d"
restore_file_safe "scripts/archive/convertSecurityServiceTasks.js" "scripts/convertSecurityServiceTasks.js" "526437fd718f29d4d2b8d9ae9da1893c67399f809f68eabae7f243900969fc82"
restore_file_safe "scripts/archive/convertServerlessTasks.js" "scripts/convertServerlessTasks.js" "8e0131ab1e8619ee3b8c270afdbbdb5b32d6683e363db6fd35016ddec466682e"
restore_file_safe "scripts/archive/convertVpcTasks.js" "scripts/convertVpcTasks.js" "7a44347cc92b3a4eac049cde409a1746e49ff4bd29861ae1961e71f911205b2e"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-explanation-repairs-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-before-explanation-repairs-2026-07-30.json" "2b81f4696d5eae53911649588891e3d8d9123e258f9f6c8ebe51e2366fe31fee"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-final-generic-repairs-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-before-final-generic-repairs-2026-07-30.json" "b870e461d97510a78c0cbeb38a6c500d300dfd0a18a29b5a621b9dab47171ea3"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-1-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-1-2026-07-30.json" "e10c93759c276bf1f85c6b8fdabd92f045ad2b2809f8fb8e3b856c3e6205c608"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-2-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-2-2026-07-30.json" "f728a0d263bf778970d0539be0f59c75a7efb011e6e90c3417174ddd54b38205"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-generic-batch-3-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-before-generic-batch-3-2026-07-30.json" "72941ee5cbc199a02ce69efda6ce89ddfa9f20841e40607b25e0006cb95fe69e"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-nine-short-explanation-repairs-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-before-nine-short-explanation-repairs-2026-07-30.json" "f90771f2ce7ced196822ea3c0fbbae0052ed474c156a54010a813abc6a9ad969"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-realism-batch-1-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-before-realism-batch-1-2026-07-30.json" "07a80b067f9ecb1e005c33e1c0e824e8ad06b8b70d4baba4ff6af9a665c365b0"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-before-realism-batch-2-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-before-realism-batch-2-2026-07-30.json" "3030e80231188027bdbaa24ea4c13cdaf6531c30fc30aa7d5f5d4de50b56b402"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-question-bank-upgraded-250-approved-repaired-2026-07-30.json" "data/SAA-C03-question-bank-upgraded-250-approved-repaired-2026-07-30.json" "f90771f2ce7ced196822ea3c0fbbae0052ed474c156a54010a813abc6a9ad969"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/saa-c03-question-export-live-confirmed-2026-07-30.json" "data/saa-c03-question-export-live-confirmed-2026-07-30.json" "9167bce4ebf64244d8e78abb21ce0adbe902e5664cd18b4bebd6b6dbcd203f32"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-explanation-quality-audit-2026-07-30.json" "data/SAA-C03-explanation-quality-audit-2026-07-30.json" "da657afeb8f9bb28622c154a8f3d72750fad6a64cd499685ee67d4f77877ff5b"
restore_file_safe "data/archive/quality-upgrade-2026-07-30/SAA-C03-explanation-quality-audit-2026-07-30.txt" "data/SAA-C03-explanation-quality-audit-2026-07-30.txt" "833c2d59c3cf4167079e8621811a6dfddc58f842074e548f402bac822090ec65"
restore_file_safe "data/archive/historical-notes/SAA-C03-original-36-manual-review.txt" "data/SAA-C03-original-36-manual-review.txt" "aad75dbaffdaf1d35c24ccc8623bf2c40aa6cfbb6a6edb5b73c2e1e9f05163f6"
restore_file_safe "data/archive/historical-notes/q151-250-domain-review.json" "data/q151-250-domain-review.json" "a7708e000f64bd5186427fd30318cff5e0972987243c1bc4fdf026cdb8adea48"
restore_directory_safe "data/archive/audits-original-150" "data/audits-original-150" "8ababe97b7484c2d5284c37230b8631c9375fa51b39c9253e8eae1db3f859db0"
