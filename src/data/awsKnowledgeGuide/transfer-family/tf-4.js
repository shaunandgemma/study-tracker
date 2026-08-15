import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-4",
  "topicId": "topic-transfer-family",
  "topicTitle": "AWS Transfer Family",
  "objectiveCode": "Management",
  "title": "SFTP",
  "status": "ready",
  "plainEnglish": "Secure Shell File Transfer Protocol (SFTP) transfers files inside an SSH connection. It is a different protocol from FTP and FTPS. A client verifies the Transfer Family server's SSH host key, authenticates with a supported public-key or password flow, and then uses the authorized S3 or EFS paths exposed through the session.",
  "whyItMatters": "SFTP is common in automated partner exchanges because it protects credentials and file data in transit and works with familiar clients. Security still depends on verifying the server host key, protecting the user's private key, limiting network reachability, and mapping the authenticated user to minimal storage access.",
  "workplaceExample": "A payroll provider uploads an encrypted report through a VPC-hosted internet-facing SFTP endpoint. Its firewall allow-lists the endpoint addresses, its automation pins the approved server host key, and its user role can write only to an inbound S3 prefix while a separate internal process reads the object.",
  "examFocus": "SFTP is SSH-based and normally uses a single connection, unlike FTP/FTPS control and passive data channels. Transfer Family supports public and VPC-hosted SFTP endpoint designs, and SFTP is the protocol supported by service-managed users with stored public keys.",
  "keyPoints": [
    "SFTP encrypts authentication and transferred data through SSH; it is not FTP protected by TLS.",
    "A user's public key can be stored by Transfer Family while the matching private key remains with the user and must never be uploaded as a user key.",
    "The server host key lets clients verify server identity and should be distributed and rotated through a controlled process.",
    "A public endpoint has AWS-provided addresses, while a VPC-hosted design enables security groups and internal or internet-facing networking options.",
    "Authentication success is followed by authorization using the user role, policy, home mapping, and storage permissions.",
    "S3-specific client operations can behave differently from a POSIX filesystem because S3 stores objects rather than files and directories.",
    "Failed login and file-operation logs should be monitored without exposing sensitive filenames or user material unnecessarily."
  ],
  "commonMistake": "Do not disable host-key checking simply to make an automated SFTP job connect. Verify and pin the expected server host key; an unexpected change can indicate a configuration error or a connection to the wrong server.",
  "example": "Using only test keys and an isolated prefix, configure a test SFTP user, record the server's public host-key fingerprint through a trusted channel, connect with a compatible client, upload and download harmless data, test a denied sibling path, rotate by adding an approved new host key, and verify logs before removing the test user.",
  "sources": [
    {"title": "Create an SFTP-enabled server", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-server-sftp.html"},
    {"title": "Manage host keys for your SFTP-enabled server", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/configuring-servers-change-host-key.html"},
    {"title": "Managing users for server endpoints", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-user.html"}
  ]
});
