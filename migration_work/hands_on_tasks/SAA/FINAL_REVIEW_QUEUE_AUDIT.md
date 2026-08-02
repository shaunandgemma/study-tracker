# FINAL REVIEW QUEUE AUDIT
**Project:** SAA Hands-On Task Catalogue Migration  
**Date:** 2026-08-01  
**Scope:** All `*-review-required.json` files across 13 SAA source batches

---

## Overview

| Metric | Value |
|---|---|
| Batches with review items | 6 of 13 |
| Batches with empty review queues | 7 of 13 |
| Total records sent to review | 17 |
| Resolved (live in catalogue) | 9 |
| Excluded (deliberate — overlap) | 6 |
| **Genuinely Unresolved** | **2** |

---

## Batches with Empty Review Queues

The following batches produced **no review-required items** — all tasks were converted cleanly and are live in the catalogue:

| Batch File | Status |
|---|---|
| `analytics-streaming-review-required.json` | ✅ Empty — all tasks live |
| `cloudfront-edge-review-required.json` | ✅ Empty — all tasks live |
| `ec2-review-required.json` | ✅ Empty — all tasks live |
| `load-balancing-auto-scaling-review-required.json` | ✅ Empty — all tasks live |
| `migration-hybrid-review-required.json` | ✅ Empty — all tasks live |
| `monitoring-management-governance-review-required.json` | ✅ Empty — all tasks live |
| `s3-review-required.json` | ✅ Empty — all tasks live |
| `security-services-review-required.json` | ✅ Empty — all tasks live |

---

## Batch-by-Batch Review Records

---

### Batch: `serverless-review-required.json`
**Source Batch:** Serverless (tasks 1–13)  
**Records sent to review:** 3

---

#### Record 1 — Serverless Task 11

| Field | Value |
|---|---|
| Source Task ID | `11` |
| Original Title | Analytical Ingestion |
| Converted Task ID | `task-saa-lambda-analytical-ingestion-011` |
| Recommended Topic | `topic-kinesis` |
| Reason for Review | Analytical ingestion / Data Firehose task recommended for `topic-kinesis` / Analytics topic batch rather than Serverless batch |

**Resolution:** ✅ **RESOLVED**  
Converted and re-homed as **`task-saa-kinesis-deliver-records-to-s3-with-firehose-011`** in the **Analytics/Streaming batch** under `topic-kinesis`. The task is live in the catalogue and validated.

---

#### Record 2 — Serverless Task 12

| Field | Value |
|---|---|
| Source Task ID | `12` |
| Original Title | Serverless Security |
| Converted Task ID | `task-saa-api-gateway-serverless-security-012` |
| Recommended Topic | `topic-cognito` |
| Reason for Review | Serverless security / Cognito identity management task recommended for `topic-cognito` / Security topic batch rather than Serverless batch |

**Resolution:** ✅ **RESOLVED**  
Converted and re-homed as **`task-saa-cognito-serverless-security-012`** in the **Security Services batch** under `topic-cognito`. The task is live in the catalogue and validated.

---

#### Record 3 — Serverless Task 13

| Field | Value |
|---|---|
| Source Task ID | `13` |
| Original Title | Serverless Databases |
| Converted Task ID | `task-saa-lambda-serverless-databases-013` |
| Recommended Topic | *(originally under `topic-lambda` / DynamoDB content)* |
| Reason for Review | DynamoDB TTL + Streams content is a confirmed duplicate of existing DynamoDB tasks already in the catalogue under `topic-dynamodb` |

**Resolution:** ✅ **RESOLVED (Duplicate)**  
Content confirmed as duplicate of existing DynamoDB tasks (9 DynamoDB tasks already live in the catalogue covering On-Demand capacity, TTL, and Streams). Task was deliberately not added to avoid catalogue duplication. No gap exists.

---

### Batch: `iam-review-required.json`
**Source Batch:** IAM (tasks 1–22)  
**Records sent to review:** 3

---

#### Record 4 — IAM Task 9

| Field | Value |
|---|---|
| Source Task ID | `9` |
| Original Title | Deny S3 bucket deletion with an SCP |
| Converted Task ID | `task-saa-iam-deny-s3-bucket-deletion-with-an-scp-009` |
| Recommended Topic | `topic-organizations` |
| Reason for Review | Primary objective belongs to `topic-organizations` rather than `topic-iam`; SCP/Organizations guardrail content |

**Resolution:** ✅ **RESOLVED**  
Converted and re-homed as **`task-saa-organizations-deny-s3-bucket-deletion-scp-009`** in the **Monitoring/Management/Governance batch** under `topic-organizations`. The task is live in the catalogue and validated.

---

#### Record 5 — IAM Task 17

| Field | Value |
|---|---|
| Source Task ID | `17` |
| Original Title | IAM Identity Center with permission sets |
| Converted Task ID | `task-saa-iam-iam-identity-center-with-permission-sets-017` |
| Recommended Topic | `topic-sso` |
| Reason for Review | Primary objective belongs to `topic-sso` (IAM Identity Center) rather than `topic-iam`; recommended topic `topic-sso` does not exist in `examData.js` |

**Resolution:** ❌ **UNRESOLVED**  
No dedicated IAM Identity Center topic (`topic-sso` or `topic-iam-identity-center`) exists in the live `examData.js` topic registry. The nearest valid topic would be `topic-iam`, but placing the task there misrepresents its primary service. This task **cannot be added to the live catalogue** until a `topic-iam-identity-center` topic entry is created in `examData.js`. Task content is fully converted and preserved in `iam-review-required.json`.

---

#### Record 6 — IAM Task 19

| Field | Value |
|---|---|
| Source Task ID | `19` |
| Original Title | KMS key: only one role can use it |
| Converted Task ID | `task-saa-iam-kms-key-only-one-role-can-use-it-019` |
| Recommended Topic | `topic-kms` |
| Reason for Review | Primary objective belongs to `topic-kms` rather than `topic-iam`; KMS key policy lab |

**Resolution:** ✅ **RESOLVED**  
Converted and re-homed as **`task-saa-kms-key-only-one-role-can-use-it-019`** in the **Encryption/Security batch** under `topic-kms`. The task is live in the catalogue and validated.

---

### Batch: `vpc-review-required.json`
**Source Batch:** VPC (tasks 1–21)  
**Records sent to review:** 2

---

#### Record 7 — VPC Task 17

| Field | Value |
|---|---|
| Source Task ID | `17` |
| Original Title | Set up AWS Site-to-Site VPN and verify routes |
| Converted Task ID | `task-saa-vpc-set-up-aws-site-to-site-vpn-and-verify-routes-017` |
| Recommended Topic | `topic-vpn` (flagged as `topic-migration`) |
| Reason for Review | Primary objective belongs to hybrid connectivity / VPN content rather than `topic-vpc`; flagged for Migration batch |

**Resolution:** ✅ **RESOLVED**  
Converted and re-homed as **`task-saa-vpn-set-up-aws-site-to-site-vpn-017`** in the **Migration/Hybrid Connectivity batch** under `topic-vpn`. The task is live in the catalogue and validated.

---

#### Record 8 — VPC Task 19

| Field | Value |
|---|---|
| Source Task ID | `19` |
| Original Title | Create a Direct Connect private VIF and test VPC routing |
| Converted Task ID | `task-saa-vpc-create-a-direct-connect-private-vif-and-test-vpc-routing-019` |
| Recommended Topic | `topic-direct-connect` (flagged as `topic-migration`) |
| Reason for Review | Primary objective belongs to Direct Connect hybrid connectivity rather than `topic-vpc`; flagged for Migration batch |

**Resolution:** ✅ **RESOLVED**  
Converted and re-homed as **`task-saa-direct-connect-create-private-vif-019`** in the **Migration/Hybrid Connectivity batch** under `topic-direct-connect`. The task is live in the catalogue and validated.

---

### Batch: `databases-review-required.json`
**Source Batch:** Databases (tasks 1–24)  
**Records sent to review:** 2

---

#### Record 9 — Databases Task 23

| Field | Value |
|---|---|
| Source Task ID | `23` |
| Original Title | AWS Database Migration Service (DMS) Conceptual Guide |
| Converted Task ID | `task-saa-rds-aws-database-migration-service-dms-conceptual-guide-023` |
| Recommended Topic | `topic-dms` |
| Reason for Review | Migration cutover / DMS conceptual guide content recommended for `topic-dms` / Migration topic batch rather than Databases batch |

**Resolution:** ✅ **RESOLVED**  
Converted and re-homed as **`task-saa-dms-conceptual-guide-023`** in the **Migration/Hybrid Connectivity batch** under `topic-dms`. The task is live in the catalogue and validated.

---

#### Record 10 — Databases Task 24

| Field | Value |
|---|---|
| Source Task ID | `24` |
| Original Title | Homogeneous vs Heterogeneous Database Migration |
| Converted Task ID | `task-saa-rds-homogeneous-vs-heterogeneous-database-migration-024` |
| Recommended Topic | `topic-dms` |
| Reason for Review | Homogeneous vs. heterogeneous migration comparison content recommended for `topic-dms` / Migration topic batch rather than Databases batch |

**Resolution:** ✅ **RESOLVED**  
Converted and re-homed as **`task-saa-dms-homogeneous-vs-heterogeneous-migration-024`** in the **Migration/Hybrid Connectivity batch** under `topic-dms`. The task is live in the catalogue and validated.

---

### Batch: `container-services-review-required.json`
**Source Batch:** Container Services (tasks 1–5)  
**Records sent to review:** 1

---

#### Record 11 — Container Services Task 3

| Field | Value |
|---|---|
| Source Task ID | `3` |
| Original Title | Zero-Infrastructure Web Deployment with AWS App Runner |
| Converted Task ID | `task-saa-app-runner-zero-infrastructure-web-deployment-with-aws-app-runner-003` |
| Recommended Topic | `topic-app-runner` |
| Reason for Review | AWS App Runner task recommended for `topic-app-runner` when App Runner topic is added to exam configuration |

**Resolution:** ❌ **UNRESOLVED**  
No `topic-app-runner` topic entry exists in the live `examData.js` topic registry. The App Runner service is not currently covered by any valid topic in the SAA-C03 exam data configuration. This task **cannot be added to the live catalogue** until a `topic-app-runner` topic entry is created in `examData.js`. Task content is fully converted and preserved in `container-services-review-required.json`.

---

### Batch: `high-availability-review-required.json`
**Source Batch:** High Availability (tasks 1–8)  
**Records sent to review:** 6 (Tasks 1, 2, 3, 4, 6, 7)

> All High Availability review items were sent to review because their primary objectives **overlap with existing tasks already in the live catalogue**. These are not "missing" tasks — they were deliberately excluded to avoid catalogue duplication. Each is marked **EXCLUDED**.

---

#### Record 12 — High Availability Task 1

| Field | Value |
|---|---|
| Source Task ID | `1` |
| Title | Multi-AZ High Availability Web Tier with Application Load Balancer (ALB) |
| Recommended Topic | `topic-elb` |
| Reason for Review | Primary Multi-AZ ALB objective overlaps with existing `topic-elb` tasks (13 ELB tasks already integrated including ALB in front of ASG, cross-zone load balancing, health checks). Not materially distinct. |

**Resolution:** 🚫 **EXCLUDED — Overlapping with existing catalogue**

---

#### Record 13 — High Availability Task 2

| Field | Value |
|---|---|
| Source Task ID | `2` |
| Title | Self-Healing Elasticity with EC2 Auto Scaling Groups & Launch Templates |
| Recommended Topic | `topic-ec2-asg` |
| Reason for Review | Self-Healing ASG objective overlaps with existing `topic-ec2-asg` tasks (9 ASG tasks already integrated including Set up an EC2 Auto Scaling Group, Use health checks and termination policies). Not materially distinct. |

**Resolution:** 🚫 **EXCLUDED — Overlapping with existing catalogue**

---

#### Record 14 — High Availability Task 3

| Field | Value |
|---|---|
| Source Task ID | `3` |
| Title | Decoupling Web Apps with Amazon SQS & Dead-Letter Queues (DLQ) |
| Recommended Topic | `topic-sqs` |
| Reason for Review | SQS DLQ decoupling objective overlaps with existing `topic-sqs` tasks (4 SQS tasks already integrated including Fault Isolation task). Not materially distinct. |

**Resolution:** 🚫 **EXCLUDED — Overlapping with existing catalogue**

---

#### Record 15 — High Availability Task 4

| Field | Value |
|---|---|
| Source Task ID | `4` |
| Title | Fan-Out Event Messaging with Amazon SNS & Multiple SQS Queues |
| Recommended Topic | `topic-sns` |
| Reason for Review | SNS fan-out + SQS objective overlaps with existing `topic-sns` (Pub/Sub Messaging task) and `topic-sqs` tasks. Fan-out pattern is covered by existing SNS and SQS integration tasks. Not materially distinct. |

**Resolution:** 🚫 **EXCLUDED — Overlapping with existing catalogue**

---

#### Record 16 — High Availability Task 6

| Field | Value |
|---|---|
| Source Task ID | `6` |
| Title | Stateful App Decoupling with Session Caching (ElastiCache / DynamoDB) |
| Recommended Topic | `topic-elasticache` |
| Reason for Review | ElastiCache session decoupling objective overlaps with existing `topic-elasticache` tasks (Create an ElastiCache Cluster & Implement Caching Patterns). Not materially distinct. |

**Resolution:** 🚫 **EXCLUDED — Overlapping with existing catalogue**

---

#### Record 17 — High Availability Task 7

| Field | Value |
|---|---|
| Source Task ID | `7` |
| Title | Cross-Region Database Read Replicas & Failover (Aurora / RDS) |
| Recommended Topic | `topic-aurora` |
| Reason for Review | Cross-Region Aurora/RDS failover overlaps with existing `topic-aurora` tasks (Configure Aurora Replicas and Endpoints, Compare Aurora Serverless) and `topic-rds` (Multi-AZ RDS, Read Replica tasks). Not materially distinct. |

**Resolution:** 🚫 **EXCLUDED — Overlapping with existing catalogue**

---

## Summary Table

| # | Batch | Source Task ID | Title | Recommended Topic | Resolution |
|---|---|---|---|---|---|
| 1 | Serverless | 11 | Analytical Ingestion | `topic-kinesis` | ✅ RESOLVED — `task-saa-kinesis-deliver-records-to-s3-with-firehose-011` |
| 2 | Serverless | 12 | Serverless Security | `topic-cognito` | ✅ RESOLVED — `task-saa-cognito-serverless-security-012` |
| 3 | Serverless | 13 | Serverless Databases | *(DynamoDB duplicate)* | ✅ RESOLVED — Confirmed duplicate of existing DynamoDB tasks |
| 4 | IAM | 9 | Deny S3 bucket deletion with SCP | `topic-organizations` | ✅ RESOLVED — `task-saa-organizations-deny-s3-bucket-deletion-scp-009` |
| 5 | IAM | 17 | IAM Identity Center with permission sets | `topic-sso` | ❌ UNRESOLVED — `topic-sso` / `topic-iam-identity-center` not in examData.js |
| 6 | IAM | 19 | KMS key: only one role can use it | `topic-kms` | ✅ RESOLVED — `task-saa-kms-key-only-one-role-can-use-it-019` |
| 7 | VPC | 17 | Set up AWS Site-to-Site VPN | `topic-vpn` | ✅ RESOLVED — `task-saa-vpn-set-up-aws-site-to-site-vpn-017` |
| 8 | VPC | 19 | Direct Connect private VIF | `topic-direct-connect` | ✅ RESOLVED — `task-saa-direct-connect-create-private-vif-019` |
| 9 | Databases | 23 | DMS Conceptual Guide | `topic-dms` | ✅ RESOLVED — `task-saa-dms-conceptual-guide-023` |
| 10 | Databases | 24 | Homo vs Hetero Migration | `topic-dms` | ✅ RESOLVED — `task-saa-dms-homogeneous-vs-heterogeneous-migration-024` |
| 11 | Container Services | 3 | AWS App Runner Zero-Infrastructure | `topic-app-runner` | ❌ UNRESOLVED — `topic-app-runner` not in examData.js |
| 12 | High Availability | 1 | Multi-AZ ALB Web Tier | `topic-elb` | 🚫 EXCLUDED — Overlapping with 13 existing ELB tasks |
| 13 | High Availability | 2 | Self-Healing ASG & Launch Templates | `topic-ec2-asg` | 🚫 EXCLUDED — Overlapping with 9 existing ASG tasks |
| 14 | High Availability | 3 | SQS & Dead-Letter Queues | `topic-sqs` | 🚫 EXCLUDED — Overlapping with 4 existing SQS tasks |
| 15 | High Availability | 4 | SNS Fan-Out & SQS | `topic-sns` | 🚫 EXCLUDED — Overlapping with existing SNS/SQS tasks |
| 16 | High Availability | 6 | ElastiCache Session Caching | `topic-elasticache` | 🚫 EXCLUDED — Overlapping with existing ElastiCache tasks |
| 17 | High Availability | 7 | Cross-Region Aurora/RDS Failover | `topic-aurora` | 🚫 EXCLUDED — Overlapping with existing Aurora/RDS tasks |

---

## Genuinely Unresolved Items

The following **2 records** remain genuinely unresolved. They are fully converted and ready to publish, but are blocked by missing topic IDs in `examData.js`. No live catalogue task covers these scenarios.

### 1. IAM Task 17 — IAM Identity Center with Permission Sets
- **Blocked by:** No `topic-sso` or `topic-iam-identity-center` entry in `examData.js`
- **Action required:** Add `topic-iam-identity-center` topic to `examData.js`, then assign this task to that topic and add it to the live catalogue
- **Content location:** `iam-review-required.json` (sourceTaskId: 17)
- **Candidate task ID:** `task-saa-iam-identity-center-with-permission-sets-017`

### 2. Container Services Task 3 — Zero-Infrastructure Web Deployment with AWS App Runner
- **Blocked by:** No `topic-app-runner` entry in `examData.js`
- **Action required:** Add `topic-app-runner` topic to `examData.js`, then assign this task to that topic and add it to the live catalogue
- **Content location:** `container-services-review-required.json` (sourceTaskId: 3)
- **Candidate task ID:** `task-saa-app-runner-zero-infrastructure-web-deployment-003`

---

*Audit generated: 2026-08-01 | Migration Pipeline*
