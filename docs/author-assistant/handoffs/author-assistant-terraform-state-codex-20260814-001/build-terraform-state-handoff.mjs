import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../../../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../../../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../../../src/features/followAlongAuthor/authorReview.js';
import { buildStage90ALocalAcceptance } from '../../../../scripts/author-assistant/authorAssistantStage90A.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const sessionId = 'author-assistant-terraform-state-codex-20260814-001';
const programmeId = 'terraform-state-backend-learning-path';
const preparedAt = '2026-08-14T22:00:00.000Z';
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
      "Sid": "ReadCallerIdentity",
      "Effect": "Allow",
      "Action": "sts:GetCallerIdentity",
      "Resource": "*"
    },
    {
      "Sid": "CreateAndListTrainingBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyNamedTrainingBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:DeleteBucket",
        "s3:GetBucketVersioning",
        "s3:PutBucketVersioning",
        "s3:GetEncryptionConfiguration",
        "s3:PutEncryptionConfiguration",
        "s3:GetBucketPublicAccessBlock",
        "s3:PutBucketPublicAccessBlock",
        "s3:ListBucket",
        "s3:ListBucketVersions"
      ],
      "Resource": [
        "arn:aws:s3:::fa-tf-state-<ACCOUNT_ID>",
        "arn:aws:s3:::fa-tf-import-<ACCOUNT_ID>"
      ]
    },
    {
      "Sid": "ManageOnlyNamedTrainingObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObjectVersion",
        "s3:DeleteObjectVersion"
      ],
      "Resource": [
        "arn:aws:s3:::fa-tf-state-<ACCOUNT_ID>/*",
        "arn:aws:s3:::fa-tf-import-<ACCOUNT_ID>/*"
      ]
    },
    {
      "Sid": "ManageOnlyTrainingParameters",
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
      "Resource": "arn:aws:ssm:eu-west-2:<ACCOUNT_ID>:parameter/fa-terraform-state/*"
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
  description = "AWS Region for the training resources"
  type        = string
  default     = "eu-west-2"
}

variable "aws_profile" {
  description = "Named AWS CLI profile used by Terraform"
  type        = string
  default     = "fa-terraform-state"
}`;

const mainTf = `resource "aws_ssm_parameter" "demo" {
  name        = "/fa-terraform-state/\${terraform.workspace}/demo"
  description = "Terraform state training parameter"
  type        = "String"
  value       = "managed-by-terraform"

  tags = {
    ManagedBy   = "Terraform"
    Environment = terraform.workspace
    Lab         = "fa-terraform-state"
  }
}`;

const outputsTf = `output "parameter_name" {
  description = "Parameter managed in the current workspace"
  value       = aws_ssm_parameter.demo.name
}

output "active_workspace" {
  value = terraform.workspace
}`;

const backendTf = `terraform {
  backend "s3" {}
}`;

const backendHcl = `bucket       = "fa-tf-state-<ACCOUNT_ID>"
key          = "terraform-state-lab/terraform.tfstate"
region       = "eu-west-2"
use_lockfile = true
profile      = "fa-terraform-state"`;

const importTf = `resource "aws_s3_bucket" "imported" {
  bucket = "fa-tf-import-<ACCOUNT_ID>"

  tags = {
    ManagedBy = "Terraform"
    Lab       = "fa-terraform-state"
  }
}`;

const localBackendTf = `terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}`;

const deleteVersionsJson = `{
  "Objects": [
    {
      "Key": "terraform-state-lab/terraform.tfstate",
      "VersionId": "<VERSION_ID>"
    }
  ],
  "Quiet": true
}`;

const sourceDefinitions = [
  ['iam-best', 'Security best practices in IAM', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', 'AWS', 'Use a dedicated temporary training identity instead of root.'],
  ['cli-config', 'Configure the AWS CLI', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html', 'AWS', 'Configure and verify a named local profile without storing credentials in Terraform.'],
  ['s3-start', 'Getting started with Amazon S3 using the AWS CLI', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/GettingStartedS3CLI.html', 'AWS', 'Create the backend and import buckets and enable versioning.'],
  ['s3-public', 'Blocking public access to Amazon S3 storage', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html', 'AWS', 'Keep the state bucket private.'],
  ['s3-versioning', 'Using versioning in S3 buckets', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html', 'AWS', 'Protect state versions and explain final version cleanup.'],
  ['tf-backend', 'Terraform S3 backend', 'https://developer.hashicorp.com/terraform/language/backend/s3', 'HashiCorp', 'Configure remote S3 state and native lockfiles.'],
  ['tf-init', 'Terraform init command', 'https://developer.hashicorp.com/terraform/cli/commands/init', 'HashiCorp', 'Initialize locally and migrate state to and from the backend.'],
  ['tf-state-purpose', 'Purpose of Terraform state', 'https://developer.hashicorp.com/terraform/language/state/purpose', 'HashiCorp', 'Explain why Terraform maps configuration to remote objects.'],
  ['tf-state-inspect', 'Inspect Terraform state', 'https://developer.hashicorp.com/terraform/cli/state/inspect', 'HashiCorp', 'Use state list and state show safely.'],
  ['tf-plan', 'Terraform plan command', 'https://developer.hashicorp.com/terraform/cli/commands/plan', 'HashiCorp', 'Review saved normal and refresh-only plans.'],
  ['tf-workspaces', 'Manage workspaces', 'https://developer.hashicorp.com/terraform/cli/workspaces', 'HashiCorp', 'Create, select and delete an isolated development workspace.'],
  ['tf-import', 'Terraform import command', 'https://developer.hashicorp.com/terraform/cli/commands/import', 'HashiCorp', 'Bring an existing S3 bucket under Terraform state.'],
  ['tf-destroy', 'Terraform destroy command', 'https://developer.hashicorp.com/terraform/cli/commands/destroy', 'HashiCorp', 'Remove managed workload resources before deleting the backend.']
];

const sourceId = key => `source-${key}`;
const phases = [
  ['Safe identity and local state', 'Prepare temporary access and observe Terraform state in a new working folder.'],
  ['Protected remote backend', 'Create a private versioned S3 bucket and migrate state with native locking.'],
  ['State-aware operations', 'Inspect state, detect drift and understand refresh-only plans.'],
  ['Environment isolation', 'Use a second workspace without overwriting the default workspace state.'],
  ['Adopt existing infrastructure', 'Import a manually created AWS resource and reach a no-change plan.'],
  ['Complete teardown', 'Remove every managed resource, migrate the final state locally and delete the backend last.']
].map(([title, description], index) => ({ id: `phase-${index + 1}-${slug(title)}`, phaseNumber: index + 1, title, description, taskIds: [], isOptional: false }));

const definitions = [
  {
    phase: 1,
    title: 'Create dedicated Terraform state training access',
    feature: 'IAM user, policy, AWS CLI profile and working folder',
    goal: 'Start with no lab infrastructure, create one temporary training identity, verify the AWS account and prepare an empty folder.',
    why: 'State operations can change or forget infrastructure, so the learner must confirm identity, Region and folder boundaries before running Terraform.',
    sourceKeys: ['iam-best', 'cli-config'],
    console: [
      ['Create the training policy and user', [
        'Sign in to the training AWS account as an administrator; never use the root user for this lab.',
        'Open the account menu, copy the 12-digit account ID and record it as [ACCOUNT_ID].',
        'Use the Region selector to choose Europe (London) eu-west-2.',
        'Open IAM, choose Policies, then choose Create policy.',
        'Choose JSON and paste the supplied fa-terraform-state-training-policy document.',
        'Replace every <ACCOUNT_ID> placeholder with the recorded 12-digit account ID.',
        'Choose Next, name the policy fa-terraform-state-training-policy, review the named S3 and Parameter Store boundaries, then choose Create policy.',
        'Open IAM Users, choose Create user and enter fa-terraform-state-user.',
        'Attach fa-terraform-state-training-policy directly to this temporary user.',
        'Open the new user, choose Security credentials and create one CLI access key only if using local PowerShell or WSL.',
        'Store the access key only in the protected AWS CLI prompt; never paste it into Terraform files, Author, Git or chat.',
        'If using AWS CloudShell, switch to an authorized non-root training role or user before continuing.'
      ], 'The temporary user and narrowly named training policy exist, and the learner is not using root.', 'The policy is for this disposable training lab. An administrator must review it before attachment.', [{ title: 'fa-terraform-state-training-policy.json', content: iamPolicy, language: 'json' }]],
      ['Create and enter the working folder', [
        'Open AWS CloudShell or Windows PowerShell.',
        'CloudShell: run mkdir -p ~/fa-terraform-state to create the folder even if it already exists.',
        'CloudShell: run cd ~/fa-terraform-state to enter the folder.',
        'CloudShell: run pwd and confirm the path ends with /fa-terraform-state.',
        'PowerShell: run New-Item -ItemType Directory -Path "$env:USERPROFILE\\fa-terraform-state" -Force.',
        'PowerShell: run Set-Location "$env:USERPROFILE\\fa-terraform-state".',
        'PowerShell: run Get-Location and confirm the path ends with fa-terraform-state.',
        'Run terraform version and record the installed version. Terraform 1.10 or newer is required for native S3 lockfiles.',
        'Run Get-ChildItem in PowerShell or ls -la in CloudShell and confirm the folder contains no old state or configuration.'
      ], 'The terminal is in one empty fa-terraform-state folder and Terraform 1.10 or newer is available.']
    ],
    cli: [
      ['aws configure --profile fa-terraform-state', 'Enter the temporary access key, secret, eu-west-2 and json directly into the protected prompt.', 'The named profile is stored locally; secrets are not printed.'],
      ['aws sts get-caller-identity --profile fa-terraform-state', 'Verify the exact caller and account before Terraform can make changes.', 'The ARN identifies fa-terraform-state-user in [ACCOUNT_ID].'],
      ['terraform version', 'Verify a Terraform version that supports native S3 lockfiles.', 'Terraform reports version 1.10 or newer.'],
      ['mkdir -p ~/fa-terraform-state', 'CloudShell or WSL: create the isolated working folder.', 'The folder exists.'],
      ['cd ~/fa-terraform-state', 'CloudShell or WSL: enter the exact lab folder.', 'The terminal enters fa-terraform-state.'],
      ['pwd', 'CloudShell or WSL: print the current folder.', 'The path ends with /fa-terraform-state.'],
      ['New-Item -ItemType Directory -Path "$env:USERPROFILE\\fa-terraform-state" -Force', 'PowerShell: create the isolated working folder.', 'PowerShell displays the folder.'],
      ['Set-Location "$env:USERPROFILE\\fa-terraform-state"', 'PowerShell: enter the exact lab folder.', 'The current folder changes.'],
      ['Get-Location', 'PowerShell: print the current folder.', 'The path ends with fa-terraform-state.']
    ],
    checks: [
      ['Verify identity', 'Read the caller ARN and account from aws sts get-caller-identity.', 'The caller is the temporary training user in [ACCOUNT_ID].'],
      ['Verify the clean boundary', 'List the current folder and confirm no terraform.tfstate, backend.tf or unrelated .tf files exist.', 'The lab begins in an empty isolated folder.']
    ]
  },
  {
    phase: 1,
    title: 'Create the first configuration and local state',
    feature: 'Terraform configuration, plan, apply and local state',
    goal: 'Create one harmless Parameter Store parameter and inspect how local state records it.',
    why: 'The learner needs a real local state file before practising a controlled migration to S3.',
    sourceKeys: ['tf-init', 'tf-state-purpose', 'tf-state-inspect', 'tf-plan'],
    blocks: [
      { title: 'versions.tf', content: versionsTf, language: 'text' },
      { title: 'variables.tf', content: variablesTf, language: 'text' },
      { title: 'main.tf', content: mainTf, language: 'text' },
      { title: 'outputs.tf', content: outputsTf, language: 'text' }
    ],
    console: [[
      'Create, validate and apply the local-state configuration', [
        'Remain inside the empty fa-terraform-state folder.',
        'Create versions.tf and paste the supplied versions.tf block exactly.',
        'Create variables.tf and paste the supplied variables.tf block exactly.',
        'Create main.tf and paste the supplied main.tf block exactly.',
        'Create outputs.tf and paste the supplied outputs.tf block exactly.',
        'Understand that terraform.workspace is default during the first run, so the parameter name becomes /fa-terraform-state/default/demo.',
        'Run terraform fmt and confirm Terraform formats the files without creating AWS resources.',
        'Run terraform init and confirm the AWS provider is installed for the local backend.',
        'Run terraform validate and correct any named file and line before continuing.',
        'Run terraform plan -out=local.tfplan and confirm exactly one aws_ssm_parameter.demo will be added.',
        'Run terraform show local.tfplan and read the parameter name, value type and tags.',
        'Run terraform apply local.tfplan only after the saved plan is understood.',
        'Open AWS Systems Manager in eu-west-2, choose Parameter Store and open /fa-terraform-state/default/demo.',
        'Verify its value is managed-by-terraform and its ManagedBy tag is Terraform.',
        'Return to the terminal and run terraform state list.',
        'Run terraform state show aws_ssm_parameter.demo and compare the recorded name with the Console.',
        'List the folder and identify terraform.tfstate; do not open, edit, copy or commit this sensitive state file.'
      ], 'One Parameter Store parameter exists and local state tracks aws_ssm_parameter.demo.', 'Terraform state can contain sensitive values. Never paste or commit terraform.tfstate.', []
    ]],
    cli: [
      ['terraform fmt', 'Apply standard formatting to all .tf files.', 'Terraform completes without creating resources.'],
      ['terraform init', 'Initialize the local backend and install the AWS provider.', 'Terraform reports successful initialization.'],
      ['terraform validate', 'Check the combined configuration.', 'Success! The configuration is valid.'],
      ['terraform plan -out=local.tfplan', 'Create a saved plan for the default workspace parameter.', 'Plan: 1 to add, 0 to change, 0 to destroy.'],
      ['terraform show local.tfplan', 'Inspect the exact saved plan before applying it.', 'The output names /fa-terraform-state/default/demo.'],
      ['terraform apply local.tfplan', 'Apply only the reviewed plan file.', 'Apply complete! Resources: 1 added.'],
      ['terraform state list', 'List addresses stored in local state.', 'aws_ssm_parameter.demo is listed.'],
      ['terraform state show aws_ssm_parameter.demo', 'Inspect the resource as Terraform records it.', 'The parameter name, type and tags are visible.']
    ],
    checks: [
      ['Verify AWS and state agree', 'Compare the Parameter Store name and tags with terraform state show.', 'Both surfaces identify the same default-workspace parameter.'],
      ['Verify local state protection', 'Confirm terraform.tfstate is not staged in Git and is not copied into notes.', 'The state file remains only in the isolated local folder.']
    ]
  },
  {
    phase: 2,
    title: 'Create the protected S3 backend bucket',
    feature: 'Amazon S3 backend prerequisites',
    goal: 'Create one private encrypted versioned bucket outside Terraform so it can hold Terraform state.',
    why: 'A backend must exist before Terraform can initialize it, and versioning helps recover from accidental state changes.',
    sourceKeys: ['s3-start', 's3-public', 's3-versioning', 'tf-backend'],
    console: [[
      'Create and verify the backend bucket', [
        'Open Amazon S3 in the same [ACCOUNT_ID].',
        'Choose Create bucket.',
        'For Bucket name, enter fa-tf-state-<ACCOUNT_ID> after replacing <ACCOUNT_ID> with the recorded 12-digit value.',
        'For AWS Region, choose Europe (London) eu-west-2.',
        'Keep Object Ownership set to ACLs disabled.',
        'Keep Block all public access selected and do not add a public bucket policy.',
        'Turn Bucket Versioning on.',
        'Keep default encryption enabled with Amazon S3 managed keys (SSE-S3).',
        'Add tag Lab = fa-terraform-state.',
        'Choose Create bucket.',
        'Open the exact bucket, choose Properties and verify Versioning is Enabled and Default encryption is SSE-S3.',
        'Choose Permissions and verify all four Block Public Access settings are On.',
        'Confirm the Objects tab is empty before state migration.'
      ], 'The exact fa-tf-state-<ACCOUNT_ID> bucket is empty, private, encrypted and versioned.', 'Do not place ordinary files or credentials in the state bucket.'
    ]],
    cli: [
      ['aws s3api create-bucket --bucket fa-tf-state-<ACCOUNT_ID> --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-terraform-state', 'Create the uniquely named London Region backend bucket.', 'The response returns the bucket location.'],
      ['aws s3api put-bucket-versioning --bucket fa-tf-state-<ACCOUNT_ID> --versioning-configuration Status=Enabled --profile fa-terraform-state', 'Enable recoverable object versions.', 'The command completes without an error.'],
      ['aws s3api put-public-access-block --bucket fa-tf-state-<ACCOUNT_ID> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --profile fa-terraform-state', 'Explicitly enable all bucket-level public access blocks.', 'The command completes without an error.'],
      ['aws s3api put-bucket-encryption --bucket fa-tf-state-<ACCOUNT_ID> --server-side-encryption-configuration Rules=[{ApplyServerSideEncryptionByDefault={SSEAlgorithm=AES256}}] --profile fa-terraform-state', 'Explicitly configure SSE-S3 default encryption.', 'The command completes without an error.'],
      ['aws s3api get-bucket-versioning --bucket fa-tf-state-<ACCOUNT_ID> --profile fa-terraform-state', 'Read the versioning setting.', 'Status is Enabled.'],
      ['aws s3api get-public-access-block --bucket fa-tf-state-<ACCOUNT_ID> --profile fa-terraform-state', 'Read all four public-access settings.', 'All four values are true.'],
      ['aws s3api get-bucket-encryption --bucket fa-tf-state-<ACCOUNT_ID> --profile fa-terraform-state', 'Read the encryption rule.', 'SSEAlgorithm is AES256.']
    ],
    checks: [[
      'Verify all backend protections',
      'Confirm the exact bucket name, eu-west-2 Region, Enabled versioning, SSE-S3 encryption and all four public access blocks.',
      'Every protection is visible and the bucket contains no objects before migration.'
    ]]
  },
  {
    phase: 2,
    title: 'Migrate local state and enable native locking',
    feature: 'S3 backend, terraform init -migrate-state and use_lockfile',
    goal: 'Move the existing state into S3 without recreating the Parameter Store resource and enable native S3 state locking.',
    why: 'Teams need shared state and locking so two writers cannot silently update the same state at once.',
    sourceKeys: ['tf-backend', 'tf-init', 'tf-state-inspect', 's3-versioning'],
    blocks: [
      { title: 'backend.tf', content: backendTf, language: 'text' },
      { title: 'backend.hcl', content: backendHcl, language: 'text' }
    ],
    console: [[
      'Configure and migrate the backend', [
        'Create backend.tf in fa-terraform-state and paste the supplied empty S3 backend block.',
        'Create backend.hcl and paste the supplied partial backend settings.',
        'Replace <ACCOUNT_ID> in backend.hcl with the recorded 12-digit account ID.',
        'Confirm backend.hcl contains only bucket, key, Region, use_lockfile and profile settings; it must contain no access key or secret.',
        'Run terraform fmt and terraform validate.',
        'Run terraform init -migrate-state -backend-config=backend.hcl.',
        'When Terraform asks whether to copy existing state to the S3 backend, read the source and destination and enter yes.',
        'Wait for Terraform to report successful backend configuration.',
        'Run terraform state list and confirm aws_ssm_parameter.demo is still tracked.',
        'Run terraform plan and confirm 0 to add, 0 to change, 0 to destroy.',
        'Open the S3 backend bucket and browse to terraform-state-lab/terraform.tfstate.',
        'Verify the state object has a current version and do not download or display its contents.',
        'Understand that use_lockfile creates a .tflock object only while Terraform holds a lock; it can disappear when the operation completes.',
        'Run terraform plan -lock-timeout=60s and allow it to acquire and release the backend lock normally.',
        'Refresh the S3 Objects and Versions views and identify the state key versions. Do not delete any version.'
      ], 'The S3 backend holds the state, the existing resource is unchanged and native lockfile support is enabled.', 'Never use -lock=false for a normal shared-state operation. Never edit state directly.'
    ]],
    cli: [
      ['terraform fmt', 'Format the new backend block.', 'Terraform completes without creating resources.'],
      ['terraform validate', 'Validate the configuration before changing the backend.', 'The configuration is valid.'],
      ['terraform init -migrate-state -backend-config=backend.hcl', 'Copy the existing local state into the protected S3 backend after interactive confirmation.', 'Terraform reports successful backend configuration.'],
      ['terraform state list', 'Prove that the resource remained tracked after migration.', 'aws_ssm_parameter.demo is listed.'],
      ['terraform plan', 'Confirm migration did not change infrastructure.', 'Plan: 0 to add, 0 to change, 0 to destroy.'],
      ['terraform plan -lock-timeout=60s', 'Use the configured backend lock and wait safely if another operation temporarily owns it.', 'Terraform acquires the lock, completes the plan and releases it.'],
      ['aws s3api list-object-versions --bucket fa-tf-state-<ACCOUNT_ID> --prefix terraform-state-lab/ --profile fa-terraform-state', 'List state versions without displaying state contents.', 'At least one terraform.tfstate version is returned.']
    ],
    checks: [
      ['Verify migration without replacement', 'Confirm terraform state list retains the parameter and terraform plan is a no-change plan.', 'State migrated while the AWS resource remained intact.'],
      ['Verify remote storage', 'Confirm the exact state key exists in the versioned S3 bucket.', 'terraform-state-lab/terraform.tfstate has a version ID.']
    ]
  },
  {
    phase: 3,
    title: 'Detect drift and use refresh-only safely',
    feature: 'Drift detection, refresh-only plans and configuration reconciliation',
    goal: 'Create one visible tag drift, review a refresh-only plan, then restore the declared configuration.',
    why: 'The exam distinguishes recording remote changes in state from changing infrastructure back to the configuration.',
    sourceKeys: ['tf-plan', 'tf-state-inspect', 'tf-state-purpose'],
    console: [[
      'Create one controlled drift and reconcile it', [
        'Open Systems Manager, choose Parameter Store and open /fa-terraform-state/default/demo.',
        'Open Tags and change only Environment from default to changed-outside-terraform.',
        'Do not change the parameter name, type or value.',
        'Return to fa-terraform-state and run terraform plan -refresh-only -out=refresh.tfplan.',
        'Read the plan and confirm it records the tag difference without proposing to restore the configured value.',
        'Run terraform show refresh.tfplan and verify only the Environment tag changed in the refresh-only plan.',
        'Run terraform apply refresh.tfplan to record the observed remote tag in state.',
        'Run terraform state show aws_ssm_parameter.demo and confirm state now records changed-outside-terraform.',
        'Run terraform plan -out=reconcile.tfplan.',
        'Confirm the normal plan proposes one in-place change restoring Environment = default from the configuration.',
        'Run terraform apply reconcile.tfplan.',
        'Refresh the Parameter Store Tags view and verify Environment = default.',
        'Run terraform plan one more time and confirm no changes.'
      ], 'The learner sees the difference between refresh-only state synchronization and configuration reconciliation.', 'Change only the named training parameter tag. Never experiment with unrelated production resources.'
    ]],
    cli: [
      ['terraform plan -refresh-only -out=refresh.tfplan', 'Create a saved plan that updates state to match the observed remote tag.', 'The plan shows the out-of-band Environment tag change.'],
      ['terraform show refresh.tfplan', 'Inspect the saved refresh-only plan.', 'Only the controlled tag drift is shown.'],
      ['terraform apply refresh.tfplan', 'Record the observed remote object in state without restoring configuration yet.', 'Apply completes with the refreshed state.'],
      ['terraform state show aws_ssm_parameter.demo', 'Read the refreshed state.', 'Environment is changed-outside-terraform.'],
      ['terraform plan -out=reconcile.tfplan', 'Compare refreshed state with the unchanged HCL configuration.', 'One in-place update restores Environment = default.'],
      ['terraform apply reconcile.tfplan', 'Apply only the reviewed reconciliation plan.', 'The parameter tag returns to default.'],
      ['terraform plan', 'Verify configuration, state and AWS agree again.', 'No changes. Your infrastructure matches the configuration.']
    ],
    checks: [
      ['Explain refresh-only', 'State in one sentence what refresh-only changed and what it did not change.', 'It updated Terraform state to observed AWS values; it did not restore the HCL value.'],
      ['Verify reconciliation', 'Compare HCL, state show and the Console tag.', 'All three show Environment = default.']
    ]
  },
  {
    phase: 4,
    title: 'Create and remove an isolated development workspace',
    feature: 'Terraform CLI workspaces and separate backend state paths',
    goal: 'Create a development workspace, apply one isolated parameter and return safely to default.',
    why: 'CLI workspaces create separate state instances, but they do not replace strong architectural environment separation.',
    sourceKeys: ['tf-workspaces', 'tf-backend', 'tf-plan'],
    console: [[
      'Use the development workspace without changing default', [
        'Run terraform workspace list and identify the asterisk beside default.',
        'Run terraform workspace new development.',
        'Run terraform workspace show and confirm development is active.',
        'Run terraform plan -out=development.tfplan.',
        'Confirm the plan creates /fa-terraform-state/development/demo rather than changing the default parameter.',
        'Run terraform apply development.tfplan.',
        'Open Parameter Store and verify both /fa-terraform-state/default/demo and /fa-terraform-state/development/demo exist.',
        'Open the S3 bucket and identify the development workspace state under the workspace prefix without opening its contents.',
        'Run terraform plan -destroy -out=development-destroy.tfplan and confirm only the development parameter will be destroyed.',
        'Run terraform apply development-destroy.tfplan.',
        'Verify the development parameter is absent while the default parameter remains.',
        'Run terraform workspace select default.',
        'Run terraform workspace delete development.',
        'Run terraform workspace list and confirm only default remains.'
      ], 'The development state was isolated, its resource was removed, and the learner returned to default.', 'Never delete an active workspace or a workspace that still manages resources.'
    ]],
    cli: [
      ['terraform workspace list', 'List workspace names and identify the active workspace.', 'An asterisk appears beside default.'],
      ['terraform workspace new development', 'Create and select a separate development state instance.', 'Created and switched to workspace development.'],
      ['terraform workspace show', 'Confirm which state instance later commands will use.', 'development is printed.'],
      ['terraform plan -out=development.tfplan', 'Plan the development parameter with the workspace-derived name.', 'One development parameter will be added.'],
      ['terraform apply development.tfplan', 'Apply only the reviewed development plan.', 'One resource is added.'],
      ['terraform plan -destroy -out=development-destroy.tfplan', 'Prepare the development-only teardown.', 'One resource will be destroyed.'],
      ['terraform apply development-destroy.tfplan', 'Remove the development parameter.', 'One resource is destroyed.'],
      ['terraform workspace select default', 'Return to the original state instance.', 'Switched to workspace default.'],
      ['terraform workspace delete development', 'Delete the empty development workspace state.', 'Deleted workspace development.'],
      ['terraform workspace list', 'Verify the final workspace boundary.', 'Only default remains and is active.']
    ],
    checks: [
      ['Verify state isolation', 'Confirm development created a separate parameter and separate backend state path.', 'The default resource and state were not overwritten.'],
      ['Verify workspace cleanup', 'Confirm development has no resource and no workspace entry.', 'Only the default workspace and default parameter remain.']
    ]
  },
  {
    phase: 5,
    title: 'Import an existing S3 bucket into Terraform',
    feature: 'Terraform import and configuration alignment',
    goal: 'Create one empty bucket outside Terraform, declare it in HCL, import it and reach a no-change plan.',
    why: 'Import adds an existing object to state but does not automatically create a complete maintainable configuration.',
    sourceKeys: ['tf-import', 'tf-state-inspect', 'tf-plan', 's3-start'],
    blocks: [{ title: 'Add to import.tf', content: importTf, language: 'text' }],
    console: [[
      'Create, declare and import the existing bucket', [
        'Open Amazon S3 and choose Create bucket.',
        'Enter fa-tf-import-<ACCOUNT_ID> after replacing the placeholder with the recorded account ID.',
        'Choose eu-west-2, keep ACLs disabled and keep Block all public access selected.',
        'Keep default encryption enabled and choose Create bucket.',
        'Do not upload any objects to this import bucket.',
        'Return to the default Terraform workspace and create import.tf.',
        'Paste the supplied aws_s3_bucket.imported resource block and replace <ACCOUNT_ID>.',
        'Run terraform fmt and terraform validate.',
        'Run terraform plan and observe that Terraform proposes creating the declared bucket because it is not yet in state.',
        'Do not apply that plan because the bucket already exists.',
        'Run terraform import aws_s3_bucket.imported fa-tf-import-<ACCOUNT_ID>.',
        'Run terraform state list and confirm both aws_ssm_parameter.demo and aws_s3_bucket.imported are tracked.',
        'Run terraform state show aws_s3_bucket.imported and compare the recorded bucket name with S3.',
        'Run terraform plan -out=post-import.tfplan.',
        'Read any proposed tag-only update, apply it if it exactly adds the declared ManagedBy and Lab tags, then run terraform plan again.',
        'Confirm the final plan reports no changes.'
      ], 'The pre-existing empty bucket is tracked by Terraform and the final plan has no changes.', 'Import only the exact empty training bucket. Import does not prove that the configuration describes every existing setting.'
    ]],
    cli: [
      ['aws s3api create-bucket --bucket fa-tf-import-<ACCOUNT_ID> --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-terraform-state', 'Create the empty import target outside Terraform.', 'The response returns the bucket location.'],
      ['aws s3api put-public-access-block --bucket fa-tf-import-<ACCOUNT_ID> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --profile fa-terraform-state', 'Keep the import target private.', 'The command completes without error.'],
      ['terraform fmt', 'Format import.tf.', 'Terraform completes without infrastructure changes.'],
      ['terraform validate', 'Validate the declared import address.', 'The configuration is valid.'],
      ['terraform plan', 'Demonstrate that configuration alone does not adopt an existing object.', 'Terraform proposes creating aws_s3_bucket.imported; do not apply.'],
      ['terraform import aws_s3_bucket.imported fa-tf-import-<ACCOUNT_ID>', 'Associate the exact existing bucket with the declared resource address.', 'Import successful!'],
      ['terraform state list', 'List all tracked addresses.', 'The SSM parameter and imported S3 bucket are listed.'],
      ['terraform state show aws_s3_bucket.imported', 'Inspect the imported bucket state.', 'The bucket name matches fa-tf-import-<ACCOUNT_ID>.'],
      ['terraform plan -out=post-import.tfplan', 'Review any difference between imported reality and the HCL declaration.', 'Only understood declared tag changes appear, or the plan has no changes.'],
      ['terraform apply post-import.tfplan', 'Apply only if the reviewed plan contains the two declared training tags and no replacement or deletion.', 'The tag alignment completes.'],
      ['terraform plan', 'Verify the final adopted configuration.', 'No changes. Your infrastructure matches the configuration.']
    ],
    checks: [
      ['Verify import identity', 'Compare the bucket name in state show with the S3 Console.', 'Both identify fa-tf-import-<ACCOUNT_ID>.'],
      ['Verify stable management', 'Run a final normal plan.', 'Terraform reports no changes.']
    ]
  },
  {
    phase: 6,
    title: 'Destroy workloads, migrate state locally and remove the backend',
    feature: 'Reverse-dependency teardown and backend retirement',
    goal: 'Remove every lab resource in the only safe order and retain no credentials or state bucket.',
    why: 'The backend must remain available until Terraform has destroyed managed resources and copied its final state elsewhere.',
    sourceKeys: ['tf-destroy', 'tf-init', 's3-versioning', 's3-start'],
    blocks: [
      { title: 'Replace backend.tf with this local backend block after workload destruction', content: localBackendTf, language: 'text' },
      { title: 'delete-versions.json structure', content: deleteVersionsJson, language: 'json' }
    ],
    console: [[
      'Perform the complete ordered teardown', [
        'Run terraform workspace show and confirm default is active.',
        'Run terraform state list and confirm only the default SSM parameter and imported empty S3 bucket remain.',
        'Run terraform plan -destroy -out=destroy.tfplan.',
        'Inspect destroy.tfplan and confirm it deletes only aws_ssm_parameter.demo and aws_s3_bucket.imported.',
        'Run terraform apply destroy.tfplan.',
        'Open Parameter Store and verify /fa-terraform-state/default/demo is absent.',
        'Open S3 and verify fa-tf-import-<ACCOUNT_ID> is absent.',
        'Run terraform state list and confirm it returns no resource addresses.',
        'Do not delete the backend bucket yet.',
        'Replace backend.tf with the supplied local backend block.',
        'Run terraform init -migrate-state.',
        'When asked to copy the final empty state from S3 to local, verify the direction and enter yes.',
        'Run terraform state list again and confirm the migrated local state is empty.',
        'Open fa-tf-state-<ACCOUNT_ID> in S3 and choose Empty.',
        'Enter permanently delete and empty all object versions and delete markers in that exact bucket.',
        'After the bucket is empty, choose Delete, enter the exact bucket name and delete it.',
        'Open IAM as the administrator and delete the access key for fa-terraform-state-user.',
        'Detach and delete fa-terraform-state-training-policy, then delete fa-terraform-state-user.',
        'Delete the named fa-terraform-state AWS CLI profile from the local credentials and config files without touching other profiles.',
        'Leave the lab folder, verify its exact path, and delete only fa-terraform-state.',
        'Confirm no backend bucket, import bucket, training parameters, temporary IAM identity or local lab folder remains.'
      ], 'Every named lab resource, state version, temporary credential and local file is removed.', 'Versioned S3 buckets remain non-empty until every object version and delete marker is removed. Verify the exact bucket before permanent deletion.'
    ]],
    cli: [
      ['terraform workspace show', 'Verify default is active before destruction.', 'default is printed.'],
      ['terraform state list', 'List the exact managed workload before teardown.', 'Only the default parameter and imported bucket are listed.'],
      ['terraform plan -destroy -out=destroy.tfplan', 'Create a reviewable teardown plan.', 'Exactly two managed resources will be destroyed.'],
      ['terraform show destroy.tfplan', 'Inspect every deletion before applying it.', 'Only exact fa-terraform-state resources appear.'],
      ['terraform apply destroy.tfplan', 'Apply only the saved teardown plan.', 'Apply complete! Resources: 2 destroyed.'],
      ['terraform state list', 'Verify workload state is empty while the backend still exists.', 'No resource addresses are returned.'],
      ['terraform init -migrate-state', 'After replacing backend.tf, copy the final empty state from S3 to the local backend.', 'Terraform reports successful backend configuration.'],
      ['aws s3api list-object-versions --bucket fa-tf-state-<ACCOUNT_ID> --profile fa-terraform-state', 'Inventory every remaining state version and delete marker before permanent cleanup.', 'Only keys belonging to this lab are listed.'],
      ['aws s3api delete-objects --bucket fa-tf-state-<ACCOUNT_ID> --delete file://delete-versions.json --profile fa-terraform-state', 'Delete only the version IDs copied into the reviewed JSON file; repeat after refreshing the inventory until none remain.', 'Deleted entries correspond only to the exact backend bucket versions.'],
      ['aws s3api delete-bucket --bucket fa-tf-state-<ACCOUNT_ID> --region eu-west-2 --profile fa-terraform-state', 'Delete the exact empty backend bucket after migration.', 'The command completes without error.'],
      ['aws iam delete-access-key --user-name fa-terraform-state-user --access-key-id <ACCESS_KEY_ID>', 'Administrator route: delete only the temporary user access key.', 'The key is deleted.'],
      ['aws iam detach-user-policy --user-name fa-terraform-state-user --policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/fa-terraform-state-training-policy', 'Administrator route: detach the exact training policy.', 'The policy is detached.'],
      ['aws iam delete-user --user-name fa-terraform-state-user', 'Administrator route: delete the empty temporary user.', 'The user is deleted.'],
      ['aws iam delete-policy --policy-arn arn:aws:iam::<ACCOUNT_ID>:policy/fa-terraform-state-training-policy', 'Administrator route: delete the exact customer-managed training policy.', 'The policy is deleted.']
    ],
    checks: [
      ['Verify AWS cleanup', 'Search S3, Parameter Store and IAM for every exact fa-terraform-state and fa-tf-import name.', 'No named lab resource remains.'],
      ['Verify backend order', 'Confirm workload destruction and local state migration occurred before deleting the backend bucket.', 'The backend was available for every Terraform state operation.'],
      ['Verify local cleanup', 'Confirm the named CLI profile and exact fa-terraform-state folder are absent.', 'No temporary credential, plan or state file remains locally.']
    ]
  }
];

const tasks = definitions.map((definition, index) => {
  const id = `task-terraform-state-${String(index + 1).padStart(3, '0')}-${slug(definition.title)}`;
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
    difficulty: index < 2 ? 'Easy' : 'Medium',
    estimatedMinutes: null,
    prerequisites: index ? [definitions[index - 1]._id].filter(Boolean) : [],
    requiredPermissions: ['Use only the temporary fa-terraform-state training identity and exact named resources.'],
    modeAvailability: {
      console: { status: 'available', reason: 'Complete browser guidance is included.' },
      cli: { status: 'available', reason: 'Complete Terraform and AWS CLI guidance is included.' }
    },
    sourceIds,
    createdResourceKeys: [],
    consoleSteps: definition.console.map((item, stepIndex) => {
      const [title, instructions, expectedResult, warning = '', itemBlocks = []] = item;
      const blocks = itemBlocks.length ? itemBlocks : (definition.blocks || []);
      return consoleStep(id, stepIndex + 1, title, instructions, expectedResult, warning, blocks, sourceIds);
    }),
    cliSteps: definition.cli.map((item, stepIndex) => cliStep(id, stepIndex + 1, ...item, sourceIds)),
    verification: definition.checks.map((item, checkIndex) => verification(id, checkIndex + 1, ...item)),
    cleanup: []
  };
  definition._id = id;
  phases[definition.phase - 1].taskIds.push(id);
  return task;
});

for (let index = 1; index < tasks.length; index += 1) tasks[index].prerequisites = [tasks[index - 1].id];

const sources = sourceDefinitions.map(([key, title, url, publisher, purpose]) => {
  const id = sourceId(key);
  return { id, title, url, publisher, sourceType: 'official_documentation', purpose, taskIds: tasks.filter(task => task.sourceIds.includes(id)).map(task => task.id) };
});

const cleanupDescriptions = [
  ['Remove the development workspace workload', 'Destroy the development workspace parameter before returning to default and deleting the empty workspace.'],
  ['Remove default managed resources', 'Destroy the default Parameter Store parameter and imported empty S3 bucket using a reviewed saved destroy plan.'],
  ['Migrate the final empty state locally', 'Change to the local backend and run terraform init -migrate-state before touching the S3 backend bucket.'],
  ['Empty and delete the versioned backend bucket', 'Delete every version and delete marker only from fa-tf-state-<ACCOUNT_ID>, then delete that exact empty bucket.'],
  ['Remove temporary IAM access', 'Delete the temporary access key, detach and delete the exact policy, then delete fa-terraform-state-user.'],
  ['Remove local training files', 'Delete only the fa-terraform-state CLI profile and verified lab folder after AWS cleanup is complete.'],
  ['Acknowledge complete cleanup', 'Confirm no named S3 bucket, SSM parameter, IAM resource, workspace, credential, plan or state file remains.']
];
const cleanup = {
  completionGate: 'acknowledgement',
  manualOnly: true,
  ordering: 'reverse_dependency',
  steps: cleanupDescriptions.map(([title, description], index) => ({ id: `programme-cleanup-${index + 1}`, stepNumber: index + 1, title, instruction: description, description, verification: `Cleanup item ${index + 1} is visibly complete for only the exact lab targets.`, resourceKeys: [], sourceIds: [] }))
};

const authorDraftContent = {
  schema: { profile: 'canonical-follow-along', version: '1.0.0', authorPackageVersion: '1.0.0', sharedContractHash: null, createdWith: 'codex-local-handoff' },
  programme: {
    serviceSlug: 'terraform-state-backend',
    serviceName: 'HashiCorp Terraform on AWS',
    shortName: 'Terraform State',
    displayName: 'Terraform State and Remote Backend Follow Along',
    subtitle: 'Migrate, lock, inspect, refresh, isolate and import Terraform state safely on AWS.',
    description: 'Start with no lab infrastructure. Create dedicated training access, build a local-state configuration, migrate it to a private versioned S3 backend with native locking, inspect drift, use workspaces, import an existing resource and remove everything in the correct order.',
    learningOutcome: 'Safely manage Terraform state throughout its lifecycle and explain the state, backend, locking, refresh-only, workspace and import concepts tested by Terraform Associate.',
    programmeId,
    pathId: programmeId,
    componentNamespace: '',
    category: 'Terraform State and Backends',
    difficulty: 'Beginner to Intermediate',
    estimatedMinutes: null,
    defaultRegion: 'eu-west-2',
    regionScope: 'mixed',
    supportedModes: ['console', 'cli', 'both'],
    publicationVisibility: 'unpublished',
    examId: 'terraform-associate-004'
  },
  sources,
  presentation: { accentColor: '#7c3aed', iconLabel: 'TF2', iconName: 'Layers', badgeText: 'Terraform Card 2' },
  storage: {},
  progress: { initialTaskId: tasks[0].id, supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
  capabilities: {},
  phases,
  tasks,
  resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: { region: 'eu-west-2' } },
  warnings: {
    cost: 'Parameter Store standard parameters are normally free. S3 storage and requests can incur small charges. Delete every named lab resource during the final phase.',
    safety: 'Operate only on exact fa-terraform-state and fa-tf-import names. Read every plan before apply and never edit Terraform state directly.',
    credentials: 'Never paste passwords, access keys, session tokens, backend credentials, state content or plan JSON into HCL, Author, Git, screenshots or chat.',
    region: 'Use eu-west-2 for S3 and Parameter Store resources. IAM is global. Verify the AWS account before every create, import or delete operation.'
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
      { id: 'finding-1', findingNumber: 1, section: 'warnings', priority: 'advisory', message: 'An administrator must review the exact temporary training policy and replace account placeholders before attachment.', status: 'open' },
      { id: 'finding-2', findingNumber: 2, section: 'instructions', priority: 'advisory', message: 'State and plan files can contain sensitive values and must never be displayed, committed or copied into Author.', status: 'open' },
      { id: 'finding-3', findingNumber: 3, section: 'cleanup', priority: 'advisory', message: 'Managed resources and final state migration must complete before the versioned backend bucket is emptied and deleted.', status: 'open' }
    ]
  },
  publication: { publishStatus: 'not_published', targetProgrammeId: programmeId, proposedChanges: [] }
};

const planning = validateAuthorPlanning(authorDraftContent);
const content = validateAuthorContent(authorDraftContent);
const review = validateAuthorReview(authorDraftContent);
if (!planning.valid || !content.valid || !review.valid) {
  console.error(JSON.stringify({ planning, content, review }, null, 2));
  throw new Error('Terraform state handoff did not pass Author validation.');
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
  schemaVersion: 1,
  kind: 'author_local_handoff_package',
  status: 'awaiting_human_handoff_review',
  sessionId,
  preparedAt,
  generationMode: 'new',
  service: { officialName: 'HashiCorp Terraform on AWS', shortName: 'Terraform State' },
  acceptedFingerprintChain,
  acceptedRecordManifest,
  authorDraftContent,
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
  schemaVersion: 1,
  sessionId,
  status: 'handoff_package_ready_for_review',
  createdAt: preparedAt,
  inputs: { serviceName: 'HashiCorp Terraform on AWS', shortName: 'Terraform State', level: 'Beginner to Intermediate', goal: authorDraftContent.programme.learningOutcome, region: 'eu-west-2' },
  boundaries: { handoffPackagePrepared: true, stage12Prepared: false, authorDraftWritten: false, supabaseConnected: false, awsConnected: false, candidatePrepared: false, published: false }
};
const acceptance = buildStage90ALocalAcceptance({ session, handoffPackage, now: () => new Date('2026-08-14T22:05:00.000Z') });

const preview = [
  'AUTHOR LOCAL HANDOFF PACKAGE - TERRAFORM STATE AND REMOTE BACKEND',
  '',
  `Programme: ${authorDraftContent.programme.displayName}`,
  `Exam: Terraform Associate 004`,
  `Card: 2`,
  `Phases: ${summary.phaseCount}`,
  `Tasks: ${summary.taskCount}`,
  `Separate editable checkboxes: ${summary.checkboxCount}`,
  `CLI commands: ${summary.cliCommandCount}`,
  `Verification checks: ${summary.verificationCheckCount}`,
  `Cleanup items: ${summary.cleanupItemCount}`,
  `Official AWS sources: ${summary.officialAwsSourceCount}`,
  `Official HashiCorp sources: ${summary.officialTerraformSourceCount}`,
  `SHA-256 handoff fingerprint: ${handoffPackage.handoffFingerprint.value}`,
  '',
  'PHASES',
  ...phases.map(phase => `${phase.phaseNumber}. ${phase.title}`),
  '',
  'VALIDATION',
  `Planning: ${planning.valid ? 'passed' : 'failed'}`,
  `Content: ${content.valid ? 'passed' : 'failed'}`,
  `Structured review: ${review.valid ? 'passed' : 'failed'}`,
  '',
  'BOUNDARIES',
  'Nothing was written to Author, Supabase or AWS by this package builder.',
  'No release candidate was created by this package builder.',
  'The exact package has a local Step 90A human-acceptance audit.',
  ''
].join('\n');

await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, 'author-local-handoff-package.json'), `${JSON.stringify(handoffPackage, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'author-local-handoff-acceptance-90a.json'), `${JSON.stringify(acceptance, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'complete-follow-along-preview.txt'), preview, 'utf8');
await fs.writeFile(path.join(directory, 'session.json'), `${JSON.stringify(session, null, 2)}\n`, 'utf8');
console.log(preview);
