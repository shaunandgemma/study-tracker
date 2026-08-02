# SAA / S3 Hands-On Tasks Batch Conversion Report

Generated: 2026-08-01T17:53:51.390Z

## Executive Summary

* **Total S3 Source Records**: 33
* **Eligible for Conversion**: 33 (all marked `needs-minor-source-cleanup`)
* **Converted & Approved**: 33
* **Integrated into Application**: 33 (in `src/data/tasks/s3Tasks.js`)
* **Review Required / Flagged**: 0
* **Existing Seed Task Overlaps**: 1 (Task 2: `task-saa-s3-versioning-001` retained as canonical seed task)
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 33
* **Tasks with Linked Flashcards**: 32

---

## Technical Corrections & Safety Audit

1. **Step 1 Login Instruction Sanitization**: Sanitized Step 1 instructions across all tasks to specify IAM user or lab role with S3 permissions instead of instructing learners to use root user or broad AdministratorAccess policies.
2. **Obsolete Exam Tips Filtered**: Filtered out SOA-C02 and DVA-C02 specific exam tips; retained SAA-C03 exam tips.
3. **HTML Sanitization**: Converted all HTML tags and decoded HTML entities into plain text.
4. **Stable String Identifiers**: Generated deterministic string IDs for tasks, steps, instructions, commands, verification, and cleanup.

---

## Task Conversion Audit Table

| Source ID | Task ID | Title | Difficulty (Inferred) | Duration (Inferred) | Modes | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001` | List S3 buckets and find each bucket Region | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 2 | `task-saa-s3-versioning-001` | Create a test S3 bucket and turn on versioning | Medium | 30 mins | Console + CLI | Yes | Seed Overlap (Canonical Retained) |
| 3 | `task-saa-s3-upload-the-same-file-twice-and-view-both-saved-versions-003` | Upload the same file twice and view both saved versions | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 4 | `task-saa-s3-delete-a-file-then-restore-it-using-s3-versioning-004` | Delete a file, then restore it using S3 versioning | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 5 | `task-saa-s3-turn-on-s3-server-access-logging-005` | Turn on S3 server access logging | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 6 | `task-saa-s3-upload-a-file-and-share-it-with-a-presigned-url-006` | Upload a file and share it with a presigned URL | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 7 | `task-saa-s3-add-a-bucket-policy-that-blocks-public-access-007` | Add a bucket policy that blocks public access | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 8 | `task-saa-s3-turn-on-block-public-access-for-an-s3-bucket-008` | Turn on Block Public Access for an S3 bucket | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 9 | `task-saa-s3-create-a-read-only-s3-iam-user-009` | Create a read-only S3 IAM user | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 10 | `task-saa-s3-turn-on-default-sse-s3-encryption-010` | Turn on default SSE-S3 encryption | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 11 | `task-saa-s3-switch-default-encryption-to-sse-kms-011` | Switch default encryption to SSE-KMS | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 12 | `task-saa-s3-turn-on-account-level-block-public-access-012` | Turn on account-level Block Public Access | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 13 | `task-saa-s3-set-s3-static-website-index-and-error-pages-013` | Set S3 static website index and error pages | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 14 | `task-saa-s3-test-the-custom-s3-website-404-page-014` | Test the custom S3 website 404 page | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 15 | `task-saa-s3-turn-on-access-logging-for-the-s3-website-bucket-015` | Turn on access logging for the S3 website bucket | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 16 | `task-saa-s3-put-cloudfront-in-front-of-the-s3-website-016` | Put CloudFront in front of the S3 website | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 17 | `task-saa-s3-change-a-website-file-and-create-a-cloudfront-invalidation-017` | Change a website file and create a CloudFront invalidation | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 18 | `task-saa-s3-create-a-lifecycle-rule-that-moves-objects-to-standard-ia-018` | Create a lifecycle rule that moves objects to Standard-IA | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 19 | `task-saa-s3-add-a-lifecycle-rule-that-deletes-old-noncurrent-versions-019` | Add a lifecycle rule that deletes old noncurrent versions | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 20 | `task-saa-s3-set-up-same-region-replication-between-two-s3-buckets-020` | Set up same-region replication between two S3 buckets | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 21 | `task-saa-s3-upload-a-file-and-confirm-same-region-replication-copies-it-021` | Upload a file and confirm same-region replication copies it | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 22 | `task-saa-s3-set-up-cross-region-replication-between-two-s3-buckets-022` | Set up cross-region replication between two S3 buckets | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 23 | `task-saa-s3-upload-a-file-and-confirm-cross-region-replication-copies-it-023` | Upload a file and confirm cross-region replication copies it | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 24 | `task-saa-s3-upload-a-large-file-and-notice-how-s3-uses-multipart-upload-024` | Upload a large file and notice how S3 uses multipart upload | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 25 | `task-saa-s3-turn-on-s3-transfer-acceleration-and-compare-the-upload-endpoint-025` | Turn on S3 Transfer Acceleration and compare the upload endpoint | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 26 | `task-saa-s3-create-an-s3-access-point-and-use-it-to-list-bucket-objects-026` | Create an S3 Access Point and use it to list bucket objects | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 27 | `task-saa-s3-create-a-multi-region-access-point-for-buckets-in-different-regions-027` | Create a Multi-Region Access Point for buckets in different Regions | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 28 | `task-saa-s3-open-s3-storage-lens-and-review-the-storage-dashboard-028` | Open S3 Storage Lens and review the storage dashboard | Hard | 45 mins | Console + CLI | Yes | Approved & Integrated |
| 29 | `task-saa-s3-try-to-make-a-bucket-public-while-block-public-access-is-still-on-029` | Try to make a bucket public while Block Public Access is still on | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 30 | `task-saa-s3-try-uploading-to-a-kms-encrypted-bucket-without-kms-encrypt-permission-030` | Try uploading to a KMS-encrypted bucket without KMS encrypt permission | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 31 | `task-saa-s3-remove-s3-replication-and-find-the-iam-role-that-was-used-031` | Remove S3 replication and find the IAM role that was used | Medium | 30 mins | Console + CLI | Yes | Approved & Integrated |
| 32 | `task-saa-s3-upload-with-aws-s3-cp-and-compare-with-s3api-put-object-032` | Upload with aws s3 cp and compare with s3api put-object | Easy | 20 mins | Console + CLI | Yes | Approved & Integrated |
| 33 | `task-saa-s3-open-the-final-s3-guide-and-complete-the-last-review-task-033` | Open the final S3 guide and complete the last review task | Easy | 20 mins | Console + CLI | No | Approved & Integrated |

---

## Review Required Output Details

No tasks required quarantine. All 33 tasks passed schema validation and technical safety checks after Step 1 login boilerplate sanitization.
