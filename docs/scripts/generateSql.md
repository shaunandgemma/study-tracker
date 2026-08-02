# generateSql.js

## Purpose

Generates a Supabase SQL script from the local SAA-C03 question-bank JSON export.

## Location

`scripts/generateSql.js`

## When to use it

Run this when you need to rebuild the SQL file used to create or update the SAA-C03 question bank in Supabase.

## Command

```bash
node scripts/generateSql.js
```

## Input

Reads:

- `data/saa-c03-question-export.json`

The input file must already exist.

## Output

Creates or replaces:

- `supabase/saa_c03_questions.sql`

## What it does

- Loads the local SAA-C03 question export
- Converts questions into PostgreSQL insert statements
- Supports four, five and six answer options
- Supports single-answer and multiple-answer questions
- Writes `correct_answers` as a PostgreSQL integer array
- Uses dollar-quoted strings for question text, options and explanations
- Escapes structural text such as IDs and exam codes
- Creates the `exam_questions` table when missing
- Adds missing multiple-answer columns to older deployments
- Creates the `question_topics` table
- Creates useful indexes
- Enables Row Level Security
- Creates public read policies
- Splits question inserts into fixed numeric batches
- Updates existing questions with `ON CONFLICT`
- Deletes existing SAA-C03 topic mappings
- Re-inserts the mappings from the JSON file
- Prints question, mapping and file-size totals

## Question batches

The script generates fixed batches for:

- Questions 1 to 25
- Questions 26 to 50
- Questions 51 to 75
- Questions 76 to 100
- Questions 101 to 150 in groups of five

## Supabase changes

The script itself does not connect to Supabase.

However, running the generated SQL will:

- Create or alter database tables
- Enable RLS
- Replace public read policies
- Insert or update questions
- Delete existing SAA-C03 topic mappings
- Recreate topic mappings from the JSON export

## Important limitation

The generated SQL header and comments describe an authoritative 150-question bank.

The batch definitions also stop at question 150.

Questions with numeric IDs above 150 are loaded from the JSON but are not included in the question insert batches.

Their topic mappings may still be added to the mapping section, which could cause foreign-key errors if those questions do not already exist in Supabase.

## Safety notes

- It overwrites `supabase/saa_c03_questions.sql`.
- Review the generated SQL before running it.
- The SQL deletes all existing SAA-C03 topic mappings before rebuilding them.
- Confirm the question count and highest question ID.
- Do not use this unchanged for a 250-question bank.
- Create a database backup before applying the SQL.

## Dependencies

- Node.js
- `fs`
- `path`
- `url`
- A valid `data/saa-c03-question-export.json` file
