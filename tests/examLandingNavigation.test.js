import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { DEFAULT_EXAMS } from '../src/data/examData.js';
import { AWS_SAA_C03_EXAM } from '../src/data/exams/awsSaaC03Exam.js';
import { COMPTIA_SECURITY_PLUS_EXAM } from '../src/data/exams/comptiaSecurityPlusExam.js';
import { TERRAFORM_ASSOCIATE_EXAM } from '../src/data/exams/terraformAssociateExam.js';
import { BUILT_IN_EXAM_DEFINITIONS, getExamDefinition } from '../src/data/exams/examDefinitions.js';
import { getExamChecklistItemCount, getExamLandingDetails } from '../src/utils/examNavigation.js';
import { isFollowAlongProgrammeForExam } from '../src/data/followAlongProgrammes.js';
import { buildPublishedProgrammeCard } from '../src/features/followAlongs/published/publishedFollowAlongService.js';
import {
  isRetiredCustomExam,
  loadExams,
  removeRetiredCustomExams,
  RETIRED_CUSTOM_EXAM_TITLES
} from '../src/utils/storage.js';

const read = path => readFileSync(path, 'utf8');

test('exam-first landing navigation', async t => {
  const app = read('src/App.jsx');
  const navbar = read('src/components/Navbar.jsx');
  const appLanding = read('src/components/Landing/AppLandingPage.jsx');
  const examLanding = read('src/components/Landing/ExamLandingPage.jsx');
  const followAlongLanding = read('src/components/FollowAlongs/FollowAlongLandingPage.jsx');
  const terraformFollowAlongOrder = read('src/features/followAlongs/published/terraformFollowAlongOrder.js');

  await t.test('1. built-in exam titles are independently editable files', () => {
    assert.equal(existsSync('src/data/exams/awsSaaC03Exam.js'), true);
    assert.equal(existsSync('src/data/exams/comptiaSecurityPlusExam.js'), true);
    assert.equal(existsSync('src/data/exams/terraformAssociateExam.js'), true);
    assert.equal(BUILT_IN_EXAM_DEFINITIONS.length, 3);
    assert.equal(getExamDefinition('aws-saa-c03'), AWS_SAA_C03_EXAM);
    assert.equal(getExamDefinition('comptia-sec-plus'), COMPTIA_SECURITY_PLUS_EXAM);
    assert.equal(getExamDefinition('terraform-associate-004'), TERRAFORM_ASSOCIATE_EXAM);
    assert.equal(DEFAULT_EXAMS.find(exam => exam.id === AWS_SAA_C03_EXAM.id)?.title, AWS_SAA_C03_EXAM.title);
    assert.equal(DEFAULT_EXAMS.find(exam => exam.id === COMPTIA_SECURITY_PLUS_EXAM.id)?.title, COMPTIA_SECURITY_PLUS_EXAM.title);
    assert.equal(DEFAULT_EXAMS.find(exam => exam.id === TERRAFORM_ASSOCIATE_EXAM.id)?.topics.length, 8);
    assert.equal(getExamChecklistItemCount(TERRAFORM_ASSOCIATE_EXAM), 37);
    assert.equal(TERRAFORM_ASSOCIATE_EXAM.questions.length, 100);
  });

  await t.test('2. the app opens at the general landing page and then an exam landing page', () => {
    const context = read('src/context/ExamContext.jsx');
    assert.match(context, /useState\('app-home'\)/);
    assert.match(app, /viewMode === 'app-home'/);
    assert.match(app, /<AppLandingPage/);
    assert.match(app, /viewMode === 'exam-home'/);
    assert.match(app, /<ExamLandingPage/);
    assert.match(app, /setActiveExamId\(examId\)[\s\S]*setViewMode\('exam-home'\)/);
  });

  await t.test('3. exam and tool choices are removed from the top navigation', () => {
    assert.doesNotMatch(navbar, /exams\.map|setActiveExamId|Checklist|Prep Exam|Follow Alongs/);
    assert.doesNotMatch(app, /<MobileBottomNav/);
    assert.match(appLanding, /aria-label="Exam selection"/);
    assert.match(examLanding, /Checklist/);
    assert.match(examLanding, /Prep Exam/);
    assert.match(examLanding, /Follow Alongs/);
  });

  await t.test('4. all three feature views remain connected to the selected exam', () => {
    assert.match(app, /<ChecklistView/);
    assert.match(app, /<ExamSetup/);
    assert.match(app, /<FollowAlongsView[\s\S]*examId=\{activeExamId\}/);
    assert.match(app, /examCode=\{activeExam\?\.code\}/);
    assert.match(app, /<ExamWorkspaceHeader/);
    assert.ok(getExamChecklistItemCount(DEFAULT_EXAMS[0]) > 0);
    assert.equal(getExamLandingDetails({ title: 'Custom' }).benefits.length, 3);
  });

  await t.test('5. Follow Along cards are restricted to their assigned exam', () => {
    const saaProgramme = { id: 'lambda-learning-path', examId: 'aws-saa-c03' };
    assert.equal(isFollowAlongProgrammeForExam(saaProgramme, 'aws-saa-c03'), true);
    assert.equal(isFollowAlongProgrammeForExam(saaProgramme, 'comptia-sec-plus'), false);
    assert.match(followAlongLanding, /isFollowAlongProgrammeForExam\(programme, examId\)/);

    const publishedCard = buildPublishedProgrammeCard({
      candidate_id: 'candidate-1',
      source_revision: 1,
      runtime_content: {
        programme: {
          programmeId: 'cloudfront-learning-path',
          serviceSlug: 'cloudfront',
          serviceName: 'Amazon CloudFront',
          displayName: 'CloudFront Follow Along',
          shortName: 'CloudFront'
        },
        phases: [],
        tasks: []
      }
    });
    assert.equal(publishedCard.examId, 'aws-saa-c03');

    const terraformCard = buildPublishedProgrammeCard({
      candidate_id: 'candidate-terraform',
      source_revision: 1,
      runtime_content: {
        programme: {
          programmeId: 'cloudformation-terraform-learning-path',
          serviceSlug: 'terraform',
          serviceName: 'Terraform',
          displayName: 'CloudFormation Follow with Terraform Along',
          shortName: 'Terraform'
        },
        phases: [],
        tasks: []
      }
    });
    assert.equal(terraformCard.examId, 'aws-saa-c03');
    assert.equal(isFollowAlongProgrammeForExam(terraformCard, 'terraform-associate-004'), false);
    assert.equal(isFollowAlongProgrammeForExam(terraformCard, 'aws-saa-c03'), true);

    const hcpTerraformCard = buildPublishedProgrammeCard({
      candidate_id: 'candidate-hcp-terraform',
      source_revision: 1,
      runtime_content: {
        programme: {
          programmeId: 'hcp-terraform-remote-runs-collaboration-learning-path',
          serviceSlug: 'hcp-terraform-remote-runs-collaboration',
          serviceName: 'HCP Terraform Remote Runs and Collaboration',
          displayName: 'HCP Terraform Remote Runs and Collaboration Follow Along',
          shortName: 'HCP TF',
          category: 'HashiCorp Terraform Associate 004'
        },
        phases: [],
        tasks: []
      }
    });
    assert.equal(hcpTerraformCard.examId, 'terraform-associate-004');
    assert.equal(isFollowAlongProgrammeForExam(hcpTerraformCard, 'terraform-associate-004'), true);
    assert.match(terraformFollowAlongOrder, /terraform-configuration-foundations-learning-path/);
    assert.match(followAlongLanding, /sortTerraformFollowAlongs/);
    assert.match(followAlongLanding, /cardNumber=\{numberedProgrammeIds\.get\(prog\.id\) \?\? null\}/);
  });

  await t.test('6. retired Terraform custom exams are removed without affecting Terraform Follow Alongs', () => {
    const exams = [
      { id: 'terraform-1', title: 'Terraform Associate' },
      { id: 'terraform-2', title: 'Terraform Associate Certification' },
      { id: 'terraform-follow-along', title: 'CloudFormation Follow with Terraform Along' },
      { id: 'aws-saa-c03', title: 'AWS Certified Solutions Architect – Associate (SAA-C03)' }
    ];

    assert.deepEqual(RETIRED_CUSTOM_EXAM_TITLES, [
      'Terraform Associate',
      'Terraform Associate Certification'
    ]);
    assert.equal(isRetiredCustomExam({ title: ' terraform associate ' }), true);
    assert.deepEqual(removeRetiredCustomExams(exams).map(exam => exam.id), [
      'terraform-follow-along',
      'aws-saa-c03'
    ]);
  });

  await t.test('7. loading old browser data removes only the retired exams and their progress', () => {
    const originalStorage = globalThis.localStorage;
    const values = new Map([
      ['exampulse_exams_v1', JSON.stringify([
        { id: 'terraform-1', title: 'Terraform Associate' },
        { id: 'terraform-2', title: 'Terraform Associate Certification' },
        { id: 'custom-kept', title: 'Kept Custom Exam' }
      ])],
      ['exampulse_checklist_v1', JSON.stringify({ 'terraform-1': { task: true }, 'custom-kept': { task: true } })],
      ['exampulse_flagged_v1', JSON.stringify({ 'terraform-2': { question: true }, 'custom-kept': { question: true } })],
      ['exampulse_history_v1', JSON.stringify([
        { examId: 'terraform-1', score: 80 },
        { examId: 'custom-kept', score: 90 }
      ])],
      ['exampulse_active_exam_v1', 'terraform-2']
    ]);
    globalThis.localStorage = {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value)
    };

    try {
      const loaded = loadExams();
      assert.equal(loaded.some(exam => exam.id === 'terraform-1' || exam.id === 'terraform-2'), false);
      assert.equal(loaded.some(exam => exam.id === 'custom-kept'), true);
      assert.deepEqual(Object.keys(JSON.parse(values.get('exampulse_checklist_v1'))), ['custom-kept']);
      assert.deepEqual(Object.keys(JSON.parse(values.get('exampulse_flagged_v1'))), ['custom-kept']);
      assert.deepEqual(JSON.parse(values.get('exampulse_history_v1')).map(entry => entry.examId), ['custom-kept']);
      assert.equal(values.get('exampulse_active_exam_v1'), 'aws-saa-c03');
    } finally {
      if (originalStorage === undefined) delete globalThis.localStorage;
      else globalThis.localStorage = originalStorage;
    }
  });
});
