import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-2",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "Identifies Over-Provisioned and Under-Provisioned Infrastructure Resources",
  "status": "ready",
  "plainEnglish": "AWS Compute Optimizer categorizes your analyzed AWS resources into one of three core finding states: Over-provisioned, Under-provisioned, or Optimized. An 'Over-provisioned' resource has more CPU, memory, or disk throughput than its workload requires, resulting in excess cost. An 'Under-provisioned' resource is constrained by CPU, memory, or I/O, causing high latency, queue buildup, or throttling. An 'Optimized' resource is appropriately sized for its current workload requirements.",
  "whyItMatters": "Finding states give cloud administrators instant clarity on where to prioritize infrastructure changes. Over-provisioned resources represent immediate cost-reduction opportunities, while under-provisioned resources represent critical operational risks where application performance and customer experience are at jeopardy.",
  "workplaceExample": "A FinOps dashboard filters Compute Optimizer findings across all AWS accounts. It flags 40 under-provisioned EC2 database instances experiencing CPU throttling (recommending an upgrade from c5.large to c5.2xlarge to fix latency) and 90 over-provisioned web servers running at 4% utilization (recommending a downsize to save $8,000/month).",
  "examFocus": "For SAA-C03, know the three primary finding classifications: (1) Over-provisioned: resource exceeds workload demands; opportunity to downsize or switch instance family to save money. (2) Under-provisioned: resource specifications are too small; performance is constrained; opportunity to upsize to avoid bottlenecks. (3) Optimized: resource specifications correctly balance cost and performance.",
  "keyPoints": [
    "Over-provisioned: Capacity exceeds workload requirements, indicating direct cost-saving opportunities.",
    "Under-provisioned: Resource is bottlenecked on CPU, memory, network, or disk I/O, risking application performance.",
    "Optimized: Workload demand matches allocated resource specifications perfectly.",
    "Findings are calculated using machine learning based on 14 days of CloudWatch utilization metrics.",
    "Helps prioritize both cost-cutting initiatives and performance-remediation tasks."
  ],
  "commonMistake": "Downsizing an 'Over-provisioned' EC2 instance without checking memory utilization. If the CloudWatch Agent is not installed, Compute Optimizer evaluates only CPU and network, potentially recommending a smaller instance that lacks enough RAM for your application.",
  "example": "# Filter for under-provisioned EC2 instances needing immediate remediation:\naws compute-optimizer get-ec2-instance-recommendations \\\n  --filters name=Finding,values=Underprovisioned \\\n  --query 'instanceRecommendations[*].[instanceName,currentInstanceType,findingReasonCodes]' \\\n  --output table",
  "sources": [
    {
      "title": "Viewing EC2 Instance Recommendations and Finding Classifications",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ec2-recommendations.html"
    },
    {
      "title": "Understanding Compute Optimizer Findings and Reasons",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-ec2-recommendations.html#ec2-recommendation-details"
    }
  ]
});
