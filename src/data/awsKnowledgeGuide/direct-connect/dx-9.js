import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-9',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Private Virtual Interfaces - Private VIF',
  status: 'ready',
  plainEnglish: 'A Private Virtual Interface (Private VIF) is a network configuration created over an AWS Direct Connect link to connect an on-premises network directly to private IP addresses inside an AWS Virtual Private Cloud (VPC). Using a Private VIF, on-premises servers communicate with EC2 instances, RDS databases, or internal load balancers using private IPv4/IPv6 addresses without going over the public internet or using public IP addresses.',
  whyItMatters: 'Private VIFs keep internal network traffic completely isolated from the internet. Enterprise workloads can exchange sensitive data between corporate data centers and private VPC subnets with predictable performance and low latency.',
  workplaceExample: 'A healthcare company connects its on-premises electronic health record (EHR) database to an internal API running on private EC2 instances in a VPC. By configuring a Private VIF on their Direct Connect link, data flows exclusively over private IP ranges (e.g. 10.0.0.0/8 to 172.16.0.0/12) without exposing any public endpoints.',
  examFocus: 'For SAA-C03, remember:\n- Private VIF connects on-premises to PRIVATE resources inside VPCs (via Virtual Private Gateway or Direct Connect Gateway).\n- Uses 802.1Q VLAN tagging and BGP peering to advertise on-premises routes and receive VPC CIDR routes.\n- Does NOT grant access to public AWS services like S3 or DynamoDB (use Public VIF or VPC Endpoints for that).',
  keyPoints: [
    'Connects on-premises networks to private resources in a VPC (private IP addresses).',
    'Associates with a Virtual Private Gateway (VGW) or Direct Connect Gateway (DXGW).',
    'Uses BGP (Border Gateway Protocol) to exchange private routes.',
    'Requires a VLAN ID (802.1Q tag) for traffic segregation.',
    'Does not provide access to public AWS service endpoints.'
  ],
  commonMistake: 'Trying to use a Private VIF to access public S3 bucket endpoints directly. Private VIFs only route traffic to private VPC CIDRs. To access S3 without public VIFs, use S3 Gateway VPC Endpoints inside the VPC or use a Public VIF.',
  example: 'Private VIF BGP Parameters:\nVLAN Tag: 100\nOn-Premises BGP ASN: 65000\nAWS BGP ASN: 64512\nCustomer Router IP: 192.168.1.1/30\nAWS Router IP: 192.168.1.2/30\nAdvertised Route: On-Premises CIDR 10.10.0.0/16.',
  sources: [
    { title: 'AWS Direct Connect Virtual Interfaces', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html' }
  ]
});
