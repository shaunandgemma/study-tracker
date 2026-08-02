# auditSaaExplanationQuality.py

## Purpose

Audits all 250 SAA-C03 question explanations for missing sections, weak wording, incorrect option coverage, and repeated generic phrases.

## Location

`scripts/auditSaaExplanationQuality.py`

## When to use it

Run this after changing question explanations to find entries that may still need manual review.

## Command

```bash
python3 scripts/auditSaaExplanationQuality.py
```

## Inputs

`data/SAA-C03-question-bank-upgraded-250.json`

## Outputs

- `data/SAA-C03-explanation-quality-audit-2026-07-30.txt`
- `data/SAA-C03-explanation-quality-audit-2026-07-30.json`
- A summary printed in the terminal

## What it checks

- Missing explanations
- Missing correct-answer, wrong-answer, exam-trigger, exam-trap, or memory-hook sections
- Correct options not explained individually
- Incorrect options not explained individually
- Select TWO or THREE wording mismatches
- Very short explanations
- Known generic template phrases

## Supabase changes

None.

## Safety notes

This script only reads the question bank and creates report files; it does not modify any questions.

## Dependencies

- Python 3
- Standard Python libraries only: `json`, `re`, `collections`, and `pathlib`
