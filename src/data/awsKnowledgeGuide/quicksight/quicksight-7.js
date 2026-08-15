import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-7",
  "title": "QuickSight Dashboards",
  "plainEnglish": "A dashboard is the published, reader-facing version of a Quick Sight analysis. Readers can view it and use the filters, controls, drill actions, and other interactions the author enabled, but they do not edit the source analysis through the dashboard.",
  "whyItMatters": "Dashboards provide a controlled way to distribute approved metrics to decision-makers. Authors can keep experimenting in the analysis while readers continue using a stable published presentation.",
  "workplaceExample": "An operations team publishes a reviewed fulfilment analysis as a dashboard for warehouse managers. Each manager can select a date range and drill into late shipments, while row-level security limits the records to that manager's region.",
  "examFocus": "Choose a dashboard for consumption and sharing, and an analysis for authoring. A dashboard preserves the published analysis definition, while its visuals can still show current data from the associated datasets according to their refresh or direct-query behavior.",
  "keyPoints": [
    "A dashboard is created by publishing an analysis.",
    "Readers interact with the published experience without redesigning its source analysis.",
    "Authors must publish again to deliver later design changes from the analysis.",
    "Dashboard sharing controls who can open the asset; dataset security controls which data they can see.",
    "Filters and controls can help readers explore data but are not a substitute for row-level or column-level security.",
    "The dashboard's data freshness depends on whether its datasets use SPICE refreshes or direct query."
  ],
  "commonMistake": "Sharing a dashboard does not mean every viewer should receive every underlying row. Configure dataset security, share with the intended users or groups, and test the dashboard while acting as a restricted reader.",
  "example": "Publish a service-level dashboard after the analysis owner signs off its calculations. Share it with the support-leads group, apply team-based row-level security in the dataset, and confirm both the interactive filters and the restricted data view.",
  "sources": [
    {
      "title": "Working with dashboards in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/working-with-dashboards.html"
    },
    {
      "title": "Using Amazon Quick Sight dashboards",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/using-dashboards.html"
    }
  ]
});
