const runtimeEnv = import.meta.env || {};

export const DEMO_MODE_FLAG = 'VITE_DEMO_MODE';
export const DEMO_SESSION_KEY = 'exampulse_demo_session_v1';

export const DEMO_USER = Object.freeze({
  id: 'demo-read-only',
  email: 'demo@latt.invalid',
  app_metadata: Object.freeze({ role: 'demo', roles: Object.freeze(['demo']) }),
  user_metadata: Object.freeze({ display_name: 'Demo Learner' }),
  is_demo: true
});

export const DEMO_CHECKLIST = Object.freeze({
  'aws-saa-c03': Object.freeze({
    'cloud-concepts-1': true,
    'iam-1': true,
    'vpc-1': true
  }),
  'terraform-associate-004': Object.freeze({
    'tf004-1a': true,
    'tf004-1b': true,
    'tf004-2a': true
  })
});

export const DEMO_EXAM_HISTORY = Object.freeze([
  Object.freeze({
    id: 'demo-attempt-terraform',
    examId: 'terraform-associate-004',
    timestamp: '2026-08-18T10:00:00.000Z',
    scorePercentage: 78,
    passed: true,
    durationSeconds: 1260,
    mode: 'custom',
    demo: true
  }),
  Object.freeze({
    id: 'demo-attempt-aws',
    examId: 'aws-saa-c03',
    timestamp: '2026-08-17T10:00:00.000Z',
    scorePercentage: 72,
    passed: true,
    durationSeconds: 2400,
    mode: 'targeted',
    demo: true
  })
]);

const demoStorageValues = new Map();

export const demoProgressStorage = Object.freeze({
  getItem(key) {
    return demoStorageValues.has(String(key)) ? demoStorageValues.get(String(key)) : null;
  },
  setItem(key, value) {
    demoStorageValues.set(String(key), String(value));
  },
  removeItem(key) {
    demoStorageValues.delete(String(key));
  },
  clear() {
    demoStorageValues.clear();
  }
});

export function isDemoModeEnabled(environment = runtimeEnv) {
  return String(environment?.[DEMO_MODE_FLAG] || '').trim().toLowerCase() === 'true';
}

export function isDemoUser(user) {
  return user?.is_demo === true || user?.id === DEMO_USER.id;
}

export function getApplicationRoles(user) {
  const metadata = user?.app_metadata;
  if (!metadata || typeof metadata !== 'object') return [];
  const roles = [];
  if (typeof metadata.role === 'string') roles.push(metadata.role);
  if (Array.isArray(metadata.roles)) roles.push(...metadata.roles);
  return [...new Set(roles.map(role => String(role).trim().toLowerCase()).filter(Boolean))];
}

export function isAdminUser(user) {
  return Boolean(user?.id) && !isDemoUser(user) && getApplicationRoles(user).includes('admin');
}

export function hasStoredDemoSession(storage = globalThis.sessionStorage) {
  try {
    return storage?.getItem(DEMO_SESSION_KEY) === 'active';
  } catch {
    return false;
  }
}

export function storeDemoSession(active, storage = globalThis.sessionStorage) {
  try {
    if (active) storage?.setItem(DEMO_SESSION_KEY, 'active');
    else storage?.removeItem(DEMO_SESSION_KEY);
  } catch {
    // A blocked session store still permits an in-memory demo session.
  }
}

export function resetDemoData() {
  demoProgressStorage.clear();
}

export function cloneDemoChecklist() {
  return structuredClone(DEMO_CHECKLIST);
}

export function cloneDemoExamHistory() {
  return structuredClone(DEMO_EXAM_HISTORY);
}

export function buildDemoAttempts(exam) {
  const questions = Array.isArray(exam?.questions) ? exam.questions.slice(0, 3) : [];
  if (!questions.length) return [];
  const answers = Object.fromEntries(questions.map(question => [
    question.id,
    Array.isArray(question.correctAnswers)
      ? question.correctAnswers
      : Number.isInteger(question.correctAnswer)
        ? [question.correctAnswer]
        : []
  ]));
  return [{
    id: `demo-supabase-attempt-${exam.id}`,
    exam_code: exam.id,
    exam_mode: 'custom',
    selection_type: 'balanced',
    timer_type: 'untimed',
    requested_question_count: questions.length,
    actual_question_count: questions.length,
    total_questions: questions.length,
    correct_count: questions.length,
    score_percent: 100,
    passed: true,
    time_used_seconds: 300,
    time_allowed_seconds: 0,
    completed_at: '2026-08-18T10:00:00.000Z',
    question_snapshot: questions,
    answers,
    demo: true
  }];
}
