import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'apig-21',
  topicId: 'topic-api-gateway',
  topicTitle: 'Amazon API Gateway',
  objectiveCode: 'Integration',
  title: 'Stages and Deployments',
  status: 'ready',
  plainEnglish: 'A deployment is a point-in-time snapshot of an API configuration. A stage is a named environment, such as test or prod, that points to a deployment and supplies callable stage settings. Depending on API type, stage settings can include logging, throttling, variables, automatic deployment, and other controls. Changing a REST API definition does not update clients until a new deployment is associated with their stage.',
  whyItMatters: 'Stages separate release environments and operational settings while deployments provide controlled, repeatable versions. They let teams test changes, promote releases, observe each environment, and perform gradual canary rollouts where supported.',
  workplaceExample: 'A REST API has test and prod stages. Engineers deploy a new snapshot to test, validate logs and integrations, then direct a small percentage of prod traffic to a canary deployment before promoting it.',
  examFocus: 'Remember the snapshot-versus-pointer relationship: deployment captures configuration; stage exposes it. REST API changes generally require redeployment. HTTP API stages can use automatic deployment so changes become available without manually creating a deployment. REST canary releases split a percentage of one stage’s traffic and can override stage variables. Stage variables are configuration values, not a place for secrets.',
  keyPoints: [
    'A deployment is a snapshot of API configuration.',
    'A stage is a named, callable reference to a deployment.',
    'Stage settings can differ between environments.',
    'REST API definition changes require a new deployment to take effect.',
    'HTTP API stages can enable automatic deployment.',
    'REST canaries send a configured traffic percentage to a newer deployment.'
  ],
  commonMistake: 'Testing an edited REST method in the console and assuming production changed ignores the deployed snapshot. Create a new deployment for the intended stage, verify its deployment identifier and settings, then test through the stage URL.',
  example: 'Deploy a harmless response change to test, call the test stage and confirm the new value, then confirm prod still returns the old value. Promote by deploying deliberately to prod or through a canary, and verify access logs identify the expected stage and deployment behavior.',
  sources: [
    { title: 'Deploy REST APIs in API Gateway', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api.html' },
    { title: 'Set up an API Gateway canary release deployment', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html' },
    { title: 'Use stage variables for a REST API', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/stage-variables.html' }
  ]
});
