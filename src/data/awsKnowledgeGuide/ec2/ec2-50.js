import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-50',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 High Availability across Availability Zones',
  status: 'ready',
  plainEnglish: 'EC2 High Availability across Availability Zones is an architectural pattern that distributes EC2 instances across multiple physically isolated Availability Zones (AZs) within an AWS Region. Paired with an Application Load Balancer (ALB) and an EC2 Auto Scaling group spanning at least two AZs, the architecture automatically routes traffic around a datacenter or AZ failure with zero user downtime.',
  whyItMatters: 'A single Availability Zone can experience localized power, network, or natural disaster disruptions. Deploying across multiple AZs guarantees high availability and fault tolerance for business-critical applications.',
  workplaceExample: 'A retail banking portal deploys an Auto Scaling group with a minimum of 4 EC2 instances distributed evenly across `us-east-1a` and `us-east-1b` behind an ALB. When `us-east-1a` suffers a datacenter power outage, the ALB routes all user traffic to `us-east-1b`, and Auto Scaling launches replacement instances in `us-east-1b`.',
  examFocus: 'SAA-C03 Core Reliability Principle:\n- ALWAYS design production workloads across AT LEAST TWO Availability Zones.\n- Application Load Balancers evaluate target health in each AZ automatically.\n- Auto Scaling groups maintain target capacity balanced across configured subnets in multiple AZs.\n- Use Multi-AZ RDS/Aurora for database high availability alongside multi-AZ EC2 web fleets.',
  keyPoints: [
    'Distributes EC2 instances across multiple physically isolated Availability Zones.',
    'Eliminates single points of failure at the datacenter level.',
    'Integrates with Application Load Balancers for automatic health-based traffic routing.',
    'EC2 Auto Scaling balances instance count across AZs automatically.',
    'Forms the foundation of AWS Well-Architected Reliability pillar.'
  ],
  commonMistake: 'Deploying all EC2 instances into a single subnet/AZ to save configuration effort. An outage in that single AZ will take down the entire application.',
  example: 'High Availability Multi-AZ Architecture:\nALB (us-east-1a, us-east-1b, us-east-1c) -> Auto Scaling Group (Subnet-AZ1, Subnet-AZ2) -> Multi-AZ RDS Database.',
  sources: [
    { title: 'Regions and Zones', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html' }
  ]
});
