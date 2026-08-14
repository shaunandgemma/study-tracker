import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-7',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Dedicated Connections',
  status: 'ready',
  plainEnglish: 'A Dedicated Connection is a physical Ethernet connection allocated exclusively to a single customer by AWS. Dedicated connections are provisioned directly through AWS at fixed port speeds of 1 Gbps, 10 Gbps, or 100 Gbps. Because you own the full physical port, you can create up to 50 Virtual Interfaces (VIFs)—including Private VIFs, Public VIFs, and Transit VIFs—on a single dedicated connection.',
  whyItMatters: 'Dedicated Connections provide maximum bandwidth, complete physical isolation at the port level, and full flexibility to configure multiple Virtual Interfaces (private, public, and transit) for enterprise multi-VPC architectures.',
  workplaceExample: 'An enterprise video streaming company provisions a 100 Gbps Dedicated Connection at an AWS Direct Connect location to transfer terabytes of raw camera footage daily. They partition the single 100 Gbps link into 10 Private VIFs for different VPCs and 1 Transit VIF for AWS Transit Gateway.',
  examFocus: 'SAA-C03 distinction between Dedicated vs Hosted Connections:\n- Dedicated Connection: Ordered directly from AWS, physical port dedicated to 1 customer, port speeds = 1 Gbps, 10 Gbps, 100 Gbps, supports up to 50 VIFs (including Transit VIFs), supports MACsec encryption (on 10/100 Gbps ports).\n- Hosted Connection: Provisioned through an AWS Direct Connect Partner, sub-1 Gbps speeds available (50 Mbps - 10 Gbps), supports only 1 VIF per connection.',
  keyPoints: [
    'Physical port dedicated exclusively to one customer.',
    'Fixed capacities: 1 Gbps, 10 Gbps, or 100 Gbps.',
    'Supports up to 50 Virtual Interfaces (Private, Public, Transit VIFs).',
    'Supports MACsec hardware encryption on 10 Gbps and 100 Gbps ports.',
    'Ordered directly via AWS Console or AWS CLI.'
  ],
  commonMistake: 'Thinking you can order a 500 Mbps Dedicated Connection. Dedicated connections are ONLY available at 1 Gbps, 10 Gbps, or 100 Gbps port capacities. Smaller capacities require a Hosted Connection.',
  example: 'Dedicated Connection Spec:\nPort Speed: 10 Gbps\nLocation: Equinix San Jose\nVirtual Interfaces: 1 Transit VIF (for Transit Gateway), 2 Private VIFs (for dev/test VPCs), 1 Public VIF (for S3).',
  sources: [
    { title: 'AWS Direct Connect Dedicated Connections', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/working_with_connections.html' }
  ]
});
