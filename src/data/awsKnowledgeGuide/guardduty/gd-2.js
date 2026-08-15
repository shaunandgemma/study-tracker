import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-guardduty",
  "topicTitle": "Amazon GuardDuty",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "gd-2",
  "title": "Automated Incident Response Workflows via EventBridge & Lambda",
  "plainEnglish": "Amazon GuardDuty is a detection service that identifies security threats but does not automatically block traffic or repair resources. To achieve automated remediation, GuardDuty publishes its security findings to Amazon EventBridge as JSON event objects. EventBridge rules can then trigger automated workflows, such as invoking AWS Lambda functions to isolate compromised EC2 instances, revoking leaked IAM access keys, or sending immediate security alerts to Amazon SNS and Slack.",
  "whyItMatters": "In cloud security incidents, minutes matter. When an EC2 instance is hijacked for cryptocurrency mining or an IAM credential is leaked on the internet, relying exclusively on manual human intervention leads to delayed response times and higher financial or data-loss impact. Event-driven automation executes rapid containment actions within seconds while security teams investigate.",
  "workplaceExample": "A security operations team configures an EventBridge rule that listens for High-severity GuardDuty findings (severity >= 7.0). When GuardDuty generates a CryptoCurrency:EC2/BitcoinTool.B finding on an instance, EventBridge triggers a Python Lambda function that attaches an isolated 'quarantine' security group (blocking all ingress and egress traffic except to a forensics subnet), captures an EBS snapshot for forensic analysis, and pages the incident commander via PagerDuty.",
  "examFocus": "Understand the event-driven architecture for automated remediation: GuardDuty -> Amazon EventBridge -> AWS Lambda / AWS Systems Manager / Amazon SNS. Know how to construct EventBridge event patterns filtering by source ('aws.guardduty'), detail-type ('GuardDuty Finding'), and finding severity ranges or specific finding types.",
  "keyPoints": [
    "GuardDuty generates findings as JSON events published directly to Amazon EventBridge in real time.",
    "EventBridge rules filter findings by attributes such as severity, region, finding type, or affected resource ID.",
    "Automated targets include AWS Lambda, AWS Systems Manager Automation Runbooks, Amazon SNS, Amazon SQS, and AWS Step Functions.",
    "Safe containment patterns involve applying quarantine security groups, detaching IAM policies, or isolating affected workloads without immediate destructive deletion.",
    "Preserves forensic evidence (e.g., triggering EBS volume snapshots or memory dumps) prior to instance containment or shutdown.",
    "Integration with AWS Security Hub allows centralized aggregation of findings before dispatching automated remediation actions."
  ],
  "commonMistake": "Configuring automated Lambda scripts to immediately terminate or delete affected EC2 instances upon receiving a finding. Immediate termination destroys volatile memory and disk evidence needed for forensic investigation and root-cause analysis; best practice is quarantine and snapshot isolation.",
  "example": "Create an EventBridge rule pattern matching High severity GuardDuty findings: {\"source\": [\"aws.guardduty\"], \"detail-type\": [\"GuardDuty Finding\"], \"detail\": {\"severity\": [{\"numeric\": [\">=\", 7.0]}]}} and route to an incident response Lambda function.",
  "sources": [
    {
      "title": "Creating Custom Responses to GuardDuty Findings with Amazon EventBridge",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings_cloudwatch.html"
    },
    {
      "title": "Remediating Security Issues with GuardDuty and AWS Systems Manager",
      "url": "https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_remediate.html"
    }
  ]
});
