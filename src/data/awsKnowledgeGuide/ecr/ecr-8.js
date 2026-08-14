import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-8',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Container Images',
  status: 'ready',
  plainEnglish: 'An ECR Container Image is a packaged software file stored in Amazon ECR that contains everything needed to run an application: code, runtime, system libraries, environment variables, and configuration files. Images are stored in ECR as a manifest alongside immutable filesystem layers.',
  whyItMatters: 'Container images encapsulate application dependencies, ensuring that code runs identically across developer laptops, staging servers, and production ECS/EKS clusters.',
  workplaceExample: 'A developer packages a Python FastAPI application into a Docker container image. Pushing the image to ECR guarantees that AWS Fargate runs the exact same Python version and dependencies that passed local testing.',
  examFocus: 'SAA-C03 Container Image fundamentals:\n- Images consist of independent read-only filesystem layers.\n- ECR stores image layers in Amazon S3 for high durability.\n- Uniquely identified by an immutable SHA-256 Digest (e.g. `sha256:1a2b3c...`).\n- Supports multi-architecture images (e.g., ARM64 for Graviton and x86_64 for Intel/AMD in a single manifest list).',
  keyPoints: [
    'Packaged software binary containing application code, runtime, and libraries.',
    'Identified by a unique, immutable SHA-256 image digest.',
    'Layers stored in Amazon S3 for 11 9s durability.',
    'Supports multi-architecture image manifests (ARM64 & x86_64).',
    'Supports Docker V2 and OCI (Open Container Initiative) image specifications.'
  ],
  commonMistake: 'Relying solely on image tags to identify container versions instead of SHA-256 digests. Tags can be reassigned unless Tag Immutability is enabled, whereas digests are permanently immutable.',
  example: 'Inspecting Container Image Digest in ECR:\n`aws ecr describe-images --repository-name my-app`\nOutput: `"imageDigest": "sha256:456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"`',
  sources: [
    { title: 'Amazon ECR Container Images', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html' }
  ]
});
