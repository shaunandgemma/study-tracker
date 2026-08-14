import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-25",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Monitoring with CloudWatch",
  "status": "ready",
  "plainEnglish": "Elastic Beanstalk integrates natively with Amazon CloudWatch to monitor the performance, operational health, and resource utilization of your environment. Elastic Beanstalk offers two health reporting systems: Basic Health Reporting (which publishes basic CPU and Network metrics to CloudWatch every 5 minutes) and Enhanced Health Reporting (which collects detailed system metrics, application response times, HTTP status code breakdowns 2xx/3xx/4xx/5xx, and latency percentiles every 10 seconds).",
  "whyItMatters": "Basic EC2 health checks only detect if an instance is reachable over the network; they cannot detect if your web application is throwing 500 errors or leaking memory. Enhanced Health Reporting evaluates actual HTTP responses and web server logs, providing instant color-coded health statuses (OK/Green, Warning/Yellow, Degraded/Red, Severe/Grey) and rapid auto-recovery.",
  "workplaceExample": "A production API turns on Enhanced Health Reporting in Elastic Beanstalk. When an unhandled exception causes 15% of requests to return HTTP 500 Internal Server Error, Beanstalk immediately transitions the environment health to 'Degraded' and triggers a CloudWatch Alarm that pages the on-call engineer via Amazon SNS.",
  "examFocus": "For SAA-C03, compare Basic Health Reporting vs Enhanced Health Reporting: Basic reporting reports standard CloudWatch metrics (CPU utilization) at 5-minute intervals. Enhanced health reporting collects real-time instance metrics, OS metrics, and HTTP request error codes (4xx/5xx) every 10 seconds via an on-instance health agent. Enhanced health is essential for Rolling and Immutable deployments to detect application health accurately.",
  "keyPoints": [
    "Basic Health Reporting sends basic EC2/ELB metrics to CloudWatch every 5 minutes.",
    "Enhanced Health Reporting collects detailed OS, CPU, memory, and HTTP status metrics every 10 seconds.",
    "Categorizes health into 7 distinct states: Ok, Info, Warning, Degraded, Severe, Pending, Unknown.",
    "Tracks HTTP error rates (4xx, 5xx), request counts, and latency percentiles (p90, p95, p99).",
    "Integrates with Amazon CloudWatch Alarms and Amazon SNS for automated alerting."
  ],
  "commonMistake": "Relying on Basic Health Reporting during production Rolling or Immutable deployments. Basic reporting cannot detect if an application runtime has crashed as long as the EC2 instance is responsive. Enable Enhanced Health Reporting for accurate deployment health gates.",
  "example": "OptionSettings:\n  - Namespace: aws:elasticbeanstalk:healthreporting:system\n    OptionName: SystemType\n    Value: enhanced\n  - Namespace: aws:elasticbeanstalk:healthreporting:system\n    OptionName: HealthCheckSuccessThreshold\n    Value: Warning",
  "sources": [
    {
      "title": "Enhanced Health Reporting and Monitoring in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/health-enhanced.html"
    },
    {
      "title": "CloudWatch Metrics for Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/health-enhanced-cloudwatch.html"
    }
  ]
});
