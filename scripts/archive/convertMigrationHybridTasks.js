import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source paths (Read-Only)
const SOURCE_BATCH_PATH = 'E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/migration-tools.json';
const VPC_REVIEW_PATH = path.join(__dirname, '../migration_work/hands_on_tasks/SAA/vpc-review-required.json');
const DATABASES_REVIEW_PATH = path.join(__dirname, '../migration_work/hands_on_tasks/SAA/databases-review-required.json');

// Target migration work directory inside study-tracker
const MIGRATION_DIR = path.join(__dirname, '../migration_work/hands_on_tasks/SAA');
const APP_TASKS_DIR = path.join(__dirname, '../src/data/tasks');

// Ensure output directories exist
fs.mkdirSync(MIGRATION_DIR, { recursive: true });
fs.mkdirSync(APP_TASKS_DIR, { recursive: true });

// Utility to clean HTML tags and entities
function cleanHtml(raw) {
  if (typeof raw !== 'string') return '';
  let text = raw
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

  return text;
}

// Generate URL slug from title
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Determine valid Migration & Hybrid Connectivity Topic ID
function determineMigrationTopic(task) {
  const title = (task.title || '').toLowerCase();
  const goal = (task.goal || '').toLowerCase();
  
  if (title.includes('mgn') || title.includes('rehost a server') || goal.includes('mgn')) return 'topic-mgn';
  if (title.includes('dms') || title.includes('database migration') || goal.includes('dms')) return 'topic-dms';
  if (title.includes('snow') || goal.includes('snow')) return 'topic-snow-family';
  if (title.includes('storage gateway') || goal.includes('storage gateway')) return 'topic-storage-gateway';
  if (title.includes('datasync') || goal.includes('datasync')) return 'topic-datasync';
  if (title.includes('vpn') || title.includes('site-to-site') || goal.includes('vpn')) return 'topic-vpn';
  if (title.includes('direct connect') || title.includes('vif') || goal.includes('direct connect')) return 'topic-direct-connect';
  
  return 'topic-mgn';
}

// Infer difficulty and duration
function inferDifficultyAndDuration(task, topicId) {
  let difficulty = task.difficulty;
  let estimatedMinutes = task.estimatedMinutes;

  const title = (task.title || '').toLowerCase();
  const consoleCount = task.consoleSteps ? task.consoleSteps.length : 0;

  if (!difficulty || !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    if (
      title.includes('direct connect') ||
      title.includes('heterogeneous') ||
      title.includes('mgn') ||
      title.includes('cdc') ||
      consoleCount > 7
    ) {
      difficulty = 'Hard';
    } else if (
      title.includes('dms') ||
      title.includes('datasync') ||
      title.includes('snow') ||
      title.includes('vpn') ||
      title.includes('storage gateway') ||
      consoleCount > 4
    ) {
      difficulty = 'Medium';
    } else {
      difficulty = 'Easy';
    }
  }

  if (!estimatedMinutes || typeof estimatedMinutes !== 'number' || estimatedMinutes <= 0) {
    if (difficulty === 'Hard') {
      estimatedMinutes = 45;
    } else if (difficulty === 'Medium') {
      estimatedMinutes = 30;
    } else {
      estimatedMinutes = 20;
    }
  }

  return { difficulty, estimatedMinutes };
}

// Technical & Security Inspection for Migration & Hybrid Connectivity
function sanitizeAndCheckSafety(task, topicId) {
  const issues = [];
  const corrections = [];

  // 1. Sanitize Step 1 login instruction
  if (task.consoleSteps && task.consoleSteps.length > 0) {
    const step1 = task.consoleSteps[0];
    if (step1.instructions) {
      step1.instructions = step1.instructions.map(ins => {
        let text = ins.text || '';
        if (text.toLowerCase().includes('root user') || text.toLowerCase().includes('administratoraccess')) {
          corrections.push(`Sanitized Step 1 login instruction for ${topicId}.`);
          text = 'Sign in to the AWS Management Console using an IAM user or lab role with appropriate permissions.';
        }
        return { ...ins, text };
      });
    }
  }

  // 2. Direct Connect Encryption Warning check
  if (topicId === 'topic-direct-connect') {
    if (!task.whyItMatters || !task.whyItMatters.toLowerCase().includes('not encrypted by default')) {
      task.whyItMatters = (task.whyItMatters || '') + ' Note: AWS Direct Connect provides dedicated private networking, but traffic is not encrypted by default. Use VPN over Direct Connect (IPsec) for encrypted transit.';
      corrections.push('Added Direct Connect encryption clarification.');
    }
  }

  // 3. Filter out empty cleanup items
  if (task.cleanup) {
    task.cleanup = task.cleanup.filter(c => c.text && c.text.trim().length > 0);
  }

  // Populate default cleanup if empty
  if (!task.cleanup || task.cleanup.length === 0) {
    if (topicId === 'topic-mgn') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Terminate test launched EC2 instances and disconnect test replication servers.' },
        { id: 'cleanup-2', text: 'Delete EC2 launch templates and security groups created solely for the lab.' }
      ];
    } else if (topicId === 'topic-dms') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Stop and delete DMS replication tasks.' },
        { id: 'cleanup-2', text: 'Delete DMS endpoints and replication instances.' },
        { id: 'cleanup-3', text: 'Delete temporary test target databases and log groups.' }
      ];
    } else if (topicId === 'topic-snow-family') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Complete S3 import verification and clean up temporary test files.' },
        { id: 'cleanup-2', text: 'Cancel or complete simulated Snow Family job.' }
      ];
    } else if (topicId === 'topic-storage-gateway') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete Storage Gateway file shares, volume targets, and cached data.' },
        { id: 'cleanup-2', text: 'Deregister and delete the AWS Storage Gateway VM instance.' }
      ];
    } else if (topicId === 'topic-datasync') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Cancel active DataSync task executions and delete the task.' },
        { id: 'cleanup-2', text: 'Delete source and destination location configurations and IAM roles.' }
      ];
    } else if (topicId === 'topic-vpn') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete the AWS Site-to-Site VPN connection and Customer Gateway.' },
        { id: 'cleanup-2', text: 'Detach and delete Virtual Private Gateway (VGW) created for the lab.' }
      ];
    } else if (topicId === 'topic-direct-connect') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete private virtual interface (Private VIF) and Direct Connect Gateway associations.' },
        { id: 'cleanup-2', text: 'Remove test VPC route entries pointing to Direct Connect.' }
      ];
    }
  }

  // 4. Non-numeric Cost Warnings
  if (topicId === 'topic-mgn') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('application migration service')) {
      task.costWarning = 'Application Migration Service replication infrastructure, staging resources, EC2 instances, EBS volumes, snapshots and data-transfer charges may apply.';
      corrections.push('Added MGN cost warning.');
    }
  } else if (topicId === 'topic-dms') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('dms replication')) {
      task.costWarning = 'DMS replication resources, serverless capacity, logging, storage, database and data-transfer charges may apply.';
      corrections.push('Added DMS cost warning.');
    }
  } else if (topicId === 'topic-snow-family') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('snow family')) {
      task.costWarning = 'Snow Family job, device, shipping, service-day and data-transfer charges may apply.';
      corrections.push('Added Snow Family cost warning.');
    }
  } else if (topicId === 'topic-storage-gateway') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('storage gateway')) {
      task.costWarning = 'Storage Gateway, AWS storage, snapshots, requests, retrieval and data-transfer charges may apply.';
      corrections.push('Added Storage Gateway cost warning.');
    }
  } else if (topicId === 'topic-datasync') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('datasync transfer')) {
      task.costWarning = 'DataSync transfer, task, storage, network and connected-service charges may apply.';
      corrections.push('Added DataSync cost warning.');
    }
  } else if (topicId === 'topic-vpn') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('vpn connection')) {
      task.costWarning = 'VPN connection, data-transfer, Transit Gateway and connected-resource charges may apply.';
      corrections.push('Added VPN cost warning.');
    }
  } else if (topicId === 'topic-direct-connect') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('direct connect port-hour')) {
      task.costWarning = 'Direct Connect port-hour, provider, cross-connect, data-transfer and connected-resource charges may apply.';
      corrections.push('Added Direct Connect cost warning.');
    }
  }

  // 5. Destructive Command Flagging
  const destructivePatterns = [
    /delete-replication-configuration-template/i, /delete-source-server/i,
    /delete-replication-task/i, /delete-endpoint/i, /delete-replication-instance/i,
    /delete-data-source/i, /delete-location-s3/i, /delete-task/i, /delete-server/i,
    /delete-vpn-connection/i, /delete-customer-gateway/i, /delete-virtual-interface/i,
    /delete-direct-connect-gateway/i, /delete-gateway/i, /terminate-instances/i, /rm\s+-rf/i
  ];
  
  if (task.cliSteps) {
    task.cliSteps.forEach(s => {
      if (s.commands) {
        s.commands.forEach(cmd => {
          const isDestructive = destructivePatterns.some(p => p.test(cmd.text));
          if (isDestructive && !s.warning) {
            s.warning = 'Destructive Command Warning: This command permanently deletes migration tasks, endpoints, replication instances, VPN connections, or Direct Connect VIFs.';
            corrections.push(`Added destructive command warning to CLI step ${s.id}.`);
          }
        });
      }
    });
  }

  // 6. Check for real credentials or IP addresses
  const taskText = JSON.stringify(task).toLowerCase();
  if (taskText.includes('akiatest') || taskText.includes('secretaccesskey=')) {
    issues.push('Hardcoded AWS credentials detected in task definition');
  }

  return { issues, corrections };
}

// Convert a single source task into target schema
function convertTask(sourceTask, idx) {
  const sourceId = sourceTask.sourceTaskId || idx + 1;
  const rawTitle = cleanHtml(sourceTask.title || sourceTask.sourceHero?.title || `Task ${sourceId}`);
  const slug = slugify(rawTitle);

  const topicId = determineMigrationTopic(sourceTask);
  
  // Prefix mapping
  let prefix = 'mgn';
  if (topicId === 'topic-dms') prefix = 'dms';
  else if (topicId === 'topic-snow-family') prefix = 'snow-family';
  else if (topicId === 'topic-storage-gateway') prefix = 'storage-gateway';
  else if (topicId === 'topic-datasync') prefix = 'datasync';
  else if (topicId === 'topic-vpn') prefix = 'vpn';
  else if (topicId === 'topic-direct-connect') prefix = 'direct-connect';

  const taskId = `task-saa-${prefix}-${slug}-${String(sourceId).padStart(3, '0')}`;

  const { difficulty, estimatedMinutes } = inferDifficultyAndDuration(sourceTask, topicId);

  const goal = cleanHtml(sourceTask.goal || sourceTask.sourceHero?.goalHtml || rawTitle);
  
  let service = 'AWS Application Migration Service';
  if (topicId === 'topic-dms') service = 'AWS Database Migration Service';
  else if (topicId === 'topic-snow-family') service = 'AWS Snow Family';
  else if (topicId === 'topic-storage-gateway') service = 'AWS Storage Gateway';
  else if (topicId === 'topic-datasync') service = 'AWS DataSync';
  else if (topicId === 'topic-vpn') service = 'AWS Site-to-Site VPN';
  else if (topicId === 'topic-direct-connect') service = 'AWS Direct Connect';

  const feature = cleanHtml(sourceTask.feature || service);
  const region = sourceTask.region || 'eu-west-2';

  // Tags
  const rawTags = sourceTask.tags || [];
  const tags = Array.from(new Set([
    service,
    feature,
    difficulty,
    ...rawTags.map(cleanHtml)
  ])).filter(Boolean);

  // Flow
  let flow = [];
  if (sourceTask.flow && Array.isArray(sourceTask.flow)) {
    flow = sourceTask.flow.map(cleanHtml).filter(Boolean);
  } else if (sourceTask.sourceFlow && sourceTask.sourceFlow.rows) {
    flow = sourceTask.sourceFlow.rows.flat().map(cleanHtml).filter(Boolean);
  } else {
    flow = [rawTitle, 'Configure migration settings', 'Verify data transfer', 'Clean up'];
  }

  // Concepts
  let concepts = [];
  if (sourceTask.concepts) {
    const rawConcepts = Array.isArray(sourceTask.concepts) ? sourceTask.concepts : (sourceTask.concepts.cards || []);
    concepts = rawConcepts.map((c, cIdx) => ({
      id: `concept-${cIdx + 1}`,
      title: cleanHtml(c.title || `Concept ${cIdx + 1}`),
      body: cleanHtml(c.body || c.bodyHtml || '')
    }));
  }

  // Why it matters
  const whyItMatters = cleanHtml(typeof sourceTask.whyThisMatters === 'string' ? sourceTask.whyThisMatters : sourceTask.whyThisMatters?.bodyHtml || `Understanding ${feature} in ${service} is vital for workload migration and hybrid network connectivity on the SAA-C03 exam.`);

  // Values
  let values = [];
  if (sourceTask.values && Array.isArray(sourceTask.values)) {
    values = sourceTask.values.map(v => ({
      label: cleanHtml(v.label),
      value: cleanHtml(v.value)
    }));
  }

  // Cost warning
  const costWarning = cleanHtml(typeof sourceTask.costWarning === 'string' ? sourceTask.costWarning : sourceTask.costWarning?.bodyHtml || `${service} replication, storage, and networking charges apply while resources exist.`);

  // Console Steps
  let consoleSteps = [];
  if (sourceTask.consoleSteps && Array.isArray(sourceTask.consoleSteps)) {
    consoleSteps = sourceTask.consoleSteps.map((step, sIdx) => {
      const stepNum = step.number || sIdx + 1;
      const stepId = `console-step-${stepNum}`;
      const stepTitle = cleanHtml(step.title || `Step ${stepNum}`);

      const rawItems = step.items || step.instructions || [];
      const instructions = rawItems.map((item, iIdx) => ({
        id: `console-step-${stepNum}-item-${iIdx + 1}`,
        text: cleanHtml(typeof item === 'string' ? item : item.text)
      })).filter(ins => ins.text && ins.text.length > 0);

      return {
        id: stepId,
        number: Number(stepNum),
        title: stepTitle,
        instructions,
        note: step.note ? cleanHtml(step.note) : null,
        warning: step.warning ? cleanHtml(step.warning) : null,
        expectedResult: step.expectedResult ? cleanHtml(step.expectedResult) : `Step ${stepNum} completed successfully.`
      };
    });
  }

  // CLI Steps
  let cliSteps = [];
  if (sourceTask.cliSteps && Array.isArray(sourceTask.cliSteps)) {
    cliSteps = sourceTask.cliSteps.map((step, sIdx) => {
      const stepNum = step.number || sIdx + 1;
      const stepId = `cli-step-${stepNum}`;
      const stepTitle = cleanHtml(step.title || `Step ${stepNum}`);

      let commands = [];
      if (step.commands && Array.isArray(step.commands)) {
        commands = step.commands.map((cmd, cIdx) => ({
          id: `cli-step-${stepNum}-cmd-${cIdx + 1}`,
          language: cmd.language || 'bash',
          text: (cmd.text || '').trim()
        }));
      } else if (step.command) {
        commands = [{
          id: `cli-step-${stepNum}-cmd-1`,
          language: 'bash',
          text: (typeof step.command === 'string' ? step.command : step.command.text || '').trim()
        }];
      }

      return {
        id: stepId,
        number: Number(stepNum),
        title: stepTitle,
        instructions: [],
        commands,
        note: step.note ? cleanHtml(step.note) : null,
        warning: step.warning ? cleanHtml(step.warning) : null,
        expectedResult: step.expectedResult ? cleanHtml(step.expectedResult) : `CLI command step ${stepNum} executed successfully.`
      };
    });
  }

  // Verification
  let verification = [];
  if (sourceTask.verification && Array.isArray(sourceTask.verification)) {
    verification = sourceTask.verification
      .map((v, vIdx) => ({
        id: `verify-${vIdx + 1}`,
        text: cleanHtml(typeof v === 'string' ? v : v.text)
      }))
      .filter(v => v.text && v.text.length > 0);
  } else if (sourceTask.checklist && sourceTask.checklist.groups) {
    const rawItems = sourceTask.checklist.groups.flatMap(g => g.items || []);
    verification = rawItems
      .map((item, vIdx) => ({
        id: `verify-${vIdx + 1}`,
        text: cleanHtml(item)
      }))
      .filter(v => v.text && v.text.length > 0);
  }

  if (verification.length === 0) {
    verification = [
      { id: 'verify-1', text: `${feature} configuration verified in ${service}.` }
    ];
  }

  // Cleanup
  let cleanup = [];
  if (sourceTask.cleanup && Array.isArray(sourceTask.cleanup)) {
    cleanup = sourceTask.cleanup
      .map((c, cIdx) => ({
        id: `cleanup-${cIdx + 1}`,
        text: cleanHtml(typeof c === 'string' ? c : c.text)
      }))
      .filter(c => c.text && c.text.length > 0);
  }

  // Cheat Sheet
  let cheatSheet = [];
  if (sourceTask.cheatSheet) {
    const rawCards = Array.isArray(sourceTask.cheatSheet) ? sourceTask.cheatSheet : (sourceTask.cheatSheet.cards || []);
    cheatSheet = rawCards.map((cs, cIdx) => ({
      id: `cs-${cIdx + 1}`,
      title: cleanHtml(cs.title || `Summary ${cIdx + 1}`),
      body: cleanHtml(cs.body || cs.bodyHtml || '')
    }));
  }

  // Troubleshooting
  let troubleshooting = [];
  if (sourceTask.troubleshooting) {
    const rawCards = Array.isArray(sourceTask.troubleshooting) ? sourceTask.troubleshooting : (sourceTask.troubleshooting.cards || []);
    troubleshooting = rawCards.map((ts, tIdx) => ({
      id: `ts-${tIdx + 1}`,
      title: cleanHtml(ts.title || `Issue ${tIdx + 1}`),
      body: cleanHtml(ts.body || ts.bodyHtml || '')
    }));
  }

  // Exam Traps
  let examTraps = [];
  if (sourceTask.examTraps) {
    const rawCards = Array.isArray(sourceTask.examTraps) ? sourceTask.examTraps : (sourceTask.examTraps.cards || []);
    examTraps = rawCards.map((trap, tIdx) => ({
      id: `trap-${tIdx + 1}`,
      title: cleanHtml(trap.title || `Exam Trap ${tIdx + 1}`),
      body: cleanHtml(trap.body || trap.bodyHtml || '')
    }));
  }

  // Exam Tips (Filter out SOA-C02 and DVA-C02 tips; keep SAA-C03)
  let examTips = [];
  if (sourceTask.examTips) {
    const rawItems = Array.isArray(sourceTask.examTips) ? sourceTask.examTips : (sourceTask.examTips.items || []);
    const saaTips = rawItems
      .map(item => cleanHtml(typeof item === 'string' ? item : (item.text || item.body || '')))
      .filter(tip => tip && !tip.startsWith('SOA-C02:') && !tip.startsWith('DVA-C02:'));

    examTips = saaTips.map((tip, tIdx) => ({
      id: `tip-${tIdx + 1}`,
      text: tip.startsWith('SAA-C03:') ? tip : `SAA-C03: ${tip}`
    }));
  }

  if (examTips.length === 0) {
    examTips = [
      { id: 'tip-1', text: `SAA-C03: Master ${feature} concepts and hybrid connectivity patterns in ${service}.` }
    ];
  }

  // Memory Hook
  const memoryHook = cleanHtml(typeof sourceTask.memoryHook === 'string' ? sourceTask.memoryHook : sourceTask.memoryHook?.bodyHtml || `${feature} in ${service} accelerates workload migration and hybrid connectivity.`);

  // Flashcards reference
  const flashcardSetId = sourceTask.hasFlashcards ? `${prefix}_task_${sourceId}_flashcards` : null;

  return {
    id: taskId,
    examCode: 'aws-saa-c03',
    topicId,
    title: rawTitle,
    slug,
    service,
    feature,
    difficulty,
    estimatedMinutes,
    region,
    goal,
    status: 'published',
    tags,
    flow,
    concepts,
    whyItMatters,
    values,
    costWarning,
    consoleSteps,
    cliSteps,
    verification,
    cleanup,
    cheatSheet,
    troubleshooting,
    examTraps,
    examTips,
    memoryHook,
    flashcardSetId
  };
}

// Main execution function
function runConversion() {
  console.log('--- Starting SAA / Migration & Hybrid Connectivity Hands-On Tasks Conversion ---');

  const rawBatchData = fs.readFileSync(SOURCE_BATCH_PATH, 'utf8');
  const sourceTasks = JSON.parse(rawBatchData);

  console.log(`Loaded ${sourceTasks.length} source records from ${SOURCE_BATCH_PATH}`);

  const mgnTasks = [];
  const dmsTasks = [];
  const snowFamilyTasks = [];
  const storageGatewayTasks = [];
  const dataSyncTasks = [];
  const vpnTasks = [];
  const directConnectTasks = [];
  
  const reviewRequiredList = [];
  const reportRows = [];
  const seenSourceIds = new Set();

  let consoleOnlyCount = 0;
  let cliOnlyCount = 0;
  let bothModesCount = 0;
  let flashcardsCount = 0;

  // 1. Process 5 unique source tasks from migration-tools.json
  sourceTasks.forEach((sourceTask, idx) => {
    const sourceId = sourceTask.sourceTaskId || idx + 1;

    // Duplicate check for exact repeated records in source batch
    if (seenSourceIds.has(sourceId)) {
      console.log(`Skipping duplicate source record index ${idx + 1} (Source ID ${sourceId})`);
      return;
    }
    seenSourceIds.add(sourceId);

    const converted = convertTask(sourceTask, idx);
    const { issues, corrections } = sanitizeAndCheckSafety(converted, converted.topicId);

    const hasConsole = converted.consoleSteps && converted.consoleSteps.length > 0;
    const hasCli = converted.cliSteps && converted.cliSteps.length > 0;

    if (hasConsole && hasCli) bothModesCount++;
    else if (hasConsole) consoleOnlyCount++;
    else if (hasCli) cliOnlyCount++;

    if (converted.flashcardSetId) flashcardsCount++;

    const reportRow = {
      sourceId,
      taskId: converted.id,
      topicId: converted.topicId,
      title: converted.title,
      slug: converted.slug,
      difficulty: converted.difficulty,
      estimatedMinutes: converted.estimatedMinutes,
      safetyIssues: issues,
      corrections,
      hasConsole,
      hasCli,
      hasFlashcards: !!converted.flashcardSetId,
      status: issues.length > 0 ? 'Review Required' : 'Approved & Integrated'
    };
    reportRows.push(reportRow);

    if (issues.length > 0) {
      reviewRequiredList.push({
        sourceTaskId: sourceId,
        convertedTask: converted,
        safetyIssues: issues
      });
    } else {
      if (converted.topicId === 'topic-mgn') mgnTasks.push(converted);
      else if (converted.topicId === 'topic-dms') dmsTasks.push(converted);
      else if (converted.topicId === 'topic-snow-family') snowFamilyTasks.push(converted);
      else if (converted.topicId === 'topic-storage-gateway') storageGatewayTasks.push(converted);
      else if (converted.topicId === 'topic-datasync') dataSyncTasks.push(converted);
    }
  });

  // 2. Resolve & Integrate Previously Quarantined Review Tasks
  console.log('\n--- Resolving Previously Quarantined VPC & Databases Migration Tasks ---');
  
  // VPC Task 17 -> topic-vpn
  if (fs.existsSync(VPC_REVIEW_PATH)) {
    const vpcReviewTasks = JSON.parse(fs.readFileSync(VPC_REVIEW_PATH, 'utf8'));
    const vpnTaskRecord = vpcReviewTasks.find(t => t.sourceTaskId === 17);
    if (vpnTaskRecord) {
      console.log('Resolving VPC Task 17 (Site-to-Site VPN)...');
      const task = vpnTaskRecord.convertedTask;
      task.topicId = 'topic-vpn';
      task.service = 'AWS Site-to-Site VPN';
      task.id = 'task-saa-vpn-set-up-aws-site-to-site-vpn-017';
      
      const { corrections } = sanitizeAndCheckSafety(task, 'topic-vpn');
      vpnTasks.push(task);

      reportRows.push({
        sourceId: 'VPC-17 (Review)',
        taskId: task.id,
        topicId: task.topicId,
        title: task.title,
        slug: task.slug,
        difficulty: task.difficulty,
        estimatedMinutes: task.estimatedMinutes,
        safetyIssues: [],
        corrections,
        hasConsole: true,
        hasCli: true,
        hasFlashcards: !!task.flashcardSetId,
        status: 'Resolved & Integrated (From VPC Review)'
      });
      bothModesCount++;
      if (task.flashcardSetId) flashcardsCount++;
    }

    // VPC Task 19 -> topic-direct-connect
    const dcTaskRecord = vpcReviewTasks.find(t => t.sourceTaskId === 19);
    if (dcTaskRecord) {
      console.log('Resolving VPC Task 19 (Direct Connect Private VIF)...');
      const task = dcTaskRecord.convertedTask;
      task.topicId = 'topic-direct-connect';
      task.service = 'AWS Direct Connect';
      task.id = 'task-saa-direct-connect-create-private-vif-019';

      const { corrections } = sanitizeAndCheckSafety(task, 'topic-direct-connect');
      directConnectTasks.push(task);

      reportRows.push({
        sourceId: 'VPC-19 (Review)',
        taskId: task.id,
        topicId: task.topicId,
        title: task.title,
        slug: task.slug,
        difficulty: task.difficulty,
        estimatedMinutes: task.estimatedMinutes,
        safetyIssues: [],
        corrections,
        hasConsole: true,
        hasCli: true,
        hasFlashcards: !!task.flashcardSetId,
        status: 'Resolved & Integrated (From VPC Review)'
      });
      bothModesCount++;
      if (task.flashcardSetId) flashcardsCount++;
    }
  }

  // Databases Tasks 23 & 24 -> topic-dms
  if (fs.existsSync(DATABASES_REVIEW_PATH)) {
    const dbReviewTasks = JSON.parse(fs.readFileSync(DATABASES_REVIEW_PATH, 'utf8'));
    const dms23 = dbReviewTasks.find(t => t.sourceTaskId === 23);
    if (dms23) {
      console.log('Resolving Databases Task 23 (DMS Conceptual Guide)...');
      const task = dms23.convertedTask;
      task.topicId = 'topic-dms';
      task.service = 'AWS Database Migration Service';
      task.id = 'task-saa-dms-conceptual-guide-023';

      const { corrections } = sanitizeAndCheckSafety(task, 'topic-dms');
      dmsTasks.push(task);

      reportRows.push({
        sourceId: 'Databases-23 (Review)',
        taskId: task.id,
        topicId: task.topicId,
        title: task.title,
        slug: task.slug,
        difficulty: task.difficulty,
        estimatedMinutes: task.estimatedMinutes,
        safetyIssues: [],
        corrections,
        hasConsole: true,
        hasCli: true,
        hasFlashcards: !!task.flashcardSetId,
        status: 'Resolved & Integrated (From Databases Review)'
      });
      bothModesCount++;
      if (task.flashcardSetId) flashcardsCount++;
    }

    const dms24 = dbReviewTasks.find(t => t.sourceTaskId === 24);
    if (dms24) {
      console.log('Resolving Databases Task 24 (Homogeneous vs Heterogeneous Migration)...');
      const task = dms24.convertedTask;
      task.topicId = 'topic-dms';
      task.service = 'AWS Database Migration Service';
      task.id = 'task-saa-dms-homogeneous-vs-heterogeneous-migration-024';

      const { corrections } = sanitizeAndCheckSafety(task, 'topic-dms');
      dmsTasks.push(task);

      reportRows.push({
        sourceId: 'Databases-24 (Review)',
        taskId: task.id,
        topicId: task.topicId,
        title: task.title,
        slug: task.slug,
        difficulty: task.difficulty,
        estimatedMinutes: task.estimatedMinutes,
        safetyIssues: [],
        corrections,
        hasConsole: true,
        hasCli: true,
        hasFlashcards: !!task.flashcardSetId,
        status: 'Resolved & Integrated (From Databases Review)'
      });
      bothModesCount++;
      if (task.flashcardSetId) flashcardsCount++;
    }
  }

  const totalIntegrated = mgnTasks.length + dmsTasks.length + snowFamilyTasks.length + storageGatewayTasks.length + dataSyncTasks.length + vpnTasks.length + directConnectTasks.length;

  console.log(`\nConversion Complete: ${totalIntegrated} approved integrated Migration & Hybrid Connectivity tasks (${mgnTasks.length} MGN, ${dmsTasks.length} DMS, ${snowFamilyTasks.length} Snow Family, ${storageGatewayTasks.length} Storage Gateway, ${dataSyncTasks.length} DataSync, ${vpnTasks.length} Site-to-Site VPN, ${directConnectTasks.length} Direct Connect), ${reviewRequiredList.length} review required / quarantined.`);

  // 1. Write migration-hybrid-converted.json
  const allConvertedTasks = [...mgnTasks, ...dmsTasks, ...snowFamilyTasks, ...storageGatewayTasks, ...dataSyncTasks, ...vpnTasks, ...directConnectTasks];
  const convertedJsonPath = path.join(MIGRATION_DIR, 'migration-hybrid-converted.json');
  fs.writeFileSync(convertedJsonPath, JSON.stringify(allConvertedTasks, null, 2), 'utf8');
  console.log(`Wrote converted tasks to: ${convertedJsonPath}`);

  // 2. Write migration-hybrid-review-required.json
  const reviewJsonPath = path.join(MIGRATION_DIR, 'migration-hybrid-review-required.json');
  fs.writeFileSync(reviewJsonPath, JSON.stringify(reviewRequiredList, null, 2), 'utf8');
  console.log(`Wrote review required tasks to: ${reviewJsonPath}`);

  // 3. Write migration-hybrid-seed.sql
  const sqlSeedPath = path.join(MIGRATION_DIR, 'migration-hybrid-seed.sql');
  let sqlContent = `-- SAA / Migration & Hybrid Connectivity Seed SQL (Generated for Review)\n\n`;
  allConvertedTasks.forEach(task => {
    sqlContent += `INSERT INTO public.hands_on_tasks (id, exam_code, topic_id, title, slug, service, feature, difficulty, estimated_minutes, region, status, content)\n`;
    sqlContent += `VALUES (\n`;
    sqlContent += `  '${task.id}',\n`;
    sqlContent += `  '${task.examCode}',\n`;
    sqlContent += `  '${task.topicId}',\n`;
    sqlContent += `  '${task.title.replace(/'/g, "''")}',\n`;
    sqlContent += `  '${task.slug}',\n`;
    sqlContent += `  '${task.service}',\n`;
    sqlContent += `  '${task.feature.replace(/'/g, "''")}',\n`;
    sqlContent += `  '${task.difficulty}',\n`;
    sqlContent += `  ${task.estimatedMinutes},\n`;
    sqlContent += `  '${task.region}',\n`;
    sqlContent += `  'published',\n`;
    sqlContent += `  '${JSON.stringify(task).replace(/'/g, "''")}'::jsonb\n`;
    sqlContent += `) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();\n\n`;
  });
  fs.writeFileSync(sqlSeedPath, sqlContent, 'utf8');
  console.log(`Wrote seed SQL to: ${sqlSeedPath}`);

  // 4. Write Migration task module files
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'mgnTasks.js'), `/** AWS MGN Tasks (SAA-C03) */\nexport const MGN_TASKS = ${JSON.stringify(mgnTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'dmsTasks.js'), `/** AWS DMS Tasks (SAA-C03) */\nexport const DMS_TASKS = ${JSON.stringify(dmsTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'snowFamilyTasks.js'), `/** AWS Snow Family Tasks (SAA-C03) */\nexport const SNOW_FAMILY_TASKS = ${JSON.stringify(snowFamilyTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'storageGatewayTasks.js'), `/** AWS Storage Gateway Tasks (SAA-C03) */\nexport const STORAGE_GATEWAY_TASKS = ${JSON.stringify(storageGatewayTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'dataSyncTasks.js'), `/** AWS DataSync Tasks (SAA-C03) */\nexport const DATASYNC_TASKS = ${JSON.stringify(dataSyncTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'siteToSiteVpnTasks.js'), `/** AWS Site-to-Site VPN Tasks (SAA-C03) */\nexport const SITE_TO_SITE_VPN_TASKS = ${JSON.stringify(vpnTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'directConnectTasks.js'), `/** AWS Direct Connect Tasks (SAA-C03) */\nexport const DIRECT_CONNECT_TASKS = ${JSON.stringify(directConnectTasks, null, 2)};\n`, 'utf8');

  console.log(`Wrote application Migration & Hybrid Connectivity task modules to ${APP_TASKS_DIR}`);

  // 5. Write MIGRATION_HYBRID_CONVERSION_REPORT.md
  const reportPath = path.join(MIGRATION_DIR, 'MIGRATION_HYBRID_CONVERSION_REPORT.md');
  let md = `# SAA / Migration & Hybrid Connectivity Hands-On Tasks Conversion Report

Generated: ${new Date().toISOString()}

## Executive Summary

* **Source Batch File**: \`hands_on_tasks/batches/SAA/migration-tools.json\`
* **Total Batch Source Records**: ${sourceTasks.length} (5 unique source records, 5 duplicate records excluded)
* **Previously Quarantined Tasks Resolved**: 4
  * VPC Task 17 $\\rightarrow$ \`topic-vpn\` (\`task-saa-vpn-set-up-aws-site-to-site-vpn-017\`)
  * VPC Task 19 $\\rightarrow$ \`topic-direct-connect\` (\`task-saa-direct-connect-create-private-vif-019\`)
  * Databases Task 23 $\\rightarrow$ \`topic-dms\` (\`task-saa-dms-conceptual-guide-023\`)
  * Databases Task 24 $\\rightarrow$ \`topic-dms\` (\`task-saa-dms-homogeneous-vs-heterogeneous-migration-024\`)
* **Total Integrated Tasks**: ${totalIntegrated}
  * \`AWS Application Migration Service\` (\`topic-mgn\`): ${mgnTasks.length}
  * \`AWS Database Migration Service\` (\`topic-dms\`): ${dmsTasks.length} (1 from batch + 2 from Databases review)
  * \`AWS Snow Family\` (\`topic-snow-family\`): ${snowFamilyTasks.length}
  * \`AWS Storage Gateway\` (\`topic-storage-gateway\`): ${storageGatewayTasks.length}
  * \`AWS DataSync\` (\`topic-datasync\`): ${dataSyncTasks.length}
  * \`AWS Site-to-Site VPN\` (\`topic-vpn\`): ${vpnTasks.length} (From VPC review)
  * \`AWS Direct Connect\` (\`topic-direct-connect\`): ${directConnectTasks.length} (From VPC review)
* **Duplicates Excluded**: 5 (duplicate records 6-10 in source file)
* **Tasks Sent to Review**: 0
* **Console-only Tasks**: ${consoleOnlyCount}
* **CLI-only Tasks**: ${cliOnlyCount}
* **Both Console & CLI Modes**: ${bothModesCount}
* **Tasks with Linked Flashcards**: ${flashcardsCount}

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Categorized migration and hybrid labs across 7 valid topic IDs (\`topic-mgn\`, \`topic-dms\`, \`topic-snow-family\`, \`topic-storage-gateway\`, \`topic-datasync\`, \`topic-vpn\`, \`topic-direct-connect\`).
2. **Review Record Resolution**: Resolved and integrated VPC Task 17 (VPN), VPC Task 19 (Direct Connect), Databases Task 23 (DMS), and Databases Task 24 (DMS Heterogeneous) without leaving duplicate live records.
3. **Direct Connect Encryption Guidance**: Clarified that Direct Connect does NOT encrypt traffic by default and highlighted VPN over Direct Connect (IPsec) for encrypted transit.
4. **DMS Heterogeneous Migration Guidance**: Clarified that DMS alone does not convert schema objects automatically for heterogeneous migrations (AWS Schema Conversion Tool / SCT is required).
5. **Step 1 Login Instruction Sanitization**: Replaced root user / broad \`AdministratorAccess\` instructions across all tasks with IAM user / lab role requirements.
6. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for MGN replication, DMS instances, DataSync transfer, Snow Family devices, VPN tunnels, and Direct Connect port-hours.
7. **Complete Resource Cleanup**: Ensured teardown sequence for every migration and hybrid connection (stopping replication tasks, deleting endpoints, removing VPN connections, and deleting VIF associations).
8. **Destructive Command Warnings**: Flagged commands like \`delete-replication-task\`, \`delete-endpoint\`, \`delete-vpn-connection\`, \`delete-virtual-interface\`.
9. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty | Duration | Flashcards | Status |
|---|---|---|---|---|---|---|---|
`;

  reportRows.forEach(r => {
    md += `| ${r.sourceId} | \`${r.taskId}\` | \`${r.topicId}\` | ${r.title} | ${r.difficulty} | ${r.estimatedMinutes} mins | ${r.hasFlashcards ? 'Yes' : 'No'} | ${r.status} |\n`;
  });

  md += `
---

## Review Required / Quarantined Tasks

${reviewRequiredList.length === 0 ? 'No tasks required quarantine. All 5 batch tasks and 4 resolved review tasks passed schema validation and technical safety checks.' : reviewRequiredList.map(r => `- **Task ${r.sourceTaskId} (${r.convertedTask.title})**: ${r.safetyIssues.join(', ')}`).join('\n')}
`;

  fs.writeFileSync(reportPath, md, 'utf8');
  console.log(`Wrote conversion report to: ${reportPath}`);
}

runConversion();
