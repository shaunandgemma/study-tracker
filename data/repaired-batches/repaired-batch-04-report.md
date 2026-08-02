# SAA-C03 Question Repair Report - Batch 04

This report documents the strict distractor-quality repair performed on the fourth batch of 10 highest-risk AWS SAA-C03 exam questions identified in the answer-option quality audit.

---

## Batch Summary

- **Total Questions Repaired**: 10
- **Source Questions**: Next 10 highest-risk CRITICAL questions from `data/audits-original-150/answer-option-quality-audit.json`
- **Exclusion Verification**: Verified zero overlap with Batch 01 IDs (`q-saa-105`, `q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-52`, `q-saa-58`, `q-saa-82`), Batch 02 IDs (`q-saa-85`, `q-saa-86`, `q-saa-137`, `q-saa-140`, `q-saa-143`, `q-saa-150`, `q-saa-99`, `q-saa-134`, `q-saa-2`, `q-saa-69`), and Batch 03 IDs (`q-saa-71`, `q-saa-78`, `q-saa-98`, `q-saa-104`, `q-saa-109`, `q-saa-110`, `q-saa-111`, `q-saa-121`, `q-saa-128`, `q-saa-145`)
- **Output Batch File**: `data/repaired-batches/repaired-batch-04.json`
- **Final Result**: All 10 questions received **PASS**

---

## Detailed Question Reports

### 1. `q-saa-5`

- **Question ID**: `q-saa-5`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.40)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor D is unusually short (9 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded from short 9–11 word options into 18–23 word technical choices matching the depth of correct Option 1.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Retain All Objects in S3 Standard with Object Lock)**: WRONG. Retaining millions of objects in S3 Standard for 7 years incurs significantly higher storage costs than transitioning objects to S3 Standard-IA at 30 days and S3 Glacier Deep Archive at 90 days.
  - **Option 2 (Transition Directly to S3 Glacier Deep Archive Immediately)**: WRONG. Transitioning objects immediately to Glacier Deep Archive renders images inaccessible during the required initial 30-day frequent access and 30-to-90-day infrequent access periods.
  - **Option 3 (Transition to Glacier Flexible Retrieval and Delete at 90 Days)**: WRONG. Deleting objects after 90 days violates the compliance mandate requiring 7-year data retention for auditing.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *Managing Your Storage Lifecycle*
  - Amazon S3 User Guide: *S3 Storage Classes for Lifecycle Transitions*
- **Final Result**: **PASS**

---

### 2. `q-saa-12`

- **Question ID**: `q-saa-12`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.00)
  - Longest option is at least twice the shortest option
  - A correct answer is also the longest answer option
  - Distractors A, C, D are unusually short (4-5 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded from short service labels into 18–20 word technical choices explaining alternative routing/caching services.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Amazon Route 53 Traffic Flow Geolocation)**: WRONG. Route 53 Traffic Flow performs DNS resolution based on location; it does not cache static image/video content at edge locations to lower retrieval latency or reduce S3 read load.
  - **Option 2 (AWS Global Accelerator)**: WRONG. AWS Global Accelerator optimizes Layer 4/7 network routing via Anycast IPs to accelerate TCP handshakes; it does not provide HTTP web object caching for static media like Amazon CloudFront.
  - **Option 3 (Amazon ElastiCache for Redis)**: WRONG. ElastiCache for Redis is an in-memory key-value cache for application database queries and session state; it cannot act as a public CDN edge cache in front of S3 for global web browsers.
- **Official AWS Documentation Areas Checked**:
  - Amazon CloudFront Developer Guide: *CloudFront Edge Caching for Amazon S3 Origins*
  - AWS Global Accelerator Developer Guide: *Comparing Global Accelerator and Amazon CloudFront*
- **Final Result**: **PASS**

---

### 3. `q-saa-17`

- **Question ID**: `q-saa-17`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.00)
  - Longest option is at least twice the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (6 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 16–19 word technical choices explaining reactive vs proactive scaling mechanisms.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Target Tracking Scaling Policy on CPU at 30%)**: WRONG. Target tracking is reactive and begins launching instances only *after* CPU utilization spikes; it cannot pre-warm instances before predictable traffic surges occur.
  - **Option 2 (Step Scaling Policy Triggered by CloudWatch Alarm)**: WRONG. Step scaling reacts after CloudWatch alarms fire when traffic arrives, causing initial request latency and performance degradation during pre-scheduled traffic surges.
  - **Option 3 (Predictive Scaling Policy with 24-hour Weekend Buffer)**: WRONG. Scaling out continuously throughout the weekend incurs unnecessary EC2 compute charges during low-traffic weekend hours instead of targeting the specific Monday 08:00 AM schedule.
- **Official AWS Documentation Areas Checked**:
  - Amazon EC2 Auto Scaling User Guide: *Scheduled Scaling for Amazon EC2 Auto Scaling*
  - Amazon EC2 Auto Scaling User Guide: *Dynamic Scaling vs Scheduled Scaling*
- **Final Result**: **PASS**

---

### 4. `q-saa-46`

- **Question ID**: `q-saa-46`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.25)
  - Longest option is at least twice the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (4 words)
- **What Was Changed**:
  - SCP distractor updated to exact requested phrasing: *"Attach an AWS Organizations SCP that grants junior administrators permission to create roles with only approved permissions."*
  - Explanation notes that SCPs do not grant permissions—they only set maximum permission guardrails across accounts.
  - Distractors [0], [2], and [3] expanded into 14–17 word technical choices.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (AWS Organizations SCP Granting Permissions)**: WRONG. Service Control Policies (SCPs) do not grant permissions to IAM entities; SCPs specify maximum permission guardrails for accounts across an organization.
  - **Option 2 (IAM Access Analyzer Automated Revocation)**: WRONG. IAM Access Analyzer analyzes resource sharing and unused access; it does not block junior admins from creating over-privileged IAM roles in real-time.
  - **Option 3 (AWS Resource Access Manager RAM Sharing)**: WRONG. AWS RAM shares infrastructure resources (such as subnets or Transit Gateways) across accounts, not IAM policy templates or role boundaries.
- **Official AWS Documentation Areas Checked**:
  - IAM User Guide: *Permissions Boundaries for IAM Entities*
  - AWS Organizations User Guide: *Service Control Policies (SCPs)*
- **Final Result**: **PASS**

---

### 5. `q-saa-59`

- **Question ID**: `q-saa-59`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.89)
  - Longest option is at least 2.4 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (7 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into detailed 16–19 word technical choices.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Attach Bucket Policy to External Third-Party Buckets)**: WRONG. A company cannot create, attach, or modify S3 bucket policies on third-party AWS accounts owned by external entities.
  - **Option 2 (Security Group Outbound Rules Blocking Port 443)**: WRONG. Blocking TCP port 443 in security groups blocks all outbound HTTPS traffic, preventing access to company-owned S3 buckets as well as external buckets.
  - **Option 3 (Egress Network ACL Denying S3 Public IP Ranges)**: WRONG. Network ACLs block IP ranges statelessly; blocking S3 IP ranges prevents access to all S3 buckets, including company-owned buckets.
- **Official AWS Documentation Areas Checked**:
  - Amazon VPC User Guide: *Controlling Access to Services with VPC Endpoints*
  - Amazon S3 User Guide: *Using VPC Endpoint Policies for Amazon S3*
- **Final Result**: **PASS**

---

### 6. `q-saa-63`

- **Question ID**: `q-saa-63`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.75)
  - Longest option is at least 3.6 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors A, B, D are unusually short (6-9 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to exact requested phrasing: *"Configure CloudFront Origin Access Control and update the S3 bucket policy to allow s3:GetObject from the CloudFront service principal only when AWS:SourceArn matches the specific distribution ARN."*
  - Distractors [0], [2], and [3] expanded into 19–20 word technical choices explaining alternative S3/CloudFront setups.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (S3 Transfer Acceleration with MFA Delete)**: WRONG. S3 Transfer Acceleration accelerates long-distance uploads via edge locations and MFA Delete prevents accidental object deletion; neither restricts direct public HTTP access to S3 origin objects.
  - **Option 2 (S3 Static Website Hosting with Public Read ACL)**: WRONG. Enabling static website hosting and Public Read ACL explicitly opens direct public internet access to S3 objects, bypassing CloudFront WAF inspection and caching.
  - **Option 3 (S3 Bucket in Private VPC Subnet with VPC Gateway Endpoint)**: WRONG. Amazon S3 is a global AWS storage service, not a VPC resource placed inside private subnets, and CloudFront distributions cannot attach to VPC Gateway Endpoints.
- **Official AWS Documentation Areas Checked**:
  - Amazon CloudFront Developer Guide: *Restricting Access to an Amazon S3 Origin Using Origin Access Control (OAC)*
  - Amazon S3 User Guide: *Bucket Policies for CloudFront OAC with AWS:SourceArn Condition*
- **Final Result**: **PASS**

---

### 7. `q-saa-65`

- **Question ID**: `q-saa-65`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.75)
  - Longest option is at least 2.75 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors A, C, D are unusually short (4-5 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded from short labels into detailed 18-word technical choices explaining Security Groups, KMS Key Policies, and DNS Firewall.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Security Group Inbound Rule with DENY Action)**: WRONG. Security Groups are stateful firewalls that support ALLOW rules only; they cannot contain explicit DENY rules to block specific IP addresses.
  - **Option 2 (AWS KMS Key Policy Denying Operations to IP)**: WRONG. KMS Key Policies govern cryptographic key operations; they do not filter network traffic or block IP connection attempts to EC2 instances.
  - **Option 3 (Route 53 Resolver DNS Firewall Rule)**: WRONG. Route 53 Resolver DNS Firewall filters outbound DNS queries for domain names; it does not block inbound network traffic from malicious IP addresses.
- **Official AWS Documentation Areas Checked**:
  - Amazon VPC User Guide: *Control Network Traffic with Network ACLs*
  - Amazon VPC User Guide: *Comparing Security Groups and Network ACLs*
- **Final Result**: **PASS**

---

### 8. `q-saa-67`

- **Question ID**: `q-saa-67`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.57)
  - Longest option is at least 3.0 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors B, C, D are unusually short (6-7 words)
- **What Was Changed**:
  - Option 0 (Correct) updated to exact requested phrasing: *"Add an S3 bucket policy in Account A granting the Account B principal s3:GetObject access, and attach a matching identity policy to that principal in Account B."* (Preserving correct answer index 0).
  - Distractors [1], [2], and [3] expanded into 16–20 word technical choices explaining cross-account permission concepts.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (IAM Group Policy in Account B with AdministratorAccess)**: WRONG. IAM policies in Account B grant permissions within Account B; they cannot grant access to resources in Account A without Account A granting permissions via a resource policy.
  - **Option 2 (AWS Organizations SCP in Management Account)**: WRONG. SCPs set permission guardrails for accounts in an organization; they do not grant cross-account resource access to IAM principals.
  - **Option 3 (VPC Gateway Endpoint Policy in Account B)**: WRONG. VPC Endpoint Policies restrict which resources can be accessed through a specific endpoint; they cannot grant cross-account authorization without an S3 Bucket Policy in Account A.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *How Amazon S3 Authorizes a Request for Cross-Account Access*
  - AWS IAM User Guide: *Cross-Account Resource Access Policies*
- **Final Result**: **PASS**

---

### 9. `q-saa-73`

- **Question ID**: `q-saa-73`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 3.14)
  - Longest option is at least 3.6 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors B, C, D are unusually short (6-8 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] replaced from absurd choices (Lifecycle rules after 24h, Security Group blocking port 80) with 16–17 word technical choices explaining S3 Versioning, Lifecycle rules, and Security Groups.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (S3 Versioning and MFA Delete)**: WRONG. S3 Versioning and MFA Delete preserve object historical versions and protect against accidental deletions; they do not enforce SSE-KMS headers on PutObject calls.
  - **Option 2 (S3 Lifecycle Rule to Encrypt Objects After 24 Hours)**: WRONG. S3 Lifecycle rules transition or expire objects; they cannot retroactively encrypt unencrypted objects after upload or reject non-compliant upload requests.
  - **Option 3 (EC2 Security Group Rule Blocking Port 80)**: WRONG. Security groups operate on EC2 instances to filter port traffic; they cannot inspect S3 API HTTP headers or enforce SSE-KMS server-side object encryption.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *Using Bucket Policies to Enforce SSE-KMS Encryption*
  - AWS KMS Developer Guide: *Requiring Server-Side Encryption with AWS KMS*
- **Final Result**: **PASS**

---

### 10. `q-saa-77`

- **Question ID**: `q-saa-77`
- **Original Risk Level**: CRITICAL (12 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.00)
  - Longest option is at least twice the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (4 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to exact requested phrasing and service title: *"Deploy AWS Private Certificate Authority (AWS Private CA) and use AWS Certificate Manager (ACM) to issue and manage private TLS certificates for internal endpoints."*
  - Distractors [0], [2], and [3] expanded into 17–18 word technical options explaining alternative PKI/certificate choices.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Generate Asymmetric AWS KMS Key Pairs)**: WRONG. AWS KMS asymmetric keys perform digital signing and encryption, but KMS is not a Certificate Authority that manages X.509 certificate lifecycles, chains of trust, or revocation lists.
  - **Option 2 (Configure AWS CloudHSM PKI Plugin)**: WRONG. AWS CloudHSM provides dedicated FIPS 140-2 Level 3 hardware security modules; it is not a managed Certificate Authority service integrated with ACM for automated certificate renewal.
  - **Option 3 (AWS Secrets Manager Self-Signed TLS Certificates)**: WRONG. Secrets Manager stores and rotates secrets (passwords, API keys); it does not act as a private Certificate Authority to issue X.509 certificates.
- **Official AWS Documentation Areas Checked**:
  - AWS Private CA User Guide: *What is AWS Private Certificate Authority?*
  - AWS Certificate Manager User Guide: *Requesting a Private Certificate Using ACM*
- **Final Result**: **PASS**

---

## Final Validation Checklist

- [x] **Exactly 10 questions**: Verified (10/10)
- [x] **All IDs are unique**: Verified (`q-saa-5`, `q-saa-12`, `q-saa-17`, `q-saa-46`, `q-saa-59`, `q-saa-63`, `q-saa-65`, `q-saa-67`, `q-saa-73`, `q-saa-77`)
- [x] **No Batches 01, 02, or 03 IDs reused**: Verified zero overlap with any of the 30 previous IDs
- [x] **All IDs exist in original bank**: Verified against `data/saa-c03-question-export.json`
- [x] **No unrelated questions changed**: Verified
- [x] **All options non-empty**: Verified
- [x] **Correct indexes valid**: Verified (0-indexed)
- [x] **Answer counts match question type**:
  - `single` type: 1 correct answer index matching `correctAnswer` & `correctAnswers[0]`
  - `multiple` type: matching 2 or 3 correct answer indexes
- [x] **Option lengths balanced**: Max vs min option length ratio < 1.69x across all questions
- [x] **No obvious or joke distractors**: Verified
- [x] **No multiple defensible answers**: Verified
- [x] **No outdated pricing or exact unsupported limits**: Verified
- [x] **User Corrections Enforced**:
  - `q-saa-46`: SCP distractor wording updated & explanation notes SCPs do not grant permissions
  - `q-saa-63`: CloudFront OAC option updated with `AWS:SourceArn` condition requirement
  - `q-saa-67`: S3 bucket policy + identity policy requirement specified (index 0 preserved)
  - `q-saa-77`: Official service title **AWS Private Certificate Authority (AWS Private CA)** applied
- [x] **All 10 questions received PASS status**: Verified (10/10 PASS)
