import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';
export default createAwsKnowledgeGuide({
  id:'ecs-15',topicId:'topic-ecs',topicTitle:'ECS (Elastic Container Service)',objectiveCode:'Containers',title:'FARGATE_SPOT Capacity Provider',status:'ready',
  plainEnglish:'FARGATE_SPOT runs eligible ECS tasks on spare AWS capacity at a lower price, but AWS can interrupt a task when the capacity is needed elsewhere.',
  whyItMatters:'It reduces cost for fault-tolerant work that can stop and restart safely.',
  workplaceExample:'A media-thumbnail worker consumes durable SQS messages on Fargate Spot; interrupted messages become visible for another worker.',
  examFocus:'Use Spot for interruption-tolerant workloads, not as the sole capacity for critical tasks that cannot recover.',
  keyPoints:['Tasks can receive a two-minute interruption notice.','Applications should handle SIGTERM and stopTimeout.','Availability is not guaranteed.','It can be mixed with regular Fargate.','Durable queues make retryable workers a strong fit.'],
  commonMistake:'Running a single stateful or irreplaceable task entirely on Fargate Spot.',
  example:'Use FARGATE for the service base and FARGATE_SPOT for additional queue consumers.',
  sources:[{title:'Fargate capacity providers',url:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html'}]
});
