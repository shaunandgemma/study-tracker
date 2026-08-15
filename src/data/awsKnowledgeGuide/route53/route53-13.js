import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-13",
  "title": "Latency-Based Routing Policy",
  "plainEnglish": "Latency-Based Routing (LBR) in Amazon Route 53 allows you to deploy application resources across multiple AWS Regions and route each user's DNS queries to the AWS Region that provides the lowest network latency (fastest round-trip time). AWS continuously measures network latency between worldwide internet networks and all AWS Regions to dynamically select the optimal endpoint for every user.",
  "whyItMatters": "In global applications, serving users from distant geographic servers introduces noticeable latency, degrading user experience and conversion rates. Latency-Based Routing automatically directs users to their fastest regional infrastructure without requiring manual IP geolocation mapping or complex routing rules.",
  "workplaceExample": "A global gaming company deploys game servers in `us-east-1` (Virginia), `eu-west-1` (Ireland), and `ap-southeast-1` (Singapore). They configure Latency-Based Routing records for `play.mygame.io`. Players in London are automatically directed to `eu-west-1` (20ms latency), while players in Tokyo are routed to `ap-southeast-1` (35ms latency), delivering smooth multiplayer performance worldwide.",
  "examFocus": "Understand Latency-Based Routing mechanics: (1) AWS-Managed Measurements: Latency is based on AWS's global network latency tables, NOT on real-time application load or packet inspection. (2) Health Checks: When health checks are attached to each regional record, Route 53 automatically fails over to the next best latency Region if the primary Region becomes unhealthy. (3) Multi-Region Active-Active: Forms the foundation of global active-active multi-region architectures.",
  "keyPoints": [
    "Routes DNS queries to the AWS Region offering the lowest network latency for the requesting user.",
    "Driven by continuous AWS network latency measurements between internet providers and AWS data centers.",
    "Supports multi-region active-active architectures across any number of AWS Regions.",
    "Integrates with Route 53 Health Checks to fail over to the next lowest-latency Region if a Region goes down.",
    "Each record set specifies the target AWS Region (e.g., `Region=us-west-2`) and a unique SetIdentifier.",
    "Does not proxy or inspect application packets; simply returns the optimal regional IP address during DNS resolution."
  ],
  "commonMistake": "Confusing Latency-Based Routing with Geolocation Routing. Geolocation routes users based strictly on geographic boundaries (e.g., continent/country); Latency-Based Routing routes users based on measured network round-trip time, which may sometimes cross national borders to reach a closer, lower-latency data center.",
  "example": "Configure a Latency-based record for an ALB in Tokyo using the AWS CLI: create record `api.example.com` with Region='ap-northeast-1', SetIdentifier='Tokyo-Region', AliasTarget pointing to the Tokyo ALB with EvaluateTargetHealth=true.",
  "sources": [
    {
      "title": "Latency-Based Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-latency.html"
    },
    {
      "title": "Choosing a Routing Policy in Amazon Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html"
    }
  ]
});
