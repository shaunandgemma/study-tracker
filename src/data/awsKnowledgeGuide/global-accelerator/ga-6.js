import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-6",
  "title": "Global Accelerator Listeners",
  "plainEnglish": "A Global Accelerator listener defines which incoming client connections the accelerator accepts. It specifies either TCP or UDP and one or more ports or port ranges, and it connects those incoming flows to associated endpoint groups.",
  "whyItMatters": "Listeners are the accelerator's service boundary. A missing protocol or port prevents clients from connecting, while overly broad ranges can expose ports the application did not intend to serve.",
  "workplaceExample": "A voice platform adds a TCP listener for signalling on port 443 and a UDP listener for its documented media port range. Both listeners use endpoint groups in the Regions that run the corresponding services.",
  "examFocus": "Listeners support TCP or UDP. Each listener associates with endpoint groups, and each group belongs to one Region. Client affinity is optional for standard listeners and can use source IP when stateful workloads need consistent endpoint selection.",
  "keyPoints": [
    "A listener processes inbound connections for specified ports and one protocol.",
    "The supported listener protocols are TCP and UDP.",
    "A listener can define individual ports or port ranges within documented limits.",
    "Each listener is associated with one or more Regional endpoint groups.",
    "Client affinity defaults to None for a standard listener.",
    "Source-IP affinity can keep connections from one client address on the same endpoint, subject to documented availability behavior."
  ],
  "commonMistake": "Configuring a security group for an application port without adding that port to the accelerator listener still leaves the service unreachable through Global Accelerator.",
  "example": "Add a TCP listener for port 443, associate endpoint groups in two Regions, verify endpoint and network rules allow port 443, and test both accelerator addresses from an external client.",
  "sources": [
    {
      "title": "Listeners for standard accelerators",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-listeners.html"
    },
    {
      "title": "How client affinity works",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-listeners-client-affinity.html"
    }
  ]
});
