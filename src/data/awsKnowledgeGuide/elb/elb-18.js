import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-18",
  "title": "NLB Layer 4 TCP, TLS and UDP Load Balancing",
  "plainEnglish": "An NLB balances network connections and flows using Layer 4 information. Its listener protocol determines whether it handles TCP, terminates TLS, handles UDP, or supports another documented transport, while its target group defines the connection to registered targets.",
  "whyItMatters": "Layer 4 operation supports high-throughput and low-latency services that do not use HTTP, need UDP, or must preserve end-to-end protocol behavior.",
  "workplaceExample": "A telemetry platform receives UDP packets through an NLB and forwards them to collectors. A separate TLS listener terminates encrypted partner connections before sending TCP traffic to application targets.",
  "examFocus": "Choose NLB for TCP, TLS, UDP, TCP_UDP, QUIC, or TCP_QUIC requirements. A TLS listener terminates TLS and needs a certificate; a TCP listener can pass encrypted TCP through without inspection.",
  "keyPoints": [
    "NLB makes routing decisions at OSI Layer 4.",
    "Listener and target-group protocol combinations must be supported by NLB.",
    "TCP listeners can pass arbitrary TCP traffic, including encrypted traffic, to targets.",
    "TLS listeners terminate the client TLS connection and use server certificates.",
    "UDP and TCP_UDP listeners support services that use datagram traffic.",
    "Each TCP connection or UDP flow remains mapped to one target for the life of that flow."
  ],
  "commonMistake": "Selecting a TLS listener when the target must receive the original encrypted connection changes where decryption occurs. Use TCP pass-through when end-to-end TLS termination belongs on the target.",
  "example": "For a DNS-style service that needs both TCP and UDP on the same port, create the supported NLB listener and target-group configuration, register healthy targets in multiple zones, and test both protocols.",
  "sources": [
    {
      "title": "Listeners for Network Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html"
    },
    {
      "title": "Target groups for Network Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html"
    }
  ]
});
