import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../../../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../../../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../../../src/features/followAlongAuthor/authorReview.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const sessionId = 'author-assistant-cloudformation-terraform-codex-20260814-001';
const programmeId = 'cloudformation-terraform-learning-path';
const preparedAt = '2026-08-14T20:00:00.000Z';
const stableStringify = value => Array.isArray(value) ? `[${value.map(stableStringify).join(',')}]` : value && typeof value === 'object' ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}` : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

function consoleStep(taskId, number, title, instructions, expectedResult, warning = '', blocks = []) {
  const id = `${taskId}-console-step-${number}-${slug(title)}`;
  return { id, stepNumber: number, number, title, instruction: instructions[0], instructions: instructions.map((text, index) => ({ id: `${id}-instruction-${index + 1}`, text, detail: '' })), jsonBlocks: blocks.map((block, index) => ({ id: `${id}-json-${index + 1}`, title: block.title, content: block.content, language: block.language || 'text', sourceIds: block.sourceIds || [] })), commands: [], expectedResult, warning, sourceIds: [] };
}
function cliStep(taskId, number, command, explanation, expectedResult, warning = '') {
  return { id: `${taskId}-cli-step-${number}`, stepNumber: number, number, command, explanation, expectedResult, instructions: [], commands: [], warning, sourceIds: [] };
}
function check(taskId, number, title, instruction, expectedResult, mode = 'either') {
  return { id: `${taskId}-verification-${number}`, title, instruction, expectedResult, mode };
}

const cloudFormationTemplate = `AWSTemplateFormatVersion: '2010-09-09'
Description: CloudFormation half of the fa-iac comparison lab
Parameters:
  EnvironmentName:
    Type: String
    Default: fa-iac-cfn
Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.30.0.0/16
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: !Join ['', [!Ref EnvironmentName, '-vpc']]
        - Key: ManagedBy
          Value: CloudFormation
  PublicSubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.30.1.0/24
      MapPublicIpOnLaunch: false
      Tags:
        - Key: Name
          Value: !Join ['', [!Ref EnvironmentName, '-subnet']]
  SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: No-ingress comparison security group
      VpcId: !Ref VPC
      SecurityGroupEgress:
        - IpProtocol: '-1'
          CidrIp: 0.0.0.0/0
      Tags:
        - Key: Name
          Value: !Join ['', [!Ref EnvironmentName, '-sg']]
Outputs:
  VpcId:
    Value: !Ref VPC
  SubnetId:
    Value: !Ref PublicSubnet
  SecurityGroupId:
    Value: !Ref SecurityGroup`;

const backendTemplate = `AWSTemplateFormatVersion: '2010-09-09'
Description: Versioned encrypted S3 backend for the fa-iac Terraform lab
Resources:
  StateBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    UpdateReplacePolicy: Retain
    Properties:
      BucketName: !Join ['', ['fa-iac-tf-state-', !Ref 'AWS::AccountId']]
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      VersioningConfiguration:
        Status: Enabled
Outputs:
  StateBucketName:
    Value: !Ref StateBucket`;

const terraformMain = `terraform {
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
}

resource "aws_vpc" "lab" {
  cidr_block           = "10.40.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "fa-iac-tf-vpc", ManagedBy = "Terraform" }
}

resource "aws_subnet" "lab" {
  vpc_id                  = aws_vpc.lab.id
  cidr_block              = "10.40.1.0/24"
  map_public_ip_on_launch = false
  tags = { Name = "fa-iac-tf-subnet", ManagedBy = "Terraform" }
}

resource "aws_security_group" "lab" {
  name        = "fa-iac-tf-sg"
  description = "No-ingress comparison security group"
  vpc_id      = aws_vpc.lab.id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "fa-iac-tf-sg", ManagedBy = "Terraform" }
}`;
const terraformVariables = `variable "aws_region" {
  description = "AWS Region for regional lab resources"
  type        = string
  default     = "eu-west-2"
}

variable "aws_profile" {
  description = "Named AWS CLI profile used by Terraform"
  type        = string
  default     = "fa-iac"
}`;
const terraformOutputs = `output "vpc_id" { value = aws_vpc.lab.id }
output "subnet_id" { value = aws_subnet.lab.id }
output "security_group_id" { value = aws_security_group.lab.id }`;
const backendConfig = `terraform {
  backend "s3" {
    bucket       = "fa-iac-tf-state-<ACCOUNT_ID>"
    key          = "cloudformation-terraform/terraform.tfstate"
    region       = "eu-west-2"
    use_lockfile = true
  }
}`;
const moduleMain = `variable "name" { type = string }
variable "cidr" { type = string }

resource "aws_vpc" "this" {
  cidr_block           = var.cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = var.name, ManagedBy = "Terraform" }
}

output "id" { value = aws_vpc.this.id }`;

const sourceDefinitions = [
  ['iam-best', 'Security best practices in IAM', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', 'AWS', 'Supports avoiding root and using dedicated temporary training access.'],
  ['cli-config', 'Configure the AWS CLI', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html', 'AWS', 'Supports the named fa-iac profile without embedding credentials.'],
  ['cfn-start', 'Getting started with AWS CloudFormation', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/GettingStarted.html', 'AWS', 'Supports template upload, stack creation, events, resources, and outputs.'],
  ['cfn-template', 'CloudFormation template anatomy', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html', 'AWS', 'Supports parameters, resources, outputs, and intrinsic functions.'],
  ['cfn-changes', 'Update CloudFormation stacks using change sets', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html', 'AWS', 'Supports previewing and executing controlled stack changes.'],
  ['cfn-validation', 'Validate CloudFormation stack deployments', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/validate-stack-deployments.html', 'AWS', 'Supports validation and interpreting deployment failures.'],
  ['cfn-drift', 'Detect unmanaged configuration changes to stacks and resources', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html', 'AWS', 'Supports drift detection and reconciliation.'],
  ['cfn-delete', 'Delete a stack from the CloudFormation console', 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-delete-stack.html', 'AWS', 'Supports dependency-aware stack cleanup.'],
  ['s3-versioning', 'Using versioning in S3 buckets', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html', 'AWS', 'Supports recoverable Terraform state storage.'],
  ['tf-install', 'Install Terraform', 'https://developer.hashicorp.com/terraform/install', 'HashiCorp', 'Supports installing and verifying Terraform CLI.'],
  ['tf-init', 'Initialize the Terraform working directory', 'https://developer.hashicorp.com/terraform/cli/commands/init', 'HashiCorp', 'Supports provider installation and backend initialization.'],
  ['tf-resources', 'Create and manage resources', 'https://developer.hashicorp.com/terraform/language/resources', 'HashiCorp', 'Supports declarative AWS resource configuration.'],
  ['tf-plan', 'Terraform plan command', 'https://developer.hashicorp.com/terraform/cli/commands/plan', 'HashiCorp', 'Supports reviewing proposed changes before apply.'],
  ['tf-apply', 'Terraform apply command', 'https://developer.hashicorp.com/terraform/cli/commands/apply', 'HashiCorp', 'Supports applying a reviewed saved plan.'],
  ['tf-backend', 'Terraform S3 backend', 'https://developer.hashicorp.com/terraform/language/backend/s3', 'HashiCorp', 'Supports versioned S3 state and native lockfiles.'],
  ['tf-modules', 'Use modules in your configuration', 'https://developer.hashicorp.com/terraform/language/modules/configuration', 'HashiCorp', 'Supports reusable local modules.'],
  ['tf-values', 'Manage values in modules', 'https://developer.hashicorp.com/terraform/language/values', 'HashiCorp', 'Supports input variables and outputs.'],
  ['tf-import', 'Import existing resources', 'https://developer.hashicorp.com/terraform/cli/import', 'HashiCorp', 'Supports bringing an existing resource into state.'],
  ['tf-state', 'Purpose of Terraform state', 'https://developer.hashicorp.com/terraform/language/state/purpose', 'HashiCorp', 'Supports safe state handling and drift discussion.'],
  ['tf-destroy', 'Terraform destroy command', 'https://developer.hashicorp.com/terraform/cli/commands/destroy', 'HashiCorp', 'Supports removing Terraform-managed workload resources first.']
];

const phases = [
  ['Safe tools and access', 'Prepare a dedicated training identity, AWS CLI profile, Terraform CLI, and isolated working folders.'],
  ['CloudFormation foundations', 'Create the state backend and a small network stack from visible YAML.'],
  ['CloudFormation operations', 'Preview changes, inspect failures, and detect drift.'],
  ['Terraform foundations', 'Describe equivalent AWS resources in HCL and use the core workflow.'],
  ['Terraform state and reuse', 'Protect state, use a module, and practise drift and import decisions.'],
  ['Architecture comparison and teardown', 'Choose the right IaC approach and remove every lab resource in dependency order.']
].map(([title, description], index) => ({ id: `phase-${index + 1}-${slug(title)}`, phaseNumber: index + 1, title, description, taskIds: [], isOptional: false }));

const definitions = [
  { phase: 1, title: 'Prepare the administrator session and local tools', feature: 'IAM, AWS CLI, and Terraform CLI', goal: 'Verify the correct AWS account, select eu-west-2, install Terraform, and create separate CloudFormation and Terraform folders.', why: 'IaC can change many resources at once, so identity, Region, versions, and file locations must be explicit before deployment.', sources: ['iam-best','cli-config','tf-install'], console: [['Verify the safe starting point', ['Sign in to the training AWS account as an administrator; do not use the root user.', 'Open the account menu and record the 12-digit account ID as [ACCOUNT_ID].', 'Choose eu-west-2 (London) in the Region selector.', 'Open CloudShell or PowerShell and run aws --version.', 'Install Terraform from the official HashiCorp instructions for your operating system.', 'Run terraform version and record the installed version.', 'Create empty local folders named fa-iac/cloudformation and fa-iac/terraform.', 'Confirm neither folder contains credentials, state files, or unrelated templates.'], 'The correct account and Region are recorded and both CLIs report versions.']], cli: [['aws sts get-caller-identity','Show the caller and account before creating training access.','Account matches [ACCOUNT_ID].'],['aws configure get region','Show the current default Region without exposing secrets.','The Region is eu-west-2 or is intentionally replaced by the named profile later.'],['terraform version','Verify Terraform is installed.','Terraform prints its version and platform.']], checks: [['Verify tool readiness','Read the AWS account, Region, AWS CLI version, and Terraform version back from the terminal.','All values are present and match this lab.']] },
  { phase: 1, title: 'Create dedicated IaC training access', feature: 'IAM user and named AWS CLI profile', goal: 'Create one temporary IAM training user, attach only the lab permissions selected by the administrator, and configure the fa-iac profile.', why: 'Dedicated access separates the lab from root and everyday administrator credentials and makes cleanup auditable.', sources: ['iam-best','cli-config'], console: [['Create and test the training identity', ['Open IAM in the administrator session and choose Users, then Create user.', 'Name the user fa-iac-user and do not enable console access unless the learner needs the Console route.', 'Create a customer-managed policy named fa-iac-training-policy containing only CloudFormation, the named S3 backend, and the EC2 network actions used in this lab.', 'Attach fa-iac-training-policy to fa-iac-user.', 'If Console access is required, create a temporary password and require a password change.', 'Open Security credentials for fa-iac-user and create one access key for CLI use.', 'Configure the key directly into the local fa-iac profile; never paste it into Author, source control, or Terraform files.', 'Sign in or switch to the training user and confirm the displayed identity is fa-iac-user.'], 'The learner uses fa-iac-user and the fa-iac profile in the recorded account.', 'An administrator must review the policy before attachment. Do not grant access to unrelated resources.']], cli: [['aws configure --profile fa-iac','Enter the temporary access key, secret, eu-west-2, and json directly into the protected local AWS CLI prompt.','The named profile is saved locally.'],['aws sts get-caller-identity --profile fa-iac','Verify the new profile without displaying the secret.','Arn identifies fa-iac-user in [ACCOUNT_ID].']], checks: [['Verify identity separation','Compare the administrator and fa-iac caller ARNs.','The learner profile identifies fa-iac-user, not root or the administrator.']] },
  { phase: 2, title: 'Create the protected Terraform state bucket with CloudFormation', feature: 'CloudFormation, S3 encryption, versioning, and retention', goal: 'Deploy a bootstrap stack that creates one private, encrypted, versioned S3 state bucket.', why: 'Terraform backends must exist before backend initialization, and state requires stronger protection than ordinary lab files.', sources: ['cfn-start','cfn-template','s3-versioning','tf-backend'], blocks: [{title:'fa-iac-backend.yaml',content:backendTemplate}], console: [['Deploy the backend stack', ['Open CloudFormation in eu-west-2 and choose Create stack, With new resources.', 'Choose Upload a template file and upload the supplied fa-iac-backend.yaml.', 'Choose Next and enter stack name fa-iac-backend.', 'Review the template and keep the default options.', 'Choose Submit and watch the Events tab until CREATE_COMPLETE.', 'Open Outputs and record StateBucketName as [TF_STATE_BUCKET].', 'Open the S3 bucket and verify Block Public Access, SSE-S3 default encryption, and versioning are enabled.'], 'fa-iac-backend is CREATE_COMPLETE and [TF_STATE_BUCKET] is protected.', 'The template retains the bucket when the stack is deleted so state cannot disappear accidentally.']], cli: [['aws cloudformation validate-template --template-body file://fa-iac-backend.yaml --region eu-west-2 --profile fa-iac','Validate the visible backend template.','The command returns the template description.'],['aws cloudformation deploy --stack-name fa-iac-backend --template-file fa-iac-backend.yaml --region eu-west-2 --profile fa-iac','Create or safely update the backend stack.','The deployment succeeds.'],['aws cloudformation describe-stacks --stack-name fa-iac-backend --region eu-west-2 --profile fa-iac','Read the stack output.','StateBucketName provides [TF_STATE_BUCKET].']], checks: [['Verify backend controls','Inspect the S3 bucket Properties and Permissions tabs.','Versioning and encryption are enabled and public access is blocked.']] },
  { phase: 2, title: 'Build and deploy a CloudFormation network stack', feature: 'CloudFormation templates, parameters, resources, and outputs', goal: 'Create a VPC, subnet, and no-ingress security group from the supplied YAML template.', why: 'The stack demonstrates declarative dependencies, intrinsic functions, tags, and outputs without expensive compute resources.', sources: ['cfn-start','cfn-template','cfn-validation'], blocks: [{title:'fa-iac-network.yaml',content:cloudFormationTemplate}], console: [['Create the workload stack', ['Open CloudFormation in eu-west-2 and choose Create stack, With new resources.', 'Upload the supplied fa-iac-network.yaml.', 'Enter stack name fa-iac-cfn-network.', 'On Parameters, keep EnvironmentName as fa-iac-cfn.', 'Review the template summary and choose Submit.', 'Follow Events from the oldest event upward and wait for CREATE_COMPLETE.', 'Open Resources and identify the VPC, subnet, and security group physical IDs.', 'Open Outputs and record [CFN_VPC_ID], [CFN_SUBNET_ID], and [CFN_SG_ID].', 'Open VPC and verify the resources have ManagedBy = CloudFormation.'], 'The three network resources exist in 10.30.0.0/16 and the stack is CREATE_COMPLETE.']], cli: [['aws cloudformation validate-template --template-body file://fa-iac-network.yaml --region eu-west-2 --profile fa-iac','Check YAML structure before deployment.','The template description and parameter are returned.'],['aws cloudformation deploy --stack-name fa-iac-cfn-network --template-file fa-iac-network.yaml --parameter-overrides EnvironmentName=fa-iac-cfn --region eu-west-2 --profile fa-iac','Deploy the network stack.','The stack deployment succeeds.'],['aws cloudformation describe-stacks --stack-name fa-iac-cfn-network --query "Stacks[0].Outputs" --region eu-west-2 --profile fa-iac','Retrieve the generated resource IDs.','Three outputs are returned.']], checks: [['Verify stack ownership','Compare CloudFormation Resources with the VPC resource IDs and tags.','All three resources belong to fa-iac-cfn-network.']] },
  { phase: 3, title: 'Preview and execute a CloudFormation change set', feature: 'CloudFormation change sets and rollback', goal: 'Change the subnet Name tag through a reviewed change set and understand rollback events.', why: 'Change sets expose intended replacements or modifications before they affect the environment.', sources: ['cfn-changes','cfn-validation'], console: [['Create and inspect the change set', ['Make a copy named fa-iac-network-v2.yaml.', 'In the copy, change only the PublicSubnet Name value to fa-iac-cfn-subnet-v2.', 'Open fa-iac-cfn-network and choose Stack actions, Create change set for current stack.', 'Upload fa-iac-network-v2.yaml and name the change set fa-iac-subnet-tag-change.', 'Wait for CREATE_COMPLETE and inspect every proposed resource action.', 'Confirm the subnet action is Modify and Replacement is False.', 'Execute the change set and watch Events until UPDATE_COMPLETE.', 'Open the subnet Tags and verify Name = fa-iac-cfn-subnet-v2.', 'Open stack Events and identify the UPDATE_IN_PROGRESS and UPDATE_COMPLETE sequence.'], 'The reviewed tag-only change is applied without replacing the subnet.']], cli: [['aws cloudformation create-change-set --stack-name fa-iac-cfn-network --change-set-name fa-iac-subnet-tag-change --template-body file://fa-iac-network-v2.yaml --parameters ParameterKey=EnvironmentName,UsePreviousValue=true --region eu-west-2 --profile fa-iac','Create a non-executing preview of the update.','A change set ID is returned.'],['aws cloudformation describe-change-set --stack-name fa-iac-cfn-network --change-set-name fa-iac-subnet-tag-change --region eu-west-2 --profile fa-iac','Review the exact proposed action and replacement status.','The subnet shows Modify with no replacement.'],['aws cloudformation execute-change-set --stack-name fa-iac-cfn-network --change-set-name fa-iac-subnet-tag-change --region eu-west-2 --profile fa-iac','Apply only the reviewed change set.','The stack begins updating.']], checks: [['Verify non-replacement update','Compare [CFN_SUBNET_ID] before and after the update.','The physical subnet ID is unchanged and only its Name tag differs.']] },
  { phase: 3, title: 'Detect and reconcile CloudFormation drift', feature: 'CloudFormation drift detection', goal: 'Create one harmless tag drift, detect it, and restore the template-defined value.', why: 'Drift reveals changes made outside the IaC control plane and is a common governance concern.', sources: ['cfn-drift','cfn-changes'], console: [['Create, detect, and remove controlled drift', ['Open VPC, select [CFN_VPC_ID], and add temporary tag DriftTest = manual-change.', 'Return to CloudFormation and open fa-iac-cfn-network.', 'Choose Stack actions, Detect drift, then confirm.', 'Wait for DRIFTED and open View drift results.', 'Select the VPC resource and compare expected with actual properties.', 'Remove only the DriftTest tag in the VPC console.', 'Run Detect drift again.', 'Wait until the stack returns to IN_SYNC.'], 'CloudFormation first reports the controlled difference and then reports IN_SYNC.', 'Change only the named DriftTest tag; do not edit CIDRs or delete resources.']], cli: [['aws cloudformation detect-stack-drift --stack-name fa-iac-cfn-network --region eu-west-2 --profile fa-iac','Start drift detection.','Record StackDriftDetectionId.'],['aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id [DRIFT_DETECTION_ID] --region eu-west-2 --profile fa-iac','Read the detection result.','DetectionStatus is DETECTION_COMPLETE and StackDriftStatus reflects the current state.']], checks: [['Verify reconciliation','Run drift detection after removing the tag.','StackDriftStatus is IN_SYNC.']] },
  { phase: 4, title: 'Write the equivalent Terraform configuration', feature: 'Terraform providers, resources, variables, and outputs', goal: 'Save complete HCL files for an equivalent but separately named VPC, subnet, and security group.', why: 'Using equivalent resources makes CloudFormation and Terraform syntax, ownership, and workflows directly comparable.', sources: ['tf-resources','tf-values'], blocks: [{title:'main.tf',content:terraformMain},{title:'variables.tf',content:terraformVariables},{title:'outputs.tf',content:terraformOutputs}], console: [['Prepare and inspect the Terraform files', ['Open the local fa-iac/terraform folder.', 'Create main.tf and paste the supplied main.tf block.', 'Create variables.tf and paste the supplied variables.tf block.', 'Create outputs.tf and paste the supplied outputs.tf block.', 'Confirm the Terraform CIDR is 10.40.0.0/16, separate from CloudFormation 10.30.0.0/16.', 'Confirm every resource name begins fa-iac-tf- and ManagedBy is Terraform.', 'Confirm the provider uses the fa-iac profile and eu-west-2 variable.', 'Do not create backend.tf yet; the first plan demonstrates local state.'], 'Three readable HCL files describe the isolated Terraform network.']], cli: [['terraform fmt -check','Check that all HCL files use canonical formatting.','Terraform reports no formatting differences.'],['terraform init','Initialize the working directory and install the locked AWS provider.','Initialization succeeds and .terraform.lock.hcl is created.'],['terraform validate','Validate references and provider schema.','Success! The configuration is valid.']], checks: [['Verify isolated names and CIDRs','Compare main.tf with fa-iac-network.yaml.','The two tools use different names and non-overlapping CIDRs.']] },
  { phase: 4, title: 'Plan, apply, and inspect the Terraform network', feature: 'Terraform init, validate, plan, apply, and state', goal: 'Review a saved plan, apply it once, and inspect the resulting AWS resources and Terraform state.', why: 'The plan-before-apply workflow separates review from mutation and shows how Terraform maps configuration to state.', sources: ['tf-init','tf-plan','tf-apply','tf-state'], console: [['Follow the visible AWS result while Terraform runs', ['Open VPC in eu-west-2 in a browser before applying.', 'Run the CLI commands below from fa-iac/terraform.', 'Read the plan summary and confirm exactly one VPC, one subnet, and one security group will be added.', 'Apply only the saved plan file tfplan.', 'Refresh VPC and locate fa-iac-tf-vpc, fa-iac-tf-subnet, and fa-iac-tf-sg.', 'Verify ManagedBy = Terraform and record [TF_VPC_ID], [TF_SUBNET_ID], and [TF_SG_ID].', 'Do not edit these resources in the Console during this task.'], 'Terraform reports three resources added and the VPC console shows the matching IDs.']], cli: [['terraform plan -out=tfplan','Create a saved execution plan without changing AWS.','Plan reports 3 to add, 0 to change, 0 to destroy.'],['terraform show tfplan','Inspect every action in the saved plan.','Only the three fa-iac-tf resources are proposed.'],['terraform apply tfplan','Apply the exact reviewed plan.','Apply complete reports three resources added.'],['terraform output','Read the recorded output IDs.','The VPC, subnet, and security group IDs are returned.'],['terraform state list','List resources currently managed by this state.','Exactly three AWS resource addresses are listed.']], checks: [['Verify idempotence','Run terraform plan again without changing files.','Terraform reports no changes.']] },
  { phase: 5, title: 'Migrate Terraform state to versioned S3 locking', feature: 'Terraform S3 backend and native lockfile', goal: 'Move local state into the protected backend and enable S3 lockfiles.', why: 'Remote state supports collaboration and recovery; locking reduces concurrent-write risk.', sources: ['tf-backend','s3-versioning','tf-init'], blocks: [{title:'backend.tf',content:backendConfig}], console: [['Configure and verify the backend', ['Create backend.tf in fa-iac/terraform and paste the supplied block.', 'Replace <ACCOUNT_ID> with [ACCOUNT_ID] so bucket matches [TF_STATE_BUCKET].', 'Confirm key is cloudformation-terraform/terraform.tfstate.', 'Confirm use_lockfile = true; do not add the deprecated DynamoDB locking setting.', 'Run terraform init -migrate-state and answer yes only when asked to copy existing state.', 'Open [TF_STATE_BUCKET] in S3 and locate the state object.', 'Open Versions and verify at least one state version exists.', 'Confirm Block Public Access and encryption remain enabled.', 'Never download, edit, or publish the state content because it can contain sensitive values.'], 'Terraform uses the S3 backend and the versioned state object exists.']], cli: [['terraform init -migrate-state','Reinitialize and migrate local state to the configured S3 backend.','Terraform confirms successful backend configuration and state migration.'],['terraform state list','Confirm the migrated backend can read the state.','The same three managed addresses are returned.'],['aws s3api list-object-versions --bucket [TF_STATE_BUCKET] --prefix cloudformation-terraform/terraform.tfstate --profile fa-iac','Inspect state versions without reading state content.','At least one version is listed.']], checks: [['Verify remote state','Temporarily rename the old local terraform.tfstate only if it remains, then run terraform plan.','Terraform still reads remote state and reports no changes.']] },
  { phase: 5, title: 'Refactor the Terraform VPC into a local module', feature: 'Terraform local modules, variables, outputs, and moved blocks', goal: 'Create a small local VPC module and preview a refactor without replacing the live VPC.', why: 'Modules improve reuse, while explicit state-address migration prevents accidental resource replacement.', sources: ['tf-modules','tf-values','tf-plan'], blocks: [{title:'modules/vpc/main.tf',content:moduleMain}], console: [['Create and review the local module', ['Create folders modules/vpc under fa-iac/terraform.', 'Create modules/vpc/main.tf and paste the supplied module block.', 'In the root configuration, call module vpc with name fa-iac-tf-vpc and cidr 10.40.0.0/16.', 'Add a moved block mapping aws_vpc.lab to module.vpc.aws_vpc.this.', 'Update subnet and security-group references to module.vpc.id.', 'Run terraform fmt and terraform validate.', 'Run terraform plan and inspect the move statement.', 'Confirm the plan does not destroy [TF_VPC_ID].', 'Apply only after the plan shows a state address move with no VPC replacement.'], 'The VPC keeps [TF_VPC_ID] and state records it under the local module address.', 'Stop if the plan proposes destroying and recreating the VPC.']], cli: [['terraform init','Install or refresh the local module after changing module configuration.','Initialization succeeds.'],['terraform validate','Check module inputs, outputs, and references.','The configuration is valid.'],['terraform plan -out=module-refactor.tfplan','Preview the refactor.','The plan shows the VPC moved rather than replaced.'],['terraform apply module-refactor.tfplan','Apply the reviewed state-address refactor.','The VPC physical ID remains unchanged.']], checks: [['Verify resource continuity','Compare terraform output and VPC console with [TF_VPC_ID].','The VPC ID is unchanged after the module refactor.']] },
  { phase: 5, title: 'Practise Terraform drift and import decisions safely', feature: 'Terraform refresh, plan, import, and state ownership', goal: 'Observe one harmless tag drift and practise the import workflow using a separate unmanaged security group.', why: 'Terraform plans reconcile real infrastructure with configuration, while import adopts existing resources without creating them.', sources: ['tf-plan','tf-import','tf-state'], console: [['Detect drift and prepare an import target', ['In VPC, add DriftTest = manual-change to fa-iac-tf-subnet only.', 'Run terraform plan and find the proposed removal of DriftTest.', 'Remove the manual tag in the Console and run terraform plan again.', 'Create a no-ingress security group named fa-iac-import-sg in fa-iac-tf-vpc.', 'Record its ID as [IMPORT_SG_ID].', 'Add an aws_security_group.imported resource block matching its name, description, VPC, egress, and tags.', 'Run terraform import aws_security_group.imported [IMPORT_SG_ID].', 'Run terraform plan and adjust configuration until no unexpected changes remain.', 'Keep the imported security group in configuration so terraform destroy can remove it.'], 'Drift is visible in a plan, and the existing security group becomes managed without recreation.', 'Import does not generate complete configuration. Match the real object before applying.']], cli: [['terraform plan','Detect the manual subnet tag difference.','The plan proposes removing only DriftTest.'],['terraform import aws_security_group.imported [IMPORT_SG_ID]','Attach the existing security group to the declared resource address.','Import successful is reported.'],['terraform state show aws_security_group.imported','Inspect imported attributes without changing AWS.','State identifies [IMPORT_SG_ID].'],['terraform plan','Compare configuration, state, and AWS after import.','No unexpected replacement or deletion remains.']], checks: [['Verify ownership','Run terraform state list and find aws_security_group.imported.','The imported security group appears once in state.']] },
  { phase: 6, title: 'Compare IaC workflows and complete the teardown', feature: 'CloudFormation and Terraform lifecycle management', goal: 'Compare both tools, then remove Terraform workloads, CloudFormation workloads, backend objects, backend stack, and temporary access in exact order.', why: 'The owning IaC tool should remove its own resources, and retained state must be handled only after the managed workload is gone.', sources: ['cfn-delete','tf-destroy','tf-backend','iam-best'], console: [['Compare before deleting', ['Open CloudFormation Resources for fa-iac-cfn-network.', 'Open VPC and filter ManagedBy = CloudFormation, then ManagedBy = Terraform.', 'Compare template plus stack events with HCL plus plan and state.', 'Record that CloudFormation state is service-managed while Terraform state is stored in [TF_STATE_BUCKET].', 'Choose CloudFormation when AWS-native service integration and stack operations fit the requirement.', 'Choose Terraform when a shared declarative workflow across supported providers and reusable modules fits the requirement.', 'Confirm all recorded IDs belong to this lab before cleanup.'], 'The learner can explain ownership, preview, state, drift, reuse, and cleanup differences.'],['Run the final deletion order', ['From fa-iac/terraform, run terraform plan -destroy and confirm only fa-iac-tf resources are listed.', 'Run terraform destroy and type yes only after checking every address.', 'Verify fa-iac-tf-vpc, subnet, and both security groups are absent.', 'Delete CloudFormation stack fa-iac-cfn-network and wait for DELETE_COMPLETE.', 'Verify fa-iac-cfn resources are absent.', 'In [TF_STATE_BUCKET], delete every version and delete marker only under cloudformation-terraform/terraform.tfstate and its .tflock key.', 'Delete CloudFormation stack fa-iac-backend; the bucket is retained intentionally.', 'After the backend stack is deleted, empty all remaining versions and delete markers from [TF_STATE_BUCKET].', 'Delete the empty [TF_STATE_BUCKET].', 'Delete the fa-iac access key, detach and delete fa-iac-training-policy, and delete fa-iac-user.', 'Remove only the local fa-iac AWS CLI profile and local fa-iac working folder.', 'Verify unrelated stacks, buckets, VPCs, profiles, users, and policies remain unchanged.'], 'All and only fa-iac resources, credentials, state, and local files are absent.', 'Deletion is permanent. Stop whenever an exact name or recorded ID does not match.']], cli: [['terraform plan -destroy','Preview removal of Terraform-managed workload resources.','Only fa-iac-tf resources are proposed for destruction.'],['terraform destroy','Destroy the Terraform-managed workload after interactive confirmation.','Destroy complete reports the managed resources removed.'],['aws cloudformation delete-stack --stack-name fa-iac-cfn-network --region eu-west-2 --profile fa-iac','Delete the CloudFormation workload stack after Terraform cleanup.','The stack enters DELETE_IN_PROGRESS.'],['aws cloudformation wait stack-delete-complete --stack-name fa-iac-cfn-network --region eu-west-2 --profile fa-iac','Wait for workload cleanup to finish.','The waiter exits successfully.'],['aws cloudformation delete-stack --stack-name fa-iac-backend --region eu-west-2 --profile fa-iac','Delete the backend stack after its state objects are removed; its retained bucket remains for explicit verification.','The backend stack deletes while the retained bucket remains.']], checks: [['Verify cloud cleanup','Search CloudFormation, VPC, S3, and IAM for the exact fa-iac names and recorded IDs.','No lab resource remains and unrelated resources are unchanged.'],['Verify local cleanup','List AWS CLI profiles and inspect the parent folder.','The fa-iac profile and local lab folder are absent.']] }
];

const tasks = definitions.map((definition, index) => {
  const id = `task-cloudformation-terraform-${slug(definition.title)}-${String(index + 1).padStart(3, '0')}`;
  const sourceIds = definition.sources.map(key => `source-${key}`);
  const previous = index ? `task-cloudformation-terraform-${slug(definitions[index - 1].title)}-${String(index).padStart(3, '0')}` : null;
  const task = { id, slug: slug(definition.title), title: definition.title, service: 'AWS CloudFormation and HashiCorp Terraform', feature: definition.feature, goal: definition.goal, whyItMatters: definition.why, difficulty: index < 4 ? 'Easy' : 'Medium', estimatedMinutes: null, region: 'eu-west-2', status: 'draft', phaseId: phases[definition.phase - 1].id, prerequisites: previous ? [previous] : [], isOptional: false, sourceIds, concepts: [], values: [], modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'available', reason: '' } }, consoleSteps: definition.console.map((item, stepIndex) => consoleStep(id, stepIndex + 1, item[0], item[1], item[2], item[3] || '', definition.blocks || [])), cliSteps: definition.cli.map((item, stepIndex) => cliStep(id, stepIndex + 1, ...item)), createdResourceKeys: [], verification: definition.checks.map((item, checkIndex) => check(id, checkIndex + 1, ...item)), cleanup: [] };
  phases[definition.phase - 1].taskIds.push(id);
  return task;
});

const sources = sourceDefinitions.map(([key, title, url, publisher, purpose]) => { const id = `source-${key}`; return { id, title, url, publisher, sourceType: 'official_documentation', purpose, taskIds: tasks.filter(task => task.sourceIds.includes(id)).map(task => task.id) }; });
const cleanupTargets = [
  ['Destroy Terraform workload', 'Run terraform plan -destroy, review every address, then run terraform destroy from the configured backend workspace.', 'No fa-iac-tf VPC, subnet, or security group remains.'],
  ['Delete CloudFormation workload stack', 'Delete only fa-iac-cfn-network and wait for DELETE_COMPLETE.', 'No fa-iac-cfn VPC, subnet, or security group remains.'],
  ['Remove Terraform state objects', 'Delete every version and delete marker for cloudformation-terraform/terraform.tfstate and its .tflock key in [TF_STATE_BUCKET].', 'The named state prefix has no versions or delete markers.'],
  ['Delete backend stack and retained bucket', 'Delete fa-iac-backend, then empty all remaining versions and delete markers from [TF_STATE_BUCKET] before deleting that exact bucket.', 'The backend stack and [TF_STATE_BUCKET] are absent.'],
  ['Delete temporary identity and local files', 'Delete the fa-iac access key, policy attachment, fa-iac-training-policy, fa-iac-user, local fa-iac profile, and local fa-iac folder.', 'Temporary access and local lab files are absent; unrelated items remain.']
];
const cleanup = { steps: cleanupTargets.map(([title,instruction,verification],index) => ({ id:`programme-cleanup-${index+1}`, stepNumber:index+1, title, instruction:`Console and CLI: ${instruction}`, description:`Console and CLI: ${instruction}`, verification, resourceKeys:[], sourceIds:[] })), completionGate:'acknowledgement', manualOnly:true, ordering:'reverse_dependency' };
const authorDraftContent = {
  schema:{ profile:'canonical-follow-along', version:'1.0.0', authorPackageVersion:'1.0.0', sharedContractHash:null, createdWith:'codex-local-handoff' },
  programme:{ serviceSlug:'cloudformation-terraform', serviceName:'AWS CloudFormation and HashiCorp Terraform', shortName:'CloudFormation + Terraform', displayName:'Infrastructure as Code: AWS CloudFormation and Terraform Follow Along', subtitle:'Build, change, detect drift, reuse, compare, and safely remove AWS infrastructure with two IaC tools.', description:'Start with no lab infrastructure. Prepare temporary access, build equivalent low-cost AWS networks with CloudFormation and Terraform, protect Terraform state in versioned S3 with native lockfiles, practise change previews, drift, modules and import, compare both workflows, and complete an ordered teardown.', learningOutcome:'Create, review, update, troubleshoot, compare, and completely remove AWS infrastructure using CloudFormation and Terraform while protecting identity and state.', programmeId, pathId:programmeId, componentNamespace:'', category:'Management & Governance', difficulty:'Beginner to Intermediate', estimatedMinutes:null, defaultRegion:'eu-west-2', regionScope:'mixed', supportedModes:['console','cli','both'], publicationVisibility:'unpublished' },
  sources, presentation:{accentColor:'#7c3aed',iconLabel:'IaC',iconName:'Blocks',badgeText:'CloudFormation + Terraform'}, storage:{}, progress:{initialTaskId:tasks[0].id,supportedModes:['console','cli','both'],optionalTasksCountTowardsProgress:false,completionStatuses:['in_progress','completed_retained','completed_cleaned']}, capabilities:{}, phases, tasks, resources:{schema:[],interpolationAliases:{},chargeableResourceKeys:[],variables:{region:'eu-west-2'}},
  warnings:{cost:'The small VPC resources are normally free, but S3 state storage and requests may incur small charges. Do not add NAT gateways, compute, databases, or unrelated resources.',safety:'Create and delete only exact fa-iac names and recorded IDs. Review every CloudFormation change set and Terraform plan before execution.',credentials:'Never put passwords, access keys, session tokens, or state content in templates, HCL, Author, screenshots, source control, or chat. Remove temporary access during cleanup.',region:'Use eu-west-2 for regional resources. IAM is global. Always verify the account before applying or deleting infrastructure.'}, cleanup, extensions:{registrations:[]},
  review:{validationStatus:'passed',validationErrors:[],validationWarnings:[],sourceReviewStatus:'reviewed',learnerPreviewStatus:'reviewed',approvalDecision:'pending',reviewStatus:'ready_for_approval',findings:[{id:'finding-1',findingNumber:1,section:'instructions',priority:'advisory',message:'Before candidate creation, verify current Console labels, Terraform and AWS provider compatibility, and every bracketed account or resource value.',status:'open'},{id:'finding-2',findingNumber:2,section:'warnings',priority:'advisory',message:'The administrator must review the temporary training policy and retain no credentials after cleanup.',status:'open'},{id:'finding-3',findingNumber:3,section:'cleanup',priority:'advisory',message:'Terraform workload destruction must finish before state objects, the retained backend bucket, and temporary identity are removed.',status:'open'}]},
  publication:{publishStatus:'not_published',targetProgrammeId:programmeId,proposedChanges:[]}
};

const planning=validateAuthorPlanning(authorDraftContent); const content=validateAuthorContent(authorDraftContent); const review=validateAuthorReview(authorDraftContent);
if(!planning.valid||!content.valid||!review.valid){console.error(JSON.stringify({planning,content,review},null,2));throw new Error('CloudFormation and Terraform handoff did not pass Author validation.');}
const summary={phaseCount:phases.length,taskCount:tasks.length,checkboxCount:tasks.flatMap(t=>t.consoleSteps).flatMap(s=>s.instructions).length,cliCommandCount:tasks.flatMap(t=>t.cliSteps).length,verificationCheckCount:tasks.flatMap(t=>t.verification).length,cleanupItemCount:cleanup.steps.length,learnerResourceValueCount:0,officialSourceCount:sources.length,officialAwsSourceCount:sources.filter(s=>s.publisher==='AWS').length,officialTerraformSourceCount:sources.filter(s=>s.publisher==='HashiCorp').length};
const stageRecords={planning:{stage:'1-5',status:'prepared_and_reviewed',validation:planning,phases:phases.map(p=>({id:p.id,taskIds:p.taskIds}))},instructions:{stage:'6',status:'prepared_and_reviewed',checkboxCount:summary.checkboxCount,cliCommandCount:summary.cliCommandCount},resourcesAndChecks:{stage:'7',status:'prepared_and_reviewed',verificationCheckCount:summary.verificationCheckCount,learnerResourceValueCount:0},cleanup:{stage:'8',status:'prepared_and_reviewed',cleanupItemCount:summary.cleanupItemCount,ordering:'reverse_dependency'},authoringCheck:{stage:'9',status:'passed',planningValid:planning.valid,contentValid:content.valid,reviewValid:review.valid},learnerPreview:{stage:'10',status:'reviewed',programmeId,summary},structuredReview:{stage:'11',status:'ready_for_approval',findings:authorDraftContent.review.findings}};
const acceptedRecordManifest=Object.fromEntries(Object.entries(stageRecords).map(([key,value])=>[key,{algorithm:'sha256-json-v1',value:fingerprint(value)}]));
const acceptedFingerprintChain={stage6:{algorithm:'sha256-json-v1',value:fingerprint(stageRecords.instructions)},stage7:{algorithm:'sha256-json-v1',value:fingerprint(stageRecords.resourcesAndChecks)},stage8:{algorithm:'sha256-json-v1',value:fingerprint(stageRecords.cleanup)},stage9:{algorithm:'sha256-json-v1',value:fingerprint(stageRecords.authoringCheck)},stage10:{algorithm:'sha256-json-v1',value:fingerprint(stageRecords.learnerPreview)},stage11:{algorithm:'sha256-json-v1',value:fingerprint(stageRecords.structuredReview)}};
const handoffPackage={schemaVersion:1,kind:'author_local_handoff_package',status:'awaiting_human_handoff_review',sessionId,preparedAt,generationMode:'new',service:{officialName:'AWS CloudFormation and HashiCorp Terraform',shortName:'CloudFormation + Terraform'},acceptedFingerprintChain,acceptedRecordManifest,authorDraftContent,identityBinding:{status:'required_before_author_write',assignedAuthorId:null,assignedDraftId:null,assignedRevision:null,rule:'A later separately approved write step must bind the currently signed-in Author and create a new draft identity.'},summary,handoffBoundary:{localPackageOnly:true,stage12Started:false,authorDraftWritten:false,authorIdentityBound:false,connectedToAuthor:false,connectedToSupabase:false,connectedToAws:false,releaseCandidatePrepared:false,candidateIdGenerated:false,approvalPerformed:false,published:false},acceptedStagesOneToElevenChanged:false};
const fingerprintContent=structuredClone(handoffPackage);delete fingerprintContent.status;delete fingerprintContent.preparedAt;handoffPackage.handoffFingerprint={algorithm:'sha256-json-v1',value:fingerprint(fingerprintContent)};
const preview=['AUTHOR LOCAL HANDOFF PACKAGE - CLOUDFORMATION + TERRAFORM','',`Programme: ${authorDraftContent.programme.displayName}`,`Phases: ${summary.phaseCount}`,`Tasks: ${summary.taskCount}`,`Separate editable checkboxes: ${summary.checkboxCount}`,`CLI commands: ${summary.cliCommandCount}`,`Verification checks: ${summary.verificationCheckCount}`,`Cleanup items: ${summary.cleanupItemCount}`,`Official AWS sources: ${summary.officialAwsSourceCount}`,`Official HashiCorp Terraform sources: ${summary.officialTerraformSourceCount}`,`SHA-256 handoff fingerprint: ${handoffPackage.handoffFingerprint.value}`,'','PHASES',...phases.map(p=>`${p.phaseNumber}. ${p.title}`),'','VALIDATION',`Planning: ${planning.valid?'passed':'failed'}`,`Content: ${content.valid?'passed':'failed'}`,`Structured review: ${review.valid?'passed':'failed'}`,'','BOUNDARIES','Nothing was written to Author, Supabase or AWS.','No Author identity is bound.','No release candidate was created.','Nothing was approved or published.','The handoff package is waiting for human review.',''].join('\n');
const session={schemaVersion:1,sessionId,status:'handoff_awaiting_human_review',createdAt:preparedAt,inputs:{serviceName:'AWS CloudFormation and HashiCorp Terraform',shortName:'CloudFormation + Terraform',level:'Beginner to Intermediate',goal:authorDraftContent.programme.learningOutcome,region:'eu-west-2'},boundaries:{authorDraftWritten:false,awsConnected:false,supabaseConnected:false,candidatePrepared:false,published:false}};
await fs.mkdir(directory,{recursive:true});await fs.writeFile(path.join(directory,'author-local-handoff-package.json'),`${JSON.stringify(handoffPackage,null,2)}\n`,'utf8');await fs.writeFile(path.join(directory,'complete-follow-along-preview.txt'),preview,'utf8');await fs.writeFile(path.join(directory,'session.json'),`${JSON.stringify(session,null,2)}\n`,'utf8');console.log(preview);
