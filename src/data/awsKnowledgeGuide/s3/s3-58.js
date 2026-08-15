import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-58",
  "title": "S3 Presigned URLs",
  "plainEnglish": "An Amazon S3 Presigned URL is a cryptographically signed web link that grants temporary, time-limited permission to download (HTTP `GET`) or upload (HTTP `PUT`) a specific S3 object without requiring the client to have an AWS account or IAM credentials. An authorized IAM principal generates the URL using their own security credentials, embedding a cryptographic signature and an expiration timer directly into the URL query parameters.",
  "whyItMatters": "Allowing web or mobile users to upload user avatars or download private premium video files directly from S3 eliminates the need to route gigabytes of file traffic through backend API servers, saving server CPU, memory, and bandwidth. S3 Presigned URLs provide secure, direct-to-S3 client access while keeping the underlying bucket strictly private.",
  "workplaceExample": "A digital document signing application allows users to upload confidential contracts. When a user clicks 'Upload Document', the web app asks its backend API for a presigned upload URL. The backend Lambda function verifies the user's login session and generates an S3 Presigned PUT URL for `contracts/user-101/contract.pdf` with a 15-minute expiration. The browser uploads the 25 MB PDF directly to S3; the bucket remains 100% private.",
  "examFocus": "Understand Presigned URL security rules and constraints: (1) Permission Scope: A presigned URL inherits the EXACT permissions of the IAM principal that created it; if the creator's IAM role lacks `s3:GetObject`, the URL fails with HTTP 403. (2) Expiration Limits: Generated with IAM user credentials can expire in up to 7 days; generated with temporary STS credentials (e.g., Lambda execution role or IAM role) expires when the STS token expires (maximum 36 hours). (3) Bearer Token: Anyone possessing the link can access the object until expiration.",
  "keyPoints": [
    "Grants temporary, time-limited access to download or upload specific S3 objects.",
    "Eliminates the need to grant AWS credentials or public access to end users.",
    "Cryptographically signed by the creator's IAM user or temporary STS role credentials.",
    "Inherits the exact permissions of the creating principal at the time of access.",
    "Expiration can be configured up to 7 days (or max 36 hours for temporary STS credentials).",
    "Acts as a bearer token; should be transmitted securely over HTTPS and protected from exposure."
  ],
  "commonMistake": "Generating a presigned URL using a temporary IAM execution role (like inside an AWS Lambda function) with a 7-day expiration. Because temporary STS credentials expire in a few hours, the presigned URL will stop working when the temporary STS session expires, regardless of the requested 7-day parameter.",
  "example": "Generate a 1-hour presigned download URL for a private report using the AWS CLI: aws s3 presign s3://private-vault/annual-report.pdf --expires-in 3600.",
  "sources": [
    {
      "title": "Sharing Objects with Presigned URLs in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html"
    },
    {
      "title": "Uploading Objects with Presigned URLs in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html"
    }
  ]
});
