# convertSecurityServiceTasks.js

## Purpose

Converts legacy AWS security-service hands-on tasks into the Study Tracker format.

## Location

`scripts/convertSecurityServiceTasks.js`

## When to use it

Run this when rebuilding KMS, Secrets Manager, Macie, GuardDuty and Cognito task files.

## Command

```bash
node scripts/convertSecurityServiceTasks.js
```

## Inputs

- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/encryption-security.json`
- `migration_work/hands_on_tasks/SAA/iam-review-required.json`
- `migration_work/hands_on_tasks/SAA/serverless-review-required.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/security-services-converted.json`
- `migration_work/hands_on_tasks/SAA/security-services-review-required.json`
- `migration_work/hands_on_tasks/SAA/security-services-seed.sql`
- `migration_work/hands_on_tasks/SAA/SECURITY_SERVICES_CONVERSION_REPORT.md`
- `src/data/tasks/kmsTasks.js`
- `src/data/tasks/secretsManagerTasks.js`
- `src/data/tasks/macieTasks.js`
- `src/data/tasks/guardDutyTasks.js`
- `src/data/tasks/cognitoTasks.js`

## What it does

- Removes duplicate source records
- Separates tasks into security-service topics
- Resolves the quarantined IAM KMS task
- Resolves the quarantined Serverless Cognito task
- Cleans HTML and converts tasks into the app schema
- Assigns difficulty and estimated time
- Replaces unsafe root or AdministratorAccess guidance
- Adds irreversible KMS key-deletion warnings
- Adds service-specific cost warnings
- Adds cleanup steps when missing
- Flags destructive CLI commands
- Removes non-SAA exam tips
- Checks for possible hardcoded credentials

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated security task files.
- It reuses tasks from IAM and Serverless review files.
- KMS cleanup may schedule irreversible key deletion.
- It relies on a fixed external Windows path.
- Review the generated SQL and conversion report before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
