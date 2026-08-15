import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-5',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Managed Data Identifiers',
  status: 'ready',
  plainEnglish: 'Managed data identifiers are detection definitions that AWS maintains for supported sensitive-data types. They are grouped into categories such as credentials, financial information, personal information, and certain identifiers that apply to particular countries or regions. Depending on the identifier, Macie can use patterns, keywords, checksums, machine learning, or other documented techniques.',
  whyItMatters: 'AWS-managed definitions save teams from building and updating every common detector themselves. The detailed reference also shows where context or geography matters, helping analysts understand why a value matched or why a similar-looking value did not.',
  workplaceExample: 'A bank configures a discovery job with only the managed identifiers relevant to its approved payment-data review. It checks each identifier\'s keyword and country requirements, tests the configuration on harmless fictional data, and adds an allow list for documented public test values where appropriate.',
  examFocus: 'Managed identifiers are the built-in option for supported common sensitive-data types; custom identifiers extend Macie for organization-specific patterns. Do not assume every identifier uses the same logic or language support. Selecting categories or individual identifiers changes discovery scope but does not change the underlying objects.',
  keyPoints: [
    'AWS creates and maintains managed data identifiers for documented sensitive-data types.',
    'Identifiers are organized into credentials, financial, personal, and other documented categories.',
    'Detection techniques and keyword requirements vary by identifier.',
    'Some identifiers are specific to countries, regions, languages, or formatting conventions.',
    'Jobs and automated discovery can use selected managed identifiers according to their configuration.',
    'Allow lists can ignore approved matching text without removing or rewriting the source data.'
  ],
  commonMistake: 'Selecting every managed identifier without considering the dataset can increase noise and make findings harder to triage. Choose the relevant categories, read their detection requirements, test with safe examples, and document why exclusions or allow lists are appropriate.',
  example: 'For a fictional international customer dataset, list the countries and data types in scope, select the matching managed identifiers from the current reference, and create positive and negative test objects. Review the resulting categories and location metadata without placing detected values in reports.',
  sources: [
    { title: 'Detailed reference: Managed data identifiers by category', url: 'https://docs.aws.amazon.com/macie/latest/user/mdis-reference.html' },
    { title: 'Managed data identifiers for financial information', url: 'https://docs.aws.amazon.com/macie/latest/user/mdis-reference-financial.html' },
    { title: 'Discovering sensitive data with Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/data-classification.html' },
    { title: 'Creating an allow list', url: 'https://docs.aws.amazon.com/macie/latest/user/allow-lists-create.html' }
  ]
});
