import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-27',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Cache Invalidation',
  status: 'ready',
  plainEnglish: 'CloudFront Cache Invalidation is the process of manually removing cached files from CloudFront edge locations before their TTL (Time to Live) expires. When you invalidate a file or directory, CloudFront removes it from edge caches worldwide so that the next user request causes CloudFront to fetch the latest version of the file directly from the origin server.',
  whyItMatters: 'During web application updates, breaking bug fixes, or emergency content changes, waiting for TTLs to expire (which could be hours or days) is unacceptable. Invalidation allows instant deployment of fresh static assets.',
  workplaceExample: 'A web developer updates a production CSS stylesheet style.css on S3. Since the file has a 30-day TTL, returning users would keep seeing the old layout. The developer runs a CloudFront invalidation for /css/style.css (or /*), forcing edge locations globally to fetch the new CSS from S3 immediately.',
  examFocus: 'For SAA-C03, understand invalidations vs versioned filenames:\n- Cache Invalidation explicitly purges files (e.g., /images/logo.png or /* wildcard). Charges apply after the first 1,000 free paths per month.\n- Versioned Filenames (Best Practice): Name files with version hashes (e.g. style.v2.css or app.a1b2c3.js). This requires zero invalidation cost, retains cache efficiency, and eliminates invalidation delays.',
  keyPoints: [
    'Removes objects from CloudFront edge caches before TTL expires.',
    'Supports specific file paths (/index.html) and wildcard paths (/images/* or /*).',
    'Invalidating /* clears the entire distribution cache globally.',
    'First 1,000 invalidation paths per month are free; additional paths cost $0.005 per path.',
    'Versioning file names (e.g., main.12345.js) is the recommended cost-effective alternative.'
  ],
  commonMistake: 'Relying on frequent manual invalidations for continuous delivery pipelines instead of using versioned filenames. Versioned filenames are instant, free, and avoid cache invalidation limits.',
  example: 'AWS CLI Command for Invalidation:\n`aws cloudfront create-invalidation --distribution-id E1A2B3C4D5E6F7 --paths "/index.html" "/css/*"`',
  sources: [
    { title: 'Invalidating files to remove content', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html' }
  ]
});
