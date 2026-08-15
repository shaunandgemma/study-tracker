import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-5',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'String Parameters',
  status: 'ready',
  plainEnglish: 'A `String` parameter is the basic unencrypted text data type in AWS Systems Manager Parameter Store. It stores plain text string values up to 4 KB in size for Standard parameters (or up to 8 KB for Advanced parameters), such as database hostnames, environment names, log levels, or AMI IDs.',
  whyItMatters: 'Non-sensitive application settings do not require cryptographic encryption overhead. Using `String` parameters allows fast, unencrypted retrieval of operational settings while enforcing optional data-type validation (such as verifying EC2 AMI ID formatting).',
  workplaceExample: 'A DevOps engineer stores an official Amazon Linux 2023 AMI ID in Parameter Store at `/config/ami/web-server`. An Auto Scaling launch template references this `String` parameter to launch web server instances with the approved AMI.',
  examFocus: 'SAA-C03 String Parameter Attributes & Validation:\n- Unencrypted Storage: `String` parameter values are stored as plain text without KMS encryption.\n- Special Data Types: Supports data-type validation, such as `aws:ec2:image` (validates that the value matches a valid EC2 AMI ID format).\n- Size Limit: Standard tier limit is 4 KB per parameter payload.',
  keyPoints: [
    'Basic plain text parameter data type in Parameter Store.',
    'Used for non-sensitive configuration values like URLs, ports, and AMI IDs.',
    'Does NOT encrypt data at rest using AWS KMS keys.',
    'Supports special data types like `aws:ec2:image` for AMI ID format validation.',
    'Stored up to 4 KB in size under the default Standard parameter tier.'
  ],
  commonMistake: 'Storing sensitive database passwords or API keys as `String` parameters instead of using `SecureString` parameters.',
  example: 'Creating a String Parameter with AMI Validation via AWS CLI:\naws ssm put-parameter --name "/config/ami/web-server" --value "ami-0123456789abcdef0" --type "String" --data-type "aws:ec2:image"',
  sources: [
    { title: 'Creating Systems Manager String parameters', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-string.html' }
  ]
});
