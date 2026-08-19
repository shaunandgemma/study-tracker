# Security & KMS Follow Along

> **Status:** Portable offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Intermediate
- **Exam workspace:** AWS SAA-C03
- **AWS Region:** eu-west-2
- **Training resource prefix:** `fa-kms`

## Required outcome

Implement a customer managed AWS KMS key with automatic rotation; encrypt and rotate a training-only Secrets Manager secret with a custom Lambda rotation function; create and inspect AWS WAF web ACL rules; enable GuardDuty and safely inspect sample threat findings; then remove all training resources, with the KMS key scheduled for deletion through AWS's required waiting period.

## Completion definition

- fa-kms-admin is created for normal lab work and root is not used for day-to-day tasks.
- One symmetric customer managed KMS key exists under alias/fa-kms-security-key with automatic 365-day rotation enabled.
- fa-kms-rotating-demo-secret is encrypted by the customer managed KMS key.
- fa-kms-rotation-function completes a training-only four-stage Secrets Manager rotation and AWSCURRENT moves to a new version.
- fa-kms-web-acl contains a source-IP rate-based blocking rule plus AWSManagedRulesCommonRuleSet.
- One GuardDuty detector is enabled in eu-west-2 and sample finding data is inspected without malicious activity.
- All deletable training resources are removed in reverse dependency order.
- The KMS alias is removed and the underlying customer managed key is PendingDeletion for the AWS-enforced 7-day waiting period.
- Temporary IAM credentials, the CLI profile and C:\aws-labs\fa-kms are removed last.

## Warnings

### Cost

AWS KMS customer managed keys, AWS Secrets Manager secrets/rotation, Lambda invocations/log storage, AWS WAF web ACL/rules and GuardDuty can incur charges. Review current pricing and complete cleanup promptly. The KMS key is scheduled for deletion rather than immediately removed because AWS enforces a waiting period.

### Safety

Use a disposable personal training account and exact fa-kms names. The WAF web ACL is intentionally left unassociated so the lab cannot block a real application. GuardDuty uses sample findings only.

### Credentials

Never create root access keys. The temporary fa-kms-admin IAM-user access key is entered only through aws configure and removed after cloud cleanup. All secret values in this Follow Along are fake training values.

### Region

All regional resources are created in AWS eu-west-2. GuardDuty is enabled only in eu-west-2 for this lab; KMS keys and Secrets Manager secrets are Region-scoped.

## Resource inventory

| Platform | Type | Exact name or rule | Created | Cleaned |
|---|---|---|---|---|
| AWS IAM | IAM user | `fa-kms-admin` | task-02-iam-bootstrap | task-16-identity-local-cleanup |
| AWS IAM | customer managed policy | `fa-kms-admin-policy` | task-02-iam-bootstrap | task-16-identity-local-cleanup |
| AWS IAM | IAM user access key | `temporary key for fa-kms-admin` | task-03-cli-profile | task-16-identity-local-cleanup |
| Local workstation | AWS CLI named profile | `fa-kms-admin` | task-03-cli-profile | task-16-identity-local-cleanup |
| Local workstation | lab folder | `C:\aws-labs\fa-kms` | task-03-cli-profile | task-16-identity-local-cleanup |
| AWS KMS | customer managed symmetric key | `alias/fa-kms-security-key` | task-04-create-kms-key | task-15-cloud-cleanup |
| AWS Secrets Manager | secret | `fa-kms-rotating-demo-secret` | task-06-create-secret | task-15-cloud-cleanup |
| AWS IAM | Lambda execution role | `fa-kms-rotation-role` | task-07-rotation-role-code | task-15-cloud-cleanup |
| AWS Lambda | rotation function | `fa-kms-rotation-function` | task-08-create-rotation-lambda | task-15-cloud-cleanup |
| Amazon CloudWatch Logs | log group | `/aws/lambda/fa-kms-rotation-function` | task-09-enable-test-secret-rotation | task-15-cloud-cleanup |
| AWS WAF | regional web ACL | `fa-kms-web-acl` | task-10-create-waf | task-15-cloud-cleanup |
| Amazon GuardDuty | regional detector | `generated detector ID in eu-west-2 tagged TrainingPrefix=fa-kms when created by CLI` | task-12-enable-guardduty | task-15-cloud-cleanup |

# Phase 1: Prepare the secure training account

Verify tools, bootstrap a temporary IAM identity and create a known-good CLI profile.

## task-01-prerequisites — Verify the training account, Region and local tools

- **Feature:** Account safety and prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm a disposable personal training account, eu-west-2, AWS CLI v2 and root-account safety before creating anything.
- **Why it matters:** Security labs can change account-wide controls, so a clean training account and known Region prevent accidental changes to unrelated resources.
- **Exam relevance:** SAA-C03 Domain 1 covers secure workloads, security services, encryption and key management.
- **Prerequisites:** None
- **Sources:** src-saa-domain1, src-saa-inscope, src-root-best, src-cli-profile

### Task warnings

- Do not create root access keys. Root is used only for the IAM bootstrap and final training-user removal.

### Console / browser route

- [ ] **task-01-prerequisites-browser-01** — Sign in to the disposable AWS training account as the root user only long enough to confirm the account is the intended lab account.
- [ ] **task-01-prerequisites-browser-02** — Open the account menu and confirm the account ID is the personal training account you intend to use.
- [ ] **task-01-prerequisites-browser-03** — Confirm MFA is enabled for the root user. If it is not, secure the root user before continuing.
- [ ] **task-01-prerequisites-browser-04** — Use the Region selector and choose Europe (London), eu-west-2.
- [ ] **task-01-prerequisites-browser-05** — Do not create any KMS, WAF, GuardDuty, Secrets Manager or Lambda resource yet.

### CLI / local route

#### task-01-prerequisites-cli-01 — Verify local AWS CLI installation

```text
aws --version
```

**Note:** No root credentials are required for this command.

### Expected results

- The intended disposable training account is identified.
- The working Region is eu-west-2.
- AWS CLI v2 is installed locally.
- No root access key exists or is created.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — Root MFA is enabled.
- [ ] **task-01-prerequisites-verify-02** — The Region selector shows Europe (London) eu-west-2.
- [ ] **task-01-prerequisites-verify-03** — aws --version returns an AWS CLI version.

### Troubleshooting

- **AWS CLI is not found** — Install AWS CLI v2 from the official AWS CLI documentation, reopen PowerShell, and rerun aws --version.

---

## task-02-iam-bootstrap — Create the dedicated fa-kms IAM training user and permissions

- **Feature:** IAM bootstrap
- **Difficulty:** Medium
- **Goal:** Use root only to create fa-kms-admin, attach one lab-specific customer managed policy, give it Console access, then sign out of root.
- **Why it matters:** Normal lab work should not run as root, and the permissions should be limited to the services and fa-kms IAM/Lambda resources used by this Follow Along.
- **Exam relevance:** IAM least privilege and separating root from normal administration are core secure-access design principles.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-root-best, src-iam-best, src-saa-domain1

### Task warnings

- The policy can create IAM roles for fa-kms Lambda only; iam:PassRole is restricted to fa-kms-* roles. Never broaden it to iam:* on all resources.

### Console / browser route

- [ ] **task-02-iam-bootstrap-browser-01** — While signed in as root, open IAM > Policies > Create policy.
- [ ] **task-02-iam-bootstrap-browser-02** — Choose JSON and replace the editor contents with the complete fa-kms-admin-policy.json block supplied in this task.
- [ ] **task-02-iam-bootstrap-browser-03** — Choose Next, name the policy fa-kms-admin-policy, add description Temporary permissions for the fa-kms Security and KMS Follow Along, then create the policy.
- [ ] **task-02-iam-bootstrap-browser-04** — Open IAM > Users > Create user.
- [ ] **task-02-iam-bootstrap-browser-05** — User name: fa-kms-admin.
- [ ] **task-02-iam-bootstrap-browser-06** — Enable AWS Management Console access for this IAM user. Use an autogenerated or strong temporary password and record it outside the lab files.
- [ ] **task-02-iam-bootstrap-browser-07** — On permissions, choose Attach policies directly and select only fa-kms-admin-policy.
- [ ] **task-02-iam-bootstrap-browser-08** — Create the user.
- [ ] **task-02-iam-bootstrap-browser-09** — Open the user and verify the Permissions tab lists fa-kms-admin-policy.
- [ ] **task-02-iam-bootstrap-browser-10** — Copy the IAM sign-in URL for the account.
- [ ] **task-02-iam-bootstrap-browser-11** — Sign out of root completely.
- [ ] **task-02-iam-bootstrap-browser-12** — Sign in through the IAM-user sign-in URL as fa-kms-admin and confirm the console opens.
- [ ] **task-02-iam-bootstrap-browser-13** — Keep the console Region set to eu-west-2.

### Supplied configuration

#### fa-kms-admin-policy.json — fa-kms-admin-policy.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VerifyIdentity",
      "Effect": "Allow",
      "Action": "sts:GetCallerIdentity",
      "Resource": "*"
    },
    {
      "Sid": "ManageOwnTrainingAccessKey",
      "Effect": "Allow",
      "Action": [
        "iam:GetUser",
        "iam:CreateAccessKey",
        "iam:ListAccessKeys",
        "iam:DeleteAccessKey"
      ],
      "Resource": "arn:aws:iam::*:user/fa-kms-admin"
    },
    {
      "Sid": "ReadIamForConsole",
      "Effect": "Allow",
      "Action": [
        "iam:ListRoles",
        "iam:ListPolicies",
        "iam:GetPolicy",
        "iam:GetPolicyVersion"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyFaKmsLambdaRole",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:TagRole",
        "iam:PutRolePolicy",
        "iam:GetRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:ListRolePolicies",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:ListAttachedRolePolicies",
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::*:role/fa-kms-*"
    },
    {
      "Sid": "ManageTrainingKms",
      "Effect": "Allow",
      "Action": [
        "kms:CreateKey",
        "kms:CreateAlias",
        "kms:DeleteAlias",
        "kms:DescribeKey",
        "kms:GetKeyPolicy",
        "kms:ListAliases",
        "kms:ListKeys",
        "kms:ListResourceTags",
        "kms:TagResource",
        "kms:UntagResource",
        "kms:EnableKeyRotation",
        "kms:DisableKeyRotation",
        "kms:GetKeyRotationStatus",
        "kms:PutKeyPolicy",
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey",
        "kms:ScheduleKeyDeletion",
        "kms:CancelKeyDeletion"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingSecrets",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:CreateSecret",
        "secretsmanager:DescribeSecret",
        "secretsmanager:GetSecretValue",
        "secretsmanager:PutSecretValue",
        "secretsmanager:UpdateSecret",
        "secretsmanager:UpdateSecretVersionStage",
        "secretsmanager:RotateSecret",
        "secretsmanager:DeleteSecret",
        "secretsmanager:RestoreSecret",
        "secretsmanager:TagResource"
      ],
      "Resource": "arn:aws:secretsmanager:eu-west-2:*:secret:fa-kms-*"
    },
    {
      "Sid": "SecretsManagerListAndRandomPassword",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:ListSecrets",
        "secretsmanager:GetRandomPassword"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingLambda",
      "Effect": "Allow",
      "Action": [
        "lambda:CreateFunction",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration",
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:AddPermission",
        "lambda:RemovePermission",
        "lambda:GetPolicy",
        "lambda:InvokeFunction",
        "lambda:DeleteFunction"
      ],
      "Resource": "arn:aws:lambda:eu-west-2:*:function:fa-kms-*"
    },
    {
      "Sid": "ListLambda",
      "Effect": "Allow",
      "Action": "lambda:ListFunctions",
      "Resource": "*"
    },
    {
      "Sid": "ManageRegionalWafLab",
      "Effect": "Allow",
      "Action": "wafv2:*",
      "Resource": "*"
    },
    {
      "Sid": "ManageGuardDutyLabDetector",
      "Effect": "Allow",
      "Action": "guardduty:*",
      "Resource": "*"
    },
    {
      "Sid": "InspectAndDeleteTrainingLambdaLogs",
      "Effect": "Allow",
      "Action": [
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:GetLogEvents",
        "logs:DeleteLogGroup"
      ],
      "Resource": "*"
    }
  ]
}
```

### CLI / local route

#### task-02-iam-bootstrap-cli-01 — Later verification command - do not run with root credentials

```text
aws iam get-user --user-name fa-kms-admin --profile fa-kms-admin
aws iam list-attached-user-policies --user-name fa-kms-admin --profile fa-kms-admin
```

**Note:** Run these only after Task 3 creates the fa-kms-admin CLI profile. A CLI creation route is intentionally not provided because it would require programmatic root credentials.

### Expected results

- IAM user fa-kms-admin exists with Console access.
- Customer managed policy fa-kms-admin-policy is attached.
- Root is signed out before normal lab work begins.

### Verification checks

- [ ] **task-02-iam-bootstrap-verify-01** — The Console identity is fa-kms-admin, not root.
- [ ] **task-02-iam-bootstrap-verify-02** — fa-kms-admin has exactly the intended lab policy attached.
- [ ] **task-02-iam-bootstrap-verify-03** — No root access key was created.

### Troubleshooting

- **Policy validation reports an action error** — Compare the JSON with the supplied block exactly and ensure no service action name was edited.
- **IAM user cannot sign in** — Return to root only long enough to reset the fa-kms-admin console password or login profile, then sign out root again.

---

## task-03-cli-profile — Create and verify the fa-kms-admin AWS CLI profile

- **Feature:** AWS CLI authentication
- **Difficulty:** Easy
- **Goal:** Create one temporary IAM-user access key, configure the named fa-kms-admin profile and create the dedicated local lab folder.
- **Why it matters:** A named profile prevents commands from silently using another account or identity and keeps all helper files inside one removable training folder.
- **Exam relevance:** Operational verification of identity and Region supports safe security administration.
- **Prerequisites:** task-02-iam-bootstrap
- **Sources:** src-cli-profile, src-iam-best

### Task warnings

- Never paste the secret access key into chat, source control, JSON policies, scripts or the Follow Along files.

### Console / browser route

- [ ] **task-03-cli-profile-browser-01** — As fa-kms-admin, open IAM > Users > fa-kms-admin > Security credentials.
- [ ] **task-03-cli-profile-browser-02** — Under Access keys choose Create access key.
- [ ] **task-03-cli-profile-browser-03** — Choose Command Line Interface (CLI) as the use case, acknowledge the recommendation notice, and continue.
- [ ] **task-03-cli-profile-browser-04** — Create the access key and keep the access key ID and secret access key visible only long enough to enter them into aws configure.
- [ ] **task-03-cli-profile-browser-05** — Do not download or store the key inside C:\aws-labs\fa-kms.

### CLI / local route

#### task-03-cli-profile-cli-01 — Configure and verify the profile

```text
aws configure --profile fa-kms-admin
# Enter the temporary IAM-user access key when prompted.
# Default region name: eu-west-2
# Default output format: json

aws sts get-caller-identity --profile fa-kms-admin
aws configure get region --profile fa-kms-admin

New-Item -ItemType Directory -Path C:\aws-labs\fa-kms -Force | Out-Null
Set-Location C:\aws-labs\fa-kms
Get-Location
```

### Expected results

- get-caller-identity identifies the fa-kms-admin IAM user in the intended account.
- The named profile region is eu-west-2.
- C:\aws-labs\fa-kms exists and is the working directory.

### Verification checks

- [ ] **task-03-cli-profile-verify-01** — The returned ARN contains user/fa-kms-admin.
- [ ] **task-03-cli-profile-verify-02** — aws configure get region prints eu-west-2.
- [ ] **task-03-cli-profile-verify-03** — The current PowerShell path is C:\aws-labs\fa-kms.

### Troubleshooting

- **InvalidClientTokenId or SignatureDoesNotMatch** — Delete the bad access key in IAM, create a new fa-kms-admin key, rerun aws configure --profile fa-kms-admin, and retest STS.

---

# Phase 2: Build and manage the customer managed KMS key

Create the key, alias, policy access path and automatic rotation configuration.

## task-04-create-kms-key — Create the customer managed KMS key and alias

- **Feature:** AWS KMS customer managed key
- **Difficulty:** Medium
- **Goal:** Create one symmetric encryption customer managed KMS key named by alias alias/fa-kms-security-key in eu-west-2.
- **Why it matters:** A customer managed key gives you control over its policy, lifecycle, aliases and rotation rather than relying only on an AWS managed key.
- **Exam relevance:** SAA-C03 expects you to choose KMS for encryption at rest and understand customer managed key control and key policies.
- **Prerequisites:** task-03-cli-profile
- **Sources:** src-kms-create, src-kms-alias, src-kms-policy, src-saa-domain1

### Task warnings

- KMS customer managed keys can incur monthly and request charges while active.

### Console / browser route

- [ ] **task-04-create-kms-key-browser-01** — Open AWS KMS in eu-west-2.
- [ ] **task-04-create-kms-key-browser-02** — Choose Customer managed keys > Create key.
- [ ] **task-04-create-kms-key-browser-03** — Key type: Symmetric.
- [ ] **task-04-create-kms-key-browser-04** — Key usage: Encrypt and decrypt.
- [ ] **task-04-create-kms-key-browser-05** — Key material origin: KMS.
- [ ] **task-04-create-kms-key-browser-06** — Choose Next.
- [ ] **task-04-create-kms-key-browser-07** — Alias: fa-kms-security-key. The console automatically displays it as alias/fa-kms-security-key.
- [ ] **task-04-create-kms-key-browser-08** — Description: Security & KMS Follow Along training key.
- [ ] **task-04-create-kms-key-browser-09** — Add tag TrainingPrefix = fa-kms.
- [ ] **task-04-create-kms-key-browser-10** — Choose Next.
- [ ] **task-04-create-kms-key-browser-11** — For key administrators choose fa-kms-admin.
- [ ] **task-04-create-kms-key-browser-12** — Keep the option that allows selected key administrators to delete the key enabled for this disposable lab.
- [ ] **task-04-create-kms-key-browser-13** — Choose Next.
- [ ] **task-04-create-kms-key-browser-14** — For key users choose fa-kms-admin.
- [ ] **task-04-create-kms-key-browser-15** — Review the generated key policy, then finish key creation.
- [ ] **task-04-create-kms-key-browser-16** — Open the new key and record its Key ID in your notes; do not treat the key ID as secret.

### CLI / local route

#### task-04-create-kms-key-cli-01 — CLI alternative - use instead of Console creation, not as well as it

```text
$KeyId = aws kms create-key --description "Security & KMS Follow Along training key" --key-usage ENCRYPT_DECRYPT --origin AWS_KMS --tags TagKey=TrainingPrefix,TagValue=fa-kms --region eu-west-2 --profile fa-kms-admin --query "KeyMetadata.KeyId" --output text
aws kms create-alias --alias-name alias/fa-kms-security-key --target-key-id $KeyId --region eu-west-2 --profile fa-kms-admin
aws kms describe-key --key-id alias/fa-kms-security-key --region eu-west-2 --profile fa-kms-admin
aws kms list-aliases --region eu-west-2 --profile fa-kms-admin --query "Aliases[?AliasName=='alias/fa-kms-security-key']"
```

### Expected results

- One enabled symmetric customer managed KMS key exists in eu-west-2.
- alias/fa-kms-security-key resolves to that key.
- The key is tagged TrainingPrefix=fa-kms.

### Verification checks

- [ ] **task-04-create-kms-key-verify-01** — Key state is Enabled.
- [ ] **task-04-create-kms-key-verify-02** — Key usage is ENCRYPT_DECRYPT and key spec is SYMMETRIC_DEFAULT.
- [ ] **task-04-create-kms-key-verify-03** — The alias is exactly alias/fa-kms-security-key.

### Troubleshooting

- **AccessDenied on CreateKey or CreateAlias** — Confirm fa-kms-admin-policy is attached and the Console/CLI identity is fa-kms-admin.
- **Alias already exists** — Stop and confirm it is an exact resource from this lab. Do not reuse an unrelated alias.

---

## task-05-kms-policy-rotation — Inspect the key policy and enable automatic key rotation

- **Feature:** KMS policy and rotation
- **Difficulty:** Medium
- **Goal:** Review how the key policy authorizes account/IAM use, then enable 365-day automatic key material rotation.
- **Why it matters:** KMS permissions depend on key policy as well as IAM, and key rotation changes cryptographic material without changing the key ID or alias.
- **Exam relevance:** Key policy versus IAM policy and transparent KMS key rotation are common encryption design concepts.
- **Prerequisites:** task-04-create-kms-key
- **Sources:** src-kms-policy, src-kms-rotation, src-saa-domain1

### Task warnings

- Do not use the bypass lockout safety option when editing a key policy.

### Console / browser route

- [ ] **task-05-kms-policy-rotation-browser-01** — Open KMS > Customer managed keys > alias/fa-kms-security-key.
- [ ] **task-05-kms-policy-rotation-browser-02** — Open the Key policy tab.
- [ ] **task-05-kms-policy-rotation-browser-03** — Identify the statement that permits the AWS account to use IAM policies for key access and the statements that identify the selected key administrator/key user.
- [ ] **task-05-kms-policy-rotation-browser-04** — Do not remove the account-management statement or lock yourself out.
- [ ] **task-05-kms-policy-rotation-browser-05** — Open the Key rotation tab.
- [ ] **task-05-kms-policy-rotation-browser-06** — Enable automatic key rotation.
- [ ] **task-05-kms-policy-rotation-browser-07** — Set the rotation period to 365 days and save.
- [ ] **task-05-kms-policy-rotation-browser-08** — Confirm the key details still show the same key ID and alias.

### CLI / local route

#### task-05-kms-policy-rotation-cli-01 — Inspect policy and enable rotation

```text
aws kms get-key-policy --key-id alias/fa-kms-security-key --policy-name default --region eu-west-2 --profile fa-kms-admin
aws kms enable-key-rotation --key-id alias/fa-kms-security-key --rotation-period-in-days 365 --region eu-west-2 --profile fa-kms-admin
aws kms get-key-rotation-status --key-id alias/fa-kms-security-key --region eu-west-2 --profile fa-kms-admin
```

### Expected results

- The default key policy is visible and remains manageable.
- KeyRotationEnabled is true.
- RotationPeriodInDays is 365.
- The key ID and alias are unchanged.

### Verification checks

- [ ] **task-05-kms-policy-rotation-verify-01** — Automatic rotation is enabled.
- [ ] **task-05-kms-policy-rotation-verify-02** — The period is 365 days.
- [ ] **task-05-kms-policy-rotation-verify-03** — The key policy still allows authorized account administration.

### Troubleshooting

- **EnableKeyRotation is denied** — Confirm the key policy and fa-kms-admin IAM policy both allow the required management operation.

---

# Phase 3: Encrypt and rotate a Secrets Manager secret

Store a training secret under the KMS key and implement a custom Lambda rotation workflow.

## task-06-create-secret — Create the KMS-encrypted Secrets Manager training secret

- **Feature:** AWS Secrets Manager with customer managed KMS key
- **Difficulty:** Medium
- **Goal:** Create fa-kms-rotating-demo-secret using alias/fa-kms-security-key and a harmless training-only username/password value.
- **Why it matters:** Secrets Manager stores sensitive configuration separately from application code and can encrypt it with a customer managed KMS key.
- **Exam relevance:** SAA-C03 expects Secrets Manager for protected secret storage and rotation, with KMS controlling encryption at rest.
- **Prerequisites:** task-05-kms-policy-rotation
- **Sources:** src-secret-create, src-secret-encryption, src-kms-create, src-saa-domain1

### Task warnings

- The value is fake training data. Never replace it with a real password or production secret.

### Console / browser route

- [ ] **task-06-create-secret-browser-01** — Open Secrets Manager in eu-west-2.
- [ ] **task-06-create-secret-browser-02** — Choose Store a new secret.
- [ ] **task-06-create-secret-browser-03** — Secret type: Other type of secret.
- [ ] **task-06-create-secret-browser-04** — Add key/value pair username = training-user.
- [ ] **task-06-create-secret-browser-05** — Add key/value pair password = training-secret-v1.
- [ ] **task-06-create-secret-browser-06** — Under Encryption key choose alias/fa-kms-security-key.
- [ ] **task-06-create-secret-browser-07** — Choose Next.
- [ ] **task-06-create-secret-browser-08** — Secret name: fa-kms-rotating-demo-secret.
- [ ] **task-06-create-secret-browser-09** — Description: Training-only rotating secret for Security & KMS Follow Along.
- [ ] **task-06-create-secret-browser-10** — Add tag TrainingPrefix = fa-kms.
- [ ] **task-06-create-secret-browser-11** — Choose Next.
- [ ] **task-06-create-secret-browser-12** — Leave automatic rotation disabled for now; it is configured after the Lambda function exists.
- [ ] **task-06-create-secret-browser-13** — Finish storing the secret.
- [ ] **task-06-create-secret-browser-14** — Open the secret details and confirm the Encryption key points to the fa-kms KMS key.

### Supplied configuration

#### fa-kms-initial-secret.json — fa-kms-initial-secret.json

```json
{
  "username": "training-user",
  "password": "training-secret-v1"
}
```

### CLI / local route

#### task-06-create-secret-cli-01 — Create the secret from a local JSON file

```text
Set-Location C:\aws-labs\fa-kms
@'
{
  "username": "training-user",
  "password": "training-secret-v1"
}
'@ | Set-Content -Encoding utf8 .\fa-kms-initial-secret.json

aws secretsmanager create-secret --name fa-kms-rotating-demo-secret --description "Training-only rotating secret for Security & KMS Follow Along" --kms-key-id alias/fa-kms-security-key --secret-string file://fa-kms-initial-secret.json --tags Key=TrainingPrefix,Value=fa-kms --region eu-west-2 --profile fa-kms-admin
aws secretsmanager describe-secret --secret-id fa-kms-rotating-demo-secret --region eu-west-2 --profile fa-kms-admin
```

### Expected results

- fa-kms-rotating-demo-secret exists in eu-west-2.
- Its KmsKeyId identifies the customer managed fa-kms key.
- Rotation is not yet enabled.

### Verification checks

- [ ] **task-06-create-secret-verify-01** — Secret name is exactly fa-kms-rotating-demo-secret.
- [ ] **task-06-create-secret-verify-02** — Encryption key is the customer managed fa-kms key.
- [ ] **task-06-create-secret-verify-03** — RotationEnabled is false before the Lambda rotation setup.

### Troubleshooting

- **Secrets Manager cannot use the KMS key** — Confirm the key is Enabled and fa-kms-admin is authorized by both the KMS key policy and IAM policy.

---

## task-07-rotation-role-code — Create the rotation Lambda role and complete rotation code

- **Feature:** Secrets Manager rotation permissions
- **Difficulty:** Hard
- **Goal:** Create fa-kms-rotation-role with limited secret/KMS access and prepare the full Python rotation function.
- **Why it matters:** A rotation Lambda is privileged: it must access only the intended secret and KMS key and must implement the four Secrets Manager rotation stages.
- **Exam relevance:** The exam focuses on using managed secret rotation and least privilege rather than hard-coded credentials.
- **Prerequisites:** task-06-create-secret
- **Sources:** src-secret-rotation, src-secret-rotation-steps, src-secret-rotation-perms, src-lambda-role

### Task warnings

- This lab's setSecret and testSecret steps validate a standalone training secret only. Production rotation must update and authenticate against the real target database or service.
- Never log secret values from a rotation function.

### Console / browser route

- [ ] **task-07-rotation-role-code-browser-01** — Open IAM > Roles > Create role.
- [ ] **task-07-rotation-role-code-browser-02** — Trusted entity type: AWS service.
- [ ] **task-07-rotation-role-code-browser-03** — Use case: Lambda.
- [ ] **task-07-rotation-role-code-browser-04** — Attach AWSLambdaBasicExecutionRole so the function can write operational logs.
- [ ] **task-07-rotation-role-code-browser-05** — Role name: fa-kms-rotation-role.
- [ ] **task-07-rotation-role-code-browser-06** — Create the role.
- [ ] **task-07-rotation-role-code-browser-07** — Open fa-kms-rotation-role > Permissions > Add permissions > Create inline policy.
- [ ] **task-07-rotation-role-code-browser-08** — Choose JSON and paste the complete fa-kms-rotation-role-policy.json block.
- [ ] **task-07-rotation-role-code-browser-09** — Name the inline policy fa-kms-rotation-role-policy and create it.
- [ ] **task-07-rotation-role-code-browser-10** — Confirm the role has AWSLambdaBasicExecutionRole plus fa-kms-rotation-role-policy and no AdministratorAccess.

### Supplied configuration

#### fa-kms-lambda-trust.json — fa-kms-lambda-trust.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### fa-kms-rotation-role-policy.json — fa-kms-rotation-role-policy.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RotateOnlyFaKmsSecret",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:DescribeSecret",
        "secretsmanager:GetSecretValue",
        "secretsmanager:PutSecretValue",
        "secretsmanager:UpdateSecretVersionStage"
      ],
      "Resource": "arn:aws:secretsmanager:eu-west-2:*:secret:fa-kms-rotating-demo-secret-*"
    },
    {
      "Sid": "GenerateTrainingPassword",
      "Effect": "Allow",
      "Action": "secretsmanager:GetRandomPassword",
      "Resource": "*"
    },
    {
      "Sid": "UseOnlyAliasedTrainingKmsKey",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:Encrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "arn:aws:kms:eu-west-2:*:key/*",
      "Condition": {
        "ForAnyValue:StringLike": {
          "kms:ResourceAliases": "alias/fa-kms-security-key"
        }
      }
    }
  ]
}
```

#### lambda_function.py — lambda_function.py

```text
import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)
client = boto3.client("secretsmanager")

def lambda_handler(event, context):
    secret_id = event["SecretId"]
    token = event["ClientRequestToken"]
    step = event["Step"]

    metadata = client.describe_secret(SecretId=secret_id)
    if not metadata.get("RotationEnabled"):
        raise ValueError("Rotation is not enabled for this secret.")

    versions = metadata.get("VersionIdsToStages", {})
    if token not in versions:
        raise ValueError("Rotation token has no staged secret version.")
    if "AWSCURRENT" in versions[token]:
        logger.info("Rotation token is already AWSCURRENT.")
        return
    if "AWSPENDING" not in versions[token]:
        raise ValueError("Rotation token is not staged as AWSPENDING.")

    if step == "createSecret":
        create_secret(secret_id, token)
    elif step == "setSecret":
        set_secret(secret_id, token)
    elif step == "testSecret":
        test_secret(secret_id, token)
    elif step == "finishSecret":
        finish_secret(secret_id, token)
    else:
        raise ValueError("Unsupported rotation step.")

def create_secret(secret_id, token):
    current = json.loads(
        client.get_secret_value(
            SecretId=secret_id,
            VersionStage="AWSCURRENT"
        )["SecretString"]
    )

    try:
        client.get_secret_value(
            SecretId=secret_id,
            VersionId=token,
            VersionStage="AWSPENDING"
        )
        logger.info("AWSPENDING version already exists.")
        return
    except client.exceptions.ResourceNotFoundException:
        pass

    new_password = client.get_random_password(
        PasswordLength=32,
        ExcludePunctuation=True
    )["RandomPassword"]

    pending = {
        "username": current["username"],
        "password": new_password
    }

    client.put_secret_value(
        SecretId=secret_id,
        ClientRequestToken=token,
        SecretString=json.dumps(pending),
        VersionStages=["AWSPENDING"]
    )
    logger.info("Created a new AWSPENDING version.")

def set_secret(secret_id, token):
    current = json.loads(
        client.get_secret_value(
            SecretId=secret_id,
            VersionStage="AWSCURRENT"
        )["SecretString"]
    )
    pending = json.loads(
        client.get_secret_value(
            SecretId=secret_id,
            VersionId=token,
            VersionStage="AWSPENDING"
        )["SecretString"]
    )

    if current.get("username") != pending.get("username"):
        raise ValueError("AWSCURRENT and AWSPENDING usernames differ.")

    # Training-only design:
    # There is no database or external credential store in this lab.
    # A production rotation function must update the real target service here.
    logger.info("Training setSecret validation completed.")

def test_secret(secret_id, token):
    pending = json.loads(
        client.get_secret_value(
            SecretId=secret_id,
            VersionId=token,
            VersionStage="AWSPENDING"
        )["SecretString"]
    )

    if pending.get("username") != "training-user":
        raise ValueError("Unexpected training username.")
    if len(pending.get("password", "")) < 20:
        raise ValueError("Generated password is shorter than expected.")

    # A production rotation function must authenticate to the target service here.
    logger.info("Training testSecret validation completed.")

def finish_secret(secret_id, token):
    metadata = client.describe_secret(SecretId=secret_id)
    current_version = None

    for version_id, stages in metadata["VersionIdsToStages"].items():
        if "AWSCURRENT" in stages:
            if version_id == token:
                logger.info("Token is already AWSCURRENT.")
                return
            current_version = version_id
            break

    if current_version is None:
        raise ValueError("No AWSCURRENT version was found.")

    client.update_secret_version_stage(
        SecretId=secret_id,
        VersionStage="AWSCURRENT",
        MoveToVersionId=token,
        RemoveFromVersionId=current_version
    )
    logger.info("Promoted AWSPENDING to AWSCURRENT.")

```

### CLI / local route

#### task-07-rotation-role-code-cli-01 — Create helper files and the rotation role

```text
Set-Location C:\aws-labs\fa-kms
# Save the supplied trust JSON as fa-kms-lambda-trust.json.
# Save the supplied permissions JSON as fa-kms-rotation-role-policy.json.
# Save the supplied Python as lambda_function.py.

aws iam create-role --role-name fa-kms-rotation-role --assume-role-policy-document file://fa-kms-lambda-trust.json --tags Key=TrainingPrefix,Value=fa-kms --profile fa-kms-admin
aws iam attach-role-policy --role-name fa-kms-rotation-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --profile fa-kms-admin
aws iam put-role-policy --role-name fa-kms-rotation-role --policy-name fa-kms-rotation-role-policy --policy-document file://fa-kms-rotation-role-policy.json --profile fa-kms-admin
aws iam get-role --role-name fa-kms-rotation-role --profile fa-kms-admin
aws iam list-attached-role-policies --role-name fa-kms-rotation-role --profile fa-kms-admin
aws iam list-role-policies --role-name fa-kms-rotation-role --profile fa-kms-admin
```

### Expected results

- fa-kms-rotation-role trusts only Lambda.
- The role has basic logging and the supplied narrow secret/KMS permissions.
- lambda_function.py implements createSecret, setSecret, testSecret and finishSecret.

### Verification checks

- [ ] **task-07-rotation-role-code-verify-01** — The role trust principal is lambda.amazonaws.com.
- [ ] **task-07-rotation-role-code-verify-02** — No AdministratorAccess policy is attached.
- [ ] **task-07-rotation-role-code-verify-03** — The inline policy secret ARN pattern is limited to fa-kms-rotating-demo-secret.
- [ ] **task-07-rotation-role-code-verify-04** — The KMS permission is constrained to alias/fa-kms-security-key.

### Troubleshooting

- **iam:PassRole warning appears in policy review** — Confirm fa-kms-admin-policy limits PassRole to arn:aws:iam::*:role/fa-kms-* and do not broaden it.

---

## task-08-create-rotation-lambda — Create the rotation Lambda and allow Secrets Manager to invoke it

- **Feature:** AWS Lambda rotation function
- **Difficulty:** Hard
- **Goal:** Deploy fa-kms-rotation-function, then add a resource-based permission limited to the training secret and account.
- **Why it matters:** Secrets Manager needs explicit permission to invoke the function, while the function separately needs an execution role for its outbound AWS API calls.
- **Exam relevance:** This separates identity-based execution-role permissions from Lambda resource-based invocation permissions.
- **Prerequisites:** task-07-rotation-role-code
- **Sources:** src-secret-rotation-setup, src-secret-rotation-perms, src-lambda-role

### Task warnings

- Do not place the training secret value in Lambda environment variables or source code.

### Console / browser route

- [ ] **task-08-create-rotation-lambda-browser-01** — Open Lambda in eu-west-2 > Create function > Author from scratch.
- [ ] **task-08-create-rotation-lambda-browser-02** — Function name: fa-kms-rotation-function.
- [ ] **task-08-create-rotation-lambda-browser-03** — Runtime: Python 3.12.
- [ ] **task-08-create-rotation-lambda-browser-04** — Architecture: x86_64.
- [ ] **task-08-create-rotation-lambda-browser-05** — Under Change default execution role choose Use an existing role and select fa-kms-rotation-role.
- [ ] **task-08-create-rotation-lambda-browser-06** — Create the function.
- [ ] **task-08-create-rotation-lambda-browser-07** — Replace the default source with the complete lambda_function.py supplied in Task 7 and choose Deploy.
- [ ] **task-08-create-rotation-lambda-browser-08** — Open Configuration > General configuration > Edit.
- [ ] **task-08-create-rotation-lambda-browser-09** — Set Timeout to 30 seconds and Memory to 128 MB, then save.
- [ ] **task-08-create-rotation-lambda-browser-10** — Do not add VPC networking for this lab; the function uses the regional public Secrets Manager endpoint.
- [ ] **task-08-create-rotation-lambda-browser-11** — The Secrets Manager invocation permission is added with the CLI command below because it allows the exact source ARN and source account to be shown clearly.

### CLI / local route

#### task-08-create-rotation-lambda-cli-01 — Package and deploy the function

```text
Set-Location C:\aws-labs\fa-kms
Compress-Archive -Path .\lambda_function.py -DestinationPath .\fa-kms-rotation-function.zip -Force
$RoleArn = aws iam get-role --role-name fa-kms-rotation-role --profile fa-kms-admin --query "Role.Arn" --output text
Start-Sleep -Seconds 10
aws lambda create-function --function-name fa-kms-rotation-function --runtime python3.12 --handler lambda_function.lambda_handler --role $RoleArn --zip-file fileb://fa-kms-rotation-function.zip --timeout 30 --memory-size 128 --region eu-west-2 --profile fa-kms-admin

$AccountId = aws sts get-caller-identity --profile fa-kms-admin --query Account --output text
$SecretArn = aws secretsmanager describe-secret --secret-id fa-kms-rotating-demo-secret --region eu-west-2 --profile fa-kms-admin --query ARN --output text
aws lambda add-permission --function-name fa-kms-rotation-function --statement-id AllowSecretsManagerInvokeFaKmsSecret --action lambda:InvokeFunction --principal secretsmanager.amazonaws.com --source-account $AccountId --source-arn $SecretArn --region eu-west-2 --profile fa-kms-admin
aws lambda get-function-configuration --function-name fa-kms-rotation-function --region eu-west-2 --profile fa-kms-admin
aws lambda get-policy --function-name fa-kms-rotation-function --region eu-west-2 --profile fa-kms-admin
```

### Expected results

- fa-kms-rotation-function is Active and uses fa-kms-rotation-role.
- The function timeout is 30 seconds.
- Its resource policy permits secretsmanager.amazonaws.com only for the lab secret/account condition.

### Verification checks

- [ ] **task-08-create-rotation-lambda-verify-01** — Function state is Active.
- [ ] **task-08-create-rotation-lambda-verify-02** — Role ARN ends with role/fa-kms-rotation-role.
- [ ] **task-08-create-rotation-lambda-verify-03** — Lambda resource policy includes AllowSecretsManagerInvokeFaKmsSecret.

### Troubleshooting

- **CreateFunction says the role cannot be assumed** — Wait for IAM propagation, confirm the trust principal is lambda.amazonaws.com, then retry.
- **add-permission reports ResourceConflictException** — Check get-policy. If the exact statement already exists, do not add a duplicate.

---

## task-09-enable-test-secret-rotation — Enable rotation, rotate immediately and inspect version stages

- **Feature:** Secrets Manager automatic rotation
- **Difficulty:** Hard
- **Goal:** Attach fa-kms-rotation-function to the secret, set a 30-day schedule, rotate immediately and verify AWSCURRENT/AWSPREVIOUS staging without printing the password.
- **Why it matters:** Secrets Manager rotation creates staged versions and promotes the tested pending value to AWSCURRENT; applications should retrieve the current secret rather than hard-code a value.
- **Exam relevance:** Automated rotation reduces long-lived credentials and is a key Secrets Manager design benefit.
- **Prerequisites:** task-08-create-rotation-lambda
- **Sources:** src-secret-rotation, src-secret-rotation-steps, src-secret-rotation-setup, src-secret-schedule

### Task warnings

- Do not use GetSecretValue to print the generated password. Verify rotation through metadata and version stages.

### Console / browser route

- [ ] **task-09-enable-test-secret-rotation-browser-01** — Open Secrets Manager > fa-kms-rotating-demo-secret > Rotation configuration > Edit rotation.
- [ ] **task-09-enable-test-secret-rotation-browser-02** — Enable Automatic rotation.
- [ ] **task-09-enable-test-secret-rotation-browser-03** — Rotation schedule: Schedule expression or interval equivalent to every 30 days.
- [ ] **task-09-enable-test-secret-rotation-browser-04** — Rotation function: fa-kms-rotation-function.
- [ ] **task-09-enable-test-secret-rotation-browser-05** — Choose Rotate immediately when the secret is stored/saved so this lab proves the workflow now.
- [ ] **task-09-enable-test-secret-rotation-browser-06** — Save the rotation configuration.
- [ ] **task-09-enable-test-secret-rotation-browser-07** — Wait until Last rotated date appears and no rotation error banner is present.
- [ ] **task-09-enable-test-secret-rotation-browser-08** — Open Versions and verify one version carries AWSCURRENT and an older version can carry AWSPREVIOUS.
- [ ] **task-09-enable-test-secret-rotation-browser-09** — Open Lambda > fa-kms-rotation-function > Monitor > View CloudWatch logs and confirm successful step messages without secret values.

### CLI / local route

#### task-09-enable-test-secret-rotation-cli-01 — Enable and verify rotation

```text
$RotationArn = aws lambda get-function --function-name fa-kms-rotation-function --region eu-west-2 --profile fa-kms-admin --query "Configuration.FunctionArn" --output text
aws secretsmanager rotate-secret --secret-id fa-kms-rotating-demo-secret --rotation-lambda-arn $RotationArn --rotation-rules AutomaticallyAfterDays=30 --rotate-immediately --region eu-west-2 --profile fa-kms-admin
Start-Sleep -Seconds 20
aws secretsmanager describe-secret --secret-id fa-kms-rotating-demo-secret --region eu-west-2 --profile fa-kms-admin --query "{Name:Name,RotationEnabled:RotationEnabled,RotationLambdaARN:RotationLambdaARN,LastRotatedDate:LastRotatedDate,VersionIdsToStages:VersionIdsToStages}"
aws logs describe-log-streams --log-group-name /aws/lambda/fa-kms-rotation-function --order-by LastEventTime --descending --max-items 5 --region eu-west-2 --profile fa-kms-admin
```

### Expected results

- RotationEnabled is true.
- RotationLambdaARN identifies fa-kms-rotation-function.
- LastRotatedDate is populated.
- A new AWSCURRENT version is present and the previous version is staged as AWSPREVIOUS.
- The function logs contain operational success messages but no secret values.

### Verification checks

- [ ] **task-09-enable-test-secret-rotation-verify-01** — Rotation is enabled on a 30-day interval.
- [ ] **task-09-enable-test-secret-rotation-verify-02** — The immediate rotation completed successfully.
- [ ] **task-09-enable-test-secret-rotation-verify-03** — AWSCURRENT moved to the newly rotated version.
- [ ] **task-09-enable-test-secret-rotation-verify-04** — No password value was printed during verification.

### Troubleshooting

- **Rotation fails with AccessDeniedException** — Inspect fa-kms-rotation-role-policy, the KMS alias condition, and the Lambda resource policy. Correct only the missing fa-kms permission and retry.
- **Rotation fails in setSecret or testSecret** — Open the Lambda logs and verify the complete training code was deployed. Do not log or print the secret value.

---

# Phase 4: Create and review AWS WAF protections

Build a regional web ACL with managed protections and rate limiting.

## task-10-create-waf — Create the regional WAF web ACL with two protection rules

- **Feature:** AWS WAF web ACL rules
- **Difficulty:** Medium
- **Goal:** Create fa-kms-web-acl with default Allow, an IP rate-based Block rule and AWSManagedRulesCommonRuleSet.
- **Why it matters:** WAF evaluates ordered Layer 7 rules before the default action, and managed rule groups reduce the amount of custom attack-pattern logic you must maintain.
- **Exam relevance:** SAA-C03 explicitly includes WAF as an application security control and expects you to distinguish it from network firewalls and DDoS services.
- **Prerequisites:** task-09-enable-test-secret-rotation
- **Sources:** src-waf-create, src-waf-rate, src-waf-managed, src-saa-domain1

### Task warnings

- AWS WAF web ACLs and rules can incur charges even when this training ACL is not associated with an application resource.

### Console / browser route

- [ ] **task-10-create-waf-browser-01** — Open AWS WAF & Shield in eu-west-2.
- [ ] **task-10-create-waf-browser-02** — Choose Web ACLs > Create web ACL.
- [ ] **task-10-create-waf-browser-03** — Name: fa-kms-web-acl.
- [ ] **task-10-create-waf-browser-04** — Resource type/Region: Regional resources, Europe (London) eu-west-2.
- [ ] **task-10-create-waf-browser-05** — Do not associate a production or unrelated resource. This lab intentionally proves the web ACL configuration without attaching it to an application.
- [ ] **task-10-create-waf-browser-06** — Default web ACL action: Allow.
- [ ] **task-10-create-waf-browser-07** — Add rule > Add my own rules and rule groups > Rule builder.
- [ ] **task-10-create-waf-browser-08** — Rule type: Rate-based rule.
- [ ] **task-10-create-waf-browser-09** — Name: fa-kms-rate-limit.
- [ ] **task-10-create-waf-browser-10** — Rate limit: 100 requests for the default five-minute evaluation window.
- [ ] **task-10-create-waf-browser-11** — Request aggregation: Source IP address.
- [ ] **task-10-create-waf-browser-12** — Action: Block.
- [ ] **task-10-create-waf-browser-13** — Add the rule.
- [ ] **task-10-create-waf-browser-14** — Add rules > Add managed rule groups > AWS managed rule groups.
- [ ] **task-10-create-waf-browser-15** — Add Core rule set (AWSManagedRulesCommonRuleSet).
- [ ] **task-10-create-waf-browser-16** — Keep its normal managed actions and name/reference it as fa-kms-common-rules where the console permits the rule reference name.
- [ ] **task-10-create-waf-browser-17** — Set priority so fa-kms-rate-limit is evaluated before the managed rule group.
- [ ] **task-10-create-waf-browser-18** — Enable sampled requests and CloudWatch metrics for the web ACL/rules.
- [ ] **task-10-create-waf-browser-19** — Create the web ACL.

### Supplied configuration

#### fa-kms-web-acl.json — fa-kms-web-acl.json

```json
{
  "Name": "fa-kms-web-acl",
  "Scope": "REGIONAL",
  "Description": "Training web ACL for the Security and KMS Follow Along",
  "DefaultAction": {
    "Allow": {}
  },
  "Rules": [
    {
      "Name": "fa-kms-rate-limit",
      "Priority": 0,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 100,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {
        "Block": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "fa-kms-rate-limit"
      }
    },
    {
      "Name": "fa-kms-common-rules",
      "Priority": 1,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet"
        }
      },
      "OverrideAction": {
        "None": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "fa-kms-common-rules"
      }
    }
  ],
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "fa-kms-web-acl"
  }
}
```

### CLI / local route

#### task-10-create-waf-cli-01 — Create the web ACL from complete JSON

```text
Set-Location C:\aws-labs\fa-kms
# Save the supplied JSON block as fa-kms-web-acl.json.
aws wafv2 create-web-acl --cli-input-json file://fa-kms-web-acl.json --region eu-west-2 --profile fa-kms-admin
aws wafv2 list-web-acls --scope REGIONAL --region eu-west-2 --profile fa-kms-admin --query "WebACLs[?Name=='fa-kms-web-acl']"
```

### Expected results

- fa-kms-web-acl exists with REGIONAL scope in eu-west-2.
- Default action is Allow.
- Priority 0 is fa-kms-rate-limit with Block action and IP aggregation.
- Priority 1 references AWSManagedRulesCommonRuleSet.
- CloudWatch metrics and sampled requests are enabled.

### Verification checks

- [ ] **task-10-create-waf-verify-01** — The web ACL scope is REGIONAL.
- [ ] **task-10-create-waf-verify-02** — Exactly the two intended rules are present.
- [ ] **task-10-create-waf-verify-03** — The rate limit is 100 and aggregate key type is IP.
- [ ] **task-10-create-waf-verify-04** — No application resource is associated with this training web ACL.

### Troubleshooting

- **WAF rejects the JSON** — Replace the local file with the complete supplied fa-kms-web-acl.json and retry without editing property names.
- **Managed rule group name is rejected** — Confirm VendorName is AWS and Name is AWSManagedRulesCommonRuleSet.

---

## task-11-review-waf — Review WAF rule order, visibility and rate-limit behavior

- **Feature:** WAF rule evaluation
- **Difficulty:** Medium
- **Goal:** Inspect the created web ACL and explain what would happen to requests as each rule and the default action are evaluated.
- **Why it matters:** Rule priority and terminating actions decide which controls can see a request; understanding this is more important than memorizing the console screens.
- **Exam relevance:** A solutions architect must choose appropriate request filtering and rate limiting at the application edge or regional web layer.
- **Prerequisites:** task-10-create-waf
- **Sources:** src-waf-create, src-waf-rate, src-waf-managed

### Task warnings

- Because the web ACL is deliberately unassociated, there are no real request samples or rate-limited IPs in this lab.

### Console / browser route

- [ ] **task-11-review-waf-browser-01** — Open WAF > Web ACLs > fa-kms-web-acl > Rules.
- [ ] **task-11-review-waf-browser-02** — Confirm fa-kms-rate-limit has the lower priority number and therefore runs first.
- [ ] **task-11-review-waf-browser-03** — Open the rate rule and confirm it groups request counts by source IP and blocks after the configured threshold.
- [ ] **task-11-review-waf-browser-04** — Open fa-kms-common-rules and identify that it is an AWS managed rule group rather than a hand-written pattern list.
- [ ] **task-11-review-waf-browser-05** — Open the Overview/Traffic sections and confirm metrics/sampled requests are enabled, while recognizing there will be no traffic because no resource is associated.
- [ ] **task-11-review-waf-browser-06** — Confirm the default action is Allow for requests that no rule blocks.

### CLI / local route

#### task-11-review-waf-cli-01 — Retrieve the complete web ACL

```text
$AclId = aws wafv2 list-web-acls --scope REGIONAL --region eu-west-2 --profile fa-kms-admin --query "WebACLs[?Name=='fa-kms-web-acl'].Id | [0]" --output text
aws wafv2 get-web-acl --name fa-kms-web-acl --scope REGIONAL --id $AclId --region eu-west-2 --profile fa-kms-admin --query "WebACL.{DefaultAction:DefaultAction,Rules:Rules,VisibilityConfig:VisibilityConfig}"
```

### Expected results

- The retrieved configuration shows priority 0 rate blocking followed by priority 1 common managed rules.
- The default action remains Allow.
- No protected resource association exists.

### Verification checks

- [ ] **task-11-review-waf-verify-01** — You can state that lower numeric priority is evaluated first.
- [ ] **task-11-review-waf-verify-02** — You can state that the rate rule tracks counts per source IP.
- [ ] **task-11-review-waf-verify-03** — You can distinguish managed rule groups from custom rules.

### Troubleshooting

- **get-web-acl requires an ID** — Run the list-web-acls command first and use the ID returned for fa-kms-web-acl.

---

# Phase 5: Enable GuardDuty and inspect threat findings

Enable one regional detector and safely generate sample finding data.

## task-12-enable-guardduty — Enable Amazon GuardDuty in eu-west-2

- **Feature:** GuardDuty threat detection
- **Difficulty:** Medium
- **Goal:** Create and enable one GuardDuty detector in eu-west-2 and record its generated detector ID.
- **Why it matters:** GuardDuty continuously analyzes supported AWS data sources and emits security findings without requiring you to deploy monitoring servers.
- **Exam relevance:** SAA-C03 Domain 1 names GuardDuty as a security service for threat detection use cases.
- **Prerequisites:** task-11-review-waf
- **Sources:** src-guardduty-start, src-saa-domain1, src-saa-inscope

### Task warnings

- GuardDuty can incur usage charges after any applicable trial. Keep this lab in eu-west-2 only and disable the detector during cleanup.

### Console / browser route

- [ ] **task-12-enable-guardduty-browser-01** — Open Amazon GuardDuty and confirm the Region is eu-west-2.
- [ ] **task-12-enable-guardduty-browser-02** — If GuardDuty is already enabled from unrelated work, stop rather than modifying that existing detector; this Follow Along assumes a clean training account.
- [ ] **task-12-enable-guardduty-browser-03** — Choose Get Started or Enable GuardDuty.
- [ ] **task-12-enable-guardduty-browser-04** — Review the enablement page and enable GuardDuty for this Region.
- [ ] **task-12-enable-guardduty-browser-05** — Do not opt into unrelated paid protection-plan experiments for this lab.
- [ ] **task-12-enable-guardduty-browser-06** — Open Settings and record the Detector ID shown for eu-west-2.
- [ ] **task-12-enable-guardduty-browser-07** — Open Summary and Findings and confirm the service is enabled even if no real findings exist.

### CLI / local route

#### task-12-enable-guardduty-cli-01 — CLI alternative - create and verify the detector

```text
$DetectorId = aws guardduty create-detector --enable --finding-publishing-frequency FIFTEEN_MINUTES --tags TrainingPrefix=fa-kms --region eu-west-2 --profile fa-kms-admin --query DetectorId --output text
$DetectorId
aws guardduty get-detector --detector-id $DetectorId --region eu-west-2 --profile fa-kms-admin
```

### Expected results

- One GuardDuty detector exists and is enabled in eu-west-2.
- A detector ID is available for later sample-finding and cleanup commands.

### Verification checks

- [ ] **task-12-enable-guardduty-verify-01** — Detector Status is ENABLED.
- [ ] **task-12-enable-guardduty-verify-02** — The detector is in eu-west-2 only for this lab.
- [ ] **task-12-enable-guardduty-verify-03** — The detector ID has been recorded.

### Troubleshooting

- **create-detector says GuardDuty is already enabled** — Do not create or alter a second detector. Confirm whether the existing detector belongs to this lab; if not, stop this task to avoid changing unrelated security monitoring.

---

## task-13-guardduty-sample — Generate and inspect a safe GuardDuty sample finding

- **Feature:** GuardDuty findings
- **Difficulty:** Medium
- **Goal:** Generate sample finding data without performing malicious activity, then inspect finding type, severity and affected resource fields.
- **Why it matters:** Sample findings let you learn the finding structure and test downstream handling without attacking or compromising a real resource.
- **Exam relevance:** GuardDuty findings identify suspicious activity; architects should know GuardDuty detects and reports rather than directly blocking every threat.
- **Prerequisites:** task-12-enable-guardduty
- **Sources:** src-guardduty-samples, src-guardduty-start

### Task warnings

- Use generated sample findings only; do not create real malicious traffic or attack simulations in this lab.

### Console / browser route

- [ ] **task-13-guardduty-sample-browser-01** — Open GuardDuty > Settings.
- [ ] **task-13-guardduty-sample-browser-02** — Find Sample findings and choose Generate sample findings.
- [ ] **task-13-guardduty-sample-browser-03** — Open Findings.
- [ ] **task-13-guardduty-sample-browser-04** — Filter or visually identify findings whose titles start with [SAMPLE].
- [ ] **task-13-guardduty-sample-browser-05** — Open one sample finding.
- [ ] **task-13-guardduty-sample-browser-06** — Review Severity, Finding type, Resource affected and Action/Actor details.
- [ ] **task-13-guardduty-sample-browser-07** — Confirm the record is clearly marked as a sample.
- [ ] **task-13-guardduty-sample-browser-08** — Do not treat the sample as a real incident.

### CLI / local route

#### task-13-guardduty-sample-cli-01 — Generate one documented sample finding and inspect it

```text
$DetectorId = aws guardduty list-detectors --region eu-west-2 --profile fa-kms-admin --query "DetectorIds[0]" --output text
aws guardduty create-sample-findings --detector-id $DetectorId --finding-types Backdoor:EC2/DenialOfService.Tcp --region eu-west-2 --profile fa-kms-admin
$FindingId = aws guardduty list-findings --detector-id $DetectorId --region eu-west-2 --profile fa-kms-admin --query "FindingIds[0]" --output text
aws guardduty get-findings --detector-id $DetectorId --finding-ids $FindingId --region eu-west-2 --profile fa-kms-admin --query "Findings[0].{Title:Title,Type:Type,Severity:Severity,Resource:Resource.ResourceType,Sample:Service.AdditionalInfo}"
```

### Expected results

- At least one [SAMPLE] finding appears.
- The finding has a type, severity and resource description.
- No real malicious workload was created.

### Verification checks

- [ ] **task-13-guardduty-sample-verify-01** — The inspected finding is explicitly a sample.
- [ ] **task-13-guardduty-sample-verify-02** — You can identify its severity and finding type.
- [ ] **task-13-guardduty-sample-verify-03** — You can explain that GuardDuty detects and reports suspicious behavior rather than acting as WAF.

### Troubleshooting

- **No sample appears immediately** — Refresh Findings after a short interval and confirm the detector is still ENABLED in eu-west-2.

---

# Phase 6: Review security choices and clean up

Consolidate SAA-C03 service boundaries and remove every training resource in reverse dependency order.

## task-14-exam-review — Review the security architecture and SAA-C03 decision points

- **Feature:** Integrated security design
- **Difficulty:** Medium
- **Goal:** Connect KMS, Secrets Manager, WAF and GuardDuty to the problem each service solves and identify common exam traps.
- **Why it matters:** The exam tests service selection and boundaries more often than button-by-button creation steps.
- **Exam relevance:** This task directly consolidates SAA-C03 Domain 1 secure architecture choices.
- **Prerequisites:** task-13-guardduty-sample
- **Sources:** src-saa-domain1, src-saa-inscope, src-kms-policy, src-kms-rotation, src-secret-rotation, src-waf-rate, src-guardduty-start

### Console / browser route

- [ ] **task-14-exam-review-browser-01** — Open KMS and confirm the customer managed key controls encryption and key lifecycle rather than storing the application secret itself.
- [ ] **task-14-exam-review-browser-02** — Open Secrets Manager and confirm the secret uses the fa-kms KMS key and has automatic rotation enabled.
- [ ] **task-14-exam-review-browser-03** — Open WAF and confirm it evaluates web request rules; it is not a replacement for IAM, security groups or GuardDuty.
- [ ] **task-14-exam-review-browser-04** — Open GuardDuty and confirm it produces threat findings; it is not a web request firewall.
- [ ] **task-14-exam-review-browser-05** — Review these exam distinctions: KMS manages encryption keys; Secrets Manager stores/rotates secrets; WAF filters supported Layer 7 web traffic; GuardDuty detects suspicious activity.
- [ ] **task-14-exam-review-browser-06** — Review the key-policy trap: an IAM Allow alone may not be enough if the KMS key policy does not permit the access path.
- [ ] **task-14-exam-review-browser-07** — Review the rotation trap: KMS key rotation changes backing key material transparently, while Secrets Manager rotation changes the secret value and often updates a target service.

### CLI / local route

#### task-14-exam-review-cli-01 — Run a final non-destructive inventory

```text
aws kms describe-key --key-id alias/fa-kms-security-key --region eu-west-2 --profile fa-kms-admin --query "KeyMetadata.{KeyId:KeyId,KeyState:KeyState,KeyManager:KeyManager}"
aws secretsmanager describe-secret --secret-id fa-kms-rotating-demo-secret --region eu-west-2 --profile fa-kms-admin --query "{Name:Name,RotationEnabled:RotationEnabled,KmsKeyId:KmsKeyId}"
aws wafv2 list-web-acls --scope REGIONAL --region eu-west-2 --profile fa-kms-admin --query "WebACLs[?Name=='fa-kms-web-acl']"
aws guardduty list-detectors --region eu-west-2 --profile fa-kms-admin
```

### Expected results

- All four service areas are present and their responsibilities can be explained correctly.
- The inventory shows only the intended fa-kms training resources plus the generated GuardDuty detector ID.

### Verification checks

- [ ] **task-14-exam-review-verify-01** — You can explain KMS versus Secrets Manager.
- [ ] **task-14-exam-review-verify-02** — You can explain WAF versus GuardDuty.
- [ ] **task-14-exam-review-verify-03** — You can explain KMS key-material rotation versus secret-value rotation.
- [ ] **task-14-exam-review-verify-04** — No cleanup has started yet.

---

## task-15-cloud-cleanup — Remove WAF, GuardDuty, Secrets Manager, Lambda and KMS resources safely

- **Feature:** Reverse-dependency cloud cleanup
- **Difficulty:** Hard
- **Goal:** Delete or schedule deletion of every cloud resource created by the lab, keeping the IAM training identity until cloud verification is complete.
- **Why it matters:** Security resources can continue to incur cost or retain sensitive configuration if cleanup stops early, and KMS keys require a waiting period before final deletion.
- **Exam relevance:** Safe lifecycle control and dependency-aware deletion are operational security practices.
- **Prerequisites:** task-14-exam-review
- **Sources:** src-guardduty-disable, src-secret-rotation-setup, src-kms-create, src-waf-create

### Task warnings

- These commands are destructive. Delete only exact fa-kms resources.
- The KMS key cannot be deleted immediately; schedule it for the minimum 7-day waiting period and verify PendingDeletion.

### Console / browser route

- [ ] **task-15-cloud-cleanup-browser-01** — WAF: open fa-kms-web-acl and confirm it has no associated resource, then delete exactly fa-kms-web-acl.
- [ ] **task-15-cloud-cleanup-browser-02** — GuardDuty: in eu-west-2 open Settings and disable GuardDuty for this Region. Understand that disabling removes the detector configuration and findings for the Region.
- [ ] **task-15-cloud-cleanup-browser-03** — Secrets Manager: open fa-kms-rotating-demo-secret and delete this fake training secret. Choose the lab's immediate/force-delete path only because the value is disposable and the name is exact.
- [ ] **task-15-cloud-cleanup-browser-04** — Lambda: delete fa-kms-rotation-function.
- [ ] **task-15-cloud-cleanup-browser-05** — CloudWatch Logs: delete /aws/lambda/fa-kms-rotation-function if the rotation invocation created it.
- [ ] **task-15-cloud-cleanup-browser-06** — IAM role: detach AWSLambdaBasicExecutionRole from fa-kms-rotation-role, delete inline policy fa-kms-rotation-role-policy, then delete fa-kms-rotation-role.
- [ ] **task-15-cloud-cleanup-browser-07** — KMS: open alias/fa-kms-security-key and note the Key ID before deleting the alias.
- [ ] **task-15-cloud-cleanup-browser-08** — Delete alias alias/fa-kms-security-key.
- [ ] **task-15-cloud-cleanup-browser-09** — Schedule the underlying customer managed KMS key for deletion with a 7-day waiting period.
- [ ] **task-15-cloud-cleanup-browser-10** — Verify the key state is Pending deletion/PendingDeletion and record the deletion date.
- [ ] **task-15-cloud-cleanup-browser-11** — Do not delete fa-kms-admin yet; it is needed for command-line verification.

### CLI / local route

#### task-15-cloud-cleanup-cli-01 — Delete cloud resources in safe order

```text
$AclId = aws wafv2 list-web-acls --scope REGIONAL --region eu-west-2 --profile fa-kms-admin --query "WebACLs[?Name=='fa-kms-web-acl'].Id | [0]" --output text
$LockToken = aws wafv2 get-web-acl --name fa-kms-web-acl --scope REGIONAL --id $AclId --region eu-west-2 --profile fa-kms-admin --query LockToken --output text
aws wafv2 delete-web-acl --name fa-kms-web-acl --scope REGIONAL --id $AclId --lock-token $LockToken --region eu-west-2 --profile fa-kms-admin

$DetectorId = aws guardduty list-detectors --region eu-west-2 --profile fa-kms-admin --query "DetectorIds[0]" --output text
aws guardduty delete-detector --detector-id $DetectorId --region eu-west-2 --profile fa-kms-admin

aws secretsmanager delete-secret --secret-id fa-kms-rotating-demo-secret --force-delete-without-recovery --region eu-west-2 --profile fa-kms-admin

aws lambda delete-function --function-name fa-kms-rotation-function --region eu-west-2 --profile fa-kms-admin
aws logs delete-log-group --log-group-name /aws/lambda/fa-kms-rotation-function --region eu-west-2 --profile fa-kms-admin

aws iam detach-role-policy --role-name fa-kms-rotation-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --profile fa-kms-admin
aws iam delete-role-policy --role-name fa-kms-rotation-role --policy-name fa-kms-rotation-role-policy --profile fa-kms-admin
aws iam delete-role --role-name fa-kms-rotation-role --profile fa-kms-admin

$KeyId = aws kms describe-key --key-id alias/fa-kms-security-key --region eu-west-2 --profile fa-kms-admin --query "KeyMetadata.KeyId" --output text
aws kms delete-alias --alias-name alias/fa-kms-security-key --region eu-west-2 --profile fa-kms-admin
aws kms schedule-key-deletion --key-id $KeyId --pending-window-in-days 7 --region eu-west-2 --profile fa-kms-admin
aws kms describe-key --key-id $KeyId --region eu-west-2 --profile fa-kms-admin --query "KeyMetadata.{KeyId:KeyId,KeyState:KeyState,DeletionDate:DeletionDate}"
```

#### task-15-cloud-cleanup-cli-02 — Verify cloud resources are removed or pending deletion

```text
aws wafv2 list-web-acls --scope REGIONAL --region eu-west-2 --profile fa-kms-admin --query "WebACLs[?Name=='fa-kms-web-acl']"
aws guardduty list-detectors --region eu-west-2 --profile fa-kms-admin
aws secretsmanager describe-secret --secret-id fa-kms-rotating-demo-secret --region eu-west-2 --profile fa-kms-admin
aws lambda get-function --function-name fa-kms-rotation-function --region eu-west-2 --profile fa-kms-admin
aws iam get-role --role-name fa-kms-rotation-role --profile fa-kms-admin
```

**Note:** Expected: WAF list is empty for the named ACL; GuardDuty list is empty; Secrets Manager reports scheduled deletion/not found; Lambda and IAM role return ResourceNotFound/NoSuchEntity; KMS reports PendingDeletion by Key ID.

### Expected results

- fa-kms-web-acl is deleted.
- GuardDuty detector is deleted/disabled in eu-west-2.
- fa-kms-rotating-demo-secret is force-deleted/scheduled for asynchronous immediate deletion.
- fa-kms-rotation-function and its log group are absent.
- fa-kms-rotation-role is absent.
- alias/fa-kms-security-key is absent.
- The underlying KMS key is PendingDeletion with a 7-day waiting period.

### Verification checks

- [ ] **task-15-cloud-cleanup-verify-01** — No fa-kms WAF web ACL remains.
- [ ] **task-15-cloud-cleanup-verify-02** — No GuardDuty detector remains in eu-west-2 from this lab.
- [ ] **task-15-cloud-cleanup-verify-03** — The training secret cannot be used.
- [ ] **task-15-cloud-cleanup-verify-04** — The Lambda function and role are absent.
- [ ] **task-15-cloud-cleanup-verify-05** — The KMS alias is absent and the key is PendingDeletion.

### Troubleshooting

- **WAF deletion reports a stale lock token** — Run get-web-acl again to obtain the latest LockToken and retry the exact delete.
- **KMS key cannot be scheduled for deletion** — Confirm the secret and alias are removed, the key is Enabled, and you are targeting the exact Key ID recorded from alias/fa-kms-security-key.
- **CloudWatch log group does not exist** — That is acceptable if no log group was created; continue only after confirming the Lambda function itself is deleted.

---

## task-16-identity-local-cleanup — Remove the training access key, IAM user, policy, CLI profile and local files

- **Feature:** Final identity and local cleanup
- **Difficulty:** Medium
- **Goal:** Remove temporary credentials only after cloud cleanup is verified, then delete the exact local lab folder and acknowledge completion.
- **Why it matters:** Deleting credentials too early can strand chargeable resources, while leaving credentials after the lab creates unnecessary account risk.
- **Exam relevance:** Credential lifecycle and least privilege include removing temporary access after use.
- **Prerequisites:** task-15-cloud-cleanup
- **Sources:** src-root-best, src-iam-best, src-cli-profile

### Task warnings

- Root is used only for final removal of the temporary IAM user/policy; sign out again immediately afterward.

### Console / browser route

- [ ] **task-16-identity-local-cleanup-browser-01** — While still signed in as fa-kms-admin, open IAM > Users > fa-kms-admin > Security credentials.
- [ ] **task-16-identity-local-cleanup-browser-02** — Delete the temporary access key only after Task 15 cloud verification is complete.
- [ ] **task-16-identity-local-cleanup-browser-03** — Sign out of fa-kms-admin.
- [ ] **task-16-identity-local-cleanup-browser-04** — Sign in as root for final IAM cleanup only.
- [ ] **task-16-identity-local-cleanup-browser-05** — Open IAM > Users > fa-kms-admin and delete the user after confirming it owns no remaining lab role or cloud resource.
- [ ] **task-16-identity-local-cleanup-browser-06** — Open IAM > Policies, select fa-kms-admin-policy and delete the customer managed policy.
- [ ] **task-16-identity-local-cleanup-browser-07** — Confirm fa-kms-admin and fa-kms-admin-policy are absent.
- [ ] **task-16-identity-local-cleanup-browser-08** — Sign out of root.
- [ ] **task-16-identity-local-cleanup-browser-09** — Delete the local AWS CLI profile and the exact C:\aws-labs\fa-kms folder using the CLI/local commands below.
- [ ] **task-16-identity-local-cleanup-browser-10** — Do not delete C:\aws-labs or any sibling lab folder.

### CLI / local route

#### task-16-identity-local-cleanup-cli-01 — Remove the named CLI profile and local helper files

```text
aws configure unset aws_access_key_id --profile fa-kms-admin
aws configure unset aws_secret_access_key --profile fa-kms-admin
aws configure unset region --profile fa-kms-admin
aws configure unset output --profile fa-kms-admin

if (Test-Path "C:\aws-labs\fa-kms") {
  Remove-Item "C:\aws-labs\fa-kms" -Recurse -Force
}
Test-Path "C:\aws-labs\fa-kms"
```

**Note:** Run this after the IAM access key has been deleted. Test-Path should return False.

### Expected results

- The temporary IAM access key is deleted.
- fa-kms-admin and fa-kms-admin-policy are deleted by root.
- The fa-kms-admin named CLI profile no longer contains credentials/Region/output.
- C:\aws-labs\fa-kms is absent.
- Only the AWS-enforced PendingDeletion KMS key remains until its deletion date.

### Verification checks

- [ ] **task-16-identity-local-cleanup-verify-01** — fa-kms-admin no longer exists.
- [ ] **task-16-identity-local-cleanup-verify-02** — fa-kms-admin-policy no longer exists.
- [ ] **task-16-identity-local-cleanup-verify-03** — The named CLI profile no longer contains usable credentials.
- [ ] **task-16-identity-local-cleanup-verify-04** — C:\aws-labs\fa-kms returns False from Test-Path.
- [ ] **task-16-identity-local-cleanup-verify-05** — The final cleanup acknowledgement can be made truthfully.

### Troubleshooting

- **IAM user deletion says resources or credentials remain** — Remove only the fa-kms-admin access key/login profile/policy attachment shown by IAM, then retry. Do not alter unrelated users.

---

# Programme cleanup

- **Completion gate:** acknowledgement
- **Manual only:** true
- **Ordering:** reverse_dependency

- [ ] **cleanup-01** — **fa-kms-web-acl**: Delete the unassociated REGIONAL WAF web ACL using the latest lock token. **Verify:** list-web-acls returns no fa-kms-web-acl.
- [ ] **cleanup-02** — **GuardDuty detector created for the lab in eu-west-2**: Delete the detector to disable GuardDuty in the Region. **Verify:** list-detectors returns no lab detector.
- [ ] **cleanup-03** — **fa-kms-rotating-demo-secret**: Force-delete only the fake training secret after rotation is complete. **Verify:** The secret is scheduled for immediate asynchronous deletion or is no longer found.
- [ ] **cleanup-04** — **fa-kms-rotation-function and /aws/lambda/fa-kms-rotation-function**: Delete the Lambda function, then delete its log group if present. **Verify:** Lambda get-function fails for the name and the log group is absent.
- [ ] **cleanup-05** — **fa-kms-rotation-role**: Detach AWSLambdaBasicExecutionRole, delete fa-kms-rotation-role-policy, then delete the role. **Verify:** iam get-role returns NoSuchEntity.
- [ ] **cleanup-06** — **alias/fa-kms-security-key**: Record the Key ID, delete the alias, then schedule the underlying KMS key for deletion with a 7-day waiting period. **Verify:** Alias is absent and describe-key by Key ID reports PendingDeletion plus DeletionDate.
- [ ] **cleanup-07** — **temporary fa-kms-admin access key**: Delete the access key only after cloud cleanup verification. **Verify:** No active access key remains for fa-kms-admin.
- [ ] **cleanup-08** — **fa-kms-admin and fa-kms-admin-policy**: Use root only to delete the temporary training user and its customer managed policy, then sign out root. **Verify:** IAM shows neither the user nor policy.
- [ ] **cleanup-09** — **fa-kms-admin AWS CLI profile**: Unset the exact profile credentials, Region and output configuration. **Verify:** The named profile contains no usable credentials.
- [ ] **cleanup-10** — **C:\aws-labs\fa-kms**: Delete the exact local lab folder last. **Verify:** Test-Path C:\aws-labs\fa-kms returns False.

## Programme cleanup acknowledgement

I verified that fa-kms-web-acl is deleted; the lab GuardDuty detector is disabled/deleted in eu-west-2; fa-kms-rotating-demo-secret is deleted or in its immediate asynchronous deletion process; fa-kms-rotation-function, its CloudWatch log group and fa-kms-rotation-role are absent; alias/fa-kms-security-key is deleted and its exact underlying customer managed key is PendingDeletion with a recorded deletion date; the temporary fa-kms-admin access key, IAM user and fa-kms-admin-policy are removed; the fa-kms-admin CLI profile contains no usable credentials; and only then was C:\aws-labs\fa-kms deleted.

# Official sources

## src-saa-domain1 — Content Domain 1: Design Secure Architectures

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain1.html
- **Purpose:** Maps KMS, key policies, WAF, GuardDuty and Secrets Manager to SAA-C03 secure architecture objectives.
- **Used by:** task-01-prerequisites, task-02-iam-bootstrap, task-04-create-kms-key, task-05-kms-policy-rotation, task-06-create-secret, task-10-create-waf, task-12-enable-guardduty, task-14-exam-review

## src-saa-inscope — In-Scope AWS Services - AWS Certified Solutions Architect - Associate

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- **Purpose:** Confirms AWS KMS, Amazon GuardDuty, AWS Secrets Manager, AWS WAF, IAM and Lambda are in scope.
- **Used by:** task-01-prerequisites, task-12-enable-guardduty, task-14-exam-review

## src-root-best — Root user best practices for your AWS account

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html
- **Purpose:** Root-user safety, MFA and the rule not to create root access keys.
- **Used by:** task-01-prerequisites, task-02-iam-bootstrap, task-16-identity-local-cleanup

## src-iam-best — Security best practices in IAM

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- **Purpose:** Least privilege, MFA and removal of unused credentials.
- **Used by:** task-02-iam-bootstrap, task-03-cli-profile, task-16-identity-local-cleanup

## src-cli-profile — Configuration and credential file settings in the AWS CLI

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
- **Purpose:** Named AWS CLI profile configuration and credential storage.
- **Used by:** task-01-prerequisites, task-03-cli-profile, task-16-identity-local-cleanup

## src-kms-create — Create a KMS key

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html
- **Purpose:** Customer managed KMS key creation, permissions and key type choices.
- **Used by:** task-04-create-kms-key, task-06-create-secret, task-15-cloud-cleanup

## src-kms-alias — Create aliases

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/kms/latest/developerguide/alias-create.html
- **Purpose:** KMS alias creation and alias naming rules.
- **Used by:** task-04-create-kms-key

## src-kms-policy — Creating a key policy

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-overview.html
- **Purpose:** Explains KMS key policies and how they differ from normal IAM permissions.
- **Used by:** task-04-create-kms-key, task-05-kms-policy-rotation, task-14-exam-review

## src-kms-rotation — Rotate AWS KMS keys

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html
- **Purpose:** Automatic and on-demand key material rotation behavior.
- **Used by:** task-05-kms-policy-rotation, task-14-exam-review

## src-secret-create — Create an AWS Secrets Manager secret

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html
- **Purpose:** Creating a secret and selecting a customer managed KMS key.
- **Used by:** task-06-create-secret

## src-secret-encryption — Secret encryption and decryption in AWS Secrets Manager

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/secretsmanager/latest/userguide/security-encryption.html
- **Purpose:** How Secrets Manager uses KMS to encrypt secret values.
- **Used by:** task-06-create-secret

## src-secret-rotation — Rotation by Lambda function

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_lambda.html
- **Purpose:** The Lambda-based Secrets Manager rotation workflow.
- **Used by:** task-07-rotation-role-code, task-09-enable-test-secret-rotation, task-14-exam-review

## src-secret-rotation-steps — Lambda rotation functions

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_lambda-functions.html
- **Purpose:** createSecret, setSecret, testSecret and finishSecret rotation stages.
- **Used by:** task-07-rotation-role-code, task-09-enable-test-secret-rotation

## src-secret-rotation-perms — Lambda rotation function execution role permissions for AWS Secrets Manager

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-required-permissions-function.html
- **Purpose:** Required Secrets Manager and KMS permissions for a rotation Lambda role.
- **Used by:** task-07-rotation-role-code, task-08-create-rotation-lambda

## src-secret-rotation-setup — Set up automatic rotation for non-database AWS Secrets Manager secrets

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_turn-on-for-other.html
- **Purpose:** Configuring a custom Lambda rotation function and invocation permission.
- **Used by:** task-08-create-rotation-lambda, task-09-enable-test-secret-rotation, task-15-cloud-cleanup

## src-secret-schedule — Rotation schedules

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_schedule.html
- **Purpose:** Rotation schedule and rotation window behavior.
- **Used by:** task-09-enable-test-secret-rotation

## src-lambda-role — Defining Lambda function permissions with an execution role

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html
- **Purpose:** Lambda execution role and least-privilege permissions.
- **Used by:** task-07-rotation-role-code, task-08-create-rotation-lambda

## src-waf-create — CreateWebACL - AWS WAFV2

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/waf/latest/APIReference/API_CreateWebACL.html
- **Purpose:** Regional web ACL creation, default action and rule ordering.
- **Used by:** task-10-create-waf, task-11-review-waf, task-15-cloud-cleanup

## src-waf-rate — Aggregating rate-based rules in AWS WAF

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based-aggregation-options.html
- **Purpose:** Rate-based rules and IP aggregation.
- **Used by:** task-10-create-waf, task-11-review-waf, task-14-exam-review

## src-waf-managed — Using managed rule groups in AWS WAF

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/waf/latest/developerguide/waf-managed-rule-groups.html
- **Purpose:** AWS Managed Rules behavior and pricing distinctions.
- **Used by:** task-10-create-waf, task-11-review-waf

## src-guardduty-start — Getting started with GuardDuty

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_settingup.html
- **Purpose:** Enabling GuardDuty and understanding findings.
- **Used by:** task-12-enable-guardduty, task-13-guardduty-sample, task-14-exam-review

## src-guardduty-samples — Generating sample findings in GuardDuty

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/guardduty/latest/ug/sample_findings.html
- **Purpose:** Safe sample finding generation for learning and testing.
- **Used by:** task-13-guardduty-sample

## src-guardduty-disable — Suspending or disabling GuardDuty

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_suspend-disable.html
- **Purpose:** Disabling GuardDuty in one Region and the effect on findings/configuration.
- **Used by:** task-15-cloud-cleanup

# Quality report

- **phaseCount:** 6
- **taskCount:** 16
- **browserStepCount:** 159
- **cliBlockCount:** 17
- **verificationCheckCount:** 56
- **cleanupStepCount:** 10
- **sourceCount:** 23
- **codeBlockCount:** 6
- **Missing items:** 0
- **Deferred/placeholder items:** 0

# Offline conversion boundary

These two files are portable offline authoring sources only. The local Study Tracker import command performs conversion, app validation, fingerprinting and acceptance later; nothing in this preview claims those steps have already happened.
