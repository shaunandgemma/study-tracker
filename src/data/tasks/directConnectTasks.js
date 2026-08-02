/** AWS Direct Connect Tasks (SAA-C03) */
export const DIRECT_CONNECT_TASKS = [
  {
    "id": "task-saa-direct-connect-create-private-vif-019",
    "examCode": "aws-saa-c03",
    "topicId": "topic-direct-connect",
    "title": "Create a Direct Connect private VIF and test VPC routing",
    "slug": "create-a-direct-connect-private-vif-and-test-vpc-routing",
    "service": "AWS Direct Connect",
    "feature": "Virtual Private Cloud",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create a private virtual interface for Direct Connect and route private traffic to a VPC.",
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
        "title": "Private VIF",
        "body": "A private virtual interface connects Direct Connect to private AWS resources through a VGW or Direct Connect gateway."
      },
      {
        "id": "concept-2",
        "title": "Direct Connect gateway",
        "body": "A Direct Connect gateway can connect a private VIF to one or more VPCs through gateway associations."
      },
      {
        "id": "concept-3",
        "title": "Direct Connect route plan",
        "body": "ItemExamplePurposeCost riskConnectiondxcon-...Physical or hosted DX linkHighPrivate VIFVLAN + BGP peerPrivate AWS routingMediumDX gatewaysaa-vpc-task19-dxgwConnect VIF to VGWLowVGWAttached to VPCVPC-side gatewayLow"
      }
    ],
    "whyItMatters": "This matters because Direct Connect is private dedicated connectivity. It is not encrypted by default and is different from VPN over the internet.",
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
        "label": "On-prem CIDR",
        "value": "172.16.10.0/24"
      },
      {
        "label": "Direct Connect connection",
        "value": "Existing dxcon-xxxxxxxx required"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC networking changes, related service setup, verification, and cleanup for this lab."
      }
    ],
    "costWarning": "Direct Connect port-hour, provider, cross-connect, data-transfer and connected-resource charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity Direct Connect read: directconnect:DescribeConnections, directconnect:DescribeVirtualInterfaces, directconnect:DescribeDirectConnectGateways Direct Connect setup: directconnect:CreatePrivateVirtualInterface, directconnect:CreateDirectConnectGateway, directconnect:CreateDirectConnectGatewayAssociation, directconnect:DeleteVirtualInterface VPC gateway and routes: ec2:CreateVpnGateway, ec2:AttachVpnGateway, ec2:CreateRoute, ec2:DescribeRouteTables Cleanup: directconnect:DeleteDirectConnectGatewayAssociation, directconnect:DeleteDirectConnectGateway, ec2:DetachVpnGateway, ec2:DeleteVpnGateway",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Confirm you have a Direct Connect connection",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Direct Connect."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Connections."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Confirm an active dedicated or hosted connection exists."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Do not create paid Direct Connect resources unless this is a real lab account."
          }
        ],
        "note": null,
        "warning": "This task cannot fully work without an existing Direct Connect connection and on-prem router setup.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a Direct Connect gateway",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Direct Connect → Direct Connect gateways."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create Direct Connect gateway."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name: saa-vpc-task19-dxgw."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Amazon-side ASN: use 64512 for this example."
          }
        ],
        "note": "Use an ASN that does not conflict with your network.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create or confirm the VPC Virtual Private Gateway",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC → Virtual private gateways."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Create saa-vpc-task19-vgw if needed."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Attach it to the lab VPC."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Associate the VGW with the Direct Connect gateway."
          }
        ],
        "note": "Allowed prefixes should include the VPC CIDR.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the private virtual interface",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Direct Connect → Virtual interfaces."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Create virtual interface."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Type: Private."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Connection: choose the active connection."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Gateway: choose the Direct Connect gateway."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Enter VLAN, BGP ASN, and peer IPs from your network plan."
          }
        ],
        "note": null,
        "warning": "Wrong VLAN or BGP peer values stop routing from working.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Update route tables and test",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open VPC → Route tables."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Add the on-prem CIDR route to the VGW if needed."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm BGP routes are advertised on the router."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Test private IP traffic between on-prem and a private EC2 instance."
          }
        ],
        "note": "Security groups and on-prem firewalls must allow the test traffic.",
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
            "text": "Delete or disable the private VIF if created for a lab."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete the Direct Connect gateway association."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the Direct Connect gateway if created for a lab."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Remove VPC routes to on-prem."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Detach and delete the VGW if created for this lab."
          }
        ],
        "note": null,
        "warning": "Do not delete production Direct Connect resources.",
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
            "text": "REGION=eu-west-2\nDX_CONNECTION_ID=dxcon-xxxxxxxx\nDXGW_NAME=saa-vpc-task19-dxgw\nONPREM_CIDR=172.16.10.0/24"
          }
        ],
        "note": "Use your real Direct Connect connection ID.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "List existing Direct Connect connections",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws directconnect describe-connections --region $REGION --query 'connections[*].{Id:connectionId,Name:connectionName,State:connectionState,Bandwidth:bandwidth}' --output table"
          }
        ],
        "note": "Expected: the chosen connection is available or ordering.",
        "warning": null,
        "expectedResult": "Expected: the chosen connection is available or ordering."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create Direct Connect gateway",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "DXGW_ID=$(aws directconnect create-direct-connect-gateway --region $REGION --direct-connect-gateway-name $DXGW_NAME --amazon-side-asn 64512 --query 'directConnectGateway.directConnectGatewayId' --output text)\necho $DXGW_ID"
          }
        ],
        "note": "Expected: Direct Connect gateway ID is returned.",
        "warning": null,
        "expectedResult": "Expected: Direct Connect gateway ID is returned."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Template private VIF command",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > private-vif.json <<'EOF'\n{\n  \"virtualInterfaceName\": \"saa-vpc-task19-private-vif\",\n  \"vlan\": 101,\n  \"asn\": 65000,\n  \"authKey\": \"CHANGE-ME\",\n  \"amazonAddress\": \"169.254.100.1/30\",\n  \"customerAddress\": \"169.254.100.2/30\",\n  \"addressFamily\": \"ipv4\",\n  \"directConnectGatewayId\": \"REPLACE-DXGW-ID\"\n}\nEOF\naws directconnect create-private-virtual-interface --region $REGION --connection-id $DX_CONNECTION_ID --new-private-virtual-interface file://private-vif.json"
          }
        ],
        "note": null,
        "warning": "Edit the JSON with real VLAN, ASN, BGP key, peer IPs, and DXGW ID before running.",
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify VIF state",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws directconnect describe-virtual-interfaces --region $REGION --query 'virtualInterfaces[*].{Name:virtualInterfaceName,State:virtualInterfaceState,Vlan:vlan,Bgp:bgpPeers[*].bgpStatus}' --output table"
          }
        ],
        "note": "Expected: VIF eventually becomes available when accepted/configured.",
        "warning": null,
        "expectedResult": "Expected: VIF eventually becomes available when accepted/configured."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Cleanup reminder",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "# Replace with the VIF ID created for this lab only\nVIF_ID=dxvif-xxxxxxxx\naws directconnect delete-virtual-interface --region $REGION --virtual-interface-id $VIF_ID"
          }
        ],
        "note": null,
        "warning": "Do not delete shared or production Direct Connect resources.",
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
        "title": "Direct Connect vs VPN",
        "body": "FeatureDirect ConnectSite-to-Site VPNPathDedicated/private connectionInternet IPsec tunnelEncryptionNot automaticEncrypted by IPsecSetupPhysical/hosted connectionSoftware router configUse caseConsistent hybrid trafficFast encrypted hybrid setup"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No Direct Connect connection",
        "body": "You cannot create a working private VIF without an active dedicated or hosted connection."
      },
      {
        "id": "ts-2",
        "title": "BGP down",
        "body": "Check VLAN, ASN, BGP auth key, and peer IP addresses."
      },
      {
        "id": "ts-3",
        "title": "Traffic still fails",
        "body": "Check VPC routes, allowed prefixes, security groups, NACLs, and on-prem firewall rules."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Direct Connect is not encrypted by default",
        "body": "Use VPN over Direct Connect or app encryption if encryption is required."
      },
      {
        "id": "trap-2",
        "title": "Private VIF is for private resources",
        "body": "Use private VIF for VPC private connectivity, not public AWS service endpoints."
      },
      {
        "id": "trap-3",
        "title": "Transit VIF differs from private VIF",
        "body": "Transit VIF is used with Transit Gateway through a Direct Connect gateway."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "Direct Connect is a private road, not a locked tunnel. It is dedicated, but encryption is separate.",
    "flashcardSetId": "vpc_task_19_flashcards"
  }
];
