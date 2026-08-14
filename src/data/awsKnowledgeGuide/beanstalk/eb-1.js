import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eb-1",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Beanstalk Environments: Web Server Environment vs Worker Environment (SQS Daemon)",
  "status": "ready",
  "plainEnglish": "AWS Elastic Beanstalk provides two distinct environment tiers to run your applications: Web Server Environments and Worker Environments. A Web Server Environment receives synchronous HTTP/HTTPS requests from clients via an Elastic Load Balancer (ALB) and routes them to your web application instances. A Worker Environment handles asynchronous, long-running background tasks. It includes a built-in AWS-managed daemon (the SQS daemon) running on each EC2 instance that automatically polls an Amazon SQS queue, extracts messages, and sends them as local HTTP POST requests to your worker application on `localhost:80` (or a configured port).",
  "whyItMatters": "Heavy background processing (like video encoding, PDF generation, or bulk email sending) should never run synchronously on web servers because it exhausts web worker threads and degrades user responsiveness. Decoupling web servers from background workers via Amazon SQS and Beanstalk Worker Environments ensures high responsiveness and independent auto scaling.",
  "workplaceExample": "An e-commerce site runs its frontend storefront in a Beanstalk Web Server Environment. When a customer places an order, the web server writes an order event to an SQS queue and immediately returns an HTTP 200 confirmation. A separate Beanstalk Worker Environment polls the SQS queue, processes credit card settlements, and generates invoice PDFs in the background.",
  "examFocus": "For SAA-C03, understand the fundamental architecture difference: Web Server tier uses an Elastic Load Balancer (ALB) to handle incoming user web requests; Worker tier uses an Amazon SQS queue and an on-instance SQS Daemon that pulls messages and POSTs them locally via HTTP to your application. If an exam question mentions offloading time-consuming batch tasks from a web app in Elastic Beanstalk, use a Worker Environment with SQS.",
  "keyPoints": [
    "Web Server Tier serves public or internal HTTP/HTTPS traffic through an Elastic Load Balancer.",
    "Worker Tier processes asynchronous background jobs pulled from an Amazon SQS queue.",
    "The SQS Daemon runs locally on worker EC2 instances, pulling messages and forwarding them as HTTP POSTs to localhost.",
    "Worker environments automatically scale EC2 instance counts based on SQS queue message depth.",
    "Decoupling web frontends from background workers ensures optimal resilience and performance."
  ],
  "commonMistake": "Executing long-running background tasks (e.g. 5-minute image processing jobs) directly inside the Web Server Environment thread pool, leading to HTTP 504 Gateway Timeouts for users. Offload background processing to a Beanstalk Worker Environment via SQS.",
  "example": "# Sample worker configuration in .ebextensions or cron.yaml:\n# cron.yaml scheduled task configuration for worker tier\nversion: 1\ncron:\n  - name: \"NightlyCleanup\"\n    url: \"/tasks/cleanup\"\n    schedule: \"0 2 * * *\"",
  "sources": [
    {
      "title": "Elastic Beanstalk Environment Tiers",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html"
    },
    {
      "title": "Worker Environments in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features-managing-env-tiers.html#worker-tier"
    }
  ]
});
