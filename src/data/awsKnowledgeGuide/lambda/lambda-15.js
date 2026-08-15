import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-15",
  "title": "Lambda Memory and CPU Allocation",
  "plainEnglish": "In AWS Lambda, memory is the primary configuration knob that dictates both available RAM and proportional CPU processing power allocated to your function. You configure memory between 128 MB and 10,240 MB (10 GB) in 1 MB increments. As you allocate more memory, AWS Lambda proportionally increases the virtual CPU (vCPU) cores, memory bandwidth, and network throughput available to the execution environment.",
  "whyItMatters": "Because CPU power scales linearly with memory, increasing memory allocation can significantly reduce execution duration for compute-intensive workloads. In many cases, doubling memory cuts execution time by more than half, resulting in faster user response times and lower overall execution costs (the 'Lambda Power Tuning' paradox).",
  "workplaceExample": "A data processing team runs an image-compression Lambda function configured with 512 MB memory, taking 4,000 milliseconds per invocation (costing $0.000033). Using AWS Lambda Power Tuning, they test higher memory settings and discover that allocating 1,769 MB (1 full vCPU) reduces execution time to 600 milliseconds, costing only $0.000017 per invocation—making the function 6.6x faster and nearly 50% cheaper.",
  "examFocus": "Remember how Lambda allocates compute: (1) Memory is configurable from 128 MB to 10,240 MB in 1 MB increments. (2) You do NOT configure CPU directly; CPU scales linearly with memory. (3) At 1,769 MB of memory, a function receives the equivalent of 1 full vCPU; at 10,240 MB, up to 6 vCPUs are available for multi-threaded processing. (4) Use AWS Lambda Power Tuning to find the optimal balance between performance and cost.",
  "keyPoints": [
    "Memory is configurable from 128 MB to 10,240 MB (10 GB) in 1 MB increments.",
    "CPU, network throughput, and I/O bandwidth scale proportionally with the configured memory allocation.",
    "At 1,769 MB of memory, Lambda allocates the equivalent of 1 full dedicated vCPU.",
    "Functions configured with more than 1,769 MB can leverage multi-threading and multi-processing across up to 6 vCPUs.",
    "Increasing memory for CPU-bound tasks often decreases execution time enough to lower total execution cost.",
    "AWS Lambda Power Tuning is an open-source step function tool recommended by AWS to optimize memory configurations."
  ],
  "commonMistake": "Leaving all Lambda functions at the default 128 MB memory setting to 'save money'. For CPU-bound or multi-threaded code, 128 MB provides minimal CPU power, causing long execution times that end up costing more than higher memory tiers.",
  "example": "Adjust a function's memory allocation to 2,048 MB using the AWS CLI: aws lambda update-function-configuration --function-name image-processor --memory-size 2048.",
  "sources": [
    {
      "title": "Configuring Function Memory in AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-function-common.html#configuration-memory-console"
    },
    {
      "title": "Optimizing Lambda Performance and Cost",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html#function-configuration"
    }
  ]
});
