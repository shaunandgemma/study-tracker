import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-21", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Transfer Family vs DataSync", "status": "ready",
  "plainEnglish": "AWS Transfer Family provides managed endpoints and exchanges for people, partners, and applications using file-transfer protocols such as SFTP, FTPS, FTP, or AS2. AWS DataSync creates tasks that copy or synchronize datasets between supported storage locations, optionally through an agent near self-managed storage. DataSync does not provide partners with an SFTP login endpoint.",
  "whyItMatters": "A partner-upload requirement is about serving an access protocol, identity, and authorized directory, so Transfer Family fits. A migration or recurring copy of many files between storage systems is about locations, task options, scheduling, verification, and throughput, so DataSync fits. Some architectures use both at different stages.",
  "workplaceExample": "Suppliers upload daily files through a Transfer Family SFTP endpoint into S3. Separately, a scheduled DataSync task copies a large historical dataset from an on-premises NFS server into AWS storage. The partner never interacts with the DataSync task, and the DataSync agent is not an SFTP server.",
  "examFocus": "Choose Transfer Family for managed file-transfer protocols, partner identities, interactive transfers, AS2 exchanges, connectors, or browser-based S3 access. Choose DataSync for high-speed migration, replication, or scheduled transfer between supported storage locations, using an agent when the documented source or destination requires one.",
  "keyPoints": [
    "Transfer Family server endpoints authenticate individual users and expose authorized S3 or EFS paths through supported protocols.",
    "DataSync tasks define source and destination locations, copy options, scheduling, metadata handling, and verification behavior.",
    "A DataSync agent provides access to certain self-managed or external storage locations; it does not accept partner SFTP sessions.",
    "S3 presigned URLs offer temporary object operations without providing a managed SFTP server or directory-browsing contract.",
    "Storage Gateway provides ongoing hybrid storage interfaces, whereas Direct Connect and Site-to-Site VPN provide network connectivity rather than file-transfer applications.",
    "Snow Family supports offline or edge data movement, and API Gateway exposes APIs rather than SFTP, FTPS, FTP, or AS2 endpoints.",
    "A workflow can accept partner files through Transfer Family and later use DataSync for a separate supported bulk-copy requirement.",
    "Compare protocol, identity, direction, source and destination, scheduling, change detection, validation, network, and operational ownership before choosing."
  ],
  "commonMistake": "Do not deploy DataSync when a partner needs to log in with an SFTP client, and do not run one client upload at a time through Transfer Family to perform a planned bulk filesystem migration. Start with the interaction model and data-movement objective.",
  "example": "Classify three fictional requirements: partner SFTP uploads to one S3 prefix use Transfer Family; a scheduled NFS-to-S3 dataset migration uses DataSync with an agent; temporary download of one S3 object may use a presigned URL. For each, record identity, protocol, storage, network, schedule, validation, and failure owner before selecting the service.",
  "sources": [
    {"title": "What is AWS Transfer Family?", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html"},
    {"title": "What is AWS DataSync?", "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html"},
    {"title": "Transferring your data with AWS DataSync", "url": "https://docs.aws.amazon.com/datasync/latest/userguide/transferring-data-datasync.html"}
  ]
});
