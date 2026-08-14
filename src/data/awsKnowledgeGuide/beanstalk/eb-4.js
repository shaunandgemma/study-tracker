import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eb-4",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Decoupled External RDS Database Architecture Best Practices",
  "status": "ready",
  "plainEnglish": "In AWS Elastic Beanstalk, you can provision an Amazon RDS database directly as part of your environment (coupled architecture) or provision RDS independently outside Elastic Beanstalk and connect your application using environment variables and security groups (decoupled external architecture). For all production workloads, AWS strongly recommends decoupling your RDS database from Elastic Beanstalk.",
  "whyItMatters": "When an RDS instance is created directly inside an Elastic Beanstalk environment, its lifecycle is tied to the environment. If an administrator terminates or replaces the Beanstalk environment, the attached RDS database and all of its data are permanently deleted along with it. Decoupling the database ensures data persists independently of compute lifecycle changes.",
  "workplaceExample": "A startup initially used an internal RDS database inside Elastic Beanstalk for staging. When moving to production, the lead architect provisions an independent Amazon Aurora PostgreSQL cluster outside Beanstalk and passes the database endpoint, username, and password into Elastic Beanstalk via secure Environment Properties, allowing seamless Blue-Green deployments without risking database deletion.",
  "examFocus": "For SAA-C03, this is a very high-frequency exam concept: NEVER couple an Amazon RDS database directly to an Elastic Beanstalk environment in production. If you terminate a Beanstalk environment with an internal RDS instance, the database is deleted. To migrate an existing coupled database to an external database without data loss: take an RDS snapshot, restore the snapshot as an independent RDS database, update Beanstalk environment variables to point to the new RDS endpoint, and configure security group rules.",
  "keyPoints": [
    "Coupled databases (created inside Beanstalk) share the lifecycle of the environment and are deleted on termination.",
    "Decoupled external RDS databases exist independently and survive Beanstalk environment terminations.",
    "Decoupled databases enable seamless Blue-Green environment URL swaps without touching the database.",
    "Connect external databases by passing connection strings via Beanstalk Environment Properties.",
    "Migration strategy: Take a snapshot of the coupled RDS DB, restore it externally, and update connection settings."
  ],
  "commonMistake": "Creating a production RDS database inside an Elastic Beanstalk environment. When the environment is rebuilt or terminated, the database is deleted. Always provision production databases independently.",
  "example": "# Connect to decoupled external RDS via Environment Properties in .ebextensions:\noption_settings:\n  aws:elasticbeanstalk:application:environment:\n    DB_HOST: 'aurora-cluster.cluster-xyz.us-east-1.rds.amazonaws.com'\n    DB_PORT: '5432'\n    DB_NAME: 'production_db'",
  "sources": [
    {
      "title": "Using Elastic Beanstalk with Amazon RDS",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.RDS.html"
    },
    {
      "title": "Decoupling an Amazon RDS DB Instance from Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.RDS.html#AWSHowTo.RDS.decouple"
    }
  ]
});
