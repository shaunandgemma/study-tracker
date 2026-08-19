export default Object.freeze({
  id: 'aws-rds-read-replica-lag',
  examId: 'aws-saa-c03',
  order: 13,
  category: 'Amazon RDS',
  title: 'Diagnose RDS Read Replica Lag',
  difficulty: 'Intermediate',
  summary: 'Use replication and performance evidence to determine why a read replica is falling behind.',
  scenario: 'An RDS MySQL read replica used by the reporting service is returning data several minutes behind the source database during business hours. Replication is still running and no replication error is reported. The source database remains healthy, but lag on the replica grows whenever reporting traffic peaks.',
  task: 'Use the supplied CloudWatch and workload evidence to identify the primary cause of the lag, select the safest effective correction, and verify that replication catches up without redirecting writes to the replica.',
  evidence: [
    {
      id: 'replication-metrics',
      title: 'RDS Replication Metrics',
      kind: 'code',
      content: `Source DB: fa-training-orders-db
Source class: db.m6g.large

Read replica: fa-training-orders-ro-1
Replica class: db.t4g.micro
Replication state: Replicating

CloudWatch during reporting peak:
ReplicaLag: 428 seconds
Replica CPUUtilization: 98%
Replica FreeableMemory: 96 MiB
Replica DiskQueueDepth: 18.7

Source CPUUtilization: 42%
Source FreeableMemory: 2.9 GiB
Source DiskQueueDepth: 0.8`
    },
    {
      id: 'workload-observation',
      title: 'Reporting Workload',
      kind: 'code',
      content: `Reporting queries:
- 14 concurrent SELECT sessions
- several full-table aggregation queries
- no INSERT, UPDATE, DELETE, or DDL issued by reporting service

Observed behaviour:
09:00 ReplicaLag: 12 seconds
09:10 Reporting job starts
09:20 Replica CPU: 98%
09:20 ReplicaLag: 186 seconds
09:30 ReplicaLag: 428 seconds
10:05 Reporting job ends
10:20 ReplicaLag: 36 seconds`
    },
    {
      id: 'change-boundary',
      title: 'Approved Change Boundary',
      kind: 'text',
      content: 'The reporting service must continue using a read replica and must not send writes to it. The source database has adequate capacity. A larger replica class is approved if the evidence shows the replica is resource constrained.'
    }
  ],
  successCriteria: [
    'The learner identifies replica resource saturation during reporting load as the main cause of the increasing replication lag.',
    'The correction increases or otherwise provides adequate capacity for the read replica without changing the source unnecessarily.',
    'The reporting service remains read-only and continues to use the replica.',
    'A final verification shows ReplicaLag falling to an acceptable level while the reporting workload runs.'
  ],
  hints: [
    'Compare CPU, memory, and disk queue measurements on the source database with the same measurements on the replica.',
    'A read replica must both serve read queries and apply replication changes; if its resources are saturated, applying source changes can fall behind.',
    'The source is healthy while the much smaller replica reaches 98 percent CPU and low free memory, so test a right-sized replica class and watch ReplicaLag during the same reporting workload.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What best explains the replica lag shown by the evidence?',
      options: [
        { id: 'replica-capacity', text: 'The read replica is resource constrained by the reporting workload and cannot apply replication changes quickly enough.' },
        { id: 'source-overload', text: 'The source database is saturated and cannot send replication changes.' },
        { id: 'replication-stopped', text: 'Replication has stopped because the replica is in an Error state.' },
        { id: 'reporting-writes', text: 'The reporting service is issuing writes directly to the read replica.' }
      ],
      correctOptionId: 'replica-capacity',
      explanation: 'Lag rises with reporting traffic while the replica reaches 98 percent CPU, very low free memory, and high disk queue depth; the source remains healthy and replication is still running.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective remediation?',
      options: [
        { id: 'resize-replica', text: 'Move the read replica to an appropriately larger DB instance class, then repeat the reporting workload and monitor ReplicaLag and resource metrics.' },
        { id: 'resize-source', text: 'Increase the source database class even though its metrics show adequate capacity.' },
        { id: 'write-to-replica', text: 'Allow the reporting service to write directly to the replica to reduce work on the source.' },
        { id: 'ignore-lag', text: 'Leave the configuration unchanged because replication is technically still running.' }
      ],
      correctOptionId: 'resize-replica',
      explanation: 'The bottleneck is on the replica, so increasing replica capacity addresses the constrained resource while preserving the existing read-only architecture.'
    }
  ],
  solution: {
    rootCause: 'The db.t4g.micro read replica is undersized for the concurrent reporting workload. CPU saturation, low free memory, and high disk queue depth leave insufficient capacity to serve reports and apply replication changes promptly.',
    fix: 'Resize the read replica to an appropriately larger instance class, keep reporting traffic read-only, rerun the reporting workload, and verify that ReplicaLag and resource saturation remain within the required operating range.',
    prevention: 'Alarm on ReplicaLag together with replica CPU, memory, and disk queue metrics, and capacity-test reporting workloads before choosing or downsizing a replica instance class.'
  }
});
