import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-7',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'IAM Groups',
  status: 'ready',
  plainEnglish: 'An IAM Group is a collection of IAM Users. IAM Groups allow you to specify permissions for multiple users simultaneously, making it easier to manage permissions for team roles (such as Developers, DBAs, or SysAdmins). When permissions policies are attached to an IAM Group, all IAM Users placed in that group automatically inherit those permissions.',
  whyItMatters: 'Managing permissions user-by-user across hundreds of employees creates administrative chaos. Attaching permissions policies to IAM Groups ensures consistent least-privilege permissions based on job function.',
  workplaceExample: 'A security team creates an IAM Group named `DatabaseAdministrators` and attaches the `AmazonRDSFullAccess` managed policy. When a new DBA joins the company, adding their IAM User to `DatabaseAdministrators` grants them necessary RDS permissions instantly.',
  examFocus: 'SAA-C03 IAM Group Rules & Boundaries:\n- Groups contain IAM Users ONLY. An IAM Group CANNOT contain another IAM Group (no nested groups).\n- IAM Groups CANNOT contain IAM Roles.\n- An IAM Group is NOT an identity that can be authenticated or referenced as a `Principal` in resource policies.\n- A single IAM User can belong to up to 10 IAM Groups.',
  keyPoints: [
    'Collection of IAM Users used to attach shared permission policies.',
    'Simplifies permission management by grouping users by job function (e.g. Finance, Admins).',
    'IAM Groups CANNOT be nested (a group cannot contain another group).',
    'IAM Groups CANNOT contain IAM Roles.',
    'An IAM Group cannot be specified as a `Principal` in resource-based policies.'
  ],
  commonMistake: 'Attempting to nest an IAM Group inside another IAM Group or referencing an IAM Group ARN as a `Principal` in an S3 Bucket Policy.',
  example: 'Managing IAM Groups via AWS CLI:\naws iam create-group --group-name DatabaseAdministrators\naws iam add-user-to-group --user-name alice-dba --group-name DatabaseAdministrators',
  sources: [
    { title: 'IAM User Groups', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html' }
  ]
});
