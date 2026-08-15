import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-18",
  "title": "Amazon S3 Express One Zone",
  "plainEnglish": "Amazon S3 Express One Zone is a purpose-built, high-performance object storage tier that delivers consistent single-digit millisecond data access latencies by co-locating data inside a single Availability Zone alongside your compute workloads. Designed for extreme request throughput and low-latency read/write intensive applications, S3 Express One Zone utilizes specialized 'Directory Buckets' to achieve up to 10x faster access speeds and 50% lower request costs than S3 Standard.",
  "whyItMatters": "Data-intensive compute applications such as distributed AI/ML training, graph analytics, and real-time financial risk modeling require rapid data access to keep expensive GPUs and CPUs fully utilized. S3 Express One Zone removes I/O latency bottlenecks, allowing compute instances to query, append, and read small objects with sub-millisecond responsiveness without managing dedicated cache clusters.",
  "workplaceExample": "A quantitative trading firm runs high-frequency backtesting algorithms on Amazon EC2 compute clusters in `us-east-1a`. They store historical order book tick data inside an S3 Express One Zone directory bucket located in the exact same AZ (`market-data--use1-az1--x-s3`). Backtesting simulations execute 3x faster due to single-digit millisecond latency, saving thousands of compute instance hours weekly.",
  "examFocus": "Understand S3 Express One Zone architecture and tradeoffs: (1) Single-AZ Storage: Replicated across independent hardware within ONE Availability Zone (99.999999999% single-AZ durability; 99.95% availability). (2) Directory Buckets: Uses hierarchical directory bucket structure instead of general-purpose flat namespace. (3) 50% Lower Request Costs: Significantly lower cost per 1,000 PUT/GET requests. (4) Session Authentication: Optimized with `CreateSession` for low-overhead client auth.",
  "keyPoints": [
    "Delivers consistent single-digit millisecond latency for high-performance cloud compute.",
    "Uses specialized Directory Buckets provisioned in a specific designated Availability Zone.",
    "Offers up to 10x faster access speeds and 50% lower API request fees compared to S3 Standard.",
    "Designed for 11 9s of data durability within a single Availability Zone.",
    "Directory bucket naming requires an AZ ID suffix (e.g., `bucket-name--use1-az1--x-s3`).",
    "Tailored for AI/ML training, real-time analytics, high-frequency modeling, and interactive query engines."
  ],
  "commonMistake": "Attempting to use standard general-purpose bucket features like S3 Object Lock, S3 Lifecycle Transitions, or Cross-Region Replication directly within Directory Buckets. S3 Express One Zone supports a streamlined subset of S3 APIs optimized exclusively for extreme speed and low latency.",
  "example": "List directory buckets in an account using the AWS CLI: aws s3control list-directory-buckets --account-id 123456789012.",
  "sources": [
    {
      "title": "What is Amazon S3 Express One Zone?",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-one-zone.html"
    },
    {
      "title": "Directory Buckets in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-overview.html"
    }
  ]
});
