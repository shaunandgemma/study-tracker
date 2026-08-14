import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ct-13', topicId: 'topic-control-tower', topicTitle: 'AWS Control Tower', objectiveCode: 'Management', title: 'Log Archive Account', status: 'ready',
  plainEnglish: 'The Log Archive account is a shared security account dedicated to receiving and retaining centralized copies of logs from the landing zone, including AWS CloudTrail and AWS Config information. It belongs in the Security OU and should not host ordinary workloads.',
  whyItMatters: 'Separating logs from workload accounts makes it harder for a compromised workload administrator to alter or delete the evidence needed to investigate that account.',
  workplaceExample: 'CloudTrail logs from production and development accounts are stored in buckets owned by Log Archive, where only a security logging pipeline and approved auditors have access.',
  examFocus: 'The Log Archive account stores evidence; the Audit account is for security access and investigation. Apply least privilege, encryption, retention, and deletion protection to centralized logging resources.',
  keyPoints: ['Log Archive is a dedicated shared account.', 'It centralizes logs from member and shared accounts.', 'It should be isolated from application workloads.', 'Bucket and KMS policies control cross-account access.', 'Retention and integrity controls support investigations.'],
  commonMistake: 'Giving every workload administrator broad access to the central log buckets, defeating the separation of duties.',
  example: 'Allow CloudTrail and Config delivery, permit audited read access, and restrict object deletion to an approved retention process.',
  sources: [{ title: 'How AWS Control Tower works', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html' }, { title: 'Logging and monitoring in AWS Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/logging-and-monitoring.html' }]
});
