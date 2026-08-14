import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAuthorPlanning } from '../../../../src/features/followAlongAuthor/authorPlanning.js';
import { validateAuthorContent } from '../../../../src/features/followAlongAuthor/authorContent.js';
import { validateAuthorReview } from '../../../../src/features/followAlongAuthor/authorReview.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const preparedAt = '2026-08-14T15:00:00.000Z';
const sessionId = 'author-assistant-s3-codex-20260814-001';
const programmeId = 's3-learning-path';

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(value) {
  return crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
}

function consoleStep(taskId, number, title, instructions, expectedResult, warning = '', jsonBlocks = []) {
  const id = `${taskId}-console-step-${number}-${slug(title)}`;
  return {
    id,
    stepNumber: number,
    number,
    title,
    instruction: instructions[0],
    instructions: instructions.map((text, index) => ({ id: `${id}-instruction-${index + 1}`, text, detail: '' })),
    jsonBlocks: jsonBlocks.map((block, index) => ({
      id: `${id}-json-${index + 1}`,
      title: block.title,
      content: block.content,
      language: block.language || 'json',
      sourceIds: block.sourceIds || []
    })),
    commands: [],
    expectedResult,
    warning,
    sourceIds: []
  };
}

function cliStep(taskId, number, command, explanation, expectedResult, warning = '') {
  return {
    id: `${taskId}-cli-step-${number}`,
    stepNumber: number,
    number,
    command,
    explanation,
    expectedResult,
    instructions: [],
    commands: [],
    warning,
    sourceIds: []
  };
}

function verification(taskId, number, title, instruction, expectedResult, mode = 'either') {
  return { id: `${taskId}-verification-${number}`, title, instruction, expectedResult, mode };
}

const taskDefinitions = [
  {
    title: 'Create secure S3 training access',
    phase: 1,
    feature: 'IAM and AWS CLI bootstrap',
    goal: 'Create a dedicated fa-s3-user, a temporary training policy, and a named fa-s3 CLI profile without using the root user for routine work.',
    why: 'SAA-C03 expects secure human access, least privilege, role separation, and verification of the active AWS identity before resources are changed.',
    difficulty: 'Medium',
    sources: ['iam-best-practices', 'cli-config', 's3-policy-keys'],
    console: [
      ['Create the temporary training policy', [
        'Sign in with an existing administrator-capable identity; do not use the root user for routine lab work.',
        'Open IAM from the AWS Console search bar.',
        'In the left navigation, choose Policies, then choose Create policy.',
        'Choose the JSON editor.',
        'Replace <ACCOUNT_ID> with the 12-digit account ID shown in the Console account menu.',
        'Replace the editor content with the complete policy JSON shown below.',
        'Choose Next.',
        'Enter fa-s3-training-policy as the policy name.',
        'Choose Create policy.'
      ], 'IAM lists fa-s3-training-policy as a customer-managed policy.', 'This broad temporary training policy is for the named fa-s3 resources only. Delete it in the final cleanup.', [{
        title: 'fa-s3-training-policy.json',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            { Sid: 'IdentityAndDiscovery', Effect: 'Allow', Action: ['sts:GetCallerIdentity', 's3:ListAllMyBuckets', 's3:GetAccountPublicAccessBlock', 'cloudfront:ListDistributions', 'cloudfront:ListOriginAccessControls', 'lambda:ListFunctions', 'sqs:ListQueues', 'sns:ListTopics', 'events:ListRules', 'cloudtrail:ListTrails', 'athena:ListWorkGroups', 'logs:DescribeLogGroups', 'cloudwatch:ListMetrics'], Resource: '*' },
            { Sid: 'ManageNamedS3TrainingBuckets', Effect: 'Allow', Action: ['s3:*'], Resource: ['arn:aws:s3:::fa-s3-*', 'arn:aws:s3:::fa-s3-*/*'] },
            { Sid: 'ManageNamedIntegratedResources', Effect: 'Allow', Action: ['lambda:*', 'logs:*', 'sqs:*', 'sns:*', 'events:*', 'cloudwatch:*', 'cloudtrail:*', 'athena:*', 'glue:*', 'kms:DescribeKey', 'kms:ListAliases', 'cloudfront:*'], Resource: '*' },
            { Sid: 'ManageNamedLabRolesAndPolicy', Effect: 'Allow', Action: ['iam:CreateRole', 'iam:DeleteRole', 'iam:GetRole', 'iam:PutRolePolicy', 'iam:DeleteRolePolicy', 'iam:AttachRolePolicy', 'iam:DetachRolePolicy', 'iam:PassRole'], Resource: ['arn:aws:iam::<ACCOUNT_ID>:role/fa-s3-*'] },
            { Sid: 'ManageOwnTrainingAccess', Effect: 'Allow', Action: ['iam:GetUser', 'iam:ListAttachedUserPolicies', 'iam:ListAccessKeys'], Resource: 'arn:aws:iam::<ACCOUNT_ID>:user/fa-s3-user' }
          ]
        }, null, 2),
        sourceIds: ['iam-best-practices', 's3-policy-keys']
      }]],
      ['Create and sign in as the training user', [
        'In IAM, choose Users, then choose Create user.',
        'Enter fa-s3-user as the user name.',
        'Enable AWS Management Console access and use your normal secure temporary-password process.',
        'Require a password change at first sign-in.',
        'Finish creating the user.',
        'Open fa-s3-user, choose Add permissions, then Attach policies directly.',
        'Select only fa-s3-training-policy and complete the attachment.',
        'Open the Security credentials tab and create one access key for Command Line Interface use.',
        'Record the access key ID as [FA_S3_ACCESS_KEY_ID] and store the secret only in the AWS CLI credential prompt.',
        'Sign out of the administrator and sign in as fa-s3-user.'
      ], 'The Console account menu identifies fa-s3-user and the temporary policy is attached.', 'Never put the secret access key in Author, source control, screenshots, commands, or chat.']
    ],
    cli: [
      ['aws sts get-caller-identity --profile [ADMIN_PROFILE]', 'Confirm the administrator profile and account before bootstrap.', 'The Account value is the intended AWS account and the ARN is not root.', 'Stop if the account or identity is unexpected.'],
      ['aws iam create-user --user-name fa-s3-user --profile [ADMIN_PROFILE]', 'Create the dedicated training IAM user.', 'The returned UserName is fa-s3-user.'],
      ['aws iam create-policy --policy-name fa-s3-training-policy --policy-document file://fa-s3-training-policy.json --profile [ADMIN_PROFILE]', 'Create the supplied customer-managed policy after replacing <ACCOUNT_ID>.', 'The output contains the policy ARN; record it as [FA_S3_POLICY_ARN].'],
      ['aws iam attach-user-policy --user-name fa-s3-user --policy-arn [FA_S3_POLICY_ARN] --profile [ADMIN_PROFILE]', 'Attach only the named training policy.', 'The command returns without an error.'],
      ['aws iam create-access-key --user-name fa-s3-user --profile [ADMIN_PROFILE]', 'Create one temporary programmatic key.', 'Record the AccessKeyId as [FA_S3_ACCESS_KEY_ID] and configure the secret immediately.', 'The secret is displayed once and must not be saved in the repository.'],
      ['aws configure --profile fa-s3', 'Enter the temporary key, secret, eu-west-2, and json at the prompts.', 'The named fa-s3 profile is created locally.'],
      ['aws sts get-caller-identity --profile fa-s3', 'Verify the training identity before creating resources.', 'The ARN ends with user/fa-s3-user and the Account value is correct.']
    ],
    checks: [
      ['Confirm Console identity', 'Open the account menu and inspect the signed-in identity.', 'The identity is fa-s3-user, not root or the bootstrap administrator.', 'console'],
      ['Confirm CLI identity and Region', 'Run get-caller-identity and aws configure get region --profile fa-s3.', 'The identity is fa-s3-user and the Region is eu-west-2.', 'cli']
    ]
  },
  {
    title: 'Create a private encrypted bucket and work with objects',
    phase: 1,
    feature: 'S3 buckets, objects, encryption, and public access controls',
    goal: 'Create one private general purpose bucket, upload harmless files, understand object keys, and prove that public access remains blocked.',
    why: 'S3 security, bucket naming, object keys, encryption, and access controls are core SAA-C03 storage concepts.',
    difficulty: 'Easy',
    sources: ['s3-welcome', 's3-create-bucket', 's3-upload', 's3-block-public', 's3-encryption'],
    console: [
      ['Create the private bucket', [
        'Set the Console Region to eu-west-2.',
        'Open Amazon S3 and choose General purpose buckets.',
        'Choose Create bucket.',
        'Leave Bucket type set to General purpose.',
        'Enter fa-s3-foundations-<ACCOUNT_ID> as the globally unique bucket name.',
        'Confirm Object Ownership is Bucket owner enforced.',
        'Leave all four Block Public Access settings enabled.',
        'Under Default encryption, select Server-side encryption with Amazon S3 managed keys (SSE-S3).',
        'Enable Bucket Key only if the Console presents it for the selected encryption type.',
        'Choose Create bucket.'
      ], 'The bucket fa-s3-foundations-<ACCOUNT_ID> is available in eu-west-2 and shows public access blocked.', 'Do not disable Block Public Access or use an existing bucket.'],
      ['Upload, inspect, download, and copy a harmless object', [
        'Create a small local text file named hello-s3.txt containing no confidential information.',
        'Open fa-s3-foundations-<ACCOUNT_ID> and choose Create folder.',
        'Enter foundations as the folder name and create it.',
        'Open foundations and choose Upload.',
        'Choose Add files and select hello-s3.txt.',
        'Expand Properties and confirm the selected encryption setting uses the bucket default.',
        'Choose Upload and wait for the success message.',
        'Open the object and record its full key as foundations/hello-s3.txt.',
        'Choose Download and verify the downloaded text.',
        'Select the object, choose Actions, then Copy.',
        'Set the destination key to foundations/hello-s3-copy.txt and finish the copy.'
      ], 'Both foundations/hello-s3.txt and foundations/hello-s3-copy.txt appear and neither object is public.']
    ],
    cli: [
      ['aws s3api create-bucket --bucket fa-s3-foundations-<ACCOUNT_ID> --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-s3', 'Create the named regional general purpose bucket.', 'The command returns a Location value.'],
      ['aws s3api put-public-access-block --bucket fa-s3-foundations-<ACCOUNT_ID> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true --profile fa-s3', 'Explicitly enable all four bucket public-access controls.', 'The command returns without an error.'],
      ['aws s3api put-bucket-encryption --bucket fa-s3-foundations-<ACCOUNT_ID> --server-side-encryption-configuration Rules=[{ApplyServerSideEncryptionByDefault={SSEAlgorithm=AES256}}] --profile fa-s3', 'Set SSE-S3 as the bucket default encryption.', 'The command returns without an error.'],
      ['aws s3 cp hello-s3.txt s3://fa-s3-foundations-<ACCOUNT_ID>/foundations/hello-s3.txt --profile fa-s3', 'Upload the harmless source object.', 'The upload line names foundations/hello-s3.txt.'],
      ['aws s3api head-object --bucket fa-s3-foundations-<ACCOUNT_ID> --key foundations/hello-s3.txt --profile fa-s3', 'Inspect metadata without downloading the body.', 'The response includes ContentLength, ETag, and ServerSideEncryption AES256.'],
      ['aws s3api copy-object --bucket fa-s3-foundations-<ACCOUNT_ID> --copy-source fa-s3-foundations-<ACCOUNT_ID>/foundations/hello-s3.txt --key foundations/hello-s3-copy.txt --profile fa-s3', 'Create a second key from the first object.', 'The response includes CopyObjectResult.']
    ],
    checks: [
      ['Verify bucket protection', 'Open Permissions and Default encryption for the bucket.', 'All four public access settings are on and default encryption is SSE-S3.', 'console'],
      ['Verify object keys', 'List the foundations prefix.', 'The original and copy have distinct keys and the expected sizes.', 'either']
    ]
  },
  {
    title: 'Enable versioning and recover overwritten or deleted objects',
    phase: 2,
    feature: 'S3 Versioning and delete markers',
    goal: 'Create multiple versions of one object, recover an earlier version, and restore an object hidden by a delete marker.',
    why: 'Versioning protects against accidental overwrites and deletions and is a foundation for replication and resilient S3 designs.',
    difficulty: 'Easy',
    sources: ['s3-versioning', 's3-delete-markers'],
    console: [
      ['Enable versioning and create two versions', [
        'Open fa-s3-foundations-<ACCOUNT_ID>.',
        'Choose Properties.',
        'In Bucket Versioning, choose Edit.',
        'Select Enable and save changes.',
        'Return to Objects and open foundations.',
        'Edit hello-s3.txt locally so the text clearly says version 2.',
        'Upload it again using exactly the same key foundations/hello-s3.txt.',
        'Turn on Show versions.',
        'Confirm the object key has at least two different version IDs.'
      ], 'The same object key has a current version and an older noncurrent version.', 'After first enabling versioning, AWS advises allowing time for the setting to propagate before critical writes.'],
      ['Recover from overwrite and deletion', [
        'With Show versions enabled, select the older version of foundations/hello-s3.txt.',
        'Choose Download and confirm it contains the original text.',
        'Turn off Show versions and delete foundations/hello-s3.txt.',
        'Turn Show versions on again.',
        'Find the delete marker for foundations/hello-s3.txt.',
        'Select only that delete marker and choose Delete.',
        'Confirm permanent deletion of the marker.',
        'Turn Show versions off and open foundations/hello-s3.txt.'
      ], 'Removing the delete marker makes the previous object version current and visible again.', 'Delete only the marker, not the retained object versions.']
    ],
    cli: [
      ['aws s3api put-bucket-versioning --bucket fa-s3-foundations-<ACCOUNT_ID> --versioning-configuration Status=Enabled --profile fa-s3', 'Enable bucket versioning.', 'The command returns without an error.'],
      ['aws s3 cp hello-s3-v2.txt s3://fa-s3-foundations-<ACCOUNT_ID>/foundations/hello-s3.txt --profile fa-s3', 'Upload changed content under the existing key.', 'The upload completes.'],
      ['aws s3api list-object-versions --bucket fa-s3-foundations-<ACCOUNT_ID> --prefix foundations/hello-s3.txt --profile fa-s3', 'List version IDs and current status.', 'At least two Versions entries have different VersionId values.'],
      ['aws s3api delete-object --bucket fa-s3-foundations-<ACCOUNT_ID> --key foundations/hello-s3.txt --profile fa-s3', 'Create a delete marker rather than permanently deleting versioned data.', 'The response includes DeleteMarker true and a VersionId; record it as [HELLO_DELETE_MARKER_ID].'],
      ['aws s3api delete-object --bucket fa-s3-foundations-<ACCOUNT_ID> --key foundations/hello-s3.txt --version-id [HELLO_DELETE_MARKER_ID] --profile fa-s3', 'Remove only the recorded delete marker.', 'The response confirms the marker version was deleted.'],
      ['aws s3api head-object --bucket fa-s3-foundations-<ACCOUNT_ID> --key foundations/hello-s3.txt --profile fa-s3', 'Prove the earlier version is visible again.', 'Metadata is returned without a 404 error.']
    ],
    checks: [
      ['Verify multiple versions', 'Show versions for foundations/hello-s3.txt.', 'Multiple unique version IDs remain available.', 'either'],
      ['Verify recovery', 'Open or download the restored current object.', 'The object is accessible after removal of only the delete marker.', 'either']
    ]
  },
  {
    title: 'Create lifecycle rules for cost and retention management',
    phase: 2,
    feature: 'S3 Lifecycle and storage classes',
    goal: 'Apply a lifecycle rule only to training objects and understand current-version transition, noncurrent-version expiration, and incomplete multipart cleanup.',
    why: 'SAA-C03 regularly tests storage-class selection, lifecycle transitions, retention, and the effect of versioning on expiration.',
    difficulty: 'Medium',
    sources: ['s3-lifecycle', 's3-storage-classes'],
    console: [
      ['Create a prefix-scoped lifecycle rule', [
        'Open fa-s3-foundations-<ACCOUNT_ID> and choose Management.',
        'Choose Create lifecycle rule.',
        'Enter fa-s3-training-lifecycle as the rule name.',
        'Choose Limit the scope to specific prefixes or tags.',
        'Enter foundations/ as the prefix.',
        'Select Transition current versions of objects between storage classes.',
        'Choose Standard-IA and enter 30 days after object creation.',
        'Select Permanently delete noncurrent versions of objects and enter 30 days after they become noncurrent.',
        'Retain 1 newer noncurrent version if that field is available.',
        'Select Delete incomplete multipart uploads and enter 7 days.',
        'Review the timeline and choose Create rule.'
      ], 'Management lists an enabled fa-s3-training-lifecycle rule scoped to foundations/.', 'Lifecycle actions are asynchronous and transition or minimum-storage charges may apply; this lab verifies configuration rather than waiting 30 days.', [{
        title: 'fa-s3-lifecycle.json',
        content: JSON.stringify({ Rules: [{ ID: 'fa-s3-training-lifecycle', Status: 'Enabled', Filter: { Prefix: 'foundations/' }, Transitions: [{ Days: 30, StorageClass: 'STANDARD_IA' }], NoncurrentVersionExpiration: { NoncurrentDays: 30, NewerNoncurrentVersions: 1 }, AbortIncompleteMultipartUpload: { DaysAfterInitiation: 7 } }] }, null, 2),
        sourceIds: ['s3-lifecycle']
      }]],
      ['Review lifecycle behaviour without waiting', [
        'Open the lifecycle rule and review its current-version timeline.',
        'Confirm only keys beginning foundations/ match the rule.',
        'Confirm current versions transition after 30 days rather than immediately.',
        'Confirm old versions are permanently removed only after becoming noncurrent for 30 days.',
        'Confirm unfinished multipart uploads are removed after 7 days.',
        'Return to Objects and verify the current training objects still exist.'
      ], 'The learner can explain each action and the current objects remain available during the lab.']
    ],
    cli: [
      ['aws s3api put-bucket-lifecycle-configuration --bucket fa-s3-foundations-<ACCOUNT_ID> --lifecycle-configuration file://fa-s3-lifecycle.json --profile fa-s3', 'Apply the supplied prefix-scoped lifecycle JSON.', 'The command returns without an error.'],
      ['aws s3api get-bucket-lifecycle-configuration --bucket fa-s3-foundations-<ACCOUNT_ID> --profile fa-s3', 'Retrieve the active rule.', 'The response shows ID fa-s3-training-lifecycle, Prefix foundations/, and Status Enabled.'],
      ['aws s3api list-objects-v2 --bucket fa-s3-foundations-<ACCOUNT_ID> --prefix foundations/ --profile fa-s3', 'Confirm lifecycle does not immediately remove current objects.', 'The expected training object keys remain listed.']
    ],
    checks: [
      ['Verify rule scope', 'Inspect the rule filter and timeline.', 'Only foundations/ is targeted and every timing value matches the lab.', 'either'],
      ['Explain version-aware expiration', 'Compare current-version transition with noncurrent-version expiration.', 'The learner can state that deleting a current version in a versioned bucket normally creates a delete marker.', 'either']
    ]
  },
  {
    title: 'Process S3 uploads with Lambda',
    phase: 3,
    feature: 'S3 event notifications, Lambda, and CloudWatch Logs',
    goal: 'Invoke a small Lambda function when a file is uploaded under incoming/ and verify the event in CloudWatch Logs.',
    why: 'Event-driven file processing is a common serverless pattern and SAA-C03 tests source permissions, Region alignment, and recursive-trigger prevention.',
    difficulty: 'Medium',
    sources: ['lambda-s3-trigger', 's3-events'],
    console: [
      ['Create the Lambda execution role and function', [
        'Switch to the IAM console while remaining signed in as fa-s3-user.',
        'Choose Roles, then Create role.',
        'Choose AWS service and Lambda as the trusted use case.',
        'Attach AWSLambdaBasicExecutionRole.',
        'Name the role fa-s3-lambda-role and create it.',
        'Open Lambda in eu-west-2 and choose Create function.',
        'Choose Author from scratch.',
        'Enter fa-s3-object-inspector as the function name.',
        'Choose the latest supported Python 3 runtime offered by the Console.',
        'Choose Use an existing role and select fa-s3-lambda-role.',
        'Create the function.',
        'Replace the code with the complete Python code shown below and choose Deploy.'
      ], 'Lambda lists fa-s3-object-inspector with fa-s3-lambda-role and deployed code.', 'The function logs only bucket, key, size, and event name; do not upload confidential files.', [{
        title: 'lambda_function.py',
        language: 'text',
        content: `import json\nimport urllib.parse\n\ndef lambda_handler(event, context):\n    records = []\n    for record in event.get("Records", []):\n        records.append({\n            "event": record.get("eventName"),\n            "bucket": record["s3"]["bucket"]["name"],\n            "key": urllib.parse.unquote_plus(record["s3"]["object"]["key"]),\n            "size": record["s3"]["object"].get("size")\n        })\n    print(json.dumps(records))\n    return {"processed": len(records)}`,
        sourceIds: ['lambda-s3-trigger']
      }, {
        title: 'lambda-trust-policy.json',
        content: JSON.stringify({ Version: '2012-10-17', Statement: [{ Effect: 'Allow', Principal: { Service: 'lambda.amazonaws.com' }, Action: 'sts:AssumeRole' }] }, null, 2),
        sourceIds: ['lambda-s3-trigger']
      }]],
      ['Add a prefix-filtered S3 trigger and test it', [
        'Open fa-s3-object-inspector and choose Add trigger.',
        'Choose S3 as the source.',
        'Select fa-s3-foundations-<ACCOUNT_ID>.',
        'Select All object create events.',
        'Enter incoming/ as the Prefix.',
        'Acknowledge the recursive-invocation warning because this function writes no S3 objects.',
        'Choose Add.',
        'Upload a harmless file as incoming/lambda-test.txt.',
        'Open Monitor, choose View CloudWatch logs, and open the newest log stream.',
        'Find the JSON log line containing incoming/lambda-test.txt.'
      ], 'CloudWatch Logs shows one processed S3 ObjectCreated event for incoming/lambda-test.txt.', 'Never configure an unfiltered trigger if the same function writes back into its triggering location.', [{
        title: 'lambda-notification.json',
        content: JSON.stringify({ LambdaFunctionConfigurations: [{ Id: 'fa-s3-to-lambda', LambdaFunctionArn: 'arn:aws:lambda:eu-west-2:<ACCOUNT_ID>:function:fa-s3-object-inspector', Events: ['s3:ObjectCreated:*'], Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'incoming/' }] } } }] }, null, 2),
        sourceIds: ['s3-events', 'lambda-s3-trigger']
      }]]
    ],
    cli: [
      ['aws iam create-role --role-name fa-s3-lambda-role --assume-role-policy-document file://lambda-trust-policy.json --profile fa-s3', 'Create the supplied Lambda trust role.', 'The output names fa-s3-lambda-role.'],
      ['aws iam attach-role-policy --role-name fa-s3-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --profile fa-s3', 'Allow the function to write CloudWatch Logs.', 'The command returns without an error.'],
      ['Compress-Archive -Path lambda_function.py -DestinationPath fa-s3-object-inspector.zip -Force', 'Package only the supplied Lambda source file in PowerShell.', 'fa-s3-object-inspector.zip exists and contains lambda_function.py at its root.'],
      ['aws lambda create-function --function-name fa-s3-object-inspector --runtime python3.13 --role arn:aws:iam::<ACCOUNT_ID>:role/fa-s3-lambda-role --handler lambda_function.lambda_handler --zip-file fileb://fa-s3-object-inspector.zip --region eu-west-2 --profile fa-s3', 'Create the function from the locally packaged supplied code.', 'State is Pending or Active; wait until Active.'],
      ['aws lambda add-permission --function-name fa-s3-object-inspector --statement-id AllowS3Invoke --action lambda:InvokeFunction --principal s3.amazonaws.com --source-arn arn:aws:s3:::fa-s3-foundations-<ACCOUNT_ID> --source-account <ACCOUNT_ID> --region eu-west-2 --profile fa-s3', 'Allow only the named bucket to invoke the function.', 'The response contains the AllowS3Invoke statement.'],
      ['aws s3api put-bucket-notification-configuration --bucket fa-s3-foundations-<ACCOUNT_ID> --notification-configuration file://lambda-notification.json --profile fa-s3', 'Apply the supplied ObjectCreated notification filtered to incoming/.', 'The command returns without an error.'],
      ['aws s3 cp lambda-test.txt s3://fa-s3-foundations-<ACCOUNT_ID>/incoming/lambda-test.txt --profile fa-s3', 'Upload a harmless trigger object.', 'The upload completes.'],
      ['aws logs tail /aws/lambda/fa-s3-object-inspector --since 10m --region eu-west-2 --profile fa-s3', 'Read recent function logs.', 'A log line identifies incoming/lambda-test.txt.']
    ],
    checks: [
      ['Verify filtered trigger', 'Inspect the function trigger configuration.', 'The bucket and incoming/ prefix are exact.', 'console'],
      ['Verify invocation', 'Inspect the latest CloudWatch log stream.', 'The harmless test object appears and there is no recursive loop.', 'either']
    ]
  },
  {
    title: 'Buffer S3 events through SQS and Lambda',
    phase: 3,
    feature: 'S3, SQS, dead-letter queues, and Lambda event source mappings',
    goal: 'Send S3 upload events to an SQS queue with a dead-letter queue and let Lambda consume the buffered messages.',
    why: 'A queue decouples producers and consumers, absorbs traffic spikes, and supports controlled retry and failure handling.',
    difficulty: 'Hard',
    sources: ['s3-notification-walkthrough', 's3-events', 'lambda-sqs'],
    console: [
      ['Create the dead-letter queue and source queue', [
        'Open Amazon SQS in eu-west-2.',
        'Choose Create queue and keep Standard selected.',
        'Enter fa-s3-events-dlq and create the queue.',
        'Record its ARN as [S3_EVENTS_DLQ_ARN].',
        'Create another Standard queue named fa-s3-events-queue.',
        'Expand Dead-letter queue.',
        'Enable the dead-letter queue and select fa-s3-events-dlq.',
        'Set Maximum receives to 3.',
        'Create the source queue and record its ARN as [S3_EVENTS_QUEUE_ARN].',
        'Open the source queue Access policy and add the supplied statement allowing only the named S3 bucket to call SendMessage.'
      ], 'Both queues exist, the source queue targets the DLQ, and its policy grants the named bucket SendMessage.', 'Use Standard queues for direct S3 notifications; direct S3 notifications do not support SQS FIFO.', [{
        title: 'fa-s3-events-queue-policy.json',
        content: JSON.stringify({ Version: '2012-10-17', Statement: [{ Sid: 'AllowNamedS3Bucket', Effect: 'Allow', Principal: { Service: 's3.amazonaws.com' }, Action: 'sqs:SendMessage', Resource: '[S3_EVENTS_QUEUE_ARN]', Condition: { ArnEquals: { 'aws:SourceArn': 'arn:aws:s3:::fa-s3-foundations-<ACCOUNT_ID>' }, StringEquals: { 'aws:SourceAccount': '<ACCOUNT_ID>' } } }] }, null, 2),
        sourceIds: ['s3-notification-walkthrough']
      }, {
        title: 'sqs-redrive-and-policy.json',
        content: JSON.stringify({ RedrivePolicy: '{"deadLetterTargetArn":"[S3_EVENTS_DLQ_ARN]","maxReceiveCount":"3"}', Policy: '{"Version":"2012-10-17","Statement":[{"Sid":"AllowNamedS3Bucket","Effect":"Allow","Principal":{"Service":"s3.amazonaws.com"},"Action":"sqs:SendMessage","Resource":"[S3_EVENTS_QUEUE_ARN]","Condition":{"ArnEquals":{"aws:SourceArn":"arn:aws:s3:::fa-s3-foundations-<ACCOUNT_ID>"},"StringEquals":{"aws:SourceAccount":"<ACCOUNT_ID>"}}}]}' }, null, 2),
        sourceIds: ['s3-notification-walkthrough']
      }]],
      ['Route queue/ uploads to SQS and connect Lambda', [
        'Open the S3 bucket Properties tab.',
        'Under Event notifications, choose Create event notification.',
        'Enter fa-s3-to-sqs.',
        'Enter queue/ as the Prefix.',
        'Select All object create events.',
        'Choose SQS queue as the destination and select fa-s3-events-queue.',
        'Save the notification.',
        'Open fa-s3-object-inspector in Lambda and choose Add trigger.',
        'Choose SQS and select fa-s3-events-queue.',
        'Keep batch size small at 1 for this training test and add the trigger.',
        'Upload queue/buffer-test.txt to the S3 bucket.',
        'Open the Lambda CloudWatch logs and verify an SQS event was received.'
      ], 'The S3 event travels through fa-s3-events-queue and invokes the Lambda consumer.', 'Adding an SQS trigger requires the Lambda execution role to have receive and delete permissions for the source queue.', [{
        title: 'sqs-notification.json',
        content: JSON.stringify({ LambdaFunctionConfigurations: [{ Id: 'fa-s3-to-lambda', LambdaFunctionArn: 'arn:aws:lambda:eu-west-2:<ACCOUNT_ID>:function:fa-s3-object-inspector', Events: ['s3:ObjectCreated:*'], Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'incoming/' }] } } }], QueueConfigurations: [{ Id: 'fa-s3-to-sqs', QueueArn: '[S3_EVENTS_QUEUE_ARN]', Events: ['s3:ObjectCreated:*'], Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'queue/' }] } } }] }, null, 2),
        sourceIds: ['s3-events', 's3-notification-walkthrough']
      }]]
    ],
    cli: [
      ['aws sqs create-queue --queue-name fa-s3-events-dlq --region eu-west-2 --profile fa-s3', 'Create the dead-letter queue.', 'Record QueueUrl as [S3_EVENTS_DLQ_URL].'],
      ['aws sqs create-queue --queue-name fa-s3-events-queue --region eu-west-2 --profile fa-s3', 'Create the source Standard queue.', 'Record QueueUrl as [S3_EVENTS_QUEUE_URL].'],
      ['aws sqs set-queue-attributes --queue-url [S3_EVENTS_QUEUE_URL] --attributes file://sqs-redrive-and-policy.json --region eu-west-2 --profile fa-s3', 'Apply the supplied redrive policy and S3 SendMessage queue policy.', 'The command returns without an error.'],
      ['aws iam attach-role-policy --role-name fa-s3-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole --profile fa-s3', 'Allow the Lambda consumer to poll and delete SQS messages.', 'The command returns without an error.'],
      ['aws s3api put-bucket-notification-configuration --bucket fa-s3-foundations-<ACCOUNT_ID> --notification-configuration file://sqs-notification.json --profile fa-s3', 'Replace the notification configuration with the supplied queue/ SQS route and required retained Lambda route.', 'The command returns without an error.'],
      ['aws lambda create-event-source-mapping --function-name fa-s3-object-inspector --event-source-arn [S3_EVENTS_QUEUE_ARN] --batch-size 1 --region eu-west-2 --profile fa-s3', 'Connect the SQS source queue to Lambda.', 'Record the returned UUID as [S3_EVENT_MAPPING_UUID].'],
      ['aws s3 cp buffer-test.txt s3://fa-s3-foundations-<ACCOUNT_ID>/queue/buffer-test.txt --profile fa-s3', 'Send a test upload through the queue path.', 'The upload completes and Lambda logs an SQS Records event.']
    ],
    checks: [
      ['Verify redrive policy', 'Open fa-s3-events-queue and inspect its dead-letter queue settings.', 'fa-s3-events-dlq is selected and maximum receives is 3.', 'either'],
      ['Verify buffered delivery', 'Inspect Lambda logs and the queue monitoring values.', 'Lambda receives the SQS event and the visible source-queue count returns toward zero.', 'either']
    ]
  },
  {
    title: 'Fan out and route S3 events with SNS and EventBridge',
    phase: 4,
    feature: 'SNS fan-out and EventBridge event filtering',
    goal: 'Send a direct upload notification to SNS and route selected S3 deletion events through EventBridge to the same notification topic.',
    why: 'SNS supports push fan-out while EventBridge provides content-based event routing; choosing between them and SQS is a key architecture skill.',
    difficulty: 'Medium',
    sources: ['s3-notification-walkthrough', 's3-eventbridge-events', 'messaging-decision-guide'],
    console: [
      ['Create an SNS topic and confirmed email subscription', [
        'Open Amazon SNS in eu-west-2.',
        'Choose Topics, then Create topic.',
        'Choose Standard and enter fa-s3-events-topic.',
        'Create the topic and record its ARN as [S3_EVENTS_TOPIC_ARN].',
        'Choose Create subscription.',
        'Select Email as the protocol and enter an email address you control.',
        'Create the subscription.',
        'Open the confirmation email and confirm the subscription.',
        'Return to SNS and verify the subscription status is Confirmed.',
        'Edit the topic access policy so only the named S3 bucket and EventBridge can publish.'
      ], 'SNS shows fa-s3-events-topic with a confirmed subscription and restricted publisher policy.', 'Email endpoints can receive messages during the test; remove the subscription during cleanup.'],
      ['Create direct SNS and EventBridge routes', [
        'Open the S3 bucket Properties tab and create an event notification named fa-s3-to-sns.',
        'Use prefix notify/ and All object create events.',
        'Choose SNS topic and select fa-s3-events-topic.',
        'Save the notification.',
        'In the Event notifications section, enable Amazon EventBridge for the bucket.',
        'Open EventBridge in eu-west-2 and choose Rules.',
        'Create a rule named fa-s3-delete-route on the default event bus.',
        'Use an event pattern with source aws.s3, detail-type Object Deleted, and the exact bucket name.',
        'Choose SNS topic fa-s3-events-topic as the target.',
        'Create the rule.',
        'Upload notify/sns-test.txt and confirm the direct SNS email.',
        'Delete a harmless test object and confirm a separate EventBridge-routed message.'
      ], 'The email endpoint receives an upload notification and a separately routed deletion event.', 'Event delivery can be asynchronous and duplicate events are possible; consumers must be idempotent.', [{
        title: 'fa-s3-delete-event-pattern.json',
        content: JSON.stringify({ source: ['aws.s3'], 'detail-type': ['Object Deleted'], detail: { bucket: { name: ['fa-s3-foundations-<ACCOUNT_ID>'] } } }, null, 2),
        sourceIds: ['s3-eventbridge-events']
      }, {
        title: 'combined-notifications.json',
        content: JSON.stringify({ LambdaFunctionConfigurations: [{ Id: 'fa-s3-to-lambda', LambdaFunctionArn: 'arn:aws:lambda:eu-west-2:<ACCOUNT_ID>:function:fa-s3-object-inspector', Events: ['s3:ObjectCreated:*'], Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'incoming/' }] } } }], QueueConfigurations: [{ Id: 'fa-s3-to-sqs', QueueArn: '[S3_EVENTS_QUEUE_ARN]', Events: ['s3:ObjectCreated:*'], Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'queue/' }] } } }], TopicConfigurations: [{ Id: 'fa-s3-to-sns', TopicArn: '[S3_EVENTS_TOPIC_ARN]', Events: ['s3:ObjectCreated:*'], Filter: { Key: { FilterRules: [{ Name: 'prefix', Value: 'notify/' }] } } }], EventBridgeConfiguration: {} }, null, 2),
        sourceIds: ['s3-events', 's3-notification-walkthrough', 's3-eventbridge-events']
      }]]
    ],
    cli: [
      ['aws sns create-topic --name fa-s3-events-topic --region eu-west-2 --profile fa-s3', 'Create the Standard SNS topic.', 'Record TopicArn as [S3_EVENTS_TOPIC_ARN].'],
      ['aws sns subscribe --topic-arn [S3_EVENTS_TOPIC_ARN] --protocol email --notification-endpoint [EMAIL_ADDRESS] --region eu-west-2 --profile fa-s3', 'Create the email subscription.', 'The response shows pending confirmation until the email link is used.'],
      ['aws s3api put-bucket-notification-configuration --bucket fa-s3-foundations-<ACCOUNT_ID> --notification-configuration file://combined-notifications.json --profile fa-s3', 'Apply the supplied complete notification configuration containing the retained Lambda, SQS, SNS, and EventBridge settings.', 'The command returns without an error.'],
      ['aws events put-rule --name fa-s3-delete-route --event-pattern file://fa-s3-delete-event-pattern.json --state ENABLED --region eu-west-2 --profile fa-s3', 'Create the deletion-event rule.', 'The output contains the rule ARN.'],
      ['aws events put-targets --rule fa-s3-delete-route --targets Id=SnsTarget,Arn=[S3_EVENTS_TOPIC_ARN] --region eu-west-2 --profile fa-s3', 'Attach SNS as the rule target.', 'FailedEntryCount is 0.'],
      ['aws s3 cp sns-test.txt s3://fa-s3-foundations-<ACCOUNT_ID>/notify/sns-test.txt --profile fa-s3', 'Trigger the direct SNS upload path.', 'The upload succeeds and the confirmed endpoint receives a notification.'],
      ['aws s3 rm s3://fa-s3-foundations-<ACCOUNT_ID>/notify/sns-test.txt --profile fa-s3', 'Create an Object Deleted event for EventBridge.', 'The delete marker is created and the endpoint receives the routed event.']
    ],
    checks: [
      ['Verify both patterns', 'Compare the two received messages.', 'One represents ObjectCreated through direct SNS notification and one represents Object Deleted through EventBridge.', 'either'],
      ['Explain service choice', 'State when to use SQS, SNS, or EventBridge.', 'The learner identifies buffering, push fan-out, and content-based routing respectively.', 'either']
    ]
  },
  {
    title: 'Deliver private S3 content through CloudFront',
    phase: 5,
    feature: 'CloudFront Origin Access Control and private S3 origins',
    goal: 'Serve a small website through CloudFront while direct anonymous access to its S3 objects remains blocked.',
    why: 'CloudFront with OAC is the recommended pattern for securely delivering private S3 origin content at the edge.',
    difficulty: 'Medium',
    sources: ['cloudfront-s3-start', 'cloudfront-oac'],
    console: [
      ['Upload website content and create the distribution', [
        'Create a harmless local index.html that identifies this as the S3 training site.',
        'Upload it to fa-s3-foundations-<ACCOUNT_ID> with the key site/index.html and Content-Type text/html.',
        'Open CloudFront and choose Create distribution.',
        'For Origin domain, select fa-s3-foundations-<ACCOUNT_ID>.s3.eu-west-2.amazonaws.com; do not choose the S3 website endpoint.',
        'For Origin path, enter /site.',
        'For Origin access, choose Origin access control settings (recommended).',
        'Choose Create new OAC.',
        'Name it fa-s3-oac and keep signing behaviour set to always sign requests.',
        'Allow CloudFront to update the S3 bucket policy when offered, or copy the displayed policy for the next step.',
        'Set Viewer protocol policy to Redirect HTTP to HTTPS.',
        'Set Default root object to index.html.',
        'Create the distribution and record its ID as [CLOUDFRONT_DISTRIBUTION_ID] and domain as [CLOUDFRONT_DOMAIN].'
      ], 'The distribution deploys with the private S3 origin, /site path, OAC, HTTPS redirect, and index.html.', 'CloudFront is global and distribution deployment or deletion takes several minutes.', [{
        title: 'fa-s3-cloudfront-distribution.json',
        content: JSON.stringify({ CallerReference: '<UNIQUE_REFERENCE>', Comment: 'S3 training private distribution', Enabled: true, DefaultRootObject: 'index.html', Origins: { Quantity: 1, Items: [{ Id: 'fa-s3-origin', DomainName: 'fa-s3-foundations-<ACCOUNT_ID>.s3.eu-west-2.amazonaws.com', OriginPath: '/site', S3OriginConfig: { OriginAccessIdentity: '' }, OriginAccessControlId: '[CLOUDFRONT_OAC_ID]' }] }, DefaultCacheBehavior: { TargetOriginId: 'fa-s3-origin', ViewerProtocolPolicy: 'redirect-to-https', TrustedSigners: { Enabled: false, Quantity: 0 }, TrustedKeyGroups: { Enabled: false, Quantity: 0 }, AllowedMethods: { Quantity: 2, Items: ['HEAD', 'GET'], CachedMethods: { Quantity: 2, Items: ['HEAD', 'GET'] } }, SmoothStreaming: false, Compress: true, LambdaFunctionAssociations: { Quantity: 0 }, FunctionAssociations: { Quantity: 0 }, FieldLevelEncryptionId: '', GrpcConfig: { Enabled: false }, ForwardedValues: { QueryString: false, Cookies: { Forward: 'none' }, Headers: { Quantity: 0 }, QueryStringCacheKeys: { Quantity: 0 } }, MinTTL: 0 }, CacheBehaviors: { Quantity: 0 }, CustomErrorResponses: { Quantity: 0 }, PriceClass: 'PriceClass_100', Restrictions: { GeoRestriction: { RestrictionType: 'none', Quantity: 0 } }, ViewerCertificate: { CloudFrontDefaultCertificate: true, MinimumProtocolVersion: 'TLSv1', CertificateSource: 'cloudfront' }, HttpVersion: 'http2', IsIPV6Enabled: true, Staging: false }, null, 2),
        sourceIds: ['cloudfront-s3-start', 'cloudfront-oac']
      }, {
        title: 'fa-s3-cloudfront-bucket-policy.json',
        content: JSON.stringify({ Version: '2012-10-17', Statement: [{ Sid: 'AllowCloudFrontServicePrincipalReadOnly', Effect: 'Allow', Principal: { Service: 'cloudfront.amazonaws.com' }, Action: 's3:GetObject', Resource: 'arn:aws:s3:::fa-s3-foundations-<ACCOUNT_ID>/site/*', Condition: { StringEquals: { 'AWS:SourceArn': 'arn:aws:cloudfront::<ACCOUNT_ID>:distribution/[CLOUDFRONT_DISTRIBUTION_ID]' } } }] }, null, 2),
        sourceIds: ['cloudfront-oac']
      }]],
      ['Verify CloudFront-only access', [
        'Open the S3 bucket Permissions tab.',
        'Confirm Block Public Access remains fully enabled.',
        'Review the bucket policy statement granting only the CloudFront distribution service principal s3:GetObject access.',
        'Wait until the distribution status is Deployed.',
        'Open https://[CLOUDFRONT_DOMAIN]/ in a browser.',
        'Confirm the training page loads over HTTPS.',
        'Try the direct anonymous S3 object URL in a private browser window.',
        'Confirm direct S3 access is denied.'
      ], 'CloudFront serves index.html successfully while direct anonymous S3 access remains denied.', 'Do not make the bucket or objects public to fix a CloudFront error; correct OAC and bucket policy instead.']
    ],
    cli: [
      ['aws s3 cp index.html s3://fa-s3-foundations-<ACCOUNT_ID>/site/index.html --content-type text/html --profile fa-s3', 'Upload the website entry object.', 'The upload completes.'],
      ['aws cloudfront create-origin-access-control --origin-access-control-config Name=fa-s3-oac,Description=Training-S3-OAC,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3 --profile fa-s3', 'Create the recommended OAC.', 'Record Id as [CLOUDFRONT_OAC_ID].'],
      ['aws cloudfront create-distribution --distribution-config file://fa-s3-cloudfront-distribution.json --profile fa-s3', 'Create the distribution from the supplied configuration containing the exact S3 origin, /site path, OAC ID, HTTPS redirect, and default root object.', 'Record Distribution.Id and Distribution.DomainName.'],
      ['aws s3api put-bucket-policy --bucket fa-s3-foundations-<ACCOUNT_ID> --policy file://fa-s3-cloudfront-bucket-policy.json --profile fa-s3', 'Grant s3:GetObject only to the recorded CloudFront distribution through SourceArn.', 'The command returns without an error.'],
      ['aws cloudfront wait distribution-deployed --id [CLOUDFRONT_DISTRIBUTION_ID] --profile fa-s3', 'Wait for edge deployment before testing.', 'The wait command finishes without an error.'],
      ['aws cloudfront get-distribution --id [CLOUDFRONT_DISTRIBUTION_ID] --profile fa-s3', 'Verify deployed distribution state and domain.', 'Status is Deployed and the origin uses the named S3 bucket.']
    ],
    checks: [
      ['Verify private origin', 'Compare the CloudFront URL with the direct S3 object URL.', 'CloudFront succeeds and anonymous direct S3 access fails.', 'either'],
      ['Verify secure configuration', 'Inspect OAC, viewer protocol policy, and bucket public-access settings.', 'OAC signs origin requests, HTTP redirects to HTTPS, and public access remains blocked.', 'console']
    ]
  },
  {
    title: 'Audit S3 object access with CloudTrail and Athena',
    phase: 6,
    feature: 'CloudTrail data events, Athena, and CloudWatch monitoring',
    goal: 'Record object-level S3 API activity, query the delivered records, and create a simple bucket-size monitoring view.',
    why: 'SAA-C03 distinguishes audit records from operational metrics and expects architects to select CloudTrail, Athena, and CloudWatch appropriately.',
    difficulty: 'Hard',
    sources: ['s3-cloudtrail-data-events', 'athena-cloudtrail', 's3-monitoring'],
    console: [
      ['Create a trail with S3 data events', [
        'Create a second private bucket named fa-s3-audit-<ACCOUNT_ID> in eu-west-2 with Block Public Access enabled and SSE-S3.',
        'Open CloudTrail and choose Trails.',
        'Choose Create trail.',
        'Enter fa-s3-audit-trail.',
        'Choose the existing fa-s3-audit-<ACCOUNT_ID> bucket for log storage.',
        'Keep log file validation enabled.',
        'Under Event type, include Management events and Data events.',
        'For Data event type, choose S3.',
        'Use a selector limited to objects in arn:aws:s3:::fa-s3-foundations-<ACCOUNT_ID>/.',
        'Include read and write object events.',
        'Create the trail.',
        'Upload, download, and delete one harmless object to generate PutObject, GetObject, and DeleteObject events.'
      ], 'fa-s3-audit-trail is logging management and selected S3 object data events to the audit bucket.', 'CloudTrail data events and Athena queries can incur charges; generate only the few test events required.', [{
        title: 'fa-s3-data-events.json',
        content: JSON.stringify([{ Name: 'S3 object data events for the training bucket', FieldSelectors: [{ Field: 'eventCategory', Equals: ['Data'] }, { Field: 'resources.type', Equals: ['AWS::S3::Object'] }, { Field: 'resources.ARN', StartsWith: ['arn:aws:s3:::fa-s3-foundations-<ACCOUNT_ID>/'] }] }], null, 2),
        sourceIds: ['s3-cloudtrail-data-events']
      }]],
      ['Create an Athena table and query object activity', [
        'Wait for CloudTrail log delivery, then open Athena in eu-west-2.',
        'Open Query editor.',
        'Set the query result location to s3://fa-s3-audit-<ACCOUNT_ID>/athena-results/.',
        'Use the CloudTrail console action Create Athena table for the trail when available, or create the supplied external table.',
        'Name the table fa_s3_cloudtrail_logs.',
        'Run a query filtering eventSource = s3.amazonaws.com and the target bucket name.',
        'Select eventTime, eventName, userIdentity.arn, requestParameters.bucketName, and requestParameters.key.',
        'Order newest events first and limit the result to 20 rows.',
        'Find the generated PutObject, GetObject, and DeleteObject events.',
        'Open CloudWatch Metrics, choose S3, then Storage Metrics.',
        'Locate BucketSizeBytes and NumberOfObjects for fa-s3-foundations-<ACCOUNT_ID> and explain that daily storage metrics differ from API audit events.'
      ], 'Athena returns the generated S3 data events and CloudWatch exposes bucket storage metrics.', 'Athena charges by data scanned; always use the supplied filters and LIMIT for this lab.', [{
        title: 'fa-s3-cloudtrail-query.sql',
        language: 'text',
        content: `SELECT eventtime, eventname, useridentity.arn, requestparameters['bucketName'] AS bucket_name, requestparameters['key'] AS object_key\nFROM fa_s3_cloudtrail_logs\nWHERE eventsource = 's3.amazonaws.com'\n  AND requestparameters['bucketName'] = 'fa-s3-foundations-<ACCOUNT_ID>'\nORDER BY eventtime DESC\nLIMIT 20;`,
        sourceIds: ['athena-cloudtrail']
      }]]
    ],
    cli: [
      ['aws s3api create-bucket --bucket fa-s3-audit-<ACCOUNT_ID> --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2 --profile fa-s3', 'Create the private audit destination bucket.', 'The command returns a Location value.'],
      ['aws cloudtrail create-trail --name fa-s3-audit-trail --s3-bucket-name fa-s3-audit-<ACCOUNT_ID> --enable-log-file-validation --region eu-west-2 --profile fa-s3', 'Create the trail.', 'The output names fa-s3-audit-trail and the audit bucket.'],
      ['aws cloudtrail put-event-selectors --trail-name fa-s3-audit-trail --advanced-event-selectors file://fa-s3-data-events.json --region eu-west-2 --profile fa-s3', 'Apply the supplied selector limited to object events in the foundations bucket.', 'The response contains the S3 advanced selector.'],
      ['aws cloudtrail start-logging --name fa-s3-audit-trail --region eu-west-2 --profile fa-s3', 'Start trail logging.', 'The command returns without an error.'],
      ['aws athena start-query-execution --query-string file://fa-s3-cloudtrail-query.sql --query-execution-context Database=default --result-configuration OutputLocation=s3://fa-s3-audit-<ACCOUNT_ID>/athena-results/ --region eu-west-2 --profile fa-s3', 'Run the supplied filtered audit query after the table exists.', 'Record QueryExecutionId as [ATHENA_QUERY_ID].'],
      ['aws athena get-query-results --query-execution-id [ATHENA_QUERY_ID] --region eu-west-2 --profile fa-s3', 'Read the completed result.', 'Rows include the harmless PutObject, GetObject, or DeleteObject test activity.'],
      ['aws cloudwatch list-metrics --namespace AWS/S3 --dimensions Name=BucketName,Value=fa-s3-foundations-<ACCOUNT_ID> --region eu-west-2 --profile fa-s3', 'Discover S3 storage metrics for the bucket.', 'The response includes BucketSizeBytes or NumberOfObjects metric definitions after AWS publishes them.']
    ],
    checks: [
      ['Verify audit scope', 'Inspect the trail event selector.', 'Only object data events for fa-s3-foundations-<ACCOUNT_ID> are selected.', 'either'],
      ['Verify query evidence', 'Inspect the Athena result rows.', 'The event names, acting identity, bucket, and object key are visible.', 'either'],
      ['Distinguish observability tools', 'Explain the purpose of CloudTrail, Athena, and CloudWatch in this lab.', 'CloudTrail records API activity, Athena queries stored records, and CloudWatch exposes operational metrics.', 'either']
    ]
  },
  {
    title: 'Compare integrated S3 architectures',
    phase: 6,
    feature: 'SAA-C03 architecture decisions',
    goal: 'Use the completed build to choose suitable S3 integration patterns for common exam scenarios.',
    why: 'Architecture questions test service selection and trade-offs more often than memorised Console sequences.',
    difficulty: 'Medium',
    sources: ['messaging-decision-guide', 's3-welcome', 'cloudfront-oac', 's3-cloudtrail-data-events'],
    console: [
      ['Review the completed architecture', [
        'Draw or list the direct S3-to-Lambda path used for immediate lightweight processing.',
        'Draw or list the S3-to-SQS-to-Lambda path used for buffering and retry control.',
        'Record SNS as the push fan-out choice for multiple subscribers.',
        'Record EventBridge as the content-based routing choice for AWS service events.',
        'Record CloudFront with OAC as the private global content-delivery choice.',
        'Record versioning and lifecycle as complementary recovery and cost-management features.',
        'Record CloudTrail data events as the object API audit source.',
        'Record CloudWatch as the metrics and alarm service.',
        'Confirm every named lab resource appears in the final cleanup checklist.'
      ], 'The learner can select and justify each integration without confusing event routing, buffering, delivery, metrics, and audit services.']
    ],
    cli: [
      ['aws s3api get-bucket-notification-configuration --bucket fa-s3-foundations-<ACCOUNT_ID> --profile fa-s3', 'Review all configured S3 notification destinations.', 'The response shows the retained Lambda, SQS, SNS, and EventBridge configuration.'],
      ['aws cloudfront get-distribution --id [CLOUDFRONT_DISTRIBUTION_ID] --profile fa-s3', 'Review the private edge-delivery path.', 'The origin is the named S3 bucket and the distribution is enabled.'],
      ['aws cloudtrail get-event-selectors --trail-name fa-s3-audit-trail --region eu-west-2 --profile fa-s3', 'Review the audit boundary.', 'The selector is limited to the named foundations bucket objects.']
    ],
    checks: [
      ['Choose the right event service', 'Match buffering, fan-out, and content routing to SQS, SNS, and EventBridge.', 'Every use case is matched to the correct service with a reason.', 'either'],
      ['Choose the right protection feature', 'Match accidental deletion, cost transition, private delivery, and API audit to their features.', 'The learner selects versioning, lifecycle, CloudFront OAC, and CloudTrail data events.', 'either']
    ]
  },
  {
    title: 'Delete every S3 training resource safely',
    phase: 6,
    feature: 'Reverse-dependency cleanup',
    goal: 'Remove only the resources created by this Follow Along in a dependency-safe order and verify that no chargeable training resources remain.',
    why: 'Complete teardown prevents avoidable charges and reinforces the dependency relationships between integrated AWS services.',
    difficulty: 'Medium',
    sources: ['s3-delete-bucket', 'lambda-s3-trigger', 'cloudfront-oac', 'iam-best-practices'],
    console: [
      ['Follow the final cleanup checklist in exact order', [
        'Open the Cleanup section at the end of this Follow Along.',
        'Confirm every target begins with fa-s3- or matches a recorded placeholder from this lab.',
        'Delete the CloudFront distribution only after disabling it and waiting for deployment.',
        'Remove S3 notification destinations and EventBridge targets before deleting their SNS, SQS, or Lambda destinations.',
        'Empty every current object, noncurrent version, and delete marker before deleting a versioned bucket.',
        'Delete the audit trail before emptying and deleting its log bucket.',
        'Delete IAM access, user, roles, and policies only after dependent workloads are gone.',
        'Verify each deletion before moving to the next cleanup item.',
        'Do not delete unrelated resources even if they appear beside the lab resources.'
      ], 'Every final cleanup item is completed and only the named training resources are absent.', 'Deletion is permanent. Stop if a resource name does not exactly match the lab record.']
    ],
    cli: [
      ['aws sts get-caller-identity --profile fa-s3', 'Confirm the account before cleanup.', 'The account matches the one used for the lab.'],
      ['aws s3api list-object-versions --bucket fa-s3-foundations-<ACCOUNT_ID> --profile fa-s3', 'Inventory versions and delete markers before bucket removal.', 'The response provides the exact items that must be removed.'],
      ['aws cloudfront get-distribution --id [CLOUDFRONT_DISTRIBUTION_ID] --profile fa-s3', 'Record the current distribution state and ETag before disabling it.', 'The response identifies only the lab distribution.'],
      ['aws cloudtrail get-trail-status --name fa-s3-audit-trail --region eu-west-2 --profile fa-s3', 'Confirm the exact audit trail before deleting it.', 'The response identifies fa-s3-audit-trail.'],
      ['aws sqs get-queue-attributes --queue-url [S3_EVENTS_QUEUE_URL] --attribute-names QueueArn,RedrivePolicy --region eu-west-2 --profile fa-s3', 'Confirm the exact source queue and DLQ relationship.', 'The response identifies the source queue and fa-s3-events-dlq target.']
    ],
    checks: [
      ['Verify service cleanup', 'Search S3, Lambda, SQS, SNS, EventBridge, CloudFront, CloudTrail, Athena, CloudWatch Logs, and IAM for the exact fa-s3 names.', 'No lab-exclusive cloud resource remains.', 'either'],
      ['Verify local credential cleanup', 'Inspect local AWS CLI profiles without displaying secrets.', 'The fa-s3 profile is absent and unrelated profiles remain unchanged.', 'cli']
    ]
  }
];

const phases = [
  ['S3 foundations and security', 'Create secure training access, a private encrypted bucket, and harmless objects.'],
  ['Versioning, lifecycle, and recovery', 'Recover overwritten or deleted objects and configure cost-aware lifecycle rules.'],
  ['Event-driven processing', 'Connect S3 to Lambda and add SQS buffering with dead-letter handling.'],
  ['Notifications and event routing', 'Compare direct SNS fan-out with EventBridge content-based routing.'],
  ['Secure content delivery', 'Serve private S3 content through CloudFront Origin Access Control.'],
  ['Monitoring, auditing, architecture, and cleanup', 'Audit object activity, compare the integrated designs, and remove every training resource.']
].map(([title, description], index) => ({ id: `phase-${index + 1}-${slug(title)}`, phaseNumber: index + 1, title, description, taskIds: [], isOptional: false }));

const tasks = taskDefinitions.map((definition, index) => {
  const sequence = String(index + 1).padStart(3, '0');
  const taskId = `task-s3-${slug(definition.title)}-${sequence}`;
  const previousTaskId = index ? `task-s3-${slug(taskDefinitions[index - 1].title)}-${String(index).padStart(3, '0')}` : null;
  const task = {
    id: taskId,
    slug: slug(definition.title),
    title: definition.title,
    service: 'Amazon Simple Storage Service',
    feature: definition.feature,
    goal: definition.goal,
    whyItMatters: definition.why,
    difficulty: definition.difficulty,
    estimatedMinutes: null,
    region: 'eu-west-2',
    status: 'draft',
    phaseId: phases[definition.phase - 1].id,
    prerequisites: previousTaskId ? [previousTaskId] : [],
    isOptional: false,
    sourceIds: definition.sources.map(id => `source-${id}`),
    concepts: [],
    values: [],
    modeAvailability: { console: { status: 'available', reason: '' }, cli: { status: 'available', reason: '' } },
    consoleSteps: definition.console.map((step, stepIndex) => consoleStep(taskId, stepIndex + 1, ...step)),
    cliSteps: definition.cli.map((step, stepIndex) => cliStep(taskId, stepIndex + 1, ...step)),
    createdResourceKeys: [],
    verification: definition.checks.map((check, checkIndex) => verification(taskId, checkIndex + 1, ...check)),
    cleanup: []
  };
  phases[definition.phase - 1].taskIds.push(taskId);
  return task;
});

const sourceDefinitions = [
  ['iam-best-practices', 'Security best practices in IAM', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', 'Supports avoiding root, temporary training credentials, and final identity cleanup.'],
  ['cli-config', 'AWS CLI configuration and credential files', 'https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html', 'Supports the named fa-s3 CLI profile and credential safety.'],
  ['s3-policy-keys', 'Actions, resources, and condition keys for Amazon S3', 'https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazons3.html', 'Supports the named S3 training policy boundary.'],
  ['s3-welcome', 'What is Amazon S3?', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html', 'Supports buckets, object keys, versioning, policies, and architecture comparisons.'],
  ['s3-create-bucket', 'Creating a general purpose bucket', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html', 'Supports creation of the private eu-west-2 training buckets.'],
  ['s3-upload', 'Uploading objects', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html', 'Supports harmless object upload and metadata inspection.'],
  ['s3-block-public', 'Blocking public access to your Amazon S3 storage', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html', 'Supports keeping both training buckets private.'],
  ['s3-encryption', 'Setting default server-side encryption behavior for Amazon S3 buckets', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-encryption.html', 'Supports default SSE-S3 encryption.'],
  ['s3-versioning', 'Retaining multiple versions of objects with S3 Versioning', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html', 'Supports version creation and recovery.'],
  ['s3-delete-markers', 'Managing delete markers', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/ManagingDelMarkers.html', 'Supports restoring a key by removing only its delete marker.'],
  ['s3-lifecycle', 'Setting an S3 Lifecycle configuration on a bucket', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-set-lifecycle-configuration-intro.html', 'Supports transitions, noncurrent expiration, and multipart cleanup.'],
  ['s3-storage-classes', 'Understanding and managing Amazon S3 storage classes', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html', 'Supports the Standard-IA lifecycle decision.'],
  ['lambda-s3-trigger', 'Tutorial: Using an Amazon S3 trigger to invoke a Lambda function', 'https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html', 'Supports Lambda role, function, trigger, logs, and cleanup.'],
  ['s3-events', 'Event notification types and destinations', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html', 'Supports Lambda, SQS, SNS, and EventBridge destination boundaries.'],
  ['s3-notification-walkthrough', 'Walkthrough: Configuring a bucket for notifications', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/ways-to-add-notification-config-to-bucket.html', 'Supports SQS and SNS destination policies and testing.'],
  ['lambda-sqs', 'Using Lambda with Amazon SQS', 'https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html', 'Supports the SQS event source mapping and retry model.'],
  ['s3-eventbridge-events', 'Amazon Simple Storage Service events', 'https://docs.aws.amazon.com/eventbridge/latest/ref/events-ref-s3.html', 'Supports the S3 deletion event pattern.'],
  ['messaging-decision-guide', 'Amazon SQS, Amazon SNS, or EventBridge?', 'https://docs.aws.amazon.com/pdfs/decision-guides/latest/sns-or-sqs-or-eventbridge/sns-or-sqs-or-eventbridge.pdf', 'Supports the architecture comparison between buffering, fan-out, and routing.'],
  ['cloudfront-s3-start', 'Get started with a CloudFront standard distribution', 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html', 'Supports the private S3 distribution workflow.'],
  ['cloudfront-oac', 'Restrict access to an Amazon S3 origin', 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html', 'Supports OAC and the CloudFront-only bucket policy.'],
  ['s3-cloudtrail-data-events', 'Enabling CloudTrail event logging for S3 buckets and objects', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-cloudtrail-logging-for-s3.html', 'Supports object-level S3 data-event auditing.'],
  ['athena-cloudtrail', 'Query AWS CloudTrail logs', 'https://docs.aws.amazon.com/athena/latest/ug/cloudtrail-logs.html', 'Supports Athena table and audit queries.'],
  ['s3-monitoring', 'Monitoring Amazon S3', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/monitoring-overview.html', 'Supports CloudWatch storage metrics and monitoring choices.'],
  ['s3-delete-bucket', 'Deleting a general purpose bucket', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/delete-bucket.html', 'Supports safe emptying and removal of the versioned training buckets.']
];

const sources = sourceDefinitions.map(([key, title, url, purpose]) => {
  const id = `source-${key}`;
  return { id, title, url, publisher: 'AWS', sourceType: 'official_documentation', purpose, taskIds: tasks.filter(task => task.sourceIds.includes(id)).map(task => task.id) };
});

const cleanupTargets = [
  ['Disable and delete CloudFront distribution [CLOUDFRONT_DISTRIBUTION_ID]', 'Disable the recorded distribution, wait until Deployed, delete it with its current ETag, then delete OAC [CLOUDFRONT_OAC_ID].', 'The distribution and fa-s3-oac are absent.'],
  ['Remove EventBridge rule fa-s3-delete-route', 'Remove its SNS target first, then delete only fa-s3-delete-route.', 'The rule is absent.'],
  ['Remove S3 event notifications', 'Replace the foundations bucket notification configuration with an empty configuration before deleting Lambda, SQS, or SNS destinations.', 'The bucket shows no Lambda, SQS, SNS, or EventBridge notifications.'],
  ['Delete Lambda event source mapping [S3_EVENT_MAPPING_UUID]', 'Delete the recorded SQS event source mapping and wait until it is absent.', 'The mapping no longer connects fa-s3-events-queue to Lambda.'],
  ['Delete SQS queues', 'Delete fa-s3-events-queue first, then delete fa-s3-events-dlq.', 'Neither queue appears in eu-west-2.'],
  ['Delete SNS topic fa-s3-events-topic', 'Delete the confirmed email subscription, then delete only fa-s3-events-topic.', 'The topic and lab subscription are absent.'],
  ['Delete Lambda function and execution role', 'Delete fa-s3-object-inspector, delete its /aws/lambda/fa-s3-object-inspector log group, detach role policies, then delete fa-s3-lambda-role.', 'The function, log group, and role are absent.'],
  ['Delete CloudTrail trail fa-s3-audit-trail', 'Stop logging, then delete only fa-s3-audit-trail.', 'The trail is absent.'],
  ['Empty and delete audit bucket', 'Delete every object version and delete marker in fa-s3-audit-<ACCOUNT_ID>, including Athena results, then delete the bucket.', 'The audit bucket is absent.'],
  ['Remove lifecycle and empty the foundations bucket', 'Delete fa-s3-training-lifecycle, then permanently delete every current version, noncurrent version, and delete marker in fa-s3-foundations-<ACCOUNT_ID>.', 'The version inventory is empty.'],
  ['Delete foundations bucket', 'Delete only fa-s3-foundations-<ACCOUNT_ID> after its version inventory is empty.', 'The foundations bucket is absent.'],
  ['Delete training access', 'As the administrator, delete [FA_S3_ACCESS_KEY_ID], detach fa-s3-training-policy, delete fa-s3-user, delete fa-s3-training-policy, and remove only the local fa-s3 CLI profile.', 'The temporary key, user, policy, and profile are absent; unrelated access remains unchanged.']
];

const cleanup = {
  steps: cleanupTargets.map(([title, instruction, verificationText], index) => ({ id: `programme-cleanup-${index + 1}`, stepNumber: index + 1, title, instruction: `Console and CLI: ${instruction}`, description: `Console and CLI: ${instruction}`, verification: verificationText, resourceKeys: [], sourceIds: [] })),
  completionGate: 'acknowledgement',
  manualOnly: true,
  ordering: 'reverse_dependency'
};

const authorDraftContent = {
  schema: { profile: 'canonical-follow-along', version: '1.0.0', authorPackageVersion: '1.0.0', sharedContractHash: null, createdWith: 'codex-local-handoff' },
  programme: {
    serviceSlug: 's3', serviceName: 'Amazon Simple Storage Service', shortName: 'Amazon S3',
    displayName: 'Amazon S3: Secure Storage and Integrated Event Workflows',
    subtitle: 'Build secure object storage, recovery, event processing, private delivery, and audit workflows.',
    description: 'Start with no training infrastructure and build six connected Amazon S3 labs in eu-west-2. Create secure access, private encrypted storage, version recovery and lifecycle rules, Lambda and SQS processing, SNS and EventBridge routing, CloudFront private delivery, CloudTrail and Athena auditing, and a complete dependency-safe teardown.',
    learningOutcome: 'Create, secure, operate, integrate, monitor, audit, and completely remove an Amazon S3 workload using both the AWS Management Console and AWS CLI while explaining the related SAA-C03 architecture choices.',
    programmeId, pathId: programmeId, componentNamespace: '', category: 'Storage', difficulty: 'Beginner to Intermediate', estimatedMinutes: null,
    defaultRegion: 'eu-west-2', regionScope: 'mixed', supportedModes: ['console', 'cli', 'both'], publicationVisibility: 'unpublished'
  },
  sources,
  presentation: { accentColor: '#0ea5e9', iconLabel: 'S3', iconName: 'Database', badgeText: 'S3 integrated labs' },
  storage: {},
  progress: { initialTaskId: tasks[0].id, supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
  capabilities: {},
  phases,
  tasks,
  resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: { region: 'eu-west-2' } },
  warnings: {
    cost: 'S3 requests and storage, CloudFront, Lambda, SQS, SNS delivery, CloudTrail data events, Athena queries, and CloudWatch Logs can incur charges. Use only tiny harmless test files and complete the final cleanup.',
    safety: 'Create and delete only the exact fa-s3- resources and recorded IDs from this Follow Along. Never modify an existing bucket, distribution, trail, queue, topic, function, role, policy, or log group.',
    credentials: 'Never expose passwords, access keys, or secrets in Author, source control, screenshots, commands, or chat. Delete the temporary key and local profile during cleanup.',
    region: 'Use eu-west-2 for regional resources. IAM and CloudFront are global; always verify the AWS account and recorded resource identity.'
  },
  cleanup,
  extensions: { registrations: [] },
  review: {
    validationStatus: 'passed', validationErrors: [], validationWarnings: [], sourceReviewStatus: 'reviewed', learnerPreviewStatus: 'reviewed', approvalDecision: 'pending', reviewStatus: 'ready_for_approval',
    findings: [
      { id: 'finding-1', findingNumber: 1, section: 'instructions', priority: 'advisory', message: 'Before candidate creation, visually confirm current AWS Console labels and replace every <ACCOUNT_ID>, bracketed ID, ARN, URL, email address, and generated bucket name with the learner’s recorded value.', status: 'open' },
      { id: 'finding-2', findingNumber: 2, section: 'warnings', priority: 'advisory', message: 'CloudTrail data events, Athena, CloudFront, storage, requests, logs, and notifications may incur small charges; keep the supplied test scale and reverse-order cleanup prominent.', status: 'open' },
      { id: 'finding-3', findingNumber: 3, section: 'instructions', priority: 'advisory', message: 'The CLI route uses supplied local JSON and code files. Confirm each visible block is saved with the exact filename before its dependent command is run.', status: 'open' }
    ]
  },
  publication: { publishStatus: 'not_published', targetProgrammeId: programmeId, proposedChanges: [] }
};

const planning = validateAuthorPlanning(authorDraftContent);
const content = validateAuthorContent(authorDraftContent);
const review = validateAuthorReview(authorDraftContent);
if (!planning.valid || !content.valid || !review.valid) {
  console.error(JSON.stringify({ planning, content, review }, null, 2));
  throw new Error('The S3 handoff content did not pass Author validation.');
}

const summary = {
  phaseCount: phases.length,
  taskCount: tasks.length,
  checkboxCount: tasks.flatMap(task => task.consoleSteps).flatMap(step => step.instructions).length,
  cliCommandCount: tasks.flatMap(task => task.cliSteps).length,
  verificationCheckCount: tasks.flatMap(task => task.verification).length,
  cleanupItemCount: cleanup.steps.length,
  learnerResourceValueCount: 0,
  officialAwsSourceCount: sources.length
};

const stageRecords = {
  planning: { stage: '1-5', status: 'prepared_and_reviewed', validation: planning, phases: phases.map(phase => ({ id: phase.id, taskIds: phase.taskIds })) },
  instructions: { stage: '6', status: 'prepared_and_reviewed', checkboxCount: summary.checkboxCount, cliCommandCount: summary.cliCommandCount },
  resourcesAndChecks: { stage: '7', status: 'prepared_and_reviewed', verificationCheckCount: summary.verificationCheckCount, learnerResourceValueCount: 0 },
  cleanup: { stage: '8', status: 'prepared_and_reviewed', cleanupItemCount: summary.cleanupItemCount, ordering: 'reverse_dependency' },
  authoringCheck: { stage: '9', status: 'passed', planningValid: planning.valid, contentValid: content.valid, reviewValid: review.valid },
  learnerPreview: { stage: '10', status: 'reviewed', programmeId, summary },
  structuredReview: { stage: '11', status: 'ready_for_approval', findings: authorDraftContent.review.findings }
};

const acceptedRecordManifest = Object.fromEntries(Object.entries(stageRecords).map(([key, value]) => [key, { algorithm: 'sha256-json-v1', value: fingerprint(value) }]));
const acceptedFingerprintChain = {
  stage6: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.instructions) },
  stage7: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.resourcesAndChecks) },
  stage8: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.cleanup) },
  stage9: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.authoringCheck) },
  stage10: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.learnerPreview) },
  stage11: { algorithm: 'sha256-json-v1', value: fingerprint(stageRecords.structuredReview) }
};

const handoffPackage = {
  schemaVersion: 1,
  kind: 'author_local_handoff_package',
  status: 'awaiting_human_handoff_review',
  sessionId,
  preparedAt,
  generationMode: 'new',
  service: { officialName: 'Amazon Simple Storage Service', shortName: 'Amazon S3' },
  acceptedFingerprintChain,
  acceptedRecordManifest,
  authorDraftContent,
  identityBinding: { status: 'required_before_author_write', assignedAuthorId: null, assignedDraftId: null, assignedRevision: null, rule: 'A later separately approved write step must bind the currently signed-in Author and create a new draft identity.' },
  summary,
  handoffBoundary: { localPackageOnly: true, stage12Started: false, authorDraftWritten: false, authorIdentityBound: false, connectedToAuthor: false, connectedToSupabase: false, connectedToAws: false, releaseCandidatePrepared: false, candidateIdGenerated: false, approvalPerformed: false, published: false },
  acceptedStagesOneToElevenChanged: false
};
const fingerprintContent = structuredClone(handoffPackage);
delete fingerprintContent.status;
delete fingerprintContent.preparedAt;
handoffPackage.handoffFingerprint = { algorithm: 'sha256-json-v1', value: fingerprint(fingerprintContent) };

const preview = [
  'AUTHOR LOCAL HANDOFF PACKAGE - AMAZON S3', '',
  `Programme: ${authorDraftContent.programme.displayName}`,
  `Phases: ${summary.phaseCount}`,
  `Tasks: ${summary.taskCount}`,
  `Separate editable checkboxes: ${summary.checkboxCount}`,
  `CLI commands: ${summary.cliCommandCount}`,
  `Verification checks: ${summary.verificationCheckCount}`,
  `Cleanup items: ${summary.cleanupItemCount}`,
  `Official AWS sources: ${summary.officialAwsSourceCount}`,
  `SHA-256 handoff fingerprint: ${handoffPackage.handoffFingerprint.value}`, '',
  'LABS',
  ...phases.map(phase => `${phase.phaseNumber}. ${phase.title}`), '',
  'VALIDATION',
  `Planning: ${planning.valid ? 'passed' : 'failed'}`,
  `Content: ${content.valid ? 'passed' : 'failed'}`,
  `Structured review: ${review.valid ? 'passed' : 'failed'}`, '',
  'BOUNDARIES',
  'Nothing was written to Author, Supabase or AWS.',
  'No Author identity is bound.',
  'No release candidate was created.',
  'Nothing was approved or published.',
  'The handoff package is waiting for human review.', ''
].join('\n');

const session = {
  schemaVersion: 1, sessionId, status: 'handoff_awaiting_human_review', createdAt: preparedAt,
  inputs: { serviceName: 'Amazon Simple Storage Service', shortName: 'Amazon S3', level: 'Beginner to Intermediate', goal: authorDraftContent.programme.learningOutcome, region: 'eu-west-2' },
  boundaries: { authorDraftWritten: false, awsConnected: false, supabaseConnected: false, candidatePrepared: false, published: false }
};

await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, 'author-local-handoff-package.json'), `${JSON.stringify(handoffPackage, null, 2)}\n`, 'utf8');
await fs.writeFile(path.join(directory, 'complete-follow-along-preview.txt'), preview, 'utf8');
await fs.writeFile(path.join(directory, 'session.json'), `${JSON.stringify(session, null, 2)}\n`, 'utf8');

console.log(preview);
