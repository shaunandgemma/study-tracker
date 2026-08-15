import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-7',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Fault Tolerance Checks',
  status: 'ready',
  plainEnglish: 'Trusted Advisor fault tolerance checks identify supported configurations that may leave a workload vulnerable to failure or slow recovery. They examine defined resilience patterns, such as resource distribution, backup-related settings, redundancy, and service-specific availability configurations. A green result covers only the checks that ran; it does not prove that the application meets its recovery time and recovery point objectives.',
  whyItMatters: 'Infrastructure can be healthy during normal operation yet fail badly when an Availability Zone, dependency, credential, or component is lost. Fault-tolerance recommendations help teams find common single points of failure, but engineers must still understand application state, dependencies, backup integrity, failover behaviour, and recovery procedures.',
  workplaceExample: 'A recommendation reports a workload with insufficient resilience. The service owner maps the full request path, verifies Multi-AZ or multi-instance placement where appropriate, reviews backup and restore evidence, and runs a controlled failure exercise before closing the risk.',
  examFocus: 'SAA-C03 resilience workflow:\n- Identify the affected resource and failure domain.\n- Compare the design with the workload RTO and RPO.\n- Add suitable redundancy, backups, health checks, or failover rather than duplicating resources blindly.\n- Verify dependencies and return paths.\n- Test recovery; configuration alone is not evidence that failover works.',
  keyPoints: [
    'Fault tolerance checks cover defined resilience configurations and affected resources.',
    'High availability and backup are related but solve different failure and recovery needs.',
    'A redundant front end can still fail if its database, identity, network, or DNS dependency is a single point of failure.',
    'Recovery time and recovery point objectives must guide the chosen correction.',
    'Backup success should be complemented by restore testing and application validation.',
    'Basic Support includes selected fault tolerance checks, while full-plan coverage is broader.'
  ],
  commonMistake: 'Closing a fault-tolerance recommendation after adding a second resource without checking whether both resources share the same failure domain or depend on the same non-resilient backend.',
  example: 'A service has two EC2 instances but both are in one Availability Zone. The team reviews the recommendation, distributes instances across suitable zones, confirms load-balancer health checks and database resilience, and tests that traffic continues when one instance is unavailable.',
  sources: [
    { title: 'Trusted Advisor fault tolerance checks', url: 'https://docs.aws.amazon.com/awssupport/latest/user/fault-tolerance-checks.html' },
    { title: 'AWS Trusted Advisor check reference', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor-check-reference.html' }
  ]
});
