import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-15',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'Least Privilege',
  status: 'ready',
  plainEnglish: 'Least Privilege is the core security practice of granting users, application roles, and services ONLY the specific permissions required to perform their intended job tasks—and no more. Rather than using broad wildcard permissions (like `"Action": "*"`), least privilege restricts permissions to specific AWS actions, specific resource ARNs, and strict condition keys.',
  whyItMatters: 'Granting broad permissions increases the blast radius of a security breach. If an application server or user credential with wildcard administrator permissions is compromised, an attacker gains complete control of the AWS account.',
  workplaceExample: 'An application role only needs to read objects from `s3://company-reports-data/`. Instead of attaching `AmazonS3FullAccess`, the security team writes a custom policy granting strictly `s3:GetObject` on `arn:aws:s3:::company-reports-data/*`.',
  examFocus: 'SAA-C03 Least Privilege Best Practices:\n- Avoid wildcard actions (`*`) and wildcard resources (`*`) in production policies.\n- Use IAM Access Analyzer to generate least-privilege policies automatically from CloudTrail activity logs.\n- Review last-accessed timestamp information in the IAM console to identify and remove unused permissions.\n- Use Customer Managed Policies instead of broad AWS Managed Administrator policies.',
  keyPoints: [
    'Grant only the minimum required permissions necessary to perform a task.',
    'Minimizes the blast radius of compromised credentials or application vulnerabilities.',
    'Restrict policies to specific actions, resource ARNs, and conditions.',
    'Use IAM Access Analyzer and CloudTrail logs to refine policies over time.',
    'Regularly audit and remove unused IAM permissions, users, and roles.'
  ],
  commonMistake: 'Attaching `AdministratorAccess` or `"Action": "*"` to application roles during initial development and leaving those broad permissions active in production environments.',
  example: 'Least-Privilege Scoped Policy Example:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject"],\n    "Resource": "arn:aws:s3:::<SPECIFIC_BUCKET_NAME>/*"\n  }]\n}',
  sources: [
    { title: 'Grant least privilege', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege' }
  ]
});
