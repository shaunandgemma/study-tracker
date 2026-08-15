import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-8",
  "title": "Choice States",
  "plainEnglish": "A Choice State (`\"Type\": \"Choice\"`) adds branching decision logic to your AWS Step Functions state machine, functioning like an `if-then-else` or `switch-case` statement in programming. A Choice state evaluates comparison rules against variables in the state's JSON input (such as checking if a numeric score is greater than 80, if a status string equals 'APPROVED', or if a field is null) and routes execution to the appropriate `Next` state. If no comparison rule matches, execution falls back to an optional `Default` state.",
  "whyItMatters": "Business workflows are dynamic and require different execution paths based on real-time data conditions. Without Choice states, applications would be forced to invoke custom Lambda functions simply to evaluate simple boolean or numeric comparison logic, increasing execution latency and compute costs.",
  "workplaceExample": "An insurance claims workflow uses a Choice state to evaluate an incoming claim: (1) If `$.claimAmount < 1000` AND `$.fraudScore < 0.1`, route to `AutoApproveClaim`, (2) If `$.claimAmount >= 1000` AND `$.claimAmount < 50000`, route to `StandardAdjusterReview`, (3) If `$.fraudScore >= 0.5`, route to `SpecialInvestigationsUnit`, (4) Otherwise, `Default` routes to `ManualManagerReview`.",
  "examFocus": "Understand Choice State comparison operators and constraints: (1) No Computational Work: Choice states ONLY evaluate logic; they cannot invoke external services, modify state payload data, or execute code. (2) Comparison Operators: String comparisons (`StringEquals`, `StringMatches`), Numeric comparisons (`NumericGreaterThan`, `NumericLessThanEquals`), Boolean (`BooleanEquals`), Timestamp (`TimestampGreaterThan`), and Existence checks (`IsPresent`, `IsNull`). (3) Logical Operators: Combine conditions using `And`, `Or`, and `Not`. (4) Default Field: Specifies the fallback state if no Choice rule evaluates to true (if no rule matches and no Default is defined, the execution fails with `States.NoChoiceMatched`).",
  "keyPoints": [
    "Adds conditional if-then-else branching logic to state machine workflows.",
    "Does not execute external work or alter payload data; strictly evaluates input values.",
    "Supports rich comparison operators: String, Numeric, Boolean, Timestamp, and Null checks.",
    "Supports compound boolean expressions using `And`, `Or`, and `Not` logical operators.",
    "Includes an optional `Default` transition state for unhandled fallback paths.",
    "If no choice rules match and no `Default` state is defined, execution fails with `States.NoChoiceMatched`."
  ],
  "commonMistake": "Invoking a Lambda function just to evaluate whether an order total is above $100. Step Functions Choice states evaluate numeric and string comparison rules natively at zero additional compute cost.",
  "example": "Define a Choice state in Amazon States Language: {\"Type\": \"Choice\", \"Choices\": [{\"Variable\": \"$.orderStatus\", \"StringEquals\": \"APPROVED\", \"Next\": \"FulfillOrder\"}, {\"Variable\": \"$.orderStatus\", \"StringEquals\": \"REJECTED\", \"Next\": \"NotifyCustomer\"}], \"Default\": \"ManualReview\"}.",
  "sources": [
    {
      "title": "Choice State in Amazon States Language",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-choice-state.html"
    },
    {
      "title": "Amazon States Language Logic and Choice Rules",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html"
    }
  ]
});
