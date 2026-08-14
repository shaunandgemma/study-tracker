import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-9',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Origins',
  status: 'ready',
  plainEnglish: 'An Origin is the source location where the definitive, original versions of your content are stored. When CloudFront gets a request at an edge location for content that isn’t already cached (a cache miss), CloudFront fetches the file from the designated Origin. CloudFront supports several origin types: Amazon S3 buckets, AWS Elemental MediaStore/MediaPackage, or Custom Origins (such as an Application Load Balancer, EC2 instance, API Gateway, or any web server accessible over HTTP/HTTPS, even outside AWS).',
  whyItMatters: 'Origins allow CloudFront to sit in front of virtually any application architecture. You can combine multiple origins within a single CloudFront distribution, sending static file requests to S3 while proxying dynamic API requests to an EC2 instance or Load Balancer.',
  workplaceExample: 'An e-commerce website configures two origins in one distribution: Origin 1 is an S3 bucket storing images and CSS files (s3-origin), and Origin 2 is an Application Load Balancer routing product search APIs (alb-origin). CloudFront handles all incoming traffic on shop.example.com and forwards requests to the correct origin based on the path.',
  examFocus: 'Remember for SAA-C03 that CloudFront distributions support both S3 origins and Custom origins. Custom origins require custom header verification or security groups (using CloudFront managed prefix lists) to ensure clients cannot bypass CloudFront to hit the origin directly.',
  keyPoints: [
    'An origin is the master server containing your source data.',
    'Supports Amazon S3, MediaStore, and Custom HTTP/HTTPS servers (ALB, EC2, on-premises).',
    'A single distribution can configure multiple origins.',
    'Origin Groups allow configuring primary and secondary origins for automatic failover.',
    'CloudFront optimizes the TCP connection between edge locations and origins.'
  ],
  commonMistake: 'Thinking CloudFront origins can only be AWS services like S3 or ALB. A custom origin can be an on-premises web server or a server hosted in another cloud provider as long as it has a public domain name or IP address.',
  example: 'Origin Definitions in CloudFront:\nOrigin 1: S3 Bucket -> my-static-assets.s3.amazonaws.com (S3 Origin)\nOrigin 2: ALB -> api-internal-alb-12345.us-east-1.elb.amazonaws.com (Custom Origin)\nCache Behavior 1: Path pattern `/images/*` -> Target Origin 1\nCache Behavior 2: Path pattern `/api/*` -> Target Origin 2',
  sources: [
    { title: 'Working with origins', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Origins.html' }
  ]
});
