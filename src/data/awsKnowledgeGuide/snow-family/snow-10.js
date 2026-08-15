import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-10",
  "title": "Snowball Edge Compute Optimized",
  "plainEnglish": "AWS Snowball Edge Compute Optimized is a ruggedized edge computing device designed for computationally demanding workloads in disconnected, remote, or harsh field environments. Equipped with 104 virtual CPUs (vCPUs), 416 GB of memory, up to 42 TB of usable NVMe storage, and an optional onboard NVIDIA GPU accelerator, Compute Optimized devices provide datacenter-class computational power directly at the tactical edge.",
  "whyItMatters": "Edge environments like military reconnaissance aircraft, autonomous mining vehicles, smart factories, and offshore oil platforms generate high-speed video streams and sensor data that require immediate machine learning inference, computer vision analysis, and real-time video transcoding without latency or dependency on cloud network connectivity.",
  "workplaceExample": "An aerospace engineering company conducts airborne flight tests over remote mountain ranges. They mount an AWS Snowball Edge Compute Optimized with GPU inside the test aircraft. During 8-hour test flights, the device runs local Amazon EC2 instances with PyTorch to analyze real-time aerodynamic sensor telemetry and 4K optical camera streams, highlighting wing turbulence anomalies instantly on the flight engineer's console.",
  "examFocus": "Understand Snowball Edge Compute Optimized hardware and use cases: (1) Compute Specs: 104 vCPUs, 416 GB RAM. (2) GPU Option: Available with an optional NVIDIA GPU accelerator for deep learning inference and hardware-accelerated video rendering. (3) Storage: 28 TB to 42 TB usable NVMe/HDD storage. (4) Ideal Use Cases: Real-time video processing, AI/ML inference at the edge, industrial IoT analytics, advanced simulations, and local virtualization in disconnected environments.",
  "keyPoints": [
    "High-performance edge computing appliance designed for intense computational workloads.",
    "Equipped with 104 vCPUs and 416 GB RAM for local virtualization and container processing.",
    "Optional NVIDIA GPU accelerator supports real-time AI/ML inference and computer vision.",
    "Provides 28 TB to 42 TB of high-speed local NVMe/HDD block and object storage.",
    "Operates completely independently in air-gapped, remote, or disconnected environments.",
    "Runs Amazon EC2-compatible instance types (`sbe-c` compute, `sbe-g` GPU-accelerated)."
  ],
  "commonMistake": "Selecting a Compute Optimized device for simple, large-scale storage migration where no local compute is needed. Compute Optimized provides less storage capacity (28–42 TB) at a higher cost; use Storage Optimized (80–210 TB) for pure data migrations.",
  "example": "Launch a GPU-accelerated Amazon EC2 instance on a Snowball Edge Compute Optimized device: aws ec2 run-instances --image-id sbi-gpu-image-1 --instance-type sbe-g.4xlarge --endpoint-url http://192.168.1.100:8008.",
  "sources": [
    {
      "title": "AWS Snowball Edge Compute Optimized Specifications",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/device-differences.html"
    },
    {
      "title": "Edge Computing and Machine Learning on Snowball Edge",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/edge-computing.html"
    }
  ]
});
