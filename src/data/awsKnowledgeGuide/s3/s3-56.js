import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-56",
  "title": "S3 Static Website Hosting",
  "plainEnglish": "Amazon S3 Static Website Hosting is a bucket configuration feature that allows an S3 bucket to behave as a standard web server for static client-side web assets (such as HTML, CSS, JavaScript, fonts, and images). When enabled, S3 generates a specialized website endpoint URL, automatically serves an index document (e.g., `index.html`) when users request root paths, and serves a custom error document (e.g., `404.html`) when pages are not found.",
  "whyItMatters": "Hosting static front-end websites on dedicated web server instances (such as Apache or NGINX on EC2) requires operating system patching, auto-scaling configuration, and server maintenance costs. S3 Static Website Hosting provides virtually infinite scaling and high availability with zero server management at minimal storage cost.",
  "workplaceExample": "A marketing agency deploys a corporate product landing page built with React/Vite. The build artifacts (`index.html`, `assets/bundle.js`, `style.css`) are uploaded to an S3 bucket. The team configures S3 static website hosting with index document `index.html` and error document `index.html` (for client-side routing). To provide HTTPS and custom domain support (`www.product.com`), they deploy an Amazon CloudFront distribution with Origin Access Control in front of the bucket.",
  "examFocus": "Understand S3 Static Website Hosting architecture and HTTPS limitations: (1) Endpoint Format: `<bucket-name>.s3-website-<AWS-Region>.amazonaws.com` or `<bucket-name>.s3-website.<AWS-Region>.amazonaws.com`. (2) NO Native HTTPS: S3 website endpoints support HTTP ONLY (they do NOT support custom SSL/TLS certificates). (3) CloudFront Requirement: To serve an S3 static website with HTTPS and a custom domain, you MUST use Amazon CloudFront with AWS Certificate Manager (ACM). (4) Index & Error Documents: Configured for default landing page and 4xx/5xx error handling.",
  "keyPoints": [
    "Configures an Amazon S3 bucket to serve static client-side web applications and HTML assets.",
    "Provides dedicated website endpoints formatted as `<bucket-name>.s3-website-<Region>.amazonaws.com`.",
    "Supports index document (`index.html`) and custom error document (`error.html`) routing.",
    "S3 website endpoints natively support HTTP ONLY; they do NOT support custom SSL/TLS certificates.",
    "Pairing with Amazon CloudFront and AWS Certificate Manager (ACM) is required for custom domains and HTTPS.",
    "Eliminates server provisioning, scaling groups, and OS patching for static web hosting."
  ],
  "commonMistake": "Attempting to attach a custom SSL/TLS certificate directly to an S3 static website endpoint. S3 website endpoints do not support HTTPS with custom certificates; you must use an Amazon CloudFront distribution with an ACM SSL certificate in front of the bucket.",
  "example": "Configure static website hosting on a bucket using the AWS CLI: aws s3 website s3://marketing-landing-page/ --index-document index.html --error-document 404.html.",
  "sources": [
    {
      "title": "Hosting a Static Website Using Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"
    },
    {
      "title": "Amazon S3 Website Endpoints and Domain Formats",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html"
    }
  ]
});
