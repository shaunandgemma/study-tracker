import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-16',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Spark-Based ETL',
  status: 'ready',
  plainEnglish: 'AWS Glue Spark-Based ETL utilizes Apache Spark—a distributed in-memory data processing engine—to execute massive-scale data transformations across distributed worker nodes. AWS Glue extends standard Spark DataFrames with Glue DynamicFrames, which provide flexible schema handling for semi-structured data without requiring pre-defined static schemas.',
  whyItMatters: 'Processing petabytes of data on a single machine causes memory exhaustion. Glue Spark-Based ETL distributes data transformations across a serverless cluster of worker nodes, enabling fast processing of massive enterprise datasets.',
  workplaceExample: 'An analytics firm processes 500 million web clickstream events daily. Their Glue PySpark ETL job initializes a cluster of 20 G.2X Spark workers, reads raw JSON logs from S3 into a DynamicFrame, converts it to Apache Parquet, and writes the partitioned data back to S3 in under 15 minutes.',
  examFocus: 'SAA-C03 Spark Engine & DynamicFrames:\n- Engine: Distributed Apache Spark running on serverless Glue worker nodes.\n- DynamicFrame: AWS Glue proprietary extension to Spark DataFrames designed for dynamic, un-enforced semi-structured schemas.\n- DynamicFrame vs DataFrame: Convert between them using `.toDF()` and `DynamicFrame.fromDF()`.\n- Worker Sizing: G.1X (1 DPU), G.2X (2 DPU), G.4X (4 DPU), G.8X (8 DPU) for memory-intensive workloads.',
  keyPoints: [
    'Distributed in-memory ETL processing powered by serverless Apache Spark.',
    'Scales horizontally across worker nodes to handle petabyte-scale datasets.',
    'Uses Glue DynamicFrames for schema flexibility with nested or irregular JSON.',
    'Provides seamless conversion between Glue DynamicFrames and Spark DataFrames.',
    'Configurable worker specs (G.1X to G.8X) for memory- or compute-heavy processing.'
  ],
  commonMistake: 'Using Python Shell jobs for petabyte-scale data transformations instead of Glue Spark-Based ETL. Python Shell runs on a single node and cannot scale across a distributed cluster.',
  example: 'PySpark DynamicFrame Transformation Code:\n```python\ndynamic_frame = glueContext.create_dynamic_frame.from_catalog(database="db", table_name="raw_logs")\nclean_df = dynamic_frame.toDF().filter("status == 200")\nglueContext.write_dynamic_frame.from_options(frame=DynamicFrame.fromDF(clean_df, glueContext, "clean_df"), connection_type="s3", connection_options={"path": "s3://my-bucket/processed/"}, format="parquet")\n```',
  sources: [
    { title: 'Authoring Jobs in AWS Glue', url: 'https://docs.aws.amazon.com/glue/latest/dg/author-job.html' }
  ]
});
