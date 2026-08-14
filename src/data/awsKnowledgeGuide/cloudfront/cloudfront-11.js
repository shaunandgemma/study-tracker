import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-11',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'Application Load Balancer and Custom Origins',
  status: 'ready',
  plainEnglish: 'A Custom Origin is any origin server that is not a standard S3 bucket REST API, such as an Application Load Balancer (ALB), EC2 instance, API Gateway, or an on-premises HTTP server. When an ALB is configured as a CloudFront origin, CloudFront routes incoming user traffic to the ALB over HTTP or HTTPS. Unlike static S3 origins, ALBs handle dynamic requests, session state, backend routing to microservices, and live data rendering.',
  whyItMatters: 'Putting CloudFront in front of an Application Load Balancer provides major benefits: edge SSL/TLS termination, caching of GET responses at the edge, DDoS protection with AWS Shield, request filtering with AWS WAF, and optimized network routing over the AWS global backbone from edge locations to the ALB.',
  workplaceExample: 'A banking platform uses an Application Load Balancer in AWS to distribute traffic across a fleet of backend microservices. CloudFront is placed in front of the ALB. CloudFront terminates TLS close to the user, caches static API reference data, forwards dynamic transactional requests over persistent TCP connections to the ALB, and blocks malicious SQL injection attempts using AWS WAF at the edge.',
  examFocus: 'For SAA-C03, know how to secure an ALB when CloudFront is in front of it so users cannot bypass CloudFront and hit the ALB directly. Recommended methods: (1) Use VPC Security Groups with AWS Managed Prefix Lists for CloudFront to only allow CloudFront IP addresses, or (2) Configure CloudFront to add a custom HTTP header (e.g. X-Custom-Header: SecretValue) and set ALB listener rules to block requests missing that header.',
  keyPoints: [
    'Custom origins include ALBs, EC2 instances, API Gateways, and non-AWS web servers.',
    'CloudFront connects to custom origins via HTTP or HTTPS over custom ports (80, 443).',
    'Secure ALBs behind CloudFront using CloudFront VPC Security Group Prefix Lists or custom request headers.',
    'CloudFront maintains persistent HTTP connections (keep-alive) to custom origins to lower latency.',
    'ALBs dynamic content is typically passed through CloudFront with caching disabled (TTL = 0) or short TTLs.'
  ],
  commonMistake: 'Leaving an Application Load Balancer open to 0.0.0.0/0 in its security group after placing CloudFront in front of it. Attackers can bypass CloudFront security rules, WAF, and edge caching by sending requests straight to the public ALB DNS name.',
  example: 'CloudFront Custom Origin Configuration:\nDomain Name: `my-alb-123456789.us-east-1.elb.amazonaws.com`\nHTTP Port: 80, HTTPS Port: 443\nOrigin Protocol Policy: HTTPS Only\nCustom Headers: Header Name = `X-Origin-Verify`, Value = `SuperSecretToken123`',
  sources: [
    { title: 'Working with origins', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Origins.html' }
  ]
});
