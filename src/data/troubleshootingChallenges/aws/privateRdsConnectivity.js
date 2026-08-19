export default Object.freeze({
  id: 'aws-private-rds-connectivity',
  examId: 'aws-saa-c03',
  order: 11,
  category: 'Amazon RDS',
  title: 'Restore Connectivity to a Private RDS Database',
  difficulty: 'Intermediate',
  summary: 'Diagnose why an application server cannot connect to a private RDS database.',
  scenario: 'A private EC2 application instance named fa-training-app-01 can resolve the DNS name of a private MySQL RDS database, but every connection attempt to port 3306 times out. The application and database are in the same VPC, the database must remain private, and no public access or broad CIDR-based database rule is approved.',
  task: 'Use the supplied network and security evidence to identify the cause of the timeout, choose the smallest safe correction, and verify database connectivity without making the RDS instance public.',
  evidence: [
    {
      id: 'connection-test',
      title: 'Application Connection Test',
      kind: 'code',
      content: `Application instance: i-0trainingapp123
Application security group: sg-0appnew123

RDS endpoint:
fa-training-db.abcdefghijkl.eu-west-2.rds.amazonaws.com
Port: 3306
Publicly accessible: No

DNS lookup:
fa-training-db.abcdefghijkl.eu-west-2.rds.amazonaws.com -> 10.50.21.84

Connection test:
$ nc -vz fa-training-db.abcdefghijkl.eu-west-2.rds.amazonaws.com 3306
nc: connect to fa-training-db.abcdefghijkl.eu-west-2.rds.amazonaws.com port 3306 (tcp) timed out`
    },
    {
      id: 'rds-security-group',
      title: 'RDS Security Group',
      kind: 'code',
      content: `RDS security group: sg-0dbtraining123

Inbound rules:
MySQL/Aurora | TCP | 3306 | Source: sg-0appold456

Application instance security group:
sg-0appnew123

Application outbound rules:
All traffic | All | 0.0.0.0/0`
    },
    {
      id: 'network-boundary',
      title: 'VPC and Routing Check',
      kind: 'text',
      content: 'The application and RDS database are both in VPC vpc-0training123. Their subnets use the same VPC local route, VPC DNS support is enabled, and the subnet network ACLs allow the required traffic. The database must stay private and may accept MySQL only from the current application security group.'
    }
  ],
  successCriteria: [
    'The learner identifies the security-group source mismatch as the cause of the timeout.',
    'The RDS security group permits TCP 3306 from sg-0appnew123 only.',
    'The database remains private and no broad internet or VPC-wide inbound rule is added.',
    'A final connection test from the application instance to the RDS DNS endpoint on port 3306 succeeds.'
  ],
  hints: [
    'Compare the security group currently attached to the application instance with the source allowed by the RDS inbound rule.',
    'Security-group references allow access based on the source resource security group rather than a changing private IP address.',
    'Replace the obsolete application security-group source on the database rule with sg-0appnew123 and retest port 3306.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is causing the application connection to the private RDS database to time out?',
      options: [
        { id: 'wrong-sg-source', text: 'The RDS security group allows the old application security group instead of the security group attached to the current application instance.' },
        { id: 'rds-private', text: 'The RDS database is not publicly accessible.' },
        { id: 'dns-failure', text: 'VPC DNS support is disabled.' },
        { id: 'missing-nat', text: 'The RDS subnet has no NAT gateway route.' }
      ],
      correctOptionId: 'wrong-sg-source',
      explanation: 'DNS resolves correctly and both resources are in the same VPC, but the RDS rule trusts sg-0appold456 while the current application uses sg-0appnew123.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'allow-current-app-sg', text: 'Allow TCP 3306 on the RDS security group from sg-0appnew123 and remove the obsolete source if it is no longer required.' },
        { id: 'make-public', text: 'Make the RDS instance publicly accessible and allow port 3306 from the internet.' },
        { id: 'allow-vpc-cidr', text: 'Allow port 3306 from the entire VPC CIDR even though only the application requires access.' },
        { id: 'add-nat', text: 'Add a NAT gateway route to the database subnet.' }
      ],
      correctOptionId: 'allow-current-app-sg',
      explanation: 'Allowing only the current application security group restores the required database path while preserving the private, least-privilege design.'
    }
  ],
  solution: {
    rootCause: 'The RDS security group still allows MySQL traffic from obsolete security group sg-0appold456, while the rebuilt application instance now uses sg-0appnew123.',
    fix: 'Update the RDS security-group inbound rule to allow TCP 3306 from sg-0appnew123, remove the obsolete source if unused, and verify that the application can connect to the RDS DNS endpoint on port 3306.',
    prevention: 'Reference stable application security groups in infrastructure configuration and include an automated connectivity check whenever application instances or security-group attachments are replaced.'
  }
});
