import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-20", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Transfer Family for Existing File Transfer Clients", "status": "ready",
  "plainEnglish": "Existing compatible SFTP, FTPS, or FTP clients can connect to a Transfer Family server using the endpoint hostname, protocol, port, and supported authentication configured for that server. Migration can retain a custom DNS name and, for SFTP, import existing server host keys so automated clients recognize the server, but backend and command behavior must still be tested.",
  "whyItMatters": "Partner scripts are often difficult to change, so preserving a hostname, protocol, and trusted identity can reduce migration disruption. A managed endpoint is not a byte-for-byte copy of a legacy server: supported commands, authentication methods, passive networking, S3 object semantics, and directory mappings can expose compatibility gaps.",
  "workplaceExample": "A company moves a partner SFTP service to Transfer Family. It imports an approved existing host key, maps the old DNS name after testing, recreates each user through a custom IdP, and maps legacy paths to S3 prefixes. A staged partner validates list, upload, download, rename, timestamps, and denied paths before DNS cutover.",
  "examFocus": "Transfer Family is designed for familiar file-transfer clients, but protocol support and endpoint constraints still apply. SFTP clients use SSH host keys, FTPS clients validate an X.509 certificate, and FTP is internal and unencrypted. SCP is not supported, even though it also uses SSH.",
  "keyPoints": [
    "Inventory the exact protocol, authentication method, commands, directory behavior, file sizes, and network allow lists used by each client.",
    "A custom hostname maps DNS to the Transfer Family endpoint but does not create trust or copy users and storage permissions.",
    "Importing an existing SFTP host key can preserve client trust; protect private host-key material and rehearse rotation carefully.",
    "FTPS migrations must align endpoint DNS, ACM certificate trust, TLS behavior, and passive data-channel networking.",
    "S3-backed sessions can differ from a POSIX legacy filesystem, so test rename, folder, metadata, and permission expectations explicitly.",
    "Transfer Family supports documented client commands and protocols, but SCP and shell access are not provided.",
    "Use staged DNS cutover, monitoring, rollback criteria, and partner communication rather than changing every client simultaneously."
  ],
  "commonMistake": "Do not change DNS first and assume familiar credentials make the migration compatible. Validate host or certificate trust, identity responses, storage mappings, supported commands, protocol data channels, logs, and rollback with each representative client before cutover.",
  "example": "Build a non-executable migration checklist for a fictional SFTP automation: record client version, endpoint name, pinned host key, user flow, logical paths, required commands, firewall rule, test files, expected logs, cutover time, and rollback trigger. Run the checklist against a test endpoint with synthetic data before proposing any DNS change.",
  "sources": [
    {"title": "Transferring files over a server endpoint using a client", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/transfer-file.html"},
    {"title": "Working with custom hostnames", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/requirements-dns.html"},
    {"title": "Manage host keys for your SFTP-enabled server", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/configuring-servers-change-host-key.html"}
  ]
});
