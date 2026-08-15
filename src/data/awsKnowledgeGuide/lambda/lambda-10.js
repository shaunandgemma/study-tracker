import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-10",
  "title": "Lambda Function Versions",
  "plainEnglish": "A Lambda Function Version is an immutable snapshot of your Lambda function's code and configuration (including memory, runtime, environment variables, layers, and timeout) at a specific point in time. When you publish a version, AWS Lambda assigns it a sequential numeric identifier (e.g., Version 1, Version 2) that can never be modified or overwritten.",
  "whyItMatters": "Working directly on the default `$LATEST` version in production is dangerous because any new code push immediately changes the live running code, potentially breaking production traffic. Publishing immutable versions allows teams to preserve stable builds, maintain distinct development, staging, and production environments, and safely roll back in case of errors.",
  "workplaceExample": "A continuous delivery (CI/CD) pipeline runs automated unit tests on the `$LATEST` branch of a payment processing function. When tests pass, the pipeline calls `PublishVersion`, creating immutable Version 4. The pipeline points a testing alias to Version 4 for integration tests before promoting it to production.",
  "examFocus": "Understand the difference between `$LATEST` and numbered versions: (1) `$LATEST` is the mutable, working copy of the function code and configuration. (2) Published versions (1, 2, 3...) are permanently IMMUTABLE; once published, their code, environment variables, and settings cannot be edited. (3) Versions have unique ARNs: `arn:aws:lambda:region:account:function:my-function:1`.",
  "keyPoints": [
    "A version is an immutable snapshot of code and configuration at the time of publication.",
    "`$LATEST` is the default, mutable development version where active edits are made.",
    "Published versions receive sequential numbers (1, 2, 3...) and cannot be modified or re-uploaded.",
    "Each version has a unique, qualified Amazon Resource Name (ARN) ending with the version number.",
    "Qualified version ARNs can be invoked directly or referenced by Lambda Aliases.",
    "Deleting the function deletes all published versions; individual versions can also be deleted independently."
  ],
  "commonMistake": "Pointing production triggers directly to `$LATEST`. If a developer pushes untested code to `$LATEST`, it immediately affects production traffic; production systems should always point to a published version via a Lambda Alias.",
  "example": "Publish a new immutable version from `$LATEST` using the AWS CLI: aws lambda publish-version --function-name payment-processor --description 'Production Release v2.1'.",
  "sources": [
    {
      "title": "Lambda Function Versions",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-versions.html"
    },
    {
      "title": "Managing Function Code and Versions",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/versioning-intro.html"
    }
  ]
});
