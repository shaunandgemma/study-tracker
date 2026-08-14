import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-13',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'CloudWatch Dashboards',
  status: 'ready',
  plainEnglish: 'A CloudWatch dashboard is a customizable page of widgets that visualizes telemetry such as metrics, alarms, and logs. A graph widget controls the time range, statistic, period, and displayed series. A dashboard helps humans observe and investigate; it does not itself evaluate a condition or execute an action. That is the job of an alarm.',
  whyItMatters: 'Dashboards give engineers and stakeholders a shared health view during normal operation and incidents. They can combine customer symptoms, dependency signals, and capacity metrics into an operational playbook instead of requiring responders to search through separate consoles.',
  workplaceExample: 'An incident dashboard places API request rate, error percentage, latency, database connections, queue depth, deployment notes, and alarm states on one page. The on-call engineer can quickly see whether a traffic spike, dependency, or recent change aligns with the incident.',
  examFocus: 'Choose dashboards for visualization and shared operational visibility; choose alarms for continuous evaluation and actions. Custom dashboards can show metrics from multiple Regions. For multiple accounts, CloudWatch cross-account observability provides rich metrics, logs, and traces visibility within a Region, while cross-account cross-Region console/dashboard capabilities can display metrics across Regions. These features require the appropriate sharing and monitoring-account setup.',
  keyPoints: [
    'Dashboards organize telemetry into human-readable widgets.',
    'Widget statistic and period determine how metric data is displayed.',
    'Dashboards visualize state; alarms evaluate conditions and take actions.',
    'Custom dashboards can present metrics from multiple AWS Regions.',
    'Cross-account views require an explicitly configured monitoring relationship.'
  ],
  commonMistake: 'A dashboard that shows a red line is not a notification system. Create and test alarms for conditions that require response, and use the dashboard to supply context around those alarms.',
  example: 'A useful service dashboard can show RequestCount as Sum, TargetResponseTime as Average, and 5XX errors as Sum using the same time range. Verify each widget’s namespace and dimensions so similarly named metrics do not show data for the wrong load balancer or target group.',
  sources: [
    { title: 'Using Amazon CloudWatch dashboards', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Dashboards.html' },
    { title: 'Monitor across accounts and Regions', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Cross-Account-Methods.html' }
  ]
});
