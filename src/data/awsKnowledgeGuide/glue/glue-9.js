import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-9',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Triggers',
  status: 'ready',
  plainEnglish: 'An AWS Glue Trigger is an automated scheduler or event listener that initiates the execution of AWS Glue jobs or crawlers. Triggers can be configured as Scheduled (cron/rate expressions), On-Demand (manually or API-driven), or Event-Driven / Conditional (firing when another job or crawler completes with a specific status like SUCCEEDED).',
  whyItMatters: 'Complex data integration requires chaining tasks sequentially. Glue Triggers allow building automated dependency chains—for example, starting an ETL job automatically as soon as a Glue Crawler finishes discovering new S3 partitions.',
  workplaceExample: 'An enterprise configures a Conditional Trigger. When the nightly s3-raw-crawler finishes with status SUCCEEDED, the trigger fires the transform-raw-to-parquet Glue job. If the transformation succeeds, another trigger fires the notify-slack job.',
  examFocus: 'SAA-C03 Trigger Types:\n- Scheduled: Cron expressions (e.g. cron(0 2 * * ? *)) or rate expressions.\n- On-Demand: Started manually via Console or API call (start-trigger).\n- Conditional: Listens to state changes of previous Glue jobs or crawlers (SUCCEEDED, FAILED, TIMED_OUT).\n- EventBridge Triggers: Fires Glue jobs based on external AWS EventBridge system events.',
  keyPoints: [
    'Initiates Glue jobs and crawlers automatically based on schedules or events.',
    'Trigger types: Scheduled (cron), On-Demand, and Conditional (event-driven).',
    'Conditional triggers build task dependency chains (e.g. Run Job B after Job A succeeds).',
    'Integrates with Amazon EventBridge for external AWS system event triggering.',
    'Essential component for constructing automated AWS Glue data pipelines.'
  ],
  commonMistake: 'Using fixed time delay schedules to chain Glue jobs instead of Conditional Triggers. If Job A takes longer than expected, fixed time delays cause Job B to run prematurely on incomplete data.',
  example: 'Creating a Conditional Trigger via AWS CLI:\naws glue create-trigger --name start-job-b-on-job-a-success --type CONDITIONAL --predicate "{\\"Conditions\\":[{\\"LogicalOperator\\":\\"EQUALS\\",\\"JobName\\":\\"JobA\\",\\"State\\":\\"SUCCEEDED\\"}]}" --actions "[{\\"JobName\\":\\"JobB\\"}]"',
  sources: [
    { title: 'Triggering Jobs and Crawlers in AWS Glue', url: 'https://docs.aws.amazon.com/glue/latest/dg/trigger-job.html' }
  ]
});
