import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-13",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk with Elastic Load Balancing",
  "status": "ready",
  "plainEnglish": "In a Load-Balanced environment, Elastic Beanstalk automatically provisions and manages an Elastic Load Balancer (ELB) to distribute incoming traffic across the Amazon EC2 instances in your environment. Elastic Beanstalk supports three load balancer types: Application Load Balancer (ALB, the default and recommended choice for HTTP/HTTPS with path-based routing), Network Load Balancer (NLB, for extreme performance and TCP/UDP traffic), and Classic Load Balancer (CLB, legacy).",
  "whyItMatters": "The load balancer serves as the public entry point for your application. It performs SSL/TLS decryption (offloading CPU load from your EC2 instances), continually sends health check pings to application endpoints (e.g. `/health`), and automatically stops sending traffic to unhealthy instances.",
  "workplaceExample": "A SaaS provider configures an Application Load Balancer in Elastic Beanstalk. The ALB terminates HTTPS traffic using an SSL certificate from AWS Certificate Manager (ACM), performs HTTP-to-HTTPS redirection, and sends health check requests to `/api/health` every 15 seconds.",
  "examFocus": "For SAA-C03, know that the Application Load Balancer (ALB) is the default ELB type for Elastic Beanstalk. Understand that SSL/TLS certificates should be attached directly to the load balancer listener (port 443). ELB health check URLs should be configured to a dedicated lightweight endpoint (like `/health` or `/status`) that returns HTTP 200.",
  "keyPoints": [
    "Application Load Balancer (ALB) is the default and recommended load balancer in Elastic Beanstalk.",
    "Supports Application Load Balancer (HTTP/HTTPS), Network Load Balancer (TCP), and Classic Load Balancer.",
    "Performs continuous health checks on target instances and routes traffic only to healthy targets.",
    "Enables SSL/TLS certificate termination on listener port 443 using AWS Certificate Manager (ACM).",
    "Supports session stickiness (sticky cookies) and access logging to Amazon S3."
  ],
  "commonMistake": "Configuring the load balancer health check path to a heavy web page that queries multiple backend databases. If the database experiences transient latency, the health check times out and the ALB erroneously marks all healthy web instances as dead. Use a lightweight `/health` endpoint.",
  "example": "OptionSettings:\n  - Namespace: aws:elasticbeanstalk:environment\n    OptionName: LoadBalancerType\n    Value: application\n  - Namespace: aws:elasticbeanstalk:environment:process:default\n    OptionName: HealthCheckPath\n    Value: /health\n  - Namespace: aws:elasticbeanstalk:environment:process:default\n    OptionName: MatcherHTTPCode\n    Value: '200'",
  "sources": [
    {
      "title": "Configuring a Load Balancer in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.elb.html"
    },
    {
      "title": "Application Load Balancer Configuration for Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-alb.html"
    }
  ]
});
