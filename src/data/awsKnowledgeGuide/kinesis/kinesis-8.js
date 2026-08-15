import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-8",
  "title": "Shard Capacity",
  "plainEnglish": "Shard Capacity in Amazon Kinesis Data Streams defines the exact throughput boundaries for data ingress (writing) and data egress (reading) supported by each individual shard in a stream. Each shard provides up to 1 MB/second or 1,000 records/second for writing, and 2 MB/second for shared reading. Exceeding these limits triggers throughput throttling errors.",
  "whyItMatters": "Sizing shard capacity accurately prevents application errors and unnecessary cloud costs. If your ingestion rate exceeds a shard's capacity, Kinesis rejects incoming records with a ProvisionedThroughputExceededException. Understanding shard capacity allows engineers to calculate the exact number of shards required based on peak record sizes and arrival rates.",
  "workplaceExample": "A streaming video service ingests user analytics events averaging 2 KB per record at a peak rate of 4,500 records per second. Total write throughput is 9 MB/second (4,500 records/s * 2 KB). Because each shard supports 1 MB/s and 1,000 records/s, the team provisions 9 shards for bandwidth and 5 shards for record count, settling on 10 shards to comfortably handle peak volume.",
  "examFocus": "Know how to calculate shard requirements for exam questions: (1) Ingestion shards = max(Total Write MB/sec / 1 MB/sec, Total Write Records/sec / 1,000 records/sec). (2) Standard Read shards = Total Read MB/sec / 2 MB/sec. Monitor WriteProvisionedThroughputExceeded and ReadProvisionedThroughputExceeded metrics in CloudWatch.",
  "keyPoints": [
    "Write capacity per shard: 1 MB/sec or 1,000 records/sec (whichever threshold is crossed first).",
    "Standard Read capacity per shard: 2 MB/sec shared across all standard consumers via GetRecords.",
    "Enhanced Fan-Out provides dedicated 2 MB/sec per shard per registered consumer over HTTP/2 push.",
    "Exceeding capacity returns a 'ProvisionedThroughputExceededException' (HTTP 400) error to the caller.",
    "Producers should implement exponential backoff retries and batching (PutRecords or KPL) to handle transient throttling.",
    "CloudWatch metrics 'IncomingBytes', 'IncomingRecords', and 'WriteProvisionedThroughputExceeded' help identify hot shards."
  ],
  "commonMistake": "Calculating shard capacity based solely on megabytes per second while ignoring the 1,000 records per second limit. Sending 2,000 records/sec of 100 bytes each (only 200 KB/sec) will still throttle a single shard because the record rate limit is exceeded.",
  "example": "Calculate shard count: for 3.2 MB/s write throughput at 2,500 records/s, calculate shards_by_bytes = ceil(3.2 / 1) = 4, shards_by_records = ceil(2500 / 1000) = 3; total provisioned shards required = max(4, 3) = 4 shards.",
  "sources": [
    {
      "title": "Amazon Kinesis Data Streams Key Concepts - Shard Capacity",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html#what-is-a-shard"
    },
    {
      "title": "Monitoring Amazon Kinesis Data Streams with CloudWatch",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html"
    }
  ]
});
