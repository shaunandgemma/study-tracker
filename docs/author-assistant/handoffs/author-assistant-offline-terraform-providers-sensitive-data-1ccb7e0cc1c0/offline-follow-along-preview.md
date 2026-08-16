# Providers and Sensitive Data Follow Along

> **Status:** Offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Beginner
- **Exam workspace:** HashiCorp Terraform Associate 004
- **AWS Region:** eu-west-2
- **HCP Terraform:** global/control-plane resources
- **Training prefix:** `fa-providers-terraform`

## Required outcome

Cover multiple providers, provider versioning, aliases, authentication methods and Terraform Associate 004 objective 4h, including sensitive values, state exposure, ephemeral/write-only patterns and Vault, using HCP Terraform global resources and AWS eu-west-2.

## Exam objectives covered

- **2a:** Install and version Terraform providers
- **2b:** Describe how Terraform uses providers
- **2c:** Write Terraform configuration using multiple providers
- **4h:** Understand best practices for managing sensitive data, including secrets management with Vault
- **3b-3f:** Initialize, validate, plan, apply and destroy during the provider exercises
- **5c:** Pass an aliased provider configuration into a child module
- **7b:** Inspect state to understand sensitive versus ephemeral persistence
- **8a/8d:** Use HCP Terraform remote execution and integration with dynamic provider credentials

## Completion definition

- A temporary AWS bootstrap IAM user and named CLI profile are created without root access keys.
- Local AWS provider authentication through a shared profile is proven with a data-only configuration.
- A dedicated HCP Terraform organization, project and CLI-driven remote workspace are created.
- HCP Terraform authenticates the AWS provider with OIDC dynamic credentials rather than static AWS access keys.
- The workspace has a default AWS credential configuration and a tagged LONDON credential configuration for an aliased provider.
- The main configuration installs and versions AWS and Random providers and records selections in .terraform.lock.hcl.
- The learner uses a default AWS provider, aws.london alias and explicit alias passing into a child module.
- A stateful random_password and a fake sensitive Terraform variable demonstrate that redaction does not remove secrets from state.
- An ephemeral random_password demonstrates a value that is not persisted in state.
- A write-only resource argument pattern is reviewed without creating cost-bearing RDS infrastructure.
- A local Vault development server and Terraform Vault provider read a fake secret, demonstrating both Vault usage and Terraform state implications.
- All Terraform-managed AWS resources are destroyed before the HCP workspace/state, authentication resources, temporary credentials and local files are removed.

## Warnings

### Cost warning

The AWS portion intentionally uses only IAM objects and a few small Systems Manager Parameter Store parameters, but AWS/HCP pricing and limits can change. Review your account information and complete cleanup.

### Deletion safety

Destroy only resources created by this Follow Along. Stop if Terraform proposes deleting anything outside the fa-providers-terraform prefix.

### Credential and secret warning

Never create root access keys; never put AWS access keys, the HCP token or Vault token in Terraform configuration. HCP remote AWS runs use OIDC dynamic credentials. All demonstrated secret values are deliberately fake.

### Region warning

HCP Terraform organization/project/workspace resources are control-plane/global for this lab. Every AWS service resource is created in eu-west-2. The aws.london alias intentionally targets eu-west-2 as a second configuration, not a second Region.

# Phase 1: Preparation and safe bootstrap

Verify local tools, create a temporary training IAM identity and establish a named AWS CLI profile.

## task-01-prerequisites — Verify accounts and local tools

- **Feature:** Prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm Terraform, AWS CLI, HCP Terraform access and a safe training AWS account before creating anything.
- **Why it matters:** Provider and authentication problems are much easier to diagnose when the CLI tools and account access are known to work first.
- **Exam relevance:** This Follow Along concentrates on 2a, 2b, 2c and 4h, while still using the normal init/plan/apply/destroy workflow.
- **Prerequisites:** None
- **Sources:** src-exam-004, src-tf-install, src-aws-cli-install

### Console / browser route

1. Sign in to the AWS account that will be used only for training. Do not create resources yet.
2. Open https://app.terraform.io and confirm that you can sign in to HCP Terraform.
3. Open Windows PowerShell. Run the version checks below.
4. If Terraform is missing, install it from the official HashiCorp install page, then reopen PowerShell.
5. If AWS CLI is missing, install AWS CLI v2 from the official AWS guide, then reopen PowerShell.
6. Do not create or use root access keys. Root is used only for the one-time training IAM bootstrap in the next task.

### CLI / Terraform route

#### Tool checks

```
terraform version
aws --version
```

### Expected results

- Terraform prints a version.
- AWS CLI prints a version.
- AWS and HCP Terraform browser sign-in both work.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — Both commands run without command-not-found errors.
- [ ] **task-01-prerequisites-verify-02** — No lab resource has been created yet.

## task-02-aws-bootstrap — Create the temporary IAM training identity

- **Feature:** AWS IAM bootstrap
- **Difficulty:** Medium
- **Goal:** Use root only to create a dedicated IAM user, console sign-in, access key and tightly-scoped training policy, then sign out of root.
- **Why it matters:** HCP Terraform will later use temporary role credentials, but the learner still needs a separate bootstrap identity to create the OIDC trust and verify resources.
- **Exam relevance:** Authentication is proving identity; authorization is deciding which API actions that identity can perform. The exam expects you to separate those concepts.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-aws-iam-intro, src-aws-iam-best, src-aws-oidc-role

### Warnings

- Never create root access keys.
- The bootstrap access key is temporary and must be removed during cleanup.

### Console / browser route

1. Sign in to AWS as the root user only for this bootstrap task.
2. Open IAM > Users > Create user.
3. Set the user name to fa-providers-terraform-admin. Enable AWS Management Console access so the rest of the browser route can be completed without root.
4. Create a customer managed policy named fa-providers-terraform-admin-policy using the JSON policy block supplied below, then attach it to fa-providers-terraform-admin.
5. Create one access key for fa-providers-terraform-admin for CLI training use. Copy the Access key ID and Secret access key immediately to a temporary secure place; AWS will not show the secret again.
6. Sign out of the root user.
7. Sign in as the new IAM user fa-providers-terraform-admin. Do not use root again until final deletion of this temporary training identity.
8. The access key is long-lived authentication. This lab uses it only for bootstrap/verification and deliberately does not store it in Terraform or HCP Terraform.

### CLI / Terraform route

#### No root CLI commands

```
# No root CLI command is required or permitted for this Follow Along.
# Complete this one-time bootstrap in the AWS IAM console.
```

### Supplied configuration

#### Training bootstrap IAM policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadIamForTrainingConsole",
      "Effect": "Allow",
      "Action": [
        "iam:Get*",
        "iam:List*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageHcpOidcProvider",
      "Effect": "Allow",
      "Action": [
        "iam:CreateOpenIDConnectProvider",
        "iam:DeleteOpenIDConnectProvider",
        "iam:UpdateOpenIDConnectProviderThumbprint",
        "iam:AddClientIDToOpenIDConnectProvider",
        "iam:RemoveClientIDFromOpenIDConnectProvider",
        "iam:TagOpenIDConnectProvider",
        "iam:UntagOpenIDConnectProvider"
      ],
      "Resource": "arn:aws:iam::*:oidc-provider/app.terraform.io"
    },
    {
      "Sid": "ManageOnlyNamedRunRoles",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:UpdateAssumeRolePolicy",
        "iam:TagRole",
        "iam:UntagRole",
        "iam:PutRolePolicy",
        "iam:GetRolePolicy",
        "iam:DeleteRolePolicy"
      ],
      "Resource": "arn:aws:iam::*:role/fa-providers-terraform-*"
    },
    {
      "Sid": "VerifyOnlyTrainingParameters",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:DescribeParameters"
      ],
      "Resource": "*"
    }
  ]
}
```

### Expected results

- The IAM user exists and can sign in to the AWS console.
- Exactly one access key exists for the training user.
- The custom policy is attached.
- Root is signed out.

### Verification checks

- [ ] **task-02-aws-bootstrap-verify-01** — IAM shows user fa-providers-terraform-admin.
- [ ] **task-02-aws-bootstrap-verify-02** — Attached policies include fa-providers-terraform-admin-policy.
- [ ] **task-02-aws-bootstrap-verify-03** — The browser session is the IAM user, not root.

## task-03-cli-profile — Configure and verify the named AWS CLI profile

- **Feature:** AWS CLI authentication
- **Difficulty:** Easy
- **Goal:** Store the temporary IAM user's access key only in the named AWS CLI profile fa-providers-terraform-admin, verify the identity and derive deterministic HCP names.
- **Why it matters:** The named profile demonstrates shared-credentials-file authentication without hard-coding credentials in Terraform configuration.
- **Exam relevance:** AWS shared profiles are one provider authentication method; provider credentials should not be embedded directly in provider blocks.
- **Prerequisites:** task-02-aws-bootstrap
- **Sources:** src-aws-cli-config, src-aws-sts, src-configure-providers

### Warnings

- Never paste the secret access key into Terraform .tf files or HCP workspace variables in this lab.

### Console / browser route

1. Open Windows PowerShell as your normal Windows user.
2. Run aws configure --profile fa-providers-terraform-admin. Paste the training user's Access key ID and Secret access key when prompted.
3. For Default region name enter eu-west-2. For output format enter json.
4. Run get-caller-identity and check that the ARN contains the training IAM user name.
5. Run the PowerShell variable commands below. They derive the HCP organization from your AWS account ID so you do not need to invent a placeholder name.
6. Record the printed values. They are used exactly in later browser steps and IAM trust.

### CLI / Terraform route

#### Create profile and derive lab names

```
aws configure --profile fa-providers-terraform-admin

$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-providers-terraform-admin --query Account --output text
$HCP_ORG = "fa-providers-terraform-$AWS_ACCOUNT_ID"
$HCP_PROJECT = "fa-providers-terraform-project"
$HCP_WORKSPACE = "fa-providers-terraform-providers-sensitive"

aws sts get-caller-identity --profile fa-providers-terraform-admin
"ACCOUNT_ID=$AWS_ACCOUNT_ID"
"HCP_ORG=$HCP_ORG"
"HCP_PROJECT=$HCP_PROJECT"
"HCP_WORKSPACE=$HCP_WORKSPACE"
```

### Expected results

- get-caller-identity returns the correct AWS account.
- The ARN identifies the training IAM user.
- HCP_ORG is fa-providers-terraform followed by the 12-digit AWS account ID.

### Verification checks

- [ ] **task-03-cli-profile-verify-01** — AWS account ID is 12 digits.
- [ ] **task-03-cli-profile-verify-02** — The profile name is exactly fa-providers-terraform-admin.
- [ ] **task-03-cli-profile-verify-03** — HCP project/workspace names exactly match the printed values.

# Phase 2: Provider authentication patterns

See local shared-profile authentication, then replace static provider credentials with HCP Terraform OIDC dynamic credentials.

## task-04-local-auth-demo — Prove local shared-profile provider authentication

- **Feature:** Provider authentication
- **Difficulty:** Medium
- **Goal:** Use a small data-only local Terraform configuration to authenticate the AWS provider through the named CLI profile without creating AWS infrastructure.
- **Why it matters:** Seeing one successful local authentication path makes it easier to understand why HCP remote runners need a different authentication path later.
- **Exam relevance:** Objective 2b: providers authenticate to remote APIs; the authentication method is provider-specific. Static credentials in provider configuration are a bad practice.
- **Prerequisites:** task-03-cli-profile
- **Sources:** src-provider-requirements, src-configure-providers, src-init, src-aws-sts

### Console / browser route

1. Create a new folder C:\terraform-labs\fa-providers-terraform\auth-demo. If C:\terraform-labs does not exist, create it.
2. Inside auth-demo create a file named main.tf and paste the supplied Local AWS authentication demo configuration.
3. Notice that the provider block contains a profile name but no access key or secret key.
4. Run terraform init, terraform validate and terraform apply. This configuration uses only the aws_caller_identity data source, so it creates no AWS resource.
5. Compare the Terraform output account ID with aws sts get-caller-identity.

### CLI / Terraform route

#### Local shared-profile authentication

```
New-Item -ItemType Directory -Force C:\terraform-labs\fa-providers-terraform\auth-demo | Out-Null
Set-Location C:\terraform-labs\fa-providers-terraform\auth-demo

terraform fmt
terraform init
terraform validate
terraform apply -auto-approve

aws sts get-caller-identity --profile fa-providers-terraform-admin --query Account --output text
terraform output authenticated_account_id
```

### Supplied configuration

#### auth-demo/main.tf

```
terraform {
  required_version = ">= 1.11.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.55"
    }
  }
}

provider "aws" {
  region  = "eu-west-2"
  profile = "fa-providers-terraform-admin"
}

data "aws_caller_identity" "current" {}

output "authenticated_account_id" {
  value = data.aws_caller_identity.current.account_id
}
```

### Expected results

- Terraform initializes the AWS provider.
- terraform validate succeeds.
- terraform apply reads the caller identity and reports no managed infrastructure creation.
- The Terraform account ID matches the AWS CLI account ID.

### Verification checks

- [ ] **task-04-local-auth-demo-verify-01** — No access_key or secret_key argument exists in main.tf.
- [ ] **task-04-local-auth-demo-verify-02** — The two account IDs match.
- [ ] **task-04-local-auth-demo-verify-03** — AWS Resource Groups/SSM show no resource from this task.

# Phase 3: HCP Terraform organization, project and workspace

Create isolated HCP Terraform control-plane resources and configure two AWS dynamic credential configurations.

## task-05-hcp-org-project-workspace — Create the HCP Terraform organization, project and workspace

- **Feature:** HCP Terraform setup
- **Difficulty:** Medium
- **Goal:** Create dedicated HCP Terraform control-plane resources for the provider and sensitive-data exercises.
- **Why it matters:** A separate organization/project/workspace keeps the lab state and variables isolated and makes cleanup unambiguous.
- **Exam relevance:** HCP Terraform is not a provider; it supplies remote execution/state/collaboration while providers communicate with target APIs.
- **Prerequisites:** task-04-local-auth-demo
- **Sources:** src-hcp-org, src-hcp-projects, src-hcp-workspaces, src-cloud-block, src-terraform-login

### Warnings

- Treat the terraform login token as sensitive. Do not commit Terraform CLI credentials files.

### Console / browser route

1. In PowerShell rerun the three name derivation lines from Task 3 if the variables are no longer in your shell.
2. Open HCP Terraform in the browser.
3. Create an organization using the exact HCP_ORG value printed in Task 3. If HCP reports that the name is already taken, stop: do not reuse an unrelated organization for this lab.
4. Inside that organization create a project named fa-providers-terraform-project.
5. Inside the project create a CLI-driven workspace named fa-providers-terraform-providers-sensitive. Do not connect a VCS repository.
6. Open workspace Settings > General. Keep execution mode Remote. Select a stable Terraform version 1.11.0 or later; a current 1.15.x stable version is suitable.
7. Return to PowerShell and run terraform login. Follow the browser flow and paste the generated HCP Terraform token when prompted.
8. Do not print or copy the HCP CLI token into this manuscript or a .tf file.

### CLI / Terraform route

#### Rebuild names and authenticate Terraform CLI

```
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-providers-terraform-admin --query Account --output text
$HCP_ORG = "fa-providers-terraform-$AWS_ACCOUNT_ID"
$HCP_PROJECT = "fa-providers-terraform-project"
$HCP_WORKSPACE = "fa-providers-terraform-providers-sensitive"

terraform login
```

### Expected results

- The organization exists with the exact derived name.
- The project contains the workspace.
- The workspace uses Remote execution.
- terraform login reports successful token retrieval/storage.

### Verification checks

- [ ] **task-05-hcp-org-project-workspace-verify-01** — HCP organization name ends with the current AWS account ID.
- [ ] **task-05-hcp-org-project-workspace-verify-02** — Project is fa-providers-terraform-project.
- [ ] **task-05-hcp-org-project-workspace-verify-03** — Workspace is fa-providers-terraform-providers-sensitive.
- [ ] **task-05-hcp-org-project-workspace-verify-04** — Workspace Terraform version is at least 1.11.0.

## task-06-oidc-provider — Create the HCP Terraform OIDC identity provider in AWS

- **Feature:** OIDC federation
- **Difficulty:** Medium
- **Goal:** Create the AWS OIDC identity provider that allows AWS to validate HCP Terraform workload identity tokens.
- **Why it matters:** OIDC lets HCP Terraform exchange signed workload identity for short-lived AWS role credentials instead of storing AWS access keys in HCP.
- **Exam relevance:** Dynamic credentials are a best-practice provider authentication pattern because HCP receives temporary credentials only for the run.
- **Prerequisites:** task-05-hcp-org-project-workspace
- **Sources:** src-hcp-dynamic-aws, src-aws-oidc-role, src-aws-oidc-cli, src-aws-iam-best

### Warnings

- If an app.terraform.io OIDC provider already exists from unrelated infrastructure, stop rather than deleting/replacing it.

### Console / browser route

1. In the AWS console, confirm you are signed in as the training IAM user, not root.
2. Open IAM > Identity providers > Add provider.
3. Choose OpenID Connect.
4. Provider URL: https://app.terraform.io
5. Audience: aws.workload.identity
6. Add the provider.
7. Open the new provider and verify the provider URL and audience exactly. Record its ARN.
8. Use either the Console route above OR the CLI create command below. Do not create the same OIDC provider twice.

### CLI / Terraform route

#### OIDC CLI alternative

```
# Run the create command only if you did NOT create the provider in the console.
aws iam create-open-id-connect-provider `
  --url https://app.terraform.io `
  --client-id-list aws.workload.identity `
  --profile fa-providers-terraform-admin

$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-providers-terraform-admin --query Account --output text
$OIDC_ARN = "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/app.terraform.io"

aws iam get-open-id-connect-provider `
  --open-id-connect-provider-arn $OIDC_ARN `
  --profile fa-providers-terraform-admin
```

### Expected results

- IAM contains one app.terraform.io OIDC identity provider for the lab.
- The client ID/audience is aws.workload.identity.

### Verification checks

- [ ] **task-06-oidc-provider-verify-01** — The OIDC provider ARN contains the current AWS account ID and app.terraform.io.
- [ ] **task-06-oidc-provider-verify-02** — The audience exactly equals aws.workload.identity.

## task-07-run-role — Create the restricted HCP Terraform AWS run role

- **Feature:** Dynamic provider credentials
- **Difficulty:** Hard
- **Goal:** Create one role trusted only by this HCP organization/project/workspace and allow it to manage only /fa-providers-terraform/* SSM parameters.
- **Why it matters:** The trust policy limits who may assume the role, while the permissions policy limits what the assumed role may do.
- **Exam relevance:** Authentication (OIDC trust) and authorization (SSM permission policy) are separate. This distinction is central to understanding provider authentication securely.
- **Prerequisites:** task-06-oidc-provider
- **Sources:** src-hcp-dynamic-aws, src-aws-oidc-role, src-aws-iam-best, src-aws-ssm

### Console / browser route

1. In IAM open Roles > Create role.
2. Choose Web identity and select the app.terraform.io identity provider with audience aws.workload.identity.
3. Create a role named fa-providers-terraform-run-role.
4. Replace its trust policy with the exact trust structure shown below, substituting the AWS account ID and HCP organization value you derived in Task 3. The subject must remain restricted to this project, workspace and run_phase:*.
5. Create an inline permissions policy named fa-providers-terraform-run-policy using the supplied JSON. It can manage only SSM parameters under /fa-providers-terraform/* in eu-west-2 plus DescribeParameters.
6. Do not attach AdministratorAccess.
7. Record the role ARN.

### CLI / Terraform route

#### Create the HCP run role and inline policy

```
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-providers-terraform-admin --query Account --output text
$HCP_ORG = "fa-providers-terraform-$AWS_ACCOUNT_ID"

$TrustPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/app.terraform.io"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "app.terraform.io:aud": "aws.workload.identity"
        },
        "StringLike": {
          "app.terraform.io:sub": "organization:${HCP_ORG}:project:fa-providers-terraform-project:workspace:fa-providers-terraform-providers-sensitive:run_phase:*"
        }
      }
    }
  ]
}
"@
$TrustPolicy | Set-Content -Encoding utf8 .\hcp-trust-policy.json

aws iam create-role `
  --role-name fa-providers-terraform-run-role `
  --assume-role-policy-document file://hcp-trust-policy.json `
  --profile fa-providers-terraform-admin

$RunPolicy = @'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ManageOnlyTrainingParameters",
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
      "Resource": "arn:aws:ssm:eu-west-2:*:parameter/fa-providers-terraform/*"
    },
    {
      "Sid": "DescribeParametersForRefresh",
      "Effect": "Allow",
      "Action": "ssm:DescribeParameters",
      "Resource": "*"
    }
  ]
}
'@
$RunPolicy | Set-Content -Encoding utf8 .\hcp-run-policy.json

aws iam put-role-policy `
  --role-name fa-providers-terraform-run-role `
  --policy-name fa-providers-terraform-run-policy `
  --policy-document file://hcp-run-policy.json `
  --profile fa-providers-terraform-admin

aws iam get-role --role-name fa-providers-terraform-run-role --profile fa-providers-terraform-admin
aws iam get-role-policy --role-name fa-providers-terraform-run-role --policy-name fa-providers-terraform-run-policy --profile fa-providers-terraform-admin

Remove-Item .\hcp-trust-policy.json, .\hcp-run-policy.json -Force
```

### Supplied configuration

#### Run-role trust policy shape

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::AWS_ACCOUNT_ID:oidc-provider/app.terraform.io"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "app.terraform.io:aud": "aws.workload.identity"
        },
        "StringLike": {
          "app.terraform.io:sub": "organization:HCP_ORG:project:fa-providers-terraform-project:workspace:fa-providers-terraform-providers-sensitive:run_phase:*"
        }
      }
    }
  ]
}
```

#### Run-role inline permissions policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ManageOnlyTrainingParameters",
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
      "Resource": "arn:aws:ssm:eu-west-2:*:parameter/fa-providers-terraform/*"
    },
    {
      "Sid": "DescribeParametersForRefresh",
      "Effect": "Allow",
      "Action": "ssm:DescribeParameters",
      "Resource": "*"
    }
  ]
}
```

### Expected results

- The role exists.
- The trust policy checks app.terraform.io:aud and a workspace-specific app.terraform.io:sub.
- The inline policy manages only the training SSM parameter path.

### Verification checks

- [ ] **task-07-run-role-verify-01** — Role name is exactly fa-providers-terraform-run-role.
- [ ] **task-07-run-role-verify-02** — Trust subject contains the exact organization/project/workspace.
- [ ] **task-07-run-role-verify-03** — No AdministratorAccess policy is attached.

## task-08-hcp-variables — Configure default and aliased AWS dynamic credentials plus a sensitive variable

- **Feature:** HCP Terraform variables
- **Difficulty:** Hard
- **Goal:** Configure HCP Terraform to generate two AWS dynamic credential configurations and store one fake sensitive Terraform input.
- **Why it matters:** This demonstrates alias-specific authentication without duplicating long-lived access keys and shows that HCP variable sensitivity is a display/access control, not a guarantee that Terraform state cannot contain the value.
- **Exam relevance:** Multiple dynamic credential configurations use tagged environment variables. Sensitive workspace variables hide values after entry, but downstream Terraform usage can still persist values in state.
- **Prerequisites:** task-07-run-role
- **Sources:** src-hcp-dynamic-aws, src-hcp-multi-creds, src-hcp-variables, src-sensitive-data

### Warnings

- Use only the literal fake value training-secret-not-real. Never substitute a real password, API token or production secret.

### Console / browser route

1. Open HCP Terraform > fa-providers-terraform-providers-sensitive > Variables.
2. Add Environment variable TFC_AWS_PROVIDER_AUTH with value true. Leave Sensitive off.
3. Add Environment variable TFC_AWS_PROVIDER_AUTH_LONDON with value true. Leave Sensitive off. LONDON is the tag for the aliased provider credential configuration.
4. Add Environment variable TFC_DEFAULT_AWS_RUN_ROLE_ARN with the ARN of fa-providers-terraform-run-role. Leave Sensitive off; an IAM role ARN is not a secret.
5. Add Environment variable TF_VAR_training_secret with value training-secret-not-real and turn Sensitive ON before saving.
6. Add Terraform variable aws_region with value eu-west-2, or rely on the default in variables.tf. Do not create AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY variables in HCP Terraform.
7. After saving TF_VAR_training_secret, confirm HCP no longer displays its value.
8. Understand the design: the default and LONDON configurations each request their own workload identity token, while the default role ARN supplies the same lab role to both.

### CLI / Terraform route

#### No secret CLI export

```
# Configure these values in the HCP Terraform workspace Variables page.
# Do not export the fake training secret into your general shell profile.
```

### Expected results

- HCP Variables contains TFC_AWS_PROVIDER_AUTH=true.
- HCP Variables contains TFC_AWS_PROVIDER_AUTH_LONDON=true.
- TFC_DEFAULT_AWS_RUN_ROLE_ARN points to the lab run role.
- TF_VAR_training_secret is marked Sensitive.
- No static AWS access key is stored in HCP.

### Verification checks

- [ ] **task-08-hcp-variables-verify-01** — Both provider-auth toggles exist.
- [ ] **task-08-hcp-variables-verify-02** — The role ARN is correct.
- [ ] **task-08-hcp-variables-verify-03** — The fake training secret is masked in the HCP UI.
- [ ] **task-08-hcp-variables-verify-04** — There is no AWS_SECRET_ACCESS_KEY variable in the workspace.

# Phase 4: Multiple providers, aliases and modules

Install and version AWS and Random providers, inspect the lock file, use an AWS alias, and pass that alias into a child module.

## task-09-build-config — Build the multi-provider Terraform configuration

- **Feature:** Provider requirements and aliases
- **Difficulty:** Hard
- **Goal:** Create the complete HCP Terraform configuration with AWS, an AWS alias, Random, a child module and sensitive/ephemeral demonstrations.
- **Why it matters:** This is the main practical exercise for objectives 2a, 2b, 2c and 4h.
- **Exam relevance:** 2a: install/version providers. 2b: provider blocks configure API clients. 2c: multiple providers and aliases. 4h: sensitive/ephemeral handling.
- **Prerequisites:** task-08-hcp-variables
- **Sources:** src-provider-requirements, src-provider-block, src-provider-modules, src-provider-meta, src-hcp-multi-creds, src-sensitive-data, src-ephemeral

### Console / browser route

1. Create C:\terraform-labs\fa-providers-terraform\hcp-main and a child folder modules\alias-demo.
2. Create versions.tf, variables.tf, providers.tf, main.tf, outputs.tf, .gitignore, modules\alias-demo\versions.tf and modules\alias-demo\main.tf.
3. Paste the supplied blocks into the matching files exactly.
4. Notice required_providers declares two provider TYPES: hashicorp/aws and hashicorp/random.
5. Notice there are two CONFIGURATIONS of the AWS provider: the default and aws.london. Both target eu-west-2 so this lab remains in the requested Region; the alias demonstrates configuration selection rather than cross-Region deployment.
6. Notice HCP Terraform supplies the tfc_aws_dynamic_credentials object at run time. The default provider uses .default.shared_config_file and aws.london uses aliases["LONDON"].shared_config_file.
7. Notice the child module declares configuration_aliases = [aws.london], and the root module passes aws.london explicitly.
8. Notice random_password.persisted_demo is a normal managed logical resource, while ephemeral.random_password.ephemeral_demo is intentionally not persisted in state.
9. Notice .gitignore excludes local state and tfvars but DOES NOT exclude .terraform.lock.hcl; the lock file should normally be committed to version control.

### CLI / Terraform route

#### Create directories

```
New-Item -ItemType Directory -Force C:\terraform-labs\fa-providers-terraform\hcp-main\modules\alias-demo | Out-Null
Set-Location C:\terraform-labs\fa-providers-terraform\hcp-main
```

### Supplied configuration

#### hcp-main/versions.tf

```
terraform {
  required_version = ">= 1.11.0, < 2.0.0"

  cloud {}

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.55"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.9"
    }
  }
}
```

#### hcp-main/variables.tf

```
variable "aws_region" {
  description = "AWS Region used by this Follow Along."
  type        = string
  default     = "eu-west-2"
}

variable "training_secret" {
  description = "Fake training-only value used to demonstrate sensitive handling. Never replace this with a real password or credential."
  type        = string
  sensitive   = true
}

variable "tfc_aws_dynamic_credentials" {
  description = "Object populated automatically by HCP Terraform for the default and tagged AWS dynamic credential configurations."
  type = object({
    default = object({
      shared_config_file = string
    })
    aliases = map(object({
      shared_config_file = string
    }))
  })
}
```

#### hcp-main/providers.tf

```
provider "aws" {
  region = var.aws_region

  shared_config_files = [
    var.tfc_aws_dynamic_credentials.default.shared_config_file
  ]

  default_tags {
    tags = {
      FollowAlong = "fa-providers-terraform"
      ManagedBy   = "Terraform"
    }
  }
}

provider "aws" {
  alias  = "london"
  region = var.aws_region

  shared_config_files = [
    var.tfc_aws_dynamic_credentials.aliases["LONDON"].shared_config_file
  ]

  default_tags {
    tags = {
      FollowAlong       = "fa-providers-terraform"
      ManagedBy         = "Terraform"
      ProviderSelection = "aws.london"
    }
  }
}

provider "random" {}
```

#### hcp-main/main.tf

```
data "aws_caller_identity" "default" {}

data "aws_caller_identity" "london" {
  provider = aws.london
}

resource "random_password" "persisted_demo" {
  length  = 20
  special = false
}

ephemeral "random_password" "ephemeral_demo" {
  length  = 20
  special = false
}

resource "aws_ssm_parameter" "default_provider" {
  name  = "/fa-providers-terraform/default-provider"
  type  = "String"
  value = "created-by-default-aws-provider"
}

resource "aws_ssm_parameter" "aliased_provider" {
  provider = aws.london

  name  = "/fa-providers-terraform/aliased-provider"
  type  = "String"
  value = "created-by-aws-london-alias"
}

resource "aws_ssm_parameter" "sensitive_demo" {
  provider = aws.london

  name  = "/fa-providers-terraform/sensitive-demo"
  type  = "SecureString"
  value = var.training_secret
}

module "alias_demo" {
  source = "./modules/alias-demo"

  providers = {
    aws.london = aws.london
  }
}
```

#### hcp-main/outputs.tf

```
output "default_provider_account_id" {
  description = "AWS account reached through the default provider configuration."
  value       = data.aws_caller_identity.default.account_id
}

output "aliased_provider_account_id" {
  description = "AWS account reached through the aws.london provider alias."
  value       = data.aws_caller_identity.london.account_id
}

output "persisted_password_demo" {
  description = "Training-only random value. It is redacted in normal output but persisted in Terraform state."
  value       = random_password.persisted_demo.result
  sensitive   = true
}

output "training_secret_echo" {
  description = "Fake training-only sensitive input, redacted in normal output but persisted because it is used by a managed resource/output."
  value       = var.training_secret
  sensitive   = true
}
```

#### hcp-main/modules/alias-demo/versions.tf

```
terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      configuration_aliases = [
        aws.london
      ]
    }
  }
}
```

#### hcp-main/modules/alias-demo/main.tf

```
resource "aws_ssm_parameter" "module_alias" {
  provider = aws.london

  name  = "/fa-providers-terraform/module-alias"
  type  = "String"
  value = "child-module-used-aws-london"
}
```

#### hcp-main/.gitignore

```
.terraform/
*.tfstate
*.tfstate.*
crash.log
crash.*.log
*.tfvars
*.tfvars.json
override.tf
override.tf.json
*_override.tf
*_override.tf.json
.terraformrc
terraform.rc
```

### Expected results

- All eight files exist.
- No AWS access key, secret key, Vault token or HCP token appears in any .tf file.
- The configuration has AWS and Random required providers plus the aws.london alias.

### Verification checks

- [ ] **task-09-build-config-verify-01** — versions.tf contains cloud {} and both provider requirements.
- [ ] **task-09-build-config-verify-02** — providers.tf contains default aws, aws.london and random provider blocks.
- [ ] **task-09-build-config-verify-03** — Child module declares configuration_aliases.
- [ ] **task-09-build-config-verify-04** — training_secret is marked sensitive.
- [ ] **task-09-build-config-verify-05** — The ephemeral random_password block exists.

## task-10-init-lock-inspect — Initialize providers and inspect the dependency lock file

- **Feature:** Provider installation and versioning
- **Difficulty:** Medium
- **Goal:** Connect the directory to the existing HCP workspace, install provider plugins and inspect the exact selected versions recorded in .terraform.lock.hcl.
- **Why it matters:** The exam distinguishes the version constraints you write from the concrete provider selections Terraform records in the dependency lock file.
- **Exam relevance:** Objective 2a explicitly covers installing/versioning providers and the dependency lock file.
- **Prerequisites:** task-09-build-config
- **Sources:** src-init, src-lock-file, src-providers-command, src-cloud-block, src-provider-requirements

### Console / browser route

1. Open PowerShell in hcp-main.
2. Rebuild HCP_ORG from the AWS account ID if needed.
3. Set TF_CLOUD_ORGANIZATION and TF_WORKSPACE only for this PowerShell session. The empty cloud {} block reads these values.
4. Run terraform fmt -recursive, terraform init and terraform validate.
5. Run terraform providers and inspect how the root and child module require providers.
6. Open .terraform.lock.hcl. Find hashicorp/aws and hashicorp/random and note the concrete versions Terraform selected.
7. Run terraform init -upgrade once. With the current constraints, Terraform checks for the newest acceptable provider versions and updates the lock selection only if needed.
8. Do not manually edit .terraform.lock.hcl.

### CLI / Terraform route

#### Initialize and inspect providers

```
Set-Location C:\terraform-labs\fa-providers-terraform\hcp-main

$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-providers-terraform-admin --query Account --output text
$env:TF_CLOUD_ORGANIZATION = "fa-providers-terraform-$AWS_ACCOUNT_ID"
$env:TF_WORKSPACE = "fa-providers-terraform-providers-sensitive"

terraform fmt -recursive
terraform init
terraform validate
terraform providers
Get-Content .terraform.lock.hcl
terraform init -upgrade
terraform validate
```

### Expected results

- terraform init says HCP Terraform initialized successfully.
- AWS and Random provider plugins install or reuse locked versions.
- terraform validate succeeds.
- terraform providers shows root requirements and the child module AWS requirement.
- .terraform.lock.hcl exists.

### Verification checks

- [ ] **task-10-init-lock-inspect-verify-01** — .terraform.lock.hcl contains registry.terraform.io/hashicorp/aws.
- [ ] **task-10-init-lock-inspect-verify-02** — .terraform.lock.hcl contains registry.terraform.io/hashicorp/random.
- [ ] **task-10-init-lock-inspect-verify-03** — The child module is visible in terraform providers output.
- [ ] **task-10-init-lock-inspect-verify-04** — Validation reports Success.

## task-11-plan-apply — Run the remote plan and apply with multiple provider configurations

- **Feature:** Remote provider execution
- **Difficulty:** Hard
- **Goal:** Use HCP Terraform remote execution to authenticate both AWS configurations dynamically and create only the small training resources.
- **Why it matters:** A successful apply proves that provider installation, default/aliased authentication, module provider passing and sensitive input handling all work together.
- **Exam relevance:** Provider aliases select specific configurations; dynamic credentials authenticate each configuration; sensitive outputs redact normal display.
- **Prerequisites:** task-10-init-lock-inspect
- **Sources:** src-hcp-dynamic-aws, src-hcp-multi-creds, src-provider-block, src-provider-modules, src-sensitive-vars, src-aws-ssm

### Warnings

- The fake training_secret is intentionally allowed into state for the next objective-4h demonstration. Never perform that step with a real secret.

### Console / browser route

1. In PowerShell run terraform plan. The local CLI uploads the configuration and HCP Terraform performs the remote operation.
2. Open the run link shown by Terraform or open the workspace Runs page in your browser.
3. Review the plan before applying. Expected managed additions are four SSM parameters plus one normal random_password logical resource. The ephemeral random_password is not a persisted managed resource.
4. Confirm every AWS SSM name begins /fa-providers-terraform/.
5. Run terraform apply and type yes only after the plan is correct.
6. Watch the HCP run until it finishes Applied.
7. Do not copy sensitive output values from HCP or state.

### CLI / Terraform route

#### Remote plan and apply

```
Set-Location C:\terraform-labs\fa-providers-terraform\hcp-main
terraform plan
terraform apply
```

### Expected results

- The remote plan succeeds without AWS access-key variables.
- The plan contains /fa-providers-terraform/default-provider, /aliased-provider, /sensitive-demo and /module-alias.
- Apply finishes successfully.
- Outputs for persisted_password_demo and training_secret_echo are shown as sensitive/redacted.

### Verification checks

- [ ] **task-11-plan-apply-verify-01** — HCP run status is Applied.
- [ ] **task-11-plan-apply-verify-02** — No resource name falls outside the fa-providers-terraform prefix.
- [ ] **task-11-plan-apply-verify-03** — No AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY was added to HCP.
- [ ] **task-11-plan-apply-verify-04** — The two account-ID outputs match.

## task-12-provider-verification — Verify default provider, alias and child-module routing

- **Feature:** Provider selection
- **Difficulty:** Medium
- **Goal:** Prove which resources were created through the default provider, the aws.london alias and the aliased provider passed to the child module.
- **Why it matters:** Explicit verification prevents a common beginner mistake: assuming that declaring an alias automatically makes resources use it.
- **Exam relevance:** Objective 2c: aliases do nothing until a resource/data/module selects or receives the alternate provider configuration.
- **Prerequisites:** task-11-plan-apply
- **Sources:** src-provider-block, src-provider-modules, src-provider-meta, src-providers-command, src-aws-ssm

### Console / browser route

1. In the HCP run, inspect resource addresses. aws_ssm_parameter.default_provider has no provider meta-argument and therefore uses the default AWS provider.
2. aws_ssm_parameter.aliased_provider explicitly sets provider = aws.london.
3. module.alias_demo.aws_ssm_parameter.module_alias is inside the child module, whose aws.london alias was declared and passed by the root module.
4. Run terraform providers again and inspect the module/provider tree.
5. Use AWS CLI with the bootstrap profile only for verification. Read the three non-secret parameters and list the sensitive-demo parameter WITHOUT requesting decryption.
6. Confirm all AWS resources are in eu-west-2.

### CLI / Terraform route

#### Verify provider-routed AWS resources

```
Set-Location C:\terraform-labs\fa-providers-terraform\hcp-main
terraform providers

aws ssm get-parameter --name "/fa-providers-terraform/default-provider" --region eu-west-2 --profile fa-providers-terraform-admin
aws ssm get-parameter --name "/fa-providers-terraform/aliased-provider" --region eu-west-2 --profile fa-providers-terraform-admin
aws ssm get-parameter --name "/fa-providers-terraform/module-alias" --region eu-west-2 --profile fa-providers-terraform-admin

aws ssm get-parameter `
  --name "/fa-providers-terraform/sensitive-demo" `
  --region eu-west-2 `
  --profile fa-providers-terraform-admin
```

### Expected results

- The three String parameters return their expected training values.
- The SecureString parameter is present, but its value is not intentionally decrypted in this verification.
- terraform providers shows the child module requires AWS and the root has AWS/Random.

### Verification checks

- [ ] **task-12-provider-verification-verify-01** — default-provider value is created-by-default-aws-provider.
- [ ] **task-12-provider-verification-verify-02** — aliased-provider value is created-by-aws-london-alias.
- [ ] **task-12-provider-verification-verify-03** — module-alias value is child-module-used-aws-london.
- [ ] **task-12-provider-verification-verify-04** — All parameter ARNs/locations are eu-west-2.

# Phase 5: Sensitive data, state and ephemeral values

Observe the difference between redaction and storage, then reduce sensitive state exposure using ephemeral patterns.

## task-13-sensitive-state — Compare sensitive redaction with actual state storage

- **Feature:** Sensitive data and state
- **Difficulty:** Hard
- **Goal:** Show that sensitive=true hides values from normal output but does not automatically remove them from Terraform state.
- **Why it matters:** This is one of the most important objective-4h distinctions: redaction protects accidental display; state access still requires strong security controls.
- **Exam relevance:** Objective 4h: sensitive does not mean 'not stored'. Ephemeral values and provider write-only arguments are the tools designed to avoid persistence when supported.
- **Prerequisites:** task-12-provider-verification
- **Sources:** src-sensitive-data, src-sensitive-vars, src-variable-block, src-output-block, src-ephemeral

### Warnings

- The raw state command can expose secrets. Use only the fake lab value and never paste state output into external systems.

### Console / browser route

1. Run terraform output. Confirm persisted_password_demo and training_secret_echo display as sensitive rather than showing their values.
2. Run terraform state list. Confirm random_password.persisted_demo is listed.
3. Confirm there is NO ephemeral.random_password.ephemeral_demo entry. Ephemeral resources are not persisted in state.
4. For this fake-secret exercise only, pull the current state and search for training-secret-not-real. The match demonstrates that sensitive redaction is not state omission.
5. Do not run state-pull searches for real secrets in shared terminals, tickets or screen recordings.
6. Open HCP Terraform > workspace > States and note that HCP retains state versions. State access itself must be protected.

### CLI / Terraform route

#### Inspect redaction and state using only the fake secret

```
terraform output
terraform state list

# Training-only proof. This literal value is deliberately fake.
terraform state pull | Select-String -SimpleMatch "training-secret-not-real"

# Ephemeral resources should not appear as managed state addresses.
terraform state list | Select-String -SimpleMatch "ephemeral.random_password.ephemeral_demo"
```

### Expected results

- terraform output redacts both sensitive outputs.
- Current raw state contains the fake training-secret-not-real because it is used by a persisted managed resource/output.
- random_password.persisted_demo is in state.
- ephemeral.random_password.ephemeral_demo is absent from state.

### Verification checks

- [ ] **task-13-sensitive-state-verify-01** — Sensitive values are redacted in normal output.
- [ ] **task-13-sensitive-state-verify-02** — The fake secret match proves state can contain sensitive values.
- [ ] **task-13-sensitive-state-verify-03** — The ephemeral resource has no state address.

## task-14-reduce-sensitive-state — Remove the deliberately persisted secret from current state

- **Feature:** Sensitive-data remediation
- **Difficulty:** Hard
- **Goal:** Change the configuration so the fake secret and stateful random password are no longer persisted in the current state, then apply the change.
- **Why it matters:** Good secret handling includes removing unnecessary secret consumers, but historical state versions may still contain older values and must remain protected.
- **Exam relevance:** State hygiene is part of sensitive-data management. Historical state versions still justify treating remote state as sensitive.
- **Prerequisites:** task-13-sensitive-state
- **Sources:** src-sensitive-data, src-ephemeral, src-write-only, src-output-block

### Console / browser route

1. Edit main.tf and remove the entire random_password.persisted_demo resource block.
2. Keep ephemeral.random_password.ephemeral_demo.
3. Remove the aws_ssm_parameter.sensitive_demo resource block.
4. Edit outputs.tf and remove persisted_password_demo and training_secret_echo output blocks. Keep only the two account-ID outputs.
5. Run terraform fmt, terraform validate and terraform plan.
6. The plan should destroy the stateful random password and the /fa-providers-terraform/sensitive-demo SSM parameter while leaving the three non-secret SSM parameters.
7. Apply the plan.
8. Run state pull and search for training-secret-not-real again. The CURRENT state should no longer contain the value.
9. Remember: an earlier HCP state version was created while the fake secret existed. Removing it from current configuration is not equivalent to erasing every historical copy.

### CLI / Terraform route

#### Apply the sensitive-state reduction

```
terraform fmt -recursive
terraform validate
terraform plan
terraform apply

terraform state list
terraform state pull | Select-String -SimpleMatch "training-secret-not-real"

aws ssm get-parameter `
  --name "/fa-providers-terraform/sensitive-demo" `
  --region eu-west-2 `
  --profile fa-providers-terraform-admin
```

### Expected results

- The sensitive-demo parameter is destroyed.
- random_password.persisted_demo is removed from state.
- The current state search returns no training-secret-not-real match.
- The three non-secret parameters remain.

### Verification checks

- [ ] **task-14-reduce-sensitive-state-verify-01** — AWS returns ParameterNotFound for /fa-providers-terraform/sensitive-demo.
- [ ] **task-14-reduce-sensitive-state-verify-02** — Current terraform state list has no random_password.persisted_demo.
- [ ] **task-14-reduce-sensitive-state-verify-03** — Current state has no fake training secret.

## task-15-ephemeral-write-only — Practice the ephemeral and write-only mental model

- **Feature:** Ephemeral values
- **Difficulty:** Medium
- **Goal:** Confirm the ephemeral random value is never stored and study the write-only resource argument pattern without creating a database.
- **Why it matters:** Terraform 1.10+ ephemeral values and 1.11+ write-only provider arguments address a limitation of sensitive=true by preventing selected values from being persisted.
- **Exam relevance:** Objective 4h includes best practices for sensitive data; modern Terraform adds ephemeral values and write-only arguments to avoid persistence where supported.
- **Prerequisites:** task-14-reduce-sensitive-state
- **Sources:** src-sensitive-data, src-ephemeral, src-write-only, src-exam-004

### Console / browser route

1. Run terraform plan again with only ephemeral.random_password.ephemeral_demo remaining from the Random provider.
2. Run terraform state list and confirm no random_password address exists.
3. Review the supplied write-only example. Do NOT paste it into the live lab because a real aws_db_instance requires networking, storage and cost-bearing resources.
4. Read the flow: ephemeral random_password exists only during the operation; password_wo is a provider-defined write-only argument; Terraform does not store either value in plan/state.
5. Contrast this with sensitive=true: sensitive normally redacts UI/CLI output but still allows persistence in state.
6. Also note that not every provider/resource has ephemeral resources or write-only arguments; provider documentation determines support.

### CLI / Terraform route

#### Confirm there is no password state address

```
terraform plan
terraform state list | Select-String -Pattern "random_password|ephemeral"
```

### Supplied configuration

#### Study-only ephemeral/write-only example

```
# EXAM STUDY EXAMPLE ONLY — DO NOT APPLY IN THIS LAB.
# This illustrates the modern pattern: an ephemeral value is passed to a
# provider-defined write-only argument, so Terraform does not persist it.

ephemeral "random_password" "database_password" {
  length  = 24
  special = true
}

resource "aws_db_instance" "example" {
  # Other required database arguments would be needed in a real configuration.
  password_wo         = ephemeral.random_password.database_password.result
  password_wo_version = 1
}
```

### Expected results

- No normal random_password managed resource is in state.
- The supplied write-only example is understood but not applied.
- The learner can explain sensitive vs ephemeral vs write-only in one sentence each.

### Verification checks

- [ ] **task-15-ephemeral-write-only-verify-01** — terraform state list contains no random_password.persisted_demo.
- [ ] **task-15-ephemeral-write-only-verify-02** — No database resource is created.
- [ ] **task-15-ephemeral-write-only-verify-03** — The current plan does not reintroduce the fake training secret.

# Phase 6: Vault provider and secrets management

Use a local development Vault with a fake secret to understand Vault authentication, data sources and Terraform state implications.

## task-16-vault-dev — Start a local Vault development server and store a fake secret

- **Feature:** Vault foundations
- **Difficulty:** Medium
- **Goal:** Create a local, disposable Vault development server and write one fake training secret.
- **Why it matters:** Objective 4h explicitly includes secrets management with Vault. A local dev server lets a beginner practice the provider flow without provisioning a paid or production Vault cluster.
- **Exam relevance:** 4h specifically names Vault. Vault can centralize secret storage and issue dynamic credentials, but Terraform/Vault integration must still consider what is persisted in Terraform state.
- **Prerequisites:** task-15-ephemeral-write-only
- **Sources:** src-vault-install, src-vault-get-started, src-vault-secrets, src-exam-004

### Warnings

- Vault dev mode and its root token are intentionally insecure and local-only. Never use this pattern for real secrets.

### Console / browser route

1. Check vault version in PowerShell. If Vault is not installed, install it using the official HashiCorp Vault installation page.
2. Open PowerShell terminal A and start the dev server with the exact dev root token fa-providers-terraform-dev-token.
3. Leave terminal A running. Vault dev mode is in-memory, automatically initialized/unsealed and NOT secure for production.
4. Open a second PowerShell terminal B.
5. Set VAULT_ADDR to http://127.0.0.1:8200 and VAULT_TOKEN to the training dev token.
6. Run vault status.
7. Write one fake KV secret at secret/fa-providers-terraform with api_key=training-vault-secret-not-real.
8. Read it back once. It is fake training data only.
9. Do not expose terminal A or this dev token to other machines; the server should bind only for local development.

### CLI / Terraform route

#### Terminal A - local Vault dev server

```
vault server -dev -dev-root-token-id="fa-providers-terraform-dev-token"
```

#### Terminal B - write fake Vault secret

```
$env:VAULT_ADDR = "http://127.0.0.1:8200"
$env:VAULT_TOKEN = "fa-providers-terraform-dev-token"

vault status
vault kv put secret/fa-providers-terraform api_key="training-vault-secret-not-real"
vault kv get secret/fa-providers-terraform
```

### Expected results

- Vault dev server reports initialized and unsealed.
- vault status succeeds from terminal B.
- The fake KV secret can be read from secret/fa-providers-terraform.

### Verification checks

- [ ] **task-16-vault-dev-verify-01** — VAULT_ADDR points to 127.0.0.1:8200.
- [ ] **task-16-vault-dev-verify-02** — Only the fake training secret is stored.
- [ ] **task-16-vault-dev-verify-03** — The learner understands dev mode must never be treated as production Vault.

## task-17-vault-provider — Read the fake secret with the Terraform Vault provider

- **Feature:** Vault provider
- **Difficulty:** Hard
- **Goal:** Use a separate local Terraform directory to authenticate the Vault provider from VAULT_TOKEN and read the fake KV value as a sensitive output.
- **Why it matters:** This shows the good practice of keeping the Vault token out of .tf files while also proving that data retrieved from Vault can still be persisted by Terraform if the configuration stores it in state.
- **Exam relevance:** Vault is a secrets-management system, not a magic exemption from Terraform state behavior. Provider/data-source design and downstream usage determine what Terraform persists.
- **Prerequisites:** task-16-vault-dev
- **Sources:** src-vault-provider, src-vault-secrets, src-sensitive-data, src-provider-requirements

### Console / browser route

1. Create C:\terraform-labs\fa-providers-terraform\vault-demo.
2. Create main.tf using the supplied Vault provider configuration.
3. Notice the provider block contains the Vault address but NO token. The provider reads VAULT_TOKEN from terminal B's environment.
4. Run terraform init, validate and apply locally. This mini-exercise intentionally does not use HCP Terraform because the remote runner cannot reach your laptop's 127.0.0.1 Vault server.
5. Run terraform output. vault_secret_demo should display as sensitive.
6. For the fake secret only, run terraform state pull and search for training-vault-secret-not-real. A match demonstrates why retrieving a secret from Vault does not automatically guarantee Terraform state will be secret-free.
7. Do not commit this local state.

### CLI / Terraform route

#### Vault provider exercise

```
New-Item -ItemType Directory -Force C:\terraform-labs\fa-providers-terraform\vault-demo | Out-Null
Set-Location C:\terraform-labs\fa-providers-terraform\vault-demo

$env:VAULT_ADDR = "http://127.0.0.1:8200"
$env:VAULT_TOKEN = "fa-providers-terraform-dev-token"

terraform fmt
terraform init
terraform validate
terraform apply -auto-approve
terraform output
terraform state pull | Select-String -SimpleMatch "training-vault-secret-not-real"
```

### Supplied configuration

#### vault-demo/main.tf

```
terraform {
  required_version = ">= 1.11.0, < 2.0.0"

  required_providers {
    vault = {
      source  = "hashicorp/vault"
      version = ">= 4.0.0"
    }
  }
}

provider "vault" {
  address = "http://127.0.0.1:8200"
}

data "vault_kv_secret_v2" "training" {
  mount = "secret"
  name  = "fa-providers-terraform"
}

output "vault_secret_demo" {
  description = "Fake training secret read from Vault. Sensitive output redacts display but the data source can still place the value in Terraform state."
  value       = data.vault_kv_secret_v2.training.data["api_key"]
  sensitive   = true
}
```

### Expected results

- Terraform installs the Vault provider.
- Vault provider authenticates without a token in main.tf.
- vault_secret_demo is redacted in normal output.
- The fake secret can be found in local Terraform state because the data source result is stateful.

### Verification checks

- [ ] **task-17-vault-provider-verify-01** — main.tf contains no Vault token.
- [ ] **task-17-vault-provider-verify-02** — terraform validate succeeds.
- [ ] **task-17-vault-provider-verify-03** — Sensitive output is redacted.
- [ ] **task-17-vault-provider-verify-04** — Fake secret state search produces the expected training-only proof.

# Phase 7: Exam review and ordered cleanup

Review provider/authentication exam points and remove only resources created by this Follow Along in reverse-dependency order.

## task-18-exam-review — Review provider, authentication and objective 4h exam points

- **Feature:** Exam consolidation
- **Difficulty:** Easy
- **Goal:** Turn the completed hands-on work into a clear Terraform Associate 004 mental model before cleanup.
- **Why it matters:** The exam tests concepts rather than AWS-specific memorization, so the learner should be able to describe the general Terraform behavior shown by the lab.
- **Exam relevance:** Official exam mapping: 2a provider installation/versioning, 2b provider use, 2c multiple providers, 4h sensitive data including Vault.
- **Prerequisites:** task-17-vault-provider
- **Sources:** src-exam-004, src-provider-requirements, src-provider-block, src-provider-modules, src-configure-providers, src-sensitive-data, src-vault-secrets

### Console / browser route

1. Provider requirement: required_providers tells Terraform the provider source and acceptable versions.
2. Provider installation: terraform init installs/selects providers and writes concrete selections/checksums to .terraform.lock.hcl.
3. Provider block: configures a provider client, such as region or authentication-related settings.
4. Multiple provider types: this lab used AWS, Random and Vault.
5. Provider aliases: aws.london is a second configuration of the AWS provider. A resource/module must explicitly select/receive it; declaring an alias alone changes nothing.
6. Modules: provider configurations are defined in the root; child modules declare requirements and configuration_aliases, then the root can pass providers explicitly.
7. Authentication: local shared profile used long-lived bootstrap credentials; HCP remote runs used OIDC dynamic short-lived role credentials; Vault provider used a token from an environment variable instead of hard-coding it.
8. Sensitive: sensitive=true redacts normal display but values can still exist in state.
9. Ephemeral: values/resources marked/defined as ephemeral are omitted from persistent plan/state artifacts and may be used only in allowed ephemeral contexts.
10. Write-only: provider-defined write-only resource arguments accept values during an operation without persisting those argument values.
11. Vault: centralizes secrets and can issue dynamic secrets/credentials, but Terraform configurations using Vault must still protect state and avoid unnecessary secret persistence.

### CLI / Terraform route

#### Final provider/state inventory before destroy

```
Set-Location C:\terraform-labs\fa-providers-terraform\hcp-main
terraform providers
terraform state list

aws ssm describe-parameters `
  --parameter-filters "Key=Name,Option=BeginsWith,Values=/fa-providers-terraform/" `
  --region eu-west-2 `
  --profile fa-providers-terraform-admin
```

### Expected results

- The learner can explain 2a, 2b, 2c and 4h without relying on AWS-specific trivia.
- Current HCP state contains only the three non-secret SSM parameters managed by the main configuration.
- Vault demo remains local and disposable.

### Verification checks

- [ ] **task-18-exam-review-verify-01** — terraform providers shows AWS and Random plus module AWS requirement.
- [ ] **task-18-exam-review-verify-02** — terraform state list has no sensitive-demo or persisted random password.
- [ ] **task-18-exam-review-verify-03** — AWS lists exactly the three remaining /fa-providers-terraform/ parameters.

## task-19-destroy-main — Destroy the Terraform-managed AWS training resources

- **Feature:** Terraform destroy
- **Difficulty:** Hard
- **Goal:** Run destroy while the HCP workspace still owns its state and verify all Terraform-managed AWS resources are gone.
- **Why it matters:** Destroying from the owning state first preserves dependency information and prevents orphaned resources.
- **Exam relevance:** Objective 3f destroy: Terraform should destroy resources it manages before you delete the state/workspace that describes them.
- **Prerequisites:** task-18-exam-review
- **Sources:** src-aws-ssm-delete, src-sensitive-data, src-init

### Warnings

- Stop immediately if the destroy plan includes any resource outside the exact training prefix.

### Console / browser route

1. Return to hcp-main in PowerShell and ensure TF_CLOUD_ORGANIZATION and TF_WORKSPACE still identify the lab workspace.
2. Run terraform plan -destroy and review every resource. It must target only /fa-providers-terraform/* resources.
3. Run terraform destroy and type yes.
4. Wait for the HCP run to finish Applied/Destroyed.
5. Run terraform state list. It should be empty of managed lab resources.
6. Use AWS CLI describe-parameters with the prefix filter. No lab parameter should remain.
7. Do not delete the HCP workspace until this verification passes.

### CLI / Terraform route

#### Destroy and verify

```
Set-Location C:\terraform-labs\fa-providers-terraform\hcp-main
terraform plan -destroy
terraform destroy

terraform state list

aws ssm describe-parameters `
  --parameter-filters "Key=Name,Option=BeginsWith,Values=/fa-providers-terraform/" `
  --region eu-west-2 `
  --profile fa-providers-terraform-admin
```

### Expected results

- The destroy run succeeds.
- terraform state list contains no managed lab resource.
- AWS returns no /fa-providers-terraform/ parameter.

### Verification checks

- [ ] **task-19-destroy-main-verify-01** — No SSM parameter with the training prefix remains.
- [ ] **task-19-destroy-main-verify-02** — HCP current state manages zero training AWS resources.
- [ ] **task-19-destroy-main-verify-03** — The workspace still exists temporarily for safe post-destroy cleanup.

## task-20-final-cleanup — Remove HCP, Vault, AWS authentication and local training artifacts

- **Feature:** Ordered cleanup
- **Difficulty:** Hard
- **Goal:** Complete the manual reverse-dependency cleanup and acknowledge that only lab-created resources were removed.
- **Why it matters:** Provider credentials, state and local files are intentionally removed after managed cloud infrastructure so cleanup does not destroy the information needed to remove resources safely.
- **Exam relevance:** Cleanup reinforces ownership boundaries: destroy managed resources first, then state/workspace, then authentication material and local files.
- **Prerequisites:** task-19-destroy-main
- **Sources:** src-hcp-org, src-hcp-projects, src-hcp-workspaces, src-aws-oidc-role, src-aws-ssm-delete, src-vault-get-started, src-aws-cli-config

### Warnings

- Never delete an OIDC provider or HCP organization that existed before this lab or is shared with other workloads.

### Console / browser route

1. Confirm Task 19 destroy and AWS parameter verification are complete before deleting HCP state/workspace.
2. In HCP Terraform delete workspace fa-providers-terraform-providers-sensitive. Do not force-delete a workspace that still reports managed resources.
3. Delete project fa-providers-terraform-project after it is empty.
4. Delete the dedicated HCP organization whose name begins fa-providers-terraform- and ends with your recorded AWS account ID, but only if it was created solely for this Follow Along.
5. In the local Vault demo terminal, delete the fake secret if the dev server is still running, then stop the dev server with Ctrl+C. Because dev mode is memory-only, stopping the server removes its in-memory data.
6. In AWS IAM delete inline policy fa-providers-terraform-run-policy from role fa-providers-terraform-run-role, then delete the role.
7. Delete the app.terraform.io OIDC provider only if this Follow Along created it and no other workspace depends on it.
8. Sign in as root only to remove the temporary training IAM user's access key, delete user fa-providers-terraform-admin and delete customer policy fa-providers-terraform-admin-policy. Then sign out of root.
9. Remove only the [fa-providers-terraform-admin] sections from your local AWS credentials/config files or use aws configure commands to clear that named profile. Do not delete unrelated profiles.
10. Clear the current shell environment variables TF_CLOUD_ORGANIZATION, TF_WORKSPACE, VAULT_ADDR and VAULT_TOKEN.
11. Delete C:\terraform-labs\fa-providers-terraform last, after every cloud/HCP/authentication verification is complete.
12. Read and affirm the programme cleanup acknowledgement in the cleanup section.

### CLI / Terraform route

#### Cleanup verification commands

```
# Verify the Terraform-managed AWS objects are already gone.
aws ssm describe-parameters `
  --parameter-filters "Key=Name,Option=BeginsWith,Values=/fa-providers-terraform/" `
  --region eu-west-2 `
  --profile fa-providers-terraform-admin

# After deleting the run role, this should fail with NoSuchEntity.
aws iam get-role --role-name fa-providers-terraform-run-role --profile fa-providers-terraform-admin

# Remove session-only environment variables.
Remove-Item Env:TF_CLOUD_ORGANIZATION -ErrorAction SilentlyContinue
Remove-Item Env:TF_WORKSPACE -ErrorAction SilentlyContinue
Remove-Item Env:VAULT_ADDR -ErrorAction SilentlyContinue
Remove-Item Env:VAULT_TOKEN -ErrorAction SilentlyContinue
```

### Expected results

- No training SSM parameter exists.
- HCP workspace/project/dedicated organization are removed.
- Vault dev process/data are gone.
- HCP AWS run role and lab-created OIDC provider are removed.
- Temporary IAM user/access key/policy and named CLI profile are removed.
- Local lab directory is removed last.

### Verification checks

- [ ] **task-20-final-cleanup-verify-01** — Every cleanup step was performed only against exact lab names.
- [ ] **task-20-final-cleanup-verify-02** — No unrelated AWS IAM/OIDC/HCP object was deleted.
- [ ] **task-20-final-cleanup-verify-03** — No lab credential or local state remains.

# Cross-programme troubleshooting

## trouble-01 — terraform init cannot select the HCP organization or workspace

- **Likely cause:** TF_CLOUD_ORGANIZATION or TF_WORKSPACE is not set in the current shell, or terraform login has not completed.
- **Fix:** Rebuild HCP_ORG from the AWS account ID, set both environment variables, run terraform login if needed, then rerun terraform init.

## trouble-02 — HCP plan fails with no valid credential sources

- **Likely cause:** One or more TFC_AWS_* dynamic credential variables are missing, or static AWS arguments interfere with HCP dynamic credentials.
- **Fix:** Confirm TFC_AWS_PROVIDER_AUTH=true, TFC_AWS_PROVIDER_AUTH_LONDON=true and TFC_DEFAULT_AWS_RUN_ROLE_ARN is correct; remove access_key/secret_key/profile arguments from the HCP AWS provider blocks.

## trouble-03 — Invalid index for tfc_aws_dynamic_credentials.aliases["LONDON"]

- **Likely cause:** The LONDON tagged dynamic credential configuration was not created in HCP Terraform.
- **Fix:** Add Environment variable TFC_AWS_PROVIDER_AUTH_LONDON=true, keep the default run role ARN, save, and queue a new run.

## trouble-04 — AssumeRoleWithWebIdentity AccessDenied

- **Likely cause:** The role trust subject does not exactly match organization, project, workspace or run phase, or the audience is wrong.
- **Fix:** Compare the trust policy with the exact recorded HCP names and aws.workload.identity audience. Do not broaden the trust to all organizations.

## trouble-05 — AccessDenied on ssm:PutParameter

- **Likely cause:** The run role inline policy is missing an action or the parameter name is outside /fa-providers-terraform/*.
- **Fix:** Keep the parameter names under the exact training prefix and compare the inline policy with the supplied policy; do not grant AdministratorAccess.

## trouble-06 — Child module reports missing provider configuration aws.london

- **Likely cause:** configuration_aliases or the root module providers map is missing.
- **Fix:** Ensure child versions.tf declares configuration_aliases=[aws.london] and the root module block maps aws.london = aws.london.

## trouble-07 — terraform output says a sensitive value cannot be displayed

- **Likely cause:** The output is marked sensitive as intended.
- **Fix:** Do not remove sensitive=true merely to reveal it. This lab uses state pull only with an explicitly fake value to demonstrate persistence.

## trouble-08 — Fake training secret remains in current state after Task 14

- **Likely cause:** A resource/output still references var.training_secret or the apply was not completed.
- **Fix:** Search the .tf files for training_secret, keep only the variable declaration, apply the removals, then pull current state again.

## trouble-09 — vault status returns connection refused

- **Likely cause:** The local Vault dev server stopped or VAULT_ADDR is missing.
- **Fix:** Restart the dev server in terminal A and set VAULT_ADDR=http://127.0.0.1:8200 in terminal B.

## trouble-10 — Vault provider returns permission denied

- **Likely cause:** VAULT_TOKEN is absent/wrong in the terminal running Terraform.
- **Fix:** For this dev-only exercise set VAULT_TOKEN=fa-providers-terraform-dev-token in that terminal. Never put the token in main.tf.

## trouble-11 — Destroy plan contains an unexpected AWS resource

- **Likely cause:** Wrong HCP workspace/environment variables or an unintended resource was added.
- **Fix:** Cancel destroy immediately. Verify TF_CLOUD_ORGANIZATION, TF_WORKSPACE and terraform state list before retrying.

## trouble-12 — IAM refuses to create a second app.terraform.io OIDC provider

- **Likely cause:** That issuer already exists in the AWS account.
- **Fix:** Do not overwrite or delete an existing shared provider. Stop and determine ownership before continuing; this manuscript assumes no pre-existing infrastructure.

# Ordered manual cleanup

- **Completion gate:** `acknowledgement`
- **Manual only:** `true`
- **Ordering:** `reverse_dependency`

## Cleanup 1: /fa-providers-terraform/sensitive-demo and random_password.persisted_demo

- **Action:** Task 14 removes the deliberately persisted fake secret and stateful random password as soon as their lesson is complete.
- **Verification:** Current state no longer contains the fake training secret or random_password.persisted_demo.
- **Task:** task-14-reduce-sensitive-state

## Cleanup 2: /fa-providers-terraform/default-provider, /aliased-provider and /module-alias

- **Action:** Run terraform destroy from the HCP-connected main directory.
- **Verification:** AWS prefix query returns no parameters and terraform state list is empty.
- **Task:** task-19-destroy-main

## Cleanup 3: fa-providers-terraform-providers-sensitive

- **Action:** Delete the empty HCP Terraform workspace only after AWS destroy verification.
- **Verification:** Workspace no longer appears in HCP Terraform.
- **Task:** task-20-final-cleanup

## Cleanup 4: fa-providers-terraform-project

- **Action:** Delete the project after the workspace is gone.
- **Verification:** Project no longer appears.
- **Task:** task-20-final-cleanup

## Cleanup 5: Dedicated HCP organization derived from the AWS account ID

- **Action:** Delete only the organization created solely for this lab.
- **Verification:** The dedicated lab organization no longer exists.
- **Task:** task-20-final-cleanup

## Cleanup 6: Local Vault secret secret/fa-providers-terraform and Vault dev server

- **Action:** Delete the fake secret if the server is still running, then stop the local dev server.
- **Verification:** Vault process is stopped; dev-mode in-memory data is gone.
- **Task:** task-20-final-cleanup

## Cleanup 7: fa-providers-terraform-run-policy then fa-providers-terraform-run-role

- **Action:** Delete the inline run policy and then the role.
- **Verification:** iam get-role for fa-providers-terraform-run-role returns NoSuchEntity.
- **Task:** task-20-final-cleanup

## Cleanup 8: app.terraform.io OIDC provider created by this lab

- **Action:** Delete only after no HCP workspace needs it and only if this lab created it.
- **Verification:** IAM identity-provider list no longer contains the lab-owned provider.
- **Task:** task-20-final-cleanup

## Cleanup 9: fa-providers-terraform-admin access key/user and fa-providers-terraform-admin-policy

- **Action:** Use root only to remove the temporary bootstrap access key, user and customer policy; then sign out root.
- **Verification:** The training IAM user and policy are absent.
- **Task:** task-20-final-cleanup

## Cleanup 10: AWS CLI profile fa-providers-terraform-admin

- **Action:** Remove only this named profile's config/credentials sections.
- **Verification:** The profile is absent while unrelated profiles remain untouched.
- **Task:** task-20-final-cleanup

## Cleanup 11: Session environment variables

- **Action:** Remove TF_CLOUD_ORGANIZATION, TF_WORKSPACE, VAULT_ADDR and VAULT_TOKEN from the current shell.
- **Verification:** The variables are no longer defined in the shell.
- **Task:** task-20-final-cleanup

## Cleanup 12: C:\terraform-labs\fa-providers-terraform

- **Action:** Delete the local lab folder only after cloud, HCP and authentication cleanup is verified.
- **Verification:** The local training folder is absent.
- **Task:** task-20-final-cleanup

## Programme cleanup acknowledgement

I verified that all /fa-providers-terraform/* AWS parameters are absent from eu-west-2; the HCP Terraform workspace fa-providers-terraform-providers-sensitive, project fa-providers-terraform-project, and dedicated lab organization are removed; the local Vault development server and fake secret are gone; fa-providers-terraform-run-role, its inline policy and the lab-owned app.terraform.io OIDC provider are removed; the temporary IAM user/access key/policy and named AWS CLI profile are removed; the shell variables are cleared; and only then was C:\terraform-labs\fa-providers-terraform deleted.

# Official sources

## src-exam-004 — Exam Content List - Terraform Associate 004

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004
- **Purpose:** Official exam mapping for provider objectives 2a-2c and sensitive-data objective 4h.
- **Used by:** task-01-prerequisites, task-15-ephemeral-write-only, task-16-vault-dev, task-18-exam-review

## src-tf-install — Install Terraform

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/install
- **Purpose:** Install or verify the Terraform CLI.
- **Used by:** task-01-prerequisites

## src-provider-requirements — Provider Requirements

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/providers/requirements
- **Purpose:** Declare provider source addresses and version constraints.
- **Used by:** task-04-local-auth-demo, task-09-build-config, task-10-init-lock-inspect, task-17-vault-provider, task-18-exam-review

## src-provider-block — Provider block reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/block/provider
- **Purpose:** Configure providers, aliases and alternate provider selections.
- **Used by:** task-09-build-config, task-11-plan-apply, task-12-provider-verification, task-18-exam-review

## src-configure-providers — Configure Terraform providers

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/configuration-language/configure-providers
- **Purpose:** Provider authentication methods and warning against hard-coded credentials.
- **Used by:** task-03-cli-profile, task-04-local-auth-demo, task-18-exam-review

## src-provider-modules — Providers Within Modules

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/modules/develop/providers
- **Purpose:** Provider inheritance, configuration_aliases and explicit provider passing.
- **Used by:** task-09-build-config, task-11-plan-apply, task-12-provider-verification, task-18-exam-review

## src-provider-meta — providers meta-argument reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/meta-arguments/providers
- **Purpose:** Pass specific provider configurations to child modules.
- **Used by:** task-09-build-config, task-12-provider-verification

## src-lock-file — Dependency Lock File

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/files/dependency-lock
- **Purpose:** Explain .terraform.lock.hcl and provider selection locking.
- **Used by:** task-10-init-lock-inspect

## src-init — Initialize Terraform configuration

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/cli/init
- **Purpose:** Initialize providers and HCP Terraform integration.
- **Used by:** task-04-local-auth-demo, task-10-init-lock-inspect, task-19-destroy-main

## src-providers-command — terraform providers command

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/providers
- **Purpose:** Inspect provider requirements and module/provider relationships.
- **Used by:** task-10-init-lock-inspect, task-12-provider-verification

## src-cloud-block — terraform block reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/block/terraform
- **Purpose:** Use cloud block environment variables such as TF_CLOUD_ORGANIZATION and TF_WORKSPACE.
- **Used by:** task-05-hcp-org-project-workspace, task-10-init-lock-inspect

## src-terraform-login — terraform login command

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/login
- **Purpose:** Authenticate the local Terraform CLI to HCP Terraform.
- **Used by:** task-05-hcp-org-project-workspace

## src-hcp-org — Organizations overview

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/users-teams-organizations/organizations
- **Purpose:** Create and understand the HCP Terraform organization boundary.
- **Used by:** task-05-hcp-org-project-workspace, task-20-final-cleanup

## src-hcp-projects — Organize workspaces with projects

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/cloud/projects
- **Purpose:** Create a dedicated HCP Terraform project.
- **Used by:** task-05-hcp-org-project-workspace, task-20-final-cleanup

## src-hcp-workspaces — HCP Terraform workspaces overview

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/workspaces
- **Purpose:** Create and configure the CLI-driven remote workspace.
- **Used by:** task-05-hcp-org-project-workspace, task-20-final-cleanup

## src-hcp-variables — Workspace variables

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/workspaces/variables
- **Purpose:** Configure Terraform and environment variables, including sensitive values.
- **Used by:** task-08-hcp-variables

## src-hcp-dynamic-aws — Use dynamic credentials with the AWS provider

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/dynamic-provider-credentials/aws-configuration
- **Purpose:** Configure HCP Terraform OIDC credentials for AWS provider runs.
- **Used by:** task-06-oidc-provider, task-07-run-role, task-08-hcp-variables, task-11-plan-apply

## src-hcp-multi-creds — Specify multiple dynamic credential configurations

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cloud-docs/dynamic-provider-credentials/specifying-multiple-configurations
- **Purpose:** Use tagged dynamic credential variables for multiple provider configurations/aliases.
- **Used by:** task-08-hcp-variables, task-09-build-config, task-11-plan-apply

## src-sensitive-data — Manage sensitive data in your configuration

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/manage-sensitive-data
- **Purpose:** Explain sensitive values, state exposure, ephemeral values and write-only arguments.
- **Used by:** task-08-hcp-variables, task-09-build-config, task-13-sensitive-state, task-14-reduce-sensitive-state, task-15-ephemeral-write-only, task-17-vault-provider, task-18-exam-review, task-19-destroy-main

## src-sensitive-vars — Protect sensitive input variables

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/configuration-language/sensitive-variables
- **Purpose:** Demonstrate sensitive input/output redaction and state implications.
- **Used by:** task-11-plan-apply, task-13-sensitive-state

## src-variable-block — variable block reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/block/variable
- **Purpose:** Define sensitive and ephemeral input variables.
- **Used by:** task-13-sensitive-state

## src-output-block — output block reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/block/output
- **Purpose:** Understand sensitive output behavior and state persistence.
- **Used by:** task-13-sensitive-state, task-14-reduce-sensitive-state

## src-ephemeral — Ephemeral values in resources

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/manage-sensitive-data/ephemeral
- **Purpose:** Demonstrate ephemeral resources that are omitted from state and plan artifacts.
- **Used by:** task-09-build-config, task-13-sensitive-state, task-14-reduce-sensitive-state, task-15-ephemeral-write-only

## src-write-only — Use temporary write-only arguments

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/manage-sensitive-data/write-only
- **Purpose:** Explain write-only arguments and how they pair with ephemeral values.
- **Used by:** task-14-reduce-sensitive-state, task-15-ephemeral-write-only

## src-vault-install — Install Vault

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/vault/install
- **Purpose:** Install the Vault CLI/server for the local training-only Vault exercise.
- **Used by:** task-16-vault-dev

## src-vault-get-started — Vault foundations

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/vault/tutorials/get-started
- **Purpose:** Run a local Vault development server and learn the security boundary.
- **Used by:** task-16-vault-dev, task-20-final-cleanup

## src-vault-provider — Learn to use the Terraform Vault provider

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/vault/tutorials/get-started/learn-terraform
- **Purpose:** Configure Terraform to authenticate to and read from Vault.
- **Used by:** task-17-vault-provider

## src-vault-secrets — Inject secrets into Terraform using the Vault provider

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/secrets/secrets-vault
- **Purpose:** Objective 4h Vault pattern and state-sensitivity implications.
- **Used by:** task-16-vault-dev, task-17-vault-provider, task-18-exam-review

## src-aws-cli-install — Install or update to the latest version of the AWS CLI

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- **Purpose:** Install AWS CLI v2.
- **Used by:** task-01-prerequisites

## src-aws-cli-config — aws configure

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/configure/
- **Purpose:** Create the dedicated named AWS CLI profile.
- **Used by:** task-03-cli-profile, task-20-final-cleanup

## src-aws-sts — get-caller-identity

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html
- **Purpose:** Verify the caller and derive the AWS account ID.
- **Used by:** task-03-cli-profile, task-04-local-auth-demo

## src-aws-iam-intro — What is IAM?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html
- **Purpose:** Explain authentication, authorization, users and roles.
- **Used by:** task-02-aws-bootstrap

## src-aws-iam-best — Security best practices in IAM

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- **Purpose:** Prefer temporary role credentials over long-lived user credentials.
- **Used by:** task-02-aws-bootstrap, task-06-oidc-provider, task-07-run-role

## src-aws-oidc-role — Create a role for OpenID Connect federation

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html
- **Purpose:** Create the app.terraform.io OIDC provider and restricted role trust.
- **Used by:** task-02-aws-bootstrap, task-06-oidc-provider, task-07-run-role, task-20-final-cleanup

## src-aws-oidc-cli — create-open-id-connect-provider

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/iam/create-open-id-connect-provider.html
- **Purpose:** CLI route for creating the HCP Terraform OIDC provider.
- **Used by:** task-06-oidc-provider

## src-aws-ssm — AWS Systems Manager Parameter Store

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- **Purpose:** Verify the small training resources managed by the AWS provider.
- **Used by:** task-07-run-role, task-11-plan-apply, task-12-provider-verification

## src-aws-ssm-delete — Deleting parameters from Parameter Store

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/systems-manager/latest/userguide/deleting-parameters.html
- **Purpose:** Verify destroy and cleanup.
- **Used by:** task-19-destroy-main, task-20-final-cleanup

# Offline conversion boundary

This preview and its JSON manuscript are intentionally offline authoring artifacts. They have not been locally validated by Study Tracker, imported, accepted, approved, published, or fingerprinted. Local Codex should convert and validate them using the repository's controlled workflow.
