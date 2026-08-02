# SAA / Container Services Hands-On Tasks Conversion Report

Generated: 2026-08-01T18:31:11.381Z

## Executive Summary

* **Source Batch File**: `hands_on_tasks/batches/SAA/container-services.json`
* **Total Batch Source Records**: 8 (4 unique source records, 4 duplicate records excluded)
* **Total Integrated Tasks**: 3
  * `Amazon ECR` (`topic-ecr`): 1
  * `AWS Fargate` (`topic-fargate`): 1
  * `Amazon ECS` (`topic-ecs`): 1
* **Duplicates Excluded**: 4 (duplicate records 5-8 in source file)
* **Tasks Sent to Review**: 1 (Task 3: AWS App Runner recommended for `topic-app-runner`)
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 3
* **Tasks with Linked Flashcards**: 0

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Categorized container tasks across 3 valid topic IDs (`topic-ecr`, `topic-fargate`, `topic-ecs`).
2. **App Runner Quarantine**: Quarantined Task 3 (AWS App Runner) into `container-services-review-required.json` with `recommendedTopic: 'topic-app-runner'`.
3. **Step 1 Login Instruction Sanitization**: Replaced root user / broad `AdministratorAccess` instructions across all tasks with IAM user / lab role requirements.
4. **Modern ECR Login Command Syntax**: Ensured ECR CLI instructions use modern `aws ecr get-login-password` instead of deprecated `get-login`.
5. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for ECR image storage, Fargate tasks, and ECS container instances/ALBs.
6. **Complete Resource Cleanup**: Ensured teardown sequence for every container resource (scaling service count to 0, deleting services, task definition revisions, ECR images, repositories, and clusters).
7. **Destructive Command Warnings**: Flagged commands like `delete-service`, `stop-task`, `delete-cluster`, `deregister-task-definition`, `delete-repository`.
8. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty | Duration | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-ecr-store-secure-container-blueprints-with-amazon-ecr-001` | `topic-ecr` | Store & Secure Container Blueprints with Amazon ECR | Medium | 30 mins | No | Approved & Integrated |
| 2 | `task-saa-fargate-serverless-container-microservice-with-aws-fargate-alb-002` | `topic-fargate` | Serverless Container Microservice with AWS Fargate & ALB | Medium | 30 mins | No | Approved & Integrated |
| 3 | `task-saa-app-runner-zero-infrastructure-web-deployment-with-aws-app-runner-003` | `topic-app-runner (Quarantined)` | Zero-Infrastructure Web Deployment with AWS App Runner | Medium | 30 mins | No | Sent to Review (Recommended for topic-app-runner) |
| 4 | `task-saa-ecs-iam-task-roles-vs-task-execution-roles-in-amazon-ecs-004` | `topic-ecs` | IAM Task Roles vs Task Execution Roles in Amazon ECS | Medium | 30 mins | No | Approved & Integrated |

---

## Review Required / Quarantined Tasks

- **Task 3 (Zero-Infrastructure Web Deployment with AWS App Runner)**: AWS App Runner task recommended for topic-app-runner when App Runner topic is added to exam configuration.
