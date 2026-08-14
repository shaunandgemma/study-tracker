import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-16',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Direct Connect Redundancy',
  status: 'ready',
  plainEnglish: 'Direct Connect Redundancy refers to architectural designs that eliminate single points of failure in an AWS Direct Connect infrastructure. A single Direct Connect connection is vulnerable to fiber cuts, hardware port failures, or colocation facility power outages. AWS provides official Resiliency Models (Maximum Resiliency, High Resiliency, and Development/Test) that guide organizations on setting up multiple connections across different locations, devices, and providers.',
  whyItMatters: 'For mission-critical production workloads, a network outage causes severe financial loss and operational disruption. Designing Direct Connect redundancy guarantees high availability and uptime SLAs.',
  workplaceExample: 'A stock trading platform deploys Maximum Resiliency for Direct Connect: they order two separate 10 Gbps connections at Location A (connected to distinct customer routers and AWS routers) AND two separate 10 Gbps connections at Location B. This guarantees 99.99% availability even if an entire data center facility goes dark.',
  examFocus: 'SAA-C03 Resiliency Tiers:\n1. Maximum Resiliency (99.99% SLA): 4 connections across 2 distinct Direct Connect Locations, separate customer routers, separate AWS devices.\n2. High Resiliency (99.9% SLA): 2 connections across 2 distinct Direct Connect Locations.\n3. Development/Test (No SLA): 1 connection, or 2 connections at 1 location.\n4. VPN Backup: 1 Direct Connect connection + Site-to-Site VPN as cost-effective backup.',
  keyPoints: [
    'Eliminates single points of failure (fiber cuts, hardware failures, facility outages).',
    'Maximum Resiliency (99.99% SLA): 4 connections across 2 locations on separate devices.',
    'High Resiliency (99.9% SLA): 2 connections across 2 distinct locations.',
    'VPN Backup: Uses AWS Site-to-Site VPN over the public internet as failover for Direct Connect.',
    'BGP automatically handles failover between redundant links.'
  ],
  commonMistake: 'Ordering two Direct Connect links at the exact same colocation facility and assuming total redundancy. A facility power outage or fiber cut outside the building will sever both connections simultaneously. True high availability requires separate physical locations.',
  example: 'High Resiliency Setup (99.9% SLA):\nConnection 1: Location A (Equinix Ashburn) -> Router 1\nConnection 2: Location B (CoreSite Reston) -> Router 2\nBGP: Active/Active or Active/Passive failover configured via BGP AS-path prepending.',
  sources: [
    { title: 'AWS Direct Connect Resiliency Recommendations', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency-topology.html' }
  ]
});
