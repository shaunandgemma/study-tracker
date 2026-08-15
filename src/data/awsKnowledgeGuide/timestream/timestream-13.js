import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "timestream-13",
  "topicId": "topic-timestream",
  "topicTitle": "Amazon Timestream",
  "objectiveCode": "Databases",
  "status": "ready",
  "title": "Timestream Use Cases - IoT, DevOps and Application Metrics",
  "plainEnglish": "Amazon Timestream for LiveAnalytics is designed for three categories of workloads where measurements are continuously generated in time-stamped sequences: (1) Internet of Things (IoT)—sensors in factories, vehicles, buildings, farms and wearable devices that report physical conditions such as temperature, pressure, vibration and GPS location every few seconds; (2) DevOps and infrastructure monitoring—servers, containers and network devices that emit CPU utilisation, memory consumption, disk I/O and error rates as continuous metrics; and (3) Application performance monitoring—web services and APIs that record request latency, error rates, transaction volumes and user session durations as time-stamped events.",
  "whyItMatters": "Each of these workload categories shares a core challenge: data arrives continuously at high volume, queries are almost always time-bounded ('over the last hour' or 'between these two dates'), and the most recent data is queried far more frequently than older history. A purpose-built time-series database handles these patterns more efficiently than a relational database or a general-purpose NoSQL store by ordering storage by time, by providing native time-series query functions and by automatically tiering hot data to fast storage and cold data to cheap storage.",
  "workplaceExample": "A cloud-native logistics company collects three distinct streams: (1) 3,000 warehouse temperature sensors emit readings every 30 seconds for cold-chain compliance monitoring (IoT), (2) A fleet of 200 Kubernetes nodes sends CPU, memory and pod restart counts every 15 seconds to a Timestream table used by a Grafana DevOps dashboard (infrastructure metrics), and (3) The company's order-tracking API records response time and HTTP status codes per request to a third table used for SLA breach alerting (application metrics). All three datasets live in the same Timestream service under separate databases and tables, with different retention policies appropriate to each stream.",
  "examFocus": "Recognise Timestream for LiveAnalytics use cases for the SAA-C03 exam: (1) IoT Sensor Data: Continuous readings from physical devices at high write rates with time-range analytical queries. (2) DevOps Metrics: Infrastructure and container metrics ingested every few seconds, queried for dashboards and alerts. (3) Application Performance Monitoring (APM): Latency, throughput and error-rate tracking for APIs and microservices. (4) Differentiation from CloudWatch: Timestream is appropriate when you need custom analytical SQL queries, long-term historical retention beyond CloudWatch's default limits, or the ability to store business-domain time-series data that is not infrastructure-level metrics.",
  "keyPoints": [
    "Timestream for LiveAnalytics is purpose-built for IoT, infrastructure monitoring and application performance workloads.",
    "IoT workloads generate continuous, high-volume timestamped sensor readings from physical devices.",
    "DevOps monitoring ingests server, container and network metrics for real-time and historical dashboards.",
    "Application performance monitoring tracks API latency, error rates and throughput over time.",
    "Multiple use-case streams can coexist in separate Timestream databases and tables within the same account.",
    "Timestream complements CloudWatch for workloads requiring custom SQL analytics or business-domain time-series storage."
  ],
  "commonMistake": "Routing all operational metrics—both AWS infrastructure metrics and custom application business metrics—exclusively through Amazon CloudWatch, then discovering that CloudWatch's retention limits, query capabilities and per-metric pricing are not suited to multi-year custom analytical workloads. Custom application time-series data with long retention requirements and complex SQL analytics is better suited to Timestream for LiveAnalytics.",
  "example": "A building automation system writes HVAC sensor data to Timestream using the WriteRecords API, passing dimensions {building_id: 'HQ-East', floor: '4', zone: 'Conference'} with measure_name 'temperature_c' and measure_value 21.3 every 60 seconds. Engineers then query weekly temperature trends across all floors using Timestream SQL with a 7-day lookback and bin() aggregation.",
  "sources": [
    {
      "title": "What is Amazon Timestream for LiveAnalytics?",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/what-is-timestream.html"
    },
    {
      "title": "Amazon Timestream for LiveAnalytics Use Cases",
      "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/getting-started.html"
    }
  ]
});
