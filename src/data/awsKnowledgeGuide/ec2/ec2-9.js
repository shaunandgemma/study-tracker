import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-9',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'Compute Optimized Instances',
  status: 'ready',
  plainEnglish: 'Compute Optimized Instances (such as C6i, C6g, C7g) are virtual servers engineered to deliver high compute performance per vCPU. They feature high processor-to-memory ratios (typically 2 GiB of RAM per vCPU) and ultra-fast clock speeds. They are built for workloads that require heavy processing power without needing vast amounts of RAM.',
  whyItMatters: 'Applications requiring intense calculation (like high-performance computing, video encoding, gaming servers, or batch processing) process data significantly faster on C-family instances at a lower cost than over-provisioning general purpose instances.',
  workplaceExample: 'A video streaming platform uses C6g.4xlarge instances to transcode user-uploaded 4K videos into multiple streaming resolutions. The high CPU clock speed reduces video processing time from 30 minutes to 4 minutes.',
  examFocus: 'SAA-C03 keyword triggers for Compute Optimized (C-family):\n- "High-performance computing (HPC)"\n- "Batch processing / Scientific modeling"\n- "Media transcoding / Video encoding"\n- "Gaming dedicated servers / Ad serving engines"\n- "High CPU-to-memory ratio"',
  keyPoints: [
    'Optimized for compute-bound applications requiring high CPU performance.',
    'High vCPU-to-RAM ratio (typically 2 GiB RAM per vCPU).',
    'Powered by fast Intel Xeon, AMD EPYC, or AWS Graviton processors.',
    'Ideal for batch processing, media encoding, HPC, and gaming servers.',
    'Delivers maximum raw processing power per dollar spent.'
  ],
  commonMistake: 'Selecting a Compute Optimized (C) instance for an in-memory database like Redis. Redis will run out of memory quickly because C instances provide relatively low RAM relative to vCPUs.',
  example: 'Compute Optimized Instance Spec:\n`c6g.2xlarge` -> 8 vCPUs, 16 GiB RAM (2:1 RAM to vCPU ratio).\nUsage: Distributed batch calculation worker processing mathematical formulas.',
  sources: [
    { title: 'Amazon EC2 Instance Types - Compute Optimized', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html' }
  ]
});
