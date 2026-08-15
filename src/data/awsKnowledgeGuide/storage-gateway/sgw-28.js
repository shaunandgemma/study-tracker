import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-28',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway vs DataSync',
  status: 'ready',
  plainEnglish: 'AWS Storage Gateway and AWS DataSync both connect existing storage environments with AWS, but they solve different problems. Storage Gateway presents an ongoing local storage interface such as NFS, SMB, or iSCSI while using AWS storage behind it. DataSync runs transfer tasks that copy files or objects between supported storage locations. Choose Storage Gateway when applications need continuing hybrid access; choose DataSync when the main requirement is migration, replication, archive transfer, or recurring movement of datasets.',
  whyItMatters: 'Choosing the wrong service can leave an application without the interface it expects or create an unnecessary permanent gateway after a migration. The decision begins with the workload behaviour: ongoing reads and writes through a familiar local protocol point toward Storage Gateway, while controlled copying from a source to a destination points toward DataSync.',
  workplaceExample: 'A media company uses DataSync to copy a 200 TB NFS archive into Amazon S3 and verify the transferred data. A different editing application must continue reading and writing project files through SMB from the office, so that workload uses a Storage Gateway file share with local caching instead.',
  examFocus: 'SAA-C03 service selection:\n- Storage Gateway: ongoing hybrid storage access through standard file, volume, or tape interfaces.\n- DataSync: accelerated online movement of files or objects between supported source and destination locations.\n- DataSync tasks can migrate, replicate, archive, filter, schedule, and verify copied data.\n- Storage Gateway keeps an interface available to the application and can cache active data locally.\n- They can complement each other, but one does not automatically replace the other.',
  keyPoints: [
    'Storage Gateway supplies an ongoing storage interface close to an application; DataSync performs transfer task executions.',
    'DataSync supports migrations, recurring replication, archiving, and movement into AWS for processing.',
    'Storage Gateway supports hybrid file, block-volume, and virtual-tape patterns through the appropriate gateway type.',
    'DataSync examines supported source and destination locations, transfers selected data, and can verify transfer integrity.',
    'A DataSync agent may be needed near self-managed storage, whereas transfers between some AWS services do not require one.',
    'Network bandwidth, metadata requirements, permissions, deletion behaviour, and verification settings must be planned for either design.'
  ],
  commonMistake: 'Choosing DataSync for an application that expects a continuously mounted low-latency file share. DataSync copies datasets during task executions; it does not present a permanent NFS, SMB, or iSCSI storage interface to the application.',
  example: 'Requirement A says, "Move this NFS dataset to S3, preserve supported metadata, verify it, and retire the old server." DataSync is the natural fit. Requirement B says, "Keep the application on premises but give it an SMB share backed by AWS with frequently used files cached locally." Storage Gateway is the natural fit.',
  sources: [
    { title: 'What is AWS Storage Gateway?', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/WhatIsStorageGateway.html' },
    { title: 'What is AWS DataSync?', url: 'https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html' },
    { title: 'How AWS DataSync transfers data', url: 'https://docs.aws.amazon.com/datasync/latest/userguide/how-datasync-transfer-works.html' }
  ]
});
