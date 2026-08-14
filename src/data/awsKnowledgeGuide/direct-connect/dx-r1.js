import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-r1',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect Virtual Interface Types - Private VIF vs Public VIF vs Transit VIF',
  status: 'ready',
  plainEnglish: 'Virtual Interfaces (VIFs) are the logical network configurations created on a physical AWS Direct Connect link to route traffic to specific AWS services. There are three types of Virtual Interfaces:\n1. Private VIF: Connects to private IP addresses inside a single VPC (via Virtual Private Gateway) or multiple VPCs (via Direct Connect Gateway).\n2. Public VIF: Connects to public AWS service endpoints globally (Amazon S3, DynamoDB, CloudFront) over private fiber.\n3. Transit VIF: Connects to an AWS Transit Gateway via Direct Connect Gateway, enabling hub-and-spoke connectivity to thousands of VPCs.',
  whyItMatters: 'Understanding VIF types is essential for constructing correct network topologies. Selecting the wrong VIF type prevents on-premises routers from reaching target AWS services.',
  workplaceExample: 'A enterprise network team configures three VIFs on their 10 Gbps Direct Connect link:\n- Private VIF: Connects to their legacy HR VPC.\n- Transit VIF: Connects to Transit Gateway for 100+ new microservice VPCs.\n- Public VIF: Connects directly to Amazon S3 for daily data backups.',
  examFocus: 'SAA-C03 core summary:\n- Private VIF -> VPC (private IP addresses, EC2, RDS).\n- Public VIF -> Public AWS services (S3, DynamoDB, public APIs).\n- Transit VIF -> AWS Transit Gateway (hundreds of VPCs, transitive routing).\n- Dedicated connections support up to 50 VIFs; Hosted connections support exactly 1 VIF.',
  keyPoints: [
    'Private VIF: Reaches private VPC resources (EC2, RDS, internal load balancers).',
    'Public VIF: Reaches public AWS services globally (S3, DynamoDB, SQS) bypassing internet.',
    'Transit VIF: Reaches AWS Transit Gateway for multi-VPC hub-and-spoke architectures.',
    'Each VIF uses a unique 802.1Q VLAN tag and BGP session.',
    'Hosted connections support only 1 VIF; Dedicated connections support up to 50 VIFs.'
  ],
  commonMistake: 'Attempting to create a Transit VIF on a Hosted Connection with less than 1 Gbps bandwidth. Transit VIFs require 1 Gbps or higher capacity.',
  example: 'VIF Selection Guide:\nRequirement A: Access S3 buckets privately -> Public VIF (or Private VIF + S3 Gateway Endpoint).\nRequirement B: Access EC2 in 1 VPC -> Private VIF + VGW.\nRequirement C: Access 200 VPCs + VPC-to-VPC routing -> Transit VIF + DXGW + Transit Gateway.',
  sources: [
    { title: 'AWS Direct Connect Virtual Interfaces', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html' }
  ]
});
