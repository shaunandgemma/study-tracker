import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-18",
  "title": "Route 53 Health Checks",
  "plainEnglish": "Route 53 Health Checks are automated monitoring probes that continuously test the health, availability, and responsiveness of your web servers, API endpoints, and cloud infrastructure. Route 53 deploys health checkers across multiple geographic AWS Regions to send periodic HTTP, HTTPS, or TCP requests to your endpoints, enabling automated DNS failover whenever an endpoint fails consecutive health checks.",
  "whyItMatters": "Hardware crashes, application exceptions, and localized network outages can happen at any moment. Route 53 Health Checks provide the automated intelligence needed to pull unhealthy servers out of DNS circulation immediately, preventing end users from landing on broken pages or experiencing connection timeouts.",
  "workplaceExample": "A retail platform creates an HTTPS Route 53 Health Check monitoring `https://api.shop.com/healthz` every 10 seconds (Fast Interval) with a failure threshold of 3. If the backend web service returns HTTP 500 errors or fails to respond for 3 consecutive checks (30 seconds), Route 53 marks the endpoint unhealthy and automatically reroutes traffic to a backup region.",
  "examFocus": "Understand the three types of Route 53 Health Checks: (1) Endpoint Health Checks: Probes a public IP or domain name via HTTP, HTTPS, or TCP. (2) Calculated Health Checks: Evaluates up to 256 child health checks using logic rules (e.g., 'Healthy if at least 3 of 5 child checks are healthy'). (3) CloudWatch Alarm Health Checks: Monitors private resources or custom CloudWatch metrics (e.g., CPU, Memory, DB connections) by linking to an alarm.",
  "keyPoints": [
    "Monitors endpoint availability from multiple globally distributed AWS health checker locations.",
    "Three primary health check types: Endpoint Probes, Calculated Health Checks, and CloudWatch Alarm Monitors.",
    "Request Intervals: Standard (probes every 30 seconds) and Fast (probes every 10 seconds, extra cost).",
    "Failure Threshold: Number of consecutive failed checks required before marking an endpoint unhealthy (default 3).",
    "String Matching: Can inspect the first 5,120 bytes of HTTP response body for a specific expected keyword.",
    "Direct endpoint checks require public IP addressing; private endpoints must use CloudWatch Alarm health checks."
  ],
  "commonMistake": "Attempting to create an endpoint health check that probes a private IP address (e.g., `10.0.1.50`). Route 53 health checkers reside on the public internet and cannot reach private RFC 1918 IP addresses; use a CloudWatch Alarm Health Check to monitor private resources.",
  "example": "Create an HTTPS endpoint health check with a 30-second interval using the AWS CLI: aws route53 create-health-check --caller-reference $(date +%s) --health-check-config IPAddress=198.51.100.10,Port=443,Type=HTTPS,ResourcePath=/health,RequestInterval=30,FailureThreshold=3.",
  "sources": [
    {
      "title": "Types of Amazon Route 53 Health Checks",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/health-checks-types.html"
    },
    {
      "title": "How Route 53 Determines Whether an Endpoint Is Healthy",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-determining-health-of-endpoints.html"
    }
  ]
});
