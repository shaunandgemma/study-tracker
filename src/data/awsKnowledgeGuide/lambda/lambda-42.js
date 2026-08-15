import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-42",
  "title": "Lambda vs EC2",
  "plainEnglish": "AWS Lambda and Amazon Elastic Compute Cloud (Amazon EC2) represent two distinct compute paradigms on AWS. AWS Lambda is a serverless, event-driven compute service where code runs in ephemeral microVMs for up to 15 minutes, billed strictly by execution milliseconds with zero server administration. Amazon EC2 provides dedicated virtual servers with full root operating system control, persistent local storage, custom networking, and uninterrupted continuous execution.",
  "whyItMatters": "Selecting between Lambda and EC2 determines your operational maintenance burden, architectural flexibility, and infrastructure cost. Lambda eliminates server management and scales seamlessly from zero for bursty, event-driven workloads. EC2 provides full low-level OS customization, persistent GPU/hardware support, and predictable pricing for 24/7 steady-state monolithic workloads.",
  "workplaceExample": "A software company uses both compute models across their platform: Amazon EC2 instances run a legacy Windows-based ERP system that requires custom OS device drivers and continuous 24/7 TCP connections. Concurrently, AWS Lambda functions handle all event-driven microservices, image resizing, and asynchronous webhook processing, scaling automatically from 0 to 5,000 invocations during flash sales without paying for idle server capacity.",
  "examFocus": "Compare Lambda vs EC2 for AWS certification exams: (1) Administration: Lambda = Fully serverless, automated patching/scaling; EC2 = Customer manages OS patching, AMI maintenance, Auto Scaling, and security agents. (2) Execution Duration: Lambda = Maximum 15 minutes (900s); EC2 = Unlimited continuous runtime. (3) Pricing: Lambda = Pay per request and execution duration; EC2 = Pay per instance-hour/second (Savings Plans, Reserved Instances, Spot). (4) Control: EC2 provides root access and custom kernel modules; Lambda runs on managed sandboxes.",
  "keyPoints": [
    "AWS Lambda provides serverless, event-driven execution with zero server management.",
    "Amazon EC2 provides full virtual machine control with root access and custom OS configurations.",
    "Lambda execution timeout is capped at 15 minutes; EC2 instances can run indefinitely.",
    "Lambda scales automatically from 0 to thousands of concurrent executions in milliseconds.",
    "EC2 requires configuring Auto Scaling Groups, launch templates, and scaling policies.",
    "Lambda is ideal for short-lived, bursty event processing; EC2 is ideal for long-running stateful services or GPU workloads."
  ],
  "commonMistake": "Assuming Lambda is always cheaper than EC2. For steady-state 24/7 workloads with consistently high CPU utilization, running properly sized EC2 instances (especially with Reserved Instances or Savings Plans) can be significantly more economical than high-volume Lambda executions.",
  "example": "Choose AWS Lambda for processing incoming Amazon S3 file upload events in under 30 seconds; choose Amazon EC2 (or EC2 Spot) for running an 8-hour distributed molecular dynamics simulation requiring custom kernel modules and GPU acceleration.",
  "sources": [
    {
      "title": "Serverless Architectures with AWS Lambda",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/serverless-architectures-lambda/serverless-architectures-lambda.html"
    },
    {
      "title": "Amazon EC2 Concepts and Getting Started",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html"
    }
  ]
});
