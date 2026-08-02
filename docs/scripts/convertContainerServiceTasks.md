# convertContainerServiceTasks.js

## Purpose

Converts legacy container-service hands-on tasks into the Study Tracker format.

## Location

`scripts/convertContainerServiceTasks.js`

## When to use it

Run this when rebuilding ECR, Fargate and ECS task files from the old AWS Tool export.

## Command

```bash
node scripts/convertContainerServiceTasks.js
```

## Inputs

`E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/container-services.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/container-services-converted.json`
- `migration_work/hands_on_tasks/SAA/container-services-review-required.json`
- `migration_work/hands_on_tasks/SAA/container-services-seed.sql`
- `migration_work/hands_on_tasks/SAA/CONTAINER_SERVICES_CONVERSION_REPORT.md`
- `src/data/tasks/ecrTasks.js`
- `src/data/tasks/fargateTasks.js`
- `src/data/tasks/ecsTasks.js`

## What it does

- Removes duplicate source records
- Separates ECR, Fargate and ECS tasks
- Quarantines App Runner tasks for review
- Cleans HTML and converts data into the app schema
- Assigns difficulty and estimated time
- Replaces unsafe root or AdministratorAccess guidance
- Updates old ECR login commands
- Adds cost warnings and cleanup steps
- Flags destructive CLI commands
- Removes non-SAA exam tips
- Checks for possible hardcoded credentials

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated task files and reports.
- It uses a fixed external Windows path.
- App Runner tasks are not added to the live task modules.
- Review the generated SQL and quarantined records before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
