import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'shield-8',
  topicId: 'topic-shield',
  topicTitle: 'AWS Shield',
  objectiveCode: 'Security',
  title: 'Shield Advanced Enhanced Detection and Mitigation',
  status: 'ready',
  plainEnglish: 'Shield Advanced Enhanced Detection and Mitigation uses application-specific traffic baselining and health-based detection to identify sophisticated DDoS attacks. It analyzes historical application traffic patterns (volume, HTTP request rates, URI paths) to establish normal baselines. When anomalies occur, it automatically creates and deploys custom AWS WAF mitigation rules in real time.',
  whyItMatters: 'Sophisticated Layer 7 HTTP floods mimic valid user requests, making generic static rate limits ineffective. Enhanced detection identifies subtle traffic anomalies specific to your application and blocks malicious request patterns automatically.',
  workplaceExample: 'An API endpoint receives a sudden 100x surge in requests to `/api/login`. Shield Advanced compares the surge against normal baseline traffic, identifies a credential-stuffing botnet pattern, and automatically deploys a WAF block rule in Count or Block mode.',
  examFocus: 'SAA-C03 Enhanced Detection Capabilities:\n- Traffic Baselining: Learns normal application traffic profiles over time to detect subtle anomalies.\n- Health-Based Detection: Integrates with Route 53 Health Checks to trigger faster mitigation when application health degrades.\n- Automatic L7 Mitigation: Automatically creates, tests, and deploys AWS WAF rules to block Layer 7 attacks.\n- Protection Groups: Group related resources (e.g. all ALBs in a workload) for unified detection and false-positive reduction.',
  keyPoints: [
    'Establishes custom application traffic baselines to detect subtle attack anomalies.',
    'Integrates with Route 53 Health Checks for health-based rapid DDoS mitigation.',
    'Automatically creates and applies custom AWS WAF rules for Layer 7 HTTP floods.',
    'Supports Protection Groups to aggregate metrics across multiple resources.',
    'Provides detailed real-time attack telemetry and CloudWatch metrics.'
  ],
  commonMistake: 'Configuring Route 53 health-based detection with a deep health check that tests external database dependencies, causing false-positive DDoS alarms when a database is slow.',
  example: 'Enabling Automatic Application-Layer Mitigation in Shield Advanced via AWS CLI:\naws shield update-application-layer-automatic-response --resource-arn "arn:aws:cloudfront::123456789012:distribution/E1A2B3C4D5E6F7" --action "BLOCK"',
  sources: [
    { title: 'Shield Advanced enhanced detection and auto-mitigation', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html' }
  ]
});
