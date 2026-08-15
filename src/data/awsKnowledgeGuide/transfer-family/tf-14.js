import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-14", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "VPC-Hosted Endpoints", "status": "ready",
  "plainEnglish": "A virtual private cloud (VPC)-hosted Transfer Family server endpoint places endpoint network interfaces in selected subnets. Internal access is reachable through the VPC and connected networks such as AWS Direct Connect or Site-to-Site VPN. Internet-facing access associates Elastic IP addresses and internet routing while retaining customer security-group controls.",
  "whyItMatters": "VPC hosting is the choice when fixed addresses, source-network filtering, private connectivity, or protocols beyond the Public endpoint's SFTP support are required. The endpoint is managed, but customers still own subnet selection, routes, gateways, Elastic IPs, security groups, DNS, and the path from each client.",
  "workplaceExample": "A company exposes FTPS to two partners through an internet-facing VPC-hosted endpoint in selected Availability Zones. Each subnet receives an Elastic IP, the security group allows only partner networks over the required FTPS control and data paths, and the custom hostname matches the ACM certificate.",
  "examFocus": "Distinguish VPC-hosted internal access from VPC-hosted internet-facing access. Internal endpoints use private addresses and connected networks; internet-facing endpoints use Elastic IPs. Current protocol compatibility differs by access option, with FTP restricted to internal VPC access.",
  "keyPoints": [
    "Select the VPC, Availability Zones, and subnets where Transfer Family creates the managed endpoint interfaces.",
    "Internal access requires private routing from the client, potentially through peering, transit, VPN, or Direct Connect as designed.",
    "Internet-facing access requires appropriate public routing and Elastic IP addresses for the chosen endpoint subnets.",
    "Security groups and network ACLs can restrict source traffic, but neither grants user or storage authorization.",
    "SFTP, FTPS, FTP, and AS2 compatibility depends on internal versus internet-facing access and current endpoint documentation.",
    "A DNS hostname improves client usability; it does not replace SFTP host-key verification, an FTPS certificate, or user authentication.",
    "Deploy across supported Availability Zones according to availability requirements and test every advertised address and route."
  ],
  "commonMistake": "Do not choose an internal endpoint and expect an internet client to reach its private addresses, or add Elastic IPs without an internet route. Trace DNS resolution, address type, subnet routes, gateways, network filters, and client return paths end to end.",
  "example": "On paper, design an internal SFTP endpoint across approved subnets for an on-premises client using private connectivity. Record DNS, client and endpoint addresses, routes, security-group sources, network ACLs, protocol port, identity call, storage path, and logs; then contrast the changes required for an internet-facing design without creating either endpoint.",
  "sources": [
    {"title": "Create a server in a virtual private cloud", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html"},
    {"title": "AWS Transfer Family endpoint type matrix", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/sftp-for-transfer-family.html"}
  ]
});
