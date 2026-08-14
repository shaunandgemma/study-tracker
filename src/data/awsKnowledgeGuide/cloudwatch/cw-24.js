import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cw-24',
  topicId: 'topic-cloudwatch',
  topicTitle: 'Amazon CloudWatch',
  objectiveCode: 'Management',
  title: 'Container Insights',
  status: 'ready',
  plainEnglish: 'CloudWatch Container Insights collects, aggregates, and summarizes metrics and logs from container platforms including Amazon ECS, Amazon EKS, supported Kubernetes environments, and supported Fargate deployments. It provides views at container-related levels such as cluster, node, pod, task, and service where supported. Performance data is collected as structured log events, and CloudWatch creates selected metrics and dashboards from that data.',
  whyItMatters: 'Containers are short-lived and spread across layers, so host-only monitoring is not enough. Container Insights helps engineers identify CPU or memory pressure, restart failures, and which pod, task, node, or service contributes to a problem.',
  workplaceExample: 'An EKS service becomes slow after a deployment. The team uses Container Insights to find a pod with repeated restarts and high memory use, then queries its performance logs for deeper detail and rolls back the faulty release.',
  examFocus: 'Choose Container Insights for ECS, EKS, and Kubernetes container observability, not Lambda-specific runtime diagnosis. Lambda Insights uses a Lambda extension and performance log events to expose CPU time, memory, disk, network, cold starts, and shutdown diagnostics for Lambda. On EKS and Kubernetes, Container Insights requires collection setup; AWS does not infer every in-container signal merely because the cluster exists.',
  keyPoints: [
    'Container Insights provides container-aware metrics, logs, and curated views.',
    'It supports Amazon ECS, Amazon EKS, and documented Kubernetes environments.',
    'Structured performance log events are used to create selected CloudWatch metrics.',
    'Logs Insights can query performance events for deeper granularity.',
    'CloudWatch alarms can monitor metrics produced by Container Insights.',
    'Lambda Insights is the corresponding specialized solution for AWS Lambda.'
  ],
  commonMistake: 'Enabling a cluster and assuming Container Insights is automatically collecting every desired layer can leave gaps. Complete the platform-specific setup, grant the collector only required permissions, and verify both the performance log group and expected metrics before creating alarms.',
  example: `A Logs Insights query for Container Insights performance data can summarize restarts:\n\nstats avg(number_of_container_restarts) as averageRestarts by PodName\n| sort averageRestarts desc\n\nSelect the cluster’s performance log group and incident time range. Replace PodName only if your schema uses a different documented field. Expect pods ranked by average restarts; verify a top result against the Container Insights resource view.`,
  sources: [
    { title: 'CloudWatch Container Insights', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html' },
    { title: 'Viewing Container Insights metrics', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights-view-metrics.html' },
    { title: 'CloudWatch Lambda Insights', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html' }
  ]
});
