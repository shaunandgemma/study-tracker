export default Object.freeze({
  id: 'aws-kms-encrypted-s3-access',
  examId: 'aws-saa-c03',
  order: 21,
  category: 'Amazon S3 and AWS KMS',
  title: 'Repair KMS-Encrypted S3 Access',
  difficulty: 'Intermediate',
  summary: 'Separate S3 object permissions from KMS key permissions to diagnose an encrypted-object access failure.',
  scenario: 'The fa-training-report-reader EC2 role can list an S3 bucket and download an unencrypted test object, but downloading report.csv fails after the report was changed to SSE-KMS encryption with a customer managed KMS key. The role must retain read-only S3 access and must not receive broad KMS administration permissions.',
  task: 'Use the supplied S3, IAM, and KMS policy evidence to identify which authorization layer blocks the encrypted object, make the minimum key-access correction, and verify that the role can download the object without gaining write or key-administration access.',
  evidence: [
    {
      id: 'access-tests',
      title: 'S3 Access Tests',
      kind: 'code',
      content: `Caller:
arn:aws:sts::123456789012:assumed-role/fa-training-report-reader/i-0training123

Bucket:
fa-training-reports

$ aws s3api head-object --bucket fa-training-reports --key readme.txt
HTTPStatusCode: 200
ServerSideEncryption: AES256

$ aws s3api head-object --bucket fa-training-reports --key report.csv
HTTPStatusCode: 200
ServerSideEncryption: aws:kms
SSEKMSKeyId: arn:aws:kms:eu-west-2:123456789012:key/11111111-2222-3333-4444-555555555555

$ aws s3 cp s3://fa-training-reports/report.csv -
fatal error: An error occurred (AccessDenied) when calling the GetObject operation`
    },
    {
      id: 'reader-iam-policy',
      title: 'Reader Role IAM Policy',
      kind: 'code',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::fa-training-reports",
        "arn:aws:s3:::fa-training-reports/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "kms:Decrypt",
      "Resource": "arn:aws:kms:eu-west-2:123456789012:key/11111111-2222-3333-4444-555555555555"
    }
  ]
}`
    },
    {
      id: 'kms-key-policy',
      title: 'Customer Managed KMS Key Policy',
      kind: 'code',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "KeyAdministratorsOnly",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/fa-training-kms-admin"
      },
      "Action": "kms:*",
      "Resource": "*"
    }
  ]
}

CloudTrail event for failed download:
eventSource: kms.amazonaws.com
eventName: Decrypt
errorCode: AccessDenied
principal: arn:aws:sts::123456789012:assumed-role/fa-training-report-reader/i-0training123`
    }
  ],
  successCriteria: [
    'The learner identifies KMS decrypt authorization, rather than S3 GetObject permission, as the failing layer.',
    'The KMS key policy authorizes fa-training-report-reader to use kms:Decrypt on the specific customer managed key.',
    'The role remains read-only for S3 and receives no kms:* or key-administration permissions.',
    'A final download of report.csv succeeds while the existing unencrypted object access still works.'
  ],
  hints: [
    'The role can read an unencrypted object and HeadObject succeeds for report.csv, so look at what extra service is required to return SSE-KMS plaintext.',
    'Reading an S3 object encrypted with a customer managed KMS key requires permission to decrypt with that KMS key as well as S3 object permission.',
    'The IAM role already requests kms:Decrypt, but the supplied key policy authorizes only the KMS administrator; add a narrowly scoped key-policy statement for fa-training-report-reader.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is the root cause of the failed report.csv download?',
      options: [
        { id: 'key-policy-deny', text: 'The KMS key policy does not authorize fa-training-report-reader to use the customer managed key for Decrypt.' },
        { id: 'missing-s3-get', text: 'The role lacks s3:GetObject permission for the reports bucket.' },
        { id: 'bucket-private', text: 'The S3 bucket is private and therefore cannot contain KMS-encrypted objects.' },
        { id: 'needs-kms-admin', text: 'The role must have kms:* permissions before it can read any encrypted S3 object.' }
      ],
      correctOptionId: 'key-policy-deny',
      explanation: 'The role already has S3 read access and an IAM kms:Decrypt statement, but CloudTrail records a KMS Decrypt AccessDenied and the key policy grants use only to the administrator role.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'allow-role-decrypt', text: 'Add a KMS key-policy statement allowing fa-training-report-reader to perform kms:Decrypt on this key while keeping its existing read-only S3 permissions.' },
        { id: 'kms-star', text: 'Grant fa-training-report-reader kms:* on all KMS keys.' },
        { id: 'public-bucket', text: 'Make the S3 bucket public so KMS permissions are no longer required.' },
        { id: 'remove-encryption', text: 'Remove SSE-KMS encryption from report.csv instead of correcting authorization.' }
      ],
      correctOptionId: 'allow-role-decrypt',
      explanation: 'A key-policy grant for only kms:Decrypt to the intended reader role provides the missing authorization without adding S3 write access or KMS administration rights.'
    }
  ],
  solution: {
    rootCause: 'The reader role has S3 read permissions and an IAM kms:Decrypt permission, but the customer managed KMS key policy does not authorize that role or otherwise enable its IAM permission to use the key, so the Decrypt request is denied.',
    fix: 'Add a KMS key-policy statement that allows arn:aws:iam::123456789012:role/fa-training-report-reader to perform kms:Decrypt on the specific key, keep the existing read-only S3 policy, and verify that report.csv downloads successfully.',
    prevention: 'When adopting SSE-KMS for S3 objects, review both S3 access and KMS key authorization for every required reader and test encrypted-object reads before the encryption change is considered complete.'
  }
});
