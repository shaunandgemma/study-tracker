export default Object.freeze({
  id: 'aws-dynamodb-hot-partition-throttling',
  examId: 'aws-saa-c03',
  order: 14,
  category: 'Amazon DynamoDB',
  title: 'Repair DynamoDB Throttling from a Hot Partition',
  difficulty: 'Intermediate',
  summary: 'Use throttling and request-distribution evidence to diagnose an uneven DynamoDB partition key.',
  scenario: 'The fa-training-device-events DynamoDB table receives telemetry from thousands of devices. During the morning reporting window, writes begin returning throttling errors even though the table-wide consumed capacity remains below the configured provisioned capacity. The application must continue storing every device event, and simply granting broader IAM permissions is not an approved change.',
  task: 'Use the supplied capacity, throttling, and request-distribution evidence to identify the primary cause, choose a correction that distributes new writes more evenly, and verify that throttling falls without weakening access controls.',
  evidence: [
    {
      id: 'table-capacity',
      title: 'Table Capacity and Throttling',
      kind: 'code',
      content: `Table: fa-training-device-events
Billing mode: PROVISIONED
Provisioned write capacity: 5000 WCU
Average consumed write capacity: 2380 WCU
Peak consumed write capacity: 3140 WCU

CloudWatch during incident:
WriteThrottleEvents: 1864
SuccessfulRequestLatency: elevated

Application error:
ThrottlingException
ThrottlingReason: TableWriteKeyRangeThroughputExceeded
Resource: arn:aws:dynamodb:eu-west-2:123456789012:table/fa-training-device-events`
    },
    {
      id: 'key-design',
      title: 'Current Key Design',
      kind: 'code',
      content: `Partition key: status
Sort key: eventTimestamp

Example writes:
status=ACTIVE, eventTimestamp=2026-08-19T08:10:01Z
status=ACTIVE, eventTimestamp=2026-08-19T08:10:02Z
status=ACTIVE, eventTimestamp=2026-08-19T08:10:03Z
status=OFFLINE, eventTimestamp=2026-08-19T08:10:04Z

Device identifier is stored as a normal attribute:
deviceId=dev-10001
deviceId=dev-10002
deviceId=dev-10003`
    },
    {
      id: 'request-distribution',
      title: 'Contributor Insights Summary',
      kind: 'code',
      content: `Top partition-key contributors to throttled writes:

status=ACTIVE   92%
status=OFFLINE   5%
status=ERROR     3%

Active devices during incident: 18,400
Approximate writes per second for ACTIVE events: 1,850

Approved design note:
New event writes may use a higher-cardinality key derived from deviceId.
The reporting requirement to query by status can be supported separately from the base-table partition key.`
    }
  ],
  successCriteria: [
    'The learner identifies the low-cardinality status partition key as the source of the hot write concentration.',
    'New event writes are distributed using a higher-cardinality partition-key design based on device identity or controlled write sharding.',
    'The reporting requirement remains available without making status the concentrated base-table partition key.',
    'A final load test shows throttled writes fall to an acceptable level while all intended events continue to be stored.'
  ],
  hints: [
    'Compare total table consumption with the throttling reason and the Contributor Insights distribution.',
    'DynamoDB distributes items using the partition-key value, so many writes using the same value can concentrate traffic even when table-wide capacity is available.',
    'The value ACTIVE receives almost all writes; redesign new writes around a higher-cardinality device-based key, or an appropriate shard of that key, and keep status as a separate query attribute or index requirement.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is the primary cause of the DynamoDB throttling?',
      options: [
        { id: 'hot-status-key', text: 'The low-cardinality status partition key concentrates most writes on the ACTIVE key range, creating a hot partition.' },
        { id: 'table-capacity', text: 'The table has exhausted all 5000 provisioned write capacity units across every partition.' },
        { id: 'iam-deny', text: 'The application role lacks dynamodb:PutItem permission.' },
        { id: 'sort-key', text: 'Using a timestamp as a sort key always causes DynamoDB throttling.' }
      ],
      correctOptionId: 'hot-status-key',
      explanation: 'The throttling reason is TableWriteKeyRangeThroughputExceeded and Contributor Insights shows 92 percent of throttled writes using status=ACTIVE while total table consumption remains below provisioned capacity.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective long-term correction?',
      options: [
        { id: 'better-partition-key', text: 'Move new writes to a design with a higher-cardinality device-based partition key or controlled write sharding, while preserving status-based reporting separately.' },
        { id: 'admin-access', text: 'Grant the application AdministratorAccess so DynamoDB can distribute the writes automatically.' },
        { id: 'only-add-capacity', text: 'Increase table WCU indefinitely without changing the concentrated key design.' },
        { id: 'remove-events', text: 'Drop ACTIVE events during busy periods to reduce traffic.' }
      ],
      correctOptionId: 'better-partition-key',
      explanation: 'The evidence shows an uneven access pattern rather than a table-wide capacity shortage, so distributing writes across more partition-key values addresses the actual bottleneck.'
    }
  ],
  solution: {
    rootCause: 'The table uses status as its partition key, and 92 percent of throttled writes use status=ACTIVE. This low-cardinality design concentrates a large share of traffic on the same key range and produces TableWriteKeyRangeThroughputExceeded throttling.',
    fix: 'Adopt a higher-cardinality partition-key design for new events, such as a deviceId-based key or controlled device-based write sharding, preserve status as an attribute or separate query access pattern, and repeat the workload while monitoring WriteThrottleEvents and request distribution.',
    prevention: 'Review DynamoDB access patterns before table creation, load-test expected high-volume keys, and monitor throttling reasons plus Contributor Insights so concentrated keys are detected before they affect production traffic.'
  }
});
