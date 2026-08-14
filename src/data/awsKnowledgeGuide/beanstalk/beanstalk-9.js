import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "beanstalk-9",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Worker Environments",
  "status": "ready",
  "plainEnglish": "A Worker Environment is an Elastic Beanstalk environment tier designed to execute background jobs and asynchronous compute tasks. Instead of provisioning an Elastic Load Balancer to receive client web traffic, a Worker Environment automatically provisions an Amazon SQS queue (or attaches to an existing one). Each EC2 instance in the worker environment runs an AWS-managed daemon (the SQS daemon) that continually polls the queue, retrieves messages, and delivers them as local HTTP POST requests to your application running on localhost.",
  "whyItMatters": "Decoupling asynchronous, resource-heavy background workloads (such as generating daily reports, thumbnailing images, or processing payments) from web servers prevents user-facing web requests from slowing down or timing out. Worker environments can independently scale up when SQS queues grow and scale down to zero when idle.",
  "workplaceExample": "A video sharing website uses a Web Server environment to handle user uploads, saving raw MP4 files to S3 and writing video IDs to an SQS queue. A Worker Environment polls the SQS queue, transcodes videos into multiple resolutions using FFmpeg, and deletes the SQS messages upon successful completion.",
  "examFocus": "For SAA-C03, know that Worker Environments use an Amazon SQS queue + SQS Daemon (sqsd) running on EC2 instances. If a message fails processing (e.g. application returns a non-200 HTTP code), the SQS daemon leaves the message in the queue to be retried after the visibility timeout or sent to a Dead Letter Queue (DLQ). Periodic scheduled tasks can be configured using a `cron.yaml` file in the source bundle.",
  "keyPoints": [
    "Processes asynchronous background tasks without an Elastic Load Balancer.",
    "Automatically integrates with Amazon Simple Queue Service (SQS).",
    "SQS Daemon on each instance pulls messages and sends them to `http://localhost/` via HTTP POST.",
    "Auto Scaling scales worker EC2 instances based on SQS queue depth (ApproximateNumberOfMessagesVisible).",
    "Supports periodic cron background tasks defined via a `cron.yaml` file at the root of the source bundle."
  ],
  "commonMistake": "Writing custom polling loops, SDK queue listeners, and threading code inside your worker application. Elastic Beanstalk's built-in SQS Daemon handles message pulling, visibility timeout extension, and message deletion automatically—your application simply needs to expose an HTTP POST endpoint.",
  "example": "# cron.yaml configuration for scheduled worker tasks:\nversion: 1\ncron:\n  - name: \"DailyReportGeneration\"\n    url: \"/api/reports/daily\"\n    schedule: \"0 4 * * *\"",
  "sources": [
    {
      "title": "Worker Environments in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html#worker-tier"
    },
    {
      "title": "Periodic Tasks in Worker Environments (cron.yaml)",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html#worker-tier-periodic"
    }
  ]
});
