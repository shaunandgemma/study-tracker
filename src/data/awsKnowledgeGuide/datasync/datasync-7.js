import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-7",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "DataSync Tasks",
  "status": "ready",
  "plainEnglish": "A DataSync Task is the core execution unit that defines what data is transferred, where it moves from and to, and how the transfer behaves. A task binds a Source Location to a Destination Location and specifies operational options such as data integrity verification mode (Only transfer or Full verification), bandwidth throttling limits, metadata preservation rules (POSIX permissions, timestamps, ACLs), include/exclude file filters, and recurring execution schedules.",
  "whyItMatters": "Tasks give you fine-grained control over how migrations run. Instead of running brute-force copy commands, a DataSync task automatically executes a multi-phase workflow: discovery (scanning source and destination to detect changed files), transfer (copying modified data in parallel streams with TLS encryption), and verification (comparing source and destination hashes).",
  "workplaceExample": "A cloud operations team configures a DataSync Task named `Sync-Daily-CAD-Files`. It connects their on-premises SMB share to an Amazon FSx for Windows File Server, runs automatically every night at 02:00 UTC, throttles bandwidth to 500 Mbps, and verifies data integrity on all transferred bytes.",
  "examFocus": "For SAA-C03, know the task execution lifecycle phases: Launching -> Preparing (discovering changed files) -> Transferring -> Verifying -> Success. Know that tasks copy only incremental changes after the initial baseline copy, preserving file timestamps, POSIX permissions, ownership, and NTFS ACLs according to task options.",
  "keyPoints": [
    "Connects a specific Source Location to a Destination Location.",
    "Executes in distinct phases: Preparing (scanning), Transferring (copying), and Verifying.",
    "Transfers only incremental file changes (added or modified files) after initial run.",
    "Configurable options include verification mode, bandwidth limits, and metadata preservation.",
    "Can be executed on-demand or scheduled automatically with cron expressions."
  ],
  "commonMistake": "Configuring full verification on massive multi-petabyte datasets containing tens of millions of files during tight migration maintenance windows. Full verification checks every file in source and destination, which extends the verification phase. Use 'Verify only transferred data' for faster turnaround.",
  "example": "# Create a DataSync task with specific options:\naws datasync create-task \\\n  --source-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-0123456789abcdef0 \\\n  --destination-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-0fedcba9876543210 \\\n  --options '{\"VerifyMode\":\"POINT_IN_TIME_CONSISTENT\",\"Atime\":\"BEST_EFFORT\",\"Mtime\":\"PRESERVE\",\"PosixPermissions\":\"PRESERVE\"}' \\\n  --name ProductionMigrationTask",
  "sources": [
    {
      "title": "Working with Tasks in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/working-with-tasks.html"
    },
    {
      "title": "Configuring DataSync Task Settings and Options",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/configure-metadata.html"
    }
  ]
});
