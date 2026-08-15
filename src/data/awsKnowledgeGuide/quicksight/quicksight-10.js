import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-10",
  "title": "Scheduled Dataset Refresh",
  "plainEnglish": "A scheduled dataset refresh tells Quick Sight when to import source changes into a SPICE dataset. The schedule automates ingestion, but it does not continuously replicate the source and it cannot guarantee fresh data when credentials, network access, source queries, or ingestion fail.",
  "whyItMatters": "A refresh schedule aligns dashboard freshness with business needs and source availability. Scheduling the import after an upstream data load avoids needless queries and reduces the chance that users receive a partially updated reporting period.",
  "workplaceExample": "A finance warehouse finishes its daily load before business reporting begins. The Quick Sight owner schedules the SPICE refresh afterward, enables failure email notifications, and checks ingestion history before executives use the daily dashboard.",
  "examFocus": "Scheduled refresh applies to data imported into SPICE. Full refresh replaces the imported contents; supported Enterprise Edition SQL-based datasets can also use incremental refresh with a date column and look-back window. Direct query follows a different freshness model.",
  "keyPoints": [
    "A scheduled refresh starts a SPICE ingestion at configured times.",
    "The schedule should follow completion of upstream extract, transform, and load work.",
    "Quick Sight needs stored credentials and continued connectivity to refresh a connected source.",
    "Full refresh imports the dataset again, while supported incremental refresh reads a defined recent window.",
    "Incremental refresh is available for eligible SQL-based SPICE datasets in Enterprise Edition.",
    "Ingestion history and failure email notifications provide evidence that the schedule succeeded."
  ],
  "commonMistake": "Creating a schedule and then ignoring it can leave dashboards stale after a failed ingestion. Assign an owner, enable failure notification where available, and compare the last successful refresh time with the business freshness target.",
  "example": "For an eligible orders dataset, choose SPICE, schedule ingestion after the warehouse pipeline, use a full refresh unless a tested incremental design is justified, enable failure email, and document how the reporting team responds to a missed run.",
  "sources": [
    {
      "title": "Refreshing data in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/refreshing-data.html"
    },
    {
      "title": "Refreshing SPICE data",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/refreshing-imported-data.html"
    }
  ]
});
