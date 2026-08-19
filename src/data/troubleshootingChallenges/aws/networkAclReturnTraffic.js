export default Object.freeze({
  id: 'aws-network-acl-return-traffic',
  examId: 'aws-saa-c03',
  order: 6,
  category: 'Amazon VPC Network ACLs',
  title: 'Diagnose a Network ACL Return-Traffic Failure',
  difficulty: 'Intermediate',
  summary: 'Identify a missing ephemeral-port rule that blocks responses from an otherwise reachable service.',
  scenario: 'An application instance in one private subnet connects to an HTTPS service in another private subnet. The request reaches the service, but the client times out waiting for the response. Security groups are already scoped correctly and must not be broadened.',
  task: 'Inspect the connection details, security groups, network ACL rules, and rejected return traffic to identify the fault, correct only the required network ACL path, and verify the HTTPS request succeeds.',
  evidence: [
    {
      id: 'connection-test',
      title: 'Client connection test',
      kind: 'code',
      content: `Client: 10.42.10.25
Client subnet: 10.42.10.0/24
Service: 10.42.20.40:443
Service subnet: 10.42.20.0/24
Observed client source port: 53144

$ curl --connect-timeout 5 https://10.42.20.40/health
curl: (28) Connection timed out after 5001 milliseconds`
    },
    {
      id: 'security-groups',
      title: 'Security group summary',
      kind: 'code',
      content: `Client security group sg-0trainingclient
Outbound: TCP 443 -> sg-0trainingservice

Service security group sg-0trainingservice
Inbound: TCP 443 <- sg-0trainingclient
Outbound: all traffic

Security groups are stateful.`
    },
    {
      id: 'service-nacl',
      title: 'Service subnet network ACL and traffic observation',
      kind: 'code',
      content: `Inbound rules
100  TCP  443  Source 10.42.10.0/24  ALLOW
*    ALL  ALL  Source 0.0.0.0/0      DENY

Outbound rules
100  TCP  443  Destination 10.42.10.0/24  ALLOW
*    ALL  ALL  Destination 0.0.0.0/0      DENY

Observed return packet
10.42.20.40:443 -> 10.42.10.25:53144  REJECT`
    },
    {
      id: 'network-standard',
      title: 'Approved network boundary',
      kind: 'text',
      content: 'For this training network, return TCP traffic from the service subnet to the client subnet may use destination ports 1024-65535. Keep the rule limited to 10.42.10.0/24; do not allow all outbound traffic to 0.0.0.0/0.'
    }
  ],
  successCriteria: [
    'The learner identifies that the service subnet network ACL blocks return traffic destined for the client ephemeral port.',
    'An outbound ALLOW rule permits TCP destination ports 1024-65535 from the service subnet to 10.42.10.0/24 before the deny rule.',
    'The existing security-group scope remains unchanged and no 0.0.0.0/0 allow rule is introduced.',
    'The HTTPS health request succeeds and return traffic to the client ephemeral port is no longer rejected.'
  ],
  hints: [
    'Compare the destination port of the rejected return packet with the outbound ports allowed by the service subnet network ACL.',
    'Network ACLs are stateless, so allowed inbound request traffic does not automatically permit the response in the opposite direction.',
    'Add an outbound ALLOW rule for TCP destination ports 1024-65535 to 10.42.10.0/24 before the deny rule, then repeat the HTTPS test.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the client time out even though the service receives the HTTPS request?',
      options: [
        { id: 'missing-ephemeral', text: 'The service subnet network ACL does not allow the response to the client ephemeral port.' },
        { id: 'client-sg', text: 'Security groups require an inbound rule for every response packet.' },
        { id: 'wrong-service-port', text: 'HTTPS responses must leave the service on destination port 443.' },
        { id: 'public-ip', text: 'Both private instances need public IPv4 addresses to communicate across subnets.' }
      ],
      correctOptionId: 'missing-ephemeral',
      explanation: 'The return packet is destined for client port 53144, but the stateless network ACL allows outbound traffic only to destination port 443, so the response is rejected.'
    },
    {
      id: 'safe-resolution',
      prompt: 'Which correction restores the connection while staying inside the approved boundary?',
      options: [
        { id: 'ephemeral-to-client', text: 'Allow outbound TCP 1024-65535 to 10.42.10.0/24 before the deny rule.' },
        { id: 'allow-all', text: 'Allow all outbound traffic to 0.0.0.0/0.' },
        { id: 'open-sg', text: 'Change both security groups to allow all traffic from 0.0.0.0/0.' },
        { id: 'disable-nacl', text: 'Remove the network ACL from the VPC.' }
      ],
      correctOptionId: 'ephemeral-to-client',
      explanation: 'The bounded ephemeral-port rule permits the required stateless return path to the known client subnet without opening unrelated destinations.'
    }
  ],
  solution: {
    rootCause: 'The service subnet network ACL allowed the inbound HTTPS request on port 443 but did not allow the outbound response to the client ephemeral port, so the stateless ACL rejected return traffic.',
    fix: 'Add an outbound ALLOW rule before the deny rule for TCP destination ports 1024-65535 to 10.42.10.0/24, keep the security groups unchanged, and repeat the HTTPS health request to confirm the response succeeds.',
    prevention: 'Review both directions of every custom network ACL rule set and include approved ephemeral-port return ranges in subnet connectivity tests.'
  }
});
