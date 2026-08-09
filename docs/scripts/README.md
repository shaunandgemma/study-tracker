# Script Documentation

This folder documents the active question-bank and database utility scripts in
`scripts/` plus a small number of retained historical question-bank tools under
`scripts/archive/`.

The retired Hands On catalogue importer, converters and checklist repair tools
were removed in Step 62. Their source and documentation are preserved outside the
application repository in `62_HANDS_ON_REFERENCE_ARCHIVE.zip`.

## Active question importing and exporting

- `exportQuestions.js` — exports the hosted question bank.
- `importQuestions.js` — imports reviewed question data into Supabase.
- `replaceQuestionBatch.js` — replaces a controlled ten-question batch.
- `replaceSaaQuestions.js` — replaces the reviewed SAA-C03 question bank.

Read the matching Markdown file in this folder before using any of these tools.
Always confirm the input file, target table, dry-run behaviour and backup path.

## Active question-bank auditing

- `audit_answer_option_quality.py`
- `audit_distractor_and_wording.py`
- `audit_full_bank_phase1.py`
- `perform_full_bank_upgrade.py`
- `validate_upgraded_bank.py`

These tools work only with exam-question content. They do not create Follow
Alongs and do not use the retired Hands On catalogue.

## Retained historical question-bank tools

The following older question-bank tools remain under `scripts/archive/` because
they are unrelated to the Hands On retirement:

- `auditSaaExplanationQuality.py`
- `build_before_audit.py`
- `build_upgrade_candidates.py`
- `replaceSaaQuestions.before-250-upgrade.js`

Their matching documentation remains in this folder.

## SQL utility

`generateSql.js` creates SQL from the local input configured inside the script.
Confirm the source file and destination table before running it.

## Safety rules

1. Never commit `.env.local` or a Supabase service-role key.
2. Confirm every hard-coded input and output path before running a script.
3. Use dry-run mode whenever it is available.
4. Create a current backup before a live question-bank replacement.
5. Verify record counts and identifiers before and after any import.
6. Run `npm test`, `npm run lint` and `npm run build` after changes.

## Follow Along creation

The Author programme is the only supported Follow Along creation route. No script
in this repository should recreate the retired Generator or Hands On workflow.
