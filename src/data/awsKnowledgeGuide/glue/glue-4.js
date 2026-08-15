import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-4',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Serverless Data Integration',
  status: 'ready',
  plainEnglish: 'AWS Glue is a fully managed, serverless data integration service that makes it easy to discover, prepare, transform, and integrate data from multiple sources for analytics, machine learning, and application development. Because AWS Glue is serverless, AWS automatically provisions, configures, and scales the underlying compute resources (Data Processing Units, or DPUs) required to run your data pipelines.',
  whyItMatters: 'Traditional Extract, Transform, and Load (ETL) processing required provisioning, patching, and tuning dedicated Hadoop or Spark server clusters 24/7. AWS Glue eliminates infrastructure management, scaling compute on demand and charging only for the exact seconds your ETL jobs run.',
  workplaceExample: 'An enterprise receives nightly raw CSV sales files into Amazon S3 from 500 retail stores. Instead of managing a permanent EC2 Spark cluster, they run a serverless AWS Glue ETL job that spins up, converts CSVs into compressed Apache Parquet format, and shuts down automatically.',
  examFocus: 'SAA-C03 Core Concept for AWS Glue:\n- Fully managed, serverless ETL and data integration service.\n- Key Components: Glue Data Catalog (centralized metadata index), Crawlers (automated schema discovery), and ETL Jobs (Apache Spark or Python execution engines).\n- Pricing Model: Measured in Data Processing Units (DPUs) billed per second with a 1-minute minimum.',
  keyPoints: [
    'Fully managed, serverless data integration and ETL service.',
    'Eliminates infrastructure provisioning, server management, and cluster tuning.',
    'Consists of Data Catalog, Crawlers, ETL Jobs, Workflows, and DataBrew.',
    'Billed by Data Processing Unit (DPU) hours in 1-second increments.',
    'Integrates natively with Amazon S3, Redshift, RDS, Athena, and Lake Formation.'
  ],
  commonMistake: 'Assuming AWS Glue is strictly a data crawler or database engine. Glue is an end-to-end serverless data integration service encompassing cataloging, data discovery, transformation processing, and workflow orchestration.',
  example: 'Starting a Glue Serverless ETL Job via AWS CLI:\n`aws glue start-job-run --job-name s3-to-parquet-transformer --arguments \'{"--JOB_NAME":"s3-to-parquet-transformer"}\'`',
  sources: [
    { title: 'What is AWS Glue?', url: 'https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html' }
  ]
});
