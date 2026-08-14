import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-1', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Automated Multi-Account Landing Zone Best Practices Setup', status: 'ready',
  plainEnglish: 'AWS Control Tower sets up and governs a multi-account AWS environment called a landing zone. It orchestrates AWS Organizations, IAM Identity Center, Service Catalog, CloudTrail, AWS Config, and other services to establish account structure, shared security accounts, identity access, logging, and governance controls.',
  whyItMatters: 'Building these foundations manually is complex and easy to implement inconsistently. Control Tower provides a repeatable starting point based on AWS multi-account practices.',
  workplaceExample: 'A company separates production, development, security, and log storage into different accounts. Control Tower creates the governance foundation and applies common controls as new workload accounts are provisioned.',
  examFocus: 'Choose Control Tower when a scenario needs a prescriptive, governed multi-account landing zone. AWS Organizations supplies the organization and policy hierarchy; Control Tower orchestrates the broader landing-zone experience on top of it.',
  keyPoints: ['A landing zone is a governed multi-account environment.', 'Control Tower uses existing AWS services rather than replacing them.', 'The Security OU contains shared Audit and Log Archive accounts.', 'Registered OUs and enrolled accounts receive Control Tower governance.', 'One landing zone can be configured per AWS organization.'],
  commonMistake: 'Treating Control Tower as a separate replacement for AWS Organizations. It uses and extends an Organizations structure.',
  example: 'Set up the landing zone, confirm shared accounts and Regions, register workload OUs, then provision accounts through Account Factory rather than building each account differently.',
  sources: [{ title: 'What is AWS Control Tower?', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html' }, { title: 'How AWS Control Tower works', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html' }, { title: 'Plan your AWS Control Tower landing zone', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/planning-your-deployment.html' }]
});
