/**
 * Elastic Load Balancing (ELB) Hands-On Tasks & Guided AWS Labs (SAA-C03)
 * Total Converted Tasks: 13
 */

export const ELB_TASKS = [
  {
    "id": "task-saa-elb-create-an-alb-in-front-of-an-auto-scaling-group-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Create an ALB in front of an Auto Scaling Group",
    "slug": "create-an-alb-in-front-of-an-auto-scaling-group",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an Application Load Balancer, place an Auto Scaling Group behind it, and refresh the ALB DNS name to see traffic reach different EC2 instances.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Application Load Balancer",
        "body": "Application Load Balancer works at Layer 7. It is used for HTTP and HTTPS web traffic. It sends requests to healthy targets in target groups."
      },
      {
        "id": "concept-2",
        "title": "Auto Scaling Group",
        "body": "Auto Scaling Group keeps the wanted number of EC2 instances running. In this lab, desired capacity is 2. If one instance fails, ASG can replace it."
      },
      {
        "id": "concept-3",
        "title": "Target group",
        "body": "Target group is where ALB sends traffic. The ASG registers instances into the target group. You do not manually register each ASG instance."
      },
      {
        "id": "concept-4",
        "title": "Health check",
        "body": "Health check decides if a target receives traffic. For this lab, the health check path is /. Only healthy targets receive normal requests."
      },
      {
        "id": "concept-5",
        "title": "Planned architecture",
        "body": "PartNameSettingReasonVPCdefault VPC2 default subnetsBeginner-safe labALB SGlbas-task1-alb-sgHTTP 80 from internetBrowser can reach ALBInstance SGlbas-task1-web-sgHTTP 80 from ALB SGOnly ALB reaches instancesTarget grouplbas-task1-tgHTTP 80, path /ALB health checksASGlbas-task1-asgmin 2, desired 2, max 2Traffic distribution test"
      }
    ],
    "whyItMatters": "This matters because ALB plus ASG is a core AWS web pattern. It gives high availability, health checks, and automatic instance replacement. It is heavily tested in SAA-C03 and useful in SOA-C02 and DVA-C02.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      },
      {
        "label": "Subnets",
        "value": "Two default subnets in different Availability Zones"
      },
      {
        "label": "ALB name",
        "value": "lbas-task1-alb"
      },
      {
        "label": "Target group",
        "value": "lbas-task1-tg"
      },
      {
        "label": "Launch template",
        "value": "lbas-task1-lt"
      },
      {
        "label": "Auto Scaling Group",
        "value": "lbas-task1-asg"
      },
      {
        "label": "Instance type",
        "value": "t3.micro"
      },
      {
        "label": "Desired capacity",
        "value": "2"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, VPC discovery, security group setup, launch template setup, ALB setup, ASG setup, health checks, and cleanup."
      }
    ],
    "costWarning": "This lab can create charges for the Application Load Balancer, EC2 instances, EBS root volumes, and data processing. Delete the resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC discovery: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeAvailabilityZones Security groups: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:DescribeSecurityGroups, ec2:DeleteSecurityGroup Launch template: ec2:CreateLaunchTemplate, ec2:DescribeLaunchTemplates, ec2:DeleteLaunchTemplate, ec2:RunInstances, ec2:TerminateInstances, ec2:DescribeInstances Load balancer: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:DescribeLoadBalancers, elasticloadbalancing:DescribeTargetHealth, elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup Auto Scaling: autoscaling:CreateAutoScalingGroup, autoscaling:UpdateAutoScalingGroup, autoscaling:DescribeAutoScalingGroups, autoscaling:DeleteAutoScalingGroup, autoscaling:SetDesiredCapacity IAM service-linked role: iam:CreateServiceLinkedRole, iam:GetRole, iam:PassRole if your account needs Auto Scaling or ELB service roles created.",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the EC2 console and confirm the default VPC",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set the Region to Europe (London) eu-west-2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Confirm there is a default VPC."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Subnets."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Confirm at least two default subnets exist in different Availability Zones."
          }
        ],
        "note": "This lab uses the default VPC to keep setup simple.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the ALB security group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "In the left menu, choose Security Groups."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it lbas-task1-alb-sg."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Add inbound rule: HTTP, port 80, source 0.0.0.0/0."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Leave outbound as all traffic."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Choose Create security group."
          }
        ],
        "note": null,
        "warning": "This opens the ALB to the internet for the lab. Delete it after testing.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the web instance security group",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Choose Create security group again."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Name it lbas-task1-web-sg."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Add inbound rule: HTTP, port 80, source lbas-task1-alb-sg."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Do not add SSH for this lab."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Leave outbound as all traffic."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Choose Create security group."
          }
        ],
        "note": "The EC2 instances only accept HTTP from the ALB security group.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create a launch template",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "In EC2, choose Launch Templates."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Create launch template."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Name it lbas-task1-lt."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose instance type t3.micro."
          },
          {
            "id": "console-step-5-item-6",
            "text": "For key pair, choose Proceed without a key pair."
          },
          {
            "id": "console-step-5-item-7",
            "text": "For security groups, choose lbas-task1-web-sg."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Open Advanced details."
          },
          {
            "id": "console-step-5-item-9",
            "text": "Paste the user data script from the CLI section, or use a simple web server script that prints the instance ID."
          },
          {
            "id": "console-step-5-item-10",
            "text": "Choose Create launch template."
          }
        ],
        "note": "The web page should show the instance ID so you can see traffic distribution.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the target group",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "In EC2, under Load Balancing, choose Target Groups."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Create target group."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose target type Instances."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Name it lbas-task1-tg."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Protocol is HTTP, port 80."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Set health check path to /."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Do not manually register instances."
          },
          {
            "id": "console-step-6-item-9",
            "text": "Choose Create target group."
          }
        ],
        "note": "The ASG will register instances later.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Create the Application Load Balancer",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "In EC2, under Load Balancing, choose Load Balancers."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose Create load balancer."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Choose Application Load Balancer."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Name it lbas-task1-alb."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Scheme: Internet-facing."
          },
          {
            "id": "console-step-7-item-6",
            "text": "IP address type: IPv4."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Select two default subnets in different Availability Zones."
          },
          {
            "id": "console-step-7-item-9",
            "text": "Choose security group lbas-task1-alb-sg."
          },
          {
            "id": "console-step-7-item-10",
            "text": "Create listener HTTP:80 forwarding to lbas-task1-tg."
          },
          {
            "id": "console-step-7-item-11",
            "text": "Choose Create load balancer."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Create the Auto Scaling Group",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "In EC2, choose Auto Scaling Groups."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Choose Create Auto Scaling group."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Name it lbas-task1-asg."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Choose launch template lbas-task1-lt."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Select the same two default subnets used by the ALB."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Attach to an existing load balancer."
          },
          {
            "id": "console-step-8-item-8",
            "text": "Choose target group lbas-task1-tg."
          },
          {
            "id": "console-step-8-item-9",
            "text": "Set health checks to include ELB if shown."
          },
          {
            "id": "console-step-8-item-10",
            "text": "Set desired capacity 2, minimum 2, maximum 2."
          },
          {
            "id": "console-step-8-item-11",
            "text": "Create the Auto Scaling Group."
          }
        ],
        "note": "Wait until two instances launch and become healthy in the target group.",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Verify traffic distribution",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Open EC2, then Target Groups."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Open lbas-task1-tg."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Choose the Targets tab."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Confirm both targets show Healthy."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Open Load Balancers."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Copy the DNS name for lbas-task1-alb."
          },
          {
            "id": "console-step-9-item-7",
            "text": "Open the DNS name in a browser using http://."
          },
          {
            "id": "console-step-9-item-8",
            "text": "Refresh many times."
          },
          {
            "id": "console-step-9-item-9",
            "text": "Confirm different instance IDs or Availability Zones appear."
          }
        ],
        "note": "Browser caching can hide the change. Use refresh or open a private window.",
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Set the ASG desired capacity to 0."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Delete the Auto Scaling Group."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Delete the ALB listener if needed."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Delete the Application Load Balancer."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Wait until the ALB is fully deleted."
          },
          {
            "id": "console-step-10-item-6",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-10-item-7",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-10-item-8",
            "text": "Delete lbas-task1-web-sg."
          },
          {
            "id": "console-step-10-item-9",
            "text": "Delete lbas-task1-alb-sg."
          }
        ],
        "note": null,
        "warning": "Do not delete the default VPC or default subnets.",
        "expectedResult": "Step 10 completed successfully."
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set variables and find default VPC details",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nALB_NAME=lbas-task1-alb\nTG_NAME=lbas-task1-tg\nLT_NAME=lbas-task1-lt\nASG_NAME=lbas-task1-asg\nALB_SG_NAME=lbas-task1-alb-sg\nWEB_SG_NAME=lbas-task1-web-sg\nVPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)\nSUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID Name=default-for-az,Values=true --query 'Subnets[0:2].SubnetId' --output text)\nSUBNET_LIST=$(echo $SUBNETS | tr ' ' ',')\necho $VPC_ID\necho $SUBNET_LIST"
          }
        ],
        "note": "Expected: you see one VPC ID and two subnet IDs.",
        "warning": null,
        "expectedResult": "Expected: you see one VPC ID and two subnet IDs."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create security groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "ALB_SG_ID=$(aws ec2 create-security-group --region $REGION --group-name $ALB_SG_NAME --description 'ALB SG for LBAS task 1' --vpc-id $VPC_ID --query 'GroupId' --output text)\nWEB_SG_ID=$(aws ec2 create-security-group --region $REGION --group-name $WEB_SG_NAME --description 'Web SG for LBAS task 1' --vpc-id $VPC_ID --query 'GroupId' --output text)\naws ec2 authorize-security-group-ingress --region $REGION --group-id $ALB_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0\naws ec2 authorize-security-group-ingress --region $REGION --group-id $WEB_SG_ID --protocol tcp --port 80 --source-group $ALB_SG_ID\necho $ALB_SG_ID\necho $WEB_SG_ID"
          }
        ],
        "note": "Expected: the ALB security group allows HTTP from the internet. The web security group allows HTTP only from the ALB security group.",
        "warning": null,
        "expectedResult": "Expected: the ALB security group allows HTTP from the internet. The web security group allows HTTP only from the ALB security group."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create user data file",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > user-data-lbas-task1.sh <<'EOF'\n#!/bin/bash\ndnf update -y\ndnf install -y httpd\nsystemctl enable httpd\nsystemctl start httpd\nTOKEN=$(curl -X PUT 'http://169.254.169.254/latest/api/token' -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600')\nINSTANCE_ID=$(curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/instance-id)\nAZ=$(curl -H \"X-aws-ec2-metadata-token: $TOKEN\" http://169.254.169.254/latest/meta-data/placement/availability-zone)\ncat > /var/www/html/index.html <<HTML\n<h1>LBAS Task 1</h1>\n<p>Instance ID: $INSTANCE_ID</p>\n<p>Availability Zone: $AZ</p>\nHTML\nEOF"
          }
        ],
        "note": "This script installs Apache and creates a web page showing the EC2 instance ID.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create the launch template",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "AMI_ID=$(aws ssm get-parameters --region $REGION --names /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query 'Parameters[0].Value' --output text)\nUSER_DATA=$(base64 -w 0 user-data-lbas-task1.sh 2>/dev/null || base64 user-data-lbas-task1.sh)\naws ec2 create-launch-template --region $REGION --launch-template-name $LT_NAME --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI_ID\\\",\\\"InstanceType\\\":\\\"t3.micro\\\",\\\"SecurityGroupIds\\\":[\\\"$WEB_SG_ID\\\"],\\\"UserData\\\":\\\"$USER_DATA\\\"}\""
          }
        ],
        "note": "Expected: launch template is created with Amazon Linux 2023 and the web server user data.",
        "warning": null,
        "expectedResult": "Expected: launch template is created with Amazon Linux 2023 and the web server user data."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the target group and ALB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "TG_ARN=$(aws elbv2 create-target-group --region $REGION --name $TG_NAME --protocol HTTP --port 80 --vpc-id $VPC_ID --health-check-path / --target-type instance --query 'TargetGroups[0].TargetGroupArn' --output text)\nALB_ARN=$(aws elbv2 create-load-balancer --region $REGION --name $ALB_NAME --type application --scheme internet-facing --security-groups $ALB_SG_ID --subnets $SUBNETS --query 'LoadBalancers[0].LoadBalancerArn' --output text)\naws elbv2 wait load-balancer-available --region $REGION --load-balancer-arns $ALB_ARN\necho $TG_ARN\necho $ALB_ARN"
          }
        ],
        "note": "Expected: the ALB becomes available.",
        "warning": null,
        "expectedResult": "Expected: the ALB becomes available."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Create the HTTP listener",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "LISTENER_ARN=$(aws elbv2 create-listener --region $REGION --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG_ARN --query 'Listeners[0].ListenerArn' --output text)\necho $LISTENER_ARN"
          }
        ],
        "note": "Expected: HTTP port 80 forwards to the target group.",
        "warning": null,
        "expectedResult": "Expected: HTTP port 80 forwards to the target group."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Create the Auto Scaling Group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws autoscaling create-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --launch-template LaunchTemplateName=$LT_NAME,Version='$Latest' --min-size 2 --max-size 2 --desired-capacity 2 --vpc-zone-identifier $SUBNET_LIST --target-group-arns $TG_ARN --health-check-type ELB --health-check-grace-period 120"
          }
        ],
        "note": "Expected: ASG launches two EC2 instances and registers them with the target group.",
        "warning": null,
        "expectedResult": "Expected: ASG launches two EC2 instances and registers them with the target group."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Wait and verify target health",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "sleep 180\naws elbv2 describe-target-health --region $REGION --target-group-arn $TG_ARN --query 'TargetHealthDescriptions[*].[Target.Id,TargetHealth.State,TargetHealth.Reason]' --output table"
          }
        ],
        "note": "Expected: two targets show healthy. If not, wait a little longer and run the command again.",
        "warning": null,
        "expectedResult": "Expected: two targets show healthy. If not, wait a little longer and run the command again."
      },
      {
        "id": "cli-step-10",
        "number": 10,
        "title": "Test traffic distribution",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-10-cmd-1",
            "language": "bash",
            "text": "ALB_DNS=$(aws elbv2 describe-load-balancers --region $REGION --names $ALB_NAME --query 'LoadBalancers[0].DNSName' --output text)\necho http://$ALB_DNS\nfor i in {1..10}; do curl -s http://$ALB_DNS | grep 'Instance ID'; done"
          }
        ],
        "note": "Expected: the output may show different instance IDs after repeated requests.",
        "warning": null,
        "expectedResult": "Expected: the output may show different instance IDs after repeated requests."
      },
      {
        "id": "cli-step-11",
        "number": 11,
        "title": "Tear down in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-11-cmd-1",
            "language": "bash",
            "text": "aws autoscaling update-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --min-size 0 --desired-capacity 0\nsleep 90\naws autoscaling delete-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --force-delete\naws elbv2 delete-listener --region $REGION --listener-arn $LISTENER_ARN\naws elbv2 delete-load-balancer --region $REGION --load-balancer-arn $ALB_ARN\naws elbv2 wait load-balancers-deleted --region $REGION --load-balancer-arns $ALB_ARN\naws elbv2 delete-target-group --region $REGION --target-group-arn $TG_ARN\naws ec2 delete-launch-template --region $REGION --launch-template-name $LT_NAME\naws ec2 delete-security-group --region $REGION --group-id $WEB_SG_ID\naws ec2 delete-security-group --region $REGION --group-id $ALB_SG_ID\nrm -f user-data-lbas-task1.sh"
          }
        ],
        "note": null,
        "warning": "Only run teardown when you have finished the lab.",
        "expectedResult": "CLI command step 11 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ALB core rule",
        "body": "ALB = Layer 7 load balancer. ALB is best for HTTP and HTTPS. ALB supports path and host routing."
      },
      {
        "id": "cs-2",
        "title": "ASG core rule",
        "body": "ASG = keeps EC2 capacity at the wanted size. ASG replaces failed instances. ASG can scale in and out."
      },
      {
        "id": "cs-3",
        "title": "Target group rule",
        "body": "Target group = where ALB sends traffic. Targets can be instances, IPs, or Lambda. This lab uses instance targets."
      },
      {
        "id": "cs-4",
        "title": "Health check rule",
        "body": "ALB sends traffic only to healthy targets. Health check path must return success. Wrong path often means unhealthy targets."
      },
      {
        "id": "cs-5",
        "title": "ASG registration rule",
        "body": "ASG registers new instances with the target group. ASG deregisters terminated instances. Do not manually attach each ASG instance."
      },
      {
        "id": "cs-6",
        "title": "Security group split",
        "body": "ALB SG allows user traffic. Instance SG allows traffic from ALB SG. This keeps instances private from direct web access."
      },
      {
        "id": "cs-7",
        "title": "Traffic distribution",
        "body": "ALB spreads requests across healthy targets. Distribution may not look perfectly even in a tiny test. Refresh many times to see different instances."
      },
      {
        "id": "cs-8",
        "title": "Listener rule",
        "body": "Listener receives client requests. HTTP listener uses port 80. Default action forwards to the target group."
      },
      {
        "id": "cs-9",
        "title": "Launch template",
        "body": "Launch template defines EC2 settings. ASG uses it to launch instances. It replaces older launch configurations in most exam answers."
      },
      {
        "id": "cs-10",
        "title": "ELB health checks",
        "body": "ASG can use ELB health checks. Then ASG can replace instances that fail ALB checks. Useful for web app failure detection."
      },
      {
        "id": "cs-11",
        "title": "Common mistake",
        "body": "Unhealthy targets often mean blocked security group. Check instance SG allows ALB SG on app port. Also check user data installed the web server."
      },
      {
        "id": "cs-12",
        "title": "Cost memory",
        "body": "ALB has hourly cost. EC2 instances have hourly cost. Delete ASG and ALB after lab testing."
      },
      {
        "id": "cs-13",
        "title": "ALB vs NLB",
        "body": "ALB = HTTP and HTTPS features. NLB = TCP, UDP, static IP, very high performance. Choose ALB for web routing rules."
      },
      {
        "id": "cs-14",
        "title": "High availability",
        "body": "Use at least two AZs. Place ALB in public subnets. Place ASG instances across multiple subnets."
      },
      {
        "id": "cs-15",
        "title": "Verification memory",
        "body": "Check ALB DNS. Check target health. Check ASG instance count. Check web page instance ID."
      },
      {
        "id": "cs-16",
        "title": "Routing plan",
        "body": "LayerComponentPortPurposeClientBrowserHTTP 80Sends requestLoad balancerlbas-task1-albHTTP 80Receives requestTarget grouplbas-task1-tgHTTP 80Routes to healthy targetsInstancesASG EC2HTTP 80Returns instance ID page"
      },
      {
        "id": "cs-17",
        "title": "Teardown memory",
        "body": "Delete orderResourceWhy1ASGStops managed instances2ALB listenerRemoves forwarding3ALBRemoves load balancer4Target groupNo longer in use5Launch templateNo ASG depends on it6Security groupsDependencies are gone"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the grouped IAM actions in Console step 0. Run aws sts get-caller-identity to confirm the identity."
      },
      {
        "id": "ts-2",
        "title": "Targets stay unhealthy",
        "body": "Check the web security group. It must allow HTTP port 80 from the ALB security group. Check the web server started."
      },
      {
        "id": "ts-3",
        "title": "ALB DNS does not load",
        "body": "Check the ALB security group allows HTTP port 80. Check the ALB is internet-facing. Check the ALB has two public default subnets."
      },
      {
        "id": "ts-4",
        "title": "Only one instance appears",
        "body": "Refresh more times. Small tests may not look perfectly even. Check both targets are healthy."
      },
      {
        "id": "ts-5",
        "title": "ASG launches no instances",
        "body": "Check the launch template AMI and subnet settings. Check service-linked role permissions. Check EC2 service limits if launch fails."
      },
      {
        "id": "ts-6",
        "title": "Cannot delete security group",
        "body": "Delete ASG, ALB, and target group first. Security groups with attached ENIs cannot be deleted."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1 — IGW is not load balancing",
        "body": "Internet Gateway gives internet routing. It does not distribute traffic. Use ALB for HTTP load balancing."
      },
      {
        "id": "trap-2",
        "title": "Trap 2 — Registering ASG instances manually",
        "body": "Wrong choice: manually register each instance. Correct idea: attach the target group to the ASG."
      },
      {
        "id": "trap-3",
        "title": "Trap 3 — Security group source",
        "body": "Do not open instance HTTP to the whole internet. Allow HTTP from the ALB security group."
      },
      {
        "id": "trap-4",
        "title": "Trap 4 — Health checks and replacement",
        "body": "EC2 health checks only check instance reachability. ELB health checks can detect app-level failure."
      },
      {
        "id": "trap-5",
        "title": "Trap 5 — ALB vs NLB",
        "body": "Choose ALB for HTTP path or host routing. Choose NLB for TCP, UDP, static IP, or extreme performance."
      },
      {
        "id": "trap-6",
        "title": "Trap 6 — One subnet is not HA",
        "body": "A production ALB should span at least two AZs. Single-AZ designs are weaker."
      },
      {
        "id": "trap-7",
        "title": "Trap 7 — Wrong health check path",
        "body": "If the health check path fails, targets stay unhealthy. The ALB will not send normal traffic to unhealthy targets."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "ALB answers. ASG replaces. ALB sends web traffic to healthy targets. ASG keeps enough instances running.",
    "flashcardSetId": "elb_task_1_flashcards"
  },
  {
    "id": "task-saa-elb-create-a-network-load-balancer-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Create a Network Load Balancer",
    "slug": "create-a-network-load-balancer",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an internet-facing Network Load Balancer, send TCP traffic to two EC2 targets, verify health checks, and learn when to choose NLB instead of ALB.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Network Load Balancer",
        "body": "NLB = Layer 4 load balancer. It handles TCP, UDP, TLS, and related network protocols. It is not used for path-based HTTP routing."
      },
      {
        "id": "concept-2",
        "title": "Target group",
        "body": "Target group = where the NLB sends traffic. Targets can be EC2 instances, IP addresses, or other supported target types. The listener points to the target group."
      },
      {
        "id": "concept-3",
        "title": "Listener",
        "body": "Listener = front door port. This lab uses TCP port 80. The listener forwards traffic to the target group."
      },
      {
        "id": "concept-4",
        "title": "Lab build plan",
        "body": "ItemChosen valueReasonRegioneu-west-2London Region for the labVPCDefault VPCBeginner-safe starting pointSubnetsTwo default public subnetsNLB spans multiple AZsInstancesTwo Amazon Linux 2023 instancesTwo targets show distributionTarget groupsaa-lbas-task2-nlb-tgTCP target group on port 80ListenerTCP 80NLB forwards Layer 4 trafficHealth checkHTTP /Simple web server check"
      },
      {
        "id": "concept-5",
        "title": "NLB vs ALB decision table",
        "body": "NeedChooseWhyHTTP path routingALBALB reads Layer 7 HTTP dataHost-based routingALBALB can route by host headerTCP or UDP trafficNLBNLB works at Layer 4Very high performanceNLBNLB is built for high throughputStatic IP per AZNLBNLB can use static IPsTLS pass-throughNLBTargets can decrypt trafficWAF integrationALBAWS WAF integrates with ALBContainer HTTP microservicesALBALB supports rich HTTP rules"
      }
    ],
    "whyItMatters": "This matters because many exam questions ask you to choose ALB or NLB. NLB is best for Layer 4 traffic, static IP needs, very high performance, and TLS pass-through. ALB is best for HTTP and HTTPS routing rules.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      },
      {
        "label": "Security group",
        "value": "saa-lbas-task2-web-sg"
      },
      {
        "label": "Instance name prefix",
        "value": "saa-lbas-task2-web"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task2-nlb-tg"
      },
      {
        "label": "Load balancer",
        "value": "saa-lbas-task2-nlb"
      },
      {
        "label": "Listener",
        "value": "TCP 80"
      },
      {
        "label": "Health check",
        "value": "HTTP /"
      }
    ],
    "costWarning": "This lab can create charges for the Network Load Balancer, Load Balancer Capacity Units, EC2 instances, EBS storage, and data transfer. Delete the resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions in the table below."
          }
        ],
        "note": "PurposeIAM actionsIdentity checksts:GetCallerIdentityVPC discoveryec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeAvailabilityZonesEC2 setupec2:RunInstances, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DescribeInstancesIAM for EC2iam:PassRole only if you use an existing instance profileLoad balancingelasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListenerRegistrationelasticloadbalancing:RegisterTargets, elasticloadbalancing:DescribeTargetHealthCleanupelasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup, ec2:TerminateInstances, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Find the default VPC and two public subnets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Find the VPC where Default VPC is Yes."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Subnets."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Pick two default subnets in different Availability Zones."
          }
        ],
        "note": "Expected: you have one default VPC and at least two default public subnets.",
        "warning": null,
        "expectedResult": "Expected: you have one default VPC and at least two default public subnets."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the web security group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Security Groups."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it saa-lbas-task2-web-sg."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select the default VPC."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Add inbound rule: HTTP, TCP 80, source 0.0.0.0/0."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Add inbound rule: SSH, TCP 22, source your-ip/32 only if you need SSH."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Keep outbound traffic allowed."
          }
        ],
        "note": null,
        "warning": "For a public lab, HTTP from anywhere is simple. In real workloads, restrict sources where possible.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Launch two test EC2 instances",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Use Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Use t3.micro or a free-tier size if available."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Launch one instance in subnet A and one instance in subnet B."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Use the security group saa-lbas-task2-web-sg."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Paste user data that installs a small web page showing the instance name."
          }
        ],
        "note": "User data example: #!/bin/bash dnf install -y httpd systemctl enable --now httpd AZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone) ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id) echo \"NLB target $ID in $AZ\" > /var/www/html/index.html",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the Network Load Balancer target group",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Target Groups under Load Balancing."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Create target group."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose target type Instances."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Protocol: TCP."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Port: 80."
          },
          {
            "id": "console-step-5-item-7",
            "text": "VPC: select the default VPC."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Health check protocol: HTTP."
          },
          {
            "id": "console-step-5-item-9",
            "text": "Health check path: /."
          },
          {
            "id": "console-step-5-item-10",
            "text": "Name it saa-lbas-task2-nlb-tg."
          },
          {
            "id": "console-step-5-item-11",
            "text": "Register both EC2 instances."
          }
        ],
        "note": "Expected: both targets become healthy after the web server starts.",
        "warning": null,
        "expectedResult": "Expected: both targets become healthy after the web server starts."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the Network Load Balancer",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Load Balancers under Load Balancing."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Create load balancer."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Network Load Balancer."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Name it saa-lbas-task2-nlb."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Scheme: Internet-facing."
          },
          {
            "id": "console-step-6-item-7",
            "text": "IP address type: IPv4."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Select the default VPC and the two subnets used by the instances."
          },
          {
            "id": "console-step-6-item-9",
            "text": "Create listener TCP 80 and forward to saa-lbas-task2-nlb-tg."
          },
          {
            "id": "console-step-6-item-10",
            "text": "Choose Create load balancer."
          }
        ],
        "note": "Expected: the NLB receives a DNS name after creation.",
        "warning": null,
        "expectedResult": "Expected: the NLB receives a DNS name after creation."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Verify target health and traffic",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the target group saa-lbas-task2-nlb-tg."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose the Targets tab."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Confirm both instances show healthy."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Open the NLB DNS name in a browser using http://."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Refresh several times or run curl several times."
          },
          {
            "id": "console-step-7-item-6",
            "text": "You should see responses from the test targets."
          }
        ],
        "note": "NLB uses flow-based routing. A single browser may stick to one target for a while. Use repeated curl or different connections to see both targets.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Compare NLB vs ALB",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Write down the reason this lab used NLB."
          },
          {
            "id": "console-step-8-item-2",
            "text": "NLB forwards network traffic at Layer 4."
          },
          {
            "id": "console-step-8-item-3",
            "text": "ALB is better when you need HTTP path, host, header, or query routing."
          },
          {
            "id": "console-step-8-item-4",
            "text": "NLB is better when you need TCP, UDP, static IPs, or TLS pass-through."
          }
        ],
        "note": "Exam decision: use ALB for smart HTTP routing. Use NLB for fast network-level routing.",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Delete the listener from saa-lbas-task2-nlb if needed."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Delete the Network Load Balancer saa-lbas-task2-nlb."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Wait until the load balancer is deleted."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Delete target group saa-lbas-task2-nlb-tg."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Terminate the two EC2 instances."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Wait until the instances are terminated."
          },
          {
            "id": "console-step-9-item-7",
            "text": "Delete security group saa-lbas-task2-web-sg."
          }
        ],
        "note": "OrderDeleteWhy1ListenerStops forwarding first2Network Load BalancerRemoves the paid load balancer3Target groupDelete after listener is gone4EC2 instancesRemoves test servers5Security groupDelete after instances release it6Local variables/filesClean your terminal only",
        "warning": "Delete the NLB first because it can keep billing while it exists.",
        "expectedResult": "Step 9 completed successfully."
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
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
            "text": "export AWS_REGION=eu-west-2\nexport LAB=saa-lbas-task2\nexport VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nexport SUBNETS=$(aws ec2 describe-subnets --region $AWS_REGION --filters Name=vpc-id,Values=$VPC_ID Name=default-for-az,Values=true --query 'Subnets[0:2].SubnetId' --output text)\necho $VPC_ID\necho $SUBNETS"
          }
        ],
        "note": "Expected: you see one VPC ID and two subnet IDs.",
        "warning": null,
        "expectedResult": "Expected: you see one VPC ID and two subnet IDs."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create a security group for the targets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "export SG_ID=$(aws ec2 create-security-group --region $AWS_REGION --group-name ${LAB}-web-sg --description 'NLB lab web targets' --vpc-id $VPC_ID --query 'GroupId' --output text)\naws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0\necho $SG_ID"
          }
        ],
        "note": "Expected: a new security group ID is returned.",
        "warning": null,
        "expectedResult": "Expected: a new security group ID is returned."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Launch two web instances",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > /tmp/lbas-task2-userdata.sh <<'EOF'\n#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\nAZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)\nID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)\necho \"NLB target $ID in $AZ\" > /var/www/html/index.html\nEOF\nexport AMI_ID=$(aws ssm get-parameters --region $AWS_REGION --names /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query 'Parameters[0].Value' --output text)\nexport INSTANCE_IDS=$(for S in $SUBNETS; do aws ec2 run-instances --region $AWS_REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $S --security-group-ids $SG_ID --user-data file:///tmp/lbas-task2-userdata.sh --tag-specifications \"ResourceType=instance,Tags=[{Key=Name,Value=${LAB}-web}]\" --query 'Instances[0].InstanceId' --output text; done)\necho $INSTANCE_IDS"
          }
        ],
        "note": "Expected: two instance IDs are returned. Wait until they are running.",
        "warning": null,
        "expectedResult": "Expected: two instance IDs are returned. Wait until they are running."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create the target group and register instances",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "export TG_ARN=$(aws elbv2 create-target-group --region $AWS_REGION --name ${LAB}-nlb-tg --protocol TCP --port 80 --vpc-id $VPC_ID --target-type instance --health-check-protocol HTTP --health-check-path / --query 'TargetGroups[0].TargetGroupArn' --output text)\naws elbv2 register-targets --region $AWS_REGION --target-group-arn $TG_ARN --targets $(for I in $INSTANCE_IDS; do printf 'Id=%s ' $I; done)\necho $TG_ARN"
          }
        ],
        "note": "Expected: a target group ARN is returned.",
        "warning": null,
        "expectedResult": "Expected: a target group ARN is returned."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the Network Load Balancer and listener",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "export LB_ARN=$(aws elbv2 create-load-balancer --region $AWS_REGION --name ${LAB}-nlb --type network --scheme internet-facing --subnets $SUBNETS --query 'LoadBalancers[0].LoadBalancerArn' --output text)\nexport LB_DNS=$(aws elbv2 describe-load-balancers --region $AWS_REGION --load-balancer-arns $LB_ARN --query 'LoadBalancers[0].DNSName' --output text)\nexport LISTENER_ARN=$(aws elbv2 create-listener --region $AWS_REGION --load-balancer-arn $LB_ARN --protocol TCP --port 80 --default-actions Type=forward,TargetGroupArn=$TG_ARN --query 'Listeners[0].ListenerArn' --output text)\necho $LB_DNS"
          }
        ],
        "note": "Expected: you see the NLB DNS name.",
        "warning": null,
        "expectedResult": "Expected: you see the NLB DNS name."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Check target health",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-target-health --region $AWS_REGION --target-group-arn $TG_ARN --query 'TargetHealthDescriptions[].{Instance:Target.Id,State:TargetHealth.State,Reason:TargetHealth.Reason}' --output table"
          }
        ],
        "note": "Expected: both targets eventually show healthy.",
        "warning": null,
        "expectedResult": "Expected: both targets eventually show healthy."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Test the NLB DNS name",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "for i in {1..10}; do curl -s http://$LB_DNS; echo; sleep 1; done"
          }
        ],
        "note": "Expected: you receive web responses from the targets. You may need to wait a few minutes for DNS and health checks.",
        "warning": null,
        "expectedResult": "Expected: you receive web responses from the targets. You may need to wait a few minutes for DNS and health checks."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Clean up resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws elbv2 delete-listener --region $AWS_REGION --listener-arn $LISTENER_ARN\naws elbv2 delete-load-balancer --region $AWS_REGION --load-balancer-arn $LB_ARN\nsleep 60\naws elbv2 delete-target-group --region $AWS_REGION --target-group-arn $TG_ARN\naws ec2 terminate-instances --region $AWS_REGION --instance-ids $INSTANCE_IDS\naws ec2 wait instance-terminated --region $AWS_REGION --instance-ids $INSTANCE_IDS\naws ec2 delete-security-group --region $AWS_REGION --group-id $SG_ID\nrm -f /tmp/lbas-task2-userdata.sh"
          }
        ],
        "note": "Expected: all paid lab resources are deleted. If target group deletion fails, wait and retry after the NLB finishes deleting.",
        "warning": "Destructive Command Warning: This command permanently terminates AWS resources, scaling policies, or load balancer configurations.",
        "expectedResult": "Expected: all paid lab resources are deleted. If target group deletion fails, wait and retry after the NLB finishes deleting."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "NLB core idea",
        "body": "NLB = Network Load Balancer. NLB works at Layer 4. NLB forwards TCP, UDP, TLS, and related traffic."
      },
      {
        "id": "cs-2",
        "title": "ALB core idea",
        "body": "ALB = Application Load Balancer. ALB works at Layer 7. ALB understands HTTP and HTTPS request data."
      },
      {
        "id": "cs-3",
        "title": "NLB exam choice",
        "body": "NLB = choose for TCP or UDP. NLB = choose for very high performance. NLB = choose for static IP needs."
      },
      {
        "id": "cs-4",
        "title": "ALB exam choice",
        "body": "ALB = choose for path routing. ALB = choose for host routing. ALB = choose for HTTP headers and query rules."
      },
      {
        "id": "cs-5",
        "title": "Target groups",
        "body": "Target group = backend targets. Listener forwards to target group. Health checks run per target group."
      },
      {
        "id": "cs-6",
        "title": "Health checks",
        "body": "NLB health checks can use TCP, HTTP, or HTTPS. Healthy targets receive traffic. Unhealthy targets are avoided."
      },
      {
        "id": "cs-7",
        "title": "Static IP memory",
        "body": "NLB can support static IP addresses. ALB uses DNS names. Exam static IP usually points to NLB."
      },
      {
        "id": "cs-8",
        "title": "TLS pass-through",
        "body": "NLB with TCP 443 can pass encrypted traffic to targets. The target decrypts. Use this when the app must handle TLS itself."
      },
      {
        "id": "cs-9",
        "title": "TLS termination",
        "body": "ALB can terminate HTTPS. NLB can also use TLS listeners. TCP listener keeps traffic encrypted to the target."
      },
      {
        "id": "cs-10",
        "title": "Security group reminder",
        "body": "Target security group must allow traffic. NLB can preserve client IP. For this lab, targets allow HTTP from anywhere."
      },
      {
        "id": "cs-11",
        "title": "Routing difference table",
        "body": "NeedChooseWhyHTTP path routingALBALB reads Layer 7 HTTP dataHost-based routingALBALB can route by host headerTCP or UDP trafficNLBNLB works at Layer 4Very high performanceNLBNLB is built for high throughputStatic IP per AZNLBNLB can use static IPsTLS pass-throughNLBTargets can decrypt trafficWAF integrationALBAWS WAF integrates with ALBContainer HTTP microservicesALBALB supports rich HTTP rules"
      },
      {
        "id": "cs-12",
        "title": "Distribution memory",
        "body": "NLB uses flow-based routing. One client may appear to hit one target. Use repeated connections to test distribution."
      },
      {
        "id": "cs-13",
        "title": "Cost memory",
        "body": "NLB costs money while active. EC2 instances also cost money. Delete the NLB before leaving the lab."
      },
      {
        "id": "cs-14",
        "title": "Common mistake",
        "body": "Wrong choice = using NLB for path routing. Correct choice = ALB for path routing. NLB does not inspect HTTP paths."
      },
      {
        "id": "cs-15",
        "title": "Cleanup order",
        "body": "OrderDeleteWhy1ListenerStops forwarding first2Network Load BalancerRemoves the paid load balancer3Target groupDelete after listener is gone4EC2 instancesRemoves test servers5Security groupDelete after instances release it6Local variables/filesClean your terminal only"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Run aws sts get-caller-identity. Check the exact permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "Targets stay unhealthy",
        "body": "Check the web server is running. Check security group port 80. Check the health check path is /."
      },
      {
        "id": "ts-3",
        "title": "NLB DNS does not load",
        "body": "Wait a few minutes. Check listener TCP 80. Check both targets are healthy."
      },
      {
        "id": "ts-4",
        "title": "Only one target appears",
        "body": "NLB routing is flow based. A single client may keep using one target. Test with repeated curl calls or new connections."
      },
      {
        "id": "ts-5",
        "title": "Target group delete fails",
        "body": "Delete the listener first. Delete the load balancer next. Wait until deletion completes, then delete the target group."
      },
      {
        "id": "ts-6",
        "title": "No default VPC",
        "body": "Create a small VPC first or use the previous VPC lab. This task assumes the default VPC for beginner setup."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1: NLB for path routing",
        "body": "Wrong: choose NLB for /api and /images routing. Correct: choose ALB because path routing is Layer 7."
      },
      {
        "id": "trap-2",
        "title": "Trap 2: ALB for UDP",
        "body": "Wrong: choose ALB for UDP traffic. Correct: choose NLB for UDP."
      },
      {
        "id": "trap-3",
        "title": "Trap 3: Static IP requirement",
        "body": "Wrong: choose ALB when the question demands static IPs. Correct: choose NLB when static IPs are required."
      },
      {
        "id": "trap-4",
        "title": "Trap 4: TLS pass-through",
        "body": "Wrong: choose ALB when targets must decrypt TLS themselves. Correct: choose NLB TCP listener for TLS pass-through."
      },
      {
        "id": "trap-5",
        "title": "Trap 5: Health check blame",
        "body": "Wrong: blame the load balancer first. Correct: check target port, security group, listener, and health path."
      },
      {
        "id": "trap-6",
        "title": "Trap 6: DNS not IP for ALB",
        "body": "ALB should be reached by DNS name. NLB is the better exam answer when fixed IPs are required."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "ALB reads the app. NLB moves the network. Use ALB for HTTP decisions. Use NLB for fast Layer 4 traffic.",
    "flashcardSetId": "elb_task_2_flashcards"
  },
  {
    "id": "task-saa-elb-create-a-gateway-load-balancer-style-architecture-003",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Create a Gateway Load Balancer style architecture",
    "slug": "create-a-gateway-load-balancer-style-architecture",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Build a safe concept lab that shows where Gateway Load Balancer fits, why it exists, and how traffic is steered through inspection appliances.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Gateway Load Balancer",
        "body": "Gateway Load Balancer = transparent inspection path. It helps insert firewalls, IDS, IPS, or deep packet inspection tools."
      },
      {
        "id": "concept-2",
        "title": "Why GWLB exists",
        "body": "GWLB exists because security appliances must scale. It avoids one firewall becoming a bottleneck."
      },
      {
        "id": "concept-3",
        "title": "GWLB architecture plan",
        "body": "PartExample namePurposeExam memoryWorkload subnetapp-private-aHolds app instancesTraffic may need inspectionGWLB endpointgwlb-endpoint-aEntry point to serviceRoutes privately to GWLBGWLBsaa-lbas-task3-gwlbDistributes appliance trafficLayer 3 gateway style load balancerAppliance target groupgeneve-tgFirewall appliance fleetUses GENEVE 6081Security applianceFirewall instanceInspects trafficUsually third-party virtual appliance"
      },
      {
        "id": "concept-4",
        "title": "GENEVE",
        "body": "GENEVE = tunnel protocol used by GWLB. GWLB sends traffic to appliances on port 6081."
      }
    ],
    "whyItMatters": "GWLB matters because inspection appliances need scale and high availability. For the exam, choose GWLB when traffic must pass through third-party network appliances without changing app logic.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Example VPC CIDR",
        "value": "10.70.0.0/16"
      },
      {
        "label": "Workload subnet",
        "value": "10.70.11.0/24"
      },
      {
        "label": "Inspection subnet",
        "value": "10.70.21.0/24"
      },
      {
        "label": "GWLB name",
        "value": "saa-lbas-task3-gwlb"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task3-geneve-tg"
      },
      {
        "label": "GENEVE port",
        "value": "6081"
      }
    ],
    "costWarning": "This concept lab is very low cost if you only plan and inspect existing settings. A real Gateway Load Balancer, endpoints, EC2 appliances, and data processing can create charges.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity GWLB read and planning: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeRouteTables, ec2:DescribeSecurityGroups Load balancer planning: elasticloadbalancing:DescribeLoadBalancers, elasticloadbalancing:DescribeTargetGroups, elasticloadbalancing:DescribeListeners Optional build actions: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener Optional cleanup: elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Open the VPC and EC2 areas",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Go to VPC and review your default VPC subnets."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Go to EC2 → Load Balancers."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Create load balancer."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Select Gateway Load Balancer."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Do not finish creation yet if you want a no-cost concept lab."
          }
        ],
        "note": "This task is a concept lab. You learn the architecture without needing a paid firewall appliance.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Review the GWLB choices",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Use name saa-lbas-task3-gwlb."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose the example VPC."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select one inspection subnet in each AZ."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Notice that GWLB is not an HTTP load balancer."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Notice that it uses appliance target groups."
          }
        ],
        "note": "Success: you can explain where the GWLB sits and why the appliance fleet is behind it.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Plan the route path",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC → Route tables."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Find the app subnet route table."
          },
          {
            "id": "console-step-4-item-3",
            "text": "In a real design, app traffic is routed to a Gateway Load Balancer endpoint."
          },
          {
            "id": "console-step-4-item-4",
            "text": "The endpoint sends traffic to the endpoint service and GWLB."
          },
          {
            "id": "console-step-4-item-5",
            "text": "The appliance returns inspected traffic back to the path."
          }
        ],
        "note": "Route tableDestinationTargetReasonApp subnet0.0.0.0/0GWLB endpointInspect outbound trafficInspection subnetAppliance trafficSecurity applianceRun firewall or IDSReturn pathOriginal destinationNormal routeComplete the flow",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Verify your understanding",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Say what GWLB is for in one sentence."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Say why ALB is not the right choice for packet inspection."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Say why NLB is not the same as GWLB."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Say why the route table matters."
          }
        ],
        "note": "Expected: GWLB is for scalable network appliance insertion.",
        "warning": null,
        "expectedResult": "Expected: GWLB is for scalable network appliance insertion."
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
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
            "text": "export AWS_REGION=eu-west-2\nexport GWLB_NAME=saa-lbas-task3-gwlb\nexport TG_NAME=saa-lbas-task3-geneve-tg"
          }
        ],
        "note": "These names are for planning or optional build testing.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Inspect VPCs and subnets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-vpcs --region $AWS_REGION --query 'Vpcs[*].[VpcId,CidrBlock,IsDefault]' --output table\naws ec2 describe-subnets --region $AWS_REGION --query 'Subnets[*].[SubnetId,VpcId,AvailabilityZone,CidrBlock]' --output table"
          }
        ],
        "note": "Expected: you see VPC and subnet IDs that could be used in a real design.",
        "warning": null,
        "expectedResult": "Expected: you see VPC and subnet IDs that could be used in a real design."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Check existing Gateway Load Balancers",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-load-balancers --region $AWS_REGION --query \"LoadBalancers[?Type=='gateway'].[LoadBalancerName,DNSName,State.Code]\" --output table"
          }
        ],
        "note": "Expected: you either see existing GWLBs or an empty result.",
        "warning": null,
        "expectedResult": "Expected: you either see existing GWLBs or an empty result."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Optional cleanup check",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-target-groups --region $AWS_REGION --query \"TargetGroups[?TargetGroupName=='$TG_NAME'].[TargetGroupName,Protocol,Port]\" --output table"
          }
        ],
        "note": "If you created optional resources separately, delete listeners, load balancer, then target group.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "GWLB purpose",
        "body": "GWLB = appliance insertion. Use it for firewalls, IDS, IPS, and packet inspection."
      },
      {
        "id": "cs-2",
        "title": "GWLB layer",
        "body": "GWLB works at Layer 3 and Layer 4 style traffic flow. It is not for HTTP path routing."
      },
      {
        "id": "cs-3",
        "title": "GENEVE rule",
        "body": "GWLB uses GENEVE. GENEVE uses port 6081."
      },
      {
        "id": "cs-4",
        "title": "GWLB vs ALB",
        "body": "ALB = HTTP and HTTPS app routing. GWLB = transparent network inspection."
      },
      {
        "id": "cs-5",
        "title": "GWLB vs NLB",
        "body": "NLB = ultra-fast TCP or UDP front door. GWLB = sends packets through appliances."
      },
      {
        "id": "cs-6",
        "title": "Appliance scaling",
        "body": "GWLB spreads traffic across appliance targets. This avoids one firewall becoming a choke point."
      },
      {
        "id": "cs-7",
        "title": "Endpoint service",
        "body": "PrivateLink can expose a GWLB service. Consumers connect using GWLB endpoints."
      },
      {
        "id": "cs-8",
        "title": "Route table memory",
        "body": "Traffic must be routed to the GWLB endpoint. No route means no inspection path."
      },
      {
        "id": "cs-9",
        "title": "Availability memory",
        "body": "GWLB should span multiple AZs. Appliances should also be in multiple AZs."
      },
      {
        "id": "cs-10",
        "title": "Common mistake",
        "body": "Do not choose ALB for packet inspection. ALB reads HTTP app traffic, not raw inspection flows."
      },
      {
        "id": "cs-11",
        "title": "Cost memory",
        "body": "GWLB, endpoints, appliances, and processed data can cost money. Delete real lab resources after testing."
      },
      {
        "id": "cs-12",
        "title": "Exam decision table",
        "body": "NeedBest choiceWhyHTTP path routingALBLayer 7 rulesStatic IP and TCPNLBLayer 4 performanceFirewall insertionGWLBAppliance traffic pathSimple EC2 scalingASGAdds or removes instances"
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No traffic reaches appliance",
        "body": "Check route tables. The app subnet must route traffic to the GWLB endpoint."
      },
      {
        "id": "ts-2",
        "title": "Targets unhealthy",
        "body": "Check appliance support for GENEVE. A normal web server is not enough for real GWLB inspection."
      },
      {
        "id": "ts-3",
        "title": "Wrong load balancer chosen",
        "body": "ALB and NLB do not replace GWLB for appliance insertion."
      },
      {
        "id": "ts-4",
        "title": "Asymmetric routing",
        "body": "Make sure forward and return traffic follow the expected inspection path."
      },
      {
        "id": "ts-5",
        "title": "AccessDenied",
        "body": "Check Console step 0 permissions and run aws sts get-caller-identity."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Choosing ALB for firewall insertion is wrong. Choose GWLB for appliance insertion."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "GWLB endpoints are part of the traffic path. Route tables must point to them."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "NLB is not the same as GWLB. NLB is not a transparent appliance gateway."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "One appliance instance is not highly available. Use multiple AZs and multiple targets."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "GWLB = Gateway for firewalls. Use it when traffic must pass through inspection appliances.",
    "flashcardSetId": "elb_task_3_flashcards"
  },
  {
    "id": "task-saa-elb-configure-alb-path-based-listener-rules-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Configure ALB path-based listener rules",
    "slug": "configure-alb-path-based-listener-rules",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an Application Load Balancer with two target groups and route /app1 and /app2 requests to different EC2 targets.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "ALB listener",
        "body": "A listener checks for requests on a port. For this lab, the listener uses HTTP port 80."
      },
      {
        "id": "concept-2",
        "title": "Listener rule",
        "body": "A rule checks conditions. Path rules look at the URL path, such as /app1."
      },
      {
        "id": "concept-3",
        "title": "Target group",
        "body": "A target group contains registered targets. The ALB forwards matching traffic to the selected group."
      },
      {
        "id": "concept-4",
        "title": "Path rule plan",
        "body": "PriorityPathActionTarget group10/app1*Forwardsaa-lbas-task4-app1-tg20/app2*Forwardsaa-lbas-task4-app2-tgDefaultAnything elseFixed response or app1Default action"
      }
    ],
    "whyItMatters": "Path-based routing lets one ALB route to many back-end services. For the exam, this is a common reason to choose ALB over NLB or Classic Load Balancer.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      },
      {
        "label": "ALB name",
        "value": "saa-lbas-task4-alb"
      },
      {
        "label": "Security group",
        "value": "saa-lbas-task4-alb-sg"
      },
      {
        "label": "Target group 1",
        "value": "saa-lbas-task4-app1-tg"
      },
      {
        "label": "Target group 2",
        "value": "saa-lbas-task4-app2-tg"
      },
      {
        "label": "Listener port",
        "value": "80"
      },
      {
        "label": "Path rules",
        "value": "/app1* and /app2*"
      }
    ],
    "costWarning": "This lab can create charges for the Application Load Balancer, EC2 instances, data transfer, and storage. Delete resources after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 setup: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:RunInstances, ec2:TerminateInstances, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup Load balancing: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:RegisterTargets, elasticloadbalancing:CreateListener, elasticloadbalancing:CreateRule, elasticloadbalancing:DescribeTargetHealth Cleanup: elasticloadbalancing:DeleteRule, elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create two web instances",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 → Instances."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Launch two Amazon Linux instances in the default VPC."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Put them in two public subnets if possible."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Use user data so one instance returns app1 and the other returns app2."
          }
        ],
        "note": "Use simple test instances only. Do not use production data.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create two target groups",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2 → Target Groups."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Create saa-lbas-task4-app1-tg."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Use target type Instances."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Protocol: HTTP. Port: 80."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Register the app1 instance."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Create saa-lbas-task4-app2-tg and register the app2 instance."
          }
        ],
        "note": "Success: each target group has one healthy target.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the ALB",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 → Load Balancers."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create load balancer."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Application Load Balancer."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Name it saa-lbas-task4-alb."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Scheme: Internet-facing."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Select at least two public subnets."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Create or select a security group allowing HTTP 80 from your IP or 0.0.0.0/0 for a short lab."
          }
        ],
        "note": null,
        "warning": "For real systems, restrict sources where possible.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Add path-based listener rules",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the ALB."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Listeners and rules tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Open listener HTTP:80."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Add rule priority 10 for path /app1*."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Forward it to saa-lbas-task4-app1-tg."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Add rule priority 20 for path /app2*."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Forward it to saa-lbas-task4-app2-tg."
          }
        ],
        "note": "PriorityPathActionTarget group10/app1*Forwardsaa-lbas-task4-app1-tg20/app2*Forwardsaa-lbas-task4-app2-tgDefaultAnything elseFixed response or app1Default action",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Verify routing",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Copy the ALB DNS name."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Open http://ALB-DNS/app1."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Expected: app1 page appears."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Open http://ALB-DNS/app2."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Expected: app2 page appears."
          }
        ],
        "note": "If both paths show the same app, check rule priority and target group selection.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Delete listener rules first."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete the ALB."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete target groups."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Terminate EC2 instances."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete security groups if not in use."
          }
        ],
        "note": null,
        "warning": "Wait until the ALB is fully deleted before deleting its security group.",
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
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
            "text": "export AWS_REGION=eu-west-2\nexport NAME=saa-lbas-task4\nexport VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nexport SUBNETS=$(aws ec2 describe-subnets --region $AWS_REGION --filters Name=vpc-id,Values=$VPC_ID Name=default-for-az,Values=true --query 'Subnets[0:2].SubnetId' --output text)\necho \"VPC=$VPC_ID\"\necho \"SUBNETS=$SUBNETS\""
          }
        ],
        "note": "Expected: you see the default VPC and two subnet IDs.",
        "warning": null,
        "expectedResult": "Expected: you see the default VPC and two subnet IDs."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create a security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "export SG_ID=$(aws ec2 create-security-group --region $AWS_REGION --group-name ${NAME}-sg --description 'ALB path routing lab' --vpc-id $VPC_ID --query 'GroupId' --output text)\naws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0\necho $SG_ID"
          }
        ],
        "note": "Expected: the security group allows HTTP for testing.",
        "warning": null,
        "expectedResult": "Expected: the security group allows HTTP for testing."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create two target groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "export TG1_ARN=$(aws elbv2 create-target-group --region $AWS_REGION --name ${NAME}-app1-tg --protocol HTTP --port 80 --vpc-id $VPC_ID --target-type instance --query 'TargetGroups[0].TargetGroupArn' --output text)\nexport TG2_ARN=$(aws elbv2 create-target-group --region $AWS_REGION --name ${NAME}-app2-tg --protocol HTTP --port 80 --vpc-id $VPC_ID --target-type instance --query 'TargetGroups[0].TargetGroupArn' --output text)\necho $TG1_ARN\necho $TG2_ARN"
          }
        ],
        "note": "Target groups exist but need registered instances.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create ALB and listener",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "export ALB_ARN=$(aws elbv2 create-load-balancer --region $AWS_REGION --name ${NAME}-alb --subnets $SUBNETS --security-groups $SG_ID --scheme internet-facing --type application --query 'LoadBalancers[0].LoadBalancerArn' --output text)\nexport LISTENER_ARN=$(aws elbv2 create-listener --region $AWS_REGION --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG1_ARN --query 'Listeners[0].ListenerArn' --output text)\necho $ALB_ARN\necho $LISTENER_ARN"
          }
        ],
        "note": "Expected: ALB and listener ARNs are returned.",
        "warning": null,
        "expectedResult": "Expected: ALB and listener ARNs are returned."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create path rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws elbv2 create-rule --region $AWS_REGION --listener-arn $LISTENER_ARN --priority 10 --conditions Field=path-pattern,Values='/app1*' --actions Type=forward,TargetGroupArn=$TG1_ARN\naws elbv2 create-rule --region $AWS_REGION --listener-arn $LISTENER_ARN --priority 20 --conditions Field=path-pattern,Values='/app2*' --actions Type=forward,TargetGroupArn=$TG2_ARN"
          }
        ],
        "note": "Expected: two rules are created with different priorities.",
        "warning": null,
        "expectedResult": "Expected: two rules are created with different priorities."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Verify listener rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-rules --region $AWS_REGION --listener-arn $LISTENER_ARN --query 'Rules[*].[Priority,Conditions[0].Values[0],Actions[0].TargetGroupArn]' --output table\naws elbv2 describe-load-balancers --region $AWS_REGION --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].DNSName' --output text"
          }
        ],
        "note": "Use the DNS name with /app1 and /app2 after targets are healthy.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws elbv2 delete-load-balancer --region $AWS_REGION --load-balancer-arn $ALB_ARN\nsleep 60\naws elbv2 delete-target-group --region $AWS_REGION --target-group-arn $TG1_ARN\naws elbv2 delete-target-group --region $AWS_REGION --target-group-arn $TG2_ARN\naws ec2 delete-security-group --region $AWS_REGION --group-id $SG_ID"
          }
        ],
        "note": null,
        "warning": "Only run cleanup when you are finished. Terminate any test instances you launched.",
        "expectedResult": "CLI command step 8 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ALB path routing",
        "body": "ALB = path routing. Use paths like /api, /images, or /app1."
      },
      {
        "id": "cs-2",
        "title": "Listener rule priority",
        "body": "ALB checks rules by priority. Lower number means higher priority."
      },
      {
        "id": "cs-3",
        "title": "Default action",
        "body": "ALB needs a default action. Default catches traffic that matches no rule."
      },
      {
        "id": "cs-4",
        "title": "Target group memory",
        "body": "Target group = destination pool. Each app can have its own target group."
      },
      {
        "id": "cs-5",
        "title": "Health checks",
        "body": "ALB forwards only to healthy targets. Bad health checks cause 503 errors."
      },
      {
        "id": "cs-6",
        "title": "Path pattern trap",
        "body": "Use /app1* to match /app1 and subpaths. Wrong pattern can miss traffic."
      },
      {
        "id": "cs-7",
        "title": "ALB vs NLB",
        "body": "ALB = Layer 7 HTTP decisions. NLB = Layer 4 TCP or UDP forwarding."
      },
      {
        "id": "cs-8",
        "title": "ALB vs GWLB",
        "body": "ALB routes app requests. GWLB inserts inspection appliances."
      },
      {
        "id": "cs-9",
        "title": "Rule table",
        "body": "PriorityPathActionTarget group10/app1*Forwardsaa-lbas-task4-app1-tg20/app2*Forwardsaa-lbas-task4-app2-tgDefaultAnything elseFixed response or app1Default action"
      },
      {
        "id": "cs-10",
        "title": "Security group memory",
        "body": "ALB security group allows client traffic. Instance security group should allow traffic from the ALB security group."
      },
      {
        "id": "cs-11",
        "title": "Cost cleanup",
        "body": "ALB has hourly and usage costs. Delete ALB and EC2 test instances after the lab."
      },
      {
        "id": "cs-12",
        "title": "Troubleshooting memory",
        "body": "Wrong app shown = check rule priority. 503 error = check target health. Timeout = check security groups."
      },
      {
        "id": "cs-13",
        "title": "Exam wording",
        "body": "Question says URL path, microservices, HTTP headers, or host names. Think Application Load Balancer."
      },
      {
        "id": "cs-14",
        "title": "DVA memory",
        "body": "Developers often use ALB rules to route API paths. One DNS name can front many services."
      },
      {
        "id": "cs-15",
        "title": "SOA memory",
        "body": "Operators verify listener rules, target health, and security groups."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "503 Service Unavailable",
        "body": "The target group has no healthy targets. Check health check path, port, and security groups."
      },
      {
        "id": "ts-2",
        "title": "Wrong app responds",
        "body": "Check listener rule priority and path pattern."
      },
      {
        "id": "ts-3",
        "title": "Connection timeout",
        "body": "Check ALB security group inbound HTTP and instance security group inbound from ALB."
      },
      {
        "id": "ts-4",
        "title": "Rule not created",
        "body": "Priorities must be unique on the same listener."
      },
      {
        "id": "ts-5",
        "title": "AccessDenied",
        "body": "Check Console step 0 permissions and run aws sts get-caller-identity."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "NLB cannot do HTTP path routing. Choose ALB."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Listener rules need priority. Duplicate priorities fail."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Unhealthy targets cause ALB errors. The rule can be correct but the app still fails."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Security groups matter on both ALB and EC2 targets."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "ALB reads the URL. If the exam says path, host, or HTTP, think ALB.",
    "flashcardSetId": "elb_task_4_flashcards"
  },
  {
    "id": "task-saa-elb-add-https-to-an-alb-and-redirect-http-008",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Add HTTPS to an ALB and redirect HTTP",
    "slug": "add-https-to-an-alb-and-redirect-http",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Request an ACM certificate, add an HTTPS listener to an Application Load Balancer, and redirect HTTP traffic to HTTPS.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "TLS termination",
        "body": "TLS termination means HTTPS stops at the ALB. The ALB decrypts the request. The ALB can forward HTTP to targets inside the VPC."
      },
      {
        "id": "concept-2",
        "title": "ACM certificate",
        "body": "ACM provides certificates for AWS services. For public HTTPS, validate domain ownership. DNS validation is the easiest long-term method."
      },
      {
        "id": "concept-3",
        "title": "Listener and redirect plan",
        "body": "ListenerPortActionReasonHTTP80Redirect to HTTPSForce encrypted entryHTTPS443Forward to target groupServe app securelyTarget group80Receive HTTPTLS ends at ALB"
      }
    ],
    "whyItMatters": "HTTPS protects traffic from users to the load balancer. Redirecting HTTP to HTTPS avoids users staying on an unencrypted URL.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      },
      {
        "label": "ALB name",
        "value": "saa-lbas-task-8-alb"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task-8-tg"
      },
      {
        "label": "ASG name",
        "value": "saa-lbas-task-8-asg"
      },
      {
        "label": "Certificate domain",
        "value": "app.example.com"
      },
      {
        "label": "HTTP listener",
        "value": "Port 80 redirect to HTTPS"
      },
      {
        "label": "HTTPS listener",
        "value": "Port 443 forward to target group"
      }
    ],
    "costWarning": "This lab can create ALB, EC2, Route 53, and DNS-related charges. ACM public certificates used with integrated AWS services do not add a separate certificate charge, but the load balancer and hosted zone can cost money.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity ACM certificate: acm:RequestCertificate, acm:DescribeCertificate, acm:ListCertificates, acm:DeleteCertificate Route 53 DNS validation: route53:ListHostedZones, route53:ChangeResourceRecordSets, route53:GetChange, route53:ListResourceRecordSets Load balancer: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:ModifyListener, elasticloadbalancing:DescribeListeners, elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup EC2 setup: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:RunInstances, ec2:TerminateInstances, ec2:DescribeInstances Launch template and Auto Scaling: ec2:CreateLaunchTemplate, ec2:DeleteLaunchTemplate, autoscaling:CreateAutoScalingGroup, autoscaling:DeleteAutoScalingGroup, autoscaling:DescribeAutoScalingGroups",
        "warning": "Do not use the AWS root user. Do not request certificates for domains you do not own.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Prepare a domain name",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Use a domain you own, such as example.com."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create or use a Route 53 public hosted zone for the domain."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose a lab name such as app.example.com."
          },
          {
            "id": "console-step-2-item-4",
            "text": "This lab uses app.example.com as the example value."
          }
        ],
        "note": null,
        "warning": "ACM DNS validation requires control of the domain DNS records.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Request an ACM certificate",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open AWS Certificate Manager."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Make sure the Region is eu-west-2."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Request certificate."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Request a public certificate."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Enter app.example.com or your real lab domain."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose DNS validation."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Request the certificate."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Create the DNS validation record in Route 53 when prompted."
          },
          {
            "id": "console-step-3-item-9",
            "text": "Wait until status is Issued."
          }
        ],
        "note": "The certificate must be in the same Region as the ALB.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create security groups",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Create saa-lbas-task-8-alb-sg."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Allow inbound HTTP 80 from 0.0.0.0/0."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Allow inbound HTTPS 443 from 0.0.0.0/0."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Create saa-lbas-task-8-instance-sg."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Allow inbound HTTP 80 from the ALB security group."
          }
        ],
        "note": "The app instances do not need public HTTPS when TLS terminates at the ALB.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create target group, ALB, and ASG",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Create a target group named saa-lbas-task-8-tg using HTTP port 80."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Create an internet-facing Application Load Balancer named saa-lbas-task-8-alb."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select at least two default subnets."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Attach saa-lbas-task-8-alb-sg."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Create a launch template with Amazon Linux 2023 and Apache user data."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Create ASG saa-lbas-task-8-asg with desired capacity 2."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Attach the target group to the ASG."
          }
        ],
        "note": "Example user data: #!/bin/bash dnf install -y httpd systemctl enable --now httpd echo HTTPS lab target > /var/www/html/index.html",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the HTTPS listener",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the ALB."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Listeners and rules."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Add listener."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Protocol: HTTPS."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Port: 443."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose the ACM certificate for app.example.com."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Use the recommended security policy."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Default action: forward to saa-lbas-task-8-tg."
          }
        ],
        "note": "HTTPS listener = TLS is handled by the ALB.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Create the HTTP to HTTPS redirect",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the ALB listener for HTTP : 80."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Edit the default action."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Choose Redirect to URL."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Protocol: HTTPS."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Port: 443."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Status code: HTTP_301."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Save changes."
          }
        ],
        "note": "Success means HTTP requests are redirected to HTTPS instead of being forwarded directly.",
        "warning": null,
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Create DNS alias record",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open Route 53."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Open your hosted zone."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Create an A record for app.example.com."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Turn on Alias."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Choose alias target: the Application Load Balancer."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Save the record."
          }
        ],
        "note": "DNS can take time to update.",
        "warning": null,
        "expectedResult": "Step 8 completed successfully."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Verify HTTPS and redirect",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Open http://app.example.com."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Confirm the browser changes to https://app.example.com."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Open the certificate details in the browser."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Confirm the certificate is trusted and matches your domain."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Refresh a few times and confirm the app page loads."
          }
        ],
        "note": null,
        "warning": "Use your real domain name, not example.com, for the actual test.",
        "expectedResult": "Step 9 completed successfully."
      },
      {
        "id": "console-step-10",
        "number": 10,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-10-item-1",
            "text": "Delete the Route 53 alias record for the ALB."
          },
          {
            "id": "console-step-10-item-2",
            "text": "Delete the HTTP listener or redirect rule."
          },
          {
            "id": "console-step-10-item-3",
            "text": "Delete the HTTPS listener."
          },
          {
            "id": "console-step-10-item-4",
            "text": "Set ASG desired, minimum, and maximum capacity to 0."
          },
          {
            "id": "console-step-10-item-5",
            "text": "Delete the Auto Scaling Group."
          },
          {
            "id": "console-step-10-item-6",
            "text": "Delete the ALB."
          },
          {
            "id": "console-step-10-item-7",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-10-item-8",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-10-item-9",
            "text": "Delete security groups."
          },
          {
            "id": "console-step-10-item-10",
            "text": "Delete the ACM certificate if you no longer need it."
          }
        ],
        "note": null,
        "warning": "Do not delete the ACM certificate while it is still attached to the HTTPS listener.",
        "expectedResult": "Step 10 completed successfully."
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
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
            "text": "export AWS_REGION=eu-west-2\nexport DOMAIN_NAME=app.example.com\nexport ALB_NAME=saa-lbas-task-8-alb\nexport TG_NAME=saa-lbas-task-8-tg\nexport ASG_NAME=saa-lbas-task-8-asg\nexport LT_NAME=saa-lbas-task-8-lt\nexport VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nexport SUBNETS_CSV=$(aws ec2 describe-subnets --region $AWS_REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text | tr '\\t' ',')\nexport SUBNETS_SPACE=$(echo $SUBNETS_CSV | tr ',' ' ')"
          }
        ],
        "note": null,
        "warning": "Replace app.example.com with a domain you own.",
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Request ACM certificate",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "export CERT_ARN=$(aws acm request-certificate --region $AWS_REGION --domain-name $DOMAIN_NAME --validation-method DNS --query CertificateArn --output text)\naws acm describe-certificate --region $AWS_REGION --certificate-arn $CERT_ARN --query 'Certificate.DomainValidationOptions[0].ResourceRecord'"
          }
        ],
        "note": "Create the returned DNS validation record in Route 53, then wait for the certificate to become ISSUED.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create security groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "export ALB_SG=$(aws ec2 create-security-group --region $AWS_REGION --group-name saa-lbas-task-8-alb-sg --description 'Task 8 ALB SG' --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0\naws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $ALB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0\nexport INSTANCE_SG=$(aws ec2 create-security-group --region $AWS_REGION --group-name saa-lbas-task-8-instance-sg --description 'Task 8 instance SG' --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $INSTANCE_SG --protocol tcp --port 80 --source-group $ALB_SG"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create target group and ALB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "export TG_ARN=$(aws elbv2 create-target-group --region $AWS_REGION --name $TG_NAME --protocol HTTP --port 80 --vpc-id $VPC_ID --health-check-path / --target-type instance --query 'TargetGroups[0].TargetGroupArn' --output text)\nexport ALB_ARN=$(aws elbv2 create-load-balancer --region $AWS_REGION --name $ALB_NAME --subnets $SUBNETS_SPACE --security-groups $ALB_SG --scheme internet-facing --type application --query 'LoadBalancers[0].LoadBalancerArn' --output text)\nexport ALB_DNS=$(aws elbv2 describe-load-balancers --region $AWS_REGION --load-balancer-arns $ALB_ARN --query 'LoadBalancers[0].DNSName' --output text)\necho $ALB_DNS"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create HTTP redirect and HTTPS listener",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "export HTTPS_LISTENER_ARN=$(aws elbv2 create-listener --region $AWS_REGION --load-balancer-arn $ALB_ARN --protocol HTTPS --port 443 --certificates CertificateArn=$CERT_ARN --default-actions Type=forward,TargetGroupArn=$TG_ARN --query 'Listeners[0].ListenerArn' --output text)\nexport HTTP_LISTENER_ARN=$(aws elbv2 create-listener --region $AWS_REGION --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions 'Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301}' --query 'Listeners[0].ListenerArn' --output text)"
          }
        ],
        "note": "This requires the ACM certificate to be issued.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Create launch template and ASG",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "cat > /tmp/task8-user-data.sh <<'EOF'\n#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\necho 'HTTPS lab target' > /var/www/html/index.html\nEOF\nexport AMI_ID=$(aws ec2 describe-images --region $AWS_REGION --owners amazon --filters 'Name=name,Values=al2023-ami-*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)\naws ec2 create-launch-template --region $AWS_REGION --launch-template-name $LT_NAME --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI_ID\\\",\\\"InstanceType\\\":\\\"t3.micro\\\",\\\"SecurityGroupIds\\\":[\\\"$INSTANCE_SG\\\"],\\\"UserData\\\":\\\"$(base64 -w0 /tmp/task8-user-data.sh)\\\"}\"\naws autoscaling create-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --launch-template LaunchTemplateName=$LT_NAME,Version='$Latest' --min-size 2 --max-size 2 --desired-capacity 2 --vpc-zone-identifier $SUBNETS_CSV --target-group-arns $TG_ARN --health-check-type ELB --health-check-grace-period 300"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Verify listeners",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-listeners --region $AWS_REGION --load-balancer-arn $ALB_ARN --query 'Listeners[].{Port:Port,Protocol:Protocol,DefaultActions:DefaultActions}'\naws acm describe-certificate --region $AWS_REGION --certificate-arn $CERT_ARN --query 'Certificate.Status'"
          }
        ],
        "note": "Expected: listeners on ports 80 and 443, and certificate status ISSUED.",
        "warning": null,
        "expectedResult": "Expected: listeners on ports 80 and 443, and certificate status ISSUED."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws autoscaling update-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --min-size 0 --max-size 0 --desired-capacity 0\naws autoscaling delete-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --force-delete\naws elbv2 delete-listener --region $AWS_REGION --listener-arn $HTTP_LISTENER_ARN || true\naws elbv2 delete-listener --region $AWS_REGION --listener-arn $HTTPS_LISTENER_ARN || true\naws elbv2 delete-load-balancer --region $AWS_REGION --load-balancer-arn $ALB_ARN\nsleep 60\naws elbv2 delete-target-group --region $AWS_REGION --target-group-arn $TG_ARN\naws ec2 delete-launch-template --region $AWS_REGION --launch-template-name $LT_NAME\naws ec2 delete-security-group --region $AWS_REGION --group-id $INSTANCE_SG\naws ec2 delete-security-group --region $AWS_REGION --group-id $ALB_SG\n# Delete the ACM certificate only after listeners are removed.\n# aws acm delete-certificate --region $AWS_REGION --certificate-arn $CERT_ARN\nrm -f /tmp/task8-user-data.sh"
          }
        ],
        "note": null,
        "warning": "Also delete Route 53 alias and validation records if you created them only for this lab.",
        "expectedResult": "CLI command step 9 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ALB HTTPS memory",
        "body": "ALB HTTPS = listener on port 443. ACM certificate attaches to the listener. Targets can still use HTTP."
      },
      {
        "id": "cs-2",
        "title": "TLS termination",
        "body": "TLS termination = decrypt at the ALB. User to ALB is HTTPS. ALB to target can be HTTP or HTTPS."
      },
      {
        "id": "cs-3",
        "title": "ACM Region rule",
        "body": "ACM certificate must be in the ALB Region. For CloudFront, certificate must be in us-east-1. This lab uses ALB in eu-west-2."
      },
      {
        "id": "cs-4",
        "title": "DNS validation",
        "body": "DNS validation proves domain ownership. Route 53 can create records easily. Validation can take time."
      },
      {
        "id": "cs-5",
        "title": "HTTP redirect",
        "body": "HTTP listener on 80 can redirect. Redirect to HTTPS port 443. Use HTTP_301 for permanent redirect."
      },
      {
        "id": "cs-6",
        "title": "Security group rule",
        "body": "ALB SG allows ports 80 and 443. Instance SG allows port 80 from ALB SG. Do not expose app instances directly."
      },
      {
        "id": "cs-7",
        "title": "Certificate name trap",
        "body": "Certificate common name must match the browser name. Use SANs for extra names. Mismatch causes browser warning."
      },
      {
        "id": "cs-8",
        "title": "Target group port",
        "body": "Target group can use HTTP 80. HTTPS is handled at the ALB. This is common for private app targets."
      },
      {
        "id": "cs-9",
        "title": "End-to-end encryption",
        "body": "End-to-end encryption means HTTPS to targets too. Use HTTPS target group if required. More setup is needed on instances."
      },
      {
        "id": "cs-10",
        "title": "Listener priority",
        "body": "Default HTTP listener can redirect all traffic. HTTPS listener forwards traffic. Rules are evaluated by priority."
      },
      {
        "id": "cs-11",
        "title": "Verification memory",
        "body": "Check certificate status first. Check listeners second. Check browser redirect last."
      },
      {
        "id": "cs-12",
        "title": "Cleanup memory",
        "body": "Remove listeners before certificate deletion. Delete ALB before target group. Delete DNS records if lab-only."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check Console step 0 permissions. Confirm identity with aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Certificate stuck pending",
        "body": "DNS validation record is missing or wrong. Check the CNAME value in Route 53."
      },
      {
        "id": "ts-3",
        "title": "HTTPS listener cannot be created",
        "body": "The ACM certificate may not be issued, or it may be in the wrong Region."
      },
      {
        "id": "ts-4",
        "title": "Browser certificate warning",
        "body": "The domain name does not match the certificate, or DNS points to the wrong ALB."
      },
      {
        "id": "ts-5",
        "title": "Targets unhealthy",
        "body": "Check instance security group, user data, target group port, and health check path."
      },
      {
        "id": "ts-6",
        "title": "HTTP does not redirect",
        "body": "Check the HTTP listener default action. It should be redirect, not forward."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "ACM Region trap",
        "body": "Wrong choice: use any ACM certificate in any Region. Correct idea: ALB needs certificate in the same Region."
      },
      {
        "id": "trap-2",
        "title": "TLS termination trap",
        "body": "Wrong choice: HTTPS to ALB means HTTPS to targets automatically. Correct idea: target protocol is configured separately."
      },
      {
        "id": "trap-3",
        "title": "Redirect trap",
        "body": "Wrong choice: security group redirect HTTP to HTTPS. Correct idea: ALB listener rule performs redirect."
      },
      {
        "id": "trap-4",
        "title": "Domain trap",
        "body": "Wrong choice: use ALB DNS name with custom certificate. Correct idea: use a domain name matching the certificate."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "ACM proves the name. ALB holds the cert. HTTP redirects to HTTPS. That is the common AWS web TLS pattern.",
    "flashcardSetId": "elb_task_8_flashcards"
  },
  {
    "id": "task-saa-elb-sticky-sessions-on-an-alb-target-group-009",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Sticky Sessions on an ALB target group",
    "slug": "sticky-sessions-on-an-alb-target-group",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Enable target group stickiness on an Application Load Balancer and test that one client keeps returning to the same target.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Stickiness",
        "body": "Stickiness keeps one client tied to the same target for a time period."
      },
      {
        "id": "concept-2",
        "title": "ALB cookie",
        "body": "ALB stickiness uses a load balancer generated cookie. The cookie helps the ALB remember the chosen target."
      },
      {
        "id": "concept-3",
        "title": "Target group scope",
        "body": "Stickiness is configured on the target group. It is not enabled on the instance."
      },
      {
        "id": "concept-4",
        "title": "Sticky session plan",
        "body": "ItemValueReasonALBInternet-facingEasy browser testingTarget groupHTTP port 80Web target testingStickinessEnabledKeep repeat requests on same targetDuration300 secondsShort lab test windowTargetsTwo EC2 instancesShow which target answers"
      }
    ],
    "whyItMatters": "Sticky sessions help stateful apps. They are useful when session data is stored on one server. They are less ideal than external session storage.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      },
      {
        "label": "ALB name",
        "value": "saa-lbas-task-9-alb"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task-9-tg"
      },
      {
        "label": "Security group",
        "value": "saa-lbas-task-9-sg"
      },
      {
        "label": "Stickiness duration",
        "value": "300 seconds"
      },
      {
        "label": "HTTP port",
        "value": "80"
      }
    ],
    "costWarning": "This lab can create EC2 and Application Load Balancer charges. Delete the load balancer, target group, instances, and security group after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 discovery: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:DescribeImages, ec2:DescribeInstances EC2 setup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:RunInstances, ec2:CreateTags, ec2:TerminateInstances Load balancer setup: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:RegisterTargets Target group changes: elasticloadbalancing:ModifyTargetGroupAttributes, elasticloadbalancing:DescribeTargetGroups, elasticloadbalancing:DescribeTargetHealth, elasticloadbalancing:DescribeLoadBalancers CloudWatch checks: cloudwatch:GetMetricData, cloudwatch:ListMetrics Cleanup: elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a security group",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Go to Network & Security → Security Groups."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-lbas-task-9-sg."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Add inbound HTTP 80 from 0.0.0.0/0."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Add inbound SSH 22 from your IP only if you need SSH."
          }
        ],
        "note": "HTTP is open only for testing the ALB and instances.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Launch two web instances",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2 → Instances."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Launch two Amazon Linux instances in two public subnets."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach saa-lbas-task-9-sg."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Use user data that prints the instance ID or hostname on the web page."
          }
        ],
        "note": "Success: each instance returns a different page value.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the target group",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 → Load Balancing → Target Groups."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create target group."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Protocol: HTTP. Port: 80."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Name it saa-lbas-task-9-tg."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Register both web instances."
          }
        ],
        "note": "Wait until both targets become healthy.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Enable sticky sessions",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the target group."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Attributes tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Enable Stickiness."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Set duration to 300 seconds."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Save changes."
          }
        ],
        "note": "Stickiness uses a cookie so the same browser often reaches the same target.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the ALB",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open EC2 → Load Balancers."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Create load balancer."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Application Load Balancer."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Name it saa-lbas-task-9-alb."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Scheme: Internet-facing."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose two public subnets."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Attach saa-lbas-task-9-sg."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Create an HTTP listener forwarding to saa-lbas-task-9-tg."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Test sticky behaviour",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the ALB DNS name in a browser."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Refresh several times."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Use the same browser session."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Confirm the same instance usually answers."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Open an incognito window or clear cookies."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Confirm another target may answer."
          }
        ],
        "note": "Expected: one client tends to stay on one target until the cookie expires.",
        "warning": null,
        "expectedResult": "Expected: one client tends to stay on one target until the cookie expires."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Delete the ALB listener."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Delete the ALB."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Wait until the ALB is deleted."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Terminate both EC2 instances."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Delete saa-lbas-task-9-sg."
          }
        ],
        "note": null,
        "warning": "Delete the load balancer to stop hourly charges.",
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
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
            "text": "REGION=eu-west-2\nNAME=saa-lbas-task-9\nVPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=is-default,Values=true --query \"Vpcs[0].VpcId\" --output text)\nSUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID Name=default-for-az,Values=true --query \"Subnets[0:2].SubnetId\" --output text)\necho $VPC_ID $SUBNETS"
          }
        ],
        "note": "Expected: one default VPC ID and two subnet IDs.",
        "warning": null,
        "expectedResult": "Expected: one default VPC ID and two subnet IDs."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name ${NAME}-sg --description \"Task 9 ALB stickiness SG\" --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0\necho $SG_ID"
          }
        ],
        "note": "Expected: security group ID.",
        "warning": null,
        "expectedResult": "Expected: security group ID."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create target group and enable stickiness",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "TG_ARN=$(aws elbv2 create-target-group --region $REGION --name ${NAME}-tg --protocol HTTP --port 80 --vpc-id $VPC_ID --target-type instance --query TargetGroups[0].TargetGroupArn --output text)\naws elbv2 modify-target-group-attributes --region $REGION --target-group-arn $TG_ARN --attributes Key=stickiness.enabled,Value=true Key=stickiness.lb_cookie.duration_seconds,Value=300\necho $TG_ARN"
          }
        ],
        "note": "This creates the target group and enables ALB cookie stickiness.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create the ALB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "ALB_ARN=$(aws elbv2 create-load-balancer --region $REGION --name ${NAME}-alb --type application --scheme internet-facing --security-groups $SG_ID --subnets $SUBNETS --query LoadBalancers[0].LoadBalancerArn --output text)\naws elbv2 wait load-balancer-available --region $REGION --load-balancer-arns $ALB_ARN\nLISTENER_ARN=$(aws elbv2 create-listener --region $REGION --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG_ARN --query Listeners[0].ListenerArn --output text)\nALB_DNS=$(aws elbv2 describe-load-balancers --region $REGION --load-balancer-arns $ALB_ARN --query LoadBalancers[0].DNSName --output text)\necho http://$ALB_DNS"
          }
        ],
        "note": "Register instances after you launch them, or use the Console for the instance step.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify stickiness attributes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-target-group-attributes --region $REGION --target-group-arn $TG_ARN --query \"Attributes[?starts_with(Key, 'stickiness')]\""
          }
        ],
        "note": "Expected: stickiness is enabled and duration is 300 seconds.",
        "warning": null,
        "expectedResult": "Expected: stickiness is enabled and duration is 300 seconds."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws elbv2 delete-listener --region $REGION --listener-arn $LISTENER_ARN\naws elbv2 delete-load-balancer --region $REGION --load-balancer-arn $ALB_ARN\nsleep 30\naws elbv2 delete-target-group --region $REGION --target-group-arn $TG_ARN\naws ec2 delete-security-group --region $REGION --group-id $SG_ID"
          }
        ],
        "note": null,
        "warning": "Terminate any EC2 instances you launched before deleting the security group if deletion fails.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ALB stickiness",
        "body": "ALB stickiness = keeps a client on the same target. Target group = where stickiness is enabled."
      },
      {
        "id": "cs-2",
        "title": "Cookie memory",
        "body": "ALB cookie = remembers the selected target. Browser refresh = same cookie is reused."
      },
      {
        "id": "cs-3",
        "title": "Best use case",
        "body": "Stickiness = useful for stateful apps. Better design = store sessions outside the instance."
      },
      {
        "id": "cs-4",
        "title": "Exam warning",
        "body": "Stickiness can reduce even traffic spread. It favours session continuity over perfect balance."
      },
      {
        "id": "cs-5",
        "title": "Target group setting",
        "body": "Stickiness is a target group attribute. It is not an EC2 setting."
      },
      {
        "id": "cs-6",
        "title": "Duration",
        "body": "Duration = how long the cookie stays useful. Shorter duration = faster rebalance."
      },
      {
        "id": "cs-7",
        "title": "Health checks",
        "body": "ALB still needs healthy targets. Sticky clients should not be sent to unhealthy targets."
      },
      {
        "id": "cs-8",
        "title": "Scaling trap",
        "body": "New instances may receive less traffic at first. Old sticky clients stay with old targets."
      },
      {
        "id": "cs-9",
        "title": "Stateless design",
        "body": "Stateless app = no stickiness needed. Stateful app = stickiness may help."
      },
      {
        "id": "cs-10",
        "title": "Testing reminder",
        "body": "Same browser = same cookie. Incognito browser = new cookie test."
      },
      {
        "id": "cs-11",
        "title": "Cost memory",
        "body": "ALB has hourly cost. EC2 instances also cost money."
      },
      {
        "id": "cs-12",
        "title": "Cleanup memory",
        "body": "Delete listener first. Delete ALB next. Delete target group after ALB is gone."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check Console step 0 permissions and run aws sts get-caller-identity."
      },
      {
        "id": "ts-2",
        "title": "Targets unhealthy",
        "body": "Check security group inbound port 80, instance web server, and target group health path."
      },
      {
        "id": "ts-3",
        "title": "Stickiness seems broken",
        "body": "Use the same browser session. Do not clear cookies between tests."
      },
      {
        "id": "ts-4",
        "title": "Only one target answers",
        "body": "That may be expected with stickiness. Test with another browser or wait for cookie expiry."
      },
      {
        "id": "ts-5",
        "title": "Security group will not delete",
        "body": "Terminate instances and delete the ALB before deleting the security group."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: stickiness gives perfect load balance. Correct: stickiness can make distribution uneven."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: stickiness stores app sessions. Correct: it only keeps routing to the same target."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: enable stickiness on EC2. Correct: enable it on the target group."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Wrong: stickiness replaces shared session storage. Correct: DynamoDB, ElastiCache, or external storage is often better."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "Sticky = same customer, same waiter. The ALB remembers where to send the client.",
    "flashcardSetId": "elb_task_9_flashcards"
  },
  {
    "id": "task-saa-elb-cross-zone-load-balancing-traffic-distribution-010",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Cross-Zone Load Balancing traffic distribution",
    "slug": "cross-zone-load-balancing-traffic-distribution",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Enable and disable cross-zone load balancing where supported and observe how traffic spreads across Availability Zones.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Cross-zone load balancing",
        "body": "Cross-zone load balancing lets each load balancer node send traffic to targets in multiple enabled Availability Zones."
      },
      {
        "id": "concept-2",
        "title": "Why it matters",
        "body": "Without cross-zone balancing, traffic can be less even when each AZ has a different number of targets."
      },
      {
        "id": "concept-3",
        "title": "Support differs",
        "body": "ALB and NLB support cross-zone behaviour, but defaults and costs can differ by load balancer type."
      },
      {
        "id": "concept-4",
        "title": "Traffic distribution plan",
        "body": "ModeTargetsExpected resultExam ideaEnabledTargets across AZsMore even target spreadBetter when target count differsDisabledTargets in same AZ pathMore AZ-local behaviourWatch uneven target countsALB testTwo AZs, uneven targetsCompare target hitsLayer 7 trafficNLB testTwo AZs, uneven targetsCheck supported settingLayer 4 traffic"
      }
    ],
    "whyItMatters": "Cross-zone load balancing changes traffic spread. It helps when AZs do not have equal target counts, but you must know the defaults and cost impact.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      },
      {
        "label": "ALB name",
        "value": "saa-lbas-task-10-alb"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task-10-tg"
      },
      {
        "label": "Security group",
        "value": "saa-lbas-task-10-sg"
      },
      {
        "label": "Test port",
        "value": "80"
      },
      {
        "label": "Test design",
        "value": "Two AZs with uneven target counts"
      }
    ],
    "costWarning": "This lab can create ALB and EC2 charges. Cross-zone behaviour can also affect data processing costs depending on load balancer type and traffic path.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 discovery: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:DescribeImages, ec2:DescribeInstances EC2 setup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:RunInstances, ec2:CreateTags, ec2:TerminateInstances Load balancer setup: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:RegisterTargets Target group changes: elasticloadbalancing:ModifyTargetGroupAttributes, elasticloadbalancing:DescribeTargetGroups, elasticloadbalancing:DescribeTargetHealth, elasticloadbalancing:DescribeLoadBalancers CloudWatch checks: cloudwatch:GetMetricData, cloudwatch:ListMetrics Cleanup: elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create uneven targets across two AZs",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Launch two small web instances in one public subnet."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Launch one small web instance in another public subnet."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use a web page that prints the instance ID and AZ."
          }
        ],
        "note": "Uneven target count makes cross-zone behaviour easier to see.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the target group and ALB",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create an HTTP target group on port 80."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Register all test instances."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create an internet-facing Application Load Balancer across both AZs."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Create an HTTP listener forwarding to the target group."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Wait until all targets are healthy."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Check cross-zone setting",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the load balancer."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose the Attributes tab."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Find the cross-zone load balancing setting."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Record whether it is enabled or disabled."
          }
        ],
        "note": "Some settings may be load-balancer-level or target-group-level depending on load balancer type.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test traffic distribution",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the ALB DNS name many times."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Record which instance answers."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Change the cross-zone setting where the console allows it."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Repeat the browser test."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Compare the hit pattern."
          }
        ],
        "note": "CheckWhat to recordInstance IDWhich backend answeredAZWhere the target runsModeCross-zone on or offResultEven or uneven spread",
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
            "text": "Delete the listener."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the load balancer."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Terminate EC2 instances."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the security group."
          }
        ],
        "note": null,
        "warning": "Delete the ALB to stop hourly charges.",
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
        "note": "Expected: account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: account ID and ARN."
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
            "text": "REGION=eu-west-2\nNAME=saa-lbas-task-10\nVPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=is-default,Values=true --query \"Vpcs[0].VpcId\" --output text)\necho $VPC_ID"
          }
        ],
        "note": "Use the Console for the visual traffic test if easier.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Check load balancer attributes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "# After creating the ALB, set ALB_ARN first.\naws elbv2 describe-load-balancer-attributes --region $REGION --load-balancer-arn $ALB_ARN"
          }
        ],
        "note": "Look for the cross-zone load balancing attribute.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Change cross-zone attribute where supported",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws elbv2 modify-load-balancer-attributes --region $REGION --load-balancer-arn $ALB_ARN --attributes Key=load_balancing.cross_zone.enabled,Value=true"
          }
        ],
        "note": null,
        "warning": "Only change this in a learning lab. In production, check design and cost impact first.",
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "# Delete listener, load balancer, target group, instances, and security group in that order."
          }
        ],
        "note": "Use the specific ARNs and IDs from your lab.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Cross-zone meaning",
        "body": "Cross-zone = load balancer nodes can send traffic across enabled AZs."
      },
      {
        "id": "cs-2",
        "title": "Why use it",
        "body": "Cross-zone helps when target counts are uneven across AZs."
      },
      {
        "id": "cs-3",
        "title": "AZ balance",
        "body": "Best design = balanced targets across AZs. Cross-zone helps, but good placement still matters."
      },
      {
        "id": "cs-4",
        "title": "ALB memory",
        "body": "ALB is Layer 7. Use it for HTTP and HTTPS routing."
      },
      {
        "id": "cs-5",
        "title": "NLB memory",
        "body": "NLB is Layer 4. Use it for TCP, UDP, static IP, and very high performance."
      },
      {
        "id": "cs-6",
        "title": "Exam trap",
        "body": "Do not assume every load balancer type has the same default."
      },
      {
        "id": "cs-7",
        "title": "Cost memory",
        "body": "Cross-AZ traffic can matter for cost. Always read the scenario."
      },
      {
        "id": "cs-8",
        "title": "Health check link",
        "body": "Unhealthy targets do not receive normal traffic."
      },
      {
        "id": "cs-9",
        "title": "Uneven targets",
        "body": "Uneven target count = cross-zone becomes more visible."
      },
      {
        "id": "cs-10",
        "title": "Troubleshooting",
        "body": "No traffic = check listener, target group, health checks, and security group."
      },
      {
        "id": "cs-11",
        "title": "Design memory",
        "body": "Use Multi-AZ targets for high availability."
      },
      {
        "id": "cs-12",
        "title": "Cleanup",
        "body": "Delete listener, load balancer, target group, instances, then security group."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check Console step 0 permissions."
      },
      {
        "id": "ts-2",
        "title": "Targets unhealthy",
        "body": "Check instance web service, security group, and health check path."
      },
      {
        "id": "ts-3",
        "title": "No visible change",
        "body": "Uneven target counts make the difference easier to see."
      },
      {
        "id": "ts-4",
        "title": "Attribute not editable",
        "body": "Support and location of the setting depends on load balancer type."
      },
      {
        "id": "ts-5",
        "title": "Unexpected cost",
        "body": "Remove the load balancer and EC2 instances after testing."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: cross-zone replaces Multi-AZ design. Correct: still deploy targets across AZs."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: ALB and NLB are chosen only by cross-zone settings. Correct: choose by Layer 7 vs Layer 4 needs."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: all AZs get equal traffic even with no healthy targets. Correct: only healthy targets receive traffic."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Wrong: ignore cost. Correct: cross-zone and cross-AZ traffic can affect cost."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "Cross-zone = any counter can serve any queue. The load balancer can spread traffic beyond its own AZ path.",
    "flashcardSetId": "elb_task_10_flashcards"
  },
  {
    "id": "task-saa-elb-deregistration-delay-and-connection-draining-011",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Deregistration Delay and connection draining",
    "slug": "deregistration-delay-and-connection-draining",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Stop or terminate an instance and watch in-flight requests drain before the target is fully removed.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Deregistration delay",
        "body": "Deregistration delay is the time the load balancer waits before fully removing a target."
      },
      {
        "id": "concept-2",
        "title": "Connection draining",
        "body": "Connection draining lets in-flight requests finish instead of being cut off immediately."
      },
      {
        "id": "concept-3",
        "title": "Default value",
        "body": "The default deregistration delay is commonly 300 seconds for target groups."
      },
      {
        "id": "concept-4",
        "title": "Drain plan",
        "body": "SettingLab valueReasonTarget groupsaa-lbas-task-11-tgWhere delay is configuredDelay60 secondsShorter lab testTest endpoint/slowSimulates long requestActionStop or terminate one instanceTrigger drainingVerifyTarget health stateWatch draining then removed"
      }
    ],
    "whyItMatters": "Deregistration delay protects users during scale-in and deployments. It reduces broken requests when a target is removed.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      },
      {
        "label": "ALB name",
        "value": "saa-lbas-task-11-alb"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task-11-tg"
      },
      {
        "label": "Security group",
        "value": "saa-lbas-task-11-sg"
      },
      {
        "label": "Deregistration delay",
        "value": "60 seconds"
      },
      {
        "label": "Test path",
        "value": "/slow"
      }
    ],
    "costWarning": "Load balancer running-time, LCU usage, public IPv4 addressing, and data-processing charges may apply. Complete cleanup promptly after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 discovery: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:DescribeImages, ec2:DescribeInstances EC2 setup: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:RunInstances, ec2:CreateTags, ec2:TerminateInstances Load balancer setup: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:RegisterTargets Target group changes: elasticloadbalancing:ModifyTargetGroupAttributes, elasticloadbalancing:DescribeTargetGroups, elasticloadbalancing:DescribeTargetHealth, elasticloadbalancing:DescribeLoadBalancers CloudWatch checks: cloudwatch:GetMetricData, cloudwatch:ListMetrics Cleanup: elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup, ec2:DeleteSecurityGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create two web instances with a slow path",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Create a security group that allows HTTP 80."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Launch two Amazon Linux instances in two public subnets."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Install a small web service that has a normal path and a slow path."
          },
          {
            "id": "console-step-2-item-4",
            "text": "The slow path should wait before returning a response."
          }
        ],
        "note": "A slow path makes connection draining visible.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the target group and ALB",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create an HTTP target group on port 80."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Register both instances."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create an internet-facing ALB."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Create an HTTP listener forwarding to the target group."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Wait for both targets to become healthy."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Set deregistration delay",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the target group."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose the Attributes tab."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Deregistration delay to 60 seconds."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Save changes."
          }
        ],
        "note": "A shorter delay is easier for a lab.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Start a slow request",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the ALB DNS name with the slow path."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Example: http://alb-dns-name/slow."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Keep the request running."
          },
          {
            "id": "console-step-5-item-4",
            "text": "In another tab, open the target health page."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Stop or terminate one target",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Stop or terminate one EC2 instance."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Watch the target group health state."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm the target enters a draining state."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Confirm new requests go to the remaining healthy target."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Confirm the slow request can finish if it completes within the delay."
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
            "text": "Delete the listener."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete the ALB."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Wait for deletion."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Terminate remaining instances."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the security group."
          }
        ],
        "note": null,
        "warning": "Delete the ALB to stop hourly charges.",
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
        "note": "Expected: account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: account ID and ARN."
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
            "text": "REGION=eu-west-2\nNAME=saa-lbas-task-11\n# Set TG_ARN after creating the target group.\n# Set INSTANCE_ID to the target you will stop or terminate."
          }
        ],
        "note": "Use the Console for instance creation if preferred.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Set deregistration delay",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws elbv2 modify-target-group-attributes --region $REGION --target-group-arn $TG_ARN --attributes Key=deregistration_delay.timeout_seconds,Value=60"
          }
        ],
        "note": "Expected: the target group delay changes to 60 seconds.",
        "warning": null,
        "expectedResult": "Expected: the target group delay changes to 60 seconds."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify target group attributes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-target-group-attributes --region $REGION --target-group-arn $TG_ARN --query \"Attributes[?Key=='deregistration_delay.timeout_seconds']\""
          }
        ],
        "note": "Expected: value is 60.",
        "warning": null,
        "expectedResult": "Expected: value is 60."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Deregister one target",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws elbv2 deregister-targets --region $REGION --target-group-arn $TG_ARN --targets Id=$INSTANCE_ID\naws elbv2 describe-target-health --region $REGION --target-group-arn $TG_ARN"
          }
        ],
        "note": "Expected: target can show a draining state before removal.",
        "warning": "Destructive Command Warning: This command permanently terminates AWS resources, scaling policies, or load balancer configurations.",
        "expectedResult": "Expected: target can show a draining state before removal."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "# Delete listener, load balancer, target group, instances, and security group in dependency order."
          }
        ],
        "note": null,
        "warning": "Use real ARNs and IDs from your lab before running delete commands.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Deregistration delay",
        "body": "Deregistration delay = wait time before target removal completes."
      },
      {
        "id": "cs-2",
        "title": "Connection draining",
        "body": "Connection draining = existing requests can finish."
      },
      {
        "id": "cs-3",
        "title": "New traffic",
        "body": "Draining target should not receive new normal requests."
      },
      {
        "id": "cs-4",
        "title": "Default memory",
        "body": "Default delay is commonly 300 seconds."
      },
      {
        "id": "cs-5",
        "title": "Lab value",
        "body": "Use 60 seconds for faster testing."
      },
      {
        "id": "cs-6",
        "title": "Scale-in link",
        "body": "ASG scale-in can trigger target deregistration."
      },
      {
        "id": "cs-7",
        "title": "Deployment link",
        "body": "Deregistration delay helps rolling deployments avoid broken requests."
      },
      {
        "id": "cs-8",
        "title": "Health check link",
        "body": "Unhealthy and draining are different states."
      },
      {
        "id": "cs-9",
        "title": "Too short risk",
        "body": "Too short = requests may be cut off."
      },
      {
        "id": "cs-10",
        "title": "Too long risk",
        "body": "Too long = old capacity remains longer."
      },
      {
        "id": "cs-11",
        "title": "CLI memory",
        "body": "Use modify-target-group-attributes to change delay."
      },
      {
        "id": "cs-12",
        "title": "Cleanup memory",
        "body": "Delete ALB before target group."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check Console step 0 permissions and identity."
      },
      {
        "id": "ts-2",
        "title": "No draining state seen",
        "body": "The request may have finished too quickly. Use a slower test path."
      },
      {
        "id": "ts-3",
        "title": "Requests fail immediately",
        "body": "Delay may be too short, app may close connections, or instance may be stopped hard."
      },
      {
        "id": "ts-4",
        "title": "Target group delete fails",
        "body": "Delete the listener and load balancer first."
      },
      {
        "id": "ts-5",
        "title": "Instance still running",
        "body": "Deregistering a target does not always terminate the EC2 instance."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: deregistration delay sends new traffic to draining targets. Correct: it helps existing requests finish."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: deregistration always terminates EC2. Correct: deregistration removes the target from the target group."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: set delay to zero for all apps. Correct: long requests may need a delay."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Wrong: health check grace period and deregistration delay are the same. Correct: they solve different lifecycle problems."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "Drain before delete. Let the customer finish before closing the checkout.",
    "flashcardSetId": "elb_task_11_flashcards"
  },
  {
    "id": "task-saa-elb-alb-websockets-017",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "ALB + WebSockets",
    "slug": "alb-websockets",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Create an ALB that supports WebSocket traffic and verify persistent connection behaviour.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "WebSocket support",
        "body": "Application Load Balancer supports WebSockets natively. An HTTP/1.1 connection can upgrade to ws or wss."
      },
      {
        "id": "concept-2",
        "title": "Persistent connection",
        "body": "After upgrade, the connection stays open. This is different from a normal short HTTP request."
      },
      {
        "id": "concept-3",
        "title": "Idle timeout",
        "body": "Idle timeout matters for long connections. Silent WebSocket connections may close if idle too long."
      },
      {
        "id": "concept-4",
        "title": "WebSocket traffic plan",
        "body": "LayerWhat happensExam memorySettingClientStarts HTTP/1.1 requestUpgrade beginsUse ws:// or wss://ALBAccepts upgradeNative WebSocket supportHTTP or HTTPS listenerTargetKeeps connection openPersistent connectionIdle timeout matters"
      }
    ],
    "whyItMatters": "This matters because load balancing and scaling are core SAA-C03 topics. Real systems need safe traffic handling, predictable scaling, and clean recovery when capacity changes.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Load balancer name",
        "value": "saa-lbas-task-17-alb"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task-17-tg"
      },
      {
        "label": "Instance port",
        "value": "8080"
      },
      {
        "label": "Listener port",
        "value": "80"
      },
      {
        "label": "WebSocket test path",
        "value": "/"
      }
    ],
    "costWarning": "Load balancer running-time, LCU usage, public IPv4 addressing, and data-processing charges may apply. Complete cleanup promptly after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 setup: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:RunInstances, ec2:DescribeInstances, ec2:TerminateInstances Launch templates: ec2:CreateLaunchTemplate, ec2:CreateLaunchTemplateVersion, ec2:DescribeLaunchTemplates, ec2:DeleteLaunchTemplate Auto Scaling: autoscaling:CreateAutoScalingGroup, autoscaling:UpdateAutoScalingGroup, autoscaling:PutScalingPolicy, autoscaling:PutScheduledUpdateGroupAction, autoscaling:PutLifecycleHook, autoscaling:CompleteLifecycleAction, autoscaling:DescribeAutoScalingGroups, autoscaling:DescribePolicies, autoscaling:DescribeLifecycleHooks, autoscaling:DeletePolicy, autoscaling:DeleteLifecycleHook, autoscaling:DeleteAutoScalingGroup Load balancing: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:DescribeLoadBalancers, elasticloadbalancing:DescribeTargetHealth, elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup CloudWatch: cloudwatch:DescribeAlarms, cloudwatch:GetMetricData, cloudwatch:PutMetricAlarm, cloudwatch:DeleteAlarms IAM for instances: iam:PassRole only if you attach an EC2 instance profile.",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a WebSocket test instance",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Launch an Amazon Linux instance in the default VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use a security group that allows HTTP from the ALB security group on port 8080."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use user data to install a tiny WebSocket echo server."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Tag it saa-lbas-task-17-ws."
          }
        ],
        "note": "For a simple lab, use one or two small instances.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the ALB target group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Go to Target Groups."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create an Instances target group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Protocol: HTTP."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Port: 8080."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Health check path: /."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Register the WebSocket instance."
          }
        ],
        "note": "ALB handles the client HTTP upgrade request.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the ALB listener",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Go to Load Balancers."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Create an Application Load Balancer."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set scheme to Internet-facing."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select at least two public subnets."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Create an HTTP listener on port 80."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Forward to saa-lbas-task-17-tg."
          }
        ],
        "note": null,
        "warning": "For production WebSockets, prefer HTTPS using wss://.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test WebSocket behaviour",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Copy the ALB DNS name."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Use a WebSocket client tool such as wscat from your local machine."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Connect to ws://ALB-DNS-NAME/."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Send a short message."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Confirm the server echoes the message."
          }
        ],
        "note": "Success means the connection upgraded and stayed open.",
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
            "text": "Close WebSocket clients."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the ALB listener."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the ALB."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Terminate test instances."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Delete security groups created only for this lab."
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
        "title": "Check your AWS identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
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
            "text": "REGION=eu-west-2\nALB_NAME=saa-lbas-task-17-alb\nTG_NAME=saa-lbas-task-17-tg"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "List default VPC subnets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-subnets --region $REGION --filters Name=default-for-az,Values=true --query 'Subnets[*].[SubnetId,AvailabilityZone,CidrBlock]' --output table"
          }
        ],
        "note": "Expected: at least two default subnets are shown.",
        "warning": null,
        "expectedResult": "Expected: at least two default subnets are shown."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Check target health after creation",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-target-health --region $REGION --target-group-arn <target-group-arn>"
          }
        ],
        "note": "Replace <target-group-arn> with your target group ARN.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Get ALB DNS name",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-load-balancers --region $REGION --names $ALB_NAME --query 'LoadBalancers[0].DNSName' --output text"
          }
        ],
        "note": "Use this DNS name in the WebSocket client.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Cleanup reminder",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "echo 'Delete listener, ALB, target group, instances, and lab security groups in that order.'"
          }
        ],
        "note": "Use Console cleanup if that is safer for your lab.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ALB WebSocket support",
        "body": "ALB supports WebSockets natively. No special WebSocket load balancer is needed."
      },
      {
        "id": "cs-2",
        "title": "Connection upgrade",
        "body": "WebSocket starts as HTTP/1.1. The connection upgrades to ws or wss."
      },
      {
        "id": "cs-3",
        "title": "Persistent connection",
        "body": "WebSocket stays open. Normal HTTP request closes quickly. This changes timeout thinking."
      },
      {
        "id": "cs-4",
        "title": "WebSocket flow table",
        "body": "LayerWhat happensExam memorySettingClientStarts HTTP/1.1 requestUpgrade beginsUse ws:// or wss://ALBAccepts upgradeNative WebSocket supportHTTP or HTTPS listenerTargetKeeps connection openPersistent connectionIdle timeout matters"
      },
      {
        "id": "cs-5",
        "title": "HTTP vs HTTPS",
        "body": "ws:// uses HTTP. wss:// uses HTTPS. Production should normally use wss://."
      },
      {
        "id": "cs-6",
        "title": "ALB listener",
        "body": "ALB listener can be HTTP or HTTPS. HTTPS listener uses ACM certificate. Target can still use HTTP."
      },
      {
        "id": "cs-7",
        "title": "Idle timeout",
        "body": "ALB idle timeout can close quiet connections. Apps often send ping messages."
      },
      {
        "id": "cs-8",
        "title": "Target group",
        "body": "ALB forwards WebSocket traffic to target group. Health checks still use HTTP path."
      },
      {
        "id": "cs-9",
        "title": "Sticky sessions",
        "body": "WebSocket connection already stays on one target while open. Stickiness matters more across new requests."
      },
      {
        "id": "cs-10",
        "title": "Scale-in risk",
        "body": "Long connections can be interrupted by scale-in. Deregistration delay helps draining."
      },
      {
        "id": "cs-11",
        "title": "Exam choice",
        "body": "Layer 7 WebSocket traffic = ALB. Raw TCP or ultra-low latency = NLB."
      },
      {
        "id": "cs-12",
        "title": "Troubleshooting memory",
        "body": "Check security groups. Check target health. Check idle timeout. Check client uses the right URL."
      },
      {
        "id": "cs-13",
        "title": "Cost cleanup",
        "body": "ALB costs while running. EC2 instances cost while running. Delete both after the lab."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check Console step 0 permissions."
      },
      {
        "id": "ts-2",
        "title": "WebSocket will not connect",
        "body": "Check ALB DNS name, listener port, security groups, and target health."
      },
      {
        "id": "ts-3",
        "title": "Connection closes early",
        "body": "Check ALB idle timeout and app ping behaviour."
      },
      {
        "id": "ts-4",
        "title": "Target unhealthy",
        "body": "Check health check path, target port, and instance service status."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "ALB supports WebSockets. Do not assume you need NLB for WebSockets."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "WebSocket support does not fix a broken backend app."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Long-lived connections can be affected by scale-in."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "wss:// needs TLS on the listener."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "HTTP becomes a tunnel. WebSocket starts as HTTP, then upgrades into a persistent connection.",
    "flashcardSetId": "elb_task_17_flashcards"
  },
  {
    "id": "task-saa-elb-compare-internal-and-internet-facing-load-balancers-018",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Compare internal and internet-facing load balancers",
    "slug": "compare-internal-and-internet-facing-load-balancers",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create one internet-facing ALB and one internal ALB, compare their DNS names, and verify public versus private access.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Internet-facing ALB",
        "body": "An internet-facing ALB accepts requests from clients over the internet. It must use public subnets. It still forwards traffic to private targets if routing and security allow it."
      },
      {
        "id": "concept-2",
        "title": "Internal ALB",
        "body": "An internal ALB uses private IP addresses. It is reached from inside the VPC, peered networks, VPN, or Direct Connect. It is not for direct public browser access."
      },
      {
        "id": "concept-3",
        "title": "DNS names matter",
        "body": "ELB gives each load balancer a DNS name. Public ALB DNS resolves for internet clients. Internal ALB DNS is useful inside private networks."
      },
      {
        "id": "concept-4",
        "title": "Comparison plan",
        "body": "Load balancerSchemeSubnetsDNS behaviourTestlbas18-public-albInternet-facingPublic subnetsPublicly resolvableCurl from your laptoplbas18-private-albInternalPrivate subnetsPrivate VPC accessCurl from EC2 inside VPC"
      }
    ],
    "whyItMatters": "This matters because placement controls who can reach the app. SAA-C03 often asks whether a service should be public or private.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC"
      },
      {
        "label": "Public ALB name",
        "value": "lbas18-public-alb"
      },
      {
        "label": "Internal ALB name",
        "value": "lbas18-private-alb"
      },
      {
        "label": "Target group",
        "value": "lbas18-web-tg"
      },
      {
        "label": "HTTP port",
        "value": "80"
      },
      {
        "label": "Instance type",
        "value": "t3.micro"
      }
    ],
    "costWarning": "This lab can create charges for Application Load Balancers, EC2 instances, and data processing. Delete the load balancers, target groups, and EC2 instances after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions in the note below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity VPC and EC2 discovery: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:DescribeInstances Security groups: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup EC2 test targets: ec2:RunInstances, ec2:TerminateInstances, ec2:CreateTags Load balancing: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:RegisterTargets, elasticloadbalancing:CreateListener, elasticloadbalancing:DescribeLoadBalancers, elasticloadbalancing:DescribeTargetHealth Cleanup: elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create target security groups",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 → Security Groups."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create lbas18-public-alb-sg that allows HTTP 80 from 0.0.0.0/0."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create lbas18-internal-alb-sg that allows HTTP 80 from the VPC CIDR."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create lbas18-web-sg that allows HTTP 80 from both ALB security groups."
          }
        ],
        "note": "Keep SSH closed unless you need it for testing.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Launch two simple web instances",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2 → Instances → Launch instances."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Use Amazon Linux 2023 and t3.micro."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Place instances in two different Availability Zones in the default VPC."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach lbas18-web-sg."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Use user data to install a small web page that shows the instance ID."
          }
        ],
        "note": "Success: each instance responds on HTTP port 80 from the ALB security groups.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the internet-facing ALB",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 → Load Balancers."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create load balancer → Application Load Balancer."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name it lbas18-public-alb."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Scheme to Internet-facing."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Select two public subnets."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Attach lbas18-public-alb-sg."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Create an HTTP listener on port 80."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Forward to target group lbas18-web-tg."
          }
        ],
        "note": "The DNS name should work from your laptop after targets are healthy.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the internal ALB",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Create another Application Load Balancer."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Name it lbas18-private-alb."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Set Scheme to Internal."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Select two private subnets if available, or default VPC subnets for a learning lab."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Attach lbas18-internal-alb-sg."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Create an HTTP listener on port 80."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Forward to the same healthy target group."
          }
        ],
        "note": null,
        "warning": "In production, internal ALBs normally belong in private subnets.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Compare DNS and test access",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Copy both ALB DNS names from the Description tab."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Run curl http://public-alb-dns-name from your laptop."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Run curl http://internal-alb-dns-name from your laptop and expect it to fail."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Run the internal ALB test from an EC2 instance inside the VPC."
          }
        ],
        "note": "Expected: public ALB works from outside; internal ALB works only from inside the private network.",
        "warning": null,
        "expectedResult": "Expected: public ALB works from outside; internal ALB works only from inside the private network."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Delete the public ALB listener."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete the internal ALB listener."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete both load balancers."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the target group after the load balancers are gone."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Terminate the EC2 instances."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the security groups when no ENIs use them."
          }
        ],
        "note": null,
        "warning": "Load balancers can keep charging until deleted.",
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set common variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nVPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nSUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text)\necho $VPC_ID\necho $SUBNETS"
          }
        ],
        "note": "Expected: you see the default VPC and two subnet IDs.",
        "warning": null,
        "expectedResult": "Expected: you see the default VPC and two subnet IDs."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Describe load balancer schemes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-load-balancers --region $REGION --names lbas18-public-alb lbas18-private-alb --query 'LoadBalancers[].{Name:LoadBalancerName,Scheme:Scheme,DNS:DNSName}' --output table"
          }
        ],
        "note": "Expected: one scheme is internet-facing and one is internal.",
        "warning": null,
        "expectedResult": "Expected: one scheme is internet-facing and one is internal."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Test DNS names",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "curl -I http://PUBLIC_ALB_DNS_NAME\ncurl -I http://INTERNAL_ALB_DNS_NAME"
          }
        ],
        "note": "Expected: run the internal DNS test from an EC2 instance inside the VPC.",
        "warning": null,
        "expectedResult": "Expected: run the internal DNS test from an EC2 instance inside the VPC."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Cleanup reminder",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-load-balancers --region $REGION --query 'LoadBalancers[?contains(LoadBalancerName, `lbas18`)].LoadBalancerName' --output table"
          }
        ],
        "note": "Delete listeners, load balancers, target groups, instances, and security groups in that order.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ALB scheme",
        "body": "ALB scheme = public or private entry point. Internet-facing = public clients. Internal = private clients."
      },
      {
        "id": "cs-2",
        "title": "Internet-facing ALB",
        "body": "Internet-facing ALB = public DNS access. Use public subnets. Targets can still be private."
      },
      {
        "id": "cs-3",
        "title": "Internal ALB",
        "body": "Internal ALB = private service entry. Use for microservices. Use for apps behind VPN or Direct Connect."
      },
      {
        "id": "cs-4",
        "title": "Subnet rule",
        "body": "ALB needs at least two Availability Zones. Public ALB should use public subnets. Internal ALB usually uses private subnets."
      },
      {
        "id": "cs-5",
        "title": "DNS memory",
        "body": "ELB DNS = AWS-managed name. Do not depend on fixed ALB IPs. Use Route 53 alias records for friendly names."
      },
      {
        "id": "cs-6",
        "title": "Security group rule",
        "body": "ALB security group controls client access. Target security group should allow traffic from the ALB security group. Do not open targets to everyone."
      },
      {
        "id": "cs-7",
        "title": "Common exam choice",
        "body": "Public website = internet-facing ALB. Private app tier = internal ALB. Static IP need = NLB, not ALB."
      },
      {
        "id": "cs-8",
        "title": "Cost memory",
        "body": "ALB charges while running. Targets may still run after ALB deletion. Delete both to stop costs."
      },
      {
        "id": "cs-9",
        "title": "Troubleshooting memory",
        "body": "ALB fails = check listener, target group, health check, security groups, routes, and subnet type."
      },
      {
        "id": "cs-10",
        "title": "Internal access trap",
        "body": "Internal ALB is not reached from the public internet. Use a VPC instance, VPN, Direct Connect, or peering path."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Public ALB does not load",
        "body": "Check public subnet route to an internet gateway. Check ALB security group allows HTTP from your IP."
      },
      {
        "id": "ts-2",
        "title": "Internal ALB fails from laptop",
        "body": "That is expected. Test from inside the VPC or through VPN or Direct Connect."
      },
      {
        "id": "ts-3",
        "title": "Targets unhealthy",
        "body": "Check target security group. Check app listens on port 80. Check health check path."
      },
      {
        "id": "ts-4",
        "title": "Cannot delete security group",
        "body": "A load balancer ENI or EC2 instance may still use it. Delete dependent resources first."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: internal ALB for public web users. Correct: use internet-facing ALB."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: public ALB means targets must be public. Correct: public ALB can forward to private targets."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: use ALB for fixed IPs. Correct: use NLB when static IPs are required."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Wrong: open EC2 directly to the internet. Correct: allow target traffic from the ALB security group."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "Public door, private hallway. Internet-facing ALB opens the public door. Internal ALB stays inside the building.",
    "flashcardSetId": "elb_task_18_flashcards"
  },
  {
    "id": "task-saa-elb-enable-alb-access-logs-019",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Enable ALB access logs",
    "slug": "enable-alb-access-logs",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Turn on ALB access logging to S3 and identify what each request record tells you.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "ALB access logs",
        "body": "ALB access logs record requests sent to the load balancer. They help troubleshoot client IPs, paths, status codes, and latency."
      },
      {
        "id": "concept-2",
        "title": "S3 log bucket",
        "body": "Logs are delivered to an S3 bucket. The bucket needs a policy that allows Elastic Load Balancing log delivery."
      },
      {
        "id": "concept-3",
        "title": "Log delay",
        "body": "ALB access logs are not instant. Wait for delivery after sending test traffic."
      },
      {
        "id": "concept-4",
        "title": "Record field plan",
        "body": "FieldMeaningExam usetimeRequest timeFind when issue happenedclient:portClient sourceFind caller IPtarget:portBackend targetFind chosen instancerequest_processing_timeALB receive delaySpot ALB-side delaytarget_processing_timeTarget response timeSpot app slownesselb_status_codeALB responseFind ELB errorstarget_status_codeTarget responseFind app errorsrequestHTTP method and pathFind requested URL"
      }
    ],
    "whyItMatters": "This matters because ALB logs explain what happened to each request. They are useful for operations, security review, and exam troubleshooting.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "ALB name",
        "value": "lbas19-access-log-alb"
      },
      {
        "label": "S3 log bucket",
        "value": "lbas19-alb-logs-[account-id]"
      },
      {
        "label": "Log prefix",
        "value": "alb-access-logs"
      },
      {
        "label": "HTTP port",
        "value": "80"
      },
      {
        "label": "Test path",
        "value": "/"
      }
    ],
    "costWarning": "Load balancer running-time, LCU usage, public IPv4 addressing, and data-processing charges may apply. Complete cleanup promptly after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions in the note below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Load balancer discovery: elasticloadbalancing:DescribeLoadBalancers, elasticloadbalancing:DescribeLoadBalancerAttributes, elasticloadbalancing:ModifyLoadBalancerAttributes S3 log bucket: s3:CreateBucket, s3:PutBucketPolicy, s3:GetBucketPolicy, s3:ListBucket, s3:GetObject, s3:DeleteObject, s3:DeleteBucket EC2 and test traffic: ec2:DescribeInstances, ec2:RunInstances, ec2:TerminateInstances Cleanup: elasticloadbalancing:ModifyLoadBalancerAttributes, s3:DeleteObject, s3:DeleteBucket",
        "warning": "Do not use real customer traffic in a learning log bucket.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create or reuse a simple ALB lab",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Use an existing test ALB from an earlier lab, or create a new internet-facing ALB."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Register one or two simple EC2 web targets."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Confirm the ALB DNS name returns a web page."
          }
        ],
        "note": "This task focuses on logging, not advanced routing.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the S3 log bucket",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open S3 → Create bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Name it lbas19-alb-logs-[account-id]."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Use Region eu-west-2."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep public access blocked."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Do not enable static website hosting."
          }
        ],
        "note": null,
        "warning": "The bucket name must be globally unique.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Add the ALB log delivery bucket policy",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the log bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Permissions → Bucket policy."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add a policy that allows ELB log delivery to write to the bucket prefix."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Save the policy."
          }
        ],
        "note": "Use the AWS documentation example for your Region and account when writing the production policy.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Enable access logs on the ALB",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open EC2 → Load Balancers."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select lbas19-access-log-alb."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Open the Attributes tab."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Turn on Access logs."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Set the S3 bucket and prefix alb-access-logs."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Save changes."
          }
        ],
        "note": "Success: attributes show access logging enabled.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Generate traffic and read the log",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the ALB DNS name several times."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Try a valid path and an invalid path."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Wait for log delivery to S3."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Open the bucket prefix."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Download or open a log object."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Find the client IP, path, status code, and target processing time."
          }
        ],
        "note": "Logs can take a short time to appear.",
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
            "text": "Disable ALB access logging first."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete log objects from the S3 bucket."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the S3 bucket policy if needed."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the S3 bucket."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the ALB listener."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the ALB."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Terminate EC2 instances."
          }
        ],
        "note": null,
        "warning": "S3 buckets must be empty before deletion.",
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
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
            "text": "REGION=eu-west-2\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nBUCKET=lbas19-alb-logs-$ACCOUNT_ID\nPREFIX=alb-access-logs\nALB_NAME=lbas19-access-log-alb\necho $BUCKET"
          }
        ],
        "note": "Expected: bucket name includes your AWS account ID.",
        "warning": null,
        "expectedResult": "Expected: bucket name includes your AWS account ID."
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
            "text": "aws s3api create-bucket --region $REGION --bucket $BUCKET --create-bucket-configuration LocationConstraint=$REGION"
          }
        ],
        "note": "Expected: the bucket is created in eu-west-2.",
        "warning": null,
        "expectedResult": "Expected: the bucket is created in eu-west-2."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Find the ALB ARN",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "ALB_ARN=$(aws elbv2 describe-load-balancers --region $REGION --names $ALB_NAME --query 'LoadBalancers[0].LoadBalancerArn' --output text)\necho $ALB_ARN"
          }
        ],
        "note": "Expected: an ALB ARN is shown.",
        "warning": null,
        "expectedResult": "Expected: an ALB ARN is shown."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Enable access logging attribute",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws elbv2 modify-load-balancer-attributes --region $REGION --load-balancer-arn $ALB_ARN --attributes Key=access_logs.s3.enabled,Value=true Key=access_logs.s3.bucket,Value=$BUCKET Key=access_logs.s3.prefix,Value=$PREFIX"
          }
        ],
        "note": null,
        "warning": "The S3 bucket policy must allow ELB log delivery or the setting may fail.",
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify attributes and list logs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-load-balancer-attributes --region $REGION --load-balancer-arn $ALB_ARN --query 'Attributes[?starts_with(Key, `access_logs`)]' --output table\naws s3 ls s3://$BUCKET/$PREFIX/ --recursive"
          }
        ],
        "note": "Expected: logging is enabled and log objects appear after traffic and delivery delay.",
        "warning": null,
        "expectedResult": "Expected: logging is enabled and log objects appear after traffic and delivery delay."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Disable logs before cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws elbv2 modify-load-balancer-attributes --region $REGION --load-balancer-arn $ALB_ARN --attributes Key=access_logs.s3.enabled,Value=false"
          }
        ],
        "note": "Then empty and delete the S3 bucket after no more logs are needed.",
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ALB access logs",
        "body": "ALB access logs = request history. Use them for traffic analysis. Use them for troubleshooting."
      },
      {
        "id": "cs-2",
        "title": "S3 destination",
        "body": "Access logs go to S3. The bucket must allow log delivery. Keep public access blocked."
      },
      {
        "id": "cs-3",
        "title": "Not real time",
        "body": "ALB logs are delivered later. Do not expect instant files. Use CloudWatch metrics for faster signals."
      },
      {
        "id": "cs-4",
        "title": "Client IP",
        "body": "Client IP shows who connected. For forwarded apps, also check X-Forwarded-For."
      },
      {
        "id": "cs-5",
        "title": "Status code split",
        "body": "elb_status_code = load balancer response. target_status_code = application response."
      },
      {
        "id": "cs-6",
        "title": "Latency split",
        "body": "Request time can be split. ALB time is separate from target time. Target time often shows app slowness."
      },
      {
        "id": "cs-7",
        "title": "Path troubleshooting",
        "body": "The request field shows method and path. Use it to find bad URLs. Use it to check listener rule matches."
      },
      {
        "id": "cs-8",
        "title": "Security memory",
        "body": "Logs can contain IPs and paths. Treat logs as sensitive. Restrict S3 bucket access."
      },
      {
        "id": "cs-9",
        "title": "Cost memory",
        "body": "S3 storage costs money. Log volume grows with traffic. Use lifecycle rules in real accounts."
      },
      {
        "id": "cs-10",
        "title": "Exam comparison",
        "body": "Access logs = request detail. CloudWatch metrics = numeric health and performance. CloudTrail = API activity."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No logs appear",
        "body": "Generate traffic first. Wait for delivery. Check the bucket and prefix."
      },
      {
        "id": "ts-2",
        "title": "AccessDenied to S3",
        "body": "Check the S3 bucket policy. Confirm the ELB log delivery service can write objects."
      },
      {
        "id": "ts-3",
        "title": "Wrong Region",
        "body": "Create the bucket in the same Region as the ALB for this lab."
      },
      {
        "id": "ts-4",
        "title": "Cannot delete bucket",
        "body": "Disable logging first. Empty all log objects. Then delete the bucket."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: access logs are real time. Correct: log delivery is delayed."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: CloudTrail replaces ALB access logs. Correct: CloudTrail records API calls, not every web request."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: only target status matters. Correct: compare ELB status and target status."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Wrong: public S3 bucket for logs. Correct: private bucket with log delivery permissions."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "Logs tell the request story. ALB access logs show who called, what path they used, and how the load balancer and target responded.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-elb-test-alb-deletion-protection-020",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Test ALB deletion protection",
    "slug": "test-alb-deletion-protection",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Enable deletion protection, prove deletion is blocked, then disable it and clean up safely.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Deletion protection",
        "body": "Deletion protection stops accidental load balancer deletion. It is off by default. You must turn it off before deleting the load balancer."
      },
      {
        "id": "concept-2",
        "title": "What it protects",
        "body": "It protects the load balancer resource. It does not protect EC2 instances, target groups, or security groups."
      },
      {
        "id": "concept-3",
        "title": "Safe production use",
        "body": "Use deletion protection on important production load balancers. It adds a simple guardrail against mistakes."
      },
      {
        "id": "concept-4",
        "title": "Deletion behaviour plan",
        "body": "StateDelete attemptExpected resultReasonEnabledDelete ALBBlockedProtection prevents accidental deletionDisabledDelete ALBAllowedNormal cleanup can continueTarget groupAfter ALB deletionDelete allowedNo listener depends on it"
      }
    ],
    "whyItMatters": "This matters because one accidental delete can break a live application. For the exam, know that deletion protection must be disabled before deleting the load balancer.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "ALB name",
        "value": "lbas20-protected-alb"
      },
      {
        "label": "Target group",
        "value": "lbas20-protected-tg"
      },
      {
        "label": "Listener port",
        "value": "80"
      },
      {
        "label": "Deletion protection attribute",
        "value": "deletion_protection.enabled"
      }
    ],
    "costWarning": "This lab can create ALB charges while the load balancer exists. Delete the listener, ALB, target group, and security group after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions in the note below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Load balancer setup: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:DescribeLoadBalancers Deletion protection: elasticloadbalancing:DescribeLoadBalancerAttributes, elasticloadbalancing:ModifyLoadBalancerAttributes, elasticloadbalancing:DeleteLoadBalancer EC2 support resources: ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:CreateSecurityGroup, ec2:DeleteSecurityGroup Cleanup: elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteTargetGroup",
        "warning": "Do not test deletion protection on a real production load balancer unless approved.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a small test ALB",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 → Load Balancers."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create an Application Load Balancer."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Name it lbas20-protected-alb."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use scheme Internet-facing."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Select two subnets."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Create a simple HTTP listener on port 80."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Create target group lbas20-protected-tg."
          }
        ],
        "note": "Targets are optional for this deletion protection test, but a normal ALB setup is clearer.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable deletion protection",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select the ALB."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Open the Attributes tab."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Turn on Deletion protection."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Save changes."
          }
        ],
        "note": "Success: the attribute shows deletion protection enabled.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Prove deletion is blocked",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "With the ALB selected, choose Actions → Delete load balancer."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Confirm the delete attempt."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Observe the error or blocked deletion message."
          }
        ],
        "note": null,
        "warning": "This is a safe test only because deletion protection is enabled.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Disable deletion protection",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Return to the ALB Attributes tab."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Turn off Deletion protection."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Save changes."
          }
        ],
        "note": "Success: the ALB can now be deleted.",
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
            "text": "Delete the ALB listener if needed."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the ALB after deletion protection is disabled."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Wait until the ALB state is deleted."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete security groups created for the lab."
          }
        ],
        "note": null,
        "warning": "Do not leave the ALB running after the lab.",
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set variables and find the ALB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nALB_NAME=lbas20-protected-alb\nALB_ARN=$(aws elbv2 describe-load-balancers --region $REGION --names $ALB_NAME --query 'LoadBalancers[0].LoadBalancerArn' --output text)\necho $ALB_ARN"
          }
        ],
        "note": "Expected: an ALB ARN is shown.",
        "warning": null,
        "expectedResult": "Expected: an ALB ARN is shown."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Enable deletion protection",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws elbv2 modify-load-balancer-attributes --region $REGION --load-balancer-arn $ALB_ARN --attributes Key=deletion_protection.enabled,Value=true"
          }
        ],
        "note": "Success: deletion protection is enabled.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify the attribute",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-load-balancer-attributes --region $REGION --load-balancer-arn $ALB_ARN --query 'Attributes[?Key==`deletion_protection.enabled`]' --output table"
          }
        ],
        "note": "Expected: value is true.",
        "warning": null,
        "expectedResult": "Expected: value is true."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Try to delete and expect failure",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws elbv2 delete-load-balancer --region $REGION --load-balancer-arn $ALB_ARN"
          }
        ],
        "note": null,
        "warning": "Expected: the delete request fails while deletion protection is enabled.",
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Disable protection for cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws elbv2 modify-load-balancer-attributes --region $REGION --load-balancer-arn $ALB_ARN --attributes Key=deletion_protection.enabled,Value=false"
          }
        ],
        "note": "Expected: the load balancer can now be deleted.",
        "warning": null,
        "expectedResult": "Expected: the load balancer can now be deleted."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Delete the ALB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws elbv2 delete-load-balancer --region $REGION --load-balancer-arn $ALB_ARN"
          }
        ],
        "note": "After this, delete target groups and security groups created for the lab.",
        "warning": "Destructive Command Warning: This command permanently terminates AWS resources, scaling policies, or load balancer configurations.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Deletion protection",
        "body": "Deletion protection = delete guardrail. It helps stop accidental ALB deletion. It is off by default."
      },
      {
        "id": "cs-2",
        "title": "Delete rule",
        "body": "Protected ALB cannot be deleted. Disable protection first. Then delete the ALB."
      },
      {
        "id": "cs-3",
        "title": "What it does not protect",
        "body": "It does not protect targets. It does not protect target groups. It does not protect security groups."
      },
      {
        "id": "cs-4",
        "title": "Production memory",
        "body": "Production ALB should often use deletion protection. Learning labs should disable it before cleanup."
      },
      {
        "id": "cs-5",
        "title": "Console location",
        "body": "EC2 console → Load Balancers. Select ALB. Attributes tab → Edit."
      },
      {
        "id": "cs-6",
        "title": "CLI attribute",
        "body": "Attribute key = deletion_protection.enabled. Value is true or false."
      },
      {
        "id": "cs-7",
        "title": "Cleanup memory",
        "body": "Disable protection first. Delete listener and ALB. Delete target group after dependencies are gone."
      },
      {
        "id": "cs-8",
        "title": "Exam wording",
        "body": "Question says accidental deletion. Answer is deletion protection. Not security group or IAM alone."
      },
      {
        "id": "cs-9",
        "title": "Troubleshooting memory",
        "body": "Delete fails with protection enabled. This is expected. Check attributes before retrying."
      },
      {
        "id": "cs-10",
        "title": "Cost memory",
        "body": "Protected ALB still costs money. Protection does not pause billing. Clean up after labs."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Delete fails",
        "body": "Check deletion_protection.enabled. If true, disable it before deletion."
      },
      {
        "id": "ts-2",
        "title": "Attribute not found",
        "body": "Confirm you are using an Elastic Load Balancing v2 load balancer ARN."
      },
      {
        "id": "ts-3",
        "title": "AccessDenied",
        "body": "Check elasticloadbalancing:ModifyLoadBalancerAttributes and elasticloadbalancing:DeleteLoadBalancer."
      },
      {
        "id": "ts-4",
        "title": "Target group will not delete",
        "body": "Delete listeners and load balancer first. Then delete the target group."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Wrong: deletion protection stops billing. Correct: it only blocks deletion."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Wrong: deletion protection protects EC2 targets. Correct: it protects the load balancer resource."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Wrong: delete then disable protection. Correct: disable protection before delete."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Wrong: security group prevents ALB deletion. Correct: deletion protection is an ALB attribute."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "Safety catch before delete. Deletion protection is the safety catch on the load balancer delete button.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-elb-integrate-ec2-with-alb-and-nlb-026",
    "examCode": "aws-saa-c03",
    "topicId": "topic-elb",
    "title": "Integrate EC2 with ALB and NLB",
    "slug": "integrate-ec2-with-alb-and-nlb",
    "service": "Elastic Load Balancing",
    "feature": "Load Balancing",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Launch a small EC2 web server, place it behind an Application Load Balancer and a Network Load Balancer, then compare how each load balancer reaches the instance.",
    "status": "published",
    "tags": [
      "ELB",
      "Load Balancing",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Target groups",
        "body": "A target group is a set of destinations. In this lab, the destination is one EC2 instance running a simple web page."
      },
      {
        "id": "concept-2",
        "title": "ALB vs NLB",
        "body": "An ALB is best for HTTP and HTTPS web apps. An NLB is best for TCP, TLS, UDP, static IP style needs, and very high performance."
      },
      {
        "id": "concept-3",
        "title": "Comparison table",
        "body": "ComponentALB choiceNLB choiceReasonLayerLayer 7 HTTP/HTTPSLayer 4 TCP/TLS/UDPALB understands web requests. NLB handles network traffic.Target groupHTTP port 80TCP port 80Both can send traffic to EC2.Health checkHTTP path /TCP or HTTP checkALB checks app response. NLB can check port reachability.Best useWeb apps and path rulesStatic IP, TCP, very high performanceChoose based on protocol and routing need."
      }
    ],
    "whyItMatters": "This matters because load balancers are common in resilient AWS designs. The exam often asks when to choose ALB for web routing and when to choose NLB for network-level traffic.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "VPC",
        "value": "Default VPC with at least two public subnets"
      },
      {
        "label": "Instance name",
        "value": "saa-ec2-task26-web"
      },
      {
        "label": "Security group",
        "value": "saa-ec2-task26-web-sg"
      },
      {
        "label": "ALB name",
        "value": "saa-ec2-task26-alb"
      },
      {
        "label": "NLB name",
        "value": "saa-ec2-task26-nlb"
      },
      {
        "label": "Required permissions summary",
        "value": "STS identity check, EC2 launch and security group setup, ELB target group/listener/load balancer setup, health checks, and dependency-order cleanup."
      }
    ],
    "costWarning": "This lab can create charges. EC2 instances, Application Load Balancers, Network Load Balancers, data processing, and storage can cost money. Delete everything after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with ELB permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions in the table below."
          }
        ],
        "note": "PurposeExact actionsIdentitysts:GetCallerIdentityEC2 readec2:DescribeInstances, ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:DescribeImagesEC2 createec2:RunInstances, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:CreateTagsEC2 cleanupec2:TerminateInstances, ec2:DeleteSecurityGroupELB setupelasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:RegisterTargetsELB readelasticloadbalancing:DescribeLoadBalancers, elasticloadbalancing:DescribeTargetGroups, elasticloadbalancing:DescribeTargetHealth, elasticloadbalancing:DescribeListenersELB cleanupelasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroupIAM pass roleiam:PassRole if using an instance profile",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Find a VPC with two public subnets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Your VPCs."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use the default VPC in eu-west-2 if it exists."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Subnets and confirm at least two public subnets exist in different Availability Zones."
          }
        ],
        "note": "A public subnet usually has a route to an Internet Gateway. ALB and NLB need subnets in enabled Availability Zones.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a web security group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "In the left menu, choose Security Groups."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it saa-ec2-task26-web-sg."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Use the default VPC."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Add inbound HTTP on port 80 from 0.0.0.0/0."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose Create security group."
          }
        ],
        "note": null,
        "warning": "This is a learning lab. In a real app, restrict access where possible.",
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Launch a small EC2 web server",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Launch instances."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Name the instance saa-ec2-task26-web."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose t3.micro or another small free-tier style instance if available."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Place it in the default VPC and a public subnet."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Use the security group saa-ec2-task26-web-sg."
          },
          {
            "id": "console-step-4-item-9",
            "text": "Paste user data that installs a simple web page."
          },
          {
            "id": "console-step-4-item-10",
            "text": "Launch the instance."
          }
        ],
        "note": "Example user data: #!/bin/bash\\ndnf install -y httpd\\nsystemctl enable --now httpd\\necho 'Hello from EC2 behind ALB and NLB' > /var/www/html/index.html",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create the ALB target group",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Under Load Balancing, choose Target Groups."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Create target group."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Use protocol HTTP and port 80."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Name it saa-ec2-task26-alb-tg."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Use the default VPC."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Register the instance saa-ec2-task26-web."
          },
          {
            "id": "console-step-5-item-9",
            "text": "Create the target group."
          }
        ],
        "note": "Expected: the target should become healthy after the instance web server is ready.",
        "warning": null,
        "expectedResult": "Expected: the target should become healthy after the instance web server is ready."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create the Application Load Balancer",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "In EC2, under Load Balancing, choose Load Balancers."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Create load balancer."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Application Load Balancer."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Name it saa-ec2-task26-alb."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Choose Internet-facing."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose at least two public subnets."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Use or create a security group that allows HTTP port 80 from your test IP or 0.0.0.0/0 for the lab."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Create an HTTP listener on port 80 that forwards to saa-ec2-task26-alb-tg."
          },
          {
            "id": "console-step-6-item-9",
            "text": "Create the load balancer."
          }
        ],
        "note": null,
        "warning": "The ALB creates hourly charges until deleted.",
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Create the NLB target group and NLB",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "In EC2, choose Target Groups."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose Create target group."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Choose Instances."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Use protocol TCP and port 80."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Name it saa-ec2-task26-nlb-tg."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Register the same EC2 instance."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Now choose Load Balancers."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Choose Create load balancer."
          },
          {
            "id": "console-step-7-item-9",
            "text": "Choose Network Load Balancer."
          },
          {
            "id": "console-step-7-item-10",
            "text": "Name it saa-ec2-task26-nlb."
          },
          {
            "id": "console-step-7-item-11",
            "text": "Choose public subnets."
          },
          {
            "id": "console-step-7-item-12",
            "text": "Create a TCP listener on port 80 that forwards to saa-ec2-task26-nlb-tg."
          }
        ],
        "note": null,
        "warning": "The NLB also creates hourly charges until deleted.",
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Open both load balancer DNS names",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Open the Load Balancers page."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Select saa-ec2-task26-alb."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Copy its DNS name and open it in a browser."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Select saa-ec2-task26-nlb."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Copy its DNS name and open it in a browser."
          }
        ],
        "note": "Expected: both DNS names show the test web page after targets are healthy.",
        "warning": null,
        "expectedResult": "Expected: both DNS names show the test web page after targets are healthy."
      },
      {
        "id": "console-step-9",
        "number": 9,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-9-item-1",
            "text": "Delete the ALB listener if shown separately."
          },
          {
            "id": "console-step-9-item-2",
            "text": "Delete the NLB listener if shown separately."
          },
          {
            "id": "console-step-9-item-3",
            "text": "Delete saa-ec2-task26-alb."
          },
          {
            "id": "console-step-9-item-4",
            "text": "Delete saa-ec2-task26-nlb."
          },
          {
            "id": "console-step-9-item-5",
            "text": "Wait until both load balancers are deleted."
          },
          {
            "id": "console-step-9-item-6",
            "text": "Delete the ALB and NLB target groups."
          },
          {
            "id": "console-step-9-item-7",
            "text": "Terminate the EC2 instance."
          },
          {
            "id": "console-step-9-item-8",
            "text": "Delete the security groups after the instance and load balancers no longer use them."
          }
        ],
        "note": "Delete orderResourceWhy1ListenersListeners depend on target groups.2ALB and NLBLoad balancers create hourly charges.3Target groupsDelete after load balancers stop using them.4EC2 instanceStops compute charges.5Security groupDelete after no ENI uses it.",
        "warning": null,
        "expectedResult": "Step 9 completed successfully."
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Set safe CLI variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nVPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nSUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID Name=default-for-az,Values=true --query 'Subnets[0:2].SubnetId' --output text)\nAMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)\necho $VPC_ID\necho $SUBNETS\necho $AMI_ID"
          }
        ],
        "note": "Expected: you see a default VPC ID, two subnet IDs, and an Amazon Linux 2023 AMI ID.",
        "warning": null,
        "expectedResult": "Expected: you see a default VPC ID, two subnet IDs, and an Amazon Linux 2023 AMI ID."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the security group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name saa-ec2-task26-web-sg --description 'HTTP access for task 26' --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0\necho $SG_ID"
          }
        ],
        "note": "Expected: a security group ID is returned.",
        "warning": null,
        "expectedResult": "Expected: a security group ID is returned."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Launch the EC2 web server",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > /tmp/task26-user-data.sh <<'EOF'\n#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\necho 'Hello from EC2 behind ALB and NLB' > /var/www/html/index.html\nEOF\nINSTANCE_ID=$(aws ec2 run-instances --region $REGION --image-id $AMI_ID --instance-type t3.micro --subnet-id $(echo $SUBNETS | awk '{print $1}') --security-group-ids $SG_ID --user-data file:///tmp/task26-user-data.sh --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-task26-web}]' --query 'Instances[0].InstanceId' --output text)\naws ec2 wait instance-running --region $REGION --instance-ids $INSTANCE_ID\necho $INSTANCE_ID"
          }
        ],
        "note": "Expected: the instance reaches running state.",
        "warning": null,
        "expectedResult": "Expected: the instance reaches running state."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create ALB and NLB target groups",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "ALB_TG_ARN=$(aws elbv2 create-target-group --region $REGION --name saa-ec2-task26-alb-tg --protocol HTTP --port 80 --vpc-id $VPC_ID --target-type instance --health-check-protocol HTTP --health-check-path / --query 'TargetGroups[0].TargetGroupArn' --output text)\nNLB_TG_ARN=$(aws elbv2 create-target-group --region $REGION --name saa-ec2-task26-nlb-tg --protocol TCP --port 80 --vpc-id $VPC_ID --target-type instance --query 'TargetGroups[0].TargetGroupArn' --output text)\naws elbv2 register-targets --region $REGION --target-group-arn $ALB_TG_ARN --targets Id=$INSTANCE_ID\naws elbv2 register-targets --region $REGION --target-group-arn $NLB_TG_ARN --targets Id=$INSTANCE_ID\necho $ALB_TG_ARN\necho $NLB_TG_ARN"
          }
        ],
        "note": "Expected: both target group ARNs are shown.",
        "warning": null,
        "expectedResult": "Expected: both target group ARNs are shown."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the ALB and NLB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "ALB_ARN=$(aws elbv2 create-load-balancer --region $REGION --name saa-ec2-task26-alb --type application --scheme internet-facing --subnets $SUBNETS --security-groups $SG_ID --query 'LoadBalancers[0].LoadBalancerArn' --output text)\nNLB_ARN=$(aws elbv2 create-load-balancer --region $REGION --name saa-ec2-task26-nlb --type network --scheme internet-facing --subnets $SUBNETS --query 'LoadBalancers[0].LoadBalancerArn' --output text)\naws elbv2 wait load-balancer-available --region $REGION --load-balancer-arns $ALB_ARN $NLB_ARN\necho $ALB_ARN\necho $NLB_ARN"
          }
        ],
        "note": "Expected: both load balancers become available.",
        "warning": null,
        "expectedResult": "Expected: both load balancers become available."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Create listeners",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "ALB_LISTENER_ARN=$(aws elbv2 create-listener --region $REGION --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$ALB_TG_ARN --query 'Listeners[0].ListenerArn' --output text)\nNLB_LISTENER_ARN=$(aws elbv2 create-listener --region $REGION --load-balancer-arn $NLB_ARN --protocol TCP --port 80 --default-actions Type=forward,TargetGroupArn=$NLB_TG_ARN --query 'Listeners[0].ListenerArn' --output text)\necho $ALB_LISTENER_ARN\necho $NLB_LISTENER_ARN"
          }
        ],
        "note": "Expected: both listener ARNs are shown.",
        "warning": null,
        "expectedResult": "Expected: both listener ARNs are shown."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Get load balancer DNS names",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws elbv2 describe-load-balancers --region $REGION --load-balancer-arns $ALB_ARN $NLB_ARN --query 'LoadBalancers[].{Name:LoadBalancerName,DNS:DNSName}' --output table"
          }
        ],
        "note": "Open both DNS names in a browser. Expected: the test web page appears.",
        "warning": null,
        "expectedResult": "CLI command step 8 executed successfully."
      },
      {
        "id": "cli-step-9",
        "number": 9,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-9-cmd-1",
            "language": "bash",
            "text": "aws elbv2 delete-listener --region $REGION --listener-arn $ALB_LISTENER_ARN\naws elbv2 delete-listener --region $REGION --listener-arn $NLB_LISTENER_ARN\naws elbv2 delete-load-balancer --region $REGION --load-balancer-arn $ALB_ARN\naws elbv2 delete-load-balancer --region $REGION --load-balancer-arn $NLB_ARN\nsleep 60\naws elbv2 delete-target-group --region $REGION --target-group-arn $ALB_TG_ARN\naws elbv2 delete-target-group --region $REGION --target-group-arn $NLB_TG_ARN\naws ec2 terminate-instances --region $REGION --instance-ids $INSTANCE_ID\naws ec2 wait instance-terminated --region $REGION --instance-ids $INSTANCE_ID\naws ec2 delete-security-group --region $REGION --group-id $SG_ID\nrm -f /tmp/task26-user-data.sh"
          }
        ],
        "note": "Expected: load balancers, target groups, instance, security group, and local test file are removed.",
        "warning": "Destructive Command Warning: This command permanently terminates AWS resources, scaling policies, or load balancer configurations.",
        "expectedResult": "Expected: load balancers, target groups, instance, security group, and local test file are removed."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Load Balancing configuration verified in Elastic Load Balancing."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete listeners and listener rules from the load balancer."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the load balancer and associated target groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ALB",
        "body": "Use ALB for HTTP/HTTPS apps, host-based routing, path-based routing, and application-layer rules."
      },
      {
        "id": "cs-2",
        "title": "NLB",
        "body": "Use NLB for TCP, UDP, TLS, static IP style needs, and very high performance network traffic."
      },
      {
        "id": "cs-3",
        "title": "Load balancer comparison",
        "body": "ComponentALB choiceNLB choiceReasonLayerLayer 7 HTTP/HTTPSLayer 4 TCP/TLS/UDPALB understands web requests. NLB handles network traffic.Target groupHTTP port 80TCP port 80Both can send traffic to EC2.Health checkHTTP path /TCP or HTTP checkALB checks app response. NLB can check port reachability.Best useWeb apps and path rulesStatic IP, TCP, very high performanceChoose based on protocol and routing need."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check the identity with aws sts get-caller-identity. Then check the grouped permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "Targets stay unhealthy",
        "body": "Check the instance is running, the web server is installed, port 80 is open, and the health check path is correct."
      },
      {
        "id": "ts-3",
        "title": "ALB DNS name fails",
        "body": "Check the ALB security group allows inbound HTTP and that the target group has a healthy target."
      },
      {
        "id": "ts-4",
        "title": "Delete target group fails",
        "body": "Delete listeners and load balancers first. A target group cannot be deleted while a listener still uses it."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "ALB is not Layer 4",
        "body": "ALB is Layer 7. Choose it for HTTP and HTTPS routing features."
      },
      {
        "id": "trap-2",
        "title": "NLB is not for path routing",
        "body": "NLB does not inspect HTTP paths. Choose ALB for path-based routing."
      },
      {
        "id": "trap-3",
        "title": "Security groups still matter",
        "body": "The instance security group must allow the load balancer traffic to the application port."
      },
      {
        "id": "trap-4",
        "title": "Healthy targets are required",
        "body": "A load balancer DNS name can exist while targets are still unhealthy."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Load Balancing configuration and architectural patterns in Elastic Load Balancing."
      }
    ],
    "memoryHook": "ALB reads web requests. NLB moves network traffic. Use ALB for HTTP decisions and NLB for fast Layer 4 forwarding.",
    "flashcardSetId": "elb_task_26_flashcards"
  }
];
