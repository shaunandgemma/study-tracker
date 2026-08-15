import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sns-5",
  "title": "SNS Topics",
  "plainEnglish": "An SNS topic is a logical access point and communication channel. Publishers address the topic's Amazon Resource Name (ARN), and subscriptions describe where matching messages should go. When creating a topic, its owner chooses Standard or first-in, first-out (FIFO); the topic's type and name cannot be changed afterward.",
  "whyItMatters": "The topic is the governance and routing boundary for a stream of related notifications. Its type, access policy, encryption choice, subscriptions, tags, logging, and ownership determine which producers can publish and how recipients receive messages.",
  "workplaceExample": "A platform team creates separate topics for approved production billing events and operational alerts. It assigns owners and tags, limits each topic policy to known publishers, chooses the topic type from delivery needs, encrypts sensitive event bodies where required, and reviews unused subscriptions.",
  "examFocus": "A topic groups subscribers but does not store work like an SQS queue for consumers to poll. Choose the topic type at creation: Standard supports all SNS delivery protocols, while FIFO subscription support and behavior must be checked against current documentation.",
  "keyPoints": [
    "A topic ARN identifies the publish destination and includes its AWS account and Region.",
    "The topic owner controls topic attributes and the resource-based access policy.",
    "Standard and FIFO are distinct topic types selected during creation.",
    "A FIFO topic name uses the documented .fifo suffix.",
    "Subscriptions are separate resources that attach endpoints and optional filtering or redrive behavior.",
    "Server-side encryption protects supported topic message bodies at rest but not all metadata or downstream storage."
  ],
  "commonMistake": "Making a topic policy public to fix one publisher's AccessDenied error exposes a much larger publish surface. Keep the topic private, identify the caller, grant only sns:Publish to the intended ARN, and use source conditions for AWS service publishers.",
  "example": "Define a harmless event category, choose Standard only if its delivery characteristics and endpoint protocols fit, create a clearly named test topic, attach a least-privilege policy, add one test subscription, publish a non-sensitive message, inspect delivery, and document an owner before cleanup.",
  "sources": [
    {
      "title": "Creating an Amazon SNS topic",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-create-topic.html"
    },
    {
      "title": "Amazon SNS event destinations",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-event-destinations.html"
    }
  ]
});
