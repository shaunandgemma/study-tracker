export default Object.freeze({
  id: 'aws-vpc-peering-routing-failure',
  examId: 'aws-saa-c03',
  order: 7,
  category: 'Amazon VPC Peering',
  title: 'Repair a VPC Peering Routing Failure',
  difficulty: 'Intermediate',
  summary: 'Correct a missing route that prevents traffic from completing across an active VPC peering connection.',
  scenario: 'An application in VPC A must connect privately to a database service in VPC B through an existing VPC peering connection. The peering connection is active and the VPC CIDR ranges do not overlap, but the application connection times out. Internet routing, NAT, and replacement of either VPC are not approved fixes.',
  task: 'Use the supplied peering, route-table, and security evidence to identify the missing network path, apply the smallest routing correction, and verify private connectivity in both directions.',
  evidence: [
    {
      id: 'peering-status',
      title: 'VPC peering connection',
      kind: 'code',
      content: `Peering connection: pcx-0trainingpeer
Status: Active
Requester VPC A: vpc-0traininga
CIDR: 10.50.0.0/16
Accepter VPC B: vpc-0trainingb
CIDR: 10.60.0.0/16
CIDR overlap: none`
    },
    {
      id: 'vpc-a-routes',
      title: 'VPC A application subnet route table',
      kind: 'code',
      content: `Destination       Target
10.50.0.0/16      local
10.60.0.0/16      pcx-0trainingpeer`
    },
    {
      id: 'vpc-b-routes',
      title: 'VPC B database subnet route table',
      kind: 'code',
      content: `Destination       Target
10.60.0.0/16      local`
    },
    {
      id: 'connection-boundary',
      title: 'Connection and security evidence',
      kind: 'code',
      content: `Application: 10.50.10.25
Database service: 10.60.20.40:5432
Database security group: TCP 5432 from 10.50.10.0/24 ALLOW
Network ACLs: required application and database traffic ALLOW

Approved path: direct pcx-0trainingpeer only
Do not route this connection through an internet gateway or NAT gateway.`
    }
  ],
  successCriteria: [
    'The learner identifies that VPC B has no route back to the VPC A CIDR through pcx-0trainingpeer.',
    'The VPC B database subnet route table contains 10.50.0.0/16 -> pcx-0trainingpeer.',
    'The existing direct VPC peering design and scoped database security-group rule remain unchanged.',
    'The application can connect privately to 10.60.20.40:5432 and response traffic returns through the same peering connection.'
  ],
  hints: [
    'Compare the peer CIDR route present in the VPC A table with the routes present in the VPC B table.',
    'An active VPC peering connection does not automatically add subnet route-table entries; each side needs a route for traffic that must cross the peer.',
    'Add 10.50.0.0/16 with target pcx-0trainingpeer to the VPC B database subnet route table, then retry the private database connection.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is preventing the database connection from completing?',
      options: [
        { id: 'missing-return-route', text: 'VPC B lacks a route for 10.50.0.0/16 back through the peering connection.' },
        { id: 'overlap', text: 'The two VPCs use overlapping CIDR blocks.' },
        { id: 'inactive-peer', text: 'The VPC peering connection is still pending acceptance.' },
        { id: 'db-sg', text: 'The database security group does not permit port 5432 from the application subnet.' }
      ],
      correctOptionId: 'missing-return-route',
      explanation: 'The peering connection is active, the CIDRs do not overlap, and VPC A has its peer route, but VPC B has no route that sends response traffic to 10.50.0.0/16 through the peer.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective routing correction?',
      options: [
        { id: 'add-peer-route', text: 'Add 10.50.0.0/16 -> pcx-0trainingpeer to the VPC B database subnet route table.' },
        { id: 'default-peer', text: 'Send 0.0.0.0/0 from VPC B through the peering connection.' },
        { id: 'nat-route', text: 'Send 10.50.0.0/16 to a NAT gateway in VPC B.' },
        { id: 'open-db', text: 'Allow database port 5432 from 0.0.0.0/0 instead of changing the route table.' }
      ],
      correctOptionId: 'add-peer-route',
      explanation: 'The specific peer-CIDR route restores the missing return path through the existing direct peering connection without adding internet exposure or unrelated routing.'
    }
  ],
  solution: {
    rootCause: 'The database subnet route table in VPC B had no route for the VPC A CIDR, so response traffic could not return through the otherwise active VPC peering connection.',
    fix: 'Add destination 10.50.0.0/16 with target pcx-0trainingpeer to the VPC B database subnet route table, keep the existing security controls, and verify that 10.50.10.25 can connect privately to 10.60.20.40:5432.',
    prevention: 'Treat VPC peering as a two-sided routing change and verify the required peer-CIDR routes in every associated subnet route table during deployment reviews.'
  }
});
