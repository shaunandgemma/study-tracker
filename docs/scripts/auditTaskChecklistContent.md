# auditTaskChecklistContent.js

## Purpose

Audits all hands-on tasks to find empty or partly completed verification and cleanup checklist entries.

## Location

`scripts/auditTaskChecklistContent.js`

## When to use it

Run this before repairing task checklists to see which tasks have missing checklist text.

## Command

```bash
node scripts/auditTaskChecklistContent.js
```

## Inputs

- `INITIAL_SEED_TASKS` from `src/data/tasksData.js`
- All task verification and cleanup arrays

## Outputs

Creates:

`migration_work/hands_on_tasks/checklist-content-audit.json`

It also prints totals and affected task counts in the terminal.

## What it checks

- Confirms exactly 211 tasks exist
- Counts verification and cleanup entries
- Finds empty checklist text
- Finds tasks with mixed empty and completed entries
- Checks totals for calculation errors
- Includes example tasks for S3, EC2, VPC, RDS and DynamoDB

## Supabase changes

None.

## Safety notes

This script only reads task data and creates an audit report; it does not change task files.

## Dependencies

- Node.js
- `node:fs`
- `node:path`
- `src/data/tasksData.js`
