import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'fsx-29',
  topicId: 'topic-fsx',
  topicTitle: 'Amazon FSx',
  objectiveCode: 'Storage',
  title: 'FSx Encryption in Transit',
  status: 'ready',
  plainEnglish: 'Amazon FSx supports Encryption in Transit to protect file data while it travels across network connections between your compute instances (EC2, ECS, EKS) and FSx file servers. Network data is encrypted automatically using protocol-level encryption (such as SMB 3.0+ AES-256-GCM encryption on FSx for Windows/ONTAP, TLS 1.3 on OpenZFS/Lustre, or Kerberos in-transit encryption).',
  whyItMatters: 'Unencrypted network traffic passing over VPC subnets or VPN connections is vulnerable to packet sniffing. Encryption in transit ensures that sensitive file contents remain secure without requiring manual IPSec VPN tunnels.',
  workplaceExample: 'A financial app accesses FSx for Windows over a VPC peering connection. The connection uses SMB 3.1.1 AES-256-GCM encryption in transit, protecting credit card payload files in transit without network performance loss.',
  examFocus: 'SAA-C03 Transit Encryption Mechanisms:\n- Supported natively across supported FSx file system families.\n- FSx for Windows & ONTAP: Built-in SMB 3.0+ encryption (AES-128-GCM / AES-256-GCM).\n- FSx for OpenZFS & Lustre: Supported via TLS / Kerberos / in-transit network encryption.\n- Enforced at client mount time or via file system parameter settings.',
  keyPoints: [
    'Encrypts file data in transit across network connections.',
    'Uses native protocol encryption (SMB 3.0+ AES-256-GCM, TLS, Kerberos).',
    'Protects data traversing VPC subnets, AWS Direct Connect, and VPNs.',
    'Eliminates the complexity of building custom IPSec encryption tunnels.',
    'Satisfies enterprise security compliance for data-in-transit.'
  ],
  commonMistake: 'Disabling SMB encryption in client mount flags when accessing FSx over untrusted network connections, exposing file contents to packet capture.',
  example: 'Enforcing SMB Encryption on Windows Client Mount:\n`mount -o encrypt \\\\fsx-dns-name\\share Z:`',
  sources: [
    { title: 'Data Encryption in Amazon FSx', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is-fsx-w.html' }
  ]
});
