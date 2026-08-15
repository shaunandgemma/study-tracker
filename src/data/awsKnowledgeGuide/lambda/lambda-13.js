import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-13",
  "title": "Lambda Layers",
  "plainEnglish": "A Lambda Layer is a distribution mechanism for libraries, custom runtimes, binary dependencies, or configuration files that can be shared across multiple Lambda functions. Instead of bundling heavy third-party dependencies (like NumPy, Pandas, or the AWS SDK) into every single function's ZIP deployment package, you package the dependencies into a Layer once and attach that Layer to any number of functions.",
  "whyItMatters": "Including large external libraries in individual function packages inflates deployment sizes, slows down CI/CD build pipelines, and makes dependency patching tedious across microservices. Layers promote code reuse, keep function ZIP packages small and fast to deploy (enabling inline editing in the AWS Console), and standardize common utilities across an organization.",
  "workplaceExample": "A data engineering department maintains 25 Python Lambda functions that all require `pandas`, `numpy`, and a proprietary database connector module. Instead of packaging a 60 MB ZIP file for each of the 25 functions, they build a single shared Lambda Layer containing these packages, attaching the Layer to all 25 functions and reducing each function's code package to under 50 KB.",
  "examFocus": "Know the rules and limits for Lambda Layers: (1) A single function can use up to 5 layers at a time. (2) Total uncompressed deployment size (function code + all attached layers) cannot exceed the 250 MB limit. (3) Layers are extracted into the `/opt` directory of the execution environment. (4) Order matters: layers are extracted in order, potentially overriding files with the same name.",
  "keyPoints": [
    "A ZIP archive containing libraries, custom runtimes, or dependencies shared across functions.",
    "A function can attach up to 5 layers simultaneously.",
    "Extracted to the `/opt` directory in the Lambda execution environment at initialization time.",
    "The total uncompressed size of the function package plus all attached layers cannot exceed 250 MB.",
    "Layers can be shared across AWS accounts or made publicly accessible via Layer permissions (AddLayerVersionPermission).",
    "Layers do not provide a security isolation boundary; code in layers runs with the function's execution role permissions."
  ],
  "commonMistake": "Thinking that Lambda Layers bypass the 250 MB uncompressed deployment package size quota. The combined size of the function code plus all attached layers must still adhere to the 250 MB uncompressed limit.",
  "example": "Publish a Python dependency layer and attach it to a function using the AWS CLI: aws lambda publish-layer-version --layer-name common-utils --zip-file fileb://utils-layer.zip --compatible-runtimes python3.11 python3.12, then update the function with --layers arn:aws:lambda:...:layer:common-utils:1.",
  "sources": [
    {
      "title": "Working with Lambda Layers",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html"
    },
    {
      "title": "Creating and Sharing Lambda Layers",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/creating-deleting-layers.html"
    }
  ]
});
