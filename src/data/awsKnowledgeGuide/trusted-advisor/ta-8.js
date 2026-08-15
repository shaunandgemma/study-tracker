import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ta-8',
  topicId: 'topic-trusted-advisor',
  topicTitle: 'AWS Trusted Advisor',
  objectiveCode: 'Management',
  title: 'Service Quotas Checks',
  status: 'ready',
  plainEnglish: 'Trusted Advisor service-limit checks compare supported resource usage with AWS quotas and warn when usage approaches the check threshold. AWS now generally calls these values service quotas, although the Trusted Advisor category retains the Service limits name. Some quotas can be increased and others cannot, and quota values can be regional, account-specific, or global depending on the service.',
  whyItMatters: 'A deployment or traffic increase can fail even when the application code is correct if the account cannot create more resources or accept more requests. Quota monitoring gives teams time to remove unused resources, change the design, or request an increase before a release or incident reaches the limit.',
  workplaceExample: 'Before a regional expansion, the platform team checks Trusted Advisor and Service Quotas in the target Region. They calculate peak capacity, request adjustable increases early, track request approval, and add CloudWatch quota alarms for the limits that could block scaling.',
  examFocus: 'SAA-C03 quota handling:\n- Trusted Advisor highlights supported quota usage; Service Quotas is used to inspect and request increases where available.\n- Confirm the Region and account because many quotas are scoped that way.\n- Distinguish adjustable quotas from fixed limits.\n- Request increases before planned demand.\n- A quota increase does not automatically scale or reconfigure the workload.',
  keyPoints: [
    'The Trusted Advisor category is named Service limits, while AWS commonly uses the term service quotas.',
    'Basic Support includes all Trusted Advisor checks in the Service limits category.',
    'A quota can be regional, global, per account, per resource, adjustable, or fixed depending on the service.',
    'A warning is an early capacity signal and should be compared with forecast demand.',
    'Service Quotas can be used to inspect many quota values and request supported increases.',
    'Teams should monitor critical quota usage instead of depending only on an occasional manual review.'
  ],
  commonMistake: 'Requesting an increase in the wrong Region or assuming every limit can be raised immediately. Scope, adjustability, lead time, and workload design must be checked first.',
  example: 'A scaling plan needs 80 units of a resource, current use is 40, and the applicable regional quota is 60. The team confirms that the quota is adjustable, submits the request before launch, verifies the approved value, and keeps a fallback deployment plan.',
  sources: [
    { title: 'Trusted Advisor service limits checks', url: 'https://docs.aws.amazon.com/awssupport/latest/user/service-limits.html' },
    { title: 'What is Service Quotas?', url: 'https://docs.aws.amazon.com/servicequotas/latest/userguide/intro.html' }
  ]
});
