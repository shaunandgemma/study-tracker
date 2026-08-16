# HCP Terraform Remote Runs and Collaboration Follow Along

> **Offline manuscript preview — unvalidated.** This file is authoring content for later local Codex conversion. It is **not** a Study Tracker handoff package, acceptance audit, validation result, approval, publication, or SHA-256 fingerprint.

- **Learner level:** Beginner
- **Exam workspace:** HashiCorp Terraform Associate 004
- **HCP Terraform scope:** global control-plane resources
- **AWS Region:** eu-west-2
- **Training resource prefix:** `fa-hcp-terraform`

## Required outcome

Create an HCP Terraform organisation, project and VCS-connected workspace; configure variables and sensitive values; run remote plans and applies; examine remote state and state locking; diagnose and fix a failed run; and safely destroy only the resources created by the lab.

## What you will build and prove

- [ ] A VCS-connected HCP Terraform workspace is created in a dedicated project and organization.
- [ ] HCP authenticates to AWS with OIDC dynamic credentials instead of static AWS keys.
- [ ] One deliberate remote plan fails because of input validation and is diagnosed correctly.
- [ ] A corrected remote plan is reviewed and applied to create exactly one SSM parameter in eu-west-2.
- [ ] A later Git commit automatically triggers a second remote run.
- [ ] HCP remote state and state history are examined without exposing the fake sensitive value.
- [ ] Automatic state locking is explained separately from a demonstrated manual HCP workspace lock.
- [ ] The Terraform-managed parameter is destroyed before HCP workspace/state deletion.
- [ ] All lab-only HCP, VCS, AWS IAM and local resources are removed in ordered cleanup.

## Safety warnings

### Cost warning

This lab intentionally creates only one small AWS Systems Manager Parameter Store String parameter plus IAM resources, but service pricing and HCP Terraform plan limits can change. Review the current AWS/HCP account information before starting and complete the destroy/cleanup tasks when finished.

### Deletion safety

Delete only resources with the exact fa-hcp-terraform names or the exact /fa-hcp-terraform/ path created by this lab. Never force-delete the HCP workspace while it still manages AWS infrastructure.

### Credential warning

Never create root access keys and never put AWS access keys in HCP Terraform. The local IAM-user key is temporary and used only by the named CLI profile; HCP remote runs use OIDC dynamic credentials. sensitive_demo must remain the fake value training-secret-not-real because sensitive Terraform values can still be stored in state.

### Region warning

HCP organization/project/workspace objects in this lab are treated as HCP Terraform global control-plane resources. The only Terraform-managed AWS service resource is created and verified in eu-west-2. Parameter Store parameters are regional.

## Resource inventory

| Platform | Type | Exact name or rule | Created | Removed |
|---|---|---|---|---|
| AWS IAM | IAM user | `fa-hcp-terraform-admin` | task-02-aws-bootstrap | task-18-aws-local-cleanup |
| AWS IAM | customer-managed policy | `fa-hcp-terraform-admin-policy` | task-02-aws-bootstrap | task-18-aws-local-cleanup |
| AWS IAM | IAM user access key | `temporary access key belonging to fa-hcp-terraform-admin` | task-03-cli-profile | task-18-aws-local-cleanup |
| Local workstation | AWS CLI named profile | `fa-hcp-terraform-admin` | task-03-cli-profile | task-18-aws-local-cleanup |
| Local workstation | folder/repository | `$HOME\terraform-labs\fa-hcp-terraform-vcs-lab` | task-04-local-terraform | task-18-aws-local-cleanup |
| GitHub | VCS repository | `fa-hcp-terraform-vcs-lab` | task-05-github-repo | task-17-hcp-vcs-cleanup |
| HCP Terraform | organization | `fa-hcp-terraform-org- plus the current AWS 12-digit account ID` | task-06-hcp-org-project | task-17-hcp-vcs-cleanup |
| HCP Terraform | project | `fa-hcp-terraform-project` | task-06-hcp-org-project | task-17-hcp-vcs-cleanup |
| HCP Terraform | workspace | `fa-hcp-terraform-remote-runs` | task-07-vcs-workspace | task-17-hcp-vcs-cleanup |
| AWS IAM | OIDC provider | `app.terraform.io / audience aws.workload.identity` | task-08-oidc-provider | task-18-aws-local-cleanup |
| AWS IAM | OIDC run role | `fa-hcp-terraform-run-role` | task-09-run-role | task-18-aws-local-cleanup |
| AWS IAM | inline role policy | `fa-hcp-terraform-run-policy` | task-09-run-role | task-18-aws-local-cleanup |
| AWS Systems Manager | Parameter Store String parameter | `/fa-hcp-terraform/training-message` (eu-west-2) | task-12-fix-apply | task-16-destroy |

## Learning path

# Phase 1: Preparation and AWS safety

Verify tools and create a temporary least-privilege training identity without using root for normal work.

## task-01-prerequisites: Verify accounts and local tools

**Feature:** Prerequisites  
**Difficulty:** Easy  
**Goal:** Confirm that the learner can reach AWS, HCP Terraform and GitHub, and that Terraform, AWS CLI and Git are available before any resource is created.

**Why it matters:** Remote runs are easier to troubleshoot when local tooling and account access are proven first.

**Exam relevance:** Know the difference between the local Terraform CLI and HCP Terraform remote execution.

### Browser / Console route

- [ ] **1.** Use a trusted browser and confirm you can sign in to the AWS account that will be used only for training. Do not create anything yet.
- [ ] **2.** Open https://app.terraform.io and sign in with an HCP account. If you do not yet have an HCP account, follow the HashiCorp sign-up flow. Do not create the organization yet; its name will be derived from the AWS account ID later.
- [ ] **3.** Confirm you have a GitHub.com account that can create a private repository and authorize the Terraform Cloud by HashiCorp GitHub App. The HashiCorp VCS tutorial lists a GitHub account as a prerequisite.
- [ ] **4.** Open Windows PowerShell. Run the commands in the CLI block one at a time.
- [ ] **5.** If terraform is missing, install it from the HashiCorp Terraform install page and then reopen PowerShell.
- [ ] **6.** If aws is missing, install AWS CLI v2 from the AWS installation guide and then reopen PowerShell.
- [ ] **7.** If git is missing, install Git using the normal approved method for your workstation before continuing. This manuscript intentionally does not cite non-HashiCorp/non-AWS installation material.

### CLI / local route

#### Tool version checks

```text
terraform version
aws --version
git --version
```

### Expected results

- Terraform prints a version and does not report command-not-found.
- AWS CLI prints its version.
- Git prints its version.
- The learner can sign in to AWS, HCP Terraform and GitHub.

### Verification checks

- [ ] All three version commands run successfully.
- [ ] No AWS or HCP resource has been created yet.

### Troubleshooting

- **terraform is not recognized** — Install Terraform from the official HashiCorp install page, reopen PowerShell, and rerun terraform version.
- **aws is not recognized** — Install AWS CLI v2 from the official AWS installation guide, reopen PowerShell, and rerun aws --version.
- **HCP Terraform sign-in fails** — Complete or recover the HCP account sign-in before continuing; do not bypass the account requirement.

### Official sources used by this task

- **Sign up for HCP Terraform** — https://developer.hashicorp.com/terraform/tutorials/cloud-get-started/cloud-sign-up
- **Install Terraform** — https://developer.hashicorp.com/terraform/install
- **Install or update to the latest version of the AWS CLI** — https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

---

## task-02-aws-bootstrap: Create the temporary AWS training IAM user

**Feature:** AWS account safety and least privilege  
**Difficulty:** Medium  
**Goal:** Use the AWS root user only to create a dedicated temporary IAM user and its restricted bootstrap policy, then sign out of root.

**Why it matters:** The HCP lab must not use root credentials or broad permanent administrator credentials for normal work.

**Exam relevance:** Least privilege and avoiding root credentials are core AWS operational practices.

**Prerequisites:** `task-01-prerequisites`

**Task warning:**

- The account-ID wildcard appears only inside fixed lab resource ARNs because an offline manuscript cannot know the learner's account number; the allowed actions remain tightly named.

### Browser / Console route

- [ ] **1.** Sign in to the AWS Management Console as the AWS account root user only for this bootstrap task. Do not create a root access key.
- [ ] **2.** Open IAM. In the left navigation, choose Policies, then Create policy.
- [ ] **3.** Choose the JSON editor and replace the editor contents with the supplied Temporary bootstrap IAM policy block exactly.
- [ ] **4.** Choose Next. Set Policy name to fa-hcp-terraform-admin-policy. Add the description Temporary training policy for the HCP Terraform remote runs Follow Along. Review the actions and choose Create policy.
- [ ] **5.** In IAM, choose Users, then Create user.
- [ ] **6.** Set User name to fa-hcp-terraform-admin.
- [ ] **7.** Enable AWS Management Console access for the user. Use a temporary password that meets the account password policy and require the user to create a new password at next sign-in if that option is offered.
- [ ] **8.** On the permissions step, attach the customer-managed policy fa-hcp-terraform-admin-policy that you just created. Do not attach AdministratorAccess or IAMFullAccess.
- [ ] **9.** Create the user and record the IAM user sign-in URL or the AWS account ID shown by AWS. Do not record the temporary password in the repository.
- [ ] **10.** Sign out of the root user immediately.

### Supplied configuration

#### Temporary bootstrap IAM policy

> The account-number position is wildcarded only because this offline manuscript cannot know the learner's account ID. Actions and named IAM/SSM resources remain restricted to the lab names.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ManageOwnTemporaryAccessKeysAndPassword",
      "Effect": "Allow",
      "Action": [
        "iam:ChangePassword",
        "iam:CreateAccessKey",
        "iam:ListAccessKeys",
        "iam:DeleteAccessKey",
        "iam:GetUser",
        "iam:ListAttachedUserPolicies",
        "iam:ListUserPolicies"
      ],
      "Resource": "arn:aws:iam::*:user/fa-hcp-terraform-admin"
    },
    {
      "Sid": "ReadPasswordPolicy",
      "Effect": "Allow",
      "Action": [
        "iam:GetAccountPasswordPolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyHcpTerraformOidcProvider",
      "Effect": "Allow",
      "Action": [
        "iam:CreateOpenIDConnectProvider",
        "iam:GetOpenIDConnectProvider",
        "iam:DeleteOpenIDConnectProvider",
        "iam:TagOpenIDConnectProvider",
        "iam:UntagOpenIDConnectProvider"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ListOnlyRequiredIamCollections",
      "Effect": "Allow",
      "Action": [
        "iam:ListOpenIDConnectProviders",
        "iam:ListRoles",
        "iam:GetAccountSummary",
        "iam:ListUsers",
        "iam:ListPolicies",
        "iam:ListAttachedRolePolicies"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyNamedHcpRunRole",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:GetRole",
        "iam:DeleteRole",
        "iam:UpdateAssumeRolePolicy",
        "iam:TagRole",
        "iam:UntagRole",
        "iam:ListRoleTags",
        "iam:PutRolePolicy",
        "iam:GetRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:ListRolePolicies"
      ],
      "Resource": "arn:aws:iam::*:role/fa-hcp-terraform-run-role"
    },
    {
      "Sid": "ReadOnlyLabParameterForVerification",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:ListTagsForResource"
      ],
      "Resource": "arn:aws:ssm:eu-west-2:*:parameter/fa-hcp-terraform/*"
    },
    {
      "Sid": "DescribeParameterMetadata",
      "Effect": "Allow",
      "Action": [
        "ssm:DescribeParameters"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VerifyCallerIdentity",
      "Effect": "Allow",
      "Action": [
        "sts:GetCallerIdentity"
      ],
      "Resource": "*"
    }
  ]
}
```

### CLI / local route

#### Root CLI safety rule

```text
# No root CLI commands are used in this Follow Along.
# Do not create or configure root access keys.
```

### Expected results

- IAM contains user fa-hcp-terraform-admin.
- The user has only the lab customer-managed policy attached.
- The root user is signed out and has no access key created for this lab.

### Verification checks

- [ ] IAM user fa-hcp-terraform-admin exists.
- [ ] Customer-managed policy fa-hcp-terraform-admin-policy is attached to that user.
- [ ] AdministratorAccess and IAMFullAccess are not attached.

### Troubleshooting

- **The JSON policy editor reports an error** — Check that only the supplied JSON object is present and that no Markdown fence markers were pasted into the editor.
- **The IAM user cannot be given console access** — Review the current AWS IAM user creation flow and ensure you are creating an IAM user, not an Identity Center user.
- **You are tempted to continue as root** — Stop, sign out root, and use fa-hcp-terraform-admin for the remaining AWS setup.

### Official sources used by this task

- **AWS account root user** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html
- **Best practices for protecting your AWS account root user** — https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html
- **Create an IAM user** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html
- **Create IAM policies** — https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html

---

## task-03-cli-profile: Sign in as the IAM user and create the named AWS CLI profile

**Feature:** AWS CLI identity  
**Difficulty:** Easy  
**Goal:** Change the IAM user's password, create one temporary access key for local CLI verification, configure the fa-hcp-terraform-admin profile, and record the account-derived HCP organization name.

**Why it matters:** A named profile keeps training commands separate from other AWS identities and makes identity checks explicit.

**Exam relevance:** A named AWS CLI profile and sts get-caller-identity provide a reliable identity check before infrastructure operations.

**Prerequisites:** `task-02-aws-bootstrap`

### Browser / Console route

- [ ] **1.** Use the IAM user sign-in URL from Task 2 and sign in as fa-hcp-terraform-admin. Change the temporary password if AWS prompts you.
- [ ] **2.** Open IAM, choose Users, choose fa-hcp-terraform-admin, then Security credentials.
- [ ] **3.** In Access keys, choose Create access key. Select the CLI use case if AWS asks. Read the warning and continue because this is a temporary training key for the local named profile only; HCP Terraform will not use it.
- [ ] **4.** Create the access key. Keep the access key ID and secret access key only long enough to enter them into aws configure. Never paste them into HCP Terraform, Git, the manuscript, screenshots, or lab-values.txt.
- [ ] **5.** After the profile has been configured and verified, close any page that still displays the secret access key.

### CLI / local route

#### Configure and verify the named profile

```text
aws configure --profile fa-hcp-terraform-admin
# When prompted:
# AWS Access Key ID: enter the temporary IAM-user access key ID
# AWS Secret Access Key: enter the matching secret access key
# Default region name: eu-west-2
# Default output format: json

aws sts get-caller-identity --profile fa-hcp-terraform-admin

$AwsAccountId = aws sts get-caller-identity --profile fa-hcp-terraform-admin --query Account --output text
$HcpOrg = "fa-hcp-terraform-org-$AwsAccountId"
$RunRoleArn = "arn:aws:iam::${AwsAccountId}:role/fa-hcp-terraform-run-role"

Write-Output "AWS account ID: $AwsAccountId"
Write-Output "HCP organization name: $HcpOrg"
Write-Output "Future HCP run role ARN: $RunRoleArn"
```

### Expected results

- get-caller-identity returns the ARN of fa-hcp-terraform-admin and the correct 12-digit AWS account ID.
- The HCP organization name is fa-hcp-terraform-org- followed by that account ID.
- The future run-role ARN ends with role/fa-hcp-terraform-run-role.

### Verification checks

- [ ] The caller ARN contains user/fa-hcp-terraform-admin.
- [ ] The AWS Region stored in the profile is eu-west-2.
- [ ] No access key or secret key has been copied into the Git repository or HCP Terraform.

### Troubleshooting

- **AccessDenied when creating the access key** — Confirm fa-hcp-terraform-admin-policy is attached to fa-hcp-terraform-admin and the user name matches exactly.
- **get-caller-identity shows a different identity** — Stop. Do not continue until the command uses --profile fa-hcp-terraform-admin and the returned ARN is the training user.
- **AWS CLI prompts are confusing** — Run aws configure --profile fa-hcp-terraform-admin again; it safely overwrites that profile's stored values.

### Official sources used by this task

- **Manage access keys for IAM users** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
- **aws configure** — https://docs.aws.amazon.com/cli/latest/reference/configure/
- **get-caller-identity** — https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html

---

# Phase 2: Terraform configuration and VCS

Build a small Terraform configuration locally, initialize it, and put it in a GitHub repository.

## task-04-local-terraform: Create and validate the Terraform configuration locally

**Feature:** Terraform configuration lifecycle  
**Difficulty:** Medium  
**Goal:** Create the complete root module, initialize the provider, format the files, validate the configuration, and create the dependency lock file without applying anything locally.

**Why it matters:** HCP will perform the real plan and apply; local init/validate catches syntax and dependency problems before VCS.

**Exam relevance:** terraform init prepares dependencies; terraform validate checks configuration syntax/consistency; .terraform.lock.hcl belongs in VCS.

**Prerequisites:** `task-03-cli-profile`

### Browser / Console route

- [ ] **1.** Open File Explorer and go to your user profile folder. Create a folder named terraform-labs if it does not exist, then inside it create fa-hcp-terraform-vcs-lab. The PowerShell route below can create both folders automatically instead.
- [ ] **2.** Open the folder in a text editor. Create files named versions.tf, providers.tf, variables.tf, main.tf, outputs.tf, .gitignore and README.md.
- [ ] **3.** Copy each supplied file block into the file with the matching filename. Save every file as plain UTF-8 text.
- [ ] **4.** Notice that providers.tf contains only the AWS Region. It contains no access key, secret key or HCP token.
- [ ] **5.** Notice that variables.tf marks sensitive_demo as sensitive. The value will be provided in HCP Terraform later, not committed to Git.
- [ ] **6.** Do not create terraform.tfvars or any *.tfstate file.
- [ ] **7.** Run the PowerShell commands below from the lab folder. Do not run terraform apply locally.

### Supplied configuration

#### `versions.tf` — Terraform and provider requirements

```text
terraform {
  required_version = ">= 1.10.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}
```

#### `providers.tf` — AWS provider

```text
provider "aws" {
  region = "eu-west-2"
}
```

#### `variables.tf` — Input variables and deliberate validation rule

```text
variable "environment" {
  description = "Lab environment name. This Follow Along only permits the value training."
  type        = string

  validation {
    condition     = var.environment == "training"
    error_message = "For this Follow Along, environment must be exactly \"training\"."
  }
}

variable "training_message" {
  description = "Harmless text stored in the temporary SSM Parameter Store parameter."
  type        = string
}

variable "sensitive_demo" {
  description = "Harmless training-only value used to demonstrate sensitive variable handling. Never use a real secret here."
  type        = string
  sensitive   = true
}
```

#### `main.tf` — Initial AWS resource

```text
resource "aws_ssm_parameter" "training_message" {
  name        = "/fa-hcp-terraform/training-message"
  description = "Temporary parameter created by the HCP Terraform remote runs Follow Along"
  type        = "String"
  value       = "${var.training_message} | environment=${var.environment}"

  tags = {
    TrainingPrefix = "fa-hcp-terraform"
    Purpose        = "HCP Terraform remote runs Follow Along"
    ManagedBy      = "Terraform"
  }
}
```

#### `outputs.tf` — Outputs including a sensitive demonstration output

```text
output "parameter_name" {
  description = "Name of the temporary SSM parameter managed by Terraform."
  value       = aws_ssm_parameter.training_message.name
}

output "parameter_arn" {
  description = "ARN of the temporary SSM parameter managed by Terraform."
  value       = aws_ssm_parameter.training_message.arn
}

output "sensitive_demo" {
  description = "Harmless training value; marked sensitive so normal Terraform and HCP output redacts it."
  value       = var.sensitive_demo
  sensitive   = true
}
```

#### `.gitignore` — Files that must not be committed

```text
.terraform/
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfvars.json
lab-values.txt
hcp-trust-policy.json
hcp-run-policy.json
```

#### `README.md` — Lab README

```text
# fa-hcp-terraform-vcs-lab

Beginner training repository for HCP Terraform remote runs and collaboration.

Safety rules:
- AWS Region: eu-west-2.
- Training prefix: fa-hcp-terraform.
- HCP Terraform authenticates to AWS with OIDC dynamic credentials.
- Do not commit AWS access keys, HCP tokens, tfvars files, state files, or real secrets.
- The value used for `sensitive_demo` is fake training text only.
- Destroy the Terraform-managed AWS resource before deleting the HCP Terraform workspace.
```

### CLI / local route

#### Create the local folder and validate Terraform

```text
$LabRoot = Join-Path $HOME "terraform-labs\fa-hcp-terraform-vcs-lab"
New-Item -ItemType Directory -Path $LabRoot -Force | Out-Null
Set-Location $LabRoot

terraform fmt
terraform init
terraform validate

Get-ChildItem -Force
```

### Expected results

- terraform init installs a compatible hashicorp/aws 6.x provider and creates .terraform.lock.hcl.
- terraform validate reports Success! The configuration is valid.
- No AWS parameter is created because no apply has been run.
- .terraform.lock.hcl exists and .terraform is local-only.

### Verification checks

- [ ] versions.tf, providers.tf, variables.tf, main.tf, outputs.tf, .gitignore and README.md exist.
- [ ] .terraform.lock.hcl exists after terraform init.
- [ ] terraform validate succeeds.
- [ ] There is no local *.tfstate file.

### Troubleshooting

- **terraform init cannot download the provider** — Check internet/proxy access to the Terraform Registry and rerun terraform init after connectivity is fixed.
- **terraform validate reports an undeclared variable or syntax error** — Compare the affected file exactly with the supplied code block, save it, run terraform fmt, then rerun terraform validate.
- **.terraform.lock.hcl is missing** — Rerun terraform init from the same folder that contains versions.tf.

### Official sources used by this task

- **terraform init command reference** — https://developer.hashicorp.com/terraform/cli/commands/init
- **Dependency Lock File (.terraform.lock.hcl)** — https://developer.hashicorp.com/terraform/language/files/dependency-lock
- **Manage sensitive data in your configuration** — https://developer.hashicorp.com/terraform/language/manage-sensitive-data

---

## task-05-github-repo: Create the GitHub repository and push the initial configuration

**Feature:** Version control  
**Difficulty:** Medium  
**Goal:** Create a private GitHub repository named fa-hcp-terraform-vcs-lab and push the validated Terraform configuration to its main branch.

**Why it matters:** HCP Terraform's primary collaboration workflow associates remote runs with VCS commits.

**Exam relevance:** VCS-driven HCP Terraform runs are linked to commits, which supports reviewable and repeatable infrastructure changes.

**Prerequisites:** `task-04-local-terraform`

### Browser / Console route

- [ ] **1.** Sign in to GitHub.com in the browser.
- [ ] **2.** Create a new repository in your own account named fa-hcp-terraform-vcs-lab.
- [ ] **3.** Choose Private unless you intentionally want this training repository public.
- [ ] **4.** Create it as an empty repository: do not add a README, .gitignore or license in the GitHub creation screen because those files already exist locally.
- [ ] **5.** After GitHub creates the repository, copy the HTTPS repository URL shown for the repository. Do not copy any token or credential.
- [ ] **6.** Return to PowerShell and run the Git commands below. When prompted by Read-Host, paste only the HTTPS repository URL.
- [ ] **7.** If Git opens a browser authentication window, complete your normal GitHub authentication.
- [ ] **8.** Refresh the GitHub repository page and confirm the Terraform files and .terraform.lock.hcl are visible while .terraform, tfstate and lab-values.txt are absent.

### CLI / local route

#### Initialize Git and push main

```text
$LabRoot = Join-Path $HOME "terraform-labs\fa-hcp-terraform-vcs-lab"
Set-Location $LabRoot

git init
git branch -M main
git add .
git status
git commit -m "Initial HCP Terraform remote runs lab"

$RepoUrl = Read-Host "Paste the HTTPS URL shown by GitHub for fa-hcp-terraform-vcs-lab"
git remote add origin $RepoUrl
git push -u origin main

git status
git remote -v
git log -1 --oneline
```

### Expected results

- GitHub main contains the Terraform files, README.md, .gitignore and .terraform.lock.hcl.
- git status reports a clean working tree.
- No access key, tfvars file, state file, hcp-trust-policy.json or hcp-run-policy.json is committed.

### Verification checks

- [ ] The repository name is exactly fa-hcp-terraform-vcs-lab.
- [ ] The default branch is main.
- [ ] .terraform.lock.hcl is committed.
- [ ] .terraform and *.tfstate are not tracked.

### Troubleshooting

- **git commit says identity is unknown** — Configure your normal Git author name/email using your organization's approved Git setup, then rerun the commit. Do not put AWS credentials in Git configuration.
- **git remote add origin says origin already exists** — Run git remote -v. If the existing origin is wrong, run git remote set-url origin $RepoUrl and then push again.
- **GitHub rejects the push** — Complete the GitHub authentication prompt and confirm the pasted repository URL belongs to fa-hcp-terraform-vcs-lab.

### Official sources used by this task

- **Trigger HCP Terraform runs from VCS changes** — https://developer.hashicorp.com/terraform/tutorials/cloud-get-started/cloud-create-vcs-workspace
- **Set up the GitHub.com (GitHub App) VCS provider** — https://developer.hashicorp.com/terraform/cloud-docs/vcs/github-app
- **Dependency Lock File (.terraform.lock.hcl)** — https://developer.hashicorp.com/terraform/language/files/dependency-lock

---

# Phase 3: HCP Terraform organization, project and workspace

Create the collaboration boundary and connect it to the GitHub repository.

## task-06-hcp-org-project: Create the HCP Terraform organization and project

**Feature:** HCP collaboration boundaries  
**Difficulty:** Easy  
**Goal:** Create a uniquely named HCP Terraform organization and a dedicated project for the lab.

**Why it matters:** Organizations provide the top-level collaboration boundary; projects group related workspaces and their permissions/settings.

**Exam relevance:** HCP Terraform organizations and projects scope collaboration and access around workspaces.

**Prerequisites:** `task-05-github-repo`

### Browser / Console route

- [ ] **1.** In PowerShell, rerun the short command block below so the exact organization name is visible. Copy only the value printed after HCP organization name.
- [ ] **2.** Open https://app.terraform.io and sign in.
- [ ] **3.** Create a new HCP Terraform organization. For Organization name, enter fa-hcp-terraform-org- followed immediately by the 12-digit AWS account ID printed by PowerShell. This makes the name unique using a value created earlier in the Follow Along.
- [ ] **4.** Use a valid contact email for your own HCP account and finish creating the organization.
- [ ] **5.** Inside the new organization, choose Projects.
- [ ] **6.** Choose New project.
- [ ] **7.** Set Name to fa-hcp-terraform-project.
- [ ] **8.** Set Description to Beginner HCP Terraform remote runs and collaboration training project.
- [ ] **9.** Create the project.
- [ ] **10.** Keep this organization and project dedicated to this Follow Along so cleanup can remove them without affecting unrelated work.

### CLI / local route

#### Recreate the exact organization name from AWS identity

```text
$AwsAccountId = aws sts get-caller-identity --profile fa-hcp-terraform-admin --query Account --output text
$HcpOrg = "fa-hcp-terraform-org-$AwsAccountId"
Write-Output "HCP organization name: $HcpOrg"
```

### Expected results

- The HCP Terraform organization name begins fa-hcp-terraform-org- and ends with the learner's 12-digit AWS account ID.
- The organization contains project fa-hcp-terraform-project.
- No workspace exists yet.

### Verification checks

- [ ] The browser is inside the newly created lab organization, not another organization.
- [ ] fa-hcp-terraform-project appears in the Projects view.

### Troubleshooting

- **Organization name is already taken** — Recheck that you appended your own 12-digit AWS account ID exactly. If it is still unavailable, stop and choose a unique suffix that contains only non-secret account-neutral text, then record the final name for the OIDC trust.
- **You created the project in the wrong organization** — Delete the empty project from the wrong organization and recreate it inside the lab organization before continuing.

### Official sources used by this task

- **Sign up for HCP Terraform** — https://developer.hashicorp.com/terraform/tutorials/cloud-get-started/cloud-sign-up
- **Organizations overview** — https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/organizations
- **Manage projects in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/projects/manage

---

## task-07-vcs-workspace: Create the VCS-connected HCP Terraform workspace

**Feature:** VCS workflow and remote execution  
**Difficulty:** Medium  
**Goal:** Create fa-hcp-terraform-remote-runs in the lab project and connect it to the GitHub main branch.

**Why it matters:** The workspace becomes the shared run, variable and state boundary for this configuration.

**Exam relevance:** A VCS-driven workspace ties configuration versions to commits and runs Terraform remotely.

**Prerequisites:** `task-06-hcp-org-project`

### Browser / Console route

- [ ] **1.** Inside the lab HCP organization, choose Workspaces.
- [ ] **2.** Choose New, then Workspace.
- [ ] **3.** Choose project fa-hcp-terraform-project.
- [ ] **4.** Choose Version Control Workflow.
- [ ] **5.** Choose GitHub.com using the GitHub App flow. If this is the first connection, authorize Terraform Cloud by HashiCorp for your GitHub account.
- [ ] **6.** When GitHub asks which repositories the app may access, grant access to fa-hcp-terraform-vcs-lab. Avoid granting access to every repository when the narrower repository choice is available.
- [ ] **7.** Back in HCP Terraform, choose the GitHub account/organization and select repository fa-hcp-terraform-vcs-lab.
- [ ] **8.** Set Workspace name to fa-hcp-terraform-remote-runs.
- [ ] **9.** Leave the Terraform working directory empty so the repository root is used.
- [ ] **10.** Use branch main.
- [ ] **11.** Leave Auto Apply disabled so every successful plan requires a human Confirm & Apply action.
- [ ] **12.** Choose an HCP Terraform version that satisfies the configuration constraint >= 1.10.0 and < 2.0.0.
- [ ] **13.** Create the workspace.
- [ ] **14.** If HCP offers to scan and set Terraform variables immediately, go to the workspace overview instead. Variables will be configured deliberately after AWS OIDC is ready.
- [ ] **15.** Do not manually start the first run yet.

### CLI / local route

#### Confirm the repository commit that HCP should see

```text
$LabRoot = Join-Path $HOME "terraform-labs\fa-hcp-terraform-vcs-lab"
Set-Location $LabRoot
git branch --show-current
git log -1 --oneline
git status
```

### Expected results

- HCP Terraform shows workspace fa-hcp-terraform-remote-runs inside fa-hcp-terraform-project.
- The workspace shows a VCS connection to fa-hcp-terraform-vcs-lab on main.
- No run has been started yet.

### Verification checks

- [ ] Workspace project is fa-hcp-terraform-project.
- [ ] VCS repository is fa-hcp-terraform-vcs-lab.
- [ ] Auto Apply is disabled.
- [ ] The workspace has no successful apply yet.

### Troubleshooting

- **The repository does not appear in HCP** — Reopen the GitHub App connection and grant the app access to fa-hcp-terraform-vcs-lab, then return to workspace creation.
- **The wrong project was selected** — Before any run, use workspace Settings > General to move/recreate the workspace in fa-hcp-terraform-project.
- **HCP immediately reports missing variables** — That is expected because the Terraform variables do not have defaults; do not run yet. Continue to OIDC and variable setup.

### Official sources used by this task

- **Create workspaces in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/create
- **Set up the GitHub.com (GitHub App) VCS provider** — https://developer.hashicorp.com/terraform/cloud-docs/vcs/github-app
- **UI and VCS-driven run workflow** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/ui

---

# Phase 4: AWS OIDC dynamic credentials

Allow only the lab HCP workspace to obtain short-lived AWS credentials for the remote run.

## task-08-oidc-provider: Create the AWS OIDC identity provider for HCP Terraform

**Feature:** Federated authentication  
**Difficulty:** Medium  
**Goal:** Add app.terraform.io as an AWS IAM OIDC provider with audience aws.workload.identity.

**Why it matters:** OIDC lets HCP Terraform exchange its workload identity for short-lived AWS credentials instead of storing AWS access keys in HCP.

**Exam relevance:** Federation and short-lived credentials reduce long-lived secret handling and are a common cloud authentication pattern.

**Prerequisites:** `task-07-vcs-workspace`

### Browser / Console route

- [ ] **1.** Sign in to AWS as fa-hcp-terraform-admin, not root.
- [ ] **2.** Open IAM, choose Identity providers, then Add provider.
- [ ] **3.** Choose OpenID Connect.
- [ ] **4.** Set Provider URL to https://app.terraform.io.
- [ ] **5.** Set Audience to aws.workload.identity.
- [ ] **6.** Create the provider.
- [ ] **7.** Open the new provider and verify its provider URL is app.terraform.io and its audience/client ID includes aws.workload.identity.
- [ ] **8.** Choose either the Console creation route above or the CLI creation command below. Do not create the same provider twice; the second attempt would report that it already exists.

### CLI / local route

#### CLI creation alternative and verification

```text
# Run the create command only if you did NOT create the provider in the AWS Console.
aws iam create-open-id-connect-provider `
  --url https://app.terraform.io `
  --client-id-list aws.workload.identity `
  --profile fa-hcp-terraform-admin

$AwsAccountId = aws sts get-caller-identity --profile fa-hcp-terraform-admin --query Account --output text
$OidcArn = "arn:aws:iam::${AwsAccountId}:oidc-provider/app.terraform.io"

aws iam get-open-id-connect-provider `
  --open-id-connect-provider-arn $OidcArn `
  --profile fa-hcp-terraform-admin
```

### Expected results

- IAM contains exactly one OIDC provider for app.terraform.io.
- The provider client ID/audience includes aws.workload.identity.
- No AWS secret was entered in HCP Terraform.

### Verification checks

- [ ] get-open-id-connect-provider returns Url app.terraform.io.
- [ ] ClientIDList contains aws.workload.identity.

### Troubleshooting

- **EntityAlreadyExists or provider URL already exists** — Do not create a duplicate. Verify the existing provider has the correct URL and audience; because this lab assumes no pre-existing infrastructure, investigate why it exists before continuing.
- **AccessDenied creating the provider** — Confirm fa-hcp-terraform-admin-policy is still attached and you are using the fa-hcp-terraform-admin identity.
- **The audience is wrong** — Delete the lab OIDC provider and recreate it with aws.workload.identity before creating the role.

### Official sources used by this task

- **Use dynamic credentials with the AWS provider** — https://developer.hashicorp.com/terraform/cloud-docs/dynamic-provider-credentials/aws-configuration
- **Create a role for OpenID Connect federation** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html
- **create-open-id-connect-provider** — https://docs.aws.amazon.com/cli/latest/reference/iam/create-open-id-connect-provider.html

---

## task-09-run-role: Create the HCP Terraform AWS run role

**Feature:** OIDC trust and least privilege  
**Difficulty:** Hard  
**Goal:** Create fa-hcp-terraform-run-role with trust restricted to the exact lab organization, project, workspace and any run phase, then grant only the SSM Parameter permissions required by the configuration.

**Why it matters:** A correct trust policy answers who may assume the role; the permissions policy answers what the role may do after it is assumed.

**Exam relevance:** Trust policies and permissions policies solve different IAM problems; least-privilege OIDC trust is safer than static cloud keys.

**Prerequisites:** `task-08-oidc-provider`

### Browser / Console route

- [ ] **1.** In AWS IAM, choose Roles, then Create role.
- [ ] **2.** Choose Web identity as the trusted entity type.
- [ ] **3.** Choose identity provider app.terraform.io.
- [ ] **4.** For Audience, choose aws.workload.identity.
- [ ] **5.** For Organization, enter the exact HCP organization name created in Task 6.
- [ ] **6.** For Project, enter fa-hcp-terraform-project.
- [ ] **7.** For Workspace, enter fa-hcp-terraform-remote-runs.
- [ ] **8.** For Run Phase, enter * so the same role can be used for both plan and apply phases in this training workspace.
- [ ] **9.** Continue to permissions. Do not attach AdministratorAccess or a broad AWS managed policy.
- [ ] **10.** Set Role name to fa-hcp-terraform-run-role and create the role.
- [ ] **11.** Open the role, choose Add permissions, then Create inline policy.
- [ ] **12.** Choose JSON and paste the supplied HCP Terraform run-role inline permissions policy.
- [ ] **13.** Name the inline policy fa-hcp-terraform-run-policy and create it.
- [ ] **14.** Open the Trust relationships tab and confirm the trusted principal is the app.terraform.io OIDC provider and the conditions include audience aws.workload.identity plus the exact organization, project and workspace scope.

### Supplied configuration

#### HCP Terraform run-role inline permissions policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ManageOnlyTrainingParameter",
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
      "Resource": "arn:aws:ssm:eu-west-2:*:parameter/fa-hcp-terraform/*"
    },
    {
      "Sid": "DescribeParametersForProviderRefresh",
      "Effect": "Allow",
      "Action": [
        "ssm:DescribeParameters"
      ],
      "Resource": "*"
    }
  ]
}
```

### CLI / local route

#### Verify the role and its inline policy

```text
aws iam get-role `
  --role-name fa-hcp-terraform-run-role `
  --profile fa-hcp-terraform-admin

aws iam list-role-policies `
  --role-name fa-hcp-terraform-run-role `
  --profile fa-hcp-terraform-admin

aws iam get-role-policy `
  --role-name fa-hcp-terraform-run-role `
  --policy-name fa-hcp-terraform-run-policy `
  --profile fa-hcp-terraform-admin
```

#### Optional CLI alternative for role creation - use instead of the Console route, not as well as it

```text
$AwsAccountId = aws sts get-caller-identity --profile fa-hcp-terraform-admin --query Account --output text
$HcpOrg = "fa-hcp-terraform-org-$AwsAccountId"

$TrustPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AwsAccountId}:oidc-provider/app.terraform.io"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "app.terraform.io:aud": "aws.workload.identity"
        },
        "StringLike": {
          "app.terraform.io:sub": "organization:${HcpOrg}:project:fa-hcp-terraform-project:workspace:fa-hcp-terraform-remote-runs:run_phase:*"
        }
      }
    }
  ]
}
"@

$TrustPolicy | Set-Content -Encoding utf8 .\hcp-trust-policy.json

aws iam create-role `
  --role-name fa-hcp-terraform-run-role `
  --assume-role-policy-document file://hcp-trust-policy.json `
  --profile fa-hcp-terraform-admin

$RunPolicy = @'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ManageOnlyTrainingParameter",
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
      "Resource": "arn:aws:ssm:eu-west-2:*:parameter/fa-hcp-terraform/*"
    },
    {
      "Sid": "DescribeParametersForProviderRefresh",
      "Effect": "Allow",
      "Action": [
        "ssm:DescribeParameters"
      ],
      "Resource": "*"
    }
  ]
}
'@

$RunPolicy | Set-Content -Encoding utf8 .\hcp-run-policy.json

aws iam put-role-policy `
  --role-name fa-hcp-terraform-run-role `
  --policy-name fa-hcp-terraform-run-policy `
  --policy-document file://hcp-run-policy.json `
  --profile fa-hcp-terraform-admin

Remove-Item .\hcp-trust-policy.json, .\hcp-run-policy.json -Force
```

### Expected results

- Role fa-hcp-terraform-run-role exists.
- The trust is limited to app.terraform.io with audience aws.workload.identity and the exact lab organization/project/workspace.
- Inline policy fa-hcp-terraform-run-policy allows only the required Parameter Store path in eu-west-2 plus parameter metadata reads.

### Verification checks

- [ ] Role trust contains app.terraform.io:aud = aws.workload.identity.
- [ ] Role trust contains the exact HCP organization, project and workspace names.
- [ ] The role has no AdministratorAccess policy attached.
- [ ] Inline policy name is fa-hcp-terraform-run-policy.

### Troubleshooting

- **AWS rejects the role because app.terraform.io:sub is missing** — Recreate or edit the trust so it includes the HCP organization/project/workspace subject condition. AWS requires this control for HCP Terraform OIDC roles.
- **HCP later receives AccessDenied for SSM** — Return to this inline policy and compare every SSM action and the /fa-hcp-terraform/* resource path exactly.
- **The CLI alternative reports EntityAlreadyExists** — You already created the role in the Console. Do not run both creation routes; use the verification commands only.

### Official sources used by this task

- **Use dynamic credentials with the AWS provider** — https://developer.hashicorp.com/terraform/cloud-docs/dynamic-provider-credentials/aws-configuration
- **Create a role for OpenID Connect federation** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html
- **Create IAM policies** — https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html

---

## task-10-workspace-variables: Configure HCP Terraform variables and the deliberate failure value

**Feature:** Workspace variables and dynamic credentials  
**Difficulty:** Medium  
**Goal:** Add the required AWS dynamic credential environment variables and the three Terraform variables, deliberately setting environment to broken for the first run.

**Why it matters:** This shows the difference between environment variables used by the execution environment and Terraform input variables consumed by the configuration.

**Exam relevance:** Workspace variables are injected at run time; sensitive flags redact UI/log display but do not automatically remove values from state.

**Prerequisites:** `task-09-run-role`

### Browser / Console route

- [ ] **1.** In HCP Terraform, open workspace fa-hcp-terraform-remote-runs and choose Variables.
- [ ] **2.** Under Workspace Variables, choose Add variable. Category: Environment variable. Key: TFC_AWS_PROVIDER_AUTH. Value: true. Sensitive: off. Save.
- [ ] **3.** Add another Environment variable. Key: TFC_AWS_RUN_ROLE_ARN. Build the exact role ARN with the PowerShell command below and paste its printed value. Sensitive: off because an ARN is an identifier, not a secret. Save.
- [ ] **4.** Add another Environment variable. Key: AWS_REGION. Value: eu-west-2. Sensitive: off. Save.
- [ ] **5.** Add a Terraform variable. Key: environment. Value: broken. HCL: off. Sensitive: off. Save. This wrong value is intentional and will create the required failed run.
- [ ] **6.** Add a Terraform variable. Key: training_message. Value: Created by HCP Terraform remote run. HCL: off. Sensitive: off. Save.
- [ ] **7.** Add a Terraform variable. Key: sensitive_demo. Value: training-secret-not-real. HCL: off. Sensitive: ON. Save.
- [ ] **8.** After saving sensitive_demo, confirm HCP no longer shows its value. Do not try to recover it from state. The value is deliberately fake because a Terraform value marked sensitive can still be stored in state.
- [ ] **9.** Do not create AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY variables in HCP Terraform.

### CLI / local route

#### Print the exact role ARN to paste into HCP Terraform

```text
$AwsAccountId = aws sts get-caller-identity --profile fa-hcp-terraform-admin --query Account --output text
$RunRoleArn = "arn:aws:iam::${AwsAccountId}:role/fa-hcp-terraform-run-role"
Write-Output $RunRoleArn
```

### Expected results

- HCP Variables shows three environment variables and three Terraform variables.
- sensitive_demo is write-only/redacted in the HCP UI.
- environment is deliberately broken for the next task.
- No static AWS credential variable exists in HCP.

### Verification checks

- [ ] TFC_AWS_PROVIDER_AUTH equals true.
- [ ] TFC_AWS_RUN_ROLE_ARN ends with role/fa-hcp-terraform-run-role.
- [ ] AWS_REGION equals eu-west-2.
- [ ] environment equals broken.
- [ ] sensitive_demo is marked Sensitive.

### Troubleshooting

- **HCP asks whether a Terraform value is HCL** — Leave HCL off for all three values because each value is a plain string.
- **You accidentally used a real password/token for sensitive_demo** — Immediately replace it with training-secret-not-real. This lab must never put a real secret into Terraform state.
- **TFC_AWS_RUN_ROLE_ARN contains the wrong account ID** — Rerun get-caller-identity with the named profile and rebuild the ARN before starting a run.

### Official sources used by this task

- **Manage variables and variable sets in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/variables/managing-variables
- **Use dynamic credentials with the AWS provider** — https://developer.hashicorp.com/terraform/cloud-docs/dynamic-provider-credentials/aws-configuration
- **Manage sensitive data in your configuration** — https://developer.hashicorp.com/terraform/language/manage-sensitive-data

---

# Phase 5: Remote plans, applies and failure recovery

Create one deliberate failed run, fix it, apply successfully, and trigger another run from VCS.

## task-11-failed-run: Start the first remote run and diagnose the deliberate failure

**Feature:** Remote plan troubleshooting  
**Difficulty:** Medium  
**Goal:** Manually start the VCS workspace's first run, observe the validation failure caused by environment=broken, and prove that no AWS resource was created.

**Why it matters:** A new VCS workspace must have a manually queued first run before later VCS webhooks can trigger runs; controlled failures teach how to read run output safely.

**Exam relevance:** Terraform variable validation can fail a plan before changes are applied; run history preserves the failure for troubleshooting.

**Prerequisites:** `task-10-workspace-variables`

### Browser / Console route

- [ ] **1.** Open the HCP workspace Overview/Runs page.
- [ ] **2.** Choose + New run.
- [ ] **3.** Choose a normal Plan and apply/standard run mode. Leave debugging mode off.
- [ ] **4.** Enter the message Initial run - expected validation failure.
- [ ] **5.** Start the run.
- [ ] **6.** Open the run details while the plan executes.
- [ ] **7.** Confirm the run is tied to the VCS configuration from fa-hcp-terraform-vcs-lab.
- [ ] **8.** Read the plan error. It should point to the environment variable validation rule and include: For this Follow Along, environment must be exactly "training".
- [ ] **9.** Do not change the Terraform code. The intended fix is the workspace variable value.
- [ ] **10.** In AWS Systems Manager in eu-west-2, open Parameter Store and confirm /fa-hcp-terraform/training-message is absent.

### CLI / local route

#### Prove the failed plan created nothing

> This command is expected to fail with ParameterNotFound because the plan failed before an apply created the resource.

```text
aws ssm get-parameter `
  --name /fa-hcp-terraform/training-message `
  --region eu-west-2 `
  --profile fa-hcp-terraform-admin
```

### Expected results

- The HCP run ends in an errored/failed plan state.
- The failure message clearly identifies the environment validation rule.
- There is no Confirm & Apply for a failed plan.
- The SSM parameter does not exist.

### Verification checks

- [ ] The failed run appears in HCP run history.
- [ ] The failure is caused by environment=broken rather than AWS authentication.
- [ ] AWS Parameter Store has no /fa-hcp-terraform/training-message parameter.

### Troubleshooting

- **The run fails with an AWS credential or AssumeRoleWithWebIdentity error instead of the validation message** — Do not proceed to the planned failure exercise. Recheck TFC_AWS_PROVIDER_AUTH, TFC_AWS_RUN_ROLE_ARN, the OIDC provider audience, and the role trust organization/project/workspace fields.
- **The run succeeds unexpectedly** — Open Variables and confirm environment is exactly broken. If it was already training, change it to broken and start another manual run so the required failure is observed.
- **The parameter already exists** — Stop. This lab assumes no pre-existing resource at /fa-hcp-terraform/training-message. Identify and remove only your own conflicting training parameter before continuing.

### Official sources used by this task

- **Create workspaces in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/create
- **UI and VCS-driven run workflow** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/ui
- **Manage and view runs in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/manage
- **AWS Systems Manager Parameter Store** — https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html

---

## task-12-fix-apply: Fix the variable, review the plan and apply remotely

**Feature:** Remote plan and apply  
**Difficulty:** Medium  
**Goal:** Correct environment to training, queue a new run, review the one-resource plan, confirm the apply, and verify the AWS parameter.

**Why it matters:** Terraform's plan/apply split lets a human review intended changes before HCP Terraform mutates AWS.

**Exam relevance:** Remote runs preserve plan review, apply confirmation, logs, state and collaboration history in one workspace.

**Prerequisites:** `task-11-failed-run`

### Browser / Console route

- [ ] **1.** Open workspace Variables.
- [ ] **2.** Edit the Terraform variable environment. Change its value from broken to training and save.
- [ ] **3.** Return to the workspace and choose + New run.
- [ ] **4.** Start a normal Plan and apply run with message Fix environment and create training parameter.
- [ ] **5.** Wait for the plan to finish.
- [ ] **6.** Review the plan carefully. It should propose one aws_ssm_parameter.training_message resource to add and no unrelated resources.
- [ ] **7.** Check the planned name is /fa-hcp-terraform/training-message and the AWS provider Region is eu-west-2.
- [ ] **8.** Confirm that the sensitive_demo output is redacted rather than printed in normal output.
- [ ] **9.** Choose Confirm & Apply, add a short confirmation comment if the UI requests one, then confirm the plan.
- [ ] **10.** Wait until the apply finishes successfully.
- [ ] **11.** Open AWS Systems Manager in eu-west-2, choose Parameter Store, then choose /fa-hcp-terraform/training-message.
- [ ] **12.** Verify Type is String, the value ends with environment=training, and tags include TrainingPrefix=fa-hcp-terraform, Purpose=HCP Terraform remote runs Follow Along, and ManagedBy=Terraform.

### CLI / local route

#### Verify the Terraform-created parameter from AWS CLI

```text
aws ssm get-parameter `
  --name /fa-hcp-terraform/training-message `
  --region eu-west-2 `
  --profile fa-hcp-terraform-admin

aws ssm list-tags-for-resource `
  --resource-type Parameter `
  --resource-id /fa-hcp-terraform/training-message `
  --region eu-west-2 `
  --profile fa-hcp-terraform-admin
```

### Expected results

- Plan summary is 1 to add, 0 to change, 0 to destroy.
- Apply succeeds and creates exactly one managed AWS resource.
- The AWS parameter value is Created by HCP Terraform remote run | environment=training.
- The sensitive output remains redacted in ordinary run output.

### Verification checks

- [ ] HCP run status is Applied/Finished successfully.
- [ ] AWS CLI get-parameter returns /fa-hcp-terraform/training-message.
- [ ] The parameter is in eu-west-2.
- [ ] Tags match the training prefix and Terraform ownership.

### Troubleshooting

- **Plan shows resources other than the single SSM parameter** — Do not apply. Compare the VCS configuration with the supplied files and discard the run until the plan contains only the intended resource.
- **AssumeRoleWithWebIdentity is denied** — Check the exact HCP org/project/workspace names in the role trust and confirm audience aws.workload.identity.
- **PutParameter is AccessDenied** — Check fa-hcp-terraform-run-policy is inline on the run role and its resource path is arn:aws:ssm:eu-west-2:*:parameter/fa-hcp-terraform/*.

### Official sources used by this task

- **Manage variables and variable sets in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/variables/managing-variables
- **UI and VCS-driven run workflow** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/ui
- **Manage and view runs in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/manage
- **AWS Systems Manager Parameter Store** — https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- **Creating a Parameter Store parameter using the console** — https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-create-console.html
- **Manage sensitive data in your configuration** — https://developer.hashicorp.com/terraform/language/manage-sensitive-data

---

## task-13-vcs-triggered-run: Trigger a remote run from a VCS commit

**Feature:** Collaboration through VCS  
**Difficulty:** Medium  
**Goal:** Add one harmless tag in main.tf, commit and push it, observe HCP Terraform automatically queue the remote plan, then apply and verify the change.

**Why it matters:** After the initial manual run, HCP Terraform's VCS webhook turns reviewed commits on the tracked branch into remote Terraform runs.

**Exam relevance:** VCS-driven workflows connect infrastructure changes to commits and enable shared review before apply.

**Prerequisites:** `task-12-fix-apply`

### Browser / Console route

- [ ] **1.** Open the local main.tf file.
- [ ] **2.** Replace its contents with the supplied Updated main.tf block, which adds only Collaboration = "vcs-remote-run" to the tags map.
- [ ] **3.** Save the file.
- [ ] **4.** Run terraform fmt and terraform validate locally.
- [ ] **5.** Review git diff and confirm the only intended infrastructure change is the new Collaboration tag.
- [ ] **6.** Commit and push the change to main using the CLI block.
- [ ] **7.** Do not click + New run in HCP. Open the workspace Runs page and wait for the VCS webhook to queue a new run automatically.
- [ ] **8.** Open the new run and confirm it references the new Git commit.
- [ ] **9.** Review the plan. It should show the existing parameter changing in place with one tag added; it must not propose a replacement or unrelated resource.
- [ ] **10.** Choose Confirm & Apply.
- [ ] **11.** After the apply finishes, verify the Collaboration tag in AWS.

### Supplied configuration

#### `main.tf` — Updated main.tf for the VCS-triggered collaboration run

```text
resource "aws_ssm_parameter" "training_message" {
  name        = "/fa-hcp-terraform/training-message"
  description = "Temporary parameter created by the HCP Terraform remote runs Follow Along"
  type        = "String"
  value       = "${var.training_message} | environment=${var.environment}"

  tags = {
    TrainingPrefix = "fa-hcp-terraform"
    Purpose        = "HCP Terraform remote runs Follow Along"
    ManagedBy      = "Terraform"
    Collaboration  = "vcs-remote-run"
  }
}
```

### CLI / local route

#### Commit the collaboration change

```text
$LabRoot = Join-Path $HOME "terraform-labs\fa-hcp-terraform-vcs-lab"
Set-Location $LabRoot

terraform fmt
terraform validate
git diff

git add main.tf
git commit -m "Add collaboration tag for VCS remote run"
git push

git log -1 --oneline
```

#### Verify the applied tag in AWS

```text
aws ssm list-tags-for-resource `
  --resource-type Parameter `
  --resource-id /fa-hcp-terraform/training-message `
  --region eu-west-2 `
  --profile fa-hcp-terraform-admin
```

### Expected results

- HCP automatically queues the run after the push to main.
- The plan is an in-place change, normally 0 to add, 1 to change, 0 to destroy.
- The run identifies the VCS commit that caused it.
- AWS shows Collaboration=vcs-remote-run on the parameter.

### Verification checks

- [ ] No manual + New run was required after the Git push.
- [ ] The HCP run is linked to the latest commit.
- [ ] The parameter remains the same named object and now has the Collaboration tag.

### Troubleshooting

- **No run appears after the push** — Confirm Task 11 manually started at least one run, the workspace tracks main, and the latest commit is actually on main. Then review the workspace VCS connection.
- **Plan wants to recreate the parameter** — Discard the run and compare main.tf with the supplied updated block; only a tag should have changed.
- **Git says there is nothing to commit** — Run git diff and confirm the Collaboration line was saved in main.tf before trying again.

### Official sources used by this task

- **UI and VCS-driven run workflow** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/ui
- **Create workspaces in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/create
- **Dependency Lock File (.terraform.lock.hcl)** — https://developer.hashicorp.com/terraform/language/files/dependency-lock
- **AWS Systems Manager Parameter Store** — https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html

---

# Phase 6: Remote state and locking

Inspect HCP-managed state, understand sensitive state, and distinguish state locking from a manual workspace lock.

## task-14-remote-state: Examine HCP Terraform remote state safely

**Feature:** Remote state  
**Difficulty:** Medium  
**Goal:** Use the States view to inspect state version metadata and prove the configuration has no local state file or explicit backend block.

**Why it matters:** State is Terraform's mapping between configuration addresses and real remote objects; HCP Terraform stores workspace state automatically for remote runs.

**Exam relevance:** Remote state enables collaboration, but state access must be controlled because sensitive values can be stored there.

**Prerequisites:** `task-13-vcs-triggered-run`

### Browser / Console route

- [ ] **1.** Open the HCP workspace and choose States.
- [ ] **2.** Open the latest state version entry.
- [ ] **3.** Confirm it is associated with the most recent successful run and, where shown, the VCS commit used by that run.
- [ ] **4.** Review the state version's summary/diff information and confirm the workspace manages the aws_ssm_parameter.training_message resource.
- [ ] **5.** Do not open or download the raw state file for this exercise. The fake sensitive_demo value is deliberately marked sensitive, but HashiCorp documents that sensitive values can still exist in state. Treat state as sensitive data.
- [ ] **6.** Return to the repository and confirm there is no backend block in any .tf file. Remote HCP runs automatically use the workspace state, so this VCS-driven configuration does not need an explicit backend configuration.
- [ ] **7.** Use the local PowerShell checks below to prove no local tfstate file has been created or tracked.

### CLI / local route

#### Check that state is not local or tracked by Git

> All three checks should return no matching state file/backend output for this lab.

```text
$LabRoot = Join-Path $HOME "terraform-labs\fa-hcp-terraform-vcs-lab"
Set-Location $LabRoot

Get-ChildItem -Force -Filter "*.tfstate*"
git ls-files | Select-String -Pattern "tfstate"
Select-String -Path *.tf -Pattern 'backend\s+"'
```

### Expected results

- HCP States contains historical state versions from successful applies.
- The latest state is linked to the latest run and VCS commit where applicable.
- No local *.tfstate file exists.
- No state file is committed to Git.
- No explicit backend block is required for the HCP remote-run workspace.

### Verification checks

- [ ] The latest HCP state reflects one managed SSM parameter.
- [ ] The local folder has no *.tfstate file.
- [ ] The Git repository has no tracked state file.
- [ ] The learner can explain that sensitive redaction does not equal removal from state.

### Troubleshooting

- **States is empty** — Confirm Task 12 and Task 13 applied successfully. Failed plans do not create an applied state version containing the AWS resource.
- **A local tfstate file exists** — Stop and identify how it was created. Do not commit it. This lab never runs terraform apply locally.
- **You opened raw state and saw the fake sensitive value** — Close the raw state view. The training value is intentionally harmless, and this demonstrates why real secrets must not be put into ordinary state-backed sensitive variables.

### Official sources used by this task

- **Manage workspace state in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/state
- **Manage sensitive data in your configuration** — https://developer.hashicorp.com/terraform/language/manage-sensitive-data
- **State Locking** — https://developer.hashicorp.com/terraform/language/state/locking

---

## task-15-locking: Understand state locking and demonstrate a manual workspace lock

**Feature:** State locking and collaboration control  
**Difficulty:** Medium  
**Goal:** Explain automatic Terraform state locking, then manually lock the HCP workspace, queue a standard run, observe it remain pending, and unlock the workspace.

**Why it matters:** State locking protects state from concurrent writers. HCP's manual workspace lock is a separate operator control that can intentionally pause standard runs.

**Exam relevance:** Terraform state locking prevents concurrent state writers; operators should avoid disabling locks because that can risk state corruption.

**Prerequisites:** `task-14-remote-state`

### Browser / Console route

- [ ] **1.** Before clicking anything, read the distinction: Terraform automatically locks state for operations that can write it when the backend supports locking. You normally do not configure or manually hold this lock during an HCP remote run.
- [ ] **2.** Also read the separate HCP control: a manual workspace lock prevents applies and many kinds of plans from proceeding. It is not the same thing as the transient Terraform state lock.
- [ ] **3.** Open workspace fa-hcp-terraform-remote-runs.
- [ ] **4.** Open Actions and choose Lock workspace. If your UI uses Settings > Locking instead, use that page.
- [ ] **5.** Confirm the workspace header shows that the workspace is locked.
- [ ] **6.** While it is locked, choose + New run and queue a normal Plan and apply run with message Locking demonstration - no configuration change.
- [ ] **7.** Open the run list and confirm the standard run remains Pending while the manual workspace lock is held.
- [ ] **8.** Do not use force-unlock and do not disable state locking with -lock=false.
- [ ] **9.** Return to Actions and choose Unlock workspace.
- [ ] **10.** Watch the pending run continue. Because the configuration and variables did not change, it should normally finish with no infrastructure changes.
- [ ] **11.** If HCP asks you to discard a no-op run, discard it safely; do not create an artificial change just to make the run apply.

### CLI / local route

#### Local checks while HCP holds the collaboration lock

```text
$LabRoot = Join-Path $HOME "terraform-labs\fa-hcp-terraform-vcs-lab"
Set-Location $LabRoot
git status
git log -1 --oneline

# Do NOT run:
# terraform force-unlock
# terraform apply -lock=false
```

### Expected results

- The workspace visibly shows Locked.
- A standard run queued while locked remains Pending.
- After Unlock workspace, the pending run is allowed to continue.
- The learner can state that automatic state locking and a manual workspace lock are related collaboration safeguards but are not the same mechanism.

### Verification checks

- [ ] The manual workspace lock is visible in HCP.
- [ ] The queued standard run is observed in Pending before unlock.
- [ ] The parameter remains present and unchanged after the no-op run.
- [ ] No force-unlock or -lock=false option was used.

### Troubleshooting

- **The run does not stay Pending** — Confirm you queued a normal Plan and apply run, not a plan-only/speculative run; HashiCorp documents that some plan-only operations are allowed while a workspace is locked.
- **Workspace cannot be locked** — Wait for any active run to finish first, then try the Actions > Lock workspace control again.
- **A run remains stuck after normal unlock** — Review run status and use normal cancel/retry controls first. Do not use force unlock unless you are resolving your own failed lock and understand the lock ID.

### Official sources used by this task

- **State Locking** — https://developer.hashicorp.com/terraform/language/state/locking
- **Manage and view runs in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/manage
- **Manage workspace state in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/state

---

# Phase 7: Ordered cleanup

Destroy managed infrastructure first, then remove HCP, VCS, AWS identity and local training resources in reverse-dependency order.

## task-16-destroy: Destroy the Terraform-managed AWS resource from HCP Terraform

**Feature:** Safe destroy  
**Difficulty:** Medium  
**Goal:** Queue and apply an HCP Terraform destroy plan before deleting the workspace, then verify the SSM parameter is gone.

**Why it matters:** Deleting a workspace does not automatically destroy its infrastructure; the resource must be destroyed while the workspace still owns its state.

**Exam relevance:** Always destroy managed infrastructure before deleting the state/workspace that Terraform needs to track it.

**Prerequisites:** `task-15-locking`

### Browser / Console route

- [ ] **1.** Confirm the workspace is unlocked and there are no runs currently planning, awaiting confirmation or applying.
- [ ] **2.** Open workspace Settings, then Destruction and Deletion.
- [ ] **3.** If Allow destroy plans is disabled, enable it for this lab workspace.
- [ ] **4.** Choose Queue destroy plan.
- [ ] **5.** When HCP asks for confirmation, type the exact workspace name fa-hcp-terraform-remote-runs.
- [ ] **6.** Queue the destroy plan.
- [ ] **7.** Review the plan. It must propose exactly the Terraform-managed SSM parameter for destruction and no unrelated AWS resources.
- [ ] **8.** Choose Confirm & Apply and confirm the destroy.
- [ ] **9.** Wait for the run to finish successfully.
- [ ] **10.** Open AWS Systems Manager in eu-west-2, choose Parameter Store, and verify /fa-hcp-terraform/training-message is absent.
- [ ] **11.** Open HCP States and verify the latest state no longer contains the managed aws_ssm_parameter resource. Historical state versions may remain until the workspace itself is deleted.

### CLI / local route

#### Verify the AWS resource is gone

> ParameterNotFound is the expected result after the destroy succeeds.

```text
aws ssm get-parameter `
  --name /fa-hcp-terraform/training-message `
  --region eu-west-2 `
  --profile fa-hcp-terraform-admin
```

### Expected results

- Destroy plan is 0 to add, 0 to change, 1 to destroy.
- Destroy apply succeeds.
- AWS returns ParameterNotFound for /fa-hcp-terraform/training-message.
- The current HCP state manages zero lab AWS resources.

### Verification checks

- [ ] The HCP destroy run finished successfully.
- [ ] The AWS parameter is absent in eu-west-2.
- [ ] The workspace is no longer managing the SSM parameter.

### Troubleshooting

- **Destroy plan shows more than one resource** — Do not confirm it. Return to States and configuration and identify why additional resources are managed before continuing.
- **Destroy is blocked** — Open Settings > Destruction and Deletion and enable Allow destroy plans for this lab workspace.
- **DeleteParameter is AccessDenied during apply** — Restore the required ssm:DeleteParameter permission to fa-hcp-terraform-run-policy, retry the destroy, and only continue after the resource is gone.

### Official sources used by this task

- **Destroy infrastructure resources and delete workspaces in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings/deletion
- **Deleting parameters from Parameter Store** — https://docs.aws.amazon.com/systems-manager/latest/userguide/deleting-parameters.html
- **Manage workspace state in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/state

---

## task-17-hcp-vcs-cleanup: Delete the HCP Terraform and VCS training resources

**Feature:** HCP/VCS cleanup  
**Difficulty:** Medium  
**Goal:** After AWS infrastructure is gone, delete the empty workspace, empty project, lab organization, and lab GitHub repository; revoke the HCP GitHub App only if it was installed solely for this lab.

**Why it matters:** Removing state before infrastructure would orphan resources, so HCP/VCS cleanup deliberately follows the successful destroy.

**Exam relevance:** State/workspace deletion is not infrastructure destruction; safe cleanup follows dependency order.

**Prerequisites:** `task-16-destroy`

### Browser / Console route

- [ ] **1.** In HCP Terraform, open fa-hcp-terraform-remote-runs Settings > Destruction and Deletion.
- [ ] **2.** Use Delete from HCP Terraform/Delete workspace. Confirm only after you have already verified that the workspace manages no infrastructure.
- [ ] **3.** Return to Projects, open fa-hcp-terraform-project, choose Settings, then Delete. A project can be deleted only when it contains no workspaces or Stacks.
- [ ] **4.** Open the lab organization's Settings and choose Delete this organization. Confirm only the organization whose name begins fa-hcp-terraform-org- and was created in Task 6.
- [ ] **5.** In GitHub, delete only repository fa-hcp-terraform-vcs-lab using the repository's deletion control. The exact GitHub button wording is intentionally not asserted here because the source restriction for this Follow Along permits only HashiCorp and AWS documentation.
- [ ] **6.** If Terraform Cloud by HashiCorp was authorized to GitHub for the first time solely for this lab and you have no other HCP Terraform repository that needs it, follow HashiCorp's GitHub App deauthorizing guidance. If you already used the app elsewhere, leave the shared authorization in place.
- [ ] **7.** Do not delete the local folder yet. Keep it until AWS OIDC and IAM cleanup is complete so you still have the lab record while cleanup is being verified.

### CLI / local route

#### Keep the local record until AWS cleanup finishes

```text
$LabRoot = Join-Path $HOME "terraform-labs\fa-hcp-terraform-vcs-lab"
Set-Location $LabRoot
git log --oneline --max-count 5
git status
```

### Expected results

- The HCP workspace is deleted only after its infrastructure was destroyed.
- fa-hcp-terraform-project is deleted after it becomes empty.
- The lab HCP organization is removed.
- The GitHub lab repository is removed.
- Any pre-existing shared GitHub App authorization is preserved.

### Verification checks

- [ ] fa-hcp-terraform-remote-runs no longer exists.
- [ ] fa-hcp-terraform-project no longer exists.
- [ ] The lab organization no longer exists.
- [ ] Only the lab repository was selected for VCS deletion.

### Troubleshooting

- **HCP refuses to delete the workspace because it manages resources** — Stop. Return to Task 16 and verify the destroy run and current state; do not force-delete a workspace that still owns infrastructure.
- **HCP refuses to delete the project** — Check for remaining workspaces/Stacks in fa-hcp-terraform-project and remove only lab-created items after their infrastructure is safely destroyed.
- **You are unsure whether to revoke the GitHub App** — Leave it authorized. Revocation is optional and only safe when you know no other HCP Terraform workspace depends on it.

### Official sources used by this task

- **Destroy infrastructure resources and delete workspaces in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings/deletion
- **Manage projects in HCP Terraform** — https://developer.hashicorp.com/terraform/cloud-docs/projects/manage
- **Organization settings reference** — https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/organizations/settings
- **Set up the GitHub.com (GitHub App) VCS provider** — https://developer.hashicorp.com/terraform/cloud-docs/vcs/github-app

---

## task-18-aws-local-cleanup: Remove AWS federation, temporary IAM identity and local files

**Feature:** Final credential and local cleanup  
**Difficulty:** Hard  
**Goal:** Delete the run role and OIDC provider, then use root only for final removal of the temporary IAM user/policy, remove the local CLI profile, and finally delete the local lab folder.

**Why it matters:** Credentials and state/local evidence are removed last so they remain available until cloud cleanup has been verified.

**Exam relevance:** Clean teardown reverses dependencies: managed resources first, then control plane and credentials, then local files.

**Prerequisites:** `task-17-hcp-vcs-cleanup`

### Browser / Console route

- [ ] **1.** Remain signed in to AWS as fa-hcp-terraform-admin for the federation cleanup.
- [ ] **2.** Open IAM > Roles > fa-hcp-terraform-run-role. Delete inline policy fa-hcp-terraform-run-policy, then delete the role.
- [ ] **3.** Open IAM > Identity providers. Select only app.terraform.io and delete that provider. Because this Follow Along assumed no pre-existing provider, it should be the one created in Task 8; if you discover it is shared, do not delete it until you have proved no other workload uses it.
- [ ] **4.** Verify the role and OIDC provider are gone before touching the training user's credentials.
- [ ] **5.** Sign out of fa-hcp-terraform-admin.
- [ ] **6.** Sign in as the AWS root user only for final IAM identity removal. Do not create a root access key.
- [ ] **7.** Open IAM > Users > fa-hcp-terraform-admin. Remove its temporary access key, console login profile and attached fa-hcp-terraform-admin-policy as required by the IAM delete-user flow, then delete the user.
- [ ] **8.** Open IAM > Policies, select customer-managed policy fa-hcp-terraform-admin-policy, and delete it after it is no longer attached.
- [ ] **9.** Confirm the training user, policy, run role and app.terraform.io OIDC provider are absent, then sign out root.
- [ ] **10.** Open the local AWS shared credentials file and remove only the [fa-hcp-terraform-admin] profile section. Open the AWS config file and remove only the [profile fa-hcp-terraform-admin] section.
- [ ] **11.** Change PowerShell to your home directory, then delete the local fa-hcp-terraform-vcs-lab folder only after every cloud/HCP/VCS verification above is complete.
- [ ] **12.** Finish by reading and accepting the programme cleanup acknowledgement.

### CLI / local route

#### Delete AWS federation resources before deleting the IAM user

```text
$AwsAccountId = aws sts get-caller-identity --profile fa-hcp-terraform-admin --query Account --output text
$OidcArn = "arn:aws:iam::${AwsAccountId}:oidc-provider/app.terraform.io"

aws iam delete-role-policy `
  --role-name fa-hcp-terraform-run-role `
  --policy-name fa-hcp-terraform-run-policy `
  --profile fa-hcp-terraform-admin

aws iam delete-role `
  --role-name fa-hcp-terraform-run-role `
  --profile fa-hcp-terraform-admin

aws iam delete-open-id-connect-provider `
  --open-id-connect-provider-arn $OidcArn `
  --profile fa-hcp-terraform-admin

aws iam list-roles `
  --query "Roles[?RoleName=='fa-hcp-terraform-run-role'].RoleName" `
  --output text `
  --profile fa-hcp-terraform-admin

aws iam list-open-id-connect-providers `
  --query "OpenIDConnectProviderList[?contains(Arn, 'app.terraform.io')].Arn" `
  --output text `
  --profile fa-hcp-terraform-admin
```

#### Remove only the named local profile and lab folder after cloud cleanup

```text
notepad "$HOME\.aws\credentials"
# Remove only the [fa-hcp-terraform-admin] section, save, and close.

notepad "$HOME\.aws\config"
# Remove only the [profile fa-hcp-terraform-admin] section, save, and close.

Set-Location $HOME
$LabRoot = Join-Path $HOME "terraform-labs\fa-hcp-terraform-vcs-lab"
Remove-Item -Recurse -Force $LabRoot
```

### Expected results

- fa-hcp-terraform-run-role is absent.
- The lab app.terraform.io OIDC provider is absent.
- fa-hcp-terraform-admin and fa-hcp-terraform-admin-policy are absent.
- The fa-hcp-terraform-admin AWS CLI profile is removed.
- The local lab folder is removed only after all cloud resources and credentials are gone.

### Verification checks

- [ ] AWS IAM role fa-hcp-terraform-run-role does not exist.
- [ ] AWS IAM OIDC provider app.terraform.io created for this lab does not exist.
- [ ] IAM user fa-hcp-terraform-admin does not exist.
- [ ] Customer-managed policy fa-hcp-terraform-admin-policy does not exist.
- [ ] The named local AWS CLI profile and local lab folder are removed.

### Troubleshooting

- **delete-role reports DeleteConflict** — List the role's inline policies, delete fa-hcp-terraform-run-policy, then retry delete-role.
- **Deleting the IAM user is blocked** — In the root IAM console, remove the user's access keys, login profile and attached policy first, then retry Delete user.
- **The local profile still works after you thought credentials were removed** — Stop and check whether another credential source/environment variable is being used. Do not delete unrelated profiles; remove only the lab profile after confirming the training IAM user is gone.

### Official sources used by this task

- **Create a role for OpenID Connect federation** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html
- **Manage access keys for IAM users** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
- **Create an IAM user** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html
- **AWS account root user** — https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html
- **Best practices for protecting your AWS account root user** — https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html

---

# Ordered cleanup checklist

**Rule:** Cloud resources first; credentials, remote state/control-plane objects and local files only after dependency checks pass.

- [ ] **1. /fa-hcp-terraform/training-message** — Queue and apply the HCP Terraform destroy plan while the workspace still owns its state.
  - Verification: AWS get-parameter returns ParameterNotFound and HCP current state manages zero lab resources.
- [ ] **2. fa-hcp-terraform-remote-runs** — Safe-delete the empty HCP workspace after destroy.
  - Verification: Workspace no longer appears in HCP Terraform.
- [ ] **3. fa-hcp-terraform-project** — Delete the project after it contains no workspace/Stack.
  - Verification: Project no longer appears.
- [ ] **4. lab HCP organization** — Delete the exact dedicated HCP organization created in Task 6.
  - Verification: Lab organization no longer exists.
- [ ] **5. fa-hcp-terraform-vcs-lab** — Delete the lab GitHub repository; deauthorize the HCP GitHub App only when it was installed solely for this lab.
  - Verification: Lab repository is gone; any unrelated shared app authorization remains intact.
- [ ] **6. fa-hcp-terraform-run-policy then fa-hcp-terraform-run-role** — Delete the inline policy then the role.
  - Verification: IAM role query returns no fa-hcp-terraform-run-role.
- [ ] **7. app.terraform.io OIDC provider created by the lab** — Delete the OIDC provider after HCP resources are gone.
  - Verification: IAM OIDC listing no longer contains the lab provider.
- [ ] **8. fa-hcp-terraform-admin access key/user and fa-hcp-terraform-admin-policy** — Use root only for final training identity cleanup, then sign out root.
  - Verification: IAM user and policy are absent.
- [ ] **9. local AWS profile fa-hcp-terraform-admin** — Remove only the matching sections from AWS credentials/config files.
  - Verification: The named profile sections are absent.
- [ ] **10. local fa-hcp-terraform-vcs-lab folder** — Delete the local training folder last.
  - Verification: Local folder is absent.

## Programme cleanup acknowledgement

- [ ] I verified that /fa-hcp-terraform/training-message is absent in eu-west-2; the HCP workspace, project and dedicated organization created by this lab are removed; the lab GitHub repository is removed; the HCP AWS run role and lab OIDC provider are removed; the temporary IAM training user/policy/access key and named CLI profile are removed; and only after those checks did I remove the local lab folder.

# Troubleshooting index

## HCP first VCS commit does not start a run

**Likely cause:** A brand-new VCS workspace with no prior runs does not accept VCS webhook-triggered runs.

**Resolution:** Use + New run once for the initial run. Later commits to main should trigger runs automatically.

## Remote run reports No valid credential sources or AssumeRoleWithWebIdentity denied

**Likely cause:** Dynamic credential environment variables, OIDC audience, role ARN or trust conditions do not match.

**Resolution:** Check TFC_AWS_PROVIDER_AUTH=true, the exact TFC_AWS_RUN_ROLE_ARN, app.terraform.io, aws.workload.identity, and exact organization/project/workspace subject conditions.

## Remote run reports AccessDenied for ssm:PutParameter, tagging or deletion

**Likely cause:** The inline policy is missing an action or its eu-west-2 /fa-hcp-terraform/* ARN does not match.

**Resolution:** Compare fa-hcp-terraform-run-policy with the supplied JSON and retry only after the policy is corrected.

## The deliberate first run fails for AWS authentication instead of variable validation

**Likely cause:** OIDC must be fixed before the planned learning failure can be observed cleanly.

**Resolution:** Repair dynamic credentials first, then keep environment=broken and start a new run to observe the intended validation error.

## A VCS-triggered run does not appear after the second commit

**Likely cause:** The workspace may track another branch, the first run was never manually queued, or the VCS app lost repository access.

**Resolution:** Confirm main is the tracked branch, Task 11 occurred, and the GitHub App still has access to fa-hcp-terraform-vcs-lab.

## Run remains Pending

**Likely cause:** The workspace may be manually locked or another run may hold the workspace.

**Resolution:** Check the workspace header and Actions/Settings > Locking. Unlock only your deliberate lab lock after confirming no active apply should remain protected.

## Sensitive value appears redacted in UI but you assume it is absent from state

**Likely cause:** Sensitive redaction hides normal display; it does not automatically omit the value from plan/state.

**Resolution:** Treat state as sensitive and use only the fake training value in this lab. Do not open raw state just to prove the point.

## HCP refuses safe workspace deletion

**Likely cause:** The workspace still manages infrastructure or is locked.

**Resolution:** Return to the destroy task, ensure the current state manages zero lab resources, unlock normally, then use safe deletion.

## Terraform state exists locally

**Likely cause:** A local apply or another local state-writing command may have been run.

**Resolution:** Do not commit the file. Stop and reconcile ownership before cleanup. The intended lab flow never runs terraform apply locally.

## Cleanup command targets an unexpected name

**Likely cause:** A value was typed differently earlier or another environment is selected.

**Resolution:** Stop rather than broadening a delete command. Return to the resource inventory and delete only the exact lab-owned resource.

# Official source catalogue

Only HashiCorp Developer and AWS Documentation URLs are used for the technical basis of this manuscript.

## src-hc-signup — Sign up for HCP Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/cloud-get-started/cloud-sign-up
- **Purpose:** HCP Terraform account sign-in and tutorial-specific organization guidance.
- **Used by:** task-01-prerequisites, task-06-hcp-org-project

## src-tf-install — Install Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/install
- **Purpose:** Install the Terraform CLI when it is not already available.
- **Used by:** task-01-prerequisites

## src-hc-orgs — Organizations overview

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/organizations
- **Purpose:** Create and manage an HCP Terraform organization.
- **Used by:** task-06-hcp-org-project

## src-hc-org-settings — Organization settings reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/organizations/settings
- **Purpose:** Delete the lab organization after its workspaces and projects are removed.
- **Used by:** task-17-hcp-vcs-cleanup

## src-hc-projects — Manage projects in HCP Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/projects/manage
- **Purpose:** Create the lab project and delete it after it is empty.
- **Used by:** task-06-hcp-org-project, task-17-hcp-vcs-cleanup

## src-hc-vcs-github-app — Set up the GitHub.com (GitHub App) VCS provider

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/vcs/github-app
- **Purpose:** Authorize HCP Terraform to read the lab GitHub repository and later deauthorize it if it was installed only for this lab.
- **Used by:** task-05-github-repo, task-07-vcs-workspace, task-17-hcp-vcs-cleanup

## src-hc-vcs-tutorial — Trigger HCP Terraform runs from VCS changes

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/cloud-get-started/cloud-create-vcs-workspace
- **Purpose:** Create a repository for a VCS-driven workflow and understand commit-triggered remote runs.
- **Used by:** task-05-github-repo

## src-hc-workspace-create — Create workspaces in HCP Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/workspaces/create
- **Purpose:** Create the VCS-connected workspace and understand the required initial manual run.
- **Used by:** task-07-vcs-workspace, task-11-failed-run, task-13-vcs-triggered-run

## src-hc-vcs-runs — UI and VCS-driven run workflow

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/ui
- **Purpose:** Run plans and applies in the HCP UI and trigger later runs from VCS commits.
- **Used by:** task-07-vcs-workspace, task-11-failed-run, task-12-fix-apply, task-13-vcs-triggered-run

## src-hc-run-manage — Manage and view runs in HCP Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/workspaces/run/manage
- **Purpose:** Review runs, confirm applies, retry runs, and demonstrate a manual workspace lock.
- **Used by:** task-11-failed-run, task-12-fix-apply, task-15-locking

## src-hc-variables — Manage variables and variable sets in HCP Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/variables/managing-variables
- **Purpose:** Create Terraform and environment variables and mark the training sensitive value as sensitive.
- **Used by:** task-10-workspace-variables, task-12-fix-apply

## src-hc-aws-dynamic — Use dynamic credentials with the AWS provider

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/dynamic-provider-credentials/aws-configuration
- **Purpose:** Configure HCP Terraform to obtain short-lived AWS credentials with OIDC.
- **Used by:** task-08-oidc-provider, task-09-run-role, task-10-workspace-variables

## src-hc-state — Manage workspace state in HCP Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/workspaces/state
- **Purpose:** Examine HCP-managed remote state and state version history.
- **Used by:** task-14-remote-state, task-15-locking, task-16-destroy

## src-hc-workspace-delete — Destroy infrastructure resources and delete workspaces in HCP Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings/deletion
- **Purpose:** Queue a destroy plan before safely deleting the workspace.
- **Used by:** task-16-destroy, task-17-hcp-vcs-cleanup

## src-tf-sensitive — Manage sensitive data in your configuration

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/manage-sensitive-data
- **Purpose:** Explain sensitive redaction and the fact that sensitive values can still be stored in state.
- **Used by:** task-04-local-terraform, task-10-workspace-variables, task-12-fix-apply, task-14-remote-state

## src-tf-state-lock — State Locking

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/state/locking
- **Purpose:** Explain automatic state locking for operations that can write state.
- **Used by:** task-14-remote-state, task-15-locking

## src-tf-lockfile — Dependency Lock File (.terraform.lock.hcl)

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/files/dependency-lock
- **Purpose:** Explain why .terraform.lock.hcl should be committed to version control.
- **Used by:** task-04-local-terraform, task-05-github-repo, task-13-vcs-triggered-run

## src-tf-init — terraform init command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/init
- **Purpose:** Initialize the local Terraform working directory and install provider dependencies.
- **Used by:** task-04-local-terraform

## src-aws-root — AWS account root user

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html
- **Purpose:** Use root only for bootstrap and final removal of the temporary IAM training identity; never create root access keys.
- **Used by:** task-02-aws-bootstrap, task-18-aws-local-cleanup

## src-aws-root-best-practices — Best practices for protecting your AWS account root user

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html
- **Purpose:** Keep root credentials out of normal daily lab work.
- **Used by:** task-02-aws-bootstrap, task-18-aws-local-cleanup

## src-aws-users — Create an IAM user

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html
- **Purpose:** Create the dedicated temporary IAM training user.
- **Used by:** task-02-aws-bootstrap, task-18-aws-local-cleanup

## src-aws-policy — Create IAM policies

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html
- **Purpose:** Create the restricted bootstrap policy and the run-role permissions policy.
- **Used by:** task-02-aws-bootstrap, task-09-run-role

## src-aws-access-keys — Manage access keys for IAM users

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html
- **Purpose:** Create and later remove the IAM user's temporary local CLI access key.
- **Used by:** task-03-cli-profile, task-18-aws-local-cleanup

## src-aws-cli-install — Install or update to the latest version of the AWS CLI

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- **Purpose:** Install the AWS CLI if required.
- **Used by:** task-01-prerequisites

## src-aws-cli-config — aws configure

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/configure/
- **Purpose:** Create a dedicated named AWS CLI profile.
- **Used by:** task-03-cli-profile

## src-aws-sts-identity — get-caller-identity

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html
- **Purpose:** Verify the AWS identity and capture the AWS account ID.
- **Used by:** task-03-cli-profile

## src-aws-hcp-oidc — Create a role for OpenID Connect federation

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html
- **Purpose:** Create the HCP Terraform OIDC trust and restrict it to the lab organization, project and workspace.
- **Used by:** task-08-oidc-provider, task-09-run-role, task-18-aws-local-cleanup

## src-aws-oidc-cli — create-open-id-connect-provider

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/iam/create-open-id-connect-provider.html
- **Purpose:** CLI route for creating the app.terraform.io OIDC identity provider.
- **Used by:** task-08-oidc-provider

## src-aws-ssm — AWS Systems Manager Parameter Store

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- **Purpose:** Verify the single AWS resource managed by Terraform.
- **Used by:** task-11-failed-run, task-12-fix-apply, task-13-vcs-triggered-run

## src-aws-ssm-create — Creating a Parameter Store parameter using the console

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-create-console.html
- **Purpose:** Understand Parameter Store region behavior and verify the Terraform-created parameter.
- **Used by:** task-12-fix-apply

## src-aws-ssm-delete — Deleting parameters from Parameter Store

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/systems-manager/latest/userguide/deleting-parameters.html
- **Purpose:** Verify that the destroy run removed the training parameter.
- **Used by:** task-16-destroy

# Offline conversion boundary

This preview and its JSON manuscript are intentionally offline authoring artifacts. They have not been locally validated by Study Tracker, imported, accepted, approved, published, or fingerprinted. Local Codex should convert and validate them using the repository's controlled workflow.
