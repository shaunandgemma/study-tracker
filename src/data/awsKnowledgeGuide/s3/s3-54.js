import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-54",
  "title": "S3 Requester Pays",
  "plainEnglish": "Amazon S3 Requester Pays is a bucket billing configuration where the requester (the AWS account downloading or querying the data) pays for the network data transfer-out costs and API request fees, while the bucket owner continues to pay only for the storage of the data. To download objects from a Requester Pays bucket, the requester must authenticate with their own AWS IAM credentials and explicitly include a special header (`x-amz-request-payer: requester`) acknowledging payment.",
  "whyItMatters": "Universities, scientific organizations, and government agencies that host petabyte-scale public open-data repositories (such as satellite imagery, climate datasets, or human genome maps) would face astronomical data transfer bills if they paid for millions of external downloads. S3 Requester Pays allows institutions to share massive datasets openly without incurring unbounded bandwidth costs.",
  "workplaceExample": "A geospatial research institute hosts 500 terabytes of global satellite imagery in an S3 bucket (`open-satellite-imagery`). They enable Requester Pays on the bucket. Commercial analytics companies and university researchers access the imagery by signing requests with their own AWS accounts and adding the `--request-payer requester` flag. The research institute only pays for monthly S3 storage, while downloaders cover their own network transfer fees.",
  "examFocus": "Understand Requester Pays rules and constraints: (1) Cost Allocation: Bucket Owner pays for storage; Requester pays for API requests and Data Transfer Out. (2) Authentication: Anonymous requests are REJECTED (requesters must authenticate with valid AWS credentials). (3) Mandatory Header: Requests must include `x-amz-request-payer: requester` (or `--request-payer requester` in AWS CLI); omitting the header returns HTTP `403 Forbidden` (Access Denied). (4) Unsupported: Cannot be used with BitTorrent, CloudFront distributions, or static website endpoints.",
  "keyPoints": [
    "Transfers the cost of API requests and data transfer-out from bucket owner to the requester.",
    "Bucket owner pays only for the ongoing storage of the objects.",
    "Requesters must authenticate with valid AWS credentials; anonymous access is strictly blocked.",
    "Requests must explicitly supply the `x-amz-request-payer: requester` header.",
    "Omitting the request-payer header results in an HTTP 403 Access Denied error.",
    "Ideal for sharing large public research datasets, scientific telemetry, and open-source data archives."
  ],
  "commonMistake": "Attempting to download from a Requester Pays bucket without passing the `--request-payer requester` flag in the AWS CLI or SDK. Even if your IAM identity has full read permissions on the bucket, S3 will reject the download with 403 Access Denied unless you acknowledge payment.",
  "example": "Download a file from a Requester Pays bucket using the AWS CLI: aws s3 cp s3://public-genomics-data/sample101.bam ./local/ --request-payer requester.",
  "sources": [
    {
      "title": "Using Requester Pays Buckets in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/RequesterPaysBuckets.html"
    },
    {
      "title": "Retrieving Objects in Requester Pays Buckets",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/ObjectsinRequesterPaysBuckets.html"
    }
  ]
});
