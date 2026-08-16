import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../../../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../../../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../../../src/features/followAlongAuthor/authorReview.js';
import { fingerprintJson } from '../../../../scripts/author-assistant/authorAssistantStage84D.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const sessionId = 'author-assistant-terraform-import-maintenance-codex-20260815-001';
const programmeId = 'terraform-import-maintenance-learning-path';
const preparedAt = '2026-08-15T22:30:00.000Z';
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const sourceId = key => `source-import-maintenance-${key}`;

function consoleStep(taskId, number, title, instructions, expectedResult, warning = '', blocks = [], sourceIds = []) {
  const id = `${taskId}-console-${String(number).padStart(2, '0')}-${slug(title)}`;
  return {
    id,
    stepNumber: number,
    number,
    title,
    instruction: instructions[0],
    instructions: instructions.map((text, index) => ({
      id: `${id}-checkbox-${String(index + 1).padStart(2, '0')}`,
      text,
      detail: ''
    })),
    jsonBlocks: blocks.map((block, index) => ({
      id: `${id}-editable-block-${String(index + 1).padStart(2, '0')}`,
      title: block.title,
      content: block.content,
      language: block.language,
      sourceIds
    })),
    commands: [],
    expectedResult,
    warning,
    sourceIds
  };
}

function cliStep(taskId, number, item, sourceIds) {
  const [command, explanation, expectedResult, warning = ''] = item;
  return {
    id: `${taskId}-cli-${String(number).padStart(2, '0')}`,
    stepNumber: number,
    number,
    command,
    explanation,
    expectedResult,
    instructions: [],
    commands: [],
    warning,
    sourceIds
  };
}

function verification(taskId, number, item) {
  const [title, instruction, expectedResult, mode = 'either'] = item;
  return {
    id: `${taskId}-verification-${String(number).padStart(2, '0')}`,
    title,
    instruction,
    expectedResult,
    mode
  };
}

const trainingPolicyJson = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VerifyTrainingIdentity",
      "Effect": "Allow",
      "Action": "sts:GetCallerIdentity",
      "Resource": "*"
    },
    {
      "Sid": "ListParameterMetadata",
      "Effect": "Allow",
      "Action": "ssm:DescribeParameters",
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyTheImportMaintenanceParameter",
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter",
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParameterHistory",
        "ssm:DeleteParameter",
        "ssm:AddTagsToResource",
        "ssm:RemoveTagsFromResource",
        "ssm:ListTagsForResource"
      ],
      "Resource": "arn:aws:ssm:eu-west-2:*:parameter/fa-terraform-import-maintenance/development/app-mode"
    }
  ]
}`;

const providerTf = `terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region  = "eu-west-2"
  profile = "fa-terraform-import-maintenance"
}`;

const parameterTf = `resource "aws_ssm_parameter" "application_mode" {
  name        = "/fa-terraform-import-maintenance/development/app-mode"
  description = "Harmless application mode used by the Terraform import maintenance lab"
  type        = "String"
  tier        = "Standard"
  data_type   = "text"
  value       = "console-created"

  tags = {
    Lab       = "fa-terraform-import-maintenance"
    ManagedBy = "ManualBeforeImport"
  }
}`;

const importTf = `import {
  to = aws_ssm_parameter.application_mode
  id = "/fa-terraform-import-maintenance/development/app-mode"
}`;

const outputsTf = `output "imported_parameter_name" {
  description = "The exact Parameter Store name now managed by Terraform"
  value       = aws_ssm_parameter.application_mode.name
}

output "imported_parameter_arn" {
  description = "The AWS ARN recorded after import"
  value       = aws_ssm_parameter.application_mode.arn
}`;

const sourceDefinitions = [
  ['aws-iam-safety', 'Security best practices in IAM', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', 'AWS', 'Use non-root, least-privilege and short-lived training access.'],
  ['aws-cli-install', 'Installing or updating to the latest version of the AWS CLI', 'https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html', 'AWS', 'Install and verify the AWS CLI before any AWS command.'],
  ['aws-cli-configure', 'Configuration and credential file settings in the AWS CLI', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html', 'AWS', 'Create and later remove the exact named training profile.'],
  ['aws-parameter-store', 'Working with Parameter Store', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-working-with.html', 'AWS', 'Create, inspect, update and delete the harmless String parameter.'],
  ['aws-parameter-cli', 'Creating a Parameter Store parameter using the AWS CLI', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-cli.html', 'AWS', 'Provide the complete CLI creation and verification route.'],
  ['tf-install', 'Install Terraform', 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli', 'HashiCorp', 'Install the Terraform CLI and verify that it is on PATH.'],
  ['tf-provider-requirements', 'Provider requirements', 'https://developer.hashicorp.com/terraform/language/providers/requirements', 'HashiCorp', 'Pin the required AWS provider source and compatible version.'],
  ['tf-init', 'Initialize the Terraform working directory', 'https://developer.hashicorp.com/terraform/cli/init', 'HashiCorp', 'Initialize the isolated directory and install its provider.'],
  ['tf-import-overview', 'Import existing infrastructure resources', 'https://developer.hashicorp.com/terraform/cli/import', 'HashiCorp', 'Explain the relationship between an existing object, configuration and state.'],
  ['tf-import-block', 'Import resources overview', 'https://developer.hashicorp.com/terraform/language/import', 'HashiCorp', 'Use a reviewable import block in the normal plan-and-apply workflow.'],
  ['tf-plan', 'Terraform plan command', 'https://developer.hashicorp.com/terraform/cli/commands/plan', 'HashiCorp', 'Review import, refresh-only, repair, re-import and destroy plans before applying.'],
  ['tf-state-list', 'Terraform state list command', 'https://developer.hashicorp.com/terraform/cli/commands/state/list', 'HashiCorp', 'List the exact managed resource address.'],
  ['tf-state-show', 'Terraform state show command', 'https://developer.hashicorp.com/terraform/cli/commands/state/show', 'HashiCorp', 'Inspect the imported resource attributes recorded in state.'],
  ['tf-state-rm', 'Terraform state rm command', 'https://developer.hashicorp.com/terraform/cli/commands/state/rm', 'HashiCorp', 'Safely demonstrate that removing a binding does not delete the remote object.'],
  ['tf-cli-environment', 'Terraform CLI environment variables reference', 'https://developer.hashicorp.com/terraform/cli/config/environment-variables', 'HashiCorp', 'Enable and disable diagnostic logging without persisting a log file.'],
  ['tf-destroy', 'Terraform destroy command', 'https://developer.hashicorp.com/terraform/cli/commands/destroy', 'HashiCorp', 'Remove the imported managed parameter through a reviewed destroy plan.']
];

const phases = [
  ['Prepare an isolated maintenance workspace', 'Install the tools, create restricted training access and enter a new empty folder.'],
  ['Create and describe unmanaged infrastructure', 'Create one exact Standard String parameter outside Terraform and prove that no state exists yet.'],
  ['Import the parameter into Terraform', 'Write complete configuration, plan the import, apply it and inspect the new state binding.'],
  ['Practise controlled maintenance', 'Detect drift, repair it, use diagnostic logging and safely detach and re-import the state binding.'],
  ['Destroy and acknowledge cleanup', 'Destroy the cloud parameter first, then remove credentials, state and local files in reverse-dependency order.']
].map(([title, description], index) => ({
  id: `phase-import-maintenance-${String(index + 1).padStart(2, '0')}-${slug(title)}`,
  phaseNumber: index + 1,
  title,
  description,
  taskIds: [],
  isOptional: false
}));

const resourceKeys = {
  policy: 'resource-import-maintenance-policy-fa-terraform-import-maintenance-policy',
  user: 'resource-import-maintenance-user-fa-terraform-import-maintenance-user',
  accessKey: 'resource-import-maintenance-access-key-fa-terraform-import-maintenance-user',
  profile: 'resource-import-maintenance-profile-fa-terraform-import-maintenance',
  folder: 'resource-import-maintenance-folder-fa-terraform-import-maintenance',
  parameter: 'resource-import-maintenance-parameter-app-mode',
  state: 'resource-import-maintenance-local-terraform-state'
};

const definitions = [
  {
    phase: 1,
    title: 'Install tools and create restricted training access',
    feature: 'Terraform CLI, AWS CLI, IAM and isolated local workspace',
    goal: 'Prepare a verified Terraform and AWS CLI environment, one restricted training identity and one empty working folder.',
    why: 'Import changes Terraform state and later changes a real AWS object, so the learner must establish the exact identity, Region and filesystem boundary first.',
    difficulty: 'Easy',
    sources: ['aws-iam-safety', 'aws-cli-install', 'aws-cli-configure', 'tf-install'],
    blocks: [{ title: 'fa-terraform-import-maintenance-policy.json', content: trainingPolicyJson, language: 'json' }],
    resources: [resourceKeys.policy, resourceKeys.user, resourceKeys.accessKey, resourceKeys.profile, resourceKeys.folder],
    instructions: [
      'On Windows, open the official Terraform install source, choose the Windows AMD64 download, save the ZIP, choose Extract All, create C:\\Tools\\Terraform, copy terraform.exe into that folder, open Edit the system environment variables, choose Environment Variables, edit your user Path, add C:\\Tools\\Terraform, confirm every dialog and open a new PowerShell window.',
      'On macOS or Linux, open the same official Terraform install source, select the tab for your operating system and run its displayed package-manager commands one at a time; open a new terminal when installation finishes.',
      'Open the official AWS CLI install source, select your operating system, download the current AWS CLI v2 installer, run it with the displayed default options and open a new terminal after it finishes.',
      'Run terraform version and aws --version. If either command is not found, stop and correct the installation or PATH before continuing.',
      'Sign in to the training AWS account with an existing administrator-capable identity; do not use the root user for routine lab work.',
      'Open the account menu in the upper-right and confirm that this is the intended training account.',
      'Use the Region selector in the upper-right to choose Europe (London), whose Region code is eu-west-2.',
      'In the AWS Console search box enter IAM, open IAM, choose Policies in the left navigation and choose Create policy.',
      'Choose the JSON editor, remove its existing example and paste the complete fa-terraform-import-maintenance-policy.json block shown below.',
      'Read the policy before saving: it permits identity verification, parameter listing and changes only to /fa-terraform-import-maintenance/development/app-mode in eu-west-2.',
      'Choose Next, enter fa-terraform-import-maintenance-policy as the policy name, enter Temporary access for the Terraform import maintenance lab as the description and choose Create policy.',
      'Choose Users, choose Create user, enter fa-terraform-import-maintenance-user and do not enable Console access for this CLI-only training identity.',
      'On Set permissions choose Attach policies directly, select only fa-terraform-import-maintenance-policy, choose Next, review the exact user and policy and choose Create user.',
      'Open fa-terraform-import-maintenance-user, choose Security credentials, choose Create access key, choose Command Line Interface, read and acknowledge the recommendation, enter Terraform import maintenance lab as the description and create the key.',
      'Keep the access-key screen open only while running aws configure --profile fa-terraform-import-maintenance. Enter the access key ID and secret at the protected prompts, enter eu-west-2 for Default region name and json for Default output format.',
      'Close the access-key screen after configuration. Never paste either credential into a Terraform file, command, screenshot, Author, Git or chat.',
      'For CloudShell, macOS, Linux or WSL, open a Bash terminal, create ~/fa-terraform-import-maintenance, enter it and use pwd to verify the exact folder.',
      'For Windows PowerShell, create $env:USERPROFILE\\fa-terraform-import-maintenance, enter it and use Get-Location to verify the exact folder.',
      'List the folder and confirm it contains no .tf file, .terraform directory, plan file, state file or unrelated content.'
    ],
    expected: 'Terraform and AWS CLI report versions, the named training identity resolves in the intended account, eu-west-2 is configured and the exact working folder is empty.',
    warning: 'The IAM access key is a temporary lab credential. Prefer federated temporary access where available and delete this key immediately after the cloud parameter is destroyed.',
    commands: [
      ['terraform version', 'Verify that Terraform is installed and available on PATH.', 'Terraform prints its installed version and platform.'],
      ['aws --version', 'Verify that AWS CLI v2 is installed and available on PATH.', 'The output begins aws-cli/2.'],
      ['aws configure --profile fa-terraform-import-maintenance', 'Store the temporary training key through protected prompts and set eu-west-2 with json output.', 'All four prompts complete and the named profile is written locally.', 'Never type credentials directly into a visible command.'],
      ['aws sts get-caller-identity --profile fa-terraform-import-maintenance', 'Verify the exact caller before any resource operation.', 'Account contains the intended 12-digit account and Arn ends user/fa-terraform-import-maintenance-user.'],
      ['aws configure get region --profile fa-terraform-import-maintenance', 'Verify the profile Region.', 'The command prints eu-west-2.'],
      ['mkdir -p ~/fa-terraform-import-maintenance', 'Bash route: create the exact isolated folder.', 'The command returns without an error.'],
      ['cd ~/fa-terraform-import-maintenance', 'Bash route: enter the exact folder.', 'The shell working directory changes.'],
      ['pwd', 'Bash route: display the current directory.', 'The path ends /fa-terraform-import-maintenance.'],
      ['New-Item -ItemType Directory -Path "$env:USERPROFILE\\fa-terraform-import-maintenance" -Force', 'PowerShell route: create the exact isolated folder.', 'PowerShell displays the fa-terraform-import-maintenance directory.'],
      ['Set-Location "$env:USERPROFILE\\fa-terraform-import-maintenance"', 'PowerShell route: enter the exact folder.', 'The PowerShell working directory changes.'],
      ['Get-Location', 'PowerShell route: display the current directory.', 'The path ends \\fa-terraform-import-maintenance.'],
      ['Get-ChildItem -Force', 'PowerShell route: include hidden items while checking the new folder.', 'No Terraform configuration, plan or state item appears.']
    ],
    checks: [
      ['Verify tools', 'Read the outputs from terraform version and aws --version.', 'Both commands return version information rather than a command-not-found error.', 'cli'],
      ['Verify identity and Region', 'Compare get-caller-identity and the configured Region with the Console account and Region selector.', 'The account matches, the ARN names fa-terraform-import-maintenance-user and the Region is eu-west-2.', 'either'],
      ['Verify the empty boundary', 'Show the exact current path and list hidden files.', 'The path is the new fa-terraform-import-maintenance folder and it contains no previous Terraform content.', 'cli']
    ]
  },
  {
    phase: 2,
    title: 'Create one unmanaged Parameter Store value',
    feature: 'AWS Systems Manager Parameter Store Standard String parameter',
    goal: 'Create one exact harmless parameter outside Terraform and verify that it exists in AWS while Terraform state remains absent.',
    why: 'Import begins with a real object that exists independently of Terraform. Proving that starting condition prevents confusion between creation and import.',
    difficulty: 'Easy',
    sources: ['aws-parameter-store', 'aws-parameter-cli'],
    blocks: [],
    resources: [resourceKeys.parameter],
    instructions: [
      'Choose exactly one creation route for this task: either complete the Console creation clicks or run the first AWS CLI command. Do not create the same name twice.',
      'For the Console route, use the original administrator-capable Console session, confirm the intended training account again, keep Europe (London) eu-west-2 selected, search for Systems Manager and open it; do not add Console access to the CLI-only training user.',
      'In the left navigation choose Parameter Store, then choose Create parameter.',
      'For Name enter exactly /fa-terraform-import-maintenance/development/app-mode, including the leading slash.',
      'For Description enter exactly Harmless application mode used by the Terraform import maintenance lab.',
      'Choose Standard tier, choose String as the Type, leave Data type as text and enter console-created as the Value.',
      'In Tags choose Add tag, enter Lab as the first key and fa-terraform-import-maintenance as its value.',
      'Choose Add tag again, enter ManagedBy as the second key and ManualBeforeImport as its value.',
      'Review the name, Region, tier, type, data type, value and both tags, then choose Create parameter.',
      'Open the parameter detail page and read its Overview and Tags tabs.',
      'Run the AWS CLI get-parameter and list-tags-for-resource verification commands regardless of which creation route you selected.',
      'Remain in the empty local folder and run terraform state list; because no Terraform configuration or state exists yet, the command must not show a managed address.',
      'Do not create any second parameter and do not use SecureString or a real secret in this lab.'
    ],
    expected: 'AWS shows exactly one Standard String parameter with value console-created and the two exact tags, while Terraform has no state binding.',
    warning: 'The CLI put-parameter command is an alternative to the Console clicks. Running both creation routes will produce ParameterAlreadyExists, which is not a reason to add --overwrite at this stage.',
    commands: [
      ['aws ssm put-parameter --name /fa-terraform-import-maintenance/development/app-mode --description "Harmless application mode used by the Terraform import maintenance lab" --type String --tier Standard --data-type text --value console-created --tags Key=Lab,Value=fa-terraform-import-maintenance Key=ManagedBy,Value=ManualBeforeImport --region eu-west-2 --profile fa-terraform-import-maintenance', 'CLI creation route only: create the exact Standard String parameter instead of using the Console form.', 'The JSON response contains Version 1 and Tier Standard.', 'Skip this creation command if the Console route already created the parameter.'],
      ['aws ssm get-parameter --name /fa-terraform-import-maintenance/development/app-mode --region eu-west-2 --profile fa-terraform-import-maintenance', 'Read the exact remote parameter.', 'Name, Type String, Value console-created, Version 1 and DataType text are visible.'],
      ['aws ssm list-tags-for-resource --resource-type Parameter --resource-id /fa-terraform-import-maintenance/development/app-mode --region eu-west-2 --profile fa-terraform-import-maintenance', 'Read the parameter tags.', 'The TagList contains Lab=fa-terraform-import-maintenance and ManagedBy=ManualBeforeImport.'],
      ['terraform state list', 'Prove that the remote object is not yet tracked by Terraform.', 'Terraform reports no state file or returns no resource address.']
    ],
    checks: [
      ['Verify the unmanaged object', 'Compare the Parameter Store detail page with both AWS CLI read commands.', 'All surfaces show the one exact name, Standard String type, console-created value and two exact tags.', 'either'],
      ['Verify Terraform is not managing it', 'Run terraform state list before creating configuration.', 'No aws_ssm_parameter.application_mode address exists.', 'cli']
    ]
  },
  {
    phase: 3,
    title: 'Write the matching Terraform configuration',
    feature: 'Provider requirements, resource configuration, import block and outputs',
    goal: 'Create four complete Terraform files whose declared resource exactly matches the unmanaged AWS parameter.',
    why: 'Import records a binding; it does not replace the need for configuration. A mismatch would make the first plan combine import with an unintended update.',
    difficulty: 'Easy',
    sources: ['tf-provider-requirements', 'tf-init', 'tf-import-overview', 'tf-import-block'],
    blocks: [
      { title: 'provider.tf', content: providerTf, language: 'text' },
      { title: 'parameter.tf', content: parameterTf, language: 'text' },
      { title: 'imports.tf', content: importTf, language: 'text' },
      { title: 'outputs.tf', content: outputsTf, language: 'text' }
    ],
    resources: [],
    instructions: [
      'Confirm the terminal is still inside the exact fa-terraform-import-maintenance folder.',
      'Open a plain-text code editor. In Visual Studio Code choose File, Open Folder, select fa-terraform-import-maintenance and choose Select Folder; in another editor use Save As with UTF-8 and All files so .txt is not appended.',
      'Choose New File, name it provider.tf and paste only the supplied provider.tf block.',
      'Read required_version as the minimum Terraform version that supports import blocks, and read the AWS provider source and compatible major-version constraint.',
      'Read the provider block and confirm it uses the exact eu-west-2 Region and fa-terraform-import-maintenance profile.',
      'Create parameter.tf and paste only the supplied parameter.tf block.',
      'Compare every argument in parameter.tf with the AWS detail page: exact name, description, String type, Standard tier, text data type, console-created value and two tags.',
      'Create imports.tf and paste only the supplied imports.tf block.',
      'Read to as the Terraform resource address that will receive the binding, and id as the existing AWS parameter name that the provider uses to find the object.',
      'Create outputs.tf and paste only the supplied outputs.tf block.',
      'Save all four files and use the editor file tree to verify their names end .tf rather than .tf.txt.',
      'Run terraform fmt; it may print changed filenames and must not change the meaning.',
      'Run terraform init and wait for successful backend and provider initialization.',
      'Run terraform validate and correct any reported filename and line before continuing.',
      'List the folder and identify the generated .terraform directory and .terraform.lock.hcl lock file.',
      'Do not run terraform apply in this task; the import must first be reviewed as a saved plan.'
    ],
    expected: 'Four exact editable .tf files exist, Terraform initializes the AWS provider and validation reports that the configuration is valid.',
    warning: 'The parameter value is intentionally harmless plaintext. Never copy a password, access key, token or real secret into configuration or state.',
    commands: [
      ['terraform fmt', 'Format every .tf file in the current folder.', 'Terraform returns normally and may list formatted filenames.'],
      ['terraform init', 'Initialize the local backend and install the required AWS provider.', 'Terraform has been successfully initialized! appears.'],
      ['terraform validate', 'Check syntax, provider schema, references and the import block.', 'Success! The configuration is valid.'],
      ['terraform providers', 'Show which provider the configuration requires.', 'The output lists registry.terraform.io/hashicorp/aws under the root configuration.'],
      ['Get-ChildItem -Force', 'PowerShell route: show the four source files plus generated initialization items.', 'provider.tf, parameter.tf, imports.tf, outputs.tf, .terraform and .terraform.lock.hcl are visible.'],
      ['ls -la', 'Bash route: show the four source files plus generated initialization items.', 'provider.tf, parameter.tf, imports.tf, outputs.tf, .terraform and .terraform.lock.hcl are visible.']
    ],
    checks: [
      ['Verify exact filenames and blocks', 'Open each of the four files and compare it character-for-character with its supplied editable block.', 'The file names and contents match, with no .txt suffix or omitted argument.', 'either'],
      ['Verify initialization and validation', 'Read the final lines from terraform init and terraform validate.', 'Initialization succeeds and validation says the configuration is valid.', 'cli']
    ]
  },
  {
    phase: 3,
    title: 'Plan and apply the declarative import',
    feature: 'Import block, saved plan, local state and outputs',
    goal: 'Bind the existing parameter to aws_ssm_parameter.application_mode without creating or destroying a remote object.',
    why: 'A reviewed import plan proves that Terraform will adopt the existing object at one stable address rather than attempt to replace it.',
    difficulty: 'Medium',
    sources: ['tf-import-overview', 'tf-import-block', 'tf-plan', 'tf-state-list', 'tf-state-show', 'aws-parameter-store'],
    blocks: [],
    resources: [resourceKeys.state],
    instructions: [
      'Run terraform plan -out=initial-import.tfplan from the initialized folder.',
      'Read the summary and require exactly 1 to import, 0 to add, 0 to change and 0 to destroy.',
      'In the plan body identify aws_ssm_parameter.application_mode and the exact import ID /fa-terraform-import-maintenance/development/app-mode.',
      'Stop if Terraform proposes an add, update, replacement or destroy; compare the Console fields with parameter.tf until the plan is import-only.',
      'Run terraform show initial-import.tfplan and review the saved plan a second time.',
      'Run terraform apply initial-import.tfplan only after the saved plan is import-only.',
      'Run terraform state list and confirm exactly one address: aws_ssm_parameter.application_mode.',
      'Run terraform state show aws_ssm_parameter.application_mode and compare name, description, type, tier, data_type, value and tags with parameter.tf.',
      'Run both terraform outputs and confirm the name and ARN refer to the exact eu-west-2 parameter.',
      'Open Systems Manager, choose Parameter Store and refresh the detail page.',
      'Confirm the parameter still exists, retains Version 1 and has not been recreated; import changed Terraform state, not the remote object.',
      'Keep imports.tf in place because the later state-recovery exercise deliberately uses the same declarative import again.'
    ],
    expected: 'Terraform imports exactly one existing parameter, state lists one stable address and AWS still shows the same Version 1 object.',
    warning: 'Never apply an import plan that includes an unexplained add, change, replace or destroy action.',
    commands: [
      ['terraform plan -out=initial-import.tfplan', 'Create a saved plan for the declarative import.', 'Plan: 1 to import, 0 to add, 0 to change, 0 to destroy.'],
      ['terraform show initial-import.tfplan', 'Inspect the immutable saved plan before applying it.', 'Only aws_ssm_parameter.application_mode is marked for import.'],
      ['terraform apply initial-import.tfplan', 'Apply the exact reviewed import plan.', 'Apply completes with one imported resource and no remote create, change or destroy.'],
      ['terraform state list', 'List all addresses in local state.', 'Exactly aws_ssm_parameter.application_mode is printed.'],
      ['terraform state show aws_ssm_parameter.application_mode', 'Display the imported attributes stored for the one address.', 'The exact name, description, String type, Standard tier, text data type, console-created value and tags are shown.'],
      ['terraform output imported_parameter_name', 'Read the learner-facing imported name output.', 'The output is /fa-terraform-import-maintenance/development/app-mode.'],
      ['terraform output imported_parameter_arn', 'Read the provider-computed ARN output.', 'The ARN contains ssm, eu-west-2 and parameter/fa-terraform-import-maintenance/development/app-mode.'],
      ['aws ssm get-parameter --name /fa-terraform-import-maintenance/development/app-mode --region eu-west-2 --profile fa-terraform-import-maintenance', 'Verify the same AWS object after import.', 'The parameter remains Version 1 with value console-created.']
    ],
    checks: [
      ['Verify an import-only plan', 'Compare the saved plan summary with the import block and resource address.', 'There is one import and zero add, change or destroy actions.', 'cli'],
      ['Verify one state binding', 'Compare terraform state list and terraform state show with Parameter Store.', 'One Terraform address maps to the one exact AWS parameter.', 'either'],
      ['Verify no recreation', 'Read the parameter Version in AWS after apply.', 'Version remains 1, demonstrating that import did not recreate or overwrite the object.', 'either']
    ]
  },
  {
    phase: 4,
    title: 'Detect drift and restore the declared value',
    feature: 'Out-of-band change, refresh-only preview and normal repair plan',
    goal: 'Make one deliberate harmless Console change, observe it without accepting it and restore the configuration value through a saved plan.',
    why: 'Maintenance requires distinguishing a refresh-only state reconciliation from a normal plan that changes AWS back to the declared configuration.',
    difficulty: 'Medium',
    sources: ['aws-parameter-store', 'aws-parameter-cli', 'tf-plan'],
    blocks: [],
    resources: [],
    instructions: [
      'Choose exactly one drift route: either edit through Parameter Store in the Console or run the AWS CLI overwrite command. Do not update twice.',
      'For the Console route, open Systems Manager in eu-west-2, choose Parameter Store and open /fa-terraform-import-maintenance/development/app-mode.',
      'Choose Edit, leave the name, description, Standard tier, String type, text data type and tags unchanged, replace only the value with console-drifted and save changes.',
      'Refresh the detail page and confirm the visible value is console-drifted and Version is 2.',
      'Run terraform plan -refresh-only -out=observed-drift.tfplan.',
      'Read the refresh-only plan as an observation of the remote change; do not apply observed-drift.tfplan because the declared configuration still says console-created.',
      'Run terraform plan -out=repair-drift.tfplan in normal mode.',
      'Confirm the plan proposes one in-place update from console-drifted back to console-created, with zero additions and zero destroys.',
      'Run terraform show repair-drift.tfplan, verify only the value changes and then apply the saved repair plan.',
      'Open the parameter in the Console and refresh it; confirm the value is console-created and the Version has advanced to 3.',
      'Run the AWS CLI read command and a new terraform plan to prove AWS and configuration agree again.',
      'Keep observed-drift.tfplan and repair-drift.tfplan until final cleanup so every generated local file is removed together after cloud cleanup.'
    ],
    expected: 'The refresh-only plan reports the out-of-band value, the normal saved plan restores console-created and the final plan reports no changes.',
    warning: 'Do not apply the refresh-only plan in this exercise. Applying it would accept the remote drift into state without changing the configuration that caused the mismatch.',
    commands: [
      ['aws ssm put-parameter --name /fa-terraform-import-maintenance/development/app-mode --type String --value console-drifted --overwrite --region eu-west-2 --profile fa-terraform-import-maintenance', 'CLI drift route only: replace the harmless value outside Terraform.', 'The response contains Version 2 and Tier Standard.', 'Skip this overwrite command if the Console route already created the drift.'],
      ['terraform plan -refresh-only -out=observed-drift.tfplan', 'Preview only the state and output changes caused by the remote edit.', 'Terraform reports that the object changed outside Terraform and does not propose a remote write.'],
      ['terraform show observed-drift.tfplan', 'Inspect the saved observation without applying it.', 'The value observed from AWS is console-drifted.'],
      ['terraform plan -out=repair-drift.tfplan', 'Create a normal saved plan that restores the declared value.', 'Plan: 0 to add, 1 to change, 0 to destroy.'],
      ['terraform show repair-drift.tfplan', 'Verify the exact in-place repair before applying.', 'Only value changes from console-drifted to console-created.'],
      ['terraform apply repair-drift.tfplan', 'Apply the reviewed normal repair plan.', 'Apply complete! Resources: 0 added, 1 changed, 0 destroyed.'],
      ['aws ssm get-parameter --name /fa-terraform-import-maintenance/development/app-mode --region eu-west-2 --profile fa-terraform-import-maintenance', 'Read the repaired AWS value and version.', 'Value is console-created and Version is 3.'],
      ['terraform plan', 'Confirm the repaired remote object now matches configuration and state.', 'No changes. Your infrastructure matches the configuration.']
    ],
    checks: [
      ['Verify drift was visible', 'Read observed-drift.tfplan and the Parameter Store Version before repair.', 'The plan sees console-drifted and AWS shows Version 2.', 'either'],
      ['Verify the repair scope', 'Read repair-drift.tfplan before apply.', 'Only one in-place value update appears, with no add, replace or destroy.', 'cli'],
      ['Verify convergence', 'Compare the final AWS CLI value with a fresh Terraform plan.', 'AWS returns console-created and Terraform reports no changes.', 'either']
    ]
  },
  {
    phase: 4,
    title: 'Use diagnostic logging without saving a log file',
    feature: 'TF_LOG diagnostic environment variable and clean planning',
    goal: 'Temporarily enable INFO logging for one no-change plan, recognize diagnostic lines and disable logging immediately.',
    why: 'Verbose logging helps diagnose provider and state operations, but it can expose request details and should be enabled only for a controlled interval.',
    difficulty: 'Medium',
    sources: ['tf-cli-environment', 'tf-plan'],
    blocks: [],
    resources: [],
    instructions: [
      'Confirm a normal terraform plan reports no changes before enabling diagnostics.',
      'Choose the command set for your shell: use the PowerShell environment commands in PowerShell, or the export and unset commands in Bash, macOS, Linux or WSL.',
      'Set TF_LOG to INFO. This sends additional diagnostic lines to the terminal standard-error stream and does not create a file because TF_LOG_PATH is not set.',
      'Run terraform plan and look for timestamped INFO lines describing Terraform or provider activity followed by the normal no-change result.',
      'Do not copy or share diagnostic output; provider logs can contain account, resource or request details even when this lab uses only harmless data.',
      'Disable logging immediately with Remove-Item Env:TF_LOG in PowerShell or unset TF_LOG in Bash.',
      'Run terraform plan again and confirm the timestamped INFO lines are gone while the no-change result remains.',
      'Use Get-ChildItem Env:TF_LOG in PowerShell or printenv TF_LOG in Bash to verify that the variable is absent.',
      'List the working folder and confirm no terraform.log file exists because no TF_LOG_PATH was configured.'
    ],
    expected: 'One plan displays INFO diagnostics, logging is then disabled, the next plan is quiet and no diagnostic file exists.',
    warning: 'Terraform logs can contain sensitive operational details. This exercise displays INFO output only in the terminal and never persists or shares it.',
    commands: [
      ['terraform plan', 'Establish a clean baseline before logging.', 'No changes. Your infrastructure matches the configuration.'],
      ['$env:TF_LOG = "INFO"', 'PowerShell route: enable INFO diagnostics for the current process.', 'PowerShell sets TF_LOG without printing credential data.'],
      ['terraform plan', 'PowerShell or Bash route: run one diagnostic plan.', 'Timestamped INFO lines appear and the plan still reports no changes.'],
      ['Remove-Item Env:TF_LOG', 'PowerShell route: disable Terraform logging.', 'The TF_LOG environment entry is removed.'],
      ['Get-ChildItem Env:TF_LOG', 'PowerShell route: verify logging is disabled.', 'PowerShell reports that Env:TF_LOG does not exist.'],
      ['export TF_LOG=INFO', 'Bash route: enable INFO diagnostics for the current shell.', 'The command returns to the prompt without output.'],
      ['terraform plan', 'Bash route: run one diagnostic plan.', 'Timestamped INFO lines appear and the plan still reports no changes.'],
      ['unset TF_LOG', 'Bash route: disable Terraform logging.', 'The command returns to the prompt without output.'],
      ['printenv TF_LOG', 'Bash route: verify logging is disabled.', 'No value is printed.'],
      ['terraform plan', 'Verify normal quiet behavior after disabling TF_LOG.', 'No timestamped INFO stream appears and Terraform reports no changes.']
    ],
    checks: [
      ['Verify temporary diagnostics', 'Compare the plan while TF_LOG=INFO with the plan after TF_LOG is removed.', 'Only the first plan contains timestamped INFO diagnostics; both report no infrastructure changes.', 'cli'],
      ['Verify no log artifact', 'List all files in the exact working folder.', 'No terraform.log or other diagnostic log file exists.', 'cli']
    ]
  },
  {
    phase: 4,
    title: 'Detach and re-import the state binding safely',
    feature: 'terraform state rm dry run, remote verification and declarative re-import',
    goal: 'Remove only the Terraform binding, prove the AWS object survives and recover the binding through the existing import block.',
    why: 'State repair is hazardous unless the learner understands that forgetting an address is different from destroying its remote object and verifies both sides at every step.',
    difficulty: 'Hard',
    sources: ['tf-state-list', 'tf-state-show', 'tf-state-rm', 'tf-import-block', 'tf-plan', 'aws-parameter-store'],
    blocks: [],
    resources: [],
    instructions: [
      'Run terraform state list and require exactly aws_ssm_parameter.application_mode before changing state.',
      'Run terraform state rm -dry-run aws_ssm_parameter.application_mode and confirm exactly one matching instance is reported without modifying state.',
      'Run terraform state list again and confirm the address still exists after the dry run.',
      'Run terraform state rm aws_ssm_parameter.application_mode to remove only the binding from local state.',
      'Read the success message and note that Terraform writes a local state backup when state is modified.',
      'Run terraform state list and confirm no address remains.',
      'Immediately open Parameter Store in eu-west-2 and refresh /fa-terraform-import-maintenance/development/app-mode.',
      'Confirm the AWS parameter still exists with value console-created and Version 3; state rm did not call AWS to delete it.',
      'Do not run a normal apply while the binding is absent unless the import block is present and the plan is import-only.',
      'Open imports.tf and confirm it still maps the exact AWS name to aws_ssm_parameter.application_mode.',
      'Run terraform plan -out=reimport-binding.tfplan and require exactly 1 to import with zero add, change or destroy.',
      'Show and apply the saved re-import plan.',
      'Run terraform state list, terraform state show and the AWS CLI get command to prove the one-to-one binding is restored.',
      'Run terraform plan and require no changes before proceeding to cleanup.'
    ],
    expected: 'The dry run changes nothing, the real state removal leaves AWS untouched and the declarative re-import restores exactly one clean state binding.',
    warning: 'State removal makes Terraform forget an object without deleting it. Stop if the recovery plan proposes a new resource instead of an import.',
    commands: [
      ['terraform state list', 'Inventory the binding before state maintenance.', 'Exactly aws_ssm_parameter.application_mode is printed.'],
      ['terraform state rm -dry-run aws_ssm_parameter.application_mode', 'Preview the exact address that would be forgotten.', 'Terraform reports one matching resource instance without removing it.'],
      ['terraform state list', 'Prove the dry run left state unchanged.', 'Exactly aws_ssm_parameter.application_mode is still printed.'],
      ['terraform state rm aws_ssm_parameter.application_mode', 'Remove only the local binding after the dry-run review.', 'Successfully removed 1 resource instance(s).'],
      ['terraform state list', 'Confirm local state currently tracks no resource.', 'No resource address is printed.'],
      ['aws ssm get-parameter --name /fa-terraform-import-maintenance/development/app-mode --region eu-west-2 --profile fa-terraform-import-maintenance', 'Prove the remote parameter survived state removal.', 'AWS still returns value console-created and Version 3.'],
      ['terraform plan -out=reimport-binding.tfplan', 'Use the retained import block to rebuild the binding.', 'Plan: 1 to import, 0 to add, 0 to change, 0 to destroy.'],
      ['terraform show reimport-binding.tfplan', 'Inspect the recovery plan before applying.', 'Only the exact parameter is marked for import at aws_ssm_parameter.application_mode.'],
      ['terraform apply reimport-binding.tfplan', 'Apply the reviewed recovery plan.', 'Apply completes with one imported resource and no remote change.'],
      ['terraform state list', 'Confirm the stable address is restored.', 'Exactly aws_ssm_parameter.application_mode is printed.'],
      ['terraform state show aws_ssm_parameter.application_mode', 'Inspect the recovered state record.', 'The exact name, console-created value and two tags are shown.'],
      ['terraform plan', 'Confirm configuration, state and AWS agree after recovery.', 'No changes. Your infrastructure matches the configuration.']
    ],
    checks: [
      ['Verify dry-run safety', 'Compare state list before and after terraform state rm -dry-run.', 'The same one address exists both times.', 'cli'],
      ['Verify the remote object survived', 'Read the parameter in both AWS CLI and Parameter Store after the real state removal.', 'The exact parameter still exists with console-created and Version 3.', 'either'],
      ['Verify recovered one-to-one binding', 'Compare the re-import plan, final state list and final clean plan.', 'One import restores one address and the final plan reports no changes.', 'cli']
    ]
  },
  {
    phase: 5,
    title: 'Destroy the parameter and remove every lab artifact',
    feature: 'Saved destroy plan, AWS verification, credential removal, state and file cleanup',
    goal: 'Remove the exact cloud parameter first, then the access key, IAM identity, CLI profile, Terraform state and local folder, and acknowledge complete cleanup.',
    why: 'Deleting credentials or state before the managed object can strand infrastructure. Reverse-dependency cleanup preserves the ability to verify and recover until AWS is empty.',
    difficulty: 'Medium',
    sources: ['tf-destroy', 'tf-plan', 'tf-state-list', 'aws-parameter-store', 'aws-iam-safety', 'aws-cli-configure'],
    blocks: [],
    resources: [],
    instructions: [
      'Run terraform state list and confirm exactly aws_ssm_parameter.application_mode is tracked before teardown.',
      'Run terraform plan -destroy -out=destroy-import-maintenance.tfplan.',
      'Run terraform show destroy-import-maintenance.tfplan and confirm exactly one destroy: /fa-terraform-import-maintenance/development/app-mode.',
      'Confirm the destroy plan contains no IAM user, IAM policy or unrelated Parameter Store name.',
      'Apply the saved destroy plan and wait for Resources: 1 destroyed.',
      'Run terraform state list and confirm no resource address remains.',
      'Run the AWS CLI get command and expect ParameterNotFound, then open Parameter Store in eu-west-2, search the exact path and confirm no result.',
      'Only after both cloud verifications, sign in again with the administrator-capable identity, open IAM, choose Users, open fa-terraform-import-maintenance-user and choose Security credentials.',
      'Under Access keys, locate the one lab key, choose Actions, Deactivate, confirm, choose Actions again, choose Delete, enter the requested confirmation text and delete it.',
      'Open the Permissions tab, select fa-terraform-import-maintenance-policy, choose Remove and confirm.',
      'Return to Users, select fa-terraform-import-maintenance-user, choose Delete, enter the exact user name when requested and confirm deletion.',
      'Open IAM Policies, search fa-terraform-import-maintenance-policy, select it, choose Actions, Delete, enter the exact policy name when requested and confirm deletion.',
      'In the terminal run aws sts get-caller-identity with the training profile and confirm it now fails because the access key was deleted.',
      'Open the AWS shared credentials file and remove only the complete [fa-terraform-import-maintenance] section; leave every other profile unchanged.',
      'Open the AWS shared config file and remove only the complete [profile fa-terraform-import-maintenance] section; leave every other profile unchanged.',
      'Run aws configure list-profiles and confirm fa-terraform-import-maintenance is absent.',
      'Before deleting files, verify the exact fa-terraform-import-maintenance folder path, leave that folder and inspect the target directory name one final time.',
      'Delete only the fa-terraform-import-maintenance folder. This removes provider cache, lock file, provider.tf, parameter.tf, imports.tf, outputs.tf, initial-import.tfplan, observed-drift.tfplan, repair-drift.tfplan, reimport-binding.tfplan, destroy-import-maintenance.tfplan, terraform.tfstate and all terraform.tfstate backup files.',
      'Search Parameter Store, IAM, AWS profiles and the local filesystem for the exact lab names and confirm nothing remains.',
      'Complete the programme-cleanup acknowledgement only when the parameter, access key, IAM user, IAM policy, CLI profile, Terraform binding, state, plans, configuration and exact local folder are all absent.'
    ],
    expected: 'AWS, IAM, the named CLI profile and the exact local workspace contain no resource, credential, state, plan or file created by this programme.',
    warning: 'Do not delete the access key, profile, state or local folder until the saved Terraform destroy has completed and AWS visibly confirms the parameter is absent.',
    commands: [
      ['terraform state list', 'Inventory the one managed binding before destruction.', 'Exactly aws_ssm_parameter.application_mode is printed.'],
      ['terraform plan -destroy -out=destroy-import-maintenance.tfplan', 'Create a saved reverse-dependency destroy plan.', 'Plan: 0 to add, 0 to change, 1 to destroy.'],
      ['terraform show destroy-import-maintenance.tfplan', 'Inspect the exact cloud deletion.', 'Only /fa-terraform-import-maintenance/development/app-mode is marked for destruction.'],
      ['terraform apply destroy-import-maintenance.tfplan', 'Apply the exact reviewed cloud teardown.', 'Apply complete! Resources: 1 destroyed.'],
      ['terraform state list', 'Verify no managed address remains before credential or file cleanup.', 'No resource address is printed.'],
      ['aws ssm get-parameter --name /fa-terraform-import-maintenance/development/app-mode --region eu-west-2 --profile fa-terraform-import-maintenance', 'Verify AWS no longer has the parameter while the training credential still works.', 'AWS returns ParameterNotFound.'],
      ['aws sts get-caller-identity --profile fa-terraform-import-maintenance', 'After deleting the access key in IAM, prove the training credential no longer works.', 'AWS returns an invalid or inactive access-key error.'],
      ['aws configure list-profiles', 'After removing only the two named profile sections, verify the profile list.', 'fa-terraform-import-maintenance is absent and unrelated profiles remain.'],
      ['Set-Location "$env:USERPROFILE"', 'PowerShell route: leave the lab folder before deleting it.', 'Get-Location will show the user profile directory.'],
      ['Get-Item -LiteralPath "$env:USERPROFILE\\fa-terraform-import-maintenance"', 'PowerShell route: resolve and inspect the exact deletion target.', 'The displayed FullName ends exactly \\fa-terraform-import-maintenance.'],
      ['Remove-Item -LiteralPath "$env:USERPROFILE\\fa-terraform-import-maintenance" -Recurse -Force', 'PowerShell route: delete only the verified lab folder and its local artifacts.', 'The exact folder is removed.'],
      ['Test-Path -LiteralPath "$env:USERPROFILE\\fa-terraform-import-maintenance"', 'PowerShell route: verify local deletion.', 'False is printed.'],
      ['cd ~', 'Bash route: leave the lab folder before deleting it.', 'pwd will show the user home directory.'],
      ['realpath ~/fa-terraform-import-maintenance', 'Bash route: resolve and inspect the exact deletion target.', 'The resolved path ends exactly /fa-terraform-import-maintenance.'],
      ['rm -rf -- ~/fa-terraform-import-maintenance', 'Bash route: delete only the verified lab folder and its local artifacts.', 'The command returns without an error.'],
      ['test ! -e ~/fa-terraform-import-maintenance', 'Bash route: verify local deletion.', 'The command succeeds and prints nothing.']
    ],
    checks: [
      ['Verify cloud cleanup', 'Search Parameter Store in eu-west-2 and run the exact AWS CLI get command before deleting credentials.', 'The Console returns no matching parameter and AWS CLI returns ParameterNotFound.', 'either'],
      ['Verify IAM cleanup', 'Search IAM Users and Policies for the two exact fa-terraform-import-maintenance names.', 'Neither the user nor customer-managed policy appears and the access key is gone.', 'console'],
      ['Verify profile and filesystem cleanup', 'List AWS CLI profiles and test the exact local folder path.', 'The named profile is absent, unrelated profiles remain and the exact folder does not exist.', 'cli'],
      ['Acknowledge complete programme cleanup', 'Confirm every named cloud, credential, state and local target in the final checklist is absent.', 'The learner can truthfully record the complete programme-cleanup acknowledgement.', 'either']
    ]
  }
];

const tasks = definitions.map((definition, index) => {
  const id = `task-import-maintenance-${String(index + 1).padStart(3, '0')}-${slug(definition.title)}`;
  const phase = phases[definition.phase - 1];
  const sourceIds = definition.sources.map(sourceId);
  const task = {
    id,
    slug: slug(definition.title),
    title: definition.title,
    service: 'HashiCorp Terraform on AWS Systems Manager',
    feature: definition.feature,
    goal: definition.goal,
    whyItMatters: definition.why,
    difficulty: definition.difficulty,
    estimatedMinutes: null,
    region: 'eu-west-2',
    status: 'draft',
    phaseId: phase.id,
    orderInPhase: phase.taskIds.length + 1,
    prerequisites: [],
    isOptional: false,
    requiredPermissions: ['Use only fa-terraform-import-maintenance-user and /fa-terraform-import-maintenance/development/app-mode in eu-west-2.'],
    modeAvailability: {
      console: { status: 'available', reason: 'Complete AWS Console and graphical file-building guidance is included.' },
      cli: { status: 'available', reason: 'Complete Terraform and AWS CLI commands with visible outcomes are included.' }
    },
    sourceIds,
    concepts: [],
    values: [],
    createdResourceKeys: definition.resources,
    consoleSteps: [consoleStep(id, 1, definition.title, definition.instructions, definition.expected, definition.warning, definition.blocks, sourceIds)],
    cliSteps: definition.commands.map((item, commandIndex) => cliStep(id, commandIndex + 1, item, sourceIds)),
    verification: definition.checks.map((item, checkIndex) => verification(id, checkIndex + 1, item)),
    cleanup: []
  };
  phase.taskIds.push(id);
  return task;
});

for (let index = 1; index < tasks.length; index += 1) {
  tasks[index].prerequisites = [tasks[index - 1].id];
}

const sources = sourceDefinitions.map(([key, title, url, publisher, purpose]) => {
  const id = sourceId(key);
  return {
    id,
    title,
    url,
    publisher,
    sourceType: 'official_documentation',
    purpose,
    taskIds: tasks.filter(task => task.sourceIds.includes(id)).map(task => task.id)
  };
});

const resources = {
  schema: [
    { key: resourceKeys.policy, label: 'IAM policy fa-terraform-import-maintenance-policy', sourceTaskId: tasks[0].id, type: 'security', description: 'The exact customer-managed policy attached only to the temporary training user.', required: true },
    { key: resourceKeys.user, label: 'IAM user fa-terraform-import-maintenance-user', sourceTaskId: tasks[0].id, type: 'identity', description: 'The exact CLI-only temporary identity created for this lab.', required: true },
    { key: resourceKeys.accessKey, label: 'Access key for fa-terraform-import-maintenance-user', sourceTaskId: tasks[0].id, type: 'identity', description: 'The single temporary access key entered only through the AWS CLI protected prompt.', required: true },
    { key: resourceKeys.profile, label: 'AWS CLI profile fa-terraform-import-maintenance', sourceTaskId: tasks[0].id, type: 'identity', description: 'The exact local named profile that resolves the training credentials and eu-west-2.', required: true },
    { key: resourceKeys.folder, label: 'Local folder fa-terraform-import-maintenance', sourceTaskId: tasks[0].id, type: 'other', description: 'The isolated local folder containing only this lab configuration, plans, provider cache and state.', required: true },
    { key: resourceKeys.parameter, label: 'SSM parameter /fa-terraform-import-maintenance/development/app-mode', sourceTaskId: tasks[1].id, type: 'other', description: 'The one harmless Standard String parameter created outside Terraform, imported, maintained and destroyed.', required: true },
    { key: resourceKeys.state, label: 'Local binding aws_ssm_parameter.application_mode', sourceTaskId: tasks[3].id, type: 'other', description: 'The one Terraform state binding and its local terraform.tfstate data created by the import apply.', required: true }
  ],
  interpolationAliases: {},
  chargeableResourceKeys: [],
  variables: { region: 'eu-west-2', parameterName: '/fa-terraform-import-maintenance/development/app-mode' }
};

const cleanupDefinitions = [
  {
    title: 'Inventory the exact Terraform binding and AWS parameter',
    instruction: 'Before deletion, confirm state contains only aws_ssm_parameter.application_mode and AWS contains only /fa-terraform-import-maintenance/development/app-mode for this programme.',
    verification: 'Terraform lists one exact address and Parameter Store displays one exact programme parameter.',
    resourceKeys: [resourceKeys.state, resourceKeys.parameter],
    sourceIds: [sourceId('tf-state-list'), sourceId('aws-parameter-store')]
  },
  {
    title: 'Destroy /fa-terraform-import-maintenance/development/app-mode',
    instruction: 'Create, show and apply destroy-import-maintenance.tfplan so Terraform destroys only the exact imported Standard String parameter before any credential, state or local file is removed.',
    verification: 'Terraform reports one destroyed resource and terraform state list returns no address.',
    resourceKeys: [resourceKeys.parameter, resourceKeys.state],
    sourceIds: [sourceId('tf-destroy'), sourceId('tf-plan')]
  },
  {
    title: 'Verify Parameter Store is empty for the exact path',
    instruction: 'While the training profile still works, require ParameterNotFound from AWS CLI and no Console search result for /fa-terraform-import-maintenance/development/app-mode in eu-west-2.',
    verification: 'Both CLI and Console visibly confirm that the exact cloud parameter is absent.',
    resourceKeys: [],
    sourceIds: [sourceId('aws-parameter-store')]
  },
  {
    title: 'Delete the fa-terraform-import-maintenance-user access key',
    instruction: 'In IAM, deactivate and delete the single access key under fa-terraform-import-maintenance-user only after cloud verification succeeds.',
    verification: 'The user Security credentials tab contains no access key and the named profile can no longer authenticate.',
    resourceKeys: [resourceKeys.accessKey],
    sourceIds: [sourceId('aws-iam-safety')]
  },
  {
    title: 'Delete fa-terraform-import-maintenance-user and policy',
    instruction: 'Detach fa-terraform-import-maintenance-policy, delete fa-terraform-import-maintenance-user, then delete the now-unattached fa-terraform-import-maintenance-policy.',
    verification: 'IAM searches return no exact training user or customer-managed policy.',
    resourceKeys: [resourceKeys.user, resourceKeys.policy],
    sourceIds: [sourceId('aws-iam-safety')]
  },
  {
    title: 'Remove only the fa-terraform-import-maintenance CLI profile',
    instruction: 'Remove the exact [fa-terraform-import-maintenance] credentials section and [profile fa-terraform-import-maintenance] config section without changing any unrelated profile.',
    verification: 'aws configure list-profiles does not show fa-terraform-import-maintenance and still shows every unrelated profile.',
    resourceKeys: [resourceKeys.profile],
    sourceIds: [sourceId('aws-cli-configure')]
  },
  {
    title: 'Delete the verified fa-terraform-import-maintenance folder',
    instruction: 'Leave the exact folder, resolve its full path and delete only fa-terraform-import-maintenance with provider.tf, parameter.tf, imports.tf, outputs.tf, .terraform, .terraform.lock.hcl, every named .tfplan, terraform.tfstate and every terraform.tfstate backup.',
    verification: 'The exact local folder path no longer exists and no programme state, plan or configuration file remains.',
    resourceKeys: [resourceKeys.folder, resourceKeys.state],
    sourceIds: [sourceId('tf-state-rm')]
  },
  {
    title: 'Complete programme-cleanup acknowledgement',
    instruction: 'Acknowledge: I verified that /fa-terraform-import-maintenance/development/app-mode, fa-terraform-import-maintenance-user, its access key, fa-terraform-import-maintenance-policy, the fa-terraform-import-maintenance CLI profile, aws_ssm_parameter.application_mode, all state and plan files, and the fa-terraform-import-maintenance folder are absent.',
    verification: 'The acknowledgement names every exact programme cloud resource, credential, state binding and local artifact and is completed only after all visible checks pass.',
    resourceKeys: [],
    sourceIds: [sourceId('tf-destroy'), sourceId('aws-parameter-store'), sourceId('aws-iam-safety')]
  }
];

const cleanup = {
  completionGate: 'acknowledgement',
  manualOnly: true,
  ordering: 'reverse_dependency',
  steps: cleanupDefinitions.map((definition, index) => ({
    id: `programme-cleanup-import-maintenance-${String(index + 1).padStart(2, '0')}-${slug(definition.title)}`,
    stepNumber: index + 1,
    title: definition.title,
    instruction: definition.instruction,
    description: definition.instruction,
    verification: definition.verification,
    resourceKeys: definition.resourceKeys,
    sourceIds: definition.sourceIds
  }))
};

const authorDraftContent = {
  schema: {
    profile: 'canonical-follow-along',
    version: '1.0.0',
    authorPackageVersion: '1.0.0',
    sharedContractHash: null,
    createdWith: 'codex-local-handoff'
  },
  programme: {
    serviceSlug: 'terraform-import-maintenance',
    serviceName: 'HashiCorp Terraform on AWS Systems Manager',
    shortName: 'Terraform Import Maintenance',
    displayName: 'Terraform Import and Maintenance Follow Along',
    subtitle: 'Adopt an existing AWS parameter, diagnose drift and recover its state binding safely.',
    description: 'Start with no lab infrastructure. Prepare restricted access, create one harmless unmanaged Parameter Store String, write matching Terraform configuration, import it through a saved plan, inspect state, detect and repair deliberate drift, use temporary diagnostic logging, remove and recover the binding, then destroy every cloud and local artifact in reverse-dependency order.',
    learningOutcome: 'Confidently import an existing AWS object with an import block, distinguish configuration from state and remote infrastructure, inspect and repair drift, use TF_LOG safely, recover a removed state binding and complete verified teardown.',
    programmeId,
    pathId: programmeId,
    componentNamespace: '',
    category: 'Terraform Import, State and Maintenance',
    difficulty: 'Beginner to Intermediate',
    estimatedMinutes: null,
    defaultRegion: 'eu-west-2',
    regionScope: 'mixed',
    supportedModes: ['console', 'cli', 'both'],
    publicationVisibility: 'unpublished',
    examId: 'terraform-associate-004'
  },
  sources,
  presentation: {
    accentColor: '#0f766e',
    iconLabel: 'TF5',
    iconName: 'Import',
    badgeText: 'Terraform Card 5'
  },
  storage: {},
  progress: {
    initialTaskId: tasks[0].id,
    supportedModes: ['console', 'cli', 'both'],
    optionalTasksCountTowardsProgress: false,
    completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned']
  },
  capabilities: {},
  phases,
  tasks,
  resources,
  warnings: {
    cost: 'This programme uses one Standard Parameter Store parameter, which is normally available without an additional parameter charge at this scale. Account activity can still vary; destroy the exact parameter and verify its absence.',
    safety: 'Operate only on /fa-terraform-import-maintenance/development/app-mode and the exact named IAM and local resources. Never apply a plan containing an unrelated address, add, replacement or destroy.',
    credentials: 'Use only the temporary fa-terraform-import-maintenance-user access key through the protected AWS CLI prompt. Never place credentials or real secrets in Terraform configuration, state, plans, logs, screenshots, Author, Git or chat; delete the key after cloud cleanup.',
    region: 'Create, import, inspect, repair and destroy the parameter only in Europe (London), eu-west-2. IAM is global; always verify the account and Region before a change.'
  },
  cleanup,
  extensions: { registrations: [] },
  review: {
    validationStatus: 'passed',
    validationErrors: [],
    validationWarnings: [],
    sourceReviewStatus: 'reviewed',
    learnerPreviewStatus: 'reviewed',
    approvalDecision: 'pending',
    reviewStatus: 'ready_for_approval',
    findings: [
      { id: 'review-import-maintenance-001-credential-lifetime', findingNumber: 1, section: 'warnings', priority: 'advisory', message: 'The temporary CLI access key must be entered only through the protected prompt and deleted after the parameter is destroyed and verified absent.', status: 'open' },
      { id: 'review-import-maintenance-002-import-only-plan', findingNumber: 2, section: 'instructions', priority: 'advisory', message: 'Both initial and recovery imports must stop unless their saved plans contain one import and zero add, change or destroy actions.', status: 'open' },
      { id: 'review-import-maintenance-003-cleanup-order', findingNumber: 3, section: 'cleanup', priority: 'advisory', message: 'The AWS parameter must be destroyed and visibly absent before credentials, state, plans or local files are removed.', status: 'open' }
    ]
  },
  publication: {
    publishStatus: 'not_published',
    targetProgrammeId: programmeId,
    proposedChanges: []
  }
};

const planning = validateAuthorPlanning(authorDraftContent);
const content = validateAuthorContent(authorDraftContent);
const review = validateAuthorReview(authorDraftContent);

if (!planning.valid || !content.valid || !review.valid) {
  console.error(JSON.stringify({ planning, content, review }, null, 2));
  throw new Error('Terraform import maintenance handoff did not pass all Author validators; no handoff output was written.');
}

const summary = {
  phaseCount: phases.length,
  taskCount: tasks.length,
  checkboxCount: tasks.flatMap(task => task.consoleSteps).flatMap(step => step.instructions).length,
  cliCommandCount: tasks.flatMap(task => task.cliSteps).length,
  verificationCheckCount: tasks.flatMap(task => task.verification).length,
  cleanupItemCount: cleanup.steps.length,
  learnerResourceValueCount: resources.schema.length,
  officialSourceCount: sources.length,
  officialAwsSourceCount: sources.filter(source => source.publisher === 'AWS').length,
  officialTerraformSourceCount: sources.filter(source => source.publisher === 'HashiCorp').length
};

const stageRecords = {
  planning: {
    stage: '1-5',
    status: 'prepared_and_reviewed',
    validation: planning,
    phases: phases.map(phase => ({ id: phase.id, taskIds: phase.taskIds }))
  },
  instructions: {
    stage: '6',
    status: 'prepared_and_reviewed',
    checkboxCount: summary.checkboxCount,
    cliCommandCount: summary.cliCommandCount
  },
  resourcesAndChecks: {
    stage: '7',
    status: 'prepared_and_reviewed',
    verificationCheckCount: summary.verificationCheckCount,
    learnerResourceValueCount: summary.learnerResourceValueCount
  },
  cleanup: {
    stage: '8',
    status: 'prepared_and_reviewed',
    cleanupItemCount: summary.cleanupItemCount,
    ordering: 'reverse_dependency'
  },
  authoringCheck: {
    stage: '9',
    status: 'passed',
    planningValid: planning.valid,
    contentValid: content.valid,
    reviewValid: review.valid
  },
  learnerPreview: {
    stage: '10',
    status: 'reviewed',
    programmeId,
    summary
  },
  structuredReview: {
    stage: '11',
    status: 'ready_for_approval',
    findings: authorDraftContent.review.findings
  }
};

const acceptedRecordManifest = Object.fromEntries(
  Object.entries(stageRecords).map(([key, value]) => [key, { algorithm: 'sha256-json-v1', value: fingerprintJson(value) }])
);

const acceptedFingerprintChain = Object.fromEntries(
  ['instructions', 'resourcesAndChecks', 'cleanup', 'authoringCheck', 'learnerPreview', 'structuredReview']
    .map((key, index) => [`stage${index + 6}`, { algorithm: 'sha256-json-v1', value: fingerprintJson(stageRecords[key]) }])
);

const handoffPackage = {
  schemaVersion: 1,
  kind: 'author_local_handoff_package',
  status: 'awaiting_human_handoff_review',
  sessionId,
  preparedAt,
  generationMode: 'new',
  service: {
    officialName: 'HashiCorp Terraform on AWS Systems Manager',
    shortName: 'Terraform Import Maintenance'
  },
  acceptedFingerprintChain,
  acceptedRecordManifest,
  authorDraftContent,
  identityBinding: {
    status: 'required_before_author_write',
    assignedAuthorId: null,
    assignedDraftId: null,
    assignedRevision: null,
    rule: 'The local Author import must bind the currently signed-in Author and create exactly one private draft only after separate import approval.'
  },
  summary,
  handoffBoundary: {
    localPackageOnly: true,
    stage12Started: false,
    authorDraftWritten: false,
    authorIdentityBound: false,
    connectedToAuthor: false,
    connectedToSupabase: false,
    connectedToAws: false,
    releaseCandidatePrepared: false,
    candidateIdGenerated: false,
    approvalPerformed: false,
    published: false
  },
  acceptedStagesOneToElevenChanged: false
};

const fingerprintContent = structuredClone(handoffPackage);
delete fingerprintContent.status;
delete fingerprintContent.preparedAt;
delete fingerprintContent.handoffFingerprint;
handoffPackage.handoffFingerprint = {
  algorithm: 'sha256-json-v1',
  value: fingerprintJson(fingerprintContent)
};

const session = {
  schemaVersion: 1,
  sessionId,
  status: 'handoff_package_ready_for_review',
  createdAt: preparedAt,
  inputs: {
    serviceName: 'HashiCorp Terraform on AWS Systems Manager',
    shortName: 'Terraform Import Maintenance',
    level: 'Beginner to Intermediate',
    goal: authorDraftContent.programme.learningOutcome,
    region: 'eu-west-2'
  },
  boundaries: {
    handoffPackagePrepared: true,
    stage12Prepared: false,
    authorDraftWritten: false,
    supabaseConnected: false,
    awsConnected: false,
    candidatePrepared: false,
    published: false
  }
};

function previewTask(task) {
  const lines = [
    '',
    `${task.id}: ${task.title}`,
    `Feature: ${task.feature}`,
    `Goal: ${task.goal}`,
    `Why it matters: ${task.whyItMatters}`,
    `Difficulty: ${task.difficulty}`,
    `Phase ID: ${task.phaseId}`,
    `Prerequisites: ${task.prerequisites.length ? task.prerequisites.join(', ') : 'None'}`,
    `Modes: Console=${task.modeAvailability.console.status}; CLI=${task.modeAvailability.cli.status}`,
    `Source IDs: ${task.sourceIds.join(', ')}`,
    '',
    'CONSOLE / GRAPHICAL INSTRUCTIONS'
  ];
  task.consoleSteps.forEach(step => {
    lines.push(`${step.stepNumber}. ${step.title}`);
    step.instructions.forEach(instruction => lines.push(`[ ] ${instruction.text}`));
    step.jsonBlocks.forEach(block => {
      lines.push('', `EDITABLE BLOCK: ${block.title} [language: ${block.language}]`, block.content, 'END EDITABLE BLOCK');
    });
    lines.push(`Expected result: ${step.expectedResult}`);
    if (step.warning) lines.push(`Warning: ${step.warning}`);
  });
  lines.push('', 'CLI COMMANDS');
  task.cliSteps.forEach(step => {
    lines.push(`${step.stepNumber}. ${step.command}`, `   Why: ${step.explanation}`, `   Expected: ${step.expectedResult}`);
    if (step.warning) lines.push(`   Warning: ${step.warning}`);
  });
  lines.push('', 'VERIFICATION CHECKS');
  task.verification.forEach(check => lines.push(`- ${check.title} [${check.mode}]: ${check.instruction} Expected: ${check.expectedResult}`));
  return lines;
}

const preview = [
  'AUTHOR LOCAL HANDOFF PACKAGE - TERRAFORM IMPORT AND MAINTENANCE',
  '',
  `Programme: ${authorDraftContent.programme.displayName}`,
  `Programme ID: ${programmeId}`,
  `Exam: Terraform Associate 004`,
  `Card: 5`,
  `Phases: ${summary.phaseCount}`,
  `Tasks: ${summary.taskCount}`,
  `Separate editable checkboxes: ${summary.checkboxCount}`,
  `CLI commands: ${summary.cliCommandCount}`,
  `Verification checks: ${summary.verificationCheckCount}`,
  `Cleanup items: ${summary.cleanupItemCount}`,
  `Official sources: ${summary.officialSourceCount}`,
  `Official AWS sources: ${summary.officialAwsSourceCount}`,
  `Official HashiCorp sources: ${summary.officialTerraformSourceCount}`,
  `SHA-256 handoff fingerprint: ${handoffPackage.handoffFingerprint.value}`,
  '',
  'PHASES',
  ...phases.map(phase => `${phase.phaseNumber}. ${phase.title} [${phase.id}]\n   ${phase.description}`),
  '',
  'COMPLETE TASK CONTENT',
  ...tasks.flatMap(previewTask),
  '',
  'PROGRAMME CLEANUP - MANUAL REVERSE DEPENDENCY ORDER',
  ...cleanup.steps.flatMap(step => [
    `${step.stepNumber}. ${step.title} [${step.id}]`,
    `   Instruction: ${step.instruction}`,
    `   Verification: ${step.verification}`
  ]),
  '',
  'OFFICIAL SOURCES',
  ...sources.flatMap(source => [
    `${source.id}: ${source.title}`,
    `URL: ${source.url}`,
    `Used by: ${source.taskIds.join(', ')}`
  ]),
  '',
  'VALIDATION',
  `Planning: ${planning.valid ? 'passed' : 'failed'}`,
  `Content: ${content.valid ? 'passed' : 'failed'}`,
  `Structured review: ${review.valid ? 'passed' : 'failed'}`,
  '',
  'BOUNDARIES',
  'No Author identity is bound.',
  'Nothing was written to Author, Supabase or AWS by this builder.',
  'No release candidate or candidate ID was created.',
  'Nothing was approved or published.',
  'Stage 12 has not started.',
  'The Stage 90A acceptance file does not exist and requires exact human fingerprint approval.',
  ''
].join('\n');

await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, 'author-local-handoff-package.json'), `${JSON.stringify(handoffPackage, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'session.json'), `${JSON.stringify(session, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'complete-follow-along-preview.txt'), preview, 'utf8');

console.log(JSON.stringify({
  programme: authorDraftContent.programme.displayName,
  summary,
  fingerprint: handoffPackage.handoffFingerprint.value,
  directory,
  validation: { planning: planning.valid, content: content.valid, review: review.valid },
  acceptanceCreated: false
}, null, 2));
