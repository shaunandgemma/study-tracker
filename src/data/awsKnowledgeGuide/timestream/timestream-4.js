import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-4",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Tables and Time-Series Records",
  "plainEnglish": "In Amazon Timestream for LiveAnalytics, data is organised into databases and tables. A database is a logical container for related tables, similar in concept to a schema in a relational database. A table holds time-series records. Each record represents a single measurement observation and must contain a precise timestamp, one or more dimensions and one or more measures. Dimensions describe the identity and context of the source (for example, which device sent the reading, which location it came from, which environment it belongs to). Measures contain the actual numeric or string values being recorded (for example, temperature, pressure or error count).",
  "whyItMatters": "Understanding the record model is essential for designing a Timestream schema that queries efficiently and scales economically. Poorly chosen dimensions that contain highly variable values (such as a request UUID or a session ID) can create an enormous number of distinct time series, slowing queries and increasing costs. Correctly identifying stable, low-cardinality descriptors as dimensions and recording variable measured quantities as measure values leads to a schema that performs predictably at scale.",
  "workplaceExample": "A logistics company tracks its delivery fleet. Each GPS reading is a record. The fleet manager chooses vehicle_id, region and vehicle_type as dimensions (stable, low-cardinality identifiers) and uses measure names such as latitude, longitude, speed_kmh and fuel_percent as measure values that change with every observation. They group all four measures together in a multi-measure record per GPS ping, reducing the number of write API calls and keeping related measurements on the same time-series row.",
  "examFocus": "Understand the Timestream for LiveAnalytics record model: (1) Dimensions: Metadata attributes that identify a time series—device ID, region, environment. Dimensions should be low-cardinality and stable. (2) Measures: The measured values—temperature, CPU percent, error count. Measures hold the actual data being collected. (3) Single-Measure vs Multi-Measure Records: A single-measure record stores one measure per row. A multi-measure record stores multiple related measure values in one row, reducing API calls and improving query efficiency. (4) Timestamps: Every record must include a timestamp in epoch milliseconds, microseconds or nanoseconds.",
  "keyPoints": [
    "Timestream for LiveAnalytics organises data into databases, which are logical containers for tables.",
    "Every record must include a timestamp, at least one dimension and at least one measure.",
    "Dimensions identify the source of a measurement and should be low-cardinality, stable attributes.",
    "Measures contain the actual observed values and support DOUBLE, BIGINT, BOOLEAN, VARCHAR and TIMESTAMP types.",
    "Multi-measure records group several related measure values into a single record, improving write efficiency.",
    "High-cardinality dimensions such as session IDs or request UUIDs can degrade query performance and increase cost."
  ],
  "commonMistake": "Storing a unique identifier such as a transaction ID or a request UUID as a dimension. Because dimensions define the identity of a time series, using a unique value per record creates a new time series for every observation. This explodes cardinality and causes poor query performance and unpredictably high storage costs.",
  "example": "A multi-measure record for a factory sensor written via the SDK might include dimensions {machine_id: 'CNC-042', plant: 'Berlin'} and measure values {spindle_rpm: 2400.0, bearing_temp_c: 78.3, vibration_g: 0.12} all associated with the same millisecond timestamp—one API write for three measurements.",
  "sources": [
    {
      "title": "Amazon Timestream for LiveAnalytics Concepts",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/concepts.html"
    },
    {
      "title": "Multi-Measure Records in Amazon Timestream for LiveAnalytics",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/writes.html"
    }
  ]
});
