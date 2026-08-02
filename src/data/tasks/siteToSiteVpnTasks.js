/** AWS Site-to-Site VPN Tasks (SAA-C03) */
export const SITE_TO_SITE_VPN_TASKS = [
  {
    "id": "task-saa-vpn-set-up-aws-site-to-site-vpn-017",
    "examCode": "aws-saa-c03",
    "topicId": "topic-vpn",
    "title": "Set up AWS Site-to-Site VPN and verify routes",
    "slug": "set-up-aws-site-to-site-vpn-and-verify-routes",
    "service": "AWS Site-to-Site VPN",
    "feature": "Virtual Private Cloud",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a Site-to-Site VPN to an on-prem router and verify route behaviour.",
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
        "title": "Customer Gateway",
        "body": "Represents the on-prem router in AWS."
      },
      {
        "id": "concept-2",
        "title": "Virtual Private Gateway",
        "body": "The AWS-side VPN gateway attached to one VPC."
      },
      {
        "id": "concept-3",
        "title": "VPN route plan",
        "body": "SideCIDRRoute targetReasonVPC192.168.10.0/24vgwSend on-prem traffic to VPNOn-prem10.70.0.0/16VPN tunnelSend VPC traffic to AWSTunnelTwo IPsec tunnelsBGP or staticHigh availability path"
      }
    ],
    "whyItMatters": "This matters because hybrid networking needs routing on both sides. AWS can build the VPN, but the router must also send return traffic back.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC CIDR",
        "value": "10.70.0.0/16"
      },
      {
        "label": "On-prem CIDR",
        "value": "192.168.10.0/24"
      },
      {
        "label": "Customer router public IP",
        "value": "203.0.113.10 example placeholder"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC networking changes, related service setup, verification, and cleanup for this lab."
      }
    ],
    "costWarning": "VPN connection, data-transfer, Transit Gateway and connected-resource charges may apply.",
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
            "text": "Name: saa-vpc-task17-cgw."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Routing: choose Static for a simple lab, or Dynamic if your router supports BGP."
          },
          {
            "id": "console-step-2-item-5",
            "text": "IP address: enter your on-prem router public IP."
          }
        ],
        "note": null,
        "warning": "Use a real static public IP for a real VPN. The placeholder IP will not form a tunnel.",
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
            "text": "Name: saa-vpc-task17-vgw."
          },
          {
            "id": "console-step-3-item-4",
            "text": "ASN: use Amazon default ASN for this lab."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select the new gateway, choose Actions → Attach to VPC."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the Site-to-Site VPN connection",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC → Site-to-Site VPN connections."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create VPN connection."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Target gateway type: Virtual private gateway."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Customer gateway: choose saa-vpc-task17-cgw."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Routing options: choose Static and add 192.168.10.0/24."
          }
        ],
        "note": "Download the router configuration for your router vendor after creation.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Update VPC route tables",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open VPC → Route tables."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select the private subnet route table."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Routes → Edit routes."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Add destination 192.168.10.0/24 and target the virtual private gateway."
          }
        ],
        "note": "The return route must also exist on the on-prem router.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Verify tunnel and routes",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the VPN connection."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Check Tunnel details."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Look for tunnel status UP after router configuration."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Ping or connect from an allowed private EC2 instance to an on-prem test IP."
          }
        ],
        "note": null,
        "warning": "Security groups, NACLs, firewalls, and the on-prem router must all allow the test traffic.",
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
            "text": "Remove route table routes to the on-prem CIDR."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Detach the virtual private gateway from the VPC."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the virtual private gateway."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the customer gateway."
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
            "text": "REGION=eu-west-2\nVPC_ID=vpc-xxxxxxxx\nROUTE_TABLE_ID=rtb-xxxxxxxx\nONPREM_CIDR=192.168.10.0/24\nCGW_IP=203.0.113.10"
          }
        ],
        "note": "Replace placeholder IDs and IPs.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Customer Gateway",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "CGW_ID=$(aws ec2 create-customer-gateway --region $REGION --type ipsec.1 --public-ip $CGW_IP --bgp-asn 65000 --query 'CustomerGateway.CustomerGatewayId' --output text)\necho $CGW_ID"
          }
        ],
        "note": null,
        "warning": "Use a real router public IP for a working tunnel.",
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create and attach Virtual Private Gateway",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "VGW_ID=$(aws ec2 create-vpn-gateway --region $REGION --type ipsec.1 --query 'VpnGateway.VpnGatewayId' --output text)\naws ec2 attach-vpn-gateway --region $REGION --vpn-gateway-id $VGW_ID --vpc-id $VPC_ID\necho $VGW_ID"
          }
        ],
        "note": "Wait until attached before creating the VPN.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create VPN connection with static route",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "VPN_ID=$(aws ec2 create-vpn-connection --region $REGION --type ipsec.1 --customer-gateway-id $CGW_ID --vpn-gateway-id $VGW_ID --options StaticRoutesOnly=true --query 'VpnConnection.VpnConnectionId' --output text)\naws ec2 create-vpn-connection-route --region $REGION --vpn-connection-id $VPN_ID --destination-cidr-block $ONPREM_CIDR\necho $VPN_ID"
          }
        ],
        "note": "Expected: VPN connection is created with two tunnels.",
        "warning": null,
        "expectedResult": "Expected: VPN connection is created with two tunnels."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Add VPC route",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-route --region $REGION --route-table-id $ROUTE_TABLE_ID --destination-cidr-block $ONPREM_CIDR --gateway-id $VGW_ID"
          }
        ],
        "note": "Expected: route target is the VGW.",
        "warning": null,
        "expectedResult": "Expected: route target is the VGW."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Check VPN state",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-vpn-connections --region $REGION --vpn-connection-ids $VPN_ID --query 'VpnConnections[*].VgwTelemetry[*].{OutsideIp:OutsideIpAddress,Status:Status,Message:StatusMessage}' --output table"
          }
        ],
        "note": "Expected after router setup: at least one tunnel is UP.",
        "warning": null,
        "expectedResult": "Expected after router setup: at least one tunnel is UP."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Cleanup VPN resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws ec2 delete-vpn-connection --region $REGION --vpn-connection-id $VPN_ID\naws ec2 detach-vpn-gateway --region $REGION --vpn-gateway-id $VGW_ID --vpc-id $VPC_ID\naws ec2 delete-vpn-gateway --region $REGION --vpn-gateway-id $VGW_ID\naws ec2 delete-customer-gateway --region $REGION --customer-gateway-id $CGW_ID"
          }
        ],
        "note": null,
        "warning": "Remove route table entries if they remain.",
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
        "text": "Release the Elastic IP address to prevent unattached public IPv4 hourly charges."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "VPN route checklist",
        "body": "CheckAWS sideOn-prem sideVPC CIDR10.70.0.0/16Route back to AWSOn-prem CIDRRoute to vgwLocal networkSecuritySG/NACL allow trafficFirewall allows trafficTunnelTelemetry UPIPsec configured"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Tunnel is DOWN",
        "body": "Check pre-shared key, public IP, IKE/IPsec settings, and router NAT/firewall rules."
      },
      {
        "id": "ts-2",
        "title": "Tunnel is UP but traffic fails",
        "body": "Check routes in both directions, security groups, NACLs, and on-prem firewalls."
      },
      {
        "id": "ts-3",
        "title": "Static route missing",
        "body": "For static VPN, add the on-prem CIDR to the VPN connection and the VPC route table."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "AWS VPN has two tunnels",
        "body": "Use both tunnels for high availability."
      },
      {
        "id": "trap-2",
        "title": "Return route is required",
        "body": "A VPC route alone is not enough. The on-prem network must route back."
      },
      {
        "id": "trap-3",
        "title": "Static vs BGP",
        "body": "Static routes are manually added. BGP advertises routes dynamically."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Virtual Private Cloud configuration and architectural best practices in Amazon VPC."
      }
    ],
    "memoryHook": "VPN needs two maps. AWS needs a route out, and on-prem needs a route back.",
    "flashcardSetId": "vpc_task_17_flashcards"
  }
];
