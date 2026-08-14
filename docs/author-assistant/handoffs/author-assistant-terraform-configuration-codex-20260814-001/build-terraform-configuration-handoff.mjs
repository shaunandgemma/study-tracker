import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../../../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../../../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../../../src/features/followAlongAuthor/authorReview.js';
import { buildStage90ALocalAcceptance } from '../../../../scripts/author-assistant/authorAssistantStage90A.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const sessionId = 'author-assistant-terraform-configuration-codex-20260814-001';
const programmeId = 'terraform-configuration-foundations-learning-path';
const preparedAt = '2026-08-14T23:00:00.000Z';
const stableStringify = value => Array.isArray(value) ? `[${value.map(stableStringify).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}` : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

function consoleStep(taskId, number, title, instructions, expectedResult, warning = '', blocks = [], sourceIds = []) {
  const id = `${taskId}-console-step-${number}-${slug(title)}`;
  return { id, stepNumber: number, number, title, instruction: instructions[0], instructions: instructions.map((text, index) => ({ id: `${id}-instruction-${index + 1}`, text, detail: '' })), jsonBlocks: blocks.map((block, index) => ({ id: `${id}-block-${index + 1}`, title: block.title, content: block.content, language: block.language || 'text', sourceIds: block.sourceIds || sourceIds })), commands: [], expectedResult, warning, sourceIds };
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
      "Sid": "ReadCallerIdentity",
      "Effect": "Allow",
      "Action": "sts:GetCallerIdentity",
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyTerraformStructureLabParameters",
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter",
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:DescribeParameters",
        "ssm:AddTagsToResource",
        "ssm:RemoveTagsFromResource",
        "ssm:DeleteParameter"
      ],
      "Resource": "arn:aws:ssm:eu-west-2:<ACCOUNT_ID>:parameter/fa-terraform-structure/*"
    }
  ]
}`;

const terraformBlock = `terraform {
  required_version = ">= 1.10.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}`;
const providerBlock = `provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}`;
const variablesBlock = `variable "aws_region" {
  description = "AWS Region for the training parameter"
  type        = string
  default     = "eu-west-2"

  validation {
    condition     = var.aws_region == "eu-west-2"
    error_message = "Use eu-west-2 for this Follow Along."
  }
}

variable "aws_profile" {
  description = "Named AWS CLI profile used by Terraform"
  type        = string
  default     = "fa-terraform-structure"
}

variable "environment" {
  description = "Short environment name used in resource names and tags"
  type        = string
  default     = "training"
}

variable "parameter_values" {
  description = "Harmless configuration values to create in Parameter Store"
  type        = map(string)
  default = {
    application = "study-tracker"
    owner       = "learner"
  }
}`;
const localsBlock = `locals {
  name_prefix = "/fa-terraform-structure/\${var.environment}"

  common_tags = {
    ManagedBy   = "Terraform"
    FollowAlong = "0"
    Environment = var.environment
  }
}`;
const dataBlock = `data "aws_caller_identity" "current" {}`;
const resourceBlock = `resource "aws_ssm_parameter" "training" {
  for_each = var.parameter_values

  name        = "\${local.name_prefix}/\${each.key}"
  description = "Terraform structure lesson value for \${each.key}"
  type        = "String"
  value       = each.value
  tags        = local.common_tags
}`;
const outputsBlock = `output "parameter_names" {
  description = "Names of the parameters created by this configuration"
  value       = values(aws_ssm_parameter.training)[*].name
}

output "verified_account_id" {
  description = "AWS account Terraform read through the data source"
  value       = data.aws_caller_identity.current.account_id
}`;
const tfvarsBlock = `environment = "training"

parameter_values = {
  application = "study-tracker"
  owner       = "learner"
  purpose     = "terraform-structure-practice"
}`;

const sourceDefinitions = [
  ['tf-language', 'Terraform configuration language overview', 'https://developer.hashicorp.com/terraform/language', 'HashiCorp', 'Explain declarative configuration, blocks, arguments and expressions.'],
  ['tf-syntax', 'Terraform configuration syntax', 'https://developer.hashicorp.com/terraform/language/syntax/configuration', 'HashiCorp', 'Explain block types, labels, bodies, arguments, identifiers and comments.'],
  ['tf-files', 'Terraform files and configuration structure', 'https://developer.hashicorp.com/terraform/language/files', 'HashiCorp', 'Explain how Terraform combines .tf files in one working directory.'],
  ['tf-provider', 'Terraform provider configuration', 'https://developer.hashicorp.com/terraform/language/providers/configuration', 'HashiCorp', 'Explain provider blocks and provider configuration.'],
  ['tf-variables', 'Terraform variable block reference', 'https://developer.hashicorp.com/terraform/language/block/variable', 'HashiCorp', 'Explain input variables, types, defaults, descriptions and validation.'],
  ['tf-locals', 'Simplify Terraform configuration with locals', 'https://developer.hashicorp.com/terraform/tutorials/configuration-language/locals', 'HashiCorp', 'Explain reusable local values and expressions.'],
  ['tf-resource', 'Terraform resource block reference', 'https://developer.hashicorp.com/terraform/language/block/resource', 'HashiCorp', 'Explain resource type, local label, arguments, attributes and dependencies.'],
  ['tf-data', 'Terraform data block reference', 'https://developer.hashicorp.com/terraform/language/block/data', 'HashiCorp', 'Explain reading information without managing it.'],
  ['tf-outputs', 'Terraform output block reference', 'https://developer.hashicorp.com/terraform/language/block/output', 'HashiCorp', 'Explain exposing useful values from a configuration.'],
  ['tf-expressions', 'Terraform expressions overview', 'https://developer.hashicorp.com/terraform/language/expressions', 'HashiCorp', 'Explain references, collections, for_each, each.key and each.value.'],
  ['tf-cli-code', 'Format and validate Terraform configuration', 'https://developer.hashicorp.com/terraform/cli/code', 'HashiCorp', 'Use fmt, validate and console while constructing configuration.'],
  ['tf-plan', 'Terraform plan command', 'https://developer.hashicorp.com/terraform/cli/commands/plan', 'HashiCorp', 'Read a saved execution plan before applying.'],
  ['tf-apply', 'Terraform apply command', 'https://developer.hashicorp.com/terraform/cli/commands/apply', 'HashiCorp', 'Apply only a reviewed saved plan.'],
  ['tf-destroy', 'Terraform destroy command', 'https://developer.hashicorp.com/terraform/cli/commands/destroy', 'HashiCorp', 'Remove managed training resources safely.'],
  ['aws-iam', 'Security best practices in IAM', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', 'AWS', 'Use non-root temporary or dedicated training access and least privilege.'],
  ['aws-cli', 'Configure the AWS CLI', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html', 'AWS', 'Create and verify a named local AWS CLI profile.'],
  ['aws-ssm', 'Creating a Parameter Store parameter using the console', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-create-console.html', 'AWS', 'Verify the exact parameters and tags Terraform creates.'],
  ['aws-ssm-life', 'Working with Parameter Store', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-working-with.html', 'AWS', 'Understand and verify the parameter lifecycle.'],
  ['aws-ssm-resource', 'Terraform resources overview', 'https://developer.hashicorp.com/terraform/language/resources', 'HashiCorp', 'Use the official Terraform resource model for the managed resource.']
];
const sourceId = key => `source-${key}`;
const phases = [
  ['Read Terraform before writing it', 'Learn the anatomy of HCL and create a safe empty working directory.'],
  ['Build the configuration foundations', 'Construct Terraform, provider and variable blocks one piece at a time.'],
  ['Connect values and resources', 'Use locals, a data source, references and for_each to form a dependency graph.'],
  ['Plan, apply and observe', 'Predict, inspect, apply and verify the completed configuration.'],
  ['Change and reason about configuration', 'Make one controlled input change and explain the resulting plan.'],
  ['Destroy and review', 'Remove only the training resources and reconstruct the configuration structure from memory.']
].map(([title, description], index) => ({ id: `phase-${index + 1}-${slug(title)}`, phaseNumber: index + 1, title, description, taskIds: [], isOptional: false }));

const definitions = [
  {
    phase: 1, title: 'Recognise Terraform blocks, arguments and expressions', feature: 'HCL reading skills',
    goal: 'Read small HCL examples and identify what each symbol means before creating infrastructure.',
    why: 'A learner who can label the structure can safely edit and troubleshoot Terraform instead of treating configuration as a script to copy.', sourceKeys: ['tf-language', 'tf-syntax'],
    console: [['Read and label a small Terraform example', [
      'Open the supplied HCL anatomy example in the large code box.',
      'Identify resource as the block type.',
      'Identify aws_ssm_parameter as the provider resource type.',
      'Identify example as Terraform’s local label for this resource.',
      'Identify the opening and closing braces as the block body.',
      'Identify name, type and value as arguments because each assigns an expression with an equals sign.',
      'Identify the quoted values as string literal expressions.',
      'Read the comment beginning with # and confirm it changes no infrastructure.',
      'Say the full Terraform address aloud: aws_ssm_parameter.example.',
      'Do not run this example yet; this task is about reading its structure.'
    ], 'The learner can distinguish a block type, labels, body, arguments, literal expressions, comments and a Terraform address.', '', [{ title: 'HCL anatomy example — read only', language: 'text', content: `# resource is the block type\nresource "aws_ssm_parameter" "example" {\n  name  = "/example/name"\n  type  = "String"\n  value = "hello"\n}` }]]],
    cli: [
      ['terraform version', 'Check that Terraform is installed before creating configuration.', 'Terraform displays its version and platform.'],
      ['terraform console', 'Open Terraform’s expression console; no AWS resource is created.', 'The prompt changes to >.'],
      ['"hello"', 'Evaluate a string literal expression.', 'Terraform returns "hello".'],
      ['2 + 3', 'Evaluate a numeric expression.', 'Terraform returns 5.'],
      ['{ environment = "training", managed_by = "Terraform" }', 'Evaluate an object expression and observe its keys and values.', 'Terraform prints an object with two string attributes.'],
      ['exit', 'Leave the Terraform expression console.', 'The normal terminal prompt returns.']
    ], checks: [['Explain the syntax', 'Point to every block, label, argument and expression in the supplied example.', 'Each structural element is identified correctly.'], ['Explain declarative intent', 'Describe the desired end state expressed by the example.', 'One String parameter should exist with the specified name and value.']]
  },
  {
    phase: 1, title: 'Create a clean working folder and safe AWS identity', feature: 'Folder, identity and permission boundary',
    goal: 'Start from no lab infrastructure, create or use approved non-root training access, and enter one empty project folder.',
    why: 'Terraform loads every .tf file in the current directory, so identity, Region and folder mistakes can change the wrong resources.', sourceKeys: ['tf-files', 'aws-iam', 'aws-cli'],
    console: [['Prepare the exact training boundary', [
      'Sign in to the training AWS account as an administrator or approved temporary administrative role; do not use the root user.',
      'Open the account menu and record the 12-digit account ID as [ACCOUNT_ID].',
      'Use the Region selector to choose Europe (London) eu-west-2.',
      'Open IAM, choose Policies, choose Create policy, then choose JSON.',
      'Paste the supplied fa-terraform-structure-training-policy JSON.',
      'Replace <ACCOUNT_ID> with the recorded account ID and change nothing else.',
      'Choose Next and name it fa-terraform-structure-training-policy.',
      'Have an administrator review the exact actions and /fa-terraform-structure/* resource boundary before creating it.',
      'Attach it only to an approved temporary role or the temporary user fa-terraform-structure-user.',
      'If local credentials are required, create one access key for that temporary identity and place it only into the protected AWS CLI prompt.',
      'Open CloudShell, or open PowerShell on the local computer.',
      'Create a folder named fa-terraform-structure using the command for the selected terminal.',
      'Enter that folder and display its full path.',
      'List its contents and remove nothing; if old .tf or state files exist, stop and use a new empty folder.'
    ], 'The terminal is inside one empty fa-terraform-structure folder and the caller is a non-root approved training identity.', 'Never paste access keys into Terraform, Author, Git, screenshots or chat.', [{ title: 'fa-terraform-structure-training-policy.json', language: 'json', content: iamPolicy }]]],
    cli: [
      ['aws configure --profile fa-terraform-structure', 'Local PowerShell only: save the temporary key, eu-west-2 and json in a named AWS CLI profile.', 'The protected prompts complete without printing the secret.'],
      ['aws sts get-caller-identity --profile fa-terraform-structure', 'Verify the exact account and non-root caller.', 'The account equals [ACCOUNT_ID] and the ARN is the approved training identity.'],
      ['mkdir -p ~/fa-terraform-structure', 'CloudShell: create the project folder.', 'The folder exists.'],
      ['cd ~/fa-terraform-structure', 'CloudShell: enter the project folder.', 'The terminal changes directory.'],
      ['pwd', 'CloudShell: display the current path.', 'The path ends with /fa-terraform-structure.'],
      ['New-Item -ItemType Directory -Path "$env:USERPROFILE\\fa-terraform-structure" -Force', 'PowerShell: create the project folder.', 'PowerShell displays the directory.'],
      ['Set-Location "$env:USERPROFILE\\fa-terraform-structure"', 'PowerShell: enter the project folder.', 'The current location changes.'],
      ['Get-Location', 'PowerShell: display the current path.', 'The path ends with fa-terraform-structure.']
    ], checks: [['Verify caller and Region', 'Read the caller account and confirm the selected Region is eu-west-2.', 'The exact safe identity boundary is understood.'], ['Verify folder isolation', 'List the folder and confirm it contains no .tf, .tfvars, state or plan files.', 'Terraform will load no unexpected configuration.']]
  },
  {
    phase: 2, title: 'Build terraform and provider blocks gradually', feature: 'versions.tf and providers.tf',
    goal: 'Create the first two files by adding and explaining one block at a time.',
    why: 'Version constraints protect compatibility, while provider configuration tells Terraform which plugin and AWS context to use.', sourceKeys: ['tf-files', 'tf-provider', 'tf-cli-code'],
    console: [['Construct versions.tf', [
      'Create an empty file named versions.tf in the project folder.',
      'Type terraform followed by an opening brace, press Enter, then add the matching closing brace.',
      'Inside that body, add required_version = ">= 1.10.0".',
      'Explain that required_version constrains Terraform CLI, not the AWS provider.',
      'Inside the terraform body, add the required_providers block.',
      'Inside required_providers, add the aws block with source and version arguments exactly as supplied.',
      'Explain that source selects the provider and version constrains compatible releases.',
      'Save versions.tf, compare it with the finished reference, then run terraform fmt.',
      'Run terraform init and identify the new .terraform directory and .terraform.lock.hcl file.',
      'Explain that the lock file records selected provider versions and should normally be committed, while .terraform should not.'
    ], 'versions.tf is formatted, the AWS provider initializes and the dependency lock file exists.', '', [{ title: 'Finished versions.tf reference', language: 'text', content: terraformBlock }]], ['Construct providers.tf', [
      'Create an empty file named providers.tf.',
      'Add provider "aws" followed by an opening and closing brace.',
      'Explain that aws is the provider’s local name in this configuration.',
      'Inside the block, add region = var.aws_region.',
      'Add profile = var.aws_profile on the next line.',
      'Notice that var.aws_region and var.aws_profile are references, not quoted text.',
      'Save the file and run terraform fmt.',
      'Run terraform validate and read the errors about undeclared variables; this is expected because the referenced variable blocks do not exist yet.',
      'Do not replace the references with hard-coded values; the next task will declare them.'
    ], 'providers.tf contains two variable references and the learner understands why validation is not complete yet.', 'The temporary validation error is intentional and is resolved in the next task.', [{ title: 'Finished providers.tf reference', language: 'text', content: providerBlock }]]],
    cli: [
      ['terraform fmt', 'Format the new Terraform block.', 'Terraform formats versions.tf when required.'],
      ['terraform init', 'Install the constrained AWS provider and create its lock file.', 'Terraform reports successful initialization.'],
      ['terraform providers', 'See which provider the root configuration requires.', 'registry.terraform.io/hashicorp/aws is listed.'],
      ['terraform fmt', 'Format providers.tf after adding the provider block.', 'Both files use canonical formatting.'],
      ['terraform validate', 'Observe the useful undeclared-variable errors before the variables are added.', 'Terraform names aws_region and aws_profile as undeclared input variables.']
    ], checks: [['Explain both version constraints', 'Describe the difference between required_version and required_providers.aws.version.', 'The learner distinguishes Terraform CLI compatibility from provider compatibility.'], ['Inspect generated files', 'List hidden files and identify .terraform and .terraform.lock.hcl.', 'The learner knows which generated item is normally committed.']]
  },
  {
    phase: 2, title: 'Declare typed input variables and validation', feature: 'variables.tf and values',
    goal: 'Replace unexplained hard-coded settings with typed, described and validated inputs.',
    why: 'Variables form the input interface to a root module and allow controlled reuse without editing resource blocks.', sourceKeys: ['tf-variables', 'tf-cli-code'],
    console: [['Construct variables.tf one variable at a time', [
      'Create an empty file named variables.tf.',
      'Add only the aws_region variable block with its description, type and default.',
      'Explain that type = string rejects incompatible values and default makes the variable optional.',
      'Add the validation block inside aws_region.',
      'Explain that condition must be true and error_message tells the learner how to correct an invalid value.',
      'Save, run terraform fmt, then run terraform validate; the aws_profile error should remain.',
      'Add the aws_profile variable block and validate again.',
      'Add the environment variable block and explain how it will later affect names and tags.',
      'Add parameter_values as map(string).',
      'Explain that a map has unique keys and that every value must be a string.',
      'Type the two supplied default map entries carefully, including the comma between entries.',
      'Save, format and validate the complete file.',
      'Compare your file with the finished reference only after it validates.'
    ], 'variables.tf declares four documented typed inputs and terraform validate succeeds.', '', [{ title: 'Finished variables.tf reference', language: 'text', content: variablesBlock }]], ['Test how variable values enter the configuration', [
      'Create terraform.tfvars only after understanding the variable defaults.',
      'Add environment = "training".',
      'Add the parameter_values map with application, owner and purpose entries.',
      'Explain that terraform.tfvars overrides matching defaults automatically.',
      'Confirm this file contains no password, access key or secret.',
      'Save it and compare it with the supplied reference.',
      'Run terraform validate again.',
      'Run terraform console, evaluate var.environment and then var.parameter_values, and leave with exit.'
    ], 'The learner can explain defaults, overrides, type constraints and validation.', '', [{ title: 'terraform.tfvars', language: 'text', content: tfvarsBlock }]]],
    cli: [
      ['terraform fmt', 'Format variables.tf after each meaningful addition.', 'Terraform aligns the file.'],
      ['terraform validate', 'Check references and variable declarations together.', 'Success! The configuration is valid.'],
      ['terraform console', 'Open the expression console with current variable values loaded.', 'The > prompt appears.'],
      ['var.environment', 'Read the effective environment input.', 'Terraform returns "training".'],
      ['var.parameter_values', 'Read the effective map and verify its three keys.', 'Terraform displays application, owner and purpose.'],
      ['exit', 'Leave the expression console.', 'The terminal prompt returns.']
    ], checks: [['Prove validation works', 'Temporarily run terraform plan -var="aws_region=eu-west-1" without applying.', 'Terraform displays the custom eu-west-2 validation message.'], ['Explain value precedence used here', 'Identify the default and the terraform.tfvars override.', 'The learner explains which parameter_values map is effective.']]
  },
  {
    phase: 3, title: 'Build locals, data and resource references', feature: 'locals.tf, data.tf and main.tf',
    goal: 'Connect inputs to reusable expressions, read the AWS account and create multiple resources from one block.',
    why: 'References form Terraform’s dependency graph and expressions let concise configuration represent repeatable infrastructure.', sourceKeys: ['tf-locals', 'tf-data', 'tf-resource', 'tf-expressions', 'aws-ssm-resource'],
    console: [['Create reusable local values', [
      'Create locals.tf and add an empty locals block.',
      'Add name_prefix = "/fa-terraform-structure/${var.environment}".',
      'Explain that ${var.environment} is string interpolation and will evaluate to training.',
      'Add common_tags as a map containing ManagedBy, FollowAlong and Environment.',
      'Set Environment to var.environment without quotes because it is a reference.',
      'Save, format and validate.',
      'Use terraform console to evaluate local.name_prefix and local.common_tags, then leave the console.'
    ], 'The local values evaluate to the expected prefix and reusable tag map.', '', [{ title: 'Finished locals.tf reference', language: 'text', content: localsBlock }]], ['Add a read-only data source', [
      'Create data.tf.',
      'Add data "aws_caller_identity" "current" with an empty body.',
      'Explain that data is the block type, aws_caller_identity is the data-source type and current is its local label.',
      'Explain that this reads the current account and does not create or manage the identity.',
      'Save, format and validate.'
    ], 'data.tf contains one read-only data block.', '', [{ title: 'Finished data.tf reference', language: 'text', content: dataBlock }]], ['Construct the managed resource block', [
      'Create main.tf and add resource "aws_ssm_parameter" "training" with an empty body.',
      'Say its Terraform address before instances exist: aws_ssm_parameter.training.',
      'Add for_each = var.parameter_values and explain that Terraform will create one instance per map key.',
      'Add name = "${local.name_prefix}/${each.key}".',
      'Explain that local.name_prefix is reused and each.key is the current map key.',
      'Add description using each.key.',
      'Add type = "String".',
      'Add value = each.value and explain why it is not quoted.',
      'Add tags = local.common_tags.',
      'Save, format and validate.',
      'Compare the complete file with the finished reference only after validation succeeds.'
    ], 'One resource block describes three separately addressed Parameter Store parameters.', '', [{ title: 'Finished main.tf reference', language: 'text', content: resourceBlock }]]],
    cli: [
      ['terraform fmt', 'Format each new file after a meaningful block is complete.', 'Terraform reports changed filenames only when formatting was needed.'],
      ['terraform validate', 'Validate all files as one configuration.', 'Success! The configuration is valid.'],
      ['terraform console', 'Open the expression console.', 'The > prompt appears.'],
      ['local.name_prefix', 'Evaluate a local derived from an input variable.', 'Terraform returns /fa-terraform-structure/training.'],
      ['local.common_tags', 'Evaluate the reusable tags map.', 'Terraform displays the three expected tags.'],
      ['keys(var.parameter_values)', 'Inspect the keys that for_each will use.', 'Terraform lists application, owner and purpose.'],
      ['exit', 'Leave the expression console.', 'The normal prompt returns.']
    ], checks: [['Trace one expression', 'Explain how the application instance gets its final name and value.', 'The name becomes /fa-terraform-structure/training/application and the value becomes study-tracker.'], ['Explain dependency information', 'Identify references to variables and locals and explain what Terraform learns from them.', 'The learner can describe how referenced values connect the configuration.']]
  },
  {
    phase: 3, title: 'Expose useful output values', feature: 'outputs.tf and references to resource attributes',
    goal: 'Create outputs that read managed resource attributes and read-only account data.',
    why: 'Outputs form a clear interface for humans, automation and parent modules without requiring direct state inspection.', sourceKeys: ['tf-outputs', 'tf-expressions'],
    console: [['Construct outputs.tf and decode its references', [
      'Create an empty file named outputs.tf.',
      'Add output "parameter_names" with an empty body.',
      'Add its description argument.',
      'Add value = values(aws_ssm_parameter.training)[*].name.',
      'Explain that values converts the resource-instance map to a list.',
      'Explain that [*].name selects the name attribute from every instance.',
      'Add output "verified_account_id".',
      'Set its value to data.aws_caller_identity.current.account_id.',
      'Trace the reference as block type, data-source type, local label and exported attribute.',
      'Save, format and validate.',
      'Compare the finished file only after writing both outputs yourself.'
    ], 'outputs.tf exposes resource names and the verified AWS account ID.', '', [{ title: 'Finished outputs.tf reference', language: 'text', content: outputsBlock }]]],
    cli: [['terraform fmt', 'Format outputs.tf.', 'The file uses canonical formatting.'], ['terraform validate', 'Validate every configuration file together.', 'Success! The configuration is valid.'], ['terraform console', 'Open the console to practise the data-source reference.', 'The > prompt appears.'], ['data.aws_caller_identity.current.account_id', 'Evaluate the data-source attribute; this can contact AWS.', 'Terraform returns [ACCOUNT_ID].'], ['exit', 'Leave the console.', 'The normal prompt returns.']],
    checks: [['Read a long reference', 'Break data.aws_caller_identity.current.account_id into its four parts.', 'The learner identifies block kind, type, label and attribute.'], ['Predict the output shape', 'State whether parameter_names will be one string or a collection.', 'It will be a collection containing three parameter names.']]
  },
  {
    phase: 4, title: 'Predict, plan, apply and verify the configuration', feature: 'Core Terraform workflow',
    goal: 'Predict the resource instances, read a saved plan and verify the exact AWS results.',
    why: 'A plan is a review boundary: understanding addresses and changes before apply prevents blind infrastructure changes.', sourceKeys: ['tf-plan', 'tf-apply', 'aws-ssm', 'aws-ssm-life'],
    console: [['Review the complete project before planning', [
      'List the project files and name the purpose of every .tf and .tfvars file.',
      'Confirm no file contains credentials or secret values.',
      'Predict three resource instance addresses using the map keys.',
      'Predict the three final Parameter Store names.',
      'Run terraform fmt -check and correct formatting before continuing.',
      'Run terraform validate and require a successful result.',
      'Run terraform plan -out=create.tfplan.',
      'Read the plan summary and require exactly 3 to add, 0 to change and 0 to destroy.',
      'Find each aws_ssm_parameter.training["key"] address in the plan.',
      'Check every name, String type, harmless value and tag.',
      'Check that the data source reads [ACCOUNT_ID].',
      'Apply only the saved create.tfplan file.',
      'Read both outputs after apply.',
      'Open AWS Systems Manager in eu-west-2, choose Parameter Store and filter for /fa-terraform-structure/training/.',
      'Open each of the three parameters and verify its value and tags.'
    ], 'Three exact standard String parameters exist, match the plan and are tracked by Terraform.', 'Stop if the plan contains any deletion, replacement, unexpected name, Region or account.', []]],
    cli: [
      ['terraform fmt -check', 'Require canonical formatting without rewriting files.', 'The command exits successfully.'],
      ['terraform validate', 'Validate the completed configuration.', 'Success! The configuration is valid.'],
      ['terraform plan -out=create.tfplan', 'Save the proposed creation plan.', 'Plan: 3 to add, 0 to change, 0 to destroy.'],
      ['terraform show create.tfplan', 'Read the exact saved plan.', 'Only the three named parameters are proposed.'],
      ['terraform apply create.tfplan', 'Apply only the reviewed immutable plan file.', 'Apply complete! Resources: 3 added.'],
      ['terraform output', 'Read the two declared outputs.', 'The three names and [ACCOUNT_ID] appear.'],
      ['terraform state list', 'See how for_each keys appear in Terraform addresses.', 'Three aws_ssm_parameter.training["..."] instances are listed.'],
      ['aws ssm describe-parameters --parameter-filters Key=Name,Option=BeginsWith,Values=/fa-terraform-structure/training/ --region eu-west-2 --profile fa-terraform-structure', 'Verify the exact parameters through AWS CLI.', 'Only the named training parameters are returned.']
    ], checks: [['Compare prediction with plan', 'Compare the predicted addresses and names with terraform show.', 'All three predictions match the saved plan.'], ['Compare Terraform with AWS', 'Compare terraform output and state list with Parameter Store.', 'Terraform and AWS show the same three objects.']]
  },
  {
    phase: 5, title: 'Change one input and explain the new plan', feature: 'Configuration change and reconciliation',
    goal: 'Add one map item without copying another resource block, then interpret the incremental plan.',
    why: 'Terraform is declarative: changing an input changes the desired state, and for_each isolates the new instance by key.', sourceKeys: ['tf-expressions', 'tf-plan', 'tf-apply'],
    console: [['Extend the collection safely', [
      'Open terraform.tfvars.',
      'Inside parameter_values, add exam = "terraform-associate-004".',
      'Do not duplicate the aws_ssm_parameter resource block.',
      'Explain why for_each can create the new instance from the added map key.',
      'Save and run terraform fmt.',
      'Predict the new address aws_ssm_parameter.training["exam"].',
      'Run terraform plan -out=change.tfplan.',
      'Require exactly 1 to add, 0 to change and 0 to destroy.',
      'Inspect the exact new name and value.',
      'Apply only change.tfplan.',
      'Refresh Parameter Store and verify the fourth parameter.',
      'Run terraform plan once more and require No changes.'
    ], 'The collection grows to four parameters using the same resource block, and the final plan has no changes.', 'Do not apply if Terraform proposes changes to the original three parameters.', []]],
    cli: [
      ['terraform fmt', 'Format the edited values file.', 'Formatting completes.'],
      ['terraform plan -out=change.tfplan', 'Save the incremental plan.', 'Plan: 1 to add, 0 to change, 0 to destroy.'],
      ['terraform show change.tfplan', 'Inspect the new keyed resource instance.', 'Only training["exam"] is added.'],
      ['terraform apply change.tfplan', 'Apply the reviewed one-resource plan.', 'Apply complete! Resources: 1 added.'],
      ['terraform state list', 'Confirm all four keyed addresses are tracked.', 'application, exam, owner and purpose instances are listed.'],
      ['terraform plan', 'Verify configuration, state and AWS now agree.', 'No changes. Your infrastructure matches the configuration.']
    ], checks: [['Explain why no resource block was copied', 'Connect the new map entry to for_each, each.key and each.value.', 'The learner explains collection-driven instances.'], ['Verify convergence', 'Run a final plan after apply.', 'Terraform reports no changes.']]
  },
  {
    phase: 6, title: 'Destroy safely and reconstruct the configuration', feature: 'Teardown and knowledge check',
    goal: 'Remove only the four training parameters and demonstrate understanding by rebuilding the file map on paper.',
    why: 'Safe Terraform work includes ordered cleanup and the ability to explain configuration without relying on pasted code.', sourceKeys: ['tf-plan', 'tf-destroy', 'aws-ssm-life', 'aws-iam'],
    console: [['Review and apply the destroy plan', [
      'Run terraform plan -destroy -out=destroy.tfplan from the exact fa-terraform-structure folder.',
      'Require exactly 0 to add, 0 to change and 4 to destroy.',
      'Read all four addresses and confirm every name begins /fa-terraform-structure/training/.',
      'Confirm no unrelated AWS resource appears.',
      'Apply only destroy.tfplan.',
      'Open Parameter Store in eu-west-2 and refresh the filtered list.',
      'Confirm the four exact parameters are absent.',
      'Run terraform state list and confirm it is empty.',
      'Delete the temporary CLI access key, detach and delete only fa-terraform-structure-training-policy, and delete the temporary user if one was created.',
      'Remove only the fa-terraform-structure AWS CLI profile from the local credentials files.',
      'Delete only the verified fa-terraform-structure project folder after AWS cleanup succeeds.'
    ], 'No training parameter, temporary permission, credential, plan, state or project file remains.', 'Review the saved destroy plan before applying it. Never use broad manual deletion.', []], ['Rebuild the mental model', [
      'Without opening the finished references, write the seven filenames used by the project.',
      'Beside versions.tf, write Terraform CLI and provider constraints.',
      'Beside providers.tf, write AWS Region and profile configuration.',
      'Beside variables.tf, write typed external inputs and validation.',
      'Beside locals.tf, write reusable internal expressions.',
      'Beside data.tf, write read existing information without managing it.',
      'Beside main.tf, write managed resources and their desired settings.',
      'Beside outputs.tf, write useful exported attributes.',
      'Explain that Terraform combines all .tf files in the directory regardless of filename order.',
      'Explain the sequence fmt, init, validate, plan, apply and destroy in your own words.'
    ], 'The learner can describe how a Terraform configuration is formed and operated without copying the completed files.', '', []]],
    cli: [
      ['terraform plan -destroy -out=destroy.tfplan', 'Create a reviewable destroy plan.', 'Plan: 0 to add, 0 to change, 4 to destroy.'],
      ['terraform show destroy.tfplan', 'Inspect every exact deletion before applying.', 'Only the four lab parameters appear.'],
      ['terraform apply destroy.tfplan', 'Apply the reviewed destroy plan.', 'Apply complete! Resources: 4 destroyed.'],
      ['terraform state list', 'Confirm no managed resource remains in state.', 'No resource address is returned.'],
      ['aws ssm describe-parameters --parameter-filters Key=Name,Option=BeginsWith,Values=/fa-terraform-structure/training/ --region eu-west-2 --profile fa-terraform-structure', 'Confirm AWS no longer lists the lab parameters.', 'No matching parameter is returned.'],
      ['aws configure list-profiles', 'Identify the exact temporary profile before removing it manually.', 'fa-terraform-structure is visible until removed.']
    ], checks: [['Verify complete cleanup', 'Search Parameter Store and inspect Terraform state for the exact training prefix.', 'No training resource remains.'], ['Explain every file', 'Describe the responsibility of each configuration file and the fact that Terraform loads them as one module.', 'The learner can reconstruct the project structure independently.'], ['Explain the workflow', 'Describe why formatting, initialization, validation and plan review occur before apply.', 'The learner can explain the safety purpose of each command.']]
  }
];

const tasks = definitions.map((definition, index) => {
  const id = `task-terraform-configuration-${String(index + 1).padStart(3, '0')}-${slug(definition.title)}`;
  const sourceIds = definition.sourceKeys.map(sourceId);
  const task = {
    id, slug: slug(definition.title), title: definition.title, phaseId: phases[definition.phase - 1].id,
    orderInPhase: phases[definition.phase - 1].taskIds.length + 1, feature: definition.feature, goal: definition.goal,
    whyItMatters: definition.why, difficulty: index < 4 ? 'Easy' : 'Medium', estimatedMinutes: null,
    prerequisites: [], requiredPermissions: ['Use only the approved fa-terraform-structure training identity and exact /fa-terraform-structure/* parameter path.'],
    modeAvailability: { console: { status: 'available', reason: 'Complete editor and AWS Console guidance is included.' }, cli: { status: 'available', reason: 'Complete Terraform and AWS CLI guidance is included.' } },
    sourceIds, createdResourceKeys: [],
    consoleSteps: definition.console.map((item, stepIndex) => consoleStep(id, stepIndex + 1, item[0], item[1], item[2], item[3] || '', item[4] || [], sourceIds)),
    cliSteps: definition.cli.map((item, stepIndex) => cliStep(id, stepIndex + 1, ...item, sourceIds)),
    verification: definition.checks.map((item, checkIndex) => verification(id, checkIndex + 1, ...item)), cleanup: []
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
  ['Review the destroy plan', 'Confirm only the four /fa-terraform-structure/training/* parameters are proposed for deletion.'],
  ['Destroy managed parameters', 'Apply only the reviewed destroy.tfplan and verify Terraform state is empty.'],
  ['Verify AWS removal', 'Refresh Parameter Store in eu-west-2 and confirm the exact training prefix has no results.'],
  ['Remove temporary access', 'Delete only the temporary access key, training policy and user or role attachment created for this lab.'],
  ['Remove local files', 'Remove only the fa-terraform-structure CLI profile and verified project folder after AWS cleanup.'],
  ['Acknowledge completion', 'Confirm no lab parameter, permission, credential, plan, state or configuration file remains.']
];
const cleanup = { completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency', steps: cleanupDescriptions.map(([title, description], index) => ({ id: `programme-cleanup-${index + 1}`, stepNumber: index + 1, title, instruction: description, description, verification: `Cleanup item ${index + 1} is visibly complete for only the exact lab targets.`, resourceKeys: [], sourceIds: [] })) };

const authorDraftContent = {
  schema: { profile: 'canonical-follow-along', version: '1.0.0', authorPackageVersion: '1.0.0', sharedContractHash: null, createdWith: 'codex-local-handoff' },
  programme: {
    serviceSlug: 'terraform-configuration-foundations', serviceName: 'HashiCorp Terraform on AWS', shortName: 'Terraform Foundations',
    displayName: 'Understanding and Building Terraform Configuration',
    subtitle: 'Learn how Terraform configuration is formed by building every block yourself.',
    description: 'Start with no lab infrastructure. Read HCL, create each project file, add blocks and arguments gradually, evaluate expressions, connect variables, locals, data, resources and outputs, then plan, apply, change and safely destroy a small AWS configuration.',
    learningOutcome: 'Read, write, explain and safely operate a complete Terraform root configuration without relying on pasted finished files.',
    programmeId, pathId: programmeId, componentNamespace: '', category: 'Terraform Configuration Language', difficulty: 'Beginner', estimatedMinutes: null,
    defaultRegion: 'eu-west-2', regionScope: 'mixed', supportedModes: ['console', 'cli', 'both'], publicationVisibility: 'unpublished', examId: 'terraform-associate-004'
  },
  sources, presentation: { accentColor: '#7c3aed', iconLabel: 'TF0', iconName: 'FileCode', badgeText: 'Terraform Follow Along 0' },
  storage: {}, progress: { initialTaskId: tasks[0].id, supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
  capabilities: {}, phases, tasks, resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: { region: 'eu-west-2' } },
  warnings: {
    cost: 'Standard Parameter Store parameters normally have no additional charge. Remove all exact lab resources during the final phase.',
    safety: 'Operate only inside the verified fa-terraform-structure folder and exact /fa-terraform-structure/training/* path. Read every plan before apply.',
    credentials: 'Never place passwords, access keys, session tokens or secrets in Terraform files, tfvars, Author, Git, screenshots or chat.',
    region: 'Use eu-west-2 for all Parameter Store resources. IAM is global. Verify the AWS account and caller before planning or applying.'
  },
  cleanup, extensions: { registrations: [] },
  review: { validationStatus: 'passed', validationErrors: [], validationWarnings: [], sourceReviewStatus: 'reviewed', learnerPreviewStatus: 'reviewed', approvalDecision: 'pending', reviewStatus: 'ready_for_approval', findings: [
    { id: 'finding-1', findingNumber: 1, section: 'warnings', priority: 'advisory', message: 'An administrator must review the temporary training permission boundary before it is attached.', status: 'open' },
    { id: 'finding-2', findingNumber: 2, section: 'instructions', priority: 'advisory', message: 'The learner should type blocks progressively and use finished code boxes only for comparison.', status: 'open' },
    { id: 'finding-3', findingNumber: 3, section: 'cleanup', priority: 'advisory', message: 'Only the exact four training parameters and temporary access created by this lab may be removed.', status: 'open' }
  ] },
  publication: { publishStatus: 'not_published', targetProgrammeId: programmeId, proposedChanges: [] }
};

const planning = validateAuthorPlanning(authorDraftContent);
const content = validateAuthorContent(authorDraftContent);
const review = validateAuthorReview(authorDraftContent);
if (!planning.valid || !content.valid || !review.valid) {
  console.error(JSON.stringify({ planning, content, review }, null, 2));
  throw new Error('Terraform configuration foundations handoff did not pass Author validation.');
}
const summary = {
  phaseCount: phases.length, taskCount: tasks.length,
  checkboxCount: tasks.flatMap(task => task.consoleSteps).flatMap(step => step.instructions).length,
  cliCommandCount: tasks.flatMap(task => task.cliSteps).length,
  verificationCheckCount: tasks.flatMap(task => task.verification).length,
  cleanupItemCount: cleanup.steps.length, learnerResourceValueCount: 0, officialSourceCount: sources.length,
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
const acceptedFingerprintChain = { stage6: acceptedRecordManifest.instructions, stage7: acceptedRecordManifest.resourcesAndChecks, stage8: acceptedRecordManifest.cleanup, stage9: acceptedRecordManifest.authoringCheck, stage10: acceptedRecordManifest.learnerPreview, stage11: acceptedRecordManifest.structuredReview };
const handoffPackage = {
  schemaVersion: 1, kind: 'author_local_handoff_package', status: 'awaiting_human_handoff_review', sessionId, preparedAt, generationMode: 'new',
  service: { officialName: 'HashiCorp Terraform on AWS', shortName: 'Terraform Foundations' }, acceptedFingerprintChain, acceptedRecordManifest, authorDraftContent,
  identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'The local Author import must bind the currently signed-in Author and create exactly one private draft.' },
  summary, handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false }, acceptedStagesOneToElevenChanged: false
};
const fingerprintContent = structuredClone(handoffPackage);
delete fingerprintContent.status;
delete fingerprintContent.preparedAt;
handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprint(fingerprintContent) };
const session = { schemaVersion: 1, sessionId, status: 'handoff_package_ready_for_review', createdAt: preparedAt, inputs: { serviceName: 'HashiCorp Terraform on AWS', shortName: 'Terraform Foundations', level: 'Beginner', goal: authorDraftContent.programme.learningOutcome, region: 'eu-west-2' }, boundaries: { handoffPackagePrepared: true, stage12Prepared: false, authorDraftWritten: false, supabaseConnected: false, awsConnected: false, candidatePrepared: false, published: false } };
const acceptance = buildStage90ALocalAcceptance({ session, handoffPackage, now: () => new Date('2026-08-14T23:05:00.000Z') });
const preview = [
  'AUTHOR LOCAL HANDOFF PACKAGE - TERRAFORM CONFIGURATION FOUNDATIONS', '',
  `Programme: ${authorDraftContent.programme.displayName}`, 'Exam: Terraform Associate 004', 'Card: 0',
  `Phases: ${summary.phaseCount}`, `Tasks: ${summary.taskCount}`, `Separate editable checkboxes: ${summary.checkboxCount}`,
  `CLI commands: ${summary.cliCommandCount}`, `Verification checks: ${summary.verificationCheckCount}`, `Cleanup items: ${summary.cleanupItemCount}`,
  `Official AWS sources: ${summary.officialAwsSourceCount}`, `Official HashiCorp sources: ${summary.officialTerraformSourceCount}`,
  `SHA-256 handoff fingerprint: ${handoffPackage.handoffFingerprint.value}`, '', 'PHASES', ...phases.map(phase => `${phase.phaseNumber}. ${phase.title}`), '',
  'VALIDATION', `Planning: ${planning.valid ? 'passed' : 'failed'}`, `Content: ${content.valid ? 'passed' : 'failed'}`, `Structured review: ${review.valid ? 'passed' : 'failed'}`, '',
  'BOUNDARIES', 'Nothing was written to Author, Supabase or AWS by this package builder.', 'No release candidate was created by this package builder.', 'The exact package has a local Step 90A human-acceptance audit.', ''
].join('\n');
await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, 'author-local-handoff-package.json'), `${JSON.stringify(handoffPackage, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'author-local-handoff-acceptance-90a.json'), `${JSON.stringify(acceptance, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'complete-follow-along-preview.txt'), preview, 'utf8');
await fs.writeFile(path.join(directory, 'session.json'), `${JSON.stringify(session, null, 2)}\n`, 'utf8');
console.log(preview);
