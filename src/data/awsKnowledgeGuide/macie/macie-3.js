import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'macie-3',
  topicId: 'topic-macie',
  topicTitle: 'Amazon Macie',
  objectiveCode: 'Security',
  title: 'Macie Sensitive Data Discovery for Amazon S3',
  status: 'ready',
  plainEnglish: 'A Macie sensitive data discovery job is a defined analysis of eligible objects in S3 general purpose buckets. A job can run once or on a daily, weekly, or monthly schedule. You choose specific buckets or runtime bucket criteria, a sampling depth, object inclusion or exclusion criteria, managed and custom data identifiers, and optional allow lists.',
  whyItMatters: 'Jobs give data owners more precise control than broad automated discovery when they need to assess a migration, audit a regulated dataset, or monitor a changing group of tagged buckets. Careful scope design limits unnecessary analysis and makes the results easier to interpret and budget.',
  workplaceExample: 'Before a records migration, a compliance team creates a one-time job for two explicitly selected buckets, excludes an approved log prefix, and analyzes all eligible objects. For ongoing monitoring, it creates a scheduled job whose tag-based bucket criteria dynamically include buckets tagged with the governed data domain.',
  examFocus: 'Automated discovery and discovery jobs are different operating models. Jobs can be one-time or scheduled and analyze according to selected buckets or bucket criteria, sampling, object criteria, supported storage and file formats, and permissions. Review estimated usage and current quotas rather than assuming all configured data will be analyzed at once.',
  keyPoints: [
    'One-time jobs start after creation and are useful for targeted point-in-time analysis.',
    'Scheduled jobs can run daily, weekly, or monthly against their configured scope.',
    'A job can select fixed buckets or determine buckets at runtime from properties such as tags and access settings.',
    'Sampling controls the percentage of eligible objects selected for analysis.',
    'Object criteria can include or exclude objects by documented properties such as key prefix, size, tags, or modification time.',
    'Unsupported formats, storage classes, permissions, encryption access, and service quotas can prevent object analysis.'
  ],
  commonMistake: 'Creating a scheduled job with fixed bucket selections and expecting newly tagged buckets to join automatically confuses explicit selection with runtime criteria. Use bucket criteria for a scope that must adapt, and test the criteria before saving the job.',
  example: 'Estimate a one-time job against a test bucket, choose a documented sampling depth, include a controlled prefix, exclude known non-business logs, and select only the identifiers needed for the audit. Review job statistics, findings, and protected per-object discovery results before deciding whether a deeper run is justified.',
  sources: [
    { title: 'Running sensitive data discovery jobs', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-jobs.html' },
    { title: 'Creating a sensitive data discovery job', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-jobs-create.html' },
    { title: 'Scope options for sensitive data discovery jobs', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-jobs-scope.html' },
    { title: 'Understanding estimated usage costs for Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/account-mgmt-costs-calculations.html' },
    { title: 'Quotas for Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/macie-quotas.html' }
  ]
});
