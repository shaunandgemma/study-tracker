import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-15",
  "title": "Fargate Logging and Monitoring with CloudWatch",
  "plainEnglish": "Amazon ECS on AWS Fargate integrates natively with Amazon CloudWatch for both operational metrics and centralized application logging. By configuring the 'awslogs' log driver in task definitions, container standard output (stdout) and error (stderr) streams are automatically routed to CloudWatch Logs. Furthermore, Amazon ECS Container Insights captures detailed diagnostic metrics (CPU, memory, network, and storage utilization) across all Fargate tasks.",
  "whyItMatters": "Because Fargate tasks are ephemeral and run without host server access (no SSH to inspect /var/log), having a centralized, automated log streaming and metric collection pipeline is essential for debugging runtime application errors, monitoring health, and alerting on anomalies.",
  "workplaceExample": "A financial SaaS company enables the awslogs log driver with auto-configured log group creation for all Fargate microservices. They activate ECS Container Insights on their production cluster and configure CloudWatch Alarms to notify the on-call engineering team via Amazon SNS if average task memory exceeds 85% for more than 3 minutes.",
  "examFocus": "Know that to stream logs to CloudWatch Logs: (1) configure the 'awslogs' logDriver in the task definition 'logConfiguration', and (2) the Task Execution Role (`executionRoleArn`) must have permissions for 'logs:CreateLogStream' and 'logs:PutLogEvents'. Enable CloudWatch Container Insights at the cluster level for deep performance telemetry.",
  "keyPoints": [
    "Uses the 'awslogs' log driver in container definitions to stream container stdout and stderr to CloudWatch Logs.",
    "The Task Execution Role must contain permissions to create log streams and put log events into the designated log group.",
    "Supports 'awslogs-create-group: true' to automatically create CloudWatch log groups if they do not already exist.",
    "Amazon ECS Container Insights collects, aggregates, and visualizes CPU, memory, disk, and network metrics at the cluster, service, and task levels.",
    "CloudWatch Metric Filters can extract structured error counts from application log streams to trigger automated alarms.",
    "Supports AWS FireLens (Fluent Bit / Fluentd) as a sidecar for routing logs to third-party destinations like Datadog, Splunk, or Amazon OpenSearch."
  ],
  "commonMistake": "Configuring the awslogs driver in the task definition but forgetting to attach CloudWatch logging permissions (logs:CreateLogStream, logs:PutLogEvents) to the Task Execution Role, causing task launch failures with a 'CannotStartContainerError'.",
  "example": "Configure logConfiguration in a container definition JSON: {\"logConfiguration\": {\"logDriver\": \"awslogs\", \"options\": {\"awslogs-group\": \"/ecs/fargate-app\", \"awslogs-region\": \"us-east-1\", \"awslogs-stream-prefix\": \"web\", \"awslogs-create-group\": \"true\"}}}.",
  "sources": [
    {
      "title": "Using the awslogs Log Driver with Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html"
    },
    {
      "title": "Amazon CloudWatch Container Insights for Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-container-insights.html"
    }
  ]
});
