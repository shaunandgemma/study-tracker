import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dx-17',
  topicId: 'topic-direct-connect',
  topicTitle: 'AWS Direct Connect',
  objectiveCode: 'Networking',
  title: 'Multiple Direct Connect Connections for High Availability',
  status: 'ready',
  plainEnglish: 'Deploying Multiple Direct Connect Connections for High Availability involves configuring two or more physical Direct Connect links operating together in an Active/Active (load balancing) or Active/Passive (failover) configuration. When multiple connections are established to the same VPC or Direct Connect Gateway, BGP routing policies (such as AS-PATH prepending or BGP Local Preference) control how traffic is distributed across the links during normal operations and hardware failures.',
  whyItMatters: 'Multiple links ensure seamless network failover without dropping active user sessions or requiring manual intervention from network engineers when a link fails.',
  workplaceExample: 'An e-commerce retailer configures two 10 Gbps Direct Connect links from two separate data centers. During normal operations, traffic is load-balanced across both links (Active/Active). When a construction crew accidentally cuts the fiber cable for Link 1, BGP automatically redirects 100% of the traffic to Link 2 with zero downtime.',
  examFocus: 'SAA-C03 traffic engineering rules:\n- Active/Active (Equal-Cost Multi-Path / ECMP): AWS automatically load balances traffic across multiple Direct Connect links with identical BGP attributes.\n- Active/Passive (Failover): To make Link 1 preferred over Link 2, use AS-PATH prepending on Link 2 (making its path appear longer to AWS) or set BGP Local Preference tags.',
  keyPoints: [
    'Multiple physical links provide active load balancing or automated failover.',
    'Active/Active mode uses Equal-Cost Multi-Path (ECMP) routing for higher throughput.',
    'Active/Passive mode uses BGP AS-PATH prepending or Local Preference to select primary link.',
    'Connections should terminate on separate customer routers and separate AWS hardware.',
    'Ensures high availability for mission-critical enterprise hybrid architectures.'
  ],
  commonMistake: 'Expecting automatic load balancing across two links when one link has a longer AS-PATH. AWS will route all outbound traffic through the path with the shortest AS-PATH length.',
  example: 'Active/Passive Traffic Engineering:\nLink A (Primary): Advertises prefix `10.0.0.0/16` with standard AS-PATH `65001`.\nLink B (Backup): Advertises prefix `10.0.0.0/16` with prepended AS-PATH `65001 65001 65001`.\nResult: AWS sends 100% of traffic over Link A until Link A fails.',
  sources: [
    { title: 'AWS Direct Connect Resiliency Topology', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency-topology.html' }
  ]
});
