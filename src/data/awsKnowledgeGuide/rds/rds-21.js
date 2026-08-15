import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-21',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Security Groups and VPC Deployment',
  status: 'ready',
  plainEnglish: 'RDS Security Groups act as a stateful virtual firewall controlling inbound network traffic to an RDS DB instance. Following AWS security best practices, RDS instances must always be deployed in Private Subnets with Public Accessibility disabled (`PubliclyAccessible = false`), allowing inbound traffic ONLY from authorized application security groups on the specific database engine port.',
  whyItMatters: 'Exposing a database instance to the public internet (`PubliclyAccessible = true`) invites brute-force password attacks and vulnerability scans. Placing RDS in private subnets with strict security groups guarantees network isolation.',
  workplaceExample: 'A cloud architect configures an RDS Security Group (`sg-database`) with an inbound rule allowing TCP port 5432 (PostgreSQL) ONLY from the web application security group (`sg-web-app`). Direct internet traffic is blocked entirely.',
  examFocus: 'SAA-C03 Database Security Best Practices:\n- Private Subnet Deployment: Always deploy production RDS DB instances in private subnets (no public IP addresses assigned).\n- Security Group Chaining: Reference source security groups (e.g. `Allow port 3306 from sg-web-server`) rather than opening broad IP CIDR ranges.\n- Public Accessibility: Keep `PubliclyAccessible = false`; never enable public access as a connection troubleshooting shortcut.\n- Stateful Rules: Security group inbound rules automatically allow return outbound traffic.',
  keyPoints: [
    'Stateful firewall controlling inbound network access to the RDS DB instance.',
    'Best practice mandates deploying RDS in private subnets with `PubliclyAccessible = false`.',
    'Inbound rules should reference application Security Groups rather than open IP CIDR blocks.',
    'Must explicitly open the engine port (e.g. 3306 for MySQL, 5432 for PostgreSQL, 1433 for MSSQL).',
    'Enforces absolute network isolation from unauthorized public internet access.'
  ],
  commonMistake: 'Enabling `PubliclyAccessible = true` and opening security group port 3306 to `0.0.0.0/0` to solve a connection issue, exposing the database to the entire internet.',
  example: 'Creating a Database Security Group Rule via AWS CLI:\naws ec2 authorize-security-group-ingress --group-id sg-0123456789db --protocol tcp --port 5432 --source-group sg-0987654321app',
  sources: [
    { title: 'Controlling access with security groups in Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html' }
  ]
});
