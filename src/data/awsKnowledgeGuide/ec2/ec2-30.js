import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-30',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 Elastic Network Interfaces - ENIs',
  objectiveCode: 'Compute',
  title: 'EC2 Elastic Network Interfaces - ENIs',
  status: 'ready',
  plainEnglish: 'An Elastic Network Interface (ENI) is a virtual network interface card (vNIC) in a VPC that you can attach to an EC2 instance. An ENI includes a primary private IPv4 address, optional secondary private IPv4 addresses, one Elastic IP address per private IP, a MAC address, security group associations, and a source/destination check flag.',
  whyItMatters: 'ENIs allow network customization. You can create dual-homed instances (connected to management and data subnets), hot-swap network interfaces between instances for quick failover, or run network security virtual appliances.',
  workplaceExample: 'A company builds a high-availability licensing server. They create a secondary ENI with a fixed private IP address. If the primary EC2 server fails, an automated script detaches the ENI and attaches it to a standby EC2 instance in seconds, preserving the IP connection.',
  examFocus: 'SAA-C03 ENI rules:\n- Primary ENI (`eth0`): Cannot be detached from an instance.\n- Secondary ENIs: Can be hot-attached and detached dynamically between instances within the SAME Availability Zone.\n- ENIs are bound to a specific Availability Zone (cannot move an ENI to an instance in a different AZ).',
  keyPoints: [
    'Virtual network interface card representing a network connection in a VPC.',
    'Attributes: Primary/Secondary private IPs, Elastic IP, MAC address, Security Groups.',
    'Primary ENI (eth0) is permanent; Secondary ENIs can be attached/detached.',
    'Bound to a specific Availability Zone (cannot cross AZ boundaries).',
    'Used for high availability failover, management networks, and virtual appliances.'
  ],
  commonMistake: 'Attempting to attach a secondary ENI created in `us-east-1a` to an EC2 instance running in `us-east-1b`. ENIs are locked to their creation Availability Zone.',
  example: 'Attaching a secondary ENI via AWS CLI:\n`aws ec2 attach-network-interface --network-interface-id eni-0123456789abcdef0 --instance-id i-0987654321fedcba0 --device-index 1`',
  sources: [
    { title: 'Elastic network interfaces', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html' }
  ]
});
