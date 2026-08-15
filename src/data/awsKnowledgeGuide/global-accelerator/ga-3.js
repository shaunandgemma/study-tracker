import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-3",
  "title": "Endpoint Groups & Automatic Health-Check Failover (ALB, NLB, EC2, Elastic IP)",
  "plainEnglish": "A standard accelerator connects a listener to Regional endpoint groups. Each group can contain supported endpoints—Application Load Balancers, Network Load Balancers, Amazon EC2 instances, or Elastic IP addresses—and Global Accelerator considers health when selecting where new traffic goes.",
  "whyItMatters": "A multi-Region application can keep stable global entry addresses while Global Accelerator stops directing new connections to an unhealthy endpoint and uses healthy capacity elsewhere.",
  "workplaceExample": "A checkout service has an ALB endpoint group in London and another in Ireland. If the London ALB endpoint becomes unhealthy, Global Accelerator redirects new connections to healthy capacity in Ireland.",
  "examFocus": "An endpoint group belongs to one Region. Load balancer health comes from Elastic Load Balancing health checks; EC2 and Elastic IP endpoint checks are configured in Global Accelerator. Automatic redirection applies to new connections and is not a guarantee of zero interruption.",
  "keyPoints": [
    "Each standard endpoint group is associated with one AWS Region.",
    "Supported standard endpoints include ALB, NLB, EC2 instance, and Elastic IP resources.",
    "Global Accelerator continually evaluates endpoint health for standard accelerators.",
    "Traffic is normally sent only to active, healthy endpoints.",
    "Health-check configuration differs between load balancer endpoints and EC2 or Elastic IP endpoints.",
    "If no endpoints are healthy, Global Accelerator routes traffic to all endpoints rather than dropping all traffic."
  ],
  "commonMistake": "Assuming Global Accelerator performs the same custom health check directly against every endpoint type is wrong. ALB and NLB health is configured through Elastic Load Balancing, while EC2 and Elastic IP checks use endpoint-group settings.",
  "example": "Create endpoint groups for two Regions, register one ALB in each, verify both are healthy, then fail the test application's health endpoint in one Region and observe where new connections are routed.",
  "sources": [
    {
      "title": "Endpoint groups for standard accelerators",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoint-groups.html"
    },
    {
      "title": "Endpoints for standard accelerators",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints.html"
    }
  ]
});
