import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-19',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Encryption in Transit with TLS',
  status: 'ready',
  plainEnglish: 'RDS Encryption in Transit secures network traffic between application client connections and the Amazon RDS database instance using Transport Layer Security (TLS / SSL). AWS provisions an official SSL/TLS Certificate Authority (CA) on every RDS instance, encrypting queries, SQL results, and credentials sent across the network.',
  whyItMatters: 'Unencrypted network connections allow attackers on the same network subnet to inspect plaintext SQL database queries, passwords, and sensitive customer data using packet sniffers. TLS encryption guarantees network confidentiality.',
  workplaceExample: 'A security team enforces SSL in the RDS PostgreSQL Parameter Group by setting `rds.force_ssl = 1`. All incoming application JDBC connection attempts without valid TLS certificates are immediately rejected by the database.',
  examFocus: 'SAA-C03 TLS Encryption & Certificate Rules:\n- Enforcement via Parameter Groups: Enforce mandatory SSL/TLS connections in engine parameter groups (e.g. `rds.force_ssl = 1` for PostgreSQL, `require_secure_transport = ON` for MySQL).\n- CA Certificate Updates: AWS periodically rotates RDS Root CA Certificates (e.g. `rds-ca-rsa2048-g1`); client applications must download updated CA bundles.\n- Transport vs Storage Encryption: TLS secures data in transit over the network; KMS secures data at rest on disk storage.',
  keyPoints: [
    'Encrypts network traffic between client applications and RDS DB instances using TLS/SSL.',
    'AWS provisions Root CA certificates on RDS instances automatically.',
    'Can be forcibly mandated via Parameter Group parameters (`rds.force_ssl`, `require_secure_transport`).',
    'Requires client applications to import AWS Root CA certificates for SSL verification.',
    'Secures data in transit across public or private VPC subnets.'
  ],
  commonMistake: 'Confusing KMS Storage Encryption (encrypting disk blocks at rest) with TLS Encryption in Transit (encrypting SQL traffic over the network).',
  example: 'Connecting to RDS MySQL using SSL Certificate in CLI:\nmysql -h prod-db.c123.us-east-1.rds.amazonaws.com --ssl-ca=/etc/ssl/certs/global-bundle.pem -u dbadmin -p',
  sources: [
    { title: 'Using SSL/TLS to encrypt a connection to a DB instance', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html' }
  ]
});
