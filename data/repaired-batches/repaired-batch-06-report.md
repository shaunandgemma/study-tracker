# SAA-C03 Question Repair Report - Batch 06

This report documents the strict distractor-quality repair performed on the sixth batch of 10 highest-risk AWS SAA-C03 exam questions identified in the answer-option quality audit.

---

## Batch Summary

- **Total Questions Repaired**: 10
- **Source Questions**: Next 10 highest-risk CRITICAL questions from `data/audits-original-150/answer-option-quality-audit.json`
- **Exclusion Verification**: Verified zero overlap with Batch 01 IDs (`q-saa-105`, `q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-52`, `q-saa-58`, `q-saa-82`), Batch 02 IDs (`q-saa-85`, `q-saa-86`, `q-saa-137`, `q-saa-140`, `q-saa-143`, `q-saa-150`, `q-saa-99`, `q-saa-134`, `q-saa-2`, `q-saa-69`), Batch 03 IDs (`q-saa-71`, `q-saa-78`, `q-saa-98`, `q-saa-104`, `q-saa-109`, `q-saa-110`, `q-saa-111`, `q-saa-121`, `q-saa-128`, `q-saa-145`), Batch 04 IDs (`q-saa-5`, `q-saa-12`, `q-saa-17`, `q-saa-46`, `q-saa-59`, `q-saa-63`, `q-saa-65`, `q-saa-67`, `q-saa-73`, `q-saa-77`), and Batch 05 IDs (`q-saa-80`, `q-saa-83`, `q-saa-95`, `q-saa-97`, `q-saa-100`, `q-saa-102`, `q-saa-107`, `q-saa-114`, `q-saa-122`, `q-saa-131`)
- **Output Batch File**: `data/repaired-batches/repaired-batch-06.json`
- **Final Result**: All 10 questions received **PASS**

---

## Detailed Question Reports

### 1. `q-saa-132`

- **Question ID**: `q-saa-132`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.14)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D, E are unusually short (6-8 words)
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Option 0 (Correct) updated to exact requested phrasing: *"Modify the RDS DB instances to use gp3 storage, which provides predictable baseline performance without gp2 capacity-based IOPS scaling."* (Avoiding customer-managed EBS framing or claiming universal independent IOPS scaling at all storage sizes).
  - Preserved Option 1 (RDS Storage Auto Scaling) as second correct answer.
  - Distractors [2], [3], and [4] expanded into 13–15 word technical choices explaining Glacier migration, Dedicated Hosts, and Single-AZ conversion.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (Migrate Active Database Files to S3 Glacier Deep Archive)**: WRONG. S3 Glacier Deep Archive is an offline cold archive storage class, not a high-performance block storage volume for live Amazon RDS MySQL databases.
  - **Option 3 (Switch DB Instances to Dedicated Hosts)**: WRONG. Dedicated Hosts provide physical server allocation for licensing and compliance; they do not alter RDS DB storage volume types or prevent storage volume over-provisioning.
  - **Option 4 (Convert RDS MySQL to Single-AZ with Manual Snapshots)**: WRONG. Converting to Single-AZ removes multi-AZ automated failover and high availability without reducing baseline gp2 storage volume over-provisioning costs.
- **Official AWS Documentation Areas Checked**:
  - Amazon RDS User Guide: *Amazon RDS DB Instance Storage (gp2 vs gp3)*
  - Amazon RDS User Guide: *Managing Capacity Automatically with Amazon RDS Storage Auto Scaling*
- **Final Result**: **PASS**

---

### 2. `q-saa-133`

- **Question ID**: `q-saa-133`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.71)
  - Longest option is at least 2.6 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D, E are unusually short (5-7 words)
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded into 14–15 word technical options explaining versioning deletion, S3 Transfer Acceleration, and Object Lock / MFA Delete.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (Disable S3 Versioning Permanently)**: WRONG. Disabling S3 Versioning stops creating *new* noncurrent versions, but does not delete existing noncurrent object versions or abort incomplete multipart uploads already stored in the bucket.
  - **Option 3 (Enable S3 Transfer Acceleration to Compress Uploads)**: WRONG. S3 Transfer Acceleration speeds up long-distance uploads via CloudFront edge locations; it does not compress data or abort incomplete multipart uploads.
  - **Option 4 (Configure S3 Object Lock with MFA Delete)**: WRONG. S3 Object Lock and MFA Delete prevent object deletion to protect against accidental or malicious data loss; they do not clean up or expire old noncurrent object versions.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *Deleting Incomplete Multipart Uploads Using a Lifecycle Rule*
  - Amazon S3 User Guide: *Managing Noncurrent Object Versions Using Lifecycle Rules*
- **Final Result**: **PASS**

---

### 3. `q-saa-136`

- **Question ID**: `q-saa-136`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.33)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D, E are unusually short (7-8 words)
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Option 1 (Correct) updated to exact requested phrasing and terminology: *"Create a CloudTrail organization trail in the management account that records events for all organization accounts and delivers the logs to the centralized S3 bucket in the Log Archive account."*
  - Term *"CloudTrail organization trail"* enforced consistently across question, options, explanation, and report.
  - Distractors [2], [3], and [4] expanded into 15–19 word technical choices explaining IAM AdministratorAccess, Transit Gateway inter-VPC peering, and Direct Connect Public VIFs.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (Create IAM Users in Member Accounts with AdministratorAccess)**: WRONG. Granting AdministratorAccess in member accounts allows local admins to stop CloudTrail logging or delete local trails, violating central security governance policies.
  - **Option 3 (Deploy Transit Gateway Inter-VPC Peering for Log Transfer)**: WRONG. Transit Gateway connects private VPC networks; CloudTrail logs are delivered natively to S3 over AWS internal service APIs without requiring Transit Gateway peering connections.
  - **Option 4 (Configure Direct Connect Public Virtual Interfaces)**: WRONG. Direct Connect Public VIFs connect on-premises data centers to public AWS service endpoints, not for inter-account CloudTrail log delivery to an S3 bucket in another AWS account.
- **Official AWS Documentation Areas Checked**:
  - AWS CloudTrail User Guide: *Creating a Trail for an Organization*
  - AWS Organizations User Guide: *Service Control Policies (SCPs) for AWS CloudTrail*
- **Final Result**: **PASS**

---

### 4. `q-saa-142`

- **Question ID**: `q-saa-142`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.86)
  - Longest option is at least 3.0 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D, E are unusually short (5-7 words)
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded into 14–15 word technical choices explaining single-AZ EC2 hosting, Volume Gateway container storage, and S3 Transfer Acceleration.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (Host Containers on Single-AZ EC2 Instances)**: WRONG. Hosting containers on single-AZ EC2 instances introduces single-points-of-failure and requires managing underlying EC2 cluster servers, violating both high availability and serverless requirements.
  - **Option 3 (Deploy Storage Gateway Volume Gateway for Container Images)**: WRONG. Storage Gateway is a hybrid cloud storage appliance for on-premises servers; it does not store ECS container images or manage task availability.
  - **Option 4 (Enable S3 Transfer Acceleration on Task Interfaces)**: WRONG. S3 Transfer Acceleration accelerates S3 uploads via edge locations; it does not optimize internal inter-container network communication or serverless task management.
- **Official AWS Documentation Areas Checked**:
  - Amazon Elastic Container Service Developer Guide: *AWS Fargate Launch Type Overview*
  - Amazon Elastic Container Service Developer Guide: *High Availability for Amazon ECS Services*
- **Final Result**: **PASS**

---

### 5. `q-saa-4`

- **Question ID**: `q-saa-4`
- **Original Risk Level**: CRITICAL (10 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.15)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D are unusually short (7-9 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 14–20 word technical choices explaining single-AZ EC2 MySQL migration, EBS storage/IOPS scaling, and CloudFront CDN caching.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Migrate RDS MySQL to Single-AZ EC2 with Manual EBS Snapshots)**: WRONG. Self-hosting MySQL on a single-AZ EC2 instance removes automated failover, increases operational management overhead, and fails read scaling requirements.
  - **Option 2 (Increase EBS Storage Volume Size and Provisioned IOPS)**: WRONG. Increasing EBS storage capacity or IOPS increases disk performance on the primary instance, but does not scale read throughput for read-heavy workloads or provide automatic regional failover.
  - **Option 3 (Configure Amazon CloudFront Caching in Front of RDS Endpoint)**: WRONG. CloudFront caches HTTP/HTTPS web content at edge locations; it cannot terminate SQL connections or cache database queries for RDS MySQL.
- **Official AWS Documentation Areas Checked**:
  - Amazon RDS User Guide: *High Availability (Multi-AZ) for Amazon RDS*
  - Amazon RDS User Guide: *Working with RDS Read Replicas*
- **Final Result**: **PASS**

---

### 6. `q-saa-10`

- **Question ID**: `q-saa-10`
- **Original Risk Level**: CRITICAL (10 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.78)
  - Longest option is at least 2.67 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors A, C, D are unusually short (3-4 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to exact requested phrasing: *"Create Route 53 latency alias records for both regional Application Load Balancers and enable Evaluate Target Health on each record."* (Leveraging native ALB health evaluation without requiring separate Route 53 health checks).
  - Distractors [0], [2], and [3] expanded into 16–18 word technical choices explaining Weighted, Geolocation, and Failover routing policies.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Route 53 Weighted Routing Policy)**: WRONG. Weighted routing distributes DNS queries based on static ratios (e.g. 50/50); it does not evaluate client network latency to route users to the nearest Region.
  - **Option 2 (Route 53 Geolocation Routing Policy)**: WRONG. Geolocation routing routes traffic based on client geographic location; it does not measure network latency or dynamically route to the lowest-latency Region.
  - **Option 3 (Route 53 Failover Routing Policy)**: WRONG. Failover routing enforces an Active-Passive model where all traffic goes to the primary Region; it does not route traffic active-active to the lowest-latency Region.
- **Official AWS Documentation Areas Checked**:
  - Amazon Route 53 Developer Guide: *Latency-Based Routing*
  - Amazon Route 53 Developer Guide: *Evaluating Target Health for Alias Records*
- **Final Result**: **PASS**

---

### 7. `q-saa-36`

- **Question ID**: `q-saa-36`
- **Original Risk Level**: CRITICAL (10 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 1.67 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors A, C, D are unusually short (3-4 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 15–16 word technical options explaining AWS Shield Standard, Amazon GuardDuty, and AWS Firewall Manager.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Enable AWS Shield Standard for Layer 7 Inspection)**: WRONG. AWS Shield Standard provides automatic Layer 3/4 DDoS protection; it does not inspect Layer 7 HTTP payloads for custom SQL injection or XSS rules.
  - **Option 2 (Enable Amazon GuardDuty at Load Balancer)**: WRONG. GuardDuty is an asynchronous threat detection service that analyzes log sources; it is not an inline Layer 7 web application firewall.
  - **Option 3 (Deploy AWS Firewall Manager for Header Rewriting)**: WRONG. Firewall Manager is a security management service that centrally configures and deploys WAF rules across accounts; it is not the inline firewall engine itself.
- **Official AWS Documentation Areas Checked**:
  - AWS WAF Developer Guide: *How AWS WAF Works*
  - AWS Shield Developer Guide: *AWS Shield Standard vs AWS WAF*
- **Final Result**: **PASS**

---

### 8. `q-saa-41`

- **Question ID**: `q-saa-41`
- **Original Risk Level**: CRITICAL (10 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.12)
  - Longest option is at least 2.6 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors D, E, F are unusually short (5-6 words)
- **What Was Changed**:
  - Distractors [3], [4], and [5] expanded into 10–14 word technical choices explaining EC2 Dedicated Hosts, Snowball Edge, and EBS gp3 Multi-Attach.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0, 1, and 2 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 3 (Amazon EC2 Dedicated Hosts)**: WRONG. Dedicated Hosts provide physical server allocation for licensing and compliance; they are not a serverless compute service for event-driven pipelines.
  - **Option 4 (AWS Snowball Edge Storage Optimized)**: WRONG. Snowball Edge is an offline physical data transport device, not an event-driven online message processing component.
  - **Option 5 (Amazon EBS gp3 Multi-Attach Volumes)**: WRONG. EBS volumes provide block storage for EC2 instances; they cannot receive or buffer HTTP order submissions for serverless queues.
- **Official AWS Documentation Areas Checked**:
  - AWS Serverless Application Model Developer Guide: *Serverless Event-Driven Architectures*
  - Amazon SQS Developer Guide: *SQS with AWS Lambda Triggers*
- **Final Result**: **PASS**

---

### 9. `q-saa-48`

- **Question ID**: `q-saa-48`
- **Original Risk Level**: CRITICAL (10 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.89)
  - Longest option is at least 2.44 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor D is unusually short (7 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into 16–19 word technical choices explaining User Pools only, Identity Pools with IAM keys, and IAM Identity Center.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Amazon Cognito User Pools Only)**: WRONG. User Pools handle user sign-up, sign-in, and OIDC/JWT token issuance; they do not issue temporary AWS IAM credentials required for direct S3 API uploads.
  - **Option 2 (Amazon Cognito Identity Pools Only with IAM User Keys)**: WRONG. Storing static IAM user access keys in mobile application code violates security best practices and bypasses user authentication.
  - **Option 3 (AWS IAM Identity Center with CloudFront)**: WRONG. IAM Identity Center manages workforce single sign-on access to AWS accounts and applications; it is not designed for mobile app end-user registration and social identity federation.
- **Official AWS Documentation Areas Checked**:
  - Amazon Cognito Developer Guide: *Comparing User Pools and Identity Pools*
  - Amazon Cognito Developer Guide: *Authenticating Users for Direct S3 Access*
- **Final Result**: **PASS**

---

### 10. `q-saa-54`

- **Question ID**: `q-saa-54`
- **Original Risk Level**: CRITICAL (10 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.80)
  - Longest option is at least 2.25 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors A, C, D are unusually short (3-4 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 13–15 word technical choices explaining Transit Gateway Peering, VPC Peering, and IAM Identity Center.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (AWS Transit Gateway Inter-Region Peering)**: WRONG. Transit Gateway inter-Region peering connects separate Transit Gateways across Regions; it does not share VPC subnets across AWS accounts.
  - **Option 2 (VPC Peering Connections)**: WRONG. VPC Peering connects separate VPC networks for IP routing; it does not allow launching EC2 instances directly into shared VPC subnets in another account.
  - **Option 3 (AWS IAM Identity Center)**: WRONG. IAM Identity Center manages workforce single sign-on access; it does not share VPC infrastructure resources like subnets across AWS accounts.
- **Official AWS Documentation Areas Checked**:
  - AWS Resource Access Manager User Guide: *Sharing VPC Subnets across Accounts*
  - Amazon VPC User Guide: *VPC Sharing Architecture and Permissions*
- **Final Result**: **PASS**

---

## Final Validation Checklist

- [x] **Exactly 10 questions**: Verified (10/10)
- [x] **All IDs are unique**: Verified (`q-saa-132`, `q-saa-133`, `q-saa-136`, `q-saa-142`, `q-saa-4`, `q-saa-10`, `q-saa-36`, `q-saa-41`, `q-saa-48`, `q-saa-54`)
- [x] **No Batches 01 to 05 IDs reused**: Verified zero overlap with any of the 50 previous IDs
- [x] **All IDs exist in original bank**: Verified against `data/saa-c03-question-export.json`
- [x] **No unrelated questions changed**: Verified
- [x] **All options non-empty**: Verified
- [x] **Correct indexes valid**: Verified (0-indexed)
- [x] **Answer counts match question type**:
  - `single` type: 1 correct answer index matching `correctAnswer` & `correctAnswers[0]`
  - `multiple` type: matching 2 or 3 correct answer indexes
- [x] **Option lengths balanced**: Max vs min option length ratio <= 2.00x across all questions
- [x] **No obvious or joke distractors**: Verified
- [x] **No multiple defensible answers**: Verified
- [x] **No outdated pricing or exact unsupported limits**: Verified
- [x] **User Corrections Enforced**:
  - `q-saa-132`: RDS gp3 storage modification wording applied without customer-managed EBS framing or independent IOPS scaling claims at all sizes
  - `q-saa-136`: Official term **CloudTrail organization trail** enforced consistently across question, options, explanation, and report
  - `q-saa-10`: Route 53 latency alias records with Evaluate Target Health applied natively
- [x] **All 10 questions received PASS status**: Verified (10/10 PASS)
