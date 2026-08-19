# CloudFormation Follow Along

> **Status:** Offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Beginner
- **Exam workspace:** AWS SAA-C03
- **AWS Region:** eu-west-2
- **Training prefix:** `fa-cloudformation`

## Required outcome

Author declarative IaC templates using nested stacks, StackSets, custom parameters, conditions, change sets and drift detection; deploy and update the training stacks in eu-west-2; deliberately create and repair one drift event; then safely destroy only the resources created by the lab.

## Exam coverage

- CloudFormation declarative IaC and stack lifecycle
- Template parameters and constraints
- Conditions for optional resources
- Nested stacks
- Change sets
- StackSets with self-managed permissions
- One StackSet instance in eu-west-2
- Drift creation, detection, inspection and repair
- Reverse-dependency cleanup

## Completion definition

- Four complete YAML templates are authored from nothing.
- The root stack creates fixed SSM resources and a nested child stack.
- A condition is false initially and then enabled through a reviewed change set.
- A self-managed StackSet deploys one instance to the current account in eu-west-2.
- One root SSM parameter is deliberately changed outside CloudFormation.
- Drift detection identifies RootParameter as MODIFIED.
- A reviewed update repairs the drift and final drift status is IN_SYNC.
- All lab resources are removed in safe reverse-dependency order.

## Warnings

### Cost

This lab creates a small private S3 bucket/object, CloudFormation stacks, two IAM roles, a StackSet/stack instance and small Systems Manager Parameter Store values. Review current AWS pricing and complete cleanup when finished.

### Safety

Delete only resources with exact fa-cloudformation names or the deterministic fa-cloudformation-<account-id>-templates bucket. Never delete the nested child directly while the root owns it.

### Credentials

Never create root access keys or place the temporary IAM-user access key/secret in templates, screenshots, source control or saved resource fields. Enter access-key values only through protected aws configure prompts.

### Region

All workload resources and the StackSet instance are created in eu-west-2, and the template bucket is also created in eu-west-2.

# Phase 1: Prepare the training account and tools

Create a safe temporary lab identity, verify AWS CLI access, and derive the unique S3 template-bucket name.

## task-01-prerequisites — Verify the training account and local tools

- **Feature:** Prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm AWS Console access, AWS CLI availability and a disposable training account before creating anything.
- **Why it matters:** A clean starting point makes later CloudFormation and drift errors easier to diagnose.
- **Exam relevance:** CloudFormation is an in-scope SAA-C03 service and represents declarative infrastructure as code.
- **Prerequisites:** None
- **Sources:** src-saa-exam-guide, src-saa-in-scope, src-cfn-welcome, src-iam-best

### Console / browser route

1. Sign in to the AWS training account that will be used for this lab.
2. Confirm no fa-cloudformation resource from this lab already exists.
3. Open Windows PowerShell from the Start menu.
4. Run aws --version.
5. If AWS CLI is missing, install AWS CLI v2 from the official AWS documentation, then reopen PowerShell.
6. Do not create root access keys; root is used only for Task 2 bootstrap and final Task 19 IAM-user removal.

### CLI route

#### PowerShell - verify AWS CLI

```text
aws --version
```

#### Bash - verify AWS CLI

```text
aws --version
```

### Expected results

- AWS CLI prints a version string.
- The training account is accessible.
- No lab resource exists yet.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — AWS CLI runs without command-not-found errors.
- [ ] **task-01-prerequisites-verify-02** — No fa-cloudformation resource has been created.

## task-02-bootstrap-user — Create the temporary CloudFormation training IAM user

- **Feature:** IAM bootstrap
- **Difficulty:** Hard
- **Goal:** Use root only to create fa-cloudformation-admin, one access key and the complete lab policy, then sign out of root.
- **Why it matters:** CloudFormation needs permission to create the exact resources described by the lab templates while routine work should not use root.
- **Exam relevance:** Secure access and least-privilege thinking remain part of good SAA-C03 architecture.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-iam, src-iam-best, src-cfn-stacksets-prereq

### Warnings

- The CloudFormation control-plane statement uses Resource "*" because several used CloudFormation APIs are not practical to scope before stack creation; all created workload resources still use exact fa-cloudformation names.

### Console / browser route

1. Sign in as root only for this bootstrap task.
2. Open IAM > Users > Create user.
3. Enter user name fa-cloudformation-admin and enable console access.
4. Open IAM > Policies > Create policy > JSON and paste the complete policy below.
5. Name the policy fa-cloudformation-admin-policy and create it.
6. Attach fa-cloudformation-admin-policy to fa-cloudformation-admin.
7. Open fa-cloudformation-admin > Security credentials and create one CLI access key.
8. Copy the key values only into a temporary secure location.
9. Sign out of root.
10. Sign in as fa-cloudformation-admin for all routine browser work.

### CLI route

#### No root CLI command

```text
# Complete the bootstrap in the IAM console. Do not create root access keys.
```

### Complete editable files / policies

#### Training IAM policy JSON

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFormationLabControlPlane",
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack","cloudformation:UpdateStack","cloudformation:DeleteStack","cloudformation:DescribeStacks","cloudformation:DescribeStackEvents","cloudformation:DescribeStackResources","cloudformation:ListStackResources","cloudformation:GetTemplate","cloudformation:CreateChangeSet","cloudformation:DescribeChangeSet","cloudformation:ExecuteChangeSet","cloudformation:DeleteChangeSet","cloudformation:ValidateTemplate","cloudformation:DetectStackDrift","cloudformation:DescribeStackDriftDetectionStatus","cloudformation:DescribeStackResourceDrifts","cloudformation:CreateStackSet","cloudformation:UpdateStackSet","cloudformation:DeleteStackSet","cloudformation:DescribeStackSet","cloudformation:CreateStackInstances","cloudformation:DeleteStackInstances","cloudformation:ListStackInstances","cloudformation:DescribeStackSetOperation","cloudformation:ListStackSetOperations","cloudformation:ListStackSetOperationResults","cloudformation:DetectStackSetDrift"
      ],
      "Resource": "*"
    },
    {
      "Sid": "TemplateBucket",
      "Effect": "Allow",
      "Action": ["s3:CreateBucket","s3:DeleteBucket","s3:ListBucket","s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::fa-cloudformation-*"
    },
    {
      "Sid": "TemplateObjects",
      "Effect": "Allow",
      "Action": ["s3:PutObject","s3:GetObject","s3:DeleteObject"],
      "Resource": "arn:aws:s3:::fa-cloudformation-*/*"
    },
    {
      "Sid": "TrainingParameters",
      "Effect": "Allow",
      "Action": ["ssm:PutParameter","ssm:GetParameter","ssm:GetParameters","ssm:DeleteParameter"],
      "Resource": "arn:aws:ssm:eu-west-2:*:parameter/fa-cloudformation/*"
    },
    {"Sid":"DescribeParameters","Effect":"Allow","Action":"ssm:DescribeParameters","Resource":"*"},
    {
      "Sid": "ManageStackSetTrainingRoles",
      "Effect": "Allow",
      "Action": ["iam:CreateRole","iam:DeleteRole","iam:GetRole","iam:TagRole","iam:UntagRole","iam:PutRolePolicy","iam:GetRolePolicy","iam:DeleteRolePolicy"],
      "Resource": [
        "arn:aws:iam::*:role/fa-cloudformation-stackset-admin-role",
        "arn:aws:iam::*:role/fa-cloudformation-stackset-execution-role"
      ]
    },
    {
      "Sid": "PassStackSetAdminRole",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::*:role/fa-cloudformation-stackset-admin-role",
      "Condition": {"StringEquals":{"iam:PassedToService":"cloudformation.amazonaws.com"}}
    }
  ]
}
```

### Expected results

- fa-cloudformation-admin exists.
- fa-cloudformation-admin-policy is attached.
- Exactly one temporary access key exists.
- Root is signed out.

### Verification checks

- [ ] **task-02-bootstrap-user-verify-01** — IAM shows fa-cloudformation-admin.
- [ ] **task-02-bootstrap-user-verify-02** — The user has fa-cloudformation-admin-policy.
- [ ] **task-02-bootstrap-user-verify-03** — The routine browser session is not root.

## task-03-cli-profile — Configure the AWS CLI profile and derive lab values

- **Feature:** AWS CLI identity
- **Difficulty:** Easy
- **Goal:** Configure profile fa-cloudformation-admin, verify the account ID and derive the deterministic S3 bucket name.
- **Why it matters:** The account ID provides a safe unique bucket suffix without inventing a random name.
- **Exam relevance:** S3 bucket names are global, while the CloudFormation and SSM resources remain fixed inside the training account.
- **Prerequisites:** task-02-bootstrap-user
- **Sources:** src-iam-best, src-s3-create-bucket

### Console / browser route

1. Open Windows PowerShell as your normal Windows user.
2. Run aws configure --profile fa-cloudformation-admin.
3. Enter the temporary access key only when prompted.
4. Set the default Region to eu-west-2 and output to json.
5. Run get-caller-identity and record the 12-digit account ID.
6. Derive TEMPLATE_BUCKET as fa-cloudformation-<account-id>-templates.

### CLI route

#### PowerShell - configure profile

```text
aws configure --profile fa-cloudformation-admin
```

#### PowerShell - derive account ID

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-cloudformation-admin --query Account --output text
```

#### PowerShell - derive bucket

```text
$TEMPLATE_BUCKET = "fa-cloudformation-$AWS_ACCOUNT_ID-templates"
```

#### PowerShell - show values

```text
Write-Output "ACCOUNT_ID=$AWS_ACCOUNT_ID`nTEMPLATE_BUCKET=$TEMPLATE_BUCKET"
```

#### Bash - derive account ID

```text
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --profile fa-cloudformation-admin --query Account --output text)
```

#### Bash - derive bucket

```text
TEMPLATE_BUCKET="fa-cloudformation-${AWS_ACCOUNT_ID}-templates"
```

### Expected results

- The caller is the intended training IAM user.
- AWS_ACCOUNT_ID has 12 digits.
- TEMPLATE_BUCKET starts fa-cloudformation- and ends -templates.

### Verification checks

- [ ] **task-03-cli-profile-verify-01** — The caller ARN contains fa-cloudformation-admin.
- [ ] **task-03-cli-profile-verify-02** — The derived bucket name is recorded.

# Phase 2: Author complete CloudFormation templates

Create the nested, root, StackSet-role and StackSet workload templates.

## task-04-create-files — Create the exact local lab folder and YAML files

- **Feature:** Local authoring structure
- **Difficulty:** Easy
- **Goal:** Create the lab directory and four empty YAML files before deployment.
- **Why it matters:** Separate files make nested-stack and StackSet responsibilities visible.
- **Exam relevance:** Declarative IaC begins with desired-state templates written before resources exist.
- **Prerequisites:** task-03-cli-profile
- **Sources:** src-cfn-anatomy, src-cfn-welcome

### Console / browser route

1. In File Explorer create C:\cloudformation-labs if needed, then create fa-cloudformation.
2. Inside C:\\cloudformation-labs\\fa-cloudformation create nested.yaml, root.yaml, stackset-roles.yaml and stackset.yaml.
3. Ensure Windows has not added .txt to any filename.
4. Open the files in a plain-text editor.

### CLI route

#### PowerShell - create lab folder

```text
New-Item -ItemType Directory -Force "C:\\cloudformation-labs\\fa-cloudformation"
```

#### PowerShell - enter lab folder

```text
Set-Location "C:\\cloudformation-labs\\fa-cloudformation"
```

#### PowerShell - verify location

```text
Get-Location
```

#### PowerShell - create nested.yaml

```text
New-Item -ItemType File -Force .\nested.yaml
```

#### PowerShell - create root.yaml

```text
New-Item -ItemType File -Force .\root.yaml
```

#### PowerShell - create roles template

```text
New-Item -ItemType File -Force .\stackset-roles.yaml
```

#### PowerShell - create StackSet template

```text
New-Item -ItemType File -Force .\stackset.yaml
```

#### Bash - create directory

```text
mkdir -p ~/cloudformation-labs/fa-cloudformation
```

#### Bash - enter directory

```text
cd ~/cloudformation-labs/fa-cloudformation
```

#### Bash - create files

```text
touch nested.yaml root.yaml stackset-roles.yaml stackset.yaml
```

### Expected results

- The lab directory exists.
- All four YAML filenames exist.
- No AWS resource has been created by the templates yet.

### Verification checks

- [ ] **task-04-create-files-verify-01** — The current folder is the lab folder.
- [ ] **task-04-create-files-verify-02** — All four files are visible.

## task-05-author-nested — Author the nested-stack template

- **Feature:** Nested stack template
- **Difficulty:** Medium
- **Goal:** Create a complete child template that accepts parameters, creates one SSM parameter and exposes outputs to the parent.
- **Why it matters:** The child becomes a reusable component managed by AWS::CloudFormation::Stack.
- **Exam relevance:** Nested stacks split one deployment hierarchy into reusable template components.
- **Prerequisites:** task-04-create-files
- **Sources:** src-cfn-nested, src-cfn-nested-resource, src-cfn-parameters, src-cfn-anatomy, src-ssm

### Console / browser route

1. Open C:\\cloudformation-labs\\fa-cloudformation\nested.yaml.
2. Replace the empty file with the complete nested.yaml block below and save it as UTF-8.
3. Review Environment and NestedMessage.
4. Confirm the fixed resource name is /fa-cloudformation/nested-message.
5. Review the Outputs section that the parent can read.

### CLI route

#### PowerShell - open nested.yaml

```text
notepad .\nested.yaml
```

### Complete editable files / policies

#### nested.yaml

```text
AWSTemplateFormatVersion: '2010-09-09'
Description: Nested stack for the fa-cloudformation SAA-C03 Follow Along.
Parameters:
  Environment:
    Type: String
    Default: training
    AllowedValues: [training, test]
  NestedMessage:
    Type: String
    MinLength: 3
    MaxLength: 80
    AllowedPattern: '^[A-Za-z0-9-]+$'
Resources:
  NestedParameter:
    Type: AWS::SSM::Parameter
    Properties:
      Name: /fa-cloudformation/nested-message
      Type: String
      Value: !Sub '${NestedMessage}-${Environment}'
      Description: Created by the nested CloudFormation stack.
      Tags:
        FollowAlong: fa-cloudformation
        ManagedBy: CloudFormation
Outputs:
  NestedParameterName:
    Value: !Ref NestedParameter
  NestedParameterArn:
    Value: !Sub 'arn:${AWS::Partition}:ssm:${AWS::Region}:${AWS::AccountId}:parameter${NestedParameter}'
```

### Expected results

- nested.yaml contains Parameters, Resources and Outputs.
- It creates only /fa-cloudformation/nested-message.

### Verification checks

- [ ] **task-05-author-nested-verify-01** — No unresolved placeholder text exists.
- [ ] **task-05-author-nested-verify-02** — The resource name uses fa-cloudformation.

## task-06-author-root — Author the root template with parameters and a condition

- **Feature:** Parameters and conditions
- **Difficulty:** Hard
- **Goal:** Create the root template that creates a root parameter, conditionally creates another parameter and invokes the nested template by URL.
- **Why it matters:** One template can change behavior through runtime inputs instead of being copied for each environment.
- **Exam relevance:** Parameters make templates reusable and conditions control optional resources.
- **Prerequisites:** task-05-author-nested
- **Sources:** src-cfn-parameters, src-cfn-conditions, src-cfn-nested-resource, src-cfn-anatomy, src-ssm

### Console / browser route

1. Open C:\\cloudformation-labs\\fa-cloudformation\root.yaml.
2. Paste the complete root.yaml block and save it.
3. Review Environment and RootMessage constraints.
4. Review CreateOptionalParameter and the CreateOptional condition.
5. Review NestedTemplateUrl; it receives the S3 URL at deployment time.
6. Confirm OptionalParameter has Condition: CreateOptional.
7. Confirm NestedTrainingStack is AWS::CloudFormation::Stack and passes two child parameters.
8. Review the Outputs, including !GetAtt from the child stack.

### CLI route

#### PowerShell - open root.yaml

```text
notepad .\root.yaml
```

### Complete editable files / policies

#### root.yaml

```text
AWSTemplateFormatVersion: '2010-09-09'
Description: Root stack for the fa-cloudformation SAA-C03 Follow Along.
Parameters:
  Environment:
    Type: String
    Default: training
    AllowedValues: [training, test]
  RootMessage:
    Type: String
    Default: created-by-fa-cloudformation
    MinLength: 3
    MaxLength: 80
    AllowedPattern: '^[A-Za-z0-9-]+$'
  CreateOptionalParameter:
    Type: String
    Default: 'false'
    AllowedValues: ['true', 'false']
  NestedTemplateUrl:
    Type: String
    MinLength: 20
Conditions:
  CreateOptional: !Equals [!Ref CreateOptionalParameter, 'true']
Resources:
  RootParameter:
    Type: AWS::SSM::Parameter
    Properties:
      Name: /fa-cloudformation/root-message
      Type: String
      Value: !Sub '${RootMessage}-${Environment}'
      Tags:
        FollowAlong: fa-cloudformation
        ManagedBy: CloudFormation
  OptionalParameter:
    Type: AWS::SSM::Parameter
    Condition: CreateOptional
    Properties:
      Name: /fa-cloudformation/optional-message
      Type: String
      Value: !Sub 'optional-${Environment}'
      Tags:
        FollowAlong: fa-cloudformation
        ManagedBy: CloudFormation
  NestedTrainingStack:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: !Ref NestedTemplateUrl
      Parameters:
        Environment: !Ref Environment
        NestedMessage: nested-created
      TimeoutInMinutes: 10
Outputs:
  RootParameterName:
    Value: !Ref RootParameter
  OptionalParameterCreated:
    Value: !If [CreateOptional, 'true', 'false']
  NestedParameterName:
    Value: !GetAtt NestedTrainingStack.Outputs.NestedParameterName
  NestedStackId:
    Value: !Ref NestedTrainingStack
```

### Expected results

- root.yaml contains four parameters.
- The condition evaluates CreateOptionalParameter.
- The nested stack receives parameters from the root.

### Verification checks

- [ ] **task-06-author-root-verify-01** — OptionalParameter uses CreateOptional.
- [ ] **task-06-author-root-verify-02** — NestedTrainingStack uses NestedTemplateUrl.
- [ ] **task-06-author-root-verify-03** — All SSM names use /fa-cloudformation/.

## task-07-author-stackset-roles — Author the self-managed StackSet roles template

- **Feature:** StackSet IAM roles
- **Difficulty:** Hard
- **Goal:** Create the administration and execution roles declaratively in a dedicated CloudFormation template.
- **Why it matters:** Self-managed StackSets need a trust path from CloudFormation to the administration role and then to the execution role.
- **Exam relevance:** StackSets separate central administration from the execution identity in each target account.
- **Prerequisites:** task-06-author-root
- **Sources:** src-cfn-stacksets, src-cfn-stacksets-prereq, src-cfn-stacksets-start, src-iam

### Console / browser route

1. Open C:\\cloudformation-labs\\fa-cloudformation\stackset-roles.yaml.
2. Paste the complete roles template and save it.
3. Confirm the administration role name is fa-cloudformation-stackset-admin-role.
4. Confirm the execution role name is fa-cloudformation-stackset-execution-role.
5. Confirm the administration role can assume only the exact execution role.
6. Confirm the execution role can manage only /fa-cloudformation/stackset-message plus DescribeParameters.
7. Do not add AdministratorAccess.

### CLI route

#### PowerShell - open roles template

```text
notepad .\stackset-roles.yaml
```

### Complete editable files / policies

#### stackset-roles.yaml

```text
AWSTemplateFormatVersion: '2010-09-09'
Description: Self-managed StackSet roles for the fa-cloudformation training lab.
Resources:
  StackSetAdministrationRole:
    Type: AWS::IAM::Role
    Properties:
      RoleName: fa-cloudformation-stackset-admin-role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: cloudformation.amazonaws.com
            Action: sts:AssumeRole
      Policies:
        - PolicyName: fa-cloudformation-assume-execution-role
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action: sts:AssumeRole
                Resource: !Sub 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/fa-cloudformation-stackset-execution-role'
  StackSetExecutionRole:
    Type: AWS::IAM::Role
    DependsOn: StackSetAdministrationRole
    Properties:
      RoleName: fa-cloudformation-stackset-execution-role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: !GetAtt StackSetAdministrationRole.Arn
            Action: sts:AssumeRole
      Policies:
        - PolicyName: fa-cloudformation-stackset-ssm-policy
          PolicyDocument:
            Version: '2012-10-17'
            Statement:
              - Effect: Allow
                Action: [ssm:PutParameter, ssm:GetParameter, ssm:GetParameters, ssm:DeleteParameter]
                Resource: !Sub 'arn:${AWS::Partition}:ssm:eu-west-2:${AWS::AccountId}:parameter/fa-cloudformation/stackset-message'
              - Effect: Allow
                Action: ssm:DescribeParameters
                Resource: '*'
Outputs:
  AdministrationRoleArn:
    Value: !GetAtt StackSetAdministrationRole.Arn
  ExecutionRoleName:
    Value: !Ref StackSetExecutionRole
```

### Expected results

- The template contains two named roles.
- The trust chain is CloudFormation -> admin role -> execution role.
- The execution policy is limited to the StackSet training parameter.

### Verification checks

- [ ] **task-07-author-stackset-roles-verify-01** — fa-cloudformation-stackset-admin-role is present.
- [ ] **task-07-author-stackset-roles-verify-02** — fa-cloudformation-stackset-execution-role is present.
- [ ] **task-07-author-stackset-roles-verify-03** — No AdministratorAccess policy is present.

## task-08-author-stackset — Author the StackSet workload template

- **Feature:** StackSet workload
- **Difficulty:** Medium
- **Goal:** Create the template that the StackSet will deploy as a stack instance.
- **Why it matters:** A StackSet holds one common template while stack instances represent deployments to account/Region targets.
- **Exam relevance:** Standardized repeated deployment across accounts or Regions is a StackSet use case.
- **Prerequisites:** task-07-author-stackset-roles
- **Sources:** src-cfn-stacksets, src-cfn-stackinstances, src-cfn-parameters, src-ssm

### Console / browser route

1. Open C:\\cloudformation-labs\\fa-cloudformation\stackset.yaml.
2. Paste the complete StackSet template and save it.
3. Review Environment and StackSetMessage.
4. Confirm it creates only /fa-cloudformation/stackset-message.
5. Confirm the value includes AWS::Region.

### CLI route

#### PowerShell - open StackSet template

```text
notepad .\stackset.yaml
```

### Complete editable files / policies

#### stackset.yaml

```text
AWSTemplateFormatVersion: '2010-09-09'
Description: StackSet template for the fa-cloudformation SAA-C03 Follow Along.
Parameters:
  Environment:
    Type: String
    Default: training
    AllowedValues: [training, test]
  StackSetMessage:
    Type: String
    Default: deployed-by-stackset
    MinLength: 3
    MaxLength: 80
    AllowedPattern: '^[A-Za-z0-9-]+$'
Resources:
  StackSetParameter:
    Type: AWS::SSM::Parameter
    Properties:
      Name: /fa-cloudformation/stackset-message
      Type: String
      Value: !Sub '${StackSetMessage}-${Environment}-${AWS::Region}'
      Tags:
        FollowAlong: fa-cloudformation
        ManagedBy: CloudFormation-StackSet
Outputs:
  StackSetParameterName:
    Value: !Ref StackSetParameter
```

### Expected results

- The template contains two parameters and one SSM resource.
- The resource name is /fa-cloudformation/stackset-message.

### Verification checks

- [ ] **task-08-author-stackset-verify-01** — No resource name escapes the training prefix.
- [ ] **task-08-author-stackset-verify-02** — AWS::Region is used in the value.

# Phase 3: Deploy and update root and nested stacks

Upload the nested template, deploy the root hierarchy and update it with a reviewed change set.

## task-09-validate-upload — Validate templates and upload the nested template

- **Feature:** Validation and S3
- **Difficulty:** Medium
- **Goal:** Validate all four templates, create the private S3 bucket, upload nested.yaml and construct its HTTPS URL.
- **Why it matters:** The root stack needs a reachable child TemplateURL before it can create the nested stack.
- **Exam relevance:** Validate before deployment and store nested templates in S3.
- **Prerequisites:** task-08-author-stackset
- **Sources:** src-cfn-nested-resource, src-cfn-console-create, src-s3-create-bucket, src-cfn-anatomy

### Console / browser route

1. In the AWS Console choose Europe (London) eu-west-2.
2. Open Amazon S3 and choose Create bucket.
3. Enter the exact TEMPLATE_BUCKET value derived in Task 3.
4. Keep Block Public Access enabled and create the bucket in eu-west-2.
5. Open the bucket and upload nested.yaml.
6. Open the object and copy its HTTPS object URL; record it as NestedTemplateUrl.
7. Do not make the object public.

### CLI route

#### PowerShell - enter lab folder

```text
Set-Location "C:\\cloudformation-labs\\fa-cloudformation"
```

#### PowerShell - rebuild account ID

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-cloudformation-admin --query Account --output text
```

#### PowerShell - rebuild bucket

```text
$TEMPLATE_BUCKET = "fa-cloudformation-$AWS_ACCOUNT_ID-templates"
```

#### PowerShell - validate nested

```text
aws cloudformation validate-template --template-body file://nested.yaml --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - validate root

```text
aws cloudformation validate-template --template-body file://root.yaml --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - validate roles

```text
aws cloudformation validate-template --template-body file://stackset-roles.yaml --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - validate StackSet

```text
aws cloudformation validate-template --template-body file://stackset.yaml --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - create bucket

```text
aws s3api create-bucket --bucket $TEMPLATE_BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - upload nested

```text
aws s3 cp .\nested.yaml "s3://$TEMPLATE_BUCKET/nested.yaml" --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - derive nested URL

```text
$NESTED_URL = "https://$TEMPLATE_BUCKET.s3.eu-west-2.amazonaws.com/nested.yaml"
```

#### PowerShell - show nested URL

```text
Write-Output $NESTED_URL
```

#### Bash - derive account ID

```text
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --profile fa-cloudformation-admin --query Account --output text)
```

#### Bash - derive bucket

```text
TEMPLATE_BUCKET="fa-cloudformation-${AWS_ACCOUNT_ID}-templates"
```

#### Bash - validate nested

```text
aws cloudformation validate-template --template-body file://nested.yaml --region eu-west-2 --profile fa-cloudformation-admin
```

#### Bash - validate root

```text
aws cloudformation validate-template --template-body file://root.yaml --region eu-west-2 --profile fa-cloudformation-admin
```

#### Bash - create bucket

```text
aws s3api create-bucket --bucket "$TEMPLATE_BUCKET" --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-cloudformation-admin
```

#### Bash - upload nested

```text
aws s3 cp ./nested.yaml "s3://$TEMPLATE_BUCKET/nested.yaml" --region eu-west-2 --profile fa-cloudformation-admin
```

#### Bash - derive nested URL

```text
NESTED_URL="https://${TEMPLATE_BUCKET}.s3.eu-west-2.amazonaws.com/nested.yaml"
```

### Expected results

- All four validate-template calls succeed.
- The private bucket exists in eu-west-2.
- nested.yaml exists in the bucket.
- NESTED_URL ends /nested.yaml.

### Verification checks

- [ ] **task-09-validate-upload-verify-01** — No validation error is returned.
- [ ] **task-09-validate-upload-verify-02** — S3 shows the exact object.
- [ ] **task-09-validate-upload-verify-03** — The object is not public.

## task-10-create-root — Create the root and nested stacks

- **Feature:** Root and nested deployment
- **Difficulty:** Hard
- **Goal:** Deploy fa-cloudformation-root with the optional parameter disabled and confirm the nested child is created automatically.
- **Why it matters:** The parent owns the child lifecycle and should be used for normal create, update and delete operations.
- **Exam relevance:** Nested stacks organize reusable components inside one stack hierarchy.
- **Prerequisites:** task-09-validate-upload
- **Sources:** src-cfn-console-create, src-cfn-nested, src-cfn-nested-resource, src-cfn-change-set, src-cfn-execute-change-set

### Console / browser route

1. Open CloudFormation in eu-west-2 > Stacks > Create stack > With new resources.
2. Choose Upload a template file and select root.yaml.
3. Set Stack name to fa-cloudformation-root.
4. Set Environment=training.
5. Set RootMessage=created-by-fa-cloudformation.
6. Set CreateOptionalParameter=false.
7. Paste the exact NestedTemplateUrl recorded in Task 9.
8. Continue with default stack options and no service role.
9. Review and submit the stack.
10. Wait for CREATE_COMPLETE.
11. Open Resources and find NestedTrainingStack with type AWS::CloudFormation::Stack.
12. Open the child stack and confirm CREATE_COMPLETE.

### CLI route

#### PowerShell - create reviewable CREATE change set

```text
aws cloudformation create-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-create-root --change-set-type CREATE --template-body file://root.yaml --parameters ParameterKey=Environment,ParameterValue=training ParameterKey=RootMessage,ParameterValue=created-by-fa-cloudformation ParameterKey=CreateOptionalParameter,ParameterValue=false ParameterKey=NestedTemplateUrl,ParameterValue=$NESTED_URL --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait for change set

```text
aws cloudformation wait change-set-create-complete --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-create-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - inspect change set

```text
aws cloudformation describe-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-create-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - execute change set

```text
aws cloudformation execute-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-create-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait for stack

```text
aws cloudformation wait stack-create-complete --stack-name fa-cloudformation-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - describe stack

```text
aws cloudformation describe-stacks --stack-name fa-cloudformation-root --region eu-west-2 --profile fa-cloudformation-admin
```

### Expected results

- Root stack reaches CREATE_COMPLETE.
- Nested child reaches CREATE_COMPLETE.
- root-message and nested-message exist.
- optional-message is absent because the condition is false.

### Verification checks

- [ ] **task-10-create-root-verify-01** — Root status is CREATE_COMPLETE.
- [ ] **task-10-create-root-verify-02** — NestedTrainingStack is AWS::CloudFormation::Stack.
- [ ] **task-10-create-root-verify-03** — OptionalParameterCreated output is false.

## task-11-verify-update — Verify the false condition, then update through a change set

- **Feature:** Parameters, conditions and change sets
- **Difficulty:** Hard
- **Goal:** Prove the initial false condition, then review and execute an update that enables the optional resource and changes RootMessage.
- **Why it matters:** The learner sees parameter input, condition evaluation and a change set affect real resources.
- **Exam relevance:** Change sets preview impact before updates; parameters and conditions make one template reusable.
- **Prerequisites:** task-10-create-root
- **Sources:** src-cfn-parameters, src-cfn-conditions, src-cfn-change-set, src-cfn-execute-change-set, src-ssm

### Console / browser route

1. Open fa-cloudformation-root > Parameters and confirm CreateOptionalParameter=false.
2. Open Outputs and confirm OptionalParameterCreated=false.
3. Open Systems Manager > Parameter Store and confirm root-message and nested-message exist while optional-message is absent.
4. In CloudFormation choose Stack actions > Create change set for current stack.
5. Use the current template.
6. Keep Environment=training and NestedTemplateUrl unchanged.
7. Change RootMessage to updated-by-fa-cloudformation.
8. Change CreateOptionalParameter to true.
9. Create the change set and wait for CREATE_COMPLETE.
10. Review Changes and confirm RootParameter is modified and OptionalParameter is added.
11. Execute the change set only after review.
12. Wait for UPDATE_COMPLETE.
13. Verify /fa-cloudformation/optional-message now exists.

### CLI route

#### PowerShell - check root parameter

```text
aws ssm get-parameter --name /fa-cloudformation/root-message --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - check nested parameter

```text
aws ssm get-parameter --name /fa-cloudformation/nested-message --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - confirm optional absent

```text
aws ssm get-parameter --name /fa-cloudformation/optional-message --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - create update change set

```text
aws cloudformation create-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-enable-optional --change-set-type UPDATE --use-previous-template --parameters ParameterKey=Environment,UsePreviousValue=true ParameterKey=RootMessage,ParameterValue=updated-by-fa-cloudformation ParameterKey=CreateOptionalParameter,ParameterValue=true ParameterKey=NestedTemplateUrl,UsePreviousValue=true --include-nested-stacks --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait for update change set

```text
aws cloudformation wait change-set-create-complete --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-enable-optional --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - inspect update change set

```text
aws cloudformation describe-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-enable-optional --include-property-values --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - execute update

```text
aws cloudformation execute-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-enable-optional --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait for update

```text
aws cloudformation wait stack-update-complete --stack-name fa-cloudformation-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - verify optional

```text
aws ssm get-parameter --name /fa-cloudformation/optional-message --region eu-west-2 --profile fa-cloudformation-admin
```

### Expected results

- Initial optional parameter lookup returns ParameterNotFound.
- The reviewed change set adds OptionalParameter and modifies RootParameter.
- Stack reaches UPDATE_COMPLETE.
- optional-message exists with optional-training.

### Verification checks

- [ ] **task-11-verify-update-verify-01** — The update was reviewed before execution.
- [ ] **task-11-verify-update-verify-02** — OptionalParameterCreated becomes true.
- [ ] **task-11-verify-update-verify-03** — root-message begins updated-by-fa-cloudformation.

# Phase 4: Deploy the StackSet

Create self-managed StackSet roles and deploy one stack instance to the current account in eu-west-2.

## task-12-stackset-roles — Deploy the self-managed StackSet IAM roles

- **Feature:** StackSet permissions
- **Difficulty:** Hard
- **Goal:** Create the two StackSet roles from stackset-roles.yaml and verify the trust chain.
- **Why it matters:** Self-managed StackSets require administrator and execution roles even for this single-account teaching deployment.
- **Exam relevance:** StackSets use a central admin operation and an execution identity in each target account.
- **Prerequisites:** task-11-verify-update
- **Sources:** src-cfn-stacksets-prereq, src-cfn-stacksets-start, src-cfn-console-create, src-iam

### Console / browser route

1. Open CloudFormation > Create stack with new resources.
2. Upload stackset-roles.yaml.
3. Set Stack name fa-cloudformation-stackset-roles.
4. Continue through the wizard.
5. Acknowledge creation of named IAM resources.
6. Create the stack and wait for CREATE_COMPLETE.
7. Open Outputs and record AdministrationRoleArn and ExecutionRoleName.
8. Open IAM > Roles and verify both fa-cloudformation StackSet roles.

### CLI route

#### PowerShell - create roles stack

```text
aws cloudformation create-stack --stack-name fa-cloudformation-stackset-roles --template-body file://stackset-roles.yaml --capabilities CAPABILITY_NAMED_IAM --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait for roles stack

```text
aws cloudformation wait stack-create-complete --stack-name fa-cloudformation-stackset-roles --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - get admin role ARN

```text
$ADMIN_ROLE_ARN = aws cloudformation describe-stacks --stack-name fa-cloudformation-stackset-roles --query "Stacks[0].Outputs[?OutputKey=='AdministrationRoleArn'].OutputValue | [0]" --output text --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - show admin role ARN

```text
Write-Output $ADMIN_ROLE_ARN
```

### Expected results

- Role stack reaches CREATE_COMPLETE.
- Both custom roles exist.
- AdministrationRoleArn is available from outputs.

### Verification checks

- [ ] **task-12-stackset-roles-verify-01** — Admin role trust principal is cloudformation.amazonaws.com.
- [ ] **task-12-stackset-roles-verify-02** — Execution role trusts the admin role.
- [ ] **task-12-stackset-roles-verify-03** — Execution policy is limited to the training StackSet parameter.

## task-13-stackset-instance — Create the StackSet and one stack instance

- **Feature:** CloudFormation StackSets
- **Difficulty:** Hard
- **Goal:** Create fa-cloudformation-stackset with self-managed permissions and deploy one instance to the current account in eu-west-2.
- **Why it matters:** A single-account deployment safely teaches the same StackSet mechanism that scales across accounts and Regions.
- **Exam relevance:** Repeated standardized deployment across accounts or Regions points toward StackSets.
- **Prerequisites:** task-12-stackset-roles
- **Sources:** src-cfn-stacksets, src-cfn-stacksets-start, src-cfn-stackinstances

### Warnings

- Do not start another StackSet operation while the current operation is RUNNING.

### Console / browser route

1. Open CloudFormation > StackSets > Create StackSet.
2. Choose self-managed permissions.
3. Upload stackset.yaml.
4. Set StackSet name fa-cloudformation-stackset.
5. Use fa-cloudformation-stackset-admin-role and fa-cloudformation-stackset-execution-role.
6. Set Environment=training and StackSetMessage=deployed-by-stackset.
7. Create the StackSet.
8. Choose Add stacks to StackSet > Deploy new stacks.
9. Enter the current 12-digit account ID.
10. Choose eu-west-2 only.
11. Set failure tolerance 0 and maximum concurrent accounts 1.
12. Submit and wait for SUCCEEDED.
13. Verify /fa-cloudformation/stackset-message in Parameter Store.

### CLI route

#### PowerShell - rebuild account ID

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-cloudformation-admin --query Account --output text
```

#### PowerShell - admin role ARN

```text
$ADMIN_ROLE_ARN = "arn:aws:iam::$AWS_ACCOUNT_ID:role/fa-cloudformation-stackset-admin-role"
```

#### PowerShell - create StackSet

```text
aws cloudformation create-stack-set --stack-set-name fa-cloudformation-stackset --template-body file://stackset.yaml --parameters ParameterKey=Environment,ParameterValue=training ParameterKey=StackSetMessage,ParameterValue=deployed-by-stackset --permission-model SELF_MANAGED --administration-role-arn $ADMIN_ROLE_ARN --execution-role-name fa-cloudformation-stackset-execution-role --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - create stack instance

```text
$STACKSET_OPERATION_ID = aws cloudformation create-stack-instances --stack-set-name fa-cloudformation-stackset --accounts $AWS_ACCOUNT_ID --regions eu-west-2 --operation-preferences FailureToleranceCount=0,MaxConcurrentCount=1 --query OperationId --output text --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - inspect operation

```text
aws cloudformation describe-stack-set-operation --stack-set-name fa-cloudformation-stackset --operation-id $STACKSET_OPERATION_ID --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - list instances

```text
aws cloudformation list-stack-instances --stack-set-name fa-cloudformation-stackset --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - verify parameter

```text
aws ssm get-parameter --name /fa-cloudformation/stackset-message --region eu-west-2 --profile fa-cloudformation-admin
```

### Expected results

- StackSet exists with SELF_MANAGED permissions.
- The operation reaches SUCCEEDED.
- Exactly one stack instance targets the current account/eu-west-2.
- stackset-message ends training-eu-west-2.

### Verification checks

- [ ] **task-13-stackset-instance-verify-01** — StackSet status is ACTIVE.
- [ ] **task-13-stackset-instance-verify-02** — Stack instance is CURRENT after success.
- [ ] **task-13-stackset-instance-verify-03** — The StackSet SSM parameter exists.

# Phase 5: Create, detect and repair drift

Make one deliberate out-of-band change, detect it, inspect it and repair it through CloudFormation.

## task-14-create-drift — Create one deliberate out-of-band change

- **Feature:** Configuration drift
- **Difficulty:** Medium
- **Goal:** Change root-message outside CloudFormation so actual state no longer matches expected state.
- **Why it matters:** This creates a harmless example of unmanaged configuration change.
- **Exam relevance:** Drift detection is used to find changes made outside the IaC control plane.
- **Prerequisites:** task-13-stackset-instance
- **Sources:** src-cfn-drift, src-ssm

### Console / browser route

1. Open Systems Manager > Parameter Store in eu-west-2.
2. Open /fa-cloudformation/root-message.
3. Choose Edit.
4. Set the value to DRIFTED-OUTSIDE-CLOUDFORMATION.
5. Save it.
6. Do not edit any other lab parameter.
7. Return to CloudFormation without updating the stack.

### CLI route

#### PowerShell - create deliberate drift

```text
aws ssm put-parameter --name /fa-cloudformation/root-message --type String --value DRIFTED-OUTSIDE-CLOUDFORMATION --overwrite --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - verify actual value

```text
aws ssm get-parameter --name /fa-cloudformation/root-message --region eu-west-2 --profile fa-cloudformation-admin
```

### Expected results

- The actual SSM value is DRIFTED-OUTSIDE-CLOUDFORMATION.
- The template itself is unchanged.

### Verification checks

- [ ] **task-14-create-drift-verify-01** — Only root-message was changed manually.
- [ ] **task-14-create-drift-verify-02** — The root stack still exists.

## task-15-detect-drift — Detect and inspect stack drift

- **Feature:** Drift detection
- **Difficulty:** Hard
- **Goal:** Run drift detection and identify RootParameter as MODIFIED with different expected and actual values.
- **Why it matters:** The learner must interpret drift results, not merely start the check.
- **Exam relevance:** A stack is DRIFTED when supported managed resources differ from expected configuration.
- **Prerequisites:** task-14-create-drift
- **Sources:** src-cfn-drift, src-cfn-drift-stack, src-cfn-cli-drift, src-cfn-cli-drift-status, src-cfn-resource-drifts

### Console / browser route

1. Open fa-cloudformation-root in CloudFormation.
2. Choose Stack actions > Detect drift.
3. Confirm the request and wait for completion.
4. Open drift results.
5. Confirm stack drift status DRIFTED.
6. Find RootParameter with resource drift status MODIFIED.
7. Inspect the expected value and actual DRIFTED-OUTSIDE-CLOUDFORMATION value.

### CLI route

#### PowerShell - start drift detection

```text
$DRIFT_ID = aws cloudformation detect-stack-drift --stack-name fa-cloudformation-root --query StackDriftDetectionId --output text --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - poll drift status

```text
aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id $DRIFT_ID --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - inspect modified resources

```text
aws cloudformation describe-stack-resource-drifts --stack-name fa-cloudformation-root --stack-resource-drift-status-filters MODIFIED --region eu-west-2 --profile fa-cloudformation-admin
```

### Expected results

- Detection reaches DETECTION_COMPLETE.
- StackDriftStatus is DRIFTED.
- RootParameter is MODIFIED.
- Actual value shows the deliberate manual value.

### Verification checks

- [ ] **task-15-detect-drift-verify-01** — Drift detection completed successfully.
- [ ] **task-15-detect-drift-verify-02** — RootParameter is the deliberate drifted resource.

## task-16-repair-drift — Repair drift through a reviewed CloudFormation update

- **Feature:** Drift repair
- **Difficulty:** Hard
- **Goal:** Change RootMessage through a reviewed change set, execute it, then confirm a new drift check is IN_SYNC.
- **Why it matters:** The repair restores CloudFormation as the source of truth instead of accepting the manual edit.
- **Exam relevance:** A controlled CloudFormation update should bring managed state back in line and then be verified.
- **Prerequisites:** task-15-detect-drift
- **Sources:** src-cfn-change-set, src-cfn-execute-change-set, src-cfn-drift-stack, src-cfn-cli-drift-status

### Console / browser route

1. Open fa-cloudformation-root > Stack actions > Create change set for current stack.
2. Use the current template.
3. Keep Environment=training, CreateOptionalParameter=true and NestedTemplateUrl unchanged.
4. Set RootMessage=repaired-by-fa-cloudformation.
5. Create and wait for the change set.
6. Confirm RootParameter is the intended modification.
7. Execute and wait for UPDATE_COMPLETE.
8. Run Detect drift again.
9. Wait for the new detection to finish.
10. Confirm stack drift status IN_SYNC.

### CLI route

#### PowerShell - create repair change set

```text
aws cloudformation create-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-repair-drift --change-set-type UPDATE --use-previous-template --parameters ParameterKey=Environment,UsePreviousValue=true ParameterKey=RootMessage,ParameterValue=repaired-by-fa-cloudformation ParameterKey=CreateOptionalParameter,UsePreviousValue=true ParameterKey=NestedTemplateUrl,UsePreviousValue=true --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait for repair change set

```text
aws cloudformation wait change-set-create-complete --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-repair-drift --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - inspect repair

```text
aws cloudformation describe-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-repair-drift --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - execute repair

```text
aws cloudformation execute-change-set --stack-name fa-cloudformation-root --change-set-name fa-cloudformation-repair-drift --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait for repair

```text
aws cloudformation wait stack-update-complete --stack-name fa-cloudformation-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - verify repaired value

```text
aws ssm get-parameter --name /fa-cloudformation/root-message --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - start second drift

```text
$DRIFT_ID_2 = aws cloudformation detect-stack-drift --stack-name fa-cloudformation-root --query StackDriftDetectionId --output text --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - poll second drift

```text
aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id $DRIFT_ID_2 --region eu-west-2 --profile fa-cloudformation-admin
```

### Expected results

- root-message becomes repaired-by-fa-cloudformation-training.
- Stack reaches UPDATE_COMPLETE.
- New drift detection reports IN_SYNC.

### Verification checks

- [ ] **task-16-repair-drift-verify-01** — The repair change set was reviewed first.
- [ ] **task-16-repair-drift-verify-02** — Final root stack drift status is IN_SYNC.

# Phase 6: SAA-C03 CloudFormation review

Connect the lab to common architecture decisions and exam triggers.

## task-17-exam-review — Review SAA-C03 CloudFormation decision points

- **Feature:** Exam consolidation
- **Difficulty:** Easy
- **Goal:** Turn the practical work into clear architecture decision rules before teardown.
- **Why it matters:** The exam rewards recognizing the correct CloudFormation mechanism from a requirement.
- **Exam relevance:** CloudFormation is explicitly in scope for SAA-C03.
- **Prerequisites:** task-16-repair-drift
- **Sources:** src-saa-in-scope, src-cfn-welcome, src-cfn-parameters, src-cfn-conditions, src-cfn-nested, src-cfn-stacksets, src-cfn-drift, src-cfn-change-set

### Console / browser route

1. Template means declarative desired state.
2. Stack means one managed collection of resources.
3. Parameter means runtime input without editing the template.
4. Condition means true/false logic controlling resource or output creation.
5. Nested stack means a child AWS::CloudFormation::Stack inside a parent hierarchy.
6. StackSet means centrally distributing one template to target accounts/Regions.
7. Change set means previewing proposed stack changes before execution.
8. Drift means actual managed state differs from expected template state.
9. Exam trigger: repeated standardized deployment across accounts/Regions -> StackSets.
10. Exam trigger: reusable components inside one deployment hierarchy -> nested stacks.
11. Exam trigger: manual out-of-band changes -> drift detection.
12. Exam trigger: preview stack impact before update -> change set.
13. Exam trap: nested stacks and StackSets solve different problems.

### CLI route

#### PowerShell - final root inventory

```text
aws cloudformation describe-stacks --stack-name fa-cloudformation-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - final StackSet inventory

```text
aws cloudformation list-stack-instances --stack-set-name fa-cloudformation-stackset --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - final parameter inventory

```text
aws ssm describe-parameters --parameter-filters "Key=Name,Option=BeginsWith,Values=/fa-cloudformation/" --region eu-west-2 --profile fa-cloudformation-admin
```

### Expected results

- The learner can explain stack vs nested stack vs StackSet.
- The learner can explain parameter vs condition.
- The learner can explain change set vs drift detection.
- Only expected fa-cloudformation resources remain.

### Verification checks

- [ ] **task-17-exam-review-verify-01** — Root stack is healthy.
- [ ] **task-17-exam-review-verify-02** — StackSet instance is CURRENT.
- [ ] **task-17-exam-review-verify-03** — Root stack is IN_SYNC before cleanup.

# Phase 7: Reverse-dependency cleanup

Delete every lab-created item safely and verify absence.

## task-18-cleanup — Delete every CloudFormation training resource in reverse dependency order

- **Feature:** Ordered cleanup
- **Difficulty:** Hard
- **Goal:** Remove the StackSet instance first, then StackSet, root/nested stacks, role stack, S3 artifacts, temporary identity and local files.
- **Why it matters:** Deleting credentials or templates too early can strand managed resources, so cleanup preserves dependencies until they are no longer needed.
- **Exam relevance:** Delete through the owning CloudFormation control plane rather than manually deleting child resources first.
- **Prerequisites:** task-17-exam-review
- **Sources:** src-cfn-stackinstances, src-cfn-stacksets, src-cfn-nested, src-cfn-console-create, src-iam-best, src-s3-create-bucket

### Warnings

- If the StackSet delete operation is still RUNNING, wait for SUCCEEDED before deleting the StackSet or roles.

### Console / browser route

1. Open CloudFormation > StackSets and open fa-cloudformation-stackset.
2. Delete the stack instance for the current account in eu-west-2 and choose not to retain the stack.
3. Wait until the delete operation succeeds.
4. Delete the now-empty fa-cloudformation-stackset.
5. Open CloudFormation > Stacks.
6. Delete fa-cloudformation-root and wait for it to disappear; do not delete the nested child directly.
7. Open Systems Manager Parameter Store and verify root-message, optional-message and nested-message are absent.
8. Delete fa-cloudformation-stackset-roles and wait for it to disappear.
9. Open IAM Roles and verify both fa-cloudformation StackSet roles are absent.
10. Open the exact S3 template bucket from Task 3.
11. Delete nested.yaml, then delete the empty bucket.
12. Verify /fa-cloudformation/stackset-message is absent.
13. Sign in as root only now: delete the fa-cloudformation-admin access key, detach/delete fa-cloudformation-admin-policy, delete fa-cloudformation-admin, then sign out of root.
14. Remove only the fa-cloudformation-admin AWS CLI profile; leave unrelated profiles unchanged.
15. Delete C:\cloudformation-labs\fa-cloudformation last.
16. Read and affirm the programme cleanup acknowledgement.

### CLI route

#### PowerShell - rebuild account ID

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-cloudformation-admin --query Account --output text
```

#### PowerShell - delete StackSet instance

```text
$DELETE_OPERATION_ID = aws cloudformation delete-stack-instances --stack-set-name fa-cloudformation-stackset --accounts $AWS_ACCOUNT_ID --regions eu-west-2 --no-retain-stacks --query OperationId --output text --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - inspect delete operation

```text
aws cloudformation describe-stack-set-operation --stack-set-name fa-cloudformation-stackset --operation-id $DELETE_OPERATION_ID --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - delete empty StackSet

```text
aws cloudformation delete-stack-set --stack-set-name fa-cloudformation-stackset --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - delete root stack

```text
aws cloudformation delete-stack --stack-name fa-cloudformation-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait root delete

```text
aws cloudformation wait stack-delete-complete --stack-name fa-cloudformation-root --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - verify SSM absence

```text
aws ssm describe-parameters --parameter-filters "Key=Name,Option=BeginsWith,Values=/fa-cloudformation/" --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - delete role stack

```text
aws cloudformation delete-stack --stack-name fa-cloudformation-stackset-roles --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - wait role stack delete

```text
aws cloudformation wait stack-delete-complete --stack-name fa-cloudformation-stackset-roles --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - rebuild bucket

```text
$TEMPLATE_BUCKET = "fa-cloudformation-$AWS_ACCOUNT_ID-templates"
```

#### PowerShell - delete nested object

```text
aws s3 rm "s3://$TEMPLATE_BUCKET/nested.yaml" --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - delete bucket

```text
aws s3api delete-bucket --bucket $TEMPLATE_BUCKET --region eu-west-2 --profile fa-cloudformation-admin
```

#### PowerShell - leave lab folder

```text
Set-Location C:\
```

#### PowerShell - delete local lab folder

```text
Remove-Item "C:\cloudformation-labs\fa-cloudformation" -Recurse -Force
```

### Expected results

- StackSet instance and StackSet are gone.
- Root stack and nested child are gone.
- All four /fa-cloudformation/ parameters are absent.
- StackSet roles stack and both roles are gone.
- nested.yaml and template bucket are gone.
- Temporary IAM user, access key, policy and CLI profile are removed.
- Local lab directory is removed last.

### Verification checks

- [ ] **task-18-cleanup-verify-01** — No fa-cloudformation CloudFormation stack remains.
- [ ] **task-18-cleanup-verify-02** — No /fa-cloudformation/ SSM parameter remains.
- [ ] **task-18-cleanup-verify-03** — No fa-cloudformation StackSet role remains.
- [ ] **task-18-cleanup-verify-04** — No fa-cloudformation template bucket remains.
- [ ] **task-18-cleanup-verify-05** — Unrelated resources and CLI profiles remain unchanged.

# Troubleshooting

## trouble-01 — Template validation fails

- **Likely cause:** YAML indentation, quoting or copied content changed.
- **Fix:** Compare the local file with the complete editable block and correct the first validation error before deployment.

## trouble-02 — Nested stack cannot read TemplateURL

- **Likely cause:** nested.yaml is missing, URL is wrong, or S3 read permission is missing.
- **Fix:** Rebuild TEMPLATE_BUCKET/NESTED_URL from the verified account ID and confirm nested.yaml exists in that private bucket.

## trouble-03 — Root stack rolls back

- **Likely cause:** A nested resource failed, an exact SSM name already exists, or a parameter constraint failed.
- **Fix:** Open Events, find the first CREATE_FAILED event and follow the nested stack link when NestedTrainingStack failed.

## trouble-04 — OptionalParameter is not in the change set

- **Likely cause:** CreateOptionalParameter was not changed to true.
- **Fix:** Recreate the change set with CreateOptionalParameter=true and keep NestedTemplateUrl unchanged.

## trouble-05 — StackSet cannot pass the administration role

- **Likely cause:** The roles stack is not complete or the training user lacks the exact restricted iam:PassRole permission.
- **Fix:** Verify the roles stack is CREATE_COMPLETE and the admin role ARN exactly matches fa-cloudformation-stackset-admin-role.

## trouble-06 — StackSet instance operation fails

- **Likely cause:** Role trust/permissions are wrong or stackset-message already exists.
- **Fix:** Inspect describe-stack-set-operation and list-stack-set-operation-results, then verify both roles and the exact SSM name.

## trouble-07 — Drift remains IN_SYNC after manual edit

- **Likely cause:** The wrong SSM parameter was edited or the new value was not saved.
- **Fix:** Read /fa-cloudformation/root-message directly and confirm DRIFTED-OUTSIDE-CLOUDFORMATION before rerunning drift detection.

## trouble-08 — Final drift check remains DRIFTED

- **Likely cause:** Another resource changed manually or the repair update did not complete.
- **Fix:** Describe all resource drifts and repair only the lab resource whose actual state differs from the template.

## trouble-09 — StackSet cannot be deleted

- **Likely cause:** A stack instance still exists or the instance deletion is still running.
- **Fix:** Wait for the delete operation to reach SUCCEEDED and confirm the instance list is empty before deleting the StackSet.

## trouble-10 — S3 bucket cannot be deleted

- **Likely cause:** The bucket is not empty.
- **Fix:** List the exact bucket, delete nested.yaml only, then retry deleting the bucket.

# Ordered manual cleanup

- **Manual only:** `true`
- **Ordering:** `reverse_dependency`
- **Completion gate:** `acknowledgement`

## Cleanup 1: StackSet stack instance in current account / eu-west-2

- **Action:** Delete it with retain-stacks disabled.
- **Verification:** The StackSet operation reports SUCCEEDED and no instance remains.
- **Task:** task-18-cleanup

## Cleanup 2: fa-cloudformation-stackset

- **Action:** Delete the empty StackSet.
- **Verification:** It no longer appears in CloudFormation.
- **Task:** task-18-cleanup

## Cleanup 3: fa-cloudformation-root

- **Action:** Delete the root stack and allow it to delete its nested child and three SSM parameters.
- **Verification:** Root/nested stacks and root-message, optional-message, nested-message are absent.
- **Task:** task-18-cleanup

## Cleanup 4: fa-cloudformation-stackset-roles

- **Action:** Delete the StackSet roles stack.
- **Verification:** Both fa-cloudformation StackSet roles are absent.
- **Task:** task-18-cleanup

## Cleanup 5: nested.yaml in the deterministic S3 bucket

- **Action:** Delete the uploaded nested template object.
- **Verification:** The bucket is empty.
- **Task:** task-18-cleanup

## Cleanup 6: fa-cloudformation-<derived AWS account ID>-templates

- **Action:** Delete the empty bucket.
- **Verification:** The bucket is absent.
- **Task:** task-18-cleanup

## Cleanup 7: fa-cloudformation-admin access key, fa-cloudformation-admin-policy, and IAM user

- **Action:** Use root only after cloud cleanup to remove the temporary identity.
- **Verification:** The user and policy are absent.
- **Task:** task-18-cleanup

## Cleanup 8: AWS CLI profile fa-cloudformation-admin

- **Action:** Remove only the training profile.
- **Verification:** The profile is unusable while unrelated profiles remain.
- **Task:** task-18-cleanup

## Cleanup 9: C:\\cloudformation-labs\\fa-cloudformation

- **Action:** Delete the exact local lab folder last.
- **Verification:** The folder is absent.
- **Task:** task-18-cleanup

## Programme cleanup acknowledgement

I verified that the fa-cloudformation StackSet instance and StackSet are deleted; fa-cloudformation-root and its nested child are deleted; /fa-cloudformation/root-message, /fa-cloudformation/optional-message, /fa-cloudformation/nested-message and /fa-cloudformation/stackset-message are absent from eu-west-2; fa-cloudformation-stackset-roles and both StackSet IAM roles are deleted; nested.yaml and the deterministic fa-cloudformation-<account-id>-templates bucket are deleted; the temporary fa-cloudformation-admin access key, policy, IAM user and CLI profile are removed; unrelated resources and profiles are unchanged; and only then was C:\cloudformation-labs\fa-cloudformation deleted.

# Official sources

## src-saa-exam-guide — AWS Certification Exam Guides

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html
- **Purpose:** Confirms the current SAA-C03 exam context.
- **Used by:** task-01-prerequisites

## src-saa-in-scope — In-Scope AWS Services - AWS Certified Solutions Architect - Associate

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- **Purpose:** Confirms AWS CloudFormation is in scope for SAA-C03.
- **Used by:** task-01-prerequisites, task-17-exam-review

## src-cfn-welcome — What is CloudFormation?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
- **Purpose:** CloudFormation declarative IaC and stack purpose.
- **Used by:** task-01-prerequisites, task-04-create-files, task-17-exam-review

## src-cfn-anatomy — CloudFormation template sections

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html
- **Purpose:** Template Parameters, Resources and Outputs.
- **Used by:** task-04-create-files, task-05-author-nested, task-06-author-root, task-09-validate-upload

## src-cfn-parameters — CloudFormation template Parameters syntax

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html
- **Purpose:** Parameters, defaults and constraints.
- **Used by:** task-05-author-nested, task-06-author-root, task-08-author-stackset, task-11-verify-update, task-17-exam-review

## src-cfn-conditions — CloudFormation template Conditions syntax

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html
- **Purpose:** Conditions based on parameter values.
- **Used by:** task-06-author-root, task-11-verify-update, task-17-exam-review

## src-cfn-nested — Split a template into reusable pieces using nested stacks

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html
- **Purpose:** Nested stack behavior.
- **Used by:** task-05-author-nested, task-10-create-root, task-17-exam-review, task-18-cleanup

## src-cfn-nested-resource — AWS::CloudFormation::Stack

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-cloudformation-stack.html
- **Purpose:** Nested TemplateURL and parameters.
- **Used by:** task-05-author-nested, task-06-author-root, task-09-validate-upload, task-10-create-root

## src-cfn-change-set — create-change-set

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-change-set.html
- **Purpose:** Reviewable CloudFormation changes.
- **Used by:** task-10-create-root, task-11-verify-update, task-16-repair-drift, task-17-exam-review

## src-cfn-execute-change-set — execute-change-set

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/cloudformation/execute-change-set.html
- **Purpose:** Execute a reviewed change set.
- **Used by:** task-10-create-root, task-11-verify-update, task-16-repair-drift

## src-cfn-console-create — Create a stack from the CloudFormation console

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stack.html
- **Purpose:** Browser stack creation workflow.
- **Used by:** task-09-validate-upload, task-10-create-root, task-12-stackset-roles, task-18-cleanup

## src-cfn-stacksets — Managing stacks across accounts and Regions with StackSets

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html
- **Purpose:** StackSet purpose.
- **Used by:** task-07-author-stackset-roles, task-08-author-stackset, task-13-stackset-instance, task-17-exam-review, task-18-cleanup

## src-cfn-stacksets-prereq — Grant self-managed permissions

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html
- **Purpose:** Self-managed StackSet IAM roles.
- **Used by:** task-02-bootstrap-user, task-07-author-stackset-roles, task-12-stackset-roles

## src-cfn-stacksets-start — Get started with StackSets using a sample template

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-getting-started.html
- **Purpose:** Single-account StackSet prerequisites.
- **Used by:** task-07-author-stackset-roles, task-12-stackset-roles, task-13-stackset-instance

## src-cfn-stackinstances — Add stacks to CloudFormation StackSets

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stackinstances-create.html
- **Purpose:** Create stack instances.
- **Used by:** task-08-author-stackset, task-13-stackset-instance, task-18-cleanup

## src-cfn-drift — Detect unmanaged configuration changes to stacks and resources with drift detection

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html
- **Purpose:** Drift concepts.
- **Used by:** task-14-create-drift, task-15-detect-drift, task-17-exam-review

## src-cfn-drift-stack — Detect drift on an entire CloudFormation stack

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html
- **Purpose:** Stack drift workflow.
- **Used by:** task-15-detect-drift, task-16-repair-drift

## src-cfn-cli-drift — detect-stack-drift

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/cloudformation/detect-stack-drift.html
- **Purpose:** Start drift detection.
- **Used by:** task-15-detect-drift

## src-cfn-cli-drift-status — describe-stack-drift-detection-status

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/cloudformation/describe-stack-drift-detection-status.html
- **Purpose:** Poll drift detection.
- **Used by:** task-15-detect-drift, task-16-repair-drift

## src-cfn-resource-drifts — describe-stack-resource-drifts

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/cloudformation/describe-stack-resource-drifts.html
- **Purpose:** Inspect drifted resources.
- **Used by:** task-15-detect-drift

## src-s3-create-bucket — create-bucket

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cli/latest/reference/s3api/create-bucket.html
- **Purpose:** Create the private template bucket.
- **Used by:** task-03-cli-profile, task-09-validate-upload, task-18-cleanup

## src-ssm — AWS Systems Manager Parameter Store

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html
- **Purpose:** Training parameters used as stack resources.
- **Used by:** task-05-author-nested, task-06-author-root, task-08-author-stackset, task-11-verify-update, task-14-create-drift

## src-iam — What is IAM?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html
- **Purpose:** IAM users, roles and permissions.
- **Used by:** task-02-bootstrap-user, task-07-author-stackset-roles, task-12-stackset-roles

## src-iam-best — Security best practices in IAM

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- **Purpose:** Avoid root for routine work and limit long-lived credentials.
- **Used by:** task-01-prerequisites, task-02-bootstrap-user, task-03-cli-profile, task-18-cleanup

# Quality report

- **Phase count:** 7
- **Task count:** 18
- **Checkbox count:** 205
- **CLI command count:** 97
- **Editable-block count:** 5
- **Verification count:** 48
- **Cleanup-item count:** 9
- **Official-source count:** 24
- **Missing items:** 0
- **Uncertain items:** 0

# Offline conversion boundary

This preview and JSON manuscript are offline educational authoring artifacts only. They have not been locally validated by Study Tracker, imported, accepted, approved, published or fingerprinted.
