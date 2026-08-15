import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-13',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Trusted Advisor vs Compute Optimizer',
  status: 'ready',
  plainEnglish: 'Trusted Advisor is a broad best-practice recommendation service covering categories such as cost, performance, security, fault tolerance, service limits, and operational excellence. AWS Compute Optimizer specialises in analysing resource configuration and utilisation metrics to generate rightsizing and efficiency recommendations for supported resource types. They overlap in some optimisation areas, and selected Trusted Advisor checks can display data supplied by Compute Optimizer after opt-in.',
  whyItMatters: 'Using the correct tool produces better evidence. Trusted Advisor is useful for a broad account review, while Compute Optimizer offers deeper resource-specific sizing analysis, lookback data, performance risk, and configurable rightsizing preferences for supported services. Neither tool knows every business requirement, so recommendations still need workload-owner validation.',
  workplaceExample: 'Trusted Advisor highlights a potential EBS or Lambda optimisation. The engineer opens Compute Optimizer to inspect utilisation history, performance risk, savings opportunity, and the proposed configuration. The application owner confirms peak-period requirements before an approved rightsizing change is tested and monitored.',
  examFocus: 'SAA-C03 comparison:\n- Trusted Advisor: broad cross-category best-practice checks.\n- Compute Optimizer: metric-based rightsizing and efficiency recommendations for supported compute, storage, container, and database resources.\n- Opt-in can feed selected EBS and Lambda recommendations into Trusted Advisor.\n- Some integrated findings refresh automatically and cannot be manually refreshed.\n- Recommendations from either service require validation before implementation.',
  keyPoints: [
    'Trusted Advisor covers more than rightsizing, including security, fault tolerance, quotas, and operations.',
    'Compute Optimizer analyses supported resource configuration and utilisation metrics.',
    'Compute Optimizer supports configurable rightsizing preferences such as lookback period and resource preferences for applicable services.',
    'Selected EBS and Lambda checks in Trusted Advisor can receive findings from Compute Optimizer after opt-in.',
    'Integrated findings can take time to appear and may follow automatic refresh behaviour.',
    'Neither service should trigger an unreviewed production resize or deletion.'
  ],
  commonMistake: 'Assuming Trusted Advisor and Compute Optimizer are duplicates. Their scopes differ: one provides broad best-practice coverage, while the other specialises in utilisation-based resource optimisation.',
  example: 'A low-utilisation concern begins in Trusted Advisor. Compute Optimizer shows a smaller recommended instance with acceptable projected performance risk over a representative lookback period. The team checks seasonal peaks, licence constraints, memory evidence, and rollback options before resizing.',
  sources: [
    { title: 'Opt in Compute Optimizer for Trusted Advisor checks', url: 'https://docs.aws.amazon.com/awssupport/latest/user/compute-optimizer-with-trusted-advisor.html' },
    { title: 'What is AWS Compute Optimizer?', url: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html' },
    { title: 'Compute Optimizer rightsizing recommendation preferences', url: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/rightsizing-preferences.html' }
  ]
});
