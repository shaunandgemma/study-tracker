import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ssm",
  "topicTitle": "AWS Systems Manager (SSM)",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "ssm-17",
  "title": "IAM Roles for Systems Manager",
  "plainEnglish": "IAM Roles for Systems Manager are AWS Identity and Access Management (IAM) permission policies and service roles required for Systems Manager to interact securely with your cloud resources and managed nodes. This security model separates into two distinct sides: (1) Node Permissions: The IAM Instance Profile attached to EC2 instances (containing the `AmazonSSMManagedInstanceCore` managed policy) allowing the SSM Agent to communicate with AWS, and (2) User/Automation Permissions: The IAM policies attached to human administrators, CI/CD pipelines, or Automation service roles authorizing specific SSM API actions (like `ssm:StartSession` or `ssm:SendCommand`).",
  "whyItMatters": "Failing to configure proper IAM roles prevents instances from appearing in Fleet Manager, blocks Session Manager access, or accidentally exposes excessive root permissions across your server fleet. Applying least-privilege IAM policies ensures that instances can only communicate with SSM while developers are restricted to specific commands, session documents, and target tags.",
  "workplaceExample": "A cloud security architect configures least-privilege access for junior DevOps engineers. The architect attaches `AmazonSSMManagedInstanceCore` to all EC2 instance profiles. For the junior engineer IAM group, the architect attaches a restricted policy that allows `ssm:StartSession` ONLY on instances tagged `Environment=Development`, while explicitly denying `ssm:StartSession` on instances tagged `Environment=Production`. The policy also restricts `ssm:SendCommand` to the read-only `AWS-RunShellScript` document.",
  "examFocus": "Distinguish between the different IAM roles in Systems Manager: (1) EC2 Instance Profile: Attached to the virtual machine; MUST contain `AmazonSSMManagedInstanceCore` (do NOT use deprecated `AmazonEC2RoleforSSM`). (2) User/Caller IAM Policy: Grants human users or automated pipelines permission to initiate SSM actions (e.g., `ssm:StartSession`, `ssm:GetParameter`). (3) Automation Assume Role: An IAM service role assumed by Systems Manager Automation to perform multi-step cloud actions (like creating snapshots or stopping EC2 instances).",
  "keyPoints": [
    "Separates managed node permissions from human administrator and automation permissions.",
    "EC2 instances require an IAM instance profile with `AmazonSSMManagedInstanceCore`.",
    "Avoid the legacy, deprecated `AmazonEC2RoleforSSM` policy on all modern deployments.",
    "Caller IAM policies control who can start sessions, send commands, or read parameters.",
    "Supports tag-based condition keys (`ssm:resourceTag/*`) for granular attribute-based access control (ABAC).",
    "Systems Manager Automation uses dedicated Assume Roles to execute cross-service actions safely."
  ],
  "commonMistake": "Attaching the `AdministratorAccess` policy to an EC2 instance profile just to get SSM Agent working. Always follow the principle of least privilege and attach only `AmazonSSMManagedInstanceCore` to instance profiles.",
  "example": "Create an IAM role for EC2 instances with the core Systems Manager policy attached using the AWS CLI: aws iam create-role --role-name EC2SSMManagedRole --assume-role-policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"ec2.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}' && aws iam attach-role-policy --role-name EC2SSMManagedRole --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore.",
  "sources": [
    {
      "title": "Configuring Instance Permissions for Systems Manager",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-instance-profile.html"
    },
    {
      "title": "Controlling Access to Systems Manager APIs",
      "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-access.html"
    }
  ]
});
