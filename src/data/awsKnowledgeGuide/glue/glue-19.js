import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-19',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue vs EMR',
  status: 'ready',
  plainEnglish: 'AWS Glue and Amazon EMR (Elastic MapReduce) are both big-data processing platforms on AWS, but they target different operational models:\n- AWS Glue: A fully serverless data integration service. Best for event-driven ETL pipelines, automated data cataloging, and serverless PySpark/Scala execution without managing clusters or EC2 instances.\n- Amazon EMR: A managed cluster platform for running open-source big-data frameworks (Apache Hadoop, Spark, Presto/Trino, Flink, HBase, Hive). Best for long-running custom clusters, complex multi-framework workloads, low-level tuning, or when running non-Spark Hadoop applications.',
  whyItMatters: 'Choosing between Glue and EMR impacts operational complexity and cost. Glue minimizes operations with serverless ETL, whereas EMR provides deep control over EC2 instance types, Spot Instance strategies, custom software versions, and Hadoop ecosystem tools.',
  workplaceExample: 'An enterprise uses AWS Glue for automated nightly ETL jobs that transform S3 logs into Parquet. For a specialized 500-node persistent Presto/Trino cluster running custom Spark ML pipelines, they use Amazon EMR on EC2 Spot Instances.',
  examFocus: 'SAA-C03 Decision Matrix (Glue vs EMR):\n- AWS Glue: Serverless, zero cluster management, event-driven ETL, integrated Data Catalog & Crawlers, pay-per-second DPUs.\n- Amazon EMR: Provisioned or serverless clusters, supports full Hadoop ecosystem (HBase, Flink, Presto, Spark), deep custom cluster configuration, fine-grained Spot Instance pricing control.\n- Rule of Thumb: Choose Glue for serverless ETL; choose EMR for deep cluster control, non-Spark Hadoop apps, or massive long-running persistent clusters.',
  keyPoints: [
    'AWS Glue is fully serverless with zero cluster management overhead.',
    'Amazon EMR provides full control over Hadoop/Spark cluster configurations and EC2 instances.',
    'Glue is optimized for serverless data discovery, cataloging, and ETL pipelines.',
    'EMR supports a wider range of open-source engines (Presto/Trino, Flink, HBase, Hive).',
    'EMR on Spot Instances can offer lower costs for massive long-running cluster jobs.'
  ],
  commonMistake: 'Selecting EMR for simple periodic S3 file format conversion ETL jobs when serverless AWS Glue handles the workload with far less operational management.',
  example: 'Decision Tree:\n- "Serverless PySpark ETL converting S3 CSV to Parquet nightly" -> AWS Glue\n- "Custom persistent 100-node Presto and HBase cluster on EC2 Spot" -> Amazon EMR.',
  sources: [
    { title: 'What is AWS Glue?', url: 'https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html' }
  ]
});
