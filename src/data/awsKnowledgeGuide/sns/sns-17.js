import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "sns-17",
  "topicId": "topic-sns",
  "topicTitle": "Amazon SNS",
  "objectiveCode": "Integration",
  "title": "SNS Topic Access Policies",
  "status": "ready",
  "plainEnglish": "An SNS topic access policy is a resource-based JSON policy attached to one topic. It states which principal, such as an AWS account, role, or AWS service, may perform specified SNS actions on that topic and under which conditions. This complements identity-based IAM policies attached to users and roles.",
  "whyItMatters": "A topic is a shared entry point into every downstream subscription. Least-privilege topic policies prevent an unapproved account or service from publishing false events, creating unwanted subscriptions, or administering the topic.",
  "workplaceExample": "A data-ingestion topic accepts Publish only from an approved storage service event source. Its policy names the service principal, sns:Publish action, exact topic ARN, source account, and source resource ARN. A separate deployment role can change topic attributes, while application roles cannot administer the topic.",
  "examFocus": "Distinguish identity-based policies from an SNS topic's resource-based policy. Resource policies contain a Principal and enable cross-account or AWS-service access. Evaluate explicit denies and all applicable policy types, and use aws:SourceArn or aws:SourceAccount when the publishing service supplies those keys to reduce confused-deputy risk.",
  "keyPoints": [
    "A resource policy is attached to the SNS topic and must identify allowed or denied principals, actions, resources, and optional conditions.",
    "Use the exact topic ARN and only necessary actions, such as sns:Publish, instead of broad wildcards.",
    "Identity-based IAM policies control what a role or user may call; topic policies control who may access that particular topic.",
    "A topic resource policy can grant access to a principal in another AWS account.",
    "For an AWS service principal, apply supported source conditions such as aws:SourceArn and aws:SourceAccount to bind requests to the expected resource or account.",
    "An explicit Deny overrides an Allow when AWS evaluates applicable policies.",
    "Subscription controls can restrict values such as the requested protocol or endpoint, but should be tested against the intended workflow.",
    "Review policy changes with access analysis, audit them through CloudTrail, and test both allowed and denied requests."
  ],
  "commonMistake": "Do not solve a permission error by granting Principal '*' and sns:* on the topic. Identify the exact caller, action, resource, and supported source conditions, then make the smallest policy change that authorizes the required path.",
  "example": "Create a test topic policy that permits one test role to call sns:Publish on only that topic. Confirm the role can publish, confirm a second role cannot, and confirm neither role can delete the topic. Review the CloudTrail events and policy, then remove the test access through the approved process.",
  "sources": [
    {
      "title": "Identity and access management in Amazon SNS",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/security-iam.html"
    },
    {
      "title": "Using identity-based policies with Amazon SNS",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-using-identity-based-policies.html"
    },
    {
      "title": "Example cases for Amazon SNS access control",
      "url": "https://docs.aws.amazon.com/sns/latest/dg/sns-access-policy-use-cases.html"
    }
  ]
});
