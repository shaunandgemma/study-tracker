import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-10", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway Route Table Associations", "status": "ready",
  "plainEnglish": "A Transit Gateway route-table association assigns an attachment the single table used to route packets arriving from that attachment. Association is the attachment's lookup context. It does not copy the attachment's routes into the table; that separate action is route propagation.",
  "whyItMatters": "Changing an association can instantly change every destination reachable from a VPC, VPN, or other attachment. Associations are therefore a strong segmentation tool and a high-blast-radius configuration that needs review, staged changes, route comparison, and a rollback plan.",
  "workplaceExample": "A development VPC attachment is associated with a development table containing only shared-services and on-premises routes. Its own CIDR propagates into the shared-services return table. Because the development lookup table has no production route, development traffic cannot be routed directly to production even though both use the same Transit Gateway.",
  "examFocus": "Each attachment can be associated with one Transit Gateway route table at a time, while one table can serve many attachments. Default route-table association can associate new attachments automatically. Association chooses incoming-packet lookup; propagation controls learned route installation.",
  "keyPoints": [
    "An attachment's association answers which Transit Gateway table evaluates traffic entering from that attachment.",
    "One attachment has one route-table association at a time, but many attachments can associate with the same table.",
    "Default association is convenient for flat networks but should be reviewed before using custom segmentation.",
    "Association alone adds no destination route and does not modify a workload subnet's VPC route table.",
    "Moving an attachment to another table can remove existing paths or introduce new paths for all workloads behind it.",
    "The destination attachment's associated table matters for the reply packet because the reply arrives from that attachment.",
    "Security groups, network ACLs, and firewalls can still deny a flow that routing associations permit."
  ],
  "commonMistake": "Do not associate an attachment with a new table before confirming that the replacement contains every required forward and return destination. A correct propagation elsewhere does not help if the attachment is looking up traffic in the wrong table.",
  "example": "Model a development attachment moving from a flat default table to a restricted table. Compare its old and new routes, trace development-to-shared traffic and the reply, confirm production has no matching destination, document affected attachments, and define the exact association rollback without changing a real network.",
  "sources": [
    {"title": "Associate a transit gateway route table", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/associate-tgw-route-table.html"},
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"},
    {"title": "Create a transit gateway", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/create-tgw.html"}
  ]
});
