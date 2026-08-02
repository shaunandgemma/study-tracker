# audit_answer_option_quality.py

## Purpose

Audits answer options for patterns that may reveal the correct answer without needing AWS knowledge.

## Location

`scripts/audit_answer_option_quality.py`

## When to use it

Run this after exporting or changing the SAA-C03 question bank to check answer-option quality.

## Command

```bash
python3 scripts/audit_answer_option_quality.py
```

You can also provide a different input file:

```bash
python3 scripts/audit_answer_option_quality.py path/to/questions.json
```

## Inputs

Default input:

`data/saa-c03-question-export.json`

## Outputs

Creates:

- `data/audits/answer-option-quality-audit.csv`
- `data/audits/answer-option-quality-audit.json`
- `data/audits/answer-option-quality-summary.txt`

## What it checks

- Correct answers that are much longer than distractors
- Large length differences between options
- Correct answers that repeat more question wording
- Very short distractors
- Empty options
- Duplicate or near-identical options
- Missing or invalid correct-answer indexes
- Fewer than four answer options

## Risk levels

Questions are marked as:

- `CRITICAL`
- `HIGH`
- `MEDIUM`
- `LOW`
- `PASS`

## Supabase changes

None.

## Safety notes

This script only reads the question file and creates audit reports; it does not modify the question bank.

## Dependencies

- Python 3
- Standard Python libraries only
