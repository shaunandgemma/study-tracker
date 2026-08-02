# build_upgrade_candidates.py

## Purpose

Finds up to 45 early SAA-C03 questions that may need replacing or upgrading.

## Location

`scripts/build_upgrade_candidates.py`

## When to use it

Run this when choosing weak questions from `q-saa-1` to `q-saa-150` for a planned upgrade batch.

## Command

```bash
python3 scripts/build_upgrade_candidates.py
```

## Inputs

`data/saa-c03-question-export.json`

## Outputs

Creates:

- `data/early-question-upgrade-candidates.json`
- `data/early-question-upgrade-candidates.md`

## What it checks

- Invalid `associate` difficulty labels
- Too many S3 questions
- Short or simple question scenarios
- Short explanations
- Priority level for replacement

## How recommendations are chosen

The script assigns replacement topics and difficulty using the question number, so these suggestions are automatic rather than based on a full technical review.

## Supabase changes

None.

## Safety notes

This script only reads the question export and creates candidate reports; it does not modify the question bank.

## Dependencies

- Python 3
- Standard Python `json` library
