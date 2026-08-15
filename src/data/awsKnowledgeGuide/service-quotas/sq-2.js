import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-service-quotas",
  "topicTitle": "AWS Service Quotas",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "sq-2",
  "title": "Regional vCPU & Concurrency Limits",
  "plainEnglish": "A virtual central processing unit (vCPU) quota limits how much Amazon Elastic Compute Cloud (Amazon EC2) instance processing capacity an account can run in a Region for a documented purchasing-option or instance-family group. AWS Lambda concurrency is the number of function requests being processed at the same time, and functions draw from an account-level Regional concurrency quota subject to function-level controls and scaling behavior.",
  "whyItMatters": "Auto Scaling can request more compute but cannot cross the relevant applied quota. EC2 launch requests can fail at a vCPU ceiling, while Lambda invocations can be throttled when concurrency is unavailable. Both must be sized from tested workload demand before a traffic event or failover.",
  "workplaceExample": "Before a seasonal launch, an engineering team load-tests its worker fleet and functions in the target account and Region. It converts the maximum EC2 instance plan into vCPUs for the correct quota group, measures Lambda concurrent executions, adds documented growth and recovery demand, and compares both calculations with the applied values rather than relying on published defaults.",
  "examFocus": "EC2 On-Demand and Spot quotas are commonly expressed in Regional vCPUs for documented groups; Lambda uses Regional account concurrency with reserved and provisioned concurrency controls. A quota increase raises the permitted ceiling but does not reserve EC2 hardware. InsufficientInstanceCapacity is a capacity shortage, not proof of a quota failure.",
  "keyPoints": [
    "EC2 instance quotas must be checked for the correct Region, purchasing option, and instance group.",
    "Calculate EC2 demand from each planned instance count multiplied by that instance type's vCPUs.",
    "Lambda concurrency counts in-flight requests and is shared at the account and Region level unless controls allocate or limit it.",
    "Reserved concurrency protects and caps capacity for a function; provisioned concurrency pre-initializes environments to reduce startup latency.",
    "Lambda concurrency exhaustion can cause throttling, for which client retry behavior depends on the invocation model.",
    "A hard EC2 quota failure is not fixed by repeated retries; usage must fall or the applied quota must increase.",
    "An EC2 capacity error can occur even when the vCPU quota has headroom because quotas do not reserve physical capacity.",
    "Monitor supported EC2 usage and Lambda concurrency metrics with thresholds that leave enough operational response time."
  ],
  "commonMistake": "Treating every EC2 launch failure as a quota problem leads to the wrong response. Check the exact error, applied quota and current usage: a quota-exceeded error requires quota or usage action, whereas insufficient physical capacity requires the documented capacity troubleshooting options.",
  "example": "For each target Region, list planned EC2 instance types and counts, calculate total vCPUs within each relevant quota group, and include current usage plus failover and forecast demand. Separately estimate Lambda concurrency from load-test arrival rate and average duration, compare it with the account's current Regional quota and allocations, and validate both applied values before allowing the scaling change.",
  "sources": [
    {
      "title": "Amazon EC2 service quotas",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html"
    },
    {
      "title": "Understanding Lambda function scaling and concurrency",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"
    },
    {
      "title": "Troubleshoot Amazon EC2 instance launch issues",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/troubleshooting-launch.html"
    },
    {
      "title": "Monitoring Lambda concurrency",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-concurrency.html"
    }
  ]
});
