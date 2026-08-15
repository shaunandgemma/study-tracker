import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-elb",
  "topicTitle": "Elastic Load Balancing (ELB)",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "elb-17",
  "title": "ALB Lambda Targets",
  "plainEnglish": "An ALB can invoke an AWS Lambda function through a target group whose target type is Lambda. The ALB converts the HTTP request into a JSON event and converts the function's structured response back into an HTTP response.",
  "whyItMatters": "This gives serverless functions an ALB endpoint and lets them share host- or path-based routing with instance and container services.",
  "workplaceExample": "A company routes /webhook through an ALB listener rule to a Lambda function while the rest of the site goes to an EC2 target group. The function validates the event and returns the required ALB response fields.",
  "examFocus": "Know that ALB, not NLB, supports Lambda targets. The function and target group must be in the same account and Region, the function policy must allow Elastic Load Balancing to invoke it, and only one Lambda function is registered per target group.",
  "keyPoints": [
    "The ALB invokes Lambda directly rather than opening a network connection to it.",
    "The request is delivered as JSON and the function must return the documented response shape.",
    "One Lambda function can be registered in each Lambda target group.",
    "The function and target group must be in the same AWS account and Region.",
    "Elastic Load Balancing needs permission in the Lambda function's resource policy.",
    "Health checks are disabled by default for Lambda target groups and can be enabled when appropriate."
  ],
  "commonMistake": "Returning an ordinary application object instead of the ALB Lambda response format causes load-balancer errors. Validate statusCode, headers, body, and base64 encoding behavior.",
  "example": "Create a Lambda target group, grant elasticloadbalancing.amazonaws.com permission scoped to its ARN, register a function alias, and add an ALB path rule that forwards /webhook to it.",
  "sources": [
    {
      "title": "Use Lambda functions as Application Load Balancer targets",
      "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/lambda-functions.html"
    }
  ]
});
