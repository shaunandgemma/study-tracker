import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-24', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Gateway Endpoints for S3 and DynamoDB', status: 'ready',
  plainEnglish: 'A gateway VPC endpoint gives resources in selected route tables private routed access to Amazon S3 or DynamoDB without an internet gateway or NAT device. AWS adds service prefix-list routes with the endpoint as target. Gateway endpoints do not create ENIs and, unlike interface endpoints, do not use AWS PrivateLink.',
  whyItMatters: 'Private workloads often use S3 or DynamoDB heavily. A gateway endpoint keeps that supported traffic on private connectivity, removes dependence on NAT for the route, and has no additional endpoint charge. Access must still be allowed by IAM, resource policies, and the endpoint policy.',
  workplaceExample: 'Private application subnets associate their route tables with S3 and DynamoDB gateway endpoints. The endpoint policy limits approved buckets and tables, and bucket policies use supported endpoint conditions while preserving administrative recovery access.',
  examFocus: 'SAA-C03: gateway endpoints support S3 and DynamoDB, modify selected route tables, use service prefix lists, do not use PrivateLink, and do not require NAT. They are regional and are not transitively usable from a peered VPC.',
  keyPoints: [
    'Gateway endpoints are available for Amazon S3 and DynamoDB.',
    'They add routes to selected VPC route tables using AWS-managed service prefix lists.',
    'They do not create endpoint ENIs or use security groups.',
    'Gateway endpoints do not use AWS PrivateLink.',
    'Endpoint, IAM, bucket, table, and key policies can all affect access.',
    'They are not extended through VPC peering, VPN, or similar edge-to-edge paths.'
  ],
  commonMistake: 'Creating the gateway endpoint but failing to associate the route table used by the private workload, so traffic continues through NAT or fails.',
  example: 'The private route table gains an S3 prefix-list route to vpce-example. General 0.0.0.0/0 traffic still uses NAT, while matching S3 traffic follows the more-specific endpoint route.',
  sources: [{ title: 'Gateway VPC endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html' }]
});
