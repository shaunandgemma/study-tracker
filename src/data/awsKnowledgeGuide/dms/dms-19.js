import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dms-19', topicId: 'topic-dms', topicTitle: 'AWS DMS (Database Migration Service)', objectiveCode: 'Management', title: 'DMS Multi-AZ Replication', status: 'ready',
  plainEnglish: 'A Multi-AZ DMS replication instance has a synchronously maintained standby in another Availability Zone. If the primary becomes unavailable, DMS fails over to the standby so ongoing tasks can resume with less interruption.',
  whyItMatters: 'Long-running CDC replications may support critical cutovers or continuous integration feeds and benefit from replication-compute high availability.',
  workplaceExample: 'A months-long CDC task uses Multi-AZ so a host or storage failure does not require rebuilding the replication instance during business operations.',
  examFocus: 'Multi-AZ improves replication-instance availability, not source or target database availability. It adds cost and can introduce performance overhead. A full-load task can still fail during failover and may require restart for incomplete tables.',
  keyPoints: ['A synchronous standby runs in another Availability Zone.', 'Failover protects the DMS replication layer.', 'Source and target require their own resilience.', 'Ongoing replication benefits most from higher availability.', 'Monitor and rehearse task recovery behaviour.'],
  commonMistake: 'Assuming Multi-AZ means a DMS full load can never fail or that it automatically makes the source database highly available.',
  example: 'Enable Multi-AZ for a critical CDC task, verify subnet coverage, monitor failover events, and document restart procedures for table-load failures.',
  sources: [{ title: 'Working with a DMS replication instance', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_ReplicationInstance.html' }, { title: 'AWS DMS best practices', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.html' }]
});
