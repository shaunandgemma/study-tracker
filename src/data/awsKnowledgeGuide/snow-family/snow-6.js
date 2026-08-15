import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-6",
  "title": "AWS Snowball Edge",
  "plainEnglish": "AWS Snowball Edge is a ruggedized, highly secure, transportable data migration and edge computing appliance designed for petabyte-scale data transfers and demanding local compute workloads. Housed in a durable, weather-resistant physical case with an integrated E-ink shipping label, Snowball Edge is available in two specialized hardware configurations: Storage Optimized (focused on massive block/object storage capacity) and Compute Optimized (focused on high-performance vCPUs, RAM, and optional GPU acceleration).",
  "whyItMatters": "Enterprises decommissioning physical data centers or migrating legacy SAN/NAS systems need to move hundreds of terabytes of data quickly without congesting active corporate internet links. Snowball Edge delivers multi-terabyte to petabyte storage capacity, 10G/25G/40G/100G high-speed network interfaces, and onboard virtualization to process data directly on-premises.",
  "workplaceExample": "A manufacturing plant operates robotic assembly lines. The engineering team orders a Snowball Edge Storage Optimized (80 TB) device. Connected to the local data center over 40 GbE SFP+ fiber, the team copies 75 TB of uncompressed factory CAD archives and sensor telemetry onto the Snowball via the local S3-compatible adapter in 18 hours. The device is powered down and picked up by UPS for delivery to the local AWS Region.",
  "examFocus": "Understand the two Snowball Edge device options: (1) Snowball Edge Storage Optimized: Up to 80 TB (or 210 TB NVMe) usable capacity, 40 to 104 vCPUs; optimized for large-scale data migrations, backup archives, and high-capacity storage. (2) Snowball Edge Compute Optimized: 104 vCPUs, 416 GB RAM, 28 TB to 42 TB storage, optional NVIDIA GPU; optimized for machine learning inference, real-time video transcoding, and edge analytics. (3) Clustering: Up to 16 Storage Optimized devices can be clustered together to create a multi-petabyte local S3 storage pool.",
  "keyPoints": [
    "Ruggedized, transportable enterprise appliance for petabyte-scale data migration and edge compute.",
    "Two device types: Storage Optimized (high capacity) and Compute Optimized (high compute/GPU).",
    "Equipped with high-speed network interfaces (RJ45, 10G SFP+, 25G, 40G, 100G QSFP28).",
    "Provides local S3-compatible object storage and local EBS-compatible block storage.",
    "Integrated E-ink shipping display automatically updates to prepaid return courier address upon shutdown.",
    "Supports local clustering of up to 16 devices for increased local storage capacity and high availability."
  ],
  "commonMistake": "Attempting to order an original legacy 50 TB standard Snowball. The legacy non-Edge Snowball has been completely replaced by the AWS Snowball Edge family (Storage Optimized and Compute Optimized).",
  "example": "Configure and start the local S3-compatible storage adapter on a Snowball Edge using the Snowball Edge client: snowballEdge start-service --service-id s3 --endpoint https://192.168.1.100.",
  "sources": [
    {
      "title": "AWS Snowball Edge Overview and Architecture",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/what-is-snowball.html"
    },
    {
      "title": "Choosing Between Snowball Edge Device Types",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/device-differences.html"
    }
  ]
});
