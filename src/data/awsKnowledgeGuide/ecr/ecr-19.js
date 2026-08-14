import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-19',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Lifecycle Policies',
  status: 'ready',
  plainEnglish: 'ECR Lifecycle Policies automate the cleanup of old, unused, or untagged container images in your ECR repositories. You define rules based on image count limits (e.g. retain only the 30 most recent tagged images) or image age limits (e.g. expire untagged images older than 14 days). ECR evaluates lifecycle rules daily and automatically deletes matching images to keep storage costs low.',
  whyItMatters: 'CI/CD build pipelines push dozens of temporary container images daily. Without automated Lifecycle Policies, ECR repositories accumulate thousands of obsolete images, inflating monthly storage bills unnecessarily.',
  workplaceExample: 'A company\'s Jenkins pipeline pushes 50 test container images per day. They attach a Lifecycle Policy rule: `Expire untagged images older than 3 days` and `Retain maximum 20 tagged images`. This policy automatically cleans up gigabytes of test builds daily.',
  examFocus: 'SAA-C03 Lifecycle Policy rules:\n- Rules evaluate in order of rule priority.\n- Can target untagged images (`tagStatus: "untagged"`) or tagged images (`tagStatus: "tagged"` with `tagPrefixList`).\n- Criteria: `sinceImagePushed` (age in days) or `imageCountMoreThan` (count limit).\n- Cost optimization best practice for ECR storage.',
  keyPoints: [
    'Automates deletion of outdated or untagged container images.',
    'Evaluated automatically by ECR on a daily basis.',
    'Configured via JSON policy containing prioritized rules.',
    'Criteria options: image age (`sinceImagePushed`) or image count (`imageCountMoreThan`).',
    'Prevents repository bloat and controls ECR storage costs.'
  ],
  commonMistake: 'Not creating a Lifecycle Policy for untagged images, causing orphaned image layers created by overwritten tags to remain in ECR indefinitely and incur ongoing storage fees.',
  example: 'Lifecycle Policy Rule JSON:\n{\n  "rules": [{\n    "rulePriority": 1,\n    "description": "Expire untagged images after 7 days",\n    "selection": { "tagStatus": "untagged", "countType": "sinceImagePushed", "countUnit": "days", "countNumber": 7 },\n    "action": { "type": "expire" }\n  }]\n}',
  sources: [
    { title: 'Amazon ECR Lifecycle Policies', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html' }
  ]
});
