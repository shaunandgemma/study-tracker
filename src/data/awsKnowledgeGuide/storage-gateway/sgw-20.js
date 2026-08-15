import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-20',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Tape Gateway Virtual Tape Shelf',
  status: 'ready',
  plainEnglish: 'The Virtual Tape Shelf (VTS) is the archive storage layer in Tape Gateway. When backup software ejects a virtual tape from the Virtual Tape Library (VTL), the tape is archived to the VTS, which stores data in S3 Glacier Flexible Retrieval or S3 Glacier Deep Archive. Archived tapes are offline and must be retrieved back to the VTL before data can be read.',
  whyItMatters: 'Long-term retention of backup tapes in S3 Glacier classes costs a fraction of keeping them in S3 Standard. The VTS mirrors the physical-tape workflow of sending completed tapes to off-site vaulting, but without shipping costs or degradation risks.',
  workplaceExample: 'An insurance company retains regulatory compliance backups for 7 years. After 90 days in the VTL, backup policies eject tapes to the VTS (S3 Glacier Deep Archive). When an auditor requests a 3-year-old backup, the team retrieves the tape from the VTS back to the VTL.',
  examFocus: 'SAA-C03 VTS Archive & Retrieval:\n- Archive Storage: S3 Glacier Flexible Retrieval or S3 Glacier Deep Archive.\n- Archive Trigger: Backup software ejects a tape from the VTL; the gateway moves it to the VTS.\n- Retrieval: Tapes must be retrieved from the VTS back to the VTL before data can be read (retrieval takes hours depending on Glacier class).\n- Cost Optimisation: Deep Archive costs significantly less than Glacier Flexible Retrieval for rarely accessed tapes.',
  keyPoints: [
    'Archive storage tier for ejected virtual tapes in Tape Gateway.',
    'Uses S3 Glacier Flexible Retrieval or S3 Glacier Deep Archive for low-cost long-term retention.',
    'Archived tapes are offline and cannot be read until retrieved back to the VTL.',
    'Retrieval time depends on the Glacier storage class (hours to days).',
    'Mirrors the physical workflow of vaulting completed tapes off-site.'
  ],
  commonMistake: 'Expecting instant access to an archived tape on the Virtual Tape Shelf. Retrieval from S3 Glacier Deep Archive can take 12 hours or more before the tape is accessible in the VTL.',
  example: 'Tape Archival and Retrieval Workflow:\n1. Backup software ejects a completed tape from the VTL.\n2. Tape Gateway archives the tape to the VTS (S3 Glacier Deep Archive).\n3. Months later, a restore is needed.\n4. Initiate tape retrieval from VTS to VTL (wait for retrieval).\n5. Once in VTL, backup software reads data from the tape.',
  sources: [
    { title: 'Archiving virtual tapes in Tape Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/tgw/managing-virtual-tapes-vtl.html' }
  ]
});
