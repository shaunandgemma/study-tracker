import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-16', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'AWS Config Integration', status: 'ready',
  plainEnglish: 'Control Tower uses AWS Config recording and Config rules for detective governance. Config captures supported resource configuration and relationships, then evaluates recorded resources against enabled detective controls.',
  whyItMatters: 'This integration shows which governed resources violate policy and supplies configuration history for understanding how the violation developed.',
  workplaceExample: 'Config detects a public S3 bucket in an enrolled account. The Control Tower dashboard reports the violation, and the resource owner corrects the bucket configuration.',
  examFocus: 'Detective controls depend on Config and do not block creation. Residual or conflicting Config recorders and delivery channels can prevent existing-account enrollment. Avoid altering Control Tower-managed Config resources outside supported workflows.',
  keyPoints: ['Config supports detective control evaluation.', 'Configuration recorders collect supported resource state.', 'Rules report compliant or noncompliant status.', 'Config coverage and charges apply by account and Region.', 'Managed Config resource changes can cause drift.'],
  commonMistake: 'Deleting or replacing the Control Tower-managed Config recorder to resolve a workload problem without checking landing-zone impact.',
  example: 'Investigate the Control Tower violation, open the underlying Config evaluation and resource timeline, remediate the resource, then confirm reevaluation.',
  sources: [{ title: 'How controls work', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-controls-work.html' }, { title: 'Logging and monitoring in AWS Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/logging-and-monitoring.html' }, { title: 'Enroll an existing account', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/quick-account-provisioning.html' }]
});
