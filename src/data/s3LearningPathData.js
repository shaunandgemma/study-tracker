import { S3_TASKS } from '../features/followAlongs/catalogues/s3FollowAlongTasks.js';

export const S3_PATH_ID = 's3-learning-path';

export const S3_RESOURCE_TAGS = {
  StudyTrackerFollowAlong: 's3-learning-path',
  StudyTrackerEnvironment: 's3-lab',
  CreatedBy: 'StudyTracker'
};

// Path-Only Final Cleanup Task
export const S3_PATH_ONLY_TASKS = [
  {
    id: 'path-s3-project-final-cleanup',
    title: 'Final S3 Project Cleanup & Resource Teardown',
    examCode: 'aws-saa-c03',
    topicId: 'topic-s3',
    difficulty: 'Medium',
    estimatedMinutes: 20,
    isPathOnly: true,
    isCleanupTask: true,
    goal: 'Perform complete, dependency-ordered manual teardown of all S3 buckets, replication roles, access points, CloudFront distributions, and KMS keys created during the S3 Follow Along.',
    whyItMatters: 'Ensures all disposable S3 buckets, objects, versions, IAM roles, and access points are removed to avoid recurring storage charges while preserving protected resources.',
    consoleSteps: [
      {
        id: 's3-cleanup-step-1',
        title: 'Delete Replication Configuration & Rules',
        instructions: [
          { id: 's3-cleanup-ins-1', label: 'Open S3 Console -> Primary Bucket -> Management -> Replication rules.', detail: 'Delete all replication rules to stop automated object copying.' }
        ]
      },
      {
        id: 's3-cleanup-step-2',
        title: 'Delete S3 Access Points & MRAPs',
        instructions: [
          { id: 's3-cleanup-ins-2', label: 'Open S3 Console -> Access Points -> Select accessPointArn & mrapArn -> Delete.', detail: 'Access points must be deleted before bucket teardown.' }
        ]
      },
      {
        id: 's3-cleanup-step-3',
        title: 'Disable & Delete CloudFront Distribution',
        instructions: [
          { id: 's3-cleanup-ins-3', label: 'Open CloudFront Console -> Select cloudfrontDistId -> Disable -> Wait for Deployed -> Delete.', detail: 'Distribution must be disabled before deletion.' }
        ]
      },
      {
        id: 's3-cleanup-step-4',
        title: 'Empty & Delete Replica Buckets',
        instructions: [
          { id: 's3-cleanup-ins-4', label: 'Empty and delete srrReplicaBucket and crrReplicaBucket.', detail: 'Delete all object versions and delete markers.' }
        ]
      },
      {
        id: 's3-cleanup-step-5',
        title: 'Delete IAM Replication Roles & Users',
        instructions: [
          { id: 's3-cleanup-ins-5', label: 'Open IAM Console -> Roles/Users -> Delete srrReplicationRoleArn, crrReplicationRoleArn, and readOnlyUserArn.', detail: 'Clean up IAM identities.' }
        ]
      },
      {
        id: 's3-cleanup-step-6',
        title: 'Empty & Delete Primary & Logging Buckets',
        instructions: [
          { id: 's3-cleanup-ins-6', label: 'Empty all object versions, delete markers, and objects from primaryBucketName and loggingBucketName -> Delete buckets.', detail: 'Remove primary storage anchors.' }
        ]
      },
      {
        id: 's3-cleanup-step-7',
        title: 'Schedule KMS Key Deletion',
        instructions: [
          { id: 's3-cleanup-ins-7', label: 'Open KMS Console -> Select kmsKeyId -> Schedule key deletion (7-day window).', detail: 'Schedules deletion of the customer-managed key.' }
        ]
      }
    ],
    cliSteps: [
      {
        id: 's3-cleanup-cli-1',
        title: 'Perform CLI Resource Teardown',
        commands: [
          { id: 's3-cleanup-cmd-1', text: 'aws s3api delete-bucket-replication --bucket $BUCKET', explanation: 'Delete bucket replication configuration.' },
          { id: 's3-cleanup-cmd-2', text: 'aws s3control delete-access-point --account-id $ACCOUNT_ID --name $AP_NAME', explanation: 'Delete S3 Access Point.' },
          { id: 's3-cleanup-cmd-3', text: 'aws cloudfront delete-distribution --id $DIST_ID --if-match $ETAG', explanation: 'Delete disabled CloudFront distribution.' },
          { id: 's3-cleanup-cmd-4', text: 'aws s3 rb s3://$BUCKET --force', explanation: 'Empty and delete S3 bucket.' },
          { id: 's3-cleanup-cmd-5', text: 'aws kms schedule-key-deletion --key-id $KEY_ALIAS --pending-window-in-days 7', explanation: 'Schedule customer-managed KMS key deletion.' }
        ]
      }
    ],
    verification: [{ id: 's3-cleanup-v1', text: 'Confirm all lab buckets, roles, access points, and distributions are removed.' }],
    cleanup: [{ id: 's3-cleanup-c1', text: 'Teardown completed.' }]
  }
];

export const S3_LEARNING_PATH_PHASES = [
  {
    id: 1,
    title: 'Phase 1: S3 Foundations & Object Versioning',
    description: 'Learn bucket management, object upload, versioning, restore, and server access logging.',
    taskIds: [
      'task-saa-s3-list-s3-buckets-and-find-each-bucket-region-001',
      'task-saa-s3-versioning-001',
      'task-saa-s3-upload-the-same-file-twice-and-view-both-saved-versions-003',
      'task-saa-s3-delete-a-file-then-restore-it-using-s3-versioning-004',
      'task-saa-s3-turn-on-s3-server-access-logging-005'
    ]
  },
  {
    id: 2,
    title: 'Phase 2: Access Security & Encryption Fundamentals',
    description: 'Master presigned URLs, bucket policies, Block Public Access, IAM users, and SSE-S3 encryption.',
    taskIds: [
      'task-saa-s3-upload-a-file-and-share-it-with-a-presigned-url-006',
      'task-saa-s3-add-a-bucket-policy-that-blocks-public-access-007',
      'task-saa-s3-turn-on-block-public-access-for-an-s3-bucket-008',
      'task-saa-s3-create-a-read-only-s3-iam-user-009',
      'task-saa-s3-turn-on-default-sse-s3-encryption-010'
    ]
  },
  {
    id: 3,
    title: 'Phase 3: KMS Encryption & Static Web Hosting',
    description: 'Configure SSE-KMS encryption, account BPA, static website hosting, custom 404 pages, and access logging.',
    taskIds: [
      'task-saa-s3-switch-default-encryption-to-sse-kms-011',
      'task-saa-s3-turn-on-account-level-block-public-access-012',
      'task-saa-s3-set-s3-static-website-index-and-error-pages-013',
      'task-saa-s3-test-the-custom-s3-website-404-page-014',
      'task-saa-s3-turn-on-access-logging-for-the-s3-website-bucket-015'
    ]
  },
  {
    id: 4,
    title: 'Phase 4: CloudFront CDN, Lifecycle Rules & Same-Region Replication',
    description: 'Put CloudFront in front of S3, test invalidations, create lifecycle rules, and set up SRR.',
    taskIds: [
      'task-saa-s3-put-cloudfront-in-front-of-the-s3-website-016',
      'task-saa-s3-change-a-website-file-and-create-a-cloudfront-invalidation-017',
      'task-saa-s3-create-a-lifecycle-rule-that-moves-objects-to-standard-ia-018',
      'task-saa-s3-add-a-lifecycle-rule-that-deletes-old-noncurrent-versions-019',
      'task-saa-s3-set-up-same-region-replication-between-two-s3-buckets-020'
    ]
  },
  {
    id: 5,
    title: 'Phase 5: Cross-Region Replication, Multipart Uploads & Transfer Acceleration',
    description: 'Verify SRR, configure CRR, test cross-Region replication, perform multipart uploads, and compare Transfer Acceleration.',
    taskIds: [
      'task-saa-s3-upload-a-file-and-confirm-same-region-replication-copies-it-021',
      'task-saa-s3-set-up-cross-region-replication-between-two-s3-buckets-022',
      'task-saa-s3-upload-a-file-and-confirm-cross-region-replication-copies-it-023',
      'task-saa-s3-upload-a-large-file-and-notice-how-s3-uses-multipart-upload-024',
      'task-saa-s3-turn-on-s3-transfer-acceleration-and-compare-the-upload-endpoint-025'
    ]
  },
  {
    id: 6,
    title: 'Phase 6: Advanced Access Points & Policy Auditing',
    description: 'Create single-Region and Multi-Region Access Points, audit Storage Lens, and test security policy denials.',
    taskIds: [
      'task-saa-s3-create-an-s3-access-point-and-use-it-to-list-bucket-objects-026',
      'task-saa-s3-create-a-multi-region-access-point-for-buckets-in-different-regions-027',
      'task-saa-s3-open-s3-storage-lens-and-review-the-storage-dashboard-028',
      'task-saa-s3-try-to-make-a-bucket-public-while-block-public-access-is-still-on-029',
      'task-saa-s3-try-uploading-to-a-kms-encrypted-bucket-without-kms-encrypt-permission-030'
    ]
  },
  {
    id: 7,
    title: 'Phase 7: Replication Cleanup & CLI Comparison',
    description: 'Clean up replication rules, compare high-level vs low-level S3 CLI commands, and complete final path review.',
    taskIds: [
      'task-saa-s3-remove-s3-replication-and-find-the-iam-role-that-was-used-031',
      'task-saa-s3-upload-with-aws-s3-cp-and-compare-with-s3api-put-object-032',
      'task-saa-s3-open-the-final-s3-guide-and-complete-the-last-review-task-033'
    ]
  }
];

export const S3_OPTIONAL_TASK_IDS = [
  'task-saa-s3-switch-default-encryption-to-sse-kms-011',
  'task-saa-s3-put-cloudfront-in-front-of-the-s3-website-016',
  'task-saa-s3-change-a-website-file-and-create-a-cloudfront-invalidation-017',
  'task-saa-s3-set-up-cross-region-replication-between-two-s3-buckets-022',
  'task-saa-s3-upload-a-file-and-confirm-cross-region-replication-copies-it-023',
  'task-saa-s3-create-a-multi-region-access-point-for-buckets-in-different-regions-027'
];

export const S3_REVIEW_ONLY_TASK_IDS = [
  'task-saa-s3-open-s3-storage-lens-and-review-the-storage-dashboard-028'
];

export const S3_PROTECTED_RESOURCE_KEYS = [
  'primaryBucketName',
  'kmsKeyId',
  'cloudfrontDistId'
];

export function getS3PathTasks() {
  const canonicalMap = new Map((S3_TASKS || []).map(t => [t.id, t]));
  const pathTasks = [];

  S3_LEARNING_PATH_PHASES.forEach(phase => {
    phase.taskIds.forEach(tid => {
      const canonicalTask = canonicalMap.get(tid);
      if (canonicalTask) {
        pathTasks.push({
          ...canonicalTask,
          phaseId: phase.id,
          phaseTitle: phase.title,
          isOptional: S3_OPTIONAL_TASK_IDS.includes(tid),
          isReviewOnly: S3_REVIEW_ONLY_TASK_IDS.includes(tid)
        });
      }
    });
  });

  // Append Path-Only Cleanup Task
  S3_PATH_ONLY_TASKS.forEach(cleanupTask => {
    pathTasks.push({
      ...cleanupTask,
      phaseId: 7,
      phaseTitle: 'Phase 7: Replication Cleanup & CLI Comparison',
      isOptional: false,
      isReviewOnly: false
    });
  });

  return pathTasks;
}

export const S3_LEARNING_PATH_DATA = {
  programmeId: S3_PATH_ID,
  title: 'AWS S3 Follow Along Learning Path',
  tasks: getS3PathTasks()
};
