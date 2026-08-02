# SAA / CloudFront & Edge Hands-On Tasks Conversion Report

Generated: 2026-08-01T18:37:37.516Z

## Executive Summary

* **Source Batch File**: `hands_on_tasks/batches/SAA/cloud-front-edge.json`
* **Total Batch Source Records**: 16 (8 unique source records, 8 duplicate records excluded)
* **Total Integrated Tasks**: 8
  * `Amazon CloudFront` (`topic-cloudfront`): 7
  * `AWS Global Accelerator` (`topic-global-accelerator`): 1
* **Duplicates Excluded**: 8 (duplicate records 9-16 in source file)
* **Tasks Sent to Review**: 0
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 8
* **Tasks with Linked Flashcards**: 0

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Categorized edge delivery labs across `topic-cloudfront` (7 tasks) and `topic-global-accelerator` (1 task).
2. **Origin Access Control (OAC) Over OAI**: Standardized all S3 origin access tasks to use modern Origin Access Control (OAC) instead of legacy OAI.
3. **Step 1 Login Instruction Sanitization**: Replaced root user / broad `AdministratorAccess` instructions across all tasks with IAM user / lab role requirements.
4. **Global Accelerator Architecture**: Explicitly distinguished AWS Global Accelerator static Anycast IP routing for TCP/UDP from CloudFront content caching.
5. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for CloudFront requests, invalidations, logging, and Global Accelerator hourly/data-transfer charges.
6. **Complete Resource Cleanup**: Ensured teardown sequence for CloudFront (disable distribution $\rightarrow$ wait for deployment $ightarrow$ delete distribution, OAC, and functions) and Global Accelerator (remove endpoints $ightarrow$ delete listeners/endpoint groups $ightarrow$ delete accelerator).
7. **Destructive Command Warnings**: Flagged commands like `delete-distribution`, `delete-origin-access-control`, `delete-function`, `delete-accelerator`, `delete-web-acl`.
8. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty | Duration | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-cloudfront-static-website-acceleration-with-s3-cloudfront-oac-001` | `topic-cloudfront` | Static Website Acceleration with S3 & CloudFront OAC | Medium | 30 mins | No | Approved & Integrated |
| 2 | `task-saa-cloudfront-multi-origin-routing-path-based-behaviors-alb-s3-002` | `topic-cloudfront` | Multi-Origin Routing & Path-Based Behaviors (ALB + S3) | Medium | 30 mins | No | Approved & Integrated |
| 3 | `task-saa-cloudfront-restricting-content-access-with-cloudfront-signed-urls-signed-cookies-003` | `topic-cloudfront` | Restricting Content Access with CloudFront Signed URLs & Signed Cookies | Medium | 30 mins | No | Approved & Integrated |
| 4 | `task-saa-cloudfront-edge-perimeter-protection-with-aws-waf-cloudfront-004` | `topic-cloudfront` | Edge Perimeter Protection with AWS WAF & CloudFront | Medium | 30 mins | No | Approved & Integrated |
| 5 | `task-saa-cloudfront-dynamic-request-manipulation-with-cloudfront-functions-vs-lambda-edge-005` | `topic-cloudfront` | Dynamic Request Manipulation with CloudFront Functions vs Lambda@Edge | Hard | 45 mins | No | Approved & Integrated |
| 6 | `task-saa-cloudfront-high-availability-origin-failover-groups-006` | `topic-cloudfront` | High Availability & Origin Failover Groups | Hard | 45 mins | No | Approved & Integrated |
| 7 | `task-saa-global-accelerator-non-http-global-acceleration-with-aws-global-accelerator-007` | `topic-global-accelerator` | Non-HTTP Global Acceleration with AWS Global Accelerator | Hard | 45 mins | No | Approved & Integrated |
| 8 | `task-saa-cloudfront-custom-ssl-tls-certificates-with-acm-sni-008` | `topic-cloudfront` | Custom SSL/TLS Certificates with ACM & SNI | Hard | 45 mins | No | Approved & Integrated |

---

## Review Required / Quarantined Tasks

No tasks required quarantine. All 8 unique CloudFront & Edge tasks passed schema validation and technical safety checks.
