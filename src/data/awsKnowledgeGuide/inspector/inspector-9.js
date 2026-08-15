import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-9',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Network Reachability Findings for EC2',
  status: 'ready',
  plainEnglish: 'An EC2 network reachability finding reports that AWS network configuration creates a path from a source such as the internet, a peered VPC, or a virtual private gateway to an instance port. Inspector evaluates supported network components and reports the path so teams can spot unintended exposure. It does not send exploit traffic and does not claim that anyone used the path.',
  whyItMatters: 'Unnecessary network access can turn a software weakness or listening service into a higher-priority risk. Path evidence helps network and application owners find the exact security group, network ACL, route, or related configuration that should be reviewed.',
  workplaceExample: 'Inspector reports that an administration port on a production instance is reachable from an internet gateway through a permissive security group. The network team restricts the rule to the approved management path, validates application access, and reviews the later finding state.',
  examFocus: 'Network reachability is an Inspector EC2 finding type, not GuardDuty evidence of malicious activity and not a live penetration test. Reachability can influence prioritization of EC2 package vulnerabilities. Choose security-group, network ACL, route, or architecture changes to remove unintended paths, then use threat telemetry if compromise is suspected.',
  keyPoints: [
    'Network reachability findings apply to Amazon EC2 network exposure.',
    'Inspector analyzes supported AWS network configuration to identify reachable ports and paths.',
    'A finding can include path components that help locate the configuration responsible for access.',
    'Reachability increases exposure and may raise remediation priority.',
    'A reachable path does not establish that a connection, exploit, or compromise occurred.',
    'Removing unintended access is a configuration remediation separate from updating vulnerable software.'
  ],
  commonMistake: 'Suppressing a reachability finding because the service currently needs a port open can hide excessive source access. Narrow the path to the required clients or private connectivity, document the residual exposure, and suppress only under an approved exception that does not pretend the path was removed.',
  example: 'Open a reachability finding and trace its source, destination port, and listed network path. Compare that path with the service design, tighten the responsible security group or routing control in a change window, test authorized connectivity, and confirm Inspector no longer reports the unintended exposure.',
  sources: [
    { title: 'Amazon Inspector finding types', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-types.html' },
    { title: 'Scanning Amazon EC2 instances with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-ec2.html' },
    { title: 'Viewing details for Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding-details.html' },
    { title: 'Suppressing Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-managing-supression-rules.html' }
  ]
});
