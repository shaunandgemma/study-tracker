import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const read = file => readFileSync(file, 'utf8');

test('Independent AWS connection foundation', async (t) => {
  const { createServer } = await import('vite');
  const cacheDir = await mkdtemp(join(tmpdir(), 'aws-connection-foundation-test-'));
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

  const authModule = await viteServer.ssrLoadModule('/src/features/auth/AuthContext.jsx');
  const contextModule = await viteServer.ssrLoadModule('/src/features/awsConnection/AwsConnectionContext.jsx');
  const hookModule = await viteServer.ssrLoadModule('/src/features/awsConnection/useAwsConnection.js');
  const { AuthContext } = authModule;
  const { AwsConnectionProvider } = contextModule;
  const { useAwsConnection } = hookModule;

  await t.test('1. Provider is nested beneath AuthProvider and active', () => {
    const appSource = read('src/App.jsx');
    assert.match(appSource, /<AuthProvider>[\s\S]*<AuthenticatedApplication \/>/);
    assert.match(appSource, /<AwsConnectionProvider enabled=\{!isDemoAccount\}>[\s\S]*<ExamProvider[^>]*>[\s\S]*<MainContent \/>/);
  });

  await t.test('2. Standby context renders a stable inactive state', () => {
    const Probe = () => {
      const value = useAwsConnection();
      return createElement('output', {
        'data-enabled': String(value.enabled),
        'data-status': value.connectionStatus,
        'data-loading': String(value.loadingConnection),
      });
    };
    const html = renderToStaticMarkup(
      createElement(AuthContext.Provider, { value: { currentUser: { id: 'user-123' } } },
        createElement(AwsConnectionProvider, { enabled: false }, createElement(Probe))),
    );
    assert.match(html, /data-enabled="false"/);
    assert.match(html, /data-status="disconnected"/);
    assert.match(html, /data-loading="false"/);
  });

  await t.test('3. AWS connection context depends on AuthContext, not TaskContext', () => {
    const source = read('src/features/awsConnection/AwsConnectionContext.jsx');
    assert.match(source, /features\/auth\/useAuth\.js|\.\.\/auth\/useAuth\.js/);
    assert.match(source, /const \{ currentUser \} = useAuth\(\)/);
    assert.doesNotMatch(source, /TaskContext|useTask|HandsOnTasks/);
  });

  await t.test('4. Standby remains available as a safety switch', () => {
    const source = read('src/features/awsConnection/AwsConnectionContext.jsx');
    assert.match(source, /enabled = false/);
    assert.match(source, /if \(!enabled\) return standbyResult\(\)/);
    assert.match(source, /independent AWS connection provider is in standby during migration/);
    assert.match(source, /if \(!enabled\) \{\s*setAwsConnection\(null\)/);
  });

  await t.test('5. Enabled provider loads per user and clears signed-out state', () => {
    const source = read('src/features/awsConnection/AwsConnectionContext.jsx');
    assert.match(source, /services\.loadUserAwsConnection\(userId\)/);
    assert.match(source, /\[enabled, services, userId\]/);
    assert.match(source, /if \(!userId\) \{\s*setAwsConnection\(null\);\s*setLoadingConnection\(false\);\s*setTestConnectionResult\(null\)/);
    assert.match(source, /let isActive = true/);
    assert.match(source, /isActive = false/);
  });

  await t.test('6. Test and save reuse the existing service operations', () => {
    const source = read('src/features/awsConnection/AwsConnectionContext.jsx');
    assert.match(source, /services\.testAwsConnection\(\{ accountId, roleArn, externalId \}\)/);
    assert.match(source, /services\.saveUserAwsConnection\(userId/);
    assert.match(source, /awsAccountId: accountId\.trim\(\)/);
    assert.match(source, /roleArn: roleArn\.trim\(\)/);
    assert.match(source, /externalId: externalId\.trim\(\)/);
    assert.match(source, /Authentication required\. Please sign in to save your AWS connection/);
  });

  await t.test('7. Disconnect and External ID regeneration retain current behaviour', () => {
    const source = read('src/features/awsConnection/AwsConnectionContext.jsx');
    assert.match(source, /services\.deleteUserAwsConnection\(userId\)/);
    assert.match(source, /services\.regenerateUserExternalId\(userId, accountId, roleArn\)/);
    assert.match(source, /External ID regenerated\. Please update your AWS CloudFormation stack/);
    assert.match(source, /setTestConnectionResult\(null\)/);
  });

  await t.test('8. Hook protects consumers outside the provider', () => {
    const source = read('src/features/awsConnection/useAwsConnection.js');
    assert.match(source, /useAwsConnection must be used within an AwsConnectionProvider/);
  });

  await t.test('9. TaskContext is retired without affecting AWS connection ownership', () => {
    assert.equal(existsSync('src/context/TaskContext.jsx'), false);
    assert.match(read('src/App.jsx'), /<AwsConnectionProvider enabled=\{!isDemoAccount\}>/);
  });
});
