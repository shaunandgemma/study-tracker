import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-5",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Platform as a Service",
  "status": "ready",
  "plainEnglish": "AWS Elastic Beanstalk is a Platform as a Service (PaaS) offering that allows developers to deploy and scale web applications and services rapidly. You simply upload your code (written in Java, .NET, Node.js, PHP, Python, Ruby, Go, or Docker), and Elastic Beanstalk automatically handles capacity provisioning, load balancing, auto scaling, and application health monitoring while giving you full administrative control over the underlying AWS resources.",
  "whyItMatters": "Setting up production-ready web infrastructure from scratch requires configuring VPC subnets, Application Load Balancers, Auto Scaling Groups, launch templates, security groups, CloudWatch alarms, and log forwarding. Elastic Beanstalk automates this entire pipeline in minutes without taking away control of the underlying EC2 instances.",
  "workplaceExample": "A software engineering team building a Python Flask application deploys their code using the AWS Beanstalk CLI (`eb deploy`). Elastic Beanstalk provisions an Auto Scaling group of EC2 instances behind an Application Load Balancer and configures health checks automatically, letting the developers focus purely on writing code.",
  "examFocus": "For SAA-C03, remember that Elastic Beanstalk is AWS's flagship PaaS. You retain full control over the underlying AWS infrastructure (unlike pure serverless where servers are abstracted). There is no extra charge for Elastic Beanstalk itself; you pay only for the underlying AWS resources (EC2, ELB, S3) provisioned by your environment.",
  "keyPoints": [
    "Platform as a Service (PaaS) that automates deployment, scaling, and monitoring of web applications.",
    "Supports multiple runtimes including Node.js, Python, Java, Go, PHP, .NET, Ruby, and Docker.",
    "Automates provisioning of EC2 instances, Application Load Balancers, and Auto Scaling groups.",
    "You retain complete root and SSH access to the underlying infrastructure components.",
    "Free service tier: No additional fee for Beanstalk itself; you pay only for underlying resources."
  ],
  "commonMistake": "Thinking Elastic Beanstalk is a black-box service where you cannot modify the underlying EC2 instances or load balancers. You retain complete visibility, SSH access, and configuration control over all resources Beanstalk creates.",
  "example": "# Deploying an application to Elastic Beanstalk using the EB CLI:\neb init -p python-3.9 my-flask-app\neb create my-production-env\neb deploy",
  "sources": [
    {
      "title": "What is AWS Elastic Beanstalk?",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html"
    },
    {
      "title": "Elastic Beanstalk Supported Platforms",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.platforms.html"
    }
  ]
});
