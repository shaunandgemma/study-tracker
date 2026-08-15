import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-17',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'Parameter Store Integration with Applications',
  status: 'ready',
  plainEnglish: 'Parameter Store Integration with Applications enables containerized workloads (ECS, EKS), serverless functions (AWS Lambda), compute instances (EC2), and Infrastructure as Code templates (AWS CloudFormation) to reference Parameter Store parameters directly at deployment or runtime. This eliminates hardcoded environment settings across infrastructure templates.',
  whyItMatters: 'Injecting parameters directly into application runtimes or infrastructure templates ensures consistent configuration across environments without modifying code packages or storing plaintext secrets in Git repositories.',
  workplaceExample: 'An AWS Lambda function retrieves database credentials from Parameter Store at startup. An ECS Task Definition injects `/app/prod/db-url` directly into container environment variables using the `valueFrom` syntax.',
  examFocus: 'SAA-C03 Integration Patterns:\n- AWS CloudFormation: Reference parameters dynamically using `{{resolve:ssm:/path/key}}` or `{{resolve:ssm-secure:/path/key:version}}`.\n- Amazon ECS Task Definitions: Inject parameters as container environment variables using `secrets: [{ name: "DB_PASS", valueFrom: "arn:aws:ssm:..." }]`.\n- AWS Lambda: Cache retrieved parameter values in global function handler scope to reduce per-invocation SSM API calls.',
  keyPoints: [
    'Integrates natively with CloudFormation, ECS, EKS, Lambda, and EC2.',
    'CloudFormation uses dynamic references (`{{resolve:ssm:...}}`) to inject parameters at stack deployment.',
    'ECS container task definitions inject parameters into container environment variables at launch.',
    'Lambda functions should cache retrieved parameters outside the handler to optimize performance.',
    'Prevents credential leakage into Git repositories or container image layers.'
  ],
  commonMistake: 'Fetching Parameter Store values inside the main execution handler of a Lambda function on every single invocation instead of caching the parameter value in global scope.',
  example: 'Referencing a Parameter Store Value in AWS CloudFormation:\nParameters:\n  DBPassword:\n    Type: \'AWS::SSM::Parameter::Value<String>\'\n    Default: \'/study-tracker/dev/database/password\'',
  sources: [
    { title: 'Referencing Systems Manager parameters in CloudFormation and applications', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-integrations.html' }
  ]
});
