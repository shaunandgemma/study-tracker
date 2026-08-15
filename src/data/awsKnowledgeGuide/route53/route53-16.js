import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-16",
  "title": "Geoproximity Routing Policy",
  "plainEnglish": "Geoproximity Routing Policy in Amazon Route 53 routes user DNS queries based on the physical geographic location of your AWS resources (or non-AWS endpoints defined by latitude and longitude) and allows you to dynamically expand or contract the geographic reach of each region using a numerical value called a 'Bias' (ranging from -99 to +99). Geoproximity routing is configured exclusively through Route 53 Traffic Flow visual policies.",
  "whyItMatters": "Unlike simple geolocation, geoproximity lets you shift traffic boundaries gradually between data centers. If your US-East servers are overloaded and US-West servers have excess capacity, you can apply a positive bias (+20) to US-West or a negative bias (-20) to US-East, shifting Midwest user traffic to the western data center without manual IP subnet reconfiguration.",
  "workplaceExample": "An enterprise runs data centers in Oregon (`us-west-2`) and Virginia (`us-east-1`). During peak morning business hours on the East Coast, the Virginia cluster reaches 90% CPU. The infrastructure engineer opens Route 53 Traffic Flow and adjusts the bias on `us-west-2` to `+30`. Route 53 instantly expands the geographic boundary for the Oregon data center eastward into the Central US, relieving load on Virginia seamlessly.",
  "examFocus": "Understand Geoproximity Routing concepts: (1) Resource Location: Based on AWS Region or latitude/longitude for on-premises data centers. (2) Bias: Positive bias (+1 to +99) EXPANDS geographic reach and routes more traffic to that resource; Negative bias (-1 to -99) SHRINKS geographic reach and routes less traffic. (3) Traffic Flow Required: Must use Route 53 Traffic Flow visual policy rules to create geoproximity records.",
  "keyPoints": [
    "Routes DNS traffic based on the physical geographic location of target resources.",
    "Supports both AWS Regions and non-AWS resources specified by latitude and longitude coordinates.",
    "Uses 'Bias' values (-99 to +99) to dynamically expand or shrink the geographic reach of a data center.",
    "Positive bias attracts more user traffic from neighboring regions; negative bias deflects traffic away.",
    "Configured exclusively through Route 53 Traffic Flow visual policy trees.",
    "Requires Route 53 Traffic Flow policy record pricing per active policy version."
  ],
  "commonMistake": "Attempting to create a Geoproximity record directly in the standard Route 53 hosted zone record creation console. Geoproximity routing requires creating a Traffic Policy in Route 53 Traffic Flow.",
  "example": "In Route 53 Traffic Flow: Define Endpoint A in `us-east-1` with Bias=0, and Endpoint B in `us-west-2` with Bias=+25 to shift Central US client DNS traffic to the Oregon region.",
  "sources": [
    {
      "title": "Geoproximity Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-geoproximity.html"
    },
    {
      "title": "Using Traffic Flow to Route DNS Traffic in Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/traffic-flow.html"
    }
  ]
});
