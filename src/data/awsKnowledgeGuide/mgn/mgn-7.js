import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-7',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'MGN Staging Area Subnet',
  status: 'ready',
  plainEnglish: 'The MGN Staging Area Subnet is a dedicated subnet inside an AWS VPC where lightweight AWS MGN Replication Servers and staging Amazon EBS volumes reside. The staging area receives continuous block data from on-premises source servers, storing replicated disk images until you launch test or production cutover instances in your target production subnets.',
  whyItMatters: 'Separating the staging area from your target production environment ensures that replication infrastructure operates economically on low-cost EC2 instances (`t3.small` / `t3.medium`) without polluting production VPC subnets.',
  workplaceExample: 'A cloud team sets up a VPC with a private `StagingSubnet` (`10.0.100.0/24`) for MGN replication. On-premises source servers stream replication data over AWS Direct Connect into `StagingSubnet`. When cutover is triggered, MGN launches full-sized production EC2 instances into `ProdSubnet` (`10.0.1.0/24`).',
  examFocus: 'SAA-C03 Staging Subnet Rules:\n- Cost Efficiency: Low-cost staging EC2 instances manage low-cost staging EBS volumes (e.g. `gp2`/`gp3` or `sc1` st1 volumes).\n- Routing Options: Can use Public Internet (via Elastic IP / Internet Gateway) OR Private Network (AWS Direct Connect / VPN / VPC Endpoints).\n- Security Groups: Requires inbound TCP 1500 allowed from source server IPs.\n- Target Isolation: Final test/cutover instances launch into target production subnets, NOT the staging subnet.',
  keyPoints: [
    'Dedicated VPC subnet hosting temporary Replication Servers and staging EBS volumes.',
    'Isolates replication traffic from target production VPC environments.',
    'Uses low-cost EC2 instance types (`t3.small`/`t3.medium`) to minimize replication overhead.',
    'Supports public internet routing or private connectivity (VPN, Direct Connect, PrivateLink).',
    'Staging EBS volumes are attached to Replication Servers until cutover conversion.'
  ],
  commonMistake: 'Confusing the Staging Subnet with the Target Production Subnet. Final cutover instances should launch into target production subnets.',
  example: 'Configuring Staging Area Settings via AWS CLI:\naws mgn update-replication-configuration-template --replication-configuration-template-id <TEMPLATE_ID> --staging-area-subnet-id subnet-0123456789abcdef0 --staging-area-tags Key=Environment,Value=Staging',
  sources: [
    { title: 'Staging area settings', url: 'https://docs.aws.amazon.com/mgn/latest/ug/staging-area.html' }
  ]
});
