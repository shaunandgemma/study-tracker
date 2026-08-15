import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-14",
  "title": "Lambda Runtime",
  "plainEnglish": "A Lambda Runtime is the language-specific execution environment that runs inside the microVM to execute your function code. The runtime manages communications between the Lambda service and your function handler, retrieving invocation events via the Lambda Runtime API, passing parameters to your handler function, and returning the response or error output back to AWS Lambda.",
  "whyItMatters": "The runtime dictates the programming language version, standard libraries, execution lifecycle, startup performance, and security patches available to your function. Choosing between AWS managed runtimes (Node.js, Python, Java, .NET) and Custom Runtimes (C++, Rust, Go, PHP) gives developers flexibility to balance ease of maintenance against specialized execution requirements.",
  "workplaceExample": "A high-performance algorithmic trading platform builds ultra-low-latency microservices in Rust. Because Rust is not a managed runtime, the developers compile their code to an executable named `bootstrap`, package it using the `provided.al2023` Custom Runtime, and run lightweight, sub-5-millisecond cold start executions on AWS Lambda.",
  "examFocus": "Understand runtime types and lifecycles: (1) Managed Runtimes (Node.js, Python, Java, Ruby, .NET): Fully managed and patched by AWS. (2) Custom Runtimes (provided.al2023 / provided.al2): Uses a custom `bootstrap` executable implementing the Lambda Runtime API. (3) CPU Architectures: x86_64 and Arm64 (AWS Graviton2). (4) Runtime deprecation: AWS deprecates old language versions; existing functions run, but new updates require supported runtimes.",
  "keyPoints": [
    "Provides the language environment and interfaces with the Lambda Runtime API.",
    "Managed runtimes are maintained and security-patched automatically by AWS.",
    "Custom runtimes (using 'provided.al2023' or 'provided.al2') allow running any programming language via a 'bootstrap' binary.",
    "Supports both x86_64 and Arm64 (AWS Graviton2) processor architectures, with Graviton offering up to 34% better price-performance.",
    "The runtime execution lifecycle consists of three distinct phases: Init (extension/runtime init), Invoke (handler run), and Shutdown.",
    "Deprecation policy: AWS gives notice when language runtimes reach end-of-life, eventually blocking new function creations with deprecated runtimes."
  ],
  "commonMistake": "Ignoring runtime deprecation notices. While deprecated runtimes generally continue executing existing functions, you will eventually be blocked from creating new functions or updating existing function code until you upgrade to a supported runtime.",
  "example": "Update a Lambda function runtime to Python 3.12 with Arm64 Graviton architecture using the AWS CLI: aws lambda update-function-configuration --function-name order-processor --runtime python3.12 --architectures arm64.",
  "sources": [
    {
      "title": "AWS Lambda Runtimes",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html"
    },
    {
      "title": "Custom AWS Lambda Runtimes",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html"
    }
  ]
});
