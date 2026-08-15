import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-8",
  "title": "SPICE In-Memory Engine",
  "plainEnglish": "SPICE is Quick Sight's managed, in-memory calculation engine. A SPICE dataset imports and stores a copy of selected source data so visuals can calculate and respond without sending every dashboard interaction back to the original database.",
  "whyItMatters": "SPICE can make interactive analytics consistent and reduce repeated query load on operational systems. The tradeoff is that imported data consumes SPICE capacity and must be refreshed when the source changes.",
  "workplaceExample": "A reporting team imports several years of approved order history into SPICE overnight. Hundreds of managers can then filter the same dashboard during the morning meeting without each click running another query on the transactional database.",
  "examFocus": "Select SPICE when fast interaction, workload isolation, and cached analytical data are more important than querying the source for every view. Select direct query when source freshness is the stronger requirement and the source can handle the workload.",
  "keyPoints": [
    "SPICE stands for Super-fast, Parallel, In-memory Calculation Engine.",
    "A SPICE dataset contains an imported copy; it is not the system of record.",
    "Dashboard interactions normally use the imported data instead of repeatedly querying the source.",
    "SPICE capacity must be available for the data being imported.",
    "A refresh or ingestion is required to bring later source changes into the SPICE copy.",
    "Ingestion history and failure notifications help operators detect stale imports."
  ],
  "commonMistake": "Do not assume a successful-looking dashboard proves its SPICE data is current. Check the last successful ingestion and refresh history, because readers can continue seeing the prior imported copy after a refresh problem.",
  "example": "Import a curated finance dataset into SPICE, schedule its refresh after the warehouse load, enable owner notifications for refresh failures, record an acceptable freshness target, and monitor ingestion history before monthly reporting.",
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
