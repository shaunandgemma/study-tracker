export default Object.freeze({
  id: 'aws-iam-access-denied',
  examId: 'aws-saa-c03',
  order: 3,
  category: 'AWS Identity and Access Management',
  title: 'Diagnose an S3 AccessDenied response',
  difficulty: 'Intermediate',
  summary: 'Correct mismatched IAM actions and S3 resource ARNs.',
  scenario: 'A training role must list one S3 bucket and read objects from it. GetObject succeeds when an exact key is known, but listing the bucket fails with AccessDenied.',
  task: 'Inspect the request and identity policy, then correct the resource scope without granting access to other buckets.',
  evidence: [
    {
      id: 'error',
      title: 'AWS CLI response',
      kind: 'code',
      content: `$ aws s3api list-objects-v2 --bucket fa-training-reports

An error occurred (AccessDenied) when calling the ListObjectsV2 operation:
User arn:aws:sts::123456789012:assumed-role/fa-report-reader/session
is not authorized to perform s3:ListBucket on resource
arn:aws:s3:::fa-training-reports`
    },
    {
      id: 'policy',
      title: 'Attached identity policy',
      kind: 'code',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetObject"],
      "Resource": "arn:aws:s3:::fa-training-reports/*"
    }
  ]
}`
    }
  ],
  successCriteria: [
    's3:ListBucket is allowed on arn:aws:s3:::fa-training-reports.',
    's3:GetObject is allowed on arn:aws:s3:::fa-training-reports/*.',
    'No wildcard grants access to unrelated buckets.',
    'The learner verifies both listing and reading an approved test object.'
  ],
  hints: [
    'Read the resource ARN named in the AccessDenied message.',
    'S3 bucket operations and object operations use different resource ARN shapes.',
    'Use separate statements: the bucket ARN for ListBucket and the object ARN ending /* for GetObject.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does s3:ListBucket fail?',
      options: [
        { id: 'wrong-resource', text: 'ListBucket is granted only against the object ARN pattern, not the bucket ARN.' },
        { id: 'wrong-region', text: 'S3 list operations work only in us-east-1.' },
        { id: 'mfa', text: 'Every S3 list request requires MFA.' },
        { id: 'sts', text: 'Assumed roles cannot call S3 APIs.' }
      ],
      correctOptionId: 'wrong-resource',
      explanation: 'ListBucket is a bucket-level action and must match arn:aws:s3:::fa-training-reports rather than the object pattern ending in /*.'
    },
    {
      id: 'policy-shape',
      prompt: 'What is the safest policy correction?',
      options: [
        { id: 'separate', text: 'Use separate bucket-level ListBucket and object-level GetObject statements.' },
        { id: 'admin', text: 'Attach AdministratorAccess.' },
        { id: 'all-s3', text: 'Allow s3:* on Resource *.' },
        { id: 'object-only', text: 'Remove ListBucket and keep only the object ARN.' }
      ],
      correctOptionId: 'separate',
      explanation: 'Separate statements allow each action to use its correct resource type while keeping access limited to the named bucket.'
    }
  ],
  solution: {
    rootCause: 'The policy associated the bucket-level ListBucket action with an object-level ARN, so the request resource did not match the allow statement.',
    fix: 'Grant s3:ListBucket on arn:aws:s3:::fa-training-reports and s3:GetObject on arn:aws:s3:::fa-training-reports/* in separate statements.',
    prevention: 'Design IAM statements around the resource types documented for each action and use the AccessDenied resource ARN as investigation evidence.'
  }
});
