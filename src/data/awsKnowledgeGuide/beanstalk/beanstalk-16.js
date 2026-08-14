import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-16",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Deployment Policies",
  "status": "ready",
  "plainEnglish": "Elastic Beanstalk Deployment Policies dictate how new application versions are deployed across the Amazon EC2 instances in your environment. Elastic Beanstalk provides several distinct deployment strategies: All at Once (fastest, but involves total downtime), Rolling (deploys in batches; reduces capacity during deployment), Rolling with Additional Batch (provisions extra instances first to maintain 100% capacity throughout), Immutable (provisions a temporary Auto Scaling group with new instances and cuts over cleanly), and Traffic Splitting (canary testing by routing a percentage of live traffic to the new version).",
  "whyItMatters": "Selecting the right deployment policy allows engineering teams to balance deployment speed, application availability, cost, and risk. For example, production systems can ensure zero downtime with Rolling with Additional Batch or Immutable deployments, while non-production environments can use fast All at Once deployments.",
  "workplaceExample": "A high-volume e-commerce company uses 'Rolling with Additional Batch' with a batch size of 25%. When a new version is deployed, Beanstalk launches 2 new instances first, deploys the code, verifies health, and then rolls through the remaining instances in batches without ever dipping below 100% serving capacity.",
  "examFocus": "For SAA-C03, know the trade-offs of all Beanstalk deployment policies: (1) All at Once: fast, downtime, lowest cost. (2) Rolling: no additional cost, but temporarily reduces capacity. (3) Rolling with Additional Batch: zero downtime, maintains full capacity, incurs temporary cost for extra batch instances. (4) Immutable: zero downtime, launches full new ASG, easiest rollback, higher temporary cost. (5) Traffic Splitting: canary testing with live traffic percentages.",
  "keyPoints": [
    "All at Once: Deploys to all instances simultaneously; causes downtime; fastest deployment.",
    "Rolling: Deploys in batches; takes instances out of service per batch; reduces total serving capacity.",
    "Rolling with Additional Batch: Launches a new batch first; maintains full serving capacity with zero downtime.",
    "Immutable: Creates a temporary ASG with new instances; zero downtime; safest rollback mechanism.",
    "Traffic Splitting: Routes a configurable percentage of live client traffic to new version for canary validation."
  ],
  "commonMistake": "Using the 'Rolling' policy on an environment that is already running at 100% capacity during peak hours. Taking instances offline in batches during the deployment can overload the remaining instances and cause cascading failures. Use 'Rolling with Additional Batch' or 'Immutable' instead.",
  "example": "OptionSettings:\n  - Namespace: aws:elasticbeanstalk:command\n    OptionName: DeploymentPolicy\n    Value: RollingWithAdditionalBatch\n  - Namespace: aws:elasticbeanstalk:command\n    OptionName: BatchSizeType\n    Value: Percentage\n  - Namespace: aws:elasticbeanstalk:command\n    OptionName: BatchSize\n    Value: '25'",
  "sources": [
    {
      "title": "Elastic Beanstalk Deployment Policies",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html"
    },
    {
      "title": "Deployment Strategy Comparison in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html#deployment-strategies"
    }
  ]
});
