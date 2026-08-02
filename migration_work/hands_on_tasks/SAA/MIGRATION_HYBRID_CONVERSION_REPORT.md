# SAA / Migration & Hybrid Connectivity Hands-On Tasks Conversion Report

Generated: 2026-08-01T18:50:24.318Z

## Executive Summary

* **Source Batch File**: `hands_on_tasks/batches/SAA/migration-tools.json`
* **Total Batch Source Records**: 10 (5 unique source records, 5 duplicate records excluded)
* **Previously Quarantined Tasks Resolved**: 4
  * VPC Task 17 $\rightarrow$ `topic-vpn` (`task-saa-vpn-set-up-aws-site-to-site-vpn-017`)
  * VPC Task 19 $\rightarrow$ `topic-direct-connect` (`task-saa-direct-connect-create-private-vif-019`)
  * Databases Task 23 $\rightarrow$ `topic-dms` (`task-saa-dms-conceptual-guide-023`)
  * Databases Task 24 $\rightarrow$ `topic-dms` (`task-saa-dms-homogeneous-vs-heterogeneous-migration-024`)
* **Total Integrated Tasks**: 9
  * `AWS Application Migration Service` (`topic-mgn`): 1
  * `AWS Database Migration Service` (`topic-dms`): 3 (1 from batch + 2 from Databases review)
  * `AWS Snow Family` (`topic-snow-family`): 1
  * `AWS Storage Gateway` (`topic-storage-gateway`): 1
  * `AWS DataSync` (`topic-datasync`): 1
  * `AWS Site-to-Site VPN` (`topic-vpn`): 1 (From VPC review)
  * `AWS Direct Connect` (`topic-direct-connect`): 1 (From VPC review)
* **Duplicates Excluded**: 5 (duplicate records 6-10 in source file)
* **Tasks Sent to Review**: 0
* **Console-only Tasks**: 0
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 9
* **Tasks with Linked Flashcards**: 2

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Categorized migration and hybrid labs across 7 valid topic IDs (`topic-mgn`, `topic-dms`, `topic-snow-family`, `topic-storage-gateway`, `topic-datasync`, `topic-vpn`, `topic-direct-connect`).
2. **Review Record Resolution**: Resolved and integrated VPC Task 17 (VPN), VPC Task 19 (Direct Connect), Databases Task 23 (DMS), and Databases Task 24 (DMS Heterogeneous) without leaving duplicate live records.
3. **Direct Connect Encryption Guidance**: Clarified that Direct Connect does NOT encrypt traffic by default and highlighted VPN over Direct Connect (IPsec) for encrypted transit.
4. **DMS Heterogeneous Migration Guidance**: Clarified that DMS alone does not convert schema objects automatically for heterogeneous migrations (AWS Schema Conversion Tool / SCT is required).
5. **Step 1 Login Instruction Sanitization**: Replaced root user / broad `AdministratorAccess` instructions across all tasks with IAM user / lab role requirements.
6. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for MGN replication, DMS instances, DataSync transfer, Snow Family devices, VPN tunnels, and Direct Connect port-hours.
7. **Complete Resource Cleanup**: Ensured teardown sequence for every migration and hybrid connection (stopping replication tasks, deleting endpoints, removing VPN connections, and deleting VIF associations).
8. **Destructive Command Warnings**: Flagged commands like `delete-replication-task`, `delete-endpoint`, `delete-vpn-connection`, `delete-virtual-interface`.
9. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty | Duration | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-mgn-rehost-a-server-with-aws-mgn-001` | `topic-mgn` | Rehost a Server with AWS MGN | Hard | 45 mins | No | Approved & Integrated |
| 2 | `task-saa-dms-database-migration-schema-conversion-with-aws-dms-sct-002` | `topic-dms` | Database Migration & Schema Conversion with AWS DMS & SCT | Medium | 30 mins | No | Approved & Integrated |
| 3 | `task-saa-snow-family-large-scale-offline-data-transfer-with-aws-snow-family-s3-003` | `topic-snow-family` | Large-Scale Offline Data Transfer with AWS Snow Family & S3 | Medium | 30 mins | No | Approved & Integrated |
| 4 | `task-saa-storage-gateway-hybrid-file-storage-bridge-with-aws-storage-gateway-004` | `topic-storage-gateway` | Hybrid File Storage Bridge with AWS Storage Gateway | Medium | 30 mins | No | Approved & Integrated |
| 5 | `task-saa-datasync-automated-online-file-migration-with-aws-datasync-005` | `topic-datasync` | Automated Online File Migration with AWS DataSync | Medium | 30 mins | No | Approved & Integrated |
| VPC-17 (Review) | `task-saa-vpn-set-up-aws-site-to-site-vpn-017` | `topic-vpn` | Set up AWS Site-to-Site VPN and verify routes | Medium | 30 mins | Yes | Resolved & Integrated (From VPC Review) |
| VPC-19 (Review) | `task-saa-direct-connect-create-private-vif-019` | `topic-direct-connect` | Create a Direct Connect private VIF and test VPC routing | Easy | 20 mins | Yes | Resolved & Integrated (From VPC Review) |
| Databases-23 (Review) | `task-saa-dms-conceptual-guide-023` | `topic-dms` | AWS Database Migration Service (DMS) Conceptual Guide | Easy | 20 mins | No | Resolved & Integrated (From Databases Review) |
| Databases-24 (Review) | `task-saa-dms-homogeneous-vs-heterogeneous-migration-024` | `topic-dms` | Homogeneous vs Heterogeneous Database Migration | Easy | 20 mins | No | Resolved & Integrated (From Databases Review) |

---

## Review Required / Quarantined Tasks

No tasks required quarantine. All 5 batch tasks and 4 resolved review tasks passed schema validation and technical safety checks.
