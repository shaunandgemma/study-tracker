# SAA / IAM Hands-On Tasks Batch Conversion Report

Generated: 2026-08-01T18:12:09.041Z

## Executive Summary

* **Total IAM Source Records**: 25
* **Eligible Records**: 25 (all marked `needs-minor-source-cleanup`)
* **Converted & Approved**: 22
* **Integrated into Application**: 22 (in `src/data/tasks/iamTasks.js`)
* **Duplicates Excluded**: 0
* **Review Required / Flagged**: 3
* **Recommended for Another Topic**: 3
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 25
* **Tasks with Linked Flashcards**: 25

---

## Technical & Security Corrections Applied

1. **Step 1 Login Instruction Sanitization**: Sanitized Step 1 instructions across all tasks to specify IAM user or lab role with IAM permissions instead of root user / broad AdministratorAccess.
2. **Zero-Cost Service Clarification**: Explicitly clarified that AWS IAM is a zero-cost global service. No AWS charges are incurred for IAM identity or policy management.
3. **Destructive Commands Warning**: Flagged destructive commands (`delete-user`, `delete-role`, `delete-policy`, `delete-access-key`, `delete-login-profile`, `detach-user-policy`, `detach-role-policy`, `remove-user-from-group`).
4. **Cleanup Teardown Order**: Ensured proper deletion sequence (detach policies $\rightarrow$ remove users from groups $\rightarrow$ delete access keys/login profiles $\rightarrow$ delete identity).
5. **Obsolete Exam Tips Filtered**: Filtered out SOA-C02 and DVA-C02 specific exam tips; retained SAA-C03 exam tips.
6. **HTML Sanitization**: Converted all HTML tags and decoded HTML entities into plain text.

---

## Task Conversion Audit Table

| Source ID | Task ID | Title | Difficulty (Inferred) | Duration (Inferred) | Modes | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001` | Create an IAM user with no permissions and test listing S3 | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 2 | `task-saa-iam-attach-amazons3readonlyaccess-and-re-test-002` | Attach AmazonS3ReadOnlyAccess and re-test | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 3 | `task-saa-iam-custom-identity-based-policy-for-one-s3-bucket-003` | Custom identity-based policy for one S3 bucket | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 4 | `task-saa-iam-add-an-explicit-deny-statement-and-confirm-it-overrides-allow-004` | Add an explicit Deny statement and confirm it overrides Allow | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 5 | `task-saa-iam-create-an-ec2-role-to-read-one-s3-bucket-005` | Create an EC2 role to read one S3 bucket | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 6 | `task-saa-iam-launch-ec2-with-an-instance-profile-and-verify-imds-credentials-006` | Launch EC2 with an instance profile and verify IMDS credentials | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 7 | `task-saa-iam-update-an-ec2-role-policy-and-verify-permissions-change-without-reboot-007` | Update an EC2 role policy and verify permissions change without reboot | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 8 | `task-saa-iam-create-a-permissions-boundary-and-prove-it-limits-permissions-008` | Create a permissions boundary and prove it limits permissions | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 9 | `task-saa-iam-deny-s3-bucket-deletion-with-an-scp-009` | Deny S3 bucket deletion with an SCP | Easy | 20 mins | Console + CLI | Yes | Review Required (topic-organizations) |
| 10 | `task-saa-iam-compare-inline-policies-and-managed-policies-010` | Compare inline policies and managed policies | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 11 | `task-saa-iam-enable-access-analyzer-and-review-a-public-s3-finding-011` | Enable Access Analyzer and review a public S3 finding | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 12 | `task-saa-iam-use-aws-principalorgid-to-block-cross-account-access-012` | Use aws:PrincipalOrgID to block cross-account access | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 13 | `task-saa-iam-configure-mfa-and-enforce-mfa-for-sensitive-api-actions-013` | Configure MFA and enforce MFA for sensitive API actions | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 14 | `task-saa-iam-create-a-role-with-external-id-and-test-assumerole-014` | Create a role with External ID and test AssumeRole | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 15 | `task-saa-iam-use-requesttag-and-resourcetag-conditions-for-ec2-015` | Use RequestTag and ResourceTag conditions for EC2 | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 16 | `task-saa-iam-set-up-saml-federation-and-sign-in-to-aws-016` | Set up SAML federation and sign in to AWS | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 17 | `task-saa-iam-iam-identity-center-with-permission-sets-017` | IAM Identity Center with permission sets | Medium | 30 mins | Console + CLI | Yes | Review Required (topic-sso) |
| 18 | `task-saa-iam-use-iam-policy-simulator-to-debug-accessdenied-018` | Use IAM Policy Simulator to debug AccessDenied | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 19 | `task-saa-iam-kms-key-only-one-role-can-use-it-019` | KMS key: only one role can use it | Medium | 30 mins | Console + CLI | Yes | Review Required (topic-kms) |
| 20 | `task-saa-iam-cross-account-s3-bucket-policy-read-access-020` | Cross-account S3 bucket policy read access | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 21 | `task-saa-iam-combine-identity-and-resource-policies-in-s3-021` | Combine identity and resource policies in S3 | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 22 | `task-saa-iam-iam-password-policy-best-practices-022` | IAM password policy best practices | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 23 | `task-saa-iam-iam-access-key-lifecycle-023` | IAM access key lifecycle | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 24 | `task-saa-iam-assumerole-with-sts-from-the-cli-024` | AssumeRole with STS from the CLI | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 25 | `task-saa-iam-lambda-stops-only-tagged-ec2-instances-025` | Lambda stops only tagged EC2 instances | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |

---

## Review Required Output Details

- **Task 9 (Deny S3 bucket deletion with an SCP)**: Primary objective belongs to topic 'topic-organizations' rather than 'topic-iam'
- **Task 17 (IAM Identity Center with permission sets)**: Primary objective belongs to topic 'topic-sso' rather than 'topic-iam'
- **Task 19 (KMS key: only one role can use it)**: Primary objective belongs to topic 'topic-kms' rather than 'topic-iam'
