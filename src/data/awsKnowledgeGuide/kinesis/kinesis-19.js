import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-19",
  "title": "Data Firehose Buffering",
  "plainEnglish": "Buffering in Amazon Data Firehose is the mechanism that controls how incoming streaming records are temporarily staged in memory before being delivered to target destinations. Buffering is governed by two user-configurable thresholds: Buffer Size (ranging from 1 MB to 128 MB) and Buffer Interval (ranging from 60 seconds to 900 seconds). Firehose flushes data to the destination as soon as either condition is met first.",
  "whyItMatters": "Tuning buffer settings allows system architects to balance delivery freshness against cost and downstream performance. A short buffer interval (e.g., 60 seconds) minimizes data latency for near-real-time dashboards. A larger buffer size (e.g., 128 MB) optimizes file sizes for columnar formats like Apache Parquet, reducing Amazon Athena scan costs and Amazon S3 PUT request fees.",
  "workplaceExample": "A data engineering team configures an S3 delivery stream with a Buffer Size of 128 MB and a Buffer Interval of 300 seconds. During peak daytime traffic (50 MB/min), the 128 MB size threshold is reached every ~2.5 minutes, triggering an S3 upload. During quiet nighttime hours (2 MB/min), the 300-second time threshold triggers a flush every 5 minutes, ensuring files are delivered regularly regardless of volume.",
  "examFocus": "Remember the fundamental buffering rule for Firehose: Data is delivered whenever the Buffer Size threshold OR the Buffer Interval threshold is reached first. Standard buffer size limits are 1 MB to 128 MB for Amazon S3, and buffer intervals range from 60 to 900 seconds. For specific destination types like Amazon OpenSearch, buffer intervals can be tuned down to lower intervals.",
  "keyPoints": [
    "Buffering is controlled by two parameters: Buffer Size (1–128 MB) and Buffer Interval (60–900 seconds).",
    "Data delivery occurs as soon as either threshold is crossed first (whichever condition is met earlier).",
    "Larger buffer sizes generate larger S3 files, which optimizes query performance and reduces cost in Amazon Athena.",
    "Shorter buffer intervals reduce latency between data creation and destination availability.",
    "If incoming data stops flowing, Firehose flushes any buffered data as soon as the buffer interval expires.",
    "Buffer settings can be modified dynamically on active delivery streams without downtime."
  ],
  "commonMistake": "Assuming that setting Buffer Size to 128 MB guarantees that every single S3 file will be exactly 128 MB. If the Buffer Interval (e.g., 300 seconds) expires before 128 MB of data is accumulated, Firehose flushes whatever data is currently in the buffer, resulting in smaller files.",
  "example": "Update buffering hints on an existing Firehose delivery stream using the AWS CLI: aws firehose update-destination --delivery-stream-name app-metrics --current-delivery-stream-version-id 1 --destination-id destinationId-000000000001 --extended-s3-destination-update '{\"BufferingHints\":{\"IntervalInSeconds\":300,\"SizeInMBs\":64}}'.",
  "sources": [
    {
      "title": "Amazon Data Firehose Buffering Process",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html#buffer-hints"
    },
    {
      "title": "Configuring Buffering Hints for Amazon S3 Destinations",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/create-destination.html"
    }
  ]
});
