import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-6",
  "topicId": "topic-transfer-family",
  "topicTitle": "AWS Transfer Family",
  "objectiveCode": "Management",
  "title": "FTP",
  "status": "ready",
  "plainEnglish": "File Transfer Protocol (FTP) transfers login credentials, commands, and file data without protocol encryption. It uses a persistent control connection and separate data connections. Transfer Family therefore supports FTP with an internal-access VPC-hosted endpoint, where private network controls can contain legacy traffic.",
  "whyItMatters": "Some legacy systems cannot use SFTP or FTPS, but moving clear-text FTP across an untrusted network can expose passwords and content. An internal Transfer Family endpoint can reduce infrastructure management while the organization plans migration to an encrypted protocol.",
  "workplaceExample": "A factory appliance that supports only FTP sends non-sensitive test output through a private network to an internal VPC-hosted endpoint. Routes, security groups, and the client firewall limit access, a directory-backed identity has one storage location, and the replacement plan moves the appliance to FTPS or SFTP.",
  "examFocus": "Plain FTP is unencrypted and Transfer Family requires internal access on a VPC-hosted endpoint for it. FTP uses password authentication with a supported directory or custom identity provider, and passive data connections require more network rules than SFTP's SSH connection.",
  "keyPoints": [
    "FTP does not encrypt credentials or transferred data, so it is inappropriate for sensitive traffic over the public internet.",
    "Transfer Family FTP endpoints use the VPC-hosted internal-access option; the Public endpoint type is not supported.",
    "The control and data channels are separate, and passive-mode data connections must be permitted through each network control in the path.",
    "FTP users authenticate through a supported AWS Directory Service or custom identity-provider configuration rather than service-managed SFTP keys.",
    "Private connectivity such as VPN or Direct Connect can provide a network path, but does not change FTP itself into an encrypted protocol.",
    "The selected user authorization and S3 or EFS permissions still constrain every file operation.",
    "Logging and alarms should detect repeated failed logins and transfers while avoiding sensitive file data in operational messages."
  ],
  "commonMistake": "Do not label FTP secure merely because the endpoint has private IP addresses. Private routing limits reachability, but the FTP protocol remains clear text; use SFTP or FTPS whenever the client can support an encrypted protocol.",
  "example": "Document a legacy test client's route to an internal VPC endpoint, including its custom IdP, storage mapping, control channel, passive data channels, security-group sources, and logging. Transfer only harmless data, confirm an unauthorized subnet is blocked, capture the migration dependency, and never place the test FTP endpoint on an internet-facing path.",
  "sources": [
    {"title": "Create an FTP-enabled server", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-server-ftp.html"},
    {"title": "Create a server in a virtual private cloud", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html"}
  ]
});
