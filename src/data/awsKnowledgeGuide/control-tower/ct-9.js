import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-9', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Detective Controls', status: 'ready',
  plainEnglish: 'A detective control evaluates existing resource configuration and reports whether it complies with a rule. Control Tower detective controls use AWS Config rules and surface clear or violation status in the governance view.',
  whyItMatters: 'Teams can discover risky configurations while allowing legitimate deployment flexibility and choosing an appropriate remediation process.',
  workplaceExample: 'A detective control finds an EBS volume without required encryption. The security team receives the finding and the workload owner replaces the volume safely.',
  examFocus: 'Detective controls do not stop resource creation. They depend on AWS Config recording and supported governed Regions, and may incur AWS Config-related charges. Use preventive or proactive behaviour when deployment must be blocked.',
  keyPoints: ['Detective controls evaluate after resource configuration exists.', 'AWS Config rules implement the checks.', 'Status can show clear, violation, or not enabled.', 'Findings require investigation or remediation.', 'Coverage depends on supported resources and Regions.'],
  commonMistake: 'Believing a detective control prevents a public or unencrypted resource from being created.',
  example: 'Enable the control on a test OU, create a deliberately noncompliant test resource, observe the violation, remediate it, and confirm the state returns to clear.',
  sources: [{ title: 'Control behavior and guidance', url: 'https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html' }, { title: 'How controls work', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-controls-work.html' }]
});
