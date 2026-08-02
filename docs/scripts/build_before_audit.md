# build_before_audit.py

## Purpose

Creates a baseline quality report for the SAA-C03 question bank before major upgrades.

## Location

`scripts/build_before_audit.py`

## When to use it

Run this before changing the bank so you have a record of the original question quality, balance and known problems.

## Command

```bash
python3 scripts/build_before_audit.py
```

## Inputs

`data/saa-c03-question-export.json`

## Outputs

Creates:

- `data/question-bank-quality-audit-before.json`
- `data/question-bank-quality-audit-before.md`

## What it checks

- Question type counts
- Difficulty counts
- Estimated domain balance
- Topic frequency
- Very short questions
- Very short answer options
- Overrepresented S3 questions
- Known weak or ambiguous questions
- Underrepresented AWS topics

## Important limitation

Some findings are hard-coded, including named weak questions, topic totals and underrepresented services, so the report may become outdated if the bank changes.

## Supabase changes

None.

## Safety notes

This script only reads the exported bank and creates audit files; it does not modify questions.

## Dependencies

- Python 3
- Standard Python `json` library

