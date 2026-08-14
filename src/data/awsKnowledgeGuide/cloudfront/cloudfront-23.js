import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-23',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront HTTPS and TLS Certificates',
  status: 'ready',
  plainEnglish: 'CloudFront supports HTTPS end-to-end to encrypt data in transit between viewers and edge locations, as well as between edge locations and origin servers. To serve content securely over custom domain names (e.g. https://www.example.com), you attach an SSL/TLS certificate from AWS Certificate Manager (ACM) or import a custom certificate into ACM. CloudFront also allows enforcing modern security policies (minimum TLS protocol versions like TLSv1.2_2021) to eliminate weak ciphers.',
  whyItMatters: 'HTTPS encrypts sensitive user data (passwords, credit card numbers, personal info) preventing eavesdropping and tampering over public networks. Browsers flag non-HTTPS websites as unsafe, hurting user trust and search engine rankings.',
  workplaceExample: 'An online store sets up custom domain shop.example.com on CloudFront. They request a free SSL certificate in AWS Certificate Manager (ACM) in us-east-1 and attach it to the CloudFront distribution. CloudFront serves HTTPS requests seamlessly with SNI (Server Name Indication) support.',
  examFocus: 'Crucial SAA-C03 requirement: To use an ACM SSL/TLS certificate with CloudFront, the ACM certificate MUST be requested or imported in the us-east-1 (N. Virginia) region. Certificates requested in other regions (e.g. us-west-2 or eu-central-1) cannot be attached to CloudFront.',
  keyPoints: [
    'CloudFront encrypts traffic in transit between Viewers and Edge, and Edge and Origin.',
    'ACM certificates for CloudFront MUST be in the us-east-1 region.',
    'Supports Server Name Indication (SNI) for serving HTTPS across custom domain names at no extra cost.',
    'Supports configuring Security Policies to enforce minimum TLS protocol versions (e.g., TLS 1.2).',
    'Custom domain names (CNAMEs) must be listed in the distribution settings alongside matching ACM certificate.'
  ],
  commonMistake: 'Requesting an ACM SSL certificate in us-west-2 where your S3 bucket lives and wondering why CloudFront cannot see or attach the certificate. ACM certificates for CloudFront MUST be in us-east-1.',
  example: 'Custom Domain HTTPS Setup:\nDomain: `app.mycompany.com`\nACM Certificate ARN: `arn:aws:acm:us-east-1:123456789012:certificate/abc-123`\nSSL/TLS Method: SNI Only (Server Name Indication)\nMinimum Security Policy: `TLSv1.2_2021`',
  sources: [
    { title: 'Using HTTPS with CloudFront', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https.html' }
  ]
});
