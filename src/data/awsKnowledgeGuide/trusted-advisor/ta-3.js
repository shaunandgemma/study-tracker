import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-3',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Trusted Advisor Best-Practice Recommendations',
  status: 'ready',
  plainEnglish: 'A Trusted Advisor recommendation connects a check with the account resources or settings that met its alert criteria. The recommendation explains the issue, lists affected items when applicable, and provides a recommended action and supporting documentation. It gives engineers evidence to investigate, but the engineer must confirm business context, dependencies, recent changes, and the correct remediation.',
  whyItMatters: 'Recommendations turn a large environment into a prioritised review list. Used well, they shorten the time needed to find common risks. Used blindly, they can cause outages—for example, deleting a resource that looks idle but supports a monthly job. A safe process assigns ownership, validates telemetry, estimates impact, obtains approval, implements the change, and verifies the result.',
  workplaceExample: 'Trusted Advisor identifies a low-utilisation EC2 instance. The cloud team checks tags, CloudWatch history, schedules, application ownership, backups, and dependency records. They then resize the instance during an approved window and monitor it, rather than terminating it immediately from the recommendation.',
  examFocus: 'SAA-C03 usage pattern:\n- Open a check to review its description, alert criteria, affected resources, and recommended action.\n- Refresh supported checks before relying on their state.\n- Validate the recommendation against workload requirements.\n- Exclude only a deliberately accepted exception and document the reason elsewhere.\n- Recheck after remediation to confirm whether the finding clears.',
  keyPoints: [
    'A recommendation is generated from a defined Trusted Advisor check and its alert criteria.',
    'Affected resources and recommended actions provide a starting point for investigation.',
    'Recommendations do not automatically know every workload dependency or business exception.',
    'Check results should be refreshed where supported before decisions are made.',
    'Items can be excluded from supported check results, but exclusion is not remediation.',
    'Safe remediation includes ownership confirmation, change control, rollback planning, and post-change verification.'
  ],
  commonMistake: 'Applying every recommendation immediately because it is labelled as an AWS best practice. Best-practice checks are broadly useful, but workload-specific requirements and recent telemetry must be reviewed before a change.',
  example: 'A recommendation says an S3 bucket permission needs action. The security engineer identifies the bucket owner, confirms whether public access is intended, reviews the bucket policy and access pattern, applies the least disruptive approved correction, and refreshes the result after AWS has reevaluated it.',
  sources: [
    { title: 'Get started with Trusted Advisor Recommendations', url: 'https://docs.aws.amazon.com/awssupport/latest/user/get-started-with-aws-trusted-advisor.html' },
    { title: 'Manage access to Trusted Advisor', url: 'https://docs.aws.amazon.com/awssupport/latest/user/security-trusted-advisor.html' }
  ]
});
