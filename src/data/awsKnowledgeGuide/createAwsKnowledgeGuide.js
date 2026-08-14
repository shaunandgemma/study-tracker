export function createAwsKnowledgeGuide(details) {
  return Object.freeze({
    status: 'draft',
    plainEnglish: '',
    whyItMatters: '',
    workplaceExample: '',
    examFocus: '',
    keyPoints: [],
    commonMistake: '',
    example: null,
    sources: [],
    ...details
  });
}
