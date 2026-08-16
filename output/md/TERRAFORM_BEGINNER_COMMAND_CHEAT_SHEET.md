# Terraform Beginner Command Cheat Sheet

Use only the command section that matches your terminal. Run one command at a time.

## AWS CloudShell folder commands

| Purpose | Command |
|---|---|
| Show the current folder | `pwd` |
| List files and folders | `ls -la` |
| Create the lab folder | `mkdir -p ~/fa-terraform-beginner` |
| Enter the lab folder | `cd ~/fa-terraform-beginner` |
| Create or edit a file | `nano main.tf` |
| Save in nano | Press `Ctrl+O`, then `Enter` |
| Exit nano | Press `Ctrl+X` |
| Return to the parent folder | `cd ..` |

## Windows PowerShell folder commands

| Purpose | Command |
|---|---|
| Show the current folder | `Get-Location` |
| List files and folders | `Get-ChildItem` |
| Create the lab folder | `New-Item -ItemType Directory -Path "$env:USERPROFILE\fa-terraform-beginner" -Force` |
| Enter the lab folder | `Set-Location "$env:USERPROFILE\fa-terraform-beginner"` |
| Create or edit a file | `notepad main.tf` |
| Return to the parent folder | `Set-Location ..` |

## AWS identity commands

| Purpose | Command |
|---|---|
| Show the signed-in AWS identity and account | `aws sts get-caller-identity` |
| Show the configured default Region | `aws configure get region` |
| Show the AWS CLI version | `aws --version` |

## Core Terraform commands

| Command | What it does |
|---|---|
| `terraform version` | Shows the installed Terraform version. |
| `terraform fmt` | Reformats Terraform files consistently. |
| `terraform init` | Prepares the folder and downloads required providers. |
| `terraform validate` | Checks that the configuration is structurally valid. |
| `terraform plan -out=tfplan` | Calculates proposed changes and saves the reviewed plan. |
| `terraform show tfplan` | Displays the saved plan again. |
| `terraform apply tfplan` | Applies exactly the saved plan. |
| `terraform output` | Displays declared output values. |
| `terraform state list` | Lists resource addresses tracked in state. |
| `terraform plan` | Checks whether configuration and infrastructure still agree. |
| `terraform plan -destroy -out=destroy.tfplan` | Creates a saved teardown plan for review. |
| `terraform apply destroy.tfplan` | Applies exactly the reviewed teardown plan. |

## Common plan symbols

- `+ create` means Terraform proposes creating a resource.
- `~ update in-place` means Terraform proposes changing an existing resource without replacing it.
- `-/+ replace` means Terraform proposes destroying and recreating a resource. Stop and understand why.
- `- destroy` means Terraform proposes deleting a resource. Verify the exact address before continuing.
- `Plan: 0 to add, 0 to change, 0 to destroy` means no infrastructure change is required.

## Safety reminders

1. Confirm the AWS account and Region before every plan or apply.
2. Read every plan before applying it.
3. Never paste passwords, access keys, session tokens, or state content into files or chat.
4. Never delete a folder until Terraform-managed cloud resources have been removed and verified.
