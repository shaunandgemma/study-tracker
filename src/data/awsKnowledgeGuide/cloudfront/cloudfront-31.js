import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-31',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront vs S3 Transfer Acceleration',
  status: 'ready',
  plainEnglish: 'Both CloudFront and S3 Transfer Acceleration (S3TA) leverage AWS Edge Locations and the AWS global network backbone to speed up data transfers. However, they serve different primary use cases:\n- CloudFront is designed for READ-HEAVY content delivery (downloading web pages, images, videos, APIs) with caching capabilities globally.\n- S3 Transfer Acceleration is optimized specifically for FAST UPLOADS (and downloads) of large files directly into an Amazon S3 bucket across long distances over secure HTTPS without edge caching.',
  whyItMatters: 'Choosing the right transfer acceleration technology ensures optimal user experience. Using S3TA allows global users to upload gigabyte-sized video or CAD files to S3 up to 500% faster by hopping onto the nearest AWS edge location.',
  workplaceExample: 'A mobile video app allows creators worldwide to upload raw 4K video footage to an S3 bucket in Ohio. The app enables S3 Transfer Acceleration (mybucket.s3-accelerate.amazonaws.com) for uploads. For consumers watching those videos, the app uses a CloudFront distribution to cache and stream the content globally.',
  examFocus: 'SAA-C03 decision matrix:\n- Fast global UPLOADS of large files to a single S3 bucket -> S3 Transfer Acceleration (S3TA).\n- Fast global READS/DOWNLOADS, web serving, caching, WAF, dynamic APIs -> CloudFront.\n- S3TA requires enabling the feature on the S3 bucket and changing the endpoint URL to use .s3-accelerate.amazonaws.com.',
  keyPoints: [
    'CloudFront: Global CDN for content delivery, HTTP caching, WAF security, and reads/writes.',
    'S3 Transfer Acceleration (S3TA): Accelerates uploads/downloads directly to/from S3 without caching.',
    'Both use AWS Edge Locations and the AWS dedicated global fiber network.',
    'S3TA is ideal for large file uploads from geographically dispersed clients to a single S3 bucket.',
    'S3TA provides a utility to test speed improvements before enabling.'
  ],
  commonMistake: 'Recommending CloudFront for a scenario that requires fast global uploads of multi-gigabyte files to S3 without caching. S3 Transfer Acceleration is specifically designed for S3 bucket upload acceleration.',
  example: 'Architecture Pattern:\nGlobal Uploads: User in Sydney -> S3 Transfer Acceleration (`s3-accelerate.amazonaws.com`) -> AWS Edge Location -> AWS Backbone -> S3 Bucket (us-east-1).\nGlobal Downloads: User in London -> CloudFront Edge Location (Cached) -> Fast Download.',
  sources: [
    { title: 'What is Amazon CloudFront?', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' }
  ]
});
