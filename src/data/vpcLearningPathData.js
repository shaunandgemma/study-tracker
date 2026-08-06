/**
 * VPC Learning Path Catalogue & Sequence Definition
 *
 * Programmatically includes all 34 canonical VPC tasks plus 11 path-bridging tasks.
 * Zero-regression isolation requirement: Does not mutate canonical standalone task definitions.
 */

import { VPC_TASKS } from './tasks/vpcTasks.js';

// Map of canonical VPC task lookup by ID
const CANONICAL_TASK_MAP = new Map(VPC_TASKS.map(t => [t.id, t]));

export const VPC_LEARNING_PATH_PHASES = [
  {
    id: 'phase-1-vpc-foundation',
    phaseNumber: 1,
    title: 'Phase 1 — VPC Foundation',
    description: 'Design CIDR allocation, create the VPC container, build public and private subnets, attach an Internet Gateway, configure public route tables, and launch test workload instances.',
    taskIds: [
      'task-saa-vpc-design-a-vpc-cidr-plan-001',
      'task-saa-vpc-create-a-2-az-vpc-002',
      'path-vpc-create-public-subnets',
      'path-vpc-create-private-subnets',
      'task-saa-vpc-attach-an-internet-gateway-003',
      'path-vpc-configure-public-route-table',
      'task-saa-vpc-create-security-groups-for-bastion-ssh-and-app-ports-007',
      'path-vpc-launch-public-bastion-instance',
      'path-vpc-launch-private-test-instance'
    ]
  },
  {
    id: 'phase-2-private-outbound-access',
    phaseNumber: 2,
    title: 'Phase 2 — Private Outbound Access',
    description: 'Allocate Elastic IPs, configure NAT Gateways, build private route tables, validate outbound egress, review route topology, and explore optional NAT Instance alternatives.',
    taskIds: [
      'task-saa-vpc-configure-elastic-ips-and-test-eni-association-022',
      'task-saa-vpc-configure-a-nat-gateway-004',
      'path-vpc-configure-private-route-table',
      'path-vpc-validate-private-outbound-access',
      'task-saa-vpc-configure-route-tables-for-igw-and-nat-006',
      'task-saa-vpc-create-a-nat-instance-alternative-005'
    ]
  },
  {
    id: 'phase-3-network-security-observability',
    phaseNumber: 3,
    title: 'Phase 3 — Network Security and Observability',
    description: 'Create secondary ENIs, implement Network ACLs, compare SGs vs NACLs, configure VPC Flow Logs, troubleshoot connectivity, review security best practices, and explore Network Firewall.',
    taskIds: [
      'task-saa-vpc-create-multiple-enis-and-bind-services-023',
      'task-saa-vpc-implement-a-network-acl-rule-to-block-an-ip-range-008',
      'task-saa-vpc-compare-security-groups-and-nacls-using-ephemeral-return-traffic-029',
      'task-saa-vpc-configure-vpc-flow-logs-for-an-eni-009',
      'task-saa-vpc-troubleshoot-connectivity-with-reachability-analyzer-and-traceroute-032',
      'task-saa-vpc-review-and-implement-vpc-security-best-practices-036',
      'task-saa-vpc-set-up-aws-network-firewall-and-block-outbound-traffic-028',
      'task-saa-vpc-implement-an-asymmetric-routing-scenario-021'
    ]
  },
  {
    id: 'phase-4-aws-service-endpoints',
    phaseNumber: 4,
    title: 'Phase 4 — AWS Service Endpoints',
    description: 'Configure VPC DNS options, connect privately to S3, DynamoDB, and Secrets Manager via Gateway & Interface Endpoints, test Private DNS, and restrict access with policies.',
    taskIds: [
      'task-saa-vpc-configure-vpc-dns-options-and-test-private-dns-for-endpoints-016',
      'task-saa-vpc-create-an-s3-gateway-vpc-endpoint-013',
      'task-saa-vpc-create-a-dynamodb-gateway-endpoint-with-policy-restrictions-025',
      'task-saa-vpc-create-an-interface-vpc-endpoint-for-secrets-manager-014',
      'task-saa-vpc-restrict-access-with-a-vpc-endpoint-policy-015',
      'task-saa-vpc-create-least-privilege-iam-for-vpc-endpoint-management-034'
    ]
  },
  {
    id: 'phase-5-vpc-connectivity',
    phaseNumber: 5,
    title: 'Phase 5 — VPC Connectivity & Multi-VPC Topology',
    description: 'Build secondary and tertiary VPCs, configure VPC Peering, Transit Gateway, RAM resource sharing, and HA planning.',
    taskIds: [
      'path-vpc-create-second-vpc',
      'task-saa-vpc-set-up-vpc-peering-and-verify-private-connectivity-010',
      'task-saa-vpc-add-peering-routes-and-prove-no-transitive-routing-011',
      'path-vpc-create-third-vpc-tgw',
      'task-saa-vpc-configure-aws-transit-gateway-with-multiple-vpcs-012',
      'task-saa-vpc-plan-high-availability-for-nats-and-transit-gateway-attachments-033',
      'task-saa-vpc-compare-vpc-sharing-vpc-peering-and-privatelink-035',
      'task-saa-vpc-configure-vpc-sharing-with-aws-ram-020'
    ]
  },
  {
    id: 'phase-6-privatelink',
    phaseNumber: 6,
    title: 'Phase 6 — AWS PrivateLink',
    description: 'Expose microservices securely using Network Load Balancers, VPC Endpoint Services, and Consumer Interface Endpoints.',
    taskIds: [
      'task-saa-vpc-use-aws-privatelink-to-expose-a-service-privately-between-accounts-030',
      'task-saa-vpc-configure-endpoint-services-and-consumer-endpoints-031'
    ]
  },
  {
    id: 'phase-7-hybrid-ipv6-multi-region',
    phaseNumber: 7,
    title: 'Phase 7 — Hybrid, IPv6 and Multi-Region',
    description: 'Configure Customer & Virtual Private Gateways, dual-stack IPv6 routing, DHCP option sets, and multi-Region architectures.',
    taskIds: [
      'task-saa-vpc-configure-customer-gateway-and-virtual-private-gateway-018',
      'task-saa-vpc-enable-ipv6-in-a-vpc-and-test-ipv6-routing-026',
      'task-saa-vpc-configure-dhcp-options-set-for-custom-dns-and-domain-resolution-027',
      'task-saa-vpc-implement-vpc-multi-region-design-patterns-024'
    ]
  },
  {
    id: 'phase-8-final-validation-cleanup',
    phaseNumber: 8,
    title: 'Phase 8 — Final Validation and Teardown',
    description: 'Audit the integrated cloud architecture, review resource inventory, and perform dependency-ordered resource cleanup.',
    taskIds: [
      'path-vpc-architecture-final-validation',
      'path-vpc-project-final-cleanup'
    ]
  }
];

// Explicit prerequisite map enforcing strict DAG dependencies without optional-branch blocking
const PATH_TASK_PREREQUISITES = {
  'task-saa-vpc-design-a-vpc-cidr-plan-001': [],
  'task-saa-vpc-create-a-2-az-vpc-002': ['task-saa-vpc-design-a-vpc-cidr-plan-001'],
  'path-vpc-create-public-subnets': ['task-saa-vpc-create-a-2-az-vpc-002'],
  'path-vpc-create-private-subnets': ['path-vpc-create-public-subnets'],
  'task-saa-vpc-attach-an-internet-gateway-003': ['path-vpc-create-private-subnets'],
  'path-vpc-configure-public-route-table': ['task-saa-vpc-attach-an-internet-gateway-003'],
  'task-saa-vpc-create-security-groups-for-bastion-ssh-and-app-ports-007': ['path-vpc-configure-public-route-table'],
  'path-vpc-launch-public-bastion-instance': ['task-saa-vpc-create-security-groups-for-bastion-ssh-and-app-ports-007'],
  'path-vpc-launch-private-test-instance': ['path-vpc-launch-public-bastion-instance'],

  'task-saa-vpc-configure-elastic-ips-and-test-eni-association-022': ['path-vpc-launch-private-test-instance'],
  'task-saa-vpc-configure-a-nat-gateway-004': ['task-saa-vpc-configure-elastic-ips-and-test-eni-association-022'],
  'path-vpc-configure-private-route-table': ['task-saa-vpc-configure-a-nat-gateway-004'],
  'path-vpc-validate-private-outbound-access': ['path-vpc-configure-private-route-table'],
  'task-saa-vpc-configure-route-tables-for-igw-and-nat-006': ['path-vpc-validate-private-outbound-access'],
  'task-saa-vpc-create-a-nat-instance-alternative-005': ['task-saa-vpc-configure-route-tables-for-igw-and-nat-006'],

  'task-saa-vpc-create-multiple-enis-and-bind-services-023': ['path-vpc-validate-private-outbound-access'],
  'task-saa-vpc-implement-a-network-acl-rule-to-block-an-ip-range-008': ['task-saa-vpc-create-multiple-enis-and-bind-services-023'],
  'task-saa-vpc-compare-security-groups-and-nacls-using-ephemeral-return-traffic-029': ['task-saa-vpc-implement-a-network-acl-rule-to-block-an-ip-range-008'],
  'task-saa-vpc-configure-vpc-flow-logs-for-an-eni-009': ['task-saa-vpc-compare-security-groups-and-nacls-using-ephemeral-return-traffic-029'],
  'task-saa-vpc-troubleshoot-connectivity-with-reachability-analyzer-and-traceroute-032': ['task-saa-vpc-configure-vpc-flow-logs-for-an-eni-009'],
  'task-saa-vpc-review-and-implement-vpc-security-best-practices-036': ['task-saa-vpc-troubleshoot-connectivity-with-reachability-analyzer-and-traceroute-032'],
  'task-saa-vpc-set-up-aws-network-firewall-and-block-outbound-traffic-028': ['task-saa-vpc-review-and-implement-vpc-security-best-practices-036'],
  'task-saa-vpc-implement-an-asymmetric-routing-scenario-021': ['task-saa-vpc-review-and-implement-vpc-security-best-practices-036'],

  'task-saa-vpc-configure-vpc-dns-options-and-test-private-dns-for-endpoints-016': ['task-saa-vpc-review-and-implement-vpc-security-best-practices-036'],
  'task-saa-vpc-create-an-s3-gateway-vpc-endpoint-013': ['task-saa-vpc-configure-vpc-dns-options-and-test-private-dns-for-endpoints-016'],
  'task-saa-vpc-create-a-dynamodb-gateway-endpoint-with-policy-restrictions-025': ['task-saa-vpc-create-an-s3-gateway-vpc-endpoint-013'],
  'task-saa-vpc-create-an-interface-vpc-endpoint-for-secrets-manager-014': ['task-saa-vpc-create-a-dynamodb-gateway-endpoint-with-policy-restrictions-025'],
  'task-saa-vpc-restrict-access-with-a-vpc-endpoint-policy-015': ['task-saa-vpc-create-an-interface-vpc-endpoint-for-secrets-manager-014'],
  'task-saa-vpc-create-least-privilege-iam-for-vpc-endpoint-management-034': ['task-saa-vpc-restrict-access-with-a-vpc-endpoint-policy-015'],

  'path-vpc-create-second-vpc': ['task-saa-vpc-create-least-privilege-iam-for-vpc-endpoint-management-034'],
  'task-saa-vpc-set-up-vpc-peering-and-verify-private-connectivity-010': ['path-vpc-create-second-vpc'],
  'task-saa-vpc-add-peering-routes-and-prove-no-transitive-routing-011': ['task-saa-vpc-set-up-vpc-peering-and-verify-private-connectivity-010'],
  'path-vpc-create-third-vpc-tgw': ['task-saa-vpc-add-peering-routes-and-prove-no-transitive-routing-011'],
  'task-saa-vpc-configure-aws-transit-gateway-with-multiple-vpcs-012': ['path-vpc-create-third-vpc-tgw'],
  'task-saa-vpc-plan-high-availability-for-nats-and-transit-gateway-attachments-033': ['task-saa-vpc-add-peering-routes-and-prove-no-transitive-routing-011'],
  'task-saa-vpc-compare-vpc-sharing-vpc-peering-and-privatelink-035': ['task-saa-vpc-add-peering-routes-and-prove-no-transitive-routing-011'],
  'task-saa-vpc-configure-vpc-sharing-with-aws-ram-020': ['task-saa-vpc-compare-vpc-sharing-vpc-peering-and-privatelink-035'],

  'task-saa-vpc-use-aws-privatelink-to-expose-a-service-privately-between-accounts-030': ['task-saa-vpc-compare-vpc-sharing-vpc-peering-and-privatelink-035'],
  'task-saa-vpc-configure-endpoint-services-and-consumer-endpoints-031': ['task-saa-vpc-use-aws-privatelink-to-expose-a-service-privately-between-accounts-030'],

  'task-saa-vpc-configure-customer-gateway-and-virtual-private-gateway-018': ['task-saa-vpc-compare-vpc-sharing-vpc-peering-and-privatelink-035'],
  'task-saa-vpc-enable-ipv6-in-a-vpc-and-test-ipv6-routing-026': ['task-saa-vpc-compare-vpc-sharing-vpc-peering-and-privatelink-035'],
  'task-saa-vpc-configure-dhcp-options-set-for-custom-dns-and-domain-resolution-027': ['task-saa-vpc-enable-ipv6-in-a-vpc-and-test-ipv6-routing-026'],
  'task-saa-vpc-implement-vpc-multi-region-design-patterns-024': ['task-saa-vpc-configure-dhcp-options-set-for-custom-dns-and-domain-resolution-027'],

  'path-vpc-architecture-final-validation': ['task-saa-vpc-configure-dhcp-options-set-for-custom-dns-and-domain-resolution-027'],
  'path-vpc-project-final-cleanup': ['path-vpc-architecture-final-validation']
};

// Optional branches in the path
const OPTIONAL_BRANCH_TASK_IDS = new Set([
  'task-saa-vpc-create-a-nat-instance-alternative-005',
  'task-saa-vpc-set-up-aws-network-firewall-and-block-outbound-traffic-028',
  'task-saa-vpc-implement-an-asymmetric-routing-scenario-021',
  'path-vpc-create-third-vpc-tgw',
  'task-saa-vpc-configure-aws-transit-gateway-with-multiple-vpcs-012',
  'task-saa-vpc-plan-high-availability-for-nats-and-transit-gateway-attachments-033',
  'task-saa-vpc-configure-vpc-sharing-with-aws-ram-020',
  'task-saa-vpc-use-aws-privatelink-to-expose-a-service-privately-between-accounts-030',
  'task-saa-vpc-configure-endpoint-services-and-consumer-endpoints-031',
  'task-saa-vpc-configure-customer-gateway-and-virtual-private-gateway-018',
  'task-saa-vpc-implement-vpc-multi-region-design-patterns-024'
]);

// Path-only dedicated task definitions
const PATH_ONLY_TASKS = [
  {
    id: 'path-vpc-create-public-subnets',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Create public subnets across two Availability Zones',
    slug: 'create-public-subnets-2az',
    service: 'Amazon VPC',
    feature: 'Subnets',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    region: 'eu-west-2',
    goal: 'Goal: Create two public subnets in your main VPC across separate Availability Zones (eu-west-2a and eu-west-2b).',
    status: 'published',
    isPathTask: true,
    createdResourceKeys: ['publicSubnetAz1', 'publicSubnetAz2'],
    consoleSteps: [
      {
        id: 'step-1-create-pub-subnets',
        title: 'Create Public Subnets in VPC Console',
        description: 'Navigate to VPC Subnets and create two subnets with CIDRs 10.20.0.0/24 and 10.20.1.0/24.',
        instructions: [
          { id: 'ins-pub-sub-1', label: 'Open Subnets in VPC Console and click Create Subnet.', detail: 'Access VPC service from AWS Console search.' },
          { id: 'ins-pub-sub-2', label: 'Select VPC {{vpcId}}.', detail: 'Ensure your main VPC 1 (10.20.0.0/16) is selected.' },
          { id: 'ins-pub-sub-3', label: 'Create Subnet A: Name = saa-subnet-public-az1, AZ = eu-west-2a, CIDR = 10.20.0.0/24.', detail: 'Subnet A provides public connectivity in AZ1.' },
          { id: 'ins-pub-sub-4', label: 'Create Subnet B: Name = saa-subnet-public-az2, AZ = eu-west-2b, CIDR = 10.20.1.0/24.', detail: 'Subnet B provides public connectivity in AZ2.' },
          { id: 'ins-pub-sub-5', label: 'Enable "Auto-assign public IPv4 address" on both subnets.', detail: 'Auto-assign enables public IP allocation on instance launch.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-step-pub-subnets',
        title: 'Create Public Subnets via AWS CLI',
        description: 'Execute create-subnet commands for both Availability Zones.',
        commands: [
          {
            id: 'cmd-pub-sub-1',
            text: 'aws ec2 create-subnet --vpc-id {{vpcId}} --cidr-block 10.20.0.0/24 --availability-zone {{region}}a --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=saa-subnet-public-az1}]"',
            explanation: 'Creates public subnet A in AZ 1',
            expectedOutput: '{\n  "Subnet": {\n    "SubnetId": "subnet-...",\n    "CidrBlock": "10.20.0.0/24"\n  }\n}'
          },
          {
            id: 'cmd-pub-sub-2',
            text: 'aws ec2 create-subnet --vpc-id {{vpcId}} --cidr-block 10.20.1.0/24 --availability-zone {{region}}b --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=saa-subnet-public-az2}]"',
            explanation: 'Creates public subnet B in AZ 2',
            expectedOutput: '{\n  "Subnet": {\n    "SubnetId": "subnet-...",\n    "CidrBlock": "10.20.1.0/24"\n  }\n}'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify subnets subnet-pub-az1 and subnet-pub-az2 exist in your VPC' }
    ],
    cleanup: [
      { id: 'c1', label: 'Subnets will be cleaned up in Phase 8 Teardown' }
    ]
  },
  {
    id: 'path-vpc-create-private-subnets',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Create private subnets across two Availability Zones',
    slug: 'create-private-subnets-2az',
    service: 'Amazon VPC',
    feature: 'Subnets',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    region: 'eu-west-2',
    goal: 'Goal: Create two private subnets in your main VPC across separate Availability Zones (eu-west-2a and eu-west-2b).',
    status: 'published',
    isPathTask: true,
    createdResourceKeys: ['privateSubnetAz1', 'privateSubnetAz2'],
    consoleSteps: [
      {
        id: 'step-1-create-priv-subnets',
        title: 'Create Private Subnets in VPC Console',
        description: 'Create two private subnets with CIDRs 10.20.10.0/24 and 10.20.11.0/24 without auto-assigning public IPs.',
        instructions: [
          { id: 'ins-priv-sub-1', label: 'Open Subnets in VPC Console and click Create Subnet.', detail: 'Navigate to VPC -> Subnets.' },
          { id: 'ins-priv-sub-2', label: 'Select VPC {{vpcId}}.', detail: 'Select main VPC 1.' },
          { id: 'ins-priv-sub-3', label: 'Create Subnet A: Name = saa-subnet-private-az1, AZ = eu-west-2a, CIDR = 10.20.10.0/24.', detail: 'Private subnet in AZ1.' },
          { id: 'ins-priv-sub-4', label: 'Create Subnet B: Name = saa-subnet-private-az2, AZ = eu-west-2b, CIDR = 10.20.11.0/24.', detail: 'Private subnet in AZ2.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-step-priv-subnets',
        title: 'Create Private Subnets via AWS CLI',
        description: 'Execute create-subnet commands for private subnets.',
        commands: [
          {
            id: 'cmd-priv-sub-1',
            text: 'aws ec2 create-subnet --vpc-id {{vpcId}} --cidr-block 10.20.10.0/24 --availability-zone {{region}}a --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=saa-subnet-private-az1}]"',
            explanation: 'Creates private subnet A in AZ 1'
          },
          {
            id: 'cmd-priv-sub-2',
            text: 'aws ec2 create-subnet --vpc-id {{vpcId}} --cidr-block 10.20.11.0/24 --availability-zone {{region}}b --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=saa-subnet-private-az2}]"',
            explanation: 'Creates private subnet B in AZ 2'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify private subnets exist in your main VPC' }
    ],
    cleanup: [
      { id: 'c1', label: 'Private subnets will be cleaned up in Phase 8 Teardown' }
    ]
  },
  {
    id: 'path-vpc-configure-public-route-table',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Configure and associate public route tables',
    slug: 'configure-public-route-table',
    service: 'Amazon VPC',
    feature: 'Route Tables',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    region: 'eu-west-2',
    goal: 'Goal: Create a public route table, add a default route 0.0.0.0/0 pointing to your Internet Gateway, and associate public subnets.',
    status: 'published',
    isPathTask: true,
    createdResourceKeys: ['publicRouteTableId'],
    consoleSteps: [
      {
        id: 'step-pub-rtb',
        title: 'Create and Associate Public Route Table',
        description: 'Route 0.0.0.0/0 to IGW {{internetGatewayId}} and attach public subnets.',
        instructions: [
          { id: 'ins-rtb-1', label: 'Go to Route Tables and click Create route table.', detail: 'Navigate to VPC -> Route Tables.' },
          { id: 'ins-rtb-2', label: 'Name = saa-rtb-public, VPC = {{vpcId}}.', detail: 'Attach to main VPC.' },
          { id: 'ins-rtb-3', label: 'Edit routes: Add 0.0.0.0/0 with target Internet Gateway {{internetGatewayId}}.', detail: 'Routes all non-local IPv4 traffic to IGW.' },
          { id: 'ins-rtb-4', label: 'Subnet associations: Associate both public subnets ({{publicSubnetAz1}}, {{publicSubnetAz2}}).', detail: 'Makes subnets publicly accessible.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-pub-rtb',
        title: 'Configure Public Route Table via CLI',
        description: 'Create route table, add IGW route, and associate public subnets.',
        commands: [
          {
            id: 'cmd-rtb-1',
            text: 'aws ec2 create-route-table --vpc-id {{vpcId}} --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=saa-rtb-public}]"',
            explanation: 'Creates public route table'
          },
          {
            id: 'cmd-rtb-2',
            text: 'aws ec2 create-route --route-table-id {{publicRouteTableId}} --destination-cidr-block 0.0.0.0/0 --gateway-id {{internetGatewayId}}',
            explanation: 'Adds 0.0.0.0/0 route pointing to IGW'
          },
          {
            id: 'cmd-rtb-3',
            text: 'aws ec2 associate-route-table --route-table-id {{publicRouteTableId}} --subnet-id {{publicSubnetAz1}}',
            explanation: 'Associates public subnet A'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify public route table contains 0.0.0.0/0 route pointing to IGW' }
    ],
    cleanup: [
      { id: 'c1', label: 'Route table cleaned up in Phase 8 Teardown' }
    ]
  },
  {
    id: 'path-vpc-launch-public-bastion-instance',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Launch a public bastion test instance',
    slug: 'launch-public-bastion-instance',
    service: 'Amazon EC2',
    feature: 'EC2 Workload',
    difficulty: 'Medium',
    estimatedMinutes: 20,
    region: 'eu-west-2',
    goal: 'Goal: Launch an Amazon Linux 2023 t3.micro bastion host inside your public subnet to act as an SSH jump box.',
    status: 'published',
    isPathTask: true,
    createdResourceKeys: ['bastionInstanceId'],
    costNotice: 'This resource incurs hourly EC2 instance charges. Review current AWS pricing for your selected Region.',
    consoleSteps: [
      {
        id: 'step-bastion',
        title: 'Launch Bastion Host in Public Subnet',
        description: 'Launch EC2 instance in public subnet AZ1 with auto-assigned public IP.',
        instructions: [
          { id: 'ins-b1', label: 'Open EC2 Console -> Launch Instance.', detail: 'Navigate to EC2 dashboard.' },
          { id: 'ins-b2', label: 'Name = saa-ec2-bastion, AMI = Amazon Linux 2023, Instance type = t3.micro.', detail: 'Free-tier eligible instance configuration.' },
          { id: 'ins-b3', label: 'Network settings: VPC = {{vpcId}}, Subnet = {{publicSubnetAz1}}, Auto-assign Public IP = Enable.', detail: 'Ensures public IPv4 allocation.' },
          { id: 'ins-b4', label: 'Select security group {{bastionSgId}} allowing SSH port 22.', detail: 'Allows inbound SSH access.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-bastion',
        title: 'Launch Bastion Host via CLI',
        description: 'Execute run-instances command.',
        commands: [
          {
            id: 'cmd-b1',
            text: 'aws ec2 run-instances --image-id ami-0c0493b8277259166 --instance-type t3.micro --subnet-id {{publicSubnetAz1}} --security-group-ids {{bastionSgId}} --associate-public-ip-address --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-bastion}]"',
            explanation: 'Launches public bastion instance'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify instance status is running and has a valid public IPv4 address' }
    ],
    cleanup: [
      { id: 'c1', label: 'Terminate instance in Phase 8 Teardown' }
    ]
  },
  {
    id: 'path-vpc-launch-private-test-instance',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Launch a private test instance',
    slug: 'launch-private-test-instance',
    service: 'Amazon EC2',
    feature: 'EC2 Workload',
    difficulty: 'Medium',
    estimatedMinutes: 20,
    region: 'eu-west-2',
    goal: 'Goal: Launch an isolated private test instance inside private subnet AZ1 (no public IP address).',
    status: 'published',
    isPathTask: true,
    createdResourceKeys: ['privateTestInstanceId'],
    costNotice: 'This resource incurs hourly EC2 instance charges. Review current AWS pricing for your selected Region.',
    consoleSteps: [
      {
        id: 'step-priv-ec2',
        title: 'Launch Instance in Private Subnet',
        description: 'Launch EC2 instance in private subnet AZ1 without public IPv4 address.',
        instructions: [
          { id: 'ins-pe1', label: 'Open EC2 Console -> Launch Instance.', detail: 'Navigate to EC2 dashboard.' },
          { id: 'ins-pe2', label: 'Name = saa-ec2-private-test, AMI = Amazon Linux 2023, Instance type = t3.micro.', detail: 'Private test workload.' },
          { id: 'ins-pe3', label: 'Network settings: VPC = {{vpcId}}, Subnet = {{privateSubnetAz1}}, Auto-assign Public IP = Disable.', detail: 'No public IP address assigned.' },
          { id: 'ins-pe4', label: 'Select security group {{appSgId}}.', detail: 'Allows internal VPC access.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-priv-ec2',
        title: 'Launch Private Instance via CLI',
        description: 'Execute run-instances command for private subnet.',
        commands: [
          {
            id: 'cmd-pe1',
            text: 'aws ec2 run-instances --image-id ami-0c0493b8277259166 --instance-type t3.micro --subnet-id {{privateSubnetAz1}} --security-group-ids {{appSgId}} --no-associate-public-ip-address --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=saa-ec2-private-test}]"',
            explanation: 'Launches private workload instance'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify instance status is running and has only a private IPv4 address' }
    ],
    cleanup: [
      { id: 'c1', label: 'Terminate instance in Phase 8 Teardown' }
    ]
  },
  {
    id: 'path-vpc-configure-private-route-table',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Configure and associate private route tables',
    slug: 'configure-private-route-table',
    service: 'Amazon VPC',
    feature: 'Route Tables',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    region: 'eu-west-2',
    goal: 'Goal: Create a private route table, add route 0.0.0.0/0 pointing to NAT Gateway {{natGatewayId}}, and associate private subnets.',
    status: 'published',
    isPathTask: true,
    createdResourceKeys: ['privateRouteTableId'],
    consoleSteps: [
      {
        id: 'step-priv-rtb',
        title: 'Configure Private Route Table',
        description: 'Route 0.0.0.0/0 to NAT Gateway {{natGatewayId}}.',
        instructions: [
          { id: 'ins-prtb-1', label: 'Open Route Tables -> Create route table.', detail: 'Navigate to VPC -> Route Tables.' },
          { id: 'ins-prtb-2', label: 'Name = saa-rtb-private, VPC = {{vpcId}}.', detail: 'Attach to main VPC.' },
          { id: 'ins-prtb-3', label: 'Edit routes: Add 0.0.0.0/0 pointing to NAT Gateway {{natGatewayId}}.', detail: 'Directs egress traffic through NAT GW.' },
          { id: 'ins-prtb-4', label: 'Associate private subnets ({{privateSubnetAz1}}, {{privateSubnetAz2}}).', detail: 'Attaches private subnets.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-priv-rtb',
        title: 'Configure Private Route Table via CLI',
        description: 'Execute CLI commands.',
        commands: [
          {
            id: 'cmd-prtb-1',
            text: 'aws ec2 create-route-table --vpc-id {{vpcId}} --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=saa-rtb-private}]"',
            explanation: 'Creates private route table'
          },
          {
            id: 'cmd-prtb-2',
            text: 'aws ec2 create-route --route-table-id {{privateRouteTableId}} --destination-cidr-block 0.0.0.0/0 --nat-gateway-id {{natGatewayId}}',
            explanation: 'Adds 0.0.0.0/0 route pointing to NAT GW'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify private route table contains route to NAT Gateway' }
    ],
    cleanup: [
      { id: 'c1', label: 'Route table cleaned up in Phase 8 Teardown' }
    ]
  },
  {
    id: 'path-vpc-validate-private-outbound-access',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Validate private outbound internet access',
    slug: 'validate-private-outbound-access',
    service: 'Amazon VPC',
    feature: 'NAT Gateway Egress',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    region: 'eu-west-2',
    goal: 'Goal: SSH into bastion host, hop to private test instance, and verify successful outbound internet curl requests via NAT Gateway.',
    status: 'published',
    isPathTask: true,
    consoleSteps: [
      {
        id: 'step-val-outbound',
        title: 'Test Private Outbound Connectivity',
        description: 'Connect to private instance and execute curl https://aws.amazon.com.',
        instructions: [
          { id: 'ins-vo-1', label: 'SSH into bastion host ({{bastionInstanceId}}).', detail: 'Connect to bastion public IPv4.' },
          { id: 'ins-vo-2', label: 'From bastion, SSH into private instance ({{privateTestInstanceId}}).', detail: 'Jump box connection.' },
          { id: 'ins-vo-3', label: 'Execute `curl -I https://aws.amazon.com` and verify HTTP 200 OK response.', detail: 'Proves egress connectivity via NAT Gateway.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-val-outbound',
        title: 'Verify Outbound via SSM / CLI',
        description: 'Execute SSM send-command or curl verification.',
        commands: [
          {
            id: 'cmd-vo-1',
            text: 'aws ssm send-command --instance-ids {{privateTestInstanceId}} --document-name "AWS-RunShellScript" --parameters "commands=[\"curl -s -I https://aws.amazon.com | head -n 1\"]"',
            explanation: 'Executes remote curl test on private instance via SSM'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify HTTP 200 response returned from private instance' }
    ],
    cleanup: [
      { id: 'c1', label: 'No resource creation; inspection task' }
    ]
  },
  {
    id: 'path-vpc-create-second-vpc',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Create a second VPC with a non-overlapping CIDR',
    slug: 'create-second-vpc',
    service: 'Amazon VPC',
    feature: 'Multi-VPC Topology',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    region: 'eu-west-2',
    goal: 'Goal: Create VPC 2 (CIDR 10.30.0.0/16) to act as a partner or consumer network for VPC Peering and Transit Gateway testing.',
    status: 'published',
    isPathTask: true,
    createdResourceKeys: ['secondVpcId', 'secondSubnetId'],
    consoleSteps: [
      {
        id: 'step-vpc2',
        title: 'Create VPC 2 in Console',
        description: 'Create secondary VPC with CIDR 10.30.0.0/16.',
        instructions: [
          { id: 'ins-v2-1', label: 'Open VPC Console -> Create VPC.', detail: 'Navigate to VPC Dashboard.' },
          { id: 'ins-v2-2', label: 'Name = saa-vpc-partner, IPv4 CIDR = 10.30.0.0/16.', detail: 'Non-overlapping partner network.' },
          { id: 'ins-v2-3', label: 'Create subnet A in VPC 2: Name = saa-vpc2-subnet-a, CIDR = 10.30.0.0/24.', detail: 'Subnet A inside VPC 2.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-vpc2',
        title: 'Create VPC 2 via CLI',
        description: 'Execute create-vpc and create-subnet.',
        commands: [
          {
            id: 'cmd-v2-1',
            text: 'aws ec2 create-vpc --cidr-block 10.30.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-partner}]"',
            explanation: 'Creates secondary non-overlapping VPC'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify VPC 2 (10.30.0.0/16) status is available' }
    ],
    cleanup: [
      { id: 'c1', label: 'Cleaned up in Phase 8 Teardown' }
    ]
  },
  {
    id: 'path-vpc-create-third-vpc-tgw',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Create a third VPC for Transit Gateway star topology',
    slug: 'create-third-vpc-tgw',
    service: 'Amazon VPC',
    feature: 'Multi-VPC Topology',
    difficulty: 'Medium',
    estimatedMinutes: 15,
    region: 'eu-west-2',
    goal: 'Goal: Create VPC 3 (CIDR 10.40.0.0/16) to establish a 3-VPC star topology connected via AWS Transit Gateway.',
    status: 'published',
    isPathTask: true,
    createdResourceKeys: ['thirdVpcId'],
    consoleSteps: [
      {
        id: 'step-vpc3',
        title: 'Create VPC 3 for Transit Gateway',
        description: 'Create tertiary VPC with CIDR 10.40.0.0/16.',
        instructions: [
          { id: 'ins-v3-1', label: 'Open VPC Console -> Create VPC.', detail: 'Navigate to VPC Dashboard.' },
          { id: 'ins-v3-2', label: 'Name = saa-vpc-spoke2, IPv4 CIDR = 10.40.0.0/16.', detail: 'Spoke VPC 2.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-vpc3',
        title: 'Create VPC 3 via CLI',
        description: 'Execute create-vpc command.',
        commands: [
          {
            id: 'cmd-v3-1',
            text: 'aws ec2 create-vpc --cidr-block 10.40.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=saa-vpc-spoke2}]"',
            explanation: 'Creates tertiary VPC for Transit Gateway'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify VPC 3 (10.40.0.0/16) exists and is available' }
    ],
    cleanup: [
      { id: 'c1', label: 'Cleaned up in Phase 8 Teardown' }
    ]
  },
  {
    id: 'path-vpc-architecture-final-validation',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'VPC Architecture Integration & Final Validation',
    slug: 'vpc-architecture-final-validation',
    service: 'Amazon VPC',
    feature: 'Architecture Audit',
    difficulty: 'Hard',
    estimatedMinutes: 25,
    region: 'eu-west-2',
    goal: 'Goal: Perform an end-to-end architecture audit verifying all VPC subnets, endpoints, peering connections, flow logs, and route tables.',
    status: 'published',
    isPathTask: true,
    consoleSteps: [
      {
        id: 'step-final-val',
        title: 'Review Project Architecture & Resource Matrix',
        description: 'Verify connectivity matrix across all created path resources.',
        instructions: [
          { id: 'ins-fv-1', label: 'Open VPC Dashboard and review overall VPC resource counts.', detail: 'Inspect active resource counts.' },
          { id: 'ins-fv-2', label: 'Verify VPC 1 (10.20.0.0/16) subnets, NAT Gateway, and Gateway Endpoints.', detail: 'Verify core network stack.' },
          { id: 'ins-fv-3', label: 'Verify VPC Peering connection status between VPC 1 and VPC 2.', detail: 'Verify peering status active.' },
          { id: 'ins-fv-4', label: 'Confirm VPC Flow Logs status is active.', detail: 'Verify observability logging.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-final-val',
        title: 'Execute Architecture Audit Script',
        description: 'Run AWS CLI describe calls to generate resource summary.',
        commands: [
          {
            id: 'cmd-fv-1',
            text: 'aws ec2 describe-vpcs --vpc-ids {{vpcId}} {{secondVpcId}}',
            explanation: 'Inspects primary and secondary VPC states'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify all project VPC resources report active/available status' }
    ],
    cleanup: [
      { id: 'c1', label: 'Proceed to Phase 8 Final Cleanup task' }
    ]
  },
  {
    id: 'path-vpc-project-final-cleanup',
    examCode: 'aws-saa-c03',
    topicId: 'topic-vpc',
    title: 'Complete VPC Project Resource Teardown & Cleanup',
    slug: 'vpc-project-final-cleanup',
    service: 'Amazon VPC',
    feature: 'Project Teardown',
    difficulty: 'Hard',
    estimatedMinutes: 30,
    region: 'eu-west-2',
    goal: 'Goal: Orderly, dependency-safe teardown of all project resources created throughout the VPC Learning Path.',
    status: 'published',
    isPathTask: true,
    consoleSteps: [
      {
        id: 'step-teardown-wizard',
        title: 'Execute Dependency-Ordered Teardown Wizard',
        description: 'Follow reverse dependency ordering to delete created AWS resources.',
        instructions: [
          { id: 'ins-td-1', label: '1. Terminate EC2 test instances ({{bastionInstanceId}}, {{privateTestInstanceId}}).', detail: 'Release EC2 compute resources.' },
          { id: 'ins-td-2', label: '2. Delete VPC Endpoints (Gateway S3/DynamoDB, Interface Secrets Manager/PrivateLink).', detail: 'Delete private service endpoints.' },
          { id: 'ins-td-3', label: '3. Delete VPC Peering Connections ({{peeringConnectionId}}) and Transit Gateway Attachments.', detail: 'Release cross-VPC connections.' },
          { id: 'ins-td-4', label: '4. Delete NAT Gateways ({{natGatewayId}}) and release Elastic IPs ({{natEipAllocationId}}).', detail: 'Stop hourly NAT GW charges.' },
          { id: 'ins-td-5', label: '5. Delete Custom Route Tables, Security Groups, Subnets, Internet Gateways, and VPCs.', detail: 'Clean up base network components.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-teardown-wizard',
        title: 'Execute Teardown CLI Script',
        description: 'Delete resources in reverse order.',
        commands: [
          {
            id: 'cmd-td-1',
            text: 'aws ec2 terminate-instances --instance-ids {{bastionInstanceId}} {{privateTestInstanceId}}',
            explanation: 'Terminates EC2 test instances'
          },
          {
            id: 'cmd-td-2',
            text: 'aws ec2 delete-nat-gateway --nat-gateway-id {{natGatewayId}}',
            explanation: 'Deletes NAT Gateway'
          }
        ]
      }
    ],
    verification: [
      { id: 'v1', label: 'Verify all project resources are deleted and 0 active path resources remain' }
    ],
    cleanup: [
      { id: 'c1', label: 'Teardown complete' }
    ]
  }
];

// Custom wrappers for canonical tasks when rendered in the connected VPC Learning Path
const CANONICAL_PATH_WRAPPERS = {
  'task-saa-vpc-create-a-2-az-vpc-002': {
    goal: 'Goal: Create your primary multi-AZ VPC (CIDR 10.20.0.0/16) with DNS support and DNS hostnames enabled. Subnets are created in dedicated follow-up tasks.',
    createdResourceKeys: ['vpcId'],
    consoleSteps: [
      {
        id: 'step-vpc-create-path',
        number: 1,
        title: 'Create Primary VPC Container',
        description: 'Create VPC container with CIDR 10.20.0.0/16 and enable DNS options.',
        instructions: [
          { id: 'ins-vpc-p1', text: 'Open the AWS Management Console and search for VPC.' },
          { id: 'ins-vpc-p2', text: 'Click Create VPC and select "VPC only".' },
          { id: 'ins-vpc-p3', text: 'Set Name tag to saa-vpc-main.' },
          { id: 'ins-vpc-p4', text: 'Set IPv4 CIDR block to 10.20.0.0/16.' },
          { id: 'ins-vpc-p5', text: 'Enable "DNS hostnames" and "DNS resolution" in VPC settings.' },
          { id: 'ins-vpc-p6', text: 'Click Create VPC and note your VPC ID ({{vpcId}}).' }
        ]
      }
    ]
  },
  'task-saa-vpc-configure-elastic-ips-and-test-eni-association-022': {
    goal: 'Goal: Allocate an Elastic IP address from AWS to be bound to your NAT Gateway in Phase 2.',
    createdResourceKeys: ['natEipAllocationId'],
    consoleSteps: [
      {
        id: 'step-eip-alloc-path',
        number: 1,
        title: 'Allocate Elastic IP for NAT Gateway',
        description: 'Allocate a static IPv4 Elastic IP address in EC2 Console.',
        instructions: [
          { id: 'ins-eip-p1', text: 'Open EC2 Console -> Network & Security -> Elastic IPs.' },
          { id: 'ins-eip-p2', text: 'Click Allocate Elastic IP address.' },
          { id: 'ins-eip-p3', text: 'Set Network border group to {{region}} and Tag Name = saa-eip-nat.' },
          { id: 'ins-eip-p4', text: 'Click Allocate and note your Allocation ID ({{natEipAllocationId}}).' }
        ]
      }
    ]
  },
  'task-saa-vpc-configure-route-tables-for-igw-and-nat-006': {
    title: 'Review and validate IGW and NAT route-table configuration',
    goal: 'Goal: Review and validate the public (IGW) and private (NAT GW) route table configurations and subnet associations created across Phase 1 and Phase 2.',
    consoleSteps: [
      {
        id: 'step-rtb-review-path',
        number: 1,
        title: 'Review Route Table Topology',
        description: 'Verify public route table (saa-rtb-public) and private route table (saa-rtb-private).',
        instructions: [
          { id: 'ins-rtr-p1', text: 'Open VPC Console -> Route Tables.' },
          { id: 'ins-rtr-p2', text: 'Select public route table ({{publicRouteTableId}}) and verify route 0.0.0.0/0 -> {{internetGatewayId}}.' },
          { id: 'ins-rtr-p3', text: 'Select private route table ({{privateRouteTableId}}) and verify route 0.0.0.0/0 -> {{natGatewayId}}.' },
          { id: 'ins-rtr-p4', text: 'Confirm public subnets are associated with public RTB and private subnets with private RTB.' }
        ]
      }
    ]
  }
};

// Helper to assemble full path task catalogue
function buildPathTasksCatalogue() {
  const tasks = [];

  VPC_LEARNING_PATH_PHASES.forEach(phase => {
    phase.taskIds.forEach(taskId => {
      const isOptional = OPTIONAL_BRANCH_TASK_IDS.has(taskId);
      const prerequisites = PATH_TASK_PREREQUISITES[taskId] || [];

      if (CANONICAL_TASK_MAP.has(taskId)) {
        const canonical = CANONICAL_TASK_MAP.get(taskId);
        const wrapper = CANONICAL_PATH_WRAPPERS[taskId] || {};

        tasks.push({
          ...canonical,
          ...wrapper,
          id: canonical.id, // Preserve exact canonical ID
          phaseId: phase.id,
          phaseNumber: phase.phaseNumber,
          isCanonical: true,
          prerequisites,
          isOptionalBranch: isOptional,
          envRequirement: canonical.envRequirement || (
            isOptional ? 'Optional Branch' : 'Single-account executable'
          )
        });
      } else {
        const pathTask = PATH_ONLY_TASKS.find(pt => pt.id === taskId);
        if (pathTask) {
          tasks.push({
            ...pathTask,
            phaseId: phase.id,
            phaseNumber: phase.phaseNumber,
            isCanonical: false,
            prerequisites,
            isOptionalBranch: isOptional
          });
        }
      }
    });
  });

  return tasks;
}

export const VPC_PATH_TASKS = buildPathTasksCatalogue();

/**
 * Audit function to verify task count, uniqueness, and DAG dependency integrity.
 */
export function auditPathCatalogueIntegrity() {
  const allIds = VPC_PATH_TASKS.map(t => t.id);
  const uniqueIds = new Set(allIds);

  const canonicalInPath = VPC_PATH_TASKS.filter(t => t.isCanonical).map(t => t.id);
  const pathOnlyInPath = VPC_PATH_TASKS.filter(t => !t.isCanonical).map(t => t.id);

  const missingCanonical = VPC_TASKS.filter(t => !uniqueIds.has(t.id)).map(t => t.id);

  // Check DAG dependency rules: no required task may depend on an optional task
  const optionalSet = new Set(VPC_PATH_TASKS.filter(t => t.isOptionalBranch).map(t => t.id));
  let requiredDependsOnOptionalCount = 0;
  const invalidDependencyPairs = [];

  VPC_PATH_TASKS.forEach(task => {
    if (!task.isOptionalBranch) {
      (task.prerequisites || []).forEach(prereqId => {
        if (optionalSet.has(prereqId)) {
          requiredDependsOnOptionalCount++;
          invalidDependencyPairs.push(`${task.id} depends on optional ${prereqId}`);
        }
      });
    }
  });

  // Check subnet and route-table duplication
  const subnetCreationTasks = VPC_PATH_TASKS.filter(t =>
    t.id === 'path-vpc-create-public-subnets' || t.id === 'path-vpc-create-private-subnets'
  );
  const routeTableCreationTasks = VPC_PATH_TASKS.filter(t =>
    t.id === 'path-vpc-configure-public-route-table' || t.id === 'path-vpc-configure-private-route-table'
  );

  return {
    totalTasks: VPC_PATH_TASKS.length,
    uniqueTaskCount: uniqueIds.size,
    canonicalCount: canonicalInPath.length,
    pathOnlyCount: pathOnlyInPath.length,
    missingCanonicalCount: missingCanonical.length,
    missingCanonicalIds: missingCanonical,
    requiredDependsOnOptionalCount,
    invalidDependencyPairs,
    subnetCreationDuplication: subnetCreationTasks.length > 2,
    routeTableCreationDuplication: routeTableCreationTasks.length > 2,
    isIntegral: allIds.length === uniqueIds.size &&
                missingCanonical.length === 0 &&
                canonicalInPath.length === 34 &&
                pathOnlyInPath.length === 11 &&
                requiredDependsOnOptionalCount === 0
  };
}
