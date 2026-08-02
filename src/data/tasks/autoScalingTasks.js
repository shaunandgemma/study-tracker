/**
 * EC2 Auto Scaling Hands-On Tasks & Guided AWS Labs (SAA-C03)
 * Total Converted Tasks: 9
 */

export const AUTO_SCALING_TASKS = [
  {
    "id": "task-saa-asg-add-an-auto-scaling-target-tracking-policy-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Add an Auto Scaling target tracking policy",
    "slug": "add-an-auto-scaling-target-tracking-policy",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create or update an Auto Scaling group with a target tracking policy and observe scale out and scale in signals.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Target tracking",
        "body": "Target tracking tries to keep a metric near a target value. It works like a thermostat."
      },
      {
        "id": "concept-2",
        "title": "Scale out",
        "body": "Scale out means add capacity. The ASG launches more instances."
      },
      {
        "id": "concept-3",
        "title": "Scale in",
        "body": "Scale in means remove capacity. The ASG terminates instances safely."
      },
      {
        "id": "concept-4",
        "title": "Scaling plan",
        "body": "SettingExample valueWhyMin1Keeps one instance runningDesired1Starts smallMax3Allows scale outMetricASGAverageCPUUtilizationCommon target tracking metricTarget50%Scale toward average CPU target"
      }
    ],
    "whyItMatters": "Target tracking is the simplest dynamic scaling choice for many workloads. For exams, it is often the best answer when the goal is to keep average CPU, request count, or load near a target.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "ASG name",
        "value": "saa-lbas-task5-asg"
      },
      {
        "label": "Launch template",
        "value": "saa-lbas-task5-lt"
      },
      {
        "label": "Min capacity",
        "value": "1"
      },
      {
        "label": "Desired capacity",
        "value": "1"
      },
      {
        "label": "Max capacity",
        "value": "3"
      },
      {
        "label": "Target metric",
        "value": "ASGAverageCPUUtilization"
      },
      {
        "label": "Target value",
        "value": "50"
      }
    ],
    "costWarning": "This lab can create charges for EC2 instances, EBS volumes, and any load balancer used with the ASG. Delete the ASG and launch template after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Auto Scaling setup: autoscaling:CreateAutoScalingGroup, autoscaling:UpdateAutoScalingGroup, autoscaling:PutScalingPolicy, autoscaling:DescribeAutoScalingGroups, autoscaling:DescribePolicies, autoscaling:DeleteAutoScalingGroup Launch template and EC2: ec2:CreateLaunchTemplate, ec2:DeleteLaunchTemplate, ec2:DescribeImages, ec2:DescribeSubnets, ec2:DescribeVpcs, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup CloudWatch visibility: cloudwatch:DescribeAlarms, cloudwatch:GetMetricData, cloudwatch:ListMetrics IAM pass role if used: iam:PassRole",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create or open an Auto Scaling group",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 → Auto Scaling Groups."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create a small ASG or open an existing lab ASG."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Use name saa-lbas-task5-asg."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set minimum 1, desired 1, maximum 3."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Use two subnets if possible."
          }
        ],
        "note": null,
        "warning": "Use lab instances only. Do not attach this policy to a production ASG.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Add a target tracking policy",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the ASG."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose the Automatic scaling tab."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create dynamic scaling policy."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Policy type: Target tracking scaling."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Metric type: Average CPU utilization."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Target value: 50."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Save the policy."
          }
        ],
        "note": "SettingExample valueWhyMin1Keeps one instance runningDesired1Starts smallMax3Allows scale outMetricASGAverageCPUUtilizationCommon target tracking metricTarget50%Scale toward average CPU target",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Observe scale out signals",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the ASG Activity tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open CloudWatch → Alarms."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Find alarms created by the target tracking policy."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Generate safe CPU load only if you understand the test command."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Watch for scale out activity if CPU stays above target."
          }
        ],
        "note": "Target tracking reacts to CloudWatch metric data. It is not instant.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Observe scale in signals",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Stop the test load."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Watch CloudWatch metrics drop below the target."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Watch the ASG activity history."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Expected: the ASG may scale in after cooldown and metric evaluation."
          }
        ],
        "note": "Scale in is usually more conservative than scale out.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Set ASG desired capacity to 0."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the ASG."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the security group if created."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete any load balancer or target group if used."
          }
        ],
        "note": null,
        "warning": "Delete dependent resources before deleting security groups.",
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
            "text": "export AWS_REGION=eu-west-2\nexport NAME=saa-lbas-task5\nexport ASG_NAME=${NAME}-asg\nexport LT_NAME=${NAME}-lt\nexport VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nexport SUBNETS=$(aws ec2 describe-subnets --region $AWS_REGION --filters Name=vpc-id,Values=$VPC_ID Name=default-for-az,Values=true --query 'Subnets[0:2].SubnetId' --output text | tr '\\t' ',')\necho $VPC_ID\necho $SUBNETS"
          }
        ],
        "note": "Expected: a default VPC and subnet list.",
        "warning": null,
        "expectedResult": "Expected: a default VPC and subnet list."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create a launch template placeholder",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "export AMI_ID=$(aws ec2 describe-images --region $AWS_REGION --owners amazon --filters 'Name=name,Values=al2023-ami-*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)\naws ec2 create-launch-template --region $AWS_REGION --launch-template-name $LT_NAME --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI_ID\\\",\\\"InstanceType\\\":\\\"t3.micro\\\"}\""
          }
        ],
        "note": "Expected: a launch template is created using a current Amazon Linux 2023 AMI.",
        "warning": null,
        "expectedResult": "Expected: a launch template is created using a current Amazon Linux 2023 AMI."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create the Auto Scaling group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws autoscaling create-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --launch-template LaunchTemplateName=$LT_NAME,Version='$Latest' --min-size 1 --desired-capacity 1 --max-size 3 --vpc-zone-identifier \"$SUBNETS\""
          }
        ],
        "note": "Expected: the ASG starts with one desired instance.",
        "warning": null,
        "expectedResult": "Expected: the ASG starts with one desired instance."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Add target tracking policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws autoscaling put-scaling-policy --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --policy-name ${NAME}-cpu50-policy --policy-type TargetTrackingScaling --target-tracking-configuration '{\"PredefinedMetricSpecification\":{\"PredefinedMetricType\":\"ASGAverageCPUUtilization\"},\"TargetValue\":50.0}'"
          }
        ],
        "note": "Expected: AWS creates scaling policy details and related CloudWatch alarms.",
        "warning": null,
        "expectedResult": "Expected: AWS creates scaling policy details and related CloudWatch alarms."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Observe scaling state",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-auto-scaling-groups --region $AWS_REGION --auto-scaling-group-names $ASG_NAME --query 'AutoScalingGroups[0].[MinSize,DesiredCapacity,MaxSize,Instances[*].LifecycleState]' --output table\naws autoscaling describe-policies --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --query 'ScalingPolicies[*].[PolicyName,PolicyType,TargetTrackingConfiguration.TargetValue]' --output table\naws cloudwatch describe-alarms --region $AWS_REGION --alarm-name-prefix TargetTracking --query 'MetricAlarms[*].[AlarmName,StateValue]' --output table"
          }
        ],
        "note": "Expected: ASG capacity and target tracking policy are visible.",
        "warning": null,
        "expectedResult": "Expected: ASG capacity and target tracking policy are visible."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Cleanup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws autoscaling update-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --min-size 0 --desired-capacity 0\naws autoscaling delete-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --force-delete\naws ec2 delete-launch-template --region $AWS_REGION --launch-template-name $LT_NAME"
          }
        ],
        "note": null,
        "warning": "Only run cleanup when finished. This deletes the ASG and its launch template.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Target tracking memory",
        "body": "Target tracking = keep a metric near a target. It is like a thermostat."
      },
      {
        "id": "cs-2",
        "title": "Scale out rule",
        "body": "Metric too high = add instances. The ASG increases capacity."
      },
      {
        "id": "cs-3",
        "title": "Scale in rule",
        "body": "Metric too low = remove instances. The ASG reduces capacity."
      },
      {
        "id": "cs-4",
        "title": "CPU target example",
        "body": "Average CPU target 50% is common for labs. Real targets depend on workload."
      },
      {
        "id": "cs-5",
        "title": "Capacity terms",
        "body": "Min = lowest allowed. Desired = current target count. Max = highest allowed."
      },
      {
        "id": "cs-6",
        "title": "CloudWatch link",
        "body": "Target tracking uses CloudWatch metrics. CloudWatch alarms are created for scaling decisions."
      },
      {
        "id": "cs-7",
        "title": "Cooldown memory",
        "body": "Scaling is not instant. Metrics and cooldowns affect timing."
      },
      {
        "id": "cs-8",
        "title": "Scale in caution",
        "body": "Scale in is careful. AWS avoids removing capacity too quickly."
      },
      {
        "id": "cs-9",
        "title": "Policy table",
        "body": "SettingExample valueWhyMin1Keeps one instance runningDesired1Starts smallMax3Allows scale outMetricASGAverageCPUUtilizationCommon target tracking metricTarget50%Scale toward average CPU target"
      },
      {
        "id": "cs-10",
        "title": "Target tracking vs step scaling",
        "body": "Target tracking = keep metric near target. Step scaling = react in steps to alarms."
      },
      {
        "id": "cs-11",
        "title": "Target tracking vs scheduled scaling",
        "body": "Target tracking reacts to load. Scheduled scaling reacts to time."
      },
      {
        "id": "cs-12",
        "title": "Common mistake",
        "body": "Max capacity too low blocks scale out. Min capacity too high blocks scale in."
      },
      {
        "id": "cs-13",
        "title": "Cost memory",
        "body": "More instances mean more cost. Delete the ASG after the lab."
      },
      {
        "id": "cs-14",
        "title": "Troubleshooting memory",
        "body": "No scale out = check max size. No scale in = check min size and cooldown."
      },
      {
        "id": "cs-15",
        "title": "Exam wording",
        "body": "Question says maintain CPU around a value. Think target tracking."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No scale out",
        "body": "Check max capacity. If max is already reached, ASG cannot add instances."
      },
      {
        "id": "ts-2",
        "title": "No scale in",
        "body": "Check min capacity. If min is too high, ASG cannot remove instances."
      },
      {
        "id": "ts-3",
        "title": "No alarms visible",
        "body": "Confirm the target tracking policy was created. Check CloudWatch in the same Region."
      },
      {
        "id": "ts-4",
        "title": "Instances fail to launch",
        "body": "Check launch template AMI, instance type, subnet capacity, and permissions."
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
        "body": "Target tracking is not manual scaling. It reacts to metrics."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Max capacity can stop scale out. Always check limits."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Min capacity can stop scale in. Always check limits."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Scheduled scaling is time-based. Target tracking is metric-based."
      },
      {
        "id": "trap-5",
        "title": "Trap 5",
        "body": "Step scaling needs alarm steps. Target tracking only needs a target value."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "Target tracking = thermostat. Too hot adds instances. Cool enough removes them.",
    "flashcardSetId": "asg_task_5_flashcards"
  },
  {
    "id": "task-saa-asg-tune-cooldown-and-instance-warmup-006",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Tune cooldown and instance warmup",
    "slug": "tune-cooldown-and-instance-warmup",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a small Auto Scaling Group, configure default cooldown and default instance warmup, and understand when each setting matters.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Cooldown",
        "body": "Cooldown is a pause after some scaling actions. It mainly matters for simple scaling policies. It helps stop repeated quick scaling moves."
      },
      {
        "id": "concept-2",
        "title": "Instance warmup",
        "body": "Instance warmup is time for a new instance to become useful. Auto Scaling avoids counting warming instances too early. Target tracking and step scaling use warmup behaviour."
      },
      {
        "id": "concept-3",
        "title": "Cooldown vs warmup plan",
        "body": "SettingMain useExam ideaExample valueDefaultCooldownSimple scaling pauseStops repeated actions300 secondsDefaultInstanceWarmupNew instance warmupBest for target tracking180 secondsHealthCheckGracePeriodBoot grace timeStops early replacement300 seconds"
      }
    ],
    "whyItMatters": "Auto Scaling can scale too quickly if new instances are not ready. Warmup and cooldown make scaling calmer and safer.",
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
        "label": "ASG name",
        "value": "saa-lbas-task-6-asg"
      },
      {
        "label": "Launch template",
        "value": "saa-lbas-task-6-lt"
      },
      {
        "label": "Security group",
        "value": "saa-lbas-task-6-sg"
      },
      {
        "label": "Default cooldown",
        "value": "300 seconds"
      },
      {
        "label": "Default instance warmup",
        "value": "180 seconds"
      },
      {
        "label": "Target tracking metric",
        "value": "Average CPU utilization 50%"
      }
    ],
    "costWarning": "Auto Scaling itself is free, but you are charged for the EC2 instances, EBS volumes, load balancers, and other connected resources created by the Auto Scaling group.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 setup: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:AuthorizeSecurityGroupEgress, ec2:RunInstances, ec2:TerminateInstances, ec2:DescribeImages, ec2:DescribeInstances Launch template: ec2:CreateLaunchTemplate, ec2:DeleteLaunchTemplate, ec2:DescribeLaunchTemplates Auto Scaling: autoscaling:CreateAutoScalingGroup, autoscaling:UpdateAutoScalingGroup, autoscaling:PutScalingPolicy, autoscaling:DescribeAutoScalingGroups, autoscaling:DescribePolicies, autoscaling:DescribeScalingActivities, autoscaling:DeleteAutoScalingGroup, autoscaling:DeletePolicy CloudWatch: cloudwatch:DescribeAlarms, cloudwatch:GetMetricData IAM pass role: iam:PassRole if an EC2 instance profile is used.",
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
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Go to Security groups."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create security group."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-lbas-task-6-sg."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Allow inbound HTTP 80 from 0.0.0.0/0 for lab testing."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Keep outbound traffic allowed."
          }
        ],
        "note": null,
        "warning": "For real systems, restrict inbound traffic to trusted sources or a load balancer security group.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a launch template",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Go to Launch Templates."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create launch template."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it saa-lbas-task-6-lt."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose an Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose t3.micro or another small test instance."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Use the security group saa-lbas-task-6-sg."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Add user data that installs a simple web page."
          }
        ],
        "note": "Example user data: #!/bin/bash dnf install -y httpd systemctl enable --now httpd echo Task 6 ASG warmup test > /var/www/html/index.html",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the Auto Scaling Group",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Go to Auto Scaling Groups."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Create Auto Scaling group."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Name it saa-lbas-task-6-asg."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Select launch template saa-lbas-task-6-lt."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Select at least two default subnets."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Set desired capacity 1, minimum 1, maximum 3."
          },
          {
            "id": "console-step-4-item-9",
            "text": "Set health check grace period to 300 seconds."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Set warmup and cooldown",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the Auto Scaling Group."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Details."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Set Default instance warmup to 180 seconds."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Set Default cooldown to 300 seconds if shown."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Save the changes."
          }
        ],
        "note": "Some console screens hide cooldown depending on the scaling policy type. CLI is the clearest way to set both values.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Add target tracking scaling",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the Auto Scaling Group."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Automatic scaling."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Create dynamic scaling policy."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Target tracking scaling."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Use Average CPU utilization."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Set target value to 50."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Keep scale-in enabled for the lab."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Verify scaling settings",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the Auto Scaling Group Details tab."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Confirm Default instance warmup is set."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open Automatic scaling."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Confirm the target tracking policy exists."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Open Activity to view scaling activity history."
          }
        ],
        "note": "Success means the ASG shows the configured warmup value and a target tracking policy.",
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
            "text": "Set ASG desired capacity, minimum, and maximum to 0."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Wait for instances to terminate."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Delete the scaling policy if it remains."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Delete the Auto Scaling Group."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Delete the security group."
          }
        ],
        "note": null,
        "warning": "Do not delete the launch template before the ASG is deleted.",
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
            "text": "export AWS_REGION=eu-west-2\nexport ASG_NAME=saa-lbas-task-6-asg\nexport LT_NAME=saa-lbas-task-6-lt\nexport SG_NAME=saa-lbas-task-6-sg\nexport VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nexport SUBNETS=$(aws ec2 describe-subnets --region $AWS_REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text | tr '\\t' ',')"
          }
        ],
        "note": "Expected: variables are set for the default VPC and two subnets.",
        "warning": null,
        "expectedResult": "Expected: variables are set for the default VPC and two subnets."
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
            "text": "export SG_ID=$(aws ec2 create-security-group --region $AWS_REGION --group-name $SG_NAME --description 'Task 6 ASG warmup lab SG' --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create launch template",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > /tmp/task6-user-data.sh <<'EOF'\n#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\necho 'Task 6 ASG warmup test' > /var/www/html/index.html\nEOF\nexport AMI_ID=$(aws ec2 describe-images --region $AWS_REGION --owners amazon --filters 'Name=name,Values=al2023-ami-*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)\naws ec2 create-launch-template --region $AWS_REGION --launch-template-name $LT_NAME --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI_ID\\\",\\\"InstanceType\\\":\\\"t3.micro\\\",\\\"SecurityGroupIds\\\":[\\\"$SG_ID\\\"],\\\"UserData\\\":\\\"$(base64 -w0 /tmp/task6-user-data.sh)\\\"}\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create ASG with warmup and cooldown",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws autoscaling create-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --launch-template LaunchTemplateName=$LT_NAME,Version='$Latest' --min-size 1 --max-size 3 --desired-capacity 1 --vpc-zone-identifier $SUBNETS --health-check-type EC2 --health-check-grace-period 300 --default-cooldown 300 --default-instance-warmup 180"
          }
        ],
        "note": "Expected: the ASG starts one instance.",
        "warning": null,
        "expectedResult": "Expected: the ASG starts one instance."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Add target tracking policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws autoscaling put-scaling-policy --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --policy-name task6-cpu-50 --policy-type TargetTrackingScaling --target-tracking-configuration '{\"PredefinedMetricSpecification\":{\"PredefinedMetricType\":\"ASGAverageCPUUtilization\"},\"TargetValue\":50.0}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Verify settings",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-auto-scaling-groups --region $AWS_REGION --auto-scaling-group-names $ASG_NAME --query 'AutoScalingGroups[0].{Cooldown:DefaultCooldown,Warmup:DefaultInstanceWarmup,Grace:HealthCheckGracePeriod,Desired:DesiredCapacity}'\naws autoscaling describe-policies --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --query 'ScalingPolicies[].{Name:PolicyName,Type:PolicyType}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 7 executed successfully."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws autoscaling delete-policy --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --policy-name task6-cpu-50 || true\naws autoscaling update-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --min-size 0 --max-size 0 --desired-capacity 0\naws autoscaling delete-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --force-delete\naws ec2 delete-launch-template --region $AWS_REGION --launch-template-name $LT_NAME\naws ec2 delete-security-group --region $AWS_REGION --group-id $SG_ID\nrm -f /tmp/task6-user-data.sh"
          }
        ],
        "note": null,
        "warning": "Cleanup terminates lab instances.",
        "expectedResult": "CLI command step 8 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Cooldown memory",
        "body": "Auto Scaling cooldown = pause after scaling. Cooldown is most linked to simple scaling. Cooldown reduces repeated scale actions."
      },
      {
        "id": "cs-2",
        "title": "Warmup memory",
        "body": "Instance warmup = new instance settling time. Warmup avoids counting fresh instances too soon. Warmup helps target tracking and step scaling."
      },
      {
        "id": "cs-3",
        "title": "Health grace memory",
        "body": "Health check grace period = boot protection. It gives new instances time to start. Without it, slow apps may be replaced early."
      },
      {
        "id": "cs-4",
        "title": "Target tracking choice",
        "body": "Target tracking = keep a metric near a target. Example: CPU near 50 percent. It is simpler than step scaling."
      },
      {
        "id": "cs-5",
        "title": "Simple scaling choice",
        "body": "Simple scaling = older style. Cooldown matters more here. Use step or target tracking in most exam designs."
      },
      {
        "id": "cs-6",
        "title": "Scale-out behaviour",
        "body": "Scale out should be fast enough. Warmup stops new capacity being counted too early. Do not set warmup too low for slow apps."
      },
      {
        "id": "cs-7",
        "title": "Scale-in behaviour",
        "body": "Scale in should be careful. Too much scale in can hurt availability. Use load balancer draining when targets are removed."
      },
      {
        "id": "cs-8",
        "title": "Metric trap",
        "body": "CPU is common, but not always best. Use request count for web traffic when needed. Use custom metrics for app-specific load."
      },
      {
        "id": "cs-9",
        "title": "Console verify",
        "body": "ASG Details = warmup and capacity. Automatic scaling = policy list. Activity tab = scaling history."
      },
      {
        "id": "cs-10",
        "title": "CLI verify",
        "body": "describe-auto-scaling-groups = ASG settings. describe-policies = policy type. describe-scaling-activities = scale events."
      },
      {
        "id": "cs-11",
        "title": "Common mistake",
        "body": "Do not confuse warmup with grace period. Warmup affects scaling metrics. Grace period affects health replacement timing."
      },
      {
        "id": "cs-12",
        "title": "Cost cleanup",
        "body": "ASG can recreate instances. Set desired, min, and max to zero before delete. Delete launch templates and security groups last."
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
        "title": "ASG keeps launching instances",
        "body": "The desired capacity is still above zero. Set desired, minimum, and maximum to 0 before cleanup."
      },
      {
        "id": "ts-3",
        "title": "No scaling activity",
        "body": "The metric may not cross the target. Check CloudWatch metric data and policy settings."
      },
      {
        "id": "ts-4",
        "title": "Instance replaced too early",
        "body": "Increase health check grace period. Slow boot scripts need more time."
      },
      {
        "id": "ts-5",
        "title": "Security group delete fails",
        "body": "The group is still attached to an ENI. Delete the ASG and wait for instances to terminate."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Cooldown is not warmup",
        "body": "Wrong choice: use cooldown to fix target tracking metric noise. Correct idea: use default instance warmup for target tracking and step scaling."
      },
      {
        "id": "trap-2",
        "title": "Grace period is separate",
        "body": "Wrong choice: use warmup to stop health replacement. Correct idea: use health check grace period for new instance boot time."
      },
      {
        "id": "trap-3",
        "title": "ASG desired capacity matters",
        "body": "Wrong choice: terminate instances manually and expect them to stay gone. Correct idea: ASG replaces instances to maintain desired capacity."
      },
      {
        "id": "trap-4",
        "title": "Metric choice matters",
        "body": "Wrong choice: always scale on CPU. Correct idea: choose the metric that best matches real load."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "Warmup counts new instances slowly. Cooldown slows repeat actions. Grace period protects new instances from early health replacement.",
    "flashcardSetId": "asg_task_6_flashcards"
  },
  {
    "id": "task-saa-asg-use-health-checks-and-termination-policies-007",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Use health checks and termination policies",
    "slug": "use-health-checks-and-termination-policies",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Connect an Auto Scaling Group to an ALB target group, use health checks to replace unhealthy instances, and choose termination policies to reduce risk during scale-in.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "EC2 health checks",
        "body": "EC2 health checks look at instance status. They do not prove your web app is working."
      },
      {
        "id": "concept-2",
        "title": "ELB health checks",
        "body": "ELB health checks test the target group path. They are better for web app health."
      },
      {
        "id": "concept-3",
        "title": "Health and termination plan",
        "body": "FeatureLab valuePurposeExam memoryHealth check typeELBUse target group healthChecks app pathGrace period300 secondsAllow boot timeStops early replacementTermination policyOldestLaunchTemplateRemove older config firstSafer rollout cleanupDeregistration delay60 secondsDrain connectionsProtect users"
      }
    ],
    "whyItMatters": "Health checks keep capacity useful. Termination policies help Auto Scaling choose which instance to remove during scale-in.",
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
        "value": "saa-lbas-task-7-alb"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task-7-tg"
      },
      {
        "label": "ASG name",
        "value": "saa-lbas-task-7-asg"
      },
      {
        "label": "Launch template",
        "value": "saa-lbas-task-7-lt"
      },
      {
        "label": "Health check path",
        "value": "/"
      },
      {
        "label": "Health check grace",
        "value": "300 seconds"
      }
    ],
    "costWarning": "Auto Scaling itself is free, but you are charged for the EC2 instances, EBS volumes, load balancers, and other connected resources created by the Auto Scaling group.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 and VPC setup: ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:RunInstances, ec2:TerminateInstances, ec2:DescribeInstances Launch template: ec2:CreateLaunchTemplate, ec2:DeleteLaunchTemplate, ec2:DescribeLaunchTemplates Load balancer: elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:DescribeTargetHealth, elasticloadbalancing:DeleteListener, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup Auto Scaling: autoscaling:CreateAutoScalingGroup, autoscaling:UpdateAutoScalingGroup, autoscaling:AttachLoadBalancerTargetGroups, autoscaling:DescribeAutoScalingGroups, autoscaling:DescribeTerminationPolicyTypes, autoscaling:DeleteAutoScalingGroup CloudWatch: cloudwatch:DescribeAlarms",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create security groups",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open VPC."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create saa-lbas-task-7-alb-sg in the default VPC."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Allow inbound HTTP 80 from 0.0.0.0/0."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create saa-lbas-task-7-instance-sg in the same VPC."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Allow inbound HTTP 80 from the ALB security group."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Keep outbound allowed."
          }
        ],
        "note": "The instance security group should trust the ALB security group, not the whole internet.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create a target group",
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
            "text": "Choose Create target group."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose target type Instances."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Name it saa-lbas-task-7-tg."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Protocol HTTP, port 80."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Set health check path to /."
          },
          {
            "id": "console-step-3-item-9",
            "text": "Set deregistration delay to 60 seconds under target group attributes."
          }
        ],
        "note": "Success means the target group exists with HTTP health checks.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create an ALB",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Go to Load Balancers."
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
            "text": "Name it saa-lbas-task-7-alb."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Scheme: Internet-facing."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Select at least two default subnets."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Choose security group saa-lbas-task-7-alb-sg."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Create an HTTP listener forwarding to saa-lbas-task-7-tg."
          }
        ],
        "note": null,
        "warning": "An internet-facing ALB can create cost and public access. Delete it after the lab.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create launch template and ASG",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Create a launch template named saa-lbas-task-7-lt."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Use Amazon Linux 2023 and t3.micro."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Use security group saa-lbas-task-7-instance-sg."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Add user data to install Apache and return a simple page."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Create an Auto Scaling Group named saa-lbas-task-7-asg."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Use the launch template."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Select at least two default subnets."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Set desired 2, minimum 2, maximum 4."
          },
          {
            "id": "console-step-5-item-9",
            "text": "Attach the target group saa-lbas-task-7-tg."
          },
          {
            "id": "console-step-5-item-10",
            "text": "Set health check type to ELB."
          },
          {
            "id": "console-step-5-item-11",
            "text": "Set health check grace period to 300 seconds."
          }
        ],
        "note": "Example user data: #!/bin/bash dnf install -y httpd systemctl enable --now httpd echo Healthy from $(hostname) > /var/www/html/index.html",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Set termination policy",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open the Auto Scaling Group."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Details."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Edit."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Find Termination policies."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Choose OldestLaunchTemplate or Default for comparison."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Save changes."
          }
        ],
        "note": "Use termination policy to control scale-in choice. Unhealthy replacement can bypass normal termination policy choice.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Verify health replacement behaviour",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Open the target group."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose Targets."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Wait until both instances are healthy."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Open the ALB DNS name in a browser."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Stop one ASG instance from the EC2 Instances page."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Watch Auto Scaling activity replace it."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Confirm the target group returns to healthy capacity."
          }
        ],
        "note": null,
        "warning": "Stopping or terminating an ASG instance is safe only in this lab because the ASG replaces it.",
        "expectedResult": "Step 7 completed successfully."
      },
      {
        "id": "console-step-8",
        "number": 8,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-8-item-1",
            "text": "Set ASG desired, minimum, and maximum capacity to 0."
          },
          {
            "id": "console-step-8-item-2",
            "text": "Wait for instances to terminate."
          },
          {
            "id": "console-step-8-item-3",
            "text": "Delete the Auto Scaling Group."
          },
          {
            "id": "console-step-8-item-4",
            "text": "Delete the ALB listener."
          },
          {
            "id": "console-step-8-item-5",
            "text": "Delete the ALB."
          },
          {
            "id": "console-step-8-item-6",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-8-item-7",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-8-item-8",
            "text": "Delete instance and ALB security groups."
          }
        ],
        "note": null,
        "warning": "Delete the ASG before deleting the launch template and security groups.",
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
            "text": "export AWS_REGION=eu-west-2\nexport ALB_NAME=saa-lbas-task-7-alb\nexport TG_NAME=saa-lbas-task-7-tg\nexport ASG_NAME=saa-lbas-task-7-asg\nexport LT_NAME=saa-lbas-task-7-lt\nexport VPC_ID=$(aws ec2 describe-vpcs --region $AWS_REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nexport SUBNETS_CSV=$(aws ec2 describe-subnets --region $AWS_REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text | tr '\\t' ',')\nexport SUBNETS_SPACE=$(echo $SUBNETS_CSV | tr ',' ' ')"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
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
            "text": "export ALB_SG=$(aws ec2 create-security-group --region $AWS_REGION --group-name saa-lbas-task-7-alb-sg --description 'Task 7 ALB SG' --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0\nexport INSTANCE_SG=$(aws ec2 create-security-group --region $AWS_REGION --group-name saa-lbas-task-7-instance-sg --description 'Task 7 instance SG' --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $AWS_REGION --group-id $INSTANCE_SG --protocol tcp --port 80 --source-group $ALB_SG"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create target group and ALB",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "export TG_ARN=$(aws elbv2 create-target-group --region $AWS_REGION --name $TG_NAME --protocol HTTP --port 80 --vpc-id $VPC_ID --health-check-path / --target-type instance --query 'TargetGroups[0].TargetGroupArn' --output text)\naws elbv2 modify-target-group-attributes --region $AWS_REGION --target-group-arn $TG_ARN --attributes Key=deregistration_delay.timeout_seconds,Value=60\nexport ALB_ARN=$(aws elbv2 create-load-balancer --region $AWS_REGION --name $ALB_NAME --subnets $SUBNETS_SPACE --security-groups $ALB_SG --scheme internet-facing --type application --query 'LoadBalancers[0].LoadBalancerArn' --output text)\nexport LISTENER_ARN=$(aws elbv2 create-listener --region $AWS_REGION --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=$TG_ARN --query 'Listeners[0].ListenerArn' --output text)"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create launch template and ASG",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > /tmp/task7-user-data.sh <<'EOF'\n#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\necho \"Healthy from $(hostname)\" > /var/www/html/index.html\nEOF\nexport AMI_ID=$(aws ec2 describe-images --region $AWS_REGION --owners amazon --filters 'Name=name,Values=al2023-ami-*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)\naws ec2 create-launch-template --region $AWS_REGION --launch-template-name $LT_NAME --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI_ID\\\",\\\"InstanceType\\\":\\\"t3.micro\\\",\\\"SecurityGroupIds\\\":[\\\"$INSTANCE_SG\\\"],\\\"UserData\\\":\\\"$(base64 -w0 /tmp/task7-user-data.sh)\\\"}\"\naws autoscaling create-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --launch-template LaunchTemplateName=$LT_NAME,Version='$Latest' --min-size 2 --max-size 4 --desired-capacity 2 --vpc-zone-identifier $SUBNETS_CSV --target-group-arns $TG_ARN --health-check-type ELB --health-check-grace-period 300 --termination-policies OldestLaunchTemplate"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Verify health and policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-auto-scaling-groups --region $AWS_REGION --auto-scaling-group-names $ASG_NAME --query 'AutoScalingGroups[0].{HealthCheckType:HealthCheckType,Grace:HealthCheckGracePeriod,TerminationPolicies:TerminationPolicies,Desired:DesiredCapacity}'\naws elbv2 describe-target-health --region $AWS_REGION --target-group-arn $TG_ARN --query 'TargetHealthDescriptions[].{Target:Target.Id,State:TargetHealth.State}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
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
            "text": "aws autoscaling update-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --min-size 0 --max-size 0 --desired-capacity 0\naws autoscaling delete-auto-scaling-group --region $AWS_REGION --auto-scaling-group-name $ASG_NAME --force-delete\naws elbv2 delete-listener --region $AWS_REGION --listener-arn $LISTENER_ARN || true\naws elbv2 delete-load-balancer --region $AWS_REGION --load-balancer-arn $ALB_ARN\nsleep 60\naws elbv2 delete-target-group --region $AWS_REGION --target-group-arn $TG_ARN\naws ec2 delete-launch-template --region $AWS_REGION --launch-template-name $LT_NAME\naws ec2 delete-security-group --region $AWS_REGION --group-id $INSTANCE_SG\naws ec2 delete-security-group --region $AWS_REGION --group-id $ALB_SG\nrm -f /tmp/task7-user-data.sh"
          }
        ],
        "note": null,
        "warning": "Cleanup terminates lab instances and deletes the public ALB.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "EC2 health checks",
        "body": "EC2 health checks = instance infrastructure health. They do not check your app URL. They are basic but useful."
      },
      {
        "id": "cs-2",
        "title": "ELB health checks",
        "body": "ELB health checks = target group health. They check a protocol, port, and path. They are better for web apps."
      },
      {
        "id": "cs-3",
        "title": "Grace period",
        "body": "Health grace period = new instance boot time. It stops early replacement. Set it longer for slow installs."
      },
      {
        "id": "cs-4",
        "title": "Unhealthy replacement",
        "body": "ASG maintains desired capacity. Unhealthy instances are replaced. Manual termination also triggers replacement."
      },
      {
        "id": "cs-5",
        "title": "Termination policy",
        "body": "Termination policy = scale-in choice. It tells ASG which instance to remove. It helps reduce rollout risk."
      },
      {
        "id": "cs-6",
        "title": "OldestLaunchTemplate",
        "body": "OldestLaunchTemplate = remove old config first. Useful after launch template changes. Good for cleaning old versions."
      },
      {
        "id": "cs-7",
        "title": "ClosestToNextInstanceHour",
        "body": "ClosestToNextInstanceHour = older billing idea. Less important now for per-second billing. Know it may appear in older material."
      },
      {
        "id": "cs-8",
        "title": "Default termination",
        "body": "Default policy balances Availability Zones first. Then it applies policy logic. AZ balance is a key exam idea."
      },
      {
        "id": "cs-9",
        "title": "Deregistration delay",
        "body": "Deregistration delay = connection draining. It lets active requests finish. It protects users during scale-in."
      },
      {
        "id": "cs-10",
        "title": "Target health verify",
        "body": "Target group Targets tab shows state. Healthy means ALB can route traffic. Unhealthy means check app, port, path, or SG."
      },
      {
        "id": "cs-11",
        "title": "Common mistake",
        "body": "Do not allow instance HTTP from the internet. Allow HTTP from the ALB security group. This is safer and cleaner."
      },
      {
        "id": "cs-12",
        "title": "Cleanup memory",
        "body": "Delete ASG first. Delete ALB next. Delete target group and security groups last."
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
        "title": "Targets unhealthy",
        "body": "Check instance security group, user data, health check path, and application port."
      },
      {
        "id": "ts-3",
        "title": "ASG does not replace quickly",
        "body": "Check health check grace period. A long grace period delays replacement decisions."
      },
      {
        "id": "ts-4",
        "title": "ALB not reachable",
        "body": "Check ALB scheme, subnets, security group inbound rule, and listener."
      },
      {
        "id": "ts-5",
        "title": "Security group delete fails",
        "body": "Wait for ALB and instances to release ENIs, then delete the security groups."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "EC2 vs ELB health",
        "body": "Wrong choice: EC2 health check proves web app health. Correct idea: ELB health check tests the app target path."
      },
      {
        "id": "trap-2",
        "title": "Grace period trap",
        "body": "Wrong choice: zero grace period for slow apps. Correct idea: give new instances time to boot."
      },
      {
        "id": "trap-3",
        "title": "Termination policy trap",
        "body": "Wrong choice: termination policy fixes unhealthy replacement order. Correct idea: unhealthy replacement can bypass normal policy choice."
      },
      {
        "id": "trap-4",
        "title": "Scale-in risk",
        "body": "Wrong choice: remove any instance instantly. Correct idea: use deregistration delay and sensible termination policy."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "ELB health checks ask: can the app answer? Termination policies ask: which instance should go first?",
    "flashcardSetId": "asg_task_7_flashcards"
  },
  {
    "id": "task-saa-asg-create-and-roll-out-auto-scaling-launch-template-versions-012",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Create and roll out Auto Scaling launch template versions",
    "slug": "create-and-roll-out-auto-scaling-launch-template-versions",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create a launch template, create a new version, update the Auto Scaling group, and roll out the change with an instance refresh.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Launch template",
        "body": "A launch template stores EC2 launch settings. It can hold AMI, instance type, user data, security groups, and IAM role."
      },
      {
        "id": "concept-2",
        "title": "Launch template version",
        "body": "Each change creates a new version. The ASG can use a specific version, the default version, or the latest version."
      },
      {
        "id": "concept-3",
        "title": "Instance refresh",
        "body": "Instance refresh replaces existing ASG instances in a controlled rollout. It is safer than manually terminating all instances."
      },
      {
        "id": "concept-4",
        "title": "Version rollout plan",
        "body": "ItemVersion 1Version 2ReasonAMIAmazon Linux 2023Amazon Linux 2023Keep OS simpleInstance typet3.microt3.microLow lab costUser dataVersion 1 pageVersion 2 pageEasy visual testRolloutInitial ASGInstance refreshControlled replacement"
      }
    ],
    "whyItMatters": "Launch templates matter because ASGs use them to know how to create EC2 instances. For the exam, launch templates are the modern choice. Launch configurations are legacy.",
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
        "label": "Launch template",
        "value": "saa-lbas-task12-lt"
      },
      {
        "label": "Auto Scaling group",
        "value": "saa-lbas-task12-asg"
      },
      {
        "label": "Security group",
        "value": "saa-lbas-task12-sg"
      },
      {
        "label": "Instance type",
        "value": "t3.micro"
      },
      {
        "label": "Desired capacity",
        "value": "2"
      }
    ],
    "costWarning": "Auto Scaling itself is free, but you are charged for the EC2 instances, EBS volumes, load balancers, and other connected resources created by the Auto Scaling group.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Launch templates: ec2:CreateLaunchTemplate, ec2:CreateLaunchTemplateVersion, ec2:DescribeLaunchTemplates, ec2:DescribeLaunchTemplateVersions, ec2:ModifyLaunchTemplate, ec2:DeleteLaunchTemplate EC2 setup: ec2:DescribeImages, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup Auto Scaling: autoscaling:CreateAutoScalingGroup, autoscaling:UpdateAutoScalingGroup, autoscaling:StartInstanceRefresh, autoscaling:DescribeAutoScalingGroups, autoscaling:DescribeInstanceRefreshes, autoscaling:DeleteAutoScalingGroup Pass role if used: iam:PassRole",
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
            "text": "Name it saa-lbas-task12-sg."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Add inbound HTTP from 0.0.0.0/0 for lab testing."
          }
        ],
        "note": null,
        "warning": "Do not use open HTTP rules for private workloads unless there is a real reason.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create launch template version 1",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2 → Launch Templates."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create launch template."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name it saa-lbas-task12-lt."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose an Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose t3.micro."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Select saa-lbas-task12-sg."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Add user data that writes Version 1 to a simple web page."
          }
        ],
        "note": "Success: launch template version 1 exists.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create the Auto Scaling group",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open EC2 → Auto Scaling Groups."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Create Auto Scaling group."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Name it saa-lbas-task12-asg."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select launch template saa-lbas-task12-lt version 1."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose two default subnets in different Availability Zones."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Set desired capacity to 2."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Keep minimum 1 and maximum 2."
          }
        ],
        "note": "Success: two instances launch from version 1.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create launch template version 2",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the launch template."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Actions → Modify template or Create new version."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Keep the same settings."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Change user data so the page says Version 2."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Create the new version."
          }
        ],
        "note": "Success: version 2 exists.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Update the ASG and start instance refresh",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open Auto Scaling Groups."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select saa-lbas-task12-asg."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Edit launch template settings."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Change the version to 2."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Open the Instance refresh tab."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose Start instance refresh."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Use a small minimum healthy percentage for the lab, such as 50."
          }
        ],
        "note": "Success: old instances are replaced gradually.",
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
            "text": "Set ASG desired capacity, minimum, and maximum to 0."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Wait until instances terminate."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the Auto Scaling group."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the security group."
          }
        ],
        "note": null,
        "warning": "Delete the ASG before deleting the launch template and security group.",
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
        "title": "Create variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nLT_NAME=saa-lbas-task12-lt\nASG_NAME=saa-lbas-task12-asg\nSG_NAME=saa-lbas-task12-sg\nVPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nSUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text | tr '\\t' ',')"
          }
        ],
        "note": "Expected: variables hold the default VPC and two subnet IDs.",
        "warning": null,
        "expectedResult": "Expected: variables hold the default VPC and two subnet IDs."
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
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name $SG_NAME --description 'Task 12 launch template lab' --vpc-id $VPC_ID --query GroupId --output text)\naws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Find an Amazon Linux 2023 AMI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)\necho $AMI_ID"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create launch template version 1",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "cat > user-data-v1.sh <<'EOF'\n#!/bin/bash\ndnf install -y httpd\necho 'Version 1 from launch template' > /var/www/html/index.html\nsystemctl enable --now httpd\nEOF\nUSER_DATA_V1=$(base64 -w 0 user-data-v1.sh)\naws ec2 create-launch-template --region $REGION --launch-template-name $LT_NAME --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI_ID\\\",\\\"InstanceType\\\":\\\"t3.micro\\\",\\\"SecurityGroupIds\\\":[\\\"$SG_ID\\\"],\\\"UserData\\\":\\\"$USER_DATA_V1\\\"}\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Create the Auto Scaling group",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws autoscaling create-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --launch-template LaunchTemplateName=$LT_NAME,Version=1 --min-size 1 --max-size 2 --desired-capacity 2 --vpc-zone-identifier $SUBNETS"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Create version 2 and roll out",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "cat > user-data-v2.sh <<'EOF'\n#!/bin/bash\ndnf install -y httpd\necho 'Version 2 from launch template' > /var/www/html/index.html\nsystemctl enable --now httpd\nEOF\nUSER_DATA_V2=$(base64 -w 0 user-data-v2.sh)\naws ec2 create-launch-template-version --region $REGION --launch-template-name $LT_NAME --source-version 1 --launch-template-data \"{\\\"UserData\\\":\\\"$USER_DATA_V2\\\"}\"\naws autoscaling update-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --launch-template LaunchTemplateName=$LT_NAME,Version=2\naws autoscaling start-instance-refresh --region $REGION --auto-scaling-group-name $ASG_NAME --preferences MinHealthyPercentage=50"
          }
        ],
        "note": "Expected: instance refresh starts and replaces old instances.",
        "warning": null,
        "expectedResult": "Expected: instance refresh starts and replaces old instances."
      },
      {
        "id": "cli-step-8",
        "number": 8,
        "title": "Verify and clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-8-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-instance-refreshes --region $REGION --auto-scaling-group-name $ASG_NAME --query 'InstanceRefreshes[0].Status' --output text\naws autoscaling update-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --min-size 0 --max-size 0 --desired-capacity 0\naws autoscaling delete-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --force-delete\naws ec2 delete-launch-template --region $REGION --launch-template-name $LT_NAME\naws ec2 delete-security-group --region $REGION --group-id $SG_ID\nrm -f user-data-v1.sh user-data-v2.sh"
          }
        ],
        "note": null,
        "warning": "Wait for instances to terminate before deleting the security group if deletion fails.",
        "expectedResult": "CLI command step 8 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Launch template = modern ASG config",
        "body": "Launch template = modern EC2 launch settings. Launch configuration = legacy. Exam answer usually prefers launch templates."
      },
      {
        "id": "cs-2",
        "title": "Versioning rule",
        "body": "Launch template change = new version. Old versions stay available. ASG can point to a specific version."
      },
      {
        "id": "cs-3",
        "title": "Default version trap",
        "body": "Default version is not always the ASG version. Changing default version may not update an ASG that uses a specific version."
      },
      {
        "id": "cs-4",
        "title": "Latest version trap",
        "body": "Latest version can be risky. New changes may affect future launches unexpectedly. Specific version is safer for controlled rollout."
      },
      {
        "id": "cs-5",
        "title": "Instance refresh",
        "body": "Instance refresh = controlled replacement. It rolls new settings across ASG instances. It helps avoid manual instance termination."
      },
      {
        "id": "cs-6",
        "title": "Minimum healthy percentage",
        "body": "Minimum healthy percentage protects capacity. Higher value = safer but slower rollout. Lower value = faster but more risk."
      },
      {
        "id": "cs-7",
        "title": "Launch template contents",
        "body": "Launch template can include AMI, instance type, user data, IAM role, network settings, and security groups."
      },
      {
        "id": "cs-8",
        "title": "User data test",
        "body": "User data can prove which version launched. Version 1 page and Version 2 page make testing easy."
      },
      {
        "id": "cs-9",
        "title": "ASG does not instantly replace all instances",
        "body": "Updating the launch template version affects future launches. Use instance refresh to replace existing instances."
      },
      {
        "id": "cs-10",
        "title": "Rollback memory",
        "body": "Rollback = point ASG back to old version. Then start another instance refresh."
      },
      {
        "id": "cs-11",
        "title": "Cost memory",
        "body": "ASG cost comes from EC2 instances. Keep desired capacity low. Set desired capacity to zero before cleanup."
      },
      {
        "id": "cs-12",
        "title": "Cleanup order",
        "body": "Delete ASG first. Then delete launch template. Then delete security group."
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
        "title": "No new instances appear",
        "body": "Check ASG desired capacity, subnet capacity, and launch template AMI."
      },
      {
        "id": "ts-3",
        "title": "Instances fail health checks",
        "body": "Check user data, security group port 80, and instance activity history."
      },
      {
        "id": "ts-4",
        "title": "Instance refresh is slow",
        "body": "Check minimum healthy percentage and health check grace period."
      },
      {
        "id": "ts-5",
        "title": "Security group will not delete",
        "body": "Wait until all ASG instances are terminated, then delete the security group."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Launch configuration trap",
        "body": "Wrong: choose launch configuration for new ASG features. Correct: choose launch template."
      },
      {
        "id": "trap-2",
        "title": "Existing instances trap",
        "body": "Wrong: ASG update replaces all instances automatically. Correct: use instance refresh or scaling activity."
      },
      {
        "id": "trap-3",
        "title": "Default version trap",
        "body": "Wrong: default version always controls the ASG. Correct: ASG may use a specific version."
      },
      {
        "id": "trap-4",
        "title": "Latest version trap",
        "body": "Wrong: latest is always safest. Correct: specific version is safer for production rollout."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "Template version first. Refresh second. The ASG must know the new version before it can roll it out.",
    "flashcardSetId": "asg_task_12_flashcards"
  },
  {
    "id": "task-saa-asg-configure-an-asg-mixed-instances-policy-013",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Configure an ASG mixed instances policy",
    "slug": "configure-an-asg-mixed-instances-policy",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Create an Auto Scaling group that can use On-Demand and Spot capacity across multiple instance types.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Mixed instances policy",
        "body": "A mixed instances policy lets one ASG use multiple instance types and purchase options."
      },
      {
        "id": "concept-2",
        "title": "On-Demand base capacity",
        "body": "Base capacity is the minimum On-Demand amount before Spot is used."
      },
      {
        "id": "concept-3",
        "title": "Spot capacity",
        "body": "Spot can reduce cost. Spot can be interrupted. Use it for fault-tolerant workloads."
      },
      {
        "id": "concept-4",
        "title": "Mixed policy plan",
        "body": "SettingLab valueReasonOn-Demand base1Keeps one stable instanceOn-Demand percentage above base50Mixes On-Demand and SpotInstance typest3.micro, t3a.micro, t2.microMore capacity choicesDesired capacity3Shows the mix clearlyAllocation strategyCapacity optimized where availableReduces Spot interruption risk"
      }
    ],
    "whyItMatters": "Mixed instances policies matter because they balance cost and availability. For exams, choose them when the workload can tolerate Spot interruptions and needs flexible capacity.",
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
        "label": "Launch template",
        "value": "saa-lbas-task13-lt"
      },
      {
        "label": "Auto Scaling group",
        "value": "saa-lbas-task13-asg"
      },
      {
        "label": "Instance types",
        "value": "t3.micro, t3a.micro, t2.micro"
      },
      {
        "label": "Desired capacity",
        "value": "3"
      },
      {
        "label": "On-Demand base",
        "value": "1"
      },
      {
        "label": "Spot usage",
        "value": "Allowed above base"
      }
    ],
    "costWarning": "Auto Scaling itself is free, but you are charged for the EC2 instances, EBS volumes, load balancers, and other connected resources created by the Auto Scaling group.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 setup: ec2:DescribeImages, ec2:DescribeSubnets, ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup Launch templates: ec2:CreateLaunchTemplate, ec2:DeleteLaunchTemplate Auto Scaling mixed policy: autoscaling:CreateAutoScalingGroup, autoscaling:UpdateAutoScalingGroup, autoscaling:DescribeAutoScalingGroups, autoscaling:DeleteAutoScalingGroup Cleanup: ec2:TerminateInstances if manual cleanup is needed",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a basic launch template",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 → Launch Templates."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create launch template."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Name it saa-lbas-task13-lt."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Choose Amazon Linux 2023."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose t3.micro as the template instance type."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Add a simple HTTP user data script if you want a test page."
          }
        ],
        "note": "The mixed policy can override the instance type later.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the Auto Scaling group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2 → Auto Scaling Groups."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create Auto Scaling group."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name it saa-lbas-task13-asg."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select launch template saa-lbas-task13-lt."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose multiple default subnets across at least two AZs."
          }
        ],
        "note": "Multi-AZ subnets give the ASG more placement choices.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Enable mixed instances policy",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In instance purchase options, choose a mixed instances setup."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Add instance types t3.micro, t3a.micro, and t2.micro."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set On-Demand base capacity to 1."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set On-Demand percentage above base to 50 for the lab."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Allow Spot for the remaining capacity."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Set desired capacity to 3."
          }
        ],
        "note": "Success: the ASG can launch a mix of On-Demand and Spot capacity.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Verify the running mix",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the ASG."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose the Instance management tab."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Check the instance types."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Check lifecycle values if visible."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Open EC2 Instances to confirm the launched types."
          }
        ],
        "note": "Capacity may vary based on current Spot availability.",
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
            "text": "Set ASG desired capacity, minimum, and maximum to 0."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Wait for instances to terminate."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the Auto Scaling group."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the security group if created."
          }
        ],
        "note": null,
        "warning": "Delete the ASG before deleting launch template dependencies.",
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
        "title": "Create variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nLT_NAME=saa-lbas-task13-lt\nASG_NAME=saa-lbas-task13-asg\nVPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nSUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:3].SubnetId' --output text | tr '\\t' ',')"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create launch template",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)\naws ec2 create-launch-template --region $REGION --launch-template-name $LT_NAME --launch-template-data \"{\\\"ImageId\\\":\\\"$AMI_ID\\\",\\\"InstanceType\\\":\\\"t3.micro\\\"}\""
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create a mixed instances ASG",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > mixed-policy.json <<'EOF'\n{\n  \"LaunchTemplate\": {\n    \"LaunchTemplateSpecification\": {\n      \"LaunchTemplateName\": \"saa-lbas-task13-lt\",\n      \"Version\": \"$Default\"\n    },\n    \"Overrides\": [\n      { \"InstanceType\": \"t3.micro\" },\n      { \"InstanceType\": \"t3a.micro\" },\n      { \"InstanceType\": \"t2.micro\" }\n    ]\n  },\n  \"InstancesDistribution\": {\n    \"OnDemandBaseCapacity\": 1,\n    \"OnDemandPercentageAboveBaseCapacity\": 50,\n    \"SpotAllocationStrategy\": \"capacity-optimized\"\n  }\n}\nEOF\naws autoscaling create-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --mixed-instances-policy file://mixed-policy.json --min-size 1 --max-size 3 --desired-capacity 3 --vpc-zone-identifier $SUBNETS"
          }
        ],
        "note": "Expected: ASG launches up to three instances using allowed instance types.",
        "warning": null,
        "expectedResult": "Expected: ASG launches up to three instances using allowed instance types."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Verify and clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-auto-scaling-groups --region $REGION --auto-scaling-group-names $ASG_NAME --query 'AutoScalingGroups[0].Instances[*].[InstanceId,InstanceType,LifecycleState]' --output table\naws autoscaling update-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --min-size 0 --max-size 0 --desired-capacity 0\naws autoscaling delete-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --force-delete\naws ec2 delete-launch-template --region $REGION --launch-template-name $LT_NAME\nrm -f mixed-policy.json"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently terminates AWS resources, scaling policies, or load balancer configurations.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Mixed instances policy",
        "body": "Mixed policy = multiple instance types. Mixed policy = On-Demand plus Spot. Use it for cost and capacity flexibility."
      },
      {
        "id": "cs-2",
        "title": "Spot exam decision",
        "body": "Spot = cheapest EC2 option. Spot = can be interrupted. Use Spot for stateless or fault-tolerant work."
      },
      {
        "id": "cs-3",
        "title": "On-Demand base",
        "body": "On-Demand base = stable minimum capacity. It protects critical baseline capacity."
      },
      {
        "id": "cs-4",
        "title": "Percentage above base",
        "body": "Percentage above base controls On-Demand vs Spot after base capacity."
      },
      {
        "id": "cs-5",
        "title": "Multiple instance types",
        "body": "More instance types = better chance of capacity. More choices help Spot and scaling success."
      },
      {
        "id": "cs-6",
        "title": "Capacity optimized Spot",
        "body": "Capacity optimized chooses Spot pools with better available capacity. It can reduce interruption risk."
      },
      {
        "id": "cs-7",
        "title": "ASG desired capacity",
        "body": "Desired capacity is total capacity. It can include both On-Demand and Spot instances."
      },
      {
        "id": "cs-8",
        "title": "Launch template role",
        "body": "Launch template gives default launch settings. Mixed policy can override instance types."
      },
      {
        "id": "cs-9",
        "title": "Workload fit",
        "body": "Good fit = stateless web workers, batch workers, ECS capacity. Poor fit = fragile single-instance database."
      },
      {
        "id": "cs-10",
        "title": "Cost trap",
        "body": "Spot is cheaper, not free. On-Demand baseline still costs money."
      },
      {
        "id": "cs-11",
        "title": "Availability trap",
        "body": "Spot capacity is not guaranteed. Use multiple AZs and instance types."
      },
      {
        "id": "cs-12",
        "title": "Cleanup memory",
        "body": "Set desired capacity to zero. Delete ASG. Delete launch template."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check Auto Scaling, EC2, and launch template permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "No Spot instances launch",
        "body": "Spot capacity may not be available for the chosen types or AZs."
      },
      {
        "id": "ts-3",
        "title": "Invalid instance type",
        "body": "Check that the instance type is offered in the selected Region and AZ."
      },
      {
        "id": "ts-4",
        "title": "ASG launches only one type",
        "body": "That can be normal. The ASG chooses based on availability and policy."
      },
      {
        "id": "ts-5",
        "title": "Cleanup blocked",
        "body": "Wait until the ASG finishes terminating instances before deleting dependencies."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Spot guarantee trap",
        "body": "Wrong: Spot guarantees capacity. Correct: Spot can be interrupted or unavailable."
      },
      {
        "id": "trap-2",
        "title": "Single instance type trap",
        "body": "Wrong: one instance type is best for Spot. Correct: multiple types improve capacity options."
      },
      {
        "id": "trap-3",
        "title": "Critical workload trap",
        "body": "Wrong: put all critical capacity on Spot. Correct: use On-Demand base or resilient design."
      },
      {
        "id": "trap-4",
        "title": "Savings trap",
        "body": "Wrong: mixed policy is only for cost. Correct: it also improves capacity flexibility."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "Base is safe. Spot is savings. Use On-Demand for the baseline and Spot for flexible extra capacity.",
    "flashcardSetId": "asg_task_13_flashcards"
  },
  {
    "id": "task-saa-asg-compare-ec2-and-elb-health-checks-in-an-auto-scaling-group-014",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Compare EC2 and ELB health checks in an Auto Scaling group",
    "slug": "compare-ec2-and-elb-health-checks-in-an-auto-scaling-group",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Attach an ASG to an ALB target group, compare EC2 and ELB health checks, and observe replacement behaviour.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "EC2 health check",
        "body": "EC2 health checks look at instance status. They do not prove that the web application works."
      },
      {
        "id": "concept-2",
        "title": "ELB health check",
        "body": "ELB health checks test the target group health path. They can detect application failure."
      },
      {
        "id": "concept-3",
        "title": "Replacement behaviour",
        "body": "When ASG marks an InService instance unhealthy, it terminates and replaces it to keep desired capacity."
      },
      {
        "id": "concept-4",
        "title": "Health check comparison",
        "body": "Health checkChecksGood forMain trapEC2Instance statusHardware or host failureApp can be broken but EC2 healthyELBTarget group health pathWeb app healthNeeds load balancer target groupGrace periodStartup wait timeAvoid early replacementToo short can replace good instancesASG replacementDesired capacitySelf-healingNeeds correct health source"
      }
    ],
    "whyItMatters": "Health check type matters because EC2 health and application health are not the same. For exams, use ELB health checks when an ASG must replace instances that fail application checks behind a load balancer.",
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
        "label": "ALB",
        "value": "saa-lbas-task14-alb"
      },
      {
        "label": "Target group",
        "value": "saa-lbas-task14-tg"
      },
      {
        "label": "ASG",
        "value": "saa-lbas-task14-asg"
      },
      {
        "label": "Launch template",
        "value": "saa-lbas-task14-lt"
      },
      {
        "label": "Health path",
        "value": "/health"
      },
      {
        "label": "Desired capacity",
        "value": "2"
      }
    ],
    "costWarning": "Auto Scaling itself is free, but you are charged for the EC2 instances, EBS volumes, load balancers, and other connected resources created by the Auto Scaling group.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity EC2 and load balancer setup: ec2:DescribeSubnets, ec2:DescribeSecurityGroups, elasticloadbalancing:CreateLoadBalancer, elasticloadbalancing:CreateTargetGroup, elasticloadbalancing:CreateListener, elasticloadbalancing:DescribeTargetHealth, elasticloadbalancing:DeleteLoadBalancer, elasticloadbalancing:DeleteTargetGroup Auto Scaling: autoscaling:CreateAutoScalingGroup, autoscaling:UpdateAutoScalingGroup, autoscaling:AttachLoadBalancerTargetGroups, autoscaling:DescribeAutoScalingGroups, autoscaling:DeleteAutoScalingGroup Health checks: autoscaling:SetInstanceHealth, autoscaling:DescribeScalingActivities Launch templates: ec2:CreateLaunchTemplate, ec2:DeleteLaunchTemplate",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the ALB target group",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2 → Target Groups."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create target group."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose target type Instances."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-lbas-task14-tg."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Protocol HTTP, port 80."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Set health check path to /health."
          }
        ],
        "note": "Success: target group exists with an application health path.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create an Application Load Balancer",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open EC2 → Load Balancers."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create load balancer."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Application Load Balancer."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name it saa-lbas-task14-alb."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select at least two default subnets."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Create an HTTP listener on port 80 forwarding to saa-lbas-task14-tg."
          }
        ],
        "note": "Success: ALB forwards requests to the target group.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create launch template and ASG",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Create a launch template that installs a web server."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Make the app return 200 OK at /health."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Create ASG saa-lbas-task14-asg across two subnets."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Attach target group saa-lbas-task14-tg."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Set desired capacity to 2."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Start with health check type EC2."
          }
        ],
        "note": "Success: targets become healthy in the target group.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Compare EC2 and ELB health checks",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open the ASG details."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Find Health checks."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Note the current health check type is EC2."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Change health check type to ELB."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Set a health check grace period, such as 120 seconds."
          }
        ],
        "note": "ELB health checks allow ASG to react to target group health.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Observe replacement behaviour",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Use the ASG Instance management tab."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Mark one instance unhealthy for a safe lab simulation, or break the health endpoint on one instance."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Watch the ASG activity history."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Confirm the unhealthy instance is terminated."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Confirm a replacement instance launches."
          }
        ],
        "note": null,
        "warning": "Do not break production instances to test this.",
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Set ASG desired capacity, minimum, and maximum to 0."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Wait until ASG instances terminate."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete the Auto Scaling group."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the load balancer listener if needed."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete the load balancer."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Delete the target group."
          },
          {
            "id": "console-step-7-item-7",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-7-item-8",
            "text": "Delete security groups created for the lab."
          }
        ],
        "note": null,
        "warning": "Delete the load balancer before deleting its security group.",
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
        "title": "Create variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=eu-west-2\nASG_NAME=saa-lbas-task14-asg\nTG_NAME=saa-lbas-task14-tg\nALB_NAME=saa-lbas-task14-alb\nLT_NAME=saa-lbas-task14-lt\nVPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=is-default,Values=true --query 'Vpcs[0].VpcId' --output text)\nSUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text | tr '\\t' ',')"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create target group and ALB placeholders",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws elbv2 create-target-group --region $REGION --name $TG_NAME --protocol HTTP --port 80 --vpc-id $VPC_ID --health-check-path /health --target-type instance\nTG_ARN=$(aws elbv2 describe-target-groups --region $REGION --names $TG_NAME --query 'TargetGroups[0].TargetGroupArn' --output text)\necho $TG_ARN"
          }
        ],
        "note": "Expected: target group ARN is returned. Create ALB security groups as needed before a real ALB command.",
        "warning": null,
        "expectedResult": "Expected: target group ARN is returned. Create ALB security groups as needed before a real ALB command."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Attach target group and switch health type",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "# After creating the ASG and ALB, attach the target group and use ELB health checks.\naws autoscaling attach-load-balancer-target-groups --region $REGION --auto-scaling-group-name $ASG_NAME --target-group-arns $TG_ARN\naws autoscaling update-auto-scaling-group --region $REGION --auto-scaling-group-name $ASG_NAME --health-check-type ELB --health-check-grace-period 120"
          }
        ],
        "note": "Expected: ASG uses ELB health checks after the update.",
        "warning": null,
        "expectedResult": "Expected: ASG uses ELB health checks after the update."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Simulate unhealthy instance and verify replacement",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "INSTANCE_ID=$(aws autoscaling describe-auto-scaling-groups --region $REGION --auto-scaling-group-names $ASG_NAME --query 'AutoScalingGroups[0].Instances[0].InstanceId' --output text)\naws autoscaling set-instance-health --region $REGION --instance-id $INSTANCE_ID --health-status Unhealthy\naws autoscaling describe-scaling-activities --region $REGION --auto-scaling-group-name $ASG_NAME --max-items 5 --output table"
          }
        ],
        "note": null,
        "warning": "This intentionally causes replacement in the lab ASG.",
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up reminder",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "# Delete resources in this order after testing:\n# 1. Set ASG capacity to 0\n# 2. Delete ASG\n# 3. Delete ALB\n# 4. Delete target group\n# 5. Delete launch template\n# 6. Delete security groups"
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
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "EC2 health check",
        "body": "EC2 health check = instance status. It checks the VM health. It does not check your web page."
      },
      {
        "id": "cs-2",
        "title": "ELB health check",
        "body": "ELB health check = target group health. It checks the app path. It can detect broken app servers."
      },
      {
        "id": "cs-3",
        "title": "ASG replacement",
        "body": "ASG replaces unhealthy instances. It keeps desired capacity. Replacement uses current ASG settings."
      },
      {
        "id": "cs-4",
        "title": "Health check grace period",
        "body": "Grace period gives new instances time to boot. Too short can cause false failures."
      },
      {
        "id": "cs-5",
        "title": "Target group path",
        "body": "Health path should be simple. Use /health or similar. It should return 200."
      },
      {
        "id": "cs-6",
        "title": "EC2 vs ELB decision",
        "body": "Use EC2 health for basic instance health. Use ELB health for application health behind a load balancer."
      },
      {
        "id": "cs-7",
        "title": "Common exam wording",
        "body": "Question says app is not responding. Best answer is often ELB health checks with ASG replacement."
      },
      {
        "id": "cs-8",
        "title": "Target unhealthy causes",
        "body": "Wrong port. Wrong path. Security group blocks ALB. App not running."
      },
      {
        "id": "cs-9",
        "title": "Security group memory",
        "body": "ALB security group allows users. Instance security group allows ALB. Do not open instance to everyone unless needed."
      },
      {
        "id": "cs-10",
        "title": "Replacement trigger",
        "body": "ASG must know the instance is unhealthy. ELB health check type connects target health to ASG replacement."
      },
      {
        "id": "cs-11",
        "title": "Operational check",
        "body": "Check target health. Check ASG activity history. Check instance status checks."
      },
      {
        "id": "cs-12",
        "title": "Cleanup order",
        "body": "Scale ASG down first. Delete ASG. Delete ALB. Delete target group."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Targets unhealthy",
        "body": "Check health path, app process, port 80, and security group rules."
      },
      {
        "id": "ts-2",
        "title": "ASG does not replace target",
        "body": "Confirm ASG health check type is ELB, not only EC2."
      },
      {
        "id": "ts-3",
        "title": "Replacement loop",
        "body": "Increase health check grace period and fix the boot script."
      },
      {
        "id": "ts-4",
        "title": "AccessDenied",
        "body": "Check ELB, Auto Scaling, and EC2 permissions in Console step 0."
      },
      {
        "id": "ts-5",
        "title": "ALB cannot reach instances",
        "body": "Allow inbound traffic from the ALB security group to the instance security group."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Instance healthy but app broken",
        "body": "Wrong: EC2 health check always detects app failure. Correct: use ELB health checks for app health."
      },
      {
        "id": "trap-2",
        "title": "Grace period trap",
        "body": "Wrong: terminate immediately during boot. Correct: grace period avoids early false replacement."
      },
      {
        "id": "trap-3",
        "title": "Target group trap",
        "body": "Wrong: ALB target unhealthy always means EC2 failed. Correct: app path, port, or SG may be wrong."
      },
      {
        "id": "trap-4",
        "title": "ASG setting trap",
        "body": "Wrong: attaching an ALB always changes ASG health type. Correct: check and set health check type."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "EC2 checks the machine. ELB checks the app. Use ELB health checks when the ASG must replace broken application instances.",
    "flashcardSetId": "asg_task_14_flashcards"
  },
  {
    "id": "task-saa-asg-scaling-types-comparison-015",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Scaling Types Comparison",
    "slug": "scaling-types-comparison",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Compare target tracking, step scaling, and scheduled scaling, then know when to use each.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Target tracking",
        "body": "Target tracking works like a thermostat. You set a target value. Auto Scaling adjusts capacity to stay near it."
      },
      {
        "id": "concept-2",
        "title": "Step scaling",
        "body": "Step scaling uses alarm breach size. A small breach can add one instance. A large breach can add more."
      },
      {
        "id": "concept-3",
        "title": "Scheduled scaling",
        "body": "Scheduled scaling uses time. Use it when demand is known before it happens."
      },
      {
        "id": "concept-4",
        "title": "Scaling type comparison",
        "body": "Scaling typeBest useTriggerExam memoryTarget trackingKeep a metric near a targetCloudWatch metric targetSimple and commonStep scalingReact in different sizesCloudWatch alarm breach sizeMore controlScheduled scalingKnown traffic timeDate, time, or recurrencePredictable demand"
      }
    ],
    "whyItMatters": "This matters because load balancing and scaling are core SAA-C03 topics. Real systems need safe traffic handling, predictable scaling, and clean recovery when capacity changes.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "ASG name",
        "value": "saa-lbas-task-15-asg"
      },
      {
        "label": "Launch template",
        "value": "saa-lbas-task-15-lt"
      },
      {
        "label": "Target CPU",
        "value": "50%"
      },
      {
        "label": "Scheduled action time",
        "value": "Example future time during lab"
      }
    ],
    "costWarning": "Auto Scaling itself is free, but you are charged for the EC2 instances, EBS volumes, load balancers, and other connected resources created by the Auto Scaling group.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
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
        "title": "Create or reuse a small Auto Scaling group",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Go to Auto Scaling Groups."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create an ASG named saa-lbas-task-15-asg."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use a launch template with Amazon Linux."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Use the default VPC and two subnets."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Set desired capacity to 1, minimum to 1, and maximum to 3."
          }
        ],
        "note": "Keep the lab small to reduce cost.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Add target tracking scaling",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the ASG."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Automatic scaling."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Create dynamic scaling policy."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Target tracking scaling."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Use average CPU utilization."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Set the target value to 50."
          }
        ],
        "note": "Target tracking is the normal exam answer for simple metric-based scaling.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review step scaling behaviour",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Stay in Automatic scaling."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Review the option for Step scaling."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Notice that step scaling depends on CloudWatch alarms."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Use it when scale size should change based on alarm severity."
          }
        ],
        "note": "You do not need to force a high CPU test for this comparison lab.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Add a scheduled scaling action",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Choose Scheduled actions."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Create a future action for the same day."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Set desired capacity to 2."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Wait until the action time or review the action configuration."
          }
        ],
        "note": null,
        "warning": "Delete the scheduled action during teardown so it does not scale later.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down in dependency order",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete the scheduled action."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete scaling policies."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Set ASG desired capacity to 0."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the ASG."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the launch template."
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
            "text": "REGION=eu-west-2\nASG_NAME=saa-lbas-task-15-asg"
          }
        ],
        "note": "Use these names if you created the ASG in the Console.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "View the ASG",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-auto-scaling-groups --region $REGION --auto-scaling-group-names $ASG_NAME"
          }
        ],
        "note": "Expected: the ASG shows desired, minimum, and maximum capacity.",
        "warning": null,
        "expectedResult": "Expected: the ASG shows desired, minimum, and maximum capacity."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create target tracking policy example",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "cat > target-tracking.json <<'EOF'\n{\n  \"PredefinedMetricSpecification\": {\n    \"PredefinedMetricType\": \"ASGAverageCPUUtilization\"\n  },\n  \"TargetValue\": 50.0\n}\nEOF\naws autoscaling put-scaling-policy --region $REGION --auto-scaling-group-name $ASG_NAME --policy-name saa-lbas-task-15-target-tracking --policy-type TargetTrackingScaling --target-tracking-configuration file://target-tracking.json"
          }
        ],
        "note": "Expected: AWS returns policy details and creates CloudWatch alarms.",
        "warning": null,
        "expectedResult": "Expected: AWS returns policy details and creates CloudWatch alarms."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "List scaling policies",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-policies --region $REGION --auto-scaling-group-name $ASG_NAME"
          }
        ],
        "note": "Expected: you can see the target tracking policy.",
        "warning": null,
        "expectedResult": "Expected: you can see the target tracking policy."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Cleanup policy example",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws autoscaling delete-policy --region $REGION --auto-scaling-group-name $ASG_NAME --policy-name saa-lbas-task-15-target-tracking\nrm -f target-tracking.json"
          }
        ],
        "note": null,
        "warning": "Only run cleanup after you finish reviewing the policy.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Target tracking",
        "body": "Auto Scaling target tracking = keep a metric near a target. Best for CPU, requests, or average utilization. Exam memory = thermostat."
      },
      {
        "id": "cs-2",
        "title": "Step scaling",
        "body": "Auto Scaling step scaling = choose scale size by alarm breach. Bigger breach can add more capacity. Best when you need custom control."
      },
      {
        "id": "cs-3",
        "title": "Scheduled scaling",
        "body": "Auto Scaling scheduled scaling = scale at a known time. Best for predictable demand. Example = Monday morning traffic."
      },
      {
        "id": "cs-4",
        "title": "Comparison table",
        "body": "Scaling typeBest useTriggerExam memoryTarget trackingKeep a metric near a targetCloudWatch metric targetSimple and commonStep scalingReact in different sizesCloudWatch alarm breach sizeMore controlScheduled scalingKnown traffic timeDate, time, or recurrencePredictable demand"
      },
      {
        "id": "cs-5",
        "title": "Simple exam choice",
        "body": "Unknown traffic = target tracking. Known traffic time = scheduled scaling. Different reaction sizes = step scaling."
      },
      {
        "id": "cs-6",
        "title": "CloudWatch role",
        "body": "CloudWatch metrics drive dynamic scaling. Target tracking creates alarms for you. Step scaling usually uses alarms you manage."
      },
      {
        "id": "cs-7",
        "title": "Scale out vs scale in",
        "body": "Scale out = add capacity. Scale in = remove capacity. Scale in should be more careful."
      },
      {
        "id": "cs-8",
        "title": "Minimum capacity",
        "body": "Minimum capacity = lowest allowed size. Auto Scaling will not go below it. Wrong minimum can block scale-in."
      },
      {
        "id": "cs-9",
        "title": "Maximum capacity",
        "body": "Maximum capacity = highest allowed size. Wrong maximum can block scale-out. Exam questions often hide this."
      },
      {
        "id": "cs-10",
        "title": "Cooldown and warmup",
        "body": "Cooldown prevents rapid repeated changes. Instance warmup ignores new instances until ready. Use warmup for target tracking accuracy."
      },
      {
        "id": "cs-11",
        "title": "Cost warning",
        "body": "Scaling out creates more EC2 cost. Scheduled actions can run later. Delete policies and actions after labs."
      },
      {
        "id": "cs-12",
        "title": "Verification memory",
        "body": "Verify ASG activity history. Verify CloudWatch alarms. Verify desired capacity changed."
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
        "title": "No scale out",
        "body": "Check maximum capacity, metric data, and CloudWatch alarm state."
      },
      {
        "id": "ts-3",
        "title": "No scale in",
        "body": "Check minimum capacity and scale-in cooldown."
      },
      {
        "id": "ts-4",
        "title": "Scheduled action runs later",
        "body": "Delete scheduled actions during teardown."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Scheduled scaling is not for unknown traffic spikes."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "Step scaling is not the simplest choice for normal CPU tracking."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Target tracking needs a useful metric that changes with capacity."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "Scaling policy cannot pass the ASG maximum size."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "Thermostat, ladder, calendar. Target tracking is the thermostat. Step scaling is the ladder. Scheduled scaling is the calendar.",
    "flashcardSetId": "asg_task_15_flashcards"
  },
  {
    "id": "task-saa-asg-lifecycle-hooks-016",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Lifecycle Hooks",
    "slug": "lifecycle-hooks",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Pause instance launch or termination so a script or manual action can run before Auto Scaling continues.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Lifecycle hook",
        "body": "A lifecycle hook pauses an instance during launch or termination. This gives scripts or people time to act."
      },
      {
        "id": "concept-2",
        "title": "Wait state",
        "body": "The instance waits before moving to the next lifecycle state. The default wait is one hour."
      },
      {
        "id": "concept-3",
        "title": "Heartbeat timeout",
        "body": "Heartbeat timeout controls how long Auto Scaling waits. You can complete, continue, or abandon the action."
      },
      {
        "id": "concept-4",
        "title": "Lifecycle hook plan",
        "body": "Hook typeWhen it pausesCommon useContinue actionLaunchBefore InServiceInstall software or register appComplete lifecycle actionTerminateBefore TerminatedDrain logs or notify systemComplete lifecycle action"
      }
    ],
    "whyItMatters": "This matters because load balancing and scaling are core SAA-C03 topics. Real systems need safe traffic handling, predictable scaling, and clean recovery when capacity changes.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "ASG name",
        "value": "saa-lbas-task-16-asg"
      },
      {
        "label": "Launch hook",
        "value": "saa-lbas-task-16-launch-hook"
      },
      {
        "label": "Terminate hook",
        "value": "saa-lbas-task-16-terminate-hook"
      },
      {
        "label": "Heartbeat timeout",
        "value": "300 seconds"
      }
    ],
    "costWarning": "This lab can run EC2 instances while lifecycle hooks wait. Keep timeouts short and delete the ASG after testing.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
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
        "title": "Create or reuse a small ASG",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Go to Auto Scaling Groups."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create an ASG named saa-lbas-task-16-asg if needed."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Use desired capacity 1, minimum 1, maximum 2."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Add a launch lifecycle hook",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the ASG."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Instance management or Lifecycle hooks depending on console layout."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create a lifecycle hook."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set lifecycle transition to Instance launch."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set heartbeat timeout to 300 seconds."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Set default result to CONTINUE."
          }
        ],
        "note": "This pauses a new instance before it becomes InService.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Trigger launch hook",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Increase desired capacity from 1 to 2."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Open Instance management."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Watch the new instance enter a wait state."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Wait for the hook to continue or complete it manually using CLI."
          }
        ],
        "note": null,
        "warning": "Do not leave the ASG scaled out after the lab.",
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Add a terminate lifecycle hook",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Create another lifecycle hook."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Set lifecycle transition to Instance terminate."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Set heartbeat timeout to 300 seconds."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Set default result to CONTINUE."
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
            "text": "Set ASG desired capacity to 0."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete lifecycle hooks."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete the ASG."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Delete the launch template."
          },
          {
            "id": "console-step-6-item-5",
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
            "text": "REGION=eu-west-2\nASG_NAME=saa-lbas-task-16-asg"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create launch lifecycle hook",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws autoscaling put-lifecycle-hook --region $REGION --auto-scaling-group-name $ASG_NAME --lifecycle-hook-name saa-lbas-task-16-launch-hook --lifecycle-transition autoscaling:EC2_INSTANCE_LAUNCHING --heartbeat-timeout 300 --default-result CONTINUE"
          }
        ],
        "note": "Expected: no output means the hook was created or updated.",
        "warning": null,
        "expectedResult": "Expected: no output means the hook was created or updated."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create terminate lifecycle hook",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws autoscaling put-lifecycle-hook --region $REGION --auto-scaling-group-name $ASG_NAME --lifecycle-hook-name saa-lbas-task-16-terminate-hook --lifecycle-transition autoscaling:EC2_INSTANCE_TERMINATING --heartbeat-timeout 300 --default-result CONTINUE"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Describe lifecycle hooks",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-lifecycle-hooks --region $REGION --auto-scaling-group-name $ASG_NAME"
          }
        ],
        "note": "Expected: both hooks are listed.",
        "warning": null,
        "expectedResult": "Expected: both hooks are listed."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Delete lifecycle hooks",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws autoscaling delete-lifecycle-hook --region $REGION --auto-scaling-group-name $ASG_NAME --lifecycle-hook-name saa-lbas-task-16-launch-hook\naws autoscaling delete-lifecycle-hook --region $REGION --auto-scaling-group-name $ASG_NAME --lifecycle-hook-name saa-lbas-task-16-terminate-hook"
          }
        ],
        "note": null,
        "warning": "Run after testing.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Lifecycle hook purpose",
        "body": "Lifecycle hooks pause launch or termination. Use them to run scripts or manual checks."
      },
      {
        "id": "cs-2",
        "title": "Launch hook",
        "body": "Launch hook = before instance enters service. Good for bootstrap checks. Good for security agent install."
      },
      {
        "id": "cs-3",
        "title": "Terminate hook",
        "body": "Terminate hook = before instance fully terminates. Good for log upload. Good for graceful shutdown."
      },
      {
        "id": "cs-4",
        "title": "Hook comparison",
        "body": "Hook typeWhen it pausesCommon useContinue actionLaunchBefore InServiceInstall software or register appComplete lifecycle actionTerminateBefore TerminatedDrain logs or notify systemComplete lifecycle action"
      },
      {
        "id": "cs-5",
        "title": "Heartbeat timeout",
        "body": "Heartbeat timeout = wait time. Default can be long. Set a small lab value."
      },
      {
        "id": "cs-6",
        "title": "Default result",
        "body": "CONTINUE = move on after timeout. ABANDON = stop the lifecycle action. Use carefully."
      },
      {
        "id": "cs-7",
        "title": "Complete action",
        "body": "CompleteLifecycleAction tells ASG to continue. Use it after the script finishes."
      },
      {
        "id": "cs-8",
        "title": "Common integration",
        "body": "Lifecycle hook can trigger EventBridge. EventBridge can trigger Lambda. Lambda can finish setup."
      },
      {
        "id": "cs-9",
        "title": "Exam clue",
        "body": "Question says pause launch or termination. Answer is lifecycle hook."
      },
      {
        "id": "cs-10",
        "title": "Not a health check",
        "body": "Lifecycle hook is not a health check. Health check decides if replacement is needed."
      },
      {
        "id": "cs-11",
        "title": "Not user data only",
        "body": "User data runs on boot. Lifecycle hook controls ASG state timing."
      },
      {
        "id": "cs-12",
        "title": "Cleanup",
        "body": "Delete hooks before deleting the ASG. Do not leave wait states in a lab."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "AccessDenied",
        "body": "Check Auto Scaling permissions in Console step 0."
      },
      {
        "id": "ts-2",
        "title": "Instance stuck waiting",
        "body": "Check heartbeat timeout and lifecycle hook state."
      },
      {
        "id": "ts-3",
        "title": "Hook not firing",
        "body": "Confirm the hook is attached to the correct ASG and transition."
      },
      {
        "id": "ts-4",
        "title": "Unexpected continue",
        "body": "Check the default result and timeout."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Trap 1",
        "body": "Lifecycle hooks pause the lifecycle. They do not replace unhealthy instances by themselves."
      },
      {
        "id": "trap-2",
        "title": "Trap 2",
        "body": "User data alone does not pause ASG registration."
      },
      {
        "id": "trap-3",
        "title": "Trap 3",
        "body": "Termination lifecycle hook is not the same as deregistration delay."
      },
      {
        "id": "trap-4",
        "title": "Trap 4",
        "body": "A hook needs completion or timeout before transition continues."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "Pause before go. Lifecycle hooks pause the instance before Auto Scaling lets it move on.",
    "flashcardSetId": "asg_task_16_flashcards"
  },
  {
    "id": "task-saa-asg-set-up-an-ec2-auto-scaling-group-009",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ec2-asg",
    "title": "Set up an EC2 Auto Scaling Group",
    "slug": "set-up-an-ec2-auto-scaling-group",
    "service": "EC2 Auto Scaling",
    "feature": "Auto Scaling",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Create a launch template and an Auto Scaling group that keeps one EC2 instance running.",
    "status": "published",
    "tags": [
      "Auto Scaling",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Auto Scaling Group",
        "body": "An ASG keeps the desired number of EC2 instances running."
      },
      {
        "id": "concept-2",
        "title": "Launch template",
        "body": "A launch template stores the instance settings that the ASG uses."
      },
      {
        "id": "concept-3",
        "title": "Desired capacity",
        "body": "Desired capacity is the number of instances the ASG tries to run now."
      }
    ],
    "whyItMatters": "Auto Scaling is heavily tested because it improves availability and replaces unhealthy instances automatically.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Launch template",
        "value": "saa-ec2-task9-template"
      },
      {
        "label": "Auto Scaling group",
        "value": "saa-ec2-task9-asg"
      },
      {
        "label": "Required permissions summary",
        "value": "Create a launch template, create an Auto Scaling group, launch managed instances, verify capacity, and clean up in order."
      }
    ],
    "costWarning": "Auto Scaling itself is free, but you are charged for the EC2 instances, EBS volumes, load balancers, and other connected resources created by the Auto Scaling group.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with Auto Scaling permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, the identity running this lab needs these actions:"
          },
          {
            "id": "console-step-1-item-5",
            "text": "Identity check: sts:GetCallerIdentity"
          },
          {
            "id": "console-step-1-item-6",
            "text": "EC2 read: ec2:DescribeImages, ec2:DescribeVpcs, ec2:DescribeSubnets, ec2:DescribeSecurityGroups, ec2:DescribeInstances"
          },
          {
            "id": "console-step-1-item-7",
            "text": "Security group: ec2:CreateSecurityGroup, ec2:AuthorizeSecurityGroupIngress, ec2:DeleteSecurityGroup"
          },
          {
            "id": "console-step-1-item-8",
            "text": "Launch template: ec2:CreateLaunchTemplate, ec2:DescribeLaunchTemplates, ec2:DeleteLaunchTemplate"
          },
          {
            "id": "console-step-1-item-9",
            "text": "Auto Scaling: autoscaling:CreateAutoScalingGroup, autoscaling:DescribeAutoScalingGroups, autoscaling:UpdateAutoScalingGroup, autoscaling:DeleteAutoScalingGroup"
          },
          {
            "id": "console-step-1-item-10",
            "text": "Tags and cleanup: ec2:CreateTags, ec2:TerminateInstances"
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
        "title": "Create a launch template",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open EC2."
          },
          {
            "id": "console-step-2-item-2",
            "text": "In the left menu, choose Launch Templates."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Create launch template."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Name it saa-ec2-task9-template."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose instance type t3.micro or t2.micro if shown as free tier eligible."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Use the default VPC network settings."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Create or choose a security group that allows HTTP from anywhere IPv4 if you want browser testing."
          },
          {
            "id": "console-step-2-item-9",
            "text": "Choose Create launch template."
          }
        ],
        "note": "A launch template stores instance settings for the Auto Scaling group.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the Auto Scaling group",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In the EC2 left menu, choose Auto Scaling Groups."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create Auto Scaling group."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name it saa-ec2-task9-asg."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select launch template saa-ec2-task9-template."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose the default VPC."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Select at least two subnets in different Availability Zones."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Keep load balancing off for this simple lab."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Set desired capacity to 1, minimum to 1, and maximum to 2."
          },
          {
            "id": "console-step-3-item-9",
            "text": "Choose Create Auto Scaling group."
          }
        ],
        "note": "The ASG tries to keep the desired number of healthy instances running.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Verify the ASG launches an instance",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the Auto Scaling group details page."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose the Instance management tab."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Wait until one instance appears as InService."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Open Instances and find the ASG-created instance."
          }
        ],
        "note": "The instance is managed by the Auto Scaling group, not manually managed.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test self-healing",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Terminate the ASG-created instance from the EC2 Instances page."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Return to the Auto Scaling group."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Wait a few minutes."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm the ASG launches a replacement instance."
          }
        ],
        "note": null,
        "warning": "Only do this in the lab ASG.",
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open Auto Scaling Groups."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select saa-ec2-task9-asg."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Set desired capacity to 0, minimum to 0, and maximum to 0."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Wait for ASG instances to terminate."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Delete the Auto Scaling group."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Delete launch template saa-ec2-task9-template."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Delete the lab security group if you created one."
          }
        ],
        "note": "Dependency order: scale down ASG, delete ASG, delete launch template, delete security group.",
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
        "title": "Create launch template inputs",
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
            "text": "VPC_ID=$(aws ec2 describe-vpcs --region $REGION --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-3",
            "language": "bash",
            "text": "SUBNETS=$(aws ec2 describe-subnets --region $REGION --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[0:2].SubnetId' --output text | tr '\t' ',')"
          },
          {
            "id": "cli-step-2-cmd-4",
            "language": "bash",
            "text": "AMI_ID=$(aws ec2 describe-images --region $REGION --owners amazon --filters 'Name=name,Values=al2023-ami-2023.*-x86_64' 'Name=state,Values=available' --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"
          },
          {
            "id": "cli-step-2-cmd-5",
            "language": "bash",
            "text": "SG_ID=$(aws ec2 create-security-group --region $REGION --group-name saa-ec2-task9-asg-sg --description 'Task 9 ASG security group' --vpc-id $VPC_ID --query GroupId --output text)"
          },
          {
            "id": "cli-step-2-cmd-6",
            "language": "bash",
            "text": "aws ec2 authorize-security-group-ingress --region $REGION --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0"
          }
        ],
        "note": "Expected: you have an AMI ID, two subnets, and a security group.",
        "warning": null,
        "expectedResult": "Expected: you have an AMI ID, two subnets, and a security group."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create the launch template and ASG",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws ec2 create-launch-template --region $REGION --launch-template-name saa-ec2-task9-template --launch-template-data ImageId=$AMI_ID,InstanceType=t3.micro,SecurityGroupIds=[$SG_ID],UserData=$(echo -n '#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\necho ASG task 9 > /var/www/html/index.html' | base64 -w 0)"
          },
          {
            "id": "cli-step-3-cmd-2",
            "language": "bash",
            "text": "aws autoscaling create-auto-scaling-group --region $REGION --auto-scaling-group-name saa-ec2-task9-asg --launch-template LaunchTemplateName=saa-ec2-task9-template,Version='$Latest' --min-size 1 --max-size 2 --desired-capacity 1 --vpc-zone-identifier $SUBNETS --tags ResourceId=saa-ec2-task9-asg,ResourceType=auto-scaling-group,Key=Name,Value=saa-ec2-task9-asg-instance,PropagateAtLaunch=true"
          }
        ],
        "note": "Expected: the ASG starts launching one instance.",
        "warning": null,
        "expectedResult": "Expected: the ASG starts launching one instance."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify the ASG",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws autoscaling describe-auto-scaling-groups --region $REGION --auto-scaling-group-names saa-ec2-task9-asg --query 'AutoScalingGroups[0].Instances[*].[InstanceId,LifecycleState,HealthStatus]' --output table"
          }
        ],
        "note": "Expected: one instance moves to InService and Healthy.",
        "warning": null,
        "expectedResult": "Expected: one instance moves to InService and Healthy."
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
            "text": "aws autoscaling update-auto-scaling-group --region $REGION --auto-scaling-group-name saa-ec2-task9-asg --min-size 0 --max-size 0 --desired-capacity 0"
          },
          {
            "id": "cli-step-5-cmd-2",
            "language": "bash",
            "text": "sleep 60"
          },
          {
            "id": "cli-step-5-cmd-3",
            "language": "bash",
            "text": "aws autoscaling delete-auto-scaling-group --region $REGION --auto-scaling-group-name saa-ec2-task9-asg --force-delete"
          },
          {
            "id": "cli-step-5-cmd-4",
            "language": "bash",
            "text": "aws ec2 delete-launch-template --region $REGION --launch-template-name saa-ec2-task9-template"
          },
          {
            "id": "cli-step-5-cmd-5",
            "language": "bash",
            "text": "aws ec2 delete-security-group --region $REGION --group-id $SG_ID"
          }
        ],
        "note": null,
        "warning": "If the security group delete fails, wait for all ASG instances to terminate and try again.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Auto Scaling configuration verified in EC2 Auto Scaling."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Set desired and minimum capacity of the Auto Scaling group to 0."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Auto Scaling group and launch template after instances terminate."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "ASG uses templates",
        "body": "ASGs launch instances from launch templates or launch configurations."
      },
      {
        "id": "cs-2",
        "title": "Self-healing",
        "body": "If an instance is unhealthy or missing, the ASG can replace it."
      },
      {
        "id": "cs-3",
        "title": "Multi-AZ",
        "body": "Use subnets in more than one Availability Zone for high availability."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No instances launch",
        "body": "Check subnet selection, launch template AMI, instance type, and service quotas."
      },
      {
        "id": "ts-2",
        "title": "Cannot delete security group",
        "body": "Delete the ASG and wait for instances to terminate first."
      },
      {
        "id": "ts-3",
        "title": "Only one AZ selected",
        "body": "Choose at least two subnets for better availability."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "ASG is not a load balancer",
        "body": "Wrong: ASG distributes traffic. Correct: ASG manages capacity; a load balancer distributes traffic."
      },
      {
        "id": "trap-2",
        "title": "Desired vs maximum",
        "body": "Wrong: maximum means current running count. Correct: desired is current target count."
      },
      {
        "id": "trap-3",
        "title": "High availability needs subnets",
        "body": "Wrong: one subnet is Multi-AZ. Correct: choose multiple subnets in different AZs."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Understand Auto Scaling configuration and architectural patterns in EC2 Auto Scaling."
      }
    ],
    "memoryHook": "ASG is the babysitter. It watches EC2 and replaces missing instances.",
    "flashcardSetId": "asg_task_9_flashcards"
  }
];
