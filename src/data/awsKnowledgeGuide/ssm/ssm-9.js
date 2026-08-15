import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-9",
  "title": "State Manager",
  "plainEnglish": "AWS Systems Manager State Manager is a configuration management service that automates the process of keeping your Amazon EC2 instances and on-premises managed nodes in a defined 'desired state'. You create an Association that binds an SSM Document (such as an Ansible playbook, PowerShell DSC module, bootstrap shell script, or SSM Agent updater) to targeted nodes on a recurring schedule (e.g., every 24 hours). State Manager automatically executes the document, ensures software and settings match the policy, and flags instances that deviate as Non-Compliant.",
  "whyItMatters": "Configuration drift occurs when manual changes, accidental package uninstalls, or crashed monitoring daemons cause servers to deviate from corporate baseline standards over time. State Manager eliminates configuration drift by continuously re-applying desired configurations and alerting administrators to non-compliant systems automatically.",
  "workplaceExample": "A cybersecurity compliance officer mandates that the CloudWatch agent and CrowdStrike antivirus daemon must run 24/7 on all 300 production instances. The DevOps team creates a State Manager Association that runs the `AWS-ConfigureAWSPackage` document targeting all nodes tagged `Environment=Production` every 12 hours. If a developer accidentally terminates the security agent, State Manager detects the drift, reinstalls and restarts the service automatically, and reports the node as Compliant.",
  "examFocus": "Understand State Manager associations and compliance: (1) Association Concept: The core unit of State Manager that links an SSM Document, parameter values, target nodes (tags/groups/IDs), and a recurring schedule (cron/rate). (2) Supported Technologies: Executes native SSM documents, Ansible playbooks, PowerShell Desired State Configuration (DSC), Chef recipes, and shell scripts. (3) Drift Correction: Automatically re-applies configuration periodically to enforce desired state. (4) Compliance Reporting: Integrates with AWS Config and Systems Manager Compliance dashboards.",
  "keyPoints": [
    "Configuration management service that enforces desired state across managed nodes.",
    "Creates Associations linking SSM Documents to targeted instances on a recurring schedule.",
    "Prevents and automatically remediates configuration drift across server fleets.",
    "Supports native SSM documents, Ansible playbooks, PowerShell DSC, and shell scripts.",
    "Evaluates and reports configuration compliance (Compliant vs Non-Compliant) in real time.",
    "Used for automated tasks like updating the SSM Agent, applying security policies, and configuring agents."
  ],
  "commonMistake": "Confusing State Manager with Run Command. Run Command is designed for one-time ad-hoc script execution; State Manager is designed for ongoing, scheduled, desired-state configuration enforcement that runs continuously over the life of the instance.",
  "example": "Create a State Manager Association to keep the SSM Agent updated automatically across all managed instances: aws ssm create-association --name 'AWS-UpdateSSMAgent' --targets 'Key=InstanceIds,Values=*' --schedule-expression 'cron(0 0 ? * SUN *)'.",
  "sources": [
    {
      "title": "AWS Systems Manager State Manager User Guide",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html"
    },
    {
      "title": "Working with State Manager Associations",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/state-manager-associations.html"
    }
  ]
});
