import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-1",
  "title": "2 Static Anycast IP Addresses Routing Traffic to Nearest AWS Edge Location",
  "plainEnglish": "For an IPv4 accelerator, AWS Global Accelerator provides two static IPv4 addresses. They are anycast addresses, which means AWS advertises the same addresses from many edge locations. Internet routing brings a client to a nearby healthy AWS edge, where traffic enters the AWS global network.",
  "whyItMatters": "Clients keep the same two entry addresses while application endpoints move, scale, or fail over between AWS Regions. Two addresses also let clients continue connecting if one network path or address becomes unavailable.",
  "workplaceExample": "A global voice service gives its mobile application the accelerator's two IPv4 addresses. Users in different countries reach nearby AWS edges, while the service can change its Regional Network Load Balancer endpoints without updating the app.",
  "examFocus": "For IPv4, remember two static anycast IPv4 addresses. A dual-stack accelerator instead has two IPv4 and two IPv6 addresses. Anycast selects an edge entry path; Global Accelerator then chooses a healthy Regional endpoint according to its routing logic and configuration.",
  "keyPoints": [
    "An IPv4 accelerator receives two static IPv4 entry addresses.",
    "Anycast advertises the same address from multiple AWS edge locations.",
    "A client is routed to a nearby available edge location by internet routing.",
    "Traffic then uses the AWS global network toward a selected healthy endpoint.",
    "The addresses remain assigned while the accelerator exists, including while it is disabled.",
    "Deleting the accelerator releases AWS-assigned addresses, so clients can no longer use them."
  ],
  "commonMistake": "Calling the two addresses Regional Elastic IP addresses is incorrect. They are global anycast entry addresses associated with the accelerator, not addresses tied to one workload Region.",
  "example": "Create an IPv4 standard accelerator, publish both assigned addresses through the accelerator DNS name or application configuration, add endpoints in two Regions, and test new connections after making one endpoint unhealthy.",
  "sources": [
    {
      "title": "How AWS Global Accelerator works",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html"
    },
    {
      "title": "Support for DNS addressing in Global Accelerator",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/dns-addressing-custom-domains.dns-addressing.html"
    }
  ]
});
