export default Object.freeze({
  id: 'terraform-hcp-dynamic-credentials-failure',
  examId: 'terraform-associate-004',
  order: 31,
  category: 'HCP Terraform',
  title: 'Repair HCP Terraform Dynamic Credentials',
  difficulty: 'Intermediate',
  summary: 'Diagnose an HCP Terraform run that cannot obtain AWS dynamic provider credentials.',
  scenario: 'An HCP Terraform workspace is configured to use AWS workload identity instead of stored AWS access keys. The AWS IAM trust configuration and run-role ARN have already been reviewed, but remote plans fail before Terraform can read any AWS resources. Static credentials must not be added to the workspace.',
  task: 'Use the workspace variables and run error to identify the missing dynamic-credential setting, correct the HCP Terraform environment-variable configuration, and verify a new run authenticates to AWS without storing long-lived credentials.',
  evidence: [
    {
      id: 'workspace-variables',
      title: 'HCP Terraform Workspace Variables',
      kind: 'code',
      content: `Workspace: fa-hcp-terraform-training

Environment variables:
TFC_AWS_RUN_ROLE_ARN = arn:aws:iam::123456789012:role/fa-hcp-terraform-run

Terraform variables:
aws_region = "eu-west-2"

Variable not present:
TFC_AWS_PROVIDER_AUTH

Static AWS variables:
AWS_ACCESS_KEY_ID     = not configured
AWS_SECRET_ACCESS_KEY = not configured`
    },
    {
      id: 'provider-config',
      title: 'Terraform Provider Configuration',
      kind: 'code',
      content: `terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

Approved authentication method:
HCP Terraform dynamic provider credentials using AWS workload identity.
Do not add static access keys to the provider or workspace.`
    },
    {
      id: 'run-error',
      title: 'HCP Terraform Plan Run',
      kind: 'code',
      content: `Run phase: Plan
Workspace: fa-hcp-terraform-training

Planning failed.

Error: No valid credential sources found

with provider["registry.terraform.io/hashicorp/aws"]

Unable to retrieve credentials.

Verified separately:
- AWS run role exists.
- Role ARN matches TFC_AWS_RUN_ROLE_ARN.
- AWS trust policy is already configured for the HCP Terraform workload identity.
- The failure occurs before any AWS resource read succeeds.`
    }
  ],
  successCriteria: [
    'The learner identifies the missing TFC_AWS_PROVIDER_AUTH environment variable as the reason HCP Terraform does not enable AWS dynamic authentication.',
    'TFC_AWS_PROVIDER_AUTH is added as an environment variable with the value true.',
    'TFC_AWS_RUN_ROLE_ARN remains configured for the approved fa-hcp-terraform-run role and no static AWS keys are introduced.',
    'A final HCP Terraform plan authenticates with dynamic credentials and proceeds to normal AWS resource evaluation.'
  ],
  hints: [
    'The run-role ARN is already present, so compare the workspace variables with the settings HCP Terraform needs to enable AWS dynamic provider authentication.',
    'HCP Terraform uses TFC_AWS_PROVIDER_AUTH=true as the signal to attempt AWS dynamic provider credentials for the workspace.',
    'Add TFC_AWS_PROVIDER_AUTH as an environment variable set to true, keep the existing run-role ARN, and start a new plan without adding AWS access keys.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the HCP Terraform run fail to obtain AWS credentials?',
      options: [
        { id: 'missing-provider-auth-flag', text: 'TFC_AWS_PROVIDER_AUTH is missing, so HCP Terraform is not instructed to use AWS dynamic provider credentials.' },
        { id: 'missing-static-keys', text: 'HCP Terraform dynamic credentials still require AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in the workspace.' },
        { id: 'wrong-region', text: 'Dynamic provider authentication works only in us-east-1.' },
        { id: 'provider-needs-profile', text: 'The AWS provider must specify a local shared-credentials profile in every HCP Terraform run.' }
      ],
      correctOptionId: 'missing-provider-auth-flag',
      explanation: 'The run-role ARN and AWS trust are already present, but the required environment variable that enables HCP Terraform AWS dynamic authentication is absent.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'enable-dynamic-auth', text: 'Add environment variable TFC_AWS_PROVIDER_AUTH=true, keep TFC_AWS_RUN_ROLE_ARN, and rerun the plan.' },
        { id: 'add-static-keys', text: 'Store long-lived AWS access keys as workspace environment variables.' },
        { id: 'hardcode-credentials', text: 'Put access_key and secret_key directly in the aws provider block.' },
        { id: 'admin-user', text: 'Create an AWS administrator IAM user specifically for all HCP Terraform runs.' }
      ],
      correctOptionId: 'enable-dynamic-auth',
      explanation: 'Enabling the approved workload-identity flow uses temporary dynamic credentials and avoids introducing long-lived AWS secrets.'
    }
  ],
  solution: {
    rootCause: 'The workspace contains TFC_AWS_RUN_ROLE_ARN but does not define TFC_AWS_PROVIDER_AUTH=true, so HCP Terraform does not activate AWS dynamic provider authentication and the AWS provider has no usable credential source.',
    fix: 'Add TFC_AWS_PROVIDER_AUTH=true as an HCP Terraform environment variable, preserve the approved TFC_AWS_RUN_ROLE_ARN value, start a new plan, and verify the provider authenticates without static AWS credentials.',
    prevention: 'Manage the required HCP Terraform dynamic-credential variables through a reviewed workspace configuration or variable set and validate workload-identity authentication whenever a new workspace is created.'
  }
});
