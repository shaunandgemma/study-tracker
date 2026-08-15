import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-6',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'StringList Parameters',
  status: 'ready',
  plainEnglish: 'A `StringList` parameter is an unencrypted data type in Parameter Store that stores a comma-separated list of values as a single parameter entry (for example, `subnet-12345,subnet-67890,subnet-abcde`). When requested via AWS SDKs or CLI, Parameter Store handles parsing the comma-delimited strings into array structures for applications.',
  whyItMatters: 'Applications frequently require arrays of non-sensitive values, such as subnet IDs, IP whitelist ranges, or allowed CORS domains. Storing them as a `StringList` eliminates the need for developers to write custom string parsing code.',
  workplaceExample: 'A cloud architect stores a list of private VPC Subnet IDs at `/network/private-subnets` as a `StringList`. A CloudFormation template or Lambda script retrieves the parameter and automatically splits it into an array of subnet IDs.',
  examFocus: 'SAA-C03 StringList Characteristics:\n- Format: Comma-separated list of strings stored in a single parameter entry.\n- Unencrypted Storage: `StringList` values are stored as plain text without KMS encryption.\n- Max Size: Subject to the 4 KB Standard tier payload limit.',
  keyPoints: [
    'Stores comma-separated lists of values within a single parameter entry.',
    'Used for non-sensitive list configuration (e.g. subnet IDs, IP ranges, CORS domains).',
    'Values are stored unencrypted without KMS encryption.',
    'AWS SDKs automatically convert comma-delimited values into native array types.',
    'Subject to 4 KB payload limits under the Standard parameter tier.'
  ],
  commonMistake: 'Attempting to include commas within individual list item values without escaping them, breaking the `StringList` comma-delimited array structure.',
  example: 'Creating a StringList Parameter via AWS CLI:\naws ssm put-parameter --name "/network/private-subnets" --value "subnet-012345,subnet-67890a,subnet-bcedf1" --type "StringList"',
  sources: [
    { title: 'Creating Systems Manager StringList parameters', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/param-create-string.html' }
  ]
});
