import { EC2_TASKS } from '../features/followAlongs/catalogues/ec2FollowAlongTasks.js';

export const EC2_PATH_ID = 'ec2-learning-path';

export const EC2_RESOURCE_TAGS = {
  StudyTrackerFollowAlong: 'ec2-learning-path',
  StudyTrackerEnvironment: 'ec2-lab',
  CreatedBy: 'StudyTracker'
};

// 9 Path-Only Foundation and Bridge Tasks
export const EC2_PATH_ONLY_TASKS = [
  {
    id: 'path-ec2-design-lab-environment',
    title: 'Design the EC2 Lab Environment & Subnet Layout',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Easy',
    estimatedMinutes: 10,
    isPathOnly: true,
    goal: 'Design a dedicated, isolated EC2 lab network CIDR plan (10.50.0.0/16) with public and private subnets.',
    whyItMatters: 'Designing a dedicated EC2 environment ensures total isolation from VPC Follow Along tasks and guarantees no shared resource conflicts.',
    consoleSteps: [
      {
        id: 'ec2-design-step-1',
        title: 'Review the EC2 Lab Architecture Plan',
        instructions: [
          { id: 'ec2-design-ins-1', label: 'Define VPC CIDR block 10.50.0.0/16 in Region eu-west-2.', detail: 'Provides 65,536 private IP addresses for EC2 lab instances.' },
          { id: 'ec2-design-ins-2', label: 'Define Public Subnet CIDR 10.50.1.0/24 in AZ1.', detail: 'Hosts public web servers, bastion host, and gateway interfaces.' },
          { id: 'ec2-design-ins-3', label: 'Define Private Subnet CIDR 10.50.10.0/24 in AZ1.', detail: 'Hosts isolated private EC2 instances for SSM Session Manager testing.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-design-cli-1',
        title: 'Document Environment Variables',
        commands: [
          { id: 'ec2-design-cmd-1', text: 'export EC2_VPC_CIDR="10.50.0.0/16" && export EC2_PUB_CIDR="10.50.1.0/24" && export EC2_PRIV_CIDR="10.50.10.0/24"', explanation: 'Set shell environment variables for the EC2 lab.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-design-v1', text: 'Confirm the EC2 lab CIDR plan 10.50.0.0/16 does not overlap with default VPCs.' }],
    cleanup: [{ id: 'ec2-design-c1', text: 'No live resources created during the design phase.' }]
  },
  {
    id: 'path-ec2-create-lab-vpc',
    title: 'Create Dedicated EC2 Lab VPC',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Easy',
    estimatedMinutes: 10,
    isPathOnly: true,
    goal: 'Create an isolated VPC (10.50.0.0/16) with DNS resolution and DNS hostnames enabled.',
    whyItMatters: 'Enabling DNS hostnames is a strict prerequisite for SSM Session Manager private endpoints and EC2 Instance Connect.',
    consoleSteps: [
      {
        id: 'ec2-vpc-step-1',
        title: 'Create the EC2 Lab VPC',
        instructions: [
          { id: 'ec2-vpc-ins-1', label: 'Open VPC Console and click Create VPC.', detail: 'Name: saa-ec2-vpc, IPv4 CIDR: 10.50.0.0/16.' },
          { id: 'ec2-vpc-ins-2', label: 'Enable DNS hostnames and DNS resolution in VPC Settings.', detail: 'Required for Systems Manager VPC Endpoint DNS resolution.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-vpc-cli-1',
        title: 'Create VPC via AWS CLI',
        commands: [
          { id: 'ec2-vpc-cmd-1', text: 'aws ec2 create-vpc --cidr-block 10.50.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=saa-ec2-vpc},{Key=StudyTrackerFollowAlong,Value=ec2-learning-path}]"', explanation: 'Creates the dedicated EC2 lab VPC with tags.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-vpc-v1', text: 'Verify VPC state is available and DNS hostnames are enabled.' }],
    cleanup: [{ id: 'ec2-vpc-c1', text: 'Delete VPC saa-ec2-vpc during project teardown.' }]
  },
  {
    id: 'path-ec2-create-public-subnet',
    title: 'Create EC2 Lab Public Subnet',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    isPathOnly: true,
    goal: 'Create public subnet (10.50.1.0/24) in AZ1 with auto-assign public IPv4 enabled.',
    whyItMatters: 'Provides internet-routable IP addresses for primary Linux instance and web servers.',
    consoleSteps: [
      {
        id: 'ec2-pub-step-1',
        title: 'Create Public Subnet',
        instructions: [
          { id: 'ec2-pub-ins-1', label: 'Select VPC saa-ec2-vpc, Name: saa-ec2-subnet-pub, CIDR: 10.50.1.0/24.', detail: 'Choose Availability Zone eu-west-2a.' },
          { id: 'ec2-pub-ins-2', label: 'Enable Auto-assign public IPv4 address setting.', detail: 'Ensures launched EC2 instances receive public IPs.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-pub-cli-1',
        title: 'Create Subnet via AWS CLI',
        commands: [
          { id: 'ec2-pub-cmd-1', text: 'aws ec2 create-subnet --vpc-id {{ec2VpcId}} --cidr-block 10.50.1.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=saa-ec2-subnet-pub},{Key=StudyTrackerFollowAlong,Value=ec2-learning-path}]"', explanation: 'Creates public subnet.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-pub-v1', text: 'Confirm public subnet exists with auto-assign public IP enabled.' }],
    cleanup: [{ id: 'ec2-pub-c1', text: 'Delete public subnet during teardown.' }]
  },
  {
    id: 'path-ec2-create-private-subnet',
    title: 'Create EC2 Lab Private Subnet',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Easy',
    estimatedMinutes: 8,
    isPathOnly: true,
    goal: 'Create private subnet (10.50.10.0/24) in AZ1 for isolated SSM workload testing.',
    whyItMatters: 'Allows testing private EC2 instances without direct public ingress or NAT Gateway requirements.',
    consoleSteps: [
      {
        id: 'ec2-priv-step-1',
        title: 'Create Private Subnet',
        instructions: [
          { id: 'ec2-priv-ins-1', label: 'Select VPC saa-ec2-vpc, Name: saa-ec2-subnet-priv, CIDR: 10.50.10.0/24.', detail: 'Choose Availability Zone eu-west-2a.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-priv-cli-1',
        title: 'Create Private Subnet via CLI',
        commands: [
          { id: 'ec2-priv-cmd-1', text: 'aws ec2 create-subnet --vpc-id {{ec2VpcId}} --cidr-block 10.50.10.0/24 --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=saa-ec2-subnet-priv},{Key=StudyTrackerFollowAlong,Value=ec2-learning-path}]"', explanation: 'Creates private subnet.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-priv-v1', text: 'Confirm private subnet state is available.' }],
    cleanup: [{ id: 'ec2-priv-c1', text: 'Delete private subnet during teardown.' }]
  },
  {
    id: 'path-ec2-attach-internet-gateway',
    title: 'Attach Internet Gateway & Configure Public Routing',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Easy',
    estimatedMinutes: 10,
    isPathOnly: true,
    goal: 'Attach Internet Gateway (saa-ec2-igw) to VPC and configure public route table (0.0.0.0/0 -> IGW).',
    whyItMatters: 'Enables external SSH, HTTP, and EC2 Instance Connect access for public subnets.',
    consoleSteps: [
      {
        id: 'ec2-igw-step-1',
        title: 'Attach IGW and Route Table',
        instructions: [
          { id: 'ec2-igw-ins-1', label: 'Create Internet Gateway saa-ec2-igw and attach to VPC saa-ec2-vpc.', detail: 'Connects VPC to external internet.' },
          { id: 'ec2-igw-ins-2', label: 'Edit public route table: add route 0.0.0.0/0 targeting IGW.', detail: 'Associates route table with public subnet saa-ec2-subnet-pub.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-igw-cli-1',
        title: 'Attach IGW via CLI',
        commands: [
          { id: 'ec2-igw-cmd-1', text: 'aws ec2 create-internet-gateway --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=saa-ec2-igw},{Key=StudyTrackerFollowAlong,Value=ec2-learning-path}]"', explanation: 'Creates IGW.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-igw-v1', text: 'Confirm route 0.0.0.0/0 targets the attached IGW.' }],
    cleanup: [{ id: 'ec2-igw-c1', text: 'Detach IGW and delete route table during teardown.' }]
  },
  {
    id: 'path-ec2-create-iam-foundation-role',
    title: 'Create IAM Foundation Role & Instance Profile for SSM',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Medium',
    estimatedMinutes: 12,
    isPathOnly: true,
    goal: 'Create IAM role saa-ec2-iam-role-ssm with AmazonSSMManagedInstanceCore policy and attach to instance profile.',
    whyItMatters: 'Must exist BEFORE any EC2 instance launches so instances automatically register with Systems Manager.',
    consoleSteps: [
      {
        id: 'ec2-iam-step-1',
        title: 'Create IAM Role for EC2 SSM',
        instructions: [
          { id: 'ec2-iam-ins-1', label: 'In IAM Console, create Role for EC2 service.', detail: 'Role Name: saa-ec2-iam-role-ssm.' },
          { id: 'ec2-iam-ins-2', label: 'Attach AWS Managed Policy AmazonSSMManagedInstanceCore.', detail: 'Provides minimal permissions required for SSM Session Manager.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-iam-cli-1',
        title: 'Create IAM Role & Instance Profile via CLI',
        commands: [
          { id: 'ec2-iam-cmd-1', text: 'aws iam create-role --role-name saa-ec2-iam-role-ssm --assume-role-policy-document file://ec2-trust-policy.json', explanation: 'Creates IAM role for EC2 trust.' },
          { id: 'ec2-iam-cmd-2', text: 'aws iam attach-role-policy --role-name saa-ec2-iam-role-ssm --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore', explanation: 'Attaches SSM policy.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-iam-v1', text: 'Verify instance profile saa-ec2-iam-role-ssm exists and contains policy AmazonSSMManagedInstanceCore.' }],
    cleanup: [{ id: 'ec2-iam-c1', text: 'Detach policy, remove role from instance profile, and delete role during teardown.' }]
  },
  {
    id: 'path-ec2-configure-ssm-endpoints',
    title: 'Configure SSM Interface Endpoints for Private Instances',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    isPathOnly: true,
    goal: 'Create required SSM Interface Endpoints (ssm, ssmmessages) and evaluate ec2messages if required by legacy agent or Region.',
    whyItMatters: 'Enables private EC2 instances in private subnets to register with Systems Manager without a NAT Gateway. Modern AL2023 agent requires ssm and ssmmessages; legacy agents or specific Regions may also require ec2messages.',
    consoleSteps: [
      {
        id: 'ec2-vpce-step-1',
        title: 'Create Security Group and Interface Endpoints',
        instructions: [
          { id: 'ec2-vpce-ins-1', label: 'Create Endpoint Security Group saa-ec2-sg-ssm-vpce with inbound HTTPS 443 from 10.50.0.0/16.', detail: 'Allows EC2 instances to communicate with VPC endpoints.' },
          { id: 'ec2-vpce-ins-2', label: 'Create Interface Endpoints for com.amazonaws.eu-west-2.ssm and com.amazonaws.eu-west-2.ssmmessages with Private DNS enabled.', detail: 'Mandatory required endpoints for Session Manager shell connections.' },
          { id: 'ec2-vpce-ins-3', label: 'Evaluate if ec2messages endpoint is required for your AMI / Region.', detail: 'AL2023 with SSM Agent v3+ uses ssmmessages. Legacy SSM Agent v2 or certain government/specialized Regions require ec2messages for VIM commands.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-vpce-cli-1',
        title: 'Create VPC Endpoints via CLI',
        commands: [
          { id: 'ec2-vpce-cmd-1', text: 'aws ec2 create-vpc-endpoint --vpc-id {{ec2VpcId}} --vpc-endpoint-type Interface --service-name com.amazonaws.eu-west-2.ssm --subnet-ids {{ec2PrivateSubnetId}} --security-group-ids {{ec2SsmVpceSgId}} --private-dns-enabled', explanation: 'Creates required SSM core interface endpoint.' },
          { id: 'ec2-vpce-cmd-2', text: 'aws ec2 create-vpc-endpoint --vpc-id {{ec2VpcId}} --vpc-endpoint-type Interface --service-name com.amazonaws.eu-west-2.ssmmessages --subnet-ids {{ec2PrivateSubnetId}} --security-group-ids {{ec2SsmVpceSgId}} --private-dns-enabled', explanation: 'Creates required SSMMessages interface endpoint for Session Manager streaming.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-vpce-v1', text: 'Verify ssm and ssmmessages endpoints are Available with Private DNS enabled (and ec2messages if required for legacy AMI).' }],
    cleanup: [{ id: 'ec2-vpce-c1', text: 'Delete VPC Endpoints and endpoint security group during teardown.' }]
  },
  {
    id: 'path-ec2-architecture-final-validation',
    title: 'End-to-End EC2 Architecture Validation',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    isPathOnly: true,
    goal: 'Perform end-to-end architecture audit of all EC2 compute, storage, AMI, launch template, and IAM resources.',
    whyItMatters: 'Validates that all lab resources match enterprise SAA-C03 design specifications prior to project teardown.',
    consoleSteps: [
      {
        id: 'ec2-val-step-1',
        title: 'Audit EC2 Infrastructure',
        instructions: [
          { id: 'ec2-val-ins-1', label: 'Verify primary instance state, security groups, key pairs, and IAM instance profiles.', detail: 'Confirms workload integrity.' },
          { id: 'ec2-val-ins-2', label: 'Verify custom AMIs, EBS volumes, ENIs, and launch templates.', detail: 'Audits auxiliary compute and storage assets.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-val-cli-1',
        title: 'Audit via AWS CLI',
        commands: [
          { id: 'ec2-val-cmd-1', text: 'aws ec2 describe-instances --filters "Name=tag:StudyTrackerFollowAlong,Values=ec2-learning-path"', explanation: 'Lists all instances created under ec2-learning-path.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-val-v1', text: 'Confirm 100% of created EC2 resources are accounted for in typed resource inventory.' }],
    cleanup: [{ id: 'ec2-val-c1', text: 'Proceed to project final cleanup.' }]
  },
  {
    id: 'path-ec2-project-final-cleanup',
    title: 'EC2 Follow Along 12-Step Project Teardown',
    examCode: 'aws-saa-c03',
    topicId: 'topic-ec2',
    difficulty: 'Medium',
    estimatedMinutes: 20,
    isPathOnly: true,
    goal: 'Execute 12-step dependency-driven teardown wizard deleting only resources tagged path_id = ec2-learning-path.',
    whyItMatters: 'Ensures zero orphaned resources, zero unattached Elastic IP charges, and zero unexpected charges without touching VPC Follow Along assets.',
    consoleSteps: [
      {
        id: 'ec2-clean-step-1',
        title: 'Execute 12-Step Teardown Wizard',
        instructions: [
          { id: 'ec2-clean-ins-1', label: 'Terminate disposable and primary EC2 instances.', detail: 'Step 1 & 2 of teardown.' },
          { id: 'ec2-clean-ins-2', label: 'Deregister AMIs, delete snapshots, EBS volumes, EIPs, ENIs, Launch Templates, Key Pairs, IAM roles, Security Groups, Subnets, and VPC.', detail: 'Steps 3-12 of teardown.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'ec2-clean-cli-1',
        title: 'Teardown via CLI',
        commands: [
          { id: 'ec2-clean-cmd-1', text: 'aws ec2 terminate-instances --instance-ids {{primaryInstanceId}} {{privateEc2InstanceId}}', explanation: 'Terminates EC2 instances.' }
        ]
      }
    ],
    verification: [{ id: 'ec2-clean-v1', text: 'Verify 0 live resources remain under StudyTrackerFollowAlong = ec2-learning-path.' }],
    cleanup: [{ id: 'ec2-clean-c1', text: 'Teardown wizard complete.' }]
  }
];

// EC2 Programme Phases Structure (8 Phases, 34 Tasks)
export const EC2_LEARNING_PATH_PHASES = [
  {
    id: 'phase-1-ec2-planning-foundation',
    number: 1,
    title: 'Phase 1 — EC2 Planning & Lab Networking Foundation',
    description: 'Design the isolated EC2 lab CIDR block, create dedicated VPC, public/private subnets, and Internet Gateway.',
    taskIds: [
      'task-saa-ec2-compare-ec2-pricing-models-016',
      'path-ec2-design-lab-environment',
      'path-ec2-create-lab-vpc',
      'path-ec2-create-public-subnet',
      'path-ec2-create-private-subnet',
      'path-ec2-attach-internet-gateway'
    ]
  },
  {
    id: 'phase-2-iam-security-keypair',
    number: 2,
    title: 'Phase 2 — IAM, Security Groups & Key Pair',
    description: 'Establish baseline security groups, IAM instance profile for SSM, and create the SSH key pair before launch.',
    taskIds: [
      'path-ec2-create-iam-foundation-role',
      'task-saa-ec2-configure-a-security-group-for-http-and-ssh-006',
      'task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007'
    ]
  },
  {
    id: 'phase-3-compute-launch-connectivity',
    number: 3,
    title: 'Phase 3 — Compute Launch, Connectivity & SSM Session Manager',
    description: 'Launch primary Linux instance, connect via SSH & Instance Connect, setup SSM VPC Endpoints & Session Manager.',
    taskIds: [
      'task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001',
      'task-saa-ec2-connect-to-an-ec2-instance-using-ssh-or-rdp-003',
      'task-saa-ec2-use-ec2-instance-connect-014',
      'path-ec2-configure-ssm-endpoints',
      'task-saa-ec2-launch-ec2-instances-in-public-and-private-subnets-and-assign-public-private-ips-023',
      'task-saa-ec2-use-ssm-session-manager-and-patch-manager-with-ec2-027'
    ]
  },
  {
    id: 'phase-4-iam-metadata-network-sec',
    number: 4,
    title: 'Phase 4 — IAM Roles, Metadata & Network Security',
    description: 'Enforce IMDSv2, attach S3 IAM roles to running instances, compare Security Groups vs NACLs, and configure ENIs/EIPs.',
    taskIds: [
      'task-saa-ec2-configure-ec2-instance-metadata-options-011',
      'task-saa-ec2-attach-an-iam-role-to-ec2-for-secure-s3-access-010',
      'task-saa-ec2-compare-security-groups-and-nacls-for-ec2-networking-018',
      'task-saa-ec2-configure-and-use-enis-and-elastic-ips-with-ec2-017'
    ]
  },
  {
    id: 'phase-5-storage-metrics-lifecycle',
    number: 5,
    title: 'Phase 5 — Storage, Metrics & Lifecycle Operations',
    description: 'Attach EBS volumes, monitor CloudWatch metrics, test stop/start/terminate on disposable instances, and demonstrate Hibernation.',
    taskIds: [
      'task-saa-ec2-create-and-attach-an-ebs-volume-to-an-ec2-instance-004',
      'task-saa-ec2-monitor-ec2-instance-metrics-with-cloudwatch-015',
      'task-saa-ec2-stop-start-and-terminate-an-ec2-instance-008',
      'task-saa-ec2-demonstrate-ec2-hibernate-and-stop-start-lifecycle-020',
      'task-saa-ec2-recover-an-ec2-instance-and-troubleshoot-common-issues-021'
    ]
  },
  {
    id: 'phase-6-images-automation',
    number: 6,
    title: 'Phase 6 — Images & Automated Deployment',
    description: 'Create custom AMIs, launch instances via AWS CLI, test Launch Templates, and review Image Builder.',
    taskIds: [
      'task-saa-ec2-create-an-ami-from-an-ec2-instance-and-launch-a-new-instance-from-the-ami-005',
      'task-saa-ec2-launch-an-ec2-instance-using-the-aws-cli-002',
      'task-saa-ec2-use-ec2-launch-templates-and-launch-configurations-024',
      'task-saa-ec2-use-ec2-image-builder-to-automate-ami-creation-019'
    ]
  },
  {
    id: 'phase-7-purchasing-placement',
    number: 7,
    title: 'Phase 7 — Purchasing Models & Placement Strategies',
    description: 'Test Spot Instances, Capacity Reservations, Placement Groups (Cluster, Partition, Spread), and pricing trade-offs.',
    taskIds: [
      'task-saa-ec2-launch-a-spot-instance-013',
      'task-saa-ec2-set-up-ec2-capacity-reservations-022',
      'task-saa-ec2-set-up-a-placement-group-012',
      'task-saa-ec2-compare-ec2-placement-strategies-cluster-partition-and-spread-025'
    ]
  },
  {
    id: 'phase-8-validation-teardown',
    number: 8,
    title: 'Phase 8 — Final Validation & Teardown',
    description: 'Perform end-to-end architecture audit and execute 12-step project cleanup wizard.',
    taskIds: [
      'path-ec2-architecture-final-validation',
      'path-ec2-project-final-cleanup'
    ]
  }
];

// Flat Task Ordering Array (34 Total Tasks)
export const EC2_PATH_ORDERED_TASK_IDS = EC2_LEARNING_PATH_PHASES.flatMap(p => p.taskIds);

// Task Wrappers for Connected Path Behavior
export const EC2_PATH_TASK_WRAPPERS = {
  // Key pair creation before launch vs connection after launch
  'task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007': {
    titleOverride: 'Set Up an EC2 Key Pair (Pre-Launch)',
    connectedPrerequisites: ['task-saa-ec2-configure-a-security-group-for-http-and-ssh-006'],
    connectedGoal: 'Create and securely store the EC2 key pair saa-ec2-keypair before launching compute instances.',
    resourceBindings: { keyPairName: 'ec2KeyPairName' }
  },
  'task-saa-ec2-connect-to-an-ec2-instance-using-ssh-or-rdp-003': {
    titleOverride: 'Connect to Primary Linux Instance via SSH',
    connectedPrerequisites: ['task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001', 'task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007'],
    connectedGoal: 'Use the pre-created key pair saa-ec2-keypair to connect to primary instance saa-ec2-primary via SSH.'
  },
  // Launch primary instance in public subnet of EC2 lab VPC
  'task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001': {
    titleOverride: 'Launch Primary Linux Instance using AWS Console',
    connectedPrerequisites: ['path-ec2-attach-internet-gateway', 'path-ec2-create-iam-foundation-role', 'task-saa-ec2-configure-a-security-group-for-http-and-ssh-006', 'task-saa-ec2-set-up-a-key-pair-and-connect-to-ec2-007'],
    resourceBindings: { primaryInstanceId: 'primaryInstanceId' }
  },
  // Disposable secondary instance for destructive stop/start/terminate
  'task-saa-ec2-stop-start-and-terminate-an-ec2-instance-008': {
    titleOverride: 'Stop, Start, and Terminate a Disposable EC2 Instance',
    connectedPrerequisites: ['task-saa-ec2-launch-an-ec2-instance-using-the-aws-console-001'],
    connectedGoal: 'Launch disposable secondary instance saa-ec2-disposable-stop to test termination without destroying primary workload.',
    resourceBindings: { secondaryInstanceId: 'secondaryInstanceId' }
  },
  // Disposable hibernation instance with strict prerequisites
  'task-saa-ec2-demonstrate-ec2-hibernate-and-stop-start-lifecycle-020': {
    titleOverride: 'Demonstrate EC2 Hibernation on Dedicated Instance',
    connectedPrerequisites: ['task-saa-ec2-stop-start-and-terminate-an-ec2-instance-008'],
    connectedGoal: 'Launch disposable instance saa-ec2-disposable-hibernate with encrypted root volume and hibernation explicitly enabled.',
    resourceBindings: { hibernateInstanceId: 'hibernateInstanceId' }
  },
  // Launch Templates vs Legacy Launch Configurations
  'task-saa-ec2-use-ec2-launch-templates-and-launch-configurations-024': {
    titleOverride: 'Use EC2 Launch Templates (Launch Configurations Legacy Review)',
    connectedPrerequisites: ['task-saa-ec2-create-an-ami-from-an-ec2-instance-and-launch-a-new-instance-from-the-ami-005'],
    connectedGoal: 'Create modern Launch Template saa-ec2-template while reviewing Launch Configurations as deprecated/legacy.',
    resourceBindings: { launchTemplateId: 'launchTemplateId' }
  },
  // Optional Branches
  'task-saa-ec2-use-ec2-image-builder-to-automate-ami-creation-019': { isOptionalBranch: true },
  'task-saa-ec2-launch-a-spot-instance-013': { isOptionalBranch: true },
  'task-saa-ec2-set-up-ec2-capacity-reservations-022': { isOptionalBranch: true }
};

// Full Catalogue Resolver for EC2 Path
export function getEc2PathTasks() {
  const canonicalMap = new Map(EC2_TASKS.map(t => [t.id, t]));
  const pathOnlyMap = new Map(EC2_PATH_ONLY_TASKS.map(t => [t.id, t]));

  return EC2_PATH_ORDERED_TASK_IDS.map((taskId, index) => {
    let rawTask = pathOnlyMap.get(taskId) || canonicalMap.get(taskId);
    if (!rawTask) {
      throw new Error(`[EC2Path] Task ID '${taskId}' not found in canonical or path-only catalogues.`);
    }

    const wrapper = EC2_PATH_TASK_WRAPPERS[taskId] || {};

    return {
      ...rawTask,
      pathSequenceNumber: index + 1,
      title: wrapper.titleOverride || rawTask.title,
      goal: wrapper.connectedGoal || rawTask.goal,
      prerequisites: wrapper.connectedPrerequisites || rawTask.prerequisites || [],
      isOptionalBranch: !!wrapper.isOptionalBranch,
      resourceBindings: wrapper.resourceBindings || {}
    };
  });
}

// Audit Function for EC2 Learning Path Integrity
export function auditEc2LearningPath() {
  const canonicalIdsInTasks = new Set(EC2_TASKS.map(t => t.id));
  const pathOnlyIdsInTasks = new Set(EC2_PATH_ONLY_TASKS.map(t => t.id));

  const pathTaskIds = EC2_PATH_ORDERED_TASK_IDS;
  const uniquePathTaskIds = new Set(pathTaskIds);

  // 1. Audit task counts
  const canonicalCountInPath = pathTaskIds.filter(id => canonicalIdsInTasks.has(id)).length;
  const pathOnlyCountInPath = pathTaskIds.filter(id => pathOnlyIdsInTasks.has(id)).length;

  const omittedCanonical = [...canonicalIdsInTasks].filter(id => !uniquePathTaskIds.has(id));
  const duplicateTaskIds = pathTaskIds.filter((id, index) => pathTaskIds.indexOf(id) !== index);

  // 2. Audit DAG ordering (no required task depends on optional task)
  const resolvedTasks = getEc2PathTasks();
  const optionalTaskIds = new Set(resolvedTasks.filter(t => t.isOptionalBranch).map(t => t.id));
  const dagErrors = [];

  resolvedTasks.forEach(task => {
    if (!task.isOptionalBranch) {
      (task.prerequisites || []).forEach(reqId => {
        if (optionalTaskIds.has(reqId)) {
          dagErrors.push(`Required task '${task.id}' depends on optional task '${reqId}'`);
        }
      });
    }
  });

  return {
    totalTasks: pathTaskIds.length,
    canonicalCount: canonicalCountInPath,
    pathOnlyCount: pathOnlyCountInPath,
    phaseCount: EC2_LEARNING_PATH_PHASES.length,
    omittedCanonical,
    duplicateTaskIds,
    dagErrors,
    isValid: canonicalCountInPath === 25 &&
             pathOnlyCountInPath === 9 &&
             pathTaskIds.length === 34 &&
             EC2_LEARNING_PATH_PHASES.length === 8 &&
             omittedCanonical.length === 0 &&
             duplicateTaskIds.length === 0 &&
             dagErrors.length === 0
  };
}
