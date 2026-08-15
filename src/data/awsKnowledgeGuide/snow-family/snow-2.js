import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-2",
  "title": "Edge Compute (Running EC2 instances & IoT Greengrass in disconnected locations)",
  "plainEnglish": "Edge Compute with AWS Snow Family allows you to run Amazon EC2-compatible virtual machines, containerized applications, and AWS IoT Greengrass edge services directly on physical Snowball Edge and Snowcone devices in remote, disconnected, or harsh physical environments where internet access is intermittent or completely unavailable. This enables real-time local data processing, machine learning inference, and data filtering at the edge before data is shipped back to AWS.",
  "whyItMatters": "Remote industrial operations—such as offshore oil platforms, oceanographic research vessels, mining sites, and battlefield medical stations—generate massive telemetry and video data that must be processed in real time without waiting for satellite internet. Snow Family edge compute provides local compute and storage infrastructure capable of surviving completely disconnected operation for weeks or months.",
  "workplaceExample": "An offshore energy company deploys an AWS Snowball Edge Compute Optimized device on a drilling rig in the North Sea. The rig runs local Amazon EC2 instances and AWS IoT Greengrass on the Snow device to analyze high-frequency acoustic sensor data in real time, detecting drill head stress anomalies within milliseconds without needing continuous satellite uplink.",
  "examFocus": "Understand Snow Family edge compute capabilities: (1) Amazon EC2 Compatible: Run custom Amazon Machine Images (AMIs) packaged as EC2-compatible instances locally on Snowball Edge and Snowcone. (2) AWS IoT Greengrass: Run serverless edge code, message brokers, and ML inference models locally. (3) Disconnected Operation: Snow devices operate continuously with zero internet connectivity; they do not require an active internet connection to execute local EC2 instances or store data locally.",
  "keyPoints": [
    "Runs local Amazon EC2-compatible virtual machines and container workloads at the edge.",
    "Supports AWS IoT Greengrass for local event messaging, sensor ingestion, and ML inference.",
    "Operates in fully disconnected environments without requiring continuous internet connectivity.",
    "Snowball Edge Compute Optimized provides up to 104 vCPUs, 416 GB RAM, and optional GPUs for intensive workloads.",
    "Snowcone provides lightweight compute (2 vCPUs, 4 GB RAM) for constrained edge environments.",
    "Allows edge filtering and preprocessing to compress and clean data before migration to the cloud."
  ],
  "commonMistake": "Assuming that edge EC2 instances running on a disconnected Snow device can make real-time API calls to AWS cloud services (like Amazon DynamoDB or cloud S3). When disconnected, the instance can only interact with local services hosted on the device (like local S3-compatible storage and local EBS-compatible block storage).",
  "example": "Launch an Amazon EC2-compatible instance locally on a Snowball Edge device using the AWS CLI: aws ec2 run-instances --image-id sbi-12345678 --instance-type sbe-c.xlarge --endpoint-url http://192.168.1.50:8008.",
  "sources": [
    {
      "title": "Using Amazon EC2 Compute Instances on AWS Snowball Edge",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/ec2-instances.html"
    },
    {
      "title": "Edge Computing with AWS Snowball Edge Overview",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/edge-computing.html"
    }
  ]
});
