import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-11",
  "title": "Storage Auto Scaling",
  "plainEnglish": "Storage Auto Scaling in Amazon MSK is a feature that automatically expands the EBS storage volume size of your Kafka brokers in response to growing streaming data volumes. By defining a target storage utilization threshold (e.g., 70% or 80%) and a maximum storage limit per broker, Amazon MSK integrates with AWS Application Auto Scaling to automatically increase disk capacity before brokers run out of disk space.",
  "whyItMatters": "Manual disk monitoring and capacity expansion requires continuous operational vigilance. If unexpected traffic surges fill broker disks to 100%, brokers crash and reject incoming producer writes. Storage Auto Scaling automates storage management, ensuring uninterrupted cluster operation during seasonal or unexpected data spikes.",
  "workplaceExample": "A logistics fleet streaming platform provisions 500 GB of storage per broker on an MSK cluster. They configure Storage Auto Scaling with a target utilization of 75% and a maximum storage limit of 4,000 GB per broker. When unexpected winter holiday shopping surges increase log generation to 400 GB/day, MSK automatically detects disk utilization crossing 75% and expands each broker's EBS volume to 750 GB, preventing storage exhaustion.",
  "examFocus": "Understand MSK Storage Auto Scaling configuration and constraints: (1) Uses AWS Application Auto Scaling target-tracking policies. (2) Requires setting a Target Utilization Percentage (typically between 10% and 80%) and a Maximum Storage Limit per broker (up to 16 TiB). (3) Scaling is one-directional: Auto Scaling only expands storage; it never shrinks EBS volumes. (4) Minimum cooldown period: After an expansion, EBS volumes require a 6-hour cooldown period before they can be expanded again.",
  "keyPoints": [
    "Automatically expands broker EBS volume sizes based on target storage utilization thresholds.",
    "Integrated natively with AWS Application Auto Scaling target-tracking scaling policies.",
    "Protects clusters from downtime and write rejection caused by full disks (disk full crashes).",
    "Requires defining a Maximum Storage Limit per broker (up to 16 TiB).",
    "Scaling is strictly one-directional; Auto Scaling increases disk size but will never reduce it.",
    "Subject to Amazon EBS volume modification cooldown limits (must wait at least 6 hours between storage increases)."
  ],
  "commonMistake": "Setting the target utilization threshold too close to 100% (e.g., 98%). Because Amazon EBS storage expansion takes several minutes to take effect and has a 6-hour modification cooldown, setting the threshold too high risks filling the disk completely before the expansion completes.",
  "example": "Register MSK broker storage as a scalable target with Application Auto Scaling: aws application-autoscaling register-scalable-target --service-namespace kafka --resource-id arn:aws:kafka:us-east-1:123456789012:cluster/prod-cluster/abcd --scalable-dimension kafka:broker-storage:VolumeSizeGB --min-capacity 500 --max-capacity 4000.",
  "sources": [
    {
      "title": "Managing Amazon MSK Storage Automatically with Auto Scaling",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/msk-auto-expand-storage.html"
    },
    {
      "title": "Storage Best Practices for Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/bestpractices.html#bestpractices-storage"
    }
  ]
});
