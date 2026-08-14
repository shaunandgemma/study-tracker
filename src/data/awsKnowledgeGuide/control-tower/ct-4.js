import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-4', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Control Tower Multi-Account Landing Zone', status: 'ready',
  plainEnglish: 'A Control Tower landing zone is the governed foundation containing the organization root, organizational units, shared Audit and Log Archive accounts, enrolled workload accounts, enabled Regions, identity configuration, controls, and baselines.',
  whyItMatters: 'Account isolation limits blast radius, clarifies ownership, separates billing, and gives security teams centralized evidence and oversight.',
  workplaceExample: 'Production, non-production, and sandbox accounts sit in separate OUs. Security tooling operates from the Audit account, while immutable logs are retained in the Log Archive account.',
  examFocus: 'Use separate accounts for strong isolation rather than placing every environment in one account. Plan home Region, governed Regions, shared-account ownership, OU design, existing Organizations resources, and identity model before setup.',
  keyPoints: ['The management account governs the organization.', 'The Security OU contains shared security accounts.', 'Workload OUs contain enrolled member accounts.', 'Controls and baselines establish governance.', 'Landing-zone drift must be monitored and repaired.'],
  commonMistake: 'Running ordinary workloads in the management account, increasing both security risk and operational coupling.',
  example: 'Keep the management account for organization administration, security evidence in shared accounts, and applications in dedicated workload accounts.',
  sources: [{ title: 'How AWS Control Tower works', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html' }, { title: 'Plan your landing zone', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/planning-your-deployment.html' }]
});
