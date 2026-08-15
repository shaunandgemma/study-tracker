import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-17",
  "title": "GuardDuty vs Inspector",
  "plainEnglish": "Amazon GuardDuty and Amazon Inspector are distinct, complementary AWS security services addressing different stages of the security lifecycle. Amazon GuardDuty is a continuous threat-detection service that detects active security threats, behavioral anomalies, and unauthorized access across your AWS accounts and workloads. Amazon Inspector is an automated vulnerability management service that scans your Amazon EC2 instances, Amazon ECR container images, and AWS Lambda functions for known software vulnerabilities (CVEs) and unintended network exposure.",
  "whyItMatters": "Security requires both vulnerability management (preventive posture before or during deployment) and threat detection (detecting active exploits and malicious behavior at runtime). Confusing GuardDuty with Inspector leads to gaps where organizations scan for code vulnerabilities but fail to detect compromised credentials, or conversely detect attacks but never patch known software CVEs.",
  "workplaceExample": "A software company uses Amazon Inspector during their CI/CD build pipeline and across production EC2 instances to continuously identify unpatched OpenSSL vulnerabilities and outdated container packages. Meanwhile, they run Amazon GuardDuty 24/7 to alert them if an attacker attempts an RDP brute-force attack or if an EC2 instance initiates unauthorized outbound communication with a cryptocurrency mining pool.",
  "examFocus": "Know the core difference for AWS exams: Amazon Inspector = Vulnerability Assessment (scans packages/code for known CVEs, software weaknesses, and network exposure). Amazon GuardDuty = Threat Detection (monitors logs and runtime telemetry to detect active attacks, compromised credentials, malware, crypto-mining, and unauthorized behavior). Both services export findings to AWS Security Hub.",
  "keyPoints": [
    "Amazon GuardDuty focuses on detecting active threats, unauthorized behaviors, and compromised resources in real time.",
    "Amazon Inspector focuses on identifying software vulnerabilities (CVEs) and unintended network exposures across EC2, ECR, and Lambda.",
    "GuardDuty analyzes telemetry streams (CloudTrail, VPC Flow Logs, DNS, EKS logs, RDS logins) and runtime activity.",
    "Inspector performs automated package vulnerability assessments and code vulnerability scanning without generating threat alerts.",
    "GuardDuty produces findings when an attack or anomaly occurs; Inspector produces findings when a patchable vulnerability or exposure exists.",
    "Both services operate seamlessly together and publish standardized findings into AWS Security Hub for centralized prioritization."
  ],
  "commonMistake": "Assuming that Amazon Inspector will alert you if an EC2 instance is currently being used for cryptocurrency mining. Inspector only finds static software CVEs and network exposure; active runtime attacks and suspicious behavior are detected by Amazon GuardDuty.",
  "example": "Use Amazon Inspector to scan container images in Amazon ECR for CVE vulnerabilities before deployment, and use Amazon GuardDuty to monitor the running containers on Amazon EKS for runtime threats and C2 communications.",
  "sources": [
    {
      "title": "Amazon GuardDuty Threat Detection Overview",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"
    },
    {
      "title": "What is Amazon Inspector?",
      "url": "https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html"
    }
  ]
});
