import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-38",
  "title": "S3 Enforcing HTTPS with aws:SecureTransport",
  "plainEnglish": "Enforcing HTTPS with `aws:SecureTransport` is an industry-standard security pattern in Amazon S3 that uses an S3 Bucket Policy to strictly require Transport Layer Security (TLS/HTTPS) for all incoming data transfers. By configuring an explicit `Deny` statement when the boolean condition `aws:SecureTransport` is `false`, the S3 bucket immediately rejects any unencrypted HTTP API calls, ensuring that all data in transit across the network is encrypted.",
  "whyItMatters": "Unencrypted HTTP requests transmit data payloads, authentication tokens, and headers in clear text across the internet and internal networks, exposing sensitive enterprise assets to packet sniffing, interception, and man-in-the-middle (MITM) tampering. Enforcing HTTPS is a mandatory baseline requirement under PCI DSS, HIPAA, SOC 2, and FedRAMP security frameworks.",
  "workplaceExample": "A cybersecurity compliance officer conducts a cloud security audit and discovers that internal legacy scripts occasionally communicate with an S3 customer data bucket over plain HTTP port 80. The officer attaches an `EnforceTLSRequestsOnly` bucket policy with an explicit Deny on `aws:SecureTransport=false`. Any legacy HTTP requests are immediately blocked with an HTTP 403 Forbidden error, forcing developers to update their SDKs to use HTTPS.",
  "examFocus": "Know the exact Bucket Policy structure for enforcing HTTPS: (1) Effect: MUST be `Deny`. (2) Principal: `*` (applies to all users/roles). (3) Action: `s3:*`. (4) Resource: BOTH `arn:aws:s3:::bucket-name` AND `arn:aws:s3:::bucket-name/*`. (5) Condition: `{\"Bool\": {\"aws:SecureTransport\": \"false\"}}`. (6) Evaluation: Because an explicit Deny overrides all allows, any request not transmitted via HTTPS (TLS) is immediately denied.",
  "keyPoints": [
    "Enforces in-transit TLS/HTTPS encryption across all bucket operations.",
    "Utilizes the global AWS condition key `aws:SecureTransport` in an S3 Bucket Policy.",
    "Uses an explicit 'Deny' when `aws:SecureTransport` equals `false`.",
    "Blocks unencrypted plain HTTP traffic from both internet and internal VPC sources.",
    "Must apply to both the bucket ARN (`arn:aws:s3:::bucket`) and object wildcard ARN (`arn:aws:s3:::bucket/*`).",
    "Mandatory compliance control for PCI DSS, HIPAA, SOC 2, and ISO 27001 certifications."
  ],
  "commonMistake": "Using `Effect: Allow` with `aws:SecureTransport: true` instead of `Effect: Deny` with `aws:SecureTransport: false`. An Allow statement only permits HTTPS for the specific principals in that statement, but does not prevent other IAM policies from allowing plain HTTP; always use an explicit Deny.",
  "example": "Bucket policy statement enforcing HTTPS in JSON: {\"Sid\": \"AllowSSLRequestsOnly\", \"Effect\": \"Deny\", \"Principal\": \"*\", \"Action\": \"s3:*\", \"Resource\": [\"arn:aws:s3:::corporate-vault\", \"arn:aws:s3:::corporate-vault/*\"], \"Condition\": {\"Bool\": {\"aws:SecureTransport\": \"false\"}}}.",
  "sources": [
    {
      "title": "Amazon S3 Bucket Policy Examples: Requiring HTTPS",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html#example-bucket-policies-encryption"
    },
    {
      "title": "AWS Global Condition Context Keys: aws:SecureTransport",
      "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-securetransport"
    }
  ]
});
