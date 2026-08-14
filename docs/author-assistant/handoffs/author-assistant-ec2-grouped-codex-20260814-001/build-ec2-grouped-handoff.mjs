import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../../../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../../../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../../../src/features/followAlongAuthor/authorReview.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const basePath = 'C:/Users/shaun/AppData/Local/StudyTracker/AuthorAssistant/author-assistant-ec2-6b6aa62d-d045-4db6-8304-ad03081c1449/author-local-handoff-package.json';
const sessionId = 'author-assistant-ec2-grouped-codex-20260814-001';
const preparedAt = '2026-08-14T16:30:00.000Z';

const stableStringify = value => Array.isArray(value)
  ? `[${value.map(stableStringify).join(',')}]`
  : value && typeof value === 'object'
    ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`
    : JSON.stringify(value);
const fingerprint = value => crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

function consoleStep(taskId, number, title, instructions, expectedResult, warning = '', blocks = []) {
  const id = `${taskId}-console-step-${number}-${slug(title)}`;
  return {
    id, stepNumber: number, number, title, instruction: instructions[0],
    instructions: instructions.map((text, index) => ({ id: `${id}-instruction-${index + 1}`, text, detail: '' })),
    jsonBlocks: blocks.map((block, index) => ({ id: `${id}-json-${index + 1}`, title: block.title, content: block.content, language: block.language || 'json', sourceIds: block.sourceIds || [] })),
    commands: [], expectedResult, warning, sourceIds: []
  };
}

function cliStep(taskId, number, [command, explanation, expectedResult, warning = '']) {
  return { id: `${taskId}-cli-step-${number}`, stepNumber: number, number, command, explanation, expectedResult, instructions: [], commands: [], warning, sourceIds: [] };
}

function makeTask({ number, phaseId, title, feature, goal, why, difficulty = 'Medium', prerequisites = [], sources, console, cli, checks }) {
  const id = `task-ec2-${slug(title)}-${String(number).padStart(3, '0')}`;
  return {
    id, slug: slug(title), title, service: 'Amazon Elastic Compute Cloud', feature, goal, whyItMatters: why,
    difficulty, estimatedMinutes: null, region: 'eu-west-2', status: 'draft', phaseId, prerequisites, isOptional: false,
    sourceIds: sources, concepts: [], values: [],
    modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'available', reason: '' } },
    consoleSteps: console.map((step, index) => consoleStep(id, index + 1, ...step)),
    cliSteps: cli.map((step, index) => cliStep(id, index + 1, step)),
    createdResourceKeys: [],
    verification: checks.map((check, index) => ({ id: `${id}-verification-${index + 1}`, title: check[0], instruction: check[1], expectedResult: check[2], mode: check[3] || 'either' })),
    cleanup: []
  };
}

const basePackage = JSON.parse(await fs.readFile(basePath, 'utf8'));
const base = structuredClone(basePackage.authorDraftContent);
const oldTasks = base.tasks.map(task => ({ ...task, cleanup: [] }));
const bootstrapPolicyBlock = oldTasks[0].consoleSteps.flatMap(step => step.jsonBlocks || [])[0];
const bootstrapPolicy = JSON.parse(bootstrapPolicyBlock.content);
bootstrapPolicyBlock.title = 'fa-ec2-learner-lab-policy.json';
const ec2Statement = bootstrapPolicy.Statement.find(statement => statement.Sid === 'Ec2VpcEbsLab');
ec2Statement.Action = [...new Set([
  ...ec2Statement.Action,
  'ec2:ModifySubnetAttribute',
  'ec2:CreateVolume',
  'ec2:AttachVolume',
  'ec2:DetachVolume',
  'ec2:DeleteVolume',
  'ec2:ModifyVolume',
  'ec2:CreateImage',
  'ec2:DeregisterImage'
])];
bootstrapPolicy.Statement.push(
  {
    Sid: 'LoadBalancingScalingMonitoringAndEvents',
    Effect: 'Allow',
    Action: [
      'elasticloadbalancing:*',
      'autoscaling:*',
      'cloudwatch:*',
      'sns:CreateTopic',
      'sns:DeleteTopic',
      'sns:GetTopicAttributes',
      'sns:ListSubscriptionsByTopic',
      'sns:Publish',
      'sns:SetTopicAttributes',
      'sns:Subscribe',
      'sns:Unsubscribe',
      'events:DeleteRule',
      'events:DescribeRule',
      'events:ListTargetsByRule',
      'events:PutRule',
      'events:PutTargets',
      'events:RemoveTargets',
      'cloudtrail:LookupEvents'
    ],
    Resource: '*'
  },
  {
    Sid: 'CreateOnlyRequiredServiceLinkedRoles',
    Effect: 'Allow',
    Action: 'iam:CreateServiceLinkedRole',
    Resource: '*',
    Condition: {
      StringEquals: {
        'iam:AWSServiceName': [
          'elasticloadbalancing.amazonaws.com',
          'autoscaling.amazonaws.com'
        ]
      }
    }
  }
);
bootstrapPolicyBlock.content = JSON.stringify(bootstrapPolicy, null, 2);
oldTasks[4] = {
  ...oldTasks[4],
  title: 'Inspect EC2 lifecycle and create the first EBS snapshot',
  goal: 'Inspect instance and storage metadata, observe stop/start behaviour, and create a recoverable EBS snapshot without beginning final cleanup.'
};

const phases = [
  ['Secure EC2 foundations', 'Create dedicated training access and a controlled VPC foundation.'],
  ['Launch, connect to, and operate EC2', 'Launch Amazon Linux, connect through Session Manager, and operate a web workload.'],
  ['EBS storage, snapshots, and recovery', 'Protect, restore, resize, and reuse EC2 block storage and machine images.'],
  ['Highly available EC2 web application', 'Place web targets across two Availability Zones behind an Application Load Balancer.'],
  ['Auto Scaling and CloudWatch', 'Create repeatable launch configuration, health replacement, monitoring, notification, and target tracking.'],
  ['Operations, architecture, and cleanup', 'Use managed operations and audit services, make SAA-C03 decisions, and remove every training resource.']
].map(([title, description], index) => ({ id: `phase-${index + 1}-${slug(title)}`, phaseNumber: index + 1, title, description, taskIds: [], isOptional: false }));

const phaseAssignments = [0, 0, 1, 1, 2];
oldTasks.forEach((task, index) => {
  task.phaseId = phases[phaseAssignments[index]].id;
  phases[phaseAssignments[index]].taskIds.push(task.id);
});

const t5 = oldTasks[4].id;
const task6 = makeTask({
  number: 6, phaseId: phases[2].id,
  title: 'Attach, resize, snapshot, restore, and reuse an EBS data volume',
  feature: 'Amazon EBS volumes, snapshots, and AMIs',
  goal: 'Create a gp3 data volume, mount it safely, resize it, restore it from a snapshot, and create an AMI from the configured instance.',
  why: 'SAA-C03 tests EBS durability, Availability Zone scope, snapshot recovery, encryption, volume modification, and AMI-based repeatability.',
  prerequisites: [t5],
  sources: ['source-ebs-volumes', 'source-ebs-attach-volume', 'source-ebs-modify-volume', 'source-ebs-snapshots', 'source-create-ami'],
  console: [
    ['Create and attach the data volume', [
      'Open EC2 in eu-west-2 and choose Volumes under Elastic Block Store.',
      'Choose Create volume.',
      'Select gp3, enter 2 GiB, and choose the same Availability Zone as fa-ec2-web-01.',
      'Keep encryption enabled and add Name = fa-ec2-data-volume.',
      'Create the volume and wait for Available.',
      'Select fa-ec2-data-volume, choose Actions, then Attach volume.',
      'Select fa-ec2-web-01 and keep the suggested Linux device name.',
      'Choose Attach volume.',
      'Connect through Session Manager.',
      'Run lsblk to identify the new unmounted device.',
      'Format only that new device as XFS, create /data, mount it, and write /data/lab-proof.txt.',
      'Record the volume ID as [DATA_VOLUME_ID] and device as [DATA_DEVICE].'
    ], 'The encrypted 2 GiB gp3 volume is In-use and /data/lab-proof.txt is readable.', 'Formatting erases a device. Confirm [DATA_DEVICE] is the new empty volume and never format the root volume.'],
    ['Resize, snapshot, and restore the data', [
      'Select fa-ec2-data-volume and choose Actions, Modify volume.',
      'Change Size from 2 GiB to 3 GiB and confirm the modification.',
      'Wait until the modification state is optimizing or completed.',
      'Use Session Manager to grow the XFS filesystem and confirm /data reports the larger size.',
      'Select the volume, choose Actions, then Create snapshot.',
      'Enter fa-ec2-data-snapshot as the Name and create it.',
      'Wait until the snapshot is Completed and record [DATA_SNAPSHOT_ID].',
      'From the snapshot, choose Create volume.',
      'Use gp3 and the same Availability Zone as fa-ec2-web-01.',
      'Name it fa-ec2-restored-volume and create it.',
      'Attach it to fa-ec2-web-01 as a different device.',
      'Mount it read-only at /restore and verify lab-proof.txt exists.'
    ], 'The restored volume contains the original proof file and the source volume is 3 GiB.'],
    ['Create an AMI of the configured web instance', [
      'Select fa-ec2-web-01 in Instances.',
      'Choose Actions, Image and templates, then Create image.',
      'Enter fa-ec2-web-ami as the image name.',
      'Keep reboot enabled so the filesystem is captured consistently.',
      'Review the block-device mappings and create the image.',
      'Open AMIs and wait until fa-ec2-web-ami is Available.',
      'Record the AMI ID as [WEB_AMI_ID].',
      'Open Snapshots and identify the AMI-owned snapshot as [AMI_SNAPSHOT_ID].'
    ], 'The private AMI is Available and has a recorded backing snapshot.', 'The AMI and its snapshot continue to incur storage charges until deregistered and deleted.']
  ],
  cli: [
    ['aws ec2 create-volume --availability-zone [INSTANCE_AZ] --size 2 --volume-type gp3 --encrypted --tag-specifications ResourceType=volume,Tags=[{Key=Name,Value=fa-ec2-data-volume}] --region eu-west-2 --profile fa-ec2-learner', 'Create the encrypted data volume in the instance Availability Zone.', 'Record VolumeId as [DATA_VOLUME_ID].'],
    ['aws ec2 attach-volume --volume-id [DATA_VOLUME_ID] --instance-id [INSTANCE_ID] --device /dev/sdf --region eu-west-2 --profile fa-ec2-learner', 'Attach the data volume to the first instance.', 'State becomes attaching or attached.'],
    ['aws ec2 modify-volume --volume-id [DATA_VOLUME_ID] --size 3 --region eu-west-2 --profile fa-ec2-learner', 'Increase the EBS allocation to 3 GiB.', 'ModificationState becomes modifying, optimizing, or completed.'],
    ['aws ec2 create-snapshot --volume-id [DATA_VOLUME_ID] --description fa-ec2-data-snapshot --tag-specifications ResourceType=snapshot,Tags=[{Key=Name,Value=fa-ec2-data-snapshot}] --region eu-west-2 --profile fa-ec2-learner', 'Create the recoverable data snapshot.', 'Record SnapshotId as [DATA_SNAPSHOT_ID].'],
    ['aws ec2 create-volume --snapshot-id [DATA_SNAPSHOT_ID] --availability-zone [INSTANCE_AZ] --volume-type gp3 --tag-specifications ResourceType=volume,Tags=[{Key=Name,Value=fa-ec2-restored-volume}] --region eu-west-2 --profile fa-ec2-learner', 'Restore a separate volume in the required Availability Zone.', 'Record VolumeId as [RESTORED_VOLUME_ID].'],
    ['aws ec2 create-image --instance-id [INSTANCE_ID] --name fa-ec2-web-ami --description "Configured EC2 training web image" --region eu-west-2 --profile fa-ec2-learner', 'Create a private AMI with a consistent reboot.', 'Record ImageId as [WEB_AMI_ID].']
  ],
  checks: [
    ['Verify independent EBS lifecycle', 'Compare the source and restored volume IDs and read the restored proof file.', 'The volumes are separate resources containing the same snapshot data.'],
    ['Verify the AMI', 'Inspect fa-ec2-web-ami and its block-device mapping.', 'The AMI is Available and its backing snapshot is recorded.']
  ]
});

const task7 = makeTask({
  number: 7, phaseId: phases[3].id,
  title: 'Build a two-AZ web tier behind an Application Load Balancer',
  feature: 'EC2, VPC, Application Load Balancer, and target groups',
  goal: 'Create a second public subnet and web instance in another Availability Zone, then distribute HTTP requests across healthy targets.',
  why: 'Multi-AZ load balancing removes a single-instance failure point and demonstrates health-based routing at Layer 7.',
  prerequisites: [task6.id],
  sources: ['source-alb-getting-started', 'source-alb-security-groups', 'source-alb-health-checks', 'source-ec2-user-data'],
  console: [
    ['Add the second Availability Zone and ALB security boundary', [
      'Open VPC and select fa-ec2-vpc.',
      'Choose Subnets, then Create subnet.',
      'Select a different Availability Zone from fa-ec2-public-subnet.',
      'Enter fa-ec2-public-subnet-b and IPv4 CIDR 10.0.2.0/24.',
      'Create the subnet and enable auto-assign public IPv4 only for this training web tier.',
      'Associate the subnet with fa-ec2-public-rt.',
      'Create security group fa-ec2-alb-sg in fa-ec2-vpc.',
      'Allow inbound HTTP port 80 from your recorded public IPv4 /32 only.',
      'Edit fa-ec2-web-sg so inbound HTTP is allowed from fa-ec2-alb-sg rather than a public CIDR.',
      'Confirm neither security group allows SSH port 22.'
    ], 'Two public subnets exist in different Availability Zones and only the ALB accepts learner HTTP traffic.'],
    ['Launch the second web target', [
      'Choose Launch instance in EC2.',
      'Enter fa-ec2-web-02.',
      'Select the same Amazon Linux 2023 architecture and instance type used by web-01.',
      'Choose fa-ec2-vpc and fa-ec2-public-subnet-b.',
      'Select fa-ec2-web-sg and fa-ec2-ssm-profile.',
      'Expand Advanced details and paste the supplied web-b-user-data.sh.',
      'Launch the instance and record [WEB_B_INSTANCE_ID].',
      'Wait for Running and both status checks passed.'
    ], 'fa-ec2-web-02 runs in the second Availability Zone and serves its unique page.', 'Do not place both targets in the same Availability Zone.', [{
      title: 'web-b-user-data.sh', language: 'text', sourceIds: ['source-ec2-user-data'],
      content: '#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\necho "<h1>fa-ec2-web-02</h1><p>Second Availability Zone</p>" > /var/www/html/index.html'
    }]],
    ['Create and test the Application Load Balancer', [
      'Open Target groups and choose Create target group.',
      'Choose Instances, enter fa-ec2-web-targets, use HTTP port 80, and select fa-ec2-vpc.',
      'Keep health check path / and create the target group.',
      'Register fa-ec2-web-01 and fa-ec2-web-02 on port 80.',
      'Open Load balancers and choose Create Application Load Balancer.',
      'Enter fa-ec2-web-alb and choose Internet-facing, IPv4.',
      'Select fa-ec2-vpc and both public subnets in different Availability Zones.',
      'Select only fa-ec2-alb-sg.',
      'Create an HTTP:80 listener forwarding to fa-ec2-web-targets.',
      'Create the ALB and record [ALB_ARN], [ALB_DNS_NAME], [TARGET_GROUP_ARN], and [ALB_SG_ID].',
      'Wait until both targets are Healthy.',
      'Refresh http://[ALB_DNS_NAME] repeatedly and observe both server names.',
      'Stop one target and verify the ALB serves only the remaining healthy target.'
    ], 'The ALB routes requests only to healthy targets across two Availability Zones.', 'ALB health checks fail if Apache is stopped, port 80 is blocked, or the target page does not return a successful status.']
  ],
  cli: [
    ['aws ec2 create-subnet --vpc-id [VPC_ID] --cidr-block 10.0.2.0/24 --availability-zone [SECOND_AZ] --tag-specifications ResourceType=subnet,Tags=[{Key=Name,Value=fa-ec2-public-subnet-b}] --region eu-west-2 --profile fa-ec2-learner', 'Create the second-AZ public subnet.', 'Record SubnetId as [SUBNET_B_ID].'],
    ['aws ec2 create-security-group --group-name fa-ec2-alb-sg --description "HTTP entry for training ALB" --vpc-id [VPC_ID] --region eu-west-2 --profile fa-ec2-learner', 'Create the ALB security group.', 'Record GroupId as [ALB_SG_ID].'],
    ['aws ec2 run-instances --image-id resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --instance-type t3.micro --subnet-id [SUBNET_B_ID] --security-group-ids [WEB_SG_ID] --iam-instance-profile Name=fa-ec2-ssm-profile --user-data file://web-b-user-data.sh --tag-specifications ResourceType=instance,Tags=[{Key=Name,Value=fa-ec2-web-02}] --region eu-west-2 --profile fa-ec2-learner', 'Launch the second configured web target.', 'Record InstanceId as [WEB_B_INSTANCE_ID].'],
    ['aws elbv2 create-target-group --name fa-ec2-web-targets --protocol HTTP --port 80 --vpc-id [VPC_ID] --health-check-path / --target-type instance --region eu-west-2 --profile fa-ec2-learner', 'Create the HTTP target group.', 'Record TargetGroupArn as [TARGET_GROUP_ARN].'],
    ['aws elbv2 register-targets --target-group-arn [TARGET_GROUP_ARN] --targets Id=[INSTANCE_ID] Id=[WEB_B_INSTANCE_ID] --region eu-west-2 --profile fa-ec2-learner', 'Register both instances.', 'The command returns without an error.'],
    ['aws elbv2 create-load-balancer --name fa-ec2-web-alb --subnets [SUBNET_ID] [SUBNET_B_ID] --security-groups [ALB_SG_ID] --scheme internet-facing --type application --ip-address-type ipv4 --region eu-west-2 --profile fa-ec2-learner', 'Create the multi-AZ ALB.', 'Record LoadBalancerArn and DNSName.'],
    ['aws elbv2 create-listener --load-balancer-arn [ALB_ARN] --protocol HTTP --port 80 --default-actions Type=forward,TargetGroupArn=[TARGET_GROUP_ARN] --region eu-west-2 --profile fa-ec2-learner', 'Create the listener forwarding to the target group.', 'The output contains ListenerArn.']
  ],
  checks: [
    ['Verify Availability Zone diversity', 'Compare both instance and subnet Availability Zones.', 'The targets are in two different eu-west-2 Availability Zones.'],
    ['Verify health-based routing', 'Stop one target and refresh the ALB DNS name.', 'Traffic continues through the remaining healthy target.']
  ]
});

const task8 = makeTask({
  number: 8, phaseId: phases[4].id,
  title: 'Create a launch template and load-balanced Auto Scaling group',
  feature: 'EC2 launch templates and EC2 Auto Scaling',
  goal: 'Create repeatable web capacity across two Availability Zones and prove automatic instance replacement.',
  why: 'Launch templates, Auto Scaling groups, load balancer health checks, and desired capacity form a standard resilient EC2 architecture.',
  prerequisites: [task7.id],
  sources: ['source-launch-templates', 'source-asg-first', 'source-asg-load-balancer'],
  console: [
    ['Create the launch template', [
      'Open EC2 Launch templates and choose Create launch template.',
      'Enter fa-ec2-web-template and enable Auto Scaling guidance.',
      'Select Amazon Linux 2023 and t3.micro.',
      'Do not select a key pair because Session Manager is used.',
      'Select fa-ec2-web-sg.',
      'Set the root volume to encrypted gp3 with Delete on termination enabled.',
      'Under Advanced details, select fa-ec2-ssm-profile.',
      'Paste the supplied asg-web-user-data.sh into User data.',
      'Create the launch template and record [LAUNCH_TEMPLATE_ID].'
    ], 'fa-ec2-web-template version 1 contains the expected image, type, security group, role, storage, and user data.', '', [{
      title: 'asg-web-user-data.sh', language: 'text', sourceIds: ['source-launch-templates'],
      content: '#!/bin/bash\ndnf install -y httpd\nsystemctl enable --now httpd\nTOKEN=$(curl -sS -X PUT -H "X-aws-ec2-metadata-token-ttl-seconds: 60" http://169.254.169.254/latest/api/token)\nINSTANCE_ID=$(curl -sS -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)\necho "<h1>Auto Scaling target: $INSTANCE_ID</h1>" > /var/www/html/index.html'
    }]],
    ['Create and test the Auto Scaling group', [
      'Open Auto Scaling groups and choose Create Auto Scaling group.',
      'Enter fa-ec2-web-asg and select fa-ec2-web-template version 1.',
      'Select fa-ec2-vpc and both public subnets.',
      'Attach to existing load balancer target group fa-ec2-web-targets.',
      'Turn on Elastic Load Balancing health checks.',
      'Set health check grace period to 180 seconds.',
      'Set Desired capacity 2, Minimum 2, and Maximum 4.',
      'Create the group and record [ASG_NAME].',
      'Wait until two Auto Scaling instances are InService and healthy in the target group.',
      'Terminate one Auto Scaling instance from EC2 without decrementing desired capacity.',
      'Watch Activity history until a replacement launches and becomes healthy.'
    ], 'The group maintains two healthy instances and replaces the terminated target automatically.', 'The two original manually launched targets remain separate and are removed before the final scaling test if the learner wants only ASG targets.']
  ],
  cli: [
    ['aws ec2 create-launch-template --launch-template-name fa-ec2-web-template --launch-template-data file://fa-ec2-launch-template.json --region eu-west-2 --profile fa-ec2-learner', 'Create the template from the supplied configuration.', 'Record LaunchTemplateId as [LAUNCH_TEMPLATE_ID].'],
    ['aws autoscaling create-auto-scaling-group --auto-scaling-group-name fa-ec2-web-asg --launch-template LaunchTemplateId=[LAUNCH_TEMPLATE_ID],Version=1 --min-size 2 --max-size 4 --desired-capacity 2 --vpc-zone-identifier [SUBNET_ID],[SUBNET_B_ID] --target-group-arns [TARGET_GROUP_ARN] --health-check-type ELB --health-check-grace-period 180 --region eu-west-2 --profile fa-ec2-learner', 'Create the multi-AZ load-balanced group.', 'The command returns without an error.'],
    ['aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names fa-ec2-web-asg --region eu-west-2 --profile fa-ec2-learner', 'Inspect desired capacity and instance lifecycle states.', 'DesiredCapacity is 2 and instances progress to InService.'],
    ['aws autoscaling terminate-instance-in-auto-scaling-group --instance-id [ASG_TEST_INSTANCE_ID] --no-should-decrement-desired-capacity --region eu-west-2 --profile fa-ec2-learner', 'Simulate loss while keeping desired capacity unchanged.', 'The response shows a scaling activity.'],
    ['aws autoscaling describe-scaling-activities --auto-scaling-group-name fa-ec2-web-asg --max-items 10 --region eu-west-2 --profile fa-ec2-learner', 'Observe replacement activity.', 'A successful activity launches a replacement instance.']
  ],
  checks: [
    ['Verify group boundaries', 'Inspect minimum, desired, maximum, subnet, target group, and health check settings.', 'The group uses 2/2/4, two subnets, the ALB target group, and ELB health checks.'],
    ['Verify self-healing', 'Compare the terminated instance ID with current group members.', 'A different replacement instance is InService and healthy.']
  ]
});

const task9 = makeTask({
  number: 9, phaseId: phases[4].id,
  title: 'Add CloudWatch monitoring, SNS alerts, and target tracking',
  feature: 'CloudWatch, SNS, and EC2 Auto Scaling policies',
  goal: 'Monitor EC2 and ALB health, receive an alarm notification, and let target tracking adjust group capacity safely.',
  why: 'CloudWatch metrics and target tracking translate workload demand into automated capacity while alarms provide operational visibility.',
  prerequisites: [task8.id],
  sources: ['source-ec2-cloudwatch', 'source-asg-target-tracking', 'source-alb-cloudwatch', 'source-sns-start'],
  console: [
    ['Create notification and health alarms', [
      'Open SNS in eu-west-2 and create Standard topic fa-ec2-operations-topic.',
      'Create an email subscription and confirm it from the mailbox.',
      'Open CloudWatch Metrics and inspect AWS/EC2 CPUUtilization for the Auto Scaling instances.',
      'Inspect AWS/ApplicationELB HealthyHostCount and UnHealthyHostCount for fa-ec2-web-targets.',
      'Create alarm fa-ec2-unhealthy-targets.',
      'Use UnHealthyHostCount >= 1 for one evaluation period.',
      'Send the alarm notification to fa-ec2-operations-topic.',
      'Record [SNS_TOPIC_ARN] and [UNHEALTHY_ALARM_NAME].'
    ], 'The confirmed SNS subscription and CloudWatch unhealthy-target alarm are active.'],
    ['Create target tracking and observe controlled scaling', [
      'Open fa-ec2-web-asg and choose Automatic scaling.',
      'Create a target tracking scaling policy named fa-ec2-cpu-target-tracking.',
      'Choose Average CPU utilization and target value 50.',
      'Keep instance warmup at 180 seconds.',
      'Create the policy.',
      'Review the CloudWatch alarms automatically managed by Auto Scaling.',
      'Generate only a brief controlled CPU test through Systems Manager on one Auto Scaling instance.',
      'Stop the load test after a few minutes.',
      'Observe metrics and Activity history without waiting indefinitely for scale-out.',
      'Confirm capacity never exceeds Maximum 4.'
    ], 'Target tracking is active, metrics are visible, and any scaling remains within 2 to 4 instances.', 'A scaling event is not guaranteed during a short lab because metric publication and warmup take time; verifying the active policy and metrics is sufficient.']
  ],
  cli: [
    ['aws sns create-topic --name fa-ec2-operations-topic --region eu-west-2 --profile fa-ec2-learner', 'Create the operations topic.', 'Record TopicArn as [SNS_TOPIC_ARN].'],
    ['aws sns subscribe --topic-arn [SNS_TOPIC_ARN] --protocol email --notification-endpoint [EMAIL_ADDRESS] --region eu-west-2 --profile fa-ec2-learner', 'Create the email subscription.', 'SubscriptionArn remains pending until confirmed.'],
    ['aws cloudwatch put-metric-alarm --alarm-name fa-ec2-unhealthy-targets --namespace AWS/ApplicationELB --metric-name UnHealthyHostCount --dimensions Name=TargetGroup,Value=[TARGET_GROUP_DIMENSION] Name=LoadBalancer,Value=[ALB_DIMENSION] --statistic Maximum --period 60 --evaluation-periods 1 --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold --alarm-actions [SNS_TOPIC_ARN] --region eu-west-2 --profile fa-ec2-learner', 'Create the unhealthy-target alarm.', 'The command returns without an error.'],
    ['aws autoscaling put-scaling-policy --auto-scaling-group-name fa-ec2-web-asg --policy-name fa-ec2-cpu-target-tracking --policy-type TargetTrackingScaling --target-tracking-configuration file://fa-ec2-target-tracking.json --region eu-west-2 --profile fa-ec2-learner', 'Apply the supplied 50 percent CPU target.', 'The output contains PolicyARN and managed alarm ARNs.'],
    ['aws cloudwatch describe-alarms --alarm-name-prefix fa-ec2- --region eu-west-2 --profile fa-ec2-learner', 'Review the lab alarm and Auto Scaling-managed alarms.', 'The response lists fa-ec2-unhealthy-targets and target-tracking alarms.']
  ],
  checks: [
    ['Verify observability paths', 'Inspect EC2, ALB, and Auto Scaling metrics and the confirmed SNS action.', 'Metrics are visible and the alarm targets the exact operations topic.'],
    ['Verify safe scaling limits', 'Inspect the policy and group capacity boundaries.', 'The target is 50 percent and capacity remains between 2 and 4.']
  ]
});

const task10 = makeTask({
  number: 10, phaseId: phases[5].id,
  title: 'Operate and audit EC2 with Systems Manager, EventBridge, and CloudTrail',
  feature: 'Systems Manager, EventBridge, SNS, and CloudTrail',
  goal: 'Run a managed command without SSH, route EC2 state changes to SNS, and find the related EC2 API activity in CloudTrail.',
  why: 'Managed operations, event-driven notification, and API auditing are distinct operational controls frequently compared in SAA-C03 scenarios.',
  prerequisites: [task9.id],
  sources: ['source-session-manager', 'source-run-command', 'source-eventbridge-ec2-events', 'source-cloudtrail-ec2'],
  console: [
    ['Run a managed inventory command without SSH', [
      'Open Systems Manager in eu-west-2.',
      'Choose Fleet Manager and confirm the managed EC2 nodes are online.',
      'Choose Run Command, then Run command.',
      'Select AWS-RunShellScript.',
      'Target one fa-ec2 Auto Scaling instance by instance ID.',
      'Enter uname -a and systemctl is-active httpd as separate commands.',
      'Run the command and wait for Success.',
      'Open the command output and verify Linux details and active Apache.',
      'Confirm no inbound SSH rule or key pair was required.'
    ], 'Run Command succeeds through Systems Manager without opening port 22.'],
    ['Route state changes and audit API actions', [
      'Open EventBridge in eu-west-2 and create rule fa-ec2-state-change.',
      'Use the default event bus and an AWS events event pattern.',
      'Choose EC2 Instance State-change Notification.',
      'Limit instance-id to the recorded fa-ec2-web-01 instance.',
      'Choose fa-ec2-operations-topic as the target.',
      'Create and enable the rule.',
      'Stop and restart fa-ec2-web-01 once.',
      'Confirm SNS receives state-change messages.',
      'Open CloudTrail Event history.',
      'Filter Event source to ec2.amazonaws.com.',
      'Find StopInstances and StartInstances and inspect the acting identity, time, Region, and resource ID.'
    ], 'EventBridge reports state transitions and CloudTrail identifies the API calls that caused them.', 'EventBridge reports service events; CloudTrail records API activity. They are complementary, not interchangeable.']
  ],
  cli: [
    ['aws ssm send-command --instance-ids [ASG_TEST_INSTANCE_ID] --document-name AWS-RunShellScript --parameters commands=["uname -a","systemctl is-active httpd"] --region eu-west-2 --profile fa-ec2-learner', 'Run managed operating-system checks.', 'Record CommandId as [OPERATIONS_COMMAND_ID].'],
    ['aws ssm get-command-invocation --command-id [OPERATIONS_COMMAND_ID] --instance-id [ASG_TEST_INSTANCE_ID] --region eu-west-2 --profile fa-ec2-learner', 'Read the command result.', 'Status is Success and output shows active.'],
    ['aws events put-rule --name fa-ec2-state-change --event-pattern file://fa-ec2-state-change-pattern.json --state ENABLED --region eu-west-2 --profile fa-ec2-learner', 'Create the exact-instance state-change rule.', 'The output contains RuleArn.'],
    ['aws events put-targets --rule fa-ec2-state-change --targets Id=SnsTarget,Arn=[SNS_TOPIC_ARN] --region eu-west-2 --profile fa-ec2-learner', 'Attach the operations topic.', 'FailedEntryCount is 0.'],
    ['aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventSource,AttributeValue=ec2.amazonaws.com --max-results 20 --region eu-west-2 --profile fa-ec2-learner', 'Review recent EC2 API audit events.', 'Recent StopInstances or StartInstances events identify the learner identity and instance.']
  ],
  checks: [
    ['Verify no-SSH operations', 'Inspect the security group and successful Systems Manager command.', 'Port 22 is not open and managed commands succeed.'],
    ['Distinguish events from audit', 'Compare the SNS state event with its CloudTrail API record.', 'The learner explains what changed and who requested the change.']
  ]
});

const task11 = makeTask({
  number: 11, phaseId: phases[5].id,
  title: 'Compare EC2 resilience, purchasing, and placement decisions',
  feature: 'SAA-C03 EC2 architecture decisions',
  goal: 'Use the completed architecture to choose suitable availability, scaling, storage, connectivity, and purchasing patterns.',
  why: 'Exam scenarios require trade-off decisions involving On-Demand, Savings Plans, Reserved Instances, Spot, placement, recovery, and horizontal scaling.',
  prerequisites: [task10.id],
  sources: ['source-ec2-purchasing', 'source-spot', 'source-placement-groups', 'source-asg-load-balancer'],
  console: [[
    'Review the architecture decisions', [
      'Match unpredictable short-term workloads to On-Demand Instances.',
      'Match interruptible fault-tolerant capacity to Spot Instances.',
      'Match steady compute commitments to Savings Plans or Reserved Instances according to the required flexibility.',
      'Explain why two Availability Zones plus an ALB improve availability.',
      'Explain why an Auto Scaling group provides replacement and horizontal scaling.',
      'Compare EBS snapshots and AMIs for data recovery versus repeatable instance launch.',
      'Compare public subnets with private instances using NAT or VPC endpoints in a production design.',
      'Match cluster placement groups to low-latency tightly coupled workloads, not this web tier.',
      'Match spread or partition strategies to appropriate failure-isolation requirements.',
      'Confirm the training design uses fixed small instances and must be cleaned up.'
    ], 'The learner can justify each EC2 architecture and purchasing choice using the completed environment.'
  ]],
  cli: [
    ['aws ec2 describe-instance-type-offerings --location-type availability-zone --filters Name=instance-type,Values=t3.micro --region eu-west-2 --profile fa-ec2-learner', 'Review where the training instance type is offered.', 'The result lists available eu-west-2 zones.'],
    ['aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names fa-ec2-web-asg --region eu-west-2 --profile fa-ec2-learner', 'Relate desired capacity and multi-AZ subnets to resilience.', 'The group identifies two subnets and current InService instances.'],
    ['aws ec2 describe-images --image-ids [WEB_AMI_ID] --region eu-west-2 --profile fa-ec2-learner', 'Review the reusable machine image.', 'The AMI is private, available, and backed by the recorded snapshot.']
  ],
  checks: [
    ['Select the purchasing model', 'Match three supplied workload patterns to On-Demand, Spot, and a commitment option.', 'Every choice includes availability and interruption reasoning.'],
    ['Select the resilience mechanism', 'Match instance replacement, traffic distribution, data recovery, and repeatable launch to the created services.', 'The learner chooses Auto Scaling, ALB, snapshots, and AMIs correctly.']
  ]
});

const task12 = makeTask({
  number: 12, phaseId: phases[5].id,
  title: 'Delete every EC2 training resource safely',
  feature: 'Reverse-dependency teardown',
  goal: 'Remove only the exact resources created by the EC2 Follow Along in dependency-safe order and verify that chargeable resources are gone.',
  why: 'A complete teardown prevents unnecessary EC2, EBS, public IPv4, ALB, snapshot, log, and monitoring charges.',
  prerequisites: [task11.id],
  sources: ['source-terminate-instances', 'source-delete-alb', 'source-delete-asg', 'source-ebs-snapshots'],
  console: [[
    'Use the final reverse-order cleanup list', [
      'Confirm the AWS account and eu-west-2 before deleting anything.',
      'Delete only resources with exact fa-ec2 names or recorded IDs.',
      'Remove scaling policies and set the Auto Scaling group desired and minimum capacity to zero.',
      'Delete the Auto Scaling group before deleting its launch template.',
      'Delete the ALB before deleting its target group and security group.',
      'Terminate the two manually launched instances and wait until Terminated.',
      'Deregister the AMI before deleting its backing snapshot.',
      'Detach and delete restored and source data volumes only after their instances are stopped or terminated.',
      'Remove EventBridge targets before deleting its rule and SNS topic.',
      'Delete VPC routes, associations, gateway, subnets, security groups, and VPC in dependency order.',
      'Remove instance profile, role attachments, learner key, user, and policies last.',
      'Verify every deletion before marking cleanup complete.'
    ], 'All exact fa-ec2 resources are absent and unrelated AWS resources remain unchanged.', 'Deletion is permanent. Stop if a resource name or recorded ID does not match.'
  ]],
  cli: [
    ['aws sts get-caller-identity --profile fa-ec2-learner', 'Verify the cleanup account.', 'The account matches the training account.'],
    ['aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names fa-ec2-web-asg --region eu-west-2 --profile fa-ec2-learner', 'Confirm the exact Auto Scaling target.', 'Only fa-ec2-web-asg is returned.'],
    ['aws elbv2 describe-load-balancers --names fa-ec2-web-alb --region eu-west-2 --profile fa-ec2-learner', 'Confirm the exact ALB target.', 'Only fa-ec2-web-alb is returned.'],
    ['aws ec2 describe-volumes --filters Name=tag:Name,Values=fa-ec2-* --region eu-west-2 --profile fa-ec2-learner', 'Inventory training EBS volumes.', 'Only volumes created by this Follow Along are listed.'],
    ['aws ec2 describe-snapshots --owner-ids self --filters Name=tag:Name,Values=fa-ec2-* --region eu-west-2 --profile fa-ec2-learner', 'Inventory manual training snapshots.', 'Only recorded fa-ec2 snapshots are listed.']
  ],
  checks: [
    ['Verify chargeable resources are gone', 'Search EC2 instances, volumes, snapshots, AMIs, load balancers, target groups, and Auto Scaling groups.', 'No lab-exclusive chargeable resource remains.'],
    ['Verify shared account safety', 'Review IAM, VPC, SNS, EventBridge, CloudWatch, and local profiles.', 'Only exact training resources are absent and unrelated resources remain.']
  ]
});

const newTasks = [task6, task7, task8, task9, task10, task11, task12];
newTasks.forEach(task => phases.find(phase => phase.id === task.phaseId).taskIds.push(task.id));
const tasks = [...oldTasks, ...newTasks];

const extraSources = [
  ['source-ebs-volumes', 'Amazon EBS volumes', 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html', 'Supports data-volume creation and Availability Zone scope.'],
  ['source-ebs-attach-volume', 'Attach an Amazon EBS volume to an instance', 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-attaching-volume.html', 'Supports safe attachment and device identification.'],
  ['source-ebs-modify-volume', 'Modify an Amazon EBS volume', 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-modify-volume.html', 'Supports online gp3 expansion.'],
  ['source-create-ami', 'Create an Amazon EBS-backed AMI', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-an-ami-ebs.html', 'Supports repeatable configured instance images.'],
  ['source-alb-getting-started', 'Getting started with Application Load Balancers', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancer-getting-started.html', 'Supports the two-AZ ALB, listener, and target group.'],
  ['source-alb-security-groups', 'Security groups for your Application Load Balancer', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-update-security-groups.html', 'Supports ALB-to-instance security-group referencing.'],
  ['source-alb-health-checks', 'Health checks for Application Load Balancer target groups', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html', 'Supports target health verification and failover.'],
  ['source-ec2-user-data', 'Run commands on your Linux instance at launch', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html', 'Supports complete Apache user data.'],
  ['source-launch-templates', 'Create an Amazon EC2 launch template', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-launch-template.html', 'Supports repeatable Auto Scaling launches.'],
  ['source-asg-first', 'Create your first Auto Scaling group', 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/create-your-first-auto-scaling-group.html', 'Supports capacity and subnet configuration.'],
  ['source-asg-load-balancer', 'Use Elastic Load Balancing with an Auto Scaling group', 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-load-balancer.html', 'Supports target-group registration and health replacement.'],
  ['source-ec2-cloudwatch', 'Monitor your instances using CloudWatch', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html', 'Supports EC2 operational metrics.'],
  ['source-asg-target-tracking', 'Target tracking scaling policies for Amazon EC2 Auto Scaling', 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html', 'Supports CPU target tracking.'],
  ['source-alb-cloudwatch', 'CloudWatch metrics for your Application Load Balancer', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-cloudwatch-metrics.html', 'Supports healthy and unhealthy host monitoring.'],
  ['source-sns-start', 'Getting started with Amazon SNS', 'https://docs.aws.amazon.com/sns/latest/dg/sns-getting-started.html', 'Supports the operations notification topic.'],
  ['source-session-manager', 'AWS Systems Manager Session Manager', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html', 'Supports secure no-SSH access.'],
  ['source-run-command', 'Running commands using Systems Manager Run Command', 'https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html', 'Supports managed operational checks.'],
  ['source-eventbridge-ec2-events', 'Amazon EC2 events', 'https://docs.aws.amazon.com/eventbridge/latest/ref/events-ref-ec2.html', 'Supports instance state-change routing.'],
  ['source-cloudtrail-ec2', 'Logging Amazon EC2 API calls with AWS CloudTrail', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitor-with-cloudtrail.html', 'Supports EC2 API audit review.'],
  ['source-ec2-purchasing', 'Amazon EC2 billing and purchasing options', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html', 'Supports SAA-C03 purchasing comparisons.'],
  ['source-spot', 'Amazon EC2 Spot Instances', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html', 'Supports interruptible-capacity decisions.'],
  ['source-placement-groups', 'Placement groups for your Amazon EC2 instances', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html', 'Supports placement strategy comparisons.'],
  ['source-terminate-instances', 'Terminate Amazon EC2 instances', 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/terminating-instances.html', 'Supports permanent instance cleanup.'],
  ['source-delete-alb', 'Delete an Application Load Balancer', 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-delete.html', 'Supports ALB cleanup order.'],
  ['source-delete-asg', 'Delete your Auto Scaling infrastructure', 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/delete-your-auto-scaling-infrastructure.html', 'Supports scaling cleanup order.']
];

const sources = [...base.sources];
for (const [id, title, url, purpose] of extraSources) {
  if (!sources.some(source => source.id === id)) sources.push({ id, title, url, publisher: 'AWS', sourceType: 'official_documentation', purpose, taskIds: [] });
}
for (const task of tasks) {
  for (const sourceId of task.sourceIds) {
    const source = sources.find(item => item.id === sourceId);
    if (!source) throw new Error(`Missing source ${sourceId}`);
    source.taskIds = [...new Set([...(source.taskIds || []), task.id])];
  }
}
for (const source of sources) source.taskIds = source.taskIds.filter(taskId => tasks.some(task => task.id === taskId));

const task8Step = task8.consoleSteps[0];
task8Step.jsonBlocks.push({
  id: `${task8Step.id}-json-2`, title: 'fa-ec2-launch-template.json', language: 'json', sourceIds: ['source-launch-templates'],
  content: JSON.stringify({ ImageId: 'resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64', InstanceType: 't3.micro', SecurityGroupIds: ['[WEB_SG_ID]'], IamInstanceProfile: { Name: 'fa-ec2-ssm-profile' }, UserData: '[BASE64_ENCODED_ASG_WEB_USER_DATA]', MetadataOptions: { HttpTokens: 'required', HttpEndpoint: 'enabled' }, BlockDeviceMappings: [{ DeviceName: '/dev/xvda', Ebs: { VolumeSize: 8, VolumeType: 'gp3', Encrypted: true, DeleteOnTermination: true } }] }, null, 2)
});
const task9Step = task9.consoleSteps[1];
task9Step.jsonBlocks.push({
  id: `${task9Step.id}-json-1`, title: 'fa-ec2-target-tracking.json', language: 'json', sourceIds: ['source-asg-target-tracking'],
  content: JSON.stringify({ PredefinedMetricSpecification: { PredefinedMetricType: 'ASGAverageCPUUtilization' }, TargetValue: 50, EstimatedInstanceWarmup: 180, DisableScaleIn: false }, null, 2)
});
const task10Step = task10.consoleSteps[1];
task10Step.jsonBlocks.push({
  id: `${task10Step.id}-json-1`, title: 'fa-ec2-state-change-pattern.json', language: 'json', sourceIds: ['source-eventbridge-ec2-events'],
  content: JSON.stringify({ source: ['aws.ec2'], 'detail-type': ['EC2 Instance State-change Notification'], detail: { 'instance-id': ['[INSTANCE_ID]'], state: ['pending', 'running', 'stopping', 'stopped', 'shutting-down', 'terminated'] } }, null, 2)
});

const cleanupTargets = [
  ['Delete scaling policies and alarms', 'Delete fa-ec2-cpu-target-tracking, its managed alarms, and fa-ec2-unhealthy-targets.'],
  ['Scale down and delete fa-ec2-web-asg', 'Set minimum and desired capacity to zero, wait for its instances to terminate, then delete the group.'],
  ['Delete launch template fa-ec2-web-template', 'Delete every version by deleting the exact launch template.'],
  ['Delete the ALB', 'Delete fa-ec2-web-alb and wait until it is absent.'],
  ['Delete target group', 'Delete fa-ec2-web-targets after the ALB no longer references it.'],
  ['Terminate manual instances', 'Terminate fa-ec2-web-01 and fa-ec2-web-02 and wait until Terminated.'],
  ['Deregister the AMI and delete its snapshot', 'Deregister [WEB_AMI_ID], then delete [AMI_SNAPSHOT_ID].'],
  ['Delete manual snapshots', 'Delete [DATA_SNAPSHOT_ID] and the original recorded root snapshot.'],
  ['Delete retained data volumes', 'Detach if necessary, then delete [RESTORED_VOLUME_ID] and [DATA_VOLUME_ID].'],
  ['Delete EventBridge and SNS resources', 'Remove the fa-ec2-state-change SNS target, delete the rule, delete the email subscription, then delete fa-ec2-operations-topic.'],
  ['Delete CloudWatch Logs created for the lab', 'Delete only log groups associated with exact fa-ec2 workloads if they exist.'],
  ['Delete security groups', 'Delete fa-ec2-web-sg first after dependencies are gone, then delete fa-ec2-alb-sg.'],
  ['Delete route table dependencies', 'Disassociate both training subnets, delete the default route, and delete fa-ec2-public-rt.'],
  ['Delete the internet gateway', 'Detach fa-ec2-igw from fa-ec2-vpc, then delete it.'],
  ['Delete both subnets and VPC', 'Delete fa-ec2-public-subnet and fa-ec2-public-subnet-b, then delete fa-ec2-vpc.'],
  ['Delete instance identity', 'Remove fa-ec2-ssm-role from fa-ec2-ssm-profile, delete the profile, detach AmazonSSMManagedInstanceCore and AWSLambdaSQSQueueExecutionRole if present, then delete the role.'],
  ['Delete learner access', 'As the administrator, delete the learner access key, detach and delete the training policy, delete fa-ec2-learner, and remove only the local fa-ec2-learner profile.']
];
const cleanup = { steps: cleanupTargets.map(([title, instruction], index) => ({ id: `programme-cleanup-${index + 1}`, stepNumber: index + 1, title, instruction, description: instruction, verification: `${title} is complete and the exact target is absent.`, resourceKeys: [], sourceIds: [] })), completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' };

const content = {
  ...base,
  programme: {
    ...base.programme,
    serviceSlug: 'ec2', serviceName: 'Amazon Elastic Compute Cloud', shortName: 'Amazon EC2',
    displayName: 'Amazon EC2: Secure, Resilient, and Auto Scaled Web Infrastructure',
    subtitle: 'Build, operate, protect, load balance, scale, monitor, and safely remove a complete EC2 web environment.',
    description: 'Start with no learner infrastructure and complete six connected EC2 labs in eu-west-2. Create dedicated access and networking, launch and manage Amazon Linux through Session Manager, protect EBS data, build a two-AZ Application Load Balancer design, add Auto Scaling and CloudWatch, audit operations, compare SAA-C03 architecture choices, and remove every training resource.',
    learningOutcome: 'Build and explain secure EC2 infrastructure using both the AWS Console and CLI; operate instances without SSH; recover EBS data; create a highly available load-balanced web tier; configure self-healing and target tracking; monitor and audit operations; choose suitable purchasing and placement strategies; and perform complete reverse-order cleanup.',
    programmeId: 'ec2-learning-path', pathId: 'ec2-learning-path', category: 'Compute', difficulty: 'Beginner to Intermediate', estimatedMinutes: null, defaultRegion: 'eu-west-2', regionScope: 'mixed', publicationVisibility: 'unpublished'
  },
  sources, phases, tasks,
  progress: { ...base.progress, initialTaskId: tasks[0].id },
  resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: { region: 'eu-west-2' } },
  warnings: {
    cost: 'EC2 runtime, public IPv4 addresses, EBS volumes and snapshots, AMIs, Application Load Balancer hours and capacity, CloudWatch, SNS delivery, and data transfer can incur charges. Use t3.micro, the supplied small capacities, and complete final cleanup.',
    safety: 'Create and delete only exact fa-ec2 resources and recorded IDs. Never change a default VPC, unrelated instance, volume, snapshot, AMI, load balancer, scaling group, IAM identity, alarm, topic, or rule.',
    credentials: 'Never place passwords, access keys, or secrets in Author, commands, source control, screenshots, or chat. Delete the temporary learner key and local profile during cleanup.',
    region: 'Use eu-west-2 for regional resources and two available Availability Zones. IAM is global. Availability Zone labels can map differently between AWS accounts.'
  },
  cleanup,
  review: {
    validationStatus: 'passed', validationErrors: [], validationWarnings: [], sourceReviewStatus: 'reviewed', learnerPreviewStatus: 'reviewed', approvalDecision: 'pending', reviewStatus: 'ready_for_approval',
    findings: [
      { id: 'finding-1', findingNumber: 1, section: 'instructions', priority: 'advisory', message: 'Before candidate creation, confirm current AWS Console labels and ensure every bracketed ID, ARN, Availability Zone, public IPv4 /32, email address, and account ID is replaced only with the learner’s recorded value.', status: 'open' },
      { id: 'finding-2', findingNumber: 2, section: 'warnings', priority: 'advisory', message: 'The ALB, public IPv4 addresses, EC2 instances, EBS resources, snapshots, AMI, logs, and monitoring can incur charges. Keep the final reverse-dependency cleanup prominent.', status: 'open' },
      { id: 'finding-3', findingNumber: 3, section: 'instructions', priority: 'advisory', message: 'The inherited first five tasks come from the previously accepted local EC2 beginner package; review their Console labels together with the seven newly grouped tasks before candidate creation.', status: 'open' }
    ]
  },
  publication: { publishStatus: 'not_published', targetProgrammeId: 'ec2-learning-path', proposedChanges: [] }
};
delete content.draft;

const planning = validateAuthorPlanning(content);
const authorContent = validateAuthorContent(content);
const review = validateAuthorReview(content);
if (!planning.valid || !authorContent.valid || !review.valid) {
  console.error(JSON.stringify({ planning, authorContent, review }, null, 2));
  throw new Error('Grouped EC2 handoff validation failed.');
}

const summary = {
  phaseCount: phases.length, taskCount: tasks.length,
  checkboxCount: tasks.flatMap(task => task.consoleSteps).flatMap(step => step.instructions).length,
  cliCommandCount: tasks.flatMap(task => task.cliSteps).length,
  verificationCheckCount: tasks.flatMap(task => task.verification).length,
  cleanupItemCount: cleanup.steps.length,
  learnerResourceValueCount: 0,
  officialAwsSourceCount: sources.length
};
const stageRecords = {
  planning: { stage: '1-5', status: 'prepared_and_reviewed', validation: planning, phases: phases.map(({ id, taskIds }) => ({ id, taskIds })) },
  instructions: { stage: '6', status: 'prepared_and_reviewed', checkboxCount: summary.checkboxCount, cliCommandCount: summary.cliCommandCount },
  resourcesAndChecks: { stage: '7', status: 'prepared_and_reviewed', verificationCheckCount: summary.verificationCheckCount },
  cleanup: { stage: '8', status: 'prepared_and_reviewed', cleanupItemCount: summary.cleanupItemCount, ordering: 'reverse_dependency' },
  authoringCheck: { stage: '9', status: 'passed', planningValid: true, contentValid: true, reviewValid: true },
  learnerPreview: { stage: '10', status: 'reviewed', programmeId: 'ec2-learning-path', summary },
  structuredReview: { stage: '11', status: 'ready_for_approval', findings: content.review.findings }
};
const manifest = Object.fromEntries(Object.entries(stageRecords).map(([key, value]) => [key, { algorithm: 'sha256-json-v1', value: fingerprint(value) }]));
const chain = Object.fromEntries(['instructions', 'resourcesAndChecks', 'cleanup', 'authoringCheck', 'learnerPreview', 'structuredReview'].map((key, index) => [`stage${index + 6}`, { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords[key]) }]));
const handoff = {
  schemaVersion: 1, kind: 'author_local_handoff_package', status: 'awaiting_human_handoff_review', sessionId, preparedAt, generationMode: 'new_follow_along',
  service: { officialName: 'Amazon Elastic Compute Cloud', shortName: 'Amazon EC2' }, acceptedFingerprintChain: chain, acceptedRecordManifest: manifest, authorDraftContent: content,
  identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'A later separately approved write step must bind the currently signed-in Author and create a new draft identity.' },
  summary,
  handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false },
  acceptedStagesOneToElevenChanged: false
};
const fpContent = structuredClone(handoff);
delete fpContent.status;
delete fpContent.preparedAt;
handoff.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprint(fpContent) };

const preview = [
  'AUTHOR LOCAL HANDOFF PACKAGE - GROUPED AMAZON EC2', '',
  `Programme: ${content.programme.displayName}`,
  `Phases: ${summary.phaseCount}`, `Tasks: ${summary.taskCount}`, `Console checkboxes: ${summary.checkboxCount}`, `CLI commands: ${summary.cliCommandCount}`,
  `Verification checks: ${summary.verificationCheckCount}`, `Cleanup items: ${summary.cleanupItemCount}`, `Official AWS sources: ${summary.officialAwsSourceCount}`,
  `SHA-256 handoff fingerprint: ${handoff.handoffFingerprint.value}`, '',
  'LABS', ...phases.map(phase => `${phase.phaseNumber}. ${phase.title}`), '',
  'VALIDATION', 'Planning: passed', 'Content: passed', 'Structured review: passed', '',
  'BOUNDARIES', 'Nothing was written to Author, Supabase or AWS.', 'No identity was bound.', 'No candidate was created.', 'Nothing was approved or published.', 'The package is waiting for human review.', ''
].join('\n');

await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, 'author-local-handoff-package.json'), `${JSON.stringify(handoff, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'complete-follow-along-preview.txt'), preview, 'utf8');
await fs.writeFile(path.join(directory, 'session.json'), `${JSON.stringify({ schemaVersion: 1, sessionId, status: 'handoff_awaiting_human_review', createdAt: preparedAt, inputs: { serviceName: 'Amazon Elastic Compute Cloud', shortName: 'Amazon EC2', level: 'Beginner to Intermediate', region: 'eu-west-2' }, boundaries: handoff.handoffBoundary }, null, 2)}\n`, 'utf8');
console.log(preview);
