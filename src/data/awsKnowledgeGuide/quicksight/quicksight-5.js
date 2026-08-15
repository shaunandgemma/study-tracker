import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-5",
  "title": "QuickSight Datasets",
  "plainEnglish": "A dataset is the reusable, prepared view of data that analyses and dashboards use. It can select fields from one or more supported inputs, set data types, apply preparation filters, add calculated fields, and choose SPICE import or direct query.",
  "whyItMatters": "A well-governed dataset gives authors consistent definitions for dates, revenue, customer segments, and security rules. This reduces conflicting calculations and protects consumers from raw source complexity.",
  "workplaceExample": "A sales analytics owner creates a dataset from warehouse orders and targets, changes text dates to date fields, removes unused personal data, defines approved margin calculations, applies RLS, and shares it with an analyst group.",
  "examFocus": "Datasets sit between data sources and analyses. Calculated fields derive analytical values but do not update the source. Apply row-level and column-level security at the dataset layer when real data restrictions are required.",
  "keyPoints": [
    "Datasets store field selection and data-preparation decisions.",
    "A dataset can be reused by multiple analyses.",
    "Field names and data types should be checked before visual design.",
    "Preparation can include filters, joins, renamed fields, and calculated fields.",
    "Each supported dataset uses SPICE import or direct query according to its configuration.",
    "Dataset sharing, analysis sharing, and dashboard sharing are separate permissions."
  ],
  "commonMistake": "Hiding a sensitive column in one visual does not secure the dataset. Apply column-level security or remove the field from the governed dataset, then test with a restricted user.",
  "example": "Create a sales dataset, retain only required columns, correct date and decimal types, add a documented gross_margin field, attach group-based RLS, validate totals against the source, and share the dataset with approved authors.",
  "sources": [
    {
      "title": "Working with datasets",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/working-with-datasets.html"
    },
    {
      "title": "Preparing data in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/preparing-data.html"
    }
  ]
});
