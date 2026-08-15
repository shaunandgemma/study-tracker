import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-15',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'VPC Interface Endpoints',
  status: 'ready',
  plainEnglish: 'VPC Interface Endpoints (powered by AWS PrivateLink) allow EC2 instances and private workloads inside a VPC to connect to AWS Systems Manager Parameter Store securely over private AWS network infrastructure, without routing traffic over the public internet or requiring an Internet Gateway, NAT Gateway, or public IP addresses.',
  whyItMatters: 'Highly secure enterprise applications operating in isolated private subnets cannot utilize NAT Gateways or public internet access for compliance reasons. VPC Interface Endpoints keep Parameter Store API traffic strictly within the AWS private network.',
  workplaceExample: 'A banking application runs inside a private VPC subnet with zero internet access. The team creates a VPC Interface Endpoint for `com.amazonaws.us-east-1.ssm`. EC2 instances retrieve parameters securely over private ENIs.',
  examFocus: 'SAA-C03 PrivateLink & VPC Endpoint Rules:\n- Service Name: `com.amazonaws.region.ssm` (plus `com.amazonaws.region.kms` if using SecureString with KMS).\n- Network Security: API traffic remains entirely within the AWS global network; no NAT Gateway required.\n- Security Groups: Attached Security Groups must allow inbound HTTPS (port 443) traffic from private VPC subnet CIDRs.\n- Endpoint Policies: Supports VPC Endpoint Policies to restrict which AWS accounts or parameters can be accessed via the endpoint.',
  keyPoints: [
    'Enables private, secure API access to Parameter Store from within a VPC using AWS PrivateLink.',
    'Eliminates the requirement for Internet Gateways, NAT Gateways, or public IP addresses.',
    'Keeps parameter retrieval traffic entirely within the private AWS network.',
    'Requires VPC endpoints for `ssm` and `kms` (for SecureString parameters).',
    'Supports VPC Endpoint Policies for network-level API access restriction.'
  ],
  commonMistake: 'Configuring a VPC Interface Endpoint for `ssm` but forgetting the `kms` endpoint, causing `SecureString` decryption requests from private subnets to time out.',
  example: 'Creating a VPC Interface Endpoint for Systems Manager via AWS CLI:\naws ec2 create-vpc-endpoint --vpc-id vpc-0123456789abcdef0 --vpc-endpoint-type Interface --service-name com.amazonaws.us-east-1.ssm --subnet-ids subnet-012345',
  sources: [
    { title: 'Creating VPC endpoints for Systems Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/setup-create-vpc-endpoint.html' }
  ]
});
