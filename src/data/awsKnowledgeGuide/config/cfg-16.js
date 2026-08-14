import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-16',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Detective Compliance Controls',
  status: 'ready',
  plainEnglish: 'Detective Compliance Controls are security controls that monitor, discover, evaluate, and alert on existing misconfigurations, unauthorized changes, or non-compliant resources after they have been created. AWS Config acts as the primary Detective Control service in AWS by continuously auditing resource configurations against rules and reporting compliance violations.',
  whyItMatters: 'Security architectures require defense-in-depth: Preventative controls (like SCPs and IAM policies) block unapproved actions, while Detective controls (like AWS Config and GuardDuty) discover misconfigurations or unexpected changes that bypass preventative boundaries.',
  workplaceExample: 'While IAM policies prevent developers from terminating production databases, an engineer accidentally leaves an RDS database publicly accessible. AWS Config acts as a detective control, discovering the public accessibility setting during its continuous evaluation and alerting the security team immediately.',
  examFocus: 'SAA-C03 governance concept: Distinguish PREVENTATIVE controls from DETECTIVE controls:\n- Preventative Controls: Stop actions BEFORE they happen (e.g., Service Control Policies (SCPs), IAM Permission Boundaries, VPC Endpoint Policies).\n- Detective Controls: Identify non-compliant resources AFTER they are deployed (e.g., AWS Config Rules, AWS Security Hub, Amazon GuardDuty, AWS CloudTrail).',
  keyPoints: [
    'AWS Config is a core Detective Control service in the AWS Cloud Adoption Framework.',
    'Monitors and identifies non-compliant configurations after deployment.',
    'Complements Preventative Controls (SCPs, IAM policies, Bucket Policies).',
    'Feeds compliance findings into centralized tools like AWS Security Hub.',
    'Triggers automated or manual remediation via Systems Manager Automation.'
  ],
  commonMistake: 'Confusing AWS Config (Detective Control) with Service Control Policies / SCPs (Preventative Control). AWS Config does NOT block resource creation; it detects non-compliance after resources exist.',
  example: 'Control Classification:\nPreventative: SCP denies `s3:CreateBucket` without encryption.\nDetective: AWS Config Rule `s3-bucket-server-side-encryption-enabled` flags any unencrypted bucket.',
  sources: [
    { title: 'AWS Config Overview', url: 'https://docs.aws.amazon.com/config/latest/developerguide/config-overview.html' }
  ]
});
