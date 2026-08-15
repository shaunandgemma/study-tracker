import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-26",
  "title": "S3 CORS",
  "plainEnglish": "Cross-Origin Resource Sharing (CORS) in Amazon S3 is a security mechanism that allows web browsers running client-side JavaScript applications on one domain (e.g., `https://www.mywebsite.com`) to interact with, download, or upload resources stored in an S3 bucket on a different domain (e.g., `https://my-assets-bucket.s3.amazonaws.com`). By default, web browsers block cross-origin requests unless the target S3 bucket explicitly provides a CORS configuration permitting the origin domain.",
  "whyItMatters": "Modern web applications frequently offload heavy client uploads (via S3 Presigned URLs) or load web fonts, CSS assets, and images directly from S3 buckets. Without an explicit S3 CORS configuration, the user's web browser will reject these cross-origin requests with a `CORS policy` error, causing broken web pages or failed client uploads.",
  "workplaceExample": "A single-page React application hosted on `https://app.saasplatform.com` allows users to upload profile photos directly to S3 using JavaScript presigned URLs. To enable direct browser uploads, the developers configure a CORS rule on the `saas-user-uploads` S3 bucket allowing origin `https://app.saasplatform.com`, methods `PUT` and `POST`, and headers `*`. The user's browser performs a preflight `OPTIONS` request, receives the CORS header, and uploads the image smoothly.",
  "examFocus": "Understand S3 CORS elements and troubleshooting: (1) `AllowedOrigins`: Domains permitted to make requests (e.g., `https://example.com` or `*`). (2) `AllowedMethods`: HTTP methods permitted (`GET`, `PUT`, `POST`, `DELETE`, `HEAD`). (3) `AllowedHeaders`: Headers allowed in preflight requests (e.g., `Authorization`, `Content-Type`, `*`). (4) `MaxAgeSeconds`: Time in seconds that the browser caches the preflight response. (5) `ExposeHeaders`: Headers in the S3 response that JavaScript can read (e.g., `ETag`).",
  "keyPoints": [
    "Defines which external web origins are permitted to access S3 bucket resources via client-side JavaScript.",
    "Required when client web applications fetch fonts, media, or upload files directly to S3 across domains.",
    "Evaluates browser preflight HTTP `OPTIONS` requests and returns CORS response headers.",
    "Configured using JSON/XML defining AllowedOrigins, AllowedMethods, AllowedHeaders, and MaxAgeSeconds.",
    "Supports wildcards (`*`) for origins and headers, though specific origins are recommended for security.",
    "CORS is enforced strictly by the client's web browser, not by server-side backend API calls."
  ],
  "commonMistake": "Attempting to troubleshoot CORS issues by updating S3 Bucket Policies or IAM policies. CORS is a browser-enforced security check; if a browser blocks a cross-origin request, you must configure S3 CORS on the bucket, not IAM permissions.",
  "example": "Configure a CORS policy in JSON allowing GET and PUT requests from a specific web application: [{\"AllowedHeaders\": [\"*\"], \"AllowedMethods\": [\"GET\", \"PUT\"], \"AllowedOrigins\": [\"https://app.mycompany.com\"], \"ExposeHeaders\": [\"ETag\"], \"MaxAgeSeconds\": 3000}].",
  "sources": [
    {
      "title": "Using Cross-Origin Resource Sharing (CORS) in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html"
    },
    {
      "title": "Managing CORS on an Amazon S3 Bucket",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManageCorsUsing.html"
    }
  ]
});
