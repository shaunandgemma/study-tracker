import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-9',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Serverless',
  status: 'ready',
  plainEnglish: 'Redshift Serverless is an on-demand, auto-scaling deployment model for Amazon Redshift that automatically provisions and scales data warehouse capacity without requiring you to choose node types or node counts. Compute capacity is measured in Redshift Processing Units (RPUs), scaling up during query bursts and scaling down to zero when idle.',
  whyItMatters: 'Intermittent or variable analytics workloads (like ad-hoc reporting or periodic batch ETL) waste money running provisioned 24/7 clusters. Redshift Serverless automatically shuts down compute capacity when no queries are active, charging strictly per second of RPU compute used.',
  workplaceExample: 'A marketing team runs ad-hoc SQL queries 2 hours per day. Rather than managing a provisioned cluster, they use Redshift Serverless. Compute RPUs scale automatically when queries run and shut down to zero compute cost for the remaining 22 hours.',
  examFocus: 'SAA-C03 Redshift Serverless Architecture:\n- Architecture Components: Namespaces (database objects, schemas, security) and Workgroups (compute RPUs, VPC subnets, security groups).\n- RPU Billing: Billed per RPU-hour in 1-second increments (base capacity configurable from 8 to 512 RPUs).\n- Usage Limits: Set RPU usage caps to control max daily or monthly spend.\n- Automatic Scaling: Automatically handles concurrency scaling and cluster capacity adjustments.',
  keyPoints: [
    'Auto-scaling serverless data warehouse option with zero cluster provisioning.',
    'Decouples Namespaces (data/database objects) from Workgroups (compute/RPUs).',
    'Capacity measured in Redshift Processing Units (RPUs), scaling down to zero when idle.',
    'Ideal for ad-hoc queries, variable workloads, and periodic batch ingestion pipelines.',
    'Provides usage limits and max RPU caps to enforce strict cost governance.'
  ],
  commonMistake: 'Confusing Redshift Serverless Workgroups (compute/network settings) with Namespaces (database tables/security settings).',
  example: 'Creating a Redshift Serverless Workgroup via AWS CLI:\naws redshift-serverless create-workgroup --workgroup-name analytics-wg --namespace-name analytics-ns --base-capacity 32 --subnet-ids subnet-11111111 subnet-22222222',
  sources: [
    { title: 'Amazon Redshift Serverless management', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/serverless-workgroups-namespaces.html' }
  ]
});
