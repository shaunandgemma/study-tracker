# SAA-C03 Question Repair Report - Batch 08

This report documents the strict distractor-quality repair performed on the eighth batch of 10 highest-risk AWS SAA-C03 exam questions identified in the answer-option quality audit.

---

## Batch Summary

- **Total Questions Repaired**: 10
- **Source Questions**: Remaining highest-risk HIGH and MEDIUM questions from `data/audits-original-150/answer-option-quality-audit.json`
- **Exclusion Verification**: Verified zero overlap with Batch 01 IDs (`q-saa-105`, `q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-52`, `q-saa-58`, `q-saa-82`), Batch 02 IDs (`q-saa-85`, `q-saa-86`, `q-saa-137`, `q-saa-140`, `q-saa-143`, `q-saa-150`, `q-saa-99`, `q-saa-134`, `q-saa-2`, `q-saa-69`), Batch 03 IDs (`q-saa-71`, `q-saa-78`, `q-saa-98`, `q-saa-104`, `q-saa-109`, `q-saa-110`, `q-saa-111`, `q-saa-121`, `q-saa-128`, `q-saa-145`), Batch 04 IDs (`q-saa-5`, `q-saa-12`, `q-saa-17`, `q-saa-46`, `q-saa-59`, `q-saa-63`, `q-saa-65`, `q-saa-67`, `q-saa-73`, `q-saa-77`), Batch 05 IDs (`q-saa-80`, `q-saa-83`, `q-saa-95`, `q-saa-97`, `q-saa-100`, `q-saa-102`, `q-saa-107`, `q-saa-114`, `q-saa-122`, `q-saa-131`), Batch 06 IDs (`q-saa-132`, `q-saa-133`, `q-saa-136`, `q-saa-142`, `q-saa-4`, `q-saa-10`, `q-saa-36`, `q-saa-41`, `q-saa-48`, `q-saa-54`), and Batch 07 IDs (`q-saa-84`, `q-saa-116`, `q-saa-13`, `q-saa-22`, `q-saa-60`, `q-saa-87`, `q-saa-113`, `q-saa-127`, `q-saa-138`, `q-saa-1`)
- **Output Batch File**: `data/repaired-batches/repaired-batch-08.json`
- **Final Result**: All 10 questions received **PASS**

---

## Detailed Question Reports

### 1. `q-saa-19`

- **Question ID**: `q-saa-19`
- **Original Risk Level**: HIGH (7 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.83)
  - Longest option is at least 2.2 words longer than shortest
  - Distractor D is unusually short (7 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to exact requested phrasing: *"Create a Regional Amazon EFS file system, create mount targets in the required Availability Zones, and mount the file system on the EC2 instances."*
  - Distractors [0], [2], and [3] expanded into 14–17 word technical choices explaining EBS Multi-Attach, S3 Mountpoint / FUSE drivers, and EC2 Instance Store.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (EBS gp3 Volume with Multi-Attach)**: WRONG. EBS Multi-Attach allows attaching block storage volumes to multiple instances within a single Availability Zone; it does not provide multi-AZ POSIX shared file system access.
  - **Option 2 (S3 Bucket Mounted with S3 Mountpoint / FUSE)**: WRONG. Amazon S3 is an object store, not a native POSIX-compliant file system supporting atomic file locking and concurrent read/write access.
  - **Option 3 (EC2 Instance Store Volumes)**: WRONG. Instance Store volumes are ephemeral block storage local to a single physical server; they cannot be shared across multiple instances in separate AZs.
- **Official AWS Documentation Areas Checked**:
  - Amazon EFS User Guide: *Amazon EFS Mount Targets and Availability Zones*
  - Amazon EBS User Guide: *EBS Multi-Attach Limitations*
- **Final Result**: **PASS**

---

### 2. `q-saa-20`

- **Question ID**: `q-saa-20`
- **Original Risk Level**: HIGH (7 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.80)
  - Longest option is at least 2.25 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor C is unusually short (4 words)
- **What Was Changed**:
  - Question text updated to clarify that requirement applies to member accounts.
  - Option 1 (Correct) updated to exact requested phrasing: *"Attach Service Control Policies to the organization root or appropriate organizational units to restrict permitted API actions in member accounts."*
  - Explanation notes that SCPs provide maximum-permission guardrails, do not grant permissions, and do not restrict the management account.
  - Distractors [0], [2], and [3] expanded into 13–14 word technical choices.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (IAM Permissions Boundaries in Member Accounts)**: WRONG. Permissions boundaries restrict individual IAM roles, but account root users and local admins can alter or bypass them; they are not central organization-level guardrails.
  - **Option 2 (AWS Config Conformance Packs)**: WRONG. AWS Config evaluates compliance asynchronously after changes occur; it does not block unauthorized API calls in real time like SCPs.
  - **Option 3 (AWS Security Hub Standards)**: WRONG. Security Hub aggregates security findings and checks compliance posture; it does not prevent or restrict service API actions.
- **Official AWS Documentation Areas Checked**:
  - AWS Organizations User Guide: *Service Control Policies (SCPs) Behavior and Guardrails*
  - AWS Organizations User Guide: *Management Account Exceptions*
- **Final Result**: **PASS**

---

### 3. `q-saa-27`

- **Question ID**: `q-saa-27`
- **Original Risk Level**: HIGH (7 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.78)
  - Longest option is at least 2.25 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D are unusually short (5-6 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 14-word technical options explaining Provisioned Capacity, Auto Scaling target utilization, and Global Tables with Reserved Capacity.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Provisioned Capacity Mode with Static RCUs/WCUs)**: WRONG. Static provisioned capacity wastes money during zero-traffic night hours and throttles unexpected traffic spikes during business hours.
  - **Option 2 (Provisioned Capacity Mode with DynamoDB Auto Scaling)**: WRONG. DynamoDB Auto Scaling takes time to adjust provisioned capacity during sudden spikes, leading to initial request throttling.
  - **Option 3 (Global Tables with Reserved Capacity Units)**: WRONG. Global Tables replicate data multi-Region; Reserved Capacity provides pricing discounts for predictable provisioned capacity, not instant scaling for zero-traffic workloads.
- **Official AWS Documentation Areas Checked**:
  - Amazon DynamoDB Developer Guide: *DynamoDB On-Demand Capacity Mode*
  - Amazon DynamoDB Developer Guide: *Read/Write Capacity Modes*
- **Final Result**: **PASS**

---

### 4. `q-saa-30`

- **Question ID**: `q-saa-30`
- **Original Risk Level**: HIGH (7 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (6 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 12–14 word technical choices explaining S3 Standard-IA, S3 Glacier Deep Archive, and S3 Intelligent-Tiering.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (S3 Standard-Infrequent Access S3 Standard-IA)**: WRONG. S3 Standard-IA has higher ongoing monthly storage costs per GB compared to S3 Glacier Flexible Retrieval for 10-year archival data.
  - **Option 2 (S3 Glacier Deep Archive Standard Retrievals)**: WRONG. S3 Glacier Deep Archive Standard retrievals take 12 hours, failing the required 3 to 5 hour retrieval window.
  - **Option 3 (S3 Intelligent-Tiering Automatic Archive Tiering)**: WRONG. S3 Intelligent-Tiering incurs monthly monitoring and automation fees per object, which is less cost-effective for static 10-year compliance logs.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *S3 Glacier Flexible Retrieval Options*
  - Amazon S3 User Guide: *Comparing Storage Classes for Archival Data*
- **Final Result**: **PASS**

---

### 5. `q-saa-70`

- **Question ID**: `q-saa-70`
- **Original Risk Level**: HIGH (7 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 2.25 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor D is unusually short (4 words)
- **What Was Changed**:
  - Distractors [0], [2], and [3] expanded into 13–15 word technical choices explaining CloudTrail Event Logs, Route 53 Resolver Query Logs, and EC2 System Logs.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (AWS CloudTrail Event Logs)**: WRONG. CloudTrail logs AWS API management calls; it does not capture IP network traffic flowing through VPC network interfaces.
  - **Option 2 (Route 53 Resolver Query Logs)**: WRONG. Route 53 Resolver Query Logs record inbound/outbound DNS queries; they do not record general IP network traffic flows.
  - **Option 3 (EC2 System Log Streams with CloudWatch Agent)**: WRONG. EC2 System Logs record OS boot logs and console output; they do not capture VPC network interface IP flow traffic.
- **Official AWS Documentation Areas Checked**:
  - Amazon VPC User Guide: *VPC Flow Logs Overview*
  - Amazon VPC User Guide: *Publishing Flow Logs to Amazon S3*
- **Final Result**: **PASS**

---

### 6. `q-saa-76`

- **Question ID**: `q-saa-76`
- **Original Risk Level**: HIGH (7 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 2.0 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (7 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into 14–15 word technical choices explaining `aws:VpcSourceIp`, `aws:UserAgent`, and `aws:PrincipalArn`.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Condition IpAddress on aws:VpcSourceIp)**: WRONG. aws:VpcSourceIp filters traffic by VPC source IP; it does not evaluate AWS account organization membership.
  - **Option 2 (Condition StringEquals on aws:UserAgent)**: WRONG. aws:UserAgent evaluates HTTP header strings sent by SDKs; it does not restrict access to AWS Organization accounts.
  - **Option 3 (Condition ArnEquals on aws:PrincipalArn)**: WRONG. Manually listing account ARNs creates ongoing administrative overhead and fails to automatically include new accounts added to the organization.
- **Official AWS Documentation Areas Checked**:
  - AWS IAM User Guide: *AWS Global Condition Context Keys (aws:PrincipalOrgID)*
  - Amazon S3 User Guide: *Restricting S3 Bucket Access to AWS Organizations*
- **Final Result**: **PASS**

---

### 7. `q-saa-106`

- **Question ID**: `q-saa-106`
- **Original Risk Level**: HIGH (7 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.75)
  - Longest option is at least 2.67 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors B, C are unusually short (3-4 words)
- **What Was Changed**:
  - Distractors [1], [2], and [3] expanded into 13–16 word technical options explaining RDS Multi-AZ Failover, DynamoDB On-Demand migration, and EC2 Auto Scaling Scheduled Actions.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (RDS Multi-AZ Failover)**: WRONG. Multi-AZ Failover provisions a standby DB instance in a separate AZ for disaster recovery; it does not scale read replicas dynamically.
  - **Option 2 (Migrate to DynamoDB On-Demand Capacity)**: WRONG. Migrating from relational Aurora MySQL to NoSQL DynamoDB requires complete database schema and application rewrite.
  - **Option 3 (EC2 Auto Scaling Scheduled Actions)**: WRONG. EC2 Auto Scaling manages EC2 instances, not Aurora DB cluster read replicas or Aurora database engine endpoint routing.
- **Official AWS Documentation Areas Checked**:
  - Amazon Aurora User Guide: *Auto Scaling Aurora Replicas with Amazon Aurora Auto Scaling*
  - Amazon Aurora User Guide: *Target Tracking Scaling Policies for Aurora Replicas*
- **Final Result**: **PASS**

---

### 8. `q-saa-39`

- **Question ID**: `q-saa-39`
- **Original Risk Level**: MEDIUM (6 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Distractors C, D, E are unusually short (6-8 words)
- **What Was Changed**:
  - Option 0 (Correct) updated to exact requested phrasing: *"Create an Aurora Global Database with a primary cluster in one Region and a secondary cluster in the disaster recovery Region."*
  - Option 2 (Correct) updated to exact requested phrasing: *"During an unplanned Regional outage, perform a managed failover to promote the selected secondary cluster to the new primary cluster."*
  - Preserved correct answer indexes 0 and 2.
  - Explanation notes that cross-Region replication is asynchronous (RPO in seconds, RTO in minutes) without promising zero data loss or sub-second RPO guarantees.
  - Distractors [1], [3], and [4] expanded into 15–16 word technical choices.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 2 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Configure S3 Cross-Region Replication of Daily Snapshots)**: WRONG. Daily S3 snapshot replication results in up to 24 hours of data loss (RPO), failing low RPO requirements.
  - **Option 3 (Deploy AWS Storage Gateway File Gateway in Secondary Region)**: WRONG. Storage Gateway presents file interfaces to S3; it cannot replicate Aurora database storage blocks or manage database failover.
  - **Option 4 (Set Up AWS Snowball Edge Appliance for Daily Backups)**: WRONG. Snowball Edge is an offline physical transport device; it cannot meet RTO under 5 minutes or low RPO requirements.
- **Official AWS Documentation Areas Checked**:
  - Amazon Aurora User Guide: *Managed Failover for Amazon Aurora Global Database*
  - Amazon Aurora User Guide: *Disaster Recovery and Cross-Region Replication in Aurora*
- **Final Result**: **PASS**

---

### 9. `q-saa-79`

- **Question ID**: `q-saa-79`
- **Original Risk Level**: MEDIUM (6 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.75)
  - Longest option is at least 2.67 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor D is unusually short (7 words)
- **What Was Changed**:
  - Option 0 (Correct) updated to exact requested phrasing: *"Configure a Regional API Gateway custom domain with an ACM certificate, store the trusted CA certificate chain in an Amazon S3 truststore, and enable mutual TLS on the domain."*
  - Explanation notes that API Gateway validates client certificates against the S3 truststore.
  - Distractors [1], [2], and [3] expanded into 17–21 word technical choices explaining AWS WAF Rate-Based Rules, NLB TCP mode, and Cognito User Pools.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Configure AWS WAF Rate-Based Rule with SSL Passthrough)**: WRONG. AWS WAF inspects HTTP request payloads; it does not terminate Mutual TLS client certificate handshakes.
  - **Option 2 (Deploy Network Load Balancer in TCP Mode)**: WRONG. NLB in TCP mode passes encrypted TLS traffic through transparently; it does not validate client certificates against a truststore for API Gateway.
  - **Option 3 (Configure Amazon Cognito User Pool with OAuth 2.0)**: WRONG. Cognito OAuth 2.0 authenticates clients using tokens; it does not perform Layer 6/7 Mutual TLS X.509 client certificate validation.
- **Official AWS Documentation Areas Checked**:
  - Amazon API Gateway Developer Guide: *Configuring Mutual TLS for a Custom Domain in API Gateway*
  - Amazon API Gateway Developer Guide: *Using S3 Truststores for mTLS Authentication*
- **Final Result**: **PASS**

---

### 10. `q-saa-125`

- **Question ID**: `q-saa-125`
- **Original Risk Level**: MEDIUM (6 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least 60% longer than the average distractor (ratio: 1.67)
  - Longest option is at least 2.25 times the shortest option
  - A correct answer is also the longest answer option
  - Distractor A is unusually short (6 words)
- **What Was Changed**:
  - Option 1 (Correct) updated to exact requested phrasing: *"Create an Amazon S3 Multi-Region Access Point to provide one global endpoint that automatically routes requests over the AWS global network to the closest active bucket."*
  - Explanation notes that S3 uses Global Accelerator automatically, MRAP routes requests but does not replicate objects, and S3 CRR is configured separately when replication is needed.
  - Distractors [0], [2], and [3] expanded into 15–19 word technical choices explaining S3 CRR, S3 Transfer Acceleration, and Route 53 Latency Alias records.
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Enable S3 Cross-Region Replication CRR)**: WRONG. S3 CRR replicates objects asynchronously between buckets after upload; it does not provide a single global client endpoint or route client upload traffic.
  - **Option 2 (Enable S3 Transfer Acceleration on Regional Buckets)**: WRONG. S3 Transfer Acceleration accelerates uploads to a single bucket per endpoint; it does not provide a unified global hostname routing to the nearest Region.
  - **Option 3 (Create Route 53 Latency Alias Records for S3 Endpoints)**: WRONG. Route 53 latency records route DNS queries; they do not leverage AWS Global Accelerator for optimized S3 API routing or provide a single global S3 endpoint ARN.
- **Official AWS Documentation Areas Checked**:
  - Amazon S3 User Guide: *What is an Amazon S3 Multi-Region Access Point?*
  - Amazon S3 User Guide: *Routing Performance with S3 Multi-Region Access Points*
- **Final Result**: **PASS**

---

## Final Validation Checklist

- [x] **Exactly 10 questions**: Verified (10/10)
- [x] **All IDs are unique**: Verified (`q-saa-19`, `q-saa-20`, `q-saa-27`, `q-saa-30`, `q-saa-70`, `q-saa-76`, `q-saa-106`, `q-saa-39`, `q-saa-79`, `q-saa-125`)
- [x] **No Batches 01 to 07 IDs reused**: Verified zero overlap with any of the 70 previous IDs
- [x] **All IDs exist in original bank**: Verified against `data/saa-c03-question-export.json`
- [x] **No unrelated questions changed**: Verified
- [x] **All options non-empty**: Verified
- [x] **Correct indexes valid**: Verified (0-indexed)
- [x] **Answer counts match question type**:
  - `single` type: 1 correct answer index matching `correctAnswer` & `correctAnswers[0]`
  - `multiple` type: matching 2 or 3 correct answer indexes
- [x] **Option lengths balanced**: Max vs min option length ratio <= 1.73x across all questions
- [x] **No obvious or joke distractors**: Verified
- [x] **No multiple defensible answers**: Verified
- [x] **No outdated pricing or exact unsupported limits**: Verified
- [x] **User Corrections Enforced**:
  - `q-saa-19`: Regional EFS file system with mount targets specified
  - `q-saa-20`: SCPs for member accounts & SCP guardrail behavior specified
  - `q-saa-39`: Aurora Global Database managed failover & realistic RPO/RTO explanation specified
  - `q-saa-79`: Regional API Gateway custom domain & S3 truststore specified
  - `q-saa-125`: S3 Multi-Region Access Points MRAP built-in Global Accelerator routing specified
- [x] **All 10 questions received PASS status**: Verified (10/10 PASS)
