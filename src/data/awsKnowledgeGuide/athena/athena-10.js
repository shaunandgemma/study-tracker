import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "athena-10",
  "topicId": "topic-athena",
  "topicTitle": "Amazon Athena",
  "objectiveCode": "Analytics",
  "title": "Compression",
  "status": "ready",
  "plainEnglish": "Compression is the process of encoding data files to reduce their physical file size in Amazon S3. Amazon Athena natively supports querying compressed data files in formats such as Snappy, GZIP, ZSTD, BZIP2, and LZO. When data in S3 is compressed, Athena reads the smaller compressed bytes over the network and decompresses them in memory on the fly during query execution.",
  "whyItMatters": "Compressing data reduces both S3 storage costs and Athena query costs. Because Athena pricing is calculated based on the number of bytes scanned from S3, compressing a 100 GB log file down to 20 GB using GZIP or Snappy instantly cuts your Athena query costs by 80% and accelerates data transfer speeds.",
  "workplaceExample": "An application generates 500 GB of web server logs daily. The team configures Amazon Kinesis Data Firehose to compress incoming logs with Snappy before writing them to Amazon S3 in Parquet format. Athena queries run 4x faster and monthly S3/Athena expenses drop significantly.",
  "examFocus": "For SAA-C03, compression (especially Snappy with Parquet, or GZIP with CSV/JSON) is a standard recommendation to reduce data scanned and lower Athena costs. Remember that splittable compression formats (like BZIP2, or Snappy with Parquet) allow Athena to process large files in parallel across multiple workers.",
  "keyPoints": [
    "Compressing data in S3 reduces physical storage size and network I/O during queries.",
    "Athena billing is based on bytes scanned; smaller compressed files directly reduce query costs.",
    "Supported compression algorithms include Snappy, GZIP, ZSTD, BZIP2, and Deflate.",
    "Parquet format commonly uses Snappy or ZSTD compression by default.",
    "Splittable compression formats enable distributed, parallel query processing for large files."
  ],
  "commonMistake": "Querying massive uncompressed text files in S3. Compressing files with GZIP or converting to Snappy-compressed Parquet provides immediate 60–80% cost savings on every Athena query.",
  "example": "CREATE EXTERNAL TABLE compressed_web_traffic (\n  ip STRING,\n  request STRING,\n  status INT\n)\nROW FORMAT DELIMITED\nFIELDS TERMINATED BY '\\t'\nSTORED AS TEXTFILE\nLOCATION 's3://company-logs-bucket/gzip-traffic/'\nTBLPROPERTIES ('has_encrypted_data'='false');",
  "sources": [
    {
      "title": "Athena Compression Support",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/compression-support.html"
    },
    {
      "title": "Performance Tuning: Compressing Data",
      "url": "https://docs.aws.amazon.com/athena/latest/ug/top-10-performance-tuning-tips.html#performance-tuning-compress"
    }
  ]
});
