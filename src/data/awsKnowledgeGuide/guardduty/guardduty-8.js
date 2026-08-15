import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-8",
  "title": "S3 Protection",
  "plainEnglish": "Amazon GuardDuty S3 Protection is an optional, dedicated protection feature that monitors Amazon Simple Storage Service (Amazon S3) object-level data events (such as GetObject, ListObjects, PutObject, and DeleteObject) and management events across all S3 buckets in your AWS account. It applies machine learning to detect unusual data access patterns, suspicious IP access, and unauthorized attempts to exfiltrate or modify sensitive data in S3.",
  "whyItMatters": "Amazon S3 often serves as the central data lake housing sensitive customer records, financial reports, and intellectual property. Compromised IAM credentials or misconfigured bucket policies can lead to massive data breaches. S3 Protection continuously profiles normal access patterns and alerts you when an identity makes an abnormal volume of read requests or accesses buckets from suspicious IP addresses (like Tor exit nodes or unverified origins).",
  "workplaceExample": "An attacker gains temporary access to an IAM role. They invoke ListBuckets and immediately call GetObject millions of times across a private customer data bucket from a known malicious IP address. GuardDuty S3 Protection triggers an Exfiltration:S3/AnomalousBehavior finding, enabling the security team to revoke the IAM session within minutes.",
  "examFocus": "Understand that S3 Protection monitors CloudTrail S3 Data Events without requiring customers to manually enable or pay for CloudTrail S3 data event logging. Distinguish GuardDuty S3 Protection (which detects active threats and suspicious access anomalies) from Amazon Macie (which discovers and classifies sensitive data like PII/credit cards inside S3 objects).",
  "keyPoints": [
    "Monitors object-level CloudTrail data events (GetObject, ListObjects, PutObject, DeleteBucketPolicy) across all S3 buckets in the account.",
    "Does not require customers to configure or pay for individual CloudTrail S3 data event logging.",
    "Uses machine learning to establish normal baseline access behavior per IAM user and role for each S3 bucket.",
    "Detects anomalous data access, bulk data exfiltration, policy modifications that weaken encryption or public block settings, and access from Tor/malicious IPs.",
    "Can be enabled or disabled independently as a protection plan within GuardDuty across single accounts or AWS Organizations.",
    "Generates finding types prefixed with 'Discovery:S3/', 'Exfiltration:S3/', 'Impact:S3/', 'Policy:S3/', 'Stealth:S3/', and 'UnauthorizedAccess:S3/'."
  ],
  "commonMistake": "Confusing GuardDuty S3 Protection with Amazon Macie. GuardDuty S3 Protection detects suspicious behavior and access threats (who is accessing the bucket anomalously); Amazon Macie scans and classifies sensitive content stored inside the objects (PII, SSNs, credit cards).",
  "example": "Enable S3 Protection in GuardDuty using the AWS CLI: aws guardduty update-detector --detector-id 12abc34d567e8fa9012bc34de5678901 --features '[{\"Name\":\"S3_DATA\",\"Status\":\"ENABLED\"}]'.",
  "sources": [
    {
      "title": "Amazon GuardDuty S3 Protection",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/s3-protection.html"
    },
    {
      "title": "S3 Finding Types in Amazon GuardDuty",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-s3.html"
    }
  ]
});
