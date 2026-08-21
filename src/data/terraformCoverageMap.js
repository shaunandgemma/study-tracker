import { TERRAFORM_ASSOCIATE_EXAM } from './exams/terraformAssociateExam.js';
import { TERRAFORM_ASSOCIATE_QUESTIONS } from './exams/terraformAssociateQuestions.js';
import { getTerraformKnowledgeGuide } from './terraformKnowledgeGuide/index.js';
import { getTroubleshootingChallenge } from './troubleshootingChallenges/index.js';

export const TERRAFORM_FOLLOW_ALONG_REFERENCES = Object.freeze({
  configuration: Object.freeze({
    id: 'terraform-configuration-foundations-learning-path',
    title: 'Understanding and Building Terraform Configuration'
  }),
  beginner: Object.freeze({
    id: 'terraform-beginner-learning-path',
    title: 'Terraform Associate Beginner Follow Along'
  }),
  state: Object.freeze({
    id: 'terraform-state-backend-learning-path',
    title: 'Terraform State and Remote Backend Follow Along'
  }),
  modules: Object.freeze({
    id: 'terraform-modules-refactoring-learning-path',
    title: 'Terraform Modules and Refactoring Follow Along'
  })
});

const CONFIGURATION = TERRAFORM_FOLLOW_ALONG_REFERENCES.configuration.id;
const BEGINNER = TERRAFORM_FOLLOW_ALONG_REFERENCES.beginner.id;
const STATE = TERRAFORM_FOLLOW_ALONG_REFERENCES.state.id;
const MODULES = TERRAFORM_FOLLOW_ALONG_REFERENCES.modules.id;
const SYNTAX_INCIDENT = 'terraform-syntax-validation';
const REPLACEMENT_INCIDENT = 'terraform-unwanted-replacement';
const DRIFT_INCIDENT = 'terraform-state-drift';

const entry = (objectiveId, questionIds = [], followAlongIds = [], troubleshootingIds = []) => Object.freeze({
  objectiveId,
  knowledgeGuideId: objectiveId,
  questionIds: Object.freeze(questionIds),
  followAlongIds: Object.freeze(followAlongIds),
  troubleshootingIds: Object.freeze(troubleshootingIds)
});

export const TERRAFORM_OBJECTIVE_COVERAGE = Object.freeze([
  entry('tf004-1a', ['q-tf004-1', 'q-tf004-51'], [CONFIGURATION, BEGINNER]),
  entry('tf004-1b', ['q-tf004-1', 'q-tf004-52'], [CONFIGURATION, BEGINNER]),
  entry('tf004-1c', ['q-tf004-2', 'q-tf004-53']),

  entry('tf004-2a', ['q-tf004-3', 'q-tf004-4', 'q-tf004-54'], [CONFIGURATION, BEGINNER, MODULES]),
  entry('tf004-2b', ['q-tf004-3', 'q-tf004-55'], [CONFIGURATION, BEGINNER, MODULES]),
  entry('tf004-2c', ['q-tf004-17', 'q-tf004-56']),
  entry('tf004-2d', ['q-tf004-11', 'q-tf004-57'], [BEGINNER, STATE, MODULES]),

  entry('tf004-3a', ['q-tf004-5', 'q-tf004-6', 'q-tf004-58'], [CONFIGURATION, BEGINNER, STATE, MODULES]),
  entry('tf004-3b', ['q-tf004-3', 'q-tf004-59'], [CONFIGURATION, BEGINNER, STATE, MODULES]),
  entry('tf004-3c', ['q-tf004-60'], [CONFIGURATION, BEGINNER, MODULES], [SYNTAX_INCIDENT]),
  entry('tf004-3d', ['q-tf004-5', 'q-tf004-6', 'q-tf004-61'], [CONFIGURATION, BEGINNER, STATE, MODULES], [REPLACEMENT_INCIDENT]),
  entry('tf004-3e', ['q-tf004-6', 'q-tf004-62'], [CONFIGURATION, BEGINNER, STATE, MODULES]),
  entry('tf004-3f', ['q-tf004-63'], [CONFIGURATION, BEGINNER, STATE, MODULES]),
  entry('tf004-3g', ['q-tf004-64'], [CONFIGURATION, BEGINNER, STATE, MODULES]),

  entry('tf004-4a', ['q-tf004-7', 'q-tf004-65'], [CONFIGURATION, BEGINNER, MODULES], [SYNTAX_INCIDENT]),
  entry('tf004-4b', ['q-tf004-8', 'q-tf004-66'], [CONFIGURATION, BEGINNER, MODULES]),
  entry('tf004-4c', ['q-tf004-67'], [CONFIGURATION, BEGINNER, MODULES]),
  entry('tf004-4d', ['q-tf004-68', 'q-tf004-75'], [CONFIGURATION]),
  entry('tf004-4e', ['q-tf004-21', 'q-tf004-69', 'q-tf004-74'], [CONFIGURATION, MODULES]),
  entry('tf004-4f', ['q-tf004-8', 'q-tf004-19', 'q-tf004-70', 'q-tf004-73'], [CONFIGURATION, BEGINNER, MODULES], [REPLACEMENT_INCIDENT]),
  entry('tf004-4g', ['q-tf004-20', 'q-tf004-71'], [CONFIGURATION, MODULES]),
  entry('tf004-4h', ['q-tf004-18', 'q-tf004-28', 'q-tf004-72', 'q-tf004-76']),

  entry('tf004-5a', ['q-tf004-10', 'q-tf004-77'], [BEGINNER, MODULES]),
  entry('tf004-5b', ['q-tf004-9', 'q-tf004-78', 'q-tf004-82'], [BEGINNER, MODULES]),
  entry('tf004-5c', ['q-tf004-9', 'q-tf004-79', 'q-tf004-81'], [BEGINNER, MODULES]),
  entry('tf004-5d', ['q-tf004-22', 'q-tf004-80']),

  entry('tf004-6a', ['q-tf004-11', 'q-tf004-83', 'q-tf004-88'], [STATE]),
  entry('tf004-6b', ['q-tf004-12', 'q-tf004-84', 'q-tf004-89'], [STATE]),
  entry('tf004-6c', ['q-tf004-23', 'q-tf004-85'], [STATE]),
  entry('tf004-6d', ['q-tf004-24', 'q-tf004-25', 'q-tf004-86', 'q-tf004-87'], [STATE], [DRIFT_INCIDENT]),

  entry('tf004-7a', ['q-tf004-13', 'q-tf004-26', 'q-tf004-90', 'q-tf004-93'], [STATE]),
  entry('tf004-7b', ['q-tf004-27', 'q-tf004-91', 'q-tf004-94'], [STATE, MODULES]),
  entry('tf004-7c', ['q-tf004-14', 'q-tf004-92']),

  entry('tf004-8a', ['q-tf004-15', 'q-tf004-29', 'q-tf004-95']),
  entry('tf004-8b', ['q-tf004-16', 'q-tf004-30', 'q-tf004-96', 'q-tf004-99']),
  entry('tf004-8c', ['q-tf004-15', 'q-tf004-30', 'q-tf004-97']),
  entry('tf004-8d', ['q-tf004-29', 'q-tf004-98', 'q-tf004-100'])
]);

const checklistItems = TERRAFORM_ASSOCIATE_EXAM.topics.flatMap(topic => (
  topic.items.map(item => ({ ...item, topicId: topic.id, topicTitle: topic.title, objectiveCode: topic.code }))
));

const questionById = new Map(TERRAFORM_ASSOCIATE_QUESTIONS.map(question => [question.id, question]));
const followAlongById = new Map(Object.values(TERRAFORM_FOLLOW_ALONG_REFERENCES).map(programme => [programme.id, programme]));
const coverageByObjectiveId = new Map(TERRAFORM_OBJECTIVE_COVERAGE.map(coverage => [coverage.objectiveId, coverage]));

export function getTerraformCoverageRows() {
  return checklistItems.map(item => {
    const coverage = coverageByObjectiveId.get(item.id) || entry(item.id);
    const knowledgeGuide = getTerraformKnowledgeGuide(coverage.knowledgeGuideId);
    const questions = coverage.questionIds.map(id => questionById.get(id)).filter(Boolean);
    const followAlongs = coverage.followAlongIds.map(id => followAlongById.get(id)).filter(Boolean);
    const troubleshooting = coverage.troubleshootingIds.map(getTroubleshootingChallenge).filter(Boolean);

    return {
      ...item,
      knowledgeGuide,
      questions,
      followAlongs,
      troubleshooting,
      coverage: {
        knowledgeGuide: Boolean(knowledgeGuide),
        questions: questions.length > 0,
        followAlong: followAlongs.length > 0,
        troubleshooting: troubleshooting.length > 0
      }
    };
  });
}

export function getTerraformCoverageSummary() {
  const rows = getTerraformCoverageRows();
  const count = key => rows.filter(row => row.coverage[key]).length;
  const gaps = key => rows.filter(row => !row.coverage[key]).map(row => row.id);

  return {
    objectives: rows.length,
    knowledgeGuideObjectives: count('knowledgeGuide'),
    questionObjectives: count('questions'),
    followAlongObjectives: count('followAlong'),
    troubleshootingObjectives: count('troubleshooting'),
    questionBankSize: TERRAFORM_ASSOCIATE_QUESTIONS.length,
    followAlongProgrammes: Object.keys(TERRAFORM_FOLLOW_ALONG_REFERENCES).length,
    troubleshootingChallenges: new Set(rows.flatMap(row => row.troubleshooting.map(challenge => challenge.id))).size,
    gaps: {
      knowledgeGuide: gaps('knowledgeGuide'),
      questions: gaps('questions'),
      followAlong: gaps('followAlong'),
      troubleshooting: gaps('troubleshooting')
    }
  };
}
