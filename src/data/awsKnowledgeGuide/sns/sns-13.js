import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-13",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "Message Filtering Policies",
  "status": "ready",
  "plainEnglish": "An Amazon SNS subscription filter policy is a JSON rule attached to one subscription. SNS compares each publication with that rule and delivers the message to that subscriber only when it matches. The filter can inspect message attributes, which is the default scope, or a JSON message body when FilterPolicyScope is set to MessageBody.",
  "whyItMatters": "Filtering lets several consumers share a topic without each receiving and discarding every event. This reduces unnecessary invocations, queue traffic, notifications, and consumer-side filtering code while keeping routing rules specific to each subscriber.",
  "workplaceExample": "A shared order topic has separate subscriptions for fulfilment and fraud review. Fulfilment matches an order-state attribute, while fraud review uses a MessageBody policy to match nested risk data. The team tests matching, nonmatching, missing-field, and case-difference examples before releasing each policy.",
  "examFocus": "Remember that filtering is configured per subscription. MessageAttributes is the default scope and MessageBody enables payload-based filtering of a well-formed JSON object. A message must satisfy the policy's conditions to reach that subscriber, and filter changes are eventually consistent rather than instantly active everywhere.",
  "keyPoints": [
    "A subscription without a filter policy receives every message published to its topic.",
    "Attribute-based filtering is the default and compares policy keys with supported SNS message attributes.",
    "Payload-based filtering requires FilterPolicyScope set to MessageBody and a well-formed JSON object as the message body.",
    "String matching is case-sensitive, so producers and consumers need a documented event vocabulary.",
    "A required policy key that is missing or does not match causes that subscription to reject the message.",
    "Filter policies support operators such as exact string matching, numeric comparisons, prefixes, and anything-but conditions, subject to documented constraints.",
    "Filter-policy additions and changes can take up to 15 minutes to fully take effect.",
    "Filtering controls routing, not authorization; IAM and topic policies still control who may publish or administer resources."
  ],
  "commonMistake": "Do not put a field in the message body while leaving the subscription on the default MessageAttributes scope and expect it to match. Choose the scope deliberately and test the actual published representation, data type, spelling, and case.",
  "example": "Define a test event attribute and the subscriber's requirement, select MessageAttributes scope, and add a narrow filter such as {\"eventType\":[\"order-created\"]}. Publish a matching message, a different value, and a message with the attribute missing; confirm only the first arrives and inspect filtered and delivered metrics. Allow for eventual consistency after changes, and verify IAM still denies an unauthorized publisher because filtering is not authorization.",
  "sources": [
    {
      "title": "Amazon SNS message filtering",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html"
    },
    {
      "title": "Applying a subscription filter policy in Amazon SNS",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/message-filtering-apply.html"
    },
    {
      "title": "Filter policy constraints in Amazon SNS",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/subscription-filter-policy-constraints.html"
    }
  ]
});
