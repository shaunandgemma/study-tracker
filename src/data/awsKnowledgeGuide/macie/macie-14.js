import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-14',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Macie vs GuardDuty',
  status: 'ready',
  plainEnglish: 'Macie and GuardDuty answer different questions. Macie asks where supported sensitive data exists in Amazon S3 and whether S3 bucket posture shows potential security or privacy issues. GuardDuty analyzes supported AWS data sources, logs, threat intelligence, and behavior to identify suspicious or potentially malicious activity.',
  whyItMatters: 'A bucket may contain sensitive data without any attack, and an attacker may misuse credentials without creating a Macie discovery finding. Using both services gives teams data-risk context and threat-detection evidence instead of forcing one tool into the other tool\'s role.',
  workplaceExample: 'Macie identifies personal data in a bucket with external sharing, so the data-governance team reviews access and retention. GuardDuty separately reports suspicious use of credentials that accessed S3, so incident responders investigate activity and contain the identity. Security Hub helps the teams correlate the findings.',
  examFocus: 'Choose Macie for S3 sensitive-data discovery and S3 security posture; choose GuardDuty for managed threat detection. Inspector handles supported vulnerability and exposure management, Security Hub aggregates findings, S3 controls enforce access, and KMS controls encryption keys. These services complement one another and do not universally replace one another.',
  keyPoints: [
    'Macie focuses on sensitive data and security posture for Amazon S3.',
    'GuardDuty focuses on suspicious and potentially malicious activity in supported telemetry.',
    'A Macie sensitive-data finding does not prove that data was accessed by an attacker.',
    'A GuardDuty finding does not provide a complete classification inventory of S3 object contents.',
    'Security Hub can aggregate supported findings from both services without performing their analysis.',
    'S3 Block Public Access, IAM, bucket policies, ACLs, and KMS remain enforcement mechanisms.'
  ],
  commonMistake: 'Using GuardDuty as proof that an S3 bucket contains no sensitive data—or using Macie as proof that no attack occurred—confuses content discovery with threat detection. Send each finding to the correct playbook and correlate them when the same account, identity, bucket, or object is involved.',
  example: 'For a fictional incident, place the Macie finding in the data-exposure workflow and the GuardDuty finding in incident response. Confirm the shared account, Region, bucket, and access path, preserve evidence, restrict confirmed unintended access, rotate compromised credentials if supported by evidence, and handle data movement or deletion only under governance.',
  sources: [
    { title: 'What is Amazon Macie?', url: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html' },
    { title: 'What is Amazon GuardDuty?', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html' },
    { title: 'Evaluating Macie findings with AWS Security Hub CSPM', url: 'https://docs.aws.amazon.com/macie/latest/user/securityhub-integration.html' },
    { title: 'Analyzing your Amazon S3 security posture with Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/monitoring-s3-inventory.html' }
  ]
});
