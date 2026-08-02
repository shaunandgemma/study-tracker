# SAA / Databases Hands-On Tasks Conversion Report

Generated: 2026-08-01T18:23:29.264Z

## Executive Summary

* **Source Batch File**: `hands_on_tasks/batches/SAA/databases.json`
* **Total Batch Source Records**: 25
* **Total Integrated Tasks**: 23
  * `Amazon RDS` (`topic-rds`): 7
  * `Amazon Aurora` (`topic-aurora`): 4
  * `Amazon DynamoDB` (`topic-dynamodb`): 9
  * `Amazon ElastiCache` (`topic-elasticache`): 2
  * `Amazon Redshift` (`topic-redshift`): 1
* **Duplicates Excluded**: 0
* **Tasks Sent to Review**: 2 (DMS Tasks 23 & 24 recommended for `topic-dms`)
* **Console-only Tasks**: 1
* **CLI-only Tasks**: 0
* **Both Console & CLI Modes**: 22
* **Tasks with Linked Flashcards**: 3

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Categorized database labs cleanly across 5 dedicated topic IDs (`topic-rds`, `topic-aurora`, `topic-dynamodb`, `topic-elasticache`, `topic-redshift`).
2. **DMS Quarantine**: Quarantined Tasks 23 & 24 (DMS Conceptual Guide and Homogeneous vs Heterogeneous Migration) and recommended them for `topic-dms` / Migration batch.
3. **Step 1 Login Instruction Sanitization**: Replaced root user / broad `AdministratorAccess` instructions across all tasks with IAM user / lab role requirements.
4. **Database Security Group Rule Sanitization**: Prevented public exposure of database ports (3306, 5432, 6379, 5439) to `0.0.0.0/0` by restricting inbound access to application security groups.
5. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for RDS, Aurora, DynamoDB, ElastiCache, and Redshift.
6. **Complete Resource Cleanup**: Ensured teardown sequence for every database resource (DB instances/clusters, replicas, parameter groups, tables, caches, workgroups).
7. **Destructive Command Warnings**: Flagged commands like `delete-db-instance`, `delete-db-cluster`, `delete-table`, `delete-replication-group`, `delete-cluster`, `delete-workgroup`.
8. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty | Duration | Flashcards | Status |
|---|---|---|---|---|---|---|---|
| 1 | `task-saa-rds-create-rds-and-connect-from-ec2-001` | `topic-rds` | Create RDS and connect from EC2 | Medium | 30 mins | Yes | Approved & Integrated |
| 2 | `task-saa-rds-create-a-multi-az-rds-database-002` | `topic-rds` | Create a Multi-AZ RDS database | Medium | 30 mins | Yes | Approved & Integrated |
| 3 | `task-saa-rds-create-an-rds-read-replica-and-explain-read-scaling-003` | `topic-rds` | Create an RDS Read Replica and explain read scaling | Medium | 30 mins | Yes | Approved & Integrated |
| 4 | `task-saa-rds-take-an-rds-snapshot-and-restore-a-new-database-004` | `topic-rds` | Take an RDS snapshot and restore a new database | Medium | 30 mins | No | Approved & Integrated |
| 5 | `task-saa-rds-enable-rds-encryption-with-kms-005` | `topic-rds` | Enable RDS Encryption with KMS | Medium | 30 mins | No | Approved & Integrated |
| 6 | `task-saa-rds-compare-rds-backup-snapshot-and-pitr-006` | `topic-rds` | Compare RDS Backup, Snapshot, and PITR | Easy | 20 mins | No | Approved & Integrated |
| 7 | `task-saa-aurora-create-an-amazon-aurora-cluster-007` | `topic-aurora` | Create an Amazon Aurora Cluster | Easy | 20 mins | No | Approved & Integrated |
| 8 | `task-saa-aurora-configure-aurora-replicas-and-endpoints-008` | `topic-aurora` | Configure Aurora Replicas and Endpoints | Easy | 20 mins | No | Approved & Integrated |
| 9 | `task-saa-aurora-compare-aurora-serverless-vs-provisioned-aurora-009` | `topic-aurora` | Compare Aurora Serverless vs provisioned Aurora | Medium | 30 mins | No | Approved & Integrated |
| 10 | `task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010` | `topic-dynamodb` | Create a DynamoDB Table with a Partition Key | Easy | 20 mins | No | Approved & Integrated |
| 11 | `task-saa-dynamodb-add-a-sort-key-query-dynamodb-data-011` | `topic-dynamodb` | Add a Sort Key & Query DynamoDB Data | Easy | 20 mins | No | Approved & Integrated |
| 12 | `task-saa-dynamodb-configure-dynamodb-on-demand-vs-provisioned-capacity-012` | `topic-dynamodb` | Configure DynamoDB On-Demand vs Provisioned Capacity | Medium | 30 mins | No | Approved & Integrated |
| 13 | `task-saa-dynamodb-create-a-dynamodb-global-secondary-index-gsi-013` | `topic-dynamodb` | Create a DynamoDB Global Secondary Index (GSI) | Medium | 30 mins | No | Approved & Integrated |
| 14 | `task-saa-dynamodb-enable-dynamodb-streams-014` | `topic-dynamodb` | Enable DynamoDB Streams | Medium | 30 mins | No | Approved & Integrated |
| 15 | `task-saa-dynamodb-enable-dynamodb-time-to-live-ttl-015` | `topic-dynamodb` | Enable DynamoDB Time-To-Live (TTL) | Medium | 30 mins | No | Approved & Integrated |
| 16 | `task-saa-dynamodb-enable-dynamodb-global-tables-016` | `topic-dynamodb` | Enable DynamoDB Global Tables | Hard | 45 mins | No | Approved & Integrated |
| 17 | `task-saa-dynamodb-configure-dynamodb-backup-restore-017` | `topic-dynamodb` | Configure DynamoDB Backup & Restore | Medium | 30 mins | No | Approved & Integrated |
| 18 | `task-saa-aurora-compare-rds-vs-aurora-vs-dynamodb-018` | `topic-aurora` | Compare RDS vs Aurora vs DynamoDB | Easy | 20 mins | No | Approved & Integrated |
| 19 | `task-saa-elasticache-compare-elasticache-redis-vs-memcached-019` | `topic-elasticache` | Compare ElastiCache Redis vs Memcached | Easy | 20 mins | No | Approved & Integrated |
| 20 | `task-saa-elasticache-create-an-elasticache-cluster-implement-caching-patterns-020` | `topic-elasticache` | Create an ElastiCache Cluster & Implement Caching Patterns | Medium | 30 mins | No | Approved & Integrated |
| 21 | `task-saa-redshift-create-an-amazon-redshift-workgroup-021` | `topic-redshift` | Create an Amazon Redshift Workgroup | Hard | 45 mins | No | Approved & Integrated |
| 22 | `task-saa-dynamodb-compare-redshift-vs-rds-vs-dynamodb-022` | `topic-dynamodb` | Compare Redshift vs RDS vs DynamoDB | Hard | 45 mins | No | Approved & Integrated |
| 23 | `task-saa-rds-aws-database-migration-service-dms-conceptual-guide-023` | `topic-dms (Quarantined)` | AWS Database Migration Service (DMS) Conceptual Guide | Easy | 20 mins | No | Sent to Review (Recommended for topic-dms) |
| 24 | `task-saa-rds-homogeneous-vs-heterogeneous-database-migration-024` | `topic-dms (Quarantined)` | Homogeneous vs Heterogeneous Database Migration | Easy | 20 mins | No | Sent to Review (Recommended for topic-dms) |
| 25 | `task-saa-rds-choose-the-best-database-for-exam-scenarios-025` | `topic-rds` | Choose the Best Database for Exam Scenarios | Easy | 20 mins | No | Approved & Integrated |

---

## Review Required / Quarantined Tasks

- **Task 23 (AWS Database Migration Service (DMS) Conceptual Guide)**: Migration cutover / Database Migration Service task recommended for topic-dms / Migration topic batch.
- **Task 24 (Homogeneous vs Heterogeneous Database Migration)**: Migration cutover / Database Migration Service task recommended for topic-dms / Migration topic batch.
