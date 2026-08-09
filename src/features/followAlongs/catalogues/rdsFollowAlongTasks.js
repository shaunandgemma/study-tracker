/** Amazon RDS Follow Along Tasks (SAA-C03) */
export const RDS_TASKS = [
  {
    "id": "task-saa-rds-create-rds-and-connect-from-ec2-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-rds",
    "title": "Create RDS and connect from EC2",
    "slug": "create-rds-and-connect-from-ec2",
    "service": "Amazon RDS",
    "feature": "Amazon RDS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a private Amazon RDS for MySQL database, launch an EC2 client instance, allow access using security groups, and connect from EC2 to RDS.",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "RDS DB instance",
        "body": "Amazon RDS runs a managed relational database. You do not patch the database host yourself. You still control engine, size, storage, backups, and networking."
      },
      {
        "id": "concept-2",
        "title": "EC2 as database client",
        "body": "EC2 can act like an application server. The EC2 instance connects to the RDS endpoint. The database should usually stay private."
      },
      {
        "id": "concept-3",
        "title": "Private database design",
        "body": "RDS should normally be in private subnets. Do not make a database public unless there is a strong reason. Applications connect from inside the VPC."
      },
      {
        "id": "concept-4",
        "title": "Resource plan",
        "body": "ResourceExample nameSettingReasonRegioneu-west-2LondonKeeps lab localVPCdefault VPCExistingBeginner-safe labEC2 SGrds-task1-ec2-sgSSH from your IPAdmin accessRDS SGrds-task1-db-sgMySQL 3306 from EC2 SGPrivate DB accessDBsaa-rds-task1-mysqlRDS MySQLEasy SQL client testEC2saa-rds-task1-clientAmazon LinuxRuns MySQL client"
      },
      {
        "id": "concept-5",
        "title": "Security group plan",
        "body": "Security groupDirectionPortSourceReasonrds-task1-ec2-sgInbound22your-ip/32SSH only from yourds-task1-ec2-sgOutboundAllRDS SGClient can reach DBrds-task1-db-sgInbound3306EC2 SGMySQL from EC2 onlyrds-task1-db-sgOutboundDefaultDefaultRDS replies allowed"
      }
    ],
    "whyItMatters": "This matters because most real applications place databases behind application servers. For the exam, remember: EC2 needs network reachability, the RDS security group must allow the database port, and the DB endpoint is the connection target.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Database engine",
        "value": "MySQL"
      },
      {
        "label": "DB identifier",
        "value": "saa-rds-task1-mysql"
      },
      {
        "label": "DB username",
        "value": "adminuser"
      },
      {
        "label": "DB name",
        "value": "appdb"
      },
      {
        "label": "Database port",
        "value": "3306"
      },
      {
        "label": "EC2 instance name",
        "value": "saa-rds-task1-client"
      },
      {
        "label": "EC2 security group",
        "value": "rds-task1-ec2-sg"
      },
      {
        "label": "RDS security group",
        "value": "rds-task1-db-sg"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      }
    ],
    "costWarning": "Database instance, storage, backup, I/O, data-transfer and related service charges may apply. Check current regional pricing and complete cleanup promptly.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console with an IAM user, IAM role, or IAM Identity Center permission set."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "PurposeIAM actionsIdentitysts:GetCallerIdentityEC2 setupec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances, ec2:CreateTagsNetworkingec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:DeleteSecurityGroupRDS setuprds:CreateDBInstance, rds:DescribeDBInstances, rds:ModifyDBInstance, rds:DeleteDBInstance, rds:AddTagsToResourceRDS subnet groupsrds:CreateDBSubnetGroup, rds:DescribeDBSubnetGroups, rds:DeleteDBSubnetGroupIAM pass roleiam:PassRole if you launch EC2 with an instance profileCleanupec2:RevokeSecurityGroupIngress, ec2:RevokeSecurityGroupEgress, rds:DeleteDBInstance",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Choose the VPC and subnets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the VPC console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Confirm the default VPC exists in eu-west-2."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Subnets."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Confirm there are subnets in at least two Availability Zones."
          }
        ],
        "note": "RDS DB subnet groups normally need subnets in at least two Availability Zones.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the EC2 security group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the EC2 console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Security Groups."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it rds-task1-ec2-sg."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select the default VPC."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Add inbound SSH 22 from your-ip/32."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Leave outbound allowed for the lab."
          }
        ],
        "note": null,
        "warning": "Never allow SSH from 0.0.0.0/0 in a real account.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the RDS security group",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Stay in the EC2 console."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Security Groups."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Name it rds-task1-db-sg."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Select the same default VPC."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Add inbound rule MYSQL/Aurora on port 3306."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Set the source to rds-task1-ec2-sg."
          }
        ],
        "note": "This means only instances using the EC2 security group can reach the database port.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Launch the EC2 client instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the EC2 console."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Name it saa-rds-task1-client."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose Amazon Linux."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Choose a small instance type such as t3.micro or t2.micro if available."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Place it in the default VPC."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Attach security group rds-task1-ec2-sg."
          },
          {
            "id": "console-step-5-item-9",
            "text": "Launch the instance."
          }
        ],
        "note": "This instance is the test client that connects to RDS.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the RDS database",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the Amazon RDS console."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Databases."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Create database."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Standard create."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Choose MySQL."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose a low-cost template such as Free tier if available."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Set DB instance identifier to saa-rds-task1-mysql."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Set master username to adminuser."
          },
          {
            "id": "console-step-6-item-9",
            "text": "Set a lab password and save it safely."
          },
          {
            "id": "console-step-6-item-10",
            "text": "Under connectivity, choose the default VPC."
          },
          {
            "id": "console-step-6-item-11",
            "text": "Set Public access to No."
          },
          {
            "id": "console-step-6-item-12",
            "text": "Attach security group rds-task1-db-sg."
          },
          {
            "id": "console-step-6-item-13",
            "text": "Create the database."
          }
        ],
        "note": null,
        "warning": "Do not store the database password in the guide or in Git.",
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Wait for the database to become available",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "In the RDS console, open Databases."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Select saa-rds-task1-mysql."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Wait until status is Available."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Copy the database Endpoint."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Keep the port as 3306."
          }
        ],
        "note": "The endpoint is the DNS name your EC2 client uses.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Connect to EC2 and install a MySQL client",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open the EC2 console."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Select saa-rds-task1-client."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Choose Connect."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Use EC2 Instance Connect or SSH."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Run sudo dnf install -y mariadb105 on Amazon Linux 2023."
          },
          {
            "id": "console-step-8-item-6",
            "text": "If that package is not available, run sudo dnf search mariadb and install the client package shown."
          }
        ],
        "note": "MariaDB client can connect to MySQL-compatible databases.",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Connect from EC2 to RDS",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "On EC2, run mysql -h RDS-ENDPOINT -P 3306 -u adminuser -p."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Replace RDS-ENDPOINT with your copied endpoint."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Enter the database password."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Run SELECT VERSION();."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Run CREATE DATABASE IF NOT EXISTS appdb;."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Run SHOW DATABASES;."
          }
        ],
        "note": "Success means EC2 can resolve the endpoint and reach RDS on port 3306.",
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Terminate EC2 instance saa-rds-task1-client."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Delete RDS DB instance saa-rds-task1-mysql."
          },
          {
            "id": "console-step-10-item-3",
            "text": "For a lab, skip the final snapshot if you do not need it."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Delete the DB subnet group if you created a custom one."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Delete security group rds-task1-db-sg."
          },
          {
            "id": "console-step-10-item-6",
            "text": "Delete security group rds-task1-ec2-sg."
          }
        ],
        "note": "OrderDelete itemWhy1Terminate EC2 instanceStops client charges2Delete RDS DB instanceStops database charges3Skip final snapshot for labAvoids snapshot storage cost4Delete DB subnet group if createdRemoves RDS dependency5Delete RDS security groupOnly after DB is gone6Delete EC2 security groupOnly after EC2 is gone",
        "warning": "RDS deletion can take several minutes. Security groups cannot be deleted while still attached.",
        "expectedResult": "Step 10 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your AWS identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nDB_ID=saa-rds-task1-mysql\nDB_USER=adminuser\nDB_NAME=appdb\nEC2_SG_NAME=rds-task1-ec2-sg\nDB_SG_NAME=rds-task1-db-sg\nEC2_NAME=saa-rds-task1-client"
          }
        ],
        "note": "Use these names throughout the lab.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Find the default VPC",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\necho $VPC_ID"
          }
        ],
        "note": "Expected: a VPC ID like vpc-123456.",
        "warning": null,
        "expectedResult": "Expected: a VPC ID like vpc-123456."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create security groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "EC2_SG_ID=$(aws ec2 create-security-group --region $REGION --group-name $EC2_SG_NAME --description 'EC2 client security group for RDS task 1' --vpc-id $VPC_ID --query 'GroupId' --output text)\nDB_SG_ID=$(aws ec2 create-security-group --region $REGION --group-name $DB_SG_NAME --description 'RDS DB security group for task 1' --vpc-id $VPC_ID --query 'GroupId' --output text)\necho $EC2_SG_ID\necho $DB_SG_ID"
          }
        ],
        "note": "Expected: two security group IDs.",
        "warning": null,
        "expectedResult": "Expected: two security group IDs."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Add security group rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "MY_IP=$(curl -s https://checkip.amazonaws.com)/32\naws ec2 authorize-security-group-ingress --region $REGION --group-id $EC2_SG_ID --protocol tcp --port 22 --cidr $MY_IP\naws ec2 authorize-security-group-ingress --region $REGION --group-id $DB_SG_ID --protocol tcp --port 3306 --source-group $EC2_SG_ID"
          }
        ],
        "note": null,
        "warning": "The curl command uses an internet service to find your public IP.",
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create a DB subnet group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "SUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text)\naws rds create-db-subnet-group --region $REGION --db-subnet-group-name rds-task1-subnet-group --db-subnet-group-description 'RDS task 1 subnet group' --subnet-ids $SUBNETS"
          }
        ],
        "note": "Expected: RDS accepts at least two subnets.",
        "warning": null,
        "expectedResult": "Expected: RDS accepts at least two subnets."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Create the RDS DB instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "read -s -p 'Enter a temporary DB password: ' DB_PASS\necho\naws rds create-db-instance --region $REGION --db-instance-identifier $DB_ID --db-instance-class db.t3.micro --engine mysql --allocated-storage 20 --master-username $DB_USER --master-user-password \"$DB_PASS\" --db-subnet-group-name rds-task1-subnet-group --vpc-security-group-ids $DB_SG_ID --no-publicly-accessible --backup-retention-period 0 --tags Key=Name,Value=$DB_ID"
          }
        ],
        "note": null,
        "warning": "Use a strong temporary password. Do not save it in code.",
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Wait for RDS to be available",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws rds wait db-instance-available --region $REGION --db-instance-identifier $DB_ID\nDB_ENDPOINT=$(aws rds describe-db-instances --region $REGION --db-instance-identifier $DB_ID --query 'DBInstances[0].Endpoint.Address' --output text)\necho $DB_ENDPOINT"
          }
        ],
        "note": "Expected: RDS endpoint DNS name.",
        "warning": null,
        "expectedResult": "Expected: RDS endpoint DNS name."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Verify DB status",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-instances --region $REGION --db-instance-identifier $DB_ID --query 'DBInstances[0].[DBInstanceStatus,Endpoint.Address,Endpoint.Port,PubliclyAccessible]' --output table"
          }
        ],
        "note": "Expected: available, port 3306, and False for publicly accessible.",
        "warning": null,
        "expectedResult": "Expected: available, port 3306, and False for publicly accessible."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Cleanup commands",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-instance --region $REGION --db-instance-identifier $DB_ID --skip-final-snapshot --delete-automated-backups\naws rds wait db-instance-deleted --region $REGION --db-instance-identifier $DB_ID\naws rds delete-db-subnet-group --region $REGION --db-subnet-group-name rds-task1-subnet-group\naws ec2 delete-security-group --region $REGION --group-id $DB_SG_ID\naws ec2 delete-security-group --region $REGION --group-id $EC2_SG_ID"
          }
        ],
        "note": null,
        "warning": "Run cleanup only after you finish testing. Terminate the EC2 instance separately if you launched one in the console.",
        "expectedResult": "CLI command step 10 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "RDS basic rule",
        "body": "RDS = managed relational database. RDS manages the database host. You manage schema, users, and app access."
      },
      {
        "id": "cs-2",
        "title": "RDS endpoint",
        "body": "RDS endpoint = DNS name for the database. Applications connect to the endpoint. Do not connect to an RDS instance ID."
      },
      {
        "id": "cs-3",
        "title": "Private database",
        "body": "RDS private = no public internet access. EC2 in the VPC can still connect. This is the normal exam design."
      },
      {
        "id": "cs-4",
        "title": "Security group source",
        "body": "RDS SG should allow the EC2 SG. Do not use broad CIDRs for app access. Security group references are cleaner."
      },
      {
        "id": "cs-5",
        "title": "MySQL port",
        "body": "MySQL uses port 3306. PostgreSQL uses 5432. SQL Server often uses 1433."
      },
      {
        "id": "cs-6",
        "title": "DB subnet group",
        "body": "DB subnet group = subnets RDS can use. RDS needs subnet placement. Multi-AZ needs more than one AZ."
      },
      {
        "id": "cs-7",
        "title": "Public access trap",
        "body": "Publicly accessible = reachable from the internet path. It still needs security group access. Best answer is usually private DB."
      },
      {
        "id": "cs-8",
        "title": "EC2 client pattern",
        "body": "EC2 app server connects to RDS. EC2 SG is the allowed source. RDS SG protects the database."
      },
      {
        "id": "cs-9",
        "title": "Connection failure memory",
        "body": "Failure can be DNS, route, SG, NACL, credentials, or engine status. Check network first. Then check login details."
      },
      {
        "id": "cs-10",
        "title": "RDS availability",
        "body": "RDS must be available before connection. Creating can take minutes. Endpoint appears before it is usable."
      },
      {
        "id": "cs-11",
        "title": "Credentials",
        "body": "RDS master password is not IAM by default. Database users are separate from IAM users. IAM database authentication is optional."
      },
      {
        "id": "cs-12",
        "title": "Cost memory",
        "body": "RDS costs while running. Storage costs also apply. Final snapshots can cost money."
      },
      {
        "id": "cs-13",
        "title": "Cleanup order",
        "body": "Delete EC2 first. Delete RDS next. Delete subnet group and security groups last."
      },
      {
        "id": "cs-14",
        "title": "Exam decision",
        "body": "Need managed SQL database = RDS. Need serverless relational = Aurora Serverless. Need NoSQL key-value = DynamoDB."
      },
      {
        "id": "cs-15",
        "title": "Security plan table",
        "body": "Security groupDirectionPortSourceReasonrds-task1-ec2-sgInbound22your-ip/32SSH only from yourds-task1-ec2-sgOutboundAllRDS SGClient can reach DBrds-task1-db-sgInbound3306EC2 SGMySQL from EC2 onlyrds-task1-db-sgOutboundDefaultDefaultRDS replies allowed"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check Console step 0 permissions. Run aws sts get-caller-identity. Confirm you are using the expected account."
      },
      {
        "id": "ts-2",
        "title": "DB not available",
        "body": "Wait until RDS status is available. Do not test while the DB is creating or modifying."
      },
      {
        "id": "ts-3",
        "title": "Connection times out",
        "body": "Check the RDS security group. Allow port 3306 from the EC2 security group. Check NACLs if changed."
      },
      {
        "id": "ts-4",
        "title": "Access denied for user",
        "body": "The network works, but database login failed. Check username and password. Check the DB engine user."
      },
      {
        "id": "ts-5",
        "title": "Unknown host",
        "body": "Check the copied RDS endpoint. Do not include https://. Use the endpoint DNS name only."
      },
      {
        "id": "ts-6",
        "title": "Security group delete fails",
        "body": "A resource still uses the security group. Delete the EC2 instance or RDS DB first. Then delete the security group."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1 — Public RDS",
        "body": "Wrong idea: make RDS public so EC2 can connect. Correct idea: keep RDS private and allow EC2 security group access."
      },
      {
        "id": "trap-2",
        "title": "Trap 2 — IAM vs DB login",
        "body": "Wrong idea: IAM user password logs into MySQL. Correct idea: database users are separate unless IAM DB auth is enabled."
      },
      {
        "id": "trap-3",
        "title": "Trap 3 — Endpoint confusion",
        "body": "Wrong idea: connect to the DB identifier. Correct idea: connect to the RDS endpoint DNS name."
      },
      {
        "id": "trap-4",
        "title": "Trap 4 — Security group direction",
        "body": "Wrong idea: only configure EC2 inbound. Correct idea: RDS inbound must allow the DB port from EC2."
      },
      {
        "id": "trap-5",
        "title": "Trap 5 — Subnet group",
        "body": "Wrong idea: RDS needs one subnet only. Correct idea: DB subnet groups normally span multiple AZs."
      },
      {
        "id": "trap-6",
        "title": "Trap 6 — Multi-AZ read scaling",
        "body": "Wrong idea: Multi-AZ gives read scaling. Correct idea: Multi-AZ is mainly high availability."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "App talks in. Database stays hidden. EC2 connects to private RDS through security groups.",
    "flashcardSetId": "rds_task_1_flashcards"
  },
  {
    "id": "task-saa-rds-create-a-multi-az-rds-database-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-rds",
    "title": "Create a Multi-AZ RDS database",
    "slug": "create-a-multi-az-rds-database",
    "service": "Amazon RDS",
    "feature": "Amazon RDS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an Amazon RDS Multi-AZ DB instance, understand the standby instance, trigger a controlled failover, and verify the endpoint still stays the same.",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Multi-AZ DB instance",
        "body": "Amazon RDS Multi-AZ creates a standby copy in another Availability Zone. The standby is for high availability. It is not used for normal read traffic."
      },
      {
        "id": "concept-2",
        "title": "Failover",
        "body": "Failover means RDS promotes the standby database. The database endpoint stays the same. Your application normally reconnects to the same endpoint."
      },
      {
        "id": "concept-3",
        "title": "Multi-AZ is not read scaling",
        "body": "Multi-AZ DB instance = availability. Read Replica = read scaling. Do not choose Multi-AZ when the exam asks for more read capacity."
      },
      {
        "id": "concept-4",
        "title": "Lab design table",
        "body": "PartExamplePurposeExam ideaPrimary DBsaa-db-task2-mysqlHandles normal writes and readsMain databaseStandby DBManaged by RDSTakes over during failoverHigh availabilityDB endpointRDS DNS nameApplication connection targetStays the sameEC2 clientsaa-db-task2-clientTests database accessApplication host"
      }
    ],
    "whyItMatters": "Multi-AZ matters because databases need high availability. It protects against an Availability Zone issue or DB instance failure. For the exam, remember that Multi-AZ is mainly for failover, not faster reads.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "DB engine",
        "value": "MySQL"
      },
      {
        "label": "DB identifier",
        "value": "saa-db-task2-mysql"
      },
      {
        "label": "DB instance class",
        "value": "db.t4g.micro or smallest available class"
      },
      {
        "label": "Database name",
        "value": "labdb"
      },
      {
        "label": "Master username",
        "value": "adminuser"
      },
      {
        "label": "DB port",
        "value": "3306"
      },
      {
        "label": "EC2 client name",
        "value": "saa-db-task2-client"
      },
      {
        "label": "Security group name",
        "value": "saa-db-task2-rds-sg"
      },
      {
        "label": "Output path",
        "value": "content/SAA/guides/databases_guides/saa-db-task-2.html"
      }
    ],
    "costWarning": "Database instance, storage, backup, I/O, data-transfer and related service charges may apply. Check current regional pricing and complete cleanup promptly.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console with an IAM user, IAM role, or IAM Identity Center permission set."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity RDS setup: rds:CreateDBInstance, rds:DescribeDBInstances, rds:ModifyDBInstance, rds:RebootDBInstance RDS subnet group: rds:CreateDBSubnetGroup, rds:DescribeDBSubnetGroups, rds:DeleteDBSubnetGroup VPC discovery: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups Security groups: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup EC2 client: ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances, iam:PassRole Cleanup: rds:DeleteDBInstance, rds:DescribeDBSnapshots",
        "warning": "Do not leave a public database or broad security group rule in a real account.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Choose the VPC and subnet setup",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the VPC console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use the default VPC for this learning lab."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Subnets."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Confirm there are at least two subnets in different Availability Zones."
          }
        ],
        "note": "RDS Multi-AZ needs subnets in at least two Availability Zones.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the RDS security group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the EC2 console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Security Groups."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it saa-db-task2-rds-sg."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select the default VPC."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Add an inbound rule for MySQL/Aurora on port 3306 from the EC2 client security group later."
          }
        ],
        "note": "At first, you may create the group without inbound rules. Add the EC2 source after the client security group exists.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the Multi-AZ RDS database",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the Amazon RDS console."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Databases."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Create database."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Standard create."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose MySQL."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose a small DB instance class for the lab."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Set DB instance identifier to saa-db-task2-mysql."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Set master username to adminuser."
          },
          {
            "id": "console-step-4-item-9",
            "text": "Create or store a safe password."
          },
          {
            "id": "console-step-4-item-10",
            "text": "Under availability, choose Multi-AZ DB instance if shown."
          },
          {
            "id": "console-step-4-item-11",
            "text": "Under connectivity, choose the default VPC."
          },
          {
            "id": "console-step-4-item-12",
            "text": "Choose the RDS security group saa-db-task2-rds-sg."
          },
          {
            "id": "console-step-4-item-13",
            "text": "Keep public access set to No."
          },
          {
            "id": "console-step-4-item-14",
            "text": "Create the database."
          }
        ],
        "note": null,
        "warning": "Do not use a real company password in a lab.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the EC2 client instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the EC2 console."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Launch instance."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Name it saa-db-task2-client."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Amazon Linux."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose a small instance type."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Place it in the same VPC as the RDS database."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Attach a security group that allows SSM Session Manager access, or SSH from your IP if you are using SSH."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Launch the instance."
          }
        ],
        "note": "SSM Session Manager is safer than opening SSH to the internet.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Allow EC2 to reach RDS",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the EC2 console."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Security Groups."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open saa-db-task2-rds-sg."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Edit inbound rules."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Add MySQL/Aurora port 3306."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Set the source to the EC2 client security group."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Save the rule."
          }
        ],
        "note": "Security group source-to-security-group access is better than allowing a wide CIDR block.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Connect from EC2 to RDS",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the EC2 client with Session Manager or SSH."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Install a MySQL client if needed."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Copy the RDS endpoint from the RDS database page."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Connect to the database using the endpoint, username, and password."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Create a small test table."
          }
        ],
        "note": "Success means the EC2 instance can connect to the RDS endpoint on port 3306.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Trigger a controlled failover",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open the Amazon RDS console."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Choose Databases."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Choose saa-db-task2-mysql."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Choose Reboot."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Tick Reboot with failover if available."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Confirm the reboot."
          }
        ],
        "note": null,
        "warning": "This causes a short database interruption. Do not do this in production without planning.",
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Verify after failover",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Watch the RDS database status until it returns to Available."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Check the Availability Zone shown for the DB instance."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Reconnect from the EC2 client using the same RDS endpoint."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Run a simple SQL query against the test table."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Confirm the endpoint name did not change."
          }
        ],
        "note": "The endpoint remains the application target. DNS updates behind the endpoint point to the new primary.",
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Terminate the EC2 client instance."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Wait until the EC2 instance is terminated."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Delete the RDS DB instance."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Skip final snapshot only if this is a disposable lab."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Wait until the DB instance is deleted."
          },
          {
            "id": "console-step-10-item-6",
            "text": "Delete the RDS subnet group if you created a custom one."
          },
          {
            "id": "console-step-10-item-7",
            "text": "Delete the RDS security group."
          },
          {
            "id": "console-step-10-item-8",
            "text": "Delete any extra EC2 security groups created for the lab."
          }
        ],
        "note": null,
        "warning": "RDS deletion can take several minutes. Storage charges continue until deletion finishes.",
        "expectedResult": "Step 10 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your AWS identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set lab variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "export AWS_REGION=eu-west-2\nexport DB_ID=saa-db-task2-mysql\nexport DB_NAME=labdb\nexport DB_USER=adminuser\nexport DB_PORT=3306\nexport DB_PASS='ChangeThisPassword123!'\nexport VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nexport SUBNETS=$(aws ec2 describe-subnets --region $AWS_REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text)"
          }
        ],
        "note": "Expected: variables are created for the default VPC and two subnets.",
        "warning": null,
        "expectedResult": "Expected: variables are created for the default VPC and two subnets."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create RDS security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "export RDS_SG_ID=$(aws ec2 create-security-group --region $AWS_REGION --group-name saa-db-task2-rds-sg --description 'RDS Multi-AZ lab security group' --vpc-id $VPC_ID --query 'GroupId' --output text)\necho $RDS_SG_ID"
          }
        ],
        "note": "Expected: a security group ID such as sg-123456.",
        "warning": null,
        "expectedResult": "Expected: a security group ID such as sg-123456."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create DB subnet group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-subnet-group --region $AWS_REGION --db-subnet-group-name saa-db-task2-subnets --db-subnet-group-description 'Subnets for RDS Multi-AZ lab' --subnet-ids $SUBNETS"
          }
        ],
        "note": "Expected: RDS creates a subnet group using two subnets.",
        "warning": null,
        "expectedResult": "Expected: RDS creates a subnet group using two subnets."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create the Multi-AZ DB instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-instance --region $AWS_REGION --db-instance-identifier $DB_ID --db-instance-class db.t4g.micro --engine mysql --allocated-storage 20 --master-username $DB_USER --master-user-password $DB_PASS --db-name $DB_NAME --vpc-security-group-ids $RDS_SG_ID --db-subnet-group-name saa-db-task2-subnets --multi-az --backup-retention-period 1 --no-publicly-accessible"
          }
        ],
        "note": "Expected: RDS starts creating the DB instance. This can take several minutes.",
        "warning": null,
        "expectedResult": "Expected: RDS starts creating the DB instance. This can take several minutes."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Wait for the database to become available",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws rds wait db-instance-available --region $AWS_REGION --db-instance-identifier $DB_ID\naws rds describe-db-instances --region $AWS_REGION --db-instance-identifier $DB_ID --query 'DBInstances[0].{Status:DBInstanceStatus,MultiAZ:MultiAZ,Endpoint:Endpoint.Address,AZ:AvailabilityZone}' --output table"
          }
        ],
        "note": "Expected: MultiAZ shows True and the DB has an endpoint.",
        "warning": null,
        "expectedResult": "Expected: MultiAZ shows True and the DB has an endpoint."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Trigger failover with reboot",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws rds reboot-db-instance --region $AWS_REGION --db-instance-identifier $DB_ID --force-failover"
          }
        ],
        "note": null,
        "warning": "This intentionally interrupts the database for failover testing.",
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Verify failover completed",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws rds wait db-instance-available --region $AWS_REGION --db-instance-identifier $DB_ID\naws rds describe-db-instances --region $AWS_REGION --db-instance-identifier $DB_ID --query 'DBInstances[0].{Status:DBInstanceStatus,MultiAZ:MultiAZ,Endpoint:Endpoint.Address,AZ:AvailabilityZone}' --output table"
          }
        ],
        "note": "Expected: the database is available again and the endpoint is still the same DNS name.",
        "warning": null,
        "expectedResult": "Expected: the database is available again and the endpoint is still the same DNS name."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Clean up the RDS database",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-instance --region $AWS_REGION --db-instance-identifier $DB_ID --skip-final-snapshot --delete-automated-backups\naws rds wait db-instance-deleted --region $AWS_REGION --db-instance-identifier $DB_ID"
          }
        ],
        "note": null,
        "warning": "Only skip the final snapshot for a disposable learning lab.",
        "expectedResult": "CLI command step 9 executed successfully."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Clean up subnet group and security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-subnet-group --region $AWS_REGION --db-subnet-group-name saa-db-task2-subnets\naws ec2 delete-security-group --region $AWS_REGION --group-id $RDS_SG_ID"
          }
        ],
        "note": "Expected: the subnet group and security group are deleted after the DB is gone.",
        "warning": null,
        "expectedResult": "Expected: the subnet group and security group are deleted after the DB is gone."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "RDS Multi-AZ purpose",
        "body": "RDS Multi-AZ = high availability. RDS Multi-AZ = automatic failover. RDS Multi-AZ does not normally improve read speed."
      },
      {
        "id": "cs-2",
        "title": "Standby database",
        "body": "Standby = kept in another Availability Zone. Standby = managed by AWS. Standby = promoted during failover."
      },
      {
        "id": "cs-3",
        "title": "Endpoint rule",
        "body": "RDS endpoint = application connection name. Failover changes the primary behind the endpoint. The app should reconnect to the same endpoint."
      },
      {
        "id": "cs-4",
        "title": "Read scaling trap",
        "body": "Read scaling needed = choose Read Replica. High availability needed = choose Multi-AZ. Global read locality = consider cross-Region replica or Aurora Global Database."
      },
      {
        "id": "cs-5",
        "title": "Backup benefit",
        "body": "Multi-AZ can reduce backup impact. RDS may use the standby for some maintenance operations. Backups still need retention settings."
      },
      {
        "id": "cs-6",
        "title": "Failover causes interruption",
        "body": "Failover is not zero downtime. Connections can drop. Applications need retry logic."
      },
      {
        "id": "cs-7",
        "title": "Common failover triggers",
        "body": "AZ outage can trigger failover. DB instance failure can trigger failover. Planned maintenance can trigger failover. Manual reboot with failover can test it."
      },
      {
        "id": "cs-8",
        "title": "Single standby vs DB cluster",
        "body": "Multi-AZ DB instance = one standby. Multi-AZ DB cluster = two readable standbys for supported engines. Know which design the question describes."
      },
      {
        "id": "cs-9",
        "title": "Cost memory",
        "body": "Multi-AZ costs more than Single-AZ. You pay for standby capacity and storage. Use it when availability matters."
      },
      {
        "id": "cs-10",
        "title": "Security group memory",
        "body": "RDS security group should allow only the app source. Do not open MySQL to 0.0.0.0/0. Use security group referencing where possible."
      },
      {
        "id": "cs-11",
        "title": "Subnet group memory",
        "body": "RDS subnet group = subnets RDS can use. Multi-AZ needs more than one AZ. Private subnets are normal for databases."
      },
      {
        "id": "cs-12",
        "title": "Troubleshooting memory",
        "body": "Connection timeout = route or security group issue. Access denied = database username or password issue. Endpoint not found = DB still creating or wrong Region."
      },
      {
        "id": "cs-13",
        "title": "Exam comparison table",
        "body": "NeedBest choiceWhyTrapAZ failure protectionRDS Multi-AZAutomatic failoverNot read scalingMore read capacityRead ReplicaOffloads readsAsync replicationFast regional readsCross-Region replicaCloser to usersNot automatic primary HAManaged writer/readersAurora clusterCluster endpointsDifferent architecture"
      },
      {
        "id": "cs-14",
        "title": "Cleanup memory",
        "body": "Delete EC2 first. Delete RDS next. Delete subnet group after RDS is gone. Delete security groups last."
      },
      {
        "id": "cs-15",
        "title": "Car listening phrase",
        "body": "Multi-AZ means survive an AZ. Read Replica means scale reads. Endpoint stays the app target."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "DB creation is slow",
        "body": "RDS database creation can take several minutes. Multi-AZ usually takes longer than Single-AZ."
      },
      {
        "id": "ts-2",
        "title": "Cannot connect from EC2",
        "body": "Check the RDS security group. Allow port 3306 from the EC2 client security group. Do not use your laptop IP if the database is private."
      },
      {
        "id": "ts-3",
        "title": "DB endpoint does not work",
        "body": "Confirm the DB status is Available. Confirm you copied the endpoint, not the DB identifier. Confirm the port is 3306."
      },
      {
        "id": "ts-4",
        "title": "Access denied in MySQL",
        "body": "This usually means the username, password, or database user grants are wrong. It is different from a network timeout."
      },
      {
        "id": "ts-5",
        "title": "Failover option not visible",
        "body": "Confirm the DB is Multi-AZ. Single-AZ instances do not have standby failover. Some console wording can differ by engine."
      },
      {
        "id": "ts-6",
        "title": "Security group will not delete",
        "body": "Delete the RDS DB first. Wait until RDS is fully deleted. Then delete the security group."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1 — Multi-AZ is not Read Replica",
        "body": "Wrong choice: Multi-AZ for read scaling. Correct idea: Multi-AZ is mainly for high availability and failover."
      },
      {
        "id": "trap-2",
        "title": "Trap 2 — standby is not normally readable",
        "body": "Wrong choice: send reports to the standby. Correct idea: use a Read Replica for normal reporting reads."
      },
      {
        "id": "trap-3",
        "title": "Trap 3 — endpoint should not be hardcoded to an IP",
        "body": "Wrong choice: connect to the DB instance IP. Correct idea: connect to the RDS endpoint DNS name."
      },
      {
        "id": "trap-4",
        "title": "Trap 4 — failover is not zero downtime",
        "body": "Wrong choice: assume no dropped connections. Correct idea: applications need retry and reconnect logic."
      },
      {
        "id": "trap-5",
        "title": "Trap 5 — Multi-AZ is not multi-Region",
        "body": "Wrong choice: Multi-AZ for regional disaster recovery. Correct idea: use cross-Region designs for Region failure planning."
      },
      {
        "id": "trap-6",
        "title": "Trap 6 — public access is not needed",
        "body": "Wrong choice: make the database public for EC2 access. Correct idea: keep RDS private and allow EC2 security group access."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "Multi-AZ = standby safety net. If the primary falls, RDS promotes the standby and the app reconnects to the same endpoint.",
    "flashcardSetId": "rds_task_2_flashcards"
  },
  {
    "id": "task-saa-rds-create-an-rds-read-replica-and-explain-read-scaling-003",
    "examCode": "aws-saa-c03",
    "topicId": "topic-rds",
    "title": "Create an RDS Read Replica and explain read scaling",
    "slug": "create-an-rds-read-replica-and-explain-read-scaling",
    "service": "Amazon RDS",
    "feature": "Amazon RDS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a read replica from a primary RDS database, route read-only queries to replica endpoint, and explain how replicas reduce read pressure on the writer.",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Medium"
    ],
    "flow": [],
    "concepts": [],
    "whyItMatters": "Understanding Amazon RDS in Amazon RDS is crucial for database reliability, security, and AWS SAA-C03 exam questions.",
    "values": [],
    "costWarning": "Read replicas are billed as additional database instances. Delete replica and primary after lab.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Read scaling",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Eventual consistency",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Writes stay on primary",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Promotion option",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Cross-region support",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Exam clue",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Before you start",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Set Region to eu-west-2."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Use default VPC and private-friendly security group design."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Prepare one primary DB first; replicas are created from an existing source DB."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Remember: this task is about read scaling, not automatic failover."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Create primary RDS instance",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Go to RDS -> Databases -> Create database."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Choose Standard create, engine MySQL."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Create DB named db-task3-primary."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Set credentials and keep them safe."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Choose private access and secure SG settings."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Wait for status Available."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Create read replica",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Select db-task3-primary."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Choose Actions -> Create read replica."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Replica identifier: db-task3-replica-1."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Choose same or different AZ as needed."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Create read replica and wait for Available."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Capture both endpoints",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Note primary endpoint (writer)."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Note replica endpoint (reader)."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Use primary for writes and replica for read-heavy queries."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Do not point write operations at the replica endpoint."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 10 completed successfully."
      },
      {
        "id": "console-step-11",
        "number": 11,
        "title": "Explain read scaling",
        "instructions": [
          {
            "id": "console-step-11-item-1",
            "text": "Application sends writes to primary."
          },
          {
            "id": "console-step-11-item-2",
            "text": "Application sends reports/search/list queries to replica."
          },
          {
            "id": "console-step-11-item-3",
            "text": "Primary CPU/load decreases for read-heavy workloads."
          },
          {
            "id": "console-step-11-item-4",
            "text": "Small lag can occur before new writes appear on replica."
          },
          {
            "id": "console-step-11-item-5",
            "text": "For strict read-after-write consistency, query primary instead of replica."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 11 completed successfully."
      },
      {
        "id": "console-step-12",
        "number": 12,
        "title": "Optional promotion exercise",
        "instructions": [
          {
            "id": "console-step-12-item-1",
            "text": "Select read replica."
          },
          {
            "id": "console-step-12-item-2",
            "text": "Choose Actions -> Promote (optional lab only)."
          },
          {
            "id": "console-step-12-item-3",
            "text": "Observe it becomes standalone DB instance."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 12 completed successfully."
      },
      {
        "id": "console-step-13",
        "number": 13,
        "title": "Tear down",
        "instructions": [
          {
            "id": "console-step-13-item-1",
            "text": "Delete read replica first."
          },
          {
            "id": "console-step-13-item-2",
            "text": "Delete primary DB after replica is gone."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 13 completed successfully."
      },
      {
        "id": "console-step-14",
        "number": 14,
        "title": "Set variables",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 14 completed successfully."
      },
      {
        "id": "console-step-15",
        "number": 15,
        "title": "Create primary DB",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 15 completed successfully."
      },
      {
        "id": "console-step-16",
        "number": 16,
        "title": "Create read replica",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 16 completed successfully."
      },
      {
        "id": "console-step-17",
        "number": 17,
        "title": "Display endpoints",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 17 completed successfully."
      },
      {
        "id": "console-step-18",
        "number": 18,
        "title": "Optional promote replica",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 18 completed successfully."
      },
      {
        "id": "console-step-19",
        "number": 19,
        "title": "Tear down",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 19 completed successfully."
      },
      {
        "id": "console-step-20",
        "number": 20,
        "title": "Replica setup checks",
        "instructions": [
          {
            "id": "console-step-20-item-1",
            "text": "Primary and replica both show Available."
          },
          {
            "id": "console-step-20-item-2",
            "text": "Replica is linked to source DB."
          },
          {
            "id": "console-step-20-item-3",
            "text": "Primary and replica endpoints are different."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": ""
      },
      {
        "id": "console-step-21",
        "number": 21,
        "title": "Read scaling checks",
        "instructions": [
          {
            "id": "console-step-21-item-1",
            "text": "Read-only queries can run against replica."
          },
          {
            "id": "console-step-21-item-2",
            "text": "Writes still target primary endpoint."
          },
          {
            "id": "console-step-21-item-3",
            "text": "Team understands replication lag risk for fresh reads."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": ""
      },
      {
        "id": "console-step-22",
        "number": 22,
        "title": "Read Replica",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 22 completed successfully."
      },
      {
        "id": "console-step-23",
        "number": 23,
        "title": "Replication mode",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 23 completed successfully."
      },
      {
        "id": "console-step-24",
        "number": 24,
        "title": "Write path",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 24 completed successfully."
      },
      {
        "id": "console-step-25",
        "number": 25,
        "title": "Read path",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 25 completed successfully."
      },
      {
        "id": "console-step-26",
        "number": 26,
        "title": "Failover",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 26 completed successfully."
      },
      {
        "id": "console-step-27",
        "number": 27,
        "title": "Promotion",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 27 completed successfully."
      },
      {
        "id": "console-step-28",
        "number": 28,
        "title": "Replica lag high",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 28 completed successfully."
      },
      {
        "id": "console-step-29",
        "number": 29,
        "title": "Read query stale",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 29 completed successfully."
      },
      {
        "id": "console-step-30",
        "number": 30,
        "title": "Create replica blocked",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 30 completed successfully."
      },
      {
        "id": "console-step-31",
        "number": 31,
        "title": "Trap 1",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 31 completed successfully."
      },
      {
        "id": "console-step-32",
        "number": 32,
        "title": "Trap 2",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 32 completed successfully."
      },
      {
        "id": "console-step-33",
        "number": 33,
        "title": "Trap 3",
        "instructions": [],
        "note": null,
        "warning": null,
        "expectedResult": "Step 33 completed successfully."
      }
    ],
    "cliSteps": [],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [],
    "troubleshooting": [],
    "examTraps": [],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "Amazon RDS in Amazon RDS provides high performance and scalable storage.",
    "flashcardSetId": "rds_task_3_flashcards"
  },
  {
    "id": "task-saa-rds-take-an-rds-snapshot-and-restore-a-new-database-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-rds",
    "title": "Take an RDS snapshot and restore a new database",
    "slug": "take-an-rds-snapshot-and-restore-a-new-database",
    "service": "Amazon RDS",
    "feature": "Amazon RDS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a test Amazon RDS database, take a manual snapshot, and restore that snapshot as a new DB instance.",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "RDS manual snapshot",
        "body": "A manual snapshot is a backup you create yourself. It stays until you delete it."
      },
      {
        "id": "concept-2",
        "title": "Snapshot restore creates a new DB",
        "body": "Restoring an RDS snapshot creates a new DB instance. It does not overwrite the old DB instance."
      },
      {
        "id": "concept-3",
        "title": "Snapshot scope",
        "body": "An RDS DB snapshot backs up the whole DB instance storage, not just one table."
      },
      {
        "id": "concept-4",
        "title": "IAM permissions needed",
        "body": "You need permission to create, describe, restore, and delete RDS DB instances and snapshots. For a personal lab account, AdministratorAccess is okay. In a real company, use least privilege."
      },
      {
        "id": "concept-5",
        "title": "CLI access needed",
        "body": "For the CLI path, AWS CLI v2 must be installed and configured. Your profile must be allowed to call the required RDS APIs."
      }
    ],
    "whyItMatters": "Snapshots are used for backup, restore, testing, recovery, and safe database changes.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source DB identifier",
        "value": "saa-rds-task4-source"
      },
      {
        "label": "Restored DB identifier",
        "value": "saa-rds-task4-restored"
      },
      {
        "label": "Snapshot identifier",
        "value": "saa-rds-task4-snapshot"
      },
      {
        "label": "Engine",
        "value": "MySQL"
      },
      {
        "label": "DB instance class",
        "value": "db.t4g.micro"
      },
      {
        "label": "Storage",
        "value": "20 GiB"
      },
      {
        "label": "Public access",
        "value": "No"
      },
      {
        "label": "Master username",
        "value": "adminuser"
      },
      {
        "label": "Master password example",
        "value": "ChangeMe123!"
      }
    ],
    "costWarning": "Database instance, storage, backup, I/O, data-transfer and related service charges may apply. Check current regional pricing and complete cleanup promptly.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Open Amazon RDS",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Use the eu-west-2 Region."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Search for RDS and open Amazon RDS."
          }
        ],
        "note": "Use one Region for the whole lab.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the source database",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "In the left menu, choose Databases."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create database."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Standard create."
          },
          {
            "id": "console-step-2-item-4",
            "text": "For engine, choose MySQL."
          },
          {
            "id": "console-step-2-item-5",
            "text": "For Templates, choose Free tier if it is available. Otherwise choose the smallest low-cost option."
          },
          {
            "id": "console-step-2-item-6",
            "text": "For DB instance identifier, enter saa-rds-task4-source."
          },
          {
            "id": "console-step-2-item-7",
            "text": "For Master username, enter adminuser."
          },
          {
            "id": "console-step-2-item-8",
            "text": "For password, enter a lab password such as ChangeMe123!."
          },
          {
            "id": "console-step-2-item-9",
            "text": "For Public access, choose No."
          },
          {
            "id": "console-step-2-item-10",
            "text": "Keep default VPC settings for this beginner lab."
          },
          {
            "id": "console-step-2-item-11",
            "text": "Choose Create database."
          }
        ],
        "note": null,
        "warning": "Do not use a production database for this lab.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Wait for the source database",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Stay on the Databases page."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Wait until saa-rds-task4-source shows Available."
          },
          {
            "id": "console-step-3-item-3",
            "text": "This can take several minutes."
          }
        ],
        "note": "RDS tasks are not instant.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create a manual snapshot",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select saa-rds-task4-source."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Take snapshot."
          },
          {
            "id": "console-step-4-item-4",
            "text": "For DB snapshot identifier, enter saa-rds-task4-snapshot."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Take snapshot."
          }
        ],
        "note": "A manual snapshot remains until you delete it.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Wait for the snapshot",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "In the left menu, choose Snapshots."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Open the Manual tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Wait until saa-rds-task4-snapshot shows Available."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Restore the snapshot",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select saa-rds-task4-snapshot."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Restore snapshot."
          },
          {
            "id": "console-step-6-item-4",
            "text": "For DB instance identifier, enter saa-rds-task4-restored."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Use the same small DB instance class as the source database."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Keep Public access set to No."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Choose Restore DB instance."
          }
        ],
        "note": "Restore creates a second DB instance.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Wait for the restored database",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Go to Databases."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Wait until saa-rds-task4-restored shows Available."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open the restored DB and check that it has its own endpoint."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Verify the result",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Confirm the source DB still exists."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Confirm the manual snapshot exists."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Confirm the restored DB exists as a separate DB instance."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Confirm the restored DB has a different DB identifier from the source DB."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Tear down the restored database",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Go to Databases."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Select saa-rds-task4-restored."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Choose Actions, then Delete."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Turn off final snapshot if this is only a lab."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Confirm the delete action."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Wait until the restored DB is deleted."
          }
        ],
        "note": null,
        "warning": "Only skip the final snapshot in a disposable lab.",
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Tear down the source database",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Select saa-rds-task4-source."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Choose Actions, then Delete."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Turn off final snapshot if this is only a lab."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Confirm the delete action."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Wait until the source DB is deleted."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 10 completed successfully."
      },
      {
        "id": "console-step-11",
        "number": 11,
        "title": "Delete the manual snapshot",
        "instructions": [
          {
            "id": "console-step-11-item-1",
            "text": "Go to Snapshots."
          },
          {
            "id": "console-step-11-item-2",
            "text": "Open the Manual tab."
          },
          {
            "id": "console-step-11-item-3",
            "text": "Select saa-rds-task4-snapshot."
          },
          {
            "id": "console-step-11-item-4",
            "text": "Choose Actions, then Delete snapshot."
          },
          {
            "id": "console-step-11-item-5",
            "text": "Confirm the delete action."
          }
        ],
        "note": "Delete the snapshot last so you can restore from it during the lab.",
        "warning": null,
        "expectedResult": "Step 11 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your AWS identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: your AWS account ID and ARN are shown.",
        "warning": null,
        "expectedResult": "Expected: your AWS account ID and ARN are shown."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create the source DB instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-instance --region eu-west-2 --db-instance-identifier saa-rds-task4-source --db-instance-class db.t4g.micro --engine mysql --master-username adminuser --master-user-password 'ChangeMe123!' --allocated-storage 20 --storage-type gp3 --backup-retention-period 1 --no-publicly-accessible"
          }
        ],
        "note": "Expected: RDS starts creating the source DB instance.",
        "warning": null,
        "expectedResult": "Expected: RDS starts creating the source DB instance."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Wait for the source DB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws rds wait db-instance-available --region eu-west-2 --db-instance-identifier saa-rds-task4-source"
          }
        ],
        "note": "Expected: the command finishes when the DB is available.",
        "warning": null,
        "expectedResult": "Expected: the command finishes when the DB is available."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a manual snapshot",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-snapshot --region eu-west-2 --db-instance-identifier saa-rds-task4-source --db-snapshot-identifier saa-rds-task4-snapshot"
          }
        ],
        "note": "Expected: RDS starts creating the manual snapshot.",
        "warning": null,
        "expectedResult": "Expected: RDS starts creating the manual snapshot."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Wait for the snapshot",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws rds wait db-snapshot-available --region eu-west-2 --db-snapshot-identifier saa-rds-task4-snapshot"
          }
        ],
        "note": "Expected: the command finishes when the snapshot is available.",
        "warning": null,
        "expectedResult": "Expected: the command finishes when the snapshot is available."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Restore a new DB from the snapshot",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws rds restore-db-instance-from-db-snapshot --region eu-west-2 --db-instance-identifier saa-rds-task4-restored --db-snapshot-identifier saa-rds-task4-snapshot --db-instance-class db.t4g.micro --no-publicly-accessible"
          }
        ],
        "note": "Expected: RDS starts creating a new restored DB instance.",
        "warning": null,
        "expectedResult": "Expected: RDS starts creating a new restored DB instance."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Wait for the restored DB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws rds wait db-instance-available --region eu-west-2 --db-instance-identifier saa-rds-task4-restored"
          }
        ],
        "note": "Expected: the restored DB becomes available.",
        "warning": null,
        "expectedResult": "Expected: the restored DB becomes available."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Verify both DB instances",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-instances --region eu-west-2 --db-instance-identifier saa-rds-task4-restored --query 'DBInstances[0].{DB:DBInstanceIdentifier,Status:DBInstanceStatus,Endpoint:Endpoint.Address}' --output table"
          }
        ],
        "note": "Expected: you see the restored DB instance and its endpoint.",
        "warning": null,
        "expectedResult": "Expected: you see the restored DB instance and its endpoint."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Tear down the DB instances",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-instance --region eu-west-2 --db-instance-identifier saa-rds-task4-restored --skip-final-snapshot --delete-automated-backups"
          },
          {
            "id": "cli-step-9-cmd-2",
            "language": "bash",
            "text": "aws rds wait db-instance-deleted --region eu-west-2 --db-instance-identifier saa-rds-task4-restored"
          },
          {
            "id": "cli-step-9-cmd-3",
            "language": "bash",
            "text": "aws rds delete-db-instance --region eu-west-2 --db-instance-identifier saa-rds-task4-source --skip-final-snapshot --delete-automated-backups"
          },
          {
            "id": "cli-step-9-cmd-4",
            "language": "bash",
            "text": "aws rds wait db-instance-deleted --region eu-west-2 --db-instance-identifier saa-rds-task4-source"
          }
        ],
        "note": null,
        "warning": "Only use --skip-final-snapshot for a disposable lab.",
        "expectedResult": "CLI command step 9 executed successfully."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Delete the manual snapshot",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-snapshot --region eu-west-2 --db-snapshot-identifier saa-rds-task4-snapshot"
          }
        ],
        "note": "Expected: the manual snapshot is deleted.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "Expected: the manual snapshot is deleted."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Manual snapshot",
        "body": "A manual RDS snapshot stays until you delete it."
      },
      {
        "id": "cs-2",
        "title": "Restore behavior",
        "body": "Restoring a snapshot creates a new DB instance."
      },
      {
        "id": "cs-3",
        "title": "No overwrite",
        "body": "RDS snapshot restore does not overwrite the existing DB instance."
      },
      {
        "id": "cs-4",
        "title": "Whole instance",
        "body": "An RDS DB snapshot backs up the DB instance storage."
      },
      {
        "id": "cs-5",
        "title": "New endpoint",
        "body": "A restored DB instance has its own endpoint."
      },
      {
        "id": "cs-6",
        "title": "Teardown order",
        "body": "Delete restored DB, delete source DB, then delete the manual snapshot."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Snapshot is not available",
        "body": "Wait longer. RDS snapshot creation can take time."
      },
      {
        "id": "ts-2",
        "title": "Restore button is greyed out",
        "body": "Check that you selected a DB snapshot, not an automated backup view."
      },
      {
        "id": "ts-3",
        "title": "DB creation fails",
        "body": "Check the DB instance class, Region, quota, and password rules."
      },
      {
        "id": "ts-4",
        "title": "Delete fails",
        "body": "Check whether deletion protection is enabled. Turn it off before deleting."
      },
      {
        "id": "ts-5",
        "title": "CLI access denied",
        "body": "Your IAM user or role needs RDS permissions for create, describe, snapshot, restore, and delete actions."
      },
      {
        "id": "ts-6",
        "title": "Costs still appear",
        "body": "Check RDS databases, snapshots, and automated backups in the same Region."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Restore target",
        "body": "RDS restores a snapshot to a new DB instance, not over the same DB instance."
      },
      {
        "id": "trap-2",
        "title": "Manual snapshot lifetime",
        "body": "Manual snapshots are not deleted automatically when the DB is deleted."
      },
      {
        "id": "trap-3",
        "title": "Endpoint change",
        "body": "A restored DB has a different endpoint unless you update DNS or the app config."
      },
      {
        "id": "trap-4",
        "title": "Point-in-time recovery",
        "body": "Manual snapshots are fixed restore points. Automated backups support point-in-time recovery."
      },
      {
        "id": "trap-5",
        "title": "Multi-AZ confusion",
        "body": "Multi-AZ is high availability. Snapshots are backup and restore."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "Snapshot makes a new copy. RDS restore creates a new DB, not a rewind button on the old DB.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-rds-enable-rds-encryption-with-kms-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-rds",
    "title": "Enable RDS Encryption with KMS",
    "slug": "enable-rds-encryption-with-kms",
    "service": "Amazon RDS",
    "feature": "Amazon RDS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Launch a secure Amazon RDS DB instance with storage encryption enabled using a managed AWS KMS key.",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Encryption at Rest",
        "body": "RDS storage encryption protects your data, backups, read replicas, and snapshots from unauthorized physical storage access. It uses AES-256 validation mechanisms."
      },
      {
        "id": "concept-2",
        "title": "AWS KMS (Key Management Service)",
        "body": "KMS handles the creation, rotation, and lifecycle management of cryptographic keys. RDS integrates directly with KMS to encrypt storage volumes securely."
      }
    ],
    "whyItMatters": "Data security and corporate compliance mandates routinely demand encryption at rest. Knowing how and when to enable KMS handles a core piece of data security engineering on the AWS exams.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "DB Identifier",
        "value": "saa-db-task5-encrypted-instance"
      },
      {
        "label": "KMS Master Key",
        "value": "aws/rds (Default AWS Managed Key)"
      },
      {
        "label": "IAM permissions needed",
        "value": "rds:CreateDBInstance, rds:DeleteDBInstance, rds:DescribeDBInstances, kms:CreateGrant, kms:DescribeKey"
      }
    ],
    "costWarning": "Database instance, storage, backup, I/O, data-transfer and related service charges may apply. Check current regional pricing and complete cleanup promptly.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console with an administrator user or lab administrator role."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "In a real company, use least privilege permissions only."
          },
          {
            "id": "console-step-1-item-4",
            "text": "Confirm the identity has the permissions listed in the chosen example values section."
          }
        ],
        "note": null,
        "warning": "Do not use your root user for normal labs. Use an IAM user, IAM role, or IAM Identity Center permission set.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Navigate to Amazon RDS",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "In the top search engine bar, search for RDS."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Select RDS from the services list to open the dashboard interface."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Initiate Database Creation",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Click the Create database button."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose the Standard create configuration method."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Under Engine options, choose MySQL or PostgreSQL."
          },
          {
            "id": "console-step-3-item-4",
            "text": "In Templates, select Free Tier to minimize operational billing."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure Storage and KMS Encryption",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Under Settings, set the DB instance identifier to saa-db-task5-encrypted-instance."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Scroll down directly to the Storage section."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Ensure the checkbox labeled Enable encryption is explicitly checked."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Under AWS KMS key, select the default managed key alias: aws/rds."
          }
        ],
        "note": null,
        "warning": "You can only enable RDS storage encryption during instance creation. You cannot encrypt an unencrypted database instance after it is built.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Finalize DB Deployment",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Configure basic login credentials under Settings."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Scroll down to the bottom of the wizard page and click Create database."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean Up Console Resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select your newly provisioned database from the RDS inventory page."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Click Actions and choose Delete."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Uncheck the option to create a final snapshot, confirm the deletion action prompt text, and click Delete."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check the AWS CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and the IAM user or role being used for this lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and the IAM user or role being used for this lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Deploy Encrypted RDS Instance via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-instance --db-instance-identifier saa-db-task5-encrypted-instance --db-instance-class db.t3.micro --engine mysql --allocated-storage 20 --master-username dbadmin --master-user-password SuperSecurePassword123 --storage-encrypted --region eu-west-2"
          }
        ],
        "note": "The '--storage-encrypted' switch tells RDS to implement default AWS KMS volume encryption automatically.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Verify Encryption Status via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-instances --db-instance-identifier saa-db-task5-encrypted-instance --query \"DBInstances[*].[DBInstanceIdentifier,StorageEncrypted,KmsKeyId]\" --region eu-west-2"
          }
        ],
        "note": "Expected output: Returns a row structure listing your database name alongside a value of 'true' for its encryption property.",
        "warning": null,
        "expectedResult": "Expected output: Returns a row structure listing your database name alongside a value of 'true' for its encryption property."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Clean Up CLI Resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-instance --db-instance-identifier saa-db-task5-encrypted-instance --skip-final-snapshot --region eu-west-2"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 4 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Encryption Modification Impossibility",
        "body": "You cannot toggle an existing active RDS database from unencrypted to encrypted. You must create a new encrypted database instance or copy an unencrypted snapshot into an encrypted state."
      },
      {
        "id": "cs-2",
        "title": "Performance Impact",
        "body": "RDS storage hardware handles cryptographic resource overhead smoothly, minimizing latency metrics on standard application configurations."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "KMS Key Access Issues",
        "body": "Cause: Your target identity doesn't have use privileges on the selected KMS wrapper key. Fix: Use the built-in default aws/rds workspace managed key to instantly clear key policy permissions issues."
      },
      {
        "id": "ts-2",
        "title": "Instance Class Dynamic Limits",
        "body": "Cause: Very ancient AWS burstable generation classes don't support modern cryptographic operations. Fix: Switch to modern, standard db.t3.micro or newer types to confirm immediate engine provisioning."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Encrypting an Active Unencrypted Database",
        "body": "The exam will ask how to encrypt a production database running without encryption. You *cannot* just click modify. The correct architecture path is: Snapshot the instance -> Copy the snapshot with encryption turned ON -> Restore a new DB from that new encrypted snapshot."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "Encrypt at birth, or copy a snapshot later. RDS encryption requires foresight; you can't inject encryption straight into an active volume layer.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-rds-compare-rds-backup-snapshot-and-pitr-006",
    "examCode": "aws-saa-c03",
    "topicId": "topic-rds",
    "title": "Compare RDS Backup, Snapshot, and PITR",
    "slug": "compare-rds-backup-snapshot-and-pitr",
    "service": "Amazon RDS",
    "feature": "Amazon RDS",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Configure automated backups, take a manual snapshot, and explore Point-in-Time Recovery (PITR) mechanisms to understand RDS data protection.",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Automated Backups & PITR",
        "body": "RDS uploads daily storage volume backups and continuously archives transaction logs (write-ahead logs) to S3. This combo enables Point-in-Time Recovery (PITR) down to a specific second."
      },
      {
        "id": "concept-2",
        "title": "Manual DB Snapshots",
        "body": "User-initiated storage volume backups that are retained indefinitely, even after you delete the parent RDS database instance. They never expire automatically."
      }
    ],
    "whyItMatters": "Architecting for disaster recovery requires knowing the trade-offs between automated retention vs. manual persistence. The exam heavily tests RPO/RTO scenarios using these three features.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Existing DB Identifier",
        "value": "saa-db-task5-encrypted-instance"
      },
      {
        "label": "Manual Snapshot Name",
        "value": "saa-db-task6-manual-snap"
      },
      {
        "label": "IAM permissions needed",
        "value": "rds:ModifyDBInstance, rds:CreateDBSnapshot, rds:DescribeDBSnapshots, rds:RestoreDBInstanceToPointInTime, rds:DeleteDBSnapshot"
      }
    ],
    "costWarning": "Database instance, storage, backup, I/O, data-transfer and related service charges may apply. Check current regional pricing and complete cleanup promptly.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console with an administrator user or lab administrator role."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "In a real company, use least privilege permissions only."
          },
          {
            "id": "console-step-1-item-4",
            "text": "Confirm the identity has the permissions listed in the chosen example values section."
          }
        ],
        "note": null,
        "warning": "Do not use your root user for normal labs. Use an IAM user, IAM role, or IAM Identity Center permission set.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Verify Automated Backup Configuration",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the RDS Console and click Databases on the left navigation panel."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Click your existing database instance (e.g., saa-db-task5-encrypted-instance)."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Select the Maintenance & backups tab."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Under the Backups section, verify that the Backup retention period is set to 1 day or greater."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Note the Latest restorable time timestamp; this represents your closest operational threshold for PITR."
          }
        ],
        "note": "Automated backups must be enabled (retention period > 0) to allow Point-in-Time Recovery.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Take a Manual Snapshot",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "With your database instance still highlighted, click the top Actions menu button."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select Take snapshot from the context dropdown menu."
          },
          {
            "id": "console-step-3-item-3",
            "text": "In the Snapshot identifier text field, input saa-db-task6-manual-snap."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Click the Take snapshot submission button and wait for its status to change from 'Creating' to 'Available'."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Explore Point-in-Time Recovery Options",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Return to the primary Databases inventory sub-menu."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select your active target instance, click Actions, and pick Restore to point in time."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Observe the configuration wizard: notice you can select either the Latest restorable time or pick a custom Specific time."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Exit this setup screen by clicking Cancel without executing a new deployment spin-up."
          }
        ],
        "note": null,
        "warning": "Both Snapshot restoration and PITR do *not* overwrite your running database. They always deploy a brand new, separate DB instance with a fresh endpoint.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Clean Up Console Assets",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Navigate to Snapshots under the left sidebar menu."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select the radio checkbox for your manual snapshot saa-db-task6-manual-snap."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Click Actions, choose Delete snapshot, and confirm the pop-up warning sequence."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check the AWS CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and the IAM user or role being used for this lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and the IAM user or role being used for this lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create an RDS Snapshot via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-snapshot --db-instance-identifier saa-db-task5-encrypted-instance --db-snapshot-identifier saa-db-task6-manual-snap --region eu-west-2"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Verify Manual Snapshot Visibility",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-snapshots --db-snapshot-identifier saa-db-task6-manual-snap --region eu-west-2 --query \"DBSnapshots[*].[DBSnapshotIdentifier,Status,SnapshotType]\""
          }
        ],
        "note": "Expected output: Lists the snapshot name verifying its status along with a type of 'manual'.",
        "warning": null,
        "expectedResult": "Expected output: Lists the snapshot name verifying its status along with a type of 'manual'."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "View PITR Capability Parameters",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-instances --db-instance-identifier saa-db-task5-encrypted-instance --region eu-west-2 --query \"DBInstances[*].[LatestRestorableTime]\""
          }
        ],
        "note": "Expected output: A timestamp indicating the absolute most recent transaction log state synced to S3.",
        "warning": null,
        "expectedResult": "Expected output: A timestamp indicating the absolute most recent transaction log state synced to S3."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Clean Up Snapshot via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-snapshot --db-snapshot-identifier saa-db-task6-manual-snap --region eu-west-2"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Automated Backup Lifecycle",
        "body": "Automated backups delete automatically when you delete the parent RDS instance. Retention spans from 1 to 35 days. Setting retention to 0 completely disables automated backups and purges PITR history logs."
      },
      {
        "id": "cs-2",
        "title": "Manual Snapshot Longevity",
        "body": "Manual snapshots survive database deletion entirely. They remain on AWS storage until you manually log in and delete them."
      },
      {
        "id": "cs-3",
        "title": "Point-in-Time Recovery Mechanics",
        "body": "PITR references your daily automated backup image + incremental transaction logs to reconstruct an identical instance clone at any given target second within your retention bracket."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Missing Restore Options",
        "body": "Cause: Automated backup tracking was disabled (retention period set to 0). Fix: Modify your database properties, change backup retention settings to at least 1 day, and wait for a new backup routine to initialize."
      },
      {
        "id": "ts-2",
        "title": "Snapshot Status Blocked",
        "body": "Cause: Attempting to create a snapshot while the parent DB is undergoing hardware modifications or heavy software upgrades. Fix: Wait until the core RDS resource state shifts back to 'Available' before initiating a backup call."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "The Overwrite Trap",
        "body": "Exam questions might suggest that executing PITR or restoring an RDS snapshot overwrites the existing live production database. This is false. Restoring *always* spins up a completely separate database with a new endpoint string."
      },
      {
        "id": "trap-2",
        "title": "Instance Deletion Backup Purge",
        "body": "Be careful: if a question states an instance was terminated and asks how to recover data from an *automated* backup, you can't—unless you specifically checked the box to retain automated backups during deletion. Manual snapshots are the only ones preserved by default."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "Automated dies with the instance; Manual lives on. Automated backups match the DB instance's lifespan. Manual snapshots stay until *you* say goodbye.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-rds-choose-the-best-database-for-exam-scenarios-025",
    "examCode": "aws-saa-c03",
    "topicId": "topic-rds",
    "title": "Choose the Best Database for Exam Scenarios",
    "slug": "choose-the-best-database-for-exam-scenarios",
    "service": "Amazon RDS",
    "feature": "Amazon RDS",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "us-east-1",
    "goal": "Goal: Final master cheat sheet mapping AWS Purpose-Built Databases: DynamoDB (NoSQL), Aurora/RDS (SQL), Redshift (OLAP), ElastiCache/DAX (In-Memory), Neptune (Graph), Timestream (Time-Series), QLDB (Ledger).",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS Purpose-Built Database Strategy",
        "body": "AWS provides specialized database engines tailored for specific data models and workload characteristics instead of forcing all workloads into a single relational database."
      },
      {
        "id": "concept-2",
        "title": "Key-Value & Document: DynamoDB / DAX",
        "body": "Single-digit millisecond latency at scale. DAX adds microsecond in-memory caching for DynamoDB."
      },
      {
        "id": "concept-3",
        "title": "Relational SQL: Amazon Aurora & RDS",
        "body": "ACID compliance, complex JOINs, multi-table queries, Multi-AZ failover, Read Replicas."
      },
      {
        "id": "concept-4",
        "title": "Data Warehouse: Amazon Redshift",
        "body": "Petabyte OLAP analytics, columnar storage, MPP SQL queries, COPY from S3."
      },
      {
        "id": "concept-5",
        "title": "Specialized Engines: Neptune, Timestream, QLDB",
        "body": "Neptune: Graph relationships (social networks, fraud detection). Timestream: Time-series IoT metrics. QLDB: Immutable ledger with cryptographically verifiable audit log."
      },
      {
        "id": "concept-6",
        "title": "AWS Purpose-Built Databases Master Decision Matrix",
        "body": "AWS Database ServiceData Model / ParadigmPrimary Exam Scenario KeywordsAmazon DynamoDBKey-Value & Document NoSQLSingle-digit ms latency, serverless scaling, JSON schema, Global TablesDynamoDB Accelerator (DAX)In-Memory Cache for DynamoDBMicrosecond read latency for DynamoDB, read-heavy burst cachingAmazon Aurora / RDSRelational SQLACID transactions, complex SQL JOINs, Multi-AZ, Read ReplicasAmazon RedshiftOLAP Data WarehousePetabyte analytics, columnar storage, MPP, COPY from S3, BI reportingAmazon ElastiCacheIn-Memory Cache (Redis / Memcached)Sub-millisecond latency, offload RDS read pressure, Redis leaderboardsAmazon NeptuneGraph DatabaseHighly connected data, social graphs, recommendation engines, fraud networksAmazon TimestreamTime-Series DatabaseIoT sensor metrics, application telemetry, time-stamped sequence dataAmazon QLDBLedger DatabaseCryptographically verifiable, immutable transaction log, central trust authority"
      }
    ],
    "whyItMatters": "This matters because rapid keyword association for purpose-built database questions is essential to scoring high on the SAA-C03 exam.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "DynamoDB / DAX",
        "value": "Key-Value / Microsecond Cache"
      },
      {
        "label": "RDS / Aurora",
        "value": "Relational SQL (ACID & JOINs)"
      },
      {
        "label": "Redshift",
        "value": "Petabyte OLAP Columnar Warehouse"
      },
      {
        "label": "Specialized",
        "value": "Neptune (Graph), Timestream (IoT), QLDB (Ledger)"
      }
    ],
    "costWarning": "Database instance, storage, backup, I/O, data-transfer and related service charges may apply. Check current regional pricing and complete cleanup promptly.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Review Purpose-Built Database Selection Framework",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Review AWS purpose-built database selection methodology."
          }
        ],
        "note": "Read-only evaluation.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Identify Core Database Engines (NoSQL, SQL, OLAP, In-Memory)",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Select Amazon DynamoDB (or DAX) for single-digit ms key-value NoSQL."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Select Amazon Aurora / RDS for relational SQL ACID transactions and JOINs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Select Amazon Redshift for petabyte OLAP complex SQL data warehousing."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Select Amazon ElastiCache for sub-millisecond in-memory caching."
          }
        ],
        "note": "Matches core application workloads.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Identify Specialized Database Engines (Graph, Time-Series, Ledger)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select Amazon Neptune for social graphs, fraud networks, and relationship mapping."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select Amazon Timestream for IoT sensor metrics and time-series telemetry."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select Amazon QLDB for cryptographically verifiable immutable audit ledgers."
          }
        ],
        "note": "Matches specialized data model requirements.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review SAA-C03 Rapid Keyword Association Rules",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Master keyword association rules for rapid exam answer selection."
          }
        ],
        "note": "Guarantees 100% precision on database questions.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your AWS identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: account ID and IAM user/role ARN.",
        "warning": null,
        "expectedResult": "Expected: account ID and IAM user/role ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Describe Purpose-Built Database Services",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws neptune describe-db-clusters --region us-east-1"
          }
        ],
        "note": "Lists active Neptune graph database clusters.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Key-Value / Document",
        "body": "DynamoDB (NoSQL) | DAX (In-memory cache for DynamoDB)"
      },
      {
        "id": "cs-2",
        "title": "Relational & Warehouse",
        "body": "Aurora / RDS (Relational SQL OLTP) | Redshift (Petabyte OLAP Data Warehouse)"
      },
      {
        "id": "cs-3",
        "title": "Graph / IoT / Ledger",
        "body": "Neptune (Graph) | Timestream (Time-Series IoT) | QLDB (Immutable Ledger)"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Mismatched Database Selection",
        "body": "Always align database choices with data structure: Graph -> Neptune; Time-Series -> Timestream; Ledger -> QLDB."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Purpose-Built Keyword Traps",
        "body": "If an exam question mentions social graph relationships, choose Neptune. If it mentions cryptographically verifiable immutable transactions, choose QLDB."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "Neptune = Graph | Timestream = Time IoT | QLDB = Immutable Ledger",
    "flashcardSetId": null
  }
];
