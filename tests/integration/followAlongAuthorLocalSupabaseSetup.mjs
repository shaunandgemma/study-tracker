import { createClient } from '@supabase/supabase-js';
import { execFileSync } from 'node:child_process';

function readLocalStatus() {
  const workdir = process.env.STEP46_SUPABASE_WORKDIR;
  if (!workdir) return {};
  const output = execFileSync('./node_modules/.bin/supabase', [
    '--workdir',
    workdir,
    'status',
    '-o',
    'env'
  ], { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  return Object.fromEntries(output.trim().split(/\r?\n/).map(line => {
    const separator = line.indexOf('=');
    const key = line.slice(0, separator);
    const value = line.slice(separator + 1).replace(/^"|"$/g, '');
    return [key, value];
  }));
}

const localStatus = readLocalStatus();
const url = process.env.STEP46_SUPABASE_URL || localStatus.API_URL;
const secret = process.env.STEP46_SUPABASE_SECRET || localStatus.SECRET_KEY;

if (!url?.startsWith('http://127.0.0.1:')) {
  throw new Error('Step 46 requires a loopback-only Supabase URL.');
}

if (!secret?.startsWith('sb_secret_')) {
  throw new Error('Step 46 requires the disposable local secret key.');
}

const admin = createClient(url, secret, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const password = 'Step46-Local-Only!2026';
const definitions = [
  { label: 'author1', email: 'step46-author-1@example.test', role: 'author' },
  { label: 'author2', email: 'step46-author-2@example.test', role: 'author' },
  { label: 'approver', email: 'step46-approver@example.test', role: 'approver' },
  { label: 'learner', email: 'step46-learner@example.test', role: 'learner' }
];

const { data: listed, error: listError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000
});
if (listError) throw listError;

const existingByEmail = new Map((listed.users || []).map(user => [user.email, user]));
const users = {};

for (const definition of definitions) {
  const attributes = {
    password,
    email_confirm: true,
    app_metadata: { role: definition.role }
  };
  const existing = existingByEmail.get(definition.email);
  const result = existing
    ? await admin.auth.admin.updateUserById(existing.id, attributes)
    : await admin.auth.admin.createUser({ email: definition.email, ...attributes });
  if (result.error) throw result.error;
  users[definition.label] = result.data.user;
}

for (const definition of definitions) {
  const user = users[definition.label];
  if (!user?.id || user.app_metadata?.role !== definition.role) {
    throw new Error(`Local ${definition.label} role setup failed.`);
  }
}

console.log(JSON.stringify({
  success: true,
  localOnly: true,
  users: definitions.map(definition => ({
    label: definition.label,
    email: definition.email,
    id: users[definition.label].id,
    role: users[definition.label].app_metadata.role
  }))
}, null, 2));
