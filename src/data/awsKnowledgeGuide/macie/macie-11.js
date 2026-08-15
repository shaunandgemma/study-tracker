import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-11',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Financial and Credential Data Detection',
  status: 'ready',
  plainEnglish: 'Macie has managed data identifiers for supported financial information and credentials in S3 objects. Financial detection can cover documented account, payment, or card-related patterns; credential detection can cover documented keys, tokens, or authorization material. The exact identifiers and detection requirements are defined in the current Macie reference rather than by the broad category name alone.',
  whyItMatters: 'Leaked financial data can enable fraud and regulatory harm, while exposed credentials can permit direct system access. Separating these categories helps a responder involve the right owners and choose actions such as access restriction, credential rotation, or governed data relocation.',
  workplaceExample: 'Macie reports credential material in an archived application export. The incident team confirms the object and occurrence location, restricts unintended readers, preserves evidence, verifies whether the credential is active, rotates it through the owning system, and handles the archive under its retention policy.',
  examFocus: 'Choose managed data identifiers for supported built-in financial and credential patterns, and consult their keyword or regional requirements. A credentials finding does not prove use of the credential, and Macie does not rotate it. Discovery and remediation are separate: use the owning identity or application service to revoke or rotate secrets.',
  keyPoints: [
    'Financial information and credentials are distinct managed sensitive-data categories in Macie.',
    'Individual identifiers can use different detection techniques and context requirements.',
    'A finding points to the S3 object and reports detection metadata, not a confirmed fraudulent transaction or login.',
    'Credential remediation commonly includes restricting access and rotating or revoking the secret in its source system.',
    'Financial-data remediation must respect legal, business, and retention requirements.',
    'Discovery results and any authorized sensitive-data samples require tightly controlled access and encryption.'
  ],
  commonMistake: 'Deleting a file that contains a credential without revoking the credential leaves the usable secret active and may destroy required evidence. Secure the object, preserve context, rotate or revoke the credential, then apply the approved retention or deletion decision.',
  example: 'Use harmless fictional placeholder data in a test object and run a narrowly scoped job with selected financial and credential identifiers. Verify that the workflow routes financial detections to data governance and credential detections to secret owners, without copying detected values into tickets or notifications.',
  sources: [
    { title: 'Detailed reference: Managed data identifiers by category', url: 'https://docs.aws.amazon.com/macie/latest/user/mdis-reference.html' },
    { title: 'Managed data identifiers for financial information', url: 'https://docs.aws.amazon.com/macie/latest/user/mdis-reference-financial.html' },
    { title: 'Types of Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-types.html' },
    { title: 'Retrieving sensitive data samples for a Macie finding', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-retrieve-sd-proc.html' }
  ]
});
