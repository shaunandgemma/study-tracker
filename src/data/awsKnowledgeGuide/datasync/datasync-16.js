import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-16",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "Bandwidth Throttling",
  "status": "ready",
  "plainEnglish": "Bandwidth Throttling in AWS DataSync is a traffic-shaping control that lets you set a maximum limit on the network bandwidth (measured in bytes per second, megabytes per second, or gigabytes per second) consumed by a DataSync task. By capping the transfer speed, you prevent DataSync from fully saturating your corporate WAN connection, AWS Direct Connect link, or internet gateway, ensuring that business-critical user traffic is not disrupted.",
  "whyItMatters": "Because DataSync is designed to maximize network throughput with multi-threaded parallel data streams, an unthrottled task can consume 100% of available network bandwidth. Throttling ensures peaceful coexistence with production applications during normal business hours.",
  "workplaceExample": "A hospital shares a 1 Gbps Direct Connect link between corporate EHR medical software and cloud backup transfers. The network team configures a DataSync task with a 200 MB/s (1.6 Gbps) limit overnight, but throttles it down to 25 MB/s (200 Mbps) during daytime clinical hours (07:00 to 19:00).",
  "examFocus": "For SAA-C03, know that AWS DataSync allows you to set raw bandwidth limits (in bytes per second or megabytes per second) either statically on the task options or dynamically adjusted per task execution. If an exam scenario describes a migration saturating an on-premises network during business hours, choose DataSync Bandwidth Throttling.",
  "keyPoints": [
    "Limits maximum network throughput used by DataSync tasks.",
    "Configured in bytes per second (B/s), MB/s, or GB/s.",
    "Prevents WAN saturation on shared AWS Direct Connect or VPN links.",
    "Can be set statically on task creation or overridden dynamically per execution.",
    "Can be modified while a task execution is actively running without canceling the task."
  ],
  "commonMistake": "Leaving bandwidth unthrottled during daytime business hours on a shared internet connection, which can cause high latency and packet loss for on-premises employees and customer-facing apps.",
  "example": "# Update bandwidth limit on a running task execution to 50 MB/s (52,428,800 B/s):\naws datasync update-task-execution \\\n  --task-execution-arn arn:aws:datasync:us-east-1:123456789012:task/task-0123456789abcdef0/execution/exec-0123456789abcdef0 \\\n  --options '{\"BytesPerSecond\": 52428800}'",
  "sources": [
    {
      "title": "Setting Bandwidth Limits in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/set-bandwidth-limit.html"
    },
    {
      "title": "Configuring Task Options in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/working-with-tasks.html#task-options"
    }
  ]
});
