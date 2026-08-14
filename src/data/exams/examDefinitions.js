import { AWS_SAA_C03_EXAM } from './awsSaaC03Exam.js';
import { COMPTIA_SECURITY_PLUS_EXAM } from './comptiaSecurityPlusExam.js';
import { TERRAFORM_ASSOCIATE_EXAM } from './terraformAssociateExam.js';

export const BUILT_IN_EXAM_DEFINITIONS = Object.freeze([
  AWS_SAA_C03_EXAM,
  COMPTIA_SECURITY_PLUS_EXAM,
  TERRAFORM_ASSOCIATE_EXAM
]);

export function getExamDefinition(examId) {
  return BUILT_IN_EXAM_DEFINITIONS.find(exam => exam.id === examId) || null;
}
