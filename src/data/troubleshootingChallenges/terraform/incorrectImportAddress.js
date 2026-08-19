export default Object.freeze({
  id: 'terraform-incorrect-import-address',
  examId: 'terraform-associate-004',
  order: 26,
  category: 'Terraform Import',
  title: 'Repair an Incorrect Terraform Import Address',
  difficulty: 'Intermediate',
  summary: 'Diagnose an import targeting the wrong resource address inside a child module.',
  scenario: 'An existing S3 bucket must be brought under Terraform management. The bucket configuration lives inside module.storage, but the initial import command targets a root-module address that is not declared. The real bucket must be imported once into the exact configuration address that represents it.',
  task: 'Use the root module call, child resource declaration, and failed import evidence to determine the correct destination address, import the existing bucket without creating a duplicate binding, and verify Terraform plans no replacement.',
  evidence: [
    {
      id: 'root-module',
      title: 'Root main.tf',
      kind: 'code',
      content: `module "storage" {
  source = "./modules/storage"

  bucket_name = "fa-existing-training-assets"
}`
    },
    {
      id: 'child-resource',
      title: 'modules/storage/main.tf',
      kind: 'code',
      content: `variable "bucket_name" {
  type = string
}

resource "aws_s3_bucket" "assets" {
  bucket = var.bucket_name
}

Expected configuration address:
module.storage.aws_s3_bucket.assets`
    },
    {
      id: 'failed-import',
      title: 'Incorrect Import Attempt',
      kind: 'code',
      content: `$ terraform import aws_s3_bucket.assets fa-existing-training-assets

╷
│ Error: resource address "aws_s3_bucket.assets" does not exist in the configuration
│
│ Before importing this resource, please create its configuration
│ in the root module.
╵

State check:
$ terraform state list
<no matching S3 bucket address>

Approved boundary:
Import the existing bucket only once.
Do not create a second root aws_s3_bucket.assets block.
Do not bind the same physical bucket to multiple Terraform addresses.`
    }
  ],
  successCriteria: [
    'The learner identifies that the import target omitted the module.storage path.',
    'The existing bucket is imported to module.storage.aws_s3_bucket.assets.',
    'No duplicate root resource block or second Terraform binding is created.',
    'A final terraform state list shows module.storage.aws_s3_bucket.assets and terraform plan does not propose creating a replacement bucket.'
  ],
  hints: [
    'Compare the address used by terraform import with where the aws_s3_bucket.assets block is actually declared.',
    'Import targets a Terraform resource address, including its full module path when the destination resource is inside a child module.',
    'Use module.storage.aws_s3_bucket.assets as the destination address for fa-existing-training-assets, then inspect state and plan before applying anything.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the import command fail?',
      options: [
        { id: 'missing-module-path', text: 'The command targets aws_s3_bucket.assets in the root module, but the declared destination resource is module.storage.aws_s3_bucket.assets.' },
        { id: 'bucket-private', text: 'Private S3 buckets cannot be imported into Terraform.' },
        { id: 'module-import-unsupported', text: 'Terraform cannot import resources managed by child modules.' },
        { id: 'state-lock-required', text: 'terraform import requires a separate state lock file to be created manually first.' }
      ],
      correctOptionId: 'missing-module-path',
      explanation: 'The configuration contains the bucket resource only inside module.storage, so the root address used in the command does not match any declared destination.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the correct import destination?',
      options: [
        { id: 'correct-module-address', text: 'Import fa-existing-training-assets to module.storage.aws_s3_bucket.assets and verify the resulting state and plan.' },
        { id: 'create-root-copy', text: 'Add another aws_s3_bucket.assets block in the root module and import the same bucket there.' },
        { id: 'import-module-only', text: 'Import the bucket to module.storage without specifying the child resource address.' },
        { id: 'state-push', text: 'Manually edit a state JSON file and push it without using the declared resource address.' }
      ],
      correctOptionId: 'correct-module-address',
      explanation: 'The destination must match the exact resource address declared by the configuration, including the child-module path.'
    }
  ],
  solution: {
    rootCause: 'The import command targets aws_s3_bucket.assets as though the bucket were declared in the root module, but the actual resource address is module.storage.aws_s3_bucket.assets.',
    fix: 'Run the import against module.storage.aws_s3_bucket.assets using the existing bucket identifier fa-existing-training-assets, then verify terraform state list shows that exact address and terraform plan does not propose creating a duplicate bucket.',
    prevention: 'Identify the full configuration address before importing, including module paths and any count or for_each instance keys, and verify the destination is not already bound in state.'
  }
});
