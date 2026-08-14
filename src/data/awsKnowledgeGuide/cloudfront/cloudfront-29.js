import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-29',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Compression',
  status: 'ready',
  plainEnglish: 'CloudFront Compression allows CloudFront to automatically compress text-based web files (such as HTML, CSS, JavaScript, JSON, and XML) at edge locations before serving them to viewers. CloudFront supports Gzip and Brotli compression algorithms. When a viewer\'s browser sends an Accept-Encoding: gzip, br header, CloudFront serves the compressed version from cache or compresses the origin response automatically.',
  whyItMatters: 'Compressing files dramatically reduces file sizes (often by 60% to 80%). Smaller payloads download faster, improving web page load times, lowering mobile bandwidth usage, and reducing CloudFront out-of-region data transfer fees.',
  workplaceExample: 'A web application serves a 1.5 MB uncompressed JavaScript bundle. By turning on automatic Brotli compression in CloudFront, the bundle size shrinks to 320 KB. Web page interactive speeds jump significantly and bandwidth costs drop by 75%.',
  examFocus: 'For SAA-C03, CloudFront automatic compression compresses files between 1,000 bytes and 10,000,000 bytes for supported MIME types (like text/html, application/javascript, application/json). If the origin already sends pre-compressed files with Content-Encoding, CloudFront serves them as-is without re-compressing.',
  keyPoints: [
    'Automatically compresses text files using Gzip or Brotli at edge locations.',
    'Requires client to send Accept-Encoding header.',
    'Brotli provides superior compression ratios compared to standard Gzip.',
    'Reduces transfer latency, bandwidth usage, and AWS data transfer costs.',
    'Applies to supported file types (HTML, CSS, JS, JSON, SVG, XML).'
  ],
  commonMistake: 'Enabling compression on binary formats like JPEG, PNG, MP4, or ZIP files. Binary media formats are already compressed; attempting to re-compress them wastes CPU and can even increase file size.',
  example: 'Cache Behavior Settings:\nCompress Objects Automatically: `Yes`\nViewer Request Header: `Accept-Encoding: br, gzip`\nResponse Header from CloudFront: `Content-Encoding: br` (File size reduced from 500 KB to 95 KB).',
  sources: [
    { title: 'Serving compressed files', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html' }
  ]
});
