import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-11",
  "title": "Automation",
  "plainEnglish": "AWS Systems Manager Automation is a workflow orchestration service that automates complex, multi-step maintenance, operational, and deployment tasks across AWS cloud resources and managed nodes. Using predefined or custom Automation Runbooks (written in JSON or YAML), Automation executes ordered sequences of actions—such as taking EBS snapshot backups, building and patching Golden AMIs, recovering impaired EC2 instances, restarting Auto Scaling groups, or invoking AWS Lambda functions—with built-in error handling and approval steps.",
  "whyItMatters": "Manual execution of operational runbooks during production outages is slow, stressful, and prone to catastrophic human error. Systems Manager Automation codifies standard operating procedures into version-controlled runbooks, allowing one-click execution, automated event-driven remediation (via EventBridge or CloudWatch Alarms), and safe cross-account operations.",
  "workplaceExample": "A cloud security team detects unencrypted EBS volumes created in developer accounts. The team configures an Amazon EventBridge rule that triggers an AWS Systems Manager Automation runbook whenever AWS Config marks a volume non-compliant. The runbook: (1) Stops the attached EC2 instance, (2) Creates an encrypted snapshot of the volume using KMS, (3) Creates a new encrypted volume, (4) Swaps and reattaches the encrypted volume, and (5) Restarts the instance, remediating the security violation in under 3 minutes with zero human intervention.",
  "examFocus": "Understand Automation Runbooks and integration patterns: (1) Automation Runbooks: Documents of type `Automation` that define sequential steps, inputs, outputs, and rollback actions. (2) Predefined Runbooks: AWS provides hundreds of pre-built runbooks (e.g., `AWS-UpdateLinuxAmi`, `AWS-RestartEC2Instance`, `AWS-CreateImage`). (3) Approval Steps: Supports manual human approval gates (`aws:approve`) via email or console before proceeding. (4) Event-Driven Remediation: Triggered automatically by AWS Config Rules, CloudWatch Alarms, or EventBridge rules.",
  "keyPoints": [
    "Workflow orchestration engine that automates multi-step cloud management tasks.",
    "Uses declarative JSON/YAML Automation Runbooks to define step-by-step procedures.",
    "Provides hundreds of out-of-the-box AWS-managed runbooks for common maintenance tasks.",
    "Supports automated remediation triggered by AWS Config, CloudWatch Alarms, and EventBridge.",
    "Features manual approval gates (`aws:approve`) to enforce human change control approval.",
    "Executes securely across multiple AWS accounts and Regions using an Automation Assume Role."
  ],
  "commonMistake": "Confusing SSM Automation runbooks with SSM Command documents. Command documents execute shell/PowerShell scripts directly inside a managed node's operating system via Run Command; Automation runbooks orchestrate AWS API actions (stopping instances, creating AMIs, creating snapshots) across cloud infrastructure.",
  "example": "Execute an AWS-managed Automation runbook to create an AMI from an EC2 instance using the AWS CLI: aws ssm start-automation-execution --document-name 'AWS-CreateImage' --parameters 'InstanceId=[\"i-0123456789abcdef0\"],NoReboot=[\"true\"],ImageName=[\"Automated-Backup-AMI\"]'.",
  "sources": [
    {
      "title": "AWS Systems Manager Automation User Guide",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html"
    },
    {
      "title": "Working with Automation Runbooks in Systems Manager",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-runbooks.html"
    }
  ]
});
