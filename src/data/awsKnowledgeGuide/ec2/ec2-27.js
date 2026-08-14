import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-27',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Instance Profiles and IAM Roles',
  status: 'ready',
  plainEnglish: 'An IAM Role for EC2 allows applications running inside an EC2 instance to securely access other AWS services (such as S3, DynamoDB, or Secrets Manager) without embedding long-term AWS access keys and secret keys in code. An Instance Profile is a container that attaches the IAM Role to the EC2 instance. AWS automatically manages and rotates temporary security credentials for the role, delivering them securely via IMDS.',
  whyItMatters: 'Hardcoding AWS IAM access keys in application code or configuration files leads to credential leaks on GitHub or unauthorized access. Attaching an IAM Role via an Instance Profile provides automatic credential rotation and least-privilege security.',
  workplaceExample: 'A Python app running on EC2 uploads user profile pictures to an S3 bucket. Instead of storing access keys in a `.env` file, the DevOps engineer attaches an IAM Role (`S3-Uploader-Role`) to the EC2 instance profile. The AWS SDK automatically retrieves temporary credentials from IMDS to authorize S3 uploads.',
  examFocus: 'SAA-C03 core security concept:\n- NEVER store long-term IAM access keys on EC2 instances.\n- ALWAYS attach an IAM Role to the EC2 instance using an Instance Profile.\n- You can attach, detach, or swap IAM roles on a running EC2 instance without rebooting.',
  keyPoints: [
    'Grants applications on EC2 secure access to AWS services without access keys.',
    'Instance Profile acts as the container passing the IAM Role to the EC2 instance.',
    'AWS SDKs automatically fetch and rotate temporary credentials from IMDS.',
    'IAM Roles can be attached or modified on running instances dynamically.',
    'Enforces least-privilege security best practices.'
  ],
  commonMistake: 'Creating IAM Access Keys (`AKIA...`) and storing them in an EC2 configuration file instead of attaching an IAM Role via an Instance Profile.',
  example: 'Attaching an IAM Role Instance Profile to a running EC2 Instance:\n`aws ec2 associate-iam-instance-profile --instance-id i-0123456789abcdef0 --iam-instance-profile Name=S3-Access-Instance-Profile`',
  sources: [
    { title: 'IAM roles for Amazon EC2', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html' }
  ]
});
