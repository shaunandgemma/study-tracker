/** Amazon ECR Tasks (SAA-C03) */
export const ECR_TASKS = [
  {
    "id": "task-saa-ecr-store-secure-container-blueprints-with-amazon-ecr-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ecr",
    "title": "Store & Secure Container Blueprints with Amazon ECR",
    "slug": "store-secure-container-blueprints-with-amazon-ecr",
    "service": "Amazon ECR",
    "feature": "Amazon ECR",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Create a private Amazon ECR repository with automated vulnerability scanning, KMS encryption at rest, and lifecycle management rules.",
    "status": "published",
    "tags": [
      "Amazon ECR",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Amazon ECR (Elastic Container Registry)",
        "body": "Fully managed Docker/OCI container image registry that stores, manages, and deploys container images securely."
      },
      {
        "id": "concept-2",
        "title": "Scan on Push Vulnerability Detection",
        "body": "Automatically scans pushed container images for known OS and software vulnerabilities (CVEs) to prevent vulnerable images from deploying."
      },
      {
        "id": "concept-3",
        "title": "ECR Lifecycle Policies",
        "body": "Automated rules that purge untagged images or old image tags after a specified number of days to control ECR storage costs."
      },
      {
        "id": "concept-4",
        "title": "KMS Encryption at Rest",
        "body": "Encrypts container image layers at rest using AWS KMS customer managed keys (CMK) or default AWS managed keys."
      },
      {
        "id": "concept-5",
        "title": "ECR Repository Configuration Plan",
        "body": "SettingLab valuePurposeRepository namesaa-ecr-app-repoPrivate container registryTag mutabilityMUTABLE (or IMMUTABLE)Prevent image tag overwritesScan configurationScan on push = EnabledAuto-detect software CVEsEncryption typeKMS (or AES-256)Encrypt container layers at restLifecycle policyExpire untagged images > 14 daysAuto-clean obsolete image storage"
      }
    ],
    "whyItMatters": "This matters because SAA-C03 routinely tests container image vulnerability scanning, KMS encryption at rest, and automated lifecycle policies to control image storage costs.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Repository Name",
        "value": "saa-ecr-app-repo"
      },
      {
        "label": "Tag Mutability",
        "value": "MUTABLE"
      },
      {
        "label": "Scan Configuration",
        "value": "Scan on push = Enabled"
      },
      {
        "label": "Lifecycle Rule",
        "value": "Expire untagged images older than 14 days"
      }
    ],
    "costWarning": "Container image storage, scanning, replication and data-transfer charges may apply. Complete cleanup promptly after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate container service permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate container service permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity ECR permissions: ecr:CreateRepository, ecr:PutImageScanningConfiguration, ecr:PutLifecyclePolicy, ecr:DescribeImageScanFindings Cleanup: ecr:DeleteRepository",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a Private Amazon ECR Repository",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon ECR."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Repositories -> Create repository."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Select Private visibility."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Repository name to saa-ecr-app-repo."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Under Scan configuration, toggle Scan on push to Enabled."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Under Encryption configuration, keep KMS or AES-256 enabled."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Choose Create repository."
          }
        ],
        "note": "Scan on push automatically triggers vulnerability scanning whenever a new image tag is pushed.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Configure ECR Lifecycle Policy Rules",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select repository saa-ecr-app-repo -> Click Lifecycle policies in left sidebar."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create rule."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Set Rule description to Purge untagged images."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set Image status to Untagged."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set Match criteria to Since image pushed -> Set Count to 14 days."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose Save."
          }
        ],
        "note": "Lifecycle policies prevent unused untagged image layers from accumulating storage charges.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Authenticate Docker CLI and Push a Container Image",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open terminal and authenticate Docker to ECR: aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin .dkr.ecr.us-east-1.amazonaws.com."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Pull a small public image: docker pull alpine:latest."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Tag the image: docker tag alpine:latest .dkr.ecr.us-east-1.amazonaws.com/saa-ecr-app-repo:v1."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Push the image: docker push .dkr.ecr.us-east-1.amazonaws.com/saa-ecr-app-repo:v1."
          }
        ],
        "note": "Pushing the image automatically triggers the Scan on Push vulnerability scan.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Inspect Image Vulnerability Scanning Findings",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Return to Amazon ECR -> Select saa-ecr-app-repo."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Click on image tag v1."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Locate the Vulnerabilities section."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Review vulnerability severity breakdown (Informational, Low, Medium, High, Critical)."
          }
        ],
        "note": "ECR provides basic scanning (Clair engine) or enhanced scanning (Inspector integration).",
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
            "text": "Select repository saa-ecr-app-repo -> Choose Delete."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Check Delete all images confirmation checkbox and click Delete."
          }
        ],
        "note": null,
        "warning": "Delete the repository to clean up all stored container images.",
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
        "title": "Set variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=us-east-1\nREPO_NAME=saa-ecr-app-repo"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create ECR Private Repository with Scan on Push",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ecr create-repository --repository-name $REPO_NAME --image-scanning-configuration scanOnPush=true --region $REGION"
          }
        ],
        "note": "Creates repository with automatic scanning enabled.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Configure ECR Lifecycle Policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ecr put-lifecycle-policy --repository-name $REPO_NAME --lifecycle-policy-text '{\"rules\":[{\"rulePriority\":1,\"description\":\"Expire untagged images\",\"selection\":{\"tagStatus\":\"untagged\",\"countType\":\"sinceImagePushed\",\"countUnit\":\"days\",\"countNumber\":14},\"action\":{\"type\":\"expire\"}}]}' --region $REGION"
          }
        ],
        "note": "Applies automatic expiration rule for untagged images.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Describe Image Vulnerability Scan Findings",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ecr describe-image-scan-findings --repository-name $REPO_NAME --image-id imageTag=v1 --region $REGION"
          }
        ],
        "note": "Displays CVE vulnerability report findings.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Delete ECR Repository and Images",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ecr delete-repository --repository-name $REPO_NAME --force --region $REGION"
          }
        ],
        "note": "Deletes ECR repository and all contained images.",
        "warning": "Destructive Command Warning: This command permanently deletes container repositories, images, ECS services, task definitions, or clusters.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon ECR configuration verified in Amazon ECR."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete all container images from the ECR repository."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Amazon ECR repository."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Amazon ECR Overview",
        "body": "Fully managed container image registry supporting private/public repos, KMS encryption, vulnerability scanning, and lifecycle rules."
      },
      {
        "id": "cs-2",
        "title": "Basic vs Enhanced Scanning",
        "body": "Basic Scanning: Free, powered by Clair engine on push. Enhanced Scanning: Powered by Amazon Inspector for continuous automated scanning."
      },
      {
        "id": "cs-3",
        "title": "Tag Mutability",
        "body": "IMMUTABLE prevents image tag overwriting (secures production deployments). MUTABLE allows pushing updated images under the same tag."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Docker Push Access Denied",
        "body": "Run `aws ecr get-login-password` to refresh your temporary 12-hour Docker CLI authentication token."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "ECR Lifecycle vs S3 Lifecycle",
        "body": "ECR Lifecycle policies control container image versions/tags. S3 Lifecycle policies control S3 object storage classes."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon ECR concepts and container orchestration patterns in Amazon ECR."
      }
    ],
    "memoryHook": "ECR Stores images | Scan on Push Finds vulnerabilities | Lifecycle Rules Clear clutter",
    "flashcardSetId": null
  }
];
