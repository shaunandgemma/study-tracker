import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-7', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Account Factory', status: 'ready',
  plainEnglish: 'Account Factory provides a governed way to create, update, enroll, and manage member accounts. It uses approved inputs such as account email, display name, target OU, identity owner, and optional account or network customization.',
  whyItMatters: 'It gives teams account-level isolation quickly while retaining the central platform standards required by security and operations.',
  workplaceExample: 'A project owner requests a new production account through an approved process. The account is created in the Production OU and receives its baseline before workloads are deployed.',
  examFocus: 'Account Factory provisions accounts, not individual application stacks. It can use console workflows, Service Catalog, APIs, custom blueprints, or Account Factory for Terraform depending on the operating model.',
  keyPoints: ['Account Factory standardizes account vending.', 'The target OU needs the appropriate baseline.', 'Existing accounts can be enrolled when prerequisites pass.', 'Customizations can extend the standard baseline.', 'Provisioned account emails must be unique.'],
  commonMistake: 'Reusing or changing account email values without understanding that AWS account identities and IAM Identity Center users are separate concerns.',
  example: 'Create a development account with a unique account email, place it in the governed Development OU, and verify enrollment before deploying resources.',
  sources: [{ title: 'Provision and manage accounts with Account Factory', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/account-factory.html' }, { title: 'Provision accounts in the Control Tower console', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/account-create-console.html' }]
});
