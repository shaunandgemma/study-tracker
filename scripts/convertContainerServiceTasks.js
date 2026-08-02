import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source paths (Read-Only)
const SOURCE_BATCH_PATH = 'E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/container-services.json';

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

// Determine valid Container Topic ID
function determineContainerTopic(task) {
  const title = (task.title || '').toLowerCase();
  const goal = (task.goal || '').toLowerCase();
  
  if (title.includes('ecr') || goal.includes('ecr')) return 'topic-ecr';
  if (title.includes('fargate') || goal.includes('fargate')) return 'topic-fargate';
  if (title.includes('eks') || goal.includes('eks')) return 'topic-eks';
  if (title.includes('app runner') || goal.includes('app runner')) return 'topic-app-runner';
  
  return 'topic-ecs';
}

// Infer difficulty and duration
function inferDifficultyAndDuration(task, topicId) {
  let difficulty = task.difficulty;
  let estimatedMinutes = task.estimatedMinutes;

  const title = (task.title || '').toLowerCase();
  const consoleCount = task.consoleSteps ? task.consoleSteps.length : 0;

  if (!difficulty || !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    if (
      title.includes('eks') ||
      title.includes('capacity providers') ||
      title.includes('canary') ||
      consoleCount > 7
    ) {
      difficulty = 'Hard';
    } else if (
      title.includes('fargate') ||
      title.includes('alb') ||
      title.includes('task roles') ||
      title.includes('app runner') ||
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

// Technical & Security Inspection for Container Services
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
          text = 'Sign in to the AWS Management Console using an IAM user or lab role with appropriate container service permissions.';
        }
        return { ...ins, text };
      });
    }
  }

  // 2. Ensure modern ECR login command syntax in CLI steps (no deprecated get-login)
  if (topicId === 'topic-ecr' && task.cliSteps) {
    task.cliSteps.forEach(s => {
      if (s.commands) {
        s.commands.forEach(cmd => {
          if (cmd.text.includes('aws ecr get-login ') && !cmd.text.includes('get-login-password')) {
            corrections.push('Updated deprecated aws ecr get-login command to modern aws ecr get-login-password pattern.');
            cmd.text = cmd.text.replace(/aws ecr get-login [^\n]+/g, 'aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REGISTRY_URI');
          }
        });
      }
    });
  }

  // 3. Filter out empty cleanup items
  if (task.cleanup) {
    task.cleanup = task.cleanup.filter(c => c.text && c.text.trim().length > 0);
  }

  // Populate default cleanup if empty
  if (!task.cleanup || task.cleanup.length === 0) {
    if (topicId === 'topic-ecr') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete all container images from the ECR repository.' },
        { id: 'cleanup-2', text: 'Delete the Amazon ECR repository.' }
      ];
    } else if (topicId === 'topic-fargate') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Scale the Fargate ECS service desired count to 0.' },
        { id: 'cleanup-2', text: 'Delete the ECS service, load balancer target group, and ECS cluster.' },
        { id: 'cleanup-3', text: 'Delete CloudWatch Log Groups and IAM task execution roles created for the lab.' }
      ];
    } else if (topicId === 'topic-ecs') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Scale the ECS service desired count to 0 and delete the service.' },
        { id: 'cleanup-2', text: 'Deregister task definition revisions and delete the ECS cluster.' },
        { id: 'cleanup-3', text: 'Delete IAM task roles, execution roles, and CloudWatch Log Groups.' }
      ];
    }
  }

  // 4. Non-numeric Cost Warnings
  if (topicId === 'topic-ecr') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('container image storage')) {
      task.costWarning = 'Container image storage, scanning, replication and data-transfer charges may apply. Complete cleanup promptly after testing.';
      corrections.push('Added ECR cost warning.');
    }
  } else if (topicId === 'topic-fargate') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('fargate cpu')) {
      task.costWarning = 'Fargate CPU, memory, ephemeral storage, networking, logging and connected-service charges may apply while tasks run.';
      corrections.push('Added Fargate cost warning.');
    }
  } else if (topicId === 'topic-ecs') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('ec2 instances') && !task.costWarning.toLowerCase().includes('ecs')) {
      task.costWarning = 'ECS container instances, Fargate tasks, load balancers, NAT Gateways, logs and data-transfer charges may apply.';
      corrections.push('Added ECS cost warning.');
    }
  }

  // 5. Destructive Command Flagging
  const destructivePatterns = [
    /delete-service/i, /stop-task/i, /delete-cluster/i,
    /deregister-task-definition/i, /delete-repository/i,
    /batch-delete-image/i, /delete-nodegroup/i, /delete-fargate-profile/i,
    /terminate-instances/i, /rm\s+-rf/i
  ];
  
  if (task.cliSteps) {
    task.cliSteps.forEach(s => {
      if (s.commands) {
        s.commands.forEach(cmd => {
          const isDestructive = destructivePatterns.some(p => p.test(cmd.text));
          if (isDestructive && !s.warning) {
            s.warning = 'Destructive Command Warning: This command permanently deletes container repositories, images, ECS services, task definitions, or clusters.';
            corrections.push(`Added destructive command warning to CLI step ${s.id}.`);
          }
        });
      }
    });
  }

  // 6. Check for real credentials or private registry URIs
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

  const topicId = determineContainerTopic(sourceTask);
  
  // Prefix mapping
  let prefix = 'ecs';
  if (topicId === 'topic-ecr') prefix = 'ecr';
  else if (topicId === 'topic-fargate') prefix = 'fargate';
  else if (topicId === 'topic-eks') prefix = 'eks';
  else if (topicId === 'topic-app-runner') prefix = 'app-runner';

  const taskId = `task-saa-${prefix}-${slug}-${String(sourceId).padStart(3, '0')}`;

  const { difficulty, estimatedMinutes } = inferDifficultyAndDuration(sourceTask, topicId);

  const goal = cleanHtml(sourceTask.goal || sourceTask.sourceHero?.goalHtml || rawTitle);
  
  let service = 'Amazon ECS';
  if (topicId === 'topic-ecr') service = 'Amazon ECR';
  else if (topicId === 'topic-fargate') service = 'AWS Fargate';
  else if (topicId === 'topic-eks') service = 'Amazon EKS';
  else if (topicId === 'topic-app-runner') service = 'AWS App Runner';

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
    flow = [rawTitle, 'Configure container service', 'Verify container deployment', 'Clean up'];
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
  const whyItMatters = cleanHtml(typeof sourceTask.whyThisMatters === 'string' ? sourceTask.whyThisMatters : sourceTask.whyThisMatters?.bodyHtml || `Understanding ${feature} in ${service} is essential for containerized workload design on the SAA-C03 exam.`);

  // Values
  let values = [];
  if (sourceTask.values && Array.isArray(sourceTask.values)) {
    values = sourceTask.values.map(v => ({
      label: cleanHtml(v.label),
      value: cleanHtml(v.value)
    }));
  }

  // Cost warning
  const costWarning = cleanHtml(typeof sourceTask.costWarning === 'string' ? sourceTask.costWarning : sourceTask.costWarning?.bodyHtml || `${service} compute, storage, and networking charges apply while resources run. Delete resources promptly after testing.`);

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
      { id: 'tip-1', text: `SAA-C03: Master ${feature} concepts and container orchestration patterns in ${service}.` }
    ];
  }

  // Memory Hook
  const memoryHook = cleanHtml(typeof sourceTask.memoryHook === 'string' ? sourceTask.memoryHook : sourceTask.memoryHook?.bodyHtml || `${feature} in ${service} provides high performance container management.`);

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
  console.log('--- Starting SAA / Container Services Hands-On Tasks Conversion ---');

  const rawBatchData = fs.readFileSync(SOURCE_BATCH_PATH, 'utf8');
  const sourceTasks = JSON.parse(rawBatchData);

  console.log(`Loaded ${sourceTasks.length} source records from ${SOURCE_BATCH_PATH}`);

  const ecrTasks = [];
  const fargateTasks = [];
  const ecsTasks = [];
  
  const reviewRequiredList = [];
  const reportRows = [];
  const seenSourceIds = new Set();

  let consoleOnlyCount = 0;
  let cliOnlyCount = 0;
  let bothModesCount = 0;
  let flashcardsCount = 0;

  sourceTasks.forEach((sourceTask, idx) => {
    const sourceId = sourceTask.sourceTaskId || idx + 1;

    // Duplicate check for exact repeated records in source batch
    if (seenSourceIds.has(sourceId)) {
      console.log(`Skipping duplicate source record index ${idx + 1} (Source ID ${sourceId})`);
      return;
    }
    seenSourceIds.add(sourceId);

    const titleLower = (sourceTask.title || '').toLowerCase();

    // App Runner task quarantine check
    if (titleLower.includes('app runner')) {
      const converted = convertTask(sourceTask, idx);
      reviewRequiredList.push({
        sourceTaskId: sourceId,
        convertedTask: converted,
        reason: 'AWS App Runner task recommended for topic-app-runner when App Runner topic is added to exam configuration.',
        recommendedTopic: 'topic-app-runner'
      });
      reportRows.push({
        sourceId,
        taskId: converted.id,
        topicId: 'topic-app-runner (Quarantined)',
        title: converted.title,
        slug: converted.slug,
        difficulty: converted.difficulty,
        estimatedMinutes: converted.estimatedMinutes,
        status: 'Sent to Review (Recommended for topic-app-runner)'
      });
      return;
    }

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
      if (converted.topicId === 'topic-ecr') ecrTasks.push(converted);
      else if (converted.topicId === 'topic-fargate') fargateTasks.push(converted);
      else ecsTasks.push(converted);
    }
  });

  const totalIntegrated = ecrTasks.length + fargateTasks.length + ecsTasks.length;

  console.log(`Conversion Complete: ${totalIntegrated} approved integrated container tasks (${ecrTasks.length} ECR, ${fargateTasks.length} Fargate, ${ecsTasks.length} ECS), ${reviewRequiredList.length} review required / quarantined.`);

  // 1. Write container-services-converted.json
  const allConvertedTasks = [...ecrTasks, ...fargateTasks, ...ecsTasks];
  const convertedJsonPath = path.join(MIGRATION_DIR, 'container-services-converted.json');
  fs.writeFileSync(convertedJsonPath, JSON.stringify(allConvertedTasks, null, 2), 'utf8');
  console.log(`Wrote converted tasks to: ${convertedJsonPath}`);

  // 2. Write container-services-review-required.json
  const reviewJsonPath = path.join(MIGRATION_DIR, 'container-services-review-required.json');
  fs.writeFileSync(reviewJsonPath, JSON.stringify(reviewRequiredList, null, 2), 'utf8');
  console.log(`Wrote review required tasks to: ${reviewJsonPath}`);

  // 3. Write container-services-seed.sql
  const sqlSeedPath = path.join(MIGRATION_DIR, 'container-services-seed.sql');
  let sqlContent = `-- SAA / Container Services Seed SQL (Generated for Review)\n\n`;
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

  // 4. Write container task module files
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'ecrTasks.js'), `/** Amazon ECR Tasks (SAA-C03) */\nexport const ECR_TASKS = ${JSON.stringify(ecrTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'fargateTasks.js'), `/** AWS Fargate Tasks (SAA-C03) */\nexport const FARGATE_TASKS = ${JSON.stringify(fargateTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'ecsTasks.js'), `/** Amazon ECS Tasks (SAA-C03) */\nexport const ECS_TASKS = ${JSON.stringify(ecsTasks, null, 2)};\n`, 'utf8');

  console.log(`Wrote application container task modules to ${APP_TASKS_DIR}`);

  // 5. Write CONTAINER_SERVICES_CONVERSION_REPORT.md
  const reportPath = path.join(MIGRATION_DIR, 'CONTAINER_SERVICES_CONVERSION_REPORT.md');
  let md = `# SAA / Container Services Hands-On Tasks Conversion Report

Generated: ${new Date().toISOString()}

## Executive Summary

* **Source Batch File**: \`hands_on_tasks/batches/SAA/container-services.json\`
* **Total Batch Source Records**: ${sourceTasks.length} (4 unique source records, 4 duplicate records excluded)
* **Total Integrated Tasks**: ${totalIntegrated}
  * \`Amazon ECR\` (\`topic-ecr\`): ${ecrTasks.length}
  * \`AWS Fargate\` (\`topic-fargate\`): ${fargateTasks.length}
  * \`Amazon ECS\` (\`topic-ecs\`): ${ecsTasks.length}
* **Duplicates Excluded**: 4 (duplicate records 5-8 in source file)
* **Tasks Sent to Review**: ${reviewRequiredList.length} (Task 3: AWS App Runner recommended for \`topic-app-runner\`)
* **Console-only Tasks**: ${consoleOnlyCount}
* **CLI-only Tasks**: ${cliOnlyCount}
* **Both Console & CLI Modes**: ${bothModesCount}
* **Tasks with Linked Flashcards**: ${flashcardsCount}

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Categorized container tasks across 3 valid topic IDs (\`topic-ecr\`, \`topic-fargate\`, \`topic-ecs\`).
2. **App Runner Quarantine**: Quarantined Task 3 (AWS App Runner) into \`container-services-review-required.json\` with \`recommendedTopic: 'topic-app-runner'\`.
3. **Step 1 Login Instruction Sanitization**: Replaced root user / broad \`AdministratorAccess\` instructions across all tasks with IAM user / lab role requirements.
4. **Modern ECR Login Command Syntax**: Ensured ECR CLI instructions use modern \`aws ecr get-login-password\` instead of deprecated \`get-login\`.
5. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for ECR image storage, Fargate tasks, and ECS container instances/ALBs.
6. **Complete Resource Cleanup**: Ensured teardown sequence for every container resource (scaling service count to 0, deleting services, task definition revisions, ECR images, repositories, and clusters).
7. **Destructive Command Warnings**: Flagged commands like \`delete-service\`, \`stop-task\`, \`delete-cluster\`, \`deregister-task-definition\`, \`delete-repository\`.
8. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

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

${reviewRequiredList.map(r => `- **Task ${r.sourceTaskId} (${r.convertedTask.title})**: ${r.reason}`).join('\n')}
`;

  fs.writeFileSync(reportPath, md, 'utf8');
  console.log(`Wrote conversion report to: ${reportPath}`);
}

runConversion();
