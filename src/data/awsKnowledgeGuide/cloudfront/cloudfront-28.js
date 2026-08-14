import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-28',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Price Classes',
  status: 'ready',
  plainEnglish: 'CloudFront Price Classes allow you to reduce your CloudFront costs by selecting which global edge locations are used to serve your content. CloudFront categorizes its edge locations into geographic tiers based on operational costs. You can choose from three price classes: Price Class All (uses all edge locations globally for maximum performance), Price Class 200 (includes most regions except high-cost ones like South America and Australia), and Price Class 100 (includes only the lowest-cost regions: North America and Europe).',
  whyItMatters: 'Edge location operational costs vary by region. If your target audience is located primarily in North America and Europe, selecting Price Class 100 significantly lowers your CDN bill without impacting latency for your primary user base.',
  workplaceExample: 'A European startup launches a local news blog targeting viewers in France and Germany. To minimize AWS infrastructure expenditure, they select PriceClass_100. European users experience lightning-fast delivery from European edge nodes. If a user in Brazil visits the site, CloudFront routes them to a North American edge location, maintaining connectivity while saving costs.',
  examFocus: 'SAA-C03 questions on cost optimization for CloudFront will highlight Price Classes. Selecting Price Class 100 or 200 does NOT block users in excluded regions; instead, CloudFront routes those viewers to an edge location in a supported price class tier (which increases latency slightly for those users but lowers overall cost).',
  keyPoints: [
    'Price Class All: Uses all global edge locations (highest performance, highest cost).',
    'Price Class 200: Includes North America, Europe, Asia, Middle East, Africa (excludes highest cost nodes).',
    'Price Class 100: Includes only North America and Europe (lowest cost).',
    'Viewers in excluded regions are routed to edge locations in the nearest included price class tier.',
    'Changing price classes reduces cost without breaking geographic accessibility.'
  ],
  commonMistake: 'Thinking Price Class 100 blocks users outside North America and Europe. It does not block traffic; it reroutes outside traffic to North American or European edge nodes, which adds latency for out-of-region users.',
  example: 'CloudFront Price Class Settings:\nPrice Class: `PriceClass_100`\nIncluded Regions: United States, Canada, Europe.\nResult: Lower monthly data transfer charges.',
  sources: [
    { title: 'Choosing the price class for a CloudFront distribution', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html' }
  ]
});
