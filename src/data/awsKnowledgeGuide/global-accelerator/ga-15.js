import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-15",
  "title": "Global Accelerator AWS Global Network Routing",
  "plainEnglish": "Global Accelerator brings client traffic into the AWS network at a nearby edge location and carries it toward a selected AWS Regional endpoint over the managed global network. Standard routing considers client location, network performance, endpoint health, and configured controls.",
  "whyItMatters": "Keeping more of the path on AWS infrastructure can reduce exposure to congested or inconsistent public-internet hops, improving latency, jitter, throughput, and availability for globally distributed users.",
  "workplaceExample": "A trading application has endpoints in Frankfurt and Singapore. Clients enter through nearby edge locations, and the accelerator chooses a healthy Regional endpoint while CloudWatch metrics show flows by source Region and destination edge.",
  "examFocus": "Global Accelerator optimizes the network path; it is not a cache, Domain Name System routing policy, or Layer 7 load balancer. An ALB endpoint remains necessary when the application also needs host- or path-based routing.",
  "keyPoints": [
    "Anycast routes clients to a nearby available AWS edge location.",
    "Traffic travels from the edge toward the endpoint over the AWS global network.",
    "Standard accelerators choose endpoints using performance, health, and configured routing controls.",
    "Global Accelerator reacts to network-performance changes as part of endpoint selection.",
    "Existing application security groups and AWS WAF rules continue to apply according to endpoint design.",
    "CloudWatch metrics and optional flow logs help operators observe accelerator traffic and troubleshoot reachability."
  ],
  "commonMistake": "Promising that AWS global routing eliminates every packet loss or guarantees a fixed latency is inaccurate. Measure from real client locations and design application retries and resilience.",
  "example": "Deploy identical service endpoints in two Regions, send representative traffic through the accelerator from several continents, and compare latency, jitter, resets, and endpoint selection using application data and CloudWatch.",
  "sources": [
    {
      "title": "How AWS Global Accelerator works",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html"
    },
    {
      "title": "Using Amazon CloudWatch with Global Accelerator",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/cloudwatch-monitoring.html"
    }
  ]
});
