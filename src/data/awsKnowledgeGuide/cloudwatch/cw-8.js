import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-8',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Standard AWS Metrics',
  status: 'ready',
  plainEnglish: 'Many AWS services publish operational metrics to CloudWatch automatically. These service-provided metrics use documented namespaces, names, dimensions, statistics, periods, and units—for example, EC2 metrics appear in AWS/EC2. They describe what AWS can observe around a managed resource. They are different from custom metrics that you or an agent publish, and they do not necessarily include data visible only inside an operating system, such as EC2 guest memory usage.',
  whyItMatters: 'Default service metrics give teams useful monitoring without instrumenting every resource. Architects can build a baseline dashboard and alarms quickly, then add custom or agent metrics only where the default telemetry cannot answer an operational question.',
  workplaceExample: 'A team uses an Application Load Balancer’s request and target response metrics plus EC2 CPU metrics immediately after deployment. When it also needs available-memory data from inside the EC2 guest, it installs the CloudWatch agent rather than expecting that value in the default EC2 metrics.',
  examFocus: 'SAA-C03 questions often contrast service-provided metrics with custom metrics or the CloudWatch agent. Choose default metrics for documented resource telemetry, the agent for guest OS metrics and log files, and custom application metrics for business values. Check each service’s documentation because metric availability and dimensions are service-specific.',
  keyPoints: [
    'Many AWS services publish metrics automatically into service-specific namespaces.',
    'The available metric names, dimensions, and reporting cadence differ by service.',
    'Service-provided EC2 metrics do not include every guest operating-system measurement.',
    'Default metrics can be graphed, queried, and used by CloudWatch alarms.',
    'Custom metrics complement rather than replace service-provided metrics.'
  ],
  commonMistake: 'Assuming every useful measurement is included by default leads to monitoring gaps. Consult the service metric reference, then use the CloudWatch agent or an application-published metric for data AWS cannot observe from outside the workload.',
  example: 'For an EC2 instance, AWS/EC2 CPUUtilization with the InstanceId dimension is service-provided. Memory used inside that instance is not a default EC2 metric; configure the CloudWatch agent to publish an appropriate guest metric and verify it under the agent’s configured namespace.',
  sources: [
    { title: 'AWS services that publish CloudWatch metrics', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html' },
    { title: 'Metrics collected by the CloudWatch agent', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/metrics-collected-by-CloudWatch-agent.html' }
  ]
});
