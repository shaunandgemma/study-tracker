import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-8',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Edge Locations',
  status: 'ready',
  plainEnglish: 'Edge Locations are physical data centers located in major cities around the world that run CloudFront servers. Unlike standard AWS Availability Zones inside an AWS Region where your servers run, Edge Locations are located close to populations of users worldwide. Their sole job is to cache content, execute lightweight edge code (Lambda@Edge and CloudFront Functions), inspect traffic with AWS WAF, and terminate TLS connections quickly. Regional Edge Caches sit between Edge Locations and your origin server to hold larger content caches that are less frequently accessed.',
  whyItMatters: 'By terminating TLS handshakes and serving cached content at an Edge Location near the user, CloudFront eliminates thousands of miles of network transmission. This dramatically speeds up page render times, improves mobile app responsiveness, and insulates origin infrastructure from traffic spikes.',
  workplaceExample: 'When a sports fan in Tokyo opens a streaming mobile app, their phone connects to a CloudFront Edge Location in Tokyo. The app loads video thumbnails instantly from Tokyo edge memory instead of establishing a slow, multi-hop TLS session to a server in North America.',
  examFocus: 'Distinguish Edge Locations from Availability Zones (AZs) and AWS Regions. Edge Locations are NOT for running general EC2 instances or RDS databases. They are designed for caching content, edge computing (CloudFront Functions / Lambda@Edge), and network acceleration.',
  keyPoints: [
    'Edge Locations are globally distributed points of presence (PoPs).',
    'Used for caching content, terminating TLS, running edge functions, and WAF inspection.',
    'Regional Edge Caches sit between edge locations and origins to improve cache hit ratios for less popular content.',
    'Edge Locations are separate from AWS Regions and Availability Zones.',
    'Requests are automatically routed to the optimal edge location using BGP anycast and DNS routing.'
  ],
  commonMistake: 'Confusing CloudFront Edge Locations with AWS Wavelength or Outposts. Edge Locations focus on content caching, CDN delivery, and edge security, whereas Wavelength hosts EC2/EKS in telecom 5G networks.',
  example: 'Client in London -> Request sent to London Edge Location -> If cached (Cache Hit), return immediately. If not cached (Cache Miss) -> London Edge Location checks Regional Edge Cache in Europe -> If not found, routes over AWS backbone to S3 origin in us-east-1.',
  sources: [
    { title: 'What is Amazon CloudFront?', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' }
  ]
});
