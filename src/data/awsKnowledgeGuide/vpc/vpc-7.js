import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-7', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'IPv4 and IPv6 Addressing', status: 'ready',
  plainEnglish: 'Amazon VPC can use IPv4, IPv6, or dual-stack addressing according to supported configurations. Private IPv4 addresses are not internet-routable and normally require a public IPv4 mapping or NAT for internet access. VPC IPv6 addresses are globally unique; outbound-only protection uses routing and an egress-only internet gateway rather than IPv4-style NAT.',
  whyItMatters: 'IPv4 scarcity, public IPv4 cost, partner requirements, and modern dual-stack applications make address-family decisions operationally important. IPv6 is not automatically enabled by an IPv4 route or security rule. DNS, routes, security groups, network ACLs, applications, and monitoring must all handle the intended address family.',
  workplaceExample: 'A web platform enables dual stack in public and private tiers. It adds separate IPv6 routes and security rules, validates AAAA resolution and application listening behaviour, and uses an egress-only internet gateway for private-tier outbound IPv6 connections.',
  examFocus: 'SAA-C03: 0.0.0.0/0 covers IPv4 only; ::/0 covers IPv6 only. Public IPv4 commonly uses an internet gateway mapping, private IPv4 outbound uses NAT, and private IPv6 outbound uses an egress-only internet gateway. Security rules must explicitly address each family.',
  keyPoints: [
    'IPv4 and IPv6 have separate CIDRs, routes, DNS records, and security-rule entries.',
    'Private IPv4 addresses require translation or private connectivity to reach destinations outside private routing domains.',
    'IPv6 addresses assigned from a VPC IPv6 range are globally unique and do not use IPv4-style NAT for normal internet routing.',
    'Dual-stack resources can communicate using either family when applications and network controls support both.',
    'An IPv4 default route does not match IPv6 traffic, and an IPv6 default route does not match IPv4 traffic.',
    'Testing must confirm DNS, application binding, return routes, security groups, and NACLs for both families.'
  ],
  commonMistake: 'Adding ::/0 to an internet gateway while leaving an overly broad IPv6 security rule, assuming IPv6 receives the same implicit outbound-only behaviour as private IPv4 behind NAT.',
  example: 'A dual-stack private subnet sends 0.0.0.0/0 to a NAT gateway and ::/0 to an egress-only internet gateway. Its security groups allow only required traffic for both address families.',
  sources: [
    { title: 'IP addressing for VPCs and subnets', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html' },
    { title: 'Compare IPv4 and IPv6', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-migrate-ipv6.html' }
  ]
});
