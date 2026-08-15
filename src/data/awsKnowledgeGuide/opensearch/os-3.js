import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'os-3',
  topicId: 'topic-opensearch',
  topicTitle: 'Amazon OpenSearch Service',
  objectiveCode: 'Analytics',
  title: 'OpenSearch Managed Search and Analytics',
  status: 'ready',
  plainEnglish: 'Amazon OpenSearch Service abstracts the heavy lifting of running open-source OpenSearch clusters in production. AWS handles hardware provisioning, node replacement, operating system and engine software updates, storage volume scaling, automated snapshot backups, and cluster state monitoring.',
  whyItMatters: 'Self-hosting Elasticsearch or OpenSearch clusters requires managing cluster-manager (master) quorum elections, JVM garbage collection tuning, disk space alerts, and manual node patching. Amazon OpenSearch Service automates these complex operational tasks.',
  workplaceExample: 'A media streaming company runs a 12-node OpenSearch domain. AWS automatically replaces a failing data node EC2 instance, rebalances primary and replica shards, and performs seamless minor engine software upgrades during maintenance windows.',
  examFocus: 'SAA-C03 Managed Cluster Operations:\n- Managed Deployment: AWS provisions EC2 instances, storage volumes, and network interfaces for the domain.\n- Auto-Tuning: OpenSearch Service continuously monitors memory and performance, recommending instance size and JVM heap adjustments.\n- Storage Options: EBS volumes, UltraWarm (S3-backed), and Cold Storage.\n- Engine Upgrades: Automated blue/green deployments for seamless OpenSearch engine version upgrades.',
  keyPoints: [
    'Automates cluster deployment, node replacement, OS/engine patching, and storage scaling.',
    'Provides Auto-Tuning to optimize JVM memory heap and cluster hardware configurations.',
    'Offers multi-tiered storage: Hot (EBS), UltraWarm (S3), and Cold Storage.',
    'Supports seamless blue/green cluster upgrades with zero query downtime.',
    'Integrates natively with CloudWatch, CloudTrail, AWS KMS, and Amazon VPC.'
  ],
  commonMistake: 'Assuming OpenSearch Service automatically resizes node EC2 instance types without cluster reconfiguration. You must configure auto-scaling or update domain settings for instance class changes.',
  example: 'Updating an OpenSearch Domain Instance Type via AWS CLI:\naws opensearch update-domain-config --domain-name prod-logs-domain --cluster-config InstanceType=r6g.xlarge.search,InstanceCount=4',
  sources: [
    { title: 'Creating and managing Amazon OpenSearch Service domains', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html' }
  ]
});
