import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecs-9', topicId: 'topic-ecs', topicTitle: 'ECS (Elastic Container Service)', objectiveCode: 'Containers',
  title: 'ECS Tasks', status: 'ready',
  plainEnglish: 'An ECS task is a running instance of a task definition. A task may contain one container or several containers that need to run together.',
  whyItMatters: 'Tasks are the actual units ECS schedules, starts, stops and reports health for.',
  workplaceExample: 'A nightly data conversion runs as a standalone task and exits after it processes the input file.',
  examFocus: 'Use standalone tasks for finite work; use a service when a desired number of tasks must remain running.',
  keyPoints: ['Each task uses one task-definition revision.', 'Tasks move through a lifecycle such as PROVISIONING, PENDING, RUNNING and STOPPED.', 'Essential-container failure stops the task.', 'Stopped tasks are not restarted unless managed by a service or scheduler.', 'Task placement depends on available compatible capacity.'],
  commonMistake: 'Running a standalone web task and expecting ECS to replace it after failure.',
  example: 'EventBridge Scheduler starts a one-off ECS task each night to create a report.',
  sources: [{ title: 'Amazon ECS task lifecycle', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-lifecycle-explanation.html' }, { title: 'Run standalone tasks', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_run_task.html' }]
});
