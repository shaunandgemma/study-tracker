import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-14',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB TLS Encryption',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB supports Transport Layer Security (TLS/SSL) encryption in transit to secure network communication between client applications and DocumentDB cluster instances. By default, TLS is enabled on DocumentDB clusters, requiring client applications to connect over encrypted connections using Amazon\'s public Certificate Authority (CA) bundle.',
  whyItMatters: 'TLS encryption in transit prevents eavesdropping, packet sniffing, and man-in-the-middle attacks on sensitive database credentials and JSON document queries travelling over VPC networks.',
  workplaceExample: 'A financial app downloads the official AWS DocumentDB public CA certificate (`global-bundle.pem`) and configures its MongoDB driver to enforce TLS verification (`tls=true&tlsCAFile=global-bundle.pem`), guaranteeing encrypted data transport.',
  examFocus: 'SAA-C03 TLS in Transit details:\n- TLS is enabled by default on DocumentDB clusters (governed by the `tls` cluster parameter).\n- Client applications must download the AWS CA certificate bundle (`global-bundle.pem`) to verify server identity.\n- Can be disabled by setting `tls=disabled` in parameter group (not recommended for production).',
  keyPoints: [
    'Encrypts database network connections in transit between clients and DocumentDB.',
    'Enabled by default via cluster parameter group (`tls=enabled`).',
    'Requires client applications to present or verify the AWS CA certificate (`global-bundle.pem`).',
    'Protects against packet sniffing and man-in-the-middle attacks.',
    'Meets security compliance standards for data in transit.'
  ],
  commonMistake: 'Failing to provide the `global-bundle.pem` CA certificate to application MongoDB drivers, resulting in TLS handshake verification failures when connecting to DocumentDB.',
  example: 'Connecting with TLS in Mongo Shell:\n`mongosh "mongodb://adminuser:password@docdb-cluster.cluster-xyz.us-east-1.docdb.amazonaws.com:27017/test?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred"`',
  sources: [
    { title: 'Encrypting Amazon DocumentDB Data in Transit', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/db-cluster-fault-tolerance.html' }
  ]
});
