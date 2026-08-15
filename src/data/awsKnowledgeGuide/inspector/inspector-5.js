import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'inspector-5',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Amazon ECR Container Image Scanning',
  status: 'ready',
  plainEnglish: 'Amazon ECR can use basic scanning or enhanced scanning. Basic scanning is an ECR capability, while enhanced scanning is integrated with Amazon Inspector and can evaluate vulnerable operating system and programming-language packages with scan-on-push or continuous behavior according to the ECR registry configuration. Findings apply to stored image digests; changing an image does not change containers already running from an older digest.',
  whyItMatters: 'Container remediation must flow through the software supply chain. Teams need to identify the vulnerable image, rebuild it with corrected dependencies or base layers, push the replacement, and redeploy workloads so runtime containers actually use the repaired image.',
  workplaceExample: 'Enhanced scanning reports a vulnerable package in the image used by an ECS service. The application team updates the base image, rebuilds and tests the artifact, pushes a new immutable digest, updates the task definition, and rolls out new tasks before retiring the affected digest.',
  examFocus: 'Basic and enhanced ECR scanning are not synonyms. Enhanced scanning uses Inspector and supports Inspector findings and integrations; scan frequency and repository scope are configured in ECR. Updating or retagging an ECR image does not update existing containers, so remediation normally requires rebuild and redeployment.',
  keyPoints: [
    'ECR basic scanning is provided by ECR; enhanced scanning is provided through Amazon Inspector.',
    'Enhanced scanning can detect supported operating system and programming-language package vulnerabilities.',
    'ECR registry scan configuration selects repository scope and continuous or scan-on-push behavior.',
    'Inspector findings for enhanced scanning can be viewed with image context and used by supported integrations.',
    'A new image digest does not alter containers that are already running from an older image.',
    'Container remediation normally means rebuilding, testing, pushing, and redeploying the image.'
  ],
  commonMistake: 'Pushing a corrected image under the same tag and assuming the fleet is fixed leaves old tasks or pods running the vulnerable digest. Trigger a controlled deployment and verify the running workload digests as well as the new image findings.',
  example: 'Trace an ECR finding to its image digest and affected package, update the dependency or base layer in source, and build a replacement image. After enhanced scanning evaluates it, deploy that digest to the workload and confirm no running container still references the affected digest.',
  sources: [
    { title: 'Scanning Amazon ECR container images with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-ecr.html' },
    { title: 'Amazon Inspector integration with Amazon ECR', url: 'https://docs.aws.amazon.com/inspector/latest/user/ecr-integration.html' },
    { title: 'Image scanning in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html' },
    { title: 'Enhanced scanning in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning-enhanced.html' }
  ]
});
