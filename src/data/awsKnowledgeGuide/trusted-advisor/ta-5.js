import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-5',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Performance Checks',
  status: 'ready',
  plainEnglish: 'Trusted Advisor performance checks identify supported resource configurations or usage patterns that may restrict throughput, responsiveness, or scaling. A warning means the resource should be investigated against workload demand and service metrics. It does not mean that Trusted Advisor has load-tested the application or identified every source of latency.',
  whyItMatters: 'Performance problems can come from capacity, configuration, quotas, architecture, software, dependencies, or network paths. Trusted Advisor can highlight common AWS-side opportunities, but engineers still need workload metrics, traces, logs, user-impact data, and a representative test before changing capacity or architecture.',
  workplaceExample: 'A performance recommendation highlights an overutilised resource. The operations team correlates the finding with CloudWatch metrics, application latency and the deployment timeline. They test the proposed configuration in staging, schedule the approved change, and confirm that response time improves without creating excessive cost.',
  examFocus: 'SAA-C03 performance workflow:\n- Use Trusted Advisor to locate supported performance risks.\n- Confirm the alert against service-specific metrics and workload demand.\n- Determine whether scaling up, scaling out, caching, configuration changes, or architecture changes are appropriate.\n- Check related quotas and downstream bottlenecks.\n- Test and monitor rather than assuming a larger resource always solves the problem.',
  keyPoints: [
    'Performance checks cover defined AWS resource patterns and are not full application performance tests.',
    'A recommendation should be correlated with CloudWatch and application-level evidence.',
    'The actual bottleneck may be downstream from the resource named in the recommendation.',
    'Quota, network, storage, compute, database, and scaling limits can produce similar symptoms.',
    'A performance correction can increase cost and should be sized to measured demand.',
    'Post-change monitoring is required to prove that the user-visible problem improved.'
  ],
  commonMistake: 'Immediately selecting the largest resource size after a performance warning. The issue may instead be poor scaling configuration, storage throughput, a database query, a quota, or an external dependency.',
  example: 'Trusted Advisor flags a resource for performance review. Engineers compare CPU, memory where available, latency, throughput, queue depth, error rate, and request volume. The evidence points to storage throughput rather than CPU, so they correct the actual bottleneck and verify the result.',
  sources: [
    { title: 'Trusted Advisor performance checks', url: 'https://docs.aws.amazon.com/awssupport/latest/user/performance-checks.html' },
    { title: 'AWS Trusted Advisor check reference', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor-check-reference.html' }
  ]
});
