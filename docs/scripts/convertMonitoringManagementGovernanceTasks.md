# convertMonitoringManagementGovernanceTasks.js

## Purpose

Converts legacy monitoring, logging and governance hands-on tasks into the Study Tracker format.

## Location

`scripts/convertMonitoringManagementGovernanceTasks.js`

## When to use it

Run this when rebuilding CloudWatch, CloudTrail, AWS Config and AWS Organizations task files.

## Command

```bash
node scripts/convertMonitoringManagementGovernanceTasks.js
```

## Inputs

- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/monitoring-logging.json`
- `migration_work/hands_on_tasks/SAA/iam-review-required.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/monitoring-management-governance-converted.json`
- `migration_work/hands_on_tasks/SAA/monitoring-management-governance-review-required.json`
- `migration_work/hands_on_tasks/SAA/monitoring-management-governance-seed.sql`
- `migration_work/hands_on_tasks/SAA/MONITORING_MANAGEMENT_GOVERNANCE_CONVERSION_REPORT.md`
- `src/data/tasks/cloudWatchTasks.js`
- `src/data/tasks/cloudTrailTasks.js`
- `src/data/tasks/configTasks.js`
- `src/data/tasks/organizationsTasks.js`

## What it does

- Removes duplicate source records
- Separates tasks by monitoring and governance service
- Resolves the quarantined IAM SCP task
- Cleans HTML and converts tasks into the app schema
- Assigns difficulty and estimated time
- Replaces unsafe root or AdministratorAccess guidance
- Adds CloudWatch memory-metric guidance
- Explains that AWS Config detects but does not prevent changes
- Explains that SCPs limit permissions but do not grant them
- Adds cost warnings, cleanup steps and destructive-command warnings
- Removes non-SAA exam tips
- Checks for possible hardcoded credentials

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated monitoring and governance task files.
- It reuses a task from the IAM review file.
- It relies on a fixed external Windows path.
- Review the generated SQL before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
