import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-17",
  "title": "Global Accelerator Static Entry Point",
  "plainEnglish": "A Global Accelerator provides fixed anycast addresses and a default DNS name that clients can use as one stable entry point. The addresses stay attached while the accelerator exists, even as Regional endpoints and traffic policies change.",
  "whyItMatters": "Stable entry information reduces client updates and firewall changes during scaling, blue-green releases, endpoint replacement, and Regional expansion. It is especially useful for installed devices and partner networks that are difficult to reconfigure.",
  "workplaceExample": "An industrial Internet of Things vendor ships devices configured with its custom domain pointing to an accelerator. Years later, the vendor adds a new Region without changing device firmware or its customers' firewall allow lists.",
  "examFocus": "Static entry addresses are a core Global Accelerator advantage over direct Regional endpoints. IPv4 accelerators provide two IPv4 addresses; dual-stack provides two IPv4 plus two IPv6 addresses, and the accelerator DNS name resolves appropriately.",
  "keyPoints": [
    "The accelerator's addresses do not change when endpoint resources change.",
    "AWS assigns a default DNS name for each accelerator.",
    "A custom domain can route to the accelerator through DNS.",
    "Two IPv4 addresses are supplied for an IPv4 accelerator.",
    "Dual-stack provides four static addresses: two IPv4 and two IPv6.",
    "Disabling preserves assigned addresses, but deleting an accelerator releases AWS-assigned addresses."
  ],
  "commonMistake": "Configuring clients with only one of the two accelerator addresses removes part of the resilient entry design. Prefer the accelerator DNS name or include both addresses where direct IP configuration is required.",
  "example": "Create a Route 53 alias from api.example.com to the accelerator, allow-list both static IPv4 addresses for partners, enable deletion protection, and update Regional endpoints without replacing the accelerator.",
  "sources": [
    {
      "title": "Support for DNS addressing in Global Accelerator",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/dns-addressing-custom-domains.dns-addressing.html"
    },
    {
      "title": "Update accelerator settings",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-accelerators.editing.html"
    }
  ]
});
