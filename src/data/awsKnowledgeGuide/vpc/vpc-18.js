import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-18', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Elastic Network Interfaces - ENIs', status: 'ready',
  plainEnglish: 'An elastic network interface is a virtual network card in a VPC. It belongs to a subnet and can have a primary private IPv4 address, secondary addresses, IPv6 addresses, security groups, a MAC address, and other attributes. Many AWS networking resources create and manage ENIs in customer VPCs.',
  whyItMatters: 'ENIs are where addressing and security groups meet a resource. Understanding ownership, subnet placement, attachment state, and addresses helps troubleshoot EC2, load balancers, endpoints, databases, NAT, and managed services. A service-managed ENI should not be deleted casually.',
  workplaceExample: 'An engineer investigates why a private endpoint is unreachable. They locate its ENIs in the selected subnets, confirm private DNS resolution, examine the attached security group, and verify that client routes and NACLs allow traffic to those private IP addresses.',
  examFocus: 'SAA-C03: ENIs are AZ-scoped through their subnet, carry private addresses and security groups, and can be attached or detached only within supported rules. Public IPv4 mapping is not itself stored as a second address visible to the guest OS.',
  keyPoints: [
    'An ENI is created in one subnet and therefore one Availability Zone.',
    'It has a primary private IPv4 address and can have supported secondary IPv4 or IPv6 addresses.',
    'Security groups are associated with ENIs rather than subnets.',
    'Some ENIs are requester-managed by AWS services and have restricted lifecycle operations.',
    'Secondary ENIs can support management, inspection, or application network separation where the service permits it.',
    'Flow Logs and resource descriptions can help trace traffic to specific ENIs.'
  ],
  commonMistake: 'Deleting an unfamiliar ENI because it appears unattached to an EC2 instance, without checking whether a managed service such as a load balancer, endpoint, database, or Lambda integration owns it.',
  example: 'A service endpoint creates an ENI with a private IP in each chosen subnet. Clients reach those addresses through VPC routing, and the endpoint ENI security group permits only the required client source and port.',
  sources: [{ title: 'Elastic network interfaces', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html' }]
});
