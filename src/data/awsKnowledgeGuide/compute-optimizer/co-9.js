import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-9",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "Performance Risk",
  "status": "ready",
  "plainEnglish": "Performance Risk in AWS Compute Optimizer is a rating (Very Low, Low, Medium, or High) assigned to each recommendation option that quantifies the likelihood that migrating to the suggested resource type or configuration might cause performance degradation. Compute Optimizer calculates this risk by comparing the resource specification differences (such as fewer vCPUs, reduced memory, lower EBS bandwidth, or architecture differences like x86 vs Graviton ARM) against the workload's peak historical demand curves.",
  "whyItMatters": "Rightsizing is not just about choosing the cheapest possible instance; saving money is worthless if the smaller server crashes or slows down during peak customer traffic. Performance Risk ratings give systems engineers the confidence to execute aggressive cost-saving changes on 'Very Low' risk recommendations while treating 'Medium' or 'High' risk recommendations with cautious benchmarking.",
  "workplaceExample": "A DevOps team reviews Compute Optimizer options for a payment API server. Option 1 saves 40% with a 'High' performance risk due to memory headroom constraints. Option 2 saves 28% with a 'Very Low' performance risk. The team chooses Option 2 to maintain safe performance margins during flash sales.",
  "examFocus": "For SAA-C03, know that Performance Risk ranges from Very Low (0) to High. It accounts for potential CPU, memory, network, and disk bottlenecks if the resource is scaled down. Recommendations with High performance risk indicate that peak bursts in your historical metrics may exceed the target configuration's capacity.",
  "keyPoints": [
    "Quantifies the probability of experiencing performance degradation after applying a recommendation.",
    "Categorized into 4 distinct risk levels: Very Low, Low, Medium, and High.",
    "Calculated by comparing workload peak utilization against target resource hardware limits.",
    "Helps engineers balance aggressive cost reduction against application reliability and SLAs.",
    "Accounts for CPU, RAM, network throughput, EBS bandwidth, and CPU architecture differences."
  ],
  "commonMistake": "Automatically filtering for and applying only the highest dollar savings option without checking its Performance Risk rating. If an option has 'High' performance risk, your workload may fail during peak traffic spikes.",
  "example": "# Query recommendations filtered for Very Low performance risk:\naws compute-optimizer get-ec2-instance-recommendations \\\n  --query 'instanceRecommendations[?recommendationOptions[0].performanceRisk==`0`].[instanceName,recommendationOptions[0].instanceType,recommendationOptions[0].performanceRisk]' \\\n  --output table",
  "sources": [
    {
      "title": "Understanding Performance Risk in AWS Compute Optimizer",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/performance-risk.html"
    },
    {
      "title": "Viewing EC2 Instance Recommendations and Risk Factors",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ec2-recommendations.html"
    }
  ]
});
