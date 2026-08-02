# Script Documentation

This folder explains what each JavaScript and Python script in the `/scripts` folder does.

Each script is usually tied to specific source files, output files, task modules, or Supabase tables.

Before running a script, check:

- Which file it reads
- Which file it creates or changes
- Whether it writes to Supabase
- Whether it supports dry-run mode
- Whether a backup is created

## Question importing and exporting

### `exportQuestions.js`

Documentation:

- [exportQuestions.js](exportQuestions.md)

Works with:

- Supabase table: `exam_questions`
- Supabase table: `question_topics`
- Default output under the `data/` folder
- Can also be called by other scripts with a custom output path

Main purpose:

- Exports the live question bank from Supabase into a local JSON file

---

### `importQuestions.js`

Documentation:

- [importQuestions.js](importQuestions.md)

Works with:

- Local question JSON import files under `data/`
- Supabase table: `exam_questions`
- Supabase table: `question_topics`
- `.env.local` for Supabase credentials

Main purpose:

- Imports question data into Supabase

---

### `replaceQuestionBatch.js`

Documentation:

- [replaceQuestionBatch.js](replaceQuestionBatch.md)

Reads:

- `data/question-import.json`

Creates backups in:

- `data/backups/`

Changes:

- Supabase table: `exam_questions`
- Supabase table: `question_topics`

Requirements:

- Exactly 10 questions
- All question IDs must already exist in Supabase

Commands:

```bash
node scripts/replaceQuestionBatch.js --dry-run
node scripts/replaceQuestionBatch.js
```

---

### `replaceSaaQuestions.js`

Documentation:

- [replaceSaaQuestions.js](replaceSaaQuestions.md)

Reads:

- `data/SAA-C03-question-bank-upgraded-250.json`

Creates or replaces:

- `data/backups/saa-c03-before-corrected-import.json`

Changes:

- Supabase table: `exam_questions`
- Supabase table: `question_topics`

Requirements:

- Exactly 250 questions
- IDs must exactly match the existing live SAA-C03 bank
- Uses `aws-saa-c03` as the canonical exam code

Commands:

```bash
node scripts/replaceSaaQuestions.js --dry-run
node scripts/replaceSaaQuestions.js
```

---

### `replaceSaaQuestions.before-250-upgrade.js`

Documentation:

- [replaceSaaQuestions.before-250-upgrade.js](replaceSaaQuestions.before-250-upgrade.md)

Reads:

- `data/saa-c03-question-export-corrected.json`

Creates or replaces:

- `data/backups/saa-c03-before-corrected-import.json`

Changes:

- Supabase table: `exam_questions`
- Supabase table: `question_topics`

Requirements:

- Exactly 150 questions
- Intended only for the older pre-250-question bank

Commands:

```bash
node scripts/replaceSaaQuestions.before-250-upgrade.js --dry-run
node scripts/replaceSaaQuestions.before-250-upgrade.js
```

## Question-bank auditing and upgrading

### `auditSaaExplanationQuality.py`

Documentation:

- [auditSaaExplanationQuality.py](auditSaaExplanationQuality.md)

Works with:

- The SAA-C03 question-bank JSON file configured inside the script
- Question explanation fields

Main purpose:

- Audits explanation quality
- Identifies weak, short, generic, or incomplete explanations

---

### `audit_answer_option_quality.py`

Documentation:

- [audit_answer_option_quality.py](audit_answer_option_quality.md)

Works with:

- The question-bank JSON file configured inside the script
- Question options and correct-answer indexes

Main purpose:

- Checks answer-option quality
- Looks for length imbalance, weak distractors, and answer-writing patterns

---

### `audit_distractor_and_wording.py`

Documentation:

- [audit_distractor_and_wording.py](audit_distractor_and_wording.md)

Works with:

- The question-bank JSON file configured inside the script
- Question wording
- Answer options
- Distractors

Main purpose:

- Detects repeated wording
- Detects weak or implausible distractors
- Detects predictable question patterns

---

### `audit_full_bank_phase1.py`

Documentation:

- [audit_full_bank_phase1.py](audit_full_bank_phase1.md)

Works with:

- The SAA-C03 question-bank JSON file configured inside the script
- The full question collection

Main purpose:

- Runs a broad first-stage audit across the whole bank
- Reports structural and quality issues

---

### `build_before_audit.py`

Documentation:

- [build_before_audit.py](build_before_audit.md)

Works with:

- Question-bank source JSON configured inside the script
- An audit-ready output file configured inside the script

Main purpose:

- Prepares or normalises the question bank before quality auditing

---

### `build_upgrade_candidates.py`

Documentation:

- [build_upgrade_candidates.py](build_upgrade_candidates.md)

Works with:

- Existing question-bank JSON
- Audit results or identified weak questions
- Upgrade-candidate output JSON

Main purpose:

- Builds a smaller list of questions that need improvement

---

### `perform_full_bank_upgrade.py`

Documentation:

- [perform_full_bank_upgrade.py](perform_full_bank_upgrade.md)

Works with:

- Original question-bank JSON
- Upgraded or repaired question data
- Final upgraded-bank output file

Main purpose:

- Applies selected upgrades across the complete question bank

---

### `validate_upgraded_bank.py`

Documentation:

- [validate_upgraded_bank.py](validate_upgraded_bank.md)

Reads:

- `data/SAA-C03-question-bank-upgraded-250.json`

Changes:

- Nothing

Main purpose:

- Validates the local 250-question upgraded bank before Supabase replacement

Command:

```bash
python3 scripts/validate_upgraded_bank.py
```

Checks include:

- Exactly 250 questions
- IDs from `q-saa-1` to `q-saa-250`
- Valid question types
- Valid answer indexes
- Required `Select TWO` or `Select THREE` wording
- Non-empty explanations
- Required explanation sections for selected questions

## Hands-on task conversion

The conversion scripts normally read migration-export JSON files and generate or update task module files under:

- `src/data/tasks/`

The exact source path is hard-coded inside each conversion script.

### `convertAnalyticsStreamingTasks.js`

Documentation:

- [convertAnalyticsStreamingTasks.js](convertAnalyticsStreamingTasks.md)

Works with:

- Analytics and streaming migration-export JSON
- Task files for services such as Kinesis
- `src/data/tasks/`

---

### `convertCloudFrontEdgeTasks.js`

Documentation:

- [convertCloudFrontEdgeTasks.js](convertCloudFrontEdgeTasks.md)

Works with:

- CloudFront and edge-service migration-export JSON
- `src/data/tasks/cloudFrontTasks.js`
- `src/data/tasks/globalAcceleratorTasks.js`

---

### `convertContainerServiceTasks.js`

Documentation:

- [convertContainerServiceTasks.js](convertContainerServiceTasks.md)

Works with:

- Container-service migration-export JSON
- `src/data/tasks/ecrTasks.js`
- `src/data/tasks/fargateTasks.js`
- `src/data/tasks/ecsTasks.js`

May also identify unsupported or quarantined services such as App Runner.

---

### `convertDatabaseTasks.js`

Documentation:

- [convertDatabaseTasks.js](convertDatabaseTasks.md)

Works with:

- Database migration-export JSON
- `src/data/tasks/rdsTasks.js`
- `src/data/tasks/auroraTasks.js`
- `src/data/tasks/dynamoDbTasks.js`
- `src/data/tasks/elasticacheTasks.js`
- `src/data/tasks/redshiftTasks.js`

---

### `convertEc2Tasks.js`

Documentation:

- [convertEc2Tasks.js](convertEc2Tasks.md)

Works with:

- EC2 migration-export JSON
- `src/data/tasks/ec2Tasks.js`

---

### `convertHighAvailabilityTasks.js`

Documentation:

- [convertHighAvailabilityTasks.js](convertHighAvailabilityTasks.md)

Works with:

- High-availability migration-export JSON
- Related task modules under `src/data/tasks/`

May include:

- Route 53
- AWS Backup
- Multi-AZ or resilience-related tasks

---

### `convertIamTasks.js`

Documentation:

- [convertIamTasks.js](convertIamTasks.md)

Works with:

- IAM migration-export JSON
- `src/data/tasks/iamTasks.js`
- IAM review-required output files when manual review is needed

---

### `convertLoadBalancingAutoScalingTasks.js`

Documentation:

- [convertLoadBalancingAutoScalingTasks.js](convertLoadBalancingAutoScalingTasks.md)

Works with:

- Load-balancing and Auto Scaling migration-export JSON
- `src/data/tasks/elbTasks.js`
- `src/data/tasks/autoScalingTasks.js`

---

### `convertMigrationHybridTasks.js`

Documentation:

- [convertMigrationHybridTasks.js](convertMigrationHybridTasks.md)

Works with:

- Migration and hybrid-service export JSON
- `src/data/tasks/mgnTasks.js`
- `src/data/tasks/dmsTasks.js`
- `src/data/tasks/snowFamilyTasks.js`
- `src/data/tasks/storageGatewayTasks.js`
- `src/data/tasks/dataSyncTasks.js`
- `src/data/tasks/siteToSiteVpnTasks.js`
- `src/data/tasks/directConnectTasks.js`

---

### `convertMonitoringManagementGovernanceTasks.js`

Documentation:

- [convertMonitoringManagementGovernanceTasks.js](convertMonitoringManagementGovernanceTasks.md)

Works with:

- Monitoring and governance export JSON
- `src/data/tasks/cloudWatchTasks.js`
- `src/data/tasks/cloudTrailTasks.js`
- `src/data/tasks/configTasks.js`
- `src/data/tasks/organizationsTasks.js`

---

### `convertS3Tasks.js`

Documentation:

- [convertS3Tasks.js](convertS3Tasks.md)

Works with:

- S3 migration-export JSON
- `src/data/tasks/s3Tasks.js`

---

### `convertSecurityServiceTasks.js`

Documentation:

- [convertSecurityServiceTasks.js](convertSecurityServiceTasks.md)

Works with:

- Security-service migration-export JSON
- `src/data/tasks/kmsTasks.js`
- `src/data/tasks/secretsManagerTasks.js`
- `src/data/tasks/macieTasks.js`
- `src/data/tasks/guardDutyTasks.js`
- `src/data/tasks/cognitoTasks.js`

---

### `convertServerlessTasks.js`

Documentation:

- [convertServerlessTasks.js](convertServerlessTasks.md)

Works with:

- Serverless migration-export JSON
- `src/data/tasks/lambdaTasks.js`
- `src/data/tasks/apiGatewayTasks.js`
- `src/data/tasks/stepFunctionsTasks.js`
- `src/data/tasks/eventBridgeTasks.js`
- `src/data/tasks/sqsTasks.js`
- `src/data/tasks/snsTasks.js`

---

### `convertVpcTasks.js`

Documentation:

- [convertVpcTasks.js](convertVpcTasks.md)

Works with:

- VPC migration-export JSON
- `src/data/tasks/vpcTasks.js`

## Hands-on task importing

### `importHandsOnTasks.js`

Documentation:

- [importHandsOnTasks.js](importHandsOnTasks.md)

Works with:

- Local hands-on task data
- Supabase hands-on task tables
- `.env.local` for Supabase credentials

Main purpose:

- Imports the prepared hands-on task catalogue into Supabase

Before running it, confirm the exact input path inside the script.

## Checklist auditing and repair

### `createChecklistBaseline.js`

Documentation:

- [createChecklistBaseline.js](createChecklistBaseline.md)

Reads:

- The combined task catalogue
- `src/data/tasksData.js`
- Task modules under `src/data/tasks/`

Creates:

- A checklist baseline file configured inside the script

Main purpose:

- Records the current verification and cleanup checklist state before repairs

---

### `auditTaskChecklistContent.js`

Documentation:

- [auditTaskChecklistContent.js](auditTaskChecklistContent.md)

Reads:

- `src/data/tasksData.js`
- Task modules under `src/data/tasks/`

Changes:

- Nothing unless an output report is configured

Main purpose:

- Finds missing, empty, repeated, weak, or generic checklist text

---

### `applyTaskChecklistRepair.js`

Documentation:

- [applyTaskChecklistRepair.js](applyTaskChecklistRepair.md)

Reads:

- Task catalogue files under `src/data/tasks/`
- Repair data configured inside the script

Changes:

- Specific task module files under `src/data/tasks/`

Main purpose:

- Applies controlled checklist corrections to task source files

---

### `compareChecklistBaseline.js`

Documentation:

- [compareChecklistBaseline.js](compareChecklistBaseline.md)

Reads:

- The saved checklist baseline
- The current task catalogue

Main purpose:

- Compares task checklists before and after repair

Changes:

- No task source files

---

### `repairTaskChecklists.js`

Documentation:

- [repairTaskChecklists.js](repairTaskChecklists.md)

Reads:

- `src/data/tasksData.js`
- `INITIAL_SEED_TASKS`
- Task modules under `src/data/tasks/`

Contains mappings for:

- `src/data/tasks/s3Tasks.js`
- `src/data/tasks/ec2Tasks.js`
- `src/data/tasks/vpcTasks.js`
- `src/data/tasks/iamTasks.js`
- Database task modules
- Serverless task modules
- Container task modules
- Security task modules
- Migration task modules
- Monitoring task modules
- Route 53
- AWS Backup

Current limitation:

- It changes task objects in memory
- It does not currently write repaired content back to disk
- It is incomplete and should not be relied on for permanent repairs

## SQL and database utilities

### `generateSql.js`

Documentation:

- [generateSql.js](generateSql.md)

Works with:

- Local question or application data configured inside the script
- Generated SQL output file

Main purpose:

- Converts local data into SQL statements for database use

Before running it, confirm:

- Input filename
- Output filename
- Target database table
- Whether generated SQL is intended for local review or live execution

## Primary source and target folders

### Question-bank files

Usually stored under:

- `data/`

Important examples:

- `data/SAA-C03-question-bank-upgraded-250.json`
- `data/question-import.json`
- `data/saa-c03-question-export-corrected.json`
- `data/saa-c03-question-export.json`

### Backup files

Usually stored under:

- `data/backups/`

### Hands-on migration source files

Usually stored under:

- `migration_export/hands_on_tasks/`

Some conversion scripts may expect category or batch subfolders.

### Generated task modules

Stored under:

- `src/data/tasks/`

### Combined task catalogue

Loaded through:

- `src/data/tasksData.js`

### Exam and topic definitions

Stored in:

- `src/data/examData.js`

### Supabase credentials

Stored locally in:

- `.env.local`

Never commit this file.

## Supabase tables used by these scripts

Question-bank scripts commonly use:

- `exam_questions`
- `question_topics`

Hands-on task scripts may use:

- Hands-on task catalogue tables
- Task step tables
- Task validation tables
- User task progress tables

Check the individual script documentation before running an importer.

## Recommended safe question-bank workflow

1. Export the current live bank.
2. Keep a dated copy in `data/backups/`.
3. Edit or upgrade the local source JSON.
4. Run the validation scripts.
5. Run the quality-audit scripts.
6. Confirm the script is reading the correct source filename.
7. Run the replacement script with `--dry-run`.
8. Check question and topic-mapping counts.
9. Run the live replacement.
10. Export the live bank again.
11. Compare the live export with the intended source.

## Recommended safe hands-on task workflow

1. Confirm the migration-export input file.
2. Run the relevant conversion script.
3. Review the generated task module.
4. Check task IDs and slugs for duplicates.
5. Create a checklist baseline.
6. Run the checklist audit.
7. Apply controlled repairs.
8. Compare against the baseline.
9. Run tests.
10. Run the production build.

## Important safety rules

- Always confirm the hard-coded input filename before running a script.
- Do not assume a script automatically finds the newest file.
- A correctly named file containing the wrong data may still be processed.
- Always run dry-run mode when available.
- Back up Supabase before live writes.
- Keep the Supabase service-role key private.
- Never commit `.env.local`.
- Do not rename source files without updating the script.
- Do not move source files without updating the script.
- Review generated task text before accepting it.
- Run tests after changing task modules.
- Run the production build after changing application data.

Useful checks:

```bash
npm test
npm run build
```
