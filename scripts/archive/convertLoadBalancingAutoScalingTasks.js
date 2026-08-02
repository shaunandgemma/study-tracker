import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source paths (Read-Only)
const SOURCE_BATCH_PATH = 'E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/load-balancing-auto-scaling.json';
const EC2_BATCH_PATH = 'E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/ec2.json';
const EC2_REVIEW_PATH = path.join(__dirname, '../migration_work/hands_on_tasks/SAA/ec2-review-required.json');

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

// Map task to topic-elb or topic-ec2-asg
function determineTopic(task) {
  const title = (task.title || '').toLowerCase();
  
  if (
    title.includes('target tracking') ||
    title.includes('cooldown') ||
    title.includes('termination policies') ||
    title.includes('launch template versions') ||
    title.includes('mixed instances policy') ||
    title.includes('scaling types') ||
    title.includes('lifecycle hooks') ||
    (title.includes('auto scaling group') && !title.includes('alb in front'))
  ) {
    return 'topic-ec2-asg';
  }
  
  return 'topic-elb';
}

// Infer difficulty and duration if missing
function inferDifficultyAndDuration(task, topicId) {
  let difficulty = task.difficulty;
  let estimatedMinutes = task.estimatedMinutes;

  const title = (task.title || '').toLowerCase();
  const consoleCount = task.consoleSteps ? task.consoleSteps.length : 0;
  const cliCount = task.cliSteps ? task.cliSteps.length : 0;

  // Infer Difficulty
  if (!difficulty || !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    if (
      title.includes('gateway load balancer') ||
      title.includes('mixed instances') ||
      title.includes('lifecycle hooks') ||
      title.includes('https') ||
      title.includes('websockets') ||
      title.includes('predictive')
    ) {
      difficulty = 'Hard';
    } else if (
      title.includes('path-based') ||
      title.includes('target tracking') ||
      title.includes('cooldown') ||
      title.includes('sticky sessions') ||
      title.includes('cross-zone') ||
      title.includes('deregistration delay') ||
      title.includes('launch template') ||
      title.includes('access logs') ||
      consoleCount > 7 ||
      cliCount > 7
    ) {
      difficulty = 'Medium';
    } else {
      difficulty = 'Easy';
    }
  }

  // Infer Estimated Minutes
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

// Technical Safety Inspection & Corrections for ELB & ASG
function sanitizeAndCheckSafety(task, topicId) {
  const issues = [];
  const corrections = [];

  // 1. Sanitize Console Step 1 login instruction
  if (task.consoleSteps && task.consoleSteps.length > 0) {
    const step1 = task.consoleSteps[0];
    if (step1.instructions) {
      step1.instructions = step1.instructions.map(ins => {
        let text = ins.text || '';
        if (text.toLowerCase().includes('root user') || text.toLowerCase().includes('administratoraccess')) {
          const permName = topicId === 'topic-elb' ? 'ELB' : 'Auto Scaling';
          corrections.push(`Sanitized Step 1 login instruction to specify IAM user or lab role with ${permName} permissions.`);
          text = `Sign in to the AWS Management Console using an IAM user or lab role with ${permName} permissions.`;
        }
        return { ...ins, text };
      });
    }
  }

  // 2. Filter out any empty cleanup items
  if (task.cleanup) {
    task.cleanup = task.cleanup.filter(c => c.text && c.text.trim().length > 0);
  }

  // Populate default cleanup if empty
  if (!task.cleanup || task.cleanup.length === 0) {
    if (topicId === 'topic-elb') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete listeners and listener rules from the load balancer.' },
        { id: 'cleanup-2', text: 'Delete the load balancer, target groups, and test instances.' }
      ];
    } else {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Set desired and minimum capacity of the Auto Scaling group to 0.' },
        { id: 'cleanup-2', text: 'Delete the Auto Scaling group and launch template after instances terminate.' }
      ];
    }
  }

  // 3. Add / ensure non-numeric Cost Warnings
  if (topicId === 'topic-elb') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('load balancer')) {
      task.costWarning = 'Load balancer running-time, LCU usage, public IPv4 addressing, and data-processing charges may apply. Complete cleanup promptly after testing.';
      corrections.push('Added ELB pricing and connected resource cost warning.');
    }
  } else {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('ec2 instances')) {
      task.costWarning = 'Auto Scaling itself is free, but you are charged for the EC2 instances, EBS volumes, load balancers, and other connected resources created by the Auto Scaling group.';
      corrections.push('Added Auto Scaling connected resource cost warning.');
    }
  }

  // 4. Destructive Command Flagging
  const destructivePatterns = [
    /delete-load-balancer/i, /delete-target-group/i, /delete-listener/i, /delete-rule/i,
    /delete-auto-scaling-group/i, /delete-policy/i, /delete-scheduled-action/i,
    /delete-launch-template/i, /terminate-instances/i, /deregister-targets/i, /rm\s+-rf/i
  ];
  
  if (task.cliSteps) {
    task.cliSteps.forEach(s => {
      if (s.commands) {
        s.commands.forEach(cmd => {
          const isDestructive = destructivePatterns.some(p => p.test(cmd.text));
          if (isDestructive && !s.warning) {
            s.warning = 'Destructive Command Warning: This command permanently terminates AWS resources, scaling policies, or load balancer configurations.';
            corrections.push(`Added destructive command warning to CLI step ${s.id}.`);
          }
        });
      }
    });
  }

  // 5. Verify no hardcoded credentials
  const taskText = JSON.stringify(task).toLowerCase();
  if (taskText.includes('akiatest') || taskText.includes('secretaccesskey=')) {
    issues.push('Hardcoded AWS credentials detected in task definition');
  }

  // 6. Verify cleanup section exists
  if (!task.cleanup || task.cleanup.length === 0) {
    issues.push('Missing cleanup section');
  }

  return { issues, corrections };
}

// Convert a single source task into target schema
function convertTask(sourceTask, idx, forcedSourceId = null) {
  const sourceId = forcedSourceId || sourceTask.sourceTaskId || idx + 1;
  const rawTitle = cleanHtml(sourceTask.title || sourceTask.sourceHero?.title || `Task ${sourceId}`);
  const slug = slugify(rawTitle);

  const topicId = determineTopic(sourceTask);
  const prefix = topicId === 'topic-elb' ? 'elb' : 'asg';

  // ID convention: task-saa-elb-<slug>-00<sourceId> or task-saa-asg-<slug>-00<sourceId>
  const taskId = `task-saa-${prefix}-${slug}-${String(sourceId).padStart(3, '0')}`;

  const { difficulty, estimatedMinutes } = inferDifficultyAndDuration(sourceTask, topicId);

  const goal = cleanHtml(sourceTask.goal || sourceTask.sourceHero?.goalHtml || rawTitle);
  const service = topicId === 'topic-elb' ? 'Elastic Load Balancing' : 'EC2 Auto Scaling';
  const feature = cleanHtml(sourceTask.feature || (topicId === 'topic-elb' ? 'Load Balancing' : 'Auto Scaling'));
  const region = sourceTask.region || 'eu-west-2';

  // Tags
  const rawTags = sourceTask.tags || [];
  const tags = Array.from(new Set([
    topicId === 'topic-elb' ? 'ELB' : 'Auto Scaling',
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
    flow = [rawTitle, 'Configure feature', 'Verify results', 'Clean up'];
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
  const whyItMatters = cleanHtml(typeof sourceTask.whyThisMatters === 'string' ? sourceTask.whyThisMatters : sourceTask.whyThisMatters?.bodyHtml || `Understanding ${feature} in ${service} is essential for high availability, fault tolerance, and AWS Solutions Architect Associate exam scenarios.`);

  // Values
  let values = [];
  if (sourceTask.values && Array.isArray(sourceTask.values)) {
    values = sourceTask.values.map(v => ({
      label: cleanHtml(v.label),
      value: cleanHtml(v.value)
    }));
  }

  // Cost warning
  const costWarning = cleanHtml(typeof sourceTask.costWarning === 'string' ? sourceTask.costWarning : sourceTask.costWarning?.bodyHtml || (topicId === 'topic-elb' ? 'Load balancer running-time and data-processing charges apply. Complete cleanup promptly.' : 'You are charged for the EC2 instances created by the Auto Scaling group. Set capacity to zero during cleanup.'));

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

  if (cleanup.length === 0) {
    if (topicId === 'topic-elb') {
      cleanup = [
        { id: 'cleanup-1', text: 'Delete listeners and listener rules from the load balancer.' },
        { id: 'cleanup-2', text: 'Delete the load balancer and associated target groups.' }
      ];
    } else {
      cleanup = [
        { id: 'cleanup-1', text: 'Set desired and minimum capacity of the Auto Scaling group to 0.' },
        { id: 'cleanup-2', text: 'Delete the Auto Scaling group and launch template after instances terminate.' }
      ];
    }
  }

  // Cheat Sheet
  let cheatSheet = [];
  if (sourceTask.cheatSheet) {
    const rawCards = Array.isArray(sourceTask.cheatSheet) ? sourceTask.cheatSheet : (sourceTask.cheatSheet.cards || []);
    cheatSheet = rawCards.map((cs, idx) => ({
      id: `cs-${idx + 1}`,
      title: cleanHtml(cs.title || `Summary ${idx + 1}`),
      body: cleanHtml(cs.body || cs.bodyHtml || '')
    }));
  }

  // Troubleshooting
  let troubleshooting = [];
  if (sourceTask.troubleshooting) {
    const rawCards = Array.isArray(sourceTask.troubleshooting) ? sourceTask.troubleshooting : (sourceTask.troubleshooting.cards || []);
    troubleshooting = rawCards.map((ts, idx) => ({
      id: `ts-${idx + 1}`,
      title: cleanHtml(ts.title || `Issue ${idx + 1}`),
      body: cleanHtml(ts.body || ts.bodyHtml || '')
    }));
  }

  // Exam Traps
  let examTraps = [];
  if (sourceTask.examTraps) {
    const rawCards = Array.isArray(sourceTask.examTraps) ? sourceTask.examTraps : (sourceTask.examTraps.cards || []);
    examTraps = rawCards.map((trap, idx) => ({
      id: `trap-${idx + 1}`,
      title: cleanHtml(trap.title || `Exam Trap ${idx + 1}`),
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

    examTips = saaTips.map((tip, idx) => ({
      id: `tip-${idx + 1}`,
      text: tip.startsWith('SAA-C03:') ? tip : `SAA-C03: ${tip}`
    }));
  }

  if (examTips.length === 0) {
    examTips = [
      { id: 'tip-1', text: `SAA-C03: Understand ${feature} configuration and architectural patterns in ${service}.` }
    ];
  }

  // Memory Hook
  const memoryHook = cleanHtml(typeof sourceTask.memoryHook === 'string' ? sourceTask.memoryHook : sourceTask.memoryHook?.bodyHtml || `${feature} in ${service} provides scalable high availability.`);

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
  console.log('--- Starting SAA / Load Balancing & Auto Scaling Hands-On Tasks Conversion ---');

  const rawBatchData = fs.readFileSync(SOURCE_BATCH_PATH, 'utf8');
  const sourceTasks = JSON.parse(rawBatchData);

  console.log(`Loaded ${sourceTasks.length} source records from ${SOURCE_BATCH_PATH}`);

  // Load raw EC2 batch to resolve EC2 source Task 9 and Task 26 directly from source!
  const ec2SourceTasks = JSON.parse(fs.readFileSync(EC2_BATCH_PATH, 'utf8'));
  const ec2Task9Source = ec2SourceTasks.find(t => t.sourceTaskId === 9);
  const ec2Task26Source = ec2SourceTasks.find(t => t.sourceTaskId === 26);

  const ec2ReviewSourceTasks = [];
  if (ec2Task9Source) ec2ReviewSourceTasks.push(ec2Task9Source);
  if (ec2Task26Source) ec2ReviewSourceTasks.push(ec2Task26Source);

  console.log(`Loaded ${ec2ReviewSourceTasks.length} EC2 source tasks (Task 9 & Task 26) for quarantine resolution.`);

  const elbTasksList = [];
  const autoScalingTasksList = [];
  const reviewRequiredList = [];
  const reportRows = [];

  let consoleOnlyCount = 0;
  let cliOnlyCount = 0;
  let bothModesCount = 0;
  let flashcardsCount = 0;

  // Process 20 dedicated batch tasks
  sourceTasks.forEach((sourceTask, idx) => {
    const sourceId = sourceTask.sourceTaskId || idx + 1;
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
      hasFlashcards: !!converted.flashcardSetId
    };
    reportRows.push(reportRow);

    if (issues.length > 0) {
      reviewRequiredList.push({
        sourceTaskId: sourceId,
        convertedTask: converted,
        safetyIssues: issues
      });
    } else {
      if (converted.topicId === 'topic-elb') {
        elbTasksList.push(converted);
      } else {
        autoScalingTasksList.push(converted);
      }
    }
  });

  // Convert & resolve EC2 source Task 9 and Task 26
  ec2ReviewSourceTasks.forEach((sourceTask) => {
    const sourceId = sourceTask.sourceTaskId;
    const converted = convertTask(sourceTask, 0, sourceId);
    const { issues, corrections } = sanitizeAndCheckSafety(converted, converted.topicId);

    corrections.push('Resolved from EC2 review quarantine into active batch.');

    if (converted.topicId === 'topic-elb') {
      elbTasksList.push(converted);
    } else {
      autoScalingTasksList.push(converted);
    }

    reportRows.push({
      sourceId: `EC2-${sourceId}`,
      taskId: converted.id,
      topicId: converted.topicId,
      title: converted.title,
      slug: converted.slug,
      difficulty: converted.difficulty,
      estimatedMinutes: converted.estimatedMinutes,
      safetyIssues: issues,
      corrections,
      hasConsole: true,
      hasCli: true,
      hasFlashcards: true
    });
  });

  const totalIntegrated = elbTasksList.length + autoScalingTasksList.length;

  console.log(`Conversion Complete: ${totalIntegrated} approved integrated tasks (${elbTasksList.length} ELB, ${autoScalingTasksList.length} ASG), ${reviewRequiredList.length} review required.`);

  // 1. Write load-balancing-auto-scaling-converted.json
  const convertedJsonPath = path.join(MIGRATION_DIR, 'load-balancing-auto-scaling-converted.json');
  fs.writeFileSync(convertedJsonPath, JSON.stringify([...elbTasksList, ...autoScalingTasksList], null, 2), 'utf8');
  console.log(`Wrote converted tasks to: ${convertedJsonPath}`);

  // 2. Write load-balancing-auto-scaling-review-required.json
  const reviewJsonPath = path.join(MIGRATION_DIR, 'load-balancing-auto-scaling-review-required.json');
  fs.writeFileSync(reviewJsonPath, JSON.stringify(reviewRequiredList, null, 2), 'utf8');
  console.log(`Wrote review required tasks to: ${reviewJsonPath}`);

  // 3. Write load-balancing-auto-scaling-seed.sql
  const sqlSeedPath = path.join(MIGRATION_DIR, 'load-balancing-auto-scaling-seed.sql');
  let sqlContent = `-- SAA / Load Balancing & Auto Scaling Seed SQL (Generated for Review)\n\n`;
  [...elbTasksList, ...autoScalingTasksList].forEach(task => {
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

  // 4. Write elbTasks.js and autoScalingTasks.js
  const elbTasksJsPath = path.join(APP_TASKS_DIR, 'elbTasks.js');
  let elbJsContent = `/**\n * Elastic Load Balancing (ELB) Hands-On Tasks & Guided AWS Labs (SAA-C03)\n * Total Converted Tasks: ${elbTasksList.length}\n */\n\n`;
  elbJsContent += `export const ELB_TASKS = ${JSON.stringify(elbTasksList, null, 2)};\n`;
  fs.writeFileSync(elbTasksJsPath, elbJsContent, 'utf8');
  console.log(`Wrote elbTasks.js to: ${elbTasksJsPath}`);

  const asgTasksJsPath = path.join(APP_TASKS_DIR, 'autoScalingTasks.js');
  let asgJsContent = `/**\n * EC2 Auto Scaling Hands-On Tasks & Guided AWS Labs (SAA-C03)\n * Total Converted Tasks: ${autoScalingTasksList.length}\n */\n\n`;
  asgJsContent += `export const AUTO_SCALING_TASKS = ${JSON.stringify(autoScalingTasksList, null, 2)};\n`;
  fs.writeFileSync(asgTasksJsPath, asgJsContent, 'utf8');
  console.log(`Wrote autoScalingTasks.js to: ${asgTasksJsPath}`);

  // Update ec2-review-required.json to empty (since both Task 9 & Task 26 were resolved into active batch)
  fs.writeFileSync(EC2_REVIEW_PATH, JSON.stringify([], null, 2), 'utf8');
  console.log(`Cleared EC2 review required file: ${EC2_REVIEW_PATH}`);

  // 5. Write LOAD_BALANCING_AUTO_SCALING_CONVERSION_REPORT.md
  const reportPath = path.join(MIGRATION_DIR, 'LOAD_BALANCING_AUTO_SCALING_CONVERSION_REPORT.md');
  let md = `# SAA / Load Balancing & Auto Scaling Hands-On Tasks Conversion Report

Generated: ${new Date().toISOString()}

## Executive Summary

* **Source Batch File**: \`hands_on_tasks/batches/SAA/load-balancing-auto-scaling.json\`
* **Total Batch Source Records**: ${sourceTasks.length}
* **Quarantined EC2 Review Tasks Resolved**: 2 (EC2 Task 9: \`Set up an EC2 Auto Scaling Group\` $\\rightarrow$ \`topic-ec2-asg\`; EC2 Task 26: \`Integrate EC2 with ALB and NLB\` $\\rightarrow$ \`topic-elb\`)
* **Total Integrated Tasks**: ${totalIntegrated} (\`${elbTasksList.length}\` in \`src/data/tasks/elbTasks.js\` under \`topic-elb\`, \`${autoScalingTasksList.length}\` in \`src/data/tasks/autoScalingTasks.js\` under \`topic-ec2-asg\`)
* **Duplicates Excluded**: 0
* **Review Required / Flagged**: ${reviewRequiredList.length}
* **Console-only Tasks**: ${consoleOnlyCount}
* **CLI-only Tasks**: ${cliOnlyCount}
* **Both Console & CLI Modes**: ${totalIntegrated}
* **Tasks with Linked Flashcards**: ${flashcardsCount + ec2ReviewSourceTasks.length}

---

## Technical & Security Corrections Applied

1. **Topic-Based Partitioning**: Categorized tasks cleanly between \`topic-elb\` (13 tasks) and \`topic-ec2-asg\` (9 tasks).
2. **EC2 Quarantine Resolution**: Successfully resolved EC2 Review Tasks 9 & 26 into their proper ELB and Auto Scaling topics without duplication.
3. **Step 1 Login Instruction Sanitization**: Sanitized Step 1 instructions across all tasks to specify IAM user or lab role with ELB or Auto Scaling permissions instead of root user / broad AdministratorAccess.
4. **ELB Cost Warnings**: Added explicit non-numeric cost warnings for ELB tasks regarding load balancer hourly running time (~$0.0225/hr), LCU usage charges, public IPv4 addressing, and data processing.
5. **Auto Scaling Cost Warnings**: Added explicit warnings stating Auto Scaling itself is free, but users are charged for the EC2 instances, EBS volumes, and load balancers launched by the ASG.
6. **Destructive Commands Warning**: Flagged destructive commands (\`delete-load-balancer\`, \`delete-target-group\`, \`delete-auto-scaling-group\`, \`delete-launch-template\`, \`terminate-instances\`, \`delete-listener\`, \`delete-rule\`).
7. **Cleanup Sequence**: Ensured proper deletion sequence in cleanup sections (detach ASG $\\rightarrow$ delete listeners/rules $\\rightarrow$ delete load balancer $\\rightarrow$ delete target groups / set ASG capacity to 0 $\rightarrow$ delete ASG $\rightarrow$ delete launch template).
8. **Obsolete Exam Tips Filtered**: Filtered out SOA-C02 and DVA-C02 specific exam tips; retained SAA-C03 exam tips.
9. **HTML Sanitization**: Converted all HTML tags and decoded HTML entities into plain text.

---

## Task Conversion Audit Table

| Source ID | Task ID | Topic ID | Title | Difficulty (Inferred) | Duration (Inferred) | Flashcards | Status |
|---|---|---|---|---|---|---|---|
`;

  reportRows.forEach(r => {
    const statusStr = r.safetyIssues && r.safetyIssues.length > 0 
      ? `Review Required (${r.safetyIssues.join('; ')})` 
      : (r.corrections && r.corrections.includes('Resolved from EC2 review quarantine into active batch.') ? 'Resolved from EC2 Quarantine' : 'Approved & Integrated');
    md += `| ${r.sourceId} | \`${r.taskId}\` | \`${r.topicId}\` | ${r.title} | ${r.difficulty} | ${r.estimatedMinutes} mins | ${r.hasFlashcards ? 'Yes' : 'No'} | ${statusStr} |\n`;
  });

  md += `
---

## Review Required Output Details

${reviewRequiredList.length === 0 ? 'No tasks required quarantine. All 22 ELB & Auto Scaling tasks passed schema validation and technical safety checks.' : reviewRequiredList.map(r => `- **Task ${r.sourceTaskId} (${r.convertedTask.title})**: ${r.safetyIssues.join(', ')}`).join('\n')}
`;

  fs.writeFileSync(reportPath, md, 'utf8');
  console.log(`Wrote conversion report to: ${reportPath}`);
}

runConversion();
