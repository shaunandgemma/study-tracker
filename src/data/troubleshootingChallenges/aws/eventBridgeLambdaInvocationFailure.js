export default Object.freeze({
  id: 'aws-eventbridge-lambda-invocation-failure',
  examId: 'aws-saa-c03',
  order: 16,
  category: 'Amazon EventBridge',
  title: 'Repair an EventBridge-to-Lambda Invocation Failure',
  difficulty: 'Intermediate',
  summary: 'Diagnose why a matching EventBridge rule cannot invoke its Lambda target.',
  scenario: 'The fa-training-order-created EventBridge rule is enabled and correctly matches new order events, but its fa-training-process-order Lambda target is never invoked. Test events appear as matched by the rule and EventBridge records failed target invocations. The event pattern must remain unchanged because it is already matching the intended events.',
  task: 'Use the supplied rule, metrics, and Lambda policy evidence to identify why delivery fails, apply the narrowest permission correction, and verify that matching events invoke only the intended Lambda target.',
  evidence: [
    {
      id: 'rule-and-metrics',
      title: 'EventBridge Rule and Metrics',
      kind: 'code',
      content: `Rule: fa-training-order-created
State: ENABLED
Event bus: default

Event pattern:
{
  "source": ["training.orders"],
  "detail-type": ["Order Created"]
}

Target:
arn:aws:lambda:eu-west-2:123456789012:function:fa-training-process-order

CloudWatch metrics after test events:
MatchedEvents: 6
Invocations: 6
FailedInvocations: 6`
    },
    {
      id: 'test-event',
      title: 'Matched Test Event',
      kind: 'code',
      content: `{
  "version": "0",
  "id": "11111111-2222-3333-4444-555555555555",
  "detail-type": "Order Created",
  "source": "training.orders",
  "account": "123456789012",
  "time": "2026-08-19T10:15:00Z",
  "region": "eu-west-2",
  "detail": {
    "orderId": "order-training-1001"
  }
}

Rule evaluation result:
Matched: true`
    },
    {
      id: 'lambda-policy',
      title: 'Lambda Resource-Based Policy',
      kind: 'code',
      content: `Function: fa-training-process-order

Resource-based policy:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowTrainingApiGateway",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "lambda:InvokeFunction",
      "Resource": "arn:aws:lambda:eu-west-2:123456789012:function:fa-training-process-order"
    }
  ]
}

EventBridge rule ARN:
arn:aws:events:eu-west-2:123456789012:rule/fa-training-order-created`
    }
  ],
  successCriteria: [
    'The learner identifies the missing EventBridge invocation permission on the Lambda function as the delivery failure.',
    'The Lambda resource-based policy allows events.amazonaws.com to invoke the function only from the intended rule ARN.',
    'The existing event pattern remains unchanged because the evidence proves it already matches.',
    'A final matching event produces a successful Lambda invocation and EventBridge FailedInvocations no longer increases for the test.'
  ],
  hints: [
    'The rule already reports matched events, so focus on what happens between the target invocation attempt and the Lambda function.',
    'When an AWS service invokes Lambda, the function can use a resource-based policy to grant that service lambda:InvokeFunction permission.',
    'Add a Lambda permission for principal events.amazonaws.com and scope its source ARN to fa-training-order-created rather than granting broad invocation access.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why are matching EventBridge events not reaching the Lambda function?',
      options: [
        { id: 'missing-lambda-permission', text: 'The Lambda resource-based policy does not permit EventBridge to invoke the function.' },
        { id: 'event-pattern', text: 'The event pattern does not match the supplied test event.' },
        { id: 'rule-disabled', text: 'The EventBridge rule is disabled.' },
        { id: 'lambda-needs-admin', text: 'The Lambda execution role needs AdministratorAccess before EventBridge can invoke it.' }
      ],
      correctOptionId: 'missing-lambda-permission',
      explanation: 'The rule is enabled, the test event matches, and EventBridge records failed invocations, while the Lambda policy contains no statement allowing events.amazonaws.com to invoke the function.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest effective correction?',
      options: [
        { id: 'scoped-resource-policy', text: 'Add lambda:InvokeFunction permission for events.amazonaws.com and restrict the permission to the fa-training-order-created rule ARN.' },
        { id: 'wildcard-principal', text: 'Allow every AWS principal to invoke the Lambda function.' },
        { id: 'change-pattern', text: 'Replace the working event pattern with a wildcard that matches every event.' },
        { id: 'admin-role', text: 'Attach AdministratorAccess to the Lambda execution role.' }
      ],
      correctOptionId: 'scoped-resource-policy',
      explanation: 'A rule-scoped Lambda resource-policy statement grants EventBridge exactly the invocation permission it needs without widening the event pattern or execution-role permissions.'
    }
  ],
  solution: {
    rootCause: 'The EventBridge rule matches the intended events and attempts to invoke its target, but the Lambda function resource-based policy has no statement granting events.amazonaws.com permission to call lambda:InvokeFunction.',
    fix: 'Add a Lambda resource-based permission for principal events.amazonaws.com with lambda:InvokeFunction and scope the source ARN to arn:aws:events:eu-west-2:123456789012:rule/fa-training-order-created, then publish another matching event and verify the Lambda invocation succeeds.',
    prevention: 'Provision EventBridge rules, targets, and their matching Lambda invocation permissions together so target permissions cannot be omitted or drift independently from the rule.'
  }
});
