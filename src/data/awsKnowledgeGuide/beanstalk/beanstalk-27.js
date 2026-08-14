import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-27",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk with RDS",
  "status": "ready",
  "plainEnglish": "Elastic Beanstalk allows you to connect your web application to an Amazon Relational Database Service (Amazon RDS) instance. You can create an RDS database directly through Elastic Beanstalk (coupled architecture, suitable only for development or testing) or provision an independent RDS database outside Elastic Beanstalk (decoupled architecture, mandatory for production). The web tier connects to RDS through standard environment properties and security group rules.",
  "whyItMatters": "Databases hold critical customer and transaction records. Coupling an RDS database to an Elastic Beanstalk environment binds its lifecycle to the compute environment: if the environment is terminated, the database is deleted. Understanding how to integrate with an external decoupled RDS database is fundamental for building reliable production systems.",
  "workplaceExample": "A company provisions an Amazon RDS Multi-AZ MySQL instance using Terraform. In their Elastic Beanstalk environment, they configure security group ingress allowing port 3306 from the Beanstalk EC2 security group and provide the RDS endpoint via `RDS_HOSTNAME` environment properties.",
  "examFocus": "For SAA-C03, remember the strict best practice rule: internal coupled RDS instances are only for development/proof-of-concept; production environments must always use an external decoupled RDS instance. To migrate a coupled database to an external database: snapshot the internal RDS instance, restore it externally, enable deletion protection on the new DB, update Beanstalk environment properties, and redeploy.",
  "keyPoints": [
    "Coupled RDS instances are tied to the environment lifecycle and deleted when the environment terminates.",
    "Decoupled RDS instances exist independently and are the AWS best practice for production.",
    "Security groups must allow inbound database traffic from the Beanstalk EC2 security group.",
    "Database credentials should be supplied via Environment Properties or AWS Secrets Manager.",
    "Decoupled databases enable blue/green deployments and multi-environment architecture."
  ],
  "commonMistake": "Deploying a production web application with a coupled RDS database created inside the Beanstalk console, risking catastrophic data loss during an environment teardown. Always provision production databases outside Beanstalk.",
  "example": "OptionSettings:\n  - Namespace: aws:elasticbeanstalk:application:environment\n    OptionName: RDS_HOSTNAME\n    Value: 'production-db.c123456789.us-east-1.rds.amazonaws.com'\n  - Namespace: aws:elasticbeanstalk:application:environment\n    OptionName: RDS_PORT\n    Value: '3306'\n  - Namespace: aws:elasticbeanstalk:application:environment\n    OptionName: RDS_DB_NAME\n    Value: 'appdb'",
  "sources": [
    {
      "title": "Adding an Amazon RDS DB Instance to Your Environment",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.RDS.html"
    },
    {
      "title": "Decoupling an Amazon RDS DB Instance from Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.RDS.html#AWSHowTo.RDS.decouple"
    }
  ]
});
