import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-22",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Blue-Green Deployment using Environment Swap",
  "status": "ready",
  "plainEnglish": "Blue-Green Deployment using Environment URL Swap (CNAME Swap) is an architectural deployment technique where you deploy a new application version to a brand-new, independent Elastic Beanstalk environment (Green) while the current environment (Blue) continues serving live production traffic. Once the Green environment is fully tested and verified, you perform a 'Swap Environment URLs' operation in Elastic Beanstalk, which seamlessly swaps the DNS CNAME records between the two environments with zero downtime.",
  "whyItMatters": "Environment URL swaps provide an ultra-safe release mechanism. The new version runs in complete isolation on independent infrastructure, allowing extensive smoke testing and load testing before any real customer reaches it. If an issue is discovered after the swap, you simply swap the URLs back immediately for instant rollback.",
  "workplaceExample": "A retail application runs in 'Store-Blue' at `store.example.com` (pointing to `store-blue.elasticbeanstalk.com`). The team launches 'Store-Green' with a major framework upgrade and verifies all pages. They trigger a CNAME swap: `store.example.com` now instantly routes traffic to 'Store-Green', while 'Store-Blue' remains running in standby for 2 hours as a rollback safety net.",
  "examFocus": "For SAA-C03, Blue-Green deployment with CNAME Swap is the standard pattern for zero-downtime releases and major platform/runtime upgrades (e.g. upgrading from Node.js 18 to Node.js 20). Remember that this requires decoupled databases (external RDS); if an RDS database was coupled inside the Blue environment, swapping environments or terminating the old environment would lose the database.",
  "keyPoints": [
    "Deploys the new application version to a separate, isolated Green environment.",
    "Performs seamless cutover by swapping DNS CNAME records between Blue and Green environments.",
    "Delivers zero downtime and avoids in-place deployment complexity.",
    "Provides instantaneous rollback by simply swapping the environment URLs back.",
    "Requires external decoupled databases (Amazon RDS) to ensure data is shared across both environments."
  ],
  "commonMistake": "Attempting a Blue-Green CNAME swap when the Amazon RDS database was provisioned inside the Beanstalk environment. Swapping URLs leaves the Green environment pointing to its own empty internal database. Always decouple RDS externally before using Blue-Green deployments.",
  "example": "# Swap environment CNAMEs using the AWS CLI:\naws elasticbeanstalk swap-environment-cnames \\\n  --source-environment-name Store-Blue \\\n  --destination-environment-name Store-Green",
  "sources": [
    {
      "title": "Blue/Green Deployments with Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.CNAMESwap.html"
    },
    {
      "title": "Swapping Environment CNAMEs",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.CNAMESwap.html#using-features.CNAMESwap.howto"
    }
  ]
});
