# createChecklistBaseline.js

## Purpose

Creates a baseline snapshot of all hands-on task verification and cleanup checklists.

## Location

`scripts/createChecklistBaseline.js`

## When to use it

Run this before changing task verification or cleanup content.

The baseline can later be compared against the updated task data to confirm that unrelated task content was not changed.

## Command

```bash
node scripts/createChecklistBaseline.js
```

## Inputs

Imports the current task catalogue from:

- `src/data/tasksData.js`
- `INITIAL_SEED_TASKS`

## Outputs

Creates or replaces:

- `migration_work/hands_on_tasks/checklist-baseline.json`

## What it records

For every task, it stores:

- Task ID
- Task slug
- Verification checklist length
- Verification item IDs and text
- Cleanup checklist length
- Cleanup item IDs and text
- A SHA-256 hash of all task content except verification and cleanup

It also records:

- The creation timestamp
- The total number of tasks

## What the hash is for

The `nonChecklistHash` helps detect whether task content outside the verification and cleanup sections changed.

This includes fields such as:

- Title
- Goal
- Steps
- Difficulty
- Cost warnings
- Exam tips
- Troubleshooting content

## Supabase changes

None.

The script only reads local task data and creates a local JSON file.

## Safety notes

- Running it again overwrites the previous baseline.
- Create the baseline before making checklist repairs.
- Keep the baseline unchanged until comparisons are complete.
- Commit or back up the baseline if it is needed as permanent evidence.

## Dependencies

- Node.js
- `fs`
- `path`
- `crypto`
- `INITIAL_SEED_TASKS` from `src/data/tasksData.js`
