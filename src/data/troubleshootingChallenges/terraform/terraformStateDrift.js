export default Object.freeze({
  id: 'terraform-state-drift',
  examId: 'terraform-associate-004',
  order: 3,
  category: 'Terraform state',
  title: 'Reconcile resource drift safely',
  difficulty: 'Intermediate',
  summary: 'Decide how to handle a manual cloud change detected by Terraform.',
  scenario: 'An engineer renamed a Terraform-managed security group in the AWS Console. The configuration still contains the approved name and the next plan detects drift.',
  task: 'Determine whether configuration or the remote object is authoritative, then choose the action that restores the approved name without editing state by hand.',
  evidence: [
    {
      id: 'configuration',
      title: 'security-group.tf',
      kind: 'code',
      content: `resource "aws_security_group" "app" {
  name        = "fa-app-sg"
  description = "Training application security group"
  vpc_id      = aws_vpc.training.id
}`
    },
    {
      id: 'plan',
      title: 'terraform plan',
      kind: 'code',
      content: `Note: Objects have changed outside of Terraform

# aws_security_group.app has changed
~ resource "aws_security_group" "app" {
    ~ name = "temporary-debug-sg" -> "fa-app-sg"
  }

Plan: 0 to add, 1 to change, 0 to destroy.`
    },
    {
      id: 'standard',
      title: 'Naming standard',
      kind: 'text',
      content: 'The approved and required security-group name is fa-app-sg. Console changes are not an approved source of configuration.'
    }
  ],
  successCriteria: [
    'The learner identifies the console rename as drift.',
    'The approved Terraform configuration remains unchanged.',
    'The reviewed plan is applied to restore fa-app-sg.',
    'A subsequent plan reports no changes.'
  ],
  hints: [
    'Compare the remote value shown on the left with the configured value on the right.',
    'The naming standard states which value is authoritative.',
    'Apply the reviewed reconciliation plan, then plan again to verify convergence.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What created the drift?',
      options: [
        { id: 'console', text: 'The managed security group was renamed outside Terraform.' },
        { id: 'provider', text: 'The AWS provider was not installed.' },
        { id: 'backend', text: 'The backend block is missing.' },
        { id: 'module', text: 'The resource is inside a child module.' }
      ],
      correctOptionId: 'console',
      explanation: 'The real resource no longer matches the approved configuration because it was edited outside Terraform.'
    },
    {
      id: 'resolution',
      prompt: 'Which action restores the approved desired state?',
      options: [
        { id: 'apply', text: 'Review and apply the plan that restores fa-app-sg.' },
        { id: 'state-edit', text: 'Open terraform.tfstate and type the new name into it.' },
        { id: 'remove', text: 'Remove the security group from state.' },
        { id: 'accept', text: 'Change the configuration to temporary-debug-sg without approval.' }
      ],
      correctOptionId: 'apply',
      explanation: 'Because the configuration contains the approved name, applying the reviewed plan safely reconciles the remote object with the desired state.'
    }
  ],
  solution: {
    rootCause: 'A manual AWS Console change renamed a Terraform-managed object and created drift.',
    fix: 'Keep the approved configuration, apply the reviewed in-place update, and run another plan to confirm there are no remaining changes.',
    prevention: 'Route infrastructure changes through Terraform and use monitoring or policy controls to detect out-of-band changes.'
  }
});
