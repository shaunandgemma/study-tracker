import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-20',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect vs Site-to-Site VPN',
  status: 'ready',
  plainEnglish: 'AWS Direct Connect and AWS Site-to-Site VPN are the two main options for connecting on-premises networks to AWS, but they cater to different requirements:\n- AWS Site-to-Site VPN establishes an encrypted IPsec tunnel OVER THE PUBLIC INTERNET. It can be set up in minutes at low cost, but network latency and throughput depend on public internet conditions.\n- AWS Direct Connect establishes a DEDICATED PRIVATE PHYSICAL CONNECTION. It takes days or weeks to provision and costs more, but delivers high, predictable bandwidth, ultra-low latency, and reduced data transfer out charges.',
  whyItMatters: 'Choosing between VPN and Direct Connect involves balancing cost, setup speed, performance predictability, and bandwidth needs. Often, organizations use both: Direct Connect as the primary link and Site-to-Site VPN as a low-cost backup.',
  workplaceExample: 'A retail company uses Site-to-Site VPN to connect 50 small branch stores to AWS quickly and cheaply. For their central corporate data center processing millions of daily transactions, they install a 10 Gbps AWS Direct Connect link with a VPN backup.',
  examFocus: 'SAA-C03 Decision Matrix:\n- Quick setup (minutes), low cost, encryption included, variable internet performance -> AWS Site-to-Site VPN.\n- High throughput (1G-100G), ultra-low latency, predictable performance, large data transfers, cost savings on high volume DTO -> AWS Direct Connect.\n- Maximum cost-effective availability -> Direct Connect (Primary) + Site-to-Site VPN (Backup).',
  keyPoints: [
    'Site-to-Site VPN: Runs over public internet, fast setup, IPsec encrypted, variable latency.',
    'Direct Connect: Dedicated private link, longer setup, unencrypted by default, predictable performance.',
    'Direct Connect significantly lowers Data Transfer Out (DTO) charges for heavy traffic.',
    'VPN is ideal for low-bandwidth branch offices or quick temporary connections.',
    'Combining DX (Primary) and VPN (Backup) is a standard AWS high-availability design pattern.'
  ],
  commonMistake: 'Choosing Site-to-Site VPN for a workload transferring hundreds of terabytes daily. While cheap to set up, internet volatility and high standard internet data transfer fees make Direct Connect the superior choice for high volumes.',
  example: 'Comparison Summary:\nVPN: Setup Time = 30 mins | Bandwidth = Up to 1.25 Gbps per tunnel | Path = Public Internet\nDirect Connect: Setup Time = Days/Weeks | Bandwidth = 50 Mbps to 100 Gbps | Path = Private Dedicated Fiber.',
  sources: [
    { title: 'What is AWS Direct Connect?', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' }
  ]
});
