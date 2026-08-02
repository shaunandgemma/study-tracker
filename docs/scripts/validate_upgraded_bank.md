# validate_upgraded_bank.py

## Purpose

Validates the structure and key rules of the upgraded 250-question SAA-C03 question bank.

## Location

`scripts/validate_upgraded_bank.py`

## When to use it

Run this after creating or editing:

- `data/SAA-C03-question-bank-upgraded-250.json`

Use it before importing or replacing the live Supabase question bank.

## Command

```bash
python3 scripts/validate_upgraded_bank.py
```

## Input

Reads:

- `data/SAA-C03-question-bank-upgraded-250.json`

## Output

Prints:

- The file being validated
- A success message when every check passes
- An assertion error describing the first failed rule

Successful output:

```text
ALL VALIDATION CHECKS PASSED SUCCESSFULLY!
```

## What it validates

### Question count

Confirms the file contains exactly 250 questions.

### Question IDs

Confirms the IDs exactly match:

- `q-saa-1`
- Through to `q-saa-250`

It detects:

- Missing IDs
- Unexpected IDs
- Duplicate IDs indirectly through the exact set comparison

### Difficulty

Every question must use one of:

- `Easy`
- `Medium`
- `Hard`

### Answer options

Every question must:

- Have an options array
- Have at least four options
- Contain only non-empty option strings

### Explanations

Every question must have a non-empty explanation.

### Single-answer questions

A single-answer question must:

- Use `type: "single"`
- Have `correctAnswers` set to `null`
- Have a valid integer in `correctAnswer`
- Use a zero-based answer index within the options array

### Multiple-answer questions

A multiple-answer question must:

- Use `type: "multiple"`
- Have `correctAnswer` set to `null`
- Have two or three indexes in `correctAnswers`
- Contain only valid zero-based indexes
- Contain no duplicate correct-answer indexes

### Select instruction wording

Questions with two correct answers must include:

- `Select TWO`

Questions with three correct answers must include:

- `Select THREE`

The wording check is case-insensitive for the lowercase versions.

### Required explanation sections

These six named questions receive an additional explanation check:

- `q-saa-41`
- `q-saa-58`
- `q-saa-70`
- `q-saa-172`
- `q-saa-174`
- `q-saa-199`

Each must include:

- `Exam trigger:`
- `Exam trap:`
- `Memory hook:`

## Supabase changes

None.

This script only reads the local JSON file.

## Important limitations

- It stops at the first failed assertion.
- It does not produce a complete list of all errors.
- It does not validate `exam_code`.
- It does not validate topic mappings.
- It does not check whether topic IDs exist in `examData.js`.
- It does not require single-answer questions to have exactly four options.
- It only requires at least four options for all questions.
- It does not require multiple-answer questions to have exactly five or six options.
- It does not validate that question text is non-empty.
- It does not detect repeated answer text.
- It does not assess technical AWS accuracy.
- It does not assess distractor quality or answer-writing patterns.
- The six-question explanation-section check is hard-coded.

## Safety notes

- Run this before using `replaceSaaQuestions.js`.
- A successful result confirms schema rules only.
- A successful result does not prove that the questions are technically correct.
- Continue to run the separate quality and wording audit scripts.
- Keep a backup before replacing the live question bank.

## Dependencies

- Python 3
- Python standard-library `json` module
- The upgraded 250-question JSON file
