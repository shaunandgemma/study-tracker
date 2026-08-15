import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-10",
  "title": "Global Accelerator Health Checks",
  "plainEnglish": "A standard accelerator regularly checks endpoint health and sends normal traffic to active healthy endpoints. For EC2 and Elastic IP endpoints, endpoint-group settings define checks; for ALB and NLB endpoints, Global Accelerator uses the load balancer's health status.",
  "whyItMatters": "A useful health check prevents new users from being sent to an application that is running but unable to serve them. Correct network access is also necessary so checkers do not falsely mark healthy resources unavailable.",
  "workplaceExample": "A TCP service on EC2 exposes a separate readiness port. Its endpoint group permits Route 53 health-checker address ranges to that port, and the check fails when the service loses a critical dependency.",
  "examFocus": "Know the endpoint-type distinction. EC2 and Elastic IP checks can set port, protocol, interval, and threshold in Global Accelerator; ALB and NLB health checks are configured in Elastic Load Balancing. UDP listeners require a TCP health-check service for direct endpoints.",
  "keyPoints": [
    "Health checks apply to standard accelerators, not custom routing accelerators.",
    "A newly added endpoint must pass an initial check before receiving normal traffic.",
    "Direct EC2 and Elastic IP checks use endpoint-group health-check settings.",
    "ALB and NLB health is managed through their Elastic Load Balancing configuration.",
    "Firewall and security rules must allow the documented Route 53 health-checker traffic for direct endpoints.",
    "If all endpoints are unhealthy, Global Accelerator can fail open instead of guaranteeing traffic is dropped."
  ],
  "commonMistake": "Using a UDP listener without running the required TCP health-check service on the configured port makes a working UDP endpoint appear unhealthy.",
  "example": "For a UDP EC2 endpoint, run a small TCP readiness service on the configured health port, restrict that port to Route 53 health-checker ranges, and verify state changes before enabling production traffic.",
  "sources": [
    {
      "title": "Ensure health check access for your accelerator",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoint-groups-health-check-options.html"
    }
  ]
});
