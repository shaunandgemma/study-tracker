import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-18',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch Agent',
  status: 'ready',
  plainEnglish: 'The CloudWatch agent is software installed on EC2 instances, on-premises servers, and supported container environments to collect telemetry from inside the workload. It can collect guest operating-system metrics such as memory and disk measurements, application or system log files, and supported traces. These complement service-provided metrics, which are collected by AWS from outside or around the resource and cannot expose every in-guest value.',
  whyItMatters: 'The agent closes important visibility gaps in servers and hybrid environments. Engineers can standardize collection, send selected telemetry to CloudWatch, and troubleshoot resource and application behavior that default infrastructure metrics cannot explain.',
  workplaceExample: 'An EC2 web server has low CPU but repeatedly runs out of memory. The team installs and configures the agent to publish memory metrics and the application log, grants its instance role only the required publishing permissions, and creates an alarm on the new memory signal.',
  examFocus: 'Choose the CloudWatch agent for EC2 guest OS metrics, log files, on-premises telemetry, and supported trace collection. Enabling EC2 detailed monitoring only changes the frequency of documented EC2 service metrics; it does not add memory or arbitrary log files. The agent needs an appropriate IAM role or credentials and a configuration that names what to collect.',
  keyPoints: [
    'The agent collects telemetry from inside EC2, on-premises servers, and supported containers.',
    'Agent metrics are additional to service-provided EC2 metrics.',
    'The configuration controls selected metrics, logs, traces, destinations, and dimensions.',
    'The workload needs permission to publish the configured telemetry.',
    'Systems Manager can help distribute configuration and manage the agent.'
  ],
  commonMistake: 'Installing the agent without a valid configuration or IAM publishing permissions does not create useful telemetry. Define the required signals, use a least-privilege instance role or on-premises credential arrangement, start the agent, and inspect its status and destination data.',
  example: 'Configure the agent to collect a memory-used percentage and an application log from a non-sensitive path. Replace the log path, log-group name, and Region with your environment. Expect a new agent metric and log stream; verify both in CloudWatch and check the local agent status if either is absent.',
  sources: [
    { title: 'Collect metrics, logs, and traces using the CloudWatch agent', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html' },
    { title: 'Metrics collected by the CloudWatch agent', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/metrics-collected-by-CloudWatch-agent.html' },
    { title: 'Create the CloudWatch agent configuration file', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-cloudwatch-agent-configuration-file.html' }
  ]
});
