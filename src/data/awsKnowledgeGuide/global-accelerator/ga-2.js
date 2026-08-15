import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-2",
  "title": "AWS Global Backbone Routing for TCP/UDP Latency Reduction",
  "plainEnglish": "Global Accelerator accepts Transmission Control Protocol (TCP) or User Datagram Protocol (UDP) traffic at a nearby AWS edge location and carries it across the managed AWS global network toward the application endpoint. This reduces the portion of the journey that depends on variable public-internet routes.",
  "whyItMatters": "Long or unstable public routes can add latency, jitter, and packet loss for global users. Moving traffic onto the AWS network earlier can improve consistency and performance, especially for interactive or real-time applications.",
  "workplaceExample": "A multiplayer game uses UDP listeners on a standard accelerator. Players connect to the closest AWS edge, and AWS carries their traffic to the healthy game-service endpoint selected in the appropriate Region.",
  "examFocus": "Choose Global Accelerator when a TCP or UDP application needs improved global network paths, static entry addresses, or rapid health-based redirection. It does not cache content, and it does not promise zero latency or zero packet loss.",
  "keyPoints": [
    "Client traffic enters the AWS network through a nearby Global Accelerator edge location.",
    "AWS carries traffic over its global network toward a Regional endpoint.",
    "Standard listeners support TCP and UDP.",
    "Global Accelerator is suitable for non-HTTP traffic such as gaming, voice, and Internet of Things connections.",
    "For TCP, Global Accelerator terminates the client connection at the edge and establishes a connection to the endpoint.",
    "Actual improvement depends on client location, network conditions, endpoint placement, and application behavior."
  ],
  "commonMistake": "Describing Global Accelerator as a content cache confuses it with Amazon CloudFront. Global Accelerator optimizes the network path for connections but does not store copies of application content at edges.",
  "example": "Place healthy UDP service endpoints in two Regions, create a UDP accelerator listener, and measure latency and jitter from representative client locations before and after directing traffic through the accelerator.",
  "sources": [
    {
      "title": "How AWS Global Accelerator works",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html"
    },
    {
      "title": "What is AWS Global Accelerator?",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"
    }
  ]
});
