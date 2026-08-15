import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-13",
  "title": "Global Accelerator Endpoint Weights",
  "plainEnglish": "An endpoint weight is a relative number that influences how a standard accelerator divides traffic among endpoints in the same endpoint group. Global Accelerator compares each healthy endpoint's weight with the sum of weights in that group.",
  "whyItMatters": "Weights enable canary releases, capacity-based balancing, and gradual endpoint replacement inside one Region without changing the Region's overall traffic dial.",
  "workplaceExample": "A team adds a new NLB beside the current NLB in one Regional group. It starts with weights 1 and 255, validates the new stack with a small share, and progressively reverses the values.",
  "examFocus": "Weights apply to endpoints within a group; traffic dials apply to Regional endpoint groups. Weight is relative, not a direct percentage. Zero normally stops new traffic to that endpoint, but availability logic can override weights in limited failover cases.",
  "keyPoints": [
    "Each endpoint in a standard accelerator can have a weight from 0 to 255.",
    "The default endpoint weight is 128.",
    "Traffic share is based on the endpoint's weight divided by the group's total weights.",
    "A weight of zero normally removes an endpoint from regular new-traffic selection.",
    "Only healthy endpoints with usable weights participate in normal weighted routing.",
    "Global Accelerator can override weights in limited cases to preserve availability or avoid connection collisions."
  ],
  "commonMistake": "Giving an endpoint weight 50 does not mean it receives 50 percent unless the other weights make that ratio true. Always calculate against the total for the endpoint group.",
  "example": "In one endpoint group, assign old and new endpoints weights 240 and 16, monitor the new version, then adjust the relative weights in stages until the old endpoint reaches zero.",
  "sources": [
    {
      "title": "How endpoint weights manage traffic volume",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-endpoint-weights.html"
    }
  ]
});
