import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-9',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'Parameter Hierarchies',
  status: 'ready',
  plainEnglish: 'Parameter Hierarchies organize parameters into slash-delimited tree structures (like folder paths in a filesystem), such as `/application/environment/component/parameter` (e.g. `/study-tracker/dev/database/host`). Hierarchies support up to 15 levels of nesting, enabling bulk parameter fetching (`GetParametersByPath`) and path-based IAM security policies.',
  whyItMatters: 'Managing 500 flat, unstructured parameter names across multiple environments creates chaos. Hierarchical naming lets you fetch all configuration settings for an entire environment in a single API call and enforce least-privilege access by environment path.',
  workplaceExample: 'An engineering team structures parameters as `/app/dev/*` and `/app/prod/*`. An IAM policy restricts the development team\'s IAM role to `arn:aws:ssm:us-east-1:123456789012:parameter/app/dev/*`, preventing dev applications from reading production secrets.',
  examFocus: 'SAA-C03 Hierarchy API & IAM Rules:\n- Path Depth: Supports up to 15 levels of hierarchy (e.g., `/a/b/c/d/...`).\n- Bulk Fetch API: `GetParametersByPath` fetches all parameters under a specific path hierarchy (supports `--recursive`).\n- IAM Path Wildcards: IAM policies can use wildcards on ARNs (e.g., `arn:aws:ssm:region:account:parameter/app/dev/*`).',
  keyPoints: [
    'Organizes parameters into slash-delimited tree structures (up to 15 levels deep).',
    'Enables bulk parameter retrieval via the `GetParametersByPath` API call.',
    'Allows granular path-based IAM access policies using wildcard ARNs.',
    'Separates environment configurations logically (e.g. `/dev/`, `/staging/`, `/prod/`).',
    'Simplifies application deployment scripts by namespace grouping.'
  ],
  commonMistake: 'Failing to realize that granting IAM access to `/app/dev/*` allows reading all parameters underneath `/app/dev/`, including sensitive sub-paths like `/app/dev/db/password`.',
  example: 'Fetching All Parameters Under a Hierarchy Path via AWS CLI:\naws ssm get-parameters-by-path --path "/study-tracker/dev/" --recursive --with-decryption',
  sources: [
    { title: 'Organizing parameters into hierarchies', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-param-hierarchy.html' }
  ]
});
