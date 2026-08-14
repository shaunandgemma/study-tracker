import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-8",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Web Server Environments",
  "status": "ready",
  "plainEnglish": "A Web Server Environment is an Elastic Beanstalk environment tier designed to handle standard HTTP and HTTPS web traffic from users and client applications. In a Load-Balanced Web Server Environment, incoming internet traffic hits an Elastic Load Balancer (Application Load Balancer, Network Load Balancer, or Classic Load Balancer) which distributes requests across an Auto Scaling group of Amazon EC2 instances running a web server (such as Nginx, Apache, or IIS) and your application runtime.",
  "whyItMatters": "Web Server environments provide built-in high availability and automated traffic distribution. As user traffic spikes, Beanstalk automatically adds EC2 instances behind the load balancer and shrinks the fleet when traffic subsides, preventing outages during peak demand.",
  "workplaceExample": "A news publishing company deploys its web frontend in a Load-Balanced Web Server Environment. During breaking news events, the ALB detects surging HTTP traffic and the Auto Scaling group scales out from 4 to 25 EC2 instances automatically, maintaining fast page load speeds.",
  "examFocus": "For SAA-C03, know that Web Server environments handle synchronous HTTP/HTTPS requests via an Elastic Load Balancer (ALB). Understand the distinction between Single-Instance web environments (1 EC2 instance + Elastic IP, no load balancer, intended for development only) and Load-Balanced web environments (ALB + Auto Scaling group, intended for production).",
  "keyPoints": [
    "Designed for synchronous client web requests over standard HTTP (port 80) and HTTPS (port 443).",
    "Uses an Elastic Load Balancer (ALB by default) to distribute traffic across EC2 instances.",
    "Auto Scaling group dynamically adjusts instance count based on CPU, request count, or custom metrics.",
    "Web servers (Nginx, Apache) act as reverse proxies to forward requests to the application process.",
    "Supports HTTPS termination directly at the Elastic Load Balancer using AWS Certificate Manager (ACM)."
  ],
  "commonMistake": "Terminating SSL/TLS certificates on individual EC2 instances inside a web server tier instead of attaching an ACM certificate to the Elastic Load Balancer. Offloading SSL to the ALB simplifies certificate renewal and reduces compute load on EC2 instances.",
  "example": "OptionSettings:\n  - Namespace: aws:elasticbeanstalk:environment\n    OptionName: EnvironmentType\n    Value: LoadBalanced\n  - Namespace: aws:elbv2:listener:443\n    OptionName: SSLCertificateArns\n    Value: 'arn:aws:acm:us-east-1:123456789012:certificate/abc-123'",
  "sources": [
    {
      "title": "Web Server Environments in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-types.html"
    },
    {
      "title": "Configuring a Load Balancer in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.elb.html"
    }
  ]
});
