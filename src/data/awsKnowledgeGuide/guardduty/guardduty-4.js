import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-4",
  "title": "GuardDuty Findings",
  "plainEnglish": "A GuardDuty finding is a standardized, detailed security alert generated whenever GuardDuty detects unexpected, suspicious, or malicious behavior in your AWS environment. Each finding contains a structured JSON document detailing the type of threat, affected AWS resource (such as an EC2 instance, IAM entity, S3 bucket, or EKS cluster), attack activity details, geographical location, threat intelligence context, and a numeric severity score.",
  "whyItMatters": "Security analysts need structured, high-context alerts to rapidly triage incidents and determine the blast radius. GuardDuty findings provide consistent naming formats, severity levels, and deep forensic metadata (e.g., actor IP address, port, API call details, user agent) so incident response teams can quickly prioritize high-risk threats over low-priority informational anomalies.",
  "workplaceExample": "A security analyst reviews the GuardDuty console and sees a High-severity finding: Recon:IAMUser/TorIPCaller. Clicking the finding reveals the exact IAM user identity, access key ID, the Tor exit node IP used to invoke the API call, and a list of reconnaissance APIs executed, enabling immediate key revocation and account investigation.",
  "examFocus": "Understand the three finding severity levels: Low (0.1 - 3.9: suspicious or unusual activity with no immediate compromise evidence), Medium (4.0 - 6.9: suspicious activity requiring investigation, like anomalous traffic), and High (7.0 - 8.9: resource is actively compromised, e.g., malware or crypto-mining). Know that findings are retained in GuardDuty for 90 days, and sample findings can be generated safely for testing.",
  "keyPoints": [
    "Findings follow a standardized naming syntax: ThreatPurpose:ResourceTypeAffected/ThreatFamilyName.DetectionMechanism!Artifact.",
    "Categorized into three severity tiers: Low (0.1 to 3.9), Medium (4.0 to 6.9), and High (7.0 to 8.9).",
    "Findings are retained in the GuardDuty console for 90 days; for long-term archiving, export findings to an Amazon S3 bucket.",
    "Supports generating sample findings via the AWS Console or CLI (CreateSampleFindings) to test alerting pipelines and EventBridge rules safely.",
    "Suppression Rules allow teams to automatically archive known benign or expected findings based on criteria without disabling detectors.",
    "Findings automatically integrate with AWS Security Hub and can be ingested into Amazon Detective for visual root-cause investigation."
  ],
  "commonMistake": "Treating finding suppression rules as an actual threat-blocking mechanism. Suppression rules only archive matching findings in the console/EventBridge; they do not block the underlying network traffic, API call, or container execution.",
  "example": "Generate sample findings to test SIEM and EventBridge automation using the AWS CLI: aws guardduty create-sample-findings --detector-id 12abc34d567e8fa9012bc34de5678901 --finding-types UnauthorizedAccess:EC2/RDPBruteForce Stealth:IAMUser/PasswordPolicyChange.",
  "sources": [
    {
      "title": "Amazon GuardDuty Findings Overview",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html"
    },
    {
      "title": "Amazon GuardDuty Finding Severity Levels",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings-severity.html"
    }
  ]
});
