import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-12',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Inspector Findings',
  status: 'ready',
  plainEnglish: 'An Inspector finding is a detailed record that connects a detected package, code, or network issue to an affected resource. It includes fields such as severity, status, resource details, vulnerability identifiers, affected packages, fix information, and remediation guidance. Active, suppressed, and closed describe the finding lifecycle rather than whether an attacker acted.',
  whyItMatters: 'Good remediation decisions depend on the complete finding, not just its headline. Package and fixed-version details tell engineers what changed, while status, first-seen data, exposure context, and ownership help security teams track the issue through closure.',
  workplaceExample: 'An operations engineer opens an active package vulnerability finding for an EC2 instance, confirms the installed package and listed fixed version, tests the update in staging, deploys it through the patch process, and waits for Inspector to reevaluate the inventory and close the finding.',
  examFocus: 'Know the main finding types and states. Package vulnerability findings can apply to EC2, ECR, and Lambda; code vulnerability findings cover supported code scanning; network reachability findings apply to EC2 exposure. Suppressed means hidden by a matching rule, not fixed, and closed normally follows remediation or loss of resource eligibility.',
  keyPoints: [
    'A finding identifies an issue and the AWS resource that Inspector determined is affected.',
    'Finding types include package vulnerability, code vulnerability, and network reachability where supported.',
    'Severity helps prioritize findings but should be considered with exploitability and resource context.',
    'Package findings can show installed versions, fixed versions, package managers, and remediation details.',
    'Active findings remain unresolved; suppressed findings are hidden by rules; closed findings are no longer active.',
    'A CVE identifies a known vulnerability and does not by itself prove exploitation.'
  ],
  commonMistake: 'Closing a ticket because a fixed version is listed does not change the resource or the Inspector finding. Deploy the correction, confirm the resource remains covered, and verify that Inspector changes the finding to closed.',
  example: 'Open a package finding and record its resource ID, status, severity, CVE, installed package version, fixed version, and remediation reference. After the owner deploys the approved update, compare the later finding state and retain the evidence in the change record.',
  sources: [
    { title: 'Understanding Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding.html' },
    { title: 'Amazon Inspector finding types', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-types.html' },
    { title: 'Viewing details for Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding-details.html' }
  ]
});
