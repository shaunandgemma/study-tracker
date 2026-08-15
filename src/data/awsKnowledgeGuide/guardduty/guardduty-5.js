import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-5",
  "title": "CloudTrail Event Analysis",
  "plainEnglish": "AWS CloudTrail records API activity, console logins, and management actions across your AWS accounts. Amazon GuardDuty consumes this CloudTrail event stream to detect unauthorized API calls, compromised IAM credentials, privilege escalation attempts, unusual console logins from suspicious locations, and attempts by adversaries to weaken or disable AWS security controls.",
  "whyItMatters": "Compromised IAM credentials are the primary initial access vector in cloud attacks. Attackers use stolen access keys to perform reconnaissance, create backdoor users, disable logging, and exfiltrate data. By analyzing CloudTrail events with machine learning and threat intelligence, GuardDuty detects unauthorized account activity even if the attacker uses valid AWS credentials.",
  "workplaceExample": "An attacker obtains a contractor's IAM access key and immediately calls cloudtrail:StopLogging, guardduty:DeleteDetector, and iam:CreateUser to establish persistence. GuardDuty detects these hostile actions within the CloudTrail event stream and immediately generates Stealth:IAMUser/LoggingConfigurationModified and PrivilegeEscalation:IAMUser/AdministrativePermissions findings.",
  "examFocus": "Know that GuardDuty monitors CloudTrail Management Events automatically as a foundational data source, requiring no customer configuration or CloudTrail trail setup. It identifies behavioral anomalies (unusual user agents, unexpected geolocations, novel API sequences) as well as known malicious actors (IPs associated with Tor, proxy networks, or threat intelligence feeds).",
  "keyPoints": [
    "Analyzes AWS CloudTrail management events directly from an independent, internal AWS event stream.",
    "Operates independently of whether you have created a multi-region CloudTrail trail in your account.",
    "Detects reconnaissance activities (e.g., Describe/List API spikes from Tor exit nodes or unverified IPs).",
    "Detects credential theft and unauthorized access (e.g., API calls made with session credentials from an IP outside the instance's VPC).",
    "Identifies defense evasion tactics (e.g., disabling CloudTrail trails, deleting KMS keys, or stopping GuardDuty detectors).",
    "Identifies privilege escalation attempts (e.g., attaching administrator policies to unauthorized roles or users)."
  ],
  "commonMistake": "Thinking that disabling an account's CloudTrail trail will blind GuardDuty. GuardDuty reads from an internal AWS service feed of CloudTrail events that cannot be disabled by deleting or modifying user-level CloudTrail trails.",
  "example": "Review a CloudTrail-based GuardDuty finding in JSON format: look for the 'service.action.awsApiCallAction' object to inspect the specific API called, the caller's IAM identity ARN, the caller IP address, and whether MFA was used.",
  "sources": [
    {
      "title": "Amazon GuardDuty and AWS CloudTrail",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_data-sources.html#guardduty_cloudtrail"
    },
    {
      "title": "IAM Finding Types in Amazon GuardDuty",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-iam.html"
    }
  ]
});
