export default Object.freeze({
  id: 'aws-cloudfront-s3-access-denied',
  examId: 'aws-saa-c03',
  order: 4,
  category: 'Amazon CloudFront and S3',
  title: 'Repair a CloudFront S3 AccessDenied error',
  difficulty: 'Intermediate',
  summary: 'Diagnose an incorrect Origin Access Control bucket policy causing HTTP 403 responses.',
  scenario: 'A private S3 bucket is used as the origin for a CloudFront distribution. The site previously worked, but requests for known objects now return HTTP 403 through CloudFront after the distribution was replaced. The bucket must remain private and direct public S3 access must stay blocked.',
  task: 'Use the supplied CloudFront and S3 evidence to identify why the origin request is denied, make the smallest safe bucket-policy correction, and verify that CloudFront can read the object without making the bucket public.',
  evidence: [
    {
      id: 'viewer-response',
      title: 'CloudFront viewer response',
      kind: 'code',
      content: `$ curl -i https://d3trainingexample.cloudfront.net/index.html
HTTP/2 403
content-type: application/xml
x-cache: Error from cloudfront
via: 1.1 training.cloudfront.net (CloudFront)

<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
</Error>`
    },
    {
      id: 'origin-config',
      title: 'CloudFront origin and OAC configuration',
      kind: 'code',
      content: `Distribution ID: E3CFTRAINING42
Distribution domain: d3trainingexample.cloudfront.net
Origin domain: fa-training-static.s3.eu-west-2.amazonaws.com
Origin type: Amazon S3
Origin access control ID: E2OACTRAINING42
Signing behavior: Sign requests (always)
Signing protocol: SigV4`
    },
    {
      id: 'bucket-policy',
      title: 'Current S3 bucket policy',
      kind: 'code',
      content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontRead",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::fa-training-static/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/E3CFTRAINING24"
        }
      }
    }
  ]
}`
    },
    {
      id: 'security-boundary',
      title: 'Approved security boundary',
      kind: 'text',
      content: 'Keep S3 Block Public Access enabled. Do not add public bucket access, ACL grants, AdministratorAccess, or a wildcard CloudFront distribution condition. Only distribution E3CFTRAINING42 should be able to read objects from fa-training-static through OAC.'
    }
  ],
  successCriteria: [
    'The learner identifies the mismatched CloudFront distribution ARN in the bucket-policy condition.',
    'The bucket policy allows s3:GetObject only for the CloudFront service principal and distribution E3CFTRAINING42.',
    'S3 Block Public Access remains enabled and direct public S3 access remains denied.',
    'A request for index.html through d3trainingexample.cloudfront.net returns the object successfully instead of HTTP 403.'
  ],
  hints: [
    'Compare the active CloudFront distribution ID with every distribution identifier shown in the S3 bucket policy.',
    'With OAC, S3 can limit the CloudFront service principal by checking which distribution ARN the signed request came from.',
    'Change only AWS:SourceArn so it ends with distribution/E3CFTRAINING42, then verify the object through CloudFront while keeping the bucket private.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'What is the root cause of the HTTP 403 response?',
      options: [
        { id: 'wrong-source-arn', text: 'The bucket policy allows a different CloudFront distribution ARN than the active distribution.' },
        { id: 'missing-public-access', text: 'The S3 bucket has Block Public Access enabled.' },
        { id: 'wrong-signing-protocol', text: 'CloudFront uses SigV4 to sign the S3 origin request.' },
        { id: 'missing-list-bucket', text: 'The policy does not grant s3:ListBucket on the bucket ARN.' }
      ],
      correctOptionId: 'wrong-source-arn',
      explanation: 'The active distribution is E3CFTRAINING42, but the policy condition permits E3CFTRAINING24, so the signed CloudFront request does not satisfy the allow statement.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'correct-source-arn', text: 'Change AWS:SourceArn to arn:aws:cloudfront::123456789012:distribution/E3CFTRAINING42 and keep the existing private-access controls.' },
        { id: 'public-read', text: 'Add public s3:GetObject access for Principal *.' },
        { id: 'wildcard-distributions', text: 'Allow every CloudFront distribution by replacing the distribution ID with a wildcard.' },
        { id: 'disable-block-public-access', text: 'Disable S3 Block Public Access so CloudFront can fetch the object anonymously.' }
      ],
      correctOptionId: 'correct-source-arn',
      explanation: 'Matching the condition to the active distribution restores OAC access while keeping the bucket private and limited to the intended CloudFront distribution.'
    }
  ],
  solution: {
    rootCause: 'The S3 bucket policy restricted the CloudFront service principal to distribution E3CFTRAINING24, but the active OAC request came from distribution E3CFTRAINING42, so the SourceArn condition failed and S3 returned AccessDenied.',
    fix: 'Change AWS:SourceArn to arn:aws:cloudfront::123456789012:distribution/E3CFTRAINING42, keep s3:GetObject scoped to arn:aws:s3:::fa-training-static/*, leave Block Public Access enabled, and verify that index.html succeeds through CloudFront while direct public S3 access remains denied.',
    prevention: 'Generate or review the OAC bucket-policy statement whenever a CloudFront distribution is replaced, and validate that the policy SourceArn exactly matches the deployed distribution before release.'
  }
});
