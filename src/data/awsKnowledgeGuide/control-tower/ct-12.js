import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-12', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Control Tower Dashboard', status: 'ready',
  plainEnglish: 'The Control Tower dashboard summarizes the landing zone, registered OUs, enrolled accounts, enabled controls, compliance findings, and drift or update information. It is a governance overview rather than a replacement for detailed service consoles.',
  whyItMatters: 'Central visibility helps platform teams identify where governance coverage or compliance needs attention across many accounts.',
  workplaceExample: 'An administrator sees detective-control violations on the dashboard, opens the affected account and resource details, and assigns remediation to the workload owner.',
  examFocus: 'The dashboard surfaces governance status, but underlying evidence and enforcement come from services such as AWS Config, Organizations, CloudTrail, and CloudFormation. A violation indicates detective noncompliance rather than proof that Control Tower blocked the action.',
  keyPoints: ['Dashboard views summarize OUs, accounts, controls, and compliance.', 'Violations relate to detective evaluations.', 'Drift indicates managed resources differ from expected configuration.', 'Detailed investigation can require the integrated service console.', 'Dashboard data is scoped to Control Tower governance coverage.'],
  commonMistake: 'Treating the dashboard as a real-time application monitoring system. Use CloudWatch and other observability tools for workload health.',
  example: 'Review the dashboard regularly, investigate violations and drift, then confirm remediation in the originating service and Control Tower state.',
  sources: [{ title: 'What is AWS Control Tower?', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html' }, { title: 'Logging and monitoring in AWS Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/logging-and-monitoring.html' }]
});
