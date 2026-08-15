import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tgw-5", "topicId": "topic-transit-gateway", "topicTitle": "AWS Transit Gateway", "objectiveCode": "Networking", "title": "Transit Gateway VPC Attachments", "status": "ready",
  "plainEnglish": "A Transit Gateway VPC attachment connects one VPC to a Transit Gateway through selected subnets. You select one attachment subnet in each required Availability Zone (AZ). Those subnets provide the Transit Gateway entry and exit points for resources in their AZ; application resources can remain in different subnets and use their own route tables to reach the attachment.",
  "whyItMatters": "Subnet selection determines which AZs can use the Transit Gateway and how return traffic enters the VPC. Production designs commonly select suitable dedicated or shared attachment subnets across required AZs, while avoiding the false idea that every application subnet must be selected.",
  "workplaceExample": "An application VPC runs workloads in two AZs and selects one small attachment subnet in each. Each application subnet route table sends the remote services CIDR to Transit Gateway. The attachment subnets' route tables contain routes toward the application subnets, and the remote VPC routes replies back to its own Transit Gateway attachment.",
  "examFocus": "A VPC attachment selects one subnet per AZ, not every subnet. A resource can send to Transit Gateway only when an attachment subnet exists in its AZ and relevant VPC routes are correct. The attachment must also be associated and propagated or statically routed as the design requires.",
  "keyPoints": [
    "Choose only suitable attachment subnets, one per required Availability Zone, rather than selecting all VPC subnets.",
    "Resources use their own subnet route tables to send remote IPv4 or IPv6 prefixes to the Transit Gateway target.",
    "The attachment subnets' route tables are important for traffic leaving Transit Gateway toward destinations inside the VPC.",
    "An attachment can be associated with one Transit Gateway route table and can propagate its VPC CIDRs to supported route tables.",
    "In cross-account work, use AZ identifiers rather than account-specific AZ names to identify the same physical zone consistently.",
    "Overlapping VPC CIDRs cannot be repaired by Transit Gateway because it does not translate addresses.",
    "Security groups and network ACLs still evaluate traffic at VPC resources and subnets; Transit Gateway is not the security policy itself."
  ],
  "commonMistake": "Do not add a Transit Gateway route to an application subnet in an AZ that lacks an attachment subnet and expect traffic to work. Verify selected AZs and the attachment subnet's routes as well as the workload subnet's route.",
  "example": "Use a fictional VPC with two application subnets and one attachment subnet in each of two AZs. Trace a request to `192.0.2.0/24` from each AZ through its workload route, attachment, associated Transit Gateway table, and destination. Then trace the reply and confirm both attachment-subnet route tables can reach the originating workload.",
  "sources": [
    {"title": "Amazon VPC attachments in AWS Transit Gateway", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/tgw-vpc-attachments.html"},
    {"title": "How AWS Transit Gateway works", "url": "https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html"}
  ]
});
