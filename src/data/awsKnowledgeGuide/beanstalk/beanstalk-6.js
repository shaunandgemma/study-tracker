import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-6",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Applications",
  "status": "ready",
  "plainEnglish": "In AWS Elastic Beanstalk, an Application is the top-level logical container that groups together all related components of your software project. An Application contains multiple Application Versions (specific deployable zip bundles of your code) and multiple Environments (running AWS infrastructure instances, such as development, staging, and production).",
  "whyItMatters": "Structuring your project under an Application container allows you to track code release history, compare configurations across environments, enforce version lifecycle limits, and deploy identical code artifacts to different stages of your release pipeline.",
  "workplaceExample": "A company creates an Elastic Beanstalk Application named 'CustomerPortal'. Inside this application container, they manage 50 uploaded version zip files and maintain three distinct environments: 'CustomerPortal-Dev', 'CustomerPortal-QA', and 'CustomerPortal-Prod'.",
  "examFocus": "For SAA-C03, understand the hierarchy: Application (top-level container) > Application Versions (code artifacts stored in S3) + Saved Configurations > Environments (actual running EC2/ALB infrastructure). Know that an Application Version Lifecycle policy can be configured to automatically delete old versions and avoid hitting the 1,000 application version quota.",
  "keyPoints": [
    "An Application is the highest-level logical container in Elastic Beanstalk.",
    "Contains collections of Application Versions, Saved Configurations, and running Environments.",
    "Application versions point to source code bundles stored in Amazon S3.",
    "Supports Application Version Lifecycle policies to automatically purge old versions.",
    "A single application can run multiple independent environments simultaneously."
  ],
  "commonMistake": "Creating a completely new Elastic Beanstalk Application for every environment (e.g. creating App-Dev, App-Staging, App-Prod). Instead, create one Application and create multiple Environments within it to easily share and deploy the same application version artifacts.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Elastic Beanstalk Application container.\nResources:\n  SampleApplication:\n    Type: AWS::ElasticBeanstalk::Application\n    Properties:\n      ApplicationName: CustomerPortalApp\n      Description: Corporate customer portal web service",
  "sources": [
    {
      "title": "Elastic Beanstalk Concepts: Applications",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts.application"
    },
    {
      "title": "Application Version Lifecycle Settings",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-lifecycle.html"
    }
  ]
});
