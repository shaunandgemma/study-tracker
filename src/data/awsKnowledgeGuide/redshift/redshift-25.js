import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-25',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Enhanced VPC Routing',
  status: 'ready',
  plainEnglish: 'Enhanced VPC Routing forces all network traffic between your Amazon Redshift cluster and external data repositories (such as Amazon S3 COPY/UNLOAD operations or Redshift Spectrum queries) to flow strictly through your Amazon Virtual Private Cloud (VPC) network instead of the public internet.',
  whyItMatters: 'By default, Redshift routes S3 COPY and UNLOAD traffic over the AWS public network infrastructure. Enabling Enhanced VPC Routing forces traffic through your private VPC subnets, enabling VPC Security Groups, Network ACLs, and S3 VPC Gateway Endpoints to inspect and secure the data path.',
  workplaceExample: 'A security-focused bank enables Enhanced VPC Routing on their Redshift cluster. All S3 COPY data ingestion traffic is routed privately through an S3 VPC Gateway Endpoint, ensuring data files never touch the public internet.',
  examFocus: 'SAA-C03 Enhanced VPC Routing Networking Rules:\n- Network Isolation: Forces all S3 `COPY`, `UNLOAD`, and Spectrum traffic through VPC subnets and route tables.\n- Prerequisite Setup: You MUST configure appropriate VPC Route Tables, S3 VPC Gateway Endpoints, and NAT Gateways (if accessing external repositories).\n- Connection Failures: If Enhanced VPC Routing is enabled without an S3 VPC Endpoint or NAT Gateway, `COPY` and `UNLOAD` commands will time out.',
  keyPoints: [
    'Forces S3 `COPY`, `UNLOAD`, and Spectrum traffic through your private VPC network.',
    'Prevents data ingestion and export traffic from traversing public internet routes.',
    'Enables VPC Flow Logs, Security Groups, and Network ACL auditing for data loads.',
    'Requires provisioning S3 VPC Gateway Endpoints or NAT Gateways in your VPC route table.',
    'Must be enabled in cluster configuration settings.'
  ],
  commonMistake: 'Enabling Enhanced VPC Routing without creating an S3 VPC Gateway Endpoint in the VPC route table, causing all `COPY` and `UNLOAD` operations to time out.',
  example: 'Enabling Enhanced VPC Routing via AWS CLI:\naws redshift modify-cluster --cluster-identifier prod-cluster --enhanced-vpc-routing',
  sources: [
    { title: 'Amazon Redshift Enhanced VPC Routing', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/enhanced-vpc-routing.html' }
  ]
});
