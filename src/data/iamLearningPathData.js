import { IAM_TASKS } from './tasks/iamTasks.js';

export const IAM_PATH_ID = 'iam-learning-path';

export const IAM_RESOURCE_TAGS = {
  Environment: 'StudyTrackerLab',
  ManagedBy: 'IAMFollowAlong',
  StudyTrackerFollowAlong: 'iam-learning-path'
};

export const IAM_PATH_ONLY_TASKS = [
  {
    id: 'path-iam-project-final-cleanup',
    title: 'IAM Project Final Cleanup Wizard',
    goal: 'Dependency-ordered manual guided teardown for all lab IAM identities, roles, policies, virtual MFA devices, S3 buckets, EC2 instances, and password policy restoration.',
    phaseId: 6,
    difficulty: 'Medium',
    estimatedMinutes: 25,
    status: 'published',
    isPathOnly: true,
    whyItMatters: 'Cleaning up IAM roles, users, access keys, and policies ensures your AWS account returns to a secure baseline with zero residual least-privilege vulnerabilities or unused credentials.',
    consoleSteps: [
      {
        id: 'clean-step-1',
        number: 1,
        title: 'Terminate Lab EC2 Instances',
        instructions: [
          { id: 'c1', label: 'Primary EC2 Instance', detail: 'Open EC2 Console > Instances > Select primary instance (saa-iam-user-001 EC2) > Instance state > Terminate instance.' },
          { id: 'c2', label: 'Tagged EC2 Instance', detail: 'Select AutoStop=true instance > Instance state > Terminate instance.' }
        ]
      },
      {
        id: 'clean-step-2',
        number: 2,
        title: 'Delete Lab Lambda Functions',
        instructions: [
          { id: 'c3', label: 'Lambda Stopper Function', detail: 'Open Lambda Console > Functions > Select saa-iam-fn-auto-stop-ec2 > Actions > Delete.' }
        ]
      },
      {
        id: 'clean-step-3',
        number: 3,
        title: 'Deactivate & Delete Lab Access Keys',
        instructions: [
          { id: 'c4', label: 'Access Key Rotation Cleanup', detail: 'Open IAM Console > Users > saa-iam-user-001 > Security credentials > Deactivate and Delete generated access keys.' }
        ]
      },
      {
        id: 'clean-step-4',
        number: 4,
        title: 'Deactivate & Delete Lab Virtual MFA Device',
        instructions: [
          { id: 'c5', label: 'Virtual MFA Removal', detail: 'Open IAM Console > Users > saa-iam-user-001 > Security credentials > MFA > Remove virtual MFA device (saa-iam-user-001-mfa).' }
        ]
      },
      {
        id: 'clean-step-5',
        number: 5,
        title: 'Empty & Delete Lab S3 Buckets',
        instructions: [
          { id: 'c6', label: 'Test S3 Bucket', detail: 'Open S3 Console > Select saa-iam-bucket-[account-id] > Empty bucket contents > Delete bucket.' }
        ]
      },
      {
        id: 'clean-step-6',
        number: 6,
        title: 'Detach Policies & Delete Lab IAM Roles',
        instructions: [
          { id: 'c7', label: 'IAM Roles Teardown', detail: 'Open IAM Console > Roles > Detach attached policies and delete: saa-iam-role-ec2-s3-reader, saa-iam-role-third-party-vendor, saa-iam-role-saml-executives, saa-iam-role-cli-target, saa-iam-role-lambda-ec2-stopper.' }
        ]
      },
      {
        id: 'clean-step-7',
        number: 7,
        title: 'Delete Lab Instance Profiles',
        instructions: [
          { id: 'c8', label: 'Instance Profile Cleanup', detail: 'Delete instance profile saa-iam-profile-ec2-s3-reader via CLI or IAM console.' }
        ]
      },
      {
        id: 'clean-step-8',
        number: 8,
        title: 'Detach Policies & Delete Lab IAM User',
        instructions: [
          { id: 'c9', label: 'IAM User Cleanup', detail: 'Open IAM Console > Users > saa-iam-user-001 > Detach all policies, remove inline policies, and delete user.' }
        ]
      },
      {
        id: 'clean-step-9',
        number: 9,
        title: 'Delete Customer Managed Policies & Boundaries',
        instructions: [
          { id: 'c10', label: 'Customer Policies Teardown', detail: 'Open IAM Console > Policies > Delete: saa-iam-policy-bucket-read, saa-iam-policy-explicit-deny, saa-iam-boundary-policy, saa-iam-policy-ec2-abac.' }
        ]
      },
      {
        id: 'clean-step-10',
        number: 10,
        title: 'Delete Lab SAML Provider',
        instructions: [
          { id: 'c11', label: 'Identity Provider Cleanup', detail: 'Open IAM Console > Identity Providers > Select saa-iam-saml-idp > Delete.' }
        ]
      },
      {
        id: 'clean-step-11',
        number: 11,
        title: 'Delete Lab Access Analyzer',
        instructions: [
          { id: 'c12', label: 'Access Analyzer Teardown', detail: 'Open IAM Console > Access Analyzer > Select saa-iam-analyzer > Delete analyzer.' }
        ]
      },
      {
        id: 'clean-step-12',
        number: 12,
        title: 'Review & Restore Recorded Account Password Policy',
        instructions: [
          { id: 'c13', label: 'Password Policy Restoration', detail: 'Open IAM Console > Account settings > Password policy > Re-apply your recorded prior account password policy settings, or delete password policy if none existed before this lab.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 'cli-clean-all',
        number: 1,
        title: 'AWS CLI Manual Guided Teardown Reference',
        commands: [
          { text: 'aws ec2 terminate-instances --instance-ids <primary-instance-id> <tagged-instance-id>', explanation: 'Terminate lab EC2 instances' },
          { text: 'aws lambda delete-function --function-name saa-iam-fn-auto-stop-ec2', explanation: 'Delete lab Lambda function' },
          { text: 'aws iam delete-access-key --user-name saa-iam-user-001 --access-key-id <key-id>', explanation: 'Delete lab user access key' },
          { text: 'aws iam deactivate-mfa-device --user-name saa-iam-user-001 --serial-number arn:aws:iam::<account>:mfa/saa-iam-user-001-mfa', explanation: 'Deactivate virtual MFA' },
          { text: 'aws s3 rb s3://saa-iam-bucket-<account-id> --force', explanation: 'Empty and delete test S3 bucket' },
          { text: 'aws iam delete-role --role-name saa-iam-role-ec2-s3-reader', explanation: 'Delete lab IAM role' },
          { text: 'aws iam delete-user --user-name saa-iam-user-001', explanation: 'Delete lab IAM user' },
          { text: 'aws iam delete-policy --policy-arn arn:aws:iam::<account-id>:policy/saa-iam-policy-bucket-read', explanation: 'Delete customer managed policy' },
          { text: 'aws accessanalyzer delete-analyzer --analyzer-name saa-iam-analyzer', explanation: 'Delete Access Analyzer' }
        ]
      }
    ]
  }
];

export const IAM_LEARNING_PATH_PHASES = [
  {
    id: 1,
    title: 'Identity & Policy Fundamentals',
    description: 'Establish IAM user baseline, managed policies, least-privilege customer policies, explicit deny, and policy types.'
  },
  {
    id: 2,
    title: 'Roles & Temporary Credentials',
    description: 'Build EC2 IAM roles, instance profiles, IMDS credential validation, dynamic policy updates, and STS AssumeRole.'
  },
  {
    id: 3,
    title: 'Permission Controls & Boundaries',
    description: 'Implement permissions boundaries, ABAC tag-based conditions, policy simulation, and identity vs resource policy evaluation.'
  },
  {
    id: 4,
    title: 'Security Monitoring & Account Controls',
    description: 'Configure IAM Access Analyzer, virtual MFA enforcement, and account password policy best practices.'
  },
  {
    id: 5,
    title: 'Advanced Credentials & Lifecycle',
    description: 'Configure third-party External ID role assumption, SAML 2.0 federation, and programmatic access key rotation.'
  },
  {
    id: 6,
    title: 'Cross-Account & Serverless Integration',
    description: 'Enforce PrincipalOrgID conditions, cross-account bucket policy sharing, and least-privilege Lambda automation.'
  }
];

export const IAM_OPTIONAL_TASK_IDS = [
  'task-saa-iam-use-aws-principalorgid-to-block-cross-account-access-012',
  'task-saa-iam-configure-mfa-and-enforce-mfa-for-sensitive-api-actions-013',
  'task-saa-iam-create-a-role-with-external-id-and-test-assumerole-014',
  'task-saa-iam-set-up-saml-federation-and-sign-in-to-aws-016',
  'task-saa-iam-cross-account-s3-bucket-policy-read-access-020',
  'task-saa-iam-iam-access-key-lifecycle-023',
  'task-saa-iam-lambda-stops-only-tagged-ec2-instances-025'
];

export const IAM_REVIEW_ONLY_TASK_IDS = [
  'task-saa-iam-iam-password-policy-best-practices-022'
];

export const IAM_PROTECTED_RESOURCE_KEYS = [
  'testBucketName',
  'accessAnalyzerArn',
  'samlProviderArn',
  'principalOrgId',
  'accountPasswordPolicy'
];

export const IAM_TASK_PHASE_MAPPING = {
  'task-saa-iam-create-an-iam-user-with-no-permissions-and-test-listing-s3-001': 1,
  'task-saa-iam-attach-amazons3readonlyaccess-and-re-test-002': 1,
  'task-saa-iam-custom-identity-based-policy-for-one-s3-bucket-003': 1,
  'task-saa-iam-add-an-explicit-deny-statement-and-confirm-it-overrides-allow-004': 1,
  'task-saa-iam-compare-inline-policies-and-managed-policies-010': 1,
  'task-saa-iam-create-an-ec2-role-to-read-one-s3-bucket-005': 2,
  'task-saa-iam-launch-ec2-with-an-instance-profile-and-verify-imds-credentials-006': 2,
  'task-saa-iam-update-an-ec2-role-policy-and-verify-permissions-change-without-reboot-007': 2,
  'task-saa-iam-assumerole-with-sts-from-the-cli-024': 2,
  'task-saa-iam-create-a-permissions-boundary-and-prove-it-limits-permissions-008': 3,
  'task-saa-iam-use-requesttag-and-resourcetag-conditions-for-ec2-015': 3,
  'task-saa-iam-use-iam-policy-simulator-to-debug-accessdenied-018': 3,
  'task-saa-iam-combine-identity-and-resource-policies-in-s3-021': 3,
  'task-saa-iam-enable-access-analyzer-and-review-a-public-s3-finding-011': 4,
  'task-saa-iam-configure-mfa-and-enforce-mfa-for-sensitive-api-actions-013': 4,
  'task-saa-iam-iam-password-policy-best-practices-022': 4,
  'task-saa-iam-create-a-role-with-external-id-and-test-assumerole-014': 5,
  'task-saa-iam-set-up-saml-federation-and-sign-in-to-aws-016': 5,
  'task-saa-iam-iam-access-key-lifecycle-023': 5,
  'task-saa-iam-use-aws-principalorgid-to-block-cross-account-access-012': 6,
  'task-saa-iam-cross-account-s3-bucket-policy-read-access-020': 6,
  'task-saa-iam-lambda-stops-only-tagged-ec2-instances-025': 6
};

export function getIamPathTasks() {
  const tasks = IAM_TASKS.map(task => {
    const isOptional = IAM_OPTIONAL_TASK_IDS.includes(task.id);
    const isReviewOnly = IAM_REVIEW_ONLY_TASK_IDS.includes(task.id);
    const phaseId = IAM_TASK_PHASE_MAPPING[task.id] || 1;

    return {
      ...task,
      phaseId,
      isOptional,
      isReviewOnly,
      isPathOnly: false
    };
  });

  return [...tasks, ...IAM_PATH_ONLY_TASKS];
}

export const IAM_LEARNING_PATH_DATA = {
  programmeId: IAM_PATH_ID,
  title: 'IAM Follow Along',
  subtitle: 'Identity & Access Management',
  phases: IAM_LEARNING_PATH_PHASES,
  tasks: getIamPathTasks()
};
