import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-17",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "Incremental Transfers",
  "status": "ready",
  "plainEnglish": "Incremental Transfers in AWS DataSync refer to the capability where subsequent task executions scan source and destination locations and transfer only the newly added, modified, or deleted files since the last run, rather than re-copying the entire dataset. During the 'Preparing' phase, DataSync compares file metadata (such as modification timestamps, file size, or checksums) between the source and destination and identifies the exact delta subset to transfer.",
  "whyItMatters": "Initial data migrations across petabyte datasets can take days or weeks. During that migration window, business users continue modifying files on-premises. Incremental transfers enable periodic delta runs that sync only changes in minutes, allowing you to perform seamless final cutovers with minimal application downtime.",
  "workplaceExample": "A company begins a 100 TB file migration on Monday. The initial baseline transfer completes on Friday. Over the weekend, while production apps are briefly paused, the team runs an incremental DataSync task that transfers only the 5 GB of files modified during the week. The final delta sync finishes in 8 minutes, enabling instant cutover.",
  "examFocus": "For SAA-C03, remember that AWS DataSync automatically performs incremental transfers on every execution following the initial copy. It scans metadata in the Preparing phase to copy only new or modified objects, and can optionally delete files at the destination that no longer exist at the source (mirroring).",
  "keyPoints": [
    "Transfers only added, updated, or modified files on subsequent task executions.",
    "Scans and compares metadata in the Preparing phase to detect file changes.",
    "Drastically reduces ongoing synchronization time and network bandwidth consumption.",
    "Supports optional deletion of destination files removed from the source.",
    "Key architectural pattern for minimal-downtime final migration cutovers."
  ],
  "commonMistake": "Disabling or canceling tasks thinking that restarting them will re-copy the entire 100 TB from scratch. DataSync naturally resumes and copies only the delta files that were missed or changed.",
  "example": "# Configure task to preserve deleted files or mirror source exactly:\naws datasync update-task \\\n  --task-arn arn:aws:datasync:us-east-1:123456789012:task/task-0123456789abcdef0 \\\n  --options '{\"OverwriteMode\":\"ALWAYS\",\"PreserveDeletedFiles\":\"REMOVE\"}'",
  "sources": [
    {
      "title": "How AWS DataSync Transfers Data Incrementally",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/how-datasync-works.html#how-datasync-transfers"
    },
    {
      "title": "Understanding DataSync Transfer Options",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/working-with-tasks.html#task-options"
    }
  ]
});
