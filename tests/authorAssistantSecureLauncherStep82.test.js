import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { DEFAULT_AUTHOR_ASSISTANT_MODEL } from '../scripts/author-assistant/authorAssistantResearch.mjs';

test('Step 82 secure local launcher', async t => {
  const launcher = await readFile(new URL('../scripts/author-assistant/startAuthorAssistant.ps1', import.meta.url), 'utf8');
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  await t.test('1. the recommended command uses the private PowerShell launcher', () => {
    assert.match(packageJson.scripts['author-assistant:secure'], /startSimpleAuthorAssistant\.ps1/);
    assert.match(packageJson.scripts['author-assistant:legacy:secure'], /startAuthorAssistant\.ps1/);
  });

  await t.test('2. the key prompt is masked', () => {
    assert.match(launcher, /Read-Host 'Paste your OpenAI API key' -AsSecureString/);
  });

  await t.test('3. the launcher never persists the key', () => {
    assert.doesNotMatch(launcher, /setx|SetEnvironmentVariable|Out-File|Set-Content|Add-Content/);
    assert.match(launcher, /Remove-Item Env:OPENAI_API_KEY/);
    assert.match(launcher, /ZeroFreeBSTR/);
  });

  await t.test('4. the key is never passed as a command-line argument', () => {
    assert.match(launcher, /& node 'scripts\\author-assistant\\authorAssistant\.mjs'/);
    assert.doesNotMatch(launcher, /--api-key|--key|ArgumentList/);
  });

  await t.test('5. an existing environment key remains supported without being printed', () => {
    assert.match(launcher, /\$env:OPENAI_API_KEY/);
    assert.doesNotMatch(launcher, /Write-(?:Host|Output).*OPENAI_API_KEY|echo.*OPENAI_API_KEY/i);
  });

  await t.test('6. the pilot defaults to the balanced model and allows an environment override', () => {
    assert.equal(DEFAULT_AUTHOR_ASSISTANT_MODEL, 'gpt-5.6-terra');
    assert.match(launcher, /\$env:AUTHOR_ASSISTANT_MODEL = 'gpt-5\.6-terra'/);
  });

  await t.test('7. a failed AI request ends cleanly without throwing a PowerShell stack trace', () => {
    assert.doesNotMatch(launcher, /throw "Author Assistant stopped with exit code/);
    assert.match(launcher, /The Author Assistant ended safely with exit code/);
    assert.match(launcher, /\[Environment\]::ExitCode = \$assistantExitCode/);
  });

  await t.test('8. the launcher displays Node output as UTF-8 and restores the original console settings', () => {
    assert.match(launcher, /New-Object System\.Text\.UTF8Encoding\(\$false\)/);
    assert.match(launcher, /\[Console\]::InputEncoding = \$utf8WithoutBom/);
    assert.match(launcher, /\[Console\]::OutputEncoding = \$utf8WithoutBom/);
    assert.match(launcher, /\$OutputEncoding = \$utf8WithoutBom/);
    assert.match(launcher, /\[Console\]::InputEncoding = \$originalConsoleInputEncoding/);
    assert.match(launcher, /\[Console\]::OutputEncoding = \$originalConsoleOutputEncoding/);
    assert.match(launcher, /\$OutputEncoding = \$originalPipelineOutputEncoding/);
  });

  await t.test('9. the UTF-8 correction does not rewrite saved session files', () => {
    assert.doesNotMatch(launcher, /research-result\.json|accepted-sources\.json/);
    assert.doesNotMatch(launcher, /Set-Content|Out-File|Add-Content/);
  });
});
