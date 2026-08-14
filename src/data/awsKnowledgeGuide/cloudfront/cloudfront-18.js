import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cloudfront-18',
  topicId: 'topic-cloudfront',
  topicTitle: 'Amazon CloudFront',
  objectiveCode: 'Networking',
  title: 'CloudFront Signed Cookies',
  status: 'ready',
  plainEnglish: 'CloudFront Signed Cookies provide authentication information in HTTP request cookies rather than in the URL query string. Like Signed URLs, Signed Cookies restrict access to private content using public/private key cryptographic signatures. However, because cookies are automatically sent with every request to a domain, a single Signed Cookie can grant a user access to multiple restricted files, entire directories, or an entire subscriber-only site without changing the URL paths.',
  whyItMatters: 'Signed Cookies are ideal for subscription-based web applications, HLS video streaming (where video players request hundreds of small .ts segment files), or website sections with multiple private assets. Users don\'t need custom signed links for every individual file or image.',
  workplaceExample: 'A subscription streaming app logs in a paying user and sets three CloudFront Signed Cookies (CloudFront-Policy, CloudFront-Signature, CloudFront-Key-Pair-Id) in their browser. As the user navigates the app, their browser automatically sends these cookies with every request, seamlessly unlocking hundreds of video fragments and images under /subscriber/*.',
  examFocus: 'SAA-C03 distinction:\n- Use Signed Cookies when you want to grant access to MULTIPLE restricted files or an ENTIRE directory (e.g. HLS video streams or subscriber portal).\n- Use Signed Cookies when you do not want to change current application URLs.\n- Use Signed URLs for single file downloads or clients that do not support cookies.',
  keyPoints: [
    'Grants access to multiple restricted files or path patterns.',
    'Browser automatically sends cookies with all requests to the domain.',
    'Ideal for HLS/DASH media streaming and subscription portals.',
    'Requires setting three HTTP cookies: Policy, Signature, and Key-Pair-Id.',
    'Uses CloudFront Key Groups to manage trusted public keys.'
  ],
  commonMistake: 'Attempting to use Signed Cookies for a mobile application or third-party web service client that does not store or forward HTTP cookies. Use Signed URLs for clients lacking cookie support.',
  example: 'HTTP Response Headers setting CloudFront Signed Cookies:\nSet-Cookie: CloudFront-Policy=eyJTdGF0ZW1lbnQiOi...; Domain=.example.com; Secure; HttpOnly\nSet-Cookie: CloudFront-Signature=d41d8cd98f00b2...; Domain=.example.com; Secure; HttpOnly\nSet-Cookie: CloudFront-Key-Pair-Id=K2JC7ABCDEFG; Domain=.example.com; Secure; HttpOnly',
  sources: [
    { title: 'Using signed cookies', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-cookies.html' }
  ]
});
