import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-47',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Enhanced Networking',
  status: 'ready',
  plainEnglish: 'EC2 Enhanced Networking provides higher packet-per-second (PPS) performance, lower network jitter, and lower latency by utilizing Single Root I/O Virtualization (SR-IOV) hardware capabilities on supported instance types. It bypasses the traditional virtual hypervisor network stack, connecting the virtual machine directly to the physical network card.',
  whyItMatters: 'High-performance computing (HPC), financial trading systems, and high-throughput database clusters can saturate standard virtual network drivers. Enhanced Networking unlocks speeds up to 100 Gbps or 200 Gbps with minimal CPU overhead.',
  workplaceExample: 'A high-frequency trading firm deploys C6gn instances with Elastic Network Adapter (ENA) Enhanced Networking enabled. Inter-node network latency drops below 10 microseconds, enabling instant trade order execution.',
  examFocus: 'SAA-C03 Enhanced Networking Drivers:\n- ENA (Elastic Network Adapter): Supports speeds up to 100 Gbps / 200 Gbps. Standard choice for all modern EC2 instance families.\n- VFIO / Intel IXGBE VF: Legacy 10 Gbps driver for older instance types (e.g. C3, R3, I2).\n- EFA (Elastic Fabric Adapter): Specialized network interface with OS-bypass capability for High-Performance Computing (HPC) and MPI inter-node communication.',
  keyPoints: [
    'Uses SR-IOV hardware virtualization for high packet-per-second performance and low latency.',
    'ENA (Elastic Network Adapter): Modern standard supporting up to 100/200 Gbps.',
    'IXGBE VF: Legacy 10 Gbps driver for older generation instances.',
    'Elastic Fabric Adapter (EFA): Specialized driver for HPC and MPI parallel computing.',
    'Reduces CPU overhead associated with network virtualization.'
  ],
  commonMistake: 'Confusing ENA (standard Enhanced Networking for high bandwidth) with EFA (Elastic Fabric Adapter for HPC/MPI node-to-node communication).',
  example: 'Verifying ENA Module inside Linux OS:\n`modinfo ena`\n`ethtool -i eth0` -> `driver: ena`',
  sources: [
    { title: 'Enhanced networking on Linux', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/enhanced-networking.html' }
  ]
});
