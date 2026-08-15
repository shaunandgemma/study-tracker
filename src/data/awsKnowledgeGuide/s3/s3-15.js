import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-15",
  "title": "Amazon S3 Glacier Instant Retrieval",
  "plainEnglish": "Amazon S3 Glacier Instant Retrieval is an archive storage class that delivers the lowest storage cost for rarely accessed data that still requires immediate, low-millisecond retrieval speeds when accessed. Ideal for data accessed once or twice a year (such as medical imaging records, news media archives, or law enforcement video footage), S3 Glacier Instant Retrieval provides up to 68% storage cost savings compared to S3 Standard-IA while eliminating the multi-hour wait times of traditional archive storage.",
  "whyItMatters": "Traditional cold archive tiers require submitting asynchronous restore requests and waiting hours before objects can be downloaded. S3 Glacier Instant Retrieval eliminates this retrieval delay entirely, allowing real-time applications and emergency queries to read archived files instantly at low millisecond latency while enjoying extreme archive-level per-gigabyte pricing.",
  "workplaceExample": "A national broadcasting network archives 50 petabytes of past news broadcasts and raw documentary footage. Journalists rarely need historical clips, but when breaking news occurs, they must retrieve and stream archival footage within seconds. By transitioning footage to S3 Glacier Instant Retrieval, the broadcaster saves 68% on monthly storage costs compared to S3 Standard-IA while allowing editors to stream any historical clip instantly.",
  "examFocus": "Understand S3 Glacier Instant Retrieval rules and tradeoffs: (1) Retrieval Speed: Immediate, low-millisecond access (no `RestoreObject` API call needed). (2) Durability: 11 9s across >= 3 Availability Zones. (3) Minimum Storage Duration: 90 days. (4) Minimum Billable Size: 128 KB. (5) Retrieval Pricing: Higher per-GB retrieval fees than Standard-IA, making it cost-effective ONLY for data accessed less than once a quarter.",
  "keyPoints": [
    "Archive storage class offering low-millisecond retrieval latency for rarely accessed data.",
    "Delivers up to 68% storage cost savings compared to S3 Standard-IA.",
    "Requires no restore requests; objects are read immediately via standard S3 GET requests.",
    "Redundantly stored across at least 3 Availability Zones with 11 9s durability.",
    "Enforces a minimum storage duration of 90 days and a 128 KB minimum billable object size.",
    "Charges higher per-GB retrieval fees than Standard-IA, optimized for 1–2 accesses per year."
  ],
  "commonMistake": "Using S3 Glacier Instant Retrieval for data that is accessed monthly. If data is retrieved frequently, the higher per-GB data retrieval fees will quickly exceed the monthly storage savings; use S3 Standard-IA or S3 Intelligent-Tiering instead.",
  "example": "Configure a lifecycle transition rule in JSON to move raw video footage to Glacier Instant Retrieval after 90 days: {\"Rules\": [{\"ID\": \"ArchiveVideoFootage\", \"Status\": \"Enabled\", \"Filter\": {\"Prefix\": \"raw-footage/\"}, \"Transitions\": [{\"Days\": 90, \"StorageClass\": \"GLACIER_IR\"}]}]}.",
  "sources": [
    {
      "title": "Amazon S3 Glacier Instant Retrieval Storage Class",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html#sc-glacier-instant"
    },
    {
      "title": "General Considerations for Lifecycle Transitions in S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html"
    }
  ]
});
