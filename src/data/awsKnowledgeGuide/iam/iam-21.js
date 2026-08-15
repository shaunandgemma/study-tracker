import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-21',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'Service Roles',
  status: 'ready',
  plainEnglish: 'An IAM Service Role is an IAM Role created specifically to grant an AWS service (such as EC2, AWS Lambda, ECS, or Config) permission to perform actions on your behalf within your account. The service role\'s trust policy lists the specific AWS service principal (e.g., `lambda.amazonaws.com`) as the trusted entity permitted to assume the role.',
  whyItMatters: 'AWS services operate asynchronously in your account. To allow AWS Lambda to write logs to CloudWatch or allow EC2 to read from S3, the service must be granted an IAM Service Role containing necessary permissions.',
  workplaceExample: 'An engineer creates a Service Role named `LambdaS3ProcessorRole`. The trust policy trusts `lambda.amazonaws.com`. Managed policies allowing S3 read access and CloudWatch log writing are attached. When the Lambda function executes, it assumes this service role automatically.',
  examFocus: 'SAA-C03 Service Role Configuration:\n- Trust Policy Principal: Specifies the AWS service domain (e.g. `ec2.amazonaws.com`, `lambda.amazonaws.com`, `ecs-tasks.amazonaws.com`).\n- Passing Roles (`iam:PassRole`): When an administrator attaches a service role to a service (e.g. assigning a role to a Lambda function), the admin\'s IAM user must have the `iam:PassRole` permission.\n- EC2 Service Roles require an Instance Profile wrapper to attach to an EC2 instance.',
  keyPoints: [
    'IAM Role assumed by an AWS service to perform actions on your behalf.',
    'Trust policy explicitly names the AWS service principal (e.g., `lambda.amazonaws.com`).',
    'Configured with permissions policies matching the service\'s operational requirements.',
    'Assigned to AWS compute services (Lambda, ECS tasks, EC2 instance profiles).',
    'Admin assigning the role requires `iam:PassRole` permission.'
  ],
  commonMistake: 'Writing a Lambda execution role trust policy with `"Principal": { "AWS": "arn:aws:iam::123456789012:root" }` instead of `"Principal": { "Service": "lambda.amazonaws.com" }`, preventing Lambda from assuming the role.',
  example: 'Service Role Trust Policy JSON for AWS Lambda:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": { "Service": "lambda.amazonaws.com" },\n    "Action": "sts:AssumeRole"\n  }]\n}',
  sources: [
    { title: 'AWS service roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html' }
  ]
});
