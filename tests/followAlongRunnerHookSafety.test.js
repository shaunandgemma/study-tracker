import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');

test('Follow Along runners keep null-task returns below their hooks', async (t) => {
  await t.test('VPC runner calls every hook before returning for a missing task', () => {
    const source = read('src/components/VpcLearningPath/VpcTaskRunner.jsx');
    const nullReturn = source.indexOf('if (!task) return null;');
    const lastHook = source.lastIndexOf('useEffect(() =>');

    assert.ok(lastHook >= 0, 'Expected the VPC runner to contain its synchronization effect');
    assert.ok(nullReturn > lastHook, 'The VPC null-task return must remain below all hooks');
    assert.match(source, /const taskId = task\?\.id \|\| null;/);
  });

  await t.test('EC2 runner calls every hook before rendering its missing-task message', () => {
    const source = read('src/components/Ec2LearningPath/Ec2TaskRunner.jsx');
    const nullReturn = source.indexOf('if (!task) {');
    const lastHook = source.lastIndexOf('useEffect(() =>');

    assert.ok(lastHook >= 0, 'Expected the EC2 runner to contain its synchronization effects');
    assert.ok(nullReturn > lastHook, 'The EC2 null-task return must remain below all hooks');
    assert.match(source, /const taskId = task\?\.id \|\| null;/);
  });
});
