import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "privatelink-14",
  "title": "Accessing AWS Services without Internet or NAT",
  "plainEnglish": "Accessing AWS Services without Internet or NAT is a zero-trust network architecture where workloads deployed inside private VPC subnets communicate with AWS services (such as Amazon S3, AWS Secrets Manager, AWS KMS, Amazon SQS, and Amazon CloudWatch) exclusively through VPC Endpoints (Gateway and Interface endpoints) without deploying an Internet Gateway, NAT Gateway, or public IP addresses.",
  "whyItMatters": "Deploying NAT Gateways to access AWS service API endpoints introduces significant monthly baseline infrastructure costs ($0.045/hour per NAT Gateway) and data processing fees ($0.045/GB), while exposing private subnets to outbound egress risks. Replacing NAT Gateways with VPC Endpoints eliminates internet exposure, enhances compliance security, and reduces data transfer costs.",
  "workplaceExample": "A medical records platform runs EC2 compute workloads in private subnets with no internet gateway attached. The architecture team provisions a free Gateway Endpoint for Amazon S3 and Interface Endpoints for AWS KMS, Secrets Manager, and CloudWatch Logs. All patient database encryption, secret retrieval, log streaming, and S3 file operations occur over private AWS network links with zero outbound internet routing.",
  "examFocus": "Understand pure private AWS architectures for exam scenarios: (1) Architecture: Private Subnet (EC2/Lambda) -> Interface VPC Endpoints (for KMS, Secrets Manager, SQS, etc.) + Gateway Endpoints (for S3, DynamoDB) -> AWS Services. (2) Route Tables: No 0.0.0.0/0 route to an IGW or NAT Gateway is required. (3) Security: Tightest security posture, eliminating internet exposure and data exfiltration risks.",
  "keyPoints": [
    "Enables compute workloads in isolated private subnets to interact with AWS services without internet routing.",
    "Eliminates the requirement for Internet Gateways, NAT Gateways, NAT instances, and public IP addresses.",
    "Combines free Gateway Endpoints (for S3 and DynamoDB) with Interface Endpoints (for other AWS services).",
    "Significantly reduces cloud networking costs by avoiding NAT Gateway hourly and data processing fees.",
    "Enhances security posture by keeping all API traffic confined strictly to the private AWS global network backbone.",
    "Allows strict egress lockdown where security groups and network ACLs block all external internet destinations."
  ],
  "commonMistake": "Deploying costly NAT Gateways solely for private EC2 instances to communicate with AWS services like CloudWatch, S3, or Systems Manager. Using VPC Endpoints is more secure, provides higher throughput, and avoids NAT Gateway data processing fees.",
  "example": "Architecture: Configure a fully private VPC with private subnets containing zero 0.0.0.0/0 internet routes; create Interface Endpoints for `ec2messages`, `ssm`, and `ssmmessages` to manage instances securely via AWS Systems Manager without internet access.",
  "sources": [
    {
      "title": "AWS Services That Integrate with AWS PrivateLink",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/aws-services-privatelink-support.html"
    },
    {
      "title": "What is AWS PrivateLink?",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html"
    }
  ]
});
