import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-5",
  "title": "Global Accelerator Standard Accelerators",
  "plainEnglish": "A standard accelerator is the Global Accelerator type that automatically selects healthy Regional application endpoints based on client location, endpoint health, and traffic controls. It fronts existing ALB, NLB, EC2, or Elastic IP resources with global static addresses.",
  "whyItMatters": "Standard accelerators improve the availability and network performance of ordinary applications without requiring the application to decide the exact destination server and port for every user.",
  "workplaceExample": "A software service puts ALBs in three Regions behind one standard accelerator. Nearby users normally reach a close healthy Region, while operations uses traffic dials for maintenance and endpoint weights for a canary release.",
  "examFocus": "Choose a standard accelerator for automatic optimal endpoint selection and health-based failover. Choose custom routing when application logic must map users deterministically to specific EC2 destinations and ports.",
  "keyPoints": [
    "A standard accelerator includes static addresses, listeners, Regional endpoint groups, and endpoints.",
    "It routes traffic to supported healthy endpoints based on performance and configuration.",
    "Supported endpoint resources include ALB, NLB, EC2 instances, and Elastic IP addresses.",
    "Traffic dials adjust traffic to an endpoint group, while weights adjust traffic among endpoints inside a group.",
    "Standard accelerators support IPv4 or supported dual-stack configurations.",
    "Unlike custom routing accelerators, standard accelerators use endpoint health checks and automatic redirection."
  ],
  "commonMistake": "Using a standard accelerator when each game session must be mapped by application logic to one exact server and port gives up deterministic control. That requirement points to a custom routing accelerator.",
  "example": "Create a dual-Region standard accelerator, add a TCP listener, create one endpoint group per Region, register healthy NLB endpoints, and gradually shift new traffic with a Regional traffic dial.",
  "sources": [
    {
      "title": "Standard accelerators in AWS Global Accelerator",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-accelerators.html"
    },
    {
      "title": "Working with standard accelerators",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/work-with-standard-accelerators.html"
    }
  ]
});
