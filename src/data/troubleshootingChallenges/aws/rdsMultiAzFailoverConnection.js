export default Object.freeze({
  id: 'aws-rds-multi-az-failover-connection',
  examId: 'aws-saa-c03',
  order: 12,
  category: 'Amazon RDS',
  title: 'Investigate an RDS Multi-AZ Failover Connection Failure',
  difficulty: 'Intermediate',
  summary: 'Diagnose why an application cannot reconnect after an RDS Multi-AZ failover.',
  scenario: 'A Multi-AZ RDS MySQL database completed a planned failover successfully. The RDS console shows the database as Available, but the application continues trying to connect to the previous primary and reports database timeouts. New administrative connections that use the RDS endpoint work normally.',
  task: 'Use the supplied failover, DNS, and application evidence to identify why the application did not follow the new primary, make the smallest safe correction, and verify that future failovers can be followed without storing a database IP address.',
  evidence: [
    {
      id: 'rds-failover',
      title: 'RDS Failover Status',
      kind: 'code',
      content: `DB instance: fa-training-orders-db
Deployment: Multi-AZ DB instance
Engine: MySQL
Status: Available
Endpoint: fa-training-orders-db.abcdefghijkl.eu-west-2.rds.amazonaws.com
Port: 3306

Event:
Multi-AZ instance failover completed successfully.

Current DNS result:
fa-training-orders-db.abcdefghijkl.eu-west-2.rds.amazonaws.com -> 10.50.31.78`
    },
    {
      id: 'application-config',
      title: 'Application Database Configuration',
      kind: 'code',
      content: `DB_HOST=10.50.22.41
DB_PORT=3306

Application log:
ERROR database connection timeout to 10.50.22.41:3306
Retry 1 failed
Retry 2 failed
Retry 3 failed`
    },
    {
      id: 'before-failover',
      title: 'Pre-Failover Record',
      kind: 'text',
      content: 'Before the failover, the RDS endpoint resolved to 10.50.22.41. The application team copied that IP into DB_HOST during an earlier diagnostic change. The approved design requires applications to connect using the RDS DNS endpoint, not a fixed database IP address.'
    }
  ],
  successCriteria: [
    'The learner identifies the fixed pre-failover IP address as the reason the application cannot reach the new primary.',
    'The application configuration uses the RDS DNS endpoint instead of 10.50.22.41.',
    'No manual database IP address or public endpoint is introduced.',
    'A final verification reconnects the application successfully and confirms that a later endpoint DNS change can be resolved.'
  ],
  hints: [
    'Compare the current RDS endpoint DNS result with the host value stored in the application configuration.',
    'During an RDS Multi-AZ failover, the database endpoint stays the same but DNS can point that endpoint to a different underlying IP address.',
    'Replace the fixed IP in DB_HOST with fa-training-orders-db.abcdefghijkl.eu-west-2.rds.amazonaws.com and ensure the application does not keep stale DNS information indefinitely.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why does the application remain disconnected after the successful Multi-AZ failover?',
      options: [
        { id: 'cached-ip', text: 'The application is configured with the old primary IP address instead of the RDS DNS endpoint.' },
        { id: 'failover-failed', text: 'The RDS Multi-AZ failover did not complete.' },
        { id: 'wrong-port', text: 'The application is using the wrong MySQL port.' },
        { id: 'needs-public-ip', text: 'The new primary needs a public IP address after failover.' }
      ],
      correctOptionId: 'cached-ip',
      explanation: 'RDS reports the failover complete and the endpoint now resolves to 10.50.31.78, while the application still connects directly to the old address 10.50.22.41.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'use-endpoint', text: 'Configure DB_HOST with the RDS DNS endpoint and use a DNS caching policy that allows address changes to be picked up.' },
        { id: 'new-static-ip', text: 'Replace the old IP with the current RDS IP and keep using fixed addresses.' },
        { id: 'disable-multiaz', text: 'Disable Multi-AZ so the database IP will not change during failover.' },
        { id: 'make-public', text: 'Make the database publicly accessible so the application can reconnect.' }
      ],
      correctOptionId: 'use-endpoint',
      explanation: 'The RDS endpoint is designed to follow the active database after failover, whereas a stored IP can become stale when the underlying primary changes.'
    }
  ],
  solution: {
    rootCause: 'The application was configured with the previous primary database IP address, 10.50.22.41, so it continued targeting the old host after RDS changed the endpoint DNS record during Multi-AZ failover.',
    fix: 'Set DB_HOST to fa-training-orders-db.abcdefghijkl.eu-west-2.rds.amazonaws.com, restart or refresh the application connection pool and DNS cache as needed, and verify successful connections after resolving the endpoint to the current primary.',
    prevention: 'Require applications to use RDS DNS endpoints rather than resolved IP addresses and configure connection pools or runtime DNS caching so endpoint changes are re-resolved promptly after failover.'
  }
});
