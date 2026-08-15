import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-4",
  "title": "Global Accelerator Anycast Static IP Addresses",
  "plainEnglish": "Global Accelerator's static addresses are globally announced using anycast, so the same entry addresses are reachable through AWS edge locations around the world. They provide a stable front door even when the Regional resources behind the accelerator change.",
  "whyItMatters": "Static global addresses simplify firewall allow lists, mobile-client configuration, and multi-Region migrations. Teams can change endpoints without asking every client to learn new Regional addresses.",
  "workplaceExample": "A financial partner allow-lists the accelerator's addresses once. The application team later replaces EC2 endpoints with Network Load Balancers in two Regions without changing the partner configuration.",
  "examFocus": "IPv4 accelerators receive two static IPv4 addresses; dual-stack receives two IPv4 and two IPv6 addresses. AWS also supports bring your own IPv4 addresses for supported standard-accelerator configurations. Preserve the distinction between global accelerator addresses and Regional Elastic IPs.",
  "keyPoints": [
    "Global Accelerator addresses are anycast from the AWS edge network.",
    "IPv4 accelerators receive two static IPv4 addresses.",
    "Dual-stack accelerators receive two static IPv4 and two static IPv6 addresses.",
    "Supported standard accelerators can use IPv4 addresses from a brought-your-own-IP pool.",
    "The addresses remain stable when endpoints are added, removed, or replaced.",
    "The accelerator also receives an AWS DNS name that resolves to its assigned addresses."
  ],
  "commonMistake": "Deleting an accelerator to recreate its configuration can lose its AWS-assigned static addresses. Protect production accelerators with access controls and deletion protection where appropriate.",
  "example": "Publish a custom DNS name that points to the accelerator DNS name, use both assigned addresses in partner allow lists, and update endpoint groups rather than replacing the accelerator during a Regional migration.",
  "sources": [
    {
      "title": "Using static IP addresses in Global Accelerator",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html"
    },
    {
      "title": "Bring your own IP addresses in Global Accelerator",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/using-byoip.html"
    }
  ]
});
