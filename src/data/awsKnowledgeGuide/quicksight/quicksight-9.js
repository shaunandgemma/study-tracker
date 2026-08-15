import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-quicksight",
  "topicTitle": "Amazon QuickSight",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "quicksight-9",
  "title": "Direct Query",
  "plainEnglish": "Direct query means Quick Sight leaves dataset data in the supported source and queries that source when associated datasets, analyses, or dashboards are opened. It avoids maintaining a SPICE copy, but the user experience now depends more directly on the source and its connection.",
  "whyItMatters": "This mode can expose newer source data without waiting for a SPICE ingestion. It also passes analytical demand to the database, so source performance, query design, permissions, availability, and network access become part of dashboard reliability.",
  "workplaceExample": "A support centre uses direct query for a dashboard backed by a tuned data warehouse because supervisors need recently loaded case status. The database team watches query load and provides a reporting view rather than letting dashboard traffic compete with transactional tables.",
  "examFocus": "Direct query favors source freshness and avoids SPICE capacity, whereas SPICE favors fast interactive performance and source workload isolation. A direct-query dashboard is not a real-time streaming system; results still depend on the source data, generated query, and connectivity.",
  "keyPoints": [
    "Direct-query data remains in its supported source instead of being imported into SPICE.",
    "Quick Sight automatically refreshes direct-query data when an associated dataset, analysis, or dashboard is opened.",
    "Database performance and concurrent query capacity affect visual response time.",
    "Quick Sight still needs valid authorization and network reachability to the data source.",
    "Private sources might require a correctly configured virtual private cloud connection.",
    "A reporting view, suitable indexes, and efficient SQL can reduce load and latency."
  ],
  "commonMistake": "Do not choose direct query only to avoid configuring refreshes. First confirm that the source can support interactive concurrency and that Quick Sight can reach it; otherwise users may get slow visuals or connection failures.",
  "example": "Connect a dashboard dataset directly to a read-optimized warehouse view, validate the virtual private cloud route and database permissions, load-test common filters, and monitor both database demand and dashboard latency.",
  "sources": [
    {
      "title": "Refreshing data in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/refreshing-data.html"
    },
    {
      "title": "Working with AWS virtual private clouds in Amazon Quick Sight",
      "url": "https://docs.aws.amazon.com/quick/latest/userguide/working-with-aws-vpc.html"
    }
  ]
});
