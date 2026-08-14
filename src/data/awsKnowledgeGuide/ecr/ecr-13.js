import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-13',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Repository Policies',
  status: 'ready',
  plainEnglish: 'An ECR Repository Policy is a resource-based policy attached directly to a specific ECR repository. Unlike identity-based IAM policies (which govern what a user or role can do), repository policies govern WHO (which AWS accounts, IAM roles, or users) can access that specific repository and what actions they can perform.',
  whyItMatters: 'Repository policies enable cross-account image sharing without modifying global IAM permissions. For instance, a central image repository can share a golden base image with multiple external AWS accounts via a single repository policy.',
  workplaceExample: 'A company manages a central DevOps account (`111111111111`) holding base Ubuntu container images. They attach an ECR Repository Policy to `base-ubuntu` granting `ecr:BatchGetImage` rights to Production Account (`222222222222`) and Staging Account (`333333333333`).',
  examFocus: 'SAA-C03 Repository Policy evaluation:\n- ECR permissions evaluate BOTH identity-based IAM policies and resource-based ECR Repository Policies.\n- If an explicit DENY exists in either policy, access is denied.\n- Essential for granting cross-account pull access to ECS/EKS clusters in separate AWS accounts.',
  keyPoints: [
    'Resource-based policy attached directly to an ECR repository.',
    'Controls access for external AWS accounts, IAM users, or IAM roles.',
    'Enables fine-grained cross-account image access control.',
    'Evaluated alongside caller IAM identity policies.',
    'Allows restricting access to specific IP ranges or VPC endpoints using Condition blocks.'
  ],
  commonMistake: 'Forgetting that cross-account access requires granting permissions in BOTH the ECR Repository Policy (resource) and the destination IAM Policy (identity).',
  example: 'Repository Policy JSON:\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Sid": "AllowPullFromProdAccount",\n    "Effect": "Allow",\n    "Principal": { "AWS": "arn:aws:iam::222222222222:root" },\n    "Action": ["ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage"]\n  }]\n}',
  sources: [
    { title: 'Amazon ECR Repository Policies', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policies.html' }
  ]
});
