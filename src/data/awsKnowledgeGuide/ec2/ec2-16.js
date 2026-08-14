import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-16',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Spot Instances',
  status: 'ready',
  plainEnglish: 'EC2 Spot Instances allow you to request unused EC2 compute capacity in the AWS cloud at massive discounts—up to 90% off On-Demand prices. However, because Spot instances run on spare capacity, AWS can reclaim (interrupt) a Spot instance with a 2-minute warning whenever AWS needs the capacity back for On-Demand or Reserved users.',
  whyItMatters: 'Spot Instances enable massive cost savings for stateless, fault-tolerant, or flexible workloads (such as big data processing, batch jobs, CI/CD pipelines, containerized microservices, or AI training) that can handle sudden server terminations without losing progress.',
  workplaceExample: 'A bioinformatics research group runs massive genomic sequence analysis on a cluster of 100 Spot Instances. They use AWS Batch and checkpoint progress to S3. If AWS reclaims 10 instances, the batch framework reschedules the work on remaining nodes, cutting analysis costs by 85%.',
  examFocus: 'SAA-C03 Spot Instance rule:\n- Deepest discount (up to 90% off).\n- CAN be interrupted by AWS with a 2-minute notification (via EventBridge / Instance Metadata).\n- NEVER use Spot for critical stateful applications, single-instance databases, or non-fault-tolerant workloads.\n- BEST for stateless web apps, batch processing, containerized workers, and fault-tolerant workloads.',
  keyPoints: [
    'Deepest discount option in EC2 (up to 90% off On-Demand rates).',
    'Subject to 2-minute interruption notice when AWS requires capacity.',
    'Interruption behavior options: Terminate, Stop, or Hibernate.',
    'Ideal for stateless, fault-tolerant, batch, or containerized workloads.',
    'Spot price adjusts dynamically based on supply and demand per AZ.'
  ],
  commonMistake: 'Running an un-replicated production database or single-node web application on Spot Instances. When capacity is reclaimed, the instance terminates and the service goes down.',
  example: 'Spot Instance Request:\n`aws ec2 run-instances --image-id ami-0123456789abcdef0 --instance-type c6g.large --instance-market-options MarketType=spot`',
  sources: [
    { title: 'Spot Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html' }
  ]
});
