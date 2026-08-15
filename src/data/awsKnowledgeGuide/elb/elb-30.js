import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-30",
  "title": "CloudWatch Metrics",
  "plainEnglish": "Elastic Load Balancing publishes operational measurements to Amazon CloudWatch. Metrics summarize load-balancer and target-group activity so dashboards and alarms can reveal traffic changes, errors, latency, capacity use, and target health.",
  "whyItMatters": "Metrics show whether the load balancer and application are meeting service goals. They help teams alert on failures, distinguish load-balancer errors from target errors, and scale before users experience degradation.",
  "workplaceExample": "A team alarms when HealthyHostCount falls, TargetResponseTime rises, or target-generated 5xx responses increase. A dashboard compares request volume with target capacity during a promotion.",
  "examFocus": "Use CloudWatch metrics for aggregated monitoring and alarms; use access logs for request-level investigation. Select dimensions such as load balancer, Availability Zone, and target group, and know that similar metrics can have different meanings for ALB, NLB, and GWLB.",
  "keyPoints": [
    "ELB publishes metrics into CloudWatch for load balancers and target groups.",
    "HealthyHostCount and UnHealthyHostCount reveal target availability.",
    "ALB RequestCount and TargetResponseTime help measure web workload volume and latency.",
    "ELB-generated and target-generated HTTP error metrics identify different failure sources.",
    "Metric dimensions let operators isolate a load balancer, target group, or Availability Zone.",
    "CloudWatch alarms can notify teams or drive supported scaling policies when thresholds are breached."
  ],
  "commonMistake": "Using only total request count can hide failed targets or high latency. Monitor traffic, health, errors, latency, and capacity-related measurements together.",
  "example": "Build an ALB dashboard with RequestCount, TargetResponseTime, HTTPCode_ELB_5XX_Count, HTTPCode_Target_5XX_Count, and host health, then alarm on sustained unhealthy capacity.",
  "sources": [
    {
      "title": "CloudWatch metrics for Application Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-cloudwatch-metrics.html"
    }
  ]
});
