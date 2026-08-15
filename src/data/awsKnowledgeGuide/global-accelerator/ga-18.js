import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-global-accelerator",
  "topicTitle": "AWS Global Accelerator",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "ga-18",
  "title": "Global Accelerator vs Amazon CloudFront",
  "plainEnglish": "Amazon CloudFront is a content delivery network that can cache and deliver supported web content from edge locations. Global Accelerator is a network acceleration service that routes TCP or UDP connections through the AWS global network to Regional application endpoints without caching their content.",
  "whyItMatters": "The choice depends on what must be accelerated. Cached images, scripts, downloads, and web delivery fit CloudFront; fixed global addresses, rapid endpoint redirection, and non-HTTP connection paths fit Global Accelerator.",
  "workplaceExample": "A game publisher uses CloudFront for downloadable patches and images, while Global Accelerator carries latency-sensitive UDP gameplay traffic to healthy game services. Each service handles a different part of the experience.",
  "examFocus": "Choose CloudFront when edge caching and HTTP content delivery are central. Choose Global Accelerator for static anycast entry addresses, improved TCP or UDP paths, or health-based Regional endpoint selection. They can be combined and neither is universally better.",
  "keyPoints": [
    "CloudFront caches supported static and dynamic web content according to its configuration.",
    "Global Accelerator does not cache application content.",
    "CloudFront distributions use origins and viewer requests for web delivery.",
    "Global Accelerator standard accelerators use listeners, endpoint groups, and endpoints.",
    "Global Accelerator supports TCP and UDP application traffic, including non-HTTP protocols.",
    "An architecture can use CloudFront for cacheable assets and Global Accelerator for separate interactive traffic."
  ],
  "commonMistake": "Selecting Global Accelerator to reduce origin load through caching will not work because it forwards connections rather than storing edge copies of content.",
  "example": "Serve a web application's images and JavaScript through CloudFront with an S3 origin, while directing its real-time UDP collaboration channel through Global Accelerator to multi-Region service endpoints.",
  "sources": [
    {
      "title": "What is Amazon CloudFront?",
      "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html"
    },
    {
      "title": "What is AWS Global Accelerator?",
      "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html"
    }
  ]
});
