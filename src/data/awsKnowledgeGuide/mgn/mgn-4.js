import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-4',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'MGN Lift-and-Shift Rehost Migration',
  status: 'ready',
  plainEnglish: 'Rehosting (Lift-and-Shift) is a migration strategy that moves existing physical or virtual servers to AWS Amazon EC2 with minimal or no architectural changes. AWS MGN executes rehosting by capturing block-level disk snapshots of running source OS installations and replicating them directly into EC2-compatible EBS volumes.',
  whyItMatters: 'Rehosting is the fastest, lowest-risk migration strategy for legacy workloads with impending data center lease expirations. It defers application refactoring until after workloads are established in the cloud.',
  workplaceExample: 'A retail company facing a data center eviction deadline uses MGN to lift-and-shift 50 custom Windows .NET applications to AWS EC2 in 30 days, successfully avoiding data center penalty fees without rewriting code.',
  examFocus: 'SAA-C03 7 Rs Migration Decision Matrix:\n- Rehost (Lift-and-Shift): Move OS and apps as-is using AWS MGN.\n- Replatform (Lift-Tinker-and-Shift): Move apps while swapping underlying components (e.g. migrating self-hosted DB to RDS).\n- Refactor (Re-architect): Rewrite apps using cloud-native services (e.g. Lambda, ECS, DynamoDB).\n- Rule of Thumb: Choose AWS MGN when the objective is fast server rehosting without OS or code modifications.',
  keyPoints: [
    'Fastest migration strategy (Lift-and-Shift) with minimal OS/application changes.',
    'Captures operating system, configuration, and data volumes as-is onto EC2.',
    'Defers application modernization until after cloud adoption.',
    'Ideal for data center consolidation, lease expirations, and rapid evacuation.',
    'Reduces migration risk by preserving established application dependencies.'
  ],
  commonMistake: 'Confusing Rehosting with Refactoring. Rehosting moves existing server disk blocks to EC2; it does not convert monolithic applications into serverless microservices.',
  example: 'Migration Strategy Selection:\n- Scenario: "Need to evacuate 100 VM servers in 60 days without code changes." -> Strategy: AWS MGN (Rehost).\n- Scenario: "Need to replace Oracle DB with Aurora PostgreSQL." -> Strategy: AWS DMS + SCT (Replatform).',
  sources: [
    { title: 'AWS Application Migration Service - How it works', url: 'https://docs.aws.amazon.com/mgn/latest/ug/how-it-works.html' }
  ]
});
