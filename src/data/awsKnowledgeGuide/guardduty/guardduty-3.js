import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "guardduty-3",
  "title": "GuardDuty Managed Threat Detection",
  "plainEnglish": "Amazon GuardDuty is a fully managed, intelligent threat-detection service that continuously monitors your AWS accounts, workloads, container clusters, databases, and storage for malicious activity and unauthorized behavior. With a single click in the AWS Console or via AWS Organizations, GuardDuty begins processing telemetry and generating actionable security findings without installing software agents or managing complex security appliances.",
  "whyItMatters": "Traditional security monitoring tools require complex network taps, on-host security agents, log indexing infrastructure, and dedicated threat intelligence subscription feeds. GuardDuty simplifies threat detection by operating as an agentless, cloud-native managed service with integrated AWS threat intelligence and machine learning models tailored to AWS environment attack vectors.",
  "workplaceExample": "A retail company enables GuardDuty across all member accounts in AWS Organizations using the delegated administrator model. Within hours, GuardDuty alerts the security team that an EC2 instance in their staging VPC is communicating with a known command-and-control (C2) server on the dark web, allowing the SecOps team to quarantine the instance before customer data could be exfiltrated.",
  "examFocus": "Understand core GuardDuty fundamentals: It is a Regional service enabled on a per-region basis (or centrally via AWS Organizations). It is non-invasive and agentless for foundational log sources (CloudTrail, VPC Flow Logs, DNS logs), meaning it introduces zero latency and zero compute resource consumption on your running workloads.",
  "keyPoints": [
    "Amazon GuardDuty is an intelligent, managed threat-detection service powered by machine learning and global threat intelligence.",
    "Operates agentlessly for foundational data sources, analyzing internal AWS log feeds with zero impact on workload CPU or network latency.",
    "Enabled on a Regional basis and should be activated across all active AWS Regions in all accounts to maintain comprehensive visibility.",
    "Integrates with AWS Organizations, allowing a security account to be designated as the Delegated Administrator to manage member accounts centrally.",
    "Supports specialized protection features: S3 Protection, EKS Protection, RDS Protection, Lambda Protection, and Runtime Monitoring.",
    "Does not actively block threats by itself; acts as a detection and alerting engine that publishes findings to EventBridge and Security Hub."
  ],
  "commonMistake": "Assuming enabling GuardDuty in one AWS Region automatically protects all Regions globally. GuardDuty is a Regional service; you must enable it in every AWS Region where you have resources or configure AWS Organizations auto-enablement across all Regions.",
  "example": "Enable GuardDuty centrally across an AWS Organization by designating a security tooling account as the GuardDuty Delegated Administrator and enabling auto-enablement for all existing and newly created member accounts.",
  "sources": [
    {
      "title": "What is Amazon GuardDuty?",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html"
    },
    {
      "title": "Getting Started with Amazon GuardDuty",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_settingup.html"
    }
  ]
});
