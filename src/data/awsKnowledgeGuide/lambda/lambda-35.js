import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-35",
  "title": "Lambda Environment Variable Encryption",
  "plainEnglish": "AWS Lambda automatically encrypts all environment variables at rest using AWS Key Management Service (AWS KMS). By default, Lambda uses an AWS-managed KMS key (free of charge). For enterprise compliance and enhanced security, you can specify a Customer Managed Key (CMK), or enable Encryption Helpers in the AWS Console to encrypt sensitive configuration values on the client side before they are uploaded to Lambda, requiring in-code KMS Decrypt calls at runtime.",
  "whyItMatters": "Regulatory standards (such as PCI DSS, HIPAA, and SOC 2) require cryptographic control and auditability over configuration secrets. Using customer-managed KMS keys provides key rotation, detailed CloudTrail access logs, and strict IAM key policies restricting which administrators can view or decrypt sensitive environment values in the AWS Console.",
  "workplaceExample": "A fintech compliance team mandates that third-party payment gateway merchant keys cannot be visible in plaintext in the AWS Lambda Console. The development team creates a Customer Managed Key (CMK) in AWS KMS, uses Lambda's encryption helpers to encrypt the API key client-side, and writes a helper function in their Node.js handler that calls `kms.decrypt()` upon cold-start initialization to obtain the plaintext key in memory.",
  "examFocus": "Understand the two layers of environment variable encryption: (1) Server-Side Encryption at Rest: Handled automatically by Lambda using an AWS-managed key (`aws/lambda`) or a Customer Managed Key (CMK); values are decrypted automatically by the runtime and visible in plaintext in the AWS Console/API. (2) Client-Side Encryption with Encryption Helpers: Encrypts values client-side BEFORE uploading; values remain ciphertext in the Console and must be explicitly decrypted in function code using the `kms:Decrypt` API.",
  "keyPoints": [
    "All environment variables are encrypted at rest by default using AWS KMS.",
    "Supports AWS-managed KMS keys (`aws/lambda`) and Customer Managed Keys (CMKs) in AWS KMS.",
    "Using a Customer Managed Key allows automated annual rotation and detailed CloudTrail auditing of key usage.",
    "Encryption Helpers enable client-side encryption of individual variables before deployment to prevent console plaintext exposure.",
    "Client-side encrypted variables require explicit decryption in code using the AWS SDK KMS Decrypt API.",
    "The Lambda execution role must have `kms:Decrypt` permissions on the specified KMS key ARN to decrypt variables at runtime."
  ],
  "commonMistake": "Assuming that server-side KMS encryption prevents unauthorized IAM users from reading environment variables in the AWS Management Console. Standard server-side encryption decrypts variables for display in the console; to prevent console exposure, use client-side encryption helpers or AWS Secrets Manager.",
  "example": "Decrypt a client-side encrypted environment variable inside Python function code: import boto3, os, base64; kms = boto3.client('kms'); encrypted_val = os.environ['ENCRYPTED_API_KEY']; api_key = kms.decrypt(CiphertextBlob=base64.b64decode(encrypted_val))['Plaintext'].decode('utf-8').",
  "sources": [
    {
      "title": "Securing Lambda Environment Variables with AWS KMS",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars-encryption.html"
    },
    {
      "title": "AWS Lambda Security Best Practices",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html#security-best-practices"
    }
  ]
});
