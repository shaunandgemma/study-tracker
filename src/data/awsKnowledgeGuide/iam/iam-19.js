import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-19',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'AWS STS Temporary Credentials',
  status: 'ready',
  plainEnglish: 'AWS Security Token Service (STS) is a web service that issues short-lived, temporary security credentials to authenticated users or AWS workloads. Temporary credentials consist of an Access Key ID, a Secret Access Key, and a Security Session Token (`aws_session_token`). Credentials automatically expire after a specified duration (15 minutes up to 12 hours).',
  whyItMatters: 'Long-term access keys risk accidental leaks and require manual rotation. Temporary STS credentials automatically expire, dramatically reducing security risk and eliminating manual credential management.',
  workplaceExample: 'A mobile application uses Web Identity Federation (OAuth 2.0 / OIDC with Google) to authenticate users. Once authenticated, the app calls AWS STS `AssumeRoleWithWebIdentity` to receive temporary, 1-hour credentials allowing direct, secure photo uploads to S3.',
  examFocus: 'SAA-C03 Core Concept for AWS STS:\n- Component Credentials: Access Key ID, Secret Access Key, and Session Token.\n- Session Duration: 15 minutes to 12 hours (default 1 hour).\n- Primary STS APIs: `AssumeRole`, `AssumeRoleWithSAML`, `AssumeRoleWithWebIdentity`, `GetSessionToken`.\n- Automatic Rotation: Services using IAM Roles (EC2 Instance Profiles, Lambda, ECS Tasks) automatically request and refresh STS credentials in the background.',
  keyPoints: [
    'Issues short-lived security credentials (Access Key, Secret Key, Session Token).',
    'Credentials automatically expire after a set duration (15 min to 12 hours).',
    'Eliminates long-term static credential exposure and manual key rotation.',
    'Underpins IAM Role assumption, cross-account access, and identity federation.',
    'Integrated natively across EC2, Lambda, ECS, and SDKs for transparent credential management.'
  ],
  commonMistake: 'Failing to pass the `aws_session_token` parameter when using temporary STS credentials in CLI or application SDK calls, resulting in `InvalidClientTokenId` errors.',
  example: 'Calling STS AssumeRole via AWS CLI:\naws sts assume-role --role-arn "arn:aws:iam::<ACCOUNT_ID>:role/MyRole" --role-session-name "CLI-Session"',
  sources: [
    { title: 'Temporary security credentials in IAM', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html' }
  ]
});
