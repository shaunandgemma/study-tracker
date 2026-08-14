import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecs-8', topicId: 'topic-ecs', topicTitle: 'ECS (Elastic Container Service)', objectiveCode: 'Containers',
  title: 'ECS Task Definitions', status: 'ready',
  plainEnglish: 'A task definition is a versioned JSON blueprint describing one or more containers, their images, CPU, memory, ports, roles, logs, environment values and storage.',
  whyItMatters: 'It makes a container workload repeatable and lets deployments move safely between immutable revisions.',
  workplaceExample: 'A new image tag and larger memory limit are registered as revision 12, then the service deploys that revision.',
  examFocus: 'Know the difference between task role and execution role, and check Fargate CPU, memory and network compatibility.',
  keyPoints: ['Task definitions belong to a family.', 'Every registration creates a new revision.', 'Container definitions describe runtime settings.', 'A task definition can contain sidecars.', 'Services reference a particular family revision.'],
  commonMistake: 'Putting application AWS permissions on the execution role instead of the task role.',
  example: 'A web task contains an app container plus a telemetry sidecar and sends both log streams to CloudWatch Logs.',
  sources: [{ title: 'Amazon ECS task definitions', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html' }, { title: 'Task definition parameters', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html' }]
});
