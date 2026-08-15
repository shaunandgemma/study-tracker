import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-10",
  "title": "Fargate with Application Load Balancer",
  "plainEnglish": "An Application Load Balancer (ALB) operates at Layer 7 (HTTP/HTTPS) of the OSI model to route external client traffic across a pool of Amazon ECS tasks running on AWS Fargate. Because Fargate tasks use awsvpc networking, the ALB distributes requests directly to each task's private IP address through an ALB Target Group configured with the 'ip' target type.",
  "whyItMatters": "Pairing an ALB with an ECS Fargate service provides high availability, path-based and host-based routing, automatic SSL/TLS termination with AWS Certificate Manager, zero-downtime rolling deployments, and automated health checks that replace unhealthy container tasks seamlessly.",
  "workplaceExample": "A media company hosts a multi-service web application. An ALB receives public HTTPS traffic on port 443, inspects request URL paths, and routes '/api/v1/users/*' to a Fargate user-service target group while routing '/api/v1/videos/*' to a separate Fargate video-service target group running in private subnets across three Availability Zones.",
  "examFocus": "Know that when attaching an Application Load Balancer to an ECS service on Fargate, the Target Group target type MUST be 'ip' (not 'instance'). ECS automatically registers the private ENI IP address of newly launched Fargate tasks with the ALB target group and deregisters stopping tasks with configurable connection draining (deregistration delay).",
  "keyPoints": [
    "Application Load Balancers route HTTP/HTTPS traffic to ECS Fargate tasks using Layer 7 path, host, query string, and header rules.",
    "Target Groups for Fargate services must be created with target type set to 'ip' (awsvpc network mode requirement).",
    "Amazon ECS automatically registers task private IP addresses with the ALB target group upon launch and deregisters them during scale-in or deployment.",
    "ALB health checks continuously ping container endpoints; if a task fails health checks, ECS terminates and replaces the failing task.",
    "Supports zero-downtime rolling deployments using minimumHealthyPercent and maximumPercent service configuration parameters.",
    "Enables AWS WAF (Web Application Firewall) integration on the ALB to protect Fargate microservices from common web exploits and DDoS attacks."
  ],
  "commonMistake": "Configuring the ALB security group to allow inbound traffic from the internet, but forgetting to allow traffic from the ALB security group in the Fargate task's security group on the container application port, resulting in HTTP 504 Gateway Timeout errors.",
  "example": "Create an ALB target group with target type IP and attach it to an ECS Fargate service: aws elbv2 create-target-group --name fargate-tg --protocol HTTP --port 8080 --vpc-id vpc-01234567 --target-type ip, then specify the targetGroupArn in the ECS service loadBalancers block.",
  "sources": [
    {
      "title": "Service Load Balancing in Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html"
    },
    {
      "title": "Using Application Load Balancers with Amazon ECS",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html"
    }
  ]
});
