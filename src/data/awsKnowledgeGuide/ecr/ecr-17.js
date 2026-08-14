import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-17',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Image Scanning',
  status: 'ready',
  plainEnglish: 'ECR Image Scanning helps identify software vulnerabilities in your container images. ECR analyzes image layers for known Common Vulnerabilities and Exposures (CVEs). You can configure scanning to run automatically whenever an image is pushed to a repository (`scanOnPush=true`) or execute scans manually via AWS CLI or Management Console.',
  whyItMatters: 'Scanning images before deployment prevents pushing containers with known software exploits (such as outdated OpenSSL libraries or unpatched Linux kernels) into production environments.',
  workplaceExample: 'A security-conscious engineering team enables `scanOnPush` on all ECR repositories. When a developer pushes an image, ECR runs a scan within minutes and flags 2 HIGH severity CVEs. An automated EventBridge rule sends a Slack notification to the developer to update the base image.',
  examFocus: 'SAA-C03 Image Scanning details:\n- `scanOnPush=true`: Automatically triggers a scan upon image upload.\n- Basic Scanning: Uses open-source Clair database to scan OS packages.\n- Scanning results emit Amazon EventBridge events (`ECR Image Scan`), enabling automated responses (e.g. Lambda function blocking deployment).',
  keyPoints: [
    'Scans container image layers for Common Vulnerabilities and Exposures (CVEs).',
    'Supports automatic scanning on push (`scanOnPush=true`) and manual scans.',
    'Provides vulnerability severity ratings (CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL).',
    'Emits EventBridge notifications upon scan completion.',
    'Helps maintain DevSecOps security compliance.'
  ],
  commonMistake: 'Pushing container images without `scanOnPush` enabled and assuming ECR automatically scans images by default.',
  example: 'Starting a Manual Image Scan via CLI:\n`aws ecr start-image-scan --repository-name my-app --image-id imageTag=latest`',
  sources: [
    { title: 'Image Scanning in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html' }
  ]
});
