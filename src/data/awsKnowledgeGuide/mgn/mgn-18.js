import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-18',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Post-Launch Actions',
  status: 'ready',
  plainEnglish: 'AWS MGN Post-Launch Actions allow you to automate post-migration configuration tasks on newly launched EC2 instances immediately after Test or Cutover launch. Integrated natively with AWS Systems Manager (SSM), Post-Launch Actions automatically execute pre-built or custom SSM documents on the target EC2 instance to perform software installation, driver updates, OS configuration, licensing registration, or security agent deployment.',
  whyItMatters: 'Manual post-launch configuration of hundreds of migrated servers slows down cutover validation. Post-Launch Actions automate server modernization and agent installation as part of the launch process.',
  workplaceExample: 'An enterprise configures Post-Launch Actions in MGN. Upon EC2 instance boot, SSM automatically installs the CloudWatch Agent, installs AWS Systems Manager Agent, registers Windows activation, and executes a custom bash script to update database connection strings.',
  examFocus: 'SAA-C03 Post-Launch Action Capabilities:\n- Integration: Built on AWS Systems Manager (SSM) State Manager and Run Command.\n- Default Actions: Install SSM Agent, install AWS CloudWatch Agent, install AWS Inspector Agent, activate Windows license.\n- Custom Actions: Execute custom PowerShell or Bash scripts on target EC2 instances.\n- Requirement: Target EC2 instance must have SSM Agent compatibility and IAM instance profile permissions for SSM.',
  keyPoints: [
    'Automates post-migration server configuration on newly launched EC2 instances.',
    'Built natively on AWS Systems Manager (SSM) automation and documents.',
    'Includes default actions: SSM Agent install, CloudWatch Agent install, Windows licensing.',
    'Supports custom Bash and PowerShell scripts for application re-configuration.',
    'Requires an IAM Instance Profile on target EC2 instances granting SSM access.'
  ],
  commonMistake: 'Expecting Post-Launch Actions to run successfully when the target EC2 Launch Template lacks an IAM Instance Profile with `AmazonSSMManagedInstanceCore` permissions.',
  example: 'Enabling Post-Launch Actions via AWS CLI:\naws mgn update-launch-configuration --source-server-id s-1234567890abcdef0 --post-launch-actions \'{ "ssmDocuments": [{ "ssmDocumentName": "AWS-InstallCloudWatchAgent" }] }\'',
  sources: [
    { title: 'Post-launch actions in AWS Application Migration Service', url: 'https://docs.aws.amazon.com/mgn/latest/ug/post-launch-actions.html' }
  ]
});
