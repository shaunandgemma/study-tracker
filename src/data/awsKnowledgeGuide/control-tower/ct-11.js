import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-11', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Mandatory, Strongly Recommended and Elective Controls', status: 'ready',
  plainEnglish: 'Control guidance describes how strongly AWS recommends a control, independently of whether its behaviour is preventive, detective, or proactive. Mandatory controls protect core landing-zone resources. Strongly recommended controls represent common well-architected practices. Elective controls address additional enterprise requirements.',
  whyItMatters: 'Guidance helps teams build a deliberate governance baseline instead of enabling every available rule without considering workload impact.',
  workplaceExample: 'The platform team retains required landing-zone protections, enables strongly recommended encryption controls, and chooses elective Region restrictions based on company policy.',
  examFocus: 'Do not confuse guidance with behaviour. A strongly recommended control can be preventive, detective, or proactive. Control availability and mandatory application can vary with landing-zone version and enabled features, so review the current control reference during implementation.',
  keyPoints: ['Guidance categories are mandatory, strongly recommended, and elective.', 'Behaviour categories are preventive, detective, and proactive.', 'The two classifications are independent.', 'Strongly recommended controls address common best practices.', 'Elective controls support additional organizational policy choices.'],
  commonMistake: 'Calling every preventive control mandatory or every detective control elective.',
  example: 'Record both fields when reviewing a control: its guidance explains recommendation strength, while its behaviour explains how enforcement or evaluation works.',
  sources: [{ title: 'Control behavior and guidance', url: 'https://docs.aws.amazon.com/controltower/latest/controlreference/control-behavior.html' }, { title: 'How controls work', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-controls-work.html' }]
});
