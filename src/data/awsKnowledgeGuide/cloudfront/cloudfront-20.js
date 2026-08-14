import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-20',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Origin Failover',
  status: 'ready',
  plainEnglish: 'CloudFront Origin Failover (configured using Origin Groups) provides high availability and automatic failover for your origin servers. An Origin Group consists of a primary origin and a secondary (backup) origin. If CloudFront receives an HTTP error status code (such as 500, 502, 503, 504, 403, or 404) or a connection timeout from the primary origin, CloudFront automatically reroutes the request to the secondary origin without returning an error to the user.',
  whyItMatters: 'Origin failover ensures your web application stays online even during backend outages, primary AWS region disruptions, or maintenance windows. It enables seamless disaster recovery for both static content and dynamic web applications.',
  workplaceExample: 'A retail company hosts its primary website assets in an S3 bucket in us-east-1 and a backup copy in us-west-2. They configure a CloudFront Origin Group with us-east-1 as primary and us-west-2 as secondary for 500/503 status codes. When an S3 outage hits us-east-1, CloudFront instantly fetches files from us-west-2 so shoppers experience zero downtime.',
  examFocus: 'SAA-C03 scenarios requiring high availability, low recovery time objective (RTO), and multi-region origin disaster recovery frequently test CloudFront Origin Groups. Remember: failover occurs when the primary origin returns specified HTTP 4xx/5xx status codes or fails to respond within connection timeouts.',
  keyPoints: [
    'Origin Groups contain a Primary Origin and a Secondary (Failover) Origin.',
    'Configured for specific criteria: HTTP status codes (500, 502, 503, 504, 403, 404) or timeouts.',
    'Reroutes traffic to secondary origin transparently to the viewer.',
    'Works across multi-region origins (e.g. S3 bucket in us-east-1 and S3 bucket in eu-west-1).',
    'Improves application availability and disaster recovery RTO.'
  ],
  commonMistake: 'Assuming CloudFront Origin Groups perform load balancing between primary and secondary origins. Origin Groups are for ACTIVE-PASSIVE FAILOVER only, not active-active round-robin routing.',
  example: 'Origin Group Setup:\nPrimary Origin: `s3-primary.s3.us-east-1.amazonaws.com`\nSecondary Origin: `s3-backup.s3.us-west-2.amazonaws.com`\nFailover Criteria: Status codes 500, 502, 503, 504, connection timeouts.\nResult: If primary returns 503 Service Unavailable, CloudFront automatically fetches from secondary.',
  sources: [
    { title: 'Optimizing high availability with CloudFront origin failover', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high-availability-with-cloud-front-origin-groups.html' }
  ]
});
