/** AWS Secrets Manager Tasks (SAA-C03) */
export const SECRETS_MANAGER_TASKS = [
  {
    "id": "task-saa-secrets-manager-automated-password-rotation-with-secrets-manager-vs-ssm-parameter-store-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-secrets-manager",
    "title": "Automated Password Rotation with Secrets Manager vs SSM Parameter Store",
    "slug": "automated-password-rotation-with-secrets-manager-vs-ssm-parameter-store",
    "service": "AWS Secrets Manager",
    "feature": "AWS Secrets Manager",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Securely store application credentials and configure automated 30-day password rotation using AWS Secrets Manager, and contrast with SSM Parameter Store.",
    "status": "published",
    "tags": [
      "AWS Secrets Manager",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS Secrets Manager",
        "body": "Designed specifically for sensitive credentials (database passwords, API keys). Features built-in automated rotation via Lambda, native integration with RDS/Redshift, cross-region secret replication, and random password generation."
      },
      {
        "id": "concept-2",
        "title": "AWS Systems Manager Parameter Store",
        "body": "Lightweight, low-cost key-value store for application configuration parameters and secrets (`String`, `StringList`, `SecureString` encrypted with KMS). Does NOT support built-in automated rotation."
      },
      {
        "id": "concept-3",
        "title": "Automated Rotation Architecture",
        "body": "Secrets Manager invokes a Lambda function to update credentials inside the database first, and then updates the secret version in Secrets Manager."
      },
      {
        "id": "concept-4",
        "title": "SecureString Parameters",
        "body": "Parameter Store parameters encrypted using a KMS key. Free for standard parameters; ideal for configuration settings."
      },
      {
        "id": "concept-5",
        "title": "Secrets Manager vs SSM Parameter Store Decision Matrix",
        "body": "FeatureAWS Secrets ManagerAWS Systems Manager Parameter StorePrimary PurposeDatabase credentials, API keys, OAuth tokensGeneral app configuration, feature flags, license keysAutomated RotationNative Built-In (via AWS Lambda)No built-in rotation (Requires custom EventBridge + Lambda)RDS / Redshift IntegrationNative automated password rotation templatesManual script managementCross-Region ReplicationBuilt-in cross-region secret replicationManual replication or EventBridge synchronizationCost Profile$0.40 per secret per monthFree (Standard parameters) / $0.05 per Advanced parameter"
      }
    ],
    "whyItMatters": "This matters because choosing Secrets Manager (automated rotation, RDS integration, cross-region replication) vs Parameter Store (low-cost hierarchical config storage) is a major SAA-C03 topic.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Secret Name",
        "value": "saa/rds/mysql-credentials"
      },
      {
        "label": "Parameter Name",
        "value": "/saa/config/db-endpoint"
      },
      {
        "label": "Rotation Window",
        "value": "30 days (Automated via Lambda)"
      },
      {
        "label": "Encryption Engine",
        "value": "AWS KMS (aws/secretsmanager)"
      }
    ],
    "costWarning": "Secrets Manager secret storage, API request, rotation Lambda and replication charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity Secrets Manager / SSM permissions: secretsmanager:CreateSecret, secretsmanager:RotateSecret, ssm:PutParameter Cleanup: secretsmanager:DeleteSecret, ssm:DeleteParameter",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create RDS Database Secret in AWS Secrets Manager",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open AWS Secrets Manager Console -> Click Store a new secret."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Select Secret type Credentials for Amazon RDS database."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Set Username to db_admin and Password to SuperSecret123!."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Select target RDS database instance -> Click Next."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Secret name to saa/rds/mysql-credentials -> Click Next."
          }
        ],
        "note": "Encrypts database credentials under AWS KMS in Secrets Manager.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Configure Automated 30-Day Password Rotation via Lambda",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "On the Rotation step, toggle Automatic rotation to Enabled."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set Rotation schedule to 30 days."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select Create a new Lambda function for rotation."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Click Save and store the secret."
          }
        ],
        "note": "Automated rotation triggers Lambda to rotate credentials in the database and update Secrets Manager.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create SecureString Parameter in SSM Parameter Store",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open AWS Systems Manager Console -> Click Parameter Store in left navigation -> Click Create parameter."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set Name to /saa/config/db-endpoint."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Type to SecureString -> Select KMS key aws/ssm."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Value to db.internal.example.com:3306."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Click Create parameter."
          }
        ],
        "note": "Parameter Store offers low-cost hierarchical configuration management without built-in rotation.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Compare Retrieval API Calls and Selection Rules",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Retrieve secret: aws secretsmanager get-secret-value --secret-id saa/rds/mysql-credentials --region us-east-1."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Retrieve parameter: aws ssm get-parameter --name /saa/config/db-endpoint --with-decryption --region us-east-1."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Review decision rules: Choose Secrets Manager for automated database rotation; choose Parameter Store for static key-value app configs."
          }
        ],
        "note": "Validates API retrieval and architectural differences.",
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
            "text": "Delete secret saa/rds/mysql-credentials (Select force deletion without recovery)."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete parameter /saa/config/db-endpoint."
          }
        ],
        "note": null,
        "warning": "Delete secrets to prevent ongoing monthly charges.",
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
        "title": "Retrieve Secrets Manager Secret Value",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws secretsmanager get-secret-value --secret-id saa/rds/mysql-credentials --region us-east-1"
          }
        ],
        "note": "Fetches secret credentials.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Secrets Manager configuration verified in AWS Secrets Manager."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Cancel secret rotation and remove resource policies."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the secret in AWS Secrets Manager using a 7-day recovery window."
      },
      {
        "id": "cleanup-3",
        "text": "Delete the rotation Lambda function and associated IAM roles."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "AWS Secrets Manager",
        "body": "Native automated credential rotation via Lambda, RDS/Redshift templates, cross-region secret replication."
      },
      {
        "id": "cs-2",
        "title": "SSM Parameter Store",
        "body": "Free standard key-value parameter storage. Supports `SecureString` with KMS. No built-in rotation."
      },
      {
        "id": "cs-3",
        "title": "Rotation Trigger",
        "body": "Secrets Manager invokes Lambda to update database password first, then updates the secret value."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Secrets Manager Rotation Failure",
        "body": "Ensure the rotation Lambda function has network access (VPC subnets/security groups) to reach the target database instance."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Automated Rotation Keyword Trap",
        "body": "If an exam question asks to store database credentials and automatically rotate passwords every 30 days, do NOT select Parameter Store. Select AWS Secrets Manager."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Secrets Manager concepts and data security patterns in AWS Secrets Manager."
      }
    ],
    "memoryHook": "Secrets Manager = Automated Password Rotation | Parameter Store = Free App Config Store",
    "flashcardSetId": null
  }
];
