import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';
export default createAwsKnowledgeGuide({
  id:'ecs-18',topicId:'topic-ecs',topicTitle:'ECS (Elastic Container Service)',objectiveCode:'Containers',title:'ECS Cluster Auto Scaling',status:'ready',
  plainEnglish:'ECS cluster auto scaling uses an EC2 capacity provider to adjust Auto Scaling group instances when tasks need more or less host capacity.',
  whyItMatters:'It prevents tasks remaining pending because the EC2 cluster is full and reduces idle instances when demand falls.',
  workplaceExample:'A spike creates pending tasks; ECS calculates required capacity and increases the container-instance Auto Scaling group.',
  examFocus:'It manages EC2 infrastructure capacity, not the application service desired count.',
  keyPoints:['Managed scaling uses CloudWatch metrics and scaling policies.','CapacityProviderReservation reflects capacity demand.','Target capacity controls spare headroom.','Managed termination protection helps avoid terminating busy hosts.','Only EC2-backed capacity uses cluster auto scaling.'],
  commonMistake:'Expecting cluster auto scaling to increase the number of application tasks.',
  example:'Use Service Auto Scaling to request ten workers and cluster auto scaling to add enough EC2 hosts for them.',
  sources:[{title:'Amazon ECS cluster auto scaling',url:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-auto-scaling.html'}]
});
