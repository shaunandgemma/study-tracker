import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-11",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "Health Checks",
  "status": "ready",
  "plainEnglish": "Health Checks in Amazon EC2 Auto Scaling are periodic automated status inspections used by the Auto Scaling Group to determine whether each EC2 instance is healthy and operating properly. An ASG supports two primary health check types: EC2 status checks (which monitor hypervisor hardware and VM operating system responsiveness) and ELB health checks (which send HTTP/HTTPS requests to verify that the application layer is responding). When an instance fails health checks, the ASG marks it `Unhealthy` and automatically terminates and replaces it.",
  "whyItMatters": "Servers can hang, suffer software deadlock, or crash due to memory leaks without the underlying virtual machine shutting down. Relying solely on basic virtual machine status leaves unresponsive web servers serving errors to customers. Configuring health checks ensures only healthy instances receive customer traffic.",
  "workplaceExample": "A web application has a memory leak that causes the Nginx web server process to crash after 48 hours, returning HTTP 500 errors while the Linux kernel remains running. Because the ASG is configured with `HealthCheckType: ELB`, the ASG detects the failing `/health` HTTP endpoint, marks the instance `Unhealthy`, and launches a fresh replacement.",
  "examFocus": "For SAA-C03, understand health check configuration: (1) Default `HealthCheckType` is `EC2`. (2) If instances are behind an ELB/ALB, change `HealthCheckType` to `ELB` so the ASG will replace instances when the web application fails HTTP health checks. (3) `HealthCheckGracePeriod` specifies how long the ASG waits after an instance launches before checking health (giving applications time to boot and warm up).",
  "keyPoints": [
    "Monitors instance health to trigger automated self-healing instance replacements.",
    "HealthCheckType options: `EC2` (default) or `ELB` (includes Elastic Load Balancing health).",
    "ELB health checks test application responsiveness via HTTP/HTTPS/TCP health check paths.",
    "HealthCheckGracePeriod: Grace period in seconds (default 300s) before health checks begin.",
    "Custom health checks can be injected using the `set-instance-health` AWS CLI/API command."
  ],
  "commonMistake": "Keeping the default `HealthCheckType: EC2` on web servers behind an ALB. If the web server application crashes but the OS stays alive, EC2 health checks report healthy and the broken instance remains in service. Always set `HealthCheckType: ELB` for web workloads.",
  "example": "# Configure ASG to use ELB health checks with a 300-second grace period:\naws autoscaling update-auto-scaling-group \\\n  --auto-scaling-group-name Production-Web-ASG \\\n  --health-check-type ELB \\\n  --health-check-grace-period 300",
  "sources": [
    {
      "title": "Health Checks for Auto Scaling Instances",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html"
    },
    {
      "title": "Configuring Health Check Grace Period",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-check-grace-period.html"
    }
  ]
});
