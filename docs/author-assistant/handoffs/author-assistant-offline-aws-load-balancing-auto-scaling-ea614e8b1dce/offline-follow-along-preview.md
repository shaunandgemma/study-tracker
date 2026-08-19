# Load Balancing & Auto Scaling Follow Along

> **Status:** Offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Intermediate
- **Exam workspace:** AWS SAA-C03
- **AWS Region:** eu-west-2
- **Training prefix:** `fa-lba`

## Required outcome

Configure an internet-facing Application Load Balancer, target group, launch template, multi-AZ Auto Scaling group, target tracking dynamic scaling policy and health checks; verify load distribution and controlled scale-out; then safely delete only the resources created by the lab.

## Exam coverage

- Application Load Balancer Layer 7 routing
- Listeners and target groups
- Target-group health checks
- Two-AZ load balancing
- Launch templates
- ASG minimum/desired/maximum capacity
- ELB health integration with Auto Scaling
- Health check grace period
- Default instance warmup
- Target tracking dynamic scaling
- ALBRequestCountPerTarget
- Controlled scale-out verification
- Reverse-dependency cleanup

## Completion definition

- A dedicated two-AZ VPC and public network are created from nothing.
- Internet HTTP reaches only fa-lba-alb-sg; backend HTTP is allowed only from the ALB security group.
- fa-lba-tg checks /health and receives targets through fa-lba-asg.
- fa-lba-lt defines the repeatable Amazon Linux 2023 web-server configuration.
- fa-lba-asg starts with minimum 2, desired 2 and maximum 4 across eu-west-2a and eu-west-2b.
- The ASG uses ELB health checks, a 120-second grace period and 120-second default instance warmup.
- fa-lba-request-scaling tracks ALB request count per target with target value 50.
- Controlled HTTP traffic demonstrates a scaling activity without allowing capacity above 4.
- All chargeable compute/load-balancing resources are removed before credentials or local files.

## Warnings

### Cost

This lab creates an Application Load Balancer and at least two EC2 instances with public IPv4 addresses; these resources can incur charges even in a training account. Complete the reverse-dependency cleanup after the scaling exercise.

### Safety

Delete only exact fa-lba resources. Stop if a command or console page identifies a resource outside the fa-lba training set.

### Credentials

Never create root access keys and never put the fa-lba-admin access key or secret in user data, launch-template JSON, screenshots, chat or Study Tracker. Enter them only through protected aws configure prompts.

### Region

Every lab resource is created in eu-west-2. The two subnets use eu-west-2a and eu-west-2b.

# Phase 1: Prepare the account and lab

Create the temporary training identity, verify the CLI profile and create the helper files.

## task-01-prerequisites — Verify the training account and AWS CLI

- **Feature:** Prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm the disposable training account, AWS CLI and eu-west-2 Region before creating resources.
- **Why it matters:** A known-good identity and Region prevent later ALB/ASG errors being confused with account or CLI problems.
- **Exam relevance:** SAA-C03 covers high-performing elastic compute and appropriate load-balancing/scaling strategies.
- **Prerequisites:** None
- **Sources:** src-saa-domain3, src-saa-domain4, src-iam-best

### Console / browser route

1. Sign in to the AWS training account.
2. Confirm that no fa-lba resource already exists for this lab.
3. Open Windows PowerShell.
4. Run aws --version.
5. Do not create or use root access keys.
6. Root is used only for Task 2 bootstrap and final IAM-user removal.

### CLI route

#### PowerShell - verify AWS CLI

```text
aws --version
```

#### Bash - verify AWS CLI

```text
aws --version
```

### Expected results

- AWS CLI prints a version.
- No fa-lba resource exists yet.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — AWS CLI runs successfully.
- [ ] **task-01-prerequisites-verify-02** — No lab resource has been created yet.

## task-02-bootstrap-user — Create the temporary Load Balancing and Auto Scaling IAM user

- **Feature:** IAM bootstrap
- **Difficulty:** Hard
- **Goal:** Create fa-lba-admin, one temporary access key and the complete lab policy, then sign out of root.
- **Why it matters:** The identity needs explicit permissions for the VPC, launch template, ALB, target group and Auto Scaling group without AdministratorAccess.
- **Exam relevance:** Secure identity boundaries remain part of sound AWS architecture.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-iam-best, src-vpc-create, src-alb-create, src-asg-launch-template

### Warnings

- Several create APIs need broad resource scope before generated IDs exist; the policy uses exact action lists rather than service-wide wildcards and all lab resources use fa-lba names.

### Console / browser route

1. Sign in as root only for this bootstrap task.
2. Open IAM > Users > Create user.
3. Set User name to fa-lba-admin and enable console access.
4. Create the user.
5. Open IAM > Policies > Create policy > JSON.
6. Replace the editor with the complete fa-lba-admin-policy JSON below.
7. Create the policy with the exact name fa-lba-admin-policy.
8. Open fa-lba-admin > Add permissions > Attach policies directly.
9. Select fa-lba-admin-policy and attach it.
10. Open Security credentials and create one access key for CLI use.
11. Copy the values only to a temporary secure location.
12. Sign out of root.
13. Sign in as fa-lba-admin for all routine browser work.

### CLI route

#### No root CLI command

```text
# Complete bootstrap in the IAM console. Do not create root access keys.
```

### Complete editable files / policies

#### fa-lba-admin-policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadEc2State",
      "Effect": "Allow",
      "Action": "ec2:Describe*",
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingEc2Resources",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateVpc", "ec2:DeleteVpc", "ec2:ModifyVpcAttribute",
        "ec2:CreateSubnet", "ec2:DeleteSubnet", "ec2:ModifySubnetAttribute",
        "ec2:CreateInternetGateway", "ec2:AttachInternetGateway", "ec2:DetachInternetGateway", "ec2:DeleteInternetGateway",
        "ec2:CreateRouteTable", "ec2:DeleteRouteTable", "ec2:AssociateRouteTable", "ec2:DisassociateRouteTable", "ec2:CreateRoute", "ec2:DeleteRoute",
        "ec2:CreateSecurityGroup", "ec2:DeleteSecurityGroup", "ec2:AuthorizeSecurityGroupIngress", "ec2:AuthorizeSecurityGroupEgress", "ec2:RevokeSecurityGroupIngress", "ec2:RevokeSecurityGroupEgress",
        "ec2:CreateLaunchTemplate", "ec2:DeleteLaunchTemplate", "ec2:CreateLaunchTemplateVersion", "ec2:DeleteLaunchTemplateVersions",
        "ec2:CreateTags", "ec2:DeleteTags", "ec2:RunInstances", "ec2:TerminateInstances"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ReadLatestAmazonLinuxAmi",
      "Effect": "Allow",
      "Action": "ssm:GetParameter",
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingAlbResources",
      "Effect": "Allow",
      "Action": [
        "elasticloadbalancing:CreateLoadBalancer", "elasticloadbalancing:DeleteLoadBalancer", "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:CreateTargetGroup", "elasticloadbalancing:DeleteTargetGroup", "elasticloadbalancing:DescribeTargetGroups", "elasticloadbalancing:ModifyTargetGroup", "elasticloadbalancing:DescribeTargetHealth",
        "elasticloadbalancing:CreateListener", "elasticloadbalancing:DeleteListener", "elasticloadbalancing:DescribeListeners", "elasticloadbalancing:DescribeRules",
        "elasticloadbalancing:AddTags", "elasticloadbalancing:RemoveTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ManageTrainingAutoScalingResources",
      "Effect": "Allow",
      "Action": [
        "autoscaling:CreateAutoScalingGroup", "autoscaling:UpdateAutoScalingGroup", "autoscaling:DeleteAutoScalingGroup",
        "autoscaling:DescribeAutoScalingGroups", "autoscaling:DescribeAutoScalingInstances", "autoscaling:DescribeScalingActivities",
        "autoscaling:DescribePolicies", "autoscaling:PutScalingPolicy", "autoscaling:DeletePolicy", "autoscaling:SetDesiredCapacity",
        "autoscaling:CreateOrUpdateTags", "autoscaling:DeleteTags", "autoscaling:AttachLoadBalancerTargetGroups", "autoscaling:DetachLoadBalancerTargetGroups"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ReadScalingMetrics",
      "Effect": "Allow",
      "Action": ["cloudwatch:DescribeAlarms", "cloudwatch:GetMetricData", "cloudwatch:GetMetricStatistics", "cloudwatch:ListMetrics"],
      "Resource": "*"
    },
    {
      "Sid": "CreateOnlyRequiredServiceLinkedRoles",
      "Effect": "Allow",
      "Action": "iam:CreateServiceLinkedRole",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "iam:AWSServiceName": ["autoscaling.amazonaws.com", "elasticloadbalancing.amazonaws.com"]
        }
      }
    }
  ]
}
```

### Expected results

- fa-lba-admin exists.
- fa-lba-admin-policy is attached.
- Exactly one temporary access key exists.
- Root is signed out.

### Verification checks

- [ ] **task-02-bootstrap-user-verify-01** — The current browser session is fa-lba-admin.
- [ ] **task-02-bootstrap-user-verify-02** — No AdministratorAccess policy is attached.

## task-03-cli-and-local-files — Configure the CLI profile and create the helper files

- **Feature:** CLI and local files
- **Difficulty:** Medium
- **Goal:** Configure fa-lba-admin and create user-data.sh plus generate-load.ps1.
- **Why it matters:** The launch template and load test remain auditable and reproducible.
- **Exam relevance:** Launch templates can carry bootstrap user data that every Auto Scaling instance inherits.
- **Prerequisites:** task-02-bootstrap-user
- **Sources:** src-ec2-user-data, src-asg-launch-templates

### Console / browser route

1. Open Windows PowerShell.
2. Run aws configure --profile fa-lba-admin.
3. Enter the temporary access key only in protected prompts.
4. Set Region to eu-west-2 and output to json.
5. Run get-caller-identity and confirm the ARN belongs to fa-lba-admin.
6. Create C:\aws-labs\fa-lba.
7. Create user-data.sh and paste the supplied content.
8. Create generate-load.ps1 and paste the supplied content.

### CLI route

#### PowerShell - configure profile

```text
aws configure --profile fa-lba-admin
```

#### PowerShell - verify identity

```text
aws sts get-caller-identity --profile fa-lba-admin
```

#### PowerShell - create folder

```text
New-Item -ItemType Directory -Force "C:\aws-labs\fa-lba"
```

#### PowerShell - enter folder

```text
Set-Location "C:\aws-labs\fa-lba"
```

#### PowerShell - verify folder

```text
Get-Location
```

#### Bash - verify identity

```text
aws sts get-caller-identity --profile fa-lba-admin
```

#### Bash - create folder

```text
mkdir -p ~/aws-labs/fa-lba
```

#### Bash - enter folder

```text
cd ~/aws-labs/fa-lba
```

### Complete editable files / policies

#### user-data.sh

```text
#!/bin/bash
set -euxo pipefail
dnf install -y httpd
TOKEN=$(curl -sS -X PUT -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" http://169.254.169.254/latest/api/token)
INSTANCE_ID=$(curl -sS -H "X-aws-ec2-metadata-token: ${TOKEN}" http://169.254.169.254/latest/meta-data/instance-id)
AZ=$(curl -sS -H "X-aws-ec2-metadata-token: ${TOKEN}" http://169.254.169.254/latest/meta-data/placement/availability-zone)
cat > /var/www/html/index.html <<EOF
<!doctype html>
<html><head><title>fa-lba</title></head><body>
<h1>Load Balancing & Auto Scaling Follow Along</h1>
<p>Instance: ${INSTANCE_ID}</p>
<p>Availability Zone: ${AZ}</p>
</body></html>
EOF
echo "healthy" > /var/www/html/health
systemctl enable httpd
systemctl start httpd
```

#### generate-load.ps1

```text
param(
  [Parameter(Mandatory = $true)]
  [string]$AlbDnsName
)
$endTime = (Get-Date).AddMinutes(5)
while ((Get-Date) -lt $endTime) {
  for ($i = 1; $i -le 60; $i++) {
    try { Invoke-WebRequest -Uri "http://$AlbDnsName/" -UseBasicParsing -TimeoutSec 10 | Out-Null }
    catch { Write-Host "Request failed: $($_.Exception.Message)" }
  }
  Write-Host "Generated another request batch at $(Get-Date -Format T)"
  Start-Sleep -Seconds 10
}
```

### Expected results

- The CLI identity is fa-lba-admin.
- Both helper files exist.
- No credential appears in either file.

### Verification checks

- [ ] **task-03-cli-and-local-files-verify-01** — The CLI profile works in eu-west-2.
- [ ] **task-03-cli-and-local-files-verify-02** — user-data.sh creates / and /health pages.

# Phase 2: Create the two-AZ public network

Build the dedicated VPC, subnets, internet route and security groups.

## task-04-vpc-network — Create the VPC, two public subnets, internet gateway and route table

- **Feature:** VPC networking
- **Difficulty:** Hard
- **Goal:** Create fa-lba-vpc with public subnets in eu-west-2a and eu-west-2b and a public default route.
- **Why it matters:** The ALB and ASG span two Availability Zones, and the instances need outbound internet for Apache installation.
- **Exam relevance:** Multi-AZ horizontal compute and load balancing improve resilience and elasticity.
- **Prerequisites:** task-03-cli-and-local-files
- **Sources:** src-vpc-create, src-vpc-igw, src-saa-domain3

### Warnings

- Public IPv4 addresses and later ALB/EC2 resources can incur charges.

### Console / browser route

1. Open the VPC console and select Europe (London) eu-west-2.
2. Create VPC fa-lba-vpc with IPv4 CIDR 10.60.0.0/16.
3. Enable DNS hostnames for fa-lba-vpc.
4. Create fa-lba-public-a in eu-west-2a with 10.60.1.0/24.
5. Create fa-lba-public-b in eu-west-2b with 10.60.2.0/24.
6. For each subnet enable auto-assign public IPv4.
7. Create internet gateway fa-lba-igw.
8. Attach fa-lba-igw to fa-lba-vpc.
9. Create route table fa-lba-public-rt in fa-lba-vpc.
10. Add route 0.0.0.0/0 to fa-lba-igw.
11. Associate fa-lba-public-a and fa-lba-public-b with fa-lba-public-rt.

### CLI route

#### PowerShell - create VPC

```text
$VPC_ID = aws ec2 create-vpc --cidr-block 10.60.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=fa-lba-vpc},{Key=FollowAlong,Value=fa-lba}]" --query Vpc.VpcId --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - enable DNS hostnames

```text
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames "{\"Value\":true}" --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create subnet A

```text
$SUBNET_A_ID = aws ec2 create-subnet --vpc-id $VPC_ID --availability-zone eu-west-2a --cidr-block 10.60.1.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-lba-public-a},{Key=FollowAlong,Value=fa-lba}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create subnet B

```text
$SUBNET_B_ID = aws ec2 create-subnet --vpc-id $VPC_ID --availability-zone eu-west-2b --cidr-block 10.60.2.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=fa-lba-public-b},{Key=FollowAlong,Value=fa-lba}]" --query Subnet.SubnetId --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - public IPv4 subnet A

```text
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_A_ID --map-public-ip-on-launch --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - public IPv4 subnet B

```text
aws ec2 modify-subnet-attribute --subnet-id $SUBNET_B_ID --map-public-ip-on-launch --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create internet gateway

```text
$IGW_ID = aws ec2 create-internet-gateway --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=fa-lba-igw},{Key=FollowAlong,Value=fa-lba}]" --query InternetGateway.InternetGatewayId --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - attach internet gateway

```text
aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create route table

```text
$RT_ID = aws ec2 create-route-table --vpc-id $VPC_ID --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=fa-lba-public-rt},{Key=FollowAlong,Value=fa-lba}]" --query RouteTable.RouteTableId --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create default route

```text
aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - associate subnet A

```text
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET_A_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - associate subnet B

```text
aws ec2 associate-route-table --route-table-id $RT_ID --subnet-id $SUBNET_B_ID --region eu-west-2 --profile fa-lba-admin
```

### Expected results

- The VPC is 10.60.0.0/16.
- The two /24 subnets are in different AZs.
- The route table sends 0.0.0.0/0 to fa-lba-igw.

### Verification checks

- [ ] **task-04-vpc-network-verify-01** — Both subnets use fa-lba-public-rt.
- [ ] **task-04-vpc-network-verify-02** — Both subnets auto-assign public IPv4.

## task-05-security-groups — Create separate ALB and web security groups

- **Feature:** Security groups
- **Difficulty:** Medium
- **Goal:** Allow public HTTP only to the ALB and backend HTTP only from the ALB security group.
- **Why it matters:** The instances should not accept direct application traffic from the internet.
- **Exam relevance:** The common security pattern is client -> ALB SG -> application SG.
- **Prerequisites:** task-04-vpc-network
- **Sources:** src-vpc-sg, src-alb-troubleshoot

### Console / browser route

1. Open EC2 > Security Groups.
2. Create fa-lba-alb-sg in fa-lba-vpc with inbound HTTP TCP 80 from 0.0.0.0/0.
3. Keep the default allow-all outbound rule.
4. Create fa-lba-web-sg in fa-lba-vpc.
5. Add inbound HTTP TCP 80 with Source set to fa-lba-alb-sg.
6. Do not add SSH.
7. Keep the default allow-all outbound rule.

### CLI route

#### PowerShell - rebuild VPC ID

```text
$VPC_ID = aws ec2 describe-vpcs --filters Name=tag:Name,Values=fa-lba-vpc --query "Vpcs[0].VpcId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create ALB SG

```text
$ALB_SG_ID = aws ec2 create-security-group --group-name fa-lba-alb-sg --description "HTTP to training ALB" --vpc-id $VPC_ID --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=fa-lba-alb-sg},{Key=FollowAlong,Value=fa-lba}]" --query GroupId --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - allow HTTP to ALB

```text
aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create web SG

```text
$WEB_SG_ID = aws ec2 create-security-group --group-name fa-lba-web-sg --description "HTTP from ALB only" --vpc-id $VPC_ID --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=fa-lba-web-sg},{Key=FollowAlong,Value=fa-lba}]" --query GroupId --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - allow ALB to web

```text
aws ec2 authorize-security-group-ingress --group-id $WEB_SG_ID --protocol tcp --port 80 --source-group $ALB_SG_ID --region eu-west-2 --profile fa-lba-admin
```

### Expected results

- fa-lba-alb-sg allows HTTP from 0.0.0.0/0.
- fa-lba-web-sg allows HTTP only from fa-lba-alb-sg.
- No SSH rule exists.

### Verification checks

- [ ] **task-05-security-groups-verify-01** — The web SG source is the ALB SG ID.
- [ ] **task-05-security-groups-verify-02** — Both groups belong to fa-lba-vpc.

# Phase 3: Create the target group and Application Load Balancer

Create a Layer 7 HTTP front door with /health target checks.

## task-06-target-group — Create the target group and /health health check

- **Feature:** Target group
- **Difficulty:** Medium
- **Goal:** Create fa-lba-tg for instance targets on HTTP:80 with health path /health.
- **Why it matters:** The target group controls both backend routing and target health evaluation.
- **Exam relevance:** ALB health checks are configured per target group and only healthy targets receive normal traffic.
- **Prerequisites:** task-05-security-groups
- **Sources:** src-alb-target-groups, src-alb-health, src-alb-check-health

### Console / browser route

1. Open EC2 > Target Groups > Create target group.
2. Target type: Instances.
3. Name: fa-lba-tg.
4. Protocol HTTP, port 80, IPv4.
5. VPC: fa-lba-vpc.
6. Health check protocol HTTP.
7. Health check path /health.
8. Healthy threshold 2, unhealthy threshold 2, timeout 5 seconds, interval 30 seconds, success codes 200.
9. Do not manually register a target.
10. Create the target group.

### CLI route

#### PowerShell - rebuild VPC ID

```text
$VPC_ID = aws ec2 describe-vpcs --filters Name=tag:Name,Values=fa-lba-vpc --query "Vpcs[0].VpcId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create target group

```text
$TG_ARN = aws elbv2 create-target-group --name fa-lba-tg --protocol HTTP --port 80 --target-type instance --vpc-id $VPC_ID --health-check-protocol HTTP --health-check-path /health --health-check-port traffic-port --health-check-interval-seconds 30 --health-check-timeout-seconds 5 --healthy-threshold-count 2 --unhealthy-threshold-count 2 --matcher HttpCode=200 --tags Key=FollowAlong,Value=fa-lba --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - describe target group

```text
aws elbv2 describe-target-groups --target-group-arns $TG_ARN --region eu-west-2 --profile fa-lba-admin
```

### Expected results

- fa-lba-tg exists in fa-lba-vpc.
- HealthCheckPath is /health.
- No targets are registered yet.

### Verification checks

- [ ] **task-06-target-group-verify-01** — The target type is instance.
- [ ] **task-06-target-group-verify-02** — The success matcher is 200.

## task-08-create-alb — Create the Application Load Balancer and HTTP listener

- **Feature:** Application Load Balancer
- **Difficulty:** Hard
- **Goal:** Create fa-lba-alb across the two public subnets and forward HTTP:80 to fa-lba-tg.
- **Why it matters:** The ALB is the single public Layer 7 entry point and forwards only to healthy targets.
- **Exam relevance:** ALB is the Layer 7 choice for HTTP/HTTPS application routing.
- **Prerequisites:** task-06-target-group
- **Sources:** src-alb-intro, src-alb-create, src-alb-listeners, src-alb-target-groups

### Warnings

- Application Load Balancers incur charges while running.

### Console / browser route

1. Open EC2 > Load Balancers > Create load balancer > Application Load Balancer.
2. Name: fa-lba-alb.
3. Scheme: Internet-facing.
4. IP address type: IPv4.
5. VPC: fa-lba-vpc.
6. Select eu-west-2a/fa-lba-public-a and eu-west-2b/fa-lba-public-b.
7. Security group: fa-lba-alb-sg only.
8. Listener: HTTP port 80.
9. Default action: Forward to fa-lba-tg.
10. Create the load balancer.
11. Wait until State is Active.
12. Copy the generated DNS name.

### CLI route

#### PowerShell - rebuild subnet A ID

```text
$SUBNET_A_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-lba-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild subnet B ID

```text
$SUBNET_B_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-lba-public-b --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild ALB SG ID

```text
$ALB_SG_ID = aws ec2 describe-security-groups --filters Name=group-name,Values=fa-lba-alb-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild target group ARN

```text
$TG_ARN = aws elbv2 describe-target-groups --names fa-lba-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create ALB

```text
$ALB_ARN = aws elbv2 create-load-balancer --name fa-lba-alb --type application --scheme internet-facing --ip-address-type ipv4 --subnets $SUBNET_A_ID $SUBNET_B_ID --security-groups $ALB_SG_ID --tags Key=FollowAlong,Value=fa-lba --query "LoadBalancers[0].LoadBalancerArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - wait for ALB

```text
aws elbv2 wait load-balancer-available --load-balancer-arns $ALB_ARN --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create listener

```text
$LISTENER_ARN = aws elbv2 create-listener --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG_ARN --query "Listeners[0].ListenerArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - get ALB DNS

```text
$ALB_DNS = aws elbv2 describe-load-balancers --names fa-lba-alb --query "LoadBalancers[0].DNSName" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - show ALB DNS

```text
Write-Output $ALB_DNS
```

### Expected results

- fa-lba-alb is Active.
- It spans two Availability Zones.
- HTTP:80 forwards to fa-lba-tg.
- An ALB DNS name is available.

### Verification checks

- [ ] **task-08-create-alb-verify-01** — The ALB uses fa-lba-alb-sg.
- [ ] **task-08-create-alb-verify-02** — The listener default action points at fa-lba-tg.

# Phase 4: Create the launch template and Auto Scaling group

Launch a repeatable two-instance fleet across two Availability Zones and attach it to the ALB target group.

## task-07-launch-template — Create the launch template

- **Feature:** Launch template
- **Difficulty:** Hard
- **Goal:** Create fa-lba-lt with Amazon Linux 2023, t3.micro, IMDSv2, fa-lba-web-sg and the supplied user data.
- **Why it matters:** All Auto Scaling instances should launch from one repeatable configuration.
- **Exam relevance:** Launch templates are the reusable EC2 configuration used when Auto Scaling adds capacity.
- **Prerequisites:** task-06-target-group
- **Sources:** src-asg-launch-template, src-asg-launch-templates, src-ec2-user-data

### Warnings

- EC2 instances and public IPv4 addresses can incur charges.

### Console / browser route

1. Open EC2 > Launch Templates > Create launch template.
2. Name: fa-lba-lt.
3. Version description: fa-lba-version-1.
4. AMI: Amazon Linux 2023.
5. Instance type: t3.micro.
6. Key pair: Don't include in launch template.
7. Network settings: select existing security group fa-lba-web-sg.
8. Enable Auto-assign Public IP.
9. Advanced details: set IMDSv2 to Required.
10. Paste the supplied user-data.sh into User data.
11. Create the launch template and confirm version 1 exists.

### CLI route

#### PowerShell - enter lab folder

```text
Set-Location "C:\aws-labs\fa-lba"
```

#### PowerShell - resolve latest AL2023 AMI

```text
$AMI_ID = aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query "Parameter.Value" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild web SG ID

```text
$WEB_SG_ID = aws ec2 describe-security-groups --filters Name=group-name,Values=fa-lba-web-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - base64 user data

```text
$USER_DATA_B64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Resolve-Path ".\user-data.sh")))
```

#### PowerShell - build launch template JSON

```text
$LT_DATA = @{ ImageId=$AMI_ID; InstanceType="t3.micro"; UserData=$USER_DATA_B64; MetadataOptions=@{HttpTokens="required";HttpEndpoint="enabled"}; NetworkInterfaces=@(@{DeviceIndex=0;AssociatePublicIpAddress=$true;DeleteOnTermination=$true;Groups=@($WEB_SG_ID)}); TagSpecifications=@(@{ResourceType="instance";Tags=@(@{Key="Name";Value="fa-lba-web"},@{Key="FollowAlong";Value="fa-lba"})}) } | ConvertTo-Json -Depth 8
```

#### PowerShell - save launch template JSON

```text
$LT_DATA | Set-Content -Encoding utf8 .\launch-template-data.json
```

#### PowerShell - create launch template

```text
aws ec2 create-launch-template --launch-template-name fa-lba-lt --version-description fa-lba-version-1 --launch-template-data file://launch-template-data.json --tag-specifications "ResourceType=launch-template,Tags=[{Key=FollowAlong,Value=fa-lba}]" --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - verify launch template

```text
aws ec2 describe-launch-template-versions --launch-template-name fa-lba-lt --versions 1 --region eu-west-2 --profile fa-lba-admin
```

### Complete editable files / policies

#### user-data.sh

```text
#!/bin/bash
set -euxo pipefail
dnf install -y httpd
TOKEN=$(curl -sS -X PUT -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" http://169.254.169.254/latest/api/token)
INSTANCE_ID=$(curl -sS -H "X-aws-ec2-metadata-token: ${TOKEN}" http://169.254.169.254/latest/meta-data/instance-id)
AZ=$(curl -sS -H "X-aws-ec2-metadata-token: ${TOKEN}" http://169.254.169.254/latest/meta-data/placement/availability-zone)
cat > /var/www/html/index.html <<EOF
<!doctype html>
<html><head><title>fa-lba</title></head><body>
<h1>Load Balancing & Auto Scaling Follow Along</h1>
<p>Instance: ${INSTANCE_ID}</p>
<p>Availability Zone: ${AZ}</p>
</body></html>
EOF
echo "healthy" > /var/www/html/health
systemctl enable httpd
systemctl start httpd
```

### Expected results

- fa-lba-lt version 1 exists.
- It uses t3.micro, the resolved AL2023 AMI, fa-lba-web-sg and IMDSv2 required.
- No key pair is configured.

### Verification checks

- [ ] **task-07-launch-template-verify-01** — Version 1 is present.
- [ ] **task-07-launch-template-verify-02** — User data is populated.
- [ ] **task-07-launch-template-verify-03** — Public IPv4 is enabled for the primary network interface.

## task-09-create-asg — Create the Auto Scaling group and attach the target group

- **Feature:** Auto Scaling group
- **Difficulty:** Hard
- **Goal:** Create fa-lba-asg with Min 2, Desired 2 and Max 4 across both public subnets, attach fa-lba-tg, enable ELB health checks and use 120-second grace/warmup.
- **Why it matters:** The group maintains capacity across two Availability Zones and automatically registers every launched instance with the target group.
- **Exam relevance:** Horizontal scaling plus load-balancer health integration is a core elastic-compute design.
- **Prerequisites:** task-07-launch-template, task-08-create-alb
- **Sources:** src-asg-intro, src-asg-launch-template, src-asg-attach-alb, src-asg-health, src-asg-grace, src-asg-warmup

### Warnings

- Allow several minutes for Apache installation and initial health checks before diagnosing failure.

### Console / browser route

1. Open EC2 > Auto Scaling Groups > Create Auto Scaling group.
2. Name: fa-lba-asg.
3. Launch template: fa-lba-lt, version 1.
4. VPC: fa-lba-vpc.
5. Select fa-lba-public-a and fa-lba-public-b.
6. Attach to an existing load balancer target group and choose fa-lba-tg.
7. Turn on Elastic Load Balancing health checks.
8. Health check grace period: 120 seconds.
9. Desired capacity: 2.
10. Minimum capacity: 2.
11. Maximum capacity: 4.
12. Default instance warmup: 120 seconds.
13. Do not add a scaling policy yet.
14. Add Name=fa-lba-web and propagate it to instances.
15. Create the group.
16. Wait for two instances to become InService.
17. Open fa-lba-tg > Targets and wait for both targets to become Healthy.

### CLI route

#### PowerShell - rebuild subnet A ID

```text
$SUBNET_A_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-lba-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild subnet B ID

```text
$SUBNET_B_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-lba-public-b --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild target group ARN

```text
$TG_ARN = aws elbv2 describe-target-groups --names fa-lba-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - create ASG

```text
aws autoscaling create-auto-scaling-group --auto-scaling-group-name fa-lba-asg --launch-template LaunchTemplateName=fa-lba-lt,Version=1 --min-size 2 --max-size 4 --desired-capacity 2 --default-instance-warmup 120 --health-check-type ELB --health-check-grace-period 120 --vpc-zone-identifier "$SUBNET_A_ID,$SUBNET_B_ID" --target-group-arns $TG_ARN --tags ResourceId=fa-lba-asg,ResourceType=auto-scaling-group,Key=Name,Value=fa-lba-web,PropagateAtLaunch=true ResourceId=fa-lba-asg,ResourceType=auto-scaling-group,Key=FollowAlong,Value=fa-lba,PropagateAtLaunch=true --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - describe ASG

```text
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names fa-lba-asg --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - check target health

```text
aws elbv2 describe-target-health --target-group-arn $TG_ARN --region eu-west-2 --profile fa-lba-admin
```

### Expected results

- ASG MinSize=2, DesiredCapacity=2 and MaxSize=4.
- Two instances become InService.
- Both target-group targets become Healthy.

### Verification checks

- [ ] **task-09-create-asg-verify-01** — The ASG uses fa-lba-lt version 1.
- [ ] **task-09-create-asg-verify-02** — HealthCheckType is ELB.
- [ ] **task-09-create-asg-verify-03** — DefaultInstanceWarmup is 120.
- [ ] **task-09-create-asg-verify-04** — Healthy targets exist.

# Phase 5: Configure and test dynamic scaling

Add target tracking with ALB request count per target and observe controlled scale-out.

## task-10-scaling-policy — Create the ALB request-count target tracking policy

- **Feature:** Dynamic scaling policy
- **Difficulty:** Hard
- **Goal:** Create fa-lba-request-scaling using ALBRequestCountPerTarget with target value 50.
- **Why it matters:** Target tracking expresses a desired metric level and lets Auto Scaling adjust capacity in both directions.
- **Exam relevance:** For request-driven web workloads, request count per target can connect scaling directly to backend load.
- **Prerequisites:** task-09-create-asg
- **Sources:** src-asg-target-tracking, src-asg-dynamic, src-asg-warmup

### Console / browser route

1. Open fa-lba-asg > Automatic scaling.
2. Choose Create dynamic scaling policy.
3. Policy type: Target tracking scaling.
4. Name: fa-lba-request-scaling.
5. Metric type: Application Load Balancer request count per target.
6. Target value: 50.
7. Select the fa-lba-alb/fa-lba-tg metric resource.
8. Keep scale in enabled.
9. Create the policy.

### CLI route

#### PowerShell - rebuild ALB ARN

```text
$ALB_ARN = aws elbv2 describe-load-balancers --names fa-lba-alb --query "LoadBalancers[0].LoadBalancerArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild target group ARN

```text
$TG_ARN = aws elbv2 describe-target-groups --names fa-lba-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - derive ALB resource part

```text
$ALB_RESOURCE = ($ALB_ARN -split "loadbalancer/")[1]
```

#### PowerShell - derive TG resource part

```text
$TG_RESOURCE = ($TG_ARN -split ":targetgroup/")[1]
```

#### PowerShell - build resource label

```text
$RESOURCE_LABEL = "$ALB_RESOURCE/targetgroup/$TG_RESOURCE"
```

#### PowerShell - create target tracking policy

```text
aws autoscaling put-scaling-policy --auto-scaling-group-name fa-lba-asg --policy-name fa-lba-request-scaling --policy-type TargetTrackingScaling --target-tracking-configuration "PredefinedMetricSpecification={PredefinedMetricType=ALBRequestCountPerTarget,ResourceLabel=$RESOURCE_LABEL},TargetValue=50,DisableScaleIn=false" --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - verify policy

```text
aws autoscaling describe-policies --auto-scaling-group-name fa-lba-asg --policy-names fa-lba-request-scaling --region eu-west-2 --profile fa-lba-admin
```

### Expected results

- fa-lba-request-scaling exists.
- Policy type is TargetTrackingScaling.
- Metric is ALBRequestCountPerTarget.
- TargetValue is 50.

### Verification checks

- [ ] **task-10-scaling-policy-verify-01** — The policy is attached to fa-lba-asg.
- [ ] **task-10-scaling-policy-verify-02** — Scale-in is enabled.
- [ ] **task-10-scaling-policy-verify-03** — The resource label identifies fa-lba-alb and fa-lba-tg.

## task-11-verify-health-and-routing — Verify ALB routing and both layers of health checks

- **Feature:** Health checks
- **Difficulty:** Medium
- **Goal:** Prove that the ALB routes HTTP to healthy Auto Scaling targets and distinguish target-group health from ASG replacement health.
- **Why it matters:** The ALB decides routing eligibility while Auto Scaling can use ELB health to decide instance replacement after the grace period.
- **Exam relevance:** Exam questions often distinguish target health, desired-capacity maintenance, grace period and warmup.
- **Prerequisites:** task-10-scaling-policy
- **Sources:** src-alb-health, src-alb-check-health, src-asg-health, src-asg-health-overview, src-asg-grace, src-asg-attach-alb

### Console / browser route

1. Open fa-lba-tg > Targets and confirm both targets are Healthy.
2. Open fa-lba-alb and copy its DNS name.
3. Open http://<copied DNS name>/ in a browser.
4. Refresh several times and observe the Instance ID and Availability Zone.
5. Open http://<copied DNS name>/health and confirm healthy.
6. Open fa-lba-asg and confirm Health check type is Elastic Load Balancing and grace period is 120 seconds.
7. Remember: target-group health controls ALB routing; ASG ELB health integration can trigger replacement.

### CLI route

#### PowerShell - get ALB DNS

```text
$ALB_DNS = aws elbv2 describe-load-balancers --names fa-lba-alb --query "LoadBalancers[0].DNSName" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - request home page

```text
Invoke-WebRequest -Uri "http://$ALB_DNS/" -UseBasicParsing
```

#### PowerShell - request health page

```text
Invoke-WebRequest -Uri "http://$ALB_DNS/health" -UseBasicParsing
```

#### PowerShell - rebuild target group ARN

```text
$TG_ARN = aws elbv2 describe-target-groups --names fa-lba-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - inspect target health

```text
aws elbv2 describe-target-health --target-group-arn $TG_ARN --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - inspect ASG health settings

```text
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names fa-lba-asg --query "AutoScalingGroups[0].{HealthCheckType:HealthCheckType,Grace:HealthCheckGracePeriod,Desired:DesiredCapacity}" --region eu-west-2 --profile fa-lba-admin
```

### Expected results

- The home page returns HTTP 200.
- /health returns HTTP 200.
- All registered targets are healthy.
- ASG HealthCheckType is ELB and grace period is 120.

### Verification checks

- [ ] **task-11-verify-health-and-routing-verify-01** — The ALB DNS is reachable.
- [ ] **task-11-verify-health-and-routing-verify-02** — The backend SG does not allow HTTP from 0.0.0.0/0.
- [ ] **task-11-verify-health-and-routing-verify-03** — The learner can explain target-group health versus ASG replacement health.

## task-12-generate-load — Generate controlled traffic and observe scale-out

- **Feature:** Scaling verification
- **Difficulty:** Hard
- **Goal:** Run the five-minute request generator and observe fa-lba-asg scale above its initial desired capacity of 2 without exceeding 4.
- **Why it matters:** A scaling policy is meaningful only when metric pressure can be connected to scaling activities and newly healthy targets.
- **Exam relevance:** Target tracking follows changing demand and accounts for instance warmup.
- **Prerequisites:** task-11-verify-health-and-routing
- **Sources:** src-asg-target-tracking, src-asg-dynamic, src-asg-warmup, src-asg-tutorial

### Warnings

- The generator is limited to five minutes; stop it once scale-out is proven.
- CloudWatch timing and 120-second warmup mean scaling is not instantaneous.

### Console / browser route

1. Open fa-lba-asg > Activity so scaling events are visible.
2. Open Automatic scaling in another tab and confirm fa-lba-request-scaling is enabled.
3. Open PowerShell in C:\aws-labs\fa-lba.
4. Get the ALB DNS name.
5. Run .\generate-load.ps1 -AlbDnsName $ALB_DNS.
6. Let the generator run for up to five minutes.
7. Refresh Activity every minute.
8. When a scale-out event appears, note the new Desired capacity.
9. Wait for any new instance to become InService.
10. Open fa-lba-tg > Targets and wait for the new target to become Healthy.
11. Press Ctrl+C once scale-out above 2 is proven; do not generate unnecessary traffic.
12. Scale-in may take additional minutes and does not need to finish before Task 13.

### CLI route

#### PowerShell - enter lab folder

```text
Set-Location "C:\aws-labs\fa-lba"
```

#### PowerShell - get ALB DNS

```text
$ALB_DNS = aws elbv2 describe-load-balancers --names fa-lba-alb --query "LoadBalancers[0].DNSName" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - run load generator

```text
.\generate-load.ps1 -AlbDnsName $ALB_DNS
```

#### PowerShell - inspect capacity

```text
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names fa-lba-asg --query "AutoScalingGroups[0].{Min:MinSize,Desired:DesiredCapacity,Max:MaxSize,Instances:length(Instances)}" --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - inspect activities

```text
aws autoscaling describe-scaling-activities --auto-scaling-group-name fa-lba-asg --max-items 10 --region eu-west-2 --profile fa-lba-admin
```

### Complete editable files / policies

#### generate-load.ps1

```text
param(
  [Parameter(Mandatory = $true)]
  [string]$AlbDnsName
)
$endTime = (Get-Date).AddMinutes(5)
while ((Get-Date) -lt $endTime) {
  for ($i = 1; $i -le 60; $i++) {
    try { Invoke-WebRequest -Uri "http://$AlbDnsName/" -UseBasicParsing -TimeoutSec 10 | Out-Null }
    catch { Write-Host "Request failed: $($_.Exception.Message)" }
  }
  Write-Host "Generated another request batch at $(Get-Date -Format T)"
  Start-Sleep -Seconds 10
}
```

### Expected results

- ALB requests continue succeeding during the test.
- Desired capacity can rise above 2 up to MaxSize 4.
- New instances use fa-lba-lt and join fa-lba-tg.
- New targets become Healthy before serving normal traffic.

### Verification checks

- [ ] **task-12-generate-load-verify-01** — A scaling activity references target tracking.
- [ ] **task-12-generate-load-verify-02** — Desired capacity never exceeds 4.
- [ ] **task-12-generate-load-verify-03** — Any new target eventually becomes Healthy.

# Phase 6: Review SAA-C03 load balancing and scaling decisions

Connect the lab to Layer 7 routing, horizontal scaling, health and multi-AZ design.

## task-13-exam-review — Review the SAA-C03 load balancing and Auto Scaling decisions

- **Feature:** Exam review
- **Difficulty:** Easy
- **Goal:** Translate the completed architecture into exam rules and common distinctions.
- **Why it matters:** SAA-C03 tests architecture selection more than console sequence memory.
- **Exam relevance:** ALB, target groups, launch templates, Auto Scaling, target tracking and health checks are directly relevant to elastic compute design.
- **Prerequisites:** task-12-generate-load
- **Sources:** src-saa-domain3, src-saa-domain4, src-alb-intro, src-alb-target-groups, src-asg-intro, src-asg-target-tracking, src-asg-health

### Console / browser route

1. ALB is Layer 7 for HTTP/HTTPS application traffic.
2. A listener receives traffic; a target group routes to and health-checks backend targets.
3. The ALB SG accepts client HTTP; the web SG accepts HTTP only from the ALB SG.
4. A launch template defines reusable EC2 instance configuration.
5. An ASG manages minimum, desired and maximum capacity across multiple subnets/AZs.
6. Horizontal scaling adds/removes instances; vertical scaling changes instance size.
7. Target tracking tries to keep a chosen metric near a target value.
8. ALBRequestCountPerTarget is useful when requests per backend represent load.
9. Target-group health controls routing eligibility.
10. ASG ELB health integration can replace load-balancer-unhealthy instances after the grace period.
11. Health-check grace period protects a new instance during startup.
12. Default instance warmup prevents initializing capacity being treated as fully ready for scaling decisions.
13. Exam trigger: HTTP host/path routing points to ALB.
14. Exam trigger: automatic EC2 capacity changes point to ASG plus scaling policy.
15. Exam trigger: multi-AZ resilience points to ALB and ASG spanning multiple AZs.
16. Exam trap: healthy EC2 system checks do not prove the application is healthy at /health.

### CLI route

#### PowerShell - final ASG summary

```text
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names fa-lba-asg --query "AutoScalingGroups[0].{Min:MinSize,Desired:DesiredCapacity,Max:MaxSize,Health:HealthCheckType,Warmup:DefaultInstanceWarmup}" --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - final target group ARN

```text
$TG_ARN = aws elbv2 describe-target-groups --names fa-lba-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - final target health

```text
aws elbv2 describe-target-health --target-group-arn $TG_ARN --region eu-west-2 --profile fa-lba-admin
```

### Expected results

- The learner can explain ALB listener -> target group -> instance flow.
- The learner can explain launch template -> ASG -> scaling policy flow.
- The learner can distinguish target health, ASG health, grace period and warmup.

### Verification checks

- [ ] **task-13-exam-review-verify-01** — The ALB is active.
- [ ] **task-13-exam-review-verify-02** — The ASG remains within Min 2 and Max 4.
- [ ] **task-13-exam-review-verify-03** — At least desired capacity is healthy before cleanup.

# Phase 7: Reverse-dependency cleanup

Remove automation, compute, load balancing, networking, credentials and local files safely.

## task-14-prepare-cleanup — Stop automation, scale to zero and rebuild generated IDs

- **Feature:** Cleanup preparation
- **Difficulty:** Medium
- **Goal:** Remove the scaling policy, set the ASG to zero and rebuild all generated IDs required for deterministic deletion.
- **Why it matters:** Stopping automation first prevents a new scale-out event during teardown.
- **Exam relevance:** Safe cleanup starts by disabling automation and removing the most dependent workload capacity.
- **Prerequisites:** task-13-exam-review
- **Sources:** src-asg-target-tracking, src-asg-intro, src-alb-target-groups

### Console / browser route

1. Confirm generate-load.ps1 is stopped.
2. Open fa-lba-asg > Automatic scaling and delete fa-lba-request-scaling.
3. Set Minimum capacity to 0 and Desired capacity to 0.
4. Keep Maximum capacity at 4 until the group is deleted.
5. Wait for every Auto Scaling instance to terminate.
6. Open fa-lba-tg > Targets and wait until no target remains.

### CLI route

#### PowerShell - delete scaling policy

```text
aws autoscaling delete-policy --auto-scaling-group-name fa-lba-asg --policy-name fa-lba-request-scaling --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - scale ASG to zero

```text
aws autoscaling update-auto-scaling-group --auto-scaling-group-name fa-lba-asg --min-size 0 --desired-capacity 0 --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - inspect ASG instances

```text
aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names fa-lba-asg --query "AutoScalingGroups[0].Instances" --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild VPC ID

```text
$VPC_ID = aws ec2 describe-vpcs --filters Name=tag:Name,Values=fa-lba-vpc --query "Vpcs[0].VpcId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild subnet A ID

```text
$SUBNET_A_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-lba-public-a --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild subnet B ID

```text
$SUBNET_B_ID = aws ec2 describe-subnets --filters Name=tag:Name,Values=fa-lba-public-b --query "Subnets[0].SubnetId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild IGW ID

```text
$IGW_ID = aws ec2 describe-internet-gateways --filters Name=tag:Name,Values=fa-lba-igw --query "InternetGateways[0].InternetGatewayId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild route table ID

```text
$RT_ID = aws ec2 describe-route-tables --filters Name=tag:Name,Values=fa-lba-public-rt --query "RouteTables[0].RouteTableId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild ALB SG ID

```text
$ALB_SG_ID = aws ec2 describe-security-groups --filters Name=group-name,Values=fa-lba-alb-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild web SG ID

```text
$WEB_SG_ID = aws ec2 describe-security-groups --filters Name=group-name,Values=fa-lba-web-sg --query "SecurityGroups[0].GroupId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild target group ARN

```text
$TG_ARN = aws elbv2 describe-target-groups --names fa-lba-tg --query "TargetGroups[0].TargetGroupArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild ALB ARN

```text
$ALB_ARN = aws elbv2 describe-load-balancers --names fa-lba-alb --query "LoadBalancers[0].LoadBalancerArn" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - rebuild listener ARN

```text
$LISTENER_ARN = aws elbv2 describe-listeners --load-balancer-arn $ALB_ARN --query "Listeners[0].ListenerArn" --output text --region eu-west-2 --profile fa-lba-admin
```

### Expected results

- The scaling policy is gone.
- ASG MinSize and DesiredCapacity are 0.
- All ASG instances terminate.
- The target group has no registered targets.

### Verification checks

- [ ] **task-14-prepare-cleanup-verify-01** — No traffic generator is running.
- [ ] **task-14-prepare-cleanup-verify-02** — No ASG instance remains before network teardown.

## task-15-final-cleanup — Delete every fa-lba resource in reverse dependency order

- **Feature:** Ordered cleanup
- **Difficulty:** Hard
- **Goal:** Delete the ASG, launch template, listener, ALB, target group, security groups, routing, VPC, temporary identity and local files.
- **Why it matters:** Reverse dependency order avoids failed deletions and prevents chargeable resources being stranded.
- **Exam relevance:** Cost-aware design includes cleaning up temporary load balancers, instances and public IPv4 resources.
- **Prerequisites:** task-14-prepare-cleanup
- **Sources:** src-alb-create, src-alb-target-groups, src-asg-launch-template, src-vpc-igw, src-vpc-sg, src-iam-best

### Warnings

- If a security-group deletion returns DependencyViolation, wait for ALB/EC2 ENIs to disappear and retry only that exact fa-lba security group.

### Console / browser route

1. Confirm Task 14 shows zero ASG instances.
2. Delete fa-lba-asg.
3. Delete fa-lba-lt.
4. Delete the HTTP:80 listener on fa-lba-alb.
5. Delete fa-lba-alb and wait until it disappears.
6. Delete fa-lba-tg.
7. Delete fa-lba-web-sg, then fa-lba-alb-sg.
8. Remove both explicit subnet associations from fa-lba-public-rt.
9. Delete fa-lba-public-rt.
10. Detach fa-lba-igw from fa-lba-vpc.
11. Delete fa-lba-igw.
12. Delete fa-lba-public-a.
13. Delete fa-lba-public-b.
14. Delete fa-lba-vpc.
15. Sign in as root only after cloud cleanup is verified.
16. Delete the fa-lba-admin access key.
17. Detach and delete fa-lba-admin-policy.
18. Delete fa-lba-admin and sign out of root.
19. Remove only the fa-lba-admin CLI profile.
20. Delete C:\aws-labs\fa-lba last.
21. Affirm the programme cleanup acknowledgement.

### CLI route

#### PowerShell - delete ASG

```text
aws autoscaling delete-auto-scaling-group --auto-scaling-group-name fa-lba-asg --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete launch template

```text
aws ec2 delete-launch-template --launch-template-name fa-lba-lt --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete listener

```text
aws elbv2 delete-listener --listener-arn $LISTENER_ARN --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete ALB

```text
aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - wait for ALB deletion

```text
aws elbv2 wait load-balancers-deleted --load-balancer-arns $ALB_ARN --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete target group

```text
aws elbv2 delete-target-group --target-group-arn $TG_ARN --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete web SG

```text
aws ec2 delete-security-group --group-id $WEB_SG_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete ALB SG

```text
aws ec2 delete-security-group --group-id $ALB_SG_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - get route table associations

```text
$ASSOCIATION_IDS = aws ec2 describe-route-tables --route-table-ids $RT_ID --query "RouteTables[0].Associations[?Main==`false`].RouteTableAssociationId" --output text --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - disassociate route table

```text
foreach ($ASSOCIATION_ID in ($ASSOCIATION_IDS -split "\s+")) { if ($ASSOCIATION_ID) { aws ec2 disassociate-route-table --association-id $ASSOCIATION_ID --region eu-west-2 --profile fa-lba-admin } }
```

#### PowerShell - delete route table

```text
aws ec2 delete-route-table --route-table-id $RT_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - detach IGW

```text
aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete IGW

```text
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete subnet A

```text
aws ec2 delete-subnet --subnet-id $SUBNET_A_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete subnet B

```text
aws ec2 delete-subnet --subnet-id $SUBNET_B_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - delete VPC

```text
aws ec2 delete-vpc --vpc-id $VPC_ID --region eu-west-2 --profile fa-lba-admin
```

#### PowerShell - clear access key

```text
aws configure set aws_access_key_id "" --profile fa-lba-admin
```

#### PowerShell - clear secret key

```text
aws configure set aws_secret_access_key "" --profile fa-lba-admin
```

#### PowerShell - clear region

```text
aws configure set region "" --profile fa-lba-admin
```

#### PowerShell - leave folder

```text
Set-Location C:\
```

#### PowerShell - delete local folder

```text
Remove-Item "C:\aws-labs\fa-lba" -Recurse -Force
```

### Expected results

- No fa-lba ASG, launch template, ALB, listener or target group remains.
- No fa-lba security group, route table, internet gateway, subnet or VPC remains.
- The temporary IAM identity and CLI profile are removed.
- The local folder is removed last.

### Verification checks

- [ ] **task-15-final-cleanup-verify-01** — No chargeable ALB or EC2 instance remains.
- [ ] **task-15-final-cleanup-verify-02** — No fa-lba VPC resource remains.
- [ ] **task-15-final-cleanup-verify-03** — Unrelated resources and CLI profiles remain unchanged.

# Troubleshooting

## trouble-01 — Targets never become healthy

- **Likely cause:** Apache installation/user data is not complete, outbound internet is unavailable, or the web security group does not allow the ALB security group.
- **Fix:** Check the subnet default route/public IPv4, then verify fa-lba-web-sg allows TCP 80 from fa-lba-alb-sg and allow the grace period plus initial health checks.

## trouble-02 — Target health shows 404

- **Likely cause:** The configured health-check path does not exist.
- **Fix:** Confirm fa-lba-tg uses /health and user-data.sh writes /var/www/html/health.

## trouble-03 — ALB DNS returns 503

- **Likely cause:** The listener has no healthy target.
- **Fix:** Open fa-lba-tg Targets and resolve target health before changing the listener.

## trouble-04 — ASG cannot launch instances

- **Likely cause:** Launch template, subnet or service-linked-role/EC2 permissions are invalid.
- **Fix:** Read the exact ASG Activity failure, verify fa-lba-lt version 1 and both subnet IDs, then confirm the IAM policy permissions.

## trouble-05 — Scaling policy does not scale out

- **Likely cause:** Request volume was not sustained long enough or new capacity is still warming.
- **Fix:** Confirm ALBRequestCountPerTarget target 50, run the supplied generator for several minutes and review scaling activities before changing the target.

## trouble-06 — Security group cannot be deleted

- **Likely cause:** An ALB or EC2 ENI still references it.
- **Fix:** Verify zero ASG instances, delete the ALB and wait for ENIs to disappear, then retry only the exact fa-lba security group.

## trouble-07 — VPC cannot be deleted

- **Likely cause:** A subnet, route table, internet gateway, security group or ENI dependency remains.
- **Fix:** Recheck reverse dependency cleanup and remove only the remaining fa-lba dependency.

# Ordered manual cleanup

- **Manual only:** `true`
- **Ordering:** `reverse_dependency`
- **Completion gate:** `acknowledgement`

## Cleanup 1: fa-lba-request-scaling

- **Action:** Delete the target tracking policy.
- **Verification:** describe-policies returns no fa-lba-request-scaling policy.
- **Task:** task-14-prepare-cleanup

## Cleanup 2: fa-lba-asg EC2 instances

- **Action:** Set MinSize and DesiredCapacity to 0 and wait for every instance to terminate.
- **Verification:** The ASG instance list is empty and fa-lba-tg has no target.
- **Task:** task-14-prepare-cleanup

## Cleanup 3: fa-lba-asg

- **Action:** Delete the empty Auto Scaling group.
- **Verification:** The group no longer exists.
- **Task:** task-15-final-cleanup

## Cleanup 4: fa-lba-lt

- **Action:** Delete the launch template after the ASG is gone.
- **Verification:** fa-lba-lt no longer exists.
- **Task:** task-15-final-cleanup

## Cleanup 5: HTTP:80 listener on fa-lba-alb

- **Action:** Delete the listener.
- **Verification:** No listener remains for fa-lba-alb.
- **Task:** task-15-final-cleanup

## Cleanup 6: fa-lba-alb

- **Action:** Delete the ALB and wait for deletion.
- **Verification:** The ALB and its ENIs are gone.
- **Task:** task-15-final-cleanup

## Cleanup 7: fa-lba-tg

- **Action:** Delete the target group.
- **Verification:** fa-lba-tg no longer exists.
- **Task:** task-15-final-cleanup

## Cleanup 8: fa-lba-web-sg then fa-lba-alb-sg

- **Action:** Delete the backend SG, then the ALB SG.
- **Verification:** Neither security group remains.
- **Task:** task-15-final-cleanup

## Cleanup 9: fa-lba-public-rt

- **Action:** Remove subnet associations and delete the route table.
- **Verification:** The route table is absent.
- **Task:** task-15-final-cleanup

## Cleanup 10: fa-lba-igw

- **Action:** Detach and delete the internet gateway.
- **Verification:** The internet gateway is absent.
- **Task:** task-15-final-cleanup

## Cleanup 11: fa-lba-public-a and fa-lba-public-b

- **Action:** Delete both public subnets.
- **Verification:** Neither subnet remains.
- **Task:** task-15-final-cleanup

## Cleanup 12: fa-lba-vpc

- **Action:** Delete the empty VPC.
- **Verification:** fa-lba-vpc is absent.
- **Task:** task-15-final-cleanup

## Cleanup 13: fa-lba-admin access key, fa-lba-admin-policy and fa-lba-admin

- **Action:** Use root only after cloud cleanup to remove the temporary access key, policy and IAM user.
- **Verification:** The IAM user and policy are absent.
- **Task:** task-15-final-cleanup

## Cleanup 14: AWS CLI profile fa-lba-admin

- **Action:** Remove only this named profile.
- **Verification:** The profile is unusable while unrelated profiles remain.
- **Task:** task-15-final-cleanup

## Cleanup 15: C:\aws-labs\fa-lba

- **Action:** Delete the local lab folder last.
- **Verification:** The folder no longer exists.
- **Task:** task-15-final-cleanup

## Programme cleanup acknowledgement

I verified that fa-lba-request-scaling is deleted; fa-lba-asg has no instances and is deleted; fa-lba-lt, the HTTP:80 listener, fa-lba-alb and fa-lba-tg are deleted; fa-lba-web-sg and fa-lba-alb-sg are deleted; fa-lba-public-rt, fa-lba-igw, fa-lba-public-a, fa-lba-public-b and fa-lba-vpc are deleted; no lab EC2 instance or public IPv4 remains; the temporary fa-lba-admin access key, fa-lba-admin-policy, IAM user and CLI profile are removed; unrelated AWS resources and profiles are unchanged; and only then was C:\aws-labs\fa-lba deleted.

# Official sources

## src-saa-domain3 — Content Domain 3: Design High-Performing Architectures

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html
- **Purpose:** SAA-C03 coverage for high-performing and elastic compute solutions.
- **Used by:** task-01-prerequisites, task-04-vpc-network, task-13-exam-review

## src-saa-domain4 — Content Domain 4: Design Cost-Optimized Architectures

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain4.html
- **Purpose:** SAA-C03 coverage for load-balancing and scaling strategies.
- **Used by:** task-01-prerequisites, task-13-exam-review

## src-alb-intro — What is an Application Load Balancer?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html
- **Purpose:** Application Load Balancer architecture and target groups.
- **Used by:** task-08-create-alb, task-13-exam-review

## src-alb-create — Create an Application Load Balancer

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html
- **Purpose:** Create and test an internet-facing ALB.
- **Used by:** task-02-bootstrap-user, task-08-create-alb, task-15-final-cleanup

## src-alb-target-groups — Target groups for your Application Load Balancers

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html
- **Purpose:** Target routing and per-target-group health checks.
- **Used by:** task-06-target-group, task-08-create-alb, task-13-exam-review, task-14-prepare-cleanup, task-15-final-cleanup

## src-alb-health — Health checks for Application Load Balancer target groups

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html
- **Purpose:** Target health-check configuration and health states.
- **Used by:** task-06-target-group, task-11-verify-health-and-routing

## src-alb-check-health — Check the health of your Application Load Balancer targets

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/elasticloadbalancing/latest/application/check-target-health.html
- **Purpose:** Verify target health in the console.
- **Used by:** task-06-target-group, task-11-verify-health-and-routing

## src-alb-listeners — Listeners for your Application Load Balancers

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html
- **Purpose:** Listener and rule behavior.
- **Used by:** task-08-create-alb

## src-alb-troubleshoot — Troubleshoot your Application Load Balancers

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-troubleshooting.html
- **Purpose:** ALB security-group and health-check troubleshooting.
- **Used by:** task-05-security-groups

## src-asg-intro — What is Amazon EC2 Auto Scaling?

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html
- **Purpose:** Desired capacity and instance health/replacement behavior.
- **Used by:** task-09-create-asg, task-13-exam-review, task-14-prepare-cleanup

## src-asg-launch-template — Create an Auto Scaling group using a launch template

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-asg-launch-template.html
- **Purpose:** Create an Auto Scaling group from a launch template.
- **Used by:** task-02-bootstrap-user, task-07-launch-template, task-09-create-asg, task-15-final-cleanup

## src-asg-launch-templates — Auto Scaling launch templates

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-templates.html
- **Purpose:** Launch templates as reusable EC2 configuration.
- **Used by:** task-03-cli-and-local-files, task-07-launch-template

## src-asg-target-tracking — Target tracking scaling policies for Amazon EC2 Auto Scaling

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html
- **Purpose:** Target tracking scaling policy behavior and metrics.
- **Used by:** task-10-scaling-policy, task-12-generate-load, task-13-exam-review, task-14-prepare-cleanup

## src-asg-dynamic — Dynamic scaling for Amazon EC2 Auto Scaling

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html
- **Purpose:** Dynamic scaling based on demand.
- **Used by:** task-10-scaling-policy, task-12-generate-load

## src-asg-health — Health checks for instances in an Auto Scaling group

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html
- **Purpose:** Auto Scaling instance health and replacement.
- **Used by:** task-09-create-asg, task-11-verify-health-and-routing, task-13-exam-review

## src-asg-health-overview — About the health checks for your Auto Scaling group

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html
- **Purpose:** Health-check types available to an Auto Scaling group.
- **Used by:** task-11-verify-health-and-routing

## src-asg-grace — Set the health check grace period for an Auto Scaling group

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html
- **Purpose:** Health-check grace period for new instances.
- **Used by:** task-09-create-asg, task-11-verify-health-and-routing

## src-asg-warmup — Set the default instance warmup for an Auto Scaling group

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-default-instance-warmup.html
- **Purpose:** Default instance warmup for scaling.
- **Used by:** task-09-create-asg, task-10-scaling-policy, task-12-generate-load

## src-asg-attach-alb — Attach an Elastic Load Balancing load balancer to your Auto Scaling group

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html
- **Purpose:** Attach a target group and enable ELB health checks.
- **Used by:** task-09-create-asg, task-11-verify-health-and-routing

## src-asg-tutorial — Tutorial: Set up a scaled and load-balanced application

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/autoscaling/ec2/userguide/tutorial-ec2-auto-scaling-load-balancer.html
- **Purpose:** End-to-end load-balanced Auto Scaling pattern.
- **Used by:** task-12-generate-load

## src-ec2-user-data — Run commands on your Linux instance at launch

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html
- **Purpose:** EC2 user data for web-server bootstrap.
- **Used by:** task-03-cli-and-local-files, task-07-launch-template

## src-vpc-create — Create a VPC

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/create-vpc.html
- **Purpose:** Dedicated VPC and subnets.
- **Used by:** task-02-bootstrap-user, task-04-vpc-network

## src-vpc-igw — Connect your VPC to the internet using an internet gateway

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
- **Purpose:** Internet gateway and public routing.
- **Used by:** task-04-vpc-network, task-15-final-cleanup

## src-vpc-sg — Control traffic to your AWS resources using security groups

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html
- **Purpose:** ALB and backend security groups.
- **Used by:** task-05-security-groups, task-15-final-cleanup

## src-iam-best — Security best practices in IAM

- **Publisher:** AWS
- **URL:** https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- **Purpose:** Avoid root for routine work and protect credentials.
- **Used by:** task-01-prerequisites, task-02-bootstrap-user, task-15-final-cleanup

# Quality report

- **Phase count:** 7
- **Task count:** 15
- **Checkbox count:** 204
- **CLI command count:** 109
- **Editable-block count:** 5
- **Verification count:** 38
- **Cleanup-item count:** 15
- **Official-source count:** 25
- **Missing items:** 0
- **Uncertain items:** 0

# Offline conversion boundary

This preview and JSON manuscript are offline educational authoring artifacts only. They have not been locally validated by Study Tracker, imported, accepted, approved, published or fingerprinted.
