import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-11",
  "title": "Amazon S3 Standard",
  "plainEnglish": "Amazon S3 Standard is the default, high-performance general-purpose object storage class in Amazon S3. It is designed for frequently accessed data that requires high throughput and low latency (milliseconds). S3 Standard stores data redundantly across a minimum of three geographically separated Availability Zones within an AWS Region, delivering 99.999999999% (11 9s) of data durability and 99.99% availability with zero minimum storage duration or data retrieval fees.",
  "whyItMatters": "S3 Standard is the workhorse storage class for active cloud applications, cloud-native web backends, big data analytics engines, and content distribution workflows. Because it charges no data retrieval fees and has no minimum object storage duration, it is the most cost-effective and performant choice for objects that are read, modified, or deleted frequently.",
  "workplaceExample": "An e-commerce website stores product catalog images, user profile avatars, and active transaction receipts in S3 Standard. Because millions of website visitors request these images every minute, S3 Standard's millisecond latency and zero retrieval fees ensure lightning-fast page load times and predictable monthly storage costs.",
  "examFocus": "Understand S3 Standard characteristics: (1) Durability: 11 9s (99.999999999%) across >= 3 Availability Zones. (2) Availability SLA: 99.99% (designed for 99.99%). (3) Latency: Low millisecond access time. (4) Pricing Model: Storage per GB-month + API request fees (PUT, GET, LIST); NO retrieval fees, NO minimum object size penalty, and NO minimum storage duration.",
  "keyPoints": [
    "Default object storage class for frequently accessed, active data workloads.",
    "Stores data redundantly across at least 3 distinct Availability Zones in an AWS Region.",
    "Provides 11 9s (99.999999999%) data durability and 99.99% availability.",
    "Zero data retrieval fees and zero minimum storage duration constraints.",
    "Delivers consistent low-millisecond first-byte latency for high-throughput applications.",
    "Ideal for active data lakes, web applications, mobile media, and dynamic content repositories."
  ],
  "commonMistake": "Keeping infrequently accessed data (like old log archives or compliance backups) in S3 Standard indefinitely. After 30–90 days without access, transitioning data to S3 Standard-IA, S3 Intelligent-Tiering, or Glacier reduces storage costs by 40% to 90%.",
  "example": "Upload an object explicitly specifying the S3 Standard storage class using the AWS CLI: aws s3 cp dataset.csv s3://my-active-bucket/dataset.csv --storage-class STANDARD.",
  "sources": [
    {
      "title": "Amazon S3 Storage Classes Overview",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html#sc-standard"
    },
    {
      "title": "What is Amazon S3?",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html"
    }
  ]
});
