import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'vpc-26', topicId: 'topic-vpc', topicTitle: 'Amazon VPC', objectiveCode: 'Networking',
  title: 'VPC Endpoint Policies', status: 'ready',
  plainEnglish: 'A VPC endpoint policy is an IAM resource policy attached to a supported endpoint. It limits which principals can use the endpoint to perform which actions on which resources. The default policy commonly allows broad access. An endpoint policy does not grant permission by itself; the caller and target resource must also allow the request.',
  whyItMatters: 'Private connectivity is not the same as authorised access. A restrictive endpoint policy can reduce what can be reached through that network path, while IAM and resource policies enforce their own controls. All applicable policies and explicit denies must be evaluated together.',
  workplaceExample: 'An S3 endpoint policy allows application roles to access only approved production buckets. Bucket policies and role policies apply matching least privilege, and a break-glass path is tested before a restrictive endpoint condition is deployed.',
  examFocus: 'SAA-C03: endpoint policies are additional controls, not replacements for IAM or resource policies. The effective request must be allowed by every applicable layer and not explicitly denied. Policy support and principal syntax vary by endpoint type and service.',
  keyPoints: [
    'Endpoint policies control access through a particular VPC endpoint.',
    'They do not grant permissions that the caller or resource policy does not already allow.',
    'An explicit deny in an applicable policy overrides an allow.',
    'Not every endpoint service supports identical policy capabilities.',
    'Gateway and interface endpoint policy principal rules have documented differences.',
    'Policy changes should be tested to avoid locking out required management and recovery operations.'
  ],
  commonMistake: 'Writing an endpoint policy that allows an action and assuming the request will succeed even though the role policy or bucket policy still denies it.',
  example: 'A role policy allows reading one bucket, the bucket policy trusts that role, and the endpoint policy permits only that bucket. The request succeeds only when all three controls and any KMS policy permit it.',
  sources: [{ title: 'Control access to VPC endpoints using endpoint policies', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-access.html' }]
});
