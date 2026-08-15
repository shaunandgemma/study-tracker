import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-26',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'Root User Security',
  status: 'ready',
  plainEnglish: 'The AWS Account Root User is the identity created automatically when you first sign up for an AWS account. The root user has complete, unrestricted, non-revocable access to ALL resources, billing details, and security settings in the account. Because root user permissions CANNOT be restricted by IAM policies, securing the root user is the single most critical account security priority.',
  whyItMatters: 'Compromise of the root user results in total loss of account control. An attacker can delete all backups, terminate infrastructure, export confidential data, and incur hundreds of thousands of dollars in fraudulent charges.',
  workplaceExample: 'Upon creating a new AWS account, a Chief Information Security Officer (CISO) immediately locks away the root user: they enable FIDO2 Hardware MFA (YubiKey), set a 64-character random password, delete root access keys, and create individual IAM Identity Center roles for daily admin tasks.',
  examFocus: 'SAA-C03 Root User Security Hardening Rules:\n- NEVER create or use Root User Access Keys (`AKIA...`) for routine administration or application workloads.\n- NEVER use the root user for daily operational tasks.\n- ALWAYS enable strong hardware MFA on the root account immediately.\n- Tasks requiring Root User: Changing account settings, closing the account, changing AWS Support plan, restoring root permissions, editing CloudFront key groups.',
  keyPoints: [
    'Complete, non-revocable administrative access to all account resources and billing.',
    'Do NOT use the root user for daily administrative or application tasks.',
    'Do NOT create long-term access keys for the root user.',
    'Enable hardware MFA (FIDO2 security key) immediately on account creation.',
    'Reserve root user sign-in strictly for specific account management tasks.'
  ],
  commonMistake: 'Generating Access Keys for the Root User and embedding them into application code or server environment variables, exposing full account control if leaked.',
  example: 'Root User Task Checklist:\n1. Enable Hardware MFA on Root User -> 2. Delete Root Access Keys -> 3. Lock away Root credentials in secure safe -> 4. Use IAM / IAM Identity Center for daily tasks.',
  sources: [
    { title: 'AWS account root user', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html' }
  ]
});
