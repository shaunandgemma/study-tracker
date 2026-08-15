import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-privatelink",
  "topicTitle": "AWS PrivateLink",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "pl-r1",
  "title": "VPC Gateway Endpoints vs Interface Endpoints (S3 and DynamoDB free routing vs PrivateLink private IP)",
  "plainEnglish": "AWS provides two distinct types of VPC Endpoints to connect privately to AWS services without an Internet Gateway or NAT Gateway: Gateway Endpoints and Interface Endpoints (powered by AWS PrivateLink). Gateway Endpoints add prefix-list routes directly to your VPC Route Tables for Amazon S3 and Amazon DynamoDB at zero cost. Interface Endpoints create dedicated Elastic Network Interfaces (ENIs) with private IP addresses in your subnets, supporting hundreds of AWS services, partner SaaS platforms, and on-premises hybrid networks.",
  "whyItMatters": "Choosing the correct endpoint type optimizes cloud architecture, networking topology, and monthly data transfer costs. Gateway Endpoints provide free, high-throughput private access to S3 and DynamoDB from within a VPC. Interface Endpoints allow on-premises servers (via Direct Connect or VPN), peered VPCs, and non-S3/DynamoDB AWS services (like Secrets Manager, KMS, and SQS) to communicate privately over private IP addresses.",
  "workplaceExample": "A data engineering team configures private access to AWS services from private subnets: For Amazon S3 data lake analytics, they create a free Gateway Endpoint in their VPC route tables to avoid data transfer charges on petabytes of S3 queries. For AWS Secrets Manager and AWS KMS, they create Interface VPC Endpoints with private IP ENIs, attaching security groups to restrict access to authorized application instances.",
  "examFocus": "Know the differences between Gateway and Interface endpoints: (1) Supported Services: Gateway Endpoints support ONLY Amazon S3 and Amazon DynamoDB; Interface Endpoints support almost all AWS services, SaaS partners, and custom endpoint services. (2) Architecture: Gateway Endpoints use VPC Route Table target entries (`vpce-xxxx`); Interface Endpoints create ENIs with private IPs in subnets. (3) Cost: Gateway Endpoints are completely FREE; Interface Endpoints incur hourly endpoint and per-GB data processing fees. (4) Hybrid Access: Interface Endpoints are accessible from on-premises via Direct Connect/VPN; Gateway Endpoints are NOT accessible from on-premises directly.",
  "keyPoints": [
    "Gateway Endpoints are route-table targets supported exclusively for Amazon S3 and Amazon DynamoDB.",
    "Interface Endpoints (AWS PrivateLink) create dedicated ENIs with private IP addresses in your VPC subnets.",
    "Gateway Endpoints are free of charge with zero data processing fees.",
    "Interface Endpoints incur hourly endpoint charges plus per-GB data transfer processing fees.",
    "Interface Endpoints can be accessed from on-premises networks over AWS Direct Connect or Site-to-Site VPN.",
    "Gateway Endpoints cannot be reached from on-premises environments (unless using an S3 Interface Endpoint or proxy).",
    "Security Groups can be attached to Interface Endpoints to control inbound traffic; Gateway Endpoints use Endpoint Policies and Route Tables."
  ],
  "commonMistake": "Creating costly S3 Interface Endpoints for standard in-VPC EC2 workloads when a free S3 Gateway Endpoint would fulfill the requirement at zero cost. Use S3 Gateway Endpoints for in-VPC workloads, and reserve S3 Interface Endpoints for on-premises hybrid access.",
  "example": "Create a free Gateway Endpoint for Amazon S3 associated with a VPC route table using the AWS CLI: aws ec2 create-vpc-endpoint --vpc-id vpc-01234567 --service-name com.amazonaws.us-east-1.s3 --route-table-ids rtb-private123.",
  "sources": [
    {
      "title": "Gateway Endpoints for Amazon S3 and Amazon DynamoDB",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html"
    },
    {
      "title": "VPC Endpoints and AWS PrivateLink Overview",
      "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html"
    }
  ]
});
