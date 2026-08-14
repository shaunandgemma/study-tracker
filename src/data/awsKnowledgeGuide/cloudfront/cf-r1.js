import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cf-r1',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'Origin Access Control (OAC) vs Origin Access Identity (OAI) - OAC is the Modern Preferred Approach',
  status: 'ready',
  plainEnglish: 'Origin Access Control (OAC) and Origin Access Identity (OAI) are both mechanisms used to secure Amazon S3 buckets so that users can only access content through an Amazon CloudFront distribution, not directly via S3 URLs. OAI is a legacy feature that only supports standard S3 buckets in default AWS regions and does not support SSE-KMS encryption, HTTP POST requests, or new AWS regions. OAC is the modern replacement that supports all S3 buckets in all regions, SSE-KMS encrypted objects, dynamic HTTP methods (like PUT/POST), and AWS Elemental MediaStore origins.',
  whyItMatters: 'Exposing S3 buckets publicly creates severe security vulnerabilities, such as data leakage or unexpected bandwidth charges. OAC enforces strict access control by forcing all traffic through CloudFront edge locations, enabling WAF filtering, SSL/TLS encryption, and edge caching while keeping the S3 origin entirely private.',
  workplaceExample: 'A healthcare company hosts medical report downloads in an S3 bucket encrypted with AWS KMS keys (SSE-KMS). When upgrading from legacy OAI to OAC, the security team is able to maintain SSE-KMS encryption and secure all download requests through CloudFront while completely blocking public internet access to the S3 bucket.',
  examFocus: 'For SAA-C03 exam scenarios, OAC is always the recommended AWS best practice for securing S3 origins behind CloudFront. If a question mentions SSE-KMS encrypted S3 buckets, dynamic methods, or newer AWS regions, OAC is required over OAI. Remember that setting up OAC requires two steps: creating the OAC in CloudFront and updating the S3 bucket policy to allow cloudfront.amazonaws.com with a condition for AWS:SourceArn.',
  keyPoints: [
    'OAC is the modern replacement for legacy OAI and supports all AWS regions and SSE-KMS encryption.',
    'OAC supports all HTTP methods including GET, HEAD, POST, PUT, DELETE, OPTIONS, and PATCH.',
    'OAI is deprecated for new implementations and does not support SSE-KMS or new AWS regions.',
    'OAC works via AWS IAM service principal cloudfront.amazonaws.com paired with AWS:SourceArn in the S3 bucket policy.',
    'Always use OAC when restricting S3 bucket access to CloudFront distributions.'
  ],
  commonMistake: 'Assuming OAI is still recommended because older tutorial materials mention it. OAI is legacy and cannot handle SSE-KMS encrypted S3 objects; OAC must be chosen for security compliance in modern architectures.',
  example: 'S3 Bucket Policy using OAC:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "AllowCloudFrontServicePrincipalReadOnly",\n    "Effect": "Allow",\n    "Principal": { "Service": "cloudfront.amazonaws.com" },\n    "Action": "s3:GetObject",\n    "Resource": "arn:aws:s3:::my-bucket/*",\n    "Condition": {\n      "StringEquals": {\n        "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/ED1234567890"\n      }\n    }\n  }]\n}',
  sources: [
    { title: 'Restricting access to an Amazon S3 origin', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html' }
  ]
});
