import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-10",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Time-Series Analytics",
  "plainEnglish": "Timestream for LiveAnalytics provides a SQL-based query interface specifically designed for analysing time-ordered data sequences. Unlike standard relational SQL, Timestream SQL includes built-in functions for grouping data into time buckets (called binning), computing running averages across a sliding window of observations, filling in missing data points using interpolation, detecting anomalies by computing standard deviations across a time range and calculating the rate at which a measurement is changing between samples. These capabilities are expressed as first-class SQL functions rather than complex workarounds using self-joins or application-level post-processing.",
  "whyItMatters": "Analysing time-series data requires operations that have no simple equivalent in standard SQL. Computing a 5-minute rolling average of CPU utilisation, detecting when a moving average crosses a threshold, or filling in sensor gaps for a clean dataset require multi-step subqueries and complex window frame expressions in a general-purpose database. Timestream's purpose-built analytics functions reduce these operations to compact, readable queries that execute efficiently against the columnar time-ordered storage.",
  "workplaceExample": "A gaming platform monitors server frame rates and player latency. The SRE team writes three recurring Timestream queries: (1) A binning query calculates the average frame rate per 1-minute interval across 50 game servers, (2) A windowed query detects when the rolling 10-minute average latency for a region crosses 200ms, sending an alert, and (3) An interpolation query fills in the 3-minute gap in latency readings caused by a brief collector restart, ensuring the trend chart on the executive dashboard does not show misleading flat-line gaps.",
  "examFocus": "Know the key analytical capabilities of Timestream SQL for the SAA-C03 exam: (1) bin(): Groups rows into fixed-duration time buckets, replacing GROUP BY on a timestamp column. (2) INTERPOLATE_LINEAR and related functions: Fill gaps in time series where data was not recorded. (3) Moving Averages: Compute a rolling average across a configurable time window to smooth noisy readings. (4) DERIVATIVE: Calculate the rate of change between adjacent data points, useful for detecting sudden equipment failures. (5) Scheduled Queries: Recurring queries that compute derived aggregations and write the results as new records to a destination Timestream table, pre-computing expensive analyses.",
  "keyPoints": [
    "Timestream SQL includes time-series-specific functions not available in standard relational SQL.",
    "The bin() function groups time-ordered rows into fixed-duration intervals for period aggregation.",
    "Interpolation functions fill measurement gaps to produce continuous time series for dashboards and models.",
    "DERIVATIVE computes how quickly a measured value is changing between consecutive observations.",
    "Scheduled queries run on a recurring schedule and write aggregated results to a destination table.",
    "Queries can span both the memory store and magnetic store and return a unified result transparently."
  ],
  "commonMistake": "Attempting to compute a per-minute average in Timestream by using GROUP BY on the raw timestamp column value. Raw timestamps include sub-second precision and produce one group per unique timestamp rather than per time interval; always use the bin() function to group data into meaningful time buckets.",
  "example": "Compute a 10-minute rolling average of server response time for a specific API endpoint over the past 6 hours: SELECT bin(time, 10m) AS window, avg(measure_value::double) AS avg_response_ms FROM AppMetrics.ApiLatency WHERE measure_name = 'response_ms' AND dimensions.endpoint = '/checkout' AND time > ago(6h) GROUP BY bin(time, 10m) ORDER BY window ASC.",
  "sources": [
    {
      "title": "Querying Data in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/querying.html"
    },
    {
      "title": "Time-Series Functions in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/timeseries-specific-constructs.functions.html"
    }
  ]
});
