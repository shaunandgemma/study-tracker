import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-20",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Immutable Deployment",
  "status": "ready",
  "plainEnglish": "An Immutable Deployment is a deployment strategy in Elastic Beanstalk that performs application updates by launching a full set of brand-new Amazon EC2 instances in a temporary Auto Scaling group alongside your existing instances. It first launches a single new instance to test the new version's health. Once that instance passes health checks, Beanstalk launches the rest of the new instances to match the existing capacity, moves them into the main Auto Scaling group behind the load balancer, and cleanly terminates all old instances.",
  "whyItMatters": "In-place deployments risk leaving instances in a broken or partially updated state if deployment scripts fail midway through execution. Immutable deployments ensure pristine, untouched server environments with zero configuration drift and provide the fastest, safest rollback: if any new instance fails its health check, Beanstalk simply terminates the new instances, leaving the original production fleet 100% untouched.",
  "workplaceExample": "A banking application requires zero-risk deployments for financial transaction APIs. They configure Immutable Deployments in Elastic Beanstalk. During a release, if a database migration script fails during the single test instance validation, Beanstalk halts the deployment and terminates the test instance immediately without disturbing live users.",
  "examFocus": "For SAA-C03, choose Immutable Deployment when the scenario asks for: (1) Zero downtime deployments, (2) Guaranteed 100% capacity maintained throughout deployment, (3) Safe, immediate automated rollback if health checks fail, and (4) Preventing configuration drift on running instances. Note that it doubles EC2 instance count temporarily during deployment.",
  "keyPoints": [
    "Launches a temporary Auto Scaling group with completely new EC2 instances.",
    "Performs initial health check on a single canary instance before launching the rest.",
    "Maintains 100% serving capacity throughout the entire deployment process with zero downtime.",
    "Safest rollback mechanism: if health checks fail, temporary instances are terminated immediately.",
    "Requires sufficient EC2 instance limits / IP addresses in the VPC to support double capacity temporarily."
  ],
  "commonMistake": "Attempting an Immutable Deployment in an AWS account with strict EC2 vCPU quotas or a nearly exhausted VPC subnet IP range. Because immutable deployments temporarily double instance counts, ensure sufficient vCPU quota and available subnet IPs are present.",
  "example": "OptionSettings:\n  - Namespace: aws:elasticbeanstalk:command\n    OptionName: DeploymentPolicy\n    Value: Immutable\n  - Namespace: aws:elasticbeanstalk:command\n    OptionName: Timeout\n    Value: '600'",
  "sources": [
    {
      "title": "Immutable Environment Updates in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environmentmgmt-updates-imm.html"
    },
    {
      "title": "Elastic Beanstalk Deployment Policies",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html"
    }
  ]
});
