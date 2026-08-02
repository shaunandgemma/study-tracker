# audit_distractor_and_wording.py

## Purpose

Checks the SAA-C03 question bank for repeated wording and large answer-length differences.

## Location

`scripts/audit_distractor_and_wording.py`

## When to use it

Run this after updating the question bank to spot repeated question endings, common explanation phrases, and weak option balance.

## Command

```bash
python3 scripts/audit_distractor_and_wording.py
```

## Inputs

`data/SAA-C03-question-bank-upgraded-250.json`

## Outputs

Prints results in the terminal, including:

- The most repeated question endings
- Counts of common explanation phrases
- The number of questions where the longest and shortest options differ by more than 80 characters

## What it checks

- Repeated question-stem wording
- Repeated explanation phrases
- Large answer-option length differences

## Supabase changes

None.

## Safety notes

This script only reads the question bank and prints an audit; it does not modify files.

## Dependencies

- Python 3
- Standard Python libraries: `json`, `re`, and `collections`
