import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-26', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB VPC Gateway Endpoints', status: 'ready',
  plainEnglish: 'A DynamoDB gateway VPC endpoint adds routes so resources in selected VPC route tables can reach DynamoDB without using an internet gateway or NAT gateway. Endpoint and IAM policies can restrict allowed access.',
  whyItMatters: 'Private workloads can access DynamoDB through the AWS network path while avoiding NAT data-processing cost for that traffic.',
  workplaceExample: 'Lambda functions and EC2 instances in private subnets use a DynamoDB gateway endpoint associated with their route tables and an endpoint policy limited to approved tables.',
  examFocus: 'Gateway endpoints support DynamoDB and S3, have no hourly charge, and are associated with route tables rather than security groups. They do not provide transitive access from every connected network path; review endpoint type and current routing requirements.',
  keyPoints: ['The endpoint creates DynamoDB prefix-list routes.', 'Selected route tables control subnet use.', 'Gateway endpoints do not use security groups.', 'Endpoint policies add a network-path authorization layer.', 'IAM permissions are still required.'],
  commonMistake: 'Creating the endpoint but associating the wrong route table, so private workloads continue using NAT or cannot reach DynamoDB.',
  example: 'Create the gateway endpoint, select private-subnet route tables, apply a least-privilege endpoint policy, and verify the effective route and IAM authorization.',
  sources: [{ title: 'DynamoDB gateway endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-ddb.html' }, { title: 'Infrastructure security in DynamoDB', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/infrastructure-security.html' }]
});
