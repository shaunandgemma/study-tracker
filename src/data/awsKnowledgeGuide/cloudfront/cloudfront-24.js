import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-24',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Viewer Protocol Policies',
  status: 'ready',
  plainEnglish: 'Viewer Protocol Policies define how CloudFront responds to HTTP and HTTPS requests sent by viewers (end-user browsers or devices). Configured inside each cache behavior, the Viewer Protocol Policy controls whether viewers can connect using unencrypted HTTP, are forced to use encrypted HTTPS, or are redirected from HTTP to HTTPS automatically.',
  whyItMatters: 'Viewer protocol policies enforce secure communication across your web properties. Automatically redirecting HTTP to HTTPS ensures all user interactions are encrypted without breaking legacy HTTP links or bookmarks.',
  workplaceExample: 'A healthcare web portal sets its CloudFront Viewer Protocol Policy to Redirect HTTP to HTTPS. When a patient types http://portal.health.org in their browser, CloudFront intercepts the connection at the nearest edge location and returns an HTTP 301 Redirect to https://portal.health.org, securing the patient session.',
  examFocus: 'SAA-C03 tests three Viewer Protocol Policy options:\n1. HTTP and HTTPS: Accepts both unencrypted and encrypted traffic.\n2. Redirect HTTP to HTTPS: Automatically converts HTTP requests to HTTPS (301 redirect). Recommended best practice.\n3. HTTPS Only: Rejects unencrypted HTTP requests with an HTTP 403 error.\nAlso understand Origin Protocol Policy: controls protocol used between CloudFront and Origin (HTTP Only, HTTPS Only, or Match Viewer).',
  keyPoints: [
    'Controls HTTP vs HTTPS communication between end viewers and CloudFront.',
    'Three Viewer Protocol Policy options: HTTP and HTTPS, Redirect HTTP to HTTPS, HTTPS Only.',
    'Redirect HTTP to HTTPS is the standard AWS security recommendation.',
    'Configured independently per Cache Behavior.',
    'Distinct from Origin Protocol Policy (which governs traffic between CloudFront and Origin).'
  ],
  commonMistake: 'Confusing Viewer Protocol Policy (Viewer to Edge) with Origin Protocol Policy (Edge to Origin). Setting Viewer Protocol Policy to HTTPS Only does not automatically force HTTPS between CloudFront and your backend origin.',
  example: 'Cache Behavior Configuration:\nPath Pattern: `*`\nViewer Protocol Policy: `Redirect HTTP to HTTPS`\nOrigin Protocol Policy: `HTTPS Only`\nResult: Complete end-to-end encryption from user browser to backend origin.',
  sources: [
    { title: 'Using HTTPS with CloudFront', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https.html' }
  ]
});
