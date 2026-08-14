import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';
export default createAwsKnowledgeGuide({
  id:'ecs-13',topicId:'topic-ecs',topicTitle:'ECS (Elastic Container Service)',objectiveCode:'Containers',title:'ECS Capacity Providers',status:'ready',
  plainEnglish:'A capacity provider tells ECS where task capacity comes from. It can represent Fargate, Fargate Spot or an EC2 Auto Scaling group.',
  whyItMatters:'Capacity-provider strategies let a service distribute tasks across capacity types using a base amount and relative weights.',
  workplaceExample:'A service places its first two tasks on Fargate and distributes additional tasks between Fargate and Fargate Spot.',
  examFocus:'Base is satisfied by only one provider; weight controls the relative share of remaining tasks.',
  keyPoints:['Providers must be associated with the cluster.','A strategy can contain multiple providers.','Base defines a minimum on one provider.','Weight controls proportional placement.','EC2 providers can manage Auto Scaling group capacity.'],
  commonMistake:'Setting every provider weight to zero, leaving ECS no valid placement choice.',
  example:'Use base 2 on FARGATE and weights 1:2 for FARGATE and FARGATE_SPOT after the base.',
  sources:[{title:'Amazon ECS capacity providers',url:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-capacity-providers.html'}]
});
