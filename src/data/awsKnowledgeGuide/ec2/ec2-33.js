import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-33',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Placement Groups - Cluster',
  status: 'ready',
  plainEnglish: 'A Cluster Placement Group packs EC2 instances close together inside a single Availability Zone on identical physical hardware racks. This grouping provides high-throughput, ultra-low-latency network performance (up to 100 Gbps or 200 Gbps with Enhanced Networking) between instances.',
  whyItMatters: 'High-Performance Computing (HPC), tightly coupled node-to-node scientific simulations, or high-frequency financial trading applications require extreme inter-instance network speeds and sub-millisecond latency that only a Cluster Placement Group can deliver.',
  workplaceExample: 'A weather forecasting company runs a distributed fluid dynamics model across 32 EC2 instances. Launching the instances in a Cluster Placement Group reduces inter-node MPI messaging latency to microsecond levels, cutting forecast simulation time in half.',
  examFocus: 'SAA-C03 Cluster Placement Group rules:\n- Single Availability Zone only (cannot span multiple AZs).\n- Provides lowest network latency and highest network throughput.\n- Risk: If the underlying physical rack or AZ fails, ALL instances in the cluster placement group fail together.\n- Recommendation: Use identical instance types and launch all instances at the same time.',
  keyPoints: [
    'Packs instances close together inside a single Availability Zone.',
    'Delivers ultra-low latency and maximum network throughput.',
    'Ideal for High-Performance Computing (HPC), big data, and tightly coupled workloads.',
    'Increases risk of correlated hardware failure (single point of failure).',
    'Cannot span multiple Availability Zones.'
  ],
  commonMistake: 'Attempting to create a Cluster Placement Group spanning multiple Availability Zones. Cluster placement groups are strictly restricted to 1 AZ.',
  example: 'Creating a Cluster Placement Group:\n`aws ec2 create-placement-group --group-name HPC-Cluster-Group --strategy cluster`',
  sources: [
    { title: 'Placement groups', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html' }
  ]
});
