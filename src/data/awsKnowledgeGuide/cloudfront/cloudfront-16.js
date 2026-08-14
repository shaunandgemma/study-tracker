import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-16',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Origin Access Identity - OAI Legacy',
  status: 'ready',
  plainEnglish: 'Origin Access Identity (OAI) is a legacy feature used to restrict access to Amazon S3 buckets so users can only view objects through CloudFront. OAI creates a virtual IAM user identity associated with your CloudFront distribution. You then grant s3:GetObject permission to this OAI identity in the S3 bucket policy. While OAI is still supported for backward compatibility in older distributions, AWS recommends upgrading all legacy OAIs to Origin Access Control (OAC).',
  whyItMatters: 'Understanding OAI is important when managing older AWS infrastructure or preparing for AWS certification exams. However, OAI lacks support for newer AWS features like SSE-KMS customer-managed keys, HTTP POST requests, and AWS regions launched after December 2022.',
  workplaceExample: 'A system administrator auditing a legacy AWS account discovers an S3 bucket policy granting access to arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E1234567890. The administrator migrates the bucket policy and CloudFront distribution configuration to OAC to enable SSE-KMS encryption support.',
  examFocus: 'For SAA-C03, if an exam option lists both OAI and OAC for a new S3 distribution architecture, OAC is the correct answer. If a scenario specifically asks about SSE-KMS or new regions, OAI will NOT work and OAC must be used.',
  keyPoints: [
    'OAI is the legacy method for securing S3 origins behind CloudFront.',
    'Creates a special IAM virtual user (arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity...).',
    'Does NOT support SSE-KMS encrypted objects.',
    'Does NOT support HTTP POST/PUT methods or AWS regions created after Dec 2022.',
    'AWS recommends migrating from OAI to OAC.'
  ],
  commonMistake: 'Attempting to use OAI to access S3 objects encrypted with AWS Key Management Service (SSE-KMS). OAI does not support SSE-KMS headers; requests will fail with HTTP 403. You must use OAC instead.',
  example: 'Legacy OAI Bucket Policy Principal:\n"Principal": {\n  "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E123456789012"\n}',
  sources: [
    { title: 'Restricting access to an Amazon S3 origin', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html' }
  ]
});
