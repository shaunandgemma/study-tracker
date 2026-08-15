import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-13",
  "title": "Cross-Account Endpoint Services",
  "plainEnglish": "Cross-Account Endpoint Services in AWS PrivateLink allow a service provider in one AWS account to securely share an application or API hosted behind a Network Load Balancer (NLB) with authorized consumer VPCs residing in completely different AWS accounts or third-party organizations. Access is strictly controlled via an Allowed Principals list and an optional connection acceptance approval workflow.",
  "whyItMatters": "Sharing software services, central microservices, or SaaS platforms across different AWS accounts traditionally required complex multi-account VPC peering or internet-facing public endpoints. Cross-Account Endpoint Services enable seamless multi-tenant B2B private software delivery where consumer accounts connect privately without exposing network topologies or coordinating IP address ranges.",
  "workplaceExample": "A centralized authentication platform runs in AWS Account A (`111122223333`). The security team configures a VPC Endpoint Service and adds `arn:aws:organizations::111122223333:organization/o-abc123456` to the Allowed Principals list with manual acceptance required. When business-unit accounts across the organization create Interface Endpoints targeting the service, the platform team verifies the account and approves the connection, enabling private cross-account token verification.",
  "examFocus": "Understand cross-account PrivateLink mechanics: (1) Allowed Principals: Providers grant access to specific AWS account IDs (`arn:aws:iam::account-id:root`), IAM roles, users, or AWS Organizations (`arn:aws:organizations::...`). (2) Acceptance Workflow: If `AcceptanceRequired` is true, the provider must manually accept pending connection requests via `accept-vpc-endpoint-connections`. (3) Service Name: Consumers must be provided the exact service name (e.g., `com.amazonaws.vpce.us-east-1.vpce-svc-01234`).",
  "keyPoints": [
    "Enables private service sharing across different AWS accounts and organizations without VPC peering.",
    "Provider controls access by adding IAM principals or entire AWS Organizations to the Allowed Principals list.",
    "Supports manual connection acceptance workflows (`PendingAcceptance` state) or automated approval.",
    "Eliminates IP address overlap conflicts between provider and consumer VPC CIDR blocks.",
    "Provider can revoke connection permissions or reject active consumer connections at any time.",
    "Consumers pay for their Interface VPC Endpoints; providers pay for their Network Load Balancers and endpoint service."
  ],
  "commonMistake": "Attempting to connect to a cross-account endpoint service without adding the consumer's AWS account ID or IAM principal to the provider's Allowed Principals list. If the principal is not allowed, the consumer receives a 'Service not found' error during endpoint creation.",
  "example": "Add an authorized consumer AWS account to a VPC Endpoint Service using the AWS CLI: aws ec2 modify-vpc-endpoint-service-permissions --service-id vpce-svc-0123456789abcdef0 --add-allowed-principals 'arn:aws:iam::444455556666:root'.",
  "sources": [
    {
      "title": "Adding and Removing Permissions for a VPC Endpoint Service",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#add-remove-permissions"
    },
    {
      "title": "Accepting and Rejecting Endpoint Connection Requests",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/accept-reject-connection-requests.html"
    }
  ]
});
