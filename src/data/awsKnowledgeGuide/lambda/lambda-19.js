import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-19",
  "title": "Reserved Concurrency",
  "plainEnglish": "Reserved Concurrency is a configuration setting that dedicates a specific portion of your AWS account's regional concurrency pool exclusively to an individual Lambda function. Setting reserved concurrency guarantees that the function will always have that allocated capacity available (preventing starvation from other functions) while simultaneously acting as a hard upper ceiling that caps the function's maximum scaling to protect downstream databases or external APIs.",
  "whyItMatters": "Without reserved concurrency, a single runaway function (e.g., an infinite recursion bug or sudden DDoS traffic) can consume all 1,000 concurrency slots in an account, taking down all other mission-critical functions in that Region. Conversely, a Lambda function connecting to an Amazon RDS PostgreSQL database can easily overwhelm the database with thousands of connections unless capped by reserved concurrency.",
  "workplaceExample": "A retail bank has an account-wide limit of 1,000 concurrent executions. They assign a Reserved Concurrency of 200 to their critical `process-wire-transfers` function (ensuring it can never be starved by marketing functions) and set a Reserved Concurrency of 30 on an `invoice-db-writer` function to ensure it never exceeds the connection pool limit of their RDS PostgreSQL instance.",
  "examFocus": "Understand the dual role of Reserved Concurrency: (1) Guarantee: Reserves dedicated capacity that cannot be used by any other function in the account. (2) Limit: Capping function concurrency so it cannot scale beyond the reserved amount. (3) Setting Reserved Concurrency to 0 acts as a kill switch, completely disabling all invocations for that function. (4) Dedicated amount is subtracted from the unreserved account pool (which must retain at least 100).",
  "keyPoints": [
    "Dedicates a guaranteed pool of concurrency exclusively to a specific Lambda function.",
    "Acts as a hard upper ceiling, preventing the function from scaling beyond the configured limit.",
    "Protects downstream resources (such as relational databases, RDS, or legacy third-party APIs) from being overwhelmed.",
    "Prevents a single function from monopolizing the account's unreserved concurrency pool.",
    "Setting Reserved Concurrency to 0 completely blocks all invocations, serving as an emergency kill-switch.",
    "Allocating reserved concurrency reduces the account's available unreserved pool, which requires at least 100 units free."
  ],
  "commonMistake": "Confusing Reserved Concurrency with Provisioned Concurrency. Reserved Concurrency guarantees capacity and caps scaling, but does NOT pre-warm execution environments (cold starts still occur). Provisioned Concurrency pre-warms environments to eliminate cold starts.",
  "example": "Allocate 150 reserved concurrency units to a function using the AWS CLI: aws lambda put-function-concurrency --function-name process-wire-transfers --reserved-concurrent-executions 150.",
  "sources": [
    {
      "title": "Managing Reserved Concurrency for a Lambda Function",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html#configuration-concurrency-reserved"
    },
    {
      "title": "AWS Lambda Concurrency Overview",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"
    }
  ]
});
