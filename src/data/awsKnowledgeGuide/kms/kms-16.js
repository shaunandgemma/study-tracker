import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'kms-16',
  topicId: 'topic-kms',
  topicTitle: 'AWS KMS (Key Management Service)',
  objectiveCode: 'Security',
  title: 'KMS Grants',
  status: 'ready',
  plainEnglish: 'A KMS Grant is a lightweight, programmatically generated access control mechanism attached to a Customer Managed KMS key. Grants allow you or an integrated AWS service (such as Amazon EBS, Auto Scaling, or Amazon EMR) to dynamically delegate specific, temporary permissions to a grantee principal to use a KMS key without modifying the main KMS Key Policy or IAM policies.',
  whyItMatters: 'Integrated AWS services (like Auto Scaling when launching encrypted EBS instances) need temporary permissions to use your KMS key on behalf of an EC2 host. KMS Grants allow services to create, use, and retire scoped temporary key permissions dynamically.',
  workplaceExample: 'When an Auto Scaling Group launches a new EC2 instance with an encrypted EBS volume, Auto Scaling calls KMS `CreateGrant` to create a temporary Service Grant allowing the EC2 host to decrypt the EBS volume key. When the instance is terminated, the grant is retired.',
  examFocus: 'SAA-C03 KMS Grants Mechanics:\n- Dynamic Permission Delegation: Programmatically grants temporary permissions without updating static Key Policies.\n- APIs: `CreateGrant`, `ListGrants`, `RevokeGrant`, `RetireGrant`.\n- Grant Tokens: Returned by `CreateGrant` to enable immediate eventual-consistency key access.\n- Common Usage: Utilized under the hood by AWS services (EBS, Auto Scaling, EMR) for asynchronous resource encryption.',
  keyPoints: [
    'Programmatic, dynamic permission mechanism attached to a KMS key.',
    'Used extensively by AWS services (EBS, Auto Scaling, EMR) for temporary key access.',
    'Bypasses static policy modification for dynamic resource provisioning.',
    'Provides Grant Tokens to eliminate eventual consistency latency.',
    'Can be listed (`ListGrants`), revoked (`RevokeGrant`), or retired (`RetireGrant`).'
  ],
  commonMistake: 'Attempting to manually edit a KMS Key Policy to add hundreds of short-lived EC2 instance IDs instead of leveraging programmatic KMS Grants.',
  example: 'Creating a KMS Grant via AWS CLI:\naws kms create-grant --key-id <KEY_ID> --grantee-principal arn:aws:iam::<ACCOUNT_ID>:role/AppRole --operations Decrypt GenerateDataKey',
  sources: [
    { title: 'Grants in AWS KMS', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/grants.html' }
  ]
});
