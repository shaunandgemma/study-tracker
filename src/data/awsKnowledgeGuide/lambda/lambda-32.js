import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-32",
  "title": "Lambda VPC Integration",
  "plainEnglish": "Lambda VPC Integration connects your serverless Lambda function to private subnets within an Amazon Virtual Private Cloud (VPC). This enables your function to securely access private network resources—such as Amazon RDS database instances, Amazon ElastiCache clusters, internal Application Load Balancers, or EC2 instances—without exposing those resources to the public internet.",
  "whyItMatters": "Databases and internal enterprise microservices should never be hosted in public subnets with open internet access. VPC integration allows Lambda functions to communicate across private subnets securely over private IP addresses within your VPC boundary.",
  "workplaceExample": "A financial transaction API needs to query an Amazon Aurora PostgreSQL database located in isolated private database subnets. The cloud architect attaches the Lambda function to the VPC, selecting two private subnets across two AZs and attaching a security group that allows outbound traffic on TCP port 5432 to the Aurora security group.",
  "examFocus": "Understand modern Lambda VPC networking: (1) AWS Hyperplane ENIs: AWS creates and manages shared Elastic Network Interfaces for each unique Subnet + Security Group combination when the function is created/updated (eliminating old per-invocation ENI cold start penalties). (2) IAM Permissions: The function's execution role MUST include the `AWSLambdaVPCAccessExecutionRole` managed policy (actions: `ec2:CreateNetworkInterface`, `ec2:DescribeNetworkInterfaces`, `ec2:DeleteNetworkInterface`). (3) Internet access is NOT available by default upon VPC attachment.",
  "keyPoints": [
    "Enables Lambda to access private VPC resources including Amazon RDS, ElastiCache, Amazon EFS, and internal microservices.",
    "Uses AWS Hyperplane architecture to share ENIs across execution environments with identical subnet/security group configurations.",
    "Eliminates historic cold start latency penalties for VPC-connected Lambda functions.",
    "Requires the 'AWSLambdaVPCAccessExecutionRole' IAM policy attached to the function's execution role.",
    "Should always be configured with subnets in at least two Availability Zones for high availability.",
    "By default, attaching a function to a VPC removes its access to the public internet unless NAT Gateway or VPC endpoints are configured."
  ],
  "commonMistake": "Attaching a Lambda function directly to a public subnet expecting it to have public internet access. Lambda functions cannot use public IP addresses; to reach the internet, Lambda must be placed in a private subnet with a route to a NAT Gateway located in a public subnet.",
  "example": "Configure a Lambda function for VPC integration using the AWS CLI: aws lambda update-function-configuration --function-name db-reader --vpc-config SubnetIds=subnet-11111111,subnet-22222222,SecurityGroupIds=sg-12345678.",
  "sources": [
    {
      "title": "Configuring a Lambda Function to Access Resources in a VPC",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html"
    },
    {
      "title": "Improved VPC Networking for AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/foundation-networking.html"
    }
  ]
});
