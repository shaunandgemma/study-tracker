import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-19',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'Parameter Store Does Not Provide Built-In Automatic Secret Rotation',
  status: 'ready',
  plainEnglish: 'AWS Systems Manager Parameter Store does NOT provide built-in, out-of-the-box automatic secret rotation functionality. While Parameter Store encrypts `SecureString` values using AWS KMS and tracks version history, updating a parameter value requires an explicit manual API call, a custom EventBridge + Lambda automation pipeline, or using AWS Secrets Manager.',
  whyItMatters: 'Confusing Parameter Store with Secrets Manager regarding secret rotation is a major architectural mistake. Expecting Parameter Store to automatically rotate database passwords without building custom automation will leave credentials static and unrotated indefinitely.',
  workplaceExample: 'An auditor requires automated 30-day rotation for production RDS database passwords. The security architect migrates the database password from Parameter Store to AWS Secrets Manager, which natively manages RDS password rotation via Lambda.',
  examFocus: 'SAA-C03 Architectural Distinction:\n- No Built-In Secret Rotation: Parameter Store does NOT automatically rotate database credentials or API keys.\n- Native Rotation Service: AWS Secrets Manager is the designated AWS service for automated secret rotation.\n- Custom Workaround: If secret rotation is attempted in Parameter Store, developers must build custom EventBridge rules + custom Lambda code to update parameters manually.',
  keyPoints: [
    'Parameter Store does NOT provide built-in automatic secret rotation capabilities.',
    'Updating a parameter requires an explicit API call or custom external automation.',
    'AWS Secrets Manager is the recommended service for native automated secret rotation.',
    'Parameter Store preserves version history (`v1`, `v2`), but does not trigger rotation automatically.',
    'Using Secrets Manager eliminates the need to write custom Lambda rotation code.'
  ],
  commonMistake: 'Designing an AWS architecture assuming Parameter Store will automatically rotate database passwords out of the box without custom Lambda automation.',
  example: 'Comparing Rotation Capability:\n- Parameter Store: Manual put-parameter calls or custom Lambda / EventBridge code required for rotation.\n- AWS Secrets Manager: Built-in 1-click automatic rotation for RDS, Redshift, and DocumentDB using managed Lambda templates.',
  sources: [
    { title: 'Secret rotation options in Systems Manager Parameter Store vs Secrets Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-about.html#paramstore-comparisons' }
  ]
});
