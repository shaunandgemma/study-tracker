# compareChecklistBaseline.js

## Purpose

Checks repaired task checklists against a saved baseline to make sure only empty checklist text was changed.

## Location

`scripts/compareChecklistBaseline.js`

## When to use it

Run this after repairing task checklist content.

## Command

```bash
node scripts/compareChecklistBaseline.js
```

## Inputs

- `migration_work/hands_on_tasks/checklist-baseline.json`
- Current tasks from `src/data/tasksData.js`

## What it checks

- Total task count has not changed
- Task IDs and slugs still match
- Non-checklist fields were not changed
- Checklist array lengths and item IDs are unchanged
- Existing checklist text was preserved
- Previously empty checklist text was filled

## Outputs

Prints either a pass summary or detailed errors in the terminal.

## Supabase changes

None.

## Safety notes

This script only compares data and does not modify files.

## Dependencies

- Node.js
- `node:fs`
- `node:path`
- `node:crypto`
- A baseline created by `createChecklistBaseline.js`
