import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-14",
  "title": "Global Accelerator TCP and UDP Traffic",
  "plainEnglish": "Global Accelerator listeners accept either Transmission Control Protocol (TCP) or User Datagram Protocol (UDP) traffic on configured ports. TCP creates connection-oriented streams, while UDP sends independent datagrams; Global Accelerator accelerates both without requiring HTTP.",
  "whyItMatters": "Many latency-sensitive services—voice, multiplayer games, financial protocols, and Internet of Things systems—use TCP or UDP directly. Global Accelerator can improve their network path even when content caching and web-aware routing do not apply.",
  "workplaceExample": "A communications product sends signalling over TCP and real-time media over UDP. Separate listeners carry both protocols through nearby AWS edge locations to healthy service endpoints.",
  "examFocus": "TCP and UDP support distinguishes Global Accelerator from HTTP-focused content delivery. Remember the documented nonconfigurable idle timeouts: 340 seconds for TCP and 30 seconds for UDP; established flows remain associated until closure or timeout.",
  "keyPoints": [
    "Standard accelerator listeners support TCP or UDP.",
    "Listeners define the accepted port or port ranges for each protocol.",
    "Global Accelerator terminates client TCP at the edge and establishes another TCP connection toward the endpoint.",
    "UDP traffic is routed as flows without an HTTP layer.",
    "The idle timeout is 340 seconds for TCP and 30 seconds for UDP.",
    "A data packet is required to keep an idle TCP connection active; TCP keep-alive packets alone do not maintain it."
  ],
  "commonMistake": "Assuming an operating-system TCP keep-alive packet prevents the Global Accelerator idle timeout is incorrect. The application must exchange at least one byte of data within the timeout window.",
  "example": "Create separate TCP and UDP listeners for a voice service, allow the matching ports through endpoint security controls, generate real application traffic, and monitor new and active flows in CloudWatch.",
  "sources": [
    {
      "title": "How AWS Global Accelerator works and idle timeouts",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html"
    },
    {
      "title": "Listeners for standard accelerators",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/about-listeners.html"
    }
  ]
});
