export default Object.freeze({
  id: 'aws-cloudformation-stack-rollback',
  examId: 'aws-saa-c03',
  order: 23,
  category: 'AWS CloudFormation',
  title: 'Recover a CloudFormation Stack from Rollback',
  difficulty: 'Intermediate',
  summary: 'Use CloudFormation stack events to diagnose a failed resource creation and recover safely.',
  scenario: 'A new CloudFormation stack named fa-training-web was deployed to create an application bucket and supporting resources. The deployment failed and CloudFormation automatically rolled the stack back to ROLLBACK_COMPLETE. The existing bucket named fa-training-app-assets belongs to a separate workload and must not be deleted, modified, or imported into this stack.',
  task: 'Use the stack events and template evidence to identify the resource that caused the rollback, choose the smallest safe template correction, and recover the deployment without changing or deleting the existing bucket.',
  evidence: [
    {
      id: 'stack-events',
      title: 'CloudFormation Stack Events',
      kind: 'code',
      content: `Stack: fa-training-web

2026-08-19 11:02:41  fa-training-web   AWS::CloudFormation::Stack  CREATE_IN_PROGRESS
2026-08-19 11:02:44  AppBucket         AWS::S3::Bucket             CREATE_IN_PROGRESS
2026-08-19 11:02:45  AppBucket         AWS::S3::Bucket             CREATE_FAILED
Resource handler returned message:
"fa-training-app-assets already exists"
HandlerErrorCode: AlreadyExists

2026-08-19 11:02:46  fa-training-web   AWS::CloudFormation::Stack  ROLLBACK_IN_PROGRESS
2026-08-19 11:02:51  fa-training-web   AWS::CloudFormation::Stack  ROLLBACK_COMPLETE`
    },
    {
      id: 'template-resource',
      title: 'Relevant CloudFormation Template',
      kind: 'code',
      content: `Resources:
  AppBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: fa-training-app-assets
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

  AppBucketPublicAccessBlock:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref AppBucket
      PolicyDocument:
        Version: "2012-10-17"
        Statement: []`
    },
    {
      id: 'resource-boundary',
      title: 'Approved Resource Boundary',
      kind: 'text',
      content: 'The name fa-training-app-assets is already used by a separate approved workload. Do not delete, rename, modify, or import that existing bucket. The new stack may use a different globally unique bucket name, or the explicit BucketName property may be removed so CloudFormation can generate a unique physical name. The failed stack is currently ROLLBACK_COMPLETE.'
    }
  ],
  successCriteria: [
    'The learner identifies AppBucket as the first failed resource and the existing bucket-name conflict as the cause of the rollback.',
    'The template no longer attempts to create an S3 bucket named fa-training-app-assets.',
    'The existing bucket remains unchanged and is not deleted or imported into the failed stack.',
    'The ROLLBACK_COMPLETE stack is deleted, the corrected stack is created again, and the final stack reaches CREATE_COMPLETE.'
  ],
  hints: [
    'Read the stack events from the first CREATE_FAILED resource rather than treating ROLLBACK_COMPLETE itself as the root cause.',
    'S3 bucket names must be unique within their naming namespace, so CloudFormation cannot create a new bucket with a physical name that is already in use.',
    'Correct the AppBucket naming conflict, then remember that a stack in ROLLBACK_COMPLETE after failed creation can only be deleted before you create the corrected stack again.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What caused the fa-training-web stack to roll back?',
      options: [
        { id: 'bucket-name-conflict', text: 'The AppBucket resource tried to create an S3 bucket using the already existing physical name fa-training-app-assets.' },
        { id: 'missing-capability', text: 'The stack was created without CAPABILITY_NAMED_IAM.' },
        { id: 'bad-encryption', text: 'S3 does not support AES256 server-side encryption in CloudFormation.' },
        { id: 'rollback-is-cause', text: 'ROLLBACK_COMPLETE itself caused the AppBucket creation to fail.' }
      ],
      correctOptionId: 'bucket-name-conflict',
      explanation: 'The first CREATE_FAILED event is AppBucket, and its status reason explicitly reports that fa-training-app-assets already exists.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective recovery?',
      options: [
        { id: 'unique-name-recreate', text: 'Change or remove the explicit BucketName so the new bucket has a unique physical name, delete the ROLLBACK_COMPLETE stack, and create the corrected stack again.' },
        { id: 'delete-existing', text: 'Delete the existing fa-training-app-assets bucket so the failed stack can claim its name.' },
        { id: 'force-update', text: 'Run UpdateStack directly against the ROLLBACK_COMPLETE stack without deleting it.' },
        { id: 'admin-capability', text: 'Add CAPABILITY_NAMED_IAM and retry without changing the bucket name.' }
      ],
      correctOptionId: 'unique-name-recreate',
      explanation: 'The resource conflict must be removed without touching the existing workload, and a failed-create stack in ROLLBACK_COMPLETE must be deleted before recreating it with the corrected template.'
    }
  ],
  solution: {
    rootCause: 'The CloudFormation template hard-codes AppBucket to the physical S3 bucket name fa-training-app-assets, but that name is already in use by a separate workload. AppBucket therefore enters CREATE_FAILED and CloudFormation rolls the new stack back to ROLLBACK_COMPLETE.',
    fix: 'Change AppBucket to use a different unique bucket name or remove BucketName so CloudFormation generates one, leave the existing bucket untouched, delete the ROLLBACK_COMPLETE fa-training-web stack, and create the stack again until it reaches CREATE_COMPLETE.',
    prevention: 'Avoid reusable templates with fixed globally scoped resource names; generate unique physical names from controlled parameters or allow CloudFormation to name resources, and review the first failed stack event whenever a deployment rolls back.'
  }
});
