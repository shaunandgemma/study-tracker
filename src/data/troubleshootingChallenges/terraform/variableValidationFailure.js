export default Object.freeze({
  id: 'terraform-variable-validation-failure',
  examId: 'terraform-associate-004',
  order: 10,
  category: 'Terraform Configuration',
  title: 'Repair a Variable Type or Validation Failure',
  difficulty: 'Beginner',
  summary: 'Diagnose an input value rejected by a Terraform variable validation rule.',
  scenario: 'A training environment configuration previously planned successfully, but a new terraform.tfvars change causes terraform plan to stop before any infrastructure changes are proposed. The project intentionally limits the number of training instances to between one and five to control cost.',
  task: 'Use the variable definition, supplied input value, and plan error to identify why Terraform rejects the configuration, correct the input without weakening the validation rule, and verify that planning succeeds.',
  evidence: [
    {
      id: 'variable-definition',
      title: 'variables.tf',
      kind: 'code',
      content: `variable "instance_count" {
  description = "Number of training instances"
  type        = number

  validation {
    condition     = var.instance_count >= 1 && var.instance_count <= 5
    error_message = "instance_count must be between 1 and 5."
  }
}`
    },
    {
      id: 'tfvars-input',
      title: 'terraform.tfvars',
      kind: 'code',
      content: `instance_count = 0`
    },
    {
      id: 'plan-error',
      title: 'terraform plan Output',
      kind: 'code',
      content: `$ terraform plan

╷
│ Error: Invalid value for variable
│
│   on terraform.tfvars line 1:
│    1: instance_count = 0
│
│ instance_count must be between 1 and 5.
│
│ This was checked by the validation rule at variables.tf.
╵

Approved boundary:
The cost-control validation must remain unchanged.
The training deployment requires 2 instances.`
    }
  ],
  successCriteria: [
    'The learner identifies that the supplied value passes the number type requirement but fails the custom validation rule.',
    'instance_count is corrected to the approved value of 2.',
    'The existing validation condition remains unchanged.',
    'A final terraform plan proceeds past variable validation and proposes the expected two training instances.'
  ],
  hints: [
    'Read the custom error message and compare the tfvars value with the allowed numeric range.',
    'A variable can have both a type constraint and a validation rule; satisfying the type does not guarantee that the custom condition passes.',
    'Keep the validation rule and change instance_count from 0 to the approved value 2, then rerun terraform plan.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does Terraform reject instance_count = 0?',
      options: [
        { id: 'validation-range', text: 'The value is a valid number but fails the custom rule requiring instance_count to be between 1 and 5.' },
        { id: 'wrong-type', text: 'Terraform treats every unquoted number in terraform.tfvars as a string.' },
        { id: 'provider-error', text: 'The AWS provider rejects an instance count of zero before Terraform evaluates variables.' },
        { id: 'state-lock', text: 'A state lock prevents Terraform from reading input variables.' }
      ],
      correctOptionId: 'validation-range',
      explanation: 'The value 0 satisfies type = number, but the validation condition requires a value greater than or equal to 1 and less than or equal to 5.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the correct fix under the stated deployment requirement?',
      options: [
        { id: 'set-two', text: 'Set instance_count = 2 and keep the existing validation rule.' },
        { id: 'remove-validation', text: 'Delete the validation block so zero is accepted.' },
        { id: 'change-string', text: 'Change the variable type to string and set instance_count = "0".' },
        { id: 'ignore-error', text: 'Run terraform apply directly because validation applies only to terraform plan.' }
      ],
      correctOptionId: 'set-two',
      explanation: 'The approved deployment needs two instances, and 2 satisfies both the number type and the existing cost-control validation.'
    }
  ],
  solution: {
    rootCause: 'terraform.tfvars sets instance_count to 0. The value has the correct number type, but it fails the custom validation condition requiring a value from 1 through 5.',
    fix: 'Change instance_count to 2, leave the validation block unchanged, and rerun terraform plan to verify Terraform accepts the input and proposes the required two instances.',
    prevention: 'Document accepted input ranges beside example tfvars files and run terraform validate and terraform plan in CI so invalid variable values are caught before apply.'
  }
});
