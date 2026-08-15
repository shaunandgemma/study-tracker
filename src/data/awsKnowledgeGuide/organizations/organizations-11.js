import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-11',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'SCPs Do Not Grant Permissions',
  status: 'ready',
  plainEnglish: 'A fundamental rule of Service Control Policies (SCPs) is that they set maximum permission boundaries—they do NOT grant permissions to any user, role, or resource. Even if an SCP attached to an account contains `"Effect": "Allow", "Action": "*"` (like `FullAWSAccess`), an IAM user in that account cannot perform any action until an IAM Identity Policy or Resource Policy explicitly grants them that permission.',
  whyItMatters: 'Misunderstanding SCP permissions can lead to critical security flaws or operational outages. Security teams must recognize that SCPs filter access, while local IAM policies grant identity access.',
  workplaceExample: 'An IAM user in a member account is assigned a custom IAM policy granting ONLY `s3:GetObject`. Even though the account inherits an SCP with `FullAWSAccess`, the user cannot launch EC2 instances because their local IAM policy does not grant `ec2:RunInstances`.',
  examFocus: 'SAA-C03 Permission Evaluation Matrix:\n- Formula: Effective Permission = (IAM Identity Policy ALLOW) AND (Resource Policy ALLOW if applicable) AND (SCP ALLOW) AND (No Deny in IAM or SCP).\n- SCP Role: SCPs act as a filter net; they establish the upper ceiling of allowed actions.\n- No Granting Power: An SCP containing `Allow` statement does NOT grant access by itself.',
  keyPoints: [
    'SCPs establish maximum permission boundaries and do NOT grant permissions.',
    'An IAM Identity Policy or Resource Policy must still explicitly grant access.',
    'Effective permissions require an explicit Allow in BOTH local IAM and the SCP.',
    '`FullAWSAccess` SCP simply removes restrictions; it grants zero IAM permissions.',
    'Prevents unauthorized permission escalation from member account administrators.'
  ],
  commonMistake: 'Assuming that attaching a new SCP allowing `dynamodb:*` to an OU automatically permits IAM users in child accounts to query DynamoDB without updating their IAM policies.',
  example: 'Permission Evaluation Example:\n- SCP: Allows s3:*, ec2:*\n- IAM User Policy: Allows ONLY s3:GetObject\n- Result: User can ONLY perform s3:GetObject. EC2 actions are blocked because IAM policy does not grant them.',
  sources: [
    { title: 'How SCPs work with IAM permissions', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_evaluation.html' }
  ]
});
