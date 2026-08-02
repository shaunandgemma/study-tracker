# SAA / Security Services Hands-On Tasks Conversion Report

Generated: 2026-08-01T18:42:28.454Z

## Executive Summary

* **Source Batch File**: `hands_on_tasks/batches/SAA/encryption-security.json`
* **Total Batch Source Records**: 14 (7 unique source records, 7 duplicate records excluded)
* **Previously Quarantined Tasks Resolved**: 2 (IAM Task 19 $\rightarrow$ `topic-kms`; Serverless Task 12 $\rightarrow$ `topic-cognito`)
* **Total Integrated Tasks**: 9
  * `AWS KMS` (`topic-kms`): 5 (4 from batch + 1 from IAM review)
  * `AWS Secrets Manager` (`topic-secrets-manager`): 1
  * `Amazon Macie` (`topic-macie`): 1
  * `Amazon GuardDuty` (`topic-guardduty`): 1
  * `Amazon Cognito` (`topic-cognito`): 1 (From Serverless review)
* **Duplicates Excluded**: 7 (duplicate records 8-14 in source file)
* **Tasks Sent to Review**: 0
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 9
* **Tasks with Linked Flashcards**: 1

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Categorized security labs across 5 valid topic IDs (`topic-kms`, `topic-secrets-manager`, `topic-macie`, `topic-guardduty`, `topic-cognito`).
2. **Review Record Resolution**: Successfully resolved and integrated IAM Task 19 into `topic-kms` and Serverless Task 12 into `topic-cognito` without leaving duplicate live copies.
3. **KMS Key Policy & Deletion Warning**: Clarified KMS key policies as primary access control and added explicit irreversible-loss warnings to KMS key deletion cleanup.
4. **Step 1 Login Instruction Sanitization**: Replaced root user / broad `AdministratorAccess` instructions across all tasks with IAM user / lab role requirements.
5. **GuardDuty Detection Guidance**: Explicitly noted that GuardDuty detects threats and generates findings, but does NOT automatically block traffic by itself.
6. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for KMS keys, Secrets Manager storage/rotation, Macie inspection, GuardDuty monitoring, and Cognito active users.
7. **Complete Resource Cleanup**: Ensured teardown sequence for every security service (canceling rotation, deleting secrets with recovery window, deleting Macie jobs, archiving GuardDuty findings, and disabling detectors).
8. **Destructive Command Warnings**: Flagged commands like `schedule-key-deletion`, `delete-secret`, `delete-detector`, `delete-classification-job`, `delete-user-pool`.
9. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty | Duration | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-kms-envelope-encryption-key-policies-with-aws-kms-001` | `topic-kms` | Envelope Encryption & Key Policies with AWS KMS | Medium | 30 mins | No | Approved & Integrated |
| 2 | `task-saa-secrets-manager-automated-password-rotation-with-secrets-manager-vs-ssm-parameter-store-002` | `topic-secrets-manager` | Automated Password Rotation with Secrets Manager vs SSM Parameter Store | Medium | 30 mins | No | Approved & Integrated |
| 3 | `task-saa-kms-encrypted-s3-bucket-policies-sse-kms-cross-account-sharing-003` | `topic-kms` | Encrypted S3 Bucket Policies & SSE-KMS Cross-Account Sharing | Hard | 45 mins | No | Approved & Integrated |
| 4 | `task-saa-kms-encrypting-existing-unencrypted-ebs-volumes-amis-004` | `topic-kms` | Encrypting Existing Unencrypted EBS Volumes & AMIs | Hard | 45 mins | No | Approved & Integrated |
| 5 | `task-saa-kms-transport-layer-security-tls-ssl-with-acm-alb-005` | `topic-kms` | Transport Layer Security (TLS/SSL) with ACM & ALB | Medium | 30 mins | No | Approved & Integrated |
| 6 | `task-saa-macie-pii-scanning-sensitive-data-discovery-with-amazon-macie-006` | `topic-macie` | PII Scanning & Sensitive Data Discovery with Amazon Macie | Medium | 30 mins | No | Approved & Integrated |
| 7 | `task-saa-guardduty-intelligent-threat-detection-with-amazon-guardduty-auto-remediation-007` | `topic-guardduty` | Intelligent Threat Detection with Amazon GuardDuty & Auto-Remediation | Hard | 45 mins | No | Approved & Integrated |
| IAM-19 (Review) | `task-saa-kms-key-only-one-role-can-use-it-019` | `topic-kms` | KMS key: only one role can use it | Medium | 30 mins | Yes | Resolved & Integrated (From IAM Review) |
| Serverless-12 (Review) | `task-saa-cognito-serverless-security-012` | `topic-cognito` | Serverless Security | Medium | 30 mins | No | Resolved & Integrated (From Serverless Review) |

---

## Review Required / Quarantined Tasks

No tasks required quarantine. All 7 batch tasks and 2 resolved review tasks passed schema validation and technical safety checks.
