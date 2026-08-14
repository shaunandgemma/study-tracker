import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-7",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Environments",
  "status": "ready",
  "plainEnglish": "An Elastic Beanstalk Environment represents a specific, running deployment of an application version on dedicated AWS infrastructure. Each environment provisions the underlying EC2 instances, load balancer, auto scaling group, security groups, and CloudWatch alarms needed to execute your application code. You can run multiple environments concurrently (e.g. dev, test, staging, production) within a single application.",
  "whyItMatters": "Environments isolate development testing from production traffic. Developers can safely deploy experimental application versions or test new EC2 instance types in a development environment without risking the stability of customer-facing production systems.",
  "workplaceExample": "A retail brand runs two environments inside their 'OnlineStore' application: a 'Store-Staging' environment with a single t3.medium EC2 instance for QA testing, and a 'Store-Production' load-balanced environment running 10 to 50 c5.large EC2 instances across 3 Availability Zones.",
  "examFocus": "For SAA-C03, know that an Environment is an active deployment of a specific Application Version running on a chosen Platform version. Environments can be configured as Single-Instance (cost-effective for development/testing) or Load-Balanced/Auto-Scaling (resilient for production). Environments have unique CNAME URLs (e.g. `myapp-env.eba-xyz.us-east-1.elasticbeanstalk.com`).",
  "keyPoints": [
    "An Environment is an active collection of provisioned AWS resources running an application version.",
    "Environments have unique CNAME domain names managed by Elastic Beanstalk.",
    "Can be configured as Single-Instance or Load-Balanced/Auto-Scaling.",
    "Multiple environments can run side-by-side within a single Elastic Beanstalk Application.",
    "Can be cloned, rebuilt, updated, or terminated independently."
  ],
  "commonMistake": "Running production workloads in a Single-Instance environment. Single-Instance environments have no load balancer, no Multi-AZ resilience, and assign an Elastic IP directly to a single EC2 instance; always use Load-Balanced environments for production.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Elastic Beanstalk Environment.\nResources:\n  ProductionEnvironment:\n    Type: AWS::ElasticBeanstalk::Environment\n    Properties:\n      ApplicationName: !Ref SampleApplication\n      EnvironmentName: Production-Web-Env\n      SolutionStackName: '64bit Amazon Linux 2023 v6.1.0 running Node.js 20'\n      OptionSettings:\n        - Namespace: aws:elasticbeanstalk:environment\n          OptionName: EnvironmentType\n          Value: LoadBalanced",
  "sources": [
    {
      "title": "Elastic Beanstalk Concepts: Environments",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts.environment"
    },
    {
      "title": "Managing Elastic Beanstalk Environments",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.environments.html"
    }
  ]
});
