export default Object.freeze({
  id: 'terraform-state-command-recovery',
  examId: 'terraform-associate-004',
  order: 27,
  category: 'Terraform State',
  title: 'Recover from an Incorrect Terraform State Command',
  difficulty: 'Advanced',
  summary: 'Recover safely after terraform state rm accidentally removes a valid resource binding.',
  scenario: 'An operator intended to remove an obsolete test resource from Terraform state but accidentally ran terraform state rm against the production training S3 bucket address instead. The command removed only the state binding; the real bucket still exists and contains required training artifacts. No apply has been run since the mistake.',
  task: 'Use the command history, state output, and infrastructure evidence to determine what changed, restore the existing object to its correct Terraform address without recreating or deleting it, and verify the repaired state before any apply.',
  evidence: [
    {
      id: 'command-history',
      title: 'State Command History',
      kind: 'code',
      content: `$ terraform state list
aws_s3_bucket.artifacts
aws_s3_bucket.old_test

$ terraform state rm aws_s3_bucket.artifacts
Removed aws_s3_bucket.artifacts
Successfully removed 1 resource instance(s).

Intended command:
terraform state rm aws_s3_bucket.old_test`
    },
    {
      id: 'after-state-rm',
      title: 'State and Plan After Mistake',
      kind: 'code',
      content: `$ terraform state list
aws_s3_bucket.old_test

$ terraform plan

Terraform will perform the following actions:

  # aws_s3_bucket.artifacts will be created
  + resource "aws_s3_bucket" "artifacts" {
      + bucket = "fa-terraform-artifacts-123456789012"
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do not apply this plan.`
    },
    {
      id: 'real-resource-check',
      title: 'Verified Real Resource',
      kind: 'code',
      content: `Configuration address:
aws_s3_bucket.artifacts

Configured bucket name:
fa-terraform-artifacts-123456789012

Verified AWS inventory:
Bucket fa-terraform-artifacts-123456789012 still exists.
Required training artifacts are still present.

Safety facts:
- terraform state rm removed the Terraform binding, not the real bucket.
- No Terraform apply has occurred since the mistake.
- A state backup from immediately before the command is available.
- The resource configuration still matches the existing bucket.
- Do not delete or recreate the bucket.`
    }
  ],
  successCriteria: [
    'The learner identifies that terraform state rm removed only the Terraform state binding while leaving the real S3 bucket intact.',
    'The learner avoids applying the plan that proposes creating aws_s3_bucket.artifacts as a new object.',
    'The existing bucket is safely rebound to aws_s3_bucket.artifacts using a verified recovery method such as restoring the known-good state backup or importing the existing bucket back to the declared address.',
    'A final terraform state list and terraform plan show the bucket tracked at the correct address with no create or destroy action for it.'
  ],
  hints: [
    'Compare the state list with the verified AWS inventory: the object disappeared from Terraform state but not from AWS.',
    'terraform state rm makes Terraform forget an object without destroying the remote object, so the next plan can treat the still-declared resource as needing creation.',
    'Do not apply the creation plan; restore the known-good binding from the verified backup or import the existing bucket back to aws_s3_bucket.artifacts, then inspect state and plan again.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What did the accidental terraform state rm command actually do?',
      options: [
        { id: 'removed-binding', text: 'It removed the binding between aws_s3_bucket.artifacts and the real bucket from Terraform state while leaving the real bucket intact.' },
        { id: 'deleted-bucket', text: 'It deleted the real S3 bucket and all of its objects from AWS.' },
        { id: 'moved-resource', text: 'It automatically moved the bucket binding to aws_s3_bucket.old_test.' },
        { id: 'changed-config', text: 'It removed the aws_s3_bucket.artifacts resource block from the Terraform configuration.' }
      ],
      correctOptionId: 'removed-binding',
      explanation: 'The bucket still exists in AWS, while terraform state list no longer contains its address, which is the expected result when state rm forgets a managed object.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest recovery before any apply?',
      options: [
        { id: 'restore-binding', text: 'Do not apply the create plan; restore the verified pre-command state backup or import the existing bucket back to aws_s3_bucket.artifacts, then verify state and plan.' },
        { id: 'apply-create', text: 'Run terraform apply so Terraform creates another bucket for the missing state address.' },
        { id: 'delete-real', text: 'Delete the existing bucket manually so the proposed create can succeed.' },
        { id: 'remove-config', text: 'Delete the resource block so Terraform never manages the required bucket again.' }
      ],
      correctOptionId: 'restore-binding',
      explanation: 'The real object is healthy and the mistake affected only Terraform’s binding, so recovery should re-establish that one-to-one association before any infrastructure-changing action.'
    }
  ],
  solution: {
    rootCause: 'The operator accidentally ran terraform state rm aws_s3_bucket.artifacts. Terraform therefore forgot the bucket without deleting it, leaving the configuration declared but no state binding for the still-existing real object.',
    fix: 'Do not apply the proposed creation. Restore the verified state snapshot from immediately before the mistake or import fa-terraform-artifacts-123456789012 back to aws_s3_bucket.artifacts, then confirm the address with terraform state list and ensure terraform plan contains no create or destroy action for the bucket.',
    prevention: 'Back up state before manual state operations, inspect exact resource addresses with terraform state list, use dry-run or review controls where available, and require a second check before state rm or state mv on shared environments.'
  }
});
