import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-6',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Security Standards',
  status: 'ready',
  plainEnglish: 'Security Standards in AWS Security Hub are curated collections of security controls that correspond to specific regulatory frameworks or security benchmarks (such as AWS Foundational Security Best Practices, CIS AWS Foundations Benchmark, PCI-DSS, and NIST SP 800-53). Enabling a standard automatically activates all individual security controls contained within that standard.',
  whyItMatters: 'Achieving compliance with industry frameworks like CIS or PCI-DSS manually is complex. Security Standards allow organizations to enable a compliance benchmark with a single click and receive automated compliance evaluation reports continuously.',
  workplaceExample: 'A healthcare organization enables the NIST SP 800-53 standard in Security Hub. Security Hub automatically activates 150+ security controls, continuously auditing EC2, S3, IAM, and RDS resources against NIST requirements.',
  examFocus: 'SAA-C03 Security Standards Management:\n- Standard Subscriptions: Standards are enabled per-account and per-region (or managed centrally via AWS Organizations).\n- Overlapping Controls: Consolidated controls eliminate duplicate control evaluations across multiple active standards.\n- Enable/Disable Standards: Disabling a standard turns off checks for that framework but does NOT delete underlying AWS resources.\n- Custom Parameters: Security Hub supports customizing control parameters (e.g., custom password length rules) across standards.',
  keyPoints: [
    'Curated collections of security controls mapped to industry compliance frameworks.',
    'Includes AWS FSBP, CIS AWS Foundations Benchmark, PCI-DSS, and NIST SP 800-53.',
    'Enabling a standard automatically activates all associated security controls.',
    'Consolidated controls eliminate duplicate evaluation findings across standards.',
    'Can be managed centrally across multi-account organizations using Central Configuration.'
  ],
  commonMistake: 'Disabling a security standard assuming it will remediate non-compliant resources. Disabling a standard only stops Security Hub from auditing those controls.',
  example: 'Subscribing to a Security Standard via AWS CLI:\naws securityhub batch-enable-standards --standards-subscription-requests \'[{"StandardsArn": "arn:aws:securityhub:us-east-1::standards/aws-foundational-security-best-practices/v/1.0.0"}]\':',
  sources: [
    { title: 'Security standards in AWS Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards.html' }
  ]
});
