# convertIamTasks.js

## Purpose

Converts legacy IAM hands-on tasks into the Study Tracker task format.

## Location

`scripts/convertIamTasks.js`

## When to use it

Run this when rebuilding IAM task files from the old AWS Tool export.

## Command

```bash
node scripts/convertIamTasks.js
```

## Inputs

`E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/iam.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/iam-converted.json`
- `migration_work/hands_on_tasks/SAA/iam-review-required.json`
- `migration_work/hands_on_tasks/SAA/iam-seed.sql`
- `migration_work/hands_on_tasks/SAA/IAM_CONVERSION_REPORT.md`
- `src/data/tasks/iamTasks.js`

## What it does

- Cleans HTML and converts tasks into the app schema
- Assigns difficulty and estimated time
- Finds tasks that belong under KMS, Organizations, Cognito or SSO instead
- Replaces unsafe root or AdministratorAccess guidance
- Removes empty cleanup items
- Adds destructive-command warnings
- Checks for hardcoded credentials
- Adds default verification and cleanup content
- Removes SOA-C02 and DVA-C02 exam tips
- Sends unsafe or wrongly classified tasks to review

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated IAM task files and reports.
- It relies on a fixed external Windows path.
- Review quarantined tasks before moving them to another topic.
- Review the generated SQL before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
