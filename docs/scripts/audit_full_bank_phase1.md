# audit_full_bank_phase1.py

## Purpose

Runs a broad first-stage audit of the full 250-question SAA-C03 bank.

## Location

`scripts/audit_full_bank_phase1.py`

## When to use it

Run this before a major question-bank upgrade to find weak patterns, repeated scenarios, service imbalance, and answer-length bias.

## Command

```bash
python3 scripts/audit_full_bank_phase1.py
```

## Inputs

- `data/SAA-C03-question-bank-upgraded-250.json`
- `src/data/saaC03DomainMapping.js`

## Outputs

Creates:

`migration_work/saa-c03-phase1-audit-report.json`

It also prints a detailed summary in the terminal.

## What it checks

- Total single and multiple-answer questions
- Select TWO and Select THREE counts
- Domain balance
- Correct-answer length compared with distractors
- Questions where answer length may reveal the correct option
- Simple service-recognition questions
- Number of AWS services used in each solution
- Most frequently mentioned AWS services
- Repeated scenario families such as S3, WAF, SCPs, containers, databases, migration and disaster recovery

## Supabase changes

None.

## Safety notes

This script only reads local question files and creates an audit report; it does not modify the bank.

## Dependencies

- Python 3
- Standard Python libraries only
- The SAA-C03 domain mapping file must exist for domain counts
