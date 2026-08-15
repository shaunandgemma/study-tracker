import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-3",
  "title": "QuickSight Business Intelligence",
  "plainEnglish": "Amazon Quick Sight—previously styled Amazon QuickSight—is the business-intelligence and data-visualization capability within Amazon Quick. It connects to supported data, prepares reusable datasets, lets authors build analyses, and publishes dashboards or reports for viewers.",
  "whyItMatters": "Business intelligence turns trusted operational data into charts, key performance indicators, tables, and interactive questions that help people make decisions. Quick Sight provides a managed authoring and sharing layer rather than replacing databases or data warehouses.",
  "workplaceExample": "A finance author connects Quick Sight to a curated Amazon Redshift reporting schema, prepares a dataset with approved calculations, validates totals, builds a monthly analysis, and publishes a read-focused dashboard to a finance group.",
  "examFocus": "Know the asset flow: data source connection → prepared dataset → editable analysis with sheets and visuals → published dashboard. Editing an analysis does not update an already published dashboard until it is published again.",
  "keyPoints": [
    "Quick Sight is a managed business-intelligence and visualization service.",
    "A data source holds connection information for an external repository.",
    "A dataset selects and prepares data for reuse in analyses.",
    "An analysis is the editable authoring workspace containing sheets and visuals.",
    "A dashboard is a published view created from an analysis.",
    "The underlying database, warehouse, or lake remains the authoritative data system."
  ],
  "commonMistake": "Expecting Quick Sight to become the data warehouse confuses visualization with storage and processing. Keep governed source data and transformations in the appropriate analytical systems.",
  "example": "Define the question 'Which regions missed monthly margin targets?', connect to a governed warehouse view, prepare typed fields, validate calculations, build a key performance indicator and regional chart, publish, and share only with the finance group.",
  "sources": [
    {
      "title": "Amazon Quick Sight business intelligence",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/quick-bi.html"
    },
    {
      "title": "Getting started with Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/quick-sight-getting-started.html"
    }
  ]
});
