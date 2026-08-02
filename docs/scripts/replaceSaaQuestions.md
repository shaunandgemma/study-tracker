# replaceSaaQuestions.js

## Purpose

Safely replaces the complete current 250-question SAA-C03 bank in Supabase from the upgraded local JSON file.

## Location

`scripts/replaceSaaQuestions.js`

## When to use it

Use this when the complete reviewed 250-question SAA-C03 bank must replace the current live bank.

Always run dry-run mode first.

## Commands

Dry run:

```bash
node scripts/replaceSaaQuestions.js --dry-run
```

Apply replacement:

```bash
node scripts/replaceSaaQuestions.js
```

## Input

Reads:

- `data/SAA-C03-question-bank-upgraded-250.json`

The file must contain exactly 250 questions.

## Backup output

Creates or replaces:

- `data/backups/saa-c03-before-corrected-import.json`

The backup is exported from the live Supabase bank immediately before replacement.

## Environment variables

Reads Supabase settings from `.env.local`.

Required:

- `SUPABASE_URL` or `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The script does not fall back to the frontend publishable key.

## Supabase tables changed

- `exam_questions`
- `question_topics`

## What it validates

Before making changes, it checks:

- The source is a JSON array
- The source contains exactly 250 questions
- Question IDs are unique
- Source exam codes are either `SAA-C03` or `aws-saa-c03`
- All exam codes are normalised in memory to `aws-saa-c03`
- Difficulty is present
- Type is `single` or `multiple`
- Question text is not empty
- Single-answer questions have exactly four options
- Multiple-answer questions have five or six options
- Every answer option is a non-empty string
- Single-answer questions have a valid `correctAnswer`
- Single-answer questions have `correctAnswers` set to `null`
- Multiple-answer questions have `correctAnswer` set to `null`
- Multiple-answer questions have two or three unique indexes in `correctAnswers`
- Every correct-answer index is valid
- Explanations are not empty
- Every question has at least one topic
- Topic mappings contain no duplicates
- Topic values are non-empty strings
- The live Supabase bank contains exactly the same 250 IDs

## Database field conversion

The JSON structure is converted to Supabase columns.

For single-answer questions:

- `correct_answer` receives `correctAnswer`
- `correct_answers` becomes an array containing that one index

For multiple-answer questions:

- `correct_answer` receives the first value from `correctAnswers`
- `correct_answers` receives the complete array

This supports the existing database schema while preserving all correct answers.

## Dry-run behaviour

Dry-run mode:

- Validates the complete 250-question bank
- Normalises exam codes in memory
- Connects to Supabase
- Reads all existing SAA-C03 question IDs
- Confirms the exact 250-question ID set
- Reads the current topic mappings
- Reports how many rows would be changed
- Checks that the source JSON did not change during validation
- Creates no backup
- Makes no database changes

## Apply behaviour

Apply mode:

1. Reads and hashes the source JSON.
2. Validates all 250 questions.
3. Connects to Supabase using the service-role key.
4. Confirms the live bank contains the exact expected IDs.
5. Exports a fresh backup of the live bank.
6. Validates the backup ID set.
7. Rechecks the live ID set immediately before writing.
8. Upserts questions in batches of 50.
9. Deletes existing topic mappings for all 250 questions.
10. Inserts replacement topic mappings in batches of 500.
11. Confirms the final question ID set.
12. Confirms the exact final topic-mapping set.
13. Checks that the source JSON did not change during the operation.
14. Prints a final replacement report.

## Exam-code normalisation

The source may contain:

- `SAA-C03`
- `aws-saa-c03`

All records are normalised in memory to:

- `aws-saa-c03`

The source JSON file is not rewritten.

## File integrity protection

The script calculates a SHA-256 hash of the source file.

It checks that the file has not changed:

- During dry-run validation
- During the live replacement process

## Backup and rollback

Before live writes, the script exports the existing live question bank.

If a failure happens after writes begin, it attempts to restore:

- Original `exam_questions` rows
- Original `question_topics` mappings

The rollback uses the backup created immediately before replacement.

## Replacement report

The final report shows:

- Mode
- Validated question count
- Existing database count
- Updated question count
- Deleted topic-mapping count
- Inserted topic-mapping count
- Skipped count
- Failed count

Dry-run mode also shows the numbers that would be updated, deleted and inserted.

## Supabase changes

Live mode:

- Upserts 250 rows in `exam_questions`
- Deletes current topic mappings for those 250 IDs
- Inserts the replacement topic mappings

Dry-run mode makes no changes.

## Important limitations

- It is hard-coded for exactly 250 questions.
- The live bank must already contain exactly the same 250 IDs.
- It does not validate topic IDs against `src/data/examData.js`.
- The backup path is fixed and may be overwritten by a later run.
- The writes are not performed inside one native database transaction.
- Automatic rollback can still fail.
- Question rows are verified by ID count, but the script does not read back and compare every question field with the source.
- Topic mappings are read back and compared exactly.

## Safety notes

- Always run `--dry-run` first.
- Confirm the source file is the fully reviewed 250-question bank.
- Export an additional dated backup before major changes.
- Keep the generated backup until the live bank has been tested.
- Keep the Supabase service-role key private.
- Never commit `.env.local`.
- Do not use this script to add or remove question IDs.
- Do not run it against a database containing a different SAA-C03 question count.
- Check the final report for zero failures.

## Dependencies

- Node.js
- `fs`
- `path`
- `crypto`
- `url`
- `@supabase/supabase-js`
- `exportQuestionsToFile` from `scripts/exportQuestions.js`
- A valid Supabase project
- A valid Supabase service-role key
