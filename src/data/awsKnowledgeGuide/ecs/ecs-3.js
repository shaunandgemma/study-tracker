import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecs-3', topicId: 'topic-ecs', topicTitle: 'ECS (Elastic Container Service)', objectiveCode: 'Containers',
  title: 'ECS Task Networking Modes: awsvpc, host, bridge and none', status: 'ready',
  plainEnglish: 'The network mode decides how a container reaches the network. awsvpc gives each task its own elastic network interface and VPC identity; bridge shares the host through Docker; host uses the host network directly; none disables external networking.',
  whyItMatters: 'The mode affects security groups, port mapping, task density and how other services reach a task.',
  workplaceExample: 'A Fargate web service uses awsvpc so every task receives a private IP and can be protected by the service security group.',
  examFocus: 'Know that Fargate requires awsvpc and that awsvpc lets security groups apply to individual tasks.',
  keyPoints: ['awsvpc assigns an ENI and private IP to each task.', 'bridge uses Docker networking and dynamic or static host ports.', 'host removes network isolation between the task and EC2 host.', 'none prevents external network connectivity.', 'Network-mode support differs between EC2 and Fargate.'],
  commonMistake: 'Using host mode and assigning the same container port to several tasks on one EC2 instance.',
  example: 'Choose awsvpc for a Fargate API, place tasks in private subnets and allow only the load balancer security group to reach the task port.',
  sources: [{ title: 'Amazon ECS task networking', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html' }, { title: 'Task networking with awsvpc', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking-awsvpc.html' }]
});
