import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-fargate",
  "topicTitle": "AWS Fargate",
  "objectiveCode": "Containers",
  "status": "ready",
  "id": "far-12",
  "title": "Fargate Spot",
  "plainEnglish": "AWS Fargate Spot is a capacity provider option that lets you run interruption-tolerant Amazon ECS tasks on spare AWS compute capacity at up to a 70% discount compared to standard Fargate pricing. When AWS requires the capacity back, tasks receive a two-minute interruption warning signal (SIGTERM) before being terminated.",
  "whyItMatters": "Batch jobs, worker queues, asynchronous ETL tasks, and non-production testing environments often do not require 100% continuous uptime and can tolerate interruptions. Fargate Spot provides massive cloud cost savings for these workloads with zero server fleet management.",
  "workplaceExample": "A video processing platform processes uploaded user videos asynchronously from an SQS queue. They configure an ECS service using a Capacity Provider Strategy with a baseline of 2 regular Fargate tasks (for steady processing) and a 1:4 weighting split between FARGATE and FARGATE_SPOT for additional burst workers, cutting their monthly compute bill by over 50%.",
  "examFocus": "Understand Fargate Spot characteristics: Tasks are subject to interruption when AWS needs capacity back. When interrupted, Fargate sends a SIGTERM signal and a 2-minute countdown event via Amazon EventBridge before sending SIGKILL. Use Fargate Spot only for fault-tolerant, stateless, and interruptible workloads. Use Capacity Provider Strategies to combine regular FARGATE and FARGATE_SPOT.",
  "keyPoints": [
    "Fargate Spot runs ECS container tasks on spare AWS compute capacity at up to 70% discount over on-demand Fargate.",
    "When capacity is reclaimed, AWS issues a 2-minute task retirement notice via an EventBridge event and sends a SIGTERM signal to containers.",
    "Applications should trap the SIGTERM signal to perform graceful cleanup (finishing the current queue item, saving state) before termination.",
    "Best practice is to use Capacity Provider Strategies (e.g., base=1 on FARGATE, weight=1 on FARGATE and weight=4 on FARGATE_SPOT) to ensure baseline resilience.",
    "Fargate Spot does not support SLA-guaranteed continuous availability; if no spot capacity is available, tasks will not launch until capacity returns.",
    "Ideal for batch jobs, background worker queues, dev/test environments, CI/CD runners, and parallel rendering workloads."
  ],
  "commonMistake": "Running critical, latency-sensitive production workloads with zero tolerance for interruption entirely on Fargate Spot without a regular Fargate fallback or base capacity.",
  "example": "Configure a capacity provider strategy on an ECS service: aws ecs create-service --cluster production --service-name worker-svc --task-definition worker:1 --capacity-provider-strategy capacityProvider=FARGATE,base=2,weight=1 capacityProvider=FARGATE_SPOT,weight=3 --desired-count 10.",
  "sources": [
    {
      "title": "AWS Fargate Capacity Providers",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html"
    },
    {
      "title": "Handling Fargate Spot Task Termination Notices",
      "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html#fargate-capacity-providers-termination"
    }
  ]
});
