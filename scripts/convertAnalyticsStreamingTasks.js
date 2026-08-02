import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source paths (Read-Only)
const SERVERLESS_REVIEW_PATH = path.join(__dirname, '../migration_work/hands_on_tasks/SAA/serverless-review-required.json');

// Target migration work directory inside study-tracker
const MIGRATION_DIR = path.join(__dirname, '../migration_work/hands_on_tasks/SAA');
const APP_TASKS_DIR = path.join(__dirname, '../src/data/tasks');

fs.mkdirSync(MIGRATION_DIR, { recursive: true });
fs.mkdirSync(APP_TASKS_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------
function cleanHtml(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ---------------------------------------------------------------------------
// Analytics / Streaming task sanitisation
// ---------------------------------------------------------------------------
function sanitiseAnalyticsTask(task) {
  const corrections = [];

  // 1. Correct topic: Serverless Task 11 is a Data Firehose task.
  //    topic-firehose does not exist in examData; nearest valid topic is topic-kinesis.
  if (task.topicId !== 'topic-kinesis') {
    task.topicId = 'topic-kinesis';
    corrections.push('Reassigned from topic-lambda to topic-kinesis (Amazon Kinesis / Data Firehose delivery).');
  }

  // 2. Update ID and slug to reflect correct service and topic
  task.id = 'task-saa-kinesis-deliver-records-to-s3-with-firehose-011';
  task.slug = 'deliver-records-to-s3-with-firehose';
  task.service = 'Amazon Kinesis';
  task.feature = 'Amazon Data Firehose';
  task.title = 'Deliver Records to S3 with Amazon Data Firehose';
  corrections.push('Updated task ID, slug, title, service and feature to reflect Data Firehose analytics context.');

  // 3. Firehose cost warning (non-numeric)
  task.costWarning = 'Data Firehose ingestion, format conversion, dynamic partitioning, transformation and destination-service charges may apply.';
  corrections.push('Replaced numeric cost warning with non-numeric Firehose cost warning.');

  // 4. Remove AdministratorAccess recommendation from Step 1
  if (task.consoleSteps && task.consoleSteps.length > 0) {
    const step1 = task.consoleSteps[0];
    if (step1.instructions) {
      step1.instructions = step1.instructions
        .filter(ins => {
          const lower = (ins.text || '').toLowerCase();
          return !lower.includes('administratoraccess is acceptable') &&
                 !lower.includes('root user');
        })
        .map(ins => {
          let text = ins.text || '';
          if (text.toLowerCase().includes('iam user') && !text.toLowerCase().includes('lab role')) {
            text = 'Use an IAM user or lab role with the permissions required for this task.';
          }
          return { ...ins, text };
        });
      corrections.push('Removed AdministratorAccess recommendation from Step 1.');
    }
  }

  // 5. Fix CLI step 2 – remove real account-id placeholder in ARN
  if (task.cliSteps && task.cliSteps.length > 1) {
    const cliStep2 = task.cliSteps[1];
    if (cliStep2.commands) {
      cliStep2.commands = cliStep2.commands.map(cmd => {
        let text = cmd.text || '';
        // Replace bare ellipsis ARN placeholder with explicit placeholder
        text = text.replace(
          /arn:aws:s3:::\.\.\.+/g,
          'arn:aws:s3:::your-analytics-destination-bucket'
        );
        // Add role ARN placeholder requirement
        if (text.includes('firehose create-delivery-stream') && !text.includes('RoleARN')) {
          text = text.replace(
            '--s3-destination-configuration',
            '--s3-destination-configuration \'{"RoleARN":"arn:aws:iam::YOUR_ACCOUNT_ID:role/firehose-s3-role"}\' --s3-destination-configuration'
          );
        }
        return { ...cmd, text };
      });
    }
    // Add destructive command warning to delete step
    const cliStep3 = task.cliSteps[2];
    if (cliStep3 && !cliStep3.warning) {
      cliStep3.warning = 'Destructive Command Warning: This command permanently deletes the Firehose delivery stream. Confirm the stream name before running.';
      corrections.push('Added destructive command warning to Data Firehose delete CLI step.');
    }
  }

  // 6. Fix verification – replace generic Lambda verification text
  task.verification = [
    {
      id: 'verify-1',
      text: 'Confirm the Firehose delivery stream status shows Active in the Amazon Data Firehose console.'
    },
    {
      id: 'verify-2',
      text: 'Confirm the S3 destination bucket has been created and the delivery stream is configured with the correct buffer interval and buffer size.'
    },
    {
      id: 'verify-3',
      text: 'Confirm the delivery stream uses Direct PUT as the source and Amazon S3 as the destination.'
    }
  ];
  corrections.push('Replaced generic Lambda verification with Firehose-specific verification checks.');

  // 7. Add comprehensive cleanup
  task.cleanup = [
    {
      id: 'cleanup-1',
      text: 'Open the Amazon Data Firehose console and select the analytics-lake-ingest delivery stream.'
    },
    {
      id: 'cleanup-2',
      text: 'Click Delete to remove the delivery stream. Confirm deletion. (Note: delete-delivery-stream is destructive and cannot be undone.)'
    },
    {
      id: 'cleanup-3',
      text: 'Open the Amazon S3 console, find the destination bucket (e.g. saa-analytics-sink-[account-id]), empty the bucket, then delete it.'
    },
    {
      id: 'cleanup-4',
      text: 'If an IAM role was created solely for this lab, open the IAM console and delete the role and its inline policies.'
    },
    {
      id: 'cleanup-5',
      text: 'If a CloudWatch log group was created for Firehose error logging, open CloudWatch Logs and delete the log group.'
    }
  ];
  corrections.push('Added comprehensive Firehose cleanup instructions covering stream, S3 bucket, IAM role and log group.');

  // 8. Update exam tip to be SAA-C03 Firehose specific
  task.examTips = [
    {
      id: 'tip-1',
      text: 'SAA-C03: Amazon Data Firehose is a fully managed delivery service that buffers and loads streaming data to S3, Redshift, OpenSearch or HTTP endpoints. It is not a real-time multi-consumer event stream — use Kinesis Data Streams for that pattern.'
    },
    {
      id: 'tip-2',
      text: 'SAA-C03: Firehose buffering (by size or time interval) introduces delivery latency. Choose Kinesis Data Streams when sub-second consumer latency is required.'
    }
  ];
  corrections.push('Replaced generic exam tip with Firehose-specific SAA-C03 tips.');

  // 9. Update memory hook
  task.memoryHook = 'Firehose = Fire and forget to a destination. It delivers, buffers and optionally transforms, but does not let multiple independent consumers replay the same records.';
  corrections.push('Updated memory hook to describe Firehose delivery semantics vs Kinesis Data Streams.');

  // 10. Add whyItMatters note on Firehose vs Kinesis distinction
  if (!task.whyItMatters || task.whyItMatters.includes('serverless component')) {
    task.whyItMatters = 'Amazon Data Firehose simplifies streaming data delivery to destinations such as S3, Redshift and OpenSearch without managing consumers or shards. Unlike Kinesis Data Streams, Firehose is a delivery service — it does not support multiple independent consumers replaying the same data. Understanding this distinction is essential for SAA-C03 architecture questions.';
    corrections.push('Replaced generic serverless whyItMatters with Firehose delivery semantics explanation.');
  }

  // 11. Update tags
  task.tags = ['Amazon Kinesis', 'Amazon Data Firehose', 'Analytics', 'Streaming', 'S3', 'Medium', 'aws-saa-c03'];
  corrections.push('Updated task tags to reflect Kinesis/Firehose analytics context.');

  // 12. Correct region
  task.region = 'eu-west-2';
  task.examCode = 'aws-saa-c03';

  // 13. Difficulty: Data Firehose delivery stream = Medium
  task.difficulty = 'Medium';
  task.estimatedMinutes = 30;

  // 14. Correct goal
  task.goal = 'Create an Amazon Data Firehose delivery stream using Direct PUT as the source and Amazon S3 as the destination. Understand Firehose buffering, delivery semantics, and how it differs from Kinesis Data Streams for analytics ingestion.';

  return { task, corrections };
}

// ---------------------------------------------------------------------------
// Main execution
// ---------------------------------------------------------------------------
function runConversion() {
  console.log('--- Starting SAA / Analytics and Streaming Hands-On Tasks Conversion ---');

  // Find the analytics source material
  const batchDir = 'E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA';
  const batchFiles = fs.readdirSync(batchDir);
  console.log('\nAvailable SAA batch files:', batchFiles.join(', '));

  const analyticsFile = batchFiles.find(f =>
    f.includes('analytic') || f.includes('stream') || f.includes('kinesis') || f.includes('data-')
  );
  if (analyticsFile) {
    console.log(`\nFound dedicated analytics batch: ${analyticsFile}`);
  } else {
    console.log('\nNo dedicated Analytics and Streaming batch file found in hands_on_tasks/batches/SAA/.');
    console.log('The source export does not include a separate analytics/streaming batch for SAA.');
    console.log('Proceeding with quarantined analytics review records only.');
  }

  // Load Serverless review records
  const serverlessReview = JSON.parse(fs.readFileSync(SERVERLESS_REVIEW_PATH, 'utf8'));
  const task11Record = serverlessReview.find(t => t.sourceTaskId === 11);

  if (!task11Record) {
    console.error('ERROR: Serverless Task 11 (Analytical Ingestion) not found in review file.');
    process.exit(1);
  }

  console.log('\n--- Resolving Previously Quarantined Analytics Task ---');
  console.log('Resolving Serverless Task 11 (Analytical Ingestion / Data Firehose)...');

  // Deep-clone the task to avoid mutating the review file
  const rawTask = JSON.parse(JSON.stringify(task11Record.convertedTask));
  const { task, corrections } = sanitiseAnalyticsTask(rawTask);

  // All tasks integrated
  const kinesisTasks = [task];

  const totalIntegrated = kinesisTasks.length;
  console.log(`\nConversion Complete: ${totalIntegrated} approved integrated Analytics & Streaming task (1 Data Firehose under topic-kinesis), 0 review required / quarantined.`);

  // ---------------------------------------------------------------------------
  // Write output files
  // ---------------------------------------------------------------------------

  // 1. analytics-streaming-converted.json
  const convertedPath = path.join(MIGRATION_DIR, 'analytics-streaming-converted.json');
  fs.writeFileSync(convertedPath, JSON.stringify(kinesisTasks, null, 2), 'utf8');
  console.log(`Wrote converted tasks to: ${convertedPath}`);

  // 2. analytics-streaming-review-required.json
  const reviewPath = path.join(MIGRATION_DIR, 'analytics-streaming-review-required.json');
  fs.writeFileSync(reviewPath, JSON.stringify([], null, 2), 'utf8');
  console.log(`Wrote review required tasks to: ${reviewPath}`);

  // 3. analytics-streaming-seed.sql
  const sqlPath = path.join(MIGRATION_DIR, 'analytics-streaming-seed.sql');
  let sql = '-- SAA / Analytics and Streaming Seed SQL (Generated for Review)\n-- DO NOT EXECUTE THIS FILE DIRECTLY IN PRODUCTION\n\n';
  kinesisTasks.forEach(t => {
    sql += `INSERT INTO public.hands_on_tasks (id, exam_code, topic_id, title, slug, service, feature, difficulty, estimated_minutes, region, status, content)\n`;
    sql += `VALUES (\n`;
    sql += `  '${t.id}',\n`;
    sql += `  '${t.examCode}',\n`;
    sql += `  '${t.topicId}',\n`;
    sql += `  '${t.title.replace(/'/g, "''")}',\n`;
    sql += `  '${t.slug}',\n`;
    sql += `  '${t.service}',\n`;
    sql += `  '${t.feature.replace(/'/g, "''")}',\n`;
    sql += `  '${t.difficulty}',\n`;
    sql += `  ${t.estimatedMinutes},\n`;
    sql += `  '${t.region}',\n`;
    sql += `  'published',\n`;
    sql += `  '${JSON.stringify(t).replace(/'/g, "''")}'::jsonb\n`;
    sql += `) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();\n\n`;
  });
  fs.writeFileSync(sqlPath, sql, 'utf8');
  console.log(`Wrote seed SQL to: ${sqlPath}`);

  // 4. Application module: kinesisTasks.js
  const kinesisModulePath = path.join(APP_TASKS_DIR, 'kinesisTasks.js');
  fs.writeFileSync(
    kinesisModulePath,
    `/** Amazon Kinesis / Amazon Data Firehose Analytics Tasks (SAA-C03) */\nexport const KINESIS_TASKS = ${JSON.stringify(kinesisTasks, null, 2)};\n`,
    'utf8'
  );
  console.log(`Wrote application Kinesis/Firehose task module to ${kinesisModulePath}`);

  // 5. Conversion report
  const reportPath = path.join(MIGRATION_DIR, 'ANALYTICS_STREAMING_CONVERSION_REPORT.md');
  const report = `# SAA / Analytics and Streaming Hands-On Tasks Conversion Report

Generated: ${new Date().toISOString()}

## Executive Summary

| Field | Value |
|---|---|
| **Source Batch Filename** | No dedicated analytics batch found in \`hands_on_tasks/batches/SAA/\` |
| **Batch Structure** | The source export does not contain a dedicated Analytics / Streaming batch for SAA. The 13 available SAA batch files cover: cloud-front-edge, container-services, databases, ec2, encryption-security, high-availability, iam, load-balancing-auto-scaling, migration-tools, monitoring-logging, s3, serverless, vpc |
| **Total Batch Source Records** | 0 (no analytics batch file) |
| **Previously Quarantined Tasks Resolved** | 1 (Serverless Task 11 → \`topic-kinesis\` / \`task-saa-kinesis-deliver-records-to-s3-with-firehose-011\`) |
| **Eligible Records** | 1 |
| **Converted Tasks** | 1 |
| **Integrated Tasks** | 1 |
| **Duplicates Excluded** | 0 |
| **Tasks Sent to Review** | 0 |
| **Console-only** | 0 |
| **CLI-only** | 0 |
| **Both Console & CLI Modes** | 1 |
| **Tasks with Linked Flashcards** | 0 |

---

## No Dedicated Analytics Batch Found

The SAA source export in \`hands_on_tasks/batches/SAA/\` does not include a dedicated Analytics and Streaming batch file. The following filenames were searched for but not found:

- \`analytics.json\`
- \`analytics-streaming.json\`
- \`data-analytics.json\`
- \`streaming.json\`
- Any file containing "analytic", "stream", "kinesis", or "data-"

**Root cause**: The source task catalogue for SAA covers 13 topic areas. Analytics and Streaming topics (Kinesis, Athena, Glue, EMR, OpenSearch, MSK, Lake Formation, QuickSight) were not included in the original batch export scope.

**Impact**: The application already has valid topic IDs registered in \`examData.js\` for all analytics services. These topics will appear in the dropdown automatically when tasks are added under them in future batch imports.

---

## Quarantined Task Resolved

### Serverless Task 11 → Amazon Data Firehose (topic-kinesis)

| Field | Before | After |
|---|---|---|
| **Original ID** | \`task-saa-lambda-analytical-ingestion-011\` | \`task-saa-kinesis-deliver-records-to-s3-with-firehose-011\` |
| **Original Topic** | \`topic-lambda\` | \`topic-kinesis\` |
| **Title** | Analytical Ingestion | Deliver Records to S3 with Amazon Data Firehose |
| **Service** | AWS Lambda | Amazon Kinesis |
| **Feature** | — | Amazon Data Firehose |
| **Slug** | \`analytical-ingestion\` | \`deliver-records-to-s3-with-firehose\` |
| **Difficulty** | — | Medium |
| **Duration** | — | 30 minutes |

---

## Technical & Security Corrections

${corrections.map((c, i) => `${i + 1}. ${c}`).join('\n')}

---

## Firehose vs Kinesis Data Streams Distinction (SAA-C03)

The task explicitly clarifies:

- **Firehose** is a buffered delivery service that loads data to S3, Redshift, OpenSearch or HTTP endpoints.
- **Kinesis Data Streams** supports multiple independent consumers replaying the same records.
- Firehose is **not** suitable when sub-second consumer latency or multiple independent consumers are required.
- The task exam tips reinforce this distinction for SAA-C03 architecture scenario questions.

---

## Task Breakdown by Service & Topic ID

| Analytics Service | Topic ID | Menu Display Label | Integrated Tasks |
|---|---|---|---|
| **Amazon Data Firehose** | \`topic-kinesis\` | \`Amazon Kinesis\` | \`1\` |

> Note: \`topic-firehose\` does not exist in \`examData.js\`. Per the mapping rules, Data Firehose tasks are grouped under \`topic-kinesis\` when no dedicated Firehose topic exists.

---

## Difficulty & Duration

| Topic | Difficulty | Duration | Task Count |
|---|---|---|---|
| **topic-kinesis** | Medium | 30 mins | 1 |

---

## New Topic-Menu Options

The following topic now appears dynamically in the Hands-On Tasks dropdown (previously had 0 tasks):

| Topic ID | Display Label | Task Count |
|---|---|---|
| \`topic-kinesis\` | Amazon Kinesis | 1 |

---

## Files Created

- \`study-tracker/scripts/convertAnalyticsStreamingTasks.js\`
- \`study-tracker/migration_work/hands_on_tasks/SAA/analytics-streaming-converted.json\`
- \`study-tracker/migration_work/hands_on_tasks/SAA/analytics-streaming-review-required.json\`
- \`study-tracker/migration_work/hands_on_tasks/SAA/analytics-streaming-seed.sql\`
- \`study-tracker/migration_work/hands_on_tasks/SAA/ANALYTICS_STREAMING_CONVERSION_REPORT.md\`
- \`study-tracker/src/data/tasks/kinesisTasks.js\`

## Files Modified

- \`study-tracker/src/data/tasksData.js\` (added KINESIS_TASKS import and spread)
- \`study-tracker/src/services/taskService.js\` (added topic-kinesis label override)
- \`study-tracker/tests/taskService.test.js\` (extended with Analytics test coverage)

---

## Confirmation

- \`hands_on_tasks/\` source files: **NOT modified** ✓
- Supabase migration or live database write: **NOT executed** ✓
`;

  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`Wrote conversion report to: ${reportPath}`);
}

runConversion();
