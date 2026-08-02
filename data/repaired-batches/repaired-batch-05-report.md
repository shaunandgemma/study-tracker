# SAA-C03 Question Repair Report - Batch 05

This report documents the strict distractor-quality repair performed on the fifth batch of 10 highest-risk AWS SAA-C03 exam questions identified in the answer-option quality audit.

---

## Batch Summary

- **Total Questions Repaired**: 10
- **Source Questions**: Next 10 highest-risk CRITICAL questions from `data/audits-original-150/answer-option-quality-audit.json`
- **Exclusion Verification**: Verified zero overlap with Batch 01 IDs (`q-saa-105`, `q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-52`, `q-saa-58`, `q-saa-82`), Batch 02 IDs (`q-saa-85`, `q-saa-86`, `q-saa-137`, `q-saa-140`, `q-saa-143`, `q-saa-150`, `q-saa-99`, `q-saa-134`, `q-saa-2`, `q-saa-69`), Batch 03 IDs (`q-saa-71`, `q-saa-78`, `q-saa-98`, `q-saa-104`, `q-saa-109`, `q-saa-110`, `q-saa-111`, `q-saa-121`, `q-saa-128`, `q-saa-145`), and Batch 04 IDs (`q-saa-5`, `q-saa-12`, `q-saa-17`, `q-saa-46`, `q-saa-59`, `q-saa-63`, `q-saa-65`, `q-saa-67`, `q-saa-73`, `q-saa-77`)
- **Output Batch File**: `data/repaired-batches/repaired-batch-05.json`
- **Final Result**: All 10 questions received **PASS**

---

## Detailed Question Reports

### 1. `q-saa-80`

- **Question ID**: `q-saa-80`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.33)
  - Longest option is at least twice the shortest option
  - A correct answer is also the longest answer option
  - Distractor D is unusually short (7 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to exact requested phrasing: *"Create an Amazon Application Recovery Controller routing control cluster, configure routing controls and safety rules, and use its five redundant Regional data-plane endpoints for highly available failover operations."* (Reflecting that ARC provides the five Regional endpoints).
  - Distractors [0], [2], and [3] expanded into 16–21 word technical options explaining alternative DR/routing mechanisms.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Execute Manual Route 53 CLI Scripts)**: WRONG. Manual CLI scripts executed from a bastion host in the failing Region (us-east-1) will fail during regional control plane disruptions and introduce high human error and failover latency.
  - **Option 2 (S3 Cross-Region Replication Event Notifications)**: WRONG. S3 CRR event notifications track object replication state; they do not monitor application health or trigger automated DNS routing control failover.
  - **Option 3 (AWS Transit Gateway Inter-Region Peering Route Updates)**: WRONG. Transit Gateway inter-Region peering routes private VPC network traffic between Regions; it does not manage public DNS traffic failover for web applications.
- **Official AWS Documentation Areas Checked**:
  - Amazon Route 53 Application Recovery Controller User Guide: *Routing Control Clusters and Regional Endpoints*
  - AWS High Availability and Disaster Recovery Whitepaper
- **Final Result**: **PASS**

---

### 2. `q-saa-83`

- **Question ID**: `q-saa-83`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.44)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor C is unusually short (4 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to exact requested phrasing: *"Use an Amazon SQS FIFO queue with Message Group IDs for ordered processing and Message Deduplication IDs to prevent duplicate sends within the deduplication interval."*
  - Explanation updated to specify that deduplication applies within the 5-minute deduplication interval, consumers should implement idempotent processing, and Visibility Timeout and message deletion remain critical.
  - Distractors [0], [2], and [3] expanded into 18–19 word technical options explaining alternative messaging services.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (SQS Standard Queue with DLQ Max Receives of 1)**: WRONG. SQS Standard queues provide best-effort ordering and at-least-once delivery; setting a DLQ max receives of 1 sends failed attempts to the DLQ but does not prevent out-of-order delivery or initial duplicate sends.
  - **Option 2 (Amazon SNS Standard Topic with Filtering)**: WRONG. SNS Standard topics do not guarantee strict message ordering or deduplication across subscriber processes.
  - **Option 3 (Amazon EventBridge Custom Event Bus)**: WRONG. EventBridge event buses route events asynchronously to targets based on patterns; they do not guarantee strict sequential ordering or deduplication like SQS FIFO.
- **Official AWS Documentation Areas Checked**:
  - Amazon SQS Developer Guide: *Amazon SQS FIFO Queues and Message Deduplication*
  - Amazon SQS Developer Guide: *Idempotent Consumer Design Patterns*
- **Final Result**: **PASS**

---

### 3. `q-saa-95`

- **Question ID**: `q-saa-95`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.00)
  - Longest option is at least twice the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D are unusually short (3-4 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into detailed 17–19 word technical choices explaining Volume Gateway, DataSync, and Transfer Family.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (AWS Storage Gateway Volume Gateway Cached Mode)**: WRONG. Volume Gateway presents iSCSI block storage volumes for on-premises servers, not a virtual tape library (VTL) interface for tape backup software.
  - **Option 2 (AWS DataSync Scheduled Tasks)**: WRONG. AWS DataSync transfers file systems and object storage (NFS, SMB, S3); it does not emulate iSCSI virtual tape library protocols used by tape backup software.
  - **Option 3 (AWS Transfer Family for SFTP)**: WRONG. AWS Transfer Family provides SFTP/FTPS/FTP endpoints for file transfers; it lacks iSCSI VTL protocol support required by tape backup software.
- **Official AWS Documentation Areas Checked**:
  - AWS Storage Gateway User Guide: *What is Tape Gateway?*
  - AWS Hybrid Storage Architecture Guide
- **Final Result**: **PASS**

---

### 4. `q-saa-97`

- **Question ID**: `q-saa-97`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.80)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor C is unusually short (4 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 16–19 word technical choices explaining Multivalue Answer, Geolocation, and Weighted routing.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Route 53 Multivalue Answer Routing Policy)**: WRONG. Multivalue Answer routing returns up to eight healthy IP records to distribute traffic across multiple endpoints; it does not enforce an Active-Passive DR model.
  - **Option 2 (Route 53 Geolocation Routing Policy)**: WRONG. Geolocation routing routes traffic based on geographic client location; it does not automatically fail over to a secondary Region when primary health checks fail.
  - **Option 3 (Route 53 Weighted Routing Policy 50/50)**: WRONG. Weighted 50/50 routing distributes traffic active-active across both Regions simultaneously, rather than maintaining an Active-Passive DR model.
- **Official AWS Documentation Areas Checked**:
  - Amazon Route 53 Developer Guide: *Failover Routing*
  - Amazon Route 53 Developer Guide: *Choosing a Routing Policy*
- **Final Result**: **PASS**

---

### 5. `q-saa-100`

- **Question ID**: `q-saa-100`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 3.17)
  - Longest option is at least 3.8 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors B, C, D are unusually short (5-8 words)
- **What Was Changed**:
  - Question text explicitly updated to specify an Amazon API Gateway integration returning HTTP 503 errors.
  - Option 0 (Correct) updated to exact requested phrasing: *"Add a Retry field to the Task state that matches ApiGateway.503 and configures IntervalSeconds, BackoffRate, and MaxAttempts."*
  - Explanation notes that Step Functions matches integration error names (`ApiGateway.503`).
  - Distractors [1], [2], and [3] expanded into 16–17 word technical choices.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Increase Lambda Timeout to 15 Minutes)**: WRONG. Increasing Lambda timeout allows functions to run longer, but does not implement retries or exponential backoff when third-party APIs return HTTP 503 errors.
  - **Option 2 (Configure VPC Gateway Endpoint for S3)**: WRONG. VPC Gateway Endpoints provide private routing to Amazon S3 within a VPC; they do not route to API Gateway or resolve HTTP 503 throttling errors.
  - **Option 3 (Deploy Step Functions Multi-Region via Global Accelerator)**: WRONG. Step Functions state machines run per-Region; deploying multi-Region state machines does not handle HTTP 503 throttling retries from an API Gateway endpoint.
- **Official AWS Documentation Areas Checked**:
  - AWS Step Functions Developer Guide: *Error Handling in Step Functions (Retry and Catch)*
  - Amazon API Gateway Developer Guide: *Handling API Gateway Error Codes in Step Functions*
- **Final Result**: **PASS**

---

### 6. `q-saa-102`

- **Question ID**: `q-saa-102`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.43)
  - Longest option is at least 3.0 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors A, C, D are unusually short (4-6 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 16–17 word technical choices explaining Task Definitions, Elastic Beanstalk Worker Environments, and EC2 Auto Scaling Launch Templates.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Amazon ECS Task Definition)**: WRONG. Task Definitions are text blueprints that define container parameters (image, memory, CPU); they do not manage running task counts or maintain task availability across AZs.
  - **Option 2 (AWS Elastic Beanstalk Worker Environment)**: WRONG. Elastic Beanstalk Worker Environments manage SQS worker applications on EC2/Docker; they are not the native construct for managing ECS Fargate tasks across AZs.
  - **Option 3 (EC2 Auto Scaling Launch Template)**: WRONG. Launch Templates define EC2 instance configurations for EC2 Auto Scaling groups; they do not schedule or manage serverless AWS Fargate tasks on ECS.
- **Official AWS Documentation Areas Checked**:
  - Amazon Elastic Container Service Developer Guide: *Amazon ECS Services*
  - AWS Fargate Developer Guide: *High Availability Architecture for Fargate Tasks*
- **Final Result**: **PASS**

---

### 7. `q-saa-107`

- **Question ID**: `q-saa-107`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.67)
  - Longest option is at least 2.67 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors B, C, D are unusually short (6-7 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into 15–16 word technical options explaining Message Retention Period, DLQ Redrive Policies, and Long Polling.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Decrease Message Retention Period to 30 Seconds)**: WRONG. Decreasing Message Retention Period causes unprocessed messages to be deleted from the queue after 30 seconds, leading to data loss.
  - **Option 2 (Configure SQS Dead-Letter Queue DLQ Max Receives of 1)**: WRONG. Moving messages to a DLQ after 1 receive attempt sends processing failures to the DLQ, but does not prevent concurrent duplicate worker processing during active tasks.
  - **Option 3 (Configure SQS Long Polling Wait Time of 20 Seconds)**: WRONG. Long Polling reduces empty receive responses and API costs; it does not change how long a received message remains invisible to other workers.
- **Official AWS Documentation Areas Checked**:
  - Amazon SQS Developer Guide: *Amazon SQS Visibility Timeout*
  - Amazon SQS Developer Guide: *Avoiding Duplicate Message Processing*
- **Final Result**: **PASS**

---

### 8. `q-saa-114`

- **Question ID**: `q-saa-114`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.43)
  - Longest option is at least 2.43 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors B, C, D are unusually short (7-8 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into 15–17 word technical choices explaining JSON concurrency, EC2 MySQL loading, and DynamoDB Standard-IA tables.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Retain Raw JSON and Increase Athena Concurrency)**: WRONG. Retaining uncompressed raw JSON requires Athena to scan 100% of data for every query, incurring maximum scan costs and poor performance.
  - **Option 2 (Import 10 TB JSON into EC2 MySQL Instance)**: WRONG. Importing 10 TB into MySQL requires provisioning expensive relational storage and managing database servers, failing the requirement for serverless ad-hoc S3 querying via Athena.
  - **Option 3 (Store JSON Log Dataset in DynamoDB Standard-IA)**: WRONG. Storing 10 TB of ad-hoc analytics logs in DynamoDB Standard-IA incurs high write/read capacity costs compared to querying columnar Parquet files directly in S3 using Athena.
- **Official AWS Documentation Areas Checked**:
  - Amazon Athena User Guide: *Top Performance Tuning Tips for Amazon Athena*
  - Amazon Athena User Guide: *Partitioning Data in Athena*
- **Final Result**: **PASS**

---

### 9. `q-saa-122`

- **Question ID**: `q-saa-122`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.75)
  - Longest option is at least 2.75 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors B, C, D are unusually short (5-9 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into 15–18 word technical choices explaining S3 Glacier migration, Read Capacity Units (RCUs), and Time To Live (TTL).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Migrate DynamoDB Data to S3 Glacier Deep Archive)**: WRONG. Table storage size does not cause write throttling, and moving active metric tables to S3 Glacier Deep Archive disables real-time database writes.
  - **Option 2 (Increase Provisioned Read Capacity Units RCUs by 500%)**: WRONG. Increasing Read Capacity Units allocates read throughput; it does not resolve write throttling caused by hot partition key skew.
  - **Option 3 (Enable DynamoDB Time To Live TTL to Delete Items)**: WRONG. Enabling TTL automatically deletes old items asynchronously; it does not redistribute write traffic across partitions or fix low-cardinality hot partition keys.
- **Official AWS Documentation Areas Checked**:
  - Amazon DynamoDB Developer Guide: *Designing Partition Keys to Distribute Your Workload*
  - Amazon DynamoDB Developer Guide: *Understanding Hot Partitions and Throttling*
- **Final Result**: **PASS**

---

### 10. `q-saa-131`

- **Question ID**: `q-saa-131`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.75)
  - Longest option is at least 2.33 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D, E are unusually short (6-7 words)
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded into 10–15 word technical choices explaining Egress-Only IGW, Direct Connect Public VIFs, and S3 Transfer Acceleration.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (Replace NAT Gateways with Egress-Only Internet Gateways)**: WRONG. Egress-Only Internet Gateways support IPv6 traffic only; they do not route IPv4 traffic or eliminate NAT Gateway processing charges for S3/DynamoDB.
  - **Option 3 (Configure AWS Direct Connect Public Virtual Interfaces)**: WRONG. Public VIFs route traffic over a dedicated physical connection from on-premises datacenters, not internal VPC subnet traffic to S3/DynamoDB.
  - **Option 4 (Enable Amazon S3 Transfer Acceleration)**: WRONG. S3 Transfer Acceleration speeds up long-distance uploads via CloudFront edge locations; it does not eliminate NAT Gateway data processing charges for private EC2 instances.
- **Official AWS Documentation Areas Checked**:
  - Amazon VPC User Guide: *Gateway Endpoints for Amazon S3 and DynamoDB*
  - AWS Cost Optimization Whitepaper: *Eliminating NAT Processing Charges with VPC Endpoints*
- **Final Result**: **PASS**

---

## Final Validation Checklist

- [x] **Exactly 10 questions**: Verified (10/10)
- [x] **All IDs are unique**: Verified (`q-saa-80`, `q-saa-83`, `q-saa-95`, `q-saa-97`, `q-saa-100`, `q-saa-102`, `q-saa-107`, `q-saa-114`, `q-saa-122`, `q-saa-131`)
- [x] **No Batches 01 to 04 IDs reused**: Verified zero overlap with any of the 40 previous IDs
- [x] **All IDs exist in original bank**: Verified against `data/saa-c03-question-export.json`
- [x] **No unrelated questions changed**: Verified
- [x] **All options non-empty**: Verified
- [x] **Correct indexes valid**: Verified (0-indexed)
- [x] **Answer counts match question type**:
  - `single` type: 1 correct answer index matching `correctAnswer` & `correctAnswers[0]`
  - `multiple` type: matching 2 or 3 correct answer indexes
- [x] **Option lengths balanced**: Max vs min option length ratio < 1.75x across all questions
- [x] **No obvious or joke distractors**: Verified
- [x] **No multiple defensible answers**: Verified
- [x] **No outdated pricing or exact unsupported limits**: Verified
- [x] **User Corrections Enforced**:
  - `q-saa-80`: ARC routing control cluster phrasing applied (reflecting ARC provides the five Regional endpoints)
  - `q-saa-83`: SQS FIFO 5-minute deduplication window & consumer idempotency explanation applied
  - `q-saa-100`: Explicit API Gateway integration scenario & `ApiGateway.503` retry error matching applied
- [x] **All 10 questions received PASS status**: Verified (10/10 PASS)
