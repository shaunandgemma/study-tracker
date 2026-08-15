import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-6",
  "title": "QuickSight Analyses",
  "plainEnglish": "An analysis is the editable workspace where a Quick Sight author explores datasets and builds sheets, visuals, filters, calculations, parameters, and interactions. When the author is satisfied, the analysis can be published as a dashboard for readers.",
  "whyItMatters": "Keeping authoring work in an analysis lets a team test calculations and layout before changing what dashboard readers see. It also separates the people allowed to design content from the people who only need to consume it.",
  "workplaceExample": "A retail analyst opens an approved sales dataset, creates monthly revenue and margin visuals on separate sheets, adds a region filter, checks the totals with finance, and publishes the finished analysis as the management dashboard.",
  "examFocus": "Remember the asset flow: dataset to analysis to published dashboard. An analysis is the author-focused, editable asset; publishing creates or updates the reader-facing dashboard, so saved analysis changes are not automatically a dashboard release.",
  "keyPoints": [
    "An analysis uses one or more datasets as its data foundation.",
    "Authors build and edit visuals on sheets inside the analysis.",
    "Filters, parameters, calculated fields, controls, and actions can shape the analytical experience.",
    "A visual represents selected dimensions and measures from a dataset.",
    "Analysis access is intended for authors who need to inspect or change the design.",
    "Publishing the analysis produces the dashboard that is shared with readers."
  ],
  "commonMistake": "Do not treat an analysis and a dashboard as two names for the same editable object. Make the change in the analysis, validate it, and publish again when readers should receive the revised dashboard design.",
  "example": "Use a customer-orders dataset to build an analysis with a trend sheet and a product-detail sheet. Add a date control and a calculated average-order-value measure, compare results with a trusted query, then publish only after review.",
  "sources": [
    {
      "title": "Working with an analysis in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/working-with-an-analysis.html"
    },
    {
      "title": "Starting an analysis in Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/creating-an-analysis.html"
    }
  ]
});
