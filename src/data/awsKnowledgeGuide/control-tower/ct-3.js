import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-3', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Account Factory for automated standardized account provisioning', status: 'ready',
  plainEnglish: 'Account Factory is the standardized account-provisioning capability in Control Tower. Administrators define approved account settings, and authorized users create member accounts that are placed into a governed OU with the landing-zone baseline applied.',
  whyItMatters: 'Standardized vending reduces manual tickets, inconsistent network settings, and accounts that begin outside security and logging governance.',
  workplaceExample: 'A development team requests a sandbox account. Account Factory creates it in the Sandbox OU with approved identity access and governance rather than giving the team access to the management account.',
  examFocus: 'Choose Account Factory when users need repeatable self-service account creation. Account Factory for Terraform extends this model with a Terraform-based GitOps pipeline and custom account provisioning.',
  keyPoints: ['Account Factory provisions new member accounts.', 'Accounts target an OU with the required Control Tower baseline.', 'Approved settings standardize each account.', 'IAM Identity Center and Service Catalog participate in provisioning.', 'Account Factory for Terraform supports Terraform-based automation and customization.'],
  commonMistake: 'Using Account Factory to create resources inside an existing workload account. Its primary unit of provisioning is an AWS account.',
  example: 'Define approved account settings, permit a platform-team group to provision, and place newly vended development accounts in the registered Development OU.',
  sources: [{ title: 'Provision and manage accounts with Account Factory', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/account-factory.html' }, { title: 'Provision accounts within AWS Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/methods-of-provisioning.html' }]
});
