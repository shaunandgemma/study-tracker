# convertVpcTasks.js

## Purpose

Converts legacy Amazon VPC hands-on tasks into the Study Tracker format.

## Location

`scripts/convertVpcTasks.js`

## When to use it

Run this when rebuilding the VPC task bank from the original AWS Tool export.

## Command

```bash
node scripts/convertVpcTasks.js
```

## Inputs

- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/vpc.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/vpc-converted.json`
- `migration_work/hands_on_tasks/SAA/vpc-review-required.json`
- `migration_work/hands_on_tasks/SAA/vpc-seed.sql`
- `migration_work/hands_on_tasks/SAA/VPC_CONVERSION_REPORT.md`
- `src/data/tasks/vpcTasks.js`

## What it does

- Reads the legacy VPC task batch
- Cleans HTML and converts tasks into the app schema
- Assigns difficulty and estimated completion time
- Converts console and CLI instructions
- Adds default verification and cleanup steps
- Replaces unsafe root or AdministratorAccess guidance
- Adds warnings for unrestricted SSH or RDP access
- Adds NAT Gateway cost and teardown guidance
- Adds Elastic IP release instructions
- Flags destructive VPC CLI commands
- Removes non-SAA exam tips
- Checks for possible hardcoded credentials
- Sends tasks to review when their main objective belongs to another topic

## Other topics it detects

Tasks may be moved to review when they primarily belong to:

- EC2 Auto Scaling
- Elastic Load Balancing
- RDS or Aurora
- Migration or hybrid networking
- Transit Gateway

## Supabase changes

None directly.

It creates `vpc-seed.sql`, but it does not execute the SQL or connect to Supabase.

## Safety notes

- It overwrites `src/data/tasks/vpcTasks.js`.
- It overwrites all generated VPC migration files.
- Tasks belonging to other topics are excluded from the active VPC module.
- NAT Gateways and Elastic IPs can continue generating charges until deleted.
- It relies on a fixed external Windows source path.
- Review the generated SQL and conversion report before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool VPC batch
