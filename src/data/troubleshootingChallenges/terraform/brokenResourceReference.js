export default Object.freeze({
  id: 'terraform-broken-resource-reference',
  examId: 'terraform-associate-004',
  order: 11,
  category: 'Terraform Configuration',
  title: 'Repair a Broken Resource Reference',
  difficulty: 'Beginner',
  summary: 'Diagnose a reference that points to a resource name no longer declared in the configuration.',
  scenario: 'A new Terraform configuration defines an application security group and an EC2 instance. During a cleanup, the security group local name was changed from web to app, but terraform validate now fails before planning can begin. This is a new training configuration with no existing state, so no resource-address migration is required.',
  task: 'Use the configuration and validation error to identify the stale reference, repair it to use the declared resource address, and verify that the configuration validates without adding duplicate resources.',
  evidence: [
    {
      id: 'security-group',
      title: 'security.tf',
      kind: 'code',
      content: `resource "aws_security_group" "app" {
  name        = "fa-training-app-sg"
  description = "Application security group"
  vpc_id      = aws_vpc.training.id
}`
    },
    {
      id: 'instance-config',
      title: 'main.tf',
      kind: 'code',
      content: `resource "aws_instance" "app" {
  ami           = "ami-0training123"
  instance_type = "t3.micro"

  vpc_security_group_ids = [
    aws_security_group.web.id
  ]
}`
    },
    {
      id: 'validation-error',
      title: 'terraform validate Output',
      kind: 'code',
      content: `$ terraform validate

╷
│ Error: Reference to undeclared resource
│
│   on main.tf line 6, in resource "aws_instance" "app":
│    6:     aws_security_group.web.id
│
│ A managed resource "aws_security_group" "web" has not been declared
│ in the root module.
╵

Repository note:
The security group was intentionally renamed in configuration from
aws_security_group.web to aws_security_group.app.

This is a new lab with no existing Terraform state.`
    }
  ],
  successCriteria: [
    'The learner identifies aws_security_group.web.id as a stale reference to an undeclared resource name.',
    'The EC2 instance references aws_security_group.app.id.',
    'No duplicate aws_security_group.web resource is introduced merely to satisfy the reference.',
    'A final terraform validate reports that the configuration is valid.'
  ],
  hints: [
    'Compare the resource type and local name declared in security.tf with the address referenced from main.tf.',
    'A Terraform resource reference must use the declared resource type and local resource name before accessing an attribute such as id.',
    'Replace aws_security_group.web.id with aws_security_group.app.id and rerun terraform validate.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What causes the Reference to undeclared resource error?',
      options: [
        { id: 'stale-reference', text: 'main.tf still references aws_security_group.web even though the declared security group is named aws_security_group.app.' },
        { id: 'missing-id', text: 'AWS security groups do not expose an id attribute in Terraform.' },
        { id: 'wrong-file', text: 'Terraform cannot reference resources declared in a different .tf file.' },
        { id: 'provider-auth', text: 'AWS credentials are missing, so Terraform treats the security group as undeclared.' }
      ],
      correctOptionId: 'stale-reference',
      explanation: 'Terraform loads .tf files in the same module together, but the only declared aws_security_group local name is app, while main.tf references web.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the correct repair for this new, state-free configuration?',
      options: [
        { id: 'fix-reference', text: 'Change the instance reference to aws_security_group.app.id and rerun terraform validate.' },
        { id: 'duplicate-web', text: 'Create a second security group named aws_security_group.web just to make the old reference valid.' },
        { id: 'manual-id', text: 'Replace the Terraform reference with a hard-coded security group ID.' },
        { id: 'state-mv', text: 'Run terraform state mv even though this new configuration has no existing state.' }
      ],
      correctOptionId: 'fix-reference',
      explanation: 'The intended security group already exists in configuration under the local name app, so correcting the stale reference is the smallest and clearest fix.'
    }
  ],
  solution: {
    rootCause: 'The security group resource local name was changed to app, but the EC2 resource still references aws_security_group.web.id, which no longer exists in the configuration.',
    fix: 'Change the EC2 security-group reference to aws_security_group.app.id and run terraform validate again to confirm the configuration is internally consistent.',
    prevention: 'Use terraform validate after refactoring resource names and rely on editor reference tools or small reviewed changes so stale addresses are caught immediately.'
  }
});
