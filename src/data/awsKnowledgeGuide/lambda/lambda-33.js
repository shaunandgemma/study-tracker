import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-33",
  "title": "Lambda Internet Access from a VPC",
  "plainEnglish": "When an AWS Lambda function is configured to connect to a Virtual Private Cloud (VPC), it loses its default direct route to the public internet. To allow a VPC-connected Lambda function to access both private VPC resources (like Amazon RDS) AND external internet endpoints (like Stripe, Twilio, or public AWS API endpoints), you must place the Lambda function in private subnets that route outbound traffic through a Network Address Translation (NAT) Gateway located in a public subnet with an attached Internet Gateway.",
  "whyItMatters": "Many serverless applications must query a private database while simultaneously calling external SaaS payment processors, SMS APIs, or public third-party webhooks. Understanding how to properly configure VPC routing ensures that functions maintain private database access without severing outbound external connectivity.",
  "workplaceExample": "A billing Lambda function runs inside a VPC to access a private Amazon RDS PostgreSQL database and also calls the Stripe API to process credit card payments. The network engineer places the Lambda function in two private subnets. The private subnet route table routes `0.0.0.0/0` traffic to an AWS NAT Gateway in a public subnet, which in turn routes to the Internet Gateway (IGW), enabling outbound internet connectivity for Stripe calls while keeping RDS completely private.",
  "examFocus": "Understand VPC routing architecture for Lambda: (1) Placing Lambda in a public subnet does NOT give it internet access because Lambda ENIs do not have public IP addresses. (2) Proper Architecture: Lambda in Private Subnet -> NAT Gateway in Public Subnet -> Internet Gateway -> Public Internet. (3) To access AWS services (like DynamoDB, S3, Secrets Manager) from within a private VPC without paying for NAT Gateway data transfer, configure VPC Endpoints (Gateway endpoints for S3/DynamoDB or Interface endpoints for other AWS APIs).",
  "keyPoints": [
    "Attaching Lambda to a VPC strips default public internet access.",
    "Placing Lambda in a public subnet will NOT provide internet access (Lambda ENIs only have private IPs).",
    "To access the internet, Lambda must reside in a Private Subnet routed to a NAT Gateway located in a Public Subnet.",
    "The Public Subnet must contain an active route to an Internet Gateway (0.0.0.0/0 -> igw-xxxx).",
    "VPC Endpoints (AWS PrivateLink) allow private access to AWS services (S3, DynamoDB, Secrets Manager) without traversing a NAT Gateway.",
    "Gateway VPC Endpoints for S3 and DynamoDB are completely free and avoid NAT Gateway data processing fees."
  ],
  "commonMistake": "Configuring Lambda subnets to use a Public Subnet directly with an Internet Gateway route. Because Lambda execution environments cannot receive public IP addresses, the Internet Gateway drops outbound traffic; Lambda must always route through a NAT Gateway in private subnets.",
  "example": "Architecture: Configure private subnet route table with: Destination 0.0.0.0/0 -> Target nat-0123456789abcdef0; attach Lambda function to these private subnets, enabling seamless outbound internet communication.",
  "sources": [
    {
      "title": "Internet and Service Access for VPC-Connected Lambda Functions",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html#vpc-internet"
    },
    {
      "title": "Configuring VPC Networking for AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/foundation-networking.html"
    }
  ]
});
