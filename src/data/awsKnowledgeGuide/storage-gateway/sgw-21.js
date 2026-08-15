import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-21',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Tape Gateway with S3 Glacier Storage Classes',
  status: 'ready',
  plainEnglish: 'Tape Gateway uses Amazon S3 Glacier storage classes for cost-effective long-term archival of virtual tapes. When creating virtual tapes, you choose the archive storage class that the tape will move to upon ejection: S3 Glacier Flexible Retrieval (formerly Glacier) for tapes that may need retrieval within 3–5 hours, or S3 Glacier Deep Archive for tapes rarely accessed with acceptable retrieval times of 12 hours or more.',
  whyItMatters: 'Choosing the correct Glacier class balances cost against retrieval speed. Compliance backups rarely accessed can save significantly with Deep Archive, while operational backups needing faster restore times benefit from Glacier Flexible Retrieval.',
  workplaceExample: 'A media company archives daily production backups to S3 Glacier Flexible Retrieval (3–5 hour retrieval) and archives annual compliance snapshots to S3 Glacier Deep Archive (12+ hour retrieval, lowest cost per GB).',
  examFocus: 'SAA-C03 Glacier Class Selection for Tape Gateway:\n- S3 Glacier Flexible Retrieval: Moderate cost. Standard retrieval in 3–5 hours.\n- S3 Glacier Deep Archive: Lowest cost. Standard retrieval in 12 hours or more.\n- Selection Timing: Storage class is assigned at virtual tape creation and determines where the tape is archived upon ejection.\n- Cost-Retrieval Trade-off: Deep Archive costs less per GB but retrieval is slower.',
  keyPoints: [
    'Virtual tapes archive to S3 Glacier Flexible Retrieval or S3 Glacier Deep Archive upon ejection.',
    'Glacier Flexible Retrieval provides standard retrieval in 3–5 hours.',
    'Glacier Deep Archive provides the lowest storage cost with retrieval in 12+ hours.',
    'Storage class is assigned when the virtual tape is created.',
    'Selecting the right class balances long-term storage cost against restore urgency.'
  ],
  commonMistake: 'Archiving all virtual tapes to S3 Glacier Deep Archive without considering that operational disaster-recovery tapes may need faster retrieval than 12 hours.',
  example: 'Glacier Class Selection Guide for Tapes:\n- "Regulatory compliance backups kept 7 years, rarely restored" → S3 Glacier Deep Archive\n- "Monthly operational backups needing 3–5 hour restore capability" → S3 Glacier Flexible Retrieval',
  sources: [
    { title: 'Selecting archive storage classes for Tape Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/tgw/creating-virtual-tapes-vtl.html' }
  ]
});
