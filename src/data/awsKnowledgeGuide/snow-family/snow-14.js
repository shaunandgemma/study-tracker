import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-snow-family",
  "topicTitle": "AWS Snow Family",
  "objectiveCode": "Management",
  "status": "ready",
  "id": "snow-14",
  "title": "Snow Device Encryption",
  "plainEnglish": "Snow Device Encryption is the built-in, hardware-enforced cryptographic security system that protects all data stored on AWS Snow Family devices. Every block of data written to a Snowcone or Snowball Edge device is automatically encrypted at rest using 256-bit Advanced Encryption Standard (AES-256) cryptographic keys. The cryptographic keys never leave the secure hardware module in plaintext, and the entire device storage layer remains locked and inaccessible until authorized credentials (a Manifest file and Unlock Code) are provided.",
  "whyItMatters": "Physical appliances transported across commercial shipping networks and handled by third-party logistics couriers face risks of loss, interception, or physical extraction attacks. Snow Device Encryption ensures that even if an adversary gains physical possession of a Snowball device, extracts the raw disk drives, or attempts side-channel bus probing, the data cannot be decrypted without the cloud-managed cryptographic keys.",
  "workplaceExample": "A government agency migrates confidential defense sensor archives to AWS using Snowball Edge. During transit between the base and the AWS Region, the courier truck is involved in a minor traffic accident, and shipping is delayed for three days. Because the Snowball Edge employs end-to-end 256-bit hardware encryption and TPM-based secure boot, the agency is confident that the stored sensor data remains cryptographically secure and tamper-proof.",
  "examFocus": "Understand Snow Device Encryption architecture: (1) Cipher Standard: 256-bit Advanced Encryption Standard (AES-256) hardware encryption applied automatically to all storage. (2) Key Protection: Integrated with AWS Key Management Service (AWS KMS) using Customer Managed Keys (CMKs) or AWS managed keys. (3) Hardware Root of Trust: An onboard Trusted Platform Module (TPM) validates firmware integrity at boot. (4) Media Sanitization: Upon return to AWS, the device undergoes complete cryptographic erasure and physical disk sanitization adhering to NIST 800-88 standards.",
  "keyPoints": [
    "Automatic 256-bit AES hardware encryption at rest for all data stored on Snow devices.",
    "Integrated with AWS Key Management Service (AWS KMS) for master key encryption and lifecycle.",
    "Data cannot be written to or read from the device without unlocking with the Manifest and Unlock Code.",
    "Onboard Trusted Platform Module (TPM) verifies hardware integrity and detects physical tampering.",
    "Encryption keys are protected in secure volatile memory and purged immediately upon power loss.",
    "Strict NIST 800-88 compliant media erasure performed by AWS upon device return."
  ],
  "commonMistake": "Believing that data encryption on Snow devices can be turned off to speed up data transfer. Encryption is a mandatory, non-configurable hardware requirement built into the physical Snow Family storage controller.",
  "example": "Verify the encryption and security status of a connected Snowball Edge device via the Snowball CLI: snowballEdge describe-device --endpoint https://192.168.1.100.",
  "sources": [
    {
      "title": "AWS Snowball Edge Security and Encryption",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/security-data-protection.html"
    },
    {
      "title": "Data Protection and Media Sanitization in AWS Snowball",
      "url": "https://docs.aws.amazon.com/snowball/latest/developer-guide/unlocking-the-device.html"
    }
  ]
});
