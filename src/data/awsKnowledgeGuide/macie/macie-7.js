import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-7',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Macie Findings',
  status: 'ready',
  plainEnglish: 'Macie creates policy findings for potential S3 security or privacy issues and sensitive-data findings when discovery detects supported sensitive data in an S3 object. Findings include severity, status, affected bucket or object, and investigation details. A sensitive data discovery result is a separate per-object analysis record and can include richer occurrence-location information, including for objects that produced no finding or could not be analyzed.',
  whyItMatters: 'Responders need to know whether they are fixing bucket access posture, investigating detected content, or troubleshooting analysis coverage. The distinction prevents a closed ticket or archived finding from being mistaken for a changed policy or cleaned dataset.',
  workplaceExample: 'An analyst receives a sensitive-data finding for an object in a shared bucket. They confirm the account and Region, inspect the full finding and protected result, validate the data with its owner, review access, preserve evidence, remove confirmed unintended sharing, and follow governance before any movement, redaction, or deletion.',
  examFocus: 'Policy findings and sensitive-data findings are different categories; classification results are analysis records, not another name for findings. Severity prioritizes review, and status controls lifecycle or visibility. Archiving or suppressing a finding does not remediate the cause; suppression rules archive matching future findings and prevent their publication to EventBridge and Security Hub CSPM.',
  keyPoints: [
    'Policy findings report potential S3 bucket security or privacy issues.',
    'Sensitive-data findings report supported sensitive data detected in particular S3 objects.',
    'Discovery results record each attempted object analysis and may exist without a finding.',
    'Finding details can include affected resources, severity, status, occurrences, and location metadata.',
    'Suppression rules archive matching future findings without changing buckets or objects.',
    'Archived findings can still represent unresolved risk and remain relevant to investigations.'
  ],
  commonMistake: 'Archiving a finding after assigning it to an owner can hide an unresolved issue from default views. Archive only with a documented reason, preserve the underlying result, and separately verify access changes, encryption, or governed data handling before recording remediation.',
  example: 'Confirm the account, Region, bucket, and object; read the complete finding and corresponding protected result; verify whether the data is genuinely sensitive; review authorized readers and preserve evidence; correct confirmed unintended access and encryption gaps; handle movement, redaction, or deletion only after retention and legal review; then verify status and record preventive improvements.',
  sources: [
    { title: 'Reviewing and analyzing Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings.html' },
    { title: 'Types of Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-types.html' },
    { title: 'Severity scoring for Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-severity.html' },
    { title: 'Storing and retaining sensitive data discovery results', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-results-repository-s3.html' },
    { title: 'Suppressing Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-suppression.html' }
  ]
});
