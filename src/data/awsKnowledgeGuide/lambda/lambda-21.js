import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-21",
  "title": "Lambda Scaling",
  "plainEnglish": "AWS Lambda Scaling is the automated mechanism by which the Lambda service instantiates and tears down function execution environments in direct response to fluctuations in incoming traffic. As request volumes grow, Lambda automatically spins up new isolated instances of your function; when traffic subsides, inactive environments are quietly decommissioned.",
  "whyItMatters": "Unlike traditional compute fleets that require complex Auto Scaling groups, health check thresholds, and several minutes to boot new server instances, AWS Lambda scales horizontally within milliseconds. Understanding scaling rates and burst capacities ensures that high-volume architectures handle sudden traffic spikes without experiencing unexpected throttling.",
  "workplaceExample": "A national tax-filing website receives a sudden burst of 5,000 document uploads per minute on the tax deadline. AWS Lambda automatically scales from 10 active execution environments to 1,000 concurrent environments within seconds, processing all uploads in parallel without requiring server provisioning or manual scaling interventions.",
  "examFocus": "Understand modern Lambda scaling behaviors: (1) Initial Burst Limit: Immediate scaling capacity (ranging from 500 to 3,000 concurrent executions depending on the AWS Region). (2) Scaling Rate: Beyond the initial burst, functions scale at a rate of 1,000 additional concurrent executions every minute until the account limit is reached. (3) Request Throttling: When incoming request concurrency exceeds available scaling capacity or limits, Lambda returns 429 throttling errors.",
  "keyPoints": [
    "Scales horizontally by spinning up an independent execution environment for each concurrent request.",
    "Provides an initial immediate burst concurrency limit between 500 and 3,000 depending on the AWS Region.",
    "Scales steadily beyond initial burst at an additional rate of 1,000 concurrent executions per minute.",
    "Scaling applies across all functions in an AWS account sharing the regional unreserved concurrency pool.",
    "Functions capped by Reserved Concurrency will scale up to their reserved limit and then throttle.",
    "CloudWatch metrics 'ConcurrentExecutions' and 'Throttles' provide real-time visibility into scaling dynamics."
  ],
  "commonMistake": "Assuming Lambda scales infinitely and instantaneously to any traffic spike. Lambda has regional burst limits and scaling rate caps (1,000 concurrent executions per minute after burst); massive instantaneous spikes exceeding burst capacity require Provisioned Concurrency.",
  "example": "Monitor function scaling concurrency in CloudWatch Metrics under AWS/Lambda namespace using the 'ConcurrentExecutions' metric aggregated by FunctionName.",
  "sources": [
    {
      "title": "Understanding Lambda Function Scaling",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/invocation-scaling.html"
    },
    {
      "title": "AWS Lambda Concurrency and Burst Limits",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"
    }
  ]
});
