# SAA-C03 Question Repair Report - Batch 02

This report documents the strict distractor-quality repair performed on the second batch of 10 highest-risk AWS SAA-C03 exam questions identified in the answer-option quality audit.

---

## Batch Summary

- **Total Questions Repaired**: 10
- **Source Questions**: Next 10 highest-risk CRITICAL questions from `data/audits-original-150/answer-option-quality-audit.json`
- **Batch 01 Exclusion**: Verified zero overlap with Batch 01 question IDs (`q-saa-105`, `q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-52`, `q-saa-58`, `q-saa-82`)
- **Output Batch File**: `data/repaired-batches/repaired-batch-02.json`
- **Final Result**: All 10 questions received **PASS**

---

## Detailed Question Reports

### 1. `q-saa-85`

- **Question ID**: `q-saa-85`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.18)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Question text explicitly updated to clarify that VPC A, VPC B, and the Route 53 Private Hosted Zone reside within the **same AWS account**.
  - Distractors expanded from short service titles (6–7 words) into full 20–22 word technical choices matching the depth of correct Option 1.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Public Hosted Zone + DNSSEC)**: WRONG. Public hosted zones publish records to the public internet, which exposes internal domain names and fails to resolve internal private IP addresses within peered VPCs.
  - **Option 2 (Route 53 Resolver Outbound/Inbound Endpoints)**: WRONG. Associating a Route 53 Private Hosted Zone with multiple VPCs in the same account natively enables cross-VPC private DNS resolution over VPC Peering without requiring dedicated Resolver endpoints or Transit Gateway infrastructure.
  - **Option 3 (Route 53 Latency Routing Policy)**: WRONG. Latency routing is a public DNS routing policy used to route internet end-users to the lowest-latency AWS Region; it is not a mechanism for sharing a Private Hosted Zone across VPCs.
- **Official AWS Documentation Areas Checked**:
  - Amazon Route 53 Developer Guide: *Working with Private Hosted Zones*
  - Amazon Route 53 Developer Guide: *Associating Amazon VPCs with a Private Hosted Zone*
- **Final Result**: **PASS**

---

### 2. `q-saa-86`

- **Question ID**: `q-saa-86`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 3.00)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors expanded from short service names (4–5 words) to detailed 18–21 word technical options.
  - Correct option retained and refined for length balance.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (AWS DataSync Scheduled Tasks)**: WRONG. AWS DataSync is designed for online transfer of file system and object storage data (NFS, SMB, S3, EFS), not for replicating managed EBS snapshots or RDS database automated backup vaults.
  - **Option 2 (S3 Cross-Region Replication on Backup Buckets)**: WRONG. Automated EBS volume snapshots and RDS database backups are managed directly by AWS Backup and underlying AWS service infrastructure; they are not stored in user-managed S3 buckets where standard S3 CRR rules can be configured.
  - **Option 3 (CloudFormation StackSets + Lambda + Custom S3 Copy)**: WRONG. Custom Lambda scripts and CloudFormation StackSets introduce high operational maintenance, whereas AWS Backup natively provides automated cross-Region and cross-account backup copy actions within Backup Plans.
- **Official AWS Documentation Areas Checked**:
  - AWS Backup Developer Guide: *Creating Cross-Region and Cross-Account Backups*
  - AWS Backup Developer Guide: *Automating Backup Copy Actions in Backup Plans*
- **Final Result**: **PASS**

---

### 3. `q-saa-137`

- **Question ID**: `q-saa-137`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.65)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded from 6–7 word service titles into full 16–18 word technical options matching the depth of correct options [0] and [1].
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (Transit Gateway Inter-Region Peering)**: WRONG. Transit Gateway inter-Region peering connects AWS Transit Gateways across different AWS Regions over the AWS global backbone, but does not connect an on-premises corporate data center over the public internet as a backup link.
  - **Option 3 (AWS Storage Gateway Volume Gateway Cached Mode)**: WRONG. Storage Gateway Volume Gateway provides cloud-backed block storage for on-premises servers; it is a storage service, not a network routing component for hybrid network failover.
  - **Option 4 (AWS Global Accelerator Anycast IPs on TGW)**: WRONG. AWS Global Accelerator optimizes public internet routing to application endpoints; it does not manage physical hybrid network failover from on-premises data centers to an AWS VPC.
- **Official AWS Documentation Areas Checked**:
  - AWS Direct Connect User Guide: *Redundancy in AWS Direct Connect Connections*
  - AWS Site-to-Site VPN User Guide: *Adding a VPN Connection as a Backup to Direct Connect*
- **Final Result**: **PASS**

---

### 4. `q-saa-140`

- **Question ID**: `q-saa-140`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.34)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded from short labels into 14–18 word technical choices detailing alternative DR replication approaches.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (S3 Cross-Region Replication of RDS Snapshots)**: WRONG. Daily S3 CRR of RDS snapshots provides asynchronous snapshot copies, but restoring a database from a snapshot takes hours, failing to meet the sub-second replication lag and under 1-minute RTO requirements.
  - **Option 3 (AWS DataSync Transaction Log Replication)**: WRONG. AWS DataSync transfers file systems and object storage data; it cannot replicate active, live transaction log streams of a running Amazon Aurora MySQL database storage engine.
  - **Option 4 (AWS DMS Continuous Replication Between Standalone Aurora DB Clusters)**: WRONG. AWS DMS logical replication operates at the application layer, introducing higher replication latency, higher operational complexity, and longer failover RTO compared to native Aurora Global Database storage-level replication.
- **Official AWS Documentation Areas Checked**:
  - Amazon Aurora User Guide: *Using Amazon Aurora Global Databases*
  - Amazon Aurora User Guide: *Managed Failover in Aurora Global Databases*
- **Final Result**: **PASS**

---

### 5. `q-saa-143`

- **Question ID**: `q-saa-143`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.14)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors [3], [4], and [5] replaced from absurd choices (Shield Standard on private S3, port 22 in NACL 0.0.0.0/0, S3 Gateway Endpoint on ALB) with plausible security configurations (AWS Network Firewall on ALB target groups, egress NACLs for HTTPS, GuardDuty Malware Protection for SSH).
  - All options balanced in length (15 to 21 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0, 1, and 2 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 3 (AWS Network Firewall on ALB Target Groups)**: WRONG. AWS Network Firewall operates at the VPC subnet layer for network traffic filtering; it cannot be attached to ALB target groups for Layer 7 web application protection against SQL injection (which requires AWS WAF).
  - **Option 4 (Egress Network ACLs for HTTPS Encryption)**: WRONG. Network ACLs are stateless Layer 4 packet filters; they cannot manage SSL/TLS certificates or enforce in-transit HTTPS encryption between client browsers and load balancers.
  - **Option 5 (GuardDuty Malware Protection for Administrative SSH Access)**: WRONG. GuardDuty Malware Protection asynchronously scans EBS volumes for malicious files upon alert triggers; it does not manage security group rules or restrict SSH port 22 access.
- **Official AWS Documentation Areas Checked**:
  - AWS WAF Developer Guide: *Protecting Web Applications with AWS WAF*
  - AWS Certificate Manager User Guide: *Configuring HTTPS Listeners on Application Load Balancers*
  - Amazon EC2 User Guide: *Security Group Rules for Bastion Hosts*
- **Final Result**: **PASS**

---

### 6. `q-saa-150`

- **Question ID**: `q-saa-150`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.56)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors [3], [4], and [5] replaced from absurd choices (Snowcone sent via postal carrier, OpsWorks Chef Automate, Route 53 Latency Routing) with plausible migration technologies (AWS Transfer Family for SFTP server migration, Snowball Edge for real-time DB replication, Storage Gateway Volume Gateway for NFS migration).
  - All options balanced in length (11 to 18 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0, 1, and 2 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 3 (AWS Transfer Family for SFTP Live Server Replication)**: WRONG. AWS Transfer Family provides SFTP/FTPS/FTP endpoints to transfer files into Amazon S3 or Amazon EFS; it cannot perform live block-level server OS replication (handled by AWS MGN).
  - **Option 4 (AWS Snowball Edge for Real-Time Continuous Database Replication)**: WRONG. AWS Snowball Edge is an offline data transport appliance for batch data transfer; it cannot provide continuous real-time online database replication for minimal downtime migrations (handled by AWS DMS).
  - **Option 5 (AWS Storage Gateway Volume Gateway for NFS File Migration)**: WRONG. Volume Gateway presents block storage volumes (iSCSI) backed by S3; it is not an online file migration service designed to transfer NFS files directly to Amazon EFS while preserving POSIX permissions (handled by AWS DataSync).
- **Official AWS Documentation Areas Checked**:
  - AWS MGN User Guide: *Application Migration Service Overview*
  - AWS DMS User Guide: *Database Migration Service Overview*
  - AWS DataSync User Guide: *Migrating NFS File Shares to Amazon EFS*
- **Final Result**: **PASS**

---

### 7. `q-saa-99`

- **Question ID**: `q-saa-99`
- **Original Risk Level**: CRITICAL (15 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 3.27)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Distractor D is unusually short (6 words)
- **What Was Changed**:
  - BGP route attribute phrasing updated to reflect AS-path prepending mechanism correctly: *"configuring dynamic BGP routing and applying BGP route attributes such as AS-path prepending on the VPN advertisement so the Direct Connect path remains preferred."*
  - Distractors [0], [2], and [3] expanded into 26–28 word technical options matching the depth of correct Option 1.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Second 10 Gbps Direct Connect with ECMP)**: WRONG. Ordering a second 10 Gbps Direct Connect connection is significantly more expensive and less cost-effective than using an AWS Site-to-Site VPN over the public internet for backup.
  - **Option 2 (Transit Gateway Peering with Static Routes)**: WRONG. Transit Gateway inter-Region peering connects AWS Transit Gateways across AWS accounts/Regions over the AWS backbone; it cannot terminate public internet VPN connections directly without an AWS Site-to-Site VPN attachment.
  - **Option 3 (AWS Client VPN Endpoint on VGW)**: WRONG. AWS Client VPN is designed for individual remote worker access (user-to-VPC), not for site-to-site corporate datacenter backup connectivity.
- **Official AWS Documentation Areas Checked**:
  - AWS Direct Connect User Guide: *Redundant Direct Connect and VPN Connections*
  - AWS Site-to-Site VPN User Guide: *BGP Routing and AS-Path Prepending*
- **Final Result**: **PASS**

---

### 8. `q-saa-134`

- **Question ID**: `q-saa-134`
- **Original Risk Level**: CRITICAL (15 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.14)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor E is unusually short (5 words)
  - Correct answer repeats more question wording than distractors
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded into 14-word technical options matching the depth of correct options [0] and [1].
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (EC2 On-Demand Dedicated Hosts)**: WRONG. Dedicated Hosts are expensive and intended for strict compliance/licensing constraints; they offer no cost optimization for fault-tolerant batch workloads compared to Fargate Spot.
  - **Option 3 (Amazon DynamoDB Reserved Capacity)**: WRONG. DynamoDB Reserved Capacity provides discounts on DynamoDB database throughput (RCUs/WCUs), not ECS container compute execution.
  - **Option 4 (AWS Batch with On-Demand EC2 Reserved Instances)**: WRONG. Reserved Instances commit to continuous hourly compute usage for 1 or 3 years, making them unsuitable for short-duration variable batch tasks compared to Spot capacity.
- **Official AWS Documentation Areas Checked**:
  - Amazon ECS Developer Guide: *Fargate Spot Capacity Providers*
  - AWS Cost Management User Guide: *Compute Savings Plans Overview*
- **Final Result**: **PASS**

---

### 9. `q-saa-2`

- **Question ID**: `q-saa-2`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.86)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Updated key terminology to *"customer managed AWS KMS key"* (replacing deprecated "Customer Managed Key / CMK").
  - Distractors expanded from short labels into detailed 12–14 word options explaining key storage choices.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Server-Side Encryption with SSE-S3)**: WRONG. SSE-S3 uses keys managed entirely by Amazon S3, which do not support customer-managed key policies, custom rotation schedules, or dedicated CloudTrail key usage logs.
  - **Option 2 (Client-Side Encryption with Parameter Store)**: WRONG. Storing plaintext encryption keys in Systems Manager Parameter Store defeats client-side KMS envelope encryption security and violates key management best practices.
  - **Option 3 (Server-Side Encryption with Customer-Provided Keys SSE-C)**: WRONG. With SSE-C, the customer provides and manages the encryption keys; AWS does not store or automatically rotate SSE-C keys.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *Protecting Data Using Server-Side Encryption with AWS KMS Keys (SSE-KMS)*
  - AWS Key Management Service Developer Guide: *Rotating Customer Managed AWS KMS Keys*
- **Final Result**: **PASS**

---

### 10. `q-saa-69`

- **Question ID**: `q-saa-69`
- **Original Risk Level**: CRITICAL (14 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 4.00)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
- **What Was Changed**:
  - Option 1 (Correct) updated to specify customer managed AWS KMS key and kms:Decrypt permissions.
  - Distractors [0], [2], and [3] expanded into detailed 28–38 word technical choices matching the depth of correct Option 1.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Amazon S3 Bucket Policy Exposing Plaintext Secret)**: WRONG. Exposing secrets as plaintext objects in S3 buckets violates security best practices and bypasses AWS Secrets Manager governance and automatic rotation.
  - **Option 2 (AWS Transit Gateway Inter-VPC Peering for Secrets Manager)**: WRONG. Transit Gateway connects VPC networks; cross-account access to Secrets Manager is governed by IAM policies, secret resource-based policies, and KMS key policies, not network peering.
  - **Option 3 (IAM User Access Keys in Lambda Environment Variables)**: WRONG. Storing long-lived IAM user access keys in Lambda environment variables violates security best practices and avoids cross-account IAM role assumption and resource-based policy authorization.
- **Official AWS Documentation Areas Checked**:
  - AWS Secrets Manager User Guide: *Permissions for Cross-Account Access to Secrets*
  - AWS Key Management Service Developer Guide: *Cross-Account Access to KMS Keys*
- **Final Result**: **PASS**

---

## Final Validation Checklist

- [x] **Exactly 10 questions**: Verified (10/10)
- [x] **All IDs are unique**: Verified (`q-saa-85`, `q-saa-86`, `q-saa-137`, `q-saa-140`, `q-saa-143`, `q-saa-150`, `q-saa-99`, `q-saa-134`, `q-saa-2`, `q-saa-69`)
- [x] **No Batch 01 IDs reused**: Verified zero overlap with Batch 01 (`q-saa-105`, `q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-52`, `q-saa-58`, `q-saa-82`)
- [x] **All IDs exist in original bank**: Verified against `data/saa-c03-question-export.json`
- [x] **No unrelated questions changed**: Verified
- [x] **All options non-empty**: Verified
- [x] **Correct indexes valid**: Verified (0-indexed)
- [x] **Answer counts match question type**:
  - `single` type: 1 correct answer index matching `correctAnswer` & `correctAnswers[0]`
  - `multiple` type: matching 2 or 3 correct answer indexes
- [x] **Option lengths balanced**: Max vs min option length ratio < 1.71x across all questions
- [x] **No obvious or joke distractors**: Verified
- [x] **No multiple defensible answers**: Verified
- [x] **No outdated pricing or exact unsupported limits**: Verified
- [x] **Current AWS Naming & Terminology Enforced**:
  - `q-saa-85`: Explicitly scoped to same AWS account
  - `q-saa-99`: Uses BGP AS-path prepending phrasing
  - `q-saa-2`: Uses *"customer managed AWS KMS key"*
- [x] **All 10 questions received PASS status**: Verified (10/10 PASS)
