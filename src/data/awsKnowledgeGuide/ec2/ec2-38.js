import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-38',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Termination Protection',
  status: 'ready',
  plainEnglish: 'EC2 Termination Protection is a safeguard feature that prevents an EC2 instance from being accidentally terminated via the AWS Management Console, AWS CLI, or API calls. When Termination Protection is enabled on an instance, any attempt to terminate the instance triggers an `OperationNotAllowed` error until an administrator explicitly disables the termination protection attribute first.',
  whyItMatters: 'Accidental termination of critical production database instances, bastion hosts, or core infrastructure servers causes catastrophic outages. Enabling Termination Protection adds an explicit safety barrier against human error or automated cleanup script mistakes.',
  workplaceExample: 'A system administrator enables Termination Protection on their production PostgreSQL database server (`i-0987654321fedcba0`). Weeks later, a junior engineer running a bulk cleanup script attempts to terminate the database, but the API rejects the command, preventing data loss.',
  examFocus: 'SAA-C03 Termination Protection rules:\n- Protects against accidental API/Console termination.\n- Does NOT prevent an Auto Scaling group from terminating instances during scale-in events.\n- Does NOT prevent OS-level shutdown commands (`sudo shutdown -h now` or `init 0`) from terminating an instance store-backed instance.\n- Does NOT prevent Spot Instance interruptions by AWS.',
  keyPoints: [
    'Prevents accidental termination via AWS Console, CLI, or API calls.',
    'Returns `OperationNotAllowed` error when termination is attempted.',
    'Can be enabled or disabled at launch or on running instances anytime.',
    'Does NOT block Auto Scaling scale-in termination or Spot Instance reclamation.',
    'Best practice for critical single-instance production workloads.'
  ],
  commonMistake: 'Assuming Termination Protection prevents Auto Scaling from scaling in (terminating) an instance. To prevent Auto Scaling scale-in termination, use Auto Scaling Instance Scale-In Protection instead.',
  example: 'Enabling Termination Protection on an instance:\n`aws ec2 modify-instance-attribute --instance-id i-0123456789abcdef0 --enable-api-termination`',
  sources: [
    { title: 'Enable termination protection', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html' }
  ]
});
