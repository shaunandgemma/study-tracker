import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-10',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Personally Identifiable Information Detection',
  status: 'ready',
  plainEnglish: 'Personally identifiable information (PII) is data that can identify or be linked to a person. Macie provides managed data identifiers for supported personal-data types and countries or regions, using techniques such as pattern matching, checksums, keywords, and machine learning where documented. A personal sensitive-data finding identifies an S3 object in which Macie detected supported personal information.',
  whyItMatters: 'Personal data can trigger privacy, access, retention, and breach-response duties. Locating it in S3 allows data owners to validate whether the storage location, readers, encryption, and retention period match the organization\'s approved purpose.',
  workplaceExample: 'A discovery job detects supported personal identifiers in a report stored outside the approved analytics prefix. The privacy analyst reviews the finding and classification result, confirms the data is genuine, checks access and retention obligations, and coordinates an approved move to the governed location.',
  examFocus: 'Macie detects supported sensitive-data types in eligible S3 objects; it is not a universal identity database or a guarantee that all PII is found. Managed identifiers vary by data type and geography. Distinguish a sensitive-data finding about an object from a policy finding about bucket security and from the detailed discovery result for object analysis.',
  keyPoints: [
    'PII means personally identifiable information and includes supported identifiers that relate to an individual.',
    'Managed data identifiers are maintained by AWS and document their supported countries, techniques, and keyword requirements.',
    'Personal-information categories can include PII and protected health information where documented.',
    'Detection quality depends on object eligibility, format, language, context, and the selected identifiers.',
    'Sensitive-data findings identify affected objects without serving as proof of unauthorized disclosure.',
    'Detailed location information in discovery results is sensitive operational metadata and should be protected.'
  ],
  commonMistake: 'Assuming that no Macie finding means an object contains no personal data ignores unsupported formats, access errors, sampling, and identifiers outside Macie\'s configured scope. Check classification results and coverage before making that conclusion.',
  example: 'Run a one-time job against a controlled bucket containing harmless fictional records in a supported text format. Select relevant personal-information identifiers, review positive detections and objects with no finding, and inspect the protected discovery results to understand both matches and analysis limitations.',
  sources: [
    { title: 'Detailed reference: Managed data identifiers by category', url: 'https://docs.aws.amazon.com/macie/latest/user/mdis-reference.html' },
    { title: 'Types of Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-types.html' },
    { title: 'Storing and retaining sensitive data discovery results', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-results-repository-s3.html' },
    { title: 'Supported storage classes and formats', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-supported-storage.html' }
  ]
});
