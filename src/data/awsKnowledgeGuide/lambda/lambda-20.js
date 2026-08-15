import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-20",
  "title": "Provisioned Concurrency",
  "plainEnglish": "Provisioned Concurrency is an AWS Lambda feature that pre-initializes a requested number of execution environments in advance, keeping them warm and ready to respond to invocations instantly with double-digit millisecond latency. Unlike standard on-demand scaling where new execution environments must undergo a cold start (downloading code and running initialization scripts), provisioned environments handle incoming requests with zero cold start delay.",
  "whyItMatters": "For latency-critical interactive applications (such as financial trading APIs, retail checkouts, or mobile gaming backends), a cold start delay of 500ms to several seconds can degrade user experience and violate service level agreements (SLAs). Provisioned Concurrency eliminates cold start latency entirely for high-priority production traffic.",
  "workplaceExample": "An online ticketing platform anticipates a massive surge of 20,000 users at 10:00 AM for concert ticket sales. To prevent cold start latency from degrading the checkout API, the DevOps team configures Application Auto Scaling on the `PROD` alias with a scheduled action that ramps Provisioned Concurrency up to 500 at 9:55 AM, then scales it back down at 11:00 AM.",
  "examFocus": "Understand Provisioned Concurrency configuration: (1) Applied to published versions or aliases (CANNOT be configured on `$LATEST`). (2) Eliminates cold starts by pre-running runtime and function initialization code. (3) Integrates with Application Auto Scaling (Target Tracking based on ProvisionedConcurrencyUtilization or Scheduled Scaling). (4) Billed for the duration provisioned plus standard execution charges.",
  "keyPoints": [
    "Pre-warms execution environments to eliminate cold start latency for latency-sensitive applications.",
    "Can only be allocated to published function versions or aliases (not applicable to $LATEST).",
    "Runs runtime initialization and static code outside the handler before any request is received.",
    "Integrates with Application Auto Scaling to dynamically adjust provisioned environments based on utilization metrics or schedules.",
    "If incoming traffic exceeds the provisioned amount, excess requests spill over to standard on-demand execution environments.",
    "Incurs an additional hourly charge per allocated provisioned concurrency unit in addition to standard request costs."
  ],
  "commonMistake": "Attempting to attach Provisioned Concurrency to the unqualified `$LATEST` function version. Provisioned Concurrency requires a qualified ARN pointing to a specific published version or an alias.",
  "example": "Allocate 50 provisioned concurrency units to the 'PROD' alias using the AWS CLI: aws lambda put-provisioned-concurrency-config --function-name ticket-api --qualifier PROD --provisioned-concurrent-executions 50.",
  "sources": [
    {
      "title": "Configuring Provisioned Concurrency for a Function",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html"
    },
    {
      "title": "Scaling Provisioned Concurrency with Application Auto Scaling",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html#configuration-concurrency-provisioned"
    }
  ]
});
