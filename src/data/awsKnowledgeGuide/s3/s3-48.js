import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-48",
  "title": "S3 Storage Lens",
  "plainEnglish": "Amazon S3 Storage Lens is a cloud storage analytics feature that provides organization-wide visibility into object storage usage, activity trends, and cost-optimization opportunities across your entire AWS Organization, specific AWS accounts, regions, or individual buckets. With interactive dashboards and 30+ actionable metrics, S3 Storage Lens surfaces cost-saving recommendations (such as finding incomplete multipart uploads or noncurrent versions) and security audit insights (such as detecting unencrypted buckets or open public access).",
  "whyItMatters": "Enterprise organizations running hundreds of AWS accounts and thousands of S3 buckets struggle to track where storage costs originate, which buckets lack lifecycle rules, and whether security compliance standards are met. S3 Storage Lens provides centralized, single-pane-of-glass storage governance with zero agent installation or custom reporting scripts.",
  "workplaceExample": "A Chief Technology Officer (CTO) reviews the corporate S3 Storage Lens default dashboard. Storage Lens immediately highlights that the organization is spending $12,000 monthly on incomplete multipart uploads that were never aborted across 80 developer accounts. The platform team applies organization-wide lifecycle rules to abort incomplete uploads, instantly eliminating the wasted spend.",
  "examFocus": "Understand S3 Storage Lens tiers and metrics: (1) Free Metrics: 28 free usage and cost metrics updated daily, available for 14 days of historical retention (covers storage bytes, object count, multipart upload bytes). (2) Advanced Metrics & Recommendations: Paid tier offering 35+ metrics, 15-month historical retention, prefix-level aggregation, CloudWatch publishing, and automated cost/security recommendations. (3) Organization-wide Scope: Can generate a unified dashboard across an entire AWS Organization.",
  "keyPoints": [
    "Organization-wide cloud storage analytics and centralized visibility dashboard.",
    "Provides 30+ metrics categorized into Cost Optimization, Data Protection, Access Management, and Performance.",
    "Default dashboard is free of charge and automatically enabled across all AWS accounts.",
    "Advanced metrics tier offers prefix-level aggregation, 15-month data retention, and CloudWatch metrics publishing.",
    "Surfaces automated recommendations to eliminate wasted storage and fix security misconfigurations.",
    "Integrates natively with AWS Organizations to analyze multi-account storage footprints."
  ],
  "commonMistake": "Building custom nightly scripts to call `ListObjectsV2` across thousands of buckets to calculate storage analytics. S3 Storage Lens provides built-in, organization-wide storage analytics out-of-the-box at zero cost without consuming API rate limits or compute power.",
  "example": "View the S3 Storage Lens default dashboard configuration using the AWS CLI: aws s3control get-storage-lens-configuration --account-id 123456789012 --config-id default-account-dashboard.",
  "sources": [
    {
      "title": "Assessing Your Storage Activity and Usage with S3 Storage Lens",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens.html"
    },
    {
      "title": "Amazon S3 Storage Lens Metrics Glossary",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage_lens_metrics.html"
    }
  ]
});
