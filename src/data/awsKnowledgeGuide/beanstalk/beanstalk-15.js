import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-15",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Environment Configuration",
  "status": "ready",
  "plainEnglish": "Elastic Beanstalk Environment Configuration defines the complete operational parameters and AWS resource settings for an environment. This includes compute settings (EC2 instance types, AMI ID), scaling thresholds (min/max instances, trigger metrics), networking (VPC subnets, public IP assignment), load balancer rules (health check path, SSL certificates), and application environment properties. Configurations can be defined via the AWS Console, AWS CLI, saved configuration templates, or `.ebextensions` configuration files.",
  "whyItMatters": "Environment configurations can be saved as Saved Configuration Templates. This allows teams to capture the entire infrastructure blueprint of a tested environment and replicate identical environments across other regions or accounts in minutes with zero manual clicking.",
  "workplaceExample": "A cloud engineering team saves the configuration of their staging environment as a template named 'Prod-Standard-V2'. When expanding their application to the Europe (Frankfurt) region, they launch a new environment using this saved template to ensure exact configuration parity.",
  "examFocus": "For SAA-C03, know how environment configuration precedence works: settings applied directly via the CLI or Console take highest precedence, followed by `.ebextensions` configuration files inside the source code, followed by default platform configuration settings. Understand that environment configurations can be saved, downloaded, and cloned across environments.",
  "keyPoints": [
    "Defines all compute, network, load balancing, scaling, and runtime parameters for an environment.",
    "Can be exported and saved as reusable Saved Configuration Templates.",
    "Order of precedence: Direct API/Console settings override `.ebextensions` configuration files.",
    "Supports fine-grained namespaces (e.g., `aws:autoscaling:launchconfiguration`, `aws:elasticbeanstalk:application:environment`).",
    "Enables environment cloning to spin up identical duplicate environments effortlessly."
  ],
  "commonMistake": "Modifying EC2 security groups or Auto Scaling parameters directly in the EC2 console instead of via Beanstalk environment configuration. Direct out-of-band changes can be overwritten the next time Elastic Beanstalk updates or rebuilds the environment.",
  "example": "OptionSettings:\n  - Namespace: aws:elasticbeanstalk:command\n    OptionName: Timeout\n    Value: '600'\n  - Namespace: aws:autoscaling:updatepolicy:rollingupdate\n    OptionName: RollingUpdateEnabled\n    Value: 'true'",
  "sources": [
    {
      "title": "Configuring Elastic Beanstalk Environments",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.environmentsettings.html"
    },
    {
      "title": "Saved Configurations in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environment-configuration-savedconfig.html"
    }
  ]
});
