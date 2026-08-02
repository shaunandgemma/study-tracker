-- ==============================================================================
-- Supabase Migration Script: AWS SAA-C03 Practice Questions & Topic Mappings
-- Supporting 4, 5, and 6 Option Questions (Choices A-F)
-- Single-Answer & Multiple-Answer (Select TWO / Select THREE) Support
-- Authoritative 150-Question Bank
-- Free-text fields use PostgreSQL Dollar-Quoted Strings ($q$...$q$)
-- ==============================================================================

-- 1. Create Table: exam_questions
CREATE TABLE IF NOT EXISTS exam_questions (
  id TEXT PRIMARY KEY,
  exam_code TEXT NOT NULL,
  difficulty TEXT,
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT,
  option_f TEXT,
  correct_answer INTEGER NOT NULL,
  correct_answers INTEGER[],
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe Alter Columns for existing deployments
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS option_e TEXT;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS option_f TEXT;
ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS correct_answers INTEGER[];

UPDATE exam_questions
SET correct_answers = ARRAY[correct_answer]
WHERE correct_answers IS NULL;

-- 2. Create Table: question_topics
CREATE TABLE IF NOT EXISTS question_topics (
  question_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  PRIMARY KEY (question_id, topic_id),
  CONSTRAINT fk_question_id FOREIGN KEY (question_id) REFERENCES exam_questions(id) ON DELETE CASCADE
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_code ON exam_questions(exam_code);
CREATE INDEX IF NOT EXISTS idx_question_topics_topic_id ON question_topics(topic_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_topics ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Public Read Access)
DROP POLICY IF EXISTS "Allow public read access to exam_questions" ON exam_questions;
CREATE POLICY "Allow public read access to exam_questions"
  ON exam_questions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read access to question_topics" ON question_topics;
CREATE POLICY "Allow public read access to question_topics"
  ON question_topics FOR SELECT
  USING (true);

-- 6. Insert 150 SAA-C03 Questions (Batched)
-- Batch 1: q-saa-1 to q-saa-25
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-1', 'aws-saa-c03', 'Medium', 'single',
  $q$A company needs to secure a 3-tier web application running on Amazon EC2. The database tier must only accept incoming connections from the web application tier on TCP port 3306. The web tier auto-scales dynamically based on CPU utilization. Which configuration achieves this security requirement with minimum operational overhead?$q$,
  $q$Configure a Network ACL on the database subnet allowing port 3306 from the web server subnet CIDR block.$q$, $q$Create a Security Group for the database tier that references the Security Group ID of the web server tier for inbound TCP port 3306.$q$, $q$Set up an AWS IAM policy on the EC2 instances granting database access permissions via AWS KMS.$q$, $q$Assign static Elastic IP addresses to web servers and whitelist them individually in the database Security Group.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Security Group nesting (referencing a source Security Group ID) allows dynamic, IP-agnostic access control. As web instances scale out in the Auto Scaling group, they automatically inherit access without requiring CIDR or IP updates.$q$
),
(
  'q-saa-2', 'aws-saa-c03', 'Hard', 'single',
  $q$A company requires all data uploaded to Amazon S3 to be encrypted at rest. Key management mandates dictate that encryption keys must be managed in AWS KMS with annual automatic key rotation enabled and CloudTrail auditing for key usage. Which solution satisfies these compliance demands?$q$,
  $q$Use Server-Side Encryption with Amazon S3-Managed Keys (SSE-S3).$q$, $q$Use Server-Side Encryption with AWS KMS Keys (SSE-KMS) using a Customer Managed Key (CMK) with annual rotation enabled.$q$, $q$Use Client-Side Encryption with plaintext keys stored locally in AWS Systems Manager Parameter Store.$q$, $q$Use Server-Side Encryption with Customer-Provided Keys (SSE-C).$q$, NULL, NULL,
  1, ARRAY[1],
  $q$SSE-KMS using Customer Managed Keys (CMKs) enables audit logging via AWS CloudTrail for every key usage event and supports automatic annual rotation managed by KMS.$q$
),
(
  'q-saa-3', 'aws-saa-c03', 'Medium', 'single',
  $q$An e-commerce site expects high spike traffic during promotional sales. Orders are placed by web frontend users, but fulfillment processing can be asynchronous. How should the architecture be designed to decouple components and prevent order loss during traffic bursts?$q$,
  $q$Store incoming orders directly in an EC2 instance ephemeral volume.$q$, $q$Use an Amazon SQS queue to store order messages, and configure backend worker instances to poll the queue.$q$, $q$Deploy an Elastic Load Balancer to synchronously send order requests directly to worker EC2 instances.$q$, $q$Write orders directly to an Amazon S3 bucket with cross-region replication enabled.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon SQS decouples application components, allowing asynchronous order processing. Even if order processing workers slow down or fail, orders remain safely buffered in the SQS queue.$q$
),
(
  'q-saa-4', 'aws-saa-c03', 'Hard', 'single',
  $q$A relational database hosted on Amazon RDS MySQL experiences heavy read requests, causing latency issues for write operations. The application requires automatic failover disaster recovery within the region as well. What dual-step solution should be implemented?$q$,
  $q$Migrate RDS MySQL to EC2 instances in a single AZ with manual EBS snapshots.$q$, $q$Enable Multi-AZ deployment on the RDS MySQL database and deploy RDS Read Replicas or ElastiCache to offload read workloads.$q$, $q$Increase the EBS storage volume size on the primary RDS instance.$q$, $q$Use S3 bucket acceleration with CloudFront edge caching.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Enabling Multi-AZ provides synchronous replication and automatic failover for high availability, while RDS Read Replicas or ElastiCache offload heavy read traffic from the primary database.$q$
),
(
  'q-saa-5', 'aws-saa-c03', 'Easy', 'single',
  $q$A company stores millions of images in Amazon S3. Images are accessed frequently for the first 30 days, rarely accessed between 30 and 90 days, and never accessed after 90 days (but must be retained for 7 years for compliance auditing). What is the most cost-effective storage configuration?$q$,
  $q$Keep all images in S3 Standard for 7 years.$q$, $q$Configure an S3 Lifecycle rule to transition objects to S3 Standard-IA at 30 days, and transition to S3 Glacier Deep Archive at 90 days.$q$, $q$Move all images immediately to S3 Glacier Deep Archive upon initial upload.$q$, $q$Store images in Amazon EBS gp3 volumes attached to an EC2 instance.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$S3 Lifecycle rules automate data movement across storage tiers: S3 Standard for initial frequent access, S3 Standard-IA for infrequent access after 30 days, and S3 Glacier Deep Archive after 90 days for the lowest-cost long-term retention of compliance data with a 12-hour retrieval window.$q$
),
(
  'q-saa-6', 'aws-saa-c03', 'Hard', 'single',
  $q$A high-frequency trading platform requires sub-millisecond read latency for a key-value database workload handling millions of requests per second. Which database configuration best fulfills this requirement?$q$,
  $q$Amazon Aurora PostgreSQL with Multi-AZ.$q$, $q$Amazon DynamoDB with DynamoDB Accelerator (DAX) cluster.$q$, $q$Amazon Redshift with materialized views.$q$, $q$Amazon Athena querying data stored in S3 Parquet format.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$DynamoDB Accelerator (DAX) is an in-memory cache for DynamoDB that delivers microsecond response times for fast read-heavy workloads.$q$
),
(
  'q-saa-7', 'aws-saa-c03', 'Medium', 'single',
  $q$A financial institution runs batch processing workloads on EC2 for 4 hours every night. The batch tasks are stateless, resilient to interruption, and can be restarted easily. Which pricing model offers the lowest cost?$q$,
  $q$EC2 On-Demand Instances$q$, $q$EC2 Spot Instances$q$, $q$3-Year Dedicated Host Savings Plan$q$, $q$EC2 Reserved Instances$q$, NULL, NULL,
  1, ARRAY[1],
  $q$EC2 Spot Instances offer up to 90% discount off On-Demand prices and are ideal for stateless, fault-tolerant batch processing workloads that can handle termination notices.$q$
),
(
  'q-saa-8', 'aws-saa-c03', 'Medium', 'single',
  $q$An application in a private subnet needs to access Amazon S3 buckets securely without exposing traffic over the public internet. Which VPC networking solution should be deployed?$q$,
  $q$Internet Gateway (IGW)$q$, $q$VPC Gateway Endpoint for S3$q$, $q$NAT Instance in a public subnet$q$, $q$Egress-Only Internet Gateway$q$, NULL, NULL,
  1, ARRAY[1],
  $q$A VPC Gateway Endpoint for S3 routes traffic internally within the AWS network to S3 without passing through public internet or NAT devices.$q$
),
(
  'q-saa-9', 'aws-saa-c03', 'Medium', 'single',
  $q$An application running on an EC2 instance needs to securely read objects from an Amazon S3 bucket. Access credentials must not be hardcoded inside the application code or stored on disk. Which configuration is the AWS recommended security practice?$q$,
  $q$Store AWS IAM access keys in a config file on the EC2 instance root volume.$q$, $q$Create an IAM role with S3 read permissions and attach it as an instance profile to the EC2 instance.$q$, $q$Create an IAM user for the EC2 instance and pass AWS_SECRET_ACCESS_KEY via User Data scripts.$q$, $q$Use AWS KMS to encrypt the access keys on the EC2 instance storage.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Attaching an IAM role via an Instance Profile to an EC2 instance allows the AWS SDK on the instance to automatically retrieve temporary security credentials from IMDS without storing hardcoded long-term keys.$q$
),
(
  'q-saa-10', 'aws-saa-c03', 'Hard', 'single',
  $q$A global web application is deployed across AWS US-East and EU-West regions behind Application Load Balancers. The company wants users automatically routed to the region with the lowest network latency, with health checks to redirect traffic if a region becomes unavailable. Which Amazon Route 53 routing policy should be configured?$q$,
  $q$Weighted Routing Policy$q$, $q$Latency Routing Policy with Health Checks enabled$q$, $q$Geolocation Routing Policy$q$, $q$Failover Routing Policy$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Route 53 Latency Routing Policy directs end users to the AWS region that provides the lowest network latency. Combining it with Route 53 Health Checks ensures automatic failover if the primary region fails.$q$
),
(
  'q-saa-11', 'aws-saa-c03', 'Medium', 'single',
  $q$A company needs a serverless event-driven architecture that automatically resizes images uploaded to an S3 bucket and saves the thumbnails to another bucket. Which combination of AWS services offers the operational effort closest to zero?$q$,
  $q$Amazon S3 Event Notifications triggering an AWS Lambda function.$q$, $q$AWS Step Functions polling the S3 bucket every minute on an EC2 Cron schedule.$q$, $q$Amazon CloudWatch Events triggering an Auto Scaling EC2 fleet.$q$, $q$Amazon Kinesis Data Streams polling S3 object uploads.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Amazon S3 Event Notifications natively trigger AWS Lambda functions asynchronously upon S3 ObjectCreated events, executing image thumbnail logic serverlessly without infrastructure management.$q$
),
(
  'q-saa-12', 'aws-saa-c03', 'Easy', 'single',
  $q$A media streaming platform serves static video files stored in Amazon S3 to millions of global users. Users report high video buffering latency in international regions. Which service should be added to minimize download latency globally?$q$,
  $q$Amazon Route 53 Traffic Flow$q$, $q$Amazon CloudFront CDN distribution backed by the S3 bucket$q$, $q$AWS Global Accelerator$q$, $q$Amazon ElastiCache for Redis$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon CloudFront caches static content at Edge Locations worldwide, serving media requests locally to global users with low latency and reduced origin load on S3.$q$
),
(
  'q-saa-13', 'aws-saa-c03', 'Medium', 'single',
  $q$A database application running on an EC2 instance requires sustained high storage performance of 32,000 IOPS and 500 MB/s throughput with sub-millisecond latency. Which Amazon EBS volume type meets these demanding specifications?$q$,
  $q$General Purpose SSD (gp3)$q$, $q$Provisioned IOPS SSD (io2 Block Express)$q$, $q$Throughput Optimized HDD (st1)$q$, $q$Cold HDD (sc1)$q$, NULL, NULL,
  1, ARRAY[1],
  $q$EBS io2 Block Express volumes provide up to 256,000 IOPS, 4,000 MB/s throughput, and sub-millisecond latency for mission-critical, High-IOPS database workloads.$q$
),
(
  'q-saa-14', 'aws-saa-c03', 'Hard', 'single',
  $q$A company requires a highly available relational database for a global application with MySQL compatibility. The database must support low-latency cross-Region disaster recovery and scale read capacity horizontally across multiple AWS Regions. Which database solution satisfies these requirements?$q$,
  $q$Amazon RDS for MySQL with cross-Region read replicas$q$, $q$Amazon Aurora Global Database$q$, $q$Amazon DynamoDB Global Tables$q$, $q$Amazon EC2 with MySQL Community Edition and manual snapshots$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Aurora Global Database uses asynchronous cross-Region replication with replication latency typically under one second. For an unplanned Regional failover, RPO is normally non-zero and measured in seconds.$q$
),
(
  'q-saa-15', 'aws-saa-c03', 'Medium', 'single',
  $q$An application needs to broadcast urgent system alerts simultaneously to multiple downstream subscribers: an SQS queue, an HTTPS webhook endpoint, and an AWS Lambda function. Which AWS service implements this fan-out messaging pattern?$q$,
  $q$Amazon SQS FIFO Queue$q$, $q$Amazon SNS (Simple Notification Service) Topic$q$, $q$AWS EventBridge Event Bus$q$, $q$Amazon Kinesis Data Firehose$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon SNS supports publish/subscribe messaging patterns where a single published message is fanned out to multiple HTTP, SQS, Lambda, and email subscribers.$q$
),
(
  'q-saa-16', 'aws-saa-c03', 'Medium', 'single',
  $q$A web application hosted on an EC2 Auto Scaling group behind an Application Load Balancer (ALB) handles HTTP and HTTPS traffic. The company needs to enforce SSL/TLS termination and path-based routing (/api vs /static). Which component performs path routing and SSL termination?$q$,
  $q$Network Load Balancer (NLB)$q$, $q$Application Load Balancer (ALB)$q$, $q$AWS Transit Gateway$q$, $q$Amazon CloudFront Edge Lambda$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Application Load Balancers (ALBs) operate at Layer 7 (HTTP/HTTPS) and support SSL/TLS termination, path-based routing rules, and host-based routing.$q$
),
(
  'q-saa-17', 'aws-saa-c03', 'Medium', 'single',
  $q$An e-commerce website experiences predictable traffic increases every Monday at 08:00 AM. How should the EC2 Auto Scaling group be configured to ensure instances are pre-warmed and ready before traffic surges occur?$q$,
  $q$Target Tracking Scaling Policy based on Average CPU Utilization$q$, $q$Scheduled Scaling Action set to scale out before 08:00 AM every Monday$q$, $q$Step Scaling Policy triggered by CloudWatch Alarms$q$, $q$Predictive Scaling Policy with 24-hour buffer$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Scheduled Scaling Actions allow Auto Scaling groups to automatically scale out capacity at specified times and days for predictable recurring traffic spikes.$q$
),
(
  'q-saa-18', 'aws-saa-c03', 'Hard', 'single',
  $q$A regulatory mandate requires a financial application to encrypt sensitive customer PII before writing it to a database. Encryption keys must be generated inside dedicated hardware modules where AWS administrators have no access to key material. Which service fulfills this strict requirement?$q$,
  $q$AWS KMS with AWS Managed Key$q$, $q$AWS CloudHSM$q$, $q$AWS Secrets Manager$q$, $q$Amazon Macie$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS CloudHSM provides dedicated single-tenant HSMs where the customer controls the keys and supports FIPS Level 3 validated HSMs when using FIPS mode.$q$
),
(
  'q-saa-19', 'aws-saa-c03', 'Medium', 'single',
  $q$A containerized application running across multiple EC2 instances in different Availability Zones requires a POSIX-compliant shared file system with concurrent read and write access. Which storage solution should be used?$q$,
  $q$Amazon EBS gp3 Volume attached to multiple instances with Multi-Attach$q$, $q$Amazon EFS (Elastic File System)$q$, $q$Amazon S3 Standard Bucket with S3 FS Mount$q$, $q$Amazon EC2 Instance Store$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon EFS is a fully managed, POSIX-compliant Elastic File System designed for concurrent file access across thousands of EC2 instances and containers across multiple AZs.$q$
),
(
  'q-saa-20', 'aws-saa-c03', 'Hard', 'single',
  $q$An enterprise manages hundreds of AWS accounts using AWS Organizations. The Security team requires a mechanism to centrally restrict specific AWS service API actions (such as preventing any account from disabling CloudTrail or deleting S3 buckets) across all member accounts. Which feature enforces this guardrail?$q$,
  $q$IAM Role Permission Boundaries$q$, $q$Service Control Policies (SCPs) in AWS Organizations$q$, $q$AWS Config Conformance Packs$q$, $q$AWS Security Hub Standards$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Service Control Policies (SCPs) specify the maximum allowed permissions for member accounts in an organization, enforcing central security guardrails that cannot be overridden by account administrators.$q$
),
(
  'q-saa-21', 'aws-saa-c03', 'Hard', 'single',
  $q$A company needs to migrate 150 TB of on-premises data to Amazon S3. The company has a 10 Mbps internet connection that is heavily utilized during business hours. The migration must be completed within 2 weeks with minimal network disruption. The company is an existing AWS Snowball Edge customer and is eligible to order Snowball Edge devices. Which solution is most cost-effective and operationally efficient?$q$,
  $q$Use AWS DataSync over the existing 10 Mbps internet connection with bandwidth throttling.$q$, $q$Order AWS Snowball Edge Storage Optimized devices, copy data locally, and ship them to AWS.$q$, $q$Deploy an AWS Storage Gateway File Gateway on-premises and replicate files to S3 over HTTPS.$q$, $q$Upload data to S3 using S3 Transfer Acceleration over the internet.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Over a 10 Mbps line, transferring 150 TB would take far too long (over 3 years). Physical AWS Snowball Edge transfer avoids saturating the WAN connection. The company is eligible to order the appliances because it is an existing Snowball Edge customer.$q$
),
(
  'q-saa-22', 'aws-saa-c03', 'Medium', 'single',
  $q$A company hosts an application on EC2 instances in private subnets across multiple AZs. The instances must download software updates from Amazon S3 and external internet repositories. Currently, traffic passes through a NAT Gateway in each AZ, generating high data processing charges. How can the company reduce NAT Gateway processing costs for S3 traffic?$q$,
  $q$Replace NAT Gateways with Egress-Only Internet Gateways.$q$, $q$Create a VPC Gateway Endpoint for Amazon S3 and update private subnet route tables.$q$, $q$Deploy an Amazon CloudFront distribution for external updates.$q$, $q$Attach Elastic IP addresses directly to the private EC2 instances.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$VPC Gateway Endpoints for S3 are free of charge and route traffic directly to S3 within the AWS network, bypassing NAT Gateways and eliminating NAT processing fees for S3 traffic.$q$
),
(
  'q-saa-23', 'aws-saa-c03', 'Hard', 'single',
  $q$An analytics application processes data stored in S3. Object access patterns are unpredictable, with some objects being accessed multiple times a day while others are unaccessed for months. Access patterns change dynamically without warning. What is the most cost-effective S3 storage class?$q$,
  $q$S3 Standard-Infrequent Access (S3 Standard-IA)$q$, $q$S3 Intelligent-Tiering$q$, $q$S3 Glacier Flexible Archive$q$, $q$S3 One Zone-Infrequent Access (S3 One Zone-IA)$q$, NULL, NULL,
  1, ARRAY[1],
  $q$S3 Intelligent-Tiering automatically moves objects between frequent, infrequent, and archive access tiers based on changing access patterns without operational overhead or retrieval fees.$q$
),
(
  'q-saa-24', 'aws-saa-c03', 'Medium', 'single',
  $q$A global news website serves popular static video files from Amazon S3 buckets. Monthly AWS data transfer out charges from S3 directly to internet users are growing rapidly. Which cost-optimization strategy will significantly reduce data transfer out costs while improving latency?$q$,
  $q$Enable S3 Transfer Acceleration on the origin bucket.$q$, $q$Deploy an Amazon CloudFront distribution in front of the S3 bucket.$q$, $q$Configure AWS Global Accelerator with an S3 endpoint.$q$, $q$Use S3 Byte-Range Fetches directly from web browsers.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon CloudFront caches static content at edge locations worldwide. CloudFront Data Transfer Out rates are lower than S3 Data Transfer Out rates, reducing costs while lowering latency.$q$
),
(
  'q-saa-25', 'aws-saa-c03', 'Hard', 'single',
  $q$A company runs a steady-state web application on EC2 instances 24/7 with predictable baseline compute demands. In addition, the company runs short-lived batch processing jobs that can tolerate interruption. What combination of purchasing options minimizes compute costs?$q$,
  $q$On-Demand Instances for both steady-state web app and batch jobs.$q$, $q$Savings Plans or Reserved Instances for steady-state web app, and Spot Instances for batch jobs.$q$, $q$Spot Instances for steady-state web app, and Dedicated Hosts for batch jobs.$q$, $q$On-Demand Instances for steady-state web app, and Reserved Instances for batch jobs.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Compute Savings Plans or Reserved Instances provide up to 72% discount for predictable 24/7 workloads, while Spot Instances provide up to 90% discount for fault-tolerant, interruptible batch jobs.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 2: q-saa-26 to q-saa-50
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-26', 'aws-saa-c03', 'Medium', 'single',
  $q$A microservice runs infrequently—approximately 10 times a day—performing image processing that takes 5 seconds per invocation. The team currently keeps an EC2 t3.medium instance running 24/7 for this task. What architecture change offers the largest cost reduction with minimal effort?$q$,
  $q$Migrate the microservice to an AWS Lambda function triggered by S3 notifications.$q$, $q$Change the EC2 instance type to a Spot t3.nano instance.$q$, $q$Run the application inside an Amazon ECS container hosted on EC2.$q$, $q$Purchase a 3-Year Reserved Instance for the t3.medium server.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$AWS Lambda charges only for the exact duration of execution (in milliseconds) and invocation requests. Replacing a 24/7 EC2 instance with Lambda for sporadic workloads eliminates idle compute costs.$q$
),
(
  'q-saa-27', 'aws-saa-c03', 'Hard', 'single',
  $q$A financial database on DynamoDB experiences highly variable traffic during business hours and zero traffic at night. The peak request volume is unpredictable. Which DynamoDB capacity mode optimizes cost while ensuring requests are not throttled during unexpected spikes?$q$,
  $q$Provisioned Capacity Mode with static Read/Write Capacity Units.$q$, $q$On-Demand Capacity Mode.$q$, $q$Provisioned Capacity Mode with DynamoDB Auto Scaling enabled.$q$, $q$Global Tables with Reserved Capacity Units.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$DynamoDB On-Demand Capacity Mode charges per request without requiring capacity planning. For workloads with unpredictable spikes and zero traffic periods, On-Demand avoids over-provisioning and idle charges.$q$
),
(
  'q-saa-28', 'aws-saa-c03', 'Medium', 'single',
  $q$A database administrator needs to provision an EBS volume for an application requiring 12,000 IOPS and 400 MB/s throughput. What volume type provides these performance levels at the lowest cost?$q$,
  $q$Provisioned IOPS SSD (io1)$q$, $q$General Purpose SSD (gp3)$q$, $q$Provisioned IOPS SSD (io2)$q$, $q$Throughput Optimized HDD (st1)$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon EBS gp3 volumes allow independent provisioning of IOPS and throughput above baseline defaults at a significantly lower cost per gigabyte than io1 or io2 volumes.$q$
),
(
  'q-saa-29', 'aws-saa-c03', 'Hard', 'single',
  $q$A company wants to migrate an enterprise data warehouse to AWS. Queries are complex, involve multi-table joins on petabytes of structured data, and are executed during business hours. What service is designed specifically for cost-effective petabyte-scale data warehousing analytics?$q$,
  $q$Amazon RDS PostgreSQL$q$, $q$Amazon Redshift$q$, $q$Amazon DynamoDB$q$, $q$Amazon OpenSearch Service$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon Redshift is a fully managed, petabyte-scale columnar data warehouse optimized for high-performance complex SQL queries and analytics.$q$
),
(
  'q-saa-30', 'aws-saa-c03', 'Medium', 'single',
  $q$A company requires an archival storage solution for regulatory compliance logs. Data must be retained for 10 years and is rarely accessed. In the event of an audit, a retrieval time of 3 to 5 hours is acceptable. Which S3 storage class meets these requirements at the lowest cost?$q$,
  $q$S3 Standard-Infrequent Access (S3 Standard-IA)$q$, $q$S3 Glacier Flexible Retrieval$q$, $q$S3 Glacier Deep Archive$q$, $q$S3 Intelligent-Tiering$q$, NULL, NULL,
  1, ARRAY[1],
  $q$S3 Glacier Flexible Retrieval is designed for archival data that is rarely accessed and supports Standard retrievals typically within 3–5 hours. S3 Glacier Deep Archive Standard retrievals typically complete within 12 hours and would not meet the 3 to 5 hour recovery requirement.$q$
),
(
  'q-saa-31', 'aws-saa-c03', 'Hard', 'single',
  $q$A web application in an Auto Scaling group behind an ALB writes session state to a shared database. The primary RDS PostgreSQL database CPU utilization reaches 95% due to high read query volume for user sessions. How can the solution architect offload session read traffic with minimal latency and cost?$q$,
  $q$Upgrade the RDS instance to a larger db.m6g size.$q$, $q$Deploy an Amazon ElastiCache for Redis cluster to cache session data in memory.$q$, $q$Add S3 Transfer Acceleration to cache database responses.$q$, $q$Deploy EBS gp3 volumes in Multi-Attach mode across instances.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$ElastiCache for Redis provides in-memory key-value caching with sub-millisecond response times, offloading frequent session read queries from relational databases.$q$
),
(
  'q-saa-32', 'aws-saa-c03', 'Medium', 'single',
  $q$A company operates hundreds of EC2 instances in private subnets across multiple AWS accounts managed by AWS Organizations. The Security team requires centralized inspection of all outbound internet traffic using AWS Network Firewall. What networking component should be deployed to connect multiple VPCs and accounts cost-effectively?$q$,
  $q$VPC Peering mesh between every VPC pair.$q$, $q$AWS Transit Gateway.$q$, $q$AWS Global Accelerator.$q$, $q$VPC Gateway Endpoints.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Transit Gateway acts as a central hub to interconnect thousands of VPCs and on-premises networks across multiple AWS accounts, eliminating complex full-mesh VPC peering.$q$
),
(
  'q-saa-33', 'aws-saa-c03', 'Hard', 'single',
  $q$An application uses AWS Lambda to process messages from an SQS queue. During peak traffic, thousands of messages are pushed to SQS, triggering high Lambda concurrency. To control costs and prevent downstream relational database overload, what Lambda configuration should be applied?$q$,
  $q$Set Reserved Concurrency on the Lambda function.$q$, $q$Increase the SQS Visibility Timeout to 24 hours.$q$, $q$Configure Provisioned Concurrency on the Lambda function.$q$, $q$Enable Dead-Letter Queue (DLQ) redrive policy on SQS.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Setting Reserved Concurrency caps the maximum number of concurrent executions for a specific Lambda function, controlling execution costs and protecting downstream databases from throttling.$q$
),
(
  'q-saa-34', 'aws-saa-c03', 'Medium', 'single',
  $q$A media company hosts a high-traffic API on EC2 instances behind an Application Load Balancer. The API receives millions of identical GET requests for trending articles. What change reduces EC2 instance count and lowers compute costs?$q$,
  $q$Deploy API Gateway in front of ALB with API Caching enabled.$q$, $q$Increase ALB Idle Timeout to 3600 seconds.$q$, $q$Replace ALB with a Network Load Balancer (NLB).$q$, $q$Attach EBS io2 Block Express volumes to EC2 instances.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Amazon API Gateway API Caching caches responses for identical HTTP GET requests, serving responses directly at the API edge and reducing backend EC2 workload.$q$
),
(
  'q-saa-35', 'aws-saa-c03', 'Hard', 'single',
  $q$A company needs to transfer 50 TB of data daily from on-premises file servers to AWS. The company has a dedicated 10 Gbps AWS Direct Connect location. Which service automates and accelerates online data transfers while preserving file metadata and permissions?$q$,
  $q$AWS DataSync$q$, $q$AWS Snowcone$q$, $q$Amazon S3 Glacier Select$q$, $q$AWS Migration Hub$q$, NULL, NULL,
  0, ARRAY[0],
  $q$AWS DataSync is an online data transfer service optimized for transferring large datasets over Direct Connect or internet, preserving POSIX metadata, ownership, and permissions.$q$
),
(
  'q-saa-36', 'aws-saa-c03', 'Medium', 'single',
  $q$An e-commerce company wants to protect web applications against common web exploits (such as SQL injection and cross-site scripting) and layer 7 DDoS attacks. Which service integrates directly with Application Load Balancer and CloudFront to block malicious traffic?$q$,
  $q$AWS Shield Standard$q$, $q$AWS WAF (Web Application Firewall)$q$, $q$Amazon GuardDuty$q$, $q$AWS Firewall Manager$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS WAF monitors web requests forwarded to Application Load Balancers, CloudFront, or API Gateway, enforcing custom rules to block SQL injection, XSS, and bad bots.$q$
),
(
  'q-saa-37', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A company is designing a high-availability, fault-tolerant web application running on Amazon EC2 across multiple Availability Zones in a single AWS Region. The application requires an active database that supports multi-AZ synchronous replication and automatic failover, as well as an ingress load balancing solution that performs path routing. Which TWO components should be selected? (Select TWO.)$q$,
  $q$Application Load Balancer (ALB)$q$, $q$Network Load Balancer (NLB)$q$, $q$Amazon RDS Multi-AZ deployment$q$, $q$Amazon RDS Single-AZ deployment with EBS snapshots$q$, $q$Amazon Route 53 Geolocation Routing$q$, NULL,
  0, ARRAY[0, 2],
  $q$Application Load Balancers (ALBs) operate at Layer 7 supporting path routing, while Amazon RDS Multi-AZ deployments provide synchronous database replication and automatic failover.$q$
),
(
  'q-saa-38', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A company requires an enterprise data architecture where sensitive customer PII stored in Amazon S3 is encrypted at rest using keys managed centrally with key access auditing. Additionally, all network traffic between private subnets and S3 must remain inside the AWS network. Which TWO AWS services/features satisfy these requirements? (Select TWO.)$q$,
  $q$AWS KMS with Customer Managed Keys (CMKs)$q$, $q$VPC Gateway Endpoints for Amazon S3$q$, $q$Internet Gateway (IGW) with Security Groups$q$, $q$Amazon S3 Server-Side Encryption with SSE-S3$q$, $q$AWS Direct Connect Public Virtual Interface$q$, NULL,
  0, ARRAY[0, 1],
  $q$AWS KMS Customer Managed Keys enable centralized key policies and CloudTrail auditing, while VPC Gateway Endpoints for S3 route traffic internally without traversing the public internet.$q$
),
(
  'q-saa-39', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A solutions architect is configuring a disaster recovery solution for a critical relational database running on Amazon Aurora MySQL. The company mandates a Recovery Time Objective (RTO) under 5 minutes and low RPO across a secondary AWS Region 1,000 miles away. Which TWO steps configure this solution? (Select TWO.)$q$,
  $q$Create an Amazon Aurora Global Database spanning the primary and secondary Regions.$q$, $q$Configure S3 Cross-Region Replication of database daily backups.$q$, $q$Promote the secondary Region DB cluster in Aurora Global Database in the event of an unplanned primary Region outage.$q$, $q$Deploy an AWS Storage Gateway File Gateway in the secondary Region.$q$, $q$Set up an AWS Snowball Edge device in the secondary Region.$q$, NULL,
  0, ARRAY[0, 2],
  $q$Aurora Global Database uses storage-based cross-Region replication with latency under 1 second. Promoting a secondary Region cluster in an emergency takes less than 1 minute, fulfilling strict RTO requirements.$q$
),
(
  'q-saa-40', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A company needs to secure public web microservices deployed on Amazon EC2 behind an ALB. The security policy mandates blocking malicious bot traffic and SQL injection attempts at Layer 7, enforcing SSL/TLS encryption in transit, and restricting administrative SSH access to a bastion host. Which THREE security controls fulfill these requirements? (Select THREE.)$q$,
  $q$Deploy AWS WAF associated with the Application Load Balancer.$q$, $q$Configure an HTTPS Listener with an AWS Certificate Manager (ACM) TLS certificate on the ALB.$q$, $q$Restrict inbound SSH (port 22) in worker EC2 Security Groups to the Bastion Security Group ID.$q$, $q$Enable AWS Shield Advanced on the EC2 root volumes.$q$, $q$Create a Network ACL blocking all outbound traffic on port 443.$q$, $q$Attach an Amazon S3 Gateway Endpoint to the Bastion host.$q$,
  0, ARRAY[0, 1, 2],
  $q$AWS WAF inspects Layer 7 traffic to block SQL injection and bot attacks, ACM TLS certificates enforce encryption in transit on ALB HTTPS listeners, and Security Group nesting restricts SSH access strictly to the bastion host.$q$
),
(
  'q-saa-41', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A company is building an event-driven serverless order processing pipeline. Orders submitted via a web API must be buffered reliably to handle high-concurrency bursts, processed asynchronously by serverless compute without message loss, and stored in a managed NoSQL database. Which THREE AWS components build this architecture? (Select THREE.)$q$,
  $q$Amazon API Gateway to receive HTTP order submissions.$q$, $q$Amazon SQS (Simple Queue Service) to reliably buffer order messages for asynchronous processing.$q$, $q$AWS Lambda to process order messages serverlessly from the queue.$q$, $q$Amazon EC2 Dedicated Hosts for compute isolation.$q$, $q$AWS Snowball Edge for offline data migration.$q$, $q$Amazon EBS Volume in Single-AZ.$q$,
  0, ARRAY[0, 1, 2],
  $q$Amazon API Gateway receives HTTP order submissions serverlessly, Amazon SQS provides durable message buffering to decouple API ingestion from processing and absorb concurrency spikes, and AWS Lambda processes messages from the queue without server management.$q$
),
(
  'q-saa-42', 'aws-saa-c03', 'Hard', 'single',
  $q$A financial services company processes nightly regulatory reports on Amazon EC2. The workload runs for 3 hours every night. If a node fails, the workload automatically retries from checkpoint files stored in S3. Which EC2 instance purchasing strategy offers the highest cost reduction?$q$,
  $q$On-Demand Instances$q$, $q$Spot Instances$q$, $q$3-Year Reserved Instances$q$, $q$Dedicated Hosts$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Because the batch processing workload is fault-tolerant and saves checkpoints in S3, EC2 Spot Instances provide the maximum cost discount (up to 90%) compared to On-Demand or Reserved Instances.$q$
),
(
  'q-saa-43', 'aws-saa-c03', 'Medium', 'single',
  $q$A company manages an e-commerce platform hosted on EC2 instances behind an Application Load Balancer. The static assets (images, CSS, JS) generate massive network bandwidth out to internet users. Which cost-effective architectural change reduces network data transfer costs and lowers server load?$q$,
  $q$Deploy an Amazon CloudFront distribution backed by an S3 origin for static assets.$q$, $q$Attach AWS Direct Connect to internet users.$q$, $q$Replace the Application Load Balancer with an Elastic IP address.$q$, $q$Enable S3 Transfer Acceleration on web server EBS volumes.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Offloading static asset delivery from EC2 web servers to CloudFront backed by S3 reduces EC2 instance load and leverages CloudFront lower Data Transfer Out pricing.$q$
),
(
  'q-saa-44', 'aws-saa-c03', 'Hard', 'single',
  $q$A company stores 500 TB of backup archives in Amazon S3 Standard. The archives are accessed once every 2 years for audit purposes. The company wants to minimize long-term storage costs. Retrievals can take up to 12 hours. Which S3 storage class should be configured?$q$,
  $q$S3 Standard-Infrequent Access (S3 Standard-IA)$q$, $q$S3 Glacier Deep Archive$q$, $q$S3 Intelligent-Tiering$q$, $q$S3 One Zone-IA$q$, NULL, NULL,
  1, ARRAY[1],
  $q$S3 Glacier Deep Archive is AWS lowest-cost storage tier, designed for long-term retention of audit archives accessed once or twice a year with retrieval times within 12 hours.$q$
),
(
  'q-saa-45', 'aws-saa-c03', 'Medium', 'single',
  $q$A company runs a containerized microservice on Amazon ECS with AWS Fargate. The microservice experiences steady traffic during business hours and minimal traffic on weekends. Which pricing option provides the lowest cost for steady-state Fargate compute workloads?$q$,
  $q$Fargate Spot$q$, $q$Compute Savings Plans$q$, $q$On-Demand Fargate$q$, $q$EBS Provisioned IOPS$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Compute Savings Plans offer up to 66% discount on AWS Fargate compute usage in exchange for a 1-year or 3-year commitment, ideal for predictable steady-state Fargate workloads.$q$
),
(
  'q-saa-46', 'aws-saa-c03', 'Hard', 'single',
  $q$A company wants to delegate IAM policy creation to junior administrators. However, security governance mandates that junior administrators must not be able to grant full AdministratorAccess or escalate their own privileges. Which IAM feature enforces a maximum permission boundary for roles created by junior admins?$q$,
  $q$Service Control Policies (SCPs)$q$, $q$IAM Permissions Boundaries attached to created IAM roles$q$, $q$IAM Access Analyzer rules$q$, $q$AWS Resource Access Manager (RAM) policies$q$, NULL, NULL,
  1, ARRAY[1],
  $q$IAM Permissions Boundaries set the maximum permissions an IAM entity (user or role) can have. Attaching a permissions boundary ensures created roles cannot exceed the specified permission ceiling even if an admin attaches AdministratorAccess.$q$
),
(
  'q-saa-47', 'aws-saa-c03', 'Medium', 'single',
  $q$An application deployed on EC2 instances in a private subnet connects to an Amazon RDS PostgreSQL database. The security team mandates that database credentials must be rotated automatically every 30 days without application downtime. Which solution fulfills this requirement with the LEAST operational effort?$q$,
  $q$Store credentials in AWS Systems Manager Parameter Store and write an AWS Lambda function to rotate keys on an EventBridge schedule.$q$, $q$Store credentials in AWS Secrets Manager and enable automatic rotation using the built-in Secrets Manager rotation Lambda template for RDS PostgreSQL.$q$, $q$Encrypt credentials in a configuration file on the EC2 instance using AWS KMS and update the file manually every month.$q$, $q$Store credentials in an Amazon S3 bucket encrypted with SSE-KMS and trigger a quarterly manual update script.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Secrets Manager natively integrates with Amazon RDS to manage and automatically rotate database credentials using pre-built Lambda templates without requiring custom code.$q$
),
(
  'q-saa-48', 'aws-saa-c03', 'Medium', 'single',
  $q$A mobile application requires user registration, login via social identity providers (Google and Facebook), and temporary AWS credentials so authenticated users can upload photos directly to an Amazon S3 bucket. Which combination of Amazon Cognito features should be used?$q$,
  $q$Amazon Cognito User Pools for user authentication and Cognito Identity Pools (Federated Identities) for temporary AWS IAM credentials.$q$, $q$Amazon Cognito User Pools only, configured with direct S3 bucket permissions.$q$, $q$Amazon Cognito Identity Pools only, backed by AWS IAM User Access Keys.$q$, $q$AWS IAM Identity Center integrated with Amazon CloudFront.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Amazon Cognito User Pools handle user sign-up, sign-in, and social federation. Cognito Identity Pools exchange the user authentication token for temporary, scoped AWS IAM credentials allowing direct S3 uploads.$q$
),
(
  'q-saa-49', 'aws-saa-c03', 'Medium', 'single',
  $q$A health insurance company stores millions of medical records and customer identity documents in Amazon S3 buckets. The compliance officer needs automated alerts whenever Personally Identifiable Information (PII) or unencrypted sensitive data is detected in S3. Which service provides automated machine learning discovery of sensitive data in S3?$q$,
  $q$Amazon GuardDuty$q$, $q$Amazon Macie$q$, $q$Amazon Inspector$q$, $q$AWS Security Hub$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon Macie is a fully managed data security and privacy service that uses machine learning and pattern matching to discover and protect sensitive data (such as PII) stored in Amazon S3.$q$
),
(
  'q-saa-50', 'aws-saa-c03', 'Hard', 'single',
  $q$A security operations team requires continuous threat monitoring across all AWS accounts in an organization. The security service must analyze VPC Flow Logs, AWS CloudTrail management events, and DNS logs to detect compromised EC2 instances, unauthorized cryptocurrency mining, and unusual API activity. Which service meets these criteria with no agent installation?$q$,
  $q$AWS Inspector$q$, $q$Amazon GuardDuty$q$, $q$AWS Config$q$, $q$AWS WAF$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon GuardDuty is an intelligent threat detection service that continuously monitors VPC Flow Logs, CloudTrail logs, and DNS logs using anomaly detection and threat intelligence without requiring agent software.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 3: q-saa-51 to q-saa-75
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-51', 'aws-saa-c03', 'Hard', 'single',
  $q$A multinational company processes sensitive financial data in US-East (N. Virginia) and EU-West (Frankfurt). Data encrypted in US-East must be decrypted in EU-West during disaster recovery failover without making client-side API calls to re-encrypt data under a separate Regional key. Which AWS KMS key type supports this cross-Region decryption requirement?$q$,
  $q$AWS Managed Key for S3$q$, $q$AWS KMS Multi-Region Key$q$, $q$AWS KMS Asymmetric Key with RSA 4096$q$, $q$AWS CloudHSM Cluster with Local Peering$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS KMS Multi-Region Keys are primary keys in one Region that can be replicated into secondary Regions. They share the same key ID and key material, allowing data encrypted in one Region to be decrypted in another without re-encryption.$q$
),
(
  'q-saa-52', 'aws-saa-c03', 'Hard', 'single',
  $q$A company wants to inspect all outbound traffic from VPC subnets to the internet to prevent data exfiltration. The inspection device must enforce domain name filtering (SNI), stateful pattern matching, and layer 3-7 threat prevention across hundreds of VPCs connected via AWS Transit Gateway. Which service should be deployed?$q$,
  $q$Network ACLs on public subnets$q$, $q$AWS Network Firewall deployed in an inspection VPC connected to Transit Gateway$q$, $q$AWS WAF associated with NAT Gateways$q$, $q$Amazon GuardDuty Malware Protection$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Network Firewall provides stateful network inspection, URL/domain filtering, and IPS capabilities. Centralizing AWS Network Firewall in an inspection VPC via Transit Gateway allows filtering for all VPC outbound traffic.$q$
),
(
  'q-saa-53', 'aws-saa-c03', 'Medium', 'single',
  $q$A security manager needs a single dashboard that aggregates security alerts and compliance statuses from Amazon GuardDuty, Amazon Inspector, Amazon Macie, and AWS IAM Access Analyzer across all accounts in AWS Organizations. Which service provides this centralized security posture visibility?$q$,
  $q$AWS Systems Manager Compliance$q$, $q$AWS Security Hub$q$, $q$AWS Config Conformance Packs$q$, $q$Amazon CloudWatch ServiceLens$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Security Hub gives a comprehensive view of security posture across AWS accounts by aggregating and prioritizing security findings from GuardDuty, Inspector, Macie, IAM Access Analyzer, and AWS Firewall Manager.$q$
),
(
  'q-saa-54', 'aws-saa-c03', 'Medium', 'single',
  $q$A central networking team manages a core VPC containing NAT Gateways and Transit Gateways. The team needs to share specific VPC subnets with application development teams operating in separate AWS accounts within the same organization, without granting admin access to the networking VPC. Which service enables subnet sharing across accounts?$q$,
  $q$AWS Transit Gateway Peering$q$, $q$AWS Resource Access Manager (AWS RAM)$q$, $q$VPC Peering Connections$q$, $q$AWS IAM Identity Center$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Resource Access Manager (AWS RAM) allows organizations to securely share AWS resources—such as VPC subnets, Transit Gateways, and License Manager configurations—across AWS accounts.$q$
),
(
  'q-saa-55', 'aws-saa-c03', 'Medium', 'single',
  $q$A DevSecOps team wants to automatically scan EC2 instances and ECR container images for software vulnerabilities and unintended network exposure. Scans must occur automatically whenever container images are pushed to ECR. Which service performs automated vulnerability management for EC2 and ECR?$q$,
  $q$Amazon GuardDuty$q$, $q$Amazon Inspector$q$, $q$AWS WAF$q$, $q$AWS Security Hub$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon Inspector is an automated vulnerability management service that scans EC2 instances for software vulnerabilities and network exposure, and automatically scans container images pushed to Amazon ECR.$q$
),
(
  'q-saa-56', 'aws-saa-c03', 'Medium', 'single',
  $q$An enterprise requires continuous tracking of configuration changes made to AWS infrastructure resources. If an unencrypted S3 bucket or open Security Group is detected, an automated notification must be sent and an automated remediation script must execute. Which service tracks resource configurations and evaluates compliance rules?$q$,
  $q$AWS CloudTrail$q$, $q$AWS Config$q$, $q$Amazon CloudWatch Logs$q$, $q$AWS Systems Manager Change Manager$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Config continuously monitors and records AWS resource configurations, evaluating recorded configurations against desired rules. It supports automated remediation via Systems Manager Automation documents.$q$
),
(
  'q-saa-57', 'aws-saa-c03', 'Hard', 'single',
  $q$A financial archive mandates strict Write Once, Read Many (WORM) storage for compliance auditing. Once written to S3, objects must not be deleted or overwritten by any user—including the AWS root user—for a mandatory 5-year retention period. Which S3 feature enforces this immutable retention model?$q$,
  $q$S3 Object Lock in Governance Mode$q$, $q$S3 Object Lock in Compliance Mode$q$, $q$S3 Bucket Policy with Deny DeleteObject$q$, $q$S3 Versioning with MFA Delete enabled$q$, NULL, NULL,
  1, ARRAY[1],
  $q$S3 Object Lock in Compliance Mode prevents an object version from being deleted or overwritten by any user, including the root user in your AWS account, until the retention period expires.$q$
),
(
  'q-saa-58', 'aws-saa-c03', 'Medium', 'single',
  $q$An organization with 50 AWS accounts needs a central log archive where API calls across all accounts are logged and stored in a secure S3 bucket in a dedicated Log Archive account. Member account administrators must not be able to stop logging or modify log files. What solution achieves this governance requirement?$q$,
  $q$Configure individual CloudTrail trails in each account pointing to a local S3 bucket.$q$, $q$Create an Organization Trail in the management account that automatically logs API activity across all member accounts into a central S3 bucket in the Log Archive account.$q$, $q$Enable VPC Flow Logs in every account and stream to Kinesis Data Firehose.$q$, $q$Use CloudWatch Logs Log Group Subscriptions with IAM cross-account roles.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$An Organization Trail created in the management account or delegated administrator account automatically logs events for all AWS accounts in the organization to a centralized S3 bucket with central IAM controls.$q$
),
(
  'q-saa-59', 'aws-saa-c03', 'Hard', 'single',
  $q$A company uses a VPC Gateway Endpoint for Amazon S3 in a private subnet. The security team wants to ensure EC2 instances in this VPC can ONLY access S3 buckets owned by the company (e.g. `arn:aws:s3:::my-company-*`), blocking access to any external or third-party S3 buckets. How should this access control be enforced?$q$,
  $q$Attach an S3 Bucket Policy to all external S3 buckets.$q$, $q$Attach a custom VPC Endpoint Policy to the VPC Gateway Endpoint for S3 restricting Resource access to `arn:aws:s3:::my-company-*`.$q$, $q$Configure Security Group outbound rules blocking TCP port 443.$q$, $q$Use a Network ACL denying outbound traffic to S3 IP address ranges.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$VPC Endpoint Policies are IAM resource policies attached to VPC endpoints that control which principals can use the endpoint and which resources (buckets) can be accessed through it.$q$
),
(
  'q-saa-60', 'aws-saa-c03', 'Medium', 'single',
  $q$An enterprise wants to grant 500 corporate employees single sign-on (SSO) access to multiple AWS accounts using their existing Microsoft Active Directory credentials. The solution must support SAML 2.0 and assign fine-grained permissions based on AD user groups. Which service should be configured?$q$,
  $q$IAM Users with Long-Term Access Keys$q$, $q$AWS IAM Identity Center (successor to AWS Single Sign-On)$q$, $q$Amazon Cognito User Pools$q$, $q$AWS Directory Service Simple AD$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS IAM Identity Center connects with existing identity providers (such as Active Directory or Okta via SAML 2.0/SCIM) to manage single sign-on access across multiple AWS accounts in AWS Organizations.$q$
),
(
  'q-saa-61', 'aws-saa-c03', 'Hard', 'single',
  $q$A cloud operations team needs to automate the creation of new AWS accounts in AWS Organizations with standard baseline security controls, VPC networking, IAM roles, and centralized logging pre-configured. Which service automates account provisioning using a Landing Zone governance model?$q$,
  $q$AWS Service Catalog$q$, $q$AWS Control Tower$q$, $q$AWS CloudFormation StackSets$q$, $q$AWS Config Conformance Packs$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Control Tower sets up and governs a multi-account AWS environment using Landing Zones, automating account creation via Account Factory and applying preventive/detective guardrails.$q$
),
(
  'q-saa-62', 'aws-saa-c03', 'Hard', 'single',
  $q$A software application needs to encrypt large multi-gigabyte files locally before uploading them to storage. The application calls AWS KMS to obtain a plaintext data encryption key (DEK) and an encrypted DEK, encrypts the file locally using the plaintext DEK, and discards the plaintext DEK from memory. What is this encryption pattern called?$q$,
  $q$Client-Side Asymmetric Rotation$q$, $q$Envelope Encryption$q$, $q$Server-Side Key Exchange$q$, $q$Transport Layer Key Wrapping$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Envelope encryption is the practice of encrypting plaintext data with a data key (DEK), and then encrypting the data key under a root Key Management Service key (KMS CMK).$q$
),
(
  'q-saa-63', 'aws-saa-c03', 'Medium', 'single',
  $q$A media company hosts a web frontend on Amazon CloudFront backed by a standard Amazon S3 bucket origin. Direct public access to the S3 bucket objects must be completely prevented so all user requests pass exclusively through CloudFront for WAF inspection and caching. Which configuration secures the S3 origin?$q$,
  $q$Use S3 Transfer Acceleration with MFA Delete.$q$, $q$Configure CloudFront Origin Access Control (OAC) and update the S3 bucket policy to grant s3:GetObject permission only to the CloudFront service principal.$q$, $q$Enable S3 Static Website Hosting and set the bucket ACL to Public Read.$q$, $q$Place the S3 bucket inside a private VPC subnet.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$CloudFront Origin Access Control (OAC) authenticates requests from CloudFront to standard S3 REST API origins using Signature Version 4. The S3 bucket policy restricts s3:GetObject access strictly to the CloudFront service principal (cloudfront.amazonaws.com) matching the distribution ARN.$q$
),
(
  'q-saa-64', 'aws-saa-c03', 'Hard', 'single',
  $q$A security audit reveals that web applications hosted on EC2 instances are vulnerable to Server-Side Request Forgery (SSRF) attacks, exposing local Instance Metadata Service (IMDS) credentials. How can the solution architect enforce session-oriented, token-backed IMDS requests to mitigate SSRF vulnerabilities?$q$,
  $q$Disable Instance Metadata Service on all EC2 instances.$q$, $q$Enforce Instance Metadata Service Version 2 (IMDSv2) and set HttpTokens to required.$q$, $q$Configure Network ACLs blocking port 80 to 169.254.169.254.$q$, $q$Attach an IAM Permission Boundary to the EC2 Instance Profile.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$IMDSv2 uses session-oriented requests requiring a Secret Token (PUT request) before fetching metadata, protecting against SSRF vulnerabilities that exploit header-less GET requests in IMDSv1.$q$
),
(
  'q-saa-65', 'aws-saa-c03', 'Medium', 'single',
  $q$A network engineer needs to block inbound traffic from a specific malicious IPv4 IP address (`203.0.113.50`) attempting brute-force attacks against servers in a public subnet. Which network control can explicitly block this specific IP address?$q$,
  $q$Security Group inbound rule$q$, $q$Network ACL (NACL) explicit DENY rule placed before ALLOW rules$q$, $q$AWS KMS Key Policy$q$, $q$Route 53 Resolver DNS Firewall$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Network ACLs support explicit DENY rules evaluated in numerical rule order. Security Groups only support ALLOW rules and cannot explicitly block specific IP addresses.$q$
),
(
  'q-saa-66', 'aws-saa-c03', 'Hard', 'single',
  $q$A public e-commerce portal behind an Application Load Balancer suffers from automated HTTP request floods from malicious bots, degrading performance for real buyers. The security team needs to automatically rate-limit IP addresses making more than 2,000 requests per 5-minute period. Which AWS WAF rule type provides this protection?$q$,
  $q$AWS WAF Managed Ruleset for SQL Injection$q$, $q$AWS WAF Rate-Based Rule$q$, $q$AWS WAF Geo Match Rule$q$, $q$AWS Shield Standard Network Protocol Rule$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS WAF Rate-Based Rules track the rate of requests from each originating IP address and trigger configured actions (such as Block or CAPTCHA) when the request rate exceeds the specified threshold over a 5-minute evaluation window.$q$
),
(
  'q-saa-67', 'aws-saa-c03', 'Medium', 'single',
  $q$Account A needs to grant Account B read access to an Amazon S3 bucket without requiring users in Account B to switch IAM roles via AssumeRole. Which resource-based policy allows users in Account B to access Account A S3 bucket directly?$q$,
  $q$S3 Bucket Policy attached to the S3 bucket in Account A granting Principal permissions to Account B IAM users.$q$, $q$IAM Group Policy in Account B with AdministratorAccess.$q$, $q$AWS Organizations SCP in the management account.$q$, $q$VPC Gateway Endpoint Policy in Account B.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Resource-based policies (such as S3 Bucket Policies) can grant cross-account principals direct access to resources without requiring the target user to assume a role.$q$
),
(
  'q-saa-68', 'aws-saa-c03', 'Hard', 'single',
  $q$A high-volume betting website requires advanced Distributed Denial of Service (DDoS) protection for its Application Load Balancers and CloudFront distributions. The company requires 24/7 access to the AWS Shield Response Team (SRT) and financial protection against scaling cost spikes caused by DDoS attacks. Which subscription service meets these requirements?$q$,
  $q$AWS Shield Standard$q$, $q$AWS Shield Advanced$q$, $q$AWS WAF Core Rule Set$q$, $q$AWS Network Firewall$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Shield Advanced provides enhanced DDoS protection, direct access to the 24/7 Shield Response Team (SRT), advanced health-based detection, and financial protection covering ELB/CloudFront scaling costs due to attacks.$q$
),
(
  'q-saa-69', 'aws-saa-c03', 'Medium', 'single',
  $q$A Lambda function running in Account A needs to retrieve a database password secret stored in AWS Secrets Manager in Account B. How should access be granted across accounts securely?$q$,
  $q$Export the secret plaintext into an S3 bucket and share the bucket ACL.$q$, $q$Configure a resource-based policy on the secret in Account B granting secretsmanager:GetSecretValue permission to the Lambda execution role in Account A, attach an identity-based IAM policy to the Lambda role, and ensure the KMS key policy in Account B permits kms:Decrypt access.$q$, $q$Pass Account B root credentials to the Lambda function environment variables.$q$, $q$Use VPC Peering between Account A and Account B.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Cross-account access to Secrets Manager requires a resource-based policy on the secret granting secretsmanager:GetSecretValue to the calling IAM role in Account A, an identity-based IAM policy on the role, and customer-managed KMS key policy permissions in Account B allowing kms:Decrypt.$q$
),
(
  'q-saa-70', 'aws-saa-c03', 'Medium', 'single',
  $q$A security engineer needs to capture IP traffic flowing to and from network interfaces in private subnets across multiple VPCs for security auditing and forensic investigation. The logs must be saved into an S3 bucket every 1 minute. Which feature provides this network log capture?$q$,
  $q$AWS CloudTrail Event Logs$q$, $q$VPC Flow Logs delivered to Amazon S3$q$, $q$Route 53 Resolver Query Logs$q$, $q$EC2 System Log Streams$q$, NULL, NULL,
  1, ARRAY[1],
  $q$VPC Flow Logs capture information about IP traffic going to and from network interfaces in your VPC, streaming flow log data directly to Amazon S3 or CloudWatch Logs.$q$
),
(
  'q-saa-71', 'aws-saa-c03', 'Medium', 'single',
  $q$A microservice needs to retrieve API license keys stored in AWS Systems Manager Parameter Store. The keys must be encrypted at rest. Which Parameter Store type should be selected?$q$,
  $q$String$q$, $q$StringList$q$, $q$SecureString backed by an AWS KMS key$q$, $q$Plaintext JSON$q$, NULL, NULL,
  2, ARRAY[2],
  $q$SecureString parameters in SSM Parameter Store encrypt sensitive data (such as API keys or passwords) at rest using AWS KMS keys.$q$
),
(
  'q-saa-72', 'aws-saa-c03', 'Medium', 'single',
  $q$A company wants to manage EC2 instances in private subnets without opening inbound SSH port 22 in Security Groups or assigning public IP addresses to instances. Audit logs of all shell commands executed by admins must be recorded in CloudWatch Logs. Which AWS Systems Manager capability replaces traditional SSH access?$q$,
  $q$SSM Patch Manager$q$, $q$SSM Session Manager$q$, $q$SSM State Manager$q$, $q$SSM Automation$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Systems Manager Session Manager provides secure, one-click instance management via browser or CLI without opening inbound ports, managing SSH keys, or requiring public IP addresses.$q$
),
(
  'q-saa-73', 'aws-saa-c03', 'Easy', 'single',
  $q$A security policy mandates that all objects uploaded to an Amazon S3 bucket must be encrypted at rest using Server-Side Encryption with AWS KMS (SSE-KMS) using a specified key. Any upload request that does not specify SSE-KMS encryption must be explicitly rejected. How should this compliance policy be enforced?$q$,
  $q$Attach an S3 bucket policy with an explicit Deny statement for s3:PutObject when the s3:x-amz-server-side-encryption request header is not set to aws:kms.$q$, $q$Enable S3 Versioning with MFA Delete on the destination bucket.$q$, $q$Configure an S3 Lifecycle rule to encrypt unencrypted objects after 24 hours.$q$, $q$Attach an EC2 Security Group rule blocking HTTP port 80.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$An S3 bucket policy with an explicit Deny statement evaluates first and rejects any s3:PutObject request that fails to include the required s3:x-amz-server-side-encryption: aws:kms request header or specified KMS key ARN.$q$
),
(
  'q-saa-74', 'aws-saa-c03', 'Hard', 'single',
  $q$A cloud security team needs to identify all S3 buckets, KMS keys, and IAM roles across their AWS accounts that have been shared with external AWS accounts or public internet principals. Which IAM tool analyzes resource-based policies to identify unintended external access paths?$q$,
  $q$IAM Policy Simulator$q$, $q$AWS IAM Access Analyzer$q$, $q$AWS Trusted Advisor Security Checks$q$, $q$AWS Config Rules$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS IAM Access Analyzer uses mathematical logic and automated reasoning to analyze resource-based policies, identifying resources shared outside your AWS account or organization.$q$
),
(
  'q-saa-75', 'aws-saa-c03', 'Hard', 'single',
  $q$A company needs to connect its VPC to a third-party SaaS provider hosted on AWS. The network connection must be private, unidirectional (preventing SaaS provider from initiating connections into the company VPC), and avoid overlapping IP CIDR range conflicts. Which technology satisfies this design?$q$,
  $q$VPC Peering Connection$q$, $q$AWS PrivateLink (VPC Interface Endpoint)$q$, $q$AWS Transit Gateway Peering$q$, $q$AWS Site-to-Site VPN$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS PrivateLink establishes private, unidirectional connectivity between VPCs via Endpoint Services and Interface Endpoints, eliminating IP address overlap issues associated with VPC Peering.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 4: q-saa-76 to q-saa-100
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-76', 'aws-saa-c03', 'Hard', 'single',
  $q$A security architect wants to grant S3 bucket access to all AWS accounts belonging to an organization in AWS Organizations (`o-exampleorgid`), while denying access to any AWS account outside the organization. Which condition key should be used in the S3 bucket policy?$q$,
  $q$Condition `StringEquals` on `aws:PrincipalOrgID` set to `o-exampleorgid`$q$, $q$Condition `IpAddress` on `aws:VpcSourceIp`$q$, $q$Condition `StringEquals` on `aws:UserAgent`$q$, $q$Condition `ArnEquals` on `aws:PrincipalArn`$q$, NULL, NULL,
  0, ARRAY[0],
  $q$The `aws:PrincipalOrgID` global condition key allows specifying the AWS Organizations ID in resource policies, automatically restricting access to any account within the organization.$q$
),
(
  'q-saa-77', 'aws-saa-c03', 'Medium', 'single',
  $q$A banking application hosted on internal EC2 instances behind an internal Application Load Balancer requires HTTPS encryption in transit. The SSL/TLS certificates must be issued by a private internal Certificate Authority managed centrally in AWS. Which service generates and manages private certificates?$q$,
  $q$AWS KMS Asymmetric Keys$q$, $q$AWS Certificate Manager (ACM) Private CA$q$, $q$AWS CloudHSM PKI Plugin$q$, $q$AWS Secrets Manager$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Certificate Manager (ACM) Private CA enables creation of private Certificate Authority hierarchies to issue and manage private TLS certificates for internal endpoints.$q$
),
(
  'q-saa-78', 'aws-saa-c03', 'Easy', 'single',
  $q$A company stores sensitive patient health records in an Amazon DynamoDB table. Compliance requires encrypting data at rest using a Customer Managed KMS key that can be audited via CloudTrail. Which DynamoDB encryption setting achieves this compliance goal?$q$,
  $q$Enable Client-Side Encryption with OpenSSL.$q$, $q$Configure DynamoDB Encryption at Rest using AWS KMS Customer Managed Key (CMK).$q$, $q$Use S3 Glacier Vault Lock on DynamoDB backups.$q$, $q$Enable Transparent Data Encryption (TDE).$q$, NULL, NULL,
  1, ARRAY[1],
  $q$DynamoDB supports native encryption at rest using AWS Managed Keys or Customer Managed Keys (CMKs) in AWS KMS, logging key usage events to CloudTrail.$q$
),
(
  'q-saa-79', 'aws-saa-c03', 'Hard', 'single',
  $q$A financial API hosted on Amazon API Gateway must authenticate partner applications using Mutual TLS (mTLS) to verify client-side X.509 digital certificates. What requirement must be configured on API Gateway for mTLS support?$q$,
  $q$Custom Domain Name with a truststore containing client CA certificates stored in Amazon S3.$q$, $q$AWS WAF Rate-Based Rule with SSL Passthrough.$q$, $q$Network Load Balancer in front of API Gateway running in TCP mode.$q$, $q$Amazon Cognito User Pool with OAuth 2.0 Client Credentials.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$API Gateway supports Mutual TLS (mTLS) by configuring a Custom Domain Name and uploading an X.509 certificate truststore (containing CA certificates) to an S3 bucket.$q$
),
(
  'q-saa-80', 'aws-saa-c03', 'Hard', 'single',
  $q$A global enterprise runs a critical web application in primary (US-East-1) and secondary (US-West-2) AWS Regions. The architecture uses Route 53 Application Recovery Controller (ARC) Routing Control. During a major regional outage in US-East-1, how does Route 53 ARC execute a reliable failover to US-West-2?$q$,
  $q$By updating DNS A records manually via AWS CLI scripts.$q$, $q$By using highly available routing control safety rules and cluster endpoints distributed across 5 AWS Regions to safely shift traffic.$q$, $q$By triggering S3 Cross-Region Replication failover hooks.$q$, $q$By changing the VPC CIDR block routing tables.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Route 53 Application Recovery Controller (ARC) provides routing controls and safety rules built on cluster endpoints deployed across 5 separate AWS Regions, ensuring reliable failover execution even during single-Region control plane outages.$q$
),
(
  'q-saa-81', 'aws-saa-c03', 'Hard', 'single',
  $q$A company configures bi-directional S3 Cross-Region Replication (CRR) between an S3 bucket in us-east-1 and a replica S3 bucket in eu-west-1. The security team mandates that any metadata modifications (such as Object Tags, ACLs, or Object Lock settings) applied to replica objects in the destination bucket must automatically sync back to the source objects in the primary bucket. Which S3 Replication feature fulfills this requirement?$q$,
  $q$S3 Transfer Acceleration$q$, $q$S3 Replica Modification Sync$q$, $q$S3 Object Lock Governance Mode$q$, $q$S3 Event Notifications with AWS Lambda$q$, NULL, NULL,
  1, ARRAY[1],
  $q$S3 Replica Modification Sync replicates metadata changes—such as object tags, ACLs, or Object Lock settings—made to replica objects in a destination bucket back to the source objects in the primary bucket, enabling two-way metadata synchronization.$q$
),
(
  'q-saa-82', 'aws-saa-c03', 'Hard', 'single',
  $q$A database administrator provisions an Amazon RDS Multi-AZ DB Cluster (with two readable standby DB instances across 3 AZs) instead of a standard Multi-AZ DB instance deployment. What key architectural advantage does an RDS Multi-AZ DB Cluster provide for write-heavy workloads?$q$,
  $q$Lower transaction commit latency (typically under 20 ms) due to DB cluster storage and readable standby endpoints.$q$, $q$Infinite serverless storage scaling with zero IOPS costs.$q$, $q$Automatic cross-Region multi-master writes.$q$, $q$Zero downtime database engine version upgrades without failover.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Amazon RDS Multi-AZ DB Clusters feature one primary and two readable standby instances across 3 AZs, using NVMe-based local SSD caching and optimized replication to provide faster transaction commit latency (<20ms) and readable standbys.$q$
),
(
  'q-saa-83', 'aws-saa-c03', 'Medium', 'single',
  $q$A banking transaction pipeline requires that financial messages pushed to an SQS queue are processed in the EXACT order they are sent, with ZERO duplicate messages delivered to backend consumers. Which queue type meets these strict requirements?$q$,
  $q$Standard SQS Queue with Dead-Letter Queue$q$, $q$SQS FIFO Queue with Message Deduplication ID and Message Group ID$q$, $q$Amazon SNS Standard Topic$q$, $q$Amazon EventBridge Custom Event Bus$q$, NULL, NULL,
  1, ARRAY[1],
  $q$SQS FIFO (First-In-First-Out) queues guarantee that message order is strictly preserved and messages are processed exactly once without duplicates.$q$
),
(
  'q-saa-84', 'aws-saa-c03', 'Medium', 'single',
  $q$A worker application polling an SQS queue encounters malformed messages that crash the worker process repeatedly (a "poison pill" message). This causes the message to return to the queue endlessly. How should the SQS queue be configured to isolate unprocessable messages after 5 failed attempts?$q$,
  $q$Increase SQS Visibility Timeout to 12 hours.$q$, $q$Configure a SQS Dead-Letter Queue (DLQ) with `maxReceiveCount` set to 5.$q$, $q$Enable S3 Versioning on the worker EC2 volume.$q$, $q$Set SQS DelaySeconds to 900.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$A Dead-Letter Queue (DLQ) receives messages that fail processing after a specified number of retries (`maxReceiveCount`), isolating faulty messages for developer inspection without blocking queue processing.$q$
),
(
  'q-saa-85', 'aws-saa-c03', 'Medium', 'single',
  $q$A company runs microservices across two separate VPCs (VPC A and VPC B) connected via VPC Peering. Microservices in VPC B need to resolve the internal private domain name `api.internal.company.local` which is hosted in a Route 53 Private Hosted Zone associated with VPC A. How can Route 53 DNS resolution be enabled for VPC B?$q$,
  $q$Create a second public hosted zone in Route 53.$q$, $q$Associate VPC B with the existing Route 53 Private Hosted Zone for `api.internal.company.local`.$q$, $q$Deploy an Internet Gateway in VPC B.$q$, $q$Configure Route 53 Latency Routing Policy.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Route 53 Private Hosted Zones can be associated with multiple VPCs across AWS accounts, enabling private DNS resolution across peered VPC networks.$q$
),
(
  'q-saa-86', 'aws-saa-c03', 'Medium', 'single',
  $q$A centralized IT compliance team uses AWS Backup to manage backups across 100 AWS accounts. The disaster recovery policy mandates that daily backups of EBS volumes and RDS databases must be copied automatically to a secondary AWS Region in a separate backup vault. Which AWS Backup feature automates this cross-Region cross-account copy?$q$,
  $q$AWS Backup Vault Lock and Scheduled Backup Plans with Copy Actions$q$, $q$AWS DataSync Task Schedules$q$, $q$S3 Cross-Region Replication Rules$q$, $q$AWS CloudFormation StackSets$q$, NULL, NULL,
  0, ARRAY[0],
  $q$AWS Backup Plans allow configuring automated copy actions that replicate backup snapshots into separate backup vaults in different AWS Regions or accounts.$q$
),
(
  'q-saa-87', 'aws-saa-c03', 'Hard', 'single',
  $q$An e-commerce website experiences sudden unpredictable surges in web traffic due to viral flash sales. The Auto Scaling group CPU utilization rises from 20% to 90% within 1 minute. Standard Target Tracking scaling takes several minutes to add capacity. How can the scaling policy be adjusted to react more aggressively to sudden spikes?$q$,
  $q$Switch to Step Scaling Policy with CloudWatch Alarms configured with lower evaluation periods.$q$, $q$Increase the Auto Scaling Cooldown period to 600 seconds.$q$, $q$Use Scheduled Scaling Actions every hour.$q$, $q$Configure S3 Transfer Acceleration on EC2 instances.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Step Scaling Policies scale out capacity immediately based on the size of the alarm breach (steps), allowing aggressive capacity expansion during dramatic traffic spikes.$q$
),
(
  'q-saa-88', 'aws-saa-c03', 'Easy', 'single',
  $q$An Application Load Balancer distributes web requests across 4 EC2 instances in Availability Zone A and 1 EC2 instance in Availability Zone B. Traffic arriving at AZ A is heavy, overloading the single instance in AZ B. What ELB feature ensures traffic is distributed evenly across all 5 instances regardless of their AZ?$q$,
  $q$Cross-Zone Load Balancing$q$, $q$Sticky Sessions (Session Affinity)$q$, $q$Path-Based Routing Rules$q$, $q$Connection Draining$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Cross-Zone Load Balancing ensures that load balancer nodes distribute incoming traffic evenly across all registered targets in all enabled Availability Zones.$q$
),
(
  'q-saa-89', 'aws-saa-c03', 'Hard', 'single',
  $q$A financial enterprise requires a disaster recovery strategy with a Recovery Time Objective (RTO) of under 10 minutes and Recovery Point Objective (RPO) under 1 minute. The primary Region runs active workloads, while a secondary Region maintains a scaled-down but fully functional copy of core infrastructure (small EC2 instances, active DB replica) ready to scale up immediately upon failover. Which DR strategy is this?$q$,
  $q$Backup and Restore$q$, $q$Pilot Light$q$, $q$Warm Standby$q$, $q$Multi-Site Active-Active$q$, NULL, NULL,
  2, ARRAY[2],
  $q$Warm Standby maintains a scaled-down but fully operational version of the infrastructure running 24/7 in the secondary Region, capable of taking full production traffic quickly when scaled up.$q$
),
(
  'q-saa-90', 'aws-saa-c03', 'Hard', 'single',
  $q$A global game publisher hosts a multiplayer game with database nodes in `us-east-1`, `eu-west-1`, and `ap-northeast-1`. Players must be able to read and write player profiles locally in their closest Region with automatic multi-master conflict resolution and sub-second cross-Region database replication. Which database technology fulfills this requirement?$q$,
  $q$Amazon RDS PostgreSQL Read Replicas$q$, $q$Amazon DynamoDB Global Tables$q$, $q$Amazon Redshift Multi-Region Cluster$q$, $q$Amazon ElastiCache for Redis Read Replicas$q$, NULL, NULL,
  1, ARRAY[1],
  $q$DynamoDB Global Tables provide a fully managed, multi-region, multi-active database that automatically replicates DynamoDB tables across selected AWS Regions with fast, local read and write performance.$q$
),
(
  'q-saa-91', 'aws-saa-c03', 'Medium', 'single',
  $q$A company stores shared document repositories on Amazon EFS file systems. To protect against accidental file deletion or corruption by employees, the solution architect needs automated daily file system backups retained for 30 days. Which service provides automated management of EFS backups?$q$,
  $q$EFS Lifecycle Management$q$, $q$AWS Backup$q$, $q$AWS Storage Gateway Snapshot Scheduler$q$, $q$Amazon S3 Versioning$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Backup centrally automates data protection across AWS services including Amazon EFS, EBS, RDS, DynamoDB, and S3.$q$
),
(
  'q-saa-92', 'aws-saa-c03', 'Medium', 'single',
  $q$An operations team needs to update the EC2 instance type and AMI ID used by an existing Auto Scaling group without re-creating the Auto Scaling group itself. The solution must support instance parameter versioning. Which feature should be used?$q$,
  $q$EC2 Launch Configurations$q$, $q$EC2 Launch Templates$q$, $q$AWS CloudFormation Parameter Store$q$, $q$EC2 Elastic Block Store Snapshots$q$, NULL, NULL,
  1, ARRAY[1],
  $q$EC2 Launch Templates provide versioned configuration parameters for Auto Scaling groups, supporting advanced features like T2/T3 Unlimited, Spot Fleet specifications, and IMDSv2 enforcement (unlike legacy Launch Configurations).$q$
),
(
  'q-saa-93', 'aws-saa-c03', 'Hard', 'single',
  $q$An event-driven microservices order application processes events via Amazon EventBridge. A bug in a deployment caused processed order events to be dropped for 2 hours. After deploying a code fix, the team needs to re-process the exact events that occurred during those 2 hours. Which EventBridge feature enables re-processing past events?$q$,
  $q$EventBridge Event Bus Rules$q$, $q$EventBridge Event Archive and Replay$q$, $q$EventBridge Schema Registry$q$, $q$EventBridge API Destinations$q$, NULL, NULL,
  1, ARRAY[1],
  $q$EventBridge Archive and Replay allows recording past events sent to an event bus into an archive and replaying them at a later time to recover from application errors.$q$
),
(
  'q-saa-94', 'aws-saa-c03', 'Medium', 'single',
  $q$A security requirement mandates storing an exact duplicate copy of all objects uploaded to an S3 bucket into a separate log compliance S3 bucket located in the SAME AWS Region but owned by a separate AWS audit account. Which feature automates object replication within the same Region?$q$,
  $q$S3 Cross-Region Replication (CRR)$q$, $q$S3 Same-Region Replication (SRR)$q$, $q$S3 Transfer Acceleration$q$, $q$S3 Lifecycle Expiration Rules$q$, NULL, NULL,
  1, ARRAY[1],
  $q$S3 Same-Region Replication (SRR) automatically replicates new S3 objects across buckets in the same AWS Region, useful for log aggregation into a separate security account.$q$
),
(
  'q-saa-95', 'aws-saa-c03', 'Hard', 'single',
  $q$An enterprise wants to replace on-premises tape backup infrastructure with a cloud-based solution. The backup application uses iSCSI virtual tape interfaces. Backups must be written to virtual tapes, stored in S3, and archived to S3 Glacier for long-term retention. Which AWS service provides virtual tape interfaces?$q$,
  $q$AWS Storage Gateway (Tape Gateway)$q$, $q$AWS Storage Gateway (Volume Gateway)$q$, $q$AWS DataSync$q$, $q$AWS Transfer Family$q$, NULL, NULL,
  0, ARRAY[0],
  $q$AWS Storage Gateway Tape Gateway presents an iSCSI-based virtual tape library (VTL) to existing backup applications, storing virtual tapes in S3 and archiving them to S3 Glacier / Glacier Deep Archive.$q$
),
(
  'q-saa-96', 'aws-saa-c03', 'Medium', 'single',
  $q$A company hosts legacy TCP servers on EC2. External client firewalls require whitelisting static public IP addresses for inbound connections. The solution architect needs a high-availability load balancer that provides a static Elastic IP address per Availability Zone and handles millions of TCP requests per second with ultra-low latency. Which load balancer should be deployed?$q$,
  $q$Application Load Balancer (ALB)$q$, $q$Network Load Balancer (NLB)$q$, $q$Classic Load Balancer (CLB)$q$, $q$AWS Gateway Load Balancer (GWLB)$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Network Load Balancers (NLBs) operate at Layer 4 (TCP/UDP/TLS), handle sudden ultra-high traffic volume with microsecond latency, and provide a fixed static Elastic IP address per Availability Zone.$q$
),
(
  'q-saa-97', 'aws-saa-c03', 'Medium', 'single',
  $q$An enterprise maintains an Active-Passive disaster recovery configuration for a public web application. All DNS traffic should normally be routed to the primary AWS Region. If the primary Region ALB health check fails, Route 53 must automatically divert all DNS queries to the secondary DR Region. Which Route 53 routing policy executes this failover?$q$,
  $q$Multivalue Answer Routing Policy$q$, $q$Failover Routing Policy (Primary and Secondary records linked to Health Checks)$q$, $q$Geolocation Routing Policy$q$, $q$Weighted Routing Policy with 50/50 split$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Route 53 Failover Routing Policy configures Active-Passive failover, routing traffic to the primary resource when healthy and automatically diverting to the secondary resource when the primary health check fails.$q$
),
(
  'q-saa-98', 'aws-saa-c03', 'Medium', 'single',
  $q$A hybrid cloud architecture requires encrypted connectivity over the public internet between an on-premises data center router and an Amazon VPC. The network configuration requires dual IPsec VPN tunnels with dynamic BGP routing for redundancy. Which AWS component terminates the VPN on the AWS side?$q$,
  $q$Internet Gateway (IGW)$q$, $q$Virtual Private Gateway (VGW) attached to the VPC$q$, $q$Egress-Only Internet Gateway$q$, $q$NAT Gateway$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Site-to-Site VPN creates encrypted IPsec VPN tunnels between an on-premises Customer Gateway (CGW) and an AWS Virtual Private Gateway (VGW) or Transit Gateway.$q$
),
(
  'q-saa-99', 'aws-saa-c03', 'Hard', 'single',
  $q$A company relies on a 1 Gbps AWS Direct Connect connection for hybrid connectivity. To ensure business continuity during an unexpected Direct Connect outage, the company needs a backup network connection that automatically takes over traffic if Direct Connect fails. What is the most resilient, cost-effective backup option?$q$,
  $q$Order a second Direct Connect location with 10 Gbps capacity.$q$, $q$Establish an AWS Site-to-Site VPN over the public internet as a failover path, configuring BGP routing with lower AS Path priority on the VPN.$q$, $q$Deploy a VPC Gateway Endpoint for S3.$q$, $q$Use AWS DataSync over HTTPS.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Site-to-Site VPN provides a cost-effective backup for AWS Direct Connect. Configuring BGP dynamic routing ensures automatic failover over the VPN tunnel if Direct Connect fails.$q$
),
(
  'q-saa-100', 'aws-saa-c03', 'Hard', 'single',
  $q$A serverless workflow built with AWS Step Functions invokes an external third-party HTTP API. The third-party API intermittently returns HTTP 503 Service Unavailable errors due to throttling. How can the Step Functions state machine handle transient failures gracefully without aborting the execution?$q$,
  $q$Add a `Retry` block in the Task state definition specifying `ErrorEquals: ["States.ALL"]`, backoff rate, and maximum retries.$q$, $q$Increase the Lambda timeout to 15 minutes.$q$, $q$Use an S3 Gateway Endpoint.$q$, $q$Re-deploy the state machine in multiple AWS Regions.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$AWS Step Functions state machines support built-in `Retry` and `Catch` error handling fields in Task states, enabling automated exponential backoff retries when transient errors occur.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 5A: q-saa-101 to q-saa-105
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-101', 'aws-saa-c03', 'Medium', 'single',
  $q$A database administrator needs to prevent users from accidentally deleting a production Amazon RDS DB instance via the AWS Management Console, AWS CLI, or API. Which RDS safety feature enforces this protection?$q$,
  $q$Enable RDS Deletion Protection on the DB instance.$q$, $q$Enable S3 Versioning on the underlying storage.$q$, $q$Deploy an RDS Multi-AZ standby instance.$q$, $q$Attach an EC2 Auto Scaling Termination Policy.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$RDS Deletion Protection prevents an RDS DB instance from being deleted by any user via the Console, CLI, or API. To delete an instance with Deletion Protection enabled, the protection setting must first be explicitly disabled.$q$
),
(
  'q-saa-102', 'aws-saa-c03', 'Medium', 'single',
  $q$A container application runs on Amazon ECS with AWS Fargate. The application requires high availability across 3 Availability Zones. If a Fargate task crashes or fails its container health check, ECS must automatically launch a replacement task in a healthy AZ. Which ECS deployment construct manages task count and availability?$q$,
  $q$Amazon ECS Task Definition$q$, $q$Amazon ECS Service with desired task count and multi-AZ subnet configuration$q$, $q$AWS Elastic Beanstalk Worker Environment$q$, $q$EC2 Auto Scaling Launch Template$q$, NULL, NULL,
  1, ARRAY[1],
  $q$An Amazon ECS Service maintains the specified number of running instances of a task definition across multiple Availability Zones, automatically replacing failed tasks.$q$
),
(
  'q-saa-103', 'aws-saa-c03', 'Hard', 'single',
  $q$A Kubernetes cluster on Amazon EKS runs worker nodes across multiple Availability Zones using EC2 Auto Scaling groups. During peak traffic, pods enter a Pending state due to insufficient CPU and memory capacity across existing nodes. Which component automatically scales out the underlying EC2 Auto Scaling groups to add worker nodes for pending pods?$q$,
  $q$EC2 Target Tracking Scaling Policy on CPU utilization alone$q$, $q$Kubernetes Cluster Autoscaler$q$, $q$AWS Application Auto Scaling on Fargate$q$, $q$Amazon Route 53 Traffic Flow$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Kubernetes Cluster Autoscaler monitors the EKS cluster for pods that cannot be scheduled due to resource constraints (Pending state) and automatically adjusts the desired capacity of the corresponding AWS EC2 Auto Scaling groups to launch additional worker nodes.$q$
),
(
  'q-saa-104', 'aws-saa-c03', 'Hard', 'single',
  $q$A Windows-based enterprise application requires shared file storage accessible via the SMB protocol. The file system must integrate with self-managed Active Directory, support Multi-AZ high availability with automatic failover, and support Shadow Copies for file restoration. Which storage service should be selected?$q$,
  $q$Amazon EFS$q$, $q$Amazon FSx for Windows File Server (Multi-AZ)$q$, $q$Amazon S3 Glacier$q$, $q$Amazon EBS gp3 Volume in Multi-Attach mode$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon FSx for Windows File Server provides fully managed native SMB file storage built on Windows Server, supporting Multi-AZ deployments, Active Directory integration, and Windows Shadow Copies.$q$
),
(
  'q-saa-105', 'aws-saa-c03', 'Hard', 'single',
  $q$A SaaS application serves global users over TCP. The backend is deployed in `us-east-1` and `eu-west-1`. To improve TCP handshake performance and provide static IP addresses, the application uses AWS Global Accelerator. How does Global Accelerator handle a regional outage?$q$,
  $q$It updates public DNS records in 60 seconds.$q$, $q$Anycast IP addresses automatically route user traffic over the AWS global network to the nearest healthy application endpoint within seconds.$q$, $q$It triggers S3 Cross-Region Replication.$q$, $q$It provisions a new Direct Connect link.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$AWS Global Accelerator uses static Anycast IP addresses to entry points on the AWS global edge network. It continuously monitors endpoint health and instantly reroutes traffic to healthy regional endpoints upon failure.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 5B: q-saa-106 to q-saa-110
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-106', 'aws-saa-c03', 'Medium', 'single',
  $q$An Aurora MySQL database cluster experiences heavy read traffic during business hours. The database team wants read replicas to scale out automatically when read throughput increases, adding up to 15 Aurora Replicas. Which feature handles automatic replica scaling?$q$,
  $q$Aurora Auto Scaling$q$, $q$RDS Multi-AZ Failover$q$, $q$DynamoDB On-Demand$q$, $q$EC2 Auto Scaling Scheduled Actions$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Aurora Auto Scaling automatically adjusts the number of Aurora Replicas provisioned in an Aurora DB cluster in response to changes in connectivity or workload metrics (such as CPU utilization or average connections).$q$
),
(
  'q-saa-107', 'aws-saa-c03', 'Medium', 'single',
  $q$An SQS worker process takes 5 minutes to process a complex video rendering task from a queue. However, after 30 seconds of processing, another worker instance receives the exact same message and starts duplicate processing. How can duplicate processing be prevented?$q$,
  $q$Increase the SQS queue Visibility Timeout to 6 minutes (greater than the worker processing time).$q$, $q$Decrease the SQS Message Retention Period to 30 seconds.$q$, $q$Enable Dead-Letter Queue redrive policy.$q$, $q$Use SQS Long Polling set to 20 seconds.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$The SQS Visibility Timeout is the window during which SQS prevents other consumers from receiving and processing a message. If task processing takes 5 minutes, setting Visibility Timeout to 6 minutes prevents duplicate worker delivery.$q$
),
(
  'q-saa-108', 'aws-saa-c03', 'Hard', 'single',
  $q$A media company serves static web assets via Amazon CloudFront from an S3 bucket origin in `us-east-1`. In the event of a regional S3 outage in `us-east-1`, CloudFront must seamlessly fail over to a backup S3 origin bucket in `us-west-2` without returning HTTP 5xx errors to users. How is this origin redundancy configured?$q$,
  $q$Create a CloudFront Origin Group containing a primary S3 origin and a secondary S3 origin configured to fail over on HTTP 500, 502, 503, and 504 status codes.$q$, $q$Use Route 53 Geolocation Routing.$q$, $q$Attach an Elastic IP to the S3 bucket.$q$, $q$Enable S3 Transfer Acceleration.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$CloudFront Origin Groups allow specifying primary and secondary origins. If the primary origin returns specific HTTP error responses or fails health checks, CloudFront automatically routes requests to the secondary origin.$q$
),
(
  'q-saa-109', 'aws-saa-c03', 'Medium', 'single',
  $q$An Auto Scaling group launches EC2 instances behind an Application Load Balancer. An EC2 instance experiences an internal web application crash, causing the ALB target group health check to return `Unhealthy`. However, the underlying EC2 hypervisor remains healthy. By default, Auto Scaling only monitors EC2 status. How can Auto Scaling be configured to terminate and replace instances when ALB health checks fail?$q$,
  $q$Change the Auto Scaling group Health Check Type from `EC2` to `ELB`.$q$, $q$Enable S3 Glacier Vault Lock.$q$, $q$Deploy AWS Systems Manager Session Manager.$q$, $q$Increase the ALB Idle Timeout.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$By default, Auto Scaling groups use `EC2` health checks (checking instance status). Changing the Health Check Type to `ELB` instructs Auto Scaling to consider an instance unhealthy if either EC2 or ELB health checks report failure.$q$
),
(
  'q-saa-110', 'aws-saa-c03', 'Hard', 'single',
  $q$A real-time telemetry pipeline ingests streaming IoT data into an Amazon Kinesis Data Stream. Five separate microservice consumers poll the stream simultaneously. Consumers experience read throttling because total read throughput exceeds 2 MB/sec per shard. Which Kinesis feature provides dedicated 2 MB/sec read throughput PER CONSUMER?$q$,
  $q$Kinesis Data Streams Enhanced Fan-Out with HTTP/2 streaming$q$, $q$Kinesis Data Firehose Buffer Hints$q$, $q$SQS FIFO Message Grouping$q$, $q$DynamoDB Accelerator (DAX)$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Kinesis Data Streams Enhanced Fan-Out allows developers to register stream consumers to receive dedicated read throughput of up to 2 MB/sec per shard, pushing data to consumers via HTTP/2 without competing with other readers.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 5C: q-saa-111 to q-saa-115
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-111', 'aws-saa-c03', 'Hard', 'single',
  $q$A company needs to migrate 50 physical and virtual Linux servers from an on-premises data center to EC2 with minimal downtime. The migration tool must continuously replicate block-level disk storage over the internet or Direct Connect and orchestrate non-disruptive cutover testing. Which AWS migration service should be used?$q$,
  $q$AWS Application Migration Service (AWS MGN)$q$, $q$AWS DataSync$q$, $q$AWS Database Migration Service (AWS DMS)$q$, $q$AWS Snowball Edge$q$, NULL, NULL,
  0, ARRAY[0],
  $q$AWS Application Migration Service (AWS MGN) is the primary AWS service for lift-and-shift server migration, providing continuous block-level replication of physical, virtual, or cloud servers into AWS with minimal downtime.$q$
),
(
  'q-saa-112', 'aws-saa-c03', 'Hard', 'single',
  $q$A Machine Learning training job running on EC2 compute clusters requires parallel, sub-millisecond access to hundreds of terabytes of dataset files stored in Amazon S3. The dataset must be presented as a high-performance POSIX file system capable of hundreds of gigabytes per second throughput. Which FSx file system integrates seamlessly with S3 origins for HPC/ML workloads?$q$,
  $q$Amazon FSx for Windows File Server$q$, $q$Amazon FSx for Lustre$q$, $q$Amazon FSx for NetApp ONTAP$q$, $q$Amazon FSx for OpenZFS$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon FSx for Lustre is built for high-performance computing (HPC), machine learning, and media processing. It links directly to S3 buckets, presenting S3 objects as local files with sub-millisecond latencies and high throughput.$q$
),
(
  'q-saa-113', 'aws-saa-c03', 'Hard', 'single',
  $q$A high-performance computing (HPC) simulation requires ultra-low latency network communication between 50 EC2 instances located in the same Availability Zone. The application uses Message Passing Interface (MPI) protocols. Which placement group strategy and network adapter configuration delivers maximum inter-node networking performance?$q$,
  $q$Spread Placement Group with standard Elastic Network Interfaces (ENIs).$q$, $q$Cluster Placement Group with Elastic Fabric Adapter (EFA) enabled on supporting EC2 instances.$q$, $q$Partition Placement Group with NAT Gateways.$q$, $q$Auto Scaling Group across multiple Availability Zones.$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Cluster Placement Groups pack instances close together inside a single AZ for low-latency network performance, while Elastic Fabric Adapter (EFA) provides OS-bypass hardware acceleration for HPC and MPI workloads.$q$
),
(
  'q-saa-114', 'aws-saa-c03', 'Medium', 'single',
  $q$A data analyst needs to run ad-hoc SQL queries on 10 TB of unorganized JSON log files stored in Amazon S3. To optimize query performance and reduce data scanned (lowering query cost), how should the data be converted and structured before querying with Amazon Athena?$q$,
  $q$Convert JSON files into Apache Parquet or ORC columnar format, and partition data in S3 by date (`year/month/day`).$q$, $q$Keep JSON files intact and increase Athena concurrency limits.$q$, $q$Import data into an EC2 MySQL database.$q$, $q$Store JSON data in DynamoDB Standard-IA tables.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Converting files to columnar formats (Parquet/ORC) and partitioning data by date allows Athena to scan only relevant columns and partitions, significantly speeding up queries and reducing scan costs.$q$
),
(
  'q-saa-115', 'aws-saa-c03', 'Medium', 'single',
  $q$A clickstream analytics application ingests streaming web event logs. The system must transform incoming JSON records in near real-time using an AWS Lambda function and continuously deliver compressed Apache Parquet files directly into an S3 analytics bucket. Which serverless streaming delivery service manages this pipeline?$q$,
  $q$Amazon SQS FIFO$q$, $q$Amazon Kinesis Data Firehose$q$, $q$AWS DataSync$q$, $q$Amazon Managed Streaming for Apache Kafka (MSK)$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon Kinesis Data Firehose is a fully managed service that streams real-time data into S3, Redshift, or OpenSearch. It supports inline data transformation via Lambda and automatic format conversion to Parquet/ORC.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 5D: q-saa-116 to q-saa-120
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-116', 'aws-saa-c03', 'Hard', 'single',
  $q$A serverless backend uses hundreds of concurrent AWS Lambda functions connecting to an Amazon RDS MySQL database. During traffic surges, database connection limits are exceeded because Lambda opens new DB connections on every cold start. What solution manages connection pooling without changing application logic?$q$,
  $q$Deploy Amazon RDS Proxy between Lambda and the RDS DB instance.$q$, $q$Increase RDS MAX_CONNECTIONS parameter to 1,000,000.$q$, $q$Replace RDS with DynamoDB Global Tables.$q$, $q$Use S3 Transfer Acceleration.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Amazon RDS Proxy is a fully managed database proxy that pools and shares relational database connections, protecting databases from exhaustion caused by high-concurrency serverless applications.$q$
),
(
  'q-saa-117', 'aws-saa-c03', 'Medium', 'single',
  $q$A security operations team requires full-text search indexing and real-time visualization of application access logs. The logs are indexed rapidly for search queries using Kibana dashboards. Which AWS service provides managed full-text search and log analytics?$q$,
  $q$Amazon Redshift$q$, $q$Amazon OpenSearch Service$q$, $q$Amazon Athena$q$, $q$Amazon QuickSight$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon OpenSearch Service offers managed search and analytics engines for log analytics, full-text search, and real-time application monitoring integrated with OpenSearch Dashboards (Kibana).$q$
),
(
  'q-saa-118', 'aws-saa-c03', 'Medium', 'single',
  $q$A data engineering team needs an automated tool to discover schema structures from CSV, JSON, and Parquet files arriving in S3, updating a central metadata catalog used by Athena and EMR. Which service crawls data stores to build metadata catalogs?$q$,
  $q$AWS Glue Crawler$q$, $q$AWS DataSync Task$q$, $q$Amazon Kinesis Data Streams Agent$q$, $q$AWS Step Functions State Machine$q$, NULL, NULL,
  0, ARRAY[0],
  $q$AWS Glue Crawlers connect to source data stores (such as S3), determine schema definitions, and populate the AWS Glue Data Catalog with metadata table definitions.$q$
),
(
  'q-saa-119', 'aws-saa-c03', 'Hard', 'single',
  $q$A global web application needs to execute lightweight HTTP request header rewrites and URL redirects at CloudFront edge locations with sub-millisecond execution times and millions of requests per second. Which edge compute option offers the lowest execution latency and lowest cost for simple header manipulations?$q$,
  $q$Lambda@Edge (Node.js/Python)$q$, $q$CloudFront Functions (JavaScript)$q$, $q$AWS Lambda in a private VPC subnet$q$, $q$EC2 Micro instances$q$, NULL, NULL,
  1, ARRAY[1],
  $q$CloudFront Functions is a native edge compute feature built for high-scale, lightweight JavaScript operations (such as header rewrites, URL redirects, and request validation) with sub-millisecond latency at a fraction of Lambda@Edge cost.$q$
),
(
  'q-saa-120', 'aws-saa-c03', 'Hard', 'single',
  $q$An enterprise migrates an Apache Kafka messaging cluster to AWS. The application requires managed Apache Kafka control planes with compatibility for existing Kafka client APIs, custom topic partitions, and low-latency message streaming. Which service should be chosen?$q$,
  $q$Amazon Managed Streaming for Apache Kafka (Amazon MSK)$q$, $q$Amazon SQS FIFO$q$, $q$Amazon SNS$q$, $q$Amazon Kinesis Data Streams$q$, NULL, NULL,
  0, ARRAY[0],
  $q$Amazon MSK is a fully managed service that simplifies running applications built on Apache Kafka without requiring changes to existing open-source Kafka application code or client libraries.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 5E: q-saa-121 to q-saa-125
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-121', 'aws-saa-c03', 'Medium', 'single',
  $q$An application uploads 50 GB video files to Amazon S3 over an unstable network connection. Uploads frequently fail halfway through, requiring the application to restart the entire 50 GB transfer. How can upload performance and resiliency be optimized?$q$,
  $q$Use S3 Multipart Upload API to split the file into smaller parts uploaded in parallel with automatic retry of failed parts.$q$, $q$Increase EC2 instance RAM size.$q$, $q$Enable S3 Bucket Versioning.$q$, $q$Use EFS File Sync over VPN.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$S3 Multipart Upload allows uploading large objects (required for files > 5 GB, recommended for files > 100 MB) as a set of parts in parallel, improving throughput and allowing quick recovery from network failures by re-transmitting failed parts.$q$
),
(
  'q-saa-122', 'aws-saa-c03', 'Hard', 'single',
  $q$A high-throughput application writes sensor metrics to a DynamoDB table. The table uses `Status` (with values `Active` or `Inactive`) as the Partition Key. During peak load, the table experiences severe write throttling despite having unallocated write capacity. What is the root cause and recommended solution?$q$,
  $q$Hot partition issue caused by low cardinality Partition Key (`Status`). Change the Partition Key to a high cardinality attribute such as `SensorID_Timestamp`.$q$, $q$DynamoDB table size exceeds 10 GB. Move data to S3 Glacier.$q$, $q$DynamoDB Read Capacity Units are depleted.$q$, $q$DynamoDB TTL is deleting items during write operations.$q$, NULL, NULL,
  0, ARRAY[0],
  $q$DynamoDB partitions data based on Partition Key values. Using a low cardinality key (like `Status`) directs all requests to a small subset of partitions ("hot partition"), causing throttling. High cardinality keys distribute traffic evenly.$q$
),
(
  'q-saa-123', 'aws-saa-c03', 'Medium', 'single',
  $q$A web development team needs an in-memory caching layer for a high-traffic site. The cache must support multi-threaded performance, simple key-value string caching, and horizontal scale-out by adding or removing nodes. Data persistence is not required. Which ElastiCache engine fits best?$q$,
  $q$Amazon ElastiCache for Redis$q$, $q$Amazon ElastiCache for Memcached$q$, $q$Amazon MemoryDB for Redis$q$, $q$Amazon DynamoDB DAX$q$, NULL, NULL,
  1, ARRAY[1],
  $q$ElastiCache for Memcached is a multi-threaded, purely in-memory key-value cache engine designed for simple caching models where persistence, replication, and complex data structures (supported by Redis) are not needed.$q$
),
(
  'q-saa-124', 'aws-saa-c03', 'Hard', 'single',
  $q$A business intelligence team runs complex analytical queries on data stored in an AWS data lake. Analytics queries run intermittently throughout the week without predictable schedules. The team wants to avoid paying for idle database cluster infrastructure when queries are not running. Which Redshift deployment option automates compute scaling and pauses billing when idle?$q$,
  $q$Amazon Redshift Provisioned RA3 Clusters$q$, $q$Amazon Redshift Serverless$q$, $q$Amazon Redshift Spectrum on EC2 On-Demand$q$, $q$Amazon Athena Federated Queries$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon Redshift Serverless automatically provisions and scales data warehouse capacity in Redshift Processing Units (RPUs) based on query demand, automatically shutting down and stopping charges when idle.$q$
),
(
  'q-saa-125', 'aws-saa-c03', 'Hard', 'single',
  $q$A multinational mobile app uploads user telemetry files directly to S3 buckets located in AWS Regions nearest to the user. To simplify application code, the mobile app needs a single global S3 endpoint hostname that automatically routes upload traffic over the AWS global network to the bucket with the lowest latency. Which S3 feature provides this capability?$q$,
  $q$S3 Cross-Region Replication (CRR)$q$, $q$Amazon S3 Multi-Region Access Points (MRAP)$q$, $q$S3 Transfer Acceleration$q$, $q$Amazon Route 53 Latency Alias$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Amazon S3 Multi-Region Access Points (MRAP) provide a single global endpoint hostname that uses AWS Global Accelerator to route client requests to the nearest S3 bucket over the high-speed AWS network.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 6A: q-saa-126 to q-saa-130
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-126', 'aws-saa-c03', 'Hard', 'single',
  $q$An engineering team runs weather forecasting simulation software across a cluster of EC2 instances. The nodes require inter-node communication bypassing the OS kernel (OS bypass) to achieve ultra-low latency and high message rates. What specialized network adapter must be attached to the EC2 instances?$q$,
  $q$Elastic Network Adapter (ENA)$q$, $q$Elastic Fabric Adapter (EFA)$q$, $q$Elastic IP Address$q$, $q$AWS Direct Connect Virtual Interface$q$, NULL, NULL,
  1, ARRAY[1],
  $q$Elastic Fabric Adapter (EFA) is a specialized network interface for EC2 instances that provides OS bypass capability, enabling HPC applications (such as MPI simulations) to achieve low latency inter-node communication.$q$
),
(
  'q-saa-127', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A media archive contains 1 PB of historical video files stored in S3 Standard. The files are rarely accessed (less than once a year), but when requested, a retrieval time of 12 hours is acceptable. The company wants to minimize ongoing monthly storage costs. Which TWO actions achieve maximum cost optimization? (Select TWO.)$q$,
  $q$Configure an S3 Lifecycle rule to transition objects to S3 Glacier Deep Archive after 30 days.$q$, $q$Configure an S3 Lifecycle rule to delete noncurrent object versions and expire incomplete multipart uploads.$q$, $q$Move files to EBS gp3 volumes in Multi-Attach mode.$q$, $q$Enable S3 Transfer Acceleration on the origin bucket.$q$, $q$Deploy CloudFront in front of the bucket with 1-year TTL.$q$, NULL,
  0, ARRAY[0, 1],
  $q$S3 Glacier Deep Archive offers the lowest-cost S3 storage tier for 12-hour retrieval windows. Aborting incomplete multipart uploads and expiring noncurrent versions eliminates hidden S3 storage charges.$q$
),
(
  'q-saa-128', 'aws-saa-c03', 'Hard', 'multiple',
  $q$An engineering manager runs stateless batch rendering workloads on EC2 Auto Scaling groups. The workload can tolerate instance terminations. The manager wants to minimize compute costs while reducing the risk of Spot capacity unavailability. Which TWO Spot configuration options should be combined? (Select TWO.)$q$,
  $q$Use the `price-capacity-optimized` Spot Allocation Strategy in the Auto Scaling group.$q$, $q$Configure the Auto Scaling group to use multiple EC2 instance types and families (Attribute-Based Instance Type Selection).$q$, $q$Use 3-Year Dedicated Host Reservations.$q$, $q$Set all instances to On-Demand with static IP addresses.$q$, $q$Enable EC2 Termination Protection on Spot nodes.$q$, NULL,
  0, ARRAY[0, 1],
  $q$The `price-capacity-optimized` strategy selects Spot instances from pools with optimal capacity availability and lowest price. Diversifying across multiple instance types ensures high Spot availability.$q$
),
(
  'q-saa-129', 'aws-saa-c03', 'Medium', 'multiple',
  $q$A Finance team needs to prevent unexpected AWS cloud cost overruns. The team wants to set custom cost thresholds that trigger email alerts when monthly forecast spend exceeds $50,000, and automatically identify anomalous cost spikes across services. Which TWO AWS Cost Management tools should be configured? (Select TWO.)$q$,
  $q$AWS Budgets (with Forecasted Cost Alerts)$q$, $q$AWS Cost Anomaly Detection$q$, $q$AWS Trusted Advisor Performance Checks$q$, $q$AWS Config Compliance Packs$q$, $q$AWS Compute Optimizer$q$, NULL,
  0, ARRAY[0, 1],
  $q$AWS Budgets allows setting custom spend limits and sending alerts when actual or forecasted costs exceed thresholds. AWS Cost Anomaly Detection uses machine learning to continuously monitor spend and detect unexpected cost spikes.$q$
),
(
  'q-saa-130', 'aws-saa-c03', 'Medium', 'multiple',
  $q$A Cloud Financial Operations (FinOps) team wants to audit an existing AWS infrastructure footprint to identify over-provisioned EC2 instances, unattached Elastic IP addresses, and idle EBS volumes. Which TWO services/features provide actionable resource rightsizing and cost optimization recommendations? (Select TWO.)$q$,
  $q$AWS Compute Optimizer$q$, $q$AWS Trusted Advisor (Cost Optimization Pillar)$q$, $q$AWS GuardDuty$q$, $q$AWS CloudTrail Insights$q$, $q$AWS Systems Manager Patch Manager$q$, NULL,
  0, ARRAY[0, 1],
  $q$AWS Compute Optimizer analyzes historical CloudWatch metrics to recommend optimal EC2 instance types, EBS volumes, and Lambda memory sizes. AWS Trusted Advisor identifies idle resources such as unattached EIPs and idle EBS volumes.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 6B: q-saa-131 to q-saa-135
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-131', 'aws-saa-c03', 'Medium', 'multiple',
  $q$A company operates hundreds of EC2 instances in private subnets that transfer petabytes of data monthly to Amazon S3 and Amazon DynamoDB. The current network path routes through NAT Gateways, generating tens of thousands of dollars in NAT data processing charges. Which TWO actions eliminate NAT Gateway data processing charges for S3 and DynamoDB? (Select TWO.)$q$,
  $q$Create a free VPC Gateway Endpoint for Amazon S3 and update private subnet route tables.$q$, $q$Create a free VPC Gateway Endpoint for Amazon DynamoDB and update private subnet route tables.$q$, $q$Replace NAT Gateways with Egress-Only Internet Gateways.$q$, $q$Use AWS Direct Connect Public Virtual Interfaces.$q$, $q$Enable S3 Transfer Acceleration.$q$, NULL,
  0, ARRAY[0, 1],
  $q$VPC Gateway Endpoints for S3 and DynamoDB are provided free of charge by AWS and route traffic directly within the AWS network, bypassing NAT Gateways and completely eliminating NAT data processing fees for those services.$q$
),
(
  'q-saa-132', 'aws-saa-c03', 'Medium', 'multiple',
  $q$A database administrator manages multiple Amazon RDS MySQL DB instances attached to General Purpose SSD (gp2) EBS storage volumes. Storage volume sizes were over-provisioned purely to obtain higher baseline IOPS. Which TWO modifications reduce storage costs while maintaining or improving IOPS performance? (Select TWO.)$q$,
  $q$Migrate EBS volumes from `gp2` to `gp3` to provision IOPS independently of storage capacity at lower per-GB cost.$q$, $q$Enable RDS Storage Auto Scaling to start with smaller initial storage volumes and automatically scale storage as data grows.$q$, $q$Move database files to S3 Glacier Deep Archive.$q$, $q$Switch DB instances to Dedicated Hosts.$q$, $q$Convert RDS MySQL to Single-AZ manual backup mode.$q$, NULL,
  0, ARRAY[0, 1],
  $q$EBS gp3 volumes cost less per GB than gp2 and allow provisioning IOPS independently without over-provisioning storage volume size. RDS Storage Auto Scaling avoids initial over-provisioning by growing capacity dynamically.$q$
),
(
  'q-saa-133', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A company notices high monthly S3 storage bills caused by incomplete multipart file uploads and noncurrent object versions created by enabled bucket versioning. Which TWO S3 Lifecycle configurations automate the cleanup of these hidden storage costs? (Select TWO.)$q$,
  $q$Add an S3 Lifecycle rule to expire incomplete multipart uploads after 7 days.$q$, $q$Add an S3 Lifecycle rule to transition or permanently delete noncurrent object versions after 30 days.$q$, $q$Disable S3 Versioning on all buckets permanently.$q$, $q$Use S3 Transfer Acceleration on all uploads.$q$, $q$Enable MFA Delete on noncurrent versions.$q$, NULL,
  0, ARRAY[0, 1],
  $q$Incomplete multipart upload parts remain stored in S3 and billed until explicitly aborted. S3 Lifecycle rules can automatically abort incomplete uploads and clean up old noncurrent object versions, reducing storage costs.$q$
),
(
  'q-saa-134', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A company runs containerized batch workloads on Amazon ECS. Some tasks require high CPU/RAM for short durations, while others run continuously 24/7. Which TWO purchasing strategies optimize compute costs across this container infrastructure? (Select TWO.)$q$,
  $q$Use Fargate Spot for fault-tolerant, interruptible batch container tasks to save up to 70%.$q$, $q$Purchase Compute Savings Plans for baseline 24/7 continuous container workloads to save up to 66%.$q$, $q$Use On-Demand EC2 Dedicated Hosts for all batch tasks.$q$, $q$Enable S3 Transfer Acceleration on ECS containers.$q$, $q$Purchase 3-Year SQS Reserved Capacity.$q$, NULL,
  0, ARRAY[0, 1],
  $q$Fargate Spot provides up to 70% discount for interruptible container tasks. Compute Savings Plans apply a discount of up to 66% on steady-state 24/7 Fargate and EC2 compute usage.$q$
),
(
  'q-saa-135', 'aws-saa-c03', 'Easy', 'multiple',
  $q$A conglomerate operates 20 AWS accounts across different business units. The CFO wants to consolidate billing into a single invoice, combine usage across all accounts to qualify for tiered volume pricing discounts (such as S3 storage and data transfer), and centrally enforce governance policies. Which TWO features of AWS Organizations fulfill these requirements? (Select TWO.)$q$,
  $q$Consolidated Billing in AWS Organizations to aggregate usage across member accounts for volume pricing discounts and a single invoice.$q$, $q$Service Control Policies (SCPs) to enforce central permission guardrails across organizational units.$q$, $q$AWS Resource Access Manager (RAM) Subnet Sharing.$q$, $q$AWS Cost Anomaly Detection.$q$, $q$AWS Trusted Advisor Security Checks.$q$, NULL,
  0, ARRAY[0, 1],
  $q$Consolidated Billing in AWS Organizations combines usage across all member accounts into a single bill, enabling the organization to reach higher volume discount tiers for S3 storage and data transfer. Service Control Policies (SCPs) specify central permission guardrails across organizational units.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 6C: q-saa-136 to q-saa-140
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-136', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A security architect is designing a multi-account AWS environment for an enterprise using AWS Organizations. Security policy mandates enforcing central guardrails that prevent member account administrators from disabling AWS CloudTrail or modifying security controls, while aggregating all CloudTrail logs into a central S3 bucket in a dedicated Log Archive account. Which TWO solutions fulfill this architecture? (Select TWO.)$q$,
  $q$Attach a Service Control Policy (SCP) to the organization root denying `cloudtrail:StopLogging` and `cloudtrail:DeleteTrail` actions.$q$, $q$Create an AWS Organizations Trail in the management account that delivers API log events across all accounts to a centralized S3 bucket in the Log Archive account.$q$, $q$Configure IAM Users in member accounts with full AdministratorAccess.$q$, $q$Deploy VPC Peering between member accounts and the Log Archive account.$q$, $q$Use AWS Direct Connect Public Virtual Interfaces.$q$, NULL,
  0, ARRAY[0, 1],
  $q$Service Control Policies (SCPs) restrict API actions (preventing CloudTrail tampering) across member accounts, while Organization Trails centralize multi-account audit logging into a single S3 bucket.$q$
),
(
  'q-saa-137', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A financial institution requires a resilient hybrid connection between its corporate data center and an AWS VPC. The primary connection must provide dedicated 10 Gbps low-latency connectivity over a private link. If the primary physical connection fails, traffic must automatically fail over to an encrypted backup tunnel over the public internet. Which TWO networking components fulfill this design? (Select TWO.)$q$,
  $q$AWS Direct Connect Dedicated Connection with a Private Virtual Interface (Private VIF) as the primary link.$q$, $q$AWS Site-to-Site VPN with IPsec encryption and BGP dynamic routing as the backup link.$q$, $q$VPC Gateway Endpoint for Amazon S3.$q$, $q$AWS Global Accelerator Anycast IP addresses.$q$, $q$AWS Storage Gateway Volume Gateway.$q$, NULL,
  0, ARRAY[0, 1],
  $q$AWS Direct Connect Dedicated Connection with a Private VIF provides a private, low-latency primary connection to a VPC. An AWS Site-to-Site VPN with dynamic BGP routing establishes an automated, encrypted failover path over the public internet if Direct Connect fails.$q$
),
(
  'q-saa-138', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A health provider must store regulatory compliance records in Amazon S3. Regulations mandate that objects must be protected against accidental deletion or overwrite, and object versions must be preserved. Furthermore, a strict WORM (Write Once Read Many) policy must prevent object deletion by any IAM user or AWS account root user for 7 years. Which TWO S3 features fulfill these compliance requirements? (Select TWO.)$q$,
  $q$Enable S3 Versioning on the S3 bucket.$q$, $q$Configure S3 Object Lock in Compliance Mode with a 7-year retention period.$q$, $q$Enable S3 Transfer Acceleration.$q$, $q$Attach a Lifecycle rule to move objects to S3 Standard-IA.$q$, $q$Configure CORS rules on the bucket.$q$, NULL,
  0, ARRAY[0, 1],
  $q$S3 Versioning preserves past object versions upon modification or deletion. S3 Object Lock in Compliance Mode enforces WORM compliance, preventing object deletion by anyone (including root) until the retention period expires.$q$
),
(
  'q-saa-139', 'aws-saa-c03', 'Medium', 'multiple',
  $q$A startup is building a serverless REST API that expects variable traffic with zero traffic at night. The solution must incur zero infrastructure cost when idle, scale automatically to thousands of requests per second, and persist JSON user profiles with low-latency reads and writes. Which TWO AWS serverless services should be chosen? (Select TWO.)$q$,
  $q$Amazon API Gateway (HTTP APIs)$q$, $q$Amazon DynamoDB with On-Demand Capacity Mode$q$, $q$Amazon EC2 Reserved Instances$q$, $q$Amazon RDS Multi-AZ PostgreSQL$q$, $q$Amazon EFS File System$q$, NULL,
  0, ARRAY[0, 1],
  $q$API Gateway HTTP APIs provide lightweight, low-cost serverless API endpoints that charge per request. DynamoDB On-Demand Mode scales dynamically for variable workloads with zero idle cost.$q$
),
(
  'q-saa-140', 'aws-saa-c03', 'Hard', 'multiple',
  $q$An enterprise application running on Amazon Aurora MySQL requires cross-Region disaster recovery across two AWS Regions (us-east-1 and eu-west-1). In the event of a regional disaster in us-east-1, the system must support fast cross-Region storage replication (typically under 1 second lag) and allow promoting the secondary Region cluster to full read/write workloads with an RTO of under 1 minute. Which TWO steps configure this solution? (Select TWO.)$q$,
  $q$Deploy an Amazon Aurora Global Database spanning us-east-1 (Primary) and eu-west-1 (Secondary).$q$, $q$In the event of a regional outage in us-east-1, initiate a managed failover to promote the secondary DB cluster in eu-west-1 to take primary read/write workloads.$q$, $q$Perform daily S3 Cross-Region Replication of RDS database snapshots.$q$, $q$Deploy AWS DataSync between Aurora DB clusters.$q$, $q$Use AWS Snowball Edge to transfer database transaction logs.$q$, NULL,
  0, ARRAY[0, 1],
  $q$Aurora Global Database uses dedicated storage-level replication to replicate data across Regions with typical latency under 1 second. Promoting a secondary Region cluster during an unplanned regional outage takes under 1 minute (RTO < 1 min), providing rapid disaster recovery.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 6D: q-saa-141 to q-saa-145
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-141', 'aws-saa-c03', 'Hard', 'multiple',
  $q$An enterprise cloud architecture requires a fully managed shared file system for enterprise Linux and Windows workloads. The file system must support NetApp ONTAP features (such as inline deduplication, compression, and snap-shots) and connect privately to on-premises data centers via Direct Connect. Which TWO storage components fulfill this requirement? (Select TWO.)$q$,
  $q$Amazon FSx for NetApp ONTAP$q$, $q$AWS Direct Connect connected to private subnets$q$, $q$Amazon S3 Standard Bucket$q$, $q$Amazon EBS gp3 Volume in Single-AZ$q$, $q$AWS Storage Gateway Volume Gateway$q$, NULL,
  0, ARRAY[0, 1],
  $q$Amazon FSx for NetApp ONTAP provides fully managed NetApp ONTAP file storage supporting NFS, SMB, and iSCSI protocols with deduplication and compression. Direct Connect provides private enterprise connectivity.$q$
),
(
  'q-saa-142', 'aws-saa-c03', 'Medium', 'multiple',
  $q$A containerized microservices application runs on Amazon ECS. The team wants to eliminate server management while achieving high availability across 3 Availability Zones behind an Application Load Balancer. Which TWO configurations meet these operational goals? (Select TWO.)$q$,
  $q$Launch ECS tasks using the AWS Fargate serverless launch type.$q$, $q$Deploy an ECS Service configured with a desired task count distributed across subnets in 3 Availability Zones.$q$, $q$Host containers on single-AZ EC2 instances.$q$, $q$Use AWS Storage Gateway for container storage.$q$, $q$Enable S3 Transfer Acceleration on ECS tasks.$q$, NULL,
  0, ARRAY[0, 1],
  $q$AWS Fargate removes the need to provision or manage EC2 cluster servers. Configuring an ECS Service to distribute tasks across subnets in 3 AZs ensures multi-AZ high availability.$q$
),
(
  'q-saa-143', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A web application hosted on EC2 instances in private subnets receives public web traffic through an Application Load Balancer (ALB). The security policy mandates inspecting Layer 7 traffic for SQL injection attacks, enforcing HTTPS encryption in transit, and restricting administrative SSH access to a bastion host. Which THREE security controls fulfill these requirements? (Select THREE.)$q$,
  $q$Associate an AWS WAF Web ACL with the Application Load Balancer to inspect HTTP requests for SQL injection patterns.$q$, $q$Configure an HTTPS Listener on the Application Load Balancer with an SSL/TLS certificate managed by AWS Certificate Manager (ACM).$q$, $q$Configure Security Groups on application EC2 instances to allow inbound SSH (port 22) strictly from the Bastion Host Security Group ID.$q$, $q$Enable AWS Shield Standard on private S3 buckets.$q$, $q$Open port 22 to 0.0.0.0/0 in Network ACLs.$q$, $q$Attach an S3 Gateway Endpoint to the ALB.$q$,
  0, ARRAY[0, 1, 2],
  $q$AWS WAF associated with an ALB inspects Layer 7 traffic for SQL injection and web exploits, an HTTPS listener with an ACM certificate enforces TLS encryption in transit at the load balancer, and Security Group nesting restricts SSH access strictly to the bastion host.$q$
),
(
  'q-saa-144', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A solutions architect is designing a secure, high-availability 3-tier web application architecture in a single AWS Region. The architecture must segregate tiers, protect against public internet exposure, and enforce principle of least privilege. Which THREE design choices should be implemented? (Select THREE.)$q$,
  $q$Deploy Application Load Balancers in public subnets across multiple Availability Zones to handle ingress web traffic.$q$, $q$Deploy EC2 application web servers in private subnets across multiple Availability Zones in an Auto Scaling group.$q$, $q$Deploy RDS database instances in dedicated private database subnets across multiple Availability Zones with Multi-AZ enabled.$q$, $q$Assign public Elastic IP addresses directly to database instances.$q$, $q$Place all application servers and database instances in a single public subnet.$q$, $q$Allow inbound SSH traffic from `0.0.0.0/0` on database Security Groups.$q$,
  0, ARRAY[0, 1, 2],
  $q$Standard 3-tier secure architecture places ALBs in public subnets to receive internet traffic, web/app servers in private subnets across multi-AZs, and database instances in isolated private database subnets with Multi-AZ enabled.$q$
),
(
  'q-saa-145', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A enterprise requires a robust disaster recovery and data protection architecture for core AWS workloads. The solution must automate cross-account backup copies, replicate S3 objects to a secondary AWS Region, and automatically route global web traffic to an healthy secondary Region if the primary Region fails. Which THREE components build this resilient solution? (Select THREE.)$q$,
  $q$AWS Backup with scheduled backup plans executing cross-Region and cross-account copy actions into locked vaults.$q$, $q$Amazon S3 Cross-Region Replication (CRR) with Versioning enabled on source and destination buckets.$q$, $q$Amazon Route 53 Latency or Failover Routing Policies linked to Route 53 Health Checks.$q$, $q$AWS Storage Gateway Tape Gateway in Single-AZ.$q$, $q$Amazon EC2 Instance Store volumes for data retention.$q$, $q$VPC Peering with static routing.$q$,
  0, ARRAY[0, 1, 2],
  $q$AWS Backup automates cross-account/cross-Region snapshot replication, S3 CRR replicates object storage to a secondary Region, and Route 53 Health Checks with Failover/Latency routing automate global traffic redirection.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- Batch 6E: q-saa-146 to q-saa-150
INSERT INTO exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
) VALUES
(
  'q-saa-146', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A media company is building a real-time data streaming analytics pipeline to process clickstream data from millions of mobile users. The pipeline must ingest streaming events continuously, transform JSON records using AWS Lambda, and buffer data into an Amazon Redshift data warehouse for BI reporting. Which THREE AWS services construct this pipeline? (Select THREE.)$q$,
  $q$Amazon Kinesis Data Streams for high-throughput real-time stream ingestion.$q$, $q$Amazon Kinesis Data Firehose to transform records via AWS Lambda and load data continuously into Amazon Redshift.$q$, $q$Amazon Redshift data warehouse to run complex SQL analytics queries.$q$, $q$AWS Snowball Edge Storage Optimized.$q$, $q$Amazon EC2 Spot Fleet running MySQL.$q$, $q$AWS Glacier Deep Archive.$q$,
  0, ARRAY[0, 1, 2],
  $q$Kinesis Data Streams ingests continuous real-time data streams, Kinesis Data Firehose transforms data via Lambda and loads it into Amazon Redshift, and Redshift provides high-performance SQL analytics.$q$
),
(
  'q-saa-147', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A security engineer is implementing zero-trust security controls for an enterprise application hosted on EC2 in private subnets. The application accesses S3 buckets, AWS Secrets Manager, and DynamoDB. The design must eliminate hardcoded credentials, ensure all AWS API network traffic remains on the private AWS backbone, and restrict outbound internet access. Which THREE controls enforce this security posture? (Select THREE.)$q$,
  $q$Attach IAM Roles with Instance Profiles to EC2 instances to provide temporary AWS credentials via IMDSv2.$q$, $q$Create VPC Endpoints (Gateway Endpoints for S3/DynamoDB, Interface Endpoints for Secrets Manager) in the VPC.$q$, $q$Remove NAT Gateways and Internet Gateways from private subnet route tables.$q$, $q$Hardcode IAM Access Keys in application source code.$q$, $q$Assign public IPv4 addresses to private EC2 instances.$q$, $q$Allow inbound SSH from `0.0.0.0/0` in Security Groups.$q$,
  0, ARRAY[0, 1, 2],
  $q$IAM Roles eliminate hardcoded keys by serving temporary IMDSv2 credentials. VPC Endpoints keep API traffic for S3, DynamoDB, and Secrets Manager on the private AWS network, allowing removal of internet/NAT gateways.$q$
),
(
  'q-saa-148', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A global e-commerce portal experiences performance bottlenecks due to database read-heavy traffic. The architecture consists of a web tier, an application tier backed by a relational database for order transactions, and Amazon DynamoDB for high-throughput product catalog reads. To achieve sub-millisecond response times, the architect plans multi-tier caching across edge, application, and database layers. Which THREE caching services fulfill this strategy? (Select THREE.)$q$,
  $q$Amazon CloudFront at the edge for caching static web assets.$q$, $q$Amazon ElastiCache for Redis at the application tier for caching relational database queries and session state.$q$, $q$Amazon DynamoDB Accelerator (DAX) for in-memory caching of DynamoDB table reads.$q$, $q$Amazon Redshift RA3 Spectrum.$q$, $q$AWS Storage Gateway Volume Gateway.$q$, $q$AWS Batch Job Queues.$q$,
  0, ARRAY[0, 1, 2],
  $q$CloudFront caches static content at edge locations, ElastiCache for Redis caches relational database queries and session data, and DAX provides in-memory microsecond read caching specifically for DynamoDB tables.$q$
),
(
  'q-saa-149', 'aws-saa-c03', 'Hard', 'multiple',
  $q$A security operations team requires automated continuous monitoring, threat detection, and security posture management across all AWS accounts in an organization. The security solution must detect unauthorized API activity, evaluate configuration compliance against CIS benchmarks, and centralize all security findings. Which THREE services should be enabled? (Select THREE.)$q$,
  $q$Amazon GuardDuty for intelligent threat detection across CloudTrail, VPC Flow Logs, and DNS logs.$q$, $q$AWS Config to continuously track resource configurations and evaluate compliance rules.$q$, $q$AWS Security Hub to aggregate and prioritize security findings across GuardDuty, Config, and Inspector.$q$, $q$Amazon Route 53 Traffic Flow.$q$, $q$AWS Glacier Vault Lock.$q$, $q$Amazon Elastic Transcoder.$q$,
  0, ARRAY[0, 1, 2],
  $q$GuardDuty detects malicious threat activity, AWS Config evaluates configuration compliance against standards, and AWS Security Hub aggregates findings into a centralized security dashboard.$q$
),
(
  'q-saa-150', 'aws-saa-c03', 'Hard', 'multiple',
  $q$An enterprise is executing a large-scale migration of on-premises applications to AWS. The portfolio includes 100 Linux/Windows physical servers, a 20 TB Oracle database, and 50 TB of NFS file storage. The migration must minimize downtime and preserve file permissions. Which THREE AWS migration services should be deployed? (Select THREE.)$q$,
  $q$AWS Application Migration Service (AWS MGN) for continuous server block-level replication.$q$, $q$AWS Database Migration Service (AWS DMS) for continuous relational database replication to AWS.$q$, $q$AWS DataSync for fast online transfer of NFS file storage to Amazon EFS while preserving POSIX permissions.$q$, $q$AWS Snowcone sent via postal carrier.$q$, $q$AWS OpsWorks for Chef Automate.$q$, $q$Amazon Route 53 Latency Routing.$q$,
  0, ARRAY[0, 1, 2],
  $q$AWS MGN handles live server lift-and-shift migration, AWS DMS migrates databases with minimal downtime, and AWS DataSync efficiently transfers NFS file data to EFS while maintaining metadata.$q$
)
ON CONFLICT (id) DO UPDATE SET
  exam_code = EXCLUDED.exam_code,
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation;

-- 7. Clean up stale topic mappings for SAA-C03 before re-inserting authoritative mappings
DELETE FROM question_topics
WHERE question_id IN (
  SELECT id FROM exam_questions WHERE exam_code = 'aws-saa-c03'
);

-- 8. Insert Authoritative Question-Topic Mappings for all 150 Questions
INSERT INTO question_topics (question_id, topic_id) VALUES
  ('q-saa-1', 'topic-ec2'),
  ('q-saa-1', 'topic-vpc'),
  ('q-saa-2', 'topic-s3'),
  ('q-saa-2', 'topic-kms'),
  ('q-saa-3', 'topic-sqs'),
  ('q-saa-3', 'topic-ec2'),
  ('q-saa-4', 'topic-rds'),
  ('q-saa-4', 'topic-elasticache'),
  ('q-saa-5', 'topic-s3'),
  ('q-saa-6', 'topic-dynamodb'),
  ('q-saa-7', 'topic-ec2'),
  ('q-saa-8', 'topic-vpc'),
  ('q-saa-8', 'topic-s3'),
  ('q-saa-9', 'topic-iam'),
  ('q-saa-9', 'topic-s3'),
  ('q-saa-10', 'topic-route53'),
  ('q-saa-10', 'topic-elb'),
  ('q-saa-11', 'topic-lambda'),
  ('q-saa-11', 'topic-s3'),
  ('q-saa-12', 'topic-cloudfront'),
  ('q-saa-12', 'topic-s3'),
  ('q-saa-13', 'topic-ebs'),
  ('q-saa-13', 'topic-ec2'),
  ('q-saa-14', 'topic-aurora'),
  ('q-saa-14', 'topic-rds'),
  ('q-saa-15', 'topic-sns'),
  ('q-saa-15', 'topic-sqs'),
  ('q-saa-16', 'topic-elb'),
  ('q-saa-16', 'topic-ec2-asg'),
  ('q-saa-17', 'topic-ec2-asg'),
  ('q-saa-17', 'topic-ec2'),
  ('q-saa-18', 'topic-kms'),
  ('q-saa-19', 'topic-efs'),
  ('q-saa-19', 'topic-ec2'),
  ('q-saa-20', 'topic-organizations'),
  ('q-saa-20', 'topic-iam'),
  ('q-saa-21', 'topic-s3'),
  ('q-saa-21', 'topic-snow-family'),
  ('q-saa-22', 'topic-vpc'),
  ('q-saa-22', 'topic-s3'),
  ('q-saa-23', 'topic-s3'),
  ('q-saa-24', 'topic-cloudfront'),
  ('q-saa-24', 'topic-s3'),
  ('q-saa-25', 'topic-ec2'),
  ('q-saa-26', 'topic-lambda'),
  ('q-saa-26', 'topic-ec2'),
  ('q-saa-27', 'topic-dynamodb'),
  ('q-saa-28', 'topic-ebs'),
  ('q-saa-29', 'topic-redshift'),
  ('q-saa-30', 'topic-s3'),
  ('q-saa-31', 'topic-elasticache'),
  ('q-saa-31', 'topic-rds'),
  ('q-saa-32', 'topic-transit-gateway'),
  ('q-saa-32', 'topic-vpc'),
  ('q-saa-33', 'topic-lambda'),
  ('q-saa-33', 'topic-sqs'),
  ('q-saa-34', 'topic-api-gateway'),
  ('q-saa-34', 'topic-elb'),
  ('q-saa-35', 'topic-datasync'),
  ('q-saa-35', 'topic-s3'),
  ('q-saa-36', 'topic-waf'),
  ('q-saa-36', 'topic-elb'),
  ('q-saa-37', 'topic-elb'),
  ('q-saa-37', 'topic-rds'),
  ('q-saa-38', 'topic-s3'),
  ('q-saa-38', 'topic-kms'),
  ('q-saa-38', 'topic-vpc'),
  ('q-saa-39', 'topic-aurora'),
  ('q-saa-39', 'topic-rds'),
  ('q-saa-40', 'topic-waf'),
  ('q-saa-40', 'topic-elb'),
  ('q-saa-40', 'topic-ec2'),
  ('q-saa-41', 'topic-api-gateway'),
  ('q-saa-41', 'topic-sqs'),
  ('q-saa-41', 'topic-lambda'),
  ('q-saa-42', 'topic-ec2'),
  ('q-saa-43', 'topic-cloudfront'),
  ('q-saa-43', 'topic-s3'),
  ('q-saa-43', 'topic-ec2'),
  ('q-saa-44', 'topic-s3'),
  ('q-saa-45', 'topic-fargate'),
  ('q-saa-45', 'topic-ecs'),
  ('q-saa-46', 'topic-iam'),
  ('q-saa-47', 'topic-secrets-manager'),
  ('q-saa-47', 'topic-rds'),
  ('q-saa-48', 'topic-cognito'),
  ('q-saa-48', 'topic-s3'),
  ('q-saa-48', 'topic-iam'),
  ('q-saa-49', 'topic-macie'),
  ('q-saa-49', 'topic-s3'),
  ('q-saa-50', 'topic-guardduty'),
  ('q-saa-50', 'topic-cloudtrail'),
  ('q-saa-51', 'topic-kms'),
  ('q-saa-52', 'topic-network-firewall'),
  ('q-saa-52', 'topic-transit-gateway'),
  ('q-saa-53', 'topic-security-hub'),
  ('q-saa-53', 'topic-guardduty'),
  ('q-saa-54', 'topic-ram'),
  ('q-saa-54', 'topic-vpc'),
  ('q-saa-55', 'topic-inspector'),
  ('q-saa-55', 'topic-ecr'),
  ('q-saa-56', 'topic-config'),
  ('q-saa-57', 'topic-s3'),
  ('q-saa-57', 'topic-kms'),
  ('q-saa-58', 'topic-cloudtrail'),
  ('q-saa-58', 'topic-organizations'),
  ('q-saa-59', 'topic-vpc'),
  ('q-saa-59', 'topic-s3'),
  ('q-saa-60', 'topic-iam-identity-center'),
  ('q-saa-60', 'topic-organizations'),
  ('q-saa-61', 'topic-control-tower'),
  ('q-saa-61', 'topic-organizations'),
  ('q-saa-62', 'topic-kms'),
  ('q-saa-63', 'topic-cloudfront'),
  ('q-saa-63', 'topic-s3'),
  ('q-saa-64', 'topic-ec2'),
  ('q-saa-64', 'topic-iam'),
  ('q-saa-65', 'topic-vpc'),
  ('q-saa-66', 'topic-waf'),
  ('q-saa-66', 'topic-elb'),
  ('q-saa-67', 'topic-s3'),
  ('q-saa-67', 'topic-iam'),
  ('q-saa-68', 'topic-shield'),
  ('q-saa-68', 'topic-cloudfront'),
  ('q-saa-69', 'topic-secrets-manager'),
  ('q-saa-69', 'topic-lambda'),
  ('q-saa-70', 'topic-vpc'),
  ('q-saa-70', 'topic-s3'),
  ('q-saa-71', 'topic-ssm-parameter-store'),
  ('q-saa-71', 'topic-kms'),
  ('q-saa-72', 'topic-ssm'),
  ('q-saa-72', 'topic-ec2'),
  ('q-saa-73', 'topic-s3'),
  ('q-saa-73', 'topic-kms'),
  ('q-saa-74', 'topic-iam'),
  ('q-saa-74', 'topic-security-hub'),
  ('q-saa-75', 'topic-privatelink'),
  ('q-saa-75', 'topic-vpc'),
  ('q-saa-76', 'topic-s3'),
  ('q-saa-76', 'topic-organizations'),
  ('q-saa-77', 'topic-elb'),
  ('q-saa-77', 'topic-kms'),
  ('q-saa-78', 'topic-dynamodb'),
  ('q-saa-78', 'topic-kms'),
  ('q-saa-79', 'topic-api-gateway'),
  ('q-saa-79', 'topic-s3'),
  ('q-saa-80', 'topic-route53'),
  ('q-saa-80', 'topic-elb'),
  ('q-saa-81', 'topic-s3'),
  ('q-saa-82', 'topic-rds'),
  ('q-saa-83', 'topic-sqs'),
  ('q-saa-84', 'topic-sqs'),
  ('q-saa-85', 'topic-route53'),
  ('q-saa-85', 'topic-vpc'),
  ('q-saa-86', 'topic-aws-backup'),
  ('q-saa-86', 'topic-ebs'),
  ('q-saa-86', 'topic-rds'),
  ('q-saa-87', 'topic-ec2-asg'),
  ('q-saa-87', 'topic-cloudwatch'),
  ('q-saa-88', 'topic-elb'),
  ('q-saa-89', 'topic-ec2'),
  ('q-saa-89', 'topic-rds'),
  ('q-saa-90', 'topic-dynamodb'),
  ('q-saa-91', 'topic-aws-backup'),
  ('q-saa-91', 'topic-efs'),
  ('q-saa-92', 'topic-ec2-asg'),
  ('q-saa-92', 'topic-ec2'),
  ('q-saa-93', 'topic-eventbridge'),
  ('q-saa-94', 'topic-s3'),
  ('q-saa-95', 'topic-storage-gateway'),
  ('q-saa-95', 'topic-s3'),
  ('q-saa-96', 'topic-elb'),
  ('q-saa-97', 'topic-route53'),
  ('q-saa-97', 'topic-elb'),
  ('q-saa-98', 'topic-vpn'),
  ('q-saa-98', 'topic-vpc'),
  ('q-saa-99', 'topic-direct-connect'),
  ('q-saa-99', 'topic-vpn'),
  ('q-saa-100', 'topic-step-functions'),
  ('q-saa-100', 'topic-lambda'),
  ('q-saa-101', 'topic-rds'),
  ('q-saa-102', 'topic-ecs'),
  ('q-saa-102', 'topic-fargate'),
  ('q-saa-103', 'topic-eks'),
  ('q-saa-103', 'topic-ec2-asg'),
  ('q-saa-104', 'topic-fsx'),
  ('q-saa-105', 'topic-global-accelerator'),
  ('q-saa-105', 'topic-elb'),
  ('q-saa-106', 'topic-aurora'),
  ('q-saa-106', 'topic-rds'),
  ('q-saa-107', 'topic-sqs'),
  ('q-saa-108', 'topic-cloudfront'),
  ('q-saa-108', 'topic-s3'),
  ('q-saa-109', 'topic-ec2-asg'),
  ('q-saa-109', 'topic-elb'),
  ('q-saa-110', 'topic-kinesis'),
  ('q-saa-111', 'topic-mgn'),
  ('q-saa-111', 'topic-ec2'),
  ('q-saa-112', 'topic-fsx'),
  ('q-saa-112', 'topic-s3'),
  ('q-saa-113', 'topic-ec2'),
  ('q-saa-113', 'topic-vpc'),
  ('q-saa-114', 'topic-athena'),
  ('q-saa-114', 'topic-s3'),
  ('q-saa-114', 'topic-glue'),
  ('q-saa-115', 'topic-kinesis'),
  ('q-saa-115', 'topic-s3'),
  ('q-saa-115', 'topic-lambda'),
  ('q-saa-116', 'topic-rds'),
  ('q-saa-116', 'topic-lambda'),
  ('q-saa-117', 'topic-opensearch'),
  ('q-saa-117', 'topic-cloudwatch'),
  ('q-saa-118', 'topic-glue'),
  ('q-saa-118', 'topic-athena'),
  ('q-saa-119', 'topic-cloudfront'),
  ('q-saa-119', 'topic-lambda'),
  ('q-saa-120', 'topic-msk'),
  ('q-saa-121', 'topic-s3'),
  ('q-saa-122', 'topic-dynamodb'),
  ('q-saa-123', 'topic-elasticache'),
  ('q-saa-124', 'topic-redshift'),
  ('q-saa-124', 'topic-athena'),
  ('q-saa-125', 'topic-s3'),
  ('q-saa-125', 'topic-global-accelerator'),
  ('q-saa-126', 'topic-ec2'),
  ('q-saa-126', 'topic-vpc'),
  ('q-saa-127', 'topic-s3'),
  ('q-saa-128', 'topic-ec2-asg'),
  ('q-saa-128', 'topic-ec2'),
  ('q-saa-129', 'topic-budgets'),
  ('q-saa-129', 'topic-cost-explorer'),
  ('q-saa-130', 'topic-compute-optimizer'),
  ('q-saa-130', 'topic-trusted-advisor'),
  ('q-saa-131', 'topic-vpc'),
  ('q-saa-131', 'topic-s3'),
  ('q-saa-131', 'topic-dynamodb'),
  ('q-saa-132', 'topic-rds'),
  ('q-saa-132', 'topic-ebs'),
  ('q-saa-133', 'topic-s3'),
  ('q-saa-134', 'topic-fargate'),
  ('q-saa-134', 'topic-ecs'),
  ('q-saa-135', 'topic-organizations'),
  ('q-saa-136', 'topic-organizations'),
  ('q-saa-136', 'topic-cloudtrail'),
  ('q-saa-136', 'topic-iam'),
  ('q-saa-137', 'topic-direct-connect'),
  ('q-saa-137', 'topic-vpn'),
  ('q-saa-137', 'topic-vpc'),
  ('q-saa-138', 'topic-s3'),
  ('q-saa-138', 'topic-kms'),
  ('q-saa-139', 'topic-api-gateway'),
  ('q-saa-139', 'topic-dynamodb'),
  ('q-saa-139', 'topic-lambda'),
  ('q-saa-140', 'topic-aurora'),
  ('q-saa-140', 'topic-rds'),
  ('q-saa-141', 'topic-fsx'),
  ('q-saa-141', 'topic-direct-connect'),
  ('q-saa-142', 'topic-ecs'),
  ('q-saa-142', 'topic-fargate'),
  ('q-saa-142', 'topic-elb'),
  ('q-saa-143', 'topic-waf'),
  ('q-saa-143', 'topic-elb'),
  ('q-saa-143', 'topic-ec2'),
  ('q-saa-144', 'topic-vpc'),
  ('q-saa-144', 'topic-elb'),
  ('q-saa-144', 'topic-ec2-asg'),
  ('q-saa-144', 'topic-rds'),
  ('q-saa-145', 'topic-aws-backup'),
  ('q-saa-145', 'topic-s3'),
  ('q-saa-145', 'topic-route53'),
  ('q-saa-146', 'topic-kinesis'),
  ('q-saa-146', 'topic-redshift'),
  ('q-saa-146', 'topic-lambda'),
  ('q-saa-147', 'topic-iam'),
  ('q-saa-147', 'topic-vpc'),
  ('q-saa-147', 'topic-secrets-manager'),
  ('q-saa-148', 'topic-cloudfront'),
  ('q-saa-148', 'topic-elasticache'),
  ('q-saa-148', 'topic-dynamodb'),
  ('q-saa-149', 'topic-guardduty'),
  ('q-saa-149', 'topic-config'),
  ('q-saa-149', 'topic-security-hub'),
  ('q-saa-150', 'topic-mgn'),
  ('q-saa-150', 'topic-dms'),
  ('q-saa-150', 'topic-datasync'),
  ('q-saa-150', 'topic-efs')
ON CONFLICT (question_id, topic_id) DO NOTHING;
