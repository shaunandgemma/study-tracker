import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "bak-27",
  "topicId": "topic-aws-backup",
  "topicTitle": "AWS Backup",
  "objectiveCode": "Storage",
  "title": "Storage Gateway Backup",
  "status": "ready",
  "plainEnglish": "Storage Gateway Backup in AWS Backup allows organizations to centrally manage and automate backups for on-premises data stored on AWS Storage Gateway Volume Gateways. AWS Storage Gateway connects on-premises applications to cloud-backed storage volumes. AWS Backup treats these Volume Gateway storage volumes just like cloud-native EBS volumes, taking automated point-in-time snapshots and storing them durably in AWS Backup vaults.",
  "whyItMatters": "Hybrid cloud environments often struggle with fragmented backup tooling between on-premises data centers and AWS. Backing up Storage Gateway volumes with AWS Backup creates a single, unified backup strategy that protects hybrid enterprise infrastructure using the exact same retention, encryption, and lifecycle policies.",
  "workplaceExample": "A manufacturing plant runs on-premises VMware virtual machines that store production telemetry on an AWS Volume Gateway. AWS Backup takes automated daily snapshots of the on-premises gateway volumes, retaining them in an encrypted AWS Backup vault for disaster recovery.",
  "examFocus": "For SAA-C03, know that AWS Backup supports hybrid cloud data protection by managing backups of AWS Storage Gateway Volume Gateway volumes. Backups are stored as EBS snapshots in AWS and can be restored either back to an on-premises Storage Gateway or directly into a native Amazon EBS volume attached to an EC2 instance.",
  "keyPoints": [
    "Protects on-premises storage volumes connected through AWS Storage Gateway Volume Gateways.",
    "Bridges hybrid cloud backup architectures under a single centralized AWS Backup policy.",
    "Storage Gateway volume backups are stored as point-in-time EBS snapshots.",
    "Can be restored back to an on-premises Storage Gateway volume or to a cloud-native EBS volume.",
    "Supports cross-Region replication and automated lifecycle retention."
  ],
  "commonMistake": "Believing that Storage Gateway volume backups can only be restored back to an on-premises gateway. Storage Gateway volume snapshots can also be restored directly as Amazon EBS volumes attached to EC2 instances in the cloud during a disaster recovery scenario.",
  "example": "ListOfTags:\n  - ConditionType: STRINGEQUALS\n    ConditionKey: GatewayType\n    ConditionValue: VolumeGatewayProduction",
  "sources": [
    {
      "title": "Backing Up AWS Storage Gateway Volumes with AWS Backup",
      "url": "https://docs.aws.amazon.com/aws-backup/latest/devguide/storage-gateway-backups.html"
    },
    {
      "title": "What is AWS Storage Gateway?",
      "url": "https://docs.aws.amazon.com/storagegateway/latest/userguide/WhatIsStorageGateway.html"
    }
  ]
});
