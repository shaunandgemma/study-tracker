import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-49',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 vs Lambda',
  status: 'ready',
  plainEnglish: 'Amazon EC2 and AWS Lambda represent two different compute paradigms in AWS:\n- Amazon EC2 (IaaS): Virtual servers where you manage the OS, runtime environment, network configuration, and scaling. EC2 instances can run continuously 24/7 without execution time limits.\n- AWS Lambda (Serverless / FaaS): Serverless event-driven functions where AWS manages all underlying servers, OS, and scaling. You supply only code, and functions execute for a maximum of 15 minutes per invocation, billing strictly for execution time.',
  whyItMatters: 'Choosing between EC2 and Lambda impacts operational overhead, architecture, and cost. Serverless (Lambda) eliminates server administration for event-driven tasks, while EC2 is necessary for long-running processes, custom OS software, or legacy monoliths.',
  workplaceExample: 'An image upload website uses AWS Lambda to process user avatars automatically whenever an image is uploaded to S3 (running 2 seconds per file). For their main interactive web application, they run EC2 instances behind an Application Load Balancer.',
  examFocus: 'SAA-C03 Architectural Decision Matrix:\n- Long-running processes (>15 mins), custom OS kernel modules, legacy applications, continuous heavy workloads -> Amazon EC2.\n- Event-driven tasks, short execution duration (<15 mins), zero server maintenance, automatic scaling from 0 to thousands -> AWS Lambda.',
  keyPoints: [
    'EC2: IaaS, full OS control, long-running processes, persistent runtime.',
    'Lambda: Serverless FaaS, no server management, max 15-min execution limit.',
    'EC2 bills continuously while running; Lambda bills per millisecond of execution time.',
    'EC2 requires manual or Auto Scaling configuration; Lambda scales automatically per request.',
    'Lambda is ideal for event triggers (S3 upload, DynamoDB stream, API Gateway).'
  ],
  commonMistake: 'Attempting to run a 2-hour video rendering batch script in AWS Lambda. Lambda functions timeout at 15 minutes; use EC2, AWS Fargate, or AWS Batch for long-running jobs.',
  example: 'Decision Trade-off:\nWeb Application Monolith (Spring Boot 24/7) -> Amazon EC2.\nImage Resizing on S3 Upload (2 sec invocation) -> AWS Lambda.',
  sources: [
    { title: 'What is Amazon EC2?', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html' }
  ]
});
