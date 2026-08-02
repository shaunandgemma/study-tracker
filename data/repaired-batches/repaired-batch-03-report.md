# SAA-C03 Question Repair Report - Batch 03

This report documents the strict distractor-quality repair performed on the third batch of 10 highest-risk AWS SAA-C03 exam questions identified in the answer-option quality audit.

---

## Batch Summary

- **Total Questions Repaired**: 10
- **Source Questions**: Next 10 highest-risk CRITICAL questions from `data/audits-original-150/answer-option-quality-audit.json`
- **Exclusion Verification**: Verified zero overlap with Batch 01 IDs (`q-saa-105`, `q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-52`, `q-saa-58`, `q-saa-82`) and Batch 02 IDs (`q-saa-85`, `q-saa-86`, `q-saa-137`, `q-saa-140`, `q-saa-143`, `q-saa-150`, `q-saa-99`, `q-saa-134`, `q-saa-2`, `q-saa-69`)
- **Output Batch File**: `data/repaired-batches/repaired-batch-03.json`
- **Final Result**: All 10 questions received **PASS**

---

## Detailed Question Reports

### 1. `q-saa-71`

- **Question ID**: `q-saa-71`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 5.25)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
- **What Was Changed**:
  - Distractors [0], [1], and [3] expanded from short 1-2 word types ("String", "StringList", "Plaintext JSON") into 15–18 word technical options matching the depth of correct Option 2.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 2 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Parameter Store String Type with Base64 Encoding)**: WRONG. Base64 encoding is an encoding format, not an encryption mechanism at rest; `String` parameter types are stored in plaintext in SSM Parameter Store without AWS KMS server-side encryption.
  - **Option 1 (Parameter Store StringList Type)**: WRONG. `StringList` parameter types store comma-separated strings in plaintext and do not support native AWS KMS server-side encryption for sensitive API keys.
  - **Option 3 (Amazon S3 Plaintext JSON Object with SSE-S3)**: WRONG. Plaintext JSON files in S3 buckets do not integrate directly into SSM Parameter Store parameter lookups for microservice environment parameter calls.
- **Official AWS Documentation Areas Checked**:
  - AWS Systems Manager User Guide: *AWS Systems Manager Parameter Store Parameter Types*
  - AWS Key Management Service Developer Guide: *SSM Parameter Store Integration with AWS KMS*
- **Final Result**: **PASS**

---

### 2. `q-saa-78`

- **Question ID**: `q-saa-78`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.00)
  - Longest option is at least twice the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Option 1 (Correct) updated to specify customer managed AWS KMS key and CloudTrail key usage auditing.
  - Distractors expanded and updated to present plausible security mechanisms (Client-Side Encryption with CloudHSM, S3 Glacier Vault Lock on PITR backups, Transparent Data Encryption).
  - All options balanced in length (11 to 18 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Client-Side Encryption with CloudHSM)**: WRONG. Client-side CloudHSM encryption requires complex custom application code and bypasses native DynamoDB AWS KMS server-side key integration and CloudTrail key usage logging.
  - **Option 2 (S3 Glacier Vault Lock on DynamoDB PITR Backups)**: WRONG. S3 Glacier Vault Lock applies WORM retention policies to S3 Glacier vaults, not to live DynamoDB tables or native Point-in-Time Recovery (PITR) table backups for at-rest table encryption.
  - **Option 3 (Transparent Data Encryption TDE)**: WRONG. Transparent Data Encryption (TDE) is a relational database engine feature for Microsoft SQL Server and Oracle databases, not an Amazon DynamoDB table encryption setting.
- **Official AWS Documentation Areas Checked**:
  - Amazon DynamoDB Developer Guide: *DynamoDB Encryption at Rest*
  - AWS Key Management Service Developer Guide: *AWS KMS Customer Managed Keys for DynamoDB*
- **Final Result**: **PASS**

---

### 3. `q-saa-98`

- **Question ID**: `q-saa-98`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 3.00)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
- **What Was Changed**:
  - Question text explicitly updated to clarify that the company is connecting one on-premises network directly to a single VPC and is **not using AWS Transit Gateway**.
  - Distractors [0], [2], and [3] expanded into detailed 11–17 word technical choices explaining alternative gateway types.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Internet Gateway IGW)**: WRONG. An Internet Gateway provides public internet routing for public VPC subnets, but cannot terminate IPsec VPN tunnels or manage BGP sessions.
  - **Option 2 (Egress-Only Internet Gateway)**: WRONG. Egress-Only Internet Gateways enable outbound-only IPv6 communication for instances in private subnets; they cannot terminate dual-tunnel IPv4 IPsec VPN connections.
  - **Option 3 (NAT Gateway)**: WRONG. NAT Gateways perform IPv4 source network address translation for private subnet instances accessing the public internet, but cannot terminate IPsec VPN tunnels or run BGP routing.
- **Official AWS Documentation Areas Checked**:
  - AWS Site-to-Site VPN User Guide: *Virtual Private Gateways Overview*
  - Amazon VPC User Guide: *Comparing Gateways in Amazon VPC*
- **Final Result**: **PASS**

---

### 4. `q-saa-104`

- **Question ID**: `q-saa-104`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.75)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into detailed 16–18 word technical options matching the depth of correct Option 1.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Amazon EFS with SMB 3.1)**: WRONG. Amazon EFS provides POSIX-compliant NFS file storage for Linux instances; it does not support native SMB file shares or Windows Active Directory integration for Windows applications.
  - **Option 2 (Amazon S3 Glacier Flexible Retrieval Mounted as Windows Drive)**: WRONG. S3 Glacier is an archive storage tier with retrieval latencies from minutes to hours; it is not an interactive multi-AZ network file share supporting SMB, Active Directory, and Shadow Copies.
  - **Option 3 (Amazon EBS gp3 Volume in Multi-Attach Mode)**: WRONG. EBS Multi-Attach allows attaching Io2/io1 volumes to multiple EC2 instances within a *single* Availability Zone and requires a cluster file system; it does not support Multi-AZ SMB file shares or Active Directory.
- **Official AWS Documentation Areas Checked**:
  - Amazon FSx for Windows File Server User Guide: *Multi-AZ Deployment Overview*
  - Amazon FSx for Windows File Server User Guide: *Integrating with Active Directory and Shadow Copies*
- **Final Result**: **PASS**

---

### 5. `q-saa-109`

- **Question ID**: `q-saa-109`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.25)
  - Longest option is at least twice the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors [1], [2], and [3] replaced from absurd choices (Glacier Vault Lock, SSM Session Manager, ALB Idle Timeout) with plausible options (EventBridge + SSM Automation, ALB Idle Timeout, Route 53 failover).
  - All options balanced in length (16 to 21 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Amazon EventBridge + SSM Automation Runbook)**: WRONG. Custom automation is unnecessarily complex; changing the Auto Scaling health check type from `EC2` to `ELB` natively instructs Auto Scaling to replace instances failing load balancer health checks without custom scripts.
  - **Option 2 (ALB Idle Timeout Increase)**: WRONG. Increasing the ALB idle timeout adjusts connection persistence for client requests; it does not instruct the Auto Scaling group to replace instances failing target health checks.
  - **Option 3 (Amazon Route 53 Failover Routing Policy)**: WRONG. Route 53 failover routing redirects DNS traffic between endpoints; it does not monitor application health for an EC2 Auto Scaling group or trigger instance replacements.
- **Official AWS Documentation Areas Checked**:
  - Amazon EC2 Auto Scaling User Guide: *Health Checks for Auto Scaling Instances*
  - Elastic Load Balancing User Guide: *Target Group Health Checks*
- **Final Result**: **PASS**

---

### 6. `q-saa-110`

- **Question ID**: `q-saa-110`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.25)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats more question wording than distractors
- **What Was Changed**:
  - Option 0 (Correct) updated to exact requested phrasing: *"Enable Kinesis Data Streams Enhanced Fan-Out to provide dedicated read throughput of up to 2 MB/sec per shard for each registered consumer over HTTP/2."*
  - Corrected typo ("caching layer").
  - Distractors [1], [2], and [3] expanded into 14–19 word technical options explaining alternative streaming/queueing mechanisms.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Kinesis Data Firehose Buffer Hints)**: WRONG. Data Firehose buffer hints adjust buffering conditions (size and time) for delivering data to destinations like S3 or Redshift; they do not increase per-consumer read throughput on Kinesis Data Streams.
  - **Option 2 (Amazon SQS FIFO Message Groups)**: WRONG. SQS FIFO is a message queueing service, not a feature of Kinesis Data Streams for scaling read throughput on Kinesis stream shards.
  - **Option 3 (Amazon DynamoDB Accelerator DAX as Caching Layer)**: WRONG. DAX is an in-memory caching layer for Amazon DynamoDB tables, not a caching layer or fan-out mechanism for Amazon Kinesis Data Streams.
- **Official AWS Documentation Areas Checked**:
  - Amazon Kinesis Data Streams Developer Guide: *Developing Custom Consumers with Dedicated Throughput (Enhanced Fan-Out)*
  - AWS Streaming Architecture Decision Guide
- **Final Result**: **PASS**

---

### 7. `q-saa-111`

- **Question ID**: `q-saa-111`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.64)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded from short service titles (2–4 words) into detailed 17–18 word technical options matching the depth of correct Option 0.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (AWS DataSync Online File System Sync)**: WRONG. AWS DataSync transfers file systems and object storage data (NFS, SMB, S3), not bootable physical server operating system block-level disk storage for lift-and-shift server migration.
  - **Option 2 (AWS Database Migration Service AWS DMS)**: WRONG. AWS DMS migrates relational databases, NoSQL databases, and data warehouses; it cannot replicate physical server operating system disk blocks into EC2 instances.
  - **Option 3 (AWS Snowball Edge Storage Optimized Offline Transport)**: WRONG. Snowball Edge provides offline batch data transport, lacking continuous online block-level replication and non-disruptive cutover testing capabilities.
- **Official AWS Documentation Areas Checked**:
  - AWS Application Migration Service User Guide: *How AWS Application Migration Service Works*
  - AWS Server Migration Decision Guide
- **Final Result**: **PASS**

---

### 8. `q-saa-121`

- **Question ID**: `q-saa-121`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 4.20)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
- **What Was Changed**:
  - Option 0 (Correct) updated to exact requested phrasing: *"Use the Amazon S3 Multipart Upload API to split each large object into independently uploaded parts, allowing failed parts to be retried without restarting the entire upload."* (Removing any claim of automatic retries by the raw API).
  - Distractors [1], [2], and [3] expanded into 14–18 word technical options explaining alternative upload strategies.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Increase EC2 RAM and Enable Jumbo Frames)**: WRONG. Increasing RAM or network MTU does not prevent network connection drops over unstable internet connections or allow resuming interrupted 50 GB object uploads.
  - **Option 2 (S3 Bucket Versioning)**: WRONG. S3 Bucket Versioning preserves multiple object variants in a bucket; it does not resume failed object uploads or split uploads into parallel parts.
  - **Option 3 (AWS Storage Gateway File Gateway over VPN)**: WRONG. File Gateway buffers files locally before uploading to S3, but over an unstable VPN connection, direct S3 Multipart Upload is the native API solution designed for uploading large files with part-level retries.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *Uploading and Copying Objects Using Multipart Upload*
  - AWS S3 API Reference: *MultipartUpload Overview*
- **Final Result**: **PASS**

---

### 9. `q-saa-128`

- **Question ID**: `q-saa-128`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.00)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats more question wording than distractors
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded into 13–15 word technical options matching the depth of correct options [0] and [1].
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (3-Year EC2 Dedicated Host Reservations)**: WRONG. Dedicated Host Reservations commit to specific physical servers for licensing and compliance; they offer no cost optimization for fault-tolerant, stateless Spot batch rendering.
  - **Option 3 (Auto Scaling Group On-Demand with Elastic IPs)**: WRONG. On-Demand pricing is significantly more expensive than Spot instances, failing to satisfy the requirement to minimize compute costs.
  - **Option 4 (EC2 Termination Protection on Spot Nodes)**: WRONG. Termination Protection prevents manual API or console deletion, but cannot prevent AWS EC2 Spot capacity reclamations when capacity is needed elsewhere.
- **Official AWS Documentation Areas Checked**:
  - Amazon EC2 Auto Scaling User Guide: *Allocation Strategies for Spot Instances*
  - Amazon EC2 Auto Scaling User Guide: *Attribute-Based Instance Type Selection*
- **Final Result**: **PASS**

---

### 10. `q-saa-145`

- **Question ID**: `q-saa-145`
- **Original Risk Level**: CRITICAL (13 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.10)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor F is unusually short (4 words)
- **What Was Changed**:
  - Option 2 updated to exact requested phrasing: *"Amazon Route 53 failover routing with health checks to redirect client traffic from the primary Region to the secondary Region."*
  - Distractors [3], [4], and [5] replaced from weak choices (Tape Gateway in Single-AZ, Instance Store for retention, VPC Peering static routing) with detailed 15–16 word options.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0, 1, and 2 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 3 (AWS Storage Gateway Tape Gateway in Single-AZ)**: WRONG. Tape Gateway emulates virtual tape libraries for archival backup software; it does not provide automated cross-Region/cross-account AWS Backup copies or Route 53 traffic redirection.
  - **Option 4 (Amazon EC2 Instance Store Volumes for Retention)**: WRONG. Instance Store volumes are ephemeral block storage tied to the instance lifecycle; they lose all data when an instance stops or fails, making them unsuitable for persistent backup data retention.
  - **Option 5 (AWS Transit Gateway Inter-Region Peering for Client Traffic)**: WRONG. Transit Gateway inter-Region peering routes private VPC network traffic between AWS Regions; it cannot route public client internet web traffic to a secondary Region during a disaster.
- **Official AWS Documentation Areas Checked**:
  - AWS Backup User Guide: *Cross-Region and Cross-Account Backup Copies*
  - Amazon S3 User Guide: *Cross-Region Replication (CRR)*
  - Amazon Route 53 Developer Guide: *Configuring DNS Failover*
- **Final Result**: **PASS**

---

## Final Validation Checklist

- [x] **Exactly 10 questions**: Verified (10/10)
- [x] **All IDs are unique**: Verified (`q-saa-71`, `q-saa-78`, `q-saa-98`, `q-saa-104`, `q-saa-109`, `q-saa-110`, `q-saa-111`, `q-saa-121`, `q-saa-128`, `q-saa-145`)
- [x] **No Batch 01 or Batch 02 IDs reused**: Verified zero overlap with any of the 20 previous IDs
- [x] **All IDs exist in original bank**: Verified against `data/saa-c03-question-export.json`
- [x] **No unrelated questions changed**: Verified
- [x] **All options non-empty**: Verified
- [x] **Correct indexes valid**: Verified (0-indexed)
- [x] **Answer counts match question type**:
  - `single` type: 1 correct answer index matching `correctAnswer` & `correctAnswers[0]`
  - `multiple` type: matching 2 or 3 correct answer indexes
- [x] **Option lengths balanced**: Max vs min option length ratio < 1.93x across all questions
- [x] **No obvious or joke distractors**: Verified
- [x] **No multiple defensible answers**: Verified
- [x] **No outdated pricing or exact unsupported limits**: Verified
- [x] **User Corrections Enforced**:
  - `q-saa-98`: Single VPC VGW termination without Transit Gateway explicitly stated in question text
  - `q-saa-110`: Enhanced Fan-Out wording updated & typo corrected
  - `q-saa-121`: S3 Multipart Upload manual part retry phrasing applied
  - `q-saa-145`: Route 53 failover routing wording applied
- [x] **All 10 questions received PASS status**: Verified (10/10 PASS)
