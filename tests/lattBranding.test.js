import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const activeBrandFiles = [
  'src/App.jsx',
  'src/components/Navbar.jsx',
  'src/components/Landing/AppLandingPage.jsx',
  'src/features/demo/DemoAccessGate.jsx',
  'src/utils/exportUtils.js'
];

test('active application branding uses LATT and preserves legacy storage compatibility', () => {
  const activeBranding = activeBrandFiles.map(path => readFileSync(path, 'utf8')).join('\n');
  const demoMode = readFileSync('src/features/demo/demoMode.js', 'utf8');
  const storage = readFileSync('src/utils/storage.js', 'utf8');

  assert.doesNotMatch(activeBranding, /Exam[ -]?Pulse|ExamPulse/i);
  assert.match(activeBranding, /LATT/);
  assert.match(activeBranding, /Learning All Things Tech/);
  assert.match(demoMode, /demo@latt\.invalid/);
  assert.match(storage, /exampulse_exams_v1/);
  assert.match(storage, /LATT_Backup_/);
});
