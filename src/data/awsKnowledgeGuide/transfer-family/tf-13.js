import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-13", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Publicly Accessible Endpoints", "status": "ready",
  "plainEnglish": "The Transfer Family Public endpoint type gives an SFTP server an AWS-managed internet-reachable hostname without placing it in the customer's virtual private cloud (VPC). It is convenient for broadly distributed clients, but its AWS-provided IP addresses can change and customers cannot attach security groups or Elastic IP addresses to this endpoint type.",
  "whyItMatters": "A public SFTP endpoint removes customer VPC setup, but it has fewer network allow-list controls than a VPC-hosted internet-facing endpoint. Strong SSH configuration, user authentication, least-privilege storage access, logging, and client verification of the host key carry more of the security responsibility.",
  "workplaceExample": "Several low-risk partners connect to a public SFTP endpoint using registered SSH public keys. Their firewalls allow the endpoint DNS name rather than fixed service IPs, each user is isolated to one S3 prefix, clients pin the server host key, and alarms flag repeated authentication failures.",
  "examFocus": "The Public endpoint type supports SFTP, not FTPS, FTP, or AS2. It cannot attach customer Elastic IP addresses, security groups, or source-IP allow lists. Choose a VPC-hosted internet-facing endpoint when fixed Elastic IPs or security-group filtering is a requirement.",
  "keyPoints": [
    "Public endpoints are reachable over the internet through a Transfer Family-managed SFTP hostname.",
    "AWS-managed endpoint IP addresses can change, so a client firewall should allow the documented DNS name rather than assume fixed addresses.",
    "Security groups cannot be attached to the Public endpoint type and it does not provide a customer source-IP allow list.",
    "A custom hostname is a DNS alias to the endpoint; it does not itself authenticate users, encrypt storage, or validate the SSH host key.",
    "The SFTP connection protects data in transit, while S3 or EFS encryption and permissions protect the backend separately.",
    "Use minimal user roles, logical mappings, key rotation, current server security policies, and failed-login monitoring.",
    "Endpoint and feature availability are Regional, so use current AWS endpoints documentation rather than a hard-coded Region list."
  ],
  "commonMistake": "Do not promise a partner a fixed allow-list IP for the Public endpoint type or claim a security group protects it. If those controls are mandatory, select a VPC-hosted internet-facing SFTP design with appropriate subnets, Elastic IPs, routes, and security groups.",
  "example": "Compare two paper designs for a fictional SFTP partner: a Public endpoint using the service DNS name and a VPC-hosted internet-facing endpoint using fixed Elastic IPs and source filtering. Record host-key verification, identity, storage role, logs, client firewall needs, operational cost, and choose only after confirming the partner's allow-list requirement.",
  "sources": [
    {"title": "AWS Transfer Family endpoint type matrix", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/sftp-for-transfer-family.html"},
    {"title": "Create an SFTP-enabled server", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-server-sftp.html"},
    {"title": "Working with custom hostnames", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/requirements-dns.html"}
  ]
});
