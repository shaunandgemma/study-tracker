import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecr-18',
  topicId: 'topic-ecr',
  topicTitle: 'ECR (Elastic Container Registry)',
  objectiveCode: 'Containers',
  title: 'ECR Enhanced Scanning with Amazon Inspector',
  status: 'ready',
  plainEnglish: 'ECR Enhanced Scanning integrates Amazon ECR with Amazon Inspector to deliver automated, continuous vulnerability scanning for container images. Unlike Basic Scanning (which scans only OS packages once at push time), Enhanced Scanning continuously monitors your container images against newly discovered CVE databases for both operating system packages AND programming language dependency packages (such as Node.js, Python, Java, Go, and Ruby).',
  whyItMatters: 'New zero-day security vulnerabilities (like Log4j) are discovered daily. Enhanced Scanning continuously re-evaluates images already stored in ECR, instantly alerting security teams if a stored container becomes vulnerable months after being pushed.',
  workplaceExample: 'An enterprise activates Enhanced Scanning via Amazon Inspector. A container image built 6 months ago resides in ECR. When a new critical CVE is announced for a Java library contained in that image, Amazon Inspector automatically detects the new vulnerability and notifies Security Hub without requiring a re-push of the image.',
  examFocus: 'SAA-C03 Enhanced vs Basic Scanning comparison:\n- Basic Scanning: Single scan on push; checks OS packages only (Clair).\n- Enhanced Scanning: Continuous scanning; checks OS packages AND programming language packages (Inspector).\n- Integrated with AWS Security Hub and EventBridge for automated remediation.',
  keyPoints: [
    'Integrates Amazon ECR with Amazon Inspector for continuous scanning.',
    'Scans both OS packages and application language dependencies (npm, pip, maven, etc.).',
    'Continuously re-scans images when new CVEs are added to vulnerability databases.',
    'Aggregates security findings in AWS Security Hub.',
    'Allows configuring scan frequency (continuous vs scan-on-push).'
  ],
  commonMistake: 'Believing Basic Scanning will notify you if a new CVE is discovered tomorrow for an image pushed yesterday. Basic Scanning only scans once at push time; Enhanced Scanning is required for continuous monitoring.',
  example: 'Enabling Enhanced Scanning in Registry Settings:\n`aws ecr put-registry-scanning-configuration --scan-type ENHANCED --rules "[{\"rules\":[{\"repositoryFilters\":[{\"filter\":\"*\",\"filterType\":\"WILDCARD\"}],\"scanFrequency\":\"CONTINUOUS\"}]}]"`',
  sources: [
    { title: 'Amazon ECR Enhanced scanning with Amazon Inspector', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning-inspector.html' }
  ]
});
