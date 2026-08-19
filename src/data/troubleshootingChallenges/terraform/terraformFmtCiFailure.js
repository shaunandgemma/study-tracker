export default Object.freeze({
  id: 'terraform-formatting-ci-failure',
  examId: 'terraform-associate-004',
  order: 9,
  category: 'Terraform Configuration',
  title: 'Repair a Terraform Formatting Failure in CI',
  difficulty: 'Beginner',
  summary: 'Diagnose a CI failure caused by configuration that does not match canonical Terraform formatting.',
  scenario: 'A pull request passes terraform validate locally, but the CI formatting stage fails and blocks the merge. The configuration is syntactically valid and must not be functionally changed just to satisfy the formatting check.',
  task: 'Use the CI output and supplied Terraform file to identify why the formatting stage fails, apply the correct non-functional repair, and verify the same CI check passes without changing resource behaviour.',
  evidence: [
    {
      id: 'ci-output',
      title: 'CI Formatting Step',
      kind: 'code',
      content: `$ terraform fmt -check -recursive

main.tf

Process completed with exit code 3.

Previous step:
$ terraform validate
Success! The configuration is valid.`
    },
    {
      id: 'main-file',
      title: 'main.tf',
      kind: 'code',
      content: `resource "aws_s3_bucket" "training" {
bucket="fa-terraform-training-123456789012"

  tags={
Name="fa-terraform-training"
Environment = "training"
  }
}

output "bucket_name" { value=aws_s3_bucket.training.bucket }`
    },
    {
      id: 'pipeline-policy',
      title: 'Repository Formatting Policy',
      kind: 'text',
      content: 'CI runs terraform fmt -check -recursive and rejects files that differ from Terraform canonical formatting. Functional changes are not required for this incident. Developers should format the configuration with Terraform and commit the resulting formatting-only changes.'
    }
  ],
  successCriteria: [
    'The learner identifies non-canonical Terraform formatting as the reason CI fails despite successful validation.',
    'terraform fmt is run against the configuration and only formatting changes are introduced.',
    'The resource addresses, values, and intended behaviour remain unchanged.',
    'A final terraform fmt -check -recursive completes successfully with exit code 0.'
  ],
  hints: [
    'terraform validate has already passed, so focus on what terraform fmt -check is testing rather than configuration correctness.',
    'terraform fmt rewrites Terraform language files into the canonical style, while -check reports files that would be changed without rewriting them.',
    'Run terraform fmt -recursive, review the formatting-only diff, then rerun terraform fmt -check -recursive.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does CI fail even though terraform validate succeeds?',
      options: [
        { id: 'formatting-diff', text: 'main.tf is valid Terraform syntax but is not formatted according to terraform fmt canonical style.' },
        { id: 'provider-auth', text: 'The AWS provider cannot authenticate to the training account.' },
        { id: 'invalid-resource', text: 'aws_s3_bucket is not a valid Terraform resource type.' },
        { id: 'state-lock', text: 'A remote Terraform state lock is blocking terraform fmt.' }
      ],
      correctOptionId: 'formatting-diff',
      explanation: 'terraform validate confirms the configuration is valid, while terraform fmt -check names main.tf and exits nonzero because formatting changes would be required.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the correct repair?',
      options: [
        { id: 'run-fmt', text: 'Run terraform fmt -recursive, review and commit the formatting-only changes, then rerun terraform fmt -check -recursive.' },
        { id: 'disable-check', text: 'Remove the formatting check from CI so unformatted files can merge.' },
        { id: 'rewrite-resource', text: 'Delete and recreate the S3 resource using different arguments.' },
        { id: 'manual-spaces', text: 'Guess at spacing changes manually without running Terraform formatting.' }
      ],
      correctOptionId: 'run-fmt',
      explanation: 'terraform fmt is the intended tool for producing canonical formatting and resolves the CI failure without changing infrastructure behaviour.'
    }
  ],
  solution: {
    rootCause: 'main.tf is syntactically valid but not written in Terraform canonical formatting, so terraform fmt -check -recursive reports the file and returns a nonzero exit code.',
    fix: 'Run terraform fmt -recursive, review that the diff contains only formatting changes, commit the formatted file, and rerun terraform fmt -check -recursive until it exits successfully.',
    prevention: 'Run terraform fmt before commits or add a pre-commit/editor formatting workflow so canonical formatting is applied before CI performs its check.'
  }
});
