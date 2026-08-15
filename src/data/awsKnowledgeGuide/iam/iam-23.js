import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-23',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM PassRole',
  status: 'ready',
  plainEnglish: '`iam:PassRole` is an IAM permission that allows an IAM user or role to pass an approved IAM service role to an AWS service (such as EC2, AWS Lambda, or CloudFormation). When you launch an EC2 instance or deploy a Lambda function and assign an IAM role to it, AWS verifies that your IAM identity has explicit `iam:PassRole` permission for that specific target role ARN.',
  whyItMatters: 'Without `iam:PassRole` restrictions, a user with limited permissions could create a powerful administrator IAM role and attach it to an EC2 instance or Lambda function that they control, effectively escalating their own privileges to Administrator.',
  workplaceExample: 'A company grants a junior developer permission to create AWS Lambda functions (`lambda:CreateFunction`). To prevent privilege escalation, the security policy grants `iam:PassRole` ONLY on `arn:aws:iam::<ACCOUNT_ID>:role/BasicLambdaExecutionRole`, blocking them from attaching administrative roles.',
  examFocus: 'SAA-C03 `iam:PassRole` Security Mechanics:\n- `iam:PassRole` does NOT allow the user to assume the role directly; it allows passing the role to a service.\n- Required whenever configuring services to run with an IAM Role (EC2 instance profiles, Lambda execution roles, Glue jobs, CloudFormation stack roles).\n- Privilege Escalation Prevention: Always restrict `Resource` in `iam:PassRole` statements to specific allowed role ARNs.',
  keyPoints: [
    'Permission allowing a principal to pass an IAM role to an AWS service.',
    'Required when attaching roles to EC2, Lambda, ECS, CloudFormation, or Glue.',
    'Does NOT allow the user to assume the role directly.',
    'Essential control for preventing privilege escalation attacks.',
    'Resource in `iam:PassRole` statements should be restricted to specific approved role ARNs.'
  ],
  commonMistake: 'Granting `"Action": "iam:PassRole"` with `"Resource": "*"` to junior developers, allowing them to pass `AdministratorAccess` roles to compute instances they control.',
  example: 'Sample `iam:PassRole` Policy JSON:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": "iam:PassRole",\n    "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/ApprovedAppRole"\n  }]\n}',
  sources: [
    { title: 'Granting a user permissions to pass a role to an AWS service', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_passrole.html' }
  ]
});
