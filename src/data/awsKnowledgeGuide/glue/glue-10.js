import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'glue-10',
  topicId: 'topic-glue',
  topicTitle: 'AWS Glue',
  objectiveCode: 'Analytics',
  title: 'Glue Workflows',
  status: 'ready',
  plainEnglish: 'An AWS Glue Workflow is a visual orchestration tool that lets you design, manage, and monitor multi-step data integration pipelines comprising multiple Glue crawlers, jobs, and triggers as a single unified DAG (Directed Acyclic Graph). Workflows track overall execution status, manage shared state, and visualize job dependencies in the AWS Glue console.',
  whyItMatters: 'Managing dozens of independent Glue jobs and crawlers with individual scripts quickly becomes chaotic. Workflows combine crawlers, jobs, and conditional triggers into a clean, graphical pipeline graph with centralized monitoring and error handling.',
  workplaceExample: 'A retail analytics pipeline uses a Glue Workflow: 1) Run S3 Crawler -> 2) On Success, trigger 3 parallel PySpark transform jobs -> 3) When all 3 transform jobs finish, trigger a Glue job to load Amazon Redshift -> 4) Send execution status summary to CloudWatch.',
  examFocus: 'SAA-C03 Workflow Architecture:\n- Orchestrates complex DAGs of Glue Crawlers, Jobs, and Triggers.\n- Tracks execution history, overall pipeline progress, and component failures.\n- Supports workflow run properties (parameter passing across pipeline steps).\n- Can be triggered on a schedule, on-demand, or via EventBridge events.',
  keyPoints: [
    'Visual orchestration tool for designing multi-step Glue ETL pipelines (DAGs).',
    'Chains Glue Crawlers, Jobs, and Triggers with visual graph monitoring.',
    'Passes runtime parameter properties across pipeline execution steps.',
    'Provides centralized logging, status tracking, and error reporting for complex ETL flows.',
    'Can be triggered via EventBridge, schedule, or API call.'
  ],
  commonMistake: 'Writing complex custom Python scripts inside a single Lambda function to poll 10 Glue job statuses sequentially instead of using a managed AWS Glue Workflow.',
  example: 'Starting a Glue Workflow Run via AWS CLI:\n`aws glue start-workflow-run --name NightlyDataLakeIngestion`',
  sources: [
    { title: 'Overview of Workflows in AWS Glue', url: 'https://docs.aws.amazon.com/glue/latest/dg/workflows-overview.html' }
  ]
});
