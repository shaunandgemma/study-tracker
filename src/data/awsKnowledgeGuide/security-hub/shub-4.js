import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-4',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Security Hub Centralized Security Findings',
  status: 'ready',
  plainEnglish: 'Centralized Security Findings in AWS Security Hub uses the AWS Security Finding Format (ASFF)—a standardized JSON schema containing common fields (Severity, Compliance Status, Workflow Status, Record State, Resource ID, Timestamps). ASFF ensures that regardless of whether a finding originated from GuardDuty, Inspector, or a 3rd-party partner, all findings share identical data structures for automated filtering and remediation.',
  whyItMatters: 'Different security tools output disparate log formats, forcing security teams to write complex parsing scripts. ASFF normalizes all finding data, enabling uniform EventBridge routing rules and automated remediation scripts.',
  workplaceExample: 'An enterprise configures an EventBridge rule matching any ASFF finding with `"Severity.Label": "CRITICAL"`. Critical findings automatically trigger an AWS Lambda function that posts to the Incident Response Slack channel.',
  examFocus: 'SAA-C03 ASFF Finding Schema & Workflow Rules:\n- ASFF Schema: Standard JSON format for all Security Hub findings.\n- Workflow Status: State of finding triage (`NEW`, `NOTIFIED`, `RESOLVED`, `SUPPRESSED`).\n- Record State: Indicates whether the finding is `ACTIVE` or `ARCHIVED`.\n- Finding Suppression: Suppressing a finding hides it from default views without fixing the underlying resource (requires business justification).',
  keyPoints: [
    'Uses AWS Security Finding Format (ASFF) JSON schema for universal finding normalization.',
    'Standardizes Severity (CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL) across all providers.',
    'Tracks Workflow Status (`NEW`, `NOTIFIED`, `RESOLVED`, `SUPPRESSED`) and Record State (`ACTIVE`, `ARCHIVED`).',
    'Enables unified EventBridge filtering rules for automated alert routing and remediation.',
    'Updating workflow status or notes does NOT modify or fix the underlying AWS resource.'
  ],
  commonMistake: 'Marking a finding workflow status as `RESOLVED` or `SUPPRESSED` and assuming Security Hub automatically fixed the underlying non-compliant AWS resource.',
  example: 'Updating Finding Workflow Status to RESOLVED via AWS CLI:\naws securityhub batch-update-findings --finding-identifiers \'[{"Id": "arn:aws:securityhub:us-east-1:123456789012:subscription/fsbp/v/1.0.0/S3.1/finding/123", "ProductArn": "arn:aws:securityhub:us-east-1::product/aws/securityhub"}]\' --workflow \'{"Status": "RESOLVED"}\'',
  sources: [
    { title: 'AWS Security Finding Format (ASFF) in Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format.html' }
  ]
});
