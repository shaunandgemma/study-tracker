import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-shared-responsibility",
  "topicTitle": "AWS Shared Responsibility Model",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "srm-1",
  "title": "Customer vs AWS Security Responsibilities",
  "plainEnglish": "The AWS Shared Responsibility Model separates security of the cloud from security in the cloud. AWS protects the facilities, physical hardware, foundational networking, and virtualization infrastructure that run AWS services. Customers protect and configure what they place in AWS, including their data, identities, permissions, applications, and service settings. The exact dividing line changes with the service and deployment model.",
  "whyItMatters": "A control gap appears when each side assumes the other owns a task. Assigning responsibility service by service helps teams patch the right components, restrict access, protect data, collect evidence, monitor workloads, and design recovery rather than treating migration to AWS as a transfer of business risk.",
  "workplaceExample": "A retailer classifies payment data before choosing services. It records AWS physical controls as inherited, configures customer-owned IAM and encryption controls, documents shared patch and configuration duties for each service, collects AWS reports from Artifact, and produces its own evidence that the workload controls operate effectively.",
  "examFocus": "AWS is responsible for security of the cloud; the customer is responsible for security in the cloud. More abstraction shifts selected infrastructure tasks to AWS but never removes customer ownership of data, identities, permissions, and workload configuration. AWS compliance certifications do not automatically make a customer workload compliant.",
  "keyPoints": [
    "AWS manages physical facilities, hardware, foundational networking, and the virtualization layer for AWS Regions and Availability Zones.",
    "Customers classify and own their data and choose access, encryption, retention, residency, backup, and restoration controls.",
    "IAM policies, security groups, network access control lists, route tables, and resource policies are customer configurations unless a documented service action manages them.",
    "With EC2, the customer manages the guest operating system, installed software, host controls, applications, data, and attached role permissions.",
    "With RDS, AWS manages more operating-system and supported database-maintenance work, while the customer still manages database access, schemas, queries, data, connections, and applicable settings.",
    "With Lambda, AWS runs the server infrastructure, while the customer secures code, dependencies, event sources, execution roles, data handling, configuration, and required runtime-update choices.",
    "For S3 and DynamoDB, AWS operates the underlying platform, but customers still configure data access, classification, encryption choices, lifecycle, and application behavior.",
    "AWS telemetry and compliance reports support customer controls; customers must enable relevant logging, respond to findings, and create their own compliance evidence."
  ],
  "commonMistake": "Assuming that a managed or serverless service makes AWS responsible for application permissions and data security can expose information through an unsafe policy. Read the service-specific boundary, then assign every configurable identity, data, logging, backup, and network control to an owner.",
  "example": "For a Lambda API: 1. AWS manages the facilities, servers, virtualization, and Lambda service infrastructure. 2. The customer manages function code, libraries, execution-role permissions, event authorization, data, and configuration. 3. Runtime updating depends on the selected runtime type and update mode. 4. Compared with on premises, the customer no longer operates servers but still owns application security. 5. A broadly permitted execution role lets vulnerable code read unrelated data. 6. Prevent this with least privilege, dependency maintenance, tested runtime updates, protected data, logging, and an owned incident runbook.",
  "sources": [
    {
      "title": "Shared responsibility in the AWS Well-Architected Security Pillar",
      "url": "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html"
    },
    {
      "title": "Security in Amazon RDS",
      "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.html"
    },
    {
      "title": "Shared responsibility for Lambda runtime management",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/runtime-management-shared.html"
    }
  ]
});
