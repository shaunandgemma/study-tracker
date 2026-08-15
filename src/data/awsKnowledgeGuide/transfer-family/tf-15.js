import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-15", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Security Groups for VPC Endpoints", "status": "ready",
  "plainEnglish": "A security group is a stateful virtual firewall attached to a VPC-hosted Transfer Family server endpoint. Its inbound rules decide which client source networks can start protocol connections to the endpoint. Return traffic for an allowed connection is tracked automatically, but routes, network ACLs, and external firewalls still have to permit the path.",
  "whyItMatters": "Restricting the endpoint to known networks reduces exposure before authentication occurs. The correct rules vary by protocol: SFTP normally uses one SSH connection, while FTP and FTPS use a control connection plus passive-mode data connections that frequently cause partial-connectivity failures.",
  "workplaceExample": "An internal FTPS endpoint accepts connections only from a corporate client subnet. Its security group permits the documented control channel and passive data-channel range from that subnet, while network ACLs and the client firewall mirror the requirement. A listing test verifies the data path rather than stopping after successful login.",
  "examFocus": "Security groups apply to VPC-hosted endpoints, not the Transfer Family Public endpoint type. They control network reachability, not file authorization. Use current protocol documentation for ports and remember that FTP/FTPS data channels need rules beyond their control channel.",
  "keyPoints": [
    "Use narrow client CIDR ranges or approved security-group references where the architecture supports them instead of open internet sources.",
    "SFTP normally needs its configured SSH listener connection; VPC-hosted SFTP supports only documented listener-port choices.",
    "FTP and FTPS need a control connection and separate passive data connections for listings and file transfers.",
    "A successful login tests only part of an FTP/FTPS path; list, upload, and download tests exercise data channels.",
    "Security groups are stateful, while stateless network ACLs require compatible rules in both directions.",
    "Routing, VPN or Direct Connect configuration, client firewalls, DNS, and any NAT path can fail independently of the security group.",
    "Network access does not grant a Transfer Family login or S3/EFS access; identity and storage policies remain mandatory."
  ],
  "commonMistake": "Do not open all ports to all sources when an FTPS directory listing fails. Identify whether control or passive data setup failed, consult the current documented port requirements, inspect both sides of the route, and make the smallest rule change needed.",
  "example": "Review a fictional FTPS flow from one test client subnet. Mark the control and passive data connections, then check the endpoint security group, subnet network ACL, route tables, VPN or internet path, client firewall, certificate name, and logs. Test authentication, listing, upload, and download separately and roll back any temporary narrow rule.",
  "sources": [
    {"title": "Create a server in a virtual private cloud", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html"},
    {"title": "Configuring an SFTP, FTPS, or FTP server endpoint", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/sftp-for-transfer-family.html"},
    {"title": "Create an FTPS-enabled server", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-server-ftps.html"}
  ]
});
