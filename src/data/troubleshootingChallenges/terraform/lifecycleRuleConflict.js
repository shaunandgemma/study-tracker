export default Object.freeze({
  id: 'terraform-lifecycle-rule-conflict',
  examId: 'terraform-associate-004',
  order: 15,
  category: 'Terraform Lifecycle',
  title: 'Resolve a Terraform Lifecycle Rule Conflict',
  difficulty: 'Intermediate',
  summary: 'Diagnose an approved resource removal blocked by prevent_destroy.',
  scenario: 'A temporary training S3 bucket has reached its approved decommission date and has already been confirmed empty. The bucket resource was originally protected with prevent_destroy = true to guard against accidental deletion. After the resource block is intentionally changed for retirement, Terraform refuses to produce an executable destruction plan.',
  task: 'Use the lifecycle configuration and plan error to identify why the approved teardown is blocked, remove the protection only after confirming the stated safety conditions, and verify that Terraform targets only the intended training bucket for destruction.',
  evidence: [
    {
      id: 'bucket-resource',
      title: 'storage.tf',
      kind: 'code',
      content: `resource "aws_s3_bucket" "temporary" {
  bucket = "fa-training-temporary-123456789012"

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Environment = "training"
    Purpose     = "temporary"
  }
}`
    },
    {
      id: 'plan-error',
      title: 'terraform plan Output',
      kind: 'code',
      content: `Planned change:
aws_s3_bucket.temporary -> destroy

╷
│ Error: Instance cannot be destroyed
│
│ Resource aws_s3_bucket.temporary has lifecycle.prevent_destroy
│ set, but the plan calls for this resource to be destroyed.
│ To avoid this error and continue with the plan, either disable
│ lifecycle.prevent_destroy or reduce the scope of the plan.
╵`
    },
    {
      id: 'decommission-approval',
      title: 'Approved Decommission Check',
      kind: 'text',
      content: 'fa-training-temporary-123456789012 is a disposable training bucket, contains zero objects and zero object versions, and is explicitly approved for removal. No other resource is approved for deletion. Review the next plan before applying it. Do not use manual deletion to bypass Terraform state.'
    }
  ],
  successCriteria: [
    'The learner identifies prevent_destroy = true as the lifecycle rule blocking the approved bucket removal.',
    'The protection is removed or set to false only after confirming the bucket identity, empty state, and approved decommission.',
    'The reviewed Terraform plan contains destruction only for aws_s3_bucket.temporary.',
    'The approved apply removes the bucket through Terraform and the resulting state no longer contains that resource.'
  ],
  hints: [
    'The plan error names the lifecycle rule that Terraform is enforcing before it allows the destructive action.',
    'prevent_destroy intentionally rejects plans that would destroy a protected managed resource; it must be changed deliberately before an approved destruction can proceed.',
    'After verifying the exact empty training bucket and decommission approval, remove prevent_destroy, rerun the plan, and apply only if the plan destroys that one intended resource.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does Terraform refuse the approved bucket destruction?',
      options: [
        { id: 'prevent-destroy', text: 'The resource lifecycle block has prevent_destroy = true, which rejects a plan that would destroy the managed bucket.' },
        { id: 'bucket-not-empty', text: 'Terraform has detected objects in the bucket even though the evidence confirms it is empty.' },
        { id: 'create-before-destroy', text: 'create_before_destroy requires Terraform to make a second bucket before deleting this one.' },
        { id: 'ignore-changes', text: 'ignore_changes prevents Terraform from removing any resource from state.' }
      ],
      correctOptionId: 'prevent-destroy',
      explanation: 'Terraform explicitly reports that lifecycle.prevent_destroy is set while the plan calls for the resource to be destroyed.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective recovery under the approved decommission?',
      options: [
        { id: 'remove-protection-review', text: 'After verifying the exact empty training bucket and approval, remove prevent_destroy, rerun terraform plan, confirm only that bucket will be destroyed, and then apply.' },
        { id: 'manual-delete', text: 'Delete the bucket manually in AWS and leave Terraform state unchanged.' },
        { id: 'force-state-rm', text: 'Remove the bucket from Terraform state and leave the real bucket running.' },
        { id: 'destroy-all', text: 'Run terraform destroy for the entire workspace because one protected resource must be removed.' }
      ],
      correctOptionId: 'remove-protection-review',
      explanation: 'The destruction is explicitly approved, so deliberately removing the lifecycle guard and reviewing the narrow plan preserves Terraform ownership and limits the destructive action to the intended resource.'
    }
  ],
  solution: {
    rootCause: 'The S3 bucket is intentionally protected by lifecycle.prevent_destroy = true, and Terraform is correctly blocking the approved destruction because the lifecycle rule is still active.',
    fix: 'After confirming the exact bucket, its empty state, and the decommission approval, remove or disable prevent_destroy, rerun terraform plan, confirm that only aws_s3_bucket.temporary will be destroyed, and apply the reviewed plan through Terraform.',
    prevention: 'Use prevent_destroy for important resources, but include a documented decommission procedure requiring identity checks, data checks, approval, removal of the lifecycle guard, and a reviewed narrow plan before destruction.'
  }
});
