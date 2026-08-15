import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-10",
  "title": "RAM Managed Permissions",
  "plainEnglish": "RAM Managed Permissions are standardized security permission policies created and maintained by AWS that define the exact actions resource consumers are permitted to perform on a shared resource. When creating a resource share, AWS RAM automatically attaches a default managed permission for each resource type (such as `AWSRAMDefaultPermissionSubnet`), and for supported resource types, offers specialized alternate permissions (e.g., read-only vs full management) and versioning.",
  "whyItMatters": "Simply sharing a resource without defining granular action boundaries risks accidental misconfiguration or privilege escalation. RAM Managed Permissions enforce the principle of least privilege at the resource share level, ensuring consumers can only perform necessary operational tasks (such as launching an EC2 instance in a shared subnet) without modifying the underlying infrastructure properties.",
  "workplaceExample": "A cloud security administrator shares customer-managed Prefix Lists with application accounts. AWS RAM offers multiple managed permission options: `AWSRAMPermissionPrefixListReadOnly` and `AWSRAMDefaultPermissionPrefixList`. To ensure application teams can reference the prefix list in their security groups without modifying the contained IP CIDRs, the administrator attaches the Read-Only managed permission version to the resource share.",
  "examFocus": "Understand RAM Permission concepts and versioning: (1) AWS Managed vs Customer Managed: AWS creates and updates AWS Managed Permissions; Customer Managed Permissions allow custom IAM-like policies for supported resource types. (2) Permission Versions: Each managed permission has version numbers (e.g., version 1, version 2); resource shares can be updated to use the latest permission version. (3) Two-Layer Authorization: The consumer must be permitted by BOTH the RAM permission AND their local IAM identity policy.",
  "keyPoints": [
    "Defines the specific API actions consumers can execute on a shared AWS resource.",
    "Created, tested, and maintained by AWS for each supported shareable resource type.",
    "Supports multiple permission variants for certain resources (e.g., Read-Only vs Full Management).",
    "Uses semantic versioning, allowing resource owners to update to newer permission versions as AWS releases features.",
    "Customer Managed Permissions are supported for select resource types to define custom action policies.",
    "Acts as an outer permission boundary; consumer IAM identities must still possess identity permissions."
  ],
  "commonMistake": "Assuming that a newly released RAM Managed Permission version automatically updates all existing resource shares. Existing shares continue using their attached permission version until the resource owner explicitly updates the share to the new version.",
  "example": "List available managed permissions for a specific resource type using the AWS CLI: aws ram list-permissions --resource-type ec2:Subnet.",
  "sources": [
    {
      "title": "Managing Permissions in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/permissions.html"
    },
    {
      "title": "Customer Managed Permissions in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/customer-managed-permissions.html"
    }
  ]
});
