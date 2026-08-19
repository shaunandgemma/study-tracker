export default Object.freeze({
  id: 'terraform-remote-state-access-denied',
  examId: 'terraform-associate-004',
  order: 22,
  category: 'Terraform State',
  title: 'Restore Access to Remote Terraform State',
  difficulty: 'Intermediate',
  summary: 'Diagnose an S3 backend permission failure that prevents Terraform from reading remote state.',
  scenario: 'A Terraform project uses an S3 backend in eu-west-2. The backend initialized successfully on the previous day, but a newly restricted IAM policy now causes terraform plan to fail before resource refresh begins. The backend bucket and state object still exist and must remain in their current locations.',
  task: 'Use the backend configuration, IAM policy, and Terraform error to identify the missing backend permission, restore only the required state access, and verify Terraform can read the existing state without changing the bucket, key, or Region.',
  evidence: [
    {
      id: 'backend-config',
      title: 'backend.tf',
      kind: 'code',
      content: `terraform {
  backend "s3" {
    bucket       = "fa-terraform-state-123456789012"
    key          = "training/network/terraform.tfstate"
    region       = "eu-west-2"
    encrypt      = true
    use_lockfile = true
  }
}`
    },
    {
      id: 'access-error',
      title: 'terraform plan Output',
      kind: 'code',
      content: `$ terraform plan

╷
│ Error: Failed to load state
│
│ Unable to access object
│ "training/network/terraform.tfstate"
│ in S3 bucket "fa-terraform-state-123456789012":
│ operation error S3: GetObject,
│ https response error StatusCode: 403,
│ api error AccessDenied: Access Denied
╵`
    },
    {
      id: 'backend-policy',
      title: 'Current Backend IAM Policy',
      kind: 'code',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::fa-terraform-state-123456789012"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::fa-terraform-state-123456789012/training/network/terraform.tfstate"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::fa-terraform-state-123456789012/training/network/terraform.tfstate.tflock"
    }
  ]
}

Verified backend facts:
- Bucket exists.
- State key exists.
- Region is eu-west-2.
- No KMS customer managed key is used for this state object.`
    }
  ],
  successCriteria: [
    'The learner identifies missing s3:GetObject on the Terraform state object as the immediate cause of the 403 failure.',
    'The backend identity receives s3:GetObject on only the intended state object while the existing lock-file permissions remain available.',
    'The bucket, key, Region, and state object remain unchanged.',
    'A final terraform plan successfully reads the existing remote state and proceeds to normal refresh and planning.'
  ],
  hints: [
    'The error names the exact S3 API operation that was denied, so compare GetObject with the permissions granted on the state object.',
    'An S3 backend needs read and write access to its state object; when S3 lock-file locking is enabled, the .tflock object needs its own required permissions as well.',
    'Add s3:GetObject to the existing state-object statement for training/network/terraform.tfstate, then retry Terraform without changing the backend location.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why can Terraform not load its remote state?',
      options: [
        { id: 'missing-get-object', text: 'The IAM policy allows PutObject but does not allow s3:GetObject on the Terraform state object.' },
        { id: 'wrong-region', text: 'The backend is configured for a different Region from the bucket.' },
        { id: 'missing-state', text: 'The state object does not exist in the configured bucket.' },
        { id: 'missing-lock-delete', text: 'The backend cannot read state because the lock file lacks s3:DeleteObject permission.' }
      ],
      correctOptionId: 'missing-get-object',
      explanation: 'Terraform receives an S3 GetObject AccessDenied for the exact configured state key, and the supplied policy grants no GetObject permission on that object.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'add-state-read', text: 'Add s3:GetObject to the state-object permission for arn:aws:s3:::fa-terraform-state-123456789012/training/network/terraform.tfstate and rerun Terraform.' },
        { id: 's3-admin', text: 'Grant s3:* on every bucket in the account.' },
        { id: 'new-backend', text: 'Create a new state bucket and start with an empty state.' },
        { id: 'local-state', text: 'Remove the S3 backend and recreate the infrastructure from local state.' }
      ],
      correctOptionId: 'add-state-read',
      explanation: 'The backend location is correct and the state exists, so restoring only the missing read action on the intended object resolves the failure without broadening access unnecessarily.'
    }
  ],
  solution: {
    rootCause: 'The backend IAM policy allows s3:PutObject on the state object but omits s3:GetObject, so Terraform receives AccessDenied when it tries to read training/network/terraform.tfstate.',
    fix: 'Add s3:GetObject to the permission scoped to arn:aws:s3:::fa-terraform-state-123456789012/training/network/terraform.tfstate, preserve the existing lock-file permissions, and rerun terraform plan to verify the existing remote state loads successfully.',
    prevention: 'Manage backend permissions as a reviewed least-privilege policy that includes required state read/write actions and the separate lock-file actions whenever S3 state locking is enabled.'
  }
});
