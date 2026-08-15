import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../../../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../../../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../../../src/features/followAlongAuthor/authorReview.js';
import { buildStage90ALocalAcceptance } from '../../../../scripts/author-assistant/authorAssistantStage90A.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const sessionId = 'author-assistant-terraform-modules-refactoring-codex-20260815-001';
const programmeId = 'terraform-modules-refactoring-learning-path';
const preparedAt = '2026-08-15T12:00:00.000Z';
const stableStringify = value => Array.isArray(value) ? `[${value.map(stableStringify).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}` : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

function consoleStep(taskId, number, title, instructions, expectedResult, warning = '', blocks = [], sourceIds = []) {
  const id = `${taskId}-console-step-${number}-${slug(title)}`;
  return { id, stepNumber: number, number, title, instruction: instructions[0], instructions: instructions.map((text, index) => ({ id: `${id}-instruction-${index + 1}`, text, detail: '' })), jsonBlocks: blocks.map((block, index) => ({ id: `${id}-json-${index + 1}`, title: block.title, content: block.content, language: block.language || 'text', sourceIds: block.sourceIds || sourceIds })), commands: [], expectedResult, warning, sourceIds };
}
function cliStep(taskId, number, command, explanation, expectedResult, warning = '', sourceIds = []) {
  return { id: `${taskId}-cli-step-${number}`, stepNumber: number, number, command, explanation, expectedResult, instructions: [], commands: [], warning, sourceIds };
}
function verification(taskId, number, title, instruction, expectedResult, mode = 'either') {
  return { id: `${taskId}-verification-${number}`, title, instruction, expectedResult, mode };
}

const iamPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VerifyTrainingIdentity",
      "Effect": "Allow",
      "Action": "sts:GetCallerIdentity",
      "Resource": "*"
    },
    {
      "Sid": "ManageTerraformModuleTrainingVpcs",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc",
        "ec2:DeleteVpc",
        "ec2:ModifyVpcAttribute",
        "ec2:DescribeVpcs",
        "ec2:DescribeVpcAttribute",
        "ec2:DescribeTags",
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeAccountAttributes",
        "ec2:CreateTags",
        "ec2:DeleteTags"
      ],
      "Resource": "*"
    }
  ]
}`;

const versionsTf = `terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}`;

const rootVariablesTf = `variable "aws_region" {
  description = "AWS Region for the training VPCs"
  type        = string
  default     = "eu-west-2"
}

variable "aws_profile" {
  description = "Named AWS CLI profile used only for this lab"
  type        = string
  default     = "fa-terraform-modules"
}`;

const flatMainTf = `resource "aws_vpc" "lab" {
  cidr_block           = "10.60.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name      = "fa-tf-module-primary-vpc"
    ManagedBy = "Terraform"
    Lab       = "fa-terraform-modules"
  }
}`;

const flatOutputsTf = `output "primary_vpc_id" {
  description = "ID of the primary training VPC"
  value       = aws_vpc.lab.id
}`;

const moduleVariablesTf = `variable "name" {
  description = "Name tag for the VPC"
  type        = string

  validation {
    condition     = length(trimspace(var.name)) > 0
    error_message = "The VPC name cannot be empty."
  }
}

variable "cidr_block" {
  description = "Private IPv4 CIDR block for the VPC"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.cidr_block))
    error_message = "cidr_block must be valid IPv4 CIDR notation."
  }
}

variable "lab_name" {
  description = "Tag used to identify this training lab"
  type        = string
  default     = "fa-terraform-modules"
}`;

const moduleMainTf = `resource "aws_vpc" "this" {
  cidr_block           = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name      = var.name
    ManagedBy = "Terraform"
    Lab       = var.lab_name
  }
}`;

const moduleOutputsTf = `output "id" {
  description = "ID of the VPC created by this module"
  value       = aws_vpc.this.id
}

output "cidr_block" {
  description = "CIDR block assigned to the VPC"
  value       = aws_vpc.this.cidr_block
}`;

const refactoredMainTf = `module "primary" {
  source = "./modules/vpc"

  name       = "fa-tf-module-primary-vpc"
  cidr_block = "10.60.0.0/16"
}`;

const firstMovedTf = `moved {
  from = aws_vpc.lab
  to   = module.primary.aws_vpc.this
}`;

const refactoredOutputsTf = `output "primary_vpc_id" {
  description = "ID of the primary training VPC"
  value       = module.primary.id
}`;

const reusableMainTf = `module "primary" {
  source = "./modules/vpc"

  name       = "fa-tf-module-primary-vpc"
  cidr_block = "10.60.0.0/16"
}

module "secondary" {
  source = "./modules/vpc"

  name       = "fa-tf-module-secondary-vpc"
  cidr_block = "10.61.0.0/16"
}`;

const reusableOutputsTf = `output "primary_vpc_id" {
  description = "ID of the primary training VPC"
  value       = module.primary.id
}

output "secondary_vpc_id" {
  description = "ID of the secondary training VPC"
  value       = module.secondary.id
}`;

const renamedMainTf = `module "network" {
  source = "./modules/vpc"

  name       = "fa-tf-module-primary-vpc"
  cidr_block = "10.60.0.0/16"
}

module "secondary" {
  source = "./modules/vpc"

  name       = "fa-tf-module-secondary-vpc"
  cidr_block = "10.61.0.0/16"
}`;

const movedHistoryTf = `moved {
  from = aws_vpc.lab
  to   = module.primary.aws_vpc.this
}

moved {
  from = module.primary
  to   = module.network
}`;

const renamedOutputsTf = `output "primary_vpc_id" {
  description = "ID of the primary training VPC after the module rename"
  value       = module.network.id
}

output "secondary_vpc_id" {
  description = "ID of the secondary training VPC"
  value       = module.secondary.id
}`;

const sourceDefinitions = [
  ['aws-iam-best', 'Security best practices in IAM', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', 'AWS', 'Use temporary non-root training access.'],
  ['aws-cli-config', 'Configure the AWS CLI', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html', 'AWS', 'Create and verify a named training profile.'],
  ['aws-vpc-create', 'Create a VPC', 'https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html', 'AWS', 'Verify the VPCs and their CIDR blocks in the Console.'],
  ['tf-modules', 'Modules overview', 'https://developer.hashicorp.com/terraform/language/modules', 'HashiCorp', 'Explain root and child modules and module reuse.'],
  ['tf-module-syntax', 'The module block', 'https://developer.hashicorp.com/terraform/language/block/module', 'HashiCorp', 'Use source and module input arguments correctly.'],
  ['tf-module-sources', 'Module sources', 'https://developer.hashicorp.com/terraform/language/modules/sources', 'HashiCorp', 'Distinguish local paths from registry module sources.'],
  ['tf-module-develop', 'Developing reusable modules', 'https://developer.hashicorp.com/terraform/language/modules/develop', 'HashiCorp', 'Structure inputs, resources and outputs.'],
  ['tf-refactor-modules', 'Refactor modules', 'https://developer.hashicorp.com/terraform/language/modules/develop/refactoring', 'HashiCorp', 'Move resources into and between modules without replacement.'],
  ['tf-moved', 'The moved block', 'https://developer.hashicorp.com/terraform/language/block/moved', 'HashiCorp', 'Record address changes explicitly.'],
  ['tf-plan', 'Terraform plan command', 'https://developer.hashicorp.com/terraform/cli/commands/plan', 'HashiCorp', 'Review every proposed change before apply.'],
  ['tf-validate', 'Terraform validate command', 'https://developer.hashicorp.com/terraform/cli/commands/validate', 'HashiCorp', 'Validate root and module configuration.'],
  ['tf-destroy', 'Terraform destroy command', 'https://developer.hashicorp.com/terraform/cli/commands/destroy', 'HashiCorp', 'Remove all managed lab infrastructure safely.']
];

const sourceId = key => `source-${key}`;
const phases = [
  ['Prepare a safe workspace', 'Create temporary access and build one flat Terraform-managed VPC from an empty folder.'],
  ['Understand module structure', 'Separate inputs, managed resources and outputs into a reusable child module.'],
  ['Refactor without replacement', 'Move the existing VPC into the module while retaining its physical ID.'],
  ['Reuse and rename safely', 'Create a second module instance and rename the first module without replacing infrastructure.'],
  ['Complete teardown', 'Destroy both VPCs, remove temporary access and delete only the lab files.']
].map(([title, description], index) => ({ id: `phase-${index + 1}-${slug(title)}`, phaseNumber: index + 1, title, description, taskIds: [], isOptional: false }));

const definitions = [
  {
    phase: 1,
    title: 'Create temporary Terraform module training access',
    feature: 'IAM policy, IAM user, AWS CLI profile and isolated folder',
    goal: 'Begin with no lab infrastructure, verify the AWS identity and prepare one empty working folder.',
    why: 'A module refactor can affect existing resources. Confirming identity and an isolated folder prevents accidental changes outside this training lab.',
    sourceKeys: ['aws-iam-best', 'aws-cli-config'],
    blocks: [{ title: 'fa-terraform-modules-training-policy.json', content: iamPolicy, language: 'json' }],
    console: [[
      'Create and verify the training boundary', [
        'Sign in to the training AWS account as an administrator; do not use the root user.',
        'Open the account menu and record the 12-digit account ID as [ACCOUNT_ID].',
        'Use the Region selector to choose Europe (London) eu-west-2.',
        'Open IAM, choose Policies, choose Create policy and then choose JSON.',
        'Replace the policy editor content with the supplied fa-terraform-modules-training-policy JSON.',
        'Choose Next and name the policy fa-terraform-modules-training-policy.',
        'Review that the policy contains only caller identity and VPC training actions, then choose Create policy.',
        'Open IAM Users, choose Create user and enter fa-terraform-modules-user.',
        'Attach fa-terraform-modules-training-policy directly to the temporary user.',
        'Open the user, choose Security credentials and create one CLI access key only if the terminal requires it.',
        'Enter credentials only into the protected AWS CLI prompt; never place them in Terraform, Git, Author or notes.',
        'Open CloudShell, WSL or PowerShell.',
        'CloudShell or WSL: run mkdir -p ~/fa-terraform-modules, then run cd ~/fa-terraform-modules and pwd.',
        'PowerShell: run New-Item -ItemType Directory -Path "$env:USERPROFILE\\fa-terraform-modules" -Force.',
        'PowerShell: run Set-Location "$env:USERPROFILE\\fa-terraform-modules", then run Get-Location.',
        'List the folder and confirm it has no old .tf files, plans or state before continuing.'
      ], 'The temporary user, policy, named profile boundary and empty folder are ready.', 'This is a disposable training identity. An administrator must review the policy before attaching it.'
    ]],
    cli: [
      ['aws configure --profile fa-terraform-modules', 'Store the temporary key, secret, eu-west-2 and json in the AWS CLI configuration.', 'The protected prompt completes without printing the secret.'],
      ['aws sts get-caller-identity --profile fa-terraform-modules', 'Confirm the exact training identity and account.', 'The ARN identifies fa-terraform-modules-user in [ACCOUNT_ID].'],
      ['mkdir -p ~/fa-terraform-modules', 'CloudShell or WSL: create the isolated folder.', 'The folder exists.'],
      ['cd ~/fa-terraform-modules', 'CloudShell or WSL: enter the folder.', 'The terminal enters fa-terraform-modules.'],
      ['pwd', 'CloudShell or WSL: print the current location.', 'The path ends with /fa-terraform-modules.'],
      ['New-Item -ItemType Directory -Path "$env:USERPROFILE\\fa-terraform-modules" -Force', 'PowerShell: create the isolated folder.', 'The folder is displayed.'],
      ['Set-Location "$env:USERPROFILE\\fa-terraform-modules"', 'PowerShell: enter the isolated folder.', 'The working location changes.'],
      ['Get-Location', 'PowerShell: verify the current location.', 'The path ends with fa-terraform-modules.']
    ],
    checks: [
      ['Verify the caller', 'Read the Account and Arn returned by STS.', 'The temporary user and intended account are shown.'],
      ['Verify the clean folder', 'List all files in the current folder.', 'No old Terraform configuration, state or plan is present.']
    ]
  },
  {
    phase: 1,
    title: 'Build and apply one flat VPC configuration',
    feature: 'Root module, provider, variables, resource and output',
    goal: 'Create one VPC directly in the root module and record its physical VPC ID before refactoring.',
    why: 'A learner must understand the original flat configuration before seeing what changes when the resource moves into a child module.',
    sourceKeys: ['aws-vpc-create', 'tf-plan', 'tf-validate'],
    blocks: [
      { title: 'versions.tf', content: versionsTf },
      { title: 'variables.tf', content: rootVariablesTf },
      { title: 'main.tf - initial flat resource', content: flatMainTf },
      { title: 'outputs.tf - initial root output', content: flatOutputsTf }
    ],
    console: [[
      'Create each root configuration file and inspect every block', [
        'Remain in the empty fa-terraform-modules folder.',
        'Create versions.tf and paste the supplied block.',
        'Identify required_version, required_providers and provider aws as three separate responsibilities.',
        'Create variables.tf and paste the supplied root variables.',
        'Notice that aws_region and aws_profile have types, descriptions and safe lab defaults.',
        'Create main.tf and paste the initial flat aws_vpc.lab resource.',
        'Read resource "aws_vpc" "lab" as resource type aws_vpc with local name lab.',
        'Confirm the CIDR is 10.60.0.0/16 and the Name tag is fa-tf-module-primary-vpc.',
        'Create outputs.tf and paste the initial root output.',
        'Notice that aws_vpc.lab.id references the ID created by the resource.',
        'Run terraform fmt, terraform init and terraform validate in that order.',
        'Run terraform plan -out=flat.tfplan and confirm exactly one VPC will be added.',
        'Run terraform show flat.tfplan and verify no resource except aws_vpc.lab appears.',
        'Run terraform apply flat.tfplan only after reviewing the saved plan.',
        'Record the primary_vpc_id output as [PRIMARY_VPC_ID].',
        'Open VPC in eu-west-2 and search for fa-tf-module-primary-vpc.',
        'Open the VPC and verify its ID equals [PRIMARY_VPC_ID], its CIDR is 10.60.0.0/16 and ManagedBy is Terraform.'
      ], 'One VPC exists at root address aws_vpc.lab and its physical ID is recorded.', 'Do not continue unless the plan creates exactly one VPC and nothing else.'
    ]],
    cli: [
      ['terraform fmt', 'Apply standard formatting to all root files.', 'The files are formatted without creating infrastructure.'],
      ['terraform init', 'Install the provider and initialize the working directory.', 'Terraform reports successful initialization.'],
      ['terraform validate', 'Check the root configuration references and syntax.', 'Success! The configuration is valid.'],
      ['terraform plan -out=flat.tfplan', 'Save the exact one-VPC creation plan.', 'Plan: 1 to add, 0 to change, 0 to destroy.'],
      ['terraform show flat.tfplan', 'Read the saved plan before applying it.', 'Only aws_vpc.lab is added.'],
      ['terraform apply flat.tfplan', 'Apply the exact reviewed plan.', 'Apply complete! Resources: 1 added.'],
      ['terraform output primary_vpc_id', 'Display the VPC ID for continuity checks.', 'The command returns [PRIMARY_VPC_ID].'],
      ['terraform state list', 'Inspect the initial root resource address.', 'aws_vpc.lab is listed.']
    ],
    checks: [
      ['Verify the physical VPC', 'Compare Terraform output with the VPC Console ID.', 'Both show [PRIMARY_VPC_ID].'],
      ['Verify the initial state address', 'Run terraform state list.', 'The VPC is tracked as aws_vpc.lab before refactoring.']
    ]
  },
  {
    phase: 2,
    title: 'Build a reusable VPC child module',
    feature: 'Module folder, input variables, managed resource and outputs',
    goal: 'Create a local child module and understand how information flows into and out of it.',
    why: 'A reusable module has a clear interface: inputs enter through variables, resources use those values, and useful results leave through outputs.',
    sourceKeys: ['tf-modules', 'tf-module-syntax', 'tf-module-develop', 'tf-module-sources', 'tf-validate'],
    blocks: [
      { title: 'modules/vpc/variables.tf', content: moduleVariablesTf },
      { title: 'modules/vpc/main.tf', content: moduleMainTf },
      { title: 'modules/vpc/outputs.tf', content: moduleOutputsTf }
    ],
    console: [[
      'Create and understand the child module one file at a time', [
        'Inside fa-terraform-modules, create the folders modules and modules/vpc.',
        'Confirm the final path is fa-terraform-modules/modules/vpc.',
        'Create modules/vpc/variables.tf and paste the supplied module variables.',
        'Read name and cidr_block as required inputs because they have no defaults.',
        'Read lab_name as an optional input because it has a default value.',
        'Inspect the validation blocks and explain that invalid empty names or CIDR text stop before resource creation.',
        'Create modules/vpc/main.tf and paste the supplied VPC resource.',
        'Notice that the resource uses var.cidr_block, var.name and var.lab_name instead of fixed values.',
        'Understand that the local name this is only an internal module address, not an AWS name.',
        'Create modules/vpc/outputs.tf and paste the supplied outputs.',
        'Notice that id and cidr_block expose selected resource attributes to the calling root module.',
        'Run terraform fmt -recursive to format root and child module files.',
        'Run terraform validate and confirm the existing root configuration remains valid.',
        'Do not change main.tf or apply yet; the child module exists but has not been called.',
        'Run terraform plan and confirm Terraform reports no changes because an unused module folder creates nothing.'
      ], 'The local child module has a clear input-resource-output structure but no second resource has been created.', 'Creating module files alone does not call the module. Do not assume the new folder manages the existing VPC yet.'
    ]],
    cli: [
      ['mkdir -p modules/vpc', 'CloudShell or WSL: create the nested child-module folder.', 'modules/vpc exists.'],
      ['New-Item -ItemType Directory -Path ".\\modules\\vpc" -Force', 'PowerShell: create the nested child-module folder.', 'modules\\vpc exists.'],
      ['terraform fmt -recursive', 'Format both root and child module configuration.', 'Terraform formats all .tf files.'],
      ['terraform validate', 'Validate module variable, resource and output expressions.', 'Success! The configuration is valid.'],
      ['terraform plan', 'Confirm an uncalled local module changes no infrastructure.', 'No changes. Your infrastructure matches the configuration.']
    ],
    checks: [
      ['Verify the module interface', 'Identify the three input variables and two outputs without reading the resource internals.', 'The learner can describe what enters and leaves the module.'],
      ['Verify no premature change', 'Review the normal plan before calling the module.', 'Terraform reports no changes.']
    ]
  },
  {
    phase: 3,
    title: 'Move the existing VPC into the module safely',
    feature: 'Module call, moved block and state-address continuity',
    goal: 'Refactor aws_vpc.lab into module.primary.aws_vpc.this without replacing [PRIMARY_VPC_ID].',
    why: 'Moving configuration changes Terraform addresses. A moved block records that relationship so Terraform retains the real object instead of destroying and recreating it.',
    sourceKeys: ['tf-module-syntax', 'tf-refactor-modules', 'tf-moved', 'tf-plan'],
    blocks: [
      { title: 'main.tf - call the primary module', content: refactoredMainTf },
      { title: 'moved.tf - preserve the existing VPC', content: firstMovedTf },
      { title: 'outputs.tf - read the module output', content: refactoredOutputsTf }
    ],
    console: [[
      'Replace the flat resource with a module call and record its move', [
        'Open root main.tf and replace the flat aws_vpc.lab block with the supplied module primary block.',
        'Read source = "./modules/vpc" as a local relative module path.',
        'Confirm name and cidr_block exactly match the existing VPC values.',
        'Create moved.tf in the root folder and paste the first moved block.',
        'Read from = aws_vpc.lab as the old state address.',
        'Read to = module.primary.aws_vpc.this as the new address inside the child module.',
        'Replace outputs.tf with the supplied refactored output.',
        'Notice that the root output now reads module.primary.id rather than reaching directly into the child resource.',
        'Run terraform fmt -recursive and terraform validate.',
        'Run terraform init because the root module now calls a local child module.',
        'Run terraform plan -out=module-refactor.tfplan.',
        'Find the statement showing aws_vpc.lab has moved to module.primary.aws_vpc.this.',
        'Confirm the summary is 0 to add, 0 to change, 0 to destroy.',
        'Stop immediately if the plan proposes replacing or deleting [PRIMARY_VPC_ID].',
        'Run terraform apply module-refactor.tfplan.',
        'Run terraform output primary_vpc_id and confirm [PRIMARY_VPC_ID] is unchanged.',
        'Run terraform state list and confirm the address is now module.primary.aws_vpc.this.',
        'Refresh the VPC Console and confirm the same physical VPC still exists.'
      ], 'The VPC keeps [PRIMARY_VPC_ID] and Terraform tracks it inside module.primary.', 'Never apply this refactor if the saved plan contains an add or destroy action for the primary VPC.'
    ]],
    cli: [
      ['terraform fmt -recursive', 'Format the root module call, moved block and child module.', 'All files are formatted.'],
      ['terraform init', 'Discover and install the local child module.', 'Terraform reports successful initialization.'],
      ['terraform validate', 'Check the refactored configuration.', 'Success! The configuration is valid.'],
      ['terraform plan -out=module-refactor.tfplan', 'Preview the state-address move.', 'Plan: 0 to add, 0 to change, 0 to destroy.'],
      ['terraform show module-refactor.tfplan', 'Inspect the saved refactor plan.', 'The VPC is moved, not replaced.'],
      ['terraform apply module-refactor.tfplan', 'Apply only the verified address move.', 'Apply complete! Resources: 0 added, 0 changed, 0 destroyed.'],
      ['terraform output primary_vpc_id', 'Confirm physical-resource continuity.', 'The output remains [PRIMARY_VPC_ID].'],
      ['terraform state list', 'Inspect the new resource address.', 'module.primary.aws_vpc.this is listed.']
    ],
    checks: [
      ['Verify zero infrastructure changes', 'Read the applied plan summary.', 'It reports 0 added, 0 changed and 0 destroyed.'],
      ['Verify VPC continuity', 'Compare the output and Console with the ID recorded before refactoring.', '[PRIMARY_VPC_ID] is unchanged.'],
      ['Verify the new address', 'Run terraform state list.', 'The VPC appears under module.primary.']
    ]
  },
  {
    phase: 4,
    title: 'Reuse the module to create a second VPC',
    feature: 'Multiple module instances and independent input values',
    goal: 'Call the same module twice with different names and non-overlapping CIDR blocks.',
    why: 'Module reuse is valuable because one tested implementation can create consistent resources while each call supplies different inputs.',
    sourceKeys: ['tf-modules', 'tf-module-syntax', 'tf-plan', 'aws-vpc-create'],
    blocks: [
      { title: 'main.tf - primary and secondary calls', content: reusableMainTf },
      { title: 'outputs.tf - both module results', content: reusableOutputsTf }
    ],
    console: [[
      'Add a second independent module call', [
        'Replace root main.tf with the supplied primary and secondary module calls.',
        'Compare both calls and confirm they use the same source path.',
        'Confirm primary uses 10.60.0.0/16 and secondary uses the non-overlapping 10.61.0.0/16.',
        'Confirm each call supplies a different Name tag.',
        'Keep the existing moved.tf block unchanged.',
        'Replace outputs.tf with the supplied two-output block.',
        'Run terraform fmt -recursive, terraform init and terraform validate.',
        'Run terraform plan -out=reuse.tfplan.',
        'Confirm module.secondary.aws_vpc.this is the only new resource.',
        'Confirm module.primary.aws_vpc.this is unchanged and no resources will be destroyed.',
        'Run terraform apply reuse.tfplan.',
        'Record secondary_vpc_id as [SECONDARY_VPC_ID].',
        'Open VPC in eu-west-2 and verify both named VPCs exist.',
        'Confirm [PRIMARY_VPC_ID] uses 10.60.0.0/16 and [SECONDARY_VPC_ID] uses 10.61.0.0/16.',
        'Confirm both VPCs have ManagedBy = Terraform and Lab = fa-terraform-modules.'
      ], 'Two VPCs created from the same module exist with distinct inputs and IDs.', 'The second CIDR must not overlap the first. Stop if the plan changes or replaces the primary VPC.'
    ]],
    cli: [
      ['terraform fmt -recursive', 'Format both module calls and outputs.', 'All configuration is formatted.'],
      ['terraform init', 'Refresh the local module installation after changing calls.', 'Initialization succeeds.'],
      ['terraform validate', 'Validate both sets of module inputs.', 'Success! The configuration is valid.'],
      ['terraform plan -out=reuse.tfplan', 'Preview one second VPC from the reusable module.', 'Plan: 1 to add, 0 to change, 0 to destroy.'],
      ['terraform show reuse.tfplan', 'Confirm only the secondary module instance is created.', 'Only module.secondary.aws_vpc.this is added.'],
      ['terraform apply reuse.tfplan', 'Apply the reviewed reuse plan.', 'Apply complete! Resources: 1 added.'],
      ['terraform output secondary_vpc_id', 'Record the second module result.', 'The output returns [SECONDARY_VPC_ID].'],
      ['terraform state list', 'List both module-managed resource addresses.', 'primary and secondary VPC addresses are listed.']
    ],
    checks: [
      ['Verify two physical VPCs', 'Compare both Terraform outputs with the VPC Console.', 'Both IDs, names and CIDRs match.'],
      ['Verify one reusable implementation', 'Open both root module calls and the single modules/vpc resource file.', 'Both VPCs use the same child module implementation.']
    ]
  },
  {
    phase: 4,
    title: 'Rename a module without replacing its VPC',
    feature: 'Whole-module moved block and refactoring history',
    goal: 'Rename module.primary to module.network while retaining [PRIMARY_VPC_ID].',
    why: 'Module names often improve as code evolves. Recording the rename prevents a harmless code change from becoming an infrastructure replacement.',
    sourceKeys: ['tf-refactor-modules', 'tf-moved', 'tf-plan'],
    blocks: [
      { title: 'main.tf - renamed primary module', content: renamedMainTf },
      { title: 'moved.tf - retained move history', content: movedHistoryTf },
      { title: 'outputs.tf - renamed module reference', content: renamedOutputsTf }
    ],
    console: [[
      'Rename primary to network and preserve the address history', [
        'Replace root main.tf with the supplied network and secondary module calls.',
        'Confirm only the first module label changed from primary to network.',
        'Keep its source, name and CIDR values exactly unchanged.',
        'Replace moved.tf with the supplied two-block move history.',
        'Understand that the first block records the earlier resource-to-module move.',
        'Understand that the second block records module.primary moving to module.network.',
        'Replace outputs.tf with the supplied output that reads module.network.id.',
        'Run terraform fmt -recursive and terraform validate.',
        'Run terraform plan -out=module-rename.tfplan.',
        'Find the statement showing module.primary has moved to module.network.',
        'Confirm the summary is 0 to add, 0 to change, 0 to destroy.',
        'Stop if either [PRIMARY_VPC_ID] or [SECONDARY_VPC_ID] will be replaced.',
        'Run terraform apply module-rename.tfplan.',
        'Run terraform output primary_vpc_id and confirm it still equals [PRIMARY_VPC_ID].',
        'Run terraform state list and verify module.network.aws_vpc.this and module.secondary.aws_vpc.this.',
        'Refresh VPC and confirm both physical VPC IDs remain unchanged.'
      ], 'The primary module has a clearer name and neither VPC was changed or replaced.', 'Keep published moved blocks unless you deliberately drop support for configurations using the old addresses.'
    ]],
    cli: [
      ['terraform fmt -recursive', 'Format the renamed call and move history.', 'All files are formatted.'],
      ['terraform validate', 'Check all renamed references.', 'Success! The configuration is valid.'],
      ['terraform plan -out=module-rename.tfplan', 'Preview the whole-module address move.', 'Plan: 0 to add, 0 to change, 0 to destroy.'],
      ['terraform show module-rename.tfplan', 'Inspect the saved rename plan.', 'The module address moves without VPC replacement.'],
      ['terraform apply module-rename.tfplan', 'Apply only the reviewed module rename.', 'Apply complete! Resources: 0 added, 0 changed, 0 destroyed.'],
      ['terraform output primary_vpc_id', 'Verify the primary physical ID did not change.', 'The output remains [PRIMARY_VPC_ID].'],
      ['terraform state list', 'Confirm the final state addresses.', 'module.network.aws_vpc.this and module.secondary.aws_vpc.this are listed.']
    ],
    checks: [
      ['Verify the rename plan', 'Read the plan summary and move statement.', 'No infrastructure action was proposed.'],
      ['Verify both VPC IDs', 'Compare outputs and the VPC Console with the recorded IDs.', 'Both physical IDs are unchanged.']
    ]
  },
  {
    phase: 5,
    title: 'Destroy both VPCs and remove the training boundary',
    feature: 'Saved destroy plan, AWS verification, IAM and local cleanup',
    goal: 'Delete every resource and file created by this Follow Along in a controlled order.',
    why: 'A complete Terraform exercise includes a reviewed teardown and verification that no temporary credentials, state or cloud resources remain.',
    sourceKeys: ['tf-destroy', 'tf-plan', 'aws-vpc-create', 'aws-iam-best'],
    console: [[
      'Perform the complete ordered teardown', [
        'Run terraform state list and confirm only module.network.aws_vpc.this and module.secondary.aws_vpc.this are managed.',
        'Run terraform plan -destroy -out=destroy.tfplan.',
        'Run terraform show destroy.tfplan and confirm exactly the two named training VPCs will be destroyed.',
        'Confirm no default VPC or unrelated resource appears.',
        'Run terraform apply destroy.tfplan.',
        'Run terraform state list and confirm no resource addresses remain.',
        'Open VPC in eu-west-2 and verify fa-tf-module-primary-vpc is absent.',
        'Verify fa-tf-module-secondary-vpc is absent.',
        'As the administrator, open IAM and delete the access key from fa-terraform-modules-user.',
        'Detach fa-terraform-modules-training-policy from the temporary user.',
        'Delete fa-terraform-modules-user.',
        'Delete fa-terraform-modules-training-policy.',
        'Remove only the fa-terraform-modules profile from local AWS credentials and config files.',
        'Leave the fa-terraform-modules folder and confirm its exact path before deletion.',
        'Delete only the fa-terraform-modules folder, including its plans, .terraform folder and empty state.',
        'Confirm no named VPC, IAM resource, AWS CLI profile or local lab folder remains.'
      ], 'Both VPCs, the temporary identity, local profile and exact lab folder are removed.', 'Destroy the VPCs through Terraform before deleting credentials or local state. Verify every exact name before deletion.'
    ]],
    cli: [
      ['terraform state list', 'Inventory the final managed resources.', 'Exactly two module VPC addresses are listed.'],
      ['terraform plan -destroy -out=destroy.tfplan', 'Create a saved teardown plan.', 'Plan: 0 to add, 0 to change, 2 to destroy.'],
      ['terraform show destroy.tfplan', 'Inspect both exact deletions.', 'Only the primary and secondary training VPCs appear.'],
      ['terraform apply destroy.tfplan', 'Apply the exact reviewed destroy plan.', 'Apply complete! Resources: 2 destroyed.'],
      ['terraform state list', 'Verify Terraform state is empty.', 'No resource addresses are returned.'],
      ['aws ec2 describe-vpcs --filters Name=tag:Lab,Values=fa-terraform-modules --region eu-west-2 --profile fa-terraform-modules', 'Check for remaining VPCs before removing the profile.', 'The Vpcs array is empty.'],
      ['aws iam delete-access-key --user-name fa-terraform-modules-user --access-key-id <ACCESS_KEY_ID>', 'Administrator route: delete only the temporary access key.', 'The access key is deleted.'],
      ['aws iam detach-user-policy --user-name fa-terraform-modules-user --policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/fa-terraform-modules-training-policy', 'Administrator route: detach the exact policy.', 'The policy is detached.'],
      ['aws iam delete-user --user-name fa-terraform-modules-user', 'Administrator route: delete the empty temporary user.', 'The user is deleted.'],
      ['aws iam delete-policy --policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/fa-terraform-modules-training-policy', 'Administrator route: delete the exact policy.', 'The policy is deleted.']
    ],
    checks: [
      ['Verify AWS cleanup', 'Search VPC and IAM for every exact fa-terraform-modules name.', 'No training VPC, user or policy remains.'],
      ['Verify Terraform cleanup', 'Confirm state list is empty before deleting local files.', 'No managed address remains.'],
      ['Verify local cleanup', 'Check the AWS CLI profile list and filesystem.', 'The named profile and exact lab folder are absent.']
    ]
  }
];

const tasks = definitions.map((definition, index) => {
  const id = `task-terraform-modules-${String(index + 1).padStart(3, '0')}-${slug(definition.title)}`;
  const sourceIds = definition.sourceKeys.map(sourceId);
  const task = {
    id,
    slug: slug(definition.title),
    title: definition.title,
    phaseId: phases[definition.phase - 1].id,
    orderInPhase: phases[definition.phase - 1].taskIds.length + 1,
    feature: definition.feature,
    goal: definition.goal,
    whyItMatters: definition.why,
    difficulty: index < 3 ? 'Easy' : 'Medium',
    estimatedMinutes: null,
    prerequisites: [],
    requiredPermissions: ['Use only the temporary fa-terraform-modules identity and exact named VPC resources.'],
    modeAvailability: {
      console: { status: 'available', reason: 'Complete AWS Console and file-building guidance is included.' },
      cli: { status: 'available', reason: 'Complete Terraform and AWS CLI guidance is included.' }
    },
    sourceIds,
    createdResourceKeys: [],
    consoleSteps: definition.console.map((item, stepIndex) => consoleStep(id, stepIndex + 1, item[0], item[1], item[2], item[3] || '', definition.blocks || [], sourceIds)),
    cliSteps: definition.cli.map((item, stepIndex) => cliStep(id, stepIndex + 1, ...item, sourceIds)),
    verification: definition.checks.map((item, checkIndex) => verification(id, checkIndex + 1, ...item)),
    cleanup: []
  };
  phases[definition.phase - 1].taskIds.push(id);
  return task;
});
for (let index = 1; index < tasks.length; index += 1) tasks[index].prerequisites = [tasks[index - 1].id];

const sources = sourceDefinitions.map(([key, title, url, publisher, purpose]) => {
  const id = sourceId(key);
  return { id, title, url, publisher, sourceType: 'official_documentation', purpose, taskIds: tasks.filter(task => task.sourceIds.includes(id)).map(task => task.id) };
});

const cleanupDescriptions = [
  ['Review the final Terraform inventory', 'Confirm state contains only the two exact module-managed training VPCs.'],
  ['Destroy both training VPCs', 'Apply a saved destroy plan containing only fa-tf-module-primary-vpc and fa-tf-module-secondary-vpc.'],
  ['Verify cloud removal', 'Confirm both exact VPC names are absent in eu-west-2 and Terraform state is empty.'],
  ['Remove temporary IAM access', 'Delete the access key, detach and delete the exact user and training policy.'],
  ['Remove local credentials and files', 'Delete only the fa-terraform-modules profile and verified lab folder.'],
  ['Acknowledge complete cleanup', 'Confirm no VPC, IAM resource, profile, plan, state or local lab file remains.']
];
const cleanup = {
  completionGate: 'acknowledgement',
  manualOnly: true,
  ordering: 'reverse_dependency',
  steps: cleanupDescriptions.map(([title, description], index) => ({ id: `programme-cleanup-${index + 1}`, stepNumber: index + 1, title, instruction: description, description, verification: `Cleanup item ${index + 1} is complete for only the exact lab targets.`, resourceKeys: [], sourceIds: [] }))
};

const authorDraftContent = {
  schema: { profile: 'canonical-follow-along', version: '1.0.0', authorPackageVersion: '1.0.0', sharedContractHash: null, createdWith: 'codex-local-handoff' },
  programme: {
    serviceSlug: 'terraform-modules-refactoring',
    serviceName: 'HashiCorp Terraform on AWS',
    shortName: 'Terraform Modules',
    displayName: 'Terraform Modules and Refactoring Follow Along',
    subtitle: 'Build a reusable module and refactor live infrastructure without replacement.',
    description: 'Start with no lab infrastructure. Build one flat Terraform VPC configuration, create a reusable child module, move the existing VPC into it without replacement, create a second module instance, rename a module safely and remove everything in the correct order.',
    learningOutcome: 'Understand module structure, inputs, outputs, local sources, reuse and moved blocks well enough to refactor Terraform configuration without replacing live infrastructure.',
    programmeId,
    pathId: programmeId,
    componentNamespace: '',
    category: 'Terraform Modules and Refactoring',
    difficulty: 'Beginner to Intermediate',
    estimatedMinutes: null,
    defaultRegion: 'eu-west-2',
    regionScope: 'mixed',
    supportedModes: ['console', 'cli', 'both'],
    publicationVisibility: 'unpublished',
    examId: 'terraform-associate-004'
  },
  sources,
  presentation: { accentColor: '#7c3aed', iconLabel: 'TF3', iconName: 'Blocks', badgeText: 'Terraform Card 3' },
  storage: {},
  progress: { initialTaskId: tasks[0].id, supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
  capabilities: {},
  phases,
  tasks,
  resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: { region: 'eu-west-2' } },
  warnings: {
    cost: 'Amazon VPCs without chargeable attachments normally have no hourly charge. Delete both named training VPCs during the final phase.',
    safety: 'Operate only on fa-tf-module-primary-vpc and fa-tf-module-secondary-vpc. Stop any plan that replaces the primary VPC during a refactor.',
    credentials: 'Never paste passwords, access keys, session tokens, state or plan JSON into Terraform configuration, Author, Git, screenshots or chat.',
    region: 'Use eu-west-2 for both training VPCs. IAM is global. Verify the AWS account before every create or delete action.'
  },
  cleanup,
  extensions: { registrations: [] },
  review: {
    validationStatus: 'passed', validationErrors: [], validationWarnings: [], sourceReviewStatus: 'reviewed', learnerPreviewStatus: 'reviewed', approvalDecision: 'pending', reviewStatus: 'ready_for_approval',
    findings: [
      { id: 'finding-1', findingNumber: 1, section: 'warnings', priority: 'advisory', message: 'An administrator must review the temporary VPC training policy before attachment.', status: 'open' },
      { id: 'finding-2', findingNumber: 2, section: 'instructions', priority: 'advisory', message: 'Every refactor plan must show zero add, change and destroy actions before it is applied.', status: 'open' },
      { id: 'finding-3', findingNumber: 3, section: 'cleanup', priority: 'advisory', message: 'Terraform must destroy both VPCs before temporary credentials, state and local files are removed.', status: 'open' }
    ]
  },
  publication: { publishStatus: 'not_published', targetProgrammeId: programmeId, proposedChanges: [] }
};

const planning = validateAuthorPlanning(authorDraftContent);
const content = validateAuthorContent(authorDraftContent);
const review = validateAuthorReview(authorDraftContent);
if (!planning.valid || !content.valid || !review.valid) {
  console.error(JSON.stringify({ planning, content, review }, null, 2));
  throw new Error('Terraform modules handoff did not pass Author validation.');
}

const summary = {
  phaseCount: phases.length,
  taskCount: tasks.length,
  checkboxCount: tasks.flatMap(task => task.consoleSteps).flatMap(step => step.instructions).length,
  cliCommandCount: tasks.flatMap(task => task.cliSteps).length,
  verificationCheckCount: tasks.flatMap(task => task.verification).length,
  cleanupItemCount: cleanup.steps.length,
  learnerResourceValueCount: 0,
  officialSourceCount: sources.length,
  officialAwsSourceCount: sources.filter(source => source.publisher === 'AWS').length,
  officialTerraformSourceCount: sources.filter(source => source.publisher === 'HashiCorp').length
};
const stageRecords = {
  planning: { stage: '1-5', status: 'prepared_and_reviewed', validation: planning, phases: phases.map(phase => ({ id: phase.id, taskIds: phase.taskIds })) },
  instructions: { stage: '6', status: 'prepared_and_reviewed', checkboxCount: summary.checkboxCount, cliCommandCount: summary.cliCommandCount },
  resourcesAndChecks: { stage: '7', status: 'prepared_and_reviewed', verificationCheckCount: summary.verificationCheckCount, learnerResourceValueCount: 0 },
  cleanup: { stage: '8', status: 'prepared_and_reviewed', cleanupItemCount: summary.cleanupItemCount, ordering: 'reverse_dependency' },
  authoringCheck: { stage: '9', status: 'passed', planningValid: planning.valid, contentValid: content.valid, reviewValid: review.valid },
  learnerPreview: { stage: '10', status: 'reviewed', programmeId, summary },
  structuredReview: { stage: '11', status: 'ready_for_approval', findings: authorDraftContent.review.findings }
};
const acceptedRecordManifest = Object.fromEntries(Object.entries(stageRecords).map(([key, value]) => [key, { algorithm: 'sha256-json-v1', value: fingerprint(value) }]));
const acceptedFingerprintChain = {
  stage6: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.instructions) },
  stage7: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.resourcesAndChecks) },
  stage8: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.cleanup) },
  stage9: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.authoringCheck) },
  stage10: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.learnerPreview) },
  stage11: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.structuredReview) }
};
const handoffPackage = {
  schemaVersion: 1, kind: 'author_local_handoff_package', status: 'awaiting_human_handoff_review', sessionId, preparedAt, generationMode: 'new',
  service: { officialName: 'HashiCorp Terraform on AWS', shortName: 'Terraform Modules' },
  acceptedFingerprintChain, acceptedRecordManifest, authorDraftContent,
  identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'The local Author import must bind the currently signed-in Author and create exactly one private draft.' },
  summary,
  handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false },
  acceptedStagesOneToElevenChanged: false
};
const fingerprintContent = structuredClone(handoffPackage);
delete fingerprintContent.status;
delete fingerprintContent.preparedAt;
handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprint(fingerprintContent) };

const session = {
  schemaVersion: 1, sessionId, status: 'handoff_package_ready_for_review', createdAt: preparedAt,
  inputs: { serviceName: 'HashiCorp Terraform on AWS', shortName: 'Terraform Modules', level: 'Beginner to Intermediate', goal: authorDraftContent.programme.learningOutcome, region: 'eu-west-2' },
  boundaries: { handoffPackagePrepared: true, stage12Prepared: false, authorDraftWritten: false, supabaseConnected: false, awsConnected: false, candidatePrepared: false, published: false }
};
const acceptance = buildStage90ALocalAcceptance({ session, handoffPackage, now: () => new Date('2026-08-15T12:05:00.000Z') });
const preview = [
  'AUTHOR LOCAL HANDOFF PACKAGE - TERRAFORM MODULES AND REFACTORING', '',
  `Programme: ${authorDraftContent.programme.displayName}`, 'Exam: Terraform Associate 004', 'Card: 3',
  `Phases: ${summary.phaseCount}`, `Tasks: ${summary.taskCount}`, `Separate editable checkboxes: ${summary.checkboxCount}`,
  `CLI commands: ${summary.cliCommandCount}`, `Verification checks: ${summary.verificationCheckCount}`, `Cleanup items: ${summary.cleanupItemCount}`,
  `Official AWS sources: ${summary.officialAwsSourceCount}`, `Official HashiCorp sources: ${summary.officialTerraformSourceCount}`,
  `SHA-256 handoff fingerprint: ${handoffPackage.handoffFingerprint.value}`, '', 'PHASES',
  ...phases.map(phase => `${phase.phaseNumber}. ${phase.title}`), '', 'VALIDATION',
  `Planning: ${planning.valid ? 'passed' : 'failed'}`, `Content: ${content.valid ? 'passed' : 'failed'}`, `Structured review: ${review.valid ? 'passed' : 'failed'}`, '',
  'BOUNDARIES', 'Nothing was written to Author, Supabase or AWS by this package builder.', 'No release candidate was created by this package builder.', 'The exact package has a local Step 90A human-acceptance audit.', ''
].join('\n');

await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, 'author-local-handoff-package.json'), `${JSON.stringify(handoffPackage, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'author-local-handoff-acceptance-90a.json'), `${JSON.stringify(acceptance, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'complete-follow-along-preview.txt'), preview, 'utf8');
await fs.writeFile(path.join(directory, 'session.json'), `${JSON.stringify(session, null, 2)}\n`, 'utf8');
console.log(preview);
