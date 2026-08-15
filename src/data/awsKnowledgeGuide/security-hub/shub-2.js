import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-2',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Automated Compliance Checks: CIS AWS Foundations, PCI-DSS, AWS Best Practices',
  status: 'ready',
  plainEnglish: 'Security Hub executes automated compliance checks by testing your AWS resource configurations against predefined security standards, including the AWS Foundational Security Best Practices (FSBP), the CIS AWS Foundations Benchmark, NIST SP 800-53, and PCI-DSS (Payment Card Industry Data Security Standard). Security Hub uses underlying AWS Config rules to evaluate controls continuously and report `PASSED`, `FAILED`, or `WARNING` statuses.',
  whyItMatters: 'Manual security audits take months and leave compliance gaps between audit cycles. Automated compliance checks evaluate your cloud infrastructure continuously, alerting security teams immediately when a resource drifts out of compliance.',
  workplaceExample: 'An e-commerce company subscribing to the PCI-DSS standard in Security Hub gets alerted within 15 minutes when a developer accidentally disables public access blocks on an S3 bucket storing cardholder audit logs.',
  examFocus: 'SAA-C03 Compliance Standards & Execution:\n- Supported Standards: AWS Foundational Security Best Practices (FSBP), CIS AWS Foundations Benchmark v1.2/v1.4, PCI-DSS v3.2.1, NIST SP 800-53.\n- Prerequisites: Many Security Hub control checks depend on AWS Config recording being enabled.\n- Consolidated Controls: Enabling multiple standards consolidates overlapping security controls to prevent duplicate control evaluation findings.',
  keyPoints: [
    'Executes continuous automated compliance checks against industry security standards.',
    'Supports FSBP, CIS AWS Foundations Benchmark, PCI-DSS, and NIST SP 800-53.',
    'Evaluates resource configurations using underlying AWS Config rule data.',
    'Consolidates overlapping controls across multiple enabled standards to eliminate duplication.',
    'Generates actionable compliance findings categorized as PASSED, FAILED, or WARNING.'
  ],
  commonMistake: 'Enabling Security Hub standards without enabling AWS Config recording in the account, preventing Security Hub from executing underlying control evaluations.',
  example: 'Enabling PCI-DSS Standard via AWS CLI:\naws securityhub batch-enable-standards --standards-subscription-requests \'[{"StandardsArn": "arn:aws:securityhub:us-east-1::standards/pci-dss/v/3.2.1"}]\':',
  sources: [
    { title: 'Security standards in AWS Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards.html' }
  ]
});
