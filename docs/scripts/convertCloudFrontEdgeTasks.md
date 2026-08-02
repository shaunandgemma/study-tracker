# convertCloudFrontEdgeTasks.js

## Purpose

Converts legacy CloudFront and Global Accelerator hands-on tasks into the Study Tracker task format.

## Location

`scripts/convertCloudFrontEdgeTasks.js`

## When to use it

Run this when rebuilding CloudFront and edge-service task files from the old AWS Tool export.

## Command

```bash
node scripts/convertCloudFrontEdgeTasks.js
```

## Inputs

`E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/cloud-front-edge.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/cloudfront-edge-converted.json`
- `migration_work/hands_on_tasks/SAA/cloudfront-edge-review-required.json`
- `migration_work/hands_on_tasks/SAA/cloudfront-edge-seed.sql`
- `migration_work/hands_on_tasks/SAA/CLOUDFRONT_EDGE_CONVERSION_REPORT.md`
- `src/data/tasks/cloudFrontTasks.js`
- `src/data/tasks/globalAcceleratorTasks.js`

## What it does

- Removes duplicate source records
- Converts tasks into the app schema
- Separates CloudFront and Global Accelerator tasks
- Cleans HTML
- Assigns difficulty and duration
- Replaces unsafe root or AdministratorAccess wording
- Changes legacy OAI references to OAC
- Adds cleanup instructions and cost warnings
- Flags destructive CLI commands
- Removes SOA-C02 and DVA-C02 exam tips
- Quarantines tasks containing possible credentials

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated task files and reports.
- It relies on a fixed external Windows path.
- Review the generated SQL before using it.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
