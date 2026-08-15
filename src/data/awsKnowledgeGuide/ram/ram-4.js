import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-4",
  "title": "Resource Shares",
  "plainEnglish": "A Resource Share in AWS RAM is the central container object that binds together specific AWS resources, authorized principals, and permission policies. When a resource owner creates a resource share, they group one or more resources (such as multiple subnets or prefix lists), attach an explicit RAM permission version to each resource type, and associate the target consumer principals who are permitted to access those resources.",
  "whyItMatters": "Resource shares provide a modular, lifecycle-managed administrative boundary for multi-account governance. You can update a resource share dynamically—adding new subnets, attaching new application accounts, or updating RAM permission versions—without recreating infrastructure or disrupting active consumer workloads.",
  "workplaceExample": "A cloud platform engineer creates a resource share named `Shared-VPC-Production`. Inside this share, they bundle 4 private subnets across 2 Availability Zones and associate the share with the `Production-Workloads` Organizational Unit. Six months later, when two new subnets are added to the VPC, the engineer associates the new subnet ARNs with the existing resource share, instantly granting all production accounts access to the expanded capacity.",
  "examFocus": "Understand Resource Share attributes and lifecycle operations: (1) `allowExternalPrincipals`: A boolean flag determining whether principals outside the owner's AWS Organization can be added. (2) Associations: Resource shares maintain separate lists of Resource Associations and Principal Associations. (3) Deletion: Deleting a resource share revokes consumer access immediately but DOES NOT delete the underlying owner AWS resources.",
  "keyPoints": [
    "The primary administrative container in AWS RAM that groups resources, principals, and permissions.",
    "Supports dynamic updates: resources and principals can be added or removed at any time.",
    "Controls cross-organization boundaries via the `allowExternalPrincipals` setting (true or false).",
    "Maintains distinct association statuses (`ASSOCIATING`, `ASSOCIATED`, `DISASSOCIATING`, `DISASSOCIATED`).",
    "Deleting a resource share revokes consumer access but preserves the underlying AWS resources.",
    "Can be tagged for billing allocation, automated policy enforcement, and resource categorization."
  ],
  "commonMistake": "Thinking that deleting a resource share deletes the underlying VPC subnets or Transit Gateways. Deleting a resource share merely dissolves the sharing association, revoking consumer access while leaving owner resources intact.",
  "example": "Create a resource share that restricts sharing strictly to inside your organization using the AWS CLI: aws ram create-resource-share --name App-Subnets-Share --no-allow-external-principals --resource-arns arn:aws:ec2:us-east-1:111122223333:subnet/subnet-01234567 --principals arn:aws:organizations::111122223333:ou/o-abc123456/ou-prod123.",
  "sources": [
    {
      "title": "Creating and Managing Resource Shares in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-shares.html"
    },
    {
      "title": "Associating Resources and Principals with a Resource Share",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-associating.html"
    }
  ]
});
