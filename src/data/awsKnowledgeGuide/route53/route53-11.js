import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-11",
  "title": "Simple Routing Policy",
  "plainEnglish": "Simple Routing Policy is the default and most straightforward routing policy in Amazon Route 53. It is used when you have a single resource that performs a given function for your domain (such as a single web server or single Application Load Balancer). While you can specify multiple IP addresses within a single simple record set, Route 53 returns all values to the client resolver in a randomized order without performing individual health checks.",
  "whyItMatters": "Simple routing is the ideal, lowest-overhead routing policy for standard single-server applications, single-region architectures, static websites, and basic development environments that do not require intelligent location-based routing, weighted load distribution, or automatic health check failover.",
  "workplaceExample": "A startup launches a marketing landing page hosted on an EC2 web server with Elastic IP `203.0.113.80`. The developer creates an A record for `landing.mystartup.io` using the Simple Routing Policy pointing to `203.0.113.80` with a 300-second TTL. Whenever prospective users navigate to the URL, Route 53 immediately returns the single server IP.",
  "examFocus": "Understand Simple Routing Policy constraints: (1) Single Record Set: You can create only one record with the same name and type using simple routing. (2) Multiple Values: You CAN specify multiple IP addresses in a single simple record (Route 53 returns all values in random order for basic client-side round-robin). (3) No Health Checks: Simple routing does NOT support Route 53 health checks to remove unhealthy IPs automatically.",
  "keyPoints": [
    "Default Route 53 routing policy for single-resource domain mapping.",
    "Returns a predetermined static response (single IP/hostname or a list of multiple IPs).",
    "If multiple IP values are configured, Route 53 returns all values in randomized order.",
    "Does not support Route 53 Health Checks to remove individual failed servers.",
    "Cannot create multiple records with the same name and type under simple routing.",
    "Best suited for single endpoints, non-redundant development servers, and static endpoints."
  ],
  "commonMistake": "Attempting to create multiple separate A records with the same domain name using Simple routing to achieve high availability. Simple routing allows only one record per name; to distribute traffic across multiple separate records with health checking, use Weighted, Latency, or Multivalue-Answer routing.",
  "example": "Configure a Simple Routing Policy A record with two IP values in JSON: {\"Changes\": [{\"Action\": \"CREATE\", \"ResourceRecordSet\": {\"Name\": \"web.example.com\", \"Type\": \"A\", \"TTL\": 60, \"ResourceRecords\": [{\"Value\": \"198.51.100.10\"}, {\"Value\": \"198.51.100.11\"}]}}]}.",
  "sources": [
    {
      "title": "Simple Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-simple.html"
    },
    {
      "title": "Choosing a Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"
    }
  ]
});
