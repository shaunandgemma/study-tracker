import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const findElement = (node, predicate) => {
  if (!node || typeof node !== 'object') return null;
  if (predicate(node)) return node;
  const children = node.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const match = findElement(child, predicate);
    if (match) return match;
  }
  return null;
};

test('Follow Along display components', async (t) => {
  const { createServer } = await import('vite');
  const cacheDir = await mkdtemp(join(tmpdir(), 'follow-along-display-test-'));
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

  const instructionModule = await viteServer.ssrLoadModule(
    '/src/features/followAlongs/runtime/FollowAlongInstructionItem.jsx',
  );
  const commandModule = await viteServer.ssrLoadModule(
    '/src/features/followAlongs/runtime/FollowAlongCommandBlock.jsx',
  );
  const stepModule = await viteServer.ssrLoadModule(
    '/src/features/followAlongs/runtime/FollowAlongStepCard.jsx',
  );
  const jsonModule = await viteServer.ssrLoadModule(
    '/src/features/followAlongs/runtime/FollowAlongJsonBlock.jsx',
  );
  const progressModule = await viteServer.ssrLoadModule(
    '/src/components/FollowAlongs/FollowAlongProgressSummary.jsx',
  );
  const cardModule = await viteServer.ssrLoadModule(
    '/src/components/FollowAlongs/FollowAlongCard.jsx',
  );

  const { FollowAlongInstructionItem } = instructionModule;
  const {
    FollowAlongCommandBlock,
    copyFollowAlongCommandText,
    isFollowAlongCommandDestructive,
  } = commandModule;
  const { FollowAlongStepCard, isFollowAlongStepComplete } = stepModule;
  const { formatFollowAlongJsonContent } = jsonModule;
  const { FollowAlongProgressSummary } = progressModule;
  const { FollowAlongCard } = cardModule;

  await t.test('1. Instruction item shows text and detail with checked styling', () => {
    const html = renderToStaticMarkup(createElement(FollowAlongInstructionItem, {
      instruction: { id: 'open-vpc', text: 'Open the VPC console', detail: 'Use the AWS search bar.' },
      isChecked: true,
      onToggle: () => {},
    }));
    assert.match(html, /Open the VPC console/);
    assert.match(html, /Use the AWS search bar/);
    assert.match(html, /checked=""/);
    assert.match(html, /line-through/);
  });

  await t.test('2. Instruction item returns its own ID and hides empty content', () => {
    let receivedId;
    const tree = FollowAlongInstructionItem({
      instruction: { id: 'choose-region', text: 'Choose a region' },
      isChecked: false,
      onToggle: id => { receivedId = id; },
    });
    const checkbox = findElement(tree, element => element.type === 'input');
    checkbox.props.onChange();
    assert.equal(receivedId, 'choose-region');
    assert.equal(renderToStaticMarkup(createElement(FollowAlongInstructionItem, {
      instruction: { id: 'empty' }, isChecked: false, onToggle: () => {},
    })), '');
  });

  await t.test('2A. instruction text stays selectable without adding a row copy button', () => {
    const html = renderToStaticMarkup(createElement(FollowAlongInstructionItem, {
      instruction: { id: 'copy-policy', text: 'Choose Create policy.' },
      isChecked: false,
      onToggle: () => {},
    }));
    assert.match(html, /select-text/);
    assert.doesNotMatch(html, /Copy instruction/);
  });

  await t.test('3. Command block shows guidance, output, warning, and live copy status', () => {
    const html = renderToStaticMarkup(createElement(FollowAlongCommandBlock, {
      command: {
        text: 'aws ec2 describe-vpcs',
        explanation: 'List your VPCs',
        expectedOutput: '{ "Vpcs": [] }',
        warning: 'Confirm the selected region.',
      },
    }));
    assert.match(html, /aws ec2 describe-vpcs/);
    assert.match(html, /List your VPCs/);
    assert.match(html, /Expected Output:/);
    assert.match(html, /Confirm the selected region/);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /Copy command to clipboard/);
  });

  await t.test('4. Command copy uses the complete command and keeps the existing risk rule', async () => {
    let copiedText;
    const copied = await copyFollowAlongCommandText(
      { text: 'aws ec2 describe-vpcs --output json' },
      { writeText: async text => { copiedText = text; } },
    );
    assert.equal(copied, true);
    assert.equal(copiedText, 'aws ec2 describe-vpcs --output json');
    assert.equal(isFollowAlongCommandDestructive('aws ec2 delete-vpc --vpc-id vpc-123'), true);
    assert.equal(isFollowAlongCommandDestructive('aws ec2 describe-vpcs'), false);
  });

  const fullStep = {
    id: 'create-vpc',
    number: 2,
    title: 'Create the VPC',
    description: 'Enter the VPC settings.',
    instructions: [{ id: 'name-vpc', text: 'Enter the name' }],
    commands: [{ id: 'describe', text: 'aws ec2 describe-vpcs' }],
    jsonBlocks: [{ id: 'policy-json', title: 'Example IAM policy', content: '{\n  "Version": "2012-10-17"\n}' }],
    note: 'Keep the default tenancy.',
    warning: 'Check the CIDR range.',
    expectedResult: 'The new VPC appears in the list.',
  };

  await t.test('5. Step card shows every supported section', () => {
    const html = renderToStaticMarkup(createElement(FollowAlongStepCard, {
      step: fullStep,
      completedItemIds: [],
      onToggleItem: () => {},
      onToggleMainStep: () => {},
    }));
    for (const expected of [
      'Step 2', 'Create the VPC', 'Enter the VPC settings.', 'Enter the name',
      'aws ec2 describe-vpcs', 'Keep the default tenancy.', 'Check the CIDR range.',
      'Example IAM policy', '&quot;Version&quot;', 'Copy JSON',
      'The new VPC appears in the list.', 'Mark Step Done',
    ]) assert.match(html, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  await t.test('5A. minified JSON is displayed and copied with readable indentation', () => {
    assert.equal(
      formatFollowAlongJsonContent('{"Version":"2012-10-17","Statement":[{"Effect":"Allow"}]}'),
      '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow"\n    }\n  ]\n}'
    );
    assert.equal(formatFollowAlongJsonContent('{ illustrative JSON }'), '{ illustrative JSON }');
  });

  await t.test('6. Step completion and main-step callback remain compatible', () => {
    assert.equal(isFollowAlongStepComplete(fullStep, ['name-vpc']), true);
    assert.equal(isFollowAlongStepComplete(fullStep, []), false);
    assert.equal(isFollowAlongStepComplete({ id: 'no-items' }, ['no-items']), true);

    let received;
    const tree = FollowAlongStepCard({
      step: fullStep,
      completedItemIds: [],
      onToggleItem: () => {},
      onToggleMainStep: (id, checked) => { received = { id, checked }; },
    });
    const checkbox = findElement(tree, element => element.type === 'input');
    checkbox.props.onChange({ target: { checked: true } });
    assert.deepEqual(received, { id: 'create-vpc', checked: true });
  });

  await t.test('7. Follow Along runners use their own step card boundary', () => {
    const runnerFiles = [
      'src/components/FollowAlongs/shared/FollowAlongTaskRunner.jsx',
      'src/components/VpcLearningPath/VpcTaskRunner.jsx',
    ];
    for (const file of runnerFiles) {
      const source = readFileSync(file, 'utf8');
      assert.match(source, /features\/followAlongs\/runtime\/FollowAlongStepCard/);
      assert.doesNotMatch(source, /HandsOnTasks\/TaskStepCard/);
    }

    const featureFiles = [
      'src/features/followAlongs/runtime/FollowAlongStepCard.jsx',
      'src/features/followAlongs/runtime/FollowAlongInstructionItem.jsx',
      'src/features/followAlongs/runtime/FollowAlongCommandBlock.jsx',
      'src/features/followAlongs/runtime/FollowAlongJsonBlock.jsx',
    ];
    for (const file of featureFiles) {
      const source = readFileSync(file, 'utf8');
      assert.doesNotMatch(source, /HandsOnTasks/);
    }
  });

  await t.test('7A. Next Task advances without a resource-retention popup', () => {
    const sharedRunner = readFileSync('src/components/FollowAlongs/shared/FollowAlongTaskRunner.jsx', 'utf8');
    const vpcRunner = readFileSync('src/components/VpcLearningPath/VpcTaskRunner.jsx', 'utf8');
    assert.doesNotMatch(sharedRunner, /FollowAlongRetentionModal|Resource Retention Decision|decisionOpen/);
    assert.doesNotMatch(vpcRunner, /Resource Retention Decision|showDecisionModal|handleSelectDecision/);
    assert.match(sharedRunner, /onCompleteAndNavigate\(task\.id, 'retained', savedResources\)/);
    assert.match(vpcRunner, /onCompleteTask\(taskId, 'retained'\)/);
  });

  await t.test('8. shared progress display accepts the published programme summary shape', () => {
    const s3Html = renderToStaticMarkup(createElement(FollowAlongProgressSummary, {
      summary: { status: 'Not Started', completed: 0, total: 34, percentage: 0, loading: false },
    }));
    assert.match(s3Html, /Not Started/);
    assert.match(s3Html, /0 of 34 tasks completed/);
    assert.doesNotMatch(s3Html, /0 of 45 tasks completed/);

    const publishedCardHtml = renderToStaticMarkup(createElement(FollowAlongCard, {
      programme: {
        id: 'published-learning-path',
        title: 'Published Follow Along',
        category: 'AWS Services',
        description: 'Published test programme',
        service: 'AWS Service',
        status: 'available',
        taskCount: 23,
        phaseCount: 6,
      },
      progressSummary: { status: 'Not Started', completed: 0, total: 23, percentage: 0, loading: false },
      cardNumber: 2,
    }));
    assert.match(publishedCardHtml, /0 of 23 tasks completed/);
    assert.match(publishedCardHtml, /Start Follow Along/);
    assert.match(publishedCardHtml, /Follow Along 2/);
    assert.doesNotMatch(publishedCardHtml, /Resume Follow Along/);

    const zeroCardHtml = renderToStaticMarkup(createElement(FollowAlongCard, {
      programme: {
        id: 'terraform-configuration-foundations-learning-path',
        title: 'Understanding and Building Terraform Configuration',
        category: 'Terraform Configuration Language',
        description: 'Build every Terraform block gradually.',
        service: 'HashiCorp Terraform on AWS',
        status: 'available',
        taskCount: 9,
        phaseCount: 6,
      },
      cardNumber: 0,
    }));
    assert.match(zeroCardHtml, /Follow Along 0/);

    const cardWithoutProgressHtml = renderToStaticMarkup(createElement(FollowAlongCard, {
      programme: {
        id: 'published-without-progress',
        title: 'A Follow Along With A Long Consistent Card Title',
        category: 'AWS Services',
        description: 'A deliberately long description that should be visually limited so it cannot make this catalogue card taller than the other Follow Along cards.',
        service: 'AWS Service',
        status: 'available',
        taskCount: 8,
        phaseCount: 4,
      },
    }));
    assert.match(cardWithoutProgressHtml, /h-\[28rem\]/);
    assert.match(cardWithoutProgressHtml, /shrink-0/);
    assert.match(cardWithoutProgressHtml, /line-clamp-2/);
    assert.match(cardWithoutProgressHtml, /line-clamp-3/);
    assert.doesNotMatch(cardWithoutProgressHtml, /animate-pulse/);
    assert.doesNotMatch(cardWithoutProgressHtml, /tasks completed/);
  });
});
