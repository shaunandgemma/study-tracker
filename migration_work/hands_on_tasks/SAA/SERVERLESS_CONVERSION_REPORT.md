# SAA / Serverless Hands-On Tasks Conversion Report

Generated: 2026-08-01T18:27:24.536Z

## Executive Summary

* **Source Batch File**: `hands_on_tasks/batches/SAA/serverless.json`
* **Total Batch Source Records**: 16
* **Total Integrated Tasks**: 13
  * `AWS Lambda` (`topic-lambda`): 5
  * `Amazon API Gateway` (`topic-api-gateway`): 1
  * `AWS Step Functions` (`topic-step-functions`): 1
  * `Amazon EventBridge` (`topic-eventbridge`): 1
  * `Amazon SQS` (`topic-sqs`): 4
  * `Amazon SNS` (`topic-sns`): 1
* **Duplicates Excluded**: 0
* **Tasks Sent to Review**: 3 (Tasks 11, 12, 13 recommended for `topic-kinesis`, `topic-cognito`, `topic-dynamodb`)
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 13
* **Tasks with Linked Flashcards**: 0

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Mapped serverless labs across 6 dedicated topic IDs (`topic-lambda`, `topic-api-gateway`, `topic-step-functions`, `topic-eventbridge`, `topic-sqs`, `topic-sns`).
2. **Domain Quarantine**: Quarantined Task 11 (Data Firehose $\rightarrow$ `topic-kinesis`), Task 12 (Cognito Pools $\rightarrow$ `topic-cognito`), and Task 13 (DynamoDB $\rightarrow$ already integrated in Databases batch).
3. **Step 1 Login Instruction Sanitization**: Replaced root user / broad `AdministratorAccess` instructions across all tasks with IAM user / lab role requirements.
4. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for Lambda, API Gateway, Step Functions, EventBridge, SQS, and SNS.
5. **Complete Resource Cleanup**: Ensured teardown sequence for every serverless resource (functions, APIs, state machines, rules, queues, topics, execution roles).
6. **Destructive Command Warnings**: Flagged commands like `delete-function`, `delete-api`, `delete-state-machine`, `delete-rule`, `delete-queue`, `delete-topic`.
7. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty | Duration | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-lambda-function-basics-001` | `topic-lambda` | Function Basics | Medium | 30 mins | No | Approved & Integrated |
| 2 | `task-saa-api-gateway-api-ingress-proxy-002` | `topic-api-gateway` | API Ingress Proxy | Medium | 30 mins | No | Approved & Integrated |
| 3 | `task-saa-lambda-concurrency-tuning-003` | `topic-lambda` | Concurrency Tuning | Medium | 30 mins | No | Approved & Integrated |
| 4 | `task-saa-lambda-canary-routing-004` | `topic-lambda` | Canary Routing | Hard | 45 mins | No | Approved & Integrated |
| 5 | `task-saa-sqs-asynchronous-buffering-005` | `topic-sqs` | Asynchronous Buffering | Medium | 30 mins | No | Approved & Integrated |
| 6 | `task-saa-sqs-sequential-processing-006` | `topic-sqs` | Sequential Processing | Medium | 30 mins | No | Approved & Integrated |
| 7 | `task-saa-sns-pub-sub-messaging-007` | `topic-sns` | Pub/Sub Messaging | Medium | 30 mins | No | Approved & Integrated |
| 8 | `task-saa-sqs-fault-isolation-008` | `topic-sqs` | Fault Isolation | Medium | 30 mins | No | Approved & Integrated |
| 9 | `task-saa-eventbridge-event-orchestration-009` | `topic-eventbridge` | Event Orchestration | Hard | 45 mins | No | Approved & Integrated |
| 10 | `task-saa-step-functions-state-machine-design-010` | `topic-step-functions` | State Machine Design | Hard | 45 mins | No | Approved & Integrated |
| 11 | `task-saa-lambda-analytical-ingestion-011` | `topic-kinesis (Quarantined)` | Analytical Ingestion | Medium | 30 mins | No | Sent to Review (Recommended for topic-kinesis) |
| 12 | `task-saa-api-gateway-serverless-security-012` | `topic-cognito (Quarantined)` | Serverless Security | Medium | 30 mins | No | Sent to Review (Recommended for topic-cognito) |
| 13 | `task-saa-lambda-serverless-databases-013` | `topic-dynamodb (Quarantined)` | Serverless Databases | Medium | 30 mins | No | Sent to Review (Integrated in Databases batch) |
| 14 | `task-saa-sqs-payload-management-014` | `topic-sqs` | Payload Management | Hard | 45 mins | No | Approved & Integrated |
| 15 | `task-saa-lambda-vpc-subnet-networking-015` | `topic-lambda` | VPC Subnet Networking | Medium | 30 mins | No | Approved & Integrated |
| 16 | `task-saa-lambda-streaming-topologies-016` | `topic-lambda` | Streaming Topologies | Medium | 30 mins | No | Approved & Integrated |

---

## Review Required / Quarantined Tasks

- **Task 11 (Analytical Ingestion)**: Analytical ingestion / Data Firehose task recommended for topic-kinesis / Analytics topic batch.
- **Task 12 (Serverless Security)**: Serverless security / Cognito identity management task recommended for topic-cognito / Security topic batch.
- **Task 13 (Serverless Databases)**: DynamoDB table & TTL task already integrated in Databases batch under topic-dynamodb (duplicate domain task).
