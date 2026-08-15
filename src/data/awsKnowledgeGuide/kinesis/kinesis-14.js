import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-14",
  "title": "On-Demand Stream Capacity Mode",
  "plainEnglish": "On-Demand Capacity Mode in Amazon Kinesis Data Streams provides a fully serverless, pay-per-throughput streaming capacity model where you do not provision or manage shards. Kinesis automatically scales write and read throughput up and down in response to incoming traffic volumes, scaling up to double the previous peak write throughput observed in the prior 30 days without throttling.",
  "whyItMatters": "Estimating shard capacity for new applications or managing manual shard splitting/merging during unexpected traffic spikes creates operational friction and risks data throttling. On-Demand mode eliminates capacity planning, shard management, and scaling scripts, charging strictly for the volume of data ingested and retrieved.",
  "workplaceExample": "A digital media publisher runs news alert notifications that generate unpredictable 10x traffic surges whenever breaking news occurs. By setting their Kinesis data stream to On-Demand capacity mode, the stream automatically absorbs surges up to 100 MB/sec without dropping records or requiring on-call engineers to manually add shards.",
  "examFocus": "Understand On-Demand mode behavior: (1) Default write throughput limit is up to 200 MB/sec and 200,000 records/sec; default read limit is 400 MB/sec. (2) Accommodates traffic up to 2x the previous 30-day peak throughput instantly. (3) Billed based on stream-hours plus per-GB data ingested and retrieved. (4) You can switch a stream between On-Demand and Provisioned mode up to twice a day.",
  "keyPoints": [
    "Fully serverless capacity management that eliminates manual shard provisioning, monitoring, and resharding.",
    "Automatically scales to accommodate traffic surges up to double the previous peak throughput observed in the prior 30 days.",
    "Supports default baseline limits of up to 200 MB/sec write (200,000 records/sec) and 400 MB/sec read.",
    "Billed per stream-hour plus the gigabytes of data ingested and data retrieved from the stream.",
    "Ideal for applications with variable, spiky, or unpredictable streaming traffic patterns.",
    "Can be toggled between Provisioned and On-Demand capacity modes up to twice per 24-hour period."
  ],
  "commonMistake": "Using On-Demand mode for high-volume, highly predictable, steady-state streaming workloads. For steady, non-fluctuating traffic with high capacity utilization, Provisioned capacity mode is more cost-effective.",
  "example": "Update an existing Provisioned Kinesis stream to On-Demand capacity mode using the AWS CLI: aws kinesis update-stream-mode --stream-arn arn:aws:kinesis:us-east-1:123456789012:stream/breaking-news-stream --stream-mode-details StreamMode=ON_DEMAND.",
  "sources": [
    {
      "title": "On-Demand Capacity Mode in Amazon Kinesis Data Streams",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/how-do-i-size-a-stream.html#on-demand-capacity-mode"
    },
    {
      "title": "Changing the Stream Capacity Mode",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/how-do-i-size-a-stream.html"
    }
  ]
});
