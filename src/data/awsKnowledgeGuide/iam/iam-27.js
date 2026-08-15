import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'iam-27',
  topicId: 'topic-iam',
  topicTitle: 'AWS IAM (Identity and Access Management)',
  objectiveCode: 'Security',
  title: 'Access Keys',
  status: 'ready',
  plainEnglish: 'AWS Access Keys are long-term credentials consisting of an Access Key ID (e.g., `AKIAIOSFODNN7EXAMPLE`) and a Secret Access Key (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`). They are used to authenticate programmatic requests made to AWS via the AWS Command Line Interface (CLI), AWS SDKs, or direct HTTP API calls.',
  whyItMatters: 'Access keys do not expire automatically. If a Secret Access Key is accidentally committed to a public code repository, automated web scanners can discover it in seconds and compromise your AWS environment.',
  workplaceExample: 'A company implements a security compliance rule requiring mandatory access key rotation every 90 days for legacy on-premises servers. They use IAM Access Analyzer to detect unrotated or unused access keys and deactivate them automatically.',
  examFocus: 'SAA-C03 Access Key Management & Best Practices:\n- Long-Term Credentials: Used strictly for programmatic API access (CLI, SDKs).\n- Applications on AWS: Applications running on EC2, ECS, or Lambda MUST use IAM Roles (STS temporary credentials) instead of static Access Keys.\n- Rotation & Hygiene: Rotate active access keys regularly (e.g. 90 days); maintain a max of 2 keys per user to enable zero-downtime rotation.\n- Never embed access keys in source code or public repos.',
  keyPoints: [
    'Long-term programmatic credentials (Access Key ID + Secret Access Key).',
    'Used for authenticating AWS CLI, SDK, and REST API calls.',
    'Maximum of 2 active Access Key Pairs per IAM user to facilitate smooth rotation.',
    'Applications on AWS should use IAM Roles and temporary STS credentials instead.',
    'Rotate access keys regularly and deactivate unused keys immediately.'
  ],
  commonMistake: 'Hardcoding static Access Keys inside application source code files and pushing them to a public GitHub repository.',
  example: 'Rotating Access Keys via AWS CLI:\naws iam create-access-key --user-name dev-user\n# Update app to use new key -> Verify -> Deactivate old key:\naws iam update-access-key --user-name dev-user --access-key-id AKIAOLDKEYEXAMPLE --status Inactive',
  sources: [
    { title: 'Managing access keys for IAM users', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html' }
  ]
});
