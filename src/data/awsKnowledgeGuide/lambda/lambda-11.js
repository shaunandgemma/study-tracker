import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-11",
  "title": "Lambda Aliases",
  "plainEnglish": "A Lambda Alias is a named, mutable pointer that references a specific published version (or `$LATEST`) of a Lambda function. Unlike versions (which are immutable numbers), an alias has a friendly name (such as `prod`, `stage`, or `dev`) that can be updated to point to different versions over time without changing the ARN referenced by event sources like Amazon API Gateway.",
  "whyItMatters": "Hardcoding version numbers into event triggers requires reconfiguring API Gateway, EventBridge, or S3 triggers every time you deploy a new version. With aliases, event sources point to the stable alias ARN (e.g., `my-function:PROD`), and updating production is as simple as repointing the alias from Version 1 to Version 2. Aliases also enable safe canary and blue/green deployments by splitting traffic between two versions.",
  "workplaceExample": "A DevOps team creates an alias named `PROD` pointing to Version 3. When deploying Version 4, they use AWS CodeDeploy to configure a Canary deployment on the `PROD` alias: 10% of incoming production traffic is routed to Version 4 for 10 minutes while CloudWatch Alarms monitor error rates. If no errors occur, the alias shifts 100% of traffic to Version 4 automatically.",
  "examFocus": "Understand Lambda Alias routing capabilities: (1) An alias is a mutable pointer to a version. (2) Aliases support Weighted Routing (traffic shifting) between two versions (e.g., 90% to Version 1, 10% to Version 2), enabling canary/blue-green deployments. (3) Aliases have distinct ARNs: `arn:aws:lambda:region:account:function:my-function:PROD` and can have their own Provisioned Concurrency configurations.",
  "keyPoints": [
    "An alias is a named, mutable pointer (e.g., 'PROD', 'STAGE', 'DEV') referencing a specific function version.",
    "Provides a stable ARN for event sources (API Gateway, SQS, S3) that does not change when deploying new versions.",
    "Supports Weighted Traffic Shifting between two published versions for canary and blue/green release strategies.",
    "Integrates with AWS CodeDeploy for automated linear and canary traffic shifting with CloudWatch alarm rollbacks.",
    "Provisioned Concurrency can be allocated directly to an alias to ensure warm execution environments for production traffic.",
    "Aliases cannot point directly to another alias; an alias must point to a published version or $LATEST."
  ],
  "commonMistake": "Attempting to configure weighted traffic shifting between a published version and `$LATEST`. Weighted routing can only split traffic between two PUBLISHED immutable versions; `$LATEST` cannot be used as the secondary routing target.",
  "example": "Create an alias named 'PROD' pointing to version 2 with 10% canary traffic routed to version 3: aws lambda create-alias --function-name order-api --name PROD --function-version '2' --routing-config 'AdditionalVersionWeights={\"3\":0.10}'.",
  "sources": [
    {
      "title": "Lambda Function Aliases",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html"
    },
    {
      "title": "Deploying Lambda Function Aliases with AWS CodeDeploy",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/automating-deployment.html"
    }
  ]
});
