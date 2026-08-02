import { supabase } from '../lib/supabase.js';
import { DEFAULT_EXAMS } from '../data/examData.js';

/**
 * Validates a task definition against schema rules.
 * Throws an Error with a descriptive message if invalid.
 */
export function validateTaskSchema(task) {
  if (!task || typeof task !== 'object') throw new Error('Task must be a valid object');
  if (!task.id || typeof task.id !== 'string' || !task.id.trim()) {
    throw new Error('Task must have a non-empty string id');
  }
  if (!task.examCode || typeof task.examCode !== 'string') {
    throw new Error(`Task ${task.id} must have a valid examCode`);
  }
  if (!task.topicId || typeof task.topicId !== 'string') {
    throw new Error(`Task ${task.id} must have a valid topicId`);
  }
  if (!['Easy', 'Medium', 'Hard'].includes(task.difficulty)) {
    throw new Error(`Task ${task.id} has invalid difficulty: ${task.difficulty}`);
  }
  if (!Array.isArray(task.consoleSteps) && !Array.isArray(task.cliSteps)) {
    throw new Error(`Task ${task.id} must provide at least one mode: consoleSteps or cliSteps`);
  }
  if (!Array.isArray(task.verification) || task.verification.length === 0) {
    throw new Error(`Task ${task.id} must have a non-empty verification array`);
  }
  if (!Array.isArray(task.cleanup) || task.cleanup.length === 0) {
    throw new Error(`Task ${task.id} must have a non-empty cleanup array`);
  }

  // Validate step and item ID uniqueness
  const stepIds = new Set();
  const itemIds = new Set();

  const checkSteps = (steps, modeName) => {
    if (!Array.isArray(steps)) return;
    steps.forEach((step, sIdx) => {
      if (!step.id || typeof step.id !== 'string') {
        throw new Error(`Task ${task.id} ${modeName} step at index ${sIdx} missing string id`);
      }
      if (stepIds.has(step.id)) {
        throw new Error(`Task ${task.id} duplicate step id: ${step.id}`);
      }
      stepIds.add(step.id);

      if (step.instructions) {
        step.instructions.forEach((ins, iIdx) => {
          if (!ins.id || typeof ins.id !== 'string') {
            throw new Error(`Task ${task.id} ${modeName} step ${step.id} instruction ${iIdx} missing string id`);
          }
          if (itemIds.has(ins.id)) {
            throw new Error(`Task ${task.id} duplicate instruction id: ${ins.id}`);
          }
          itemIds.add(ins.id);
        });
      }

      if (step.commands) {
        step.commands.forEach((cmd, cIdx) => {
          if (!cmd.id || typeof cmd.id !== 'string') {
            throw new Error(`Task ${task.id} ${modeName} step ${step.id} command ${cIdx} missing string id`);
          }
          if (typeof cmd.text !== 'string') {
            throw new Error(`Task ${task.id} ${modeName} step ${step.id} command ${cmd.id} text must be a string`);
          }
        });
      }
    });
  };

  checkSteps(task.consoleSteps, 'Console');
  checkSteps(task.cliSteps, 'CLI');

  // Verify no raw HTML tags in task string properties
  const rawHtmlRegex = /<[a-z][\s\S]*>/i;
  const checkForHtml = (val, path) => {
    if (typeof val === 'string' && rawHtmlRegex.test(val)) {
      throw new Error(`Task ${task.id} field '${path}' contains raw HTML: "${val.slice(0, 30)}..."`);
    }
  };

  checkForHtml(task.title, 'title');
  checkForHtml(task.goal, 'goal');
  checkForHtml(task.whyItMatters, 'whyItMatters');
}

/**
 * Calculates progress for a task based on completed item IDs.
 *
 * @param {Object} task - Full task definition
 * @param {Object} progressRecord - User progress record for this task
 * @param {string} selectedMode - 'console' | 'cli'
 * @returns {Object} Calculated metrics
 */
export function calculateTaskProgress(task, progressRecord = {}, selectedMode = 'console') {
  if (!task) return { overallPercent: 0, isCompleted: false, completedStepCount: 0, totalStepCount: 0 };

  const consoleCompleted = new Set(progressRecord.consoleCompletedItems || []);
  const cliCompleted = new Set(progressRecord.cliCompletedItems || []);
  const verifyCompleted = new Set(progressRecord.verificationCompletedItems || []);
  const cleanupCompleted = new Set(progressRecord.cleanupCompletedItems || []);

  // Helper to count completed main steps in a mode
  const calcModeStats = (steps, completedSet) => {
    if (!Array.isArray(steps) || steps.length === 0) {
      return { totalSteps: 0, completedSteps: 0, totalItems: 0, completedItems: 0 };
    }

    let totalSteps = steps.length;
    let completedSteps = 0;
    let totalItems = 0;
    let completedItems = 0;

    steps.forEach(step => {
      const instructions = step.instructions || [];
      if (instructions.length > 0) {
        // Step with sub-instructions
        const stepItemsTotal = instructions.length;
        const stepItemsDone = instructions.filter(i => completedSet.has(i.id)).length;
        totalItems += stepItemsTotal;
        completedItems += stepItemsDone;
        if (stepItemsDone === stepItemsTotal) {
          completedSteps++;
        }
      } else {
        // Step without sub-instructions (e.g. CLI command step)
        totalItems += 1;
        if (completedSet.has(step.id)) {
          completedItems += 1;
          completedSteps++;
        }
      }
    });

    return { totalSteps, completedSteps, totalItems, completedItems };
  };

  const consoleStats = calcModeStats(task.consoleSteps, consoleCompleted);
  const cliStats = calcModeStats(task.cliSteps, cliCompleted);

  const consolePercent = consoleStats.totalItems > 0
    ? Math.round((consoleStats.completedItems / consoleStats.totalItems) * 100)
    : 0;

  const cliPercent = cliStats.totalItems > 0
    ? Math.round((cliStats.completedItems / cliStats.totalItems) * 100)
    : 0;

  const totalVerify = task.verification ? task.verification.length : 0;
  const doneVerify = task.verification ? task.verification.filter(v => verifyCompleted.has(v.id)).length : 0;
  const verificationPercent = totalVerify > 0 ? Math.round((doneVerify / totalVerify) * 100) : 0;

  const totalCleanup = task.cleanup ? task.cleanup.length : 0;
  const doneCleanup = task.cleanup ? task.cleanup.filter(c => cleanupCompleted.has(c.id)).length : 0;
  const cleanupPercent = totalCleanup > 0 ? Math.round((doneCleanup / totalCleanup) * 100) : 0;

  // Selected mode stats
  const activeStats = selectedMode === 'cli' ? cliStats : consoleStats;

  // Overall required items calculation based on selected mode + verification + cleanup
  const requiredTotal = activeStats.totalItems + totalVerify + totalCleanup;
  const requiredDone = activeStats.completedItems + doneVerify + doneCleanup;
  const overallPercent = requiredTotal > 0 ? Math.round((requiredDone / requiredTotal) * 100) : 0;

  // Completion criteria:
  // - Mode steps complete (100%)
  // - Verification complete (100%)
  // - Cleanup complete (100%)
  const stepsComplete = activeStats.totalItems > 0 && activeStats.completedItems === activeStats.totalItems;
  const verifyComplete = totalVerify > 0 && doneVerify === totalVerify;
  const cleanupComplete = totalCleanup > 0 && doneCleanup === totalCleanup;

  const isCompleted = !!(progressRecord.isCompleted || (stepsComplete && verifyComplete && cleanupComplete));
  const isCleanupPending = stepsComplete && verifyComplete && !cleanupComplete;

  return {
    consolePercent,
    cliPercent,
    verificationPercent,
    cleanupPercent,
    overallPercent,
    completedStepCount: activeStats.completedSteps,
    totalStepCount: activeStats.totalSteps,
    stepsComplete,
    verifyComplete,
    cleanupComplete,
    isCleanupPending,
    isCompleted
  };
}

/**
 * Predefined topic display labels for clean UI display.
 */
const TOPIC_LABEL_OVERRIDES = {
  'topic-s3': 'Amazon S3',
  'topic-vpc': 'Amazon VPC',
  'topic-ec2': 'Amazon EC2',
  'topic-iam': 'AWS IAM',
  'topic-elb': 'Elastic Load Balancing',
  'topic-ec2-asg': 'Auto Scaling',
  'topic-rds': 'Amazon RDS',
  'topic-aurora': 'Amazon Aurora',
  'topic-dynamodb': 'Amazon DynamoDB',
  'topic-elasticache': 'Amazon ElastiCache',
  'topic-redshift': 'Amazon Redshift',
  'topic-lambda': 'AWS Lambda',
  'topic-api-gateway': 'Amazon API Gateway',
  'topic-step-functions': 'AWS Step Functions',
  'topic-eventbridge': 'Amazon EventBridge',
  'topic-sqs': 'Amazon SQS',
  'topic-sns': 'Amazon SNS',
  'topic-ecs': 'Amazon ECS',
  'topic-fargate': 'AWS Fargate',
  'topic-eks': 'Amazon EKS',
  'topic-ecr': 'Amazon ECR',
  'topic-cloudfront': 'Amazon CloudFront',
  'topic-global-accelerator': 'AWS Global Accelerator',
  'topic-kms': 'AWS KMS',
  'topic-secrets-manager': 'AWS Secrets Manager',
  'topic-macie': 'Amazon Macie',
  'topic-guardduty': 'Amazon GuardDuty',
  'topic-cognito': 'Amazon Cognito',
  'topic-inspector': 'Amazon Inspector',
  'topic-security-hub': 'AWS Security Hub',
  'topic-network-firewall': 'AWS Network Firewall',
  'topic-waf': 'AWS WAF',
  'topic-shield': 'AWS Shield',
  'topic-mgn': 'AWS Application Migration Service',
  'topic-dms': 'AWS Database Migration Service',
  'topic-snow-family': 'AWS Snow Family',
  'topic-storage-gateway': 'AWS Storage Gateway',
  'topic-datasync': 'AWS DataSync',
  'topic-vpn': 'AWS Site-to-Site VPN',
  'topic-direct-connect': 'AWS Direct Connect',
  'topic-cloudwatch': 'Amazon CloudWatch',
  'topic-cloudtrail': 'AWS CloudTrail',
  'topic-config': 'AWS Config',
  'topic-organizations': 'AWS Organizations',
  'topic-systems-manager': 'AWS Systems Manager',
  'topic-control-tower': 'AWS Control Tower',
  'topic-service-catalog': 'AWS Service Catalog',
  'topic-trusted-advisor': 'AWS Trusted Advisor',
  'topic-kinesis': 'Amazon Kinesis',
  'topic-athena': 'Amazon Athena',
  'topic-glue': 'AWS Glue',
  'topic-emr': 'Amazon EMR',
  'topic-opensearch': 'Amazon OpenSearch Service',
  'topic-msk': 'Amazon MSK',
  'topic-lake-formation': 'AWS Lake Formation',
  'topic-quicksight': 'Amazon QuickSight',
  'topic-route53': 'Amazon Route 53',
  'topic-aws-backup': 'AWS Backup'
};

/**
 * Derives available topic filter options from the loaded task catalogue.
 * Matches topicId to display name, orders according to SAA topic hierarchy,
 * and includes only topics that currently contain active tasks.
 *
 * @param {Array} tasks - Array of loaded active task definitions
 * @returns {Array<{id: string, title: string}>} Derived topic options
 */
export function getAvailableTopicOptions(tasks = []) {
  if (!Array.isArray(tasks) || tasks.length === 0) return [];

  // Extract unique topicIds present in tasks
  const presentTopicIds = new Set(tasks.map(t => t.topicId).filter(Boolean));

  // Find SAA exam topic order from DEFAULT_EXAMS
  const saaExam = DEFAULT_EXAMS.find(e => e.id === 'aws-saa-c03');
  const saaTopics = saaExam ? saaExam.topics : [];

  const options = [];

  // Process topics in SAA exam topic order first
  saaTopics.forEach(topic => {
    if (presentTopicIds.has(topic.id)) {
      const label = TOPIC_LABEL_OVERRIDES[topic.id] || topic.title || topic.id;
      options.push({ id: topic.id, title: label });
      presentTopicIds.delete(topic.id);
    }
  });

  // Handle any remaining topicIds present in tasks but not listed in SAA exam topics configuration
  presentTopicIds.forEach(topicId => {
    const label = TOPIC_LABEL_OVERRIDES[topicId] || topicId;
    options.push({ id: topicId, title: label });
  });

  return options;
}

/**
 * Applies the Hands-On Tasks page filters without changing the loaded catalogue.
 * Default filters intentionally return every loaded task.
 */
export function filterHandsOnTasks(tasks = [], filters = {}, taskProgress = {}) {
  const {
    exam = 'all',
    topic = 'all',
    difficulty = 'all',
    status = 'all',
    search = ''
  } = filters;

  return tasks.filter(task => {
    if (exam !== 'all' && task.examCode !== exam) return false;
    if (topic !== 'all' && task.topicId !== topic) return false;
    if (difficulty !== 'all' && task.difficulty !== difficulty) return false;

    const query = search.trim().toLowerCase();
    if (query) {
      const searchableValues = [task.title, task.service, task.feature, ...(task.tags || [])];
      if (!searchableValues.some(value => String(value || '').toLowerCase().includes(query))) {
        return false;
      }
    }

    if (status !== 'all') {
      const progress = taskProgress[task.id];
      const metrics = calculateTaskProgress(task, progress || {}, progress?.selectedMode || 'console');
      const isCompleted = metrics.isCompleted;
      const isStarted = (progress?.consoleCompletedItems?.length > 0) ||
        (progress?.cliCompletedItems?.length > 0) ||
        (progress?.verificationCompletedItems?.length > 0);

      if (status === 'completed' && !isCompleted) return false;
      if (status === 'in-progress' && (!isStarted || isCompleted)) return false;
      if (status === 'not-started' && isStarted) return false;
    }

    return true;
  });
}

/**
 * Loads published task definitions.
 * Supabase is the production source of truth. Failures are surfaced so the UI
 * cannot silently replace remote data with a misleading bundled catalogue.
 */
export async function getTasks(examCode = 'aws-saa-c03', topicId = null, client = supabase) {
  let query = client.from('hands_on_tasks').select('*').eq('status', 'published');
  if (examCode) query = query.eq('exam_code', examCode);
  if (topicId) query = query.eq('topic_id', topicId);

  const { data, error } = await query;
  if (error) {
    throw new Error(`Unable to load published hands-on tasks: ${error.message || String(error)}`);
  }
  if (!Array.isArray(data)) {
    throw new Error('Unable to load published hands-on tasks: Supabase returned an invalid response.');
  }

  // Map DB snake_case columns back to camelCase task schema if stored as content json.
  return data.map(row => {
    if (row.content && typeof row.content === 'object') {
      return {
        ...row.content,
        id: row.id || row.content.id,
        examCode: row.exam_code || row.content.examCode,
        topicId: row.topic_id || row.content.topicId
      };
    }
    return row;
  });
}

/**
 * Saves a user's task progress record to Supabase hands_on_task_progress table.
 */
export async function saveProgressToSupabase(userId, taskProgressRecord) {
  if (!userId) return { data: null, error: 'User not authenticated' };

  const payload = {
    user_id: userId,
    task_id: taskProgressRecord.taskId,
    selected_mode: taskProgressRecord.selectedMode || 'console',
    console_completed_items: taskProgressRecord.consoleCompletedItems || [],
    cli_completed_items: taskProgressRecord.cliCompletedItems || [],
    verification_completed_items: taskProgressRecord.verificationCompletedItems || [],
    cleanup_completed_items: taskProgressRecord.cleanupCompletedItems || [],
    is_completed: !!taskProgressRecord.isCompleted,
    started_at: taskProgressRecord.startedAt || new Date().toISOString(),
    completed_at: taskProgressRecord.completedAt || null,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('hands_on_task_progress')
    .upsert(payload, { onConflict: 'user_id,task_id' })
    .select()
    .single();

  return { data, error };
}

/**
 * Fetches all task progress records for a user from Supabase.
 */
export async function fetchProgressFromSupabase(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('hands_on_task_progress')
    .select('*')
    .eq('user_id', userId);

  if (error || !Array.isArray(data)) {
    console.error('[taskService] Failed to fetch user task progress:', error);
    return [];
  }

  return data.map(row => ({
    taskId: row.task_id,
    selectedMode: row.selected_mode,
    consoleCompletedItems: row.console_completed_items || [],
    cliCompletedItems: row.cli_completed_items || [],
    verificationCompletedItems: row.verification_completed_items || [],
    cleanupCompletedItems: row.cleanup_completed_items || [],
    isCompleted: row.is_completed,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    updatedAt: row.updated_at
  }));
}

/**
 * Safely merges guest local task progress into Supabase after sign-in.
 * Does not overwrite newer remote progress.
 */
export async function mergeGuestProgressIntoSupabase(userId, guestProgressMap = {}) {
  if (!userId || !guestProgressMap || Object.keys(guestProgressMap).length === 0) {
    return;
  }

  const remoteProgressList = await fetchProgressFromSupabase(userId);
  const remoteByTaskId = new Map(remoteProgressList.map(p => [p.taskId, p]));

  for (const taskId of Object.keys(guestProgressMap)) {
    const guestProg = guestProgressMap[taskId];
    const remoteProg = remoteByTaskId.get(taskId);

    let mergedRecord = guestProg;

    if (remoteProg) {
      // Merge unique item IDs from both local and remote
      const consoleSet = new Set([...(remoteProg.consoleCompletedItems || []), ...(guestProg.consoleCompletedItems || [])]);
      const cliSet = new Set([...(remoteProg.cliCompletedItems || []), ...(guestProg.cliCompletedItems || [])]);
      const verifySet = new Set([...(remoteProg.verificationCompletedItems || []), ...(guestProg.verificationCompletedItems || [])]);
      const cleanupSet = new Set([...(remoteProg.cleanupCompletedItems || []), ...(guestProg.cleanupCompletedItems || [])]);

      mergedRecord = {
        taskId,
        selectedMode: remoteProg.selectedMode || guestProg.selectedMode || 'console',
        consoleCompletedItems: Array.from(consoleSet),
        cliCompletedItems: Array.from(cliSet),
        verificationCompletedItems: Array.from(verifySet),
        cleanupCompletedItems: Array.from(cleanupSet),
        isCompleted: remoteProg.isCompleted || guestProg.isCompleted,
        startedAt: remoteProg.startedAt || guestProg.startedAt,
        completedAt: remoteProg.completedAt || guestProg.completedAt
      };
    }

    await saveProgressToSupabase(userId, mergedRecord);
  }
}
