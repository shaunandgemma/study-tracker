# SAA-C03 Question Import Guide

## 1. Open the import file

Open:

```text
data/question-import.json
```

Add your new questions using this format:

```json
[
  {
    "id": "q-saa-22",
    "exam_code": "aws-saa-c03",
    "difficulty": "Medium",
    "type": "single",
    "question": "Question text here",
    "options": [
      "Answer A",
      "Answer B",
      "Answer C",
      "Answer D"
    ],
    "correctAnswer": 1,
    "explanation": "Explanation here",
    "topics": [
      "topic-s3",
      "topic-kms"
    ]
  }
]
```

## 2. Remember the answer numbering

`correctAnswer` is zero-based:

```text
0 = A
1 = B
2 = C
3 = D
```

## 3. Save the JSON file

Save:

```text
data/question-import.json
```

## 4. Open the project terminal

Make sure the terminal is inside:

```text
study-tracker
```

## 5. Run the importer

Run:

```bash
npm run import-questions
```

## 6. Check the result

A successful import should look similar to:

```text
Question Import Complete

Imported: 1
Skipped: 0
Failed: 0

Imported questions:
q-saa-22
```

## 7. Reload the app

Reload the AWS Study app.

The new questions should now be available in:

1. Full Mock mode
2. Targeted Topic Quiz mode

## Important Rules

1. Every question needs a unique ID.
2. Continue the numbering, for example `q-saa-22`, `q-saa-23`, `q-saa-24`.
3. Every question needs exactly 4 answers.
4. Every question needs at least 1 valid topic ID.
5. Existing question IDs are skipped rather than overwritten.
6. Invalid topic IDs are blocked.
7. Supabase remains the main question database.

## After Importing

You can clear the import file back to:

```json
[]
```

Then add the next batch of questions when needed.

## Quick Workflow

```text
Add questions to question-import.json
Then save the file
Then run npm run import-questions
Then check the import result
Then reload the app
```
