import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-36",
  "title": "S3 Server-Side Encryption with Customer-Provided Keys - SSE-C",
  "plainEnglish": "Server-Side Encryption with Customer-Provided Keys (SSE-C) is an encryption option where the customer maintains and manages their own 256-bit encryption keys on-premises, while Amazon S3 performs the computational encryption and decryption of object data as it is written to and read from disk. The customer must pass the 256-bit encryption key and its MD5 checksum in HTTPS headers with every single upload and download request; Amazon S3 never stores or persists the customer's key.",
  "whyItMatters": "Certain highly regulated organizations (such as sovereign wealth funds or intelligence agencies) operate under strict compliance mandates that prohibit storing cryptographic master keys in the cloud. SSE-C allows organizations to leverage AWS's scalable server-side encryption infrastructure while retaining 100% exclusive on-premises ownership and custody of their encryption keys.",
  "workplaceExample": "A defense contractor manages encryption keys in an on-premises Hardware Security Module (HSM). When uploading satellite reconnaissance imagery to S3, an automated pipeline fetches the 256-bit key from the local HSM, computes its MD5 hash, and includes both in the HTTPS PUT request headers. S3 encrypts the image, writes it to disk, and immediately purges the key from memory. When downloading, the pipeline supplies the key again for on-the-fly decryption.",
  "examFocus": "Understand SSE-C mechanics and constraints: (1) Mandatory HTTPS: SSE-C requests MUST use HTTPS; S3 rejects any SSE-C request made over plain HTTP. (2) Required Headers: `x-amz-server-side-encryption-customer-algorithm: AES256`, `x-amz-server-side-encryption-customer-key: [base64-key]`, `x-amz-server-side-encryption-customer-key-MD5: [base64-md5]`. (3) Lost Key Risk: If the customer loses the encryption key, S3 CANNOT recover the data (unrecoverable data loss). (4) AWS Management Console: The S3 web console CANNOT be used to view or download SSE-C encrypted objects.",
  "keyPoints": [
    "Customer manages and stores the encryption keys; Amazon S3 manages encryption and decryption.",
    "Customer must supply the 256-bit key and MD5 checksum in HTTPS headers for every read and write.",
    "Amazon S3 never stores, logs, or persists the customer's encryption key.",
    "All requests MUST be transmitted over secure HTTPS (TLS); plain HTTP is rejected.",
    "If the customer loses the encryption key, the stored data is permanently unrecoverable.",
    "Objects encrypted with SSE-C cannot be viewed or downloaded via the AWS Management Console."
  ],
  "commonMistake": "Attempting to download an SSE-C object from the AWS Management Console. The AWS Console does not accept customer-provided encryption keys; all SSE-C object access must be performed via the AWS CLI, SDK, or REST API supplying the key headers.",
  "example": "Upload an object using SSE-C with a local 256-bit key using the AWS CLI: aws s3 cp sensitive.dat s3://my-ssec-bucket/sensitive.dat --sse-c AES256 --sse-c-key fileb://mykey.bin.",
  "sources": [
    {
      "title": "Server-Side Encryption with Customer-Provided Keys (SSE-C)",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html"
    },
    {
      "title": "Protecting Data at Rest in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html"
    }
  ]
});
