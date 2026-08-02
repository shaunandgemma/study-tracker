# applyTaskChecklistRepair.js

## Purpose

Repairs empty verification and cleanup checklist text in AWS hands-on task files.

## Location

`scripts/applyTaskChecklistRepair.js`

## When to use it

Use this when task checklist entries exist but their `text` fields are empty.

## Command

```bash
node scripts/applyTaskChecklistRepair.js
```

## Inputs

- Task files inside `src/data/tasks/`
- Task data imported from `src/data/tasksData.js`
- Existing `verification` and `cleanup` arrays

## Outputs

The script updates the task files directly and prints a repair summary showing:

- Modules modified
- Tasks repaired
- Verification entries populated
- Cleanup entries populated

## Supabase changes

None directly; it only changes local JavaScript task files.

## Safety notes

- It overwrites modified task files.
- It only fills empty checklist text.
- Existing non-empty checklist text is preserved.
- Create a Git commit or backup before running it.

## Dependencies

- Node.js
- `node:fs`
- `node:path`
- Task modules inside `src/data/tasks/`
