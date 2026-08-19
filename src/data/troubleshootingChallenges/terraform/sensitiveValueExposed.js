export default Object.freeze({
  id: 'terraform-sensitive-value-exposed',
  examId: 'terraform-associate-004',
  order: 16,
  category: 'Terraform Sensitive Data',
  title: 'Repair an Exposed Sensitive Value',
  difficulty: 'Intermediate',
  summary: 'Diagnose why a sensitive token is being displayed in Terraform output.',
  scenario: 'A Terraform configuration receives an API token through a variable correctly marked sensitive, but a CI log unexpectedly prints the token after terraform apply. The token is required by the managed resource but is not intended to be exposed as a root-module output.',
  task: 'Use the variable and output configuration to identify how the sensitive marking is being removed, make the smallest safe correction, and verify that normal Terraform output no longer reveals the token while acknowledging that sensitive values still require protected state storage.',
  evidence: [
    {
      id: 'sensitive-variable',
      title: 'variables.tf',
      kind: 'code',
      content: `variable "api_token" {
  description = "Token used by the training integration"
  type        = string
  sensitive   = true
}`
    },
    {
      id: 'unsafe-output',
      title: 'outputs.tf',
      kind: 'code',
      content: `output "integration_token" {
  value = nonsensitive(var.api_token)
}`
    },
    {
      id: 'ci-log',
      title: 'CI Apply Log',
      kind: 'code',
      content: `$ terraform apply -auto-approve

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

integration_token = "training-token-example-7f91"

Security requirement:
- The token must not appear in normal plan, apply, or output listings.
- The token does not need to be exposed as a root-module output.
- Terraform state must be treated as sensitive because marking a value sensitive does not remove it from state.`
    }
  ],
  successCriteria: [
    'The learner identifies nonsensitive(var.api_token) as the expression deliberately removing Terraform sensitive-value protection.',
    'The unnecessary integration_token output is removed rather than exposing the token from the root module.',
    'Normal terraform plan, apply, and terraform output listings no longer display the token.',
    'The learner preserves sensitive handling for the input and recognizes that state containing sensitive data still requires access protection.'
  ],
  hints: [
    'The input variable is already marked sensitive, so inspect the expression used by the output block.',
    'nonsensitive tells Terraform to treat a sensitive value as ordinary data, which can allow it to be displayed where normal sensitive propagation would redact it.',
    'Because this token is not required as an output, remove the integration_token output and keep the input marked sensitive; also keep Terraform state protected.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why is the token printed even though var.api_token is declared sensitive?',
      options: [
        { id: 'nonsensitive-removes-mark', text: 'The output calls nonsensitive(var.api_token), explicitly removing Terraform sensitive-value handling from that expression.' },
        { id: 'sensitive-only-hcp', text: 'The sensitive argument works only in HCP Terraform and never affects local CLI output.' },
        { id: 'string-cannot-sensitive', text: 'Terraform cannot mark string variables as sensitive.' },
        { id: 'provider-causes-output', text: 'The AWS provider automatically prints every sensitive variable after apply.' }
      ],
      correctOptionId: 'nonsensitive-removes-mark',
      explanation: 'The variable starts as sensitive, but nonsensitive explicitly tells Terraform to treat the derived value as non-sensitive, allowing the root output to display it.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest correction given that the token does not need to be a root-module output?',
      options: [
        { id: 'remove-output', text: 'Remove the integration_token output, keep api_token marked sensitive, and protect access to Terraform state.' },
        { id: 'keep-nonsensitive', text: 'Keep nonsensitive() and rely on developers not to read CI logs.' },
        { id: 'hardcode-token', text: 'Replace the variable with a hard-coded token in the Terraform configuration.' },
        { id: 'commit-state', text: 'Commit terraform.tfstate to source control so the team can inspect whether the token is present.' }
      ],
      correctOptionId: 'remove-output',
      explanation: 'The token has no required output consumer, so removing the output eliminates the unnecessary display path while preserving Terraform sensitive handling; state still needs secure storage and access controls.'
    }
  ],
  solution: {
    rootCause: 'The root output wraps the sensitive variable in nonsensitive(), which explicitly removes its sensitive marking and causes Terraform to display the token as a normal output value.',
    fix: 'Delete the unnecessary integration_token output, keep api_token declared sensitive, rerun Terraform and verify the token is absent from normal plan, apply, and output listings, and ensure Terraform state is stored with appropriate access controls.',
    prevention: 'Avoid nonsensitive() for secrets unless the derived value is genuinely safe to expose, review outputs for sensitive data, and secure state because sensitive marking redacts display but does not remove values from state.'
  }
});
