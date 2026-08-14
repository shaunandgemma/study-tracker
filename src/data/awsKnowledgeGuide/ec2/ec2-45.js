import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-45',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Launch Templates',
  status: 'ready',
  plainEnglish: 'An EC2 Launch Template is a reusable configuration specification that defines all parameters needed to launch an EC2 instance—including AMI ID, instance type, key pair, security groups, block device mappings, IAM instance profile, and User Data. Launch Templates support versioning (allowing you to update settings without creating new templates) and parameter overrides.',
  whyItMatters: 'Launch Templates standardize instance deployments, streamline EC2 Auto Scaling group setup, and support AWS Spot Fleet and EC2 Fleet. Versioning makes tracking and rolling back configuration changes seamless.',
  workplaceExample: 'A company updates its web server deployment script. Instead of recreating Auto Scaling groups, they create Version 2 of their Launch Template with the new AMI ID and update the Auto Scaling group default version to Version 2.',
  examFocus: 'SAA-C03 Launch Templates vs Launch Configurations:\n- Launch Templates (Best Practice): Supports versioning, parameter inheritance, launch overrides, T2/T3 Unlimited, Spot Fleet, and modern EC2 features.\n- Launch Configurations (Legacy): Deprecated. Does NOT support versioning or editing (must create a new one every time). Always choose Launch Templates on the exam.',
  keyPoints: [
    'Reusable specification template for launching EC2 instances.',
    'Supports version control (Default Version, Latest Version, custom versions).',
    'Required for modern EC2 Auto Scaling, Spot Fleet, and EC2 Fleet configurations.',
    'Allows overriding specific parameters at launch time.',
    'Replaces legacy Launch Configurations.'
  ],
  commonMistake: 'Using legacy Launch Configurations for new Auto Scaling groups instead of AWS-recommended Launch Templates.',
  example: 'Creating a Launch Template Version:\n`aws ec2 create-launch-template-version --launch-template-id lt-0123456789abcdef0 --version-description "Update-AMI-v2" --launch-template-data "{\"ImageId\":\"ami-0abcdef1234567890\"}"`',
  sources: [
    { title: 'Create a launch template', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html' }
  ]
});
