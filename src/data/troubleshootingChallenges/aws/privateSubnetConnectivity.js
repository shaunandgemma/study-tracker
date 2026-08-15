export default Object.freeze({
  id: 'aws-private-subnet-connectivity',
  examId: 'aws-saa-c03',
  order: 1,
  category: 'Amazon VPC',
  title: 'Restore private-subnet outbound connectivity',
  difficulty: 'Intermediate',
  summary: 'Diagnose why a private EC2 instance cannot reach software repositories.',
  scenario: 'An EC2 application instance has no public IPv4 address and must remain private. Package downloads time out even though its security group allows outbound HTTPS.',
  task: 'Use the supplied route and resource evidence to find the network design fault and restore outbound IPv4 access without making the instance public.',
  evidence: [
    {
      id: 'private-route',
      title: 'Private subnet route table',
      kind: 'code',
      content: `10.20.0.0/16  local
0.0.0.0/0     igw-0123internet`
    },
    {
      id: 'instance',
      title: 'EC2 instance details',
      kind: 'code',
      content: `Subnet: subnet-0private
Private IPv4: 10.20.10.25
Public IPv4: none
Source/destination check: enabled`
    },
    {
      id: 'nat',
      title: 'Available NAT gateway',
      kind: 'code',
      content: `nat-0abc123
State: Available
Subnet: subnet-0public
Connectivity type: Public`
    }
  ],
  successCriteria: [
    'The instance remains without a public IPv4 address.',
    'The private route table sends 0.0.0.0/0 to nat-0abc123.',
    'The NAT gateway remains in the public subnet with internet-gateway routing.',
    'Outbound HTTPS succeeds while unsolicited inbound internet traffic remains unavailable.'
  ],
  hints: [
    'An internet gateway does not translate a private-only IPv4 source address.',
    'A public NAT gateway accepts private-subnet traffic and uses its public address for internet access.',
    'Replace the private route table default target with nat-0abc123.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the existing internet-gateway route not work for this instance?',
      options: [
        { id: 'no-public-ip', text: 'The instance has no public IPv4 address for direct internet-gateway communication.' },
        { id: 'sg', text: 'Security groups cannot allow HTTPS.' },
        { id: 'local', text: 'The local VPC route blocks all other routes.' },
        { id: 'src-dst', text: 'Source/destination checking must be disabled on every instance.' }
      ],
      correctOptionId: 'no-public-ip',
      explanation: 'An IPv4 instance needs a public address for direct internet-gateway connectivity. This private workload should instead use NAT for outbound internet access.'
    },
    {
      id: 'fix',
      prompt: 'What should be the private route table target for 0.0.0.0/0?',
      options: [
        { id: 'nat', text: 'nat-0abc123' },
        { id: 'igw', text: 'igw-0123internet' },
        { id: 'local', text: 'local' },
        { id: 'instance', text: '10.20.10.25' }
      ],
      correctOptionId: 'nat',
      explanation: 'The private subnet sends internet-bound IPv4 traffic to the available public NAT gateway, which then reaches the internet gateway from its public subnet.'
    }
  ],
  solution: {
    rootCause: 'The private route table incorrectly targeted the internet gateway even though the instance had no public IPv4 address.',
    fix: 'Change the private route table default route to nat-0abc123 and verify that the NAT gateway public subnet routes to the internet gateway.',
    prevention: 'Use separate public and private route tables and review both the route target and workload addressing when diagnosing connectivity.'
  }
});
