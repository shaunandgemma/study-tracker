import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-15',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Origin Access Control - OAC',
  status: 'ready',
  plainEnglish: 'Origin Access Control (OAC) is the AWS-recommended security feature used to secure Amazon S3 bucket origins behind CloudFront distributions. When OAC is enabled, CloudFront authenticates its HTTP requests to S3 using AWS SigV4 (Signature Version 4) signing. You then update the S3 bucket policy to allow read/write access ONLY from CloudFront\'s service principal (cloudfront.amazonaws.com) matching your distribution\'s ARN, blocking all direct access from the public internet.',
  whyItMatters: 'OAC ensures that users cannot bypass your CloudFront CDN to access S3 buckets directly. It enforces centralized edge security (WAF, SSL/TLS, geographic restrictions, signed URLs) and supports modern security requirements like SSE-KMS encryption, HTTP POST uploads, and all AWS regions.',
  workplaceExample: 'A digital publishing app stores premium video files in Amazon S3. Without OAC, users could discover direct S3 URLs and download videos without paying. By enabling OAC and setting a restrictive S3 bucket policy, direct S3 links return HTTP 403 Forbidden, requiring all requests to pass through authenticated CloudFront Signed URLs.',
  examFocus: 'SAA-C03 questions regarding securing S3 origins will emphasize OAC as the current best practice. Remember key details: OAC supports SSE-KMS, supports all S3 buckets in all regions, supports all HTTP methods, and uses IAM condition keys (AWS:SourceArn or AWS:SourceAccount) in the S3 bucket policy to prevent confused deputy attacks.',
  keyPoints: [
    'OAC signs requests using Signature Version 4 (SigV4).',
    'Supports SSE-KMS encrypted S3 objects.',
    'Supports all HTTP methods including PUT, POST, and DELETE.',
    'Works across all commercial and AWS GovCloud regions.',
    'Replaces legacy Origin Access Identity (OAI).'
  ],
  commonMistake: 'Creating an OAC in CloudFront but forgetting to update the S3 Bucket Policy. Creating the OAC configuration object alone does not restrict S3; you must apply the generated IAM bucket policy to your S3 bucket.',
  example: 'OAC S3 Bucket Policy Statement:\n{\n  "Sid": "AllowCloudFrontServicePrincipal",\n  "Effect": "Allow",\n  "Principal": {\n    "Service": "cloudfront.amazonaws.com"\n  },\n  "Action": "s3:GetObject",\n  "Resource": "arn:aws:s3:::my-secure-bucket/*",\n  "Condition": {\n    "StringEquals": {\n      "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/E1A2B3C4D5E6F7"\n    }\n  }\n}',
  sources: [
    { title: 'Restricting access to an Amazon S3 origin', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html' }
  ]
});
