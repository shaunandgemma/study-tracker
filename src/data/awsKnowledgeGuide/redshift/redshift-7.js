import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-7',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Columnar Storage',
  status: 'ready',
  plainEnglish: 'Columnar Storage organises database table data sequentially by column on physical disk, rather than by row (which is used in traditional OLTP relational databases). Because analytical queries typically calculate aggregations over a few specific columns across millions of rows (e.g. `SUM(sales)`), columnar storage reads ONLY the required columns from disk, dramatically reducing disk I/O.',
  whyItMatters: 'Reading an entire row of 50 columns when an analytical query only needs 2 columns wastes 96% of disk bandwidth. Columnar storage skips unneeded columns completely and allows superior data compression because values in a single column share identical data types.',
  workplaceExample: 'A financial report queries total revenue from a 100-column table containing 500 million orders. In a row-based database, disk heads scan all 100 columns. In Redshift columnar storage, only the `order_date` and `revenue` column data blocks are read from disk.',
  examFocus: 'SAA-C03 Columnar Storage Advantages:\n- Reduced I/O: Only reads columns referenced in the SQL `SELECT` and `WHERE` clauses.\n- Data Compression Encodings: Applies specialized column-level compression (AZ64, LZO, ZSTD) to reduce storage footprint by 3x-5x.\n- Zone Maps: In-memory block metadata tracking MIN/MAX values per column block to skip irrelevant disk blocks.',
  keyPoints: [
    'Stores data sequentially by column on physical disk blocks instead of by row.',
    'Eliminates unneeded disk I/O by reading only query-referenced columns.',
    'Enables high compression ratios because column values share identical data types.',
    'Uses column-level compression encodings like AZ64, ZSTD, and LZO.',
    'Zone maps skip disk block reads based on column minimum and maximum value ranges.'
  ],
  commonMistake: 'Executing `SELECT *` in Redshift analytical queries. `SELECT *` forces Redshift to fetch every column block from disk, negating columnar I/O benefits.',
  example: 'Defining Column Compression Encodings in DDL:\nCREATE TABLE sales_fact (\n  order_id INT ENCODING raw,\n  order_date DATE ENCODING az64,\n  amount NUMERIC(10,2) ENCODING az64\n);',
  sources: [
    { title: 'Columnar storage in Amazon Redshift', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c_columnar_storage_disk_mem_mgfmt.html' }
  ]
});
