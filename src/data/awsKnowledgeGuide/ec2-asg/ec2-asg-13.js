import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-13",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "ELB Health Checks",
  "status": "ready",
  "plainEnglish": "ELB Health Checks in Amazon EC2 Auto Scaling enable the Auto Scaling Group to determine instance health based on the results of Elastic Load Balancing target health checks (such as HTTP or HTTPS status codes returned from a `/healthz` or `/status` endpoint). When `HealthCheckType` is set to `ELB`, the ASG monitors both EC2 status checks AND the ELB target health status. If the load balancer marks an instance `Unhealthy` (for example, receiving HTTP 500 errors or connection timeouts), the ASG treats the instance as unhealthy and automatically replaces it.",
  "whyItMatters": "In modern microservices and web tiers, an application server can suffer thread deadlocks, out-of-memory errors, database connection dropouts, or internal 500 errors while the underlying EC2 operating system appears 100% fine. ELB Health Checks bridge the gap between VM infrastructure health and actual application responsiveness.",
  "workplaceExample": "A payment service runs Java Spring Boot apps on EC2 behind an Application Load Balancer. The ALB polls `/api/health` every 15 seconds. When a database connection leak causes an instance's Spring Boot container to hang and fail 3 consecutive health checks, the ALB marks the instance unhealthy, stops sending traffic to it, and the ASG terminates and replaces it automatically.",
  "examFocus": "For SAA-C03, remember these ELB health check rules: (1) To enable application-aware self-healing, set `HealthCheckType: ELB`. (2) When ELB health checks are enabled, the ASG evaluates BOTH EC2 status checks AND ELB target health. (3) Always configure a sufficient `HealthCheckGracePeriod` (e.g. 300 seconds) so that slowly booting applications are not killed prematurely before their web server starts listening.",
  "keyPoints": [
    "Evaluates application health using Elastic Load Balancer HTTP/HTTPS/TCP health checks.",
    "When enabled (`HealthCheckType: ELB`), ASG checks BOTH EC2 status and ELB health.",
    "Replaces instances that fail application-level health check endpoints.",
    "Prevents routing customer traffic to instances experiencing deadlocks or 5xx errors.",
    "Requires configuring `HealthCheckGracePeriod` to allow application bootstrap time."
  ],
  "commonMistake": "Setting `HealthCheckType: ELB` with a `HealthCheckGracePeriod` of 0 seconds. When an instance launches, its application takes 60 seconds to compile or warm up; with a 0-second grace period, the ASG immediately marks it unhealthy and enters an endless reboot loop.",
  "example": "# CloudFormation snippet configuring ELB Health Check with 5-minute grace period:\nType: AWS::AutoScaling::AutoScalingGroup\nProperties:\n  AutoScalingGroupName: WebApp-ASG\n  HealthCheckType: ELB\n  HealthCheckGracePeriod: 300\n  TargetGroupARNs:\n    - !Ref WebAppTargetGroup",
  "sources": [
    {
      "title": "ELB Health Checks for Auto Scaling Groups",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-custom-health-checks.html"
    },
    {
      "title": "Health Check Grace Period for Amazon EC2 Auto Scaling",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html"
    }
  ]
});
