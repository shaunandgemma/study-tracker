# Amazon ECS and AWS Fargate Follow Along

> **Status:** Offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Intermediate
- **Exam workspace:** AWS SAA-C03
- **AWS Region:** eu-west-2
- **Training prefix:** `fa-ecs-fargate-eks`
- **Account model:** Existing AWS administrator training account; no separate human IAM user/static access key is created.

## Required outcome

Build and push a private ECR image; create an ECS cluster, Fargate task definition and ECS service; integrate the service with an Application Load Balancer; separate task and execution IAM roles; send container logs to CloudWatch; configure ECS Service Auto Scaling and demonstrate controlled scale-out; compare ECS, EKS, Fargate and Lambda; then safely delete only resources created by the lab.

## Completion definition

- The existing AWS administrator training account is verified and used without creating a separate human IAM user/access key.
- A custom Flask application image is built in AWS CloudShell, health-tested locally and pushed to private ECR as immutable tag v1.
- A two-AZ VPC, ALB, IP target group and restricted ALB-to-task security-group flow are created.
- Separate ECS task execution and application task roles are created; the application proves task-role access by reading one exact SSM parameter.
- A Fargate task definition uses awsvpc, 0.25 vCPU/0.5 GB, ECR v1, awslogs and a container /health check.
- An ECS service maintains two Fargate tasks across the two subnets and registers healthy task IPs with the ALB.
- CloudWatch Logs contains application/task output.
- ECS Service Auto Scaling manages desired count between 2 and 4 using CPU target tracking and a fixed five-minute load test demonstrates scale-out.
- The learner can choose ECS, EKS or Lambda based on orchestration/execution requirements and can explain that Fargate is container compute rather than an orchestrator.
- All automation, tasks, ALB/ECR/log/IAM/network resources and CloudShell files are removed in reverse dependency order while the existing administrator account remains unchanged.

## Warnings

### Cost

This lab creates an Application Load Balancer, at least two AWS Fargate tasks and public IPv4 addresses for the tasks, plus ECR and CloudWatch Logs usage. These can incur charges. The public-subnet task design intentionally avoids a NAT gateway for training cost control.

### Safety

Use only the existing disposable AWS administrator training account and exact fa-ecs-fargate-eks resource names/derived IDs. Do not run the controlled CPU generator for more than its fixed five minutes, and never delete unrelated account roles, service-linked roles, networks or repositories.

### Credentials

This Follow Along creates no separate human IAM user or static access key. CloudShell uses the current administrator session. Do not put credentials, ECR authorization passwords or temporary container credentials into source files, task definitions, screenshots, chat or Study Tracker.

### Region

Every lab cloud resource is created in eu-west-2. The two public subnets use eu-west-2a and eu-west-2b.

# Phase 1: Prepare the administrator session and application files

Use an existing AWS administrator account, verify CloudShell/Docker, and create the complete container application files.

## task-01-prerequisites — Verify the AWS administrator account, CloudShell and Docker

- **Feature:** Prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm the disposable AWS administrator training account, eu-west-2, AWS CloudShell and Docker before creating resources.
- **Why it matters:** This Follow Along deliberately uses an existing AWS administrator account for bootstrap and lab execution so no separate human IAM user or access key is created.
- **Exam relevance:** SAA-C03 includes Fargate/serverless compute and ECS/EKS container orchestration selection.
- **Prerequisites:** None
- **Sources:** src-saa-domain3, src-saa-scope, src-cloudshell-docker, src-ecs-image

### Console / browser route

1. Sign in to the disposable AWS training account using an existing AWS administrator account.
2. Confirm the account ID is the intended training account and that no production workload uses the fa-ecs-fargate-eks prefix.
3. In the upper-right Region selector choose Europe (London) eu-west-2.
4. Open AWS CloudShell from the console toolbar.
5. Run aws sts get-caller-identity.
6. Run aws --version.
7. Run docker --version.
8. Run docker info.
9. If Docker is not currently ready in CloudShell, reopen CloudShell and rerun docker info before continuing.
10. Do not create a separate human IAM user or static access key for this Follow Along.

### CLI route

#### CloudShell - verify caller

```text
aws sts get-caller-identity
```

#### CloudShell - verify AWS CLI

```text
aws --version
```

#### CloudShell - verify Docker CLI

```text
docker --version
```

#### CloudShell - verify Docker engine

```text
docker info
```

### Expected results

- The caller identity belongs to the intended administrator training account.
- AWS CLI and Docker both respond successfully in CloudShell.
- No lab resource exists yet.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — The current Region is eu-west-2.
- [ ] **task-01-prerequisites-verify-02** — No static credential is created for the lab.

## task-02-create-app-files — Create the complete container application and load-generator files

- **Feature:** Container application files
- **Difficulty:** Medium
- **Goal:** Create the Flask application, Dockerfile, dependency file, task-registration script, load generator and service-selection matrix in CloudShell.
- **Why it matters:** The application contains health, configuration and controlled CPU endpoints so later tasks can prove ALB health, task IAM and auto scaling instead of deploying a passive hello-world container.
- **Exam relevance:** A task definition points at a container image; application behavior remains inside the image rather than ECS configuration.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-ecs-image, src-cloudshell-docker, src-ecs-taskdef

### Console / browser route

1. In CloudShell create ~/fa-ecs-fargate-eks.
2. Enter that folder.
3. Create app.py, requirements.txt, Dockerfile, register-task-definition.sh, generate-load.sh and service-selection.json.
4. Paste the complete supplied contents into each file.
5. Run python -m py_compile app.py to catch Python syntax errors before building.
6. Run python -m json.tool service-selection.json to validate the decision file.
7. Run chmod +x on both shell scripts.

### CLI route

#### CloudShell - create folder

```text
mkdir -p ~/fa-ecs-fargate-eks
```

#### CloudShell - enter folder

```text
cd ~/fa-ecs-fargate-eks
```

#### CloudShell - validate Python

```text
python3 -m py_compile app.py
```

#### CloudShell - validate JSON

```text
python3 -m json.tool service-selection.json >/dev/null
```

#### CloudShell - make scripts executable

```text
chmod +x register-task-definition.sh generate-load.sh
```

### Complete editable files / policies

#### app.py

```text
import json
import math
import os
import time
import urllib.request

import boto3
from flask import Flask, jsonify, request

app = Flask(__name__)
ssm = boto3.client("ssm", region_name=os.environ.get("AWS_REGION", "eu-west-2"))


def task_metadata():
    uri = os.environ.get("ECS_CONTAINER_METADATA_URI_V4")
    if not uri:
        return {"metadata": "ECS metadata URI is not available"}
    try:
        with urllib.request.urlopen(f"{uri}/task", timeout=2) as response:
            payload = json.loads(response.read().decode("utf-8"))
        return {
            "task_arn": payload.get("TaskARN"),
            "cluster": payload.get("Cluster"),
            "availability_zone": payload.get("AvailabilityZone"),
            "launch_type": payload.get("LaunchType")
        }
    except Exception as exc:
        return {"metadata_error": str(exc)}


@app.get("/")
def index():
    return jsonify(
        message="Amazon ECS and AWS Fargate Follow Along",
        service="fa-ecs-fargate-eks-service",
        task=task_metadata()
    )


@app.get("/health")
def health():
    return "healthy\n", 200, {"Content-Type": "text/plain"}


@app.get("/config")
def config():
    parameter_name = os.environ["MESSAGE_PARAMETER"]
    response = ssm.get_parameter(Name=parameter_name, WithDecryption=False)
    return jsonify(
        parameter=parameter_name,
        value=response["Parameter"]["Value"],
        task=task_metadata()
    )


@app.get("/burn")
def burn():
    seconds = min(max(float(request.args.get("seconds", "5")), 1.0), 10.0)
    end = time.time() + seconds
    result = 0.0
    while time.time() < end:
        result += math.sqrt(12345.6789) * math.sqrt(98765.4321)
    return jsonify(message="CPU training request complete", seconds=seconds, checksum=result)


@app.after_request
def log_request(response):
    print(
        json.dumps(
            {
                "path": request.path,
                "status": response.status_code,
                "task": task_metadata()
            }
        ),
        flush=True
    )
    return response
```

#### requirements.txt

```text
Flask>=3.0,<4.0
boto3>=1.34,<2.0
gunicorn>=22,<24
```

#### Dockerfile

```text
FROM public.ecr.aws/docker/library/python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--threads", "2", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
```

#### register-task-definition.sh

```text
#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="eu-west-2"
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
EXECUTION_ROLE_ARN="$(aws iam get-role --role-name fa-ecs-fargate-eks-execution-role --query Role.Arn --output text)"
TASK_ROLE_ARN="$(aws iam get-role --role-name fa-ecs-fargate-eks-task-role --query Role.Arn --output text)"
IMAGE_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fa-ecs-fargate-eks-app:v1"

cat > task-definition.json <<EOF
{
  "family": "fa-ecs-fargate-eks-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": [
    "FARGATE"
  ],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "${EXECUTION_ROLE_ARN}",
  "taskRoleArn": "${TASK_ROLE_ARN}",
  "containerDefinitions": [
    {
      "name": "fa-ecs-fargate-eks-app",
      "image": "${IMAGE_URI}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp",
          "appProtocol": "http"
        }
      ],
      "environment": [
        {
          "name": "MESSAGE_PARAMETER",
          "value": "/fa-ecs-fargate-eks/message"
        },
        {
          "name": "AWS_REGION",
          "value": "eu-west-2"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/fa-ecs-fargate-eks",
          "awslogs-region": "eu-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "python -c \"import urllib.request; urllib.request.urlopen('http://localhost:8080/health', timeout=2)\" || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 20
      }
    }
  ]
}
EOF

aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region "${AWS_REGION}"
```

#### generate-load.sh

```text
#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: ./generate-load.sh <ALB_DNS_NAME>"
  exit 1
fi

ALB_DNS_NAME="$1"
END_TIME=$((SECONDS + 300))
PIDS=()

for WORKER in 1 2 3 4; do
  (
    while [ "$SECONDS" -lt "$END_TIME" ]; do
      curl --fail --silent --show-error \
        "http://${ALB_DNS_NAME}/burn?seconds=5" \
        >/dev/null || true
    done
  ) &
  PIDS+=("$!")
done

for PID in "${PIDS[@]}"; do
  wait "$PID"
done

echo "Controlled five-minute load test finished."
```

#### service-selection.json

```json
{
  "programme": "Amazon ECS and AWS Fargate Follow Along",
  "resourcePrefix": "fa-ecs-fargate-eks",
  "serviceSelection": [
    {
      "service": "Amazon ECS",
      "orchestrationModel": "AWS-native container orchestration",
      "bestFit": "Containerized services when Kubernetes APIs/ecosystem compatibility are not a requirement and tight AWS integration plus operational simplicity are priorities.",
      "computeChoices": [
        "AWS Fargate",
        "Amazon EC2",
        "Amazon ECS Managed Instances"
      ]
    },
    {
      "service": "Amazon EKS",
      "orchestrationModel": "Managed Kubernetes control plane",
      "bestFit": "Workloads that require Kubernetes APIs, Kubernetes portability, Kubernetes-specific tooling/operators, or an existing Kubernetes operating model.",
      "computeChoices": [
        "AWS Fargate",
        "Amazon EC2",
        "Amazon EKS Auto Mode and supported Kubernetes compute options"
      ]
    },
    {
      "service": "AWS Lambda",
      "orchestrationModel": "Event-driven serverless functions",
      "bestFit": "Short-lived event-driven function execution where the application fits the Lambda execution model rather than a continuously running container service."
    }
  ],
  "fargateReminder": "AWS Fargate is a serverless compute engine for containers used with orchestration services such as Amazon ECS; Fargate is not itself a container orchestrator.",
  "examDecisionRule": "Choose by execution model and orchestration requirement first: AWS-native containers -> ECS, Kubernetes requirement -> EKS, event-driven functions -> Lambda."
}
```

### Expected results

- All six files exist.
- app.py compiles.
- The service-selection JSON is valid.

### Verification checks

- [ ] **task-02-create-app-files-verify-01** — No credential appears in any file.
- [ ] **task-02-create-app-files-verify-02** — The application exposes /, /health, /config and /burn.

# Phase 2: Build and publish the application image

Create a private ECR repository, build the container in AWS CloudShell, test it locally, and push immutable image tag v1.

## task-03-ecr-repository — Create the private Amazon ECR repository

- **Feature:** Amazon ECR
- **Difficulty:** Medium
- **Goal:** Create fa-ecs-fargate-eks-app as a private ECR repository with immutable tags and scan-on-push enabled.
- **Why it matters:** The registry becomes the controlled image source that the Fargate task execution role pulls from later.
- **Exam relevance:** ECR is the AWS-native private registry commonly paired with ECS task definitions.
- **Prerequisites:** task-02-create-app-files
- **Sources:** src-ecr-what, src-ecr-repo, src-ecr-push

### Console / browser route

1. Open Amazon ECR in eu-west-2.
2. Choose Repositories.
3. Choose Create repository.
4. Visibility: Private.
5. Repository name: fa-ecs-fargate-eks-app.
6. Image tag mutability: Immutable.
7. Turn scan on push on.
8. Create the repository.
9. Open it and copy/record the repository URI.

### CLI route

#### CloudShell - create ECR repository

```text
ECR_URI="$(aws ecr create-repository --repository-name fa-ecs-fargate-eks-app --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --query repository.repositoryUri --output text --region eu-west-2)"
```

#### CloudShell - show repository URI

```text
printf "ECR_URI=%s\n" "$ECR_URI"
```

#### CloudShell - describe repository

```text
aws ecr describe-repositories --repository-names fa-ecs-fargate-eks-app --region eu-west-2
```

### Expected results

- The private repository exists in eu-west-2.
- Tag mutability is IMMUTABLE.
- Scan on push is enabled.

### Verification checks

- [ ] **task-03-ecr-repository-verify-01** — The repository name is exactly fa-ecs-fargate-eks-app.
- [ ] **task-03-ecr-repository-verify-02** — The generated URI includes the current AWS account ID.

## task-04-build-push-image — Build, test and push container image v1

- **Feature:** Container image lifecycle
- **Difficulty:** Hard
- **Goal:** Build the application image in CloudShell, run a local health check, authenticate Docker to ECR and push immutable tag v1.
- **Why it matters:** Testing before pushing separates application-image faults from later ECS networking or IAM faults.
- **Exam relevance:** Fargate pulls the image specified in the task definition; ECR authorization is handled through the task execution role at runtime.
- **Prerequisites:** task-03-ecr-repository
- **Sources:** src-cloudshell-docker, src-ecr-push, src-ecs-image, src-ecr-what

### Console / browser route

1. Remain in ~/fa-ecs-fargate-eks.
2. Build the image as fa-ecs-fargate-eks-app:v1.
3. Run the image locally mapping local TCP 8080 to container TCP 8080.
4. Use curl against http://localhost:8080/health and confirm healthy.
5. Stop/remove the local test container.
6. Get the account ID and ECR registry URI.
7. Authenticate Docker to ECR with aws ecr get-login-password piped to docker login --password-stdin. The pipe intentionally sends the short-lived ECR authorization password to Docker through standard input rather than putting it in a file.
8. Tag the image with the exact private ECR URI and v1.
9. Push v1.
10. Open ECR and confirm image tag v1 appears.

### CLI route

#### CloudShell - build image

```text
docker build --tag fa-ecs-fargate-eks-app:v1 .
```

#### CloudShell - run test container

```text
docker run --detach --name fa-ecs-fargate-eks-local --publish 8080:8080 fa-ecs-fargate-eks-app:v1
```

#### CloudShell - test local health

```text
curl --fail http://localhost:8080/health
```

#### CloudShell - remove local test container

```text
docker rm --force fa-ecs-fargate-eks-local
```

#### CloudShell - derive ECR values

```text
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"; ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.eu-west-2.amazonaws.com"; ECR_URI="${ECR_REGISTRY}/fa-ecs-fargate-eks-app"
```

#### CloudShell - authenticate Docker

```text
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin "$ECR_REGISTRY"
```

#### CloudShell - tag image

```text
docker tag fa-ecs-fargate-eks-app:v1 "${ECR_URI}:v1"
```

#### CloudShell - push image

```text
docker push "${ECR_URI}:v1"
```

#### CloudShell - verify ECR image

```text
aws ecr describe-images --repository-name fa-ecs-fargate-eks-app --image-ids imageTag=v1 --region eu-west-2
```

### Expected results

- Local /health returns healthy.
- ECR contains immutable image tag v1.
- The image push completes successfully.

### Verification checks

- [ ] **task-04-build-push-image-verify-01** — The ECR image URI ends /fa-ecs-fargate-eks-app:v1.
- [ ] **task-04-build-push-image-verify-02** — No registry password was saved to a lab file.

# Phase 3: Build the Fargate network and load balancer

Create a two-AZ public VPC, ALB/task security groups, an IP target group and an internet-facing Application Load Balancer.

## task-05-network — Create the two-AZ public VPC for ALB and Fargate

- **Feature:** Fargate networking
- **Difficulty:** Hard
- **Goal:** Create fa-ecs-fargate-eks-vpc with one public subnet in eu-west-2a and one in eu-west-2b, an internet gateway and public route table.
- **Why it matters:** This cost-conscious lab gives Fargate tasks public IPs so they can pull from ECR and reach CloudWatch/SSM without a NAT gateway; task SG rules still prevent direct inbound application traffic.
- **Exam relevance:** Fargate uses awsvpc networking, so each task receives its own ENI and security groups.
- **Prerequisites:** task-04-build-push-image
- **Sources:** src-vpc-create, src-vpc-igw, src-ecs-networking, src-ecs-outbound

### Console / browser route

1. Open VPC in eu-west-2.
2. Create VPC fa-ecs-fargate-eks-vpc with CIDR 10.140.0.0/16.
3. Create fa-ecs-fargate-eks-public-a in eu-west-2a with CIDR 10.140.1.0/24.
4. Create fa-ecs-fargate-eks-public-b in eu-west-2b with CIDR 10.140.2.0/24.
5. Enable auto-assign public IPv4 on both subnets.
6. Create fa-ecs-fargate-eks-igw and attach it to the VPC.
7. Create fa-ecs-fargate-eks-public-rt.
8. Add 0.0.0.0/0 -> fa-ecs-fargate-eks-igw.
9. Associate both public subnets with the route table.
10. Record the design trade-off: public IPs remove NAT-gateway cost for this lab; production services commonly place tasks in private subnets and provide egress through NAT or private VPC endpoints.

### CLI route

#### CloudShell - create VPC

```text
VPC_ID="$(aws ec2 create-vpc --cidr-block 10.140.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=fa-ecs-fargate-eks-vpc},{Key=FollowAlong,Value=fa-ecs-fargate-eks}]" --query Vpc.VpcId --output text --region eu-west-2)"
```

#### CloudShell - subnet A

```text
SUBNET_A_ID="$(aws ec2 create-subnet --vpc-id "$VPC_ID" --availability-zone eu-west-2a --cidr-block 10.140.1.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-ecs-fargate-eks-public-a}]" --query Subnet.SubnetId --output text --region eu-west-2)"
```

#### CloudShell - subnet B

```text
SUBNET_B_ID="$(aws ec2 create-subnet --vpc-id "$VPC_ID" --availability-zone eu-west-2b --cidr-block 10.140.2.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-ecs-fargate-eks-public-b}]" --query Subnet.SubnetId --output text --region eu-west-2)"
```

#### CloudShell - enable public IP A

```text
aws ec2 modify-subnet-attribute --subnet-id "$SUBNET_A_ID" --map-public-ip-on-launch --region eu-west-2
```

#### CloudShell - enable public IP B

```text
aws ec2 modify-subnet-attribute --subnet-id "$SUBNET_B_ID" --map-public-ip-on-launch --region eu-west-2
```

#### CloudShell - create IGW

```text
IGW_ID="$(aws ec2 create-internet-gateway --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=fa-ecs-fargate-eks-igw}]" --query InternetGateway.InternetGatewayId --output text --region eu-west-2)"
```

#### CloudShell - attach IGW

```text
aws ec2 attach-internet-gateway --internet-gateway-id "$IGW_ID" --vpc-id "$VPC_ID" --region eu-west-2
```

#### CloudShell - create route table

```text
RT_ID="$(aws ec2 create-route-table --vpc-id "$VPC_ID" --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-ecs-fargate-eks-public-rt}]" --query RouteTable.RouteTableId --output text --region eu-west-2)"
```

#### CloudShell - create internet route

```text
aws ec2 create-route --route-table-id "$RT_ID" --destination-cidr-block 0.0.0.0/0 --gateway-id "$IGW_ID" --region eu-west-2
```

#### CloudShell - associate A

```text
aws ec2 associate-route-table --route-table-id "$RT_ID" --subnet-id "$SUBNET_A_ID" --region eu-west-2
```

#### CloudShell - associate B

```text
aws ec2 associate-route-table --route-table-id "$RT_ID" --subnet-id "$SUBNET_B_ID" --region eu-west-2
```

### Expected results

- The VPC spans eu-west-2a and eu-west-2b.
- Both subnets route 0.0.0.0/0 to the IGW and auto-assign public IPv4.

### Verification checks

- [ ] **task-05-network-verify-01** — The VPC CIDR is 10.140.0.0/16.
- [ ] **task-05-network-verify-02** — No NAT gateway is created.

## task-06-alb-network — Create ALB/task security groups, IP target group and Application Load Balancer

- **Feature:** ALB integration
- **Difficulty:** Hard
- **Goal:** Expose only the ALB on HTTP:80 and allow Fargate task TCP:8080 only from the ALB security group; create an IP target group and listener.
- **Why it matters:** Fargate tasks use awsvpc ENIs, so an ECS/ALB target group for the service must use IP targets rather than instance targets.
- **Exam relevance:** The ALB creates a stable client endpoint while ECS registers/deregisters task IPs as the service changes.
- **Prerequisites:** task-05-network
- **Sources:** src-vpc-sg, src-ecs-alb, src-ecs-lb, src-alb-target

### Warnings

- The ALB is chargeable while running. Complete the lab and cleanup promptly.

### Console / browser route

1. Open EC2 > Security Groups.
2. Create fa-ecs-fargate-eks-alb-sg in the training VPC.
3. Allow inbound HTTP TCP 80 from 0.0.0.0/0; keep default outbound.
4. Create fa-ecs-fargate-eks-task-sg.
5. Allow inbound Custom TCP 8080 from fa-ecs-fargate-eks-alb-sg only.
6. Do not allow TCP 8080 from the internet.
7. Open Target Groups and create fa-ecs-fargate-eks-tg.
8. Target type: IP addresses.
9. Protocol/port: HTTP:8080.
10. VPC: fa-ecs-fargate-eks-vpc.
11. Health check path: /health; success code 200.
12. Do not manually register targets.
13. Create internet-facing Application Load Balancer fa-ecs-fargate-eks-alb across both training public subnets using fa-ecs-fargate-eks-alb-sg.
14. Create HTTP:80 listener forwarding to fa-ecs-fargate-eks-tg.
15. Wait for the ALB to become Active and record its DNS name.

### CLI route

#### CloudShell - rebuild network IDs

```text
VPC_ID="$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=fa-ecs-fargate-eks-vpc --query "Vpcs[0].VpcId" --output text --region eu-west-2)"; SUBNET_A_ID="$(aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-ecs-fargate-eks-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2)"; SUBNET_B_ID="$(aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-ecs-fargate-eks-public-b --query "Subnets[0].SubnetId" --output text --region eu-west-2)"
```

#### CloudShell - create ALB SG

```text
ALB_SG_ID="$(aws ec2 create-security-group --group-name fa-ecs-fargate-eks-alb-sg --description "HTTP to ECS training ALB" --vpc-id "$VPC_ID" --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=fa-ecs-fargate-eks-alb-sg}]" --query GroupId --output text --region eu-west-2)"
```

#### CloudShell - allow HTTP to ALB

```text
aws ec2 authorize-security-group-ingress --group-id "$ALB_SG_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0 --region eu-west-2
```

#### CloudShell - create task SG

```text
TASK_SG_ID="$(aws ec2 create-security-group --group-name fa-ecs-fargate-eks-task-sg --description "Application traffic only from ALB" --vpc-id "$VPC_ID" --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=fa-ecs-fargate-eks-task-sg}]" --query GroupId --output text --region eu-west-2)"
```

#### CloudShell - allow ALB to tasks

```text
aws ec2 authorize-security-group-ingress --group-id "$TASK_SG_ID" --protocol tcp --port 8080 --source-group "$ALB_SG_ID" --region eu-west-2
```

#### CloudShell - create IP target group

```text
TG_ARN="$(aws elbv2 create-target-group --name fa-ecs-fargate-eks-tg --protocol HTTP --port 8080 --target-type ip --vpc-id "$VPC_ID" --health-check-path /health --health-check-protocol HTTP --matcher HttpCode=200 --tags Key=FollowAlong,Value=fa-ecs-fargate-eks --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2)"
```

#### CloudShell - create ALB

```text
ALB_ARN="$(aws elbv2 create-load-balancer --name fa-ecs-fargate-eks-alb --scheme internet-facing --type application --ip-address-type ipv4 --subnets "$SUBNET_A_ID" "$SUBNET_B_ID" --security-groups "$ALB_SG_ID" --tags Key=FollowAlong,Value=fa-ecs-fargate-eks --query "LoadBalancers[0].LoadBalancerArn" --output text --region eu-west-2)"
```

#### CloudShell - wait ALB

```text
aws elbv2 wait load-balancer-available --load-balancer-arns "$ALB_ARN" --region eu-west-2
```

#### CloudShell - create listener

```text
LISTENER_ARN="$(aws elbv2 create-listener --load-balancer-arn "$ALB_ARN" --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn="$TG_ARN" --query "Listeners[0].ListenerArn" --output text --region eu-west-2)"
```

#### CloudShell - get DNS

```text
ALB_DNS="$(aws elbv2 describe-load-balancers --load-balancer-arns "$ALB_ARN" --query "LoadBalancers[0].DNSName" --output text --region eu-west-2)"; printf "ALB_DNS=%s\n" "$ALB_DNS"
```

### Expected results

- The ALB is Active across both AZs.
- The target group type is ip.
- Task SG port 8080 accepts traffic only from the ALB SG.

### Verification checks

- [ ] **task-06-alb-network-verify-01** — The listener forwards HTTP:80 to fa-ecs-fargate-eks-tg.
- [ ] **task-06-alb-network-verify-02** — No task target is registered yet.

# Phase 4: Create roles, logs, cluster, task definition and Fargate service

Separate execution/task IAM responsibilities, create CloudWatch logging, register the task blueprint and run two Fargate tasks behind the ALB.

## task-07-roles-logs-parameter — Create ECS execution/task IAM roles, CloudWatch log group and training parameter

- **Feature:** Task IAM and logging prerequisites
- **Difficulty:** Hard
- **Goal:** Create separate execution and task roles, create the awslogs destination, and create the exact SSM parameter the application reads.
- **Why it matters:** The execution role is used by ECS/Fargate infrastructure to pull ECR images and send logs; the task role is delivered to application containers for AWS API calls.
- **Exam relevance:** Confusing execution-role permissions with application task-role permissions is a common container-security design mistake.
- **Prerequisites:** task-06-alb-network
- **Sources:** src-ecs-task-role, src-ecs-exec-role, src-ecs-role-best, src-ecs-logs

### Console / browser route

1. Open IAM > Roles > Create role.
2. Create fa-ecs-fargate-eks-execution-role trusted by ecs-tasks.amazonaws.com.
3. Attach AmazonECSTaskExecutionRolePolicy.
4. Create fa-ecs-fargate-eks-task-role with the same ecs-tasks.amazonaws.com trust principal.
5. Add inline policy fa-ecs-fargate-eks-task-ssm allowing only ssm:GetParameter on /fa-ecs-fargate-eks/message in this account and eu-west-2.
6. Open CloudWatch > Log groups and create /ecs/fa-ecs-fargate-eks.
7. Set retention to 1 day.
8. Open Systems Manager > Parameter Store.
9. Create String parameter /fa-ecs-fargate-eks/message with value hello-from-task-iam-role.
10. Do not give the task role ECR or CloudWatch Logs permissions; those belong to the execution role in this design.

### CLI route

#### CloudShell - save ECS task trust

```text
cat > ecs-task-trust.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
```

#### CloudShell - create execution role

```text
aws iam create-role --role-name fa-ecs-fargate-eks-execution-role --assume-role-policy-document file://ecs-task-trust.json
```

#### CloudShell - attach execution managed policy

```text
aws iam attach-role-policy --role-name fa-ecs-fargate-eks-execution-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

#### CloudShell - create task role

```text
aws iam create-role --role-name fa-ecs-fargate-eks-task-role --assume-role-policy-document file://ecs-task-trust.json
```

#### CloudShell - derive account and write task policy

```text
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"; sed "s/ACCOUNT_ID/${AWS_ACCOUNT_ID}/g" task-ssm-policy.template.json > task-ssm-policy.json
```

#### CloudShell - attach task inline policy

```text
aws iam put-role-policy --role-name fa-ecs-fargate-eks-task-role --policy-name fa-ecs-fargate-eks-task-ssm --policy-document file://task-ssm-policy.json
```

#### CloudShell - create log group

```text
aws logs create-log-group --log-group-name /ecs/fa-ecs-fargate-eks --region eu-west-2
```

#### CloudShell - set log retention

```text
aws logs put-retention-policy --log-group-name /ecs/fa-ecs-fargate-eks --retention-in-days 1 --region eu-west-2
```

#### CloudShell - create SSM parameter

```text
aws ssm put-parameter --name /fa-ecs-fargate-eks/message --type String --value hello-from-task-iam-role --region eu-west-2
```

### Complete editable files / policies

#### ECS task trust policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### task-ssm-policy.template.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOnlyTrainingMessage",
      "Effect": "Allow",
      "Action": "ssm:GetParameter",
      "Resource": "arn:aws:ssm:eu-west-2:ACCOUNT_ID:parameter/fa-ecs-fargate-eks/message"
    }
  ]
}
```

### Expected results

- Both IAM roles exist.
- The execution role has AmazonECSTaskExecutionRolePolicy.
- The task role can read only the training SSM parameter.
- The log group and parameter exist.

### Verification checks

- [ ] **task-07-roles-logs-parameter-verify-01** — The two role ARNs are different.
- [ ] **task-07-roles-logs-parameter-verify-02** — The log retention is 1 day.

## task-08-cluster-taskdef — Create the ECS cluster and register the Fargate task definition

- **Feature:** ECS cluster and task definition
- **Difficulty:** Hard
- **Goal:** Create the ECS cluster and register a Fargate task definition using the ECR image, awsvpc, two IAM roles, awslogs and container health check.
- **Why it matters:** The task definition is the versioned application blueprint while the cluster is the logical ECS orchestration boundary.
- **Exam relevance:** Fargate task definitions require awsvpc networking and supported CPU/memory combinations.
- **Prerequisites:** task-07-roles-logs-parameter
- **Sources:** src-ecs-cluster, src-ecs-taskdef, src-ecs-fargate-taskdef, src-ecs-task-params, src-ecs-logs

### Console / browser route

1. Open Amazon ECS.
2. Choose Clusters > Create cluster.
3. Cluster name: fa-ecs-fargate-eks-cluster.
4. Create the cluster without adding EC2 container instances.
5. In CloudShell run register-task-definition.sh.
6. Open ECS > Task definitions > fa-ecs-fargate-eks-task.
7. Open revision 1.
8. Confirm launch compatibility includes Fargate.
9. Confirm CPU 0.25 vCPU and memory 0.5 GB.
10. Confirm network mode awsvpc.
11. Confirm execution role and task role are different.
12. Confirm container port 8080, awslogs configuration and /health container health check.

### CLI route

#### CloudShell - create cluster

```text
aws ecs create-cluster --cluster-name fa-ecs-fargate-eks-cluster --tags key=FollowAlong,value=fa-ecs-fargate-eks --region eu-west-2
```

#### CloudShell - register task definition

```text
./register-task-definition.sh
```

#### CloudShell - capture task definition ARN

```text
TASK_DEF_ARN="$(aws ecs describe-task-definition --task-definition fa-ecs-fargate-eks-task --query "taskDefinition.taskDefinitionArn" --output text --region eu-west-2)"
```

#### CloudShell - inspect task definition

```text
aws ecs describe-task-definition --task-definition "$TASK_DEF_ARN" --region eu-west-2
```

### Complete editable files / policies

#### register-task-definition.sh

```text
#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="eu-west-2"
AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
EXECUTION_ROLE_ARN="$(aws iam get-role --role-name fa-ecs-fargate-eks-execution-role --query Role.Arn --output text)"
TASK_ROLE_ARN="$(aws iam get-role --role-name fa-ecs-fargate-eks-task-role --query Role.Arn --output text)"
IMAGE_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fa-ecs-fargate-eks-app:v1"

cat > task-definition.json <<EOF
{
  "family": "fa-ecs-fargate-eks-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": [
    "FARGATE"
  ],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "${EXECUTION_ROLE_ARN}",
  "taskRoleArn": "${TASK_ROLE_ARN}",
  "containerDefinitions": [
    {
      "name": "fa-ecs-fargate-eks-app",
      "image": "${IMAGE_URI}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp",
          "appProtocol": "http"
        }
      ],
      "environment": [
        {
          "name": "MESSAGE_PARAMETER",
          "value": "/fa-ecs-fargate-eks/message"
        },
        {
          "name": "AWS_REGION",
          "value": "eu-west-2"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/fa-ecs-fargate-eks",
          "awslogs-region": "eu-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "python -c \"import urllib.request; urllib.request.urlopen('http://localhost:8080/health', timeout=2)\" || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 20
      }
    }
  ]
}
EOF

aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region "${AWS_REGION}"
```

### Expected results

- The ECS cluster is Active.
- Task definition revision 1 is ACTIVE and Fargate-compatible.
- The task blueprint references ECR v1 and the CloudWatch log group.

### Verification checks

- [ ] **task-08-cluster-taskdef-verify-01** — networkMode is awsvpc.
- [ ] **task-08-cluster-taskdef-verify-02** — executionRoleArn and taskRoleArn are both set.
- [ ] **task-08-cluster-taskdef-verify-03** — Container port is 8080.

## task-09-create-service — Create the two-task Fargate ECS service behind the ALB

- **Feature:** ECS service on Fargate
- **Difficulty:** Hard
- **Goal:** Create fa-ecs-fargate-eks-service with desired count 2 across both public subnets, public task ENIs, task SG and ALB target group.
- **Why it matters:** An ECS service continuously maintains the desired number of tasks and integrates task registration with the load balancer.
- **Exam relevance:** Fargate removes EC2 container-host management while ECS remains the orchestrator.
- **Prerequisites:** task-08-cluster-taskdef
- **Sources:** src-ecs-services, src-ecs-fargate-taskdef, src-ecs-alb, src-ecs-lb, src-ecs-networking

### Warnings

- Fargate tasks, task public IPv4 addresses and the ALB are chargeable while running. Complete verification/scaling and cleanup promptly.

### Console / browser route

1. Open ECS > fa-ecs-fargate-eks-cluster > Services > Create.
2. Compute options: Launch type.
3. Launch type: FARGATE.
4. Platform version: LATEST.
5. Application type: Service.
6. Task definition family: fa-ecs-fargate-eks-task, latest revision.
7. Service name: fa-ecs-fargate-eks-service.
8. Desired tasks: 2.
9. VPC: fa-ecs-fargate-eks-vpc.
10. Subnets: both training public subnets.
11. Security group: fa-ecs-fargate-eks-task-sg.
12. Public IP: Turned on for this lab.
13. Load balancing: Application Load Balancer.
14. Use existing fa-ecs-fargate-eks-alb listener and fa-ecs-fargate-eks-tg.
15. Container: fa-ecs-fargate-eks-app:8080.
16. Health check grace period: 60 seconds.
17. Create the service.
18. Wait until the service reports 2 Running tasks and the target group reports 2 healthy IP targets.

### CLI route

#### CloudShell - rebuild service networking

```text
SUBNET_A_ID="$(aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-ecs-fargate-eks-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2)"; SUBNET_B_ID="$(aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-ecs-fargate-eks-public-b --query "Subnets[0].SubnetId" --output text --region eu-west-2)"; TASK_SG_ID="$(aws ec2 describe-security-groups --filters Name=group-name,Values=fa-ecs-fargate-eks-task-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2)"; TG_ARN="$(aws elbv2 describe-target-groups --names fa-ecs-fargate-eks-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2)"
```

#### CloudShell - create Fargate service

```text
aws ecs create-service --cluster fa-ecs-fargate-eks-cluster --service-name fa-ecs-fargate-eks-service --task-definition fa-ecs-fargate-eks-task --desired-count 2 --launch-type FARGATE --platform-version LATEST --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_A_ID,$SUBNET_B_ID],securityGroups=[$TASK_SG_ID],assignPublicIp=ENABLED}" --load-balancers "targetGroupArn=$TG_ARN,containerName=fa-ecs-fargate-eks-app,containerPort=8080" --health-check-grace-period-seconds 60 --deployment-configuration minimumHealthyPercent=50,maximumPercent=200 --region eu-west-2
```

#### CloudShell - wait service stable

```text
aws ecs wait services-stable --cluster fa-ecs-fargate-eks-cluster --services fa-ecs-fargate-eks-service --region eu-west-2
```

#### CloudShell - inspect service

```text
aws ecs describe-services --cluster fa-ecs-fargate-eks-cluster --services fa-ecs-fargate-eks-service --region eu-west-2
```

#### CloudShell - inspect target health

```text
aws elbv2 describe-target-health --target-group-arn "$TG_ARN" --region eu-west-2
```

### Expected results

- The service reaches steady state with desired/running count 2.
- The target group shows two healthy IP targets.
- Tasks are Fargate tasks with awsvpc ENIs.

### Verification checks

- [ ] **task-09-create-service-verify-01** — The target type is ip rather than instance.
- [ ] **task-09-create-service-verify-02** — Direct inbound 8080 is restricted to the ALB SG.

# Phase 5: Verify task IAM, logs and service auto scaling

Prove the application uses its task role, inspect CloudWatch logs, configure CPU target tracking, and generate controlled load to demonstrate scale-out.

## task-10-verify-app-task-role — Verify ALB routing and task IAM role access

- **Feature:** Task IAM verification
- **Difficulty:** Hard
- **Goal:** Call /, /health and /config through the ALB to prove healthy Fargate routing and application-level SSM access through the task role.
- **Why it matters:** A successful /config call proves the application container receives task-role credentials independently from the execution role used to launch the task.
- **Exam relevance:** Use task roles for application AWS API access rather than embedding credentials in images or environment files.
- **Prerequisites:** task-09-create-service
- **Sources:** src-ecs-task-role, src-ecs-role-best, src-ecs-alb, src-ecs-services

### Console / browser route

1. Open EC2 > Load Balancers > fa-ecs-fargate-eks-alb and copy its DNS name.
2. Open http://<ALB-DNS>/ and confirm JSON identifies the ECS service/task metadata.
3. Open /health and confirm healthy.
4. Open /config.
5. Confirm value hello-from-task-iam-role is returned.
6. Refresh / several times and observe task metadata can change as the ALB distributes requests.
7. Open ECS service Tasks and compare task ARNs/AZs with the application responses.

### CLI route

#### CloudShell - get ALB DNS

```text
ALB_DNS="$(aws elbv2 describe-load-balancers --names fa-ecs-fargate-eks-alb --query "LoadBalancers[0].DNSName" --output text --region eu-west-2)"
```

#### CloudShell - request application

```text
curl --fail "http://${ALB_DNS}/"
```

#### CloudShell - request health

```text
curl --fail "http://${ALB_DNS}/health"
```

#### CloudShell - prove task-role SSM read

```text
curl --fail "http://${ALB_DNS}/config"
```

#### CloudShell - list service tasks

```text
aws ecs list-tasks --cluster fa-ecs-fargate-eks-cluster --service-name fa-ecs-fargate-eks-service --region eu-west-2
```

### Expected results

- The ALB returns successful application responses.
- /config returns the exact SSM training message.
- No AWS credential was supplied to the container.

### Verification checks

- [ ] **task-10-verify-app-task-role-verify-01** — The application can read only the parameter authorized to the task role.
- [ ] **task-10-verify-app-task-role-verify-02** — The target group remains healthy.

## task-11-cloudwatch-logs — Inspect container stdout/stderr in CloudWatch Logs

- **Feature:** CloudWatch logs
- **Difficulty:** Medium
- **Goal:** Locate task log streams and verify application request entries written by the awslogs driver.
- **Why it matters:** Centralized container logs are essential because Fargate does not provide a customer-managed host filesystem to inspect like a traditional EC2 container host.
- **Exam relevance:** The task execution role supplies logging permissions while the container writes application output to stdout/stderr.
- **Prerequisites:** task-10-verify-app-task-role
- **Sources:** src-ecs-logs, src-ecs-cloudwatch-view, src-ecs-exec-role

### Console / browser route

1. Open CloudWatch > Log groups > /ecs/fa-ecs-fargate-eks.
2. Open the ecs/fa-ecs-fargate-eks-app task log streams.
3. Find entries for /, /health or /config.
4. Return to ECS > service > Logs and confirm the same centralized log data is visible there when the console surfaces it.
5. Confirm retention is 1 day.

### CLI route

#### CloudShell - list streams

```text
aws logs describe-log-streams --log-group-name /ecs/fa-ecs-fargate-eks --order-by LastEventTime --descending --region eu-west-2
```

#### CloudShell - tail logs

```text
aws logs tail /ecs/fa-ecs-fargate-eks --since 10m --region eu-west-2
```

### Expected results

- CloudWatch contains container logs for requests made through the ALB.
- Multiple task log streams can appear as tasks run/redeploy.

### Verification checks

- [ ] **task-11-cloudwatch-logs-verify-01** — The log group name exactly matches the task definition.
- [ ] **task-11-cloudwatch-logs-verify-02** — Retention is 1 day.

## task-12-service-autoscaling — Configure ECS Service Auto Scaling with CPU target tracking

- **Feature:** ECS Service Auto Scaling
- **Difficulty:** Hard
- **Goal:** Register the service as a scalable target with min 2/max 4 and apply ECSServiceAverageCPUUtilization target 30%.
- **Why it matters:** Application Auto Scaling changes the ECS service desired count rather than creating EC2 container hosts because Fargate capacity is managed by AWS.
- **Exam relevance:** Target tracking is useful when the desired task count should follow service utilization automatically.
- **Prerequisites:** task-11-cloudwatch-logs
- **Sources:** src-ecs-autoscaling, src-ecs-targettracking, src-ecs-target-create, src-ecs-autoscale-iam, src-ecs-monitor

### Console / browser route

1. Open ECS > fa-ecs-fargate-eks-service.
2. Open Service Auto Scaling / service configuration update.
3. Minimum tasks: 2.
4. Maximum tasks: 4.
5. Create target tracking policy fa-ecs-fargate-eks-cpu-scaling.
6. Metric: ECS service average CPU utilization.
7. Target value: 30%.
8. Scale-out cooldown: 60 seconds.
9. Scale-in cooldown: 120 seconds.
10. Keep scale in enabled.
11. Save.
12. Open CloudWatch alarms and observe the alarms managed for target tracking.

### CLI route

#### CloudShell - register scalable target

```text
aws application-autoscaling register-scalable-target --service-namespace ecs --resource-id service/fa-ecs-fargate-eks-cluster/fa-ecs-fargate-eks-service --scalable-dimension ecs:service:DesiredCount --min-capacity 2 --max-capacity 4 --region eu-west-2
```

#### CloudShell - create target tracking policy

```text
aws application-autoscaling put-scaling-policy --service-namespace ecs --resource-id service/fa-ecs-fargate-eks-cluster/fa-ecs-fargate-eks-service --scalable-dimension ecs:service:DesiredCount --policy-name fa-ecs-fargate-eks-cpu-scaling --policy-type TargetTrackingScaling --target-tracking-scaling-policy-configuration '{"TargetValue":30.0,"PredefinedMetricSpecification":{"PredefinedMetricType":"ECSServiceAverageCPUUtilization"},"ScaleOutCooldown":60,"ScaleInCooldown":120,"DisableScaleIn":false}' --region eu-west-2
```

#### CloudShell - inspect scalable target

```text
aws application-autoscaling describe-scalable-targets --service-namespace ecs --resource-ids service/fa-ecs-fargate-eks-cluster/fa-ecs-fargate-eks-service --region eu-west-2
```

#### CloudShell - inspect scaling policy

```text
aws application-autoscaling describe-scaling-policies --service-namespace ecs --resource-id service/fa-ecs-fargate-eks-cluster/fa-ecs-fargate-eks-service --scalable-dimension ecs:service:DesiredCount --region eu-west-2
```

### Expected results

- The service scalable target has min 2/max 4.
- The target tracking policy target is 30% average CPU.
- Target tracking alarms are created/managed by Application Auto Scaling.

### Verification checks

- [ ] **task-12-service-autoscaling-verify-01** — The scalable resource ID matches cluster/service exactly.
- [ ] **task-12-service-autoscaling-verify-02** — Scale-in is enabled.

## task-13-generate-load — Generate controlled CPU load and observe Fargate task scale-out

- **Feature:** Scaling verification
- **Difficulty:** Hard
- **Goal:** Run a five-minute four-worker HTTP load against /burn and observe ECS increase desired/running task count above 2 without exceeding 4.
- **Why it matters:** This proves end-to-end interaction between ALB request distribution, container CPU, CloudWatch ECS metrics and Application Auto Scaling.
- **Exam relevance:** Autoscaling is metric-driven and asynchronous, so scaling verification requires observing service events, desired count and metrics over several minutes.
- **Prerequisites:** task-12-service-autoscaling
- **Sources:** src-ecs-autoscaling, src-ecs-targettracking, src-ecs-monitor, src-ecs-alb

### Warnings

- Scaling depends on CloudWatch metric evaluation and task startup time. Allow several minutes before deciding that the target tracking policy did not react.

### Console / browser route

1. Open ECS > fa-ecs-fargate-eks-service and keep the Events/Tasks area visible.
2. Open CloudWatch ECS service CPUUtilization for the service.
3. In CloudShell get ALB_DNS.
4. Run ./generate-load.sh "$ALB_DNS".
5. The script runs four concurrent workers for five minutes; do not increase the worker count or duration.
6. Watch desired count and running tasks.
7. When a scale-out event occurs, note desired count greater than 2.
8. Wait for new task target health to become healthy.
9. Confirm desired count never exceeds maximum 4.
10. After the five-minute script finishes, stop generating traffic and allow the service to settle; scale-in is not required before the next task.

### CLI route

#### CloudShell - get ALB DNS

```text
ALB_DNS="$(aws elbv2 describe-load-balancers --names fa-ecs-fargate-eks-alb --query "LoadBalancers[0].DNSName" --output text --region eu-west-2)"
```

#### CloudShell - run controlled load

```text
./generate-load.sh "$ALB_DNS"
```

#### CloudShell - inspect ECS service

```text
aws ecs describe-services --cluster fa-ecs-fargate-eks-cluster --services fa-ecs-fargate-eks-service --query "services[0].{Desired:desiredCount,Running:runningCount,Pending:pendingCount,Events:events[0:8]}" --region eu-west-2
```

#### CloudShell - inspect scaling activity via ECS events

```text
aws ecs describe-services --cluster fa-ecs-fargate-eks-cluster --services fa-ecs-fargate-eks-service --query "services[0].events[0:10]" --region eu-west-2
```

### Complete editable files / policies

#### generate-load.sh

```text
#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: ./generate-load.sh <ALB_DNS_NAME>"
  exit 1
fi

ALB_DNS_NAME="$1"
END_TIME=$((SECONDS + 300))
PIDS=()

for WORKER in 1 2 3 4; do
  (
    while [ "$SECONDS" -lt "$END_TIME" ]; do
      curl --fail --silent --show-error \
        "http://${ALB_DNS_NAME}/burn?seconds=5" \
        >/dev/null || true
    done
  ) &
  PIDS+=("$!")
done

for PID in "${PIDS[@]}"; do
  wait "$PID"
done

echo "Controlled five-minute load test finished."
```

### Expected results

- CPU rises during controlled /burn traffic.
- The service can increase desired count above 2, up to maximum 4.
- New Fargate tasks are automatically registered with the ALB target group.

### Verification checks

- [ ] **task-13-generate-load-verify-01** — Desired count never exceeds 4.
- [ ] **task-13-generate-load-verify-02** — The application remains reachable through the ALB during scale-out.

# Phase 6: Compare ECS, EKS, Fargate and Lambda

Turn the hands-on service into a clear SAA-C03 compute/container service-selection model.

## task-14-ecs-eks-lambda — Compare ECS, EKS, Fargate and Lambda

- **Feature:** Container service selection
- **Difficulty:** Hard
- **Goal:** Use the decision file and official AWS decision guidance to choose ECS, EKS or Lambda, while treating Fargate correctly as container compute rather than an orchestrator.
- **Why it matters:** A correct SAA-C03 answer usually starts with execution/orchestration requirements, not familiarity with a service name.
- **Exam relevance:** ECS and EKS orchestrate containers; Lambda is a serverless function execution model; Fargate supplies serverless container compute for supported orchestration platforms.
- **Prerequisites:** task-13-generate-load
- **Sources:** src-container-choice, src-fargate-lambda, src-saa-domain3, src-ecs-cluster

### Console / browser route

1. Open service-selection.json.
2. Review Amazon ECS: AWS-native container orchestration without requiring Kubernetes APIs.
3. Review Amazon EKS: managed Kubernetes when Kubernetes APIs, portability, operators or Kubernetes tooling are requirements.
4. Review AWS Lambda: event-driven functions for workloads that fit the Lambda execution model.
5. Review the Fargate reminder: Fargate is serverless container compute, not a separate orchestrator.
6. Open the AWS container decision guide and compare the same services.
7. Apply the exam rule: AWS-native container service with no Kubernetes requirement -> ECS; Kubernetes requirement -> EKS; event-driven function -> Lambda.
8. Relate the live lab to the decision: this is ECS orchestration + Fargate compute + ECR registry + ALB + Application Auto Scaling + CloudWatch.

### CLI route

#### CloudShell - inspect service-selection matrix

```text
python3 -m json.tool service-selection.json
```

### Complete editable files / policies

#### service-selection.json

```json
{
  "programme": "Amazon ECS and AWS Fargate Follow Along",
  "resourcePrefix": "fa-ecs-fargate-eks",
  "serviceSelection": [
    {
      "service": "Amazon ECS",
      "orchestrationModel": "AWS-native container orchestration",
      "bestFit": "Containerized services when Kubernetes APIs/ecosystem compatibility are not a requirement and tight AWS integration plus operational simplicity are priorities.",
      "computeChoices": [
        "AWS Fargate",
        "Amazon EC2",
        "Amazon ECS Managed Instances"
      ]
    },
    {
      "service": "Amazon EKS",
      "orchestrationModel": "Managed Kubernetes control plane",
      "bestFit": "Workloads that require Kubernetes APIs, Kubernetes portability, Kubernetes-specific tooling/operators, or an existing Kubernetes operating model.",
      "computeChoices": [
        "AWS Fargate",
        "Amazon EC2",
        "Amazon EKS Auto Mode and supported Kubernetes compute options"
      ]
    },
    {
      "service": "AWS Lambda",
      "orchestrationModel": "Event-driven serverless functions",
      "bestFit": "Short-lived event-driven function execution where the application fits the Lambda execution model rather than a continuously running container service."
    }
  ],
  "fargateReminder": "AWS Fargate is a serverless compute engine for containers used with orchestration services such as Amazon ECS; Fargate is not itself a container orchestrator.",
  "examDecisionRule": "Choose by execution model and orchestration requirement first: AWS-native containers -> ECS, Kubernetes requirement -> EKS, event-driven functions -> Lambda."
}
```

### Expected results

- The learner can explain ECS versus EKS versus Lambda without calling Fargate an orchestrator.
- The live architecture maps clearly to ECS + Fargate.

### Verification checks

- [ ] **task-14-ecs-eks-lambda-verify-01** — The learner can identify Kubernetes as the key EKS requirement trigger rather than choosing EKS merely because the workload is containerized.

## task-15-exam-review — Review the full SAA-C03 ECS/Fargate architecture

- **Feature:** Exam consolidation
- **Difficulty:** Easy
- **Goal:** Turn the hands-on implementation into a concise container architecture model before teardown.
- **Why it matters:** The exam tests selection and architecture relationships: image registry, task blueprint, service desired count, IAM boundary, networking, load balancing, logs and scaling.
- **Exam relevance:** Understanding component responsibility prevents selecting the wrong service or IAM role.
- **Prerequisites:** task-14-ecs-eks-lambda
- **Sources:** src-ecr-what, src-ecs-taskdef, src-ecs-services, src-ecs-task-role, src-ecs-exec-role, src-ecs-alb, src-ecs-autoscaling, src-ecs-logs

### Console / browser route

1. ECR stores private container images.
2. ECS cluster is the orchestration grouping/boundary.
3. Task definition is a versioned blueprint for containers, resources, roles, networking/logging configuration.
4. Task is one running instantiation of a task definition.
5. ECS service maintains desired task count and deployments.
6. Fargate supplies the managed compute for tasks; there are no customer-managed ECS container EC2 hosts in this lab.
7. Task execution role: ECS/Fargate infrastructure actions such as ECR image pull and awslogs delivery.
8. Task role: application container's AWS API permissions; this lab proves it with SSM GetParameter.
9. Fargate uses awsvpc; each task gets an ENI.
10. ALB target group uses target type IP for Fargate/awsvpc.
11. CloudWatch Logs receives stdout/stderr through awslogs.
12. Application Auto Scaling changes ECS service desired count between configured minimum and maximum.
13. Exam trigger: no Kubernetes requirement + containers -> ECS is often simpler.
14. Exam trigger: Kubernetes API/ecosystem requirement -> EKS.
15. Exam trigger: event-driven function execution -> Lambda.
16. Exam trigger: serverless containers without managing EC2 hosts -> Fargate as the compute option.

### CLI route

#### CloudShell - final service summary

```text
aws ecs describe-services --cluster fa-ecs-fargate-eks-cluster --services fa-ecs-fargate-eks-service --query "services[0].{Desired:desiredCount,Running:runningCount,LaunchType:launchType,TaskDefinition:taskDefinition}" --region eu-west-2
```

#### CloudShell - final target health

```text
TG_ARN="$(aws elbv2 describe-target-groups --names fa-ecs-fargate-eks-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2)"; aws elbv2 describe-target-health --target-group-arn "$TG_ARN" --region eu-west-2
```

#### CloudShell - final logs

```text
aws logs tail /ecs/fa-ecs-fargate-eks --since 10m --region eu-west-2
```

### Expected results

- The learner can describe the complete ECR -> task definition -> service -> Fargate -> ALB path.
- The learner can distinguish task role from execution role and ECS from EKS/Lambda.

### Verification checks

- [ ] **task-15-exam-review-verify-01** — The active service uses the expected task family and Fargate launch type.

# Phase 7: Reverse-dependency cleanup

Stop automation first, then delete the service, ALB, task definitions, cluster, image/repository, roles, network and CloudShell files.

## task-16-stop-scaling-service — Stop Service Auto Scaling and delete the ECS service

- **Feature:** Scaling and service cleanup
- **Difficulty:** Hard
- **Goal:** Delete the target tracking policy/deregister the scalable target, set desired count to zero, then delete the ECS service.
- **Why it matters:** Autoscaling must be disabled before teardown so it cannot add tasks while dependent ALB/network resources are being removed.
- **Exam relevance:** Reverse dependency starts with automation and running workloads, not the underlying network.
- **Prerequisites:** task-15-exam-review
- **Sources:** src-ecs-autoscaling, src-ecs-services

### Console / browser route

1. Confirm generate-load.sh is no longer running.
2. Open ECS > service Auto Scaling and delete fa-ecs-fargate-eks-cpu-scaling.
3. Set service desired tasks to 0.
4. Wait until Running tasks is 0.
5. Delete fa-ecs-fargate-eks-service.
6. Confirm no task remains in the service.

### CLI route

#### CloudShell - delete scaling policy

```text
aws application-autoscaling delete-scaling-policy --service-namespace ecs --resource-id service/fa-ecs-fargate-eks-cluster/fa-ecs-fargate-eks-service --scalable-dimension ecs:service:DesiredCount --policy-name fa-ecs-fargate-eks-cpu-scaling --region eu-west-2
```

#### CloudShell - deregister scalable target

```text
aws application-autoscaling deregister-scalable-target --service-namespace ecs --resource-id service/fa-ecs-fargate-eks-cluster/fa-ecs-fargate-eks-service --scalable-dimension ecs:service:DesiredCount --region eu-west-2
```

#### CloudShell - scale service to zero

```text
aws ecs update-service --cluster fa-ecs-fargate-eks-cluster --service fa-ecs-fargate-eks-service --desired-count 0 --region eu-west-2
```

#### CloudShell - wait service stable

```text
aws ecs wait services-stable --cluster fa-ecs-fargate-eks-cluster --services fa-ecs-fargate-eks-service --region eu-west-2
```

#### CloudShell - delete service

```text
aws ecs delete-service --cluster fa-ecs-fargate-eks-cluster --service fa-ecs-fargate-eks-service --region eu-west-2
```

### Expected results

- The scaling policy/scalable target are removed.
- No Fargate task remains.
- The ECS service enters inactive/deleted state.

### Verification checks

- [ ] **task-16-stop-scaling-service-verify-01** — No automation can launch a replacement task during further cleanup.

## task-17-cloud-cleanup — Delete ALB, ECS/ECR/log/IAM application resources and the VPC

- **Feature:** Cloud cleanup
- **Difficulty:** Hard
- **Goal:** Delete load-balancing dependencies, task definition/cluster, ECR repository, SSM parameter, log group, ECS roles, security groups and network in reverse dependency order.
- **Why it matters:** The target group cannot be removed while a listener references it, and security groups/subnets cannot be deleted while ALB/task ENIs still depend on them.
- **Exam relevance:** Container cleanup must include the image registry and log/role resources, not just the running tasks.
- **Prerequisites:** task-16-stop-scaling-service
- **Sources:** src-ecs-alb, src-ecs-taskdef, src-ecr-push, src-ecs-logs, src-vpc-igw

### Warnings

- If security-group deletion reports a dependency, wait for ALB/task ENIs to disappear and retry only the exact fa-ecs-fargate-eks security group.

### Console / browser route

1. Delete the HTTP listener from fa-ecs-fargate-eks-alb.
2. Delete fa-ecs-fargate-eks-alb and wait until its ENIs are gone.
3. Delete fa-ecs-fargate-eks-tg.
4. Deregister every ACTIVE revision of fa-ecs-fargate-eks-task.
5. Delete fa-ecs-fargate-eks-cluster.
6. Delete the ECR repository with force so image v1 is removed.
7. Delete /fa-ecs-fargate-eks/message from Parameter Store.
8. Delete /ecs/fa-ecs-fargate-eks from CloudWatch Logs.
9. Delete fa-ecs-fargate-eks-task-ssm inline policy and fa-ecs-fargate-eks-task-role.
10. Detach AmazonECSTaskExecutionRolePolicy and delete fa-ecs-fargate-eks-execution-role.
11. Delete fa-ecs-fargate-eks-task-sg, then fa-ecs-fargate-eks-alb-sg.
12. Remove the two explicit route-table associations and delete fa-ecs-fargate-eks-public-rt.
13. Detach/delete fa-ecs-fargate-eks-igw.
14. Delete both public subnets.
15. Delete fa-ecs-fargate-eks-vpc.
16. Verify no chargeable ALB or Fargate task remains.

### CLI route

#### CloudShell - rebuild ALB dependencies

```text
ALB_ARN="$(aws elbv2 describe-load-balancers --names fa-ecs-fargate-eks-alb --query "LoadBalancers[0].LoadBalancerArn" --output text --region eu-west-2)"; LISTENER_ARN="$(aws elbv2 describe-listeners --load-balancer-arn "$ALB_ARN" --query "Listeners[0].ListenerArn" --output text --region eu-west-2)"; TG_ARN="$(aws elbv2 describe-target-groups --names fa-ecs-fargate-eks-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2)"
```

#### CloudShell - delete listener

```text
aws elbv2 delete-listener --listener-arn "$LISTENER_ARN" --region eu-west-2
```

#### CloudShell - delete ALB

```text
aws elbv2 delete-load-balancer --load-balancer-arn "$ALB_ARN" --region eu-west-2
```

#### CloudShell - wait ALB deleted

```text
aws elbv2 wait load-balancers-deleted --load-balancer-arns "$ALB_ARN" --region eu-west-2
```

#### CloudShell - delete target group

```text
aws elbv2 delete-target-group --target-group-arn "$TG_ARN" --region eu-west-2
```

#### CloudShell - deregister active task definitions

```text
for ARN in $(aws ecs list-task-definitions --family-prefix fa-ecs-fargate-eks-task --status ACTIVE --query "taskDefinitionArns[]" --output text --region eu-west-2); do aws ecs deregister-task-definition --task-definition "$ARN" --region eu-west-2 >/dev/null; done
```

#### CloudShell - delete ECS cluster

```text
aws ecs delete-cluster --cluster fa-ecs-fargate-eks-cluster --region eu-west-2
```

#### CloudShell - delete ECR repository/image

```text
aws ecr delete-repository --repository-name fa-ecs-fargate-eks-app --force --region eu-west-2
```

#### CloudShell - delete SSM parameter

```text
aws ssm delete-parameter --name /fa-ecs-fargate-eks/message --region eu-west-2
```

#### CloudShell - delete log group

```text
aws logs delete-log-group --log-group-name /ecs/fa-ecs-fargate-eks --region eu-west-2
```

#### CloudShell - delete task inline policy

```text
aws iam delete-role-policy --role-name fa-ecs-fargate-eks-task-role --policy-name fa-ecs-fargate-eks-task-ssm
```

#### CloudShell - delete task role

```text
aws iam delete-role --role-name fa-ecs-fargate-eks-task-role
```

#### CloudShell - detach execution policy

```text
aws iam detach-role-policy --role-name fa-ecs-fargate-eks-execution-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

#### CloudShell - delete execution role

```text
aws iam delete-role --role-name fa-ecs-fargate-eks-execution-role
```

#### CloudShell - rebuild network IDs

```text
VPC_ID="$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=fa-ecs-fargate-eks-vpc --query "Vpcs[0].VpcId" --output text --region eu-west-2)"; TASK_SG_ID="$(aws ec2 describe-security-groups --filters Name=group-name,Values=fa-ecs-fargate-eks-task-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2)"; ALB_SG_ID="$(aws ec2 describe-security-groups --filters Name=group-name,Values=fa-ecs-fargate-eks-alb-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2)"; RT_ID="$(aws ec2 describe-route-tables --filters Name=tag:Name,Values=fa-ecs-fargate-eks-public-rt --query "RouteTables[0].RouteTableId" --output text --region eu-west-2)"; IGW_ID="$(aws ec2 describe-internet-gateways --filters Name=tag:Name,Values=fa-ecs-fargate-eks-igw --query "InternetGateways[0].InternetGatewayId" --output text --region eu-west-2)"; SUBNET_A_ID="$(aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-ecs-fargate-eks-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2)"; SUBNET_B_ID="$(aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-ecs-fargate-eks-public-b --query "Subnets[0].SubnetId" --output text --region eu-west-2)"
```

#### CloudShell - delete task SG

```text
aws ec2 delete-security-group --group-id "$TASK_SG_ID" --region eu-west-2
```

#### CloudShell - delete ALB SG

```text
aws ec2 delete-security-group --group-id "$ALB_SG_ID" --region eu-west-2
```

#### CloudShell - route associations

```text
ASSOCS="$(aws ec2 describe-route-tables --route-table-ids "$RT_ID" --query "RouteTables[0].Associations[?Main==\`false\`].RouteTableAssociationId" --output text --region eu-west-2)"
```

#### CloudShell - remove route associations

```text
for ASSOC in $ASSOCS; do aws ec2 disassociate-route-table --association-id "$ASSOC" --region eu-west-2; done
```

#### CloudShell - delete route table

```text
aws ec2 delete-route-table --route-table-id "$RT_ID" --region eu-west-2
```

#### CloudShell - detach IGW

```text
aws ec2 detach-internet-gateway --internet-gateway-id "$IGW_ID" --vpc-id "$VPC_ID" --region eu-west-2
```

#### CloudShell - delete IGW

```text
aws ec2 delete-internet-gateway --internet-gateway-id "$IGW_ID" --region eu-west-2
```

#### CloudShell - delete subnet A

```text
aws ec2 delete-subnet --subnet-id "$SUBNET_A_ID" --region eu-west-2
```

#### CloudShell - delete subnet B

```text
aws ec2 delete-subnet --subnet-id "$SUBNET_B_ID" --region eu-west-2
```

#### CloudShell - delete VPC

```text
aws ec2 delete-vpc --vpc-id "$VPC_ID" --region eu-west-2
```

### Expected results

- No ECS service/task/cluster remains.
- No ALB/listener/target group remains.
- No ECR repository, training log group, parameter or ECS task roles remain.
- No fa-ecs-fargate-eks VPC resource remains.

### Verification checks

- [ ] **task-17-cloud-cleanup-verify-01** — No chargeable Fargate task or ALB remains.
- [ ] **task-17-cloud-cleanup-verify-02** — The existing administrator account remains unchanged.

## task-18-cloudshell-cleanup — Delete the CloudShell application files and finish the cleanup acknowledgement

- **Feature:** Local cleanup
- **Difficulty:** Easy
- **Goal:** Remove the CloudShell lab folder after all cloud resources are verified absent.
- **Why it matters:** Local image/source artifacts are the final dependency layer and do not need to be kept after the cloud resources are gone.
- **Exam relevance:** The existing administrator account is intentionally retained; this Follow Along created no human IAM user or long-lived credential.
- **Prerequisites:** task-17-cloud-cleanup
- **Sources:** src-cloudshell-docker

### Console / browser route

1. Confirm Task 17 removed every fa-ecs-fargate-eks cloud resource.
2. Return to CloudShell.
3. Change to the home directory.
4. Delete ~/fa-ecs-fargate-eks.
5. Optionally remove the local Docker image fa-ecs-fargate-eks-app:v1 from the CloudShell Docker cache.
6. Do not modify or delete the administrator account used for the lab.
7. Read and affirm the programme cleanup acknowledgement.

### CLI route

#### CloudShell - leave lab folder

```text
cd ~
```

#### CloudShell - delete lab folder

```text
rm -rf ~/fa-ecs-fargate-eks
```

#### CloudShell - remove local Docker image

```text
docker image rm fa-ecs-fargate-eks-app:v1 || true
```

### Expected results

- The CloudShell lab folder is absent.
- The existing AWS administrator account is unchanged.

### Verification checks

- [ ] **task-18-cloudshell-cleanup-verify-01** — No fa-ecs-fargate-eks local source file remains.

# Troubleshooting

## trouble-01 — Docker build fails in CloudShell

- **Likely cause:** Docker engine is not ready, the Dockerfile/app files are incomplete, or a package download failed.
- **Fix:** Run docker info, confirm all files exist in ~/fa-ecs-fargate-eks, rerun python3 -m py_compile app.py, then rebuild.

## trouble-02 — ECR push says no basic auth credentials

- **Likely cause:** Docker has not authenticated to the account's eu-west-2 ECR registry or the login token expired.
- **Fix:** Rebuild ECR_REGISTRY from get-caller-identity and rerun get-login-password piped to docker login before pushing.

## trouble-03 — Fargate task stops with CannotPullContainerError

- **Likely cause:** Task public IP/route is missing or the execution role/ECR image URI is wrong.
- **Fix:** Verify assignPublicIp=ENABLED, both subnets route 0.0.0.0/0 to the IGW, v1 exists in ECR, and the execution role has AmazonECSTaskExecutionRolePolicy.

## trouble-04 — Target group health stays unhealthy

- **Likely cause:** The task SG doesn't permit ALB SG -> TCP 8080, the app failed to start, or /health is not returning 200.
- **Fix:** Inspect ECS service events and CloudWatch logs, verify the task SG source is fa-ecs-fargate-eks-alb-sg and target-group health path is /health.

## trouble-05 — /config returns AccessDenied

- **Likely cause:** The task definition uses the wrong task role or its inline SSM policy does not contain the current account ID.
- **Fix:** Describe the task definition, verify taskRoleArn is fa-ecs-fargate-eks-task-role, and inspect fa-ecs-fargate-eks-task-ssm.

## trouble-06 — No container logs appear

- **Likely cause:** The awslogs configuration/log group or execution-role permissions are wrong.
- **Fix:** Verify log group /ecs/fa-ecs-fargate-eks exists, the task definition uses awslogs, and the execution role has AmazonECSTaskExecutionRolePolicy.

## trouble-07 — Service Auto Scaling does not scale out

- **Likely cause:** CPU has not remained above the target long enough, the load script stopped early, or the scalable target/policy is misconfigured.
- **Fix:** Verify min=2/max=4, target=30, run the fixed five-minute four-worker load once, and review ECS service events/CloudWatch CPU before changing the policy.

## trouble-08 — Target group deletion fails during cleanup

- **Likely cause:** The ALB listener or ECS service still references the target group.
- **Fix:** Confirm the ECS service is deleted, delete the listener and ALB, then retry the exact target group.

## trouble-09 — Security group or subnet deletion fails

- **Likely cause:** ALB or Fargate ENIs have not been released yet.
- **Fix:** Wait after ALB/service deletion, verify no fa-ecs-fargate-eks ENI remains in the VPC, then retry only the exact lab resource.

# Ordered manual cleanup

- **Manual only:** `true`
- **Ordering:** `reverse_dependency`
- **Completion gate:** `acknowledgement`

## Cleanup 1: fa-ecs-fargate-eks-cpu-scaling and ECS scalable target

- **Action:** Delete the target tracking policy and deregister the scalable target.
- **Verification:** Application Auto Scaling no longer lists the ECS service target/policy.
- **Task:** task-16-stop-scaling-service

## Cleanup 2: fa-ecs-fargate-eks-service and its Fargate tasks

- **Action:** Set desired count to zero, wait for zero running tasks, then delete the service.
- **Verification:** No service task remains.
- **Task:** task-16-stop-scaling-service

## Cleanup 3: HTTP:80 listener and fa-ecs-fargate-eks-alb

- **Action:** Delete the listener, then the ALB and wait for deletion.
- **Verification:** The ALB and ALB ENIs are absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 4: fa-ecs-fargate-eks-tg

- **Action:** Delete the target group after service/listener dependencies are gone.
- **Verification:** The target group is absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 5: fa-ecs-fargate-eks-task ACTIVE revisions

- **Action:** Deregister all active task-definition revisions.
- **Verification:** No ACTIVE revision remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 6: fa-ecs-fargate-eks-cluster

- **Action:** Delete the empty ECS cluster.
- **Verification:** The cluster is inactive/deleted.
- **Task:** task-17-cloud-cleanup

## Cleanup 7: fa-ecs-fargate-eks-app ECR repository and image v1

- **Action:** Force-delete the private repository after no task uses its image.
- **Verification:** The repository is absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 8: /fa-ecs-fargate-eks/message and /ecs/fa-ecs-fargate-eks

- **Action:** Delete the SSM parameter and CloudWatch log group.
- **Verification:** Neither resource remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 9: fa-ecs-fargate-eks-task-role and fa-ecs-fargate-eks-execution-role

- **Action:** Delete task inline policy/role and detach managed execution policy before deleting execution role.
- **Verification:** Both ECS task roles are absent.
- **Task:** task-17-cloud-cleanup

## Cleanup 10: fa-ecs-fargate-eks-task-sg and fa-ecs-fargate-eks-alb-sg

- **Action:** Delete task SG first and then ALB SG after dependent ENIs are gone.
- **Verification:** Neither security group remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 11: fa-ecs-fargate-eks-public-rt, fa-ecs-fargate-eks-igw, both subnets and fa-ecs-fargate-eks-vpc

- **Action:** Remove route-table associations and delete VPC resources in reverse dependency order.
- **Verification:** No fa-ecs-fargate-eks VPC resource remains.
- **Task:** task-17-cloud-cleanup

## Cleanup 12: ~/fa-ecs-fargate-eks and local Docker image

- **Action:** Delete CloudShell source files and local image cache last.
- **Verification:** No lab source folder remains; the administrator account is unchanged.
- **Task:** task-18-cloudshell-cleanup

## Programme cleanup acknowledgement

I verified that fa-ecs-fargate-eks-cpu-scaling and the ECS scalable target are removed; fa-ecs-fargate-eks-service has zero tasks and is deleted; the HTTP listener, fa-ecs-fargate-eks-alb and fa-ecs-fargate-eks-tg are deleted; all active fa-ecs-fargate-eks-task revisions are deregistered and fa-ecs-fargate-eks-cluster is deleted; fa-ecs-fargate-eks-app and image v1 are deleted from ECR; /fa-ecs-fargate-eks/message and /ecs/fa-ecs-fargate-eks are deleted; fa-ecs-fargate-eks-task-role and fa-ecs-fargate-eks-execution-role are deleted; both lab security groups and every fa-ecs-fargate-eks VPC resource are deleted; the CloudShell lab folder/local image is removed; no separate human IAM user or static access key was created; the existing AWS administrator account is unchanged; and no unrelated AWS resource was deleted.

# Official sources

## src-saa-domain3 — Content Domain 3: Design High-Performing Architectures

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html
- **Purpose:** SAA-C03 container orchestration, Fargate and compute-selection coverage.
- **Used by:** task-01-prerequisites, task-14-ecs-eks-lambda

## src-saa-scope — In-Scope AWS Services - AWS Certified Solutions Architect - Associate

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html
- **Purpose:** Current in-scope AWS services for SAA-C03.
- **Used by:** task-01-prerequisites

## src-ecr-what — What is Amazon Elastic Container Registry?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html
- **Purpose:** Amazon ECR registry concepts.
- **Used by:** task-03-ecr-repository, task-04-build-push-image, task-15-exam-review

## src-ecr-repo — Creating an Amazon ECR private repository to store images

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html
- **Purpose:** Private ECR repository creation.
- **Used by:** task-03-ecr-repository

## src-ecr-push — Pushing a Docker image to an Amazon ECR private repository

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
- **Purpose:** Authenticate, tag and push images to ECR.
- **Used by:** task-03-ecr-repository, task-04-build-push-image, task-17-cloud-cleanup

## src-cloudshell-docker — Building a Docker container inside CloudShell and pushing it to an Amazon ECR repository

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/cloudshell/latest/userguide/tutorial-docker-cli.html
- **Purpose:** AWS-hosted Docker build and ECR push workflow.
- **Used by:** task-01-prerequisites, task-02-create-app-files, task-04-build-push-image, task-18-cloudshell-cleanup

## src-ecs-image — Creating a container image for use on Amazon ECS

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html
- **Purpose:** Container image creation and ECR use with ECS.
- **Used by:** task-01-prerequisites, task-02-create-app-files, task-04-build-push-image

## src-ecs-cluster — Amazon ECS clusters

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html
- **Purpose:** ECS cluster concepts.
- **Used by:** task-08-cluster-taskdef, task-14-ecs-eks-lambda

## src-ecs-taskdef — Amazon ECS task definitions

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html
- **Purpose:** Task definition as the application blueprint.
- **Used by:** task-02-create-app-files, task-08-cluster-taskdef, task-15-exam-review, task-17-cloud-cleanup

## src-ecs-fargate-taskdef — Amazon ECS task definition differences for Fargate

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html
- **Purpose:** Fargate task requirements including awsvpc networking.
- **Used by:** task-08-cluster-taskdef, task-09-create-service

## src-ecs-task-params — Amazon ECS task definition parameters for Fargate

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html
- **Purpose:** Task/execution role, CPU, memory, networking and container parameters.
- **Used by:** task-08-cluster-taskdef

## src-ecs-task-role — Amazon ECS task IAM role

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html
- **Purpose:** Application permissions delivered to containers through the task role.
- **Used by:** task-07-roles-logs-parameter, task-10-verify-app-task-role, task-15-exam-review

## src-ecs-exec-role — Amazon ECS task execution IAM role

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html
- **Purpose:** Permissions ECS/Fargate agents use for ECR pulls and CloudWatch logging.
- **Used by:** task-07-roles-logs-parameter, task-11-cloudwatch-logs, task-15-exam-review

## src-ecs-role-best — Best practices for IAM roles in Amazon ECS

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html
- **Purpose:** Distinguishes task and task execution roles.
- **Used by:** task-07-roles-logs-parameter, task-10-verify-app-task-role

## src-ecs-services — Amazon ECS services

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html
- **Purpose:** Desired task count and long-running ECS services.
- **Used by:** task-09-create-service, task-10-verify-app-task-role, task-15-exam-review, task-16-stop-scaling-service

## src-ecs-alb — Use an Application Load Balancer for Amazon ECS

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html
- **Purpose:** ALB integration and ip target type for awsvpc/Fargate tasks.
- **Used by:** task-06-alb-network, task-09-create-service, task-10-verify-app-task-role, task-13-generate-load, task-15-exam-review, task-17-cloud-cleanup

## src-ecs-lb — Use load balancing to distribute Amazon ECS service traffic

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html
- **Purpose:** ECS service load-balancer support.
- **Used by:** task-06-alb-network, task-09-create-service

## src-ecs-networking — Amazon ECS task networking options for Fargate

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-networking.html
- **Purpose:** Fargate awsvpc ENIs and public-subnet networking.
- **Used by:** task-05-network, task-09-create-service

## src-ecs-outbound — Connect Amazon ECS applications to the internet

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/networking-outbound.html
- **Purpose:** Public-IP versus private-subnet/NAT networking patterns.
- **Used by:** task-05-network

## src-ecs-logs — Send Amazon ECS logs to CloudWatch

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html
- **Purpose:** awslogs task-definition driver and CloudWatch Logs.
- **Used by:** task-07-roles-logs-parameter, task-08-cluster-taskdef, task-11-cloudwatch-logs, task-15-exam-review, task-17-cloud-cleanup

## src-ecs-monitor — Monitor Amazon ECS using CloudWatch

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html
- **Purpose:** ECS service utilization metrics.
- **Used by:** task-12-service-autoscaling, task-13-generate-load

## src-ecs-autoscaling — Automatically scale your Amazon ECS service

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html
- **Purpose:** Application Auto Scaling for ECS desired task count.
- **Used by:** task-12-service-autoscaling, task-13-generate-load, task-15-exam-review, task-16-stop-scaling-service

## src-ecs-targettracking — Use a target metric to scale Amazon ECS services

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-autoscaling-targettracking.html
- **Purpose:** Target tracking scaling policies for ECS services.
- **Used by:** task-12-service-autoscaling, task-13-generate-load

## src-ecs-target-create — Create a target tracking scaling policy for Amazon ECS service auto scaling

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/target-tracking-create-policy.html
- **Purpose:** Practical target tracking configuration.
- **Used by:** task-12-service-autoscaling

## src-ecs-autoscale-iam — IAM permissions required for Amazon ECS service auto scaling

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/auto-scaling-IAM.html
- **Purpose:** ECS Application Auto Scaling service-linked role behavior.
- **Used by:** task-12-service-autoscaling

## src-ecs-cloudwatch-view — Viewing CloudWatch Logs for Amazon ECS services

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AmazonECS/latest/developerguide/monitoring-cloudwatchlogs-view.html
- **Purpose:** View ECS container logs from ECS or CloudWatch.
- **Used by:** task-11-cloudwatch-logs

## src-container-choice — Choosing an AWS container service

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html
- **Purpose:** Container-service selection across ECS, EKS and other AWS options.
- **Used by:** task-14-ecs-eks-lambda

## src-fargate-lambda — AWS Fargate or AWS Lambda?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/pdfs/decision-guides/latest/fargate-or-lambda/fargate-or-lambda.pdf
- **Purpose:** Fargate container execution versus Lambda event-driven function execution.
- **Used by:** task-14-ecs-eks-lambda

## src-alb-target — Target groups for your Application Load Balancers

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html
- **Purpose:** ALB target groups and IP targets.
- **Used by:** task-06-alb-network

## src-vpc-create — Create a VPC

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html
- **Purpose:** Dedicated training VPC/subnets.
- **Used by:** task-05-network

## src-vpc-igw — Connect your VPC to the internet using an internet gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
- **Purpose:** Public subnet internet routing.
- **Used by:** task-05-network, task-17-cloud-cleanup

## src-vpc-sg — Control traffic to your AWS resources using security groups

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html
- **Purpose:** ALB-to-task security-group flow.
- **Used by:** task-06-alb-network

# Quality report

- **Phase count:** 7
- **Task count:** 18
- **Checkbox count:** 221
- **CLI command count:** 112
- **Editable-block count:** 11
- **Verification count:** 33
- **Cleanup-item count:** 12
- **Official-source count:** 32
- **Missing items:** 0
- **Uncertain items:** 0

# Offline conversion boundary

This preview and JSON manuscript are offline educational authoring artifacts only. They have not been locally validated by Study Tracker, imported, accepted, approved, published or fingerprinted.
