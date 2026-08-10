import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

test('Follow Along AWS validation display boundary', async (t) => {
  const { createServer } = await import('vite');
  const cacheDir = await mkdtemp(join(tmpdir(), 'follow-along-validation-test-'));
  const viteServer = await createServer({
    configFile: false,
    root: process.cwd(),
    cacheDir,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });
  t.after(async () => {
    await viteServer.close();
    await rm(cacheDir, { recursive: true, force: true });
  });

  const panelModule = await viteServer.ssrLoadModule(
    '/src/features/followAlongs/runtime/FollowAlongAwsValidationPanel.jsx',
  );
  const {
    FollowAlongAwsValidationUnavailable,
    getFollowAlongConnectionMode,
    getFollowAlongResourceInputConfig,
  } = panelModule;

  await t.test('1. Unavailable validation gives the learner a clear message', () => {
    const html = renderToStaticMarkup(createElement(FollowAlongAwsValidationUnavailable, {
      task: { service: 'Amazon EC2' },
    }));
    assert.match(html, /AWS Resource Verification/);
    assert.match(html, /Live validation is not yet available for this lab/);
    assert.match(html, /Amazon EC2/);
  });

  await t.test('2. Known AWS resource types keep their existing labels', () => {
    const expectedLabels = new Map([
      ['bucketName', 'Target S3 Bucket Name'],
      ['instanceId', 'EC2 Instance ID'],
      ['vpcId', 'Amazon VPC ID'],
      ['groupId', 'Security Group ID'],
      ['dbInstanceIdentifier', 'RDS DB Instance Identifier'],
      ['tableName', 'DynamoDB Table Name'],
      ['roleName', 'IAM Role Name'],
      ['alarmName', 'CloudWatch Alarm Name'],
    ]);
    for (const [resourceInput, label] of expectedLabels) {
      const config = getFollowAlongResourceInputConfig(resourceInput);
      assert.equal(config.label, label);
      assert.equal(config.required, true);
      assert.ok(config.placeholder);
      assert.ok(config.hint);
    }
  });

  await t.test('3. Unknown resources retain the optional generic input', () => {
    assert.deepEqual(getFollowAlongResourceInputConfig('unknownResource'), {
      label: 'Target Resource Identifier',
      placeholder: 'Enter resource name or ID',
      required: false,
      hint: 'Enter the resource identifier created in AWS for validation.',
    });
  });

  await t.test('4. Connection display states remain compatible', () => {
    assert.equal(getFollowAlongConnectionMode(null), 'simulation');
    assert.equal(getFollowAlongConnectionMode({ status: 'simulation' }), 'simulation');
    assert.equal(getFollowAlongConnectionMode({ status: 'connected', backendVerified: true }), 'connected');
    assert.equal(getFollowAlongConnectionMode({ status: 'disconnected', backendVerified: true }), 'disconnected');
  });

  await t.test('5. The boundary preserves existing AWS services and resets between tasks', () => {
    const panelSource = readFileSync(
      'src/features/followAlongs/runtime/FollowAlongAwsValidationPanel.jsx',
      'utf8',
    );
    assert.doesNotMatch(panelSource, /components\/HandsOnTasks/);
    assert.match(panelSource, /services\/awsConnectionService/);
    assert.match(panelSource, /data\/taskValidationRegistry/);
    assert.match(panelSource, /validateTaskResource\(task, awsConnection, resourceInput\.trim\(\)\)/);
    assert.match(panelSource, /setResourceInput\(''\)/);
    assert.match(panelSource, /setValidationResult\(null\)/);
    assert.match(panelSource, /\[task\?\.id\]/);
  });
});
