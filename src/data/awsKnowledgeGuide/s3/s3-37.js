import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-37",
  "title": "S3 Client-Side Encryption",
  "plainEnglish": "Client-Side Encryption in Amazon S3 is the process of encrypting your data locally on your client machine or application server BEFORE transmitting it over the network to Amazon S3. Using client-side encryption libraries (such as the Amazon S3 Encryption Client or AWS Encryption SDK), your application generates unique data keys, encrypts the plaintext payload into ciphertext locally, and uploads only the encrypted data to S3. When downloading, the client fetches the ciphertext and decrypts it locally.",
  "whyItMatters": "In zero-trust architectures and extreme regulatory compliance environments, organizations cannot permit cloud storage providers to ever handle unencrypted plaintext or possess encryption keys. Client-side encryption ensures that Amazon S3 acts strictly as a blind storage vault for opaque ciphertext, ensuring data remains completely confidential even in the event of cloud hypervisor or network compromises.",
  "workplaceExample": "A privacy-focused mobile messaging app stores user backup archives in Amazon S3. The mobile application uses the Amazon S3 Encryption Client on the user's smartphone to generate a local AES-GCM key derived from the user's password, encrypting the backup database locally before uploading it to S3. AWS receives and stores only encrypted binary blobs and has zero technical capability to read user messages.",
  "examFocus": "Understand Client-Side Encryption workflows and key providers: (1) Encryption Location: Executed 100% on the client compute host before network transmission. (2) Master Key Options: AWS KMS Key (using `GenerateDataKey` API via KMS) OR a Client-Side Master Key (stored entirely on-premises/client side). (3) S3 Visibility: S3 has zero knowledge of plaintext data, algorithms, or encryption keys. (4) Contrast with Server-Side: Server-Side = S3 encrypts on arrival; Client-Side = Client encrypts before upload.",
  "keyPoints": [
    "Data is encrypted locally on the client host before being transmitted to Amazon S3.",
    "Amazon S3 receives, stores, and serves only encrypted ciphertext blobs.",
    "Decryption is executed locally on the client host after downloading the ciphertext.",
    "Supports AWS KMS keys or client-side customer master keys for envelope encryption.",
    "Guarantees that AWS administrators and infrastructure never have access to unencrypted plaintext.",
    "Implemented using official libraries like the Amazon S3 Encryption Client or AWS Encryption SDK."
  ],
  "commonMistake": "Confusing Client-Side Encryption with Server-Side Encryption (SSE). With SSE, AWS S3 receives plaintext over HTTPS and encrypts it on S3 storage servers; with Client-Side Encryption, the client encrypts data before sending, so plaintext never leaves the client host.",
  "example": "Encrypt an object client-side using the Amazon S3 Encryption Client for Python (boto3) before upload: from s3encryption import S3EncryptionClient; client = S3EncryptionClient(kms_key_id='arn:aws:kms:us-east-1:123456789012:key/mykey'); client.put_object(Bucket='mybucket', Key='data.txt', Body=b'Secret Data').",
  "sources": [
    {
      "title": "Protecting Data Using Client-Side Encryption in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingClientSideEncryption.html"
    },
    {
      "title": "AWS Encryption SDK Overview",
      "url": "https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html"
    }
  ]
});
