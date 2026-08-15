import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-14", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Cross-Account Sharing with AWS RAM", "status": "ready",
  "plainEnglish": "The Transit Gateway owner can share the Regional gateway with other accounts through AWS Resource Access Manager (AWS RAM). An authorized participant account can create an attachment for a VPC it owns. The Transit Gateway owner accepts the attachment when auto-accept is disabled and controls its Transit Gateway route-table association and propagation.",
  "whyItMatters": "Sharing supports a central networking account without transferring route control to every application team. It creates a responsibility boundary: participants own VPC subnets, routes, and workload security, while the hub owner owns Transit Gateway tables and the connectivity policy that can affect all accounts.",
  "workplaceExample": "A network account shares a Transit Gateway with two application accounts through the organization. Each VPC owner selects attachment subnets and adds VPC routes. The network account accepts attachments, associates production and development with different lookup tables, enables only required shared-services propagation, and documents the return route for each VPC.",
  "examFocus": "AWS RAM shares access to Transit Gateway; it does not transfer ownership. Participants cannot manage the owner's Transit Gateway route tables, associations, or propagations. Site-to-Site VPN attachments must be created in the Transit Gateway owner's account, and only a VPC owner can attach using a shared VPC subnet.",
  "keyPoints": [
    "The owner creates a Regional AWS RAM resource share for approved accounts, organizational units, or the organization where supported.",
    "External share invitations require acceptance, while organization sharing can provide access automatically when enabled and configured.",
    "A participant creates a VPC attachment for its VPC, but attachment acceptance follows the Transit Gateway owner's auto-accept setting.",
    "The hub owner manages Transit Gateway route tables, associations, and propagations; participants manage their own VPC route tables and security.",
    "Use Availability Zone IDs in cross-account planning because AZ names can map differently between accounts.",
    "Unsharing a Transit Gateway and deleting an attachment are different operations; unsharing does not automatically remove the existing attachment.",
    "Both account teams must verify attachment state, forward and return routes, non-overlapping CIDRs, and change ownership before enabling traffic."
  ],
  "commonMistake": "Do not tell a participant to edit the central Transit Gateway route table when its VPC cannot connect. The participant verifies its attachment subnets and VPC routes; the owner verifies acceptance, association, propagation, Transit Gateway routes, and the destination return path.",
  "example": "Assign fictional roles to a network account and an application account without using account numbers. List who creates the RAM share, accepts it, creates and accepts the VPC attachment, chooses AZ IDs, edits each route-table layer, and approves propagation. Trace one request and reply before documenting how unsharing differs from deletion.",
  "sources": [
    {"title": "Work with shared AWS Transit Gateways", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/working-with-transit-gateways.html"},
    {"title": "Accept a Transit Gateway resource share", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/share-accept-tgw.html"},
    {"title": "Accepting and rejecting AWS RAM resource share invitations", "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-shared-invitations.html"}
  ]
});
