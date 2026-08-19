export default Object.freeze({
  id: 'terraform-missing-module-input',
  examId: 'terraform-associate-004',
  order: 17,
  category: 'Terraform Modules',
  title: 'Repair a Missing Module Input',
  difficulty: 'Beginner',
  summary: 'Diagnose a child module call that omits a required input variable.',
  scenario: 'A root module has been updated to call a reusable security-group child module. terraform plan fails before any infrastructure changes are proposed because the child module requires the target VPC ID and no default is intentionally provided.',
  task: 'Use the child variable definition, root module call, and Terraform error to identify the missing argument, pass the existing VPC value into the module, and verify that planning succeeds without adding a misleading default inside the child module.',
  evidence: [
    {
      id: 'child-variable',
      title: 'modules/security-group/variables.tf',
      kind: 'code',
      content: `variable "vpc_id" {
  description = "VPC where the security group is created"
  type        = string
}

variable "name" {
  description = "Security group name"
  type        = string
}`
    },
    {
      id: 'module-call',
      title: 'main.tf',
      kind: 'code',
      content: `resource "aws_vpc" "training" {
  cidr_block = "10.80.0.0/16"
}

module "app_security_group" {
  source = "./modules/security-group"

  name = "fa-training-app-sg"
}`
    },
    {
      id: 'plan-error',
      title: 'terraform plan Output',
      kind: 'code',
      content: `$ terraform plan

╷
│ Error: Missing required argument
│
│   on main.tf line 5, in module "app_security_group":
│    5: module "app_security_group" {
│
│ The argument "vpc_id" is required, but no definition was found.
╵

Approved requirement:
The child module must receive the ID of aws_vpc.training.
Do not add a default VPC ID to the reusable module.`
    }
  ],
  successCriteria: [
    'The learner identifies vpc_id as a required child-module input omitted from the module call.',
    'The root module passes vpc_id = aws_vpc.training.id to module.app_security_group.',
    'The child variable remains required and no environment-specific VPC ID is hard-coded as its default.',
    'A final terraform plan proceeds past module input validation and uses the training VPC ID.'
  ],
  hints: [
    'Compare the child module variable blocks with the arguments supplied inside module "app_security_group".',
    'A child input variable without a default is required, and the parent module supplies its value as an argument in the module block.',
    'Add vpc_id = aws_vpc.training.id to the module call rather than adding a fixed default inside the reusable child module.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does Terraform report Missing required argument?',
      options: [
        { id: 'missing-vpc-input', text: 'The child module declares vpc_id without a default, but the parent module call does not supply a vpc_id argument.' },
        { id: 'missing-provider', text: 'Every module block must contain a provider argument.' },
        { id: 'vpc-not-applied', text: 'aws_vpc.training must already exist in Terraform state before it can be passed to a child module.' },
        { id: 'wrong-source', text: 'Local modules cannot accept input variables.' }
      ],
      correctOptionId: 'missing-vpc-input',
      explanation: 'The child module makes vpc_id mandatory by declaring it without a default, while the root module supplies only name.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the correct way to supply the required VPC input?',
      options: [
        { id: 'pass-resource-id', text: 'Add vpc_id = aws_vpc.training.id to the app_security_group module block.' },
        { id: 'hardcode-default', text: 'Add a fixed VPC ID as the default value inside the reusable child module.' },
        { id: 'remove-variable', text: 'Delete the child vpc_id variable and let the security group choose a VPC automatically.' },
        { id: 'target-first', text: 'Run terraform apply -target=aws_vpc.training and leave the module argument missing.' }
      ],
      correctOptionId: 'pass-resource-id',
      explanation: 'Passing the root resource reference as the module argument supplies the required input and also creates the appropriate dependency on the VPC.'
    }
  ],
  solution: {
    rootCause: 'The child security-group module declares vpc_id as a required input because it has no default, but the root module call omits that argument.',
    fix: 'Add vpc_id = aws_vpc.training.id to module.app_security_group, leave the child variable required, and rerun terraform plan to verify the module receives the correct VPC ID.',
    prevention: 'Document required module inputs, provide clear variable descriptions, and run terraform validate or terraform plan whenever module interfaces or call sites change.'
  }
});
