/**
 * Amazon S3 Hands-On Tasks & Guided AWS Labs (SAA-C03)
 * Total Converted Tasks: 33
 */

export const S3_TASKS = [
  {
    "id": "task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "List S3 buckets and find each bucket Region",
    "slug": "list-s3-buckets-and-find-each-bucket-region",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Learn the two places AWS shows an S3 bucket’s Region, then use the CLI to get the Region for any bucket.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Bucket Region",
        "body": "An S3 bucket belongs to exactly one Region."
      },
      {
        "id": "concept-2",
        "title": "Region is fixed",
        "body": "You cannot change a bucket’s Region after creation."
      },
      {
        "id": "concept-3",
        "title": "Move Region",
        "body": "To move Regions, create a new bucket and copy the data."
      },
      {
        "id": "concept-4",
        "title": "Console check",
        "body": "The Buckets list shows a Region column."
      },
      {
        "id": "concept-5",
        "title": "Properties check",
        "body": "The bucket’s Properties tab also shows the Region."
      },
      {
        "id": "concept-6",
        "title": "Exam trap",
        "body": "us-east-1 can show as null or None in get-bucket-location."
      }
    ],
    "whyItMatters": "S3 is shown as a global service, but each bucket is created in one Region. For the exam, remember that the bucket Region is fixed after creation.",
    "values": [
      {
        "label": "Example bucket",
        "value": "shaun-s3-lab-bucket-123"
      },
      {
        "label": "Example Region",
        "value": "eu-west-2"
      },
      {
        "label": "Console location",
        "value": "S3 → Buckets"
      },
      {
        "label": "CLI command",
        "value": "get-bucket-location"
      }
    ],
    "costWarning": "This task is free. You are only viewing and listing existing buckets.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Before you start",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "You only need permission to view S3 buckets."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open S3 and view all buckets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Services → S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "You land on the Buckets page."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Look for the Region column."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Scan a few buckets."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Note their Regions, such as eu-west-2, eu-west-1, or us-east-1."
          }
        ],
        "note": "Expected: each bucket shows one Region.",
        "warning": null,
        "expectedResult": "Expected: each bucket shows one Region."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Confirm the Region inside the bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Click a bucket name."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open the Properties tab."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Find Bucket overview."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Confirm the Region matches the Buckets list."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Verify in the Console",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Find the Region in S3 → Buckets."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Find the same Region in Bucket → Properties → Bucket overview."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Explain that the bucket Region cannot be changed."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Exam reminder",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "You cannot move a bucket to another Region."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Migration means new bucket + copy or sync + update apps."
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
        "title": "Confirm your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see your AWS account and an ARN for your user or role.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account and an ARN for your user or role."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "List all buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws s3 ls"
          }
        ],
        "note": "Note: this lists bucket names and creation dates, but not Regions.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "List bucket names only",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api list-buckets --query \"Buckets[].Name\" --output text"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Get the Region for one bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-location --bucket YOUR_BUCKET_NAME"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Print each bucket with its Region",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "for b in $(aws s3api list-buckets --query \"Buckets[].Name\" --output text); do\n  r=$(aws s3api get-bucket-location --bucket \"$b\" --query \"LocationConstraint\" --output text)\n  if [ \"$r\" = \"None\" ] || [ \"$r\" = \"null\" ]; then r=\"us-east-1\"; fi\n  echo \"$b -> $r\"\ndone"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify with CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-location --bucket YOUR_BUCKET_NAME --query \"LocationConstraint\" --output text"
          }
        ],
        "note": "Expected: a Region like eu-west-2, or None/null meaning us-east-1.",
        "warning": null,
        "expectedResult": "Expected: a Region like eu-west-2, or None/null meaning us-east-1."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Tear down",
        "instructions": [],
        "commands": [],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
        "text": "No AWS resources were created during this lab, so no cleanup is required."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "S3 service scope",
        "body": "S3 is a global service in the console."
      },
      {
        "id": "cs-2",
        "title": "Bucket scope",
        "body": "Each bucket is created in exactly one Region."
      },
      {
        "id": "cs-3",
        "title": "Region change",
        "body": "You cannot change a bucket’s Region after creation."
      },
      {
        "id": "cs-4",
        "title": "Move data",
        "body": "Create a new bucket in the target Region, then copy or sync the data."
      },
      {
        "id": "cs-5",
        "title": "CLI command",
        "body": "Use get-bucket-location to find a bucket’s Region."
      },
      {
        "id": "cs-6",
        "title": "us-east-1 trap",
        "body": "null or None usually means us-east-1."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied on list-buckets",
        "body": "Your IAM identity needs s3:ListAllMyBuckets."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied on get-bucket-location",
        "body": "You need s3:GetBucketLocation on that bucket."
      },
      {
        "id": "ts-3",
        "title": "Region shows null or None",
        "body": "That bucket is in us-east-1."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "S3 is global, but buckets are regional."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "A bucket’s Region cannot be changed after creation."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "For us-east-1, get-bucket-location can return null or None."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "To move Regions, create a new bucket and copy or sync data."
      },
      {
        "id": "trap-5",
        "title": "Trap 5",
        "body": "aws s3 ls does not show bucket Regions."
      },
      {
        "id": "trap-6",
        "title": "Trap 6",
        "body": "Listing bucket names and finding bucket location can require different permissions."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "S3 is the library system; each bucket is one local branch. The library brand is global, but each bucket lives in one Region.",
    "flashcardSetId": "s3_task_1_flashcards"
  },
  {
    "id": "task-saa-s3-versioning-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Create a test S3 bucket and turn on versioning",
    "slug": "create-a-test-s3-bucket-and-turn-on-versioning",
    "service": "Amazon S3",
    "feature": "Versioning",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a test Amazon S3 bucket, turn on versioning, upload test files, and prove that S3 keeps older versions after changes or deletes.",
    "status": "published",
    "tags": [
      "S3",
      "Versioning",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Versioning",
        "body": "S3 can keep multiple versions of the same object key."
      },
      {
        "id": "concept-2",
        "title": "Object key",
        "body": "The object key is the file path/name inside the bucket, such as notes.txt."
      },
      {
        "id": "concept-3",
        "title": "Overwrite",
        "body": "Uploading a file with the same key creates a new version, instead of replacing the old version permanently."
      },
      {
        "id": "concept-4",
        "title": "Delete marker",
        "body": "Deleting a versioned object adds a delete marker. Older versions can still exist."
      },
      {
        "id": "concept-5",
        "title": "Versioning cannot be disabled",
        "body": "After enabling versioning, you can only suspend it. You cannot return the bucket to the never-versioned state."
      },
      {
        "id": "concept-6",
        "title": "Cost reminder",
        "body": "Each stored version can add storage cost. Old versions are real stored objects."
      }
    ],
    "whyItMatters": "S3 versioning protects against accidental overwrite and delete. It is a core building block for backup, recovery, and safer object storage designs.",
    "values": [
      {
        "label": "Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "s3-task-2-versioning-[account-id]"
      },
      {
        "label": "Test object",
        "value": "notes.txt"
      },
      {
        "label": "Versioning status",
        "value": "Enabled"
      },
      {
        "label": "Console location",
        "value": "S3 → Bucket → Properties → Bucket Versioning"
      },
      {
        "label": "CLI command",
        "value": "put-bucket-versioning"
      }
    ],
    "costWarning": "This lab should cost very little if you use tiny test files and tear down straight away. S3 charges can apply for storage, requests, and stored object versions. Delete all versions and delete markers during cleanup.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Start from AWS login",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Use an admin user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Use the Region eu-west-2 for this lab."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the S3 bucket",
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
            "text": "Bucket name: s3-task-2-versioning-[account-id]."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Replace [account-id] with your real AWS account ID."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Region: Europe (London) eu-west-2."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Keep Block all public access enabled."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Choose Create bucket."
          }
        ],
        "note": "S3 bucket names are globally unique. Adding your account ID helps avoid name conflicts.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Turn on bucket versioning",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open your new bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open the Properties tab."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Find Bucket Versioning."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select Enable."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Save changes."
          }
        ],
        "note": null,
        "warning": "After versioning is enabled, you can suspend it later, but you cannot fully return the bucket to its original never-versioned state.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Upload the first test file",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Create a small local file called notes.txt."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Add simple text like version 1."
          },
          {
            "id": "console-step-4-item-3",
            "text": "In the bucket, choose Upload."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Upload notes.txt."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Open the object and check that it exists."
          }
        ],
        "note": "This is version 1 of the object.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Upload a changed version",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Change the local notes.txt file to say version 2."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Upload the same file name again to the same bucket."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Keep the same object key: notes.txt."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm the upload completes."
          }
        ],
        "note": "Because versioning is enabled, S3 keeps the old version and creates a new version.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Show object versions",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "In the bucket object list, turn on Show versions."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Find notes.txt."
          },
          {
            "id": "console-step-6-item-3",
            "text": "You should see more than one version."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Notice that each version has a different version ID."
          }
        ],
        "note": "This proves versioning is working.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Delete the object and view the delete marker",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Delete the current notes.txt object."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Keep Show versions turned on."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Look for a delete marker."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Confirm older versions still exist."
          }
        ],
        "note": null,
        "warning": "In a versioned bucket, a normal delete usually adds a delete marker. It does not automatically remove every older version.",
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Verify the lab",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Bucket versioning is set to Enabled."
          },
          {
            "id": "console-step-8-item-2",
            "text": "The object has multiple versions."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Deleting the object creates a delete marker."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Older versions are still visible when Show versions is enabled."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Tear down in the correct order",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Turn on Show versions."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Delete all versions of notes.txt."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Delete all delete markers."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Confirm the bucket is empty."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Delete the bucket."
          }
        ],
        "note": null,
        "warning": "A versioned bucket must have all object versions and delete markers removed before the bucket can be deleted.",
        "expectedResult": "Step 9 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Set variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "REGION=\"eu-west-2\"\nPROFILE=\"default\"\nACCOUNT_ID=$(aws sts get-caller-identity --profile \"$PROFILE\" --query Account --output text)\nBUCKET=\"s3-task-2-versioning-$ACCOUNT_ID\"\n\necho \"Bucket: $BUCKET\"\necho \"Region: $REGION\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 1 executed successfully."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create the test bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket \\\n  --bucket \"$BUCKET\" \\\n  --region \"$REGION\" \\\n  --create-bucket-configuration LocationConstraint=\"$REGION\" \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "This creates the bucket in London: eu-west-2.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Enable versioning",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning \\\n  --bucket \"$BUCKET\" \\\n  --versioning-configuration Status=Enabled \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify versioning is enabled",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-versioning \\\n  --bucket \"$BUCKET\" \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "Expected output includes \"Status\": \"Enabled\".",
        "warning": null,
        "expectedResult": "Expected output includes \"Status\": \"Enabled\"."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Upload version 1",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "echo \"version 1\" > notes.txt\n\naws s3api put-object \\\n  --bucket \"$BUCKET\" \\\n  --key notes.txt \\\n  --body notes.txt \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Upload version 2",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "echo \"version 2\" > notes.txt\n\naws s3api put-object \\\n  --bucket \"$BUCKET\" \\\n  --key notes.txt \\\n  --body notes.txt \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "Same key. New version.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "List object versions",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3api list-object-versions \\\n  --bucket \"$BUCKET\" \\\n  --prefix notes.txt \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "Expected: two versions of notes.txt.",
        "warning": null,
        "expectedResult": "Expected: two versions of notes.txt."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Delete the object and see the delete marker",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-object \\\n  --bucket \"$BUCKET\" \\\n  --key notes.txt \\\n  --profile \"$PROFILE\"\n\naws s3api list-object-versions \\\n  --bucket \"$BUCKET\" \\\n  --prefix notes.txt \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "Expected: older versions still exist, plus a delete marker.",
        "warning": null,
        "expectedResult": "Expected: older versions still exist, plus a delete marker."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Tear down all versions and the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-objects \\\n  --bucket \"$BUCKET\" \\\n  --delete \"$(aws s3api list-object-versions \\\n    --bucket \"$BUCKET\" \\\n    --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' \\\n    --output json \\\n    --profile \"$PROFILE\")\" \\\n  --profile \"$PROFILE\" 2>/dev/null || true\n\naws s3api delete-objects \\\n  --bucket \"$BUCKET\" \\\n  --delete \"$(aws s3api list-object-versions \\\n    --bucket \"$BUCKET\" \\\n    --query '{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}' \\\n    --output json \\\n    --profile \"$PROFILE\")\" \\\n  --profile \"$PROFILE\" 2>/dev/null || true\n\naws s3 rb \"s3://$BUCKET\" --profile \"$PROFILE\"\nrm -f notes.txt"
          }
        ],
        "note": null,
        "warning": "This removes object versions and delete markers. Use only on this test bucket.",
        "expectedResult": "CLI command step 9 executed successfully."
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
        "text": "Verify that Versioning settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
      },
      {
        "id": "verify-5",
        "text": "Verify that server-side encryption and access logging are enabled as specified."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      },
      {
        "id": "cleanup-5",
        "text": "Clean up all remaining S3 artifacts and storage configurations created during this lab."
      },
      {
        "id": "cleanup-6",
        "text": "Clean up S3 lab resources."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "S3 Versioning",
        "body": "Keeps multiple versions of an object in one bucket."
      },
      {
        "id": "cs-2",
        "title": "Overwrite protection",
        "body": "A same-key upload creates a new version."
      },
      {
        "id": "cs-3",
        "title": "Delete marker",
        "body": "A normal delete adds a marker instead of deleting all old versions."
      },
      {
        "id": "cs-4",
        "title": "Suspend only",
        "body": "Versioning can be suspended after being enabled, not fully disabled back to never-enabled."
      },
      {
        "id": "cs-5",
        "title": "Cost",
        "body": "Old versions use storage and can increase cost."
      },
      {
        "id": "cs-6",
        "title": "Cleanup",
        "body": "Delete all versions and delete markers before deleting the bucket."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Bucket name already exists",
        "body": "S3 bucket names are global. Add your account ID or another unique suffix."
      },
      {
        "id": "ts-2",
        "title": "Versioning does not show Enabled",
        "body": "Refresh the bucket Properties page or run get-bucket-versioning again."
      },
      {
        "id": "ts-3",
        "title": "Only one object appears",
        "body": "Turn on Show versions in the S3 console."
      },
      {
        "id": "ts-4",
        "title": "Bucket will not delete",
        "body": "Delete every object version and every delete marker first."
      },
      {
        "id": "ts-5",
        "title": "CLI access denied",
        "body": "Check the CLI profile has S3 permissions for bucket creation, versioning, and object actions."
      },
      {
        "id": "ts-6",
        "title": "Wrong Region",
        "body": "Make sure the create-bucket command uses LocationConstraint=eu-west-2."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "S3 versioning protects against overwrites and deletes, but it is not a full backup plan by itself."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Deleting a versioned object creates a delete marker."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Old versions can still cost money."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Versioning can be suspended, not fully disabled back to the original never-enabled state."
      },
      {
        "id": "trap-5",
        "title": "Trap 5",
        "body": "MFA Delete is separate from normal versioning and is not configured in this lab."
      },
      {
        "id": "trap-6",
        "title": "Trap 6",
        "body": "Lifecycle rules can be used to expire old versions and reduce cost."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Versioning configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "S3 versioning is a save history button. Overwrite creates a new save. Delete adds a marker. Old saves can still be recovered.",
    "flashcardSetId": "s3_task_2_flashcards"
  },
  {
    "id": "task-saa-s3-upload-the-same-file-twice-and-view-both-saved-versions-003",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Upload the same file twice and view both saved versions",
    "slug": "upload-the-same-file-twice-and-view-both-saved-versions",
    "service": "Amazon S3",
    "feature": "Versioning",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an S3 bucket with versioning enabled, upload the same object key twice, then view both saved versions.",
    "status": "published",
    "tags": [
      "S3",
      "Versioning",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "S3 versioning",
        "body": "Versioning keeps multiple versions of the same object in one bucket."
      },
      {
        "id": "concept-2",
        "title": "Same object key",
        "body": "A new version is created when you upload a file using the same object key, such as version-test.txt."
      },
      {
        "id": "concept-3",
        "title": "Version ID",
        "body": "Each saved version gets its own Version ID."
      },
      {
        "id": "concept-4",
        "title": "Current version",
        "body": "The newest uploaded version becomes the current version."
      },
      {
        "id": "concept-5",
        "title": "Previous version",
        "body": "Older versions are kept until you delete them or lifecycle rules remove them."
      },
      {
        "id": "concept-6",
        "title": "Exam trap",
        "body": "Versioning can be suspended, but existing versions remain."
      }
    ],
    "whyItMatters": "Versioning protects against accidental overwrites and deletes. If a user uploads the wrong file, you can recover an older version.",
    "values": [
      {
        "label": "Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "s3-task-3-versioning-[account-id]"
      },
      {
        "label": "Object key",
        "value": "version-test.txt"
      },
      {
        "label": "Version 1 text",
        "value": "This is version 1"
      },
      {
        "label": "Version 2 text",
        "value": "This is version 2"
      },
      {
        "label": "Console location",
        "value": "S3 → bucket → Objects → Show versions"
      },
      {
        "label": "CLI check",
        "value": "list-object-versions"
      },
      {
        "label": "Tear down",
        "value": "Delete all object versions first"
      }
    ],
    "costWarning": "This lab should cost almost nothing if you delete everything at the end. S3 charges for stored objects, requests, and object versions. Versioning can increase cost because old versions are kept.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Start from AWS login",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Open S3."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Use the Region eu-west-2 for this lab."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the test bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use bucket name s3-task-3-versioning-[account-id]."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Replace [account-id] with your AWS account ID."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Region eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Block all public access turned on."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create the bucket."
          }
        ],
        "note": "S3 bucket names must be globally unique. Adding your account ID makes the name more likely to work.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Turn on bucket versioning",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open your new bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose the Properties tab."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Find Bucket Versioning."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select Enable."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Save changes."
          }
        ],
        "note": null,
        "warning": "Versioning cannot be fully turned off after it is enabled. It can only be suspended.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the first file version",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "On your computer, create a file called version-test.txt."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Put this text inside: This is version 1."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Save the file."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Upload version 1",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Go to the bucket Objects tab."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Add version-test.txt."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Return to the bucket objects list."
          }
        ],
        "note": "The object is now saved as the first version.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Edit the file locally",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the same local file version-test.txt."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Replace the text with: This is version 2."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Save the file with the same filename."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Upload the same file again",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Choose Upload again."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Add the updated version-test.txt file."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Upload it to the same bucket."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Keep the same object key: version-test.txt."
          }
        ],
        "note": "Because versioning is enabled, S3 does not simply replace the old file. It saves a new version.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "View both saved versions",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open the bucket Objects tab."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Turn on Show versions."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Find version-test.txt."
          },
          {
            "id": "console-step-8-item-4",
            "text": "You should see two versions."
          },
          {
            "id": "console-step-8-item-5",
            "text": "The newest version should be marked as the current version."
          },
          {
            "id": "console-step-8-item-6",
            "text": "The older version should still be available."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Verify the lab result",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Confirm the bucket has versioning enabled."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Confirm the same object key has two versions."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Confirm each version has a different Version ID."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Explain that versioning protects against accidental overwrites."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Tear down in the correct order",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Turn on Show versions."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Select all versions of version-test.txt."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Delete all object versions."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Delete any delete markers if they exist."
          },
          {
            "id": "console-step-10-item-6",
            "text": "Then delete the bucket."
          }
        ],
        "note": null,
        "warning": "A versioned bucket cannot be deleted until all object versions and delete markers are removed.",
        "expectedResult": "Step 10 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Set variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "REGION=\"eu-west-2\"\nPROFILE=\"default\"\nACCOUNT_ID=$(aws sts get-caller-identity --profile \"$PROFILE\" --query Account --output text)\nBUCKET=\"s3-task-3-versioning-$ACCOUNT_ID\"\nKEY=\"version-test.txt\"\n\necho \"Bucket: $BUCKET\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 1 executed successfully."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create the S3 bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket \\\n  --bucket \"$BUCKET\" \\\n  --region \"$REGION\" \\\n  --create-bucket-configuration LocationConstraint=\"$REGION\" \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Enable bucket versioning",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning \\\n  --bucket \"$BUCKET\" \\\n  --versioning-configuration Status=Enabled \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": null,
        "warning": "After versioning is enabled, it can be suspended but not fully removed.",
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify versioning is enabled",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-versioning \\\n  --bucket \"$BUCKET\" \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "Expected result: Status should show Enabled.",
        "warning": null,
        "expectedResult": "Expected result: Status should show Enabled."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Upload version 1",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "echo \"This is version 1\" > version-test.txt\n\naws s3api put-object \\\n  --bucket \"$BUCKET\" \\\n  --key \"$KEY\" \\\n  --body version-test.txt \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Upload version 2 using the same key",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "echo \"This is version 2\" > version-test.txt\n\naws s3api put-object \\\n  --bucket \"$BUCKET\" \\\n  --key \"$KEY\" \\\n  --body version-test.txt \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "The object key is the same. S3 creates a second version because versioning is enabled.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "List both saved versions",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3api list-object-versions \\\n  --bucket \"$BUCKET\" \\\n  --prefix \"$KEY\" \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "Expected result: you should see two versions with different Version IDs.",
        "warning": null,
        "expectedResult": "Expected result: you should see two versions with different Version IDs."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Download each version",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3api list-object-versions \\\n  --bucket \"$BUCKET\" \\\n  --prefix \"$KEY\" \\\n  --query \"Versions[].{VersionId:VersionId,IsLatest:IsLatest,LastModified:LastModified}\" \\\n  --output table \\\n  --profile \"$PROFILE\""
          }
        ],
        "note": "Copy a VersionId from the output if you want to download a specific version.",
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Tear down all versions and the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-objects \\\n  --bucket \"$BUCKET\" \\\n  --delete \"$(aws s3api list-object-versions \\\n    --bucket \"$BUCKET\" \\\n    --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' \\\n    --output json \\\n    --profile \"$PROFILE\")\" \\\n  --profile \"$PROFILE\"\n\naws s3api delete-bucket \\\n  --bucket \"$BUCKET\" \\\n  --profile \"$PROFILE\"\n\nrm -f version-test.txt"
          }
        ],
        "note": null,
        "warning": "If delete markers exist, delete those too before deleting the bucket.",
        "expectedResult": "CLI command step 9 executed successfully."
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
        "text": "Verify that Versioning settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "S3 versioning",
        "body": "Keeps multiple versions of the same object."
      },
      {
        "id": "cs-2",
        "title": "Overwrite protection",
        "body": "Uploading the same key creates a new version."
      },
      {
        "id": "cs-3",
        "title": "Version ID",
        "body": "Unique ID for each object version."
      },
      {
        "id": "cs-4",
        "title": "Current version",
        "body": "The newest version returned by normal object requests."
      },
      {
        "id": "cs-5",
        "title": "Suspended versioning",
        "body": "Stops creating new numbered versions but keeps old versions."
      },
      {
        "id": "cs-6",
        "title": "Delete rule",
        "body": "Delete all versions and delete markers before deleting a versioned bucket."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Only one version appears",
        "body": "Check that versioning was enabled before the uploads."
      },
      {
        "id": "ts-2",
        "title": "Upload overwrote the file",
        "body": "You may have uploaded before versioning was enabled."
      },
      {
        "id": "ts-3",
        "title": "Cannot delete bucket",
        "body": "Delete every object version and delete marker first."
      },
      {
        "id": "ts-4",
        "title": "AccessDenied",
        "body": "Your identity needs S3 permissions such as s3:PutBucketVersioning, s3:PutObject, and s3:ListBucketVersions."
      },
      {
        "id": "ts-5",
        "title": "Wrong bucket name",
        "body": "Bucket names are globally unique. Use your AWS account ID in the name."
      },
      {
        "id": "ts-6",
        "title": "No Version ID shown",
        "body": "Use Show versions in the Console or list-object-versions in the CLI."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Versioning protects against overwrites because older versions stay saved."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Versioning does not stop users from deleting. It keeps recoverable versions and delete markers."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "MFA Delete is different from normal versioning."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Versioning can increase storage cost because old versions remain."
      },
      {
        "id": "trap-5",
        "title": "Trap 5",
        "body": "Suspending versioning does not delete existing versions."
      },
      {
        "id": "trap-6",
        "title": "Trap 6",
        "body": "A versioned bucket must be emptied of all versions before deletion."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Versioning configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Same name, new save. With versioning on, uploading the same filename again saves a new version instead of losing the old one.",
    "flashcardSetId": "s3_task_3_flashcards"
  },
  {
    "id": "task-saa-s3-delete-a-file-then-restore-it-using-s3-versioning-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Delete a file, then restore it using S3 versioning",
    "slug": "delete-a-file-then-restore-it-using-s3-versioning",
    "service": "Amazon S3",
    "feature": "Versioning",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Enable S3 Versioning, delete an object, then restore it by removing the delete marker or copying an older version back as the current version.",
    "status": "published",
    "tags": [
      "S3",
      "Versioning",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "S3 Versioning",
        "body": "Versioning keeps multiple versions of the same object key inside a bucket."
      },
      {
        "id": "concept-2",
        "title": "Object key",
        "body": "The object key is the file path/name in S3, such as versioning-restore-demo.txt."
      },
      {
        "id": "concept-3",
        "title": "Delete marker",
        "body": "When versioning is enabled, a normal delete adds a delete marker. It does not immediately remove older versions."
      },
      {
        "id": "concept-4",
        "title": "Restore method 1",
        "body": "Remove the delete marker. The previous version becomes visible again."
      },
      {
        "id": "concept-5",
        "title": "Restore method 2",
        "body": "Copy an older version to the same key. That creates a new current version."
      },
      {
        "id": "concept-6",
        "title": "Exam trap",
        "body": "Deleting an object in a versioned bucket does not always mean the data is gone."
      }
    ],
    "whyItMatters": "S3 Versioning protects against accidental deletes. If a user deletes a file, older versions can still exist. You can restore access by removing the delete marker or promoting an older version.",
    "values": [
      {
        "label": "Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task-4-versioning-restore-[account-id]"
      },
      {
        "label": "Object key",
        "value": "versioning-restore-demo.txt"
      },
      {
        "label": "Versioning state",
        "value": "Enabled"
      },
      {
        "label": "Restore method",
        "value": "Delete marker removal"
      },
      {
        "label": "Optional restore method",
        "value": "Copy older version"
      }
    ],
    "costWarning": "This lab should cost very little if you use a tiny text file and delete everything afterwards. S3 charges can apply for stored objects, object versions, and requests. Clean up the bucket, all versions, and all delete markers after the lab.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Start from AWS login",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Open S3."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Use the Region eu-west-2 for this lab."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the test bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Bucket name: saa-s3-task-4-versioning-restore-[account-id]."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Replace [account-id] with your real AWS account ID."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Region: eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Block all public access turned on."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create the bucket."
          }
        ],
        "note": "S3 bucket names must be globally unique. Adding your account ID helps avoid name conflicts.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Turn on versioning",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose the Properties tab."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Find Bucket Versioning."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select Enable."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Save the change."
          }
        ],
        "note": null,
        "warning": "After versioning is enabled, it cannot be fully turned off. It can only be suspended.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Upload a small test file",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Create a small text file on your computer."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Name it versioning-restore-demo.txt."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add simple text like Version 1 - keep me safe."
          },
          {
            "id": "console-step-4-item-4",
            "text": "In the bucket, choose Upload."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Add the file and upload it."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Delete the object",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Stay on the bucket Objects tab."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select versioning-restore-demo.txt."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm the delete."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Return to the object list."
          }
        ],
        "note": "The object disappears from the normal object view because S3 added a delete marker.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Show object versions",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "On the Objects tab, turn on Show versions."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Find versioning-restore-demo.txt."
          },
          {
            "id": "console-step-6-item-3",
            "text": "You should see the older object version."
          },
          {
            "id": "console-step-6-item-4",
            "text": "You should also see a delete marker."
          }
        ],
        "note": "The delete marker is now the current version. That is why the object looks deleted.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Restore by deleting the delete marker",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "With Show versions still enabled, select the delete marker for the object."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Confirm deletion of the delete marker."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Turn off Show versions."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Check the normal object list again."
          }
        ],
        "note": "The older object version should now appear again as the current visible object.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Verify the restore worked",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open versioning-restore-demo.txt."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Check the object details."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Confirm the object is visible again."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Download it if you want to confirm the file content."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Optional: restore by copying an older version",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Turn Show versions on again."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Select the older object version."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Use the console copy option if available."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Copy the older version back to the same key name."
          },
          {
            "id": "console-step-9-item-5",
            "text": "This creates a new current version."
          }
        ],
        "note": "The exam may describe this as promoting or restoring an older version.",
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Tear down in the correct order",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Turn on Show versions."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Delete all object versions."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Delete all delete markers."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Then delete the bucket."
          },
          {
            "id": "console-step-10-item-6",
            "text": "Confirm the bucket is gone from the S3 bucket list."
          }
        ],
        "note": null,
        "warning": "A versioned bucket may look empty but still contain old versions or delete markers. Delete those before deleting the bucket.",
        "expectedResult": "Step 10 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Set lab variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "REGION=\"eu-west-2\"\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nBUCKET=\"saa-s3-task-4-versioning-restore-$ACCOUNT_ID\"\nKEY=\"versioning-restore-demo.txt\"\n\necho \"Bucket: $BUCKET\"\necho \"Key: $KEY\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 1 executed successfully."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create the test bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket \\\n  --bucket \"$BUCKET\" \\\n  --region \"$REGION\" \\\n  --create-bucket-configuration LocationConstraint=\"$REGION\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Enable bucket versioning",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning \\\n  --bucket \"$BUCKET\" \\\n  --versioning-configuration Status=Enabled\n\naws s3api get-bucket-versioning --bucket \"$BUCKET\""
          }
        ],
        "note": "Expected result: Status should show Enabled.",
        "warning": null,
        "expectedResult": "Expected result: Status should show Enabled."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create and upload a test file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "echo \"Version 1 - keep me safe\" > versioning-restore-demo.txt\n\naws s3api put-object \\\n  --bucket \"$BUCKET\" \\\n  --key \"$KEY\" \\\n  --body versioning-restore-demo.txt"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Delete the object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-object \\\n  --bucket \"$BUCKET\" \\\n  --key \"$KEY\""
          }
        ],
        "note": "Because versioning is enabled, this creates a delete marker.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Prove the object looks deleted",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api list-objects-v2 \\\n  --bucket \"$BUCKET\" \\\n  --query \"Contents[].Key\" \\\n  --output text"
          }
        ],
        "note": "Expected result: the object key should not appear in the normal current object list.",
        "warning": null,
        "expectedResult": "Expected result: the object key should not appear in the normal current object list."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Find the delete marker",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3api list-object-versions \\\n  --bucket \"$BUCKET\" \\\n  --prefix \"$KEY\""
          }
        ],
        "note": "Look for DeleteMarkers. The delete marker is hiding the older object version.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Restore by deleting the delete marker",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "DELETE_MARKER_VERSION_ID=$(aws s3api list-object-versions \\\n  --bucket \"$BUCKET\" \\\n  --prefix \"$KEY\" \\\n  --query \"DeleteMarkers[?IsLatest==\\`true\\`].VersionId | [0]\" \\\n  --output text)\n\necho \"Delete marker version ID: $DELETE_MARKER_VERSION_ID\"\n\naws s3api delete-object \\\n  --bucket \"$BUCKET\" \\\n  --key \"$KEY\" \\\n  --version-id \"$DELETE_MARKER_VERSION_ID\""
          }
        ],
        "note": null,
        "warning": "This deletes the delete marker, not the old object version.",
        "expectedResult": "CLI command step 8 executed successfully."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Verify the object is visible again",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3api list-objects-v2 \\\n  --bucket \"$BUCKET\" \\\n  --query \"Contents[].Key\" \\\n  --output text\n\naws s3api get-object \\\n  --bucket \"$BUCKET\" \\\n  --key \"$KEY\" \\\n  restored-versioning-restore-demo.txt\n\ncat restored-versioning-restore-demo.txt"
          }
        ],
        "note": "Expected result: the key appears again and the downloaded file contains your original text.",
        "warning": null,
        "expectedResult": "Expected result: the key appears again and the downloaded file contains your original text."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Tear down all versions and the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-objects \\\n  --bucket \"$BUCKET\" \\\n  --delete \"$(aws s3api list-object-versions \\\n    --bucket \"$BUCKET\" \\\n    --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}')\" 2>/dev/null || true\n\naws s3api delete-objects \\\n  --bucket \"$BUCKET\" \\\n  --delete \"$(aws s3api list-object-versions \\\n    --bucket \"$BUCKET\" \\\n    --query '{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}')\" 2>/dev/null || true\n\naws s3api delete-bucket --bucket \"$BUCKET\" --region \"$REGION\"\n\nrm -f versioning-restore-demo.txt restored-versioning-restore-demo.txt"
          }
        ],
        "note": null,
        "warning": "If bucket deletion fails, list object versions again. A remaining version or delete marker is usually the cause.",
        "expectedResult": "CLI command step 10 executed successfully."
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
        "text": "Verify that Versioning settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
      },
      {
        "id": "verify-5",
        "text": "Verify that server-side encryption and access logging are enabled as specified."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      },
      {
        "id": "cleanup-5",
        "text": "Clean up all remaining S3 artifacts and storage configurations created during this lab."
      },
      {
        "id": "cleanup-6",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-7",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-8",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-9",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-10",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-11",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-12",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-13",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-14",
        "text": "Clean up S3 lab resources."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "S3 Versioning",
        "body": "Keeps multiple versions of an object key."
      },
      {
        "id": "cs-2",
        "title": "Delete marker",
        "body": "A special marker that makes the object look deleted."
      },
      {
        "id": "cs-3",
        "title": "Restore option 1",
        "body": "Delete the delete marker."
      },
      {
        "id": "cs-4",
        "title": "Restore option 2",
        "body": "Copy an older version to make a new current version."
      },
      {
        "id": "cs-5",
        "title": "Current version",
        "body": "The latest version S3 shows in the normal object list."
      },
      {
        "id": "cs-6",
        "title": "Cleanup",
        "body": "Delete all versions and delete markers before deleting the bucket."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Object did not disappear",
        "body": "Check that you deleted the current object key and that you are not viewing all versions."
      },
      {
        "id": "ts-2",
        "title": "No delete marker shown",
        "body": "Check that versioning was enabled before the delete happened."
      },
      {
        "id": "ts-3",
        "title": "Restore did not work",
        "body": "Make sure you deleted the latest delete marker, not the old object version."
      },
      {
        "id": "ts-4",
        "title": "AccessDenied",
        "body": "Your identity may need s3:PutBucketVersioning, s3:ListBucketVersions, s3:DeleteObjectVersion, and normal S3 object permissions."
      },
      {
        "id": "ts-5",
        "title": "Bucket will not delete",
        "body": "A versioned bucket may still contain hidden versions or delete markers."
      },
      {
        "id": "ts-6",
        "title": "CLI query returns None",
        "body": "No matching delete marker was found. Re-run list-object-versions and check the output manually."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "A normal delete in a versioned bucket creates a delete marker."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Older object versions may still exist after deletion."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "To restore visibility, remove the delete marker or copy an older version."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Versioning can be suspended, but existing versions remain."
      },
      {
        "id": "trap-5",
        "title": "Trap 5",
        "body": "Lifecycle rules can permanently delete old versions if configured."
      },
      {
        "id": "trap-6",
        "title": "Trap 6",
        "body": "MFA Delete is separate from normal versioning and is not commonly used in basic labs."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Versioning configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Delete marker = a cover sheet. The file may still be underneath. Remove the cover sheet and the file is visible again.",
    "flashcardSetId": "s3_task_4_flashcards"
  },
  {
    "id": "task-saa-s3-turn-on-s3-server-access-logging-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Turn on S3 server access logging",
    "slug": "turn-on-s3-server-access-logging",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Turn on server access logging for one S3 bucket and send the logs to a separate S3 bucket.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Source bucket",
        "body": "The source bucket is the bucket you want to monitor. Amazon S3 records requests made to this bucket."
      },
      {
        "id": "concept-2",
        "title": "Log bucket",
        "body": "The log bucket is a separate bucket that stores the access log objects. Do not send logs back to the same source bucket."
      },
      {
        "id": "concept-3",
        "title": "Same Region and same account",
        "body": "The source bucket and log bucket must be in the same AWS Region and owned by the same AWS account."
      },
      {
        "id": "concept-4",
        "title": "Log delivery permissions",
        "body": "The log bucket needs a bucket policy that allows the S3 logging service to write log objects into it."
      },
      {
        "id": "concept-5",
        "title": "IAM permissions needed",
        "body": "You need permission to create S3 buckets, put bucket policies, enable bucket logging, upload test objects, list buckets, read objects, and delete lab resources. For a personal lab account, an admin user or lab admin role is okay. In a real company, use least privilege."
      }
    ],
    "whyItMatters": "S3 server access logging helps you review bucket requests for security checks, troubleshooting, and audit evidence.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source bucket",
        "value": "saa-s3-task5-source-[account-id]"
      },
      {
        "label": "Log bucket",
        "value": "saa-s3-task5-logs-[account-id]"
      },
      {
        "label": "Log prefix",
        "value": "source-bucket-logs/"
      },
      {
        "label": "Test object",
        "value": "task5-test.txt"
      }
    ],
    "costWarning": "This task should cost very little because it only uses small S3 objects. Delete both buckets after the lab to stop storage charges.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Sign in and choose the Region",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Use the AWS Region eu-west-2 for this lab."
          }
        ],
        "note": "S3 is a global console, but each bucket is created in one Region.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the source bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-2",
            "text": "For Bucket name, enter saa-s3-task5-source-[account-id]."
          },
          {
            "id": "console-step-2-item-3",
            "text": "For AWS Region, choose Europe (London) eu-west-2."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Keep Block all public access turned on."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Bucket Versioning disabled for this lab."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create bucket."
          }
        ],
        "note": null,
        "warning": "Replace [account-id] with your own AWS account ID so the bucket name is globally unique.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the separate log bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Create bucket again."
          },
          {
            "id": "console-step-3-item-2",
            "text": "For Bucket name, enter saa-s3-task5-logs-[account-id]."
          },
          {
            "id": "console-step-3-item-3",
            "text": "For AWS Region, choose Europe (London) eu-west-2."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep Block all public access turned on."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Do not enable Object Lock."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose Create bucket."
          }
        ],
        "note": "The log bucket must be separate from the source bucket.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Allow S3 to write logs to the log bucket",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the bucket named saa-s3-task5-logs-[account-id]."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose the Permissions tab."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Go to Bucket policy."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Add a bucket policy that allows the S3 logging service to write to source-bucket-logs/."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose Save changes."
          }
        ],
        "note": "New S3 buckets normally have ACLs disabled, so use a bucket policy for log delivery.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Enable server access logging on the source bucket",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the bucket named saa-s3-task5-source-[account-id]."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Properties tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Scroll to Server access logging."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose Enable."
          },
          {
            "id": "console-step-5-item-6",
            "text": "For Target bucket, choose saa-s3-task5-logs-[account-id]."
          },
          {
            "id": "console-step-5-item-7",
            "text": "For Target prefix, enter source-bucket-logs/."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Choose Save changes."
          }
        ],
        "note": null,
        "warning": "Do not choose the same bucket as both source and target.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Upload a small test file",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Add files."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Upload a small text file named task5-test.txt."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Open or list the object to create bucket activity."
          }
        ],
        "note": "S3 access logs are not instant. They can take time to appear.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Verify the logs",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the log bucket."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Open the prefix source-bucket-logs/."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Check for access log objects."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Open one log object and confirm it contains request records."
          }
        ],
        "note": "If logs are not visible yet, wait and check again later.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Tear down the lab",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Go to Properties."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Edit Server access logging and choose Disable."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Delete the test object from the source bucket."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Delete all log objects from the log bucket."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Delete the source bucket."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Delete the log bucket."
          }
        ],
        "note": null,
        "warning": "Empty buckets before deleting them.",
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
        "note": "Expected: your AWS account ID and ARN are shown.",
        "warning": null,
        "expectedResult": "Expected: your AWS account ID and ARN are shown."
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
            "text": "REGION=\"eu-west-2\""
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SOURCE_BUCKET=\"saa-s3-task5-source-$ACCOUNT_ID\""
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "LOG_BUCKET=\"saa-s3-task5-logs-$ACCOUNT_ID\""
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "LOG_PREFIX=\"source-bucket-logs/\""
          }
        ],
        "note": "These names use your account ID to help keep the bucket names unique.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the source bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket \"$SOURCE_BUCKET\" --region \"$REGION\" --create-bucket-configuration LocationConstraint=\"$REGION\""
          }
        ],
        "note": "Expected: AWS creates the source bucket in eu-west-2.",
        "warning": null,
        "expectedResult": "Expected: AWS creates the source bucket in eu-west-2."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the log bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket \"$LOG_BUCKET\" --region \"$REGION\" --create-bucket-configuration LocationConstraint=\"$REGION\""
          }
        ],
        "note": "Expected: AWS creates a separate bucket for access logs.",
        "warning": null,
        "expectedResult": "Expected: AWS creates a separate bucket for access logs."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create the log delivery bucket policy file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > s3-task5-log-bucket-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"S3ServerAccessLogsPolicy\",\n      \"Effect\": \"Allow\",\n      \"Principal\": {\n        \"Service\": \"logging.s3.amazonaws.com\"\n      },\n      \"Action\": \"s3:PutObject\",\n      \"Resource\": \"arn:aws:s3:::$LOG_BUCKET/$LOG_PREFIX*\",\n      \"Condition\": {\n        \"ArnLike\": {\n          \"aws:SourceArn\": \"arn:aws:s3:::$SOURCE_BUCKET\"\n        },\n        \"StringEquals\": {\n          \"aws:SourceAccount\": \"$ACCOUNT_ID\"\n        }\n      }\n    }\n  ]\n}\nEOF"
          }
        ],
        "note": "This allows only your source bucket to send logs to your log bucket.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Apply the log bucket policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-policy --bucket \"$LOG_BUCKET\" --policy file://s3-task5-log-bucket-policy.json"
          }
        ],
        "note": "Expected: the policy is saved on the log bucket.",
        "warning": null,
        "expectedResult": "Expected: the policy is saved on the log bucket."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Create the logging configuration file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "cat > s3-task5-logging.json <<EOF\n{\n  \"LoggingEnabled\": {\n    \"TargetBucket\": \"$LOG_BUCKET\",\n    \"TargetPrefix\": \"$LOG_PREFIX\"\n  }\n}\nEOF"
          }
        ],
        "note": "This tells S3 where to send the access logs.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Enable server access logging",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-logging --bucket \"$SOURCE_BUCKET\" --bucket-logging-status file://s3-task5-logging.json"
          }
        ],
        "note": "Expected: server access logging is enabled on the source bucket.",
        "warning": null,
        "expectedResult": "Expected: server access logging is enabled on the source bucket."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Confirm logging is enabled",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-logging --bucket \"$SOURCE_BUCKET\""
          }
        ],
        "note": "Expected: the output shows the target bucket and prefix.",
        "warning": null,
        "expectedResult": "Expected: the output shows the target bucket and prefix."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Create bucket activity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "echo \"S3 Task 5 test file\" > task5-test.txt"
          },
          {
            "id": "cli-step-10-cmd-2",
            "language": "bash",
            "text": "aws s3 cp task5-test.txt s3://$SOURCE_BUCKET/task5-test.txt"
          },
          {
            "id": "cli-step-10-cmd-3",
            "language": "bash",
            "text": "aws s3 ls s3://$SOURCE_BUCKET/"
          }
        ],
        "note": "This creates requests that S3 can log.",
        "warning": null,
        "expectedResult": "CLI command step 10 executed successfully."
      },
      {
        "id": "cli-step-11",
        "number": 11,
        "title": "Check for delivered logs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-11-cmd-1",
            "language": "bash",
            "text": "aws s3 ls s3://$LOG_BUCKET/$LOG_PREFIX --recursive"
          }
        ],
        "note": "Expected: log objects appear after delivery. This is not instant, so check again later if the list is empty.",
        "warning": null,
        "expectedResult": "Expected: log objects appear after delivery. This is not instant, so check again later if the list is empty."
      },
      {
        "id": "cli-step-12",
        "number": 12,
        "title": "Tear down the lab",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-12-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-logging --bucket \"$SOURCE_BUCKET\" --bucket-logging-status '{}'"
          },
          {
            "id": "cli-step-12-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$SOURCE_BUCKET --recursive"
          },
          {
            "id": "cli-step-12-cmd-3",
            "language": "bash",
            "text": "aws s3 rm s3://$LOG_BUCKET --recursive"
          },
          {
            "id": "cli-step-12-cmd-4",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket \"$SOURCE_BUCKET\" --region \"$REGION\""
          },
          {
            "id": "cli-step-12-cmd-5",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket \"$LOG_BUCKET\" --region \"$REGION\""
          }
        ],
        "note": null,
        "warning": "Cleanup order matters: disable logging, empty buckets, then delete buckets.",
        "expectedResult": "CLI command step 12 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "verify-7",
        "text": "Verify lifecycle configuration rules and object transition rules in the S3 console."
      },
      {
        "id": "verify-8",
        "text": "Confirm EventBridge or SNS/SQS event notifications are triggered on S3 object uploads."
      },
      {
        "id": "verify-9",
        "text": "Verify S3 Storage Lens dashboard or CloudWatch metrics reflect storage usage data."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Use a separate bucket",
        "body": "Send server access logs to a different bucket to avoid recursive logging and extra cost."
      },
      {
        "id": "cs-2",
        "title": "Same Region",
        "body": "The source bucket and log bucket must be in the same AWS Region."
      },
      {
        "id": "cs-3",
        "title": "Same account",
        "body": "The source bucket and log bucket must be owned by the same AWS account."
      },
      {
        "id": "cs-4",
        "title": "Bucket policy",
        "body": "Modern S3 buckets usually use bucket policies, not ACL grants, for log delivery permissions."
      },
      {
        "id": "cs-5",
        "title": "Delayed delivery",
        "body": "S3 server access logs are not immediate. Empty results do not always mean the setup is wrong."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No logs appear",
        "body": "Wait and check again. S3 server access log delivery can be delayed."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied when enabling logging",
        "body": "Your IAM user or role may not have permission to call s3:PutBucketLogging or update the log bucket policy."
      },
      {
        "id": "ts-3",
        "title": "Logs cannot be delivered",
        "body": "Check that the log bucket policy allows logging.s3.amazonaws.com to run s3:PutObject."
      },
      {
        "id": "ts-4",
        "title": "Wrong Region",
        "body": "Make sure the source bucket and log bucket are both in eu-west-2."
      },
      {
        "id": "ts-5",
        "title": "Bucket deletion fails",
        "body": "Empty each bucket first. S3 cannot delete a bucket that still contains objects."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Same bucket trap",
        "body": "Do not send access logs to the same bucket being logged. This can create a loop of extra log files."
      },
      {
        "id": "trap-2",
        "title": "Different Region trap",
        "body": "The log bucket must be in the same Region as the source bucket."
      },
      {
        "id": "trap-3",
        "title": "CloudTrail confusion",
        "body": "S3 server access logging records bucket access requests. CloudTrail records API activity. They are related but not the same."
      },
      {
        "id": "trap-4",
        "title": "Instant logs trap",
        "body": "Do not expect access logs to appear immediately after enabling logging."
      },
      {
        "id": "trap-5",
        "title": "Public access trap",
        "body": "Server access logging does not require public bucket access. Keep Block Public Access on."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Source speaks, log bucket listens. The source bucket creates activity. The separate log bucket stores the record.",
    "flashcardSetId": "s3_task_5_flashcards"
  },
  {
    "id": "task-saa-s3-upload-a-file-and-share-it-with-a-presigned-url-006",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Upload a file and share it with a presigned URL",
    "slug": "upload-a-file-and-share-it-with-a-presigned-url",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Upload a private file to Amazon S3, create a time-limited presigned URL, and open it in another browser.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Private object",
        "body": "An S3 object can stay private. A presigned URL can still give short-term access."
      },
      {
        "id": "concept-2",
        "title": "Presigned URL",
        "body": "A presigned URL is a temporary link signed by an AWS identity that already has permission to access the object."
      },
      {
        "id": "concept-3",
        "title": "Bearer token risk",
        "body": "Anyone with the presigned URL can use it until it expires. Treat it like a temporary password."
      },
      {
        "id": "concept-4",
        "title": "IAM permissions needed",
        "body": "You need permission to create a bucket, upload an object, read the object, generate the URL, and delete the lab resources. For a personal lab account, AdministratorAccess is okay. In a real company, use least privilege."
      }
    ],
    "whyItMatters": "Presigned URLs let you share private S3 objects without making the bucket public. This is common in upload and download designs.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task6-presign-[account-id]"
      },
      {
        "label": "Object key",
        "value": "presigned-url-demo.txt"
      },
      {
        "label": "URL expiry",
        "value": "10 minutes in Console or 600 seconds in CLI"
      },
      {
        "label": "Public access",
        "value": "Blocked"
      }
    ],
    "costWarning": "This lab should cost almost nothing because it uses one small S3 object. Delete the object and bucket after the lab.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Create a small test file",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "On your computer, create a new text file."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Name the file presigned-url-demo.txt."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Add this text: Hello from a private S3 object."
          },
          {
            "id": "console-step-1-item-4",
            "text": "Save the file somewhere easy to find, such as your Desktop."
          }
        ],
        "note": "This file is safe to upload because it contains no private data.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open Amazon S3",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "In the search bar, type S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open S3."
          },
          {
            "id": "console-step-2-item-4",
            "text": "In the left menu, choose General purpose buckets."
          }
        ],
        "note": "S3 bucket names are global, so your bucket name must be unique.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a private bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "For AWS Region, choose Europe (London) eu-west-2."
          },
          {
            "id": "console-step-3-item-3",
            "text": "For Bucket name, enter saa-s3-task6-presign-[your-account-id]."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Leave Object Ownership as ACLs disabled."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Keep Block all public access turned on."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Leave the other settings as default."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose Create bucket."
          }
        ],
        "note": null,
        "warning": "Do not turn off Block Public Access. Presigned URLs do not need the bucket to be public.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Upload the file",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open your new bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Add files."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select presigned-url-demo.txt from your computer."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Wait for the upload to show as successful."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Choose Close."
          }
        ],
        "note": "The object is uploaded, but it is still private.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test that the object is private",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select presigned-url-demo.txt."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Copy the normal Object URL shown on the object page."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Open another browser or an incognito window."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Paste the normal Object URL and press Enter."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Expected result: access is denied."
          }
        ],
        "note": "This proves the object is not public.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create a presigned URL",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Go back to the S3 object list."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select presigned-url-demo.txt."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Object actions."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Share with a presigned URL."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Set the expiry to 10 minutes."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose Create presigned URL."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Copy the presigned URL if it is not copied automatically."
          }
        ],
        "note": null,
        "warning": "Do not share the URL publicly. Anyone with the link can access the object until it expires.",
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Open the presigned URL in another browser",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open another browser or an incognito window."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Paste the presigned URL."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Press Enter."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Confirm the browser opens or downloads the file."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Confirm the file contains: Hello from a private S3 object."
          }
        ],
        "note": "The other browser does not need AWS login because the URL already carries temporary access.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Tear down the Console resources",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Go back to the S3 bucket."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Select presigned-url-demo.txt."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Confirm the deletion."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Go back to General purpose buckets."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Select saa-s3-task6-presign-[your-account-id]."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-8-item-8",
            "text": "Enter the bucket name to confirm."
          },
          {
            "id": "console-step-8-item-9",
            "text": "Choose Delete bucket."
          }
        ],
        "note": null,
        "warning": "Delete the object before deleting the bucket. S3 buckets must be empty before deletion.",
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
        "note": "Expected: your AWS account ID and ARN are shown.",
        "warning": null,
        "expectedResult": "Expected: your AWS account ID and ARN are shown."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "BUCKET_NAME=saa-s3-task6-presign-${ACCOUNT_ID}"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "OBJECT_KEY=presigned-url-demo.txt"
          }
        ],
        "note": "These variables keep the commands shorter and reduce typing mistakes.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the test file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "echo 'Hello from a private S3 object.' > presigned-url-demo.txt"
          }
        ],
        "note": "This creates a tiny text file for the lab.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the S3 bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET_NAME --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          }
        ],
        "note": "Expected: AWS returns the bucket location.",
        "warning": null,
        "expectedResult": "Expected: AWS returns the bucket location."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Block public access",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
          }
        ],
        "note": "This keeps the bucket private. The presigned URL will still work.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Upload the file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3 cp presigned-url-demo.txt s3://$BUCKET_NAME/$OBJECT_KEY --region $REGION"
          }
        ],
        "note": "Expected: upload completed.",
        "warning": null,
        "expectedResult": "Expected: upload completed."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Confirm the object exists",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3api head-object --bucket $BUCKET_NAME --key $OBJECT_KEY --region $REGION"
          }
        ],
        "note": "Expected: metadata appears, such as ContentLength and ETag.",
        "warning": null,
        "expectedResult": "Expected: metadata appears, such as ContentLength and ETag."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Create the presigned URL",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3 presign s3://$BUCKET_NAME/$OBJECT_KEY --expires-in 600 --region $REGION"
          }
        ],
        "note": "Copy the URL that appears. It is valid for 600 seconds, which is 10 minutes.",
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Open the URL in another browser",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "echo 'Paste the presigned URL into another browser or incognito window.'"
          }
        ],
        "note": "Expected: the file opens or downloads without AWS sign-in.",
        "warning": null,
        "expectedResult": "Expected: the file opens or downloads without AWS sign-in."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Tear down the CLI resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET_NAME/$OBJECT_KEY --region $REGION"
          },
          {
            "id": "cli-step-10-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET_NAME --region $REGION"
          },
          {
            "id": "cli-step-10-cmd-3",
            "language": "bash",
            "text": "rm -f presigned-url-demo.txt"
          }
        ],
        "note": "Delete the object first, then delete the bucket.",
        "warning": null,
        "expectedResult": "CLI command step 10 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
        "title": "Presigned URL",
        "body": "A temporary signed link for an S3 action, usually download or upload."
      },
      {
        "id": "cs-2",
        "title": "Private bucket",
        "body": "The bucket can stay private. The presigned URL gives temporary access to one object."
      },
      {
        "id": "cs-3",
        "title": "Creator permissions",
        "body": "The URL works only for actions the creator is allowed to perform."
      },
      {
        "id": "cs-4",
        "title": "Expiry",
        "body": "Console presigned URLs can be set from 1 minute to 12 hours. AWS CLI and SDK URLs can last up to 7 days."
      },
      {
        "id": "cs-5",
        "title": "Security",
        "body": "Anyone with the URL can use it until it expires, unless credentials or permissions are revoked first."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied on normal Object URL",
        "body": "This is expected. The object is private. Use the presigned URL instead."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied on presigned URL",
        "body": "The URL may have expired, the object key may be wrong, or the creator may not have s3:GetObject permission."
      },
      {
        "id": "ts-3",
        "title": "SignatureDoesNotMatch",
        "body": "The URL may be copied incorrectly, changed by the browser, or signed for a different Region. Create a new URL."
      },
      {
        "id": "ts-4",
        "title": "NoSuchKey",
        "body": "The object name in the URL does not match the object in the bucket. Check spelling and capital letters."
      },
      {
        "id": "ts-5",
        "title": "BucketAlreadyExists",
        "body": "S3 bucket names are global. Add your account ID or another unique ending."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Do not make the bucket public",
        "body": "Presigned URLs are used when you want temporary access without public bucket access."
      },
      {
        "id": "trap-2",
        "title": "Not permanent sharing",
        "body": "A presigned URL expires. Use CloudFront signed URLs or another design for controlled long-term sharing."
      },
      {
        "id": "trap-3",
        "title": "Creator still matters",
        "body": "The URL is limited by the permissions of the AWS identity that created it."
      },
      {
        "id": "trap-4",
        "title": "Bearer token",
        "body": "The URL itself grants access. If someone else gets it, they can use it until it expires."
      },
      {
        "id": "trap-5",
        "title": "GET versus PUT",
        "body": "A GET presigned URL downloads or opens an object. A PUT presigned URL uploads an object. Know the difference."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Private file. Temporary key. The bucket stays locked, but the signed URL opens one object for a short time.",
    "flashcardSetId": "s3_task_6_flashcards"
  },
  {
    "id": "task-saa-s3-add-a-bucket-policy-that-blocks-public-access-007",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Add a bucket policy that blocks public access",
    "slug": "add-a-bucket-policy-that-blocks-public-access",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an S3 bucket, upload a test file, add a bucket policy that denies reads from outside your AWS account, and test that a public browser request is blocked.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "S3 buckets are private by default",
        "body": "New S3 buckets do not allow public access by default. This lab keeps that safe default and adds an extra bucket policy guard."
      },
      {
        "id": "concept-2",
        "title": "Bucket policy",
        "body": "A bucket policy is a resource policy attached to an S3 bucket. It can allow or deny access to the bucket and its objects."
      },
      {
        "id": "concept-3",
        "title": "Explicit deny wins",
        "body": "An explicit Deny overrides an Allow. This is a key IAM and S3 exam rule."
      },
      {
        "id": "concept-4",
        "title": "Block Public Access",
        "body": "S3 Block Public Access is an extra safety layer. It helps stop public access through ACLs or bucket policies. Keep it on for this lab."
      },
      {
        "id": "concept-5",
        "title": "IAM permissions needed",
        "body": "For a personal lab account, an admin user or lab admin role is okay. In a real company, use least privilege only. Do not use the root user for normal labs."
      }
    ],
    "whyItMatters": "Many AWS exam questions test how S3 blocks public access. You must know bucket policies, explicit deny, and Block Public Access.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Example bucket name",
        "value": "saa-s3-task7-private-[account-id]"
      },
      {
        "label": "Example object",
        "value": "private-test.txt"
      },
      {
        "label": "Bucket policy goal",
        "value": "Deny s3:GetObject when the requester is not from your AWS account"
      },
      {
        "label": "Public test URL",
        "value": "https://saa-s3-task7-private-[account-id].s3.eu-west-2.amazonaws.com/private-test.txt"
      },
      {
        "label": "IAM permissions needed",
        "value": "sts:GetCallerIdentity, s3:CreateBucket, s3:PutBucketPublicAccessBlock, s3:GetBucketPublicAccessBlock, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:PutObject, s3:GetObject, s3:ListBucket, s3:DeleteObject, s3:DeleteBucketPolicy, s3:DeleteBucket"
      },
      {
        "label": "Safe lab identity",
        "value": "AdministratorAccess is acceptable in a personal lab. Use least privilege in a real company."
      }
    ],
    "costWarning": "This lab should cost almost nothing if you upload one tiny text file and delete the bucket after the lab. S3 storage and requests can still create small charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "In a real company, use least privilege permissions only."
          },
          {
            "id": "console-step-1-item-4",
            "text": "Confirm the identity has the S3 and STS permissions listed in the chosen example values section."
          }
        ],
        "note": null,
        "warning": "Do not use your root user for normal labs. Use an IAM user, IAM role, or IAM Identity Center permission set.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open Amazon S3",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "In the search bar, type S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open S3."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Stay in the eu-west-2 Region for this lab."
          }
        ],
        "note": "S3 bucket names are globally unique. Add your AWS account ID to the bucket name.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a private S3 bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "For Bucket name, enter saa-s3-task7-private-[account-id]."
          },
          {
            "id": "console-step-3-item-3",
            "text": "For AWS Region, choose Europe (London) eu-west-2."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Leave Object Ownership as ACLs disabled."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Leave Block all public access turned on."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose Create bucket."
          }
        ],
        "note": null,
        "warning": "Do not turn off Block Public Access for this lab.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Upload a small test file",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the bucket you created."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Create a small text file on your computer named private-test.txt."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Add simple text inside it, such as This should not be public."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Upload the file."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Open the object and copy the Object URL."
          }
        ],
        "note": "The Object URL is what you will test in another browser.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Add the bucket policy that blocks public reads",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Permissions tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Scroll to Bucket policy."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Add a policy that denies s3:GetObject when the requester is not from your AWS account."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Replace [bucket-name] with your bucket name."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Replace [account-id] with your AWS account ID."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Choose Save changes."
          }
        ],
        "note": "This policy protects object reads from anonymous users and other AWS accounts.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test the public access result",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open a different browser, private window, or incognito window."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Paste the object URL for private-test.txt."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Press Enter."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Expected result: the file does not open publicly."
          },
          {
            "id": "console-step-6-item-5",
            "text": "You should see an error such as AccessDenied."
          }
        ],
        "note": "This proves anonymous public access is blocked.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down the lab resources",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the S3 bucket."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete private-test.txt."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open the Permissions tab."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the bucket policy if it still exists."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Go back to the S3 bucket list."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Select the lab bucket."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Type the bucket name when AWS asks for confirmation."
          },
          {
            "id": "console-step-7-item-9",
            "text": "Choose Delete bucket."
          }
        ],
        "note": null,
        "warning": "Delete the object before deleting the bucket. S3 buckets must be empty before deletion.",
        "expectedResult": "Step 7 completed successfully."
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
        "title": "Set lab variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "export AWS_REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "export BUCKET=saa-s3-task7-private-$ACCOUNT_ID"
          }
        ],
        "note": "Expected: the bucket name uses your AWS account ID to make it globally unique.",
        "warning": null,
        "expectedResult": "Expected: the bucket name uses your AWS account ID to make it globally unique."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the S3 bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $AWS_REGION --create-bucket-configuration LocationConstraint=$AWS_REGION"
          }
        ],
        "note": "Expected: AWS creates the bucket in eu-west-2.",
        "warning": null,
        "expectedResult": "Expected: AWS creates the bucket in eu-west-2."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Keep Block Public Access enabled",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
          }
        ],
        "note": "Expected: all four bucket-level Block Public Access settings are enabled.",
        "warning": null,
        "expectedResult": "Expected: all four bucket-level Block Public Access settings are enabled."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Upload a test file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "echo 'This should not be public' > private-test.txt"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "aws s3 cp private-test.txt s3://$BUCKET/private-test.txt"
          }
        ],
        "note": "Expected: the file uploads to the bucket.",
        "warning": null,
        "expectedResult": "Expected: the file uploads to the bucket."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the deny bucket policy file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "cat > deny-public-read-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"DenyObjectReadsOutsideThisAccount\",\n      \"Effect\": \"Deny\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::$BUCKET/*\",\n      \"Condition\": {\n        \"StringNotEquals\": {\n          \"aws:PrincipalAccount\": \"$ACCOUNT_ID\"\n        }\n      }\n    }\n  ]\n}\nEOF"
          }
        ],
        "note": "This policy denies object reads from anonymous users and other AWS accounts.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Attach the bucket policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-policy --bucket $BUCKET --policy file://deny-public-read-policy.json"
          }
        ],
        "note": "Expected: the policy attaches to the bucket.",
        "warning": null,
        "expectedResult": "Expected: the policy attaches to the bucket."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Test the public object URL",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "echo https://$BUCKET.s3.$AWS_REGION.amazonaws.com/private-test.txt"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "curl -i https://$BUCKET.s3.$AWS_REGION.amazonaws.com/private-test.txt"
          }
        ],
        "note": "Expected: the public request fails with AccessDenied or a similar 403 response.",
        "warning": null,
        "expectedResult": "Expected: the public request fails with AccessDenied or a similar 403 response."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Verify the policy and Block Public Access settings",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-policy --bucket $BUCKET --query Policy --output text"
          },
          {
            "id": "cli-step-9-cmd-2",
            "language": "bash",
            "text": "aws s3api get-public-access-block --bucket $BUCKET"
          }
        ],
        "note": "Expected: the policy exists and Block Public Access shows true for all four settings.",
        "warning": null,
        "expectedResult": "Expected: the policy exists and Block Public Access shows true for all four settings."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Tear down the lab resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-bucket-policy --bucket $BUCKET"
          },
          {
            "id": "cli-step-10-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET/private-test.txt"
          },
          {
            "id": "cli-step-10-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region $AWS_REGION"
          },
          {
            "id": "cli-step-10-cmd-4",
            "language": "bash",
            "text": "rm -f private-test.txt deny-public-read-policy.json"
          }
        ],
        "note": "Expected: the bucket, object, local file, and policy file are removed.",
        "warning": null,
        "expectedResult": "Expected: the bucket, object, local file, and policy file are removed."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "verify-7",
        "text": "Verify lifecycle configuration rules and object transition rules in the S3 console."
      },
      {
        "id": "verify-8",
        "text": "Confirm EventBridge or SNS/SQS event notifications are triggered on S3 object uploads."
      },
      {
        "id": "verify-9",
        "text": "Verify S3 Storage Lens dashboard or CloudWatch metrics reflect storage usage data."
      },
      {
        "id": "verify-10",
        "text": "Confirm all S3 verification checks pass for Add a bucket policy that blocks public access."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Bucket policy",
        "body": "A bucket policy controls access at the bucket level. It can allow or deny actions on the bucket and objects."
      },
      {
        "id": "cs-2",
        "title": "Public access",
        "body": "Public access means anonymous internet users can reach the bucket or object without signing in to AWS."
      },
      {
        "id": "cs-3",
        "title": "Explicit deny",
        "body": "Explicit deny wins over allow. This is one of the most important IAM rules."
      },
      {
        "id": "cs-4",
        "title": "Block Public Access",
        "body": "Block Public Access helps stop public access from bucket policies and ACLs. Keep it on unless there is a clear reason."
      },
      {
        "id": "cs-5",
        "title": "Personal lab permissions",
        "body": "AdministratorAccess is okay for a personal lab. Real companies should use least privilege only."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Bucket name already exists",
        "body": "S3 bucket names are globally unique. Add your account ID or a short random number to the name."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied when adding policy",
        "body": "Your lab identity probably lacks s3:PutBucketPolicy. Use a lab admin role or add least privilege permissions."
      },
      {
        "id": "ts-3",
        "title": "Object URL still opens",
        "body": "Check that you are testing in a private browser window. Also check the bucket policy, object permissions, and Block Public Access settings."
      },
      {
        "id": "ts-4",
        "title": "Cannot delete bucket",
        "body": "The bucket must be empty first. Delete the object, then delete the bucket policy, then delete the bucket."
      },
      {
        "id": "ts-5",
        "title": "Policy has wrong account ID",
        "body": "Run aws sts get-caller-identity and use the returned account ID in the policy condition."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Deny beats allow",
        "body": "If an explicit deny matches, the request fails even if another policy allows it."
      },
      {
        "id": "trap-2",
        "title": "Bucket policy is not IAM policy",
        "body": "A bucket policy is attached to the bucket. An IAM policy is attached to a user, group, or role."
      },
      {
        "id": "trap-3",
        "title": "Block Public Access is a safety layer",
        "body": "Block Public Access can override public ACLs and public bucket policies. It is not the same thing as encryption."
      },
      {
        "id": "trap-4",
        "title": "Private by default",
        "body": "New S3 buckets and objects are private by default. Public access must be deliberately granted."
      },
      {
        "id": "trap-5",
        "title": "Object URL does not mean public",
        "body": "An object can have a URL and still be private. The request still needs permission."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Deny is a locked door. If the deny matches, no allow can open it.",
    "flashcardSetId": "s3_task_7_flashcards"
  },
  {
    "id": "task-saa-s3-turn-on-block-public-access-for-an-s3-bucket-008",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Turn on Block Public Access for an S3 bucket",
    "slug": "turn-on-block-public-access-for-an-s3-bucket",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Turn on S3 Block Public Access for a bucket and confirm public object links fail.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Block Public Access",
        "body": "S3 Block Public Access is a safety control. It can block public ACLs and public bucket policies."
      },
      {
        "id": "concept-2",
        "title": "Bucket-level setting",
        "body": "This lab turns on Block Public Access for one bucket. Account-level settings can also block public access across all buckets."
      },
      {
        "id": "concept-3",
        "title": "Public link test",
        "body": "A public S3 object URL should fail after Block Public Access is enabled."
      },
      {
        "id": "concept-4",
        "title": "IAM permissions",
        "body": "For a personal lab account, an admin user or lab admin role is okay. In a real company, use least privilege only. Do not use the root user for normal labs."
      }
    ],
    "whyItMatters": "This helps you understand how AWS protects S3 data from accidental public exposure.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task8-bpa-[account-id]"
      },
      {
        "label": "Object key",
        "value": "s3-task8-test.txt"
      },
      {
        "label": "Public URL format",
        "value": "https://saa-s3-task8-bpa-[account-id].s3.eu-west-2.amazonaws.com/s3-task8-test.txt"
      },
      {
        "label": "IAM permissions needed",
        "value": "sts:GetCallerIdentity, s3:CreateBucket, s3:PutBucketPublicAccessBlock, s3:GetBucketPublicAccessBlock, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:DeleteBucketPolicy, s3:PutObject, s3:GetObject, s3:ListBucket, s3:DeleteObject, s3:DeleteBucket"
      },
      {
        "label": "Personal lab permission option",
        "value": "AdministratorAccess is acceptable while learning in a personal lab account."
      },
      {
        "label": "Real company permission option",
        "value": "Use least privilege permissions only. Do not use the root user."
      }
    ],
    "costWarning": "This task should cost very little. You create one small S3 bucket and one small text file. Delete the object and bucket after the lab.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "In a real company, use least privilege permissions only."
          },
          {
            "id": "console-step-1-item-4",
            "text": "Confirm the identity can create S3 buckets, upload objects, edit bucket policies, and edit Block Public Access settings."
          }
        ],
        "note": null,
        "warning": "Do not use your root user for normal labs. Use an IAM user, IAM role, or IAM Identity Center permission set.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open Amazon S3",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Search for S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open Amazon S3."
          }
        ],
        "note": "S3 is a global console, but the bucket will still be created in a chosen Region.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the test bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "For Bucket type, choose General purpose."
          },
          {
            "id": "console-step-3-item-3",
            "text": "For Bucket name, enter saa-s3-task8-bpa-[account-id]."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For AWS Region, choose Europe (London) eu-west-2."
          },
          {
            "id": "console-step-3-item-5",
            "text": "In Object Ownership, keep ACLs disabled."
          },
          {
            "id": "console-step-3-item-6",
            "text": "In Block Public Access settings for this bucket, clear Block all public access for the first test only."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Tick the acknowledgement box."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Choose Create bucket."
          }
        ],
        "note": null,
        "warning": "This briefly allows you to test a public bucket policy. Do not use real data.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Upload a test file",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the new bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Add files."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Upload a small text file named s3-task8-test.txt."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Upload."
          }
        ],
        "note": "The file should contain harmless text only, such as 'S3 public test file'.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Add a temporary public read policy",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Permissions tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Scroll to Bucket policy."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Add a policy that allows public s3:GetObject for arn:aws:s3:::saa-s3-task8-bpa-[account-id]/*."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Choose Save changes."
          }
        ],
        "note": null,
        "warning": "This is only for the lab test. Public S3 access is usually a security risk.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Confirm the public link works first",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the uploaded object."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Copy the Object URL."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open the URL in a private browser window or another browser."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Confirm the file opens before Block Public Access is turned on."
          }
        ],
        "note": "This proves the later failure is caused by Block Public Access.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Turn on Block Public Access",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose the Permissions tab."
          },
          {
            "id": "console-step-7-item-3",
            "text": "In Block public access, choose Edit."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Tick Block all public access."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Choose Save changes."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Type confirm if AWS asks for confirmation."
          }
        ],
        "note": "This enables the bucket-level protection settings.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Confirm the public link now fails",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open the same object URL again in a private browser window or another browser."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Refresh the page."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Expected result: the request fails with AccessDenied, 403 Forbidden, or an XML error page."
          }
        ],
        "note": "The object still exists. The public path is blocked.",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Tear down the lab resources",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Choose the Permissions tab."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Delete the temporary public bucket policy."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Open the Objects tab."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Select s3-task8-test.txt."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-9-item-7",
            "text": "Return to the S3 bucket list."
          },
          {
            "id": "console-step-9-item-8",
            "text": "Select the bucket."
          },
          {
            "id": "console-step-9-item-9",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-9-item-10",
            "text": "Type the bucket name to confirm deletion."
          }
        ],
        "note": null,
        "warning": "Delete the public policy before deleting the bucket so cleanup is clear and safe.",
        "expectedResult": "Step 9 completed successfully."
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
        "title": "Set lab variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "$ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "$REGION = \"eu-west-2\""
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "$BUCKET = \"saa-s3-task8-bpa-$ACCOUNT_ID\""
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "$KEY = \"s3-task8-test.txt\""
          }
        ],
        "note": "Expected: these variables store your account ID, Region, bucket name, and object key.",
        "warning": null,
        "expectedResult": "Expected: these variables store your account ID, Region, bucket name, and object key."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the bucket with Block Public Access off for the first test",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-public-access-block --bucket $BUCKET"
          }
        ],
        "note": null,
        "warning": "This is only to create a controlled public-link test. Do not upload private data.",
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Upload a harmless test file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "Set-Content -Path .\\s3-task8-test.txt -Value \"S3 public test file\""
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws s3api put-object --bucket $BUCKET --key $KEY --body .\\s3-task8-test.txt --content-type text/plain"
          }
        ],
        "note": "Expected: AWS returns object metadata such as an ETag.",
        "warning": null,
        "expectedResult": "Expected: AWS returns object metadata such as an ETag."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Add a temporary public read bucket policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "$policy = @'\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"PublicReadForTask8TestOnly\",\n      \"Effect\": \"Allow\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::BUCKET_NAME/*\"\n    }\n  ]\n}\n'@"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "$policy = $policy.Replace(\"BUCKET_NAME\", $BUCKET)"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "Set-Content -Path .\\public-read-policy.json -Value $policy"
          },
          {
            "id": "cli-step-5-cmd-4",
            "language": "bash",
            "text": "aws s3api put-bucket-policy --bucket $BUCKET --policy file://public-read-policy.json"
          }
        ],
        "note": null,
        "warning": "This policy is public. It is temporary and must be removed during cleanup.",
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Confirm the public link works before blocking it",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "$URL = \"https://$BUCKET.s3.$REGION.amazonaws.com/$KEY\""
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "Write-Host $URL"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "curl.exe -i $URL"
          }
        ],
        "note": "Expected before blocking: HTTP 200 OK and the test file text.",
        "warning": null,
        "expectedResult": "Expected before blocking: HTTP 200 OK and the test file text."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Turn on Block Public Access for the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
          }
        ],
        "note": "Expected: the command succeeds with no output.",
        "warning": null,
        "expectedResult": "Expected: the command succeeds with no output."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Check the Block Public Access settings",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3api get-public-access-block --bucket $BUCKET"
          }
        ],
        "note": "Expected: all four settings show true.",
        "warning": null,
        "expectedResult": "Expected: all four settings show true."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Confirm the public link now fails",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "curl.exe -i $URL"
          }
        ],
        "note": "Expected after blocking: HTTP 403 Forbidden or AccessDenied.",
        "warning": null,
        "expectedResult": "Expected after blocking: HTTP 403 Forbidden or AccessDenied."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Tear down the lab resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-bucket-policy --bucket $BUCKET"
          },
          {
            "id": "cli-step-10-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-object --bucket $BUCKET --key $KEY"
          },
          {
            "id": "cli-step-10-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET"
          },
          {
            "id": "cli-step-10-cmd-4",
            "language": "bash",
            "text": "Remove-Item .\\s3-task8-test.txt, .\\public-read-policy.json -ErrorAction SilentlyContinue"
          }
        ],
        "note": "Expected: the bucket, object, policy, and local test files are removed.",
        "warning": null,
        "expectedResult": "Expected: the bucket, object, policy, and local test files are removed."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "verify-7",
        "text": "Verify lifecycle configuration rules and object transition rules in the S3 console."
      },
      {
        "id": "verify-8",
        "text": "Confirm EventBridge or SNS/SQS event notifications are triggered on S3 object uploads."
      },
      {
        "id": "verify-9",
        "text": "Verify S3 Storage Lens dashboard or CloudWatch metrics reflect storage usage data."
      },
      {
        "id": "verify-10",
        "text": "Confirm all S3 verification checks pass for Turn on Block Public Access for an S3 bucket."
      },
      {
        "id": "verify-11",
        "text": "Confirm all S3 verification checks pass for Turn on Block Public Access for an S3 bucket."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Block Public Access wins",
        "body": "S3 Block Public Access can override public bucket policies and public ACLs."
      },
      {
        "id": "cs-2",
        "title": "Four settings",
        "body": "The settings are BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, and RestrictPublicBuckets."
      },
      {
        "id": "cs-3",
        "title": "Bucket policy risk",
        "body": "A public bucket policy can expose objects to the internet if Block Public Access is not stopping it."
      },
      {
        "id": "cs-4",
        "title": "Best default",
        "body": "Keep Block Public Access on unless you have a clear public hosting use case."
      },
      {
        "id": "cs-5",
        "title": "Permissions",
        "body": "You need permission to edit the bucket public access block and bucket policy."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Public link fails before the test",
        "body": "The bucket may still have Block Public Access enabled at the account level. Account-level settings can be more restrictive."
      },
      {
        "id": "ts-2",
        "title": "Bucket policy save fails",
        "body": "BlockPublicPolicy may already be enabled. Turn it off only for the short test, or use a different lab account."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied after enabling BPA",
        "body": "This is the expected result. It proves public access is blocked."
      },
      {
        "id": "ts-4",
        "title": "Delete bucket fails",
        "body": "The bucket must be empty before deletion. Delete the object first."
      },
      {
        "id": "ts-5",
        "title": "CLI AccessDenied",
        "body": "Your CLI identity does not have enough S3 permissions. Use a lab admin identity or add least privilege permissions."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Bucket policy is not enough",
        "body": "A bucket policy can allow access, but Block Public Access can still block the public request."
      },
      {
        "id": "trap-2",
        "title": "Account-level setting",
        "body": "Account-level Block Public Access can affect buckets even when the bucket setting looks different."
      },
      {
        "id": "trap-3",
        "title": "ACL confusion",
        "body": "Modern S3 buckets usually use ACLs disabled. Use bucket policies and IAM policies instead."
      },
      {
        "id": "trap-4",
        "title": "Website hosting trap",
        "body": "Public static website hosting usually needs public read access. Block Public Access can stop that."
      },
      {
        "id": "trap-5",
        "title": "Private link confusion",
        "body": "A normal S3 object URL is not a presigned URL. A presigned URL uses signed temporary access."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "BPA means Block Public Access. If the bucket shouts public, BPA says no.",
    "flashcardSetId": "s3_task_8_flashcards"
  },
  {
    "id": "task-saa-s3-create-a-read-only-s3-iam-user-009",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Create a read-only S3 IAM user",
    "slug": "create-a-read-only-s3-iam-user",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "Global IAM, S3 test in eu-west-2",
    "goal": "Goal: Create an IAM user with S3 read-only permissions and test listing buckets with the AWS CLI.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "IAM users",
        "body": "An IAM user is a named identity in your AWS account. It can be given permissions by attaching policies."
      },
      {
        "id": "concept-2",
        "title": "Access keys",
        "body": "Access keys let the AWS CLI sign requests as the IAM user. Treat them like passwords."
      },
      {
        "id": "concept-3",
        "title": "Read-only S3",
        "body": "Read-only S3 access can list buckets and read objects. It should not allow uploads, deletes, or bucket changes."
      },
      {
        "id": "concept-4",
        "title": "Least privilege",
        "body": "Give the user only the actions needed. For this lab, the test user only needs to list S3 buckets."
      }
    ],
    "whyItMatters": "This shows how IAM controls what a CLI user can do with Amazon S3.",
    "values": [
      {
        "label": "Source JSON path",
        "value": "content_source/SAA/guides/s3/task-9.json"
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "IAM user name",
        "value": "saa-s3-task9-readonly-user"
      },
      {
        "label": "IAM policy name",
        "value": "saa-s3-task9-readonly-list-policy"
      },
      {
        "label": "CLI profile for test user",
        "value": "s3-task9-readonly"
      },
      {
        "label": "Required permissions summary",
        "value": "IAM user setup, IAM policy setup, S3 list test, identity check, and cleanup permissions. Exact actions are grouped in Console step 0."
      }
    ],
    "costWarning": "IAM users, policies, and access keys have no direct cost. Delete the access key and IAM user after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "IAM user permissions: iam:CreateUser, iam:GetUser, iam:CreateAccessKey, iam:ListAccessKeys, iam:DeleteAccessKey, iam:DeleteUser"
          },
          {
            "id": "console-step-1-item-7",
            "text": "IAM policy permissions: iam:CreatePolicy, iam:GetPolicy, iam:GetPolicyVersion, iam:AttachUserPolicy, iam:ListAttachedUserPolicies, iam:DetachUserPolicy, iam:DeletePolicy"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 test permissions: s3:ListAllMyBuckets, s3:GetBucketLocation"
          },
          {
            "id": "console-step-1-item-9",
            "text": "These permissions let you create the IAM user, attach a read-only policy, test S3 listing, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open IAM",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Search for IAM."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open IAM."
          }
        ],
        "note": "IAM is a global service. You do not choose a Region for IAM.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the read-only IAM policy",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In IAM, choose Policies."
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
            "text": "Create a policy that allows s3:ListAllMyBuckets and s3:GetBucketLocation."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Name the policy saa-s3-task9-readonly-list-policy."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose Create policy."
          }
        ],
        "note": "This policy is enough to test aws s3 ls.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the IAM user",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In IAM, choose Users."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create user."
          },
          {
            "id": "console-step-4-item-3",
            "text": "For User name, enter saa-s3-task9-readonly-user."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Do not give console access for this lab."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Attach the policy saa-s3-task9-readonly-list-policy."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Create the user."
          }
        ],
        "note": null,
        "warning": "This user is for CLI testing only.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create an access key",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the new user."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Security credentials tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Under Access keys, choose Create access key."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Command Line Interface (CLI)."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Create the access key."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Copy the Access key ID and Secret access key."
          }
        ],
        "note": null,
        "warning": "You can only view the secret access key once. Delete it after the lab.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test from a separate CLI profile",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open your terminal."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Configure a profile named s3-task9-readonly using the new access key."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Run aws s3 ls --profile s3-task9-readonly."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Expected: the command lists buckets, or returns an empty list if the account has no buckets."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Try a write action only if you want to test denial. It should fail."
          }
        ],
        "note": "A successful list test proves the IAM user can read S3 bucket names.",
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
            "text": "Delete the access key from the IAM user."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Detach saa-s3-task9-readonly-list-policy from the user."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the IAM user saa-s3-task9-readonly-user."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the IAM policy saa-s3-task9-readonly-list-policy."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Remove the local CLI profile if you no longer need it."
          }
        ],
        "note": null,
        "warning": "Delete access keys first. This stops the test user from using the CLI.",
        "expectedResult": "Step 7 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the lab admin identity.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the lab admin identity."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "USER_NAME=saa-s3-task9-readonly-user"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "POLICY_NAME=saa-s3-task9-readonly-list-policy"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "POLICY_ARN=arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"
          }
        ],
        "note": "These variables make the commands shorter.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the IAM user",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws iam create-user --user-name \"$USER_NAME\""
          }
        ],
        "note": "Expected: AWS returns the new IAM user details.",
        "warning": null,
        "expectedResult": "Expected: AWS returns the new IAM user details."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the read-only S3 list policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws iam create-policy --policy-name \"$POLICY_NAME\" --policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:ListAllMyBuckets\",\"s3:GetBucketLocation\"],\"Resource\":\"*\"}]}'"
          }
        ],
        "note": "This policy allows bucket listing only.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Attach the policy to the user",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws iam attach-user-policy --user-name \"$USER_NAME\" --policy-arn \"$POLICY_ARN\""
          }
        ],
        "note": "Expected: no output means the attach worked.",
        "warning": null,
        "expectedResult": "Expected: no output means the attach worked."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create an access key for the user",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws iam create-access-key --user-name \"$USER_NAME\""
          }
        ],
        "note": "Copy the AccessKeyId and SecretAccessKey. You need them for the next step.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Configure the read-only CLI profile",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws configure --profile s3-task9-readonly"
          }
        ],
        "note": "Enter the access key values from the previous step. Use eu-west-2 as the default Region.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Test listing buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3 ls --profile s3-task9-readonly"
          }
        ],
        "note": "Expected: buckets are listed, or no output if the account has no buckets.",
        "warning": null,
        "expectedResult": "Expected: buckets are listed, or no output if the account has no buckets."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Optional denial test",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3 mb s3://saa-s3-task9-denied-test-$ACCOUNT_ID --region eu-west-2 --profile s3-task9-readonly"
          }
        ],
        "note": "Expected: AccessDenied. The read-only user should not create buckets.",
        "warning": null,
        "expectedResult": "Expected: AccessDenied. The read-only user should not create buckets."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Tear down the access key",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "ACCESS_KEY_ID=$(aws iam list-access-keys --user-name \"$USER_NAME\" --query 'AccessKeyMetadata[0].AccessKeyId' --output text)"
          },
          {
            "id": "cli-step-10-cmd-2",
            "language": "bash",
            "text": "aws iam delete-access-key --user-name \"$USER_NAME\" --access-key-id \"$ACCESS_KEY_ID\""
          }
        ],
        "note": "Delete the access key before deleting the user.",
        "warning": null,
        "expectedResult": "CLI command step 10 executed successfully."
      },
      {
        "id": "cli-step-11",
        "number": 11,
        "title": "Tear down the user and policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-11-cmd-1",
            "language": "bash",
            "text": "aws iam detach-user-policy --user-name \"$USER_NAME\" --policy-arn \"$POLICY_ARN\""
          },
          {
            "id": "cli-step-11-cmd-2",
            "language": "bash",
            "text": "aws iam delete-user --user-name \"$USER_NAME\""
          },
          {
            "id": "cli-step-11-cmd-3",
            "language": "bash",
            "text": "aws iam delete-policy --policy-arn \"$POLICY_ARN\""
          }
        ],
        "note": "Dependency order: access key, detach policy, user, policy.",
        "warning": null,
        "expectedResult": "CLI command step 11 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the S3 bucket is listed and accessible in the S3 console."
      },
      {
        "id": "verify-2",
        "text": "Verify that GetBucketLocation or bucket properties confirm the Region is 'Global IAM, S3 test in eu-west-2'."
      },
      {
        "id": "verify-3",
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      },
      {
        "id": "cleanup-5",
        "text": "Clean up all remaining S3 artifacts and storage configurations created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "IAM user",
        "body": "IAM user = identity that can use permissions and access keys."
      },
      {
        "id": "cs-2",
        "title": "Access key",
        "body": "Access key = CLI password pair. Protect it and delete it after use."
      },
      {
        "id": "cs-3",
        "title": "Read-only S3 list",
        "body": "s3:ListAllMyBuckets lets the user run aws s3 ls."
      },
      {
        "id": "cs-4",
        "title": "Least privilege",
        "body": "Give only the actions needed for the task."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied on list",
        "body": "The read-only user may not have s3:ListAllMyBuckets. Check the attached policy."
      },
      {
        "id": "ts-2",
        "title": "Invalid access key",
        "body": "Reconfigure the CLI profile. Make sure the secret key was copied correctly."
      },
      {
        "id": "ts-3",
        "title": "Wrong profile used",
        "body": "Add --profile s3-task9-readonly to the test command."
      },
      {
        "id": "ts-4",
        "title": "Cannot delete policy",
        "body": "Detach the policy from the user before deleting the policy."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "IAM policy vs bucket policy",
        "body": "IAM policy attaches to an identity. Bucket policy attaches to a bucket."
      },
      {
        "id": "trap-2",
        "title": "Read-only is not write",
        "body": "Read-only S3 should not allow uploads, deletes, or bucket configuration changes."
      },
      {
        "id": "trap-3",
        "title": "Access keys are risky",
        "body": "For real workloads, prefer roles over long-term IAM user access keys."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "User + policy + key = CLI identity. The policy says what the key can do.",
    "flashcardSetId": "s3_task_9_flashcards"
  },
  {
    "id": "task-saa-s3-turn-on-default-sse-s3-encryption-010",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Turn on default SSE-S3 encryption",
    "slug": "turn-on-default-sse-s3-encryption",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Turn on default SSE-S3 encryption for an S3 bucket and upload a test file.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "SSE-S3",
        "body": "SSE-S3 means Amazon S3 encrypts objects at rest using S3 managed keys."
      },
      {
        "id": "concept-2",
        "title": "Default bucket encryption",
        "body": "Default encryption tells S3 what encryption type to apply to new uploaded objects."
      },
      {
        "id": "concept-3",
        "title": "Modern S3 default",
        "body": "Amazon S3 encrypts new objects with SSE-S3 by default. This lab shows how to view and set the bucket configuration."
      },
      {
        "id": "concept-4",
        "title": "Object check",
        "body": "Use the object details or head-object to confirm the uploaded file shows AES256."
      }
    ],
    "whyItMatters": "Encryption at rest is a common security requirement and a common exam topic.",
    "values": [
      {
        "label": "Source JSON path",
        "value": "content_source/SAA/guides/s3/task-10.json"
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task10-sse-s3-[account-id]"
      },
      {
        "label": "Test file",
        "value": "sse-s3-test.txt"
      },
      {
        "label": "Expected encryption",
        "value": "AES256 / SSE-S3"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, public access block, encryption configuration, object upload, object verification, identity check, and cleanup permissions. Exact actions are grouped in Console step 0."
      }
    ],
    "costWarning": "This lab should cost very little. S3 storage and requests can create small charges. Delete the object and bucket after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 public access block permissions: s3:PutBucketPublicAccessBlock, s3:GetBucketPublicAccessBlock"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 encryption permissions: s3:PutEncryptionConfiguration, s3:GetEncryptionConfiguration"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-11",
            "text": "These permissions let you create the bucket, enable SSE-S3, upload a file, verify encryption, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open Amazon S3",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Search for S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open Amazon S3."
          }
        ],
        "note": "Use Region eu-west-2 for this lab.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the S3 bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "For AWS Region, choose Europe (London) eu-west-2."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Use bucket name saa-s3-task10-sse-s3-[account-id]."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep Block all public access turned on."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Create the bucket."
          }
        ],
        "note": "S3 bucket names must be globally unique.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Turn on default SSE-S3 encryption",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose the Properties tab."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Find Default encryption."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Server-side encryption with Amazon S3 managed keys (SSE-S3)."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Save the changes."
          }
        ],
        "note": "SSE-S3 uses S3 managed keys. You do not choose a KMS key.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Upload a test file",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Create a small file on your computer named sse-s3-test.txt."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Open the bucket Objects tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Add the file."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose Upload."
          }
        ],
        "note": "New uploads should use the bucket default encryption setting.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Verify the object encryption",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the uploaded object."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Check the object details."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Find Server-side encryption."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Expected: it shows Amazon S3 managed keys (SSE-S3) or AES-256."
          }
        ],
        "note": "AES-256 is the encryption algorithm used by SSE-S3.",
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
            "text": "Open the bucket."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete sse-s3-test.txt."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Go back to the bucket list."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the bucket saa-s3-task10-sse-s3-[account-id]."
          }
        ],
        "note": null,
        "warning": "The bucket must be empty before you delete it.",
        "expectedResult": "Step 7 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "BUCKET_NAME=saa-s3-task10-sse-s3-$ACCOUNT_ID"
          }
        ],
        "note": "This creates a unique bucket name using your account ID.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket \"$BUCKET_NAME\" --region \"$REGION\" --create-bucket-configuration LocationConstraint=\"$REGION\""
          }
        ],
        "note": "Expected: AWS returns the bucket location.",
        "warning": null,
        "expectedResult": "Expected: AWS returns the bucket location."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Keep public access blocked",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket \"$BUCKET_NAME\" --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
          }
        ],
        "note": "This keeps the lab bucket private.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Turn on SSE-S3 default encryption",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-encryption --bucket \"$BUCKET_NAME\" --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"AES256\"}}]}'"
          }
        ],
        "note": "AES256 means SSE-S3.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Check the bucket encryption setting",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-encryption --bucket \"$BUCKET_NAME\""
          }
        ],
        "note": "Expected: the response includes \"SSEAlgorithm\": \"AES256\".",
        "warning": null,
        "expectedResult": "Expected: the response includes \"SSEAlgorithm\": \"AES256\"."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Create and upload a test file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "printf 'SSE-S3 test file\\n' > sse-s3-test.txt"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws s3 cp sse-s3-test.txt s3://$BUCKET_NAME/sse-s3-test.txt"
          }
        ],
        "note": "The object should use the bucket default encryption.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Verify the uploaded object encryption",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3api head-object --bucket \"$BUCKET_NAME\" --key sse-s3-test.txt --query ServerSideEncryption --output text"
          }
        ],
        "note": "Expected: AES256.",
        "warning": null,
        "expectedResult": "Expected: AES256."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Tear down the object and bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET_NAME/sse-s3-test.txt"
          },
          {
            "id": "cli-step-9-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket \"$BUCKET_NAME\" --region \"$REGION\""
          },
          {
            "id": "cli-step-9-cmd-3",
            "language": "bash",
            "text": "rm -f sse-s3-test.txt"
          }
        ],
        "note": "Dependency order: delete object, delete bucket, remove local test file.",
        "warning": null,
        "expectedResult": "CLI command step 9 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "SSE-S3",
        "body": "SSE-S3 = S3 managed encryption keys."
      },
      {
        "id": "cs-2",
        "title": "AES256",
        "body": "AES256 in CLI output means SSE-S3."
      },
      {
        "id": "cs-3",
        "title": "Default encryption",
        "body": "Default encryption applies to new uploaded objects."
      },
      {
        "id": "cs-4",
        "title": "No KMS key",
        "body": "SSE-S3 does not need a customer KMS key."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Bucket name already exists",
        "body": "S3 bucket names are globally unique. Add your account ID or initials."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied on encryption",
        "body": "The identity needs s3:PutEncryptionConfiguration."
      },
      {
        "id": "ts-3",
        "title": "NoSuchBucket",
        "body": "Check the bucket name and Region."
      },
      {
        "id": "ts-4",
        "title": "Bucket delete fails",
        "body": "Empty the bucket first. Then delete the bucket."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "SSE-S3 vs SSE-KMS",
        "body": "SSE-S3 uses S3 managed keys. SSE-KMS uses AWS KMS keys."
      },
      {
        "id": "trap-2",
        "title": "Default applies to new objects",
        "body": "Changing default encryption affects new uploads, not old objects already stored."
      },
      {
        "id": "trap-3",
        "title": "Encryption is not public access",
        "body": "Encryption protects data at rest. It does not control who can access the object."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "SSE-S3 = S3 secures storage. S3 manages the keys and encrypts the object at rest.",
    "flashcardSetId": "s3_task_10_flashcards"
  },
  {
    "id": "task-saa-s3-switch-default-encryption-to-sse-kms-011",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Switch default encryption to SSE-KMS",
    "slug": "switch-default-encryption-to-sse-kms",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Switch default bucket encryption to SSE-KMS, upload a test file, and check which KMS key is used.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "SSE-KMS",
        "body": "SSE-KMS means S3 encrypts objects by using an AWS KMS key."
      },
      {
        "id": "concept-2",
        "title": "Default encryption",
        "body": "Default encryption applies to new objects after the setting is saved."
      },
      {
        "id": "concept-3",
        "title": "KMS key check",
        "body": "The object metadata can show aws:kms and the KMS key ID used."
      }
    ],
    "whyItMatters": "This is common in secure storage designs. The exam may ask which encryption option gives KMS control and audit visibility.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task11-kms-[account-id]"
      },
      {
        "label": "KMS alias",
        "value": "alias/saa-s3-task11-key"
      },
      {
        "label": "Test object",
        "value": "kms-test.txt"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, S3 bucket setup, S3 default encryption config, S3 object test, KMS key setup, and cleanup. Exact actions are listed in Console step 0."
      }
    ],
    "costWarning": "This lab should cost very little. A customer managed KMS key can create a small monthly charge if left active. Delete the bucket and schedule key deletion when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "KMS key permissions: kms:CreateKey, kms:CreateAlias, kms:DescribeKey, kms:ListAliases"
          },
          {
            "id": "console-step-1-item-7",
            "text": "KMS data permissions: kms:Encrypt, kms:Decrypt, kms:GenerateDataKey"
          },
          {
            "id": "console-step-1-item-8",
            "text": "KMS cleanup permissions: kms:ScheduleKeyDeletion"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 encryption permissions: s3:PutEncryptionConfiguration, s3:GetEncryptionConfiguration"
          },
          {
            "id": "console-step-1-item-11",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:GetObjectAttributes, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-12",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-13",
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
        "title": "Create the KMS key",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open KMS."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Customer managed keys."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create key."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Symmetric."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Name the alias alias/saa-s3-task11-key."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Allow your lab identity to administer and use the key."
          }
        ],
        "note": "This makes the key easy to identify when you check the uploaded object.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the S3 bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create bucket saa-s3-task11-kms-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Keep Block all public access turned on."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep ACLs disabled."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Turn on SSE-KMS default encryption",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Properties."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Under Default encryption, choose Edit."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose AWS Key Management Service key (SSE-KMS)."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Choose from your AWS KMS keys."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Select alias/saa-s3-task11-key."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Save changes."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Upload a test file",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Create a small file called kms-test.txt on your computer."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Upload it to the bucket."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Open the object."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Check the object encryption details."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Confirm the KMS key shown is alias/saa-s3-task11-key or its key ID."
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
            "text": "Delete kms-test.txt from the bucket."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the S3 bucket."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open KMS."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Schedule deletion for alias/saa-s3-task11-key."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Use the shortest allowed waiting period for a lab key."
          }
        ],
        "note": null,
        "warning": "Never schedule deletion for a production KMS key.",
        "expectedResult": "Step 6 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "export AWS_REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "export BUCKET=saa-s3-task11-kms-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "export KEY_ALIAS=alias/saa-s3-task11-key"
          }
        ],
        "note": "Expected: variables are set for the lab.",
        "warning": null,
        "expectedResult": "Expected: variables are set for the lab."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the KMS key and alias",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "export KEY_ID=$(aws kms create-key --description \"SAA S3 Task 11 SSE-KMS lab key\" --query KeyMetadata.KeyId --output text)"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws kms create-alias --alias-name $KEY_ALIAS --target-key-id $KEY_ID"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "aws kms describe-key --key-id $KEY_ALIAS"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $AWS_REGION --create-bucket-configuration LocationConstraint=$AWS_REGION"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Set default encryption to SSE-KMS",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-encryption --bucket $BUCKET --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"aws:kms\",\"KMSMasterKeyID\":\"'$KEY_ALIAS'\"},\"BucketKeyEnabled\":true}]}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Upload and check the object key",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "echo \"SSE-KMS test\" > kms-test.txt"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws s3api put-object --bucket $BUCKET --key kms-test.txt --body kms-test.txt"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws s3api head-object --bucket $BUCKET --key kms-test.txt --query '{Encryption:ServerSideEncryption,KMSKey:SSEKMSKeyId,BucketKey:BucketKeyEnabled}'"
          }
        ],
        "note": "Expected: Encryption is aws:kms and KMSKey shows the key used.",
        "warning": null,
        "expectedResult": "Expected: Encryption is aws:kms and KMSKey shows the key used."
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
            "text": "aws s3api delete-object --bucket $BUCKET --key kms-test.txt"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region $AWS_REGION"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "aws kms schedule-key-deletion --key-id $KEY_ALIAS --pending-window-in-days 7"
          }
        ],
        "note": null,
        "warning": "Do not schedule deletion for a production key.",
        "expectedResult": "CLI command step 7 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
        "title": "SSE-S3 vs SSE-KMS",
        "body": "SSE-S3 uses S3 managed keys. SSE-KMS uses AWS KMS keys."
      },
      {
        "id": "cs-2",
        "title": "New objects only",
        "body": "Changing default encryption does not re-encrypt old objects automatically."
      },
      {
        "id": "cs-3",
        "title": "Bucket Keys",
        "body": "S3 Bucket Keys can reduce KMS request cost for SSE-KMS."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied on upload",
        "body": "The identity may lack kms:GenerateDataKey or s3:PutObject."
      },
      {
        "id": "ts-2",
        "title": "Key not visible",
        "body": "Check that the key is in the same Region and your identity can use it."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "SSE-KMS needs KMS permissions",
        "body": "S3 permission alone is not enough when using a customer managed KMS key."
      },
      {
        "id": "trap-2",
        "title": "Default encryption is not retroactive",
        "body": "Objects uploaded before the change keep their existing encryption."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "SSE-KMS = S3 uses a KMS key. Check the object to see which key protected it.",
    "flashcardSetId": "s3_task_11_flashcards"
  },
  {
    "id": "task-saa-s3-turn-on-account-level-block-public-access-012",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Turn on account-level Block Public Access",
    "slug": "turn-on-account-level-block-public-access",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Turn on account-level Block Public Access and test an existing public bucket.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Account-level Block Public Access",
        "body": "This is a central safety setting for the whole AWS account."
      },
      {
        "id": "concept-2",
        "title": "It overrides public access",
        "body": "It can block public bucket policies and public ACLs across buckets."
      },
      {
        "id": "concept-3",
        "title": "Test safely",
        "body": "Use a new lab bucket with harmless test content only."
      }
    ],
    "whyItMatters": "This helps you understand central S3 public access controls. It is a common security exam topic.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Public test bucket",
        "value": "saa-s3-task12-public-[account-id]"
      },
      {
        "label": "Test object",
        "value": "index.html"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, S3 bucket setup, S3 public policy test, account-level Block Public Access config, and cleanup. Exact actions are listed in Console step 0."
      }
    ],
    "costWarning": "This lab should cost very little. The main risk is not cost. The main risk is accidentally changing public access behaviour for other buckets in the account.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 account public access permissions: s3:GetAccountPublicAccessBlock, s3:PutAccountPublicAccessBlock"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 public access permissions: s3:PutPublicAccessBlock, s3:GetPublicAccessBlock, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:DeleteBucketPolicy"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create a public test bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create bucket saa-s3-task12-public-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "For this lab only, turn off Block all public access for this bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Acknowledge the warning."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Upload index.html."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Add a bucket policy that allows public read for objects."
          }
        ],
        "note": null,
        "warning": "Use a lab bucket only. Never expose private data.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Confirm the public link works first",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the object."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Copy the object URL."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Open it in a private browser window."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Confirm the page loads before account-level Block Public Access is turned on."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Turn on account-level Block Public Access",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open S3."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Block Public Access settings for this account."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Turn on Block all public access."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Save changes."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Confirm the change."
          }
        ],
        "note": null,
        "warning": "This affects public access across the whole AWS account.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test the public link again",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the same public object URL in another private browser window."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Confirm the public link now fails."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Expected result: access is denied or the object is no longer publicly reachable."
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
            "text": "Remove the public bucket policy."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete index.html."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the test bucket."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Decide whether to keep account-level Block Public Access on."
          },
          {
            "id": "console-step-6-item-5",
            "text": "For most personal and real accounts, keeping it on is safer."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "export AWS_REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "export BUCKET=saa-s3-task12-public-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create a test public bucket and object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $AWS_REGION --create-bucket-configuration LocationConstraint=$AWS_REGION"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "echo '<h1>Public test before account block</h1>' > index.html"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "aws s3api put-object --bucket $BUCKET --key index.html --body index.html --content-type text/html"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Add a public read bucket policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > public-read-policy.json <<EOF\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadTest\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}\nEOF\naws s3api put-bucket-policy --bucket $BUCKET --policy file://public-read-policy.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Copy the public URL and test it",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "echo https://$BUCKET.s3.$AWS_REGION.amazonaws.com/index.html"
          }
        ],
        "note": "Open the printed URL in a private browser window. It should work before account-level blocking.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Turn on account-level Block Public Access",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3control put-public-access-block --account-id $ACCOUNT_ID --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Check account-level Block Public Access",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3control get-public-access-block --account-id $ACCOUNT_ID"
          }
        ],
        "note": "Expected: all four settings are true.",
        "warning": null,
        "expectedResult": "Expected: all four settings are true."
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
            "text": "aws s3api delete-bucket-policy --bucket $BUCKET"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-object --bucket $BUCKET --key index.html"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region $AWS_REGION"
          }
        ],
        "note": "Leave account-level Block Public Access on unless you intentionally need a different lab setting.",
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Account beats bucket",
        "body": "Account-level Block Public Access can block public access even if a bucket policy allows it."
      },
      {
        "id": "cs-2",
        "title": "Four settings",
        "body": "The main settings block public ACLs, ignore public ACLs, block public policies, and restrict public buckets."
      },
      {
        "id": "cs-3",
        "title": "Best practice",
        "body": "Keep Block Public Access on unless you have a clear reason not to."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Public URL still works",
        "body": "Check you tested the object URL again after account-level Block Public Access was enabled."
      },
      {
        "id": "ts-2",
        "title": "Cannot change setting",
        "body": "Your identity may lack s3:PutAccountPublicAccessBlock."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Bucket policy is not enough",
        "body": "A public bucket policy can still be blocked by account-level settings."
      },
      {
        "id": "trap-2",
        "title": "This is account-wide",
        "body": "Do not treat account-level Block Public Access as a bucket-only setting."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Account block wins. If the account blocks public access, a public bucket policy may not help.",
    "flashcardSetId": "s3_task_12_flashcards"
  },
  {
    "id": "task-saa-s3-set-s3-static-website-index-and-error-pages-013",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Set S3 static website index and error pages",
    "slug": "set-s3-static-website-index-and-error-pages",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Set the index and error pages for a simple S3 static website.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Index document",
        "body": "The index document is the default page for the website root."
      },
      {
        "id": "concept-2",
        "title": "Error document",
        "body": "The error document is shown when the website cannot find the requested page."
      },
      {
        "id": "concept-3",
        "title": "Website endpoint",
        "body": "S3 static websites use the website endpoint, not the normal REST object URL."
      }
    ],
    "whyItMatters": "This teaches the difference between storing objects and hosting a simple static website from S3.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Website bucket",
        "value": "saa-s3-task13-website-[account-id]"
      },
      {
        "label": "Index document",
        "value": "index.html"
      },
      {
        "label": "Error document",
        "value": "404.html"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, S3 bucket setup, public read policy, website configuration, object upload, and cleanup. Exact actions are listed in Console step 0."
      }
    ],
    "costWarning": "This lab should cost very little if you delete the bucket and files after testing. Public website traffic can create small data transfer charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 public access permissions: s3:PutPublicAccessBlock, s3:GetPublicAccessBlock, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:DeleteBucketPolicy"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 website permissions: s3:PutBucketWebsite, s3:GetBucketWebsite, s3:DeleteBucketWebsite"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create the website bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create bucket saa-s3-task13-website-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "For this lab only, turn off Block all public access for this bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Acknowledge the warning."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep ACLs disabled."
          }
        ],
        "note": null,
        "warning": "Use only test files. Static website hosting needs public read access unless you put CloudFront in front of it.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload the website files",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create index.html with simple homepage text."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create 404.html with simple error page text."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Upload both files to the bucket."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set the content type to text/html if asked."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Allow public read for website objects",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Permissions."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add a bucket policy that allows s3:GetObject for objects in this lab bucket."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Save the policy."
          }
        ],
        "note": null,
        "warning": "Do not use this policy on buckets with private data.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Set the index and error documents",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Choose Properties."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Go to Static website hosting."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Enable static website hosting."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose Host a static website."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Set Index document to index.html."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Set Error document to 404.html."
          },
          {
            "id": "console-step-5-item-8",
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
        "title": "Open the website endpoint",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Copy the bucket website endpoint from Static website hosting."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Open it in a browser."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm the homepage loads from index.html."
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
            "text": "Disable static website hosting."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Remove the bucket policy."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete index.html and 404.html."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the bucket."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "export AWS_REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "export BUCKET=saa-s3-task13-website-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the bucket and website files",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $AWS_REGION --create-bucket-configuration LocationConstraint=$AWS_REGION"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "echo '<h1>S3 Website Home</h1>' > index.html"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "echo '<h1>Custom 404 Page</h1>' > 404.html"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Upload the website files",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api put-object --bucket $BUCKET --key index.html --body index.html --content-type text/html"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws s3api put-object --bucket $BUCKET --key 404.html --body 404.html --content-type text/html"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Add the public website bucket policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > website-public-policy.json <<EOF\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadForWebsite\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}\nEOF\naws s3api put-bucket-policy --bucket $BUCKET --policy file://website-public-policy.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Configure static website hosting",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-website --bucket $BUCKET --website-configuration '{\"IndexDocument\":{\"Suffix\":\"index.html\"},\"ErrorDocument\":{\"Key\":\"404.html\"}}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Print and open the website endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "echo http://$BUCKET.s3-website.$AWS_REGION.amazonaws.com"
          }
        ],
        "note": "Open the printed website endpoint in a browser.",
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
            "text": "aws s3api delete-bucket-website --bucket $BUCKET"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-bucket-policy --bucket $BUCKET"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-object --bucket $BUCKET --key index.html"
          },
          {
            "id": "cli-step-8-cmd-4",
            "language": "bash",
            "text": "aws s3api delete-object --bucket $BUCKET --key 404.html"
          },
          {
            "id": "cli-step-8-cmd-5",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region $AWS_REGION"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
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
        "title": "Website endpoint",
        "body": "Use the S3 website endpoint for browser website testing."
      },
      {
        "id": "cs-2",
        "title": "Case matters",
        "body": "index.html and Index.html are different names."
      },
      {
        "id": "cs-3",
        "title": "Public access",
        "body": "A plain S3 website needs public read access unless CloudFront or another design is used."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "403 instead of homepage",
        "body": "Check Block Public Access, the bucket policy, and the object key names."
      },
      {
        "id": "ts-2",
        "title": "Homepage missing",
        "body": "Make sure index.html exists at the bucket root and matches the configured name."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "REST URL is not website hosting",
        "body": "The normal object URL is not the same as the S3 static website endpoint."
      },
      {
        "id": "trap-2",
        "title": "Static website does not support HTTPS directly",
        "body": "Use CloudFront when HTTPS is needed for an S3 static website."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Index = home. Error = wrong page. S3 website hosting needs both names to match the uploaded files.",
    "flashcardSetId": "s3_task_13_flashcards"
  },
  {
    "id": "task-saa-s3-test-the-custom-s3-website-404-page-014",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Test the custom S3 website 404 page",
    "slug": "test-the-custom-s3-website-404-page",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Open a wrong website URL and confirm the custom 404 page appears.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Custom 404 page",
        "body": "The error document is the page S3 returns for missing website paths."
      },
      {
        "id": "concept-2",
        "title": "Wrong URL test",
        "body": "A missing object path is the easiest way to test the error document."
      },
      {
        "id": "concept-3",
        "title": "Website endpoint only",
        "body": "Test with the S3 website endpoint, not the normal S3 object URL."
      }
    ],
    "whyItMatters": "This helps you troubleshoot static website hosting and understand how S3 handles missing web pages.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Website bucket",
        "value": "saa-s3-task14-website-[account-id]"
      },
      {
        "label": "Wrong URL path",
        "value": "missing-page.html"
      },
      {
        "label": "Error document",
        "value": "404.html"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, S3 bucket setup, public read policy, website configuration, object upload, wrong URL test, and cleanup. Exact actions are listed in Console step 0."
      }
    ],
    "costWarning": "This lab should cost very little if you delete the bucket and files after testing. Public website traffic can create small data transfer charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 public access permissions: s3:PutPublicAccessBlock, s3:GetPublicAccessBlock, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:DeleteBucketPolicy"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 website permissions: s3:PutBucketWebsite, s3:GetBucketWebsite, s3:DeleteBucketWebsite"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create the S3 website bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create bucket saa-s3-task14-website-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "For this lab only, turn off Block all public access for this bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Acknowledge the warning."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep ACLs disabled."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload index and custom 404 files",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create index.html with homepage text."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create 404.html with clear text such as This is the custom 404 page."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Upload both files to the bucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Allow public read and enable website hosting",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Add a bucket policy that allows public s3:GetObject for objects in this lab bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open Properties."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Enable Static website hosting."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Index document to index.html."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Set Error document to 404.html."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Save changes."
          }
        ],
        "note": null,
        "warning": "Use only harmless lab content.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Open a wrong website URL",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Copy the S3 website endpoint."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Add /missing-page.html to the end."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Open the wrong URL in a browser."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm the custom 404.html page appears."
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
            "text": "Disable static website hosting."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Remove the bucket policy."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete index.html and 404.html."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the bucket."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "export AWS_REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "export BUCKET=saa-s3-task14-website-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the bucket and files",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $AWS_REGION --create-bucket-configuration LocationConstraint=$AWS_REGION"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "echo '<h1>Home page</h1>' > index.html"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "echo '<h1>This is the custom 404 page</h1>' > 404.html"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Upload files and allow public read",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api put-object --bucket $BUCKET --key index.html --body index.html --content-type text/html"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws s3api put-object --bucket $BUCKET --key 404.html --body 404.html --content-type text/html"
          },
          {
            "id": "cli-step-4-cmd-3",
            "language": "bash",
            "text": "cat > website-public-policy.json <<EOF\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadForWebsite\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$BUCKET/*\"}]}\nEOF\naws s3api put-bucket-policy --bucket $BUCKET --policy file://website-public-policy.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Enable website hosting",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-website --bucket $BUCKET --website-configuration '{\"IndexDocument\":{\"Suffix\":\"index.html\"},\"ErrorDocument\":{\"Key\":\"404.html\"}}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Print the wrong URL",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "echo http://$BUCKET.s3-website.$AWS_REGION.amazonaws.com/missing-page.html"
          }
        ],
        "note": "Open the printed URL. Expected: your custom 404 page appears.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
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
            "text": "aws s3api delete-bucket-website --bucket $BUCKET"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-bucket-policy --bucket $BUCKET"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-object --bucket $BUCKET --key index.html"
          },
          {
            "id": "cli-step-7-cmd-4",
            "language": "bash",
            "text": "aws s3api delete-object --bucket $BUCKET --key 404.html"
          },
          {
            "id": "cli-step-7-cmd-5",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region $AWS_REGION"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
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
        "title": "Wrong path test",
        "body": "Use a path like /missing-page.html to trigger the custom error document."
      },
      {
        "id": "cs-2",
        "title": "Name must match",
        "body": "The configured error document name must match the uploaded file name exactly."
      },
      {
        "id": "cs-3",
        "title": "Browser cache",
        "body": "Use a private browser window if an old result is cached."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "403 instead of 404",
        "body": "Check public access, bucket policy, and whether the file names are correct."
      },
      {
        "id": "ts-2",
        "title": "Default XML error appears",
        "body": "You may be using the REST object URL instead of the website endpoint."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Not the same as CloudFront custom errors",
        "body": "S3 website error pages and CloudFront custom error responses are separate features."
      },
      {
        "id": "trap-2",
        "title": "S3 website endpoints are HTTP",
        "body": "Use CloudFront if the exam asks for HTTPS with an S3 website."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Wrong path proves the error page. If S3 cannot find the page, it serves the configured error document.",
    "flashcardSetId": "s3_task_14_flashcards"
  },
  {
    "id": "task-saa-s3-turn-on-access-logging-for-the-s3-website-bucket-015",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Turn on access logging for the S3 website bucket",
    "slug": "turn-on-access-logging-for-the-s3-website-bucket",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Turn on server access logging for the S3 website bucket.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Server access logging",
        "body": "S3 server access logging records requests made to a source bucket."
      },
      {
        "id": "concept-2",
        "title": "Separate target bucket",
        "body": "Logs should be sent to a separate target bucket in the same account and Region."
      },
      {
        "id": "concept-3",
        "title": "Not instant",
        "body": "S3 log files can take time to appear after requests are made."
      }
    ],
    "whyItMatters": "This teaches audit logging for S3. The exam may test where logs go, how delivery works, and why a separate bucket is used.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Website source bucket",
        "value": "saa-s3-task15-website-[account-id]"
      },
      {
        "label": "Logging target bucket",
        "value": "saa-s3-task15-logs-[account-id]"
      },
      {
        "label": "Log prefix",
        "value": "website-logs/"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, S3 bucket setup, public website policy, website hosting config, server access logging config, log delivery policy, object access, and cleanup. Exact actions are listed in Console step 0."
      }
    ],
    "costWarning": "This lab should cost very little. Website requests and stored logs can create small charges. Delete both buckets and all objects after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 public access permissions: s3:PutPublicAccessBlock, s3:GetPublicAccessBlock, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:DeleteBucketPolicy"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 website permissions: s3:PutBucketWebsite, s3:GetBucketWebsite, s3:DeleteBucketWebsite"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 logging permissions: s3:PutBucketLogging, s3:GetBucketLogging"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-11",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create the website source bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create bucket saa-s3-task15-website-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "For this lab only, turn off Block all public access for this website bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Upload index.html."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Add a public read bucket policy for website objects."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Enable static website hosting with index.html as the index document."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the logging target bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create bucket saa-s3-task15-logs-[account-id] in the same Region."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Keep Block all public access turned on."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Keep default encryption as SSE-S3."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Do not enable Object Lock."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Do not enable Requester Pays."
          }
        ],
        "note": "S3 server access logging target buckets must be in the same account and Region as the source bucket.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Allow S3 log delivery to write logs",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the logging target bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Go to Permissions."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add a bucket policy that allows the S3 logging service to write log objects to website-logs/."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Restrict the policy to the source bucket ARN and your account ID."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Enable server access logging",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the website source bucket."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Properties."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Under Server access logging, choose Edit."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Enable logging."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Set the target bucket to saa-s3-task15-logs-[account-id]."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Set the target prefix to website-logs/."
          },
          {
            "id": "console-step-5-item-7",
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
        "title": "Generate and check logs",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the website endpoint several times in a browser."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Wait a short while for logs to appear."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open the logging target bucket."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Check for objects under website-logs/."
          }
        ],
        "note": "S3 server access logs are not instant. They can take time to appear.",
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
            "text": "Disable server access logging on the website source bucket."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Disable static website hosting."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Remove the website bucket policy."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Remove the logging target bucket policy."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete website files from the source bucket."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete log objects from the logging target bucket."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete the source bucket."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Delete the logging target bucket."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "export AWS_REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "export SOURCE_BUCKET=saa-s3-task15-website-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "export LOG_BUCKET=saa-s3-task15-logs-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "export LOG_PREFIX=website-logs/"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create source and log buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $SOURCE_BUCKET --region $AWS_REGION --create-bucket-configuration LocationConstraint=$AWS_REGION"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $LOG_BUCKET --region $AWS_REGION --create-bucket-configuration LocationConstraint=$AWS_REGION"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $SOURCE_BUCKET --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "echo '<h1>Logged S3 website</h1>' > index.html"
          },
          {
            "id": "cli-step-3-cmd-5",
            "language": "bash",
            "text": "aws s3api put-object --bucket $SOURCE_BUCKET --key index.html --body index.html --content-type text/html"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Configure the website bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > website-public-policy.json <<EOF\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadForWebsite\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::$SOURCE_BUCKET/*\"}]}\nEOF\naws s3api put-bucket-policy --bucket $SOURCE_BUCKET --policy file://website-public-policy.json"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws s3api put-bucket-website --bucket $SOURCE_BUCKET --website-configuration '{\"IndexDocument\":{\"Suffix\":\"index.html\"}}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Allow S3 log delivery to the log bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > log-delivery-policy.json <<EOF\n{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"S3ServerAccessLogsPolicy\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"logging.s3.amazonaws.com\"},\"Action\":\"s3:PutObject\",\"Resource\":\"arn:aws:s3:::$LOG_BUCKET/$LOG_PREFIX*\",\"Condition\":{\"ArnLike\":{\"aws:SourceArn\":\"arn:aws:s3:::$SOURCE_BUCKET\"},\"StringEquals\":{\"aws:SourceAccount\":\"$ACCOUNT_ID\"}}}]}\nEOF\naws s3api put-bucket-policy --bucket $LOG_BUCKET --policy file://log-delivery-policy.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Enable server access logging",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-logging --bucket $SOURCE_BUCKET --bucket-logging-status '{\"LoggingEnabled\":{\"TargetBucket\":\"'$LOG_BUCKET'\",\"TargetPrefix\":\"'$LOG_PREFIX'\"}}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Open the website endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "echo http://$SOURCE_BUCKET.s3-website.$AWS_REGION.amazonaws.com"
          }
        ],
        "note": "Open the printed endpoint a few times to generate access log entries.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Check for logs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3api list-objects-v2 --bucket $LOG_BUCKET --prefix $LOG_PREFIX --query 'Contents[].Key' --output table"
          }
        ],
        "note": "Expected: log objects appear after S3 delivers them. This is not instant.",
        "warning": null,
        "expectedResult": "Expected: log objects appear after S3 delivers them. This is not instant."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Tear down in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-logging --bucket $SOURCE_BUCKET --bucket-logging-status '{}'"
          },
          {
            "id": "cli-step-9-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-bucket-website --bucket $SOURCE_BUCKET"
          },
          {
            "id": "cli-step-9-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-bucket-policy --bucket $SOURCE_BUCKET"
          },
          {
            "id": "cli-step-9-cmd-4",
            "language": "bash",
            "text": "aws s3api delete-bucket-policy --bucket $LOG_BUCKET"
          },
          {
            "id": "cli-step-9-cmd-5",
            "language": "bash",
            "text": "aws s3 rm s3://$SOURCE_BUCKET --recursive"
          },
          {
            "id": "cli-step-9-cmd-6",
            "language": "bash",
            "text": "aws s3 rm s3://$LOG_BUCKET --recursive"
          },
          {
            "id": "cli-step-9-cmd-7",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $SOURCE_BUCKET --region $AWS_REGION"
          },
          {
            "id": "cli-step-9-cmd-8",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $LOG_BUCKET --region $AWS_REGION"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 9 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
        "title": "Source bucket",
        "body": "The source bucket is the bucket being accessed."
      },
      {
        "id": "cs-2",
        "title": "Target bucket",
        "body": "The target bucket stores the server access log objects."
      },
      {
        "id": "cs-3",
        "title": "Same account and Region",
        "body": "The target bucket must be in the same AWS account and Region as the source bucket."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No logs appear yet",
        "body": "Wait longer and make more website requests. S3 access logs are delivered later, not instantly."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied for log delivery",
        "body": "Check the target bucket policy allows logging.s3.amazonaws.com to write objects."
      },
      {
        "id": "ts-3",
        "title": "Wrong target bucket",
        "body": "Confirm the target bucket is in the same account and Region as the source bucket."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Do not log to the same bucket",
        "body": "Using the same bucket for source and logs can create confusing recursive logs."
      },
      {
        "id": "trap-2",
        "title": "SSE-KMS target bucket issue",
        "body": "For S3 server access logging, use SSE-S3 on the target bucket to avoid KMS access problems."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Source is watched. Target stores logs. One bucket receives requests. The other bucket receives the records.",
    "flashcardSetId": "s3_task_15_flashcards"
  },
  {
    "id": "task-saa-s3-put-cloudfront-in-front-of-the-s3-website-016",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Put CloudFront in front of the S3 website",
    "slug": "put-cloudfront-in-front-of-the-s3-website",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Create a CloudFront distribution in front of an S3 static website and open the CloudFront URL.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "CloudFront",
        "body": "CloudFront is a CDN. It caches content at edge locations closer to users."
      },
      {
        "id": "concept-2",
        "title": "S3 website endpoint",
        "body": "An S3 static website uses a website endpoint. With CloudFront, treat it as a custom origin."
      },
      {
        "id": "concept-3",
        "title": "Origin",
        "body": "The origin is where CloudFront gets the website files from."
      }
    ],
    "whyItMatters": "This shows how S3 static websites can be fronted by CloudFront for better delivery and HTTPS at the viewer side.",
    "values": [
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Website bucket",
        "value": "saa-s3-task16-site-[account-id]"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 website setup, S3 public read setup, CloudFront distribution management, object access, and cleanup permissions. Exact actions are grouped in Console step 0."
      }
    ],
    "costWarning": "S3 storage is low cost for this lab. CloudFront can create small charges. Delete the distribution and bucket when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket, s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 website permissions: s3:PutBucketWebsite, s3:GetBucketWebsite, s3:DeleteBucketWebsite"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 public access permissions: s3:PutPublicAccessBlock, s3:GetPublicAccessBlock, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:DeleteBucketPolicy"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "CloudFront permissions: cloudfront:CreateDistribution, cloudfront:GetDistribution, cloudfront:GetDistributionConfig, cloudfront:UpdateDistribution, cloudfront:DeleteDistribution, cloudfront:ListDistributions"
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
        "title": "Create the S3 website bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use bucket name saa-s3-task16-site-[account-id]."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Region eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Clear Block all public access for this lab website bucket."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Tick the acknowledgement box."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Choose Create bucket."
          }
        ],
        "note": null,
        "warning": "This is only for a lab static website. Do not make real private data public.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload the website files",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Upload an index.html file."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Use simple text such as Hello from S3 behind CloudFront."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose Upload."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Allow public read for the website file",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the bucket Permissions tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Bucket policy."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add a policy that allows public s3:GetObject for arn:aws:s3:::saa-s3-task16-site-[account-id]/*."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Save changes."
          }
        ],
        "note": null,
        "warning": "Use only this lab bucket. Public read means anyone can read the website objects.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Turn on static website hosting",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the bucket Properties tab."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Under Static website hosting, choose Edit."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Enable."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Set index document to index.html."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Save changes."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Copy the Bucket website endpoint."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the CloudFront distribution",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open CloudFront."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Create distribution."
          },
          {
            "id": "console-step-6-item-3",
            "text": "For origin domain, paste or choose the S3 website endpoint."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Use HTTP only to the origin because this is an S3 website endpoint."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Keep viewer protocol policy as Redirect HTTP to HTTPS if available."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Use default cache behavior settings for this lab."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Choose Create distribution."
          }
        ],
        "note": "An S3 website endpoint is used as a custom origin. Do not use OAC with an S3 website endpoint.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Open the CloudFront URL",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Wait until the distribution status is Deployed."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Copy the CloudFront distribution domain name."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open it in a browser."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Confirm the S3 website page loads through CloudFront."
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
            "text": "Disable the CloudFront distribution first."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Wait until the distribution is deployed after disabling."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Delete the CloudFront distribution."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Delete the S3 bucket policy."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Turn off static website hosting."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Delete the uploaded objects."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Delete the S3 bucket."
          }
        ],
        "note": null,
        "warning": "CloudFront deletion can take time because the distribution must be disabled first.",
        "expectedResult": "Step 8 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "BUCKET=saa-s3-task16-site-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the website bucket and file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "echo '<html><body><h1>Hello from S3 behind CloudFront</h1></body></html>' > index.html"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "aws s3 cp index.html s3://$BUCKET/index.html --content-type text/html"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Add public read bucket policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > bucket-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"PublicReadForWebsiteLab\",\n      \"Effect\": \"Allow\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::$BUCKET/*\"\n    }\n  ]\n}\nEOF\naws s3api put-bucket-policy --bucket $BUCKET --policy file://bucket-policy.json"
          }
        ],
        "note": null,
        "warning": "This makes website objects public for the lab.",
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Enable static website hosting",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > website.json <<EOF\n{\n  \"IndexDocument\": {\n    \"Suffix\": \"index.html\"\n  }\n}\nEOF\naws s3api put-bucket-website --bucket $BUCKET --website-configuration file://website.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the CloudFront distribution",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "ORIGIN_DOMAIN=\"$BUCKET.s3-website.$REGION.amazonaws.com\"\nCALLER_REFERENCE=\"s3-task16-$(date +%s)\"\ncat > distribution-config.json <<EOF\n{\n  \"CallerReference\": \"$CALLER_REFERENCE\",\n  \"Comment\": \"S3 Task 16 website distribution\",\n  \"Enabled\": true,\n  \"Origins\": {\n    \"Quantity\": 1,\n    \"Items\": [\n      {\n        \"Id\": \"s3-website-origin\",\n        \"DomainName\": \"$ORIGIN_DOMAIN\",\n        \"CustomOriginConfig\": {\n          \"HTTPPort\": 80,\n          \"HTTPSPort\": 443,\n          \"OriginProtocolPolicy\": \"http-only\",\n          \"OriginSslProtocols\": {\n            \"Quantity\": 1,\n            \"Items\": [\"TLSv1.2\"]\n          }\n        }\n      }\n    ]\n  },\n  \"DefaultCacheBehavior\": {\n    \"TargetOriginId\": \"s3-website-origin\",\n    \"ViewerProtocolPolicy\": \"redirect-to-https\",\n    \"AllowedMethods\": {\n      \"Quantity\": 2,\n      \"Items\": [\"GET\", \"HEAD\"],\n      \"CachedMethods\": {\n        \"Quantity\": 2,\n        \"Items\": [\"GET\", \"HEAD\"]\n      }\n    },\n    \"ForwardedValues\": {\n      \"QueryString\": false,\n      \"Cookies\": {\n        \"Forward\": \"none\"\n      }\n    },\n    \"MinTTL\": 0,\n    \"DefaultTTL\": 300,\n    \"MaxTTL\": 300\n  }\n}\nEOF\naws cloudfront create-distribution --distribution-config file://distribution-config.json"
          }
        ],
        "note": "Copy the distribution ID and domain name from the output.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Check the distribution",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws cloudfront list-distributions --query \"DistributionList.Items[?Comment=='S3 Task 16 website distribution'].[Id,DomainName,Status]\" --output table"
          }
        ],
        "note": "Open the CloudFront domain name when the status is Deployed.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Tear down",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "DIST_ID=$(aws cloudfront list-distributions --query \"DistributionList.Items[?Comment=='S3 Task 16 website distribution'].Id | [0]\" --output text)\nETAG=$(aws cloudfront get-distribution-config --id $DIST_ID --query ETag --output text)\naws cloudfront get-distribution-config --id $DIST_ID --query DistributionConfig > cf-config.json\npython - <<'PY'\nimport json\np='cf-config.json'\nd=json.load(open(p))\nd['Enabled']=False\njson.dump(d, open(p,'w'))\nPY\naws cloudfront update-distribution --id $DIST_ID --if-match $ETAG --distribution-config file://cf-config.json\necho \"Wait until disabled and Deployed, then run delete-distribution with the new ETag.\"\naws s3api delete-bucket-policy --bucket $BUCKET\naws s3api delete-bucket-website --bucket $BUCKET\naws s3 rm s3://$BUCKET --recursive\naws s3api delete-bucket --bucket $BUCKET --region $REGION"
          }
        ],
        "note": "CloudFront delete needs the distribution disabled first. Re-check the ETag before deleting.",
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "S3 website + CloudFront",
        "body": "Use the S3 website endpoint as a custom origin."
      },
      {
        "id": "cs-2",
        "title": "OAC trap",
        "body": "OAC is for S3 REST origins. It is not used with S3 website endpoints."
      },
      {
        "id": "cs-3",
        "title": "CloudFront delay",
        "body": "CloudFront changes are not instant. Wait for Deployed."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "CloudFront URL does not load",
        "body": "Wait until the distribution is Deployed. Then try the domain name again."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied from origin",
        "body": "Check the bucket policy and Block Public Access settings for the lab website bucket."
      },
      {
        "id": "ts-3",
        "title": "Cannot delete distribution",
        "body": "Disable the distribution first. Wait for Deployed. Then delete it with the latest ETag."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Website endpoint vs REST endpoint",
        "body": "S3 website endpoints support website hosting features. REST endpoints are used for private S3 origins with OAC."
      },
      {
        "id": "trap-2",
        "title": "CloudFront caches content",
        "body": "A changed file may not appear straight away because CloudFront caches it."
      },
      {
        "id": "trap-3",
        "title": "Public website lab",
        "body": "A simple S3 website bucket is public. Do not store private data there."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "CloudFront sits in front. Users hit CloudFront first. CloudFront gets the page from S3.",
    "flashcardSetId": "s3_task_16_flashcards"
  },
  {
    "id": "task-saa-s3-change-a-website-file-and-create-a-cloudfront-invalidation-017",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Change a website file and create a CloudFront invalidation",
    "slug": "change-a-website-file-and-create-a-cloudfront-invalidation",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Update an S3 website file and create a CloudFront invalidation so the CloudFront URL shows the new version.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "CloudFront cache",
        "body": "CloudFront can keep an old object in cache until it expires or is invalidated."
      },
      {
        "id": "concept-2",
        "title": "Invalidation",
        "body": "An invalidation tells CloudFront to remove cached objects for selected paths."
      },
      {
        "id": "concept-3",
        "title": "Path format",
        "body": "Use paths such as /index.html or /*. Use the smallest useful path."
      }
    ],
    "whyItMatters": "This lab shows why website updates may not appear immediately through CloudFront.",
    "values": [
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Website bucket",
        "value": "saa-s3-task17-site-[account-id]"
      },
      {
        "label": "Invalidation path",
        "value": "/index.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 website setup, CloudFront distribution management, CloudFront invalidation, object access, and cleanup permissions. Exact actions are grouped in Console step 0."
      }
    ],
    "costWarning": "S3 storage is low cost. CloudFront and invalidations can create small charges. Delete the distribution and bucket when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket, s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 website permissions: s3:PutBucketWebsite, s3:GetBucketWebsite, s3:DeleteBucketWebsite"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 public access permissions: s3:PutPublicAccessBlock, s3:GetPublicAccessBlock, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:DeleteBucketPolicy"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "CloudFront permissions: cloudfront:CreateDistribution, cloudfront:GetDistribution, cloudfront:GetDistributionConfig, cloudfront:UpdateDistribution, cloudfront:DeleteDistribution, cloudfront:ListDistributions"
          },
          {
            "id": "console-step-1-item-11",
            "text": "CloudFront cache permissions: cloudfront:CreateInvalidation, cloudfront:GetInvalidation"
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
        "title": "Create the lab website and CloudFront distribution",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Create an S3 static website bucket named saa-s3-task17-site-[account-id]."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Upload index.html with version one text."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Allow public read for the lab website objects."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Turn on static website hosting."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Create a CloudFront distribution using the S3 website endpoint as a custom origin."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Wait for the distribution status to become Deployed."
          }
        ],
        "note": "This task is standalone, so it creates its own website and distribution.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Open the CloudFront URL",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Copy the CloudFront distribution domain name."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open the URL in a browser."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Confirm the page shows the original version one text."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Change the website file",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the S3 bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Upload a new index.html with version two text."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Keep the object key exactly index.html."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Open the S3 website endpoint to confirm S3 has the new file."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create a CloudFront invalidation",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the CloudFront distribution."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Invalidations tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Create invalidation."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Enter path /index.html."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Create the invalidation."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Wait for it to complete."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Confirm the refreshed CloudFront page",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the CloudFront URL again."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Refresh the browser."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm the page shows the version two text."
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
            "text": "Disable the CloudFront distribution."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Wait until the disabled change is Deployed."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the CloudFront distribution."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the S3 bucket policy."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the website configuration."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Empty the S3 bucket."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete the S3 bucket."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "BUCKET=saa-s3-task17-site-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create website version one",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "echo '<html><body><h1>Version one</h1></body></html>' > index.html"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "aws s3 cp index.html s3://$BUCKET/index.html --content-type text/html"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Add website policy and hosting",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > bucket-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"PublicReadForWebsiteLab\",\n      \"Effect\": \"Allow\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::$BUCKET/*\"\n    }\n  ]\n}\nEOF\naws s3api put-bucket-policy --bucket $BUCKET --policy file://bucket-policy.json\ncat > website.json <<EOF\n{\n  \"IndexDocument\": {\n    \"Suffix\": \"index.html\"\n  }\n}\nEOF\naws s3api put-bucket-website --bucket $BUCKET --website-configuration file://website.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create the CloudFront distribution",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "ORIGIN_DOMAIN=\"$BUCKET.s3-website.$REGION.amazonaws.com\"\nCALLER_REFERENCE=\"s3-task17-$(date +%s)\"\ncat > distribution-config.json <<EOF\n{\n  \"CallerReference\": \"$CALLER_REFERENCE\",\n  \"Comment\": \"S3 Task 17 invalidation distribution\",\n  \"Enabled\": true,\n  \"Origins\": {\n    \"Quantity\": 1,\n    \"Items\": [\n      {\n        \"Id\": \"s3-website-origin\",\n        \"DomainName\": \"$ORIGIN_DOMAIN\",\n        \"CustomOriginConfig\": {\n          \"HTTPPort\": 80,\n          \"HTTPSPort\": 443,\n          \"OriginProtocolPolicy\": \"http-only\",\n          \"OriginSslProtocols\": {\n            \"Quantity\": 1,\n            \"Items\": [\"TLSv1.2\"]\n          }\n        }\n      }\n    ]\n  },\n  \"DefaultCacheBehavior\": {\n    \"TargetOriginId\": \"s3-website-origin\",\n    \"ViewerProtocolPolicy\": \"redirect-to-https\",\n    \"AllowedMethods\": {\n      \"Quantity\": 2,\n      \"Items\": [\"GET\", \"HEAD\"],\n      \"CachedMethods\": {\n        \"Quantity\": 2,\n        \"Items\": [\"GET\", \"HEAD\"]\n      }\n    },\n    \"ForwardedValues\": {\n      \"QueryString\": false,\n      \"Cookies\": {\n        \"Forward\": \"none\"\n      }\n    },\n    \"MinTTL\": 0,\n    \"DefaultTTL\": 600,\n    \"MaxTTL\": 600\n  }\n}\nEOF\naws cloudfront create-distribution --distribution-config file://distribution-config.json"
          }
        ],
        "note": "Copy the distribution ID from the output.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Update the file and invalidate the cache",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "echo '<html><body><h1>Version two</h1></body></html>' > index.html"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws s3 cp index.html s3://$BUCKET/index.html --content-type text/html"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "DIST_ID=$(aws cloudfront list-distributions --query \"DistributionList.Items[?Comment=='S3 Task 17 invalidation distribution'].Id | [0]\" --output text)"
          },
          {
            "id": "cli-step-6-cmd-4",
            "language": "bash",
            "text": "aws cloudfront create-invalidation --distribution-id $DIST_ID --paths /index.html"
          }
        ],
        "note": "Open the CloudFront URL again after the invalidation completes.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Tear down",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "DIST_ID=$(aws cloudfront list-distributions --query \"DistributionList.Items[?Comment=='S3 Task 17 invalidation distribution'].Id | [0]\" --output text)\necho \"Disable and delete the CloudFront distribution first. Then remove the S3 resources.\"\naws s3api delete-bucket-policy --bucket $BUCKET\naws s3api delete-bucket-website --bucket $BUCKET\naws s3 rm s3://$BUCKET --recursive\naws s3api delete-bucket --bucket $BUCKET --region $REGION"
          }
        ],
        "note": "For CloudFront, disable the distribution and wait for Deployed before deleting it.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
        "title": "Invalidation purpose",
        "body": "Use invalidations when users need the new content before the cache TTL ends."
      },
      {
        "id": "cs-2",
        "title": "Path matters",
        "body": "Invalidating /index.html is more targeted than invalidating /*."
      },
      {
        "id": "cs-3",
        "title": "Cache delay",
        "body": "CloudFront may show old content until cache expires or invalidation completes."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Old page still appears",
        "body": "Wait for the invalidation to complete. Also refresh the browser cache."
      },
      {
        "id": "ts-2",
        "title": "Wrong path invalidated",
        "body": "Make sure the path starts with / and matches the object path."
      },
      {
        "id": "ts-3",
        "title": "Distribution not found",
        "body": "Check the distribution ID and Region. CloudFront is global, not regional."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "S3 changed does not mean CloudFront changed",
        "body": "CloudFront may still serve the old cached copy."
      },
      {
        "id": "trap-2",
        "title": "Invalidation is not upload",
        "body": "Upload changes the origin. Invalidation clears the cache."
      },
      {
        "id": "trap-3",
        "title": "Use targeted paths",
        "body": "Broad invalidations can be unnecessary and more expensive at scale."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Change origin, clear edge. S3 has the new file. CloudFront needs cache clearing.",
    "flashcardSetId": "s3_task_17_flashcards"
  },
  {
    "id": "task-saa-s3-create-a-lifecycle-rule-that-moves-objects-to-standard-ia-018",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Create a lifecycle rule that moves objects to Standard-IA",
    "slug": "create-a-lifecycle-rule-that-moves-objects-to-standard-ia",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an S3 Lifecycle rule that transitions current objects to S3 Standard-IA after 30 days.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "S3 Lifecycle",
        "body": "S3 Lifecycle rules automate object transitions and expirations."
      },
      {
        "id": "concept-2",
        "title": "Standard-IA",
        "body": "S3 Standard-IA is for data accessed less often but still needing fast access."
      },
      {
        "id": "concept-3",
        "title": "Delayed action",
        "body": "Lifecycle rules do not move objects instantly. S3 evaluates them later."
      }
    ],
    "whyItMatters": "This helps you choose lower-cost storage for objects that become less frequently accessed.",
    "values": [
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task18-lifecycle-[account-id]"
      },
      {
        "label": "Lifecycle rule",
        "value": "Move current objects to Standard-IA after 30 days"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, S3 object access, S3 lifecycle configuration, and cleanup permissions. Exact actions are grouped in Console step 0."
      }
    ],
    "costWarning": "This lab should cost very little. Standard-IA has retrieval charges and minimum storage duration rules. Delete the bucket after the lab.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket, s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 lifecycle permissions: s3:PutLifecycleConfiguration, s3:GetLifecycleConfiguration, s3:DeleteBucket"
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
        "title": "Create the S3 bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use bucket name saa-s3-task18-lifecycle-[account-id]."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Region eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Block all public access on."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create bucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload a test object",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Upload a small file named standard-ia-test.txt."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Upload."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create a lifecycle rule",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the Management tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create lifecycle rule."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name it move-to-standard-ia."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Apply to all objects in the bucket."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Tick the acknowledgement box if shown."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose Move current versions of objects between storage classes."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Choose Standard-IA."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Set days after object creation to 30."
          },
          {
            "id": "console-step-4-item-9",
            "text": "Create the rule."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Check the lifecycle rule",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the bucket Management tab."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Confirm the rule is enabled."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm it moves current object versions to Standard-IA after 30 days."
          }
        ],
        "note": "The object will not move immediately. Lifecycle transitions run later.",
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
            "text": "Delete the lifecycle rule."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the uploaded test object."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the S3 bucket."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set variables and create the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "BUCKET=saa-s3-task18-lifecycle-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Upload a test object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "echo 'Lifecycle test file' > standard-ia-test.txt"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3 cp standard-ia-test.txt s3://$BUCKET/standard-ia-test.txt"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Add the lifecycle rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > lifecycle.json <<EOF\n{\n  \"Rules\": [\n    {\n      \"ID\": \"move-to-standard-ia\",\n      \"Status\": \"Enabled\",\n      \"Filter\": {\n        \"Prefix\": \"\"\n      },\n      \"Transitions\": [\n        {\n          \"Days\": 30,\n          \"StorageClass\": \"STANDARD_IA\"\n        }\n      ]\n    }\n  ]\n}\nEOF\naws s3api put-bucket-lifecycle-configuration --bucket $BUCKET --lifecycle-configuration file://lifecycle.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Check the lifecycle rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-lifecycle-configuration --bucket $BUCKET"
          }
        ],
        "note": "Expected: the rule shows STANDARD_IA after 30 days.",
        "warning": null,
        "expectedResult": "Expected: the rule shows STANDARD_IA after 30 days."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Tear down",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-bucket-lifecycle --bucket $BUCKET"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET --recursive"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region $REGION"
          }
        ],
        "note": null,
        "warning": null,
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Lifecycle transition",
        "body": "Transition means S3 changes the storage class automatically later."
      },
      {
        "id": "cs-2",
        "title": "Standard-IA use case",
        "body": "Use Standard-IA for infrequent access with fast retrieval."
      },
      {
        "id": "cs-3",
        "title": "Not instant",
        "body": "A lifecycle rule being enabled does not mean the object moves right away."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Rule not visible",
        "body": "Refresh the Management tab or run get-bucket-lifecycle-configuration."
      },
      {
        "id": "ts-2",
        "title": "Object still Standard",
        "body": "That is expected. The transition happens after the configured number of days."
      },
      {
        "id": "ts-3",
        "title": "Cannot delete bucket",
        "body": "Empty the bucket first, then delete the bucket."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Standard-IA is not archive",
        "body": "Standard-IA still gives fast access. Glacier classes are archive choices."
      },
      {
        "id": "trap-2",
        "title": "Minimum duration matters",
        "body": "Moving data too early can create minimum storage duration charges."
      },
      {
        "id": "trap-3",
        "title": "Lifecycle is bucket-level config",
        "body": "The rule lives on the bucket and applies by filter or prefix."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Same object, cheaper class. Lifecycle moves the storage class, not the object name.",
    "flashcardSetId": "s3_task_18_flashcards"
  },
  {
    "id": "task-saa-s3-add-a-lifecycle-rule-that-deletes-old-noncurrent-versions-019",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Add a lifecycle rule that deletes old noncurrent versions",
    "slug": "add-a-lifecycle-rule-that-deletes-old-noncurrent-versions",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Enable versioning, create noncurrent versions, and add a lifecycle rule that deletes old noncurrent versions after 30 days.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Current version",
        "body": "The current version is the newest version of an object."
      },
      {
        "id": "concept-2",
        "title": "Noncurrent version",
        "body": "A noncurrent version is an older version kept by S3 Versioning."
      },
      {
        "id": "concept-3",
        "title": "Noncurrent expiration",
        "body": "Lifecycle can permanently delete old noncurrent versions after a set number of days."
      }
    ],
    "whyItMatters": "This helps control storage cost when versioning keeps old object copies.",
    "values": [
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task19-noncurrent-[account-id]"
      },
      {
        "label": "Lifecycle rule",
        "value": "Delete noncurrent versions after 30 days"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, S3 versioning, S3 object version access, S3 lifecycle configuration, and cleanup permissions. Exact actions are grouped in Console step 0."
      }
    ],
    "costWarning": "This lab should cost very little. Versioning can increase storage cost because old versions are kept. Delete all versions and the bucket when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket, s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 versioning permissions: s3:PutBucketVersioning, s3:GetBucketVersioning, s3:ListBucketVersions"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject, s3:DeleteObjectVersion"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 lifecycle permissions: s3:PutLifecycleConfiguration, s3:GetLifecycleConfiguration, s3:DeleteBucket"
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
        "title": "Create the versioned bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create bucket saa-s3-task19-noncurrent-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Keep Block Public Access on."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Open the bucket Properties tab."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Turn on Bucket Versioning."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create object versions",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Upload a file named version-test.txt."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Change the file on your computer."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Upload it again with the same key name."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Open the object and turn on Show versions."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Confirm there is a current version and at least one noncurrent version."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Add a lifecycle rule for noncurrent versions",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the Management tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create lifecycle rule."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name it delete-old-noncurrent-versions."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Apply it to all objects in the bucket."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Permanently delete noncurrent versions of objects."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Set days after objects become noncurrent to 30."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Create the rule."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Check the rule",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Confirm the rule is enabled."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Confirm it deletes noncurrent versions after 30 days."
          }
        ],
        "note": "The noncurrent version will not delete immediately.",
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
            "text": "Delete the lifecycle rule."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete all object versions and delete markers."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the bucket."
          }
        ],
        "note": null,
        "warning": "A versioned bucket must have all versions removed before bucket deletion.",
        "expectedResult": "Step 6 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create the bucket and turn on versioning",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "BUCKET=saa-s3-task19-noncurrent-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning --bucket $BUCKET --versioning-configuration Status=Enabled"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create two versions of the same object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "echo 'version one' > version-test.txt"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3 cp version-test.txt s3://$BUCKET/version-test.txt"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "echo 'version two' > version-test.txt"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "aws s3 cp version-test.txt s3://$BUCKET/version-test.txt"
          },
          {
            "id": "cli-step-3-cmd-5",
            "language": "bash",
            "text": "aws s3api list-object-versions --bucket $BUCKET --prefix version-test.txt"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Add the lifecycle rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > noncurrent-lifecycle.json <<EOF\n{\n  \"Rules\": [\n    {\n      \"ID\": \"delete-old-noncurrent-versions\",\n      \"Status\": \"Enabled\",\n      \"Filter\": {\n        \"Prefix\": \"\"\n      },\n      \"NoncurrentVersionExpiration\": {\n        \"NoncurrentDays\": 30\n      }\n    }\n  ]\n}\nEOF\naws s3api put-bucket-lifecycle-configuration --bucket $BUCKET --lifecycle-configuration file://noncurrent-lifecycle.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Check the lifecycle rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-lifecycle-configuration --bucket $BUCKET"
          }
        ],
        "note": "Expected: NoncurrentVersionExpiration shows 30 days.",
        "warning": null,
        "expectedResult": "Expected: NoncurrentVersionExpiration shows 30 days."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Tear down",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-bucket-lifecycle --bucket $BUCKET\naws s3api list-object-versions --bucket $BUCKET --output json > versions.json\npython - <<'PY'\nimport json, subprocess, os\nbucket=os.environ['BUCKET']\ndata=json.load(open('versions.json'))\nitems=[]\nfor v in data.get('Versions',[]):\n    items.append({'Key':v['Key'],'VersionId':v['VersionId']})\nfor m in data.get('DeleteMarkers',[]):\n    items.append({'Key':m['Key'],'VersionId':m['VersionId']})\nif items:\n    payload={'Objects':items,'Quiet':False}\n    open('delete-versions.json','w').write(json.dumps(payload))\n    subprocess.run(['aws','s3api','delete-objects','--bucket',bucket,'--delete','file://delete-versions.json'],check=True)\nPY\naws s3api delete-bucket --bucket $BUCKET --region $REGION"
          }
        ],
        "note": "This deletes object versions before deleting the bucket.",
        "warning": null,
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Versioning creates old copies",
        "body": "Uploading the same key again creates a new current version and makes the older one noncurrent."
      },
      {
        "id": "cs-2",
        "title": "Noncurrent expiration",
        "body": "This lifecycle action removes old noncurrent versions."
      },
      {
        "id": "cs-3",
        "title": "Cost control",
        "body": "Use this to stop old versions growing forever."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No noncurrent version",
        "body": "Upload the same object key more than once after versioning is enabled."
      },
      {
        "id": "ts-2",
        "title": "Bucket will not delete",
        "body": "Delete all versions and delete markers first."
      },
      {
        "id": "ts-3",
        "title": "Rule does not act immediately",
        "body": "Lifecycle actions run later. Check the configuration, not instant deletion."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Versioning increases storage",
        "body": "Old versions still cost money until deleted."
      },
      {
        "id": "trap-2",
        "title": "Current vs noncurrent",
        "body": "Deleting noncurrent versions does not delete the current version."
      },
      {
        "id": "trap-3",
        "title": "Permanent deletion",
        "body": "Lifecycle expiration of noncurrent versions permanently removes them."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Old versions need rules. Versioning keeps history. Lifecycle clears old history.",
    "flashcardSetId": "s3_task_19_flashcards"
  },
  {
    "id": "task-saa-s3-set-up-same-region-replication-between-two-s3-buckets-020",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Set up same-region replication between two S3 buckets",
    "slug": "set-up-same-region-replication-between-two-s3-buckets",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create two S3 buckets in the same Region and configure Same-Region Replication from source to destination.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Same-Region Replication",
        "body": "Same-Region Replication copies new objects from one S3 bucket to another in the same AWS Region."
      },
      {
        "id": "concept-2",
        "title": "Versioning required",
        "body": "Replication requires versioning on both the source and destination buckets."
      },
      {
        "id": "concept-3",
        "title": "IAM role required",
        "body": "S3 uses an IAM role to read from the source bucket and write to the destination bucket."
      }
    ],
    "whyItMatters": "This lab shows how S3 can automatically copy objects for compliance, log aggregation, or same-Region backup patterns.",
    "values": [
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source bucket",
        "value": "saa-s3-task20-source-[account-id]"
      },
      {
        "label": "Destination bucket",
        "value": "saa-s3-task20-destination-[account-id]"
      },
      {
        "label": "Replication rule",
        "value": "same-region-replication"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, S3 versioning, S3 replication configuration, IAM replication role setup, object access, and cleanup permissions. Exact actions are grouped in Console step 0."
      }
    ],
    "costWarning": "This lab should cost little with small files. Replication stores another copy, so storage cost doubles for replicated objects. Delete both buckets and the role when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket, s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 versioning permissions: s3:PutBucketVersioning, s3:GetBucketVersioning, s3:ListBucketVersions"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 replication permissions: s3:PutReplicationConfiguration, s3:GetReplicationConfiguration, s3:DeleteReplicationConfiguration"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:GetObjectVersion, s3:ReplicateObject, s3:ReplicateDelete, s3:ReplicateTags, s3:DeleteObject, s3:DeleteObjectVersion"
          },
          {
            "id": "console-step-1-item-10",
            "text": "IAM role permissions: iam:CreateRole, iam:GetRole, iam:PassRole, iam:PutRolePolicy, iam:GetRolePolicy, iam:DeleteRolePolicy, iam:DeleteRole"
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
        "title": "Create the source and destination buckets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create source bucket saa-s3-task20-source-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create destination bucket saa-s3-task20-destination-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Keep Block Public Access on for both buckets."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Turn on versioning for both buckets",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open the Properties tab."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Turn on Bucket Versioning."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Repeat the same for the destination bucket."
          }
        ],
        "note": "S3 replication requires versioning on both buckets.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the replication rule",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open the Management tab."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Create replication rule."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Name it same-region-replication."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose to apply the rule to all objects."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose the destination bucket saa-s3-task20-destination-[account-id]."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Create a new IAM role when prompted."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Save the rule."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Upload a test object",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Upload srr-test.txt."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Wait a few minutes."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Open the destination bucket."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Confirm the object appears there."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Check replication status",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the source object details."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Look for the replication status."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Expected status becomes COMPLETED after replication finishes."
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
            "text": "Delete the replication rule from the source bucket."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete replicated objects and all versions from the destination bucket."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete source objects and all versions from the source bucket."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the IAM replication role if you created one only for this lab."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the destination bucket."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the source bucket."
          }
        ],
        "note": null,
        "warning": "Delete object versions before deleting versioned buckets.",
        "expectedResult": "Step 7 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set variables and create buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SOURCE=saa-s3-task20-source-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "DEST=saa-s3-task20-destination-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "ROLE_NAME=saa-s3-task20-replication-role"
          },
          {
            "id": "cli-step-2-cmd-6",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $SOURCE --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          },
          {
            "id": "cli-step-2-cmd-7",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $DEST --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Enable versioning on both buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning --bucket $SOURCE --versioning-configuration Status=Enabled"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning --bucket $DEST --versioning-configuration Status=Enabled"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "aws s3api get-bucket-versioning --bucket $SOURCE"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "aws s3api get-bucket-versioning --bucket $DEST"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the replication IAM role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > trust-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": {\n        \"Service\": \"s3.amazonaws.com\"\n      },\n      \"Action\": \"sts:AssumeRole\"\n    }\n  ]\n}\nEOF\naws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://trust-policy.json\nROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query Role.Arn --output text)"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Attach the replication permissions policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > replication-role-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\n        \"s3:GetReplicationConfiguration\",\n        \"s3:ListBucket\"\n      ],\n      \"Resource\": \"arn:aws:s3:::$SOURCE\"\n    },\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\n        \"s3:GetObjectVersion\",\n        \"s3:GetObjectVersionAcl\",\n        \"s3:GetObjectVersionTagging\"\n      ],\n      \"Resource\": \"arn:aws:s3:::$SOURCE/*\"\n    },\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\n        \"s3:ReplicateObject\",\n        \"s3:ReplicateDelete\",\n        \"s3:ReplicateTags\"\n      ],\n      \"Resource\": \"arn:aws:s3:::$DEST/*\"\n    }\n  ]\n}\nEOF\naws iam put-role-policy --role-name $ROLE_NAME --policy-name s3-task20-replication-policy --policy-document file://replication-role-policy.json"
          }
        ],
        "note": "Wait about 30 seconds before adding the replication rule, so IAM role propagation can complete.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Add the replication rule to the source bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query Role.Arn --output text)\ncat > replication.json <<EOF\n{\n  \"Role\": \"$ROLE_ARN\",\n  \"Rules\": [\n    {\n      \"ID\": \"same-region-replication\",\n      \"Status\": \"Enabled\",\n      \"Priority\": 1,\n      \"DeleteMarkerReplication\": {\n        \"Status\": \"Disabled\"\n      },\n      \"Filter\": {\n        \"Prefix\": \"\"\n      },\n      \"Destination\": {\n        \"Bucket\": \"arn:aws:s3:::$DEST\",\n        \"StorageClass\": \"STANDARD\"\n      }\n    }\n  ]\n}\nEOF\naws s3api put-bucket-replication --bucket $SOURCE --replication-configuration file://replication.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Upload a test file and check destination",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "echo 'same-region replication test' > srr-test.txt"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws s3 cp srr-test.txt s3://$SOURCE/srr-test.txt"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "aws s3 ls s3://$DEST/"
          }
        ],
        "note": "Replication can take a few minutes. Run the list command again if the object is not there yet.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Check the replication configuration",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-replication --bucket $SOURCE"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Tear down",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-bucket-replication --bucket $SOURCE\nfor B in $SOURCE $DEST; do\n  aws s3api list-object-versions --bucket $B --output json > versions-$B.json\n  python - <<PY\nimport json, subprocess\nbucket='$B'\ndata=json.load(open('versions-$B.json'))\nitems=[]\nfor v in data.get('Versions',[]):\n    items.append({'Key':v['Key'],'VersionId':v['VersionId']})\nfor m in data.get('DeleteMarkers',[]):\n    items.append({'Key':m['Key'],'VersionId':m['VersionId']})\nif items:\n    open('delete-'+bucket+'.json','w').write(json.dumps({'Objects':items,'Quiet':False}))\n    subprocess.run(['aws','s3api','delete-objects','--bucket',bucket,'--delete','file://delete-'+bucket+'.json'],check=True)\nPY\ndone\naws iam delete-role-policy --role-name $ROLE_NAME --policy-name s3-task20-replication-policy\naws iam delete-role --role-name $ROLE_NAME\naws s3api delete-bucket --bucket $DEST --region $REGION\naws s3api delete-bucket --bucket $SOURCE --region $REGION"
          }
        ],
        "note": "This removes replication first, then versions, then IAM role, then buckets.",
        "warning": null,
        "expectedResult": "CLI command step 9 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
      },
      {
        "id": "verify-5",
        "text": "Verify that server-side encryption and access logging are enabled as specified."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Replication copies new objects",
        "body": "S3 replication normally applies to new objects uploaded after the rule is enabled."
      },
      {
        "id": "cs-2",
        "title": "Versioning is required",
        "body": "Both source and destination buckets must have versioning enabled."
      },
      {
        "id": "cs-3",
        "title": "IAM role does the copying",
        "body": "S3 assumes a role to replicate objects."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Object not copied yet",
        "body": "Wait a few minutes. Replication is asynchronous."
      },
      {
        "id": "ts-2",
        "title": "Replication rule fails",
        "body": "Check versioning on both buckets and the IAM role permissions."
      },
      {
        "id": "ts-3",
        "title": "Bucket delete fails",
        "body": "Delete all object versions and delete markers before deleting versioned buckets."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Existing objects trap",
        "body": "A new replication rule does not automatically copy old objects unless you use batch replication."
      },
      {
        "id": "trap-2",
        "title": "Versioning trap",
        "body": "Replication needs versioning on both buckets."
      },
      {
        "id": "trap-3",
        "title": "Delete marker trap",
        "body": "Delete marker replication is a separate setting."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Source writes, S3 copies. Replication uses a role to copy new objects to the destination.",
    "flashcardSetId": "s3_task_20_flashcards"
  },
  {
    "id": "task-saa-s3-upload-a-file-and-confirm-same-region-replication-copies-it-021",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Upload a file and confirm same-region replication copies it",
    "slug": "upload-a-file-and-confirm-same-region-replication-copies-it",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Upload a new object to a source bucket and confirm S3 copies it to the destination bucket in the same Region.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Same-Region Replication",
        "body": "Same-Region Replication copies new objects from one bucket to another bucket in the same AWS Region."
      },
      {
        "id": "concept-2",
        "title": "Replication is not instant",
        "body": "Replication usually happens quickly, but it is asynchronous. Wait a short time before checking the destination bucket."
      },
      {
        "id": "concept-3",
        "title": "Only new objects replicate",
        "body": "Objects uploaded before the rule was created are not copied by the live replication rule unless batch replication is used."
      },
      {
        "id": "concept-4",
        "title": "Permissions matter",
        "body": "The lab identity uploads and checks objects. The replication role does the background copy."
      }
    ],
    "whyItMatters": "This lab proves that replication is a background copy process. It helps you understand backups, compliance copies, and exam questions about asynchronous S3 replication.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-21.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 object upload, replication check, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Source bucket",
        "value": "saa-s3-task20-source-[account-id]"
      },
      {
        "label": "Destination bucket",
        "value": "saa-s3-task20-destination-[account-id]"
      },
      {
        "label": "Test object",
        "value": "task21-srr-test.txt"
      },
      {
        "label": "Assumption",
        "value": "Task 20 replication buckets and rule already exist."
      }
    ],
    "costWarning": "This lab should cost very little. You may pay small S3 storage and request charges. Delete test objects when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 versioning permissions: s3:GetBucketVersioning"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 replication permissions: s3:GetReplicationConfiguration"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Open the source bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open the source bucket from Task 20: saa-s3-task20-source-[account-id]."
          }
        ],
        "note": "This task uses the replication setup from Task 20.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload a test file",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Add files."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create and select a small file named task21-srr-test.txt."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Upload."
          }
        ],
        "note": "The file must be uploaded after the replication rule exists.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Check the destination bucket",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Go back to Buckets."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open saa-s3-task20-destination-[account-id]."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Wait a short time."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Refresh the object list."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Confirm task21-srr-test.txt appears."
          }
        ],
        "note": "Replication is asynchronous, so it may not appear immediately.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down the test object",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Delete task21-srr-test.txt from the destination bucket first."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Delete task21-srr-test.txt from the source bucket."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Keep the buckets if you still need them for later replication tasks."
          }
        ],
        "note": null,
        "warning": "Do not delete the Task 20 buckets yet if you plan to use them again.",
        "expectedResult": "Step 5 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "SRC_BUCKET=saa-s3-task20-source-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "DEST_BUCKET=saa-s3-task20-destination-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "echo \"source=$SRC_BUCKET destination=$DEST_BUCKET\""
          }
        ],
        "note": "These names match the Task 20 example names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Upload a new test file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "echo \"same-region replication test\" > task21-srr-test.txt"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3 cp task21-srr-test.txt s3://$SRC_BUCKET/task21-srr-test.txt"
          }
        ],
        "note": "Only new uploads are tested here.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Check the destination bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3 ls s3://$DEST_BUCKET/task21-srr-test.txt"
          }
        ],
        "note": "If the object is not shown, wait and run the command again.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Tear down the test object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3 rm s3://$DEST_BUCKET/task21-srr-test.txt"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$SRC_BUCKET/task21-srr-test.txt"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "rm -f task21-srr-test.txt"
          }
        ],
        "note": "This removes only the test object.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
        "title": "Replication copy",
        "body": "S3 replication copies objects after upload. It is not a move."
      },
      {
        "id": "cs-2",
        "title": "Same Region",
        "body": "SRR keeps both buckets in the same AWS Region."
      },
      {
        "id": "cs-3",
        "title": "Asynchronous",
        "body": "Do not expect instant copying. Wait and refresh."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Object does not appear",
        "body": "Wait a few minutes. Replication is asynchronous."
      },
      {
        "id": "ts-2",
        "title": "Upload works but no copy",
        "body": "Check that the Task 20 replication rule is enabled and versioning is on for both buckets."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check the lab identity has the grouped S3 permissions in Console step 0."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Old objects trap",
        "body": "Live replication does not automatically copy old objects that existed before the rule."
      },
      {
        "id": "trap-2",
        "title": "Delete trap",
        "body": "Deleting an object is not the same as confirming replication of a new upload."
      },
      {
        "id": "trap-3",
        "title": "Region trap",
        "body": "Same-Region Replication means both buckets are in the same AWS Region."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Upload, wait, check. Replication copies after the object is written.",
    "flashcardSetId": "s3_task_21_flashcards"
  },
  {
    "id": "task-saa-s3-set-up-cross-region-replication-between-two-s3-buckets-022",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Set up cross-region replication between two S3 buckets",
    "slug": "set-up-cross-region-replication-between-two-s3-buckets",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Create two versioned buckets in different Regions and configure S3 Cross-Region Replication from source to destination.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Cross-Region Replication",
        "body": "Cross-Region Replication copies new objects from a source bucket to a destination bucket in a different AWS Region."
      },
      {
        "id": "concept-2",
        "title": "Versioning is required",
        "body": "S3 replication needs versioning enabled on both the source and destination buckets."
      },
      {
        "id": "concept-3",
        "title": "Replication role",
        "body": "S3 uses an IAM role to read from the source bucket and write to the destination bucket."
      },
      {
        "id": "concept-4",
        "title": "New objects only",
        "body": "The rule applies to new objects uploaded after the rule is enabled."
      }
    ],
    "whyItMatters": "This lab shows how S3 can copy data to another Region for resilience, compliance, or latency needs.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-22.html"
      },
      {
        "label": "Required permissions summary",
        "value": "IAM role setup, S3 bucket setup, S3 versioning, S3 replication config, object access, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Source Region",
        "value": "eu-west-2"
      },
      {
        "label": "Destination Region",
        "value": "eu-west-1"
      },
      {
        "label": "Source bucket",
        "value": "saa-s3-task22-source-[account-id]"
      },
      {
        "label": "Destination bucket",
        "value": "saa-s3-task22-destination-[account-id]"
      },
      {
        "label": "Replication role",
        "value": "saa-s3-task22-replication-role"
      },
      {
        "label": "Replication policy",
        "value": "saa-s3-task22-replication-policy"
      }
    ],
    "costWarning": "This lab can create small S3 storage and request charges in two Regions. Delete the objects, replication rule, IAM policy, IAM role, and buckets when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "IAM role permissions: iam:CreateRole, iam:GetRole, iam:PassRole, iam:DeleteRole"
          },
          {
            "id": "console-step-1-item-7",
            "text": "IAM policy permissions: iam:CreatePolicy, iam:GetPolicy, iam:GetPolicyVersion, iam:AttachRolePolicy, iam:DetachRolePolicy, iam:DeletePolicy"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 versioning permissions: s3:PutBucketVersioning, s3:GetBucketVersioning"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 replication permissions: s3:PutReplicationConfiguration, s3:GetReplicationConfiguration, s3:DeleteReplicationConfiguration"
          },
          {
            "id": "console-step-1-item-11",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-12",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-13",
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
        "title": "Create the source bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Set Region to Europe (London) eu-west-2."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use bucket name saa-s3-task22-source-[account-id]."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Block Public Access on."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create the bucket."
          }
        ],
        "note": "Bucket names must be globally unique.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the destination bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set Region to Europe (Ireland) eu-west-1."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Use bucket name saa-s3-task22-destination-[account-id]."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep Block Public Access on."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Create the bucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Enable versioning on both buckets",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open Properties."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Under Bucket Versioning, choose Edit."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Enable, then save."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Repeat the same steps for the destination bucket."
          }
        ],
        "note": "Replication will not work unless versioning is enabled on both buckets.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the replication rule",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Open Management."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Under Replication rules, choose Create replication rule."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Name the rule task22-crr-rule."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Set status to Enabled."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Choose to apply the rule to all objects in the bucket."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Choose the destination bucket saa-s3-task22-destination-[account-id]."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Choose Create new role if prompted."
          },
          {
            "id": "console-step-5-item-9",
            "text": "Save the rule."
          }
        ],
        "note": "The destination bucket is in a different Region, so this is Cross-Region Replication.",
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
            "text": "Open the source bucket and delete the replication rule first."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Empty the source bucket."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Empty the destination bucket."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the source bucket."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the destination bucket."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Open IAM."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Detach and delete the replication policy if you created one manually."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Delete the replication role."
          }
        ],
        "note": null,
        "warning": "Delete objects before deleting buckets.",
        "expectedResult": "Step 6 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "SRC_BUCKET=saa-s3-task22-source-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "DEST_BUCKET=saa-s3-task22-destination-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "ROLE_NAME=saa-s3-task22-replication-role"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "POLICY_NAME=saa-s3-task22-replication-policy"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create source and destination buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $SRC_BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $DEST_BUCKET --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Enable versioning on both buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning --bucket $SRC_BUCKET --versioning-configuration Status=Enabled"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning --bucket $DEST_BUCKET --versioning-configuration Status=Enabled"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create the replication role trust file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > task22-trust.json <<'EOF'\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": {\"Service\": \"s3.amazonaws.com\"},\n      \"Action\": \"sts:AssumeRole\"\n    }\n  ]\n}\nEOF"
          }
        ],
        "note": "This lets Amazon S3 assume the role.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the replication role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://task22-trust.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Create and attach the replication policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "cat > task22-replication-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetReplicationConfiguration\", \"s3:ListBucket\"],\n      \"Resource\": \"arn:aws:s3:::$SRC_BUCKET\"\n    },\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetObjectVersionForReplication\", \"s3:GetObjectVersionAcl\", \"s3:GetObjectVersionTagging\"],\n      \"Resource\": \"arn:aws:s3:::$SRC_BUCKET/*\"\n    },\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:ReplicateObject\", \"s3:ReplicateDelete\", \"s3:ReplicateTags\"],\n      \"Resource\": \"arn:aws:s3:::$DEST_BUCKET/*\"\n    }\n  ]\n}\nEOF"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "POLICY_ARN=$(aws iam create-policy --policy-name $POLICY_NAME --policy-document file://task22-replication-policy.json --query Policy.Arn --output text)"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn $POLICY_ARN"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Create the replication configuration",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query Role.Arn --output text)"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "cat > task22-replication.json <<EOF\n{\n  \"Role\": \"$ROLE_ARN\",\n  \"Rules\": [\n    {\n      \"ID\": \"task22-crr-rule\",\n      \"Status\": \"Enabled\",\n      \"Priority\": 1,\n      \"DeleteMarkerReplication\": {\"Status\": \"Disabled\"},\n      \"Filter\": {\"Prefix\": \"\"},\n      \"Destination\": {\"Bucket\": \"arn:aws:s3:::$DEST_BUCKET\"}\n    }\n  ]\n}\nEOF"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "aws s3api put-bucket-replication --bucket $SRC_BUCKET --replication-configuration file://task22-replication.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Verify the replication rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-replication --bucket $SRC_BUCKET"
          }
        ],
        "note": "Expected: you see task22-crr-rule.",
        "warning": null,
        "expectedResult": "Expected: you see task22-crr-rule."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Tear down in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-bucket-replication --bucket $SRC_BUCKET"
          },
          {
            "id": "cli-step-10-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$SRC_BUCKET --recursive"
          },
          {
            "id": "cli-step-10-cmd-3",
            "language": "bash",
            "text": "aws s3 rm s3://$DEST_BUCKET --recursive"
          },
          {
            "id": "cli-step-10-cmd-4",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $SRC_BUCKET --region eu-west-2"
          },
          {
            "id": "cli-step-10-cmd-5",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $DEST_BUCKET --region eu-west-1"
          },
          {
            "id": "cli-step-10-cmd-6",
            "language": "bash",
            "text": "aws iam detach-role-policy --role-name $ROLE_NAME --policy-arn $POLICY_ARN"
          },
          {
            "id": "cli-step-10-cmd-7",
            "language": "bash",
            "text": "aws iam delete-policy --policy-arn $POLICY_ARN"
          },
          {
            "id": "cli-step-10-cmd-8",
            "language": "bash",
            "text": "aws iam delete-role --role-name $ROLE_NAME"
          },
          {
            "id": "cli-step-10-cmd-9",
            "language": "bash",
            "text": "rm -f task22-trust.json task22-replication-policy.json task22-replication.json"
          }
        ],
        "note": null,
        "warning": "This deletes the replication setup.",
        "expectedResult": "CLI command step 10 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
        "title": "CRR",
        "body": "Cross-Region Replication copies new objects to a bucket in another AWS Region."
      },
      {
        "id": "cs-2",
        "title": "Versioning",
        "body": "Both buckets must have versioning enabled."
      },
      {
        "id": "cs-3",
        "title": "IAM role",
        "body": "S3 needs a role so it can copy objects for you."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Cannot save replication rule",
        "body": "Check versioning is enabled on both buckets and the role has the correct permissions."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied on role",
        "body": "Check iam:PassRole and the S3 replication permissions in Console step 0."
      },
      {
        "id": "ts-3",
        "title": "Bucket name already exists",
        "body": "Add your account ID or a short random word to the bucket names."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Versioning trap",
        "body": "Replication requires versioning on both source and destination buckets."
      },
      {
        "id": "trap-2",
        "title": "Region trap",
        "body": "CRR means the destination bucket is in a different AWS Region."
      },
      {
        "id": "trap-3",
        "title": "Old object trap",
        "body": "The rule copies new objects, not old objects already in the bucket."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Cross Region = cross border copy. CRR sends new objects to another AWS Region.",
    "flashcardSetId": "s3_task_22_flashcards"
  },
  {
    "id": "task-saa-s3-upload-a-file-and-confirm-cross-region-replication-copies-it-023",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Upload a file and confirm cross-region replication copies it",
    "slug": "upload-a-file-and-confirm-cross-region-replication-copies-it",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Upload a new object to the source bucket and confirm S3 copies it to the destination bucket in another Region.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Cross-Region copy",
        "body": "Cross-Region Replication copies new objects to a bucket in another AWS Region."
      },
      {
        "id": "concept-2",
        "title": "Replication delay",
        "body": "Replication is asynchronous. The object may not appear straight away."
      },
      {
        "id": "concept-3",
        "title": "Different Region check",
        "body": "You must check the destination bucket in its own Region."
      },
      {
        "id": "concept-4",
        "title": "Task dependency",
        "body": "This task assumes Task 22 already created the CRR rule."
      }
    ],
    "whyItMatters": "This lab confirms that the CRR rule works. It helps you see the difference between setting up replication and proving replication works.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-23.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 object upload, cross-Region replication check, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Source Region",
        "value": "eu-west-2"
      },
      {
        "label": "Destination Region",
        "value": "eu-west-1"
      },
      {
        "label": "Source bucket",
        "value": "saa-s3-task22-source-[account-id]"
      },
      {
        "label": "Destination bucket",
        "value": "saa-s3-task22-destination-[account-id]"
      },
      {
        "label": "Test object",
        "value": "task23-crr-test.txt"
      },
      {
        "label": "Assumption",
        "value": "Task 22 Cross-Region Replication is already configured."
      }
    ],
    "costWarning": "This lab should cost very little. It may create small S3 storage, request, and cross-Region data transfer charges. Delete the test objects when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 versioning permissions: s3:GetBucketVersioning"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 replication permissions: s3:GetReplicationConfiguration"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Open the source bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "In Region eu-west-2, open saa-s3-task22-source-[account-id]."
          }
        ],
        "note": "This uses the CRR setup from Task 22.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload a test file",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Add files."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create and select a small file named task23-crr-test.txt."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Upload."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Check the destination bucket in the other Region",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Go back to Buckets."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open saa-s3-task22-destination-[account-id]."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Confirm the destination bucket is in eu-west-1."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Wait a short time and refresh."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Confirm task23-crr-test.txt appears."
          }
        ],
        "note": "Cross-Region Replication may take a little time.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down the test object",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Delete task23-crr-test.txt from the destination bucket first."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Delete task23-crr-test.txt from the source bucket."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Keep the buckets if you still need them for later tasks."
          }
        ],
        "note": null,
        "warning": "This removes only the test file, not the full replication setup.",
        "expectedResult": "Step 5 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "SRC_BUCKET=saa-s3-task22-source-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "DEST_BUCKET=saa-s3-task22-destination-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Upload a new test file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "echo \"cross-region replication test\" > task23-crr-test.txt"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3 cp task23-crr-test.txt s3://$SRC_BUCKET/task23-crr-test.txt --region eu-west-2"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Check the destination bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3 ls s3://$DEST_BUCKET/task23-crr-test.txt --region eu-west-1"
          }
        ],
        "note": "If the object is not shown, wait and run the command again.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Tear down the test object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3 rm s3://$DEST_BUCKET/task23-crr-test.txt --region eu-west-1"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$SRC_BUCKET/task23-crr-test.txt --region eu-west-2"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "rm -f task23-crr-test.txt"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
        "title": "CRR test",
        "body": "A successful CRR test proves a new object was copied to another Region."
      },
      {
        "id": "cs-2",
        "title": "Different Region",
        "body": "Always check the destination bucket in the destination Region."
      },
      {
        "id": "cs-3",
        "title": "Delay",
        "body": "Replication is asynchronous, so a short delay is normal."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Object missing",
        "body": "Wait and refresh. Then check that Task 22 replication is enabled."
      },
      {
        "id": "ts-2",
        "title": "Wrong bucket checked",
        "body": "Make sure you are looking at the destination bucket, not the source bucket."
      },
      {
        "id": "ts-3",
        "title": "Wrong Region",
        "body": "Use eu-west-1 for the destination bucket in this lab."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Instant copy trap",
        "body": "S3 replication is not guaranteed to be instant."
      },
      {
        "id": "trap-2",
        "title": "Existing object trap",
        "body": "Upload a new object after the rule exists."
      },
      {
        "id": "trap-3",
        "title": "SRR vs CRR trap",
        "body": "CRR copies to another Region. SRR copies in the same Region."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Other Region, same object. CRR creates a copy outside the source Region.",
    "flashcardSetId": "s3_task_23_flashcards"
  },
  {
    "id": "task-saa-s3-upload-a-large-file-and-notice-how-s3-uses-multipart-upload-024",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Upload a large file and notice how S3 uses multipart upload",
    "slug": "upload-a-large-file-and-notice-how-s3-uses-multipart-upload",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Upload a large file to S3 and inspect multipart upload behaviour using the AWS CLI.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Multipart upload",
        "body": "Multipart upload splits a large object into parts, uploads the parts, and then completes the object."
      },
      {
        "id": "concept-2",
        "title": "Why it helps",
        "body": "Multipart upload can improve large upload reliability because failed parts can be retried."
      },
      {
        "id": "concept-3",
        "title": "High-level CLI",
        "body": "The high-level aws s3 cp command can use multipart upload automatically for large files."
      },
      {
        "id": "concept-4",
        "title": "Incomplete uploads",
        "body": "A failed multipart upload can leave parts behind until they are aborted or cleaned up."
      }
    ],
    "whyItMatters": "This lab helps you understand why large S3 uploads work differently from small uploads and why multipart upload is important for performance and reliability.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-24.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, object upload, multipart inspection, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task24-multipart-[account-id]"
      },
      {
        "label": "Large file",
        "value": "task24-large-file.bin"
      },
      {
        "label": "Example size",
        "value": "128 MB"
      }
    ],
    "costWarning": "This lab should cost very little if you delete the large object and bucket after testing. Large files can create storage and request charges if left behind.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 multipart permissions: s3:AbortMultipartUpload, s3:ListBucketMultipartUploads, s3:ListMultipartUploadParts"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create a test bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use name saa-s3-task24-multipart-[account-id]."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Region to eu-west-2."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Keep Block Public Access on."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Create the bucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload a large file from your computer",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create or choose a large test file, such as a 128 MB file."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Add the large file."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Watch the upload progress."
          }
        ],
        "note": "The Console hides most multipart details, but large uploads may use multipart behaviour behind the scenes.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Confirm the object exists",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the bucket object list."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Confirm task24-large-file.bin or your chosen large file exists."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Open the object details and check the size."
          }
        ],
        "note": null,
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
            "text": "Delete the large object first."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Check there are no objects left in the bucket."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Delete the bucket."
          }
        ],
        "note": null,
        "warning": "Do not leave large test files in S3.",
        "expectedResult": "Step 5 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "BUCKET=saa-s3-task24-multipart-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a large test file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "python -c \"with open('task24-large-file.bin','wb') as f: f.write(b'0' * 128 * 1024 * 1024)\""
          }
        ],
        "note": "This creates a 128 MB file in the current folder.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Upload the large file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3 cp task24-large-file.bin s3://$BUCKET/task24-large-file.bin"
          }
        ],
        "note": "The high-level AWS CLI can automatically use multipart upload for large files.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Check the object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api head-object --bucket $BUCKET --key task24-large-file.bin --query '{Size:ContentLength,ETag:ETag}'"
          }
        ],
        "note": "Multipart-uploaded objects often have an ETag with a dash and part count, but do not rely on ETag as a security checksum.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Check for incomplete multipart uploads",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3api list-multipart-uploads --bucket $BUCKET"
          }
        ],
        "note": "Expected after a clean upload: no active incomplete multipart uploads.",
        "warning": null,
        "expectedResult": "Expected after a clean upload: no active incomplete multipart uploads."
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
            "text": "aws s3 rm s3://$BUCKET/task24-large-file.bin"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region eu-west-2"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "rm -f task24-large-file.bin"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
      },
      {
        "id": "verify-5",
        "text": "Verify that server-side encryption and access logging are enabled as specified."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Multipart purpose",
        "body": "Multipart upload helps with large objects and retries."
      },
      {
        "id": "cs-2",
        "title": "Three stages",
        "body": "Start upload, upload parts, complete upload."
      },
      {
        "id": "cs-3",
        "title": "Cleanup",
        "body": "Failed multipart uploads should be aborted or cleaned up by lifecycle rules."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Python command fails",
        "body": "Use another method to create a large test file, or upload any large local file."
      },
      {
        "id": "ts-2",
        "title": "Upload is slow",
        "body": "Large uploads depend on your internet speed. Use a smaller file if needed."
      },
      {
        "id": "ts-3",
        "title": "Bucket not empty",
        "body": "Delete the object and any incomplete multipart uploads before deleting the bucket."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Multipart is not a storage class",
        "body": "Multipart upload is an upload method, not an S3 storage class."
      },
      {
        "id": "trap-2",
        "title": "ETag trap",
        "body": "For multipart uploads, the ETag may not be a simple MD5 checksum."
      },
      {
        "id": "trap-3",
        "title": "Incomplete upload trap",
        "body": "Incomplete multipart uploads can create storage charges for uploaded parts."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Big file = small parts. Multipart upload breaks one big object into uploadable pieces.",
    "flashcardSetId": "s3_task_24_flashcards"
  },
  {
    "id": "task-saa-s3-turn-on-s3-transfer-acceleration-and-compare-the-upload-endpoint-025",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Turn on S3 Transfer Acceleration and compare the upload endpoint",
    "slug": "turn-on-s3-transfer-acceleration-and-compare-the-upload-endpoint",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Enable S3 Transfer Acceleration and compare the standard S3 endpoint with the accelerate endpoint.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Transfer Acceleration",
        "body": "S3 Transfer Acceleration sends uploads through Amazon CloudFront edge locations and then over the AWS network to S3."
      },
      {
        "id": "concept-2",
        "title": "Accelerate endpoint",
        "body": "The accelerate endpoint uses this format: bucket-name.s3-accelerate.amazonaws.com."
      },
      {
        "id": "concept-3",
        "title": "When it helps",
        "body": "It is most useful for long-distance uploads to a bucket."
      },
      {
        "id": "concept-4",
        "title": "Bucket name rule",
        "body": "The bucket name must be DNS-compatible and must not contain periods for Transfer Acceleration."
      }
    ],
    "whyItMatters": "This lab helps you recognise when S3 Transfer Acceleration is useful and how its endpoint differs from normal regional S3 access.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-25.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, Transfer Acceleration config, object upload, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task25-accelerate-[account-id]"
      },
      {
        "label": "Standard endpoint pattern",
        "value": "bucket-name.s3.eu-west-2.amazonaws.com"
      },
      {
        "label": "Accelerate endpoint pattern",
        "value": "bucket-name.s3-accelerate.amazonaws.com"
      }
    ],
    "costWarning": "S3 Transfer Acceleration may add transfer acceleration charges when used. This lab should cost little if you upload only a tiny test file and delete the bucket.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 acceleration permissions: s3:PutAccelerateConfiguration, s3:GetAccelerateConfiguration"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create a bucket with a compatible name",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use name saa-s3-task25-accelerate-[account-id]."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Region to eu-west-2."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Do not use periods in the bucket name."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Keep Block Public Access on."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Create the bucket."
          }
        ],
        "note": "Transfer Acceleration does not support bucket names with periods.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Turn on Transfer Acceleration",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open Properties."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Find Transfer acceleration."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose Enable."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Save changes."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Compare the endpoints",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Write down the normal regional endpoint pattern: saa-s3-task25-accelerate-[account-id].s3.eu-west-2.amazonaws.com."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Write down the accelerate endpoint pattern: saa-s3-task25-accelerate-[account-id].s3-accelerate.amazonaws.com."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Notice that the accelerate endpoint does not include the Region name."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Upload a test file",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the bucket object list."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Upload a small file named task25-accelerate-test.txt."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm the object appears in the bucket."
          }
        ],
        "note": "This confirms the bucket still works normally after acceleration is enabled.",
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
            "text": "Delete task25-accelerate-test.txt."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Disable Transfer acceleration if the bucket will stay around."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the bucket."
          }
        ],
        "note": null,
        "warning": "Do not leave acceleration enabled unless you need it.",
        "expectedResult": "Step 6 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "BUCKET=saa-s3-task25-accelerate-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Enable Transfer Acceleration",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-accelerate-configuration --bucket $BUCKET --accelerate-configuration Status=Enabled"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Check the acceleration setting",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-accelerate-configuration --bucket $BUCKET"
          }
        ],
        "note": "Expected: Status is Enabled.",
        "warning": null,
        "expectedResult": "Expected: Status is Enabled."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Compare endpoint names",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "echo \"Standard endpoint: https://$BUCKET.s3.eu-west-2.amazonaws.com\""
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "echo \"Accelerate endpoint: https://$BUCKET.s3-accelerate.amazonaws.com\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Upload a test file using the accelerate endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "echo \"transfer acceleration test\" > task25-accelerate-test.txt"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws s3 cp task25-accelerate-test.txt s3://$BUCKET/task25-accelerate-test.txt --endpoint-url https://s3-accelerate.amazonaws.com"
          }
        ],
        "note": "The accelerate endpoint is global and does not include the Region in the hostname.",
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
            "text": "aws s3 rm s3://$BUCKET/task25-accelerate-test.txt"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws s3api put-bucket-accelerate-configuration --bucket $BUCKET --accelerate-configuration Status=Suspended"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region eu-west-2"
          },
          {
            "id": "cli-step-8-cmd-4",
            "language": "bash",
            "text": "rm -f task25-accelerate-test.txt"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
        "title": "Endpoint",
        "body": "Transfer Acceleration uses bucket-name.s3-accelerate.amazonaws.com."
      },
      {
        "id": "cs-2",
        "title": "Best use case",
        "body": "It helps most with long-distance transfers."
      },
      {
        "id": "cs-3",
        "title": "Cost",
        "body": "Acceleration can add extra transfer charges."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Cannot enable acceleration",
        "body": "Check the bucket name. It must not contain periods."
      },
      {
        "id": "ts-2",
        "title": "Upload endpoint fails",
        "body": "Check the bucket acceleration status is Enabled before using the accelerate endpoint."
      },
      {
        "id": "ts-3",
        "title": "No speed difference",
        "body": "Acceleration may not help for short-distance uploads or very small files."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Not CloudFront distribution trap",
        "body": "Transfer Acceleration uses CloudFront edge locations, but you do not create your own distribution."
      },
      {
        "id": "trap-2",
        "title": "Region trap",
        "body": "The accelerate endpoint does not include the bucket Region in the hostname."
      },
      {
        "id": "trap-3",
        "title": "Cost trap",
        "body": "Do not choose Transfer Acceleration unless faster long-distance transfer is worth the possible extra cost."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Far upload? Use the fast lane. Transfer Acceleration routes through edge locations.",
    "flashcardSetId": "s3_task_25_flashcards"
  },
  {
    "id": "task-saa-s3-create-an-s3-access-point-and-use-it-to-list-bucket-objects-026",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Create an S3 Access Point and use it to list bucket objects",
    "slug": "create-an-s3-access-point-and-use-it-to-list-bucket-objects",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an S3 Access Point for a bucket and list objects through the access point.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "S3 Access Point",
        "body": "An access point is a named entry point to a bucket. It can have its own policy and network settings."
      },
      {
        "id": "concept-2",
        "title": "Access point ARN",
        "body": "CLI object commands can use the access point ARN instead of the bucket name."
      },
      {
        "id": "concept-3",
        "title": "Why use one",
        "body": "Access points help separate access rules for different apps or teams that share one bucket."
      }
    ],
    "whyItMatters": "Access points are tested because they solve shared-bucket access problems without creating many separate buckets.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-26.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, S3 object access, S3 Access Point setup, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task26-ap-[account-id]"
      },
      {
        "label": "Access Point name",
        "value": "saa-task26-ap"
      },
      {
        "label": "Test object",
        "value": "task26-test.txt"
      }
    ],
    "costWarning": "This lab should cost very little. S3 storage costs are tiny for one small object. Delete the access point, object, and bucket after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 Access Point permissions: s3:CreateAccessPoint, s3:GetAccessPoint, s3:ListAccessPoints, s3:DeleteAccessPoint"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create the S3 bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use bucket name saa-s3-task26-ap-[account-id]."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Region to eu-west-2."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Keep Block Public Access on."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Create the bucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload two test objects",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Upload two small files."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Use names like task26-test.txt and task26-second.txt."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the Access Point",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In the S3 left menu, choose Access Points."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create access point."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Access point for general purpose buckets."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Use name saa-task26-ap."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose the bucket saa-s3-task26-ap-[account-id]."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Keep network origin set to Internet for this lab."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Keep Block Public Access settings on."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Create the access point."
          }
        ],
        "note": "This does not make the bucket public.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "List objects through the Access Point",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the access point."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Review the access point ARN."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Use the CLI path to list objects through the access point ARN."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm the object names are returned."
          }
        ],
        "note": "The Console is useful for setup. The CLI makes the access point listing clear.",
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
            "text": "Delete the access point first."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Go back to the bucket."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the test objects."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the bucket last."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "BUCKET=saa-s3-task26-ap-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "AP_NAME=saa-task26-ap"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "AP_ARN=arn:aws:s3:eu-west-2:$ACCOUNT_ID:accesspoint/$AP_NAME"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the bucket and upload objects",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "echo task26 object one > task26-test.txt"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "echo task26 object two > task26-second.txt"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "aws s3 cp task26-test.txt s3://$BUCKET/task26-test.txt"
          },
          {
            "id": "cli-step-3-cmd-5",
            "language": "bash",
            "text": "aws s3 cp task26-second.txt s3://$BUCKET/task26-second.txt"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the Access Point",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3control create-access-point --account-id $ACCOUNT_ID --name $AP_NAME --bucket $BUCKET --region eu-west-2"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "List objects through the Access Point ARN",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api list-objects-v2 --bucket $AP_ARN --query 'Contents[].Key' --output table"
          }
        ],
        "note": "Expected: the two object keys are listed.",
        "warning": null,
        "expectedResult": "Expected: the two object keys are listed."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3control delete-access-point --account-id $ACCOUNT_ID --name $AP_NAME --region eu-west-2"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET/task26-test.txt"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET/task26-second.txt"
          },
          {
            "id": "cli-step-6-cmd-4",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region eu-west-2"
          },
          {
            "id": "cli-step-6-cmd-5",
            "language": "bash",
            "text": "rm -f task26-test.txt task26-second.txt"
          }
        ],
        "note": null,
        "warning": null,
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
        "title": "Access point purpose",
        "body": "Use an access point when different apps need different access rules to the same bucket."
      },
      {
        "id": "cs-2",
        "title": "Not public by default",
        "body": "Creating an access point does not make objects public."
      },
      {
        "id": "cs-3",
        "title": "ARN can replace bucket name",
        "body": "Many S3 object operations can use an access point ARN as the bucket value."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "List command returns AccessDenied",
        "body": "The identity needs s3:ListBucket through the access point or bucket policy."
      },
      {
        "id": "ts-2",
        "title": "Access point name already exists",
        "body": "Access point names must be unique within the account and Region for the chosen bucket type."
      },
      {
        "id": "ts-3",
        "title": "Wrong ARN Region",
        "body": "The access point ARN must use the same Region as the access point."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Access Point is not replication",
        "body": "It is an access entry point. It does not copy data."
      },
      {
        "id": "trap-2",
        "title": "Access Point is not CloudFront",
        "body": "It does not cache content. It controls S3 access."
      },
      {
        "id": "trap-3",
        "title": "VPC-only option",
        "body": "Some access points can be restricted to VPC access. This lab uses Internet origin for simplicity."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Access Point = named door. The bucket is the building. The access point is a controlled door into it.",
    "flashcardSetId": "s3_task_26_flashcards"
  },
  {
    "id": "task-saa-s3-create-a-multi-region-access-point-for-buckets-in-different-regions-027",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Create a Multi-Region Access Point for buckets in different Regions",
    "slug": "create-a-multi-region-access-point-for-buckets-in-different-regions",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Create a Multi-Region Access Point for two S3 buckets in different Regions.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Multi-Region Access Point",
        "body": "A Multi-Region Access Point gives one global endpoint for buckets in multiple AWS Regions."
      },
      {
        "id": "concept-2",
        "title": "Routing",
        "body": "S3 can route requests to an associated bucket based on AWS global routing."
      },
      {
        "id": "concept-3",
        "title": "Async setup",
        "body": "Creating or deleting a Multi-Region Access Point is an asynchronous operation and can take time."
      }
    ],
    "whyItMatters": "Multi-Region Access Points matter when applications need one S3 endpoint across Regions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-27.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, S3 Multi-Region Access Point setup, S3 object testing, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Primary bucket",
        "value": "saa-s3-task27-primary-[account-id]"
      },
      {
        "label": "Secondary bucket",
        "value": "saa-s3-task27-secondary-[account-id]"
      },
      {
        "label": "Primary Region",
        "value": "eu-west-2"
      },
      {
        "label": "Secondary Region",
        "value": "eu-west-1"
      },
      {
        "label": "Multi-Region Access Point name",
        "value": "saa-task27-mrap-[account-id]"
      }
    ],
    "costWarning": "This lab can create small S3 and Multi-Region Access Point charges. Delete the Multi-Region Access Point and buckets after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 Multi-Region Access Point permissions: s3:CreateMultiRegionAccessPoint, s3:GetMultiRegionAccessPoint, s3:ListMultiRegionAccessPoints, s3:DescribeMultiRegionAccessPointOperation, s3:DeleteMultiRegionAccessPoint"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create two buckets in different Regions",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create bucket saa-s3-task27-primary-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create bucket saa-s3-task27-secondary-[account-id] in eu-west-1."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Keep Block Public Access on for both buckets."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the Multi-Region Access Point",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In the S3 left menu, choose Multi-Region Access Points."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create Multi-Region Access Point."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Use name saa-task27-mrap-[account-id]."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Add both buckets."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Create the Multi-Region Access Point."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Wait until the status is ready."
          }
        ],
        "note": "This can take several minutes.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review the global endpoint",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the Multi-Region Access Point details page."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Find the alias or ARN."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Notice that applications can use one global endpoint instead of hard-coding a single bucket Region."
          }
        ],
        "note": null,
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
            "text": "Delete the Multi-Region Access Point first."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Wait until deletion completes."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Empty both buckets if any test objects exist."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Delete the two buckets last."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "PRIMARY=saa-s3-task27-primary-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SECONDARY=saa-s3-task27-secondary-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "MRAP=saa-task27-mrap-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the two buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $PRIMARY --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $SECONDARY --region eu-west-1 --create-bucket-configuration LocationConstraint=eu-west-1"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the Multi-Region Access Point request file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > task27-mrap.json <<EOF\n{\n  \"Name\": \"$MRAP\",\n  \"Regions\": [\n    {\"Bucket\": \"$PRIMARY\"},\n    {\"Bucket\": \"$SECONDARY\"}\n  ]\n}\nEOF"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Submit the Multi-Region Access Point creation",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3control create-multi-region-access-point --account-id $ACCOUNT_ID --details file://task27-mrap.json --region eu-west-2"
          }
        ],
        "note": "Copy the request token from the output if you want to track the operation.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "List Multi-Region Access Points",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3control list-multi-region-access-points --account-id $ACCOUNT_ID --region eu-west-2"
          }
        ],
        "note": "Expected: the Multi-Region Access Point appears after AWS finishes creating it.",
        "warning": null,
        "expectedResult": "Expected: the Multi-Region Access Point appears after AWS finishes creating it."
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
            "text": "aws s3control delete-multi-region-access-point --account-id $ACCOUNT_ID --details Name=$MRAP --region eu-west-2"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$PRIMARY --recursive"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "aws s3 rm s3://$SECONDARY --recursive"
          },
          {
            "id": "cli-step-7-cmd-4",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $PRIMARY --region eu-west-2"
          },
          {
            "id": "cli-step-7-cmd-5",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $SECONDARY --region eu-west-1"
          },
          {
            "id": "cli-step-7-cmd-6",
            "language": "bash",
            "text": "rm -f task27-mrap.json"
          }
        ],
        "note": null,
        "warning": "If deletion is still in progress, wait and rerun the bucket delete commands later.",
        "expectedResult": "CLI command step 7 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Global endpoint",
        "body": "A Multi-Region Access Point gives one global endpoint across multiple Regions."
      },
      {
        "id": "cs-2",
        "title": "Not automatic replication",
        "body": "It routes requests. Replication is a separate S3 feature."
      },
      {
        "id": "cs-3",
        "title": "Takes time",
        "body": "Create and delete actions are asynchronous. Wait for completion before testing or cleanup."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Create request fails",
        "body": "Check bucket names, account ID, Region, and s3:CreateMultiRegionAccessPoint."
      },
      {
        "id": "ts-2",
        "title": "Not visible immediately",
        "body": "Wait a few minutes. The operation is asynchronous."
      },
      {
        "id": "ts-3",
        "title": "Bucket delete fails",
        "body": "Delete the Multi-Region Access Point first and empty the bucket before deleting it."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "MRAP is not CRR",
        "body": "Cross-Region Replication copies objects. MRAP provides a global access endpoint."
      },
      {
        "id": "trap-2",
        "title": "Buckets must already exist",
        "body": "The Multi-Region Access Point connects existing buckets."
      },
      {
        "id": "trap-3",
        "title": "Endpoint is global",
        "body": "Applications use the MRAP alias instead of choosing a regional bucket endpoint."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "MRAP = one front door for many Regions. The buckets stay regional, but the access point is global.",
    "flashcardSetId": "s3_task_27_flashcards"
  },
  {
    "id": "task-saa-s3-open-s3-storage-lens-and-review-the-storage-dashboard-028",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Open S3 Storage Lens and review the storage dashboard",
    "slug": "open-s3-storage-lens-and-review-the-storage-dashboard",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Open S3 Storage Lens and review account storage metrics.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "S3 Storage Lens",
        "body": "S3 Storage Lens shows account-level storage usage and activity trends."
      },
      {
        "id": "concept-2",
        "title": "Default dashboard",
        "body": "AWS provides a default dashboard that updates metrics daily."
      },
      {
        "id": "concept-3",
        "title": "Review-only lab",
        "body": "This task reviews the dashboard. It does not require creating buckets."
      }
    ],
    "whyItMatters": "Storage Lens helps you spot storage growth, object counts, encryption gaps, and cost cleanup opportunities.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-28.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 Storage Lens dashboard read permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Dashboard to review",
        "value": "Default account dashboard"
      },
      {
        "label": "Metrics to find",
        "value": "Total storage, object count, average object size, and largest buckets"
      }
    ],
    "costWarning": "Viewing the default S3 Storage Lens dashboard should not add meaningful cost. Advanced metrics and exports can add cost if enabled.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 Storage Lens read permissions: s3:ListStorageLensConfigurations, s3:GetStorageLensConfiguration, s3:GetStorageLensDashboard"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 account review permissions: s3:ListAllMyBuckets, s3:GetBucketLocation"
          },
          {
            "id": "console-step-1-item-8",
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
        "title": "Open S3 Storage Lens",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "In the left menu, choose Storage Lens."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Open the default dashboard if it is available."
          }
        ],
        "note": "Some metrics update daily, so brand-new buckets may not show immediately.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Review the account snapshot",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Look for total storage."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Look for total object count."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Look for average object size."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Notice whether the dashboard shows trends over time."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review bucket-level insights",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Find the bucket list or bucket breakdown."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Look for largest buckets."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Look for storage class distribution."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Look for encryption or public access indicators if shown."
          }
        ],
        "note": "The exact widgets can vary by dashboard view and available data.",
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
            "text": "This review-only lab creates no resources."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Do not delete the default dashboard unless you intentionally created a custom Storage Lens configuration."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Close the dashboard when finished."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set account variable",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "List Storage Lens configurations",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3control list-storage-lens-configurations --account-id $ACCOUNT_ID --region eu-west-2"
          }
        ],
        "note": "Expected: you see available Storage Lens configurations, such as the default dashboard configuration.",
        "warning": null,
        "expectedResult": "Expected: you see available Storage Lens configurations, such as the default dashboard configuration."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Tear down",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "echo \"No lab resources were created. Nothing to delete.\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "No AWS resources were created during this lab, so no cleanup is required."
      },
      {
        "id": "cleanup-2",
        "text": "No AWS resources were created during this lab, so no cleanup is required."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Daily metrics",
        "body": "Storage Lens metrics are not instant. Many dashboard values update daily."
      },
      {
        "id": "cs-2",
        "title": "Account view",
        "body": "Storage Lens helps review storage across buckets, not just one object."
      },
      {
        "id": "cs-3",
        "title": "Advanced metrics",
        "body": "Advanced metrics and exports can add cost. Do not enable them unless needed."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Dashboard access denied",
        "body": "The identity needs s3:ListStorageLensConfigurations, s3:GetStorageLensConfiguration, and s3:GetStorageLensDashboard."
      },
      {
        "id": "ts-2",
        "title": "No useful data yet",
        "body": "Wait for metrics to populate. New accounts or new buckets may not show much data."
      },
      {
        "id": "ts-3",
        "title": "CLI list is empty",
        "body": "The account may not have a custom configuration. Use the Console to review the default dashboard."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Not CloudWatch by default",
        "body": "Storage Lens has its own dashboard. CloudWatch publishing is an optional advanced setting."
      },
      {
        "id": "trap-2",
        "title": "Not real-time",
        "body": "Do not expect instant object-level changes to appear immediately."
      },
      {
        "id": "trap-3",
        "title": "Can reveal risk",
        "body": "Storage Lens can help spot unencrypted storage, public access, and old data patterns."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Storage Lens = storage dashboard. It helps you see what your buckets are doing at account scale.",
    "flashcardSetId": "s3_task_28_flashcards"
  },
  {
    "id": "task-saa-s3-try-to-make-a-bucket-public-while-block-public-access-is-still-on-029",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Try to make a bucket public while Block Public Access is still on",
    "slug": "try-to-make-a-bucket-public-while-block-public-access-is-still-on",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Try to make a bucket public and confirm Block Public Access stops it.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Block Public Access",
        "body": "Block Public Access is a guardrail that blocks public access settings even if a policy tries to allow public access."
      },
      {
        "id": "concept-2",
        "title": "Public policy",
        "body": "A public bucket policy can allow anonymous users to read objects. Block Public Access can reject or override this."
      },
      {
        "id": "concept-3",
        "title": "Expected failure",
        "body": "In this lab, failure is the correct result."
      }
    ],
    "whyItMatters": "This teaches the exam-safe idea that account or bucket guardrails can override public access attempts.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-29.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, Block Public Access config, bucket policy testing, object upload, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task29-bpa-test-[account-id]"
      },
      {
        "label": "Test object",
        "value": "task29-public-test.html"
      },
      {
        "label": "Expected result",
        "value": "Public access attempt fails while Block Public Access is on"
      }
    ],
    "costWarning": "This lab should cost very little. Delete the test object and bucket after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 public access permissions: s3:PutPublicAccessBlock, s3:GetPublicAccessBlock"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 policy permissions: s3:PutBucketPolicy, s3:GetBucketPolicy, s3:DeleteBucketPolicy"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create a private bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create bucket."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use name saa-s3-task29-bpa-test-[account-id]."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use Region eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Block all public access on."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create the bucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload a test file",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Upload a small HTML file named task29-public-test.html."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Keep default private permissions."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Try to add a public read policy",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the bucket Permissions tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Bucket policy."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Try to add a policy that allows anonymous s3:GetObject on the bucket objects."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Save the policy."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Notice that S3 blocks the public access attempt or the public link still fails."
          }
        ],
        "note": null,
        "warning": "This lab is designed to show that public access is blocked. Do not turn Block Public Access off.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test the public object URL",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the object details page."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Copy the object URL."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Open it in a private browser window."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm access fails with AccessDenied or similar."
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
            "text": "Remove the bucket policy if one was saved."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the test object."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the bucket last."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "BUCKET=saa-s3-task29-bpa-test-$ACCOUNT_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create bucket and keep Block Public Access on",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api put-public-access-block --bucket $BUCKET --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Upload a test object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "echo '<h1>Task 29 public test</h1>' > task29-public-test.html"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws s3 cp task29-public-test.html s3://$BUCKET/task29-public-test.html"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create a public policy file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > task29-public-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::$BUCKET/*\"\n    }\n  ]\n}\nEOF"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Try to apply the public policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3api put-bucket-policy --bucket $BUCKET --policy file://task29-public-policy.json"
          }
        ],
        "note": "Expected: this should fail or public access should still be blocked because BlockPublicPolicy is enabled.",
        "warning": null,
        "expectedResult": "Expected: this should fail or public access should still be blocked because BlockPublicPolicy is enabled."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Test the public URL",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "curl -I https://$BUCKET.s3.eu-west-2.amazonaws.com/task29-public-test.html"
          }
        ],
        "note": "Expected: AccessDenied, Forbidden, or another non-public result.",
        "warning": null,
        "expectedResult": "Expected: AccessDenied, Forbidden, or another non-public result."
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
            "text": "aws s3api delete-bucket-policy --bucket $BUCKET || true"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET/task29-public-test.html"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region eu-west-2"
          },
          {
            "id": "cli-step-8-cmd-4",
            "language": "bash",
            "text": "rm -f task29-public-test.html task29-public-policy.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Failure is success",
        "body": "The correct result is that public access does not work."
      },
      {
        "id": "cs-2",
        "title": "BPA beats mistakes",
        "body": "Block Public Access helps prevent accidental public exposure."
      },
      {
        "id": "cs-3",
        "title": "Public policy risk",
        "body": "Without Block Public Access, a public policy can expose bucket objects."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Policy unexpectedly saves",
        "body": "Check all four Block Public Access settings. The object should still not be public if restriction applies."
      },
      {
        "id": "ts-2",
        "title": "curl command fails to resolve",
        "body": "Check the bucket name and Region in the URL."
      },
      {
        "id": "ts-3",
        "title": "Bucket delete fails",
        "body": "Remove the policy and delete all objects before deleting the bucket."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "BPA can be account-level or bucket-level",
        "body": "Account-level settings protect all buckets in the account."
      },
      {
        "id": "trap-2",
        "title": "Public policy is blocked",
        "body": "If BlockPublicPolicy is on, S3 rejects public bucket policies."
      },
      {
        "id": "trap-3",
        "title": "Do not turn BPA off in exams unless required",
        "body": "Public S3 access is usually the wrong answer for private data."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "BPA = safety lock. Even if someone tries the public door, the safety lock stops it.",
    "flashcardSetId": "s3_task_29_flashcards"
  },
  {
    "id": "task-saa-s3-try-uploading-to-a-kms-encrypted-bucket-without-kms-encrypt-permission-030",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Try uploading to a KMS-encrypted bucket without KMS encrypt permission",
    "slug": "try-uploading-to-a-kms-encrypted-bucket-without-kms-encrypt-permission",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Test upload failure when SSE-KMS permissions are missing.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "SSE-KMS",
        "body": "SSE-KMS encrypts S3 objects with an AWS KMS key."
      },
      {
        "id": "concept-2",
        "title": "KMS permission required",
        "body": "To upload to an SSE-KMS bucket, the caller needs S3 write permission and KMS permission to use the key."
      },
      {
        "id": "concept-3",
        "title": "Expected failure",
        "body": "This lab intentionally creates a user without KMS permission so the upload fails."
      }
    ],
    "whyItMatters": "This is an important exam trap because S3 permission alone is not enough for uploads to a KMS-encrypted bucket.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-30.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, KMS key setup, IAM test user setup, S3 upload test, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task30-kms-deny-[account-id]"
      },
      {
        "label": "KMS alias",
        "value": "alias/saa-s3-task30-key"
      },
      {
        "label": "Test IAM user",
        "value": "saa-s3-task30-no-kms-user"
      },
      {
        "label": "Expected result",
        "value": "Upload fails until the user gets KMS key permission"
      }
    ],
    "costWarning": "This lab can create a small AWS KMS key cost if the key remains enabled. Schedule key deletion and remove all lab resources when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 encryption permissions: s3:PutEncryptionConfiguration, s3:GetEncryptionConfiguration"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-9",
            "text": "KMS setup permissions: kms:CreateKey, kms:CreateAlias, kms:DescribeKey, kms:ScheduleKeyDeletion, kms:PutKeyPolicy"
          },
          {
            "id": "console-step-1-item-10",
            "text": "IAM setup permissions: iam:CreateUser, iam:GetUser, iam:CreateAccessKey, iam:ListAccessKeys, iam:CreatePolicy, iam:GetPolicy, iam:GetPolicyVersion, iam:AttachUserPolicy, iam:ListAttachedUserPolicies, iam:DetachUserPolicy, iam:DeletePolicy, iam:DeleteAccessKey, iam:DeleteUser"
          },
          {
            "id": "console-step-1-item-11",
            "text": "S3 cleanup permissions: s3:DeleteBucket"
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
        "title": "Create a KMS key",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open AWS KMS."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Customer managed keys."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create a symmetric key."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use alias alias/saa-s3-task30-key."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Allow the lab admin identity to administer and use the key."
          }
        ],
        "note": null,
        "warning": "Do not use this key for real data.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create an SSE-KMS bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create bucket saa-s3-task30-kms-deny-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Keep Block Public Access on."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Open the bucket Properties tab."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set default encryption to SSE-KMS."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose the customer managed key alias/saa-s3-task30-key."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create a test user without KMS permission",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open IAM."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Create user saa-s3-task30-no-kms-user."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Create an access key for CLI testing."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Attach a policy that allows s3:PutObject to this bucket only."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Do not give the user kms:GenerateDataKey or kms:Encrypt."
          }
        ],
        "note": null,
        "warning": "Save the access key only for this lab and delete it during teardown.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Try the upload with the limited user",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Configure the limited user's access key as a temporary CLI profile."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Upload a small file to the KMS-encrypted bucket."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm the upload fails with an access error."
          },
          {
            "id": "console-step-5-item-4",
            "text": "The missing permission is on the KMS key, not just S3."
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
            "text": "Delete the limited user's access key."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Detach and delete the test IAM policy."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the test IAM user."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete any uploaded object if the upload unexpectedly worked."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the S3 bucket."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Schedule deletion of the KMS key last."
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
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "BUCKET=saa-s3-task30-kms-deny-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "USER=saa-s3-task30-no-kms-user"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "POLICY_NAME=saa-s3-task30-s3-only-put"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create KMS key and alias",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "KEY_ID=$(aws kms create-key --description 'SAA S3 Task 30 test key' --query KeyMetadata.KeyId --output text)"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws kms create-alias --alias-name alias/saa-s3-task30-key --target-key-id $KEY_ID"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "KEY_ARN=$(aws kms describe-key --key-id $KEY_ID --query KeyMetadata.Arn --output text)"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create bucket with SSE-KMS default encryption",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2"
          },
          {
            "id": "cli-step-4-cmd-2",
            "language": "bash",
            "text": "aws s3api put-bucket-encryption --bucket $BUCKET --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"aws:kms\",\"KMSMasterKeyID\":\"'$KEY_ARN'\"},\"BucketKeyEnabled\":true}]}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create a limited IAM user and S3-only policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws iam create-user --user-name $USER"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "cat > task30-s3-only-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\"Effect\": \"Allow\", \"Action\": [\"s3:PutObject\"], \"Resource\": \"arn:aws:s3:::$BUCKET/*\"}\n  ]\n}\nEOF"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "POLICY_ARN=$(aws iam create-policy --policy-name $POLICY_NAME --policy-document file://task30-s3-only-policy.json --query Policy.Arn --output text)"
          },
          {
            "id": "cli-step-5-cmd-4",
            "language": "bash",
            "text": "aws iam attach-user-policy --user-name $USER --policy-arn $POLICY_ARN"
          },
          {
            "id": "cli-step-5-cmd-5",
            "language": "bash",
            "text": "aws iam create-access-key --user-name $USER > task30-access-key.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Configure temporary CLI profile for the limited user",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws configure set profile.task30.aws_access_key_id $(jq -r .AccessKey.AccessKeyId task30-access-key.json)"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws configure set profile.task30.aws_secret_access_key $(jq -r .AccessKey.SecretAccessKey task30-access-key.json)"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws configure set profile.task30.region eu-west-2"
          }
        ],
        "note": null,
        "warning": "This step uses jq. If jq is not installed, copy the values from task30-access-key.json into aws configure manually.",
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Try the upload without KMS permission",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "echo 'kms permission test' > task30-kms-test.txt"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws s3 cp task30-kms-test.txt s3://$BUCKET/task30-kms-test.txt --profile task30"
          }
        ],
        "note": "Expected: upload fails because the user lacks KMS permission such as kms:GenerateDataKey.",
        "warning": null,
        "expectedResult": "Expected: upload fails because the user lacks KMS permission such as kms:GenerateDataKey."
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
            "text": "ACCESS_KEY_ID=$(jq -r .AccessKey.AccessKeyId task30-access-key.json 2>/dev/null || echo '')"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "if [ -n \"$ACCESS_KEY_ID\" ]; then aws iam delete-access-key --user-name $USER --access-key-id $ACCESS_KEY_ID; fi"
          },
          {
            "id": "cli-step-8-cmd-3",
            "language": "bash",
            "text": "aws iam detach-user-policy --user-name $USER --policy-arn $POLICY_ARN"
          },
          {
            "id": "cli-step-8-cmd-4",
            "language": "bash",
            "text": "aws iam delete-policy --policy-arn $POLICY_ARN"
          },
          {
            "id": "cli-step-8-cmd-5",
            "language": "bash",
            "text": "aws iam delete-user --user-name $USER"
          },
          {
            "id": "cli-step-8-cmd-6",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET --recursive"
          },
          {
            "id": "cli-step-8-cmd-7",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET --region eu-west-2"
          },
          {
            "id": "cli-step-8-cmd-8",
            "language": "bash",
            "text": "aws kms schedule-key-deletion --key-id $KEY_ID --pending-window-in-days 7"
          },
          {
            "id": "cli-step-8-cmd-9",
            "language": "bash",
            "text": "rm -f task30-kms-test.txt task30-access-key.json task30-s3-only-policy.json"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "S3 permission is not enough",
        "body": "For SSE-KMS uploads, the caller also needs permission to use the KMS key."
      },
      {
        "id": "cs-2",
        "title": "Expected missing action",
        "body": "For PutObject with SSE-KMS, the key permission commonly needed is kms:GenerateDataKey."
      },
      {
        "id": "cs-3",
        "title": "Key policy matters",
        "body": "The IAM policy and the KMS key policy must allow the access."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Upload succeeds unexpectedly",
        "body": "Check whether the test user has broad KMS permissions through another policy."
      },
      {
        "id": "ts-2",
        "title": "jq not installed",
        "body": "Manually copy the access key values into a temporary AWS CLI profile."
      },
      {
        "id": "ts-3",
        "title": "KMS key deletion error",
        "body": "Schedule key deletion after S3 and IAM cleanup. KMS keys are not deleted instantly."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "SSE-S3 differs from SSE-KMS",
        "body": "SSE-S3 needs no customer KMS key permission. SSE-KMS does."
      },
      {
        "id": "trap-2",
        "title": "KMS denies can look like S3 upload failures",
        "body": "Check both S3 permissions and KMS permissions when uploads fail."
      },
      {
        "id": "trap-3",
        "title": "Least privilege includes the key",
        "body": "Grant only the exact KMS actions needed for the app."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "SSE-KMS needs two keys. You need the S3 door key and the KMS encryption key.",
    "flashcardSetId": "s3_task_30_flashcards"
  },
  {
    "id": "task-saa-s3-remove-s3-replication-and-find-the-iam-role-that-was-used-031",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Remove S3 replication and find the IAM role that was used",
    "slug": "remove-s3-replication-and-find-the-iam-role-that-was-used",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a small replication setup, find the IAM role used by S3 replication, remove the replication rule, and clean up.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Replication role",
        "body": "Amazon S3 uses an IAM role to read from the source bucket and write to the destination bucket."
      },
      {
        "id": "concept-2",
        "title": "Removing replication",
        "body": "Deleting the replication rule stops new replication. It does not delete objects that were already copied."
      },
      {
        "id": "concept-3",
        "title": "Versioning requirement",
        "body": "S3 replication needs versioning enabled on both the source and destination buckets."
      }
    ],
    "whyItMatters": "This helps you understand the role behind S3 replication and how to safely remove a replication setup.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-31.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, versioning, replication configuration, IAM replication role setup, object testing, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Source bucket",
        "value": "saa-s3-task31-source-[account-id]"
      },
      {
        "label": "Destination bucket",
        "value": "saa-s3-task31-dest-[account-id]"
      },
      {
        "label": "Replication role",
        "value": "saa-s3-task31-replication-role"
      }
    ],
    "costWarning": "This lab should cost very little if you delete the buckets, objects, and IAM role after testing. S3 storage can create small charges if objects are left behind.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket, s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 versioning permissions: s3:PutBucketVersioning, s3:GetBucketVersioning"
          },
          {
            "id": "console-step-1-item-8",
            "text": "S3 replication permissions: s3:PutReplicationConfiguration, s3:GetReplicationConfiguration"
          },
          {
            "id": "console-step-1-item-9",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-10",
            "text": "IAM role permissions: iam:CreateRole, iam:GetRole, iam:PassRole, iam:PutRolePolicy, iam:GetRolePolicy, iam:DeleteRolePolicy, iam:DeleteRole"
          },
          {
            "id": "console-step-1-item-11",
            "text": "These permissions let you create the lab buckets, add replication, find the IAM role, remove replication, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create two S3 buckets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create a source bucket named saa-s3-task31-source-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create a destination bucket named saa-s3-task31-dest-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep Block Public Access turned on for both buckets."
          }
        ],
        "note": "Replication needs a source bucket and a destination bucket.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable versioning on both buckets",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Properties."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Under Bucket Versioning, choose Edit."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Enable, then save."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Repeat the same steps for the destination bucket."
          }
        ],
        "note": "S3 replication requires versioning on both buckets.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the replication rule",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the source bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Management."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Under Replication rules, choose Create replication rule."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Name the rule saa-s3-task31-rule."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Apply to all objects in the bucket."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose the destination bucket saa-s3-task31-dest-[account-id]."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Allow AWS to create or use an IAM role for replication."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Save the rule."
          }
        ],
        "note": null,
        "warning": "The console may ask whether to replicate existing objects. Choose No for this lab.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Find the IAM role used by replication",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Stay on the source bucket Management tab."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Open the replication rule."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Find the IAM role shown in the replication settings."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Write down the role name. It should look like an S3 replication role."
          }
        ],
        "note": "This role is what S3 assumes to copy objects to the destination bucket.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Remove the replication rule",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Go back to the source bucket Management tab."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select the replication rule."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Confirm the deletion."
          }
        ],
        "note": "This removes the bucket replication configuration. It does not delete objects already copied.",
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
            "text": "Confirm the replication rule is deleted first."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete any test objects from the source bucket."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete any replicated objects from the destination bucket."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the source bucket."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the destination bucket."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Open IAM and delete the replication role if it was only created for this lab."
          }
        ],
        "note": null,
        "warning": "Do not delete shared IAM roles used by other labs or real workloads.",
        "expectedResult": "Step 7 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
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
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SOURCE_BUCKET=saa-s3-task31-source-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "DEST_BUCKET=saa-s3-task31-dest-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "ROLE_NAME=saa-s3-task31-replication-role"
          }
        ],
        "note": "These names keep the lab predictable.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create buckets and enable versioning",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $SOURCE_BUCKET --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $DEST_BUCKET --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          },
          {
            "id": "cli-step-3-cmd-3",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning --bucket $SOURCE_BUCKET --versioning-configuration Status=Enabled"
          },
          {
            "id": "cli-step-3-cmd-4",
            "language": "bash",
            "text": "aws s3api put-bucket-versioning --bucket $DEST_BUCKET --versioning-configuration Status=Enabled"
          }
        ],
        "note": "Both buckets must have versioning enabled for replication.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the S3 replication IAM role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > trust-policy.json <<'EOF'\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": {\"Service\": \"s3.amazonaws.com\"},\n      \"Action\": \"sts:AssumeRole\"\n    }\n  ]\n}\nEOF\naws iam create-role --role-name $ROLE_NAME --assume-role-policy-document file://trust-policy.json"
          }
        ],
        "note": "This role lets Amazon S3 assume the role for replication.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Add replication permissions to the role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > replication-role-policy.json <<EOF\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetReplicationConfiguration\", \"s3:ListBucket\"],\n      \"Resource\": \"arn:aws:s3:::$SOURCE_BUCKET\"\n    },\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetObjectVersionForReplication\", \"s3:GetObjectVersionAcl\", \"s3:GetObjectVersionTagging\"],\n      \"Resource\": \"arn:aws:s3:::$SOURCE_BUCKET/*\"\n    },\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:ReplicateObject\", \"s3:ReplicateDelete\", \"s3:ReplicateTags\"],\n      \"Resource\": \"arn:aws:s3:::$DEST_BUCKET/*\"\n    }\n  ]\n}\nEOF\naws iam put-role-policy --role-name $ROLE_NAME --policy-name saa-s3-task31-replication-policy --policy-document file://replication-role-policy.json"
          }
        ],
        "note": "These are permissions used by the replication role, not by the learner directly.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the replication rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)\ncat > replication.json <<EOF\n{\n  \"Role\": \"$ROLE_ARN\",\n  \"Rules\": [\n    {\n      \"ID\": \"saa-s3-task31-rule\",\n      \"Status\": \"Enabled\",\n      \"Priority\": 1,\n      \"Filter\": {\"Prefix\": \"\"},\n      \"DeleteMarkerReplication\": {\"Status\": \"Disabled\"},\n      \"Destination\": {\"Bucket\": \"arn:aws:s3:::$DEST_BUCKET\"}\n    }\n  ]\n}\nEOF\naws s3api put-bucket-replication --bucket $SOURCE_BUCKET --replication-configuration file://replication.json"
          }
        ],
        "note": "S3 now has a replication configuration that includes the role ARN.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Find the IAM role used by replication",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3api get-bucket-replication --bucket $SOURCE_BUCKET --query 'ReplicationConfiguration.Role' --output text"
          }
        ],
        "note": "Expected: the IAM role ARN appears.",
        "warning": null,
        "expectedResult": "Expected: the IAM role ARN appears."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Remove replication",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws s3api delete-bucket-replication --bucket $SOURCE_BUCKET"
          },
          {
            "id": "cli-step-8-cmd-2",
            "language": "bash",
            "text": "aws s3api get-bucket-replication --bucket $SOURCE_BUCKET"
          }
        ],
        "note": "Expected: the second command returns an error because replication is gone.",
        "warning": null,
        "expectedResult": "Expected: the second command returns an error because replication is gone."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Tear down CLI resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws s3 rm s3://$SOURCE_BUCKET --recursive"
          },
          {
            "id": "cli-step-9-cmd-2",
            "language": "bash",
            "text": "aws s3 rm s3://$DEST_BUCKET --recursive"
          },
          {
            "id": "cli-step-9-cmd-3",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $SOURCE_BUCKET"
          },
          {
            "id": "cli-step-9-cmd-4",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $DEST_BUCKET"
          },
          {
            "id": "cli-step-9-cmd-5",
            "language": "bash",
            "text": "aws iam delete-role-policy --role-name $ROLE_NAME --policy-name saa-s3-task31-replication-policy"
          },
          {
            "id": "cli-step-9-cmd-6",
            "language": "bash",
            "text": "aws iam delete-role --role-name $ROLE_NAME"
          },
          {
            "id": "cli-step-9-cmd-7",
            "language": "bash",
            "text": "rm -f trust-policy.json replication-role-policy.json replication.json"
          }
        ],
        "note": null,
        "warning": "Only delete the IAM role if it was created for this lab.",
        "expectedResult": "CLI command step 9 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
      },
      {
        "id": "verify-4",
        "text": "Confirm object operations and versioning rules execute without permission errors."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      },
      {
        "id": "cleanup-5",
        "text": "Clean up all remaining S3 artifacts and storage configurations created during this lab."
      },
      {
        "id": "cleanup-6",
        "text": "Clean up S3 lab resources."
      },
      {
        "id": "cleanup-7",
        "text": "Clean up S3 lab resources."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "S3 replication role",
        "body": "S3 assumes an IAM role to copy objects between buckets."
      },
      {
        "id": "cs-2",
        "title": "Delete rule first",
        "body": "Remove the replication rule before deleting buckets and roles."
      },
      {
        "id": "cs-3",
        "title": "Copied objects stay",
        "body": "Removing replication does not delete already replicated objects."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Cannot delete bucket",
        "body": "The bucket is not empty. Empty source and destination buckets first."
      },
      {
        "id": "ts-2",
        "title": "Replication role missing",
        "body": "The rule may have been deleted already. Check the source bucket Management tab or run get-bucket-replication."
      },
      {
        "id": "ts-3",
        "title": "Access denied",
        "body": "Check the grouped permissions in Console step 0, especially s3:GetReplicationConfiguration and s3:PutReplicationConfiguration."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Role is easy to miss",
        "body": "Exam questions often hide that S3 needs an IAM role for replication."
      },
      {
        "id": "trap-2",
        "title": "Versioning is required",
        "body": "Replication will not work unless both buckets have versioning enabled."
      },
      {
        "id": "trap-3",
        "title": "Delete rule does not delete data",
        "body": "Stopping replication does not remove already copied objects."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Replication has a helper role. S3 uses the role to copy objects for you.",
    "flashcardSetId": "s3_task_31_flashcards"
  },
  {
    "id": "task-saa-s3-upload-with-aws-s3-cp-and-compare-with-s3api-put-object-032",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Upload with aws s3 cp and compare with s3api put-object",
    "slug": "upload-with-aws-s3-cp-and-compare-with-s3api-put-object",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Upload one file with aws s3 cp, upload another with s3api put-object, then compare the objects.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "High-level S3 CLI",
        "body": "aws s3 commands are easier for common file operations like copy, sync, move, and delete."
      },
      {
        "id": "concept-2",
        "title": "Low-level S3 API CLI",
        "body": "aws s3api commands map closely to S3 API actions like put-object and head-object."
      },
      {
        "id": "concept-3",
        "title": "Same result, different style",
        "body": "For a simple upload, both commands can create a normal S3 object."
      }
    ],
    "whyItMatters": "This helps you choose the right CLI style during labs, troubleshooting, and exam-style questions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-32.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 bucket setup, S3 object upload, S3 object read, and cleanup permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Bucket name",
        "value": "saa-s3-task32-cli-compare-[account-id]"
      },
      {
        "label": "High-level object key",
        "value": "uploads/high-level.txt"
      },
      {
        "label": "Low-level object key",
        "value": "uploads/low-level.txt"
      }
    ],
    "costWarning": "This lab should cost very little. The files are tiny. Delete the test objects and bucket when finished.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 bucket permissions: s3:CreateBucket, s3:ListAllMyBuckets, s3:GetBucketLocation, s3:ListBucket, s3:DeleteBucket"
          },
          {
            "id": "console-step-1-item-7",
            "text": "S3 object permissions: s3:PutObject, s3:GetObject, s3:DeleteObject"
          },
          {
            "id": "console-step-1-item-8",
            "text": "These permissions let you create a bucket, upload files using both CLI styles, inspect objects, and tear everything down."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the test bucket",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create a bucket named saa-s3-task32-cli-compare-[account-id] in eu-west-2."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Keep Block Public Access turned on."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Keep default encryption on."
          }
        ],
        "note": "The upload comparison will use this one bucket.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Upload one file using the console",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Upload."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Upload a small file if you want a console comparison too."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Open the object and view its details."
          }
        ],
        "note": "The main comparison happens in the CLI steps.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Compare the two uploaded objects",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "After the CLI uploads, refresh the bucket object list."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Look for uploads/high-level.txt and uploads/low-level.txt."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Open each object details page."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Compare object key, size, storage class, and encryption."
          }
        ],
        "note": "Both methods create S3 objects. The command style is different.",
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
            "text": "Delete all objects in the bucket."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Delete the bucket."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Delete any local test files from your computer if you no longer need them."
          }
        ],
        "note": null,
        "warning": "The bucket must be empty before it can be deleted.",
        "expectedResult": "Step 5 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set variables and create test files",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)"
          },
          {
            "id": "cli-step-2-cmd-2",
            "language": "bash",
            "text": "REGION=eu-west-2"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "BUCKET=saa-s3-task32-cli-compare-$ACCOUNT_ID"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "echo 'Uploaded with aws s3 cp' > high-level.txt"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "echo 'Uploaded with aws s3api put-object' > low-level.txt"
          }
        ],
        "note": "You will upload two small files.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the bucket",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $BUCKET --region $REGION --create-bucket-configuration LocationConstraint=$REGION"
          }
        ],
        "note": "This uses the lower-level s3api command.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Upload with aws s3 cp",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3 cp high-level.txt s3://$BUCKET/uploads/high-level.txt"
          }
        ],
        "note": "aws s3 commands are high-level and easier for common file tasks.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Upload with s3api put-object",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws s3api put-object --bucket $BUCKET --key uploads/low-level.txt --body low-level.txt"
          }
        ],
        "note": "s3api maps more directly to S3 API operations.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Compare the objects",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws s3 ls s3://$BUCKET/uploads/"
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "aws s3api head-object --bucket $BUCKET --key uploads/high-level.txt"
          },
          {
            "id": "cli-step-6-cmd-3",
            "language": "bash",
            "text": "aws s3api head-object --bucket $BUCKET --key uploads/low-level.txt"
          }
        ],
        "note": "Expected: both objects exist. The metadata should look similar for this simple upload.",
        "warning": null,
        "expectedResult": "Expected: both objects exist. The metadata should look similar for this simple upload."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Tear down CLI resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws s3 rm s3://$BUCKET --recursive"
          },
          {
            "id": "cli-step-7-cmd-2",
            "language": "bash",
            "text": "aws s3api delete-bucket --bucket $BUCKET"
          },
          {
            "id": "cli-step-7-cmd-3",
            "language": "bash",
            "text": "rm -f high-level.txt low-level.txt"
          }
        ],
        "note": "Empty the bucket before deleting it.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
      },
      {
        "id": "cleanup-4",
        "text": "Delete CloudFront distributions, KMS keys, or replication rules created during the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "aws s3 cp",
        "body": "Best for simple copy-style file work."
      },
      {
        "id": "cs-2",
        "title": "s3api put-object",
        "body": "Best when you want direct API-style control."
      },
      {
        "id": "cs-3",
        "title": "Exam angle",
        "body": "Know that the high-level CLI is simpler, while s3api is closer to the API."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No such bucket",
        "body": "Check the bucket name variable and confirm the bucket was created in eu-west-2."
      },
      {
        "id": "ts-2",
        "title": "Access denied on upload",
        "body": "Check s3:PutObject permission for the bucket path."
      },
      {
        "id": "ts-3",
        "title": "Delete bucket fails",
        "body": "The bucket still has objects. Run aws s3 rm s3://$BUCKET --recursive first."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "High-level vs low-level",
        "body": "Do not confuse aws s3 with aws s3api. They are different CLI command groups."
      },
      {
        "id": "trap-2",
        "title": "HeadObject permission",
        "body": "Reading object metadata uses object read permission, normally s3:GetObject."
      },
      {
        "id": "trap-3",
        "title": "S3 has no folders",
        "body": "The uploads/ part is a key prefix, not a real folder."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "s3 is friendly. s3api is exact. Use high-level commands for simple file work and API commands for direct control.",
    "flashcardSetId": "s3_task_32_flashcards"
  },
  {
    "id": "task-saa-s3-open-the-final-s3-guide-and-complete-the-last-review-task-033",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Open the final S3 guide and complete the last review task",
    "slug": "open-the-final-s3-guide-and-complete-the-last-review-task",
    "service": "Amazon S3",
    "feature": "Object Storage",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Open the final S3 guide, review the important S3 exam points, and confirm no lab resources were left behind.",
    "status": "published",
    "tags": [
      "S3",
      "Object Storage",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Review task",
        "body": "This task checks your understanding. It does not need new AWS resources."
      },
      {
        "id": "concept-2",
        "title": "Safe console review",
        "body": "You can review S3 settings without changing production or shared resources."
      },
      {
        "id": "concept-3",
        "title": "Cleanup mindset",
        "body": "Good cloud practice means checking for leftover buckets, keys, roles, and distributions."
      }
    ],
    "whyItMatters": "This closes the S3 lab set and helps you connect the hands-on tasks to exam decisions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Source JSON folder",
        "value": "content_source/SAA/guides/s3/"
      },
      {
        "label": "Generated HTML output path",
        "value": "content/SAA/guides/s3_guides/saa-s3-task-33.html"
      },
      {
        "label": "Required permissions summary",
        "value": "S3 read-only review and identity-check permissions. Exact actions are grouped in Console step 0."
      },
      {
        "label": "Review target",
        "value": "Final S3 guide in the AWS Study Tool"
      },
      {
        "label": "New resources created",
        "value": "None"
      },
      {
        "label": "Main result",
        "value": "S3 review checklist completed"
      }
    ],
    "costWarning": "This review task should not create cost because it does not create new AWS resources. Charges can continue if earlier lab resources were left running, such as buckets with objects, CloudFront distributions, or KMS keys.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with S3 permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, create or use a lab identity with the permissions listed below."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "S3 read-only review permissions: s3:ListAllMyBuckets, s3:GetAccountPublicAccessBlock"
          },
          {
            "id": "console-step-1-item-7",
            "text": "No new AWS resources are required for this final review task."
          },
          {
            "id": "console-step-1-item-8",
            "text": "These permissions let you confirm your identity and review S3 from the console or CLI."
          }
        ],
        "note": null,
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the final S3 guide",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open your AWS Study Tool in the browser."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Go to the S3 guides section."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open the final S3 guide or final S3 review task."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Keep the AWS Console open in another tab."
          }
        ],
        "note": "This task is a review checkpoint, not a new build lab.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Review the S3 console safely",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open Amazon S3."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Look at the bucket list."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Open Block Public Access settings for this account if available."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Do not change any production bucket settings."
          }
        ],
        "note": null,
        "warning": "Review only. Do not make real buckets public.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Complete the final review checklist",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Check that you understand bucket names are global."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Check that you understand objects are stored by key."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Check that you understand Block Public Access."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Check that you understand default encryption."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Check that you understand replication needs versioning and an IAM role."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Check that you understand lifecycle rules and storage classes."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Check that you understand CloudFront can cache S3 website content."
          }
        ],
        "note": "These are the high-value S3 exam ideas from the task set.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Tear down check",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Confirm no S3 buckets from earlier labs are still needed."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Empty and delete any lab-only buckets you forgot to remove."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Disable or delete any lab-only CloudFront distributions if they still exist."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Schedule deletion for any lab-only KMS keys if created earlier."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Delete any lab-only IAM users, access keys, roles, and policies."
          }
        ],
        "note": null,
        "warning": "Delete only lab resources. Do not delete shared or production resources.",
        "expectedResult": "Step 5 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and ARN for the identity running the review.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and ARN for the identity running the review."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "List buckets for review",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws s3api list-buckets --query 'Buckets[].Name' --output table"
          }
        ],
        "note": "Expected: you see your bucket names, or an empty list if there are no buckets.",
        "warning": null,
        "expectedResult": "Expected: you see your bucket names, or an empty list if there are no buckets."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Check account Block Public Access",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3control get-public-access-block --account-id $(aws sts get-caller-identity --query Account --output text)"
          }
        ],
        "note": "Expected: the command returns the account-level Block Public Access settings, or an error if it has never been configured.",
        "warning": null,
        "expectedResult": "Expected: the command returns the account-level Block Public Access settings, or an error if it has never been configured."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Optional cleanup reminder",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "echo 'Review your lab buckets, CloudFront distributions, KMS keys, and IAM users. Delete only lab resources you no longer need.'"
          }
        ],
        "note": "This command does not delete anything. It is a safety reminder.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
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
        "text": "Verify that Object Storage settings match the expected requirements."
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
        "text": "No AWS resources were created during this lab, so no cleanup is required."
      },
      {
        "id": "cleanup-2",
        "text": "No AWS resources were created during this lab, so no cleanup is required."
      },
      {
        "id": "cleanup-3",
        "text": "No AWS resources were created during this lab, so no cleanup is required."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "S3 core idea",
        "body": "S3 stores objects in buckets. Objects are found by key."
      },
      {
        "id": "cs-2",
        "title": "Security first",
        "body": "Block Public Access, bucket policies, IAM, and encryption are major S3 exam areas."
      },
      {
        "id": "cs-3",
        "title": "Operations matter",
        "body": "Lifecycle, replication, logging, and CloudFront are common operations topics."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Account public block command fails",
        "body": "The setting may not exist yet, or the identity lacks s3:GetAccountPublicAccessBlock."
      },
      {
        "id": "ts-2",
        "title": "Too many buckets left",
        "body": "Only delete buckets that were created for labs. Empty each bucket before deleting it."
      },
      {
        "id": "ts-3",
        "title": "Cannot find final guide",
        "body": "Run the builder again and open the generated S3 guide page from content/SAA/guides/s3_guides/."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Do not skip cleanup",
        "body": "Exam labs and real AWS accounts both need careful teardown."
      },
      {
        "id": "trap-2",
        "title": "S3 is regional and global",
        "body": "Bucket names are globally unique, but most bucket data and settings are Region-based."
      },
      {
        "id": "trap-3",
        "title": "Public access is layered",
        "body": "IAM, bucket policies, ACLs, and Block Public Access can all affect access."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Object Storage configuration and architectural best practices in Amazon S3."
      }
    ],
    "memoryHook": "Finish by checking the leftovers. The final S3 skill is knowing what to clean up and what to verify.",
    "flashcardSetId": null
  }
];
