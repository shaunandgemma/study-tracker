export default Object.freeze({
  id: 'terraform-data-source-no-results',
  examId: 'terraform-associate-004',
  order: 13,
  category: 'Terraform Data Sources',
  title: 'Repair a Data Source That Returns No Results',
  difficulty: 'Intermediate',
  summary: 'Diagnose a Terraform data source whose filter no longer matches the intended infrastructure.',
  scenario: 'A Terraform configuration is meant to discover an existing training VPC rather than create a new one. terraform plan now fails while reading the VPC data source. The VPC still exists in eu-west-2, but its approved Name tag was changed during a naming-standard update.',
  task: 'Use the data source, provider configuration, and inventory evidence to identify why Terraform finds no matching VPC, correct the lookup without hard-coding a VPC ID, and verify that the intended VPC is discovered.',
  evidence: [
    {
      id: 'data-source',
      title: 'network.tf',
      kind: 'code',
      content: `data "aws_vpc" "training" {
  filter {
    name   = "tag:Name"
    values = ["fa-training-shared-vpc"]
  }
}

output "training_vpc_id" {
  value = data.aws_vpc.training.id
}`
    },
    {
      id: 'plan-error',
      title: 'terraform plan Output',
      kind: 'code',
      content: `$ terraform plan

Planning failed.

╷
│ Error: no matching EC2 VPC found
│
│   with data.aws_vpc.training,
│   on network.tf line 1, in data "aws_vpc" "training":
│    1: data "aws_vpc" "training" {
╵`
    },
    {
      id: 'inventory',
      title: 'Approved AWS Inventory',
      kind: 'code',
      content: `Provider Region:
eu-west-2

Existing VPC:
VPC ID: vpc-0training123
CIDR: 10.70.0.0/16
Name tag: fa-training-network-vpc
Region: eu-west-2

Old Name tag:
fa-training-shared-vpc

Approved boundary:
Keep the data-source lookup.
Do not replace it with a hard-coded VPC ID.`
    }
  ],
  successCriteria: [
    'The learner identifies the stale Name-tag filter as the reason the data source returns no matching VPC.',
    'The lookup filter uses the current approved Name tag fa-training-network-vpc.',
    'The configuration continues discovering the VPC through a data source rather than hard-coding vpc-0training123.',
    'A final terraform plan resolves data.aws_vpc.training.id to vpc-0training123 and proceeds without the no-results error.'
  ],
  hints: [
    'Compare the exact filter value in network.tf with the current Name tag shown in the inventory evidence.',
    'A data source can read existing infrastructure only when its provider settings and lookup arguments match an object returned by the provider.',
    'Change the Name-tag filter from fa-training-shared-vpc to fa-training-network-vpc and rerun terraform plan.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does data.aws_vpc.training return no matching VPC?',
      options: [
        { id: 'stale-name-filter', text: 'The data source filters for the old Name tag fa-training-shared-vpc instead of the current fa-training-network-vpc value.' },
        { id: 'wrong-region', text: 'The provider is configured for a different Region from the existing VPC.' },
        { id: 'data-cannot-vpc', text: 'Terraform data sources cannot discover existing VPCs.' },
        { id: 'state-required', text: 'The VPC must already be stored in this configuration state before a data source can read it.' }
      ],
      correctOptionId: 'stale-name-filter',
      explanation: 'The provider and VPC are both in eu-west-2, but the configured Name-tag value does not match the current tag on vpc-0training123.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'fix-filter', text: 'Update the data-source Name filter to fa-training-network-vpc and verify Terraform resolves the expected VPC ID.' },
        { id: 'hardcode-id', text: 'Delete the data source and hard-code vpc-0training123 everywhere.' },
        { id: 'create-new-vpc', text: 'Create another VPC using the obsolete fa-training-shared-vpc name.' },
        { id: 'remove-filter', text: 'Remove all filters and accept whichever VPC Terraform finds first.' }
      ],
      correctOptionId: 'fix-filter',
      explanation: 'Correcting the stale lookup value preserves the intended discovery design and selects the known existing VPC without embedding its physical ID.'
    }
  ],
  solution: {
    rootCause: 'The aws_vpc data source still filters for the obsolete Name tag fa-training-shared-vpc, while the intended VPC is now tagged fa-training-network-vpc.',
    fix: 'Change the filter value to fa-training-network-vpc, rerun terraform plan, and verify data.aws_vpc.training.id resolves to vpc-0training123.',
    prevention: 'Keep shared-resource naming values in one controlled variable or documented contract and include data-source lookup checks when infrastructure naming standards change.'
  }
});
