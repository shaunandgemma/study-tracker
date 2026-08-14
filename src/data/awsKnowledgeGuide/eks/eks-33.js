import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eks-33",
  "topicId": "topic-eks",
  "topicTitle": "EKS (Elastic Kubernetes Service)",
  "objectiveCode": "Containers",
  "title": "EKS CloudWatch Container Insights",
  "status": "ready",
  "plainEnglish": "Amazon CloudWatch Container Insights is a fully managed observability and monitoring solution that automatically collects, aggregates, and visualizes container-level metrics and structured performance logs from Amazon EKS clusters. Container Insights collects CPU, memory, disk, and network metrics across all cluster hierarchy layers: the overall Cluster, individual Nodes, Kubernetes Namespaces, Services, and individual Pods and Containers.",
  "whyItMatters": "Debugging performance degradation in microservice architectures with hundreds of pods requires granular visibility into container resource consumption. Container Insights provides pre-built CloudWatch dashboards, diagnostic maps, and automated metric alarms with zero custom Prometheus or Grafana infrastructure to maintain.",
  "workplaceExample": "A Kubernetes cluster hosts 40 microservices. Suddenly, one node begins crashing. The operations team opens CloudWatch Container Insights, drills into the `Pod Performance` dashboard, and instantly spots a runaway memory leak in a newly deployed `recommendation-engine` pod that was exhausting the node's memory and triggering Linux OOM killer.",
  "examFocus": "For SAA-C03, know how Container Insights is deployed on EKS: (1) Deployed as a DaemonSet using the CloudWatch Observability EKS add-on (or AWS Distro for OpenTelemetry / Fluentbit for logs). (2) Collects diagnostic metrics at Cluster, Node, Pod, and Container levels. (3) Application performance logs (stdout/stderr) are streamed to CloudWatch Logs log groups.",
  "keyPoints": [
    "Collects and visualizes performance metrics and logs from Amazon EKS clusters.",
    "Provides multi-level metric hierarchies: Cluster, Node, Namespace, Service, Pod, Container.",
    "Deployed easily via the Amazon CloudWatch Observability Amazon EKS add-on.",
    "Includes pre-configured CloudWatch Dashboards and automated alarms for container health.",
    "Streams application and host logs (stdout/stderr) directly to Amazon CloudWatch Logs."
  ],
  "commonMistake": "Thinking Container Insights is enabled automatically by default on new EKS clusters. You must install the CloudWatch Observability Add-on (or CloudWatch agent / Fluentbit DaemonSets) with appropriate IAM permissions to start metric ingestion.",
  "example": "# Install CloudWatch Observability add-on via AWS CLI:\naws eks create-addon \\\n  --cluster-name production-cluster \\\n  --addon-name amazon-cloudwatch-observability \\\n  --service-account-role-arn arn:aws:iam::123456789012:role/CloudWatchObservabilityRole",
  "sources": [
    {
      "title": "Container Insights in Amazon CloudWatch",
      "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html"
    },
    {
      "title": "Setting up Container Insights on Amazon EKS",
      "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/deploy-container-insights-EKS.html"
    }
  ]
});
