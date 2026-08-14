import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ce-13",
  "topicId": "topic-cost-explorer",
  "topicTitle": "AWS Cost Explorer",
  "objectiveCode": "Management",
  "title": "Reserved Instance Utilization and Coverage",
  "status": "ready",
  "plainEnglish": "Reserved Instance (RI) Utilization and Coverage are two specialized analytics reports in AWS Cost Explorer that help you track and maximize the financial return on your Amazon EC2, Amazon RDS, Amazon Redshift, Amazon ElastiCache, and OpenSearch reservations. (1) RI Utilization measures how much of your purchased reservation capacity you are actually using (e.g. 95% utilization means 5% of purchased RI hours were wasted). (2) RI Coverage measures what percentage of your total running instance hours were paid for using RIs versus full-price On-Demand rates (e.g. 70% coverage means 30% of instance hours were billed at higher On-Demand rates).",
  "whyItMatters": "Purchasing Reserved Instances offers discounts up to 72% over On-Demand pricing in exchange for a 1- or 3-year commitment. However, if reserved instances sit unused due to workload migrations (low utilization), your business loses money on idle commitments; conversely, if running capacity is unreserved (low coverage), you are overpaying On-Demand rates.",
  "workplaceExample": "A database administrator opens the Cost Explorer RI Reports. The RDS RI Utilization report shows 100% utilization (all reservations fully utilized), but the RI Coverage report shows only 45% coverage across active MySQL databases. The company decides to purchase additional 1-year No Upfront RIs for the remaining 55% of databases to save $40,000 annually.",
  "examFocus": "For SAA-C03, distinguish clearly between the two reports: (1) `RI Utilization`: Percentage of purchased RI hours used by active instances (Target: ~100%). Low utilization means you over-committed or changed instance sizes. (2) `RI Coverage`: Percentage of active instance hours covered by RIs (Target: High, based on baseline). Low coverage means you have steady-state instances paying expensive On-Demand rates that could benefit from RIs.",
  "keyPoints": [
    "RI Utilization: Percentage of purchased reservation hours actually consumed by instances.",
    "RI Coverage: Percentage of total running instance hours paid via reservation discounts.",
    "Supports EC2, RDS, Redshift, ElastiCache, OpenSearch, and MemoryDB reservations.",
    "Enables setting custom target thresholds (e.g. 80% coverage goal) with visual warnings.",
    "Helps identify when to purchase new RIs or modify/exchange existing Standard or Convertible RIs."
  ],
  "commonMistake": "Confusing RI Utilization with RI Coverage. 100% Utilization means you are not wasting any purchased RIs, but you could still have only 20% Coverage (meaning 80% of your servers are paying expensive On-Demand rates).",
  "example": "# Query RI coverage data for the last 30 days via AWS CLI:\naws ce get-reservation-coverage \\\n  --time-period Start=2026-07-01,End=2026-07-31 \\\n  --group-by Type=DIMENSION,Key=SERVICE \\\n  --granularity MONTHLY",
  "sources": [
    {
      "title": "Understanding Reservations in Cost Explorer",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-ris.html"
    },
    {
      "title": "Using the Default Cost Explorer Reports",
      "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-default-reports.html"
    }
  ]
});
