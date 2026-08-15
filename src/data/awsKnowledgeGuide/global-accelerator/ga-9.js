import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-9",
  "title": "Supported Endpoints - ALB, NLB, EC2 and Elastic IP",
  "plainEnglish": "A standard accelerator can use an Application Load Balancer (ALB), Network Load Balancer (NLB), Amazon EC2 instance, or Elastic IP address as an endpoint. Each type keeps its own application or network role, and support for dual-stack and original client addresses differs.",
  "whyItMatters": "Choosing the correct endpoint type preserves the features the workload needs: Layer 7 routing through ALB, Layer 4 load balancing through NLB, direct instance routing, or a resource reached through an Elastic IP.",
  "workplaceExample": "A web platform uses an internal ALB endpoint so it retains host and path routing behind Global Accelerator. A separate voice service uses an NLB endpoint for UDP traffic and checks its client-IP preservation constraints.",
  "examFocus": "Global Accelerator does not replace ALB's Layer 7 rules or NLB's target distribution. Elastic IP endpoints do not support client IP preservation, while ALB, EC2, and NLB with security groups can support it subject to documented restrictions.",
  "keyPoints": [
    "ALB endpoints can be internet-facing or internal and retain ALB Layer 7 behavior.",
    "NLB endpoints can be internet-facing or internal and are useful for transport-level services.",
    "EC2 instance endpoints route directly to supported instances.",
    "Elastic IP endpoints are IPv4-only endpoints and do not preserve the original client IP.",
    "Dual-stack accelerators require supported dual-stack endpoints.",
    "NLB client-IP preservation requires a supported NLB with security groups and has listener and networking restrictions."
  ],
  "commonMistake": "Assuming every endpoint type supports the same address family and source-IP behavior can break security rules. Review the current endpoint requirements for the exact resource and accelerator configuration.",
  "example": "Use an ALB endpoint for an HTTPS application that needs path routing, enable supported client-IP preservation, update security groups for actual client addresses, and validate the same Region and dual-stack requirements.",
  "sources": [
    {
      "title": "Requirements for accelerator endpoints",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-caveats.html"
    },
    {
      "title": "Preserve client IP addresses in Global Accelerator",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/preserve-client-ip-address.html"
    }
  ]
});
