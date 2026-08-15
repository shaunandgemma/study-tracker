import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../../../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../../../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../../../src/features/followAlongAuthor/authorReview.js';
import { buildStage90ALocalAcceptance } from '../../../../scripts/author-assistant/authorAssistantStage90A.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const sessionId = 'author-assistant-terraform-variables-validation-codex-20260815-001';
const programmeId = 'terraform-variables-validation-learning-path';
const preparedAt = '2026-08-15T14:00:00.000Z';
const stableStringify = value => Array.isArray(value) ? `[${value.map(stableStringify).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}` : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const sourceId = key => `source-${key}`;

function consoleStep(taskId, number, title, instructions, expectedResult, warning = '', blocks = [], sourceIds = []) {
  const id = `${taskId}-console-step-${number}-${slug(title)}`;
  return { id, stepNumber: number, number, title, instruction: instructions[0], instructions: instructions.map((text, index) => ({ id: `${id}-instruction-${index + 1}`, text, detail: '' })), jsonBlocks: blocks.map((block, index) => ({ id: `${id}-json-${index + 1}`, title: block.title, content: block.content, language: block.language || 'text', sourceIds })), commands: [], expectedResult, warning, sourceIds };
}
function cliStep(taskId, number, item, sourceIds) {
  const [command, explanation, expectedResult, warning = ''] = item;
  return { id: `${taskId}-cli-step-${number}`, stepNumber: number, number, command, explanation, expectedResult, instructions: [], commands: [], warning, sourceIds };
}
function verification(taskId, number, item) {
  const [title, instruction, expectedResult, mode = 'either'] = item;
  return { id: `${taskId}-verification-${number}`, title, instruction, expectedResult, mode };
}

const iamPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VerifyCaller",
      "Effect": "Allow",
      "Action": "sts:GetCallerIdentity",
      "Resource": "*"
    },
    {
      "Sid": "DescribeTrainingParameters",
      "Effect": "Allow",
      "Action": "ssm:DescribeParameters",
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyTerraformVariableLabParameters",
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter",
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:DeleteParameter",
        "ssm:AddTagsToResource",
        "ssm:RemoveTagsFromResource",
        "ssm:ListTagsForResource"
      ],
      "Resource": "arn:aws:ssm:eu-west-2:<ACCOUNT_ID>:parameter/fa-terraform-vars/*"
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

const variablesTf = `variable "aws_region" {
  description = "AWS Region for the training parameters"
  type        = string
  default     = "eu-west-2"
}

variable "aws_profile" {
  description = "Named AWS CLI profile used only for this lab"
  type        = string
  default     = "fa-terraform-vars"
}

variable "environment" {
  description = "Short environment name used in parameter paths"
  type        = string
  default     = "development"

  validation {
    condition     = contains(["development", "test"], lower(trimspace(var.environment)))
    error_message = "environment must be development or test."
  }
}

variable "common_tags" {
  description = "Tags applied to every training parameter"
  type        = map(string)
  default = {
    ManagedBy = "Terraform"
    Lab       = "fa-terraform-vars"
  }
}

variable "parameters" {
  description = "Training parameters keyed by a short safe name"
  type = map(object({
    value       = string
    description = string
    enabled     = optional(bool, true)
  }))

  default = {
    api-mode = {
      value       = "training"
      description = "Harmless API operating mode"
    }
    retry-count = {
      value       = "3"
      description = "Harmless retry-count example"
    }
    feature-flag = {
      value       = "enabled"
      description = "Harmless feature flag"
    }
  }

  validation {
    condition     = alltrue([for name in keys(var.parameters) : can(regex("^[a-z0-9-]+$", name))])
    error_message = "Parameter keys may contain only lowercase letters, numbers and hyphens."
  }
}`;

const localsTf = `locals {
  normalized_environment = lower(trimspace(var.environment))
  path_prefix             = "/fa-terraform-vars/\${local.normalized_environment}"

  enabled_parameters = {
    for name, configuration in var.parameters :
    name => configuration
    if configuration.enabled
  }

  effective_tags = merge(var.common_tags, {
    Environment = local.normalized_environment
  })
}`;

const mainTf = `resource "aws_ssm_parameter" "training" {
  for_each = local.enabled_parameters

  name        = "\${local.path_prefix}/\${each.key}"
  description = each.value.description
  type        = "String"
  value       = each.value.value

  tags = merge(local.effective_tags, {
    ParameterKey = each.key
  })

  lifecycle {
    precondition {
      condition     = length(trimspace(each.value.value)) > 0
      error_message = "Enabled parameter values cannot be empty."
    }
  }
}

check "at_least_one_parameter" {
  assert {
    condition     = length(local.enabled_parameters) > 0
    error_message = "At least one training parameter must be enabled."
  }
}`;

const outputsTf = `output "parameter_names" {
  description = "Sorted names of all enabled training parameters"
  value       = sort([for parameter in aws_ssm_parameter.training : parameter.name])
}

output "configuration_summary" {
  description = "Calculated values that explain the active configuration"
  value = {
    environment       = local.normalized_environment
    enabled_count     = length(local.enabled_parameters)
    enabled_keys      = sort(keys(local.enabled_parameters))
    effective_tag_map = local.effective_tags
  }
}`;

const autoTfvars = `common_tags = {
  ManagedBy = "Terraform"
  Lab       = "fa-terraform-vars"
  Owner     = "training-learner"
  Purpose   = "variables-validation-practice"
}`;

const expandedTfvars = `environment = "development"

parameters = {
  api-mode = {
    value       = "guided-training"
    description = "Harmless API operating mode"
  }
  retry-count = {
    value       = "5"
    description = "Harmless retry-count example"
  }
  feature-flag = {
    value       = "enabled"
    description = "Harmless feature flag"
  }
  maintenance-window = {
    value       = "sunday-0200"
    description = "Harmless maintenance-window example"
  }
}`;

const invalidEnvironmentTfvars = `environment = "production"`;
const invalidParameterTfvars = `environment = "development"

parameters = {
  broken-example = {
    value       = ""
    description = "Deliberately invalid empty value"
  }
}`;

const sourceDefinitions = [
  ['aws-iam', 'Security best practices in IAM', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', 'AWS', 'Use temporary non-root access.'],
  ['aws-cli', 'Configure the AWS CLI', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html', 'AWS', 'Create a named training profile.'],
  ['aws-ssm', 'Creating Parameter Store parameters', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-create.html', 'AWS', 'Verify harmless String parameters in the Console.'],
  ['tf-variables', 'Input variables', 'https://developer.hashicorp.com/terraform/language/values/variables', 'HashiCorp', 'Declare typed inputs, defaults and validation.'],
  ['tf-types', 'Type constraints', 'https://developer.hashicorp.com/terraform/language/expressions/type-constraints', 'HashiCorp', 'Use maps, objects and optional attributes.'],
  ['tf-locals', 'Local values', 'https://developer.hashicorp.com/terraform/language/values/locals', 'HashiCorp', 'Name and reuse calculated expressions.'],
  ['tf-for', 'For expressions', 'https://developer.hashicorp.com/terraform/language/expressions/for', 'HashiCorp', 'Filter and transform collections.'],
  ['tf-functions', 'Built-in functions', 'https://developer.hashicorp.com/terraform/language/functions', 'HashiCorp', 'Use string and collection functions.'],
  ['tf-for-each', 'The for_each meta-argument', 'https://developer.hashicorp.com/terraform/language/meta-arguments/for_each', 'HashiCorp', 'Create stable resource instances from a map.'],
  ['tf-values', 'Variables and outputs', 'https://developer.hashicorp.com/terraform/language/values', 'HashiCorp', 'Explain value flow through configuration.'],
  ['tf-files', 'Variable definitions files', 'https://developer.hashicorp.com/terraform/language/values/variables#variable-definitions-tfvars-files', 'HashiCorp', 'Use automatic and explicit variable files.'],
  ['tf-precondition', 'Validate resource configuration', 'https://developer.hashicorp.com/terraform/language/expressions/custom-conditions', 'HashiCorp', 'Use variable validation, preconditions and checks.'],
  ['tf-plan', 'Terraform plan command', 'https://developer.hashicorp.com/terraform/cli/commands/plan', 'HashiCorp', 'Review saved and deliberately failing plans.'],
  ['tf-output', 'Terraform output command', 'https://developer.hashicorp.com/terraform/cli/commands/output', 'HashiCorp', 'Inspect scalar and structured output values.'],
  ['tf-destroy', 'Terraform destroy command', 'https://developer.hashicorp.com/terraform/cli/commands/destroy', 'HashiCorp', 'Remove every managed parameter safely.']
];

const phases = [
  ['Prepare safely', 'Create temporary access and an isolated Terraform folder.'],
  ['Build typed configuration', 'Create variables, locals, expressions, resources and structured outputs one file at a time.'],
  ['Apply and inspect values', 'Create harmless parameters and trace values from inputs to AWS.'],
  ['Override and validate', 'Use variable files, expand a map and observe safe validation failures.'],
  ['Complete teardown', 'Destroy every parameter and remove temporary access and files.']
].map(([title, description], index) => ({ id: `phase-${index + 1}-${slug(title)}`, phaseNumber: index + 1, title, description, taskIds: [], isOptional: false }));

const definitions = [
  {
    phase: 1, title: 'Create temporary variables training access', feature: 'IAM, AWS CLI and isolated working folder',
    goal: 'Start with no lab infrastructure and verify one temporary identity, Region and empty folder.',
    why: 'Typed configuration still creates real resources. A clear identity and folder boundary protects unrelated AWS resources and Terraform state.',
    sources: ['aws-iam', 'aws-cli'], blocks: [{ title: 'fa-terraform-vars-training-policy.json', content: iamPolicy, language: 'json' }],
    instructions: [
      'Sign in to the training AWS account as an administrator; never use the root user for this lab.',
      'Open the account menu and record the 12-digit account ID as [ACCOUNT_ID].',
      'Use the Region selector to choose Europe (London) eu-west-2.',
      'Open IAM, choose Policies, choose Create policy and choose JSON.',
      'Paste the supplied fa-terraform-vars-training-policy JSON.',
      'Replace <ACCOUNT_ID> with the recorded account ID.',
      'Choose Next, name the policy fa-terraform-vars-training-policy and review the /fa-terraform-vars path boundary.',
      'Choose Create policy.',
      'Open IAM Users, create fa-terraform-vars-user and attach only the new training policy.',
      'Create one CLI access key only if the chosen terminal requires it.',
      'Enter credentials only into the AWS CLI protected prompt; never put them in .tf or .tfvars files.',
      'Open CloudShell, WSL or PowerShell.',
      'CloudShell or WSL: create and enter ~/fa-terraform-vars, then confirm it with pwd.',
      'PowerShell: create and enter $env:USERPROFILE\\fa-terraform-vars, then confirm it with Get-Location.',
      'List the folder and confirm it contains no old Terraform files, plans or state.'
    ], expected: 'The temporary access boundary and empty fa-terraform-vars folder are ready.', warning: 'An administrator must review this disposable training policy before attachment.',
    commands: [
      ['aws configure --profile fa-terraform-vars', 'Store temporary credentials and eu-west-2 in a named profile.', 'The protected prompt completes.'],
      ['aws sts get-caller-identity --profile fa-terraform-vars', 'Verify the caller and AWS account.', 'The ARN identifies fa-terraform-vars-user in [ACCOUNT_ID].'],
      ['mkdir -p ~/fa-terraform-vars', 'CloudShell or WSL: create the exact folder.', 'The folder exists.'],
      ['cd ~/fa-terraform-vars', 'CloudShell or WSL: enter the exact folder.', 'The terminal enters the folder.'],
      ['pwd', 'CloudShell or WSL: verify the path.', 'The path ends with /fa-terraform-vars.'],
      ['New-Item -ItemType Directory -Path "$env:USERPROFILE\\fa-terraform-vars" -Force', 'PowerShell: create the exact folder.', 'The folder exists.'],
      ['Set-Location "$env:USERPROFILE\\fa-terraform-vars"', 'PowerShell: enter the exact folder.', 'The location changes.'],
      ['Get-Location', 'PowerShell: verify the path.', 'The path ends with fa-terraform-vars.']
    ], checks: [['Verify identity', 'Read the STS account and ARN.', 'The expected temporary user is active.'], ['Verify empty workspace', 'List the current folder.', 'No old .tf, state or plan file exists.']]
  },
  {
    phase: 2, title: 'Define simple and complex input variables', feature: 'String, map, object, optional attribute and validation blocks',
    goal: 'Build versions.tf and variables.tf while understanding every declared type and default.',
    why: 'Type constraints make a module interface predictable and reject malformed input before infrastructure changes begin.',
    sources: ['tf-variables', 'tf-types', 'tf-precondition'], blocks: [{ title: 'versions.tf', content: versionsTf }, { title: 'variables.tf', content: variablesTf }],
    instructions: [
      'Remain in the empty fa-terraform-vars folder.',
      'Create versions.tf and paste the supplied block.',
      'Identify the Terraform version, AWS provider source, provider constraint, Region variable and profile variable.',
      'Create variables.tf and paste the supplied block.',
      'Read aws_region and aws_profile as string variables with defaults.',
      'Read environment as a string that accepts only development or test after trimming and lowercasing.',
      'Read common_tags as map(string), meaning every key and value must be text.',
      'Read parameters as map(object(...)), meaning each named item must follow the object structure.',
      'Identify value and description as required object attributes.',
      'Identify enabled as optional(bool, true), so omitted entries are enabled by default.',
      'Inspect the default map and identify its three stable keys.',
      'Read the second validation expression and identify keys(), for, regex(), can() and alltrue().',
      'Run terraform fmt and terraform init.',
      'Run terraform validate and correct any reported file and line before continuing.',
      'Do not apply; no resource block exists yet.'
    ], expected: 'Terraform accepts the typed variable declarations and no AWS resource exists.', warning: 'Do not place real passwords, tokens or secrets in variable defaults or tfvars files.',
    commands: [
      ['terraform fmt', 'Format the first two configuration files.', 'Terraform completes without creating resources.'],
      ['terraform init', 'Install the required AWS provider.', 'Terraform reports successful initialization.'],
      ['terraform validate', 'Validate the provider and variable declarations.', 'Success! The configuration is valid.']
    ], checks: [['Explain the complex type', 'Describe the outer map and inner object attributes.', 'The learner can distinguish keys, required attributes and the optional boolean.'], ['Verify no infrastructure', 'Open Systems Manager Parameter Store in eu-west-2 and search /fa-terraform-vars.', 'No lab parameter exists yet.']]
  },
  {
    phase: 2, title: 'Build locals, expressions, resources and outputs', feature: 'locals, functions, for expressions, for_each, merge and structured outputs',
    goal: 'Connect input variables to calculated locals, stable resource instances and readable outputs.',
    why: 'Terraform configuration becomes reusable when expressions transform input data rather than repeating fixed values.',
    sources: ['tf-locals', 'tf-for', 'tf-functions', 'tf-for-each', 'tf-values', 'tf-output', 'tf-precondition'],
    blocks: [{ title: 'locals.tf', content: localsTf }, { title: 'main.tf', content: mainTf }, { title: 'outputs.tf', content: outputsTf }],
    instructions: [
      'Create locals.tf and paste the supplied local values.',
      'Read normalized_environment as a calculated lowercase trimmed value.',
      'Read path_prefix as string interpolation that builds the common Parameter Store path.',
      'Read enabled_parameters as a for expression that filters out objects whose enabled value is false.',
      'Read effective_tags as merge() combining caller tags with the calculated Environment tag.',
      'Create main.tf and paste the supplied resource and check block.',
      'Read for_each as creating one stable resource instance for each enabled map key.',
      'Read each.key and each.value as the current map key and object.',
      'Read the resource name as two interpolated parts: path prefix and stable key.',
      'Read the tag merge as adding ParameterKey without duplicating the common tags.',
      'Read the lifecycle precondition as rejecting enabled objects with empty values.',
      'Read the check block as requiring at least one enabled parameter.',
      'Create outputs.tf and paste the supplied outputs.',
      'Read the list for expression that collects resource names and sort() that makes output predictable.',
      'Read configuration_summary as an object containing a string, number, list and map.',
      'Run terraform fmt and terraform validate.',
      'Run terraform console, evaluate local.enabled_parameters, then enter exit to leave the console.',
      'Do not apply until the next task.'
    ], expected: 'The complete configuration validates and the learner can trace each input through locals to resources and outputs.', warning: 'The sample values are deliberately harmless. Do not convert this lab into a secrets exercise.',
    commands: [
      ['terraform fmt', 'Format all root files.', 'Terraform formats the configuration.'],
      ['terraform validate', 'Check all expressions, references and conditions.', 'Success! The configuration is valid.'],
      ['terraform console', 'Open the expression console for read-only exploration.', 'The Terraform prompt opens.'],
      ['local.normalized_environment', 'Evaluate the normalized string inside terraform console.', '"development" is returned.'],
      ['keys(local.enabled_parameters)', 'Evaluate the active stable keys inside terraform console.', 'The three default keys are returned.'],
      ['local.effective_tags', 'Evaluate the merged tag map inside terraform console.', 'ManagedBy, Lab and Environment are present.'],
      ['exit', 'Leave terraform console before planning.', 'The normal terminal prompt returns.']
    ], checks: [['Trace one value', 'Follow api-mode from var.parameters through local.enabled_parameters to its resource name.', 'The final path is /fa-terraform-vars/development/api-mode.'], ['Verify stable addresses', 'Explain how map keys become for_each instance keys.', 'The learner expects addresses such as aws_ssm_parameter.training["api-mode"].']]
  },
  {
    phase: 3, title: 'Plan, apply and inspect the default values', feature: 'Saved plan, for_each instances, outputs and AWS verification',
    goal: 'Create three harmless parameters and prove the calculated configuration matches AWS.',
    why: 'Applying and inspecting the result connects abstract expressions to real resource addresses, tags and output values.',
    sources: ['tf-plan', 'tf-output', 'aws-ssm', 'tf-for-each'], blocks: [],
    instructions: [
      'Run terraform plan -out=defaults.tfplan.',
      'Confirm exactly three aws_ssm_parameter.training instances will be added.',
      'Confirm the instance keys are api-mode, retry-count and feature-flag.',
      'Run terraform show defaults.tfplan and verify every path begins /fa-terraform-vars/development/.',
      'Verify every parameter is type String and contains only the harmless supplied values.',
      'Run terraform apply defaults.tfplan.',
      'Run terraform output parameter_names and confirm three sorted paths.',
      'Run terraform output configuration_summary and inspect the string, number, list and map types.',
      'Run terraform state list and identify three stable for_each addresses.',
      'Open Systems Manager in eu-west-2 and choose Parameter Store.',
      'Search for /fa-terraform-vars/development/.',
      'Open each parameter and compare its name, description, value and tags with the configuration.',
      'Record that enabled_count is 3 and AWS displays three parameters.'
    ], expected: 'Three default parameters exist and match the calculated Terraform outputs.', warning: 'Stop if the plan includes any parameter outside /fa-terraform-vars/development/.',
    commands: [
      ['terraform plan -out=defaults.tfplan', 'Save the exact three-parameter plan.', 'Plan: 3 to add, 0 to change, 0 to destroy.'],
      ['terraform show defaults.tfplan', 'Inspect every calculated name, value and tag.', 'Only three harmless training parameters appear.'],
      ['terraform apply defaults.tfplan', 'Apply the reviewed saved plan.', 'Apply complete! Resources: 3 added.'],
      ['terraform output parameter_names', 'Display the sorted list expression result.', 'Three development parameter paths are returned.'],
      ['terraform output configuration_summary', 'Display the structured output object.', 'Environment, count, keys and tag map are visible.'],
      ['terraform state list', 'List stable for_each addresses.', 'Three keyed aws_ssm_parameter.training addresses are listed.']
    ], checks: [['Verify the resource count', 'Compare enabled_count, state list and the Console search.', 'All three surfaces report three parameters.'], ['Verify calculated tags', 'Open one parameter and compare its tags with local.effective_tags.', 'ManagedBy, Lab, Environment and ParameterKey match.']]
  },
  {
    phase: 4, title: 'Override values with automatic and explicit tfvars files', feature: 'Variable precedence, map replacement and controlled expansion',
    goal: 'Add common tags automatically, then use an explicit variable file to expand the parameter map from three to four.',
    why: 'Teams separate reusable configuration from environment values. Learners must understand that complex variable values are replaced by higher-precedence assignments rather than automatically deep-merged.',
    sources: ['tf-files', 'tf-plan', 'tf-types', 'tf-output'],
    blocks: [{ title: 'training.auto.tfvars', content: autoTfvars }, { title: 'expanded.tfvars', content: expandedTfvars }],
    instructions: [
      'Create training.auto.tfvars and paste the supplied common_tags map.',
      'Understand that *.auto.tfvars files are loaded automatically.',
      'Run terraform plan -out=tags.tfplan without a -var-file option.',
      'Confirm the three existing parameters receive Owner and Purpose tags without replacement.',
      'Apply tags.tfplan and verify one parameter shows the two added tags.',
      'Create expanded.tfvars and paste the complete supplied parameters map.',
      'Understand that this explicit map replaces the default parameters map for this run; it does not deep-merge entries.',
      'Compare the default map with expanded.tfvars and confirm all original keys were intentionally repeated.',
      'Identify maintenance-window as the fourth key.',
      'Identify changed harmless values for api-mode and retry-count.',
      'Run terraform plan -var-file=expanded.tfvars -out=expanded.tfplan.',
      'Confirm one parameter is added, existing values are updated in place and none are destroyed.',
      'Run terraform apply expanded.tfplan.',
      'Run terraform output configuration_summary and confirm enabled_count is 4.',
      'Open Parameter Store and verify the four exact paths and updated harmless values.',
      'Keep expanded.tfvars for all remaining plan and destroy commands so Terraform uses the same map.'
    ], expected: 'Four parameters exist, automatic tags apply to all, and the learner understands variable-file precedence.', warning: 'Forgetting -var-file=expanded.tfvars later would make Terraform plan to remove the fourth parameter and restore default values.',
    commands: [
      ['terraform plan -out=tags.tfplan', 'Automatically load training.auto.tfvars and preview tag updates.', 'Three parameters update in place.'],
      ['terraform apply tags.tfplan', 'Apply only the reviewed tag plan.', 'The Owner and Purpose tags are added.'],
      ['terraform plan -var-file=expanded.tfvars -out=expanded.tfplan', 'Use the explicit complete map and save the expansion plan.', 'One parameter is added and none are destroyed.'],
      ['terraform show expanded.tfplan', 'Review the added key and changed harmless values.', 'Only exact /fa-terraform-vars resources appear.'],
      ['terraform apply expanded.tfplan', 'Apply the reviewed explicit-value plan.', 'Four parameters are managed.'],
      ['terraform output configuration_summary', 'Confirm the resulting calculated count and keys.', 'enabled_count is 4 and all four keys are listed.'],
      ['terraform state list', 'Confirm four stable resource addresses.', 'Four keyed parameter addresses are returned.']
    ], checks: [['Verify precedence', 'Run a plan with expanded.tfvars and compare it with defaults.', 'The explicit parameters map is active while the auto-loaded tags also remain active.'], ['Verify four resources', 'Compare output, state and Parameter Store.', 'All three show four exact training parameters.']]
  },
  {
    phase: 4, title: 'Trigger validation failures without changing AWS', feature: 'Variable validation, lifecycle precondition and recovery',
    goal: 'Run two deliberately invalid plans, read their useful error messages and return to a clean valid plan.',
    why: 'Good validation fails early with a message that explains how to correct input, reducing failed applies and unsafe infrastructure changes.',
    sources: ['tf-precondition', 'tf-variables', 'tf-plan'],
    blocks: [{ title: 'invalid-environment.tfvars', content: invalidEnvironmentTfvars }, { title: 'invalid-parameter.tfvars', content: invalidParameterTfvars }],
    instructions: [
      'Create invalid-environment.tfvars and paste the supplied production value.',
      'Run terraform plan -var-file=invalid-environment.tfvars.',
      'Confirm the plan stops with environment must be development or test.',
      'Understand that no AWS request changed a resource and no plan file was saved.',
      'Create invalid-parameter.tfvars and paste the supplied empty-value object.',
      'Run terraform plan -var-file=invalid-parameter.tfvars.',
      'Confirm variable validation passes because the key format is valid.',
      'Confirm the resource precondition then stops the plan because the enabled value is empty.',
      'Read the resource instance address in the error and identify broken-example as the failing map key.',
      'Do not apply either invalid configuration.',
      'Run terraform plan -var-file=expanded.tfvars -out=recovery.tfplan.',
      'Confirm the valid four-parameter configuration reports no changes.',
      'Delete only invalid-environment.tfvars and invalid-parameter.tfvars after the learning check.',
      'Keep expanded.tfvars and training.auto.tfvars until cleanup is complete.'
    ], expected: 'Both invalid plans fail locally with clear messages, AWS remains unchanged and the valid recovery plan is clean.', warning: 'A validation error is the expected result. Do not weaken or remove the conditions merely to make invalid input pass.',
    commands: [
      ['terraform plan -var-file=invalid-environment.tfvars', 'Trigger the allowed-environment variable validation.', 'Planning stops with the custom environment message.'],
      ['terraform plan -var-file=invalid-parameter.tfvars', 'Trigger the non-empty resource precondition.', 'Planning stops with the custom empty-value message.'],
      ['terraform plan -var-file=expanded.tfvars -out=recovery.tfplan', 'Return to the accepted complete variable map.', 'No changes. Your infrastructure matches the configuration.'],
      ['terraform show recovery.tfplan', 'Confirm recovery contains no infrastructure action.', 'The plan contains no add, change or destroy action.']
    ], checks: [['Verify safe failure', 'Refresh Parameter Store after both failed plans.', 'The same four parameters and values remain.'], ['Verify recovery', 'Read the recovery plan summary.', 'Terraform reports no changes.'], ['Explain validation layers', 'Compare variable validation, resource precondition and check block responsibilities.', 'The learner can state when each condition is evaluated and what it protects.']]
  },
  {
    phase: 5, title: 'Destroy all parameters and remove the training boundary', feature: 'Saved destroy plan, cloud verification, IAM and local cleanup',
    goal: 'Remove all four parameters, temporary access, profile and lab files in the correct order.',
    why: 'The same explicit variable inputs used to create resources must be supplied during teardown so Terraform sees the complete managed configuration.',
    sources: ['tf-destroy', 'tf-plan', 'aws-ssm', 'aws-iam'], blocks: [],
    instructions: [
      'Run terraform state list and confirm exactly four parameter addresses remain.',
      'Run terraform plan -destroy -var-file=expanded.tfvars -out=destroy.tfplan.',
      'Run terraform show destroy.tfplan.',
      'Confirm exactly four /fa-terraform-vars/development/ parameters will be destroyed.',
      'Confirm no unrelated Parameter Store path or AWS resource appears.',
      'Run terraform apply destroy.tfplan.',
      'Run terraform state list and confirm no resource address remains.',
      'Open Parameter Store in eu-west-2 and verify the /fa-terraform-vars/development/ search returns no lab parameter.',
      'As the administrator, delete the access key from fa-terraform-vars-user.',
      'Detach fa-terraform-vars-training-policy from the temporary user.',
      'Delete fa-terraform-vars-user.',
      'Delete fa-terraform-vars-training-policy.',
      'Remove only the fa-terraform-vars profile from local AWS credentials and config.',
      'Leave the fa-terraform-vars directory.',
      'Verify the exact directory path and delete only fa-terraform-vars with its plans, state and configuration.',
      'Confirm no named parameter, IAM resource, profile, state, plan or lab folder remains.'
    ], expected: 'Every cloud and local item created by the programme is removed.', warning: 'Use expanded.tfvars during destroy. Delete credentials and files only after Terraform has destroyed and verified all four resources.',
    commands: [
      ['terraform state list', 'Inventory the four managed parameters.', 'Exactly four keyed addresses appear.'],
      ['terraform plan -destroy -var-file=expanded.tfvars -out=destroy.tfplan', 'Create the complete saved teardown plan using the active variable map.', 'Plan: 0 to add, 0 to change, 4 to destroy.'],
      ['terraform show destroy.tfplan', 'Inspect all four exact deletions.', 'Only /fa-terraform-vars/development/ parameters appear.'],
      ['terraform apply destroy.tfplan', 'Apply the exact reviewed teardown.', 'Apply complete! Resources: 4 destroyed.'],
      ['terraform state list', 'Verify the state is empty.', 'No addresses are returned.'],
      ['aws ssm describe-parameters --parameter-filters Key=Name,Option=BeginsWith,Values=/fa-terraform-vars/development/ --region eu-west-2 --profile fa-terraform-vars', 'Verify no lab parameter remains before deleting the profile.', 'The Parameters array is empty.'],
      ['aws iam delete-access-key --user-name fa-terraform-vars-user --access-key-id <ACCESS_KEY_ID>', 'Administrator route: delete the temporary access key.', 'The key is deleted.'],
      ['aws iam detach-user-policy --user-name fa-terraform-vars-user --policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/fa-terraform-vars-training-policy', 'Administrator route: detach the exact training policy.', 'The policy is detached.'],
      ['aws iam delete-user --user-name fa-terraform-vars-user', 'Administrator route: delete the empty temporary user.', 'The user is deleted.'],
      ['aws iam delete-policy --policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/fa-terraform-vars-training-policy', 'Administrator route: delete the exact policy.', 'The policy is deleted.']
    ], checks: [['Verify AWS cleanup', 'Search Parameter Store and IAM for exact lab names.', 'No parameter, user or policy remains.'], ['Verify Terraform cleanup', 'Run state list before deleting local files.', 'The state is empty.'], ['Verify local cleanup', 'Check profiles and the filesystem.', 'The named profile and exact lab folder are absent.']]
  }
];

const tasks = definitions.map((definition, index) => {
  const id = `task-terraform-variables-${String(index + 1).padStart(3, '0')}-${slug(definition.title)}`;
  const sourceIds = definition.sources.map(sourceId);
  const task = {
    id, slug: slug(definition.title), title: definition.title, phaseId: phases[definition.phase - 1].id,
    orderInPhase: phases[definition.phase - 1].taskIds.length + 1, feature: definition.feature, goal: definition.goal,
    whyItMatters: definition.why, difficulty: index < 3 ? 'Easy' : 'Medium', estimatedMinutes: null, prerequisites: [],
    requiredPermissions: ['Use only fa-terraform-vars-user and /fa-terraform-vars/development/ training parameters.'],
    modeAvailability: { console: { status: 'available', reason: 'Complete Console and file-building guidance is included.' }, cli: { status: 'available', reason: 'Complete Terraform and AWS CLI guidance is included.' } },
    sourceIds, createdResourceKeys: [],
    consoleSteps: [consoleStep(id, 1, definition.title, definition.instructions, definition.expected, definition.warning, definition.blocks, sourceIds)],
    cliSteps: definition.commands.map((item, commandIndex) => cliStep(id, commandIndex + 1, item, sourceIds)),
    verification: definition.checks.map((item, checkIndex) => verification(id, checkIndex + 1, item)), cleanup: []
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
  ['Inventory the active map', 'Use expanded.tfvars and confirm state contains exactly four lab parameters.'],
  ['Destroy all managed parameters', 'Apply a saved destroy plan containing only the four exact training paths.'],
  ['Verify Parameter Store is clear', 'Confirm no /fa-terraform-vars/development/ parameter remains.'],
  ['Remove temporary IAM access', 'Delete the key, detach and delete the exact user and policy.'],
  ['Remove local profile and files', 'Delete only the fa-terraform-vars profile and verified lab folder.'],
  ['Acknowledge complete cleanup', 'Confirm no resource, credential, state, plan or configuration file remains.']
];
const cleanup = { completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency', steps: cleanupDescriptions.map(([title, description], index) => ({ id: `programme-cleanup-${index + 1}`, stepNumber: index + 1, title, instruction: description, description, verification: `Cleanup item ${index + 1} is complete for only the exact lab targets.`, resourceKeys: [], sourceIds: [] })) };

const authorDraftContent = {
  schema: { profile: 'canonical-follow-along', version: '1.0.0', authorPackageVersion: '1.0.0', sharedContractHash: null, createdWith: 'codex-local-handoff' },
  programme: {
    serviceSlug: 'terraform-variables-validation', serviceName: 'HashiCorp Terraform on AWS', shortName: 'Terraform Variables',
    displayName: 'Terraform Variables, Expressions and Validation Follow Along', subtitle: 'Build typed, reusable and self-validating Terraform configuration.',
    description: 'Start with no lab infrastructure. Create typed simple and complex variables, calculate locals, filter maps with for expressions, build stable resources with for_each, inspect structured outputs, use automatic and explicit tfvars files, trigger safe validation failures and remove everything in order.',
    learningOutcome: 'Confidently trace Terraform values through variables, complex types, locals, expressions, functions, for_each, outputs, tfvars precedence and custom validation.',
    programmeId, pathId: programmeId, componentNamespace: '', category: 'Terraform Variables and Expressions', difficulty: 'Beginner to Intermediate', estimatedMinutes: null,
    defaultRegion: 'eu-west-2', regionScope: 'mixed', supportedModes: ['console', 'cli', 'both'], publicationVisibility: 'unpublished', examId: 'terraform-associate-004'
  },
  sources, presentation: { accentColor: '#7c3aed', iconLabel: 'TF4', iconName: 'Braces', badgeText: 'Terraform Card 4' }, storage: {},
  progress: { initialTaskId: tasks[0].id, supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
  capabilities: {}, phases, tasks, resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: { region: 'eu-west-2' } },
  warnings: {
    cost: 'Standard Parameter Store parameters used by this lab normally have no additional charge. Delete all four during cleanup.',
    safety: 'Operate only under /fa-terraform-vars/development/. Supply expanded.tfvars to every later plan and destroy command.',
    credentials: 'Never place credentials, passwords, tokens or real secrets in .tf, .tfvars, plans, state, Author, Git, screenshots or chat.',
    region: 'Use eu-west-2 for Parameter Store. IAM is global. Verify the AWS account before creating or deleting anything.'
  },
  cleanup, extensions: { registrations: [] },
  review: {
    validationStatus: 'passed', validationErrors: [], validationWarnings: [], sourceReviewStatus: 'reviewed', learnerPreviewStatus: 'reviewed', approvalDecision: 'pending', reviewStatus: 'ready_for_approval',
    findings: [
      { id: 'finding-1', findingNumber: 1, section: 'warnings', priority: 'advisory', message: 'An administrator must review the temporary Parameter Store training policy before attachment.', status: 'open' },
      { id: 'finding-2', findingNumber: 2, section: 'instructions', priority: 'advisory', message: 'The explicit expanded.tfvars map must be supplied to every later plan and destroy command.', status: 'open' },
      { id: 'finding-3', findingNumber: 3, section: 'cleanup', priority: 'advisory', message: 'Terraform must destroy all parameters before temporary credentials, state and files are removed.', status: 'open' }
    ]
  }, publication: { publishStatus: 'not_published', targetProgrammeId: programmeId, proposedChanges: [] }
};

const planning = validateAuthorPlanning(authorDraftContent);
const content = validateAuthorContent(authorDraftContent);
const review = validateAuthorReview(authorDraftContent);
if (!planning.valid || !content.valid || !review.valid) {
  console.error(JSON.stringify({ planning, content, review }, null, 2));
  throw new Error('Terraform variables handoff did not pass Author validation.');
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
const acceptedFingerprintChain = Object.fromEntries(['instructions', 'resourcesAndChecks', 'cleanup', 'authoringCheck', 'learnerPreview', 'structuredReview'].map((key, index) => [`stage${index + 6}`, { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords[key]) }]));
const handoffPackage = {
  schemaVersion: 1, kind: 'author_local_handoff_package', status: 'awaiting_human_handoff_review', sessionId, preparedAt, generationMode: 'new',
  service: { officialName: 'HashiCorp Terraform on AWS', shortName: 'Terraform Variables' }, acceptedFingerprintChain, acceptedRecordManifest, authorDraftContent,
  identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'The local Author import must bind the currently signed-in Author and create exactly one private draft.' },
  summary, handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false }, acceptedStagesOneToElevenChanged: false
};
const fingerprintContent = structuredClone(handoffPackage);
delete fingerprintContent.status;
delete fingerprintContent.preparedAt;
handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprint(fingerprintContent) };
const session = {
  schemaVersion: 1, sessionId, status: 'handoff_package_ready_for_review', createdAt: preparedAt,
  inputs: { serviceName: 'HashiCorp Terraform on AWS', shortName: 'Terraform Variables', level: 'Beginner to Intermediate', goal: authorDraftContent.programme.learningOutcome, region: 'eu-west-2' },
  boundaries: { handoffPackagePrepared: true, stage12Prepared: false, authorDraftWritten: false, supabaseConnected: false, awsConnected: false, candidatePrepared: false, published: false }
};
const acceptance = buildStage90ALocalAcceptance({ session, handoffPackage, now: () => new Date('2026-08-15T14:05:00.000Z') });
const preview = [
  'AUTHOR LOCAL HANDOFF PACKAGE - TERRAFORM VARIABLES, EXPRESSIONS AND VALIDATION', '',
  `Programme: ${authorDraftContent.programme.displayName}`, 'Exam: Terraform Associate 004', 'Card: 4', `Phases: ${summary.phaseCount}`, `Tasks: ${summary.taskCount}`,
  `Separate editable checkboxes: ${summary.checkboxCount}`, `CLI commands: ${summary.cliCommandCount}`, `Verification checks: ${summary.verificationCheckCount}`,
  `Cleanup items: ${summary.cleanupItemCount}`, `Official AWS sources: ${summary.officialAwsSourceCount}`, `Official HashiCorp sources: ${summary.officialTerraformSourceCount}`,
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
