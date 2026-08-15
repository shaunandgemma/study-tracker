import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-26',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Elastic Resize and Classic Resize',
  status: 'ready',
  plainEnglish: 'Amazon Redshift provides two methods for resizing provisioned database clusters:\n- Elastic Resize: Scales compute node count or node type up or down in minutes (typically 1 to 5 minutes), briefly pausing queries while preserving existing cluster endpoints.\n- Classic Resize: Creates a new target cluster, copies all data from the source cluster, and switches DNS. Takes hours to days for multi-terabyte datasets.',
  whyItMatters: 'Using Elastic Resize allows scheduled cluster expansion before high-traffic business hours and downsizing afterwards, saving thousands of dollars without long cluster downtime.',
  workplaceExample: 'An e-commerce firm schedules an Elastic Resize to expand their Redshift cluster from 4 to 8 `ra3.4xlarge` nodes every Monday morning for heavy reporting. On Monday evening, they scale back down to 4 nodes in under 5 minutes.',
  examFocus: 'SAA-C03 Resize Comparison & Use Cases:\n- Elastic Resize (Preferred): Completes in minutes; brief read/write pause; maintains cluster endpoint; changes node count or node type (within limits).\n- Classic Resize: Use when changing node types beyond Elastic Resize supported ratios; creates a duplicate cluster and copies data; takes hours.\n- Scheduled Resizing: Elastic Resize can be scheduled automatically via Redshift Scheduler API.',
  keyPoints: [
    'Elastic Resize scales cluster node count or instance types in minutes.',
    'Classic Resize creates a new target cluster and copies data (takes hours/days).',
    'Elastic Resize preserves existing cluster endpoints during brief query pauses.',
    'Elastic Resize can be automated on a schedule for periodic query traffic surges.',
    'Classic Resize is required when transitioning between incompatible node configurations.'
  ],
  commonMistake: 'Selecting Classic Resize for routine daily cluster scaling, causing hours of database migration lock-outs instead of using 5-minute Elastic Resize.',
  example: 'Executing an Elastic Resize via AWS CLI:\naws redshift resize-cluster --cluster-identifier prod-cluster --node-type ra3.4xlarge --number-of-nodes 8 --no-classic',
  sources: [
    { title: 'Resizing clusters in Amazon Redshift', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/rs-resize-tutorial.html' }
  ]
});
