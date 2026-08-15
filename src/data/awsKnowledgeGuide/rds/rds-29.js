import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-29',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Failover Behavior',
  status: 'ready',
  plainEnglish: 'RDS Failover Behavior describes the automated recovery workflow executed by Amazon RDS during a Multi-AZ primary database failure. When an outage occurs (due to hardware failure, AZ power loss, or OS reboot), RDS updates the database endpoint DNS CNAME record to point to the Standby DB instance in under 60-120 seconds.',
  whyItMatters: 'Applications must handle database failover gracefully. During a failover event, existing TCP database connections are severed. Applications must implement connection retry logic to reconnect to the updated DNS CNAME endpoint.',
  workplaceExample: 'An Availability Zone experiences a network partition. RDS detects the primary instance failure, promotes the standby instance, and flips the DNS CNAME record. The application connection pool catches the connection drop and reconnects automatically in 90 seconds.',
  examFocus: 'SAA-C03 Failover Mechanics & Application Rules:\n- Endpoint Preservation: The database connection string URI (e.g. `prod-db.c123.us-east-1.rds.amazonaws.com`) remains IDENTICAL before and after failover.\n- DNS CNAME Flip: Failover changes the DNS CNAME record from Primary IP to Standby IP.\n- Connection Interruption: Existing database connections ARE severed; applications must retry connections.\n- DNS Caching Warning: Application DNS caching TTL must be kept low (e.g. 30 seconds) to ensure quick reconnection to the new primary IP.',
  keyPoints: [
    'Automated recovery workflow during primary DB instance or Availability Zone failure.',
    'Updates database DNS CNAME record to point to promoted Standby instance IP.',
    'DB Endpoint URI string remains unchanged throughout failover.',
    'Existing database TCP connections are severed during failover.',
    'Applications must implement connection retry logic and low DNS TTL settings.'
  ],
  commonMistake: 'Caching database IP addresses indefinitely in application code instead of resolving the DB endpoint DNS CNAME, causing application connections to fail post-failover.',
  example: 'Testing Manual Multi-AZ Failover via AWS CLI:\naws rds reboot-db-instance --db-instance-identifier prod-db --force-failover',
  sources: [
    { title: 'Failover process for Amazon RDS Multi-AZ deployments', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover' }
  ]
});
