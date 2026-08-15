import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-3",
  "topicId": "topic-transfer-family",
  "topicTitle": "AWS Transfer Family",
  "objectiveCode": "Management",
  "title": "Transfer Family Managed File Transfer",
  "status": "ready",
  "plainEnglish": "AWS Transfer Family is a family of managed file-transfer capabilities. Server endpoints accept inbound and outbound client sessions for supported protocols; SFTP and AS2 connectors initiate outbound exchanges to remote partner servers; managed workflows perform supported processing after server uploads; and web apps provide browser access to authorized Amazon S3 data. These components solve different parts of a transfer design.",
  "whyItMatters": "Managed infrastructure reduces server patching and capacity work, but a complete managed file transfer design still includes identity, authorization, endpoint networking, storage, encryption, logging, failure ownership, and partner trust. Selecting the correct Transfer Family component avoids building an inbound server when the real need is an outbound connector or browser portal.",
  "workplaceExample": "A retailer accepts supplier uploads through an SFTP server backed by S3, invokes a managed workflow to tag accepted objects, sends an approved result to a different partner through an outbound SFTP connector, and gives employees browser access through a web app. Each component has its own role, permissions, monitoring, and failure path.",
  "examFocus": "Transfer Family is appropriate when file-transfer protocols or managed business exchanges must reach supported AWS storage. A server is an inbound protocol endpoint, a connector initiates outbound partner transfers, a workflow processes uploaded files, and a web app is S3 browser access through IAM Identity Center and S3 Access Grants.",
  "keyPoints": [
    "Server endpoints support selected SFTP, FTPS, FTP, or AS2 configurations and are not outbound connectors.",
    "SFTP connectors connect from AWS to a remote SFTP server; AS2 connectors exchange outbound AS2 messages under partner agreements.",
    "Managed workflows run supported post-upload steps for SFTP, FTPS, or FTP server transfers, with separate nominal and exception paths.",
    "Transfer Family web apps provide browser-based S3 access and do not behave as general SFTP clients.",
    "Amazon S3 and Amazon EFS have different data and authorization models and cannot be treated interchangeably.",
    "A successful transfer into storage does not prove a later workflow or downstream business process succeeded.",
    "Monitor endpoints, workflow executions, connector calls, storage events, and business outcomes at their respective boundaries."
  ],
  "commonMistake": "Do not call every Transfer Family feature a server. A connector does not accept inbound client logins, a workflow does not provide a network endpoint, and a web app does not replace an SFTP or AS2 integration.",
  "example": "Draw a proposed partner exchange as separate boxes: client, inbound server endpoint, identity provider, storage backend, optional workflow, outbound connector, and remote partner. For each arrow record the protocol, caller, role, encryption, logs, and failure owner, then remove any component that does not serve a stated requirement.",
  "sources": [
    {"title": "What is AWS Transfer Family?", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html"},
    {"title": "AWS Transfer Family managed workflows", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/transfer-workflows.html"},
    {"title": "Transfer Family web apps", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/web-app.html"}
  ]
});
