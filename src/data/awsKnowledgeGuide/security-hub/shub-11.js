import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-11',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'GuardDuty, Inspector and Macie Findings',
  status: 'ready',
  plainEnglish: 'GuardDuty, Inspector, and Macie are specialized AWS security services whose finding outputs are ingested automatically into Security Hub:\n- Amazon GuardDuty: Detects threats, anomalous behavior, and compromised credentials.\n- Amazon Inspector: Scans EC2 instances, ECR container images, and Lambda functions for software vulnerabilities (CVEs).\n- Amazon Macie: Discovers sensitive personal data (PII, credit cards) and unencrypted S3 bucket exposures.',
  whyItMatters: 'Each service protects a distinct layer of the cloud stack (Threats vs Vulnerabilities vs Sensitive Data). Security Hub consolidates these 3 services into a single unified security view, eliminating service silos.',
  workplaceExample: 'A SOC team reviews a unified Security Hub timeline: Inspector reports an unpatched CVE on an EC2 instance, GuardDuty alerts that the same instance is communicating with a malicious IP, and Macie confirms the instance accesses S3 buckets containing PII.',
  examFocus: 'SAA-C03 Core Distinction Matrix:\n- Amazon GuardDuty = Threat Detection (Anomalous API calls, compromised instances/IAM, malware execution).\n- Amazon Inspector = Vulnerability Assessment (OS package CVEs, software dependency vulnerabilities).\n- Amazon Macie = Data Privacy & Security (S3 bucket data classification, PII discovery).\n- Central Aggregation: Security Hub converts findings from all 3 services into ASFF format automatically.',
  keyPoints: [
    'GuardDuty provides managed threat detection for accounts, workloads, and IAM.',
    'Inspector provides automated software vulnerability scanning for EC2, ECR, and Lambda.',
    'Macie provides sensitive data discovery (PII) and bucket security scanning for S3.',
    'Security Hub normalizes and consolidates finding payloads from all 3 services.',
    'Enables holistic security triage across threats, vulnerabilities, and data exposure.'
  ],
  commonMistake: 'Confusing Amazon Inspector (vulnerability scanner) with Amazon GuardDuty (threat detection engine). They detect completely different security signals.',
  example: 'Filtering Ingested Inspector Findings in Security Hub via AWS CLI:\naws securityhub get-findings --filters \'{"ProductName": [{"Value": "Inspector", "Comparison": "EQUALS"}]}\'',
  sources: [
    { title: 'AWS native finding providers in Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-providers.html' }
  ]
});
