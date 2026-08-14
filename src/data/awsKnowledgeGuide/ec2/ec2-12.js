import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-12',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'Accelerated Computing Instances',
  status: 'ready',
  plainEnglish: 'Accelerated Computing Instances (such as P4, G5, F1, Trn1, Inf2) use hardware accelerators—such as GPUs (Graphics Processing Units), AWS Trainium, AWS Inferentia, or FPGAs—to perform complex mathematical calculations far more efficiently than standard CPUs. They are designed for machine learning model training, generative AI inference, 3D graphics rendering, and seismic analysis.',
  whyItMatters: 'Training large language models or rendering 3D graphics on standard CPUs is impractically slow and expensive. Hardware accelerators parallelize matrix multiplication and vector calculations, speeding up computations by up to 100x.',
  workplaceExample: 'An AI research institute launches P4d.24xlarge instances equipped with 8 NVIDIA A100 GPUs to train a custom computer vision model on millions of medical X-ray images in 6 hours instead of 3 weeks.',
  examFocus: 'SAA-C03 keyword triggers for Accelerated Computing (P / G / Trn / Inf family):\n- "Machine Learning (ML) model training / Deep Learning" -> P-series / Trn1.\n- "Graphics rendering / 3D spatial streaming / Video game streaming" -> G-series.\n- "Low-cost Machine Learning Inference" -> Inf1 / Inf2.\n- "Hardware acceleration / GPU parallel processing"',
  keyPoints: [
    'Uses GPUs, AWS Trainium, AWS Inferentia, or FPGAs for massive parallel processing.',
    'P-series (P3, P4, P5): High-performance GPU instances for ML training.',
    'G-series (G4, G5): GPU instances optimized for graphics rendering and ML inference.',
    'Trn1 / Inf2: Custom AWS silicon for cost-effective ML training and inference.',
    'Dramatically accelerates floating-point calculations and matrix operations.'
  ],
  commonMistake: 'Selecting high-cost GPU (P4) instances for simple web server hosting or standard SQL databases. Standard CPUs handle sequential application code much more economically.',
  example: 'Accelerated Instance Spec:\n`g5.2xlarge` -> 1 NVIDIA A10G GPU, 24 GB GPU memory, 8 vCPUs, 32 GiB RAM.\nUsage: Cloud-based 3D CAD rendering workstation.',
  sources: [
    { title: 'Amazon EC2 Instance Types - Accelerated Computing', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html' }
  ]
});
