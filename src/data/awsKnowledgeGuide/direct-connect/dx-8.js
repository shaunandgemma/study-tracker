import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-8',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Hosted Connections',
  status: 'ready',
  plainEnglish: 'A Hosted Connection is an AWS Direct Connect connection provisioned and managed on your behalf by an authorized AWS Direct Connect Partner. Instead of ordering a full 1 Gbps or 10 Gbps dedicated physical port directly from AWS, an AWS Partner provisions a virtual slice of their own physical connection for you. Hosted connections support granular bandwidth capacities starting as low as 50 Mbps up to 10 Gbps, but each hosted connection supports exactly ONE Virtual Interface (VIF).',
  whyItMatters: 'Hosted Connections lower the cost and barrier to entry for smaller organizations or workloads that need dedicated private network connectivity to AWS but do not require a full 1 Gbps or 10 Gbps dedicated physical line.',
  workplaceExample: 'A mid-sized software company wants a private link to AWS for consistent database sync, but only needs 200 Mbps of bandwidth. They order a 200 Mbps Hosted Connection through an AWS Partner (e.g., Megaport or Equinix). The partner provisions the link in minutes without physical cross-connect delays.',
  examFocus: 'SAA-C03 comparison table:\n- Dedicated Connection: 1 Gbps, 10 Gbps, 100 Gbps | Up to 50 VIFs | Ordered directly from AWS.\n- Hosted Connection: 50 Mbps to 10 Gbps | Exactly 1 VIF per connection | Ordered via AWS Direct Connect Partner.\nNote: To use a Transit VIF with a Hosted Connection, the capacity must be 1 Gbps or higher.',
  keyPoints: [
    'Provisioned through an authorized AWS Direct Connect Partner.',
    'Granular bandwidth choices: 50 Mbps, 100 Mbps, 200 Mbps, 300 Mbps, 400 Mbps, 500 Mbps, 1 Gbps, 2 Gbps, 5 Gbps, 10 Gbps.',
    'Supports exactly ONE Virtual Interface (VIF) per hosted connection.',
    'Faster provisioning time since the partner already has physical fiber in place.',
    'Transit VIF support requires capacity of 1 Gbps or greater.'
  ],
  commonMistake: 'Attempting to create multiple Virtual Interfaces (e.g. both a Private VIF and a Public VIF) on a single Hosted Connection. Hosted connections support strictly ONE VIF per connection.',
  example: 'Hosted Connection Allocation:\nPartner: Megaport\nBandwidth: 500 Mbps\nAssigned VIF: 1 Private VIF connected to Direct Connect Gateway.',
  sources: [
    { title: 'AWS Direct Connect Hosted Connections', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/working_with_connections.html' }
  ]
});
