import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-18',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'Parameter Store vs Secrets Manager',
  status: 'ready',
  plainEnglish: 'AWS Systems Manager Parameter Store and AWS Secrets Manager are complementary services with distinct features:\n- Parameter Store: Centralized configuration and secret storage. Standard parameters are free ($0), supports plain text (`String`, `StringList`) and encrypted values (`SecureString`), but does NOT provide built-in automatic secret rotation.\n- Secrets Manager: Dedicated secret management service. Provides built-in automatic secret rotation (via Lambda templates for RDS, Redshift, DocumentDB), native cross-account secret sharing, and random password generation ($0.40/secret/month).',
  whyItMatters: 'Choosing between Parameter Store and Secrets Manager depends on compliance and rotation requirements. If automated database credential rotation is required, choose Secrets Manager; for general configuration settings and basic static secrets, choose Parameter Store.',
  workplaceExample: 'A DevOps team uses Parameter Store ($0/mo) for 200 non-sensitive app settings and API URLs. For their primary RDS database password requiring automated 30-day credential rotation, they use AWS Secrets Manager.',
  examFocus: 'SAA-C03 Decision Matrix (Parameter Store vs Secrets Manager):\n- Automatic Secret Rotation: Secrets Manager ONLY (built-in integration with AWS Lambda for RDS/Redshift/DocumentDB).\n- Cost: Parameter Store Standard tier is Free ($0); Secrets Manager costs $0.40 per secret per month plus API fees.\n- Data Types: Parameter Store supports `String`, `StringList`, `SecureString`; Secrets Manager stores encrypted JSON key/value secrets.\n- Cross-Account Sharing: Secrets Manager supports native resource-based secret policies out of the box; Parameter Store requires RAM.',
  keyPoints: [
    'Parameter Store provides free ($0) configuration management and SecureString storage.',
    'Secrets Manager provides built-in automatic secret rotation using AWS Lambda.',
    'Secrets Manager costs $0.40 per secret per month; Parameter Store Standard tier is free.',
    'Use Secrets Manager for database credentials requiring automatic rotation.',
    'Use Parameter Store for application configurations, URLs, feature flags, and static secrets.'
  ],
  commonMistake: 'Claiming that Parameter Store automatically rotates database credentials. Automatic secret rotation is a feature of AWS Secrets Manager.',
  example: 'Decision Matrix Summary:\n- "Store 50 application configuration URLs and feature flags for free" -> Parameter Store\n- "Automatically rotate RDS database credentials every 30 days" -> AWS Secrets Manager',
  sources: [
    { title: 'Comparing AWS Systems Manager Parameter Store and AWS Secrets Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-about.html#paramstore-comparisons' }
  ]
});
