import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "ebs-21",
  "topicId": "topic-ebs",
  "topicTitle": "Amazon EBS (Elastic Block Store)",
  "objectiveCode": "Storage",
  "title": "EBS Incremental Snapshots",
  "status": "ready",
  "plainEnglish": "EBS Incremental Snapshots means that only the unique disk blocks that have changed since the most recent snapshot are saved to Amazon S3. The very first snapshot of an EBS volume is a full backup containing all written data blocks. Every subsequent snapshot saves only the delta (modified and added blocks), minimizing snapshot creation time and drastically reducing S3 storage costs.",
  "whyItMatters": "If you take daily snapshots of a 1 TB volume where only 10 GB changes each day, you do NOT pay for 30 TB of storage at the end of the month. You pay for 1 TB (baseline snapshot) plus 290 GB (29 days * 10 GB deltas), slashing your cloud backup costs by more than 95%.",
  "workplaceExample": "A media company takes hourly snapshots of a 5 TB video rendering volume. Because rendering jobs only modify 20 GB of project files per hour, each hourly snapshot completes in under 60 seconds and adds only 20 GB of S3 billing usage.",
  "examFocus": "For SAA-C03, remember these crucial snapshot retention mechanics: (1) Snapshots are incremental: only changed blocks are saved and billed. (2) Even though snapshots are incremental, EACH snapshot is independent for restoration purposes. (3) If you delete an intermediate snapshot (e.g. Snapshot 2 in a sequence of 1, 2, 3), only the blocks unique to Snapshot 2 are deleted; blocks referenced by Snapshot 3 are automatically preserved.",
  "keyPoints": [
    "Snapshots are incremental: subsequent snapshots store only modified and added blocks.",
    "First snapshot is a full copy; all subsequent snapshots save delta changes.",
    "You are billed only for changed blocks saved in S3, minimizing storage expenses.",
    "Each snapshot functions independently: restoring from any snapshot gives a complete volume state.",
    "Deleting an intermediate snapshot removes ONLY blocks not referenced by other snapshots."
  ],
  "commonMistake": "Fearing that deleting older snapshots in a chain will break newer snapshots. AWS automatically tracks block references; deleting Snapshot 1 does not corrupt Snapshot 2 or 3 because AWS retains any blocks still needed by active snapshots.",
  "example": "# Snapshot 1 (Full): 100 GB -> Billed 100 GB in S3\n# Snapshot 2 (Incremental): 5 GB changed -> Billed 105 GB total in S3\n# Snapshot 3 (Incremental): 2 GB changed -> Billed 107 GB total in S3\n# Deleting Snapshot 2 removes only blocks unique to Snapshot 2; 1 and 3 remain 100% restorable.",
  "sources": [
    {
      "title": "How Incremental Amazon EBS Snapshots Work",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html#how-snapshots-work"
    },
    {
      "title": "Deleting an Amazon EBS Snapshot",
      "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-deleting-snapshot.html"
    }
  ]
});
