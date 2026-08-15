import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-5',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Distributed Denial of Service - DDoS Protection',
  status: 'ready',
  plainEnglish: 'Distributed Denial of Service (DDoS) is a malicious attempt to disrupt the normal availability of a targeted application, server, or network by overwhelming it with a flood of internet traffic from multiple compromised computer systems (botnets). AWS Shield protects applications against volumetric, network-layer, transport-layer, and application-layer DDoS attack vectors.',
  whyItMatters: 'DDoS attacks can take down un-mitigated web applications in seconds, causing severe business revenue loss and brand damage. Understanding DDoS vectors allows architects to implement defense-in-depth edge protection using AWS Shield, CloudFront, Route 53, and AWS WAF.',
  workplaceExample: 'An online ticketing site launches a major event. Adversaries launch a 100 Gbps SYN flood botnet attack to prevent legitimate buyers from reaching the site. AWS Shield absorbs the traffic flood at the edge, allowing legitimate ticketing transactions to proceed.',
  examFocus: 'SAA-C03 DDoS Attack Classifications:\n- Volumetric Attacks: Flood network bandwidth (e.g. UDP reflection, ICMP floods).\n- Network/Transport Layer (L3/L4): Target network protocol stack (e.g. TCP SYN floods, ACK floods).\n- Application Layer (L7): Target web application resources (e.g. HTTP GET/POST floods, slowloris attacks).\n- Resilient Architecture Pattern: Route 53 (DNS) -> CloudFront / Global Accelerator (Edge scrubbing) -> AWS WAF (L7 rules) -> ALB + Auto Scaling.',
  keyPoints: [
    'Malicious traffic floods sent from distributed botnets to disrupt application availability.',
    'Classified into Volumetric, Network/Transport-layer (L3/L4), and Application-layer (L7) attacks.',
    'AWS Shield Standard automatically mitigates L3/L4 infrastructure attacks globally.',
    'AWS Shield Advanced and AWS WAF protect against complex L7 application-layer HTTP floods.',
    'Defense-in-depth architecture combines Route 53, CloudFront, WAF, and Auto Scaling.'
  ],
  commonMistake: 'Assuming a large EC2 instance with high network bandwidth can withstand a volumetric DDoS attack without edge protection services like CloudFront and AWS Shield.',
  example: 'Checking Shield DDoS Event History via AWS CLI:\naws shield list-attacks',
  sources: [
    { title: 'Overview of DDoS attacks on AWS', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html' }
  ]
});
