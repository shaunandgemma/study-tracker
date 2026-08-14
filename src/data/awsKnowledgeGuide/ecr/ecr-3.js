import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-3',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Cross-Account Access Policies & Cross-Region Image Replication',
  status: 'ready',
  plainEnglish: 'Amazon ECR supports multi-account and multi-region container distribution through two key capabilities:\n- Cross-Account Access Policies: Resource-based ECR Repository Policies that allow IAM roles or accounts outside the owning account to pull or push container images securely.\n- Cross-Region Image Replication: Automated registry-level replication that automatically copies newly pushed container images to specified destination AWS regions or external destination AWS accounts in near-real-time.',
  whyItMatters: 'Centralizing container image builds in a Shared Services account and replicating them to regional production accounts ensures fast, low-latency container deployment and robust multi-region disaster recovery.',
  workplaceExample: 'An enterprise builds container images in a central CI/CD account (`111111111111`). ECR Cross-Region Replication automatically copies new images to `us-east-1` and `eu-west-1` production accounts (`222222222222`). Local ECS clusters pull images locally in their region with zero cross-region network latency.',
  examFocus: 'SAA-C03 multi-account & multi-region patterns:\n- To grant another AWS account access to pull images from your ECR repo, apply an ECR Repository Policy allowing `ecr:BatchGetImage` and `ecr:GetDownloadUrlForLayer` to that principal.\n- To automatically sync container images across regions or accounts, configure Registry Replication Rules in ECR settings.',
  keyPoints: [
    'Cross-Account Access uses resource-based ECR Repository Policies.',
    'Cross-Region Replication automatically copies pushed images to target regions/accounts.',
    'Reduces image pull latency by storing copies in local regional registries.',
    'Supports filtering replication by repository name prefixes.',
    'Eliminates cross-region network transfer overhead for container deployments.'
  ],
  commonMistake: 'Configuring cross-region replication but forgetting to grant cross-account ECR repository permissions, causing replication to fail when copying across different AWS accounts.',
  example: 'Cross-Account Repository Policy Statement:\n{\n  "Sid": "AllowCrossAccountPull",\n  "Effect": "Allow",\n  "Principal": { "AWS": "arn:aws:iam::222222222222:root" },\n  "Action": ["ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage"]\n}',
  sources: [
    { title: 'Amazon ECR Cross-Region Replication', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/replication.html' }
  ]
});
