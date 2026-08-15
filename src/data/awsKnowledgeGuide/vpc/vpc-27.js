import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-27', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Flow Logs', status: 'ready',
  plainEnglish: 'VPC Flow Logs capture metadata about IP traffic to and from supported network interfaces at the VPC, subnet, or ENI scope. Records can show source, destination, ports, protocol, bytes, packets, time, and an ACCEPT or REJECT action depending on format. They do not capture packet payloads and are not a real-time packet sniffer.',
  whyItMatters: 'Flow logs help investigate rejected traffic, unexpected connections, traffic volume, and security patterns without installing an agent on every instance. They must be combined with route, DNS, security, application, and service evidence because an ACCEPT record does not prove the application successfully processed a request.',
  workplaceExample: 'An application timeout is investigated with flow logs at the target ENI. REJECT records point to a filtering issue; after correcting the rule, ACCEPT records appear, and application logs confirm successful requests.',
  examFocus: 'SAA-C03: flow logs capture network metadata, not contents; can be created at VPC, subnet, or ENI scope; can publish to supported destinations; and distinguish accepted from rejected traffic. They do not themselves block traffic.',
  keyPoints: [
    'Flow logs collect IP traffic metadata for supported VPC networking resources.',
    'They can record accepted traffic, rejected traffic, or both.',
    'Payload contents are not included, so packet capture and application logs answer different questions.',
    'Delivery is not instantaneous and records can be aggregated during the capture interval.',
    'A REJECT action points to a filtering decision but still requires identification of the responsible layer.',
    'Flow logs are observational and do not create routes or security rules.'
  ],
  commonMistake: 'Treating an ACCEPT flow-log record as proof that the server returned a successful application response. It proves only that the logged network filtering stage accepted the traffic.',
  example: 'A record shows TCP traffic from the client to port 443 was rejected at the target ENI. The engineer checks SG and NACL rules, corrects the intended control, and then verifies both ACCEPT records and successful HTTPS responses.',
  sources: [{ title: 'VPC Flow Logs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html' }]
});
