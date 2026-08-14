import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-11",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Managed EC2 Infrastructure",
  "status": "ready",
  "plainEnglish": "Managed EC2 Infrastructure in Elastic Beanstalk means that while AWS automates the provisioning, patching, scaling, and health monitoring of your Amazon EC2 instances, you retain complete administrative ownership and access to those instances. Unlike serverless platforms where underlying compute is entirely abstracted, Beanstalk creates standard EC2 instances inside your own AWS account and VPC, allowing you to configure instance types, root volume storage, EC2 key pairs, and security groups.",
  "whyItMatters": "Many enterprise applications require platform automation but still demand access to underlying operating system settings, custom software agents (like Datadog or Splunk), or specific instance families (like GPU or high-memory instances). Managed EC2 gives you PaaS convenience without sacrificing IaaS flexibility.",
  "workplaceExample": "A devops team uses Elastic Beanstalk to deploy a Go microservice. They configure the environment to launch Graviton (t4g.medium) EC2 instances, attach an EC2 Key Pair for emergency SSH access, and assign an IAM Instance Profile granting access to AWS Secrets Manager.",
  "examFocus": "For SAA-C03, remember that Elastic Beanstalk provisions standard EC2 instances that you own and control. An IAM Instance Profile must be attached to the EC2 instances so they can communicate with Elastic Beanstalk, download application bundles from S3, and stream logs to CloudWatch. You can choose any supported EC2 instance type and AMI.",
  "keyPoints": [
    "Provisions real EC2 instances within your account's VPC subnets and security groups.",
    "Developers can SSH into instances, customize AMIs, and install custom OS packages.",
    "Requires an IAM Instance Profile (`aws-elasticbeanstalk-ec2-role`) attached to instances.",
    "Supports various instance families including general purpose, compute-optimized, and ARM/Graviton.",
    "Managed Platform Updates can automatically patch the OS without manual intervention."
  ],
  "commonMistake": "Forgetting to assign an IAM Instance Profile to the Elastic Beanstalk EC2 instances, causing the instances to fail to communicate with the Beanstalk service and preventing deployments from completing.",
  "example": "OptionSettings:\n  - Namespace: aws:autoscaling:launchconfiguration\n    OptionName: InstanceType\n    Value: t4g.medium\n  - Namespace: aws:autoscaling:launchconfiguration\n    OptionName: IamInstanceProfile\n    Value: aws-elasticbeanstalk-ec2-role\n  - Namespace: aws:autoscaling:launchconfiguration\n    OptionName: EC2KeyName\n    Value: my-prod-keypair",
  "sources": [
    {
      "title": "Configuring EC2 Instances in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.ec2.html"
    },
    {
      "title": "Service Roles, Instance Profiles, and User Policies",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/iam-roles.html"
    }
  ]
});
