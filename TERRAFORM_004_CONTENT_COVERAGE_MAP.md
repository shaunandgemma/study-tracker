# Terraform Associate 004 Content Coverage Map

This file records the local Study Tracker coverage of the 37 published Terraform Associate 004 checklist objectives.

## Current coverage

| Learning area | Coverage |
| --- | ---: |
| Knowledge Guide | 37 of 37 objectives |
| Prep Exam questions | 37 of 37 objectives |
| Follow Alongs | 28 of 37 objectives |
| Troubleshooting challenges | 5 of 37 objectives |

The Prep Exam contains 100 locally reviewed questions. Questions 51 through 100 explicitly map to every individual objective, ensuring complete question coverage rather than relying only on broad topic labels.

## Question distribution for questions 51–100

| Objective group | Questions |
| --- | ---: |
| Infrastructure as Code | 3 |
| Terraform Fundamentals | 4 |
| Core Terraform Workflow | 7 |
| Terraform Configuration | 12 |
| Terraform Modules | 6 |
| Terraform State Management | 7 |
| Maintain Infrastructure | 5 |
| HCP Terraform | 6 |

## Immediate content priorities

The question and Knowledge Guide layers now cover every objective. The next useful expansion is practical coverage:

1. Complete the remaining Follow Along objective gaps, including a dedicated HCP Terraform Follow Along where needed.
2. Add troubleshooting challenges for provider installation, backend locking, import, modules, HCP Terraform runs, and sensitive-data handling.
3. Continue checking published Follow Alongs against the exact objective mappings before creating duplicate material.

## Canonical source

The machine-readable map is maintained in:

`src/data/terraformCoverageMap.js`

The official checklist definitions and the complete question bank are connected through:

- `src/data/exams/terraformAssociateExam.js`
- `src/data/exams/terraformAssociateQuestions.js`

The current database migration is:

`supabase/migrations/20260830_expand_terraform_004_exam_questions_to_100.sql`
