import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-12",
  "title": "Amazon S3 Intelligent-Tiering",
  "plainEnglish": "Amazon S3 Intelligent-Tiering is an automated cloud storage class that dynamically optimizes storage costs by automatically moving objects between low-latency and archive access tiers based on changing access patterns. For a tiny monthly per-object automation fee, S3 Intelligent-Tiering monitors access frequency and moves objects that have not been accessed for 30 consecutive days to an Infrequent Access tier, and after 90 days to an Archive Instant Access tier—with zero retrieval fees and zero performance impact.",
  "whyItMatters": "Many data lakes, user-uploaded media repositories, and analytics datasets have unpredictable, irregular, or unknown access patterns. Manually writing and maintaining lifecycle rules risks either leaving data in expensive storage or paying unexpected retrieval penalties. S3 Intelligent-Tiering guarantees automatic cost savings without operational overhead, performance degradation, or data retrieval charges.",
  "workplaceExample": "A medical imaging company stores millions of patient MRI scans in S3. Some scans are analyzed daily during active treatment, while others are never accessed again unless a patient returns years later. The company configures S3 Intelligent-Tiering as the default storage class. Active scans stay in the Frequent Access tier; inactive scans automatically drop to Infrequent Access (40% savings) and Archive Instant Access (68% savings). When a doctor opens a 3-year-old scan, it loads with instant millisecond latency with zero retrieval fee.",
  "examFocus": "Understand S3 Intelligent-Tiering access tiers and billing rules: (1) Default Access Tiers (Automatic): Frequent Access (same price as S3 Standard), Infrequent Access (moves after 30 consecutive days of no access), and Archive Instant Access (moves after 90 days). All three deliver millisecond latency. (2) Optional Asynchronous Tiers: Archive Access (moves after 90–730 days; 3–5 hour restore) and Deep Archive Access (moves after 180–730 days; 12-hour restore). (3) Zero Retrieval Fees: NO data retrieval fees across any tier. (4) Small Objects: Objects smaller than 128 KB remain in Frequent Access tier with no monitoring fee.",
  "keyPoints": [
    "Automatically optimizes storage costs by moving objects between tiers based on actual access patterns.",
    "Three default automatic tiers with low-millisecond latency: Frequent, Infrequent (30d), and Archive Instant (90d).",
    "Two optional deep archive tiers for long-term retention: Archive Access (90d+) and Deep Archive Access (180d+).",
    "Zero data retrieval charges when data in any tier is accessed.",
    "Charges a tiny monthly monitoring and automation fee per 1,000 objects (objects < 128 KB exempt).",
    "Ideal for data with unknown, unpredictable, or rapidly shifting access patterns."
  ],
  "commonMistake": "Assuming that objects in S3 Intelligent-Tiering's Archive Instant Access tier require hours to restore like Glacier. Archive Instant Access delivers the exact same millisecond latency as S3 Standard; only the optional asynchronous Archive and Deep Archive tiers require restore workflows.",
  "example": "Upload an object to S3 Intelligent-Tiering using the AWS CLI: aws s3 cp dataset.parquet s3://my-datalake/dataset.parquet --storage-class INTELLIGENT_TIERING.",
  "sources": [
    {
      "title": "Amazon S3 Intelligent-Tiering Storage Class",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html"
    },
    {
      "title": "How S3 Intelligent-Tiering Works",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering-overview.html"
    }
  ]
});
