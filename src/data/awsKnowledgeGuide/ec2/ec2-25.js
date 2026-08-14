import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-25',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Instance Metadata Service - IMDS',
  status: 'ready',
  plainEnglish: 'The EC2 Instance Metadata Service (IMDS) is an internal REST API endpoint accessible strictly from within a running EC2 instance at the non-routable IP address `http://169.254.169.254`. IMDS provides information about the instance itself—such as its instance ID, private IP address, public IP address, AMI ID, security groups, IAM role credentials, and user data—without needing AWS CLI credentials or SDK keys.',
  whyItMatters: 'IMDS allows code and management scripts running inside an EC2 instance to dynamically inspect their environment (e.g. discover its own instance ID or region) and retrieve temporary IAM security credentials for AWS API authorization.',
  workplaceExample: 'A monitoring script running on an EC2 instance sends an HTTP GET request to `http://169.254.169.254/latest/meta-data/instance-id` to tag its log entries with the correct EC2 instance ID automatically.',
  examFocus: 'SAA-C03 IP Address to memorize:\n- `169.254.169.254` is the magic IPv4 address for IMDS.\n- Metadata (`/latest/meta-data/`): Instance attributes (IP, instance-id, IAM role credentials).\n- User Data (`/latest/user-data/`): Returns the launch bootstrap script.\n- IMDS is local-only and cannot be queried from outside the instance over the internet.',
  keyPoints: [
    'Accessible only from inside the EC2 instance at IP `169.254.169.254`.',
    'Provides instance configuration details (instance ID, IP, security groups).',
    'Delivers temporary IAM role credentials (`meta-data/iam/security-credentials/role-name`).',
    'Exposes launch script via `169.254.169.254/latest/user-data/`.',
    'IMDSv1 uses simple GET requests; IMDSv2 requires session tokens for SSRF protection.'
  ],
  commonMistake: 'Confusing Instance Metadata with User Data. User Data is the script supplied at launch (`user-data`); Metadata is the system information about the instance provided by AWS (`meta-data`).',
  example: 'Retrieving Instance ID inside EC2:\n`curl http://169.254.169.254/latest/meta-data/instance-id`\nOutput: `i-0123456789abcdef0`',
  sources: [
    { title: 'Use IMDS to retrieve instance metadata', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html' }
  ]
});
