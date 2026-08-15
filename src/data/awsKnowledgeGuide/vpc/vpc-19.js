import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-19', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'Elastic IP Addresses', status: 'ready',
  plainEnglish: 'An Elastic IP address is a static public IPv4 address allocated to an AWS account in a Region. It can be associated with supported resources such as an EC2 network interface or a public zonal NAT gateway. The resource normally communicates using its private address while the internet gateway maps the public Elastic IP to it.',
  whyItMatters: 'A stable public address can support allow lists and controlled failover, but public IPv4 addresses are scarce, chargeable resources and create an internet-routable identity. Teams should allocate them only when a fixed address is genuinely required and release unused allocations.',
  workplaceExample: 'A partner requires a fixed source IP for an API allow list. Private workloads send traffic through a controlled public NAT gateway using an Elastic IP. The EIP is tagged, monitored, documented, and removed when the integration ends.',
  examFocus: 'SAA-C03: EIPs are static regional public IPv4 addresses, can be remapped to supported targets, must match relevant network-border requirements, and incur public IPv4-related charges. They do not create routes or open security rules.',
  keyPoints: [
    'An Elastic IP is allocated to an account within an AWS Region.',
    'Association with a supported resource provides a stable public IPv4 identity.',
    'The workload generally sees its private address while the internet gateway performs mapping.',
    'EIPs are subject to quotas, charges, and network-border-group compatibility where applicable.',
    'Reassociation can support recovery patterns, but DNS and managed load balancing are often better application entry designs.',
    'Unused Elastic IP allocations should be identified and released deliberately.'
  ],
  commonMistake: 'Associating an Elastic IP and assuming the instance is reachable even though its subnet lacks an IGW route or its security group blocks the intended traffic.',
  example: 'A NAT gateway uses an EIP to give several private instances one stable outbound IPv4 identity. The partner allow-lists that EIP, while the instances remain without public addresses.',
  sources: [{ title: 'Elastic IP addresses', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html' }]
});
