import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-10',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Continuous Scanning',
  status: 'ready',
  plainEnglish: 'Continuous scanning means Inspector keeps monitoring eligible resources and reevaluates them when relevant inputs change, rather than producing only a one-time report. Triggers differ by resource and scan configuration: software inventory changes and new vulnerability intelligence can affect EC2, ECR enhanced scanning can be configured for continuous or scan-on-push behavior, and eligible Lambda functions are reevaluated after deployments or relevant vulnerability updates.',
  whyItMatters: 'An image or function that looked clean at release time can become vulnerable when a newly disclosed CVE matches an existing dependency. Ongoing evaluation shortens the time between new intelligence and an actionable finding, provided coverage and event handling are monitored.',
  workplaceExample: 'A container repository uses enhanced continuous scanning. A previously accepted image receives a new Inspector finding after vulnerability intelligence changes, and an EventBridge rule routes the event to the owning team even though nobody pushed a replacement image that day.',
  examFocus: 'Continuous does not mean every resource is scanned in exactly the same way or on an assumed universal schedule. Look for resource eligibility, configured scan mode, ECR scan frequency, and coverage status. EventBridge can automate responses to new and updated findings, but the rule and target do not perform the scan or fix the resource.',
  keyPoints: [
    'Inspector reevaluates monitored resources as relevant resource or vulnerability information changes.',
    'EC2 package collection behavior depends on the configured agent-based or hybrid scan mode and resource eligibility.',
    'ECR enhanced scanning supports continuous and scan-on-push configurations selected in ECR.',
    'Lambda scanning responds to eligible deployments, updates, and relevant vulnerability intelligence.',
    'Coverage pages and APIs show whether resources are actively monitored or why they are not scanning.',
    'EventBridge can route Inspector finding and coverage events to notification or remediation workflows.'
  ],
  commonMistake: 'Assuming that enabling Inspector once guarantees permanent coverage ignores unsupported, excluded, stale, or otherwise ineligible resources. Review coverage continuously and alert on coverage gaps as well as on vulnerability findings.',
  example: 'Enable the appropriate scan type, confirm that a test resource appears as actively monitored, and create an EventBridge rule for high-severity Inspector finding events. Send the event to a triage target, validate ownership, and verify the finding state again after a controlled remediation.',
  sources: [
    { title: 'Assessing Amazon Inspector coverage', url: 'https://docs.aws.amazon.com/inspector/latest/user/assessing-coverage.html' },
    { title: 'Scanning Amazon ECR container images with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-ecr.html' },
    { title: 'Creating custom responses with Amazon EventBridge', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-managing-automating-responses.html' }
  ]
});
