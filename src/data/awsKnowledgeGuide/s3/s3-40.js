import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-40",
  "title": "S3 Byte-Range Fetches",
  "plainEnglish": "Amazon S3 Byte-Range Fetches (using the standard HTTP `Range` request header) allows an application to download only a specific portion (byte range) of an object stored in S3 rather than downloading the entire file. By requesting specific byte segments (e.g., `bytes=0-1048575` for the first 1 MB), applications can parallelize downloads across multiple concurrent threads or query file headers and metadata without transferring gigabytes of unneeded data.",
  "whyItMatters": "Modern big data query engines (like Amazon Athena and Presto) and columnar file formats (like Apache Parquet and ORC) store metadata footers and column indexes at specific byte offsets within files. Byte-range fetches allow query engines to read only the specific columns needed for a SQL query—dramatically reducing query latency, network transfer volume, and data processing costs.",
  "workplaceExample": "A video streaming player streams a 10 GB movie from S3. Instead of forcing the user's browser to wait for the entire 10 GB file to download before starting playback, the video player issues consecutive Byte-Range GET requests (e.g., fetching 2 MB chunks on demand as playback progresses). If the user scrubs forward to minute 45, the player simply issues a Byte-Range fetch for that exact byte offset, resuming playback instantly.",
  "examFocus": "Understand S3 Byte-Range Fetch use cases: (1) Performance Optimization: Parallelize large object downloads across multiple worker threads by fetching concurrent byte ranges simultaneously. (2) Resilience: If a network connection drops mid-download, the client retries only the failed byte range. (3) Big Data & Columnar Formats: Read Parquet/ORC headers and footers without scanning the entire file. (4) HTTP Status: Returns HTTP `206 Partial Content` on success.",
  "keyPoints": [
    "Retrieves specific byte offsets of an object using the HTTP `Range` request header.",
    "Enables concurrent, multi-threaded parallel downloads of massive multi-gigabyte objects.",
    "Improves download resilience by allowing retry of only failed byte segments.",
    "Used by big data analytics tools (Athena, Redshift Spectrum) to read Parquet/ORC column chunks efficiently.",
    "Enables instant video and audio streaming with instant scrub and seek capabilities.",
    "Returns an HTTP `206 Partial Content` response with the requested byte payload."
  ],
  "commonMistake": "Downloading an entire 50 GB Parquet file into EC2 memory to inspect file metadata or read a single column. Using S3 Byte-Range Fetches allows you to read just the file footer or specific column byte ranges, saving gigabytes of bandwidth and seconds of execution time.",
  "example": "Fetch the first 1 MB (bytes 0 to 1,048,575) of an object using curl via the AWS S3 REST API: curl -H 'Range: bytes=0-1048575' https://my-bucket.s3.amazonaws.com/largefile.zip -o chunk1.bin.",
  "sources": [
    {
      "title": "Optimizing Amazon S3 Performance with Byte-Range Fetches",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html"
    },
    {
      "title": "Amazon S3 REST API: GetObject",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/RESTObjectGET.html"
    }
  ]
});
