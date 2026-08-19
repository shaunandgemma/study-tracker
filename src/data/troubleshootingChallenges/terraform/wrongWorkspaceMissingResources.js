export default Object.freeze({
  id: 'terraform-wrong-workspace-missing-resources',
  examId: 'terraform-associate-004',
  order: 24,
  category: 'Terraform Workspaces',
  title: 'Recover Resources Hidden by the Wrong Workspace',
  difficulty: 'Intermediate',
  summary: 'Diagnose why Terraform appears to have an empty state after switching workspaces.',
  scenario: 'A learner returns to a Terraform training project that previously managed three SSM parameters. terraform state list now shows no resources, and terraform plan proposes creating all three again. The remote infrastructure still exists and must not be duplicated or imported into a second workspace.',
  task: 'Use the workspace and state evidence to identify why Terraform is looking at an empty state, select the intended existing workspace, and verify the original resources reappear without applying the duplicate-creation plan.',
  evidence: [
    {
      id: 'current-workspace',
      title: 'Current Workspace',
      kind: 'code',
      content: `$ terraform workspace show
development

$ terraform workspace list
  default
* development
  training

$ terraform state list
`
    },
    {
      id: 'duplicate-plan',
      title: 'terraform plan in development',
      kind: 'code',
      content: `Terraform will perform the following actions:

  # aws_ssm_parameter.application will be created
  # aws_ssm_parameter.owner will be created
  # aws_ssm_parameter.purpose will be created

Plan: 3 to add, 0 to change, 0 to destroy.

Existing AWS resources:
- /fa-training/application
- /fa-training/owner
- /fa-training/purpose

Do not apply this duplicate-creation plan.`
    },
    {
      id: 'known-training-state',
      title: 'Previous Training Workspace Record',
      kind: 'code',
      content: `Expected workspace:
training

Last verified training state:
aws_ssm_parameter.application
aws_ssm_parameter.owner
aws_ssm_parameter.purpose

Backend:
S3 remote backend with workspace support

Approved recovery:
Use the existing training workspace.
Do not import the resources into development.
Do not create duplicate resources.`
    }
  ],
  successCriteria: [
    'The learner identifies the selected development workspace as the reason Terraform appears to have an empty unrelated state.',
    'The learner does not apply the three-resource creation plan from development.',
    'terraform workspace select training switches Terraform back to the intended existing workspace.',
    'A final terraform state list shows all three SSM parameter addresses and terraform plan no longer proposes duplicate creation.'
  ],
  hints: [
    'Check the current workspace name before assuming that the state has been lost.',
    'Terraform workspaces associate separate state instances with the same configuration, so switching workspaces can make the same code appear to manage a different set of resources.',
    'Select the existing training workspace and inspect its state before considering imports, recreation, or state recovery.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does Terraform show an empty state and propose creating all three parameters?',
      options: [
        { id: 'wrong-workspace', text: 'The selected workspace is development, which has its own empty state, while the existing resources are tracked in the training workspace.' },
        { id: 'state-deleted', text: 'The remote training state has definitely been deleted.' },
        { id: 'aws-deleted', text: 'The three SSM parameters no longer exist in AWS.' },
        { id: 'provider-cache', text: 'The provider plugin cache hides state resources until terraform init -upgrade is run.' }
      ],
      correctOptionId: 'wrong-workspace',
      explanation: 'The workspace listing shows development selected while a training workspace exists, and the recorded training state contains the exact three resource addresses now appearing as proposed creations.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What should the learner do before any apply or import?',
      options: [
        { id: 'select-training', text: 'Run terraform workspace select training, inspect terraform state list, and rerun terraform plan.' },
        { id: 'apply-development', text: 'Apply the development plan so Terraform recreates the existing resource names.' },
        { id: 'import-development', text: 'Import all three resources into development even though training already tracks them.' },
        { id: 'delete-training', text: 'Delete the training workspace and keep development as the new state.' }
      ],
      correctOptionId: 'select-training',
      explanation: 'The intended state already exists in the training workspace, so selecting it restores the correct Terraform view without duplicating ownership or infrastructure.'
    }
  ],
  solution: {
    rootCause: 'Terraform is currently using the development workspace, whose state is empty. The existing SSM parameters are tracked in the separate training workspace, so the same configuration appears to need three new resources.',
    fix: 'Do not apply the development plan. Run terraform workspace select training, verify terraform state list contains application, owner, and purpose, then rerun terraform plan and confirm the duplicate creations disappear.',
    prevention: 'Include terraform workspace show in operational checks and CI output, use clearly named environments, and verify the selected workspace before plan, apply, import, or state commands.'
  }
});
