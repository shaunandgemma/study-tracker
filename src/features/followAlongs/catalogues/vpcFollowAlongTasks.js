/**
 * Amazon VPC Follow Along Tasks & Guided AWS Labs (SAA-C03)
 * Total Converted Tasks: 34
 */

export const VPC_TASKS = [
  {
    "id": "task-saa-vpc-design-a-vpc-cidr-plan-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Design a VPC CIDR plan",
    "slug": "design-a-vpc-cidr-plan",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Design a clean private IPv4 and IPv6 CIDR plan for a small multi-account AWS environment.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "VPC CIDR",
        "body": "A VPC needs one IPv4 CIDR block. You can also add IPv6 CIDR blocks."
      },
      {
        "id": "concept-2",
        "title": "Private IPv4",
        "body": "Use private ranges like 10.0.0.0/8. Avoid overlap between accounts, VPCs, and on-prem networks."
      },
      {
        "id": "concept-3",
        "title": "IPv6 in AWS",
        "body": "AWS IPv6 is normally globally routable. Use route tables and security groups to control access."
      },
      {
        "id": "concept-4",
        "title": "Subnet size",
        "body": "IPv4 subnets should leave room for growth. IPv6 subnets are normally /64."
      }
    ],
    "whyItMatters": "Bad CIDR planning causes routing overlap. Overlap makes VPC peering, Transit Gateway, VPN, Direct Connect, and migrations harder.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Organisation private range",
        "value": "10.0.0.0/8"
      },
      {
        "label": "Production account VPC",
        "value": "10.10.0.0/16"
      },
      {
        "label": "Development account VPC",
        "value": "10.20.0.0/16"
      },
      {
        "label": "Shared services account VPC",
        "value": "10.30.0.0/16"
      },
      {
        "label": "Example subnet size",
        "value": "/24 for small subnets, /20 for larger environments"
      },
      {
        "label": "IPv6 subnet size",
        "value": "/64 per subnet"
      },
      {
        "label": "Required permissions summary",
        "value": "Read VPCs, subnets, Availability Zones, account attributes, and current AWS identity."
      }
    ],
    "costWarning": "This design task should cost nothing because it creates no AWS resources. Costs only start if you create VPC resources later. NAT Gateways incur hourly availability charges (~$0.045/hr) plus data processing charges per GB. Always delete NAT Gateways and release Elastic IPs immediately after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "For a personal learning account, ReadOnlyAccess is enough for this planning task."
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
            "text": "VPC read checks: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Region checks: ec2:DescribeAvailabilityZones, ec2:DescribeRegions"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Account network checks: ec2:DescribeAccountAttributes"
          }
        ],
        "note": null,
        "warning": "This task is read-only. Do not create or delete production resources.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the VPC service",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Search for VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Change the Region to eu-west-2."
          }
        ],
        "note": "Use one Region for the example so the plan stays simple.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Check existing VPC CIDRs",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In Your VPCs, look at the IPv4 CIDR column."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Write down any CIDRs already used."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Check that the new plan does not overlap with existing CIDRs."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Repeat this check in other accounts if you have access."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Choose the account-level CIDR blocks",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Use 10.10.0.0/16 for production."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Use 10.20.0.0/16 for development."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Use 10.30.0.0/16 for shared services."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Keep 10.40.0.0/16 to 10.99.0.0/16 spare for future accounts."
          }
        ],
        "note": "A /16 gives each account VPC 65,536 IPv4 addresses before AWS reservations.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Split each VPC by environment",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "For production, use 10.10.0.0/20 for web workloads."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Use 10.10.16.0/20 for app workloads."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Use 10.10.32.0/20 for data workloads."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Keep unused /20 blocks for future growth."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Split each environment across 2 AZs",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Use 10.10.0.0/24 for public subnet AZ A."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Use 10.10.1.0/24 for public subnet AZ B."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Use 10.10.10.0/24 for private app subnet AZ A."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Use 10.10.11.0/24 for private app subnet AZ B."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Use 10.10.20.0/24 for private data subnet AZ A."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Use 10.10.21.0/24 for private data subnet AZ B."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Add IPv6 planning rules",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Use Amazon-provided IPv6 for normal learning labs."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Assign one IPv6 /64 to each subnet."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Use an egress-only internet gateway for outbound-only IPv6 from private subnets."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Do not treat IPv6 as private just because the subnet is named private."
          }
        ],
        "note": null,
        "warning": "IPv6 addresses are public by design. Security groups and route tables must protect them.",
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Write the final plan",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Create a small table with Account, Region, VPC CIDR, Subnet name, AZ, IPv4 CIDR, and IPv6 CIDR."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Mark public subnets as internet-routable."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Mark private subnets as NAT or egress-only routed."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Save the plan before creating resources."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
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
        "title": "Set the Region",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "set AWS_REGION=eu-west-2"
          }
        ],
        "note": "PowerShell users can use $env:AWS_REGION='eu-west-2'.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "List existing VPC CIDRs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-vpcs --region eu-west-2 --query \"Vpcs[*].{VpcId:VpcId,CidrBlock:CidrBlock,Ipv6:Ipv6CidrBlockAssociationSet[*].Ipv6CidrBlock}\" --output table"
          }
        ],
        "note": "Expected: you can see current VPC CIDRs and avoid overlap.",
        "warning": null,
        "expectedResult": "Expected: you can see current VPC CIDRs and avoid overlap."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "List subnets and CIDRs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-subnets --region eu-west-2 --query \"Subnets[*].{SubnetId:SubnetId,VpcId:VpcId,AZ:AvailabilityZone,IPv4:CidrBlock,IPv6:Ipv6CidrBlockAssociationSet[*].Ipv6CidrBlock}\" --output table"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create a local CIDR plan file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "@'\nAccount,Region,VPC,Subnet,AZ,IPv4,IPv6\nprod,eu-west-2,10.10.0.0/16,public-a,eu-west-2a,10.10.0.0/24,/64\nprod,eu-west-2,10.10.0.0/16,public-b,eu-west-2b,10.10.1.0/24,/64\nprod,eu-west-2,10.10.0.0/16,private-app-a,eu-west-2a,10.10.10.0/24,/64\nprod,eu-west-2,10.10.0.0/16,private-app-b,eu-west-2b,10.10.11.0/24,/64\n'@ | Out-File -Encoding utf8 vpc-cidr-plan.csv"
          }
        ],
        "note": "Expected: a local file named vpc-cidr-plan.csv is created.",
        "warning": null,
        "expectedResult": "Expected: a local file named vpc-cidr-plan.csv is created."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up local planning file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "del vpc-cidr-plan.csv"
          }
        ],
        "note": "This deletes only the local planning file.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Best starting private range",
        "body": "Use 10.0.0.0/8 for a large organisation plan."
      },
      {
        "id": "cs-2",
        "title": "Avoid overlap",
        "body": "Overlapping CIDRs break clean routing between networks."
      },
      {
        "id": "cs-3",
        "title": "Public subnet",
        "body": "A public subnet has a route to an internet gateway."
      },
      {
        "id": "cs-4",
        "title": "Private subnet",
        "body": "A private subnet has no direct route to an internet gateway."
      },
      {
        "id": "cs-5",
        "title": "IPv6 private subnet trap",
        "body": "IPv6 can still be public unless routing and security rules block it."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "CIDR overlap",
        "body": "Choose a different /16 for the account or VPC."
      },
      {
        "id": "ts-2",
        "title": "Too many small subnets",
        "body": "Use larger blocks, such as /20 per workload area."
      },
      {
        "id": "ts-3",
        "title": "No future space",
        "body": "Reserve empty CIDR blocks before creating more VPCs."
      },
      {
        "id": "ts-4",
        "title": "IPv6 confusion",
        "body": "Remember that IPv6 does not use NAT Gateway for normal outbound internet access."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "VPC peering overlap",
        "body": "Overlapping CIDRs cannot be routed cleanly through VPC peering."
      },
      {
        "id": "trap-2",
        "title": "Private name is not security",
        "body": "A subnet is private because of route tables, not because of its name."
      },
      {
        "id": "trap-3",
        "title": "IPv6 and NAT",
        "body": "NAT Gateway is for IPv4. Use egress-only internet gateway for outbound-only IPv6."
      },
      {
        "id": "trap-4",
        "title": "CIDR planning first",
        "body": "Fixing bad CIDR design later is harder than planning it first."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Plan before you peer: If CIDRs overlap, networks cannot talk cleanly.",
    "flashcardSetId": "vpc_task_1_flashcards"
  },
  {
    "id": "task-saa-vpc-create-a-2-az-vpc-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Create a 2-AZ VPC",
    "slug": "create-a-2-az-vpc",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create one VPC with two public subnets and two private subnets across two Availability Zones.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "VPC",
        "body": "A VPC is your private network space inside AWS."
      },
      {
        "id": "concept-2",
        "title": "Availability Zone",
        "body": "An AZ is a separate data centre area inside a Region."
      },
      {
        "id": "concept-3",
        "title": "Public subnet",
        "body": "A public subnet becomes public when its route table sends internet traffic to an internet gateway."
      },
      {
        "id": "concept-4",
        "title": "Private subnet",
        "body": "A private subnet has no direct route to an internet gateway."
      }
    ],
    "whyItMatters": "Most AWS architectures use at least two AZs so applications can survive one AZ problem.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC name",
        "value": "saa-vpc-task2-main"
      },
      {
        "label": "VPC IPv4 CIDR",
        "value": "10.20.0.0/16"
      },
      {
        "label": "Public subnet A",
        "value": "10.20.0.0/24 in eu-west-2a"
      },
      {
        "label": "Public subnet B",
        "value": "10.20.1.0/24 in eu-west-2b"
      },
      {
        "label": "Private subnet A",
        "value": "10.20.10.0/24 in eu-west-2a"
      },
      {
        "label": "Private subnet B",
        "value": "10.20.11.0/24 in eu-west-2b"
      },
      {
        "label": "Required permissions summary",
        "value": "Create and tag a VPC, create subnets, describe AZs, and clean up created VPC resources."
      }
    ],
    "costWarning": "A VPC, route tables, and subnets do not normally cost money by themselves. Costs start when you add resources such as EC2, NAT Gateway, VPN, endpoints, or traffic.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
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
            "text": "VPC setup: ec2:CreateVpc, ec2:DescribeVpcs, ec2:ModifyVpcAttribute"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Subnet setup: ec2:CreateSubnet, ec2:DescribeSubnets, ec2:ModifySubnetAttribute"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Routing read checks: ec2:DescribeRouteTables, ec2:DescribeAvailabilityZones"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Tags: ec2:CreateTags, ec2:DeleteTags"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Cleanup: ec2:DeleteSubnet, ec2:DeleteVpc"
          }
        ],
        "note": null,
        "warning": "Do not create this lab inside a production VPC.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the VPC console",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Set the Region to eu-west-2."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the VPC",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Create VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose VPC only."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name tag: saa-vpc-task2-main."
          },
          {
            "id": "console-step-3-item-4",
            "text": "IPv4 CIDR: 10.20.0.0/16."
          },
          {
            "id": "console-step-3-item-5",
            "text": "IPv6 CIDR block: choose No IPv6 CIDR block for this task."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Tenancy: Default."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose Create VPC."
          }
        ],
        "note": "This task focuses on IPv4 subnet layout. IPv6 is added in later design tasks.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Enable DNS support",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the VPC."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Edit VPC settings or Edit DNS settings."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Enable DNS resolution."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Enable DNS hostnames."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Save the changes."
          }
        ],
        "note": "DNS hostnames help EC2 instances get useful public DNS names later.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create public subnet A",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Go to Subnets."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Create subnet."
          },
          {
            "id": "console-step-5-item-3",
            "text": "VPC ID: choose saa-vpc-task2-main."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Subnet name: saa-vpc-task2-public-a."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Availability Zone: eu-west-2a."
          },
          {
            "id": "console-step-5-item-6",
            "text": "IPv4 subnet CIDR block: 10.20.0.0/24."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Choose Create subnet."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create public subnet B",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Choose Create subnet."
          },
          {
            "id": "console-step-6-item-2",
            "text": "VPC ID: choose saa-vpc-task2-main."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Subnet name: saa-vpc-task2-public-b."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Availability Zone: eu-west-2b."
          },
          {
            "id": "console-step-6-item-5",
            "text": "IPv4 subnet CIDR block: 10.20.1.0/24."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose Create subnet."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Create private subnet A",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Choose Create subnet."
          },
          {
            "id": "console-step-7-item-2",
            "text": "VPC ID: choose saa-vpc-task2-main."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Subnet name: saa-vpc-task2-private-a."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Availability Zone: eu-west-2a."
          },
          {
            "id": "console-step-7-item-5",
            "text": "IPv4 subnet CIDR block: 10.20.10.0/24."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Choose Create subnet."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Create private subnet B",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Choose Create subnet."
          },
          {
            "id": "console-step-8-item-2",
            "text": "VPC ID: choose saa-vpc-task2-main."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Subnet name: saa-vpc-task2-private-b."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Availability Zone: eu-west-2b."
          },
          {
            "id": "console-step-8-item-5",
            "text": "IPv4 subnet CIDR block: 10.20.11.0/24."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Choose Create subnet."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Turn on auto-assign public IPv4 for public subnets",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Select saa-vpc-task2-public-a."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Choose Edit subnet settings."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Turn on Auto-assign public IPv4 address."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Save."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Repeat for saa-vpc-task2-public-b."
          }
        ],
        "note": null,
        "warning": "Do not turn this on for private subnets.",
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Verify subnet placement",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Open Subnets."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Confirm the four subnet names exist."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Confirm two subnets are in eu-west-2a."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Confirm two subnets are in eu-west-2b."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Confirm the CIDR blocks match the chosen values."
          }
        ],
        "note": null,
        "warning": null,
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
            "text": "set AWS_REGION=eu-west-2\nset VPC_NAME=saa-vpc-task2-main"
          }
        ],
        "note": "PowerShell users can use $env:AWS_REGION='eu-west-2'.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the VPC",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-vpc --region eu-west-2 --cidr-block 10.20.0.0/16 --tag-specifications \"ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-task2-main}]\" --query \"Vpc.VpcId\" --output text"
          }
        ],
        "note": "Copy the VPC ID returned.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Save the VPC ID",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "set VPC_ID=vpc-xxxxxxxxxxxxxxxxx"
          }
        ],
        "note": "Replace the example with your real VPC ID.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Enable DNS support and hostnames",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 modify-vpc-attribute --region eu-west-2 --vpc-id %VPC_ID% --enable-dns-support \"{\\\"Value\\\":true}\""
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "aws ec2 modify-vpc-attribute --region eu-west-2 --vpc-id %VPC_ID% --enable-dns-hostnames \"{\\\"Value\\\":true}\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the four subnets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-subnet --region eu-west-2 --vpc-id %VPC_ID% --availability-zone eu-west-2a --cidr-block 10.20.0.0/24 --tag-specifications \"ResourceType=subnet,Tags=[{Key=Name,Value=saa-vpc-task2-public-a}]\""
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws ec2 create-subnet --region eu-west-2 --vpc-id %VPC_ID% --availability-zone eu-west-2b --cidr-block 10.20.1.0/24 --tag-specifications \"ResourceType=subnet,Tags=[{Key=Name,Value=saa-vpc-task2-public-b}]\""
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws ec2 create-subnet --region eu-west-2 --vpc-id %VPC_ID% --availability-zone eu-west-2a --cidr-block 10.20.10.0/24 --tag-specifications \"ResourceType=subnet,Tags=[{Key=Name,Value=saa-vpc-task2-private-a}]\""
          },
          {
            "id": "cli-step-6-cmd-4",
            "language": "bash",
            "text": "aws ec2 create-subnet --region eu-west-2 --vpc-id %VPC_ID% --availability-zone eu-west-2b --cidr-block 10.20.11.0/24 --tag-specifications \"ResourceType=subnet,Tags=[{Key=Name,Value=saa-vpc-task2-private-b}]\""
          }
        ],
        "note": "Expected: each command returns a Subnet object.",
        "warning": null,
        "expectedResult": "Expected: each command returns a Subnet object."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Get public subnet IDs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-subnets --region eu-west-2 --filters \"Name=vpc-id,Values=%VPC_ID%\" \"Name=tag:Name,Values=saa-vpc-task2-public-*\" --query \"Subnets[*].[SubnetId,Tags[?Key=='Name'].Value|[0]]\" --output table"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Enable public IPv4 on the public subnets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws ec2 modify-subnet-attribute --region eu-west-2 --subnet-id subnet-public-a-id --map-public-ip-on-launch\naws ec2 modify-subnet-attribute --region eu-west-2 --subnet-id subnet-public-b-id --map-public-ip-on-launch"
          }
        ],
        "note": "Replace both subnet IDs with your real public subnet IDs.",
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Verify the VPC and subnets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-subnets --region eu-west-2 --filters \"Name=vpc-id,Values=%VPC_ID%\" --query \"Subnets[*].{Name:Tags[?Key=='Name'].Value|[0],AZ:AvailabilityZone,CIDR:CidrBlock,PublicIP:MapPublicIpOnLaunch}\" --output table"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 9 executed successfully."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Tear down subnets and VPC",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-subnet --region eu-west-2 --subnet-id subnet-public-a-id"
          },
          {
            "id": "cli-step-10-cmd-2",
            "language": "bash",
            "text": "aws ec2 delete-subnet --region eu-west-2 --subnet-id subnet-public-b-id"
          },
          {
            "id": "cli-step-10-cmd-3",
            "language": "bash",
            "text": "aws ec2 delete-subnet --region eu-west-2 --subnet-id subnet-private-a-id"
          },
          {
            "id": "cli-step-10-cmd-4",
            "language": "bash",
            "text": "aws ec2 delete-subnet --region eu-west-2 --subnet-id subnet-private-b-id"
          },
          {
            "id": "cli-step-10-cmd-5",
            "language": "bash",
            "text": "aws ec2 delete-vpc --region eu-west-2 --vpc-id %VPC_ID%"
          }
        ],
        "note": "Only run cleanup after you finish testing.",
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 10 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "VPC",
        "body": "The network container for your AWS resources."
      },
      {
        "id": "cs-2",
        "title": "Subnet",
        "body": "A smaller IP range inside one VPC and one AZ."
      },
      {
        "id": "cs-3",
        "title": "2 AZ design",
        "body": "Improves availability compared with one AZ."
      },
      {
        "id": "cs-4",
        "title": "Auto-assign public IPv4",
        "body": "Useful for public EC2 instances in public subnets."
      },
      {
        "id": "cs-5",
        "title": "Private subnet",
        "body": "Do not auto-assign public IPv4."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "InvalidSubnet.Range",
        "body": "The subnet CIDR is outside the VPC CIDR."
      },
      {
        "id": "ts-2",
        "title": "Overlapping CIDR",
        "body": "The new subnet overlaps an existing subnet."
      },
      {
        "id": "ts-3",
        "title": "Unsupported AZ name",
        "body": "Your account may map AZ names differently. Choose another listed AZ."
      },
      {
        "id": "ts-4",
        "title": "Cannot delete VPC",
        "body": "Delete subnets and dependent resources first."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Subnet equals one AZ",
        "body": "A subnet cannot span multiple AZs."
      },
      {
        "id": "trap-2",
        "title": "Public subnet needs routing",
        "body": "Auto public IP alone does not make a subnet public."
      },
      {
        "id": "trap-3",
        "title": "VPC is Regional",
        "body": "A VPC spans AZs in one Region."
      },
      {
        "id": "trap-4",
        "title": "Private subnet naming",
        "body": "A subnet name does not control routing."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "VPC is the house. Subnets are rooms. AZs are separate buildings.",
    "flashcardSetId": "vpc_task_2_flashcards"
  },
  {
    "id": "task-saa-vpc-attach-an-internet-gateway-003",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Attach an Internet Gateway",
    "slug": "attach-an-internet-gateway",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Attach an Internet Gateway to a VPC and confirm a public EC2 instance can reach the internet.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Internet Gateway",
        "body": "An Internet Gateway connects a VPC to the public internet."
      },
      {
        "id": "concept-2",
        "title": "Public subnet",
        "body": "A subnet is public when its route table has a route to an Internet Gateway."
      },
      {
        "id": "concept-3",
        "title": "Public EC2 instance",
        "body": "The instance needs a public IPv4 address or Elastic IP to be reachable from the internet."
      },
      {
        "id": "concept-4",
        "title": "Security group",
        "body": "Security groups control allowed inbound and outbound traffic."
      }
    ],
    "whyItMatters": "Public web servers need an Internet Gateway route, a public IP, and correct security group rules.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC name",
        "value": "saa-vpc-task3-main"
      },
      {
        "label": "VPC CIDR",
        "value": "10.30.0.0/16"
      },
      {
        "label": "Public subnet",
        "value": "10.30.0.0/24 in eu-west-2a"
      },
      {
        "label": "Test instance",
        "value": "Amazon Linux 2023, t3.micro"
      },
      {
        "label": "Allowed inbound",
        "value": "SSH from your IP only"
      },
      {
        "label": "Required permissions summary",
        "value": "Create VPC networking, create an internet gateway, launch a test EC2 instance, connect, verify outbound access, and clean up."
      }
    ],
    "costWarning": "This lab can create small EC2 and public IPv4 charges. Delete the instance, Internet Gateway, and VPC resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
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
            "text": "VPC setup: ec2:CreateVpc, ec2:DescribeVpcs, ec2:ModifyVpcAttribute"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Subnet setup: ec2:CreateSubnet, ec2:DescribeSubnets, ec2:ModifySubnetAttribute"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Routing: ec2:CreateRouteTable, ec2:CreateRoute, ec2:AssociateRouteTable, ec2:DescribeRouteTables"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Internet Gateway: ec2:CreateInternetGateway, ec2:AttachInternetGateway, ec2:DescribeInternetGateways, ec2:DetachInternetGateway, ec2:DeleteInternetGateway"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Security group: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:DescribeSecurityGroups"
          },
          {
            "id": "console-step-1-item-11",
            "text": "EC2 test instance: ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances, ec2:CreateKeyPair, ec2:DeleteKeyPair"
          },
          {
            "id": "console-step-1-item-12",
            "text": "Tags: ec2:CreateTags, ec2:DeleteTags"
          },
          {
            "id": "console-step-1-item-13",
            "text": "Cleanup: ec2:TerminateInstances, ec2:DeleteSecurityGroup, ec2:DeleteRouteTable, ec2:DeleteSubnet, ec2:DeleteVpc"
          }
        ],
        "note": null,
        "warning": "SSH must be limited to your IP, not the whole internet.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the VPC",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose VPC only."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name tag: saa-vpc-task3-main."
          },
          {
            "id": "console-step-2-item-5",
            "text": "IPv4 CIDR: 10.30.0.0/16."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create VPC."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a public subnet",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Subnets."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create subnet."
          },
          {
            "id": "console-step-3-item-3",
            "text": "VPC: saa-vpc-task3-main."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Subnet name: saa-vpc-task3-public-a."
          },
          {
            "id": "console-step-3-item-5",
            "text": "AZ: eu-west-2a."
          },
          {
            "id": "console-step-3-item-6",
            "text": "CIDR: 10.30.0.0/24."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Create the subnet."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Edit subnet settings and enable Auto-assign public IPv4 address."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create and attach the Internet Gateway",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Internet gateways."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create internet gateway."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name: saa-vpc-task3-igw."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Create internet gateway."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose Attach to VPC."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Select saa-vpc-task3-main."
          }
        ],
        "note": "The IGW does nothing until the subnet route table points to it.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the public route table",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Route tables."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Create route table."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Name: saa-vpc-task3-public-rt."
          },
          {
            "id": "console-step-5-item-4",
            "text": "VPC: saa-vpc-task3-main."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Create it."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Open the route table."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Choose Routes."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Choose Edit routes."
          },
          {
            "id": "console-step-5-item-9",
            "text": "Add route: 0.0.0.0/0 target Internet Gateway saa-vpc-task3-igw."
          },
          {
            "id": "console-step-5-item-10",
            "text": "Save changes."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Associate the public subnet",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the route table."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Subnet associations."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Edit subnet associations."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Select saa-vpc-task3-public-a."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Save associations."
          }
        ],
        "note": "This makes the subnet public.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Create a security group for SSH",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open Security groups."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Name: saa-vpc-task3-ssh-sg."
          },
          {
            "id": "console-step-7-item-4",
            "text": "VPC: saa-vpc-task3-main."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Inbound rule: SSH, port 22, source My IP."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Outbound rule: keep default allow all."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Create the security group."
          }
        ],
        "note": null,
        "warning": "Do not use 0.0.0.0/0 for SSH in a real account.",
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Launch the public EC2 instance",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Choose Launch instance."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Name: saa-vpc-task3-public-test."
          },
          {
            "id": "console-step-8-item-4",
            "text": "AMI: Amazon Linux 2023."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Instance type: t3.micro."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Key pair: create or choose a test key pair."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Network: saa-vpc-task3-main."
          },
          {
            "id": "console-step-8-item-8",
            "text": "Subnet: saa-vpc-task3-public-a."
          },
          {
            "id": "console-step-8-item-9",
            "text": "Auto-assign public IP: Enable."
          },
          {
            "id": "console-step-8-item-10",
            "text": "Security group: saa-vpc-task3-ssh-sg."
          },
          {
            "id": "console-step-8-item-11",
            "text": "Launch the instance."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Test outbound internet access",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Connect using EC2 Instance Connect or SSH."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Run curl https://aws.amazon.com."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Expected: HTML output or an HTTP response appears."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Run sudo dnf update -y if you want a package test."
          }
        ],
        "note": "Outbound works because the instance has a public IP and the subnet routes to the IGW.",
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
            "text": "Terminate saa-vpc-task3-public-test."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Wait until the instance is terminated."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Delete saa-vpc-task3-ssh-sg."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Remove the 0.0.0.0/0 route if needed."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Delete saa-vpc-task3-public-rt."
          },
          {
            "id": "console-step-10-item-6",
            "text": "Detach and delete saa-vpc-task3-igw."
          },
          {
            "id": "console-step-10-item-7",
            "text": "Delete the subnet."
          },
          {
            "id": "console-step-10-item-8",
            "text": "Delete the VPC."
          },
          {
            "id": "console-step-10-item-9",
            "text": "Delete the test key pair if created."
          }
        ],
        "note": null,
        "warning": "Security Warning: Opening SSH (port 22) or RDP (port 3389) to 0.0.0.0/0 allows access from any IP address worldwide. In production, restrict inbound traffic to your specific public IP address (/32) or use AWS Systems Manager Session Manager.",
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
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 1 executed successfully."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create VPC and subnet",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-vpc --region eu-west-2 --cidr-block 10.30.0.0/16 --tag-specifications \"ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-task3-main}]\" --query \"Vpc.VpcId\" --output text"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "set VPC_ID=vpc-xxxxxxxxxxxxxxxxx"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "aws ec2 create-subnet --region eu-west-2 --vpc-id %VPC_ID% --availability-zone eu-west-2a --cidr-block 10.30.0.0/24 --tag-specifications \"ResourceType=subnet,Tags=[{Key=Name,Value=saa-vpc-task3-public-a}]\" --query \"Subnet.SubnetId\" --output text"
          }
        ],
        "note": "Replace IDs with the returned values.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Enable public IPv4 on launch",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "set SUBNET_ID=subnet-xxxxxxxxxxxxxxxxx\naws ec2 modify-subnet-attribute --region eu-west-2 --subnet-id %SUBNET_ID% --map-public-ip-on-launch"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create and attach the Internet Gateway",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-internet-gateway --region eu-west-2 --tag-specifications \"ResourceType=internet-gateway,Tags=[{Key=Name,Value=saa-vpc-task3-igw}]\" --query \"InternetGateway.InternetGatewayId\" --output text"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "set IGW_ID=igw-xxxxxxxxxxxxxxxxx"
          },
          {
            "id": "cli-step-4-cmd-3",
            "language": "bash",
            "text": "aws ec2 attach-internet-gateway --region eu-west-2 --internet-gateway-id %IGW_ID% --vpc-id %VPC_ID%"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create route table and public route",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-route-table --region eu-west-2 --vpc-id %VPC_ID% --tag-specifications \"ResourceType=route-table,Tags=[{Key=Name,Value=saa-vpc-task3-public-rt}]\" --query \"RouteTable.RouteTableId\" --output text"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "set RTB_ID=rtb-xxxxxxxxxxxxxxxxx"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "aws ec2 create-route --region eu-west-2 --route-table-id %RTB_ID% --destination-cidr-block 0.0.0.0/0 --gateway-id %IGW_ID%"
          },
          {
            "id": "cli-step-5-cmd-4",
            "language": "bash",
            "text": "aws ec2 associate-route-table --region eu-west-2 --route-table-id %RTB_ID% --subnet-id %SUBNET_ID%"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify the route",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-route-tables --region eu-west-2 --route-table-ids %RTB_ID% --query \"RouteTables[*].Routes\" --output table"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 detach-internet-gateway --region eu-west-2 --internet-gateway-id %IGW_ID% --vpc-id %VPC_ID%"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws ec2 delete-internet-gateway --region eu-west-2 --internet-gateway-id %IGW_ID%"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "aws ec2 delete-subnet --region eu-west-2 --subnet-id %SUBNET_ID%"
          },
          {
            "id": "cli-step-7-cmd-4",
            "language": "bash",
            "text": "aws ec2 delete-vpc --region eu-west-2 --vpc-id %VPC_ID%"
          }
        ],
        "note": "Terminate any EC2 instance before deleting network resources.",
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Release the Elastic IP address to prevent unattached public IPv4 hourly charges."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "IGW role",
        "body": "Connects VPC traffic to the internet."
      },
      {
        "id": "cs-2",
        "title": "Public subnet rule",
        "body": "Needs route 0.0.0.0/0 → IGW."
      },
      {
        "id": "cs-3",
        "title": "Public IP",
        "body": "The EC2 instance needs a public IPv4 or Elastic IP."
      },
      {
        "id": "cs-4",
        "title": "Security group outbound",
        "body": "Default outbound allow lets the instance reach websites."
      },
      {
        "id": "cs-5",
        "title": "Inbound SSH",
        "body": "Limit SSH to your IP."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No internet access",
        "body": "Check public IP, route table, IGW attachment, and security group outbound."
      },
      {
        "id": "ts-2",
        "title": "SSH fails",
        "body": "Check key pair, source IP, security group inbound, and instance public IP."
      },
      {
        "id": "ts-3",
        "title": "Route creation fails",
        "body": "Confirm the IGW is attached to the same VPC."
      },
      {
        "id": "ts-4",
        "title": "Cannot delete VPC",
        "body": "Terminate instances and delete attached resources first."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "IGW alone is not enough",
        "body": "The subnet route table must point to the IGW."
      },
      {
        "id": "trap-2",
        "title": "Public IP still required",
        "body": "A route to IGW does not give an instance a public IP."
      },
      {
        "id": "trap-3",
        "title": "Security groups are stateful",
        "body": "Return traffic is automatically allowed for allowed connections."
      },
      {
        "id": "trap-4",
        "title": "Private subnet difference",
        "body": "Private subnets do not route directly to an IGW."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Public subnet = public route. The route table makes it public.",
    "flashcardSetId": "vpc_task_3_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-a-nat-gateway-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure a NAT Gateway",
    "slug": "configure-a-nat-gateway",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a NAT Gateway in a public subnet and confirm a private subnet instance can reach the internet outbound.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "NAT Gateway",
        "body": "Lets private IPv4 resources start outbound internet connections."
      },
      {
        "id": "concept-2",
        "title": "Public subnet placement",
        "body": "A public NAT Gateway must be in a public subnet."
      },
      {
        "id": "concept-3",
        "title": "Elastic IP",
        "body": "A public NAT Gateway needs an Elastic IP address."
      },
      {
        "id": "concept-4",
        "title": "Private route",
        "body": "Private subnet default route points to the NAT Gateway."
      }
    ],
    "whyItMatters": "Private instances often need software updates or API access without being directly reachable from the internet.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC name",
        "value": "saa-vpc-task4-main"
      },
      {
        "label": "VPC CIDR",
        "value": "10.40.0.0/16"
      },
      {
        "label": "Public subnet",
        "value": "10.40.0.0/24 in eu-west-2a"
      },
      {
        "label": "Private subnet",
        "value": "10.40.10.0/24 in eu-west-2a"
      },
      {
        "label": "Test instance",
        "value": "Amazon Linux 2023, t3.micro in private subnet"
      },
      {
        "label": "Required permissions summary",
        "value": "Create VPC networking, allocate Elastic IP, create NAT Gateway, launch a private test instance, verify routing, and clean up."
      }
    ],
    "costWarning": "NAT Gateways have hourly and data processing charges. EC2 instances and public IPv4 addresses can also create charges. Delete everything after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
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
            "text": "VPC setup: ec2:CreateVpc, ec2:DescribeVpcs, ec2:ModifyVpcAttribute"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Subnet setup: ec2:CreateSubnet, ec2:DescribeSubnets, ec2:ModifySubnetAttribute"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Routing: ec2:CreateRouteTable, ec2:CreateRoute, ec2:AssociateRouteTable, ec2:DescribeRouteTables"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Internet Gateway: ec2:CreateInternetGateway, ec2:AttachInternetGateway, ec2:DetachInternetGateway, ec2:DeleteInternetGateway"
          },
          {
            "id": "console-step-1-item-10",
            "text": "NAT Gateway: ec2:CreateNatGateway, ec2:DescribeNatGateways, ec2:DeleteNatGateway"
          },
          {
            "id": "console-step-1-item-11",
            "text": "Elastic IP: ec2:AllocateAddress, ec2:DescribeAddresses, ec2:ReleaseAddress"
          },
          {
            "id": "console-step-1-item-12",
            "text": "EC2 test instance: ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-13",
            "text": "Tags: ec2:CreateTags, ec2:DeleteTags"
          },
          {
            "id": "console-step-1-item-14",
            "text": "Cleanup: ec2:DeleteNatGateway, ec2:ReleaseAddress, ec2:DeleteRouteTable, ec2:DeleteSubnet, ec2:DeleteVpc"
          }
        ],
        "note": null,
        "warning": "NAT Gateway costs continue while it exists.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the VPC and two subnets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Create VPC saa-vpc-task4-main with CIDR 10.40.0.0/16."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create public subnet saa-vpc-task4-public-a with CIDR 10.40.0.0/24."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create private subnet saa-vpc-task4-private-a with CIDR 10.40.10.0/24."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Enable auto-assign public IPv4 only on the public subnet."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the Internet Gateway and public route",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create Internet Gateway saa-vpc-task4-igw."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Attach it to saa-vpc-task4-main."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create route table saa-vpc-task4-public-rt."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Add route 0.0.0.0/0 → saa-vpc-task4-igw."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Associate it with saa-vpc-task4-public-a."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the NAT Gateway",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open NAT gateways."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create NAT gateway."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name: saa-vpc-task4-nat-a."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Subnet: saa-vpc-task4-public-a."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Connectivity type: Public."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Elastic IP allocation ID: choose Allocate Elastic IP."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Choose Create NAT gateway."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Wait until the NAT Gateway state is Available."
          }
        ],
        "note": null,
        "warning": "Do not continue until the NAT Gateway is Available.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the private route table",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Route tables."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Create route table saa-vpc-task4-private-rt in the VPC."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Add route 0.0.0.0/0 target NAT Gateway saa-vpc-task4-nat-a."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Associate this route table with saa-vpc-task4-private-a."
          }
        ],
        "note": "The private subnet now has outbound IPv4 internet access.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Launch a private test instance",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Launch Amazon Linux 2023 instance named saa-vpc-task4-private-test."
          },
          {
            "id": "console-step-6-item-3",
            "text": "VPC: saa-vpc-task4-main."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Subnet: saa-vpc-task4-private-a."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Auto-assign public IP: Disabled."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Use a security group with default outbound allow."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Connect using Session Manager if your lab role supports it, or use a temporary bastion if needed."
          }
        ],
        "note": "The private instance should not have a public IPv4 address.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Validate outbound access",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "From the private instance, run curl https://aws.amazon.com."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Run sudo dnf update -y."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Expected: outbound traffic works."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Check that no inbound internet path exists to the private instance."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Terminate the private EC2 instance."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Delete the private route table route to the NAT Gateway if needed."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Delete the NAT Gateway."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Wait until the NAT Gateway is deleted."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Release the Elastic IP."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Delete route tables."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Detach and delete the Internet Gateway."
          },
          {
            "id": "console-step-8-item-8",
            "text": "Delete subnets."
          },
          {
            "id": "console-step-8-item-9",
            "text": "Delete the VPC."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
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
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 1 executed successfully."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create NAT Gateway prerequisites",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "# Create the VPC, public subnet, private subnet, IGW, and public route first.\n# You can reuse the CLI pattern from VPC Task 3."
          }
        ],
        "note": "This keeps the NAT command section focused.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Allocate an Elastic IP",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 allocate-address --region eu-west-2 --domain vpc --query \"AllocationId\" --output text"
          }
        ],
        "note": "Copy the allocation ID.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the NAT Gateway",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "set ALLOC_ID=eipalloc-xxxxxxxxxxxxxxxxx\nset PUBLIC_SUBNET_ID=subnet-publicxxxxxxxx\naws ec2 create-nat-gateway --region eu-west-2 --subnet-id %PUBLIC_SUBNET_ID% --allocation-id %ALLOC_ID% --tag-specifications \"ResourceType=natgateway,Tags=[{Key=Name,Value=saa-vpc-task4-nat-a}]\" --query \"NatGateway.NatGatewayId\" --output text"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Wait for NAT Gateway availability",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "set NAT_ID=nat-xxxxxxxxxxxxxxxxx\naws ec2 wait nat-gateway-available --region eu-west-2 --nat-gateway-ids %NAT_ID%"
          }
        ],
        "note": "Expected: command returns when the NAT Gateway is ready.",
        "warning": null,
        "expectedResult": "Expected: command returns when the NAT Gateway is ready."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create private route to NAT Gateway",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "set PRIVATE_RTB_ID=rtb-privatexxxxxxxx\naws ec2 create-route --region eu-west-2 --route-table-id %PRIVATE_RTB_ID% --destination-cidr-block 0.0.0.0/0 --nat-gateway-id %NAT_ID%"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Verify NAT route",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-route-tables --region eu-west-2 --route-table-ids %PRIVATE_RTB_ID% --query \"RouteTables[*].Routes\" --output table"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Delete NAT Gateway and release Elastic IP",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-nat-gateway --region eu-west-2 --nat-gateway-id %NAT_ID%"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait nat-gateway-deleted --region eu-west-2 --nat-gateway-ids %NAT_ID%"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "aws ec2 release-address --region eu-west-2 --allocation-id %ALLOC_ID%"
          }
        ],
        "note": "Delete dependent routes and VPC resources after this.",
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 8 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "NAT Gateway purpose",
        "body": "Outbound IPv4 internet for private subnets."
      },
      {
        "id": "cs-2",
        "title": "Placement",
        "body": "Put a public NAT Gateway in a public subnet."
      },
      {
        "id": "cs-3",
        "title": "Route path",
        "body": "Private subnet → NAT Gateway → IGW → internet."
      },
      {
        "id": "cs-4",
        "title": "Inbound protection",
        "body": "NAT does not allow unsolicited inbound internet traffic."
      },
      {
        "id": "cs-5",
        "title": "High availability",
        "body": "Use one NAT Gateway per AZ for resilient production design."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "NAT Gateway pending",
        "body": "Wait until state is Available before routing to it."
      },
      {
        "id": "ts-2",
        "title": "No outbound internet",
        "body": "Check private route table, NAT state, public subnet route, and Elastic IP."
      },
      {
        "id": "ts-3",
        "title": "Wrong subnet",
        "body": "A public NAT Gateway must be in a public subnet."
      },
      {
        "id": "ts-4",
        "title": "Unexpected cost",
        "body": "Delete NAT Gateway and release Elastic IP after the lab."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "NAT is not inbound access",
        "body": "NAT allows outbound starts from private resources only."
      },
      {
        "id": "trap-2",
        "title": "NAT Gateway is AZ-scoped",
        "body": "For high availability, place one NAT Gateway per AZ."
      },
      {
        "id": "trap-3",
        "title": "NAT Gateway needs IGW path",
        "body": "A public NAT Gateway still needs internet access through the public subnet route."
      },
      {
        "id": "trap-4",
        "title": "IPv6 uses egress-only IGW",
        "body": "NAT Gateway is not the normal IPv6 outbound-only answer."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "NAT lets private instances talk out, not let the internet talk in.",
    "flashcardSetId": "vpc_task_4_flashcards"
  },
  {
    "id": "task-saa-vpc-create-a-nat-instance-alternative-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Create a NAT Instance alternative",
    "slug": "create-a-nat-instance-alternative",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Use an EC2 instance as a NAT device for private subnet outbound IPv4 traffic, then compare it with NAT Gateway.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "NAT Instance",
        "body": "An EC2 instance configured to perform network address translation."
      },
      {
        "id": "concept-2",
        "title": "Source/destination check",
        "body": "Must be disabled on a NAT Instance so it can forward traffic."
      },
      {
        "id": "concept-3",
        "title": "Public subnet placement",
        "body": "The NAT Instance must sit in a public subnet with internet access."
      },
      {
        "id": "concept-4",
        "title": "Manual management",
        "body": "You patch, scale, monitor, and recover NAT Instances yourself."
      }
    ],
    "whyItMatters": "NAT Instances can be cheaper for tiny labs, but NAT Gateways are usually better for production because they are managed and scale better.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC name",
        "value": "saa-vpc-task5-main"
      },
      {
        "label": "VPC CIDR",
        "value": "10.50.0.0/16"
      },
      {
        "label": "Public subnet",
        "value": "10.50.0.0/24 in eu-west-2a"
      },
      {
        "label": "Private subnet",
        "value": "10.50.10.0/24 in eu-west-2a"
      },
      {
        "label": "NAT Instance",
        "value": "Amazon Linux 2023, t3.micro, source/destination check disabled"
      },
      {
        "label": "Required permissions summary",
        "value": "Create VPC networking, launch EC2 instances, disable source/destination check, update routes, verify outbound access, and clean up."
      }
    ],
    "costWarning": "This lab can create EC2, EBS, public IPv4, and data transfer charges. NAT Instance may be cheaper than NAT Gateway for tiny labs, but it needs manual management. Delete all resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
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
            "text": "VPC setup: ec2:CreateVpc, ec2:DescribeVpcs, ec2:ModifyVpcAttribute"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Subnet setup: ec2:CreateSubnet, ec2:DescribeSubnets, ec2:ModifySubnetAttribute"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Routing: ec2:CreateRouteTable, ec2:CreateRoute, ec2:AssociateRouteTable, ec2:DescribeRouteTables"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Internet Gateway: ec2:CreateInternetGateway, ec2:AttachInternetGateway, ec2:DetachInternetGateway, ec2:DeleteInternetGateway"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Security group: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:DescribeSecurityGroups, ec2:DeleteSecurityGroup"
          },
          {
            "id": "console-step-1-item-11",
            "text": "EC2 NAT and test instances: ec2:RunInstances, ec2:DescribeInstances, ec2:ModifyInstanceAttribute, ec2:TerminateInstances"
          },
          {
            "id": "console-step-1-item-12",
            "text": "Keys: ec2:CreateKeyPair, ec2:DeleteKeyPair"
          },
          {
            "id": "console-step-1-item-13",
            "text": "Tags: ec2:CreateTags, ec2:DeleteTags"
          },
          {
            "id": "console-step-1-item-14",
            "text": "Cleanup: ec2:TerminateInstances, ec2:DeleteSecurityGroup, ec2:DeleteRouteTable, ec2:DeleteSubnet, ec2:DeleteVpc"
          }
        ],
        "note": null,
        "warning": "A NAT Instance is not the recommended production default.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the VPC layout",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Create VPC saa-vpc-task5-main with CIDR 10.50.0.0/16."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create public subnet saa-vpc-task5-public-a with CIDR 10.50.0.0/24."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create private subnet saa-vpc-task5-private-a with CIDR 10.50.10.0/24."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Attach Internet Gateway saa-vpc-task5-igw."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Create public route table with 0.0.0.0/0 → IGW."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Associate the public subnet with the public route table."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create NAT Instance security group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Security groups."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create saa-vpc-task5-nat-sg in the VPC."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Inbound rule: allow all traffic from 10.50.10.0/24."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Inbound rule: allow SSH from My IP only if needed."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Outbound rule: allow all traffic."
          }
        ],
        "note": null,
        "warning": "Do not allow SSH from the whole internet.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Launch the NAT Instance",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Launch instance."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name: saa-vpc-task5-nat-instance."
          },
          {
            "id": "console-step-4-item-4",
            "text": "AMI: Amazon Linux 2023."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Instance type: t3.micro."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Subnet: saa-vpc-task5-public-a."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Auto-assign public IP: Enable."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Security group: saa-vpc-task5-nat-sg."
          },
          {
            "id": "console-step-4-item-9",
            "text": "Launch the instance."
          }
        ],
        "note": "A real production NAT Instance should be hardened and monitored.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Configure packet forwarding on the NAT Instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to the NAT Instance."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Run sudo sysctl -w net.ipv4.ip_forward=1."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Run sudo sh -c 'echo net.ipv4.ip_forward=1 >> /etc/sysctl.conf'."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Find the network interface name with ip route."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Run sudo dnf install -y iptables-services."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Run sudo iptables -t nat -A POSTROUTING -o ens5 -j MASQUERADE."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Run sudo service iptables save."
          }
        ],
        "note": null,
        "warning": "The interface name may not be ens5. Check it first.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Disable source/destination check",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the NAT Instance in EC2."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Networking."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Change source/destination check."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Turn it off."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Save."
          }
        ],
        "note": "This is required because the instance forwards traffic for other instances.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Route private subnet traffic to the NAT Instance",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open Route tables."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Create route table saa-vpc-task5-private-rt."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Add route 0.0.0.0/0."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Target: choose Instance."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Select saa-vpc-task5-nat-instance."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Associate this route table with saa-vpc-task5-private-a."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Launch private test instance",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Launch Amazon Linux 2023 instance saa-vpc-task5-private-test."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Place it in saa-vpc-task5-private-a."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Disable public IPv4."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Use a security group that allows outbound traffic."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Connect using Session Manager or a temporary bastion method."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Validate outbound access",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "From the private instance, run curl https://aws.amazon.com."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Expected: the request succeeds."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Stop the NAT Instance and test again."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Expected: private outbound access fails."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Start the NAT Instance again if you want to retest."
          }
        ],
        "note": "This shows why NAT Instance availability is your responsibility.",
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Compare with NAT Gateway",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "NAT Gateway is managed by AWS."
          },
          {
            "id": "console-step-10-item-2",
            "text": "NAT Gateway scales better with less admin work."
          },
          {
            "id": "console-step-10-item-3",
            "text": "NAT Instance can be cheaper for small labs."
          },
          {
            "id": "console-step-10-item-4",
            "text": "NAT Instance needs patching, monitoring, scaling, and recovery."
          },
          {
            "id": "console-step-10-item-5",
            "text": "For most exam answers, choose NAT Gateway unless the question clearly asks for lowest cost and accepts self-management."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 10 completed successfully."
      },
      {
        "id": "console-step-11",
        "number": 11,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-11-item-1",
            "text": "Terminate private test instance."
          },
          {
            "id": "console-step-11-item-2",
            "text": "Terminate NAT Instance."
          },
          {
            "id": "console-step-11-item-3",
            "text": "Delete security groups."
          },
          {
            "id": "console-step-11-item-4",
            "text": "Delete private route table."
          },
          {
            "id": "console-step-11-item-5",
            "text": "Delete public route table."
          },
          {
            "id": "console-step-11-item-6",
            "text": "Detach and delete Internet Gateway."
          },
          {
            "id": "console-step-11-item-7",
            "text": "Delete private subnet."
          },
          {
            "id": "console-step-11-item-8",
            "text": "Delete public subnet."
          },
          {
            "id": "console-step-11-item-9",
            "text": "Delete VPC."
          },
          {
            "id": "console-step-11-item-10",
            "text": "Delete key pair if created."
          }
        ],
        "note": null,
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
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 1 executed successfully."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create VPC networking first",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "# Create the VPC, public subnet, private subnet, IGW, and public route first.\n# You can reuse the CLI pattern from VPC Task 3."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Launch the NAT Instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 run-instances --region eu-west-2 --image-id ami-xxxxxxxxxxxxxxxxx --instance-type t3.micro --subnet-id subnet-publicxxxxxxxx --security-group-ids sg-natxxxxxxxx --associate-public-ip-address --tag-specifications \"ResourceType=instance,Tags=[{Key=Name,Value=saa-vpc-task5-nat-instance}]\" --query \"Instances[0].InstanceId\" --output text"
          }
        ],
        "note": "Replace AMI, subnet, and security group IDs with your values.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Disable source/destination check",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "set NAT_INSTANCE_ID=i-xxxxxxxxxxxxxxxxx\naws ec2 modify-instance-attribute --region eu-west-2 --instance-id %NAT_INSTANCE_ID% --no-source-dest-check"
          }
        ],
        "note": "Expected: no output means the setting was accepted.",
        "warning": null,
        "expectedResult": "Expected: no output means the setting was accepted."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Add private route to the NAT Instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "set PRIVATE_RTB_ID=rtb-privatexxxxxxxx\naws ec2 create-route --region eu-west-2 --route-table-id %PRIVATE_RTB_ID% --destination-cidr-block 0.0.0.0/0 --instance-id %NAT_INSTANCE_ID%"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify source/destination check is disabled",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-instances --region eu-west-2 --instance-ids %NAT_INSTANCE_ID% --query \"Reservations[0].Instances[0].SourceDestCheck\" --output text"
          }
        ],
        "note": "Expected: False.",
        "warning": null,
        "expectedResult": "Expected: False."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Verify route points to the NAT Instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-route-tables --region eu-west-2 --route-table-ids %PRIVATE_RTB_ID% --query \"RouteTables[*].Routes\" --output table"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Cleanup NAT Instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws ec2 terminate-instances --region eu-west-2 --instance-ids %NAT_INSTANCE_ID%"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws ec2 wait instance-terminated --region eu-west-2 --instance-ids %NAT_INSTANCE_ID%"
          }
        ],
        "note": "Delete private routes and VPC resources after the instance is terminated.",
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "NAT Instance",
        "body": "EC2-based NAT controlled by you."
      },
      {
        "id": "cs-2",
        "title": "Must disable",
        "body": "Turn off source/destination check."
      },
      {
        "id": "cs-3",
        "title": "Cheaper sometimes",
        "body": "Can be cheaper for tiny, low-traffic labs."
      },
      {
        "id": "cs-4",
        "title": "Less scalable",
        "body": "You manage instance size, failover, patching, and monitoring."
      },
      {
        "id": "cs-5",
        "title": "Exam default",
        "body": "NAT Gateway is usually the best managed answer."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Private instance no internet",
        "body": "Check route table target, NAT Instance security group, ip_forward, and iptables."
      },
      {
        "id": "ts-2",
        "title": "Route target rejected",
        "body": "Check the NAT Instance is running in the same VPC."
      },
      {
        "id": "ts-3",
        "title": "Still blocked",
        "body": "Confirm source/destination check is disabled."
      },
      {
        "id": "ts-4",
        "title": "Works then fails",
        "body": "The NAT Instance may have stopped, crashed, or lost configuration after reboot."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "NAT Instance is not managed",
        "body": "AWS does not patch or scale it for you."
      },
      {
        "id": "trap-2",
        "title": "Source/destination check",
        "body": "Leaving it enabled breaks forwarding."
      },
      {
        "id": "trap-3",
        "title": "NAT Gateway preferred",
        "body": "Choose NAT Gateway for managed availability and scale."
      },
      {
        "id": "trap-4",
        "title": "Cost wording matters",
        "body": "Lowest cost can point to NAT Instance if self-management is acceptable."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "NAT Gateway is managed. NAT Instance is your problem.",
    "flashcardSetId": "vpc_task_5_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-route-tables-for-igw-and-nat-006",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure route tables for IGW and NAT",
    "slug": "configure-route-tables-for-igw-and-nat",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Add a route to an Internet Gateway for public subnets and a route to a NAT Gateway for private subnets.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Public subnet route",
        "body": "A subnet becomes public when its route table sends internet traffic to an Internet Gateway."
      },
      {
        "id": "concept-2",
        "title": "Private subnet route",
        "body": "A private subnet uses a NAT Gateway for outbound internet access. It does not receive new inbound internet connections."
      },
      {
        "id": "concept-3",
        "title": "Route plan",
        "body": "SubnetCIDRRouteTargetpublic-a10.60.1.0/240.0.0.0/0Internet Gatewayprivate-a10.60.11.0/240.0.0.0/0NAT Gateway"
      }
    ],
    "whyItMatters": "Routes decide where traffic goes. This is a core VPC exam skill because public and private subnet behaviour depends on route tables.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC CIDR",
        "value": "10.60.0.0/16"
      },
      {
        "label": "Public subnet",
        "value": "10.60.1.0/24 in eu-west-2a"
      },
      {
        "label": "Private subnet",
        "value": "10.60.11.0/24 in eu-west-2a"
      },
      {
        "label": "Output path",
        "value": "content/SAA/guides/vpc_guides/saa-vpc-task-6.html"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC setup, IGW setup, NAT Gateway setup, route table changes, and cleanup."
      }
    ],
    "costWarning": "This lab can create NAT Gateway and Elastic IP charges. Delete the NAT Gateway and release the Elastic IP after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC setup: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateTags, ec2:DescribeVpcs, ec2:DescribeSubnets Internet access: ec2:CreateInternetGateway, ec2:AttachInternetGateway, ec2:AllocateAddress, ec2:CreateNatGateway, ec2:DescribeNatGateways Route tables: ec2:CreateRouteTable, ec2:CreateRoute, ec2:AssociateRouteTable, ec2:DescribeRouteTables Cleanup: ec2:DeleteNatGateway, ec2:ReleaseAddress, ec2:DisassociateRouteTable, ec2:DeleteRouteTable, ec2:DetachInternetGateway, ec2:DeleteInternetGateway, ec2:DeleteSubnet, ec2:DeleteVpc",
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
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Your VPCs → Create VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose VPC only."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-vpc-task-6."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Use IPv4 CIDR 10.60.0.0/16."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create one public subnet 10.60.1.0/24 in eu-west-2a."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Create one private subnet 10.60.11.0/24 in eu-west-2a."
          }
        ],
        "note": "Use VPC → Subnets → Create subnet for each subnet.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create and attach the Internet Gateway",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC → Internet gateways."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create internet gateway."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name it saa-vpc-task-6-igw."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select it, choose Actions → Attach to VPC."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Attach it to saa-vpc-task-6."
          }
        ],
        "note": "The IGW lets public subnet resources reach the internet when routing and public IPs are correct.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the NAT Gateway",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC → NAT gateways."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create NAT gateway."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name it saa-vpc-task-6-nat."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose the public subnet."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Connectivity type: Public."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Allocate a new Elastic IP."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Choose Create NAT gateway."
          }
        ],
        "note": null,
        "warning": "NAT Gateway starts billing after it is created.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the public route table",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open VPC → Route tables."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Create route table."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Name it saa-vpc-task-6-public-rt."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose the task VPC."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Open Routes → Edit routes."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Add 0.0.0.0/0 with target Internet Gateway."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Associate it with the public subnet."
          }
        ],
        "note": "Public subnet = route to IGW.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the private route table",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Create another route table named saa-vpc-task-6-private-rt."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose the task VPC."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open Routes → Edit routes."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Add 0.0.0.0/0 with target NAT Gateway."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Associate it with the private subnet."
          }
        ],
        "note": "Private subnet = route to NAT Gateway for outbound internet only.",
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
            "text": "Delete the NAT Gateway."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Release the Elastic IP."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Remove route table associations."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete custom route tables."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Detach and delete the Internet Gateway."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the subnets."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete the VPC."
          }
        ],
        "note": "Delete dependent resources first.",
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
        "title": "Create VPC, subnets, IGW, NAT, and route tables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nVPC_ID=$(aws ec2 create-vpc --cidr-block 10.60.0.0/16 --region $REGION --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-task-6}]' --query 'Vpc.VpcId' --output text)\nPUBLIC_SUBNET_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.60.1.0/24 --availability-zone eu-west-2a --region $REGION --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=saa-vpc-task-6-public-a}]' --query 'Subnet.SubnetId' --output text)\nPRIVATE_SUBNET_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.60.11.0/24 --availability-zone eu-west-2a --region $REGION --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=saa-vpc-task-6-private-a}]' --query 'Subnet.SubnetId' --output text)\nIGW_ID=$(aws ec2 create-internet-gateway --region $REGION --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=saa-vpc-task-6-igw}]' --query 'InternetGateway.InternetGatewayId' --output text)\naws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region $REGION\nEIP_ALLOC_ID=$(aws ec2 allocate-address --domain vpc --region $REGION --query 'AllocationId' --output text)\nNAT_ID=$(aws ec2 create-nat-gateway --subnet-id $PUBLIC_SUBNET_ID --allocation-id $EIP_ALLOC_ID --region $REGION --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=saa-vpc-task-6-nat}]' --query 'NatGateway.NatGatewayId' --output text)\naws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_ID --region $REGION\nPUBLIC_RT_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --region $REGION --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=saa-vpc-task-6-public-rt}]' --query 'RouteTable.RouteTableId' --output text)\nPRIVATE_RT_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --region $REGION --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=saa-vpc-task-6-private-rt}]' --query 'RouteTable.RouteTableId' --output text)\naws ec2 create-route --route-table-id $PUBLIC_RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region $REGION\naws ec2 create-route --route-table-id $PRIVATE_RT_ID --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_ID --region $REGION\nPUBLIC_ASSOC_ID=$(aws ec2 associate-route-table --route-table-id $PUBLIC_RT_ID --subnet-id $PUBLIC_SUBNET_ID --region $REGION --query 'AssociationId' --output text)\nPRIVATE_ASSOC_ID=$(aws ec2 associate-route-table --route-table-id $PRIVATE_RT_ID --subnet-id $PRIVATE_SUBNET_ID --region $REGION --query 'AssociationId' --output text)\necho $VPC_ID $PUBLIC_RT_ID $PRIVATE_RT_ID $NAT_ID $IGW_ID $EIP_ALLOC_ID $PUBLIC_ASSOC_ID $PRIVATE_ASSOC_ID"
          }
        ],
        "note": "Expected: the public route table targets the IGW, and the private route table targets the NAT Gateway.",
        "warning": null,
        "expectedResult": "Expected: the public route table targets the IGW, and the private route table targets the NAT Gateway."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Verify routes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-route-tables --filters Name=tag:Name,Values=saa-vpc-task-6-public-rt,saa-vpc-task-6-private-rt --region eu-west-2 --query 'RouteTables[].{Name:Tags[?Key==`Name`].Value|[0],Routes:Routes}'"
          }
        ],
        "note": "Look for GatewayId on the public table and NatGatewayId on the private table.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "# Replace these values if your shell lost the variables.\naws ec2 delete-nat-gateway --nat-gateway-id $NAT_ID --region eu-west-2\naws ec2 wait nat-gateway-deleted --nat-gateway-ids $NAT_ID --region eu-west-2\naws ec2 release-address --allocation-id $EIP_ALLOC_ID --region eu-west-2\naws ec2 disassociate-route-table --association-id $PUBLIC_ASSOC_ID --region eu-west-2\naws ec2 disassociate-route-table --association-id $PRIVATE_ASSOC_ID --region eu-west-2\naws ec2 delete-route-table --route-table-id $PUBLIC_RT_ID --region eu-west-2\naws ec2 delete-route-table --route-table-id $PRIVATE_RT_ID --region eu-west-2\naws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region eu-west-2\naws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region eu-west-2\naws ec2 delete-subnet --subnet-id $PUBLIC_SUBNET_ID --region eu-west-2\naws ec2 delete-subnet --subnet-id $PRIVATE_SUBNET_ID --region eu-west-2\naws ec2 delete-vpc --vpc-id $VPC_ID --region eu-west-2"
          }
        ],
        "note": null,
        "warning": "Delete the NAT Gateway first because it costs money.",
        "expectedResult": "CLI command step 4 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Public subnet",
        "body": "Route internet traffic to an Internet Gateway."
      },
      {
        "id": "cs-2",
        "title": "Private subnet",
        "body": "Route outbound internet traffic to a NAT Gateway."
      },
      {
        "id": "cs-3",
        "title": "Exam decision",
        "body": "Need inbound internet? Public subnet. Need outbound only? Private subnet plus NAT."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No internet from public subnet",
        "body": "Check the subnet route table has 0.0.0.0/0 to the IGW."
      },
      {
        "id": "ts-2",
        "title": "No outbound from private subnet",
        "body": "Check the NAT Gateway is Available and is in a public subnet."
      },
      {
        "id": "ts-3",
        "title": "Route target not available",
        "body": "Create and attach the IGW first. Wait for the NAT Gateway to become available."
      },
      {
        "id": "ts-4",
        "title": "Cleanup fails",
        "body": "Delete NAT Gateway, release Elastic IP, remove associations, then delete route tables and VPC."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Private subnet trap",
        "body": "A private subnet should not route directly to an Internet Gateway for normal private workloads."
      },
      {
        "id": "trap-2",
        "title": "NAT placement trap",
        "body": "A public NAT Gateway must be placed in a public subnet."
      },
      {
        "id": "trap-3",
        "title": "Route association trap",
        "body": "Creating a route table is not enough. You must associate it with the subnet."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Public goes IGW. Private goes NAT. Routes decide the subnet behaviour.",
    "flashcardSetId": "vpc_task_6_flashcards"
  },
  {
    "id": "task-saa-vpc-create-security-groups-for-bastion-ssh-and-app-ports-007",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Create security groups for bastion SSH and app ports",
    "slug": "create-security-groups-for-bastion-ssh-and-app-ports",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a bastion security group, create an app security group, and allow private access only through the bastion.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Security groups are stateful",
        "body": "Return traffic is allowed automatically. You do not add a matching return rule."
      },
      {
        "id": "concept-2",
        "title": "Bastion pattern",
        "body": "The bastion host is the only public entry point. Private instances only trust the bastion security group."
      },
      {
        "id": "concept-3",
        "title": "Security group rule plan",
        "body": "Security groupInbound ruleSourceReasonbastion-sgSSH 22your-ip/32Admin entry onlyapp-sgSSH 22bastion-sgPrivate admin pathapp-sgHTTP 80bastion-sgRestricted app testapp-sgAll outboundDefaultAllow updates and replies"
      }
    ],
    "whyItMatters": "This matters because security groups are a common exam topic. The best answer usually allows only the exact source and port needed.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Lab name prefix",
        "value": "saa-vpc-task7"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC setup, security group rules, optional EC2 testing, and cleanup."
      }
    ],
    "costWarning": "This lab can create EC2 charges if you launch instances. Delete instances, security groups, subnets, route tables, the internet gateway, and the VPC after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeAvailabilityZones VPC setup: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateTags, ec2:ModifyVpcAttribute Routing: ec2:CreateRouteTable, ec2:AssociateRouteTable, ec2:CreateRoute, ec2:DeleteRoute Internet access: ec2:CreateInternetGateway, ec2:AttachInternetGateway, ec2:DetachInternetGateway, ec2:DeleteInternetGateway Security groups: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:RevokeSecurityGroupIngress, ec2:DeleteSecurityGroup EC2 testing: ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances, ec2:CreateKeyPair, ec2:DeleteKeyPair Cleanup: ec2:DeleteSubnet, ec2:DeleteRouteTable, ec2:DeleteVpc, ec2:DeleteTags",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a small VPC for the lab",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC → Your VPCs → Create VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose VPC only."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Name it saa-vpc-task7-vpc."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use IPv4 CIDR 10.70.0.0/16."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Create VPC."
          }
        ],
        "note": "Keep this lab separate from your real VPCs.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create one public and one private subnet",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC → Subnets → Create subnet."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create task7-public-a in eu-west-2a with CIDR 10.70.1.0/24."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create task7-private-a in eu-west-2a with CIDR 10.70.11.0/24."
          }
        ],
        "note": "The bastion goes in the public subnet. The app instance goes in the private subnet.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Add public routing",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Internet gateways → Create internet gateway."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Name it saa-vpc-task7-igw."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Attach it to saa-vpc-task7-vpc."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Open Route tables → Create route table."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Name it task7-public-rt."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Associate it with task7-public-a."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Add route 0.0.0.0/0 to the internet gateway."
          }
        ],
        "note": "The private subnet must not have a direct route to the internet gateway.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the bastion security group",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open EC2 → Security Groups → Create security group."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Name it bastion-sg."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose VPC saa-vpc-task7-vpc."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Add inbound SSH 22 from your-public-ip/32."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Keep the default outbound rule."
          }
        ],
        "note": null,
        "warning": "Never allow SSH from 0.0.0.0/0 in real accounts.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the app security group",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Create another security group named app-sg."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose VPC saa-vpc-task7-vpc."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Add inbound SSH 22 from source security group bastion-sg."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Add inbound HTTP 80 from source security group bastion-sg."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Keep the default outbound rule."
          }
        ],
        "note": "Security groupInbound ruleSourceReasonbastion-sgSSH 22your-ip/32Admin entry onlyapp-sgSSH 22bastion-sgPrivate admin pathapp-sgHTTP 80bastion-sgRestricted app testapp-sgAll outboundDefaultAllow updates and replies",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Launch test instances",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open EC2 → Instances → Launch instances."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Launch task7-bastion into task7-public-a with bastion-sg."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Launch task7-app into task7-private-a with app-sg."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Use Amazon Linux and a small free-tier type if available."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Turn on auto-assign public IPv4 only for the bastion."
          }
        ],
        "note": "The app instance should not have a public IP.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Verify access path",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "SSH to the bastion from your machine."
          },
          {
            "id": "console-step-8-item-2",
            "text": "From the bastion, SSH to the app instance private IP."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Optional: run a simple web server on the app instance and test HTTP from the bastion."
          }
        ],
        "note": "Success means admin access reaches the app only through the bastion.",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Terminate task7-app."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Terminate task7-bastion."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Delete app-sg."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Delete bastion-sg."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Delete route table association and task7-public-rt."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Detach and delete the internet gateway."
          },
          {
            "id": "console-step-9-item-7",
            "text": "Delete the subnets."
          },
          {
            "id": "console-step-9-item-8",
            "text": "Delete the VPC."
          },
          {
            "id": "console-step-9-item-9",
            "text": "Delete the key pair if you created one."
          }
        ],
        "note": "Delete orderResourceReason1EC2 instancesSecurity groups are attached to them2Security groupsNo instance depends on them3Route table associationsSubnets must be free4Internet gatewayDetach before delete5SubnetsVPC must be empty6VPCLast parent resource",
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
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
            "text": "REGION=eu-west-2\nPREFIX=saa-vpc-task7\nMY_IP=$(curl -s https://checkip.amazonaws.com)/32\nAZ=eu-west-2a"
          }
        ],
        "note": "Replace MY_IP manually if curl is not available.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create VPC, subnets, and internet route",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 create-vpc --cidr-block 10.70.0.0/16 --region $REGION --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-task7-vpc}]' --query 'Vpc.VpcId' --output text)\naws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames '{\"Value\":true}' --region $REGION\nPUB_SUBNET=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.70.1.0/24 --availability-zone $AZ --region $REGION --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=task7-public-a}]' --query 'Subnet.SubnetId' --output text)\nPRIV_SUBNET=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.70.11.0/24 --availability-zone $AZ --region $REGION --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=task7-private-a}]' --query 'Subnet.SubnetId' --output text)\nIGW_ID=$(aws ec2 create-internet-gateway --region $REGION --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=saa-vpc-task7-igw}]' --query 'InternetGateway.InternetGatewayId' --output text)\naws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID --region $REGION\nRT_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --region $REGION --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=task7-public-rt}]' --query 'RouteTable.RouteTableId' --output text)\naws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region $REGION\nASSOC_ID=$(aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $PUB_SUBNET --region $REGION --query 'AssociationId' --output text)"
          }
        ],
        "note": "Expected: VPC, two subnets, an IGW, and one public route table are created.",
        "warning": null,
        "expectedResult": "Expected: VPC, two subnets, an IGW, and one public route table are created."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create security groups and rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "BASTION_SG=$(aws ec2 create-security-group --group-name bastion-sg --description 'Task 7 bastion SG' --vpc-id $VPC_ID --region $REGION --query 'GroupId' --output text)\nAPP_SG=$(aws ec2 create-security-group --group-name app-sg --description 'Task 7 app SG' --vpc-id $VPC_ID --region $REGION --query 'GroupId' --output text)\naws ec2 authorize-security-group-ingress --group-id $BASTION_SG --protocol tcp --port 22 --cidr $MY_IP --region $REGION\naws ec2 authorize-security-group-ingress --group-id $APP_SG --protocol tcp --port 22 --source-group $BASTION_SG --region $REGION\naws ec2 authorize-security-group-ingress --group-id $APP_SG --protocol tcp --port 80 --source-group $BASTION_SG --region $REGION"
          }
        ],
        "note": "Security groupInbound ruleSourceReasonbastion-sgSSH 22your-ip/32Admin entry onlyapp-sgSSH 22bastion-sgPrivate admin pathapp-sgHTTP 80bastion-sgRestricted app testapp-sgAll outboundDefaultAllow updates and replies",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-security-groups --group-ids $BASTION_SG $APP_SG --region $REGION --query 'SecurityGroups[*].{Name:GroupName,Rules:IpPermissions}'"
          }
        ],
        "note": "Expected: bastion allows SSH from your IP. App allows SSH and HTTP from the bastion security group.",
        "warning": null,
        "expectedResult": "Expected: bastion allows SSH from your IP. App allows SSH and HTTP from the bastion security group."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "CLI cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-security-group --group-id $APP_SG --region $REGION\naws ec2 delete-security-group --group-id $BASTION_SG --region $REGION\naws ec2 disassociate-route-table --association-id $ASSOC_ID --region $REGION\naws ec2 delete-route-table --route-table-id $RT_ID --region $REGION\naws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region $REGION\naws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region $REGION\naws ec2 delete-subnet --subnet-id $PRIV_SUBNET --region $REGION\naws ec2 delete-subnet --subnet-id $PUB_SUBNET --region $REGION\naws ec2 delete-vpc --vpc-id $VPC_ID --region $REGION"
          }
        ],
        "note": null,
        "warning": "Run cleanup only after test instances are terminated.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Security group state",
        "body": "Security groups are stateful. Return traffic is allowed automatically."
      },
      {
        "id": "cs-2",
        "title": "Best exam source",
        "body": "Use another security group as the source when one AWS tier must talk to another."
      },
      {
        "id": "cs-3",
        "title": "Rule summary",
        "body": "Security groupInbound ruleSourceReasonbastion-sgSSH 22your-ip/32Admin entry onlyapp-sgSSH 22bastion-sgPrivate admin pathapp-sgHTTP 80bastion-sgRestricted app testapp-sgAll outboundDefaultAllow updates and replies"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the exact EC2 permissions in step 0 and run aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "InvalidGroup.NotFound",
        "body": "Check that both security groups are in the same VPC."
      },
      {
        "id": "ts-3",
        "title": "SSH fails",
        "body": "Check your IP, key pair, route table, public IP, and security group rule."
      },
      {
        "id": "ts-4",
        "title": "Cannot delete security group",
        "body": "Terminate instances or remove ENI attachments first."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Do not open SSH to the world. Use your-ip/32 or Session Manager."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Security groups are stateful. NACLs are stateless."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "A private instance should not need a public IP for bastion access."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Bastion is the front door. The app only trusts the front door.",
    "flashcardSetId": "vpc_task_7_flashcards"
  },
  {
    "id": "task-saa-vpc-implement-a-network-acl-rule-to-block-an-ip-range-008",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Implement a network ACL rule to block an IP range",
    "slug": "implement-a-network-acl-rule-to-block-an-ip-range",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a custom network ACL, add a lower-number deny rule, and associate it with a subnet.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "NACLs are stateless",
        "body": "Inbound and outbound traffic are checked separately. Return traffic needs its own allowed path."
      },
      {
        "id": "concept-2",
        "title": "Rule order matters",
        "body": "AWS checks the lowest rule number first. A lower deny rule can block traffic before a later allow rule."
      },
      {
        "id": "concept-3",
        "title": "NACL block plan",
        "body": "Rule #DirectionActionTrafficCIDR90InboundDenyAll traffic203.0.113.0/24100InboundAllowAll traffic0.0.0.0/0100OutboundAllowAll traffic0.0.0.0/0*BothDenyAll trafficEverything else"
      }
    ],
    "whyItMatters": "This matters because NACLs add subnet-level control. Exams often test stateless rules and rule order.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Lab name prefix",
        "value": "saa-vpc-task8"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC setup, network ACL creation, NACL entries, subnet association, and cleanup."
      }
    ],
    "costWarning": "This lab should cost very little because VPC, subnet, and NACL resources have no hourly charge. Data transfer or test instances can cost money if you add them.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeAvailabilityZones VPC setup: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateTags, ec2:ModifyVpcAttribute Routing: ec2:CreateRouteTable, ec2:AssociateRouteTable, ec2:CreateRoute, ec2:DeleteRoute Network ACLs: ec2:CreateNetworkAcl, ec2:CreateNetworkAclEntry, ec2:ReplaceNetworkAclAssociation, ec2:DeleteNetworkAclEntry, ec2:DeleteNetworkAcl Testing: ec2:DescribeNetworkAcls, ec2:DescribeInstances Cleanup: ec2:DeleteSubnet, ec2:DeleteRouteTable, ec2:DeleteVpc, ec2:DeleteTags",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a test VPC and subnet",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC → Your VPCs → Create VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create saa-vpc-task8-vpc with CIDR 10.80.0.0/16."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open Subnets → Create subnet."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create task8-public-a in eu-west-2a with CIDR 10.80.1.0/24."
          }
        ],
        "note": "This lab focuses on the NACL rule behaviour.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a custom network ACL",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC → Network ACLs."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create network ACL."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name it task8-block-nacl."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose VPC saa-vpc-task8-vpc."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose Create network ACL."
          }
        ],
        "note": "New custom NACLs start with deny-all until you add allow rules.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Add allow rules first",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select task8-block-nacl."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open Inbound rules → Edit inbound rules."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add rule 100, type All traffic, source 0.0.0.0/0, action Allow."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Open Outbound rules → Edit outbound rules."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Add rule 100, type All traffic, destination 0.0.0.0/0, action Allow."
          }
        ],
        "note": null,
        "warning": "Without outbound allow, return traffic may fail because NACLs are stateless.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Add the block rule",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Inbound rules → Edit inbound rules."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Add rule 90."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose type All traffic."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Set source to 203.0.113.0/24."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Set action to Deny."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Save changes."
          }
        ],
        "note": "Rule #DirectionActionTrafficCIDR90InboundDenyAll traffic203.0.113.0/24100InboundAllowAll traffic0.0.0.0/0100OutboundAllowAll traffic0.0.0.0/0*BothDenyAll trafficEverything else",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Associate the NACL with the subnet",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select task8-block-nacl."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Open Subnet associations."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Edit subnet associations."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Select task8-public-a."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Save changes."
          }
        ],
        "note": "A subnet can use only one NACL at a time.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Verify the rule order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the NACL inbound rules."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Confirm deny rule 90 appears above allow rule 100."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Confirm the subnet association points to task8-public-a."
          }
        ],
        "note": "Lower rule numbers are checked first.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Replace the subnet association back to the default network ACL if needed."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Delete the custom NACL entries."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Delete task8-block-nacl."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Delete the subnet."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Delete the VPC."
          }
        ],
        "note": "Delete orderResourceReason1Subnet NACL associationSubnet cannot use a deleted NACL2Custom NACLDelete after association is removed3SubnetVPC must be empty4VPCLast parent resource",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
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
        "title": "Create VPC and subnet",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nAZ=eu-west-2a\nVPC_ID=$(aws ec2 create-vpc --cidr-block 10.80.0.0/16 --region $REGION --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-task8-vpc}]' --query 'Vpc.VpcId' --output text)\nSUBNET_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.80.1.0/24 --availability-zone $AZ --region $REGION --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=task8-public-a}]' --query 'Subnet.SubnetId' --output text)"
          }
        ],
        "note": "Expected: a new VPC and subnet are created.",
        "warning": null,
        "expectedResult": "Expected: a new VPC and subnet are created."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create and associate the custom NACL",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "NACL_ID=$(aws ec2 create-network-acl --vpc-id $VPC_ID --region $REGION --tag-specifications 'ResourceType=network-acl,Tags=[{Key=Name,Value=task8-block-nacl}]' --query 'NetworkAcl.NetworkAclId' --output text)\nASSOC_ID=$(aws ec2 describe-network-acls --region $REGION --filters Name=association.subnet-id,Values=$SUBNET_ID --query 'NetworkAcls[0].Associations[0].NetworkAclAssociationId' --output text)\nNEW_ASSOC_ID=$(aws ec2 replace-network-acl-association --association-id $ASSOC_ID --network-acl-id $NACL_ID --region $REGION --query 'NewAssociationId' --output text)"
          }
        ],
        "note": "Expected: the subnet now uses the custom NACL.",
        "warning": null,
        "expectedResult": "Expected: the subnet now uses the custom NACL."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Add allow and deny rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-network-acl-entry --network-acl-id $NACL_ID --ingress --rule-number 100 --protocol -1 --rule-action allow --cidr-block 0.0.0.0/0 --region $REGION\naws ec2 create-network-acl-entry --network-acl-id $NACL_ID --egress --rule-number 100 --protocol -1 --rule-action allow --cidr-block 0.0.0.0/0 --region $REGION\naws ec2 create-network-acl-entry --network-acl-id $NACL_ID --ingress --rule-number 90 --protocol -1 --rule-action deny --cidr-block 203.0.113.0/24 --region $REGION"
          }
        ],
        "note": "Rule #DirectionActionTrafficCIDR90InboundDenyAll traffic203.0.113.0/24100InboundAllowAll traffic0.0.0.0/0100OutboundAllowAll traffic0.0.0.0/0*BothDenyAll trafficEverything else",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify NACL entries",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-network-acls --network-acl-ids $NACL_ID --region $REGION --query 'NetworkAcls[0].Entries[*].{Rule:RuleNumber,Egress:Egress,Action:RuleAction,CIDR:CidrBlock}' --output table"
          }
        ],
        "note": "Expected: inbound deny rule 90 appears before allow rule 100.",
        "warning": null,
        "expectedResult": "Expected: inbound deny rule 90 appears before allow rule 100."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "CLI cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "DEFAULT_NACL=$(aws ec2 describe-network-acls --region $REGION --filters Name=vpc-id,Values=$VPC_ID Name=default,Values=true --query 'NetworkAcls[0].NetworkAclId' --output text)\naws ec2 replace-network-acl-association --association-id $NEW_ASSOC_ID --network-acl-id $DEFAULT_NACL --region $REGION\naws ec2 delete-network-acl --network-acl-id $NACL_ID --region $REGION\naws ec2 delete-subnet --subnet-id $SUBNET_ID --region $REGION\naws ec2 delete-vpc --vpc-id $VPC_ID --region $REGION"
          }
        ],
        "note": null,
        "warning": "Do not delete a NACL while a subnet still depends on it.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "NACL state",
        "body": "NACLs are stateless. You must allow both request and response paths."
      },
      {
        "id": "cs-2",
        "title": "Rule order",
        "body": "Lowest rule number wins first. Put specific deny rules before broad allow rules."
      },
      {
        "id": "cs-3",
        "title": "NACL rule plan",
        "body": "Rule #DirectionActionTrafficCIDR90InboundDenyAll traffic203.0.113.0/24100InboundAllowAll traffic0.0.0.0/0100OutboundAllowAll traffic0.0.0.0/0*BothDenyAll trafficEverything else"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Traffic still allowed",
        "body": "Check the deny rule number. It must be lower than the broad allow rule."
      },
      {
        "id": "ts-2",
        "title": "All traffic blocked",
        "body": "Custom NACLs deny all by default until you add allow rules."
      },
      {
        "id": "ts-3",
        "title": "Return traffic fails",
        "body": "Add the correct outbound rule because NACLs are stateless."
      },
      {
        "id": "ts-4",
        "title": "Cannot delete NACL",
        "body": "Move the subnet association back to another NACL first."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Security groups allow only. NACLs can allow and deny."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "NACL rules are checked in number order."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "NACLs are subnet-level. Security groups are ENI or instance-level."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Lowest number speaks first. NACLs read rules from low to high.",
    "flashcardSetId": "vpc_task_8_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-vpc-flow-logs-for-an-eni-009",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure VPC Flow Logs for an ENI",
    "slug": "configure-vpc-flow-logs-for-an-eni",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a VPC Flow Log for one network interface and view records in CloudWatch Logs or Amazon S3.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Flow Logs capture metadata",
        "body": "Flow Logs show IP traffic metadata. They do not capture packet payloads."
      },
      {
        "id": "concept-2",
        "title": "ENI-level logging",
        "body": "An ENI flow log records traffic for one network interface. This is useful for focused troubleshooting."
      },
      {
        "id": "concept-3",
        "title": "Destination comparison",
        "body": "DestinationBest forNeedsWatch outCloudWatch LogsFast viewingLog group and IAM roleLog ingestion chargesAmazon S3Long storageBucket and bucket policyDelivery delayData FirehoseStreaming pipelineFirehose delivery streamMore setup"
      }
    ],
    "whyItMatters": "This matters because Flow Logs help you see accepted and rejected network traffic without capturing packet payloads.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Lab name prefix",
        "value": "saa-vpc-task9"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, ENI read access, Flow Logs, CloudWatch Logs, optional S3, IAM role setup, and cleanup."
      }
    ],
    "costWarning": "CloudWatch Logs ingestion and storage can cost money. S3 storage and requests can also cost money. Delete the flow log and log destinations after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeAvailabilityZones VPC setup: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateTags, ec2:ModifyVpcAttribute Routing: ec2:CreateRouteTable, ec2:AssociateRouteTable, ec2:CreateRoute, ec2:DeleteRoute ENI and Flow Logs: ec2:DescribeNetworkInterfaces, ec2:CreateFlowLogs, ec2:DescribeFlowLogs, ec2:DeleteFlowLogs CloudWatch Logs: logs:CreateLogGroup, logs:DescribeLogGroups, logs:DescribeLogStreams, logs:GetLogEvents, logs:DeleteLogGroup S3 destination: s3:CreateBucket, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:ListBucket, s3:GetObject, s3:DeleteObject, s3:DeleteBucket IAM role for CloudWatch Logs: iam:CreateRole, iam:PutRolePolicy, iam:PassRole, iam:DeleteRolePolicy, iam:DeleteRole Cleanup: ec2:DeleteSubnet, ec2:DeleteRouteTable, ec2:DeleteVpc, ec2:DeleteTags",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Choose an ENI to monitor",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 → Network Interfaces."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose a test ENI, such as an EC2 instance network interface."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Copy the ENI ID, for example eni-xxxxxxxx."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Do not use a production ENI for a learning lab."
          }
        ],
        "note": "An ENI is the network card attached to an EC2 instance or some AWS services.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the CloudWatch Logs destination",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open CloudWatch → Logs → Log groups."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create log group."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name it /aws/vpc/task9/flowlogs."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep retention short for a lab, for example 1 day if available."
          }
        ],
        "note": "CloudWatch is easier for quick viewing.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create a Flow Logs IAM role",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open IAM → Roles → Create role."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Use a trusted entity that allows vpc-flow-logs.amazonaws.com."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add permissions to write to CloudWatch Logs."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Name the role saa-vpc-task9-flowlogs-role."
          }
        ],
        "note": null,
        "warning": "In real accounts, scope the log permissions tightly.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create a flow log to CloudWatch Logs",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open VPC → Flow Logs → Create flow log."
          },
          {
            "id": "console-step-5-item-2",
            "text": "For resource type, choose Network interface."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Enter the ENI ID."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Traffic filter: choose All."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Destination: choose Send to CloudWatch Logs."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Select log group /aws/vpc/task9/flowlogs."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Select role saa-vpc-task9-flowlogs-role."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Create the flow log."
          }
        ],
        "note": "Flow Logs can take a few minutes to appear.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Optional: create an S3 destination",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open S3 → Create bucket."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Create saa-vpc-task9-flowlogs-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open VPC → Flow Logs → Create flow log."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose the same ENI."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Destination: choose Send to Amazon S3 bucket."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Enter the bucket ARN."
          }
        ],
        "note": "DestinationBest forNeedsWatch outCloudWatch LogsFast viewingLog group and IAM roleLog ingestion chargesAmazon S3Long storageBucket and bucket policyDelivery delayData FirehoseStreaming pipelineFirehose delivery streamMore setup",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Generate and view traffic",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Connect to or ping the test instance if allowed."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Wait a few minutes."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open CloudWatch Logs → the log group."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Open the newest log stream."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Look for ACCEPT, REJECT, or NODATA records."
          }
        ],
        "note": "S3 records may arrive later than CloudWatch Logs.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Delete the flow log subscription."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Delete the CloudWatch log group."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Empty and delete the S3 bucket if created."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Delete the inline role policy."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Delete the IAM role."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Delete any test EC2 instance or ENI if you created one."
          }
        ],
        "note": "Delete orderResourceReason1Flow logStops delivery2CloudWatch log groupRemoves stored logs3S3 objects and bucketBucket must be empty4IAM role policyRole must be clean5IAM roleNo service uses it6Test ENI or EC2Only if created for lab",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
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
            "text": "REGION=eu-west-2\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nLOG_GROUP=/aws/vpc/task9/flowlogs\nROLE_NAME=saa-vpc-task9-flowlogs-role\nENI_ID=eni-replace-this"
          }
        ],
        "note": "Replace eni-replace-this with your test ENI ID.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create CloudWatch log group and IAM role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws logs create-log-group --log-group-name $LOG_GROUP --region $REGION\ncat > trust-flowlogs.json <<'EOF'\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"vpc-flow-logs.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}\nEOF\nROLE_ARN=$(aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://trust-flowlogs.json --query 'Role.Arn' --output text)\ncat > flowlogs-cw-policy.json <<EOF\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"logs:CreateLogStream\",\"logs:PutLogEvents\",\"logs:DescribeLogGroups\",\"logs:DescribeLogStreams\"],\"Resource\":\"arn:aws:logs:$REGION:$ACCOUNT_ID:log-group:$LOG_GROUP:*\"}]}\nEOF\naws iam put-role-policy --role-name $ROLE_NAME --policy-name saa-vpc-task9-flowlogs-cw --policy-document file://flowlogs-cw-policy.json"
          }
        ],
        "note": "Wait about 20 seconds before creating the flow log so IAM can propagate.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the ENI flow log",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "FLOW_LOG_ID=$(aws ec2 create-flow-logs --resource-type NetworkInterface --resource-ids $ENI_ID --traffic-type ALL --log-destination-type cloud-watch-logs --log-group-name $LOG_GROUP --deliver-logs-permission-arn $ROLE_ARN --region $REGION --query 'FlowLogIds[0]' --output text)\necho $FLOW_LOG_ID"
          }
        ],
        "note": "Expected: a Flow Log ID starts with fl-.",
        "warning": null,
        "expectedResult": "Expected: a Flow Log ID starts with fl-."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify delivery",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-flow-logs --flow-log-ids $FLOW_LOG_ID --region $REGION --query 'FlowLogs[0].FlowLogStatus'\naws logs describe-log-streams --log-group-name $LOG_GROUP --region $REGION --order-by LastEventTime --descending --max-items 5"
          }
        ],
        "note": "Expected: status becomes ACTIVE. Log streams may take a few minutes.",
        "warning": null,
        "expectedResult": "Expected: status becomes ACTIVE. Log streams may take a few minutes."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "CLI cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-flow-logs --flow-log-ids $FLOW_LOG_ID --region $REGION\naws logs delete-log-group --log-group-name $LOG_GROUP --region $REGION\naws iam delete-role-policy --role-name $ROLE_NAME --policy-name saa-vpc-task9-flowlogs-cw\naws iam delete-role --role-name $ROLE_NAME\nrm -f trust-flowlogs.json flowlogs-cw-policy.json"
          }
        ],
        "note": null,
        "warning": "Delete the flow log before deleting the destination role.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Flow Log scope",
        "body": "You can create Flow Logs for a VPC, subnet, or ENI."
      },
      {
        "id": "cs-2",
        "title": "Flow Log records",
        "body": "Records show traffic metadata, not packet contents."
      },
      {
        "id": "cs-3",
        "title": "Destination comparison",
        "body": "DestinationBest forNeedsWatch outCloudWatch LogsFast viewingLog group and IAM roleLog ingestion chargesAmazon S3Long storageBucket and bucket policyDelivery delayData FirehoseStreaming pipelineFirehose delivery streamMore setup"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No records appear",
        "body": "Wait a few minutes and generate traffic. No traffic can produce NODATA."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied",
        "body": "Check iam:PassRole, log permissions, and aws sts get-caller-identity."
      },
      {
        "id": "ts-3",
        "title": "Role delivery failed",
        "body": "Check the trust policy uses vpc-flow-logs.amazonaws.com."
      },
      {
        "id": "ts-4",
        "title": "S3 logs delayed",
        "body": "S3 delivery can take several minutes."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Flow Logs do not capture packet payloads."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Flow Logs can show ACCEPT, REJECT, or NODATA."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "CloudTrail records API calls. Flow Logs record network traffic metadata."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Flow Logs show traffic facts. They show who talked, not what they said.",
    "flashcardSetId": "vpc_task_9_flashcards"
  },
  {
    "id": "task-saa-vpc-set-up-vpc-peering-and-verify-private-connectivity-010",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Set up VPC peering and verify private connectivity",
    "slug": "set-up-vpc-peering-and-verify-private-connectivity",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Peer two non-overlapping VPCs, add routes both ways, and test private IP connectivity.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Peering is private routing",
        "body": "VPC peering lets two VPCs communicate using private IP addresses."
      },
      {
        "id": "concept-2",
        "title": "No overlapping CIDRs",
        "body": "Peered VPC CIDR ranges must not overlap."
      },
      {
        "id": "concept-3",
        "title": "Peering route plan",
        "body": "VPCCIDRSubnetRoute destinationRoute targetVPC A10.100.0.0/1610.100.1.0/2410.101.0.0/16Peering connectionVPC B10.101.0.0/1610.101.1.0/2410.100.0.0/16Peering connection"
      }
    ],
    "whyItMatters": "This matters because VPC peering is simple private connectivity, but it needs non-overlapping CIDRs and routes on both sides.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Lab name prefix",
        "value": "saa-vpc-task10"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC setup, VPC peering, route tables, security groups, optional EC2 testing, and cleanup."
      }
    ],
    "costWarning": "VPC peering has no hourly charge, but data transfer can cost money. EC2 test instances can also cost money. Delete test instances and peering resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeAvailabilityZones VPC setup: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateTags, ec2:ModifyVpcAttribute Routing: ec2:CreateRouteTable, ec2:AssociateRouteTable, ec2:CreateRoute, ec2:DeleteRoute VPC peering: ec2:CreateVpcPeeringConnection, ec2:AcceptVpcPeeringConnection, ec2:DescribeVpcPeeringConnections, ec2:DeleteVpcPeeringConnection Security groups: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup EC2 testing: ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances Cleanup: ec2:DeleteSubnet, ec2:DeleteRouteTable, ec2:DeleteVpc, ec2:DeleteTags",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create two non-overlapping VPCs",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC → Your VPCs → Create VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create saa-vpc-task10-a with CIDR 10.100.0.0/16."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create saa-vpc-task10-b with CIDR 10.101.0.0/16."
          }
        ],
        "note": "Overlapping CIDRs cannot be peered.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create one subnet in each VPC",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create subnet task10-a-private-a in VPC A with CIDR 10.100.1.0/24."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create subnet task10-b-private-a in VPC B with CIDR 10.101.1.0/24."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Use eu-west-2a for both."
          }
        ],
        "note": "These subnets will route to each other through VPC peering.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create and accept the peering connection",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC → Peering connections."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create peering connection."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Requester VPC: saa-vpc-task10-a."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Accepter VPC: saa-vpc-task10-b."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Create the peering connection."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Select it, then choose Actions → Accept request."
          }
        ],
        "note": "In cross-account peering, the other account must accept.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Update both route tables",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Route tables."
          },
          {
            "id": "console-step-5-item-2",
            "text": "For the route table used by VPC A subnet, add destination 10.101.0.0/16 and target the peering connection."
          },
          {
            "id": "console-step-5-item-3",
            "text": "For the route table used by VPC B subnet, add destination 10.100.0.0/16 and target the peering connection."
          }
        ],
        "note": "VPCCIDRSubnetRoute destinationRoute targetVPC A10.100.0.0/1610.100.1.0/2410.101.0.0/16Peering connectionVPC B10.101.0.0/1610.101.1.0/2410.100.0.0/16Peering connection",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create test security groups",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Create task10-a-sg in VPC A."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Create task10-b-sg in VPC B."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Allow ICMP from the peer VPC CIDR on both security groups."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Optional: allow SSH from your admin path only."
          }
        ],
        "note": "Routes alone are not enough. Security groups must allow the traffic too.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Launch and test private connectivity",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Launch one test EC2 instance in each subnet."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Copy each instance private IPv4 address."
          },
          {
            "id": "console-step-7-item-3",
            "text": "From instance A, ping instance B private IP if ICMP is allowed."
          },
          {
            "id": "console-step-7-item-4",
            "text": "From instance B, ping instance A private IP if ICMP is allowed."
          }
        ],
        "note": "Success means traffic uses private IP routing, not the public internet.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Terminate both test instances."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Delete the security groups."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Delete routes pointing to the peering connection."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Delete the VPC peering connection."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Delete route tables if custom ones were created."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Delete subnets."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Delete both VPCs."
          }
        ],
        "note": "Delete orderResourceReason1EC2 instancesSecurity groups and subnets depend on them2Security groupsNo ENI attachments left3Peering routesRemove routes before deleting peering4Peering connectionNo routes depend on it5SubnetsVPCs must be empty6VPCsDelete last",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
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
        "title": "Create VPCs and subnets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nAZ=eu-west-2a\nVPC_A=$(aws ec2 create-vpc --cidr-block 10.100.0.0/16 --region $REGION --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-task10-a}]' --query 'Vpc.VpcId' --output text)\nVPC_B=$(aws ec2 create-vpc --cidr-block 10.101.0.0/16 --region $REGION --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-task10-b}]' --query 'Vpc.VpcId' --output text)\nSUBNET_A=$(aws ec2 create-subnet --vpc-id $VPC_A --cidr-block 10.100.1.0/24 --availability-zone $AZ --region $REGION --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=task10-a-private-a}]' --query 'Subnet.SubnetId' --output text)\nSUBNET_B=$(aws ec2 create-subnet --vpc-id $VPC_B --cidr-block 10.101.1.0/24 --availability-zone $AZ --region $REGION --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=task10-b-private-a}]' --query 'Subnet.SubnetId' --output text)"
          }
        ],
        "note": "Expected: two VPCs with non-overlapping CIDRs.",
        "warning": null,
        "expectedResult": "Expected: two VPCs with non-overlapping CIDRs."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create and accept peering",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "PCX_ID=$(aws ec2 create-vpc-peering-connection --vpc-id $VPC_A --peer-vpc-id $VPC_B --region $REGION --tag-specifications 'ResourceType=vpc-peering-connection,Tags=[{Key=Name,Value=saa-vpc-task10-peering}]' --query 'VpcPeeringConnection.VpcPeeringConnectionId' --output text)\naws ec2 accept-vpc-peering-connection --vpc-peering-connection-id $PCX_ID --region $REGION"
          }
        ],
        "note": "Expected: peering status becomes active after a short wait.",
        "warning": null,
        "expectedResult": "Expected: peering status becomes active after a short wait."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Add routes both ways",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "RT_A=$(aws ec2 describe-route-tables --region $REGION --filters Name=vpc-id,Values=$VPC_A --query 'RouteTables[0].RouteTableId' --output text)\nRT_B=$(aws ec2 describe-route-tables --region $REGION --filters Name=vpc-id,Values=$VPC_B --query 'RouteTables[0].RouteTableId' --output text)\naws ec2 create-route --route-table-id $RT_A --destination-cidr-block 10.101.0.0/16 --vpc-peering-connection-id $PCX_ID --region $REGION\naws ec2 create-route --route-table-id $RT_B --destination-cidr-block 10.100.0.0/16 --vpc-peering-connection-id $PCX_ID --region $REGION"
          }
        ],
        "note": "VPCCIDRSubnetRoute destinationRoute targetVPC A10.100.0.0/1610.100.1.0/2410.101.0.0/16Peering connectionVPC B10.101.0.0/1610.101.1.0/2410.100.0.0/16Peering connection",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create security groups for private test traffic",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "SG_A=$(aws ec2 create-security-group --group-name task10-a-sg --description 'Task 10 VPC A SG' --vpc-id $VPC_A --region $REGION --query 'GroupId' --output text)\nSG_B=$(aws ec2 create-security-group --group-name task10-b-sg --description 'Task 10 VPC B SG' --vpc-id $VPC_B --region $REGION --query 'GroupId' --output text)\naws ec2 authorize-security-group-ingress --group-id $SG_A --protocol icmp --port -1 --cidr 10.101.0.0/16 --region $REGION\naws ec2 authorize-security-group-ingress --group-id $SG_B --protocol icmp --port -1 --cidr 10.100.0.0/16 --region $REGION"
          }
        ],
        "note": "Expected: ICMP is allowed only from the peer VPC CIDR.",
        "warning": null,
        "expectedResult": "Expected: ICMP is allowed only from the peer VPC CIDR."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify peering and routes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-vpc-peering-connections --vpc-peering-connection-ids $PCX_ID --region $REGION --query 'VpcPeeringConnections[0].Status.Code'\naws ec2 describe-route-tables --route-table-ids $RT_A $RT_B --region $REGION --query 'RouteTables[*].Routes[*].{Destination:DestinationCidrBlock,Peering:VpcPeeringConnectionId,State:State}'"
          }
        ],
        "note": "Expected: peering is active and both route tables have peer CIDR routes.",
        "warning": null,
        "expectedResult": "Expected: peering is active and both route tables have peer CIDR routes."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "CLI cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-route --route-table-id $RT_A --destination-cidr-block 10.101.0.0/16 --region $REGION\naws ec2 delete-route --route-table-id $RT_B --destination-cidr-block 10.100.0.0/16 --region $REGION\naws ec2 delete-vpc-peering-connection --vpc-peering-connection-id $PCX_ID --region $REGION\naws ec2 delete-security-group --group-id $SG_A --region $REGION\naws ec2 delete-security-group --group-id $SG_B --region $REGION\naws ec2 delete-subnet --subnet-id $SUBNET_A --region $REGION\naws ec2 delete-subnet --subnet-id $SUBNET_B --region $REGION\naws ec2 delete-vpc --vpc-id $VPC_A --region $REGION\naws ec2 delete-vpc --vpc-id $VPC_B --region $REGION"
          }
        ],
        "note": null,
        "warning": "Terminate test instances before running cleanup.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Peering basics",
        "body": "VPC peering connects two VPCs using private IP routing."
      },
      {
        "id": "cs-2",
        "title": "No transitive routing",
        "body": "If A peers with B and B peers with C, A cannot reach C through B."
      },
      {
        "id": "cs-3",
        "title": "Peering route plan",
        "body": "VPCCIDRSubnetRoute destinationRoute targetVPC A10.100.0.0/1610.100.1.0/2410.101.0.0/16Peering connectionVPC B10.101.0.0/1610.101.1.0/2410.100.0.0/16Peering connection"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Peering is pending",
        "body": "Accept the peering request. Cross-account peering must be accepted by the peer account."
      },
      {
        "id": "ts-2",
        "title": "Ping fails",
        "body": "Check routes both ways, security groups, NACLs, and the instance firewall."
      },
      {
        "id": "ts-3",
        "title": "Overlapping CIDR error",
        "body": "Choose non-overlapping VPC CIDR blocks."
      },
      {
        "id": "ts-4",
        "title": "Route is blackhole",
        "body": "Check that the peering connection is active and not deleted."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "VPC peering is not transitive."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Routes must be added in both VPCs."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Peering uses private IPs. It does not require an internet gateway."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Overlapping CIDRs cannot be peered."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Two roads, two directions. Peering needs a route back as well.",
    "flashcardSetId": "vpc_task_10_flashcards"
  },
  {
    "id": "task-saa-vpc-add-peering-routes-and-prove-no-transitive-routing-011",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Add peering routes and prove no transitive routing",
    "slug": "add-peering-routes-and-prove-no-transitive-routing",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Add route entries for peered VPCs, test private IP traffic, and confirm VPC A cannot reach VPC C through VPC B.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Peering is one-to-one",
        "body": "A VPC peering connection links two VPCs directly. It does not create a hub."
      },
      {
        "id": "concept-2",
        "title": "Routes are required",
        "body": "Each subnet route table needs a route to the peer VPC CIDR."
      },
      {
        "id": "concept-3",
        "title": "Route plan",
        "body": "VPCCIDRRoute destinationTargetvpc-a10.71.0.0/1610.72.0.0/16Peering A-Bvpc-b10.72.0.0/1610.71.0.0/16Peering A-Bvpc-b10.72.0.0/1610.73.0.0/16Peering B-Cvpc-c10.73.0.0/1610.72.0.0/16Peering B-Cvpc-a10.71.0.0/1610.73.0.0/16Not valid through B"
      }
    ],
    "whyItMatters": "This matters because VPC peering is simple, but it is not transitive. For hub-and-spoke routing, use AWS Transit Gateway instead.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC A CIDR",
        "value": "10.71.0.0/16"
      },
      {
        "label": "VPC B CIDR",
        "value": "10.72.0.0/16"
      },
      {
        "label": "VPC C CIDR",
        "value": "10.73.0.0/16"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC peering read access, route table changes, instance checks, and cleanup."
      }
    ],
    "costWarning": "Low if existing test instances are used. Delete all resources in the teardown section to stop charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC peering read: ec2:DescribeVpcs, ec2:DescribeVpcPeeringConnections, ec2:DescribeRouteTables, ec2:DescribeInstances Route changes: ec2:CreateRoute, ec2:DeleteRoute Testing: ec2:DescribeInstanceStatus Cleanup: ec2:DeleteRoute",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the VPC route tables",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Route tables."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Find the route table used by the private subnet in vpc-a."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Repeat for vpc-b and vpc-c."
          }
        ],
        "note": "Use the subnet associations tab to confirm the correct route table.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Add routes for VPC A and VPC B",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select the vpc-a private route table."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Routes, then Edit routes."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Add destination 10.72.0.0/16 with target as the A-B peering connection."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Save changes."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Add destination 10.71.0.0/16 in the vpc-b private route table with target as the A-B peering connection."
          }
        ],
        "note": "Both sides need routes.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Add routes for VPC B and VPC C",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In the vpc-b private route table, add destination 10.73.0.0/16 to the B-C peering connection."
          },
          {
            "id": "console-step-4-item-2",
            "text": "In the vpc-c private route table, add destination 10.72.0.0/16 to the B-C peering connection."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Save changes."
          }
        ],
        "note": "Do not add a route from VPC A to VPC C through VPC B. Peering will not forward it.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test private IP connectivity",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to a test instance in vpc-a."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Ping or curl the private IP of a test instance in vpc-b."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Connect to vpc-b and test the private IP in vpc-c."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Try to reach vpc-c directly from vpc-a."
          }
        ],
        "note": "Expected: A to B works, B to C works, and A to C fails unless A and C are directly peered.",
        "warning": null,
        "expectedResult": "Expected: A to B works, B to C works, and A to C fails unless A and C are directly peered."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down route entries",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Remove the test routes from vpc-a first."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Remove the test routes from vpc-b."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Remove the test routes from vpc-c."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Leave peering connections only if another lab needs them."
          }
        ],
        "note": null,
        "warning": "Delete routes before deleting peering connections to avoid blackhole routes.",
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
            "text": "REGION=eu-west-2\nRTB_A=rtb-replace-vpc-a\nRTB_B=rtb-replace-vpc-b\nRTB_C=rtb-replace-vpc-c\nPCX_AB=pcx-replace-ab\nPCX_BC=pcx-replace-bc"
          }
        ],
        "note": "Replace the route table and peering connection IDs with your own values.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Add peering routes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-route --region $REGION --route-table-id $RTB_A --destination-cidr-block 10.72.0.0/16 --vpc-peering-connection-id $PCX_AB\naws ec2 create-route --region $REGION --route-table-id $RTB_B --destination-cidr-block 10.71.0.0/16 --vpc-peering-connection-id $PCX_AB\naws ec2 create-route --region $REGION --route-table-id $RTB_B --destination-cidr-block 10.73.0.0/16 --vpc-peering-connection-id $PCX_BC\naws ec2 create-route --region $REGION --route-table-id $RTB_C --destination-cidr-block 10.72.0.0/16 --vpc-peering-connection-id $PCX_BC"
          }
        ],
        "note": "Expected: each command returns true.",
        "warning": null,
        "expectedResult": "Expected: each command returns true."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify routes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-route-tables --region $REGION --route-table-ids $RTB_A $RTB_B $RTB_C --query 'RouteTables[].Routes[?VpcPeeringConnectionId!=`null`].[DestinationCidrBlock,VpcPeeringConnectionId,State]' --output table"
          }
        ],
        "note": "Expected: routes show active.",
        "warning": null,
        "expectedResult": "Expected: routes show active."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Clean up routes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-route --region $REGION --route-table-id $RTB_A --destination-cidr-block 10.72.0.0/16\naws ec2 delete-route --region $REGION --route-table-id $RTB_B --destination-cidr-block 10.71.0.0/16\naws ec2 delete-route --region $REGION --route-table-id $RTB_B --destination-cidr-block 10.73.0.0/16\naws ec2 delete-route --region $REGION --route-table-id $RTB_C --destination-cidr-block 10.72.0.0/16"
          }
        ],
        "note": "Run cleanup after testing.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Peering routes",
        "body": "Add routes on both sides of the peering connection."
      },
      {
        "id": "cs-2",
        "title": "No transit",
        "body": "VPC peering does not forward traffic to another peering connection."
      },
      {
        "id": "cs-3",
        "title": "When to use TGW",
        "body": "Use AWS Transit Gateway when many VPCs need hub-and-spoke routing."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Blackhole route",
        "body": "The route target is deleted or the peering connection is not active."
      },
      {
        "id": "ts-2",
        "title": "Ping fails",
        "body": "Check security groups, NACLs, route tables, and OS firewall settings."
      },
      {
        "id": "ts-3",
        "title": "A to C fails",
        "body": "This is expected if A and C are not directly peered."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: peering through a middle VPC. Correct: peering is not transitive."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: only one side needs a route. Correct: both sides need routes."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: route through NAT for private peer traffic. Correct: use the peering connection target."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Peering is a direct handshake. It does not pass messages to a third VPC.",
    "flashcardSetId": "vpc_task_11_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-aws-transit-gateway-with-multiple-vpcs-012",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure AWS Transit Gateway with multiple VPCs",
    "slug": "configure-aws-transit-gateway-with-multiple-vpcs",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Create a Transit Gateway, attach multiple VPCs, add routes, and test routing behavior between VPCs.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Transit Gateway",
        "body": "A Transit Gateway is a central router for VPCs and networks."
      },
      {
        "id": "concept-2",
        "title": "Attachments",
        "body": "Each VPC connects to the Transit Gateway using a VPC attachment."
      },
      {
        "id": "concept-3",
        "title": "Transit Gateway route plan",
        "body": "VPCCIDRAttachment subnetVPC route targetTGW routevpc-a10.81.0.0/16Private ATransit GatewayTo VPC B/Cvpc-b10.82.0.0/16Private BTransit GatewayTo VPC A/Cvpc-c10.83.0.0/16Private CTransit GatewayTo VPC A/B"
      }
    ],
    "whyItMatters": "This matters because Transit Gateway is the common AWS answer for scalable hub-and-spoke routing across many VPCs.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC A CIDR",
        "value": "10.81.0.0/16"
      },
      {
        "label": "VPC B CIDR",
        "value": "10.82.0.0/16"
      },
      {
        "label": "VPC C CIDR",
        "value": "10.83.0.0/16"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, Transit Gateway setup, VPC attachments, route changes, testing, and cleanup."
      }
    ],
    "costWarning": "Can cost money: Transit Gateway hourly and data processing charges apply. Delete all resources in the teardown section to stop charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Transit Gateway setup: ec2:CreateTransitGateway, ec2:DescribeTransitGateways, ec2:DeleteTransitGateway Attachments: ec2:CreateTransitGatewayVpcAttachment, ec2:DescribeTransitGatewayVpcAttachments, ec2:DeleteTransitGatewayVpcAttachment Routing: ec2:CreateRoute, ec2:DeleteRoute, ec2:DescribeRouteTables, ec2:DescribeTransitGatewayRouteTables Testing: ec2:DescribeInstances, ec2:DescribeInstanceStatus",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the Transit Gateway",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Transit gateways."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create transit gateway."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-vpc-task12-tgw."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep default route table association and propagation enabled for a simple lab."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create the Transit Gateway."
          }
        ],
        "note": "Wait until the state is Available.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Attach the VPCs",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Transit gateway attachments."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create transit gateway attachment."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose attachment type VPC."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach vpc-a using one private subnet in each AZ."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Repeat for vpc-b and vpc-c."
          }
        ],
        "note": "Use private subnets for the attachment where possible.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Add VPC route table routes",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Route tables."
          },
          {
            "id": "console-step-4-item-2",
            "text": "For vpc-a, add routes to 10.82.0.0/16 and 10.83.0.0/16 with target Transit Gateway."
          },
          {
            "id": "console-step-4-item-3",
            "text": "For vpc-b, add routes to 10.81.0.0/16 and 10.83.0.0/16 with target Transit Gateway."
          },
          {
            "id": "console-step-4-item-4",
            "text": "For vpc-c, add routes to 10.81.0.0/16 and 10.82.0.0/16 with target Transit Gateway."
          }
        ],
        "note": "VPC subnet route tables must point remote VPC CIDRs to the Transit Gateway.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test routing behavior",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to a test instance in vpc-a."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Ping or curl private IPs in vpc-b and vpc-c."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Repeat from another VPC if you have test instances."
          }
        ],
        "note": "Expected: VPCs can route through the Transit Gateway when routes and security allow it.",
        "warning": null,
        "expectedResult": "Expected: VPCs can route through the Transit Gateway when routes and security allow it."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete VPC route table routes that point to the Transit Gateway."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete Transit Gateway VPC attachments."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Wait until attachments are deleted."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the Transit Gateway."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete test instances and security groups if created."
          }
        ],
        "note": null,
        "warning": "Transit Gateway can keep charging while it exists.",
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
            "text": "REGION=eu-west-2\nVPC_A=vpc-replace-a\nVPC_B=vpc-replace-b\nVPC_C=vpc-replace-c\nSUBNET_A=subnet-replace-a\nSUBNET_B=subnet-replace-b\nSUBNET_C=subnet-replace-c\nRTB_A=rtb-replace-a\nRTB_B=rtb-replace-b\nRTB_C=rtb-replace-c"
          }
        ],
        "note": "Use private subnet IDs for attachments.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Transit Gateway",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "TGW_ID=$(aws ec2 create-transit-gateway --region $REGION --description saa-vpc-task12-tgw --options DefaultRouteTableAssociation=enable,DefaultRouteTablePropagation=enable --query 'TransitGateway.TransitGatewayId' --output text)\necho $TGW_ID\naws ec2 wait transit-gateway-available --region $REGION --transit-gateway-ids $TGW_ID"
          }
        ],
        "note": "Expected: the Transit Gateway becomes available.",
        "warning": null,
        "expectedResult": "Expected: the Transit Gateway becomes available."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create VPC attachments",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "ATTACH_A=$(aws ec2 create-transit-gateway-vpc-attachment --region $REGION --transit-gateway-id $TGW_ID --vpc-id $VPC_A --subnet-ids $SUBNET_A --query 'TransitGatewayVpcAttachment.TransitGatewayAttachmentId' --output text)\nATTACH_B=$(aws ec2 create-transit-gateway-vpc-attachment --region $REGION --transit-gateway-id $TGW_ID --vpc-id $VPC_B --subnet-ids $SUBNET_B --query 'TransitGatewayVpcAttachment.TransitGatewayAttachmentId' --output text)\nATTACH_C=$(aws ec2 create-transit-gateway-vpc-attachment --region $REGION --transit-gateway-id $TGW_ID --vpc-id $VPC_C --subnet-ids $SUBNET_C --query 'TransitGatewayVpcAttachment.TransitGatewayAttachmentId' --output text)\necho $ATTACH_A $ATTACH_B $ATTACH_C"
          }
        ],
        "note": "Wait until each attachment is available before testing.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Add VPC routes to TGW",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-route --region $REGION --route-table-id $RTB_A --destination-cidr-block 10.82.0.0/16 --transit-gateway-id $TGW_ID\naws ec2 create-route --region $REGION --route-table-id $RTB_A --destination-cidr-block 10.83.0.0/16 --transit-gateway-id $TGW_ID\naws ec2 create-route --region $REGION --route-table-id $RTB_B --destination-cidr-block 10.81.0.0/16 --transit-gateway-id $TGW_ID\naws ec2 create-route --region $REGION --route-table-id $RTB_B --destination-cidr-block 10.83.0.0/16 --transit-gateway-id $TGW_ID\naws ec2 create-route --region $REGION --route-table-id $RTB_C --destination-cidr-block 10.81.0.0/16 --transit-gateway-id $TGW_ID\naws ec2 create-route --region $REGION --route-table-id $RTB_C --destination-cidr-block 10.82.0.0/16 --transit-gateway-id $TGW_ID"
          }
        ],
        "note": "Expected: route creation returns true.",
        "warning": null,
        "expectedResult": "Expected: route creation returns true."
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
            "text": "aws ec2 delete-route --region $REGION --route-table-id $RTB_A --destination-cidr-block 10.82.0.0/16\naws ec2 delete-route --region $REGION --route-table-id $RTB_A --destination-cidr-block 10.83.0.0/16\naws ec2 delete-route --region $REGION --route-table-id $RTB_B --destination-cidr-block 10.81.0.0/16\naws ec2 delete-route --region $REGION --route-table-id $RTB_B --destination-cidr-block 10.83.0.0/16\naws ec2 delete-route --region $REGION --route-table-id $RTB_C --destination-cidr-block 10.81.0.0/16\naws ec2 delete-route --region $REGION --route-table-id $RTB_C --destination-cidr-block 10.82.0.0/16\naws ec2 delete-transit-gateway-vpc-attachment --region $REGION --transit-gateway-attachment-id $ATTACH_A\naws ec2 delete-transit-gateway-vpc-attachment --region $REGION --transit-gateway-attachment-id $ATTACH_B\naws ec2 delete-transit-gateway-vpc-attachment --region $REGION --transit-gateway-attachment-id $ATTACH_C\naws ec2 delete-transit-gateway --region $REGION --transit-gateway-id $TGW_ID"
          }
        ],
        "note": "Delete routes first, then attachments, then the Transit Gateway.",
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Transit Gateway",
        "body": "Central routing hub for VPCs, VPNs, and Direct Connect."
      },
      {
        "id": "cs-2",
        "title": "VPC route tables",
        "body": "Each VPC still needs routes to remote CIDRs."
      },
      {
        "id": "cs-3",
        "title": "Cost warning",
        "body": "Transit Gateway has hourly and data processing charges."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Attachment pending",
        "body": "Wait for the VPC attachment to become Available."
      },
      {
        "id": "ts-2",
        "title": "No connectivity",
        "body": "Check VPC routes, TGW routes, security groups, NACLs, and instance firewalls."
      },
      {
        "id": "ts-3",
        "title": "Unexpected cost",
        "body": "Delete attachments and the Transit Gateway after the lab."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: Transit Gateway routes appear automatically everywhere. Correct: VPC subnet route tables still need routes."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: VPC peering is best for many VPCs. Correct: Transit Gateway scales better for hub-and-spoke."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: Transit Gateway is free. Correct: it can create hourly and data charges."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "TGW is the roundabout. Many roads meet in one central place.",
    "flashcardSetId": "vpc_task_12_flashcards"
  },
  {
    "id": "task-saa-vpc-create-an-s3-gateway-vpc-endpoint-013",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Create an S3 Gateway VPC Endpoint",
    "slug": "create-an-s3-gateway-vpc-endpoint",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a Gateway VPC Endpoint for Amazon S3 and test S3 access from a private subnet without an Internet Gateway or NAT Gateway.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Gateway endpoint",
        "body": "A Gateway VPC Endpoint adds a route for S3 or DynamoDB traffic."
      },
      {
        "id": "concept-2",
        "title": "S3 private access",
        "body": "Instances can reach S3 privately without an Internet Gateway or NAT device."
      },
      {
        "id": "concept-3",
        "title": "Endpoint route plan",
        "body": "Route tableSubnet typeEndpoint routeInternet neededPrivate route tablePrivate subnetS3 prefix list to endpointNoPublic route tablePublic subnetOptional for labNo for S3 pathMain route tableDependsOnly if associatedNo for S3 path"
      }
    ],
    "whyItMatters": "This matters because Gateway Endpoints are a common exam answer for private S3 access from a VPC without internet egress.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC CIDR",
        "value": "10.90.0.0/16"
      },
      {
        "label": "Bucket name",
        "value": "saa-vpc-task13-s3-[account-id]"
      },
      {
        "label": "Endpoint type",
        "value": "Gateway endpoint for Amazon S3"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC endpoint setup, route table read/change, S3 testing, and cleanup."
      }
    ],
    "costWarning": "Very low: S3 storage and requests can create small charges; S3 Gateway Endpoints have no hourly charge. Delete all resources in the teardown section to stop charges. NAT Gateways incur hourly availability charges (~$0.045/hr) plus data processing charges per GB. Always delete NAT Gateways and release Elastic IPs immediately after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC endpoint setup: ec2:CreateVpcEndpoint, ec2:DescribeVpcEndpoints, ec2:DeleteVpcEndpoints Route table read: ec2:DescribeRouteTables, ec2:ModifyVpcEndpoint S3 testing: s3:CreateBucket, s3:PutObject, s3:GetObject, s3:ListBucket, s3:DeleteObject, s3:DeleteBucket",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a test S3 bucket",
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
            "text": "Use name saa-vpc-task13-s3-[account-id]."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Region eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Block Public Access enabled."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create the bucket and upload a small test file."
          }
        ],
        "note": "Do not upload real company data.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the Gateway VPC Endpoint",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Endpoints."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create endpoint."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For service category, choose AWS services."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Search for com.amazonaws.eu-west-2.s3."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose type Gateway."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose your lab VPC."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Select the private subnet route table."
          },
          {
            "id": "console-step-3-item-9",
            "text": "Choose Full access for the first test."
          },
          {
            "id": "console-step-3-item-10",
            "text": "Create the endpoint."
          }
        ],
        "note": "The endpoint adds an S3 prefix list route to selected route tables.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Remove internet egress from private route if needed",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the private route table."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Confirm there is no 0.0.0.0/0 route to an Internet Gateway."
          },
          {
            "id": "console-step-4-item-3",
            "text": "For a strict test, remove the default route to NAT Gateway only after checking it is not needed by other labs."
          }
        ],
        "note": null,
        "warning": "Do not remove shared lab routes if other running resources need them.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test S3 from a private instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to a private EC2 instance using Session Manager or a bastion."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Run aws s3 ls s3://saa-vpc-task13-s3-[account-id]."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Download the test file."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm the instance can reach S3 without public internet routing."
          }
        ],
        "note": "Expected: S3 works even without IGW or NAT egress.",
        "warning": null,
        "expectedResult": "Expected: S3 works even without IGW or NAT egress."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete the S3 Gateway Endpoint."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete test objects from the S3 bucket."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the S3 bucket."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Restore any route you changed only if it is still needed."
          }
        ],
        "note": null,
        "warning": "Check the bucket is empty before deleting it.",
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
            "text": "REGION=eu-west-2\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nVPC_ID=vpc-replace\nRTB_ID=rtb-replace-private\nBUCKET=saa-vpc-task13-s3-$ACCOUNT_ID"
          }
        ],
        "note": "Replace the VPC ID and private route table ID.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create S3 bucket and test object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --region $REGION --bucket $BUCKET --create-bucket-configuration LocationConstraint=$REGION\necho 'hello from s3 endpoint lab' > task13-test.txt\naws s3 cp task13-test.txt s3://$BUCKET/task13-test.txt"
          }
        ],
        "note": "Bucket names must be globally unique.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create S3 Gateway Endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "VPCE_ID=$(aws ec2 create-vpc-endpoint --region $REGION --vpc-id $VPC_ID --service-name com.amazonaws.$REGION.s3 --vpc-endpoint-type Gateway --route-table-ids $RTB_ID --query 'VpcEndpoint.VpcEndpointId' --output text)\necho $VPCE_ID\naws ec2 describe-vpc-endpoints --region $REGION --vpc-endpoint-ids $VPCE_ID --query 'VpcEndpoints[0].[VpcEndpointId,State,ServiceName]' --output table"
          }
        ],
        "note": "Expected: endpoint state becomes available.",
        "warning": null,
        "expectedResult": "Expected: endpoint state becomes available."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Test S3 listing from private instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3 ls s3://$BUCKET/\naws s3 cp s3://$BUCKET/task13-test.txt ./downloaded-task13-test.txt"
          }
        ],
        "note": "Run this from the private EC2 instance CLI to prove private S3 access.",
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
            "text": "aws ec2 delete-vpc-endpoints --region $REGION --vpc-endpoint-ids $VPCE_ID\naws s3 rm s3://$BUCKET/task13-test.txt\naws s3api delete-bucket --region $REGION --bucket $BUCKET\nrm -f task13-test.txt downloaded-task13-test.txt"
          }
        ],
        "note": "Delete endpoint first, then S3 objects, then bucket.",
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Gateway endpoint",
        "body": "Route table target for S3 or DynamoDB."
      },
      {
        "id": "cs-2",
        "title": "No hourly charge",
        "body": "S3 Gateway Endpoints do not have an endpoint hourly charge."
      },
      {
        "id": "cs-3",
        "title": "Route table scope",
        "body": "Only selected route tables use the endpoint."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "S3 still fails",
        "body": "Check the private route table is selected on the endpoint."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied",
        "body": "Check IAM identity permissions, bucket policy, and endpoint policy."
      },
      {
        "id": "ts-3",
        "title": "Wrong Region",
        "body": "Use the S3 endpoint service name for the same Region as the VPC."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: use NAT Gateway for private S3 access. Correct: use an S3 Gateway Endpoint when possible."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: Gateway Endpoints use PrivateLink. Correct: Gateway Endpoints do not use PrivateLink."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: endpoint applies to all subnets. Correct: it applies through selected route tables."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "S3 Gateway Endpoint is a private shortcut. The route table sends S3 traffic straight to AWS.",
    "flashcardSetId": "vpc_task_13_flashcards"
  },
  {
    "id": "task-saa-vpc-create-an-interface-vpc-endpoint-for-secrets-manager-014",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Create an Interface VPC Endpoint for Secrets Manager",
    "slug": "create-an-interface-vpc-endpoint-for-secrets-manager",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an Interface VPC Endpoint using AWS PrivateLink so private resources can call the Secrets Manager API without internet egress.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Interface endpoint",
        "body": "An Interface VPC Endpoint creates elastic network interfaces in your subnets."
      },
      {
        "id": "concept-2",
        "title": "Private DNS",
        "body": "Private DNS lets apps use the normal service hostname and still resolve to private endpoint IPs."
      },
      {
        "id": "concept-3",
        "title": "Interface endpoint plan",
        "body": "ItemValueReasonEndpoint servicecom.amazonaws.eu-west-2.secretsmanagerPrivate Secrets Manager APIEndpoint typeInterfaceCreates endpoint ENIsSecurity group inboundTCP 443 from VPC CIDRHTTPS API accessPrivate DNSEnabledUse normal AWS DNS name"
      }
    ],
    "whyItMatters": "This matters because many private workloads need AWS API access without NAT Gateway or public internet routes.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Endpoint service",
        "value": "com.amazonaws.eu-west-2.secretsmanager"
      },
      {
        "label": "Security group",
        "value": "saa-vpc-task14-endpoint-sg"
      },
      {
        "label": "Test secret",
        "value": "saa/vpc/task14/test"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, interface endpoint setup, security group setup, Secrets Manager testing, and cleanup."
      }
    ],
    "costWarning": "Can cost money: Interface endpoints have hourly and data processing charges. Delete all resources in the teardown section to stop charges. NAT Gateways incur hourly availability charges (~$0.045/hr) plus data processing charges per GB. Always delete NAT Gateways and release Elastic IPs immediately after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Endpoint setup: ec2:CreateVpcEndpoint, ec2:DescribeVpcEndpoints, ec2:DeleteVpcEndpoints Network setup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:DeleteSecurityGroup, ec2:DescribeSubnets, ec2:DescribeVpcs Secrets Manager test: secretsmanager:CreateSecret, secretsmanager:GetSecretValue, secretsmanager:DeleteSecret",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the endpoint security group",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Security groups."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create a security group named saa-vpc-task14-endpoint-sg in your lab VPC."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Add inbound rule: HTTPS, TCP 443, source as your VPC CIDR such as 10.100.0.0/16."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep outbound allowed."
          }
        ],
        "note": "The endpoint ENI must allow HTTPS from your private clients.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the interface endpoint",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Endpoints."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create endpoint."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For service category, choose AWS services."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Search for com.amazonaws.eu-west-2.secretsmanager."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose type Interface."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose your lab VPC and private subnets."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Enable Private DNS name."
          },
          {
            "id": "console-step-3-item-9",
            "text": "Choose security group saa-vpc-task14-endpoint-sg."
          },
          {
            "id": "console-step-3-item-10",
            "text": "Create the endpoint."
          }
        ],
        "note": "Wait until the endpoint state is Available.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create a test secret",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open AWS Secrets Manager."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Store a new secret."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Other type of secret."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Use key username and value lab-user."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Name it saa/vpc/task14/test."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Store the secret."
          }
        ],
        "note": null,
        "warning": "Do not store real passwords in this lab.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test from a private instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to a private EC2 instance."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Run aws secretsmanager get-secret-value --secret-id saa/vpc/task14/test --region eu-west-2."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm the call succeeds without NAT or public internet egress."
          }
        ],
        "note": "Expected: the secret value is returned.",
        "warning": null,
        "expectedResult": "Expected: the secret value is returned."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Schedule deletion of the test secret with a short recovery window."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the interface VPC endpoint."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Wait until endpoint ENIs are gone."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete saa-vpc-task14-endpoint-sg."
          }
        ],
        "note": null,
        "warning": "Interface endpoints can keep charging until deleted.",
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
            "text": "REGION=eu-west-2\nVPC_ID=vpc-replace\nSUBNET_1=subnet-replace-a\nSUBNET_2=subnet-replace-b\nVPC_CIDR=10.100.0.0/16\nSECRET_NAME=saa/vpc/task14/test"
          }
        ],
        "note": "Replace VPC and subnet IDs with private subnets.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create endpoint security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name saa-vpc-task14-endpoint-sg --description 'Task 14 endpoint SG' --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 443 --cidr $VPC_CIDR\necho $SG_ID"
          }
        ],
        "note": "Expected: a security group ID is returned.",
        "warning": null,
        "expectedResult": "Expected: a security group ID is returned."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create interface endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "VPCE_ID=$(aws ec2 create-vpc-endpoint --region $REGION --vpc-id $VPC_ID --service-name com.amazonaws.$REGION.secretsmanager --vpc-endpoint-type Interface --subnet-ids $SUBNET_1 $SUBNET_2 --security-group-ids $SG_ID --private-dns-enabled --query 'VpcEndpoint.VpcEndpointId' --output text)\necho $VPCE_ID\naws ec2 describe-vpc-endpoints --region $REGION --vpc-endpoint-ids $VPCE_ID --query 'VpcEndpoints[0].[VpcEndpointId,State,PrivateDnsEnabled]' --output table"
          }
        ],
        "note": "Expected: endpoint state becomes available.",
        "warning": null,
        "expectedResult": "Expected: endpoint state becomes available."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create and read a test secret",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws secretsmanager create-secret --region $REGION --name $SECRET_NAME --secret-string '{\"username\":\"lab-user\"}'\naws secretsmanager get-secret-value --region $REGION --secret-id $SECRET_NAME --query SecretString --output text"
          }
        ],
        "note": "Run the get command from a private instance to prove private API access.",
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
            "text": "aws secretsmanager delete-secret --region $REGION --secret-id $SECRET_NAME --recovery-window-in-days 7\naws ec2 delete-vpc-endpoints --region $REGION --vpc-endpoint-ids $VPCE_ID\naws ec2 delete-security-group --region $REGION --group-id $SG_ID"
          }
        ],
        "note": "If security group deletion fails, wait until endpoint ENIs are fully removed.",
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Interface endpoint",
        "body": "PrivateLink endpoint for AWS APIs and endpoint services."
      },
      {
        "id": "cs-2",
        "title": "Security group",
        "body": "Interface endpoints use security groups because they create ENIs."
      },
      {
        "id": "cs-3",
        "title": "Private DNS",
        "body": "Keeps normal service names working privately."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Endpoint unavailable",
        "body": "Wait for endpoint state Available before testing."
      },
      {
        "id": "ts-2",
        "title": "Timeout",
        "body": "Check endpoint security group inbound TCP 443 from the client subnet or security group."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check IAM permissions for Secrets Manager and any endpoint policy."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: Gateway Endpoint for Secrets Manager. Correct: Secrets Manager uses an Interface Endpoint."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: route table entry is the main control. Correct: Interface Endpoints use ENIs and security groups."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: Interface Endpoints are free. Correct: they can have hourly and data charges."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Interface endpoint is a private API door. Your app knocks on HTTPS 443 inside the VPC.",
    "flashcardSetId": "vpc_task_14_flashcards"
  },
  {
    "id": "task-saa-vpc-restrict-access-with-a-vpc-endpoint-policy-015",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Restrict access with a VPC endpoint policy",
    "slug": "restrict-access-with-a-vpc-endpoint-policy",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Attach an endpoint policy that allows only a specific principal to access a specific S3 bucket through the VPC Endpoint.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Endpoint policy",
        "body": "An endpoint policy controls which principals can use the endpoint to access a service."
      },
      {
        "id": "concept-2",
        "title": "Not the only permission",
        "body": "IAM policy, bucket policy, and endpoint policy must all allow the request."
      },
      {
        "id": "concept-3",
        "title": "Policy plan",
        "body": "Policy partValuePurposePrincipalCurrent IAM ARNOnly this principal uses endpointActions3:GetObject, s3:ListBucketRead-only testResourceBucket and objectsLimit to one bucketEffectAllowEverything else denied by endpoint policy"
      }
    ],
    "whyItMatters": "This matters because endpoint policies add a network-side access guard for private service access.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Endpoint type",
        "value": "S3 Gateway Endpoint"
      },
      {
        "label": "Bucket name",
        "value": "saa-vpc-task15-policy-[account-id]"
      },
      {
        "label": "Allowed principal",
        "value": "Current caller ARN from sts get-caller-identity"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC endpoint setup, endpoint policy update, S3 testing, and cleanup."
      }
    ],
    "costWarning": "Very low: S3 storage and requests can create small charges; S3 Gateway Endpoints have no hourly charge. Delete all resources in the teardown section to stop charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Endpoint policy: ec2:ModifyVpcEndpoint, ec2:DescribeVpcEndpoints VPC endpoint setup: ec2:CreateVpcEndpoint, ec2:DeleteVpcEndpoints, ec2:DescribeRouteTables S3 test: s3:CreateBucket, s3:PutObject, s3:GetObject, s3:ListBucket, s3:DeleteObject, s3:DeleteBucket",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create or choose an S3 Gateway Endpoint",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Endpoints."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use an existing S3 Gateway Endpoint or create one for com.amazonaws.eu-west-2.s3."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Select the private route table for your lab subnet."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Start with full access so you can test before restricting it."
          }
        ],
        "note": "This lab uses S3 because Gateway Endpoint policies are easy to test.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a test bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open S3."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create bucket saa-vpc-task15-policy-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Keep Block Public Access enabled."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Upload a small file named allowed-test.txt."
          }
        ],
        "note": null,
        "warning": "Do not upload real data.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Build the endpoint policy",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Get your current IAM principal ARN from CloudShell using aws sts get-caller-identity."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open the S3 Gateway Endpoint."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose the Policy tab."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Edit policy."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Allow only your current principal to run s3:ListBucket and s3:GetObject on the test bucket."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Save the policy."
          }
        ],
        "note": "Endpoint policy is not a replacement for IAM. The principal still needs IAM permission too.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test allowed and denied access",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "From the allowed principal, list the test bucket."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Try with another role or user if available."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm only the allowed principal can use the endpoint for the bucket actions."
          }
        ],
        "note": "Expected: allowed principal works; a different principal is denied by the endpoint policy.",
        "warning": null,
        "expectedResult": "Expected: allowed principal works; a different principal is denied by the endpoint policy."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Reset the endpoint policy to full access or delete the endpoint."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete test objects from the S3 bucket."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the S3 bucket."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the endpoint if it was created only for this lab."
          }
        ],
        "note": null,
        "warning": "A restrictive endpoint policy can break other labs using the same endpoint.",
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
            "text": "REGION=eu-west-2\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nCALLER_ARN=$(aws sts get-caller-identity --query Arn --output text)\nVPC_ID=vpc-replace\nRTB_ID=rtb-replace-private\nBUCKET=saa-vpc-task15-policy-$ACCOUNT_ID\necho $CALLER_ARN"
          }
        ],
        "note": "The current caller ARN becomes the allowed principal.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create bucket and endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --region $REGION --bucket $BUCKET --create-bucket-configuration LocationConstraint=$REGION\necho 'endpoint policy test' > allowed-test.txt\naws s3 cp allowed-test.txt s3://$BUCKET/allowed-test.txt\nVPCE_ID=$(aws ec2 create-vpc-endpoint --region $REGION --vpc-id $VPC_ID --service-name com.amazonaws.$REGION.s3 --vpc-endpoint-type Gateway --route-table-ids $RTB_ID --query 'VpcEndpoint.VpcEndpointId' --output text)\necho $VPCE_ID"
          }
        ],
        "note": "If you already have an S3 Gateway Endpoint, set VPCE_ID to that endpoint ID instead.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create endpoint policy file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > task15-endpoint-policy.json <<EOF\n{\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": {\"AWS\": \"$CALLER_ARN\"},\n      \"Action\": [\"s3:ListBucket\", \"s3:GetObject\"],\n      \"Resource\": [\"arn:aws:s3:::$BUCKET\", \"arn:aws:s3:::$BUCKET/*\"]\n    }\n  ]\n}\nEOF\ncat task15-endpoint-policy.json"
          }
        ],
        "note": "This policy allows only the current caller ARN for this test bucket.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Apply endpoint policy and test",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 modify-vpc-endpoint --region $REGION --vpc-endpoint-id $VPCE_ID --policy-document file://task15-endpoint-policy.json\naws s3 ls s3://$BUCKET/\naws s3 cp s3://$BUCKET/allowed-test.txt ./downloaded-task15.txt"
          }
        ],
        "note": "Run the S3 test from a resource using the endpoint route.",
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
            "text": "aws ec2 delete-vpc-endpoints --region $REGION --vpc-endpoint-ids $VPCE_ID\naws s3 rm s3://$BUCKET/allowed-test.txt\naws s3api delete-bucket --region $REGION --bucket $BUCKET\nrm -f allowed-test.txt downloaded-task15.txt task15-endpoint-policy.json"
          }
        ],
        "note": "Delete endpoint first if it was created only for this lab.",
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Endpoint policy",
        "body": "Resource policy attached to a VPC Endpoint."
      },
      {
        "id": "cs-2",
        "title": "Layered access",
        "body": "IAM + bucket policy + endpoint policy must allow access."
      },
      {
        "id": "cs-3",
        "title": "Safe scope",
        "body": "Restrict by principal, action, and resource."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied for allowed user",
        "body": "Check the principal ARN exactly matches aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Still allowed unexpectedly",
        "body": "Confirm traffic is using the VPC Endpoint route, not internet or NAT."
      },
      {
        "id": "ts-3",
        "title": "Other labs break",
        "body": "Do not restrict a shared endpoint used by other labs."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: endpoint policy grants all needed access alone. Correct: IAM and resource policies must also allow."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: endpoint policy controls internet users. Correct: it controls use through the endpoint."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: use bare wildcard principal in secure designs. Correct: restrict principals when required."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Endpoint policy is the checkpoint. Even private traffic must show the right badge.",
    "flashcardSetId": "vpc_task_15_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-vpc-dns-options-and-test-private-dns-for-endpoints-016",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure VPC DNS options and test private DNS for endpoints",
    "slug": "configure-vpc-dns-options-and-test-private-dns-for-endpoints",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Enable enableDnsSupport and enableDnsHostnames, then test private DNS for an interface endpoint.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "DNS support",
        "body": "enableDnsSupport lets the VPC use Amazon-provided DNS resolution."
      },
      {
        "id": "concept-2",
        "title": "DNS hostnames",
        "body": "enableDnsHostnames lets instances receive DNS hostnames when needed."
      },
      {
        "id": "concept-3",
        "title": "DNS settings plan",
        "body": "SettingValueWhyenableDnsSupporttrueAllows DNS resolutionenableDnsHostnamestrueAllows DNS hostnamesPrivate DNS on endpointEnabledPublic service name resolves to private IP"
      }
    ],
    "whyItMatters": "This matters because private endpoints depend on DNS. If private DNS is wrong, traffic may leave the VPC or fail.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "saa-vpc-task16"
      },
      {
        "label": "Endpoint service",
        "value": "com.amazonaws.eu-west-2.secretsmanager"
      },
      {
        "label": "Test service name",
        "value": "secretsmanager.eu-west-2.amazonaws.com"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC networking changes, related service setup, verification, and cleanup for this lab."
      }
    ],
    "costWarning": "Low if endpoint and EC2 are deleted quickly. Delete resources after testing. VPN, Direct Connect, endpoints, EC2, CloudWatch Logs, and data transfer can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC DNS settings: ec2:DescribeVpcs, ec2:ModifyVpcAttribute Endpoint testing: ec2:DescribeVpcEndpoints, ec2:CreateVpcEndpoint, ec2:ModifyVpcEndpoint, ec2:DeleteVpcEndpoints EC2 test instance: ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances Security groups: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the VPC DNS settings",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Select the lab VPC saa-vpc-task16."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Edit VPC settings."
          }
        ],
        "note": "Use an existing lab VPC or create one with at least one private subnet first.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable both DNS options",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Turn on DNS resolution."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Turn on DNS hostnames."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Save."
          }
        ],
        "note": "Success: both VPC DNS attributes show enabled.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create an interface endpoint with private DNS",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC → Endpoints."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create endpoint."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Service category: AWS services."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Service: com.amazonaws.eu-west-2.secretsmanager."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose the lab VPC and private subnet."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Enable Private DNS name."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Attach a security group that allows HTTPS 443 from the test instance security group."
          }
        ],
        "note": "Endpoint ENIs are created in the selected subnets.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test DNS from a private instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to a private test EC2 instance using Session Manager or a bastion."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Run nslookup secretsmanager.eu-west-2.amazonaws.com."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm the result resolves to private VPC IPs."
          }
        ],
        "note": null,
        "warning": "Do not open SSH to the world for this test.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete the interface endpoint."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Terminate the test instance if created."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete endpoint security groups if no longer used."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Leave VPC DNS enabled unless the lab requires it off."
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
            "text": "REGION=eu-west-2\nVPC_ID=vpc-xxxxxxxx\nSUBNET_ID=subnet-xxxxxxxx\nSG_ID=sg-xxxxxxxx"
          }
        ],
        "note": "Replace IDs with your lab values.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Enable VPC DNS attributes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 modify-vpc-attribute --region $REGION --vpc-id $VPC_ID --enable-dns-support '{\"Value\":true}'\naws ec2 modify-vpc-attribute --region $REGION --vpc-id $VPC_ID --enable-dns-hostnames '{\"Value\":true}'"
          }
        ],
        "note": "Expected: no error output.",
        "warning": null,
        "expectedResult": "Expected: no error output."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the interface endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-vpc-endpoint --region $REGION --vpc-id $VPC_ID --vpc-endpoint-type Interface --service-name com.amazonaws.eu-west-2.secretsmanager --subnet-ids $SUBNET_ID --security-group-ids $SG_ID --private-dns-enabled"
          }
        ],
        "note": "Expected: endpoint state moves to available.",
        "warning": null,
        "expectedResult": "Expected: endpoint state moves to available."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify endpoint DNS setting",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-vpc-endpoints --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'VpcEndpoints[*].{Endpoint:VpcEndpointId,PrivateDns:PrivateDnsEnabled,State:State}' --output table"
          }
        ],
        "note": "Expected: PrivateDns is True.",
        "warning": null,
        "expectedResult": "Expected: PrivateDns is True."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Cleanup endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "ENDPOINT_ID=vpce-xxxxxxxx\naws ec2 delete-vpc-endpoints --region $REGION --vpc-endpoint-ids $ENDPOINT_ID"
          }
        ],
        "note": null,
        "warning": "Only delete the endpoint created for this lab.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "DNS endpoint checklist",
        "body": "CheckGood resultBad signVPC DNS supportEnabledDNS lookup failsVPC DNS hostnamesEnabledHostnames missingPrivate DNSEnabledPublic name stays publicEndpoint SGAllows 443Connection timeout"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Private DNS option missing",
        "body": "The service may not support private DNS, or the VPC DNS settings are off."
      },
      {
        "id": "ts-2",
        "title": "DNS still resolves public IPs",
        "body": "Check private DNS on the endpoint and test from inside the VPC."
      },
      {
        "id": "ts-3",
        "title": "Connection timeout",
        "body": "Check endpoint security group inbound HTTPS 443 from the client security group."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "DNS support and hostnames are different",
        "body": "Turning on one does not replace the other."
      },
      {
        "id": "trap-2",
        "title": "Private DNS is not the endpoint itself",
        "body": "Private DNS makes the normal AWS service name resolve to private endpoint IPs."
      },
      {
        "id": "trap-3",
        "title": "Gateway endpoint vs interface endpoint",
        "body": "Gateway endpoints use route tables. Interface endpoints use ENIs and private DNS."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "DNS points the app to the private door. The name stays familiar, but the path stays private.",
    "flashcardSetId": "vpc_task_16_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-customer-gateway-and-virtual-private-gateway-018",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure Customer Gateway and Virtual Private Gateway",
    "slug": "configure-customer-gateway-and-virtual-private-gateway",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Build the AWS and customer VPN gateway pair, then test private traffic over the VPN.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Customer Gateway role",
        "body": "The Customer Gateway stores the on-prem router public IP and ASN."
      },
      {
        "id": "concept-2",
        "title": "Virtual Private Gateway role",
        "body": "The Virtual Private Gateway attaches to the VPC and becomes the AWS VPN target."
      },
      {
        "id": "concept-3",
        "title": "Gateway responsibility table",
        "body": "GatewayLives whereMain jobExam ideaCustomer GatewayOn-prem side represented in AWSNames the router public IPCustomer sideVirtual Private GatewayAWS sideAttaches to one VPCAWS VPN targetVPN connectionBetween bothCreates IPsec tunnelsEncrypted path"
      }
    ],
    "whyItMatters": "This matters because the exam often asks which gateway belongs to which side. Customer Gateway means customer router. Virtual Private Gateway means AWS side.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC CIDR",
        "value": "10.80.0.0/16"
      },
      {
        "label": "On-prem CIDR",
        "value": "192.168.20.0/24"
      },
      {
        "label": "Test protocol",
        "value": "ICMP or TCP 443 allowed both ways"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC networking changes, related service setup, verification, and cleanup for this lab."
      }
    ],
    "costWarning": "Medium; VPN hourly charges can apply. Delete resources after testing. VPN, Direct Connect, endpoints, EC2, CloudWatch Logs, and data transfer can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPN setup: ec2:CreateCustomerGateway, ec2:CreateVpnGateway, ec2:AttachVpnGateway, ec2:CreateVpnConnection, ec2:DescribeVpnConnections Routing: ec2:CreateRoute, ec2:ReplaceRoute, ec2:DescribeRouteTables Cleanup: ec2:DeleteVpnConnection, ec2:DetachVpnGateway, ec2:DeleteVpnGateway, ec2:DeleteCustomerGateway",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the Customer Gateway",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC → Customer gateways."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create customer gateway."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Name: saa-vpc-task18-cgw."
          },
          {
            "id": "console-step-2-item-4",
            "text": "IP address: enter the router public IP."
          },
          {
            "id": "console-step-2-item-5",
            "text": "ASN: use 65000 for a private lab example."
          }
        ],
        "note": null,
        "warning": "A placeholder public IP cannot bring the tunnel up.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create and attach the Virtual Private Gateway",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC → Virtual private gateways."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create virtual private gateway."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name: saa-vpc-task18-vgw."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach it to the lab VPC."
          }
        ],
        "note": "Wait until attachment state is attached.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the VPN connection",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Site-to-Site VPN connections."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create VPN connection."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Target gateway: the new Virtual Private Gateway."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Customer gateway: the new Customer Gateway."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Routing: choose static and add 192.168.20.0/24."
          }
        ],
        "note": "Download configuration and apply it to the on-prem router.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Allow test traffic",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open EC2 → Security Groups."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Allow the chosen test protocol from 192.168.20.0/24 to the private EC2 instance."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm NACLs allow inbound and outbound return traffic."
          }
        ],
        "note": null,
        "warning": "Only allow the exact on-prem test CIDR.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test traffic over VPN",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "From on-prem, connect to the private EC2 IP."
          },
          {
            "id": "console-step-6-item-2",
            "text": "From EC2, connect to an on-prem private test IP."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm traffic does not use a public IP."
          }
        ],
        "note": "Private IP to private IP is the goal.",
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
            "text": "Delete the VPN connection."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Remove VPC route table entries to the on-prem CIDR."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Detach the VGW from the VPC."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the VGW."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the Customer Gateway."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Remove temporary security group rules."
          }
        ],
        "note": null,
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
            "text": "REGION=eu-west-2\nVPC_ID=vpc-xxxxxxxx\nROUTE_TABLE_ID=rtb-xxxxxxxx\nONPREM_CIDR=192.168.20.0/24\nCGW_IP=203.0.113.20"
          }
        ],
        "note": "Use your real lab IDs.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create gateways",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "CGW_ID=$(aws ec2 create-customer-gateway --region $REGION --type ipsec.1 --public-ip $CGW_IP --bgp-asn 65000 --query 'CustomerGateway.CustomerGatewayId' --output text)\nVGW_ID=$(aws ec2 create-vpn-gateway --region $REGION --type ipsec.1 --query 'VpnGateway.VpnGatewayId' --output text)\naws ec2 attach-vpn-gateway --region $REGION --vpn-gateway-id $VGW_ID --vpc-id $VPC_ID\necho $CGW_ID $VGW_ID"
          }
        ],
        "note": "Expected: gateway IDs are returned.",
        "warning": null,
        "expectedResult": "Expected: gateway IDs are returned."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create VPN and route",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "VPN_ID=$(aws ec2 create-vpn-connection --region $REGION --type ipsec.1 --customer-gateway-id $CGW_ID --vpn-gateway-id $VGW_ID --options StaticRoutesOnly=true --query 'VpnConnection.VpnConnectionId' --output text)\naws ec2 create-vpn-connection-route --region $REGION --vpn-connection-id $VPN_ID --destination-cidr-block $ONPREM_CIDR\naws ec2 create-route --region $REGION --route-table-id $ROUTE_TABLE_ID --destination-cidr-block $ONPREM_CIDR --gateway-id $VGW_ID\necho $VPN_ID"
          }
        ],
        "note": "Expected: VPN connection ID is returned.",
        "warning": null,
        "expectedResult": "Expected: VPN connection ID is returned."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify route table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-route-tables --region $REGION --route-table-ids $ROUTE_TABLE_ID --query 'RouteTables[*].Routes[*].{Destination:DestinationCidrBlock,Gateway:GatewayId,State:State}' --output table"
          }
        ],
        "note": "Expected: on-prem CIDR points to the VGW.",
        "warning": null,
        "expectedResult": "Expected: on-prem CIDR points to the VGW."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-vpn-connection --region $REGION --vpn-connection-id $VPN_ID\naws ec2 detach-vpn-gateway --region $REGION --vpn-gateway-id $VGW_ID --vpc-id $VPC_ID\naws ec2 delete-vpn-gateway --region $REGION --vpn-gateway-id $VGW_ID\naws ec2 delete-customer-gateway --region $REGION --customer-gateway-id $CGW_ID"
          }
        ],
        "note": null,
        "warning": "Remove route entries and temporary security rules too.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Gateway comparison",
        "body": "NameSideCreated in AWS?RememberCustomer GatewayCustomer/on-premYes, as a representationCustomer routerVirtual Private GatewayAWS/VPCYesAWS VPN doorVPN connectionBothYesEncrypted tunnel"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Wrong gateway target",
        "body": "Make sure the VPN connection targets the VGW attached to the correct VPC."
      },
      {
        "id": "ts-2",
        "title": "Traffic fails one way",
        "body": "Check return routes and firewall rules on the on-prem router."
      },
      {
        "id": "ts-3",
        "title": "Security group blocks test",
        "body": "Allow the on-prem CIDR on the private EC2 security group."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Customer Gateway is not inside your VPC",
        "body": "It represents the customer router public endpoint."
      },
      {
        "id": "trap-2",
        "title": "Virtual Private Gateway is VPC-side",
        "body": "It attaches to the VPC and can be a VPN target."
      },
      {
        "id": "trap-3",
        "title": "VPN routing is not automatic everywhere",
        "body": "Routes and firewalls must allow both directions."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Customer Gateway = customer side. Virtual Private Gateway = AWS side.",
    "flashcardSetId": "vpc_task_18_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-vpc-sharing-with-aws-ram-020",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure VPC sharing with AWS RAM",
    "slug": "configure-vpc-sharing-with-aws-ram",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Share VPC subnets with another account using AWS Resource Access Manager and verify participant access.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "VPC owner",
        "body": "The owner account creates and manages the VPC, subnets, routes, and network controls."
      },
      {
        "id": "concept-2",
        "title": "Participant account",
        "body": "The participant account can launch supported resources into shared subnets."
      },
      {
        "id": "concept-3",
        "title": "Shared VPC responsibility table",
        "body": "AreaOwner accountParticipant accountExam pointVPC/subnetsCreates and sharesUses shared subnetCentral network controlRoute tablesControls routingCannot own main routingOwner manages networkSecurity groupsCan create/use own SGsCan use participant SGsAccount-level controlEC2 instancesCan launch ownCan launch ownResources stay in participant account"
      }
    ],
    "whyItMatters": "This matters because VPC sharing supports centralised networking. Teams can use shared subnets without each team owning a separate VPC.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Owner account",
        "value": "Network account"
      },
      {
        "label": "Participant account",
        "value": "Application account ID placeholder"
      },
      {
        "label": "Shared resource",
        "value": "Private subnet ARN"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC networking changes, related service setup, verification, and cleanup for this lab."
      }
    ],
    "costWarning": "Low unless test EC2 instances are launched. Delete resources after testing. VPN, Direct Connect, endpoints, EC2, CloudWatch Logs, and data transfer can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC and subnet read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeAvailabilityZones Resource Access Manager: ram:CreateResourceShare, ram:AssociateResourceShare, ram:GetResourceShares, ram:GetResourceShareAssociations, ram:DisassociateResourceShare, ram:DeleteResourceShare Participant test: ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances Cleanup: ram:DisassociateResourceShare, ram:DeleteResourceShare",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Confirm AWS Organizations/RAM setup",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open AWS Resource Access Manager."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Confirm sharing is enabled with AWS Organizations if sharing inside an organization."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Get the participant AWS account ID."
          }
        ],
        "note": "For external accounts, the participant may need to accept the share.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Choose the subnets to share",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC → Subnets."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose private application subnets from the central VPC."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Copy the subnet ARNs if using CLI."
          }
        ],
        "note": null,
        "warning": "Do not share public subnets unless the design requires it.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the resource share",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open AWS RAM → Resource shares."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create resource share."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name: saa-vpc-task20-shared-subnets."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Resource type: Subnets."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Select the private subnets."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Principal: add the participant AWS account ID or OU."
          }
        ],
        "note": "The participant sees shared subnets in their VPC console after the share is active.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Verify from participant account",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Sign in to the participant account."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Open VPC → Subnets."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Look for the shared subnet."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Launch a small test EC2 instance into the shared subnet if needed."
          }
        ],
        "note": null,
        "warning": "Test EC2 instances can create charges.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Check routing and access",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Confirm the test instance uses the shared subnet CIDR."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Confirm routing is controlled by the owner VPC route tables."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm security groups allow only the needed traffic."
          }
        ],
        "note": "Participant resources live in the participant account, but the subnet belongs to the owner VPC.",
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
            "text": "Terminate participant test EC2 instances."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Remove participant account or OU from the resource share."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Disassociate shared subnets from the resource share."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the resource share."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Keep or delete the VPC subnets based on the wider lab."
          }
        ],
        "note": null,
        "warning": "Do not delete central networking resources used by other labs.",
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
            "text": "REGION=eu-west-2\nSHARE_NAME=saa-vpc-task20-shared-subnets\nPARTICIPANT_ACCOUNT=123456789012\nSUBNET_ARN=arn:aws:ec2:eu-west-2:111122223333:subnet/subnet-xxxxxxxx"
          }
        ],
        "note": "Replace with real account IDs and subnet ARN.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create RAM resource share",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SHARE_ARN=$(aws ram create-resource-share --region $REGION --name $SHARE_NAME --resource-arns $SUBNET_ARN --principals $PARTICIPANT_ACCOUNT --query 'resourceShare.resourceShareArn' --output text)\necho $SHARE_ARN"
          }
        ],
        "note": "Expected: resource share ARN is returned.",
        "warning": null,
        "expectedResult": "Expected: resource share ARN is returned."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify share associations",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ram get-resource-share-associations --region $REGION --association-type RESOURCE --resource-share-arns $SHARE_ARN --output table\naws ram get-resource-share-associations --region $REGION --association-type PRINCIPAL --resource-share-arns $SHARE_ARN --output table"
          }
        ],
        "note": "Expected: resource and principal associations appear.",
        "warning": null,
        "expectedResult": "Expected: resource and principal associations appear."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Participant checks shared subnet",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-subnets --region $REGION --filters Name=subnet-id,Values=subnet-xxxxxxxx --query 'Subnets[*].{Subnet:SubnetId,Vpc:VpcId,Cidr:CidrBlock,Owner:OwnerId}' --output table"
          }
        ],
        "note": "Run this from the participant account profile after the share is active.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Cleanup RAM share",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ram disassociate-resource-share --region $REGION --resource-share-arn $SHARE_ARN --resource-arns $SUBNET_ARN --principals $PARTICIPANT_ACCOUNT\naws ram delete-resource-share --region $REGION --resource-share-arn $SHARE_ARN"
          }
        ],
        "note": null,
        "warning": "Terminate test resources before removing the share.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "VPC sharing decision table",
        "body": "NeedUse VPC sharing?ReasonCentral network teamYesOwner controls VPC designSeparate app accountsYesParticipants launch own resourcesCross-Region networkNoSubnet sharing is RegionalConnect two VPCsNoUse peering or Transit Gateway"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Participant cannot see subnet",
        "body": "Check RAM share status, organization sharing, account ID, Region, and whether the invite was accepted."
      },
      {
        "id": "ts-2",
        "title": "Cannot launch resource",
        "body": "Check participant IAM permissions and subnet capacity."
      },
      {
        "id": "ts-3",
        "title": "Traffic fails",
        "body": "Check owner route tables, NACLs, and participant security groups."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "VPC sharing is not VPC peering",
        "body": "Sharing lets accounts use the same subnets. Peering connects separate VPCs."
      },
      {
        "id": "trap-2",
        "title": "Owner controls network resources",
        "body": "The VPC owner controls subnets, route tables, and NACLs."
      },
      {
        "id": "trap-3",
        "title": "Participant owns launched resources",
        "body": "The EC2 instance belongs to the participant account, not the network owner."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "One VPC, many accounts. The network account owns the roads; app accounts drive on them.",
    "flashcardSetId": "vpc_task_20_flashcards"
  },
  {
    "id": "task-saa-vpc-implement-an-asymmetric-routing-scenario-021",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Implement an asymmetric routing scenario",
    "slug": "implement-an-asymmetric-routing-scenario",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Build a small VPC routing scenario, show the asymmetric routing pitfall, and fix forwarding by disabling source/destination checks on the router instance.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Asymmetric routing",
        "body": "Traffic leaves one path but returns another path. Stateful firewalls and appliances may drop it."
      },
      {
        "id": "concept-2",
        "title": "Source/destination check",
        "body": "EC2 normally expects traffic to start or end on itself. Disable this for NAT, routing, or firewall appliances."
      },
      {
        "id": "concept-3",
        "title": "Route plan",
        "body": "SubnetRouteTargetWhyprivate-a10.90.20.0/24eni-router-aSend traffic through applianceprivate-b10.90.10.0/24eni-router-bReturn path must matchRouter instanceSource/dest checkDisabledAllows forwarding"
      }
    ],
    "whyItMatters": "This matters because routing mistakes can break private connectivity. AWS exams often test route targets, source/destination checks, endpoint policies, and multi-VPC design choices.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC CIDR",
        "value": "10.90.0.0/16"
      },
      {
        "label": "Subnet A",
        "value": "10.90.10.0/24"
      },
      {
        "label": "Subnet B",
        "value": "10.90.20.0/24"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2/VPC networking setup, route or endpoint changes, basic test resources, and cleanup."
      }
    ],
    "costWarning": "Low to medium Delete all resources after testing. Public IPv4 addresses, EC2, NAT, Transit Gateway, Direct Connect, endpoints, logs, and DynamoDB can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC and EC2 read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeInstances, ec2:DescribeNetworkInterfaces Route appliance setup: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateRouteTable, ec2:CreateRoute, ec2:AssociateRouteTable, ec2:RunInstances, ec2:CreateNetworkInterface, ec2:AttachNetworkInterface, ec2:ModifyInstanceAttribute Security and cleanup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:TerminateInstances, ec2:DeleteNetworkInterface, ec2:DeleteRouteTable, ec2:DeleteSubnet, ec2:DeleteVpc",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the VPC and two private subnets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use CIDR 10.90.0.0/16."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create private-a in eu-west-2a with 10.90.10.0/24."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Create private-b in eu-west-2a with 10.90.20.0/24."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a router instance",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Launch a small Amazon Linux instance in private-a."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create a second ENI in private-b."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach the second ENI to the router instance."
          },
          {
            "id": "console-step-3-item-5",
            "text": "On the instance, choose Actions, Networking, Change source/destination check."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Set source/destination check to Stop."
          }
        ],
        "note": "A routing appliance must forward traffic that is not sourced from itself.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Add route entries",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Route tables."
          },
          {
            "id": "console-step-4-item-2",
            "text": "For subnet A, add route 10.90.20.0/24 to the router ENI."
          },
          {
            "id": "console-step-4-item-3",
            "text": "For subnet B, add route 10.90.10.0/24 to the router ENI."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Keep the return path symmetrical for testing."
          }
        ],
        "note": null,
        "warning": "Wrong return routes create asymmetric routing.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Remove custom routes first."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Terminate test instances."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Detach and delete extra ENIs."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Delete route tables."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Delete subnets."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Delete the VPC."
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
            "text": "REGION=eu-west-2\nVPC_CIDR=10.90.0.0/16\nSUBNET_A_CIDR=10.90.10.0/24\nSUBNET_B_CIDR=10.90.20.0/24"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create VPC and subnets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 create-vpc --cidr-block $VPC_CIDR --region $REGION --query 'Vpc.VpcId' --output text)\nSUBNET_A=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block $SUBNET_A_CIDR --availability-zone eu-west-2a --region $REGION --query 'Subnet.SubnetId' --output text)\nSUBNET_B=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block $SUBNET_B_CIDR --availability-zone eu-west-2a --region $REGION --query 'Subnet.SubnetId' --output text)\necho $VPC_ID $SUBNET_A $SUBNET_B"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Disable source/destination check on router instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "# Replace i-xxxxxxxx with your router instance ID.\naws ec2 modify-instance-attribute --instance-id i-xxxxxxxx --no-source-dest-check --region $REGION"
          }
        ],
        "note": "Expected: no output means the setting changed.",
        "warning": null,
        "expectedResult": "Expected: no output means the setting changed."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "# Delete dependent resources first, then subnets, then VPC.\naws ec2 delete-subnet --subnet-id $SUBNET_A --region $REGION\naws ec2 delete-subnet --subnet-id $SUBNET_B --region $REGION\naws ec2 delete-vpc --vpc-id $VPC_ID --region $REGION"
          }
        ],
        "note": null,
        "warning": "Only run cleanup after terminating instances and deleting extra ENIs.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Source/dest check",
        "body": "Disable it only for instances that forward traffic."
      },
      {
        "id": "cs-2",
        "title": "Asymmetric routing",
        "body": "Keep the forward and return path consistent."
      },
      {
        "id": "cs-3",
        "title": "Routing checklist",
        "body": "SubnetRouteTargetWhyprivate-a10.90.20.0/24eni-router-aSend traffic through applianceprivate-b10.90.10.0/24eni-router-bReturn path must matchRouter instanceSource/dest checkDisabledAllows forwarding"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Traffic drops",
        "body": "Check both route tables. Return traffic may be taking a different path."
      },
      {
        "id": "ts-2",
        "title": "Instance does not forward",
        "body": "Disable source/destination check and enable OS-level IP forwarding if needed."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check EC2 route, ENI, and instance permissions. Then run aws sts get-caller-identity."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "A route target can be correct, but return routing can still break the flow."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Do not disable source/destination checks on normal app instances."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Security groups are stateful. Route appliances may still need symmetric paths."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Router EC2 must be allowed to route. Disable source/dest check only for forwarding appliances.",
    "flashcardSetId": "vpc_task_21_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-elastic-ips-and-test-eni-association-022",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure Elastic IPs and test ENI association",
    "slug": "configure-elastic-ips-and-test-eni-association",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Allocate an Elastic IP, associate it with an instance, disassociate it, then associate it with an ENI.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Elastic IP",
        "body": "An Elastic IP is a static public IPv4 address in your AWS account."
      },
      {
        "id": "concept-2",
        "title": "EIP with ENI",
        "body": "When an EIP is associated to an ENI, it follows that ENI."
      },
      {
        "id": "concept-3",
        "title": "Test plan",
        "body": "TestTargetActionExpectedInstance EIPi-webAssociate EIPPublic IP appearsDisassociateAssociation IDRemove EIPInstance loses EIPENI EIPeni-webAssociate EIPEIP follows ENI"
      }
    ],
    "whyItMatters": "This matters because routing mistakes can break private connectivity. AWS exams often test route targets, source/destination checks, endpoint policies, and multi-VPC design choices.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Instance name",
        "value": "vpc-task22-web"
      },
      {
        "label": "Security group",
        "value": "vpc-task22-web-sg"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2/VPC networking setup, route or endpoint changes, basic test resources, and cleanup."
      }
    ],
    "costWarning": "Medium Delete all resources after testing. Public IPv4 addresses, EC2, NAT, Transit Gateway, Direct Connect, endpoints, logs, and DynamoDB can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC and EC2 read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeInstances, ec2:DescribeNetworkInterfaces Elastic IP and ENI: ec2:AllocateAddress, ec2:AssociateAddress, ec2:DisassociateAddress, ec2:ReleaseAddress, ec2:CreateNetworkInterface, ec2:AttachNetworkInterface EC2 test setup: ec2:RunInstances, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:TerminateInstances, ec2:DeleteNetworkInterface",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Launch a test instance",
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
            "text": "Use Amazon Linux 2023."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Launch into a public subnet."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Allow HTTP from your IP or test with ping/curl if allowed."
          }
        ],
        "note": null,
        "warning": "Public IPv4 addresses can create hourly charges.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Allocate and associate an Elastic IP",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2, then Elastic IPs."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Allocate Elastic IP address."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Associate Elastic IP address."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select the test instance."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Confirm the public IP on the instance."
          }
        ],
        "note": "The instance public IP becomes the Elastic IP.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Disassociate and move the EIP to an ENI",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the Elastic IP."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Disassociate Elastic IP address."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Create or select an ENI attached to the instance."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Associate the Elastic IP with the ENI."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Confirm the instance is reachable through the EIP again."
          }
        ],
        "note": "This shows that public addressing can be tied to the network interface.",
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
            "text": "Disassociate the Elastic IP."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Release the Elastic IP."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Terminate the instance."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Detach and delete extra ENIs."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Delete security groups if created."
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
            "text": "REGION=eu-west-2\nINSTANCE_ID=i-xxxxxxxx\nENI_ID=eni-xxxxxxxx"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Allocate an Elastic IP",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "ALLOC_ID=$(aws ec2 allocate-address --domain vpc --region $REGION --query 'AllocationId' --output text)\necho $ALLOC_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Associate with instance, then disassociate",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "ASSOC_ID=$(aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOC_ID --region $REGION --query 'AssociationId' --output text)\necho $ASSOC_ID\naws ec2 disassociate-address --association-id $ASSOC_ID --region $REGION"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Associate with ENI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "ASSOC_ID=$(aws ec2 associate-address --network-interface-id $ENI_ID --allocation-id $ALLOC_ID --region $REGION --query 'AssociationId' --output text)\necho $ASSOC_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 disassociate-address --association-id $ASSOC_ID --region $REGION\naws ec2 release-address --allocation-id $ALLOC_ID --region $REGION"
          }
        ],
        "note": null,
        "warning": "Release the Elastic IP to stop idle EIP charges.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Release the Elastic IP address to prevent unattached public IPv4 hourly charges."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Elastic IP",
        "body": "Static public IPv4 address that you allocate to your account."
      },
      {
        "id": "cs-2",
        "title": "Move target",
        "body": "EIP can associate with an instance or a network interface."
      },
      {
        "id": "cs-3",
        "title": "EIP test table",
        "body": "TestTargetActionExpectedInstance EIPi-webAssociate EIPPublic IP appearsDisassociateAssociation IDRemove EIPInstance loses EIPENI EIPeni-webAssociate EIPEIP follows ENI"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "EIP still charged",
        "body": "Disassociate and release unused Elastic IPs."
      },
      {
        "id": "ts-2",
        "title": "Association fails",
        "body": "Check that the ENI and instance are in the same Region and VPC setup is valid."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check permissions for ec2:AllocateAddress, ec2:AssociateAddress, and ec2:ReleaseAddress."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "A normal public IP is released when disassociated. An Elastic IP can be reused until released."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Public IPv4 can cost money even in simple labs."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "An EIP associated to an instance is actually tied to the primary network interface."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Elastic means reusable. Release it when done or you may pay.",
    "flashcardSetId": "vpc_task_22_flashcards"
  },
  {
    "id": "task-saa-vpc-create-multiple-enis-and-bind-services-023",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Create multiple ENIs and bind services",
    "slug": "create-multiple-enis-and-bind-services",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Attach multiple ENIs to one EC2 instance and test binding simple services to specific private IP addresses.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Elastic Network Interface",
        "body": "An ENI is a virtual network card for EC2."
      },
      {
        "id": "concept-2",
        "title": "Same AZ rule",
        "body": "An ENI must be in the same Availability Zone as the instance it attaches to."
      },
      {
        "id": "concept-3",
        "title": "ENI service plan",
        "body": "ENISubnetPrivate IPServiceReasoneth0app-subnet-aPrimaryAdminDefault accesseth1app-subnet-aSecondaryHTTP testBind service to one IPeth2app-subnet-aSecondaryMetrics testSeparate traffic path"
      }
    ],
    "whyItMatters": "This matters because routing mistakes can break private connectivity. AWS exams often test route targets, source/destination checks, endpoint policies, and multi-VPC design choices.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "AZ",
        "value": "eu-west-2a"
      },
      {
        "label": "Instance name",
        "value": "vpc-task23-multi-eni"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2/VPC networking setup, route or endpoint changes, basic test resources, and cleanup."
      }
    ],
    "costWarning": "Medium Delete all resources after testing. Public IPv4 addresses, EC2, NAT, Transit Gateway, Direct Connect, endpoints, logs, and DynamoDB can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC and EC2 read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeInstances, ec2:DescribeNetworkInterfaces ENI and EC2 setup: ec2:CreateNetworkInterface, ec2:AttachNetworkInterface, ec2:DetachNetworkInterface, ec2:DeleteNetworkInterface, ec2:AssignPrivateIpAddresses, ec2:RunInstances, ec2:TerminateInstances Security and cleanup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Launch one EC2 instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Launch an Amazon Linux 2023 instance in eu-west-2a."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Place it in a subnet that also has the extra ENIs."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create a security group that allows SSH from your IP and HTTP from the VPC CIDR."
          }
        ],
        "note": null,
        "warning": "Extra ENIs must be in the same AZ as the instance.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create and attach extra ENIs",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2, then Network Interfaces."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create network interface."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Use the same subnet as the instance."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach the ENI to the instance."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Repeat once for a second extra ENI."
          }
        ],
        "note": "Linux names are usually eth0, eth1, and eth2.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Bind services to private IPs",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Connect to the instance."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Run a simple web service bound to the private IP on eth1."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Run a second test listener bound to the private IP on eth2."
          },
          {
            "id": "console-step-4-item-4",
            "text": "From another instance in the VPC, curl each private IP."
          }
        ],
        "note": "Binding means the service listens only on that IP.",
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
            "text": "Stop test services."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Terminate the instance."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Detach extra ENIs if needed."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Delete extra ENIs."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Delete security groups if created."
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
            "text": "REGION=eu-west-2\nINSTANCE_ID=i-xxxxxxxx\nSUBNET_ID=subnet-xxxxxxxx\nSG_ID=sg-xxxxxxxx"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create two ENIs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "ENI1=$(aws ec2 create-network-interface --subnet-id $SUBNET_ID --groups $SG_ID --region $REGION --query 'NetworkInterface.NetworkInterfaceId' --output text)\nENI2=$(aws ec2 create-network-interface --subnet-id $SUBNET_ID --groups $SG_ID --region $REGION --query 'NetworkInterface.NetworkInterfaceId' --output text)\necho $ENI1 $ENI2"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Attach ENIs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "ATTACH1=$(aws ec2 attach-network-interface --network-interface-id $ENI1 --instance-id $INSTANCE_ID --device-index 1 --region $REGION --query 'AttachmentId' --output text)\nATTACH2=$(aws ec2 attach-network-interface --network-interface-id $ENI2 --instance-id $INSTANCE_ID --device-index 2 --region $REGION --query 'AttachmentId' --output text)\necho $ATTACH1 $ATTACH2"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "View ENIs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-network-interfaces --network-interface-ids $ENI1 $ENI2 --region $REGION --query 'NetworkInterfaces[*].[NetworkInterfaceId,PrivateIpAddress,Status]' --output table"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 detach-network-interface --attachment-id $ATTACH1 --region $REGION\naws ec2 detach-network-interface --attachment-id $ATTACH2 --region $REGION\naws ec2 delete-network-interface --network-interface-id $ENI1 --region $REGION\naws ec2 delete-network-interface --network-interface-id $ENI2 --region $REGION"
          }
        ],
        "note": null,
        "warning": "Terminate or stop services before deleting ENIs.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Release the Elastic IP address to prevent unattached public IPv4 hourly charges."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Same AZ",
        "body": "The instance and ENI must be in the same AZ."
      },
      {
        "id": "cs-2",
        "title": "Binding",
        "body": "Bind a service to a specific private IP to separate traffic."
      },
      {
        "id": "cs-3",
        "title": "ENI plan",
        "body": "ENISubnetPrivate IPServiceReasoneth0app-subnet-aPrimaryAdminDefault accesseth1app-subnet-aSecondaryHTTP testBind service to one IPeth2app-subnet-aSecondaryMetrics testSeparate traffic path"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Attachment fails",
        "body": "Check the ENI is in the same Availability Zone as the instance."
      },
      {
        "id": "ts-2",
        "title": "Service not reachable",
        "body": "Check the service bind IP, security group, OS firewall, and route table."
      },
      {
        "id": "ts-3",
        "title": "Cannot delete ENI",
        "body": "Detach the ENI first, or terminate the instance if the ENI is still attached."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "ENIs are AZ-scoped. They cannot attach across AZs."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Security groups attach to ENIs, not directly to subnets."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "More ENIs can help with traffic separation, but they add OS routing complexity."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "ENI = network card. More ENIs means more private network paths.",
    "flashcardSetId": "vpc_task_23_flashcards"
  },
  {
    "id": "task-saa-vpc-implement-vpc-multi-region-design-patterns-024",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Implement VPC multi-region design patterns",
    "slug": "implement-vpc-multi-region-design-patterns",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Compare and model multi-region VPC connectivity using Transit Gateway inter-region peering, VPC peering, PrivateLink, VPN, and Direct Connect options.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Transit Gateway",
        "body": "Transit Gateway is a hub for connecting many VPCs and networks."
      },
      {
        "id": "concept-2",
        "title": "Inter-region peering",
        "body": "Transit Gateways can peer across Regions and route IPv4 or IPv6 traffic."
      },
      {
        "id": "concept-3",
        "title": "Multi-region comparison",
        "body": "PatternBest forRoutingExam noteTGW inter-region peeringMany VPCs across RegionsCentral route tablesScales better than many peering linksVPC peeringSimple pair of VPCsPer-VPC routesNo transitive routingPrivateLinkProvider to consumer serviceEndpoint ENINot full network routingVPN/DXHybrid networkBGP/staticConnects on-prem"
      }
    ],
    "whyItMatters": "This matters because routing mistakes can break private connectivity. AWS exams often test route targets, source/destination checks, endpoint policies, and multi-VPC design choices.",
    "values": [
      {
        "label": "Primary Region",
        "value": "eu-west-2"
      },
      {
        "label": "Second Region",
        "value": "eu-west-1"
      },
      {
        "label": "Design choice",
        "value": "Transit Gateway inter-region peering for many VPCs"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2/VPC networking setup, route or endpoint changes, basic test resources, and cleanup."
      }
    ],
    "costWarning": "High Delete all resources after testing. Public IPv4 addresses, EC2, NAT, Transit Gateway, Direct Connect, endpoints, logs, and DynamoDB can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC and EC2 read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeInstances, ec2:DescribeNetworkInterfaces Transit Gateway setup: ec2:CreateTransitGateway, ec2:CreateTransitGatewayVpcAttachment, ec2:CreateTransitGatewayPeeringAttachment, ec2:AcceptTransitGatewayPeeringAttachment, ec2:CreateTransitGatewayRoute, ec2:SearchTransitGatewayRoutes VPC routing and cleanup: ec2:CreateRoute, ec2:DeleteRoute, ec2:DeleteTransitGatewayVpcAttachment, ec2:DeleteTransitGatewayPeeringAttachment, ec2:DeleteTransitGateway",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Plan the design",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Use Transit Gateway inter-region peering when many VPCs need central routing."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use VPC peering for simple one-to-one VPC connectivity."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use PrivateLink when consumers only need a private service endpoint."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use VPN or Direct Connect when on-premises is involved."
          }
        ],
        "note": "Use the full-width comparison table above to choose the right pattern.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create Transit Gateways",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Go to Transit gateways."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create one Transit Gateway in eu-west-2."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Switch Region to eu-west-1."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Create a second Transit Gateway."
          }
        ],
        "note": null,
        "warning": "Transit Gateway creates hourly and data processing charges.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Attach VPCs and peer the Transit Gateways",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Create VPC attachments to each local Transit Gateway."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Create a Transit Gateway peering attachment from Region A to Region B."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Accept the peering attachment in the peer Region."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Add routes in Transit Gateway route tables and VPC route tables."
          }
        ],
        "note": "Both TGW route tables and VPC route tables must know the destination CIDRs.",
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
            "text": "Delete VPC route entries to Transit Gateway."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Delete Transit Gateway routes."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Delete VPC attachments."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Delete peering attachment."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Delete Transit Gateways."
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
            "text": "REGION_A=eu-west-2\nREGION_B=eu-west-1"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create a Transit Gateway in each Region",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "TGW_A=$(aws ec2 create-transit-gateway --description vpc-task24-tgw-a --region $REGION_A --query 'TransitGateway.TransitGatewayId' --output text)\nTGW_B=$(aws ec2 create-transit-gateway --description vpc-task24-tgw-b --region $REGION_B --query 'TransitGateway.TransitGatewayId' --output text)\necho $TGW_A $TGW_B"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a peering attachment",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "# Replace 123456789012 with your AWS account ID.\nPEER_ID=$(aws ec2 create-transit-gateway-peering-attachment --transit-gateway-id $TGW_A --peer-transit-gateway-id $TGW_B --peer-account-id 123456789012 --peer-region $REGION_B --region $REGION_A --query 'TransitGatewayPeeringAttachment.TransitGatewayAttachmentId' --output text)\necho $PEER_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "# Delete VPC attachments and routes first.\naws ec2 delete-transit-gateway-peering-attachment --transit-gateway-attachment-id $PEER_ID --region $REGION_A\naws ec2 delete-transit-gateway --transit-gateway-id $TGW_A --region $REGION_A\naws ec2 delete-transit-gateway --transit-gateway-id $TGW_B --region $REGION_B"
          }
        ],
        "note": null,
        "warning": "Do not delete a Transit Gateway before deleting attachments.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Best default for many VPCs",
        "body": "Use Transit Gateway when many VPCs need a hub."
      },
      {
        "id": "cs-2",
        "title": "Not every private design is routing",
        "body": "PrivateLink exposes services. It does not connect full networks."
      },
      {
        "id": "cs-3",
        "title": "Design comparison",
        "body": "PatternBest forRoutingExam noteTGW inter-region peeringMany VPCs across RegionsCentral route tablesScales better than many peering linksVPC peeringSimple pair of VPCsPer-VPC routesNo transitive routingPrivateLinkProvider to consumer serviceEndpoint ENINot full network routingVPN/DXHybrid networkBGP/staticConnects on-prem"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No traffic",
        "body": "Check VPC route tables, Transit Gateway route tables, and attachment states."
      },
      {
        "id": "ts-2",
        "title": "Peering pending",
        "body": "Accept the peering attachment in the peer Region or account."
      },
      {
        "id": "ts-3",
        "title": "Unexpected cost",
        "body": "Transit Gateway has hourly and data processing charges."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "VPC peering is not transitive. Transit Gateway can provide hub-and-spoke routing."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "PrivateLink is for private service access, not full VPC-to-VPC routing."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Both sides need routes. A peering attachment alone does not route traffic."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Many VPCs need a hub. Transit Gateway is the hub; peering is a line.",
    "flashcardSetId": "vpc_task_24_flashcards"
  },
  {
    "id": "task-saa-vpc-create-a-dynamodb-gateway-endpoint-with-policy-restrictions-025",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Create a DynamoDB gateway endpoint with policy restrictions",
    "slug": "create-a-dynamodb-gateway-endpoint-with-policy-restrictions",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create a DynamoDB gateway VPC endpoint, attach it to a route table, and restrict access with an endpoint policy.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Gateway endpoint",
        "body": "A gateway endpoint gives private access to S3 or DynamoDB without an internet gateway or NAT device."
      },
      {
        "id": "concept-2",
        "title": "Endpoint policy",
        "body": "An endpoint policy controls which principals can use the endpoint to access the AWS service."
      },
      {
        "id": "concept-3",
        "title": "DynamoDB endpoint plan",
        "body": "ResourceValuePolicy useExpectedVPC endpointDynamoDB gatewayRoute table targetNo IGW neededDynamoDB tablevpc-task25-booksAllowed resourceRead succeedsOther tableAny other ARNDenied resourceAccess denied"
      }
    ],
    "whyItMatters": "This matters because routing mistakes can break private connectivity. AWS exams often test route targets, source/destination checks, endpoint policies, and multi-VPC design choices.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC CIDR",
        "value": "10.95.0.0/16"
      },
      {
        "label": "DynamoDB table",
        "value": "vpc-task25-books"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2/VPC networking setup, route or endpoint changes, basic test resources, and cleanup."
      }
    ],
    "costWarning": "Low to medium Delete all resources after testing. Public IPv4 addresses, EC2, NAT, Transit Gateway, Direct Connect, endpoints, logs, and DynamoDB can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC and EC2 read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeInstances, ec2:DescribeNetworkInterfaces DynamoDB setup: dynamodb:CreateTable, dynamodb:DescribeTable, dynamodb:PutItem, dynamodb:GetItem, dynamodb:DeleteTable Gateway endpoint: ec2:CreateVpcEndpoint, ec2:ModifyVpcEndpoint, ec2:DescribeVpcEndpoints, ec2:DeleteVpcEndpoints Route table and cleanup: ec2:CreateRouteTable, ec2:AssociateRouteTable, ec2:DeleteRouteTable, ec2:DeleteSubnet, ec2:DeleteVpc",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a private VPC test path",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create a VPC with CIDR 10.95.0.0/16."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create a private subnet."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create or select a route table for that subnet."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Do not add an internet gateway route for this test."
          }
        ],
        "note": "The goal is private DynamoDB access through the gateway endpoint.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a DynamoDB table",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open DynamoDB."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create table."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Table name: vpc-task25-books."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Partition key: BookId as String."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Use on-demand capacity."
          }
        ],
        "note": null,
        "warning": "Delete the table after the lab.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the DynamoDB gateway endpoint",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC, then Endpoints."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create endpoint."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Service category: AWS services."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Service name: com.amazonaws.eu-west-2.dynamodb."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Endpoint type: Gateway."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Select the VPC and route table."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Add a policy that allows only the chosen DynamoDB table."
          }
        ],
        "note": "Use the full-width endpoint policy plan above before creating the endpoint.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test and tear down",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "From an EC2 instance in the private subnet, test DynamoDB access with the AWS CLI."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Confirm allowed table access works."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm other table access fails if policy blocks it."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Delete the VPC endpoint."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Delete the DynamoDB table."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Delete route tables, subnets, and VPC."
          }
        ],
        "note": null,
        "warning": "Remove endpoints before deleting the VPC.",
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
            "text": "REGION=eu-west-2\nTABLE_NAME=vpc-task25-books\nVPC_ID=vpc-xxxxxxxx\nROUTE_TABLE_ID=rtb-xxxxxxxx\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create DynamoDB table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE_NAME --attribute-definitions AttributeName=BookId,AttributeType=S --key-schema AttributeName=BookId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $REGION\naws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create endpoint policy file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > ddb-endpoint-policy.json <<EOF\n{\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": \"*\",\n      \"Action\": [\"dynamodb:GetItem\", \"dynamodb:PutItem\", \"dynamodb:DescribeTable\"],\n      \"Resource\": \"arn:aws:dynamodb:${REGION}:${ACCOUNT_ID}:table/${TABLE_NAME}\"\n    }\n  ]\n}\nEOF"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create DynamoDB gateway endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "VPCE_ID=$(aws ec2 create-vpc-endpoint --vpc-id $VPC_ID --service-name com.amazonaws.${REGION}.dynamodb --vpc-endpoint-type Gateway --route-table-ids $ROUTE_TABLE_ID --policy-document file://ddb-endpoint-policy.json --region $REGION --query 'VpcEndpoint.VpcEndpointId' --output text)\necho $VPCE_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Test DynamoDB access",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb put-item --table-name $TABLE_NAME --item '{\"BookId\":{\"S\":\"1\"}}' --region $REGION\naws dynamodb get-item --table-name $TABLE_NAME --key '{\"BookId\":{\"S\":\"1\"}}' --region $REGION"
          }
        ],
        "note": "Run this from an EC2 instance that uses the endpoint route table for the cleanest private-path test.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-vpc-endpoints --vpc-endpoint-ids $VPCE_ID --region $REGION\naws dynamodb delete-table --table-name $TABLE_NAME --region $REGION\nrm -f ddb-endpoint-policy.json"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes VPC networking infrastructure or disassociates active network resources.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "DynamoDB gateway endpoint",
        "body": "Private VPC route to DynamoDB. No IGW or NAT required."
      },
      {
        "id": "cs-2",
        "title": "Endpoint policy",
        "body": "Limits what can be accessed through the endpoint."
      },
      {
        "id": "cs-3",
        "title": "Endpoint policy plan",
        "body": "ResourceValuePolicy useExpectedVPC endpointDynamoDB gatewayRoute table targetNo IGW neededDynamoDB tablevpc-task25-booksAllowed resourceRead succeedsOther tableAny other ARNDenied resourceAccess denied"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No route to DynamoDB",
        "body": "Check that the endpoint is attached to the subnet route table."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied",
        "body": "Check IAM identity policy and endpoint policy. Both can affect access."
      },
      {
        "id": "ts-3",
        "title": "Policy change delay",
        "body": "Endpoint policy changes can take a few minutes to apply."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Gateway endpoints are for S3 and DynamoDB, not every AWS service."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "The default endpoint policy allows full access. Restrict it for least privilege."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Endpoint policy does not replace IAM. Both policy layers matter."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "DynamoDB gateway = private route. Endpoint policy decides what can pass.",
    "flashcardSetId": "vpc_task_25_flashcards"
  },
  {
    "id": "task-saa-vpc-enable-ipv6-in-a-vpc-and-test-ipv6-routing-026",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Enable IPv6 in a VPC and test IPv6 routing",
    "slug": "enable-ipv6-in-a-vpc-and-test-ipv6-routing",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Add IPv6 to a VPC, assign IPv6 CIDRs to subnets, route public IPv6 traffic to an Internet Gateway, and test IPv6 from an EC2 instance.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "IPv6 is public by design",
        "body": "IPv6 addresses are globally unique. Use security groups and routes to control access."
      },
      {
        "id": "concept-2",
        "title": "IPv6 subnet size",
        "body": "AWS assigns IPv6 subnet CIDR blocks from the VPC IPv6 CIDR. Subnets commonly use a /64 IPv6 block."
      },
      {
        "id": "concept-3",
        "title": "IPv6 route plan",
        "body": "SubnetIPv6 routeTargetPurposepublic-a::/0Internet GatewayPublic IPv6 internet accessprivate-a::/0Egress-only IGWOutbound-only IPv6Local VPC routeVPC IPv6 CIDRlocalInside VPC traffic"
      }
    ],
    "whyItMatters": "IPv6 changes routing. NAT Gateway is for IPv4. For outbound-only IPv6, use an egress-only Internet Gateway.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC name",
        "value": "saa-vpc-task26-ipv6"
      },
      {
        "label": "IPv4 VPC CIDR",
        "value": "10.26.0.0/16"
      },
      {
        "label": "Public subnet IPv4",
        "value": "10.26.1.0/24"
      },
      {
        "label": "Private subnet IPv4",
        "value": "10.26.11.0/24"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC IPv6 setup, subnet routing, EC2 test instance setup, and cleanup."
      }
    ],
    "costWarning": "This lab may create small charges for EC2, EBS, public IPv4 if used, and data transfer. Delete the resources after testing. NAT Gateways incur hourly availability charges (~$0.045/hr) plus data processing charges per GB. Always delete NAT Gateways and release Elastic IPs immediately after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC and IPv6: ec2:CreateVpc, ec2:AssociateVpcCidrBlock, ec2:DescribeVpcs, ec2:ModifyVpcAttribute Subnets and routes: ec2:CreateSubnet, ec2:AssociateSubnetCidrBlock, ec2:CreateRouteTable, ec2:CreateRoute, ec2:AssociateRouteTable Internet gateways: ec2:CreateInternetGateway, ec2:AttachInternetGateway, ec2:CreateEgressOnlyInternetGateway EC2 test: ec2:RunInstances, ec2:DescribeInstances, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress Cleanup: ec2:TerminateInstances, ec2:DeleteSubnet, ec2:DeleteRouteTable, ec2:DetachInternetGateway, ec2:DeleteInternetGateway, ec2:DeleteEgressOnlyInternetGateway, ec2:DeleteVpc",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the VPC",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create VPC."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose VPC only."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Name it saa-vpc-task26-ipv6."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Use IPv4 CIDR 10.26.0.0/16."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Choose Amazon-provided IPv6 CIDR block."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Choose Create VPC."
          }
        ],
        "note": "Success: the VPC has one IPv4 CIDR and one Amazon-provided IPv6 CIDR.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create IPv4 and IPv6 subnets",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Subnets."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create subnet."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose the task VPC."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Create public-a in eu-west-2a with IPv4 CIDR 10.26.1.0/24."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Add an IPv6 CIDR block from the VPC IPv6 range."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Create private-a with IPv4 CIDR 10.26.11.0/24."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Add a separate IPv6 CIDR block."
          }
        ],
        "note": "Use different IPv6 subnet blocks. Do not reuse the same block.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create IPv6 routes",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Internet gateways and create an IGW."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Attach it to the task VPC."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Open Egress-only internet gateways and create one for the task VPC."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Open Route tables."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Create a public route table and add ::/0 to the IGW."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Create a private route table and add ::/0 to the egress-only IGW."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Associate public and private subnets to the correct route tables."
          }
        ],
        "note": null,
        "warning": "Do not route private IPv6 subnets to the normal IGW unless you want inbound internet reachability controlled only by security rules.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Launch and test an IPv6 instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Launch an Amazon Linux EC2 instance in public-a."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Assign an IPv6 address during launch."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Allow SSH from your IP only."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Connect with EC2 Instance Connect or SSH."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Run curl -6 https://checkip.amazonaws.com."
          }
        ],
        "note": "Expected: the command returns an IPv6 address.",
        "warning": null,
        "expectedResult": "Expected: the command returns an IPv6 address."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Terminate the EC2 instance."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete custom route table associations."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete custom route tables."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the egress-only internet gateway."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Detach and delete the Internet Gateway."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Delete the subnets."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Disassociate the IPv6 CIDR if needed."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Delete the VPC."
          }
        ],
        "note": null,
        "warning": "Wait until the EC2 instance is terminated before deleting subnets.",
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
        "title": "Create variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nVPC_CIDR=10.26.0.0/16\nVPC_NAME=saa-vpc-task26-ipv6"
          }
        ],
        "note": "These variables keep commands shorter.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create VPC and request IPv6",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "VPC_ID=$(aws ec2 create-vpc --region $REGION --cidr-block $VPC_CIDR --tag-specifications \"ResourceType=vpc,Tags=[{Key=Name,Value=$VPC_NAME}]\" --query Vpc.VpcId --output text)\naws ec2 modify-vpc-attribute --region $REGION --vpc-id $VPC_ID --enable-dns-support \"{\\\"Value\\\":true}\"\naws ec2 modify-vpc-attribute --region $REGION --vpc-id $VPC_ID --enable-dns-hostnames \"{\\\"Value\\\":true}\"\naws ec2 associate-vpc-cidr-block --region $REGION --vpc-id $VPC_ID --amazon-provided-ipv6-cidr-block\necho $VPC_ID"
          }
        ],
        "note": "Wait until the IPv6 CIDR association is associated before creating IPv6 subnet blocks.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "View IPv6 CIDR",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-vpcs --region $REGION --vpc-ids $VPC_ID --query \"Vpcs[0].Ipv6CidrBlockAssociationSet\" --output table"
          }
        ],
        "note": "Expected: State is associated.",
        "warning": null,
        "expectedResult": "Expected: State is associated."
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
            "text": "# Delete EC2 test instances and dependent resources first.\n# Then delete custom route tables, subnets, gateways, IPv6 CIDR association, and VPC."
          }
        ],
        "note": "Use the Console teardown if you created resources manually.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "IPv6 route targets",
        "body": "NeedRouteTargetPublic IPv6 internet::/0Internet GatewayPrivate outbound-only IPv6::/0Egress-only IGWInside VPC IPv6VPC IPv6 CIDRlocal"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No IPv6 address",
        "body": "Check the subnet IPv6 CIDR and instance IPv6 assignment settings."
      },
      {
        "id": "ts-2",
        "title": "No IPv6 internet",
        "body": "Check the ::/0 route and the security group egress rule."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check EC2 VPC, subnet, route, gateway, and instance permissions."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "IPv6 is not NAT Gateway IPv4",
        "body": "NAT Gateway is mainly an IPv4 exam answer. Use egress-only Internet Gateway for outbound-only IPv6."
      },
      {
        "id": "trap-2",
        "title": "Public IPv6 still needs a route",
        "body": "An IPv6 address alone is not enough. The subnet route table must have a matching IPv6 route."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "IPv6 needs its own road. IPv4 routes do not route IPv6 traffic.",
    "flashcardSetId": "vpc_task_26_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-dhcp-options-set-for-custom-dns-and-domain-resolution-027",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure DHCP options set for custom DNS and domain resolution",
    "slug": "configure-dhcp-options-set-for-custom-dns-and-domain-resolution",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a DHCP options set, associate it with a VPC, and test DNS domain settings from an EC2 instance.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "DHCP options set",
        "body": "A DHCP options set tells instances which DNS servers and domain name settings to use."
      },
      {
        "id": "concept-2",
        "title": "One per VPC",
        "body": "A VPC can use only one DHCP options set at a time."
      },
      {
        "id": "concept-3",
        "title": "DHCP plan",
        "body": "OptionLab valueReasonDomain namecorp.example.internalPrivate lab domain suffixDomain name serversAmazonProvidedDNSUse VPC resolver safelyNTP serversDefault or Amazon Time SyncKeep time stable"
      }
    ],
    "whyItMatters": "DNS settings affect every instance in the VPC. A wrong DHCP options set can break name resolution.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC name",
        "value": "saa-vpc-task27-dhcp"
      },
      {
        "label": "Domain name",
        "value": "corp.example.internal"
      },
      {
        "label": "DNS server",
        "value": "AmazonProvidedDNS"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, DHCP options setup, VPC association, EC2 test instance setup, and cleanup."
      }
    ],
    "costWarning": "The DHCP options set itself has no hourly charge. EC2, EBS, public IPv4, and data transfer can create small charges during testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity DHCP options: ec2:CreateDhcpOptions, ec2:AssociateDhcpOptions, ec2:DescribeDhcpOptions, ec2:DeleteDhcpOptions VPC and EC2 test: ec2:CreateVpc, ec2:DescribeVpcs, ec2:RunInstances, ec2:DescribeInstances, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress Cleanup: ec2:TerminateInstances, ec2:AssociateDhcpOptions, ec2:DeleteDhcpOptions, ec2:DeleteVpc",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create or choose a test VPC",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create a VPC named saa-vpc-task27-dhcp, or use an existing lab VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use Region eu-west-2."
          }
        ],
        "note": null,
        "warning": "Do not change DHCP options on a production VPC.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the DHCP options set",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "In the left menu, choose DHCP option sets."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create DHCP options set."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it saa-vpc-task27-options."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set domain name to corp.example.internal."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Set domain name servers to AmazonProvidedDNS."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose Create DHCP options set."
          }
        ],
        "note": "For a real company, use the private DNS IP addresses for your DNS servers.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Associate the DHCP options set",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select the test VPC."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Actions."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Edit VPC settings or Edit DHCP options set."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select saa-vpc-task27-options."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Save the change."
          }
        ],
        "note": "Existing instances may need DHCP renewal or restart to pick up the new settings.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test DNS settings",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Launch or connect to an Amazon Linux instance in the VPC."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Run cat /etc/resolv.conf."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Run hostname -f."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Run nslookup amazon.com."
          }
        ],
        "note": "Expected: DNS resolution still works and the search/domain settings match your DHCP options.",
        "warning": null,
        "expectedResult": "Expected: DNS resolution still works and the search/domain settings match your DHCP options."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Terminate test EC2 instances."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Associate the VPC back to the default DHCP options set."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the custom DHCP options set."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the lab VPC if you created it."
          }
        ],
        "note": null,
        "warning": "You cannot delete a DHCP options set while it is associated with a VPC.",
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
        "title": "Create DHCP options set",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nDHCP_ID=$(aws ec2 create-dhcp-options --region $REGION --dhcp-configurations \"Key=domain-name,Values=corp.example.internal\" \"Key=domain-name-servers,Values=AmazonProvidedDNS\" --tag-specifications \"ResourceType=dhcp-options,Tags=[{Key=Name,Value=saa-vpc-task27-options}]\" --query DhcpOptions.DhcpOptionsId --output text)\necho $DHCP_ID"
          }
        ],
        "note": "Expected: a DHCP options set ID like dopt-....",
        "warning": null,
        "expectedResult": "Expected: a DHCP options set ID like dopt-...."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Associate with a VPC",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "VPC_ID=vpc-REPLACE_ME\naws ec2 associate-dhcp-options --region $REGION --vpc-id $VPC_ID --dhcp-options-id $DHCP_ID"
          }
        ],
        "note": null,
        "warning": "Replace vpc-REPLACE_ME with your lab VPC ID.",
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify association",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-vpcs --region $REGION --vpc-ids $VPC_ID --query \"Vpcs[0].DhcpOptionsId\" --output text"
          }
        ],
        "note": "Expected: it returns your custom DHCP options set ID.",
        "warning": null,
        "expectedResult": "Expected: it returns your custom DHCP options set ID."
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
            "text": "aws ec2 associate-dhcp-options --region $REGION --vpc-id $VPC_ID --dhcp-options-id default\naws ec2 delete-dhcp-options --region $REGION --dhcp-options-id $DHCP_ID"
          }
        ],
        "note": "This reverts the VPC to the default DHCP options set first.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "DHCP options facts",
        "body": "FeatureKey pointExam ideaDNS serversSet with domain-name-serversWrong DNS breaks resolutionDomain nameAdds domain/search suffixUseful for private namesAssociationOne set per VPCChange affects VPC clients"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "DNS stops working",
        "body": "Check the domain name server value. Use AmazonProvidedDNS for a safe lab."
      },
      {
        "id": "ts-2",
        "title": "Settings did not change",
        "body": "Renew DHCP, restart networking, or restart the instance."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check EC2 DHCP options permissions."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "One DHCP options set per VPC",
        "body": "You can create many sets, but only one can be associated with a VPC."
      },
      {
        "id": "trap-2",
        "title": "DHCP is not Route 53",
        "body": "DHCP controls client DNS settings. Route 53 controls DNS records and resolver behaviour."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "DHCP tells instances who to ask. Bad DNS options send instances to the wrong resolver.",
    "flashcardSetId": "vpc_task_27_flashcards"
  },
  {
    "id": "task-saa-vpc-set-up-aws-network-firewall-and-block-outbound-traffic-028",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Set up AWS Network Firewall and block outbound traffic",
    "slug": "set-up-aws-network-firewall-and-block-outbound-traffic",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Deploy AWS Network Firewall in a VPC and test a stateful rule that blocks outbound traffic to a chosen domain or IP pattern.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Firewall subnet",
        "body": "AWS Network Firewall creates firewall endpoints in dedicated subnets. Route traffic through those endpoints."
      },
      {
        "id": "concept-2",
        "title": "Stateful rules",
        "body": "Stateful rules inspect traffic in the context of the connection, not just one packet."
      },
      {
        "id": "concept-3",
        "title": "Firewall route plan",
        "body": "SubnetRouteTargetReasonWorkload subnet0.0.0.0/0Firewall endpointInspect outbound trafficFirewall subnet0.0.0.0/0NAT Gateway or IGWSend allowed traffic outReturn routeWorkload CIDRlocalReturn traffic to instance"
      }
    ],
    "whyItMatters": "Network Firewall is for central inspection. It is stronger than simple security groups when you need managed stateful network filtering.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC name",
        "value": "saa-vpc-task28-nfw"
      },
      {
        "label": "Blocked test target",
        "value": "example.com or 203.0.113.0/24 lab range"
      },
      {
        "label": "Firewall policy",
        "value": "saa-vpc-task28-policy"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC routing, Network Firewall rule groups and policy, EC2 testing, CloudWatch logging, and cleanup."
      }
    ],
    "costWarning": "AWS Network Firewall can create hourly firewall endpoint charges and data processing charges. NAT Gateway, EC2, logs, and data transfer can also cost money. Tear down quickly after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Network Firewall: network-firewall:CreateFirewall, network-firewall:CreateFirewallPolicy, network-firewall:CreateRuleGroup, network-firewall:DescribeFirewall, network-firewall:UpdateFirewallPolicy, network-firewall:DeleteFirewall, network-firewall:DeleteFirewallPolicy, network-firewall:DeleteRuleGroup VPC routing: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateRouteTable, ec2:CreateRoute, ec2:AssociateRouteTable, ec2:DescribeRouteTables EC2 test: ec2:RunInstances, ec2:TerminateInstances, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress Logs: logs:CreateLogGroup, logs:PutRetentionPolicy, logs:DescribeLogGroups Cleanup: ec2:DeleteRouteTable, ec2:DeleteSubnet, ec2:DeleteVpc",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the VPC layout",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Create a VPC named saa-vpc-task28-nfw."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create one workload subnet."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create one dedicated firewall subnet."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create a public subnet with a NAT Gateway or internet path for allowed outbound traffic."
          }
        ],
        "note": "Keep the firewall endpoint in a dedicated subnet.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the stateful rule group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Network Firewall."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Rule groups."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Create a Stateful rule group."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Use a domain list rule or Suricata rule to block the chosen target."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Name it saa-vpc-task28-block-rule."
          }
        ],
        "note": null,
        "warning": "Use a harmless lab target. Do not block company production traffic.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create firewall policy and firewall",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Create a firewall policy named saa-vpc-task28-policy."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Add the stateful rule group."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Create a firewall named saa-vpc-task28-firewall."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose the task VPC and firewall subnet."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Wait until status is ready."
          }
        ],
        "note": "The firewall creates endpoint IDs. You need those IDs for routes.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Route traffic through the firewall",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Route tables."
          },
          {
            "id": "console-step-5-item-2",
            "text": "In the workload subnet route table, send outbound traffic to the firewall endpoint."
          },
          {
            "id": "console-step-5-item-3",
            "text": "In the firewall subnet route table, send allowed outbound traffic to the NAT Gateway or IGW path."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Keep local VPC routes unchanged."
          }
        ],
        "note": null,
        "warning": "Wrong route order can break all outbound traffic.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test the block",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Connect to the workload EC2 instance."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Run a normal allowed request, such as curl https://aws.amazon.com."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Run the blocked request, such as the domain or IP used in the rule."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Confirm the blocked target fails."
          }
        ],
        "note": "Expected: allowed traffic works. Blocked traffic fails.",
        "warning": null,
        "expectedResult": "Expected: allowed traffic works. Blocked traffic fails."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Terminate test EC2 instances."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Remove routes that target firewall endpoints."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the Network Firewall."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the firewall policy."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the rule group."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete NAT Gateway if created."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete route tables, subnets, IGW, and VPC."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Delete CloudWatch log groups if created."
          }
        ],
        "note": null,
        "warning": "Delete routes before deleting dependent network resources.",
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
        "title": "Describe firewalls",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\naws network-firewall list-firewalls --region $REGION"
          }
        ],
        "note": "Use this to confirm firewall creation.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Describe firewall endpoints",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "FIREWALL_ARN=arn:aws:network-firewall:eu-west-2:ACCOUNT_ID:firewall/saa-vpc-task28-firewall\naws network-firewall describe-firewall --region $REGION --firewall-arn $FIREWALL_ARN"
          }
        ],
        "note": null,
        "warning": "Replace the ARN before running.",
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Check route tables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-route-tables --region $REGION --filters Name=tag:Name,Values=\"*task28*\" --query \"RouteTables[].Routes[]\" --output table"
          }
        ],
        "note": "Expected: workload traffic routes to the firewall endpoint.",
        "warning": null,
        "expectedResult": "Expected: workload traffic routes to the firewall endpoint."
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
            "text": "# Remove route entries first.\n# Then delete firewall, firewall policy, rule group, NAT Gateway, route tables, subnets, and VPC."
          }
        ],
        "note": "Network Firewall deletion can take several minutes.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Network Firewall parts",
        "body": "PartWhat it doesExam clueRule groupHolds inspection rulesReusable logicFirewall policyCombines rule groupsAttached to firewallFirewall endpointReceives routed trafficNeeds route table changesLogsFlow/alert visibilityTroubleshooting and audit"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "All traffic fails",
        "body": "Check workload subnet route to firewall endpoint and firewall subnet route to NAT or IGW."
      },
      {
        "id": "ts-2",
        "title": "Rule does not block",
        "body": "Check the rule group order, target value, and whether traffic is HTTP, TLS SNI, or IP based."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check network-firewall, EC2 route, and CloudWatch Logs permissions."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Security group is not enough",
        "body": "Use Network Firewall when the question needs managed stateful network inspection across subnets or VPC paths."
      },
      {
        "id": "trap-2",
        "title": "Firewall needs routes",
        "body": "Creating the firewall alone does not inspect traffic. Route tables must send traffic through it."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "No route, no inspection. Traffic must pass through the firewall endpoint.",
    "flashcardSetId": "vpc_task_28_flashcards"
  },
  {
    "id": "task-saa-vpc-compare-security-groups-and-nacls-using-ephemeral-return-traffic-029",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Compare Security Groups and NACLs using ephemeral return traffic",
    "slug": "compare-security-groups-and-nacls-using-ephemeral-return-traffic",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Build a simple example that shows security groups are stateful and Network ACLs are stateless, using ephemeral port return traffic.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Security groups are stateful",
        "body": "If inbound traffic is allowed, the return traffic is automatically allowed."
      },
      {
        "id": "concept-2",
        "title": "NACLs are stateless",
        "body": "Network ACLs need rules for both request traffic and return traffic."
      },
      {
        "id": "concept-3",
        "title": "Rule comparison",
        "body": "ControlStateful?Where appliedReturn trafficSecurity groupYesENI / instanceAllowed automaticallyNetwork ACLNoSubnetNeeds explicit ruleEphemeral portsUsed by client repliesReturn pathUsually 1024-65535"
      }
    ],
    "whyItMatters": "This is a major exam trap. Many wrong answers forget that NACLs need explicit return-path rules.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC name",
        "value": "saa-vpc-task29-sg-nacl"
      },
      {
        "label": "Server port",
        "value": "HTTP 80"
      },
      {
        "label": "Ephemeral range",
        "value": "1024-65535 for lab simplicity"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2 instances, security groups, NACL rules, subnet routing, and cleanup."
      }
    ],
    "costWarning": "This lab may create small EC2, EBS, public IPv4, and data transfer charges. Delete all resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Security groups: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:RevokeSecurityGroupIngress, ec2:DeleteSecurityGroup Network ACLs: ec2:CreateNetworkAcl, ec2:CreateNetworkAclEntry, ec2:ReplaceNetworkAclAssociation, ec2:DeleteNetworkAclEntry, ec2:DeleteNetworkAcl EC2 and VPC test: ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances, ec2:CreateSubnet, ec2:CreateRouteTable, ec2:CreateRoute Cleanup: ec2:DeleteSubnet, ec2:DeleteRouteTable, ec2:DeleteVpc",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the test server",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Create or use a lab VPC with one public subnet."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Launch an Amazon Linux EC2 instance."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Install a simple web server."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use a security group that allows inbound HTTP 80 from your IP."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Allow default outbound traffic."
          }
        ],
        "note": "Security group return traffic is allowed automatically because security groups are stateful.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the NACL test rules",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Network ACLs."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create a custom NACL for the public subnet."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Allow inbound HTTP 80 from your IP."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Allow outbound ephemeral ports 1024-65535 to your IP."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Associate the NACL with the public subnet."
          }
        ],
        "note": "NACLs evaluate rules by number from low to high.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Break return traffic on purpose",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Edit the NACL outbound rules."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Remove or deny the outbound ephemeral port rule."
          },
          {
            "id": "console-step-4-item-3",
            "text": "From your computer, open the instance public IP in a browser."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Confirm the connection fails or hangs."
          }
        ],
        "note": null,
        "warning": "This failure is expected. You are proving NACLs are stateless.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Fix return traffic",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Add the outbound ephemeral port allow rule again."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Test HTTP again."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm the web page loads."
          }
        ],
        "note": "Expected: the same security group works, but the NACL must allow return traffic.",
        "warning": null,
        "expectedResult": "Expected: the same security group works, but the NACL must allow return traffic."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Terminate the EC2 instance."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Reassociate the subnet with the original/default NACL."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the custom NACL."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete security groups."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete route tables, subnet, IGW, and VPC if created."
          }
        ],
        "note": null,
        "warning": "A subnet must always be associated with a NACL.",
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
        "title": "Show security group rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nSG_ID=sg-REPLACE_ME\naws ec2 describe-security-groups --region $REGION --group-ids $SG_ID --output table"
          }
        ],
        "note": null,
        "warning": "Replace sg-REPLACE_ME.",
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Show NACL entries",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "NACL_ID=acl-REPLACE_ME\naws ec2 describe-network-acls --region $REGION --network-acl-ids $NACL_ID --query \"NetworkAcls[0].Entries\" --output table"
          }
        ],
        "note": null,
        "warning": "Replace acl-REPLACE_ME.",
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Test web access",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "curl -I http://INSTANCE_PUBLIC_IP"
          }
        ],
        "note": "Expected: HTTP headers appear when return traffic is allowed.",
        "warning": null,
        "expectedResult": "Expected: HTTP headers appear when return traffic is allowed."
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
            "text": "# Terminate EC2 first.\n# Reassociate subnet to default NACL.\n# Delete custom NACL and security groups after dependencies are gone."
          }
        ],
        "note": "Use the Console for safer NACL association changes.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "SG vs NACL return traffic",
        "body": "FeatureSecurity GroupNACLStateStatefulStatelessApplied toENI / instanceSubnetRulesAllow onlyAllow and denyReturn trafficAutomaticMust be allowed"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "HTTP timeout",
        "body": "Check NACL outbound ephemeral ports and inbound HTTP rule."
      },
      {
        "id": "ts-2",
        "title": "Works after NACL fix",
        "body": "That is the expected lesson: NACL return rules matter."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check EC2 security group and NACL permissions."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Forgetting ephemeral ports",
        "body": "NACLs need return-path ephemeral ports. Security groups do not."
      },
      {
        "id": "trap-2",
        "title": "NACL order matters",
        "body": "Lower numbered NACL rules are evaluated first."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "SG remembers. NACL forgets. NACLs need both directions.",
    "flashcardSetId": "vpc_task_29_flashcards"
  },
  {
    "id": "task-saa-vpc-use-aws-privatelink-to-expose-a-service-privately-between-accounts-030",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Use AWS PrivateLink to expose a service privately between accounts",
    "slug": "use-aws-privatelink-to-expose-a-service-privately-between-accounts",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a provider endpoint service behind a Network Load Balancer, allow a consumer account, create an interface endpoint, and test private access.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Provider account",
        "body": "The provider owns the service and exposes it through an endpoint service."
      },
      {
        "id": "concept-2",
        "title": "Consumer account",
        "body": "The consumer creates an interface VPC endpoint to connect privately."
      },
      {
        "id": "concept-3",
        "title": "PrivateLink design plan",
        "body": "SideResourceExample namePurposeProviderNetwork Load Balancersaa-task30-nlbReceives endpoint trafficProviderEndpoint servicesaa-task30-serviceShares service privatelyConsumerInterface endpointsaa-task30-endpointCreates private ENIsBothSecurity groupsTask-specific SGsRestrict private traffic"
      }
    ],
    "whyItMatters": "PrivateLink avoids exposing services to the internet. It also avoids VPC peering route complexity for service-style access.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Provider VPC",
        "value": "saa-vpc-task30-provider"
      },
      {
        "label": "Consumer VPC",
        "value": "saa-vpc-task30-consumer"
      },
      {
        "label": "Service port",
        "value": "TCP 80"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2, ELBv2, endpoint service, interface endpoint, cross-account allow list, and cleanup."
      }
    ],
    "costWarning": "PrivateLink can create charges for Network Load Balancer, interface endpoint hours, endpoint data processing, EC2, EBS, and data transfer. Delete resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Provider service: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:RegisterTargets, elasticloadbalancing:CreateListener, elasticloadbalancing:DeleteLoadBalancer PrivateLink: ec2:CreateVpcEndpointServiceConfiguration, ec2:ModifyVpcEndpointServicePermissions, ec2:DescribeVpcEndpointServiceConfigurations, ec2:CreateVpcEndpoint, ec2:AcceptVpcEndpointConnections, ec2:DeleteVpcEndpoints, ec2:DeleteVpcEndpointServiceConfigurations VPC and EC2: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateSecurityGroup, ec2:RunInstances, ec2:TerminateInstances Cleanup: ec2:DeleteSecurityGroup, ec2:DeleteSubnet, ec2:DeleteVpc",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the provider service",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "In the provider account, create a VPC and private subnet."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Launch an EC2 instance running a simple web server."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create a target group on TCP 80."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Register the provider EC2 instance."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Create a Network Load Balancer named saa-task30-nlb."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create a listener forwarding to the target group."
          }
        ],
        "note": "Endpoint services require a Network Load Balancer or Gateway Load Balancer.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the endpoint service",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Endpoint services."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create endpoint service."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select the Network Load Balancer."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Keep Acceptance required enabled for learning."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Create the endpoint service."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Allow the consumer account principal."
          }
        ],
        "note": "Copy the endpoint service name. The consumer account needs it.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the consumer interface endpoint",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In the consumer account, open VPC."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Endpoints."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Create endpoint."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Other endpoint services."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Paste the provider endpoint service name."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose the consumer VPC and subnets."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Attach a security group that allows outbound to the endpoint and inbound response traffic."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Create the endpoint."
          }
        ],
        "note": "The interface endpoint creates private ENIs in the consumer subnets.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Accept and test the connection",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "In the provider account, open the endpoint service."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Accept the pending endpoint connection."
          },
          {
            "id": "console-step-5-item-3",
            "text": "In the consumer account, copy the endpoint DNS name."
          },
          {
            "id": "console-step-5-item-4",
            "text": "From a consumer EC2 instance, run curl http://endpoint-dns-name."
          }
        ],
        "note": "Expected: the consumer reaches the provider service privately.",
        "warning": null,
        "expectedResult": "Expected: the consumer reaches the provider service privately."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete the consumer interface endpoint."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the provider endpoint service."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the Network Load Balancer listener."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the Network Load Balancer."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Terminate provider and consumer EC2 instances."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Delete security groups, subnets, route tables, gateways, and VPCs."
          }
        ],
        "note": null,
        "warning": "Delete consumer endpoints before deleting the provider endpoint service.",
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
        "title": "List endpoint services",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\naws ec2 describe-vpc-endpoint-service-configurations --region $REGION"
          }
        ],
        "note": "Run in the provider account to see endpoint service configuration.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Allow consumer principal",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SERVICE_ID=vpce-svc-REPLACE_ME\nCONSUMER_ACCOUNT=123456789012\naws ec2 modify-vpc-endpoint-service-permissions --region $REGION --service-id $SERVICE_ID --add-allowed-principals arn:aws:iam::$CONSUMER_ACCOUNT:root"
          }
        ],
        "note": null,
        "warning": "Replace the service ID and consumer account ID.",
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create consumer endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "SERVICE_NAME=com.amazonaws.vpce.eu-west-2.vpce-svc-REPLACE_ME\nVPC_ID=vpc-REPLACE_ME\nSUBNET_ID=subnet-REPLACE_ME\nSG_ID=sg-REPLACE_ME\naws ec2 create-vpc-endpoint --region $REGION --vpc-id $VPC_ID --vpc-endpoint-type Interface --service-name $SERVICE_NAME --subnet-ids $SUBNET_ID --security-group-ids $SG_ID"
          }
        ],
        "note": null,
        "warning": "Run this in the consumer account.",
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
            "text": "# Delete consumer interface endpoint first.\n# Delete provider endpoint service next.\n# Delete NLB listener, NLB, target group, EC2 instances, security groups, and VPC resources."
          }
        ],
        "note": "Cross-account labs need cleanup in both accounts.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "PrivateLink roles",
        "body": "RoleOwnsKey actionProviderService and NLBCreate endpoint serviceConsumerInterface endpointCreate endpoint to serviceProviderConnection approvalAccept endpoint connectionBothSecurity groupsAllow required port"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Endpoint stays pending",
        "body": "Provider must accept the endpoint connection if acceptance is required."
      },
      {
        "id": "ts-2",
        "title": "Connection timeout",
        "body": "Check NLB targets, endpoint security group, provider security group, and listener port."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check endpoint service permission and allowed principal ARN."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "PrivateLink is service access",
        "body": "PrivateLink exposes a service privately. It is not full VPC-to-VPC routing like peering."
      },
      {
        "id": "trap-2",
        "title": "NLB requirement",
        "body": "Endpoint services commonly use a Network Load Balancer. Do not choose ALB for endpoint service provider setup."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "PrivateLink is a private service door. Consumers enter the service, not the whole VPC.",
    "flashcardSetId": "vpc_task_30_flashcards"
  },
  {
    "id": "task-saa-vpc-configure-endpoint-services-and-consumer-endpoints-031",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Configure endpoint services and consumer endpoints",
    "slug": "configure-endpoint-services-and-consumer-endpoints",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Expose a private service from an owner VPC and connect from a consumer VPC using AWS PrivateLink.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Service owner",
        "body": "The owner exposes a private service through an endpoint service."
      },
      {
        "id": "concept-2",
        "title": "Consumer",
        "body": "The consumer creates an interface endpoint in another VPC."
      },
      {
        "id": "concept-3",
        "title": "PrivateLink service plan",
        "body": "SideResourceExamplePurposeOwnerNetwork Load Balancerowner-nlbFronts the serviceOwnerEndpoint servicecom.amazonaws.vpce.eu-west-2.vpce-svc-...Exposes the serviceConsumerInterface endpointconsumer-vpcePrivate access pointBothSecurity groupsallow-443Controls traffic"
      }
    ],
    "whyItMatters": "This matters because VPC design controls private access, routing, security, troubleshooting, and exam architecture choices.",
    "values": [
      {
        "label": "Owner VPC CIDR",
        "value": "10.31.0.0/16"
      },
      {
        "label": "Consumer VPC CIDR",
        "value": "10.32.0.0/16"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, endpoint service setup, load balancer setup, consumer endpoint setup, networking, and cleanup."
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Output path",
        "value": "content/SAA/guides/vpc_guides/saa-vpc-task-31.html"
      }
    ],
    "costWarning": "Network Load Balancers, interface endpoints, data processing, EC2 test instances, and cross-AZ traffic can create charges. Delete resources after the lab.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Endpoint service owner: ec2:CreateVpcEndpointServiceConfiguration, ec2:DescribeVpcEndpointServiceConfigurations, ec2:ModifyVpcEndpointServicePermissions, ec2:DescribeVpcEndpointConnections, ec2:AcceptVpcEndpointConnections Load balancer setup: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:RegisterTargets, elasticloadbalancing:CreateListener, elasticloadbalancing:DescribeLoadBalancers Consumer endpoint: ec2:CreateVpcEndpoint, ec2:DescribeVpcEndpoints, ec2:ModifyVpcEndpoint Networking: ec2:CreateVpc, ec2:CreateSubnet, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:CreateTags Cleanup: ec2:DeleteVpcEndpoints, ec2:DeleteVpcEndpointServiceConfigurations, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create or choose the service owner VPC",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create or choose an owner VPC with private subnets."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use 10.31.0.0/16 for the lab VPC if creating one."
          }
        ],
        "note": "Keep the owner and consumer CIDRs different.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the service load balancer",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2 → Load Balancers."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create a Network Load Balancer."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Place it in private or internal subnets."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Register a test target if available."
          }
        ],
        "note": null,
        "warning": "Endpoint services require a Network Load Balancer or Gateway Load Balancer.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the endpoint service",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC → Endpoint services."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create endpoint service."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select the Network Load Balancer."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Keep Acceptance required enabled for learning."
          }
        ],
        "note": "Acceptance required lets the owner approve consumer endpoint requests.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the consumer interface endpoint",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the consumer account or consumer VPC."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Go to VPC → Endpoints."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Create endpoint."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Select Other endpoint services."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Paste the endpoint service name."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Choose private subnets and a security group that allows the test port."
          }
        ],
        "note": "The consumer endpoint gets private IP addresses in the consumer VPC.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Accept and test the connection",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "In the owner account, open Endpoint services."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Open the endpoint service."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose the pending endpoint connection."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Accept endpoint connection request."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Test with private DNS name or endpoint DNS name."
          }
        ],
        "note": "Success means traffic reaches the owner service without VPC peering.",
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
            "text": "Delete the consumer interface endpoint."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Reject or remove endpoint service connections if needed."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the endpoint service."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the Network Load Balancer listener."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the Network Load Balancer."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete test instances, security groups, subnets, and VPCs if created."
          }
        ],
        "note": null,
        "warning": "Delete endpoint services after consumer endpoints are removed.",
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
            "text": "REGION=eu-west-2\nOWNER_VPC_ID=vpc-owner-example\nCONSUMER_VPC_ID=vpc-consumer-example\nNLB_ARN=arn:aws:elasticloadbalancing:eu-west-2:111122223333:loadbalancer/net/owner-nlb/example"
          }
        ],
        "note": "Replace example IDs with your lab values.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create endpoint service configuration",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-vpc-endpoint-service-configuration \\\n  --region $REGION \\\n  --network-load-balancer-arns $NLB_ARN \\\n  --acceptance-required"
          }
        ],
        "note": "Expected: AWS returns a service ID like vpce-svc-....",
        "warning": null,
        "expectedResult": "Expected: AWS returns a service ID like vpce-svc-...."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Allow a consumer principal",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "SERVICE_ID=vpce-svc-example\nCONSUMER_ACCOUNT=444455556666\naws ec2 modify-vpc-endpoint-service-permissions \\\n  --region $REGION \\\n  --service-id $SERVICE_ID \\\n  --add-allowed-principals arn:aws:iam::$CONSUMER_ACCOUNT:root"
          }
        ],
        "note": "This lets the consumer account request access.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create the consumer endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "SERVICE_NAME=com.amazonaws.vpce.eu-west-2.vpce-svc-example\nSUBNET_IDS=\"subnet-a subnet-b\"\nSG_ID=sg-consumer-example\naws ec2 create-vpc-endpoint \\\n  --region $REGION \\\n  --vpc-id $CONSUMER_VPC_ID \\\n  --vpc-endpoint-type Interface \\\n  --service-name $SERVICE_NAME \\\n  --subnet-ids $SUBNET_IDS \\\n  --security-group-ids $SG_ID"
          }
        ],
        "note": "Expected: endpoint state becomes pendingAcceptance.",
        "warning": null,
        "expectedResult": "Expected: endpoint state becomes pendingAcceptance."
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
            "text": "aws ec2 delete-vpc-endpoints --region $REGION --vpc-endpoint-ids vpce-example\naws ec2 delete-vpc-endpoint-service-configurations --region $REGION --service-ids vpce-svc-example"
          }
        ],
        "note": null,
        "warning": "Run cleanup only after testing.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "PrivateLink",
        "body": "PrivateLink gives private access to a service without peering the VPCs."
      },
      {
        "id": "cs-2",
        "title": "Owner vs consumer",
        "body": "RoleCreatesControlsExam ideaOwnerEndpoint serviceAllowed principalsProvider sideConsumerInterface endpointEndpoint security groupConsumer side"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the exact IAM actions in Console step 0. Then confirm your identity with aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Use eu-west-2 for all resources unless the step says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Wrong route table",
        "body": "Check the subnet association. A correct route in the wrong route table will not help."
      },
      {
        "id": "ts-4",
        "title": "Pending acceptance",
        "body": "The owner must accept the endpoint request when acceptance is required."
      },
      {
        "id": "ts-5",
        "title": "No response from service",
        "body": "Check endpoint security group, NLB target health, and service port."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "PrivateLink is not VPC peering",
        "body": "PrivateLink exposes one service. It does not route full VPC-to-VPC traffic."
      },
      {
        "id": "trap-2",
        "title": "NLB is required for this pattern",
        "body": "For standard endpoint services, use a Network Load Balancer or Gateway Load Balancer."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "PrivateLink is a private door. It opens one service, not the whole VPC.",
    "flashcardSetId": "vpc_task_31_flashcards"
  },
  {
    "id": "task-saa-vpc-troubleshoot-connectivity-with-reachability-analyzer-and-traceroute-032",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Troubleshoot connectivity with Reachability Analyzer and traceroute",
    "slug": "troubleshoot-connectivity-with-reachability-analyzer-and-traceroute",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Use Reachability Analyzer for AWS configuration checks and traceroute or curl for live packet tests.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Reachability Analyzer",
        "body": "Reachability Analyzer checks AWS network configuration. It does not send live packets."
      },
      {
        "id": "concept-2",
        "title": "Traceroute",
        "body": "Traceroute tests a real path from the operating system. Some hops may hide ICMP replies."
      },
      {
        "id": "concept-3",
        "title": "Troubleshooting plan",
        "body": "ToolTestsBest forLimitReachability AnalyzerAWS configSecurity groups, NACLs, routesStatic analysisTracerouteLive pathPacket path from instanceICMP may be blockedcurl / ncApp portHTTP or TCP testingNeeds reachable service"
      }
    ],
    "whyItMatters": "This matters because VPC design controls private access, routing, security, troubleshooting, and exam architecture choices.",
    "values": [
      {
        "label": "Example source",
        "value": "EC2 instance ENI"
      },
      {
        "label": "Example destination",
        "value": "Private EC2 instance ENI"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, Reachability Analyzer, network read permissions, test instance access, and cleanup."
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Output path",
        "value": "content/SAA/guides/vpc_guides/saa-vpc-task-32.html"
      }
    ],
    "costWarning": "Reachability Analyzer analysis requests can create small charges. EC2 test instances and data transfer can also cost money. Delete lab resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Reachability Analyzer: ec2:CreateNetworkInsightsPath, ec2:StartNetworkInsightsAnalysis, ec2:DescribeNetworkInsightsPaths, ec2:DescribeNetworkInsightsAnalyses, ec2:DeleteNetworkInsightsPath Read network resources: ec2:DescribeInstances, ec2:DescribeNetworkInterfaces, ec2:DescribeRouteTables, ec2:DescribeSecurityGroups, ec2:DescribeNetworkAcls, ec2:DescribeSubnets Test instance access: ssm:StartSession, ssm:DescribeInstanceInformation, ec2-instance-connect:SendSSHPublicKey Cleanup: ec2:DeleteNetworkInsightsPath",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Pick source and destination",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 → Instances."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose a source instance."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose a destination instance, ENI, internet gateway, or transit gateway."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Write down the source and destination IDs."
          }
        ],
        "note": "Use resources in the same lab VPC if starting simple.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a Reachability Analyzer path",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC → Reachability Analyzer."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create and analyze path."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Set the source resource."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set the destination resource."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose the protocol and port, such as TCP 80 or TCP 22."
          }
        ],
        "note": "Pick the exact port you want to test.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Read the result",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the analysis result."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Check if the path is Reachable or Not reachable."
          },
          {
            "id": "console-step-4-item-3",
            "text": "If blocked, read the component that blocked it."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Check route tables, security groups, and NACLs."
          }
        ],
        "note": "The result gives hop-by-hop details when reachable.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Run traceroute from the instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Connect to the source instance with Session Manager or SSH."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Run traceroute destination-private-ip on Linux."
          },
          {
            "id": "console-step-5-item-3",
            "text": "If traceroute is missing, install it or use tracepath."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Use curl or nc for application ports."
          }
        ],
        "note": null,
        "warning": "Traceroute can look blocked even when TCP works because ICMP/UDP replies may be filtered.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Fix one issue and retest",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Fix the route, security group, or NACL problem found."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Run Reachability Analyzer again."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Run the live test again from the instance."
          }
        ],
        "note": "Use both tools. One checks config. One checks real traffic.",
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
            "text": "Delete the Network Insights path."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Remove any temporary security group rules."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Stop or terminate any temporary instances if created."
          }
        ],
        "note": null,
        "warning": "Do not leave broad SSH or ICMP rules open.",
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
        "title": "Create a Network Insights path",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nSOURCE=eni-source-example\nDESTINATION=eni-destination-example\naws ec2 create-network-insights-path \\\n  --region $REGION \\\n  --source $SOURCE \\\n  --destination $DESTINATION \\\n  --protocol tcp \\\n  --destination-port 80"
          }
        ],
        "note": "Expected: AWS returns a Network Insights path ID.",
        "warning": null,
        "expectedResult": "Expected: AWS returns a Network Insights path ID."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Start analysis",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "PATH_ID=nip-example\naws ec2 start-network-insights-analysis \\\n  --region $REGION \\\n  --network-insights-path-id $PATH_ID"
          }
        ],
        "note": "Expected: AWS returns an analysis ID.",
        "warning": null,
        "expectedResult": "Expected: AWS returns an analysis ID."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Read analysis result",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "ANALYSIS_ID=nia-example\naws ec2 describe-network-insights-analyses \\\n  --region $REGION \\\n  --network-insights-analysis-ids $ANALYSIS_ID"
          }
        ],
        "note": "Look for NetworkPathFound.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Live test from Linux instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "traceroute 10.32.2.10\ncurl -I http://10.32.2.10\nnc -vz 10.32.2.10 80"
          }
        ],
        "note": "Run these inside the source instance, not from your laptop.",
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
            "text": "aws ec2 delete-network-insights-path --region $REGION --network-insights-path-id $PATH_ID"
          }
        ],
        "note": "Deletes the saved path.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Static vs live",
        "body": "Reachability Analyzer checks configuration. Traceroute and curl test from the OS."
      },
      {
        "id": "cs-2",
        "title": "Common blockers",
        "body": "BlockerWhereSymptomFixSecurity groupInstance ENIPort blockedAllow source SG or CIDRNACLSubnetReturn traffic blockedAllow ephemeral portsRoute tableSubnetNo pathAdd correct routeFirewallApplianceAsymmetric dropFix routing path"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the exact IAM actions in Console step 0. Then confirm your identity with aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Use eu-west-2 for all resources unless the step says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Wrong route table",
        "body": "Check the subnet association. A correct route in the wrong route table will not help."
      },
      {
        "id": "ts-4",
        "title": "Analysis not supported",
        "body": "Check that the source and destination resource types are supported by Reachability Analyzer."
      },
      {
        "id": "ts-5",
        "title": "Traceroute shows stars",
        "body": "Asterisks can mean ICMP or UDP replies are blocked. Test the real TCP port too."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Reachability Analyzer is not packet capture",
        "body": "It analyzes configuration. It does not prove the application is healthy."
      },
      {
        "id": "trap-2",
        "title": "Traceroute can mislead",
        "body": "Traceroute may fail while the app port still works."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Analyzer checks the map. Traceroute drives the road. Use both when troubleshooting.",
    "flashcardSetId": "vpc_task_32_flashcards"
  },
  {
    "id": "task-saa-vpc-plan-high-availability-for-nats-and-transit-gateway-attachments-033",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Plan high availability for NATs and Transit Gateway attachments",
    "slug": "plan-high-availability-for-nats-and-transit-gateway-attachments",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Plan and implement NAT Gateway and Transit Gateway attachment placement across Availability Zones.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "NAT Gateway HA",
        "body": "For zonal NAT gateways, place one NAT Gateway in each AZ and route each private subnet to the NAT in the same AZ."
      },
      {
        "id": "concept-2",
        "title": "Transit Gateway HA",
        "body": "Attach each VPC using subnets in multiple AZs where possible."
      },
      {
        "id": "concept-3",
        "title": "HA routing plan",
        "body": "ComponentAZ AAZ BRoute ideaWhyNAT Gatewaynat-anat-bPrivate A to NAT A, Private B to NAT BAvoid cross-AZ dependencyPrivate route tablert-private-art-private-bSeparate default routesCleaner failure scopeTGW attachmentSubnet ASubnet BAttach across AZsBetter resilienceTGW route tableSharedSharedRoutes to attachmentsCentral routing"
      }
    ],
    "whyItMatters": "This matters because VPC design controls private access, routing, security, troubleshooting, and exam architecture choices.",
    "values": [
      {
        "label": "AZs",
        "value": "eu-west-2a and eu-west-2b"
      },
      {
        "label": "NAT pattern",
        "value": "One NAT Gateway per AZ"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, NAT Gateway setup, route table changes, Transit Gateway attachments, and cleanup."
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Output path",
        "value": "content/SAA/guides/vpc_guides/saa-vpc-task-33.html"
      }
    ],
    "costWarning": "NAT Gateways, Elastic IPs, Transit Gateway attachments, TGW data processing, EC2 tests, and cross-AZ traffic can create charges. Tear down lab resources quickly.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity NAT Gateway setup: ec2:CreateNatGateway, ec2:DescribeNatGateways, ec2:AllocateAddress, ec2:ReleaseAddress, ec2:DeleteNatGateway Route tables: ec2:CreateRoute, ec2:ReplaceRoute, ec2:DescribeRouteTables, ec2:AssociateRouteTable, ec2:DisassociateRouteTable Transit Gateway: ec2:CreateTransitGateway, ec2:CreateTransitGatewayVpcAttachment, ec2:DescribeTransitGatewayAttachments, ec2:CreateTransitGatewayRoute, ec2:AssociateTransitGatewayRouteTable Cleanup: ec2:DeleteNatGateway, ec2:DeleteTransitGatewayVpcAttachment, ec2:DeleteTransitGateway, ec2:DeleteRoute",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Plan the high availability design",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Use two Availability Zones: eu-west-2a and eu-west-2b."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use one public subnet per AZ for NAT Gateways."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use one private route table per AZ."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use Transit Gateway attachments with subnets in more than one AZ."
          }
        ],
        "note": "Keep each private subnet using the NAT Gateway in the same AZ.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create NAT Gateways per AZ",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open VPC → NAT gateways."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create nat-a in public subnet A."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create nat-b in public subnet B."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Allocate one Elastic IP for each NAT Gateway."
          }
        ],
        "note": null,
        "warning": "NAT Gateways cost per hour and per GB.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Update private route tables",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC → Route tables."
          },
          {
            "id": "console-step-4-item-2",
            "text": "For private subnet A route table, add 0.0.0.0/0 to nat-a."
          },
          {
            "id": "console-step-4-item-3",
            "text": "For private subnet B route table, add 0.0.0.0/0 to nat-b."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Confirm each private subnet is associated with the correct route table."
          }
        ],
        "note": "This avoids sending AZ A traffic through AZ B.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create or review Transit Gateway attachments",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open VPC → Transit gateways."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Create or choose a Transit Gateway."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Create VPC attachments using subnets from at least two AZs."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Associate and propagate routes in the Transit Gateway route table."
          }
        ],
        "note": "TGW route tables control which attachments can talk.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test failure thinking",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Do not break production resources."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Review what happens if eu-west-2a fails."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm private subnet B uses nat-b."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Confirm TGW has another attachment subnet in AZ B."
          }
        ],
        "note": "This is a design and routing lab. Avoid intentionally deleting shared resources.",
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
            "text": "Remove test routes to NAT Gateways."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete NAT Gateways."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Wait until NAT Gateways are deleted."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Release Elastic IPs."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete Transit Gateway routes if created."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete VPC attachments."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete the Transit Gateway if it was created only for this lab."
          }
        ],
        "note": null,
        "warning": "Release Elastic IPs after NAT Gateways are deleted to avoid unused EIP charges.",
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
        "title": "Create NAT Gateways in two AZs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nPUB_SUBNET_A=subnet-public-a\nPUB_SUBNET_B=subnet-public-b\nEIP_A=$(aws ec2 allocate-address --region $REGION --domain vpc --query AllocationId --output text)\nEIP_B=$(aws ec2 allocate-address --region $REGION --domain vpc --query AllocationId --output text)\naws ec2 create-nat-gateway --region $REGION --subnet-id $PUB_SUBNET_A --allocation-id $EIP_A --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=nat-a}]'\naws ec2 create-nat-gateway --region $REGION --subnet-id $PUB_SUBNET_B --allocation-id $EIP_B --tag-specifications 'ResourceType=natgateway,Tags=[{Key=Name,Value=nat-b}]'"
          }
        ],
        "note": "Expected: two NAT Gateways are created.",
        "warning": null,
        "expectedResult": "Expected: two NAT Gateways are created."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Add AZ-local NAT routes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "RT_PRIVATE_A=rtb-private-a\nRT_PRIVATE_B=rtb-private-b\nNAT_A=nat-a-example\nNAT_B=nat-b-example\naws ec2 create-route --region $REGION --route-table-id $RT_PRIVATE_A --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_A\naws ec2 create-route --region $REGION --route-table-id $RT_PRIVATE_B --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_B"
          }
        ],
        "note": "Use replace-route if a default route already exists.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a Transit Gateway attachment",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "TGW_ID=tgw-example\nVPC_ID=vpc-example\nSUBNETS=\"subnet-private-a subnet-private-b\"\naws ec2 create-transit-gateway-vpc-attachment \\\n  --region $REGION \\\n  --transit-gateway-id $TGW_ID \\\n  --vpc-id $VPC_ID \\\n  --subnet-ids $SUBNETS"
          }
        ],
        "note": "Use subnets in multiple AZs.",
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
            "text": "aws ec2 delete-route --region $REGION --route-table-id $RT_PRIVATE_A --destination-cidr-block 0.0.0.0/0\naws ec2 delete-route --region $REGION --route-table-id $RT_PRIVATE_B --destination-cidr-block 0.0.0.0/0\naws ec2 delete-nat-gateway --region $REGION --nat-gateway-id $NAT_A\naws ec2 delete-nat-gateway --region $REGION --nat-gateway-id $NAT_B\n# Release EIPs after NAT Gateways are deleted:\n# aws ec2 release-address --region $REGION --allocation-id $EIP_A\n# aws ec2 release-address --region $REGION --allocation-id $EIP_B"
          }
        ],
        "note": null,
        "warning": "Wait until NAT Gateways are deleted before releasing EIPs.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "NAT rule",
        "body": "For zonal NAT Gateways, use one per AZ for better resilience."
      },
      {
        "id": "cs-2",
        "title": "TGW rule",
        "body": "Transit Gateway attachments should use multiple subnets across AZs when possible."
      },
      {
        "id": "cs-3",
        "title": "Cost vs HA",
        "body": "DesignCostResilienceExam answerOne NAT onlyLowerAZ dependencyUsually not best for HAOne NAT per AZHigherBetterBest common answerTGW multi-AZ attachmentHigherBetterBest for critical networks"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the exact IAM actions in Console step 0. Then confirm your identity with aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Use eu-west-2 for all resources unless the step says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Wrong route table",
        "body": "Check the subnet association. A correct route in the wrong route table will not help."
      },
      {
        "id": "ts-4",
        "title": "Cross-AZ NAT cost",
        "body": "If private subnet A uses NAT Gateway B, traffic may cross AZs and reduce resilience."
      },
      {
        "id": "ts-5",
        "title": "TGW route missing",
        "body": "Check both VPC route tables and Transit Gateway route tables."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "One NAT Gateway is not full HA",
        "body": "A single zonal NAT Gateway can become an AZ dependency."
      },
      {
        "id": "trap-2",
        "title": "TGW routing is two-sided",
        "body": "You need VPC route tables and Transit Gateway route tables."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Keep traffic local to the AZ. AZ-local NAT reduces blast radius.",
    "flashcardSetId": "vpc_task_33_flashcards"
  },
  {
    "id": "task-saa-vpc-create-least-privilege-iam-for-vpc-endpoint-management-034",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Create least privilege IAM for VPC endpoint management",
    "slug": "create-least-privilege-iam-for-vpc-endpoint-management",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create IAM policies and principals that can manage VPC endpoints without broad admin access.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Least privilege",
        "body": "Give the principal only the actions needed to create, read, update, tag, and delete VPC endpoints."
      },
      {
        "id": "concept-2",
        "title": "Read actions matter",
        "body": "Users often need Describe* actions so the Console can show VPCs, subnets, routes, and services."
      },
      {
        "id": "concept-3",
        "title": "Least privilege action plan",
        "body": "PurposeActionsWhyScope ideaCreate endpointec2:CreateVpcEndpointBuild endpointUse tags/conditions where possibleChange endpointec2:ModifyVpcEndpointUpdate policy/subnets/SGsRestrict by tagDelete endpointec2:DeleteVpcEndpointsCleanupRestrict by tagRead networkec2:Describe*Console visibilityOften needs * resourceTaggingec2:CreateTagsLab ownershipRequire lab tag"
      }
    ],
    "whyItMatters": "This matters because VPC design controls private access, routing, security, troubleshooting, and exam architecture choices.",
    "values": [
      {
        "label": "Policy name",
        "value": "VpcEndpointManagementLabPolicy"
      },
      {
        "label": "Role name",
        "value": "vpc-endpoint-admin-lab"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, IAM policy work, VPC endpoint management, network read actions, tagging, and cleanup."
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Output path",
        "value": "content/SAA/guides/vpc_guides/saa-vpc-task-34.html"
      }
    ],
    "costWarning": "IAM policies do not normally create direct charges. Test VPC endpoints may create charges. Delete any endpoints created during testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity IAM policy work: iam:CreatePolicy, iam:GetPolicy, iam:CreateRole, iam:AttachRolePolicy, iam:DetachRolePolicy, iam:DeletePolicy, iam:DeleteRole VPC endpoint management: ec2:CreateVpcEndpoint, ec2:ModifyVpcEndpoint, ec2:DeleteVpcEndpoints, ec2:DescribeVpcEndpoints, ec2:DescribeVpcEndpointServices Network read: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeSecurityGroups Tagging: ec2:CreateTags, ec2:DeleteTags Cleanup: iam:DetachRolePolicy, iam:DeleteRole, iam:DeletePolicy, ec2:DeleteVpcEndpoints",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Plan the lab principal",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open IAM."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose whether to create a role, user, or permission set for the lab."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use role-based access where possible."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use the name vpc-endpoint-admin-lab."
          }
        ],
        "note": null,
        "warning": "Avoid long-term access keys where possible.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a least privilege policy",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open IAM → Policies."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create policy."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose JSON."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Paste a policy that allows endpoint actions, needed read actions, and tagging."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Name it VpcEndpointManagementLabPolicy."
          }
        ],
        "note": "Start with the actions in the table. Then add conditions after the basic lab works.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Attach the policy to the principal",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the role, user, or permission set."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Attach VpcEndpointManagementLabPolicy."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Sign in or switch role as that principal."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Confirm you can open VPC → Endpoints."
          }
        ],
        "note": "The Console needs read actions to list VPC resources.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test endpoint permissions",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Create a test Gateway endpoint for S3 or an Interface endpoint for Secrets Manager."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Tag it with Lab=VpcEndpointManagement."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Modify the endpoint policy or security group if using an interface endpoint."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Delete the test endpoint."
          }
        ],
        "note": "Success means the least privilege set is enough for the workflow.",
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
            "text": "Delete test VPC endpoints."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Detach the custom policy from the principal."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the custom policy."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the test role or user if created."
          }
        ],
        "note": null,
        "warning": "Do not delete a role or policy used outside the lab.",
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
        "title": "Create the policy document",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "cat > vpc-endpoint-policy.json <<'EOF'\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"ec2:CreateVpcEndpoint\",\"ec2:ModifyVpcEndpoint\",\"ec2:DeleteVpcEndpoints\",\"ec2:DescribeVpcEndpoints\",\"ec2:DescribeVpcEndpointServices\",\"ec2:DescribeVpcs\",\"ec2:DescribeSubnets\",\"ec2:DescribeRouteTables\",\"ec2:DescribeSecurityGroups\",\"ec2:CreateTags\",\"ec2:DeleteTags\"],\"Resource\":\"*\"}]}\nEOF"
          }
        ],
        "note": "This is a simple lab policy. Add stricter conditions in real accounts.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the IAM policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws iam create-policy \\\n  --policy-name VpcEndpointManagementLabPolicy \\\n  --policy-document file://vpc-endpoint-policy.json"
          }
        ],
        "note": "Expected: AWS returns a policy ARN.",
        "warning": null,
        "expectedResult": "Expected: AWS returns a policy ARN."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Attach the policy to a role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "POLICY_ARN=arn:aws:iam::111122223333:policy/VpcEndpointManagementLabPolicy\nROLE_NAME=vpc-endpoint-admin-lab\naws iam attach-role-policy --role-name $ROLE_NAME --policy-arn $POLICY_ARN"
          }
        ],
        "note": "Create the role first if it does not already exist.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Test endpoint read access",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-vpc-endpoint-services --region eu-west-2\naws ec2 describe-vpc-endpoints --region eu-west-2"
          }
        ],
        "note": "Expected: the commands return service and endpoint data.",
        "warning": null,
        "expectedResult": "Expected: the commands return service and endpoint data."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up IAM policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws iam detach-role-policy --role-name $ROLE_NAME --policy-arn $POLICY_ARN\naws iam delete-policy --policy-arn $POLICY_ARN\nrm -f vpc-endpoint-policy.json"
          }
        ],
        "note": null,
        "warning": "Only delete lab policies.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Endpoint actions",
        "body": "Use ec2:CreateVpcEndpoint, ec2:ModifyVpcEndpoint, and ec2:DeleteVpcEndpoints."
      },
      {
        "id": "cs-2",
        "title": "Read actions",
        "body": "Console workflows often need several Describe* actions."
      },
      {
        "id": "cs-3",
        "title": "Policy summary",
        "body": "NeedAction examplesExam clueBuildec2:CreateVpcEndpointCreate endpointInspectec2:DescribeVpcEndpointsVerify endpointSecureec2:ModifyVpcEndpointChange policyCleanec2:DeleteVpcEndpointsDelete endpoint"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the exact IAM actions in Console step 0. Then confirm your identity with aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Use eu-west-2 for all resources unless the step says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Wrong route table",
        "body": "Check the subnet association. A correct route in the wrong route table will not help."
      },
      {
        "id": "ts-4",
        "title": "Console cannot show VPCs",
        "body": "Add the needed ec2:DescribeVpcs, ec2:DescribeSubnets, and ec2:DescribeRouteTables actions."
      },
      {
        "id": "ts-5",
        "title": "Can create but cannot tag",
        "body": "Add ec2:CreateTags for the endpoint resource."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Least privilege still needs read access",
        "body": "A user may need read-only network actions to choose the right VPC and subnet."
      },
      {
        "id": "trap-2",
        "title": "IAM is not endpoint policy",
        "body": "IAM controls who can manage the endpoint. Endpoint policy controls service access through the endpoint."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "IAM manages the endpoint. Endpoint policy controls the path. They are not the same.",
    "flashcardSetId": "vpc_task_34_flashcards"
  },
  {
    "id": "task-saa-vpc-compare-vpc-sharing-vpc-peering-and-privatelink-035",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Compare VPC sharing, VPC peering, and PrivateLink",
    "slug": "compare-vpc-sharing-vpc-peering-and-privatelink",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Simulate cross-account access patterns and choose the right design for shared subnets, private routing, or private service exposure.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "VPC sharing",
        "body": "One account owns the VPC. Other accounts create resources in shared subnets."
      },
      {
        "id": "concept-2",
        "title": "VPC peering",
        "body": "Two VPCs route private IP traffic to each other. It is not transitive."
      },
      {
        "id": "concept-3",
        "title": "PrivateLink",
        "body": "Consumers privately access one service through interface endpoints."
      },
      {
        "id": "concept-4",
        "title": "Cross-account comparison",
        "body": "PatternBest forRoutes full VPC?Overlapping CIDR?Common exam clueVPC sharingCentral VPC ownershipSame VPC subnetsNot relevant inside shared VPCShared network team modelVPC peeringTwo VPCs need private IP accessYes, between peersNoSimple VPC-to-VPCPrivateLinkOne private serviceNoOften okayExpose service onlyTransit GatewayMany VPCsYes through hubNoScale hub-and-spoke"
      }
    ],
    "whyItMatters": "This matters because VPC design controls private access, routing, security, troubleshooting, and exam architecture choices.",
    "values": [
      {
        "label": "Account A",
        "value": "Network or service owner"
      },
      {
        "label": "Account B",
        "value": "Application or consumer account"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, RAM sharing, VPC peering, PrivateLink, read actions, and cleanup."
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Output path",
        "value": "content/SAA/guides/vpc_guides/saa-vpc-task-35.html"
      }
    ],
    "costWarning": "VPC sharing has no direct VPC sharing charge. PrivateLink endpoints, NLBs, NATs, EC2 tests, and data transfer can create charges. Delete test resources after the lab.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC sharing: ram:CreateResourceShare, ram:AssociateResourceShare, ram:GetResourceShares, ram:DeleteResourceShare, ec2:DescribeSubnets VPC peering: ec2:CreateVpcPeeringConnection, ec2:AcceptVpcPeeringConnection, ec2:CreateRoute, ec2:DeleteVpcPeeringConnection PrivateLink: ec2:CreateVpcEndpoint, ec2:CreateVpcEndpointServiceConfiguration, ec2:ModifyVpcEndpointServicePermissions, ec2:DeleteVpcEndpoints Read and cleanup: ec2:DescribeVpcs, ec2:DescribeRouteTables, ec2:DescribeVpcEndpoints, ec2:DescribeVpcPeeringConnections",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the comparison plan",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Use Account A as the network or service owner."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use Account B as the application or consumer account."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use separate CIDRs for peering tests."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use PrivateLink when only one service needs to be exposed."
          }
        ],
        "note": "This lab is a simulation and evaluation task. Create only the pattern you want to test.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Simulate VPC sharing",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In Account A, open Resource Access Manager."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create a resource share."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Share selected VPC subnets with Account B or an AWS Organizations OU."
          },
          {
            "id": "console-step-3-item-4",
            "text": "In Account B, check that shared subnets appear when launching supported resources."
          }
        ],
        "note": "The VPC owner controls VPC-level resources. Participants place resources in shared subnets.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Simulate VPC peering",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Create or choose two VPCs with non-overlapping CIDRs."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Create a VPC peering connection."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Accept it from the other VPC or account."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Add routes in both VPC route tables."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Test private IP connectivity."
          }
        ],
        "note": null,
        "warning": "Peering is not transitive.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Simulate PrivateLink",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "In Account A, expose a service behind a Network Load Balancer."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Create an endpoint service."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Allow Account B as a principal."
          },
          {
            "id": "console-step-5-item-4",
            "text": "In Account B, create an interface endpoint to the service."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Accept the endpoint if required."
          }
        ],
        "note": "PrivateLink exposes the service, not the whole VPC.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Choose the right pattern",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Use VPC sharing for centralized subnet ownership."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Use VPC peering for simple private VPC-to-VPC routing."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Use PrivateLink for private service access across accounts."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Use Transit Gateway for many VPCs."
          }
        ],
        "note": "Exam answers usually depend on scale, routing needs, and blast radius.",
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
            "text": "Delete PrivateLink consumer endpoints."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete PrivateLink endpoint service and NLB if created."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete peering routes."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the VPC peering connection."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Remove RAM resource share associations."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the RAM resource share if lab-only."
          }
        ],
        "note": null,
        "warning": "Do not remove shared production subnets.",
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
        "title": "List shared resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ram get-resource-shares --region eu-west-2 --resource-owner SELF\naws ec2 describe-subnets --region eu-west-2 --filters Name=owner-id,Values=111122223333"
          }
        ],
        "note": "Use this to verify shared subnet visibility.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create a VPC peering connection",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nVPC_A=vpc-a-example\nVPC_B=vpc-b-example\naws ec2 create-vpc-peering-connection \\\n  --region $REGION \\\n  --vpc-id $VPC_A \\\n  --peer-vpc-id $VPC_B"
          }
        ],
        "note": "For cross-account peering, include peer owner details.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create PrivateLink consumer endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "SERVICE_NAME=com.amazonaws.vpce.eu-west-2.vpce-svc-example\nCONSUMER_VPC=vpc-consumer-example\nSUBNETS=\"subnet-a subnet-b\"\nSG_ID=sg-consumer-example\naws ec2 create-vpc-endpoint \\\n  --region $REGION \\\n  --vpc-id $CONSUMER_VPC \\\n  --vpc-endpoint-type Interface \\\n  --service-name $SERVICE_NAME \\\n  --subnet-ids $SUBNETS \\\n  --security-group-ids $SG_ID"
          }
        ],
        "note": "Use this only if the provider endpoint service exists.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Clean up examples",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-vpc-endpoints --region $REGION --vpc-endpoint-ids vpce-example\naws ec2 delete-vpc-peering-connection --region $REGION --vpc-peering-connection-id pcx-example\naws ram delete-resource-share --region $REGION --resource-share-arn arn:aws:ram:eu-west-2:111122223333:resource-share/example"
          }
        ],
        "note": null,
        "warning": "Replace example IDs and only delete lab resources.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Fast choice",
        "body": "Sharing = same VPC subnets. Peering = private routing between two VPCs. PrivateLink = private service only."
      },
      {
        "id": "cs-2",
        "title": "Decision table",
        "body": "NeedBest optionWhyCentral subnetsVPC sharingNetwork account owns VPCTwo VPCs talkVPC peeringSimple private IP routingExpose one servicePrivateLinkNo full network accessMany VPCsTransit GatewayHub-and-spoke scale"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the exact IAM actions in Console step 0. Then confirm your identity with aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Use eu-west-2 for all resources unless the step says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Wrong route table",
        "body": "Check the subnet association. A correct route in the wrong route table will not help."
      },
      {
        "id": "ts-4",
        "title": "Shared subnet not visible",
        "body": "Check RAM share acceptance, AWS Organizations settings, and subnet share association."
      },
      {
        "id": "ts-5",
        "title": "Peering no traffic",
        "body": "Check routes in both VPCs and security group sources."
      },
      {
        "id": "ts-6",
        "title": "PrivateLink no traffic",
        "body": "Check endpoint acceptance, endpoint SG, NLB listener, and target health."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "PrivateLink is service access only",
        "body": "It does not replace full VPC routing."
      },
      {
        "id": "trap-2",
        "title": "Peering is not transitive",
        "body": "A to B and B to C does not mean A can reach C."
      },
      {
        "id": "trap-3",
        "title": "VPC sharing is not VPC peering",
        "body": "Participants place resources into shared subnets. They do not own the VPC."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Share subnets, peer networks, link services. Each pattern solves a different problem.",
    "flashcardSetId": "vpc_task_35_flashcards"
  },
  {
    "id": "task-saa-vpc-review-and-implement-vpc-security-best-practices-036",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpc",
    "title": "Review and implement VPC security best practices",
    "slug": "review-and-implement-vpc-security-best-practices",
    "service": "Amazon VPC",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Review a VPC and apply safer admin access, least privilege rules, and flow log visibility.",
    "status": "published",
    "tags": [
      "VPC",
      "Networking",
      "Virtual Private Cloud",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Bastion host",
        "body": "A bastion can be used for admin access, but it must be tightly locked down."
      },
      {
        "id": "concept-2",
        "title": "SSM Session Manager",
        "body": "Session Manager can reduce or remove the need for inbound SSH."
      },
      {
        "id": "concept-3",
        "title": "VPC security checklist",
        "body": "AreaBest practiceWhyExam clueAdmin accessPrefer SSMNo inbound SSH neededSecure operationsBastionLimit to your IPSmaller attack surfaceSSH only when neededSecurity groupsLeast privilegeStateful filteringInstance firewallNACLsSubnet guardrailStateless filteringReturn ports matterFlow LogsEnable for visibilityTroubleshooting/auditAccept/reject recordsIAMLeast privilegeReduce blast radiusExact actions"
      }
    ],
    "whyItMatters": "This matters because VPC design controls private access, routing, security, troubleshooting, and exam architecture choices.",
    "values": [
      {
        "label": "Preferred admin access",
        "value": "AWS Systems Manager Session Manager"
      },
      {
        "label": "Fallback admin access",
        "value": "Bastion host with your-ip/32 only"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, security group changes, SSM access, Flow Logs, IAM role pass, read actions, and cleanup."
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Output path",
        "value": "content/SAA/guides/vpc_guides/saa-vpc-task-36.html"
      }
    ],
    "costWarning": "Flow Logs, CloudWatch Logs, S3 log storage, NAT Gateways, EC2 instances, and data transfer can create charges. Delete lab logging and test resources after review.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with VPC permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Security groups and routing: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:RevokeSecurityGroupIngress, ec2:CreateRoute, ec2:DescribeRouteTables SSM Session Manager: iam:CreateRole, iam:AttachRolePolicy, iam:PassRole, ssm:StartSession, ssm:DescribeInstanceInformation Flow Logs: ec2:CreateFlowLogs, ec2:DescribeFlowLogs, ec2:DeleteFlowLogs, logs:CreateLogGroup, logs:DescribeLogGroups, iam:CreateRole, iam:PassRole Read and cleanup: ec2:DescribeInstances, ec2:DescribeSecurityGroups, ec2:DeleteSecurityGroup, logs:DeleteLogGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Review the VPC entry points",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC and EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Find public subnets, internet gateways, NAT Gateways, and public IP instances."
          },
          {
            "id": "console-step-2-item-3",
            "text": "List which resources can be reached from the internet."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Remove public access where it is not needed."
          }
        ],
        "note": "Public IP plus route to IGW can create internet exposure.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Secure admin access",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Prefer AWS Systems Manager Session Manager for EC2 admin access."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Attach an instance profile with AmazonSSMManagedInstanceCore to test instances."
          },
          {
            "id": "console-step-3-item-3",
            "text": "If using a bastion, allow SSH only from your-ip/32."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Allow private instances to accept SSH only from the bastion security group."
          }
        ],
        "note": null,
        "warning": "Do not open SSH to 0.0.0.0/0.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Apply least privilege security groups",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 → Security Groups."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Remove unused inbound rules."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Use security group references instead of broad CIDRs where possible."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Allow only required app ports, such as 443 from the load balancer security group."
          }
        ],
        "note": "Security groups are stateful.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Enable VPC Flow Logs",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open VPC → Your VPCs."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select the lab VPC."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Actions → Create flow log."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Send logs to CloudWatch Logs or S3."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Use All traffic for the learning lab."
          }
        ],
        "note": "Flow Logs help show accepted and rejected traffic metadata.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Check least privilege IAM",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Review roles used by EC2 and admins."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Remove unused policies."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Avoid broad * permissions for real accounts."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Use tags and conditions where possible."
          }
        ],
        "note": "IAM controls who can change the network.",
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
            "text": "Delete temporary Flow Logs."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete temporary CloudWatch log groups or S3 log buckets if created."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Remove temporary security group rules."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete temporary security groups."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Detach test IAM policies or roles if created."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Terminate lab instances if created."
          }
        ],
        "note": null,
        "warning": "Do not delete shared security logging used by real workloads.",
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
        "title": "Review public exposure",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\naws ec2 describe-instances --region $REGION \\\n  --query 'Reservations[].Instances[].{Id:InstanceId,PublicIp:PublicIpAddress,PrivateIp:PrivateIpAddress,State:State.Name}' \\\n  --output table\naws ec2 describe-route-tables --region $REGION \\\n  --query 'RouteTables[].Routes[?GatewayId!=null]' \\\n  --output table"
          }
        ],
        "note": "Look for public IPs and routes to internet gateways.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Check SSM managed instances",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ssm describe-instance-information --region $REGION --output table"
          }
        ],
        "note": "Instances listed here can normally use Session Manager.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a VPC Flow Log to CloudWatch Logs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "VPC_ID=vpc-example\nLOG_GROUP=/aws/vpc/task36-flowlogs\nROLE_ARN=arn:aws:iam::111122223333:role/vpc-flow-logs-role\naws logs create-log-group --region $REGION --log-group-name $LOG_GROUP\naws ec2 create-flow-logs \\\n  --region $REGION \\\n  --resource-type VPC \\\n  --resource-ids $VPC_ID \\\n  --traffic-type ALL \\\n  --log-destination-type cloud-watch-logs \\\n  --log-group-name $LOG_GROUP \\\n  --deliver-logs-permission-arn $ROLE_ARN"
          }
        ],
        "note": "Replace role ARN with your flow logs role.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Clean up logging",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "FLOW_LOG_ID=fl-example\naws ec2 delete-flow-logs --region $REGION --flow-log-ids $FLOW_LOG_ID\naws logs delete-log-group --region $REGION --log-group-name /aws/vpc/task36-flowlogs"
          }
        ],
        "note": null,
        "warning": "Only delete lab log groups.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Virtual Private Cloud configuration verified in Amazon VPC."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete subnets, route tables, Internet Gateways, and the custom VPC created during this lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the NAT Gateway and wait for state to show Deleted before releasing the associated Elastic IP."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Best default",
        "body": "Prefer private instances plus Session Manager over public SSH."
      },
      {
        "id": "cs-2",
        "title": "Security layers",
        "body": "LayerControlsStateful?Use forSecurity groupInstance or ENI trafficYesWorkload accessNACLSubnet trafficNoSubnet guardrailRoute tableTraffic pathNoNetwork directionFlow LogsTraffic metadataNoVisibility"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the exact IAM actions in Console step 0. Then confirm your identity with aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Wrong Region",
        "body": "Use eu-west-2 for all resources unless the step says otherwise."
      },
      {
        "id": "ts-3",
        "title": "Wrong route table",
        "body": "Check the subnet association. A correct route in the wrong route table will not help."
      },
      {
        "id": "ts-4",
        "title": "SSM not working",
        "body": "Check SSM agent, instance profile, network path to SSM endpoints, and AmazonSSMManagedInstanceCore."
      },
      {
        "id": "ts-5",
        "title": "Flow Logs not delivered",
        "body": "Check IAM role, log destination, and CloudWatch log group permissions."
      },
      {
        "id": "ts-6",
        "title": "App blocked after tightening rules",
        "body": "Check load balancer security group source and app port rules."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Bastion is not always required",
        "body": "Session Manager can provide admin access without opening inbound SSH."
      },
      {
        "id": "trap-2",
        "title": "Flow Logs do not show packet payload",
        "body": "They show metadata such as source, destination, action, and ports."
      },
      {
        "id": "trap-3",
        "title": "Least privilege applies to network admins too",
        "body": "The identity changing VPC resources should have controlled permissions."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Private first, least access, log everything important. That is the safe VPC pattern.",
    "flashcardSetId": "vpc_task_36_flashcards"
  }
];
