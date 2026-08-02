# convertS3Tasks.js

## Purpose

Converts legacy Amazon S3 hands-on tasks into the Study Tracker task format.

## Location

`scripts/convertS3Tasks.js`

## When to use it

Run this when rebuilding the S3 hands-on task bank from the original AWS Tool export.

## Command

```bash
node scripts/convertS3Tasks.js
```

## Inputs

- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/s3.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/s3-converted.json`
- `migration_work/hands_on_tasks/SAA/s3-review-required.json`
- `migration_work/hands_on_tasks/SAA/s3-seed.sql`
- `migration_work/hands_on_tasks/SAA/S3_CONVERSION_REPORT.md`
- `src/data/tasks/s3Tasks.js`

## What it does

- Reads the legacy S3 task batch
- Cleans HTML and encoded characters
- Converts tasks into the Study Tracker schema
- Generates stable task, step and checklist IDs
- Assigns difficulty and estimated completion time
- Keeps Task 2 as the canonical S3 versioning task
- Converts console and CLI instructions
- Adds default verification and cleanup steps when missing
- Removes SOA-C02 and DVA-C02 exam tips
- Keeps or creates SAA-C03 exam tips
- Replaces unsafe root or AdministratorAccess login guidance
- Checks for hardcoded AWS credentials
- Sends unsafe or incomplete tasks to the review file

## Supabase changes

None directly.

The script generates `s3-seed.sql`, but it does not execute the SQL or connect to Supabase.

## Safety notes

- It overwrites `src/data/tasks/s3Tasks.js`.
- It overwrites all generated S3 migration files.
- Tasks without cleanup instructions are sent for review.
- It depends on a fixed Windows source path.
- Review the generated SQL and conversion report before importing anything.
- Create a Git commit or backup before running it.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool S3 batch
