import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-6',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Instances',
  status: 'ready',
  plainEnglish: 'An Amazon EC2 (Elastic Compute Cloud) Instance is a virtual server in the AWS cloud that provides resizable compute capacity. Instead of purchasing physical hardware, you launch virtual machines on demand, choosing OS, CPU cores, RAM, and storage size. You pay only for the compute capacity you consume.',
  whyItMatters: 'EC2 is the backbone of AWS compute infrastructure. It lets organizations scale web servers, backend applications, and databases globally in seconds without capital expenditure on physical servers.',
  workplaceExample: 'A startup launches three EC2 instances running Linux and Node.js to host their web app. As user traffic spikes during a product launch, they spin up five additional EC2 instances instantly to handle the load.',
  examFocus: 'For SAA-C03, understand that EC2 is an Infrastructure as a Service (IaaS) offering. You are responsible for OS patching, software security, network security groups, and data backup, while AWS manages the underlying physical hypervisor and hardware.',
  keyPoints: [
    'Virtual servers in AWS providing resizable compute capacity.',
    'IaaS model: customer manages OS, software, and application security.',
    'Pay-as-you-go pricing based on instance type and runtime.',
    'Supports diverse operating systems (Linux, Windows, macOS).',
    'Integrates with EBS for persistent block storage and VPC for networking.'
  ],
  commonMistake: 'Believing AWS automatically patches the operating system on standard EC2 instances. In IaaS, OS patching is the customer\'s responsibility.',
  example: 'AWS CLI Command to launch an EC2 instance:\n`aws ec2 run-instances --image-id ami-0abcdef1234567890 --instance-type t3.micro --key-name MyKeyPair --security-group-ids sg-0123456789abcdef0`',
  sources: [
    { title: 'What is Amazon EC2?', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html' }
  ]
});
