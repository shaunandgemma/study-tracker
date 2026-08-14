import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';
export default createAwsKnowledgeGuide({
  id:'ecs-16',topicId:'topic-ecs',topicTitle:'ECS (Elastic Container Service)',objectiveCode:'Containers',title:'EC2 Capacity Providers',status:'ready',
  plainEnglish:'An EC2 capacity provider connects an ECS cluster to an Auto Scaling group so ECS can place tasks on and help scale the underlying instances.',
  whyItMatters:'It coordinates task demand with host capacity instead of forcing operators to scale tasks and instances separately.',
  workplaceExample:'A service adds tasks, managed scaling increases the Auto Scaling group, and new container instances register with the cluster.',
  examFocus:'The capacity provider scales instances; Service Auto Scaling separately controls the number of tasks.',
  keyPoints:['It is backed by an Auto Scaling group.','Managed scaling can adjust desired instance capacity.','Managed termination protection can protect busy instances.','Instance warm-up affects scaling decisions.','The Auto Scaling group should be dedicated to its capacity provider.'],
  commonMistake:'Confusing EC2 cluster capacity scaling with scaling the ECS service desired count.',
  example:'Attach an Auto Scaling group of compute-optimized instances to a batch-processing cluster.',
  sources:[{title:'Amazon ECS capacity providers',url:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-capacity-providers.html'},{title:'Amazon ECS cluster auto scaling',url:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-auto-scaling.html'}]
});
