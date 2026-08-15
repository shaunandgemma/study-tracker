import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-3',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Inspector Automated Vulnerability Management',
  status: 'ready',
  plainEnglish: 'Amazon Inspector automates discovery, supported workload scanning, vulnerability matching, prioritization, and finding updates. It can monitor coverage, export findings or software bills of materials, and publish events for downstream workflows. This automation supplies evidence and routing; it does not automatically patch an instance, rebuild an image, change a Lambda package, or prove that a vulnerability was exploited.',
  whyItMatters: 'Vulnerability programs fail when inventory, triage, and ownership are manual. Inspector gives teams a repeatable feed of affected resources and remediation context, while coverage checks, exports, and event integrations make the process measurable across a changing estate.',
  workplaceExample: 'A security engineering team reviews Inspector coverage each morning, exports an encrypted findings report for audit evidence, and uses EventBridge to create high-severity remediation tickets. Resource owners deploy changes, and the team uses later Inspector states—not ticket closure alone—to confirm completion.',
  examFocus: 'Recognize Inspector as managed vulnerability assessment and prioritization, not a repair engine. EventBridge supports automated response routing, Security Hub aggregates supported findings, SBOM exports inventory components, and suppression rules hide matched findings without fixing them. Patch Manager can install approved EC2 patches but does not replace Inspector vulnerability detection.',
  keyPoints: [
    'Inspector automatically discovers and evaluates supported resources after the relevant scan type is activated.',
    'Coverage views identify monitored resources and reasons that other resources are not scanning.',
    'Findings contain affected resource, severity, vulnerability, package, and remediation context where applicable.',
    'EventBridge can start notification, ticketing, or controlled remediation workflows from Inspector events.',
    'Findings reports and SBOM exports can be written to appropriately configured S3 destinations with KMS protection.',
    'Suppression changes visibility and prioritization but never repairs the underlying issue.'
  ],
  commonMistake: 'Automating ticket creation and declaring the vulnerability process complete leaves no technical confirmation. Keep the resource in coverage, deploy the correction through its normal delivery mechanism, and use the subsequent Inspector finding state as verification.',
  example: 'Build a workflow that alerts when an important account gains an unmonitored resource or a high-severity finding. Include the resource owner and finding link, require a tested change, and close the work item only after Inspector reevaluates the resource and the finding is no longer active.',
  sources: [
    { title: 'What is Amazon Inspector?', url: 'https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html' },
    { title: 'Assessing Amazon Inspector coverage', url: 'https://docs.aws.amazon.com/inspector/latest/user/assessing-coverage.html' },
    { title: 'Exporting Amazon Inspector findings reports', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-managing-exporting-reports.html' },
    { title: 'Exporting SBOMs with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/sbom-export.html' },
    { title: 'Suppressing Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-managing-supression-rules.html' }
  ]
});
