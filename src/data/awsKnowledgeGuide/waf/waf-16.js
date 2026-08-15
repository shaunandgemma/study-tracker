import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'waf-16',
  topicId: 'topic-waf',
  topicTitle: 'AWS WAF',
  objectiveCode: 'Security',
  title: 'WAF on Amazon CloudFront',
  status: 'ready',
  plainEnglish: 'Deploying AWS WAF on Amazon CloudFront integrates your Web ACL directly with CloudFront’s worldwide network of edge locations and points of presence (PoPs). When end users make HTTP or HTTPS requests, AWS WAF evaluates and filters the traffic at the CloudFront edge location nearest to the client—blocking malicious payloads, bad bots, and DDoS floods globally before that unauthorized traffic ever crosses into your AWS Regions or reaches your origin infrastructure (such as ALBs, EC2 instances, or S3 buckets).',
  whyItMatters: 'Filtering malicious traffic at the edge reduces latency for legitimate users while completely shielding backend infrastructure from malicious load. Attacks are absorbed and terminated across hundreds of distributed edge locations, preventing bandwidth saturation and compute exhaustion on origin servers while reducing data transfer out costs.',
  workplaceExample: 'A global media streaming platform uses Amazon CloudFront to deliver static assets and stream live events. By attaching a Global Web ACL to the CloudFront distribution, geographical restrictions block sanctioned regions, rate-based rules mitigate volumetric scraper bots at the nearest edge PoP, and SQLi filters protect the origin API. Origin web servers only receive clean, pre-validated HTTP requests.',
  examFocus: 'SAA-C03 core points: (1) Scope Requirement: Web ACLs attached to CloudFront MUST be created with the Global scope (`CLOUDFRONT`), which is managed through the `us-east-1` (N. Virginia) AWS Region. (2) Origin Protection: Protect origin ALBs from direct bypass by requiring a custom header (e.g., `X-Origin-Verify`) inserted by CloudFront or using CloudFront Origin Access Control (OAC) / security groups with CloudFront prefix lists. (3) Edge-Based Filtering: Absorbs DDoS and malicious attacks globally, keeping origin compute costs low.',
  keyPoints: [
    'Filters and mitigates malicious Layer 7 web traffic at CloudFront edge locations globally.',
    'Web ACLs for CloudFront must be created in the Global (`CLOUDFRONT` / `us-east-1`) scope.',
    'Stops malicious requests, bots, and Layer 7 DDoS floods before reaching regional origin servers.',
    'Protects origin services including Application Load Balancers, Amazon EC2, Amazon S3, and on-premises servers.',
    'Reduces origin bandwidth consumption and prevents server compute exhaustion.',
    'Origin security should enforce custom verification headers or CloudFront managed prefix lists to prevent direct bypass.'
  ],
  commonMistake: 'Creating a Regional Web ACL in `eu-west-1` or `ap-southeast-1` and attempting to associate it with an Amazon CloudFront distribution. CloudFront distributions are global resources and only accept Web ACLs created in the Global (`CLOUDFRONT`) scope via the `us-east-1` region.',
  example: 'Associate a global Web ACL with a CloudFront distribution via the AWS CLI: aws cloudfront update-distribution --id E1234EXAMPLE --distribution-config file://dist-config-with-web-acl.json (where WebACLId is set to the Global Web ACL ARN in us-east-1).',
  sources: [
    {
      title: 'Using AWS WAF with Amazon CloudFront',
      url: 'https://docs.aws.amazon.com/waf/latest/developerguide/cloudfront-features.html'
    },
    {
      title: 'How CloudFront and AWS WAF Work Together',
      url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-awswaf.html'
    }
  ]
});
