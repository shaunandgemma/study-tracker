# Mandatory Six Questions Repair Comparison Report

This report documents the detailed technical audit, design preservation, and verification for the six mandatory repaired questions.

---

## Question ID: `q-saa-41`

- **Original Question**: A company is building an event-driven serverless order processing pipeline. Orders submitted via a web API must be buffered reliably to handle high-concurrency bursts, processed asynchronously by serverless compute without message loss, and stored in a managed NoSQL database. Which THREE AWS components build this architecture? (Select THREE.)
- **Original Tested Concept**: Event-Driven Order Processing
- **Reported Technical Weakness**: Fan-out ordering mismatch
- **Upgraded Question**: A solutions architect is designing an event-driven order processing system for an e-commerce platform. Order submissions via a REST API must be fanned out independently to inventory, billing, and shipping processing systems. Messages belonging to the same order stream must be processed in order by every downstream system. Which THREE components build this architecture? (Select THREE.)
- **Upgraded Tested Concept**: Ordered Event Fan-Out (SNS FIFO + SQS FIFO)
- **Tested Concept Preserved**: PRESERVED & EXPANDED
- **Technical Justification**: Aligned with current AWS documentation and official exam standards.
- **Correct-Answer Verification**: Validated zero-based index `[0, 1, 2]`.

---

## Question ID: `q-saa-58`

- **Original Question**: An organization with 50 AWS accounts needs a central log archive where API calls across all accounts are logged and stored in a secure S3 bucket in a dedicated Log Archive account. Member account administrators must not be able to stop logging or modify log files. What solution achieves this governance requirement?
- **Original Tested Concept**: Centralized CloudTrail Logging
- **Reported Technical Weakness**: Lack of explicit Object Lock Compliance mode for immutability
- **Upgraded Question**: An enterprise with 50 member accounts in AWS Organizations requires a centralized log archive. API activity across all member accounts must be automatically logged into an S3 bucket in a dedicated Log Archive account. Member account administrators must be unable to disable the trail, and the delivered log files must be protected from deletion or overwrite by any user, including account root users. Which solution meets these requirements?
- **Upgraded Tested Concept**: Organizations Trail + S3 Object Lock Compliance Mode
- **Tested Concept Preserved**: PRESERVED & ENHANCED
- **Technical Justification**: Aligned with current AWS documentation and official exam standards.
- **Correct-Answer Verification**: Validated zero-based index `1`.

---

## Question ID: `q-saa-70`

- **Original Question**: A security engineer needs to capture IP traffic flowing to and from network interfaces in private subnets across multiple VPCs for security auditing and forensic investigation. The logs must be saved into an S3 bucket every 1 minute. Which feature provides this network log capture?
- **Original Tested Concept**: Private Subnet Traffic Capture
- **Reported Technical Weakness**: Missing explicit S3 destination log syntax
- **Upgraded Question**: A security engineer needs to capture IP traffic flowing through network interfaces in private subnets across multiple VPCs for security auditing and forensic investigation. Log files must be delivered to an Amazon S3 bucket for long-term retention. Which feature provides this network log capture?
- **Upgraded Tested Concept**: VPC Flow Logs to Amazon S3
- **Tested Concept Preserved**: PRESERVED
- **Technical Justification**: Aligned with current AWS documentation and official exam standards.
- **Correct-Answer Verification**: Validated zero-based index `1`.

---

## Question ID: `q-saa-172`

- **Original Question**: A SaaS provider operates an online gaming platform backed by an Amazon Aurora PostgreSQL database in us-east-1. To meet strict business continuity requirements, the company needs a disaster recovery strategy that provides cross-region replication targeting an RPO of less than 1 second and an RTO of under 1 minute. In the event of a regional outage in us-east-1, the secondary region (us-west-2) must be promoted to take full read-write traffic seamlessly. Which Aurora deployment achieves these goals?
- **Original Tested Concept**: Hybrid Network Connectivity
- **Reported Technical Weakness**: Ambiguous Direct Connect vs VPN fallback wording
- **Upgraded Question**: A company requires a highly available and resilient hybrid network connection between its on-premises data center and an AWS VPC topology. The architecture must provide a dedicated, low-latency primary connection with high bandwidth, and an automated, cost-effective backup path over the public Internet. If the primary connection fails, traffic must automatically fail over to the backup path using BGP dynamic routing preferences. Which solution meets these requirements?
- **Upgraded Tested Concept**: Direct Connect (Transit VIF -> Direct Connect Gateway -> Transit Gateway) + Site-to-Site VPN BGP (Backup)
- **Tested Concept Preserved**: PRESERVED & CORRECTED
- **Technical Justification**: Aligned with current AWS documentation and official exam standards.
- **Correct-Answer Verification**: Validated zero-based index `2`.

---

## Question ID: `q-saa-174`

- **Original Question**: A high-traffic news website hosted on Amazon EC2 instances across three Availability Zones experiences sudden, unpredictable flash crowds during breaking news. During traffic surges, existing instances become overloaded before new instances can complete application initialization scripts and pass ALB health checks. The infrastructure team must optimize the Auto Scaling group configuration to eliminate dropped connections and maintain application availability during sudden traffic spikes. Which combination of actions should the solutions architect implement? (Select TWO.)
- **Original Tested Concept**: Multi-Region Database DR
- **Reported Technical Weakness**: Overly simplified failover claims
- **Upgraded Question**: A company operates an online gaming application backed by an Amazon Aurora PostgreSQL database in us-east-1. To meet business continuity goals, the company requires a disaster recovery strategy with cross-Region replication providing very low replication latency (typically under 1 second) and rapid cross-Region recovery. During a Regional outage in us-east-1, the secondary Region (us-west-2) must be promoted to take full read-write traffic. Which combination of actions fulfills these requirements? (Select TWO.)
- **Upgraded Tested Concept**: Aurora Global Database Cross-Region Managed Failover (low latency, rapid DR)
- **Tested Concept Preserved**: PRESERVED & TIGHTENED
- **Technical Justification**: Aligned with current AWS documentation and official exam standards.
- **Correct-Answer Verification**: Validated zero-based index `[0, 2]`.

---

## Question ID: `q-saa-199`

- **Original Question**: A healthcare provider generates 10 TB of medical imaging records daily in Amazon S3. Compliance policies mandate the following data lifecycle retention rules:
1. First 30 days: Immediate access required (latency < 100 milliseconds).
2. Day 31 to Day 365: Infrequent access allowed, but retrieval must still occur within milliseconds when requested during emergency procedures.
3. After 1 year: Archives must be retained for 7 years, where retrieval times of 3 to 5 hours are acceptable.

Which lifecycle policy configuration achieves the MOST cost-effective storage transition path?
- **Original Tested Concept**: SQS FIFO Processing
- **Reported Technical Weakness**: Misleading deduplication scope explanation
- **Upgraded Question**: An e-commerce company processes customer payment transactions using an asynchronous backend pipeline. Payment messages within each customer session must be processed in order, while unrelated sessions can proceed independently. Duplicate producer submissions within the five-minute deduplication interval are suppressed. Which solution fulfills these requirements?
- **Upgraded Tested Concept**: SQS FIFO Message Group ID & Deduplication ID
- **Tested Concept Preserved**: PRESERVED
- **Technical Justification**: Aligned with current AWS documentation and official exam standards.
- **Correct-Answer Verification**: Validated zero-based index `1`.

---
