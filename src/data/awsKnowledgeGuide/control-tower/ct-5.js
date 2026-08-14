import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-5', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'AWS Organizations Integration', status: 'ready',
  plainEnglish: 'AWS Organizations supplies the organization, management account, member accounts, organizational units, consolidated billing, and policy hierarchy used by Control Tower. Control Tower registers selected OUs and layers baselines, controls, shared accounts, and account provisioning onto that structure.',
  whyItMatters: 'Understanding the boundary prevents administrators from making unmanaged Organizations changes that cause Control Tower drift.',
  workplaceExample: 'A company already has an organization. It adds a Control Tower landing zone, then deliberately registers existing OUs so controls apply to their accounts.',
  examFocus: 'Organizations alone provides central account and policy management. Control Tower adds the prescriptive landing zone and governance experience. An OU created outside Control Tower is not automatically governed until it is registered or baselined.',
  keyPoints: ['Control Tower relies on AWS Organizations.', 'Organizations controls account and OU hierarchy.', 'Registering an OU extends Control Tower governance.', 'Consolidated billing remains an Organizations capability.', 'Uncoordinated hierarchy changes can create drift.'],
  commonMistake: 'Assuming every account in the organization is automatically enrolled and governed by Control Tower.',
  example: 'Create the OU structure intentionally, register the workload OU, then enroll or provision accounts into that governed boundary.',
  sources: [{ title: 'Manage accounts through AWS Organizations', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/organizations.html' }, { title: 'What is AWS Control Tower?', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html' }]
});
