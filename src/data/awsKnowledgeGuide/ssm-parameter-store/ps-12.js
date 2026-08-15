import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-12',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'Advanced Parameters',
  status: 'ready',
  plainEnglish: 'Advanced Parameters are a paid tier in Parameter Store designed for enterprise workloads requiring larger payload sizes (up to 8 KB), higher total parameter volume (over 10,000 parameters per account), higher throughput, and automated Parameter Policies (such as setting an expiration date or generating CloudWatch Event notifications prior to expiration).',
  whyItMatters: 'Enterprise applications with complex XML/JSON configuration files or thousands of microservice parameters exceed Standard tier limits. Advanced Parameters unlock larger payloads and automated expiration policies.',
  workplaceExample: 'A software company stores a 6 KB JSON feature-flag file as an Advanced Parameter `/config/feature-flags.json`. They attach an Expiration policy to automatically invalidate temporary trial license keys after 30 days.',
  examFocus: 'SAA-C03 Advanced Parameter Tier Features & Pricing Rules:\n- Payload Size: Up to 8 KB per parameter (double the Standard tier limit).\n- Unlimited Scaling: Allows creating more than 10,000 parameters per account/region.\n- Parameter Policies: Supports Expiration (TTL deletion), ExpirationNotification (EventBridge alerts), and NoChangeNotification.\n- Billing Note: Charged per parameter per month; converting a Standard parameter to Advanced is not freely reversible.',
  keyPoints: [
    'Paid parameter tier providing enterprise capabilities and expanded limits.',
    'Increases maximum parameter payload size to 8 KB.',
    'Allows storing more than 10,000 parameters per AWS account and Region.',
    'Supports Parameter Policies (Expiration TTL and EventBridge Notifications).',
    'Converting a parameter to Advanced incurs monthly storage charges and cannot be downgraded back to Standard.'
  ],
  commonMistake: 'Converting a parameter to the Advanced tier without realizing that parameter tier changes incur monthly billing charges and cannot be converted back to Standard.',
  example: 'Creating an Advanced Parameter with an Expiration Policy via AWS CLI:\naws ssm put-parameter --name "/licenses/temporary-key" --value "example-value-not-a-secret" --type "SecureString" --tier "Advanced" --policies \'[{"Type":"Expiration","Version":"1.0","Attributes":{"Timestamp":"2026-12-31T23:59:59Z"}}]\'',
  sources: [
    { title: 'Advanced parameters in Systems Manager Parameter Store', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html' }
  ]
});
