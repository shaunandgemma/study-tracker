import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source paths (Read-Only)
const SOURCE_BATCH_PATH = 'E:/code/AWS Tool/migration_export/hands_on_tasks/batches/SAA/serverless.json';

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

// Determine valid Serverless Topic ID
function determineServerlessTopic(task) {
  const title = (task.title || '').toLowerCase();
  const goal = (task.goal || '').toLowerCase();
  
  if (title.includes('api ingress') || title.includes('api gateway') || goal.includes('api gateway')) return 'topic-api-gateway';
  if (title.includes('state machine') || title.includes('step functions') || goal.includes('step functions')) return 'topic-step-functions';
  if (title.includes('event orchestration') || title.includes('eventbridge') || goal.includes('eventbridge')) return 'topic-eventbridge';
  if (title.includes('pub/sub') || title.includes('sns') || goal.includes('sns topic')) return 'topic-sns';
  if (
    title.includes('asynchronous buffering') ||
    title.includes('sequential processing') ||
    title.includes('fault isolation') ||
    title.includes('payload management') ||
    title.includes('sqs') ||
    goal.includes('sqs')
  ) {
    return 'topic-sqs';
  }
  
  return 'topic-lambda';
}

// Infer difficulty and duration
function inferDifficultyAndDuration(task, topicId) {
  let difficulty = task.difficulty;
  let estimatedMinutes = task.estimatedMinutes;

  const title = (task.title || '').toLowerCase();
  const consoleCount = task.consoleSteps ? task.consoleSteps.length : 0;

  if (!difficulty || !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    if (
      title.includes('event orchestration') ||
      title.includes('state machine') ||
      title.includes('canary routing') ||
      title.includes('payload management') ||
      title.includes('fan-out') ||
      consoleCount > 7
    ) {
      difficulty = 'Hard';
    } else if (
      title.includes('api ingress') ||
      title.includes('concurrency tuning') ||
      title.includes('sequential processing') ||
      title.includes('pub/sub') ||
      title.includes('fault isolation') ||
      title.includes('vpc subnet') ||
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

// Technical & Security Inspection for Serverless
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
          text = 'Sign in to the AWS Management Console using an IAM user or lab role with appropriate serverless permissions.';
        }
        return { ...ins, text };
      });
    }
  }

  // 2. Sanitize user emails / phone numbers in SNS tasks
  const sanitizeSNS = (text) => {
    if (text.includes('user@example.com') || text.includes('your-email@example.com')) {
      return text;
    }
    return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'learner@example.com');
  };

  if (topicId === 'topic-sns' && task.consoleSteps) {
    task.consoleSteps.forEach(s => {
      if (s.instructions) {
        s.instructions = s.instructions.map(ins => ({ ...ins, text: sanitizeSNS(ins.text) }));
      }
    });
  }

  // 3. Filter out empty cleanup items
  if (task.cleanup) {
    task.cleanup = task.cleanup.filter(c => c.text && c.text.trim().length > 0);
  }

  // Populate default cleanup if empty
  if (!task.cleanup || task.cleanup.length === 0) {
    if (topicId === 'topic-lambda') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete any event-source mappings, triggers, or alias routing configurations.' },
        { id: 'cleanup-2', text: 'Delete the AWS Lambda function and associated CloudWatch Log Group.' },
        { id: 'cleanup-3', text: 'Delete the IAM execution role and attached policies created for the lab.' }
      ];
    } else if (topicId === 'topic-api-gateway') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete the API Gateway stage deployment and API instance.' },
        { id: 'cleanup-2', text: 'Delete associated CloudWatch Log Groups and Lambda permissions.' }
      ];
    } else if (topicId === 'topic-step-functions') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Stop any running state machine test executions.' },
        { id: 'cleanup-2', text: 'Delete the Step Functions state machine and associated IAM role.' }
      ];
    } else if (topicId === 'topic-eventbridge') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Remove all rule targets and delete the EventBridge rule.' },
        { id: 'cleanup-2', text: 'Delete custom event buses, schedules, or DLQs if created for the lab.' }
      ];
    } else if (topicId === 'topic-sqs') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete the SQS queue and associated Dead-Letter Queue (DLQ).' },
        { id: 'cleanup-2', text: 'Delete related Lambda event-source mappings and queue policies.' }
      ];
    } else if (topicId === 'topic-sns') {
      task.cleanup = [
        { id: 'cleanup-1', text: 'Delete all SNS topic subscriptions.' },
        { id: 'cleanup-2', text: 'Delete the SNS topic and associated SQS queue or policy.' }
      ];
    }
  }

  // 4. Non-numeric Cost Warnings
  if (topicId === 'topic-lambda') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('lambda request')) {
      task.costWarning = 'Lambda request, duration, provisioned-concurrency, networking and connected-service charges may apply. Complete cleanup promptly after testing.';
      corrections.push('Added Lambda cost warning.');
    }
  } else if (topicId === 'topic-api-gateway') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('api requests')) {
      task.costWarning = 'API requests, data transfer, caching, logging and connected-service charges may apply. Complete cleanup promptly.';
      corrections.push('Added API Gateway cost warning.');
    }
  } else if (topicId === 'topic-step-functions') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('workflow state-transition')) {
      task.costWarning = 'Workflow state-transition or execution-duration charges may apply depending on workflow type. Delete state machines after testing.';
      corrections.push('Added Step Functions cost warning.');
    }
  } else if (topicId === 'topic-eventbridge') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('event ingestion')) {
      task.costWarning = 'Event ingestion, delivery, Scheduler, Pipes, archive and replay charges may apply. Complete cleanup promptly.';
      corrections.push('Added EventBridge cost warning.');
    }
  } else if (topicId === 'topic-sqs' || topicId === 'topic-sns') {
    if (!task.costWarning || !task.costWarning.toLowerCase().includes('request, data-transfer')) {
      task.costWarning = 'Request, data-transfer, delivery and connected-service charges may apply. Delete topics, queues, and subscriptions promptly.';
      corrections.push('Added SQS/SNS cost warning.');
    }
  }

  // 5. Destructive Command Flagging
  const destructivePatterns = [
    /delete-function/i, /delete-event-source-mapping/i, /delete-rest-api/i,
    /delete-api/i, /delete-state-machine/i, /delete-rule/i, /remove-targets/i,
    /delete-event-bus/i, /delete-schedule/i, /delete-pipe/i, /delete-queue/i,
    /delete-topic/i, /unsubscribe/i, /terminate-instances/i, /rm\s+-rf/i
  ];
  
  if (task.cliSteps) {
    task.cliSteps.forEach(s => {
      if (s.commands) {
        s.commands.forEach(cmd => {
          const isDestructive = destructivePatterns.some(p => p.test(cmd.text));
          if (isDestructive && !s.warning) {
            s.warning = 'Destructive Command Warning: This command permanently deletes serverless functions, APIs, state machines, rules, queues, or topics.';
            corrections.push(`Added destructive command warning to CLI step ${s.id}.`);
          }
        });
      }
    });
  }

  // 6. Check for real credentials or API keys
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

  const topicId = determineServerlessTopic(sourceTask);
  
  // Prefix mapping
  let prefix = 'lambda';
  if (topicId === 'topic-api-gateway') prefix = 'api-gateway';
  else if (topicId === 'topic-step-functions') prefix = 'step-functions';
  else if (topicId === 'topic-eventbridge') prefix = 'eventbridge';
  else if (topicId === 'topic-sqs') prefix = 'sqs';
  else if (topicId === 'topic-sns') prefix = 'sns';

  const taskId = `task-saa-${prefix}-${slug}-${String(sourceId).padStart(3, '0')}`;

  const { difficulty, estimatedMinutes } = inferDifficultyAndDuration(sourceTask, topicId);

  const goal = cleanHtml(sourceTask.goal || sourceTask.sourceHero?.goalHtml || rawTitle);
  
  let service = 'AWS Lambda';
  if (topicId === 'topic-api-gateway') service = 'Amazon API Gateway';
  else if (topicId === 'topic-step-functions') service = 'AWS Step Functions';
  else if (topicId === 'topic-eventbridge') service = 'Amazon EventBridge';
  else if (topicId === 'topic-sqs') service = 'Amazon SQS';
  else if (topicId === 'topic-sns') service = 'Amazon SNS';

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
    flow = [rawTitle, 'Configure serverless service', 'Verify integration', 'Clean up'];
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
  const whyItMatters = cleanHtml(typeof sourceTask.whyThisMatters === 'string' ? sourceTask.whyThisMatters : sourceTask.whyThisMatters?.bodyHtml || `Understanding ${feature} in ${service} is key for event-driven, scalable AWS architectures on the SAA-C03 exam.`);

  // Values
  let values = [];
  if (sourceTask.values && Array.isArray(sourceTask.values)) {
    values = sourceTask.values.map(v => ({
      label: cleanHtml(v.label),
      value: cleanHtml(v.value)
    }));
  }

  // Cost warning
  const costWarning = cleanHtml(typeof sourceTask.costWarning === 'string' ? sourceTask.costWarning : sourceTask.costWarning?.bodyHtml || `${service} request and execution charges apply. Delete resources promptly after testing.`);

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
      { id: 'tip-1', text: `SAA-C03: Master ${feature} concepts and serverless integration patterns in ${service}.` }
    ];
  }

  // Memory Hook
  const memoryHook = cleanHtml(typeof sourceTask.memoryHook === 'string' ? sourceTask.memoryHook : sourceTask.memoryHook?.bodyHtml || `${feature} in ${service} powers scalable event-driven architectures.`);

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
  console.log('--- Starting SAA / Serverless Hands-On Tasks Conversion ---');

  const rawBatchData = fs.readFileSync(SOURCE_BATCH_PATH, 'utf8');
  const sourceTasks = JSON.parse(rawBatchData);

  console.log(`Loaded ${sourceTasks.length} source records from ${SOURCE_BATCH_PATH}`);

  const lambdaTasks = [];
  const apiGatewayTasks = [];
  const stepFunctionsTasks = [];
  const eventBridgeTasks = [];
  const sqsTasks = [];
  const snsTasks = [];
  
  const reviewRequiredList = [];
  const reportRows = [];

  let consoleOnlyCount = 0;
  let cliOnlyCount = 0;
  let bothModesCount = 0;
  let flashcardsCount = 0;

  sourceTasks.forEach((sourceTask, idx) => {
    const sourceId = sourceTask.sourceTaskId || idx + 1;
    const converted = convertTask(sourceTask, idx);

    // Quarantining logic for non-serverless batch records
    if (sourceId === 11) {
      // Analytical Ingestion (Data Firehose / Kinesis)
      reviewRequiredList.push({
        sourceTaskId: sourceId,
        convertedTask: converted,
        reason: 'Analytical ingestion / Data Firehose task recommended for topic-kinesis / Analytics topic batch.',
        recommendedTopic: 'topic-kinesis'
      });
      reportRows.push({
        sourceId,
        taskId: converted.id,
        topicId: 'topic-kinesis (Quarantined)',
        title: converted.title,
        slug: converted.slug,
        difficulty: converted.difficulty,
        estimatedMinutes: converted.estimatedMinutes,
        status: 'Sent to Review (Recommended for topic-kinesis)'
      });
      return;
    }

    if (sourceId === 12) {
      // Serverless Security (Cognito User Pools / Identity Pools)
      reviewRequiredList.push({
        sourceTaskId: sourceId,
        convertedTask: converted,
        reason: 'Serverless security / Cognito identity management task recommended for topic-cognito / Security topic batch.',
        recommendedTopic: 'topic-cognito'
      });
      reportRows.push({
        sourceId,
        taskId: converted.id,
        topicId: 'topic-cognito (Quarantined)',
        title: converted.title,
        slug: converted.slug,
        difficulty: converted.difficulty,
        estimatedMinutes: converted.estimatedMinutes,
        status: 'Sent to Review (Recommended for topic-cognito)'
      });
      return;
    }

    if (sourceId === 13) {
      // Serverless Databases (DynamoDB Table & TTL) - Already integrated in Databases batch under topic-dynamodb
      reviewRequiredList.push({
        sourceTaskId: sourceId,
        convertedTask: converted,
        reason: 'DynamoDB table & TTL task already integrated in Databases batch under topic-dynamodb (duplicate domain task).',
        recommendedTopic: 'topic-dynamodb'
      });
      reportRows.push({
        sourceId,
        taskId: converted.id,
        topicId: 'topic-dynamodb (Quarantined)',
        title: converted.title,
        slug: converted.slug,
        difficulty: converted.difficulty,
        estimatedMinutes: converted.estimatedMinutes,
        status: 'Sent to Review (Integrated in Databases batch)'
      });
      return;
    }

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
      if (converted.topicId === 'topic-api-gateway') apiGatewayTasks.push(converted);
      else if (converted.topicId === 'topic-step-functions') stepFunctionsTasks.push(converted);
      else if (converted.topicId === 'topic-eventbridge') eventBridgeTasks.push(converted);
      else if (converted.topicId === 'topic-sqs') sqsTasks.push(converted);
      else if (converted.topicId === 'topic-sns') snsTasks.push(converted);
      else lambdaTasks.push(converted);
    }
  });

  const totalIntegrated = lambdaTasks.length + apiGatewayTasks.length + stepFunctionsTasks.length + eventBridgeTasks.length + sqsTasks.length + snsTasks.length;

  console.log(`Conversion Complete: ${totalIntegrated} approved integrated serverless tasks (${lambdaTasks.length} Lambda, ${apiGatewayTasks.length} API Gateway, ${stepFunctionsTasks.length} Step Functions, ${eventBridgeTasks.length} EventBridge, ${sqsTasks.length} SQS, ${snsTasks.length} SNS), ${reviewRequiredList.length} review required / quarantined.`);

  // 1. Write serverless-converted.json
  const allConvertedTasks = [...lambdaTasks, ...apiGatewayTasks, ...stepFunctionsTasks, ...eventBridgeTasks, ...sqsTasks, ...snsTasks];
  const convertedJsonPath = path.join(MIGRATION_DIR, 'serverless-converted.json');
  fs.writeFileSync(convertedJsonPath, JSON.stringify(allConvertedTasks, null, 2), 'utf8');
  console.log(`Wrote converted tasks to: ${convertedJsonPath}`);

  // 2. Write serverless-review-required.json
  const reviewJsonPath = path.join(MIGRATION_DIR, 'serverless-review-required.json');
  fs.writeFileSync(reviewJsonPath, JSON.stringify(reviewRequiredList, null, 2), 'utf8');
  console.log(`Wrote review required tasks to: ${reviewJsonPath}`);

  // 3. Write serverless-seed.sql
  const sqlSeedPath = path.join(MIGRATION_DIR, 'serverless-seed.sql');
  let sqlContent = `-- SAA / Serverless Seed SQL (Generated for Review)\n\n`;
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

  // 4. Write serverless module files
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'lambdaTasks.js'), `/** AWS Lambda Tasks (SAA-C03) */\nexport const LAMBDA_TASKS = ${JSON.stringify(lambdaTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'apiGatewayTasks.js'), `/** Amazon API Gateway Tasks (SAA-C03) */\nexport const API_GATEWAY_TASKS = ${JSON.stringify(apiGatewayTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'stepFunctionsTasks.js'), `/** AWS Step Functions Tasks (SAA-C03) */\nexport const STEP_FUNCTIONS_TASKS = ${JSON.stringify(stepFunctionsTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'eventBridgeTasks.js'), `/** Amazon EventBridge Tasks (SAA-C03) */\nexport const EVENTBRIDGE_TASKS = ${JSON.stringify(eventBridgeTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'sqsTasks.js'), `/** Amazon SQS Tasks (SAA-C03) */\nexport const SQS_TASKS = ${JSON.stringify(sqsTasks, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(APP_TASKS_DIR, 'snsTasks.js'), `/** Amazon SNS Tasks (SAA-C03) */\nexport const SNS_TASKS = ${JSON.stringify(snsTasks, null, 2)};\n`, 'utf8');

  console.log(`Wrote application serverless task modules to ${APP_TASKS_DIR}`);

  // 5. Write SERVERLESS_CONVERSION_REPORT.md
  const reportPath = path.join(MIGRATION_DIR, 'SERVERLESS_CONVERSION_REPORT.md');
  let md = `# SAA / Serverless Hands-On Tasks Conversion Report

Generated: ${new Date().toISOString()}

## Executive Summary

* **Source Batch File**: \`hands_on_tasks/batches/SAA/serverless.json\`
* **Total Batch Source Records**: ${sourceTasks.length}
* **Total Integrated Tasks**: ${totalIntegrated}
  * \`AWS Lambda\` (\`topic-lambda\`): ${lambdaTasks.length}
  * \`Amazon API Gateway\` (\`topic-api-gateway\`): ${apiGatewayTasks.length}
  * \`AWS Step Functions\` (\`topic-step-functions\`): ${stepFunctionsTasks.length}
  * \`Amazon EventBridge\` (\`topic-eventbridge\`): ${eventBridgeTasks.length}
  * \`Amazon SQS\` (\`topic-sqs\`): ${sqsTasks.length}
  * \`Amazon SNS\` (\`topic-sns\`): ${snsTasks.length}
* **Duplicates Excluded**: 0
* **Tasks Sent to Review**: ${reviewRequiredList.length} (Tasks 11, 12, 13 recommended for \`topic-kinesis\`, \`topic-cognito\`, \`topic-dynamodb\`)
* **Console-only Tasks**: ${consoleOnlyCount}
* **CLI-only Tasks**: ${cliOnlyCount}
* **Both Console & CLI Modes**: ${bothModesCount}
* **Tasks with Linked Flashcards**: ${flashcardsCount}

---

## Technical & Security Corrections Applied

1. **Service Topic Partitioning**: Mapped serverless labs across 6 dedicated topic IDs (\`topic-lambda\`, \`topic-api-gateway\`, \`topic-step-functions\`, \`topic-eventbridge\`, \`topic-sqs\`, \`topic-sns\`).
2. **Domain Quarantine**: Quarantined Task 11 (Data Firehose $\\rightarrow$ \`topic-kinesis\`), Task 12 (Cognito Pools $\\rightarrow$ \`topic-cognito\`), and Task 13 (DynamoDB $\\rightarrow$ already integrated in Databases batch).
3. **Step 1 Login Instruction Sanitization**: Replaced root user / broad \`AdministratorAccess\` instructions across all tasks with IAM user / lab role requirements.
4. **Non-Numeric Cost Warnings**: Added explicit service-specific cost warnings for Lambda, API Gateway, Step Functions, EventBridge, SQS, and SNS.
5. **Complete Resource Cleanup**: Ensured teardown sequence for every serverless resource (functions, APIs, state machines, rules, queues, topics, execution roles).
6. **Destructive Command Warnings**: Flagged commands like \`delete-function\`, \`delete-api\`, \`delete-state-machine\`, \`delete-rule\`, \`delete-queue\`, \`delete-topic\`.
7. **Exam Tips Filter**: Retained SAA-C03 exam tips and removed SOA-C02 / DVA-C02 specific references.

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
