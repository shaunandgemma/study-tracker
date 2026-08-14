import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-10",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Throughput Optimized HDD - st1",
  "status": "ready",
  "plainEnglish": "EBS Throughput Optimized HDD (st1) is a low-cost, magnetic spinning hard disk drive (HDD) volume type designed for frequently accessed, sequential, high-throughput large-block workloads. Rather than prioritizing high IOPS for small random reads/writes (which SSDs handle), st1 focuses on maximizing sequential transfer throughput (up to 500 MB/s per volume and 500 IOPS) for large datasets like big data clusters, log processing, data warehouses, and ETL pipelines.",
  "whyItMatters": "Spinning HDDs cost roughly half the price per gigabyte of SSD storage. When processing sequential big data streams (e.g. Apache Hadoop or Kafka streaming logs), throughput (MB/s) matters far more than random IOPS, making st1 an exceptionally cost-effective storage choice for high-throughput streaming systems.",
  "workplaceExample": "A data analytics team runs an Amazon EMR cluster running Apache Spark that ingests 50 TB of daily clickstream logs. They format worker nodes with 10 TB st1 volumes, achieving 500 MB/s sequential read throughput during analytics map-reduce jobs at half the cost of gp3.",
  "examFocus": "For SAA-C03, remember these key st1 rules: (1) Designed for big data, data warehousing, log processing, and sequential I/O. (2) CANNOT be used as an EC2 Root Volume (st1 cannot boot an OS). (3) Volume sizes range from 125 GiB to 16 TiB. (4) Uses a burst credit model (up to 500 MB/s burst throughput).",
  "keyPoints": [
    "Low-cost magnetic HDD volume type optimized for large sequential I/O workloads.",
    "Ideal for big data, Apache Hadoop/EMR, Kafka, log processing, and data warehouses.",
    "Throughput scales up to 500 MB/s per volume with up to 500 IOPS.",
    "CANNOT be used as an EC2 Root Volume (only SSD types gp2/gp3/io1/io2 can boot EC2).",
    "Volume size ranges from 125 GiB to 16 TiB."
  ],
  "commonMistake": "Attempting to create an EC2 instance with an `st1` root volume. Amazon EC2 requires an SSD-backed volume (gp3/gp2 or io1/io2) for root boot volumes; st1 and sc1 can only be attached as secondary data volumes.",
  "example": "# Create a 2 TB Throughput Optimized HDD (st1) volume for big data:\naws ec2 create-volume \\\n  --availability-zone us-east-1a \\\n  --size 2000 \\\n  --volume-type st1 \\\n  --encrypted",
  "sources": [
    {
      "title": "Amazon EBS Throughput Optimized HDD Volumes (st1)",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html#throughput-optimized-hdd"
    },
    {
      "title": "Amazon EBS Volume Types Summary",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html"
    }
  ]
});
