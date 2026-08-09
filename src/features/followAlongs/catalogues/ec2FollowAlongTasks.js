/**
 * Amazon EC2 Follow Along Tasks & Guided AWS Labs (SAA-C03)
 * Total Converted Tasks: 25
 */

export const EC2_TASKS = [
  {
    "id": "task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Launch an EC2 instance using the AWS Console",
    "slug": "launch-an-ec2-instance-using-the-aws-console",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Launch a small Amazon Linux EC2 instance from the AWS Console and verify it reaches the running state.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "EC2 instance",
        "body": "An EC2 instance is a virtual server in AWS."
      },
      {
        "id": "concept-2",
        "title": "AMI",
        "body": "An AMI is the image used to boot the instance."
      },
      {
        "id": "concept-3",
        "title": "Security group",
        "body": "A security group is a virtual firewall for the instance."
      }
    ],
    "whyItMatters": "EC2 is one of the main compute services in AWS. This lab teaches the basic launch choices you see in many exam questions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task1-console"
      },
      {
        "label": "Key pair",
        "value": "saa-ec2-task1-key"
      },
      {
        "label": "Security group",
        "value": "saa-ec2-task1-sg"
      },
      {
        "label": "Required permissions summary",
        "value": "Launch one EC2 instance, create a key pair, create a security group, verify status, and clean up the instance, key pair, and security group."
      }
    ],
    "costWarning": "This lab can create small EC2 charges while the instance is running. Terminate the instance when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeImages, ec2:DescribeInstances, ec2:DescribeInstanceStatus, ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 launch: ec2:RunInstances, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Key pair: ec2:CreateKeyPair, ec2:DescribeKeyPairs, ec2:DeleteKeyPair"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Security group: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Cleanup: ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-11",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the EC2 launch wizard",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Search for and open EC2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Make sure the Region is eu-west-2."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Launch instances."
          }
        ],
        "note": "This lab uses one small Amazon Linux instance.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Choose the instance basics",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "For Name, enter saa-ec2-task1-console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "For Application and OS Images, choose Amazon Linux."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose the free-tier style small instance type if available, such as t3.micro or t2.micro."
          }
        ],
        "note": null,
        "warning": "Do not choose a large instance type for a learning lab.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create or choose a key pair",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Under Key pair, choose Create new key pair."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Use the name saa-ec2-task1-key."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose .pem for Linux SSH."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Download the key file and keep it safe."
          }
        ],
        "note": "You need the private key to connect with SSH later.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Configure network settings",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Use the default VPC."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Use any default public subnet."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Turn on Auto-assign public IP if shown."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Create a new security group named saa-ec2-task1-sg."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Allow SSH from My IP only."
          }
        ],
        "note": null,
        "warning": "Do not allow SSH from 0.0.0.0/0 in a real account.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Launch and verify the instance",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Keep the default root volume."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Launch instance."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open Instances."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Wait until Instance state is Running."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Wait until Status checks show checks passed."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in the Console",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Select the instance saa-ec2-task1-console."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose Instance state, then Terminate instance."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Wait until the instance is terminated."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Open Key Pairs and delete saa-ec2-task1-key."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Open Security Groups and delete saa-ec2-task1-sg."
          }
        ],
        "note": "Delete the security group after the instance is terminated.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
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
        "title": "Check for running lab instances",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instances --region eu-west-2 --filters \"Name=tag:Name,Values=saa-ec2-task1-console\" \"Name=instance-state-name,Values=pending,running,stopping,stopped\" --query \"Reservations[].Instances[].{InstanceId:InstanceId,State:State.Name,PublicIp:PublicIpAddress}\" --output table"
          }
        ],
        "note": "Expected: no running lab instance unless you already launched it.",
        "warning": null,
        "expectedResult": "Expected: no running lab instance unless you already launched it."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Clean up from the CLI if needed",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=$(aws ec2 describe-instances --region eu-west-2 --filters \"Name=tag:Name,Values=saa-ec2-task1-console\" \"Name=instance-state-name,Values=pending,running,stopping,stopped\" --query \"Reservations[0].Instances[0].InstanceId\" --output text)"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region eu-west-2 --instance-ids \"$INSTANCE_ID\""
          }
        ],
        "note": "Only run this if the Console-created instance still exists.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 3 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "EC2 launch",
        "body": "Choose AMI, instance type, network, security group, storage, then launch."
      },
      {
        "id": "cs-2",
        "title": "Security group",
        "body": "Inbound SSH should be limited to your IP."
      },
      {
        "id": "cs-3",
        "title": "Teardown",
        "body": "Terminate the instance before deleting its security group."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Open SSH rule",
        "body": "Allowing SSH from anywhere is easy, but it is not safe. Use My IP for labs."
      },
      {
        "id": "ts-2",
        "title": "Instance running is not fully ready",
        "body": "An instance can be running before status checks pass. Wait for both checks."
      },
      {
        "id": "ts-3",
        "title": "Wrong Region",
        "body": "EC2 resources are Regional. Check eu-west-2 before troubleshooting."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Public IP missing",
        "body": "The instance may not be reachable from the internet. Check public subnet and auto-assign public IP."
      },
      {
        "id": "trap-2",
        "title": "Key file lost",
        "body": "You cannot download the same private key again. Create a new key pair if needed."
      },
      {
        "id": "trap-3",
        "title": "Security group delete fails",
        "body": "Wait until the instance is terminated, then delete the security group."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "AMI + type + network + security group = EC2 launch. These are the core launch choices.",
    "flashcardSetId": "ec2_task_1_flashcards"
  },
  {
    "id": "task-saa-ec2-launch-an-ec2-instance-using-the-aws-cli-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Launch an EC2 instance using the AWS CLI",
    "slug": "launch-an-ec2-instance-using-the-aws-cli",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Use AWS CLI commands to launch a small EC2 instance and verify it from the CLI.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS CLI",
        "body": "The AWS CLI lets you create AWS resources by command line."
      },
      {
        "id": "concept-2",
        "title": "run-instances",
        "body": "run-instances is the EC2 API action used to launch instances."
      },
      {
        "id": "concept-3",
        "title": "Default VPC",
        "body": "This lab uses the default VPC to keep setup simple."
      }
    ],
    "whyItMatters": "The exam expects you to understand both Console choices and the API/CLI actions behind them.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task2-cli"
      },
      {
        "label": "Security group",
        "value": "saa-ec2-task2-sg"
      },
      {
        "label": "Required permissions summary",
        "value": "Read EC2 defaults, read the Amazon Linux AMI public parameter, launch one EC2 instance by CLI, create a security group, verify the instance, and clean up."
      }
    ],
    "costWarning": "This lab can create EC2 charges while the instance is running. Terminate the instance when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "SSM public parameter read: ssm:GetParameter"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-8",
            "text": "EC2 read: ec2:DescribeImages, ec2:DescribeInstances, ec2:DescribeInstanceStatus, ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups"
          },
          {
            "id": "console-step-1-item-9",
            "text": "EC2 launch: ec2:RunInstances, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Security group: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup"
          },
          {
            "id": "console-step-1-item-11",
            "text": "Cleanup: ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-12",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Understand what the CLI will create",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "This lab uses the AWS CLI instead of the launch wizard."
          },
          {
            "id": "console-step-2-item-2",
            "text": "The CLI will find the latest Amazon Linux 2023 AMI from SSM public parameters."
          },
          {
            "id": "console-step-2-item-3",
            "text": "The CLI will launch one small EC2 instance in the default VPC."
          },
          {
            "id": "console-step-2-item-4",
            "text": "The CLI will tag the instance saa-ec2-task2-cli."
          }
        ],
        "note": "The Console is used only to understand and verify the result.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Verify in the Console after the CLI launch",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Find saa-ec2-task2-cli."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Confirm the instance state is Running."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Tear down in the Console if needed",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select saa-ec2-task2-cli."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Instance state, then Terminate instance."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Open Security Groups."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Delete saa-ec2-task2-sg after the instance is terminated."
          }
        ],
        "note": null,
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
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "NAME=saa-ec2-task2-cli"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "AMI_ID=$(aws ssm get-parameter --region $REGION --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query Parameter.Value --output text)"
          }
        ],
        "note": "The AMI command avoids using an old hard-coded AMI ID.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Find the default VPC and subnet",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=isDefault,Values=true --query \"Vpcs[0].VpcId\" --output text)"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query \"Subnets[0].SubnetId\" --output text)"
          }
        ],
        "note": "This keeps the lab beginner-safe by using the default VPC.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name saa-ec2-task2-sg --description \"EC2 task 2 lab security group\" --vpc-id $VPC_ID --query GroupId --output text)"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws ec2 create-tags --region $REGION --resources $SG_ID --tags Key=Name,Value=saa-ec2-task2-sg"
          }
        ],
        "note": "No inbound rule is added because this task only launches the instance.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Launch the EC2 instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=$(aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --security-group-ids $SG_ID --tag-specifications \"ResourceType=instance,Tags=[{Key=Name,Value=$NAME}]\" --query \"Instances[0].InstanceId\" --output text)"
          }
        ],
        "note": "If t3.micro is unavailable in your account, use t2.micro.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify the instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instances --region $REGION --instance-ids $INSTANCE_ID --query \"Reservations[0].Instances[0].{InstanceId:InstanceId,State:State.Name,Type:InstanceType,AZ:Placement.AvailabilityZone}\" --output table"
          }
        ],
        "note": "Expected: the state becomes pending, then running.",
        "warning": null,
        "expectedResult": "Expected: the state becomes pending, then running."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "aws ec2 delete-security-group --region $REGION --group-id $SG_ID"
          }
        ],
        "note": "Terminate the instance before deleting the security group.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "run-instances",
        "body": "This CLI command launches EC2 instances."
      },
      {
        "id": "cs-2",
        "title": "Tags",
        "body": "Tags make lab resources easier to find and delete."
      },
      {
        "id": "cs-3",
        "title": "Default VPC",
        "body": "Good for beginner labs, but not always best for production."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No default VPC",
        "body": "Some accounts have no default VPC. Create a VPC or choose an existing subnet."
      },
      {
        "id": "ts-2",
        "title": "UnauthorizedOperation",
        "body": "The CLI identity is missing one of the EC2 permissions from step 0."
      },
      {
        "id": "ts-3",
        "title": "InvalidAMIID.NotFound",
        "body": "Use the SSM public parameter shown in the lab instead of a fixed old AMI ID."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "CLI still needs IAM",
        "body": "The CLI is not special. It only works if the identity has the right permissions."
      },
      {
        "id": "trap-2",
        "title": "Instance type unavailable",
        "body": "Some accounts or AZs may not support the chosen type. Try t2.micro."
      },
      {
        "id": "trap-3",
        "title": "Security group dependency",
        "body": "You cannot delete a security group while an instance is still using it."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "CLI launch = same EC2 choices, written as commands. AMI, type, subnet, and security group still matter.",
    "flashcardSetId": "ec2_task_2_flashcards"
  },
  {
    "id": "task-saa-ec2-connect-to-an-ec2-instance-using-ssh-or-rdp-003",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Connect to an EC2 instance using SSH or RDP",
    "slug": "connect-to-an-ec2-instance-using-ssh-or-rdp",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Connect to a Linux EC2 instance with SSH or EC2 Instance Connect, or connect to a Windows instance with RDP.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "SSH",
        "body": "SSH is commonly used to connect to Linux instances."
      },
      {
        "id": "concept-2",
        "title": "RDP",
        "body": "RDP is commonly used to connect to Windows instances."
      },
      {
        "id": "concept-3",
        "title": "Security group access",
        "body": "The instance security group must allow the connection port from your IP."
      }
    ],
    "whyItMatters": "Connecting safely is a core operations skill. The exam often tests public IPs, ports, key pairs, and security groups.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Linux username",
        "value": "ec2-user for Amazon Linux"
      },
      {
        "label": "Linux port",
        "value": "22 for SSH"
      },
      {
        "label": "Windows port",
        "value": "3389 for RDP"
      },
      {
        "label": "Required permissions summary",
        "value": "Read EC2 instance details, allow temporary SSH or RDP access if needed, use EC2 Instance Connect for Linux, and remove temporary access rules."
      }
    ],
    "costWarning": "Connecting itself has no extra charge, but the EC2 instance can cost money while running. Stop or terminate lab instances when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 read: ec2:DescribeInstances, ec2:DescribeInstanceStatus, ec2:DescribeSecurityGroups"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Linux connect: ec2-instance-connect:SendSSHPublicKey if using EC2 Instance Connect"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Security group update: ec2:AuthorizeSecurityGroupIngress, ec2:RevokeSecurityGroupIngress"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Optional Windows RDP: ec2:GetPasswordData if decrypting a Windows administrator password"
          },
          {
            "id": "console-step-1-item-11",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Find or launch a test instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use a running Amazon Linux instance from Task 1 or Task 2."
          },
          {
            "id": "console-step-2-item-4",
            "text": "If you need to launch one, use the name saa-ec2-task3-connect."
          }
        ],
        "note": "This lab focuses on connecting, not launching.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Check network access",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select the instance."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Check that it has a Public IPv4 address."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Open its security group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For Linux SSH, allow inbound SSH on port 22 from My IP."
          },
          {
            "id": "console-step-3-item-5",
            "text": "For Windows RDP, allow inbound RDP on port 3389 from My IP."
          }
        ],
        "note": null,
        "warning": "Do not allow SSH or RDP from everywhere in a real account.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Connect to Linux using EC2 Instance Connect",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the Linux instance."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Connect."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose EC2 Instance Connect."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Connect."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Confirm a browser terminal opens."
          }
        ],
        "note": "Amazon Linux normally supports EC2 Instance Connect.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Connect to Linux using SSH",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Choose Connect."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Open the SSH client tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Copy the SSH command shown by AWS."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Run it from your computer where the private key file is stored."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Confirm the Linux prompt opens."
          }
        ],
        "note": "On Linux or macOS, the key usually needs chmod 400 key.pem.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Connect to Windows using RDP if using Windows",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select the Windows instance."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Connect."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose the RDP client tab."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Get password."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Upload the private key and decrypt the password."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Open the downloaded RDP file and sign in."
          }
        ],
        "note": null,
        "warning": "Only do the Windows path if you launched a Windows AMI.",
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down or close access",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Close the SSH or RDP session."
          },
          {
            "id": "console-step-7-item-2",
            "text": "If the instance was only for this lab, terminate it."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Remove temporary SSH or RDP inbound rules if you added them."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the key pair only after you no longer need it."
          }
        ],
        "note": "Remove remote access rules when testing is finished.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
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
        "title": "Find the instance public IP",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instances --region eu-west-2 --filters \"Name=instance-state-name,Values=running\" --query \"Reservations[].Instances[].{Name:Tags[?Key=='Name']|[0].Value,InstanceId:InstanceId,PublicIp:PublicIpAddress,State:State.Name}\" --output table"
          }
        ],
        "note": "Use the public IP for SSH or RDP if connecting over the internet.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "SSH to Linux from your computer",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "ssh -i saa-ec2-task1-key.pem ec2-user@PUBLIC-IP-ADDRESS"
          }
        ],
        "note": "Replace PUBLIC-IP-ADDRESS with the instance public IPv4 address.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Fix Linux key permissions if needed",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "chmod 400 saa-ec2-task1-key.pem"
          }
        ],
        "note": "Run this on Linux, macOS, or WSL if SSH says the key is too open.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Remove temporary SSH rule if added by CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 revoke-security-group-ingress --region eu-west-2 --group-id sg-EXAMPLE --protocol tcp --port 22 --cidr YOUR-IP/32"
          }
        ],
        "note": "Replace the security group ID and CIDR before running.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Linux connection",
        "body": "Use SSH or EC2 Instance Connect."
      },
      {
        "id": "cs-2",
        "title": "Windows connection",
        "body": "Use RDP and the decrypted administrator password."
      },
      {
        "id": "cs-3",
        "title": "Network rule",
        "body": "SSH uses port 22. RDP uses port 3389."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Connection timed out",
        "body": "Check public IP, route to internet, subnet type, NACLs, and security group inbound rules."
      },
      {
        "id": "ts-2",
        "title": "Permission denied publickey",
        "body": "Check username, private key, and key file permissions."
      },
      {
        "id": "ts-3",
        "title": "RDP does not open",
        "body": "Check Windows instance status, port 3389, and public IP."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Security group is stateful",
        "body": "Return traffic is allowed automatically by the security group."
      },
      {
        "id": "trap-2",
        "title": "Public subnet needed",
        "body": "A public IP alone is not enough. The route table must have internet access."
      },
      {
        "id": "trap-3",
        "title": "Wrong username",
        "body": "Amazon Linux usually uses ec2-user, not root."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "SSH is Linux. RDP is Windows. The security group opens the door.",
    "flashcardSetId": "ec2_task_3_flashcards"
  },
  {
    "id": "task-saa-ec2-create-and-attach-an-ebs-volume-to-an-ec2-instance-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Create and attach an EBS volume to an EC2 instance",
    "slug": "create-and-attach-an-ebs-volume-to-an-ec2-instance",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create a small EBS volume in the same Availability Zone as an EC2 instance, attach it, and verify it.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "EBS volume",
        "body": "An EBS volume is block storage for EC2."
      },
      {
        "id": "concept-2",
        "title": "Same AZ rule",
        "body": "An EBS volume must be in the same Availability Zone as the EC2 instance it attaches to."
      },
      {
        "id": "concept-3",
        "title": "Mounting",
        "body": "Attaching is the AWS step. Formatting and mounting is the operating system step."
      }
    ],
    "whyItMatters": "EBS is heavily tested because it affects storage, durability, snapshots, and EC2 design choices.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Volume name",
        "value": "saa-ec2-task4-ebs"
      },
      {
        "label": "Volume type",
        "value": "gp3"
      },
      {
        "label": "Volume size",
        "value": "1 GiB"
      },
      {
        "label": "Required permissions summary",
        "value": "Read EC2 details, create and tag an EBS volume, attach it to an instance, verify it, detach it, and delete it."
      }
    ],
    "costWarning": "EBS volumes can create storage charges even if the instance is stopped. Delete the lab volume after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 read: ec2:DescribeInstances, ec2:DescribeVolumes, ec2:DescribeAvailabilityZones"
          },
          {
            "id": "console-step-1-item-8",
            "text": "EBS create and attach: ec2:CreateVolume, ec2:AttachVolume, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-9",
            "text": "EBS detach and delete: ec2:DetachVolume, ec2:DeleteVolume"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Optional instance cleanup: ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-11",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Find the instance Availability Zone",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Select your running lab instance."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Copy the Availability Zone, such as eu-west-2a."
          }
        ],
        "note": "The EBS volume must be in the same Availability Zone as the instance.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a new EBS volume",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In the EC2 left menu, choose Volumes."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create volume."
          },
          {
            "id": "console-step-3-item-3",
            "text": "For Volume type, choose gp3."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For Size, enter 1 GiB."
          },
          {
            "id": "console-step-3-item-5",
            "text": "For Availability Zone, choose the same AZ as the instance."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Add the tag Name = saa-ec2-task4-ebs."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose Create volume."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Attach the EBS volume",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the new volume."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Actions, then Attach volume."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select the lab instance."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Keep the suggested device name, such as /dev/sdf."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Attach volume."
          }
        ],
        "note": "The volume shows as attached in AWS, but Linux still needs it formatted and mounted before use.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Make the volume usable on Linux",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to the Linux instance with SSH or EC2 Instance Connect."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Run lsblk to find the new disk."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Run sudo mkfs -t xfs /dev/xvdf if the disk appears as /dev/xvdf."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Run sudo mkdir /data."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Run sudo mount /dev/xvdf /data."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Run df -h to confirm the mount."
          }
        ],
        "note": null,
        "warning": "Only format the new empty lab volume. Formatting the wrong disk can destroy data.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Unmount the volume inside Linux with sudo umount /data."
          },
          {
            "id": "console-step-6-item-2",
            "text": "In the EC2 Console, open Volumes."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Select saa-ec2-task4-ebs."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Actions, then Detach volume."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Wait until the volume state is Available."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose Actions, then Delete volume."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Terminate the lab instance if it was only used for this task."
          }
        ],
        "note": "Detach before delete.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
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
        "title": "Set the instance ID",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=i-EXAMPLE"
          }
        ],
        "note": "Replace i-EXAMPLE with your lab instance ID.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Find the instance Availability Zone",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "AZ=$(aws ec2 describe-instances --region eu-west-2 --instance-ids $INSTANCE_ID --query \"Reservations[0].Instances[0].Placement.AvailabilityZone\" --output text)"
          }
        ],
        "note": "The new volume must use this same AZ.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a 1 GiB gp3 volume",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "VOLUME_ID=$(aws ec2 create-volume --region eu-west-2 --availability-zone $AZ --size 1 --volume-type gp3 --tag-specifications \"ResourceType=volume,Tags=[{Key=Name,Value=saa-ec2-task4-ebs}]\" --query VolumeId --output text)"
          }
        ],
        "note": "Expected: the command returns a volume ID.",
        "warning": null,
        "expectedResult": "Expected: the command returns a volume ID."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Attach the volume",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 wait volume-available --region eu-west-2 --volume-ids $VOLUME_ID"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "aws ec2 attach-volume --region eu-west-2 --volume-id $VOLUME_ID --instance-id $INSTANCE_ID --device /dev/sdf"
          }
        ],
        "note": "The volume is attached as a block device.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify the attachment",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-volumes --region eu-west-2 --volume-ids $VOLUME_ID --query \"Volumes[0].Attachments[0].{InstanceId:InstanceId,State:State,Device:Device}\" --output table"
          }
        ],
        "note": "Expected: attachment state is attaching or attached.",
        "warning": null,
        "expectedResult": "Expected: attachment state is attaching or attached."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 detach-volume --region eu-west-2 --volume-id $VOLUME_ID"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait volume-available --region eu-west-2 --volume-ids $VOLUME_ID"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "aws ec2 delete-volume --region eu-west-2 --volume-id $VOLUME_ID"
          }
        ],
        "note": "Detach the volume before deleting it.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "EBS is AZ-scoped",
        "body": "A volume can attach only to instances in the same AZ."
      },
      {
        "id": "cs-2",
        "title": "Attach vs mount",
        "body": "AWS attaches the disk. The OS mounts the filesystem."
      },
      {
        "id": "cs-3",
        "title": "gp3",
        "body": "gp3 is a common general-purpose SSD volume type."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "IncorrectState",
        "body": "The volume may not be available yet. Wait, then attach again."
      },
      {
        "id": "ts-2",
        "title": "AZ mismatch",
        "body": "Create the volume in the same AZ as the instance."
      },
      {
        "id": "ts-3",
        "title": "Device name confusion",
        "body": "Linux may show /dev/xvdf even if AWS used /dev/sdf."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "EBS is not Regional",
        "body": "EBS volumes are tied to one Availability Zone."
      },
      {
        "id": "trap-2",
        "title": "Deleting instance may delete root only",
        "body": "Extra EBS volumes can remain and keep charging if not deleted."
      },
      {
        "id": "trap-3",
        "title": "Formatting mistake",
        "body": "Only format the new blank lab volume, not the root volume."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "EBS follows the AZ. Same AZ to attach. Snapshot to move.",
    "flashcardSetId": "ec2_task_4_flashcards"
  },
  {
    "id": "task-saa-ec2-create-an-ami-from-an-ec2-instance-and-launch-a-new-instance-from-the-ami-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Create an AMI from an EC2 instance and launch a new instance from the AMI",
    "slug": "create-an-ami-from-an-ec2-instance-and-launch-a-new-instance-from-the-ami",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a reusable AMI from an EC2 instance, then launch a new EC2 instance from that AMI.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AMI",
        "body": "An AMI is a reusable image used to launch EC2 instances."
      },
      {
        "id": "concept-2",
        "title": "EBS snapshot behind AMI",
        "body": "For EBS-backed instances, the AMI uses snapshots of the instance volumes."
      },
      {
        "id": "concept-3",
        "title": "Deregister vs delete snapshot",
        "body": "Deregistering an AMI does not always delete the snapshot. Delete the snapshot during cleanup."
      }
    ],
    "whyItMatters": "AMIs are important for repeatable server builds, scaling, backup patterns, and migration scenarios.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "AMI name",
        "value": "saa-ec2-task5-ami"
      },
      {
        "label": "New instance name",
        "value": "saa-ec2-task5-from-ami"
      },
      {
        "label": "Required permissions summary",
        "value": "Read EC2 resources, create an AMI, launch an instance from that AMI, then terminate the instance, deregister the AMI, and delete its snapshot."
      }
    ],
    "costWarning": "AMI snapshots can create storage charges. Delete the AMI snapshot after deregistering the AMI.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 read: ec2:DescribeInstances, ec2:DescribeImages, ec2:DescribeSnapshots"
          },
          {
            "id": "console-step-1-item-8",
            "text": "AMI create: ec2:CreateImage, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Launch from AMI: ec2:RunInstances"
          },
          {
            "id": "console-step-1-item-10",
            "text": "AMI cleanup: ec2:DeregisterImage, ec2:DeleteSnapshot"
          },
          {
            "id": "console-step-1-item-11",
            "text": "Instance cleanup: ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-12",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Choose the source instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Select a running or stopped lab instance."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Confirm the instance is not production."
          }
        ],
        "note": null,
        "warning": "Do not create AMIs from real company systems in a learning lab.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create an AMI from the instance",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "With the instance selected, choose Actions."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Image and templates."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create image."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For Image name, enter saa-ec2-task5-ami."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Keep No reboot unchecked for a cleaner image."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose Create image."
          }
        ],
        "note": "AWS creates an AMI and one or more EBS snapshots behind it.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Wait for the AMI to become available",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In the EC2 left menu, choose AMIs."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Change the filter to Owned by me."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select saa-ec2-task5-ami."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Wait until the state is Available."
          }
        ],
        "note": "AMI creation can take several minutes.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Launch a new instance from the AMI",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select the AMI."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Launch instance from AMI."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Name the new instance saa-ec2-task5-from-ami."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose a small instance type such as t3.micro or t2.micro."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Use the same VPC and a safe security group."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Choose Launch instance."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Verify the new instance",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open Instances."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Find saa-ec2-task5-from-ami."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm it launches from your custom AMI."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Wait until the instance state is Running."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Terminate saa-ec2-task5-from-ami."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Wait until the new instance is terminated."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open AMIs."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Select saa-ec2-task5-ami."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Choose Actions, then Deregister AMI."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Open Snapshots."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Find the snapshot created for the AMI."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Delete the snapshot."
          },
          {
            "id": "console-step-7-item-9",
            "text": "Terminate the original lab instance if it is no longer needed."
          }
        ],
        "note": "Deregister the AMI before deleting its snapshot.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
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
        "title": "Set the source instance ID",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "SOURCE_INSTANCE_ID=i-EXAMPLE"
          }
        ],
        "note": "Replace i-EXAMPLE with your source lab instance ID.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the AMI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 create-image --region eu-west-2 --instance-id $SOURCE_INSTANCE_ID --name saa-ec2-task5-ami --description \"AMI created for EC2 task 5\" --query ImageId --output text)"
          }
        ],
        "note": "Expected: the command returns an AMI ID.",
        "warning": null,
        "expectedResult": "Expected: the command returns an AMI ID."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Wait for the AMI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 wait image-available --region eu-west-2 --image-ids $AMI_ID"
          }
        ],
        "note": "This can take several minutes.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Find a subnet and launch from the AMI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region eu-west-2 --query \"Subnets[0].SubnetId\" --output text)"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "NEW_INSTANCE_ID=$(aws ec2 run-instances --region eu-west-2 --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --tag-specifications \"ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task5-from-ami}]\" --query \"Instances[0].InstanceId\" --output text)"
          }
        ],
        "note": "If t3.micro is unavailable, use t2.micro.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify the new instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instances --region eu-west-2 --instance-ids $NEW_INSTANCE_ID --query \"Reservations[0].Instances[0].{InstanceId:InstanceId,ImageId:ImageId,State:State.Name}\" --output table"
          }
        ],
        "note": "Expected: the ImageId matches your AMI ID.",
        "warning": null,
        "expectedResult": "Expected: the ImageId matches your AMI ID."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Find the AMI snapshot",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "SNAPSHOT_ID=$(aws ec2 describe-images --region eu-west-2 --image-ids $AMI_ID --query \"Images[0].BlockDeviceMappings[0].Ebs.SnapshotId\" --output text)"
          }
        ],
        "note": "Most EBS-backed AMIs have a snapshot for the root volume.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Tear down in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region eu-west-2 --instance-ids $NEW_INSTANCE_ID"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region eu-west-2 --instance-ids $NEW_INSTANCE_ID"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "aws ec2 deregister-image --region eu-west-2 --image-id $AMI_ID"
          },
          {
            "id": "cli-step-8-cmd-4",
            "language": "bash",
            "text": "aws ec2 delete-snapshot --region eu-west-2 --snapshot-id $SNAPSHOT_ID"
          }
        ],
        "note": "Deregister the AMI before deleting the snapshot.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 8 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      },
      {
        "id": "cleanup-4",
        "text": "Delete AMI images, launch templates, or placement groups created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "CreateImage",
        "body": "Creates an AMI from an instance."
      },
      {
        "id": "cs-2",
        "title": "AMI state",
        "body": "Wait until the AMI is available before launching from it."
      },
      {
        "id": "cs-3",
        "title": "Cleanup",
        "body": "Terminate new instance, deregister AMI, then delete snapshot."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AMI stuck pending",
        "body": "Large volumes can take longer. Wait, then check snapshots."
      },
      {
        "id": "ts-2",
        "title": "Cannot delete snapshot",
        "body": "Deregister the AMI before deleting the backing snapshot."
      },
      {
        "id": "ts-3",
        "title": "Launch fails",
        "body": "Check instance type, subnet, security group, and AMI state."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "AMI is not just a snapshot",
        "body": "An AMI includes metadata and block device mapping. The snapshot stores the volume data."
      },
      {
        "id": "trap-2",
        "title": "Region scope",
        "body": "AMIs are Regional unless copied to another Region."
      },
      {
        "id": "trap-3",
        "title": "No reboot choice",
        "body": "No reboot is faster but can risk file system inconsistency."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "AMI = reusable EC2 blueprint. Create once, launch many.",
    "flashcardSetId": "ec2_task_5_flashcards"
  },
  {
    "id": "task-saa-ec2-configure-a-security-group-for-http-and-ssh-006",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Configure a security group for HTTP and SSH",
    "slug": "configure-a-security-group-for-http-and-ssh",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create an EC2 security group that allows HTTP from the internet and SSH from your IP, then test access with a small EC2 instance.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Security groups",
        "body": "Security groups are stateful firewalls attached to EC2 network interfaces."
      },
      {
        "id": "concept-2",
        "title": "HTTP rule",
        "body": "HTTP uses TCP port 80. A public test website needs this inbound rule."
      },
      {
        "id": "concept-3",
        "title": "SSH rule",
        "body": "SSH uses TCP port 22. Limit SSH to My IP for safer testing."
      }
    ],
    "whyItMatters": "Security groups are a core EC2 security control. The exams often test which ports to open and how tightly to scope them.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Security group",
        "value": "saa-ec2-task6-web-sg"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task6-web"
      },
      {
        "label": "Required permissions summary",
        "value": "Create and manage an EC2 security group, launch one test instance, create one key pair, verify access, and clean up resources."
      }
    ],
    "costWarning": "This lab can create small EC2 charges while the instance is running. Terminate the instance and delete the key pair and security group when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:DescribeImages, ec2:DescribeInstances"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 security group: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:RevokeSecurityGroupIngress, ec2:DeleteSecurityGroup"
          },
          {
            "id": "console-step-1-item-8",
            "text": "EC2 launch: ec2:RunInstances, ec2:CreateTags, ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Key pair: ec2:CreateKeyPair, ec2:DescribeKeyPairs, ec2:DeleteKeyPair"
          },
          {
            "id": "console-step-1-item-10",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open EC2 and create a security group",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "In the left menu, choose Security Groups."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Name it saa-ec2-task6-web-sg."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Use the default VPC in eu-west-2."
          }
        ],
        "note": "A security group works like a stateful firewall for EC2.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Add SSH and HTTP inbound rules",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Under Inbound rules, choose Add rule."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set type to SSH and source to My IP."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Add rule again."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set type to HTTP and source to Anywhere-IPv4."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose Create security group."
          }
        ],
        "note": null,
        "warning": "Do not leave SSH open to 0.0.0.0/0 in real accounts.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Launch a small web test instance",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In EC2, choose Instances."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name it saa-ec2-task6-web."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose t3.micro or t2.micro if shown as free tier eligible."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Create or select key pair saa-ec2-task6-key."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Under network settings, select saa-ec2-task6-web-sg."
          },
          {
            "id": "console-step-4-item-8",
            "text": "In Advanced details, paste user data that installs a basic web page."
          },
          {
            "id": "console-step-4-item-9",
            "text": "Choose Launch instance."
          }
        ],
        "note": "The HTTP rule lets your browser reach the web server on port 80.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test HTTP and SSH access",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Wait until the instance state is Running."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Copy the instance Public IPv4 address."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Open http://PUBLIC-IP in a browser."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Use your key pair to SSH to the instance if needed."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Expected: the browser loads the test page and SSH is allowed only from your IP."
          }
        ],
        "note": null,
        "warning": "The public IP can change if the instance is stopped and started.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Go to Instances."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select saa-ec2-task6-web."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Instance state, then Terminate instance."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Wait until the instance is terminated."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the security group saa-ec2-task6-web-sg."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Delete the key pair saa-ec2-task6-key if you created it only for this lab."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Delete the downloaded private key from your computer if not needed."
          }
        ],
        "note": null,
        "warning": "Terminate the instance to stop EC2 charges.",
        "expectedResult": "Step 6 completed successfully."
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
        "title": "Set variables and find the default VPC",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0].SubnetId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "MY_IP=$(curl -s https://checkip.amazonaws.com)/32"
          }
        ],
        "note": "Expected: variables are set for your default VPC and your public IP.",
        "warning": null,
        "expectedResult": "Expected: variables are set for your default VPC and your public IP."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the security group and rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name saa-ec2-task6-web-sg --description 'Task 6 HTTP and SSH security group' --vpc-id $VPC_ID --query GroupId --output text)"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 22 --cidr $MY_IP"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "aws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0"
          }
        ],
        "note": "Expected: SSH is limited to your IP and HTTP is open for the web test.",
        "warning": "Security Warning: Opening SSH (port 22) or RDP (port 3389) to 0.0.0.0/0 allows access from any IP address worldwide. In production, restrict inbound traffic to your specific public IP address (/32) or use AWS Systems Manager Session Manager.",
        "expectedResult": "Expected: SSH is limited to your IP and HTTP is open for the web test."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a key pair and launch the instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-key-pair --region $REGION --key-name saa-ec2-task6-key --query 'KeyMaterial' --output text > saa-ec2-task6-key.pem"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "chmod 400 saa-ec2-task6-key.pem"
          },
          {
            "id": "cli-step-4-cmd-3",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023.*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-4-cmd-4",
            "language": "bash",
            "text": "INSTANCE_ID=$(aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --key-name saa-ec2-task6-key --security-group-ids $SG_ID --subnet-id $SUBNET_ID --associate-public-ip-address --user-data '#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\necho EC2 Task 6 web test > /var/www/html/index.html' --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task6-web}]' --query 'Instances[0].InstanceId' --output text)"
          }
        ],
        "note": "Expected: an EC2 instance starts with a basic web page.",
        "warning": null,
        "expectedResult": "Expected: an EC2 instance starts with a basic web page."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify the instance and public URL",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "PUBLIC_IP=$(aws ec2 describe-instances --region $REGION --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "echo http://$PUBLIC_IP"
          }
        ],
        "note": "Open the printed URL in a browser.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws ec2 delete-security-group --region $REGION --group-id $SG_ID"
          },
          {
            "id": "cli-step-6-cmd-4",
            "language": "bash",
            "text": "aws ec2 delete-key-pair --region $REGION --key-name saa-ec2-task6-key"
          },
          {
            "id": "cli-step-6-cmd-5",
            "language": "bash",
            "text": "rm -f saa-ec2-task6-key.pem"
          }
        ],
        "note": "Dependency order: terminate instance first, then delete the security group and key pair.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      },
      {
        "id": "verify-6",
        "text": "Verify instance profile IAM role permissions allow expected AWS API calls."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      },
      {
        "id": "cleanup-4",
        "text": "Delete AMI images, launch templates, or placement groups created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "HTTP vs SSH",
        "body": "HTTP is for browser access. SSH is for Linux administration."
      },
      {
        "id": "cs-2",
        "title": "Stateful rule",
        "body": "Return traffic is automatically allowed by the security group."
      },
      {
        "id": "cs-3",
        "title": "Safer SSH",
        "body": "Use My IP, not 0.0.0.0/0, for SSH."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Browser does not load",
        "body": "Check the HTTP rule, instance public IP, and web server user data."
      },
      {
        "id": "ts-2",
        "title": "SSH fails",
        "body": "Check the key file, username ec2-user, security group source, and public IP."
      },
      {
        "id": "ts-3",
        "title": "Cannot delete security group",
        "body": "Terminate the instance first. A security group cannot be deleted while attached."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "SSH open to world",
        "body": "Wrong: allow SSH from anywhere. Correct: allow SSH only from your IP or use Session Manager."
      },
      {
        "id": "trap-2",
        "title": "Security groups are stateful",
        "body": "Wrong: add return inbound rules. Correct: security groups allow return traffic automatically."
      },
      {
        "id": "trap-3",
        "title": "HTTP needs port 80",
        "body": "Wrong: opening SSH also opens web access. Correct: web traffic needs HTTP or HTTPS rules."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "SSH is the door. HTTP is the shop window. Open only the door you need, to the people who need it.",
    "flashcardSetId": "ec2_task_6_flashcards"
  },
  {
    "id": "task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Set up a key pair and connect to EC2",
    "slug": "set-up-a-key-pair-and-connect-to-ec2",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create an EC2 key pair, launch a Linux instance with it, and connect using SSH.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Key pair",
        "body": "A key pair has a public key in AWS and a private key on your computer."
      },
      {
        "id": "concept-2",
        "title": "Linux SSH user",
        "body": "Amazon Linux commonly uses the username ec2-user."
      },
      {
        "id": "concept-3",
        "title": "Private key safety",
        "body": "Anyone with the private key can try to connect if network rules allow it."
      }
    ],
    "whyItMatters": "Key pairs are a basic way to prove your identity when connecting to EC2 Linux instances.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Key pair",
        "value": "saa-ec2-task7-key"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task7-linux"
      },
      {
        "label": "Required permissions summary",
        "value": "Create a key pair, create an SSH security group, launch one Linux instance, connect with SSH, and clean up resources."
      }
    ],
    "costWarning": "This lab can create small EC2 charges while the instance is running. Terminate the instance when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeImages, ec2:DescribeInstances, ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Key pair: ec2:CreateKeyPair, ec2:DescribeKeyPairs, ec2:DeleteKeyPair"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Security group: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup"
          },
          {
            "id": "console-step-1-item-9",
            "text": "EC2 instance: ec2:RunInstances, ec2:CreateTags, ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-10",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a key pair",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "In the left menu, choose Key Pairs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create key pair."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-ec2-task7-key."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose RSA and .pem for Linux SSH."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create key pair and save the private key."
          }
        ],
        "note": null,
        "warning": "You only get one chance to download the private key.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Launch a Linux instance with the key pair",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Instances."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name it saa-ec2-task7-linux."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose t3.micro or t2.micro if shown as free tier eligible."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Select key pair saa-ec2-task7-key."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Create a security group that allows SSH from My IP."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Choose Launch instance."
          }
        ],
        "note": "A key pair proves you own the private key when you connect.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Connect with SSH",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Wait until the instance state is Running."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Copy the instance Public IPv4 DNS or Public IPv4 address."
          },
          {
            "id": "console-step-4-item-3",
            "text": "On your computer, set the private key file permissions to read-only for you."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Run ssh -i saa-ec2-task7-key.pem ec2-user@PUBLIC-DNS."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Expected: your terminal changes to the EC2 Linux shell."
          }
        ],
        "note": null,
        "warning": "Do not share private key files.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down resources",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Exit the SSH session with exit."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Terminate saa-ec2-task7-linux."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Wait until the instance is terminated."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Delete the security group created for this lab."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Delete key pair saa-ec2-task7-key in EC2."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Delete the local .pem file if it is only for this lab."
          }
        ],
        "note": null,
        "warning": "Deleting the EC2 key pair does not delete your local private key file.",
        "expectedResult": "Step 5 completed successfully."
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
        "title": "Create the key pair and security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0].SubnetId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "MY_IP=$(curl -s https://checkip.amazonaws.com)/32"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "aws ec2 create-key-pair --region $REGION --key-name saa-ec2-task7-key --query 'KeyMaterial' --output text > saa-ec2-task7-key.pem"
          },
          {
            "id": "cli-step-2-cmd-6",
            "language": "bash",
            "text": "chmod 400 saa-ec2-task7-key.pem"
          }
        ],
        "note": "Expected: a private key file is saved locally.",
        "warning": null,
        "expectedResult": "Expected: a private key file is saved locally."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create SSH security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name saa-ec2-task7-ssh-sg --description 'Task 7 SSH security group' --vpc-id $VPC_ID --query GroupId --output text)"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 22 --cidr $MY_IP"
          }
        ],
        "note": "SSH is allowed only from your current public IP.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Launch and connect to the Linux instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023.*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "INSTANCE_ID=$(aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --key-name saa-ec2-task7-key --security-group-ids $SG_ID --subnet-id $SUBNET_ID --associate-public-ip-address --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task7-linux}]' --query 'Instances[0].InstanceId' --output text)"
          },
          {
            "id": "cli-step-4-cmd-3",
            "language": "bash",
            "text": "aws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-4-cmd-4",
            "language": "bash",
            "text": "PUBLIC_DNS=$(aws ec2 describe-instances --region $REGION --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicDnsName' --output text)"
          },
          {
            "id": "cli-step-4-cmd-5",
            "language": "bash",
            "text": "echo ssh -i saa-ec2-task7-key.pem ec2-user@$PUBLIC_DNS"
          }
        ],
        "note": "Run the printed SSH command from your terminal.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "aws ec2 delete-security-group --region $REGION --group-id $SG_ID"
          },
          {
            "id": "cli-step-5-cmd-4",
            "language": "bash",
            "text": "aws ec2 delete-key-pair --region $REGION --key-name saa-ec2-task7-key"
          },
          {
            "id": "cli-step-5-cmd-5",
            "language": "bash",
            "text": "rm -f saa-ec2-task7-key.pem"
          }
        ],
        "note": "Dependency order: terminate instance, delete security group, delete key pair, delete local key file.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Public key in AWS",
        "body": "AWS stores the public key for the instance launch."
      },
      {
        "id": "cs-2",
        "title": "Private key local",
        "body": "You keep the private key and never upload it to random places."
      },
      {
        "id": "cs-3",
        "title": "SSH source",
        "body": "The security group source must allow your current IP."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Permission denied publickey",
        "body": "Use the correct private key, correct username, and chmod 400."
      },
      {
        "id": "ts-2",
        "title": "Connection timed out",
        "body": "Check the security group, route to the internet, and public IP."
      },
      {
        "id": "ts-3",
        "title": "Lost private key",
        "body": "You cannot download the same private key again. Create a new key pair and replace access another way."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Deleting key pair",
        "body": "Wrong: deleting the EC2 key pair deletes your local key. Correct: it only deletes the AWS public key record."
      },
      {
        "id": "trap-2",
        "title": "SSH needs network access",
        "body": "Wrong: a key pair alone allows connection. Correct: SSH also needs an allowed security group rule."
      },
      {
        "id": "trap-3",
        "title": "Windows differs",
        "body": "Windows uses the private key to decrypt the administrator password before RDP."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Public key in AWS. Private key with you. Both sides must match before SSH works.",
    "flashcardSetId": "ec2_task_7_flashcards"
  },
  {
    "id": "task-saa-ec2-stop-start-and-terminate-an-ec2-instance-008",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Stop, start, and terminate an EC2 instance",
    "slug": "stop-start-and-terminate-an-ec2-instance",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Launch a small EC2 instance, stop it, start it again, then terminate it safely.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Stop",
        "body": "Stop shuts down an EBS-backed instance but keeps the root volume."
      },
      {
        "id": "concept-2",
        "title": "Start",
        "body": "Start boots the stopped instance again."
      },
      {
        "id": "concept-3",
        "title": "Terminate",
        "body": "Terminate deletes the instance. This is permanent."
      }
    ],
    "whyItMatters": "Stop, start, and terminate are basic EC2 operations. The exams test the difference between stopping and terminating.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task8-lifecycle"
      },
      {
        "label": "Required permissions summary",
        "value": "Launch one EC2 instance, stop it, start it, terminate it, and verify its state."
      }
    ],
    "costWarning": "This lab creates EC2 charges while the instance is running. Stopped instances do not charge for compute, but attached EBS volumes can still create storage charges. Terminate the instance when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeImages, ec2:DescribeInstances, ec2:DescribeInstanceStatus, ec2:DescribeVpcs, ec2:DescribeSubnets"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 lifecycle: ec2:RunInstances, ec2:StopInstances, ec2:StartInstances, ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-8",
            "text": "EC2 tagging: ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-9",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Launch a small test instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-ec2-task8-lifecycle."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose t3.micro or t2.micro if shown as free tier eligible."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Use the default VPC and default security group for this lifecycle test."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Choose Launch instance."
          }
        ],
        "note": "This lab focuses on lifecycle actions, not connecting to the instance.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Stop the instance",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Wait until the instance state is Running."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select the instance."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Instance state."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Stop instance."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Confirm the stop action."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Wait until the state is Stopped."
          }
        ],
        "note": "Stopping keeps the EBS root volume but stops compute charges.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Start the instance again",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the stopped instance."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Instance state."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Start instance."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Wait until the state returns to Running."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Check whether the public IPv4 address changed."
          }
        ],
        "note": "A stopped and started instance often gets a new public IPv4 address unless it uses an Elastic IP.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Terminate the instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select the running instance."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Instance state."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Terminate instance."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm termination."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Wait until the state becomes Terminated."
          }
        ],
        "note": null,
        "warning": "Termination is permanent. The instance cannot be recovered.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down check",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Confirm the instance is Terminated."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Check that no extra security group, key pair, or Elastic IP was created for this lab."
          },
          {
            "id": "console-step-6-item-3",
            "text": "If you created any optional resources, delete them now."
          }
        ],
        "note": "This lab only needs the instance lifecycle cleanup.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
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
        "title": "Launch a test instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --filters Name=default-for-az,Values=true --query 'Subnets[0].SubnetId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023.*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "INSTANCE_ID=$(aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task8-lifecycle}]' --query 'Instances[0].InstanceId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "aws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID"
          }
        ],
        "note": "Expected: the instance reaches the running state.",
        "warning": null,
        "expectedResult": "Expected: the instance reaches the running state."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Stop and start the instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 stop-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-stopped --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "aws ec2 start-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "aws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID"
          }
        ],
        "note": "Expected: the instance moves from running to stopped, then back to running.",
        "warning": null,
        "expectedResult": "Expected: the instance moves from running to stopped, then back to running."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Terminate the instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-4-cmd-3",
            "language": "bash",
            "text": "aws ec2 describe-instances --region $REGION --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].State.Name' --output text"
          }
        ],
        "note": null,
        "warning": "Expected final state: terminated. This cannot be undone.",
        "expectedResult": "CLI command step 4 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release the Elastic IP address to prevent charges for unattached IPv4 addresses."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Stopped is not deleted",
        "body": "Stopped keeps the instance record and EBS volumes."
      },
      {
        "id": "cs-2",
        "title": "Terminated is deleted",
        "body": "Terminated instances cannot be started again."
      },
      {
        "id": "cs-3",
        "title": "Public IP can change",
        "body": "A stop/start can change the public IPv4 address."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Instance will not stop",
        "body": "Check that the instance is EBS-backed and that you have ec2:StopInstances."
      },
      {
        "id": "ts-2",
        "title": "Start fails",
        "body": "Check service limits and instance state."
      },
      {
        "id": "ts-3",
        "title": "Unexpected charges",
        "body": "Check for EBS volumes, Elastic IPs, or other resources left behind."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Stop vs terminate",
        "body": "Wrong: stop deletes everything. Correct: stop keeps EBS volumes; terminate is permanent."
      },
      {
        "id": "trap-2",
        "title": "Instance store data",
        "body": "Wrong: instance store data survives stop. Correct: instance store data is lost when stopped or terminated."
      },
      {
        "id": "trap-3",
        "title": "Public IP after start",
        "body": "Wrong: public IPv4 always stays the same. Correct: it can change after stop/start."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Stop is pause. Terminate is destroy. Use stop for temporary shutdown and terminate for cleanup.",
    "flashcardSetId": "ec2_task_8_flashcards"
  },
  {
    "id": "task-saa-ec2-attach-an-iam-role-to-ec2-for-secure-s3-access-010",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Attach an IAM role to EC2 for secure S3 access",
    "slug": "attach-an-iam-role-to-ec2-for-secure-s3-access",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create an IAM role for EC2, attach it to an instance, and use temporary role credentials to access a private S3 bucket without access keys.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "IAM role for EC2",
        "body": "An EC2 role gives applications temporary AWS credentials."
      },
      {
        "id": "concept-2",
        "title": "Instance profile",
        "body": "An instance profile is the container that lets EC2 use the IAM role."
      },
      {
        "id": "concept-3",
        "title": "No access keys on EC2",
        "body": "Apps on EC2 should use roles instead of stored long-term access keys."
      }
    ],
    "whyItMatters": "Using IAM roles for EC2 is the secure exam answer when an instance needs access to AWS services like S3.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "S3 bucket",
        "value": "saa-ec2-task10-s3-[account-id]"
      },
      {
        "label": "IAM role",
        "value": "saa-ec2-task10-s3-read-role"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task10-role-test"
      },
      {
        "label": "Required permissions summary",
        "value": "Create an S3 test bucket, create an EC2 IAM role and instance profile, launch one EC2 instance with the role, test S3 read access, and clean up in dependency order."
      }
    ],
    "costWarning": "This lab can create small EC2, S3 storage, and request charges. Terminate the instance and delete the S3 and IAM resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-7",
            "text": "IAM role setup: iam:CreateRole, iam:GetRole, iam:CreateInstanceProfile, iam:AddRoleToInstanceProfile, iam:PassRole"
          },
          {
            "id": "console-step-1-item-8",
            "text": "IAM policy setup: iam:CreatePolicy, iam:GetPolicy, iam:AttachRolePolicy, iam:DetachRolePolicy, iam:DeletePolicy"
          },
          {
            "id": "console-step-1-item-9",
            "text": "IAM cleanup: iam:RemoveRoleFromInstanceProfile, iam:DeleteInstanceProfile, iam:DeleteRole"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 bucket and object: s3:CreateBucket, s3:GetBucketLocation, s3:PutObject, s3:GetObject, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-11",
            "text": "S3 cleanup: s3:DeleteObject, s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-12",
            "text": "EC2 setup: ec2:RunInstances, ec2:CreateTags, ec2:DescribeInstances, ec2:DescribeImages, ec2:DescribeSubnets"
          },
          {
            "id": "console-step-1-item-13",
            "text": "EC2 access and cleanup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:CreateKeyPair, ec2:TerminateInstances, ec2:DeleteSecurityGroup, ec2:DeleteKeyPair"
          },
          {
            "id": "console-step-1-item-14",
            "text": "These permissions let you create the lab resources, test the task, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a small S3 test bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use bucket name saa-ec2-task10-s3-[account-id]."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use Region eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Block Public Access on."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Upload a small file named role-test.txt."
          }
        ],
        "note": "The EC2 instance will access this bucket through an IAM role.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create an IAM role for EC2",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open IAM."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Roles."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create role."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For trusted entity type, choose AWS service."
          },
          {
            "id": "console-step-3-item-5",
            "text": "For use case, choose EC2."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Create a policy that allows s3:ListBucket on the bucket and s3:GetObject on the bucket objects."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Attach the policy to the role."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Name the role saa-ec2-task10-s3-read-role."
          }
        ],
        "note": "The EC2 trusted entity lets EC2 use the role through an instance profile.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Launch an EC2 instance with the role",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name it saa-ec2-task10-role-test."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose t3.micro or t2.micro if shown as free tier eligible."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Create or select key pair saa-ec2-task10-key."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Allow SSH from My IP."
          },
          {
            "id": "console-step-4-item-8",
            "text": "In Advanced details, set IAM instance profile to saa-ec2-task10-s3-read-role."
          },
          {
            "id": "console-step-4-item-9",
            "text": "Launch the instance."
          }
        ],
        "note": null,
        "warning": "Do not place AWS access keys on the instance. Use the role instead.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test S3 access from the instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to the Linux instance with SSH."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Run aws sts get-caller-identity on the instance."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Run aws s3 ls s3://saa-ec2-task10-s3-[account-id]."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Run aws s3 cp s3://saa-ec2-task10-s3-[account-id]/role-test.txt -."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Expected: the instance lists and reads the test file without stored access keys."
          }
        ],
        "note": "The AWS CLI on the instance uses temporary role credentials from the instance metadata service.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Terminate saa-ec2-task10-role-test first."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Wait until the instance is terminated."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the EC2 security group if it was created only for this lab."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the EC2 key pair if created only for this lab."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Empty and delete bucket saa-ec2-task10-s3-[account-id]."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Detach the custom S3 policy from saa-ec2-task10-s3-read-role."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Remove the role from its instance profile if needed."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Delete the instance profile if it exists separately."
          },
          {
            "id": "console-step-6-item-9",
            "text": "Delete the IAM role."
          },
          {
            "id": "console-step-6-item-10",
            "text": "Delete the custom IAM policy."
          }
        ],
        "note": "Dependency order: EC2 instance, network/key resources, S3 objects and bucket, then IAM attachments and role.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
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
        "title": "Create S3 bucket and object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "BUCKET=saa-ec2-task10-s3-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "aws s3api create-bucket --region $REGION --bucket $BUCKET --create-bucket-configuration LocationConstraint=$REGION"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "echo 'EC2 role S3 test' > role-test.txt"
          },
          {
            "id": "cli-step-2-cmd-6",
            "language": "bash",
            "text": "aws s3 cp role-test.txt s3://$BUCKET/role-test.txt"
          }
        ],
        "note": "Expected: the test file is stored in the private S3 bucket.",
        "warning": null,
        "expectedResult": "Expected: the test file is stored in the private S3 bucket."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create IAM role, policy, and instance profile",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "cat > trust-ec2.json <<'EOF'\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"ec2.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}\nEOF"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws iam create-role --role-name saa-ec2-task10-s3-read-role --assume-role-policy-document file://trust-ec2.json"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "cat > s3-read-policy.json <<EOF\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"s3:ListBucket\",\"Resource\":\"arn:aws:s3:::$BUCKET\"},{\"Effect\":\"Allow\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}\nEOF"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "POLICY_ARN=$(aws iam create-policy --policy-name saa-ec2-task10-s3-read-policy --policy-document file://s3-read-policy.json --query Policy.Arn --output text)"
          },
          {
            "id": "cli-step-3-cmd-5",
            "language": "bash",
            "text": "aws iam attach-role-policy --role-name saa-ec2-task10-s3-read-role --policy-arn $POLICY_ARN"
          },
          {
            "id": "cli-step-3-cmd-6",
            "language": "bash",
            "text": "aws iam create-instance-profile --instance-profile-name saa-ec2-task10-profile"
          },
          {
            "id": "cli-step-3-cmd-7",
            "language": "bash",
            "text": "aws iam add-role-to-instance-profile --instance-profile-name saa-ec2-task10-profile --role-name saa-ec2-task10-s3-read-role"
          },
          {
            "id": "cli-step-3-cmd-8",
            "language": "bash",
            "text": "sleep 20"
          }
        ],
        "note": "Expected: the instance profile can pass the role to EC2.",
        "warning": null,
        "expectedResult": "Expected: the instance profile can pass the role to EC2."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Launch EC2 with the IAM role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0].SubnetId' --output text)"
          },
          {
            "id": "cli-step-4-cmd-3",
            "language": "bash",
            "text": "MY_IP=$(curl -s https://checkip.amazonaws.com)/32"
          },
          {
            "id": "cli-step-4-cmd-4",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name saa-ec2-task10-ssh-sg --description 'Task 10 SSH security group' --vpc-id $VPC_ID --query GroupId --output text)"
          },
          {
            "id": "cli-step-4-cmd-5",
            "language": "bash",
            "text": "aws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 22 --cidr $MY_IP"
          },
          {
            "id": "cli-step-4-cmd-6",
            "language": "bash",
            "text": "aws ec2 create-key-pair --region $REGION --key-name saa-ec2-task10-key --query 'KeyMaterial' --output text > saa-ec2-task10-key.pem"
          },
          {
            "id": "cli-step-4-cmd-7",
            "language": "bash",
            "text": "chmod 400 saa-ec2-task10-key.pem"
          },
          {
            "id": "cli-step-4-cmd-8",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023.*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-4-cmd-9",
            "language": "bash",
            "text": "INSTANCE_ID=$(aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --iam-instance-profile Name=saa-ec2-task10-profile --key-name saa-ec2-task10-key --security-group-ids $SG_ID --subnet-id $SUBNET_ID --associate-public-ip-address --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task10-role-test}]' --query 'Instances[0].InstanceId' --output text)"
          },
          {
            "id": "cli-step-4-cmd-10",
            "language": "bash",
            "text": "aws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID"
          }
        ],
        "note": "Expected: the instance is running with an IAM instance profile.",
        "warning": null,
        "expectedResult": "Expected: the instance is running with an IAM instance profile."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Print test commands for the instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "PUBLIC_DNS=$(aws ec2 describe-instances --region $REGION --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicDnsName' --output text)"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "echo ssh -i saa-ec2-task10-key.pem ec2-user@$PUBLIC_DNS"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "echo 'On the instance run: aws sts get-caller-identity && aws s3 ls s3://'$BUCKET' && aws s3 cp s3://'$BUCKET'/role-test.txt -'"
          }
        ],
        "note": "Expected: the instance can list and read the file using role credentials.",
        "warning": null,
        "expectedResult": "Expected: the instance can list and read the file using role credentials."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws ec2 delete-security-group --region $REGION --group-id $SG_ID"
          },
          {
            "id": "cli-step-6-cmd-4",
            "language": "bash",
            "text": "aws ec2 delete-key-pair --region $REGION --key-name saa-ec2-task10-key"
          },
          {
            "id": "cli-step-6-cmd-5",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET --recursive"
          },
          {
            "id": "cli-step-6-cmd-6",
            "language": "bash",
            "text": "aws s3api delete-bucket --region $REGION --bucket $BUCKET"
          },
          {
            "id": "cli-step-6-cmd-7",
            "language": "bash",
            "text": "aws iam detach-role-policy --role-name saa-ec2-task10-s3-read-role --policy-arn $POLICY_ARN"
          },
          {
            "id": "cli-step-6-cmd-8",
            "language": "bash",
            "text": "aws iam remove-role-from-instance-profile --instance-profile-name saa-ec2-task10-profile --role-name saa-ec2-task10-s3-read-role"
          },
          {
            "id": "cli-step-6-cmd-9",
            "language": "bash",
            "text": "aws iam delete-instance-profile --instance-profile-name saa-ec2-task10-profile"
          },
          {
            "id": "cli-step-6-cmd-10",
            "language": "bash",
            "text": "aws iam delete-role --role-name saa-ec2-task10-s3-read-role"
          },
          {
            "id": "cli-step-6-cmd-11",
            "language": "bash",
            "text": "aws iam delete-policy --policy-arn $POLICY_ARN"
          },
          {
            "id": "cli-step-6-cmd-12",
            "language": "bash",
            "text": "rm -f role-test.txt trust-ec2.json s3-read-policy.json saa-ec2-task10-key.pem"
          }
        ],
        "note": "Dependency order: terminate EC2, delete EC2 access resources, empty/delete S3 bucket, detach/delete IAM resources, delete local files.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the S3 bucket is listed and accessible in the S3 console."
      },
      {
        "id": "verify-2",
        "text": "Verify that GetBucketLocation or bucket properties confirm the Region is 'eu-west-2'."
      },
      {
        "id": "verify-3",
        "text": "Verify that Elastic Compute Cloud settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
      },
      {
        "id": "verify-5",
        "text": "Verify that server-side encryption and access logging are enabled as specified."
      },
      {
        "id": "verify-6",
        "text": "Confirm bucket policy, public access block, and CORS configuration match lab settings."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Empty all object versions, delete markers, and objects stored in the lab S3 bucket."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the S3 bucket created during this lab to prevent storage charges."
      },
      {
        "id": "cleanup-3",
        "text": "Remove any custom bucket policies, access points, or logging rules created for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Best practice",
        "body": "Use an IAM role for EC2-to-S3 access."
      },
      {
        "id": "cs-2",
        "title": "Least privilege",
        "body": "Allow only the bucket and object actions the instance needs."
      },
      {
        "id": "cs-3",
        "title": "Instance profile",
        "body": "EC2 attaches instance profiles, which contain IAM roles."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied from instance",
        "body": "Check the role policy bucket ARN and object ARN. Bucket and object permissions use different ARN patterns."
      },
      {
        "id": "ts-2",
        "title": "No credentials found",
        "body": "Check the IAM role is attached and IMDS is reachable from the instance."
      },
      {
        "id": "ts-3",
        "title": "PassRole denied",
        "body": "The lab identity needs iam:PassRole to launch EC2 with the role."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Do not use access keys",
        "body": "Wrong: copy IAM user keys onto EC2. Correct: attach an IAM role."
      },
      {
        "id": "trap-2",
        "title": "Bucket ARN trap",
        "body": "Wrong: use only arn:aws:s3:::bucket/* for ListBucket. Correct: ListBucket uses the bucket ARN without /*."
      },
      {
        "id": "trap-3",
        "title": "Role vs security group",
        "body": "Wrong: security groups grant S3 permissions. Correct: IAM roles grant AWS API permissions."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Role, not keys. EC2 borrows temporary permissions instead of storing passwords.",
    "flashcardSetId": "ec2_task_10_flashcards"
  },
  {
    "id": "task-saa-ec2-configure-ec2-instance-metadata-options-011",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Configure EC2 instance metadata options",
    "slug": "configure-ec2-instance-metadata-options",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Configure EC2 instance metadata options so IMDSv2 is required.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Instance metadata",
        "body": "EC2 instance metadata is information about the instance available from inside the instance."
      },
      {
        "id": "concept-2",
        "title": "IMDSv2",
        "body": "IMDSv2 uses a token. This helps protect metadata from simple request-forgery attacks."
      },
      {
        "id": "concept-3",
        "title": "Token required",
        "body": "When IMDSv2 is required, IMDSv1 metadata calls fail."
      }
    ],
    "whyItMatters": "This lab builds the EC2 skills used in real AWS operations and exam scenarios.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task11-imdsv2"
      },
      {
        "label": "Instance type",
        "value": "t3.micro"
      },
      {
        "label": "Required permissions summary",
        "value": "Launch and describe an EC2 instance, set metadata options, and terminate the test instance."
      }
    ],
    "costWarning": "This lab can create small EC2 charges while the instance is running. Terminate the instance after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeInstances, ec2:DescribeImages, ec2:DescribeSubnets, ec2:DescribeVpcs"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 launch: ec2:RunInstances, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Metadata options: ec2:ModifyInstanceMetadataOptions, ec2:DescribeInstanceAttribute"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Cleanup: ec2:TerminateInstances"
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the EC2 launch page",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Launch instances."
          }
        ],
        "note": "Use Region eu-west-2.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Choose basic instance settings",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Name the instance saa-ec2-task11-imdsv2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose instance type t3.micro or another free-tier style small instance if available."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose an existing key pair or choose Proceed without a key pair if you only want to test metadata settings."
          }
        ],
        "note": null,
        "warning": "Do not use production AMIs or production subnets for this lab.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Require IMDSv2",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Expand Advanced details."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Find Metadata accessible and keep it Enabled."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Metadata version to V2 only (token required)."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Metadata response hop limit to 1 for a normal instance lab."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Launch instance."
          }
        ],
        "note": "IMDSv2 requires a session token before metadata can be read.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Verify metadata options",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the new instance."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Details tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Find IMDSv2 or Metadata version."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm it shows that IMDSv2 is required."
          }
        ],
        "note": "AWS Console wording can vary slightly, but the setting should show token required or V2 only.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select the instance."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Instance state."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Terminate instance."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Wait until the instance state becomes Terminated."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete any extra key pair only if you created it only for this lab."
          }
        ],
        "note": null,
        "warning": "Terminating the instance deletes the instance. Keep nothing you need.",
        "expectedResult": "Step 6 completed successfully."
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
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023*x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --query 'Subnets[0].SubnetId' --output text)"
          }
        ],
        "note": "Expected: variables are ready for a small test instance.",
        "warning": null,
        "expectedResult": "Expected: variables are ready for a small test instance."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Launch an instance with IMDSv2 required",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --metadata-options HttpTokens=required,HttpEndpoint=enabled,HttpPutResponseHopLimit=1 --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task11-imdsv2}]' --query 'Instances[0].InstanceId' --output text"
          }
        ],
        "note": "Copy the returned instance ID into INSTANCE_ID.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Save the instance ID",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=PASTE_INSTANCE_ID_HERE"
          }
        ],
        "note": "Replace the placeholder with the instance ID from the previous command.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify IMDSv2 is required",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instances --region $REGION --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].MetadataOptions' --output table"
          }
        ],
        "note": "Expected: HttpTokens shows required.",
        "warning": null,
        "expectedResult": "Expected: HttpTokens shows required."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up the instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          }
        ],
        "note": "Expected: the instance starts shutting down.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "Expected: the instance starts shutting down."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      },
      {
        "id": "verify-6",
        "text": "Verify instance profile IAM role permissions allow expected AWS API calls."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "IMDSv2",
        "body": "Require IMDSv2 for better security."
      },
      {
        "id": "cs-2",
        "title": "Hop limit",
        "body": "A hop limit of 1 is common for normal EC2 instance access."
      },
      {
        "id": "cs-3",
        "title": "Exam choice",
        "body": "Choose IMDSv2 required when the question asks for stronger metadata security."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "The identity is missing ec2:ModifyInstanceMetadataOptions or launch permissions."
      },
      {
        "id": "ts-2",
        "title": "No AMI found",
        "body": "The AMI filter may not match. Choose an Amazon Linux AMI manually in the Console."
      },
      {
        "id": "ts-3",
        "title": "Instance does not launch",
        "body": "Check subnet capacity, instance type availability, and account limits."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "IMDSv1 trap",
        "body": "IMDSv1 does not use a token. IMDSv2 is the safer exam answer."
      },
      {
        "id": "trap-2",
        "title": "Metadata is local",
        "body": "Metadata is reached from the instance. It is not a public internet endpoint."
      },
      {
        "id": "trap-3",
        "title": "Role credentials trap",
        "body": "Instance profile credentials are exposed through metadata, so metadata protection matters."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "IMDSv2 = token first. No token means no metadata.",
    "flashcardSetId": "ec2_task_11_flashcards"
  },
  {
    "id": "task-saa-ec2-set-up-a-placement-group-012",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Set up a placement group",
    "slug": "set-up-a-placement-group",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Set up a placement group and launch EC2 instances in it.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Placement group",
        "body": "A placement group influences where EC2 instances are placed on AWS hardware."
      },
      {
        "id": "concept-2",
        "title": "Cluster strategy",
        "body": "Cluster keeps instances close for low latency and high throughput."
      },
      {
        "id": "concept-3",
        "title": "Other strategies",
        "body": "Spread reduces shared failure risk. Partition separates groups of instances across partitions."
      }
    ],
    "whyItMatters": "This lab builds the EC2 skills used in real AWS operations and exam scenarios.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Placement group",
        "value": "saa-ec2-task12-cluster-pg"
      },
      {
        "label": "Strategy",
        "value": "Cluster"
      },
      {
        "label": "Required permissions summary",
        "value": "Create a placement group, launch test instances into it, verify placement, terminate instances, and delete the group."
      }
    ],
    "costWarning": "This lab can create EC2 charges while instances are running. Terminate instances after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribePlacementGroups, ec2:DescribeInstances, ec2:DescribeImages, ec2:DescribeSubnets"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Placement group: ec2:CreatePlacementGroup, ec2:DeletePlacementGroup"
          },
          {
            "id": "console-step-1-item-8",
            "text": "EC2 launch: ec2:RunInstances, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Cleanup: ec2:TerminateInstances"
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open Placement Groups",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "In the left menu, choose Placement Groups."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Create placement group."
          }
        ],
        "note": "Use Region eu-west-2.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a placement group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Name it saa-ec2-task12-cluster-pg."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose strategy Cluster."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create group."
          }
        ],
        "note": "Cluster placement groups are for low-latency, high-throughput workloads.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Launch instances into the placement group",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Instances."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name the instances saa-ec2-task12-pg-instance."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Amazon Linux 2023 AMI and a small instance type."
          },
          {
            "id": "console-step-4-item-5",
            "text": "In Advanced details, find Placement group."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Select saa-ec2-task12-cluster-pg."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Set number of instances to 2 if your account allows it."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Choose Launch instance."
          }
        ],
        "note": null,
        "warning": "Cluster placement groups can fail to launch if the chosen instance type has no close capacity.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Verify placement",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open each instance."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Details tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm the placement group value is saa-ec2-task12-cluster-pg."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Terminate the instances in the placement group."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Wait until the instances are terminated."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open Placement Groups."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Select saa-ec2-task12-cluster-pg."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Choose Actions, then Delete placement group."
          }
        ],
        "note": null,
        "warning": "You cannot delete a placement group while running instances still use it.",
        "expectedResult": "Step 6 completed successfully."
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
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "PG_NAME=saa-ec2-task12-cluster-pg"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023*x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --query 'Subnets[0].SubnetId' --output text)"
          }
        ],
        "note": "These variables make the commands easier to read.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the placement group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-placement-group --region $REGION --group-name $PG_NAME --strategy cluster"
          }
        ],
        "note": "Expected: no error.",
        "warning": null,
        "expectedResult": "Expected: no error."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Launch two instances into the placement group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --placement GroupName=$PG_NAME --count 2 --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task12-pg-instance}]' --query 'Instances[].InstanceId' --output text"
          }
        ],
        "note": "Copy both returned instance IDs into INSTANCE_IDS.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify the placement group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instances --region $REGION --filters Name=placement-group-name,Values=$PG_NAME --query 'Reservations[].Instances[].{InstanceId:InstanceId,PlacementGroup:Placement.GroupName,State:State.Name}' --output table"
          }
        ],
        "note": "Expected: the instances show the placement group name.",
        "warning": null,
        "expectedResult": "Expected: the instances show the placement group name."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up instances then placement group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "INSTANCE_IDS=PASTE_INSTANCE_IDS_HERE"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_IDS"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_IDS"
          },
          {
            "id": "cli-step-6-cmd-4",
            "language": "bash",
            "text": "aws ec2 delete-placement-group --region $REGION --group-name $PG_NAME"
          }
        ],
        "note": "Delete the placement group only after instances are terminated.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Cluster",
        "body": "Best for low latency between instances."
      },
      {
        "id": "cs-2",
        "title": "Spread",
        "body": "Best for separating critical instances."
      },
      {
        "id": "cs-3",
        "title": "Partition",
        "body": "Best for large distributed systems like Hadoop or Cassandra."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Insufficient capacity",
        "body": "Cluster placement groups can fail if EC2 cannot place instances close together."
      },
      {
        "id": "ts-2",
        "title": "Delete fails",
        "body": "Terminate instances first. A placement group in use cannot be deleted."
      },
      {
        "id": "ts-3",
        "title": "Wrong strategy",
        "body": "Choose the strategy before creation. You cannot freely change the strategy later."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Cluster trap",
        "body": "Cluster improves network performance but does not spread across many failure domains."
      },
      {
        "id": "trap-2",
        "title": "Spread trap",
        "body": "Spread is for high availability, not maximum network speed."
      },
      {
        "id": "trap-3",
        "title": "Partition trap",
        "body": "Partition is used for distributed workloads that need separated groups."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Cluster = close. Spread = separate. Partition = grouped separation.",
    "flashcardSetId": "ec2_task_12_flashcards"
  },
  {
    "id": "task-saa-ec2-launch-a-spot-instance-013",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Launch a Spot Instance",
    "slug": "launch-a-spot-instance",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Launch a Spot Instance and observe cost savings.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Spot Instance",
        "body": "A Spot Instance uses spare EC2 capacity at a lower price."
      },
      {
        "id": "concept-2",
        "title": "Interruption risk",
        "body": "AWS can interrupt Spot Instances when capacity is needed back."
      },
      {
        "id": "concept-3",
        "title": "Best fit",
        "body": "Spot is best for flexible, fault-tolerant, or restartable work."
      }
    ],
    "whyItMatters": "This lab builds the EC2 skills used in real AWS operations and exam scenarios.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task13-spot"
      },
      {
        "label": "Instance type",
        "value": "t3.micro"
      },
      {
        "label": "Required permissions summary",
        "value": "View Spot pricing, launch a Spot Instance, verify its lifecycle, cancel requests if needed, and terminate the instance."
      }
    ],
    "costWarning": "This lab can create EC2 charges while the Spot Instance runs. Spot is usually cheaper than On-Demand, but it is not free.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeInstances, ec2:DescribeImages, ec2:DescribeSubnets, ec2:DescribeSpotPriceHistory, ec2:DescribeSpotInstanceRequests"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Spot launch: ec2:RunInstances, ec2:RequestSpotInstances, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Spot cleanup: ec2:CancelSpotInstanceRequests, ec2:TerminateInstances"
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the EC2 launch page",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Launch instances."
          }
        ],
        "note": "Use Region eu-west-2.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Choose Spot request settings",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Name the instance saa-ec2-task13-spot."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose a small instance type such as t3.micro."
          },
          {
            "id": "console-step-3-item-4",
            "text": "In Advanced details, find Purchasing option."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select Request Spot Instances."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Keep the default maximum price or use the on-demand price cap if shown."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose Launch instance."
          }
        ],
        "note": null,
        "warning": "Spot Instances can be interrupted when AWS needs the capacity back.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review Spot savings information",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the launched instance."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Check the purchasing option or lifecycle field."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Open Spot Requests from the EC2 menu."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Review the request status and current Spot information."
          }
        ],
        "note": "The exact saving changes by Region, instance type, and capacity.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Spot Requests."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Cancel the Spot request if it still exists."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Open Instances."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Terminate the Spot Instance."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Wait until the state becomes Terminated."
          }
        ],
        "note": null,
        "warning": "Cancel the request and terminate the instance so it does not come back or keep charging.",
        "expectedResult": "Step 5 completed successfully."
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
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023*x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --query 'Subnets[0].SubnetId' --output text)"
          }
        ],
        "note": "These variables choose a small Amazon Linux test instance.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Check recent Spot price history",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-spot-price-history --region $REGION --instance-types t3.micro --product-descriptions 'Linux/UNIX' --max-items 5 --query 'SpotPriceHistory[].{AZ:AvailabilityZone,Price:SpotPrice,Time:Timestamp}' --output table"
          }
        ],
        "note": "Expected: recent Spot prices are shown if available.",
        "warning": null,
        "expectedResult": "Expected: recent Spot prices are shown if available."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Launch a Spot Instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --instance-market-options 'MarketType=spot,SpotOptions={SpotInstanceType=one-time,InstanceInterruptionBehavior=terminate}' --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task13-spot}]' --query 'Instances[0].InstanceId' --output text"
          }
        ],
        "note": "Copy the returned instance ID into INSTANCE_ID.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify Spot lifecycle",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=PASTE_INSTANCE_ID_HERE"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "aws ec2 describe-instances --region $REGION --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].{InstanceId:InstanceId,Lifecycle:InstanceLifecycle,State:State.Name}' --output table"
          }
        ],
        "note": "Expected: Lifecycle shows spot.",
        "warning": null,
        "expectedResult": "Expected: Lifecycle shows spot."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up the Spot Instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          }
        ],
        "note": "Expected: the Spot Instance starts terminating.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "Expected: the Spot Instance starts terminating."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Spot pricing",
        "body": "Spot uses spare EC2 capacity and can be much cheaper than On-Demand."
      },
      {
        "id": "cs-2",
        "title": "Not for everything",
        "body": "Do not use Spot alone for workloads that cannot tolerate interruption."
      },
      {
        "id": "cs-3",
        "title": "Exam wording",
        "body": "Choose Spot for flexible workloads when cost saving is the main requirement."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Request not fulfilled",
        "body": "Spot capacity may be unavailable for the chosen instance type or Availability Zone."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied",
        "body": "The identity is missing EC2 Spot launch or describe permissions."
      },
      {
        "id": "ts-3",
        "title": "Unexpected termination",
        "body": "Spot Instances can be interrupted by AWS capacity changes."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Savings trap",
        "body": "Spot saves cost but does not guarantee the instance will keep running."
      },
      {
        "id": "trap-2",
        "title": "Stateful app trap",
        "body": "Do not choose Spot alone for a stateful critical database."
      },
      {
        "id": "trap-3",
        "title": "Capacity trap",
        "body": "A Spot request can fail if capacity is not available."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Spot = cheap but interruptible. Use it when the job can survive being stopped.",
    "flashcardSetId": "ec2_task_13_flashcards"
  },
  {
    "id": "task-saa-ec2-use-ec2-instance-connect-014",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Use EC2 Instance Connect",
    "slug": "use-ec2-instance-connect",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Use EC2 Instance Connect to access an instance without SSH keys.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "EC2 Instance Connect",
        "body": "EC2 Instance Connect lets you connect to supported Linux instances by pushing a temporary public key."
      },
      {
        "id": "concept-2",
        "title": "No long-term key file",
        "body": "You do not need to download and keep a private key for this lab."
      },
      {
        "id": "concept-3",
        "title": "Network still matters",
        "body": "The instance still needs a network path for SSH unless using an EC2 Instance Connect Endpoint design."
      }
    ],
    "whyItMatters": "This lab builds the EC2 skills used in real AWS operations and exam scenarios.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task14-eic"
      },
      {
        "label": "Security group",
        "value": "saa-ec2-task14-eic-sg"
      },
      {
        "label": "Required permissions summary",
        "value": "Launch a test Linux instance, allow SSH from your IP, use EC2 Instance Connect, then terminate the instance and delete the security group."
      }
    ],
    "costWarning": "This lab can create small EC2 charges while the instance is running. Terminate the instance after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeInstances, ec2:DescribeImages, ec2:DescribeSubnets, ec2:DescribeSecurityGroups"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 launch: ec2:RunInstances, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Security group: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup"
          },
          {
            "id": "console-step-1-item-9",
            "text": "EC2 Instance Connect: ec2-instance-connect:SendSSHPublicKey, ec2:DescribeInstanceConnectEndpoints"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Cleanup: ec2:TerminateInstances"
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create or choose a security group",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Security Groups."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create a security group named saa-ec2-task14-eic-sg."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Allow inbound SSH on port 22 from My IP."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep outbound access allowed."
          }
        ],
        "note": null,
        "warning": "Do not allow SSH from 0.0.0.0/0 in a real account.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Launch an Amazon Linux instance",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Instances."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name it saa-ec2-task14-eic."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose a small instance type such as t3.micro."
          },
          {
            "id": "console-step-3-item-6",
            "text": "For key pair, choose Proceed without a key pair if available."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Attach the security group saa-ec2-task14-eic-sg."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Launch the instance."
          }
        ],
        "note": "EC2 Instance Connect can push a temporary public key for the connection.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Connect with EC2 Instance Connect",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the running instance."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Connect."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose the EC2 Instance Connect tab."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Keep user name ec2-user for Amazon Linux."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Connect."
          }
        ],
        "note": "A browser terminal should open without you downloading a private SSH key.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Exit the browser terminal."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Terminate the EC2 instance."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Wait until the instance is terminated."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Delete the security group saa-ec2-task14-eic-sg."
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
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023*x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0].SubnetId' --output text)"
          }
        ],
        "note": "This lab uses the default VPC for simplicity.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create a security group for SSH",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name saa-ec2-task14-eic-sg --description 'EC2 Instance Connect lab SG' --vpc-id $VPC_ID --query GroupId --output text)"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "MY_IP=$(curl -s https://checkip.amazonaws.com)/32"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "aws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 22 --cidr $MY_IP"
          }
        ],
        "note": "Expected: SSH is open only from your current public IP.",
        "warning": null,
        "expectedResult": "Expected: SSH is open only from your current public IP."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Launch the instance without a key pair",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --security-group-ids $SG_ID --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task14-eic}]' --query 'Instances[0].InstanceId' --output text"
          }
        ],
        "note": "Copy the instance ID into INSTANCE_ID.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Open the Console connection page",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=PASTE_INSTANCE_ID_HERE"
          }
        ],
        "note": "Use the Console Connect button and choose EC2 Instance Connect.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up the instance and security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws ec2 delete-security-group --region $REGION --group-id $SG_ID"
          }
        ],
        "note": "Delete the security group after the instance is terminated.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Temporary key",
        "body": "EC2 Instance Connect sends a temporary public key to the instance."
      },
      {
        "id": "cs-2",
        "title": "Amazon Linux user",
        "body": "Use ec2-user for Amazon Linux."
      },
      {
        "id": "cs-3",
        "title": "Security group",
        "body": "SSH port 22 must allow your source path unless you use a private endpoint design."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Connect button fails",
        "body": "Check the instance is running, the AMI supports EC2 Instance Connect, and port 22 is reachable."
      },
      {
        "id": "ts-2",
        "title": "Wrong username",
        "body": "Amazon Linux normally uses ec2-user. Ubuntu normally uses ubuntu."
      },
      {
        "id": "ts-3",
        "title": "Security group delete fails",
        "body": "Terminate the instance first. A security group attached to an ENI cannot be deleted."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "No key does not mean no security",
        "body": "EC2 Instance Connect still uses IAM permission and temporary SSH key injection."
      },
      {
        "id": "trap-2",
        "title": "Network trap",
        "body": "EC2 Instance Connect still needs a valid network path unless using the endpoint option."
      },
      {
        "id": "trap-3",
        "title": "Windows trap",
        "body": "EC2 Instance Connect is for Linux SSH access, not Windows RDP."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "No key file to keep. EC2 Instance Connect gives temporary SSH access.",
    "flashcardSetId": "ec2_task_14_flashcards"
  },
  {
    "id": "task-saa-ec2-monitor-ec2-instance-metrics-with-cloudwatch-015",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Monitor EC2 instance metrics with CloudWatch",
    "slug": "monitor-ec2-instance-metrics-with-cloudwatch",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Monitor EC2 instance metrics with CloudWatch.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "CloudWatch metrics",
        "body": "CloudWatch stores metrics for AWS services, including EC2."
      },
      {
        "id": "concept-2",
        "title": "Basic monitoring",
        "body": "EC2 basic monitoring sends metrics every 5 minutes by default."
      },
      {
        "id": "concept-3",
        "title": "Detailed monitoring",
        "body": "Detailed monitoring gives 1-minute metrics and can cost extra."
      }
    ],
    "whyItMatters": "This lab builds the EC2 skills used in real AWS operations and exam scenarios.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task15-monitoring"
      },
      {
        "label": "Metric namespace",
        "value": "AWS/EC2"
      },
      {
        "label": "Required permissions summary",
        "value": "Launch a test instance, enable or view monitoring, read CloudWatch EC2 metrics, disable monitoring if used, and terminate the instance."
      }
    ],
    "costWarning": "This lab can create EC2 charges while the instance runs. Detailed monitoring can also create extra CloudWatch charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeInstances, ec2:DescribeImages, ec2:DescribeSubnets"
          },
          {
            "id": "console-step-1-item-7",
            "text": "EC2 launch and monitoring: ec2:RunInstances, ec2:MonitorInstances, ec2:UnmonitorInstances, ec2:CreateTags"
          },
          {
            "id": "console-step-1-item-8",
            "text": "CloudWatch metrics: cloudwatch:ListMetrics, cloudwatch:GetMetricStatistics, cloudwatch:GetMetricData"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Cleanup: ec2:TerminateInstances"
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Launch a small EC2 instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Instances, then Launch instances."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-ec2-task15-monitoring."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose a small instance type such as t3.micro."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Launch the instance."
          }
        ],
        "note": "Use Region eu-west-2.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Open EC2 monitoring",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select the instance."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose the Monitoring tab."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Review metrics such as CPU utilization, Network in, Network out, and Status check failed."
          }
        ],
        "note": "Basic EC2 metrics can take a few minutes to appear.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Enable detailed monitoring",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the instance."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Monitor and troubleshoot."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Manage detailed monitoring."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Enable Detailed monitoring."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose Save."
          }
        ],
        "note": null,
        "warning": "Detailed monitoring can create extra CloudWatch charges.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Open CloudWatch metrics",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open CloudWatch."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Metrics."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose All metrics."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose EC2."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Find metrics for your instance ID."
          }
        ],
        "note": "Use the instance ID to avoid picking the wrong metric.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Return to EC2."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select the instance."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Disable detailed monitoring if you enabled it."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Terminate the instance."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Wait until the state becomes Terminated."
          }
        ],
        "note": null,
        "warning": "CloudWatch metric history can remain visible after the instance is gone.",
        "expectedResult": "Step 6 completed successfully."
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
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023*x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --query 'Subnets[0].SubnetId' --output text)"
          }
        ],
        "note": "These variables prepare a small test instance.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Launch a monitored instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --monitoring Enabled=true --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task15-monitoring}]' --query 'Instances[0].InstanceId' --output text"
          }
        ],
        "note": "Copy the returned instance ID into INSTANCE_ID.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Wait and list EC2 metrics",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=PASTE_INSTANCE_ID_HERE"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws cloudwatch list-metrics --region $REGION --namespace AWS/EC2 --dimensions Name=InstanceId,Value=$INSTANCE_ID --query 'Metrics[].MetricName' --output table"
          }
        ],
        "note": "Metrics may take several minutes to appear.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Get CPU utilization statistics",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws cloudwatch get-metric-statistics --region $REGION --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=InstanceId,Value=$INSTANCE_ID --statistics Average --period 300 --start-time $(date -u -d '30 minutes ago' +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --output table"
          }
        ],
        "note": "Expected: datapoints appear after CloudWatch has received metrics.",
        "warning": null,
        "expectedResult": "Expected: datapoints appear after CloudWatch has received metrics."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up the instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 unmonitor-instances --region $REGION --instance-ids $INSTANCE_ID"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID"
          }
        ],
        "note": "Disable detailed monitoring first, then terminate the instance.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Basic metrics",
        "body": "EC2 basic monitoring is available without installing an agent."
      },
      {
        "id": "cs-2",
        "title": "Missing memory metric",
        "body": "Memory is not a default EC2 metric. Use the CloudWatch agent for memory."
      },
      {
        "id": "cs-3",
        "title": "Detailed monitoring",
        "body": "Use detailed monitoring when you need 1-minute EC2 metrics."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No metrics yet",
        "body": "Wait a few minutes. New EC2 metrics are not always instant."
      },
      {
        "id": "ts-2",
        "title": "No memory metric",
        "body": "Install and configure the CloudWatch agent to collect memory and disk metrics."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "The identity needs CloudWatch read permissions and EC2 monitoring permissions."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Memory trap",
        "body": "CloudWatch default EC2 metrics do not include memory usage."
      },
      {
        "id": "trap-2",
        "title": "Resolution trap",
        "body": "Basic monitoring is 5-minute. Detailed monitoring is 1-minute and may cost extra."
      },
      {
        "id": "trap-3",
        "title": "Agent trap",
        "body": "Use CloudWatch agent for OS-level metrics like memory and disk."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "EC2 gives outside metrics. The agent gives inside-the-OS metrics.",
    "flashcardSetId": "ec2_task_15_flashcards"
  },
  {
    "id": "task-saa-ec2-compare-ec2-pricing-models-016",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Compare EC2 pricing models",
    "slug": "compare-ec2-pricing-models",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Compare On-Demand, Reserved Instances, Spot Instances, Savings Plans, and Dedicated Hosts so you can choose the right pricing model.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Pricing model table",
        "body": "ModelBest forMain trade-offOn-DemandShort or unknown workloadsHighest flexibility, higher priceReserved InstancesSteady EC2 usageCommitment neededSpotFault-tolerant workCan be interruptedSavings PlansFlexible compute savingsHourly spend commitmentDedicated HostsLicensing or complianceCan cost more"
      },
      {
        "id": "concept-2",
        "title": "Spot interruption",
        "body": "Spot Instances can save money, but AWS can reclaim capacity. Use them for workloads that can stop and retry."
      },
      {
        "id": "concept-3",
        "title": "Dedicated Hosts",
        "body": "A Dedicated Host gives you a physical server dedicated to your account. It is useful for compliance or server-bound licences."
      }
    ],
    "whyItMatters": "This matters because EC2 decisions affect cost, security, performance, and operations. These topics are common across SAA-C03, SOA-C02, and DVA-C02.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Main comparison",
        "value": "On-Demand, Reserved Instances, Spot, Savings Plans, and Dedicated Hosts"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2 pricing review, Spot price review, Dedicated Host review, and optional Cost Explorer review."
      }
    ],
    "costWarning": "This review lab should not create EC2 charges if you only view pricing and do not launch resources. Cost Explorer access may depend on your account settings.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 price review: ec2:DescribeInstanceTypes, ec2:DescribeReservedInstancesOfferings, ec2:DescribeSpotPriceHistory, ec2:DescribeHosts Savings Plans review: savingsplans:DescribeSavingsPlansOfferings Billing review: ce:GetCostAndUsage if Cost Explorer is used",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open EC2 purchasing options",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "In the left menu, review Instances, Spot Requests, Reserved Instances, and Dedicated Hosts."
          }
        ],
        "note": "This task is mainly a comparison task. Do not launch paid resources.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Open AWS pricing pages",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the AWS pricing pages for EC2 and Savings Plans."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Compare payment style, commitment, flexibility, and interruption risk."
          }
        ],
        "note": "ModelBest forMain trade-offOn-DemandShort or unknown workloadsHighest flexibility, higher priceReserved InstancesSteady EC2 usageCommitment neededSpotFault-tolerant workCan be interruptedSavings PlansFlexible compute savingsHourly spend commitmentDedicated HostsLicensing or complianceCan cost more",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Record the best choice for each workload",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Choose On-Demand for short unknown use."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Reserved Instances or Savings Plans for steady use."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Spot for fault-tolerant batch work."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Dedicated Hosts for licence or compliance needs."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "No EC2 resources were created in this review task."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Close any pricing or Console pages you opened."
          }
        ],
        "note": "No dependency cleanup is needed because this task is review-only.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
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
        "title": "Check instance type information",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instance-types --region eu-west-2 --max-results 5"
          }
        ],
        "note": "Expected: the CLI returns EC2 instance type data.",
        "warning": null,
        "expectedResult": "Expected: the CLI returns EC2 instance type data."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "View recent Spot prices",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-spot-price-history --region eu-west-2 --instance-types t3.micro --product-descriptions \"Linux/UNIX\" --max-results 5"
          }
        ],
        "note": "Expected: recent Spot price entries appear.",
        "warning": null,
        "expectedResult": "Expected: recent Spot price entries appear."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Optional: review Dedicated Hosts",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-hosts --region eu-west-2"
          }
        ],
        "note": "Expected: your Dedicated Hosts are listed, or an empty list appears.",
        "warning": null,
        "expectedResult": "Expected: your Dedicated Hosts are listed, or an empty list appears."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "CLI teardown",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "echo \"No resources created. Nothing to delete.\""
          }
        ],
        "note": "This task is review-only.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Fast pricing choices",
        "body": "ModelBest forMain trade-offOn-DemandShort or unknown workloadsHighest flexibility, higher priceReserved InstancesSteady EC2 usageCommitment neededSpotFault-tolerant workCan be interruptedSavings PlansFlexible compute savingsHourly spend commitmentDedicated HostsLicensing or complianceCan cost more"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Run aws sts get-caller-identity. Check the grouped permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Confirm the Console and CLI both use eu-west-2, unless the task says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Cost Explorer denied",
        "body": "Cost Explorer may need account-level access. The EC2 comparison still works without it."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Spot is not for guaranteed uptime",
        "body": "Spot is cheap, but it can be interrupted. Use it for retry-safe workloads."
      },
      {
        "id": "trap-2",
        "title": "Reserved Instances are not the same as capacity",
        "body": "A Reserved Instance gives a billing discount. It does not always reserve capacity unless it is zonal."
      },
      {
        "id": "trap-3",
        "title": "Savings Plans are broader",
        "body": "Compute Savings Plans can apply across EC2, Fargate, and Lambda usage."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Pay for the pattern. Unknown use = On-Demand. Steady use = RI or Savings Plan. Retry-safe use = Spot. Licence host = Dedicated Host.",
    "flashcardSetId": "ec2_task_16_flashcards"
  },
  {
    "id": "task-saa-ec2-configure-and-use-enis-and-elastic-ips-with-ec2-017",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Configure and use ENIs and Elastic IPs with EC2",
    "slug": "configure-and-use-enis-and-elastic-ips-with-ec2",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an Elastic Network Interface, attach it to an EC2 instance, associate an Elastic IP, and verify the network setup.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "ENI and EIP plan",
        "body": "ItemPurposeImportant ruleENINetwork card for EC2Must be in same AZ as the instanceElastic IPStatic public IPv4Release it when finishedSecurity groupInstance-level firewallAttach to ENI"
      },
      {
        "id": "concept-2",
        "title": "ENI Availability Zone rule",
        "body": "An ENI must be in the same Availability Zone as the EC2 instance it attaches to."
      },
      {
        "id": "concept-3",
        "title": "Elastic IP cost warning",
        "body": "Elastic IP addresses can cost money, especially when idle. Release them after the lab."
      }
    ],
    "whyItMatters": "This matters because EC2 decisions affect cost, security, performance, and operations. These topics are common across SAA-C03, SOA-C02, and DVA-C02.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "ec2-task17-eni-lab"
      },
      {
        "label": "ENI name",
        "value": "ec2-task17-secondary-eni"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2 instance setup, ENI management, Elastic IP management, security group setup, and cleanup."
      }
    ],
    "costWarning": "This lab can create EC2 instance charges and Elastic IP charges. Stop is not enough for all costs. Terminate the instance and release the Elastic IP after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 network read: ec2:DescribeInstances, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:DescribeNetworkInterfaces, ec2:DescribeAddresses EC2 instance setup: ec2:RunInstances, ec2:CreateTags, ec2:TerminateInstances ENI actions: ec2:CreateNetworkInterface, ec2:AttachNetworkInterface, ec2:DetachNetworkInterface, ec2:DeleteNetworkInterface Elastic IP actions: ec2:AllocateAddress, ec2:AssociateAddress, ec2:DisassociateAddress, ec2:ReleaseAddress Security group setup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a small EC2 instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Launch instance."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use Amazon Linux and a low-cost instance type such as t3.micro."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Place it in the default VPC in eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Create or select a security group that allows SSH only from your IP."
          }
        ],
        "note": null,
        "warning": "Do not allow SSH from 0.0.0.0/0 in a real account.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a secondary ENI",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In EC2, open Network Interfaces."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create network interface."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select the same subnet and Availability Zone as the instance."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach the same security group."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Name it ec2-task17-secondary-eni."
          }
        ],
        "note": "The ENI must be in the same AZ as the instance.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Attach the ENI to the instance",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the new ENI."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Attach."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select the EC2 instance."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Attach the ENI as a secondary network interface."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Allocate and associate an Elastic IP",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Elastic IPs."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Allocate Elastic IP address."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select the new Elastic IP."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Actions, then Associate Elastic IP address."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Associate it with the secondary network interface."
          }
        ],
        "note": null,
        "warning": "Release the Elastic IP during teardown.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Verify the network setup",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the instance details page."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Check the Networking tab."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm the secondary ENI is attached."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Confirm the Elastic IP is associated."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Disassociate the Elastic IP."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Release the Elastic IP."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Detach the secondary ENI."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the secondary ENI."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Terminate the EC2 instance."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the lab security group if you created one."
          }
        ],
        "note": "Delete network dependencies before deleting the security group.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
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
            "text": "REGION=eu-west-2\nNAME=ec2-task17-eni-lab\naws ec2 describe-subnets --region $REGION --filters Name=default-for-az,Values=true --query 'Subnets[0].[SubnetId,AvailabilityZone,VpcId]' --output table"
          }
        ],
        "note": "Use the subnet, AZ, and VPC from the output.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create an ENI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-network-interface --region $REGION --subnet-id SUBNET_ID --description ec2-task17-secondary-eni --tag-specifications 'ResourceType=network-interface,Tags=[{Key=Name,Value=ec2-task17-secondary-eni}]'"
          }
        ],
        "note": "Replace SUBNET_ID with a real subnet ID.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Attach the ENI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 attach-network-interface --region $REGION --network-interface-id ENI_ID --instance-id INSTANCE_ID --device-index 1"
          }
        ],
        "note": "Replace ENI_ID and INSTANCE_ID.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Allocate and associate an Elastic IP",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 allocate-address --region $REGION --domain vpc\naws ec2 associate-address --region $REGION --allocation-id ALLOCATION_ID --network-interface-id ENI_ID"
          }
        ],
        "note": "Replace placeholders with your IDs.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "CLI teardown",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 disassociate-address --region $REGION --association-id ASSOCIATION_ID\naws ec2 release-address --region $REGION --allocation-id ALLOCATION_ID\naws ec2 detach-network-interface --region $REGION --attachment-id ATTACHMENT_ID\naws ec2 delete-network-interface --region $REGION --network-interface-id ENI_ID"
          }
        ],
        "note": null,
        "warning": "Only delete lab resources.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      },
      {
        "id": "cleanup-4",
        "text": "Release the Elastic IP address to prevent charges for unattached IPv4 addresses."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ENI rule",
        "body": "An ENI is tied to one subnet and one AZ."
      },
      {
        "id": "cs-2",
        "title": "Elastic IP rule",
        "body": "An Elastic IP is static until you release it. Idle Elastic IPs can cost money."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Run aws sts get-caller-identity. Check the grouped permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Confirm the Console and CLI both use eu-west-2, unless the task says otherwise."
      },
      {
        "id": "ts-3",
        "title": "InvalidParameterValue",
        "body": "The ENI and instance may be in different Availability Zones. Create the ENI in the instance subnet."
      },
      {
        "id": "ts-4",
        "title": "Elastic IP will not delete",
        "body": "Disassociate the Elastic IP first, then release it."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "ENI is not global",
        "body": "An ENI is tied to a subnet and Availability Zone."
      },
      {
        "id": "trap-2",
        "title": "Elastic IP is IPv4 only",
        "body": "Elastic IP is a static public IPv4 address. It is not IPv6."
      },
      {
        "id": "trap-3",
        "title": "Security groups attach to ENIs",
        "body": "The effective firewall rules are applied to the network interface."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "ENI = network card. Elastic IP = static public IPv4 attached to a resource.",
    "flashcardSetId": "ec2_task_17_flashcards"
  },
  {
    "id": "task-saa-ec2-compare-security-groups-and-nacls-for-ec2-networking-018",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Compare Security Groups and NACLs for EC2 networking",
    "slug": "compare-security-groups-and-nacls-for-ec2-networking",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Compare Security Groups and Network ACLs, then create simple rules to see how instance-level and subnet-level filtering differ.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Security Group vs NACL",
        "body": "FeatureSecurity GroupNACLLevelENI / instanceSubnetStateStatefulStatelessRulesAllow onlyAllow and denyReturn trafficAutomatically allowedMust be allowedEvaluationAll rules togetherLowest rule number first"
      },
      {
        "id": "concept-2",
        "title": "Stateful vs stateless",
        "body": "Security Groups are stateful. NACLs are stateless. This is one of the biggest exam traps."
      }
    ],
    "whyItMatters": "This matters because EC2 decisions affect cost, security, performance, and operations. These topics are common across SAA-C03, SOA-C02, and DVA-C02.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Security group name",
        "value": "ec2-task18-sg"
      },
      {
        "label": "NACL name",
        "value": "ec2-task18-nacl"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC read access, security group setup, NACL setup, and cleanup."
      }
    ],
    "costWarning": "Security Groups and NACLs do not have a separate hourly charge. EC2 instances used for testing can create charges if left running.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables Security group actions: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:DescribeSecurityGroups, ec2:DeleteSecurityGroup NACL actions: ec2:CreateNetworkAcl, ec2:CreateNetworkAclEntry, ec2:DescribeNetworkAcls, ec2:ReplaceNetworkAclAssociation, ec2:DeleteNetworkAclEntry, ec2:DeleteNetworkAcl",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the VPC networking areas",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Review Security Groups."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Review Network ACLs."
          }
        ],
        "note": "FeatureSecurity GroupNACLLevelENI / instanceSubnetStateStatefulStatelessRulesAllow onlyAllow and denyReturn trafficAutomatically allowedMust be allowedEvaluationAll rules togetherLowest rule number first",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a security group rule example",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open Security Groups."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it ec2-task18-sg."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Allow inbound HTTP from 0.0.0.0/0 for testing only."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Allow inbound SSH from your IP only."
          }
        ],
        "note": null,
        "warning": "Do not allow SSH from the whole internet in a real account.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review a NACL rule example",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open Network ACLs."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select the default NACL for your default VPC."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Review inbound and outbound rules."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Notice rule numbers and allow/deny actions."
          }
        ],
        "note": "NACLs are stateless, so return traffic needs matching rules.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Compare return traffic behaviour",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Read the comparison table again."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Notice Security Groups automatically allow return traffic."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Notice NACLs need inbound and outbound rules."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Write down why ephemeral ports matter for NACLs."
          }
        ],
        "note": "Ephemeral ports are temporary client-side ports used for return traffic.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Do not delete the default NACL."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete only the lab security group if it is not attached to any instance."
          },
          {
            "id": "console-step-6-item-3",
            "text": "If you created a custom NACL, move subnets back to the original NACL first."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete custom NACL entries."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the custom NACL."
          }
        ],
        "note": null,
        "warning": "Do not break your default VPC networking by deleting shared resources.",
        "expectedResult": "Step 6 completed successfully."
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
        "title": "List security groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-security-groups --region eu-west-2 --query 'SecurityGroups[*].[GroupName,GroupId,VpcId]' --output table"
          }
        ],
        "note": "Expected: security groups are listed.",
        "warning": null,
        "expectedResult": "Expected: security groups are listed."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "List network ACLs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-network-acls --region eu-west-2 --query 'NetworkAcls[*].[NetworkAclId,VpcId,IsDefault]' --output table"
          }
        ],
        "note": "Expected: NACLs are listed.",
        "warning": null,
        "expectedResult": "Expected: NACLs are listed."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a lab security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-security-group --region eu-west-2 --group-name ec2-task18-sg --description \"EC2 Task 18 SG comparison\" --vpc-id VPC_ID\naws ec2 authorize-security-group-ingress --region eu-west-2 --group-id SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0"
          }
        ],
        "note": "Replace VPC_ID and SG_ID.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "CLI teardown",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-security-group --region eu-west-2 --group-id SG_ID"
          }
        ],
        "note": null,
        "warning": "Only delete the lab security group.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Main comparison",
        "body": "FeatureSecurity GroupNACLLevelENI / instanceSubnetStateStatefulStatelessRulesAllow onlyAllow and denyReturn trafficAutomatically allowedMust be allowedEvaluationAll rules togetherLowest rule number first"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Run aws sts get-caller-identity. Check the grouped permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Confirm the Console and CLI both use eu-west-2, unless the task says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Security group will not delete",
        "body": "It is still attached to an ENI or instance. Detach it first."
      },
      {
        "id": "ts-4",
        "title": "Traffic blocked unexpectedly",
        "body": "Check both Security Group rules and NACL inbound/outbound rules."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Stateful vs stateless",
        "body": "Security Groups are stateful. NACLs are stateless. This is heavily tested."
      },
      {
        "id": "trap-2",
        "title": "NACL deny rules",
        "body": "NACLs can explicitly deny traffic. Security Groups cannot."
      },
      {
        "id": "trap-3",
        "title": "Rule order matters only for NACLs",
        "body": "NACLs process rules from the lowest number upward."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "SG remembers. NACL forgets. Security Groups are stateful. NACLs are stateless.",
    "flashcardSetId": "ec2_task_18_flashcards"
  },
  {
    "id": "task-saa-ec2-use-ec2-image-builder-to-automate-ami-creation-019",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Use EC2 Image Builder to automate AMI creation",
    "slug": "use-ec2-image-builder-to-automate-ami-creation",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an EC2 Image Builder pipeline that can automate AMI creation, then verify the pipeline structure.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Image Builder parts",
        "body": "PartWhat it doesImage recipeDefines base AMI and componentsInfrastructure configDefines build instance settingsDistribution configDefines where the AMI is shared or copiedPipelineRuns the automated AMI build"
      },
      {
        "id": "concept-2",
        "title": "Automated AMI builds",
        "body": "EC2 Image Builder helps build patched and tested AMIs without doing every step by hand."
      },
      {
        "id": "concept-3",
        "title": "IAM role needed",
        "body": "Image Builder needs a role because it launches build infrastructure and creates images for you."
      }
    ],
    "whyItMatters": "This matters because EC2 decisions affect cost, security, performance, and operations. These topics are common across SAA-C03, SOA-C02, and DVA-C02.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Pipeline name",
        "value": "ec2-task19-image-pipeline"
      },
      {
        "label": "Image recipe name",
        "value": "ec2-task19-recipe"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, Image Builder pipeline setup, IAM role setup, EC2 and SSM read access, and cleanup for Image Builder resources and any AMI outputs."
      }
    ],
    "costWarning": "EC2 Image Builder can create charges when it launches build instances, stores AMIs, creates EBS snapshots, or writes logs. Delete the pipeline resources and AMI outputs after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Image Builder actions: imagebuilder:CreateImagePipeline, imagebuilder:CreateImageRecipe, imagebuilder:CreateInfrastructureConfiguration, imagebuilder:CreateDistributionConfiguration, imagebuilder:StartImagePipelineExecution, imagebuilder:GetImagePipeline, imagebuilder:ListImagePipelines, imagebuilder:DeleteImagePipeline, imagebuilder:DeleteImageRecipe, imagebuilder:DeleteInfrastructureConfiguration, imagebuilder:DeleteDistributionConfiguration IAM role setup: iam:CreateRole, iam:AttachRolePolicy, iam:PassRole, iam:DetachRolePolicy, iam:DeleteRole EC2 and SSM support: ec2:DescribeImages, ec2:DescribeInstanceTypes, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ssm:GetParameter Cleanup: ec2:DeregisterImage, ec2:DeleteSnapshot if an AMI and snapshot are created",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open EC2 Image Builder",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Search for EC2 Image Builder."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open Image pipelines."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Create image pipeline."
          }
        ],
        "note": "This lab can be reviewed without running the build if you want to avoid charges.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the image recipe",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose an Amazon Linux managed image as the base image."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create a recipe named ec2-task19-recipe."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Keep components simple, such as update or test components."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Use version 1.0.0."
          }
        ],
        "note": "PartWhat it doesImage recipeDefines base AMI and componentsInfrastructure configDefines build instance settingsDistribution configDefines where the AMI is shared or copiedPipelineRuns the automated AMI build",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create infrastructure settings",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Create an infrastructure configuration named ec2-task19-infra."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose a small supported instance type."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Use the default VPC if asked."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select or create the required IAM role for Image Builder."
          }
        ],
        "note": null,
        "warning": "Running a pipeline launches build resources that can create charges.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the pipeline",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Create a pipeline named ec2-task19-image-pipeline."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose a manual or simple schedule."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Review all settings."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Create the pipeline."
          }
        ],
        "note": "Manual execution is easier for a learning lab.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Verify the pipeline",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the pipeline details page."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Confirm the recipe, infrastructure configuration, and distribution configuration are attached."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Do not start the build unless you accept possible charges."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Cancel any running build if needed."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete the image pipeline."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the distribution configuration."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the infrastructure configuration."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the image recipe."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Deregister any AMI created by the lab."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete any EBS snapshots created by the AMI."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Detach policies from the Image Builder IAM role if you created one."
          },
          {
            "id": "console-step-7-item-9",
            "text": "Delete the IAM role if it is only for this lab."
          }
        ],
        "note": null,
        "warning": "Do not delete shared company Image Builder roles or images.",
        "expectedResult": "Step 7 completed successfully."
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
        "title": "List Image Builder pipelines",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws imagebuilder list-image-pipelines --region eu-west-2"
          }
        ],
        "note": "Expected: existing pipelines are listed, or an empty list appears.",
        "warning": null,
        "expectedResult": "Expected: existing pipelines are listed, or an empty list appears."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Get latest Amazon Linux AMI parameter",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ssm get-parameter --region eu-west-2 --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
          }
        ],
        "note": "Expected: a public SSM parameter returns the latest AMI ID.",
        "warning": null,
        "expectedResult": "Expected: a public SSM parameter returns the latest AMI ID."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Review CLI creation flow",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "echo \"Create order: role -> recipe -> infrastructure config -> distribution config -> pipeline -> run pipeline\""
          }
        ],
        "note": "The Console path is safer for this first Image Builder lab.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "CLI teardown reminder",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "echo \"Delete order: pipeline -> distribution config -> infrastructure config -> recipe -> AMI -> snapshots -> IAM role\""
          }
        ],
        "note": "Use the exact resource ARNs from your pipeline if you created them.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Image Builder parts",
        "body": "PartWhat it doesImage recipeDefines base AMI and componentsInfrastructure configDefines build instance settingsDistribution configDefines where the AMI is shared or copiedPipelineRuns the automated AMI build"
      },
      {
        "id": "cs-2",
        "title": "Best use",
        "body": "Use Image Builder for repeatable, patched, tested AMIs."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Run aws sts get-caller-identity. Check the grouped permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Confirm the Console and CLI both use eu-west-2, unless the task says otherwise."
      },
      {
        "id": "ts-3",
        "title": "iam:PassRole denied",
        "body": "Image Builder needs permission to pass the build role."
      },
      {
        "id": "ts-4",
        "title": "Pipeline run fails",
        "body": "Check the build logs, IAM role, subnet, and security group settings."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "AMI automation vs manual AMI",
        "body": "Manual AMIs are fine once. Image Builder is better for repeatable builds."
      },
      {
        "id": "trap-2",
        "title": "Pipeline output can cost money",
        "body": "The AMI and EBS snapshots created by Image Builder can create storage charges."
      },
      {
        "id": "trap-3",
        "title": "iam:PassRole matters",
        "body": "Services that use roles on your behalf often need iam:PassRole."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Recipe + pipeline = repeatable AMI. Image Builder turns AMI creation into a repeatable process.",
    "flashcardSetId": "ec2_task_19_flashcards"
  },
  {
    "id": "task-saa-ec2-demonstrate-ec2-hibernate-and-stop-start-lifecycle-020",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Demonstrate EC2 Hibernate and Stop/Start lifecycle",
    "slug": "demonstrate-ec2-hibernate-and-stop-start-lifecycle",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Launch an EC2 instance with hibernation enabled, compare stop, start, hibernate, and terminate, then tear everything down.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Lifecycle comparison",
        "body": "ActionWhat happensCommon useStopInstance shuts down. EBS root remains.Pause compute costStartInstance boots again.Resume workHibernateMemory state is saved to EBS.Faster resume with RAM stateTerminateInstance is deleted.Final cleanup"
      },
      {
        "id": "concept-2",
        "title": "Hibernate requirement",
        "body": "Hibernation must be enabled at launch. The root EBS volume must be encrypted and large enough to save memory."
      },
      {
        "id": "concept-3",
        "title": "Terminate warning",
        "body": "Terminate is permanent. Stop and hibernate are recoverable lifecycle states."
      }
    ],
    "whyItMatters": "This matters because EC2 decisions affect cost, security, performance, and operations. These topics are common across SAA-C03, SOA-C02, and DVA-C02.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "ec2-task20-hibernate-lab"
      },
      {
        "label": "Instance type",
        "value": "t3.micro or another hibernation-supported type"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2 launch and lifecycle actions, hibernate support checks, EBS support, security group setup, and cleanup."
      }
    ],
    "costWarning": "This lab can create EC2 and EBS charges while the instance and volumes exist. Stopped instances do not charge for compute, but EBS storage can still cost money. Terminate and delete unused resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 launch and lifecycle: ec2:RunInstances, ec2:StopInstances, ec2:StartInstances, ec2:TerminateInstances, ec2:DescribeInstances, ec2:CreateTags Hibernate support: ec2:ModifyInstanceAttribute, ec2:DescribeInstanceAttribute EBS support: ec2:DescribeVolumes, ec2:CreateVolume, ec2:DeleteVolume Security group setup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Launch a hibernate-ready instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Launch instance."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use Amazon Linux if available for your chosen instance type."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose a hibernation-supported instance type."
          },
          {
            "id": "console-step-2-item-5",
            "text": "In advanced details, enable Hibernate if available."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Use an encrypted EBS root volume."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Name the instance ec2-task20-hibernate-lab."
          }
        ],
        "note": null,
        "warning": "If hibernate is not available for your choices, use stop/start only and record why hibernate was blocked.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Check hibernate setting",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the instance details page."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Check the instance details for stop-hibernate behaviour."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Confirm hibernation is enabled if the launch settings supported it."
          }
        ],
        "note": "ActionWhat happensCommon useStopInstance shuts down. EBS root remains.Pause compute costStartInstance boots again.Resume workHibernateMemory state is saved to EBS.Faster resume with RAM stateTerminateInstance is deleted.Final cleanup",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Stop and start the instance",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the instance."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Instance state, then Stop instance."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Wait for the state to become Stopped."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Instance state, then Start instance."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Wait for the state to become Running."
          }
        ],
        "note": "A public IPv4 address may change after stop/start unless you use an Elastic IP.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Hibernate and resume if enabled",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select the instance."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Instance state."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Hibernate instance if available."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Wait for the instance to stop."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Start the instance again."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Confirm the instance returns to running."
          }
        ],
        "note": "Hibernate saves memory state to the encrypted EBS root volume.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Terminate the lab EC2 instance."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Wait until the instance is terminated."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm EBS volumes marked delete-on-termination are gone."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete any extra EBS volumes if you created them."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the lab security group if created."
          }
        ],
        "note": null,
        "warning": "Terminate is permanent.",
        "expectedResult": "Step 6 completed successfully."
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
        "title": "Launch command pattern",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 run-instances --region eu-west-2 --image-id AMI_ID --instance-type t3.micro --hibernation-options Configured=true --block-device-mappings '[{\"DeviceName\":\"/dev/xvda\",\"Ebs\":{\"Encrypted\":true,\"VolumeSize\":16,\"DeleteOnTermination\":true}}]' --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ec2-task20-hibernate-lab}]'"
          }
        ],
        "note": "Replace AMI_ID. Hibernation support depends on AMI, instance type, and volume settings.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Stop and start",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 stop-instances --region eu-west-2 --instance-ids INSTANCE_ID\naws ec2 wait instance-stopped --region eu-west-2 --instance-ids INSTANCE_ID\naws ec2 start-instances --region eu-west-2 --instance-ids INSTANCE_ID\naws ec2 wait instance-running --region eu-west-2 --instance-ids INSTANCE_ID"
          }
        ],
        "note": "Replace INSTANCE_ID.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Hibernate if supported",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 stop-instances --region eu-west-2 --instance-ids INSTANCE_ID --hibernate\naws ec2 wait instance-stopped --region eu-west-2 --instance-ids INSTANCE_ID"
          }
        ],
        "note": "Expected: the instance stops using hibernate if it was launched with hibernation enabled.",
        "warning": null,
        "expectedResult": "Expected: the instance stops using hibernate if it was launched with hibernation enabled."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "CLI teardown",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region eu-west-2 --instance-ids INSTANCE_ID\naws ec2 wait instance-terminated --region eu-west-2 --instance-ids INSTANCE_ID"
          }
        ],
        "note": null,
        "warning": "Only terminate lab instances.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      },
      {
        "id": "cleanup-4",
        "text": "Release the Elastic IP address to prevent charges for unattached IPv4 addresses."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Lifecycle table",
        "body": "ActionWhat happensCommon useStopInstance shuts down. EBS root remains.Pause compute costStartInstance boots again.Resume workHibernateMemory state is saved to EBS.Faster resume with RAM stateTerminateInstance is deleted.Final cleanup"
      },
      {
        "id": "cs-2",
        "title": "Public IP trap",
        "body": "A stopped and started instance can receive a new public IPv4 address unless it uses an Elastic IP."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Run aws sts get-caller-identity. Check the grouped permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Confirm the Console and CLI both use eu-west-2, unless the task says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Hibernate option missing",
        "body": "Check AMI support, instance type support, encrypted root EBS volume, and root volume size."
      },
      {
        "id": "ts-4",
        "title": "Instance will not terminate",
        "body": "Wait for state changes to finish. Check that you selected the correct lab instance."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Hibernate must be enabled early",
        "body": "You normally enable hibernation when launching the instance."
      },
      {
        "id": "trap-2",
        "title": "Stopped still has storage cost",
        "body": "Stopped instances do not charge for compute, but EBS volumes still can cost money."
      },
      {
        "id": "trap-3",
        "title": "Terminate is final",
        "body": "Terminated instances cannot be recovered."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Stop pauses. Hibernate remembers. Stop keeps disk. Hibernate also saves memory state.",
    "flashcardSetId": "ec2_task_20_flashcards"
  },
  {
    "id": "task-saa-ec2-recover-an-ec2-instance-and-troubleshoot-common-issues-021",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Recover an EC2 instance and troubleshoot common issues",
    "slug": "recover-an-ec2-instance-and-troubleshoot-common-issues",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create a recovery-aware EC2 lab, review status checks, create a recovery alarm, and practise common troubleshooting decisions.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Recovery action",
        "body": "A CloudWatch alarm can run the EC2 recover action when system status checks fail on a supported instance."
      },
      {
        "id": "concept-2",
        "title": "Status checks",
        "body": "System status checks point to AWS host problems. Instance status checks point to guest OS or instance problems."
      },
      {
        "id": "concept-3",
        "title": "Troubleshooting map",
        "body": "SymptomLikely areaFirst checkFixSystem check failedAWS hostInstance status checksRecover or stop/startInstance check failedGuest OSBoot, CPU, memoryReboot or inspect logsCannot SSHNetwork or keySecurity group and key pairAllow port 22 from your IPNo web pageApp or SGHTTP rule and web serverStart service and allow port 80"
      }
    ],
    "whyItMatters": "This matters because EC2 failures are tested as status checks, recovery actions, and network troubleshooting decisions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Example name prefix",
        "value": "saa-ec2-task21"
      },
      {
        "label": "Required permissions summary",
        "value": "EC2 launch/status checks, CloudWatch alarm recovery action, networking read checks, and cleanup."
      }
    ],
    "costWarning": "This lab can create small EC2 and CloudWatch charges. Terminate the instance and delete the alarm when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 setup and recovery: ec2:RunInstances, ec2:DescribeInstances, ec2:DescribeInstanceStatus, ec2:CreateTags, ec2:RecoverInstances CloudWatch alarm: cloudwatch:PutMetricAlarm, cloudwatch:DescribeAlarms, cloudwatch:DeleteAlarms Networking read: ec2:DescribeSecurityGroups, ec2:DescribeSubnets, ec2:DescribeVpcs Cleanup: ec2:TerminateInstances",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Launch a small test instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Instances, then Launch instances."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Name it saa-ec2-task21-recovery."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose an Amazon Linux AMI and t3.micro."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Use the default VPC and a public subnet."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Launch the instance."
          }
        ],
        "note": null,
        "warning": "Do not use a production instance for a recovery test.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Check status checks",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2 > Instances."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select the instance."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Open the Status checks tab."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Confirm both checks pass after the instance is running."
          }
        ],
        "note": "Status checks can take a few minutes after launch.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create a recovery alarm",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open CloudWatch > Alarms > All alarms."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create alarm."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select EC2 metric StatusCheckFailed_System for the instance."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set the threshold to recover when the metric is greater than or equal to 1."
          },
          {
            "id": "console-step-4-item-5",
            "text": "For action, choose Recover this instance if available."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Name it saa-ec2-task21-recover-alarm."
          }
        ],
        "note": "Do not force a real host failure. This lab is for setup and troubleshooting awareness.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down in order",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Delete the CloudWatch recovery alarm."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Terminate the EC2 instance."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm the instance state becomes Terminated."
          }
        ],
        "note": "Delete orderResourceReason1CloudWatch alarmStops recovery action2EC2 instanceStops compute cost",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
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
            "text": "REGION=eu-west-2\nNAME=saa-ec2-task21-recovery"
          }
        ],
        "note": "These variables keep later commands short.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Review running instances and status checks",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instance-status --region $REGION --include-all-instances"
          }
        ],
        "note": "Expected: EC2 returns status check information for instances in the Region.",
        "warning": null,
        "expectedResult": "Expected: EC2 returns status check information for instances in the Region."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a recovery alarm example",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=i-0123456789abcdef0\naws cloudwatch put-metric-alarm --region $REGION --alarm-name saa-ec2-task21-recover-alarm --namespace AWS/EC2 --metric-name StatusCheckFailed_System --dimensions Name=InstanceId,Value=$INSTANCE_ID --statistic Maximum --period 60 --evaluation-periods 2 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold --alarm-actions arn:aws:automate:$REGION:ec2:recover"
          }
        ],
        "note": "Replace the example instance ID before running.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Delete the alarm",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws cloudwatch delete-alarms --region $REGION --alarm-names saa-ec2-task21-recover-alarm"
          }
        ],
        "note": "Run this during teardown.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      },
      {
        "id": "cleanup-4",
        "text": "Release the Elastic IP address to prevent charges for unattached IPv4 addresses."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Status checks",
        "body": "System check failure usually means AWS host trouble. Instance check failure usually means guest OS trouble."
      },
      {
        "id": "cs-2",
        "title": "Recovery",
        "body": "Recovery keeps the instance ID, private IP, Elastic IP, and metadata where supported."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check cloudwatch:PutMetricAlarm, ec2:DescribeInstanceStatus, and the CLI identity."
      },
      {
        "id": "ts-2",
        "title": "Recover action missing",
        "body": "The instance type or setup may not support automatic recovery. Use stop/start as the safer learning fallback."
      },
      {
        "id": "ts-3",
        "title": "SSH still fails",
        "body": "Check the security group, route table, public IP, key pair, and OS firewall."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Recovery is not backup",
        "body": "Recovering an instance does not replace AMIs, snapshots, or Auto Scaling."
      },
      {
        "id": "trap-2",
        "title": "System vs instance checks",
        "body": "Do not mix them up. They point to different failure areas."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "System = host. Instance = guest. Status check wording tells you where to look first.",
    "flashcardSetId": "ec2_task_21_flashcards"
  },
  {
    "id": "task-saa-ec2-set-up-ec2-capacity-reservations-022",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Set up EC2 capacity reservations",
    "slug": "set-up-ec2-capacity-reservations",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create a small EC2 Capacity Reservation, understand matching rules, and cancel it safely.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Capacity Reservation",
        "body": "A Capacity Reservation reserves EC2 capacity in a specific Availability Zone."
      },
      {
        "id": "concept-2",
        "title": "Open or targeted",
        "body": "Open reservations can match suitable instance launches. Targeted reservations require the launch to target the reservation."
      },
      {
        "id": "concept-3",
        "title": "Reservation plan",
        "body": "SettingExampleReasonInstance typet3.microLow-cost lab typePlatformLinux/UNIXSimple test platformAZeu-west-2aCapacity is zonalQuantity1Keeps cost lowerEnd dateManual cancelLearner controls cleanup"
      }
    ],
    "whyItMatters": "This matters because Capacity Reservations are used when you need EC2 capacity available in a chosen Availability Zone.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Example name prefix",
        "value": "saa-ec2-task22"
      },
      {
        "label": "Required permissions summary",
        "value": "EC2 Capacity Reservation create/read/modify, optional instance launch test, and cleanup."
      }
    ],
    "costWarning": "Capacity Reservations can create charges even when unused. Cancel the reservation after the lab.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Capacity Reservation setup: ec2:CreateCapacityReservation, ec2:DescribeCapacityReservations, ec2:ModifyCapacityReservation EC2 launch test: ec2:RunInstances, ec2:DescribeInstances, ec2:CreateTags Cleanup: ec2:TerminateInstances, ec2:CancelCapacityReservation",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open Capacity Reservations",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "In the left menu, choose Capacity Reservations."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create Capacity Reservation."
          }
        ],
        "note": null,
        "warning": "Capacity Reservations can cost money even if no instance is running.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a small reservation",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Linux/UNIX."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose instance type t3.micro."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Availability Zone eu-west-2a."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set quantity to 1."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Use an open reservation for the beginner lab."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Create the reservation."
          }
        ],
        "note": "If capacity is not available, choose another AZ or stop the lab.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Launch an instance that can use it",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 > Instances."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Launch an Amazon Linux t3.micro in the same Availability Zone."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Check the instance details for capacity reservation matching."
          }
        ],
        "note": "The instance must match type, platform, tenancy, and Availability Zone.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down in order",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Terminate the test EC2 instance."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Wait until the instance is terminated."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Return to Capacity Reservations."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Select the reservation and choose Cancel."
          }
        ],
        "note": "Delete orderResourceReason1EC2 instanceStops compute use2Capacity ReservationStops reserved capacity charge",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
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
        "title": "Create a Capacity Reservation",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-capacity-reservation --region eu-west-2 --instance-type t3.micro --instance-platform Linux/UNIX --availability-zone eu-west-2a --instance-count 1 --tag-specifications 'ResourceType=capacity-reservation,Tags=[{Key=Name,Value=saa-ec2-task22-cr}]'"
          }
        ],
        "note": "Expected: EC2 returns a CapacityReservationId.",
        "warning": null,
        "expectedResult": "Expected: EC2 returns a CapacityReservationId."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "List Capacity Reservations",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-capacity-reservations --region eu-west-2 --filters Name=tag:Name,Values=saa-ec2-task22-cr"
          }
        ],
        "note": "Expected: the reservation state is active if capacity was reserved.",
        "warning": null,
        "expectedResult": "Expected: the reservation state is active if capacity was reserved."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Cancel the reservation",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "CAPACITY_RESERVATION_ID=cr-0123456789abcdef0\naws ec2 cancel-capacity-reservation --region eu-west-2 --capacity-reservation-id $CAPACITY_RESERVATION_ID"
          }
        ],
        "note": "Replace the example ID with your real CapacityReservationId.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and disassociate any Elastic IPs."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Zonal capacity",
        "body": "Capacity Reservations are tied to one Availability Zone."
      },
      {
        "id": "cs-2",
        "title": "Matching rules",
        "body": "Instance type, platform, tenancy, and AZ must match."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Insufficient capacity",
        "body": "Try another Availability Zone or a smaller instance type."
      },
      {
        "id": "ts-2",
        "title": "Instance does not use reservation",
        "body": "Check the AZ, instance type, platform, and open or targeted setting."
      },
      {
        "id": "ts-3",
        "title": "Unexpected cost",
        "body": "Cancel the Capacity Reservation after testing."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Not a discount by itself",
        "body": "A Capacity Reservation reserves capacity. It is not the same thing as a Reserved Instance discount."
      },
      {
        "id": "trap-2",
        "title": "AZ matters",
        "body": "A reservation in eu-west-2a does not reserve capacity in eu-west-2b."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Reserve space, not savings. Capacity Reservation means capacity first, discount separate.",
    "flashcardSetId": "ec2_task_22_flashcards"
  },
  {
    "id": "task-saa-ec2-launch-ec2-instances-in-public-and-private-subnets-and-assign-public-private-ips-023",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Launch EC2 instances in public and private subnets and assign public/private IPs",
    "slug": "launch-ec2-instances-in-public-and-private-subnets-and-assign-public-private-ips",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Build a small VPC, launch one EC2 instance with a public IP and one with only a private IP, then compare the networking.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Public subnet",
        "body": "A public subnet has a route to an Internet Gateway. An instance also needs a public IPv4 address to be reached from the internet."
      },
      {
        "id": "concept-2",
        "title": "Private subnet",
        "body": "A private subnet has no direct route to an Internet Gateway. Its instances usually keep private IPs only."
      },
      {
        "id": "concept-3",
        "title": "Network plan",
        "body": "ResourceNameCIDR/AZPurposeVPCsaa-ec2-task23-vpc10.23.0.0/16Lab networkPublic subnetsaa-ec2-task23-public-a10.23.1.0/24 / eu-west-2aPublic IP instancePrivate subnetsaa-ec2-task23-private-a10.23.11.0/24 / eu-west-2aPrivate IP instanceRoutePublic route0.0.0.0/0Internet Gateway"
      }
    ],
    "whyItMatters": "This matters because EC2 internet access depends on subnet routes, public IPs, and security rules.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Example name prefix",
        "value": "saa-ec2-task23"
      },
      {
        "label": "Required permissions summary",
        "value": "VPC/subnet setup, Internet Gateway route, EC2 launch, security group setup, IP comparison, and dependency-order cleanup."
      }
    ],
    "costWarning": "EC2 running time can cost money. Public IPv4 addresses can also create charges. Delete all resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC setup: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateInternetGateway, ec2:AttachInternetGateway, ec2:CreateRouteTable, ec2:CreateRoute, ec2:AssociateRouteTable, ec2:ModifySubnetAttribute EC2 launch: ec2:RunInstances, ec2:DescribeInstances, ec2:CreateTags Security groups: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DescribeSecurityGroups Cleanup: ec2:TerminateInstances, ec2:DeleteSecurityGroup, ec2:DisassociateRouteTable, ec2:DeleteRouteTable, ec2:DetachInternetGateway, ec2:DeleteInternetGateway, ec2:DeleteSubnet, ec2:DeleteVpc",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the VPC and subnets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC > Your VPCs."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create VPC saa-ec2-task23-vpc with CIDR 10.23.0.0/16."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create public subnet 10.23.1.0/24 in eu-west-2a."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create private subnet 10.23.11.0/24 in eu-west-2a."
          }
        ],
        "note": "ResourceNameCIDR/AZPurposeVPCsaa-ec2-task23-vpc10.23.0.0/16Lab networkPublic subnetsaa-ec2-task23-public-a10.23.1.0/24 / eu-west-2aPublic IP instancePrivate subnetsaa-ec2-task23-private-a10.23.11.0/24 / eu-west-2aPrivate IP instanceRoutePublic route0.0.0.0/0Internet Gateway",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Make the public subnet public",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create and attach an Internet Gateway to the VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create a route table named saa-ec2-task23-public-rt."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Add route 0.0.0.0/0 to the Internet Gateway."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Associate the route table with the public subnet."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Turn on Auto-assign public IPv4 address for the public subnet."
          }
        ],
        "note": null,
        "warning": "Do not add the Internet Gateway route to the private subnet.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Launch one public and one private instance",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 > Instances > Launch instances."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Launch one instance in the public subnet with public IP enabled."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Launch one instance in the private subnet with no public IP."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Use names saa-ec2-task23-public and saa-ec2-task23-private."
          }
        ],
        "note": "The private instance still gets a private IPv4 address.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Compare IP addresses",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open each instance details page."
          },
          {
            "id": "console-step-5-item-2",
            "text": "For the public instance, note the private IPv4 and public IPv4."
          },
          {
            "id": "console-step-5-item-3",
            "text": "For the private instance, note only the private IPv4."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm the subnet and route table explain the difference."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Terminate both instances."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the security group if you created one."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Disassociate and delete the public route table."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Detach and delete the Internet Gateway."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the subnets."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Delete the VPC."
          }
        ],
        "note": "OrderDeleteWhy1InstancesFree ENIs first2Security groupNo instances use it3Route table associationUnlock route table4Internet GatewayRemove public dependency5SubnetsNo ENIs left6VPCLast container",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
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
        "title": "Create VPC and subnets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nVPC_ID=$(aws ec2 create-vpc --region $REGION --cidr-block 10.23.0.0/16 --query 'Vpc.VpcId' --output text)\naws ec2 create-tags --region $REGION --resources $VPC_ID --tags Key=Name,Value=saa-ec2-task23-vpc\nPUBLIC_SUBNET_ID=$(aws ec2 create-subnet --region $REGION --vpc-id $VPC_ID --cidr-block 10.23.1.0/24 --availability-zone eu-west-2a --query 'Subnet.SubnetId' --output text)\nPRIVATE_SUBNET_ID=$(aws ec2 create-subnet --region $REGION --vpc-id $VPC_ID --cidr-block 10.23.11.0/24 --availability-zone eu-west-2a --query 'Subnet.SubnetId' --output text)"
          }
        ],
        "note": "Expected: you create one VPC and two subnets.",
        "warning": null,
        "expectedResult": "Expected: you create one VPC and two subnets."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Enable public IP on the public subnet",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 modify-subnet-attribute --region $REGION --subnet-id $PUBLIC_SUBNET_ID --map-public-ip-on-launch"
          }
        ],
        "note": "Expected: instances launched in this subnet can auto-receive public IPv4 addresses.",
        "warning": null,
        "expectedResult": "Expected: instances launched in this subnet can auto-receive public IPv4 addresses."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create Internet Gateway route",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "IGW_ID=$(aws ec2 create-internet-gateway --region $REGION --query 'InternetGateway.InternetGatewayId' --output text)\naws ec2 attach-internet-gateway --region $REGION --internet-gateway-id $IGW_ID --vpc-id $VPC_ID\nRT_ID=$(aws ec2 create-route-table --region $REGION --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)\naws ec2 create-route --region $REGION --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID\naws ec2 associate-route-table --region $REGION --route-table-id $RT_ID --subnet-id $PUBLIC_SUBNET_ID"
          }
        ],
        "note": "Expected: public subnet has a default route to the Internet Gateway.",
        "warning": null,
        "expectedResult": "Expected: public subnet has a default route to the Internet Gateway."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Tear down manually after testing",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "echo 'Terminate instances first, then delete SGs, route table associations, IGW, subnets, and VPC.'"
          }
        ],
        "note": "Use the Console teardown steps for safer cleanup.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      },
      {
        "id": "cleanup-4",
        "text": "Delete AMI images, launch templates, or placement groups created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Public IP rule",
        "body": "A subnet route to an Internet Gateway is not enough. The instance also needs a public IPv4 address."
      },
      {
        "id": "cs-2",
        "title": "Private subnet",
        "body": "Private subnets are used for back-end instances that should not be directly reachable from the internet."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No public IP",
        "body": "Check subnet auto-assign public IPv4 and the launch setting."
      },
      {
        "id": "ts-2",
        "title": "Cannot connect",
        "body": "Check the security group, public route table, public IP, and key pair."
      },
      {
        "id": "ts-3",
        "title": "VPC will not delete",
        "body": "Terminate instances and delete ENIs, security groups, subnets, and gateways first."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Public subnet is about routing",
        "body": "A public subnet has a route to an Internet Gateway. The instance still needs a public IP for inbound internet access."
      },
      {
        "id": "trap-2",
        "title": "Private IP always exists",
        "body": "EC2 instances in a VPC always get a private IP address."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Route + public IP = public path. Both matter for internet reachability.",
    "flashcardSetId": "ec2_task_23_flashcards"
  },
  {
    "id": "task-saa-ec2-use-ec2-launch-templates-and-launch-configurations-024",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Use EC2 launch templates and launch configurations",
    "slug": "use-ec2-launch-templates-and-launch-configurations",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create and compare launch templates and launch configurations, with focus on why launch templates are the modern choice.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Launch template",
        "body": "A launch template stores EC2 launch settings and supports versions."
      },
      {
        "id": "concept-2",
        "title": "Launch configuration",
        "body": "A launch configuration is the older Auto Scaling launch setting. It is mainly kept for legacy understanding."
      },
      {
        "id": "concept-3",
        "title": "Comparison table",
        "body": "FeatureLaunch templateLaunch configurationExam ideaStatusCurrent choiceLegacyPrefer templatesVersionsYesNoTemplates support change controlMixed instancesYesNoNeeded for modern ASG designSpot optionsBetter supportLimitedUse templates for flexible fleets"
      }
    ],
    "whyItMatters": "This matters because Auto Scaling and EC2 fleets usually use launch templates for repeatable, versioned instance settings.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Example name prefix",
        "value": "saa-ec2-task24"
      },
      {
        "label": "Required permissions summary",
        "value": "EC2 launch template create/read/delete, Auto Scaling launch configuration review, and supporting EC2 read permissions."
      }
    ],
    "costWarning": "This lab should cost very little if you do not launch instances. Delete templates and launch configurations after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 launch template: ec2:CreateLaunchTemplate, ec2:CreateLaunchTemplateVersion, ec2:DescribeLaunchTemplates, ec2:DescribeLaunchTemplateVersions, ec2:DeleteLaunchTemplate Auto Scaling launch configuration: autoscaling:CreateLaunchConfiguration, autoscaling:DescribeLaunchConfigurations, autoscaling:DeleteLaunchConfiguration Read supporting values: ec2:DescribeImages, ec2:DescribeInstanceTypes, ec2:DescribeSecurityGroups",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a launch template",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 > Launch Templates."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create launch template."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Name it saa-ec2-task24-template."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose an Amazon Linux AMI and t3.micro."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Create the template."
          }
        ],
        "note": "Do not launch production instances from this learning template.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a launch template version",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select the launch template."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Actions > Modify template or Create new version."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Change a safe setting, such as adding a tag."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Create version 2."
          }
        ],
        "note": "Versioning is a major reason launch templates are preferred.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review launch configuration concept",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 Auto Scaling > Launch configurations if visible."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Review that launch configurations do not have versions."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Do not use launch configurations for new production builds unless required by a legacy system."
          }
        ],
        "note": "FeatureLaunch templateLaunch configurationExam ideaStatusCurrent choiceLegacyPrefer templatesVersionsYesNoTemplates support change controlMixed instancesYesNoNeeded for modern ASG designSpot optionsBetter supportLimitedUse templates for flexible fleets",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down in order",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Delete the launch configuration if you created one."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm no Auto Scaling group depends on either item."
          }
        ],
        "note": "OrderDeleteReason1Launch configurationLegacy ASG dependency first2Launch templateRemove EC2 template source",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
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
        "title": "Create a launch template example",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region eu-west-2 --owners amazon --filters 'Name=name,Values=al2023-ami-*-x86_64' 'Name=state,Values=available' --query 'Images | sort_by(@,&CreationDate)[-1].ImageId' --output text)\naws ec2 create-launch-template --region eu-west-2 --launch-template-name saa-ec2-task24-template --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI_ID\\\",\\\"InstanceType\\\":\\\"t3.micro\\\"}\""
          }
        ],
        "note": "Expected: EC2 creates the launch template.",
        "warning": null,
        "expectedResult": "Expected: EC2 creates the launch template."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create a new launch template version",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-launch-template-version --region eu-west-2 --launch-template-name saa-ec2-task24-template --source-version 1 --version-description task24-v2 --launch-template-data '{\"TagSpecifications\":[{\"ResourceType\":\"instance\",\"Tags\":[{\"Key\":\"Name\",\"Value\":\"saa-ec2-task24-from-template\"}]}]}'"
          }
        ],
        "note": "Expected: EC2 creates version 2.",
        "warning": null,
        "expectedResult": "Expected: EC2 creates version 2."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Describe launch template versions",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-launch-template-versions --region eu-west-2 --launch-template-name saa-ec2-task24-template"
          }
        ],
        "note": "Expected: you see versions 1 and 2.",
        "warning": null,
        "expectedResult": "Expected: you see versions 1 and 2."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Delete the launch template",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-launch-template --region eu-west-2 --launch-template-name saa-ec2-task24-template"
          }
        ],
        "note": "Run this during teardown.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      },
      {
        "id": "cleanup-4",
        "text": "Delete AMI images, launch templates, or placement groups created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Launch templates",
        "body": "Use launch templates for modern EC2 and Auto Scaling designs."
      },
      {
        "id": "cs-2",
        "title": "Launch configurations",
        "body": "Launch configurations are older and do not support versioning."
      },
      {
        "id": "cs-3",
        "title": "Template comparison",
        "body": "FeatureLaunch templateLaunch configurationExam ideaStatusCurrent choiceLegacyPrefer templatesVersionsYesNoTemplates support change controlMixed instancesYesNoNeeded for modern ASG designSpot optionsBetter supportLimitedUse templates for flexible fleets"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check ec2:CreateLaunchTemplate and ec2:CreateLaunchTemplateVersion."
      },
      {
        "id": "ts-2",
        "title": "AMI not found",
        "body": "Use a valid AMI ID for the selected Region."
      },
      {
        "id": "ts-3",
        "title": "Template will not delete",
        "body": "Check whether an Auto Scaling group still references it."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Do not choose legacy first",
        "body": "For new AWS exam designs, launch templates are normally preferred over launch configurations."
      },
      {
        "id": "trap-2",
        "title": "Versioning matters",
        "body": "Launch templates can keep versions. Launch configurations cannot."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Templates have versions. Launch configurations are legacy.",
    "flashcardSetId": "ec2_task_24_flashcards"
  },
  {
    "id": "task-saa-ec2-compare-ec2-placement-strategies-cluster-partition-and-spread-025",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Compare EC2 placement strategies: cluster, partition, and spread",
    "slug": "compare-ec2-placement-strategies-cluster-partition-and-spread",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create and compare EC2 placement groups so you can choose the right strategy for latency, fault isolation, or distributed systems.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Cluster",
        "body": "Cluster placement puts instances close together for low latency and high network throughput."
      },
      {
        "id": "concept-2",
        "title": "Spread",
        "body": "Spread placement separates instances across distinct hardware to reduce shared failure risk."
      },
      {
        "id": "concept-3",
        "title": "Partition",
        "body": "Partition placement spreads groups of instances across partitions for large distributed systems."
      },
      {
        "id": "concept-4",
        "title": "Strategy comparison",
        "body": "StrategyBest forPlacement ideaExam warningClusterLow latency/HPCInstances close together in one AZHigher capacity riskSpreadCritical small groupInstances spread across hardwareLimited instances per AZPartitionLarge distributed systemsGroups split into partitionsGood for HDFS/Cassandra/Kafka style apps"
      }
    ],
    "whyItMatters": "This matters because placement strategy affects latency, hardware failure isolation, and large distributed workload design.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Example name prefix",
        "value": "saa-ec2-task25"
      },
      {
        "label": "Required permissions summary",
        "value": "Placement group create/read/delete, optional EC2 launch test, and dependency-order cleanup."
      }
    ],
    "costWarning": "Creating placement groups alone should cost nothing. EC2 instances launched into them can cost money.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Placement group setup: ec2:CreatePlacementGroup, ec2:DescribePlacementGroups, ec2:DeletePlacementGroup Optional instance launch: ec2:RunInstances, ec2:DescribeInstances, ec2:CreateTags Cleanup: ec2:TerminateInstances, ec2:DeletePlacementGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open placement groups",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "In the left menu, choose Placement Groups."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create placement group."
          }
        ],
        "note": "Placement groups influence where EC2 instances run inside AWS infrastructure.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create three placement groups",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create saa-ec2-task25-cluster with strategy Cluster."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create saa-ec2-task25-spread with strategy Spread."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create saa-ec2-task25-partition with strategy Partition."
          }
        ],
        "note": "StrategyBest forPlacement ideaExam warningClusterLow latency/HPCInstances close together in one AZHigher capacity riskSpreadCritical small groupInstances spread across hardwareLimited instances per AZPartitionLarge distributed systemsGroups split into partitionsGood for HDFS/Cassandra/Kafka style apps",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review how each would be used",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select each placement group."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Review the strategy shown in the details page."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Do not launch large instance groups for this lab."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Use the table to explain the best workload for each strategy."
          }
        ],
        "note": null,
        "warning": "Cluster placement can fail if AWS cannot place the requested capacity together.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down in order",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Terminate any instances launched in the placement groups."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Wait until instances are terminated."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Delete the three placement groups."
          }
        ],
        "note": "OrderDeleteReason1InstancesPlacement group must be empty2Placement groupsNo attached instances remain",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
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
        "title": "Create placement groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-placement-group --region eu-west-2 --group-name saa-ec2-task25-cluster --strategy cluster\naws ec2 create-placement-group --region eu-west-2 --group-name saa-ec2-task25-spread --strategy spread\naws ec2 create-placement-group --region eu-west-2 --group-name saa-ec2-task25-partition --strategy partition --partition-count 3"
          }
        ],
        "note": "Expected: EC2 creates three placement groups.",
        "warning": null,
        "expectedResult": "Expected: EC2 creates three placement groups."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Describe placement groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-placement-groups --region eu-west-2 --group-names saa-ec2-task25-cluster saa-ec2-task25-spread saa-ec2-task25-partition"
          }
        ],
        "note": "Expected: you see all three strategies.",
        "warning": null,
        "expectedResult": "Expected: you see all three strategies."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Delete placement groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-placement-group --region eu-west-2 --group-name saa-ec2-task25-cluster\naws ec2 delete-placement-group --region eu-west-2 --group-name saa-ec2-task25-spread\naws ec2 delete-placement-group --region eu-west-2 --group-name saa-ec2-task25-partition"
          }
        ],
        "note": "Run after any instances in the groups are terminated.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Placement strategy table",
        "body": "StrategyBest forPlacement ideaExam warningClusterLow latency/HPCInstances close together in one AZHigher capacity riskSpreadCritical small groupInstances spread across hardwareLimited instances per AZPartitionLarge distributed systemsGroups split into partitionsGood for HDFS/Cassandra/Kafka style apps"
      },
      {
        "id": "cs-2",
        "title": "Cluster",
        "body": "Best for tightly coupled workloads needing very low latency."
      },
      {
        "id": "cs-3",
        "title": "Spread",
        "body": "Best when a small number of critical instances must be isolated."
      },
      {
        "id": "cs-4",
        "title": "Partition",
        "body": "Best for large distributed systems that tolerate partition-level failure."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Insufficient capacity",
        "body": "Cluster placement needs close capacity. Try a smaller size or another AZ."
      },
      {
        "id": "ts-2",
        "title": "Cannot delete group",
        "body": "Terminate instances in the placement group first."
      },
      {
        "id": "ts-3",
        "title": "Wrong strategy chosen",
        "body": "Check the workload goal: latency, isolation, or distributed partitioning."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Cluster is not HA",
        "body": "Cluster improves network performance but can increase shared failure or capacity placement risk."
      },
      {
        "id": "trap-2",
        "title": "Spread has limits",
        "body": "Spread is for a small number of critical instances, not huge fleets."
      },
      {
        "id": "trap-3",
        "title": "Partition is for distributed apps",
        "body": "Partition placement helps systems like big data or distributed storage patterns."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "Cluster close. Spread apart. Partition in groups. That is the placement exam shortcut.",
    "flashcardSetId": "ec2_task_25_flashcards"
  },
  {
    "id": "task-saa-ec2-use-ssm-session-manager-and-patch-manager-with-ec2-027",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2",
    "title": "Use SSM Session Manager and Patch Manager with EC2",
    "slug": "use-ssm-session-manager-and-patch-manager-with-ec2",
    "service": "Amazon EC2",
    "feature": "Elastic Compute Cloud",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Launch an EC2 instance with an SSM role, connect using Session Manager, and run a Patch Manager scan without opening SSH.",
    "status": "published",
    "tags": [
      "EC2",
      "Elastic Compute Cloud",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Session Manager",
        "body": "Session Manager lets you connect to EC2 through Systems Manager. You do not need inbound SSH or a public key for the session."
      },
      {
        "id": "concept-2",
        "title": "Patch Manager",
        "body": "Patch Manager scans or installs operating system patches on managed nodes. This lab uses scan mode to keep it safer."
      },
      {
        "id": "concept-3",
        "title": "Plan table",
        "body": "ToolPurposeTest in this labKey exam ideaSession ManagerBrowser or CLI shell to EC2Open a shell without SSH keysNo inbound SSH requiredPatch ManagerScan or install OS patchesRun AWS-RunPatchBaseline in scan modeManaged node needs SSM accessIAM roleGives EC2 SSM permissionsAttach AmazonSSMManagedInstanceCoreUse roles, not access keysSSM AgentRuns on the instanceAmazon Linux 2023 includes itAgent and network path are required"
      }
    ],
    "whyItMatters": "This matters because SSM is safer than opening SSH to the internet. It also helps operations teams patch and manage EC2 at scale.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task27-ssm-managed"
      },
      {
        "label": "IAM role",
        "value": "saa-ec2-task27-ssm-role"
      },
      {
        "label": "Instance profile",
        "value": "saa-ec2-task27-ssm-profile"
      },
      {
        "label": "Managed policy",
        "value": "AmazonSSMManagedInstanceCore"
      },
      {
        "label": "Patch command",
        "value": "AWS-RunPatchBaseline with Operation=Scan"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2 launch, IAM role and instance profile setup, SSM Session Manager, SSM Patch Manager command checks, and dependency-order cleanup."
      }
    ],
    "costWarning": "This lab can create small charges. EC2 instance runtime and EBS storage can cost money. Systems Manager standard features are often low cost, but delete the EC2 instance and IAM resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with EC2 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions in the table below."
          }
        ],
        "note": "PurposeExact actionsIdentitysts:GetCallerIdentityEC2 setupec2:RunInstances, ec2:DescribeInstances, ec2:DescribeImages, ec2:CreateTags, ec2:TerminateInstancesNetworkingec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroupsIAM roleiam:CreateRole, iam:AttachRolePolicy, iam:CreateInstanceProfile, iam:AddRoleToInstanceProfile, iam:PassRoleIAM cleanupiam:RemoveRoleFromInstanceProfile, iam:DeleteInstanceProfile, iam:DetachRolePolicy, iam:DeleteRoleSSM Sessionssm:StartSession, ssm:TerminateSession, ssm:DescribeInstanceInformationSSM Patchssm:SendCommand, ssm:GetCommandInvocation, ssm:ListCommandInvocations, ssm:DescribePatchBaselinesLogs readcloudwatch:DescribeAlarms optional for monitoring checks",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the EC2 role for Systems Manager",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open IAM."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Roles."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create role."
          },
          {
            "id": "console-step-2-item-4",
            "text": "For trusted entity type, choose AWS service."
          },
          {
            "id": "console-step-2-item-5",
            "text": "For use case, choose EC2."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Attach AmazonSSMManagedInstanceCore."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Name the role saa-ec2-task27-ssm-role."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Create the role."
          }
        ],
        "note": "This role lets the EC2 instance register as a Systems Manager managed node.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Launch an EC2 instance with the SSM role",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it saa-ec2-task27-ssm-managed."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose t3.micro or another small instance type."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Use the default VPC and a subnet with outbound internet access."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Do not open inbound SSH for this lab."
          },
          {
            "id": "console-step-3-item-9",
            "text": "Under Advanced details, set IAM instance profile to saa-ec2-task27-ssm-role."
          },
          {
            "id": "console-step-3-item-10",
            "text": "Launch the instance."
          }
        ],
        "note": "The instance needs outbound access to Systems Manager endpoints. A public subnet with internet access is the simplest learning setup.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Confirm the instance is a managed node",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open AWS Systems Manager."
          },
          {
            "id": "console-step-4-item-2",
            "text": "In the left menu, choose Node Management."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Managed Nodes."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Wait until saa-ec2-task27-ssm-managed appears."
          }
        ],
        "note": "This can take a few minutes after launch.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Connect with Session Manager",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open AWS Systems Manager."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Session Manager."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Start session."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Select the EC2 instance."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose Start session."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Run whoami inside the browser shell."
          },
          {
            "id": "console-step-5-item-7",
            "text": "End the session."
          }
        ],
        "note": "Expected: you get a shell without using SSH keys or opening inbound port 22.",
        "warning": null,
        "expectedResult": "Expected: you get a shell without using SSH keys or opening inbound port 22."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Run a Patch Manager scan",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open AWS Systems Manager."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Run Command."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Run command."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Search for AWS-RunPatchBaseline."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Set Operation to Scan."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose the EC2 instance as the target."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Run the command."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Open the command result when it finishes."
          }
        ],
        "note": null,
        "warning": "Use Scan first. Install can change packages on the instance.",
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "End any open Session Manager sessions."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Terminate the EC2 instance."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open IAM."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Remove AmazonSSMManagedInstanceCore from saa-ec2-task27-ssm-role."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the role after the instance is terminated."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Confirm the managed node disappears from Systems Manager after the instance is gone."
          }
        ],
        "note": "Delete orderResourceWhy1End SSM sessionsAvoid active management sessions.2Terminate EC2 instanceStops compute charges.3Remove role from instance profileBreak dependency before deletion.4Delete instance profileNo longer attached to instance.5Detach policy from roleRole cannot be deleted with attached policy.6Delete roleFinal IAM cleanup.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
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
        "title": "Create the IAM role and instance profile",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\ncat > /tmp/task27-trust.json <<'EOF'\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": {\"Service\": \"ec2.amazonaws.com\"},\n      \"Action\": \"sts:AssumeRole\"\n    }\n  ]\n}\nEOF\naws iam create-role --role-name saa-ec2-task27-ssm-role --assume-role-policy-document file:///tmp/task27-trust.json\naws iam attach-role-policy --role-name saa-ec2-task27-ssm-role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore\naws iam create-instance-profile --instance-profile-name saa-ec2-task27-ssm-profile\naws iam add-role-to-instance-profile --instance-profile-name saa-ec2-task27-ssm-profile --role-name saa-ec2-task27-ssm-role\nsleep 20"
          }
        ],
        "note": "Expected: the EC2 role and instance profile are created.",
        "warning": null,
        "expectedResult": "Expected: the EC2 role and instance profile are created."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Launch the managed EC2 instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SUBNET_ID=$(aws ec2 describe-subnets --region $REGION --filters Name=default-for-az,Values=true --query 'Subnets[0].SubnetId' --output text)\nAMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)\nINSTANCE_ID=$(aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $SUBNET_ID --iam-instance-profile Name=saa-ec2-task27-ssm-profile --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task27-ssm-managed}]' --query 'Instances[0].InstanceId' --output text)\naws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID\necho $INSTANCE_ID"
          }
        ],
        "note": "Expected: the instance reaches running state.",
        "warning": null,
        "expectedResult": "Expected: the instance reaches running state."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Check the instance appears in Systems Manager",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ssm describe-instance-information --region $REGION --filters Key=InstanceIds,Values=$INSTANCE_ID --query 'InstanceInformationList[].{InstanceId:InstanceId,PingStatus:PingStatus,Platform:PlatformName}' --output table"
          }
        ],
        "note": "Expected: the instance appears with PingStatus as Online. It may take a few minutes.",
        "warning": null,
        "expectedResult": "Expected: the instance appears with PingStatus as Online. It may take a few minutes."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Start a Session Manager session",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ssm start-session --region $REGION --target $INSTANCE_ID"
          }
        ],
        "note": "Expected: an interactive shell opens. Type exit to end the session.",
        "warning": null,
        "expectedResult": "Expected: an interactive shell opens. Type exit to end the session."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Run a Patch Manager scan",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "COMMAND_ID=$(aws ssm send-command --region $REGION --instance-ids $INSTANCE_ID --document-name AWS-RunPatchBaseline --parameters 'Operation=Scan' --query 'Command.CommandId' --output text)\necho $COMMAND_ID\nsleep 30\naws ssm list-command-invocations --region $REGION --command-id $COMMAND_ID --details --query 'CommandInvocations[].{Status:Status,Document:DocumentName,InstanceId:InstanceId}' --output table"
          }
        ],
        "note": "Expected: the command moves to Success or InProgress. Scan mode checks patch state without installing patches.",
        "warning": null,
        "expectedResult": "Expected: the command moves to Success or InProgress. Scan mode checks patch state without installing patches."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID\naws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_ID\naws iam remove-role-from-instance-profile --instance-profile-name saa-ec2-task27-ssm-profile --role-name saa-ec2-task27-ssm-role\naws iam delete-instance-profile --instance-profile-name saa-ec2-task27-ssm-profile\naws iam detach-role-policy --role-name saa-ec2-task27-ssm-role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore\naws iam delete-role --role-name saa-ec2-task27-ssm-role\nrm -f /tmp/task27-trust.json"
          }
        ],
        "note": "Expected: the EC2 instance, instance profile, role attachment, role, and local trust file are removed.",
        "warning": "Destructive Command Warning: This command permanently modifies, erases, or terminates AWS resources or local filesystem data.",
        "expectedResult": "Expected: the EC2 instance, instance profile, role attachment, role, and local trust file are removed."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the EC2 instance status shows 'Running' in the EC2 Management Console."
      },
      {
        "id": "verify-2",
        "text": "Verify system status checks and instance status checks report 2/2 checks passed."
      },
      {
        "id": "verify-3",
        "text": "Confirm security group inbound rules permit required ports for Elastic Compute Cloud."
      },
      {
        "id": "verify-4",
        "text": "Verify key pair association, Elastic IP, or attached EBS volumes are active."
      },
      {
        "id": "verify-5",
        "text": "Confirm User Data bootstrap script executed successfully and web server is reachable."
      },
      {
        "id": "verify-6",
        "text": "Verify instance profile IAM role permissions allow expected AWS API calls."
      },
      {
        "id": "verify-7",
        "text": "Confirm EC2 instance configuration matches lab specifications."
      },
      {
        "id": "verify-8",
        "text": "Confirm EC2 instance configuration matches lab specifications."
      },
      {
        "id": "verify-9",
        "text": "Confirm EC2 instance configuration matches lab specifications."
      },
      {
        "id": "verify-10",
        "text": "Confirm EC2 instance configuration matches lab specifications."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate the EC2 instance created during this lab and wait for state to show Terminated."
      },
      {
        "id": "cleanup-2",
        "text": "Release any Elastic IP addresses allocated during this lab."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom security groups, key pairs, and EBS volumes created for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Session Manager",
        "body": "Connects to EC2 without inbound SSH, public bastion hosts, or long-term SSH keys."
      },
      {
        "id": "cs-2",
        "title": "Patch Manager",
        "body": "Scans or installs operating system patches on managed nodes using Systems Manager."
      },
      {
        "id": "cs-3",
        "title": "SSM comparison",
        "body": "ToolPurposeTest in this labKey exam ideaSession ManagerBrowser or CLI shell to EC2Open a shell without SSH keysNo inbound SSH requiredPatch ManagerScan or install OS patchesRun AWS-RunPatchBaseline in scan modeManaged node needs SSM accessIAM roleGives EC2 SSM permissionsAttach AmazonSSMManagedInstanceCoreUse roles, not access keysSSM AgentRuns on the instanceAmazon Linux 2023 includes itAgent and network path are required"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Instance not listed as managed",
        "body": "Check the IAM role, SSM Agent, outbound network access, and Region."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied",
        "body": "Check the caller with aws sts get-caller-identity. Confirm the grouped permissions in Console step 0."
      },
      {
        "id": "ts-3",
        "title": "Session fails to start",
        "body": "The instance must be online in Systems Manager. Also check your user has permission to start sessions."
      },
      {
        "id": "ts-4",
        "title": "Patch scan fails",
        "body": "Check the instance is online, the OS is supported, and the instance can reach patch repositories."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "No inbound SSH needed",
        "body": "Session Manager can connect without opening port 22."
      },
      {
        "id": "trap-2",
        "title": "Instance role matters",
        "body": "The EC2 instance needs an IAM role with Systems Manager permissions."
      },
      {
        "id": "trap-3",
        "title": "Patch scan vs install",
        "body": "Scan checks patch state. Install changes the instance."
      },
      {
        "id": "trap-4",
        "title": "Agent and network path required",
        "body": "Systems Manager needs SSM Agent and a path to Systems Manager endpoints."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Elastic Compute Cloud configuration and architectural best practices in Amazon EC2."
      }
    ],
    "memoryHook": "SSM manages without SSH. Session Manager connects safely, and Patch Manager checks or installs patches.",
    "flashcardSetId": "ec2_task_27_flashcards"
  }
];
