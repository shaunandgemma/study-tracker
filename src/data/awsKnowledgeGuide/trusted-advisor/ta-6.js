import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-6',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Security Checks',
  status: 'ready',
  plainEnglish: 'Trusted Advisor security checks look for supported AWS settings that might expose resources or weaken account protection. Examples in the check catalogue include public snapshots, permissive bucket access, missing root-account MFA, unrestricted security-group ports, and other service-specific findings. The exact checks available depend on the support plan and enabled integrations.',
  whyItMatters: 'Common configuration mistakes can expose data or administration paths. Trusted Advisor provides another way to surface these mistakes, but it is not a vulnerability scanner, threat-detection service, penetration test, or complete compliance assessment. Security teams must combine it with IAM governance, Security Hub CSPM, GuardDuty, Inspector, Config, logging, patching, and incident-response processes as appropriate.',
  workplaceExample: 'A red result identifies a security group with a sensitive port open to a broad address range. The security engineer confirms the associated workloads and legitimate client networks, narrows the ingress rule during an approved change, verifies connectivity, and refreshes or waits for the check to update.',
  examFocus: 'SAA-C03 security response:\n- Prioritise exposure and root-account protection findings.\n- Identify the affected resource and owner.\n- Confirm intended access before changing a policy or rule.\n- Apply least privilege and verify required connectivity.\n- Treat Trusted Advisor as one input alongside specialist security services.',
  keyPoints: [
    'Security checks detect defined risky configurations; they do not inspect every security control in an account.',
    'Basic Support includes a documented selection of security checks rather than the complete catalogue.',
    'A finding should be validated against the affected resource, policy, network path, and business requirement.',
    'Excluded items remain excluded findings, not remediated resources.',
    'Some Security Hub CSPM controls can appear in Trusted Advisor and follow their own refresh and suppression behaviour.',
    'CloudTrail records supported management activity, while GuardDuty, Inspector, Config, and Security Hub serve different security purposes.'
  ],
  commonMistake: 'Assuming Trusted Advisor continuously detects active attacks. It reports supported best-practice check results; GuardDuty and other security services are designed for different detection and assessment tasks.',
  example: 'A public-snapshot finding is investigated before remediation. The owner confirms the snapshot contains internal data and has no approved public-distribution purpose. Access is removed, dependent sharing is verified through a safer mechanism, and the result is checked again after reevaluation.',
  sources: [
    { title: 'Trusted Advisor security checks', url: 'https://docs.aws.amazon.com/awssupport/latest/user/security-checks.html' },
    { title: 'Security Hub CSPM controls in Trusted Advisor', url: 'https://docs.aws.amazon.com/awssupport/latest/user/security-hub-controls-with-trusted-advisor.html' }
  ]
});
