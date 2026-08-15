import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-13',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Integration with Security Hub',
  status: 'ready',
  plainEnglish: 'The Security Hub CSPM integration sends supported Amazon Inspector findings into a central security findings service using the AWS Security Finding Format. Inspector remains the service that scans supported workloads and owns its source findings; Security Hub aggregates, normalizes, correlates, and helps teams manage findings from Inspector and other providers.',
  whyItMatters: 'Centralizing findings lets a security operations team view vulnerability data beside threat, configuration, and partner findings without giving up the detailed source-service workflow. This is especially useful across accounts when teams need a common triage and reporting surface.',
  workplaceExample: 'A security team enables Security Hub CSPM across its organization and filters imported findings by the Amazon Inspector product name. Analysts assign a workflow status in Security Hub, then follow the source link to Inspector for package details and send the actual update to the workload owner.',
  examFocus: 'Security Hub does not perform Inspector scans and does not patch resources. Inspector produces supported vulnerability findings; Security Hub receives them in ASFF and provides centralized posture and workflow features. When an Inspector finding closes, Security Hub archives its corresponding imported finding.',
  keyPoints: [
    'Amazon Inspector is the source vulnerability-management service in this integration.',
    'Security Hub CSPM ingests supported Inspector findings in AWS Security Finding Format.',
    'Security Hub can centralize findings from many AWS services and products.',
    'Security Hub workflow fields do not replace remediation of the underlying Inspector issue.',
    'Closed Inspector findings are archived in Security Hub according to the integration behavior.',
    'Inspector Code Security findings have documented integration limitations and should be checked in the source documentation.'
  ],
  commonMistake: 'Marking an imported Security Hub finding resolved and assuming the vulnerable package has been changed confuses case workflow with remediation. Update the workload, let Inspector reevaluate it, and reconcile the resulting source and aggregated states.',
  example: 'Filter Security Hub findings for ProductName Amazon Inspector and a high severity, open one item, and compare its ASFF resource and remediation fields with the source Inspector finding. Route it to the resource owner and verify that remediation closes the source finding and archives the Security Hub record.',
  sources: [
    { title: 'Amazon Inspector integration with AWS Security Hub CSPM', url: 'https://docs.aws.amazon.com/inspector/latest/user/securityhub-integration.html' },
    { title: 'AWS service integrations with Security Hub CSPM', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-internal-providers.html' },
    { title: 'Understanding Amazon Inspector findings', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding.html' }
  ]
});
