import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-10',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'S3 Origins',
  status: 'ready',
  plainEnglish: 'An S3 Origin is an Amazon Simple Storage Service (S3) bucket configured as the backend content store for a CloudFront distribution. CloudFront fetches static assets (HTML, images, JS, CSS, video files) directly from the S3 bucket when a cache miss occurs. There are two ways to configure an S3 origin: as a standard REST API S3 Endpoint (bucket-name.s3.amazonaws.com) or as an S3 Static Website Endpoint (bucket-name.s3-website.region.amazonaws.com).',
  whyItMatters: 'Using S3 as a CloudFront origin is the industry standard pattern for hosting static web applications. It provides virtually unlimited storage, 99.999999999% durability, and scales automatically to handle millions of requests without managing any web servers.',
  workplaceExample: 'A technology blog builds its frontend using React and deploys the static build files to an S3 bucket. By setting up CloudFront with an S3 REST API endpoint origin secured via Origin Access Control (OAC), the blog loads in milliseconds globally while the S3 bucket remains closed to direct public internet access.',
  examFocus: 'Exam questions frequently contrast S3 REST API endpoints with S3 Website Endpoints. If you use S3 REST API endpoint + CloudFront, you CAN use Origin Access Control (OAC) to secure the bucket. If you use S3 Website Endpoint, it acts as a custom HTTP origin, so OAC/OAI is NOT supported and the bucket policy must allow public HTTP access or restrict using custom headers.',
  keyPoints: [
    'S3 REST API endpoints support private buckets secured with Origin Access Control (OAC).',
    'S3 Website endpoints are treated as Custom Origins and do NOT support OAC/OAI.',
    'Use S3 REST API endpoints for private content, HTTPS between CloudFront and S3, and OAC.',
    'Use S3 Website endpoints only if you rely on S3 index/error documents or S3 redirects.',
    'S3 origins paired with CloudFront eliminate the need for EC2 or web servers for static sites.'
  ],
  commonMistake: 'Trying to attach an Origin Access Control (OAC) policy to an S3 bucket while using an S3 Static Website URL as the origin domain. OAC only works with standard S3 REST API endpoints.',
  example: 'Standard S3 REST API Origin Configuration:\nDomain Name: `mybucket.s3.us-east-1.amazonaws.com`\nOrigin Access: Use Origin Access Control (OAC)\nBucket Policy: Grants `s3:GetObject` only to CloudFront Service Principal `cloudfront.amazonaws.com`.',
  sources: [
    { title: 'Restricting access to an Amazon S3 origin', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html' }
  ]
});
