# SAA-C03 Question Repair Report - Batch 01

This report documents the strict distractor-quality repair performed on the 10 highest-risk AWS SAA-C03 exam questions identified in the answer-option quality audit.

---

## Batch Summary

- **Total Questions Repaired**: 10
- **Source Questions**: 10 highest-risk CRITICAL questions from `data/audits/answer-option-quality-audit.json`
- **Output Batch File**: `data/repaired-batches/repaired-batch-01.json`
- **Final Result**: All 10 questions received **PASS**

---

## Detailed Question Reports

### 1. `q-saa-108`

- **Question ID**: `q-saa-108`
- **Original Risk Level**: CRITICAL (22 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 4.94)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Multiple distractors are unusually short: B (5 words), D (4 words)
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Question text updated to specify HTTP GET, HEAD, and OPTIONS requests for static asset delivery, clarifying the read-only scope required for CloudFront origin failover.
  - Distractors completely rewritten to replace short and absurd options (e.g. Elastic IP on S3 bucket) with technically plausible AWS architectures of equal detail and length.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Route 53 DNS Failover)**: WRONG. S3 bucket REST API endpoints do not support direct Amazon Route 53 health-checked DNS failover for CloudFront origin domain names without custom domain alias records, and DNS failover propagation is significantly slower than CloudFront Origin Groups.
  - **Option 2 (Lambda@Edge Origin-Request)**: WRONG. Lambda@Edge `origin-request` functions execute *before* CloudFront forwards the request to the origin, so they cannot intercept 5xx HTTP error responses returned by the primary S3 origin; an `origin-response` function would be required, but native CloudFront Origin Groups handle origin failover without custom code.
  - **Option 3 (S3 CRR + Global Accelerator)**: WRONG. AWS Global Accelerator does not support S3 REST API endpoints directly as custom origin endpoints for CloudFront distributions, and S3 Cross-Region Replication handles asynchronous data replication, not HTTP request failover.
- **Official AWS Documentation Areas Checked**:
  - AWS CloudFront Developer Guide: *Optimizing High Availability with CloudFront Origin Groups*
  - AWS Route 53 Developer Guide: *Configuring DNS Failover for CloudFront Origins*
- **Final Result**: **PASS**

---

### 2. `q-saa-120`

- **Question ID**: `q-saa-120`
- **Original Risk Level**: CRITICAL (18 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.67)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Question text slightly refined to clarify the requirement for maintaining compatibility with existing Apache Kafka producer/consumer client APIs.
  - Distractors expanded from short 2–4 word service titles to full 18-to-20-word technical options.
- **Flag Summary**:
  - Question Text Changed: YES
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Amazon Kinesis Data Streams)**: WRONG. Kinesis Data Streams uses AWS-native APIs (KPL/KCL), requiring application code refactoring rather than maintaining compatibility with existing open-source Apache Kafka client libraries.
  - **Option 2 (Amazon SQS FIFO)**: WRONG. SQS FIFO queues use standard SQS polling APIs and message group IDs, lacking native Apache Kafka wire-protocol compatibility, topic offsets, and partition rebalancing features.
  - **Option 3 (Amazon MQ ActiveMQ)**: WRONG. Amazon MQ supports Apache ActiveMQ and RabbitMQ brokers, which communicate via JMS/AMQP/STOMP protocols rather than Apache Kafka wire protocol APIs.
- **Official AWS Documentation Areas Checked**:
  - Amazon MSK Developer Guide: *What is Amazon Managed Streaming for Apache Kafka?*
  - AWS Messaging Services Comparison Guide
- **Final Result**: **PASS**

---

### 3. `q-saa-135`

- **Question ID**: `q-saa-135`
- **Original Risk Level**: CRITICAL (18 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.91)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Question text preserved (Select TWO).
  - Distractors [2], [3], and [4] expanded from 4–7 word service labels into full 16-to-18-word technical options matching the depth of correct options [0] and [1].
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0 and 1 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 2 (AWS RAM)**: WRONG. AWS Resource Access Manager (RAM) is designed for sharing infrastructure resources (such as VPC subnets or Transit Gateways) across accounts, not for centralizing cost reporting, S3 storage tiers, or budget enforcement.
  - **Option 3 (AWS Cost Anomaly Detection)**: WRONG. Cost Anomaly Detection uses machine learning to identify unusual spending spikes, but does not consolidate billing or provide tiered volume pricing discounts.
  - **Option 4 (AWS Organizations Tag Policies)**: WRONG. Tag Policies enforce consistent tagging key-value metadata across AWS resources, but do not aggregate storage usage or apply volume discount pricing tiers.
- **Official AWS Documentation Areas Checked**:
  - AWS Organizations User Guide: *Consolidated Billing for AWS Organizations*
  - AWS Organizations User Guide: *Service Control Policies (SCPs)*
- **Final Result**: **PASS**

---

### 4. `q-saa-146`

- **Question ID**: `q-saa-146`
- **Original Risk Level**: CRITICAL (18 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.40)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Updated service name to current AWS naming: **Amazon Data Firehose** (replacing deprecated "Amazon Kinesis Data Firehose").
  - Distractors [3], [4], and [5] replaced from absurd services (Snowball Edge, EC2 Spot MySQL, Glacier Deep Archive) to plausible streaming and batch options (SQS Standard, Glue Streaming ETL to Glacier, EMR Serverless Spark Batch).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0, 1, and 2 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 3 (Amazon SQS Standard Queues)**: WRONG. SQS Standard queues provide decoupled message queueing but lack native integration to transform records via AWS Lambda and directly load stream batches into Amazon Redshift without custom polling workers.
  - **Option 4 (AWS Glue Streaming ETL to Glacier)**: WRONG. Glue Streaming ETL delivering data to S3 Glacier Deep Archive stores data in cold archive storage, preventing real-time continuous SQL analytics in Amazon Redshift.
  - **Option 5 (Amazon EMR Serverless Spark Batch)**: WRONG. EMR Serverless running Spark Batch jobs processes data in scheduled batch intervals rather than continuous real-time streaming ingestion and micro-transformation.
- **Official AWS Documentation Areas Checked**:
  - Amazon Data Firehose Developer Guide: *Loading Data into Amazon Redshift*
  - Amazon Kinesis Data Streams Developer Guide: *Integration with Amazon Data Firehose*
- **Final Result**: **PASS**

---

### 5. `q-saa-148`

- **Question ID**: `q-saa-148`
- **Original Risk Level**: CRITICAL (18 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.85)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Removed fictional "AWS AppRunner Cache" distractor.
  - Replaced with real AWS service configurations: AWS Global Accelerator, Amazon MemoryDB for Redis, and Amazon ElastiCache for Redis as a transparent proxy for S3/DynamoDB.
  - All options balanced in length (13 to 22 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0, 1, and 2 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 3 (AWS Global Accelerator)**: WRONG. AWS Global Accelerator optimizes layer 4/7 network routing via Anycast edge IPs, but does not cache web assets, application data, or database query results.
  - **Option 4 (Amazon MemoryDB for Redis)**: WRONG. MemoryDB for Redis is a primary, durable relational/key-value database engine, not an edge cache for static S3 web assets.
  - **Option 5 (Amazon ElastiCache for Redis transparent proxy)**: WRONG. ElastiCache for Redis requires explicit application-level cache management code changes (cache-aside); it is not an inline transparent proxy for S3 static content and does not provide native transparent caching for DynamoDB like DAX does.
- **Official AWS Documentation Areas Checked**:
  - Amazon DynamoDB Developer Guide: *In-Memory Performance with DynamoDB Accelerator (DAX)*
  - Amazon ElastiCache Developer Guide: *Caching Strategies*
  - Amazon CloudFront Developer Guide: *Edge Caching Overview*
- **Final Result**: **PASS**

---

### 6. `q-saa-149`

- **Question ID**: `q-saa-149`
- **Original Risk Level**: CRITICAL (18 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 3.25)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors [3], [4], and [5] replaced from unrelated services (Route 53 Traffic Flow, Glacier Vault Lock, Elastic Transcoder) to security/monitoring services (Amazon Inspector, Systems Manager OpsCenter, CloudTrail Event History).
  - Option lengths equalized across all 6 choices (12 to 14 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Options index 0, 1, and 2 remain correct)
- **Why Each Distractor Is Wrong**:
  - **Option 3 (Amazon Inspector)**: WRONG. Amazon Inspector performs automated vulnerability scanning on EC2 instances, container images, and Lambda functions; it does not manage IAM permission boundaries or organization security rules.
  - **Option 4 (AWS Systems Manager OpsCenter)**: WRONG. OpsCenter consolidates operational issues (OpsItems) for operational management, but does not perform intelligent threat detection across CloudTrail/DNS logs or enforce CIS compliance.
  - **Option 5 (AWS CloudTrail Event History)**: WRONG. CloudTrail Event History records management events and API calls across accounts, but does not generate automated compliance scorecards or CIS benchmark compliance dashboards (which are provided by AWS Config and AWS Security Hub).
- **Official AWS Documentation Areas Checked**:
  - AWS Security Hub User Guide: *Aggregating Findings from AWS Services*
  - Amazon GuardDuty User Guide: *Threat Detection Features*
  - AWS Config Developer Guide: *Evaluating Compliance with Rules*
- **Final Result**: **PASS**

---

### 7. `q-saa-105`

- **Question ID**: `q-saa-105`
- **Original Risk Level**: CRITICAL (17 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 3.00)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Distractor C is unusually short (5 words)
  - Correct answer repeats more question wording than distractors
- **What Was Changed**:
  - Distractors rewritten to present detailed, plausible networking failover mechanisms (Route 53 DNS A record updates, NLB cross-zone load balancing, Direct Connect gateway routing).
  - Option lengths balanced (15 to 20 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Amazon Route 53 DNS A Records)**: WRONG. Global Accelerator provides static Anycast IP addresses and routes traffic at the AWS edge based on continuous endpoint health checks; it does not update DNS records or rely on DNS TTL propagation for regional failover.
  - **Option 2 (Network Load Balancer Cross-Zone Load Balancing)**: WRONG. Cross-zone load balancing distributes traffic across registered targets in multiple AZs *within a single region*, not across separate AWS regions during a regional outage.
  - **Option 3 (AWS Direct Connect Gateway)**: WRONG. AWS Direct Connect provides dedicated private physical connections between on-premises datacenters and AWS VPCs; it plays no role in public internet traffic failover via Global Accelerator.
- **Official AWS Documentation Areas Checked**:
  - AWS Global Accelerator Developer Guide: *How Global Accelerator Works with Anycast IP Addresses*
  - AWS Global Accelerator Developer Guide: *Endpoint Health Checks and Continuous Routing*
- **Final Result**: **PASS**

---

### 8. `q-saa-52`

- **Question ID**: `q-saa-52`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.40)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors expanded and polished into detailed technical choices (stateless Network ACLs on public subnets, AWS WAF on NAT Gateways, Amazon GuardDuty Malware Protection on TGW).
  - Option lengths balanced (14 to 17 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Network ACLs on Public Subnets)**: WRONG. Network ACLs operate strictly at layer 4 (IP/port) and are stateless; they cannot inspect TLS SNI headers or perform layer 7 domain filtering and stateful pattern matching.
  - **Option 2 (AWS WAF on NAT Gateways)**: WRONG. AWS WAF cannot be associated with NAT Gateways; AWS WAF inspects inbound layer 7 HTTP/HTTPS traffic on Application Load Balancers, Amazon CloudFront, AWS App Runner, or Amazon API Gateway.
  - **Option 3 (Amazon GuardDuty Malware Protection on TGW)**: WRONG. GuardDuty Malware Protection scans EBS volumes for malicious code upon alert triggers; it is an asynchronous detection service, not an inline network traffic inspection firewall.
- **Official AWS Documentation Areas Checked**:
  - AWS Network Firewall Developer Guide: *Deployment Models with AWS Transit Gateway*
  - AWS Network Firewall Developer Guide: *Domain List Rule Groups and TLS SNI Inspection*
- **Final Result**: **PASS**

---

### 9. `q-saa-58`

- **Question ID**: `q-saa-58`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.25)
  - Longest option is at least 2.5 times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats substantially more question wording than the distractors
- **What Was Changed**:
  - Distractors expanded to matching length and technical detail (individual trails in member accounts, VPC Flow Logs via Amazon Data Firehose, CloudWatch Logs subscription filters).
  - Option lengths balanced (22 to 27 words).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 1 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 0 (Individual CloudTrail Trails in Member Accounts)**: WRONG. Individual trails created in member accounts are managed by member account administrators, allowing those administrators to modify, stop, or delete logging in their respective accounts.
  - **Option 2 (VPC Flow Logs via Amazon Data Firehose)**: WRONG. VPC Flow Logs capture network IP traffic flow metadata (IP addresses, ports, protocols), not IAM management events or AWS API call activity.
  - **Option 3 (CloudWatch Logs Subscription Filters)**: WRONG. Local CloudWatch subscription filters require member account administration, allowing member administrators to alter subscription configurations or disable log forwarding.
- **Official AWS Documentation Areas Checked**:
  - AWS CloudTrail User Guide: *Creating a Trail for an Organization*
  - AWS Organizations User Guide: *Managing CloudTrail Across Accounts*
- **Final Result**: **PASS**

---

### 10. `q-saa-82`

- **Question ID**: `q-saa-82`
- **Original Risk Level**: CRITICAL (16 risk points)
- **Original Audit Reasons**:
  - Correct answer is at least twice the average distractor length (ratio: 2.55)
  - Longest option is at least four times the shortest option
  - A correct answer is also the longest answer option
  - Correct answer repeats more question wording than distractors
- **What Was Changed**:
  - Removed unsupported precise latency wording ("typically under 20 ms").
  - Updated option text to official wording: *"Lower write latency than a traditional Multi-AZ DB instance deployment, with two readable standby DB instances that can also serve read traffic."*
  - Distractors rewritten to present plausible RDS features without absurd claims (active-active multi-master across AZs, zero IOPS cross-region sync, unlimited serverless storage with zero downtime major upgrades).
- **Flag Summary**:
  - Question Text Changed: NO
  - Options Changed: YES
  - Correct Answer Changed: NO (Option index 0 remains correct)
- **Why Each Distractor Is Wrong**:
  - **Option 1 (Active-Active Multi-Master Replication)**: WRONG. RDS Multi-AZ DB Clusters use a single-writer architecture with one primary writer instance and two readable standbys; they do not support active-active multi-master write replication across AZs.
  - **Option 2 (Zero IOPS Billing Cross-Region Sync)**: WRONG. Data replication in an RDS Multi-AZ DB Cluster occurs synchronously across 3 Availability Zones *within a single AWS Region*, not across Regions, and standard EBS IOPS provisioning rules apply.
  - **Option 3 (Unlimited Serverless Zero-Downtime Major Upgrades)**: WRONG. Database engine version upgrades still require brief failover or maintenance windows, and storage limits adhere to RDS maximum storage caps (64 TiB).
- **Official AWS Documentation Areas Checked**:
  - Amazon RDS User Guide: *Multi-AZ DB Cluster Deployments*
  - AWS Database Blog: *Amazon RDS Multi-AZ DB Clusters with Two Readable Standbys*
- **Final Result**: **PASS**

---

## Final Validation Checklist

- [x] **Exactly 10 questions**: Verified (10/10)
- [x] **All IDs are unique**: Verified (`q-saa-108`, `q-saa-120`, `q-saa-135`, `q-saa-146`, `q-saa-148`, `q-saa-149`, `q-saa-105`, `q-saa-52`, `q-saa-58`, `q-saa-82`)
- [x] **All IDs exist in original bank**: Verified against `data/saa-c03-question-export.json`
- [x] **No unrelated questions changed**: Verified
- [x] **All options non-empty**: Verified
- [x] **Correct indexes valid**: Verified (0-indexed)
- [x] **Answer counts match question type**:
  - `single` type: 1 correct answer index matching `correctAnswer` & `correctAnswers[0]`
  - `multiple` type: matching 2 or 3 correct answer indexes
- [x] **Option lengths balanced**: Max vs min option length ratio < 2.0x for all questions
- [x] **No obvious or joke distractors**: Verified
- [x] **No multiple defensible answers**: Verified
- [x] **No outdated pricing or exact unsupported limits**: Verified
- [x] **Current AWS Naming Enforced**: **Amazon Data Firehose** used throughout (no "Kinesis Data Firehose")
- [x] **All 10 questions received PASS status**: Verified (10/10 PASS)
