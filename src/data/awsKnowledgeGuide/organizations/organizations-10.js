import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-10',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'SCP Allow Lists and Deny Lists',
  status: 'ready',
  plainEnglish: 'Service Control Policies can be authored using two distinct architectural strategies:\n1. Allow List Strategy: The default AWS approach using `FullAWSAccess` (`"Effect": "Allow", "Action": "*"`). Specific actions are explicitly blocked using custom `Deny` statements.\n2. Deny List Strategy: The `FullAWSAccess` policy is replaced with restrictive `Allow` policies that explicitly enumerate ONLY the specific AWS services allowed in an OU.',
  whyItMatters: 'Using an Allow List strategy with explicit Deny statements is easier to maintain because new AWS services remain accessible automatically unless explicitly blocked. A Deny List strategy provides strict zero-trust lock-downs for compliance-heavy environments.',
  workplaceExample: 'In a medical device company\'s `HIPAA-Compliant OU`, administrators detach `FullAWSAccess` and attach an Allow List SCP that explicitly permits ONLY HIPAA-eligible services (`s3:*`, `dynamodb:*`, `kms:*`). All unlisted AWS services are implicitly denied.',
  examFocus: 'SAA-C03 Allow List vs Deny List Strategies:\n- Allow List Default: `FullAWSAccess` allows all actions by default; explicit `Deny` statements block unapproved actions (e.g. deny `s3:DeleteBucket`).\n- Deny List (Zero Trust): Remove `FullAWSAccess` and attach SCPs listing strictly approved actions; implicitly denies everything else.\n- Maintenance Impact: Deny List strategy requires updating SCPs whenever AWS launches new required services.',
  keyPoints: [
    'Allow List strategy uses `FullAWSAccess` + explicit `Deny` statements.',
    'Deny List strategy replaces `FullAWSAccess` with explicit `Allow` statements for approved services.',
    'Allow List is easier to maintain as new AWS services are released.',
    'Deny List provides strict zero-trust governance for compliance-heavy workloads.',
    'Removing `FullAWSAccess` without an alternative `Allow` policy blocks ALL service access in member accounts.'
  ],
  commonMistake: 'Removing `FullAWSAccess` from an OU before attaching an SCP with an `Allow` statement, instantly locking out all AWS service access for member accounts in that OU.',
  example: 'Explicit Deny List SCP Blocking S3 Bucket Deletion & Public Access:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "DenyS3PublicAccessRemoval",\n    "Effect": "Deny",\n    "Action": [\n      "s3:PutAccountPublicAccessBlock",\n      "s3:DeleteBucketPolicy"\n    ],\n    "Resource": "*"\n  }]\n}',
  sources: [
    { title: 'SCP Strategies - Allow Lists vs Deny Lists', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html' }
  ]
});
