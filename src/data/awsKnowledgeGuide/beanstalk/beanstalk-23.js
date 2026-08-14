import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-23",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Elastic Beanstalk Environment Variables",
  "status": "ready",
  "plainEnglish": "Elastic Beanstalk Environment Variables (also known as Environment Properties) are key-value configuration pairs passed into the operating system and runtime of your EC2 instances. Your application code reads these variables at runtime (e.g. `process.env.DB_HOST` in Node.js or `os.environ.get('DB_HOST')` in Python) to access dynamic settings, feature flags, API endpoints, and database connection strings without hardcoding configuration into source code.",
  "whyItMatters": "Hardcoding configuration and secrets inside source code violates 12-Factor App methodology, creates security risks, and prevents deploying the same code package across multiple environments. Environment variables allow you to change database connections and behavior per environment without modifying application code.",
  "workplaceExample": "A developer writes a microservice that reads `DATABASE_URL` and `PAYMENT_GATEWAY_URL` from the environment. In the development Beanstalk environment, these point to mock sandbox endpoints; in the production Beanstalk environment, they point to live production endpoints.",
  "examFocus": "For SAA-C03, know that environment variables are passed to Elastic Beanstalk via the `aws:elasticbeanstalk:application:environment` namespace in `.ebextensions` or configured via the AWS Console/CLI. For highly sensitive secrets (like database passwords or API keys), use AWS Systems Manager Parameter Store or AWS Secrets Manager and retrieve them securely in your application using IAM roles.",
  "keyPoints": [
    "Passes dynamic configuration key-value pairs to application processes at runtime.",
    "Configured via the `aws:elasticbeanstalk:application:environment` namespace or console.",
    "Follows 12-Factor App design principles by keeping code strictly separated from configuration.",
    "Can be updated dynamically without re-uploading the application source code bundle.",
    "Sensitive secrets should be stored in AWS Secrets Manager / Parameter Store and fetched via IAM."
  ],
  "commonMistake": "Committing sensitive plaintext production database passwords directly into `.ebextensions` config files in Git. Instead, store secrets in AWS Secrets Manager or SSM Parameter Store and reference them securely.",
  "example": "# Defining Environment Properties in .ebextensions:\noption_settings:\n  aws:elasticbeanstalk:application:environment:\n    NODE_ENV: production\n    API_ENDPOINT: 'https://api.example.com'\n    CACHE_TTL_SECONDS: '3600'",
  "sources": [
    {
      "title": "Environment Properties and Other Software Settings",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-envproperties.html"
    },
    {
      "title": "Configuring Environment Variables with .ebextensions",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/ebextensions-optionsettings.html"
    }
  ]
});
