# perform_full_bank_upgrade.py

## Purpose

Builds an upgraded 250-question AWS SAA-C03 bank by applying targeted repairs, normalising question structure and generating audit reports.

## Location

`scripts/perform_full_bank_upgrade.py`

## When to use it

Run this when rebuilding the upgraded 250-question bank from the exported question bank and the early-question upgrade candidate list.

## Command

```bash
python3 scripts/perform_full_bank_upgrade.py
```

## Inputs

Reads:

- `data/saa-c03-question-export.json`
- `data/early-question-upgrade-candidates.json`

## Outputs

Creates or replaces:

- `data/SAA-C03-question-bank-upgraded-250.json`
- `data/mandatory-six-repair-comparison.md`
- `data/SAA-C03-question-bank-upgrade-report.json`

## What it does

- Loads the current exported question bank
- Loads the early-question upgrade candidate list
- Applies complete hand-written replacements to six named questions:
  - `q-saa-41`
  - `q-saa-58`
  - `q-saa-70`
  - `q-saa-172`
  - `q-saa-174`
  - `q-saa-199`
- Updates difficulty values for candidate questions
- Adds a generic structured explanation when a candidate lacks one
- Normalises missing or invalid difficulty values to `Medium`
- Normalises single-answer and multiple-answer question fields
- Writes the complete upgraded question bank
- Creates a comparison report for the six named repairs
- Creates a summary JSON report

## Named repairs

The six hand-written repairs cover:

- Ordered SNS FIFO and SQS FIFO fan-out
- CloudTrail organization trails with S3 Object Lock Compliance mode
- VPC Flow Logs delivered to S3
- Direct Connect with Transit VIF and Site-to-Site VPN backup
- Aurora Global Database cross-Region disaster recovery
- SQS FIFO ordering and five-minute deduplication

## Schema normalisation

For multiple-answer questions, the script:

- Sets `type` to `multiple`
- Sets `correctAnswer` to `null`
- Ensures `correctAnswers` is an array
- Defaults invalid or missing answer arrays to `[0, 1]`

For single-answer questions, the script:

- Sets `type` to `single`
- Sets `correctAnswers` to `null`
- Defaults invalid or missing `correctAnswer` values to `0`

## Supabase changes

None.

The script only reads and writes local files.

## Important limitations

- Candidate explanations are generated from a generic template.
- Generic distractor explanations do not explain each AWS mechanism in detail.
- Missing multiple-answer indexes default to `[0, 1]`, which may be technically wrong.
- Missing single-answer indexes default to `0`, which may also be wrong.
- The script does not validate whether repaired answers are technically correct.
- It does not check for duplicate IDs, duplicate options or invalid topic IDs.
- The printed success message mentions specific corrections but does not prove that every output passed a full audit.
- `concept_changed_questions` is created but never populated.

## Safety notes

- It overwrites the upgraded 250-question bank.
- It overwrites the mandatory-six comparison report.
- It overwrites the upgrade summary report.
- Back up the existing output files before running it.
- Audit all defaulted answer indexes before importing the result.
- Review generic candidate explanations before treating the bank as final.
- Run a separate structural and technical validator after generation.

## Dependencies

- Python 3
- Python `json`
- Python `os`
- A valid exported question bank
- A valid early-question candidate file
