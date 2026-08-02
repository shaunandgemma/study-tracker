# convertDatabaseTasks.js

## Purpose

Converts legacy database hands-on tasks into the Study Tracker format.

## Location

`scripts/convertDatabaseTasks.js`

## When to use it

Run this when rebuilding RDS, Aurora, DynamoDB, ElastiCache and Redshift task files from the old AWS Tool export.

## Command

```bash
node scripts/convertDatabaseTasks.js
```

## Inputs

`E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/databases.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/databases-converted.json`
- `migration_work/hands_on_tasks/SAA/databases-review-required.json`
- `migration_work/hands_on_tasks/SAA/databases-seed.sql`
- `migration_work/hands_on_tasks/SAA/DATABASES_CONVERSION_REPORT.md`
- `src/data/tasks/rdsTasks.js`
- `src/data/tasks/auroraTasks.js`
- `src/data/tasks/dynamoDbTasks.js`
- `src/data/tasks/elasticacheTasks.js`
- `src/data/tasks/redshiftTasks.js`

## What it does

- Separates tasks by database service
- Sends DMS and migration tasks to review
- Cleans HTML and converts data into the app schema
- Assigns difficulty and estimated time
- Replaces unsafe root or AdministratorAccess guidance
- Prevents public database access using `0.0.0.0/0`
- Adds service-specific cost warnings
- Adds cleanup instructions
- Flags destructive CLI commands
- Removes non-SAA exam tips
- Checks for possible hardcoded credentials

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated database task files and reports.
- It relies on a fixed external Windows path.
- DMS tasks are quarantined rather than added to database modules.
- Review the generated SQL and quarantined records before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
