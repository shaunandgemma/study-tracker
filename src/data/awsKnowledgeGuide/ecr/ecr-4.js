import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-4',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Image Tag Immutability & Lifecycle Rules for Old Image Cleanup',
  status: 'ready',
  plainEnglish: 'Amazon ECR provides two essential management controls for maintaining repository security and storage efficiency:\n- Image Tag Immutability: Prevents image tags (such as `v1.0` or `latest`) from being overwritten by subsequent pushes. If a tag is immutable, pushing a new image with an existing tag is rejected.\n- Lifecycle Policies: Automated cleanup rules that automatically delete old, untagged, or outdated container images based on age or image count, keeping storage costs low.',
  whyItMatters: 'Overwriting production tags like `latest` or `v1.0.0` with un-tested code causes production deployment bugs and invalidates rollbacks. Tag Immutability guarantees version integrity. Lifecycle policies prevent registries from growing infinitely and incurring unexpected storage fees.',
  workplaceExample: 'A banking application enables Tag Immutability on its ECR repositories so developers cannot accidentally overwrite production tag `release-2.4.0`. Additionally, they configure a Lifecycle Policy to retain only the 20 most recent tagged images and automatically purge untagged images older than 7 days.',
  examFocus: 'SAA-C03 best practices:\n- Enable Tag Immutability to prevent accidental image overwrites and guarantee deployment reproducibility.\n- Configure ECR Lifecycle Policies to automatically clean up untagged images or old image versions to optimize storage costs.',
  keyPoints: [
    'Tag Immutability prevents overwriting existing image tags in a repository.',
    'Guarantees that a specific tag (e.g. `v1.2.0`) always points to the exact same image digest.',
    'Lifecycle Policies automate the deletion of stale or untagged container images.',
    'Rules can target untagged images by age or tagged images by count/age limit.',
    'Reduces ECR storage costs and prevents registry bloat.'
  ],
  commonMistake: 'Relying on the `latest` tag in mutable repositories for production deployments. If `latest` is overwritten, auto-scaling instances will pull different versions of the container image.',
  example: 'Enabling Tag Immutability via AWS CLI:\n`aws ecr put-image-tag-mutability --repository-name my-prod-app --image-tag-mutability IMMUTABLE`',
  sources: [
    { title: 'Image Tag Mutability in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html' }
  ]
});
