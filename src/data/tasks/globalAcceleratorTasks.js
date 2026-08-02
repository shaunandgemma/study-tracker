/** AWS Global Accelerator Tasks (SAA-C03) */
export const GLOBAL_ACCELERATOR_TASKS = [
  {
    "id": "task-saa-global-accelerator-non-http-global-acceleration-with-aws-global-accelerator-007",
    "examCode": "aws-saa-c03",
    "topicId": "topic-global-accelerator",
    "title": "Non-HTTP Global Acceleration with AWS Global Accelerator",
    "slug": "non-http-global-acceleration-with-aws-global-accelerator",
    "service": "AWS Global Accelerator",
    "feature": "AWS Global Accelerator",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1",
    "goal": "Goal: Optimize global TCP/UDP traffic performance using AWS's private global fiber network and two static Anycast IP addresses.",
    "status": "published",
    "tags": [
      "AWS Global Accelerator",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS Global Accelerator Overview",
        "body": "Networking service that improves global application performance by routing user traffic over AWS's private global fiber network using two static Anycast IP addresses."
      },
      {
        "id": "concept-2",
        "title": "Static Anycast IP Addresses",
        "body": "Global Accelerator provides 2 fixed Anycast IP addresses announced from all AWS edge locations globally. Clients connect to the nearest edge location automatically."
      },
      {
        "id": "concept-3",
        "title": "CloudFront vs Global Accelerator",
        "body": "CloudFront: Caches HTTP/HTTPS web content at edge locations. Global Accelerator: Routes non-HTTP (TCP/UDP) or un-cacheable traffic over AWS private network without edge caching."
      },
      {
        "id": "concept-4",
        "title": "Sub-Second Automatic Health Check Failover",
        "body": "Global Accelerator monitors endpoint health continuously. If an ALB fails in one Region, traffic is rerouted to a healthy endpoint in another Region in seconds."
      },
      {
        "id": "concept-5",
        "title": "CloudFront vs Global Accelerator Comparison Matrix",
        "body": "FeatureAmazon CloudFrontAWS Global AcceleratorSupported ProtocolsHTTP, HTTPS, WebSocketTCP, UDP, HTTP, HTTPSCaching LayerYes (Caches web content at 225+ edge locations)No Caching (Pass-through network acceleration)IP Address ModelDynamic CloudFront domain names2 Static Anycast IP AddressesPrimary Use CasesStatic websites, video streaming, REST APIsGaming (UDP), VoIP, IoT, multi-region failover, static IP whitelistNetwork PathPublic internet to Edge -> Edge to OriginPublic internet to Edge -> AWS Private Network to Endpoint"
      }
    ],
    "whyItMatters": "This matters because distinguishing between CloudFront (HTTP caching at edge) vs Global Accelerator (TCP/UDP non-caching global Anycast routing) is a top SAA-C03 exam scenario.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Accelerator Name",
        "value": "saa-global-accelerator"
      },
      {
        "label": "IP Address Model",
        "value": "2 Static Anycast IPs"
      },
      {
        "label": "Protocols Supported",
        "value": "TCP & UDP"
      },
      {
        "label": "Endpoints",
        "value": "Multi-Region ALBs (us-east-1 & eu-west-1)"
      }
    ],
    "costWarning": "Low cost: AWS Global Accelerator costs $0.025/hr (~$0.60/day) plus small data transfer fees. Delete the accelerator immediately after completing your practice lab.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Global Accelerator permissions: globalaccelerator:CreateAccelerator, globalaccelerator:CreateListener, globalaccelerator:CreateEndpointGroup Cleanup: globalaccelerator:DeleteAccelerator",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create Multi-Region ALBs or EC2 Endpoints",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Deploy Primary ALB in us-east-1."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Deploy Secondary ALB in eu-west-1."
          }
        ],
        "note": "Provides multi-region endpoints for Global Accelerator.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create an AWS Global Accelerator",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open AWS Global Accelerator Console -> Click Create accelerator."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set Name to saa-global-accelerator."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select IP address type IPv4 -> Click Next."
          }
        ],
        "note": "Provisions 2 static Anycast IP addresses.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure Listener and Multi-Region Endpoint Groups",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Add Listener: Port 80 (or 443), Protocol TCP."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Add Endpoint Group 1: Region us-east-1 -> Attach Primary ALB."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add Endpoint Group 2: Region eu-west-1 -> Attach Secondary ALB."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Traffic dial to 100% for both endpoint groups -> Click Create accelerator."
          }
        ],
        "note": "Binds multi-region endpoints to static Anycast IPs with health monitoring.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Inspect Static Anycast IPs and Health Check Rerouting",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Copy the two assigned Static Anycast IP addresses (e.g. 1.2.3.4 and 5.6.7.8)."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Query the Anycast IPs from different global geographical locations to test AWS private network routing."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Review CloudFront vs Global Accelerator decision rules."
          }
        ],
        "note": "Anycast IPs route traffic over AWS's private global fiber network.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down lab resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Disable and delete Global Accelerator saa-global-accelerator."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete ALBs in us-east-1 and eu-west-1."
          }
        ],
        "note": null,
        "warning": "Disable Global Accelerator before deletion.",
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
        "note": "Expected: account ID and IAM user/role ARN.",
        "warning": null,
        "expectedResult": "Expected: account ID and IAM user/role ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "List Global Accelerators",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws globalaccelerator list-accelerators --region us-east-1"
          }
        ],
        "note": "Lists active accelerators.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Global Accelerator configuration verified in AWS Global Accelerator."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Remove all endpoint groups and listeners from the accelerator."
      },
      {
        "id": "cleanup-2",
        "text": "Disable and delete the AWS Global Accelerator."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "AWS Global Accelerator",
        "body": "Provides 2 static Anycast IPs and routes TCP/UDP traffic over AWS's private global network. No content caching."
      },
      {
        "id": "cs-2",
        "title": "Static Anycast IPs",
        "body": "IP addresses announced globally from edge locations. Eliminates DNS caching delay during failover."
      },
      {
        "id": "cs-3",
        "title": "TCP / UDP Protocol Support",
        "body": "Supports non-HTTP protocols like gaming (UDP), VoIP, IoT, and custom TCP applications."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Endpoint Unhealthy in Accelerator",
        "body": "Ensure the target ALB health check returns HTTP 200 OK and that security groups allow inbound traffic from Global Accelerator IP ranges."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Non-HTTP & Static IP Traps",
        "body": "If an exam question asks for UDP/TCP acceleration, static IP whitelisting, or fast multi-region failover without caching, do NOT select CloudFront. Select AWS Global Accelerator."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Global Accelerator concepts and global edge distribution patterns in AWS Global Accelerator."
      }
    ],
    "memoryHook": "Global Accelerator = 2 Static Anycast IPs | TCP/UDP Non-Caching = AWS Private Fiber",
    "flashcardSetId": null
  }
];
