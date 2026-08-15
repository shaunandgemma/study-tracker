import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shub-7',
  topicId: 'topic-security-hub',
  topicTitle: 'AWS Security Hub',
  objectiveCode: 'Security',
  title: 'Security Controls',
  status: 'ready',
  plainEnglish: 'Security Controls in AWS Security Hub are individual security checks that evaluate whether specific AWS resources comply with a security best practice (for example, `[S3.1] S3 block public access setting should be enabled` or `[IAM.6] Hardware MFA should be enabled for the root user`). Controls generate findings with compliance statuses of `PASSED`, `FAILED`, or `NOT_AVAILABLE`.',
  whyItMatters: 'Individual controls provide granular security governance. If an exception is required for a specific control in a sandbox environment (e.g., allowing public HTTP for a test bucket), administrators can disable that individual control without disabling the entire security standard.',
  workplaceExample: 'A cloud security team reviews control `[EC2.2] VPC default security groups should prohibit inbound and outbound traffic`. Security Hub flags 3 failed default security groups across developer accounts, allowing the team to remediate them.',
  examFocus: 'SAA-C03 Security Control Mechanics:\n- Control IDs: Standardized control identifiers across standards (e.g., `S3.1`, `EC2.2`, `IAM.1`).\n- Control Disablement: Individual controls can be disabled with a required business reason (e.g. "Compensating control in place").\n- Custom Control Parameters: Parameters like minimum password length or allowed AMI IDs can be customized in Security Hub.\n- Evaluation Dependencies: Controls rely on underlying AWS Config managed rules for resource configuration data.',
  keyPoints: [
    'Individual security checks evaluated continuously against specific AWS resources.',
    'Identified by standardized control codes (e.g. `S3.1`, `EC2.2`, `RDS.3`).',
    'Return compliance statuses of PASSED, FAILED, WARNING, or NOT_AVAILABLE.',
    'Can be disabled individually per-account or globally across an organization with a justification.',
    'Support custom parameters to tailor control evaluation thresholds to enterprise policy.'
  ],
  commonMistake: 'Disabling a failed security control to artificially boost the account Security Score without establishing compensating controls or documenting risk acceptance.',
  example: 'Disabling an Individual Security Control via AWS CLI:\naws securityhub update-standards-control --standards-control-arn "arn:aws:securityhub:us-east-1:123456789012:control/aws-foundational-security-best-practices/v/1.0.0/S3.1" --control-status "DISABLED" --disabled-reason "Compensating perimeter firewall in place"',
  sources: [
    { title: 'Security controls in AWS Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-controls.html' }
  ]
});
