const RDS_GOLD_STANDARD_PROGRAMME_ID = 'rds-learning-path';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function instructionText(item) {
  return clean(typeof item === 'string' ? item : item?.text);
}

function taskList(content) {
  return Array.isArray(content?.tasks) ? content.tasks : Object.values(content?.tasks || {});
}

function completeConsoleAndCliReference(content) {
  return {
    phases: (content?.phases || []).map(phase => ({
      title: clean(phase.title),
      description: clean(phase.description),
      isOptional: Boolean(phase.isOptional)
    })),
    tasks: taskList(content).map(task => ({
      title: clean(task.title),
      feature: clean(task.feature),
      goal: clean(task.goal),
      whyItMatters: clean(task.whyItMatters),
      prerequisites: [...(task.prerequisites || task.prerequisiteTaskIds || [])],
      consoleSteps: (task.consoleSteps || []).map(step => ({
        title: clean(step.title),
        instruction: clean(step.instruction),
        instructions: (step.instructions || []).map(instructionText).filter(Boolean),
        jsonBlocks: (step.jsonBlocks || []).map(block => ({
          title: clean(block.title),
          language: clean(block.language),
          content: clean(block.content)
        })),
        expectedResult: clean(step.expectedResult),
        warning: clean(step.warning)
      })),
      cliSteps: (task.cliSteps || []).map(step => ({
        command: clean(step.command),
        explanation: clean(step.explanation),
        expectedResult: clean(step.expectedResult),
        warning: clean(step.warning)
      })),
      verification: (task.verification || []).map(check => ({
        title: clean(check.title),
        instruction: clean(check.instruction),
        expectedResult: clean(check.expectedResult),
        mode: clean(check.mode)
      })),
      cleanup: (task.cleanup || []).map(item => ({
        title: clean(item.title),
        instruction: clean(item.instruction || item.description),
        verification: clean(item.verification)
      }))
    })),
    finalCleanup: (content?.finalCleanup || []).map(item => ({
      title: clean(item.title),
      instruction: clean(item.instruction || item.description),
      verification: clean(item.verification)
    })),
    warnings: content?.warnings || {}
  };
}

export function buildBeginnerGoldStandardReference(publishedProgramme) {
  if (publishedProgramme?.programmeId !== RDS_GOLD_STANDARD_PROGRAMME_ID || !publishedProgramme.runtimeContent) {
    throw new Error('The published RDS gold-standard Follow Along is unavailable. Nothing was generated.');
  }
  const completeReference = completeConsoleAndCliReference(publishedProgramme.runtimeContent);
  if (!completeReference.tasks.length || completeReference.tasks.some(task => !task.consoleSteps.length || !task.cliSteps.length)) {
    throw new Error('The published RDS gold-standard Follow Along does not contain complete Console and CLI task content. Nothing was generated.');
  }
  return {
    kind: 'author_assistant_beginner_gold_standard',
    programmeId: publishedProgramme.programmeId,
    displayName: publishedProgramme.displayName,
    sourceRevision: Number(publishedProgramme.sourceRevision),
    contentHash: clean(publishedProgramme.contentHash),
    useBoundary: 'Complete Console and CLI writing depth, learner guidance and task completeness only. Never copy RDS resources, permissions, names or architecture into another AWS service.',
    requiredStandard: [
      'Assume the learner has no existing infrastructure and may never have used the service.',
      'Create every prerequisite resource before referring to it.',
      'Give the exact Console navigation, visible control label, field name and training value.',
      'Keep each checkbox to one action while preserving enough context to perform it.',
      'Explain where every recorded value and placeholder comes from.',
      'Supply structured JSON in a JSON block, followed by the exact button used to continue.',
      'When a Console or CLI instruction refers to supplied JSON, user data, a policy, a trust document or any local file, include the complete referenced content next to the route that uses it.',
      'Make every CLI route independently usable: include every required file body, placeholder origin, command explanation, expected result and verification instead of relying on the Console route.',
      'State a visible expected result and a separate verification after important work.',
      'Keep the Console and CLI routes complete and separate, with safe resource-specific cleanup.',
      'Inventory every resource created by the Follow Along and remove each one exactly once in strict reverse dependency order, using complete Console and CLI teardown guidance with visible deletion verification.'
    ],
    completeConsoleAndCliReference: completeReference
  };
}

const VAGUE_PHRASES = [
  /\bas appropriate\b/i,
  /\bas needed\b/i,
  /\bchoose (?:a|an|the) suitable\b/i,
  /\bselect (?:a|an|the) suitable\b/i,
  /\buse (?:a|an|the) suitable\b/i,
  /\bchoose (?:a|an|the) existing\b/i,
  /\bselect (?:a|an|the) existing\b/i,
  /\bconfigure (?:it|this|the resource|the settings)\b/i,
  /\benter the required (?:value|values|settings)\b/i
];

function hasConsoleNavigation(task) {
  const text = (task.consoleSteps || []).flatMap(step => step.instructions || []).map(instructionText).join(' ');
  return /AWS (?:Management )?Console|Console search|search bar|under Services|left (?:navigation|menu)|navigation pane|breadcrumb/i.test(text);
}

export function findBeginnerQualityFindings(proposal) {
  const findings = [];
  (proposal?.tasks || []).forEach((task, taskIndex) => {
    const taskNumber = taskIndex + 1;
    if (!hasConsoleNavigation(task)) findings.push(`Task ${taskNumber} does not tell a beginner how to navigate to the relevant AWS Console area.`);
    (task.consoleSteps || []).forEach((step, stepIndex) => {
      const instructions = (step.instructions || []).map(instructionText).filter(Boolean);
      instructions.forEach((instruction, instructionIndex) => {
        if (VAGUE_PHRASES.some(pattern => pattern.test(instruction))) findings.push(`Task ${taskNumber} Console step ${stepIndex + 1} checkbox ${instructionIndex + 1} uses vague wording: "${instruction}"`);
        if (/^Open\s+(?:Subnets|Security Groups|Roles|Users|Queues|Databases|Instances|Functions|Topics|Buckets)\.?$/i.test(instruction)) findings.push(`Task ${taskNumber} Console step ${stepIndex + 1} checkbox ${instructionIndex + 1} names a page without explaining how to reach it.`);
        if (/^Record\b/i.test(instruction) && !/\b(from|shown|displayed|under|on the|in the|copy)\b/i.test(instruction)) findings.push(`Task ${taskNumber} Console step ${stepIndex + 1} checkbox ${instructionIndex + 1} does not explain where the recorded value comes from.`);
      });
      const mentionsJson = [step.title, ...instructions].some(value => /\bJSON\b|policy editor content/i.test(clean(value)));
      if (mentionsJson && !(step.jsonBlocks || []).length) findings.push(`Task ${taskNumber} Console step ${stepIndex + 1} refers to JSON but supplies no JSON block.`);
    });
  });
  return findings;
}

export function findReviewableProposalFindings(proposal) {
  const findings = [];
  (proposal?.tasks || []).forEach((task, taskIndex) => {
    (task.cliSteps || []).forEach((step, stepIndex) => {
      if (/\s(?:&&|;|\|)\s/.test(clean(step.command))) findings.push(`Task ${taskIndex + 1} CLI step ${stepIndex + 1} contains more than one shell operation. Replace it with separate CLI steps that each contain exactly one command.`);
    });
  });
  return findings;
}

export function validateBeginnerQuality(proposal) {
  const findings = findBeginnerQualityFindings(proposal);
  if (findings.length) throw new Error(`The AI beginner-quality review did not resolve ${findings.length} problem(s). ${findings.slice(0, 3).join(' ')}`);
  return proposal;
}

export function buildBeginnerQualityReviewSchema(completeSchema, taskCount) {
  const taskSchema = completeSchema.properties.tasks.items;
  const taskNumbers = Array.from({ length: taskCount }, (_value, index) => index + 1);
  return {
    type: 'object',
    properties: {
      passed: { type: 'boolean' },
      taskReviews: {
        type: 'array', maxItems: taskCount,
        items: {
          type: 'object',
          properties: {
            taskNumber: { type: 'integer', enum: taskNumbers },
            passed: { type: 'boolean' },
            findings: { type: 'array', items: { type: 'string' } },
            revisedTask: { anyOf: [taskSchema, { type: 'null' }] }
          },
          required: ['taskNumber', 'passed', 'findings', 'revisedTask'],
          additionalProperties: false
        }
      }
    },
    required: ['passed', 'taskReviews'],
    additionalProperties: false
  };
}

export function applyBeginnerQualityReview(proposal, review, { allowPartial = false } = {}) {
  if (!Array.isArray(review?.taskReviews)) {
    if (!allowPartial) throw new Error('The AI beginner-quality review did not review every task.');
    const preserved = structuredClone(proposal);
    preserved.manualReviewFindings = [...(preserved.manualReviewFindings || []), 'The AI beginner-quality review returned no usable task reviews. Review every generated task manually before creating a release candidate.'];
    return preserved;
  }
  const seen = new Set();
  const revised = structuredClone(proposal);
  const manualFindings = [];
  for (const item of review.taskReviews) {
    const number = Number(item.taskNumber);
    if (!Number.isInteger(number) || number < 1 || number > revised.tasks.length || seen.has(number)) {
      if (!allowPartial) throw new Error('The AI beginner-quality review returned an invalid task number.');
      manualFindings.push('The AI beginner-quality review returned an invalid or duplicate task number. The unmatched generated task content was preserved for manual review.');
      continue;
    }
    seen.add(number);
    if (item.passed && item.revisedTask) {
      if (!allowPartial) throw new Error(`The AI beginner-quality review tried to replace task ${number} after marking it as passed.`);
      manualFindings.push(`Task ${number} was marked passed while also containing a replacement. The original generated task was preserved for manual review.`);
      continue;
    }
    if (!item.passed && !item.revisedTask) {
      if (!allowPartial) throw new Error(`The AI beginner-quality review found problems in task ${number} but did not correct them.`);
      manualFindings.push(`Task ${number} was reported as needing correction, but no corrected task was returned. The original generated task was preserved for manual review.`);
      continue;
    }
    if (item.revisedTask) revised.tasks[number - 1] = item.revisedTask;
  }
  const missing = revised.tasks.map((_task, index) => index + 1).filter(number => !seen.has(number));
  if (missing.length) {
    if (!allowPartial) throw new Error('The AI beginner-quality review did not review every task.');
    manualFindings.push(`The AI beginner-quality review did not return task review(s) for task number(s): ${missing.join(', ')}. Their original generated content was preserved for manual review.`);
  }
  revised.manualReviewFindings = [...(revised.manualReviewFindings || []), ...manualFindings];
  return revised;
}

export { RDS_GOLD_STANDARD_PROGRAMME_ID };
