# importHandsOnTasks.js

## Purpose

Audits the local hands-on task catalogue and safely imports changes into the Supabase `hands_on_tasks` table.

## Location

`scripts/importHandsOnTasks.js`

## When to use it

Run this when local hands-on tasks have changed and need to be compared with, or imported into, Supabase.

Always run dry-run mode first.

## Commands

Dry run:

```bash
node scripts/importHandsOnTasks.js
```

Apply changes:

```bash
node scripts/importHandsOnTasks.js --apply
```

## Inputs

Reads local tasks from:

- `src/data/tasksData.js`
- `INITIAL_SEED_TASKS`

Reads validation rules from:

- `src/services/taskService.js`

Reads Supabase settings from:

- `.env.local`

## Required environment variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Supabase table used

- `hands_on_tasks`

## What dry-run mode does

- Validates every local task against the task schema
- Checks required database fields
- Checks task status values
- Checks for duplicate task IDs
- Checks for duplicate slugs
- Downloads the current live task table
- Creates a backup of the live rows
- Compares local and live tasks
- Calculates inserts, updates and unchanged rows
- Detects live slug conflicts
- Writes a dry-run report
- Makes no database changes

## What apply mode does

Apply mode performs all dry-run checks, then:

- Stops if slug conflicts exist
- Upserts new and changed tasks
- Processes writes in batches of 10
- Adds a fresh `updated_at` value
- Downloads the table again
- Verifies that no inserts or updates remain
- Tests anonymous read access using the publishable key
- Writes a post-import verification report
- Fails if verification does not match expectations

## Backups and reports

Creates timestamped backups under:

- `data/backups/hands-on-tasks/`

Creates dry-run or apply reports under:

- `migration_work/hands_on_tasks/SAA/`

Creates an additional verification report after an applied import.

## Project protection

The script only permits the configured Supabase project reference:

- `mbouckqylgarxrmtxego`

It refuses to continue when the Supabase URL points to another project.

## How tasks are compared

Task objects are converted into database rows and then sorted into a stable JSON representation.

This prevents property order from causing false differences.

Tasks are classified as:

- Insert
- Update
- Unchanged
- Conflict

## Supabase changes

Dry-run mode makes no changes.

Apply mode inserts or updates rows in:

- `hands_on_tasks`

It does not delete tasks that exist only in Supabase.

## Safety notes

- Always run dry-run mode before `--apply`.
- Inspect the generated report before importing.
- A live backup is created before every run.
- The service-role key has elevated access and must remain private.
- Never commit `.env.local`.
- Duplicate IDs, duplicate slugs or invalid tasks stop the import.
- Live slug conflicts stop apply mode.
- The script does not remove old live rows automatically.
- Confirm the project reference before changing it.

## Dependencies

- Node.js with built-in `fetch`
- `fs/promises`
- `path`
- `url`
- `INITIAL_SEED_TASKS`
- `validateTaskSchema`
- A valid Supabase project and credentials
