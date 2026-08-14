import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-9',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Compliance Evaluation',
  status: 'ready',
  plainEnglish: 'Compliance Evaluation is the process where AWS Config tests your recorded resource configurations against enabled AWS Config Rules (Managed or Custom) to determine if your environment adheres to desired policies. Each evaluation yields a compliance result for each resource: COMPLIANT (resource meets criteria), NON_COMPLIANT (resource violates criteria), or NOT_APPLICABLE (rule does not apply to this resource type).',
  whyItMatters: 'Continuous evaluation ensures that security drifts or misconfigurations are detected in near-real-time as changes occur, rather than discovering vulnerability exposures months later during annual audits.',
  workplaceExample: 'When an engineer attaches an unapproved Internet Gateway to a private VPC, AWS Config triggers a compliance evaluation against the rule vpc-gateway-authorized-type. Within seconds, the rule flags the VPC as NON_COMPLIANT, triggering an automated alert to the Security Operations Center.',
  examFocus: 'For SAA-C03, understand the two evaluation triggers:\n1. Configuration Change Triggers: Runs immediately whenever a specified resource type is created, modified, or deleted (event-driven).\n2. Periodic Triggers: Runs automatically at fixed time intervals (e.g. every 24 hours) for rules evaluating time-sensitive or external states.',
  keyPoints: [
    'Evaluates recorded resources against active Managed and Custom Config Rules.',
    'Compliance statuses: COMPLIANT, NON_COMPLIANT, or NOT_APPLICABLE.',
    'Two trigger types: Configuration Change (event-driven) and Periodic (scheduled).',
    'Compliance summaries are aggregated at the account, region, and rule levels.',
    'State changes trigger SNS notifications and EventBridge events for automation.'
  ],
  commonMistake: 'Expecting AWS Config to automatically prevent a non-compliant change from occurring. AWS Config is a DETECTIVE control; it evaluates compliance after resources are created or changed, rather than blocking the API call (which is a preventative control like SCPs).',
  example: 'Compliance Evaluation Result:\nResource: `s3:::my-public-bucket`\nRule: `s3-bucket-public-read-prohibited`\nEvaluation Result: NON_COMPLIANT\nAnnotation: Bucket allows public read access via ACL.',
  sources: [
    { title: 'Evaluating Resources with AWS Config Rules', url: 'https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html' }
  ]
});
