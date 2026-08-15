import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "gd-1",
  "title": "ML Anomaly Detection across VPC Flow Logs, CloudTrail, DNS Logs, EKS Audit Logs, S3, RDS",
  "plainEnglish": "Amazon GuardDuty continuously ingests and analyzes vast streams of AWS telemetry—including AWS CloudTrail management and data events, Amazon VPC Flow Logs, Route 53 DNS query logs, Kubernetes audit logs, and RDS login events. It applies machine learning models, statistical anomaly detection, and integrated threat intelligence to establish behavioral baselines and detect abnormal, potentially malicious activities across your AWS environment.",
  "whyItMatters": "Manual analysis of billions of daily log events across multiple accounts is impossible. Traditional rule-based alerting generates high false-positive rates and misses zero-day threats. GuardDuty uses machine learning algorithms tuned specifically for AWS infrastructure to recognize subtle behavioral deviations (such as an IAM user invoking unusual APIs from an unexpected geographical location) without requiring customers to manually build or train ML models.",
  "workplaceExample": "A developer's access keys are leaked. The attacker immediately invokes DescribeInstances from an IP address in a country the company never operates in, followed by rapid attempts to launch GPU compute instances. GuardDuty's anomaly detection identifies that this IAM identity has never operated from that geographic region or requested those EC2 API actions, promptly generating an UnauthorizedAccess:IAMUser/AnomalousBehavior finding.",
  "examFocus": "Know that GuardDuty directly consumes internal streams of CloudTrail management events, VPC Flow Logs, and Route 53 DNS logs without requiring customers to enable or store those logs manually for foundational monitoring. Understand that additional protection plans (S3 Protection, EKS Protection, RDS Protection, Lambda Protection, Runtime Monitoring) extend anomaly detection to specialized workload data.",
  "keyPoints": [
    "Analyzes foundational telemetry streams: AWS CloudTrail management events, VPC Flow Logs, and Route 53 DNS query logs.",
    "Optional protection plans extend coverage to S3 data events, EKS audit logs, RDS login activity, Lambda executions, and container runtime events.",
    "Uses machine learning and behavioral profiling to baseline normal account activity and flag anomalous deviations.",
    "Does not require customers to enable VPC Flow Logs or DNS logging in their VPCs for foundational GuardDuty analysis; GuardDuty consumes internal AWS telemetry feeds directly.",
    "Consumes telemetry with zero performance impact or latency overhead on monitored EC2 instances, containers, or databases.",
    "Correlates anomalies with global AWS threat intelligence feeds and third-party partner intelligence (such as CrowdStrike and Proofpoint)."
  ],
  "commonMistake": "Assuming GuardDuty inspects full application payload packets or modifies network routes. GuardDuty inspects network flow metadata (IPs, ports, protocols, packet counts) and DNS queries, not the unencrypted payload contents of application traffic.",
  "example": "Enable GuardDuty in an AWS region via AWS CLI: aws guardduty create-detector --enable, which immediately activates baseline ML anomaly detection across CloudTrail, VPC Flow Logs, and DNS query streams.",
  "sources": [
    {
      "title": "Amazon GuardDuty Foundational Data Sources",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_data-sources.html"
    },
    {
      "title": "How Amazon GuardDuty Uses Machine Learning",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-active.html"
    }
  ]
});
