import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-7",
  "topicId": "topic-transfer-family",
  "topicTitle": "AWS Transfer Family",
  "objectiveCode": "Management",
  "title": "AS2",
  "status": "ready",
  "plainEnglish": "Applicability Statement 2 (AS2) is a business-to-business messaging protocol for exchanging structured business data. Transfer Family uses local and partner profiles, X.509 certificates, and an agreement for inbound messages; an AS2 connector supports outbound messages. Encryption, digital signatures, and signed Message Disposition Notices (MDNs) protect and acknowledge the exchange.",
  "whyItMatters": "Trading partners use AS2 when message confidentiality, partner authentication, integrity, and evidence of receipt are contractual requirements. These controls establish what happened at the AS2 protocol boundary, but an MDN does not prove that a downstream business application accepted or processed the document correctly.",
  "workplaceExample": "A retailer and supplier exchange purchase-order messages. Each party exchanges public certificates, the retailer configures local and partner profiles, an agreement accepts inbound encrypted and signed messages into S3, and an AS2 connector sends outbound responses. Operations review MDN and status files separately from order-processing results.",
  "examFocus": "AS2 is not an interactive filesystem protocol like SFTP. Inbound exchange uses an AS2-enabled server and agreement; outbound exchange uses a connector. Certificates used for encryption and signing are separate concepts from SFTP user SSH keys and FTPS server TLS certificates.",
  "keyPoints": [
    "AS2 packages business messages using Cryptographic Message Syntax for supported encryption and digital signatures.",
    "Local and partner profiles identify the two parties and reference the appropriate certificate material.",
    "An agreement connects profiles to an AS2 server for inbound partner messages, while a connector initiates outbound AS2 messages.",
    "A signed MDN supplies protocol-level evidence that a message was received and successfully decrypted; it is not business-processing confirmation.",
    "Private signing or decryption keys must be protected, and exchanged public certificates must be validated and rotated before expiry.",
    "Transfer Family AS2 stores exchanged payloads and related files in supported Amazon S3 locations with explicit IAM permissions.",
    "Monitor transfer status, MDNs, certificate expiry, partner identifiers, and application processing as separate operational signals."
  ],
  "commonMistake": "Do not treat a successful signed MDN as proof that the partner's enterprise system posted the transaction. It confirms the documented AS2 receipt and decryption outcome; reconcile the later business acknowledgement separately.",
  "example": "Model a fictional inbound and outbound exchange without real keys: record local and partner AS2 identifiers, certificate purpose and owner, S3 locations, role permissions, agreement, connector, requested MDN behavior, expiry alarms, and application acknowledgement. Test only synthetic payloads and verify that an AS2 failure and a business-validation failure enter different runbooks.",
  "sources": [
    {"title": "AWS Transfer Family for AS2", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/as2-for-transfer-family.html"},
    {"title": "Manage AS2 certificates", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/managing-as2-partners.html"},
    {"title": "Create an AS2 server and agreement", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-as2-transfer-server.html"}
  ]
});
