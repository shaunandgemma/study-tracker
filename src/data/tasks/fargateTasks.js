/** AWS Fargate Tasks (SAA-C03) */
export const FARGATE_TASKS = [
  {
    "id": "task-saa-fargate-serverless-container-microservice-with-aws-fargate-alb-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-fargate",
    "title": "Serverless Container Microservice with AWS Fargate & ALB",
    "slug": "serverless-container-microservice-with-aws-fargate-alb",
    "service": "AWS Fargate",
    "feature": "AWS Fargate",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Deploy a load-balanced, auto-scaling web service on Amazon ECS using the serverless Fargate launch type.",
    "status": "published",
    "tags": [
      "AWS Fargate",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Amazon ECS Fargate Launch Type",
        "body": "Serverless compute engine for containers where AWS provisions and manages underlying EC2 instances, OS patching, and server capacity."
      },
      {
        "id": "concept-2",
        "title": "awsvpc Network Mode",
        "body": "Assigns a dedicated Elastic Network Interface (ENI) and private IP address to every Fargate task for native VPC security group isolation."
      },
      {
        "id": "concept-3",
        "title": "ECS Task Definition",
        "body": "JSON blueprint specifying container images, task-level CPU/Memory allocations, port mappings, environment variables, and logging."
      },
      {
        "id": "concept-4",
        "title": "ALB Integration & Target Tracking Scaling",
        "body": "ALB automatically routes traffic to Fargate task IP addresses. Target Tracking Auto Scaling dynamically adjusts task count based on CPU/RAM metrics."
      },
      {
        "id": "concept-5",
        "title": "Fargate Microservice Deployment Plan",
        "body": "ComponentLab valuePurposeClustersaa-fargate-clusterECS cluster for serverless tasksTask definitionsaa-fargate-task-def (0.25 vCPU / 512 MB)NGINX container specNetwork modeawsvpcDedicated ENI per taskLoad balancersaa-fargate-alb (Port 80)Distributes HTTP web trafficAuto scalingTarget Tracking (CPU > 70%)Dynamic task scaling (1–4 tasks)"
      }
    ],
    "whyItMatters": "This matters because Fargate + ALB + Target Tracking is the single most tested container architecture on SAA-C03 when minimizing operational overhead is required.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Cluster Name",
        "value": "saa-fargate-cluster"
      },
      {
        "label": "Task CPU / Memory",
        "value": "0.25 vCPU / 512 MB"
      },
      {
        "label": "Network Mode",
        "value": "awsvpc"
      },
      {
        "label": "Container Image",
        "value": "public.ecr.aws/docker/library/nginx:latest"
      }
    ],
    "costWarning": "Fargate CPU, memory, ephemeral storage, networking, logging and connected-service charges may apply while tasks run.",
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
        "note": "Identity check: sts:GetCallerIdentity ECS permissions: ecs:CreateCluster, ecs:RegisterTaskDefinition, ecs:CreateService, ecs:UpdateService ALB permissions: elbv2:CreateLoadBalancer, elbv2:CreateTargetGroup, elbv2:CreateListener Cleanup: ecs:DeleteService, ecs:DeleteCluster, elbv2:DeleteLoadBalancer",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create an Amazon ECS Fargate Cluster",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon ECS."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "In the left navigation sidebar, click Clusters -> Choose Create cluster."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Cluster name to saa-fargate-cluster."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Under Infrastructure, check AWS Fargate (serverless)."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create."
          }
        ],
        "note": "Fargate clusters do not require EC2 instance management or capacity provider scaling.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Register an ECS Task Definition",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In the ECS left sidebar, click Task definitions -> Choose Create new task definition -> Select Create new task definition."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set Task definition family to saa-fargate-task-def."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select Launch type AWS Fargate."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set Network mode to awsvpc."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set Task CPU to 0.25 vCPU and Task memory to 0.5 GB."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Under Container 1: Set Name to web-container -> Image URI to public.ecr.aws/docker/library/nginx:latest -> Container port to 80 (TCP)."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose Create."
          }
        ],
        "note": "Task definitions specify container image parameters, CPU/RAM limits, and awsvpc networking.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create Application Load Balancer & Target Group",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 Console -> Click Target groups -> Choose Create target group."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select Target type IP addresses (required for Fargate `awsvpc` network mode)."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Target group name to saa-fargate-tg -> Protocol HTTP -> Port 80 -> Select lab VPC."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Next -> Choose Create target group."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Click Load balancers -> Choose Create load balancer -> Select Application Load Balancer."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Set Name to saa-fargate-alb -> Internet-facing -> Select two public subnets -> Attach security group allowing HTTP 80."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Set Listener to forward to saa-fargate-tg -> Choose Create load balancer."
          }
        ],
        "note": "Fargate tasks use IP target types because `awsvpc` assigns individual ENI IP addresses.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create an ECS Service Backed by ALB",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Return to Amazon ECS -> Click Clusters -> Select saa-fargate-cluster."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Under Services tab, choose Create."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Set Launch type to Fargate."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Select Task definition saa-fargate-task-def."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Set Service name to saa-fargate-web-service -> Desired tasks to 2."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Under Networking: Select your VPC and two private subnets."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Under Load balancing: Select Load balancer type Application Load Balancer -> Select saa-fargate-alb -> Select Target group saa-fargate-tg."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Choose Create."
          }
        ],
        "note": "The ECS service maintains desired task count and registers new task IPs with the ALB.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Configure Target Tracking Auto Scaling Policy",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select saa-fargate-web-service -> Choose Service auto scaling tab -> Click Edit."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Check Use service auto scaling."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Set Minimum number of tasks to 1 and Maximum number of tasks to 4."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Set Scaling policy type to Target tracking."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Select Metric ECSServiceAverageCPUUtilization -> Set Target value to 70 %."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose Save."
          }
        ],
        "note": "Target tracking automatically provisions or terminates Fargate tasks to maintain 70% CPU target.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Verify HTTP Endpoint and Tear Down Resources",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open EC2 Load Balancers -> Copy the DNS name of saa-fargate-alb."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Paste the DNS name into a browser window to verify the NGINX welcome page."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open ECS -> Select saa-fargate-web-service -> Click Update service -> Set Desired tasks to 0 -> Click Delete service."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete cluster saa-fargate-cluster."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete ALB saa-fargate-alb and Target group saa-fargate-tg."
          }
        ],
        "note": null,
        "warning": "Delete the ECS service, cluster, and ALB to prevent continuous hourly compute charges.",
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
            "text": "REGION=us-east-1\nCLUSTER=saa-fargate-cluster\nSERVICE=saa-fargate-web-service"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create ECS Fargate Cluster",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ecs create-cluster --cluster-name $CLUSTER --region $REGION"
          }
        ],
        "note": "Creates serverless Fargate ECS cluster.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Register Fargate Task Definition",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws ecs register-task-definition --family saa-fargate-task-def --network-mode awsvpc --requires-compatibilities FARGATE --cpu 256 --memory 512 --container-definitions '[{\"name\":\"web\",\"image\":\"public.ecr.aws/docker/library/nginx:latest\",\"portMappings\":[{\"containerPort\":80}]}]' --region $REGION"
          }
        ],
        "note": "Registers Task Definition with awsvpc network mode.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create ECS Fargate Service",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ecs create-service --cluster $CLUSTER --service-name $SERVICE --task-definition saa-fargate-task-def --desired-count 2 --launch-type FARGATE --network-configuration '{\"awsvpcConfiguration\":{\"subnets\":[\"subnet-123\",\"subnet-456\"],\"securityGroups\":[\"sg-123\"],\"assignPublicIp\":\"ENABLED\"}}' --region $REGION"
          }
        ],
        "note": "Deploys 2 Fargate tasks in awsvpc network mode.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Tear down ECS Fargate Service and Cluster",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws ecs update-service --cluster $CLUSTER --service $SERVICE --desired-count 0 --region $REGION\naws ecs delete-service --cluster $CLUSTER --service $SERVICE --region $REGION\naws ecs delete-cluster --cluster $CLUSTER --region $REGION"
          }
        ],
        "note": "Scales service down to 0 tasks and deletes resources.",
        "warning": "Destructive Command Warning: This command permanently deletes container repositories, images, ECS services, task definitions, or clusters.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Fargate configuration verified in AWS Fargate."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Scale the Fargate ECS service desired count to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the ECS service, load balancer target group, and ECS cluster."
      },
      {
        "id": "cleanup-3",
        "text": "Delete CloudWatch Log Groups and IAM task execution roles created for the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Fargate vs EC2 Launch Type",
        "body": "Fargate: Serverless container compute (no EC2 server management). EC2 Launch Type: You manage underlying EC2 instance clusters, scaling, and OS patches."
      },
      {
        "id": "cs-2",
        "title": "awsvpc Network Mode",
        "body": "Every task receives its own ENI and private IP in your VPC. Required for Fargate tasks."
      },
      {
        "id": "cs-3",
        "title": "Target Tracking Auto Scaling",
        "body": "Automatically adds or removes Fargate tasks to maintain a specified target metric (e.g., 70% average CPU)."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Fargate Tasks Failing to Pull Image",
        "body": "Ensure `assignPublicIp: ENABLED` if tasks run in public subnets, or configure a NAT Gateway / S3 VPC Endpoint if tasks run in private subnets."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Minimizing Operational Overhead",
        "body": "If an exam question specifies minimizing operational overhead for containers, always select AWS Fargate over EC2 launch types."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Fargate concepts and container orchestration patterns in AWS Fargate."
      }
    ],
    "memoryHook": "Fargate = Serverless Containers | awsvpc = Task ENI IP | ALB = Traffic Distribution",
    "flashcardSetId": null
  }
];
