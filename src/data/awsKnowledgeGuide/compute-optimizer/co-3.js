import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-3",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "Compute Optimizer Rightsizing Recommendations",
  "status": "ready",
  "plainEnglish": "Compute Optimizer Rightsizing Recommendations are specific, actionable configuration changes suggested for your over-provisioned or under-provisioned AWS resources. For each analyzed resource, Compute Optimizer generates up to three recommendation options ranked by projected savings and performance risk. Each recommendation details the recommended target instance type or configuration, expected monthly price change ($ USD or percentage), and projected resource utilization curves.",
  "whyItMatters": "Rightsizing is the most effective FinOps strategy for reducing AWS cloud waste. Instead of broad manual estimations, Compute Optimizer provides exact target options—including cross-instance family migrations (such as moving from Intel x86 to AWS Graviton ARM processors) and newer generation instance upgrades that deliver higher performance at lower price points.",
  "workplaceExample": "A software company evaluates Compute Optimizer recommendations for a batch-processing cluster. Option 1 recommends upgrading from c5.2xlarge (Intel) to c7g.2xlarge (AWS Graviton3), which projects a 22% monthly cost reduction and a 25% performance improvement with Very Low performance risk.",
  "examFocus": "For SAA-C03, know that Compute Optimizer provides up to 3 recommendation options per resource. Recommendations can suggest downsizing within the same instance family, switching to a different instance family (e.g. from general purpose M to compute-optimized C), or migrating from x86 to Graviton. Recommendations can be exported to Amazon S3 for organizational reporting.",
  "keyPoints": [
    "Generates up to 3 distinct recommendation options per evaluated resource.",
    "Details projected monthly cost difference ($ USD) and percentage savings.",
    "Recommends same-family downsizing, cross-family switching, and Graviton architecture upgrades.",
    "Assigns a Performance Risk score (Very Low, Low, Medium, High) to each option.",
    "Supports bulk export of all recommendations across an entire AWS Organization to Amazon S3."
  ],
  "commonMistake": "Blindly applying rightsizing recommendations to Graviton (ARM64) instance types without verifying that your application binaries, Docker containers, and third-party libraries are compiled for ARM architecture.",
  "example": "# Export Compute Optimizer recommendations to an S3 bucket for organizational analysis:\naws compute-optimizer export-ec2-instance-recommendations \\\n  --s3-destination-config bucket=my-finops-reports-bucket,keyPrefix=recommendations/ \\\n  --include-member-accounts \\\n  --file-format Csv",
  "sources": [
    {
      "title": "Viewing Recommendations in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ec2-recommendations.html"
    },
    {
      "title": "Exporting Recommendations to Amazon S3",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/exporting-recommendations.html"
    }
  ]
});
