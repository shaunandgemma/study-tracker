# exportQuestions.js

## Purpose

Exports the current AWS SAA-C03 question bank from Supabase into a local JSON file.

## Location

`scripts/exportQuestions.js`

## When to use it

Run this when you need:

- A backup of the live SAA-C03 question bank
- A local JSON file for auditing or editing
- To confirm live question and topic-mapping counts
- To compare Supabase data with a replacement question file

## Command

```bash
node scripts/exportQuestions.js
```

## Default output

Creates or replaces:

- `data/saa-c03-question-export.json`

## Supabase tables read

- `exam_questions`
- `question_topics`

## Environment variables

The script checks `.env.local` and uses:

- `SUPABASE_URL` or `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY`

The service-role key is preferred when available.

## What it does

- Loads Supabase connection settings from `.env.local`
- Fetches questions matching `aws-saa-c03`
- Fetches topic mappings for those questions
- Rebuilds each question into the app JSON structure
- Supports single-answer and multiple-answer questions
- Supports options A through F
- Counts Select TWO and Select THREE questions
- Removes empty option fields
- Adds topic IDs to each question
- Sorts questions naturally by numeric ID
- Writes the formatted bank to JSON
- Prints an export summary

## Exported question structure

Each question contains:

- `id`
- `exam_code`
- `difficulty`
- `type`
- `question`
- `options`
- `correctAnswer`
- `correctAnswers`
- `explanation`
- `topics`

## Safety behaviour

If Supabase returns no questions, the script stops with an error.

This prevents an empty result from overwriting the existing export file.

## Supabase changes

None.

The script only reads from Supabase.

## Safety notes

- The output file is overwritten after a successful export.
- Keep `.env.local` private.
- Never commit the Supabase service-role key.
- Confirm the exported question count before using the file as a backup.
- A publishable key may be blocked by RLS if public read access is not allowed.
- Prefer the service-role key for a complete administrative export.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- `@supabase/supabase-js`
- A valid Supabase project URL and API key
