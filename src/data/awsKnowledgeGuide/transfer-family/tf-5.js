import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-5",
  "topicId": "topic-transfer-family",
  "topicTitle": "AWS Transfer Family",
  "objectiveCode": "Management",
  "title": "FTPS",
  "status": "ready",
  "plainEnglish": "File Transfer Protocol Secure (FTPS) is FTP protected with Transport Layer Security (TLS). Transfer Family uses an X.509 server certificate from AWS Certificate Manager so the client can authenticate the server and encrypt the FTP control and data connections. FTPS is not SFTP and does not use SSH keys.",
  "whyItMatters": "FTPS supports organizations whose clients already use TLS-secured FTP, but its separate control and passive data connections make firewall design more involved than SFTP. Certificate names, trust, expiry, endpoint DNS, security groups, and passive data paths must all agree.",
  "workplaceExample": "An internal finance client reaches a VPC-hosted FTPS endpoint through private connectivity. The client trusts the approved ACM certificate for the endpoint name, the security group permits only approved source networks and required channels, and a custom identity provider returns access to one EFS directory.",
  "examFocus": "FTPS uses TLS and requires a suitable ACM certificate. Transfer Family FTPS uses VPC-hosted endpoint arrangements rather than the Transfer Family Public endpoint type, and it uses password authentication through AWS Directory Service or a custom IdP rather than service-managed SFTP users.",
  "keyPoints": [
    "FTPS extends FTP with TLS protection; it is technically different from SSH-based SFTP.",
    "The ACM certificate identifies the FTPS server, while user credentials authenticate the connecting user.",
    "FTP-style sessions use a control connection and separate data connections, so both paths must pass routing, security-group, and firewall rules.",
    "Transfer Family documents a passive data-channel port range for FTP and FTPS; use the current service documentation when configuring rules.",
    "A custom hostname must match the certificate and DNS design, but a DNS alias alone provides neither TLS nor user authentication.",
    "Use a current Transfer Family security policy and monitor certificate expiration and rejected TLS negotiations.",
    "Storage authorization remains an IAM or POSIX concern after the encrypted FTPS session authenticates."
  ],
  "commonMistake": "Do not open only the FTP control connection and conclude the endpoint is healthy. A user can authenticate yet fail directory listings or transfers when passive data-channel routing, security groups, firewalls, TLS session behavior, or advertised passive IP configuration is wrong.",
  "example": "For an isolated test endpoint, select internal VPC access, an approved test hostname and ACM certificate, a test custom identity, and narrow storage access. Validate certificate hostname and trust, login, list, upload, and download from an allowed network; then deliberately block the passive data path to confirm logs and troubleshooting distinguish control-channel success from data-channel failure.",
  "sources": [
    {"title": "Create an FTPS-enabled server", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-server-ftps.html"},
    {"title": "Configuring an SFTP, FTPS, or FTP server endpoint", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/sftp-for-transfer-family.html"}
  ]
});
