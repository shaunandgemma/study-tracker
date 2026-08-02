# convertLoadBalancingAutoScalingTasks.js

## Purpose

Converts legacy Elastic Load Balancing and EC2 Auto Scaling hands-on tasks into the Study Tracker format.

## Location

`scripts/convertLoadBalancingAutoScalingTasks.js`

## When to use it

Run this when rebuilding ELB and Auto Scaling task files from the old AWS Tool export.

## Command

```bash
node scripts/convertLoadBalancingAutoScalingTasks.js
```

## Inputs

- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/load-balancing-auto-scaling.json`
- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/ec2.json`
- `migration_work/hands_on_tasks/SAA/ec2-review-required.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/load-balancing-auto-scaling-converted.json`
- `migration_work/hands_on_tasks/SAA/load-balancing-auto-scaling-review-required.json`
- `migration_work/hands_on_tasks/SAA/load-balancing-auto-scaling-seed.sql`
- `migration_work/hands_on_tasks/SAA/LOAD_BALANCING_AUTO_SCALING_CONVERSION_REPORT.md`
- `src/data/tasks/elbTasks.js`
- `src/data/tasks/autoScalingTasks.js`

It also clears:

- `migration_work/hands_on_tasks/SAA/ec2-review-required.json`

## What it does

- Separates tasks into ELB and Auto Scaling topics
- Converts task data into the app schema
- Resolves EC2 tasks 9 and 26 from quarantine
- Cleans HTML
- Assigns difficulty and estimated time
- Replaces unsafe root or AdministratorAccess guidance
- Adds cost warnings and cleanup steps
- Flags destructive CLI commands
- Removes non-SAA exam tips
- Checks for possible hardcoded credentials

## Supabase changes

None directly.

It creates a SQL seed file but does not execute it.

## Safety notes

- It overwrites ELB and Auto Scaling task files.
- It clears the EC2 review file after resolving two tasks.
- It relies on fixed external Windows paths.
- Review the generated SQL before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
