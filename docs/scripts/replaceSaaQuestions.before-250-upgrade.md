# replaceSaaQuestions.before-250-upgrade.js

## Purpose

Safely replaces the complete legacy 150-question SAA-C03 bank in Supabase from a corrected local JSON file.

## Location

`scripts/replaceSaaQuestions.before-250-upgrade.js`

## When to use it

Use this only for the older 150-question bank workflow.

It should not be used for the current 250-question bank.

Always run dry-run mode first.

## Commands

Dry run:

```bash
node scripts/replaceSaaQuestions.before-250-upgrade.js --dry-run
```

Apply replacement:

```bash
node scripts/replaceSaaQuestions.before-250-upgrade.js
```

## Input

Reads:

- `data/saa-c03-question-export-corrected.json`

The file must contain exactly 150 questions.

## Backup output

Creates or replaces:

- `data/backups/saa-c03-before-corrected-import.json`

The backup is created from the live Supabase bank immediately before replacement.

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
- The source contains exactly 150 questions
- Question IDs are unique
- Source exam codes are either `SAA-C03` or `aws-saa-c03`
- All exam codes are normalised in memory to `aws-saa-c03`
- Difficulty exists
- Type is `single` or `multiple`
- Question text is not empty
- Single-answer questions have exactly four options
- Multiple-answer questions have five or six options
- All answer options are non-empty strings
- `correctAnswer` is a valid zero-based index
- `correctAnswers` contains unique valid indexes
- Single-answer fields agree with each other
- Multiple-answer questions have two or three correct indexes
- Explanations are not empty
- At least one topic exists
- Topic mappings are unique
- The live Supabase bank contains exactly the same 150 IDs

## Dry-run behaviour

Dry-run mode:

- Validates the entire corrected bank
- Normalises exam codes in memory
- Reads the existing live question IDs
- Reads existing topic mappings
- Confirms the exact 150-question ID set
- Calculates planned question and topic changes
- Checks that the source JSON did not change during validation
- Makes no backup
- Makes no Supabase changes

## Apply behaviour

Apply mode:

1. Validates the corrected 150-question bank.
2. Connects to Supabase with the service-role key.
3. Confirms the live ID set exactly matches the source.
4. Exports a fresh live backup.
5. Rechecks the live ID set immediately before writing.
6. Upserts questions in batches of 50.
7. Deletes existing topic mappings for the 150 IDs.
8. Inserts replacement mappings in batches of 500.
9. Verifies the final question ID set.
10. Verifies the exact topic-mapping set.
11. Confirms the source JSON did not change during the operation.
12. Prints a final import report.

## Exam-code normalisation

The source may contain:

- `SAA-C03`
- `aws-saa-c03`

All records are converted in memory to:

- `aws-saa-c03`

The source file itself is not rewritten.

## Backup and rollback

Before live writes, the script exports the current live question bank.

If replacement fails after writes begin, it attempts to restore:

- Original question rows
- Original topic mappings

The rollback uses the fresh backup created immediately before the replacement.

## File integrity protection

The script calculates a SHA-256 hash of the corrected JSON file.

It checks that the file has not changed:

- During dry-run validation
- During the live replacement operation

## Supabase changes

Live mode:

- Upserts 150 rows in `exam_questions`
- Deletes existing topic mappings for those IDs
- Inserts the corrected mappings

Dry-run mode makes no changes.

## Important limitations

- It is hard-coded for exactly 150 questions.
- It expects the live database to already contain the exact same 150 IDs.
- It does not validate topic IDs against `examData.js`.
- The backup path is fixed and can be overwritten by a later run.
- Database writes are not performed inside one native database transaction.
- Automatic rollback can still fail.
- It is retained only as the pre-250-upgrade replacement script.

## Safety notes

- Do not use this for the current 250-question bank.
- Always run `--dry-run` first.
- Export an additional dated backup before important changes.
- Keep the service-role key private.
- Never commit `.env.local`.
- Confirm the source contains the intended 150-question bank.
- Keep the backup until the replacement has been fully tested.
- Use `replaceSaaQuestions.js` for the current bank workflow.

## Dependencies

- Node.js
- `fs`
- `path`
- `crypto`
- `url`
- `@supabase/supabase-js`
- `exportQuestionsToFile` from `scripts/exportQuestions.js`
- A valid Supabase project and service-role key
