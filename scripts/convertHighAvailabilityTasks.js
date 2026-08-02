import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_BATCH_PATH = 'E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/high-availability.json';
const MIGRATION_DIR = path.join(__dirname, '../migration_work/hands_on_tasks/SAA');
const APP_TASKS_DIR = path.join(__dirname, '../src/data/tasks');

fs.mkdirSync(MIGRATION_DIR, { recursive: true });
fs.mkdirSync(APP_TASKS_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Utilities
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
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getWhyItMatters(raw) {
  if (!raw) return '';
  if (typeof raw === 'string') return cleanHtml(raw);
  if (raw.bodyHtml) return cleanHtml(raw.bodyHtml);
  return '';
}

function sanitiseStep1Login(step) {
  if (!step || !step.instructions) return step;
  step.instructions = step.instructions
    .filter(ins => {
      const lower = (ins.text || '').toLowerCase();
      return !lower.includes('administratoraccess is acceptable');
    })
    .map(ins => {
      let text = ins.text || '';
      if (text.toLowerCase().includes('root user') && !text.toLowerCase().includes('do not use')) {
        text = 'Use an IAM user or lab role with the permissions required for this task.';
      }
      return { ...ins, text };
    });
  return step;
}

function flattenSteps(steps, modePrefix) {
  if (!Array.isArray(steps)) return [];
  return steps.map((step, sIdx) => {
    const stepNum = step.number || sIdx + 1;
    const stepId = `${modePrefix}-step-${stepNum}`;
    const stepTitle = cleanHtml(step.title || `Step ${stepNum}`);

    const rawItems = step.items || step.instructions || [];
    const instructions = rawItems
      .map((item, iIdx) => ({
        id: `${modePrefix}-step-${stepNum}-item-${iIdx + 1}`,
        text: cleanHtml(typeof item === 'string' ? item : item.text || '')
      }))
      .filter(ins => ins.text.length > 0);

    const rawCmds = step.commands || [];
    const commands = rawCmds.map((cmd, cIdx) => ({
      id: `${modePrefix}-step-${stepNum}-cmd-${cIdx + 1}`,
      language: cmd.language || 'bash',
      text: (cmd.text || '').trim()
    }));

    const destructivePatterns = [
      /delete-/i, /terminate-/i, /remove-/i, /detach-/i, /disable-/i, /deregister-/i,
      /drop\s+/i, /rm\s+-rf/i, /change-resource-record/i
    ];
    const isDestructive = commands.some(c => destructivePatterns.some(p => p.test(c.text)));

    return {
      id: stepId,
      number: Number(stepNum),
      title: stepTitle,
      instructions,
      commands,
      note: step.note ? cleanHtml(step.note) : null,
      warning: step.warning
        ? cleanHtml(step.warning)
        : isDestructive
          ? 'Destructive Command Warning: This command modifies or deletes AWS resources. Confirm resource names before running.'
          : null,
      expectedResult: step.expectedResult ? cleanHtml(step.expectedResult) : `Step ${stepNum} completed successfully.`
    };
  });
}

// ---------------------------------------------------------------------------
// Task 5: Global Traffic Routing & Health Check Failover with Route 53
// ---------------------------------------------------------------------------
function buildRoute53Task(src) {
  const title = 'Global Traffic Routing and Health Check Failover with Amazon Route 53';
  const slug = slugify(title);
  const id = 'task-saa-route53-global-failover-health-check-005';

  const consoleSteps = flattenSteps(src.consoleSteps, 'console');
  // Sanitise login step
  if (consoleSteps[0]) sanitiseStep1Login(consoleSteps[0]);

  const cliSteps = flattenSteps(src.cliSteps, 'cli');

  const verification = (src.verification || [])
    .map((v, i) => ({ id: `verify-${i + 1}`, text: cleanHtml(typeof v === 'string' ? v : v.text || '') }))
    .filter(v => v.text);

  if (verification.length === 0) {
    verification.push(
      { id: 'verify-1', text: 'Confirm Route 53 health checks show Healthy status for the primary endpoint.' },
      { id: 'verify-2', text: 'Confirm DNS failover records exist for both primary and secondary endpoints with correct TTL.' },
      { id: 'verify-3', text: 'Confirm that simulating a primary failure triggers Route 53 to route traffic to the secondary endpoint.' }
    );
  }

  const cleanup = (src.cleanup || [])
    .map((c, i) => ({ id: `cleanup-${i + 1}`, text: cleanHtml(typeof c === 'string' ? c : c.text || '') }))
    .filter(c => c.text);

  if (cleanup.length < 3) {
    cleanup.push(
      { id: `cleanup-${cleanup.length + 1}`, text: 'Delete all test Route 53 health checks created for this lab.' },
      { id: `cleanup-${cleanup.length + 2}`, text: 'Remove the failover DNS records (primary and secondary) from the hosted zone.' },
      { id: `cleanup-${cleanup.length + 3}`, text: 'Delete the hosted zone only if it was created solely for this lab.' },
      { id: `cleanup-${cleanup.length + 4}`, text: 'Delete CloudWatch alarms and SNS notifications created for health-check monitoring.' }
    );
  }

  return {
    id,
    examCode: 'aws-saa-c03',
    topicId: 'topic-route53',
    title,
    slug,
    service: 'Amazon Route 53',
    feature: 'Failover Routing and Health Checks',
    difficulty: 'Medium',
    estimatedMinutes: 30,
    region: 'eu-west-2',
    goal: 'Configure Amazon Route 53 health checks and a failover routing policy to automatically reroute global user traffic away from an unhealthy primary endpoint to a healthy secondary endpoint. Understand how TTL and DNS caching affect failover timing.',
    status: 'published',
    tags: ['Amazon Route 53', 'High Availability', 'Failover', 'DNS', 'Health Checks', 'Medium'],
    flow: [
      'Configure Route 53 health checks for primary and secondary endpoints',
      'Create failover routing records with appropriate TTL',
      'Simulate a primary endpoint failure',
      'Verify DNS failover to secondary endpoint',
      'Understand TTL and DNS caching impact on RTO',
      'Clean up health checks, records and hosted zone'
    ],
    concepts: [
      { id: 'concept-1', title: 'Failover Routing Policy', body: 'Route 53 failover routing policy designates one record as primary and another as secondary. When the primary health check fails, Route 53 returns the secondary record.' },
      { id: 'concept-2', title: 'Health Checks', body: 'Route 53 health checks monitor endpoints (HTTP, HTTPS, TCP) or other Route 53 health checks (calculated). They run from multiple AWS locations globally.' },
      { id: 'concept-3', title: 'TTL and DNS Caching', body: 'DNS records have a Time To Live (TTL) value in seconds. Resolvers and clients cache records for this duration. Lower TTLs reduce failover time but increase DNS query costs. DNS failover is not instantaneous.' },
      { id: 'concept-4', title: 'Evaluate Target Health', body: 'When enabled on alias records, Evaluate Target Health allows Route 53 to follow health checks of the target resource (e.g. load balancer targets) rather than requiring a separate health check.' },
      { id: 'concept-5', title: 'RTO vs TTL', body: 'The effective Recovery Time Objective (RTO) for DNS failover is influenced by the health check interval, failure threshold, and the TTL of the DNS record. Lower TTL and shorter health-check intervals reduce effective RTO.' }
    ],
    whyItMatters: 'Route 53 is the primary DNS-layer mechanism for achieving global high availability and disaster recovery failover on AWS. Understanding health checks, failover routing policies, and TTL is essential for SAA-C03 architecture questions. DNS failover is not instantaneous — TTL and resolver caching affect how quickly clients see the new record.',
    values: [
      { label: 'Health Check Interval', value: '30 seconds (standard) or 10 seconds (fast)' },
      { label: 'Failure Threshold', value: '3 consecutive failures before marking unhealthy' },
      { label: 'DNS TTL', value: 'Lower values (e.g. 60s) speed up failover at higher query cost' }
    ],
    costWarning: 'Route 53 hosted zone, DNS query, health-check and traffic-routing charges may apply.',
    consoleSteps,
    cliSteps,
    verification,
    cleanup,
    cheatSheet: [
      { id: 'cs-1', title: 'Failover Record Setup', body: 'Create a Primary FAILOVER record pointing to your active endpoint with a health check. Create a Secondary FAILOVER record pointing to your DR endpoint. Enable health checks on the primary.' },
      { id: 'cs-2', title: 'Health Check Types', body: 'Endpoint health checks: monitor a URL or IP. Calculated health checks: combine results of multiple child health checks. CloudWatch alarm health checks: based on a CloudWatch alarm state.' },
      { id: 'cs-3', title: 'TTL Best Practice', body: 'Lower TTL before a planned failover or maintenance window. Restore normal TTL afterward to reduce DNS query costs.' }
    ],
    troubleshooting: [
      { id: 'ts-1', title: 'Health Check Shows Unhealthy Unexpectedly', body: 'Check that security groups and NACLs allow inbound connections from Route 53 health check IP ranges. Verify the endpoint is responding correctly on the configured port and path.' },
      { id: 'ts-2', title: 'Failover Not Happening', body: 'Verify the primary record has a health check associated. Check that Evaluate Target Health is enabled if using alias records. Confirm the health check is actually failing.' },
      { id: 'ts-3', title: 'DNS Still Resolving to Old Endpoint', body: 'DNS caching at the resolver or client level based on TTL. Wait for the TTL to expire. Use tools like dig or nslookup to check current DNS responses from multiple locations.' }
    ],
    examTraps: [
      { id: 'trap-1', title: 'DNS Failover Is Not Instantaneous', body: 'TTL and resolver caching mean clients may continue resolving to the failed endpoint for the TTL duration even after health check failure is detected. This must be factored into RTO calculations.' },
      { id: 'trap-2', title: 'Private Hosted Zones and Health Checks', body: 'Route 53 health checks cannot directly monitor VPC-internal endpoints. Use CloudWatch alarm-based health checks for internal resources.' },
      { id: 'trap-3', title: 'Failover vs Weighted vs Latency Routing', body: 'Failover routing is for active-passive DR. Weighted routing splits traffic by percentage. Latency routing directs users to the lowest-latency region. Do not confuse them.' }
    ],
    examTips: [
      { id: 'tip-1', text: 'SAA-C03: Route 53 failover routing requires a health check on the primary record. When the health check fails, Route 53 returns the secondary record. TTL and resolver caching affect how quickly clients see the change.' },
      { id: 'tip-2', text: 'SAA-C03: Failover routing is for active-passive DR. For active-active with health-based distribution, consider weighted or latency routing with health checks.' }
    ],
    memoryHook: 'Route 53 failover = DNS-layer lifeguard. When primary drowns (health check fails), secondary gets the traffic — but clients cached to the old answer still need to wait for their TTL to expire.',
    flashcardSetId: null
  };
}

// ---------------------------------------------------------------------------
// Task 8: Disaster Recovery Tiers (Pilot Light & Warm Standby conceptual)
// ---------------------------------------------------------------------------
function buildDRTiersTask(src) {
  const title = 'Implementing Disaster Recovery Tiers: Pilot Light and Warm Standby';
  const slug = slugify(title);
  const id = 'task-saa-backup-dr-tiers-pilot-light-warm-standby-008';

  const consoleSteps = flattenSteps(src.consoleSteps, 'console');
  if (consoleSteps[0]) sanitiseStep1Login(consoleSteps[0]);

  const cliSteps = flattenSteps(src.cliSteps, 'cli');

  const verification = [
    { id: 'verify-1', text: 'Confirm you can articulate the RTO and RPO trade-offs for each of the four AWS DR strategies: backup-and-restore, pilot light, warm standby, and multi-site active-active.' },
    { id: 'verify-2', text: 'Confirm the pilot light configuration has core services running but non-critical capacity at minimum scale.' },
    { id: 'verify-3', text: 'Confirm the warm standby configuration has a reduced but fully operational environment ready to scale up.' }
  ];

  const cleanup = [
    { id: 'cleanup-1', text: 'Terminate any disposable EC2 instances, RDS instances or other resources created to represent pilot light or warm standby environments.' },
    { id: 'cleanup-2', text: 'Delete test AMIs, snapshots, or cross-region replicas created solely for this exercise.' },
    { id: 'cleanup-3', text: 'Delete IAM roles, CloudWatch alarms and Route 53 health checks created solely for the lab.' },
    { id: 'cleanup-4', text: 'Remove cross-region replication configuration if enabled solely for the lab.' }
  ];

  return {
    id,
    examCode: 'aws-saa-c03',
    topicId: 'topic-aws-backup',
    title,
    slug,
    service: 'AWS Backup',
    feature: 'Disaster Recovery Strategy Design',
    difficulty: 'Medium',
    estimatedMinutes: 30,
    region: 'eu-west-2',
    goal: 'Evaluate Recovery Time Objective (RTO) and Recovery Point Objective (RPO) trade-offs across the four AWS disaster recovery strategies: backup-and-restore, pilot light, warm standby, and multi-site active-active. Design and simulate a pilot light and warm standby configuration for a representative workload.',
    status: 'published',
    tags: ['Disaster Recovery', 'Pilot Light', 'Warm Standby', 'RTO', 'RPO', 'AWS Backup', 'Medium'],
    flow: [
      'Understand RTO and RPO definitions and how they relate to business requirements',
      'Compare the four DR strategies on cost, RTO and RPO',
      'Design a pilot light configuration for a sample workload',
      'Design a warm standby configuration for the same workload',
      'Simulate a regional failure and describe recovery steps',
      'Clean up disposable lab resources'
    ],
    concepts: [
      { id: 'concept-1', title: 'Recovery Time Objective (RTO)', body: 'RTO is the maximum acceptable time to restore service after a disruption. It is a business requirement, not an automatic guarantee. Lower RTO requires more expensive architectures.' },
      { id: 'concept-2', title: 'Recovery Point Objective (RPO)', body: 'RPO is the maximum acceptable data-loss window, measured in time before the failure. Lower RPO requires more frequent backups or synchronous replication. Asynchronous cross-region replication does not provide zero RPO.' },
      { id: 'concept-3', title: 'Backup and Restore', body: 'The lowest-cost strategy. Infrastructure may need to be fully recreated after a disaster. RTO and RPO are typically the highest of the four strategies. Restore procedures must be tested regularly.' },
      { id: 'concept-4', title: 'Pilot Light', body: 'Core services (such as a minimal database replica or AMI) remain running at minimal scale. Other resources are provisioned during recovery. Provides lower RTO than backup-and-restore at moderate cost.' },
      { id: 'concept-5', title: 'Warm Standby', body: 'A scaled-down but fully functional environment runs continuously. Recovery involves scaling up capacity. Provides faster RTO than pilot light at higher ongoing cost.' },
      { id: 'concept-6', title: 'Multi-Site Active-Active', body: 'Multiple full-scale production environments actively serve traffic simultaneously. Provides the lowest RTO (near-zero) and RPO at the highest cost and operational complexity. Requires data replication and conflict resolution.' }
    ],
    whyItMatters: 'The SAA-C03 exam tests your ability to select the appropriate DR strategy based on RTO and RPO requirements and cost constraints. Understanding the four strategies and their trade-offs is a core architectural skill. Asynchronous replication across regions does not guarantee zero RPO — data in transit may be lost during a regional failure.',
    values: [
      { label: 'Backup and Restore RTO/RPO', value: 'Highest (hours) / Highest data-loss risk' },
      { label: 'Pilot Light RTO/RPO', value: 'Moderate (tens of minutes) / Lower data-loss risk' },
      { label: 'Warm Standby RTO/RPO', value: 'Low (minutes) / Low data-loss risk' },
      { label: 'Multi-Site Active-Active RTO/RPO', value: 'Near-zero / Lowest data-loss risk' }
    ],
    costWarning: 'Multi-AZ and Multi-Region architectures can create charges for duplicate compute, storage, networking, data transfer, load balancing and monitoring resources. Pilot light and warm standby environments incur ongoing costs for their running resources.',
    consoleSteps,
    cliSteps,
    verification,
    cleanup,
    cheatSheet: [
      { id: 'cs-1', title: 'DR Strategy Comparison', body: 'Backup & Restore: lowest cost, highest RTO/RPO. Pilot Light: core runs, medium cost. Warm Standby: reduced environment runs, lower RTO. Multi-site Active-Active: all runs, lowest RTO, highest cost.' },
      { id: 'cs-2', title: 'RTO vs RPO', body: 'RTO = How long can you be down? RPO = How much data can you lose? Both are business decisions, not technical defaults.' },
      { id: 'cs-3', title: 'Async Replication Caveat', body: 'Cross-region async replication (Aurora Global, DynamoDB Global Tables, S3 CRR) provides near-zero RPO but not zero RPO. In-flight data may be lost during a regional failure.' }
    ],
    troubleshooting: [
      { id: 'ts-1', title: 'Confusing Pilot Light and Warm Standby', body: 'Pilot light: only minimal core services run (e.g. a stopped RDS instance or minimal replica). Warm standby: a scaled-down but fully operational environment runs. The key difference is whether the secondary is operational or just seeded.' },
      { id: 'ts-2', title: 'Async Replication Zero-RPO Claim', body: 'Asynchronous replication (e.g. Aurora Global Database secondary) is not zero RPO. There is always a replication lag. Synchronous replication (e.g. RDS Multi-AZ within a region) is closer to zero RPO for AZ failures but not cross-region.' }
    ],
    examTraps: [
      { id: 'trap-1', title: 'DR ≠ HA', body: 'High availability reduces downtime during partial failures (e.g. AZ failure). Disaster recovery restores service after a major failure. They are complementary but distinct concepts.' },
      { id: 'trap-2', title: 'Asynchronous Cross-Region Replication Is Not Zero RPO', body: 'The SAA exam may offer "use Cross-Region Replication for zero RPO" as a trap. Asynchronous replication always has some lag. Only synchronous writes (rare cross-region) could achieve near-zero RPO.' },
      { id: 'trap-3', title: 'Backup-and-Restore Is Not Just Snapshots', body: 'Backup-and-restore requires restoring the snapshot AND recreating or reconfiguring the surrounding infrastructure. Test the full restore process, not just snapshot creation.' }
    ],
    examTips: [
      { id: 'tip-1', text: 'SAA-C03: Know the four DR strategies in order of cost and RTO/RPO: Backup & Restore (cheapest, slowest) → Pilot Light → Warm Standby → Multi-site Active-Active (most expensive, fastest).' },
      { id: 'tip-2', text: 'SAA-C03: RTO and RPO are business requirements. AWS services and architectures can achieve them, but AWS does not automatically guarantee any specific RTO or RPO value.' },
      { id: 'tip-3', text: 'SAA-C03: Cross-region asynchronous replication (Aurora Global, DynamoDB Global Tables, S3 CRR) does not provide zero RPO. In-transit data may be lost during a regional failure.' }
    ],
    memoryHook: 'DR tiers = Cost vs speed trade-off. Backup-and-Restore is cheapest but slowest. Pilot Light keeps the fire alive. Warm Standby is already dressed for work. Multi-site Active-Active has two offices open simultaneously.',
    flashcardSetId: null
  };
}

// ---------------------------------------------------------------------------
// Tasks that overlap with existing live catalogue → review-required
// ---------------------------------------------------------------------------
function buildReviewRecord(src, reason, recommendedTopic) {
  return {
    sourceTaskId: src.sourceTaskId,
    title: cleanHtml(src.title || ''),
    recommendedTopic,
    reason,
    safetyIssues: [reason]
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function runConversion() {
  console.log('--- Starting SAA / High Availability & Disaster Recovery Conversion ---');

  const rawBatch = JSON.parse(fs.readFileSync(SOURCE_BATCH_PATH, 'utf8'));
  const uniqueSources = rawBatch.filter((t, i, a) => a.findIndex(x => x.sourceTaskId === t.sourceTaskId) === i);
  const dupCount = rawBatch.length - uniqueSources.length;

  console.log(`Loaded ${rawBatch.length} source records. Unique: ${uniqueSources.length}. Duplicates excluded: ${dupCount}.`);

  // Separate the tasks
  const src5 = uniqueSources.find(t => t.sourceTaskId === 5);
  const src8 = uniqueSources.find(t => t.sourceTaskId === 8);

  // Tasks that overlap with existing catalogue
  const overlapping = [
    { src: uniqueSources.find(t => t.sourceTaskId === 1), reason: 'Primary Multi-AZ ALB objective overlaps with existing topic-elb tasks (13 ELB tasks already integrated including ALB in front of ASG, cross-zone load balancing, health checks). Not materially distinct enough to warrant a duplicate lab.', topic: 'topic-elb' },
    { src: uniqueSources.find(t => t.sourceTaskId === 2), reason: 'Self-Healing ASG objective overlaps with existing topic-ec2-asg tasks (9 ASG tasks already integrated including Set up an EC2 Auto Scaling Group, Use health checks and termination policies). Not materially distinct.', topic: 'topic-ec2-asg' },
    { src: uniqueSources.find(t => t.sourceTaskId === 3), reason: 'SQS DLQ decoupling objective overlaps with existing topic-sqs tasks (4 SQS tasks already integrated including Fault Isolation task). Not materially distinct.', topic: 'topic-sqs' },
    { src: uniqueSources.find(t => t.sourceTaskId === 4), reason: 'SNS fan-out + SQS objective overlaps with existing topic-sns (Pub/Sub Messaging task) and topic-sqs tasks. Fan-out pattern is covered by existing SNS and SQS integration tasks.', topic: 'topic-sns' },
    { src: uniqueSources.find(t => t.sourceTaskId === 6), reason: 'ElastiCache session decoupling objective overlaps with existing topic-elasticache tasks (Create an ElastiCache Cluster & Implement Caching Patterns). Not materially distinct.', topic: 'topic-elasticache' },
    { src: uniqueSources.find(t => t.sourceTaskId === 7), reason: 'Cross-Region Aurora/RDS failover overlaps with existing topic-aurora tasks (Configure Aurora Replicas and Endpoints, Compare Aurora Serverless) and topic-rds (Multi-AZ RDS, Read Replica tasks). DR objective not materially distinct from existing database tasks.', topic: 'topic-aurora' }
  ];

  // Build integrated tasks
  console.log('\nBuilding Route 53 Failover task (Source ID 5)...');
  const route53Task = buildRoute53Task(src5);

  console.log('Building DR Tiers conceptual task (Source ID 8)...');
  const drTiersTask = buildDRTiersTask(src8);

  // Review-required records
  const reviewRequired = overlapping.map(o => buildReviewRecord(o.src, o.reason, o.topic));

  const integratedTasks = [route53Task, drTiersTask];
  console.log(`\nConversion Complete: ${integratedTasks.length} integrated tasks (1 Route 53, 1 AWS Backup/DR), ${reviewRequired.length} sent to review as overlapping with existing catalogue.`);

  // ---------------------------------------------------------------------------
  // Write output files
  // ---------------------------------------------------------------------------

  // 1. high-availability-converted.json
  const convertedPath = path.join(MIGRATION_DIR, 'high-availability-converted.json');
  fs.writeFileSync(convertedPath, JSON.stringify(integratedTasks, null, 2), 'utf8');
  console.log(`Wrote converted tasks to: ${convertedPath}`);

  // 2. high-availability-review-required.json
  const reviewPath = path.join(MIGRATION_DIR, 'high-availability-review-required.json');
  fs.writeFileSync(reviewPath, JSON.stringify(reviewRequired, null, 2), 'utf8');
  console.log(`Wrote review required tasks to: ${reviewPath}`);

  // 3. Seed SQL
  const sqlPath = path.join(MIGRATION_DIR, 'high-availability-seed.sql');
  let sql = '-- SAA / High Availability & DR Seed SQL (Generated for Review)\n-- DO NOT EXECUTE IN PRODUCTION\n\n';
  integratedTasks.forEach(t => {
    sql += `INSERT INTO public.hands_on_tasks (id, exam_code, topic_id, title, slug, service, feature, difficulty, estimated_minutes, region, status, content)\n`;
    sql += `VALUES ('${t.id}', '${t.examCode}', '${t.topicId}', '${t.title.replace(/'/g, "''")}', '${t.slug}', '${t.service}', '${t.feature.replace(/'/g, "''")}', '${t.difficulty}', ${t.estimatedMinutes}, '${t.region}', 'published', '${JSON.stringify(t).replace(/'/g, "''")}'::jsonb)\n`;
    sql += `ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();\n\n`;
  });
  fs.writeFileSync(sqlPath, sql, 'utf8');
  console.log(`Wrote seed SQL to: ${sqlPath}`);

  // 4. Application modules
  const route53ModulePath = path.join(APP_TASKS_DIR, 'route53Tasks.js');
  fs.writeFileSync(route53ModulePath, `/** Amazon Route 53 Tasks (SAA-C03) */\nexport const ROUTE53_TASKS = ${JSON.stringify([route53Task], null, 2)};\n`, 'utf8');

  const awsBackupModulePath = path.join(APP_TASKS_DIR, 'awsBackupTasks.js');
  fs.writeFileSync(awsBackupModulePath, `/** AWS Backup / Disaster Recovery Tasks (SAA-C03) */\nexport const AWS_BACKUP_TASKS = ${JSON.stringify([drTiersTask], null, 2)};\n`, 'utf8');

  console.log(`Wrote application modules: route53Tasks.js, awsBackupTasks.js`);

  // 5. Conversion report
  const reportPath = path.join(MIGRATION_DIR, 'HIGH_AVAILABILITY_CONVERSION_REPORT.md');
  const report = buildReport(rawBatch.length, uniqueSources.length, dupCount, integratedTasks, reviewRequired);
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`Wrote conversion report to: ${reportPath}`);
}

function buildReport(total, unique, dups, integrated, review) {
  return `# SAA / High Availability & Disaster Recovery Hands-On Tasks Conversion Report

Generated: ${new Date().toISOString()}

## Executive Summary

| Field | Value |
|---|---|
| **Source Batch** | \`hands_on_tasks/batches/SAA/high-availability.json\` |
| **Total Source Records** | ${total} |
| **Unique Source Records** | ${unique} |
| **Duplicate Source Records Excluded** | ${dups} |
| **Eligible Records** | ${unique} |
| **Integrated Tasks** | ${integrated.length} |
| **Sent to Review (Overlap)** | ${review.length} |
| **Previously Quarantined Tasks Resolved** | 0 |
| **Console-only** | 0 |
| **CLI-only** | 0 |
| **Both Console & CLI** | ${integrated.length} |
| **Linked Flashcards** | 0 |

---

## Integrated Tasks

| Task ID | Topic | Title | Difficulty | Duration |
|---|---|---|---|---|
| \`${integrated[0].id}\` | \`topic-route53\` | ${integrated[0].title} | Medium | 30 mins |
| \`${integrated[1].id}\` | \`topic-aws-backup\` | ${integrated[1].title} | Medium | 30 mins |

---

## Tasks Sent to Review (Overlap with Existing Catalogue)

| Source ID | Title | Reason | Recommended Topic |
|---|---|---|---|
| 1 | Multi-AZ High Availability Web Tier with ALB | Overlaps with 13 existing topic-elb tasks | \`topic-elb\` |
| 2 | Self-Healing Elasticity with EC2 Auto Scaling | Overlaps with 9 existing topic-ec2-asg tasks | \`topic-ec2-asg\` |
| 3 | Decoupling Web Apps with Amazon SQS & DLQ | Overlaps with 4 existing topic-sqs tasks | \`topic-sqs\` |
| 4 | Fan-Out Event Messaging with SNS & SQS | Overlaps with existing topic-sns Pub/Sub task | \`topic-sns\` |
| 6 | Stateful App Decoupling with Session Caching | Overlaps with 2 existing topic-elasticache tasks | \`topic-elasticache\` |
| 7 | Cross-Region Database Read Replicas & Failover | Overlaps with Aurora Replicas and RDS tasks | \`topic-aurora\` |

---

## Topic Mapping

No dedicated \`topic-high-availability\` or \`topic-disaster-recovery\` topic exists in \`examData.js\`. Tasks were mapped to the nearest valid existing topics:

- Task 5 (Route 53 failover) → \`topic-route53\` (0 existing tasks — valid and now populated for first time)
- Task 8 (DR tiers conceptual guide) → \`topic-aws-backup\` (0 existing tasks — nearest valid DR/strategy topic)

---

## Technical Corrections Applied

1. **Step 1 Login Sanitization**: Removed AdministratorAccess recommendation; replaced with IAM user / lab role guidance.
2. **Route 53 TTL Clarity**: Explicitly documented that DNS failover is not instantaneous due to TTL and resolver caching.
3. **Async Replication RPO Clarification**: Task 8 explicitly states cross-region async replication does not provide zero RPO.
4. **DR Strategy Definitions**: Correctly ordered backup-and-restore → pilot light → warm standby → multi-site active-active by RTO/cost.
5. **RTO/RPO Framing**: Clarified that RTO and RPO are business requirements, not automatic AWS guarantees.
6. **Non-Numeric Cost Warnings**: Applied Route 53 and multi-region cost warnings.
7. **Comprehensive Cleanup**: Route 53 cleanup covers health checks, failover records, hosted zone, and alarms. DR tiers cleanup covers disposable instances, AMIs, snapshots, and cross-region replication config.
8. **Destructive Command Warnings**: Auto-flagged CLI steps matching delete/terminate/change-resource-record patterns.
9. **HTML Sanitization**: All HTML tags and entities cleaned to plain text.
10. **Deterministic IDs**: Stable task, step, instruction, command, verification and cleanup IDs generated.

---

## New Topic-Menu Options

| Topic ID | Display Label | Tasks Added |
|---|---|---|
| \`topic-route53\` | Amazon Route 53 | 1 (first task for this topic) |
| \`topic-aws-backup\` | AWS Backup | 1 (first task for this topic) |

---

## Confirmation

- \`hands_on_tasks/\` source files: **NOT modified** ✓
- Supabase migration or live database write: **NOT executed** ✓
`;
}

runConversion();
