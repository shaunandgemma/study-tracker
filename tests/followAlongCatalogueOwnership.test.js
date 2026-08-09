import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { DYNAMODB_TASKS } from '../src/features/followAlongs/catalogues/dynamodbFollowAlongTasks.js';
import { EC2_TASKS } from '../src/features/followAlongs/catalogues/ec2FollowAlongTasks.js';
import { ELB_TASKS } from '../src/features/followAlongs/catalogues/elbFollowAlongTasks.js';
import { IAM_TASKS } from '../src/features/followAlongs/catalogues/iamFollowAlongTasks.js';
import { RDS_TASKS } from '../src/features/followAlongs/catalogues/rdsFollowAlongTasks.js';
import { S3_TASKS } from '../src/features/followAlongs/catalogues/s3FollowAlongTasks.js';
import { SYNTHAPP_TASKS } from '../src/features/followAlongs/catalogues/synthappFollowAlongTasks.js';
import { VPC_TASKS } from '../src/features/followAlongs/catalogues/vpcFollowAlongTasks.js';

const catalogues = [
  { name: 'DynamoDB', tasks: DYNAMODB_TASKS, count: 9, legacy: 'dynamoDbTasks.js', pathData: 'src/data/dynamodbLearningPathData.js', owned: 'dynamodbFollowAlongTasks.js' },
  { name: 'EC2', tasks: EC2_TASKS, count: 25, legacy: 'ec2Tasks.js', pathData: 'src/data/ec2LearningPathData.js', owned: 'ec2FollowAlongTasks.js' },
  { name: 'ELB', tasks: ELB_TASKS, count: 13, legacy: 'elbTasks.js', pathData: 'src/data/elbLearningPathData.js', owned: 'elbFollowAlongTasks.js' },
  { name: 'IAM', tasks: IAM_TASKS, count: 22, legacy: 'iamTasks.js', pathData: 'src/data/iamLearningPathData.js', owned: 'iamFollowAlongTasks.js' },
  { name: 'RDS', tasks: RDS_TASKS, count: 7, legacy: 'rdsTasks.js', pathData: 'src/data/rdsLearningPathData.js', owned: 'rdsFollowAlongTasks.js' },
  { name: 'S3', tasks: S3_TASKS, count: 33, legacy: 's3Tasks.js', pathData: 'src/data/s3LearningPathData.js', owned: 's3FollowAlongTasks.js' },
  { name: 'Synthapp', tasks: SYNTHAPP_TASKS, count: 9, legacy: 'synthappTasks.js', pathData: 'src/data/synthappLearningPathData.js', owned: 'synthappFollowAlongTasks.js' },
  { name: 'VPC', tasks: VPC_TASKS, count: 34, legacy: 'vpcTasks.js', pathData: 'src/data/vpcLearningPathData.js', owned: 'vpcFollowAlongTasks.js' }
];

test('Follow Along catalogues own their content without legacy Hands On facades', async (t) => {
  await t.test('1. every Follow Along path imports its owned catalogue directly', () => {
    for (const catalogue of catalogues) {
      const pathData = readFileSync(catalogue.pathData, 'utf8');
      assert.match(pathData, new RegExp(`features/followAlongs/catalogues/${catalogue.owned}`.replaceAll('/', '\\\/')), catalogue.name);
      assert.doesNotMatch(pathData, /data\/tasks|\.\/tasks\//, catalogue.name);
    }
  });

  await t.test('2. all expected records remain complete and uniquely identified', () => {
    for (const catalogue of catalogues) {
      assert.equal(catalogue.tasks.length, catalogue.count, `${catalogue.name} task count`);
      assert.equal(new Set(catalogue.tasks.map(task => task.id)).size, catalogue.count, `${catalogue.name} unique IDs`);
      for (const task of catalogue.tasks) {
        assert.ok(task.id, `${catalogue.name} missing id`);
        assert.ok(task.title, `${catalogue.name} missing title`);
        assert.ok(task.goal, `${catalogue.name} missing goal`);
        assert.ok(task.whyItMatters, `${catalogue.name} missing whyItMatters`);
        assert.ok(Array.isArray(task.consoleSteps), `${task.id} console step contract`);
        assert.ok(Array.isArray(task.cliSteps), `${task.id} CLI step contract`);
        assert.ok(task.consoleSteps.length > 0 || task.cliSteps.length > 0, `${task.id} guided steps`);
        assert.ok(Array.isArray(task.verification) && task.verification.length > 0, `${task.id} verification`);
        assert.ok(Array.isArray(task.cleanup) && task.cleanup.length > 0, `${task.id} cleanup`);
        assert.ok(task.costWarning, `${task.id} cost warning`);
      }
    }
  });

  await t.test('3. every temporary legacy catalogue facade is absent', () => {
    for (const catalogue of catalogues) {
      assert.equal(existsSync(`src/data/tasks/${catalogue.legacy}`), false, catalogue.legacy);
    }
    assert.equal(existsSync('src/data/tasks'), false);
    assert.equal(existsSync('src/data/tasksData.js'), false);
  });

  await t.test('4. owned catalogues contain no retired runtime dependency', () => {
    for (const catalogue of catalogues) {
      const source = readFileSync(`src/features/followAlongs/catalogues/${catalogue.owned}`, 'utf8');
      assert.doesNotMatch(source, /TaskContext|taskService|HandsOnTasks|src\/data\/tasks/);
    }
  });

  await t.test('5. Synthapp remains unpublished and unreachable by normal users', () => {
    const registry = readFileSync('src/data/followAlongProgrammes.js', 'utf8');
    const router = readFileSync('src/components/FollowAlongs/FollowAlongsView.jsx', 'utf8');
    assert.doesNotMatch(registry, /synthapp-learning-path/i);
    assert.doesNotMatch(router, /SynthappLearningPath|synthapp-learning-path/i);
  });
});
