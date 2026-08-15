import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-16',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Security Hub vs GuardDuty',
  status: 'ready',
  plainEnglish: 'AWS Security Hub and Amazon GuardDuty perform complementary, distinct roles in cloud security:\n- Amazon GuardDuty: Intelligent threat detection engine. Analyzes AWS logs (VPC Flow Logs, CloudTrail, DNS, EKS, S3, RDS) using machine learning to detect active attacks, compromised credentials, and malicious IP activity.\n- AWS Security Hub: Cloud Security Posture Management (CSPM) & finding aggregator. Evaluates resource compliance against security controls/standards and aggregates findings from GuardDuty, Inspector, Macie, and partners into one dashboard.',
  whyItMatters: 'Confusing GuardDuty and Security Hub is a common cloud security mistake. GuardDuty acts as the security guard detecting active threats; Security Hub acts as the security manager evaluating compliance controls and centralizing reports.',
  workplaceExample: 'GuardDuty detects an EC2 instance communicating with a Command-and-Control server and generates a threat finding. Security Hub ingests GuardDuty\'s finding, combines it with local posture control results, and displays it on the central dashboard.',
  examFocus: 'SAA-C03 Architectural Decision Matrix:\n- Threat Detection & Anomaly Monitoring -> Amazon GuardDuty (Threat engine; ingests VPC Flow Logs, CloudTrail, DNS logs).\n- Posture Management & Compliance Checks -> AWS Security Hub (CSPM; evaluates FSBP/CIS controls, aggregates findings).\n- Ingestion Relationship: GuardDuty automatically feeds its findings TO Security Hub for centralized management.',
  keyPoints: [
    'GuardDuty is a managed threat detection service analyzing logs for active security threats.',
    'Security Hub is a CSPM service evaluating security controls and aggregating finding payloads.',
    'GuardDuty feeds threat findings directly into Security Hub automatically.',
    'GuardDuty detects malicious behavior; Security Hub assesses configuration compliance.',
    'Best practice uses GuardDuty and Security Hub together for complete threat & posture management.'
  ],
  commonMistake: 'Expecting AWS Security Hub to analyze VPC Flow Logs or DNS logs directly for malware threats without enabling Amazon GuardDuty.',
  example: 'Use Case Selection Summary:\n- "Detect an EC2 instance mining cryptocurrency" -> Amazon GuardDuty\n- "Audit whether all S3 buckets are encrypted and aggregate all security alerts" -> AWS Security Hub',
  sources: [
    { title: 'Comparing AWS Security Hub and Amazon GuardDuty', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html' }
  ]
});
