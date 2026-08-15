import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-18",
  "title": "GuardDuty vs Macie",
  "plainEnglish": "Amazon GuardDuty and Amazon Macie are specialized AWS security services designed for different security domains. Amazon GuardDuty is a continuous threat-detection service that detects unauthorized behavior, compromised accounts, malware, and active attacks across AWS workloads and storage. Amazon Macie is a dedicated data security and privacy service that discovers, classifies, and protects sensitive data (such as Personally Identifiable Information, credit card numbers, and API keys) stored inside Amazon S3 buckets.",
  "whyItMatters": "Data protection requires knowing where sensitive data lives (data classification by Macie) and detecting when unauthorized entities attempt to access or steal that data (threat detection by GuardDuty). Deploying both services provides defense-in-depth: Macie identifies high-risk S3 buckets containing confidential customer records, and GuardDuty alerts if an IAM credential begins exfiltrating data from those buckets.",
  "workplaceExample": "A healthcare provider runs Amazon Macie across their S3 data lakes to scan CSV and JSON files, automatically identifying buckets that contain unencrypted HIPAA Medical Record Numbers (MRNs) and patient names. Simultaneously, they use Amazon GuardDuty with S3 Protection enabled to detect if an IAM user makes anomalous API calls from a Tor exit node to download objects from those buckets.",
  "examFocus": "Know the distinct roles for certification exams: Amazon Macie = Sensitive Data Discovery & Classification in Amazon S3 (scans inside S3 objects for PII, financial data, credentials, and evaluates bucket public exposure). Amazon GuardDuty = Managed Threat Detection (monitors activity logs and telemetry for active attacks, compromised credentials, crypto-mining, and anomalous S3 data access).",
  "keyPoints": [
    "Amazon Macie scans and classifies sensitive content (PII, SSNs, credit card numbers, secret keys) stored inside Amazon S3 objects.",
    "Amazon GuardDuty analyzes activity and telemetry (CloudTrail, VPC Flow Logs, DNS, S3 data events) to detect active threats and unauthorized behavior.",
    "Macie evaluates S3 bucket posture (public accessibility, encryption status, unshared buckets) and discovers sensitive data at rest.",
    "GuardDuty S3 Protection detects behavioral anomalies and active attacks targeting S3 buckets (e.g., mass GetObject calls from a malicious IP).",
    "Macie focuses strictly on Amazon S3 data security, while GuardDuty covers EC2, IAM, EKS, ECS, Lambda, RDS, and S3.",
    "Both services publish standardized security findings to Amazon EventBridge and AWS Security Hub for centralized response orchestration."
  ],
  "commonMistake": "Believing that Amazon Macie detects network attacks or compromised EC2 instances. Macie is strictly focused on discovering and protecting sensitive data within Amazon S3; general threat detection across AWS services is handled by Amazon GuardDuty.",
  "example": "Use Amazon Macie to run a sensitive data discovery job flagging S3 objects containing credit card numbers, and use Amazon GuardDuty to alert your security team if an IAM user attempts an anomalous bulk download of those objects.",
  "sources": [
    {
      "title": "What is Amazon Macie?",
      "url": "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"
    },
    {
      "title": "Amazon GuardDuty Threat Detection Overview",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"
    }
  ]
});
