import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-17",
  "title": "Multi-Value Answer Routing Policy",
  "plainEnglish": "Multi-Value Answer Routing Policy in Amazon Route 53 allows you to configure Route 53 to respond to DNS queries with up to eight randomly selected healthy IP addresses/records from a larger pool of healthy endpoints. Unlike Simple routing, every record in a Multivalue-Answer set can have an attached Route 53 Health Check, ensuring that Route 53 never returns IP addresses for servers that are offline or failing.",
  "whyItMatters": "Multivalue-Answer routing provides basic DNS-level load distribution and high-availability failover across multiple standalone web servers without paying for or managing an Elastic Load Balancer. If a server fails, Route 53 detects the outage and stops returning that server's IP address within seconds.",
  "workplaceExample": "A budget-conscious web service operates 6 independent web servers in different data centers. The administrator creates 6 A records for `api.service.io` using the Multivalue-Answer Routing Policy, attaching a Route 53 Health Check to each server IP. When a client performs a DNS lookup, Route 53 returns a randomized list of healthy IPs. If Server 3 crashes, Route 53 health checks mark it unhealthy and immediately exclude it from subsequent DNS responses.",
  "examFocus": "Understand Multivalue-Answer vs ELB and Simple Routing: (1) Maximum Values Returned: Route 53 returns up to 8 healthy records per query. (2) Health Checking: Unlike Simple routing, every multivalue record MUST have a unique SetIdentifier and can attach a Route 53 Health Check. (3) Not a True Load Balancer: It performs DNS-level round-robin; it cannot perform session affinity, SSL termination, or Layer 7 path routing like an Application Load Balancer.",
  "keyPoints": [
    "Responds to DNS queries with up to 8 randomly chosen healthy records from an endpoint pool.",
    "Supports Route 53 Health Checks on every individual record to filter out failed endpoints.",
    "Provides low-cost, client-side DNS load leveling without an Elastic Load Balancer.",
    "Each record requires a unique SetIdentifier (e.g., `Server-1`, `Server-2`).",
    "Clients choose which IP address to connect to from the returned list of healthy records.",
    "Does not substitute for a full Elastic Load Balancer (lacks connection draining, SSL termination, sticky sessions)."
  ],
  "commonMistake": "Thinking Multivalue-Answer routing replaces an Elastic Load Balancer. Multivalue routing only operates at the DNS resolution level; it cannot balance traffic evenly in real time or reroute active client connections when a server crashes mid-session.",
  "example": "Configure a Multivalue-Answer record with a health check in JSON: {\"Changes\": [{\"Action\": \"CREATE\", \"ResourceRecordSet\": {\"Name\": \"api.example.com\", \"Type\": \"A\", \"SetIdentifier\": \"Web-Node-1\", \"MultiValueAnswer\": true, \"TTL\": 60, \"ResourceRecords\": [{\"Value\": \"198.51.100.11\"}], \"HealthCheckId\": \"hc-12345678\"}}]}.",
  "sources": [
    {
      "title": "Multivalue Answer Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-multivalue.html"
    },
    {
      "title": "Choosing a Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"
    }
  ]
});
