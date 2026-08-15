import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-7", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Direct Connect Gateway Integration", "status": "ready",
  "plainEnglish": "AWS Direct Connect links a customer network to AWS through dedicated connectivity. To reach a Transit Gateway, a transit virtual interface connects to a Direct Connect gateway, and that Direct Connect gateway is associated with the Transit Gateway. Allowed prefixes on the association control which AWS prefixes the Direct Connect gateway advertises toward the customer network.",
  "whyItMatters": "The integration provides a scalable private path from on premises to multiple VPC and VPN attachments behind a Transit Gateway. Each component has a separate role, so the physical connection, virtual interface, BGP session, Direct Connect gateway association, allowed prefixes, Transit Gateway routes, and VPC routes must all be operated together.",
  "workplaceExample": "A data center reaches several application VPCs through a transit virtual interface and one Direct Connect gateway associated with the Regional Transit Gateway. Approved VPC aggregate prefixes are advertised on premises, on-premises routes propagate to selected Transit Gateway tables, and every spoke VPC has a return route toward the attachment.",
  "examFocus": "A Direct Connect gateway is a globally available routing resource that connects transit virtual interfaces to supported gateways; it is not a Transit Gateway replacement. The association uses allowed prefixes, and Direct Connect is not automatically encrypted. Add a supported VPN-over-Direct-Connect design when encryption is required.",
  "keyPoints": [
    "Use a transit virtual interface to reach a Direct Connect gateway that is associated with Transit Gateway.",
    "Allowed prefixes for a Transit Gateway association are the prefixes the Direct Connect gateway advertises toward on premises.",
    "BGP advertisements from on premises can propagate through the Direct Connect gateway attachment into selected Transit Gateway route tables.",
    "The Direct Connect gateway attachment has a Transit Gateway route-table association for traffic arriving from the customer network.",
    "Spoke subnet route tables send on-premises prefixes to Transit Gateway, and the on-premises router needs the corresponding return advertisements.",
    "Direct Connect provides private connectivity but does not itself guarantee packet encryption.",
    "Design resilience with redundant connections, virtual interfaces, customer devices, and locations according to availability needs rather than relying on one circuit."
  ],
  "commonMistake": "Do not treat the Direct Connect gateway association as an automatic advertisement of every attached VPC. Review its allowed prefixes, BGP state, Transit Gateway propagation and association, spoke routes, and the exact reverse advertisement before changing filters.",
  "example": "Draw a documentation-only path from `192.0.2.0/24` on premises through a transit virtual interface, Direct Connect gateway, Transit Gateway attachment, and a `10.0.0.0/16` VPC. Record allowed prefixes and routes in both directions, then identify where a second connection and location would remove single points of failure.",
  "sources": [
    {"title": "Direct Connect gateways", "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways.html"},
    {"title": "Associate Direct Connect with a Transit Gateway", "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/associate-tgw-with-direct-connect-gateway.html"},
    {"title": "Allowed prefixes interactions for Direct Connect gateways", "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/allowed-to-prefixes.html"}
  ]
});
