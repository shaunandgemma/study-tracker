import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-1',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Centralized Security Posture Dashboard & Compliance Score Aggregator',
  status: 'ready',
  plainEnglish: 'AWS Security Hub is a Cloud Security Posture Management (CSPM) service that continuously evaluates your AWS environment against security industry standards and best practices. It aggregates, normalizes, and prioritizes security findings from AWS native services (GuardDuty, Inspector, Macie, IAM Access Analyzer, Firewall Manager) and third-party partner products into a single centralized security dashboard, generating an overall Security Score percentage.',
  whyItMatters: 'Managing security alerts across multiple AWS accounts, regions, and standalone security tools creates security fatigue and missed threats. Security Hub unifies security visibility into a single pane of glass with actionable security scores.',
  workplaceExample: 'A Chief Information Security Officer (CISO) uses the Security Hub dashboard across 50 enterprise AWS accounts. The dashboard displays an overall Security Score of 84% and highlights 12 critical failed controls (like unencrypted S3 buckets) that require immediate remediation.',
  examFocus: 'SAA-C03 Security Hub Posture & Score Mechanics:\n- Security Score: Percentage of enabled security controls passed across enabled standards.\n- ASFF Schema: Automatically normalizes all incoming findings into the AWS Security Finding Format (ASFF).\n- Continuous Evaluation: Continuously runs automated security checks against resources using AWS Config data.\n- Score Disclaimer: A Security Score summarizes control pass rates; it is NOT a complete measure of absolute organizational risk.',
  keyPoints: [
    'Centralized Cloud Security Posture Management (CSPM) service for AWS.',
    'Provides a unified Security Posture dashboard and aggregated Security Score percentage.',
    'Normalizes findings from AWS services and third-party tools into standard ASFF schema.',
    'Evaluates resources continuously against security standards (FSBP, CIS, PCI-DSS).',
    'Consolidates multi-account and cross-region security status into a single view.'
  ],
  commonMistake: 'Assuming a 100% Security Hub score guarantees complete protection against zero-day exploits or active internal threats. The score measures control compliance, not total risk.',
  example: 'Viewing Security Hub Security Score via AWS CLI:\naws securityhub get-security-score',
  sources: [
    { title: 'What is AWS Security Hub?', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html' }
  ]
});
