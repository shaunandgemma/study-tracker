/** AWS Storage Gateway Tasks (SAA-C03) */
export const STORAGE_GATEWAY_TASKS = [
  {
    "id": "task-saa-storage-gateway-hybrid-file-storage-bridge-with-aws-storage-gateway-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-storage-gateway",
    "title": "Hybrid File Storage Bridge with AWS Storage Gateway",
    "slug": "hybrid-file-storage-bridge-with-aws-storage-gateway",
    "service": "AWS Storage Gateway",
    "feature": "AWS Storage Gateway",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Deploy an AWS S3 File Gateway to provide on-premises legacy applications with low-latency NFS/SMB access to Amazon S3 storage.",
    "status": "published",
    "tags": [
      "AWS Storage Gateway",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS S3 File Gateway (NFS / SMB)",
        "body": "Provides file-based protocol access (NFS v3/v4.1 or SMB) to store files as native objects in Amazon S3 with low-latency local caching."
      },
      {
        "id": "concept-2",
        "title": "Volume Gateway (Cached vs Stored iSCSI)",
        "body": "Cached Volumes: Primary data stored in S3; frequent data cached locally. Stored Volumes: Primary data stored locally; asynchronous backup to S3."
      },
      {
        "id": "concept-3",
        "title": "Tape Gateway (iSCSI VTL)",
        "body": "Replaces physical tape libraries with virtual tapes in S3 Glacier/Glacier Deep Archive for long-term backup software compliance."
      },
      {
        "id": "concept-4",
        "title": "FSx File Gateway",
        "body": "Provides low-latency local caching for cloud-native Amazon FSx for Windows File Server shares."
      },
      {
        "id": "concept-5",
        "title": "Storage Gateway Appliance Types Plan",
        "body": "Gateway TypeProtocolBackend StoragePrimary Use CaseS3 File GatewayNFS / SMBAmazon S3 objectsHybrid file storage & S3 ingestFSx File GatewaySMBAmazon FSx for WindowsOn-prem cache for Windows FSxVolume Gateway (Cached)iSCSI blockAmazon S3 + EBS cacheLow-cost cloud block storageVolume Gateway (Stored)iSCSI blockOn-prem disk + S3 backupLocal primary block + cloud backupTape GatewayiSCSI VTLS3 Glacier / Deep ArchiveLegacy backup tape replacement"
      }
    ],
    "whyItMatters": "This matters because SAA-C03 exam questions frequently test distinguishing between File Gateway (NFS/SMB file shares), Volume Gateway (iSCSI block storage), and Tape Gateway (virtual tape library).",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Gateway Host",
        "value": "EC2 Storage Gateway Host (t3.small / t3.medium)"
      },
      {
        "label": "Share Protocol",
        "value": "NFS (Network File System) / SMB"
      },
      {
        "label": "Target S3 Bucket",
        "value": "saa-file-gateway-bridge-[account-id]"
      },
      {
        "label": "Local Cache Storage",
        "value": "150 GB EBS Volume (gp3)"
      }
    ],
    "costWarning": "Free Tier eligible: AWS Storage Gateway charges $0 for the first gateway created per account. Gateway software is free. To run a lab at $0 cost, launch a free t3.small EC2 instance using the official Storage Gateway AMI, attach a small 150 GB EBS volume for local cache, create an NFS file share mapped to a free S3 bucket, and delete all resources after testing.",
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
        "note": "Identity check: sts:GetCallerIdentity Storage Gateway permissions: storagegateway:CreateGateway, storagegateway:CreateNFSFileShare, storagegateway:ActivateGateway S3 permissions: s3:CreateBucket, s3:PutObject, s3:GetObject Cleanup: storagegateway:DeleteFileShare, storagegateway:DeleteGateway, s3:DeleteBucket",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create Destination S3 Bucket for File Shares",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3 -> Choose Create bucket."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set Bucket name to saa-file-gateway-bridge-[account-id]."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Set Region to us-east-1."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Keep Block Public Access enabled and choose Create bucket."
          }
        ],
        "note": "This bucket receives files written to the NFS/SMB file share as native S3 objects.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Deploy Storage Gateway Appliance Host on EC2",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open AWS Storage Gateway Console -> Choose Create gateway."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set Gateway name to saa-s3-file-gateway."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select Gateway type Amazon S3 File Gateway."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select Host platform Amazon EC2 -> Choose Launch instance."
          },
          {
            "id": "console-step-3-item-5",
            "text": "In the EC2 launch wizard, select the official Storage Gateway AMI, instance type t3.small (or t3.medium), attach an extra 150 GB EBS volume for local cache, and launch."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Note the public/private IP address of your gateway EC2 instance."
          }
        ],
        "note": "Storage Gateway runs as a virtual appliance on VMware ESXi, Hyper-V, KVM, or Amazon EC2.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Activate Storage Gateway and Allocate Local Cache Disk",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Return to Storage Gateway Console -> Input your gateway instance IP address -> Choose Activate gateway."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set Gateway name to saa-s3-file-gateway and choose activation time zone."
          },
          {
            "id": "console-step-4-item-3",
            "text": "In the Configure local disks panel, locate the 150 GB EBS volume and set its allocated usage to Cache."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Save and continue."
          }
        ],
        "note": "Local cache provides low-latency read/write performance for recently accessed files.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create NFS File Share Mapped to S3 Bucket",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Storage Gateway -> Choose File shares -> Click Create file share."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Enter Amazon S3 bucket name saa-file-gateway-bridge-[account-id]."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select File share protocol NFS (Network File System)."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Select Gateway saa-s3-file-gateway."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose Create IAM role (allows File Gateway to write objects into S3)."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Review file share mount command (`mount -t nfs -o hard :/saa-file-gateway-bridge-[account-id] /mnt/s3`) and click Create."
          }
        ],
        "note": "File Gateway automatically generates an IAM role that grants S3 read/write permissions.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test File Mount, Local Caching, and Automatic S3 Sync",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Connect to a Linux client machine on the same network."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Mount the NFS file share: sudo mount -t nfs -o hard :/saa-file-gateway-bridge-[account-id] /mnt/s3."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Write a test file: echo \"Hello Hybrid Cloud\" > /mnt/s3/hybrid-test.txt."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Open Amazon S3 Console -> Open saa-file-gateway-bridge-[account-id]."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Verify that hybrid-test.txt appears instantly as a native S3 object."
          }
        ],
        "note": "Files written to NFS/SMB shares are stored directly as native objects in Amazon S3.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down lab resources in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Unmount NFS share on client: sudo umount /mnt/s3."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Open Storage Gateway -> Select file share -> Choose Actions -> Delete file share."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Select gateway saa-s3-file-gateway -> Choose Actions -> Delete gateway."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Terminate the EC2 Storage Gateway instance."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete test objects and delete S3 bucket saa-file-gateway-bridge-[account-id]."
          }
        ],
        "note": null,
        "warning": "Delete the Storage Gateway and terminate its EC2 instance to prevent continuous EBS cache charges.",
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
        "note": "Expected: account ID and IAM user/role ARN.",
        "warning": null,
        "expectedResult": "Expected: account ID and IAM user/role ARN."
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
            "text": "REGION=us-east-1\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nBUCKET=saa-file-gateway-bridge-$ACCOUNT_ID"
          }
        ],
        "note": "Sets CLI variable names for bucket and Region.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create S3 Destination Bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $REGION"
          }
        ],
        "note": "Creates S3 target bucket for file share objects.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Activate Storage Gateway Appliance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws storagegateway activate-gateway --gateway-name saa-s3-file-gateway --gateway-timezone GMT --gateway-region $REGION --gateway-type FILE_S3 --ip-address <GATEWAY_IP>"
          }
        ],
        "note": "Activates the deployed Storage Gateway appliance instance.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create NFS File Share Mapped to S3 Bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws storagegateway create-nfs-file-share --client-token token123 --gateway-arn $GW_ARN --location-arn arn:aws:s3:::$BUCKET --role $ROLE_ARN --region $REGION"
          }
        ],
        "note": "Creates NFS file share mapped to destination S3 bucket.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Describe Active Storage Gateways and File Shares",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws storagegateway list-gateways --region $REGION\naws storagegateway list-file-shares --region $REGION"
          }
        ],
        "note": "Lists gateways and active file share ARNs.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Tear down Storage Gateway resources in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws storagegateway delete-file-share --file-share-arn $SHARE_ARN --region $REGION\naws storagegateway delete-gateway --gateway-arn $GW_ARN --region $REGION\naws s3 rb s3://$BUCKET --force"
          }
        ],
        "note": "Deletes file share, gateway appliance, and S3 bucket.",
        "warning": "Destructive Command Warning: This command permanently deletes migration tasks, endpoints, replication instances, VPN connections, or Direct Connect VIFs.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Storage Gateway configuration verified in AWS Storage Gateway."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete Storage Gateway file shares, volume targets, and cached data."
      },
      {
        "id": "cleanup-2",
        "text": "Deregister and delete the AWS Storage Gateway VM instance."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Storage Gateway Types",
        "body": "S3 File Gateway: NFS/SMB file shares to native S3 objects. FSx File Gateway: SMB shares to FSx for Windows. Volume Gateway: iSCSI block storage (Cached vs Stored). Tape Gateway: iSCSI Virtual Tape Library to Glacier."
      },
      {
        "id": "cs-2",
        "title": "File Gateway vs Volume Gateway",
        "body": "Use S3 File Gateway for file protocol access (NFS/SMB) storing native S3 objects. Use Volume Gateway for block storage (iSCSI EBS snapshots)."
      },
      {
        "id": "cs-3",
        "title": "Local Caching",
        "body": "Storage Gateway uses dedicated local disk storage to buffer low-latency read/write operations before syncing to AWS."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "NFS Mount Connection Timeout",
        "body": "Ensure client Security Group allows outbound TCP/UDP port 2049 (NFS) to the Storage Gateway instance IP address."
      },
      {
        "id": "ts-2",
        "title": "Gateway Activation Failure",
        "body": "Verify port 80 (HTTP) is temporarily open for initial activation from your browser to the Storage Gateway IP."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "File vs Block Protocol Traps",
        "body": "If an exam question mentions legacy NFS or SMB file shares, do NOT choose Volume Gateway (iSCSI); choose S3 File Gateway."
      },
      {
        "id": "trap-2",
        "title": "Tape Library Replacement",
        "body": "If an exam question mentions replacing physical tape backups (e.g., Veeam, NetBackup), choose Tape Gateway."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Storage Gateway concepts and hybrid connectivity patterns in AWS Storage Gateway."
      }
    ],
    "memoryHook": "File Gateway = NFS/SMB | Volume Gateway = iSCSI Block | Tape Gateway = VTL Backup",
    "flashcardSetId": null
  }
];
