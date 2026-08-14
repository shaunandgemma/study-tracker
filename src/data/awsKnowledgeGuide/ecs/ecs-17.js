import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';
export default createAwsKnowledgeGuide({
  id:'ecs-17',topicId:'topic-ecs',topicTitle:'ECS (Elastic Container Service)',objectiveCode:'Containers',title:'ECS Service Auto Scaling',status:'ready',
  plainEnglish:'ECS Service Auto Scaling changes a service desired count in response to demand, a schedule or manual scaling policies.',
  whyItMatters:'It adds tasks during load and removes unnecessary tasks when demand falls.',
  workplaceExample:'A target-tracking policy keeps average ECS service CPU near 60 percent while respecting minimum and maximum task counts.',
  examFocus:'Service Auto Scaling scales tasks, while cluster auto scaling supplies EC2 host capacity.',
  keyPoints:['Target tracking maintains a chosen metric target.','Step scaling reacts to alarm thresholds.','Scheduled scaling prepares for known demand.','Minimum and maximum capacity bound changes.','Scale-in and scale-out cooldowns reduce instability.'],
  commonMistake:'Scaling task count on an EC2 cluster that lacks capacity to place the new tasks.',
  example:'Set minimum two, maximum twenty and target average CPU utilization of 60 percent.',
  sources:[{title:'Automatically scale an Amazon ECS service',url:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html'}]
});
