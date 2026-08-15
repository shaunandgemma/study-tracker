import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-14",
  "title": "Amazon S3 One Zone-Infrequent Access - One Zone-IA",
  "plainEnglish": "Amazon S3 One Zone-Infrequent Access (One Zone-IA) is a lower-cost storage class designed for infrequently accessed data that does not require the physical multi-Availability Zone redundancy of S3 Standard or Standard-IA. Unlike other S3 storage classes that store data across at least three Availability Zones, S3 One Zone-IA stores data within a single Availability Zone, delivering 20% lower monthly storage costs than Standard-IA with the caveat that data will be lost if that specific Availability Zone is physically destroyed.",
  "whyItMatters": "Storing secondary copies of on-premises backups, reproducible image thumbnails, or transformed analytics datasets in multi-AZ storage incurs unnecessary cloud spend. S3 One Zone-IA provides a low-cost, millisecond-retrieval storage option for non-critical, easily reproducible data where single-AZ resilience is acceptable.",
  "workplaceExample": "A digital photography platform generates multiple resolution thumbnails (200x200, 800x800) for every user upload. The original high-resolution master images are stored in multi-AZ S3 Standard, while the generated thumbnails are stored in S3 One Zone-IA. By storing thumbnails in One Zone-IA, the company saves 20% on storage; if that single AZ were ever impaired, the thumbnail generation Lambda function could simply regenerate the missing thumbnails from the S3 Standard master copies.",
  "examFocus": "Understand S3 One Zone-IA tradeoffs and characteristics: (1) Durability: 11 9s (99.999999999%) within a SINGLE Availability Zone (NOT resilient to the physical loss of an entire AZ). (2) Availability SLA: 99.5% (designed for 99.5%). (3) Pricing: 20% cheaper storage per GB than Standard-IA, plus per-GB retrieval fees. (4) Minimums: 30-day minimum storage duration and 128 KB minimum billable object size. (5) Best for: Reproducible data, secondary backups, or data already replicated cross-region.",
  "keyPoints": [
    "Stores data redundantly within a single Availability Zone rather than across multiple AZs.",
    "Costs 20% less per GB-month than S3 Standard-Infrequent Access (Standard-IA).",
    "Provides 11 9s durability within the single AZ, but data is NOT protected against complete AZ loss.",
    "Delivers rapid, low-millisecond retrieval latency for infrequent read requests.",
    "Subject to a 30-day minimum storage duration and a 128 KB minimum billable object size.",
    "Ideal for reproducible data, secondary backup copies, and media transcoding caches."
  ],
  "commonMistake": "Storing primary, irreplaceable enterprise compliance records or sole backup copies in S3 One Zone-IA. Because data resides in only one Availability Zone, an earthquake, fire, or catastrophic disaster destroying that AZ will result in permanent data loss.",
  "example": "Upload a reproducible image thumbnail cache to S3 One Zone-IA using the AWS CLI: aws s3 cp thumbnail.jpg s3://media-thumbnails/thumbnail.jpg --storage-class ONEZONE_IA.",
  "sources": [
    {
      "title": "Amazon S3 One Zone-IA Storage Class",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html#sc-onezone-ia"
    },
    {
      "title": "General Considerations for Lifecycle Transitions in S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html"
    }
  ]
});
