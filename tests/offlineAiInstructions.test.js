import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('external AI instructions require portable source files without local builder access', () => {
  const instructions = readFileSync('AI_Follow_Along_Steps.txt', 'utf8');

  assert.match(instructions, /offline-follow-along-manuscript\.json/);
  assert.match(instructions, /offline-follow-along-preview\.md/);
  assert.match(instructions, /Never stop or refuse because those tools are unavailable/);
  assert.match(instructions, /local command—not the external AI—creates and verifies the controlled handoff and fingerprint/);
  assert.doesNotMatch(instructions, /Use this verified builder only as the structural reference/);
  assert.doesNotMatch(instructions, /Calculate the handoff fingerprint using the existing app fingerprint helper/);
  assert.doesNotMatch(instructions, /buildStage90ALocalAcceptance/);
});
