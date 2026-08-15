import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-14',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Response Team - SRT',
  status: 'ready',
  plainEnglish: 'The Shield Response Team (SRT) is a 24/7 dedicated group of AWS DDoS security experts available exclusively to AWS Shield Advanced subscribers (with Enterprise or Business Support). During a complex or persistent DDoS attack, subscribers can engage the SRT to analyze attack traffic, write custom AWS WAF mitigation rules, and manage emergency response actions on their behalf.',
  whyItMatters: 'Sophisticated multi-vector attacks can bypass automated rules and require human security engineering expertise. Having 24/7 access to specialized AWS DDoS engineers ensures rapid mitigation without hiring an in-house DDoS response team.',
  workplaceExample: 'During a major product launch, a financial app suffers a complex zero-day L7 attack. The DBA opens an urgent case with the Shield Response Team. The SRT analyzes PCAP logs and updates WAF rules in 15 minutes, restoring application health.',
  examFocus: 'SAA-C03 SRT Prerequisites & Proactive Engagement:\n- Support Requirement: Requires AWS Enterprise or Business Support Plan.\n- Proactive Engagement: SRT proactively contacts you when Route 53 health checks indicate an application outage during a DDoS attack.\n- IAM Permissions: Requires creating the `AWSShieldDRTAccessRole` granting the SRT permission to inspect WAF Web ACLs and CloudFront configurations.',
  keyPoints: [
    '24/7 access to specialized AWS DDoS security engineers for active incident response.',
    'Available exclusively to AWS Shield Advanced subscribers with Business or Enterprise Support.',
    'SRT can author and apply custom AWS WAF mitigation rules during active attacks.',
    'Proactive Engagement allows the SRT to contact you automatically when health checks fail.',
    'Requires creating the `AWSShieldDRTAccessRole` IAM role to grant SRT administrative access.'
  ],
  commonMistake: 'Failing to create the `AWSShieldDRTAccessRole` IAM role before an attack, preventing the SRT from accessing WAF Web ACLs during an active emergency.',
  example: 'Configuring Emergency Contacts for SRT Proactive Engagement via AWS CLI:\naws shield update-emergency-contact-settings --emergency-contact-list \'[{"EmailAddress": "soc-team@example.com", "PhoneNumber": "+12065550100"}]\':',
  sources: [
    { title: 'Engaging the AWS Shield Response Team (SRT)', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-srt.html' }
  ]
});
