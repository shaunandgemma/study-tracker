import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'insp-1',
  topicId: 'topic-inspector',
  topicTitle: 'Amazon Inspector',
  objectiveCode: 'Security',
  title: 'Continuous Automated CVE Vulnerability Scanning for EC2, ECR Images, & Lambda',
  status: 'ready',
  plainEnglish: 'Amazon Inspector is a vulnerability-management service that discovers supported EC2 instances, ECR container images, and Lambda functions and evaluates them for known software vulnerabilities. Each resource type is handled differently: EC2 package inventory can come from supported agent-based or agentless scanning, ECR enhanced scanning evaluates image packages, and Lambda standard scanning evaluates supported dependencies while optional Lambda code scanning evaluates supported application code.',
  whyItMatters: 'A single vulnerability program can keep evaluating several compute formats as software changes and new vulnerability intelligence becomes available. This reduces one-time scan gaps, but teams still need ownership, prioritization, testing, and deployment processes because Inspector reports problems rather than repairing resources.',
  workplaceExample: 'A platform team enables EC2, ECR, and Lambda scan types in its production accounts. Its triage queue sends an exposed EC2 package finding to the server team, an ECR finding to the image pipeline, and a Lambda dependency finding to the function owner, with each team using a remediation method suited to that resource.',
  examFocus: 'Know both the common purpose and the resource-specific behavior. Inspector is the vulnerability-management choice for supported EC2, ECR, and Lambda workloads; it does not automatically patch them. Do not assume every EC2 scan requires SSM Agent, confuse ECR enhanced scanning with basic scanning, or confuse Lambda standard dependency scanning with Lambda code scanning.',
  keyPoints: [
    'Amazon Inspector continuously manages vulnerability findings for supported AWS compute workloads.',
    'EC2 package scanning can use supported agent-based or agentless collection according to the configured scan mode and resource eligibility.',
    'ECR enhanced scanning is provided by Amazon Inspector and is distinct from ECR basic scanning.',
    'Lambda standard scanning checks supported dependencies in function code and layers.',
    'Lambda code scanning checks supported custom application code where that scan type is available and activated.',
    'Inspector produces prioritized findings; remediation remains an operational responsibility.'
  ],
  commonMistake: 'Enabling all scan types and treating that as automatic remediation leaves vulnerable software in place. Assign each finding to an owner, apply the appropriate update or rebuild, redeploy where required, and confirm that rescanning closes the finding.',
  example: 'For one critical application, verify EC2, ECR, and Lambda coverage separately. Upgrade the affected EC2 package through the approved patch process, rebuild and redeploy an affected container image, and update a vulnerable Lambda dependency; then check that the corresponding Inspector findings close.',
  sources: [
    { title: 'What is Amazon Inspector?', url: 'https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html' },
    { title: 'Scanning Amazon EC2 instances with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-ec2.html' },
    { title: 'Scanning Amazon ECR container images with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-ecr.html' },
    { title: 'Scanning AWS Lambda functions with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-lambda.html' }
  ]
});
