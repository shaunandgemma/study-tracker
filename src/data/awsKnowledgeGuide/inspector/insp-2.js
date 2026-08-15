import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'insp-2',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Network Reachability Analysis & Risk Score Evaluation',
  status: 'ready',
  plainEnglish: 'For EC2 findings, Amazon Inspector can add environmental context to vulnerability data. Network reachability analysis identifies network paths to an instance, and the Inspector risk score can adjust CVSS-based information using context such as reachability and exploitability. A reachable resource deserves attention, but reachability is not evidence that an attacker has used the path.',
  whyItMatters: 'Two instances with the same vulnerable package may present different operational risk. Context helps a security team address an internet-reachable production host before an isolated test host without claiming that either host is already compromised.',
  workplaceExample: 'A security analyst reviews two EC2 package findings tied to the same CVE. The public application instance has an allowed network path and stronger exploit intelligence, so its Inspector score and exposure context place it ahead of a private build worker in the remediation queue.',
  examFocus: 'Distinguish the underlying vulnerability score from the environment-aware Inspector score. CVSS describes vulnerability characteristics; the Inspector score for eligible EC2 package findings correlates base-score information with AWS environment context. Network reachability raises priority but is neither an exploit attempt nor proof of compromise.',
  keyPoints: [
    'Network reachability findings describe possible network paths to EC2 instances.',
    'Reachability analysis considers AWS network configuration such as security groups, network ACLs, and routing components.',
    'A reachable port can increase remediation priority without showing that traffic exploited it.',
    'CVSS base scores characterize vulnerability severity independently of a specific AWS deployment.',
    'The Amazon Inspector score adds supported EC2 environment and exploitability context to CVSS information.',
    'Analysts should review the score vector and finding evidence, not only the severity label.'
  ],
  commonMistake: 'Reading a network-reachable high-risk finding as proof of an active breach confuses exposure with compromise. Validate the path, reduce unnecessary access, remediate the package, and use threat-detection and investigation data to look for malicious activity.',
  example: 'Filter EC2 findings for a business service, compare each finding\'s CVSS information, Inspector score, exploit details, and network paths, and document why the reachable production instance is scheduled first. Recheck the finding after closing the exposed port and updating the package.',
  sources: [
    { title: 'Viewing the Amazon Inspector score and vulnerability intelligence', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding-score.html' },
    { title: 'Amazon Inspector finding types', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-types.html' },
    { title: 'Viewing details for Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding-details.html' }
  ]
});
