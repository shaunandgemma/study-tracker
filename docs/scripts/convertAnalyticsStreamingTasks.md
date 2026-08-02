# convertAnalyticsStreamingTasks.js

## Purpose

Converts and repairs the quarantined Amazon Data Firehose hands-on task, then adds it to the app as a Kinesis task.

## Location

`scripts/convertAnalyticsStreamingTasks.js`

## When to use it

Run this when rebuilding the Analytics and Streaming task files or restoring the Data Firehose task from the serverless review file.

## Command

```bash
node scripts/convertAnalyticsStreamingTasks.js
```

## Inputs

- `migration_work/hands_on_tasks/SAA/serverless-review-required.json`
- The external legacy batch folder:
  `E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/SAA/analytics-streaming-converted.json`
- `migration_work/hands_on_tasks/SAA/analytics-streaming-review-required.json`
- `migration_work/hands_on_tasks/SAA/analytics-streaming-seed.sql`
- `migration_work/hands_on_tasks/SAA/ANALYTICS_STREAMING_CONVERSION_REPORT.md`
- `src/data/tasks/kinesisTasks.js`

## What it changes

- Moves the task from Lambda to Kinesis
- Renames it as an Amazon Data Firehose task
- Fixes the ID, slug, title, topic and tags
- Removes unsafe AdministratorAccess guidance
- Improves CLI placeholders and warnings
- Replaces verification, cleanup, exam tips and memory hooks
- Sets the Region to `eu-west-2`
- Sets difficulty to `Medium`

## Supabase changes

None directly.

The generated SQL file is only prepared for review and is not executed.

## Safety notes

- It overwrites the generated Kinesis task module and migration output files.
- It depends on a fixed external Windows path.
- The generated SQL includes a warning not to run it directly in production.
- Create a Git commit or backup before running it.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- The serverless review JSON file
- Access to the legacy AWS Tool export folder
