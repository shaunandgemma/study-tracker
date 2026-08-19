export default Object.freeze({
  id: 'terraform-backend-reinitialisation-required',
  examId: 'terraform-associate-004',
  order: 21,
  category: 'Terraform Backends',
  title: 'Recover from a Backend Reinitialisation Requirement',
  difficulty: 'Intermediate',
  summary: 'Diagnose an intentional backend change that requires Terraform initialization and state migration.',
  scenario: 'A Terraform project previously stored its state locally. The team has approved moving that existing state into an S3 backend so the configuration can be shared safely. The backend block has been added, but Terraform refuses to plan until the working directory is reinitialized. The existing local state contains three managed resources and must not be abandoned.',
  task: 'Use the backend configuration, current state evidence, and Terraform error to identify the required initialization mode, migrate the existing state into the approved S3 backend, and verify Terraform still sees the same resources afterward.',
  evidence: [
    {
      id: 'backend-config',
      title: 'backend.tf',
      kind: 'code',
      content: `terraform {
  backend "s3" {
    bucket  = "fa-terraform-state-123456789012"
    key     = "training/network/terraform.tfstate"
    region  = "eu-west-2"
    encrypt = true
  }
}`
    },
    {
      id: 'existing-local-state',
      title: 'Existing State Before Backend Change',
      kind: 'code',
      content: `$ terraform state list
aws_ssm_parameter.application
aws_ssm_parameter.owner
aws_ssm_parameter.purpose

Current state location before change:
Local terraform.tfstate

Approved destination:
s3://fa-terraform-state-123456789012/training/network/terraform.tfstate

State migration is approved.
Do not discard the existing state or create an empty remote state.`
    },
    {
      id: 'backend-error',
      title: 'terraform plan Output After Backend Edit',
      kind: 'code',
      content: `$ terraform plan

╷
│ Error: Backend initialization required: please run "terraform init"
│
│ Reason: Initial configuration of the requested backend "s3"
│
│ Changes to backend configuration require reinitialization.
│ Terraform can migrate existing state when the backend changes.
╵

Safety note:
Back up the current local state before migration.
The goal is to preserve all three existing resource bindings.`
    }
  ],
  successCriteria: [
    'The learner identifies that adding the S3 backend requires terraform init to reinitialize the working directory.',
    'The existing local state is backed up before migration.',
    'terraform init -migrate-state is used so the existing state is copied into the approved S3 backend rather than abandoned.',
    'A final terraform state list from the initialized S3-backed configuration still shows all three existing resources and terraform plan does not propose recreating them.'
  ],
  hints: [
    'The error is about backend configuration rather than resource configuration, and the existing local state must be preserved.',
    'terraform init reinitializes backend settings; -migrate-state attempts to copy existing state to the newly configured backend, while -reconfigure deliberately avoids migrating existing state.',
    'Back up the local state, run terraform init -migrate-state, approve the intended migration, then verify the same three addresses are present before planning.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does Terraform refuse to run terraform plan after backend.tf was added?',
      options: [
        { id: 'backend-needs-init', text: 'The working directory was initialized with different backend settings, so the new S3 backend configuration requires terraform init again.' },
        { id: 's3-resource-missing', text: 'Terraform cannot use an S3 backend unless the S3 bucket is also declared as a resource in the same state.' },
        { id: 'state-empty', text: 'The existing local state contains too few resources to migrate.' },
        { id: 'provider-auth', text: 'Every backend configuration error means the AWS provider block is missing credentials.' }
      ],
      correctOptionId: 'backend-needs-init',
      explanation: 'Terraform detects a backend configuration change and requires reinitialization before plan, apply, or state operations can continue normally.'
    },
    {
      id: 'safe-resolution',
      prompt: 'Which recovery preserves the existing local resource bindings while adopting the approved S3 backend?',
      options: [
        { id: 'migrate-state', text: 'Back up the local state, run terraform init -migrate-state, complete the migration, and verify the remote-backed state still contains the same resources.' },
        { id: 'reconfigure-empty', text: 'Run terraform init -reconfigure and intentionally start with an empty S3 state even though existing resource bindings must be preserved.' },
        { id: 'delete-local', text: 'Delete terraform.tfstate before initialization so Terraform cannot detect the old resources.' },
        { id: 'apply-first', text: 'Run terraform apply before initialization to recreate the resources directly in the new backend.' }
      ],
      correctOptionId: 'migrate-state',
      explanation: 'The project is changing from local state to S3 while preserving existing bindings, which is exactly the migration case rather than a clean reconfiguration with no state copy.'
    }
  ],
  solution: {
    rootCause: 'The configuration now declares an S3 backend while the working directory was previously using local state, so Terraform requires backend reinitialization before it can continue.',
    fix: 'Back up the existing local terraform.tfstate, run terraform init -migrate-state, confirm the intended migration into s3://fa-terraform-state-123456789012/training/network/terraform.tfstate, then run terraform state list and terraform plan to verify all three existing resources remain tracked without recreation.',
    prevention: 'Treat backend changes as controlled state operations: back up state first, choose deliberately between migration and reconfiguration, and verify state contents immediately after terraform init before any apply.'
  }
});
