import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'eventbridge-19',
  topicId: 'topic-eventbridge',
  topicTitle: 'Amazon EventBridge',
  objectiveCode: 'Integration',
  title: 'EventBridge Pipes',
  status: 'ready',
  plainEnglish: 'Amazon EventBridge Pipes provides a point-to-point integration feature that connects an event source (such as Amazon SQS, DynamoDB Streams, Kinesis Data Streams, Amazon MSK/Kafka, or Amazon MQ) directly to an AWS target (such as Step Functions, Lambda, SQS, SNS, or EventBridge Event Bus) with optional built-in filtering and transformation step.',
  whyItMatters: 'Before EventBridge Pipes, connecting SQS or DynamoDB Streams to a target required writing glue-code Lambda functions to poll streams, parse records, transform data, and forward events. EventBridge Pipes handles polling, filtering, transforming, and delivering serverlessly with ZERO code.',
  workplaceExample: 'An application tracks database changes via DynamoDB Streams. An EventBridge Pipe reads the stream, filters out non-DELETE events, enriches the JSON payload using an API Destination, and forwards the result directly to an SQS queue.',
  examFocus: 'SAA-C03 EventBridge Pipes 4 Components:\n1. Source: SQS, DynamoDB Streams, Kinesis, MSK/Kafka, Amazon MQ.\n2. Filter (Optional): Filters incoming source events before enrichment.\n3. Enrichment (Optional): Calls Lambda, API Gateway, API Destinations, or Step Functions to enhance event data.\n4. Target: 20+ AWS service targets.',
  keyPoints: [
    'Point-to-point integration connecting streaming/queue sources to AWS targets.',
    'Eliminates custom glue code for polling SQS, Kinesis, and DynamoDB Streams.',
    '4 Component Pipeline: Source -> Filter -> Enrichment -> Target.',
    'Supports inline JSON filtering and payload transformation.',
    'Reduces operational overhead and infrastructure costs for event pipelines.'
  ],
  commonMistake: 'Writing custom Lambda functions to poll Kinesis Data Streams and write to SQS when EventBridge Pipes connects Kinesis directly to SQS serverlessly with zero code.',
  example: 'EventBridge Pipe Architecture:\nDynamoDB Stream (Source) -> Filter (`eventname: INSERT`) -> Lambda (Enrichment) -> Step Functions (Target).',
  sources: [
    { title: 'Amazon EventBridge Pipes', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes.html' }
  ]
});
