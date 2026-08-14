import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-6',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Content Delivery Network - CDN',
  status: 'ready',
  plainEnglish: 'Amazon CloudFront is a global Content Delivery Network (CDN) service that securely delivers data, videos, applications, and APIs to users worldwide with low latency and high transfer speeds. A CDN works by storing copies of content (like images, HTML files, videos, or API responses) at edge locations—data centers distributed around the world close to end users. When a user requests content, CloudFront routes the request to the nearest edge location, serving the content locally instead of fetching it from the origin server across the globe.',
  whyItMatters: 'Without a CDN, every user request must travel across the public internet to your origin server (e.g., an S3 bucket or EC2 instance in us-east-1). Users in Europe or Asia experience slow page loads due to network distance. CloudFront reduces latency, minimizes origin server workload, saves bandwidth costs, and provides automatic protection against Distributed Denial of Service (DDoS) attacks.',
  workplaceExample: 'A global news website hosts its static assets and articles on servers in Virginia. By deploying Amazon CloudFront, readers in London, Tokyo, and Sydney download images and scripts from local edge nodes in under 20 milliseconds instead of waiting 200+ milliseconds for a response from Virginia.',
  examFocus: 'SAA-C03 scenarios often test how to improve performance for global users, decrease load on web/S3 origin servers, or secure applications at the edge. CloudFront is the primary answer when static or dynamic web content must be served globally with minimal latency.',
  keyPoints: [
    'CloudFront caches static and dynamic content at edge locations worldwide.',
    'Reduces latency by serving content close to end users.',
    'Offloads web traffic from origin servers like Amazon S3, ALB, or EC2.',
    'Provides built-in DDoS protection via AWS Shield Standard at no extra charge.',
    'Supports custom SSL/TLS certificates and edge compute capabilities.'
  ],
  commonMistake: 'Thinking CloudFront is only for static files like images or HTML. CloudFront also accelerates dynamic content (APIs, live streaming, web applications) by optimizing TCP connections and network routing back to the origin.',
  example: 'A user in Paris requests https://example.com/logo.png. CloudFront routes the request to the Paris Edge Location. If logo.png is cached at the edge, CloudFront returns it immediately (Cache Hit). If not cached (Cache Miss), CloudFront fetches it over the AWS global network backbone from the S3 origin in us-east-1, caches it locally, and returns it to the user.',
  sources: [
    { title: 'What is Amazon CloudFront?', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' }
  ]
});
