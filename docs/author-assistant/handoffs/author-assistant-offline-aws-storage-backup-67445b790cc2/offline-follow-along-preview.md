# AWS Storage and Backup Follow Along

> **Status:** Offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Hard
- **Exam workspace:** AWS SAA-C03
- **AWS Region:** eu-west-2
- **Training prefix:** `fa-s3-storage`

## Required outcome

Create and restore encrypted EBS storage from a snapshot; build encrypted Regional EFS across two Availability Zones with mount targets and an access point; select the correct Amazon FSx family; create an AWS Backup vault, plan, resource selection and EBS/EFS recovery points; choose S3 Glacier retrieval options and Storage Gateway architectures; and safely delete only resources created by the lab.

## Completion definition

- Two SSM-managed EC2 clients are created in eu-west-2a and eu-west-2b without SSH access.
- A 4-GiB encrypted gp3 EBS volume is formatted, written, snapshotted and restored to a second encrypted volume.
- The restored EBS volume contains the original training file and remains AZ-scoped to eu-west-2a.
- An encrypted Regional EFS file system has one mount target in each client Availability Zone.
- An EFS access point enforces /shared and POSIX identity 1001:1001; client B reads a file written by client A.
- A complete Amazon FSx decision matrix distinguishes Windows File Server, Lustre, ONTAP and OpenZFS.
- AWS Backup contains a scheduled plan/explicit resource selection plus completed on-demand EBS and EFS recovery points.
- A complete S3 Glacier retrieval matrix covers Instant Retrieval, Flexible Retrieval Expedited/Standard/Bulk and Deep Archive Standard/Bulk without incurring archive minimum-duration lab charges.
- A complete Storage Gateway architecture matrix covers S3 File Gateway, FSx File Gateway, cached/stored Volume Gateway and Tape Gateway.
- All recovery points, storage, compute, networking, service roles, credentials and local files are removed in reverse dependency order.

## Warnings

### Cost

This lab creates two t3.micro EC2 clients with public IPv4 addresses, two 4-GiB EBS data volumes, one EBS snapshot, a small Regional EFS file system, two EFS mount targets, AWS Backup recovery points and a backup vault/plan. These can incur charges. FSx, Glacier archive objects and Storage Gateway appliances are intentionally not provisioned because their minimum capacities, minimum storage durations or gateway infrastructure can create disproportionate lab cost.

### Safety

Delete only exact fa-s3-storage resources and generated IDs derived from those names. Recovery points must be deleted before the backup vault; EFS mount targets before the EFS file system; EC2/EFS ENIs before security groups/VPC.

### Credentials

Never create root access keys and never place fa-s3-storage-admin credentials in user data, scripts, JSON plans, screenshots, chat or Study Tracker. Use only protected aws configure prompts.

### Region

Every active cloud resource in this Follow Along is created in eu-west-2. EBS source/restored volumes and client A are in eu-west-2a; client B is in eu-west-2b; Regional EFS spans the Region through mount targets in both AZs.

# Phase 1: Prepare the storage lab

Create the temporary IAM identities, networking and two SSM-managed EC2 clients.

## task-01-prerequisites — Verify the training account and storage scope

- **Feature:** Prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm AWS CLI access, the disposable account and eu-west-2 before creating storage resources.
- **Why it matters:** EBS, EFS, FSx, Backup, S3 archive classes and Storage Gateway solve different storage layers, so the lab starts by fixing account/Region and cost boundaries.
- **Exam relevance:** SAA-C03 storage questions focus on workload access patterns, durability, performance, backup and recovery choices.
- **Prerequisites:** None
- **Sources:** src-ebs-volumes, src-efs-what, src-fsx-docs, src-backup-what, src-glacier-classes, src-storagegateway-docs

### Console / browser route

1. Sign in to the disposable AWS training account.
2. Confirm no resource beginning fa-s3-storage exists.
3. Open Windows PowerShell and run aws --version.
4. Confirm all active cloud resources in this lab will be created in Europe (London) eu-west-2.
5. Do not create or use root access keys.
6. Root is used only for the one-time bootstrap in Task 2 and final removal of the temporary training IAM user in Task 18.

### CLI route

#### PowerShell - verify AWS CLI

```text
aws --version
```

### Expected results

- AWS CLI prints a version.
- No fa-s3-storage resource exists yet.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — The active console Region is eu-west-2.
- [ ] **task-01-prerequisites-verify-02** — No lab resource has been created.

## task-02-bootstrap-user — Create the temporary storage IAM training user

- **Feature:** IAM bootstrap
- **Difficulty:** Hard
- **Goal:** Use root only to create fa-s3-storage-admin, one temporary access key and the complete storage/backup lab policy.
- **Why it matters:** The training identity needs explicit rights for EBS, EFS, AWS Backup, SSM, VPC and the two custom service roles without AdministratorAccess.
- **Exam relevance:** Storage protection still depends on controlled identities and service roles.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-backup-role, src-ebs-encryption, src-efs-encryption

### Console / browser route

1. Sign in as root only for this bootstrap task.
2. Open IAM > Users > Create user.
3. User name: fa-s3-storage-admin.
4. Enable console access.
5. Create the user.
6. Open Policies > Create policy > JSON.
7. Paste the complete fa-s3-storage-admin-policy below.
8. Choose Next and set Policy name to fa-s3-storage-admin-policy.
9. Create the policy.
10. Attach it directly to fa-s3-storage-admin.
11. Open Security credentials and create exactly one access key for CLI use.
12. Copy it only to a temporary secure location.
13. Sign out of root.
14. Sign in as fa-s3-storage-admin for routine work.

### CLI route

#### No root CLI command

```text
# Complete this one-time IAM bootstrap in the AWS console. Do not create root access keys.
```

### Complete editable files / policies

#### fa-s3-storage-admin-policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadTrainingState",
      "Effect": "Allow",
      "Action": [
        "sts:GetCallerIdentity",
        "ec2:Describe*",
        "elasticfilesystem:DescribeFileSystems",
        "elasticfilesystem:DescribeMountTargets",
        "elasticfilesystem:DescribeAccessPoints",
        "backup:ListBackupVaults",
        "backup:ListBackupPlans",
        "backup:ListBackupJobs",
        "backup:ListRecoveryPointsByBackupVault",
        "backup:DescribeBackupJob",
        "backup:DescribeRecoveryPoint",
        "iam:GetRole",
        "iam:GetInstanceProfile",
        "iam:ListAttachedRolePolicies",
        "ssm:DescribeInstanceInformation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingVpcAndEc2",
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
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "ec2:CreateTags",
        "ec2:DeleteTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingEbs",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVolume",
        "ec2:DeleteVolume",
        "ec2:AttachVolume",
        "ec2:DetachVolume",
        "ec2:ModifyVolume",
        "ec2:CreateSnapshot",
        "ec2:DeleteSnapshot"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ReadLatestAmazonLinuxAndUseSystemsManager",
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:SendCommand",
        "ssm:GetCommandInvocation",
        "ssm:ListCommandInvocations",
        "ssm:StartSession",
        "ssm:TerminateSession"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingEfs",
      "Effect": "Allow",
      "Action": [
        "elasticfilesystem:CreateFileSystem",
        "elasticfilesystem:DeleteFileSystem",
        "elasticfilesystem:CreateMountTarget",
        "elasticfilesystem:DeleteMountTarget",
        "elasticfilesystem:CreateAccessPoint",
        "elasticfilesystem:DeleteAccessPoint",
        "elasticfilesystem:TagResource",
        "elasticfilesystem:UntagResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingBackup",
      "Effect": "Allow",
      "Action": [
        "backup:CreateBackupVault",
        "backup:DeleteBackupVault",
        "backup:CreateBackupPlan",
        "backup:GetBackupPlan",
        "backup:DeleteBackupPlan",
        "backup:CreateBackupSelection",
        "backup:ListBackupSelections",
        "backup:DeleteBackupSelection",
        "backup:StartBackupJob",
        "backup:DeleteRecoveryPoint"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageOnlyTrainingRolesAndProfiles",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:CreateInstanceProfile",
        "iam:DeleteInstanceProfile",
        "iam:AddRoleToInstanceProfile",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:TagRole",
        "iam:UntagRole"
      ],
      "Resource": [
        "arn:aws:iam::*:role/fa-s3-storage-*",
        "arn:aws:iam::*:instance-profile/fa-s3-storage-*"
      ]
    },
    {
      "Sid": "PassOnlyTrainingRolesToTheirServices",
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": [
        "arn:aws:iam::*:role/fa-s3-storage-ec2-role",
        "arn:aws:iam::*:role/fa-s3-storage-backup-role"
      ],
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": [
            "ec2.amazonaws.com",
            "backup.amazonaws.com"
          ]
        }
      }
    }
  ]
}
```

### Expected results

- The training user and customer managed policy exist.
- Exactly one temporary access key exists.
- Root is signed out.

### Verification checks

- [ ] **task-02-bootstrap-user-verify-01** — AdministratorAccess is not attached.
- [ ] **task-02-bootstrap-user-verify-02** — The routine browser session uses fa-s3-storage-admin.

## task-03-cli-files — Configure the CLI profile and create the storage decision files

- **Feature:** CLI and study files
- **Difficulty:** Medium
- **Goal:** Configure fa-s3-storage-admin and create every local script/decision file required later.
- **Why it matters:** Keeping scripts and architecture matrices visible makes storage configuration reproducible and keeps credentials out of the manuscript.
- **Exam relevance:** Hard storage labs should prove both implementation and service-selection reasoning.
- **Prerequisites:** task-02-bootstrap-user
- **Sources:** src-ebs-volumes, src-fsx-docs, src-glacier-options, src-storagegateway-docs

### Console / browser route

1. Open Windows PowerShell.
2. Run aws configure --profile fa-s3-storage-admin.
3. Enter the temporary access key only in protected prompts.
4. Set Region eu-west-2 and output json.
5. Run get-caller-identity.
6. Create C:\aws-labs\fa-s3-storage.
7. Create instance-user-data.sh, prepare-ebs.sh, unmount-ebs.sh, verify-restored-ebs.sh, ebs-volume-types.json, fsx-selection.json, backup-plan.json, s3-glacier-retrieval-plan.json and storage-gateway-architecture.json.
8. Paste the complete blocks supplied below into their matching files.
9. Do not put AWS credentials into any local file.

### CLI route

#### PowerShell - configure profile

```text
aws configure --profile fa-s3-storage-admin
```

#### PowerShell - verify identity

```text
aws sts get-caller-identity --profile fa-s3-storage-admin
```

#### PowerShell - capture account ID

```text
$AWS_ACCOUNT_ID = aws sts get-caller-identity --profile fa-s3-storage-admin --query Account --output text
```

#### PowerShell - create lab folder

```text
New-Item -ItemType Directory -Force "C:\aws-labs\fa-s3-storage"
```

#### PowerShell - enter lab folder

```text
Set-Location "C:\aws-labs\fa-s3-storage"
```

### Complete editable files / policies

#### instance-user-data.sh

```text
#!/bin/bash
set -euxo pipefail

dnf install -y amazon-efs-utils xfsprogs

systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent
```

#### prepare-ebs.sh

```text
#!/bin/bash
set -euo pipefail

ROOT_SOURCE=$(findmnt -n -o SOURCE /)
ROOT_PARENT=$(lsblk -no PKNAME "$ROOT_SOURCE" | head -n1)

DATA_DEV=$(lsblk -dpno NAME,TYPE | awk '$2=="disk"{print $1}' | grep -v "/dev/${ROOT_PARENT}" | head -n1)

if [ -z "${DATA_DEV}" ]; then
  echo "No non-root EBS data disk was detected."
  exit 1
fi

sudo mkfs.xfs -f "${DATA_DEV}"
sudo mkdir -p /mnt/ebs
sudo mount "${DATA_DEV}" /mnt/ebs

echo "fa-s3-storage encrypted EBS snapshot training file" | sudo tee /mnt/ebs/ebs-training.txt
sudo sync

sudo cat /mnt/ebs/ebs-training.txt
lsblk -f
```

#### unmount-ebs.sh

```text
#!/bin/bash
set -euo pipefail

sudo sync
sudo umount /mnt/ebs
```

#### verify-restored-ebs.sh

```text
#!/bin/bash
set -euo pipefail

ROOT_SOURCE=$(findmnt -n -o SOURCE /)
ROOT_PARENT=$(lsblk -no PKNAME "$ROOT_SOURCE" | head -n1)

DATA_DEV=$(lsblk -dpno NAME,TYPE | awk '$2=="disk"{print $1}' | grep -v "/dev/${ROOT_PARENT}" | head -n1)

if [ -z "${DATA_DEV}" ]; then
  echo "No restored non-root EBS data disk was detected."
  exit 1
fi

sudo mkdir -p /mnt/ebs-restored
sudo mount -o ro "${DATA_DEV}" /mnt/ebs-restored
sudo cat /mnt/ebs-restored/ebs-training.txt
```

#### ebs-volume-types.json

```json
{
  "programme": "AWS Storage and Backup Follow Along",
  "resourcePrefix": "fa-s3-storage",
  "ebsVolumeSelection": [
    {
      "type": "gp3",
      "family": "General Purpose SSD",
      "selection": "Default general-purpose choice for many boot volumes, applications, virtual desktops, and development/test workloads. Performance can be provisioned independently from capacity within service limits.",
      "handsOn": true
    },
    {
      "type": "gp2",
      "family": "General Purpose SSD",
      "selection": "Previous-generation general-purpose SSD where performance scales with volume size. Prefer gp3 for new designs unless a compatibility or migration reason dictates otherwise.",
      "handsOn": false
    },
    {
      "type": "io2",
      "family": "Provisioned IOPS SSD",
      "selection": "High-performance, latency-sensitive and IOPS-intensive workloads that require provisioned IOPS and stronger durability characteristics.",
      "handsOn": false
    },
    {
      "type": "io1",
      "family": "Provisioned IOPS SSD",
      "selection": "Previous-generation provisioned-IOPS SSD. Existing workloads may use it, while io2 is the current higher-durability provisioned-IOPS choice.",
      "handsOn": false
    },
    {
      "type": "st1",
      "family": "Throughput Optimized HDD",
      "selection": "Frequently accessed, throughput-intensive large sequential workloads such as big-data processing and log processing. Not suitable as a boot volume.",
      "handsOn": false
    },
    {
      "type": "sc1",
      "family": "Cold HDD",
      "selection": "Lowest-cost EBS HDD option for infrequently accessed large sequential data where throughput requirements are modest. Not suitable as a boot volume.",
      "handsOn": false
    }
  ],
  "snapshotModel": {
    "scope": "Snapshots are point-in-time backups of EBS volumes and are incremental after the first snapshot.",
    "restore": "Create a new EBS volume from a snapshot in the Availability Zone where the volume will be attached.",
    "encryption": "Encrypted volumes create encrypted snapshots; volumes created from encrypted snapshots remain encrypted."
  }
}
```

#### fsx-selection.json

```json
{
  "programme": "AWS Storage and Backup Follow Along",
  "resourcePrefix": "fa-s3-storage",
  "fsxSelection": [
    {
      "fileSystem": "Amazon FSx for Windows File Server",
      "protocols": ["SMB"],
      "identity": "Microsoft Active Directory authentication",
      "bestFit": "Windows-native shared file workloads that require SMB and Windows file-system features."
    },
    {
      "fileSystem": "Amazon FSx for Lustre",
      "protocols": ["Lustre", "POSIX-compatible file access"],
      "identity": "Linux/POSIX workload model",
      "bestFit": "High-performance parallel workloads such as HPC, machine learning and analytics; supports integration with Amazon S3 data repositories."
    },
    {
      "fileSystem": "Amazon FSx for NetApp ONTAP",
      "protocols": ["NFS", "SMB", "iSCSI", "NVMe"],
      "identity": "ONTAP storage virtual machines and protocol-specific identity controls",
      "bestFit": "NetApp/ONTAP migrations and multi-protocol enterprise workloads that need file and block access."
    },
    {
      "fileSystem": "Amazon FSx for OpenZFS",
      "protocols": ["NFS v3", "NFS v4.0", "NFS v4.1", "NFS v4.2"],
      "identity": "NFS/POSIX-oriented workload model",
      "bestFit": "NFS-based workloads that benefit from OpenZFS semantics and managed ZFS storage."
    }
  ],
  "examDecisionRule": "Match the protocol, operating-system ecosystem, performance profile, data-source integration, and migration requirement before selecting an FSx family.",
  "notCreatedInThisLab": "No FSx file system is created because the service choices have different minimum capacities, deployment requirements and ongoing costs."
}
```

#### backup-plan.json

```json
{
  "BackupPlanName": "fa-s3-storage-plan",
  "Rules": [
    {
      "RuleName": "fa-s3-storage-daily",
      "TargetBackupVaultName": "fa-s3-storage-vault",
      "ScheduleExpression": "cron(0 2 * * ? *)",
      "StartWindowMinutes": 60,
      "CompletionWindowMinutes": 180,
      "Lifecycle": {
        "DeleteAfterDays": 7
      }
    }
  ]
}
```

#### s3-glacier-retrieval-plan.json

```json
{
  "programme": "AWS Storage and Backup Follow Along",
  "resourcePrefix": "fa-s3-storage",
  "s3GlacierRetrievalChoices": [
    {
      "storageClass": "S3 Glacier Instant Retrieval",
      "access": "Real-time, millisecond access",
      "restoreRequestRequired": false,
      "selection": "Rarely accessed archive data that still requires immediate retrieval."
    },
    {
      "storageClass": "S3 Glacier Flexible Retrieval",
      "access": {
        "Expedited": "Typically 1-5 minutes",
        "Standard": "Typically 3-5 hours without Batch Operations",
        "Bulk": "Typically 5-12 hours"
      },
      "restoreRequestRequired": true,
      "selection": "Long-term archives where retrieval can range from minutes to hours and cost can be traded against speed."
    },
    {
      "storageClass": "S3 Glacier Deep Archive",
      "access": {
        "Standard": "Typically within 12 hours",
        "Bulk": "Typically within 48 hours"
      },
      "restoreRequestRequired": true,
      "selection": "Very long-lived archives with the lowest urgency for retrieval."
    }
  ],
  "costSafety": {
    "minimumStorageDuration": {
      "S3 Glacier Flexible Retrieval": "90 days",
      "S3 Glacier Deep Archive": "180 days"
    },
    "labDecision": "Do not create archive-class objects merely for the lab because early deletion can still incur minimum-storage-duration charges."
  }
}
```

#### storage-gateway-architecture.json

```json
{
  "programme": "AWS Storage and Backup Follow Along",
  "resourcePrefix": "fa-s3-storage",
  "storageGatewayArchitecture": [
    {
      "gateway": "Amazon S3 File Gateway",
      "clientInterface": ["NFS", "SMB"],
      "cloudStorage": "Amazon S3 objects",
      "bestFit": "On-premises applications that need file-protocol access while storing data as objects in S3."
    },
    {
      "gateway": "Amazon FSx File Gateway",
      "clientInterface": ["SMB"],
      "cloudStorage": "Amazon FSx for Windows File Server",
      "bestFit": "On-premises users/applications that need low-latency cached access to Windows file shares hosted on FSx for Windows File Server."
    },
    {
      "gateway": "Volume Gateway - cached volumes",
      "clientInterface": ["iSCSI block volumes"],
      "cloudStorage": "Primary data stored in Amazon S3 with frequently accessed blocks cached locally",
      "bestFit": "Hybrid block workloads where on-premises capacity should be minimized while retaining low-latency access to hot blocks."
    },
    {
      "gateway": "Volume Gateway - stored volumes",
      "clientInterface": ["iSCSI block volumes"],
      "cloudStorage": "Primary data remains local with asynchronous backups to AWS",
      "bestFit": "Hybrid block workloads that require the full primary dataset on premises."
    },
    {
      "gateway": "Tape Gateway",
      "clientInterface": ["Virtual tape library over iSCSI"],
      "cloudStorage": "Virtual tapes archived in AWS cloud storage",
      "bestFit": "Existing tape-based backup applications that need cloud-backed virtual tape media."
    }
  ],
  "architectureReminder": "Storage Gateway is for ongoing hybrid storage integration. It is not a substitute for EBS/EFS/FSx when the workload is already fully hosted inside AWS."
}
```

### Expected results

- The CLI identity is fa-s3-storage-admin.
- All nine local files exist.
- No file contains AWS credentials.

### Verification checks

- [ ] **task-03-cli-files-verify-01** — The EBS, FSx, Glacier and Storage Gateway files parse as JSON.
- [ ] **task-03-cli-files-verify-02** — AWS_ACCOUNT_ID is recorded for later ARN construction.

## task-04-network-roles — Create the two-AZ VPC, security groups and service roles

- **Feature:** Lab networking and roles
- **Difficulty:** Hard
- **Goal:** Create a dedicated VPC with two public subnets, no inbound EC2 access, NFS restricted from the EC2 SG to the EFS SG, an EC2 SSM role and an AWS Backup role.
- **Why it matters:** Two EC2 clients in different Availability Zones are needed to prove EFS shared access, while SSM avoids SSH keys/inbound SSH.
- **Exam relevance:** The network is deliberately minimal so the lab remains about storage rather than application networking.
- **Prerequisites:** task-03-cli-files
- **Sources:** src-efs-mount-target, src-efs-utils, src-backup-role

### Console / browser route

1. Open VPC in eu-west-2.
2. Create fa-s3-storage-vpc with CIDR 10.130.0.0/16.
3. Create fa-s3-storage-public-a in eu-west-2a with 10.130.1.0/24.
4. Create fa-s3-storage-public-b in eu-west-2b with 10.130.2.0/24.
5. Enable auto-assign public IPv4 on both subnets.
6. Create fa-s3-storage-igw and attach it to the VPC.
7. Create fa-s3-storage-public-rt, add 0.0.0.0/0 to the IGW, and associate both subnets.
8. Create fa-s3-storage-ec2-sg with no inbound rules and default outbound.
9. Create fa-s3-storage-efs-sg with inbound NFS TCP 2049 from fa-s3-storage-ec2-sg only.
10. Open IAM and create fa-s3-storage-ec2-role trusted by ec2.amazonaws.com.
11. Attach AmazonSSMManagedInstanceCore.
12. Create instance profile fa-s3-storage-ec2-profile and add the EC2 role.
13. Create fa-s3-storage-backup-role trusted by backup.amazonaws.com.
14. Attach AWSBackupServiceRolePolicyForBackup.

### CLI route

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

#### PowerShell - create EC2 role

```text
aws iam create-role --role-name fa-s3-storage-ec2-role --assume-role-policy-document file://ec2-trust.json --profile fa-s3-storage-admin
```

#### PowerShell - attach SSM managed policy

```text
aws iam attach-role-policy --role-name fa-s3-storage-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore --profile fa-s3-storage-admin
```

#### PowerShell - create instance profile

```text
aws iam create-instance-profile --instance-profile-name fa-s3-storage-ec2-profile --profile fa-s3-storage-admin
```

#### PowerShell - add EC2 role

```text
aws iam add-role-to-instance-profile --instance-profile-name fa-s3-storage-ec2-profile --role-name fa-s3-storage-ec2-role --profile fa-s3-storage-admin
```

#### PowerShell - save Backup trust

```text
@'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "backup.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
'@ | Set-Content -Encoding utf8 .\backup-trust.json
```

#### PowerShell - create Backup role

```text
aws iam create-role --role-name fa-s3-storage-backup-role --assume-role-policy-document file://backup-trust.json --profile fa-s3-storage-admin
```

#### PowerShell - attach Backup managed policy

```text
aws iam attach-role-policy --role-name fa-s3-storage-backup-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup --profile fa-s3-storage-admin
```

#### PowerShell - create VPC

```text
$VPC_ID = aws ec2 create-vpc --cidr-block 10.130.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=fa-s3-storage-vpc}]" --query Vpc.VpcId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - subnet A

```text
$SUBNET_A_ID = aws ec2 create-subnet --vpc-id $VPC_ID --availability-zone eu-west-2a --cidr-block 10.130.1.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-s3-storage-public-a}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - subnet B

```text
$SUBNET_B_ID = aws ec2 create-subnet --vpc-id $VPC_ID --availability-zone eu-west-2b --cidr-block 10.130.2.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-s3-storage-public-b}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - enable public IP A

```text
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_A_ID --map-public-ip-on-launch --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - enable public IP B

```text
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_B_ID --map-public-ip-on-launch --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - create IGW

```text
$IGW_ID = aws ec2 create-internet-gateway --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=fa-s3-storage-igw}]" --query InternetGateway.InternetGatewayId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - attach IGW

```text
aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - route table

```text
$RT_ID = aws ec2 create-route-table --vpc-id $VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-s3-storage-public-rt}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - default route

```text
aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - associate A

```text
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET_A_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - associate B

```text
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET_B_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - create EC2 SG

```text
$EC2_SG_ID = aws ec2 create-security-group --group-name fa-s3-storage-ec2-sg --description "SSM-managed storage lab clients" --vpc-id $VPC_ID --query GroupId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - create EFS SG

```text
$EFS_SG_ID = aws ec2 create-security-group --group-name fa-s3-storage-efs-sg --description "NFS only from storage lab clients" --vpc-id $VPC_ID --query GroupId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - allow NFS from client SG

```text
aws ec2 authorize-security-group-ingress --group-id $EFS_SG_ID --protocol tcp --port 2049 --source-group $EC2_SG_ID --region eu-west-2 --profile fa-s3-storage-admin
```

### Complete editable files / policies

#### EC2 trust policy

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

#### AWS Backup trust policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "backup.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### Expected results

- The VPC spans eu-west-2a and eu-west-2b.
- EC2 SG has no inbound rules.
- EFS SG accepts NFS only from EC2 SG.
- Both service roles exist.

### Verification checks

- [ ] **task-04-network-roles-verify-01** — fa-s3-storage-ec2-role has AmazonSSMManagedInstanceCore.
- [ ] **task-04-network-roles-verify-02** — fa-s3-storage-backup-role has AWSBackupServiceRolePolicyForBackup.

## task-05-launch-clients — Launch one SSM-managed EC2 storage client in each Availability Zone

- **Feature:** EC2 storage clients
- **Difficulty:** Hard
- **Goal:** Launch fa-s3-storage-client-a and fa-s3-storage-client-b with no SSH key and the EFS/XFS packages installed by user data.
- **Why it matters:** The clients prove AZ-scoped EBS behavior and multi-AZ EFS shared access without opening inbound administrative ports.
- **Exam relevance:** EBS volumes attach within an Availability Zone; EFS is network file storage designed for concurrent clients.
- **Prerequisites:** task-04-network-roles
- **Sources:** src-ebs-create, src-efs-utils

### Warnings

- The t3.micro clients and their public IPv4 addresses can incur charges while running.

### Console / browser route

1. Open EC2.
2. Launch fa-s3-storage-client-a using Amazon Linux 2023, t3.micro, subnet fa-s3-storage-public-a, fa-s3-storage-ec2-sg, no key pair and instance profile fa-s3-storage-ec2-profile.
3. Under Advanced details paste instance-user-data.sh.
4. Launch fa-s3-storage-client-b with the same settings except subnet fa-s3-storage-public-b.
5. Wait for both EC2 status checks to pass.
6. Open Systems Manager > Fleet Manager / Managed nodes and confirm both instances are managed.
7. Do not add SSH ingress.

### CLI route

#### PowerShell - latest AL2023 AMI

```text
$AMI_ID = aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query Parameter.Value --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - encode user data

```text
$USER_DATA_B64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ".\instance-user-data.sh")))
```

#### PowerShell - launch client A

```text
$INSTANCE_A_ID = aws ec2 run-instances --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_A_ID --security-group-ids $EC2_SG_ID --iam-instance-profile Name=fa-s3-storage-ec2-profile --associate-public-ip-address --user-data $USER_DATA_B64 --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=fa-s3-storage-client-a},{Key=FollowAlong,Value=fa-s3-storage}]" --query "Instances[0].InstanceId" --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - launch client B

```text
$INSTANCE_B_ID = aws ec2 run-instances --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_B_ID --security-group-ids $EC2_SG_ID --iam-instance-profile Name=fa-s3-storage-ec2-profile --associate-public-ip-address --user-data $USER_DATA_B64 --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=fa-s3-storage-client-b},{Key=FollowAlong,Value=fa-s3-storage}]" --query "Instances[0].InstanceId" --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - wait for status checks

```text
aws ec2 wait instance-status-ok --instance-ids $INSTANCE_A_ID $INSTANCE_B_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - verify SSM clients

```text
aws ssm describe-instance-information --filters Key=InstanceIds,Values=$INSTANCE_A_ID,$INSTANCE_B_ID --region eu-west-2 --profile fa-s3-storage-admin
```

### Complete editable files / policies

#### instance-user-data.sh

```text
#!/bin/bash
set -euxo pipefail

dnf install -y amazon-efs-utils xfsprogs

systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent
```

### Expected results

- Both clients are running in different AZs.
- Both are managed by Systems Manager.
- No SSH key or inbound SSH rule exists.

### Verification checks

- [ ] **task-05-launch-clients-verify-01** — Client A is in eu-west-2a.
- [ ] **task-05-launch-clients-verify-02** — Client B is in eu-west-2b.

# Phase 2: Work with encrypted EBS and snapshots

Select an EBS volume family, create encrypted gp3 block storage, write data, snapshot it and restore the data to a new encrypted volume.

## task-06-ebs-types-volume — Select an EBS volume type and create encrypted gp3 storage

- **Feature:** EBS volume types and encryption
- **Difficulty:** Hard
- **Goal:** Use the EBS selection matrix, then create a 4-GiB encrypted gp3 volume in eu-west-2a and write a known file from client A.
- **Why it matters:** The exercise separates volume-family selection from encryption: all EBS volume types support encryption, while workload characteristics determine gp3/io2/st1/sc1 selection.
- **Exam relevance:** EBS is AZ-scoped block storage and gp3 is a strong general-purpose default for many workloads.
- **Prerequisites:** task-05-launch-clients
- **Sources:** src-ebs-volumes, src-ebs-features, src-ebs-create, src-ebs-use, src-ebs-encryption, src-ebs-encryption-how

### Console / browser route

1. Open ebs-volume-types.json and review gp3, gp2, io2, io1, st1 and sc1.
2. Open EC2 > Volumes.
3. Choose Create volume.
4. Volume type: gp3.
5. Size: 4 GiB.
6. Availability Zone: eu-west-2a.
7. Encryption: enabled.
8. Use the account's default EBS KMS key.
9. Tag Name=fa-s3-storage-ebs-source and FollowAlong=fa-s3-storage.
10. Create the volume.
11. Select it, choose Actions > Attach volume, select fa-s3-storage-client-a and use device name /dev/sdf.
12. Use Systems Manager Run Command with prepare-ebs.sh.
13. Verify the script prints the known fa-s3-storage training line.

### CLI route

#### PowerShell - review type matrix

```text
Get-Content .\ebs-volume-types.json
```

#### PowerShell - create encrypted gp3

```text
$EBS_SOURCE_ID = aws ec2 create-volume --availability-zone eu-west-2a --volume-type gp3 --size 4 --encrypted --tag-specifications "ResourceType=volume,Tags=[{Key=Name,Value=fa-s3-storage-ebs-source},{Key=FollowAlong,Value=fa-s3-storage}]" --query VolumeId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - wait volume

```text
aws ec2 wait volume-available --volume-ids $EBS_SOURCE_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - attach volume

```text
aws ec2 attach-volume --volume-id $EBS_SOURCE_ID --instance-id $INSTANCE_A_ID --device /dev/sdf --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - encode prepare script

```text
$PREPARE_B64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ".\prepare-ebs.sh")))
```

#### PowerShell - build remote prepare commands

```text
$PREPARE_PARAMS = @{commands=@("echo $PREPARE_B64 | base64 -d > /tmp/prepare-ebs.sh","chmod +x /tmp/prepare-ebs.sh","sudo /tmp/prepare-ebs.sh")} | ConvertTo-Json -Compress
```

#### PowerShell - run prepare script

```text
$PREPARE_CMD_ID = aws ssm send-command --instance-ids $INSTANCE_A_ID --document-name AWS-RunShellScript --parameters $PREPARE_PARAMS --query Command.CommandId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - get script result

```text
aws ssm get-command-invocation --command-id $PREPARE_CMD_ID --instance-id $INSTANCE_A_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - verify encryption

```text
aws ec2 describe-volumes --volume-ids $EBS_SOURCE_ID --query "Volumes[0].{Type:VolumeType,Size:Size,Encrypted:Encrypted,KmsKeyId:KmsKeyId,AZ:AvailabilityZone}" --region eu-west-2 --profile fa-s3-storage-admin
```

### Complete editable files / policies

#### ebs-volume-types.json

```json
{
  "programme": "AWS Storage and Backup Follow Along",
  "resourcePrefix": "fa-s3-storage",
  "ebsVolumeSelection": [
    {
      "type": "gp3",
      "family": "General Purpose SSD",
      "selection": "Default general-purpose choice for many boot volumes, applications, virtual desktops, and development/test workloads. Performance can be provisioned independently from capacity within service limits.",
      "handsOn": true
    },
    {
      "type": "gp2",
      "family": "General Purpose SSD",
      "selection": "Previous-generation general-purpose SSD where performance scales with volume size. Prefer gp3 for new designs unless a compatibility or migration reason dictates otherwise.",
      "handsOn": false
    },
    {
      "type": "io2",
      "family": "Provisioned IOPS SSD",
      "selection": "High-performance, latency-sensitive and IOPS-intensive workloads that require provisioned IOPS and stronger durability characteristics.",
      "handsOn": false
    },
    {
      "type": "io1",
      "family": "Provisioned IOPS SSD",
      "selection": "Previous-generation provisioned-IOPS SSD. Existing workloads may use it, while io2 is the current higher-durability provisioned-IOPS choice.",
      "handsOn": false
    },
    {
      "type": "st1",
      "family": "Throughput Optimized HDD",
      "selection": "Frequently accessed, throughput-intensive large sequential workloads such as big-data processing and log processing. Not suitable as a boot volume.",
      "handsOn": false
    },
    {
      "type": "sc1",
      "family": "Cold HDD",
      "selection": "Lowest-cost EBS HDD option for infrequently accessed large sequential data where throughput requirements are modest. Not suitable as a boot volume.",
      "handsOn": false
    }
  ],
  "snapshotModel": {
    "scope": "Snapshots are point-in-time backups of EBS volumes and are incremental after the first snapshot.",
    "restore": "Create a new EBS volume from a snapshot in the Availability Zone where the volume will be attached.",
    "encryption": "Encrypted volumes create encrypted snapshots; volumes created from encrypted snapshots remain encrypted."
  }
}
```

#### prepare-ebs.sh

```text
#!/bin/bash
set -euo pipefail

ROOT_SOURCE=$(findmnt -n -o SOURCE /)
ROOT_PARENT=$(lsblk -no PKNAME "$ROOT_SOURCE" | head -n1)

DATA_DEV=$(lsblk -dpno NAME,TYPE | awk '$2=="disk"{print $1}' | grep -v "/dev/${ROOT_PARENT}" | head -n1)

if [ -z "${DATA_DEV}" ]; then
  echo "No non-root EBS data disk was detected."
  exit 1
fi

sudo mkfs.xfs -f "${DATA_DEV}"
sudo mkdir -p /mnt/ebs
sudo mount "${DATA_DEV}" /mnt/ebs

echo "fa-s3-storage encrypted EBS snapshot training file" | sudo tee /mnt/ebs/ebs-training.txt
sudo sync

sudo cat /mnt/ebs/ebs-training.txt
lsblk -f
```

### Expected results

- The source volume is gp3, 4 GiB, eu-west-2a and Encrypted=true.
- The training file exists on the XFS volume.

### Verification checks

- [ ] **task-06-ebs-types-volume-verify-01** — KmsKeyId is populated.
- [ ] **task-06-ebs-types-volume-verify-02** — The volume is attached only to client A in the same Availability Zone.

## task-07-ebs-snapshot-restore — Create an EBS snapshot and restore an encrypted volume

- **Feature:** EBS snapshots
- **Difficulty:** Hard
- **Goal:** Unmount/detach the source volume, create a snapshot, restore it to a second encrypted volume in eu-west-2a and prove the file survived.
- **Why it matters:** Snapshots are point-in-time backups; restoration creates a new EBS volume rather than mounting the snapshot directly as a normal filesystem.
- **Exam relevance:** Snapshots support backup/DR workflows and preserve encryption for encrypted source volumes.
- **Prerequisites:** task-06-ebs-types-volume
- **Sources:** src-ebs-snapshots, src-ebs-create-snapshot, src-ebs-snapshot-how, src-ebs-create, src-ebs-encryption

### Console / browser route

1. Use SSM to run unmount-ebs.sh on client A.
2. Detach fa-s3-storage-ebs-source and wait for Available.
3. Create a snapshot tagged Name=fa-s3-storage-ebs-snapshot.
4. Wait until the snapshot is Completed.
5. Open the snapshot details and confirm Encrypted=true.
6. Create a new gp3 volume from the snapshot in eu-west-2a named fa-s3-storage-ebs-restored.
7. Confirm the restored volume is encrypted.
8. Attach it to client A as /dev/sdf.
9. Run verify-restored-ebs.sh through SSM.
10. Confirm the original training line is printed from the restored filesystem.

### CLI route

#### PowerShell - encode unmount script

```text
$UNMOUNT_B64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ".\unmount-ebs.sh")))
```

#### PowerShell - send unmount

```text
$UNMOUNT_PARAMS = @{commands=@("echo $UNMOUNT_B64 | base64 -d > /tmp/unmount-ebs.sh","chmod +x /tmp/unmount-ebs.sh","sudo /tmp/unmount-ebs.sh")} | ConvertTo-Json -Compress; $UNMOUNT_CMD_ID = aws ssm send-command --instance-ids $INSTANCE_A_ID --document-name AWS-RunShellScript --parameters $UNMOUNT_PARAMS --query Command.CommandId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - detach source

```text
aws ec2 detach-volume --volume-id $EBS_SOURCE_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - wait source available

```text
aws ec2 wait volume-available --volume-ids $EBS_SOURCE_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - create snapshot

```text
$SNAPSHOT_ID = aws ec2 create-snapshot --volume-id $EBS_SOURCE_ID --description "fa-s3-storage encrypted snapshot lab" --tag-specifications "ResourceType=snapshot,Tags=[{Key=Name,Value=fa-s3-storage-ebs-snapshot},{Key=FollowAlong,Value=fa-s3-storage}]" --query SnapshotId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - wait snapshot

```text
aws ec2 wait snapshot-completed --snapshot-ids $SNAPSHOT_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - create restored volume

```text
$EBS_RESTORED_ID = aws ec2 create-volume --availability-zone eu-west-2a --snapshot-id $SNAPSHOT_ID --volume-type gp3 --tag-specifications "ResourceType=volume,Tags=[{Key=Name,Value=fa-s3-storage-ebs-restored},{Key=FollowAlong,Value=fa-s3-storage}]" --query VolumeId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - wait restored volume

```text
aws ec2 wait volume-available --volume-ids $EBS_RESTORED_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - attach restored volume

```text
aws ec2 attach-volume --volume-id $EBS_RESTORED_ID --instance-id $INSTANCE_A_ID --device /dev/sdf --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - encode verify script

```text
$VERIFY_B64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path ".\verify-restored-ebs.sh")))
```

#### PowerShell - verify restored data

```text
$VERIFY_PARAMS = @{commands=@("echo $VERIFY_B64 | base64 -d > /tmp/verify-restored-ebs.sh","chmod +x /tmp/verify-restored-ebs.sh","sudo /tmp/verify-restored-ebs.sh")} | ConvertTo-Json -Compress; $VERIFY_CMD_ID = aws ssm send-command --instance-ids $INSTANCE_A_ID --document-name AWS-RunShellScript --parameters $VERIFY_PARAMS --query Command.CommandId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - read restore output

```text
aws ssm get-command-invocation --command-id $VERIFY_CMD_ID --instance-id $INSTANCE_A_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - verify snapshot encryption

```text
aws ec2 describe-snapshots --snapshot-ids $SNAPSHOT_ID --query "Snapshots[0].{State:State,Encrypted:Encrypted,KmsKeyId:KmsKeyId}" --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - verify restored encryption

```text
aws ec2 describe-volumes --volume-ids $EBS_RESTORED_ID --query "Volumes[0].{Encrypted:Encrypted,KmsKeyId:KmsKeyId,AZ:AvailabilityZone}" --region eu-west-2 --profile fa-s3-storage-admin
```

### Complete editable files / policies

#### unmount-ebs.sh

```text
#!/bin/bash
set -euo pipefail

sudo sync
sudo umount /mnt/ebs
```

#### verify-restored-ebs.sh

```text
#!/bin/bash
set -euo pipefail

ROOT_SOURCE=$(findmnt -n -o SOURCE /)
ROOT_PARENT=$(lsblk -no PKNAME "$ROOT_SOURCE" | head -n1)

DATA_DEV=$(lsblk -dpno NAME,TYPE | awk '$2=="disk"{print $1}' | grep -v "/dev/${ROOT_PARENT}" | head -n1)

if [ -z "${DATA_DEV}" ]; then
  echo "No restored non-root EBS data disk was detected."
  exit 1
fi

sudo mkdir -p /mnt/ebs-restored
sudo mount -o ro "${DATA_DEV}" /mnt/ebs-restored
sudo cat /mnt/ebs-restored/ebs-training.txt
```

### Expected results

- The snapshot is Completed and encrypted.
- The restored volume is encrypted and contains the original training file.

### Verification checks

- [ ] **task-07-ebs-snapshot-restore-verify-01** — The restored volume is in eu-west-2a so it can attach to client A.
- [ ] **task-07-ebs-snapshot-restore-verify-02** — The file content exactly matches the source-volume content.

# Phase 3: Build Regional EFS shared storage

Create encrypted Regional EFS, one mount target per Availability Zone and an access point, then prove shared access from two EC2 clients.

## task-08-create-efs — Create encrypted Regional EFS and mount targets in two Availability Zones

- **Feature:** EFS Regional and mount targets
- **Difficulty:** Hard
- **Goal:** Create one encrypted Regional EFS file system and one mount target in each AZ used by the EC2 clients.
- **Why it matters:** Regional EFS stores data redundantly across multiple Availability Zones, while mount targets provide NFS endpoints inside the VPC.
- **Exam relevance:** EFS is shared network file storage, unlike AZ-scoped EBS block volumes.
- **Prerequisites:** task-07-ebs-snapshot-restore
- **Sources:** src-efs-what, src-efs-how, src-efs-mount-target, src-efs-create-mt, src-efs-encryption

### Console / browser route

1. Open EFS in eu-west-2.
2. Choose Create file system.
3. Choose Customize.
4. Name: fa-s3-storage-efs.
5. File system type/storage class: Regional.
6. Encryption at rest: enabled.
7. Performance mode: General Purpose.
8. Throughput mode: Bursting.
9. VPC: fa-s3-storage-vpc.
10. Create a mount target in eu-west-2a using fa-s3-storage-public-a and fa-s3-storage-efs-sg.
11. Create a mount target in eu-west-2b using fa-s3-storage-public-b and fa-s3-storage-efs-sg.
12. Create the file system.
13. Wait until both mount targets are Available.

### CLI route

#### PowerShell - create encrypted Regional EFS

```text
$FILE_SYSTEM_ID = aws efs create-file-system --creation-token fa-s3-storage-efs --performance-mode generalPurpose --throughput-mode bursting --encrypted --tags Key=Name,Value=fa-s3-storage-efs Key=FollowAlong,Value=fa-s3-storage --query FileSystemId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - create mount target A

```text
$MOUNT_TARGET_A_ID = aws efs create-mount-target --file-system-id $FILE_SYSTEM_ID --subnet-id $SUBNET_A_ID --security-groups $EFS_SG_ID --query MountTargetId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - create mount target B

```text
$MOUNT_TARGET_B_ID = aws efs create-mount-target --file-system-id $FILE_SYSTEM_ID --subnet-id $SUBNET_B_ID --security-groups $EFS_SG_ID --query MountTargetId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - inspect EFS

```text
aws efs describe-file-systems --file-system-id $FILE_SYSTEM_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - inspect mount targets

```text
aws efs describe-mount-targets --file-system-id $FILE_SYSTEM_ID --region eu-west-2 --profile fa-s3-storage-admin
```

### Expected results

- The EFS file system is encrypted and Regional.
- One mount target exists in eu-west-2a and one in eu-west-2b.

### Verification checks

- [ ] **task-08-create-efs-verify-01** — Both mount targets use fa-s3-storage-efs-sg.
- [ ] **task-08-create-efs-verify-02** — Only one mount target exists per Availability Zone.

## task-09-efs-access-point-share — Create an EFS access point and prove cross-AZ shared file access

- **Feature:** EFS access points
- **Difficulty:** Hard
- **Goal:** Create fa-s3-storage-ap with /shared as its enforced root and POSIX identity 1001:1001, mount it over TLS on both clients, write from A and read from B.
- **Why it matters:** Access points create application-specific entry points that can enforce POSIX identity and a root directory without creating a separate EFS file system.
- **Exam relevance:** EFS can be mounted concurrently from multiple AZs, making it appropriate for shared Linux file storage.
- **Prerequisites:** task-08-create-efs
- **Sources:** src-efs-accesspoints, src-efs-create-ap, src-efs-mount-ap, src-efs-utils, src-efs-what

### Console / browser route

1. Open EFS > Access points.
2. Choose Create access point.
3. File system: fa-s3-storage-efs.
4. Name: fa-s3-storage-ap.
5. Root directory path: /shared.
6. POSIX user ID: 1001.
7. POSIX group ID: 1001.
8. Root directory owner user/group: 1001/1001.
9. Permissions: 0750.
10. Create the access point.
11. Use the EFS mount helper with TLS and the access point on both clients.
12. Write shared-from-a.txt from client A.
13. Read the same file from client B.
14. Confirm both clients use the same EFS file system despite being in different Availability Zones.

### CLI route

#### PowerShell - create EFS access point

```text
$AP_ID = aws efs create-access-point --file-system-id $FILE_SYSTEM_ID --posix-user Uid=1001,Gid=1001 --root-directory "Path=/shared,CreationInfo={OwnerUid=1001,OwnerGid=1001,Permissions=0750}" --tags Key=Name,Value=fa-s3-storage-ap Key=FollowAlong,Value=fa-s3-storage --query AccessPointId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - mount on A

```text
$MOUNT_A_PARAMS = @{commands=@("sudo mkdir -p /mnt/efs","sudo mount -t efs -o tls,accesspoint=$AP_ID $FILE_SYSTEM_ID`:/ /mnt/efs")} | ConvertTo-Json -Compress; $MOUNT_A_CMD = aws ssm send-command --instance-ids $INSTANCE_A_ID --document-name AWS-RunShellScript --parameters $MOUNT_A_PARAMS --query Command.CommandId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - mount on B

```text
$MOUNT_B_PARAMS = @{commands=@("sudo mkdir -p /mnt/efs","sudo mount -t efs -o tls,accesspoint=$AP_ID $FILE_SYSTEM_ID`:/ /mnt/efs")} | ConvertTo-Json -Compress; $MOUNT_B_CMD = aws ssm send-command --instance-ids $INSTANCE_B_ID --document-name AWS-RunShellScript --parameters $MOUNT_B_PARAMS --query Command.CommandId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - write from A

```text
$WRITE_PARAMS = @{commands=@("echo shared-from-client-a | sudo tee /mnt/efs/shared-from-a.txt","sudo cat /mnt/efs/shared-from-a.txt")} | ConvertTo-Json -Compress; $WRITE_CMD = aws ssm send-command --instance-ids $INSTANCE_A_ID --document-name AWS-RunShellScript --parameters $WRITE_PARAMS --query Command.CommandId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - read from B

```text
$READ_PARAMS = @{commands=@("sudo cat /mnt/efs/shared-from-a.txt")} | ConvertTo-Json -Compress; $READ_CMD = aws ssm send-command --instance-ids $INSTANCE_B_ID --document-name AWS-RunShellScript --parameters $READ_PARAMS --query Command.CommandId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - get client B read result

```text
aws ssm get-command-invocation --command-id $READ_CMD --instance-id $INSTANCE_B_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - describe access point

```text
aws efs describe-access-points --access-point-id $AP_ID --region eu-west-2 --profile fa-s3-storage-admin
```

### Expected results

- Both clients mount the EFS access point over TLS.
- Client B reads shared-from-client-a from the file written by client A.

### Verification checks

- [ ] **task-09-efs-access-point-share-verify-01** — Access point RootDirectory is /shared.
- [ ] **task-09-efs-access-point-share-verify-02** — POSIX UID/GID are 1001.
- [ ] **task-09-efs-access-point-share-verify-03** — The file system remains encrypted at rest.

## task-10-ebs-vs-efs-review — Compare EBS and EFS failure/attachment boundaries

- **Feature:** EBS versus EFS
- **Difficulty:** Medium
- **Goal:** Use the deployed resources to explain AZ-scoped block storage versus Regional shared file storage.
- **Why it matters:** Choosing storage based on protocol and availability boundary is more important than memorizing service names.
- **Exam relevance:** EBS is block storage attached to compute; Regional EFS is shared NFS with mount targets across AZs.
- **Prerequisites:** task-09-efs-access-point-share
- **Sources:** src-ebs-volumes, src-efs-what, src-efs-how

### Console / browser route

1. Open the EC2 Volumes page and confirm fa-s3-storage-ebs-restored is in eu-west-2a.
2. Open EFS and confirm fa-s3-storage-efs is Regional.
3. Open EFS Network and confirm mount targets exist in eu-west-2a and eu-west-2b.
4. State why the restored EBS volume cannot simply attach to client B in eu-west-2b.
5. State why both clients can access the same EFS data through their VPC mount-target path.

### CLI route

#### PowerShell - EBS AZ

```text
aws ec2 describe-volumes --volume-ids $EBS_RESTORED_ID --query "Volumes[0].AvailabilityZone" --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - EFS mount targets

```text
aws efs describe-mount-targets --file-system-id $FILE_SYSTEM_ID --region eu-west-2 --profile fa-s3-storage-admin
```

### Expected results

- The EBS restored volume reports eu-west-2a.
- The EFS file system has mount targets in both training AZs.

### Verification checks

- [ ] **task-10-ebs-vs-efs-review-verify-01** — The learner can explain block versus shared NFS storage and AZ versus Regional access.

# Phase 4: Select the correct Amazon FSx family

Use a complete protocol/workload matrix to choose Windows File Server, Lustre, ONTAP or OpenZFS without creating costly test file systems.

## task-11-fsx-selection — Select the correct Amazon FSx family for four workloads

- **Feature:** Amazon FSx selection
- **Difficulty:** Hard
- **Goal:** Use fsx-selection.json and the FSx console to choose Windows File Server, Lustre, ONTAP or OpenZFS from protocol and workload requirements.
- **Why it matters:** FSx is a family of managed file systems, not one interchangeable storage product.
- **Exam relevance:** SAA-C03 answers often hinge on SMB/AD, HPC/S3 integration, ONTAP multi-protocol requirements or OpenZFS/NFS semantics.
- **Prerequisites:** task-10-ebs-vs-efs-review
- **Sources:** src-fsx-docs, src-fsx-windows, src-fsx-lustre, src-fsx-ontap, src-fsx-openzfs

### Warnings

- FSx file systems can be materially more expensive than the tiny EBS/EFS lab resources, so this task is a complete service-selection exercise rather than a disposable FSx deployment.

### Console / browser route

1. Open fsx-selection.json.
2. Open Amazon FSx in eu-west-2 and choose Create file system only to inspect the current family choices.
3. For a Windows application requiring SMB and Microsoft Active Directory, select FSx for Windows File Server in the decision file.
4. For a Linux HPC/ML workload that needs a high-performance parallel file system and S3 data-repository integration, select FSx for Lustre.
5. For an enterprise NetApp migration requiring NFS, SMB and iSCSI, select FSx for NetApp ONTAP.
6. For an NFS workload that specifically needs managed OpenZFS semantics, select FSx for OpenZFS.
7. Close the create wizard without creating any FSx resource.

### CLI route

#### PowerShell - inspect FSx decision file

```text
Get-Content .\fsx-selection.json
```

### Complete editable files / policies

#### fsx-selection.json

```json
{
  "programme": "AWS Storage and Backup Follow Along",
  "resourcePrefix": "fa-s3-storage",
  "fsxSelection": [
    {
      "fileSystem": "Amazon FSx for Windows File Server",
      "protocols": ["SMB"],
      "identity": "Microsoft Active Directory authentication",
      "bestFit": "Windows-native shared file workloads that require SMB and Windows file-system features."
    },
    {
      "fileSystem": "Amazon FSx for Lustre",
      "protocols": ["Lustre", "POSIX-compatible file access"],
      "identity": "Linux/POSIX workload model",
      "bestFit": "High-performance parallel workloads such as HPC, machine learning and analytics; supports integration with Amazon S3 data repositories."
    },
    {
      "fileSystem": "Amazon FSx for NetApp ONTAP",
      "protocols": ["NFS", "SMB", "iSCSI", "NVMe"],
      "identity": "ONTAP storage virtual machines and protocol-specific identity controls",
      "bestFit": "NetApp/ONTAP migrations and multi-protocol enterprise workloads that need file and block access."
    },
    {
      "fileSystem": "Amazon FSx for OpenZFS",
      "protocols": ["NFS v3", "NFS v4.0", "NFS v4.1", "NFS v4.2"],
      "identity": "NFS/POSIX-oriented workload model",
      "bestFit": "NFS-based workloads that benefit from OpenZFS semantics and managed ZFS storage."
    }
  ],
  "examDecisionRule": "Match the protocol, operating-system ecosystem, performance profile, data-source integration, and migration requirement before selecting an FSx family.",
  "notCreatedInThisLab": "No FSx file system is created because the service choices have different minimum capacities, deployment requirements and ongoing costs."
}
```

### Expected results

- All four FSx families are mapped to a distinct protocol/workload requirement.
- No chargeable FSx file system is created.

### Verification checks

- [ ] **task-11-fsx-selection-verify-01** — Windows -> SMB/AD.
- [ ] **task-11-fsx-selection-verify-02** — Lustre -> HPC/S3.
- [ ] **task-11-fsx-selection-verify-03** — ONTAP -> multi-protocol including NFS/SMB/iSCSI.
- [ ] **task-11-fsx-selection-verify-04** — OpenZFS -> NFS/OpenZFS workloads.

# Phase 5: Create AWS Backup plans and recovery points

Create a backup vault, scheduled plan and explicit selection for the restored EBS volume and EFS file system, then create on-demand recovery points.

## task-12-backup-vault-plan — Create the AWS Backup vault, plan and explicit resource selection

- **Feature:** AWS Backup plans
- **Difficulty:** Hard
- **Goal:** Create fa-s3-storage-vault, a daily seven-day-retention backup plan, and assign the restored EBS volume plus EFS file system through the custom Backup role.
- **Why it matters:** A backup plan expresses policy; a resource selection determines which protected resources the policy applies to.
- **Exam relevance:** Centralized backup policy is different from manually creating an EBS snapshot, even though both can protect EBS data.
- **Prerequisites:** task-11-fsx-selection
- **Sources:** src-backup-what, src-backup-plan, src-backup-assign, src-backup-role, src-backup-vault

### Console / browser route

1. Open AWS Backup in eu-west-2.
2. Choose Backup vaults > Create backup vault.
3. Backup vault name: fa-s3-storage-vault.
4. Use the default AWS Backup encryption key for this training vault.
5. Create the vault.
6. Choose Backup plans > Create backup plan > Build a new plan.
7. Plan name: fa-s3-storage-plan.
8. Rule name: fa-s3-storage-daily.
9. Backup vault: fa-s3-storage-vault.
10. Frequency: Daily at approximately 02:00 UTC.
11. Start window: 1 hour.
12. Completion window: 3 hours.
13. Lifecycle deletion: 7 days.
14. Create the plan.
15. Assign resources.
16. Resource assignment name: fa-s3-storage-selection.
17. IAM role: fa-s3-storage-backup-role.
18. Select the exact fa-s3-storage-ebs-restored EBS volume and fa-s3-storage-efs file system.
19. Do not select all resources in the account.

### CLI route

#### PowerShell - create backup vault

```text
aws backup create-backup-vault --backup-vault-name fa-s3-storage-vault --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - create backup plan

```text
$PLAN_ID = aws backup create-backup-plan --backup-plan file://backup-plan.json --query BackupPlanId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - build protected ARNs

```text
$BACKUP_ROLE_ARN = aws iam get-role --role-name fa-s3-storage-backup-role --query Role.Arn --output text --profile fa-s3-storage-admin; $EBS_BACKUP_ARN = "arn:aws:ec2:eu-west-2:$AWS_ACCOUNT_ID:volume/$EBS_RESTORED_ID"; $EFS_BACKUP_ARN = "arn:aws:elasticfilesystem:eu-west-2:$AWS_ACCOUNT_ID:file-system/$FILE_SYSTEM_ID"
```

#### PowerShell - build selection JSON

```text
$SELECTION = @{SelectionName="fa-s3-storage-selection";IamRoleArn=$BACKUP_ROLE_ARN;Resources=@($EBS_BACKUP_ARN,$EFS_BACKUP_ARN)} | ConvertTo-Json -Depth 6; $SELECTION | Set-Content -Encoding utf8 .\backup-selection.json
```

#### PowerShell - create selection

```text
$SELECTION_ID = aws backup create-backup-selection --backup-plan-id $PLAN_ID --backup-selection file://backup-selection.json --query SelectionId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - inspect backup plan

```text
aws backup get-backup-plan --backup-plan-id $PLAN_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - inspect selection

```text
aws backup list-backup-selections --backup-plan-id $PLAN_ID --region eu-west-2 --profile fa-s3-storage-admin
```

### Complete editable files / policies

#### backup-plan.json

```json
{
  "BackupPlanName": "fa-s3-storage-plan",
  "Rules": [
    {
      "RuleName": "fa-s3-storage-daily",
      "TargetBackupVaultName": "fa-s3-storage-vault",
      "ScheduleExpression": "cron(0 2 * * ? *)",
      "StartWindowMinutes": 60,
      "CompletionWindowMinutes": 180,
      "Lifecycle": {
        "DeleteAfterDays": 7
      }
    }
  ]
}
```

### Expected results

- The backup vault exists.
- The plan contains the daily rule and seven-day retention.
- The selection contains exactly one EBS volume ARN and one EFS file-system ARN.

### Verification checks

- [ ] **task-12-backup-vault-plan-verify-01** — The backup role is fa-s3-storage-backup-role.
- [ ] **task-12-backup-vault-plan-verify-02** — No unrelated account resource is selected.

## task-13-backup-recovery-points — Create on-demand EBS and EFS backups and inspect recovery points

- **Feature:** AWS Backup recovery points
- **Difficulty:** Hard
- **Goal:** Start one on-demand backup job for the restored EBS volume and one for EFS, wait for completion and inspect both recovery points in the vault.
- **Why it matters:** The scheduled plan may not run during a short lab; on-demand jobs produce visible recovery points immediately while the plan proves policy configuration.
- **Exam relevance:** A recovery point is the protected backup artifact stored in a backup vault and used later for restore operations.
- **Prerequisites:** task-12-backup-vault-plan
- **Sources:** src-backup-recovery, src-backup-ondemand, src-backup-vault

### Warnings

- EFS backup completion can take longer than the EBS backup. Keep the lab resources until both jobs report a terminal state.

### Console / browser route

1. Open AWS Backup > Protected resources or Create on-demand backup.
2. Create an on-demand backup for fa-s3-storage-ebs-restored into fa-s3-storage-vault using fa-s3-storage-backup-role.
3. Create a second on-demand backup for fa-s3-storage-efs into the same vault.
4. Open Jobs > Backup jobs and wait until both jobs are Completed.
5. Open Backup vaults > fa-s3-storage-vault.
6. Confirm at least two recovery points are listed: one EBS and one EFS.
7. Open each recovery point and identify its protected resource ARN.
8. Do not start a restore job; the objective is backup policy and recovery-point creation.

### CLI route

#### PowerShell - start EBS backup

```text
$EBS_BACKUP_JOB_ID = aws backup start-backup-job --backup-vault-name fa-s3-storage-vault --resource-arn $EBS_BACKUP_ARN --iam-role-arn $BACKUP_ROLE_ARN --recovery-point-tags FollowAlong=fa-s3-storage --query BackupJobId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - start EFS backup

```text
$EFS_BACKUP_JOB_ID = aws backup start-backup-job --backup-vault-name fa-s3-storage-vault --resource-arn $EFS_BACKUP_ARN --iam-role-arn $BACKUP_ROLE_ARN --recovery-point-tags FollowAlong=fa-s3-storage --query BackupJobId --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - wait for EBS backup

```text
do { Start-Sleep -Seconds 20; $EBS_JOB_STATE = aws backup describe-backup-job --backup-job-id $EBS_BACKUP_JOB_ID --query State --output text --region eu-west-2 --profile fa-s3-storage-admin } until ($EBS_JOB_STATE -in @("COMPLETED","FAILED","ABORTED","EXPIRED"))
```

#### PowerShell - wait for EFS backup

```text
do { Start-Sleep -Seconds 20; $EFS_JOB_STATE = aws backup describe-backup-job --backup-job-id $EFS_BACKUP_JOB_ID --query State --output text --region eu-west-2 --profile fa-s3-storage-admin } until ($EFS_JOB_STATE -in @("COMPLETED","FAILED","ABORTED","EXPIRED"))
```

#### PowerShell - list recovery points

```text
aws backup list-recovery-points-by-backup-vault --backup-vault-name fa-s3-storage-vault --region eu-west-2 --profile fa-s3-storage-admin
```

### Expected results

- Both backup jobs reach COMPLETED.
- The vault contains EBS and EFS recovery points.

### Verification checks

- [ ] **task-13-backup-recovery-points-verify-01** — Each recovery point references one of the exact training resource ARNs.
- [ ] **task-13-backup-recovery-points-verify-02** — No restore resource is created.

# Phase 6: Plan Glacier retrieval and Storage Gateway architecture

Choose archive retrieval tiers and hybrid-storage gateway types without creating minimum-duration archive objects or gateway appliances.

## task-14-glacier-retrieval — Select S3 Glacier retrieval classes and tiers

- **Feature:** S3 Glacier retrieval
- **Difficulty:** Hard
- **Goal:** Use the retrieval plan to distinguish Instant Retrieval, Flexible Retrieval Expedited/Standard/Bulk and Deep Archive Standard/Bulk.
- **Why it matters:** Archive design balances storage cost, minimum storage duration and recovery urgency; not every Glacier class uses a restore request.
- **Exam relevance:** Exam questions often encode the correct class in the required retrieval time.
- **Prerequisites:** task-13-backup-recovery-points
- **Sources:** src-glacier-classes, src-glacier-options, src-glacier-restore, src-glacier-minimum

### Console / browser route

1. Open s3-glacier-retrieval-plan.json.
2. Review S3 Glacier Instant Retrieval: real-time access without an archive restore request.
3. Review S3 Glacier Flexible Retrieval Expedited: typically 1-5 minutes.
4. Review Flexible Retrieval Standard: typically 3-5 hours without Batch Operations.
5. Review Flexible Retrieval Bulk: typically 5-12 hours.
6. Review S3 Glacier Deep Archive Standard: typically within 12 hours.
7. Review Deep Archive Bulk: typically within 48 hours.
8. Open S3 > Create bucket/object storage-class choices only to inspect the current Glacier classes.
9. Do not upload training objects into Flexible Retrieval or Deep Archive; minimum storage-duration charges can apply even when objects are deleted early.
10. Do not initiate a restore because no archived object was created.

### CLI route

#### PowerShell - inspect Glacier plan

```text
Get-Content .\s3-glacier-retrieval-plan.json
```

### Complete editable files / policies

#### s3-glacier-retrieval-plan.json

```json
{
  "programme": "AWS Storage and Backup Follow Along",
  "resourcePrefix": "fa-s3-storage",
  "s3GlacierRetrievalChoices": [
    {
      "storageClass": "S3 Glacier Instant Retrieval",
      "access": "Real-time, millisecond access",
      "restoreRequestRequired": false,
      "selection": "Rarely accessed archive data that still requires immediate retrieval."
    },
    {
      "storageClass": "S3 Glacier Flexible Retrieval",
      "access": {
        "Expedited": "Typically 1-5 minutes",
        "Standard": "Typically 3-5 hours without Batch Operations",
        "Bulk": "Typically 5-12 hours"
      },
      "restoreRequestRequired": true,
      "selection": "Long-term archives where retrieval can range from minutes to hours and cost can be traded against speed."
    },
    {
      "storageClass": "S3 Glacier Deep Archive",
      "access": {
        "Standard": "Typically within 12 hours",
        "Bulk": "Typically within 48 hours"
      },
      "restoreRequestRequired": true,
      "selection": "Very long-lived archives with the lowest urgency for retrieval."
    }
  ],
  "costSafety": {
    "minimumStorageDuration": {
      "S3 Glacier Flexible Retrieval": "90 days",
      "S3 Glacier Deep Archive": "180 days"
    },
    "labDecision": "Do not create archive-class objects merely for the lab because early deletion can still incur minimum-storage-duration charges."
  }
}
```

### Expected results

- The learner can map retrieval urgency to the appropriate Glacier storage class/tier.
- No minimum-duration archive object is created.

### Verification checks

- [ ] **task-14-glacier-retrieval-verify-01** — Instant Retrieval is distinguished from restore-based Flexible Retrieval/Deep Archive.
- [ ] **task-14-glacier-retrieval-verify-02** — Deep Archive has no Expedited tier in the plan.

## task-15-storage-gateway — Build the Storage Gateway architecture decision

- **Feature:** Storage Gateway architecture
- **Difficulty:** Hard
- **Goal:** Use the architecture file and Storage Gateway console to distinguish S3 File Gateway, FSx File Gateway, cached/stored Volume Gateway and Tape Gateway.
- **Why it matters:** Storage Gateway is hybrid storage integration, so the correct gateway depends on whether the on-premises application speaks file, block or virtual tape protocols and where primary data should live.
- **Exam relevance:** SAA-C03 scenarios commonly distinguish hybrid file access, iSCSI block access and virtual tape backup integration.
- **Prerequisites:** task-14-glacier-retrieval
- **Sources:** src-storagegateway-docs, src-storagegateway-volume, src-storagegateway-tape

### Console / browser route

1. Open storage-gateway-architecture.json.
2. Open Storage Gateway in eu-west-2.
3. Choose Create gateway only to inspect current gateway family choices.
4. For NFS/SMB access to S3-backed objects, choose S3 File Gateway in the decision file.
5. For cached on-premises access to FSx for Windows File Server shares, choose FSx File Gateway.
6. For iSCSI block storage with primary data in S3 and local hot-block cache, choose cached Volume Gateway.
7. For iSCSI block storage whose full primary dataset must remain local with AWS backups, choose stored Volume Gateway.
8. For existing tape backup software requiring a virtual tape library, choose Tape Gateway.
9. Close the create wizard without activating a gateway.

### CLI route

#### PowerShell - inspect Storage Gateway plan

```text
Get-Content .\storage-gateway-architecture.json
```

### Complete editable files / policies

#### storage-gateway-architecture.json

```json
{
  "programme": "AWS Storage and Backup Follow Along",
  "resourcePrefix": "fa-s3-storage",
  "storageGatewayArchitecture": [
    {
      "gateway": "Amazon S3 File Gateway",
      "clientInterface": ["NFS", "SMB"],
      "cloudStorage": "Amazon S3 objects",
      "bestFit": "On-premises applications that need file-protocol access while storing data as objects in S3."
    },
    {
      "gateway": "Amazon FSx File Gateway",
      "clientInterface": ["SMB"],
      "cloudStorage": "Amazon FSx for Windows File Server",
      "bestFit": "On-premises users/applications that need low-latency cached access to Windows file shares hosted on FSx for Windows File Server."
    },
    {
      "gateway": "Volume Gateway - cached volumes",
      "clientInterface": ["iSCSI block volumes"],
      "cloudStorage": "Primary data stored in Amazon S3 with frequently accessed blocks cached locally",
      "bestFit": "Hybrid block workloads where on-premises capacity should be minimized while retaining low-latency access to hot blocks."
    },
    {
      "gateway": "Volume Gateway - stored volumes",
      "clientInterface": ["iSCSI block volumes"],
      "cloudStorage": "Primary data remains local with asynchronous backups to AWS",
      "bestFit": "Hybrid block workloads that require the full primary dataset on premises."
    },
    {
      "gateway": "Tape Gateway",
      "clientInterface": ["Virtual tape library over iSCSI"],
      "cloudStorage": "Virtual tapes archived in AWS cloud storage",
      "bestFit": "Existing tape-based backup applications that need cloud-backed virtual tape media."
    }
  ],
  "architectureReminder": "Storage Gateway is for ongoing hybrid storage integration. It is not a substitute for EBS/EFS/FSx when the workload is already fully hosted inside AWS."
}
```

### Expected results

- The learner can select a gateway from the client protocol and data-placement requirement.
- No gateway appliance, local cache disk or virtual tape is created.

### Verification checks

- [ ] **task-15-storage-gateway-verify-01** — File, block and tape gateway models are clearly separated.

# Phase 7: Review and reverse-dependency cleanup

Consolidate storage exam decisions, then delete backups, file systems, block storage, EC2/network resources, identities and local files safely.

## task-16-exam-review — Review the SAA-C03 storage and backup decision points

- **Feature:** Exam consolidation
- **Difficulty:** Easy
- **Goal:** Summarize block/file/archive/hybrid storage and backup choices before teardown.
- **Why it matters:** The exam tests architecture selection: protocol, scope, performance, recovery time, cost and sharing behavior drive the answer.
- **Exam relevance:** The hands-on resources provide concrete anchors for EBS, EFS and Backup while the decision files cover expensive families safely.
- **Prerequisites:** task-15-storage-gateway
- **Sources:** src-ebs-volumes, src-efs-what, src-fsx-docs, src-backup-what, src-glacier-classes, src-storagegateway-docs

### Console / browser route

1. EBS: AZ-scoped block storage for EC2; choose volume family based on latency, IOPS, throughput and cost.
2. EBS snapshots: point-in-time backups; restore by creating a new volume. Encrypted source volumes create encrypted snapshots.
3. EFS Regional: shared NFS file system with data stored across multiple AZs; mount targets provide VPC NFS endpoints.
4. EFS access point: application-specific root and POSIX identity boundary on the same file system.
5. FSx Windows: SMB/Active Directory.
6. FSx Lustre: high-performance parallel Linux/POSIX workloads and S3 integration.
7. FSx ONTAP: NetApp and multi-protocol NFS/SMB/iSCSI/NVMe requirements.
8. FSx OpenZFS: managed OpenZFS for NFS workloads.
9. AWS Backup plan: policy/schedule/lifecycle; backup selection: protected resources; recovery point: stored backup artifact.
10. Glacier Instant Retrieval: immediate access; Flexible/Deep Archive use restore workflows and different retrieval speeds.
11. Storage Gateway: hybrid file, block or virtual-tape interface to AWS storage.
12. Exam trigger: one EC2 database data disk -> EBS; multiple Linux hosts sharing the same files -> EFS.
13. Exam trigger: Windows SMB/AD -> FSx Windows; HPC + S3 dataset -> FSx Lustre.
14. Exam trigger: centrally scheduled multi-service backups -> AWS Backup.
15. Exam trigger: archive retrieval in minutes -> Flexible Retrieval Expedited; hours and lowest urgency -> Standard/Bulk or Deep Archive based on retention/retrieval need.

### CLI route

#### PowerShell - EBS summary

```text
aws ec2 describe-volumes --volume-ids $EBS_SOURCE_ID $EBS_RESTORED_ID --query "Volumes[].{Id:VolumeId,Type:VolumeType,AZ:AvailabilityZone,Encrypted:Encrypted,State:State}" --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - EFS summary

```text
aws efs describe-file-systems --file-system-id $FILE_SYSTEM_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - Backup summary

```text
aws backup list-recovery-points-by-backup-vault --backup-vault-name fa-s3-storage-vault --region eu-west-2 --profile fa-s3-storage-admin
```

### Expected results

- The learner can select EBS/EFS/FSx/Backup/Glacier/Storage Gateway from requirements.
- The live lab still contains the expected EBS, EFS and recovery points before cleanup.

### Verification checks

- [ ] **task-16-exam-review-verify-01** — The learner can explain EBS encryption/snapshot inheritance and EFS multi-AZ shared access.

## task-17-cloud-cleanup — Delete recovery points, EFS, EBS, EC2 and VPC resources in reverse dependency order

- **Feature:** Cloud cleanup
- **Difficulty:** Hard
- **Goal:** Delete backup policy/recovery points before the vault, unmount/delete EFS dependencies, detach/delete EBS/snapshots, terminate clients and then remove the VPC.
- **Why it matters:** Backup vaults cannot be deleted while recovery points remain, and storage/network dependencies must be removed before their parent resources.
- **Exam relevance:** Safe cleanup is part of storage architecture because snapshots, EFS and backup recovery points continue accruing storage cost after compute stops.
- **Prerequisites:** task-16-exam-review
- **Sources:** src-backup-vault, src-backup-recovery, src-efs-mount-target, src-ebs-snapshots

### Warnings

- Do not delete fa-s3-storage-vault until recovery points are gone. Do not delete EFS security groups until mount targets and client ENIs are gone.

### Console / browser route

1. Delete the AWS Backup resource selection fa-s3-storage-selection.
2. Delete backup plan fa-s3-storage-plan.
3. List all recovery points in fa-s3-storage-vault and delete only those recovery points.
4. Wait until the vault contains zero recovery points, then delete fa-s3-storage-vault.
5. Use SSM on both EC2 clients to unmount /mnt/efs if mounted.
6. Delete EFS access point fa-s3-storage-ap.
7. Delete both EFS mount targets and wait until they disappear.
8. Delete fa-s3-storage-efs.
9. Use SSM on client A to unmount /mnt/ebs-restored if still mounted.
10. Detach fa-s3-storage-ebs-restored and wait until Available.
11. Delete fa-s3-storage-ebs-restored.
12. Delete fa-s3-storage-ebs-source.
13. Delete fa-s3-storage-ebs-snapshot.
14. Terminate fa-s3-storage-client-a and fa-s3-storage-client-b and wait for Terminated.
15. Delete fa-s3-storage-efs-sg and fa-s3-storage-ec2-sg.
16. Remove explicit route-table associations and delete fa-s3-storage-public-rt.
17. Detach and delete fa-s3-storage-igw.
18. Delete both public subnets.
19. Delete fa-s3-storage-vpc.
20. Verify no chargeable EBS/EFS/EC2/Backup resource remains.

### CLI route

#### PowerShell - delete backup selection

```text
aws backup delete-backup-selection --backup-plan-id $PLAN_ID --selection-id $SELECTION_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete backup plan

```text
aws backup delete-backup-plan --backup-plan-id $PLAN_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - capture recovery points

```text
$RECOVERY_POINTS = aws backup list-recovery-points-by-backup-vault --backup-vault-name fa-s3-storage-vault --query "RecoveryPoints[].RecoveryPointArn" --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete recovery points

```text
foreach ($RP in ($RECOVERY_POINTS -split "\s+")) { if ($RP) { aws backup delete-recovery-point --backup-vault-name fa-s3-storage-vault --recovery-point-arn $RP --region eu-west-2 --profile fa-s3-storage-admin } }
```

#### PowerShell - delete backup vault

```text
aws backup delete-backup-vault --backup-vault-name fa-s3-storage-vault --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - unmount EFS on A

```text
$UNMOUNT_EFS = @{commands=@("sudo umount /mnt/efs || true")} | ConvertTo-Json -Compress; aws ssm send-command --instance-ids $INSTANCE_A_ID --document-name AWS-RunShellScript --parameters $UNMOUNT_EFS --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - unmount EFS on B

```text
aws ssm send-command --instance-ids $INSTANCE_B_ID --document-name AWS-RunShellScript --parameters $UNMOUNT_EFS --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete access point

```text
aws efs delete-access-point --access-point-id $AP_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete mount target A

```text
aws efs delete-mount-target --mount-target-id $MOUNT_TARGET_A_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete mount target B

```text
aws efs delete-mount-target --mount-target-id $MOUNT_TARGET_B_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete EFS

```text
aws efs delete-file-system --file-system-id $FILE_SYSTEM_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - detach restored EBS

```text
aws ec2 detach-volume --volume-id $EBS_RESTORED_ID --force --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - wait restored available

```text
aws ec2 wait volume-available --volume-ids $EBS_RESTORED_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete restored EBS

```text
aws ec2 delete-volume --volume-id $EBS_RESTORED_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete source EBS

```text
aws ec2 delete-volume --volume-id $EBS_SOURCE_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete EBS snapshot

```text
aws ec2 delete-snapshot --snapshot-id $SNAPSHOT_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - terminate clients

```text
aws ec2 terminate-instances --instance-ids $INSTANCE_A_ID $INSTANCE_B_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - wait clients terminated

```text
aws ec2 wait instance-terminated --instance-ids $INSTANCE_A_ID $INSTANCE_B_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete EFS SG

```text
aws ec2 delete-security-group --group-id $EFS_SG_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete EC2 SG

```text
aws ec2 delete-security-group --group-id $EC2_SG_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - route associations

```text
$ASSOCS = aws ec2 describe-route-tables --route-table-ids $RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId" --output text --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - disassociate routes

```text
foreach ($A in ($ASSOCS -split "\s+")) { if ($A) { aws ec2 disassociate-route-table --association-id $A --region eu-west-2 --profile fa-s3-storage-admin } }
```

#### PowerShell - delete route table

```text
aws ec2 delete-route-table --route-table-id $RT_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - detach IGW

```text
aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete IGW

```text
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete subnet A

```text
aws ec2 delete-subnet --subnet-id $SUBNET_A_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete subnet B

```text
aws ec2 delete-subnet --subnet-id $SUBNET_B_ID --region eu-west-2 --profile fa-s3-storage-admin
```

#### PowerShell - delete VPC

```text
aws ec2 delete-vpc --vpc-id $VPC_ID --region eu-west-2 --profile fa-s3-storage-admin
```

### Expected results

- The backup vault is empty and deleted.
- EFS access point, mount targets and file system are deleted.
- Both training EBS data volumes and the manual snapshot are deleted.
- Both EC2 clients and VPC resources are deleted.

### Verification checks

- [ ] **task-17-cloud-cleanup-verify-01** — No recovery point remains.
- [ ] **task-17-cloud-cleanup-verify-02** — No chargeable EC2/EBS/EFS storage resource from the lab remains.

## task-18-identity-local-cleanup — Delete service roles, temporary credentials and local storage files

- **Feature:** Identity and local cleanup
- **Difficulty:** Hard
- **Goal:** Delete the custom Backup/EC2 roles and instance profile, then remove the temporary human IAM identity, CLI profile and local lab folder last.
- **Why it matters:** Service roles must remain until protected resources and backup jobs are no longer using them.
- **Exam relevance:** Identity cleanup is the final dependency layer after storage, backup and networking resources are gone.
- **Prerequisites:** task-17-cloud-cleanup
- **Sources:** src-backup-role

### Console / browser route

1. Open IAM.
2. Detach AWSBackupServiceRolePolicyForBackup from fa-s3-storage-backup-role and delete the role.
3. Detach AmazonSSMManagedInstanceCore from fa-s3-storage-ec2-role.
4. Remove fa-s3-storage-ec2-role from fa-s3-storage-ec2-profile.
5. Delete fa-s3-storage-ec2-profile.
6. Delete fa-s3-storage-ec2-role.
7. Sign in as root only for final human-user cleanup.
8. Delete the fa-s3-storage-admin access key.
9. Detach and delete fa-s3-storage-admin-policy.
10. Delete fa-s3-storage-admin.
11. Sign out of root.
12. Remove only the fa-s3-storage-admin AWS CLI profile.
13. Delete C:\aws-labs\fa-s3-storage last.
14. Read and affirm the programme cleanup acknowledgement.

### CLI route

#### PowerShell - detach Backup policy

```text
aws iam detach-role-policy --role-name fa-s3-storage-backup-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup --profile fa-s3-storage-admin
```

#### PowerShell - delete Backup role

```text
aws iam delete-role --role-name fa-s3-storage-backup-role --profile fa-s3-storage-admin
```

#### PowerShell - detach SSM policy

```text
aws iam detach-role-policy --role-name fa-s3-storage-ec2-role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore --profile fa-s3-storage-admin
```

#### PowerShell - remove EC2 role from profile

```text
aws iam remove-role-from-instance-profile --instance-profile-name fa-s3-storage-ec2-profile --role-name fa-s3-storage-ec2-role --profile fa-s3-storage-admin
```

#### PowerShell - delete EC2 profile

```text
aws iam delete-instance-profile --instance-profile-name fa-s3-storage-ec2-profile --profile fa-s3-storage-admin
```

#### PowerShell - delete EC2 role

```text
aws iam delete-role --role-name fa-s3-storage-ec2-role --profile fa-s3-storage-admin
```

#### PowerShell - clear CLI access key

```text
aws configure set aws_access_key_id "" --profile fa-s3-storage-admin
```

#### PowerShell - clear CLI secret key

```text
aws configure set aws_secret_access_key "" --profile fa-s3-storage-admin
```

#### PowerShell - clear CLI region

```text
aws configure set region "" --profile fa-s3-storage-admin
```

#### PowerShell - leave lab folder

```text
Set-Location C:\
```

#### PowerShell - delete local lab folder

```text
Remove-Item "C:\aws-labs\fa-s3-storage" -Recurse -Force
```

### Expected results

- The two custom service roles and EC2 instance profile are deleted.
- The temporary training IAM user/key/policy and CLI profile are deleted.
- The local lab folder is deleted last.

### Verification checks

- [ ] **task-18-identity-local-cleanup-verify-01** — No unrelated IAM role, policy or CLI profile was deleted.
- [ ] **task-18-identity-local-cleanup-verify-02** — No local fa-s3-storage file remains.

# Troubleshooting

## trouble-01 — EC2 clients do not appear in Systems Manager

- **Likely cause:** The instance profile, public egress route, public IPv4 address or SSM Agent startup is missing.
- **Fix:** Verify fa-s3-storage-ec2-profile is attached, the subnet routes 0.0.0.0/0 to the IGW, and the instance has public IPv4 egress.

## trouble-02 — prepare-ebs.sh reports no non-root disk

- **Likely cause:** The gp3 volume is not attached or the instance has not exposed the new NVMe block device yet.
- **Fix:** Verify the EBS attachment is attached to client A, wait a few seconds, then rerun lsblk through SSM before rerunning the script.

## trouble-03 — Restored EBS volume cannot attach

- **Likely cause:** The restored volume was created in an Availability Zone different from client A.
- **Fix:** Confirm both client A and fa-s3-storage-ebs-restored are in eu-west-2a; EBS attachment is AZ-scoped.

## trouble-04 — EFS mount times out

- **Likely cause:** The EFS SG does not allow TCP 2049 from the EC2 SG or the mount target in that AZ is unavailable.
- **Fix:** Verify fa-s3-storage-efs-sg inbound NFS source is fa-s3-storage-ec2-sg and one mount target is Available in each client AZ.

## trouble-05 — EFS access-point mount fails because /shared does not exist

- **Likely cause:** Access-point root CreationInfo was omitted or incomplete.
- **Fix:** Verify the access point contains /shared with OwnerUid=1001, OwnerGid=1001 and Permissions=0750.

## trouble-06 — Client B cannot see the file written by client A

- **Likely cause:** One client mounted the file system root instead of the access point, the mount failed, or the write command did not complete.
- **Fix:** Check mount output on both clients and confirm both use the same FILE_SYSTEM_ID and AP_ID.

## trouble-07 — AWS Backup job fails immediately

- **Likely cause:** The backup role ARN/resource ARN is wrong or the service role lacks backup permissions.
- **Fix:** Verify fa-s3-storage-backup-role has AWSBackupServiceRolePolicyForBackup and the selection/on-demand job references the exact EBS/EFS ARNs.

## trouble-08 — Backup vault cannot be deleted

- **Likely cause:** One or more recovery points remain.
- **Fix:** List recovery points in fa-s3-storage-vault and delete only those exact recovery points before retrying vault deletion.

## trouble-09 — EFS security group cannot be deleted

- **Likely cause:** Mount-target ENIs or EC2 ENIs still reference the security groups.
- **Fix:** Delete the access point/mount targets and terminate both clients before deleting the storage lab security groups.

# Ordered manual cleanup

- **Manual only:** `true`
- **Ordering:** `reverse_dependency`
- **Completion gate:** `acknowledgement`

## Cleanup 1: fa-s3-storage-selection

- **Action:** Delete the resource selection so the plan no longer targets the live resources.
- **Verification:** The selection no longer appears for the plan.
- **Task:** task-17-cloud-cleanup

## Cleanup 2: fa-s3-storage-plan

- **Action:** Delete the backup plan.
- **Verification:** The plan no longer appears.
- **Task:** task-17-cloud-cleanup

## Cleanup 3: EBS and EFS recovery points in fa-s3-storage-vault

- **Action:** Delete every recovery point created by the lab.
- **Verification:** The vault recovery-point list is empty.
- **Task:** task-17-cloud-cleanup

## Cleanup 4: fa-s3-storage-vault

- **Action:** Delete the empty backup vault.
- **Verification:** The vault is absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 5: fa-s3-storage-ap

- **Action:** Unmount EFS clients and delete the EFS access point.
- **Verification:** No access point remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 6: EFS mount targets

- **Action:** Delete both mount targets and wait for their ENIs to disappear.
- **Verification:** describe-mount-targets returns no targets.
- **Task:** task-17-cloud-cleanup

## Cleanup 7: fa-s3-storage-efs

- **Action:** Delete the Regional EFS file system.
- **Verification:** The file system is absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 8: fa-s3-storage-ebs-restored

- **Action:** Unmount/detach and delete the restored EBS volume.
- **Verification:** The restored volume is absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 9: fa-s3-storage-ebs-source

- **Action:** Delete the detached original gp3 volume.
- **Verification:** The source volume is absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 10: fa-s3-storage-ebs-snapshot

- **Action:** Delete the manual encrypted EBS snapshot.
- **Verification:** The snapshot is absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 11: fa-s3-storage-client-a and fa-s3-storage-client-b

- **Action:** Terminate both clients; their root volumes are deleted by instance termination settings.
- **Verification:** Both instances are Terminated.
- **Task:** task-17-cloud-cleanup

## Cleanup 12: fa-s3-storage-efs-sg and fa-s3-storage-ec2-sg

- **Action:** Delete both security groups after all ENIs are gone.
- **Verification:** Neither security group remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 13: fa-s3-storage-public-rt, fa-s3-storage-igw, both subnets and fa-s3-storage-vpc

- **Action:** Remove route-table associations and delete network resources in dependency order.
- **Verification:** No fa-s3-storage VPC resource remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 14: fa-s3-storage-backup-role, fa-s3-storage-ec2-profile and fa-s3-storage-ec2-role

- **Action:** Detach managed policies and delete the service roles/profile after cloud cleanup.
- **Verification:** The service identities are absent.
- **Task:** task-18-identity-local-cleanup

## Cleanup 15: fa-s3-storage-admin access key, policy and user

- **Action:** Use root only after cloud verification to delete the temporary human identity.
- **Verification:** User/key/policy are absent.
- **Task:** task-18-identity-local-cleanup

## Cleanup 16: AWS CLI profile fa-s3-storage-admin

- **Action:** Remove only the training profile.
- **Verification:** Unrelated profiles remain unchanged.
- **Task:** task-18-identity-local-cleanup

## Cleanup 17: C:\aws-labs\fa-s3-storage

- **Action:** Delete the exact local lab folder last.
- **Verification:** C:\aws-labs\fa-s3-storage no longer exists.
- **Task:** task-18-identity-local-cleanup

## Programme cleanup acknowledgement

I verified that fa-s3-storage-selection and fa-s3-storage-plan are deleted; all EBS and EFS recovery points are removed before fa-s3-storage-vault is deleted; fa-s3-storage-ap, both EFS mount targets and fa-s3-storage-efs are deleted; fa-s3-storage-ebs-restored, fa-s3-storage-ebs-source and fa-s3-storage-ebs-snapshot are deleted; both fa-s3-storage EC2 clients and their root volumes are terminated; both storage security groups and every fa-s3-storage VPC resource are deleted; no FSx file system, Glacier archive object or Storage Gateway appliance was created; fa-s3-storage-backup-role, fa-s3-storage-ec2-profile and fa-s3-storage-ec2-role are deleted; the temporary fa-s3-storage-admin access key, policy, IAM user and CLI profile are removed; unrelated resources and profiles are unchanged; and only then was C:\aws-labs\fa-s3-storage deleted.

# Official sources

## src-ebs-volumes — Amazon EBS volumes

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html
- **Purpose:** EBS volume families and selection.
- **Used by:** task-01-prerequisites, task-03-cli-files, task-06-ebs-types-volume, task-10-ebs-vs-efs-review, task-16-exam-review

## src-ebs-features — Features and benefits of Amazon EBS volumes

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/EBSFeatures.html
- **Purpose:** EBS volume capabilities including encryption.
- **Used by:** task-06-ebs-types-volume

## src-ebs-create — Create an Amazon EBS volume

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/ebs-creating-volume.html
- **Purpose:** Create encrypted EBS volumes and volumes from snapshots.
- **Used by:** task-05-launch-clients, task-06-ebs-types-volume, task-07-ebs-snapshot-restore

## src-ebs-use — Make an Amazon EBS volume available for use

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/ebs-using-volumes.html
- **Purpose:** Format and mount attached EBS block devices.
- **Used by:** task-06-ebs-types-volume

## src-ebs-snapshots — Amazon EBS snapshots

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html
- **Purpose:** Snapshot backup and lifecycle concepts.
- **Used by:** task-07-ebs-snapshot-restore, task-17-cloud-cleanup

## src-ebs-create-snapshot — Create a snapshot of an EBS volume

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/ebs-create-snapshot.html
- **Purpose:** Create a point-in-time EBS snapshot.
- **Used by:** task-07-ebs-snapshot-restore

## src-ebs-snapshot-how — How Amazon EBS snapshots work

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/how_snapshots_work.html
- **Purpose:** Incremental snapshot behavior.
- **Used by:** task-07-ebs-snapshot-restore

## src-ebs-encryption — Amazon EBS encryption

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html
- **Purpose:** Encrypted volumes/snapshots and encryption migration behavior.
- **Used by:** task-02-bootstrap-user, task-06-ebs-types-volume, task-07-ebs-snapshot-restore

## src-ebs-encryption-how — How Amazon EBS encryption works

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/ebs/latest/userguide/how-ebs-encryption-works.html
- **Purpose:** AWS KMS-backed EBS encryption.
- **Used by:** task-06-ebs-types-volume

## src-efs-what — What is Amazon Elastic File System?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html
- **Purpose:** Regional EFS, multi-AZ durability, NFS and encryption.
- **Used by:** task-01-prerequisites, task-08-create-efs, task-09-efs-access-point-share, task-10-ebs-vs-efs-review, task-16-exam-review

## src-efs-how — How Amazon EFS works

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html
- **Purpose:** Mount targets and same-AZ DNS resolution.
- **Used by:** task-08-create-efs, task-10-ebs-vs-efs-review

## src-efs-mount-target — Managing mount targets

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/accessing-fs.html
- **Purpose:** One mount target per Availability Zone and VPC access.
- **Used by:** task-04-network-roles, task-08-create-efs, task-17-cloud-cleanup

## src-efs-create-mt — Creating mount targets

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/manage-fs-access-create-delete-mount-targets.html
- **Purpose:** Create Regional EFS mount targets.
- **Used by:** task-08-create-efs

## src-efs-accesspoints — Working with access points

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html
- **Purpose:** Application-specific entry points and enforced identities/root directories.
- **Used by:** task-09-efs-access-point-share

## src-efs-create-ap — Creating access points

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/create-access-point.html
- **Purpose:** Access-point POSIX identity and root-directory settings.
- **Used by:** task-09-efs-access-point-share

## src-efs-mount-ap — Mounting with EFS access points

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/mounting-access-points.html
- **Purpose:** Mount access points with the EFS mount helper and TLS.
- **Used by:** task-09-efs-access-point-share

## src-efs-utils — Installing the Amazon EFS client

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/using-amazon-efs-utils.html
- **Purpose:** amazon-efs-utils and TLS mount helper.
- **Used by:** task-04-network-roles, task-05-launch-clients, task-09-efs-access-point-share

## src-efs-encryption — Encrypting data at rest

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/efs/latest/ug/encryption-at-rest.html
- **Purpose:** EFS encryption at rest.
- **Used by:** task-02-bootstrap-user, task-08-create-efs

## src-fsx-docs — Amazon FSx Documentation

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/fsx/
- **Purpose:** The four Amazon FSx file-system families.
- **Used by:** task-01-prerequisites, task-03-cli-files, task-11-fsx-selection, task-16-exam-review

## src-fsx-windows — What is FSx for Windows File Server?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html
- **Purpose:** Windows/SMB and Active Directory selection criteria.
- **Used by:** task-11-fsx-selection

## src-fsx-lustre — What is Amazon FSx for Lustre?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html
- **Purpose:** High-performance POSIX/Lustre and S3 integration.
- **Used by:** task-11-fsx-selection

## src-fsx-ontap — What is Amazon FSx for NetApp ONTAP?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/what-is-fsx-ontap.html
- **Purpose:** ONTAP and multi-protocol storage.
- **Used by:** task-11-fsx-selection

## src-fsx-openzfs — What is Amazon FSx for OpenZFS?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/what-is-fsx.html
- **Purpose:** Managed OpenZFS and NFS access.
- **Used by:** task-11-fsx-selection

## src-backup-what — What is AWS Backup?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html
- **Purpose:** Backup plans and centralized backup management.
- **Used by:** task-01-prerequisites, task-12-backup-vault-plan, task-16-exam-review

## src-backup-plan — Create a backup plan

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-backup-plan.html
- **Purpose:** Backup plan rules and scheduling.
- **Used by:** task-12-backup-vault-plan

## src-backup-assign — Select AWS services to backup

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html
- **Purpose:** Assign resources to a backup plan.
- **Used by:** task-12-backup-vault-plan

## src-backup-role — IAM service roles

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-backup/latest/devguide/iam-service-roles.html
- **Purpose:** AWS Backup service roles and managed policies.
- **Used by:** task-02-bootstrap-user, task-04-network-roles, task-12-backup-vault-plan, task-18-identity-local-cleanup

## src-backup-vault — Backup vault creation and deletion

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-backup/latest/devguide/create-a-vault.html
- **Purpose:** Backup vault lifecycle and deletion requirements.
- **Used by:** task-12-backup-vault-plan, task-13-backup-recovery-points, task-17-cloud-cleanup

## src-backup-recovery — Backup creation, maintenance, and restore

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-backup/latest/devguide/recovery-points.html
- **Purpose:** Recovery points stored in backup vaults.
- **Used by:** task-13-backup-recovery-points, task-17-cloud-cleanup

## src-backup-ondemand — Creating an on-demand backup using AWS Backup

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-backup/latest/devguide/recov-point-create-on-demand-backup.html
- **Purpose:** On-demand backup jobs.
- **Used by:** task-13-backup-recovery-points

## src-glacier-classes — Understanding S3 Glacier storage classes for long-term data storage

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonS3/latest/userguide/glacier-storage-classes.html
- **Purpose:** Glacier Instant Retrieval, Flexible Retrieval and Deep Archive.
- **Used by:** task-01-prerequisites, task-14-glacier-retrieval, task-16-exam-review

## src-glacier-options — Understanding archive retrieval options

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects-retrieval-options.html
- **Purpose:** Expedited, Standard and Bulk retrieval times.
- **Used by:** task-03-cli-files, task-14-glacier-retrieval

## src-glacier-restore — Restoring an archived object

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html
- **Purpose:** Restore requests and temporary restored copies.
- **Used by:** task-14-glacier-retrieval

## src-glacier-minimum — Understanding archival storage in S3 Glacier Flexible Retrieval and S3 Glacier Deep Archive

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonS3/latest/userguide/archival-storage.html
- **Purpose:** Minimum storage-duration cost considerations.
- **Used by:** task-14-glacier-retrieval

## src-storagegateway-docs — AWS Storage Gateway Documentation

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/
- **Purpose:** Storage Gateway file, volume and tape documentation.
- **Used by:** task-01-prerequisites, task-03-cli-files, task-15-storage-gateway, task-16-exam-review

## src-storagegateway-volume — How Volume Gateway works

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/vgw/StorageGatewayConcepts.html
- **Purpose:** Cached and stored volume architecture.
- **Used by:** task-15-storage-gateway

## src-storagegateway-tape — How Tape Gateway works

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/storagegateway/latest/tgw/StorageGatewayConcepts.html
- **Purpose:** Virtual tape library architecture.
- **Used by:** task-15-storage-gateway

# Quality report

- **Phase count:** 7
- **Task count:** 18
- **Checkbox count:** 243
- **CLI command count:** 129
- **Editable-block count:** 21
- **Verification count:** 36
- **Cleanup-item count:** 17
- **Official-source count:** 37
- **Missing items:** 0
- **Uncertain items:** 0

# Offline conversion boundary

This preview and JSON manuscript are offline educational authoring artifacts only. They have not been locally validated by Study Tracker, imported, accepted, approved, published or fingerprinted.
