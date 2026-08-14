import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-20',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Cross-Region Replication',
  status: 'ready',
  plainEnglish: 'ECR Cross-Region Replication automatically copies newly pushed container images to one or more secondary AWS regions (or secondary AWS accounts) in near-real-time. You configure replication rules at the ECR registry level, specifying destination regions and optional repository name prefix filters.',
  whyItMatters: 'For multi-region container deployments (e.g. active-active ECS/EKS clusters in `us-east-1` and `eu-west-1`), pulling images from a local regional ECR registry reduces pod startup latency and eliminates cross-region data transfer fees.',
  workplaceExample: 'A global web service deploys EKS clusters in Virginia (`us-east-1`) and Frankfurt (`eu-central-1`). CI/CD pushes new container images to `us-east-1`. ECR Cross-Region Replication automatically syncs the image to `eu-central-1` within seconds, allowing Frankfurt EKS nodes to pull images locally.',
  examFocus: 'SAA-C03 Replication use cases:\n- Multi-Region Deployments: Reduces container launch latency by pulling from local regional ECR registries.\n- Disaster Recovery (DR): Ensures container images are available in a secondary backup region if a primary region fails.\n- Cross-Account Replication: Automatically syncs images to separate development, staging, or production accounts.',
  keyPoints: [
    'Automatically replicates newly pushed container images across regions or accounts.',
    'Configured globally at the ECR registry level.',
    'Supports repository name prefix filtering.',
    'Reduces container pull latency for multi-region ECS/EKS clusters.',
    'Eliminates cross-region data transfer charges during container deployment.'
  ],
  commonMistake: 'Manually scripting `docker pull`, `docker tag`, and `docker push` commands in CI/CD to copy images to 5 AWS regions instead of enabling native ECR Cross-Region Replication.',
  example: 'Registry Replication Configuration via AWS CLI:\n`aws ecr put-replication-configuration --replication-configuration "rules=[{destinations=[{region=\'eu-west-1\',registryId=\'123456789012\'}]}]"`',
  sources: [
    { title: 'Amazon ECR Cross-Region Replication', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/replication.html' }
  ]
});
