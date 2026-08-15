import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-12",
  "title": "Enhanced Fan-Out",
  "plainEnglish": "Enhanced Fan-Out (EFO) is a feature in Amazon Kinesis Data Streams that provides dedicated read throughput of 2 MB/second per shard for each registered consumer application. Instead of multiple consumers competing for and sharing a single 2 MB/sec read pipe via standard polling, Enhanced Fan-Out uses an HTTP/2 push connection (SubscribeToShard) to deliver records directly to consumers with latency under 70 milliseconds.",
  "whyItMatters": "In standard consumer architectures, adding multiple downstream reader applications (e.g., 5 distinct analytics services) divides the shard's 2 MB/sec read limit among all 5 consumers, causing ReadProvisionedThroughputExceeded errors. Enhanced Fan-Out provides isolated, dedicated bandwidth to up to 20 registered consumers per stream, ensuring zero throughput contention and sub-70ms end-to-end processing latency.",
  "workplaceExample": "A high-frequency financial metrics stream has 6 distinct microservices that need to read trade events within 100 milliseconds. Using standard GetRecords, the consumers frequently throttled each other. The engineering team registers each of the 6 microservices as an Enhanced Fan-Out consumer, giving each service its own dedicated 2 MB/sec pipe per shard and reducing delivery latency from 250ms down to 65ms.",
  "examFocus": "Know when to choose Enhanced Fan-Out vs Standard Consumers: (1) Standard Consumer: Shared 2 MB/sec read per shard across all consumers, pull-based (GetRecords), ~200ms latency, free read throughput. (2) Enhanced Fan-Out: Dedicated 2 MB/sec read per shard PER consumer, push-based over HTTP/2 (SubscribeToShard), ~70ms latency, incurs additional charges for consumer-shard hours and data retrieved.",
  "keyPoints": [
    "Provides dedicated 2 MB/sec read throughput per shard per registered consumer.",
    "Uses an HTTP/2 streaming push model (SubscribeToShard API) rather than HTTP/1.1 pull polling (GetRecords).",
    "Reduces end-to-end message delivery latency from ~200ms down to approximately 70ms.",
    "Supports up to 20 registered Enhanced Fan-Out consumers per Kinesis data stream by default.",
    "Eliminates read throughput contention when multiple independent applications read from the same stream.",
    "Incurs additional hourly costs per registered consumer-shard and per gigabyte of data retrieved.",
    "Can be used directly with AWS Lambda event source mappings and KCL 2.x consumer applications."
  ],
  "commonMistake": "Enabling Enhanced Fan-Out for every simple single-consumer stream. If you only have one consumer reading from a stream and ~200ms latency is acceptable, standard shared polling is more cost-effective since it avoids consumer-shard hourly fees.",
  "example": "Register an Enhanced Fan-Out consumer using the AWS CLI: aws kinesis register-stream-consumer --stream-arn arn:aws:kinesis:us-east-1:123456789012:stream/trade-stream --consumer-name real-time-pricing-engine.",
  "sources": [
    {
      "title": "Developing Custom Consumers with Dedicated Throughput (Enhanced Fan-Out)",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/enhanced-consumers.html"
    },
    {
      "title": "Building Enhanced Fan-Out Consumers with the Kinesis Client Library",
      "url": "https://docs.aws.amazon.com/streams/latest/dev/building-enhanced-consumers-kcl-java.html"
    }
  ]
});
