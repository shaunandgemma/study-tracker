import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-19',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'EC2 Detailed Monitoring',
  status: 'ready',
  plainEnglish: 'EC2 sends selected instance metrics to CloudWatch. Basic monitoring provides those metrics in five-minute periods at no additional charge, while detailed monitoring provides them in one-minute periods for an additional charge. Detailed monitoring improves the time granularity of EC2 service-provided metrics; it does not install software inside the instance or add guest metrics such as memory usage.',
  whyItMatters: 'One-minute data can let engineers detect and respond to load changes sooner, create one-minute alarms, and support faster scaling decisions. Five-minute basic monitoring can be sufficient for stable workloads where slower detection is acceptable.',
  workplaceExample: 'A production Auto Scaling web tier must react quickly to CPU demand, so the team enables detailed monitoring in its launch configuration or template and uses one-minute alarm periods. A low-priority batch instance stays on basic monitoring.',
  examFocus: 'Look for the explicit tradeoff: basic monitoring is five-minute, detailed monitoring is one-minute and chargeable. If the requirement is EC2 memory, disk-space, application logs, or other in-guest telemetry, choose the CloudWatch agent instead. When changing monitoring mode, align alarm periods with the available data cadence to avoid missing periods.',
  keyPoints: [
    'EC2 basic monitoring supplies selected metrics in five-minute periods.',
    'EC2 detailed monitoring supplies selected metrics in one-minute periods.',
    'Detailed monitoring has an additional charge.',
    'Detailed monitoring changes cadence, not the set of guest operating-system metrics.',
    'The CloudWatch agent is required for metrics such as guest memory usage.'
  ],
  commonMistake: 'Enabling detailed monitoring and expecting a MemoryUtilization metric confuses reporting frequency with telemetry source. Use detailed monitoring for one-minute EC2 metrics and configure the CloudWatch agent separately for memory, disk-space, and logs.',
  example: 'For a detailed-monitored instance, use a 60-second period for a CPUUtilization alarm; for basic monitoring, use a 300-second period. Replace the instance dimension with the real instance ID and verify the graph receives data at the expected cadence before relying on the alarm.',
  sources: [
    { title: 'Manage detailed monitoring for your EC2 instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch-new.html' },
    { title: 'Configure monitoring for Auto Scaling instances', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/enable-as-instance-metrics.html' },
    { title: 'Metrics collected by the CloudWatch agent', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/metrics-collected-by-CloudWatch-agent.html' }
  ]
});
