import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-13",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "On-Premises to AWS Data Transfer",
  "status": "ready",
  "plainEnglish": "On-Premises to AWS Data Transfer is the primary hybrid cloud architecture of AWS DataSync. In this model, you deploy a DataSync Agent virtual appliance inside your on-premises network close to your local storage systems (NFS, SMB, HDFS, or Object Storage). The agent communicates with your local storage systems over your LAN, reads the files, compresses and encrypts the data with TLS, and transfers it over an AWS Direct Connect connection, AWS Site-to-Site VPN, or public internet into AWS cloud storage services (Amazon S3, Amazon EFS, or Amazon FSx).",
  "whyItMatters": "Transferring hundreds of terabytes or petabytes across wide area networks (WAN) is fraught with latency, dropped packets, and slow single-threaded tools. DataSync's custom protocol parallelizes transfers across multiple connections, dynamically optimizing bandwidth to saturate available network pipes without dropping files.",
  "workplaceExample": "A manufacturing enterprise migrates 1.2 PB of telemetry files from an on-premises EMC Isilon NAS to Amazon S3. They deploy 4 DataSync Agent VMs to parallelize throughput over a dedicated 10 Gbps AWS Direct Connect link, finishing the initial baseline copy in 12 days and running daily delta syncs in under 20 minutes.",
  "examFocus": "For SAA-C03, remember that on-premises to AWS transfers REQUIRE at least one DataSync Agent deployed in the customer's on-premises environment. The connection to AWS can travel over AWS Direct Connect, AWS Site-to-Site VPN, or the public Internet. For private connectivity without public IPs, use AWS PrivateLink / VPC Endpoints.",
  "keyPoints": [
    "Requires deploying a DataSync Agent virtual machine in the on-premises local network.",
    "Transfers data over AWS Direct Connect, AWS VPN, or the public Internet.",
    "Supports AWS PrivateLink (VPC Endpoints) for private data transfers without public IPs.",
    "Automatically handles parallelization, compression, encryption, and retry logic.",
    "Enables continuous, scheduled synchronization or one-time data center migrations."
  ],
  "commonMistake": "Assuming that a Direct Connect connection alone accelerates file transfers. Without an optimized protocol like DataSync's multi-threaded engine, standard tools like rsync or scp fail to utilize high-bandwidth WAN connections efficiently.",
  "example": "# Start execution of an on-premises to AWS migration task:\naws datasync start-task-execution \\\n  --task-arn arn:aws:datasync:us-east-1:123456789012:task/task-0123456789abcdef0 \\\n  --override-options '{\"BytesPerSecond\": 500000000}'",
  "sources": [
    {
      "title": "Transferring Data from On-Premises Storage to AWS",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/transfer-on-premises.html"
    },
    {
      "title": "Deploying DataSync Agent in On-Premises Environments",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/agent-deploy.html"
    }
  ]
});
