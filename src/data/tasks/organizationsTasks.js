/** AWS Organizations Tasks (SAA-C03) */
export const ORGANIZATIONS_TASKS = [
  {
    "id": "task-saa-organizations-deny-s3-bucket-deletion-scp-009",
    "examCode": "aws-saa-c03",
    "topicId": "topic-organizations",
    "title": "Deny S3 bucket deletion with an SCP",
    "slug": "deny-s3-bucket-deletion-with-an-scp",
    "service": "AWS Organizations",
    "feature": "Identity and Access Management",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "global",
    "goal": "Goal: Use an AWS Organizations Service Control Policy as an org guardrail to block s3:DeleteBucket in a member account.",
    "status": "published",
    "tags": [
      "IAM",
      "Security",
      "Identity and Access Management",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "SCP",
        "body": "Sets maximum available permissions for accounts/OUs."
      },
      {
        "id": "concept-2",
        "title": "Does not grant",
        "body": "SCPs never grant access by themselves."
      },
      {
        "id": "concept-3",
        "title": "Affects root",
        "body": "SCP deny affects all principals in member account, including root."
      },
      {
        "id": "concept-4",
        "title": "Guardrail",
        "body": "Best for coarse organization controls."
      },
      {
        "id": "concept-5",
        "title": "Explicit deny",
        "body": "SCP deny overrides IAM allow."
      },
      {
        "id": "concept-6",
        "title": "Fine control",
        "body": "Use IAM and resource policies for detailed access."
      }
    ],
    "whyItMatters": "SCPs are organization guardrails. They prevent risky actions even if a member account identity has an IAM allow. Note: SCPs specify maximum allowed permissions for member account principals, but do not grant permissions by themselves.",
    "values": [
      {
        "label": "SCP name",
        "value": "DenyDeleteBucket"
      },
      {
        "label": "Management profile",
        "value": "orgroot"
      },
      {
        "label": "Child profile",
        "value": "child"
      },
      {
        "label": "Test bucket",
        "value": "test-bucket-to-remove-12345"
      },
      {
        "label": "Target",
        "value": "OU ID ou-..."
      }
    ],
    "costWarning": "AWS Organizations itself does not generally add a separate service charge, but services enabled across member accounts continue to incur normal charges.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Before you start",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the management account."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Confirm SCPs are enabled in AWS Organizations."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Pick the target OU containing the child account."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the SCP",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open AWS Organizations Policies."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Service control policies."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create policy named DenyDeleteBucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Paste the JSON below."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Attach SCP to the OU",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open AWS accounts / Organize accounts."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select the target OU."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Open Policies tab."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach DenyDeleteBucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create a safe test bucket in child account",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Sign in to the child/member account."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Create bucket test-bucket-to-remove-12345."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Keep it empty or use only non-sensitive test data."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Attempt delete from child account",
        "instructions": [],
        "note": "Expected: AccessDenied due to SCP.",
        "warning": null,
        "expectedResult": "Expected: AccessDenied due to SCP."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Detach the SCP from the OU."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the SCP if no longer needed."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the test bucket after the SCP is removed."
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
        "title": "Save SCP JSON",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "cat > deny-delete-bucket.json <<'EOF'\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [{\n    \"Sid\": \"DenyBucketDeletion\",\n    \"Effect\": \"Deny\",\n    \"Action\": \"s3:DeleteBucket\",\n    \"Resource\": \"*\"\n  }]\n}\nEOF"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 1 executed successfully."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Find root and OU IDs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws organizations list-roots --profile orgroot\n\naws organizations list-organizational-units-for-parent \\\n  --parent-id r-ROOTID \\\n  --profile orgroot"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create and attach SCP",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws organizations create-policy \\\n  --content file://deny-delete-bucket.json \\\n  --name DenyDeleteBucket \\\n  --type SERVICE_CONTROL_POLICY \\\n  --profile orgroot\n\naws organizations attach-policy \\\n  --policy-id p-POLICYID \\\n  --target-id ou-OU_ID \\\n  --profile orgroot"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create and delete test bucket from child",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket \\\n  --bucket test-bucket-to-remove-12345 \\\n  --create-bucket-configuration LocationConstraint=eu-west-2 \\\n  --profile child\n\naws s3api delete-bucket \\\n  --bucket test-bucket-to-remove-12345 \\\n  --profile child"
          }
        ],
        "note": "Expected: delete fails due to SCP.",
        "warning": null,
        "expectedResult": "Expected: delete fails due to SCP."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Tear down",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws organizations detach-policy --policy-id p-POLICYID --target-id ou-OU_ID --profile orgroot\naws organizations delete-policy --policy-id p-POLICYID --profile orgroot\naws s3api delete-bucket --bucket test-bucket-to-remove-12345 --profile child\nrm -f deny-delete-bucket.json"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently detaches permissions or deletes IAM identity resources.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Identity and Access Management configuration verified in AWS IAM."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Detach all managed policies, remove users from groups, and delete test IAM identities created during this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "SCP",
        "body": "Account/OU guardrail."
      },
      {
        "id": "cs-2",
        "title": "Does not grant",
        "body": "Only limits maximum."
      },
      {
        "id": "cs-3",
        "title": "Root affected",
        "body": "Member root is also limited."
      },
      {
        "id": "cs-4",
        "title": "Deny wins",
        "body": "Overrides IAM allow."
      },
      {
        "id": "cs-5",
        "title": "Coarse control",
        "body": "Use for org-wide restrictions."
      },
      {
        "id": "cs-6",
        "title": "Detach first",
        "body": "Remove SCP before cleanup delete test."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Delete succeeds",
        "body": "Wrong OU/account or SCP not attached."
      },
      {
        "id": "ts-2",
        "title": "Still denied after detach",
        "body": "Wait for propagation or check IAM/bucket policies."
      },
      {
        "id": "ts-3",
        "title": "Bucket not empty",
        "body": "Empty bucket first."
      },
      {
        "id": "ts-4",
        "title": "No SCP option",
        "body": "Enable SCPs in Organizations."
      },
      {
        "id": "ts-5",
        "title": "Wrong profile",
        "body": "Use orgroot for Organizations and child for S3 test."
      },
      {
        "id": "ts-6",
        "title": "Policy ID wrong",
        "body": "Copy the p-... ID from create-policy."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "SCPs do not grant permissions."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "SCPs affect root in member accounts."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Use SCPs for guardrails, not fine-grained app access."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Explicit deny overrides IAM allow."
      },
      {
        "id": "trap-5",
        "title": "Trap 5",
        "body": "Target OU membership matters."
      },
      {
        "id": "trap-6",
        "title": "Trap 6",
        "body": "Bucket must be empty to delete after SCP removal."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Identity and Access Management configuration and IAM policy evaluation in AWS."
      }
    ],
    "memoryHook": "SCP is the organization speed limit. Even powerful identities cannot exceed it.",
    "flashcardSetId": "iam_task_9_flashcards"
  }
];
