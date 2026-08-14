import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-21",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "DataSync Filtering",
  "status": "ready",
  "plainEnglish": "DataSync Filtering provides pattern-based include and exclude rules that dictate precisely which files, folders, and object prefixes are transferred or skipped during a task execution. Filters use pattern matching (such as wildcards `*`, exact file extensions like `*.tmp`, or directory prefixes like `/logs/*`) to exclude temporary files, cache directories, or unneeded file types from being copied across the network.",
  "whyItMatters": "On-premises file systems frequently contain gigabytes of temporary swap files (`.tmp`), OS system files (`.DS_Store`, `Thumbs.db`), and cache folders. Filtering prevents wasting bandwidth, storage costs, and transfer time on junk files while migrating only valuable business data.",
  "workplaceExample": "A media team syncs raw video footage from on-premises editing workstations to Amazon S3. They configure an Exclude filter for `*.tmp`, `*.bak`, `/.cache/*`, and `/.Trash/*`, and an Include filter for `*.mp4`, `*.mov`, and `*.prores`, transferring only final project assets.",
  "examFocus": "For SAA-C03, know that DataSync supports both Include and Exclude filters at the task and task execution levels. When both filters are specified, Exclude filters take precedence over Include filters. Filters can match directory paths and file patterns with wildcards.",
  "keyPoints": [
    "Supports Include and Exclude filters based on file paths, folder patterns, and extensions.",
    "Uses standard wildcard pattern matching (e.g. `*.log`, `/temp/*`).",
    "Exclude filters take precedence when an object matches both Include and Exclude rules.",
    "Can be configured on the task definition or dynamically overridden per task execution.",
    "Saves network bandwidth and cloud storage costs by omitting transient and system files."
  ],
  "commonMistake": "Writing include and exclude filter patterns with incorrect forward slashes or missing wildcards. Test filter syntax on a small test directory before launching a full-scale task execution.",
  "example": "# Create a task with Exclude filter patterns:\naws datasync create-task \\\n  --source-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-source \\\n  --destination-location-arn arn:aws:datasync:us-east-1:123456789012:location/loc-dest \\\n  --excludes 'FilterType=SIMPLE_PATTERN,Value=*.tmp|*.bak|/temp/*'",
  "sources": [
    {
      "title": "Filtering Data Transferred by AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/filtering.html"
    },
    {
      "title": "DataSync Filter Pattern Syntax and Rules",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/filtering.html#filtering-syntax"
    }
  ]
});
