import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-15",
  "title": "Provisioned Stream Capacity Mode",
  "plainEnglish": "Provisioned Stream Capacity Mode in Amazon Kinesis Data Streams is the capacity model where you explicitly define and allocate the exact number of shards required for your data stream. Each shard provides dedicated throughput of 1 MB/second or 1,000 records/second for writing, and 2 MB/second for reading. You are billed at a predictable hourly rate per active shard.",
  "whyItMatters": "For predictable, steady-state high-volume streaming workloads, Provisioned capacity mode provides the lowest total cost of ownership. By sizing the stream to match expected baseline throughput and using scaling scripts or Application Auto Scaling, organizations achieve guaranteed throughput reservations at significantly lower per-gigabyte costs than On-Demand mode.",
  "workplaceExample": "A national retail bank processes ATM and credit card transactions through a Kinesis data stream. The baseline traffic is steady at 25 MB/sec (25,000 records/sec) 24 hours a day. The platform engineering team provisions 30 shards, maintaining dedicated, predictable capacity with continuous CloudWatch monitoring at a 40% cost reduction compared to on-demand pricing.",
  "examFocus": "Understand Provisioned mode architecture and scaling: (1) Total stream capacity = Number of Shards * Shard Capacity (1 MB/s write, 2 MB/s read). (2) Resharding: Scale up by Splitting shards; scale down by Merging shards. (3) Billed per shard-hour, regardless of whether data is written or read. (4) Best choice for steady, predictable, or high-volume continuous streaming workloads.",
  "keyPoints": [
    "You explicitly allocate and manage the number of shards comprising the data stream.",
    "Each provisioned shard guarantees 1 MB/sec or 1,000 records/sec write throughput and 2 MB/sec read throughput.",
    "Billed per active shard-hour plus optional extended retention charges.",
    "Supports dynamic resharding (UpdateShardCount, SplitShard, MergeShards) without downtime.",
    "Can be paired with AWS Lambda and CloudWatch Alarms to build custom automated resharding workflows.",
    "Most cost-effective capacity option for workloads with predictable, consistent, and continuous traffic profiles."
  ],
  "commonMistake": "Failing to monitor shard utilization and leaving a stream under-provisioned during unexpected traffic spikes. If write throughput exceeds 1 MB/s or 1,000 records/s on any shard, requests will fail with a ProvisionedThroughputExceededException.",
  "example": "Update the shard count of a provisioned Kinesis data stream from 10 to 20 shards using the AWS CLI: aws kinesis update-shard-count --stream-name transaction-stream --target-shard-count 20 --scaling-type UNIFORM_SCALING.",
  "sources": [
    {
      "title": "Provisioned Capacity Mode in Amazon Kinesis Data Streams",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/how-do-i-size-a-stream.html#provisioned-capacity-mode"
    },
    {
      "title": "Resharding, Scaling, and Monitoring in Amazon Kinesis",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/kinesis-using-sdk-java-resharding.html"
    }
  ]
});
