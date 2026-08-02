# convertEc2Tasks.js

## Purpose

Converts legacy EC2 hands-on tasks into the Study Tracker task format.

## Location

`scripts/convertEc2Tasks.js`

## When to use it

Run this when rebuilding EC2 task files from the old AWS Tool export.

## Command

```bash
node scripts/convertEc2Tasks.js
```

## Inputs

- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/ec2.json`
- `E:/code/AWS Tool/migration_export/hands_on_tasks/duplicate-groups.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/ec2-converted.json`
- `migration_work/hands_on_tasks/SAA/ec2-review-required.json`
- `migration_work/hands_on_tasks/SAA/ec2-seed.sql`
- `migration_work/hands_on_tasks/SAA/EC2_CONVERSION_REPORT.md`
- `src/data/tasks/ec2Tasks.js`

## What it does

- Cleans HTML and converts tasks into the app schema
- Assigns difficulty and estimated time
- Finds tasks that belong under VPC, Auto Scaling, ELB or RDS instead
- Replaces unsafe root or AdministratorAccess guidance
- Warns about open SSH or RDP access
- Flags destructive commands
- Adds Elastic IP cleanup steps
- Removes SOA-C02 and DVA-C02 exam tips
- Checks for hardcoded credentials and missing cleanup sections
- Sends unsafe or wrongly classified tasks to review

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated EC2 task files and reports.
- It relies on fixed external Windows paths.
- Review quarantined tasks before adding them elsewhere.
- Review the generated SQL before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder

