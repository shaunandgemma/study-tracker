import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-11",
  "title": "Fargate Service Auto Scaling",
  "plainEnglish": "Amazon ECS Service Auto Scaling uses AWS Application Auto Scaling to automatically adjust the desired count of running tasks in an ECS Fargate service. When traffic increases, it adds more container tasks; when traffic decreases, it scales down the task count to save costs, operating within your defined minimum and maximum task capacity boundaries.",
  "whyItMatters": "Container workloads experience fluctuating user demand throughout the day. Service Auto Scaling ensures your application maintains steady performance during traffic surges without requiring engineers to manually adjust task counts or maintain costly idle excess capacity 24/7.",
  "workplaceExample": "A ride-sharing application experiences heavy traffic during morning and evening rush hours. The team configures Target Tracking Service Auto Scaling on their Fargate dispatch service targeting an average CPU utilization of 60%. The service automatically scales from 4 tasks at midnight to 40 tasks during rush hour and back down seamlessly.",
  "examFocus": "Understand the three types of ECS Service Auto Scaling policies: Target Tracking (maintains a specific metric target, like average CPU or ALBRequestCountPerTarget), Step Scaling (scales in steps based on CloudWatch alarm thresholds), and Scheduled Scaling (scales at specific dates/times, e.g., before predictable marketing campaigns).",
  "keyPoints": [
    "Uses AWS Application Auto Scaling to automatically adjust the ECS service's desired task count.",
    "Supported policy types include Target Tracking Scaling, Step Scaling, and Scheduled Scaling.",
    "Predefined metrics for Target Tracking include ECSServiceAverageCPUUtilization, ECSServiceAverageMemoryUtilization, and ALBRequestCountPerTarget.",
    "Custom CloudWatch metrics (e.g., SQS queue backlog depth with ApproximateNumberOfMessagesVisible) can be used with Step Scaling or Target Tracking.",
    "Scale-out and scale-in cooldown periods prevent rapid thrashing (flapping) of task counts during temporary metric fluctuations.",
    "Enforces strict Minimum and Maximum task limits to guarantee baseline availability and control upper-bound compute expenditure."
  ],
  "commonMistake": "Attempting to use EC2 Auto Scaling groups to scale Fargate tasks. Fargate tasks do not run on EC2 instances; you must configure Application Auto Scaling directly on the ECS Service.",
  "example": "Register a scalable target and apply a Target Tracking policy using the AWS CLI: aws application-autoscaling register-scalable-target --service-namespace ecs --resource-id service/my-cluster/my-fargate-service --scalable-dimension ecs:service:DesiredCount --min-capacity 2 --max-capacity 20, then apply a target tracking policy targeting 70% average CPU utilization.",
  "sources": [
    {
      "title": "Amazon ECS Service Auto Scaling",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html"
    },
    {
      "title": "Target Tracking Scaling Policies for Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-autoscaling-targettracking.html"
    }
  ]
});
