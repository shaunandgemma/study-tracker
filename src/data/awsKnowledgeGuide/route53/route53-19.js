import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-19",
  "title": "Health Check Failover",
  "plainEnglish": "Health Check Failover in Amazon Route 53 is the automated operational mechanism that links Route 53 Health Checks to DNS routing policies (such as Failover, Weighted, Latency, or Multivalue-Answer routing). When a health check detects that an endpoint has degraded or failed, Route 53 automatically removes that endpoint from active DNS answers and redirects user traffic to healthy alternative resources.",
  "whyItMatters": "Manual DNS failover during a production incident requires on-call engineers to wake up, diagnose the failure, update DNS records, and wait for DNS TTL caching to expire—costing hours of downtime. Automated Health Check Failover detects failures within seconds and redirects traffic with zero human intervention.",
  "workplaceExample": "A global SaaS platform configures Active-Active multi-region routing using Latency-Based Routing across Virginia (`us-east-1`) and Ireland (`eu-west-1`), attaching Route 53 Health Checks to each regional record. During a fiber outage affecting the Ireland region, Route 53 detects that the Ireland health check has failed, marks the record unhealthy, and automatically routes European users to the Virginia cluster until the Ireland region recovers.",
  "examFocus": "Understand health check failover patterns: (1) Active-Passive Failover: Primary record routes 100% of traffic until failed, then secondary takes over. (2) Active-Active Failover: Traffic is distributed across multiple healthy records (Latency/Weighted/Multivalue); if one fails, traffic redistributes among remaining healthy records. (3) `EvaluateTargetHealth`: For Alias records pointing to AWS resources (ALBs, NLBs), setting this to `true` allows Route 53 to inherit the load balancer's internal target group health without creating a separate paid health check.",
  "keyPoints": [
    "Automates traffic redirection when infrastructure or application endpoints fail health checks.",
    "Supports both Active-Passive (DR standby) and Active-Active (load sharing with failover) patterns.",
    "Integrated with Failover, Weighted, Latency-Based, Geolocation, and Multivalue-Answer routing policies.",
    "Alias records use 'EvaluateTargetHealth=true' to inherit internal load balancer health at no extra cost.",
    "Recovery Time Objective (RTO) is governed by health check interval (10s/30s), failure threshold, and record TTL.",
    "Does not migrate or terminate open TCP sessions; redirects only subsequent new DNS query resolutions."
  ],
  "commonMistake": "Creating a separate paid Route 53 Health Check to monitor an Application Load Balancer instead of using `EvaluateTargetHealth=true` on the Alias record. `EvaluateTargetHealth` queries the ALB's internal target group health directly and is completely free of charge.",
  "example": "Configure an Active-Active multi-region Latency record with automated failover: Create an Alias record for `us-east-1` ALB with Region=us-east-1 and EvaluateTargetHealth=true; create an Alias record for `eu-west-1` ALB with Region=eu-west-1 and EvaluateTargetHealth=true.",
  "sources": [
    {
      "title": "Configuring DNS Failover in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html"
    },
    {
      "title": "Types of DNS Failover Architectures in Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-types.html"
    }
  ]
});
