import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-19",
  "title": "Fargate Pricing - vCPU and Memory Usage",
  "plainEnglish": "AWS Fargate follows a serverless, pay-as-you-go pricing model based on the compute (vCPU) and memory (GB) resources requested at the task level, measured per second of execution with a 1-minute minimum. Additional charges apply only if you provision ephemeral storage beyond the default 20 GiB baseline or utilize optional features like Windows containers.",
  "whyItMatters": "Unlike Amazon EC2 where you pay for full virtual servers regardless of whether your containers fully utilize the host's capacity, Fargate pricing eliminates waste from idle CPU and memory. Optimizing task CPU/memory sizing and adopting ARM64 Graviton processors directly minimizes infrastructure expenditures.",
  "workplaceExample": "A technology company audits their Fargate workloads. By migrating their Node.js and Python microservices from x86_64 to ARM64 (AWS Graviton2) processors and right-sizing memory allocations from 4 GB to 2 GB per task based on CloudWatch metrics, they achieve a 45% reduction in their monthly container computing costs.",
  "examFocus": "Understand Fargate cost optimization strategies: (1) Right-size task CPU and memory based on CloudWatch utilization metrics. (2) Adopt AWS Graviton (ARM64) architecture for up to 40% price-performance improvement over x86. (3) Utilize AWS Compute Savings Plans (offering up to 50% discounts for 1- or 3-year commitments). (4) Leverage Fargate Spot for fault-tolerant batch workloads (up to 70% discount).",
  "keyPoints": [
    "Pricing is calculated per second (1-minute minimum) based on the vCPU and memory configured in the task definition.",
    "Billed independently for vCPU-hours, memory GB-hours, and additional ephemeral storage provisioned above 20 GiB.",
    "AWS Graviton (ARM64) architecture provides up to 40% better price-performance compared to comparable x86_64 Fargate tasks.",
    "Eligible for AWS Compute Savings Plans, providing significant discounts in exchange for a 1- or 3-year consistent usage commitment.",
    "Fargate Spot offers up to a 70% discount compared to regular Fargate on-demand pricing for interruptible tasks.",
    "Fargate eliminates the risk of paying for underutilized EC2 worker instances during low-traffic periods."
  ],
  "commonMistake": "Over-provisioning task definitions with excessive vCPU and memory (e.g., allocating 4 vCPU and 16 GB RAM to an app that only uses 0.5 vCPU and 1 GB RAM). In Fargate, you pay for what you configure in the task definition, not what the container actively consumes at runtime.",
  "example": "Configure ARM64 architecture in the runtimePlatform section of the ECS task definition to take advantage of lower Graviton pricing: \"runtimePlatform\": {\"cpuArchitecture\": \"ARM64\", \"operatingSystemFamily\": \"LINUX\"}.",
  "sources": [
    {
      "title": "AWS Fargate Pricing",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html"
    },
    {
      "title": "Cost Optimization with AWS Fargate and Graviton",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-leveraging-ec2/aws-fargate.html"
    }
  ]
});
