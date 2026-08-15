import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-11",
  "title": "Target Types - Instance, IP and Lambda",
  "plainEnglish": "A target group's target type determines what identifier is registered. For an ALB, instance targets register EC2 instance IDs, IP targets register private IP addresses, and Lambda targets register one Lambda function.",
  "whyItMatters": "The correct target type connects the load balancer to the actual workload. It also affects the network destination and port, supported features, and whether container tasks, on-premises hosts, or serverless functions can participate.",
  "workplaceExample": "An ECS service using awsvpc networking registers each task's private IP in an IP target group, while a serverless webhook uses a separate Lambda target group behind the same ALB.",
  "examFocus": "For ALB, recognize instance, IP, and Lambda target types. Instance mode routes to the instance's primary private IP on the registered port; IP mode routes directly to registered private addresses; Lambda invokes a function. The target type cannot be changed after creation.",
  "keyPoints": [
    "The target type is selected when the target group is created and cannot later be changed.",
    "Instance targets are registered by EC2 instance ID.",
    "IP targets use supported private IP addresses and can represent resources outside the load balancer VPC when connectivity exists.",
    "IP target type is commonly used for ECS tasks with awsvpc networking.",
    "A Lambda target group contains a single Lambda function target.",
    "Lambda target groups have different protocol, health-check, and request/response behavior from instance or IP groups."
  ],
  "commonMistake": "Registering an ECS task's host instance ID when traffic should go directly to the task IP can route to the wrong network endpoint. Match the target type to the service's networking mode.",
  "example": "Create an IP target group for container tasks, register each task's private address and application port, attach it to an ALB rule, and let the ECS service maintain registrations as tasks scale.",
  "sources": [
    {
      "title": "Target groups for Application Load Balancers",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html"
    },
    {
      "title": "Use Lambda functions as targets of an Application Load Balancer",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/lambda-functions.html"
    }
  ]
});
