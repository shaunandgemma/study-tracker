import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-23',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'Public, Private and Shared AMIs',
  status: 'ready',
  plainEnglish: 'AMIs are categorized by their visibility and sharing permissions:\n- Public AMIs: Published by AWS (e.g. Amazon Linux, Ubuntu) or community contributors available for anyone to use.\n- Private AMIs: Custom images created within your AWS account for internal use only.\n- Shared AMIs: Private AMIs that you explicitly share with specific external AWS account IDs (or across an entire AWS Organization) without making them public to the world.',
  whyItMatters: 'Shared AMIs enable multi-account corporate governance. Security teams can build and patch a golden AMI in a central Security account and share it with member accounts across AWS Organizations safely.',
  workplaceExample: 'An enterprise cloud architecture team creates an AMI hardened to CIS security standards in their Central Security AWS account. They share the AMI with 50 development AWS accounts. Developers launch compliant EC2 instances using the shared AMI ID without exposing the image publicly.',
  examFocus: 'SAA-C03 AMI Sharing rules:\n- To share an AMI with another account, grant launch permissions to that AWS account ID.\n- If the AMI is encrypted with a custom KMS key, you MUST ALSO share the KMS key with the target account.\n- Shared AMIs retain owner control: if the owning account unshares or deletes the AMI, target accounts can no longer launch NEW instances from it (existing running instances continue running).',
  keyPoints: [
    'Public AMIs are accessible to all AWS accounts globally.',
    'Private AMIs are restricted to the owner account.',
    'Shared AMIs grant explicit launch permissions to specified AWS account IDs or Organizations.',
    'Sharing an encrypted AMI requires sharing both the AMI and its backing KMS key.',
    'Deprecating or unsharing an AMI prevents new launches but does not stop running instances.'
  ],
  commonMistake: 'Sharing an encrypted AMI with a partner account but forgetting to grant KMS key permissions (`kms:CreateGrant` or `kms:Decrypt`). The partner account will fail to launch instances with an "Access Denied" error.',
  example: 'Sharing an AMI with another AWS Account ID:\n`aws ec2 modify-image-attribute --image-id ami-0123456789abcdef0 --launch-permission "Add=[{AccountId=111122223333}]"`',
  sources: [
    { title: 'Sharing an AMI with specific AWS accounts', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html' }
  ]
});
