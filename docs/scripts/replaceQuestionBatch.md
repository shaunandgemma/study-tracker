# replaceQuestionBatch.js

## Purpose

Safely replaces exactly 10 existing SAA-C03 questions and their topic mappings in Supabase.

## Location

`scripts/replaceQuestionBatch.js`

## When to use it

Run this when a reviewed batch of 10 questions must replace existing live questions with the same IDs.

Always run dry-run mode first.

## Commands

Dry run:

```bash
node scripts/replaceQuestionBatch.js --dry-run
```

Apply the replacement:

```bash
node scripts/replaceQuestionBatch.js
```

## Input

Reads:

- `data/question-import.json`

The file must contain exactly 10 questions.

## Environment variables

Reads Supabase settings from `.env.local`.

Required:

- `SUPABASE_URL` or `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase tables changed

- `exam_questions`
- `question_topics`

## What it validates

Before making changes, it checks:

- The source contains exactly 10 questions
- Every question ID is unique
- Every question uses `aws-saa-c03`
- Difficulty is `Easy`, `Medium` or `Hard`
- Type is `single` or `multiple`
- Question text is not empty
- Single-answer questions have exactly four options
- Multiple-answer questions have five or six options
- All options are non-empty strings
- Correct-answer indexes are valid
- Multiple-answer indexes are unique
- Explanations are not empty
- At least one topic is assigned
- Topic mappings contain no duplicates
- Every topic exists in `src/data/examData.js`
- Every question ID already exists in Supabase

## Dry-run behaviour

Dry-run mode:

- Validates the complete source batch
- Connects to Supabase
- Confirms all 10 question IDs exist
- Reads the existing questions
- Reads their current topic mappings
- Shows how many questions and mappings would change
- Makes no database changes

## Apply behaviour

Apply mode:

1. Validates the batch.
2. Downloads the existing questions and topic mappings.
3. Creates a timestamped local backup.
4. Upserts the 10 replacement question rows.
5. Deletes the old topic mappings for those IDs.
6. Inserts the new topic mappings.
7. Reads the data back from Supabase.
8. Compares every stored field with the source.
9. Confirms the exact topic mappings.
10. Reports success only when verification passes.

## Backup output

Creates a timestamped backup under:

- `data/backups/question-batch-backup-<timestamp>.json`

The backup contains:

- Creation time
- Source filename
- Question IDs
- Original `exam_questions` rows
- Original `question_topics` rows

## Rollback behaviour

If a failure occurs after writes begin, the script attempts to:

- Restore the original question rows
- Delete the replacement topic mappings
- Restore the original topic mappings

If automatic rollback fails, it prints the local backup location for manual recovery.

## Replacement behaviour

This script only replaces questions whose IDs already exist.

It refuses to continue when:

- Any expected ID is missing
- The batch contains more or fewer than 10 questions
- Validation fails
- Topic IDs are invalid
- Supabase credentials are missing

## Supabase changes

Apply mode:

- Updates 10 rows in `exam_questions`
- Deletes their existing `question_topics` mappings
- Inserts the replacement topic mappings

Dry-run mode makes no database changes.

## Safety notes

- Always run `--dry-run` first.
- Confirm all 10 IDs are the intended questions.
- Review the backup path before continuing.
- The database operations are not performed as one native transaction.
- Automatic rollback reduces risk but could itself fail.
- Keep the generated backup until the replacement has been fully tested.
- The service-role key has elevated access and must remain private.
- Never commit `.env.local`.
- Do not use this script to add new question IDs.
- Export the live question bank before large or important replacements.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- `@supabase/supabase-js`
- `DEFAULT_EXAMS` from `src/data/examData.js`
- A valid Supabase project and service-role key
