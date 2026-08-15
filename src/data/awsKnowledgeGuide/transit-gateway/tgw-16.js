import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-16", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Appliance Mode", "status": "ready",
  "plainEnglish": "Appliance mode is a setting on the VPC attachment that contains a stateful network appliance, such as a third-party firewall. For a traffic flow, it makes Transit Gateway use the same Availability Zone for that appliance VPC attachment in both directions. This flow stickiness helps the same stateful inspection path see the request and reply.",
  "whyItMatters": "A stateful appliance remembers connections. If the forward and return packets reach different appliance instances or zones, the reply can be rejected because the second appliance has no session state. Appliance mode addresses Transit Gateway zone selection, but correct routes and a highly available appliance design are still required.",
  "workplaceExample": "Spoke VPCs send east-west traffic to a shared inspection VPC. The inspection VPC attachment has appliance mode enabled and selected attachment subnets in the required Availability Zones. Separate Transit Gateway tables steer the request to inspection and then to the destination, while the reverse rules steer the reply through the same inspection path.",
  "examFocus": "Enable appliance mode on the VPC attachment that contains stateful appliances, not on every spoke attachment. It preserves Availability Zone affinity for the lifetime of a flow on that attachment. It does not create a firewall, configure rules, repair missing routes, or replace high-availability planning.",
  "keyPoints": [
    "Appliance mode is supported on VPC attachments even when the traffic source is another supported attachment type.",
    "Transit Gateway uses flow hashing and retains the same Availability Zone for the appliance attachment during the flow.",
    "Select an attachment subnet in every Availability Zone where the design needs appliance reachability and resilience.",
    "The appliance subnet tables, Transit Gateway attachment subnet tables, Transit Gateway tables, and destination subnet tables must form both paths.",
    "Association and propagation alone do not force inspection; explicit route-table design must prevent a direct spoke-to-spoke bypass.",
    "Appliance mode does not deploy, configure, scale, monitor, or fail over the third-party appliance for you.",
    "AWS states that one Transit Gateway should connect to the appliance VPC when flow stickiness must be guaranteed because separate gateways do not share flow state."
  ],
  "commonMistake": "Do not enable appliance mode and assume symmetry is complete. A direct propagated route can bypass inspection, or a missing reverse route can send replies elsewhere. Trace both directions across every VPC and Transit Gateway route table and verify the appliance's own forwarding policy.",
  "example": "Sketch two spoke VPCs and a two-zone appliance VPC. Mark the appliance attachment as appliance mode, list its selected subnets, and write the ingress and egress table lookups for a flow and its reply. Then identify and remove any more-direct route that bypasses inspection.",
  "sources": [
    {"title": "Amazon VPC attachments and appliance mode", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html"},
    {"title": "How AWS Transit Gateway works: appliance example", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"}
  ]
});
