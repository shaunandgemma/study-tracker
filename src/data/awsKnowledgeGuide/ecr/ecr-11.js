import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-11',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Authentication',
  status: 'ready',
  plainEnglish: 'ECR Authentication is the security process of verifying your identity before you can interact with an ECR Private Repository. To push or pull container images using the Docker CLI, you must authenticate by obtaining a temporary authorization token from AWS using the `aws ecr get-login-password` command. This token is valid for 12 hours.',
  whyItMatters: 'Docker CLI does not natively understand AWS IAM credentials. The `get-login-password` command bridges this gap by converting AWS IAM credentials into a temporary 12-hour authorization password compatible with standard `docker login` commands.',
  workplaceExample: 'A DevOps engineer logs into ECR on a build server before pushing a new container image by executing:\n`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com`.',
  examFocus: 'SAA-C03 ECR Authentication rules:\n- `aws ecr get-login-password`: Obtains a 12-hour temporary password for Docker CLI login.\n- Requires `ecr:GetAuthorizationToken` IAM permission.\n- Managed services (ECS, EKS, AWS Lambda) handle authentication automatically when using an Execution Role with the `AmazonEC2ContainerRegistryReadOnly` policy.',
  keyPoints: [
    'Temporary authorization token valid for 12 hours.',
    'Obtained via `aws ecr get-login-password` command.',
    'Passed to Docker CLI via `docker login --username AWS --password-stdin`.',
    'Requires `ecr:GetAuthorizationToken` permission in IAM.',
    'Automated implicitly for ECS/EKS/Lambda using Task Execution Roles.'
  ],
  commonMistake: 'Hardcoding static AWS Access Keys in Docker configuration files for authentication instead of obtaining temporary 12-hour login tokens via AWS CLI or IAM roles.',
  example: 'Logging into ECR via AWS CLI:\n`aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com`',
  sources: [
    { title: 'Private registry authentication in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html' }
  ]
});
