import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-8',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'AWS Config Custom Rules',
  status: 'ready',
  plainEnglish: 'AWS Config Custom Rules are user-defined compliance rules created using AWS Lambda functions or Guard DSL (Domain Specific Language). When standard AWS Managed Rules do not cover your organization\'s unique business logic or custom compliance requirements, you write a Lambda function or Guard policy that receives configuration change events from AWS Config, evaluates the resource properties, and returns the compliance status back to AWS Config.',
  whyItMatters: 'Custom rules allow enterprises to enforce internal policies—such as checking for specific mandatory tags, enforcing proprietary corporate naming conventions, or evaluating custom software settings—automatically across their cloud infrastructure.',
  workplaceExample: 'A healthcare provider requires every EC2 instance to have three mandatory cost-center tags (Environment, CostCenter, Owner) and run a specific approved AMI ID. They deploy an AWS Config Custom Rule backed by an AWS Lambda function that checks incoming EC2 configuration items against these custom corporate tagging standards.',
  examFocus: 'SAA-C03 rule of thumb:\n- Standard AWS best practice checks -> Use Managed Rules.\n- Custom business logic, internal naming rules, or proprietary compliance checks -> Use Custom Rules (backed by AWS Lambda or Guard).',
  keyPoints: [
    'Created using custom AWS Lambda functions or AWS CloudFormation Guard DSL.',
    'Evaluates custom compliance requirements not covered by Managed Rules.',
    'Triggers on configuration changes (event-driven) or periodic schedules (1h, 3h, 6h, 12h, 24h).',
    'Lambda function uses PutEvaluations API to report COMPLIANT or NON_COMPLIANT status back to AWS Config.',
    'Requires granting AWS Config permission to invoke the backing Lambda function.'
  ],
  commonMistake: 'Using a Custom Rule when a Managed Rule already exists. Always check the AWS Config Managed Rules library before building a custom Lambda function.',
  example: 'Lambda-backed Custom Rule Handler (Node.js snippet):\n`exports.handler = async (event) => {\n  const configItem = JSON.parse(event.invokingEvent).configurationItem;\n  const isCompliant = configItem.tags && configItem.tags.CostCenter;\n  return await config.putEvaluations({ ... });\n};`',
  sources: [
    { title: 'Developing Custom Rules for AWS Config', url: 'https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config_develop-rules.html' }
  ]
});
