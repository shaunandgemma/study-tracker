import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-34',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Placement Groups - Spread',
  status: 'ready',
  plainEnglish: 'A Spread Placement Group places each EC2 instance on distinct physical hardware racks—meaning each instance has its own separate physical server, network switches, and power source. This strategy minimizes the risk of simultaneous instance failures caused by hardware or rack-level outages.',
  whyItMatters: 'For critical applications running a small number of key instances (such as database primary/standby pairs or domain controllers), a single rack hardware failure should never take down multiple nodes at once.',
  workplaceExample: 'A bank runs a 3-node HA Kubernetes control plane. They launch the 3 control plane instances in a Spread Placement Group across Availability Zones. Each node runs on a physically independent server rack, guaranteeing that a hardware failure on one rack will never affect the other control plane nodes.',
  examFocus: 'SAA-C03 Spread Placement Group rules:\n- Maximum 7 instances per Availability Zone per placement group.\n- CAN span multiple Availability Zones within the same region.\n- Use for small numbers of critical instances that must be isolated from each other physically.\n- Opposite of Cluster Placement Group (maximizes isolation, not network density).',
  keyPoints: [
    'Places each instance on distinct physical hardware racks with separate power and network.',
    'Minimizes simultaneous hardware failure risks.',
    'Strict limit of 7 instances per Availability Zone.',
    'Can span multiple Availability Zones within a region.',
    'Recommended for critical redundant instances (DB master/standby, quorum nodes).'
  ],
  commonMistake: 'Trying to launch 20 instances in a single AZ using a Spread Placement Group. AWS limits Spread Placement Groups to 7 instances per AZ.',
  example: 'Creating a Spread Placement Group:\n`aws ec2 create-placement-group --group-name HA-Database-Spread --strategy spread`',
  sources: [
    { title: 'Placement groups', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html' }
  ]
});
