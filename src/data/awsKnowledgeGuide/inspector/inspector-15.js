import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-15',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Inspector vs GuardDuty',
  status: 'ready',
  plainEnglish: 'Amazon Inspector and Amazon GuardDuty answer different security questions. Inspector is a vulnerability-management service that evaluates supported workloads for known software vulnerabilities and unintended EC2 network exposure. GuardDuty is a threat-detection service that analyzes supported AWS data sources and threat intelligence for suspicious or potentially malicious activity.',
  whyItMatters: 'A secure workload needs both preventive exposure management and detective monitoring. A vulnerable package can exist without exploitation, while suspicious behavior can occur for reasons that are not represented by an Inspector CVE finding.',
  workplaceExample: 'Inspector reports a vulnerable library on an EC2 web server, so the platform team schedules an update. Later, GuardDuty reports suspicious credential activity involving the application role, so incident responders investigate sessions and contain access; the two findings enter different response playbooks.',
  examFocus: 'Choose Inspector for vulnerability and exposure assessment of supported EC2, ECR, and Lambda resources. Choose GuardDuty for managed threat detection based on logs, events, threat intelligence, and behavioral analysis. A CVE or reachable port is not proof of attack, and a GuardDuty threat finding is not a software inventory scan.',
  keyPoints: [
    'Inspector identifies supported software vulnerabilities and EC2 network reachability issues.',
    'GuardDuty detects suspicious or malicious activity from supported AWS data sources.',
    'Inspector package findings may reference CVEs, affected packages, and fixed versions.',
    'GuardDuty uses threat intelligence and analytical techniques to produce threat findings.',
    'Neither an Inspector vulnerability finding nor network reachability alone proves compromise.',
    'Both services can contribute findings to Security Hub CSPM for centralized operations.'
  ],
  commonMistake: 'Using Inspector as the sole evidence that an instance has been attacked misreads vulnerability data as threat telemetry. Use Inspector to reduce exposure and use GuardDuty plus investigation logs and other evidence to determine whether malicious activity occurred.',
  example: 'For a public EC2 service, route Inspector package and network findings to the vulnerability queue and GuardDuty findings to the incident-response queue. Correlate them in Security Hub when useful, but preserve separate owners, evidence requirements, and remediation actions.',
  sources: [
    { title: 'What is Amazon Inspector?', url: 'https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html' },
    { title: 'Amazon Inspector finding types', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-types.html' },
    { title: 'What is Amazon GuardDuty?', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html' },
    { title: 'AWS service integrations with Security Hub CSPM', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-internal-providers.html' }
  ]
});
