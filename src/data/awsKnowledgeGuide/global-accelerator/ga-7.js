import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-7",
  "title": "Global Accelerator Endpoint Groups",
  "plainEnglish": "An endpoint group is the Regional layer between a standard accelerator listener and its endpoints. Every group belongs to one AWS Region and holds the Regional endpoints, health-check settings where applicable, traffic dial, and optional port overrides.",
  "whyItMatters": "Endpoint groups make Regional traffic control explicit. They let teams add or drain a Region, tune health checking for direct endpoints, and keep each Region's resources managed as one routing unit.",
  "workplaceExample": "A company has endpoint groups in Tokyo and Sydney. During a Sydney release, it lowers that group's traffic dial, verifies the new version, and then raises the dial for new connections.",
  "examFocus": "Remember the hierarchy: accelerator → listener → Regional endpoint group → endpoint. The traffic dial applies only to traffic already selected for that group, not to all listener traffic.",
  "keyPoints": [
    "Each endpoint group and all its endpoints belong to one AWS Region.",
    "A listener can associate with endpoint groups in multiple Regions.",
    "The endpoint group's traffic dial controls its accepted share of traffic already directed to it.",
    "EC2 and Elastic IP health-check settings are configured on the endpoint group.",
    "ALB and NLB endpoint health settings are configured in Elastic Load Balancing.",
    "An endpoint group can contain multiple endpoints with individual weights."
  ],
  "commonMistake": "Setting a Regional traffic dial to 50 does not guarantee that Region receives 50 percent of all global traffic. It accepts half of the traffic Global Accelerator had already selected for that group.",
  "example": "Create a Frankfurt endpoint group for a TCP listener, register two EC2 endpoints with health checks, then lower the group's traffic dial before maintenance and verify new connections use another healthy Region.",
  "sources": [
    {
      "title": "Endpoint groups for standard accelerators",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoint-groups.html"
    },
    {
      "title": "Use traffic dials to adjust traffic flow to Regions",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoint-groups-traffic-dial.html"
    }
  ]
});
