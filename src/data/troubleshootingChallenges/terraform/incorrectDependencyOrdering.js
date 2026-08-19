export default Object.freeze({
  id: 'terraform-incorrect-dependency-ordering',
  examId: 'terraform-associate-004',
  order: 14,
  category: 'Terraform Dependencies',
  title: 'Repair Incorrect Dependency Ordering',
  difficulty: 'Intermediate',
  summary: 'Diagnose a hidden dependency that Terraform cannot infer from a hard-coded identifier.',
  scenario: 'A Terraform apply creates an IAM role and an S3 bucket policy for a new training environment. The bucket-policy creation intermittently fails because AWS reports an invalid principal. The role and policy are both part of the same configuration, but the policy uses a manually constructed role ARN rather than a Terraform reference.',
  task: 'Use the configuration and apply timeline to identify the hidden dependency, express the relationship in Terraform so the role is ready before the bucket policy is created, and verify the plan graph no longer relies on timing.',
  evidence: [
    {
      id: 'iam-role',
      title: 'iam.tf',
      kind: 'code',
      content: `resource "aws_iam_role" "reader" {
  name = "fa-training-reader"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}`
    },
    {
      id: 'bucket-policy',
      title: 's3.tf',
      kind: 'code',
      content: `resource "aws_s3_bucket_policy" "training" {
  bucket = aws_s3_bucket.training.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        AWS = "arn:aws:iam::123456789012:role/fa-training-reader"
      }
      Action   = "s3:GetObject"
      Resource = "\${aws_s3_bucket.training.arn}/*"
    }]
  })
}`
    },
    {
      id: 'apply-timeline',
      title: 'terraform apply Timeline',
      kind: 'code',
      content: `aws_iam_role.reader: Creating...
aws_s3_bucket.training: Creation complete
aws_s3_bucket_policy.training: Creating...

aws_s3_bucket_policy.training: Creation failed
Error: putting S3 Bucket Policy: MalformedPolicy:
Invalid principal in policy

aws_iam_role.reader: Creation complete

Approved correction:
Prefer a Terraform expression reference when the policy can directly
use the role resource value.
Do not add arbitrary sleep commands.`
    }
  ],
  successCriteria: [
    'The learner identifies the manually constructed principal ARN as hiding the dependency on aws_iam_role.reader.',
    'The bucket policy principal uses aws_iam_role.reader.arn so Terraform can infer the dependency.',
    'No sleep command or manual apply ordering is introduced.',
    'A final plan/apply creates the IAM role before the dependent bucket policy and completes without the invalid-principal timing failure.'
  ],
  hints: [
    'Look for a value in the bucket policy that represents the IAM role but is written as plain text rather than a Terraform resource reference.',
    'Terraform automatically infers dependencies from expression references; explicit depends_on is mainly for relationships that cannot be expressed through data references.',
    'Replace the hard-coded role ARN with aws_iam_role.reader.arn inside jsonencode so the dependency becomes visible in Terraform’s graph.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why can Terraform attempt the bucket policy before the IAM role is ready?',
      options: [
        { id: 'hidden-hardcoded-dependency', text: 'The policy contains a hard-coded role ARN, so Terraform cannot infer that the bucket policy depends on aws_iam_role.reader.' },
        { id: 'terraform-random', text: 'Terraform always creates resources in a random order regardless of references.' },
        { id: 's3-before-iam', text: 'AWS requires every S3 resource to be created before every IAM resource.' },
        { id: 'missing-state-lock', text: 'A missing state lock prevents Terraform from ordering resources.' }
      ],
      correctOptionId: 'hidden-hardcoded-dependency',
      explanation: 'The bucket reference creates a dependency on the S3 bucket, but the IAM principal is only a literal string, so Terraform sees no graph edge to aws_iam_role.reader.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the preferred correction?',
      options: [
        { id: 'role-reference', text: 'Use aws_iam_role.reader.arn as the policy principal so Terraform infers the dependency automatically.' },
        { id: 'sleep', text: 'Add a 60-second sleep before creating the bucket policy.' },
        { id: 'two-applies', text: 'Tell operators to run terraform apply twice every time.' },
        { id: 'target-only', text: 'Always use -target to create the IAM role first and then run a second apply.' }
      ],
      correctOptionId: 'role-reference',
      explanation: 'A direct expression reference both supplies the correct ARN and tells Terraform that the bucket policy depends on the IAM role.'
    }
  ],
  solution: {
    rootCause: 'The bucket policy represents the IAM role principal with a hard-coded ARN, so Terraform cannot see a dependency between aws_s3_bucket_policy.training and aws_iam_role.reader and may attempt the policy before AWS recognizes the new role.',
    fix: 'Replace the literal principal ARN with aws_iam_role.reader.arn inside the policy expression, rerun terraform plan, and apply to verify Terraform creates the role before the dependent bucket policy.',
    prevention: 'Use Terraform resource references instead of reconstructing managed-resource identifiers manually, and reserve depends_on for genuine hidden behavioral dependencies that cannot be expressed through normal references.'
  }
});
