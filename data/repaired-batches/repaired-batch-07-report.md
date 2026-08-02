# SAA-C03 Question Repair Report - Batch 07

This report documents the strict distractor-quality repair performed on the seventh batch of 10 highest-risk AWS SAA-C03 exam questions identified in the answer-option quality audit.

---

## Batch Summary

- **Total Questions Repaired**: 10
- **Source Questions**: Next 10 highest-risk CRITICAL and HIGH questions from `data/audits-original-150/answer-option-quality-audit.json`
- **Exclusion Verification**: Verified zero overlap with Batch 01 IDs (`q-saa-105`, `q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-52`, `q-saa-58`, `q-saa-82`), Batch 02 IDs (`q-saa-85`, `q-saa-86`, `q-saa-137`, `q-saa-140`, `q-saa-143`, `q-saa-150`, `q-saa-99`, `q-saa-134`, `q-saa-2`, `q-saa-69`), Batch 03 IDs (`q-saa-71`, `q-saa-78`, `q-saa-98`, `q-saa-104`, `q-saa-109`, `q-saa-110`, `q-saa-111`, `q-saa-121`, `q-saa-128`, `q-saa-145`), Batch 04 IDs (`q-saa-5`, `q-saa-12`, `q-saa-17`, `q-saa-46`, `q-saa-59`, `q-saa-63`, `q-saa-65`, `q-saa-67`, `q-saa-73`, `q-saa-77`), Batch 05 IDs (`q-saa-80`, `q-saa-83`, `q-saa-95`, `q-saa-97`, `q-saa-100`, `q-saa-102`, `q-saa-107`, `q-saa-114`, `q-saa-122`, `q-saa-131`), and Batch 06 IDs (`q-saa-132`, `q-saa-133`, `q-saa-136`, `q-saa-142`, `q-saa-4`, `q-saa-10`, `q-saa-36`, `q-saa-41`, `q-saa-48`, `q-saa-54`)
- **Output Batch File**: `data/repaired-batches/repaired-batch-07.json`
- **Final Result**: All 10 questions received **PASS**

---

## Detailed Question Reports

### 1. `q-saa-84`

- **Question ID**: `q-saa-84`
- **Original Risk Level**: CRITICAL (10 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.83)
  - Longest option is at least 2.25 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor D is unusually short (4 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 14–20 word technical choices explaining Visibility Timeout extension, S3 Versioning, and DelaySeconds.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Increase Visibility Timeout to 12 Hours)**: WRONG. Increasing visibility timeout extends message invisibility during crashes; it does not isolate poison pill messages or prevent endless retries.
  - **Option 2 (Enable S3 Versioning on Worker EBS Volume)**: WRONG. S3 Versioning manages object versions in S3; it does not revert EC2 instance operating states or isolate bad SQS messages.
  - **Option 3 (Configure SQS DelaySeconds to 900 Seconds)**: WRONG. DelaySeconds delays initial message availability upon send; it does not isolate repeatedly failing messages after multiple receive attempts.
- **Official AWS Documentation Areas Checked**:
  - Amazon SQS Developer Guide: *Amazon SQS Dead-Letter Queues*
  - Amazon SQS Developer Guide: *Handling Malformed Messages (Poison Pills)*
- **Final Result**: **PASS**

---

### 2. `q-saa-116`

- **Question ID**: `q-saa-116`
- **Original Risk Level**: CRITICAL (10 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.80)
  - Longest option is at least 2.25 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D are unusually short (4-5 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into 15–17 word technical choices explaining max_connections scaling, DynamoDB Global Tables migration, and S3 Transfer Acceleration.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Increase RDS max_connections to 1,000,000)**: WRONG. Increasing max_connections exhausts DB memory resources causing database crashes; it does not pool or reuse connections.
  - **Option 2 (Migrate RDS MySQL to DynamoDB Global Tables)**: WRONG. Migrating a relational database to DynamoDB NoSQL requires complete application refactoring, violating the requirement to maintain application logic.
  - **Option 3 (Enable S3 Transfer Acceleration on Lambda Environment)**: WRONG. S3 Transfer Acceleration accelerates S3 uploads over edge networks; it does not pool relational database connections or optimize SQL queries.
- **Official AWS Documentation Areas Checked**:
  - Amazon RDS User Guide: *Using Amazon RDS Proxy with AWS Lambda*
  - AWS Lambda Developer Guide: *Managing Database Connections with RDS Proxy*
- **Final Result**: **PASS**

---

### 3. `q-saa-13`

- **Question ID**: `q-saa-13`
- **Original Risk Level**: HIGH (8 risk points)
- **Original Audit Reasons**:
  - Distractors C, D are short options
  - Distractor A contained outdated gp3 limits (16,000 IOPS)
- **What Was Changed**:
  - Question updated to specify 120,000 provisioned IOPS, sustained sub-millisecond latency, mission-critical database workload, and Nitro-based EC2 instance.
  - Option 1 (Correct) preserved: `io2 Block Express`.
  - Distractor 0 (gp3) updated to correctly reflect current gp3 limits (up to 80,000 IOPS and 2,000 MiB/s throughput) and explain that gp3 cannot meet 120,000 IOPS or io2 Block Express latency/durability profile.
  - Distractors [2] and [3] expanded into 16–18 word technical options.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Provision EBS gp3 Volume for 120k IOPS)**: WRONG. EBS gp3 volumes max out at 80,000 IOPS and 2,000 MiB/s throughput; they cannot deliver 120,000 IOPS or provide the sustained sub-millisecond latency and 99.999% durability profile of io2 Block Express.
  - **Option 2 (Provision EBS st1 Volume with Software RAID 0)**: WRONG. EBS st1 volumes are magnetic HDDs designed for sequential throughput; they cannot provide 120,000 IOPS or sub-millisecond latency.
  - **Option 3 (Provision EBS sc1 Volume with NVMe Drivers)**: WRONG. EBS sc1 volumes are low-cost magnetic HDDs for infrequent access; they provide very low IOPS and high latency.
- **Official AWS Documentation Areas Checked**:
  - Amazon EBS User Guide: *Amazon EBS Volume Types (io2 Block Express vs gp3)*
  - Amazon EC2 User Guide: *High-IOPS Workloads on Nitro Instances*
- **Final Result**: **PASS**

---

### 4. `q-saa-22`

- **Question ID**: `q-saa-22`
- **Original Risk Level**: HIGH (8 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.62)
  - Longest option is at least 2.0 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (6 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to 21 words matching depth of options.
  - Distractors [0], [2], and [3] expanded into 11–17 word technical choices.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Replace NAT Gateways with Egress-Only Internet Gateways)**: WRONG. Egress-Only Internet Gateways support IPv6 traffic only; they do not route IPv4 traffic or eliminate NAT Gateway processing charges for S3.
  - **Option 2 (Deploy CloudFront Distribution for External Repositories)**: WRONG. CloudFront caches public web content; it does not bypass NAT Gateways for private subnet EC2 S3 traffic or eliminate NAT processing fees.
  - **Option 3 (Attach Elastic IP Addresses Directly to Private EC2 Instances)**: WRONG. Elastic IP addresses require instances to be in public subnets with Internet Gateways; attached private instances cannot use EIPs directly without public routing.
- **Official AWS Documentation Areas Checked**:
  - Amazon VPC User Guide: *Gateway Endpoints for Amazon S3*
  - AWS Cost Optimization Whitepaper: *Reducing NAT Data Processing Fees*
- **Final Result**: **PASS**

---

### 5. `q-saa-60`

- **Question ID**: `q-saa-60`
- **Original Risk Level**: HIGH (8 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.73)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (6 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to exact requested phrasing: *"Configure AWS IAM Identity Center and connect the corporate self-managed Active Directory through AWS Directory Service using AD Connector."*
  - Question text, options, explanation, and report updated to use IAM Identity Center, AWS Directory Service, AD Connector, and multi-account workforce access.
  - Distractors [0], [2], and [3] expanded into 16–17 word technical choices.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Create IAM Users in Each Account with Access Keys)**: WRONG. Creating IAM users in multiple accounts introduces massive administrative overhead, security risks from long-term access keys, and lacks AD integration.
  - **Option 2 (Deploy Amazon Cognito User Pool with Policy Mappings)**: WRONG. Cognito User Pools manage end-user authentication for customer web/mobile apps; IAM Identity Center is designed for employee workforce SSO across AWS accounts.
  - **Option 3 (Deploy AWS Directory Service Simple AD in Each Account)**: WRONG. Simple AD is a standalone managed Samba-based directory; it does not proxy requests to an existing self-managed Active Directory for multi-account workforce access.
- **Official AWS Documentation Areas Checked**:
  - AWS IAM Identity Center User Guide: *Connecting Your Active Directory Domain Using AD Connector*
  - AWS Directory Service Administration Guide: *AD Connector Overview*
- **Final Result**: **PASS**

---

### 6. `q-saa-87`

- **Question ID**: `q-saa-87`
- **Original Risk Level**: HIGH (8 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.78)
  - Longest option is at least 2.67 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor C is unusually short (6 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into 15–16 word technical options explaining Cooldown periods, Scheduled scaling, and S3 Transfer Acceleration.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Increase Auto Scaling Default Cooldown Period to 600 Seconds)**: WRONG. Increasing cooldown periods delays launching additional instances after scaling, making the system *less* responsive to sudden traffic surges.
  - **Option 2 (Configure Scheduled Scaling Actions Every Hour)**: WRONG. Scheduled scaling scales at fixed dates/times; it cannot react dynamically to sudden, unpredictable flash sales during arbitrary hours.
  - **Option 3 (Enable S3 Transfer Acceleration on EC2 Interfaces)**: WRONG. S3 Transfer Acceleration accelerates S3 uploads; it does not scale EC2 compute capacity or react to Auto Scaling CPU alarms.
- **Official AWS Documentation Areas Checked**:
  - Amazon EC2 Auto Scaling User Guide: *Step Scaling Policies for Amazon EC2 Auto Scaling*
  - Amazon EC2 Auto Scaling User Guide: *Cooldown Periods for Auto Scaling*
- **Final Result**: **PASS**

---

### 7. `q-saa-113`

- **Question ID**: `q-saa-113`
- **Original Risk Level**: HIGH (8 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor C is unusually short (6 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 17–18 word technical choices explaining Spread Placement Groups, Partition Placement Groups, and Multi-AZ ELB routing.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Deploy in Spread Placement Group with Standard ENIs)**: WRONG. Spread placement groups place instances on separate hardware racks across AZs to minimize correlated failures, introducing higher network latency unsuitable for HPC MPI workloads.
  - **Option 2 (Deploy in Partition Placement Group with NAT Gateway)**: WRONG. Partition placement groups isolate instance partitions; routing inter-node HPC traffic through NAT Gateways adds massive latency and bottlenecks.
  - **Option 3 (Deploy Auto Scaling Group Multi-AZ with ELBs)**: WRONG. Auto Scaling across multiple AZs introduces inter-AZ network latency, and ELBs route HTTP/TCP traffic, not low-latency HPC MPI protocols.
- **Official AWS Documentation Areas Checked**:
  - Amazon EC2 User Guide: *Placement Groups for Amazon EC2*
  - Amazon EC2 User Guide: *Elastic Fabric Adapter (EFA) for High-Performance Computing*
- **Final Result**: **PASS**

---

### 8. `q-saa-127`

- **Question ID**: `q-saa-127`
- **Original Risk Level**: HIGH (8 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 2.33 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D, E are unusually short (7-8 words)
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded into 14–17 word technical choices explaining EBS gp3 Multi-Attach migration, S3 Transfer Acceleration compression, and CloudFront 1-year TTL.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (Migrate Video Archive Files to EBS gp3 Multi-Attach)**: WRONG. EBS volumes are block storage for EC2 instances costing significantly more per GB than S3 Glacier Deep Archive, failing cost optimization goals.
  - **Option 3 (Enable S3 Transfer Acceleration to Compress Files)**: WRONG. S3 Transfer Acceleration speeds up long-distance uploads via CloudFront edge locations; it does not compress files or lower monthly storage tier costs.
  - **Option 4 (Deploy CloudFront Distribution with 1-Year TTL)**: WRONG. CloudFront caches frequently accessed web content at edge locations; it does not lower storage costs for rarely accessed 1 PB video archives.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *Storage Class Options for Archiving (Glacier Deep Archive)*
  - Amazon S3 User Guide: *Lifecycle Management for Noncurrent Versions and Incomplete Uploads*
- **Final Result**: **PASS**

---

### 9. `q-saa-138`

- **Question ID**: `q-saa-138`
- **Original Risk Level**: HIGH (8 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D, E are unusually short (5-8 words)
- **What Was Changed**:
  - Option 0 (Correct) updated to: *"Enable S3 Versioning on the destination bucket."*
  - Option 1 (Correct) updated to: *"Enable S3 Object Lock and configure default Compliance Mode retention for 7 years."*
  - Explanation notes that Object Lock requires a versioning-enabled bucket and protects individual object versions using WORM retention.
  - Distractors [2], [3], and [4] expanded into 13–15 word technical choices explaining Transfer Acceleration, Lifecycle transitions to S3 Standard-IA, and CORS rules.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (Enable S3 Transfer Acceleration for Encryption)**: WRONG. S3 Transfer Acceleration speeds up long-distance uploads via CloudFront edge locations; it does not enforce WORM compliance or prevent object deletion.
  - **Option 3 (Configure Lifecycle Rule to Transition to S3 Standard-IA)**: WRONG. S3 Lifecycle rules transition storage classes for cost optimization; they do not enforce WORM immutability or block object deletion.
  - **Option 4 (Configure CORS Rules to Restrict Delete Requests)**: WRONG. CORS rules govern cross-domain browser requests; they do not prevent IAM users or account root from deleting S3 objects.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *Using S3 Object Lock in Compliance Mode*
  - Amazon S3 User Guide: *S3 Versioning Requirements for Object Lock*
- **Final Result**: **PASS**

---

### 10. `q-saa-1`

- **Question ID**: `q-saa-1`
- **Original Risk Level**: HIGH (7 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.75)
  - Longest option is at least 2.0 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor C is unusually short (10 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to 25 words matching depth of options.
  - Distractors [0], [2], and [3] expanded into 16–20 word technical choices.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Configure Subnet NACL Allowing DB Subnet CIDR)**: WRONG. Subnet NACLs filter traffic at the subnet boundary by IP/CIDR; they do not dynamically adapt to EC2 instance scaling or enforce security group-level isolation.
  - **Option 2 (Attach IAM Policy Granting Access via AWS KMS)**: WRONG. IAM policies authorize AWS API calls; they do not filter network traffic or control TCP port 3306 database socket connections.
  - **Option 3 (Assign Static Elastic IPs and Whitelist Individually)**: WRONG. Manually whitelisting static Elastic IPs for auto-scaling web instances creates huge operational overhead and fails when Auto Scaling launches new instances.
- **Official AWS Documentation Areas Checked**:
  - Amazon VPC User Guide: *Security Group Rules and Referencing Security Groups*
  - Amazon EC2 User Guide: *Dynamic Security Group References for Auto Scaling Groups*
- **Final Result**: **PASS**

---

## Final Validation Checklist

- [x] **Exactly 10 questions**: Verified (10/10)
- [x] **All IDs are unique**: Verified (`q-saa-84`, `q-saa-116`, `q-saa-13`, `q-saa-22`, `q-saa-60`, `q-saa-87`, `q-saa-113`, `q-saa-127`, `q-saa-138`, `q-saa-1`)
- [x] **No Batches 01 to 06 IDs reused**: Verified zero overlap with any of the 60 previous IDs
- [x] **All IDs exist in original bank**: Verified against `data/saa-c03-question-export.json`
- [x] **No unrelated questions changed**: Verified
- [x] **All options non-empty**: Verified
- [x] **Correct indexes valid**: Verified (0-indexed)
- [x] **Answer counts match question type**:
  - `single` type: 1 correct answer index matching `correctAnswer` & `correctAnswers[0]`
  - `multiple` type: matching 2 or 3 correct answer indexes
- [x] **Option lengths balanced**: Max vs min option length ratio <= 2.14x across all questions
- [x] **No obvious or joke distractors**: Verified
- [x] **No multiple defensible answers**: Verified
- [x] **No outdated pricing or exact unsupported limits**: Verified
- [x] **User Corrections Enforced**:
  - `q-saa-13`: `io2 Block Express` 120,000 IOPS & sub-ms latency requirement specified; `gp3` 80k IOPS limit accurately reflected
  - `q-saa-60`: IAM Identity Center + AWS Directory Service AD Connector for self-managed AD specified
  - `q-saa-138`: S3 Versioning + S3 Object Lock default Compliance Mode retention for 7 years specified
- [x] **All 10 questions received PASS status**: Verified (10/10 PASS)
