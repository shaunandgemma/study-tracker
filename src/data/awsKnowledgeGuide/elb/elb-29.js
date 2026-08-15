import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-29",
  "title": "Access Logs",
  "plainEnglish": "Elastic Load Balancing access logs record details about individual requests or connections handled by a load balancer. When enabled, the service publishes log files to an Amazon Simple Storage Service (S3) bucket for investigation and analysis.",
  "whyItMatters": "Access logs help diagnose client errors, target response problems, traffic patterns, and TLS behavior after an event. They complement metrics, which aggregate behavior rather than describing each request.",
  "workplaceExample": "An operations team enables ALB access logs to an encrypted S3 bucket with a retention lifecycle. During an incident, analysts query status codes, request paths, target timing, and client addresses.",
  "examFocus": "Access logging is optional and must be enabled. For ALB it records request-level details and writes compressed files to S3. Bucket policy, supported Region placement, encryption settings, retention, and sensitive-data handling are operational concerns.",
  "keyPoints": [
    "Access logs are disabled by default and must be explicitly enabled.",
    "ALB access logs contain details about requests sent to the load balancer.",
    "Log files are delivered to a configured S3 bucket.",
    "The S3 bucket must grant the documented Elastic Load Balancing log-delivery permission.",
    "Access logs are best-effort and are not a complete accounting or billing record.",
    "Protect, retain, and analyze logs according to security and compliance requirements."
  ],
  "commonMistake": "Enabling access logs without the required S3 bucket permissions prevents delivery. Validate delivery with test traffic and monitor the destination rather than assuming configuration succeeded.",
  "example": "Create a dedicated same-Region S3 bucket and required policy, enable ALB access logging with a prefix, send test requests, verify log objects arrive, and apply an approved lifecycle policy.",
  "sources": [
    {
      "title": "Access logs for Application Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html"
    }
  ]
});
