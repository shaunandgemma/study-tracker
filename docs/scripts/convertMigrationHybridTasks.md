# convertMigrationHybridTasks.js

## Purpose

Converts legacy migration and hybrid-connectivity hands-on tasks into the Study Tracker format.

## Location

`scripts/convertMigrationHybridTasks.js`

## When to use it

Run this when rebuilding MGN, DMS, Snow Family, Storage Gateway, DataSync, VPN and Direct Connect task files.

## Command

```bash
node scripts/convertMigrationHybridTasks.js
```

## Inputs

- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/migration-tools.json`
- `migration_work/hands_on_tasks/SAA/vpc-review-required.json`
- `migration_work/hands_on_tasks/SAA/databases-review-required.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/migration-hybrid-converted.json`
- `migration_work/hands_on_tasks/SAA/migration-hybrid-review-required.json`
- `migration_work/hands_on_tasks/SAA/migration-hybrid-seed.sql`
- `migration_work/hands_on_tasks/SAA/MIGRATION_HYBRID_CONVERSION_REPORT.md`
- `src/data/tasks/mgnTasks.js`
- `src/data/tasks/dmsTasks.js`
- `src/data/tasks/snowFamilyTasks.js`
- `src/data/tasks/storageGatewayTasks.js`
- `src/data/tasks/dataSyncTasks.js`
- `src/data/tasks/siteToSiteVpnTasks.js`
- `src/data/tasks/directConnectTasks.js`

## What it does

- Removes duplicate source records
- Separates tasks into seven migration and hybrid topics
- Resolves quarantined VPN, Direct Connect and DMS tasks
- Cleans HTML and converts data into the app schema
- Assigns difficulty and estimated time
- Replaces unsafe root or AdministratorAccess guidance
- Adds Direct Connect encryption guidance
- Adds service-specific cost warnings and cleanup steps
- Flags destructive CLI commands
- Removes non-SAA exam tips
- Checks for possible hardcoded credentials

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated migration and hybrid task files.
- It changes and reuses tasks from VPC and database review files.
- It relies on a fixed external Windows path.
- Review the generated SQL before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
