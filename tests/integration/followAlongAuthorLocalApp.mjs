import { execFileSync, spawn } from 'node:child_process';

const workdir = process.env.STEP46_SUPABASE_WORKDIR;
if (!workdir) throw new Error('The disposable local Supabase work folder is required.');

const output = execFileSync('./node_modules/.bin/supabase', [
  '--workdir', workdir, 'status', '-o', 'env'
], { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
const status = Object.fromEntries(output.trim().split(/\r?\n/).map(line => {
  const separator = line.indexOf('=');
  return [line.slice(0, separator), line.slice(separator + 1).replace(/^"|"$/g, '')];
}));

if (!status.API_URL?.startsWith('http://127.0.0.1:') || !status.PUBLISHABLE_KEY?.startsWith('sb_publishable_')) {
  throw new Error('Step 46 will only start against the disposable loopback Supabase system.');
}

const app = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '4173'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    VITE_SUPABASE_URL: status.API_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: status.PUBLISHABLE_KEY,
    VITE_FOLLOW_ALONG_AUTHOR_SHARED_STORAGE: 'true'
  },
  stdio: 'inherit'
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => app.kill(signal));
}

app.on('exit', code => process.exitCode = code ?? 0);
