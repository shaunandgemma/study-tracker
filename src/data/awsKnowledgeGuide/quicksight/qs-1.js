import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "qs-1",
  "title": "Fast In-Memory Data Engine (SPICE) for rapid interactive visualizations",
  "plainEnglish": "SPICE stands for Super-fast, Parallel, In-memory Calculation Engine. Amazon Quick Sight can import a prepared dataset into SPICE so filters, charts, and calculations use the optimized in-memory copy instead of querying the original system for every interaction.",
  "whyItMatters": "Repeated dashboard queries can be slow or expensive against a warehouse or serverless query engine. SPICE can make exploration responsive and reduce repeated source queries, provided the team plans capacity and data refreshes.",
  "workplaceExample": "A retail dashboard imports yesterday's curated sales data from Amazon Athena into SPICE. Regional managers filter millions of rows quickly while a scheduled ingestion refreshes the dataset each morning.",
  "examFocus": "Contrast SPICE with direct query. SPICE stores an imported analytical copy and needs ingestion, capacity, freshness, and failure monitoring. It is not the source of record and a refresh schedule is not continuous replication.",
  "keyPoints": [
    "SPICE is Quick Sight's Super-fast, Parallel, In-memory Calculation Engine.",
    "Imported datasets are materialized in SPICE after dataset preparation.",
    "Dashboard interactions normally avoid querying the original source repeatedly.",
    "SPICE capacity is allocated and managed per AWS Region for the Quick account.",
    "Full or supported incremental refreshes update the imported copy.",
    "If an ingestion fails, users can continue seeing data from the last successful ingestion rather than automatically receiving new source data."
  ],
  "commonMistake": "Treating a successful dashboard render as proof that the SPICE data is current can hide a failed refresh. Check ingestion status and the last successful refresh time.",
  "example": "Estimate the prepared dataset's logical size, import it into SPICE, run an initial ingestion, verify totals against the authoritative source, schedule refreshes, and enable failure notification for the dataset owner.",
  "sources": [
    {
      "title": "Importing data into SPICE",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/spice.html"
    },
    {
      "title": "Using SPICE data in an analysis",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/spice-in-an-analysis.html"
    }
  ]
});
