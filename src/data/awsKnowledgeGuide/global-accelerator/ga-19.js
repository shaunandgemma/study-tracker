import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-19",
  "title": "Global Accelerator vs Route 53",
  "plainEnglish": "Amazon Route 53 chooses a response when a client or resolver asks the Domain Name System (DNS) for a name. Global Accelerator gives applications static anycast addresses and makes a routing decision for new TCP or UDP connections after traffic reaches the AWS edge network.",
  "whyItMatters": "DNS routing is flexible and sufficient for many architectures, but resolvers and clients can cache answers. Global Accelerator keeps fixed entry addresses and can redirect new connections based on health or configuration without waiting for those clients to obtain a different DNS answer.",
  "workplaceExample": "A public website uses Route 53 latency records because DNS-level Regional selection is sufficient. A partner API uses Global Accelerator because partners require fixed allow-listed addresses and quicker new-connection failover; Route 53 still maps its custom name to the accelerator.",
  "examFocus": "Choose Route 53 latency routing for DNS answers aimed at a low-latency Region and failover routing for DNS active-passive control. Choose Global Accelerator for global static addresses, AWS-network TCP or UDP acceleration, and connection-level health redirection. The services can work together.",
  "keyPoints": [
    "Route 53 routing policies determine how DNS queries are answered.",
    "Latency routing selects a Regional record using AWS latency measurements.",
    "Failover routing uses primary and secondary DNS records for active-passive behavior.",
    "DNS clients and resolvers can retain answers according to caching and time-to-live behavior.",
    "Global Accelerator routes through static anycast addresses rather than returning different Regional endpoint addresses.",
    "Route 53 can create an alias record that points a custom domain to a Global Accelerator."
  ],
  "commonMistake": "Calling Global Accelerator a replacement for DNS is misleading. Clients can still use Route 53 for the custom domain, while Global Accelerator performs the subsequent network routing.",
  "example": "Create a Route 53 alias for api.example.com that targets the accelerator. Compare it with direct latency records, then choose based on fixed-IP allow lists, protocol, failover timing, network-path needs, and cost.",
  "sources": [
    {
      "title": "Choosing a Route 53 routing policy",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"
    },
    {
      "title": "Routing traffic to a Global Accelerator",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-global-accelerator.html"
    },
    {
      "title": "Latency-based routing",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-latency.html"
    }
  ]
});
