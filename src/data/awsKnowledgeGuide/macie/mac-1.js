import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mac-1',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Automated Discovery & Classification of PII, Financial Data, and Credentials in S3',
  status: 'ready',
  plainEnglish: 'Amazon Macie is a data-security and sensitive-data discovery service focused on Amazon Simple Storage Service (Amazon S3). It can inspect supported S3 objects for categories such as personally identifiable information (PII), financial information, credentials, and organization-specific patterns. Automated sensitive data discovery samples representative eligible objects across the S3 inventory; it does not continuously read every byte of every object.',
  whyItMatters: 'Organizations often do not know which buckets contain regulated or secret material. Macie adds evidence about data sensitivity to its S3 security-posture view so teams can prioritize a publicly accessible bucket containing sensitive data ahead of a private bucket containing ordinary documents.',
  workplaceExample: 'A privacy team enables automated discovery for its production accounts and reviews the sensitivity map. Macie identifies personal and financial data in selected objects in a customer-exports bucket, so the team launches a targeted discovery job to assess that bucket more deeply before changing its data-handling controls.',
  examFocus: 'Choose Macie for discovering sensitive data and S3 data-security issues, not for arbitrary data in every AWS service. Know that automated discovery uses sampling and differs from targeted discovery jobs. Findings are signals for review; Macie does not automatically block access, delete data, or replace S3 Block Public Access, Identity and Access Management (IAM), bucket policies, encryption, or retention governance.',
  keyPoints: [
    'Macie focuses its inventory, security assessment, and sensitive-data discovery on Amazon S3.',
    'Managed data identifiers cover supported categories such as personal, financial, and credential data.',
    'Custom data identifiers can add detection criteria for organization-specific sensitive text.',
    'Automated discovery selects representative eligible objects by using sampling techniques.',
    'A sensitive-data finding reports detected sensitive data in a particular S3 object.',
    'Classification results record object analysis details and are related to, but not identical to, findings.'
  ],
  commonMistake: 'Treating a bucket sensitivity label as proof that every object was scanned can create false confidence. Review automated-discovery coverage and sampled-object details, then use a scoped discovery job when the business decision requires deeper analysis.',
  example: 'Enable automated discovery in a non-production account, review eligible and excluded buckets, and inspect the sensitivity statistics without opening real sensitive values. Select one bucket for a carefully scoped job, protect the discovery-results repository, and compare job results with the earlier sampled view.',
  sources: [
    { title: 'What is Amazon Macie?', url: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html' },
    { title: 'Discovering sensitive data with Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/data-classification.html' },
    { title: 'Performing automated sensitive data discovery', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-asdd.html' },
    { title: 'Detailed reference: Managed data identifiers by category', url: 'https://docs.aws.amazon.com/macie/latest/user/mdis-reference.html' }
  ]
});
