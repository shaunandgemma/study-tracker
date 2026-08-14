import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-14",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Application Versions",
  "status": "ready",
  "plainEnglish": "An Application Version is an iteration of deployable code for your web application. When you upload a zip or war file containing your source code (or point to a Docker image), Elastic Beanstalk creates an Application Version object and stores the source bundle artifact in a managed Amazon S3 bucket. You can deploy this specific application version to one or more environments, re-deploy earlier versions for rollbacks, and manage version lifecycle policies.",
  "whyItMatters": "Versioned artifacts enable reliable CI/CD release pipelines and instant rollback capabilities. If a new release contains a critical software bug, you can re-deploy a previously working application version in seconds without recompiling or rebuilding source code.",
  "workplaceExample": "A continuous deployment pipeline builds a new application zip package on every Git commit to `main`, uploads it as version `v2.4.1` in Elastic Beanstalk, and deploys it to the Staging environment for automated integration tests before promoting it to Production.",
  "examFocus": "For SAA-C03, know that application versions are stored in Amazon S3. Elastic Beanstalk has a default quota of 1,000 application versions per account per Region. To prevent deployments from failing due to reaching the version limit, configure an Application Version Lifecycle Policy to delete old versions automatically based on total count or age.",
  "keyPoints": [
    "An Application Version represents a specific build artifact (zip, war, Docker image) stored in S3.",
    "Enables immediate rollbacks to previously working versions with zero code rebuilding.",
    "Can be deployed across multiple environments (e.g. dev, test, staging, prod) simultaneously.",
    "Elastic Beanstalk enforces a quota of 1,000 application versions per account.",
    "Application Version Lifecycle policies automatically delete older versions by age or total count."
  ],
  "commonMistake": "Failing to enable Application Version Lifecycle policies in active CI/CD pipelines, causing the AWS account to eventually hit the 1,000 application version limit and blocking all subsequent automated deployments.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Elastic Beanstalk Application Version.\nResources:\n  AppVersionV1:\n    Type: AWS::ElasticBeanstalk::ApplicationVersion\n    Properties:\n      ApplicationName: !Ref SampleApplication\n      Description: Version 1.0.0 Production Release\n      SourceBundle:\n        S3Bucket: !Sub 'elasticbeanstalk-${AWS::Region}-${AWS::AccountId}'\n        S3Key: app-releases/v1.0.0.zip",
  "sources": [
    {
      "title": "Application Versions in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts.version"
    },
    {
      "title": "Configuring Application Version Lifecycle Settings",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-lifecycle.html"
    }
  ]
});
