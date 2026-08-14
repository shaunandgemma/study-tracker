import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-10",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Environment Tiers",
  "status": "ready",
  "plainEnglish": "Elastic Beanstalk Environment Tiers refer to the architectural role and infrastructure blueprint assigned to an environment. Elastic Beanstalk offers two distinct tiers: the Web Server Tier (designed for interactive HTTP/HTTPS web applications and REST APIs running behind an Elastic Load Balancer) and the Worker Tier (designed for asynchronous, background message processing driven by Amazon SQS and an on-instance SQS daemon).",
  "whyItMatters": "Separating an application's architecture into dedicated environment tiers allows each layer to scale independently based on its specific workload dynamics. Web servers scale based on HTTP latency or network traffic, while background workers scale based on queue depth and processing backlog.",
  "workplaceExample": "A ride-sharing platform runs two Beanstalk environment tiers: a Web Server tier handling user app ride requests via an Application Load Balancer, and a Worker tier listening to an SQS queue that calculates driver billing statements, generates PDFs, and sends email receipts.",
  "examFocus": "For SAA-C03, be prepared to distinguish between the two environment tiers based on scenario requirements. If the workload involves direct user HTTP traffic, SSL termination, and sub-second response times, choose the Web Server Tier. If the workload involves decoupling heavy batch jobs, processing SQS queues, or periodic cron tasks, choose the Worker Tier.",
  "keyPoints": [
    "Web Server Tier provisions an Elastic Load Balancer (ALB) and EC2 Auto Scaling group for HTTP/HTTPS traffic.",
    "Worker Tier provisions an Amazon SQS queue and EC2 Auto Scaling group for background processing.",
    "Both tiers can run within the same Elastic Beanstalk Application container.",
    "Tiers scale independently using relevant CloudWatch metrics (HTTP requests vs SQS queue depth).",
    "Environment tier type is selected during environment creation and defines the underlying infrastructure stack."
  ],
  "commonMistake": "Attempting to change an environment tier from Web Server to Worker after creation. The environment tier is an immutable architectural choice established at environment creation; to change tiers, create a new environment with the desired tier.",
  "example": "OptionSettings:\n  - Namespace: aws:elasticbeanstalk:environment\n    OptionName: EnvironmentType\n    Value: LoadBalanced\n  - Namespace: aws:elasticbeanstalk:environment\n    OptionName: ServiceRole\n    Value: 'arn:aws:iam::123456789012:role/aws-elasticbeanstalk-service-role'",
  "sources": [
    {
      "title": "Elastic Beanstalk Environment Tiers",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html"
    },
    {
      "title": "Architecting Multi-Tier Applications on Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts.environment"
    }
  ]
});
