import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-7",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "Lambda Function Recommendations",
  "status": "ready",
  "plainEnglish": "Lambda Function Recommendations in AWS Compute Optimizer analyze the historical invocation duration, memory usage, and CPU performance of your serverless AWS Lambda functions. Because AWS Lambda allocates CPU and network bandwidth proportionally to the memory size you configure (from 128 MB to 10,240 MB), Compute Optimizer models how increasing or decreasing memory affects both execution execution time (duration in milliseconds) and total cost per invocation.",
  "whyItMatters": "In AWS Lambda, counterintuitively, adding more memory often speeds up execution so significantly that total billing cost decreases (because you pay for `Gigabyte-Seconds`). Compute Optimizer runs machine learning simulations to discover the sweet spot where execution speed and cost efficiency intersect.",
  "workplaceExample": "A high-throughput API gateway invokes a Lambda function 50 million times per month configured with 512 MB memory (taking 800ms per run). Compute Optimizer recommends increasing memory to 1024 MB. The extra CPU reduces execution time to 250ms, resulting in faster API responses and a 20% drop in monthly Lambda billing.",
  "examFocus": "For SAA-C03, know that Compute Optimizer evaluates Lambda function memory configurations. It requires at least 50 invocations over the 14-day analysis period before generating recommendations. It classifies functions as Optimized or NotOptimized and details projected execution duration and cost changes.",
  "keyPoints": [
    "Analyzes invocation count, duration, and memory utilization across AWS Lambda functions.",
    "Requires a minimum of 50 invocations over the 14-day lookback period to generate recommendations.",
    "Models the trade-off between allocated memory, execution duration, and total cost.",
    "Can recommend increasing memory to reduce execution duration and lower overall invocation cost.",
    "Categorizes functions as Optimized or NotOptimized."
  ],
  "commonMistake": "Setting Lambda memory to the absolute minimum (128 MB) under the false assumption that less memory always equals lower cost. Lower memory allocates less vCPU, causing compute-heavy code to run much longer and cost more.",
  "example": "# Get Lambda function recommendations:\naws compute-optimizer get-lambda-function-recommendations \\\n  --function-arns arn:aws:lambda:us-east-1:123456789012:function:OrderProcessingFunction \\\n  --query 'lambdaFunctionRecommendations[0].recommendationOptions[*].[configuration.memorySize,projectedUtilizationMetrics]'",
  "sources": [
    {
      "title": "Viewing Lambda Function Recommendations in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-lambda-recommendations.html"
    },
    {
      "title": "Lambda Metrics Analyzed by AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/metrics-analyzed.html#lambda-metrics-analyzed"
    }
  ]
});
