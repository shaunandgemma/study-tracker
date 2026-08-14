import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-28",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk vs CloudFormation",
  "status": "ready",
  "plainEnglish": "AWS Elastic Beanstalk and AWS CloudFormation are both deployment automation services on AWS, but they operate at different levels of abstraction. Elastic Beanstalk is an application-centric Platform as a Service (PaaS) designed to get web applications up and running with minimal infrastructure setup. AWS CloudFormation is a comprehensive Infrastructure as Code (IaC) service that provisions and manages any AWS resource using declarative YAML/JSON templates. In fact, Elastic Beanstalk uses CloudFormation behind the scenes to provision all of its underlying EC2 instances, load balancers, and auto scaling groups.",
  "whyItMatters": "Developers who just want to deploy their code without writing hundreds of lines of infrastructure templates benefit from Elastic Beanstalk's opinionated PaaS. Cloud architects who need to manage complete enterprise infrastructure (VPCs, transit gateways, KMS keys, custom security architectures) require CloudFormation's granular control.",
  "workplaceExample": "An engineering department uses CloudFormation to build their foundational VPC networks, IAM security roles, and shared Aurora database clusters. They use Elastic Beanstalk for individual application engineering teams to rapidly deploy and scale their Node.js and Python microservices within those provisioned VPC subnets.",
  "examFocus": "For SAA-C03, compare the two services: Elastic Beanstalk is application-centric, handles application deployment lifecycle, health monitoring, and scaling with minimal configuration. CloudFormation is infrastructure-centric, models any AWS resource, manages complex inter-resource dependencies, and supports drift detection. You can provision an Elastic Beanstalk application/environment inside a CloudFormation template using `AWS::ElasticBeanstalk::Application` and `AWS::ElasticBeanstalk::Environment`.",
  "keyPoints": [
    "Elastic Beanstalk is application-centric (PaaS); CloudFormation is infrastructure-centric (IaC).",
    "Elastic Beanstalk uses CloudFormation under the hood to provision environment resources.",
    "CloudFormation can manage any AWS resource; Beanstalk focuses specifically on web and worker applications.",
    "CloudFormation provides granular template control over complex networking, security, and storage.",
    "Elastic Beanstalk applications and environments can be defined and managed inside CloudFormation templates."
  ],
  "commonMistake": "Thinking Elastic Beanstalk and CloudFormation are mutually exclusive competitors. In enterprise architectures, CloudFormation often provisions the base network and Elastic Beanstalk environments, combining the power of IaC governance with PaaS developer productivity.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: CloudFormation template provisioning an Elastic Beanstalk application and environment.\nResources:\n  MyEBApp:\n    Type: AWS::ElasticBeanstalk::Application\n    Properties:\n      ApplicationName: InfrastructureManagedApp\n  MyEBEnv:\n    Type: AWS::ElasticBeanstalk::Environment\n    Properties:\n      ApplicationName: !Ref MyEBApp\n      EnvironmentName: ProductionEnv\n      SolutionStackName: '64bit Amazon Linux 2023 v6.1.0 running Python 3.11'",
  "sources": [
    {
      "title": "AWS Elastic Beanstalk CloudFormation Resource Types",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_ElasticBeanstalk.html"
    },
    {
      "title": "Using CloudFormation to Create Elastic Beanstalk Resources",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.CloudFormation.html"
    }
  ]
});
