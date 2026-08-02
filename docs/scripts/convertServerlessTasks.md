# convertServerlessTasks.js

## Purpose

Converts legacy AWS serverless hands-on tasks into the Study Tracker format.

## Location

`scripts/convertServerlessTasks.js`

## When to use it

Run this when rebuilding Lambda, API Gateway, Step Functions, EventBridge, SQS and SNS task files.

## Command

```bash
node scripts/convertServerlessTasks.js
```

## Inputs

- `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/serverless.json`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/serverless-converted.json`
- `migration_work/hands_on_tasks/SAA/serverless-review-required.json`
- `migration_work/hands_on_tasks/SAA/serverless-seed.sql`
- `migration_work/hands_on_tasks/SAA/SERVERLESS_CONVERSION_REPORT.md`
- `src/data/tasks/lambdaTasks.js`
- `src/data/tasks/apiGatewayTasks.js`
- `src/data/tasks/stepFunctionsTasks.js`
- `src/data/tasks/eventBridgeTasks.js`
- `src/data/tasks/sqsTasks.js`
- `src/data/tasks/snsTasks.js`

## What it does

- Separates tasks into six serverless topics
- Cleans HTML and converts tasks into the app schema
- Assigns difficulty and estimated completion time
- Converts console and CLI instructions
- Replaces unsafe root or AdministratorAccess guidance
- Replaces personal email addresses in SNS instructions
- Adds service-specific cost warnings
- Adds cleanup steps when missing
- Flags destructive CLI commands
- Removes non-SAA exam tips
- Checks for possible hardcoded credentials
- Quarantines Task 11 for Kinesis or Data Firehose
- Quarantines Task 12 for Cognito
- Quarantines Task 13 because its DynamoDB task is already handled by the database converter

## Supabase changes

None directly.

It creates `serverless-seed.sql`, but it does not execute the SQL or connect to Supabase.

## Safety notes

- It overwrites all generated serverless task files.
- Three source tasks are deliberately excluded from the active serverless modules.
- Review `serverless-review-required.json` before deleting or moving quarantined tasks.
- It relies on a fixed external Windows source path.
- Review the generated SQL and conversion report before use.
- Create a Git commit or backup first.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- Access to the legacy AWS Tool export folder
