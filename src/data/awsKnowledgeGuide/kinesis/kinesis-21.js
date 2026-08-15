import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-kinesis",
  "topicTitle": "Amazon Kinesis",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "kinesis-21",
  "title": "Data Firehose Data Transformation with Lambda",
  "plainEnglish": "Amazon Data Firehose allows you to invoke an AWS Lambda function to transform, enrich, filter, or clean incoming streaming data before delivering it to target destinations. Firehose buffers incoming records, batches them into a single Lambda invocation, receives the transformed output, and delivers successful records to the final destination while routing failed records to an Amazon S3 error backup bucket.",
  "whyItMatters": "Raw streaming data often contains unneeded fields, unmasked sensitive data (such as credit card numbers or Personally Identifiable Information), or invalid formatting. Inline Lambda transformation enables serverless data cleansing, schema enrichment, and record filtering directly inside the delivery stream without managing intermediate compute servers.",
  "workplaceExample": "A healthcare provider streams patient mobile application metrics to Amazon S3 via Firehose. Before records are saved, an inline AWS Lambda transformation function parses the JSON payload, redacts Patient Health Information (PHI) fields, computes a SHA-256 hash of the patient ID, and marks invalid payloads as 'ProcessingFailed' so they are routed to an S3 error prefix for inspection.",
  "examFocus": "Understand the contract between Firehose and Lambda: (1) Firehose buffers records and passes a JSON payload containing an array of records with `recordId` and base64-encoded `data`. (2) The Lambda function must return the exact same number of records, each containing `recordId`, base64-encoded transformed `data`, and a `result` status of 'Ok' (deliver), 'Dropped' (discard), or 'ProcessingFailed' (send to S3 error bucket).",
  "keyPoints": [
    "Enables serverless inline data transformation, filtering, and data masking using AWS Lambda before delivery.",
    "Firehose batches incoming records and invokes the configured Lambda function synchronously with up to 3 MB payload per call.",
    "Lambda must return each record with a result status: 'Ok' (deliver to destination), 'Dropped' (filtered out), or 'ProcessingFailed' (error).",
    "Transformed record payloads returned to Firehose must be base64-encoded strings.",
    "Records with 'ProcessingFailed' are automatically written to a dedicated S3 error prefix without stalling the stream.",
    "Supports configurable Lambda invocation buffer size (up to 3 MB) and buffer interval (up to 900 seconds)."
  ],
  "commonMistake": "Failing to return the exact list of recordIds in the Lambda response. If the Lambda function drops a recordId from its return array rather than setting its result status to 'Dropped', Firehose treats the batch as a transformation failure and retries up to the configured retry duration.",
  "example": "Structure the Python Lambda response for Firehose: return {'records': [{'recordId': record['recordId'], 'result': 'Ok', 'data': base64.b64encode(transformed_bytes).decode('utf-8')}]}.",
  "sources": [
    {
      "title": "Amazon Data Firehose Data Transformation",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html"
    },
    {
      "title": "Transforming Data in Amazon Data Firehose with AWS Lambda",
      "url": "https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html#data-transformation-lambda"
    }
  ]
});
