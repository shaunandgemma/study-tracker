import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-9',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Operational Excellence Recommendations',
  status: 'ready',
  plainEnglish: 'Trusted Advisor Operational Excellence checks focus on supported practices that help teams run and maintain workloads effectively. Depending on the current check catalogue, recommendations can relate to observability, supportability, account contacts, service configuration, lifecycle risks, or other operational practices. The category helps identify gaps, but it does not create runbooks, ownership, incident response, or continuous improvement by itself.',
  whyItMatters: 'Many outages last longer because teams lack useful telemetry, current contacts, documented procedures, tested responses, or awareness of approaching lifecycle changes. Operational excellence turns technical operation into a repeatable process: observe, respond, learn, improve, and verify.',
  workplaceExample: 'The weekly review finds an Operational Excellence recommendation affecting a production service. The operations lead assigns an owner, links the finding to a tracked change, updates the runbook and monitoring, performs the correction, and records verification evidence during the next operations review.',
  examFocus: 'SAA-C03 operational principle:\n- Treat operations as code and repeatable processes where practical.\n- Maintain observability, ownership, contacts, runbooks, and response procedures.\n- Prioritise recommendations by workload impact and urgency.\n- Track remediation to completion rather than merely reading the result.\n- Feed lessons from incidents and reviews back into the operating model.',
  keyPoints: [
    'Operational Excellence is a current Trusted Advisor check category in addition to the five original optimisation areas.',
    'The category surfaces supported operational risks rather than every process weakness in an organisation.',
    'Recommendations need an owner, priority, due date, change record, and verification evidence where appropriate.',
    'Monitoring without response procedures does not produce operational readiness.',
    'Runbooks should be kept current and tested under realistic conditions.',
    'Recurring reviews and incident learning help prevent the same operational failure from returning.'
  ],
  commonMistake: 'Marking an operational recommendation as handled because someone read it. The underlying practice, configuration, ownership, or runbook must be corrected and verified.',
  example: 'A recommendation reveals an operational gap for an important account. The team assigns the platform owner, updates the required configuration and escalation record, tests the notification path, and records the result in its monthly operational-readiness review.',
  sources: [
    { title: 'Trusted Advisor Operational Excellence checks', url: 'https://docs.aws.amazon.com/awssupport/latest/user/operational-excellence-checks.html' },
    { title: 'AWS Trusted Advisor check reference', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor-check-reference.html' }
  ]
});
