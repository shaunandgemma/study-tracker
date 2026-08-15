import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-25',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Proxy',
  status: 'ready',
  plainEnglish: 'Amazon RDS Proxy is a highly available, fully managed database proxy that sits between your application workloads and your RDS / Aurora databases. RDS Proxy pools and reuses database connections, protecting databases from connection exhaustion ("connection storms") caused by serverless architectures (like AWS Lambda) while accelerating failover times by up to 66%.',
  whyItMatters: 'Serverless applications (Lambda) scale by spinning up thousands of concurrent execution environments. Opening thousands of direct database connections consumes all database memory and crashes the database. RDS Proxy pools thousands of incoming application connections into a small set of persistent database connections.',
  workplaceExample: 'A serverless API processes 10,000 requests per minute using AWS Lambda. Instead of opening 10,000 direct database connections, Lambda functions connect to RDS Proxy. RDS Proxy multiplexes traffic over 50 persistent connection pools to the RDS database.',
  examFocus: 'SAA-C03 RDS Proxy Architecture & Use Cases:\n- Connection Pooling: Pools and shares database connections to prevent memory exhaustion from serverless connection bursts.\n- Faster Failover: Reduces Multi-AZ failover times by up to 66% by bypassing DNS propagation lag and maintaining active backend connections.\n- Security Integration: Integrates with AWS Secrets Manager to handle database authentication credentials securely.\n- No Query Rewrite: Applications connect to the RDS Proxy endpoint transparently using standard database drivers.',
  keyPoints: [
    'Fully managed database proxy for connection pooling and multiplexing.',
    'Protects databases from connection storms caused by serverless AWS Lambda scaling.',
    'Accelerates Multi-AZ failover times by up to 66% by bypassing DNS TTL lag.',
    'Integrates natively with AWS Secrets Manager for IAM authentication token translation.',
    'Transparent drop-in replacement using standard PostgreSQL/MySQL database drivers.'
  ],
  commonMistake: 'Connecting thousands of ephemeral Lambda functions directly to an RDS database without RDS Proxy, causing database CPU spikes and `too many connections` errors.',
  example: 'Creating an RDS Proxy via AWS CLI:\naws rds create-db-proxy --db-proxy-name lambda-rds-proxy --engine-family MYSQL --auth SecretArn="arn:aws:secretsmanager:us-east-1:123456789012:secret:db-creds",IAMAuth=DISABLED --role-arn arn:aws:iam::123456789012:role/RDSProxyRole --vpc-subnet-ids subnet-11111111 subnet-22222222',
  sources: [
    { title: 'Managing connections with Amazon RDS Proxy', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html' }
  ]
});
