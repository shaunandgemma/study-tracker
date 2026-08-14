import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-35',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Placement Groups - Partition',
  status: 'ready',
  plainEnglish: 'A Partition Placement Group divides an Availability Zone into logical segments called partitions, where each partition has its own set of physical server racks. EC2 instances placed into different partitions do not share hardware racks, power supplies, or network switches with instances in other partitions. This isolates hardware failures to a single partition while allowing large clusters of instances to run in the same AZ.',
  whyItMatters: 'Large distributed data applications (like Hadoop, Apache Kafka, Cassandra, or HDFS) need to scale to hundreds of EC2 instances per cluster. Partition Placement Groups make the application topology aware of underlying hardware racks, ensuring replica nodes reside in separate partitions.',
  workplaceExample: 'An enterprise deploys a 60-node Apache Kafka cluster. They launch the brokers across 7 partitions in a Partition Placement Group. Kafka topic replicas are assigned to different partitions so that a rack failure in Partition 1 never causes data loss across topic replicas.',
  examFocus: 'SAA-C03 Partition Placement Group rules:\n- Scales to hundreds of instances per group (unlike Spread\'s 7 per AZ limit).\n- Supports up to 7 partitions per Availability Zone.\n- Can span multiple Availability Zones in a region.\n- Essential for partition-aware distributed workloads (Hadoop, Kafka, Cassandra).',
  keyPoints: [
    'Divides instances into distinct logical partitions backed by separate hardware racks.',
    'Isolates hardware failures to a single partition.',
    'Scales to hundreds of instances per placement group (up to 7 partitions per AZ).',
    'Can span multiple Availability Zones within a region.',
    'Ideal for distributed, partition-aware big data clusters (Hadoop, Kafka, HDFS).'
  ],
  commonMistake: 'Confusing Partition Placement Groups with Spread Placement Groups. Spread limits to 7 total instances per AZ (1 per rack), whereas Partition supports hundreds of instances grouped into 7 partitions per AZ.',
  example: 'Creating a Partition Placement Group:\n`aws ec2 create-placement-group --group-name BigData-Kafka-Group --strategy partition --partition-count 7`',
  sources: [
    { title: 'Placement groups', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html' }
  ]
});
