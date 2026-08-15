import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-4',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Cost Optimization Checks',
  status: 'ready',
  plainEnglish: 'Trusted Advisor cost optimisation checks look for supported resource patterns that may indicate unnecessary spending, such as idle, underused, or inefficiently configured resources. The console can show affected resources and estimated savings for checks that support that calculation. These are opportunities to investigate, not guaranteed savings and not permission to delete production resources.',
  whyItMatters: 'Cloud resources can continue generating charges after projects finish or when demand changes. Regular cost reviews help teams remove waste and choose better configurations, but a low average utilisation value can hide seasonal, batch, failover, compliance, or disaster-recovery requirements. Cost optimisation must preserve the workload’s required performance and resilience.',
  workplaceExample: 'A recommendation identifies low-utilisation instances and unattached storage. The FinOps team groups results by owner tag, verifies billing and CloudWatch history, checks backup and recovery needs, and sends each service owner an evidence-backed action. Only approved resources are resized, snapshotted, stopped, or deleted.',
  examFocus: 'SAA-C03 cost approach:\n- Use Trusted Advisor to identify supported savings opportunities.\n- Validate utilisation over a representative business period.\n- Confirm ownership, schedules, resilience roles, and data-retention needs.\n- Compare with Cost Explorer and Compute Optimizer where deeper cost or rightsizing evidence is needed.\n- Measure realised savings after the change.',
  keyPoints: [
    'Cost checks identify supported configurations that may represent waste or inefficient usage.',
    'Estimated savings are guidance and can differ from the final bill or contract pricing.',
    'Low utilisation does not prove that a resource is unnecessary.',
    'Tags and ownership records help route recommendations to the correct team.',
    'CloudWatch history, Cost Explorer data, schedules, and resilience requirements should be reviewed before remediation.',
    'Cost optimisation should not weaken performance, security, recoverability, or availability requirements.'
  ],
  commonMistake: 'Terminating every resource marked as idle without checking whether it is a standby component, monthly batch worker, licensed appliance, recovery target, or holder of data that must be retained.',
  example: 'An apparently idle instance is examined over the full monthly cycle. The owner confirms it runs a report on the final day of each month, so the team evaluates scheduling or a different architecture rather than deleting it based on the previous week’s average usage.',
  sources: [
    { title: 'Trusted Advisor cost optimization checks', url: 'https://docs.aws.amazon.com/awssupport/latest/user/cost-optimization-checks.html' },
    { title: 'Get started with Trusted Advisor Recommendations', url: 'https://docs.aws.amazon.com/awssupport/latest/user/get-started-with-aws-trusted-advisor.html' }
  ]
});
