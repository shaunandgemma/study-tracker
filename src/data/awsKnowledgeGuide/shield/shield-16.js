import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-16',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Standard vs Shield Advanced',
  status: 'ready',
  plainEnglish: 'AWS Shield provides two distinct tiers of DDoS protection:\n- AWS Shield Standard: Free, automatic, always-on baseline protection against common Layer 3 (Network) and Layer 4 (Transport) infrastructure attacks for all AWS customers.\n- AWS Shield Advanced: Paid subscription ($3,000/month) providing enhanced detection, automatic Layer 7 WAF mitigation, 24/7 Shield Response Team (SRT) support, Route 53 health-based detection, and DDoS Cost Protection.',
  whyItMatters: 'Architects must match business availability requirements to the correct Shield tier. Standard protection suits generic cloud workloads; Advanced is essential for enterprise web applications requiring guaranteed uptime and 24/7 expert incident response.',
  workplaceExample: 'A company uses Shield Standard for internal dev/test workloads to save costs. For their primary customer payment platform, they subscribe to Shield Advanced, securing 24/7 SRT response, L7 automatic WAF mitigation, and billing cost protection.',
  examFocus: 'SAA-C03 Decision Matrix (Shield Standard vs Advanced):\n- Cost: Standard is Free ($0). Advanced is $3,000/month 1-year commitment.\n- Protection Scope: Standard covers L3/L4. Advanced covers L3/L4/L7.\n- SRT Access: Standard has NO SRT access. Advanced includes 24/7 SRT access.\n- Cost Reimbursement: Standard has NO cost protection. Advanced includes DDoS Cost Protection credits.',
  keyPoints: [
    'Shield Standard is free and automatically protects all AWS customers at L3/L4.',
    'Shield Advanced is a paid subscription ($3,000/month) providing specialized L3/L4/L7 protection.',
    'Shield Advanced includes 24/7 access to the specialized AWS Shield Response Team (SRT).',
    'Shield Advanced provides automatic Layer 7 HTTP flood mitigation via AWS WAF.',
    'Shield Advanced includes DDoS Cost Protection to credit unexpected scaling charges.'
  ],
  commonMistake: 'Claiming that AWS Shield Standard provides 24/7 SRT support or automatic Layer 7 WAF rule creation. Those features require Shield Advanced.',
  example: 'Comparison Summary:\n- Shield Standard: $0/mo, Automatic L3/L4 protection, No SRT, No cost protection.\n- Shield Advanced: $3,000/mo, Enhanced L3/L4/L7 protection, 24/7 SRT support, DDoS Cost Protection.',
  sources: [
    { title: 'Differences between AWS Shield Standard and AWS Shield Advanced', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html' }
  ]
});
