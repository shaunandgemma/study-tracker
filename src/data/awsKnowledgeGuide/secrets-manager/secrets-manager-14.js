import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-14",
  "title": "VPC Interface Endpoints",
  "plainEnglish": "A virtual private cloud (VPC) interface endpoint, powered by AWS PrivateLink, places network interfaces in selected subnets so workloads can call the Regional Secrets Manager API privately without an internet gateway or Network Address Translation (NAT) device. Private DNS can make the normal Regional service name resolve to those interfaces inside the VPC.",
  "whyItMatters": "Private API connectivity reduces reliance on internet egress and is useful for workloads and rotation functions in private subnets. It changes the network path, not the caller's authorization, so permissions still need deliberate design.",
  "workplaceExample": "A Lambda rotation function runs in private database subnets. The platform team creates a Secrets Manager interface endpoint in the VPC, enables private DNS, allows HTTPS traffic from the function's security group to the endpoint, and restricts the endpoint policy to the required secret operations.",
  "examFocus": "A VPC endpoint provides connectivity, not permission. Troubleshoot DNS, subnets, route behavior, endpoint security groups, endpoint policy, IAM and secret resource policies, and customer-managed KMS permissions as distinct controls.",
  "keyPoints": [
    "Secrets Manager interface endpoints are powered by AWS PrivateLink.",
    "Endpoint network interfaces are created in selected VPC subnets and Availability Zones.",
    "Private DNS allows applications to keep using the normal Regional Secrets Manager hostname.",
    "The endpoint security group must allow the required HTTPS connection from the workload.",
    "An endpoint policy can further limit which API actions and resources use that network path.",
    "The caller still needs valid IAM, resource-policy, and applicable KMS authorization."
  ],
  "commonMistake": "Do not expect endpoint creation to fix AccessDenied or an unreachable database. It supplies a private route to the Secrets Manager API; separately validate the API permissions and the rotation function's network path to its protected system.",
  "example": "Create an approved test endpoint in the workload VPC, select suitable subnets, enable private DNS, limit its security group and endpoint policy, verify a private test workload resolves and reaches Secrets Manager, then confirm its least-privilege role can read only the harmless test secret.",
  "sources": [
    {
      "title": "Using an AWS Secrets Manager VPC endpoint",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/vpc-endpoint-overview.html"
    },
    {
      "title": "Limit requests with VPC endpoint conditions",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html#bp-network"
    }
  ]
});
