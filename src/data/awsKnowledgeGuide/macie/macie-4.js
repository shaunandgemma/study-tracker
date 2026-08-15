import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-4',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Automated Sensitive Data Discovery',
  status: 'ready',
  plainEnglish: 'Automated sensitive data discovery gives a broad, evolving view of sensitivity across an S3 data estate. Macie evaluates the bucket inventory, uses sampling to select representative eligible objects, analyzes those objects with configured identifiers and allow lists, and updates bucket sensitivity scores, statistics, findings, results, and coverage information. It is not a continuous full-content scan of every S3 object.',
  whyItMatters: 'The feature helps a new security program learn where sensitive data is likely concentrated without first designing a job for every bucket. Its heat map and sensitivity statistics can direct deeper targeted jobs and urgent reviews of sensitive buckets with risky access settings.',
  workplaceExample: 'A Macie administrator enables automated discovery for selected organization accounts but excludes a bucket dedicated to approved service logs. After the sensitivity map highlights an externally shared research bucket, the team verifies coverage and creates a targeted job for a more complete assessment.',
  examFocus: 'Automated discovery uses sampling and broad inventory evaluation; jobs provide deliberate, configurable analysis. Administrators can tailor identifiers, allow lists, account enablement, and bucket exclusions. Costs include documented object monitoring and analyzed uncompressed data dimensions, so use Regional estimates rather than inventing a fixed scan price.',
  keyPoints: [
    'Automated discovery evaluates the S3 bucket inventory and selects representative eligible objects for analysis.',
    'Sampling means Macie does not claim to inspect every byte of every object continuously.',
    'Sensitivity scores and labels summarize evidence gathered for buckets and change as relevant objects change.',
    'Specific buckets can be excluded, and administrators can control enablement for member accounts.',
    'Managed identifiers, custom identifiers, and allow lists can tailor the analysis.',
    'Coverage details explain analysis status and issues that prevent eligible-object inspection.'
  ],
  commonMistake: 'Using an automated-discovery sensitivity score as a complete inventory of every sensitive record overstates what sampling proves. Treat it as prioritization evidence and run an appropriately scoped job when completeness is required for a decision.',
  example: 'Enable automated discovery for a controlled account, verify which buckets are included or excluded, and review coverage before interpreting sensitivity scores. Use the map to select one bucket for a follow-up job, then compare the sampled automated-discovery evidence with the job\'s deeper results and estimated cost.',
  sources: [
    { title: 'Performing automated sensitive data discovery', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-asdd.html' },
    { title: 'How automated sensitive data discovery works', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-asdd-how-it-works.html' },
    { title: 'Discovering sensitive data with Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/data-classification.html' },
    { title: 'Understanding estimated usage costs for Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/account-mgmt-costs-calculations.html' }
  ]
});
