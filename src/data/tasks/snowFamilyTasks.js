/** AWS Snow Family Tasks (SAA-C03) */
export const SNOW_FAMILY_TASKS = [
  {
    "id": "task-saa-snow-family-large-scale-offline-data-transfer-with-aws-snow-family-s3-003",
    "examCode": "aws-saa-c03",
    "topicId": "topic-snow-family",
    "title": "Large-Scale Offline Data Transfer with AWS Snow Family & S3",
    "slug": "large-scale-offline-data-transfer-with-aws-snow-family-s3",
    "service": "AWS Snow Family",
    "feature": "AWS Snow Family",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Architect and simulate large-scale offline data ingestion into Amazon S3 using AWS Snowball Edge, S3 Lifecycle archiving rules, and EventBridge validation.",
    "status": "published",
    "tags": [
      "AWS Snow Family",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS Snowball Edge (Offline Transfer)",
        "body": "Physical rugged appliance used to transport multi-terabyte or petabyte datasets to AWS offline when network transfer over WAN takes weeks or months."
      },
      {
        "id": "concept-2",
        "title": "Data Transfer Threshold Rules",
        "body": "Online (AWS DataSync / Direct Connect): Best under 10–20 TB on high bandwidth. Snowball Edge Storage Optimized: Best for 10 TB – 80 TB per device. Snowmobile: For petabyte to exabyte scale (up to 100 PB per truck)."
      },
      {
        "id": "concept-3",
        "title": "S3 Lifecycle Transition Rules",
        "body": "Automatically transitions uploaded data from S3 Standard to S3 Glacier Flexible Archive or S3 Glacier Deep Archive to minimize long-term storage costs."
      },
      {
        "id": "concept-4",
        "title": "EventBridge Automated Validation",
        "body": "Fires real-time event notifications whenever new S3 objects land via Snowball to trigger downstream processing or compliance auditing."
      },
      {
        "id": "concept-5",
        "title": "Snow Family Transfer Thresholds Plan",
        "body": "Transfer MethodData VolumeNetwork BandwidthPrimary Use CaseAWS DataSync / AWS CLI< 10 TBHigh (1 Gbps+)Online continuous file syncSnowconeUp to 8 TBOffline / EdgeSmall portable physical transferSnowball Edge Storage Optimized10 TB – 80 TBOffline (Shipment)Large offline bulk data migrationSnowmobile> 10 PBOffline (Container truck)Exabyte-scale datacenter migration"
      }
    ],
    "whyItMatters": "This matters because SAA-C03 exam questions routinely test data volume thresholds (e.g. 10–50+ TB over slow WAN links) to determine when physical Snowball devices are required instead of online streaming.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Destination Bucket",
        "value": "saa-snow-migration-vault-[account-id]"
      },
      {
        "label": "Snowball Device Type",
        "value": "Snowball Edge Storage Optimized (80 TB)"
      },
      {
        "label": "S3 Target Storage Class",
        "value": "S3 Glacier Deep Archive"
      },
      {
        "label": "Validation Rule",
        "value": "EventBridge S3 Object Created Notification"
      }
    ],
    "costWarning": "Snow Family job, device, shipping, service-day and data-transfer charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity Snowball setup: snowball:CreateJob, snowball:ListJobs, snowball:DescribeJob S3 setup: s3:CreateBucket, s3:PutLifecycleConfiguration, s3:PutObject EventBridge setup: events:PutRule, events:PutTargets Cleanup: s3:DeleteObject, s3:DeleteBucket, events:DeleteRule",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Simulate an AWS Snowball Edge Job Order",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open AWS Snow Family Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create job."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Select job type Import into Amazon S3."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Select device type Snowball Edge Storage Optimized (80 TB usable capacity)."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Specify shipping address details and shipping speed options."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Select or create target S3 bucket saa-snow-migration-vault-[account-id]."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Review job settings (cancel or exit before final order submission to keep your balance at $0)."
          }
        ],
        "note": "Ordering physical Snowball devices incurs service fees. Always stop at the summary page during lab practice.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create Destination S3 Storage Bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Amazon S3 -> Choose Create bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set Bucket name to saa-snow-migration-vault-[account-id]."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Set Region to us-east-1."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep Block Public Access enabled."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Enable Bucket Versioning (recommended for audit trails during large data imports)."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose Create bucket."
          }
        ],
        "note": "This bucket serves as the landing location when AWS ingests data from returned Snowball devices.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure S3 Lifecycle Rule for Immediate Glacier Archiving",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select bucket saa-snow-migration-vault-[account-id] -> Choose Management tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Click Create lifecycle rule."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Lifecycle rule name to ArchiveSnowballImports."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Apply to all objects in the bucket."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Check Move current versions of objects between storage classes."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Select Glacier Deep Archive -> Set Days after object creation to 1 (or minimum allowed)."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Choose Create rule."
          }
        ],
        "note": "Lifecycle rules automatically transition uploaded data to lowest-cost Glacier storage classes.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Configure EventBridge Trigger for Automated Validation",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Amazon EventBridge -> Choose Rules -> Create rule."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Set Name to catch-snowball-s3-upload."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select Rule with an event pattern -> Event source AWS services -> Service S3 -> Event type Amazon S3 Event Notification."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Set Target to CloudWatch log group or SNS Topic saa-snow-alerts."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose Create rule."
          }
        ],
        "note": "Fires automated triggers whenever new objects land in the destination S3 bucket.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test Data Upload and Verify Lifecycle Transition",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open Amazon S3 -> Open saa-snow-migration-vault-[account-id]."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Upload a sample test file snowball-import-test.txt."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Verify object storage class displays Standard, then inspect Lifecycle rule status."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Open EventBridge / CloudWatch logs to verify real-time event capture."
          }
        ],
        "note": "Simulates data arriving in S3 from a completed Snowball job.",
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
            "text": "Delete test objects from S3 bucket saa-snow-migration-vault-[account-id]."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete the S3 bucket."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the EventBridge rule catch-snowball-s3-upload."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Cancel any draft Snowball job order."
          }
        ],
        "note": null,
        "warning": "Delete S3 buckets and EventBridge rules to clean up your lab environment.",
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
            "text": "REGION=us-east-1\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nBUCKET=saa-snow-migration-vault-$ACCOUNT_ID"
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
        "note": "Creates S3 landing bucket for Snowball migration data.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Configure S3 Lifecycle Glacier Archiving Rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-lifecycle-configuration --bucket $BUCKET --lifecycle-configuration '{\"Rules\":[{\"ID\":\"ArchiveSnowballImports\",\"Status\":\"Enabled\",\"Filter\":{},\"Transitions\":[{\"Days\":1,\"StorageClass\":\"DEEP_ARCHIVE\"}]}]}'"
          }
        ],
        "note": "Configures automatic transition to Glacier Deep Archive after 1 day.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "List available Snowball device job options",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws snowball list-jobs --region $REGION"
          }
        ],
        "note": "Displays existing Snowball import/export jobs.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create EventBridge Validation Rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws events put-rule --name catch-snowball-s3-upload --event-pattern '{\"source\":[\"aws.s3\"],\"detail-type\":[\"Object Created\"]}' --region $REGION"
          }
        ],
        "note": "Captures S3 object creation notifications.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Clean up S3 bucket and EventBridge rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3 rb s3://$BUCKET --force\naws events delete-rule --name catch-snowball-s3-upload --region $REGION"
          }
        ],
        "note": "Deletes destination bucket and validation rule.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Snow Family configuration verified in AWS Snow Family."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Complete S3 import verification and clean up temporary test files."
      },
      {
        "id": "cleanup-2",
        "text": "Cancel or complete simulated Snow Family job."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "AWS Snow Family Comparison",
        "body": "Snowcone: 8 TB (Ultra-portable). Snowball Edge Storage Optimized: 80 TB usable. Snowmobile: Up to 100 PB per truck."
      },
      {
        "id": "cs-2",
        "title": "Offline vs Online Migration Rule",
        "body": "Use Snowball Edge when network transfer of 10+ TB over WAN would take weeks or months. Use AWS DataSync for online network transfers."
      },
      {
        "id": "cs-3",
        "title": "S3 Glacier Deep Archive",
        "body": "Lowest cost S3 storage class ($0.00099/GB/mo). Retrieval time: 12 hours."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Snowball Job Order Error",
        "body": "Ensure your IAM user has `snowball:CreateJob` permissions and that valid shipping address details are specified."
      },
      {
        "id": "ts-2",
        "title": "Lifecycle Rule Not Triggering Immediately",
        "body": "S3 Lifecycle transitions run asynchronously once daily (at midnight UTC). In a lab, verify the rule status shows `Enabled`."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Snowball Edge vs DataSync Thresholds",
        "body": "If bandwidth is low (e.g. 10–100 Mbps) and data volume exceeds 10–20 TB, network transfers (DataSync/Direct Connect) fail exam latency constraints. Always choose Snowball Edge."
      },
      {
        "id": "trap-2",
        "title": "Snowball Edge Compute Options",
        "body": "Snowball Edge Storage Optimized includes EC2 compute instances and EBS volumes for edge computing processing before shipment."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Snow Family concepts and hybrid connectivity patterns in AWS Snow Family."
      }
    ],
    "memoryHook": "Snowcone = 8 TB | Snowball = 80 TB | Snowmobile = 100 PB",
    "flashcardSetId": null
  }
];
