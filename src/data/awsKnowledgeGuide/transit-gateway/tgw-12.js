import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-12", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Static Routes", "status": "ready",
  "plainEnglish": "A static Transit Gateway route is an administrator-created mapping from a destination CIDR to a chosen attachment. Static routes are required for ordinary Transit Gateway peering and are useful for defaults, summarization, deliberate service insertion, or destinations that are not dynamically propagated. A static blackhole route drops matching traffic instead of selecting an attachment.",
  "whyItMatters": "Static routes provide precise control but do not automatically follow remote topology changes. A broad default or aggregate can send large amounts of traffic to the wrong network, bypass inspection, or hide an unavailable destination, so ownership and change review are essential.",
  "workplaceExample": "Spoke attachments use a static `0.0.0.0/0` route to a centralized egress VPC, while their specific private destinations remain learned routes. A more-specific blackhole protects a reserved documentation prefix. The egress attachment's associated table contains propagated spoke routes so NAT return traffic reaches the original VPC.",
  "examFocus": "Transit Gateway first applies longest-prefix match. For an identical destination, static routes have priority over propagated routes. Blackhole routes deliberately discard matching packets. Peering uses static routes on both Transit Gateways because ordinary peering does not exchange propagated routes automatically.",
  "keyPoints": [
    "A static route names a CIDR destination and a next-hop attachment rather than learning that destination dynamically.",
    "The most-specific matching route wins even when a less-specific route has a different type.",
    "For the same destination CIDR, a static route has higher documented priority than a propagated route.",
    "A blackhole route is an intentional drop action and can override a less-specific permitted path through longest-prefix matching.",
    "Static routes do not verify that the destination network or return route actually exists behind the target attachment.",
    "A static route in Transit Gateway does not add the necessary route to any VPC subnet table or customer router.",
    "Review static defaults, aggregates, peering prefixes, inspection targets, and blackholes for unintended reachability before deployment."
  ],
  "commonMistake": "Do not add a static default to fix one destination without tracing all other addresses it matches. A default can divert unrelated traffic or bypass a required firewall; prefer the narrowest correct route and validate the reverse path.",
  "example": "In a fictional table, route `192.0.2.0/24` to a peer, use `0.0.0.0/0` for egress, and blackhole `192.0.2.128/25`. Apply longest-prefix match to addresses in each half of the `/24`, then document matching routes on the remote Transit Gateway and both VPC return paths.",
  "sources": [
    {"title": "Create a static route in AWS Transit Gateway", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-create-static-route.html"},
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"}
  ]
});
