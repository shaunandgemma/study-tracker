import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cdk-12",
  "topicId": "topic-cdk",
  "topicTitle": "AWS CDK (Cloud Development Kit)",
  "objectiveCode": "Management",
  "title": "CDK Synthesis to CloudFormation",
  "status": "ready",
  "plainEnglish": "CDK Synthesis (`cdk synth`) is the compilation step in the AWS CDK workflow that executes your programming code and transforms your constructs and stacks into a directory of deployment artifacts known as a Cloud Assembly (written to the `cdk.out` directory). This assembly includes standard JSON/YAML AWS CloudFormation templates for each stack, along with asset manifests for Lambda code bundles and container images.",
  "whyItMatters": "Synthesis provides a critical validation and review boundary before anything touches your AWS account. It catches programming syntax bugs, circular dependency errors, and type mismatches locally on the developer machine, allowing you to run security scanning tools (like cfn-nag or cdk-nag) against the generated CloudFormation template prior to deployment.",
  "workplaceExample": "A CI/CD pull-request pipeline runs `cdk synth` followed by `cdk diff`. The automated security scanner inspects the synthesized CloudFormation JSON in `cdk.out/` to verify that all S3 buckets have public access blocked and that all KMS keys have rotation enabled before allowing the pull request to merge into the main branch.",
  "examFocus": "For SAA-C03, remember the CDK CLI lifecycle commands: (1) `cdk init` (initializes a new project template), (2) `cdk bootstrap` (deploys initial bootstrap stack in account/region), (3) `cdk synth` (synthesizes CDK code into CloudFormation templates in `cdk.out`), (4) `cdk diff` (compares local synthesized template against live deployed stack), and (5) `cdk deploy` (deploys the synthesized stack via CloudFormation).",
  "keyPoints": [
    "Executes CDK application code and outputs a Cloud Assembly in the `cdk.out` folder.",
    "Generates standard AWS CloudFormation JSON/YAML templates for each defined Stack.",
    "Does NOT create, modify, or provision any actual AWS resources.",
    "Enables local template inspection, security scanning (cdk-nag), and automated linting in CI/CD.",
    "`cdk diff` compares the synthesized template with the currently deployed CloudFormation stack."
  ],
  "commonMistake": "Thinking `cdk synth` provisions resources in your AWS account. `cdk synth` is purely a local compilation step that produces CloudFormation templates; `cdk deploy` is required to submit the synthesized template to CloudFormation for deployment.",
  "example": "# Synthesize CloudFormation templates from CDK app:\ncdk synth\n\n# Compare synthesized local stack with deployed stack in AWS:\ncdk diff WebAppStack\n\n# Deploy the synthesized stack through CloudFormation:\ncdk deploy WebAppStack",
  "sources": [
    {
      "title": "Configuring and Performing CDK Stack Synthesis",
      "url": "https://docs.aws.amazon.com/cdk/v2/guide/configure-synth.html"
    },
    {
      "title": "AWS CDK CLI Command Reference (cdk synth)",
      "url": "https://docs.aws.amazon.com/cdk/v2/guide/ref-cli-cmd-synth.html"
    },
    {
      "title": "Your First AWS CDK Application",
      "url": "https://docs.aws.amazon.com/cdk/v2/guide/hello-world.html"
    }
  ]
});
