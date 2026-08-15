import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-5',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Management Account',
  status: 'ready',
  plainEnglish: 'The Management Account (formerly known as the Payer Account) is the primary AWS account used to create and administer an organization in AWS Organizations. It pays all charges incurred across all member accounts, manages the organization structure, attaches policies, enables trusted AWS service integrations, and delegates administrative responsibilities.',
  whyItMatters: 'The Management Account possesses ultimate control over the entire multi-account environment. Securing the Management Account and restricting access to administrative personnel is critical to preventing unauthorized organization-wide modifications.',
  workplaceExample: 'An enterprise designates a dedicated Management Account for billing and organization administration. Following AWS security best practices, they do NOT run application servers, databases, or S3 buckets inside the Management Account.',
  examFocus: 'SAA-C03 Management Account Security Rules:\n- No Workload Execution: Never host operational production or development workloads inside the Management Account.\n- Unrestricted by SCPs: Service Control Policies (SCPs) attached to the root or OUs do NOT restrict the Management Account.\n- Delegated Administration: Delegate management of AWS services (GuardDuty, Security Hub, Config) to member accounts to avoid using the Management Account.\n- Root User Protection: Secure the Management Account root user with hardware MFA.',
  keyPoints: [
    'Primary account that creates and governs the AWS Organization.',
    'Acts as the Payer Account for Consolidated Billing across all member accounts.',
    'Exempt from Service Control Policies (SCPs) applied to the organization hierarchy.',
    'Must be restricted from running operational application workloads.',
    'Supports delegating administrative tasks for security services to member accounts.'
  ],
  commonMistake: 'Deploying EC2 application workloads or running day-to-day development inside the Management Account, risking organization-wide security exposure.',
  example: 'Viewing Management Account Details via AWS CLI:\naws organizations describe-organization',
  sources: [
    { title: 'AWS Organizations Management Account', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html#account' }
  ]
});
