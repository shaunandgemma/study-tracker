import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-11",
  "title": "Edge Computing on Snow Devices",
  "plainEnglish": "Edge Computing on AWS Snow Family devices enables organizations to deploy cloud applications, containerized microservices, and virtualization infrastructure directly to edge environments where physical space, power, and internet connectivity are severely constrained. By running local Amazon EC2-compatible compute instances and local storage APIs on physical Snowcone and Snowball Edge devices, organizations execute data processing, telemetry aggregation, and machine learning models at the source of data generation.",
  "whyItMatters": "Transmitting raw sensor telemetry, 4K camera streams, or medical imaging from remote field sites over satellite links causes extreme latency and massive bandwidth bills. Edge computing on Snow devices allows local systems to filter, aggregate, compress, and analyze data on-site, storing only refined insights and actionable alerts for transmission.",
  "workplaceExample": "A smart mining facility deploys three AWS Snowball Edge devices in an on-site control trailer. Connected to hundreds of underground rock-drill sensors and temperature monitors, local EC2 instances run real-time telemetry analytics and anomaly detection models. The system alerts mining engineers of seismic risks in under 5 milliseconds, completely unaffected by surface satellite internet outages.",
  "examFocus": "Understand Edge Computing architecture and device options: (1) Local Storage APIs: Devices provide local Amazon S3-compatible object storage and local EBS-compatible block storage. (2) Virtualization: Run Amazon EC2-compatible AMIs created in AWS and pre-loaded during job provisioning. (3) Clustering: Connect 5 to 16 Snowball Edge Storage Optimized devices together in a local subnet to create a scalable, fault-tolerant local storage and compute cluster. (4) Edge Monitoring: Monitor hardware health, CPU, and storage capacity using AWS OpsHub.",
  "keyPoints": [
    "Brings AWS compute, storage, and container capabilities directly to remote edge environments.",
    "Eliminates latency and bandwidth bottlenecks by processing data locally at the source.",
    "Provides local S3-compatible REST API endpoints and local EBS block storage volumes.",
    "Supports local device clustering (5 to 16 devices) for high availability and shared storage.",
    "Operates in fully air-gapped, zero-connectivity environments with no continuous cloud dependency.",
    "Managed and monitored locally using the graphical AWS OpsHub desktop application."
  ],
  "commonMistake": "Assuming edge computing on Snow devices requires periodic internet connectivity to keep running. Snow devices are built for complete offline resilience and can run local EC2 instances and local storage indefinitely without ever contacting AWS cloud endpoints.",
  "example": "Inspect local compute capacity and active EC2 instances on a Snow device using the Snowball CLI: snowballEdge describe-service --service-id ec2 --endpoint https://192.168.1.50.",
  "sources": [
    {
      "title": "Edge Computing with AWS Snowball Edge",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/edge-computing.html"
    },
    {
      "title": "Using S3 Storage and EC2 Compute Clusters on Snowball Edge",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/using-clustering.html"
    }
  ]
});
