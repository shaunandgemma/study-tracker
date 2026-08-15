import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-24',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Organizations Integration with Control Tower',
  status: 'ready',
  plainEnglish: 'AWS Control Tower orchestrates AWS Organizations alongside other AWS services (AWS Config, IAM Identity Center, AWS CloudTrail) to automate the setup of a secure, multi-account "Landing Zone." Control Tower automates account provisioning via Account Factory and enforces governance using Preventive Guardrails (SCPs) and Detective Guardrails (AWS Config rules).',
  whyItMatters: 'Building a multi-account environment manually by configuring Organizations, IAM Identity Center, and CloudTrail takes weeks of engineering effort. Control Tower automates Landing Zone provisioning in hours with pre-configured best-practice security baselines.',
  workplaceExample: 'An enterprise deploys AWS Control Tower on top of AWS Organizations. When developers request a new team account, Control Tower Account Factory creates the account inside `Workloads OU`, applies preventive guardrails (SCPs), and configures federated SSO access automatically.',
  examFocus: 'SAA-C03 Control Tower vs Organizations Relationship:\n- Orchestration Layer: Control Tower sits on top of AWS Organizations, automating Landing Zone setup.\n- Preventive Guardrails: Implemented as AWS Organizations Service Control Policies (SCPs) to disallow non-compliant actions.\n- Detective Guardrails: Implemented as AWS Config rules to monitor and alert on non-compliant resource states.\n- Account Factory: Automated portal for vending new pre-configured member accounts.',
  keyPoints: [
    'Orchestrates AWS Organizations to automate secure multi-account Landing Zones.',
    'Uses Preventive Guardrails implemented directly as Organizations Service Control Policies.',
    'Uses Detective Guardrails implemented as AWS Config rules for compliance auditing.',
    'Provides Account Factory for automated, standardized member account vending.',
    'Establishes core baseline accounts: Management, Security Tooling, and Log Archive.'
  ],
  commonMistake: 'Viewing AWS Control Tower and AWS Organizations as competing services. Control Tower is an orchestration service that uses AWS Organizations under the hood.',
  example: 'Comparison Summary:\n- AWS Organizations: Core service for account hierarchy, consolidated billing, and SCP management.\n- AWS Control Tower: Higher-level orchestration service that uses Organizations, Config, and IAM Identity Center to build an automated multi-account Landing Zone.',
  sources: [
    { title: 'How AWS Control Tower works with AWS Organizations', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/organizations-concepts.html' }
  ]
});
