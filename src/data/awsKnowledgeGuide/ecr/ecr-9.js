import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-9',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Image Tags',
  status: 'ready',
  plainEnglish: 'ECR Image Tags are human-readable labels (such as `v1.0.0`, `staging`, `latest`, or a git commit hash `git-a1b2c3d`) assigned to container images stored in an ECR repository. Tags provide friendly aliases for referencing specific image versions during container deployment.',
  whyItMatters: 'Using structured tagging conventions (like Semantic Versioning `1.2.3` or Git commit hashes) allows CI/CD deployment pipelines to deploy specific, auditable code versions to ECS or EKS.',
  workplaceExample: 'A CI/CD pipeline builds a container image upon git push and tags it with both the Git commit hash `git-8f3a12` and the release version `v2.1.0`. The deployment tool uses `v2.1.0` to launch the task on AWS Fargate.',
  examFocus: 'SAA-C03 Image Tag behavior:\n- Mutable Tags (Default): An existing tag can be overwritten by pushing a new image with the same tag.\n- Immutable Tags: Pushing an image with an existing tag returns an error (`ImageTagAlreadyExistsException`), preventing accidental overwrites.\n- Untagged Images: Images whose tags have been removed or moved to newer images; subject to Lifecycle Policy cleanup.',
  keyPoints: [
    'Human-readable labels assigned to container images (e.g., `latest`, `v1.0`).',
    'Multiple tags can point to the same image digest.',
    'Tag Mutability setting determines whether tags can be overwritten.',
    'Untagged images retain their SHA-256 digest until cleaned up by Lifecycle Policies.',
    'Semantic versioning or Git commit SHA tagging is best practice for production.'
  ],
  commonMistake: 'Deploying containers in production using the `latest` tag. If `latest` is overwritten by an untested push, new instances will pull the wrong code.',
  example: 'Tagging an Image during Docker Push:\n`docker tag my-app:local 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.2.0`\n`docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:v1.2.0`',
  sources: [
    { title: 'Image Tag Mutability in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html' }
  ]
});
