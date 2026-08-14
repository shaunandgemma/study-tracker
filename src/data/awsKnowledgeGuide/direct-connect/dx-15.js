import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-15',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'BGP Routing',
  status: 'ready',
  plainEnglish: 'BGP (Border Gateway Protocol) is the industry-standard dynamic routing protocol used by AWS Direct Connect to exchange network routing information between your on-premises routers and AWS. When you set up a Virtual Interface (VIF) on Direct Connect, a BGP session is established between your customer router (peer) and the AWS router (peer). Your router advertises your on-premises IP prefixes to AWS, and AWS advertises VPC or public AWS IP prefixes to your router.',
  whyItMatters: 'Dynamic BGP routing eliminates the need to manually configure static IP routes. If network topology changes or a link fails, BGP automatically updates routing tables in real time to maintain connectivity.',
  workplaceExample: 'A corporation sets up active/passive redundant Direct Connect links. They use BGP Autonomous System Number (ASN) path prepending to make Link A preferred over Link B. If Link A physically breaks, BGP automatically redirects traffic to Link B in seconds without human intervention.',
  examFocus: 'SAA-C03 BGP details:\n- BGP is REQUIRED for all AWS Direct Connect Virtual Interfaces.\n- Supports Public ASNs or Private ASNs (in the range 64512-65534 or 4200000000-4294967294).\n- BGP Community tags can be used to control route scope and influence active/standby path selection (e.g. AS-PATH prepending or BGP Local Preference).',
  keyPoints: [
    'Dynamic routing protocol required for all Direct Connect Virtual Interfaces.',
    'Exchanges IP routes automatically between customer routers and AWS routers.',
    'Supports Private ASNs (64512–65534) and Public ASNs.',
    'Enables automatic failover and path selection for redundant connections.',
    'Uses BGP Community tags to control route propagation and traffic engineering.'
  ],
  commonMistake: 'Attempting to use static routing without BGP on an AWS Direct Connect link. Direct Connect mandates BGP dynamic routing for route exchange.',
  example: 'BGP Session Configuration:\nCustomer BGP ASN: 65001\nAWS BGP ASN: 64512\nMD5 Password: `MyBgpSecretKey123`\nRoutes Advertised to AWS: `10.50.0.0/16`\nRoutes Received from AWS: `172.31.0.0/16` (VPC CIDR).',
  sources: [
    { title: 'AWS Direct Connect Routing and BGP', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/routing-and-bgp.html' }
  ]
});
