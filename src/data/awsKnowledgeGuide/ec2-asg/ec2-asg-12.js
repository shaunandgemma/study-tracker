import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ec2-asg-12",
  "topicId": "topic-ec2-asg",
  "topicTitle": "EC2 Auto Scaling",
  "objectiveCode": "Compute",
  "title": "EC2 Health Checks",
  "status": "ready",
  "plainEnglish": "EC2 Health Checks are the default health monitoring mechanism used by Amazon EC2 Auto Scaling Groups. They evaluate two low-level status checks: System Status Checks (which verify physical AWS infrastructure, power, network connectivity, and hypervisor health) and Instance Status Checks (which verify the operating system reachability, networking stack, and kernel responsiveness of the virtual machine). If an instance status check reports `Impaired` or fails to respond, the ASG marks the instance `Unhealthy` and replaces it.",
  "whyItMatters": "Physical server hardware failures and virtual machine kernel panics are inevitable at enterprise scale. EC2 Health Checks provide automated self-healing without requiring external monitoring agents or manual operator intervention, keeping your compute capacity at its desired baseline.",
  "workplaceExample": "An EC2 instance in an Auto Scaling group encounters an underlying host hardware degradation on an AWS physical rack. AWS marks the System Status Check as impaired. The ASG detects the failing EC2 status check within minutes, terminates the instance, and launches a fresh replacement on a healthy physical host.",
  "examFocus": "For SAA-C03, know that EC2 Status Checks are enabled by default on all ASGs (`HealthCheckType: EC2`). Key limitation: EC2 Health Checks only test whether the VM is running and reachable on the network; they CANNOT detect if your custom web application (like Node.js or Apache) has frozen or crashed. For application-level awareness, configure ELB Health Checks.",
  "keyPoints": [
    "Default health check mechanism for Amazon EC2 Auto Scaling Groups.",
    "Monitors both System Status Checks (hardware/host) and Instance Status Checks (OS/kernel).",
    "Automatically terminates and replaces instances that enter an impaired state.",
    "Does NOT evaluate application-level response codes (HTTP 200 vs HTTP 500).",
    "Enabled without requiring an Elastic Load Balancer."
  ],
  "commonMistake": "Relying solely on EC2 Health Checks for web servers. If the web server application process crashes while the Linux OS kernel remains responsive, EC2 Health Checks will report healthy, leaving a broken web server serving errors to users.",
  "example": "# Describe instance health status inside an ASG:\naws autoscaling describe-auto-scaling-instances \\\n  --instance-ids i-0123456789abcdef0",
  "sources": [
    {
      "title": "Amazon EC2 Status Checks for Instances",
      "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-system-instance-status-check.html"
    },
    {
      "title": "Health Checks for Auto Scaling Instances",
      "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html"
    }
  ]
});
