import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ts-2",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Built-in Time-Series SQL Analytics Functions (Smoothing, Interpolation, Rate of Change)",
  "plainEnglish": "Amazon Timestream for LiveAnalytics provides a purpose-built SQL dialect that includes time-series-specific analytical functions not found in general-purpose relational databases. These functions operate on ordered sequences of timestamped measurements and can smooth out noisy sensor readings, fill in gaps where data was not recorded (interpolation), calculate how quickly a value is changing over time (rate of change), aggregate data into fixed time intervals (binning), and compute rolling averages across a sliding window of observations.",
  "whyItMatters": "Raw sensor and telemetry data is often noisy, irregular and incomplete. A temperature sensor may report a brief spike caused by a hardware glitch, or a network outage may cause several minutes of missing readings. General-purpose SQL databases require complex self-joins, window frame expressions and custom user-defined functions to perform these analyses. Timestream's built-in time-series functions express the same operations in compact, readable SQL that executes efficiently over the two-tier storage architecture.",
  "workplaceExample": "A manufacturing plant monitors motor vibration across 500 CNC machines. The vibration sensor on one machine occasionally misses a reading due to a brief Wi-Fi dropout. The operations team writes a Timestream SQL query using the `INTERPOLATE_LINEAR` function to fill in the missing data points, then applies a `bin()` time-bucket aggregation to compute the average vibration per 5-minute window, and finally uses `DERIVATIVE` to detect when vibration is increasing faster than a safe threshold, triggering a maintenance alert before the motor fails.",
  "examFocus": "Understand Timestream's time-series SQL capabilities for the SAA-C03 exam: (1) Binning: The `bin(time, interval)` function groups rows into fixed-duration time buckets for computing period averages, sums and counts. (2) Interpolation: Functions such as `INTERPOLATE_LINEAR` fill gaps where data points are missing so downstream calculations remain continuous. (3) Smoothing: Aggregation within a sliding window reduces noise from individual sensor spikes. (4) Rate of Change: The `DERIVATIVE` function computes how fast a measurement changes between consecutive samples, useful for detecting sudden equipment failures.",
  "keyPoints": [
    "Timestream for LiveAnalytics includes SQL functions specifically designed for time-ordered data analysis.",
    "The `bin()` function groups timestamped rows into fixed-duration time buckets for period aggregation.",
    "Interpolation functions such as `INTERPOLATE_LINEAR` fill gaps where sensor readings are absent.",
    "The `DERIVATIVE` function measures the rate of change between consecutive time-series data points.",
    "These functions are executed on the Timestream query engine and do not require custom application code.",
    "Time-series SQL queries can span both the memory store and magnetic store in a single statement."
  ],
  "commonMistake": "Attempting to replicate time-series analytical queries in a general-purpose relational database using complex multi-level subqueries or self-joins when Timestream's purpose-built functions express the same logic more simply and execute more efficiently against time-ordered storage.",
  "example": "Compute the average CPU utilisation in 5-minute intervals over the past hour using Timestream SQL binning: SELECT bin(time, 5m) AS interval, avg(measure_value::double) AS avg_cpu FROM DeviceMetrics.CpuUtilization WHERE time > ago(1h) AND measure_name = 'cpu_percent' GROUP BY bin(time, 5m) ORDER BY interval DESC.",
  "sources": [
    {
      "title": "Time-Series Functions in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/timeseries-specific-constructs.functions.html"
    },
    {
      "title": "Querying Data in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/querying.html"
    }
  ]
});
