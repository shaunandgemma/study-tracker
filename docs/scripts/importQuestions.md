# importQuestions.js

## Purpose

Validates questions from a local JSON file and imports new SAA-C03 questions into Supabase.

## Location

`scripts/importQuestions.js`

## When to use it

Run this when adding new questions to the live question bank without replacing existing questions.

## Command

```bash
node scripts/importQuestions.js
```

## Input

Reads:

- `data/question-import.json`

The file must contain a JSON array of question objects.

## Environment variables

Reads Supabase settings from `.env.local`.

Required for uploading:

- `SUPABASE_URL` or `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Without the service-role key, the script performs validation only and does not upload anything.

## Supabase tables changed

- `exam_questions`
- `question_topics`

## What it validates

For every question, it checks:

- A valid string ID exists
- `exam_code` exists
- Difficulty exists
- Type is `single` or `multiple`
- Question text is not empty
- Options are valid non-empty strings
- Single-answer questions have exactly four options
- Multiple-answer questions have five or six options
- Single-answer indexes are valid
- Multiple-answer questions contain two or three unique correct indexes
- Explanation text exists
- At least one topic is provided
- Every topic exists in the SAA-C03 topic list from `src/data/examData.js`

The entire import stops if any local validation error is found.

## What it does

- Loads valid SAA-C03 topic IDs from `DEFAULT_EXAMS`
- Reads and parses `data/question-import.json`
- Validates the full question batch before connecting to Supabase
- Checks whether each question ID already exists
- Skips existing question IDs
- Inserts new questions into `exam_questions`
- Inserts topic mappings into `question_topics`
- Supports options A through F
- Supports Select TWO and Select THREE questions
- Prints imported, skipped and failed totals

## Duplicate behaviour

The script checks duplicates using the question ID.

When an ID already exists in Supabase, that question is skipped.

It does not update or replace existing questions.

## Rollback behaviour

The question row is inserted before its topic mappings.

If topic mapping insertion fails, the script deletes the newly inserted question row.

This prevents a question from remaining without its topic mappings.

## Supabase changes

For each new question, it inserts:

- One row into `exam_questions`
- One or more rows into `question_topics`

It does not modify existing question rows.

## Safety notes

- Review `data/question-import.json` before running the script.
- Existing IDs are skipped rather than overwritten.
- One invalid local question stops the complete import before any writes occur.
- Database failures affecting one question do not stop the remaining questions from being attempted.
- The service-role key has elevated access and must remain private.
- Never commit `.env.local`.
- Back up the live question bank before importing a large batch.
- This is not a full database transaction, but it performs a manual rollback when topic insertion fails.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- `@supabase/supabase-js`
- `DEFAULT_EXAMS` from `src/data/examData.js`
- A valid Supabase project and service-role key
