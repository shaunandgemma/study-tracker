import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-27',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Performance Insights',
  status: 'ready',
  plainEnglish: 'Amazon RDS Performance Insights is an advanced database performance tuning dashboard that visualizes database load based on active sessions ("Database Load"). It measures load in Average Active Sessions (AAS) and correlates performance spikes directly with specific SQL queries, user accounts, client hosts, and wait events (e.g. `IO:DataFileRead` or `Lock:transaction`).',
  whyItMatters: 'Finding which specific SQL statement is causing database slowdowns in traditional monitoring requires parsing huge log files. Performance Insights isolates problematic SQL queries visually in seconds, helping developers optimize indexes and SQL execution.',
  workplaceExample: 'An application experiences slow database responses. The lead developer checks Performance Insights and sees a spike in `Lock:transaction` wait events. Clicking the spike isolates an unindexed `UPDATE` statement blocking concurrent user transactions.',
  examFocus: 'SAA-C03 Performance Insights Features:\n- Metric Unit: Measures load in Average Active Sessions (AAS) compared against Max vCPU capacity line.\n- Wait Events Analysis: Categorizes database wait types (CPU, I/O, Lock, Memory) to identify root cause bottlenecks.\n- Retention Window: 7 days of performance history included for free; expandable up to 2 years for historical reporting.\n- Encryption: Retained performance metrics are encrypted at rest using AWS KMS.',
  keyPoints: [
    'Visualizes database load using Average Active Sessions (AAS) metrics.',
    'Identifies slow SQL queries, top users, host IP addresses, and wait event bottlenecks.',
    'Correlates database load against the instance vCPU capacity baseline.',
    'Includes 7 days of performance history data at no additional cost (expandable to 2 years).',
    'Supports RDS PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, and Aurora engines.'
  ],
  commonMistake: 'Attempting to diagnose specific SQL query wait bottlenecks using standard CloudWatch CPU graphs instead of opening RDS Performance Insights.',
  example: 'Enabling Performance Insights via AWS CLI:\naws rds modify-db-instance --db-instance-identifier prod-db --enable-performance-insights --performance-insights-kms-key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012 --apply-immediately',
  sources: [
    { title: 'Monitoring DB load with Performance Insights on Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerformanceInsights.html' }
  ]
});
