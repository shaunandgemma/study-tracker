import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-6',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Private Repositories',
  status: 'ready',
  plainEnglish: 'An ECR Private Repository is an isolated, encrypted container image storage bucket inside your AWS account. Access to push or pull images from a private repository is strictly controlled via AWS IAM policies and ECR Repository Policies. By default, private repository URLs follow the format `AWS_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/REPOSITORY_NAME`.',
  whyItMatters: 'Private Repositories protect corporate intellectual property and proprietary application code. They ensure that containerized microservices can only be accessed by authorized IAM roles and deployment tools within your cloud environment.',
  workplaceExample: 'An online store stores its core checkout microservice image in an ECR Private Repository `123456789012.dkr.ecr.us-east-1.amazonaws.com/checkout-service`. Only the production ECS Task Execution Role is granted IAM permission to pull this image.',
  examFocus: 'SAA-C03 Private Repository Security:\n- Private by default; requires explicit IAM authorization (`aws ecr get-login-password`).\n- Supports KMS encryption (AWS-managed or customer-managed keys).\n- Can be connected privately inside a VPC using AWS PrivateLink (VPC Interface Endpoints) so traffic never traverses the public internet.',
  keyPoints: [
    'Private container image repositories isolated within an AWS account.',
    'Requires IAM authentication for all push and pull actions.',
    'Supports KMS encryption at rest and Tag Immutability.',
    'Integrates with VPC Interface Endpoints for private VPC access.',
    'URI format: `ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/REPO_NAME`.'
  ],
  commonMistake: 'Attempting to pull an image from an ECR Private Repository on an EC2 instance without attaching an IAM Role containing `ecr:BatchGetImage` permissions.',
  example: 'Creating a Private Repository:\n`aws ecr create-repository --repository-name my-secure-app --image-tag-mutability IMMUTABLE --encryption-configuration encryptionType=KMS`',
  sources: [
    { title: 'Amazon ECR Private Repositories', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html' }
  ]
});
