import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "co-15",
  "topicId": "topic-compute-optimizer",
  "topicTitle": "AWS Compute Optimizer",
  "objectiveCode": "Management",
  "title": "Compute Optimizer vs Cost Explorer",
  "status": "ready",
  "plainEnglish": "AWS Compute Optimizer and AWS Cost Explorer both assist with cost management but approach optimization from different angles. AWS Cost Explorer is a financial reporting, forecasting, and billing visualization service that helps finance and engineering teams understand overall AWS spend patterns and includes basic EC2 rightsizing recommendations based on simple CloudWatch average CPU thresholds. AWS Compute Optimizer is an engineering-focused ML recommendation engine that evaluates complex multi-dimensional telemetry (memory, CPU, network, disk I/O, architecture) to recommend specific hardware configurations across EC2, ASG, EBS, Lambda, and ECS Fargate.",
  "whyItMatters": "Cost Explorer answers financial questions like 'How much did we spend on EC2 last month and what will next month cost?'. Compute Optimizer answers technical architecture questions like 'What specific EC2 instance type, Graviton processor, or EBS gp3 IOPS configuration will optimize our workload without causing performance degradation?'.",
  "workplaceExample": "A FinOps manager opens AWS Cost Explorer to generate monthly spending reports and track commitment coverage for executive leadership. The lead infrastructure architect opens AWS Compute Optimizer to generate a technical migration plan that moves 50 EC2 instances from x86 to Graviton3 (c7g) processors.",
  "examFocus": "For SAA-C03, compare the two services: AWS Cost Explorer provides billing visualization, 12-month historical cost trends, 12-month cost forecasts, and Savings Plans/Reservation recommendations. AWS Compute Optimizer provides ML-powered technical rightsizing recommendations across EC2, ASG, EBS, Lambda, and ECS Fargate with performance risk ratings.",
  "keyPoints": [
    "Cost Explorer focuses on financial billing analysis, historical charting, and forecasting.",
    "Compute Optimizer focuses on engineering-level ML resource rightsizing and architecture optimization.",
    "Cost Explorer provides Savings Plans and Reserved Instance commitment recommendations.",
    "Compute Optimizer provides technical instance family, processor architecture, and storage tuning recommendations.",
    "Cost Explorer can import and display Compute Optimizer recommendations directly inside its console."
  ],
  "commonMistake": "Relying solely on Cost Explorer's basic rightsizing recommendations, which only consider simple CPU thresholds. Compute Optimizer evaluates CPU, RAM, network, EBS bandwidth, and performance risk for comprehensive rightsizing.",
  "example": "# Integrate Compute Optimizer recommendations with Cost Explorer reporting:\naws ce get-rightsizing-recommendation \\\n  --service AmazonEC2 \\\n  --configuration '{\"RecommendationTarget\":\"CROSS_INSTANCE_FAMILY\",\"BenefitsConsidered\":true}'",
  "sources": [
    {
      "title": "Viewing Compute Optimizer Recommendations in AWS Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-rightsizing.html"
    },
    {
      "title": "What is AWS Compute Optimizer?",
      "url": "https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html"
    }
  ]
});
