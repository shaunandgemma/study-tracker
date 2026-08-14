import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-20', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Control Tower vs AWS Organizations', status: 'ready',
  plainEnglish: 'AWS Organizations is the foundational service for multi-account hierarchy, consolidated billing, organizational units, account creation, and organization policies. AWS Control Tower uses Organizations and other AWS services to provide a prescriptive landing zone, shared security accounts, account vending, baselines, controls, governance visibility, and drift management.',
  whyItMatters: 'The choice is not normally one or the other: Control Tower operates on an AWS organization and adds managed governance capabilities.',
  workplaceExample: 'A small business uses Organizations for billing and a few SCPs. As its account estate grows, it adopts Control Tower to standardize logging, account provisioning, shared accounts, and control reporting.',
  examFocus: 'Choose Organizations when the requirement is account grouping, consolidated billing, policies, or basic central management. Choose Control Tower when the requirement is rapidly establishing and governing a best-practice multi-account landing zone.',
  keyPoints: ['Organizations is the multi-account foundation.', 'Control Tower orchestrates Organizations plus other services.', 'Organizations OUs are not automatically governed by Control Tower.', 'Control Tower provides Account Factory and landing-zone controls.', 'Existing organizations can adopt Control Tower with planning.'],
  commonMistake: 'Describing Control Tower as a replacement organization that sits beside AWS Organizations.',
  example: 'Use Organizations to represent the account hierarchy and Control Tower to baseline selected OUs, provision governed accounts, and monitor control status.',
  sources: [{ title: 'What is AWS Control Tower?', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html' }, { title: 'Manage accounts through AWS Organizations', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/organizations.html' }, { title: 'Plan your AWS Control Tower landing zone', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/planning-your-deployment.html' }]
});
