import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-2',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Image Vulnerability Scanning (Basic via Clair vs Enhanced via Amazon Inspector)',
  status: 'ready',
  plainEnglish: 'Amazon ECR offers two tiers of image vulnerability scanning:\n- Basic Scanning: Uses the open-source Clair engine to scan images for known operating system vulnerabilities. Scans can be triggered manually or configured to scan automatically on image push (`scanOnPush=true`).\n- Enhanced Scanning: Integrates directly with Amazon Inspector to continuously scan container images for both operating system AND programming language package vulnerabilities (e.g., Python, Node.js, Java) automatically as long as images remain in the registry.',
  whyItMatters: 'Container images often include outdated Linux packages or third-party open-source libraries containing known CVE security flaws. Automated scanning identifies vulnerabilities before non-compliant containers are deployed to production.',
  workplaceExample: 'A DevSecOps team enables Enhanced Scanning via Amazon Inspector on their ECR registry. When a developer pushes a Docker image containing a vulnerable version of `log4j` or `openssl`, Amazon Inspector immediately flags the CVE and blocks the CI/CD pipeline from deploying the image to EKS.',
  examFocus: 'SAA-C03 comparison rules:\n- Basic Scanning (Clair): Free, static scan on push or manual trigger; checks OS-level vulnerabilities only.\n- Enhanced Scanning (Amazon Inspector): Paid, continuous automated scanning; checks OS-level AND application language dependencies (npm, pip, maven, etc.).',
  keyPoints: [
    'Basic Scanning (Clair) scans OS vulnerabilities on push or manually.',
    'Enhanced Scanning (Inspector) provides continuous scanning for OS and programming packages.',
    'Findings are categorized by severity (CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL).',
    'Scan results can trigger EventBridge rules for automated alert notifications.',
    'Can be configured to scan automatically upon every image push (`scanOnPush`).'
  ],
  commonMistake: 'Relying on Basic Scanning to detect vulnerable Node.js (npm) or Python (pip) packages. Basic scanning only inspects OS-level RPM/Debian packages; Enhanced Scanning via Amazon Inspector is required for language libraries.',
  example: 'Enabling Scan on Push via AWS CLI:\n`aws ecr put-image-scanning-configuration --repository-name my-app-repo --image-scanning-configuration scanOnPush=true`',
  sources: [
    { title: 'Image Scanning in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html' }
  ]
});
