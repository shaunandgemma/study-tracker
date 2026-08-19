# Migration & Transfer Follow Along

> **Status:** Offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Intermediate
- **Exam workspace:** AWS SAA-C03
- **AWS Region:** eu-west-2
- **Training prefix:** `fa-migration`

## Required outcome

Plan and perform a small database full-load migration with AWS DMS, transfer the resulting objects with AWS DataSync, and build a concrete Storage Gateway Volume Gateway cached-versus-stored configuration plan; verify each outcome and safely remove only the resources created by the lab.

## Completion definition

- A self-managed MariaDB source is launched with no inbound SSH and a runtime-generated Secrets Manager password.
- DMS uses a two-AZ replication subnet group, a small replication instance, a Secrets Manager-authenticated source endpoint and an S3 target endpoint.
- A full-load DMS task migrates three known rows into a private S3 bucket.
- A DataSync task copies the migrated objects into a second private S3 bucket.
- The learner creates a complete cached-versus-stored Volume Gateway design with cache, upload-buffer and iSCSI volume sizing.
- The learner can explain when DMS, DataSync and Storage Gateway are appropriate for SAA-C03 architecture scenarios.
- All chargeable migration compute and dependent cloud resources are removed before service roles, human credentials and local files.

## Warnings

### Cost

This lab creates a DMS replication instance, one t3.micro EC2 source instance, Secrets Manager secret, S3 objects and a DataSync task; these can incur charges. The Volume Gateway portion is deliberately planning-only because a real EC2-hosted cached gateway normally uses a larger instance and substantial cache/upload-buffer EBS storage.

### Safety

Delete only exact fa-migration resources and the two exact DMS service roles created by this lab. Do not delete a DMS role if it existed before the lab or is used by unrelated DMS workloads.

### Credentials

Never create root access keys and never place the MariaDB password, AWS access key or secret key in the manuscript, local scripts, screenshots or Study Tracker. The database password is generated at runtime and stored in Secrets Manager.

### Region

Every cloud resource in the active lab is created in eu-west-2. The two DMS subnets use eu-west-2a and eu-west-2b.

# Phase 1: Prepare identity, tools and migration plan

Create the training identity, CLI profile, local files and a clear service-selection model.

## task-01-prerequisites — Verify the training account and migration tools

- **Feature:** Prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm a disposable AWS account, AWS CLI and eu-west-2 before creating migration resources.
- **Why it matters:** DMS, DataSync and Storage Gateway solve different migration problems, so the lab begins with an explicit clean account and service-selection boundary.
- **Exam relevance:** AWS DMS, DataSync and Storage Gateway are all in-scope SAA-C03 services.
- **Prerequisites:** None
- **Sources:** src-saa-scope

### Console / browser route

1. Sign in to the disposable AWS training account.
2. Confirm no fa-migration resources already exist.
3. Open Windows PowerShell.
4. Run aws --version.
5. Confirm the intended Region for every cloud resource in this lab is Europe (London) eu-west-2.
6. Do not create or use root access keys.
7. Root is used only for the one-time IAM bootstrap in Task 2 and final removal of the temporary IAM user in Task 16.

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

- AWS CLI prints a version.
- The training account is accessible.
- No lab resource exists yet.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — AWS CLI runs successfully.
- [ ] **task-01-prerequisites-verify-02** — No fa-migration resource has been created.

## task-02-bootstrap-user — Create the temporary migration IAM training user

- **Feature:** IAM bootstrap
- **Difficulty:** Hard
- **Goal:** Use root only to create fa-migration-admin, one temporary access key and the complete migration lab policy.
- **Why it matters:** The training user needs permissions for network setup, DMS, DataSync, S3, Secrets Manager, SSM and a controlled set of service roles without using AdministratorAccess.
- **Exam relevance:** Migration design still depends on secure identities and service roles.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-dms-iam, src-datasync-access

### Warnings

- AWS DMS requires two fixed role names, dms-vpc-role and dms-cloudwatch-logs-role. Those names are service requirements and are the only intentional exceptions to the fa-migration naming prefix.

### Console / browser route

1. Sign in as the AWS root user only for this bootstrap task.
2. Open IAM.
3. Choose Users.
4. Choose Create user.
5. Set User name to fa-migration-admin.
6. Enable AWS Management Console access.
7. Create the user.
8. Choose Policies.
9. Choose Create policy.
10. Choose JSON.
11. Replace the editor contents with the complete fa-migration-admin-policy JSON below.
12. Choose Next.
13. Set Policy name to fa-migration-admin-policy.
14. Create the policy.
15. Open fa-migration-admin.
16. Choose Add permissions.
17. Choose Attach policies directly.
18. Select fa-migration-admin-policy.
19. Attach it.
20. Open Security credentials.
21. Create exactly one access key for CLI use.
22. Copy the access key only to a temporary secure location.
23. Sign out of root.
24. Sign in as fa-migration-admin for routine browser work.

### CLI route

#### No root CLI command

```text
# Complete this one-time bootstrap in IAM. Do not create root access keys.
```

### Complete editable files / policies

#### fa-migration-admin-policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadIdentityAndRegionalState",
      "Effect": "Allow",
      "Action": [
        "sts:GetCallerIdentity",
        "ec2:Describe*",
        "iam:GetRole",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:ListAttachedRolePolicies",
        "iam:ListRolePolicies",
        "secretsmanager:DescribeSecret",
        "secretsmanager:ListSecrets",
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingNetworkAndSourceInstance",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc",
        "ec2:DeleteVpc",
        "ec2:ModifyVpcAttribute",
        "ec2:CreateSubnet",
        "ec2:DeleteSubnet",
        "ec2:ModifySubnetAttribute",
        "ec2:CreateInternetGateway",
        "ec2:AttachInternetGateway",
        "ec2:DetachInternetGateway",
        "ec2:DeleteInternetGateway",
        "ec2:CreateRouteTable",
        "ec2:DeleteRouteTable",
        "ec2:AssociateRouteTable",
        "ec2:DisassociateRouteTable",
        "ec2:CreateRoute",
        "ec2:DeleteRoute",
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:AuthorizeSecurityGroupEgress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupEgress",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "ec2:CreateTags",
        "ec2:DeleteTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ReadAmazonLinuxAmiParameterAndUseSessionManager",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:DescribeInstanceInformation",
        "ssm:SendCommand",
        "ssm:GetCommandInvocation",
        "ssm:ListCommandInvocations",
        "ssm:StartSession",
        "ssm:TerminateSession"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingSecrets",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:CreateSecret",
        "secretsmanager:UpdateSecret",
        "secretsmanager:GetRandomPassword",
        "secretsmanager:GetSecretValue",
        "secretsmanager:DeleteSecret",
        "secretsmanager:TagResource"
      ],
      "Resource": "arn:aws:secretsmanager:eu-west-2:*:secret:fa-migration/*"
    },
    {
      "Sid": "ManageTrainingBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:ListBucket",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": [
        "arn:aws:s3:::fa-migration-dms-*",
        "arn:aws:s3:::fa-migration-archive-*"
      ]
    },
    {
      "Sid": "ManageTrainingBucketObjects",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:GetObjectTagging",
        "s3:PutObjectTagging",
        "s3:DeleteObject",
        "s3:AbortMultipartUpload"
      ],
      "Resource": [
        "arn:aws:s3:::fa-migration-dms-*/*",
        "arn:aws:s3:::fa-migration-archive-*/*"
      ]
    },
    {
      "Sid": "ManageDmsResources",
      "Effect": "Allow",
      "Action": [
        "dms:CreateReplicationSubnetGroup",
        "dms:DeleteReplicationSubnetGroup",
        "dms:DescribeReplicationSubnetGroups",
        "dms:CreateReplicationInstance",
        "dms:DeleteReplicationInstance",
        "dms:DescribeReplicationInstances",
        "dms:CreateEndpoint",
        "dms:DeleteEndpoint",
        "dms:DescribeEndpoints",
        "dms:TestConnection",
        "dms:DescribeConnections",
        "dms:CreateReplicationTask",
        "dms:DeleteReplicationTask",
        "dms:DescribeReplicationTasks",
        "dms:StartReplicationTask",
        "dms:StopReplicationTask",
        "dms:DescribeTableStatistics",
        "dms:AddTagsToResource",
        "dms:RemoveTagsFromResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageDataSyncResources",
      "Effect": "Allow",
      "Action": [
        "datasync:CreateLocationS3",
        "datasync:DeleteLocation",
        "datasync:DescribeLocationS3",
        "datasync:ListLocations",
        "datasync:CreateTask",
        "datasync:DeleteTask",
        "datasync:DescribeTask",
        "datasync:ListTasks",
        "datasync:StartTaskExecution",
        "datasync:DescribeTaskExecution",
        "datasync:ListTaskExecutions",
        "datasync:TagResource",
        "datasync:UntagResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyLabAndRequiredDmsRoles",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:UpdateAssumeRolePolicy",
        "iam:PutRolePolicy",
        "iam:GetRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:TagRole",
        "iam:UntagRole",
        "iam:CreateInstanceProfile",
        "iam:DeleteInstanceProfile",
        "iam:AddRoleToInstanceProfile",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:GetInstanceProfile",
        "iam:PassRole"
      ],
      "Resource": [
        "arn:aws:iam::*:role/fa-migration-*",
        "arn:aws:iam::*:instance-profile/fa-migration-*",
        "arn:aws:iam::*:role/dms-vpc-role",
        "arn:aws:iam::*:role/dms-cloudwatch-logs-role"
      ]
    }
  ]
}
```

### Expected results

- fa-migration-admin exists.
- fa-migration-admin-policy is attached.
- Exactly one temporary access key exists.
- Root is signed out.

### Verification checks

- [ ] **task-02-bootstrap-user-verify-01** — The current browser session is fa-migration-admin.
- [ ] **task-02-bootstrap-user-verify-02** — AdministratorAccess is not attached.

## task-03-cli-local-files — Configure the CLI profile and create the migration files

- **Feature:** CLI and local files
- **Difficulty:** Medium
- **Goal:** Create fa-migration-admin, derive the AWS account ID and prepare every local script/JSON document used by DMS and Storage Gateway planning.
- **Why it matters:** The lab never stores a database password in a manuscript file; Secrets Manager generates it at runtime.
- **Exam relevance:** Secure migration automation separates configuration files from runtime credentials.
- **Prerequisites:** task-02-bootstrap-user
- **Sources:** src-dms-secrets, src-sgw-disk-sizing

### Console / browser route

1. Open Windows PowerShell.
2. Run aws configure --profile fa-migration-admin.
3. Enter the temporary access key only in the protected prompts.
4. Enter eu-west-2 for the default Region.
5. Enter json for output format.
6. Run get-caller-identity and record the 12-digit account ID.
7. Create C:\aws-labs\fa-migration.
8. Create source-user-data.sh, configure-source.sh, dms-table-mappings.json, dms-task-settings.json and volume-gateway-plan.json.
9. Paste each complete editable block below into its matching file.
10. Do not add any password or access key to these files.

### CLI route

#### PowerShell - configure profile

```text
aws configure --profile fa-migration-admin
```

#### PowerShell - verify identity

```text
aws sts get-caller-identity --profile fa-migration-admin
```

#### PowerShell - capture account ID

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-migration-admin --query Account --output text
```

#### PowerShell - derive DMS bucket

```text
$DMS_BUCKET = "fa-migration-dms-$AWS_ACCOUNT_ID"
```

#### PowerShell - derive archive bucket

```text
$ARCHIVE_BUCKET = "fa-migration-archive-$AWS_ACCOUNT_ID"
```

#### PowerShell - create local folder

```text
New-Item -ItemType Directory -Force "C:\aws-labs\fa-migration"
```

#### PowerShell - enter local folder

```text
Set-Location "C:\aws-labs\fa-migration"
```

#### Bash - capture account ID

```text
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --profile fa-migration-admin --query Account --output text)
```

#### Bash - derive DMS bucket

```text
DMS_BUCKET="fa-migration-dms-${AWS_ACCOUNT_ID}"
```

#### Bash - derive archive bucket

```text
ARCHIVE_BUCKET="fa-migration-archive-${AWS_ACCOUNT_ID}"
```

### Complete editable files / policies

#### source-user-data.sh

```text
#!/bin/bash
set -euxo pipefail
dnf install -y mariadb105-server
systemctl enable mariadb
systemctl start mariadb
```

#### configure-source.sh

```text
#!/bin/bash
set -euo pipefail

SECRET_JSON=$(aws secretsmanager get-secret-value \
  --secret-id fa-migration/mysql-source \
  --region eu-west-2 \
  --query SecretString \
  --output text)

DB_PASSWORD=$(printf '%s' "$SECRET_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["password"])')

sudo mariadb <<SQL
CREATE DATABASE IF NOT EXISTS migrationdb;

CREATE USER IF NOT EXISTS 'migration_user'@'%' IDENTIFIED BY '${DB_PASSWORD}';

GRANT SELECT, RELOAD, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER
ON migrationdb.* TO 'migration_user'@'%';

CREATE TABLE IF NOT EXISTS migrationdb.customers (
  customer_id INT NOT NULL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  migration_note VARCHAR(100) NOT NULL
);

TRUNCATE TABLE migrationdb.customers;

INSERT INTO migrationdb.customers (customer_id, customer_name, migration_note) VALUES
  (1, 'Alpha Training', 'DMS full load row 1'),
  (2, 'Bravo Training', 'DMS full load row 2'),
  (3, 'Charlie Training', 'DMS full load row 3');

FLUSH PRIVILEGES;
SQL
```

#### dms-table-mappings.json

```json
{
  "rules": [
    {
      "rule-type": "selection",
      "rule-id": "1",
      "rule-name": "include-migrationdb",
      "object-locator": {
        "schema-name": "migrationdb",
        "table-name": "%"
      },
      "rule-action": "include"
    }
  ]
}
```

#### dms-task-settings.json

```json
{
  "Logging": {
    "EnableLogging": true
  },
  "FullLoadSettings": {
    "TargetTablePrepMode": "DROP_AND_CREATE",
    "StopTaskCachedChangesApplied": false,
    "StopTaskCachedChangesNotApplied": false,
    "MaxFullLoadSubTasks": 4
  }
}
```

#### volume-gateway-plan.json

```json
{
  "programme": "Migration & Transfer Follow Along",
  "resourcePrefix": "fa-migration",
  "region": "eu-west-2",
  "volumeGatewayDecision": {
    "selectedForAwsHostedProofOfConcept": "cached",
    "why": "Amazon EC2 can host cached Volume Gateway, while stored Volume Gateway cannot be deployed on Amazon EC2.",
    "productionDecisionReminder": "Choose cached or stored based on where the primary dataset must live, latency requirements, and recovery design."
  },
  "cachedVolumeConfiguration": {
    "gatewayName": "fa-migration-volume-gateway",
    "hostPlatform": "Amazon EC2",
    "recommendedReferenceInstanceType": "m5.xlarge",
    "uploadBufferGiB": 150,
    "cacheGiB": 165,
    "iscsiVolumeGiB": 100,
    "iscsiTargetName": "fa-migration-volume",
    "clientProtocol": "iSCSI",
    "dataPlacement": "Primary data in Amazon S3 with frequently accessed data cached locally"
  },
  "storedVolumeConfiguration": {
    "gatewayName": "fa-migration-stored-volume-gateway",
    "hostPlatform": "On-premises supported hypervisor, not Amazon EC2",
    "uploadBufferRequired": true,
    "clientProtocol": "iSCSI",
    "dataPlacement": "Primary data remains local and is asynchronously backed up to AWS"
  },
  "sizingNotes": {
    "uploadBuffer": "Use workload throughput calculations; AWS strongly recommends at least 150 GiB when the formula returns less than that or incoming throughput exceeds outgoing throughput.",
    "cache": "A practical starting guideline is approximately 1.1 times the upload buffer and it should be larger than the upload buffer."
  }
}
```

### Expected results

- The caller is fa-migration-admin.
- DMS_BUCKET and ARCHIVE_BUCKET contain the account ID.
- All five local files exist.
- No file contains a database password or AWS credential.

### Verification checks

- [ ] **task-03-cli-local-files-verify-01** — The local folder is C:\aws-labs\fa-migration.
- [ ] **task-03-cli-local-files-verify-02** — Both bucket names begin fa-migration-.

# Phase 2: Build the DMS source environment

Create a dedicated network, secure MariaDB source, Secrets Manager credential and exact AWS DMS IAM roles.

## task-04-network — Create the DMS training VPC, two subnets and security groups

- **Feature:** DMS networking
- **Difficulty:** Hard
- **Goal:** Create a dedicated two-AZ VPC with public routing, a source-database security group and a DMS replication security group.
- **Why it matters:** A DMS replication subnet group needs subnets in at least two Availability Zones, while the replication instance must be able to reach the source endpoint.
- **Exam relevance:** DMS networking is part of migration planning: source/target reachability can be as important as the migration task itself.
- **Prerequisites:** task-03-cli-local-files
- **Sources:** src-dms-subnet, src-dms-security

### Warnings

- The public subnets are used to keep this disposable lab self-contained without NAT Gateway cost; production database migrations commonly use private connectivity and stricter routing.

### Console / browser route

1. Open VPC in eu-west-2.
2. Create VPC fa-migration-vpc with IPv4 CIDR 10.70.0.0/16.
3. Create fa-migration-public-a in eu-west-2a with CIDR 10.70.1.0/24.
4. Create fa-migration-public-b in eu-west-2b with CIDR 10.70.2.0/24.
5. Enable auto-assign public IPv4 on both training subnets.
6. Create internet gateway fa-migration-igw and attach it to fa-migration-vpc.
7. Create route table fa-migration-public-rt.
8. Add 0.0.0.0/0 to fa-migration-igw.
9. Associate both public subnets with fa-migration-public-rt.
10. Create fa-migration-dms-sg in fa-migration-vpc with no inbound rules and default outbound allowed.
11. Create fa-migration-source-db-sg in fa-migration-vpc.
12. Add inbound MySQL/Aurora TCP 3306 to fa-migration-source-db-sg with source fa-migration-dms-sg.
13. Do not add SSH or internet-wide MySQL access.

### CLI route

#### PowerShell - create VPC

```text
$VPC_ID = aws ec2 create-vpc --cidr-block 10.70.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=fa-migration-vpc},{Key=FollowAlong,Value=fa-migration}]" --query Vpc.VpcId --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create subnet A

```text
$SUBNET_A_ID = aws ec2 create-subnet --vpc-id $VPC_ID --availability-zone eu-west-2a --cidr-block 10.70.1.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-migration-public-a},{Key=FollowAlong,Value=fa-migration}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create subnet B

```text
$SUBNET_B_ID = aws ec2 create-subnet --vpc-id $VPC_ID --availability-zone eu-west-2b --cidr-block 10.70.2.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-migration-public-b},{Key=FollowAlong,Value=fa-migration}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - enable public IP A

```text
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_A_ID --map-public-ip-on-launch --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - enable public IP B

```text
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_B_ID --map-public-ip-on-launch --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create IGW

```text
$IGW_ID = aws ec2 create-internet-gateway --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=fa-migration-igw},{Key=FollowAlong,Value=fa-migration}]" --query InternetGateway.InternetGatewayId --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - attach IGW

```text
aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create route table

```text
$RT_ID = aws ec2 create-route-table --vpc-id $VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-migration-public-rt},{Key=FollowAlong,Value=fa-migration}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - add internet route

```text
aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - associate A

```text
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET_A_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - associate B

```text
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET_B_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create DMS SG

```text
$DMS_SG_ID = aws ec2 create-security-group --group-name fa-migration-dms-sg --description "DMS replication instance" --vpc-id $VPC_ID --query GroupId --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create source DB SG

```text
$SOURCE_SG_ID = aws ec2 create-security-group --group-name fa-migration-source-db-sg --description "MariaDB source reachable only from DMS" --vpc-id $VPC_ID --query GroupId --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - allow DMS to MariaDB

```text
aws ec2 authorize-security-group-ingress --group-id $SOURCE_SG_ID --protocol tcp --port 3306 --source-group $DMS_SG_ID --region eu-west-2 --profile fa-migration-admin
```

### Expected results

- The VPC spans eu-west-2a and eu-west-2b.
- Both subnets have internet routing.
- Only fa-migration-dms-sg can reach source TCP 3306.

### Verification checks

- [ ] **task-04-network-verify-01** — No SSH ingress exists.
- [ ] **task-04-network-verify-02** — The source DB SG does not allow 3306 from 0.0.0.0/0.

## task-05-dms-iam — Create the required DMS and source-instance IAM roles

- **Feature:** Migration service roles
- **Difficulty:** Hard
- **Goal:** Create dms-vpc-role, dms-cloudwatch-logs-role and fa-migration roles for the source EC2 instance, Secrets Manager endpoint authentication and S3 target access.
- **Why it matters:** AWS DMS requires exact built-in role names for VPC and CloudWatch integration, while custom lab roles isolate secret and target-bucket permissions.
- **Exam relevance:** Migration services often assume service roles to reach VPC, logging, secrets and storage resources.
- **Prerequisites:** task-04-network
- **Sources:** src-dms-iam, src-dms-secrets, src-dms-s3-target, src-ssm-agent

### Console / browser route

1. Open IAM.
2. Create dms-vpc-role with trusted service dms.amazonaws.com.
3. Attach AWS managed policy AmazonDMSVPCManagementRole.
4. Create dms-cloudwatch-logs-role with trusted service dms.amazonaws.com.
5. Attach AWS managed policy AmazonDMSCloudWatchLogsRole.
6. Create fa-migration-source-instance-role with trusted service ec2.amazonaws.com.
7. Attach AWS managed policy AmazonSSMManagedInstanceCore.
8. Add an inline policy named fa-migration-source-secret-read allowing secretsmanager:GetSecretValue only for arn:aws:secretsmanager:eu-west-2:<account>:secret:fa-migration/*.
9. Create instance profile fa-migration-source-instance-profile and add fa-migration-source-instance-role.
10. Create fa-migration-dms-secret-role with trust principal dms.eu-west-2.amazonaws.com.
11. Add an inline policy allowing secretsmanager:GetSecretValue on the fa-migration/mysql-source secret path.
12. Create fa-migration-dms-s3-role with trust principal dms.amazonaws.com.
13. Add S3 permissions for the derived DMS bucket and dms-output/*.
14. The complete trust and permission JSON used by CLI is supplied below.

### CLI route

#### PowerShell - save generic DMS trust

```text
@'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "dms.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
'@ | Set-Content -Encoding utf8 .\dms-trust.json
```

#### PowerShell - create dms-vpc-role

```text
aws iam create-role --role-name dms-vpc-role --assume-role-policy-document file://dms-trust.json --profile fa-migration-admin
```

#### PowerShell - attach DMS VPC managed policy

```text
aws iam attach-role-policy --role-name dms-vpc-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonDMSVPCManagementRole --profile fa-migration-admin
```

#### PowerShell - create DMS logs role

```text
aws iam create-role --role-name dms-cloudwatch-logs-role --assume-role-policy-document file://dms-trust.json --profile fa-migration-admin
```

#### PowerShell - attach DMS logs policy

```text
aws iam attach-role-policy --role-name dms-cloudwatch-logs-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonDMSCloudWatchLogsRole --profile fa-migration-admin
```

#### PowerShell - save EC2 trust

```text
@'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
'@ | Set-Content -Encoding utf8 .\ec2-trust.json
```

#### PowerShell - create source role

```text
aws iam create-role --role-name fa-migration-source-instance-role --assume-role-policy-document file://ec2-trust.json --profile fa-migration-admin
```

#### PowerShell - attach SSM core

```text
aws iam attach-role-policy --role-name fa-migration-source-instance-role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore --profile fa-migration-admin
```

#### PowerShell - create source instance profile

```text
aws iam create-instance-profile --instance-profile-name fa-migration-source-instance-profile --profile fa-migration-admin
```

#### PowerShell - add source role to profile

```text
aws iam add-role-to-instance-profile --instance-profile-name fa-migration-source-instance-profile --role-name fa-migration-source-instance-role --profile fa-migration-admin
```

#### PowerShell - save regional DMS secret trust

```text
@'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "dms.eu-west-2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
'@ | Set-Content -Encoding utf8 .\dms-secret-trust.json
```

#### PowerShell - create DMS secret role

```text
aws iam create-role --role-name fa-migration-dms-secret-role --assume-role-policy-document file://dms-secret-trust.json --profile fa-migration-admin
```

#### PowerShell - create DMS S3 role

```text
aws iam create-role --role-name fa-migration-dms-s3-role --assume-role-policy-document file://dms-trust.json --profile fa-migration-admin
```

### Complete editable files / policies

#### DMS service trust

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "dms.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### DMS regional Secrets Manager trust

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "dms.eu-west-2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### EC2 source trust

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### Expected results

- Both exact AWS DMS required roles exist.
- The source EC2 role can use SSM and read only the lab secret path.
- The DMS secret role and DMS S3 role exist.

### Verification checks

- [ ] **task-05-dms-iam-verify-01** — dms-vpc-role has AmazonDMSVPCManagementRole.
- [ ] **task-05-dms-iam-verify-02** — dms-cloudwatch-logs-role has AmazonDMSCloudWatchLogsRole.
- [ ] **task-05-dms-iam-verify-03** — The source role is in fa-migration-source-instance-profile.

## task-06-source-database — Launch and seed the self-managed MariaDB source without exposing its password

- **Feature:** DMS source database
- **Difficulty:** Hard
- **Goal:** Launch one Amazon Linux 2023 source instance, generate a Secrets Manager credential and seed three rows through Systems Manager.
- **Why it matters:** The source database demonstrates a real database endpoint while the credential remains generated and stored in Secrets Manager rather than in the manuscript.
- **Exam relevance:** A full-load-only MySQL-compatible source needs read privileges; CDC requires additional source configuration and replication privileges.
- **Prerequisites:** task-05-dms-iam
- **Sources:** src-dms-mysql, src-dms-secrets, src-ssm-agent, src-al2023-mariadb

### Warnings

- The EC2 source instance and its public IPv4 address can incur charges. Keep it only for the duration of the lab.

### Console / browser route

1. Open EC2 in eu-west-2.
2. Launch one Amazon Linux 2023 instance named fa-migration-mysql-source.
3. Instance type: t3.micro.
4. Subnet: fa-migration-public-a.
5. Auto-assign public IP: enabled.
6. Security group: fa-migration-source-db-sg.
7. IAM instance profile: fa-migration-source-instance-profile.
8. Do not create or select a key pair.
9. Under Advanced details paste source-user-data.sh from Task 3.
10. Launch the instance.
11. Wait for EC2 status checks to pass and for the instance to appear in Systems Manager Managed nodes.
12. Record its private IPv4 address.
13. Open Secrets Manager.
14. Create Other type of secret named fa-migration/mysql-source.
15. The CLI route below shows how to generate an alphanumeric runtime password and store username, password, port and host without printing the password.
16. After the secret exists, use Systems Manager Run Command with configure-source.sh to create migrationdb.customers and three harmless rows.
17. Do not display the secret value in the console after creation.

### CLI route

#### PowerShell - resolve latest AL2023 AMI

```text
$AMI_ID = aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query Parameter.Value --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - rebuild subnet A

```text
$SUBNET_A_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-migration-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - rebuild source SG

```text
$SOURCE_SG_ID = aws ec2 describe-security-groups --filters Name=group-name,Values=fa-migration-source-db-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - encode source user data

```text
$SOURCE_USER_DATA = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ".\source-user-data.sh")))
```

#### PowerShell - launch source EC2

```text
$SOURCE_INSTANCE_ID = aws ec2 run-instances --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_A_ID --security-group-ids $SOURCE_SG_ID --iam-instance-profile Name=fa-migration-source-instance-profile --associate-public-ip-address --user-data $SOURCE_USER_DATA --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=fa-migration-mysql-source},{Key=FollowAlong,Value=fa-migration}]" --query "Instances[0].InstanceId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - wait for source running

```text
aws ec2 wait instance-status-ok --instance-ids $SOURCE_INSTANCE_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - get source private IP

```text
$SOURCE_PRIVATE_IP = aws ec2 describe-instances --instance-ids $SOURCE_INSTANCE_ID --query "Reservations[0].Instances[0].PrivateIpAddress" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - generate runtime DB password

```text
$DB_PASSWORD = aws secretsmanager get-random-password --password-length 24 --exclude-punctuation --query RandomPassword --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - build secret JSON

```text
$SECRET_STRING = @{username="migration_user";password=$DB_PASSWORD;port=3306;host=$SOURCE_PRIVATE_IP} | ConvertTo-Json -Compress
```

#### PowerShell - create secret

```text
$DMS_SECRET_ARN = aws secretsmanager create-secret --name fa-migration/mysql-source --secret-string $SECRET_STRING --tags Key=FollowAlong,Value=fa-migration --query ARN --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - clear local password variable

```text
Remove-Variable DB_PASSWORD
```

#### PowerShell - build source secret policy

```text
$SOURCE_SECRET_POLICY = @{Version="2012-10-17";Statement=@(@{Effect="Allow";Action="secretsmanager:GetSecretValue";Resource=$DMS_SECRET_ARN})} | ConvertTo-Json -Depth 6
```

#### PowerShell - save source secret policy

```text
$SOURCE_SECRET_POLICY | Set-Content -Encoding utf8 .\source-secret-policy.json
```

#### PowerShell - attach source secret policy

```text
aws iam put-role-policy --role-name fa-migration-source-instance-role --policy-name fa-migration-source-secret-read --policy-document file://source-secret-policy.json --profile fa-migration-admin
```

#### PowerShell - attach DMS secret policy

```text
aws iam put-role-policy --role-name fa-migration-dms-secret-role --policy-name fa-migration-dms-secret-read --policy-document file://source-secret-policy.json --profile fa-migration-admin
```

#### PowerShell - encode source configuration script

```text
$CONFIG_B64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ".\configure-source.sh")))
```

#### PowerShell - build remote command

```text
$REMOTE_COMMAND = "echo $CONFIG_B64 | base64 -d > /tmp/configure-source.sh; chmod +x /tmp/configure-source.sh; /tmp/configure-source.sh"
```

#### PowerShell - send source configuration

```text
$COMMAND_ID = aws ssm send-command --instance-ids $SOURCE_INSTANCE_ID --document-name AWS-RunShellScript --parameters commands="$REMOTE_COMMAND" --query Command.CommandId --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - verify command invocation

```text
aws ssm get-command-invocation --command-id $COMMAND_ID --instance-id $SOURCE_INSTANCE_ID --region eu-west-2 --profile fa-migration-admin
```

### Complete editable files / policies

#### source-user-data.sh

```text
#!/bin/bash
set -euxo pipefail
dnf install -y mariadb105-server
systemctl enable mariadb
systemctl start mariadb
```

#### configure-source.sh

```text
#!/bin/bash
set -euo pipefail

SECRET_JSON=$(aws secretsmanager get-secret-value \
  --secret-id fa-migration/mysql-source \
  --region eu-west-2 \
  --query SecretString \
  --output text)

DB_PASSWORD=$(printf '%s' "$SECRET_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["password"])')

sudo mariadb <<SQL
CREATE DATABASE IF NOT EXISTS migrationdb;

CREATE USER IF NOT EXISTS 'migration_user'@'%' IDENTIFIED BY '${DB_PASSWORD}';

GRANT SELECT, RELOAD, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER
ON migrationdb.* TO 'migration_user'@'%';

CREATE TABLE IF NOT EXISTS migrationdb.customers (
  customer_id INT NOT NULL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  migration_note VARCHAR(100) NOT NULL
);

TRUNCATE TABLE migrationdb.customers;

INSERT INTO migrationdb.customers (customer_id, customer_name, migration_note) VALUES
  (1, 'Alpha Training', 'DMS full load row 1'),
  (2, 'Bravo Training', 'DMS full load row 2'),
  (3, 'Charlie Training', 'DMS full load row 3');

FLUSH PRIVILEGES;
SQL
```

### Expected results

- fa-migration-mysql-source is running and managed by Systems Manager.
- fa-migration/mysql-source exists in Secrets Manager.
- The source password was generated at runtime and never appears in a manuscript file.
- configure-source.sh completes successfully.

### Verification checks

- [ ] **task-06-source-database-verify-01** — The source instance has no SSH ingress.
- [ ] **task-06-source-database-verify-02** — The secret host equals the source private IP.
- [ ] **task-06-source-database-verify-03** — The SSM command status is Success.

# Phase 3: Run the DMS full-load migration

Create the DMS replication infrastructure, endpoints and full-load task, then verify database rows arrive in Amazon S3.

## task-07-dms-target-and-roles — Create the DMS S3 target bucket and finish the DMS S3 role

- **Feature:** DMS S3 target
- **Difficulty:** Medium
- **Goal:** Create the deterministic S3 target bucket and grant fa-migration-dms-s3-role access only to that bucket.
- **Why it matters:** Using S3 as the DMS target keeps the database exercise small while still demonstrating endpoint roles and full-load output.
- **Exam relevance:** DMS supports Amazon S3 targets and requires a service access role with bucket permissions.
- **Prerequisites:** task-06-source-database
- **Sources:** src-dms-s3-target

### Console / browser route

1. Open S3.
2. Create the bucket fa-migration-dms-<your recorded AWS account ID> in eu-west-2.
3. Keep Block Public Access enabled.
4. Do not enable public ACLs.
5. Return to IAM.
6. Open fa-migration-dms-s3-role.
7. Add the inline S3 policy generated by the CLI route below.
8. The policy grants bucket listing/location plus object read/write/delete only in the DMS bucket.

### CLI route

#### PowerShell - rebuild account and DMS bucket

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-migration-admin --query Account --output text; $DMS_BUCKET = "fa-migration-dms-$AWS_ACCOUNT_ID"
```

#### PowerShell - create DMS bucket

```text
aws s3api create-bucket --bucket $DMS_BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-migration-admin
```

#### PowerShell - build DMS S3 policy

```text
$DMS_S3_POLICY = @{Version="2012-10-17";Statement=@(@{Effect="Allow";Action=@("s3:GetBucketLocation","s3:ListBucket","s3:ListBucketMultipartUploads");Resource="arn:aws:s3:::$DMS_BUCKET"},@{Effect="Allow";Action=@("s3:PutObject","s3:GetObject","s3:DeleteObject","s3:AbortMultipartUpload");Resource="arn:aws:s3:::$DMS_BUCKET/*"})} | ConvertTo-Json -Depth 8
```

#### PowerShell - save DMS S3 policy

```text
$DMS_S3_POLICY | Set-Content -Encoding utf8 .\dms-s3-policy.json
```

#### PowerShell - attach DMS S3 policy

```text
aws iam put-role-policy --role-name fa-migration-dms-s3-role --policy-name fa-migration-dms-s3-access --policy-document file://dms-s3-policy.json --profile fa-migration-admin
```

#### PowerShell - capture DMS S3 role ARN

```text
$DMS_S3_ROLE_ARN = aws iam get-role --role-name fa-migration-dms-s3-role --query Role.Arn --output text --profile fa-migration-admin
```

### Expected results

- The DMS target bucket exists and remains private.
- The DMS S3 role has access only to the derived training bucket.

### Verification checks

- [ ] **task-07-dms-target-and-roles-verify-01** — The bucket Region is eu-west-2.
- [ ] **task-07-dms-target-and-roles-verify-02** — No unrelated S3 bucket ARN appears in the DMS role policy.

## task-08-dms-replication — Create the DMS subnet group and replication instance

- **Feature:** DMS replication infrastructure
- **Difficulty:** Hard
- **Goal:** Create a two-AZ replication subnet group and one small Single-AZ DMS replication instance for the temporary full-load task.
- **Why it matters:** DMS processing is performed by the replication instance, and the subnet group controls where it can place network interfaces.
- **Exam relevance:** For production ongoing replication, Multi-AZ can improve availability; this short full-load lab uses Single-AZ to reduce temporary cost.
- **Prerequisites:** task-07-dms-target-and-roles
- **Sources:** src-dms-instance, src-dms-create-instance, src-dms-subnet, src-dms-best

### Warnings

- DMS replication instances incur charges while running; delete the instance as soon as the DMS and DataSync phases are complete.

### Console / browser route

1. Open AWS DMS in eu-west-2.
2. Choose Subnet groups.
3. Choose Create subnet group.
4. Name: fa-migration-dms-subnets.
5. VPC: fa-migration-vpc.
6. Add fa-migration-public-a and fa-migration-public-b.
7. Create the subnet group.
8. Choose Replication instances.
9. Choose Create replication instance.
10. Name: fa-migration-replication.
11. Instance class: dms.t3.micro.
12. High availability / Multi-AZ: disabled for this short full-load lab.
13. VPC: fa-migration-vpc.
14. Replication subnet group: fa-migration-dms-subnets.
15. Publicly accessible: enabled for this disposable public-subnet lab.
16. VPC security group: fa-migration-dms-sg.
17. Create the replication instance.
18. Wait until Status is Available.

### CLI route

#### PowerShell - rebuild subnet IDs

```text
$SUBNET_A_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-migration-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-migration-admin; $SUBNET_B_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-migration-public-b --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create DMS subnet group

```text
aws dms create-replication-subnet-group --replication-subnet-group-identifier fa-migration-dms-subnets --replication-subnet-group-description "fa-migration two-AZ DMS subnets" --subnet-ids $SUBNET_A_ID $SUBNET_B_ID --tags Key=FollowAlong,Value=fa-migration --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - rebuild DMS SG

```text
$DMS_SG_ID = aws ec2 describe-security-groups --filters Name=group-name,Values=fa-migration-dms-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create DMS replication instance

```text
aws dms create-replication-instance --replication-instance-identifier fa-migration-replication --replication-instance-class dms.t3.micro --allocated-storage 20 --no-multi-az --publicly-accessible --vpc-security-group-ids $DMS_SG_ID --replication-subnet-group-identifier fa-migration-dms-subnets --tags Key=FollowAlong,Value=fa-migration --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - wait for DMS available

```text
aws dms wait replication-instance-available --filters Name=replication-instance-id,Values=fa-migration-replication --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - capture replication ARN

```text
$REPL_ARN = aws dms describe-replication-instances --filters Name=replication-instance-id,Values=fa-migration-replication --query "ReplicationInstances[0].ReplicationInstanceArn" --output text --region eu-west-2 --profile fa-migration-admin
```

### Expected results

- fa-migration-dms-subnets contains subnets in eu-west-2a and eu-west-2b.
- fa-migration-replication reaches Available.
- The replication instance uses fa-migration-dms-sg.

### Verification checks

- [ ] **task-08-dms-replication-verify-01** — The replication subnet group contains two Availability Zones.
- [ ] **task-08-dms-replication-verify-02** — The DMS instance is Single-AZ only for this temporary full-load exercise.

## task-09-dms-endpoints-task — Create DMS endpoints, test connectivity and run the full-load task

- **Feature:** DMS migration task
- **Difficulty:** Hard
- **Goal:** Create the Secrets Manager-authenticated MariaDB source endpoint, S3 target endpoint and full-load task for migrationdb.
- **Why it matters:** Endpoints describe connectivity; the task describes what tables move and whether the migration is full load, CDC or both.
- **Exam relevance:** SAA-C03 scenarios often distinguish one-time database migration from ongoing replication and low-downtime cutover.
- **Prerequisites:** task-08-dms-replication
- **Sources:** src-dms-endpoints, src-dms-secrets, src-dms-mysql, src-dms-s3-target, src-dms-task-settings, src-dms-full-load

### Console / browser route

1. Open DMS > Endpoints.
2. Choose Create endpoint.
3. Endpoint type: Source endpoint.
4. Endpoint identifier: fa-migration-source-endpoint.
5. Source engine: MySQL.
6. Use AWS Secrets Manager for credentials.
7. Secret: fa-migration/mysql-source.
8. IAM role: fa-migration-dms-secret-role.
9. Database name: migrationdb if the console provides a separate database field.
10. Create the endpoint.
11. Create target endpoint fa-migration-s3-target using engine Amazon S3.
12. Bucket: the derived fa-migration-dms-<account-id> bucket.
13. Bucket folder: dms-output.
14. Service access role: fa-migration-dms-s3-role.
15. Create the target endpoint.
16. Test the source connection using fa-migration-replication and wait for Successful.
17. Test the target connection and wait for Successful.
18. Open Database migration tasks.
19. Choose Create task.
20. Task identifier: fa-migration-full-load.
21. Replication instance: fa-migration-replication.
22. Source: fa-migration-source-endpoint.
23. Target: fa-migration-s3-target.
24. Migration type: Migrate existing data.
25. Table mappings: include schema migrationdb and all tables.
26. Create and start the task.
27. Wait for Load complete / Stopped after the full load finishes.

### CLI route

#### PowerShell - rebuild role and secret ARNs

```text
$DMS_SECRET_ARN = aws secretsmanager describe-secret --secret-id fa-migration/mysql-source --query ARN --output text --region eu-west-2 --profile fa-migration-admin; $DMS_SECRET_ROLE_ARN = aws iam get-role --role-name fa-migration-dms-secret-role --query Role.Arn --output text --profile fa-migration-admin; $DMS_S3_ROLE_ARN = aws iam get-role --role-name fa-migration-dms-s3-role --query Role.Arn --output text --profile fa-migration-admin
```

#### PowerShell - create source endpoint

```text
aws dms create-endpoint --endpoint-identifier fa-migration-source-endpoint --endpoint-type source --engine-name mysql --database-name migrationdb --my-sql-settings SecretsManagerAccessRoleArn=$DMS_SECRET_ROLE_ARN,SecretsManagerSecretId=$DMS_SECRET_ARN --tags Key=FollowAlong,Value=fa-migration --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - rebuild DMS bucket

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-migration-admin --query Account --output text; $DMS_BUCKET = "fa-migration-dms-$AWS_ACCOUNT_ID"
```

#### PowerShell - create S3 target endpoint

```text
aws dms create-endpoint --endpoint-identifier fa-migration-s3-target --endpoint-type target --engine-name s3 --s3-settings ServiceAccessRoleArn=$DMS_S3_ROLE_ARN,BucketFolder=dms-output,BucketName=$DMS_BUCKET,CompressionType=NONE --tags Key=FollowAlong,Value=fa-migration --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - capture endpoint ARNs

```text
$SOURCE_ENDPOINT_ARN = aws dms describe-endpoints --filters Name=endpoint-id,Values=fa-migration-source-endpoint --query "Endpoints[0].EndpointArn" --output text --region eu-west-2 --profile fa-migration-admin; $TARGET_ENDPOINT_ARN = aws dms describe-endpoints --filters Name=endpoint-id,Values=fa-migration-s3-target --query "Endpoints[0].EndpointArn" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - test source connection

```text
aws dms test-connection --replication-instance-arn $REPL_ARN --endpoint-arn $SOURCE_ENDPOINT_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - test target connection

```text
aws dms test-connection --replication-instance-arn $REPL_ARN --endpoint-arn $TARGET_ENDPOINT_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - review connection status

```text
aws dms describe-connections --filters Name=replication-instance-arn,Values=$REPL_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create DMS task

```text
$TASK_ARN = aws dms create-replication-task --replication-task-identifier fa-migration-full-load --source-endpoint-arn $SOURCE_ENDPOINT_ARN --target-endpoint-arn $TARGET_ENDPOINT_ARN --replication-instance-arn $REPL_ARN --migration-type full-load --table-mappings file://dms-table-mappings.json --replication-task-settings file://dms-task-settings.json --tags Key=FollowAlong,Value=fa-migration --query ReplicationTask.ReplicationTaskArn --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - start DMS task

```text
aws dms start-replication-task --replication-task-arn $TASK_ARN --start-replication-task-type start-replication --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - describe DMS task

```text
aws dms describe-replication-tasks --filters Name=replication-task-id,Values=fa-migration-full-load --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - inspect table statistics

```text
aws dms describe-table-statistics --replication-task-arn $TASK_ARN --region eu-west-2 --profile fa-migration-admin
```

### Complete editable files / policies

#### dms-table-mappings.json

```json
{
  "rules": [
    {
      "rule-type": "selection",
      "rule-id": "1",
      "rule-name": "include-migrationdb",
      "object-locator": {
        "schema-name": "migrationdb",
        "table-name": "%"
      },
      "rule-action": "include"
    }
  ]
}
```

#### dms-task-settings.json

```json
{
  "Logging": {
    "EnableLogging": true
  },
  "FullLoadSettings": {
    "TargetTablePrepMode": "DROP_AND_CREATE",
    "StopTaskCachedChangesApplied": false,
    "StopTaskCachedChangesNotApplied": false,
    "MaxFullLoadSubTasks": 4
  }
}
```

### Expected results

- Both endpoint connection tests become successful.
- fa-migration-full-load completes its initial load.
- Table statistics show the customers table was loaded.
- Objects appear under s3://fa-migration-dms-<account-id>/dms-output/.

### Verification checks

- [ ] **task-09-dms-endpoints-task-verify-01** — The source endpoint uses Secrets Manager rather than clear-text endpoint credentials.
- [ ] **task-09-dms-endpoints-task-verify-02** — The task migration type is full-load.
- [ ] **task-09-dms-endpoints-task-verify-03** — At least three source rows are reported for migrationdb.customers.

## task-10-verify-dms-plan — Verify the migrated objects and compare full load with CDC

- **Feature:** DMS verification and planning
- **Difficulty:** Medium
- **Goal:** Prove the three training rows reached S3 and explain when a production database migration would add CDC and Multi-AZ.
- **Why it matters:** A successful task is not enough; migration planning includes validating migrated data and deciding how to handle changes made during the migration window.
- **Exam relevance:** Full load moves existing data; full load plus CDC is the low-downtime pattern when ongoing source changes must be captured.
- **Prerequisites:** task-09-dms-endpoints-task
- **Sources:** src-dms-mysql, src-dms-best, src-dms-full-load

### Console / browser route

1. Open S3.
2. Open the derived fa-migration-dms-<account-id> bucket.
3. Open dms-output.
4. Find the migrationdb/customers output created by DMS.
5. Download or inspect the small CSV object and confirm Alpha Training, Bravo Training and Charlie Training are present.
6. Return to DMS and open fa-migration-full-load.
7. Open Table statistics and confirm migrationdb.customers completed.
8. Review the planning distinction: this lab uses full load because the source is static after seeding.
9. For a live production source that continues changing during migration, plan full load plus CDC and configure the source's change logs/permissions before cutover.
10. For long-running/ongoing replication, consider Multi-AZ for the DMS replication instance.

### CLI route

#### PowerShell - list DMS output

```text
aws s3 ls "s3://$DMS_BUCKET/dms-output/" --recursive --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - download DMS output folder

```text
aws s3 cp "s3://$DMS_BUCKET/dms-output/" .\dms-output\ --recursive --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - inspect downloaded text

```text
Get-ChildItem .\dms-output\ -Recurse -File | ForEach-Object { Get-Content $_.FullName }
```

#### PowerShell - table statistics

```text
aws dms describe-table-statistics --replication-task-arn $TASK_ARN --region eu-west-2 --profile fa-migration-admin
```

### Expected results

- The DMS S3 output contains the three seeded customer rows.
- Table statistics show the customers table completed.
- The learner can explain why CDC is not enabled in this fixed-data lab.

### Verification checks

- [ ] **task-10-verify-dms-plan-verify-01** — The S3 output contains Alpha Training, Bravo Training and Charlie Training.
- [ ] **task-10-verify-dms-plan-verify-02** — No secret or database password appears in the S3 output.

# Phase 4: Transfer DMS objects with DataSync

Create S3 DataSync locations and transfer the migrated objects to a second training bucket.

## task-11-datasync-role-bucket — Create the DataSync archive bucket and S3 access role

- **Feature:** DataSync locations
- **Difficulty:** Hard
- **Goal:** Create a second S3 bucket and a dedicated DataSync role that can read the DMS bucket and write the archive bucket.
- **Why it matters:** DataSync separates transfer locations from the task that controls how and when objects move.
- **Exam relevance:** Use DataSync for managed high-speed data transfer between supported storage systems and AWS storage services.
- **Prerequisites:** task-10-verify-dms-plan
- **Sources:** src-datasync-s3, src-datasync-access

### Console / browser route

1. Open S3.
2. Create fa-migration-archive-<account-id> in eu-west-2 with Block Public Access enabled.
3. Open IAM.
4. Create role fa-migration-datasync-role trusted by datasync.amazonaws.com.
5. Add an inline policy that can list/read the DMS bucket and list/write/delete the archive bucket.
6. Do not give the role access to unrelated buckets.
7. The CLI route below builds the exact bucket ARNs from your verified account ID.

### CLI route

#### PowerShell - rebuild bucket names

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-migration-admin --query Account --output text; $DMS_BUCKET = "fa-migration-dms-$AWS_ACCOUNT_ID"; $ARCHIVE_BUCKET = "fa-migration-archive-$AWS_ACCOUNT_ID"
```

#### PowerShell - create archive bucket

```text
aws s3api create-bucket --bucket $ARCHIVE_BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-migration-admin
```

#### PowerShell - save DataSync trust

```text
@'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "datasync.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
'@ | Set-Content -Encoding utf8 .\datasync-trust.json
```

#### PowerShell - create DataSync role

```text
aws iam create-role --role-name fa-migration-datasync-role --assume-role-policy-document file://datasync-trust.json --profile fa-migration-admin
```

#### PowerShell - build DataSync policy

```text
$DATASYNC_POLICY = @{Version="2012-10-17";Statement=@(@{Effect="Allow";Action=@("s3:GetBucketLocation","s3:ListBucket","s3:ListBucketMultipartUploads");Resource=@("arn:aws:s3:::$DMS_BUCKET","arn:aws:s3:::$ARCHIVE_BUCKET")},@{Effect="Allow";Action=@("s3:GetObject","s3:GetObjectTagging");Resource="arn:aws:s3:::$DMS_BUCKET/*"},@{Effect="Allow";Action=@("s3:PutObject","s3:GetObject","s3:DeleteObject","s3:AbortMultipartUpload","s3:GetObjectTagging","s3:PutObjectTagging");Resource="arn:aws:s3:::$ARCHIVE_BUCKET/*"})} | ConvertTo-Json -Depth 8
```

#### PowerShell - save DataSync policy

```text
$DATASYNC_POLICY | Set-Content -Encoding utf8 .\datasync-s3-policy.json
```

#### PowerShell - attach DataSync policy

```text
aws iam put-role-policy --role-name fa-migration-datasync-role --policy-name fa-migration-datasync-s3-access --policy-document file://datasync-s3-policy.json --profile fa-migration-admin
```

#### PowerShell - capture DataSync role ARN

```text
$DATASYNC_ROLE_ARN = aws iam get-role --role-name fa-migration-datasync-role --query Role.Arn --output text --profile fa-migration-admin
```

### Complete editable files / policies

#### DataSync trust policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "datasync.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### Expected results

- The archive bucket exists and is private.
- fa-migration-datasync-role can read only the DMS bucket and write only the archive bucket.

### Verification checks

- [ ] **task-11-datasync-role-bucket-verify-01** — The DataSync role trust principal is datasync.amazonaws.com.
- [ ] **task-11-datasync-role-bucket-verify-02** — No unrelated bucket ARN appears in the policy.

## task-12-datasync-task — Create DataSync locations, run the object transfer and verify it

- **Feature:** DataSync task execution
- **Difficulty:** Hard
- **Goal:** Create source/destination S3 locations, execute fa-migration-datasync-task and verify the DMS output is copied to the archive bucket.
- **Why it matters:** The task defines source, destination and transfer behavior independently from the buckets themselves.
- **Exam relevance:** DataSync is a managed transfer service; it is not a database change-capture engine and it does not replace DMS for transactional replication.
- **Prerequisites:** task-11-datasync-role-bucket
- **Sources:** src-datasync-s3, src-datasync-task, src-datasync-run, src-datasync-mode

### Warnings

- DataSync can incur transfer and S3 request charges; this lab transfers only a few tiny objects.

### Console / browser route

1. Open DataSync in eu-west-2.
2. Choose Locations.
3. Choose Create location.
4. Location type: Amazon S3.
5. Bucket: fa-migration-dms-<account-id>.
6. Subdirectory: /dms-output.
7. IAM role: fa-migration-datasync-role.
8. Create the source location.
9. Create a second Amazon S3 location for fa-migration-archive-<account-id> with subdirectory /dms-copy and the same role.
10. Choose Tasks.
11. Choose Create task.
12. Choose the DMS S3 location as source.
13. Choose the archive S3 location as destination.
14. Task name: fa-migration-datasync-task.
15. Task mode: Enhanced if available; Basic is also valid for supported S3-to-S3 transfers, but use the mode displayed as recommended by the current console.
16. Keep verification enabled so DataSync verifies transferred data.
17. Create the task.
18. Choose Start.
19. Wait until task execution Status is Success.
20. Open the archive bucket and verify the copied objects exist under dms-copy/.

### CLI route

#### PowerShell - create source DataSync location

```text
$DS_SOURCE_ARN = aws datasync create-location-s3 --s3-bucket-arn "arn:aws:s3:::$DMS_BUCKET" --subdirectory /dms-output --s3-config BucketAccessRoleArn=$DATASYNC_ROLE_ARN --tags Key=FollowAlong,Value=fa-migration --query LocationArn --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create destination DataSync location

```text
$DS_DEST_ARN = aws datasync create-location-s3 --s3-bucket-arn "arn:aws:s3:::$ARCHIVE_BUCKET" --subdirectory /dms-copy --s3-config BucketAccessRoleArn=$DATASYNC_ROLE_ARN --tags Key=FollowAlong,Value=fa-migration --query LocationArn --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - create DataSync task

```text
$DS_TASK_ARN = aws datasync create-task --source-location-arn $DS_SOURCE_ARN --destination-location-arn $DS_DEST_ARN --name fa-migration-datasync-task --options VerifyMode=ONLY_FILES_TRANSFERRED,OverwriteMode=ALWAYS,PreserveDeletedFiles=PRESERVE --tags Key=FollowAlong,Value=fa-migration --query TaskArn --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - start DataSync task

```text
$DS_EXEC_ARN = aws datasync start-task-execution --task-arn $DS_TASK_ARN --query TaskExecutionArn --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - inspect DataSync execution

```text
aws datasync describe-task-execution --task-execution-arn $DS_EXEC_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - list copied objects

```text
aws s3 ls "s3://$ARCHIVE_BUCKET/dms-copy/" --recursive --region eu-west-2 --profile fa-migration-admin
```

### Expected results

- Both S3 locations exist.
- fa-migration-datasync-task has a successful execution.
- The archive bucket contains copies of the DMS output.

### Verification checks

- [ ] **task-12-datasync-task-verify-01** — DataSync execution status is SUCCESS.
- [ ] **task-12-datasync-task-verify-02** — The destination contains migrated customer data.
- [ ] **task-12-datasync-task-verify-03** — The original DMS bucket remains unchanged.

# Phase 5: Plan Volume Gateway configurations

Compare cached and stored volumes, create a concrete cached-volume sizing plan and identify when each design fits.

## task-13-volume-gateway-plan — Build a cached-versus-stored Volume Gateway configuration plan

- **Feature:** Storage Gateway Volume Gateway
- **Difficulty:** Hard
- **Goal:** Use the official Volume Gateway constraints and sizing guidance to complete the supplied configuration plan without launching an expensive gateway appliance.
- **Why it matters:** Storage Gateway solves hybrid storage access, not bulk database or object-copy migration; understanding the data-placement model is the important architecture decision.
- **Exam relevance:** Cached volumes keep primary data in Amazon S3 with hot data cached locally; stored volumes keep primary data local and asynchronously back it up to AWS.
- **Prerequisites:** task-12-datasync-task
- **Sources:** src-sgw-what, src-sgw-concepts, src-sgw-create, src-sgw-ec2, src-sgw-quicklaunch, src-sgw-disk-sizing, src-sgw-volume

### Warnings

- A real EC2-hosted Volume Gateway normally requires an m5.xlarge-class host plus cache/upload-buffer EBS storage; this Follow Along deliberately plans that configuration instead of creating those chargeable resources.

### Console / browser route

1. Open Storage Gateway in eu-west-2.
2. Choose Create gateway.
3. For Gateway type choose Volume Gateway.
4. Review Cached volumes and Stored volumes.
5. Select Cached volumes for the planning exercise.
6. For Host platform choose Amazon EC2 and observe that this platform is available for cached volumes.
7. Do not launch the gateway instance in this lab; the production-style reference host is intentionally documented rather than provisioned to avoid m5.xlarge and large EBS lab charges.
8. Review the supplied volume-gateway-plan.json.
9. Confirm the reference EC2 host is m5.xlarge based on the default EC2 Volume Gateway configuration.
10. Confirm a cached gateway needs separate cache and upload-buffer disks.
11. Confirm the plan uses 150 GiB upload buffer and 165 GiB cache.
12. Confirm the planned iSCSI cached volume is 100 GiB with target name fa-migration-volume.
13. Switch the wizard selection to Stored volumes and confirm Amazon EC2 is not an available stored-volume host platform.
14. Do not activate a gateway; close the wizard after comparing the choices.
15. Record the exam decision: cached volumes are appropriate when S3 is the primary store and frequently accessed blocks need local cache; stored volumes are appropriate when the full primary dataset must remain local while AWS receives asynchronous backups.

### CLI route

#### PowerShell - display the volume plan

```text
Get-Content .\volume-gateway-plan.json
```

#### PowerShell - validate plan JSON

```text
Get-Content .\volume-gateway-plan.json -Raw | ConvertFrom-Json | Format-List
```

### Complete editable files / policies

#### volume-gateway-plan.json

```json
{
  "programme": "Migration & Transfer Follow Along",
  "resourcePrefix": "fa-migration",
  "region": "eu-west-2",
  "volumeGatewayDecision": {
    "selectedForAwsHostedProofOfConcept": "cached",
    "why": "Amazon EC2 can host cached Volume Gateway, while stored Volume Gateway cannot be deployed on Amazon EC2.",
    "productionDecisionReminder": "Choose cached or stored based on where the primary dataset must live, latency requirements, and recovery design."
  },
  "cachedVolumeConfiguration": {
    "gatewayName": "fa-migration-volume-gateway",
    "hostPlatform": "Amazon EC2",
    "recommendedReferenceInstanceType": "m5.xlarge",
    "uploadBufferGiB": 150,
    "cacheGiB": 165,
    "iscsiVolumeGiB": 100,
    "iscsiTargetName": "fa-migration-volume",
    "clientProtocol": "iSCSI",
    "dataPlacement": "Primary data in Amazon S3 with frequently accessed data cached locally"
  },
  "storedVolumeConfiguration": {
    "gatewayName": "fa-migration-stored-volume-gateway",
    "hostPlatform": "On-premises supported hypervisor, not Amazon EC2",
    "uploadBufferRequired": true,
    "clientProtocol": "iSCSI",
    "dataPlacement": "Primary data remains local and is asynchronously backed up to AWS"
  },
  "sizingNotes": {
    "uploadBuffer": "Use workload throughput calculations; AWS strongly recommends at least 150 GiB when the formula returns less than that or incoming throughput exceeds outgoing throughput.",
    "cache": "A practical starting guideline is approximately 1.1 times the upload buffer and it should be larger than the upload buffer."
  }
}
```

### Expected results

- The plan selects cached Volume Gateway for an EC2-hosted proof-of-concept.
- The plan records 150 GiB upload buffer, 165 GiB cache and a 100 GiB iSCSI cached volume.
- The learner can explain why a stored Volume Gateway cannot be hosted on Amazon EC2.

### Verification checks

- [ ] **task-13-volume-gateway-plan-verify-01** — No Storage Gateway appliance or EBS cache/buffer resource was created.
- [ ] **task-13-volume-gateway-plan-verify-02** — The volume plan is complete and contains no unresolved values.

# Phase 6: Review SAA-C03 migration decisions

Distinguish DMS, DataSync and Storage Gateway by data type, transfer pattern, cutover and ongoing-access requirements.

## task-14-exam-review — Review the SAA-C03 migration and transfer decision points

- **Feature:** Exam consolidation
- **Difficulty:** Easy
- **Goal:** Turn the three service exercises into clear selection rules for database migration, data movement and hybrid storage.
- **Why it matters:** The exam commonly tests which migration service matches the data type and whether the requirement is one-time transfer, ongoing replication or ongoing hybrid access.
- **Exam relevance:** DMS, DataSync and Storage Gateway overlap around migration but solve different layers of the problem.
- **Prerequisites:** task-13-volume-gateway-plan
- **Sources:** src-saa-scope, src-dms-best, src-datasync-task, src-sgw-concepts

### Console / browser route

1. AWS DMS: choose it for database migration and replication between supported database endpoints.
2. DMS full load: moves the existing source data once.
3. DMS full load plus CDC: use it when source changes continue during migration and low-downtime cutover is required.
4. DMS replication instance: provides the compute that connects to source/target endpoints and performs replication work.
5. DMS endpoints: define connection details; this lab uses Secrets Manager for source authentication.
6. DataSync: choose it for managed high-speed transfer of files/objects between supported storage systems and AWS storage.
7. DataSync locations define source and destination; a DataSync task defines how the transfer runs.
8. DataSync is not a transactional database CDC engine.
9. Volume Gateway: choose it when applications need ongoing iSCSI block-storage access integrated with AWS, rather than a one-time copy.
10. Cached Volume Gateway: primary data lives in Amazon S3 and frequently accessed data is cached locally.
11. Stored Volume Gateway: primary data remains local and is asynchronously backed up to AWS.
12. Stored Volume Gateway cannot be deployed on Amazon EC2.
13. Exam trigger: migrate a live relational database with minimal downtime -> DMS with CDC where supported.
14. Exam trigger: move large file/object datasets to AWS repeatedly or on schedule -> DataSync.
15. Exam trigger: keep existing block-storage applications using iSCSI while integrating storage with AWS -> Volume Gateway.
16. Exam trap: Storage Gateway provides ongoing hybrid access; it is not simply a faster substitute for DataSync.

### CLI route

#### PowerShell - DMS status

```text
aws dms describe-replication-tasks --filters Name=replication-task-id,Values=fa-migration-full-load --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - DataSync status

```text
aws datasync describe-task --task-arn $DS_TASK_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - display gateway plan

```text
Get-Content .\volume-gateway-plan.json
```

### Expected results

- The learner can distinguish database replication, object/file transfer and hybrid block storage.
- The DMS and DataSync exercises have visible successful outcomes.
- The Volume Gateway plan is complete without a chargeable gateway appliance.

### Verification checks

- [ ] **task-14-exam-review-verify-01** — The learner can choose DMS, DataSync or Volume Gateway from a requirement without relying on service-name clues.

# Phase 7: Reverse-dependency cleanup

Delete DMS, DataSync, S3, EC2, IAM, Secrets Manager, networking and local resources in verified safe order.

## task-15-cleanup-cloud — Delete DMS, DataSync, S3 and source compute in reverse dependency order

- **Feature:** Cloud cleanup
- **Difficulty:** Hard
- **Goal:** Remove migration tasks and endpoints before their roles, then delete copied objects, buckets, source EC2 and network dependencies.
- **Why it matters:** Credentials and service roles must remain available until cloud absence is verified.
- **Exam relevance:** Migration labs can leave costly replication compute or source instances running; cloud resources must be removed before identity cleanup.
- **Prerequisites:** task-14-exam-review
- **Sources:** src-dms-instance, src-datasync-run, src-dms-iam

### Console / browser route

1. Confirm no DataSync execution is running.
2. Delete fa-migration-datasync-task.
3. Delete both DataSync S3 locations.
4. Open DMS and stop fa-migration-full-load only if it is still running.
5. Delete fa-migration-full-load.
6. Delete fa-migration-source-endpoint.
7. Delete fa-migration-s3-target.
8. Delete fa-migration-replication and wait until it disappears.
9. Delete fa-migration-dms-subnets.
10. Open S3.
11. Delete all objects from the archive bucket, then delete the archive bucket.
12. Delete all objects from the DMS target bucket, then delete the DMS target bucket.
13. Terminate fa-migration-mysql-source and wait for Terminated.
14. Delete fa-migration/mysql-source from Secrets Manager using immediate deletion for this disposable lab only after DMS is gone.
15. Delete fa-migration-source-db-sg and fa-migration-dms-sg.
16. Remove the explicit subnet associations from fa-migration-public-rt and delete the route table.
17. Detach and delete fa-migration-igw.
18. Delete fa-migration-public-a and fa-migration-public-b.
19. Delete fa-migration-vpc.
20. Verify no cloud resource from the lab remains before Task 16.

### CLI route

#### PowerShell - delete DataSync task

```text
aws datasync delete-task --task-arn $DS_TASK_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DataSync source location

```text
aws datasync delete-location --location-arn $DS_SOURCE_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DataSync destination location

```text
aws datasync delete-location --location-arn $DS_DEST_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DMS task

```text
aws dms delete-replication-task --replication-task-arn $TASK_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DMS source endpoint

```text
aws dms delete-endpoint --endpoint-arn $SOURCE_ENDPOINT_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DMS target endpoint

```text
aws dms delete-endpoint --endpoint-arn $TARGET_ENDPOINT_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DMS replication instance

```text
aws dms delete-replication-instance --replication-instance-arn $REPL_ARN --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - wait for DMS deletion

```text
aws dms wait replication-instance-deleted --filters Name=replication-instance-id,Values=fa-migration-replication --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DMS subnet group

```text
aws dms delete-replication-subnet-group --replication-subnet-group-identifier fa-migration-dms-subnets --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - empty archive bucket

```text
aws s3 rm "s3://$ARCHIVE_BUCKET" --recursive --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete archive bucket

```text
aws s3api delete-bucket --bucket $ARCHIVE_BUCKET --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - empty DMS bucket

```text
aws s3 rm "s3://$DMS_BUCKET" --recursive --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DMS bucket

```text
aws s3api delete-bucket --bucket $DMS_BUCKET --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - terminate source

```text
aws ec2 terminate-instances --instance-ids $SOURCE_INSTANCE_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - wait for source termination

```text
aws ec2 wait instance-terminated --instance-ids $SOURCE_INSTANCE_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete secret immediately

```text
aws secretsmanager delete-secret --secret-id fa-migration/mysql-source --force-delete-without-recovery --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - rebuild SG IDs

```text
$SOURCE_SG_ID = aws ec2 describe-security-groups --filters Name=group-name,Values=fa-migration-source-db-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2 --profile fa-migration-admin; $DMS_SG_ID = aws ec2 describe-security-groups --filters Name=group-name,Values=fa-migration-dms-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete source SG

```text
aws ec2 delete-security-group --group-id $SOURCE_SG_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete DMS SG

```text
aws ec2 delete-security-group --group-id $DMS_SG_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - rebuild route/VPC IDs

```text
$VPC_ID = aws ec2 describe-vpcs --filters Name=tag:Name,Values=fa-migration-vpc --query "Vpcs[0].VpcId" --output text --region eu-west-2 --profile fa-migration-admin; $RT_ID = aws ec2 describe-route-tables --filters Name=tag:Name,Values=fa-migration-public-rt --query "RouteTables[0].RouteTableId" --output text --region eu-west-2 --profile fa-migration-admin; $IGW_ID = aws ec2 describe-internet-gateways --filters Name=tag:Name,Values=fa-migration-igw --query "InternetGateways[0].InternetGatewayId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - list route associations

```text
$ASSOC_IDS = aws ec2 describe-route-tables --route-table-ids $RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - remove associations

```text
foreach ($A in ($ASSOC_IDS -split "\s+")) { if ($A) { aws ec2 disassociate-route-table --association-id $A --region eu-west-2 --profile fa-migration-admin } }
```

#### PowerShell - delete route table

```text
aws ec2 delete-route-table --route-table-id $RT_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - detach IGW

```text
aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete IGW

```text
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - rebuild subnet IDs

```text
$SUBNET_A_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-migration-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-migration-admin; $SUBNET_B_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-migration-public-b --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete subnet A

```text
aws ec2 delete-subnet --subnet-id $SUBNET_A_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete subnet B

```text
aws ec2 delete-subnet --subnet-id $SUBNET_B_ID --region eu-west-2 --profile fa-migration-admin
```

#### PowerShell - delete VPC

```text
aws ec2 delete-vpc --vpc-id $VPC_ID --region eu-west-2 --profile fa-migration-admin
```

### Expected results

- No DMS replication instance, task, endpoint or subnet group remains.
- No DataSync task or location remains.
- Both S3 training buckets are deleted.
- The MariaDB source instance and secret are deleted.
- The fa-migration VPC and dependent network resources are deleted.

### Verification checks

- [ ] **task-15-cleanup-cloud-verify-01** — No chargeable DMS replication instance or EC2 source remains.
- [ ] **task-15-cleanup-cloud-verify-02** — Cloud cleanup completes before IAM credentials are removed.

## task-16-cleanup-identity-local — Delete migration service roles, temporary credentials and local files

- **Feature:** Identity and local cleanup
- **Difficulty:** Hard
- **Goal:** Remove all lab-created IAM roles/policies and the CLI profile only after cloud verification, then delete the local lab folder last.
- **Why it matters:** Deleting service roles before DMS/DataSync resources are gone can block cleanup or leave resources stranded.
- **Exam relevance:** Reverse dependency includes identities: workload first, service access next, human credentials and local files last.
- **Prerequisites:** task-15-cleanup-cloud
- **Sources:** src-dms-iam, src-datasync-access

### Console / browser route

1. Open IAM.
2. Delete inline policies from fa-migration-datasync-role, fa-migration-dms-s3-role, fa-migration-dms-secret-role and fa-migration-source-instance-role.
3. Detach AmazonSSMManagedInstanceCore from fa-migration-source-instance-role.
4. Remove fa-migration-source-instance-role from fa-migration-source-instance-profile.
5. Delete fa-migration-source-instance-profile.
6. Delete fa-migration-source-instance-role.
7. Delete fa-migration-datasync-role.
8. Delete fa-migration-dms-s3-role.
9. Delete fa-migration-dms-secret-role.
10. Detach AmazonDMSVPCManagementRole from dms-vpc-role and delete dms-vpc-role.
11. Detach AmazonDMSCloudWatchLogsRole from dms-cloudwatch-logs-role and delete dms-cloudwatch-logs-role.
12. Sign in as root only now.
13. Delete the temporary fa-migration-admin access key.
14. Detach and delete fa-migration-admin-policy.
15. Delete fa-migration-admin.
16. Sign out of root.
17. Remove only the fa-migration-admin AWS CLI profile; leave unrelated profiles unchanged.
18. Delete C:\aws-labs\fa-migration last.
19. Read and affirm the programme cleanup acknowledgement.

### CLI route

#### PowerShell - remove source inline policy

```text
aws iam delete-role-policy --role-name fa-migration-source-instance-role --policy-name fa-migration-source-secret-read --profile fa-migration-admin
```

#### PowerShell - detach SSM managed policy

```text
aws iam detach-role-policy --role-name fa-migration-source-instance-role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore --profile fa-migration-admin
```

#### PowerShell - remove role from instance profile

```text
aws iam remove-role-from-instance-profile --instance-profile-name fa-migration-source-instance-profile --role-name fa-migration-source-instance-role --profile fa-migration-admin
```

#### PowerShell - delete instance profile

```text
aws iam delete-instance-profile --instance-profile-name fa-migration-source-instance-profile --profile fa-migration-admin
```

#### PowerShell - delete source role

```text
aws iam delete-role --role-name fa-migration-source-instance-role --profile fa-migration-admin
```

#### PowerShell - delete DataSync inline policy

```text
aws iam delete-role-policy --role-name fa-migration-datasync-role --policy-name fa-migration-datasync-s3-access --profile fa-migration-admin
```

#### PowerShell - delete DataSync role

```text
aws iam delete-role --role-name fa-migration-datasync-role --profile fa-migration-admin
```

#### PowerShell - delete DMS S3 inline policy

```text
aws iam delete-role-policy --role-name fa-migration-dms-s3-role --policy-name fa-migration-dms-s3-access --profile fa-migration-admin
```

#### PowerShell - delete DMS S3 role

```text
aws iam delete-role --role-name fa-migration-dms-s3-role --profile fa-migration-admin
```

#### PowerShell - delete DMS secret inline policy

```text
aws iam delete-role-policy --role-name fa-migration-dms-secret-role --policy-name fa-migration-dms-secret-read --profile fa-migration-admin
```

#### PowerShell - delete DMS secret role

```text
aws iam delete-role --role-name fa-migration-dms-secret-role --profile fa-migration-admin
```

#### PowerShell - detach DMS VPC policy

```text
aws iam detach-role-policy --role-name dms-vpc-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonDMSVPCManagementRole --profile fa-migration-admin
```

#### PowerShell - delete DMS VPC role

```text
aws iam delete-role --role-name dms-vpc-role --profile fa-migration-admin
```

#### PowerShell - detach DMS logs policy

```text
aws iam detach-role-policy --role-name dms-cloudwatch-logs-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonDMSCloudWatchLogsRole --profile fa-migration-admin
```

#### PowerShell - delete DMS logs role

```text
aws iam delete-role --role-name dms-cloudwatch-logs-role --profile fa-migration-admin
```

#### PowerShell - clear CLI access key

```text
aws configure set aws_access_key_id "" --profile fa-migration-admin
```

#### PowerShell - clear CLI secret key

```text
aws configure set aws_secret_access_key "" --profile fa-migration-admin
```

#### PowerShell - clear CLI region

```text
aws configure set region "" --profile fa-migration-admin
```

#### PowerShell - leave lab folder

```text
Set-Location C:\
```

#### PowerShell - delete local lab folder

```text
Remove-Item "C:\aws-labs\fa-migration" -Recurse -Force
```

### Expected results

- All fa-migration service roles are deleted.
- The two exact DMS required roles created by this lab are deleted.
- fa-migration-admin and its access key/policy are deleted.
- The fa-migration-admin CLI profile is removed.
- The local lab folder is removed last.

### Verification checks

- [ ] **task-16-cleanup-identity-local-verify-01** — No unrelated IAM role or CLI profile was deleted.
- [ ] **task-16-cleanup-identity-local-verify-02** — No lab credential or local migration file remains.

# Troubleshooting

## trouble-01 — Source EC2 never appears in Systems Manager

- **Likely cause:** The instance role, internet route, public IP or SSM Agent connectivity is missing.
- **Fix:** Verify fa-migration-source-instance-profile contains the source role, the subnet has 0.0.0.0/0 to fa-migration-igw, and the instance has a public IPv4 address.

## trouble-02 — MariaDB source setup command fails

- **Likely cause:** mariadb105-server is not installed yet, the secret is unreadable, or the source role lacks GetSecretValue.
- **Fix:** Check the SSM command output, confirm user-data completed, and verify fa-migration-source-secret-read references the exact secret ARN.

## trouble-03 — DMS source endpoint connection test fails

- **Likely cause:** TCP 3306 is blocked, the secret host is wrong, MariaDB is not running, or the DMS user was not created.
- **Fix:** Verify the source secret host matches the source private IP, fa-migration-source-db-sg allows 3306 from fa-migration-dms-sg, and the SSM setup command succeeded.

## trouble-04 — DMS target endpoint connection test fails

- **Likely cause:** fa-migration-dms-s3-role cannot access the derived bucket or the target endpoint uses the wrong bucket name.
- **Fix:** Compare the role's inline bucket ARN with DMS_BUCKET and verify the bucket exists in eu-west-2.

## trouble-05 — DMS full load has zero rows

- **Likely cause:** The table mapping does not match migrationdb/customers or the source setup did not seed the table.
- **Fix:** Confirm dms-table-mappings.json selects schema migrationdb and table %, then inspect the source setup SSM command output.

## trouble-06 — DataSync location creation is denied

- **Likely cause:** The DataSync role trust or S3 policy does not permit the requested bucket.
- **Fix:** Confirm the role trusts datasync.amazonaws.com and contains the exact derived DMS and archive bucket ARNs.

## trouble-07 — DataSync task finishes but destination is empty

- **Likely cause:** The source subdirectory does not match the DMS output prefix.
- **Fix:** List the DMS bucket recursively and confirm the source location points to /dms-output.

## trouble-08 — DMS replication instance cannot be deleted

- **Likely cause:** A replication task or endpoint connection still references it.
- **Fix:** Delete the DMS task first, then the endpoints, then retry replication-instance deletion.

## trouble-09 — VPC security group cannot be deleted

- **Likely cause:** A DMS or EC2 network interface is still present.
- **Fix:** Wait until the replication instance and source EC2 instance are fully deleted before retrying only the exact fa-migration security group.

# Ordered manual cleanup

- **Manual only:** `true`
- **Ordering:** `reverse_dependency`
- **Completion gate:** `acknowledgement`

## Cleanup 1: fa-migration-datasync-task

- **Action:** Delete the DataSync task after its execution is complete.
- **Verification:** The task no longer appears.
- **Task:** task-15-cleanup-cloud

## Cleanup 2: DataSync DMS-source and archive-destination locations

- **Action:** Delete both S3 locations.
- **Verification:** No fa-migration DataSync locations remain.
- **Task:** task-15-cleanup-cloud

## Cleanup 3: fa-migration-full-load

- **Action:** Stop it if necessary, then delete the DMS task.
- **Verification:** The task no longer appears in DMS.
- **Task:** task-15-cleanup-cloud

## Cleanup 4: fa-migration-source-endpoint and fa-migration-s3-target

- **Action:** Delete both DMS endpoints.
- **Verification:** No fa-migration endpoint remains.
- **Task:** task-15-cleanup-cloud

## Cleanup 5: fa-migration-replication

- **Action:** Delete the DMS replication instance and wait for deletion.
- **Verification:** No replication instance remains and DMS ENIs are gone.
- **Task:** task-15-cleanup-cloud

## Cleanup 6: fa-migration-dms-subnets

- **Action:** Delete the replication subnet group.
- **Verification:** The subnet group is absent.
- **Task:** task-15-cleanup-cloud

## Cleanup 7: fa-migration-archive-<account-id> and fa-migration-dms-<account-id>

- **Action:** Empty and delete both training buckets.
- **Verification:** Neither bucket remains.
- **Task:** task-15-cleanup-cloud

## Cleanup 8: fa-migration-mysql-source and fa-migration/mysql-source

- **Action:** Terminate the source EC2 instance and delete its Secrets Manager secret.
- **Verification:** No source instance or lab secret remains.
- **Task:** task-15-cleanup-cloud

## Cleanup 9: fa-migration-source-db-sg and fa-migration-dms-sg

- **Action:** Delete both security groups after DMS/EC2 ENIs are gone.
- **Verification:** Neither security group remains.
- **Task:** task-15-cleanup-cloud

## Cleanup 10: fa-migration-public-rt, fa-migration-igw, fa-migration-public-a, fa-migration-public-b, fa-migration-vpc

- **Action:** Remove route-table associations and delete the network in dependency order.
- **Verification:** No fa-migration VPC resource remains.
- **Task:** task-15-cleanup-cloud

## Cleanup 11: fa-migration service roles and dms-vpc-role/dms-cloudwatch-logs-role

- **Action:** Remove inline/managed policies and delete roles/instance profile.
- **Verification:** No lab-created service role remains.
- **Task:** task-16-cleanup-identity-local

## Cleanup 12: fa-migration-admin access key, policy and user

- **Action:** Use root only after cloud verification to remove the temporary human identity.
- **Verification:** The user, access key and policy are absent.
- **Task:** task-16-cleanup-identity-local

## Cleanup 13: AWS CLI profile fa-migration-admin

- **Action:** Remove only the training profile.
- **Verification:** Unrelated profiles remain unchanged.
- **Task:** task-16-cleanup-identity-local

## Cleanup 14: C:\aws-labs\fa-migration

- **Action:** Delete the exact local lab folder last.
- **Verification:** The local lab folder is absent.
- **Task:** task-16-cleanup-identity-local

## Programme cleanup acknowledgement

I verified that fa-migration-datasync-task and both DataSync locations are deleted; fa-migration-full-load, both DMS endpoints, fa-migration-replication and fa-migration-dms-subnets are deleted; both fa-migration S3 buckets are empty and deleted; fa-migration-mysql-source and fa-migration/mysql-source are deleted; both migration security groups and every fa-migration VPC resource are deleted; all fa-migration service roles plus the lab-created dms-vpc-role and dms-cloudwatch-logs-role are deleted; the temporary fa-migration-admin access key, policy, IAM user and CLI profile are removed; no Storage Gateway appliance was created; unrelated resources and profiles are unchanged; and only then was C:\aws-labs\fa-migration deleted.

# Official sources

## src-saa-scope — In-Scope AWS Services - AWS Certified Solutions Architect - Associate

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- **Purpose:** Confirms AWS DMS, DataSync and Storage Gateway are in scope for SAA-C03.
- **Used by:** task-01-prerequisites, task-14-exam-review

## src-dms-instance — Working with an AWS DMS replication instance

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.html
- **Purpose:** Explains the replication instance role in reading, processing and loading migration data.
- **Used by:** task-08-dms-replication, task-15-cleanup-cloud

## src-dms-create-instance — Creating a replication instance

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.Creating.html
- **Purpose:** Console settings for a DMS replication instance.
- **Used by:** task-08-dms-replication

## src-dms-subnet — Setting up a network for a replication instance

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.VPC.html
- **Purpose:** Replication subnet groups and the requirement for subnets in at least two Availability Zones.
- **Used by:** task-04-network, task-08-dms-replication

## src-dms-security — Security in AWS Database Migration Service

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Security.html
- **Purpose:** Network connectivity and security-group requirements between DMS and database endpoints.
- **Used by:** task-04-network

## src-dms-iam — Identity and access management for AWS Database Migration Service

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/security-iam.html
- **Purpose:** Required dms-vpc-role and dms-cloudwatch-logs-role role names and managed policies.
- **Used by:** task-02-bootstrap-user, task-05-dms-iam, task-15-cleanup-cloud, task-16-cleanup-identity-local

## src-dms-secrets — Using secrets to access AWS DMS endpoints

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/security_iam_secretsmanager.html
- **Purpose:** Secrets Manager authentication for DMS endpoints without embedding database credentials in the manuscript.
- **Used by:** task-03-cli-local-files, task-05-dms-iam, task-06-source-database, task-09-dms-endpoints-task

## src-dms-mysql — Using a MySQL-compatible database as a source for AWS DMS

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html
- **Purpose:** MySQL/MariaDB source permissions and full-load versus CDC differences.
- **Used by:** task-06-source-database, task-09-dms-endpoints-task, task-10-verify-dms-plan

## src-dms-s3-target — Using Amazon S3 as a target for AWS DMS

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html
- **Purpose:** S3 target endpoint permissions and behavior.
- **Used by:** task-05-dms-iam, task-07-dms-target-and-roles, task-09-dms-endpoints-task

## src-dms-endpoints — Creating source and target endpoints

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Endpoints.Creating.html
- **Purpose:** DMS source and target endpoint creation.
- **Used by:** task-09-dms-endpoints-task

## src-dms-task-settings — Specifying task settings for AWS DMS tasks

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TaskSettings.html
- **Purpose:** Task settings, migration behavior and validation concepts.
- **Used by:** task-09-dms-endpoints-task

## src-dms-full-load — Full-load task settings

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TaskSettings.FullLoad.html
- **Purpose:** Full-load settings and parallelism.
- **Used by:** task-09-dms-endpoints-task, task-10-verify-dms-plan

## src-dms-best — Best practices for AWS Database Migration Service

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.html
- **Purpose:** Planning replication capacity and full-load/CDC considerations.
- **Used by:** task-08-dms-replication, task-10-verify-dms-plan, task-14-exam-review

## src-datasync-s3 — Configuring AWS DataSync transfers with Amazon S3

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html
- **Purpose:** S3 DataSync locations and access roles.
- **Used by:** task-11-datasync-role-bucket, task-12-datasync-task

## src-datasync-task — Creating a task for transferring your data

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/datasync/latest/userguide/create-task-how-to.html
- **Purpose:** Source location, destination location and task settings.
- **Used by:** task-12-datasync-task, task-14-exam-review

## src-datasync-run — Starting a task to transfer your data

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/datasync/latest/userguide/run-task.html
- **Purpose:** Task execution and statuses.
- **Used by:** task-12-datasync-task, task-15-cleanup-cloud

## src-datasync-mode — Choosing a task mode for your data transfer

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/datasync/latest/userguide/choosing-task-mode.html
- **Purpose:** Enhanced versus Basic mode planning.
- **Used by:** task-12-datasync-task

## src-datasync-access — IAM customer managed policies for AWS DataSync

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/datasync/latest/userguide/using-identity-based-policies.html
- **Purpose:** IAM role/trust patterns for DataSync access.
- **Used by:** task-02-bootstrap-user, task-11-datasync-role-bucket, task-16-cleanup-identity-local

## src-sgw-what — What is Volume Gateway?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/vgw/WhatIsStorageGateway.html
- **Purpose:** Volume Gateway and iSCSI use cases.
- **Used by:** task-13-volume-gateway-plan

## src-sgw-concepts — How Volume Gateway works

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html
- **Purpose:** Cached versus stored volume data placement.
- **Used by:** task-13-volume-gateway-plan, task-14-exam-review

## src-sgw-create — Creating a Volume Gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/vgw/create-volume-gateway.html
- **Purpose:** Gateway type, cached/stored options and host platform limits.
- **Used by:** task-13-volume-gateway-plan

## src-sgw-ec2 — Deploy a customized Amazon EC2 instance for Volume Gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/vgw/ec2-gateway-common.html
- **Purpose:** Amazon EC2 supports cached Volume Gateway, not stored Volume Gateway.
- **Used by:** task-13-volume-gateway-plan

## src-sgw-quicklaunch — Deploy a default Amazon EC2 host for Volume Gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/vgw/ec2-quicklaunch-settings.html
- **Purpose:** Reference EC2 host configuration including m5.xlarge default instance type.
- **Used by:** task-13-volume-gateway-plan

## src-sgw-disk-sizing — Deciding the amount of local disk storage

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/vgw/decide-local-disks-and-sizes.html
- **Purpose:** Cached-gateway cache/upload-buffer disk requirements and sizing guidelines.
- **Used by:** task-03-cli-local-files, task-13-volume-gateway-plan

## src-sgw-volume — Creating a storage volume

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/vgw/GettingStartedCreateVolumes.html
- **Purpose:** Cached volume capacity and iSCSI volume creation.
- **Used by:** task-13-volume-gateway-plan

## src-ssm-agent — Find AMIs with the SSM Agent preinstalled

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html
- **Purpose:** Amazon Linux 2023 normally includes SSM Agent for keyless management.
- **Used by:** task-05-dms-iam, task-06-source-database

## src-al2023-mariadb — AL2023 upgrades from AL2

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/linux/al2023/release-notes/vercmp-AL2-AL2023.12.html
- **Purpose:** Confirms the mariadb105-server package name on Amazon Linux 2023.
- **Used by:** task-06-source-database

# Quality report

- **Phase count:** 7
- **Task count:** 16
- **Checkbox count:** 280
- **CLI command count:** 155
- **Editable-block count:** 15
- **Verification count:** 35
- **Cleanup-item count:** 14
- **Official-source count:** 27
- **Missing items:** 0
- **Uncertain items:** 0

# Offline conversion boundary

This preview and JSON manuscript are offline educational authoring artifacts only. They have not been locally validated by Study Tracker, imported, accepted, approved, published or fingerprinted.
