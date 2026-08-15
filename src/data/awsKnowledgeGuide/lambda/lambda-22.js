import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-22",
  "title": "Lambda Cold Starts",
  "plainEnglish": "A Lambda Cold Start is the initial latency delay experienced when a function is invoked and AWS Lambda must create a brand-new execution environment from scratch. During a cold start, Lambda downloads your deployment package or container image, starts the microVM runtime, and executes static initialization code outside your handler before your actual function handler executes. Subsequent requests routed to this active environment are 'warm starts' and execute instantly.",
  "whyItMatters": "While warm invocations take single-digit milliseconds, cold starts can introduce hundreds of milliseconds (or several seconds for heavy runtimes like Java or .NET with massive dependencies) of additional latency. In user-facing web applications, minimizing cold start duration is critical for maintaining snappy interactive response times.",
  "workplaceExample": "An API Gateway microservice running on Java 21 exhibits 3-second cold starts when scaling up during sudden traffic spikes. The engineering team enables AWS Lambda SnapStart for Java. SnapStart initializes the function ahead of time, takes a firecracker snapshot of the initialized memory and disk, and caches it, reducing cold start latency from 3,200 milliseconds down to 180 milliseconds.",
  "examFocus": "Understand cold start optimization techniques: (1) Minimize deployment package size (strip unused dependencies and imports). (2) Optimize initialization code outside the handler (lazy load heavy libraries). (3) Increase memory (gives more CPU to speed up initialization). (4) Use Provisioned Concurrency to pre-warm environments. (5) Use AWS Lambda SnapStart for supported Java runtimes. (6) Choose lightweight compiled runtimes like Rust/Go or lightweight interpreted runtimes like Node.js/Python.",
  "keyPoints": [
    "Occurs when Lambda initializes a new execution environment (microVM) to handle a request.",
    "Comprises two phases: environment setup (downloading package, starting runtime) and function initialization (executing static code outside the handler).",
    "Warm starts reuse existing initialized environments and bypass the cold start phase entirely.",
    "SnapStart accelerates Java functions by restoring initialized microVM memory snapshots from an encrypted cache.",
    "Provisioned Concurrency eliminates cold starts completely by keeping a pool of initialized environments ready 24/7.",
    "X-Ray tracing breaks down initialization duration (`Initialization` subsegment) versus handler execution duration."
  ],
  "commonMistake": "Writing heavyweight database connections, full schema downloads, or massive file parsers inside the handler function instead of outside in the initialization block. Code outside the handler runs once during cold start and is reused across all warm invocations.",
  "example": "Optimize initialization code by declaring shared database clients outside the handler function: const { DynamoDBClient } = require('@aws-sdk/client-dynamodb'); const client = new DynamoDBClient({}); exports.handler = async (event) => { /* use client here */ };.",
  "sources": [
    {
      "title": "Understanding the Lambda Execution Environment Lifecycle",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html"
    },
    {
      "title": "Reducing Startup Latency with Lambda SnapStart",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html"
    }
  ]
});
