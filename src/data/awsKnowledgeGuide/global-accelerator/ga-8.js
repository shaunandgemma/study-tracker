import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-8",
  "title": "Global Accelerator Endpoints",
  "plainEnglish": "An endpoint is the actual AWS resource that receives traffic from a standard accelerator. Endpoints are registered inside a Regional endpoint group, must be active and valid, and begin receiving new connections after they pass initial health checks.",
  "whyItMatters": "Endpoints connect global routing to application capacity. Their health, weight, network controls, and client-IP preservation settings determine whether traffic reaches the correct resource safely.",
  "workplaceExample": "A media service adds a new Network Load Balancer to its Paris endpoint group with a low weight. After the endpoint becomes healthy and monitoring looks normal, the team gradually increases its weight.",
  "examFocus": "Do not confuse an endpoint with an endpoint group. The group represents one Region; the endpoint is an ALB, NLB, EC2 instance, or Elastic IP resource inside it. Standard and custom routing accelerators use different endpoint models.",
  "keyPoints": [
    "Standard accelerator endpoints are registered inside Regional endpoint groups.",
    "A resource must be valid and active before it can be added.",
    "An endpoint must pass initial health checks before normal traffic is routed to it.",
    "Endpoint weight controls its relative share inside the endpoint group.",
    "Client IP address preservation support depends on endpoint type and configuration.",
    "Removing an endpoint stops new connections through Global Accelerator but does not delete the AWS resource."
  ],
  "commonMistake": "Deleting an EC2 or load balancer resource before removing it as an accelerator endpoint can create confusing routing or reuse behavior. Drain and remove it from Global Accelerator first.",
  "example": "Create a second application endpoint, add it to the correct Regional group at low weight, confirm its health and security configuration, raise its weight gradually, and remove the old endpoint only after connections have drained.",
  "sources": [
    {
      "title": "Endpoints for standard accelerators",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints.html"
    },
    {
      "title": "Add a standard endpoint",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-adding-endpoints.html"
    }
  ]
});
