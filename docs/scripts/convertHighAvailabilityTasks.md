# convertHighAvailabilityTasks.js

## Purpose

Converts legacy high-availability and disaster-recovery tasks into Route 53 and AWS Backup tasks for the Study Tracker.

## Location

`scripts/convertHighAvailabilityTasks.js`

## When to use it

Run this when rebuilding Route 53 failover and disaster-recovery task files from the old AWS Tool export.

## Command

```bash
node scripts/convertHighAvailabilityTasks.js
```

## Inputs

`E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/high-availability.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/high-availability-converted.json`
- `migration_work/hands_on_tasks/SAA/high-availability-review-required.json`
- `migration_work/hands_on_tasks/SAA/high-availability-seed.sql`
- `migration_work/hands_on_tasks/SAA/HIGH_AVAILABILITY_CONVERSION_REPORT.md`
- `src/data/tasks/route53Tasks.js`
- `src/data/tasks/awsBackupTasks.js`

## What it does

- Removes duplicate source records
- Creates a Route 53 failover and health-check task
- Creates a disaster-recovery strategy task covering pilot light and warm standby
- Sends overlapping ALB, Auto Scaling, SQS, SNS, ElastiCache and Aurora tasks to review
- Removes unsafe AdministratorAccess guidance
- Adds destructive-command warnings
- Explains Route 53 TTL and DNS caching
- Explains RTO, RPO and asynchronous replication limits
- Adds cleanup steps, exam tips and memory hooks

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites generated Route 53 and AWS Backup task files.
- It relies on a fixed external Windows path.
- Several source tasks are deliberately excluded because they duplicate existing tasks.
- Review the generated SQL before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
