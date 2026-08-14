import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';
export default createAwsKnowledgeGuide({
  id:'ecs-12',topicId:'topic-ecs',topicTitle:'ECS (Elastic Container Service)',objectiveCode:'Containers',title:'ECS on AWS Fargate',status:'ready',
  plainEnglish:'AWS Fargate runs ECS tasks without you creating or managing EC2 container instances. You choose task CPU, memory, networking and an image; AWS manages the underlying compute.',
  whyItMatters:'It removes server capacity and patching work, making it useful for teams that want task-level isolation and operational simplicity.',
  workplaceExample:'A small team runs a private-subnet API on Fargate and scales the service from two to ten tasks during busy periods.',
  examFocus:'Fargate requires awsvpc networking and supported task-level CPU and memory combinations.',
  keyPoints:['No EC2 hosts are managed by the customer.','Billing is based on requested task resources and runtime.','Each task receives its own network interface.','Fargate supports Linux and Windows with platform restrictions.','Task and execution IAM roles are still required where appropriate.'],
  commonMistake:'Choosing an unsupported CPU and memory combination or subnets with no route to required endpoints.',
  example:'Run two 0.5-vCPU, 1-GB Fargate tasks across two private subnets behind an ALB.',
  sources:[{title:'AWS Fargate for Amazon ECS',url:'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html'}]
});
