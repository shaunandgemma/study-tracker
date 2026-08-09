import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const read = file => readFileSync(file, 'utf8');

function sourceFiles(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root).flatMap(name => {
    const item = path.join(root, name);
    return statSync(item).isDirectory()
      ? sourceFiles(item)
      : /\.(?:js|jsx|ts|tsx|json|md)$/.test(name) ? [item] : [];
  });
}

test('Step 62 legacy Hands On content and tooling retirement', async (t) => {
  await t.test('1. local catalogue, importer and migration workspace are absent', () => {
    for (const retiredPath of [
      'src/data/tasks',
      'src/data/tasksData.js',
      'scripts/importHandsOnTasks.js',
      'scripts/validateLegacyHandsOnTaskSchema.js',
      'scripts/auditTaskChecklistContent.js',
      'scripts/createChecklistBaseline.js',
      'scripts/compareChecklistBaseline.js',
      'scripts/execute_archive_migration.py',
      'migration_work/hands_on_tasks',
      'migration_work/verification-tools/verify_supabase_live.py',
      'migration_work/reports/full-app-supabase-verification-2026-08-02-213900.md',
      'data/backups/hands-on-tasks',
      'study-tracker-hands-on-role.yaml'
    ]) assert.equal(existsSync(retiredPath), false, `${retiredPath} must be retired`);
  });

  await t.test('2. Hands On conversion and checklist-repair scripts are absent', () => {
    const archivedScriptNames = readdirSync('scripts/archive');
    assert.equal(archivedScriptNames.some(name => /^convert.*Tasks\.js$/.test(name)), false);
    assert.equal(archivedScriptNames.includes('applyTaskChecklistRepair.js'), false);
    assert.equal(archivedScriptNames.includes('repairTaskChecklists.js'), false);
  });

  await t.test('3. retired importer commands and documentation entries are absent', () => {
    const packageSource = read('package.json');
    const documentation = read('docs/scripts/README.md');
    assert.doesNotMatch(packageSource, /import-hands-on-tasks|importHandsOnTasks/);
    assert.doesNotMatch(documentation, /Recommended safe hands-on task workflow|Hands-on task conversion|Hands-on task importing/);
    assert.match(documentation, /Author programme is the only supported Follow Along creation route/);
  });

  await t.test('4. active source and tools have no legacy catalogue import', () => {
    const combined = [...sourceFiles('src'), ...sourceFiles('scripts')]
      .map(file => read(file))
      .join('\n');
    assert.doesNotMatch(combined, /(?:from|import).*data\/tasksData|(?:from|import).*data\/tasks\//);
    assert.doesNotMatch(combined, /importHandsOnTasks|validateLegacyHandsOnTaskSchema/);
  });

  await t.test('5. read-only history and immutable database migrations remain', () => {
    for (const retainedPath of [
      'src/data/handsOnProgressArchivePolicy.js',
      'src/services/handsOnProgressArchiveService.js',
      'supabase/migrations/20260801_hands_on_tasks.sql',
      'supabase/migrations/20260815_hands_on_progress_read_only_archive.sql',
      'supabase/migrations/20260816_hands_on_progress_select_only_privileges.sql'
    ]) assert.equal(existsSync(retainedPath), true, `${retainedPath} must remain`);
  });

  await t.test('6. Follow Along ownership and AWS validation safeguards remain', () => {
    for (const retainedPath of [
      'src/features/followAlongs/catalogues/s3FollowAlongTasks.js',
      'src/features/followAlongs/catalogues/ec2FollowAlongTasks.js',
      'src/features/followAlongs/catalogues/vpcFollowAlongTasks.js',
      'src/features/followAlongAuthor',
      'src/services/awsConnectionService.js',
      'tests/awsConnectionValidation.test.js',
      'tests/followAlongCatalogueOwnership.test.js'
    ]) assert.equal(existsSync(retainedPath), true, `${retainedPath} must remain`);
  });

  await t.test('7. exam-question tools remain outside the cleanup boundary', () => {
    for (const retainedPath of [
      'scripts/importQuestions.js',
      'scripts/exportQuestions.js',
      'scripts/replaceSaaQuestions.js',
      'scripts/generateSql.js'
    ]) assert.equal(existsSync(retainedPath), true, `${retainedPath} must remain`);
  });
});
