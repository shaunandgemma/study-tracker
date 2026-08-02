# Script Documentation

This folder explains what each JavaScript and Python script in the `/scripts` folder does.

Each document includes:

- Purpose
- Commands
- Inputs and outputs
- Supabase changes
- Safety notes
- Dependencies

## Question importing and exporting

- [exportQuestions.js](exportQuestions.md)
- [importQuestions.js](importQuestions.md)
- [replaceQuestionBatch.js](replaceQuestionBatch.md)
- [replaceSaaQuestions.js](replaceSaaQuestions.md)
- [replaceSaaQuestions.before-250-upgrade.js](replaceSaaQuestions.before-250-upgrade.md)

## Question-bank auditing and upgrading

- [auditSaaExplanationQuality.py](auditSaaExplanationQuality.md)
- [audit_answer_option_quality.py](audit_answer_option_quality.md)
- [audit_distractor_and_wording.py](audit_distractor_and_wording.md)
- [audit_full_bank_phase1.py](audit_full_bank_phase1.md)
- [build_before_audit.py](build_before_audit.md)
- [build_upgrade_candidates.py](build_upgrade_candidates.md)
- [perform_full_bank_upgrade.py](perform_full_bank_upgrade.md)
- [validate_upgraded_bank.py](validate_upgraded_bank.md)

## Hands-on task conversion

- [convertAnalyticsStreamingTasks.js](convertAnalyticsStreamingTasks.md)
- [convertCloudFrontEdgeTasks.js](convertCloudFrontEdgeTasks.md)
- [convertContainerServiceTasks.js](convertContainerServiceTasks.md)
- [convertDatabaseTasks.js](convertDatabaseTasks.md)
- [convertEc2Tasks.js](convertEc2Tasks.md)
- [convertHighAvailabilityTasks.js](convertHighAvailabilityTasks.md)
- [convertIamTasks.js](convertIamTasks.md)
- [convertLoadBalancingAutoScalingTasks.js](convertLoadBalancingAutoScalingTasks.md)
- [convertMigrationHybridTasks.js](convertMigrationHybridTasks.md)
- [convertMonitoringManagementGovernanceTasks.js](convertMonitoringManagementGovernanceTasks.md)
- [convertS3Tasks.js](convertS3Tasks.md)
- [convertSecurityServiceTasks.js](convertSecurityServiceTasks.md)
- [convertServerlessTasks.js](convertServerlessTasks.md)
- [convertVpcTasks.js](convertVpcTasks.md)

## Hands-on task importing

- [importHandsOnTasks.js](importHandsOnTasks.md)

## Checklist auditing and repair

- [applyTaskChecklistRepair.js](applyTaskChecklistRepair.md)
- [auditTaskChecklistContent.js](auditTaskChecklistContent.md)
- [compareChecklistBaseline.js](compareChecklistBaseline.md)
- [createChecklistBaseline.js](createChecklistBaseline.md)
- [repairTaskChecklists.js](repairTaskChecklists.md)

## SQL and database utilities

- [generateSql.js](generateSql.md)

## Recommended safe workflow

### Question-bank replacement

1. Export the current live bank.
2. Run all validation and audit scripts.
3. Run the replacement script with `--dry-run`.
4. Review the reported counts.
5. Run the live replacement.
6. Export the bank again and compare it with the source.

### Task checklist repair

1. Create a checklist baseline.
2. Run the checklist audit.
3. Apply the controlled repair.
4. Compare the repaired catalogue with the baseline.
5. Run the app tests and production build.

## Important safety rules

- Always use dry-run mode when available.
- Create a backup before changing Supabase.
- Never commit `.env.local`.
- Keep the Supabase service-role key private.
- Review generated task text before accepting it.
- Run `npm test` and `npm run build` after changing application data.
