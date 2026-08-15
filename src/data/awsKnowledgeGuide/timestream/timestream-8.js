import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-8",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Automatic Data Tiering",
  "plainEnglish": "Automatic data tiering in Amazon Timestream for LiveAnalytics is the process by which Timestream continuously and transparently moves records from the fast, in-memory storage tier to the slower but much cheaper magnetic storage tier as data ages past the memory-store retention threshold you configured on the table. From the application's perspective, this transition is invisible: queries submitted after migration still return the same results by automatically reading from whichever tier holds the data. No migration job, ETL pipeline or data movement code needs to be written or maintained.",
  "whyItMatters": "Without automatic tiering, engineers would need to build custom pipelines that periodically scan recent data, export ageing records to a cheaper archive, update index pointers, and handle errors during the migration—significant undifferentiated engineering effort. Automatic tiering offloads this operational burden to the Timestream service, letting engineering teams focus on building applications that consume time-series data rather than managing its physical storage lifecycle.",
  "workplaceExample": "An e-commerce platform collects checkout funnel events—page views, add-to-cart actions and purchase completions—as time-series records. The analytics team configured 24 hours of memory-store retention and 180 days of magnetic-store retention. At exactly midnight each day, Timestream silently migrates the previous day's oldest hour of records to the magnetic store. Analysts running cohort conversion reports that span the last 3 months query both tiers in a single SQL statement and receive results that include all data across both tiers without writing any data-movement code.",
  "examFocus": "Understand automatic data tiering for the SAA-C03 exam: (1) Transparent Migration: Applications and queries do not need to change when data moves between tiers; Timestream handles the routing. (2) Cost Efficiency: Data naturally transitions from the higher-cost memory store to the significantly cheaper magnetic store as it ages. (3) No ETL Required: There is no export, transform or load step—Timestream performs the migration internally. (4) Query Consistency: A single Timestream SQL query automatically retrieves data from both tiers, returning a complete and consistent result set.",
  "keyPoints": [
    "Timestream for LiveAnalytics automatically migrates data from the memory store to the magnetic store as it ages.",
    "The migration is invisible to applications—queries retrieve data from whichever tier holds it.",
    "No ETL jobs, export pipelines or custom migration code are required.",
    "Automatic tiering aligns data storage cost with access frequency: recent data in fast storage, history in cheap storage.",
    "A single SQL query can span both the memory store and magnetic store and return a unified result.",
    "The timing of migration is controlled by the memory-store retention period configured on the table."
  ],
  "commonMistake": "Building a separate AWS Glue or Lambda pipeline to move ageing Timestream records from a memory-heavy table to an S3 data lake because the team was not aware that Timestream automatically tiers data to the magnetic store. This creates duplicated engineering effort and risks data inconsistency between the two copies.",
  "example": "After configuring memory-store retention of 24 hours, the following Timestream SQL query transparently retrieves both in-memory and magnetic-store data for a 7-day lookback: SELECT bin(time, 1h) AS hour_bucket, avg(measure_value::double) AS avg_temp FROM sensors.temperature WHERE time > ago(7d) AND measure_name = 'temp_c' GROUP BY bin(time, 1h) ORDER BY hour_bucket DESC.",
  "sources": [
    {
      "title": "Storage in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/storage.html"
    },
    {
      "title": "Amazon Timestream for LiveAnalytics – Data Retention",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/data-retention.html"
    }
  ]
});
