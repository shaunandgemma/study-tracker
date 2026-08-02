# repairTaskChecklists.js

## Purpose

Attempts to populate empty verification and cleanup checklist text across the hands-on task catalogue.

## Location

`scripts/repairTaskChecklists.js`

## Current status

This script is incomplete.

It updates tasks in memory, but it does not currently write the repaired task data back to the individual task module files.

Running it will therefore not permanently repair the source files.

## Command

```bash
node scripts/repairTaskChecklists.js
```

## Input

Imports the complete local task catalogue from:

- `src/data/tasksData.js`
- `INITIAL_SEED_TASKS`

## Intended outputs

The comments indicate that the script was intended to update individual task files under:

- `src/data/tasks/`

However, the file-writing section has not been implemented.

No output file is currently created.

## What it does

- Loops through every task in `INITIAL_SEED_TASKS`
- Finds verification checklist items with missing or empty text
- Generates replacement verification text
- Finds cleanup checklist items with missing or empty text
- Generates replacement cleanup text
- Tracks the number of repaired tasks
- Tracks populated verification items
- Tracks populated cleanup items
- Maps exported task collections to their task module filenames

## Service-specific checklist generation

The script creates tailored verification and cleanup text for:

- Amazon S3
- Amazon EC2
- Amazon VPC
- Amazon RDS
- Amazon Aurora
- Amazon DynamoDB
- AWS IAM

Tasks from other services receive general fallback text.

## Inspection-only tasks

The script treats these tasks as not creating AWS resources:

- `task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001`
- `task-saa-vpc-design-a-vpc-cidr-plan-001`

Their cleanup message says that no cleanup is required.

## Task module map

The script contains mappings for task modules including:

- S3
- EC2
- VPC
- IAM
- ELB
- Auto Scaling
- Databases
- Serverless services
- Containers
- Security services
- Migration services
- Monitoring and governance
- Kinesis
- Route 53
- AWS Backup

## Supabase changes

None.

The script does not connect to Supabase.

## Important limitations

- No repaired task modules are written to disk.
- No repair report is generated.
- No summary is printed to the terminal.
- `filesToModify` is created but never used.
- `taskFileMap` is created but never used to perform writes.
- Several declared variables and parameters are unused.
- The inspection keyword lists are declared but do not affect the result.
- Task detection relies partly on service names and task IDs.
- Generic generated text may not accurately describe every task.
- Running the script appears successful even though no files are changed.

## Safety notes

- Do not rely on this script as a completed repair tool.
- Use `applyTaskChecklistRepair.js` for the actual controlled checklist repair workflow.
- Create a checklist baseline before modifying task files.
- Audit generated checklist text for technical accuracy.
- Run the checklist comparison script after repairs.
- Create a Git commit or backup before changing task modules.

## Dependencies

- Node.js
- `fs`
- `path`
- `INITIAL_SEED_TASKS` from `src/data/tasksData.js`
