export default Object.freeze({
  id: 'terraform-destroy-blocked-by-dependencies',
  examId: 'terraform-associate-004',
  order: 28,
  category: 'Terraform Destroy',
  title: 'Recover a Destroy Blocked by Dependencies',
  difficulty: 'Intermediate',
  summary: 'Diagnose a failed targeted destroy that ignores resources still dependent on a VPC.',
  scenario: 'A training VPC and all of its related resources are approved for teardown. An operator tries to remove only the VPC first with a targeted destroy, but AWS rejects the deletion because Terraform-managed subnets, a route table, and a security group still depend on it. No unrelated infrastructure should be deleted manually.',
  task: 'Use the configuration, state, and failed destroy evidence to identify why the VPC cannot be deleted first, choose a Terraform-driven teardown that respects dependencies, and verify the approved training resources are removed without manually deleting unrelated objects.',
  evidence: [
    {
      id: 'managed-resources',
      title: 'Terraform State',
      kind: 'code',
      content: `$ terraform state list
aws_vpc.training
aws_subnet.private
aws_route_table.private
aws_route_table_association.private
aws_security_group.app

Approved teardown scope:
All five resources above belong to the same disposable training environment.
No other workspace resources are approved for deletion.`
    },
    {
      id: 'dependency-config',
      title: 'Relevant Configuration',
      kind: 'code',
      content: `resource "aws_vpc" "training" {
  cidr_block = "10.120.0.0/16"
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.training.id
  cidr_block = "10.120.10.0/24"
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.training.id
}

resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}

resource "aws_security_group" "app" {
  name   = "fa-training-app-sg"
  vpc_id = aws_vpc.training.id
}`
    },
    {
      id: 'failed-destroy',
      title: 'Failed Targeted Destroy',
      kind: 'code',
      content: `$ terraform destroy -target=aws_vpc.training

Terraform will perform the following actions:

  # aws_vpc.training will be destroyed

Plan: 0 to add, 0 to change, 1 to destroy.

Apply complete with error:

Error: deleting EC2 VPC (vpc-0training123):
operation error EC2: DeleteVpc,
api error DependencyViolation:
The vpc 'vpc-0training123' has dependencies and cannot be deleted.

Safety requirement:
Do not manually delete the subnet, route table, association, or security group.
Use Terraform state and its dependency graph for the approved teardown.`
    }
  ],
  successCriteria: [
    'The learner identifies the targeted VPC-only destroy as the reason AWS encounters still-existing dependent resources.',
    'The learner uses a reviewed normal Terraform destroy plan for the approved training environment rather than deleting dependencies manually.',
    'Terraform destroys dependent resources before the VPC according to its dependency graph.',
    'A final terraform state list confirms the approved training resources are gone and no unrelated resources were removed.'
  ],
  hints: [
    'Compare the one-resource targeted destroy plan with the other Terraform-managed resources that reference aws_vpc.training.id.',
    'Terraform builds dependencies from references and normally uses that graph to choose a suitable destruction order; targeting can narrow the operation and bypass the complete teardown plan you actually need.',
    'Review a normal terraform destroy plan for this approved training workspace and let Terraform remove the association, subnet, route table, and security group before the VPC.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the targeted VPC destroy fail with DependencyViolation?',
      options: [
        { id: 'target-left-dependencies', text: 'The command targeted only aws_vpc.training while Terraform-managed resources that still depend on the VPC were left in place.' },
        { id: 'vpc-never-destroyable', text: 'AWS VPCs cannot be destroyed after a subnet has ever been created in them.' },
        { id: 'state-lock', text: 'Terraform state locking prevents AWS from deleting VPCs.' },
        { id: 'provider-version', text: 'The AWS provider version does not support VPC deletion.' }
      ],
      correctOptionId: 'target-left-dependencies',
      explanation: 'The state and configuration show several resources that reference the VPC, while the targeted plan attempts to destroy only the VPC itself.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest Terraform-driven teardown?',
      options: [
        { id: 'normal-destroy', text: 'Review and run a normal terraform destroy for the approved training workspace so Terraform can destroy dependent resources before the VPC.' },
        { id: 'manual-delete', text: 'Delete the subnet and security group manually in AWS, then retry the targeted VPC destroy.' },
        { id: 'state-rm-all', text: 'Remove every resource from Terraform state and leave the real infrastructure running.' },
        { id: 'force-vpc', text: 'Retry the VPC deletion repeatedly until AWS ignores its dependencies.' }
      ],
      correctOptionId: 'normal-destroy',
      explanation: 'A normal destroy gives Terraform the complete managed-resource graph and lets it order destruction safely within the approved scope.'
    }
  ],
  solution: {
    rootCause: 'The operator used terraform destroy -target=aws_vpc.training, producing a plan that attempts to delete the VPC while Terraform-managed subnets, routing resources, and a security group still depend on it, so AWS returns DependencyViolation.',
    fix: 'Review a normal terraform destroy plan for the approved training workspace and let Terraform use its dependency graph to remove the dependent resources before aws_vpc.training, then verify the relevant state is empty.',
    prevention: 'Avoid targeted destroy for normal environment teardown, review the full destroy plan first, and let Terraform manage dependency ordering unless a narrowly scoped recovery operation is specifically required.'
  }
});
