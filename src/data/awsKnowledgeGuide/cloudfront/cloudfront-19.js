import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-19',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Geo Restriction',
  status: 'ready',
  plainEnglish: 'CloudFront Geo Restriction (also known as Geoblocking) allows you to restrict user access to your content based on the geographic location of the user. You can configure an allow list (permitting requests only from specific countries) or a deny list (blocking requests from specific countries). CloudFront uses a third-party GeoIP database to look up the IP address of incoming viewer requests and matches it to a country code (e.g. US, GB, JP).',
  whyItMatters: 'Geo restriction helps businesses comply with legal licensing rights, copyright agreements, sanctions, or regulatory mandates that restrict distribution of digital content, sports broadcasts, or financial services to specific geographic territories.',
  workplaceExample: 'A sports broadcasting network holds exclusive rights to stream premier league matches only within the United Kingdom. By setting up a CloudFront Geo Restriction allow list containing only GB, viewers connecting from outside the UK receive an HTTP 403 Forbidden error page automatically at the CloudFront edge.',
  examFocus: 'For SAA-C03, remember:\n- CloudFront native Geo Restriction works at the COUNTRY level.\n- If a scenario requires blocking traffic based on fine-grained criteria (such as state, zip code, city, or advanced IP reputation logic), use AWS WAF geo match conditions integrated with CloudFront rather than CloudFront native Geo Restriction.',
  keyPoints: [
    'Restricts access based on geographic country codes (ISO 3166-1 alpha-2).',
    'Supports either an Allow List or a Deny List (cannot combine both on one distribution).',
    'Evaluated at CloudFront edge locations before fetching content from origin.',
    'Returns HTTP 403 Forbidden to blocked geographic locations.',
    'Use AWS WAF for advanced, granular geographic filtering beyond country codes.'
  ],
  commonMistake: 'Trying to create both an Allow List and a Deny List in CloudFront Geo Restriction. You must select either Allow List OR Deny List for a distribution.',
  example: 'CloudFront Distribution Restrictions Configuration:\nGeoRestriction:\n  RestrictionType: whitelist\n  Quantity: 2\n  Items: ["US", "CA"]\nResult: Requests originating outside the US and Canada are blocked with HTTP 403.',
  sources: [
    { title: 'Restricting the geographic distribution of your content', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/georestrict.html' }
  ]
});
