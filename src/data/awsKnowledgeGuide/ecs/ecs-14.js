import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';
export default createAwsKnowledgeGuide({
  id:'ecs-14',topicId:'topic-ecs',topicTitle:'ECS (Elastic Container Service)',objectiveCode:'Containers',title:'FARGATE Capacity Provider',status:'ready',
  plainEnglish:'FARGATE is the regular serverless ECS capacity provider. Tasks run on AWS-managed compute without Spot interruption risk.',
  whyItMatters:'It is the straightforward choice for steady or interruption-sensitive container workloads.',
  workplaceExample:'A customer-facing checkout service keeps its minimum task count on FARGATE for predictable availability.',
  examFocus:'Compare dependable FARGATE capacity with discounted, interruptible FARGATE_SPOT capacity.',
  keyPoints:['It requires no Auto Scaling group.','Tasks use awsvpc networking.','It can be mixed with FARGATE_SPOT in a strategy.','Supported Regions and platform capabilities apply.','Service Auto Scaling can change the task count.'],
  commonMistake:'Assuming FARGATE automatically makes an application highly available without multi-AZ subnets and multiple tasks.',
  example:'Place the base two production tasks on FARGATE before allowing extra fault-tolerant capacity on Spot.',
  sources:[{title:'Fargate capacity providers',url:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html'}]
});
