import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-10",
  "title": "Broker Storage",
  "plainEnglish": "Broker Storage in Amazon MSK Provisioned clusters is the dedicated disk capacity attached to each Kafka broker to store topic partition log segments, offsets, and metadata. Amazon MSK provisions dedicated Amazon Elastic Block Store (Amazon EBS) volumes (such as gp3 or gp2) for each broker node, supporting volume sizes from 100 GB up to 16 TiB per broker.",
  "whyItMatters": "Running out of disk space on a Kafka broker causes the broker to crash, shuts down active partition leaders, and halts producer ingestion. Properly sizing broker storage, monitoring disk utilization metrics, and configuring log retention policies prevents unexpected cluster outages while maintaining required historical data windows.",
  "workplaceExample": "A cyber-intelligence platform ingests 500 GB of security event logs per day into an Amazon MSK cluster with 3 brokers. With a required 7-day retention window, total storage requirement is 3.5 TB * 3 (replication factor) = 10.5 TB. The engineering team allocates 4 TB of gp3 EBS storage to each of the 3 brokers, enabling MSK Tiered Storage to offload logs older than 24 hours to Amazon S3 storage at a 50% cost reduction.",
  "examFocus": "Understand MSK broker storage rules: (1) Volume size: 100 GB to 16 TiB per broker. (2) Scaling: Storage can be expanded dynamically via the console/API without cluster downtime, but CANNOT be scaled down. (3) MSK Tiered Storage: Decouples local SSD/EBS storage from long-term retention by automatically moving inactive log segments to a low-cost, virtually unlimited remote storage tier. (4) Monitor `KafkaDataLogsDiskUsed` metric in CloudWatch.",
  "keyPoints": [
    "Each broker attaches dedicated Amazon EBS storage volumes (from 100 GiB up to 16 TiB per broker).",
    "Supports Amazon EBS gp3 volumes with configurable baseline IOPS and throughput.",
    "Storage volume capacity can be increased dynamically while the cluster remains active and online.",
    "Broker storage CANNOT be downscaled; decreasing disk size requires recreating the cluster or managing log retention.",
    "MSK Tiered Storage allows storing virtually unlimited historical data by offloading older log segments to remote tiered storage.",
    "Log retention settings (log.retention.hours, log.retention.bytes) dictate when expired log segments are deleted from disk."
  ],
  "commonMistake": "Believing you can shrink EBS storage volumes if your data storage needs decrease. Amazon EBS volumes attached to MSK brokers cannot be reduced in size; you can only expand them.",
  "example": "Increase storage volume size to 2,000 GB on all brokers in an MSK cluster using the AWS CLI: aws kafka update-broker-storage --cluster-arn arn:aws:kafka:us-east-1:123456789012:cluster/prod-cluster/abcd --current-version K13V1IB3VIYZZH --target-broker-ebs-volume-info 'KafkaBrokerNodeId=ALL,VolumeSizeGB=2000'.",
  "sources": [
    {
      "title": "Amazon MSK Broker Storage Overview",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-storage.html"
    },
    {
      "title": "Decoupling Storage with Amazon MSK Tiered Storage",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/tiered-storage.html"
    }
  ]
});
