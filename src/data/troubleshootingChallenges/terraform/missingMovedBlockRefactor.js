export default Object.freeze({
  id: 'terraform-missing-moved-block-refactor',
  examId: 'terraform-associate-004',
  order: 25,
  category: 'Terraform State Refactoring',
  title: 'Repair a Refactor Missing a moved Block',
  difficulty: 'Intermediate',
  summary: 'Prevent Terraform from destroying and recreating an existing resource that was moved into a child module.',
  scenario: 'A training S3 bucket is already managed by the root module and contains retained lab artifacts. The team refactored the bucket resource into a child module without intending to replace the real bucket. The next plan now proposes destroying the root resource address and creating a new resource under the module.',
  task: 'Use the old state address, new configuration address, and plan evidence to identify the missing refactoring declaration, preserve the existing object under its new Terraform address, and verify the plan no longer proposes replacement.',
  evidence: [
    {
      id: 'previous-address',
      title: 'State Before Refactor',
      kind: 'code',
      content: `$ terraform state list
aws_s3_bucket.artifacts

$ terraform state show aws_s3_bucket.artifacts
# aws_s3_bucket.artifacts:
resource "aws_s3_bucket" "artifacts" {
  bucket = "fa-terraform-artifacts-123456789012"
  id     = "fa-terraform-artifacts-123456789012"
}`
    },
    {
      id: 'refactored-config',
      title: 'Refactored Root Configuration',
      kind: 'code',
      content: `module "storage" {
  source = "./modules/storage"

  bucket_name = "fa-terraform-artifacts-123456789012"
}

# modules/storage/main.tf
resource "aws_s3_bucket" "artifacts" {
  bucket = var.bucket_name
}

Expected new address:
module.storage.aws_s3_bucket.artifacts`
    },
    {
      id: 'destructive-plan',
      title: 'terraform plan After Refactor',
      kind: 'code',
      content: `Terraform will perform the following actions:

  # aws_s3_bucket.artifacts will be destroyed
  - resource "aws_s3_bucket" "artifacts" {
      - bucket = "fa-terraform-artifacts-123456789012"
    }

  # module.storage.aws_s3_bucket.artifacts will be created
  + resource "aws_s3_bucket" "artifacts" {
      + bucket = "fa-terraform-artifacts-123456789012"
    }

Plan: 1 to add, 0 to change, 1 to destroy.

Approved boundary:
The real bucket must remain in place.
This is an address-only refactor.
Do not delete and recreate the bucket.`
    }
  ],
  successCriteria: [
    'The learner identifies that Terraform sees the old root address and new module address as different objects because no move was declared.',
    'A moved block maps aws_s3_bucket.artifacts to module.storage.aws_s3_bucket.artifacts.',
    'The existing physical S3 bucket remains unchanged rather than being destroyed and recreated.',
    'A final terraform plan reports the address move and contains no create or destroy action for the bucket.'
  ],
  hints: [
    'Compare the resource address recorded in state with the address produced by the new child module.',
    'Terraform treats an address change as a different object unless the refactor explicitly records that the old address moved to the new one.',
    'Add a moved block with from = aws_s3_bucket.artifacts and to = module.storage.aws_s3_bucket.artifacts, then rerun terraform plan.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does Terraform propose destroying and recreating the unchanged S3 bucket?',
      options: [
        { id: 'missing-moved-block', text: 'The resource moved from a root address to a child-module address without a moved block linking the old and new addresses.' },
        { id: 'bucket-name-change', text: 'The physical S3 bucket name changed during the refactor.' },
        { id: 'provider-upgrade', text: 'Moving a resource into any module always forces replacement after a provider upgrade.' },
        { id: 'state-lock', text: 'A state lock caused Terraform to duplicate the resource address.' }
      ],
      correctOptionId: 'missing-moved-block',
      explanation: 'The real object and arguments are unchanged, but Terraform currently sees aws_s3_bucket.artifacts and module.storage.aws_s3_bucket.artifacts as unrelated addresses.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction for this address-only refactor?',
      options: [
        { id: 'add-moved-block', text: 'Add a moved block from aws_s3_bucket.artifacts to module.storage.aws_s3_bucket.artifacts and verify the next plan contains no bucket replacement.' },
        { id: 'apply-replacement', text: 'Apply the destroy-and-create plan because Terraform will restore the same bucket name afterward.' },
        { id: 'state-rm', text: 'Remove the old resource from state and let Terraform create another bucket.' },
        { id: 'manual-delete', text: 'Delete the real bucket manually before running Terraform.' }
      ],
      correctOptionId: 'add-moved-block',
      explanation: 'A moved block tells Terraform that the existing object has a new configuration address, preserving the resource without a destructive replacement.'
    }
  ],
  solution: {
    rootCause: 'The S3 resource was moved from aws_s3_bucket.artifacts in the root module to module.storage.aws_s3_bucket.artifacts without a moved block, so Terraform interprets the refactor as removal of one object and creation of another.',
    fix: 'Add moved { from = aws_s3_bucket.artifacts to = module.storage.aws_s3_bucket.artifacts }, rerun terraform plan, and verify Terraform records an address move with no create or destroy action for the physical bucket.',
    prevention: 'Include moved blocks whenever existing managed resources or modules are renamed or relocated, and reject refactoring plans that unexpectedly show destroy-and-create actions for unchanged infrastructure.'
  }
});
