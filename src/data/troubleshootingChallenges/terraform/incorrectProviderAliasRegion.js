export default Object.freeze({
  id: 'terraform-incorrect-provider-alias-region',
  examId: 'terraform-associate-004',
  order: 7,
  category: 'Terraform Providers',
  title: 'Repair an Incorrect Provider Alias or Region',
  difficulty: 'Intermediate',
  summary: 'Diagnose why a resource is being created in the wrong AWS Region.',
  scenario: 'A Terraform configuration manages resources in eu-west-2 and us-east-1 using provider aliases. A new S3 replication destination bucket was intended for us-east-1, but the plan shows Terraform will create it in eu-west-2. Existing resources in both Regions are correct and must not be moved.',
  task: 'Use the provider configuration, resource block, and plan evidence to identify why the new bucket is using the wrong provider configuration, correct the resource-to-provider mapping, and verify the plan targets the intended Region without changing unrelated resources.',
  evidence: [
    {
      id: 'provider-config',
      title: 'Provider Configuration',
      kind: 'code',
      content: `provider "aws" {
  region = "eu-west-2"
}

provider "aws" {
  alias  = "use1"
  region = "us-east-1"
}`
    },
    {
      id: 'resource-config',
      title: 'Replication Destination Resource',
      kind: 'code',
      content: `resource "aws_s3_bucket" "replica" {
  bucket = "fa-training-replica-123456789012"
}

Expected Region:
us-east-1

Existing source bucket Region:
eu-west-2`
    },
    {
      id: 'plan-evidence',
      title: 'terraform plan Evidence',
      kind: 'code',
      content: `Terraform will perform the following actions:

  # aws_s3_bucket.replica will be created
  + resource "aws_s3_bucket" "replica" {
      + bucket = "fa-training-replica-123456789012"
      + region = "eu-west-2"
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Approved boundary:
Do not change the default eu-west-2 provider.
Do not move existing resources between Regions.
The new replica bucket must use the aliased us-east-1 provider.`
    }
  ],
  successCriteria: [
    'The learner identifies that the resource is implicitly using the default eu-west-2 provider instead of the aws.use1 alias.',
    'The replica bucket is explicitly associated with provider = aws.use1.',
    'The default provider and existing resources remain unchanged.',
    'A final terraform plan shows the replica bucket targeted for us-east-1 with no unrelated replacements.'
  ],
  hints: [
    'Compare the provider blocks with the resource block and look for an explicit provider selection on the resource.',
    'Resources use the default provider configuration unless Terraform is told to use a specific aliased provider configuration.',
    'Add provider = aws.use1 to the replica bucket resource, then rerun terraform plan and confirm the Region changes to us-east-1.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does Terraform plan to create the replica bucket in eu-west-2?',
      options: [
        { id: 'default-provider-used', text: 'The resource has no provider argument, so it uses the default aws provider configured for eu-west-2.' },
        { id: 'alias-invalid', text: 'Terraform provider aliases cannot be used with AWS resources.' },
        { id: 'bucket-global', text: 'S3 bucket resources always use the Region of the first provider declared.' },
        { id: 'state-region', text: 'Terraform state forces all new resources into the same Region as existing resources.' }
      ],
      correctOptionId: 'default-provider-used',
      explanation: 'The aliased aws.use1 provider exists, but the replica resource does not select it, so Terraform uses the unaliased default provider in eu-west-2.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'assign-alias', text: 'Add provider = aws.use1 to aws_s3_bucket.replica and verify the plan targets us-east-1.' },
        { id: 'change-default', text: 'Change the default aws provider Region to us-east-1 for the entire configuration.' },
        { id: 'duplicate-resource', text: 'Create a second replica resource and leave the incorrect one unchanged.' },
        { id: 'state-edit', text: 'Manually edit the Terraform state file to change the resource Region.' }
      ],
      correctOptionId: 'assign-alias',
      explanation: 'Selecting the existing alias fixes only the intended resource and preserves the correct provider settings for all unrelated resources.'
    }
  ],
  solution: {
    rootCause: 'The replica bucket resource does not specify a provider alias, so Terraform binds it to the default aws provider configured for eu-west-2 instead of aws.use1 in us-east-1.',
    fix: 'Add provider = aws.use1 to aws_s3_bucket.replica, rerun terraform plan, and verify the new bucket is planned for us-east-1 with no unrelated resource changes.',
    prevention: 'Use clear provider alias names and code review checks for every cross-Region resource so resources cannot silently inherit the default provider configuration.'
  }
});
