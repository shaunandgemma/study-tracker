import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-18",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "Cross-Account Publishing and Subscriptions",
  "status": "ready",
  "plainEnglish": "Cross-account SNS integration connects a publisher or subscriber in one AWS account to a topic owned by another. The topic owner must deliberately grant the required topic action, and the caller's own account must authorize its identity. For an SQS subscription, the queue must also allow the source SNS topic to send messages.",
  "whyItMatters": "Organizations often separate producers, central event routing, and consumers into different accounts. Cross-account policies keep that separation without sharing credentials, but ownership, confirmation, encryption, and destination permissions must all line up for the path to work securely.",
  "workplaceExample": "A central platform account owns an audit topic. One workload account is allowed to publish through a named role, and another account owns an SQS queue subscribed to it. The topic policy grants only the required cross-account actions, the queue policy accepts only the central topic ARN, and both teams monitor their side of delivery.",
  "examFocus": "For cross-account Publish, expect authorization on both sides: the topic resource policy trusts the external account or principal, and the publishing identity is allowed to call sns:Publish. For cross-account SQS subscriptions, the queue policy needs SQS:SendMessage from the topic and confirmation behavior depends on which account creates the subscription; the queue owner initiating it is the preferred automatic-confirmation flow.",
  "keyPoints": [
    "A topic resource policy can grant a different AWS account or specific external principal permission to publish or subscribe.",
    "The external publishing identity also needs an identity-based permission for sns:Publish on the exact topic ARN.",
    "Do not exchange long-term access keys between accounts; use IAM roles, resource policies, and temporary credentials.",
    "For an SQS endpoint, its queue policy must allow sns.amazonaws.com to call SQS:SendMessage and should restrict aws:SourceArn to the intended topic.",
    "When the cross-account queue owner creates the subscription, confirmation is automatic and the queue owner controls the subscription.",
    "If someone other than the queue owner creates the subscription, an authorized queue user must retrieve the confirmation message and the subscription owner must confirm it before delivery begins.",
    "Encrypted topics or queues also require compatible KMS key policies for every service and principal in the delivery path.",
    "Record resource ownership, Region, account boundaries, subscription status, and monitoring responsibility in the operational design."
  ],
  "commonMistake": "Do not update only the topic policy and assume the whole route is authorized. Check the caller's identity permission, topic policy, subscription confirmation and ownership, destination resource policy, and any KMS key policies as separate controls.",
  "example": "Using non-production accounts, allow one test role to publish to one test topic. Subscribe a test SQS queue from the queue-owner account, give only that topic permission to send to the queue, publish a synthetic event, verify delivery and ownership, test that an unrelated role and topic are denied, and remove every test grant through the approved process.",
  "sources": [
    {
      "title": "Using identity-based policies with Amazon SNS",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-using-identity-based-policies.html"
    },
    {
      "title": "Giving users permission to publish to an Amazon SNS topic",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/SendMessageToHttp.iam.permissions.html"
    },
    {
      "title": "Sending Amazon SNS messages to an Amazon SQS queue in a different account",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-send-message-to-sqs-cross-account.html"
    }
  ]
});
