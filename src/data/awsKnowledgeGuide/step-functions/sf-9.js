import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-step-functions",
  "topicTitle": "AWS Step Functions",
  "objectiveCode": "Integration",
  "status": "ready",
  "id": "sf-9",
  "title": "Parallel States",
  "plainEnglish": "A Parallel State (`\"Type\": \"Parallel\"`) allows your AWS Step Functions state machine to execute multiple independent branches of execution concurrently at the same time. Each branch in a Parallel state contains its own independent state machine workflow (with its own `StartAt` state). The Parallel state receives a copy of the input JSON, passes it to every branch simultaneously, waits for ALL branches to complete successfully, and then outputs an ordered JSON array containing the output from each branch.",
  "whyItMatters": "Running independent tasks sequentially (one after another) when they have no dependencies on each other adds unnecessary latency to business processes. Parallel states cut end-to-end execution time dramatically by executing independent operations concurrently (such as running fraud checks, credit verification, and inventory lookups at the same time).",
  "workplaceExample": "A modern travel booking workflow processes a flight and hotel reservation. When a user books a package, a Parallel state splits into three concurrent branches: Branch 1 books the flight ticket with the airline API, Branch 2 reserves the hotel room via the hotel reservation service, and Branch 3 books the rental car with the rental agency. All three reservations execute in parallel in 1.5 seconds rather than 4.5 seconds sequentially, and the Parallel state aggregates all three confirmation codes into an array for the confirmation email.",
  "examFocus": "Understand Parallel State execution mechanics and failure behavior: (1) Wait-for-All: The Parallel state waits until ALL branches finish before transitioning to the `Next` state. (2) Array Output: The output is an array of results from each branch in the exact order the branches were defined in the ASL definition. (3) Failure Behavior: If ANY single branch fails with an unhandled error, the entire Parallel state immediately fails, and Step Functions cancels execution of all other running branches. (4) Catch Blocks: Attach a `Catch` block to the Parallel state to handle branch failures gracefully without aborting the entire workflow.",
  "keyPoints": [
    "Executes multiple independent workflow branches concurrently in parallel.",
    "Each branch contains its own independent state definitions and `StartAt` entry state.",
    "Waits for all branches to complete before transitioning to the next state.",
    "Outputs an ordered JSON array where each element contains the result of one branch.",
    "If any branch fails without an internal Catch block, the entire Parallel state fails.",
    "Ideal for fan-out tasks with fixed, known branches like concurrent third-party API checks."
  ],
  "commonMistake": "Using a Parallel state when you need to process a dynamic, variable-length list of items (e.g., looping through 50 items in a shopping cart). Parallel states are for fixed, predefined static branches; use a Map state for iterating over dynamic arrays.",
  "example": "Define a Parallel state executing two concurrent branches in Amazon States Language: {\"Type\": \"Parallel\", \"Branches\": [{\"StartAt\": \"CheckFraud\", \"States\": {\"CheckFraud\": {\"Type\": \"Task\", \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:FraudCheck\", \"End\": true}}}, {\"StartAt\": \"CheckInventory\", \"States\": {\"CheckInventory\": {\"Type\": \"Task\", \"Resource\": \"arn:aws:lambda:us-east-1:123456789012:function:InventoryCheck\", \"End\": true}}}], \"Next\": \"CombineResults\"}.",
  "sources": [
    {
      "title": "Parallel State in Amazon States Language",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-parallel-state.html"
    },
    {
      "title": "Parallel Processing Projects in AWS Step Functions",
      "url": "https://docs.aws.amazon.com/step-functions/latest/dg/sample-project-parallel-processing.html"
    }
  ]
});
