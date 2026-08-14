import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-8',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'General Purpose Instances',
  status: 'ready',
  plainEnglish: 'General Purpose Instances (such as T4g, T3, M6g, M6i) provide a balanced ratio of compute (CPU), memory (RAM), and networking resources. They are designed for workloads that consume CPU and RAM in equal proportion, such as web servers, microservices, small databases, and code repositories.',
  whyItMatters: 'General Purpose instances are the default choice when application requirements do not skew heavily toward extreme CPU or RAM needs. They offer cost-effective, versatile compute for most standard cloud workloads.',
  workplaceExample: 'A company hosts its corporate website and internal wiki on M6i.xlarge instances (4 vCPUs, 16 GiB RAM). The balanced allocation ensures smooth handling of HTTP traffic and background database queries.',
  examFocus: 'SAA-C03 distinction between T-series and M-series:\n- T-Series (T3/T4g): Burstable performance instances. They baseline at a portion of CPU performance and accumulate CPU credits when idle. Use for low/variable traffic apps.\n- M-Series (M5/M6i/M6g): Fixed performance instances. They provide 100% full CPU performance continuously. Use for production workloads requiring steady CPU.',
  keyPoints: [
    'Balanced ratio of compute, memory, and networking.',
    'T-series (T3, T4g) are burstable instances using a CPU credit model.',
    'M-series (M5, M6i, M6g) provide fixed, non-burstable CPU capacity.',
    'Ideal for web servers, dev/test environments, and medium databases.',
    'Graviton-powered variants (T4g, M6g) offer superior price-performance.'
  ],
  commonMistake: 'Choosing T3 instances for high-load, non-stop 100% CPU batch processing. Once CPU credits are exhausted, T3 instances get throttled down to their baseline CPU percentage or incur extra charges if unlimited mode is enabled.',
  example: 'General Purpose Instance Selection:\nDev Environment -> `t4g.micro` (2 vCPUs, 1 GiB RAM, Burstable)\nProd Web Server -> `m6i.large` (2 vCPUs, 8 GiB RAM, Fixed Dedicated CPU).',
  sources: [
    { title: 'Amazon EC2 Instance Types - General Purpose', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html' }
  ]
});
