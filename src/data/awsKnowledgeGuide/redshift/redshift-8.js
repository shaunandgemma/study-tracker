import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-8',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Provisioned Clusters',
  status: 'ready',
  plainEnglish: 'A Redshift Provisioned Cluster is a traditional customer-sized database deployment where you explicitly select the instance type (e.g. `ra3.xlplus`, `ra3.4xlarge`) and the fixed number of compute nodes in the cluster. AWS manages node provisioning, storage replication, automated snapshots, and software patching, while giving you control over cluster parameter groups and maintenance windows.',
  whyItMatters: 'Provisioned clusters are ideal for predictable, steady-state analytical workloads with steady daily query traffic. Choosing provisioned nodes allows leveraging Reserved Instances for up to 75% cost savings compared to on-demand pricing.',
  workplaceExample: 'A enterprise analytics team provisions a 4-node `ra3.4xlarge` Redshift cluster that runs 24/7. They purchase 3-year Reserved Instances to minimize hourly compute costs while supporting continuous BI dashboard workloads.',
  examFocus: 'SAA-C03 Provisioned Cluster Management:\n- Instance Families: Modern RA3 instances (managed storage), legacy Dense Compute (DC2) instances.\n- Scaling Mechanics: Elastic Resize (adds/removes nodes in minutes) vs Classic Resize (creates new cluster, takes hours).\n- Pause & Resume: Pause provisioned clusters during weekends/off-hours to stop compute billing while retaining storage.',
  keyPoints: [
    'Provisioned deployment model with customer-selected node types and node counts.',
    'Ideal for steady-state 24/7 analytical workloads with predictable query patterns.',
    'Supports RA3 instance families with Managed Storage detached from compute.',
    'Allows Pause and Resume to stop compute charges when clusters are idle.',
    'Eligible for 1-year or 3-year Reserved Instance pricing discounts.'
  ],
  commonMistake: 'Leaving a 24/7 provisioned development cluster running on-demand over weekends without leveraging Pause and Resume or Redshift Serverless.',
  example: 'Pausing a Provisioned Redshift Cluster via AWS CLI:\naws redshift pause-cluster --cluster-identifier dev-analytics-cluster',
  sources: [
    { title: 'Managing Amazon Redshift provisioned clusters', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-clusters.html' }
  ]
});
