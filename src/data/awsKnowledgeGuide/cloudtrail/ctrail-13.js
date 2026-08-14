import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-13', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail Log File Validation', status: 'ready',
  plainEnglish: 'Log file integrity validation creates a SHA-256 hash for each delivered CloudTrail log and an hourly digest file containing those hashes. CloudTrail digitally signs the digest, and each digest links to the previous digest so modification or deletion can be detected.',
  whyItMatters: 'During an audit or forensic investigation, validation provides evidence that files have not been changed or removed since CloudTrail delivered them.',
  workplaceExample: 'After a security incident, an investigator runs the CloudTrail validate-logs command for the incident window and records that every digest signature and referenced log hash is valid.',
  examFocus: 'Enabling validation causes digest delivery; it does not automatically perform validation. Use the CLI or a custom process to check the chain. Validation is tamper-evidence, while KMS and S3 encryption protect confidentiality at rest.',
  keyPoints: ['SHA-256 hashes protect log content integrity.', 'RSA signatures authenticate digest files.', 'Digest files form a chain through the preceding digest signature.', 'CloudTrail normally delivers digest files hourly.', 'CLI validation requires files in their original delivery location.'],
  commonMistake: 'Turning on integrity validation and claiming the logs have already been validated without running a validation process.',
  example: 'Enable validation on the trail, retain both CloudTrail and CloudTrail-Digest prefixes, then use validate-logs for the required time range.',
  sources: [{ title: 'Validating CloudTrail log file integrity', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html' }, { title: 'Validating log integrity with the AWS CLI', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-cli.html' }, { title: 'CloudTrail digest file structure', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-digest-file-structure.html' }]
});
